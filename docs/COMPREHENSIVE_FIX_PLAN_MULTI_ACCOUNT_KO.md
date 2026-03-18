# SearchAdvisor V2 마이그레이션 - 다중 계정 지원 포함 상세 수정 계획

## 📋 개요

**작성일**: 2026-03-18  
**대상**: V2 JSON Schema 마이그레이션 + 다중 계정 병합 지원  
**목표**: 단일 계정 → 다중 계정 병합 UI/알고리즘 완성

---

## 🔴 P0: 치명적 문제 (즉시 수정)

### P0-1. XSS 취약점 수정
**위치**: `01-helpers.js:419`

**수정 코드**:
```javascript
function ibox(type, html) {
  if (process.env.NODE_ENV !== 'production' && 
      typeof html === 'string' && 
      html.includes('<') && !html.includes('&lt;')) {
    console.warn('[SECURITY] ibox called with raw HTML. Use escHtml() for dynamic values.');
    console.trace('Call stack:');
  }
  return `<div class="ibox ibox-${type}">${html}</div>`;
}
```

---

### P0-2. V2 다중 계정 구조 지원 완성
**위치**: `03-data-manager.js`, `11-site-view.js`, `14-init.js`

**현재 문제**:
- 첫 번째 계정만 사용 (`accountKeys[0]`)
- 다중 계정 UI 선택 기능 없음
- 병합 모드 진입 로직 부족

**수정 계획**:

#### A. 데이터 로드 계층 다중 계정 지원
```javascript
// 03-data-manager.js 전면 개편
function loadSiteList(refresh) {
  const exportPayload = window.__SEARCHADVISOR_EXPORT_PAYLOAD__;
  if (!exportPayload) return;

  // V2 다중 계정 감지
  if (exportPayload.__meta && exportPayload.accounts) {
    handleV2MultiAccount(exportPayload);
  } else {
    handleLegacyFormat(exportPayload);
  }
}

function handleV2MultiAccount(payload) {
  const accountKeys = Object.keys(payload.accounts);
  
  console.log(`[V2 Multi-Account] Found ${accountKeys.length} accounts`);
  
  // 다중 계정 상태 저장
  window.__sadvAccountState = {
    isMultiAccount: accountKeys.length > 1,
    currentAccount: accountKeys[0],
    allAccounts: accountKeys,
    accountsData: {}
  };

  // 모든 계정 데이터 사이트별 병합
  const mergedSites = {};
  const siteOwnership = {}; // site -> [accountEmails]

  for (const accKey of accountKeys) {
    const account = payload.accounts[accKey];
    const sites = account.sites || [];
    
    for (const site of sites) {
      // 사이트별로 계정 목록 추적
      if (!siteOwnership[site]) {
        siteOwnership[site] = [];
      }
      siteOwnership[site].push(accKey);
      
      // 데이터 병합 (전략: 최신 우선)
      const siteData = account.dataBySite?.[site];
      if (siteData) {
        if (!mergedSites[site] || siteData.__meta.__fetched_at > (mergedSites[site]?.__meta?.__fetched_at || 0)) {
          mergedSites[site] = siteData;
        }
      }
    }
    
    // 계정별 데이터 저장
    window.__sadvAccountState.accountsData[accKey] = {
      encId: account.encId,
      sites: sites,
      dataBySite: account.dataBySite || {}
    };
  }

  // 병합된 사이트 데이터를 __sadvInitData에 저장
  window.__sadvInitData = {
    sites: mergedSites,
    siteOwnership: siteOwnership,
    isV2: true,
    _rawPayload: payload
  };

  console.log(`[V2 Multi-Account] Merged ${Object.keys(mergedSites).length} sites from ${accountKeys.length} accounts`);
}
```

#### B. 계정 전환 UI 추가
```javascript
// 07-ui-state.js에 계정 상태 관리 추가
let currentAccount = null;

function switchAccount(accountEmail) {
  if (!window.__sadvAccountState || !window.__sadvAccountState.isMultiAccount) {
    console.warn('[Account] Not multi-account mode');
    return;
  }

  const prevAccount = currentAccount;
  currentAccount = accountEmail;

  console.log(`[Account] Switching from ${prevAccount} to ${accountEmail}`);

  // 계정별 데이터 로드
  const accountData = window.__sadvAccountState.accountsData[accountEmail];
  if (!accountData) {
    console.error(`[Account] No data found for account: ${accountEmail}`);
    return;
  }

  // 현재 사이트가 이 계정에 있는지 확인
  const currentSite = curSite || null;
  const sitesInAccount = accountData.sites || [];
  
  // __sadvInitData 업데이트
  window.__sadvInitData.sites = accountData.dataBySite || {};
  window.__sadvInitData.currentAccount = accountEmail;

  // UI 업데이트
  updateUIState({ curAccount: accountEmail });

  // 현재 사이트가 이 계정에 없으면 첫 번째 사이트로 변경
  if (currentSite && !sitesInAccount.includes(currentSite)) {
    const newSite = sitesInAccount[0] || null;
    updateUIState({ curSite: newSite });
    if (newSite) {
      setComboSite(newSite);
    }
  }

  // 사이트 콤보 재구축
  buildCombo(window.__sadvRows || null);

  // 현재 뷰 다시 렌더링
  if (curMode === CONFIG.MODE.SITE && curSite) {
    loadSiteView(curSite);
  } else if (curMode === CONFIG.MODE.ALL) {
    renderAllSites();
  }

  __sadvNotify();
}

// 계정 정보 반환 함수
function getAccountList() {
  if (!window.__sadvAccountState || !window.__sadvAccountState.isMultiAccount) {
    return [];
  }

  return window.__sadvAccountState.allAccounts.map(accKey => {
    const accData = window.__sadvAccountState.accountsData[accKey];
    return {
      email: accKey,
      label: accKey.split('@')[0],
      fullLabel: accKey,
      encId: accData?.encId || '',
      siteCount: accData?.sites?.length || 0
    };
  });
}
```

---

### P0-3. exportCurrentAccountData 다중 계정 지원
**위치**: `06-merge-manager.js`

**현재 문제**: 항상 단일 계정만 export

**수정 코드**:
```javascript
// 06-merge-manager.js exportCurrentAccountData 수정
function exportCurrentAccountData(options = {}) {
  const { mode = 'current', includeAll = false } = options;
  const now = new Date().toISOString();
  const { accountLabel, encId } = getAccountInfo();

  // 다중 계정 확인
  const isMultiAccount = window.__sadvAccountState?.isMultiAccount || false;

  if (!isMultiAccount || includeAll) {
    // 단일 계정 또는 전체 계정 내보내기
    return exportSingleAccount(accountLabel, encId, now, includeAll);
  } else {
    // 현재 계정만 내보내기
    const currentAcc = window.__sadvAccountState?.currentAccount || accountLabel;
    return exportSingleAccount(currentAcc, encId, now, false);
  }
}

function exportSingleAccount(accountEmail, encId, now, includeAll) {
  let sites = {};
  let sitesList = [];
  let siteMeta = {};

  if (includeAll && window.__sadvAccountState?.isMultiAccount) {
    // 모든 계정 내보내기
    const allAccounts = window.__sadvAccountState.allAccounts;
    
    for (const accKey of allAccounts) {
      const accData = window.__sadvAccountState.accountsData[accKey];
      const accSites = accData?.sites || [];
      sitesList.push(...accSites);
      
      if (accData?.dataBySite) {
        Object.assign(sites, accData.dataBySite);
      }
      
      if (accData?.siteMeta) {
        Object.assign(siteMeta, accData.siteMeta);
      }
    }
  } else {
    // 현재 계정만 내보내기
    const currentAccData = window.__sadvAccountState?.accountsData?.[accountEmail];
    sitesList = currentAccData?.sites || [];
    sites = currentAccData?.dataBySite || {};
    siteMeta = currentAccData?.siteMeta || {};
  }

  return {
    __meta: {
      version: PAYLOAD_V2.VERSION,
      exportedAt: now,
      generator: 'SearchAdvisor Runtime',
      generatorVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || 'unknown',
      accountCount: includeAll ? window.__sadvAccountState?.allAccounts.length : 1
    },
    accounts: includeAll ? window.__sadvAccountState?.accountsData : {
      [accountEmail]: {
        encId: encId || 'unknown',
        sites: sitesList,
        siteMeta: siteMeta,
        dataBySite: sites
      }
    },
    ui: {
      curMode: (typeof curMode !== "undefined") ? curMode : "all",
      curSite: (typeof curSite !== "undefined") ? curSite : null,
      curTab: (typeof curTab !== "undefined") ? curTab : "overview",
      curAccount: (typeof window.__sadvAccountState?.currentAccount !== "undefined") 
        ? window.__sadvAccountState.currentAccount 
        : accountEmail
    },
    stats: {
      success: sitesList.length,
      partial: 0,
      failed: 0,
      errors: []
    },
    _siteOwnership: window.__sadvInitData?.siteOwnership || {}
  };
}
```

---

### P0-4. 함수 중복 해결 - ACCOUNT_UTILS 통합
**위치**: `03-data-manager.js`, `02-dom-init.js`, `06-merge-manager.js`

**수정 코드**:
```javascript
// 00-constants.js에 계정 유틸리티티 추가
const ACCOUNT_UTILS = {
  getAccountLabel: function() {
    try {
      const authUser = window.__NUXT__?.state?.authUser;
      return authUser?.email || "";
    } catch (e) {
      return "";
    }
  },
  
  getEncId: function() {
    try {
      return window.__NUXT__?.state?.authUser?.encId || "";
    } catch (e) {
      return "";
    }
  },
  
  getAccountInfo: function() {
    try {
      const authUser = window.__NUXT__?.state?.authUser;
      return {
        accountLabel: authUser?.email || "",
        encId: authUser?.encId || ""
      };
    } catch (e) {
      return { accountLabel: "", encId: "" };
    }
  },

  // 다중 계정 지원
  getCurrentAccount: function() {
    return window.__sadvAccountState?.currentAccount || 
           ACCOUNT_UTILS.getAccountLabel();
  },

  isMultiAccount: function() {
    return window.__sadvAccountState?.isMultiAccount || false;
  },

  getAllAccounts: function() {
    if (!window.__sadvAccountState?.isMultiAccount) {
      const label = ACCOUNT_UTILS.getAccountLabel();
      return label ? [label] : [];
    }
    return window.__sadvAccountState?.allAccounts || [];
  }
};
```

---

## 🟡 P1: 중요 문제 (병합 관련)

### P1-1. 병합 전략 선택 UI 추가
**위치**: 새로 추가 필요 (`09-ui-controls.js`)

**문제**: 병합 시 전략 선택이 없음 (현재는 'newer' 고정)

**수정 코드**:
```javascript
// 09-ui-controls.js에 병합 전략 추가
const MERGE_STRATEGIES = {
  NEWER: 'newer',       // 최신 데이터 우선
  ALL: 'all',           // 모든 데이터 병합
  TARGET: 'target',    // 기존 데이터 우선
  SOURCE: 'source',    // 새 데이터 우선
  ASK: 'ask'            // 매번 묻기 (구현용)
};

let currentMergeStrategy = MERGE_STRATEGIES.NEWER;

function setMergeStrategy(strategy) {
  currentMergeStrategy = strategy;
  console.log(`[Merge] Strategy changed to: ${strategy}`);
}

// 병합 전략 선택 UI 생성
function createMergeStrategySelector() {
  const selector = document.createElement('select');
  selector.id = 'sadv-merge-strategy';
  selector.className = 'sadv-merge-strategy-selector';
  
  const options = [
    { value: 'newer', label: '최신 우선' },
    { value: 'all', label: '모두 병합' },
    { value: 'target', label: '기존 우선' },
    { value: 'source', label: '신규 우선' }
  ];

  selector.innerHTML = options.map(opt => 
    `<option value="${opt.value}">${opt.label}</option>`
  ).join('');

  selector.addEventListener('change', (e) => {
    setMergeStrategy(e.target.value);
  });

  return selector;
}
```

---

### P1-2. 데이터 충돌 시 사용자 피드백
**위치**: `11-site-view.js`, `06-merge-manager.js`

**수정 코드**:
```javascript
// 데이터 충돌 감지 및 처리
function handleDataConflict(site, accounts, onResolve) {
  const conflictAccounts = accounts; // [acc1, acc2, ...]
  
  if (conflictAccounts.length === 1) {
    // 충돌 없음
    return conflictAccounts[0];
  }

  // 충돌 발생 - 사용자에게 선택 요청
  if (typeof onResolve === 'function') {
    return onResolve(site, conflictAccounts);
  }

  // 기본 전략: 최신 데이터 사용
  const latestAccount = getLatestAccountForSite(site, conflictAccounts);
  console.log(`[Conflict] Site ${site} has ${conflictAccounts.length} accounts, using latest: ${latestAccount}`);
  return latestAccount;
}

function getLatestAccountForSite(site, accountList) {
  let latestAccount = null;
  let latestTime = 0;

  for (const accKey of accountList) {
    const accData = window.__sadvAccountState?.accountsData?.[accKey];
    const siteData = accData?.dataBySite?.[site];
    
    if (siteData?.__meta?.__fetched_at > latestTime) {
      latestTime = siteData.__meta.__fetched_at;
      latestAccount = accKey;
    }
  }

  return latestAccount || accountList[0];
}
```

---

### P1-3. 병합 모드 UI 레이어 추가
**위치**: `07-ui-state.js`, 새로 추가

**수정 코드**:
```javascript
// 07-ui-state.js에 병합 모드 상태 추가
const MERGE_MODES = {
  SINGLE: 'single',    // 단일 계정 모드
  MERGED: 'merged'     // 병합 계정 모드
};

let currentMergeMode = MERGE_MODES.SINGLE;

function setMergeMode(mode) {
  const prevMode = currentMergeMode;
  currentMergeMode = mode;

  console.log(`[MergeMode] ${prevMode} → ${mode}`);

  // UI 업데이트
  updateUIState({ mergeMode: mode });

  // 모드별 UI 변경
  const headerEl = document.getElementById('sadv-account-badge');
  if (headerEl) {
    if (mode === MERGE_MODES.MERGED) {
      const accountCount = window.__sadvAccountState?.allAccounts?.length || 0;
      headerEl.textContent = `${accountCount}계정 병합`;
      headerEl.style.background = '#8b5cf6'; // 보라색
    } else {
      headerEl.textContent = accountLabel || 'SearchAdvisor';
      headerEl.style.background = '';
    }
  }

  // 콤보 박스에 계정 선택기 추가
  updateComboForMergeMode();
}

function updateComboForMergeMode() {
  const comboWrap = document.getElementById('sadv-combo-wrap');
  
  if (currentMergeMode === MERGE_MODES.MERGED) {
    // 계정 선택기 표시
    if (!document.getElementById('sadv-account-selector')) {
      const accountSelector = createAccountSelector();
      comboWrap.insertAdjacentElement('afterbegin', accountSelector);
    }
  } else {
    // 계정 선택기 숨김
    const existing = document.getElementById('sadv-account-selector');
    if (existing) existing.remove();
  }
}

function createAccountSelector() {
  const selector = document.createElement('select');
  selector.id = 'sadv-account-selector';
  selector.className = 'sadv-account-selector';
  selector.style.cssText = 'padding:4px 8px;border-radius:6px;background:#1e293b;color:#f1f5f9;border:1px solid #334155;margin-right:8px;';

  const accounts = getAccountList();
  selector.innerHTML = accounts.map(acc => 
    `<option value="${acc.email}">${acc.label}</option>`
  ).join('');

  selector.addEventListener('change', (e) => {
    switchAccount(e.target.value);
  });

  return selector;
}
```

---

## 🟢 P2: 개선 사항 (병합 관련)

### P2-1. 병합 이력 추적
```javascript
// 06-merge-manager.js에 병합 이력 추가
const MERGE_HISTORY_KEY = 'sadv_merge_history';

function recordMerge(sourceAccounts, targetAccount, strategy, result) {
  const history = JSON.parse(localStorage.getItem(MERGE_HISTORY_KEY) || '[]');
  
  history.push({
    timestamp: Date.now(),
    sourceAccounts,
    targetAccount,
    strategy,
    result: {
      successCount: result.success,
      mergedCount: result.merged,
      skippedCount: result.skipped,
      conflicts: result.conflicts.length
    }
  });

  // 최대 100개 기록 보관
  if (history.length > 100) {
    history.shift();
  }

  localStorage.setItem(MERGE_HISTORY_KEY, JSON.stringify(history));
}

function getMergeHistory() {
  try {
    return JSON.parse(localStorage.getItem(MERGE_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}
```

---

### P2-2. 계정별 색상/구분 추가
```javascript
// 계정별 색상 상수
const ACCOUNT_COLORS = [
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6'  // teal
];

function getAccountColor(accountEmail) {
  const accounts = window.__sadvAccountState?.allAccounts || [];
  const index = accounts.indexOf(accountEmail);
  return ACCOUNT_COLORS[index % ACCOUNT_COLORS.length];
}
```

---

## 📋 수정 작업 순서 (다중 계정 포함)

### Phase 1: 기반 다지기 (2-3일)
1. P0-1: XSS 취약점 수정
2. P0-3: ACCOUNT_UTILS 통합
3. P0-2: V2 다중 계정 구조 지원 완성

### Phase 2: 병합 UI/알고리즘 (3-4일)
4. P0-4: exportCurrentAccountData 다중 계정 지원
5. P1-1: 병합 전략 선택 UI
6. P1-2: 데이터 충돌 처리
7. P1-3: 병합 모드 UI 레이어

### Phase 3: 고급 기능 (2-3일)
8. P2-1: 병합 이력 추적
9. P2-2: 계정별 색상/구분
10. UI 전파 개선, 에러 핸들링

---

## ✅ 다중 계정 검증 체크리스트

- [ ] 2개 이상 계정 로드
- [ ] 계정 간 전환 정상
- [ ] 계정별 사이트 다름 표시
- [ ] 병합 전략별 데이터 정확함
- [ ] 충돌 사이트 처리
- [ ] export 시 다중 계정 포함
- [ ] import 시 병합 유지

---

**작성일**: 2026-03-18  
**예상 완료일**: Phase 1 ~ 1주, Phase 2 ~ 1주, Phase 3 ~ 1주  
**총 소요일**: 약 3-4주
