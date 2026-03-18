#!/usr/bin/env python3
"""
SearchAdvisor Multi-Account Snapshot Merger
네이버 서치어드바이저 다중 계정 스냅샷 병합 스크립트

버전 지원:
- v1 (레거시): 20260314-payload-contract-v1 (단일 계정 구조)
- v2 (신규): 20260317-payload-contract-v2 (중첩 계정 구조)

새로운 기능:
- v1/v2 자동 감지 및 변환
- HTML 병합 시 계정별/사이트별 명확한 구분
- 레이블 정보 유지
- 사이트 충돌 처리

사용법:
    python merge_snapshots.py file1.html file2.html -o merged.html
    python merge_snapshots.py *.html -o merged.html
    python merge_snapshots.py file1.html file2.html -o merged --json-only
"""

import json
import re
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from dataclasses import dataclass, field
from collections import defaultdict
from html import escape


@dataclass
class AccountInfo:
    """계정 정보 (v2 구조)"""
    email: str
    enc_id: str = ""
    sites: List[str] = field(default_factory=list)
    site_meta: Dict[str, Any] = field(default_factory=dict)
    data_by_site: Dict[str, Any] = field(default_factory=dict)

    def get_site_label(self, site_url: str) -> str:
        """사이트 레이블 반환 (없으면 URL 사용)"""
        if site_url in self.site_meta:
            return self.site_meta[site_url].get("label", site_url)
        return site_url

    @property
    def short_label(self) -> str:
        """이메일의 짧은 라벨 (user@naver.com -> user)"""
        return self.email.split("@")[0]


@dataclass
class SiteConflict:
    """사이트 충돌 정보"""
    site_url: str
    accounts: List[str]  # 이메일 목록
    labels: Dict[str, str]  # 이메일 -> 레이블 매핑


@dataclass
class MergedSnapshot:
    """병합된 스냅샷 데이터 (v2 구조)"""
    version: str = "1.0"
    saved_at: str = ""
    accounts: Dict[str, AccountInfo] = field(default_factory=dict)

    def __post_init__(self):
        if not self.saved_at:
            self.saved_at = datetime.now().isoformat() + "Z"

    @property
    def account_count(self) -> int:
        """계정 수"""
        return len(self.accounts)

    @property
    def all_sites(self) -> List[str]:
        """전체 사이트 목록 (계산된 속성)"""
        sites = set()
        for acc in self.accounts.values():
            sites.update(acc.sites)
        return sorted(sites)

    @property
    def site_ownership(self) -> Dict[str, List[str]]:
        """사이트 소유권 매핑 (site_url -> [이메일들])"""
        ownership = defaultdict(list)
        for email, acc in self.accounts.items():
            for site in acc.sites:
                ownership[site].append(email)
        return dict(ownership)

    @property
    def conflicts(self) -> List[SiteConflict]:
        """사이트 충돌 목록 (같은 사이트가 여러 계정에 있는 경우)"""
        conflict_list = []
        for site_url, emails in self.site_ownership.items():
            if len(emails) > 1:
                labels = {}
                for email in emails:
                    acc = self.accounts[email]
                    labels[email] = acc.get_site_label(site_url)
                conflict_list.append(SiteConflict(site_url, emails, labels))
        return conflict_list

    def to_dict(self) -> Dict[str, Any]:
        """딕셔너리로 변환 (JSON 직렬화용)"""
        return {
            "__meta": {
                "version": self.version,
                "savedAt": self.saved_at,
                "accountCount": self.account_count,
                "totalSites": len(self.all_sites),
                "hasConflicts": len(self.conflicts) > 0
            },
            "accounts": {
                email: {
                    "encId": acc.enc_id,
                    "sites": acc.sites,
                    "siteMeta": acc.site_meta,
                    "dataBySite": acc.data_by_site
                }
                for email, acc in self.accounts.items()
            },
            "_summary": {
                "siteOwnership": self.site_ownership,
                "conflicts": [
                    {
                        "site": c.site_url,
                        "accounts": c.accounts,
                        "labels": c.labels
                    }
                    for c in self.conflicts
                ]
            }
        }


class SnapshotExtractor:
    """HTML 파일에서 스냅샷 데이터 추출 (v1, v2 자동 감지)"""

    # 다양한 패턴 지원 (호환성)
    PATTERNS = [
        r'window\.EXPORT_PAYLOAD\s*=\s*({.*?});\s*\/\/\s*EXPORT_PAYLOAD',
        r'window\.EXPORT_PAYLOAD\s*=\s*({.*?});',
        r'EXPORT_PAYLOAD\s*=\s*({.*?});',
    ]

    @classmethod
    def detect_version(cls, payload: Dict[str, Any]) -> str:
        """페이로드 버전 감지"""
        if "accounts" in payload:
            return "v2"
        return "v1"

    @classmethod
    def extract_from_html(cls, html_path: str) -> Tuple[Dict[str, Any], str]:
        """HTML 파일에서 EXPORT_PAYLOAD 추출 (데이터, 버전 반환)"""
        path = Path(html_path)
        if not path.exists():
            raise FileNotFoundError(f"파일을 찾을 수 없음: {html_path}")

        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 여러 패턴 시도
        for pattern in cls.PATTERNS:
            match = re.search(pattern, content, re.DOTALL)
            if match:
                try:
                    payload = json.loads(match.group(1))
                    version = cls.detect_version(payload)
                    # v1이면 v2로 변환
                    if version == "v1":
                        return cls._migrate_v1_to_v2(payload), "v1->v2"
                    return payload, "v2"
                except json.JSONDecodeError:
                    continue

        raise ValueError(f"EXPORT_PAYLOAD를 찾을 수 없음: {html_path}")

    @classmethod
    def _migrate_v1_to_v2(cls, legacy: Dict[str, Any]) -> Dict[str, Any]:
        """
        레거시 v1을 v2로 변환

        v1 구조 (실제):
        {
            "savedAt": "2026-03-18T...",
            "accountLabel": "user@naver.com",
            "accountEncId": "abc123",
            "allSites": ["https://site1.com"],
            "dataBySite": {...},
            "siteMeta": {...},
            "curMode": "all",
            "curSite": null,
            "curTab": "overview",
            "summaryRows": [...],
            "stats": {...}
        }

        v2 구조:
        {
            "__meta": {...},
            "accounts": {
                "user@naver.com": {
                    "encId": "abc123",
                    "sites": ["https://site1.com"],
                    "siteMeta": {...},
                    "dataBySite": {...}
                }
            },
            "ui": {...},
            "summaryRows": [...],
            "stats": {...},
            "mergedMeta": null
        }
        """
        # Handle both nested __meta and flat v1 structure
        meta = legacy.get("__meta", {})
        email = (
            meta.get("accountEmail") or
            meta.get("accountLabel") or
            legacy.get("accountLabel") or
            "unknown@naver.com"
        )
        enc_id = (
            meta.get("encId") or
            legacy.get("accountEncId") or
            legacy.get("encId") or
            ""
        )
        saved_at = (
            meta.get("savedAt") or
            legacy.get("savedAt") or
            datetime.now().isoformat() + "Z"
        )

        return {
            "__meta": {
                "version": "1.0",
                "savedAt": saved_at,
                "accountCount": 1,
                "migratedFrom": meta.get("version") or legacy.get("generatorVersion") or "v1"
            },
            "accounts": {
                email: {
                    "encId": enc_id,
                    "sites": legacy.get("allSites", []),
                    "siteMeta": legacy.get("siteMeta", {}),
                    "dataBySite": legacy.get("dataBySite", {})
                }
            },
            "ui": {
                "curMode": legacy.get("curMode", "all"),
                "curSite": legacy.get("curSite"),
                "curTab": legacy.get("curTab", "overview")
            },
            "summaryRows": legacy.get("summaryRows", []),
            "stats": legacy.get("stats", {}),
            "mergedMeta": None
        }


class SnapshotMerger:
    """스냅샷 병합기 (v2 구조)"""

    def __init__(self):
        self.merged = MergedSnapshot()
        self.extractor = SnapshotExtractor()
        self._source_files: List[str] = []

    def add_snapshot(self, html_path: str) -> None:
        """스냅샷 추가 (자동 v2 변환)"""
        print(f"  처리 중: {Path(html_path).name}")
        self._source_files.append(html_path)

        payload, version = self.extractor.extract_from_html(html_path)
        print(f"    버전: {version}")

        # 계정 추가
        for email, account_data in payload["accounts"].items():
            self._add_account(email, account_data)

    def _add_account(self, email: str, account_data: Dict[str, Any]) -> None:
        """계정 데이터 추가 (중복 계정은 병합)"""
        acc_info = AccountInfo(
            email=email,
            enc_id=account_data.get("encId", ""),
            sites=account_data.get("sites", []),
            site_meta=account_data.get("siteMeta", {}),
            data_by_site=account_data.get("dataBySite", {})
        )

        # 계정 추가 (이미 존재하면 병합)
        if email in self.merged.accounts:
            existing = self.merged.accounts[email]
            # 중복되지 않은 사이트만 추가
            for site in acc_info.sites:
                if site not in existing.sites:
                    existing.sites.append(site)
            # siteMeta 병합 (새로운 레이블 우선)
            for site, meta in acc_info.site_meta.items():
                if site not in existing.site_meta:
                    existing.site_meta[site] = meta
            # dataBySite 병합 (새 데이터 우선)
            for site, data in acc_info.data_by_site.items():
                if site not in existing.data_by_site:
                    existing.data_by_site[site] = data
            print(f"    계정 병합: {email}")
        else:
            self.merged.accounts[email] = acc_info
            print(f"    계정 추가: {email} ({len(acc_info.sites)}개 사이트)")

    def merge(self, html_paths: List[str]) -> MergedSnapshot:
        """여러 HTML 파일 병합"""
        print(f"\n{'='*60}")
        print(f"🔄 병합 시작: {len(html_paths)}개 파일")
        print(f"{'='*60}")

        for html_path in html_paths:
            try:
                self.add_snapshot(html_path)
            except Exception as e:
                print(f"  ❌ 오류: {e}")
                continue

        print(f"\n{'='*60}")
        print(f"✅ 병합 완료:")
        print(f"   계정 수: {self.merged.account_count}")
        print(f"   전체 사이트 수: {len(self.merged.all_sites)}")
        if self.merged.conflicts:
            print(f"   ⚠️  사이트 충돌: {len(self.merged.conflicts)}개")
        print(f"{'='*60}")

        for email, acc in self.merged.accounts.items():
            print(f"   [{acc.short_label}] {email}: {len(acc.sites)}개 사이트")

        return self.merged


class JSONExporter:
    """JSON 데이터 저장"""

    @staticmethod
    def save(merged: MergedSnapshot, output_path: str) -> str:
        """JSON으로 저장"""
        json_path = str(Path(output_path).with_suffix('.json'))
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(merged.to_dict(), f, ensure_ascii=False, indent=2)

        print(f"\n✅ JSON 저장됨: {json_path}")
        return json_path


class HTMLExporter:
    """HTML 데이터 저장 (계정별/사이트별 명확한 구분)"""

    @staticmethod
    def save(merged: MergedSnapshot, output_path: str) -> str:
        """HTML로 저장 (계정별 구분 포함)"""
        html_path = str(Path(output_path).with_suffix('.html'))

        html_content = HTMLExporter._generate_html(merged)

        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"✅ HTML 저장됨: {html_path}")
        return html_path

    @staticmethod
    def _generate_html(merged: MergedSnapshot) -> str:
        """HTML 콘텐츠 생성"""
        # 정렬된 계정 목록
        sorted_emails = sorted(merged.accounts.keys())

        # HTML 템플릿
        html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SearchAdvisor - 병합된 스냅샷 ({merged.account_count} 계정)</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f7fa;
            padding: 20px;
            line-height: 1.6;
        }}

        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}

        .header h1 {{
            font-size: 28px;
            margin-bottom: 10px;
        }}

        .header .meta {{
            opacity: 0.9;
            font-size: 14px;
        }}

        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }}

        .stat-card {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            text-align: center;
        }}

        .stat-card .number {{
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }}

        .stat-card .label {{
            color: #6c757d;
            font-size: 14px;
        }}

        .account-section {{
            background: white;
            border-radius: 12px;
            margin-bottom: 25px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }}

        .account-header {{
            background: #667eea;
            color: white;
            padding: 20px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .account-header .email {{
            font-size: 18px;
            font-weight: 600;
        }}

        .account-header .badge {{
            background: rgba(255, 255, 255, 0.2);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 13px;
        }}

        .account-content {{
            padding: 25px;
        }}

        .sites-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
        }}

        .site-card {{
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            background: #fafbfc;
            transition: all 0.2s;
        }}

        .site-card:hover {{
            border-color: #667eea;
            background: white;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
        }}

        .site-card.conflict {{
            border-color: #f59e0b;
            background: #fffbeb;
        }}

        .site-card.conflict:hover {{
            background: #fff7e0;
        }}

        .site-card-header {{
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 10px;
        }}

        .site-label {{
            font-weight: 600;
            color: #212529;
            font-size: 15px;
        }}

        .site-url {{
            font-size: 12px;
            color: #6c757d;
            word-break: break-all;
        }}

        .conflict-badge {{
            background: #f59e0b;
            color: white;
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 4px;
            white-space: nowrap;
        }}

        .conflict-info {{
            margin-top: 10px;
            padding: 10px;
            background: #fff3cd;
            border-radius: 6px;
            font-size: 12px;
            color: #856404;
        }}

        .conflict-info strong {{
            display: block;
            margin-bottom: 5px;
        }}

        .no-sites {{
            color: #6c757d;
            font-style: italic;
            padding: 20px;
            text-align: center;
        }}

        .footer {{
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #6c757d;
            font-size: 14px;
        }}

        @media (max-width: 768px) {{
            .sites-grid {{
                grid-template-columns: 1fr;
            }}

            .account-header {{
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 SearchAdvisor 병합된 스냅샷</h1>
        <div class="meta">
            버전: {merged.version} |
            저장일: {merged.saved_at} |
            계정: {merged.account_count}개 |
            사이트: {len(merged.all_sites)}개
        </div>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="number">{merged.account_count}</div>
            <div class="label">계정 수</div>
        </div>
        <div class="stat-card">
            <div class="number">{len(merged.all_sites)}</div>
            <div class="label">전체 사이트</div>
        </div>
        <div class="stat-card">
            <div class="number">{len(merged.conflicts)}</div>
            <div class="label">사이트 충돌</div>
        </div>
    </div>
"""

        # 충돌 있는 사이트 집합
        conflict_sites = {c.site_url for c in merged.conflicts}

        # 각 계정 섹션 생성
        for email in sorted_emails:
            acc = merged.accounts[email]
            html += HTMLExporter._generate_account_section(acc, conflict_sites, merged)

        # 충돌 요약 섹션
        if merged.conflicts:
            html += HTMLExporter._generate_conflicts_section(merged)

        # 푸터
        html += f"""
    <div class="footer">
        <p>Generated by SearchAdvisor Snapshot Merger</p>
        <p>_merged_at: {datetime.now().isoformat()}Z</p>
    </div>

    <script>
    window.EXPORT_PAYLOAD = {json.dumps(merged.to_dict(), ensure_ascii=False)}; // EXPORT_PAYLOAD
    </script>
</body>
</html>
"""
        return html

    @staticmethod
    def _generate_account_section(acc: AccountInfo, conflict_sites: set, merged: MergedSnapshot) -> str:
        """계정 섹션 HTML 생성"""
        html = f"""
    <div class="account-section">
        <div class="account-header">
            <div class="email">📧 {acc.email}</div>
            <div class="badge">{len(acc.sites)}개 사이트</div>
        </div>
        <div class="account-content">
"""

        if acc.sites:
            html += '            <div class="sites-grid">\n'

            for site_url in sorted(acc.sites):
                label = acc.get_site_label(site_url)
                is_conflict = site_url in conflict_sites

                conflict_badge = '<span class="conflict-badge">중복</span>' if is_conflict else ''
                conflict_class = 'conflict' if is_conflict else ''

                # 충돌 정보 추가
                conflict_info = ""
                if is_conflict:
                    owners = [e for e in merged.site_ownership[site_url] if e != acc.email]
                    owner_labels = []
                    for owner_email in owners:
                        owner_acc = merged.accounts[owner_email]
                        owner_labels.append(f"{owner_acc.short_label} ({owner_acc.get_site_label(site_url)})")

                    conflict_info = f"""
                    <div class="conflict-info">
                        <strong>⚠️ 다른 계정에서도 발견됨:</strong>
                        {', '.join(owner_labels)}
                    </div>
"""

                html += f"""
                <div class="site-card {conflict_class}">
                    <div class="site-card-header">
                        <div>
                            <div class="site-label">{escape(label)}</div>
                            <div class="site-url">{escape(site_url)}</div>
                        </div>
                        {conflict_badge}
                    </div>
                    {conflict_info}
                </div>
"""

            html += '            </div>\n'
        else:
            html += '            <div class="no-sites">등록된 사이트가 없습니다</div>\n'

        html += '        </div>\n    </div>\n'
        return html

    @staticmethod
    def _generate_conflicts_section(merged: MergedSnapshot) -> str:
        """충돌 요약 섹션 HTML 생성"""
        html = """
    <div class="account-section">
        <div class="account-header" style="background: #f59e0b;">
            <div class="email">⚠️ 사이트 충돌 요약</div>
            <div class="badge">{n}개</div>
        </div>
        <div class="account-content">
            <p style="margin-bottom: 15px; color: #6c757d;">
                다음 사이트들이 여러 계정에서 중복되어 발견되었습니다.
            </p>
            <div class="sites-grid">
""".format(n=len(merged.conflicts))

        for conflict in merged.conflicts:
            account_list = []
            for email in conflict.accounts:
                acc = merged.accounts[email]
                account_list.append(f"{acc.short_label}: {escape(acc.get_site_label(conflict.site_url))}")

            html += f"""
                <div class="site-card conflict">
                    <div class="site-label">{escape(conflict.site_url)}</div>
                    <div style="margin-top: 10px; font-size: 13px; color: #495057;">
                        <strong>소유 계정:</strong><br>
                        {'<br>'.join(account_list)}
                    </div>
                </div>
"""

        html += """
            </div>
        </div>
    </div>
"""
        return html


def main():
    parser = argparse.ArgumentParser(
        description="SearchAdvisor 스냅샷 병합 도구 (v1/v2 자동 지원)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
예시:
  %(prog)s file1.html file2.html -o merged
  %(prog)s *.html -o searchadvisor-all
  %(prog)s file1.html file2.html -o merged --json-only
        """
    )
    parser.add_argument(
        "html_files",
        nargs="+",
        help="병합할 HTML 파일들 (와일드카드 지원: *.html)"
    )
    parser.add_argument(
        "-o", "--output",
        default="searchadvisor-merged",
        help="출력 파일명 (기본값: searchadvisor-merged)"
    )
    parser.add_argument(
        "-j", "--json-only",
        action="store_true",
        help="JSON만 생성 (HTML 생략)"
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="상세 출력"
    )

    args = parser.parse_args()

    # 병합 실행
    merger = SnapshotMerger()
    merged = merger.merge(args.html_files)

    # JSON 저장
    exporter = JSONExporter()
    json_path = exporter.save(merged, args.output)

    # HTML 저장 (옵션)
    if not args.json_only:
        html_exporter = HTMLExporter()
        html_path = html_exporter.save(merged, args.output)
        print(f"\n✅ 최종 출력:")
        print(f"   JSON: {json_path}")
        print(f"   HTML: {html_path}")
    else:
        print(f"\n✅ 최종 출력:")
        print(f"   JSON: {json_path}")

    if merged.conflicts:
        print(f"\n⚠️  주의: {len(merged.conflicts)}개 사이트 충돌이 있습니다.")
        print(f"   HTML 파일에서 충돌 섹션을 확인하세요.")


if __name__ == "__main__":
    main()
