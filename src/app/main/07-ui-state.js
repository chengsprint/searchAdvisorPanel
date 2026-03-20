// UI State Management
// 이 파일은 SearchAdvisor 런타임의 UI 상태 관리 코드를 포함합니다.

// ============================================================================
// 상태 변수
// ============================================================================

let curMode = CONFIG.MODE.ALL,
  curSite = null,
  curTab = "overview";
// 전체현황 전용 period state.
// 중요:
// - global filter가 아니다.
// - site mode와 무관한 all-sites local view state다.
// - live/saved HTML/merge가 같은 기준을 공유해야 하므로 shell state에 포함한다.
let allSitesPeriodDays = 90;
let siteViewReqId = 0;
let allViewReqId = 0;
const __sadvListeners = new Set();
let __sadvInitialReady = false;
const __sadvReadyResolvers = [];

function getLiveCacheMeta() {
  const timestamps = [];
  const siteListTs = getSiteListCacheStamp();
  if (typeof siteListTs === "number") timestamps.push(siteListTs);

  const memCache = typeof getMemCache === "function" ? getMemCache() : null;
  allSites.forEach(function (site) {
    const siteTs = getSiteDataCacheStamp(site);
    if (typeof siteTs === "number") {
      timestamps.push(siteTs);
      return;
    }
    const memData = memCache && memCache[site];
    if (memData && typeof memData.__cacheSavedAt === "number") {
      timestamps.push(memData.__cacheSavedAt);
    }
  });

  if (!timestamps.length) return null;

  const ttlMs = getDataTtlMs();
  const newestTs = Math.max.apply(null, timestamps);
  const oldestTs = Math.min.apply(null, timestamps);

  return {
    label: "live-cache",
    updatedAt: new Date(newestTs),
    remainingMs: Math.max(0, oldestTs + ttlMs - Date.now()),
    sourceCount: Array.isArray(allSites) ? allSites.length : 0,
    measuredAt: Date.now(),
    ttlMs: ttlMs,
  };
}

function buildLiveShellState() {
  // live shell state는 현재 패널 UI를 외부와 동기화할 때 쓰는 최소 상태다.
  // 내부 구현 세부사항을 전부 노출하는 것이 아니라,
  // UI parity에 필요한 shape를 안정적으로 제공하는 것이 목적이다.
  const snapshotAccountLabel =
    (typeof window !== "undefined" &&
      window.__sadvAccountState &&
      typeof window.__sadvAccountState.currentAccount === "string" &&
      window.__sadvAccountState.currentAccount) ||
    (ACCOUNT_UTILS.getAccountInfo().accountLabel || "") ||
    accountLabel ||
    "";

  return {
    curMode,
    curSite,
    curTab,
    allSitesPeriodDays: normalizeAllSitesPeriodDays(allSitesPeriodDays),
    allSites: [...allSites],
    rows: typeof getCanonicalRowsState === "function" ? getCanonicalRowsState() : (window.__sadvRows || []),
    accountLabel: snapshotAccountLabel,
    runtimeVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "runtime",
    cacheMeta: getLiveCacheMeta(),
  };
}

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
  return buildLiveShellState();
}

function getAllSitesPeriodDaysState() {
  return normalizeAllSitesPeriodDays(allSitesPeriodDays);
}

function setAllSitesPeriodDaysState(days) {
  allSitesPeriodDays = normalizeAllSitesPeriodDays(days);
  return allSitesPeriodDays;
}

function getCanonicalRowsState() {
  // canonical rows는 아직 완전한 state contract로 승격되기 전이므로
  // 내부 저장소는 계속 window.__sadvRows를 사용한다.
  //
  // 다만 Phase 1부터는 UI가 이 전역 저장소를 직접 읽기보다
  // 공용 getter를 통과하도록 점진적으로 수렴시킨다.
  return Array.isArray(window.__sadvRows) ? window.__sadvRows.slice() : [];
}

function setCanonicalRowsState(rows) {
  // 중요:
  // - 이 함수는 canonical rows "저장 위치"를 추상화하는 seam이다.
  // - 지금 단계에서는 여전히 window.__sadvRows가 실제 저장소지만,
  //   이후 phase에서 data.rows contract로 이동할 때 호출 지점을 한 번에 교체하기 쉽다.
  // - 반드시 배열 사본을 써서 render helper가 원본 배열을 우발적으로 mutate하지 않게 한다.
  window.__sadvRows = Array.isArray(rows) ? rows.slice() : [];
  return getCanonicalRowsState();
}

function getSelectionStateValue() {
  return {
    curMode,
    curSite,
    curTab,
  };
}

function setSelectionStateValue(patch) {
  // Phase 1 seam:
  // selection(curMode/curSite/curTab)을 한 번에 다루는 공용 entry를 만든다.
  //
  // 왜 필요한가:
  // - UI가 curMode/curSite/curTab를 여기저기 직접 바꾸기 시작하면
  //   saved/live parity와 후속 provider 분리가 다시 어려워진다.
  // - 지금은 작은 seam이지만, 장기적으로는 public action/state contract의
  //   내부 구현으로 수렴해야 한다.
  if (!patch || typeof patch !== "object") return getSelectionStateValue();
  if (patch.curMode === CONFIG.MODE.ALL || patch.curMode === CONFIG.MODE.SITE) {
    curMode = patch.curMode;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "curSite")) {
    curSite = typeof patch.curSite === "string" ? patch.curSite : null;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "curTab")) {
    curTab = typeof patch.curTab === "string" ? patch.curTab : "overview";
  }
  return getSelectionStateValue();
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
  if (typeof syncLiveHeaderMeta === "function") {
    try {
      syncLiveHeaderMeta(snap);
    } catch (e) {
      console.error('[__sadvNotify] Header sync error:', e);
    }
  }
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
  // snapshot shell state는 offline payload를
  // live와 유사한 UI 상태 shape로 정규화하는 boundary 함수다.
  // Handle V2 format
  let allSites, dataBySite, summaryRows, siteMeta, accountLabel, savedAt, curMode, curSite, curTab, allSitesPeriodDays;

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
    allSitesPeriodDays = payload.ui?.allSitesPeriodDays;
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
    allSitesPeriodDays = 90;
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
  const normalizedPayload = {
    mergedMeta: Object.prototype.hasOwnProperty.call(payload || {}, "mergedMeta")
      ? payload.mergedMeta
      : null,
  };
  return {
    accountLabel: accountLabel,
    allSites: Array.isArray(allSites) ? allSites : [],
    rows: Array.isArray(summaryRows) ? summaryRows.slice() : [],
    siteMeta: siteMeta && typeof siteMeta === "object" ? siteMeta : {},
    mergedMeta: Object.prototype.hasOwnProperty.call(normalizedPayload, "mergedMeta")
      ? normalizedPayload.mergedMeta
      : null,
    curMode: curMode === CONFIG.MODE.SITE ? CONFIG.MODE.SITE : CONFIG.MODE.ALL,
    curSite:
      typeof curSite === "string"
        ? curSite
        : (Array.isArray(allSites) && allSites[0]) || null,
    curTab: snapshotTabIds.indexOf(curTab) !== -1
      ? curTab
      : "overview",
    allSitesPeriodDays: normalizeAllSitesPeriodDays(allSitesPeriodDays),
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
function defineMutableWindowState(name, getter, setter) {
  if (typeof window === "undefined") return;
  const existing = Object.getOwnPropertyDescriptor(window, name);
  if (existing && existing.configurable === false) {
    return;
  }
  Object.defineProperty(window, name, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

if (typeof window !== "undefined") {
  // UI 상태 변수들을 window 객체에 노출
  defineMutableWindowState("curMode", function() { return curMode; }, function(v) { curMode = v; });
  defineMutableWindowState("curSite", function() { return curSite; }, function(v) { curSite = v; });
  defineMutableWindowState("curTab", function() { return curTab; }, function(v) { curTab = v; });
  defineMutableWindowState("siteViewReqId", function() { return siteViewReqId; }, function(v) { siteViewReqId = v; });
  defineMutableWindowState("allViewReqId", function() { return allViewReqId; }, function(v) { allViewReqId = v; });

  // React 18 호환 상태 관리 노출
  // React 18 Concurrent Mode에서도 안전하게 상태를 구독할 수 있습니다.
  window.__SEARCHADVISOR_UI_STATE__ = {
    getState: function() {
      return {
        ...buildLiveShellState(),
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
