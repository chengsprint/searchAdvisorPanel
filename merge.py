#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from copy import deepcopy
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple


SOURCE_HTML_RE = re.compile(
    r"^searchadvisor-(?P<account>.+)-(?P<date>\d{8})-(?P<time>\d{6})\.html$"
)
MERGED_HTML_RE = re.compile(r"^searchadvisor-MERGED-(?P<month>\d{6})\.html$")
PAYLOAD_TOKENS = (
    "const EXPORT_PAYLOAD_RAW =",
    "window.EXPORT_PAYLOAD =",
    "const EXPORT_PAYLOAD =",
    "EXPORT_PAYLOAD =",
)


@dataclass(frozen=True)
class SourceHtmlFile:
    account_key: str
    stamp: str
    path: Path

    @property
    def month_key(self) -> str:
        return self.stamp[:6]

    @property
    def stamp_human(self) -> str:
        return f"{self.stamp[:8]}-{self.stamp[8:]}"


@dataclass
class ParsedSnapshot:
    source_file: SourceHtmlFile
    payload: Dict[str, Any]
    source_state: Dict[str, Any]
    template_html: str


def log(message: str) -> None:
    print(message)


def parse_source_html_filename(path: Path) -> Optional[SourceHtmlFile]:
    match = SOURCE_HTML_RE.match(path.name)
    if not match:
        return None
    stamp = f"{match.group('date')}{match.group('time')}"
    return SourceHtmlFile(account_key=match.group("account"), stamp=stamp, path=path)


def list_source_html_files(directory: Path) -> List[SourceHtmlFile]:
    result: List[SourceHtmlFile] = []
    for path in sorted(directory.glob("searchadvisor-*.html")):
        if MERGED_HTML_RE.match(path.name):
            continue
        parsed = parse_source_html_filename(path)
        if parsed:
            result.append(parsed)
    return result


def select_latest_html_by_account(files: Iterable[SourceHtmlFile]) -> Dict[str, SourceHtmlFile]:
    latest: Dict[str, SourceHtmlFile] = {}
    for item in files:
        current = latest.get(item.account_key)
        if current is None or (item.stamp, item.path.name) > (current.stamp, current.path.name):
            latest[item.account_key] = item
    return latest


def find_matching_json_end(text: str, start_idx: int) -> int:
    depth = 0
    in_string = False
    escaped = False
    for idx in range(start_idx, len(text)):
        ch = text[idx]
        if in_string:
            if escaped:
                escaped = False
                continue
            if ch == "\\":
                escaped = True
                continue
            if ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
            continue
        if ch == "{":
            depth += 1
            continue
        if ch == "}":
            depth -= 1
            if depth == 0:
                return idx
    raise ValueError("JSON object boundary not found")


def extract_assigned_json(text: str, token: str) -> Optional[Dict[str, Any]]:
    token_idx = text.find(token)
    if token_idx < 0:
        return None
    start_idx = text.find("{", token_idx)
    if start_idx < 0:
        return None
    end_idx = find_matching_json_end(text, start_idx)
    return json.loads(text[start_idx : end_idx + 1])


def extract_payload_from_html_text(text: str) -> Dict[str, Any]:
    for token in PAYLOAD_TOKENS:
        try:
            payload = extract_assigned_json(text, token)
        except Exception:
            payload = None
        if isinstance(payload, dict):
            return payload
    raise ValueError("supported EXPORT_PAYLOAD marker not found")


def find_payload_assignment_range(text: str) -> Tuple[str, int, int]:
    for token in PAYLOAD_TOKENS:
        token_idx = text.find(token)
        if token_idx < 0:
            continue
        start_idx = text.find("{", token_idx)
        if start_idx < 0:
            continue
        end_idx = find_matching_json_end(text, start_idx)
        return token, start_idx, end_idx
    raise ValueError("SADV payload marker not found in template html")


def extract_snapshot_source_state(payload: Dict[str, Any]) -> Dict[str, Any]:
    if isinstance(payload.get("__meta"), dict) and isinstance(payload.get("accounts"), dict):
        accounts = payload.get("accounts") or {}
        account_keys = [key for key in accounts.keys() if key]
        primary_key = account_keys[0] if account_keys else ""
        primary_account = accounts.get(primary_key) or {}
        return {
            "savedAt": payload.get("__meta", {}).get("savedAt"),
            "accountLabel": primary_key or "",
            "accountEncId": primary_account.get("encId") or "unknown",
            "generatorVersion": payload.get("__meta", {}).get("generatorVersion") or "unknown",
            "allSites": list(primary_account.get("sites") or []),
            "summaryRows": list(payload.get("summaryRows") or []),
            "dataBySite": dict(primary_account.get("dataBySite") or {}),
            "siteMeta": dict(primary_account.get("siteMeta") or {}),
            "mergedMeta": payload.get("mergedMeta"),
            "curMode": payload.get("ui", {}).get("curMode") or "all",
            "curSite": payload.get("ui", {}).get("curSite"),
            "curTab": payload.get("ui", {}).get("curTab") or "overview",
            "allSitesPeriodDays": payload.get("ui", {}).get("allSitesPeriodDays", 90),
            "accounts": payload.get("accounts") or {},
        }
    return {
        "savedAt": payload.get("savedAt"),
        "accountLabel": payload.get("accountLabel") or "",
        "accountEncId": payload.get("accountEncId") or payload.get("encId") or "unknown",
        "generatorVersion": payload.get("generatorVersion")
        or payload.get("__meta", {}).get("generatorVersion")
        or "unknown",
        "allSites": list(payload.get("allSites") or []),
        "summaryRows": list(payload.get("summaryRows") or []),
        "dataBySite": dict(payload.get("dataBySite") or {}),
        "siteMeta": dict(payload.get("siteMeta") or {}),
        "mergedMeta": payload.get("mergedMeta"),
        "curMode": payload.get("curMode") or "all",
        "curSite": payload.get("curSite"),
        "curTab": payload.get("curTab") or "overview",
        "allSitesPeriodDays": payload.get("allSitesPeriodDays", 90),
        "accounts": payload.get("accounts") or {},
    }


def parse_html_snapshot(source_file: SourceHtmlFile) -> ParsedSnapshot:
    text = source_file.path.read_text(encoding="utf-8")
    payload = extract_payload_from_html_text(text)
    source_state = extract_snapshot_source_state(payload)
    return ParsedSnapshot(
        source_file=source_file,
        payload=payload,
        source_state=source_state,
        template_html=text,
    )


def collect_all_candidate_sites(state: Dict[str, Any]) -> List[str]:
    candidates: List[str] = []
    seen = set()
    for site in state.get("allSites") or []:
        if site and site not in seen:
            seen.add(site)
            candidates.append(site)
    for row in state.get("summaryRows") or []:
        site = row.get("site") if isinstance(row, dict) else None
        if site and site not in seen:
            seen.add(site)
            candidates.append(site)
    for mapping in (state.get("dataBySite") or {}, state.get("siteMeta") or {}):
        for site in mapping.keys():
            if site and site not in seen:
                seen.add(site)
                candidates.append(site)
    return candidates


def choose_site_winners(entries: List[ParsedSnapshot]) -> Dict[str, ParsedSnapshot]:
    winners: Dict[str, ParsedSnapshot] = {}
    for entry in entries:
        for site in collect_all_candidate_sites(entry.source_state):
            current = winners.get(site)
            if current is None or (
                entry.source_file.stamp,
                entry.source_file.account_key,
            ) > (
                current.source_file.stamp,
                current.source_file.account_key,
            ):
                winners[site] = entry
    return winners


def build_summary_row_map(rows: Iterable[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    mapped: Dict[str, Dict[str, Any]] = {}
    for row in rows:
        if not isinstance(row, dict):
            continue
        site = row.get("site")
        if isinstance(site, str) and site and site not in mapped:
            mapped[site] = row
    return mapped


def build_retained_accounts(
    entries: List[ParsedSnapshot], winners: Dict[str, ParsedSnapshot]
) -> Tuple[Dict[str, Any], List[Dict[str, Any]], Dict[str, str], Dict[str, str]]:
    grouped_sites: Dict[str, List[str]] = {entry.source_file.account_key: [] for entry in entries}
    for site, winner in winners.items():
        grouped_sites.setdefault(winner.source_file.account_key, []).append(site)

    accounts_payload: Dict[str, Any] = {}
    merged_accounts: List[Dict[str, Any]] = []
    selected_files_by_id: Dict[str, str] = {}
    selected_dates_by_id: Dict[str, str] = {}

    for entry in entries:
        account_key = entry.source_file.account_key
        retained_sites = grouped_sites.get(account_key) or []
        state = entry.source_state
        display_label = state.get("accountLabel") or account_key
        enc_id = state.get("accountEncId") or ""
        source_data_by_site = state.get("dataBySite") or {}
        source_site_meta = state.get("siteMeta") or {}
        accounts_payload[account_key] = {
            "accountLabel": display_label,
            "encId": enc_id,
            "sites": retained_sites,
            "siteMeta": {site: deepcopy(source_site_meta.get(site, {})) for site in retained_sites},
            "dataBySite": {site: deepcopy(source_data_by_site.get(site, {})) for site in retained_sites},
        }
        merged_accounts.append(
            {
                "id": account_key,
                "label": display_label,
                "encId": enc_id,
                "fileName": entry.source_file.path.name,
                "selectedAt": f"{entry.source_file.stamp[:8]}-{entry.source_file.stamp[8:]}",
                "siteCount": len(retained_sites),
            }
        )
        selected_files_by_id[account_key] = entry.source_file.path.name
        selected_dates_by_id[account_key] = f"{entry.source_file.stamp[:8]}-{entry.source_file.stamp[8:]}"
    return accounts_payload, merged_accounts, selected_files_by_id, selected_dates_by_id


def merge_payloads(entries: List[ParsedSnapshot], target_month: str) -> Dict[str, Any]:
    if not entries:
        raise ValueError("no readable snapshots selected for merge")

    winners = choose_site_winners(entries)
    row_maps = {
        entry.source_file.account_key: build_summary_row_map(entry.source_state.get("summaryRows") or [])
        for entry in entries
    }

    merged_rows: List[Dict[str, Any]] = []
    seen_sites = set()
    ordered_entries = sorted(
        entries,
        key=lambda item: (item.source_file.stamp, item.source_file.account_key),
        reverse=True,
    )
    for entry in ordered_entries:
        row_map = row_maps.get(entry.source_file.account_key) or {}
        for row in entry.source_state.get("summaryRows") or []:
            if not isinstance(row, dict):
                continue
            site = row.get("site")
            if not isinstance(site, str) or not site or site in seen_sites:
                continue
            if winners.get(site) is not entry:
                continue
            merged_rows.append(deepcopy(row))
            seen_sites.add(site)

    for site, winner in sorted(winners.items()):
        if site in seen_sites:
            continue
        row = (row_maps.get(winner.source_file.account_key) or {}).get(site)
        if row:
            merged_rows.append(deepcopy(row))
            seen_sites.add(site)
            continue
        merged_rows.append(
            {
                "site": site,
                "siteLabel": site,
                "accountLabel": winner.source_state.get("accountLabel") or winner.source_file.account_key,
            }
        )
        seen_sites.add(site)

    merged_data_by_site: Dict[str, Any] = {}
    merged_site_meta: Dict[str, Any] = {}
    for site, winner in winners.items():
        merged_data_by_site[site] = deepcopy((winner.source_state.get("dataBySite") or {}).get(site, {}))
        merged_site_meta[site] = deepcopy((winner.source_state.get("siteMeta") or {}).get(site, {}))

    accounts_payload, merged_accounts, selected_files_by_id, selected_dates_by_id = build_retained_accounts(
        entries,
        winners,
    )

    period_days_candidates = []
    for entry in entries:
        value = entry.source_state.get("allSitesPeriodDays")
        if isinstance(value, int):
            period_days_candidates.append(value)
    saved_at_iso = datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    merged_meta = {
        "isMerged": True,
        "generatedBy": "merge.py",
        "xlsxAllowed": True,
        "mergedAt": saved_at_iso,
        "targetDate": target_month,
        "sourceCount": len(entries),
        "naverIds": [entry.source_file.account_key for entry in entries],
        "fileNames": [entry.source_file.path.name for entry in entries],
        "accounts": merged_accounts,
        "selectedFilesById": selected_files_by_id,
        "selectedDatesById": selected_dates_by_id,
        "strategyUsed": "newer-filename",
        "siteCount": len(merged_rows),
    }

    merged_payload = {
        "savedAt": saved_at_iso,
        "accountLabel": "MERGED",
        "accountEncId": "merged",
        "generatorVersion": "merge.py",
        "exportFormat": "snapshot-merged",
        "allSites": [row.get("site") for row in merged_rows if isinstance(row, dict) and row.get("site")],
        "summaryRows": merged_rows,
        "dataBySite": merged_data_by_site,
        "siteMeta": merged_site_meta,
        "mergedMeta": merged_meta,
        "allSitesPeriodDays": max(period_days_candidates) if period_days_candidates else 90,
        "curMode": "all",
        "curSite": None,
        "curTab": "overview",
        "stats": {
            "success": len(merged_rows),
            "partial": 0,
            "failed": 0,
            "errors": [],
        },
        # __meta + accounts 쌍을 동시에 주면 offline shell이 v2 primary-account 규칙으로 다시 해석한다.
        # 여기서는 top-level legacy payload가 정본이므로, accounts는 xlsx fallback/출처 보강용 보조 필드로만 둔다.
        "accounts": accounts_payload,
    }
    return merged_payload


def format_saved_label(saved_at_iso: str) -> str:
    try:
        dt = datetime.fromisoformat(saved_at_iso.replace("Z", "+00:00"))
    except Exception:
        dt = datetime.now(UTC)
    return dt.strftime("%Y.%m.%d %H:%M:%S")


def replace_first_saved_chip(html: str, saved_label: str) -> str:
    marker = ">Saved "
    marker_idx = html.find(marker)
    if marker_idx < 0:
        return html
    start_idx = html.rfind("<div", 0, marker_idx)
    end_idx = html.find("</div>", marker_idx)
    if start_idx < 0 or end_idx < 0:
        return html
    end_idx += len("</div>")
    original = html[start_idx:end_idx]
    updated = re.sub(r">Saved [^<]+<", f">Saved {saved_label}<", original, count=1)
    xlsx_button = (
        '<div class="sadv-header-actions">'
        '<button id="sadv-xlsx-btn" data-output-format="xlsx" class="sadv-btn" '
        'title="병합 데이터 엑셀 저장" '
        'style="display:inline-flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap;flex-shrink:0;min-width:74px">엑셀</button>'
        f"{updated}"
        "</div>"
    )
    return html[:start_idx] + xlsx_button + html[end_idx:]


def replace_payload_raw(html: str, payload: Dict[str, Any]) -> str:
    _token, start_idx, end_idx = find_payload_assignment_range(html)
    replacement = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    return html[:start_idx] + replacement + html[end_idx + 1 :]


def build_merged_html(template_html: str, payload: Dict[str, Any]) -> str:
    html = replace_payload_raw(template_html, payload)
    html = replace_first_saved_chip(html, format_saved_label(payload.get("savedAt") or ""))
    return html


def is_xlsx_capable_saved_template(html: str) -> bool:
    return "downloadSnapshotXlsx" in html or "canXlsxSave" in html


def cleanup_html_files(
    directory: Path,
    selected_latest: Dict[str, SourceHtmlFile],
    merged_output_path: Optional[Path],
) -> Tuple[int, List[str], List[str]]:
    keep: set[Path] = {item.path.resolve() for item in selected_latest.values()}
    for merged_path in directory.glob("searchadvisor-MERGED-*.html"):
        keep.add(merged_path.resolve())
    if merged_output_path is not None:
        keep.add(merged_output_path.resolve())

    removed: List[str] = []
    failed: List[str] = []
    for candidate in sorted(directory.glob("searchadvisor-*.html")):
        resolved = candidate.resolve()
        if resolved in keep:
            continue
        if MERGED_HTML_RE.match(candidate.name):
            continue
        if parse_source_html_filename(candidate) is None:
            continue
        try:
            candidate.unlink(missing_ok=True)
            removed.append(candidate.name)
        except Exception:
            failed.append(candidate.name)
    return len(removed), removed, failed


def merge_current_directory(directory: Path) -> int:
    source_files = list_source_html_files(directory)
    if not source_files:
        log("⚠️ 병합할 source HTML이 없습니다.")
        return 0

    latest_by_account = select_latest_html_by_account(source_files)
    selected = sorted(latest_by_account.values(), key=lambda item: (item.account_key, item.stamp))
    log(f"📂 source HTML {len(source_files)}개 발견")
    log(f"✅ 계정별 최신 HTML {len(selected)}개 선택")
    for item in selected:
        log(f"  - {item.account_key}: {item.path.name}")

    readable_entries: List[ParsedSnapshot] = []
    for item in selected:
        try:
            readable_entries.append(parse_html_snapshot(item))
        except Exception as exc:
            log(f"  ⚠️ 읽기 실패, 건너뜀: {item.path.name} ({exc})")

    merged_output_path: Optional[Path] = None
    if readable_entries:
        target_month = max(entry.source_file.month_key for entry in readable_entries)
        merged_payload = merge_payloads(readable_entries, target_month=target_month)
        xlsx_capable_entries = [
            entry for entry in readable_entries if is_xlsx_capable_saved_template(entry.template_html)
        ]
        template_entry = max(
            xlsx_capable_entries or readable_entries,
            key=lambda item: (item.source_file.stamp, item.source_file.account_key),
        )
        if not xlsx_capable_entries:
            log(
                "  ⚠️ 선택된 최신 HTML이 모두 구형 saved template이라 merged HTML에서 엑셀 버튼 동작은 best-effort일 수 있습니다."
            )
        merged_html = build_merged_html(template_entry.template_html, merged_payload)
        merged_output_path = directory / f"searchadvisor-MERGED-{target_month}.html"
        merged_output_path.write_text(merged_html, encoding="utf-8")
        log(f"✅ 병합 HTML 생성: {merged_output_path.name}")
        log(f"   - 입력 계정 수: {len(readable_entries)}")
        log(f"   - 병합 사이트 수: {len(merged_payload.get('allSites') or [])}")
    else:
        log("⚠️ 읽을 수 있는 최신 HTML이 없어 merged HTML 생성은 건너뜁니다.")

    removed_count, removed_files, failed_files = cleanup_html_files(
        directory,
        latest_by_account,
        merged_output_path,
    )
    log(f"🧹 정리 완료: 오래된 HTML {removed_count}개 제거")
    for name in removed_files:
        log(f"  - removed: {name}")
    for name in failed_files:
        log(f"  ⚠️ 삭제 실패, 보존됨: {name}")
    return 0


def main() -> int:
    cwd = Path.cwd()
    try:
        return merge_current_directory(cwd)
    except Exception as exc:
        log(f"❌ merge.py 실행 실패: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
