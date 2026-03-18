# 병합 기능 최종 설계 계획서 (구조 통일)

**작성일:** 2026-03-17
**버전:** 2.0
**상태:** 최종 확정

---

## 1. 설계 원칙

### 1.1 단일 구조 (Single Structure)

> "단일 계정과 다중 계정은 **같은 구조**를 사용한다."

| 구분 | 과거 설계 (❌) | 새로운 설계 (✅) |
|------|---------------|----------------|
| 단일 계정 | `{allSites, dataBySite}` | `{accounts: {email: {...}}}` |
| 다중 계정 | `{accounts: {email: {...}}}` | `{accounts: {email: {...}}}` |
| 구조 차이 | 있음 (불일치) | 없음 (완전 동일) |

### 1.2 단일 진실 공급원 (Single Source of Truth)

| 데이터 | 저장 여부 | 이유 |
|--------|----------|------|
| 계정 이메일 | ✅ | 객체 키로 사용 |
| encId | ✅ | 네이버 API 데이터 |
| sites | ✅ | 등록된 사이트 목록 |
| siteMeta | ✅ | 사이트 메타데이터 |
| dataBySite | ✅ | 실제 API 데이터 |
| label | ❌ | 키(이메일)와 중복 |
| shortLabel | ❌ | email.split("@")[0]로 계산 |
| allSites | ❌ | accounts 순회로 계산 |
| siteToAccount | ❌ | accounts 순회로 찾기 |

---

## 2. 통합 JSON 스키마

### 2.1 단일 계정 스냅샷 (새로운 구조)

```json
{
  "__meta": {
    "version": "20260317-payload-contract-v2",
    "savedAt": "2026-03-17T14:30:00.000Z",
    "accountCount": 1
  },
  "accounts": {
    "user1@naver.com": {
      "encId": "abc12345",
      "sites": ["https://site1.com", "https://site2.com"],
      "siteMeta": {
        "https://site1.com": {
          "label": "내 블로그",
          "shortName": "myblog"
        }
      },
      "dataBySite": {
        "https://site1.com": {
          "expose": { "click": 1000 },
          "crawl": { ... },
          "backlink": { ... }
        }
      }
    }
  }
}
```

### 2.2 병합된 스냅샷 (같은 구조)

```json
{
  "__meta": {
    "version": "20260317-payload-contract-v2",
    "savedAt": "2026-03-17T14:35:00.000Z",
    "accountCount": 2
  },
  "accounts": {
    "user1@naver.com": {
      "encId": "abc12345",
      "sites": ["https://site1.com", "https://site2.com"],
      "siteMeta": {
        "https://site1.com": { "label": "내 블로그" }
      },
      "dataBySite": {
        "https://site1.com": { "expose": { "click": 1000 } }
      }
    },
    "user2@naver.com": {
      "encId": "def67890",
      "sites": ["https://site3.com"],
      "siteMeta": {},
      "dataBySite": {
        "https://site3.com": { "expose": { "click": 2000 } }
      }
    }
  }
}
```

### 2.3 구조 비교

| 항목 | 단일 계정 | 병합 | 차이 |
|------|----------|------|------|
| `__meta.version` | ✅ | ✅ | 동일 |
| `__meta.savedAt` | ✅ | ✅ | 동일 |
| `__meta.accountCount` | 1 | 2+ | 값만 다름 |
| `accounts` | ✅ | ✅ | 동일 |
| `accounts.{email}` | 1개 | 2+개 | 개수만 다름 |
| 내부 구조 | ✅ | ✅ | **완전 동일** |

---

## 3. 필드 정의

### 3.1 전체 필드

| 경로 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `__meta` | object | ✅ | 메타데이터 |
| `__meta.version` | string | ✅ | 스키마 버전 (`20260317-payload-contract-v2`) |
| `__meta.savedAt` | string | ✅ | 저장 시간 (ISO 8601) |
| `__meta.accountCount` | number | ✅ | 계정 수 (1이면 단일, 2+이면 병합) |
| `accounts` | object | ✅ | 계정 데이터 (key: 이메일) |
| `accounts.{email}` | object | ✅ | 개별 계정 |
| `accounts.{email}.encId` | string | ✅ | 네이버 encId |
| `accounts.{email}.sites` | array | ✅ | 사이트 URL 목록 |
| `accounts.{email}.siteMeta` | object | ✅ | 사이트별 메타데이터 |
| `accounts.{email}.dataBySite` | object | ✅ | 사이트별 API 데이터 |

### 3.2 siteMeta 구조

```json
{
  "https://site1.com": {
    "label": "내 블로그",      // 사용자 설정 라벨
    "shortName": "myblog"     // 짧은 이름
  }
}
```

### 3.3 dataBySite 구조

```json
{
  "https://site1.com": {
    "expose": { "click": 1000, "imp": 50000 },
    "crawl": { ... },
    "backlink": { ... },
    "diagnosisMeta": { ... }
  }
}
```

---

## 4. 헬퍼 함수

### 4.1 이메일 관련

```javascript
// 이메일에서 짧은 라벨 추출
function getShortLabel(email) {
  return email.split("@")[0];
}

// 사용
const email = "user1@naver.com";
const shortLabel = getShortLabel(email); // "user1"
```

### 4.2 사이트 조회

```javascript
// 전체 사이트 목록
function getAllSites(payload) {
  const sites = new Set();
  for (const account of Object.values(payload.accounts)) {
    for (const site of account.sites) {
      sites.add(site);
    }
  }
  return Array.from(sites).sort();
}

// 특정 사이트의 계정 찾기
function getAccountForSite(siteUrl, payload) {
  for (const [email, account] of Object.entries(payload.accounts)) {
    if (account.sites.includes(siteUrl)) {
      return { email, account };
    }
  }
  return null;
}

// 전체 계정 목록
function getAllAccounts(payload) {
  return Object.keys(payload.accounts);
}

// 단일/병합 확인
function isMerged(payload) {
  return payload.__meta?.accountCount > 1;
}
```

### 4.3 렌더링 헬퍼

```javascript
// 계정별 색상
const ACCOUNT_COLORS = [
  '#10b981', '#0ea5e9', '#f59e0b', '#ef4444',
  '#a855f7', '#14b8a6', '#f97316', '#ec4899'
];

function getAccountColor(email) {
  const hash = email.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return ACCOUNT_COLORS[hash % ACCOUNT_COLORS.length];
}

// 사이트 라벨 가져오기
function getSiteLabel(siteUrl, payload) {
  for (const account of Object.values(payload.accounts)) {
    const meta = account.siteMeta?.[siteUrl];
    if (meta?.label) return meta.label;
    if (meta?.shortName) return meta.shortName;
  }
  return siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
```

---

## 5. 마이그레이션: 레거시 → 신규

### 5.1 레거시 구조 (v1)

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

### 5.2 변환 함수

```javascript
// 레거시 v1 → 신규 v2 변환
function migrateV1ToV2(legacyPayload) {
  // 이미 v2이면 그대로 반환
  if (legacyPayload.accounts) {
    return legacyPayload;
  }

  const meta = legacyPayload.__meta || {};
  const email = meta.accountEmail || "unknown@naver.com";

  return {
    __meta: {
      version: "20260317-payload-contract-v2",
      savedAt: meta.savedAt || new Date().toISOString(),
      accountCount: 1
    },
    accounts: {
      [email]: {
        encId: meta.encId || "",
        sites: legacyPayload.allSites || [],
        siteMeta: legacyPayload.siteMeta || {},
        dataBySite: legacyPayload.dataBySite || {}
      }
    }
  };
}
```

---

## 6. UI 렌더링

### 6.1 사이트 선택 드롭다운

```javascript
function renderSiteDropdown(payload) {
  const allSites = getAllSites(payload);
  const merged = isMerged(payload);

  const options = allSites.map(site => {
    const result = getAccountForSite(site, payload);
    const email = result?.email || "unknown";
    const shortLabel = getShortLabel(email);
    const color = getAccountColor(email);

    // 병합 시 계정 라벨 표시
    const prefix = merged ? `[${shortLabel}] ` : "";

    return `
      <option value="${site}">
        ${prefix}${getSiteLabel(site, payload)}
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
```

### 6.2 계정 정보 표시

```javascript
function renderAccountInfo(payload) {
  const accounts = getAllAccounts(payload);

  if (accounts.length === 1) {
    // 단일 계정: 간단 표시
    return `<span>${getShortLabel(accounts[0])}</span>`;
  }

  // 병합: 계정 목록 표시
  return accounts.map(email => {
    const shortLabel = getShortLabel(email);
    const color = getAccountColor(email);

    return `
      <span class="account-badge" style="background: ${color}">
        ${shortLabel}
      </span>
    `;
  }).join('');
}
```

---

## 7. 파이썬 병합 스크립트

### 7.1 변환 로직

```python
def extract_payload_from_html(html_path: str) -> Dict[str, Any]:
    """HTML에서 payload 추출 (v1, v2 자동 감지)"""
    payload = _extract_raw_payload(html_path)

    # v1이면 v2로 변환
    if "accounts" not in payload:
        return migrate_v1_to_v2(payload)

    return payload

def migrate_v1_to_v2(legacy: Dict[str, Any]) -> Dict[str, Any]:
    """레거시 v1을 v2로 변환"""
    meta = legacy.get("__meta", {})
    email = meta.get("accountEmail", "unknown@naver.com")

    return {
        "__meta": {
            "version": "20260317-payload-contract-v2",
            "savedAt": meta.get("savedAt", datetime.now().isoformat()),
            "accountCount": 1
        },
        "accounts": {
            email: {
                "encId": meta.get("encId", ""),
                "sites": legacy.get("allSites", []),
                "siteMeta": legacy.get("siteMeta", {}),
                "dataBySite": legacy.get("dataBySite", {})
            }
        }
    }
```

### 7.2 병합 로직

```python
def merge_snapshots(html_paths: List[str]) -> Dict[str, Any]:
    """스냅샷 병합 (모두 v2 구조)"""
    merged_accounts = {}

    for html_path in html_paths:
        payload = extract_payload_from_html(html_path)  # 자동 v2 변환

        # 계정 병합
        for email, account_data in payload["accounts"].items():
            if email not in merged_accounts:
                merged_accounts[email] = account_data
            else:
                # 기존 계정에 사이트 추가
                existing = merged_accounts[email]
                for site in account_data["sites"]:
                    if site not in existing["sites"]:
                        existing["sites"].append(site)
                existing["dataBySite"].update(account_data["dataBySite"])

    return {
        "__meta": {
            "version": "20260317-payload-contract-v2",
            "savedAt": datetime.now().isoformat(),
            "accountCount": len(merged_accounts)
        },
        "accounts": merged_accounts
    }
```

---

## 8. 버전 관리

### 8.1 버전 규칙

```
YYYYMMDD-payload-contract-v마이너버전
```

| 버전 | 구조 | 계정 지원 |
|------|------|----------|
| `20260314-payload-contract-v1` | 레거시 (flat) | 단일만 |
| `20260317-payload-contract-v2` | 통합 (nested) | 단일 + 병합 |

### 8.2 호환성 확인

```javascript
const SUPPORTED_VERSIONS = [
  "20260314-payload-contract-v1",  // 레거시 (변환 필요)
  "20260317-payload-contract-v2"   // 신규 (그대로 사용)
];

function getPayloadVersion(payload) {
  return payload.__meta?.version || "unknown";
}

function needsMigration(payload) {
  const version = getPayloadVersion(payload);
  return version === "20260314-payload-contract-v1";
}

function ensureV2(payload) {
  if (needsMigration(payload)) {
    return migrateV1ToV2(payload);
  }
  return payload;
}
```

---

## 9. 구현 우선순위

### 9.1 1단계: 구조 통합 (필수)

| 순서 | 항목 | 파일 | 작업 |
|------|------|------|------|
| 1 | v2 스키마 정의 | - | ✅ 완료 |
| 2 | v1 → v2 변환 함수 | JavaScript | ⏳ 예정 |
| 3 | 파이썬 변환 로직 | merge_snapshots.py | ⏳ 예정 |
| 4 | 단일 계정 v2 생성 | 스냅샷 생성 | ⏳ 예정 |

### 9.2 2단계: UI 업데이트 (필수)

| 순서 | 항목 | 작업 |
|------|------|------|
| 1 | 드롭다운 v2 지원 | ⏳ 예정 |
| 2 | 계정 라벨 표시 | ⏳ 예정 |
| 3 | 병합 모드 UI | ⏳ 예정 |

---

## 10. 요약

### 10.1 핵심 변경사항

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 단일 계정 구조 | flat (allSites, dataBySite) | nested (accounts) |
| 병합 구조 | nested (accounts) | nested (accounts) |
| 구조 일치 | ❌ 불일치 | ✅ 완전 동일 |
| 데이터 변환 | 필요 | 불필요 |

### 10.2 최종 구조

```json
{
  "__meta": {
    "version": "20260317-payload-contract-v2",
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
  }
}
```

### 10.3 장점

1. **단일 구조** - 단일/병합이 같은 형식
2. **단일 파싱** - 한 번의 파싱 로직으로 처리
3. **단일 렌더링** - 한 번의 렌더링 로직으로 처리
4. **단일 유효성 검사** - 한 번의 검증 로직으로 처리
5. **쉬운 확장** - 계정 추가 시 객체 키만 추가

### 10.4 제거된 모든 중복

- ❌ `label` → 키(이메일)
- ❌ `shortLabel` → `email.split("@")[0]`
- ❌ `allSites` → `getAllSites()`
- ❌ `siteToAccount` → `getAccountForSite()`
- ❌ 레거시 flat 구조 → 통합 nested 구조

---

**문서 버전:** 2.0
**최종 수정:** 2026-03-17
**상태:** 확정
**핵심:** 단일 구조 원칙 (단일 = 병합)
