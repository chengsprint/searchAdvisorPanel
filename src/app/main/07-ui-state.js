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

/**
 * Create a snapshot of the current UI state
 * @returns {Object} Object containing current mode, site, tab, sites, rows, and account label
 * @example
 * const snapshot = __sadvSnapshot();
 * console.log(snapshot.curMode); // "all" or "site"
 */
function __sadvSnapshot() {
  const snapshotAccountLabel =
    (typeof window !== "undefined" &&
      window.__sadvAccountState &&
      typeof window.__sadvAccountState.currentAccount === "string" &&
      window.__sadvAccountState.currentAccount) ||
    (ACCOUNT_UTILS.getAccountInfo().accountLabel || "");

  return {
    curMode,
    curSite,
    curTab,
    allSites: [...allSites],
    rows: window.__sadvRows || [],
    accountLabel: snapshotAccountLabel,
  };
}

/**
 * Notify all registered listeners of UI state changes
 * Calls each listener with the current snapshot
 * @returns {void}
 * @see {__sadvSnapshot}
 */
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

/**
 * Mark the SearchAdvisor UI as ready and resolve all pending ready promises
 * Should only be called once during initialization
 * @returns {void}
 * @see {__sadvNotify}
 */
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

/**
 * Build snapshot shell state from a V2 payload
 * Extracts UI state, metadata, and site information from a saved snapshot
 * @param {Object} payload - V2 payload object
 * @returns {Object} Snapshot shell state with accountLabel, allSites, rows, siteMeta, curMode, curSite, curTab, runtimeVersion, cacheMeta
 * @example
 * const shellState = buildSnapshotShellState(exportPayload);
 * console.log(shellState.accountLabel); // "user@example.com"
 */
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

/**
 * Set the snapshot metadata state
 * @param {Object} state - State object containing siteMeta and mergedMeta
 * @returns {void}
 * @example
 * setSnapshotMetaState({
 *   siteMeta: { 'https://example.com': { label: 'Example' } },
 *   mergedMeta: { isMerged: true }
 * });
 */
function setSnapshotMetaState(state) {
  snapshotMetaState = {
    siteMeta: state && state.siteMeta ? state.siteMeta : {},
    mergedMeta: state && state.mergedMeta ? state.mergedMeta : null,
  };
}

/**
 * Get the site metadata map from live state or export payload
 * Returns a map of site URLs to their metadata (labels, etc.)
 * @returns {Object} Site metadata map
 * @example
 * const metaMap = getSiteMetaMap();
 * console.log(metaMap['https://example.com'].label); // 'Example Site'
 * @see {getMergedMetaState}
 */
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

/**
 * Get the merged metadata state for multi-account snapshots
 * @returns {Object|null} Merged metadata object or null
 * @example
 * const mergedMeta = getMergedMetaState();
 * if (mergedMeta?.isMerged) {
 *   console.log('This is a merged snapshot');
 * }
 * @see {getSiteMetaMap}
 */
function getMergedMetaState() {
  if (snapshotMetaState.mergedMeta) return snapshotMetaState.mergedMeta;
  const payload =
    typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__
      ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__
      : null;
  return payload && payload.mergedMeta ? payload.mergedMeta : null;
}

/**
 * Check whether the current payload/state represents a merged report
 * @returns {boolean} True when merged metadata exists
 */
function isMergedReport() {
  return !!getMergedMetaState();
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

  // React 18 호환 상태 관리 노출
  // React 18 Concurrent Mode에서도 안전하게 상태를 구독할 수 있습니다.
  window.__SEARCHADVISOR_UI_STATE__ = {
    getState: function() {
      return {
        curMode: curMode,
        curSite: curSite,
        curTab: curTab,
        allSites: [...allSites],
        rows: window.__sadvRows || [],
        accountLabel: accountLabel,
        siteViewReqId: siteViewReqId,
        allViewReqId: allViewReqId
      };
    },
    subscribe: function(listener) {
      __sadvListeners.add(listener);
      // 구독 해제 함수 반환
      return function unsubscribe() {
        __sadvListeners.delete(listener);
      };
    },
    // React 18 Concurrent Mode 호환 알림
    notifyConcurrent: function() {
      const react18Compat = window.__REACT18_COMPAT__;
      if (react18Compat && react18Compat.supportsConcurrentFeatures()) {
        // React 18에서는 다음 타이머 틱에 알림
        Promise.resolve().then(__sadvNotify);
      } else {
        // React 17 이하에서는 즉시 알림
        __sadvNotify();
      }
    }
  };
}
