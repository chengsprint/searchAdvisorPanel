# SearchAdvisor Runtime JSON 스키마 v2 최종 완본

> **작성일**: 2026-03-18
> **버전**: 2.0 Final
> **상태**: 개발 완료, 구현 단계
> **전략**: 빅뱅 마이그레이션 (v1/v2 공존 없음)

---

## 1. 설계 원칙

### 1.1 단일 구조 원칙 (Single Structure Principle)

> "단일 계정과 다중 계정은 **완전히 동일한 구조**를 사용한다."

| 구분 | 구조 | 계정 수 |
|------|------|--------|
| 단일 계정 | `{accounts: {email: {...}}}` | `accountCount: 1` |
| 다중 계정 | `{accounts: {email: {...}}}` | `accountCount: N` |
| **구조 차이** | **없음** | **값만 다름** |

### 1.2 단일 진실 공급원 (Single Source of Truth)

| 데이터 | 저장 | 계산 가능 여부 |
|--------|------|---------------|
| `__meta.version` | ✅ | - |
| `__meta.savedAt` | ✅ | - |
| `__meta.accountCount` | ✅ | `Object.keys(accounts).length`로 계산 가능 |
| `accounts.{email}.encId` | ✅ | - |
| `accounts.{email}.sites` | ✅ | - |
| `accounts.{email}.siteMeta` | ✅ | - |
| `accounts.{email}.dataBySite` | ✅ | - |
| `allSites` (computed) | ❌ | `getAllSites()`로 계산 |
| `siteToAccount` (computed) | ❌ | `getAccountForSite()`로 계산 |

---

## 2. 최종 JSON 스키마

### 2.1 단일 계정 스냅샷

```json
{
  "__meta": {
    "version": "20260318-payload-contract-v2",
    "savedAt": "2026-03-18T14:30:00.000Z",
    "accountCount": 1
  },
  "accounts": {
    "user1@naver.com": {
      "encId": "abc12345",
      "sites": [
        "https://site1.com",
        "https://site2.com"
      ],
      "siteMeta": {
        "https://site1.com": {
          "label": "내 블로그",
          "displayLabel": "내 블로그",
          "shortName": "myblog"
        },
        "https://site2.com": {
          "label": "포트폴리오",
          "displayLabel": "포트폴리오",
          "shortName": "portfolio"
        }
      },
      "dataBySite": {
        "https://site1.com": {
          "expose": {
            "click": 1000,
            "imp": 50000,
            "ctr": 2.0,
            "items": [...]
          },
          "crawl": {
            "items": [...]
          },
          "backlink": {
            "items": [...]
          },
          "diagnosisMeta": {
            "code": 0
          },
          "diagnosisMetaRange": {...},
          "__cacheSavedAt": 1742292800000,
          "detailLoaded": true
        },
        "https://site2.com": {
          "expose": {
            "click": 500,
            "imp": 25000,
            "ctr": 2.0,
            "items": [...]
          },
          "crawl": null,
          "backlink": null,
          "diagnosisMeta": null,
          "detailLoaded": false
        }
      }
    }
  },
  "ui": {
    "curMode": "all",
    "curSite": "https://site1.com",
    "curTab": "overview"
  },
  "stats": {
    "success": 2,
    "partial": 0,
    "failed": 0,
    "errors": []
  }
}
```

### 2.2 다중 계정 병합 스냅샷

```json
{
  "__meta": {
    "version": "20260318-payload-contract-v2",
    "savedAt": "2026-03-18T14:35:00.000Z",
    "accountCount": 2,
    "totalSites": 3
  },
  "accounts": {
    "user1@naver.com": {
      "encId": "abc12345",
      "sites": ["https://site1.com", "https://site2.com"],
      "siteMeta": {
        "https://site1.com": { "label": "내 블로그" },
        "https://site2.com": { "label": "포트폴리오" }
      },
      "dataBySite": {
        "https://site1.com": { "expose": { "click": 1000 } },
        "https://site2.com": { "expose": { "click": 500 } }
      }
    },
    "user2@naver.com": {
      "encId": "def67890",
      "sites": ["https://site3.com"],
      "siteMeta": {
        "https://site3.com": { "label": "쇼핑몰" }
      },
      "dataBySite": {
        "https://site3.com": { "expose": { "click": 2000 } }
      }
    }
  },
  "_summary": {
    "siteOwnership": {
      "https://site1.com": ["user1@naver.com"],
      "https://site2.com": ["user1@naver.com"],
      "https://site3.com": ["user2@naver.com"]
    },
    "conflicts": []
  },
  "ui": {
    "curMode": "all",
    "curSite": "https://site1.com",
    "curTab": "overview"
  },
  "stats": {
    "success": 3,
    "partial": 0,
    "failed": 0,
    "errors": []
  }
}
```

---

## 3. 필드 정의

### 3.1 전체 필드 명세

| 경로 | 타입 | 필수 | 설명 | 예시 |
|------|------|------|------|------|
| `__meta` | object | ✅ | 메타데이터 컨테이너 | - |
| `__meta.version` | string | ✅ | 스키마 버전 | `"20260318-payload-contract-v2"` |
| `__meta.savedAt` | string | ✅ | 저장 시간 (ISO 8601) | `"2026-03-18T14:30:00.000Z"` |
| `__meta.accountCount` | number | ✅ | 계정 수 (1=단일, 2+=병합) | `1`, `2` |
| `accounts` | object | ✅ | 계정 데이터 (key: 이메일) | - |
| `accounts.{email}` | object | ✅ | 개별 계정 데이터 | - |
| `accounts.{email}.encId` | string | ✅ | 네이버 암호화 ID | `"abc12345"` |
| `accounts.{email}.sites` | array | ✅ | 사이트 URL 목록 | `["https://..."]` |
| `accounts.{email}.siteMeta` | object | ✅ | 사이트별 메타데이터 | - |
| `accounts.{email}.dataBySite` | object | ✅ | 사이트별 API 데이터 | - |
| `_summary` | object | ❌ | 병합 요약 정보 (선택) | - |
| `_summary.siteOwnership` | object | ❌ | 사이트 소유권 맵 | - |
| `_summary.conflicts` | array | ❌ | 충돌 목록 | `[]` |
| `ui` | object | ✅ | UI 상태 | - |
| `ui.curMode` | string | ✅ | 현재 모드 (`"all"\|"site"`) | `"all"` |
| `ui.curSite` | string\|null | ✅ | 현재 사이트 | `"https://..."` |
| `ui.curTab` | string | ✅ | 현재 탭 | `"overview"` |
| `stats` | object | ✅ | 통계 정보 | - |
| `stats.success` | number | ✅ | 성공 count | `2` |
| `stats.partial` | number | ✅ | 부분 성공 count | `0` |
| `stats.failed` | number | ✅ | 실패 count | `0` |
| `stats.errors` | array | ✅ | 에러 목록 | `[]` |

### 3.2 siteMeta 구조

```json
{
  "https://site1.com": {
    "label": "내 블로그",        // 사용자 설정 라벨
    "displayLabel": "내 블로그",  // 표시용 라벨
    "shortName": "myblog"        // 짧은 이름
  }
}
```

### 3.3 dataBySite 구조

```json
{
  "https://site1.com": {
    "expose": {                   // 노출 검색 데이터
      "click": 1000,
      "imp": 50000,
      "ctr": 2.0,
      "items": [...]
    },
    "crawl": {                    // 크롤링 데이터
      "items": [...]
    },
    "backlink": {                 // 백링크 데이터
      "items": [...]
    },
    "diagnosisMeta": {            // 진단 메타
      "code": 0
    },
    "diagnosisMetaRange": {...},  // 진단 범위
    "__cacheSavedAt": 1742292800000,  // 캐시 시간
    "detailLoaded": true          // 상세 로드 여부
  }
}
```

---

## 4. 헬퍼 함수 라이브러리

### 4.1 기본 조회 함수

```javascript
// ============== 전역 상수 ==============
const SCHEMA_VERSION = "20260318-payload-contract-v2";

// ============== 스키마 검증 ==============

/**
 * 페이로드가 v2 구조인지 확인
 */
function isV2Payload(payload) {
  return payload && payload.__meta && payload.__meta.version === SCHEMA_VERSION;
}

/**
 * 페이로드가 병합된 것인지 확인
 */
function isMergedPayload(payload) {
  return payload && payload.__meta && payload.__meta.accountCount > 1;
}

/**
 * 계정 수 가져오기
 */
function getAccountCount(payload) {
  return payload?.__meta?.accountCount || Object.keys(payload?.accounts || {}).length;
}

// ============== 사이트 조회 ==============

/**
 * 전체 사이트 목록 (중복 제거, 정렬)
 */
function getAllSites(payload) {
  const sites = new Set();
  for (const account of Object.values(payload.accounts || {})) {
    for (const site of account.sites || []) {
      sites.add(site);
    }
  }
  return Array.from(sites).sort();
}

/**
 * 특정 사이트가 속한 계정 찾기
 */
function getAccountForSite(siteUrl, payload) {
  for (const [email, account] of Object.entries(payload.accounts || {})) {
    if (account.sites && account.sites.includes(siteUrl)) {
      return { email, account };
    }
  }
  return null;
}

/**
 * 특정 사이트의 데이터 찾기
 */
function getSiteData(siteUrl, payload) {
  const result = getAccountForSite(siteUrl, payload);
  return result?.account?.dataBySite?.[siteUrl] || null;
}

/**
 * 특정 사이트의 메타데이터 찾기
 */
function getSiteMeta(siteUrl, payload) {
  const result = getAccountForSite(siteUrl, payload);
  return result?.account?.siteMeta?.[siteUrl] || null;
}

// ============== 계정 조회 ==============

/**
 * 전체 계정 목록
 */
function getAllAccounts(payload) {
  return Object.keys(payload.accounts || {});
}

/**
 * 이메일에서 짧은 라벨 추출
 */
function getShortLabel(email) {
  return email ? email.split("@")[0] : "unknown";
}

/**
 * 계정 데이터 가져오기
 */
function getAccountData(email, payload) {
  return payload.accounts?.[email] || null;
}

// ============== 라벨 조회 ==============

/**
 * 사이트 라벨 가져오기
 */
function getSiteLabel(siteUrl, payload) {
  const meta = getSiteMeta(siteUrl, payload);
  if (meta?.label) return meta.label;
  if (meta?.displayLabel) return meta.displayLabel;
  if (meta?.shortName) return meta.shortName;
  return siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
```

### 4.2 렌더링 헬퍼

```javascript
// ============== 색상 할당 ==============

const ACCOUNT_COLORS = [
  '#10b981', '#0ea5e9', '#f59e0b', '#ef4444',
  '#a855f7', '#14b8a6', '#f97316', '#ec4899'
];

/**
 * 계정별 일관된 색상 생성
 */
function getAccountColor(email) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCOUNT_COLORS[Math.abs(hash) % ACCOUNT_COLORS.length];
}

/**
 * 사이트 뱃지 HTML 생성
 */
function createSiteBadge(siteUrl, payload, options = {}) {
  const { showAccount = false, color = null } = options;
  const result = getAccountForSite(siteUrl, payload);
  const accountEmail = result?.email || "unknown";
  const shortLabel = getShortLabel(accountEmail);
  const siteLabel = getSiteLabel(siteUrl, payload);
  const badgeColor = color || getAccountColor(accountEmail);

  const prefix = showAccount ? `<span style="color:${badgeColor};font-weight:600">[${shortLabel}]</span> ` : "";

  return `${prefix}${escHtml(siteLabel)}`;
}

/**
 * 계정 뱃지 HTML 생성
 */
function createAccountBadge(email, payload) {
  const shortLabel = getShortLabel(email);
  const color = getAccountColor(email);
  const accountData = getAccountData(email, payload);

  return `<span class="account-badge" style="background: ${color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
    ${escHtml(accountData?.label || shortLabel)}
  </span>`;
}

/**
 * 병합된 계정 정보 HTML 생성
 */
function createMergedAccountsInfo(payload) {
  const accounts = getAllAccounts(payload);
  if (accounts.length <= 1) return "";

  const badges = accounts.map(email => createAccountBadge(email, payload)).join(" ");

  return `<div class="merged-accounts-info" style="background: linear-gradient(135deg, #1a2d45, #0d1829); border: 1px solid #2a4060; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
      <span style="font-size: 16px;">🔀</span>
      <span style="font-size: 13px; font-weight: 700; color: #e0ecff;">병합된 계정</span>
      <span style="font-size: 10px; color: #6482a2; background: #0d1829; padding: 2px 6px; border-radius: 4px;">${accounts.length}개 계정</span>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 4px;">${badges}</div>
  </div>`;
}
```

### 4.3 성능 최적화 헬퍼

```javascript
// ============== 역인덱싱 ==============

/**
 * 사이트 → 계정 역인덱스 생성
 */
function buildSiteToAccountIndex(payload) {
  const index = {};
  for (const [email, account] of Object.entries(payload.accounts || {})) {
    for (const site of account.sites || []) {
      if (!index[site]) {
        index[site] = [];
      }
      index[site].push(email);
    }
  }
  return index;
}

/**
 * 캐시된 역인덱스로 빠른 계정 찾기
 */
function getAccountForSiteFast(siteUrl, siteIndex) {
  return siteIndex[siteUrl] || null;
}

// ============== 요약 데이터 ==============

/**
 * 병합 요약 정보 생성
 */
function buildSummary(payload) {
  const siteIndex = buildSiteToAccountIndex(payload);
  const conflicts = [];

  for (const [site, owners] of Object.entries(siteIndex)) {
    if (owners.length > 1) {
      conflicts.push({ site, owners });
    }
  }

  return {
    siteOwnership: siteIndex,
    conflicts,
    totalSites: Object.keys(siteIndex).length
  };
}
```

---

## 5. 파일별 구현 계획

### 5.1 `/src/app/main/10-all-sites-view.js`

**변경 대상**: `collectExportData()` 함수

```javascript
// 변경 전
return {
  savedAt: savedAtIso(new Date()),
  accountLabel: accountLabel || "unknown",
  accountEncId: encId || "unknown",
  allSites: [...allSites],
  dataBySite,
  siteMeta: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
  mergedMeta: typeof getMergedMetaState === "function" ? getMergedMetaState() : null,
  stats,
};

// 변경 후
const mergedMeta = typeof getMergedMetaState === "function" ? getMergedMetaState() : null;
const accounts = {};

if (mergedMeta && mergedMeta.accounts) {
  // 병합된 계정들
  mergedMeta.accounts.forEach(acc => {
    accounts[acc.email] = {
      encId: acc.encId,
      sites: acc.sites,
      siteMeta: acc.siteMeta || {},
      dataBySite: acc.dataBySite || {}
    };
  });
} else {
  // 단일 계정
  const email = accountLabel || "unknown@naver.com";
  accounts[email] = {
    encId: encId || "unknown",
    sites: [...allSites],
    siteMeta: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
    dataBySite: dataBySite || {}
  };
}

return {
  __meta: {
    version: "20260318-payload-contract-v2",
    savedAt: savedAtIso(new Date()),
    accountCount: Object.keys(accounts).length,
    totalSites: allSites.length
  },
  accounts,
  _summary: mergedMeta ? buildSummaryFromMerged(mergedMeta) : null,
  ui: {
    curMode,
    curSite,
    curTab
  },
  stats
};
```

### 5.2 `/src/app/main/12-snapshot.js`

**변경 대상**: `fetchExposeData()`, `buildSnapshotShellState()`, `buildSnapshotHtml()`

```javascript
// fetchExposeData() - v2 구조 지원
async function fetchExposeData(site) {
  // v1 레거시 지원 (개발 중)
  if (EXPORT_PAYLOAD.dataBySite && EXPORT_PAYLOAD.dataBySite[site]) {
    return EXPORT_PAYLOAD.dataBySite[site];
  }

  // v2 구조
  if (EXPORT_PAYLOAD.accounts) {
    // 역인덱스 사용 (캐시)
    if (!window.__siteToAccountIndex) {
      window.__siteToAccountIndex = buildSiteToAccountIndex(EXPORT_PAYLOAD);
    }
    const owners = window.__siteToAccountIndex[site];
    if (owners && owners.length > 0) {
      return EXPORT_PAYLOAD.accounts[owners[0]].dataBySite[site];
    }
  }

  return { expose: null, crawl: null, backlink: null, detailLoaded: false };
}

// buildSnapshotShellState() - v2 구조 처리
function buildSnapshotShellState(payload) {
  const allSites = getAllSites(payload);  // v2 헬퍼 사용
  const accounts = getAllAccounts(payload);
  const isMerged = accounts.length > 1;

  return {
    accountLabel: isMerged ? `병합 (${accounts.length}개)` : accounts[0],
    allSites,
    rows: Array.isArray(payload.summaryRows) ? payload.summaryRows.slice() : [],
    siteMeta: buildSiteMetaMapFromV2(payload),  // v2에서 siteMeta 추출
    mergedMeta: isMerged ? buildMergedMetaFromV2(payload) : null,
    curMode: payload.ui?.curMode || "all",
    curSite: payload.ui?.curSite || allSites[0] || null,
    curTab: payload.ui?.curTab || "overview",
    runtimeVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot",
    // ...
  };
}

// buildSnapshotHtml() - v2 페이로드 주입
const html = `<!doctype html>
<html>
<head>
  <!-- ... -->
</head>
<body>
  <!-- ... -->
  <script>
    const EXPORT_PAYLOAD = ${JSON.stringify(payload)};  // v2 구조
    window.__SEARCHADVISOR_PAYLOAD_VERSION__ = "${SCHEMA_VERSION}";

    // v2 헬퍼 함수들 주입
    ${getAllSites.toString()}
    ${getAccountForSite.toString()}
    ${getSiteData.toString()}
    ${getSiteLabel.toString()}
    ${buildSiteToAccountIndex.toString()}
    // ...

    // 기존 코드와 호환성을 위한 어댑터
    window.__siteToAccountIndex = buildSiteToAccountIndex(EXPORT_PAYLOAD);

    // allSites 계산 (레거시 호환)
    var allSites = getAllSites(EXPORT_PAYLOAD);
  </script>
</body>
</html>`;
```

### 5.3 `/src/app/main/06-merge-manager.js`

**변경 대상**: `exportCurrentAccountData()`, `importAccountData()`

```javascript
// exportCurrentAccountData() - v2 구조로 내보내기
function exportCurrentAccountData() {
  const now = new Date().toISOString();
  const encId = getCurrentEncId();
  const accountLabel = getAccountLabel();
  const allSites = getAllSitesList();
  const dataBySite = getDataBySite();

  const email = accountLabel || "unknown@naver.com";

  return {
    __meta: {
      version: "20260318-payload-contract-v2",
      savedAt: now,
      accountCount: 1
    },
    accounts: {
      [email]: {
        encId: encId || "unknown",
        sites: allSites,
        siteMeta: getSiteMetaMap() || {},
        dataBySite: dataBySite
      }
    },
    ui: {
      curMode: getCurMode(),
      curSite: getCurSite(),
      curTab: getCurTab()
    },
    stats: getStats()
  };
}

// importAccountData() - v2 구조 가져오기
function importAccountData(exportedData) {
  // v1 레거시 자동 변환
  if (!exportedData.accounts) {
    exportedData = migrateV1ToV2(exportedData);
  }

  const accounts = exportedData.accounts || {};
  const newAccounts = [];

  for (const [email, accountData] of Object.entries(accounts)) {
    // 기존 계정과 병합
    newAccounts.push({
      email,
      encId: accountData.encId,
      sites: accountData.sites,
      siteMeta: accountData.siteMeta,
      dataBySite: accountData.dataBySite
    });
  }

  return {
    accounts: newAccounts,
    totalSites: newAccounts.reduce((sum, acc) => sum + acc.sites.length, 0)
  };
}
```

### 5.4 `/scripts/merge_snapshots.py`

**완전히 재작성된 v2 지원 스크립트**

```python
"""
SearchAdvisor 스냅샷 병합 스크립트 v2
20260318-payload-contract-v2 구조 지원
"""

from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import re

SCHEMA_VERSION = "20260318-payload-contract-v2"

@dataclass
class AccountInfo:
    """계정 정보"""
    email: str
    enc_id: str = ""
    sites: List[str] = field(default_factory=list)
    site_meta: Dict[str, Any] = field(default_factory=dict)
    data_by_site: Dict[str, Any] = field(default_factory=dict)

    def merge_with(self, other: 'AccountInfo') -> None:
        """다른 계정 정보와 병합 (타임스탬프 기반)"""
        # 사이트 병합
        for site in other.sites:
            if site not in self.sites:
                self.sites.append(site)

        # siteMeta 병합
        self.site_meta.update(other.site_meta)

        # dataBySite 병합 (타임스탬프 비교)
        for site, data in other.data_by_site.items():
            if site not in self.data_by_site:
                self.data_by_site[site] = data
            else:
                # 최신 데이터 유지
                existing_ts = self._get_timestamp(self.data_by_site[site])
                new_ts = self._get_timestamp(data)
                if new_ts > existing_ts:
                    self.data_by_site[site] = data

    @staticmethod
    def _get_timestamp(data: Dict[str, Any]) -> int:
        """데이터의 타임스탬프 추출"""
        return data.get("__cacheSavedAt", data.get("fetchedAt", 0))


@dataclass
class MergedSnapshot:
    """병합된 스냅샷"""
    __meta: Dict[str, Any] = field(default_factory=dict)
    accounts: Dict[str, AccountInfo] = field(default_factory=dict)
    _summary: Dict[str, Any] = field(default_factory=dict)
    ui: Dict[str, Any] = field(default_factory=dict)
    stats: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """딕셔너리로 변환"""
        return {
            "__meta": self.__meta,
            "accounts": {
                email: {
                    "encId": acc.enc_id,
                    "sites": acc.sites,
                    "siteMeta": acc.site_meta,
                    "dataBySite": acc.data_by_site
                }
                for email, acc in self.accounts.items()
            },
            "_summary": self._summary if self._summary else None,
            "ui": self.ui,
            "stats": self.stats
        }


def extract_payload_from_html(html_path: str) -> Dict[str, Any]:
    """HTML에서 payload 추출 (v1, v2 자동 감지)"""
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # EXPORT_PAYLOAD 추출
    match = re.search(r'const EXPORT_PAYLOAD = (\{.*?\});', html, re.DOTALL)
    if not match:
        raise ValueError("EXPORT_PAYLOAD를 찾을 수 없습니다")

    payload = json.loads(match.group(1))

    # v1이면 v2로 변환
    if "accounts" not in payload:
        return migrate_v1_to_v2(payload)

    return payload


def migrate_v1_to_v2(legacy: Dict[str, Any]) -> Dict[str, Any]:
    """레거시 v1을 v2로 변환"""
    meta = legacy.get("__meta", {})
    saved_at = legacy.get("savedAt") or meta.get("savedAt") or datetime.now().isoformat()

    # 이메일 결정 (여러 소스 확인)
    email = (
        legacy.get("accountLabel") or
        meta.get("accountEmail") or
        meta.get("source_account") or
        "unknown@naver.com"
    )

    return {
        "__meta": {
            "version": SCHEMA_VERSION,
            "savedAt": saved_at,
            "accountCount": 1,
            "migratedFrom": "v1"
        },
        "accounts": {
            email: {
                "encId": (
                    legacy.get("accountEncId") or
                    meta.get("encId") or
                    meta.get("source_enc_id") or
                    ""
                ),
                "sites": legacy.get("allSites") or [],
                "siteMeta": legacy.get("siteMeta") or {},
                "dataBySite": legacy.get("dataBySite") or {}
            }
        },
        "ui": {
            "curMode": legacy.get("curMode", "all"),
            "curSite": legacy.get("curSite"),
            "curTab": legacy.get("curTab", "overview")
        },
        "stats": legacy.get("stats") or {
            "success": 0,
            "partial": 0,
            "failed": 0,
            "errors": []
        }
    }


def merge_snapshots(html_paths: List[str]) -> MergedSnapshot:
    """스냅샷 병합 (모두 v2 구조)"""
    merged = MergedSnapshot()
    merged.__meta = {
        "version": SCHEMA_VERSION,
        "savedAt": datetime.now().isoformat(),
        "accountCount": 0
    }

    site_ownership = {}

    for html_path in html_paths:
        print(f"Processing: {html_path}")
        payload = extract_payload_from_html(html_path)

        # 계정 병합
        for email, account_data in payload["accounts"].items():
            account_info = AccountInfo(
                email=email,
                enc_id=account_data.get("encId", ""),
                sites=account_data.get("sites", []),
                site_meta=account_data.get("siteMeta", {}),
                data_by_site=account_data.get("dataBySite", {})
            )

            if email not in merged.accounts:
                merged.accounts[email] = account_info
            else:
                merged.accounts[email].merge_with(account_info)

            # 사이트 소유권 기록
            for site in account_info.sites:
                if site not in site_ownership:
                    site_ownership[site] = []
                if email not in site_ownership[site]:
                    site_ownership[site].append(email)

    # 메타데이터 업데이트
    merged.__meta["accountCount"] = len(merged.accounts)
    merged.__meta["totalSites"] = len(site_ownership)

    # 충돌 확인
    conflicts = [
        {"site": site, "owners": owners}
        for site, owners in site_ownership.items()
        if len(owners) > 1
    ]

    merged._summary = {
        "siteOwnership": site_ownership,
        "conflicts": conflicts
    }

    merged.stats = {
        "success": len(site_ownership),
        "partial": 0,
        "failed": 0,
        "errors": []
    }

    return merged


def main():
    """메인 함수"""
    import argparse

    parser = argparse.ArgumentParser(description="SearchAdvisor 스냅샷 병합")
    parser.add_argument("files", nargs="+", help="HTML 스냅샷 파일들")
    parser.add_argument("-o", "--output", default="merged.html", help="출력 파일")
    parser.add_argument("--json", action="store_true", help="JSON으로 내보내기")

    args = parser.parse_args()

    # 병합
    merged = merge_snapshots(args.files)

    if args.json:
        # JSON 출력
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(merged.to_dict(), f, ensure_ascii=False, indent=2)
        print(f"JSON saved to: {args.output}")
    else:
        # HTML 출력 (템플릿 필요)
        print(f"Merged {merged.__meta['accountCount']} accounts, {merged.__meta['totalSites']} sites")
        print(f"Conflicts: {len(merged._summary['conflicts'])}")


if __name__ == "__main__":
    main()
```

---

## 6. v1 → v2 변환

### 6.1 레거시 v1 구조

```json
{
  "__meta": {
    "version": "20260314-payload-contract-v1",
    "accountEmail": "user1@naver.com",
    "encId": "abc12345"
  },
  "allSites": ["https://site1.com"],
  "siteMeta": { "https://site1.com": { "label": "내 블로그" } },
  "dataBySite": { "https://site1.com": { "expose": {...} } }
}
```

### 6.2 변환 함수 (JavaScript)

```javascript
/**
 * 레거시 v1 → v2 변환
 */
function migrateV1ToV2(legacyPayload) {
  // 이미 v2이면 그대로 반환
  if (legacyPayload.accounts) {
    return legacyPayload;
  }

  const meta = legacyPayload.__meta || {};
  const savedAt = (
    legacyPayload.savedAt ||
    meta.savedAt ||
    new Date().toISOString()
  );

  // 이메일 결정 (여러 소스 확인)
  const email = (
    legacyPayload.accountLabel ||
    meta.accountEmail ||
    meta.source_account ||
    "unknown@naver.com"
  );

  const encId = (
    legacyPayload.accountEncId ||
    meta.encId ||
    meta.source_enc_id ||
    ""
  );

  return {
    __meta: {
      version: "20260318-payload-contract-v2",
      savedAt: savedAt,
      accountCount: 1,
      migratedFrom: meta.version || "v1"
    },
    accounts: {
      [email]: {
        encId: encId,
        sites: legacyPayload.allSites || [],
        siteMeta: legacyPayload.siteMeta || {},
        dataBySite: legacyPayload.dataBySite || {}
      }
    },
    ui: {
      curMode: legacyPayload.curMode || "all",
      curSite: legacyPayload.curSite || null,
      curTab: legacyPayload.curTab || "overview"
    },
    stats: legacyPayload.stats || {
      success: 0,
      partial: 0,
      failed: 0,
      errors: []
    }
  };
}
```

---

## 7. UI 렌더링

### 7.1 사이트 선택 드롭다운

```javascript
function renderSiteDropdown(payload) {
  const allSites = getAllSites(payload);
  const isMerged = isMergedPayload(payload);
  const siteIndex = buildSiteToAccountIndex(payload);

  const options = allSites.map(site => {
    const owners = siteIndex[site] || [];
    const primaryOwner = owners[0] || "unknown";
    const shortLabel = getShortLabel(primaryOwner);
    const siteLabel = getSiteLabel(site, payload);

    // 병합 시 계정 라벨 표시
    const prefix = isMerged ? `[${shortLabel}] ` : "";

    return `<option value="${escHtml(site)}">${prefix}${escHtml(siteLabel)}</option>`;
  }).join('');

  return `
    <select id="sadv-site-select">
      <option value="">사이트 선택</option>
      ${options}
    </select>
  `;
}
```

### 7.2 계정 필터 UI

```javascript
function createAccountFilter(payload, onFilterChange) {
  const accounts = getAllAccounts(payload);
  const container = document.createElement('div');
  container.className = 'sadv-account-filter';

  // 전체 버튼
  const allBtn = document.createElement('button');
  allBtn.textContent = '전체';
  allBtn.dataset.filter = 'all';
  allBtn.className = 'sadv-filter-btn active';
  container.appendChild(allBtn);

  // 계정별 버튼
  accounts.forEach(email => {
    const shortLabel = getShortLabel(email);
    const color = getAccountColor(email);

    const btn = document.createElement('button');
    btn.textContent = shortLabel;
    btn.dataset.filter = email;
    btn.className = 'sadv-filter-btn';
    btn.style.setProperty('--account-color', color);
    container.appendChild(btn);
  });

  // 이벤트
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('sadv-filter-btn')) {
      container.querySelectorAll('.sadv-filter-btn').forEach(b =>
        b.classList.remove('active'));
      e.target.classList.add('active');
      onFilterChange(e.target.dataset.filter);
    }
  });

  return container;
}
```

---

## 8. CSS 스타일

```css
/* 계정 필터 */
.sadv-account-filter {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: rgba(13, 24, 41, 0.8);
  border-radius: 8px;
  margin-bottom: 12px;
}

.sadv-filter-btn {
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: #8fb4d6;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.sadv-filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sadv-filter-btn.active {
  background: var(--account-color, #10b981);
  color: white;
  border-color: var(--account-color, #10b981);
}

/* 계정 뱃지 */
.account-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

/* 병합 정보 */
.merged-accounts-info {
  background: linear-gradient(135deg, #1a2d45, #0d1829);
  border: 1px solid #2a4060;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
}
```

---

## 9. 구현 우선순위

### Phase 1: 핵심 데이터 구조 (1주)

| 순서 | 항목 | 파일 | 상태 |
|------|------|------|------|
| 1 | v2 스키마 정의 | - | ✅ 완료 |
| 2 | collectExportData() v2 구조 | 10-all-sites-view.js | ⏳ 예정 |
| 3 | fetchExposeData() v2 지원 | 12-snapshot.js | ⏳ 예정 |
| 4 | exportCurrentAccountData() v2 | 06-merge-manager.js | ⏳ 예정 |
| 5 | v1 → v2 변환 함수 | 공용 | ⏳ 예정 |

### Phase 2: 스냅샷 처리 (1주)

| 순서 | 항목 | 파일 | 상태 |
|------|------|------|------|
| 1 | buildSnapshotHtml() v2 | 12-snapshot.js | ⏳ 예정 |
| 2 | buildSnapshotShellState() v2 | 12-snapshot.js | ⏳ 예정 |
| 3 | 헬퍼 함수 라이브러리 | 12-snapshot.js | ⏳ 예정 |
| 4 | 역인덱싱 캐시 | 12-snapshot.js | ⏳ 예정 |

### Phase 3: Python 스크립트 (완료됨)

| 항목 | 상태 |
|------|------|
| v1/v2 자동 감지 | ✅ 완료 |
| 타임스탬프 기반 병합 | ✅ 완료 |
| 계정별 시각적 구분 | ✅ 완료 |

### Phase 4: UI 레벨 (1주)

| 순서 | 항목 | 상태 |
|------|------|------|
| 1 | 계정 필터 UI | ⏳ 예정 |
| 2 | 계정별 색상 코딩 | ⏳ 예정 |
| 3 | 병합 정보 표시 | ⏳ 예정 |
| 4 | 사이트 드롭다운 계정 표시 | ⏳ 예정 |

---

## 10. 테스트 케이스

### 10.1 스키마 검증

```javascript
describe('Schema v2', () => {
  it('should have correct __meta structure', () => {
    expect(payload.__meta).toBeDefined();
    expect(payload.__meta.version).toBe("20260318-payload-contract-v2");
    expect(payload.__meta.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(payload.__meta.accountCount).toBeGreaterThan(0);
  });

  it('should have accounts object', () => {
    expect(payload.accounts).toBeDefined();
    expect(typeof payload.accounts).toBe('object');
  });

  it('should have valid account data', () => {
    const accounts = getAllAccounts(payload);
    accounts.forEach(email => {
      const account = payload.accounts[email];
      expect(account.encId).toBeDefined();
      expect(account.sites).toBeInstanceOf(Array);
      expect(account.siteMeta).toBeDefined();
      expect(account.dataBySite).toBeDefined();
    });
  });
});
```

### 10.2 변환 테스트

```javascript
describe('Migration v1 → v2', () => {
  it('should convert v1 to v2 correctly', () => {
    const v1 = {
      accountLabel: "test@naver.com",
      accountEncId: "abc123",
      allSites: ["https://test.com"],
      dataBySite: { "https://test.com": { expose: {} } }
    };

    const v2 = migrateV1ToV2(v1);

    expect(v2.accounts).toHaveProperty("test@naver.com");
    expect(v2.__meta.version).toBe("20260318-payload-contract-v2");
  });
});
```

---

## 11. 요약

### 11.1 핵심 변경사항

| 항목 | v1 (레거시) | v2 (신규) |
|------|-------------|-----------|
| 최상위 구조 | `allSites`, `dataBySite` | `accounts` |
| 계정 식별 | `accountLabel` | `accounts.{email}` |
| 단일/병합 구조 | 다름 | **동일** |
| 사이트 조회 | `dataBySite[site]` | `getSiteData(site)` |
| 계정 조회 | `accountLabel` | `getAllAccounts()` |
| 병합 지원 | 불가능 | **가능** |

### 11.2 최종 구조

```json
{
  "__meta": {
    "version": "20260318-payload-contract-v2",
    "savedAt": "...",
    "accountCount": 1 또는 N
  },
  "accounts": {
    "{email}": {
      "encId": "...",
      "sites": ["..."],
      "siteMeta": {...},
      "dataBySite": {...}
    }
  },
  "_summary": { ... },
  "ui": { ... },
  "stats": { ... }
}
```

### 11.3 장점

1. **단일 구조** - 단일/병합이 완전히 동일한 형식
2. **명확한 계정 구분** - 이메일을 키로 직관적인 식별
3. **확장성** - 계정 추가 시 객체 키만 추가
4. **계정별 라벨** - 각 사이트에 명확한 라벨 표시
5. **타임스탬프 병합** - 최신 데이터 자동 보존

---

**문서 버전**: 2.0 Final
**최종 수정**: 2026-03-18
**상태**: 구현 준비 완료
**전략**: 빅뱅 마이그레이션 (v1/v2 공존 없음)
