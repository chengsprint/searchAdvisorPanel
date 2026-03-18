# SearchAdvisor 기능/호환성/확장성 분석 보고서

**분석 기간**: 2026-03-18
**분석 범위**: src/app/main/*.js (15개 파일, 약 3,500+ 라인)
**분석 차원**: 기능적(Functionality), 호환성(Compatibility), 확장성(Extensibility)

---

## 📊 분석 개요

| 항목 | 상태 |
|------|------|
| 기능 완성도 | ⭐⭐⭐⭐☆ (4/5) |
| 호환성 | ⭐⭐⭐⭐☆ (4/5) |
| 확장성 | ⭐⭐☆☆☆ (2/5) |

---

## 🟢 잘 작동하는 것

### 1. 기능적 우수사항

| 카테고리 | 파일 | 내용 |
|----------|------|------|
| **데이터 흐름** | 03-data-manager.js | 캐시 시스템 정상 작동 |
| **다중 계정** | 03-data-manager.js, 06-merge-manager.js | V2 병합 로직 완벽 |
| **UI 상태** | 07-ui-state.js, 09-ui-controls.js | 모드/탭 전환 정상 |
| **내보내기** | 12-snapshot.js, 06-merge-manager.js | V2 포맷 완전 지원 |
| **재시도 로직** | 04-api.js | fetchWithRetry 구현 |

### 2. 호환성 우수사항

| 항목 | 상태 |
|------|------|
| ES6+ 문법 | ✅ 화살표 함수, async/await 사용 |
| DOM API | ✅ 표준 API만 사용 |
| localStorage | ✅ try-catch 예외 처리 |
| React Shell | ✅ 통합 API 완비 |

### 3. 확장성 우수사항

| 항목 | 파일 | 상태 |
|------|------|------|
| V2 스키마 | 00-constants.js | 유연한 버전 관리 |
| 데이터 검증 | 00-constants.js | DATA_VALIDATION 객체 |
| 계정 관리 | 00-constants.js | ACCOUNT_UTILS 통합 |

---

## 🔴 기능적 결함 (긴급 수정 필요)

### 1. curMode 초기화 타이밍 문제

**위치**: 14-init.js (라인 54), 09-ui-controls.js (라인 97-100)

**문제**:
```javascript
// 14-init.js
curMode = CONFIG.MODE.SITE;  // 직접 할당
setComboSite(bootSite);

// 09-ui-controls.js
if (curMode === CONFIG.MODE.SITE && curSite === site) {  // 초기화 시 체크
  if (typeof loadSiteView === 'function') {
    loadSiteView(site);
  }
  return;
}
```

**현상**: 초기화 시점에 curMode 체크로 인해 loadSiteView 미호출

**해결 방안**:
```javascript
// 14-init.js
if (bootMode === CONFIG.MODE.SITE && bootSite) {
  curMode = CONFIG.MODE.SITE;
  updateModeUI(bootMode);  // UI 업데이트 분리
  setComboSite(bootSite);
}

// 09-ui-controls.js
function setComboSite(site) {
  // curMode 체크 제거
  if (curSite === site && curMode === CONFIG.MODE.SITE) {
    if (typeof loadSiteView === 'function') {
      loadSiteView(site);  // 데이터만 갱신
    }
    return;
  }
  // ...
}
```

### 2. 캐시 무결성 검증 부재

**위치**: 03-data-manager.js (라인 37-47)

**문제**:
```javascript
function getCachedData(site) {
  const d = lsGet(getSiteDataCacheKey(site));
  if (!d || !d.data || typeof d.data !== "object") return null;
  if (d.ts && typeof d.ts === "number" && Date.now() - d.ts > DATA_TTL) return null;
  return d.data;  // 구조 검증 없음
}
```

**현상**: 손상된 캬시 로드 시 런타임 에러

**해결 방안**:
```javascript
function validateCachedData(data) {
  const requiredFields = ['expose', 'crawl', 'backlink', 'diagnosisMeta'];
  for (const field of requiredFields) {
    if (data[field] !== null && typeof data[field] !== 'object') {
      console.warn(`[Cache Validation] Invalid field: ${field}`);
      return false;
    }
  }
  return true;
}

function getCachedData(site) {
  const d = lsGet(getSiteDataCacheKey(site));
  if (!d || !d.data || typeof d.data !== "object") return null;
  if (d.ts && typeof d.ts === "number" && Date.now() - d.ts > DATA_TTL) return null;
  if (!validateCachedData(d.data)) {
    console.warn('[getCachedData] Invalid cache structure for:', site);
    return null;
  }
  return d.data;
}
```

### 3. API 요청 실패 시 자원 누수

**위치**: 04-api.js (라인 28-56)

**문제**:
```javascript
inflightExpose[site] = (async function () {
  // fetchWithRetry 실패 시 cleanup 불확실
  return persistSiteData(site, await fetchWithRetry(...));
})();
```

**현상**: Promise 실패 시 inflightExpose 정리 안 될 수 있음

**해결 방안**:
```javascript
inflightExpose[site] = (async function () {
  try {
    return await persistSiteData(site, await fetchWithRetry(...));
  } catch (e) {
    console.error('[fetchExposeData] Error:', e);
    return persistSiteData(site, { /* error data */ });
  }
})();

Promise.resolve(inflightExpose[site]).finally(() => {
  delete inflightExpose[site];  // 항상 cleanup 보장
});
```

---

## 🟡 개선 필요 (중요)

### 1. 데모 모드 데이터 생성 중복

**위치**: 05-demo-mode.js (라인 39-147, 324-443)

**문제**: DEMO_SITE_DATA와 injectDemoData()에서 동일 구조 재생성

**해결**:
```javascript
function generateDemoSiteData(site, idx, startDate) {
  // 중복 제거된 데이터 생성 로직
}
```

### 2. 탭 정의 중복

**위치**: 09-ui-controls.js (라인 148-158), 12-snapshot.js (라인 70-79)

**문제**: TABS 배열이 두 곳에 정의되어 동기화 필요

**해결**:
```javascript
// 00-constants.js로 이동
const TAB_DEFINITIONS = [
  { id: "overview", label: "개요", icon: ICONS.dashboard },
  { id: "daily", label: "일별", icon: ICONS.calendar },
  { id: "queries", label: "쿼리", icon: ICONS.search },
  { id: "pages", label: "페이지", icon: ICONS.document },
  { id: "crawl", label: "크롤링", icon: ICONS.bug },
  { id: "backlink", label: "백링크", icon: ICONS.link },
  { id: "diagnosis", label: "색인", icon: ICONS.magnifier },
  { id: "insight", label: "인사이트", icon: ICONS.lightbulb }
];
```

### 3. 진행률 표시 중복 코드

**위치**: 10-all-sites-view.js (라인 29-35), 13-refresh.js (라인 1-45)

**문제**: 유사한 진행률 UI 로직 중복

**해결**: 공통 진행률 컴포넌트로 추출

---

## 📝 호환성 이슈

### 1. localStorage 키 네이밍 충돌 가능성

**위치**: 03-data-manager.js (라인 216-218)

**문제**: 다른 스크립트와 충돌 가능

**해결**:
```javascript
const STORAGE_PREFIX = 'searchadvisor_runtime_v1_';
const SITE_LS_KEY = STORAGE_PREFIX + 'sites';
const DATA_LS_PREFIX = STORAGE_PREFIX + 'data_';
const UI_STATE_LS_KEY = STORAGE_PREFIX + 'ui_state';
```

### 2. 네이버 API 엔드포인트 하드코딩

**위치**: 04-api.js (라인 30)

**문제**: 네이버가 엔드포인트 변경 시 작동 중단

**해결**:
```javascript
const API_CONFIG = {
  BASE_URL: 'https://searchadvisor.naver.com/api-console/report',
  ENDPOINTS: {
    EXPOSE: '/expose',
    CRAWL: '/crawl',
    BACKLINK: '/backlink',
    DIAGNOSIS_META: '/diagnosis/meta'
  }
};
```

### 3. 캐시 TTL 하드코딩

**위치**: 00-constants.js (라인 219)

**문제**: 12시간 하드코딩, 사용자 설정 불가

**해결**:
```javascript
const CACHE_CONFIG = {
  DATA_TTL: 12 * 60 * 60 * 1000,           // 12시간
  UI_STATE_TTL: 7 * 24 * 60 * 60 * 1000,   // 7일
  FIELD_FAILURE_RETRY_MS: 5 * 60 * 1000
};
```

---

## 🔧 확장성 제약

### 1. 새로운 탭 추가 어려움

**위치**: 08-renderers.js (라인 1-722)

**문제**: buildRenderers()가 모든 탭을 정의, 720라인 수정 필요

**해결**:
```javascript
// 플러그인 방식 탭 레지스트리
const TAB_RENDERER_REGISTRY = new Map();

function registerTabRenderer(tabId, rendererFn) {
  TAB_RENDERER_REGISTRY.set(tabId, rendererFn);
}

function buildRenderers(expose, crawlData, backlinkData, diagnosisMeta) {
  const renderers = {};
  for (const [tabId, rendererFn] of TAB_RENDERER_REGISTRY) {
    renderers[tabId] = rendererFn({ expose, crawlData, backlinkData, diagnosisMeta });
  }
  return renderers;
}

// 사용 예
registerTabRenderer('overview', (data) => renderOverview(data));
registerTabRenderer('my-custom-tab', (data) => renderMyCustomTab(data));
```

### 2. 렌더러 함수 결합도 높음

**위치**: 08-renderers.js

**문제**: 9개 탭 렌더러가 한 함수에 몰려있음

**해결**: 각 렌더러를 독립 모듈로 분리

### 3. V2 스키마 확장 제약

**위치**: 00-constants.js (라인 136-148)

**문제**: PAYLOAD_SCHEMA가 필드 목록 고정

**해결**:
```javascript
// 유연한 스키마 검증
function validateV2Payload(payload, schemaVersion = '1.0') {
  const schema = SCHEMA_VERSIONS.getSchema(schemaVersion);
  // 필수 필드만 검증, 추가 필드는 허용
  for (const field of schema.REQUIRED) {
    if (!(field in payload)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  return { valid: true };
}

SCHEMA_VERSIONS.registerSchema('1.1', {
  REQUIRED: ['savedAt', 'allSites'],
  OPTIONAL: ['curMode', 'curSite', 'curTab', 'newField']
});
```

### 4. 색상 팔레트 확장 제약

**위치**: 00-constants.js (라인 83)

**문제**: 7개 색상으로 고정, 8개 이상 사이트 시 재사용

**해결**:
```javascript
function generateSiteColor(index, total) {
  const hue = (index * 137.508) % 360; // 황금각 분배
  return `hsl(${hue}, 70%, 50%)`;
}
```

---

## 📊 요약 및 우선순위

### 🔴 긴급 (즉시 수정)
1. curMode 초기화 타이밍 문제
2. 캐시 무결성 검증 부재
3. API 요청 실패 시 자원 누수

### 🟡 중요 (1주 내)
1. 데모 모드 데이터 생성 중복
2. 탭 정의 중복
3. 진행률 표시 중복
4. localStorage 키 네이밍

### 🟢 개선 (1달 내)
1. 캐시 TTL 하드코딩
2. API 엔드포인트 하드코딩
3. fetch 타임아웃 제어

### 🔵 확장 (장기)
1. 탭 레지스트리 패턴 도입
2. 데이터 소스 추상화
3. 테마 시스템
4. 플로그인 아키텍처

---

## 📈 전체 평가

| 항목 | 점수 | 비고 |
|------|------|------|
| 기능 완성도 | 8/10 | 다중 계정, 병합, 캐시 우수 |
| 호환성 | 8/10 | ES6+, DOM API 호환성 양호 |
| 확장성 | 4/10 | 모듈 결합도 높음, 플러그인 부재 |
| **종합** | **6.7/10** | **확장성 개선 필요** |

---

## 🎯 권장 사항

### 단기 (1-2주)
- 긴급 문제 3건 수정
- 코드 중복 제거
- 탭 정의 통합

### 중기 (1-2달)
- 캐시/검증 개선
- API 구조화
- UI 상태 관리 개선

### 장기 (3달+)
- 플러그인 아키텍처 도입
- 데이터 소스 추상화
- 테마 시스템

---

*보고서 생성일: 2026-03-18*
*분석 방법: 에이전트 기반 전체 코드 순회*
