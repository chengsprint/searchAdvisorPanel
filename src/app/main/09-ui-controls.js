/**
 * ========================================================================
 * SearchAdvisor UI Controls - 내부용 로컬 전용 모듈
 * ========================================================================
 *
 * ⚠️ INTERNAL LOCAL-ONLY MODULE
 *
 * 이 모듈은 각 사용자의 로컬 브라우저 환경에서만 사용됩니다.
 * 외부 배포 or npm 패키지로 제공하지 않습니다.
 *
 * @internal
 * @private
 */

/**
 * UI supply chain note
 *
 * 이 파일은 live/snapshot이 최대한 함께 써야 하는 공통 UI 제어 경로다.
 * 이 파일의 책임은 mode / tab / combo / header meta 같은 UI 반응 규칙이지,
 * fetch/refresh/payload 직렬화 같은 data provider 책임이 아니다.
 */

/**
 * Read the current selection state through the public seam first.
 *
 * Why this helper exists:
 * - Phase 1 후반부에서는 UI control 코드가 `curMode/curSite/curTab` fallback 객체를
 *   군데군데 직접 만들지 않도록 줄여야 한다.
 * - live/saved가 같은 selection contract를 공유하게 만들려면,
 *   읽기 경로를 한 helper로 모으는 것이 가장 안전한 중간 단계다.
 * - 이 helper는 아직 "행동(action)"을 바꾸지 않고 read 경로만 정리하므로
 *   saved HTML 회귀 위험이 매우 낮다.
 */
function getUiControlsSelectionState() {
  return typeof getRuntimeSelectionState === "function"
    ? getRuntimeSelectionState()
    : { curMode, curSite, curTab };
}

/**
 * Semantic action wrapper for mode changes inside shared UI controls.
 *
 * Why not write `curMode` directly?
 * - Live and saved already have dedicated action seams (`setRuntimeMode`)
  *   that know how to project the same semantic action into different runtimes.
 * - Phase 1 후반부터는 UI가 generic patch seam(`setRuntimeSelectionState`)까지
 *   직접 아는 범위를 줄이고, 가능한 한 semantic wrapper만 호출하게 만든다.
 * - 이 helper keeps the UI code semantic ("set mode") while still preserving
 *   a last-resort legacy fallback when the seam is unavailable during early boot/tests.
 */
function applyUiControlsMode(mode) {
  if (typeof setRuntimeMode === "function") return setRuntimeMode(mode);
  curMode = mode;
  return getUiControlsSelectionState();
}

/**
 * Semantic action wrapper for site selection inside shared UI controls.
 *
 * This stays intentionally narrow:
 * - it only updates selection state
 * - it does not call `loadSiteView` or `switchMode`
 *
 * That separation matters because saved HTML still relies on the current
 * caller-owned rendering order, and changing that order here would be a
 * riskier Phase 2/3 style refactor.
 *
 * Guardrail:
 * - Like applyUiControlsMode/applyUiControlsTab, this helper now stops at the
 *   semantic action seam (`setRuntimeSite`) and falls back directly to the
 *   legacy local state only as a last resort.
 * - UI controls no longer need to know about the generic patch seam here.
 */
function applyUiControlsSite(site) {
  if (typeof setRuntimeSite === "function") return setRuntimeSite(site);
  curSite = site;
  return getUiControlsSelectionState();
}

/**
 * Semantic action wrapper for tab changes inside shared UI controls.
 *
 * Keeping tab selection behind one helper makes live/saved parity easier to
 * audit and reduces duplicated fallback branches in click/API handlers.
 *
 * Phase 1 note:
 * - The UI layer now prefers semantic actions only.
 * - If the runtime tab seam does not exist yet, we fall back directly to the
 *   local mutable state instead of routing back through a generic patch API.
 */
function applyUiControlsTab(tab) {
  if (typeof setRuntimeTab === "function") return setRuntimeTab(tab);
  curTab = tab;
  return getUiControlsSelectionState();
}

  /**
 * Assign colors to all sites from the color palette
 * Each site gets a consistent color based on its index
 * @returns {void}
 * @example
 * assignColors();
 * console.log(SITE_COLORS_MAP['https://example.com']); // "#10b981"
 */
  function assignColors(preferredOrder) {
    // stage 2-2 seam:
    // 컬러 매핑은 UI 표현 책임이지만, "어떤 사이트 집합을 기준으로 칠할지"는
    // provider facade를 통해 읽는 편이 안전하다.
    // 그래야 snapshot/live가 서로 다른 입력원을 써도 색상 할당 기준이 한 곳으로 모인다.
    //
    // 추가 규칙:
    // - 전체현황 카드처럼 화면상 순서가 중요한 뷰는 preferredOrder(rows order)를 넘겨
    //   인접 카드가 같은/유사 색으로 뭉치지 않게 한다.
    // - 즉 "사이트 원본 등록 순서"보다 "현재 사용자에게 보이는 순서"를 우선한다.
    const runtimeSites =
      typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
    const orderedSites =
      Array.isArray(preferredOrder) && preferredOrder.length
        ? preferredOrder.filter(function (site) {
            return runtimeSites.includes(site);
          })
        : runtimeSites.slice();
    const restSites = runtimeSites.filter(function (site) {
      return !orderedSites.includes(site);
    });
    const colorOrder = orderedSites.concat(restSites);

    // 지그재그 롤링 팔레트:
    // [0,1,2,3,4,5] -> [0,3,1,4,2,5]
    // 처럼 비슷한 톤이 몰리지 않게 한 번 섞는다.
    const splitIndex = Math.ceil(COLORS.length / 2);
    const rolledPalette = [];
    for (let i = 0; i < splitIndex; i += 1) {
      if (COLORS[i]) rolledPalette.push(COLORS[i]);
      if (COLORS[i + splitIndex]) rolledPalette.push(COLORS[i + splitIndex]);
    }

    let previousColor = null;
    colorOrder.forEach((s, i) => {
      let nextColor = rolledPalette[i % rolledPalette.length];
      if (nextColor === previousColor && rolledPalette.length > 1) {
        nextColor = rolledPalette[(i + 1) % rolledPalette.length];
      }
      SITE_COLORS_MAP[s] = nextColor;
      previousColor = nextColor;
    });
  }
  /**
 * Ensure curSite is set to a valid site from allSites
 * If curSite is null or invalid, sets it to the first site
 * @returns {string|null} The current site URL or null if no sites available
 * @example
 * const site = ensureCurrentSite();
 * console.log(site); // "https://example.com" or null
 */
  function ensureCurrentSite() {
    // stage 2-2 seam:
    // 현재 사이트 보정도 allSites 전역 배열을 직접 신뢰하지 않고
    // facade가 말해주는 현재 runtime site list를 기준으로 맞춘다.
    // 이 함수는 site mode 진입/복원 경로에서 자주 호출되므로 회귀 방지 가치가 크다.
    const runtimeSites =
      typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
    const selectionState = getUiControlsSelectionState();
    const currentSite = selectionState.curSite;
    if (!runtimeSites.length) {
      applyUiControlsSite(null);
      return null;
    }
    if (!currentSite || !runtimeSites.includes(currentSite)) {
      const nextSite = runtimeSites[0];
      applyUiControlsSite(nextSite);
      return nextSite;
    }
    return currentSite;
  }
  /**
 * Update the all sites label text in the header
 * Shows site count and merge information if applicable
 * @returns {void}
 * @example
 * setAllSitesLabel(); // Updates header label
 */
  function setAllSitesLabel() {
    if (!labelEl) return;
    const mergedMeta =
      typeof getRuntimeMergedMeta === "function" ? getRuntimeMergedMeta() : getMergedMetaState();
    const runtimeSites =
      typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
    const summary = isMergedReport() && mergedMeta && mergedMeta.sourceCount
      ? `${runtimeSites.length}개 사이트 등록됨 · ${mergedMeta.sourceCount}개 스냅샷 병합`
      : `${runtimeSites.length}개 사이트 등록됨`;
    const labelTextEl = labelEl.querySelector("span");
    labelEl.classList.remove("sadv-meta-hidden");
    if (labelTextEl) labelTextEl.textContent = summary;
    else labelEl.textContent = summary;
    labelEl.title = summary;
    syncXlsxButtonVisibility();
    syncSnapshotActionButtons(
      typeof getRuntimeSaveStatus === "function" ? getRuntimeSaveStatus() : null
    );
  }
  function getHeaderActionRuntimeCapabilitiesSnapshot() {
    return typeof getRuntimeCapabilities === "function"
      ? getRuntimeCapabilities()
      : typeof runtimeCapabilities !== "undefined"
        ? runtimeCapabilities
        : typeof resolveRuntimeCapabilities === "function"
          ? resolveRuntimeCapabilities()
          : {
              canRefresh: false,
              canSave: false,
              canClose: false,
              canXlsxSave: false,
              isReadOnly: true,
            };
  }
  function canCurrentRuntimeManualXlsxExport(runtimeCapabilitiesSnapshot) {
    if (typeof canManualXlsxExportInCurrentRuntime === "function") {
      return !!canManualXlsxExportInCurrentRuntime();
    }
    return !!(
      runtimeCapabilitiesSnapshot &&
      runtimeCapabilitiesSnapshot.canSave &&
      runtimeCapabilitiesSnapshot.canXlsxSave &&
      !runtimeCapabilitiesSnapshot.isReadOnly
    );
  }
  function syncXlsxButtonVisibility() {
    const xlsxBtnEl = document.getElementById("sadv-xlsx-btn");
    if (!xlsxBtnEl) return;
    // saved snapshot HTML은 helper body만 직렬화되어 inline bootstrap에서 다시 실행된다.
    // 따라서 live initialize()의 closure(runtimeCapabilities)에만 의존하면
    // reopen 시 ReferenceError/undefined 접근으로 회귀가 날 수 있다.
    // 공통 helper를 그대로 재사용하되, closure가 없을 때도 self-contained 하게 capability snapshot을 읽는다.
    const runtimeCapabilitiesSnapshot = getHeaderActionRuntimeCapabilitiesSnapshot();
    const canManualXlsxSave = canCurrentRuntimeManualXlsxExport(runtimeCapabilitiesSnapshot);
    if (!canManualXlsxSave) {
      xlsxBtnEl.style.display = "none";
      xlsxBtnEl.setAttribute("aria-hidden", "true");
      xlsxBtnEl.disabled = true;
      return;
    }
    xlsxBtnEl.style.display = "";
    xlsxBtnEl.removeAttribute("aria-hidden");
    xlsxBtnEl.disabled = false;
  }
  function formatCacheMetaTime(dateLike) {
    const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  function formatRemainingMsLabel(ms) {
    if (!(typeof ms === "number") || !Number.isFinite(ms)) return "-";
    if (ms <= 0) return "곧 갱신";
    const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return `${days}일 ${hours}시간`;
    if (hours > 0) return `${hours}시간 ${minutes}분`;
    return `${minutes}분`;
  }
  function syncLiveHeaderMeta(snapshot) {
    const metaEl = document.getElementById("sadv-cache-meta");
    if (!metaEl) return;
    const state =
      snapshot && snapshot.cacheMeta
        ? snapshot
        : (typeof getRuntimeShellState === "function" ? getRuntimeShellState() : __sadvSnapshot());
    const cacheMeta =
      state && state.cacheMeta
        ? state.cacheMeta
        : (typeof getRuntimeCacheMeta === "function" ? getRuntimeCacheMeta() : null);
    if (!cacheMeta || !cacheMeta.updatedAt) {
      metaEl.innerHTML = "";
      return;
    }
    const ttlHours =
      typeof cacheMeta.ttlMs === "number" && cacheMeta.ttlMs > 0
        ? Math.round(cacheMeta.ttlMs / 3600000)
        : null;
    const remainingLabel =
      typeof cacheMeta.remainingMs === "number"
        ? formatRemainingMsLabel(cacheMeta.remainingMs)
        : null;
    const isNearExpiry =
      typeof cacheMeta.remainingMs === "number" &&
      Number.isFinite(cacheMeta.remainingMs) &&
      cacheMeta.remainingMs > 0 &&
      cacheMeta.remainingMs <= 60 * 60 * 1000;
    const isExpired =
      typeof cacheMeta.remainingMs === "number" &&
      Number.isFinite(cacheMeta.remainingMs) &&
      cacheMeta.remainingMs <= 0;
    const borderCol = isExpired
      ? T.dangerSoftBg
      : isNearExpiry
        ? T.warningSoftBorder
        : "rgba(255,212,0,0.12)";
    const bgCol = isExpired
      ? T.dangerSoftBg
      : isNearExpiry
        ? T.warningSoftBg
        : "rgba(255,255,255,0.02)";
    const textCol = isExpired
      ? C.red
      : isNearExpiry
        ? C.amber
        : "var(--sadv-text-tertiary,#b9a55a)";
    const titleParts = [
      `캐시저장 ${formatCacheMetaTime(cacheMeta.updatedAt)}`,
      remainingLabel ? `자동갱신까지 ${remainingLabel}` : null,
      ttlHours ? `${ttlHours}시간 TTL` : null,
    ].filter(Boolean);
    const compactParts = [
      `캐시 ${formatCacheMetaTime(cacheMeta.updatedAt)}`,
      ttlHours ? `${ttlHours}h` : null,
      remainingLabel,
    ].filter(Boolean);
    const chipStyle =
      "display:inline-flex;align-items:center;max-width:100%;min-height:22px;padding:2px 10px;border-radius:" +
      T.radiusPill +
      ";border:1px solid " +
      borderCol +
      ";background:" +
      bgCol +
      ";color:" +
      textCol +
      ";font-size:10px;font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
    metaEl.innerHTML = sanitizeHTML(
      `<span style="${chipStyle}" title="${escHtml(titleParts.join(" · "))}">${escHtml(compactParts.join(" · "))}</span>`
    );
  }
  function getSnapshotActionBaseLabel(actionKind) {
    if (actionKind === "xlsx") return "엑셀 저장";
    if (actionKind === "refresh") return "새로고침";
    if (actionKind === "close") return "닫기";
    return "HTML 저장";
  }
  function getSnapshotActionStatusKind(status) {
    return status && status.outputFormat === "xlsx" ? "xlsx" : "save";
  }
  function formatSnapshotActionLabel(status, actionKind) {
    return getSnapshotActionBaseLabel(actionKind);
  }
  function setHeaderActionButtonLabel(buttonEl, label) {
    if (!buttonEl) return;
    const nextLabel = typeof label === "string" && label.trim() ? label.trim() : "";
    if (!nextLabel) return;
    const labelEl = buttonEl.querySelector(".sadv-btn-label");
    if (labelEl) {
      labelEl.textContent = nextLabel;
    } else {
      buttonEl.textContent = nextLabel;
    }
    buttonEl.dataset.currentLabel = nextLabel;
  }
  function formatHeaderActionStatusChip(status) {
    if (!status || typeof status !== "object" || status.uiHidden) return null;
    const actionKind = getSnapshotActionStatusKind(status);
    const baseLabel = getSnapshotActionBaseLabel(actionKind);
    const state = typeof status.state === "string" ? status.state : "idle";
    const progress = status.progress && typeof status.progress === "object" ? status.progress : {};
    const done =
      typeof progress.done === "number" && Number.isFinite(progress.done) ? progress.done : 0;
    const total =
      typeof progress.total === "number" && Number.isFinite(progress.total) ? progress.total : 0;
    const stageLabel =
      typeof status.stageLabel === "string" && status.stageLabel.trim()
        ? status.stageLabel.trim()
        : null;
    if (status.active) {
      if (total > 0 && (state === "collecting" || done > 0)) {
        return {
          label: `${baseLabel} ${done}/${total}`,
          tone: "progress",
        };
      }
      return {
        label: stageLabel || `${baseLabel} 준비 중`,
        tone: "progress",
      };
    }
    if (state === "completed") {
      return {
        label: `${baseLabel} 완료`,
        tone: "success",
      };
    }
    if (state === "completed-with-issues") {
      return {
        label: stageLabel || `${baseLabel} 일부 확인 필요`,
        tone: "warning",
      };
    }
    if (state === "blocked") {
      return {
        label: stageLabel || `${baseLabel} 차단`,
        tone: "warning",
      };
    }
    if (state === "failed") {
      return {
        label: stageLabel || `${baseLabel} 실패`,
        tone: "warning",
      };
    }
    return null;
  }
  function syncHeaderActionStatusChip(status) {
    const chipEl = document.getElementById("sadv-action-status-chip");
    if (!chipEl) return;
    const chipMeta = formatHeaderActionStatusChip(status);
    if (!chipMeta) {
      chipEl.hidden = true;
      chipEl.setAttribute("aria-hidden", "true");
      chipEl.textContent = "";
      chipEl.removeAttribute("data-tone");
      chipEl.removeAttribute("title");
      return;
    }
    chipEl.hidden = false;
    chipEl.setAttribute("aria-hidden", "false");
    chipEl.textContent = chipMeta.label;
    chipEl.dataset.tone = chipMeta.tone || "progress";
    chipEl.title = chipMeta.label;
  }
  function applyHeaderActionButtonPresentation(buttonEl, presentation) {
    if (!buttonEl) return;
    const isVisible = !!(presentation && presentation.visible);
    buttonEl.style.display = isVisible ? "" : "none";
    if (!isVisible) {
      buttonEl.setAttribute("aria-hidden", "true");
      buttonEl.classList.remove("sadv-action-btn-primary", "sadv-action-btn-secondary");
      return;
    }
    buttonEl.removeAttribute("aria-hidden");
    const accessibleLabel =
      buttonEl.dataset.baseLabel ||
      buttonEl.dataset.currentLabel ||
      buttonEl.getAttribute("aria-label") ||
      "";
    if (accessibleLabel) {
      buttonEl.setAttribute("aria-label", accessibleLabel);
      if (!buttonEl.dataset.busy || buttonEl.dataset.busy !== "true") {
        buttonEl.title = accessibleLabel;
      }
    }
  }
  function getHeaderSaveHubElements() {
    return {
      wrap: document.getElementById("sadv-save-hub"),
      button: document.getElementById("sadv-save-hub-btn"),
      menu: document.getElementById("sadv-save-hub-menu"),
      save: document.getElementById("sadv-save-btn"),
      xlsx: document.getElementById("sadv-xlsx-btn"),
    };
  }
  function closeHeaderSaveHubMenu() {
    const refs = getHeaderSaveHubElements();
    if (!refs.menu || !refs.button || !refs.wrap) return;
    refs.wrap.dataset.open = "false";
    refs.menu.hidden = true;
    refs.button.setAttribute("aria-expanded", "false");
  }
  function setHeaderSaveHubButtonMeta(buttonEl, label, title, directAction) {
    if (!buttonEl) return;
    const nextLabel = typeof label === "string" && label.trim() ? label.trim() : "내보내기";
    setHeaderActionButtonLabel(buttonEl, nextLabel);
    buttonEl.dataset.baseLabel = nextLabel;
    buttonEl.dataset.directAction = directAction || "";
    buttonEl.setAttribute("aria-label", nextLabel);
    buttonEl.title = title || nextLabel;
    const caretEl = buttonEl.querySelector(".sadv-save-hub-caret");
    const isDirect = !!directAction;
    if (caretEl) caretEl.style.display = isDirect ? "none" : "";
    buttonEl.classList.toggle("sadv-save-hub-direct", isDirect);
    buttonEl.setAttribute("aria-haspopup", isDirect ? "false" : "menu");
    if (isDirect) buttonEl.setAttribute("aria-expanded", "false");
  }
  function syncHeaderSaveHub(displayMeta) {
    const refs = getHeaderSaveHubElements();
    if (!refs.wrap || !refs.button) return;
    const hubMeta = displayMeta && displayMeta.hub ? displayMeta.hub : null;
    if (!hubMeta || !hubMeta.visible) {
      refs.wrap.style.display = "none";
      refs.wrap.setAttribute("aria-hidden", "true");
      closeHeaderSaveHubMenu();
      return;
    }
    refs.wrap.style.display = "";
    refs.wrap.removeAttribute("aria-hidden");
    setHeaderSaveHubButtonMeta(
      refs.button,
      hubMeta.label,
      hubMeta.title,
      hubMeta.directAction
    );
    if (refs.save) {
      const showSaveItem = !!(hubMeta.menuVisible && hubMeta.items && hubMeta.items.save);
      refs.save.hidden = !showSaveItem;
      refs.save.style.display = showSaveItem ? "" : "none";
      refs.save.setAttribute("aria-hidden", showSaveItem ? "false" : "true");
    }
    if (refs.xlsx) {
      const showXlsxItem = !!(hubMeta.menuVisible && hubMeta.items && hubMeta.items.xlsx);
      refs.xlsx.hidden = !showXlsxItem;
      refs.xlsx.style.display = showXlsxItem ? "" : "none";
      refs.xlsx.setAttribute("aria-hidden", showXlsxItem ? "false" : "true");
    }
    if (refs.menu) {
      if (!hubMeta.menuVisible) {
        closeHeaderSaveHubMenu();
      } else if (refs.wrap.dataset.open !== "true") {
        refs.menu.hidden = true;
        refs.button.setAttribute("aria-expanded", "false");
      }
    }
  }
  function getHeaderActionDisplayMeta(status) {
    const runtimeCapabilitiesSnapshot = getHeaderActionRuntimeCapabilitiesSnapshot();
    const xlsxVisible = canCurrentRuntimeManualXlsxExport(runtimeCapabilitiesSnapshot);
    const saveVisible = !!runtimeCapabilitiesSnapshot.canSave;
    const buttons = {
      refresh: { visible: !!runtimeCapabilitiesSnapshot.canRefresh },
      save: { visible: saveVisible },
      xlsx: { visible: !!xlsxVisible },
      close: { visible: !!runtimeCapabilitiesSnapshot.canClose },
    };
    const hubVisible = saveVisible || xlsxVisible;
    const hubDirectAction =
      hubVisible && !(saveVisible && xlsxVisible)
        ? (saveVisible ? "save" : "xlsx")
        : "";
    const hubLabel = saveVisible && xlsxVisible
      ? "내보내기"
      : saveVisible
        ? "HTML 저장"
        : xlsxVisible
          ? "엑셀 저장"
          : "";
    const hubTitle = saveVisible && xlsxVisible
      ? "내보내기"
      : hubLabel;
    return {
      buttons: buttons,
      hub: {
        visible: hubVisible,
        label: hubLabel,
        title: hubTitle,
        directAction: hubDirectAction,
        menuVisible: !!(saveVisible && xlsxVisible),
        items: {
          save: saveVisible,
          xlsx: !!xlsxVisible,
        },
      },
      chip: formatHeaderActionStatusChip(status),
    };
  }
  function syncSnapshotActionButtonLabel(buttonEl, actionKind, status) {
    if (!buttonEl) return;
    const nextLabel = formatSnapshotActionLabel(status, actionKind);
    setHeaderActionButtonLabel(buttonEl, nextLabel);
  }
  function syncSnapshotActionButtons(status) {
    const displayMeta = getHeaderActionDisplayMeta(status);
    syncSnapshotActionButtonLabel(document.getElementById("sadv-save-btn"), "save", status);
    syncSnapshotActionButtonLabel(document.getElementById("sadv-xlsx-btn"), "xlsx", status);
    applyHeaderActionButtonPresentation(
      document.getElementById("sadv-refresh-btn"),
      displayMeta.buttons.refresh
    );
    applyHeaderActionButtonPresentation(
      document.getElementById("sadv-x"),
      displayMeta.buttons.close
    );
    syncHeaderSaveHub(displayMeta);
    syncHeaderActionStatusChip(status);
  }
  function resolveRuntimeCapabilities() {
    // stage 2 boundary:
    // 버튼/행동 제어는 더 이상 "현재 런타임이 live일 것이다"를 가정하지 않는다.
    // UI는 provider 내부 구현 대신 capability 계약만 읽고,
    // 실제 가능 여부는 provider facade가 책임진다.
    return typeof getRuntimeCapabilities === "function"
      ? getRuntimeCapabilities()
      : {
          mode: "live",
          canRefresh: true,
          canSave: true,
          canClose: true,
          isReadOnly: false,
        };
  }
  /**
 * Build the site selector combo box dropdown
 * Creates clickable items for each site with search functionality
 * @param {Array|null} rows - Optional array of site summary rows for ordering
 * @returns {void}
 * @example
 * buildCombo(summaryRows); // Builds combo with sites ordered by clicks
 * @see {setComboSite}
 */
  function buildCombo(rows) {
    // Combo item 마크업/검색/선택 규칙은 live/snapshot 공통 행동으로 유지한다.
    // 저장본에서 portal/top-layer 예외가 남더라도 기본 interaction 자체는
    // 이 공통 경로를 우선 기준으로 삼는다.
    const drop = document.getElementById("sadv-combo-drop");
    if (!drop) {
      console.error('[buildCombo] sadv-combo-drop not found!');
      return;
    }
    const runtimeSites =
      typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
    const rowsMap = {};
    if (rows && rows.length)
      rows.forEach((r) => {
        if (runtimeSites.includes(r.site)) rowsMap[r.site] = r;
      });
    const rowSites =
      rows && rows.length
        ? rows.map((r) => r.site).filter((site) => runtimeSites.includes(site))
        : [];
    const restSites = runtimeSites.filter((s) => !rowsMap[s]);
    const orderedSites = [...rowSites, ...restSites];

    // Create search container
    const searchDiv = document.createElement("div");
    const isMobile = window.innerWidth <= 768;
    searchDiv.style.cssText = isMobile
      ? "padding:12px 12px 10px;position:sticky;top:0;z-index:1;background:var(--sadv-layer-01,#262626);border-bottom:1px solid var(--sadv-border-subtle,#393939)"
      : "padding:12px 12px 10px;position:sticky;top:0;z-index:1;background:var(--sadv-layer-01,#262626);border-bottom:1px solid var(--sadv-border-subtle,#393939)";

    const input = document.createElement("input");
    input.id = "sadv-combo-search";
    input.placeholder = "사이트 검색...";
    input.style.cssText = isMobile
      ? "width:100%;padding:0 12px;font-size:14px;min-height:44px;border-radius:0;border:1px solid var(--sadv-border,#525252);background:var(--sadv-bg,#161616);color:var(--sadv-text,#f4f4f4);box-sizing:border-box"
      : "width:100%;padding:0 12px;font-size:13px;min-height:40px;border-radius:0;border:1px solid var(--sadv-border,#525252);background:var(--sadv-bg,#161616);color:var(--sadv-text,#f4f4f4);box-sizing:border-box";

    searchDiv.appendChild(input);

    // Create count display
    const countDiv = document.createElement("div");
    countDiv.style.cssText = isMobile
      ? "font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--sadv-text-tertiary,#8d8d8d);padding:10px 14px 8px;background:var(--sadv-layer-01,#262626)"
      : "font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--sadv-text-tertiary,#8d8d8d);padding:10px 14px 8px;background:var(--sadv-layer-01,#262626)";
    countDiv.textContent = "전체 " + orderedSites.length + " 개 · 클릭많은순";

    drop.replaceChildren(searchDiv, countDiv);
    orderedSites.forEach(function (s) {
      const selectionState = getUiControlsSelectionState();
      const activeSite = selectionState.curSite;
      const exportPayload =
        typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__
          ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__
          : null;
      const col = SITE_COLORS_MAP[s] || C.muted,
        fullLabel = getSiteLabel(s),
        shortName = getSiteShortName(s),
        siteUrlLabel = normalizeSiteUrl(s),
        row = rowsMap[s],
        clickStr = row ? fmt(row.totalC) + "\uD074\uB9AD" : "—",
        clickCol = row ? C.green : C.muted;
      const ownershipDisplay =
        typeof resolveSiteOwnershipDisplay === "function"
          ? resolveSiteOwnershipDisplay(s, row || null, exportPayload, row ? row.sourceAccount : null)
          : { fullLabel: "", compactLabel: "" };
      const ownerTagHtml =
        typeof renderOwnerTagHTML === "function"
          ? renderOwnerTagHTML(ownershipDisplay, "combo")
          : "";
      const item = document.createElement("div");
      item.className = "sadv-combo-item sadv-copt" + (s === activeSite ? " active" : "");
      item.dataset.site = s;
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", s === activeSite ? "true" : "false");
      item.dataset.ownerLabel =
        ownershipDisplay && typeof ownershipDisplay.fullLabel === "string"
          ? ownershipDisplay.fullLabel
          : "";
      item.style.cursor = "pointer";
      item.innerHTML = `<div class="sadv-combo-item-dot" style="background:${col}"></div><div class="sadv-combo-item-info"><div class="sadv-combo-item-name">${escHtml(shortName || fullLabel || s)}</div><div class="sadv-combo-item-url">${escHtml(siteUrlLabel || fullLabel || s)}</div></div><div class="sadv-combo-item-side">${ownerTagHtml}<div class="sadv-combo-item-click" style="color:${clickCol}">${escHtml(clickStr)}</div></div>`;
      item.addEventListener("click", function () {
        if (typeof openAllSitesSelectedSite === "function") {
          openAllSitesSelectedSite(s);
        } else {
          setComboSite(s);
          const selectionState = getUiControlsSelectionState();
          if (selectionState.curMode !== CONFIG.MODE.SITE && typeof switchMode === "function") {
            switchMode(CONFIG.MODE.SITE);
          }
        }
        const wrap = document.getElementById("sadv-combo-wrap");
        if (wrap) {
          wrap.classList.remove("open");
          wrap.setAttribute("aria-expanded", "false");
        }
      });
      // Keyboard navigation for combo items
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (typeof openAllSitesSelectedSite === "function") {
            openAllSitesSelectedSite(s);
          } else {
            setComboSite(s);
            const selectionState = getUiControlsSelectionState();
            if (selectionState.curMode !== CONFIG.MODE.SITE && typeof switchMode === "function") {
              switchMode(CONFIG.MODE.SITE);
            }
          }
          const wrap = document.getElementById("sadv-combo-wrap");
          if (wrap) {
            wrap.classList.remove("open");
            wrap.setAttribute("aria-expanded", "false");
          }
          // Return focus to combo button
          const comboBtn = document.getElementById("sadv-combo-btn");
          if (comboBtn) comboBtn.focus();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          const wrap = document.getElementById("sadv-combo-wrap");
          if (wrap) {
            wrap.classList.remove("open");
            wrap.setAttribute("aria-expanded", "false");
          }
          const comboBtn = document.getElementById("sadv-combo-btn");
          if (comboBtn) comboBtn.focus();
        }
        // Arrow key navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const items = Array.from(drop.querySelectorAll('.sadv-combo-item[data-site]'));
          const currentIndex = items.indexOf(item);
          const nextIndex = e.key === 'ArrowDown'
            ? Math.min(currentIndex + 1, items.length - 1)
            : Math.max(currentIndex - 1, 0);
          if (items[nextIndex]) items[nextIndex].focus();
        }
      });
      drop.appendChild(item);
    });
  }
  /**
 * Set the currently selected site in the combo box
 * Updates the combo button, highlights the active item, and loads site view if needed
 * @param {string} site - Site URL to select
 * @returns {void}
 * @example
 * setComboSite('https://example.com');
 * @see {buildCombo}
 */
  function setComboSite(site) {
    // combo 선택은 live/snapshot 공통 상호작용이다.
    // 따라서 site 유효성 판정도 facade를 경유해 provider 경계를 존중한다.
    const runtimeSites =
      typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
    if (!site || !runtimeSites.includes(site)) return;
    const selectionState = getUiControlsSelectionState();
    const sameSite = selectionState.curSite === site;
    applyUiControlsSite(site);
    const col = SITE_COLORS_MAP[site] || C.muted,
      shortName = getSiteLabel(site);
    const comboDot = document.getElementById("sadv-combo-dot");
    const comboLabel = document.getElementById("sadv-combo-label");
    if (comboDot) comboDot.style.background = col;
    if (comboLabel) comboLabel.textContent = shortName;
    document.querySelectorAll(".sadv-combo-item[data-site]").forEach((el) => {
      const isActive = el.dataset.site === site;
      el.classList.toggle("active", isActive);
      el.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    setCachedUiState();
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    const nextSelectionState = getUiControlsSelectionState();
    if (nextSelectionState.curMode === CONFIG.MODE.SITE && !sameSite) loadSiteView(site);
    __sadvNotify();
  }
  const comboWrapMain = document.getElementById("sadv-combo-wrap");
  if (comboWrapMain) {
    comboWrapMain.setAttribute("role", "combobox");
    comboWrapMain.setAttribute("aria-expanded", "false");
  }
  const comboBtn = document.getElementById("sadv-combo-btn");
  if (comboBtn) {
    comboBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const wrap = document.getElementById("sadv-combo-wrap");
      if (!wrap) return;
      wrap.classList.toggle("open");
      wrap.setAttribute("aria-expanded", wrap.classList.contains("open") ? "true" : "false");
      if (wrap.classList.contains("open")) {
        setTimeout(function () {
          const inp = document.getElementById("sadv-combo-search");
          if (inp) {
            inp.style.display = "block";
            inp.value = "";
            inp.focus();
            inp.oninput = function () {
              const q = inp.value.toLowerCase();
              document
                .querySelectorAll(".sadv-combo-item[data-site]")
                .forEach(function (el) {
                  // Combo rows are styled as CSS grid in the shell theme.
                  // When search filtering shows them again, restore `grid` instead of `flex`
                  // to avoid subtle layout drift between normal and filtered states.
                  const siteMatch =
                    !q ||
                    (((el.dataset.site || "") + " " + getSiteLabel(el.dataset.site || "")).toLowerCase().includes(q));
                  const ownerMatch = ((el.dataset.ownerLabel || "") + "").toLowerCase().includes(q);
                  el.style.setProperty(
                    "display",
                    siteMatch || ownerMatch ? "grid" : "none",
                    "important"
                  );
                });
            };
          }
        }, 50);
      }
    });
    // Keyboard support for combo button
    comboBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        const wrap = document.getElementById("sadv-combo-wrap");
        if (wrap && wrap.classList.contains("open")) {
          wrap.classList.remove("open");
          wrap.setAttribute("aria-expanded", "false");
        }
      }
      if (e.key === 'ArrowDown' && this.getAttribute("aria-expanded") === "true") {
        e.preventDefault();
        const firstItem = document.querySelector(".sadv-combo-item[data-site]:not([style*='display: none'])");
        if (firstItem) firstItem.focus();
      }
    });
  } else {
    console.warn("[UI Controls] #sadv-combo-btn not found during initialization");
  }
  document.addEventListener("click", function (e) {
    const wrap = document.getElementById("sadv-combo-wrap");
    if (wrap && !wrap.contains(e.target)) {
      wrap.classList.remove("open");
      wrap.setAttribute("aria-expanded", "false");
    }
  });
  // ESC key to close combo dropdown
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const wrap = document.getElementById("sadv-combo-wrap");
      if (wrap && wrap.classList.contains("open")) {
        wrap.classList.remove("open");
        wrap.setAttribute("aria-expanded", "false");
        const activeComboBtn = document.getElementById("sadv-combo-btn");
        if (activeComboBtn) activeComboBtn.focus();
      }
    }
  });
  const TABS = [
    { id: "overview", label: "개요", icon: ICONS.dashboard },
    { id: "daily", label: "일별", icon: ICONS.calendarDays },
    { id: "urls", label: "URL", icon: ICONS.urlLink },
    { id: "queries", label: "검색어", icon: ICONS.searchTab },
    { id: "indexed", label: "색인", icon: ICONS.database },
    { id: "crawl", label: "크롤", icon: ICONS.activity },
    { id: "backlink", label: "백링크", icon: ICONS.backLinkTab },
    { id: "pattern", label: "패턴", icon: ICONS.barChart },
    { id: "insight", label: "인사이트", icon: ICONS.lightbulb },
  ];
  if (tabsEl) {
    tabsEl.setAttribute("role", "tablist");
    tabsEl.replaceChildren(...TABS.map((t) => {
      const selectionState = getUiControlsSelectionState();
      const activeTab = selectionState.curTab;
      const btn = document.createElement("button");
      btn.className = `sadv-t${t.id === activeTab ? " on" : ""}`;
      btn.dataset.t = t.id;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", t.id === activeTab ? "true" : "false");
      btn.setAttribute("aria-controls", "sadv-tabpanel");
      btn.style.cssText = "display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;flex:0 0 auto";
      btn.innerHTML = `${t.icon}${escHtml(t.label)}`;
      return btn;
    }));
    tabsEl.addEventListener("click", function (e) {
      const t = e.target.closest("[data-t]");
      const selectionState = getUiControlsSelectionState();
      if (!t || t.dataset.t === selectionState.curTab) return;
      applyUiControlsTab(t.dataset.t);
      tabsEl.querySelectorAll(".sadv-t").forEach((b) => {
        b.classList.remove("on");
        b.setAttribute("aria-selected", "false");
      });
      t.classList.add("on");
      t.setAttribute("aria-selected", "true");
      setCachedUiState();
      if (window.__sadvR) renderTab(window.__sadvR);
      __sadvNotify();
    });
    // Keyboard navigation for tabs
    tabsEl.addEventListener('keydown', function(e) {
      const tab = e.target.closest('.sadv-t');
      if (!tab) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
      }
      // Arrow key navigation
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const tabs = Array.from(tabsEl.querySelectorAll('.sadv-t'));
        const currentIndex = tabs.indexOf(tab);
        const nextIndex = e.key === 'ArrowRight'
          ? Math.min(currentIndex + 1, tabs.length - 1)
          : Math.max(currentIndex - 1, 0);
        if (tabs[nextIndex]) {
          tabs[nextIndex].focus();
          tabs[nextIndex].click();
        }
      }
    });
  } else {
    console.warn("[UI Controls] #sadv-tabs not found during initialization");
  }
  /**
 * Render the current tab content using the provided renderers
 * @param {Object} R - Renderers object with functions for each tab
 * @returns {void}
 * @example
 * renderTab(buildRenderers(expose, crawl, backlink, diagnosisMeta));
 * @see {buildRenderers}
 */
  function renderTab(R) {
    // Phase 1 seam:
    // tab renderer도 curTab 전역을 직접 참조하지 않고 selection seam을 통해 읽기 시작한다.
    // 여기서 먼저 read 경로만 옮기고, 실제 tab action flow(setTab/switchMode 호출 순서)는
    // 그대로 두어 saved HTML 회귀 위험을 낮춘다.
    const selectionState = getUiControlsSelectionState();
    const activeTab = selectionState.curTab;
    if (!bdEl || !R || typeof R[activeTab] !== "function") return;
    bdEl.setAttribute("role", "tabpanel");
    bdEl.id = "sadv-tabpanel";
    bdEl.replaceChildren(R[activeTab]());
    bdEl.scrollTop = 0;
  }
  if (modeBar) {
    modeBar.setAttribute("role", "tablist");
    modeBar.addEventListener("click", function (e) {
      const m = e.target.closest("[data-m]");
      if (!m) return;
      switchMode(m.dataset.m);
    });
    // Keyboard navigation for mode buttons
    modeBar.addEventListener('keydown', function(e) {
      const modeBtn = e.target.closest('.sadv-mode');
      if (!modeBtn) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        modeBtn.click();
      }
      // Arrow key navigation
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const modeButtons = Array.from(modeBar.querySelectorAll('.sadv-mode'));
        const currentIndex = modeButtons.indexOf(modeBtn);
        const nextIndex = e.key === 'ArrowRight'
          ? Math.min(currentIndex + 1, modeButtons.length - 1)
          : Math.max(currentIndex - 1, 0);
        if (modeButtons[nextIndex]) {
          modeButtons[nextIndex].focus();
          modeButtons[nextIndex].click();
        }
      }
    });
  } else {
    console.warn("[UI Controls] #sadv-mode-bar not found during initialization");
  }
  /**
 * Switch between 'all' and 'site' view modes
 * Updates UI visibility and loads appropriate view
 * @param {string} mode - Mode to switch to ('all' or 'site')
 * @returns {void}
 * @example
 * switchMode('all'); // Shows all sites overview
 * switchMode('site'); // Shows current site detail
 * @see {renderAllSites}
 * @see {loadSiteView}
 */
  function switchMode(mode) {
    const selectionState = getUiControlsSelectionState();
    if (mode === selectionState.curMode) return;
    if (!modeBar || !siteBar || !tabsEl) {
      applyUiControlsMode(mode);
      console.warn("[UI Controls] Missing mode UI containers; switchMode skipped");
      setCachedUiState();
      if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
      __sadvNotify();
      return;
    }
    applyUiControlsMode(mode);
    modeBar
      .querySelectorAll(".sadv-mode")
      .forEach((b) => {
        b.classList.remove("on");
        b.setAttribute("aria-selected", "false");
      });
    const targetBtn = modeBar.querySelector(`[data-m="${mode}"]`);
    if (targetBtn) {
      targetBtn.classList.add("on");
      targetBtn.setAttribute("aria-selected", "true");
    }
    if (mode === CONFIG.MODE.ALL) {
      siteBar.classList.remove("show");
      tabsEl.classList.remove("show");
      setAllSitesLabel();
      renderAllSites();
    } else {
      siteBar.classList.add("show");
      tabsEl.classList.add("show");
      ensureCurrentSite();
      const nextSelectionState = getUiControlsSelectionState();
      if (nextSelectionState.curSite) {
        setComboSite(nextSelectionState.curSite);
        loadSiteView(nextSelectionState.curSite);
      }
    }
    setCachedUiState();
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    __sadvNotify();
  }

  const runtimeCapabilities = resolveRuntimeCapabilities();
  var sadvRefreshBtnEl = document.getElementById("sadv-refresh-btn");
  if (sadvRefreshBtnEl) {
    if (!runtimeCapabilities.canRefresh) {
      sadvRefreshBtnEl.style.display = "none";
      sadvRefreshBtnEl.setAttribute("aria-hidden", "true");
    } else {
      sadvRefreshBtnEl.addEventListener("click", async function () {
        if (this.disabled || this.dataset.busy === "true") return;
        const btn = this;
        const baseLabel = btn.dataset.baseLabel || "새로고침";
        const originalTitle = btn.title || baseLabel;
        const originalAriaLabel = btn.getAttribute("aria-label") || baseLabel;
        btn.dataset.busy = "true";
        btn.disabled = true;
        btn.classList.add("spinning");
        btn.title = "새로고침 중";
        btn.setAttribute("aria-label", "새로고침 중");
        try {
          await runFullRefreshPipeline({ trigger: "manual", button: btn });
        } finally {
          btn.classList.remove("spinning");
          btn.disabled = false;
          btn.dataset.busy = "false";
          btn.title = originalTitle;
          btn.setAttribute("aria-label", originalAriaLabel);
          if (typeof syncSnapshotActionButtons === "function") {
            syncSnapshotActionButtons(
              typeof getRuntimeSaveStatus === "function" ? getRuntimeSaveStatus() : null
            );
          }
          __sadvNotify();
        }
      });
    }
  } else {
    console.warn("[UI Controls] #sadv-refresh-btn not found during initialization");
  }

  var sadvSaveBtnEl = document.getElementById("sadv-save-btn");
  if (sadvSaveBtnEl) {
    if (!runtimeCapabilities.canSave) {
      sadvSaveBtnEl.style.display = "none";
      sadvSaveBtnEl.setAttribute("aria-hidden", "true");
    } else {
      sadvSaveBtnEl.addEventListener("click", function () {
        if (typeof closeHeaderSaveHubMenu === "function") closeHeaderSaveHubMenu();
        // Canonical save entry:
        // 저장 버튼도 directSave/background save와 같은 save execution contract를 타야 한다.
        // 여기서 downloadSnapshot()로 바로 내려가면 runtime bootstrap lease / refresh lease /
        // blocked 정책 / selection snapshot 계약이 다시 entrypoint마다 drift 하게 된다.
        const saveStatus =
          typeof getRuntimeSaveStatus === "function" ? getRuntimeSaveStatus() : null;
        if (saveStatus && saveStatus.active) return;
        if (typeof runSnapshotSaveExecution === "function") {
          runSnapshotSaveExecution({ entryPoint: "button-save" });
          return;
        }
        // Compat safety net only:
        // 정상 번들에서는 runSnapshotSaveExecution()이 canonical owner다.
        // 이 fallback이 "정상 경로"처럼 다시 확장되면 save policy ownership이 entrypoint마다 drift 한다.
        downloadSnapshot();
      });
    }
  } else {
    console.warn("[UI Controls] #sadv-save-btn not found during initialization");
  }

  var sadvXlsxBtnEl = document.getElementById("sadv-xlsx-btn");
  if (sadvXlsxBtnEl) {
    // XLSX 상세 저장은 기존 CSV 수동 저장 자리를 완전히 대체한다.
    // 기본 public surface는 live interactive manual button이 정본이다.
    // 단, merge.py가 만든 read-only saved merged snapshot에서는
    // manual xlsx entry만 좁게 다시 연다.
    // 일반 saved/read-only snapshot과 live merge UI는 계속 보수적으로 숨긴다.
    syncXlsxButtonVisibility();
    sadvXlsxBtnEl.addEventListener("click", function () {
      if (typeof closeHeaderSaveHubMenu === "function") closeHeaderSaveHubMenu();
      if (sadvXlsxBtnEl.disabled) return;
      const saveStatus =
        typeof getRuntimeSaveStatus === "function" ? getRuntimeSaveStatus() : null;
      if (saveStatus && saveStatus.active) return;
      if (typeof runSnapshotSaveExecution === "function") {
        const manualOptions =
          typeof buildSnapshotManualXlsxExecutionOptions === "function"
            ? buildSnapshotManualXlsxExecutionOptions()
            : {};
        runSnapshotSaveExecution({
          entryPoint: "button-xlsx",
          outputFormat: "xlsx",
          ...(manualOptions || {}),
        });
      }
    });
  } else {
    console.warn("[UI Controls] #sadv-xlsx-btn not found during initialization");
  }

  var sadvSaveHubBtnEl = document.getElementById("sadv-save-hub-btn");
  if (sadvSaveHubBtnEl) {
    sadvSaveHubBtnEl.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const refs = typeof getHeaderSaveHubElements === "function" ? getHeaderSaveHubElements() : null;
      if (!refs || !refs.button) return;
      const directAction = refs.button.dataset.directAction || "";
      if (directAction === "save" && sadvSaveBtnEl) {
        sadvSaveBtnEl.click();
        return;
      }
      if (directAction === "xlsx" && sadvXlsxBtnEl) {
        sadvXlsxBtnEl.click();
        return;
      }
      if (!refs.menu) return;
      const nextOpen = refs.wrap && refs.wrap.dataset.open === "true" ? "false" : "true";
      refs.wrap.dataset.open = nextOpen;
      refs.menu.hidden = nextOpen !== "true";
      refs.button.setAttribute("aria-expanded", nextOpen === "true" ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      const refs = typeof getHeaderSaveHubElements === "function" ? getHeaderSaveHubElements() : null;
      if (!refs || !refs.wrap) return;
      if (!refs.wrap.contains(e.target)) closeHeaderSaveHubMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && typeof closeHeaderSaveHubMenu === "function") {
        closeHeaderSaveHubMenu();
      }
    });
  }

  var sadvCloseBtnEl = document.getElementById("sadv-x");
  if (sadvCloseBtnEl) {
    if (!runtimeCapabilities.canClose) {
      sadvCloseBtnEl.style.display = "none";
      sadvCloseBtnEl.setAttribute("aria-hidden", "true");
    } else {
      sadvCloseBtnEl.addEventListener("click", function () {
        const panel = document.getElementById("sadv-p");
        const inj = document.getElementById("sadv-inj");
        if (typeof stopCacheExpiryMonitor === "function") stopCacheExpiryMonitor();
        if (typeof removeSnapshotSaveOverlay === "function") removeSnapshotSaveOverlay();
        if (typeof clearSnapshotSaveStatusResetTimer === "function") clearSnapshotSaveStatusResetTimer();
        if (typeof resetRuntimeSaveStatus === "function") resetRuntimeSaveStatus();
        if (typeof window !== "undefined" && typeof window.__SADV_SYNC_ACTION_BUTTONS_UNSUB__ === "function") {
          try {
            window.__SADV_SYNC_ACTION_BUTTONS_UNSUB__();
          } catch (_) {}
          delete window.__SADV_SYNC_ACTION_BUTTONS_UNSUB__;
        }
        if (panel) panel.remove();
        if (inj) inj.remove();
        if (typeof clearRuntimePublicApi === "function") clearRuntimePublicApi();
        else if (typeof window !== "undefined") delete window.__sadvApi;
      });
    }
  } else {
    console.warn("[UI Controls] #sadv-x not found during initialization");
  }

  if (typeof window !== "undefined") {
    if (typeof subscribeRuntimeSaveStatus === "function") {
      if (typeof window.__SADV_SYNC_ACTION_BUTTONS_UNSUB__ === "function") {
        try {
          window.__SADV_SYNC_ACTION_BUTTONS_UNSUB__();
        } catch (_) {}
      }
      window.__SADV_SYNC_ACTION_BUTTONS_UNSUB__ = subscribeRuntimeSaveStatus(function (status) {
        syncSnapshotActionButtons(status);
      });
    }
    syncSnapshotActionButtons(
      typeof getRuntimeSaveStatus === "function" ? getRuntimeSaveStatus() : null
    );
    const publicApi = {
      getState: __sadvSnapshot,
      getCapabilities: function () {
        return resolveRuntimeCapabilities();
      },
      getSaveStatus: function () {
        return typeof getRuntimeSaveStatus === "function"
          ? getRuntimeSaveStatus()
          : null;
      },
      isReady: function () {
        return __sadvInitialReady;
      },
      waitUntilReady: function (timeoutMs) {
        // 주의:
        // waitUntilReady()는 "shell-ready"를 의미한다.
        // 즉 패널 scaffold/public facade/listener wiring이 준비된 시점을 기다리는 API이지,
        // live startup refresh/bootstrap work까지 모두 settled 되었다는 뜻은 아니다.
        // 외부 드라이버가 startup in-flight 여부까지 보고 싶다면
        // getSaveStatus() / overlay dataset / runtime progress를 함께 읽어야 한다.
        return new Promise(function (resolve, reject) {
          if (__sadvInitialReady) {
            resolve(true);
            return;
          }
          let timer = null;
          const done = function (ok) {
            if (timer) clearTimeout(timer);
            resolve(ok);
          };
          __sadvReadyResolvers.push(done);
          if (timeoutMs && timeoutMs > 0) {
            timer = setTimeout(function () {
              const idx = __sadvReadyResolvers.indexOf(done);
              if (idx >= 0) __sadvReadyResolvers.splice(idx, 1);
              reject(new Error("legacy init timeout"));
            }, timeoutMs);
          }
        });
      },
      subscribe: function (fn) {
        __sadvListeners.add(fn);
        return function () {
          __sadvListeners.delete(fn);
        };
      },
      subscribeSaveStatus: function (fn) {
        return typeof subscribeRuntimeSaveStatus === "function"
          ? subscribeRuntimeSaveStatus(fn)
          : function () {};
      },
      switchMode: function (mode) {
        switchMode(mode);
      },
      setSite: function (site) {
        setComboSite(site);
      },
      switchSite: function (site) {
        // Phase 2 convergence:
        // action contract 문서의 canonical 의미는 "site 선택 + site mode 진입"이다.
        // 기존 setSite는 호환성 유지용으로 남기고, 공통 facade에는 의미가 더 명확한
        // switchSite를 추가해 live/saved가 같은 intent를 표현하게 한다.
        setComboSite(site);
        const selectionState = getUiControlsSelectionState();
        if (selectionState.curMode !== CONFIG.MODE.SITE) switchMode(CONFIG.MODE.SITE);
      },
      setTab: function (tab) {
        const selectionState = getUiControlsSelectionState();
        if (!tabsEl || !TABS.some(function (item) { return item.id === tab; }) || selectionState.curTab === tab) return;
        applyUiControlsTab(tab);
        tabsEl.querySelectorAll(".sadv-t").forEach(function (b) {
          b.classList.remove("on");
          b.setAttribute("aria-selected", "false");
        });
        const btn = tabsEl.querySelector('[data-t="' + tab + '"]');
        if (btn) {
          btn.classList.add("on");
          btn.setAttribute("aria-selected", "true");
        }
        if (window.__sadvR) renderTab(window.__sadvR);
        __sadvNotify();
      },
      refresh: function () {
        const capabilities = resolveRuntimeCapabilities();
        if (!capabilities.canRefresh) return false;
        const btn = document.getElementById("sadv-refresh-btn");
        if (btn) btn.click();
        return !!btn;
      },
      download: function () {
        const capabilities = resolveRuntimeCapabilities();
        if (!capabilities.canSave) return false;
        const saveStatus =
          typeof getRuntimeSaveStatus === "function" ? getRuntimeSaveStatus() : null;
        if (saveStatus && saveStatus.active) return false;
        // Canonical public save path:
        // download()/directSave()/loadAndDirectSaveHeadless()는 모두 runSnapshotSaveExecution()
        // 기준으로 같은 contract를 공유해야 한다. fallback은 compat 안전망일 뿐 정본이 아니다.
        if (typeof runSnapshotSaveExecution === "function") {
          runSnapshotSaveExecution({ entryPoint: "download-api" });
          return true;
        }
        downloadSnapshot();
        return true;
      },
      directSave: function (options) {
        const capabilities = resolveRuntimeCapabilities();
        if (!capabilities.canSave) return Promise.resolve(false);
        if (typeof runSnapshotSaveExecution === "function") {
          return runSnapshotSaveExecution({ ...(options || {}), entryPoint: "direct-save" });
        }
        // Compat safety net only:
        // directSaveSnapshot()/downloadSnapshot() 직접 호출은 legacy 호환 경로일 뿐,
        // save policy/lease/blocked 판단의 정본으로 취급하면 안 된다.
        if (typeof directSaveSnapshot === "function") {
          return directSaveSnapshot(options);
        }
        downloadSnapshot();
        return Promise.resolve(true);
      },
      loadAndDirectSaveHeadless: function (options) {
        const capabilities = resolveRuntimeCapabilities();
        if (!capabilities.canSave) return Promise.resolve(false);
        if (typeof runBackgroundSnapshotDownload === "function") {
          return runBackgroundSnapshotDownload(options);
        }
        // Compat fallback only:
        // 정상 번들에서는 background-download boot path가 존재해야 한다.
        // 이 분기는 helper가 빠진 부분 빌드/이전 런타임에서도 public facade가
        // 완전히 깨지지 않도록 남겨둔 안전망이다.
        // 즉 의미상 정본은 "패널 first-frame 비노출 + 공통 save execution contract"이고,
        // 아래 directSaveSnapshot({ headless:true })는 그 정본 경로가 없을 때만 허용되는 compat 경로다.
        // 다시 말해 09-ui-controls.js는 save policy owner가 아니라 entry router다.
        // 여기서 background/save 정책을 직접 늘리기 시작하면 canonical contract가 다시 분기된다.
        if (typeof directSaveSnapshot === "function") {
          return directSaveSnapshot({ ...(options || {}), headless: true });
        }
        downloadSnapshot();
        return Promise.resolve(true);
      },
      exportSnapshotData: function (onProgress, options) {
        return collectExportData(onProgress, options);
      },
      buildLegacySnapshotHtml: function (savedAt, payload) {
        return buildSnapshotHtml(savedAt, payload);
      },
      close: function () {
        const capabilities = resolveRuntimeCapabilities();
        if (!capabilities.canClose) return false;
        const panel = document.getElementById("sadv-p");
        const inj = document.getElementById("sadv-inj");
        if (typeof stopCacheExpiryMonitor === "function") stopCacheExpiryMonitor();
        if (typeof removeSnapshotSaveOverlay === "function") removeSnapshotSaveOverlay();
        if (typeof clearSnapshotSaveStatusResetTimer === "function") clearSnapshotSaveStatusResetTimer();
        if (typeof resetRuntimeSaveStatus === "function") resetRuntimeSaveStatus();
        if (typeof window !== "undefined" && typeof window.__SADV_SYNC_ACTION_BUTTONS_UNSUB__ === "function") {
          try {
            window.__SADV_SYNC_ACTION_BUTTONS_UNSUB__();
          } catch (_) {}
          delete window.__SADV_SYNC_ACTION_BUTTONS_UNSUB__;
        }
        if (panel) panel.remove();
        if (inj) inj.remove();
        if (typeof clearRuntimePublicApi === "function") clearRuntimePublicApi();
        else delete window.__sadvApi;
        return true;
      },
    };
    if (typeof setRuntimePublicApi === "function") setRuntimePublicApi(publicApi);
    else window.__sadvApi = publicApi;
  }
