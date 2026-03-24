#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from copy import deepcopy
from dataclasses import dataclass
from datetime import UTC, datetime
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple
from urllib.error import URLError
from urllib.request import urlopen


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
MERGED_TEMPLATE_HELPERS = (
    "getSnapshotSaveRuntimeType",
    "getSnapshotMergedMetaHint",
    "isSavedMergedSnapshotRuntime",
    "canManualXlsxExportInCurrentRuntime",
    "buildSnapshotManualXlsxExecutionOptions",
    "bindSnapshotManualXlsxButton",
    "formatSnapshotMergedXlsxCompatStamp",
    "buildSnapshotMergedXlsxCompatFileName",
    "triggerSnapshotMergedXlsxCompatDownload",
    "downloadMergedSnapshotXlsxCompat",
    "createMergedAccountsInfo",
)
MERGED_HEADER_SHELL_HELPERS = (
    "normalizeHeaderActionShell",
)
DEFAULT_SOURCE_REF = "release"
_CURRENT_SOURCE_REF = DEFAULT_SOURCE_REF


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


def get_source_ref() -> str:
    return _CURRENT_SOURCE_REF


def set_source_ref(ref: Optional[str]) -> str:
    global _CURRENT_SOURCE_REF
    next_ref = (ref or DEFAULT_SOURCE_REF).strip() or DEFAULT_SOURCE_REF
    _CURRENT_SOURCE_REF = next_ref
    load_merge_source_text_with_fallback.cache_clear()
    return _CURRENT_SOURCE_REF


def build_remote_source_url(relative_path: str) -> str:
    return (
        "https://raw.githubusercontent.com/chengsprint/searchAdvisorPanel/"
        + get_source_ref()
        + "/"
        + relative_path
    )


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


def build_snapshot_shell_state(payload: Dict[str, Any]) -> Dict[str, Any]:
    all_sites = payload.get("allSites") if isinstance(payload.get("allSites"), list) else []
    rows = payload.get("summaryRows") if isinstance(payload.get("summaryRows"), list) else []
    site_meta = payload.get("siteMeta") if isinstance(payload.get("siteMeta"), dict) else {}
    data_by_site = payload.get("dataBySite") if isinstance(payload.get("dataBySite"), dict) else {}
    cache_saved_at_values: List[int] = []
    for site in all_sites:
        if not isinstance(site, str):
            continue
        site_data = data_by_site.get(site)
        if not isinstance(site_data, dict):
            continue
        cache_saved_at = site_data.get("__cacheSavedAt")
        if isinstance(cache_saved_at, int):
            cache_saved_at_values.append(cache_saved_at)

    saved_at = payload.get("savedAt")
    updated_at: Optional[str] = None
    if cache_saved_at_values:
        updated_at = (
            datetime.fromtimestamp(max(cache_saved_at_values) / 1000, tz=UTC)
            .replace(microsecond=0)
            .isoformat()
            .replace("+00:00", "Z")
        )
    elif isinstance(saved_at, str) and saved_at:
        updated_at = saved_at

    cur_site = payload.get("curSite")
    if not isinstance(cur_site, str) or not cur_site:
        cur_site = next((site for site in all_sites if isinstance(site, str) and site), None)

    return {
        "accountLabel": payload.get("accountLabel") or "",
        "allSites": all_sites,
        "rows": rows,
        "siteMeta": site_meta,
        "mergedMeta": payload.get("mergedMeta") if "mergedMeta" in payload else None,
        "curMode": "site" if payload.get("curMode") == "site" else "all",
        "curSite": cur_site,
        "curTab": payload.get("curTab") or "overview",
        "allSitesPeriodDays": payload.get("allSitesPeriodDays", 90),
        "runtimeVersion": payload.get("generatorVersion") or "snapshot",
        "cacheMeta": {
            "label": "snapshot",
            "updatedAt": updated_at,
            "remainingMs": None,
            "sourceCount": len(all_sites),
            "measuredAt": int(datetime.now(UTC).timestamp() * 1000),
        }
        if updated_at
        else None,
    }


def replace_snapshot_shell_state(html: str, shell_state: Dict[str, Any]) -> str:
    marker = "window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__="
    marker_idx = html.find(marker)
    if marker_idx < 0:
        return html
    start_idx = marker_idx + len(marker)
    end_markers = (";<\\/script>", ";</script>")
    end_idx = -1
    end_marker_value = ""
    for candidate in end_markers:
        found_idx = html.find(candidate, start_idx)
        if found_idx >= 0 and (end_idx < 0 or found_idx < end_idx):
            end_idx = found_idx
            end_marker_value = candidate
    if end_idx < 0:
        return html
    replacement = json.dumps(shell_state, ensure_ascii=False, separators=(",", ":"))
    return html[:start_idx] + replacement + html[end_idx:]


def find_element_bounds_by_id(html: str, element_id: str) -> Optional[Tuple[int, int]]:
    pattern = re.compile(
        r'\bid\s*=\s*(["\'])' + re.escape(element_id) + r'\1',
        re.IGNORECASE,
    )
    match = pattern.search(html)
    if not match:
        return None
    start = html.rfind("<", 0, match.start())
    if start < 0:
        return None
    tag_match = re.match(r"<([A-Za-z][A-Za-z0-9:-]*)\b", html[start:])
    if not tag_match:
        return None
    tag_name = tag_match.group(1)
    token_re = re.compile(r"</?" + re.escape(tag_name) + r"\b[^>]*?>", re.IGNORECASE | re.DOTALL)
    depth = 0
    for token_match in token_re.finditer(html, start):
        token = token_match.group(0)
        is_close = token.startswith("</")
        is_self_closing = token.endswith("/>")
        if is_close:
            depth -= 1
            if depth == 0:
                return (start, token_match.end())
        elif is_self_closing:
            if depth == 0 and token_match.start() == start:
                return (start, token_match.end())
        else:
            depth += 1
    return None


def extract_element_html_by_id(html: str, element_id: str) -> Optional[str]:
    bounds = find_element_bounds_by_id(html, element_id)
    if not bounds:
        return None
    start, end = bounds
    return html[start:end]


def replace_element_html_by_id(html: str, element_id: str, replacement: str) -> str:
    bounds = find_element_bounds_by_id(html, element_id)
    if not bounds:
        return html
    start, end = bounds
    return html[:start] + replacement + html[end:]


def remove_elements_by_class(html: str, class_name: str) -> str:
    class_pattern = re.compile(
        r'\bclass\s*=\s*(["\'])(?=[^"\']*\b' + re.escape(class_name) + r'\b)([^"\']*)\1',
        re.IGNORECASE,
    )
    cursor = 0
    parts: List[str] = []
    while True:
        match = class_pattern.search(html, cursor)
        if not match:
            parts.append(html[cursor:])
            return "".join(parts)
        start = html.rfind("<", 0, match.start())
        if start < 0:
            parts.append(html[cursor:])
            return "".join(parts)
        tag_match = re.match(r"<([A-Za-z][A-Za-z0-9:-]*)\b", html[start:])
        if not tag_match:
            cursor = match.end()
            continue
        tag_name = tag_match.group(1)
        token_re = re.compile(r"</?" + re.escape(tag_name) + r"\b[^>]*?>", re.IGNORECASE | re.DOTALL)
        depth = 0
        end = None
        for token_match in token_re.finditer(html, start):
            token = token_match.group(0)
            is_close = token.startswith("</")
            is_self_closing = token.endswith("/>")
            if is_close:
                depth -= 1
                if depth == 0:
                    end = token_match.end()
                    break
            elif is_self_closing:
                if depth == 0 and token_match.start() == start:
                    end = token_match.end()
                    break
            else:
                depth += 1
        if end is None:
            parts.append(html[cursor:])
            return "".join(parts)
        parts.append(html[cursor:start])
        cursor = end


def extract_brand_title_html(header_html: str) -> Optional[str]:
    pattern = re.compile(
        r'(<div[^>]*style="display:flex;align-items:center;gap:7px;font-size:18px;font-weight:800;letter-spacing:-0\.03em"[^>]*>.*?Search<span style="color:#ffd400">Advisor</span></div>)',
        re.DOTALL,
    )
    match = pattern.search(header_html)
    return match.group(1) if match else None


def extract_first_svg_html(button_html: Optional[str]) -> str:
    if not button_html:
        return ""
    match = re.search(r"(<svg\b.*?</svg>)", button_html, re.DOTALL | re.IGNORECASE)
    return match.group(1) if match else ""


def strip_runtime_badge_html(brand_html: str) -> str:
    return re.sub(
        r'<span id="sadv-runtime-badge"[^>]*>.*?</span>',
        "",
        brand_html,
        flags=re.DOTALL,
    )


def build_canonical_runtime_badge_html(existing_badge_html: str) -> str:
    current_ref = get_source_ref().strip()
    if not current_ref:
        return existing_badge_html
    built_match = re.search(r"built:\s*([^\"<]+)", existing_badge_html or "", re.IGNORECASE)
    title_parts = [f"ref: {current_ref}"]
    if built_match:
        title_parts.append("built: " + built_match.group(1).strip())
    title_attr = " · ".join(title_parts)
    return (
        '<span id="sadv-runtime-badge" title="'
        + html.escape(title_attr)
        + '">@'
        + html.escape(current_ref)
        + "</span>"
    )


def build_saved_meta_pill(saved_label: str) -> str:
    if not saved_label:
        return ""
    return (
        '<div style="display:flex;align-items:center;padding:6px 10px;'
        'border-radius:999px;border:1px solid rgba(255, 212, 0, 0.24);'
        'color:rgb(255, 212, 0);background:rgba(32, 22, 0, 0.72);'
        'font-size:10px;font-weight:800;">'
        + html.escape("Saved " + saved_label)
        + "</div>"
    )


def append_saved_meta_pill(cache_meta_html: str, saved_label: str) -> str:
    normalized = re.sub(
        r"<div\b[^>]*>\s*Saved [^<]+</div>",
        "",
        cache_meta_html or "",
        flags=re.IGNORECASE | re.DOTALL,
    )
    pill_html = build_saved_meta_pill(saved_label)
    if not pill_html:
        return normalized
    if "</div>" not in normalized:
        return normalized + pill_html
    return normalized.replace("</div>", pill_html + "</div>", 1)


def resolve_merged_account_display_label(account: Dict[str, Any], index: int) -> Tuple[str, str]:
    fallback_label = f"계정{index + 1}"
    full_label = (
        (account.get("label") if isinstance(account, dict) else None)
        or (account.get("id") if isinstance(account, dict) else None)
        or (
            (account.get("encId") or "")[:8]
            if isinstance(account, dict) and account.get("encId")
            else ""
        )
        or fallback_label
    )
    short_label = full_label.split("@")[0] if "@" in full_label else full_label
    return full_label, short_label


def get_merged_display_meta(merged_meta: Optional[Dict[str, Any]], site_count: int) -> Optional[Dict[str, Any]]:
    if not isinstance(merged_meta, dict) or not merged_meta.get("isMerged"):
        return None
    valid_accounts = [
        account
        for account in (merged_meta.get("accounts") or [])
        if isinstance(account, dict)
    ]
    account_labels: List[str] = []
    for index, account in enumerate(valid_accounts):
        full_label, _short_label = resolve_merged_account_display_label(account, index)
        if full_label:
            account_labels.append(full_label)
    account_count = len(valid_accounts)
    return {
        "accountCount": account_count,
        "accountLabels": account_labels,
        "accountBadgeLabel": f"병합 {account_count}개 계정" if account_count > 0 else "병합본",
        "accountBadgeTitle": ", ".join(account_labels),
        "runtimeBadgeLabel": "병합본",
        "runtimeBadgeTitle": f"병합 대상 {account_count}개 계정 · {site_count}개 사이트",
        "siteStatus": f"{site_count}개 사이트 등록됨" + (f" · {account_count}개 계정 병합" if account_count > 0 else ""),
        "siteSummary": f"{site_count}개 사이트를 클릭 기준으로 정렬" + (f" · {account_count}개 계정 병합" if account_count > 0 else ""),
    }


def build_account_badge_html(account_label: str, title: Optional[str] = None) -> str:
    if not account_label:
        return '<div id="sadv-account-badge" style="display:none"></div>'
    title_attr = f' title="{html.escape(title)}"' if title else ""
    return (
        '<div id="sadv-account-badge" style="display:inline-flex;padding:4px 12px;'
        'border-radius:999px;border:1px solid rgba(255,212,0,0.2);color:#ffd400;'
        'background:rgba(255,212,0,0.12);font-size:11px;font-weight:600;line-height:1.2;'
        'overflow:hidden;text-overflow:ellipsis;white-space:nowrap"'
        + title_attr
        + ">"
        + html.escape(account_label)
        + "</div>"
    )


def build_site_label_html(primary_text: str, secondary_label: Optional[str] = None, title: Optional[str] = None) -> str:
    title_attr = f' title="{html.escape(title)}"' if title else ""
    inner = "<span>" + html.escape(primary_text) + "</span>"
    if secondary_label:
        inner += (
            '<span style="display:inline-flex;align-items:center;padding:2px 7px;border-radius:999px;'
            'border:1px solid rgba(255,212,0,0.2);color:#ffd400;background:rgba(32,22,0,0.72)">'
            + html.escape(secondary_label)
            + "</span>"
        )
    return (
        '<div id="sadv-site-label" style="font-size:11px;color:#64748b;margin-top:4px;display:flex;align-items:center;gap:4px"'
        + title_attr
        + ">"
        + inner
        + "</div>"
    )


def replace_combo_label_html(site_bar_html: str, next_label: str) -> str:
    if not site_bar_html or not next_label:
        return site_bar_html
    bounds = find_element_bounds_by_id(site_bar_html, "sadv-combo-label")
    if not bounds:
        return site_bar_html
    start, end = bounds
    replacement = '<span id="sadv-combo-label">' + html.escape(next_label) + "</span>"
    return site_bar_html[:start] + replacement + site_bar_html[end:]


def build_canonical_menu_action_button(
    button_id: str,
    label: str,
    title: str,
    icon_svg: str = "",
    *,
    hidden: bool = False,
) -> str:
    icon_part = (
        '<span class="sadv-btn-icon" aria-hidden="true">' + icon_svg + "</span>"
        if icon_svg
        else ""
    )
    hidden_attrs = ' hidden aria-hidden="true" style="display:none"' if hidden else ""
    return (
        f'<button id="{button_id}" type="button" class="sadv-btn"{hidden_attrs} '
        f'title="{html.escape(title)}" aria-label="{html.escape(label)}">'
        + icon_part
        + '<span class="sadv-btn-label">'
        + html.escape(label)
        + "</span></button>"
    )


def build_canonical_save_hub_markup(
    save_btn_html: Optional[str],
    xlsx_btn_html: Optional[str],
    *,
    direct_action: str = "",
    hub_label: str = "내보내기",
    hub_title: str = "내보내기",
    save_visible: bool = True,
    xlsx_visible: bool = True,
    xlsx_title: Optional[str] = None,
) -> str:
    icon_svg = extract_first_svg_html(save_btn_html) or extract_first_svg_html(xlsx_btn_html)
    icon_part = (
        '<span class="sadv-btn-icon" aria-hidden="true">' + icon_svg + "</span>"
        if icon_svg
        else ""
    )
    direct_class = " sadv-save-hub-direct" if direct_action else ""
    direct_attr = f' data-direct-action="{html.escape(direct_action)}"' if direct_action else ""
    caret_style = ' style="display:none"' if direct_action else ""
    save_hub_btn_html = (
        '<button id="sadv-save-hub-btn" type="button" class="sadv-btn sadv-save-hub-btn'
        + direct_class
        + '" aria-label="'
        + html.escape(hub_label)
        + '" aria-haspopup="'
        + ("false" if direct_action else "menu")
        + '" aria-expanded="false" title="'
        + html.escape(hub_title)
        + '" data-base-label="'
        + html.escape(hub_label)
        + '"'
        + direct_attr
        + ">"
        + icon_part
        + '<span class="sadv-btn-label">'
        + html.escape(hub_label)
        + "</span>"
        + '<span class="sadv-save-hub-caret" aria-hidden="true"'
        + caret_style
        + ">▾</span>"
        "</button>"
    )
    save_icon_svg = extract_first_svg_html(save_btn_html) or icon_svg
    xlsx_icon_svg = extract_first_svg_html(xlsx_btn_html) or icon_svg
    menu_parts: List[str] = [
        build_canonical_menu_action_button(
            "sadv-save-btn",
            "HTML 저장",
            "HTML 저장",
            save_icon_svg,
            hidden=not save_visible,
        ),
        build_canonical_menu_action_button(
            "sadv-xlsx-btn",
            "엑셀 저장",
            xlsx_title or "엑셀 저장",
            xlsx_icon_svg,
            hidden=not xlsx_visible,
        ),
    ]
    menu_html = (
        '<div id="sadv-save-hub-menu" class="sadv-save-hub-menu" role="menu" hidden>'
        + "".join(menu_parts)
        + "</div>"
    )
    return (
        '<div id="sadv-save-hub" class="sadv-save-hub">'
        + save_hub_btn_html
        + menu_html
        + "</div>"
    )


def canonicalize_snapshot_header_shell(
    html_text: str,
    saved_label: str,
    payload: Dict[str, Any],
    shell_state: Dict[str, Any],
) -> str:
    # Final fallback seam:
    # merge.py가 canonical shell artifact를 직접 쓰지 못하는 구형 입력 템플릿 상황에서도,
    # raw merged HTML source 레벨에서 old top-right action cluster를 걷어내고
    # current live shell family와 같은 header skeleton으로 정규화한다.
    # 이 단계는 payload/meta/data source는 그대로 두고, header ownership만 공통 구조로 맞춘다.
    header_html = extract_element_html_by_id(html_text, "sadv-header")
    if not header_html:
        return html_text
    if (
        'class="sadv-header-top"' in header_html
        and 'class="sadv-header-meta"' in header_html
        and 'id="sadv-save-hub-btn"' in header_html
        and 'class="sadv-header-actions"' not in header_html
    ):
        return html_text

    brand_title_html = extract_brand_title_html(header_html)
    if not brand_title_html:
        return html_text
    all_sites = payload.get("allSites") if isinstance(payload.get("allSites"), list) else []
    site_count = len([site for site in all_sites if isinstance(site, str) and site])
    merged_display_meta = get_merged_display_meta(payload.get("mergedMeta"), site_count)
    runtime_badge_html = build_canonical_runtime_badge_html(
        extract_element_html_by_id(header_html, "sadv-runtime-badge") or ""
    )
    if merged_display_meta:
        runtime_badge_html = (
            '<span id="sadv-runtime-badge" title="'
            + html.escape(
                merged_display_meta["runtimeBadgeTitle"]
                + (" · ref: " + get_source_ref() if get_source_ref() else "")
            )
            + '">'
            + html.escape(merged_display_meta["runtimeBadgeLabel"])
            + "</span>"
        )
    account_badge_html = (
        build_account_badge_html(
            merged_display_meta["accountBadgeLabel"],
            merged_display_meta["accountBadgeTitle"],
        )
        if merged_display_meta
        else (extract_element_html_by_id(header_html, "sadv-account-badge") or "")
    )
    active_tab_label = "사이트별" if shell_state.get("curTab") == "site" else "전체현황"
    site_label_html = (
        build_site_label_html(
            merged_display_meta["siteStatus"],
            active_tab_label,
            merged_display_meta["siteSummary"],
        )
        if merged_display_meta
        else (extract_element_html_by_id(header_html, "sadv-site-label") or "")
    )
    cache_meta_html = extract_element_html_by_id(header_html, "sadv-cache-meta") or '<div id="sadv-cache-meta"></div>'
    cache_meta_html = remove_elements_by_class(cache_meta_html, "sadv-header-actions")
    cache_meta_html = append_saved_meta_pill(cache_meta_html, saved_label)
    mode_bar_html = extract_element_html_by_id(header_html, "sadv-mode-bar") or ""
    site_bar_html = extract_element_html_by_id(header_html, "sadv-site-bar") or ""
    if merged_display_meta and shell_state.get("curMode") != "site":
        site_bar_html = replace_combo_label_html(site_bar_html, "사이트 선택")
    refresh_btn_html = extract_element_html_by_id(header_html, "sadv-refresh-btn") or ""
    save_btn_html = extract_element_html_by_id(header_html, "sadv-save-btn") or ""
    xlsx_btn_html = extract_element_html_by_id(header_html, "sadv-xlsx-btn") or ""
    close_btn_html = extract_element_html_by_id(header_html, "sadv-x") or ""
    action_status_chip_html = extract_element_html_by_id(header_html, "sadv-action-status-chip") or (
        '<span id="sadv-action-status-chip" class="sadv-action-status-chip" hidden aria-hidden="true" aria-live="polite"></span>'
    )
    allow_saved_merged_xlsx = bool(
        isinstance(payload.get("mergedMeta"), dict)
        and payload["mergedMeta"].get("isMerged")
        and payload["mergedMeta"].get("generatedBy") == "merge.py"
        and payload["mergedMeta"].get("xlsxAllowed")
    )
    canonical_save_hub_html = build_canonical_save_hub_markup(
        save_btn_html,
        xlsx_btn_html,
        direct_action="xlsx" if allow_saved_merged_xlsx else "",
        hub_label="엑셀 저장" if allow_saved_merged_xlsx else "내보내기",
        hub_title="병합 데이터 엑셀 저장" if allow_saved_merged_xlsx else "내보내기",
        save_visible=not allow_saved_merged_xlsx,
        xlsx_visible=not allow_saved_merged_xlsx,
        xlsx_title="병합 데이터 엑셀 저장" if allow_saved_merged_xlsx else "엑셀 저장",
    )
    if allow_saved_merged_xlsx:
        refresh_btn_html = ""

    canonical_header_html = (
        '<div id="sadv-header">'
        '<div class="sadv-header-top">'
        '<div class="sadv-header-brand">'
        + strip_runtime_badge_html(brand_title_html)
        + runtime_badge_html
        + "</div>"
        '<div class="sadv-header-top-actions">'
        '<div id="sadv-header-action-row" class="sadv-header-action-tools">'
        + canonical_save_hub_html
        + refresh_btn_html
        + close_btn_html
        + "</div></div></div>"
        '<div class="sadv-header-meta">'
        + account_badge_html
        + site_label_html
        + cache_meta_html
        + action_status_chip_html
        + "</div>"
        + mode_bar_html
        + site_bar_html
        + "</div>"
    )
    return replace_element_html_by_id(html_text, "sadv-header", canonical_header_html)


def has_function_definition(html: str, function_name: str) -> bool:
    return f"function {function_name}(" in html


def fetch_remote_source_text(relative_path: str) -> str:
    remote_url = build_remote_source_url(relative_path)
    with urlopen(remote_url, timeout=10) as response:
        return response.read().decode("utf-8")


@lru_cache(maxsize=None)
def load_merge_source_text_with_fallback(relative_path: str) -> str:
    local_path = Path(__file__).resolve().parent / relative_path
    if local_path.exists():
        return local_path.read_text(encoding="utf-8")
    try:
        log(
            f"  ℹ️ 로컬 source 미발견, GitHub raw fallback 사용: {relative_path} @ {get_source_ref()}"
        )
        return fetch_remote_source_text(relative_path)
    except (OSError, URLError) as error:
        raise FileNotFoundError(
            f"standalone merge.py 실행에 필요한 source helper를 찾지 못했습니다: {relative_path} "
            f"(ref={get_source_ref()}, remote={build_remote_source_url(relative_path)}, error={error}). "
            "release 또는 올바른 branch/tag/commit ref를 확인한 뒤 다시 시도하세요."
        ) from error


def load_snapshot_source_text() -> str:
    return load_merge_source_text_with_fallback("src/app/main/12-snapshot.js")


def load_dom_init_source_text() -> str:
    return load_merge_source_text_with_fallback("src/app/main/02-dom-init.js")


def load_xlsx_source_text() -> str:
    source_text = load_merge_source_text_with_fallback("src/app/main/15-export-xlsx.js")
    cutoff = source_text.find("async function downloadSnapshotXlsx(")
    if cutoff < 0:
        raise ValueError("downloadSnapshotXlsx adapter boundary not found in 15-export-xlsx.js")
    # merge.py가 필요한 것은 saved merged snapshot에서 workbook을 직접 조립하는 공통 helper들뿐이다.
    # runSnapshotSaveExecution()/downloadSnapshotXlsx() 같은 정책 owner/adapter 본문은 saved inline script에
    # 통째로 주입하면 await 문맥 오류와 중복 계약 drift를 만들 수 있으므로 제외한다.
    return source_text[:cutoff].rstrip()


def extract_function_source(source_text: str, function_name: str) -> str:
    async_sig = f"async function {function_name}("
    plain_sig = f"function {function_name}("
    start = source_text.find(async_sig)
    if start < 0:
        start = source_text.find(plain_sig)
    if start < 0:
        raise ValueError(f"function {function_name} not found in 12-snapshot.js")
    next_plain = source_text.find("\nfunction ", start + 1)
    next_async = source_text.find("\nasync function ", start + 1)
    candidates = [idx for idx in (next_plain, next_async) if idx >= 0]
    next_idx = min(candidates) if candidates else -1
    snippet = source_text[start:] if next_idx < 0 else source_text[start:next_idx]
    return snippet.rstrip()


def inject_missing_merge_helpers(html: str) -> str:
    missing = [name for name in MERGED_TEMPLATE_HELPERS if not has_function_definition(html, name)]
    if not missing:
        return html
    source_text = load_snapshot_source_text()
    helper_block = "\n\n".join(extract_function_source(source_text, name) for name in missing).strip()
    if not helper_block:
        return html
    anchors = (
        "function syncXlsxButtonVisibility(",
        "function setAllSitesLabel(",
        "createMergedAccountsInfo(",
        "canManualXlsxExportInCurrentRuntime(",
        "</script>",
    )
    for anchor in anchors:
        idx = html.find(anchor)
        if idx >= 0:
            return html[:idx] + helper_block + "\n\n" + html[idx:]
    return html + "\n<script>\n" + helper_block + "\n</script>\n"


def inject_missing_merge_header_shell_helpers(html: str) -> str:
    missing = [name for name in MERGED_HEADER_SHELL_HELPERS if not has_function_definition(html, name)]
    if not missing:
        return html
    source_text = load_dom_init_source_text()
    helper_block = "\n\n".join(extract_function_source(source_text, name) for name in missing).strip()
    if not helper_block:
        return html
    anchors = (
        "function getHeaderActionDisplayMeta(",
        "function syncHeaderSaveHub(",
        "function bindSnapshotManualXlsxButton(",
        "</script>",
    )
    for anchor in anchors:
        idx = html.find(anchor)
        if idx >= 0:
            return html[:idx] + helper_block + "\n\n" + html[idx:]
    return html + "\n<script>\n" + helper_block + "\n</script>\n"


def inject_missing_merge_xlsx_compat_pack(html: str) -> str:
    if "function buildSnapshotXlsxWorkbook(" in html and "function ensureSnapshotXlsxLibrary(" in html:
        return html
    xlsx_source = load_xlsx_source_text().strip()
    if not xlsx_source:
        return html
    anchors = (
        "function formatSnapshotMergedXlsxCompatStamp(",
        "function bindSnapshotManualXlsxButton(",
        "function syncXlsxButtonVisibility(",
        "</script>",
    )
    for anchor in anchors:
        idx = html.find(anchor)
        if idx >= 0:
            return html[:idx] + xlsx_source + "\n\n" + html[idx:]
    return html + "\n<script>\n" + xlsx_source + "\n</script>\n"


def inject_missing_merge_xlsx_binding_call(html: str) -> str:
    marker = 'normalizeHeaderActionShell(document.getElementById("sadv-header")'
    if marker in html:
        return html
    binding_block = (
        '\n    if (typeof normalizeHeaderActionShell === "function") {\n'
        '      normalizeHeaderActionShell(document.getElementById("sadv-header"), {\n'
        '        runtimeRef: typeof window !== "undefined" && typeof window.__SEARCHADVISOR_RUNTIME_REF__ === "string"\n'
        '          ? window.__SEARCHADVISOR_RUNTIME_REF__\n'
        '          : "",\n'
        '        runtimeBuiltAt: typeof window !== "undefined" && typeof window.__SEARCHADVISOR_RUNTIME_BUILD_AT__ === "string"\n'
        '          ? window.__SEARCHADVISOR_RUNTIME_BUILD_AT__\n'
        '          : "",\n'
        "      });\n"
        "    }\n"
        '\n    if (typeof bindSnapshotManualXlsxButton === "function") {\n'
        '      bindSnapshotManualXlsxButton(document.getElementById("sadv-xlsx-btn"));\n'
        "    }\n"
        '    if (typeof syncSnapshotActionButtons === "function") {\n'
        '      syncSnapshotActionButtons(typeof getRuntimeSaveStatus === "function" ? getRuntimeSaveStatus() : null);\n'
        "    }\n"
    )
    anchors = (
        "const snapshotApi = {",
        "publishSnapshotRuntimeApis(snapshotApi);",
        "</script>",
    )
    for anchor in anchors:
        idx = html.find(anchor)
        if idx >= 0:
            return html[:idx] + binding_block + html[idx:]
    return html + "\n<script>" + binding_block + "</script>\n"


def build_merged_html(template_html: str, payload: Dict[str, Any]) -> str:
    html = replace_payload_raw(template_html, payload)
    html = replace_first_saved_chip(html, format_saved_label(payload.get("savedAt") or ""))
    shell_state = build_snapshot_shell_state(payload)
    html = replace_snapshot_shell_state(html, shell_state)
    html = canonicalize_snapshot_header_shell(
        html,
        format_saved_label(payload.get("savedAt") or ""),
        payload,
        shell_state,
    )
    html = inject_missing_merge_xlsx_compat_pack(html)
    html = inject_missing_merge_helpers(html)
    html = inject_missing_merge_header_shell_helpers(html)
    html = inject_missing_merge_xlsx_binding_call(html)
    return html


def is_xlsx_capable_saved_template(html: str) -> bool:
    return "downloadSnapshotXlsx" in html or "canXlsxSave" in html


def is_merge_helper_capable_saved_template(html: str) -> bool:
    return all(has_function_definition(html, name) for name in MERGED_TEMPLATE_HELPERS)


def is_canonical_header_shell_template(html: str) -> bool:
    return all(
        token in html
        for token in (
            'class="sadv-header-top"',
            'class="sadv-header-meta"',
            'id="sadv-save-hub-btn"',
        )
    )


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
        canonical_shell_entries = [
            entry for entry in readable_entries if is_canonical_header_shell_template(entry.template_html)
        ]
        merged_helper_capable_entries = [
            entry for entry in xlsx_capable_entries if is_merge_helper_capable_saved_template(entry.template_html)
        ]
        template_entry = max(
            canonical_shell_entries
            or merged_helper_capable_entries
            or xlsx_capable_entries
            or readable_entries,
            key=lambda item: (item.source_file.stamp, item.source_file.account_key),
        )
        if canonical_shell_entries:
            log(
                "  ℹ️ 최신 canonical header shell 구조를 가진 saved HTML을 템플릿으로 우선 사용합니다."
            )
        elif not xlsx_capable_entries:
            log(
                "  ⚠️ 선택된 최신 HTML이 모두 구형 saved template이라 merged HTML에서 엑셀 버튼 동작은 best-effort일 수 있습니다."
            )
        else:
            log(
                "  ⚠️ canonical header shell 템플릿이 없어 legacy saved template를 사용하되 current ref shell normalizer bridge와 source-level header canonicalization fallback을 같이 적용합니다."
            )
            if not merged_helper_capable_entries:
                log(
                    "  ⚠️ 선택된 최신 HTML에 merged helper pack이 없어 현재 코드 기준 helper를 보강 주입합니다."
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


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="계정별 최신 SearchAdvisor saved HTML을 병합하고 오래된 HTML을 정리합니다.",
    )
    parser.add_argument(
        "--ref",
        default=DEFAULT_SOURCE_REF,
        help="remote source helper fallback ref (default: release). branch/tag/commit 모두 가능",
    )
    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    resolved_ref = set_source_ref(args.ref)
    log(f"ℹ️ merge.py source helper ref: {resolved_ref}")
    cwd = Path.cwd()
    try:
        return merge_current_directory(cwd)
    except Exception as exc:
        log(f"❌ merge.py 실행 실패: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
