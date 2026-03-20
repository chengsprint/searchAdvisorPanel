/**
 * Runtime provider facade
 *
 * 목적:
 * - UI 계층이 live/snapshot 전역 상태를 직접 덜 보게 만들기
 * - data/state 읽기 경계를 한 곳으로 모으기
 * - 1단계 리팩토링에서 "어디서 읽는지"만 분리하고 UI는 그대로 유지하기
 */

function isSnapshotRuntime() {
  return typeof window !== "undefined" && !!window.__SEARCHADVISOR_EXPORT_PAYLOAD__;
}

function isLiveRuntime() {
  return !isSnapshotRuntime();
}

function getRuntimeMode() {
  return isSnapshotRuntime() ? "snapshot" : "live";
}

function getRuntimeCapabilities() {
  if (isSnapshotRuntime()) {
    return {
      mode: "snapshot",
      canRefresh: false,
      canSave: false,
      canClose: false,
      isReadOnly: true,
    };
  }
  return {
    mode: "live",
    canRefresh: true,
    canSave: true,
    canClose: true,
    isReadOnly: false,
  };
}

function getRuntimeShellState() {
  if (isSnapshotRuntime()) {
    if (
      typeof window !== "undefined" &&
      window.__SEARCHADVISOR_SNAPSHOT_API__ &&
      typeof window.__SEARCHADVISOR_SNAPSHOT_API__.getState === "function"
    ) {
      return window.__SEARCHADVISOR_SNAPSHOT_API__.getState();
    }
    if (
      typeof buildSnapshotShellState === "function" &&
      typeof window !== "undefined" &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__
    ) {
      return buildSnapshotShellState(window.__SEARCHADVISOR_EXPORT_PAYLOAD__);
    }
  }
  if (typeof buildLiveShellState === "function") return buildLiveShellState();
  if (typeof __sadvSnapshot === "function") return __sadvSnapshot();
  return {
    curMode: typeof curMode === "string" ? curMode : CONFIG.MODE.ALL,
    curSite: typeof curSite === "string" ? curSite : null,
    curTab: typeof curTab === "string" ? curTab : "overview",
    allSites: Array.isArray(allSites) ? allSites.slice() : [],
    rows: Array.isArray(window.__sadvRows) ? window.__sadvRows.slice() : [],
    accountLabel: "",
    runtimeVersion: "runtime",
    cacheMeta: null,
  };
}

function getRuntimeRows() {
  const state = getRuntimeShellState();
  if (state && Array.isArray(state.rows)) return state.rows.slice();
  return Array.isArray(window.__sadvRows) ? window.__sadvRows.slice() : [];
}

function getRuntimeAllSites() {
  const state = getRuntimeShellState();
  if (state && Array.isArray(state.allSites)) return state.allSites.slice();
  return Array.isArray(allSites) ? allSites.slice() : [];
}

function getRuntimeSiteMeta() {
  const state = getRuntimeShellState();
  if (state && state.siteMeta && typeof state.siteMeta === "object") return state.siteMeta;
  if (typeof getSnapshotMetaState === "function") {
    const metaState = getSnapshotMetaState();
    return metaState && metaState.siteMeta && typeof metaState.siteMeta === "object"
      ? metaState.siteMeta
      : {};
  }
  return {};
}

function getRuntimeMergedMeta() {
  const state = getRuntimeShellState();
  if (state && Object.prototype.hasOwnProperty.call(state, "mergedMeta")) return state.mergedMeta;
  if (typeof getMergedMetaState === "function") return getMergedMetaState();
  return null;
}

function getRuntimeCacheMeta() {
  const state = getRuntimeShellState();
  return state && state.cacheMeta ? state.cacheMeta : null;
}

function getRuntimeSiteData(site) {
  if (!site) return null;
  if (isSnapshotRuntime()) {
    const payload =
      typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__
        : null;
    if (payload && payload.dataBySite && typeof payload.dataBySite === "object") {
      return payload.dataBySite[site] || null;
    }
    return null;
  }
  return null;
}
