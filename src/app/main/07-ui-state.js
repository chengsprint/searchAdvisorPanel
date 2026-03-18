// UI State Management
// 이 파일은 SearchAdvisor 런타임의 UI 상태 관리 코드를 포함합니다.

// ============================================================================
// 상태 변수
// ============================================================================

let curMode = CONFIG.MODE.ALL,
  curSite = null,
  curTab = "overview";
let siteViewReqId = 0;
let allViewReqId = 0;
const __sadvListeners = new Set();
let __sadvInitialReady = false;
const __sadvReadyResolvers = [];

// ============================================================================
// 스냅샷 상태 함수들
// ============================================================================

function __sadvSnapshot() {
  return {
    curMode,
    curSite,
    curTab,
    allSites: [...allSites],
    rows: window.__sadvRows || [],
    accountLabel,
  };
}

function __sadvNotify() {
  const snap = __sadvSnapshot();
  __sadvListeners.forEach(function (fn) {
    try {
      fn(snap);
    } catch (e) {
      console.error('[__sadvNotify] Error:', e);
    }
  });
}

function __sadvMarkReady() {
  if (__sadvInitialReady) return;
  __sadvInitialReady = true;
  while (__sadvReadyResolvers.length) {
    const resolve = __sadvReadyResolvers.shift();
    try {
      resolve(true);
    } catch (e) {
      console.error('[__sadvMarkReady] Error:', e);
    }
  }
  __sadvNotify();
}

// ============================================================================
// 스냅샷 쉘 상태 관리 함수들
// ============================================================================

function buildSnapshotShellState(payload) {
  // Handle V2 format
  let allSites, dataBySite, summaryRows, siteMeta, accountLabel, savedAt, curMode, curSite, curTab;

  if (payload.__meta && payload.accounts) {
    // V2 format
    const accountKeys = Object.keys(payload.accounts);
    const firstAccount = accountKeys.length > 0 ? payload.accounts[accountKeys[0]] : null;

    accountLabel = accountKeys[0] || "";
    allSites = firstAccount?.sites || [];
    dataBySite = firstAccount?.dataBySite || {};
    summaryRows = payload.summaryRows || [];
    siteMeta = firstAccount?.siteMeta || {};
    savedAt = payload.__meta.savedAt;
    curMode = payload.ui?.curMode || CONFIG.MODE.ALL;
    curSite = payload.ui?.curSite || null;
    curTab = payload.ui?.curTab || "overview";
  } else {
    // V2 포맷이 아닌 경우 빈 값 반환
    accountLabel = "";
    allSites = [];
    dataBySite = {};
    summaryRows = [];
    siteMeta = {};
    savedAt = null;
    curMode = CONFIG.MODE.ALL;
    curSite = null;
    curTab = "overview";
  }

  const snapshotTabIds = [
    "overview",
    "daily",
    "queries",
    "pages",
    "crawl",
    "backlink",
    "diagnosis",
    "insight",
  ];
  const cacheSavedAtValues = allSites
    .map(function (site) {
      const siteData = dataBySite && dataBySite[site];
      return siteData && typeof siteData.__cacheSavedAt === "number"
        ? siteData.__cacheSavedAt
        : null;
    })
    .filter(function (value) {
      return typeof value === "number";
    });
  const savedAtValue =
    savedAt && !Number.isNaN(new Date(savedAt).getTime())
      ? new Date(savedAt)
      : null;
  const updatedAt = cacheSavedAtValues.length
    ? new Date(Math.max.apply(null, cacheSavedAtValues))
    : savedAtValue;
  return {
    accountLabel: accountLabel,
    allSites: Array.isArray(allSites) ? allSites : [],
    rows: Array.isArray(summaryRows) ? summaryRows.slice() : [],
    siteMeta: siteMeta && typeof siteMeta === "object" ? siteMeta : {},
    curMode: curMode === CONFIG.MODE.SITE ? CONFIG.MODE.SITE : CONFIG.MODE.ALL,
    curSite:
      typeof curSite === "string"
        ? curSite
        : (Array.isArray(allSites) && allSites[0]) || null,
    curTab: snapshotTabIds.indexOf(curTab) !== -1
      ? curTab
      : "overview",
    runtimeVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot",
    cacheMeta: updatedAt
      ? {
          label: "snapshot",
          updatedAt,
          remainingMs: null,
          sourceCount: Array.isArray(allSites) ? allSites.length : 0,
          measuredAt: Date.now(),
        }
      : null,
  };
}

// ============================================================================
// 메타데이터 상태 관리
// ============================================================================

let snapshotMetaState = { siteMeta: {}, mergedMeta: null };

function setSnapshotMetaState(state) {
  snapshotMetaState = {
    siteMeta: state && state.siteMeta ? state.siteMeta : {},
    mergedMeta: state && state.mergedMeta ? state.mergedMeta : null,
  };
}

function getSiteMetaMap() {
  const liveMap = snapshotMetaState.siteMeta;
  if (liveMap && Object.keys(liveMap).length) return liveMap;
  const payload =
    typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__
      ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__
      : null;
  if (!payload) return {};

  // Handle V2 format
  if (payload.__meta && payload.accounts) {
    const accountKeys = Object.keys(payload.accounts);
    if (accountKeys.length > 0) {
      return payload.accounts[accountKeys[0]]?.siteMeta || {};
    }
  }

  // Legacy format
  return payload.siteMeta || {};
}

function getMergedMetaState() {
  if (snapshotMetaState.mergedMeta) return snapshotMetaState.mergedMeta;
  const payload =
    typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__
      ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__
      : null;
  return payload && payload.mergedMeta ? payload.mergedMeta : null;
}

// ============================================================================
// 전역 노출 (IIFE로 감싸진 환경에서도 접근 가능하도록)
// ============================================================================
if (typeof window !== "undefined") {
  // UI 상태 변수들을 window 객체에 노출
  Object.defineProperty(window, "curMode", {
    get: function() { return curMode; },
    set: function(v) { curMode = v; },
    enumerable: true
  });
  Object.defineProperty(window, "curSite", {
    get: function() { return curSite; },
    set: function(v) { curSite = v; },
    enumerable: true
  });
  Object.defineProperty(window, "curTab", {
    get: function() { return curTab; },
    set: function(v) { curTab = v; },
    enumerable: true
  });
  Object.defineProperty(window, "siteViewReqId", {
    get: function() { return siteViewReqId; },
    set: function(v) { siteViewReqId = v; },
    enumerable: true
  });
  Object.defineProperty(window, "allViewReqId", {
    get: function() { return allViewReqId; },
    set: function(v) { allViewReqId = v; },
    enumerable: true
  });
}
