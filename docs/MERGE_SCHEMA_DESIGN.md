# 병합 기능 확장성 설계

## JSON 스키마 구조 (Naver 이메일을 최상위 키로)

### 1단계: 단일 계정 스냅샷 구조 (현재)

```json
{
  "__meta": {
    "version": "20260317-payload-contract-v1",
    "savedAt": "2026-03-17T14:30:00.000Z",
    "accountEmail": "user1@naver.com",
    "encId": "abc12345"
  },
  "allSites": ["https://example1.com", "https://example2.com"],
  "siteMeta": {
    "https://example1.com": { "label": "사이트1", "shortName": "example1" }
  },
  "dataBySite": {
    "https://example1.com": {
      "expose": { "click": 1000, "imp": 50000 },
      "crawl": { ... },
      "backlink": { ... }
    }
  }
}
```

### 2단계: 병합된 구조 (제안)

```json
{
  "__meta": {
    "version": "20260317-merge-contract-v1",
    "mergedAt": "2026-03-17T14:35:00.000Z",
    "mergeStrategy": "multi-account"
  },
  "accounts": {
    "user1@naver.com": {
      "encId": "abc12345",
      "label": "user1@naver.com",
      "shortLabel": "user1",
      "sites": ["https://example1.com", "https://example2.com"],
      "dataBySite": {
        "https://example1.com": {
          "expose": { "click": 1000, "imp": 50000 }
        }
      }
    },
    "user2@naver.com": {
      "encId": "def67890",
      "label": "user2@naver.com",
      "shortLabel": "user2",
      "sites": ["https://example3.com"],
      "dataBySite": {
        "https://example3.com": {
          "expose": { "click": 2000, "imp": 80000 }
        }
      }
    }
  }
}
```

**설계 원칙:** 단일 진실 공급원 (Single Source of Truth)
- `accounts[email].sites` = 유일한 데이터 출처
- 계산으로 얻을 수 있는 것은 저장하지 않기
- 필요시 `getAllSites()`, `getAccountForSite()` 함수로 계산

---

## 파이썬 병합 스크립트 예제

```python
#!/usr/bin/env python3
"""
SearchAdvisor Multi-Account HTML Merger
네이버 서치어드바이저 다중 계정 HTML 병합 스크립트
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime

class SnapshotMerger:
    """다중 계정 스냅샷 병합기"""

    VERSION = "20260317-merge-contract-v1"

    def __init__(self):
        self.merged_data = {
            "__meta": {
                "version": self.VERSION,
                "mergedAt": datetime.now().isoformat() + "Z",
                "mergeStrategy": "multi-account"
            },
            "accounts": {},
            "allSites": [],
            "siteToAccount": {}
        }

    def extract_payload_from_html(self, html_path: str) -> Dict[str, Any]:
        """HTML 파일에서 EXPORT_PAYLOAD 추출"""
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # EXPORT_PAYLOAD 찾기
        pattern = r'window\.EXPORT_PAYLOAD\s*=\s*({.*?});'
        match = re.search(pattern, content, re.DOTALL)

        if not match:
            raise ValueError(f"EXPORT_PAYLOAD를 찾을 수 없음: {html_path}")

        payload = json.loads(match.group(1))
        return payload

    def normalize_single_snapshot(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """단일 계정 스냅샷 정규화"""
        # 계정 이메일 추출 (없으면 생성)
        account_email = payload.get("__meta", {}).get("accountEmail", "unknown@naver.com")

        normalized = {
            "encId": payload.get("__meta", {}).get("encId", ""),
            "label": account_email,
            "shortLabel": account_email.split("@")[0],
            "sites": payload.get("allSites", []),
            "dataBySite": payload.get("dataBySite", {}),
            "siteMeta": payload.get("siteMeta", {})
        }

        return {account_email: normalized}

    def add_snapshot(self, html_path: str):
        """스냅샷 추가"""
        payload = self.extract_payload_from_html(html_path)
        normalized = self.normalize_single_snapshot(payload)

        for account_email, account_data in normalized.items():
            # 계정 데이터 추가
            self.merged_data["accounts"][account_email] = account_data

            # 사이트 목록 추가
            for site in account_data["sites"]:
                if site not in self.merged_data["allSites"]:
                    self.merged_data["allSites"].append(site)

                # 사이트-계정 매핑
                self.merged_data["siteToAccount"][site] = account_email

    def merge(self, html_paths: List[str]) -> Dict[str, Any]:
        """여러 HTML 파일 병합"""
        for html_path in html_paths:
            print(f"처리 중: {html_path}")
            self.add_snapshot(html_path)

        # 사이트 정렬
        self.merged_data["allSites"].sort()

        return self.merged_data

    def generate_merged_html(self, merged_data: Dict[str, Any], template_path: str) -> str:
        """병합된 HTML 생성"""
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()

        # EXPORT_PAYLOAD 주입
        payload_json = json.dumps(merged_data, ensure_ascii=False, indent=2)
        payload_script = f"window.EXPORT_PAYLOAD = {payload_json};"

        # 템플릿의 기존 payload 교체
        merged_html = re.sub(
            r'window\.EXPORT_PAYLOAD\s*=\s*{.*?};',
            payload_script,
            template,
            flags=re.DOTALL
        )

        # 메타데이터 업데이트
        merged_html = merged_html.replace(
            '단일 계정 리포트',
            f'병합 리포트 ({len(merged_data["accounts"])}개 계정)'
        )

        return merged_html

    def save_merged_html(self, output_path: str):
        """병합된 HTML 저장"""
        # 템플릿 경로 (첫 번째 입력 파일 사용)
        # 실제로는 별도 템플릿 파일을 사용하는 것이 좋음
        merged_html = self.generate_merged_html(
            self.merged_data,
            "src/app/main/snapshot-template.html"  # 템플릿 파일
        )

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(merged_html)

        print(f"병합 완료: {output_path}")
        print(f"  - 계정 수: {len(self.merged_data['accounts'])}")
        print(f"  - 사이트 수: {len(self.merged_data['allSites'])}")


# 사용 예시
if __name__ == "__main__":
    merger = SnapshotMerger()

    # 여러 계정의 HTML 파일 병합
    html_files = [
        "searchadvisor-user1-20260317.html",
        "searchadvisor-user2-20260317.html",
        "searchadvisor-user3-20260317.html"
    ]

    merged = merger.merge(html_files)
    merger.save_merged_html("searchadvisor-merged.html")

    print("\n병합된 계정:")
    for email, data in merged["accounts"].items():
        print(f"  - {email} ({data['shortLabel']}): {len(data['sites'])}개 사이트")
```

---

## 라벨 표시를 위한 UI 확장

### 사이트 선택 드롭다운 (계정 라벨 포함)

```javascript
// 전체 사이트 목록 계산
function getAllSites(mergedPayload) {
  const sites = new Set();
  for (const account of Object.values(mergedPayload.accounts)) {
    for (const site of account.sites) {
      sites.add(site);
    }
  }
  return Array.from(sites).sort();
}

function renderSiteDropdownWithAccount(mergedPayload) {
  const allSites = getAllSites(mergedPayload);

  const options = allSites.map(site => {
    // 계정 찾기
    const accountEmail = Object.keys(mergedPayload.accounts).find(email =>
      mergedPayload.accounts[email].sites.includes(site)
    );
    const account = accountEmail ? mergedPayload.accounts[accountEmail] : null;
    const shortLabel = account?.shortLabel || "Unknown";

    return `
      <option value="${site}">
        [${shortLabel}] ${getSiteLabel(site)}
      </option>
    `;
  }).join('');

  return `
    <select id="sadv-site-select">
      <option value="">사이트 선택</option>
      ${options}
    </select>
  `;
}

// 사용 예시:
const mergedPayload = window.EXPORT_PAYLOAD;
const dropdownHtml = renderSiteDropdownWithAccount(mergedPayload);
```

### 사이트 카드에 계정 라벨 표시

```javascript
function renderSiteCardWithAccount(site, accountEmail, accounts) {
  const account = accounts[accountEmail];
  const accountLabel = account?.shortLabel || "Unknown";
  const accountColor = getAccountColor(accountEmail);

  return `
    <div class="site-card" data-site="${site}" data-account="${accountEmail}">
      <div class="account-badge" style="background: ${accountColor}">
        ${accountLabel}
      </div>
      <div class="site-label">${getSiteLabel(site)}</div>
      <!-- 나머지 사이트 데이터 -->
    </div>
  `;
}

function getAccountColor(accountEmail) {
  // 계정별 고유 색상 생성
  const colors = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#a855f7'];
  const hash = accountEmail.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
```

---

## 확장성을 위한 상수 및 헬퍼 함수

```javascript
// 00-constants.js 또는 별도 확장 모듈

const MERGE_CONSTANTS = {
  SCHEMA_VERSION: "20260317-merge-contract-v1",
  MAX_ACCOUNTS: 10,
  MAX_SITES_PER_ACCOUNT: 100,
  ACCOUNT_COLORS: ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#a855f7', '#14b8a6', '#f97316', '#ec4899'],
};

function validateMergedPayload(payload) {
  if (!payload.accounts) return false;
  if (Object.keys(payload.accounts).length > MERGE_CONSTANTS.MAX_ACCOUNTS) {
    console.warn(`계정 수 초과: ${Object.keys(payload.accounts).length}`);
  }
  return true;
}

// 사이트의 계정 찾기 (O(n) 순회)
function getAccountForSite(siteUrl, mergedPayload) {
  for (const [email, account] of Object.entries(mergedPayload.accounts)) {
    if (account.sites.includes(siteUrl)) {
      return { email, account };
    }
  }
  return null;
}

function getAllSitesForAccount(accountEmail, payload) {
  return payload.accounts?.[accountEmail]?.sites || [];
}
```

---

## 역호환성 보장

```javascript
// 레거시 단일 계정 payload도 처리 가능하도록

function normalizePayload(payload) {
  if (payload.accounts) {
    // 이미 병합된 payload
    return payload;
  }

  // 단일 계정 payload를 병합 형식으로 변환
  const accountEmail = payload.__meta?.accountEmail || "unknown@naver.com";

  return {
    __meta: {
      version: MERGE_CONSTANTS.SCHEMA_VERSION,
      mergedAt: new Date().toISOString(),
      mergeStrategy: "single-account"
    },
    accounts: {
      [accountEmail]: {
        encId: payload.__meta?.encId || "",
        label: accountEmail,
        shortLabel: accountEmail.split("@")[0],
        sites: payload.allSites || [],
        dataBySite: payload.dataBySite || {}
      }
    }
  };
}

// 전체 사이트 목록 가져오기
function getAllSites(mergedPayload) {
  const sites = new Set();
  for (const account of Object.values(mergedPayload.accounts)) {
    for (const site of account.sites) {
      sites.add(site);
    }
  }
  return Array.from(sites).sort();
}

// 사이트의 계정 찾기 (O(n) 조회)
function getAccountForSite(siteUrl, mergedPayload) {
  for (const [email, account] of Object.entries(mergedPayload.accounts)) {
    if (account.sites.includes(siteUrl)) {
      return { email, account };
    }
  }
  return null;
}
```

---

## 요약

### 확장성 포인트
1. **계정 이메일을 최상위 키로 사용** → 계정별 데이터 격리 및 확장 용이
2. **siteToAccount 매핑** → 사이트-계정 관계 명확히 추적
3. **별도 색상 할당** → 계정 시각적 구분
4. **역호환성 함수** → 기존 단일 계정 스냅샷도 처리 가능

### 호환성 포인트
1. **버전 문자열** → payload 구조 변경 감지
2. **normalizePayload** → 단일/병합 구조 통합 처리
3. **상수 분리** → 최대 계정/사이트 수 등 한계 값 관리
