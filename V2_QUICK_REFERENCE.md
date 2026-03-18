# V2 헬퍼 함수 빠른 참조 카드

## 🎯 핵심 함수만 빠르게 찾기

### 가장 자주 사용하는 함수 (TOP 5)

| 순위 | 함수 | 용도 | 복잡도 |
|------|------|------|--------|
| 1 | `getSiteData(siteUrl, payload)` | 사이트 데이터 가져오기 | O(1) |
| 2 | `getAllSites(payload)` | 전체 사이트 목록 | O(n) 캐시 |
| 3 | `getUIState(payload)` | UI 상태 가져오기 | O(1) |
| 4 | `isV2Payload(payload)` | V2 확인 | O(1) |
| 5 | `normalizeSiteUrl(url)` | URL 정규화 | O(1) |

---

## 📋 전체 함수一览 (카테고리별)

### 🔍 검증 & 확인 (2개)
```javascript
isV2Payload(payload)           // → boolean
validateV2Payload(payload)     // → {valid, errors[]}
```

### 👤 계정 (3개)
```javascript
getAccountCount(payload)       // → number
getAccountEmails(payload)      // → string[]
getAccountByEmail(payload, email)  // → object|null
```

### 🌐 사이트 (3개)
```javascript
getAllSites(payload)           // → string[]
getAccountForSite(site, payload)  // → string|null (O(1))
hasSite(site, payload)         // → boolean
```

### 📦 데이터 (3개)
```javascript
getSiteData(site, payload)     // → object|null
getSiteMeta(site, payload)     // → object|null
getSiteLabel(site, payload)    // → string
```

### 🎨 UI (2개)
```javascript
getUIState(payload)            // → {curMode, curSite, curTab}
setUIState(payload, state)     // → payload (변경됨)
```

### 📊 통계 (3개)
```javascript
getStats(payload)              // → {success, partial, failed, errors[]}
getSummary(payload)            // → object|null
getSiteOwnership(payload)      // → {site: [emails]}
```

### 🔧 생성 (2개)
```javascript
createEmptyV2Payload(email, encId)  // → object
cloneV2Payload(payload)        // → object|null
```

### 🧹 캐시 (1개)
```javascript
clearV2Cache()                 // → void
```

---

## 🔄 마이그레이션: v1 → v2

### 데이터 접근 패턴 변경

#### v1 방식
```javascript
// 사이트 데이터
const data = payload.dataBySite[siteUrl];

// 전체 사이트
const sites = payload.allSites;

// UI 상태
const mode = payload.curMode;
const site = payload.curSite;
```

#### v2 방식
```javascript
// 사이트 데이터
const data = getSiteData(siteUrl, payload);

// 전체 사이트
const sites = getAllSites(payload);

// UI 상태
const {curMode, curSite, curTab} = getUIState(payload);
```

---

## ⚡ 성능 특성

### O(1) 연산 (인덱스 사용)
- `getAccountForSite()` - 인덱스로 직접 접근
- `hasSite()` - 인덱스 확인
- `getSiteData()` - 인덱스 + 직접 접근
- `getSiteMeta()` - 인덱스 + 직접 접근

### O(n) 연산 (캐시됨)
- `getAllSites()` - 첫 호출만 O(n), 이후 캐시
- `getAccountEmails()` - 캐시됨

### 캐시 키 구조
```
siteIndex_${savedAt}        → Map<siteUrl, email>
allSites_${savedAt}         → string[]
```

---

## 🚨 빈번한 실수

### ❌ 잘못된 사용
```javascript
// 1. payload 체크 없이 사용
const data = getSiteData(site, payload);  // payload가 null이면 에러

// 2. URL 정규화하지 않고 사용
const data = getSiteData("site.com", payload);  // 못 찾을 수 있음

// 3. 캐시 과신
for (let i = 0; i < 1000; i++) {
  getAllSites(payload);  // 1000번 호출해도 캐시로 빠름
}
```

### ✅ 올바른 사용
```javascript
// 1. payload 먼저 확인
if (!payload) return;
const data = getSiteData(site, payload);

// 2. URL 정규화 사용
const normalized = normalizeSiteUrl(site);
const data = getSiteData(normalized, payload);

// 3. 캐시 직접 제어 필요 시
clearV2Cache();  // 페이로드 변경 시 호출
```

---

## 🔗 의존성

### 필수 상수 (00-constants.js)
```javascript
P.ROOT.META          // "__meta"
PAYLOAD_V2.VERSION   // "20260318-payload-contract-v2"
PAYLOAD_FIELDS.*     // 모든 필드명
```

### 내부 의존성
```
getAccountForSite()
  → buildSiteToAccountIndex()
    → getV2Cached() / setV2Cached()
    → normalizeSiteUrl()

getSiteData()
  → getAccountForSite()
  → getAccountByEmail()
```

---

## 📝 타입 정의 (JSDoc)

### Payload 타입
```javascript
/**
 * @typedef {Object} V2Payload
 * @property {Object} __meta
 * @property {string} __meta.version
 * @property {string} __meta.savedAt
 * @property {number} __meta.accountCount
 * @property {Object} accounts
 * @property {Object} ui
 * @property {Object} stats
 */
```

### SiteData 타입
```javascript
/**
 * @typedef {Object} SiteData
 * @property {Object} expose
 * @property {Object|null} crawl
 * @property {Object|null} backlink
 * @property {Object|null} diagnosisMeta
 * @property {number} __cacheSavedAt
 * @property {boolean} detailLoaded
 */
```

---

## 🧪 테스트 케이스 예시

### 기본 테스트
```javascript
// 1. V2 확인
console.assert(isV2Payload(v2Payload) === true);
console.assert(isV2Payload(v1Payload) === false);

// 2. 사이트 목록
const sites = getAllSites(v2Payload);
console.assert(Array.isArray(sites));
console.assert(sites.length > 0);

// 3. 데이터 조회
const data = getSiteData(sites[0], v2Payload);
console.assert(data !== null);
console.assert(typeof data === 'object');

// 4. URL 정규화
console.assert(normalizeSiteUrl('example.com/') === 'https://example.com');
console.assert(normalizeSiteUrl('HTTP://EXAMPLE.COM') === 'https://example.com');
```

---

## 📞 빠른 문제 해결

| 문제 | 원인 | 해결 |
|------|------|------|
| `P is not defined` | 상수 미로딩 | `00-constants.js` 확인 |
| `getSiteData` returns null | 사이트 없음 | `normalizeSiteUrl()` 사용 |
| 성능 느림 | 캐시 미작동 | `clearV2Cache()` 호출 |
| 빌드 실패 | 문법 오류 | 화살표 함수 확인 |

---

**마지막 업데이트**: 2026-03-18
**버전**: 1.0 Final
