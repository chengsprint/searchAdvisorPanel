# SearchAdvisor Runtime - 확장성 및 호환성 검토 보고서

**분석 일자:** 2026-03-17
**분석 대상:** SearchAdvisor Runtime 코드베이스
**총 모듈 수:** 15개 (총 5,193줄)

---

## 1. 병합 기능 확장성 분석 (Merge Functionality Scalability)

### 파일: `src/app/main/06-merge-manager.js`

#### 🔴 CRITICAL: 무제한 계정 병합으로 인한 메모리 누수 위험

**위치:** 라인 342-405 (`exportCurrentAccountData` 함수)

**현재 구현:**
```javascript
const keysToCheck = Object.keys(localStorage);
for (const key of keysToCheck) {
    if (!key.startsWith(DATA_LS_PREFIX)) continue;
    if (!key.includes(getCacheNamespace())) continue;
    // ... 처리 로직
}
```

**문제점:**
- localStorage의 모든 키를 순회하며 처리하여 계정 및 사이트 수가 증가할수록 성능 저하
- 병합 레지스트리(`MERGE_REGISTRY_KEY`)에 대한 크기 제한 없음
- 다수 계정 병합 시 메모리 사용량이 선형적으로 증가하여 OOM(Out of Memory) 위험

**영향도:**
- 10개 계정 × 100개 사이트 = 1,000개 데이터 항목 처리 시 브라우저 멈춤 가능
- localStorage 할당량 초과 시 데이터 손실

**권장 사항:**
```javascript
// 상수 정의 추가
const MAX_MERGED_ACCOUNTS = 50;
const MAX_SITES_PER_ACCOUNT = 500;
const MERGE_REGISTRY_SIZE_LIMIT = 1024 * 1024; // 1MB

// 크기 제한 검증 로직 추가
function validateMergeCapacity(accountCount, siteCount) {
    if (accountCount > MAX_MERGED_ACCOUNTS) {
        throw new Error(`계정 병합 한도 초과: ${accountCount}/${MAX_MERGED_ACCOUNTS}`);
    }
    const estimatedSize = accountCount * siteCount * 1024; // 1KB per site
    if (estimatedSize > MERGE_REGISTRY_SIZE_LIMIT) {
        throw new Error('병합 데이터 크기 한도 초과');
    }
}
```

---

#### 🟠 HIGH: 계정 격리 보장 부족

**위치:** 라인 132-225 (`mergeAccounts` 함수)

**현재 구현:**
```javascript
function mergeAccounts(targetData, sourceData, options = {}) {
    const { strategy = 'newer', onConflict = null, mergeLogs = true,
            mergeDates = true, preserveSources = true } = options;

    const result = {
        ...targetData,
        sites: { ...targetData.sites }
    };
```

**문제점:**
- 동일 사이트가 다른 계정에서 존재할 때 충돌 해결 전략이 불완전
- `__sources` 배열에 대한 크기 제한 없음 (무한 증가 가능)
- 계정별 데이터 소스 추적이 얕은 복사(shallow copy)로만 수행되어 데이터 오염 위험

**영향도:**
- 동일 사이트를 10개 계정에서 병합 시 `__sources` 배열이 10개씩 증가
- 데이터 출처 추적 불가으로 디버깅 어려움

**권장 사항:**
```javascript
const MAX_SOURCE_TRACKING = 10;
const CONFLICT_RESOLUTION_STRATEGIES = ['newer', 'older', 'manual', 'keep_both'];

function mergeAccounts(targetData, sourceData, options = {}) {
    // 전략 검증
    if (!CONFLICT_RESOLUTION_STRATEGIES.includes(options.strategy)) {
        throw new Error(`지원하지 않는 병합 전략: ${options.strategy}`);
    }

    // 소스 추적 제한
    if (preserveSources && mergedSiteData.__sources.length >= MAX_SOURCE_TRACKING) {
        mergedSiteData.__sources = mergedSiteData.__sources.slice(-MAX_SOURCE_TRACKING);
        mergedSiteData.__sourcesTruncated = true;
    }
}
```

---

#### 🟡 MEDIUM: 데이터 증가 처리 패턴 미최적화

**위치:** 라인 230-271 (`deepMergeSiteData` 함수)

**현재 구현:**
```javascript
function deepMergeSiteData(target, source, options = {}) {
    const merged = { ...target };
    const dataTypes = ['expose', 'crawl', 'backlink', 'diagnosisMeta'];

    for (const type of dataTypes) {
        if (source[type] && target[type]) {
            merged[type] = deepMergeDataType(target[type], source[type], type, options);
        }
    }
}
```

**문제점:**
- 모든 데이터 타입을 항상 순회하며 불필요한 복사 발생
- 로그 배열 병합 시 O(n²) 복잡도 (라인 289-301)
- 대규모 데이터셋에서 성능 저하

**영향도:**
- 365일 데이터 × 10개 계정 = 3,650개 로그 항목 병합 시 지연
- 사용자 경험 저하

**권장 사항:**
```javascript
// 지연 병합 (Lazy Merge) 패턴 도입
function shouldMergeDataType(target, source, type) {
    return source[type] && target[type] &&
           (type !== 'expose' || needsUpdate(target[type], source[type]));
}

// 로그 병합 최적화 (Map 대신 Set 사용)
function mergeLogsOptimized(targetLogs, sourceLogs) {
    const logSet = new Set();
    targetLogs.forEach(log => logSet.add(log.date));
    sourceLogs.forEach(log => logSet.add(log.date));
    return Array.from(logSet).map(date => findLatestLog(date, targetLogs, sourceLogs));
}
```

---

## 2. 스냅샷 내보내기 호환성 분석 (Snapshot Export Compatibility)

### 파일: `src/app/main/12-snapshot.js`

#### 🔴 CRITICAL: 버전 호환성 처리 누락

**위치:** 라인 370-378

**현재 구현:**
```javascript
window.__SEARCHADVISOR_PAYLOAD_CONTRACT__ = {
    version: "20260314-payload-contract-v1",
    mode: "saved-html",
    getSiteMetaMap,
    getMergedMetaState,
    getSiteShortName,
    getSiteLabel,
    applyReportDecorations: applySnapshotReportDecorations,
};
```

**문제점:**
- `version: "20260314-payload-contract-v1"` 하드코딩된 버전 문자열
- 이전 버전 스냅샷 로드 시 호환성 검증 로직 부재
- 버전 불일치 시 데이터 파싱 실패로 전체 기능 마비

**영향도:**
- 2026-03-14 이전 스냅샷 파일 열리지 않음
- 사용자 데이터 영구 손실 위험

**권장 사항:**
```javascript
// 버전 상수 정의
const PAYLOAD_CONTRACT_VERSIONS = {
    V1: "20260314-payload-contract-v1",
    V2: "20260317-payload-contract-v2", // 미래 버전 예시
    LATEST: "20260317-payload-contract-v2"
};

// 하위 호환성 매핑
const PAYLOAD_CONTRACT_MIGRATORS = {
    "20260314-payload-contract-v1": (payload) => {
        // v1 → v2 마이그레이션 로직
        return migrateV1ToV2(payload);
    }
};

// 버전 검증 함수
function validatePayloadContract(payload) {
    if (!payload.__payload_contract_version) {
        console.warn('레거시 스냅샷 감지 (버전 정보 없음)');
        return PAYLOAD_CONTRACT_VERSIONS.V1;
    }

    if (!Object.values(PAYLOAD_CONTRACT_VERSIONS).includes(payload.__payload_contract_version)) {
        throw new Error(`지원하지 않는 스냅샷 버전: ${payload.__payload_contract_version}`);
    }

    return payload.__payload_contract_version;
}
```

---

#### 🟠 HIGH: 하위 호환성 미고려한 데이터 구조 변경

**위치:** 라인 39-93 (`buildSnapshotShellState` 함수)

**현재 구현:**
```javascript
function buildSnapshotShellState(payload) {
    const allSites = Array.isArray(payload.allSites) ? payload.allSites.slice() : [];
    const snapshotTabIds = [
        "overview", "daily", "queries", "pages", "crawl",
        "backlink", "diagnosis", "insight",
    ];
```

**문제점:**
- `payload.allSites` 필드가 없는 구버전 스냅샷 처리 불가
- `summaryRows` 배열 필드가 선택 사항이지만 필수처럼 사용
- `siteMeta` 객체 타입 검증이 느슨하여 런타임 오류 가능

**영향도:**
- 2026년 3월 초 버전 스냅샷 열리지 않음
- 개발/운영 환경에서 버전 간 데이터 공유 불가

**권장 사항:**
```javascript
// 레거시 데이터 호환성 래퍼
function normalizeLegacyPayload(payload) {
    // v0 → v1 마이그레이션 (2026-03-01 이전)
    if (!payload.allSites && payload.sites) {
        payload.allSites = Object.keys(payload.sites);
        payload.__migrated_from = 'v0';
    }

    // summaryRows 누락 시 빈 배열로 초기화
    if (!Array.isArray(payload.summaryRows)) {
        payload.summaryRows = [];
        payload.__summaryRows_fallback = true;
    }

    // siteMeta 타입 안전장치
    if (!payload.siteMeta || typeof payload.siteMeta !== 'object') {
        payload.siteMeta = {};
        payload.__siteMeta_fallback = true;
    }

    return payload;
}
```

---

#### 🟡 MEDIUM: 상위 호환성 계획 부재

**위치:** 라인 94-172 (`buildSnapshotHtml` 함수)

**현재 구현:**
```javascript
function buildSnapshotHtml(savedAt, payload) {
    const clone = p.cloneNode(true);
    // ... DOM 복제 로직
    const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <!-- 정적 HTML 템플릿 -->
```

**문제점:**
- HTML 템플릿이 버전별로 분리되어 있지 않음
- 미래 버전에서 새로운 필드 추가 시 기존 스냅샷 파싱 실패
- 필드 추가 시 하위 호환성 자동 보장 안 됨

**영향도:**
- 기능 추가 시마다 모든 기존 스냅샷 재내보내기 필요
- CI/CD 파이프라인 복잡도 증가

**권장 사항:**
```javascript
// 버전별 HTML 템플릿 관리
const SNAPSHOT_TEMPLATES = {
    [PAYLOAD_CONTRACT_VERSIONS.V1]: (savedAt, payload) => {
        return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="snapshot-contract-version" content="${PAYLOAD_CONTRACT_VERSIONS.V1}">
  <!-- v1 전용 템플릿 -->
        </html>`;
    },
    [PAYLOAD_CONTRACT_VERSIONS.V2]: (savedAt, payload) => {
        // v2 전용 템플릿
    }
};

// 템플릿 레지스트리
function getSnapshotTemplate(version) {
    return SNAPSHOT_TEMPLATES[version] || SNAPSHOT_TEMPLATES[PAYLOAD_CONTRACT_VERSIONS.V1];
}
```

---

## 3. API 호환성 분석 (API Compatibility)

### 파일: `src/app/main/04-api.js`

#### 🟠 HIGH: API 버전 관리 체계 부재

**위치:** 라인 15-59 (`fetchExposeData` 함수)

**현재 구현:**
```javascript
async function fetchExposeData(site, options) {
    if (!encId || typeof encId !== 'string') {
        console.error('[fetchExposeData] Invalid encId:', encId);
        return null;
    }

    const exposeRes = await fetchWithRetry(
        base + "/expose/" + encId + "?site=" + enc + "&period=90&device=&topN=50",
        { credentials: "include", headers: { accept: "application/json" } },
    );
```

**문제점:**
- API 엔드포인트가 하드코딩되어 버전 관리 불가
- `/expose/`, `/crawl/`, `/backlink/` 경로에 버전 식별자 없음
- Naver SearchAdvisor API 변경 시 기존 코드 즉시 파손

**영향도:**
- Naver API 변경 시 사용자 즉시 영향
- 긴급 패치 배포 필요

**권장 사항:**
```javascript
// API 버전 상수
const API_VERSIONS = {
    V1: "v1",
    V2: "v2",
    CURRENT: "v1"
};

const API_ENDPOINTS = {
    [API_VERSIONS.V1]: {
        EXPOSE: "/api/expose",
        CRAWL: "/api/crawl",
        BACKLINK: "/api/backlink",
        DIAGNOSIS_META: "/api/diagnosis/meta"
    },
    [API_VERSIONS.V2]: {
        EXPOSE: "/v2/api/expose",
        // v2 전용 엔드포인트
    }
};

// 버전 인식 URL 빌더
function buildApiEndpoint(endpointType, apiVersion = API_VERSIONS.CURRENT) {
    const basePath = API_ENDPOINTS[apiVersion][endpointType];
    if (!basePath) {
        throw new Error(`지원하지 않는 엔드포인트 타입: ${endpointType} (버전: ${apiVersion})`);
    }
    return `https://searchadvisor.naver.com${basePath}`;
}
```

---

#### 🟡 MEDIUM: Breaking Changes 감지 메커니즘 부재

**위치:** 라인 84-124 (`fetchCrawlData` 함수)

**현재 구현:**
```javascript
const crawlRes = await fetchWithRetry(
    base + "/crawl/" + encId + "?site=" + enc +
    "&start_date=" + d90 + "&end_date=" + today +
    "&isAlly=false&count=5",
    { credentials: "include", headers: { accept: "application/json" } },
);
const crawl = crawlRes.ok ? await crawlRes.json() : null;
```

**문제점:**
- API 응답 스키마 검증 없음
- 필수 필드(`code`, `data`) 누락 시 런타임 오류
- HTTP 4xx/5xx 응답 별도 처리 없음

**영향도:**
- Naver 서버 장애 시 연쇄 오류
- API 응답 형식 변경 시 UI 파손

**권장 사항:**
```javascript
// API 응답 스키마 검증기
function validateApiResponse(response, schemaVersion = API_VERSIONS.CURRENT) {
    if (!response || typeof response !== 'object') {
        throw new Error('API 응답이 객체가 아님');
    }

    // v1 스키마 검증
    if (schemaVersion === API_VERSIONS.V1) {
        if (response.code === undefined) {
            console.warn('API 응답에 code 필드 누락 (v1 스키마 위반)');
        }
        if (response.data === undefined) {
            console.warn('API 응답에 data 필드 누락 (v1 스키마 위반)');
        }
    }

    return response;
}

// Breaking Changes 모니터링
function detectBreakingChange(response, endpointType) {
    const MONITORED_FIELDS = {
        EXPOSE: ['code', 'data'],
        CRAWL: ['code', 'items'],
        BACKLINK: ['code', 'topDomain']
    };

    const requiredFields = MONITORED_FIELDS[endpointType] || [];
    const missingFields = requiredFields.filter(field => !(field in response));

    if (missingFields.length > 0) {
        console.error(`Breaking Change 감지: ${endpointType} - 누락 필드:`, missingFields);
        // Sentry/Analytics에 에러 전송
        reportBreakingChange(endpointType, missingFields);
    }
}
```

---

#### 🟡 MEDIUM: Fallback 메커니즘 미구현

**위치:** 라인 149-188 (`fetchBacklinkData` 함수)

**현재 구현:**
```javascript
try {
    const backlinkRes = await fetchWithRetry(/* ... */);
    const backlink = backlinkRes.ok ? await backlinkRes.json() : null;
    return persistSiteData(site, {
        ...baseData,
        backlink: backlinkRes.ok ? backlink : null,
        backlinkFetchState: backlinkRes.ok ? "success" : "failure",
        // ...
    });
} catch (e) {
    return persistSiteData(site, {
        ...baseData,
        backlink: null,
        backlinkFetchState: "failure",
        // ...
    });
}
```

**문제점:**
- API 호출 실패 시 캐시된 데이터 fallback 불가
- 부분 장애 시 전체 기능 마비
- 사용자 경험 저하

**영향도:**
- Naver API 일시 장애 시 데이터 표시 불가
- 사용자 신뢰도 하락

**권장 사항:**
```javascript
// 캐시 fallback 전략
async function fetchWithFallback(site, fetcher, cacheKey, options = {}) {
    const { fallbackToCache = true, fallbackToEmpty = false } = options;

    try {
        return await fetcher(site);
    } catch (e) {
        console.error('[fetchWithFallback] API 호출 실패:', e);

        // 캐시된 데이터 시도
        if (fallbackToCache) {
            const cached = getCachedData(site);
            if (cached && cached.data) {
                console.log('[fetchWithFallback] 캐시된 데이터 사용');
                return {
                    ...cached.data,
                    __fallback_source: 'cache',
                    __fallback_reason: e.message
                };
            }
        }

        // 빈 데이터 반환
        if (fallbackToEmpty) {
            return emptySiteData();
        }

        throw e;
    }
}

// 사용 예시
const backlinkData = await fetchWithFallback(
    site,
    (s) => fetchBacklinkData(s, options),
    getSiteDataCacheKey(site),
    { fallbackToCache: true, fallbackToEmpty: true }
);
```

---

## 4. 확장성 분석 (Extensibility)

### 🔴 CRITICAL: 플러그인/확장 포인트 부재

**위치:** 전체 코드베이스

**문제점:**
- 모든 기능이 단일 IIFE로 패키징되어 외부 모듈 로드 불가
- React 컴포넌트가 인라인으로 빌드되어 커스터마이징 불가
- 이벤트 기반 아키텍처 부재로 기능 확장 곤란

**영향도:**
- 사용자별 커스텀 기능 추가 불가
- 타사 툴 연동 불가
- A/B 테스트 구현 어려움

**권장 사항:**
```javascript
// 플러그인 시스템 도입
const SEARCHADVISOR_PLUGIN_API = {
    version: '1.0.0',
    hooks: {
        onDataFetched: [],
        onRender: [],
        onError: []
    },

    registerHook(hookName, callback) {
        if (!this.hooks[hookName]) {
            this.hooks[hookName] = [];
        }
        this.hooks[hookName].push(callback);
    },

    executeHook(hookName, data) {
        const hooks = this.hooks[hookName] || [];
        return hooks.reduce(async (acc, hook) => {
            return await hook(acc);
        }, Promise.resolve(data));
    }
};

// 사용자 정의 플러그인 등정 인터페이스
window.__SEARCHADVISOR_REGISTER_PLUGIN__ = (plugin) => {
    if (!plugin.name || !plugin.version) {
        throw new Error('플러그인에 name과 version이 필요합니다');
    }

    if (plugin.hooks) {
        Object.entries(plugin.hooks).forEach(([hookName, callback]) => {
            SEARCHADVISOR_PLUGIN_API.registerHook(hookName, callback);
        });
    }

    console.log(`플러그인 로드됨: ${plugin.name} v${plugin.version}`);
};

// 예시 �러그인
window.__SEARCHADVISOR_REGISTER_PLUGIN__({
    name: 'custom-exporter',
    version: '1.0.0',
    hooks: {
        onDataFetched: async (data) => {
            // 데이터 처리 커스터마이징
            return transformData(data);
        }
    }
});
```

---

#### 🟠 HIGH: 설정 유연성 부족

**위치:** `src/app/main/00-constants.js` 라인 1-30

**현재 구현:**
```javascript
const CONFIG = {
    UI: {
        PANEL_WIDTH: 490,
        PANEL_PADDING: 32,
        Z_INDEX_TOOLTIP: 10000000
    },
    CHART: {
        MIN_HEIGHT: 65,
        PADDING: { LEFT: 4, RIGHT: 4, TOP: 6, BOTTOM: 6 }
    }
};
```

**문제점:**
- 모든 설정이 하드코딩된 상수
- 런타임 설정 변경 불가
- 환경별 설정(dev/stage/prod) 구분 불가

**영향도:**
- 고객별 UI 커스터마이징 불가
- 디버깅을 위한 설정 변경 시 재빌드 필요

**권장 사항:**
```javascript
// 설정 오버라이드 시스템
const DEFAULT_CONFIG = {
    UI: {
        PANEL_WIDTH: 490,
        PANEL_PADDING: 32,
        Z_INDEX_TOOLTIP: 10000000
    }
};

// 설정 병합 유틸리티
function mergeConfig(userConfig) {
    const merged = { ...DEFAULT_CONFIG };

    if (userConfig && typeof userConfig === 'object') {
        Object.keys(userConfig).forEach(key => {
            if (typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key])) {
                merged[key] = { ...merged[key], ...userConfig[key] };
            } else {
                merged[key] = userConfig[key];
            }
        });
    }

    return merged;
}

// 사용자 설정 로드
let CONFIG = DEFAULT_CONFIG;

if (window.__SEARCHADVISOR_CONFIG__) {
    try {
        CONFIG = mergeConfig(window.__SEARCHADVISOR_CONFIG__);
        console.log('사용자 설정 로드됨:', CONFIG);
    } catch (e) {
        console.error('설정 병합 실패, 기본값 사용:', e);
    }
}
```

---

#### 🟡 MEDIUM: 기능 플래그 시스템 부재

**위치:** 전체 코드베이스

**문제점:**
- 새로운 기능이 즉시 모든 사용자에게 노출
- 점진적 롤아웃(Phased Rollout) 불가
- A/B 테스트 구현 불가

**영향도:**
- 버그가 있는 신기능이 전체 사용자에게 영향
- 신기능 테스트 불가

**권장 사항:**
```javascript
// 기능 플래그 시스템
const FEATURE_FLAGS = {
    ENABLE_NEW_INSIGHT_TAB: {
        enabled: false,
        rolloutPercentage: 0, // 0-100
        whitelist: [], // 특정 사용자만
        description: '새로운 Insight 탭 기능'
    },
    ENABLE_V2_API: {
        enabled: false,
        rolloutPercentage: 10,
        description: 'v2 API 사용'
    }
};

// 기능 플래그 확인 함수
function isFeatureEnabled(featureName, userId = null) {
    const feature = FEATURE_FLAGS[featureName];
    if (!feature) {
        console.warn(`알 수 없는 기능 플래그: ${featureName}`);
        return false;
    }

    // 화이트리스트 확인
    if (userId && feature.whitelist && feature.whitelist.includes(userId)) {
        return true;
    }

    // 단계적 롤아웃
    if (feature.rolloutPercentage > 0) {
        const hash = simpleHash(userId || 'anonymous');
        return (hash % 100) < feature.rolloutPercentage;
    }

    return feature.enabled;
}

// 간단한 해시 함수 (결정론적)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// 사용 예시
if (isFeatureEnabled('ENABLE_NEW_INSIGHT_TAB', accountLabel)) {
    // 새로운 기능 렌더링
}
```

---

#### 🟡 MEDIUM: 모듈 경계 불분명

**위치:** `build.js` 라인 14-35

**현재 구현:**
```javascript
const MODULES = [
    '00-polyfill.js',
    '01-style.js',
    '02-react-bundle.js',
    'app/main/00-constants.js',
    'app/main/01-helpers.js',
    // ... 15개 모듈
];

// 모든 모듈을 단일 IIFE로 패키징
output = `(function() {\n'use strict';\n${output}\n})();`;
```

**문제점:**
- 모듈 간 의존성이 암묵적 (주석으로만 표시)
- 순환 의존성 감지 불가
- 단일 파일로 빌드되어 부분 업데이트 불가

**영향도:**
- 코드 리팩토링 시 사이드 이펙트 위험
- 테스트가 어려움
- 번들 크기 최적화 불가

**권장 사항:**
```javascript
// ES6 모듈 시스템 도입 (장기적 목표)
// package.json
{
    "type": "module",
    "exports": {
        ".": "./dist/runtime.js",
        "./plugins": "./dist/plugins.js",
        "./core": "./dist/core.js"
    }
}

// 단계적 마이그레이션을 위한 래퍼 (단기적 해결책)
const MODULE_DEPENDENCIES = {
    '00-polyfill.js': [],
    '01-style.js': ['00-polyfill.js'],
    '02-react-bundle.js': ['00-polyfill.js'],
    'app/main/00-constants.js': ['00-polyfill.js'],
    'app/main/01-helpers.js': ['app/main/00-constants.js'],
    'app/main/04-api.js': ['app/main/03-data-manager.js'],
    // ... 명시적 의존성 그래프
};

// 의존성 검증기
function validateDependencies() {
    const loaded = new Set();

    for (const module of MODULES) {
        const deps = MODULE_DEPENDENCIES[module] || [];
        for (const dep of deps) {
            if (!loaded.has(dep)) {
                console.error(`의존성 위반: ${module}이(가) ${dep}보다 먼저 로드됨`);
            }
        }
        loaded.add(module);
    }
}

validateDependencies();
```

---

## 5. 종합 우선순위 및 실행 계획

### 🔴 즉시 조치 필요 (CRITICAL)

1. **무제한 계정 병합 제한** (06-merge-manager.js:342-405)
   - 예상 작업 시간: 4시간
   - 영향 범위: 계정 병합 기능 전체
   - 롤백 계획: 기존 코드 백업 후 기능 플래그로 보호

2. **버전 호환성 처리** (12-snapshot.js:370-378)
   - 예상 작업 시간: 6시간
   - 영향 범위: 스냅샷 내보내기/가져오기
   - 롤백 계획: 다중 버전 템플릿 동시 지원

3. **플러그인 시스템 도입** (전체 아키텍처)
   - 예상 작업 시간: 16시간 (2일)
   - 영향 범위: 전체 코드베이스
   - 롤백 계획: 기존 IIFE 패키징 유지

### 🟠 우선 조치 필요 (HIGH)

4. **계정 격리 보장 강화** (06-merge-manager.js:132-225)
   - 예상 작업 시간: 3시간
   - 영향 범위: 병합 충돌 해결

5. **하위 호환성 래퍼 구현** (12-snapshot.js:39-93)
   - 예상 작업 시간: 4시간
   - 영향 범위: 레거시 스냅샷 로딩

6. **API 버전 관리 체계** (04-api.js:15-59)
   - 예상 작업 시간: 5시간
   - 영향 범위: 모든 API 호출

### 🟡 점진적 개선 필요 (MEDIUM)

7. **데이터 병합 최적화** (06-merge-manager.js:230-271)
8. **Breaking Changes 감지** (04-api.js:84-124)
9. **Fallback 메커니즘** (04-api.js:149-188)
10. **설정 오버라이드 시스템** (00-constants.js:1-30)
11. **기능 플래그 시스템** (전체)
12. **모듈 경계 명확화** (build.js)

---

## 6. 결론

SearchAdvisor Runtime 코드베이스는 기본 기능은 잘 구현되어 있으나, **확장성과 호환성 측면에서 구조적 개선이 시급**합니다.

### 주요 취약점:
- 🔴 **확장성**: 플러그인 시스템 부재로 커스터마이징 불가
- 🔴 **호환성**: 버전 관리 체계 부재로 데이터 손실 위험
- 🔴 **확장성**: 무제한 계정 병합으로 메모리 누수 위험

### 권장 로드맵:

**단계 1 (1주일): 안정화**
- 계정 병합 한도 도입
- 스냅샷 버전 호환성 확보
- API 버전 관리 기초 구현

**단계 2 (2주일): 확장성**
- 플러그인 시스템 도입
- 설정 오버라이드 구현
- 기능 플래그 시스템 구축

**단계 3 (지속적): 최적화**
- 데이터 병합 성능 개선
- 모듈 시스템 현대화
- 테스트 커버리지 확대

---

**보고서 작성:** Claude Code
**검토 기간:** 2026-03-17
**다음 검토 예정:** 2026-04-01
