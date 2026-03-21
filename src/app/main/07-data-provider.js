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

function setRuntimePublicApi(api) {
  // Phase 2 public entry seam:
  // live/saved가 공용 제어 facade(window.__sadvApi)를 각각 직접 만지지 않고
  // 같은 게시 entry를 통과하게 만든다.
  //
  // 왜 필요한가:
  // - 이후 shared app entry 단계에서 public facade shape를 한 곳에서 바꾸기 쉽다.
  // - saved가 richer snapshot API를 별도로 갖더라도, 외부 automation/QA는
  //   동일한 public facade 이름만 보면 된다.
  if (typeof window === "undefined") return api || null;
  if (!api || typeof api !== "object") {
    delete window.__sadvApi;
    return null;
  }
  window.__sadvApi = api;
  return window.__sadvApi;
}

function clearRuntimePublicApi() {
  return setRuntimePublicApi(null);
}

const __sadvSaveStatusListeners = new Set();

function createDefaultRuntimeSaveStatus() {
  return {
    active: false,
    state: "idle",
    phase: null,
    stageLabel: "",
    detail: "",
    startedAt: null,
    updatedAt: Date.now(),
    completedAt: null,
    progress: {
      done: 0,
      total: 0,
      ratio: 0,
      percent: 0,
    },
    stats: {
      success: 0,
      partial: 0,
      failed: 0,
      errors: [],
    },
    cacheDecision: {
      neededRefresh: false,
      reason: null,
      missingSites: 0,
      expiredSites: 0,
    },
    fileName: null,
    site: null,
    error: null,
  };
}

function cloneRuntimeSaveStatus(status) {
  const base = createDefaultRuntimeSaveStatus();
  const source = status && typeof status === "object" ? status : {};
  const sourceProgress =
    source.progress && typeof source.progress === "object" ? source.progress : {};
  const sourceStats = source.stats && typeof source.stats === "object" ? source.stats : {};
  const sourceCacheDecision =
    source.cacheDecision && typeof source.cacheDecision === "object"
      ? source.cacheDecision
      : {};
  const sourceError = source.error && typeof source.error === "object" ? source.error : null;
  return {
    ...base,
    ...source,
    progress: {
      ...base.progress,
      ...sourceProgress,
    },
    stats: {
      ...base.stats,
      ...sourceStats,
      errors: Array.isArray(sourceStats.errors) ? sourceStats.errors.slice() : [],
    },
    cacheDecision: {
      ...base.cacheDecision,
      ...sourceCacheDecision,
    },
    error: sourceError
      ? {
          message:
            typeof sourceError.message === "string" ? sourceError.message : String(sourceError),
          context:
            typeof sourceError.context === "string" ? sourceError.context : null,
        }
      : null,
  };
}

function getRuntimeSaveStatus() {
  if (typeof window === "undefined") return createDefaultRuntimeSaveStatus();
  if (!window.__SEARCHADVISOR_SAVE_STATUS__) {
    window.__SEARCHADVISOR_SAVE_STATUS__ = createDefaultRuntimeSaveStatus();
  }
  return cloneRuntimeSaveStatus(window.__SEARCHADVISOR_SAVE_STATUS__);
}

function setRuntimeSaveStatus(patch) {
  // 저장/직접저장 상태는 external automation과 UI overlay가 함께 읽는 공용 런타임 상태다.
  //
  // 왜 별도 seam이 필요한가:
  // - save 진행률은 panel body/badge/button 텍스트만으로 추적하면 외부 스크립트가 읽기 어렵다.
  // - public facade(window.__sadvApi)와 별도로 전역 mirror 상태를 두면
  //   Python/browser automation이 polling과 subscribe 둘 다 안정적으로 사용할 수 있다.
  // - 이후 live/saved parity를 더 끌어올릴 때도 "저장 상태를 어디에 쓰는지"를 한 곳에서 바꿀 수 있다.
  const previous = getRuntimeSaveStatus();
  const base =
    patch &&
    typeof patch === "object" &&
    Object.prototype.hasOwnProperty.call(patch, "__replace") &&
    patch.__replace
      ? createDefaultRuntimeSaveStatus()
      : previous;
  const nextPatch = patch && typeof patch === "object" ? patch : {};
  const next = cloneRuntimeSaveStatus({
    ...base,
    ...nextPatch,
    progress:
      nextPatch.progress && typeof nextPatch.progress === "object"
        ? { ...base.progress, ...nextPatch.progress }
        : base.progress,
    stats:
      nextPatch.stats && typeof nextPatch.stats === "object"
        ? { ...base.stats, ...nextPatch.stats }
        : base.stats,
    cacheDecision:
      nextPatch.cacheDecision && typeof nextPatch.cacheDecision === "object"
        ? { ...base.cacheDecision, ...nextPatch.cacheDecision }
        : base.cacheDecision,
    error:
      nextPatch.error && typeof nextPatch.error === "object"
        ? {
            message:
              typeof nextPatch.error.message === "string"
                ? nextPatch.error.message
                : String(nextPatch.error),
            context:
              typeof nextPatch.error.context === "string" ? nextPatch.error.context : null,
          }
        : nextPatch.error === null
          ? null
          : base.error,
    updatedAt:
      typeof nextPatch.updatedAt === "number" ? nextPatch.updatedAt : Date.now(),
  });
  if (typeof window !== "undefined") {
    window.__SEARCHADVISOR_SAVE_STATUS__ = next;
  }
  __sadvSaveStatusListeners.forEach(function (listener) {
    try {
      listener(cloneRuntimeSaveStatus(next));
    } catch (e) {
      console.error("[setRuntimeSaveStatus] Listener error:", e);
    }
  });
  if (typeof __sadvNotify === "function") __sadvNotify();
  return cloneRuntimeSaveStatus(next);
}

function resetRuntimeSaveStatus(extraPatch) {
  return setRuntimeSaveStatus({
    __replace: true,
    ...(extraPatch && typeof extraPatch === "object" ? extraPatch : {}),
  });
}

function subscribeRuntimeSaveStatus(listener) {
  if (typeof listener !== "function") {
    return function unsubscribeRuntimeSaveStatus() {};
  }
  __sadvSaveStatusListeners.add(listener);
  return function unsubscribeRuntimeSaveStatus() {
    __sadvSaveStatusListeners.delete(listener);
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
  const selectionState =
    typeof getSelectionStateValue === "function" ? getSelectionStateValue() : null;
  return {
    // selection fallback도 가능하면 canonical selection getter를 먼저 읽는다.
    // 이유:
    // - Phase 1 후반부의 목적은 "provider fallback조차 raw globals를 덜 알게" 만드는 것이다.
    // - Live/Saved/Merge 모두 이 fallback shell state를 마지막 안전망으로 통과할 수 있으므로,
    //   여기서 selection getter 우선 순서를 고정하는 것이 회귀 대비 효과가 크다.
    curMode:
      selectionState && typeof selectionState.curMode === "string"
        ? selectionState.curMode
        : (typeof curMode === "string" ? curMode : CONFIG.MODE.ALL),
    curSite:
      selectionState && typeof selectionState.curSite === "string"
        ? selectionState.curSite
        : (typeof curSite === "string" ? curSite : null),
    curTab:
      selectionState && typeof selectionState.curTab === "string"
        ? selectionState.curTab
        : (typeof curTab === "string" ? curTab : "overview"),
    allSitesPeriodDays:
      typeof getAllSitesPeriodDaysState === "function"
        ? getAllSitesPeriodDaysState()
        : normalizeAllSitesPeriodDays(90),
    allSites: Array.isArray(allSites) ? allSites.slice() : [],
    // rows seam:
    // fallback shell state도 가능한 한 canonical rows getter를 먼저 사용한다.
    // 이 지점은 live/saved/merge 모두가 거치는 공용 fallback이므로,
    // 직접 window.__sadvRows를 읽는 습관을 줄이는 가치가 크다.
    rows:
      typeof getCanonicalRowsState === "function"
        ? getCanonicalRowsState()
        : (Array.isArray(window.__sadvRows) ? window.__sadvRows.slice() : []),
    accountLabel: "",
    runtimeVersion: "runtime",
    cacheMeta: null,
  };
}

function getRuntimeRows() {
  const state = getRuntimeShellState();
  if (state && Array.isArray(state.rows)) return state.rows.slice();
  if (typeof getCanonicalRowsState === "function") return getCanonicalRowsState();
  return Array.isArray(window.__sadvRows) ? window.__sadvRows.slice() : [];
}

function setRuntimeRows(rows) {
  // Phase 1 write seam:
  // 전체현황 canonical rows 저장 위치를 UI 코드가 직접 알지 않게 한다.
  //
  // 주의:
  // - 이 함수는 "rows를 저장"만 담당한다.
  // - render/notify는 호출 측이 기존 흐름을 유지하게 두어 회귀를 줄인다.
  if (typeof setCanonicalRowsState === "function") {
    return setCanonicalRowsState(rows);
  }
  window.__sadvRows = Array.isArray(rows) ? rows.slice() : [];
  return Array.isArray(window.__sadvRows) ? window.__sadvRows.slice() : [];
}

function getRuntimeAllSites() {
  // stage 2 seam:
  // UI 계층은 allSites 전역을 직접 읽기보다 이 facade를 우선 사용한다.
  // 그래야 live/snapshot이 사이트 목록을 어떤 provider에서 읽는지
  // 한 곳에서 교체/감사할 수 있다.
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
  // mergedMeta는 shell/header/export가 함께 참조하는 공통 읽기값이다.
  // 앞으로는 direct getMergedMetaState() 호출을 줄이고 이 seam으로 수렴한다.
  const state = getRuntimeShellState();
  if (state && Object.prototype.hasOwnProperty.call(state, "mergedMeta")) return state.mergedMeta;
  if (typeof getMergedMetaState === "function") return getMergedMetaState();
  return null;
}

function getRuntimeCacheMeta() {
  const state = getRuntimeShellState();
  return state && state.cacheMeta ? state.cacheMeta : null;
}

function getRuntimeSelectionState() {
  // stage 2-2 seam:
  // export/offline/live가 현재 선택 상태(curMode/curSite/curTab)를 직접 전역에서
  // 주워 읽지 않도록, shell state를 통과한 최소 shape를 제공한다.
  //
  // 의도:
  // - UI selection을 단일 shape로 읽게 만들기
  // - 나중에 snapshot/live가 selection 복원 방식을 바꿔도
  //   호출자는 이 seam만 유지하면 되게 하기
  const state = getRuntimeShellState();
  const fallbackSelectionState =
    typeof getSelectionStateValue === "function" ? getSelectionStateValue() : null;
  return {
    curMode:
      state && typeof state.curMode === "string"
        ? state.curMode
        : (
            fallbackSelectionState && typeof fallbackSelectionState.curMode === "string"
              ? fallbackSelectionState.curMode
              : (typeof curMode === "string" ? curMode : CONFIG.MODE.ALL)
          ),
    curSite:
      state && typeof state.curSite === "string"
        ? state.curSite
        : (
            fallbackSelectionState && typeof fallbackSelectionState.curSite === "string"
              ? fallbackSelectionState.curSite
              : (typeof curSite === "string" ? curSite : null)
          ),
    curTab:
      state && typeof state.curTab === "string"
        ? state.curTab
        : (
            fallbackSelectionState && typeof fallbackSelectionState.curTab === "string"
              ? fallbackSelectionState.curTab
              : (typeof curTab === "string" ? curTab : "overview")
          ),
  };
}

function setRuntimeSelectionState(patch) {
  // Phase 1 public seam:
  // UI는 selection을 직접 전역에 쓰기보다 이 facade를 통해 갱신하도록 유도한다.
  //
  // 의도:
  // - live/snapshot이 selection을 저장/복원하는 방식이 달라도
  //   호출자는 이 entry 하나만 보게 하기
  // - 지금 단계에서는 "읽기/쓰기 경계"만 고정하고,
  //   렌더/notify 흐름은 기존 UI 로직을 유지해 회귀 위험을 낮춘다.
  if (isSnapshotRuntime()) {
    if (
      typeof window !== "undefined" &&
      window.__SEARCHADVISOR_SNAPSHOT_API__ &&
      typeof window.__SEARCHADVISOR_SNAPSHOT_API__.setSelectionState === "function"
    ) {
      return window.__SEARCHADVISOR_SNAPSHOT_API__.setSelectionState(patch);
    }
  }
  if (typeof setSelectionStateValue === "function") {
    return setSelectionStateValue(patch);
  }
  if (patch && typeof patch === "object") {
    if (patch.curMode === CONFIG.MODE.ALL || patch.curMode === CONFIG.MODE.SITE) curMode = patch.curMode;
    if (Object.prototype.hasOwnProperty.call(patch, "curSite")) {
      curSite = typeof patch.curSite === "string" ? patch.curSite : null;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "curTab")) {
      curTab = typeof patch.curTab === "string" ? patch.curTab : "overview";
    }
  }
  return typeof getSelectionStateValue === "function"
    ? getSelectionStateValue()
    : {
        curMode,
        curSite,
        curTab,
      };
}

function setRuntimeMode(mode) {
  // action seam 1차:
  // mode/site/tab을 한 번에 바꾸는 범용 patch seam은 유지하되,
  // UI 코드가 의도를 더 명확히 표현하도록 얇은 action wrapper를 제공한다.
  return setRuntimeSelectionState({ curMode: mode });
}

function setRuntimeSite(site) {
  return setRuntimeSelectionState({ curSite: site });
}

function setRuntimeTab(tab) {
  return setRuntimeSelectionState({ curTab: tab });
}

function getRuntimeAllSitesPeriodDays() {
  // 전체현황 전용 period state seam.
  // selection(curMode/curSite/curTab)과 섞지 않는 이유:
  // - 이 값은 site mode와 무관하다.
  // - saved HTML에서도 read-only view filter로 유지되어야 한다.
  const state = getRuntimeShellState();
  if (state && typeof state.allSitesPeriodDays !== "undefined") {
    return normalizeAllSitesPeriodDays(state.allSitesPeriodDays);
  }
  if (typeof getAllSitesPeriodDaysState === "function") {
    return getAllSitesPeriodDaysState();
  }
  return normalizeAllSitesPeriodDays(90);
}

function setRuntimeAllSitesPeriodDays(days) {
  const normalizedDays = normalizeAllSitesPeriodDays(days);
  if (isSnapshotRuntime()) {
    if (
      typeof window !== "undefined" &&
      window.__SEARCHADVISOR_SNAPSHOT_API__ &&
      typeof window.__SEARCHADVISOR_SNAPSHOT_API__.setAllSitesPeriodDays === "function"
    ) {
      return window.__SEARCHADVISOR_SNAPSHOT_API__.setAllSitesPeriodDays(normalizedDays);
    }
    return normalizedDays;
  }
  if (typeof setAllSitesPeriodDaysState === "function") {
    setAllSitesPeriodDaysState(normalizedDays);
  }
  if (typeof __sadvNotify === "function") __sadvNotify();
  return normalizedDays;
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
