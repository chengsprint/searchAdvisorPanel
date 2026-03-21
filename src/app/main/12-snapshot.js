  /**
 * ============================================================================
 * Snapshot Export / Offline Bootstrap
 * ============================================================================
 *
 * 이 파일은 같은 UI를 offline payload 기반으로 다시 여는 entry point다.
 * 즉, 저장본 전용 "다른 UI"를 만드는 곳이 아니라:
 *
 * - payload 직렬화
 * - offline state hydrate
 * - read-only bootstrap
 * - compat API
 * - top-layer combo 보정
 *
 * 같은 snapshot 특수사항만 담당해야 한다.
 *
 * 관련 문서:
 * - src/app/main/SNAPSHOT_EXPORT_CONTRACT.md
 * - src/app/main/UI_DATA_PIPELINE_BOUNDARY.md
 * - src/app/main/SNAPSHOT_IMPLEMENTATION_GUIDE.md
 */
let snapshotSaveInFlightPromise = null;
let directSaveInFlightPromise = null;
let backgroundSnapshotSaveInFlightPromise = null;
let snapshotSaveOverlayCleanupTimer = null;
let snapshotSaveOverlaySuppressed = false;
let snapshotBackgroundCleanupTimer = null;
const SNAPSHOT_SAVE_BLOCK_FAILED_RATIO = 0.2;

function createIdleDirectSaveStatus() {
  return {
    active: false,
    state: "idle",
    phase: null,
    runtimeType: "live",
    uiHidden: false,
    stageLabel: "",
    detail: "",
    startedAt: null,
    updatedAt: Date.now(),
    completedAt: null,
    progress: { done: 0, total: 0, ratio: 0, percent: 0 },
    stats: { success: 0, partial: 0, failed: 0, errors: [] },
    cacheDecision: { neededRefresh: false, reason: null, missingSites: 0, expiredSites: 0 },
    fileName: null,
    site: null,
    error: null,
  };
}

function clearSnapshotSaveOverlayCleanupTimer() {
  if (snapshotSaveOverlayCleanupTimer) {
    clearTimeout(snapshotSaveOverlayCleanupTimer);
    snapshotSaveOverlayCleanupTimer = null;
  }
}

function clearSnapshotBackgroundCleanupTimer() {
  if (snapshotBackgroundCleanupTimer) {
    clearTimeout(snapshotBackgroundCleanupTimer);
    snapshotBackgroundCleanupTimer = null;
  }
}

function removeSnapshotSaveOverlay() {
  clearSnapshotSaveOverlayCleanupTimer();
  const existing = document.getElementById("sadv-save-status-overlay");
  if (existing) existing.remove();
}

function setSnapshotSaveOverlaySuppressed(suppressed) {
  snapshotSaveOverlaySuppressed = !!suppressed;
  if (snapshotSaveOverlaySuppressed) {
    removeSnapshotSaveOverlay();
  }
}

function createSnapshotHeadlessUiRestore() {
  const targets = [];
  const selectors = ['#sadv-p', '#sadv-save-status-overlay', 'button[title="최상단 이동"]'];
  selectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (node) {
      if (!node || targets.some(function (entry) { return entry.node === node; })) return;
      targets.push({
        node: node,
        visibility: node.style.visibility || "",
        opacity: node.style.opacity || "",
        pointerEvents: node.style.pointerEvents || "",
      });
      node.style.visibility = "hidden";
      node.style.opacity = "0";
      node.style.pointerEvents = "none";
    });
  });
  return function restoreSnapshotHeadlessUi() {
    targets.forEach(function (entry) {
      if (!entry.node) return;
      entry.node.style.visibility = entry.visibility;
      entry.node.style.opacity = entry.opacity;
      entry.node.style.pointerEvents = entry.pointerEvents;
    });
  };
}

function applySnapshotBackgroundSaveUiHidden() {
  const targets = [];
  const selectors = ['#sadv-p', 'button[title="최상단 이동"]'];
  selectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (node) {
      if (!node || targets.some(function (entry) { return entry.node === node; })) return;
      targets.push({
        node: node,
        visibility: node.style.visibility || "",
        opacity: node.style.opacity || "",
        pointerEvents: node.style.pointerEvents || "",
        transform: node.style.transform || "",
      });
      node.style.visibility = "hidden";
      node.style.opacity = "0";
      node.style.pointerEvents = "none";
      if (node.id === "sadv-p") {
        node.style.transform = "translateX(calc(100% + 48px))";
        node.dataset.sadvBootHidden = "true";
      }
    });
  });
  return function cleanupSnapshotBackgroundSaveUi() {
    targets.forEach(function (entry) {
      if (!entry.node) return;
      entry.node.style.visibility = entry.visibility;
      entry.node.style.opacity = entry.opacity;
      entry.node.style.pointerEvents = entry.pointerEvents;
      entry.node.style.transform = entry.transform;
      if (entry.node.id === "sadv-p") {
        delete entry.node.dataset.sadvBootHidden;
      }
    });
  };
}

function getDirectSaveHeadlessMode(options) {
  return !!(
    options &&
    (options.headless === true || options.hidePanel === true || options.silentUi === true)
  );
}

function scheduleSnapshotBackgroundRuntimeCleanup(delayMs) {
  clearSnapshotBackgroundCleanupTimer();
  snapshotBackgroundCleanupTimer = setTimeout(function () {
    snapshotBackgroundCleanupTimer = null;
    const panel = document.getElementById("sadv-p");
    const inj = document.getElementById("sadv-inj");
    removeSnapshotSaveOverlay();
    if (typeof stopCacheExpiryMonitor === "function") stopCacheExpiryMonitor();
    if (panel) panel.remove();
    if (inj) inj.remove();
    if (typeof clearRuntimePublicApi === "function") clearRuntimePublicApi();
    else if (typeof window !== "undefined") delete window.__sadvApi;
    if (typeof resetRuntimeSaveStatus === "function") resetRuntimeSaveStatus();
  }, Math.max(0, delayMs || 1800));
}

function getSnapshotSaveRuntimeType() {
  const capabilities =
    typeof getRuntimeCapabilities === "function" ? getRuntimeCapabilities() : null;
  if (capabilities && capabilities.isReadOnly) return "saved";
  if (typeof isMultiAccountMode === "function" && isMultiAccountMode()) return "merge";
  if (
    typeof ACCOUNT_UTILS !== "undefined" &&
    ACCOUNT_UTILS &&
    typeof ACCOUNT_UTILS.isMultiAccount === "function" &&
    ACCOUNT_UTILS.isMultiAccount()
  ) {
    return "merge";
  }
  if (
    typeof window !== "undefined" &&
    window.__sadvAccountState &&
    window.__sadvAccountState.isMultiAccount
  ) {
    return "merge";
  }
  const mergedMeta =
    typeof getMergedMetaState === "function"
      ? getMergedMetaState()
      : (typeof getRuntimeShellState === "function" ? getRuntimeShellState()?.mergedMeta : null);
  if (mergedMeta && mergedMeta.isMerged) return "merge";
  return "live";
}

function buildSnapshotSaveRuntimeTypeLabel(runtimeType) {
  if (runtimeType === "saved") return "SAVED";
  if (runtimeType === "merge") return "MERGE";
  return "LIVE";
}

function ensureSnapshotSaveOverlay() {
  let overlay = document.getElementById("sadv-save-status-overlay");
  if (overlay) return overlay;
  overlay = document.createElement("div");
  overlay.id = "sadv-save-status-overlay";
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:2147483645;display:flex;align-items:center;justify-content:center;" +
    "padding:24px;background:rgba(0,0,0,0.54);backdrop-filter:blur(6px);" +
    "color:var(--sadv-text,#fffdf5);font-family:" +
    T.fontSans +
    ";pointer-events:none";
  document.body.appendChild(overlay);
  return overlay;
}

function buildSnapshotSaveOverlayTitle(status) {
  const state = status && typeof status.state === "string" ? status.state : "idle";
  if (status && status.stageLabel) return status.stageLabel;
  if (state === "checking-cache") return "저장 준비 중";
  if (state === "refreshing") return "최신 데이터 갱신 중";
  if (state === "collecting") return "저장 데이터 수집 중";
  if (state === "building-html") return "HTML 저장본 생성 중";
  if (state === "triggering-download") return "다운로드 시작 중";
  if (state === "completed-with-issues") return "저장 완료 · 이슈 있음";
  if (state === "completed") return "저장 완료";
  if (state === "blocked") return "저장 중단";
  if (state === "failed") return "저장 실패";
  return "저장 대기 중";
}

function buildSnapshotSaveOverlayAccent(status) {
  const state = status && typeof status.state === "string" ? status.state : "idle";
  if (state === "completed-with-issues") return C.amber;
  if (state === "completed") return C.green;
  if (state === "blocked") return C.red;
  if (state === "failed") return C.red;
  if (state === "refreshing") return C.blue;
  if (state === "checking-cache") return C.amber;
  if (state === "triggering-download") return C.teal;
  return C.amber;
}

function renderSnapshotSaveOverlay(status) {
  if (snapshotSaveOverlaySuppressed) {
    removeSnapshotSaveOverlay();
    return;
  }
  if (!status || status.state === "idle") {
    removeSnapshotSaveOverlay();
    return;
  }
  clearSnapshotSaveOverlayCleanupTimer();
  const overlay = ensureSnapshotSaveOverlay();
  const title = buildSnapshotSaveOverlayTitle(status);
  const accent = buildSnapshotSaveOverlayAccent(status);
  const progress = status.progress && typeof status.progress === "object" ? status.progress : {};
  const stats = status.stats && typeof status.stats === "object" ? status.stats : {};
  const pct =
    typeof progress.percent === "number"
      ? Math.max(0, Math.min(100, Math.round(progress.percent)))
      : 0;
  const detail = typeof status.detail === "string" ? status.detail : "";
  const site = typeof status.site === "string" && status.site ? status.site : "";
  const runtimeType =
    status && typeof status.runtimeType === "string" && status.runtimeType
      ? status.runtimeType
      : getSnapshotSaveRuntimeType();
  const runtimeTypeLabel = buildSnapshotSaveRuntimeTypeLabel(runtimeType);
  const cacheDecision =
    status.cacheDecision && typeof status.cacheDecision === "object"
      ? status.cacheDecision
      : null;
  const decisionHtml =
    cacheDecision && cacheDecision.neededRefresh
      ? '<span style="color:' +
        C.amber +
        '">캐시 갱신 필요</span>' +
        (cacheDecision.reason
          ? '<span style="color:rgba(255,253,245,0.58)"> · ' +
            escHtml(String(cacheDecision.reason)) +
            "</span>"
          : "")
      : '<span style="color:' + C.green + '">즉시 저장 가능</span>';
  overlay.dataset.state = status.state || "idle";
  overlay.dataset.phase = status.phase || "";
  overlay.dataset.runtimeType = runtimeType;
  overlay.dataset.uiHidden = status.uiHidden ? "true" : "false";
  overlay.dataset.active = status.active ? "true" : "false";
  overlay.dataset.current =
    typeof progress.done === "number" ? String(progress.done) : "0";
  overlay.dataset.total =
    typeof progress.total === "number" ? String(progress.total) : "0";
  overlay.dataset.percent = String(pct);
  overlay.dataset.stopped =
    !status.active &&
    (status.state === "completed" ||
      status.state === "failed" ||
      status.state === "blocked")
      ? "true"
      : "false";
  overlay.innerHTML = sanitizeHTML(
    '<div style="pointer-events:none;width:min(100%,520px);border-radius:20px;border:1px solid rgba(255,255,255,0.10);background:linear-gradient(180deg,rgba(17,17,20,0.98),rgba(10,10,12,0.97));box-shadow:0 28px 80px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.03) inset;padding:18px 20px">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">' +
        '<div style="min-width:0;flex:1">' +
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">' +
            '<span style="display:inline-flex;align-items:center;justify-content:center;padding:4px 8px;border-radius:999px;border:1px solid rgba(255,255,255,0.10);background:rgba(255,255,255,0.04);font-size:10px;font-weight:800;letter-spacing:0.08em;color:' + accent + '">' +
              escHtml(runtimeTypeLabel) +
            "</span>" +
            '<span style="font-size:12px;font-weight:800;color:' + accent + '">' +
              escHtml(title) +
            "</span>" +
          "</div>" +
          '<div style="font-size:12px;line-height:1.6;color:var(--sadv-text-secondary,#ffe9a8);margin-bottom:10px">' +
            escHtml(detail || "진행 상태를 준비하고 있어요.") +
          "</div>" +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
            '<div style="flex:1;height:10px;border-radius:999px;background:rgba(255,255,255,0.06);overflow:hidden;border:1px solid rgba(255,255,255,0.06)">' +
              '<div style="width:' + pct + '%;height:100%;background:' + accent + ';box-shadow:0 0 18px ' + accent + '66"></div>' +
            "</div>" +
            '<span style="font-size:12px;font-weight:800;color:' + accent + ';min-width:48px;text-align:right">' +
              escHtml(String(pct)) +
              "%</span>" +
          "</div>" +
          '<div style="display:flex;flex-wrap:wrap;gap:10px;font-size:11px;color:rgba(255,253,245,0.70);margin-bottom:8px">' +
            '<span>진행 ' + escHtml(String(progress.done || 0)) + '/' + escHtml(String(progress.total || 0)) + "</span>" +
            '<span>완료 ' + escHtml(String(stats.success || 0)) + "</span>" +
            '<span>부분 ' + escHtml(String(stats.partial || 0)) + "</span>" +
            '<span>실패 ' + escHtml(String(stats.failed || 0)) + "</span>" +
          "</div>" +
          '<div style="font-size:11px;color:rgba(255,253,245,0.62);line-height:1.6">' +
            decisionHtml +
            (site ? '<div style="margin-top:4px;color:rgba(255,253,245,0.78)">현재 사이트 · ' + escHtml(site.replace("https://", "").replace("http://", "")) + "</div>" : "") +
            (status.fileName ? '<div style="margin-top:4px;color:' + accent + '">' + escHtml(status.fileName) + "</div>" : "") +
            (status.error && status.error.message ? '<div style="margin-top:8px;color:' + C.red + ';font-weight:700">' + escHtml(status.error.message) + "</div>" : "") +
            '<div style="margin-top:8px;color:rgba(255,253,245,0.50)">외부 드라이버용 상태: ' + escHtml(runtimeTypeLabel) + ' · ' + escHtml(String(status.state || "idle")) + "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>"
  );
  if (!status.active && status.state === "completed") {
    snapshotSaveOverlayCleanupTimer = setTimeout(function () {
      removeSnapshotSaveOverlay();
    }, 1800);
  } else if (!status.active && status.state === "blocked") {
    snapshotSaveOverlayCleanupTimer = setTimeout(function () {
      removeSnapshotSaveOverlay();
    }, 4200);
  }
}

function pushSnapshotSaveStatus(patch) {
  if (!patch || typeof patch !== "object") {
    patch = {};
  }
  if (!patch.runtimeType) {
    patch.runtimeType = getSnapshotSaveRuntimeType();
  }
  const next =
    typeof setRuntimeSaveStatus === "function"
      ? setRuntimeSaveStatus(patch)
      : (typeof cloneRuntimeSaveStatus === "function" ? cloneRuntimeSaveStatus(patch) : patch);
  renderSnapshotSaveOverlay(next);
  return next;
}

function buildDirectSaveRefreshDecision() {
  const runtimeSites =
    typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
  const memCache = typeof getMemCache === "function" ? getMemCache() : null;
  const bootstrapStatus =
    typeof getBootstrapFullRefreshStatus === "function"
      ? getBootstrapFullRefreshStatus()
      : {
          shouldRefresh:
            typeof shouldBootstrapFullRefresh === "function"
              ? shouldBootstrapFullRefresh()
              : false,
          reason: null,
          ttlMs: typeof getDataTtlMs === "function" ? getDataTtlMs() : null,
          expiredSites: 0,
          siteListMissing: false,
          siteListExpired: false,
        };
  const decision = {
    neededRefresh: !!bootstrapStatus.shouldRefresh,
    reason: bootstrapStatus.reason || null,
    ttlMs: bootstrapStatus.ttlMs || null,
    siteCount: Array.isArray(runtimeSites) ? runtimeSites.length : 0,
    siteListMissing: !!bootstrapStatus.siteListMissing,
    siteListExpired: !!bootstrapStatus.siteListExpired,
    missingSites: 0,
    expiredSites: bootstrapStatus.expiredSites || 0,
  };
  if (!runtimeSites.length) {
    decision.neededRefresh = true;
    decision.reason = decision.reason || "site-list-missing";
    decision.siteListMissing = true;
    return decision;
  }
  runtimeSites.forEach(function (site) {
    const siteData =
      (memCache && memCache[site]) ||
      (typeof window !== "undefined" && window.__sadvInitData && window.__sadvInitData.sites
        ? window.__sadvInitData.sites[site]
        : null) ||
      (typeof window !== "undefined" && window.__sadvMergedData && window.__sadvMergedData.sites
        ? window.__sadvMergedData.sites[site]
        : null) ||
      (typeof window !== "undefined" &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__ &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteData
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteData[site]
        : null) ||
      null;
    const hasCompleteData =
      !!siteData && siteData.expose != null && siteData.detailLoaded === true;
    if (!hasCompleteData) decision.missingSites += 1;
  });
  if (decision.missingSites > 0) {
    decision.neededRefresh = true;
    if (!decision.reason) decision.reason = "site-data-missing";
  }
  if (!decision.reason && decision.expiredSites > 0) {
    decision.reason = "site-data-expired";
  }
  return decision;
}

function getSnapshotPayloadSiteCount(payload, fallbackCount) {
  if (payload && payload.__meta && payload.accounts && typeof payload.accounts === "object") {
    const accountKeys = Object.keys(payload.accounts);
    const firstAccount = accountKeys.length > 0 ? payload.accounts[accountKeys[0]] : null;
    const sites = firstAccount && Array.isArray(firstAccount.sites) ? firstAccount.sites : null;
    if (sites) return sites.length;
  }
  if (payload && Array.isArray(payload.allSites)) return payload.allSites.length;
  if (typeof fallbackCount === "number" && fallbackCount >= 0) return fallbackCount;
  return 0;
}

function getActiveSnapshotPanelUserError() {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  const activeBanner = document.getElementById("sadv-user-error-banner");
  const lastUserError = window.__SEARCHADVISOR_LAST_USER_ERROR__;
  if (!activeBanner || !lastUserError || typeof lastUserError !== "object") return null;
  return lastUserError;
}

function buildSnapshotSaveBlockDecision(payload, runtimeSites) {
  const activePanelError = getActiveSnapshotPanelUserError();
  const stats = payload && payload.stats && typeof payload.stats === "object"
    ? payload.stats
    : { success: 0, partial: 0, failed: 0, errors: [] };
  const totalSites = getSnapshotPayloadSiteCount(
    payload,
    Array.isArray(runtimeSites) ? runtimeSites.length : 0,
  );
  const failedCount = typeof stats.failed === "number" ? stats.failed : 0;
  const failureRatio = totalSites > 0 ? failedCount / totalSites : failedCount > 0 ? 1 : 0;

  if (activePanelError) {
    return {
      blocked: true,
      reason: "panel-user-error",
      userMessage: ERROR_MESSAGES.SAVE_BLOCKED_PANEL_ERROR,
      detail:
        "패널 작업 중 치명적인 오류가 남아 있어 저장을 중단했어요. 현재 오류를 먼저 해결한 뒤 다시 시도해 주세요.",
      technicalMessage:
        typeof activePanelError.message === "string" ? activePanelError.message : null,
      stats: stats,
      totalSites: totalSites,
      failedCount: failedCount,
      failureRatio: failureRatio,
    };
  }

  if (totalSites > 0 && failureRatio > SNAPSHOT_SAVE_BLOCK_FAILED_RATIO) {
    return {
      blocked: true,
      reason: "failure-ratio-exceeded",
      userMessage: ERROR_MESSAGES.SAVE_BLOCKED_TOO_MANY_FAILURES,
      detail:
        "조회 실패 사이트가 " +
        failedCount +
        " / " +
        totalSites +
        "개(" +
        Math.round(failureRatio * 100) +
        "%)라 저장을 중단했어요. 허용 기준은 20% 이하입니다.",
      technicalMessage:
        "failed=" +
        failedCount +
        ", total=" +
        totalSites +
        ", ratio=" +
        Math.round(failureRatio * 100) +
        "%",
      stats: stats,
      totalSites: totalSites,
      failedCount: failedCount,
      failureRatio: failureRatio,
    };
  }

  return {
    blocked: false,
    reason: null,
    userMessage: null,
    detail: "",
    technicalMessage: null,
    stats: stats,
    totalSites: totalSites,
    failedCount: failedCount,
    failureRatio: failureRatio,
  };
}

function buildDirectSaveDecisionDetail(decision) {
  if (!decision || !decision.neededRefresh) {
    return "현재 캐시를 사용해 바로 저장을 시작합니다.";
  }
  if (decision.reason === "site-list-missing") {
    return "사이트 목록 캐시가 없어 전체 데이터를 다시 수집한 뒤 저장합니다.";
  }
  if (decision.reason === "site-list-expired") {
    return "사이트 목록 캐시가 만료되어 최신 데이터를 다시 수집한 뒤 저장합니다.";
  }
  if (decision.reason === "site-data-missing") {
    return (
      "저장에 필요한 사이트 데이터가 일부 비어 있어 " +
      String(decision.missingSites || 0) +
      "개 사이트를 포함해 전체 데이터를 갱신한 뒤 저장합니다."
    );
  }
  return "캐시가 만료되었거나 불완전해서 최신 데이터를 갱신한 뒤 저장합니다.";
}

function hasSnapshotSaveIssues(stats) {
  return !!(
    stats &&
    (stats.failed > 0 ||
      stats.partial > 0 ||
      (Array.isArray(stats.errors) && stats.errors.length > 0))
  );
}

function buildSnapshotSaveIssuesDetail(stats, fileName) {
  const safeStats = stats || { failed: 0, partial: 0 };
  const summary =
    "실패 " +
    String(safeStats.failed || 0) +
    "개 · 부분 " +
    String(safeStats.partial || 0) +
    "개";
  if (fileName) {
    return "일부 요청 이슈가 있었지만 저장본은 생성되었습니다. " + summary + " · " + fileName;
  }
  return "일부 요청 이슈가 있었지만 저장본은 생성되었습니다. " + summary;
}

function buildSnapshotDownloadFileName(savedAt) {
  return (
    "searchadvisor-" +
    accountIdFromLabel(accountLabel) +
    "-" +
    stampFile(savedAt) +
    ".html"
  );
}

function setSnapshotSaveButtonBusy(btn, text) {
  if (!btn) return;
  btn.disabled = true;
  btn.dataset.busy = "true";
  btn.textContent = text;
}

function restoreSnapshotSaveButton(btn, originalText) {
  if (!btn) return;
  btn.disabled = false;
  btn.dataset.busy = "false";
  btn.textContent = originalText;
}

/**
 * Download the current view as a standalone HTML snapshot file
 * Collects all data, generates HTML with embedded payload, and triggers download.
 *
 * 확장 의도:
 * - 기존 버튼 저장은 그대로 유지한다.
 * - direct save는 이 함수에 payload/precomputed refresh 결과를 넘겨 재사용한다.
 * - 저장 진행 상태는 window.__SEARCHADVISOR_SAVE_STATUS__와 overlay UI에 같이 publish한다.
 *
 * @param {Object} [options]
 * @param {Object|null} [options.payload] - 이미 수집한 payload가 있으면 재사용
 * @param {string} [options.refreshMode] - 'cache-first' | 'refresh'
 * @param {number} [options.startedAt] - direct save orchestrator가 넘기는 시작 시각
 * @param {Object|null} [options.cacheDecision] - direct save의 refresh 판단 결과
 * @returns {Promise<Object>} { ok, fileName, payload }
 * @example
 * await downloadSnapshot(); // cache-first 저장
 * await downloadSnapshot({ payload }); // 이미 refresh한 payload를 재사용해 즉시 저장
 */
  async function downloadSnapshot(options) {
    if (snapshotSaveInFlightPromise) return snapshotSaveInFlightPromise;
    snapshotSaveInFlightPromise = (async function () {
      const capabilities =
        typeof getRuntimeCapabilities === "function" ? getRuntimeCapabilities() : null;
      if (capabilities && capabilities.isReadOnly) {
        throw new Error("snapshot export is disabled in read-only mode");
      }
      const runtimeSites =
        typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
      const refreshMode =
        options && options.refreshMode === "refresh" ? "refresh" : "cache-first";
      const startedAt =
        options && typeof options.startedAt === "number" ? options.startedAt : Date.now();
      const cacheDecision =
        options && options.cacheDecision && typeof options.cacheDecision === "object"
          ? options.cacheDecision
          : {
              neededRefresh: refreshMode === "refresh",
              reason: refreshMode === "refresh" ? "explicit-refresh" : null,
              missingSites: 0,
              expiredSites: 0,
            };
      const btn = document.getElementById("sadv-save-btn");
      const originalText = btn ? btn.textContent : "저장";
      setSnapshotSaveButtonBusy(btn, "0/" + runtimeSites.length);
      pushSnapshotSaveStatus({
        __replace: true,
        active: true,
        state: options && options.payload ? "building-html" : "collecting",
        phase: "download",
        stageLabel:
          options && options.payload ? "HTML 저장본 생성 중" : "저장 데이터 수집 중",
        detail:
          options && options.payload
            ? "최신 데이터 수집은 이미 끝났고, 오프라인 HTML 저장본을 조립하고 있어요."
            : "저장본에 들어갈 사이트 데이터를 순서대로 수집하고 있어요.",
        startedAt: startedAt,
        completedAt: null,
        progress: {
          done: options && options.payload ? runtimeSites.length : 0,
          total: runtimeSites.length,
          ratio: options && options.payload ? 1 : 0,
          percent: options && options.payload ? 100 : 0,
        },
        stats:
          options && options.payload && options.payload.stats
            ? options.payload.stats
            : { success: 0, partial: 0, failed: 0, errors: [] },
        cacheDecision: cacheDecision,
        fileName: null,
        site: null,
        error: null,
      });
      try {
        const savedAt = new Date();
        const payload =
          options && options.payload
            ? options.payload
            : await collectExportData(
                function (done, total, site, stats) {
                  const safeTotal = Math.max(1, total);
                  setSnapshotSaveButtonBusy(btn, done + "/" + safeTotal);
                  pushSnapshotSaveStatus({
                    active: true,
                    state: "collecting",
                    phase: "download",
                    stageLabel: "저장 데이터 수집 중",
                    detail:
                      done +
                      " / " +
                      safeTotal +
                      " 사이트 처리 중" +
                      (site ? " · " + site.replace("https://", "").replace("http://", "") : ""),
                    progress: {
                      done: done,
                      total: safeTotal,
                      ratio: safeTotal > 0 ? done / safeTotal : 0,
                      percent: safeTotal > 0 ? Math.round((done / safeTotal) * 100) : 0,
                    },
                    stats: stats || { success: 0, partial: 0, failed: 0, errors: [] },
                    site: site || null,
                    cacheDecision: cacheDecision,
                  });
                },
                { refreshMode: refreshMode },
              );
        pushSnapshotSaveStatus({
          active: true,
          state: "building-html",
          phase: "download",
          stageLabel: "HTML 저장본 생성 중",
          detail: "오프라인에서도 열리는 단일 HTML 파일을 조립하고 있어요.",
          progress: {
            done: runtimeSites.length,
            total: runtimeSites.length,
            ratio: 1,
            percent: 100,
          },
          stats: payload && payload.stats ? payload.stats : { success: 0, partial: 0, failed: 0, errors: [] },
          site: null,
          cacheDecision: cacheDecision,
        });
        const saveBlockDecision = buildSnapshotSaveBlockDecision(payload, runtimeSites);
        if (saveBlockDecision.blocked) {
          showError(
            saveBlockDecision.userMessage,
            saveBlockDecision.technicalMessage,
            "downloadSnapshot-blocked",
            {
              dedupeKey: "downloadSnapshot-blocked::" + saveBlockDecision.reason,
              dedupeWindowMs: 1500,
            },
          );
          pushSnapshotSaveStatus({
            active: false,
            state: "blocked",
            phase: "download",
            stageLabel: "저장 중단",
            detail: saveBlockDecision.detail,
            completedAt: Date.now(),
            cacheDecision: cacheDecision,
            stats: saveBlockDecision.stats,
            fileName: null,
            site: null,
            error: {
              message: saveBlockDecision.userMessage,
              context: "downloadSnapshot-blocked",
            },
          });
          return {
            ok: false,
            status: "blocked",
            reason: saveBlockDecision.reason,
            downloaded: false,
            stats: saveBlockDecision.stats,
            block: saveBlockDecision,
          };
        }
        const html = injectSnapshotReactShell(buildSnapshotHtml(savedAt, payload), payload);
        const fileName = buildSnapshotDownloadFileName(savedAt);
        pushSnapshotSaveStatus({
          active: true,
          state: "triggering-download",
          phase: "download",
          stageLabel: "다운로드 시작 중",
          detail: "브라우저 다운로드를 트리거하고 있어요.",
          fileName: fileName,
          cacheDecision: cacheDecision,
        });
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () {
          URL.revokeObjectURL(link.href);
        }, 1000);
        const saveStats =
          payload && payload.stats ? payload.stats : { success: 0, partial: 0, failed: 0, errors: [] };
        const hasIssues = hasSnapshotSaveIssues(saveStats);
        if (hasIssues && typeof renderFailureSummary === "function") {
          renderFailureSummary(saveStats);
        }
        pushSnapshotSaveStatus({
          active: false,
          state: hasIssues ? "completed-with-issues" : "completed",
          phase: "download",
          stageLabel: hasIssues ? "저장 완료 · 이슈 있음" : "저장 완료",
          detail: hasIssues
            ? buildSnapshotSaveIssuesDetail(saveStats, fileName)
            : "브라우저 다운로드 요청을 전송했어요.",
          fileName: fileName,
          completedAt: Date.now(),
          cacheDecision: cacheDecision,
          stats: saveStats,
        });
        return {
          ok: true,
          status: hasIssues ? "completed-with-issues" : "completed",
          hasIssues: hasIssues,
          fileName: fileName,
          payload: payload,
          stats: saveStats,
        };
      } catch (e) {
        pushSnapshotSaveStatus({
          active: false,
          state: "failed",
          phase: "download",
          stageLabel: "저장 실패",
          detail:
            "저장 중 오류가 발생했어요. 상태 객체와 오류 배너를 확인한 뒤 다시 시도해 주세요.",
          completedAt: Date.now(),
          error: {
            message: e && e.message ? e.message : String(e),
            context: "downloadSnapshot",
          },
          cacheDecision: cacheDecision,
        });
        showError(ERROR_MESSAGES.HTML_SAVE_ERROR, e, 'downloadSnapshot');
        bdEl.innerHTML = createInlineError(
          ERROR_MESSAGES.HTML_SAVE_ERROR,
          function () {
            downloadSnapshot();
          },
          '다시 시도'
        ).outerHTML;
        throw e;
      } finally {
        restoreSnapshotSaveButton(btn, originalText);
      }
    })();
    try {
      return await snapshotSaveInFlightPromise;
    } finally {
      snapshotSaveInFlightPromise = null;
    }
  }

/**
 * Smart direct save pipeline
 *
 * 목표:
 * - 외부 스크립트가 버튼 클릭 없이 호출 가능해야 한다.
 * - 캐시가 없거나 만료되었거나, 저장에 필요한 세부 데이터가 비어 있으면
 *   자동으로 full refresh를 실행한 뒤 최신 payload로 저장해야 한다.
 * - 저장 상태는 전역 상태 + overlay UI + public subscribe API에서 동시에 관찰 가능해야 한다.
 *
 * @param {Object} [options]
 * @param {boolean} [options.headless] 저장 중 live 패널과 저장 오버레이를 일시적으로 숨긴다.
 * @param {boolean} [options.hidePanel] headless의 alias. 외부 automation 호환용.
 * @param {boolean} [options.silentUi] headless의 alias. 외부 automation 호환용.
 * @returns {Promise<Object|false>} live에서는 저장 결과 객체, read-only에서는 false
 */
  async function directSaveSnapshot(options) {
    if (directSaveInFlightPromise) return directSaveInFlightPromise;
    const capabilities =
      typeof getRuntimeCapabilities === "function" ? getRuntimeCapabilities() : null;
    if (capabilities && !capabilities.canSave) return false;
    const headlessMode = getDirectSaveHeadlessMode(options);
    directSaveInFlightPromise = (async function () {
      const restoreHeadlessUi = headlessMode ? createSnapshotHeadlessUiRestore() : null;
      setSnapshotSaveOverlaySuppressed(headlessMode);
      const startedAt = Date.now();
      try {
        const decision = buildDirectSaveRefreshDecision();
        pushSnapshotSaveStatus({
          __replace: true,
          active: true,
          state: "checking-cache",
          phase: "prepare",
          uiHidden: headlessMode,
          stageLabel: "저장 준비 중",
          detail: buildDirectSaveDecisionDetail(decision),
          startedAt: startedAt,
          completedAt: null,
          progress: {
            done: 0,
            total:
              typeof getRuntimeAllSites === "function"
                ? getRuntimeAllSites().length
                : allSites.length,
            ratio: 0,
            percent: 0,
          },
          stats: { success: 0, partial: 0, failed: 0, errors: [] },
          cacheDecision: decision,
          fileName: null,
          site: null,
          error: null,
        });
        let payload = options && options.payload ? options.payload : null;
        if (!payload && decision.neededRefresh) {
          pushSnapshotSaveStatus({
            active: true,
            state: "refreshing",
            phase: "refresh",
            uiHidden: headlessMode,
            stageLabel: "최신 데이터 갱신 중",
            detail: buildDirectSaveDecisionDetail(decision),
            cacheDecision: decision,
          });
          payload = await runFullRefreshPipeline({
            trigger: "manual",
            renderProgress: false,
            onProgress: function (done, total, site, stats) {
              const safeTotal = Math.max(1, total);
              pushSnapshotSaveStatus({
                active: true,
                state: "refreshing",
                phase: "refresh",
                uiHidden: headlessMode,
                stageLabel: "최신 데이터 갱신 중",
                detail:
                  done +
                  " / " +
                  safeTotal +
                  " 사이트를 최신 상태로 갱신 중" +
                  (site ? " · " + site.replace("https://", "").replace("http://", "") : ""),
                progress: {
                  done: done,
                  total: safeTotal,
                  ratio: safeTotal > 0 ? done / safeTotal : 0,
                  percent: safeTotal > 0 ? Math.round((done / safeTotal) * 100) : 0,
                },
                stats: stats || { success: 0, partial: 0, failed: 0, errors: [] },
                site: site || null,
                cacheDecision: decision,
              });
            },
          });
        }
        return downloadSnapshot({
          payload: payload,
          refreshMode: decision.neededRefresh ? "refresh" : "cache-first",
          startedAt: startedAt,
          cacheDecision: decision,
        });
      } finally {
        setSnapshotSaveOverlaySuppressed(false);
        if (typeof restoreHeadlessUi === "function") {
          restoreHeadlessUi();
        }
      }
    })();
    try {
      return await directSaveInFlightPromise;
    } finally {
      directSaveInFlightPromise = null;
    }
  }

/**
 * Background download mode
 *
 * 요구사항:
 * - 기존 저장 버튼(downloadSnapshot)과 동일한 저장 경로를 써야 한다.
 * - 패널은 first-frame부터 사용자에게 보이지 않아야 한다.
 * - 대신 중앙 상태 모달은 유지해 외부 드라이버/사용자가 진행 상태를 본다.
 * - 성공/실패 후 1~2초 뒤 런타임을 정리해 화면을 원상태로 둔다.
 *
 * 즉 directSave처럼 refresh 판단을 추가하지 않고,
 * "현재 저장 버튼을 백그라운드처럼 실행"하는 orchestrator다.
 */
  async function runBackgroundSnapshotDownload(options) {
    if (backgroundSnapshotSaveInFlightPromise) return backgroundSnapshotSaveInFlightPromise;
    const capabilities =
      typeof getRuntimeCapabilities === "function" ? getRuntimeCapabilities() : null;
    if (capabilities && !capabilities.canSave) return false;
    const cleanupDelay =
      options && typeof options.cleanupDelayMs === "number" ? options.cleanupDelayMs : 1800;
    applySnapshotBackgroundSaveUiHidden();
    backgroundSnapshotSaveInFlightPromise = (async function () {
      clearSearchAdvisorBootRequest();
      return await downloadSnapshot();
    })();
    try {
      const result = await backgroundSnapshotSaveInFlightPromise;
      scheduleSnapshotBackgroundRuntimeCleanup(cleanupDelay);
      return result;
    } catch (error) {
      scheduleSnapshotBackgroundRuntimeCleanup(cleanupDelay);
      throw error;
    } finally {
      backgroundSnapshotSaveInFlightPromise = null;
    }
  }
  /**
 * Build snapshot shell state from a V2 payload
 * Extracts UI state, metadata, and site information from a saved snapshot
 * @param {Object} payload - V2 payload object
 * @returns {Object} Snapshot shell state with accountLabel, allSites, rows, siteMeta, curMode, curSite, curTab, runtimeVersion, cacheMeta
 * @example
 * const shellState = buildSnapshotShellState(exportPayload);
 * console.log(shellState.accountLabel); // "user@example.com"
 */
  const SNAPSHOT_OFFLINE_DEFAULT_MODE = "all";
  const SNAPSHOT_OFFLINE_DEFAULT_TAB = "overview";
  const SNAPSHOT_TAB_IDS = [
    "overview",
    "daily",
    "queries",
    "pages",
    "crawl",
    "backlink",
    "diagnosis",
    "insight",
  ];

  function getSnapshotPrimaryAccount(payload) {
    if (!payload || !payload.__meta || !payload.accounts || typeof payload.accounts !== "object") {
      return null;
    }
    const accountKeys = Object.keys(payload.accounts);
    if (!accountKeys.length) return null;
    const accountLabel = accountKeys[0];
    return {
      accountLabel,
      account: payload.accounts[accountLabel] || null,
    };
  }

  function extractSnapshotSourceState(sourcePayload) {
    const primaryAccount = getSnapshotPrimaryAccount(sourcePayload);
    if (primaryAccount) {
      const account = primaryAccount.account || {};
      return {
        savedAt:
          sourcePayload.__meta && Object.prototype.hasOwnProperty.call(sourcePayload.__meta, "savedAt")
            ? sourcePayload.__meta.savedAt
            : sourcePayload.savedAt || null,
        accountLabel: primaryAccount.accountLabel || "",
        accountEncId: account.encId || "unknown",
        generatorVersion:
          (sourcePayload.__meta && sourcePayload.__meta.generatorVersion) || "unknown",
        exportFormat:
          (sourcePayload.__meta && sourcePayload.__meta.exportFormat) || "snapshot-v2",
        allSites: Array.isArray(account.sites) ? account.sites : [],
        summaryRows: Array.isArray(sourcePayload.summaryRows) ? sourcePayload.summaryRows : [],
        dataBySite:
          account.dataBySite && typeof account.dataBySite === "object" ? account.dataBySite : {},
        siteMeta:
          account.siteMeta && typeof account.siteMeta === "object" ? account.siteMeta : {},
        mergedMeta: Object.prototype.hasOwnProperty.call(sourcePayload, "mergedMeta")
          ? sourcePayload.mergedMeta
          : null,
        curMode: SNAPSHOT_OFFLINE_DEFAULT_MODE,
        curSite:
          sourcePayload.ui && typeof sourcePayload.ui.curSite === "string"
            ? sourcePayload.ui.curSite
            : null,
        allSitesPeriodDays:
          sourcePayload.ui && typeof sourcePayload.ui.allSitesPeriodDays !== "undefined"
            ? sourcePayload.ui.allSitesPeriodDays
            : 90,
        curTab: SNAPSHOT_OFFLINE_DEFAULT_TAB,
      };
    }

    const legacyPayload = sourcePayload && typeof sourcePayload === "object" ? sourcePayload : {};
    return {
      savedAt:
        Object.prototype.hasOwnProperty.call(legacyPayload, "savedAt")
          ? legacyPayload.savedAt
          : null,
      accountLabel: legacyPayload.accountLabel || "",
      accountEncId: legacyPayload.accountEncId || legacyPayload.encId || "unknown",
      generatorVersion:
        legacyPayload.generatorVersion ||
        (legacyPayload.__meta && legacyPayload.__meta.generatorVersion) ||
        "unknown",
      exportFormat:
        legacyPayload.exportFormat ||
        (legacyPayload.__meta && legacyPayload.__meta.exportFormat) ||
        null,
      allSites: Array.isArray(legacyPayload.allSites) ? legacyPayload.allSites : [],
      summaryRows: Array.isArray(legacyPayload.summaryRows) ? legacyPayload.summaryRows : [],
      dataBySite:
        legacyPayload.dataBySite && typeof legacyPayload.dataBySite === "object"
          ? legacyPayload.dataBySite
          : {},
      siteMeta:
        legacyPayload.siteMeta && typeof legacyPayload.siteMeta === "object"
          ? legacyPayload.siteMeta
          : {},
      mergedMeta: Object.prototype.hasOwnProperty.call(legacyPayload, "mergedMeta")
        ? legacyPayload.mergedMeta
        : null,
      curMode:
        legacyPayload.curMode === "site" ? "site" : SNAPSHOT_OFFLINE_DEFAULT_MODE,
      curSite: typeof legacyPayload.curSite === "string" ? legacyPayload.curSite : null,
      allSitesPeriodDays:
        typeof legacyPayload.allSitesPeriodDays !== "undefined"
          ? legacyPayload.allSitesPeriodDays
          : 90,
      curTab:
        SNAPSHOT_TAB_IDS.indexOf(legacyPayload.curTab) !== -1
          ? legacyPayload.curTab
          : SNAPSHOT_OFFLINE_DEFAULT_TAB,
    };
  }

  function normalizeSnapshotPayloadForOfflineShell(sourcePayload) {
    const sourceState = extractSnapshotSourceState(sourcePayload);
    const legacyBasePayload =
      sourcePayload &&
      typeof sourcePayload === "object" &&
      !(sourcePayload.__meta && sourcePayload.accounts)
        ? Object.assign({}, sourcePayload)
        : {};
    return Object.assign(legacyBasePayload, {
      savedAt: sourceState.savedAt,
      accountLabel: sourceState.accountLabel,
      accountEncId: sourceState.accountEncId,
      generatorVersion: sourceState.generatorVersion,
      exportFormat: sourceState.exportFormat || "snapshot-v2",
      allSites: sourceState.allSites,
      summaryRows: sourceState.summaryRows,
      dataBySite: sourceState.dataBySite,
      siteMeta: sourceState.siteMeta,
      mergedMeta: sourceState.mergedMeta,
      allSitesPeriodDays: normalizeAllSitesPeriodDays(sourceState.allSitesPeriodDays),
      curMode: SNAPSHOT_OFFLINE_DEFAULT_MODE,
      curSite: sourceState.curSite,
      curTab: SNAPSHOT_OFFLINE_DEFAULT_TAB,
    });
  }

  function buildSnapshotShellState(payload) {
    // Snapshot shell state는 offline payload를
    // live와 유사한 UI 상태 shape로 평탄화하는 계약이다.
    // 여기서 정의되는 필드는 saved HTML 재오픈과 shell/API parity의 기준이므로
    // 임의 삭제/이름 변경을 매우 신중하게 다뤄야 한다.
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
      curMode = "all";
      curSite = payload.ui?.curSite || null;
      curTab = "overview";
      allSitesPeriodDays = payload.ui?.allSitesPeriodDays;
    } else {
      // V2 포맷이 아닌 경우 빈 값 반환
      accountLabel = "";
      allSites = [];
      dataBySite = {};
      summaryRows = [];
      siteMeta = {};
      savedAt = null;
      curMode = "all";
      curSite = null;
      curTab = "overview";
      allSitesPeriodDays = payload.allSitesPeriodDays;
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
      mergedMeta: Object.prototype.hasOwnProperty.call(payload || {}, "mergedMeta")
        ? payload.mergedMeta
        : null,
      curMode: curMode === "site" ? "site" : "all",
      curSite:
        typeof curSite === "string"
          ? curSite
          : (Array.isArray(allSites) && allSites[0]) || null,
      curTab: snapshotTabIds.indexOf(curTab) !== -1
        ? curTab
        : "overview",
      allSitesPeriodDays: normalizeAllSitesPeriodDays(allSitesPeriodDays),
      runtimeVersion:
        window.__SEARCHADVISOR_RUNTIME_VERSION__ ||
        payload.generatorVersion ||
        "snapshot",
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

  /**
 * Render the all-sites view inside saved snapshot HTML without live network fetches.
 * Uses the embedded EXPORT_PAYLOAD rows/dataBySite only.
 * @returns {void}
 */
  function renderSnapshotAllSites() {
    // 저장본 전체현황용 thin wrapper.
    // 장기적으로는 live 전체현황 UI 정본(10-all-sites-view.js)과 parity를
    // 더 높여 snapshot 전용 표현 로직을 줄이는 방향으로 유지한다.
    if (!bdEl) return;

    const payloadRows =
      typeof window !== "undefined" &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__ &&
      Array.isArray(window.__SEARCHADVISOR_EXPORT_PAYLOAD__.summaryRows)
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__.summaryRows
        : [];
    const payloadDataBySite =
      typeof window !== "undefined" &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__ &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__.dataBySite &&
      typeof window.__SEARCHADVISOR_EXPORT_PAYLOAD__.dataBySite === "object"
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__.dataBySite
        : {};

    const rows = (Array.isArray(payloadRows) && payloadRows.length
      ? payloadRows.slice()
      : (Array.isArray(allSites) ? allSites : []).map(function (site) {
          return buildSiteSummaryRow(site, payloadDataBySite[site] || null);
        })
    ).sort(function (a, b) {
      return (b.totalC || 0) - (a.totalC || 0);
    });

    window.__sadvRows = rows;
    if (typeof buildCombo === "function") buildCombo(rows);

    if (!rows.length) {
      bdEl.innerHTML =
        '<div style="padding:18px;border:1px solid rgba(255,212,0,0.18);background:#171717;color:#f4f4f4">저장된 사이트 데이터가 없습니다.</div>';
      return;
    }

    const wrap =
      typeof buildAllSitesDisplayWrap === "function"
        ? buildAllSitesDisplayWrap(rows)
        : document.createElement("div");
  bdEl.innerHTML = "";
  bdEl.appendChild(wrap);
}

// Phase 2 helper packaging:
// saved HTML 직렬화가 helper 하나씩 흩어져 있으면 새 helper 추가 때 allowlist 누락 회귀가
// 반복되기 쉽다. 그래서 dependency 성격이 같은 helper를 pack 단위로 묶고,
// 직렬화 순서도 pack 순서로 고정한다.
const SNAPSHOT_SHARED_PUBLIC_ENTRY_HELPERS = [setRuntimePublicApi, clearRuntimePublicApi];

function createSnapshotPublicFacade(snapshotApi) {
  return {
    getState: snapshotApi.getState,
    getCapabilities: snapshotApi.getCapabilities,
    getSaveStatus: snapshotApi.getSaveStatus,
    isReady: snapshotApi.isReady,
    waitUntilReady: snapshotApi.waitUntilReady,
    subscribe: snapshotApi.subscribe,
    subscribeSaveStatus: snapshotApi.subscribeSaveStatus,
    switchMode: snapshotApi.switchMode,
    setSite: snapshotApi.setSite,
    switchSite: snapshotApi.switchSite,
    setTab: snapshotApi.setTab,
    directSave: snapshotApi.directSave,
    loadAndDirectSaveHeadless: snapshotApi.loadAndDirectSaveHeadless,
    refresh: snapshotApi.refresh,
    download: snapshotApi.download,
    close: snapshotApi.close,
  };
}

function publishSnapshotRuntimeApis(snapshotApi) {
  if (typeof window !== "undefined") {
    window.__SEARCHADVISOR_SNAPSHOT_API__ = snapshotApi;
  }
  const publicApi = createSnapshotPublicFacade(snapshotApi);
  if (typeof setRuntimePublicApi === "function") {
    setRuntimePublicApi(publicApi);
  } else if (typeof window !== "undefined") {
    window.__sadvApi = publicApi;
  }
  return {
    snapshotApi: snapshotApi,
    publicApi: publicApi,
  };
}

// Phase 2 Workstream C:
// saved bootstrap에서 가장 자주 흔들리던 지점은 "payload/state 복원 -> combo/selection 복원 ->
// 초기 렌더 -> 렌더 후 후처리"가 한 블록에 뭉쳐 있던 부분이다.
// 이 helper들은 switchMode(INITIAL_MODE) 호출 자체는 감추지 않고, 그 앞뒤의 boot 책임만 분리한다.
// 이유:
// - switchMode는 실제 렌더/부수효과 진입점이라 여기까지 helper 안으로 숨기면 디버깅이 어려워진다.
// - 반면 기간 복원, canonical rows 준비, combo/selection 복원, 렌더 후 finalize는 boot 책임으로
//   묶는 편이 saved bootstrap slim 방향과 잘 맞는다.
// - 새 helper를 추가할 때는 반드시 SNAPSHOT_RUNTIME_BOOT_HELPERS와
//   buildSnapshotSerializedHelperSection()를 같이 갱신해야 한다.
function restoreSnapshotUiBootState(initialMode) {
  const cachedUi = getCachedUiState();
  if (cachedUi && typeof cachedUi.allSitesPeriodDays !== "undefined") {
    allSitesPeriodDays = normalizeAllSitesPeriodDays(cachedUi.allSitesPeriodDays);
  } else {
    allSitesPeriodDays = normalizeAllSitesPeriodDays(
      EXPORT_PAYLOAD.ui && typeof EXPORT_PAYLOAD.ui.allSitesPeriodDays !== "undefined"
        ? EXPORT_PAYLOAD.ui.allSitesPeriodDays
        : EXPORT_PAYLOAD.allSitesPeriodDays
    );
  }
  assignColors();
  window.__sadvRows = (EXPORT_PAYLOAD.summaryRows || []).filter(function (row) {
    return row && allSites.includes(row.site);
  });
  ensureCurrentSite();
  buildCombo(window.__sadvRows.length ? window.__sadvRows : null);
  if (curSite) setComboSite(curSite);
  setAllSitesLabel();
  return initialMode;
}

function finalizeSnapshotUiBoot() {
  bindSnapshotAllCardLinks();
  applySnapshotReportDecorations();
  notifySnapshotShellState();
}

const SNAPSHOT_RUNTIME_BOOT_HELPERS = [
  createSnapshotPublicFacade,
  publishSnapshotRuntimeApis,
  restoreSnapshotUiBootState,
  finalizeSnapshotUiBoot,
];

const SNAPSHOT_ALL_SITES_HELPER_PACK = [
  getAllSitesSelectionState,
  getAllSitesCanonicalRows,
  setAllSitesCanonicalRows,
  setAllSitesSelectedSite,
];

const SNAPSHOT_UI_CONTROLS_HELPER_PACK = [
  getUiControlsSelectionState,
  applyUiControlsMode,
  applyUiControlsSite,
  applyUiControlsTab,
];

const SNAPSHOT_SHELL_NODE_IDS = ["sadv-header", "sadv-mode-bar", "sadv-site-bar", "sadv-tabs"];

function serializeSnapshotHelperPack(helperPack) {
  return helperPack
    .filter(function (fn) {
      return typeof fn === "function";
    })
    .map(function (fn) {
      return fn.toString();
    })
    .join("\n");
}

function buildSnapshotSerializedHelperSection() {
  return [
    buildRenderers.toString(),
    assignColors.toString(),
    [
      "// Shared public entry seam:",
      "// Phase 2에서는 live/saved가 같은 public facade(window.__sadvApi)를",
      "// 같은 helper를 통해 게시/해제하도록 수렴시킨다.",
      serializeSnapshotHelperPack(SNAPSHOT_SHARED_PUBLIC_ENTRY_HELPERS),
    ].join("\n"),
    [
      "// Snapshot runtime boot helpers:",
      "// snapshot richer API 생성과 public facade publish를 분리해",
      "// bootstrap 책임을 \"state/provider wiring\" 쪽으로 더 좁힌다.",
      serializeSnapshotHelperPack(SNAPSHOT_RUNTIME_BOOT_HELPERS),
    ].join("\n"),
    [
      "// All-sites local helper contract:",
      "// 10-all-sites-view.js는 canonical rows read/write와 card-selection을",
      "// local helper로 감싸고 있으므로, saved HTML도 이 helper들을 먼저",
      "// serialize해야 renderAllSites/buildAllSitesDisplayWrap 경로가 깨지지 않는다.",
      serializeSnapshotHelperPack(SNAPSHOT_ALL_SITES_HELPER_PACK),
    ].join("\n"),
    [
      "// Shared UI controls helper contract:",
      "// 09-ui-controls.js가 semantic selection helpers를 통해 mode/site/tab",
      "// interaction을 공통화하고 있으므로, saved HTML 직렬화도 이 helper들을",
      "// 의존 함수들보다 먼저 같이 실어야 한다.",
      "// live는 번들 전체가 한 스코프에 있지만, saved는 allowlist에 넣은 함수만",
      "// 포함되므로 여기서 빠지면 saved-only is-not-defined 회귀가 생긴다.",
      serializeSnapshotHelperPack(SNAPSHOT_UI_CONTROLS_HELPER_PACK),
    ].join("\n"),
  ].join("\n");
}

/**
 * Build standalone HTML snapshot string with embedded payload
 * Creates a complete HTML document with the SearchAdvisor UI and data
 * @param {Date} savedAt - Timestamp when snapshot was saved
 * @param {Object} payload - V2 export payload with all data
 * @returns {string} Complete HTML document string
 * @example
 * const html = buildSnapshotHtml(new Date(), exportPayload);
 * document.body.innerHTML = html;
 * @see {injectSnapshotReactShell}
 */
  function buildSnapshotHtml(savedAt, payload) {
    const clone = p.cloneNode(true);
    clone
      .querySelectorAll(
        '#sadv-react-shell-host,#sadv-react-shell-root,#sadv-react-portal-root,[data-sadvx="snapshot-shell"],[data-sadvx-action="top"]',
      )
      .forEach(function (node) {
        node.remove();
      });
    clone.style.setProperty("display", "flex");
    clone.style.setProperty("visibility", "visible");
    clone.style.setProperty("opacity", "1");
    clone.style.removeProperty("transform");
    clone.style.removeProperty("pointer-events");
    clone.style.removeProperty("background");
    clone.style.removeProperty("border-left-color");
    delete clone.dataset.sadvBootHidden;
    delete clone.dataset.sadvSaveHidden;
    delete clone.dataset.sadvPrevVisibility;
    delete clone.dataset.sadvPrevPointerEvents;
    delete clone.dataset.sadvPrevBackground;
    delete clone.dataset.sadvPrevBorderLeftColor;
    const savedLabel = stampLabel(savedAt);

    // Handle V2 format for UI state
    let curMode, curSite, curTab, allSites, allSitesPeriodDays;
    if (payload.__meta && payload.accounts) {
      // V2 format
      curMode = "all";
      curSite = payload.ui?.curSite || null;
      curTab = "overview";
      allSitesPeriodDays = normalizeAllSitesPeriodDays(payload.ui?.allSitesPeriodDays);
      const accountKeys = Object.keys(payload.accounts);
      allSites = accountKeys.length > 0 ? (payload.accounts[accountKeys[0]]?.sites || []) : [];
    } else {
      // V2 포맷이 아닌 경우 기본값 사용
      curMode = "all";
      curSite = null;
      curTab = "overview";
      allSitesPeriodDays = normalizeAllSitesPeriodDays(payload.allSitesPeriodDays);
      allSites = [];
    }

    const modeLabel = curMode === "site" ? "\uc0ac\uc774\ud2b8\ubcc4" : "\uc804\uccb4\ud604\ud669";
    const activeTab = TABS.find(function (t) {
      return t.id === curTab;
    });
    const activeTabLabel = activeTab ? activeTab.label : modeLabel;
    const siteLabel =
      curMode === "site" && curSite
        ? curSite.replace(/^https?:\/\//, "")
        : allSites.length + "\uac1c \uc0ac\uc774\ud2b8";
    const topRow = clone.querySelector("#sadv-header > div");
    const siteLabelEl = clone.querySelector("#sadv-site-label");
    const comboWrap = clone.querySelector("#sadv-combo-wrap");
    if (comboWrap) comboWrap.classList.remove("open");
    // 저장 직전 라이브 패널은 renderTab() 경로에서 본문 id를
    // `sadv-tabpanel`로 바꿔둘 수 있다.
    // 저장본 bootstrap/injection 계약은 여전히 `#sadv-bd`를 anchor로 보기 때문에,
    // export 시점에는 둘 중 어느 상태든 받아서 `sadv-bd`로 정규화한다.
    // 이걸 안 하면 현재 모드/탭 상태에 따라 간헐적으로
    // "snapshot panel not found"가 발생할 수 있다.
    const snapshotBodyEl = clone.querySelector("#sadv-bd, #sadv-tabpanel");
    if (snapshotBodyEl && snapshotBodyEl.id !== "sadv-bd") {
      snapshotBodyEl.id = "sadv-bd";
    }
    if (snapshotBodyEl && snapshotBodyEl.parentNode) {
      const reactShellHost = document.createElement("div");
      reactShellHost.id = "sadv-react-shell-host";
      snapshotBodyEl.parentNode.insertBefore(reactShellHost, snapshotBodyEl);
    }
    if (siteLabelEl) {
      siteLabelEl.innerHTML = `<span>${escHtml(siteLabel)}</span><span style="display:inline-flex;align-items:center;padding:2px 7px;border-radius:999px;border:1px solid ${T.accentSoftBorderStrong};color:${T.accentSoftText};background:${T.warmDarkBg}">${escHtml(activeTabLabel)}</span>`;
    }
    ["sadv-refresh-btn", "sadv-save-btn", "sadv-x"].forEach(function (id) {
      const el = clone.querySelector("#" + id);
      if (el) el.remove();
    });
    if (topRow && topRow.lastElementChild) {
      const meta = document.createElement("div");
      meta.style.cssText =
        "display:flex;align-items:center;padding:6px 10px;border-radius:999px;border:1px solid " + T.accentSoftBorder + ";color:" + T.accentSoftText + ";background:" + T.warmDarkBg + ";font-size:10px;font-weight:800";
      meta.textContent = "Saved " + savedLabel;
      topRow.lastElementChild.replaceWith(meta);
    }
    const exportPayloadJson = stringifyForInlineJson(payload);
    const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escHtml("SearchAdvisor Snapshot - " + siteLabel)}</title>
  <style>
    html,body{margin:0;padding:0;background:#050505;color:#fff7dd;font-family:"IBM Plex Sans KR","IBM Plex Sans",Pretendard,system-ui,sans-serif}
    body{padding:28px 18px 40px;display:flex;flex-direction:column;align-items:center}
    a{color:#ffd400}
    :root{--snapshot-panel-width:520px}
    .snapshot-shell{
      width:min(100%,var(--snapshot-panel-width));
      box-sizing:border-box;
    }
    .snapshot-meta{
      width:100%;
      box-sizing:border-box;
      margin:0 0 12px;
      padding:10px 12px;
      border:1px solid #4a3b00;
      border-radius:20px;
      background:
        radial-gradient(circle at top right, rgba(255,122,0,.12), transparent 34%),
        linear-gradient(180deg, rgba(18,13,8,.98), rgba(8,8,8,.98));
      box-shadow:0 26px 60px rgba(0,0,0,.3);
      overflow:hidden;
    }
    .snapshot-meta-details{display:block}
    .snapshot-meta-details[open]{padding-bottom:2px}
    .snapshot-meta-summary{
      list-style:none;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      cursor:pointer;
      user-select:none;
      outline:none;
    }
    .snapshot-meta-summary::-webkit-details-marker{display:none}
    .snapshot-meta-summary::after{
      content:"\uba54\ud0c0 \ubcf4\uae30";
      flex-shrink:0;
      padding:4px 9px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.1);
      background:rgba(255,255,255,.03);
      font-size:10px;
      font-weight:700;
      line-height:1;
      color:#8fb4d6;
    }
    .snapshot-meta-details[open] .snapshot-meta-summary::after{content:"\uba54\ud0c0 \uc811\uae30"}
    .snapshot-meta-title{font-size:13px;font-weight:800;line-height:1.2;color:#fff8df}
    .snapshot-meta-copy{margin-top:6px;font-size:11px;line-height:1.7;color:#d7bf78}
    .snapshot-shell>#sadv-p{
      position:relative !important;
      top:auto !important;
      left:auto !important;
      right:auto !important;
      width:100% !important;
      max-width:none !important;
      box-sizing:border-box !important;
      height:auto !important;
      margin:0 !important;
      border:1px solid #4a3b00 !important;
      border-radius:20px !important;
      overflow:hidden !important;
      box-shadow:0 26px 60px rgba(0,0,0,.3) !important;
    }
    #sadv-bd{
      overflow:visible !important;
      max-height:none !important;
      height:auto !important;
    }
    .sadv-snapshot-combo-drop{
      position:fixed !important;
      z-index:2147483646 !important;
      margin:0 !important;
    }
    @media (max-width: 640px){
      body{
        padding:16px 12px 28px;
      }
      .snapshot-shell{
        width:100%;
      }
      .snapshot-meta{
        margin-bottom:10px;
        padding:10px 12px;
        border-radius:16px;
      }
      .snapshot-shell>#sadv-p{
        border-radius:16px !important;
      }
      #sadv-header{
        padding:16px 18px 10px 18px !important;
      }
      #sadv-bd{
        padding-left:12px !important;
        padding-right:12px !important;
      }
    }
  </style>
</head>
<body>
  <div class="snapshot-shell">
    <div class="snapshot-meta">
      <details class="snapshot-meta-details">
        <summary class="snapshot-meta-summary">
          <span class="snapshot-meta-title">SearchAdvisor Snapshot</span>
        </summary>
        <div class="snapshot-meta-copy">\uc800\uc7a5 \uc2dc\uac01: ${escHtml(savedLabel)}<br>\ud504\ub85c\uadf8\ub7a8 \ubc84\uc804: ${escHtml((window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot"))}</div>
      </details>
    </div>
    ${clone.outerHTML}
  </div>
  <script>
    // <!-- SADV_PAYLOAD_START -->
    const EXPORT_PAYLOAD_RAW = ${exportPayloadJson};
    const ALL_SITES_PERIOD_OPTIONS = ${JSON.stringify(ALL_SITES_PERIOD_OPTIONS)};
    const SNAPSHOT_OFFLINE_DEFAULT_MODE = ${JSON.stringify(SNAPSHOT_OFFLINE_DEFAULT_MODE)};
    const SNAPSHOT_OFFLINE_DEFAULT_TAB = ${JSON.stringify(SNAPSHOT_OFFLINE_DEFAULT_TAB)};
    const SNAPSHOT_TAB_IDS = ${JSON.stringify(SNAPSHOT_TAB_IDS)};
    const getSnapshotPrimaryAccount = ${getSnapshotPrimaryAccount.toString()};
    const extractSnapshotSourceState = ${extractSnapshotSourceState.toString()};
    const normalizeSnapshotPayloadForOfflineShell = ${normalizeSnapshotPayloadForOfflineShell.toString()};
    // Normalize the active source payload into the legacy-compatible shell payload
    // that the reopened saved HTML currently consumes.
    const EXPORT_PAYLOAD = normalizeSnapshotPayloadForOfflineShell(EXPORT_PAYLOAD_RAW);
    // <!-- SADV_PAYLOAD_END -->
    window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = EXPORT_PAYLOAD;
    const SITE_META_MAP = EXPORT_PAYLOAD.siteMeta || {};
    const MERGED_META = EXPORT_PAYLOAD.mergedMeta || null;
    var snapshotShellMetaState = {
      siteMeta: SITE_META_MAP,
      mergedMeta: MERGED_META,
    };
    function setSnapshotMetaState(state) {
      snapshotShellMetaState = {
        siteMeta:
          state && state.siteMeta
            ? state.siteMeta
            : SITE_META_MAP,
        mergedMeta:
          state && Object.prototype.hasOwnProperty.call(state, "mergedMeta")
            ? state.mergedMeta
            : MERGED_META,
      };
      if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    }
    function getSiteMetaMap() {
      return snapshotShellMetaState && snapshotShellMetaState.siteMeta
        ? snapshotShellMetaState.siteMeta
        : SITE_META_MAP;
    }
    function getMergedMetaState() {
      return snapshotShellMetaState ? snapshotShellMetaState.mergedMeta : MERGED_META;
    }
    const FIELD_FAILURE_RETRY_MS = 5 * 60 * 1000;
    function hasSuccessfulDiagnosisMetaSnapshot(data) {
      return !!(
        data &&
        ((data.diagnosisMeta && data.diagnosisMeta.code === 0 && data.diagnosisMetaRange) ||
          data.diagnosisMetaFetchState === "success")
      );
    }
    function hasRecentDiagnosisMetaFailure(data, cooldownMs = FIELD_FAILURE_RETRY_MS) {
      return !!(
        data &&
        data.diagnosisMetaFetchState === "failure" &&
        typeof data.diagnosisMetaFetchedAt === "number" &&
        Date.now() - data.diagnosisMetaFetchedAt < cooldownMs
      );
    }
    function hasDiagnosisMetaSnapshot(data) {
      return hasSuccessfulDiagnosisMetaSnapshot(data) || hasRecentDiagnosisMetaFailure(data);
    }
    function getSiteShortName(a) {
      const s = a ? getSiteMetaMap()[a] || null : null;
      const f = s ? (s.displayLabel || s.label || s.shortName || "").trim() : "";
      return f || (a ? a.replace(/^https?:\\/\\//, "") : "\uc0ac\uc774\ud2b8 \uc120\ud0dd");
    }
    function getSiteLabel(a) {
      if (!a) return "\uc0ac\uc774\ud2b8 \uc120\ud0dd";
      const s = getSiteMetaMap()[a] || null;
      const f = s ? (s.displayLabel || s.label || s.shortName || "").trim() : "";
      return f || getSiteShortName(a);
    }
    function isMergedReport() {
      return !!getMergedMetaState();
    }
    function fmtDateTime(value) {
      if (!value) return "";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0") +
        " " +
        String(d.getHours()).padStart(2, "0") +
        ":" +
        String(d.getMinutes()).padStart(2, "0") +
        ":" +
        String(d.getSeconds()).padStart(2, "0")
      );
    }
    function buildDefaultReportDecoration() {
      const mergedMeta = getMergedMetaState();
      if (!mergedMeta || !mergedMeta.isMerged) return null;
      const siteCount = Array.isArray(allSites) ? allSites.length : 0;
      const naverIds = Array.isArray(mergedMeta.naverIds) ? mergedMeta.naverIds.filter(Boolean) : [];
      const fileNames = Array.isArray(mergedMeta.fileNames) ? mergedMeta.fileNames.filter(Boolean) : [];
      const snapshotLines = [
        "Saved at: " + fmtDateTime(EXPORT_PAYLOAD.savedAt || ""),
        "Merged accounts: " + naverIds.length + " / sites: " + siteCount,
      ];
      if (fileNames.length) snapshotLines.push("Sources: " + fileNames.join(", "));
      return {
        title: "SearchAdvisor Merged Report - " + siteCount + " sites",
        snapshotTitle: "SearchAdvisor Merged Report",
        snapshotLines,
        accountBadge: "MERGED " + naverIds.length + " IDs",
        accountTitle: naverIds.join(", "),
        siteStatus: siteCount + " sites loaded",
        siteSummary: "All " + siteCount + " sites sorted by clicks",
        currentSite: curMode === "site" ? curSite || "" : "",
      };
    }
    function applySnapshotReportDecorations(decoration) {
      const patch = decoration || buildDefaultReportDecoration();
      if (!patch) return;
      if (patch.title) document.title = patch.title;
      const snapshotTitleEl = document.querySelector(".snapshot-meta-title");
      if (snapshotTitleEl && patch.snapshotTitle) snapshotTitleEl.textContent = patch.snapshotTitle;
      const snapshotCopyEl = document.querySelector(".snapshot-meta-copy");
      if (snapshotCopyEl && Array.isArray(patch.snapshotLines)) {
        snapshotCopyEl.replaceChildren();
        patch.snapshotLines.forEach(function (line, index) {
          if (index > 0) snapshotCopyEl.appendChild(document.createElement("br"));
          snapshotCopyEl.appendChild(document.createTextNode(String(line)));
        });
      }
      const accountBadgeEl = document.getElementById("sadv-account-badge");
      if (accountBadgeEl && patch.accountBadge) {
        accountBadgeEl.textContent = patch.accountBadge;
        accountBadgeEl.title = patch.accountTitle || "";
      }
      const siteLabelEl = document.querySelector("#sadv-site-label span");
      if (siteLabelEl && patch.siteStatus) siteLabelEl.textContent = patch.siteStatus;
      const comboLabelEl = document.getElementById("sadv-combo-label");
      if (comboLabelEl && patch.currentSite) comboLabelEl.textContent = getSiteLabel(patch.currentSite);
      const statusTextEl = document.querySelector('[data-sadvx="status-text"] span');
      if (statusTextEl && patch.siteStatus) statusTextEl.textContent = patch.siteStatus;
      const currentSiteEl = document.querySelector('[data-sadvx="current-site"]');
      if (currentSiteEl) {
        currentSiteEl.textContent = patch.currentSite ? getSiteLabel(patch.currentSite) : "Select site";
      }
      const siteSummaryEl = document.querySelector('[data-sadvx="site-summary"]');
      if (siteSummaryEl && patch.siteSummary) siteSummaryEl.textContent = patch.siteSummary;
      document.querySelectorAll("[data-sadvx-site]").forEach(function (button) {
        const site = button.getAttribute("data-sadvx-site") || "";
        const labelWrap = button.children[1];
        const titleEl = labelWrap ? labelWrap.firstElementChild : null;
        if (titleEl) titleEl.textContent = getSiteLabel(site);
        if (patch.currentSite) button.dataset.active = site === patch.currentSite ? "true" : "false";
      });
    }
    window.__SEARCHADVISOR_APPLY_REPORT_DECORATIONS__ = applySnapshotReportDecorations;
    window.__SEARCHADVISOR_PAYLOAD_CONTRACT__ = {
      version: "20260314-payload-contract-v1",
      mode: "saved-html",
      getSiteMetaMap,
      getMergedMetaState,
      getSiteShortName,
      getSiteLabel,
      applyReportDecorations: applySnapshotReportDecorations,
    };
    // ---------------------------------------------------------------------
    // Snapshot bootstrap contract
    // ---------------------------------------------------------------------
    // Every symbol referenced by serialized renderers/helpers below must be
    // explicitly declared inside this offline runtime. Do not assume access to
    // the live panel closure.
    //
    // When adding/changing renderer dependencies, update all three together:
    //   1) this bootstrap block
    //   2) scripts/verify_snapshot_contract.js
    //   3) src/app/main/SNAPSHOT_EXPORT_CONTRACT.md
    //
    // Known past regressions:
    //   - missing isFiniteValue binding -> ReferenceError in sparkline()
    //   - missing S style map          -> ReferenceError in overview renderer
    //
    // 추가 원칙:
    // - 이 bootstrap block은 UI를 새로 만드는 곳이 아니다.
    // - payload/state 주입, read-only API, offline alias 복구처럼
    //   snapshot 특수사항만 다뤄야 한다.
    // ---------------------------------------------------------------------
    const CONFIG = ${JSON.stringify(CONFIG)};
    const ICONS = ${JSON.stringify(ICONS)};
    const C = ${JSON.stringify(C)};
    const S = ${JSON.stringify(S)};
    const COLORS = ${JSON.stringify(COLORS)};
    const DOW = ${JSON.stringify(DOW)};
    const PNL = ${JSON.stringify(PNL)};
    const T = ${JSON.stringify(T)};
    const ERROR_MESSAGES = ${JSON.stringify(ERROR_MESSAGES)};
    const CHART_W = PNL - 32;
    const TABS = ${JSON.stringify(TABS)};
    let TIP = null;
    const fmt = (v) => Number(v).toLocaleString();
    const fmtD = (s) => s ? s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8) : "";
    const fmtB = (s) => s ? s.slice(4, 6) + "/" + s.slice(6, 8) : "";
    ${escHtml.toString()}
    ${normalizeSiteUrl.toString()}
    ${setTrustedSvgMarkup.toString()}
    function sanitizeHTML(dirty) {
      return String(dirty == null ? "" : dirty);
    }
    function __sadvNotify() {}
    // IMPORTANT: every helper referenced by serialized render/chart functions
    // must be embedded here explicitly. The offline snapshot HTML is a
    // self-contained runtime and cannot rely on outer closure helpers from the
    // live panel bundle. A prior regression omitted the isFiniteValue helper,
    // which made sparkline/barchart code throw ReferenceError only inside
    // saved HTML.
    ${tip.toString()}
    ${showTip.toString()}
    ${moveTip.toString()}
    ${hideTip.toString()}
    const isFiniteValue = ${isFiniteValue.toString()};
    ${sparkline.toString()}
    ${barchart.toString()}
    ${xlbl.toString()}
    ${chartCard.toString()}
    ${kpiGrid.toString()}
    ${secTitle.toString()}
    ${ibox.toString()}
    ${ctrBadge.toString()}
    ${hbar.toString()}
    ${st.toString()}
    ${pearson.toString()}
    ${createInlineError.toString()}
    ${createStateCard.toString()}
    ${isSnapshotRuntime.toString()}
    ${isLiveRuntime.toString()}
    ${getRuntimeMode.toString()}
    ${getRuntimeCapabilities.toString()}
    ${getRuntimeShellState.toString()}
    ${getRuntimeRows.toString()}
    ${getRuntimeAllSites.toString()}
    ${getRuntimeAllSitesPeriodDays.toString()}
    ${setRuntimeAllSitesPeriodDays.toString()}
    ${getRuntimeSiteMeta.toString()}
    ${getRuntimeMergedMeta.toString()}
    ${getRuntimeCacheMeta.toString()}
    ${normalizeAllSitesPeriodDays.toString()}
    ${getAllSitesPeriodLabel.toString()}
    ${sliceLogsForPeriod.toString()}
    ${deriveCtrSeries.toString()}
    ${deriveAllSitesPeriodRow.toString()}
    ${deriveAllSitesPeriodRows.toString()}
    ${computeAllSitesPeriodSummary.toString()}
    ${getRuntimeSiteData.toString()}
    ${buildSiteSummaryRow.toString()}
    ${prepareRendererData.toString()}
    ${createOverviewRenderer.toString()}
    ${createDailyRenderer.toString()}
    ${createQueriesRenderer.toString()}
    ${createPagesRenderer.toString()}
    ${createPatternRenderer.toString()}
    ${createCrawlRenderer.toString()}
    ${createBacklinkRenderer.toString()}
    ${createDiagnosisRenderer.toString()}
    ${createInsightRenderer.toString()}
    const RENDERER_REGISTRY = {
      overview: createOverviewRenderer,
      daily: createDailyRenderer,
      queries: createQueriesRenderer,
      urls: createPagesRenderer,
      pages: createPagesRenderer,
      pattern: createPatternRenderer,
      crawl: createCrawlRenderer,
      backlink: createBacklinkRenderer,
      indexed: createDiagnosisRenderer,
      diagnosis: createDiagnosisRenderer,
      insight: createInsightRenderer,
    };
    ${buildSnapshotSerializedHelperSection()}
    ${ensureCurrentSite.toString()}
    ${buildCombo.toString()}
    ${setComboSite.toString()}
    ${buildAllSitesPeriodToolbar.toString()}
    ${buildAllSitesDisplayWrap.toString()}
    ${renderAllSitesFromCanonicalRows.toString()}
    ${renderTab.toString()}
    ${switchMode.toString()}
    ${setAllSitesLabel.toString()}
    ${renderSnapshotAllSites.toString()}
    const renderAllSites = renderSnapshotAllSites;
    ${loadSiteView.toString()}
    async function fetchExposeData(site) {
      return (
        EXPORT_PAYLOAD.dataBySite[site] || {
          expose: null,
          crawl: null,
          backlink: null,
          detailLoaded: false,
        }
      );
    }
    async function fetchSiteData(site) {
      return fetchExposeData(site);
    }
    async function fetchExposeDataBatch(sites) {
      return sites.map(function (site) {
        return {
          status: "fulfilled",
          value:
            EXPORT_PAYLOAD.dataBySite[site] || {
              expose: null,
              crawl: null,
              backlink: null,
              detailLoaded: false,
            },
        };
      });
    }
    let allSites = EXPORT_PAYLOAD.allSites || [];
    const INITIAL_MODE = "all";
    let curMode = null;  // Initialize to null so switchMode() triggers on first call
    let curSite = EXPORT_PAYLOAD.curSite || (allSites[0] || null);
    let curTab = EXPORT_PAYLOAD.curTab || "overview";
    let allSitesPeriodDays = normalizeAllSitesPeriodDays(EXPORT_PAYLOAD.allSitesPeriodDays);
    const SNAPSHOT_SHELL_LISTENERS = new Set();
    function cloneSnapshotShellState() {
      const cacheSavedAtValues = allSites
        .map(function (site) {
          const dataBySite = EXPORT_PAYLOAD.dataBySite && EXPORT_PAYLOAD.dataBySite[site];
          return dataBySite && typeof dataBySite.__cacheSavedAt === "number"
            ? dataBySite.__cacheSavedAt
            : null;
        })
        .filter(function (value) {
          return typeof value === "number";
        });
      const savedAtValue =
        EXPORT_PAYLOAD.savedAt && !Number.isNaN(new Date(EXPORT_PAYLOAD.savedAt).getTime())
          ? new Date(EXPORT_PAYLOAD.savedAt)
          : null;
      const updatedAt = cacheSavedAtValues.length
        ? new Date(Math.max.apply(null, cacheSavedAtValues))
        : savedAtValue;
      return {
        accountLabel: EXPORT_PAYLOAD.accountLabel || "",
        allSites: Array.isArray(allSites) ? allSites.slice() : [],
        rows: Array.isArray(window.__sadvRows) ? window.__sadvRows.slice() : [],
        siteMeta: getSiteMetaMap(),
        mergedMeta: getMergedMetaState(),
        curMode: curMode === "site" ? "site" : "all",
        curSite: typeof curSite === "string" ? curSite : allSites[0] || null,
        curTab: TABS.some(function (tab) {
          return tab.id === curTab;
        })
          ? curTab
          : "overview",
        allSitesPeriodDays: normalizeAllSitesPeriodDays(
          typeof allSitesPeriodDays !== "undefined" ? allSitesPeriodDays : 90
        ),
        runtimeVersion:
          window.__SEARCHADVISOR_RUNTIME_VERSION__ ||
          EXPORT_PAYLOAD.generatorVersion ||
          "snapshot",
        cacheMeta: updatedAt
          ? {
              label: "snapshot",
              updatedAt,
              remainingMs: null,
              sourceCount: allSites.length,
              measuredAt: Date.now(),
            }
          : null,
      };
    }
    function notifySnapshotShellState() {
      const nextState = cloneSnapshotShellState();
      SNAPSHOT_SHELL_LISTENERS.forEach(function (listener) {
        try {
          listener(nextState);
        } catch (e) {
          console.error('[notifySnapshotShellState] Error:', e);
        }
      });
    }
    const SNAPSHOT_UI_STATE_KEY =
      "sadv_snapshot_ui_v1::" +
      String(EXPORT_PAYLOAD.savedAt || "") +
      "::" +
      String(EXPORT_PAYLOAD.curSite || "");
    function lsGet(k) {
      try {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : null;
      } catch (e) {
        return null;
      }
    }
    function lsSet(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {
        console.error('[lsSet] Error:', e);
      }
    }
    function getUiStateCacheKey() {
      return SNAPSHOT_UI_STATE_KEY;
    }
    function getCachedUiState() {
      const cached = lsGet(getUiStateCacheKey());
      if (!cached || typeof cached !== "object") return null;
      const mode = cached.mode === "site" ? "site" : cached.mode === "all" ? "all" : null;
      const tab = typeof cached.tab === "string" ? cached.tab : null;
      const site = typeof cached.site === "string" ? cached.site : null;
      if (!mode && !tab && !site) return null;
      return {
        mode,
        tab,
        site,
        allSitesPeriodDays: normalizeAllSitesPeriodDays(cached.allSitesPeriodDays),
      };
    }
    function setCachedUiState() {
      lsSet(getUiStateCacheKey(), {
        ts: Date.now(),
        mode: curMode,
        tab: curTab,
        site: curSite,
        allSitesPeriodDays: normalizeAllSitesPeriodDays(
          typeof allSitesPeriodDays !== "undefined" ? allSitesPeriodDays : 90
        ),
      });
    }
    const SITE_COLORS_MAP = {};
    const memCache = {};
    let siteViewReqId = 0;
    let allViewReqId = 0;
    const p = document.getElementById("sadv-p");
    const snapshotModeBar = document.getElementById("sadv-mode-bar");
    const snapshotSiteBar = document.getElementById("sadv-site-bar");
    window.__sadvTabsEl = document.getElementById("sadv-tabs"); // Export to global scope
    const snapshotTabsEl = window.__sadvTabsEl;
    const snapshotBdEl = document.getElementById("sadv-bd");
    const snapshotLabelEl = document.getElementById("sadv-site-label");
    const modeBar = snapshotModeBar;
    const siteBar = snapshotSiteBar;
    const tabsEl = snapshotTabsEl;
    const bdEl = snapshotBdEl;
    const labelEl = snapshotLabelEl;
    const snapshotUiReady = !!(p && snapshotModeBar && snapshotSiteBar && snapshotTabsEl && snapshotBdEl && snapshotLabelEl);
    if (!snapshotUiReady) {
      console.error("[Snapshot] Required UI scaffold is incomplete.");
    }
    if (snapshotTabsEl) {
      snapshotTabsEl.innerHTML = TABS.map(function (t) {
        return '<button class="sadv-t' + (t.id === curTab ? " on" : "") + '" data-t="' + t.id + '">' + t.label + "</button>";
      }).join("");
    }
    function setTab(tab) {
      if (!snapshotTabsEl || !tab || tab === curTab) return;
      const t = snapshotTabsEl.querySelector('[data-t="' + tab + '"]');
      if (!t) return;
      curTab = tab;
      snapshotTabsEl.querySelectorAll(".sadv-t").forEach(function (b) {
        b.classList.remove("on");
      });
      t.classList.add("on");
      if (window.__sadvR) renderTab(window.__sadvR);
      setCachedUiState();
      notifySnapshotShellState();
    }
    if (snapshotTabsEl) {
      snapshotTabsEl.addEventListener("click", function (e) {
        const t = e.target.closest("[data-t]");
        if (!t) return;
        setTab(t.dataset.t);
      });
    }
    /**
     * Snapshot combo dropdown layering contract
     * -----------------------------------------
     * Live runtime and saved HTML do not share the exact same stacking context.
     *
     * In saved HTML:
     * - #sadv-bd can visually overlap the combo dropdown if the dropdown remains inside
     *   the header/site-bar DOM flow.
     * - Base panel CSS already defines #sadv-combo-drop with !important rules, so plain
     *   inline style assignment is not strong enough to override its absolute positioning.
     *
     * Therefore snapshot HTML must:
     * 1) detach the dropdown into a top-layer portal under #sadv-p,
     * 2) position it with viewport-based fixed coordinates,
     * 3) write critical layout properties with style.setProperty(..., "important"),
     * 4) retry positioning until the combo button has a non-zero rect,
     * 5) keep close/open/resize/scroll behavior in sync so saved HTML stays usable offline.
     *
     * NOTE:
     * - document.body portal can solve layering, but it breaks #sadv-p CSS variable inheritance
     *   and causes visual drift from the live panel.
     * - keeping the portal under #sadv-p preserves the original theme tokens while still letting
     *   the dropdown float above #sadv-bd.
     *
     * If this block is changed later, verify against:
     * - saved HTML generated from the latest runtime
     * - site mode > combo open
     * - lower half of the popup using elementFromPoint(...)
     * - visual comparison versus the live panel
     */
    const snapshotComboBtn = document.getElementById("sadv-combo-btn");
    const snapshotComboWrap = document.getElementById("sadv-combo-wrap");
    const snapshotComboDrop = document.getElementById("sadv-combo-drop");
    function scheduleSnapshotComboDropPositionSync(attempt) {
      const tries = typeof attempt === "number" ? attempt : 0;
      if (!snapshotComboBtn || !snapshotComboDrop) return;
      const rect = snapshotComboBtn.getBoundingClientRect();
      if (rect && rect.width >= 40 && rect.height >= 24) {
        syncSnapshotComboDropPosition();
        return;
      }
      if (tries >= 10) return;
      requestAnimationFrame(function () {
        scheduleSnapshotComboDropPositionSync(tries + 1);
      });
    }
    function syncSnapshotComboDropPosition() {
      if (!snapshotComboBtn || !snapshotComboDrop) return;
      const rect = snapshotComboBtn.getBoundingClientRect();
      if (!rect || rect.width < 40 || rect.height < 24) return;
      const maxWidth = Math.max(240, window.innerWidth - 24);
      const width = Math.min(rect.width, maxWidth);
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
      const availableHeight = Math.max(160, Math.floor(window.innerHeight - rect.bottom - 16));
      snapshotComboDrop.style.setProperty("position", "fixed", "important");
      snapshotComboDrop.style.setProperty("top", Math.round(rect.bottom + 2) + "px", "important");
      snapshotComboDrop.style.setProperty("left", Math.round(left) + "px", "important");
      snapshotComboDrop.style.setProperty("right", "auto", "important");
      snapshotComboDrop.style.setProperty("width", Math.round(width) + "px", "important");
      snapshotComboDrop.style.setProperty("max-height", Math.min(420, availableHeight) + "px", "important");
      snapshotComboDrop.style.setProperty("z-index", "2147483646", "important");
      snapshotComboDrop.style.setProperty(
        "display",
        snapshotComboWrap && snapshotComboWrap.classList.contains("open") ? "block" : "none",
        "important"
      );
    }
    function closeSnapshotCombo() {
      if (snapshotComboWrap) {
        snapshotComboWrap.classList.remove("open");
        snapshotComboWrap.setAttribute("aria-expanded", "false");
      }
      if (snapshotComboDrop) snapshotComboDrop.style.setProperty("display", "none", "important");
    }
    if (snapshotComboDrop) {
      snapshotComboDrop.classList.add("sadv-snapshot-combo-drop");
      if (snapshotComboDrop.parentElement !== p) p.appendChild(snapshotComboDrop);
      snapshotComboDrop.style.setProperty("display", "none", "important");
    }
    if (snapshotComboWrap && snapshotComboDrop) {
      const comboWrapObserver = new MutationObserver(function () {
        syncSnapshotComboDropPosition();
      });
      comboWrapObserver.observe(snapshotComboWrap, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
    if (snapshotComboBtn) {
      snapshotComboBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!snapshotComboWrap) return;
        snapshotComboWrap.classList.toggle("open");
        snapshotComboWrap.setAttribute(
          "aria-expanded",
          snapshotComboWrap.classList.contains("open") ? "true" : "false"
        );
        if (snapshotComboWrap.classList.contains("open")) {
          scheduleSnapshotComboDropPositionSync(0);
          setTimeout(function () {
            const inp = document.getElementById("sadv-combo-search");
            if (inp) {
              inp.style.display = "block";
              inp.value = "";
              inp.focus();
              inp.oninput = function () {
                const q = inp.value.toLowerCase();
                document.querySelectorAll(".sadv-combo-item[data-site]").forEach(function (el) {
                  const searchTarget = ((el.dataset.site || "") + " " + getSiteLabel(el.dataset.site || "")).toLowerCase();
                  // Snapshot popup shares the same grid row styling as the live popup.
                  // Re-open filtered rows as grid, not flex, so the offline HTML
                  // keeps the same visual structure as the live panel.
                  el.style.setProperty("display", !q || searchTarget.includes(q) ? "grid" : "none", "important");
                });
                scheduleSnapshotComboDropPositionSync(0);
              };
              scheduleSnapshotComboDropPositionSync(0);
            }
            scheduleSnapshotComboDropPositionSync(0);
          }, 50);
        } else {
          closeSnapshotCombo();
        }
      });
    } else {
      console.warn("[Snapshot] #sadv-combo-btn not found during initialization");
    }
    document.addEventListener("click", function (e) {
      const wrap = document.getElementById("sadv-combo-wrap");
      const drop = document.getElementById("sadv-combo-drop");
      if (wrap && drop && !wrap.contains(e.target) && !drop.contains(e.target)) {
        closeSnapshotCombo();
      }
    });
    if (typeof window !== "undefined") {
      window.addEventListener("resize", function () {
        scheduleSnapshotComboDropPositionSync(0);
      });
      window.addEventListener("scroll", function () {
        if (snapshotComboWrap && snapshotComboWrap.classList.contains("open")) scheduleSnapshotComboDropPositionSync(0);
      }, true);
    }
    if (snapshotModeBar) {
      snapshotModeBar.addEventListener("click", function (e) {
        const m = e.target.closest("[data-m]");
        if (!m) return;
        closeSnapshotCombo();
        switchMode(m.dataset.m);
      });
    }
    function bindSnapshotAllCardLinks() {
      document.querySelectorAll(".sadv-allcard[data-site]").forEach(function (card) {
        if (card.dataset.snapshotBound === "true") return;
        card.dataset.snapshotBound = "true";
        card.setAttribute("tabindex", card.getAttribute("tabindex") || "0");
        card.setAttribute("role", card.getAttribute("role") || "button");
        const openSite = function () {
          const site = card.getAttribute("data-site") || "";
          if (!site) return;
          curSite = site;
          if (typeof setComboSite === "function") setComboSite(site);
          switchMode("site");
        };
        card.addEventListener("click", openSite);
        card.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openSite();
          }
        });
      });
    }
    const snapshotApi = {
      getState: cloneSnapshotShellState,
      getCapabilities: function () {
        return typeof getRuntimeCapabilities === "function"
          ? getRuntimeCapabilities()
          : {
              mode: "snapshot",
              canRefresh: false,
              canSave: false,
              canClose: false,
              isReadOnly: true,
            };
      },
      getSaveStatus: function () {
        return {
          active: false,
          state: "idle",
          phase: null,
          runtimeType: "saved",
          stageLabel: "",
          detail: "",
          startedAt: null,
          updatedAt: Date.now(),
          completedAt: null,
          progress: { done: 0, total: 0, ratio: 0, percent: 0 },
          stats: { success: 0, partial: 0, failed: 0, errors: [] },
          cacheDecision: { neededRefresh: false, reason: null, missingSites: 0, expiredSites: 0 },
          fileName: null,
          site: null,
          error: null,
        };
      },
      isReady: function () {
        return snapshotUiReady;
      },
      waitUntilReady: function () {
        return Promise.resolve(snapshotUiReady);
      },
      subscribe: function (listener) {
        SNAPSHOT_SHELL_LISTENERS.add(listener);
        return function () {
          SNAPSHOT_SHELL_LISTENERS.delete(listener);
        };
      },
      subscribeSaveStatus: function () {
        return function () {};
      },
      switchMode: function (mode) {
        switchMode(mode);
      },
      setSite: function (site) {
        setComboSite(site);
        if (curMode !== "site") switchMode("site");
      },
      switchSite: function (site) {
        // Phase 2 convergence:
        // public facade canonical action은 "site 선택 + site mode 진입"으로 정의한다.
        // 기존 setSite를 그대로 유지해 saved HTML compatibility는 보존하고,
        // switchSite를 추가해 live/saved가 같은 intent 이름을 공유하게 만든다.
        setComboSite(site);
        if (curMode !== "site") switchMode("site");
      },
      setTab: function (tab) {
        setTab(tab);
      },
      setSelectionState: function (patch) {
        // Phase 1 seam:
        // saved runtime도 selection(curMode/curSite/curTab)을 한 entry로 갱신할 수 있게 한다.
        // 아직 완전한 action layer는 아니므로, 기존 switchMode/setComboSite/setTab 경로를
        // 최대한 재사용해 렌더 회귀를 줄인다.
        if (!patch || typeof patch !== "object") return cloneSnapshotShellState();
        if (patch.curMode === "all" || patch.curMode === "site") {
          if (patch.curMode !== curMode) switchMode(patch.curMode);
        }
        if (Object.prototype.hasOwnProperty.call(patch, "curSite")) {
          if (typeof patch.curSite === "string") {
            if ((curMode === "site" || patch.curMode === "site") && patch.curSite !== curSite) {
              setComboSite(patch.curSite);
            } else {
              curSite = patch.curSite;
            }
          } else {
            curSite = null;
          }
        }
        if (Object.prototype.hasOwnProperty.call(patch, "curTab") && typeof patch.curTab === "string") {
          setTab(patch.curTab);
        }
        setCachedUiState();
        notifySnapshotShellState();
        return cloneSnapshotShellState();
      },
      setAllSitesPeriodDays: function (days) {
        if (typeof setAllSitesPeriodDaysState === "function") {
          setAllSitesPeriodDaysState(days);
        } else {
          allSitesPeriodDays = normalizeAllSitesPeriodDays(days);
        }
        setCachedUiState();
        notifySnapshotShellState();
        if (curMode === "all" && typeof renderSnapshotAllSites === "function") {
          renderSnapshotAllSites();
        }
        return normalizeAllSitesPeriodDays(days);
      },
      refresh: function () {
        return false;
      },
      loadAndDirectSaveHeadless: function () {
        return false;
      },
      download: function () {
        return false;
      },
      directSave: function () {
        return false;
      },
      close: function () {
        return false;
      },
    };
    publishSnapshotRuntimeApis(snapshotApi);
    if (snapshotUiReady) {
      restoreSnapshotUiBootState(INITIAL_MODE);
      switchMode(INITIAL_MODE);
      finalizeSnapshotUiBoot();
    }
  <\/script>
</body>
</html>`;
    return html;
  }
  function buildSnapshotShellBootstrapScript() {
    const shellIdsJson = JSON.stringify(SNAPSHOT_SHELL_NODE_IDS);
    return [
      "(function () {",
      '  const host = document.getElementById("sadv-react-shell-host");',
      "  const snapshotApi = window.__SEARCHADVISOR_SNAPSHOT_API__ || null;",
      "  if (!host || !snapshotApi) return;",
      '  host.setAttribute("style", "display:block !important;width:100% !important;flex-shrink:0;");',
      '  let portal = host.querySelector("#sadv-react-portal-root");',
      "  if (!portal) {",
      '    portal = document.createElement("div");',
      '    portal.id = "sadv-react-portal-root";',
      "    host.appendChild(portal);",
      "  }",
      '  let mount = host.querySelector("#sadv-react-shell-root");',
      "  if (!mount) {",
      '    mount = document.createElement("div");',
      '    mount.id = "sadv-react-shell-root";',
      "  }",
      '  mount.setAttribute("data-sadvx", "snapshot-shell");',
      `  const shellIds = ${shellIdsJson};`,
      "  const moved = [];",
      "  shellIds.forEach(function (id) {",
      "    const node = document.getElementById(id);",
      "    if (!node || !node.parentNode) return;",
      "    moved.push({ node: node, parent: node.parentNode, next: node.nextSibling });",
      "    mount.appendChild(node);",
      "  });",
      "  const previousUnmount = window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__;",
      '  if (typeof previousUnmount === "function") {',
      "    try { previousUnmount(); } catch (_) {}",
      "  }",
      '  const hideStyle = document.getElementById("sadv-snapshot-shell-hide");',
      "  if (hideStyle) hideStyle.remove();",
      "  host.replaceChildren(mount);",
      "  host.appendChild(portal);",
      ...buildSnapshotShellUnmountLines(),
      "})();",
    ].join(String.fromCharCode(10));
  }

  function buildSnapshotShellUnmountLines() {
    return [
      "  window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__ = function () {",
      "    moved.forEach(function (entry) {",
      "      if (entry.parent) entry.parent.insertBefore(entry.node, entry.next);",
      "    });",
      "    host.replaceChildren();",
      "    host.appendChild(portal);",
      "    delete window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__;",
      "  };",
    ];
  }
  // Phase 3 Workstream A:
  // buildSnapshotApiCompatScript는 "현재 활성 saved bootstrap 경로"가 아니라
  // saved richer API가 없던 시절을 위한 legacy/dormant compat bridge에 가깝다.
  // 즉 지금 실제 활성 경로는 buildSnapshotHtml() 안의 inline snapshotApi + publishSnapshotRuntimeApis()
  // 쪽이고, 이 함수는 그 경로를 대체하는 정본이 아니다.
  //
  // 그래서 첫 라운드 목표도 동작 변경이 아니라:
  // - compat bridge의 내부 책임을 읽기 가능한 line builder 단위로 나누고
  // - state clone / DOM sync / action fallback / observer wiring 경계를 드러내며
  // - 나중에 "정말 이 bridge를 유지할지/줄일지" 판단하기 쉽게 만드는 데 있다.
  function buildSnapshotApiCompatStateSeedLines() {
    return [
      "  const shellStateSource = window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__ || {};",
      "  const snapshotState = {",
      '    accountLabel: shellStateSource.accountLabel || "",',
      "    allSites: Array.isArray(shellStateSource.allSites) ? shellStateSource.allSites.slice() : [],",
      "    rows: Array.isArray(shellStateSource.rows) ? shellStateSource.rows.slice() : [],",
      '    siteMeta: shellStateSource.siteMeta && typeof shellStateSource.siteMeta === "object" ? shellStateSource.siteMeta : {},',
      '    mergedMeta: Object.prototype.hasOwnProperty.call(shellStateSource, "mergedMeta") ? shellStateSource.mergedMeta : null,',
      '    curMode: shellStateSource.curMode === "site" ? "site" : "all",',
      '    curSite: typeof shellStateSource.curSite === "string" ? shellStateSource.curSite : null,',
      '    curTab: typeof shellStateSource.curTab === "string" ? shellStateSource.curTab : "overview",',
      '    runtimeVersion: shellStateSource.runtimeVersion || EXPORT_PAYLOAD.generatorVersion || "snapshot",',
      "    cacheMeta: shellStateSource.cacheMeta",
      "      ? {",
      '          label: shellStateSource.cacheMeta.label || "snapshot",',
      "          updatedAt: shellStateSource.cacheMeta.updatedAt ? new Date(shellStateSource.cacheMeta.updatedAt) : null,",
      '          remainingMs: typeof shellStateSource.cacheMeta.remainingMs === "number" ? shellStateSource.cacheMeta.remainingMs : null,',
      '          sourceCount: typeof shellStateSource.cacheMeta.sourceCount === "number" ? shellStateSource.cacheMeta.sourceCount : (Array.isArray(shellStateSource.allSites) ? shellStateSource.allSites.length : 0),',
      '          measuredAt: typeof shellStateSource.cacheMeta.measuredAt === "number" ? shellStateSource.cacheMeta.measuredAt : Date.now(),',
      "        }",
      "      : null,",
      "  };",
      "  const listeners = new Set();",
    ];
  }

  function buildSnapshotApiCompatStateCloneLines() {
    return [
      "  function cloneState() {",
      "    return {",
      "      accountLabel: snapshotState.accountLabel,",
      "      allSites: Array.isArray(snapshotState.allSites) ? snapshotState.allSites.slice() : [],",
      "      rows: Array.isArray(snapshotState.rows) ? snapshotState.rows.slice() : [],",
      '      siteMeta: snapshotState.siteMeta && typeof snapshotState.siteMeta === "object" ? snapshotState.siteMeta : {},',
      '      mergedMeta: Object.prototype.hasOwnProperty.call(snapshotState, "mergedMeta") ? snapshotState.mergedMeta : null,',
      '      curMode: snapshotState.curMode === "site" ? "site" : "all",',
      '      curSite: typeof snapshotState.curSite === "string" ? snapshotState.curSite : null,',
      '      curTab: typeof snapshotState.curTab === "string" ? snapshotState.curTab : "overview",',
      '      runtimeVersion: snapshotState.runtimeVersion || "snapshot",',
      "      cacheMeta: snapshotState.cacheMeta",
      "        ? {",
      '            label: snapshotState.cacheMeta.label || "snapshot",',
      "            updatedAt: snapshotState.cacheMeta.updatedAt instanceof Date ? snapshotState.cacheMeta.updatedAt : null,",
      '            remainingMs: typeof snapshotState.cacheMeta.remainingMs === "number" ? snapshotState.cacheMeta.remainingMs : null,',
      '            sourceCount: typeof snapshotState.cacheMeta.sourceCount === "number" ? snapshotState.cacheMeta.sourceCount : snapshotState.allSites.length,',
      '            measuredAt: typeof snapshotState.cacheMeta.measuredAt === "number" ? snapshotState.cacheMeta.measuredAt : Date.now(),',
      "          }",
      "        : null,",
      "    };",
      "  }",
    ];
  }

  function buildSnapshotApiCompatStateNotifyLines() {
    return [
      "  function notify() {",
      "    const nextState = cloneState();",
      "    listeners.forEach(function (listener) {",
      "      try { listener(nextState); } catch (_) {}",
      "    });",
      "  }",
    ];
  }

  function buildSnapshotApiCompatStateLines() {
    return [
      ...buildSnapshotApiCompatStateSeedLines(),
      ...buildSnapshotApiCompatStateCloneLines(),
      ...buildSnapshotApiCompatStateNotifyLines(),
    ];
  }

  function buildSnapshotApiCompatSiteShortNameLines() {
    return [
      "  function getSiteShortName(site) {",
      '    if (!site) return "site";',
      '    if (site.indexOf("https://") === 0) return site.slice(8);',
      '    if (site.indexOf("http://") === 0) return site.slice(7);',
      "    return site;",
      "  }",
    ];
  }

  function buildSnapshotApiCompatSiteLabelLines() {
    return [
      "  function getSiteLabel(site) {",
      '    if (!site) return "site";',
      '    const meta = snapshotState.siteMeta && typeof snapshotState.siteMeta === "object" ? snapshotState.siteMeta[site] || null : null;',
      '    const label = meta ? (meta.displayLabel || meta.label || meta.shortName || "").trim() : "";',
      "    return label || getSiteShortName(site);",
      "  }",
    ];
  }

  function buildSnapshotApiCompatLegacySiteResolverLines() {
    return [
      "  function resolveSiteFromLegacyLabel(labelText) {",
      '    const trimmed = (labelText || "").trim();',
      "    if (!trimmed) return null;",
      "    const exact = snapshotState.allSites.find(function (site) {",
      "      return site === trimmed || getSiteShortName(site) === trimmed || getSiteLabel(site) === trimmed;",
      "    });",
      "    if (exact) return exact;",
      "    const normalized = trimmed.toLowerCase();",
      "    return snapshotState.allSites.find(function (site) {",
      "      return site.toLowerCase() === normalized || getSiteShortName(site).toLowerCase() === normalized || getSiteLabel(site).toLowerCase() === normalized;",
      "    }) || null;",
      "  }",
    ];
  }

  function buildSnapshotApiCompatLabelResolverLines() {
    return [
      ...buildSnapshotApiCompatSiteShortNameLines(),
      ...buildSnapshotApiCompatSiteLabelLines(),
      ...buildSnapshotApiCompatLegacySiteResolverLines(),
    ];
  }

  function buildSnapshotApiCompatSyncDomReadLines() {
    return [
      "  function syncFromLegacy() {",
      '    const activeMode = document.querySelector("#sadv-mode-bar .sadv-mode.on");',
      '    const activeTab = document.querySelector("#sadv-tabs .sadv-t.on");',
      '    const comboLabel = document.getElementById("sadv-combo-label");',
      '    const siteLabel = document.querySelector("#sadv-site-label span") || document.getElementById("sadv-site-label");',
      "    if (activeMode) snapshotState.curMode = activeMode.getAttribute('data-m') === 'site' ? 'site' : 'all';",
      "    if (activeTab) snapshotState.curTab = activeTab.getAttribute('data-t') || 'overview';",
    ];
  }

  function buildSnapshotApiCompatSyncResolvedSiteLines() {
    return [
      "    const resolvedSite =",
      '      resolveSiteFromLegacyLabel(comboLabel ? comboLabel.textContent : "") ||',
      '      resolveSiteFromLegacyLabel(siteLabel ? siteLabel.textContent : "") ||',
      "      snapshotState.curSite ||",
      "      snapshotState.allSites[0] ||",
      "      null;",
      "    snapshotState.curSite = resolvedSite;",
      "    notify();",
      "  }",
    ];
  }

  function buildSnapshotApiCompatSyncScheduleLines() {
    return [
      "  function scheduleSync() { Promise.resolve().then(syncFromLegacy); }",
    ];
  }

  function buildSnapshotApiCompatSyncLines() {
    return [
      // sync slice:
      // dormant compat bridge라도 DOM을 어디서 읽는지, 선택 사이트를 어떻게 해석하는지,
      // 그리고 언제 microtask로 다시 sync하는지를 분리해 두어야
      // 나중에 bridge 유지/제거 판단을 더 안전하게 할 수 있다.
      ...buildSnapshotApiCompatSyncDomReadLines(),
      ...buildSnapshotApiCompatSyncResolvedSiteLines(),
      ...buildSnapshotApiCompatSyncScheduleLines(),
    ];
  }

  function buildSnapshotApiCompatModeActionLines() {
    return [
      '    switchMode: function (mode) { if (typeof switchMode === "function") switchMode(mode); else { const button = document.querySelector("#sadv-mode-bar [data-m=\\"" + mode + "\\"]"); if (button) button.click(); } scheduleSync(); },',
    ];
  }

  // Phase 3:
  // compat bridge의 site action fallback은 setSite/switchSite가 같은 body를 공유한다.
  // 이 단계에서는 alias 관계를 바꾸지 않고 문자열 조립 책임만 분리해,
  // dormant bridge의 중복을 줄이면서 external caller 호환성을 유지한다.
  function buildSnapshotApiCompatSiteActionLines(actionName) {
    return [
      '    ' +
        actionName +
        ': function (site) { if (typeof setComboSite === "function") setComboSite(site); else { const items = Array.from(document.querySelectorAll(".sadv-combo-item")); const button = items.find(function (item) { return (item.getAttribute("data-site") || "") === site; }); if (button) button.click(); } if (typeof switchMode === "function") switchMode("site"); scheduleSync(); },',
    ];
  }

  function buildSnapshotApiCompatTabActionLines() {
    return [
      '    setTab: function (tab) { if (typeof setTab === "function") setTab(tab); else { const button = document.querySelector("#sadv-tabs [data-t=\\"" + tab + "\\"]"); if (button) button.click(); } scheduleSync(); },',
    ];
  }

  function buildSnapshotApiCompatNoopActionLines() {
    return [
      '    getSaveStatus: function () { return ' + JSON.stringify({ ...createIdleDirectSaveStatus(), runtimeType: "saved" }) + '; },',
      '    subscribeSaveStatus: function () { return function () {}; },',
      '    refresh: function () { return false; },',
      '    loadAndDirectSaveHeadless: function () { return false; },',
      '    download: function () { return false; },',
      '    directSave: function () { return false; },',
      '    close: function () { return false; },',
    ];
  }

  function buildSnapshotApiCompatActionLines() {
    return [
      "  const api = {",
      "    getState: cloneState,",
      "    isReady: function () { return true; },",
      "    waitUntilReady: function () { return Promise.resolve(true); },",
      "    subscribe: function (listener) { listeners.add(listener); return function () { listeners.delete(listener); }; },",
      ...buildSnapshotApiCompatModeActionLines(),
      // `switchSite`는 canonical action이고, `setSite`는 backward-compat alias다.
      // 둘의 동작이 현재 같아 보여도 compat bridge에서는 alias를 유지해
      // 과거 external caller를 깨지 않도록 한다.
      ...buildSnapshotApiCompatSiteActionLines("setSite"),
      ...buildSnapshotApiCompatSiteActionLines("switchSite"),
      ...buildSnapshotApiCompatTabActionLines(),
      ...buildSnapshotApiCompatNoopActionLines(),
      "  };",
      "  publishSnapshotRuntimeApis(api);",
    ];
  }

  function buildSnapshotApiCompatReactObserverLines() {
    return [
      '    if (typeof window.__REACT18_COMPAT__ === "object" && typeof window.__REACT18_COMPAT__.createReact18CompatibleObserver === "function") {',
      '      const observer = window.__REACT18_COMPAT__.createReact18CompatibleObserver(',
      '        target,',
      '        function () { scheduleSync(); },',
      '        { subtree: true, childList: true, attributes: true, characterData: true }',
      "      );",
      '      // Observer는 자동으로 관리되며, 명시적인 정리가 필요한 경우:',
      '      window.__SEARCHADVISOR_SNAPSHOT_OBSERVER__ = observer;',
    ];
  }

  function buildSnapshotApiCompatMutationObserverLines() {
    return [
      '    } else if (typeof MutationObserver === "function") {',
      '      // 폴백: 기존 MutationObserver 사용',
      "      const observer = new MutationObserver(function () { scheduleSync(); });",
      "      observer.observe(target, { subtree: true, childList: true, attributes: true, characterData: true });",
      '      window.__SEARCHADVISOR_SNAPSHOT_OBSERVER__ = observer;',
    ];
  }

  function buildSnapshotApiCompatObserverFinalizeLines() {
    return [
      "    }",
      "  }",
      "  syncFromLegacy();",
    ];
  }

  function buildSnapshotApiCompatObserverBodyLines() {
    return [
      ...buildSnapshotApiCompatReactObserverLines(),
      ...buildSnapshotApiCompatMutationObserverLines(),
      ...buildSnapshotApiCompatObserverFinalizeLines(),
    ];
  }

  function buildSnapshotApiCompatObserverLines() {
    return [
      '  const target = document.getElementById("sadv-p") || document.body;',
      '  if (target) {',
      '    // observer wiring은 compat bridge 안에서도 비교적 fan-out이 작아서',
      '    // action 의미를 건드리지 않고 추가 분해하기 가장 안전한 slice다.',
      '    // React 18 compat observer와 MutationObserver fallback을 line builder 단위로 분리해',
      '    // 나중에 bridge 유지/제거 판단을 더 쉽게 만든다.',
      ...buildSnapshotApiCompatObserverBodyLines(),
    ];
  }

  function buildSnapshotApiCompatBodyLines() {
    return [
      ...buildSnapshotApiCompatStateLines(),
      ...buildSnapshotApiCompatLabelResolverLines(),
      ...buildSnapshotApiCompatSyncLines(),
      ...buildSnapshotApiCompatActionLines(),
      ...buildSnapshotApiCompatObserverLines(),
    ];
  }

  function buildSnapshotApiCompatScript() {
    return [
      "(function () {",
      "  if (window.__SEARCHADVISOR_SNAPSHOT_API__) return;",
      // compat bridge body 조립 순서는 state → label → sync → action → observer를 유지한다.
      // 이 순서는 line builder를 더 잘게 나누더라도 깨지면 안 되는 읽기/초기화 계약이다.
      ...buildSnapshotApiCompatBodyLines(),
      "})();",
    ].join("\n");
  }

  function escapeInlineStyleText(text) {
    return String(text || "").replace(/<\/style/gi, "<\\/style");
  }

  function escapeInlineScriptText(text) {
    return String(text || "").replace(/<\/script/gi, "<\\/script");
  }

  function stringifyForInlineJson(value) {
    return JSON.stringify(value)
      .replace(/</g, "\\u003C")
      .replace(/>/g, "\\u003E")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
  }

  // Phase 2 Workstream C:
  // 아래 helper들은 export 시점 HTML 후처리 책임이다.
  // offline runtime 내부 boot helper(restoreSnapshotUiBootState/finalizeSnapshotUiBoot)와는
  // 다른 층이며, HTML 문자열에 shell host/state/bootstrap script를 주입하는 일만 맡는다.
  function ensureSnapshotReactShellHostMarkup(html) {
    const panelBodyPattern = /<div\b([^>]*\bid=(["'])(sadv-bd|sadv-tabpanel)\2[^>]*)>/i;
    const reactShellHostPattern = /<div\b([^>]*\bid=(["'])sadv-react-shell-host\2[^>]*)><\/div>/i;
    if (!panelBodyPattern.test(html) && !reactShellHostPattern.test(html)) {
      throw new Error("snapshot panel not found");
    }
    if (!reactShellHostPattern.test(html)) {
      html = html.replace(
        panelBodyPattern,
        `<div id="sadv-react-shell-host"></div><div$1>`,
      );
    }
    return html;
  }

  function injectSnapshotRuntimeShellState(html, shellState, reactShellCss) {
    html = html.replace(
      "</head>",
      `<style id="sadv-react-style">${reactShellCss}</style><style id="sadv-snapshot-shell-hide">#sadv-react-shell-host{display:block !important;width:100% !important;flex-shrink:0}</style></head>`,
    );
    html = html.replace(
      "<body>",
      `<body><script>window.__SEARCHADVISOR_RUNTIME_KIND__="snapshot";window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__=${stringifyForInlineJson(shellState)};<\/script>`,
    );
    return html;
  }

  function appendSnapshotShellBootstrap(html) {
    return html.replace(
      "</body>",
      `<script>${escapeInlineScriptText(buildSnapshotShellBootstrapScript())}<\/script></body>`,
    );
  }

  function injectSnapshotReactShell(html, payload) {
    const reactShellCss = escapeInlineStyleText(
      document.getElementById("sadv-react-style")?.textContent || "",
    );
    const shellState = buildSnapshotShellState(payload);
    html = ensureSnapshotReactShellHostMarkup(html);
    html = injectSnapshotRuntimeShellState(html, shellState, reactShellCss);
    html = appendSnapshotShellBootstrap(html);
    return html;
  }
  /**
   * 병합된 계정 정보를 표시하는 DOM 요소를 생성합니다.
   * @param {Object} mergedMeta - 병합 메타데이터 (accounts, mergedAt 포함)
   * @returns {HTMLElement} 병합된 계정 정보를 표시하는 div 요소
   */
  function createMergedAccountsInfo(mergedMeta) {
    const mergedInfo = document.createElement("div");
    mergedInfo.style.cssText = "background:linear-gradient(135deg,#17110a,#080808);border:1px solid #4a3b00;border-radius:0;padding:12px 16px;margin-bottom:16px";
    const validAccounts = mergedMeta.accounts.filter(Boolean);
    const accountLabels = validAccounts.map((acc, i) => {
      const fullLabel = acc.label || acc.encId?.slice(0, 8) || `계정${i + 1}`;
      const shortLabel = fullLabel.includes('@') ? fullLabel.split('@')[0] : fullLabel;
      return `<span tabindex="0" role="button" aria-describedby="merged-acc-full-${i}" style="display:inline-block;background:${T.accentSoftBg};color:${T.accentSoftText};padding:3px 8px;border:1px solid ${T.accentSoftBorder};border-radius:4px;font-size:11px;margin:2px;cursor:default" title="${escHtml(fullLabel)}">${escHtml(shortLabel)}<span id="merged-acc-full-${i}" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">전체: ${escHtml(fullLabel)}</span></span>`;
    }).join(" ");
    mergedInfo.setAttribute("role", "region");
    mergedInfo.setAttribute("aria-label", `병합된 계정 정보, ${validAccounts.length}개 계정`);
    mergedInfo.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:16px" aria-hidden="true">🔀</span>
          <span style="font-size:13px;font-weight:700;color:#fff8df">병합된 계정</span>
          <span style="font-size:10px;color:${C.sub};background:${T.accentSoftBg};padding:2px 6px;border:1px solid ${T.accentSoftBorder};border-radius:4px">${validAccounts.length}개 계정</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">${accountLabels}</div>
        <div style="font-size:9px;color:#d7bf78;margin-top:8px">병합 시각: ${mergedMeta.mergedAt ? new Date(mergedMeta.mergedAt).toLocaleString('ko-KR') : '-'}</div>
      `;
    return mergedInfo;
  }
