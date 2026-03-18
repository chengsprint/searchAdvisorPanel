# SearchAdvisor V2 마이그레이션 - 상세 수정 계획

## 📋 개요

**작성일**: 2026-03-18  
**대상**: V2 JSON Schema 마이그레이션 코드베이스  
**우선순위**: P0(치명적) → P1(중요) → P2(개선)

---

## 🔴 P0: 치명적 문제 (즉시 수정)

### P0-1. XSS 취약점 수정
**위치**: `src/app/main/01-helpers.js:419` (ibox 함수)

**문제**:
```javascript
function ibox(type, html) {
  // innerHTML에 직접 사용, 검증 없음
  return `<div class="ibox ibox-${type}">${html}</div>`;
}
```

**수정 코드**:
```javascript
// 01-helpers.js ibox 함수 수정
function ibox(type, html) {
  // 보안 검증 추가
  if (process.env.NODE_ENV !== 'production' && 
      typeof html === 'string' && 
      html.includes('<') && 
      !html.includes('&lt;')) {
    console.warn('[SECURITY] ibox called with raw HTML. Use escHtml() for dynamic values.');
    console.trace('Call stack:');
  }
  
  // 개발 모드에서는 자동 이스케이프 (선택적)
  // if (process.env.NODE_ENV !== 'production' && typeof html === 'string') {
  //   html = escHtml(html);
  // }
  
  return `<div class="ibox ibox-${type}">${html}</div>`;
}
```

**작업 단계**:
1. `ibox` 함수에 보안 검증 추가
2. `escHtml` 사용 강제 규칙 문서화
3. 테스트 케이스 추가

**검증**: `escHtml()` 사용하지 않은 HTML 전달 시 경고 로그 확인

---

### P0-2. V2 페이로드 구조 통일
**위치**: `src/app/main/03-data-manager.js:378-425`

**문제**: V2 구조 처리가 일관되지 않음

**수정 코드**:
```javascript
// 03-data-manager.js loadSiteList 함수 수정
// V2 포맷 명시적 처리 및 캡슐화
function loadSiteList(refresh) {
  // ...
  
  // V2 감지
  const isV2 = exportPayload && exportPayload.__meta && exportPayload.accounts;
  
  if (isV2) {
    console.log('[loadSiteList] V2 format detected');
    handleV2Payload(exportPayload);
  } else {
    console.log('[loadSiteList] Legacy format detected');
    handleLegacyPayload(exportPayload);
  }
}

// V2 전용 처리 함수 (새로 추가)
function handleV2Payload(payload) {
  const accountKeys = Object.keys(payload.accounts);
  if (accountKeys.length === 0) {
    console.warn('[V2] No accounts found');
    return;
  }

  // 첫 번째 계정 사용 (다중 계정 지원은 후속 확장)
  const firstAccountKey = accountKeys[0];
  const firstAccount = payload.accounts[firstAccountKey];
  
  const sites = firstAccount.sites || [];
  const dataBySite = firstAccount.dataBySite || {};

  window.__sadvInitData = {
    sites: dataBySite, // V2 구조 그대로 사용
    encId: firstAccount.encId || "unknown",
    accountEmail: firstAccountKey,
    isV2: true,
    _rawPayload: payload // 원본 보존
  };

  console.log('[V2] Loaded account:', firstAccountKey, 'sites:', sites.length);
}
```

**작업 단계**:
1. V2/Legacy 분기 로직 명확화
2. `handleV2Payload` 함수 추가
3. `__sadvInitData` 구조 표준화

**검증**: 콘솔 로그에서 V2 처리 확인, `window.__sadvInitData.isV2 === true`

---

### P0-3. 함수 중복 해결 - getAccountLabel
**위치**: `03-data-manager.js`, `02-dom-init.js`

**문제**: 동일한 함수가 두 파일에 중복 정의

**수정 방안 A (유틸리티 모듈)**:
```javascript
// 00-constants.js에 계정 유틸리티 추가
const ACCOUNT_UTILS = {
  /**
   * 계정 라벨 반환
   * @returns {string} 이메일 또는 빈 문자열
   */
  getAccountLabel: function() {
    try {
      const authUser = window.__NUXT__?.state?.authUser;
      return authUser?.email || "";
    } catch (e) {
      return "";
    }
  },
  
  /**
   * 계정 encId 반환
   * @returns {string} encId 또는 빈 문자열
   */
  getEncId: function() {
    try {
      return window.__NUXT__?.state?.authUser?.encId || "";
    } catch (e) {
      return "";
    }
  },
  
  /**
   * 계정 정보 전체 반환
   * @returns {{email: string, encId: string}}
   */
  getAccountInfo: function() {
    try {
      const authUser = window.__NUXT__?.state?.authUser;
      return {
        email: authUser?.email || "",
        encId: authUser?.encId || ""
      };
    } catch (e) {
      return { email: "", encId: "" };
    }
  }
};
```

**수정 방안 B (기존 getAccountInfo 활용)**:
- `06-merge-manager.js`에 이미 `getAccountInfo()` 존재
- 이를 `00-constants.js`로 이동하거나 공통 모듈로 분리

**작업 단계**:
1. `00-constants.js`에 `ACCOUNT_UTILS` 추가
2. `03-data-manager.js`에서 중복 제거
3. `02-dom-init.js`에서 중복 제거
4. `06-merge-manager.js`의 `getAccountInfo` 통합

**검증**: 함수가 한 곳에서만 정의되었는지 확인

---

## 🟡 P1: 중요 문제 (조기 수정 권장)

### P1-1. UI 상태 전파 개선
**위치**: `src/app/main/07-ui-state.js`, `09-ui-controls.js`

**문제**: `window` getter/setter와 지역 변수가 혼재

**수정 코드**:
```javascript
// 07-ui-state.js에 상태 변경 전용 함수 추가
function updateUIState(updates) {
  const prevValues = {
    curMode: curMode,
    curSite: curSite,
    curTab: curTab
  };
  
  // 값 업데이트
  if (updates.curMode !== undefined) curMode = updates.curMode;
  if (updates.curSite !== undefined) curSite = updates.curSite;
  if (updates.curTab !== undefined) curTab = updates.curTab;
  
  // 변경 알림
  __sadvNotify();
  setCachedUiState();
  
  // 디버깅
  if (process.env.NODE_ENV !== 'production') {
    const changed = Object.keys(updates).filter(k => prevValues[k] !== updates[k]);
    if (changed.length > 0) {
      console.log('[UI State] Changed:', changed, 
        '→', Object.fromEntries(changed.map(k => [k, updates[k]])));
    }
  }
}

// 09-ui-controls.js에서 사용 예시
function setComboSite(site) {
  // ...
  updateUIState({ curSite: site }); // 통일된 방식으로 상태 업데이트
  // ...
}
```

**작업 단계**:
1. `updateUIState` 함수 추가
2. 기존 상태 변경 코드를 `updateUIState`로 교체
3. 상태 변경 로깅 추가

---

### P1-2. V2 캐시 전략 개선
**위치**: `src/app/main/03-data-manager.js`

**문제**: 다중 계정 환경 고려하지 않음

**수정 코드**:
```javascript
// 03-data-manager.js 캐시 키 생성 개선
function getSiteDataCacheKey(site, accountEmail) {
  const namespace = getCacheNamespace();
  
  // 계정 이메일을 포함하여 다중 계정 분리
  const accountPart = accountEmail 
    ? btoa(accountEmail).replace(/=/g, "").slice(0, 8) 
    : "default";
  const sitePart = btoa(site).replace(/=/g, "");
  
  return DATA_LS_PREFIX + namespace + "_" + accountPart + "_" + sitePart;
}

// localStorage에서 사이트 데이터 가져오는 함수도 수정
function getSiteData(site) {
  // 현재 계정 이메일 확인
  const currentAccount = window.__sadvInitData?.accountEmail || "";
  const cacheKey = getSiteDataCacheKey(site, currentAccount);
  
  try {
    const data = localStorage.getItem(cacheKey);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}
```

**작업 단계**:
1. `getSiteDataCacheKey` 함수에 accountEmail 파라미터 추가
2. 모든 캐시 키 생성 부분 수정
3. 기존 캐시 마이그레이션 고려

---

### P1-3. 에러 핸들링 강화
**위치**: `src/app/main/11-site-view.js`

**문제**: 데이터 소스 실패 시 처리 부족

**수정 코드**:
```javascript
// 11-site-view.js loadSiteView 함수 수정
async function loadSiteView(site) {
  console.log('[loadSiteView] Called with site:', site);
  if (!site) {
    console.error('[loadSiteView] No site provided');
    showErrorToUser('사이트가 지정되지 않았습니다.');
    return;
  }

  // DOM 요소 확인
  const labelEl = document.getElementById('sadv-site-label');
  const bdEl = document.getElementById('sadv-bd');
  if (!labelEl || !bdEl) {
    console.error('[loadSiteView] DOM elements not found!');
    return;
  }

  // 데이터 소스 목록 (명시적 순서)
  const dataSources = [
    { 
      name: '__sadvInitData', 
      priority: 1,
      get: () => {
        if (!window.__sadvInitData || !window.__sadvInitData.sites) {
          console.log('[Data Source] __sadvInitData not available');
          return null;
        }
        return window.__sadvInitData.sites[site];
      }
    },
    { 
      name: '__sadvMergedData', 
      priority: 2,
      get: () => window.__sadvMergedData?.sites?.[site] || null
    },
    {
      name: 'EXPORT_PAYLOAD_V2',
      priority: 3,
      get: () => {
        const payload = window.__SEARCHADVISOR_EXPORT_PAYLOAD__;
        if (!payload?.__meta || !payload?.accounts) {
          return null;
        }
        // V2 구조에서 데이터 찾기
        for (const accKey of Object.keys(payload.accounts)) {
          const data = payload.accounts[accKey]?.dataBySite?.[site];
          if (data) {
            console.log(`[Data Source] Found in V2 account: ${accKey}`);
            return data;
          }
        }
        return null;
      }
    },
    {
      name: 'EXPORT_PAYLOAD_Legacy',
      priority: 4,
      get: () => window.__SEARCHADVISOR_EXPORT_PAYLOAD__?.dataBySite?.[site] || null
    },
    {
      name: 'memCache',
      priority: 5,
      get: () => typeof memCache !== 'undefined' ? memCache[site] : null
    }
  ];

  // 데이터 소스 순차 시도
  let d = null;
  let sourceName = null;

  for (const source of dataSources) {
    d = source.get();
    if (d) {
      sourceName = source.name;
      console.log(`[loadSiteView] Found data in ${sourceName} (priority: ${source.priority})`);
      break;
    }
  }

  if (!d || !d.expose || !d.expose.items || !d.expose.items.length) {
    console.error(`[loadSiteView] No data found for ${site} from any source`);
    showErrorToUser(`${site}의 데이터를 찾을 수 없습니다.`);
    bdEl.innerHTML = `
      <div style="padding:40px 20px;text-align:center">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:16px;color:#ef4444">
          ${ICONS.xMark.replace('width="14" height="14"','width="22" height="22"')}
        </div>
        <div style="color:#f8fafc;font-weight:700;font-size:14px;margin-bottom:6px">데이터 없음</div>
        <div style="color:#64748b;font-size:12px">${site}의 데이터를 찾을 수 없습니다</div>
      </div>`;
    return;
  }

  // 정상 처리 계속...
}

// 에러 표시 헬퍼 함수
function showErrorToUser(message) {
  console.error('[Error]', message);
  // 사용자에게 표시할 UI (선택사항)
}
```

**작업 단계**:
1. 데이터 소스 배열화 및 우선순위 부여
2. 각 소스별 명시적 로깅
3. 에러 발생 시 사용자에게 알림
4. 빈 데이터 처리 개선

---

## 🟢 P2: 개선 사항 (점진적 수정)

### P2-1. 탭 ID 상수화
**위치**: `07-ui-state.js`, `12-snapshot.js`

**수정 코드**:
```javascript
// 00-constants.js에 추가
const TABS = {
  IDS: ["overview", "daily", "queries", "pages", "crawl", "backlink", "diagnosis", "insight"],
  LABELS: {
    overview: "개요",
    daily: "일별",
    queries: "검색어",
    pages: "URL",
    crawl: "크롤",
    backlink: "백링크",
    diagnosis: "색인",
    insight: "인사이트"
  },
  DEFAULT: "overview",
  ALL: TABS.IDS
};

// 사용 예시
const snapshotTabIds = TABS.IDS; // 기존 하드코딩된 배열 대체
```

---

### P2-2. 비동기 초기화 Race Condition 수정
**위치**: `14-init.js`

**수정 코드**:
```javascript
// 14-init.js 초기화 순서 보장
(async function() {
  try {
    // 1단계: 데이터 로드 (완료 대기)
    await loadSiteList(false);
    
    // 2단계: 데모 데이터 주입 (조건부)
    const demoInjected = injectDemoData();
    
    // 3단계: 전체 새로고침 (데모가 아닐 경우)
    if (!demoInjected && !IS_DEMO_MODE) {
      const shouldRefresh = shouldBootstrapFullRefresh();
      if (shouldRefresh) {
        await runFullRefreshPipeline({ trigger: "cache-expiry" });
      }
    }
    
    // 4단계: UI 초기화
    // ...
    
  } catch (e) {
    console.error('[Init Error]', e);
    // 에러 복구 로직
    showInitError(e);
  }
})();

function showInitError(error) {
  // 사용자에게 초기화 실패 알림
  console.error('[Init] Initialization failed:', error);
}
```

---

### P2-3. 헬퍼 함수 성능 최적화
**위치**: `01-helpers.js`

**수정 코드**:
```javascript
// 01-helpers.js 인덱스 캐싱 추가
let lastPayloadVersion = null;
let lastBuiltIndex = null;

function buildSiteToAccountIndex(payload) {
  const currentVersion = payload?.__meta?.savedAt || payload?.savedAt || 'unknown';
  
  // 캐시 적중
  if (currentVersion === lastPayloadVersion && lastBuiltIndex) {
    return lastBuiltIndex;
  }
  
  // 인덱스 구축
  const index = {};
  if (payload?.accounts) {
    // V2 구조
    for (const [email, account] of Object.entries(payload.accounts)) {
      for (const site of account.sites || []) {
        if (!index[site]) index[site] = [];
        index[site].push(email);
      }
    }
  } else if (payload?.allSites) {
    // Legacy 구조
    for (const site of payload.allSites) {
      index[site] = [payload.accountLabel || 'unknown'];
    }
  }
  
  // 캐시 업데이트
  lastPayloadVersion = currentVersion;
  lastBuiltIndex = index;
  
  return index;
}
```

---

## 📋 수정 작업 순서

### Phase 1: 치명적 문제 (1-2일)
1. P0-1: XSS 취약점 수정
2. P0-2: V2 구조 통일
3. P0-3: 함수 중복 해결

### Phase 2: 중요 문제 (2-3일)
4. P1-1: UI 상태 전파 개선
5. P1-2: V2 캐시 전략 개선
6. P1-3: 에러 핸들링 강화

### Phase 3: 개선 사항 (3-5일)
7. P2-1: 탭 ID 상수화
8. P2-2: 비동기 초기화 수정
9. P2-3: 성능 최적화

---

## ✅ 검증 체크리스트

각 수정 후 다음을 검증:

- [ ] 빌드 성공 (`node build.js`)
- [ ] 구문 검증 통과
- [ ] 개별 계정 로드 정상
- [ ] 병합 계정 로드 정상
- [ ] 모든 탭 전환 정상
- [ ] 그래프 렌더링 정상
- [ ] 콘솔 에러 없음
- [ ] 스크린샷 캡처 정상

---

**작성일**: 2026-03-18  
**예상 완료일**: Phase 1 ~ 2주, 전체 ~1달
