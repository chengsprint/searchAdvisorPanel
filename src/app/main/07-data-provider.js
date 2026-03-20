/**
 * Runtime provider facade
 *
 * 목적:
 * - UI 계층이 live/snapshot 전역 상태를 직접 덜 보게 만들기
 * - data/state 읽기 경계를 한 곳으로 모으기
 * - 1단계 리팩토링에서 "어디서 읽는지"만 분리하고 UI는 그대로 유지하기
 *
 * 왜 필요한가:
 * - 지금까지는 UI 코드가 allSites / mergedMeta / cacheMeta / snapshot payload를
 *   각 파일에서 직접 읽는 경향이 있었다.
 * - 그러면 design supply chain(UI)와 data supply chain(provider)가 다시 섞여
 *   live/snapshot drift가 커진다.
 *
 * 이번 1단계의 의도:
 * - UI를 갈아엎는 것이 아니다.
 * - 대신 "어디서 읽는지"만 facade 뒤로 숨겨서,
 *   다음 단계에서 provider 분리를 더 안전하게 진행할 발판을 만든다.
 */

function isSnapshotRuntime() {
  // 중요:
  // snapshot 판별을 EXPORT_PAYLOAD 존재 여부에만 의존하면 안 된다.
  // 라이브 패널도 저장 직전/직후 payload를 잠깐 들고 있을 수 있기 때문이다.
  //
  // 그래서 runtime kind 플래그를 최우선 기준으로 사용한다.
  // - live  : window.__SEARCHADVISOR_RUNTIME_KIND__ = "live"
  // - snapshot: window.__SEARCHADVISOR_RUNTIME_KIND__ = "snapshot"
  //
  // fallback으로 snapshot API 존재 여부만 본다.
  if (typeof window === "undefined") return false;
  if (window.__SEARCHADVISOR_RUNTIME_KIND__ === "snapshot") return true;
  if (window.__SEARCHADVISOR_RUNTIME_KIND__ === "live") return false;
  return !!window.__SEARCHADVISOR_SNAPSHOT_API__;
}

function isLiveRuntime() {
  return !isSnapshotRuntime();
}

function getRuntimeMode() {
  return isSnapshotRuntime() ? "snapshot" : "live";
}

function getRuntimeCapabilities() {
  // capability는 UI가 provider를 직접 모르고도
  // "이 런타임에서 가능한 기능"만 읽게 만들기 위한 얇은 계약이다.
  //
  // 1단계에서는 선언적 노출이 목적이고,
  // 이후 단계에서 버튼/행동 제어가 이 capability를 더 적극적으로 소비하게 된다.
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
  // shell state는 UI가 읽는 최소 공통 상태다.
  //
  // 우선순위:
  // 1) snapshot이면 snapshot API getState()
  // 2) snapshot bootstrap 초기 구간이면 buildSnapshotShellState(payload)
  // 3) live면 buildLiveShellState()
  // 4) 마지막 fallback
  //
  // 즉 이 함수는 "UI가 지금 어떤 공급원에서 상태를 읽어야 하는가"를
  // 한곳으로 몰아주는 역할이다.
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
  // 1단계 seam:
  // site detail view가 provider를 직접 의식하지 않도록,
  // snapshot이면 payload에서 읽고 live면 null을 돌려 기존 fetch path를 유지한다.
  //
  // 다음 단계에서는 이 seam을 바탕으로
  // live provider / offline provider를 더 명확히 분리할 수 있다.
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
