/**
 * Render full refresh progress UI with progress bar and stats
 * @param {string} label - Main progress label
 * @param {string} detail - Detailed progress description
 * @param {number} progress - Progress ratio (0-1)
 * @param {Object} stats - Statistics object { success, partial, failed, errors }
 * @returns {void}
 * @example
 * renderFullRefreshProgress(
 *   '데이터 새로고침 중',
 *   '5 / 10 사이트 처리 중',
 *   0.5,
 *   { success: 4, partial: 1, failed: 0, errors: [] }
 * );
 */
function renderFullRefreshProgress(label, detail, progress, stats) {
  const ratio =
    typeof progress === "number" && isFinite(progress)
      ? Math.max(0.06, Math.min(1, progress))
      : 0.06;
  const st = stats || { success: 0, partial: 0, failed: 0, errors: [] };
  const pct = Math.round(ratio * 100);
  let statsHtml = "";
  if (st.success > 0 || st.partial > 0 || st.failed > 0) {
    statsHtml =
      '<div style="display:flex;gap:12px;margin-top:8px;font-size:10px">' +
      '<span style="color:' + C.green + '">' + st.success + ' 완료</span>' +
      '<span style="color:' + C.amber + '">' + st.partial + ' 부분</span>' +
      '<span style="color:' + C.red + '">' + st.failed + ' 실패</span>' +
      "</div>";
  }
  let errorsHtml = "";
  if (st.errors && st.errors.length > 0 && st.errors.length <= 3) {
    errorsHtml =
      '<div style="margin-top:10px;font-size:10px;color:' + C.red + ';line-height:1.4">' +
      st.errors.map(function (e) { return escHtml(e.site) + ": " + escHtml(e.error); }).join("<br>") +
      "</div>";
  }
  bdEl.innerHTML = sanitizeHTML(
    '<div style="padding:24px 18px 20px;color:var(--sadv-text-secondary,#ffe9a8);text-align:left;line-height:1.6;background:var(--sadv-layer-01,#0d0d0f);border:1px solid var(--sadv-border-subtle,#2b2200);box-shadow:0 10px 28px rgba(0,0,0,0.24)">' +
    '<div style="font-size:13px;font-weight:700;color:var(--sadv-text,#fffdf5);margin-bottom:8px">' +
    escHtml(label) +
    "</div>" +
    '<div style="font-size:11px;margin-bottom:10px">' +
    escHtml(detail || "") +
    "</div>" +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">' +
    '<div style="flex:1;height:10px;border-radius:999px;background:var(--sadv-layer-02,#171717);border:1px solid var(--sadv-border-subtle,#2b2200);overflow:hidden">' +
    '<div style="width:' +
    escHtml(String(pct)) +
    '%;height:100%;background:linear-gradient(90deg,#ffd400,#ff7a00)"></div>' +
    "</div>" +
    '<span style="font-size:11px;font-weight:700;color:var(--sadv-accent,#ffd400);min-width:48px;text-align:right">' +
    escHtml(String(pct)) +
    "%</span>" +
    "</div>" +
    statsHtml +
    errorsHtml +
    "</div>"
  );
}

/**
 * Check if a full refresh should be triggered based on cache expiry
 * @returns {boolean} True if any cache is expired and refresh is needed
 * @example
 * if (shouldBootstrapFullRefresh()) {
 *   await runFullRefreshPipeline({ trigger: 'cache-expiry' });
 * }
 */
function getBootstrapFullRefreshStatus() {
  if (!allSites.length) {
    return {
      shouldRefresh: false,
      reason: null,
      ttlMs: getDataTtlMs(),
      siteCount: 0,
      siteListMissing: false,
      siteListExpired: false,
      expiredSites: 0,
    };
  }
  const now = Date.now();
  const ttlMs = getDataTtlMs();
  const siteListTs = getSiteListCacheStamp();
  const memCache = typeof getMemCache === "function" ? getMemCache() : null;
  const hasLiveSiteList = Array.isArray(allSites) && allSites.length > 0;
  const status = {
    shouldRefresh: false,
    reason: null,
    ttlMs: ttlMs,
    siteCount: Array.isArray(allSites) ? allSites.length : 0,
    siteListMissing: false,
    siteListExpired: false,
    expiredSites: 0,
  };
  if (!(typeof siteListTs === "number")) {
    if (!hasLiveSiteList) {
      status.shouldRefresh = true;
      status.reason = "site-list-missing";
      status.siteListMissing = true;
      return status;
    }
  } else if (now - siteListTs >= ttlMs) {
    status.shouldRefresh = true;
    status.reason = "site-list-expired";
    status.siteListExpired = true;
  }
  allSites.forEach(function (site) {
    const siteTs = getSiteDataCacheStamp(site);
    if (typeof siteTs === "number") {
      if (now - siteTs >= ttlMs) status.expiredSites += 1;
      return;
    }
    const memData = memCache && memCache[site];
    const initData =
      (typeof window !== "undefined" && window.__sadvInitData && window.__sadvInitData.sites
        ? window.__sadvInitData.sites[site]
        : null) ||
      (typeof window !== "undefined" && window.__sadvMergedData && window.__sadvMergedData.sites
        ? window.__sadvMergedData.sites[site]
        : null) ||
      (typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__ && window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteData
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteData[site]
        : null);
    const liveTs =
      (memData && typeof memData.__cacheSavedAt === "number" && memData.__cacheSavedAt) ||
      (initData && typeof initData.__cacheSavedAt === "number" && initData.__cacheSavedAt) ||
      (initData && typeof initData.ts === "number" && initData.ts) ||
      null;
    if (typeof liveTs === "number" && now - liveTs >= ttlMs) {
      status.expiredSites += 1;
    }
  });
  if (status.expiredSites > 0) {
    status.shouldRefresh = true;
    if (!status.reason) status.reason = "site-data-expired";
  }
  return status;
}

function shouldBootstrapFullRefresh() {
  return !!getBootstrapFullRefreshStatus().shouldRefresh;
}

let fullRefreshInFlightPromise = null;
let fullRefreshInFlightMeta = null;
let cacheExpiryMonitorId = null;

function buildFullRefreshSiteSignature() {
  const sites = Array.isArray(allSites) ? allSites : [];
  let hash = 2166136261;
  for (let i = 0; i < sites.length; i++) {
    const site = typeof sites[i] === "string" ? sites[i] : "";
    for (let j = 0; j < site.length; j++) {
      hash ^= site.charCodeAt(j);
      hash = Math.imul(hash, 16777619);
    }
    hash ^= 124;
    hash = Math.imul(hash, 16777619);
  }
  return sites.length + ":" + (hash >>> 0).toString(36);
}

function buildFullRefreshSaveReuseContext() {
  const runtimeKind =
    typeof window !== "undefined" && window.__SEARCHADVISOR_RUNTIME_KIND__
      ? window.__SEARCHADVISOR_RUNTIME_KIND__
      : "live";
  const accountInfo =
    typeof ACCOUNT_UTILS !== "undefined" &&
    ACCOUNT_UTILS &&
    typeof ACCOUNT_UTILS.getAccountInfo === "function"
      ? ACCOUNT_UTILS.getAccountInfo()
      : {
          accountLabel: typeof accountLabel === "string" ? accountLabel : "",
          encId: typeof encId === "string" ? encId : "",
        };
  const isMultiAccount =
    typeof ACCOUNT_UTILS !== "undefined" &&
    ACCOUNT_UTILS &&
    typeof ACCOUNT_UTILS.isMultiAccount === "function"
      ? !!ACCOUNT_UTILS.isMultiAccount()
      : !!(
          typeof window !== "undefined" &&
          window.__sadvAccountState &&
          window.__sadvAccountState.isMultiAccount
        );
  return {
    runtimeKind: runtimeKind,
    accountEncId: accountInfo && typeof accountInfo.encId === "string" ? accountInfo.encId : "",
    accountLabel:
      accountInfo && typeof accountInfo.accountLabel === "string"
        ? accountInfo.accountLabel
        : "",
    isMultiAccount: !!isMultiAccount,
    siteCount: Array.isArray(allSites) ? allSites.length : 0,
    siteSignature: buildFullRefreshSiteSignature(),
  };
}

function isReusableFullRefreshContextForSave(requestContext, inflightMeta) {
  if (!requestContext || !inflightMeta || !inflightMeta.context) return false;
  const inflightContext = inflightMeta.context;
  return !!(
    inflightMeta.trigger === "cache-expiry" &&
    inflightContext.runtimeKind === requestContext.runtimeKind &&
    inflightContext.accountEncId === requestContext.accountEncId &&
    inflightContext.accountLabel === requestContext.accountLabel &&
    inflightContext.isMultiAccount === requestContext.isMultiAccount &&
    inflightContext.siteCount === requestContext.siteCount &&
    inflightContext.siteSignature === requestContext.siteSignature
  );
}

function getReusableFullRefreshStatusForSave() {
  const requestContext = buildFullRefreshSaveReuseContext();
  const reusable = !!(
    fullRefreshInFlightPromise &&
    isReusableFullRefreshContextForSave(requestContext, fullRefreshInFlightMeta)
  );
  return {
    reusable: reusable,
    trigger:
      fullRefreshInFlightMeta && typeof fullRefreshInFlightMeta.trigger === "string"
        ? fullRefreshInFlightMeta.trigger
        : null,
    startedAt:
      fullRefreshInFlightMeta && typeof fullRefreshInFlightMeta.startedAt === "number"
        ? fullRefreshInFlightMeta.startedAt
        : null,
    context: requestContext,
    promise: reusable ? fullRefreshInFlightPromise : null,
  };
}

async function awaitReusableFullRefreshPayloadForSave(reusableHandle) {
  const handle =
    reusableHandle &&
    reusableHandle.reusable &&
    reusableHandle.promise &&
    typeof reusableHandle.promise.then === "function"
      ? reusableHandle
      : null;
  if (!handle.reusable || !handle.promise) return null;
  return await handle.promise;
}

function stopCacheExpiryMonitor() {
  if (cacheExpiryMonitorId) {
    clearInterval(cacheExpiryMonitorId);
    cacheExpiryMonitorId = null;
    recordRuntimeEvent("cache-monitor-stop", null);
  }
}

function startCacheExpiryMonitor() {
  if (typeof window === "undefined" || typeof window.setInterval !== "function") return null;
  stopCacheExpiryMonitor();
  const intervalMs = getCacheMonitorIntervalMs();
  cacheExpiryMonitorId = window.setInterval(function () {
    try {
      const panelExists = !!document.getElementById("sadv-p");
      if (!panelExists) {
        stopCacheExpiryMonitor();
        return;
      }
      if (!shouldBootstrapFullRefresh()) return;
      runFullRefreshPipeline({ trigger: "cache-expiry" }).catch(function (e) {
        console.error("[Cache Monitor] Auto refresh failed:", e);
      });
    } catch (e) {
      console.error("[Cache Monitor] Tick failed:", e);
    }
  }, intervalMs);
  recordRuntimeEvent("cache-monitor-start", {
    intervalMs: intervalMs,
    ttlMs: getDataTtlMs(),
  });
  return cacheExpiryMonitorId;
}

/**
 * Run the full refresh pipeline to update all site data
 * Fetches expose, diagnosisMeta, crawl, and backlink data for all sites
 * @param {Object} options - Options object
 * @param {string} options.trigger - Trigger source ('cache-expiry' or 'manual')
 * @param {HTMLElement} options.button - Optional button element to update with progress
 * @returns {Promise<Object>} Payload with summaryRows and stats
 * @example
 * const payload = await runFullRefreshPipeline({ trigger: 'manual' });
 * console.log(`Refreshed ${payload.summaryRows.length} sites`);
 * @see {renderFullRefreshProgress}
 */
async function runFullRefreshPipeline(options = {}) {
  if (fullRefreshInFlightPromise) return fullRefreshInFlightPromise;
  const trigger = options && options.trigger ? options.trigger : "manual";
  fullRefreshInFlightMeta = {
    trigger: trigger,
    startedAt: Date.now(),
    context: buildFullRefreshSaveReuseContext(),
  };
  fullRefreshInFlightPromise = (async function () {
  const shouldRenderProgress = !(options && options.renderProgress === false);
  const triggerLabel =
    trigger === "cache-expiry"
      ? "\uce90\uc2dc\uac00 \ub9cc\ub8cc\ub418\uc5b4 \uc804\uccb4 \ub370\uc774\ud130\ub97c \ub2e4\uc2dc \uc218\uc9d1\ud558\uace0 \uc788\uc5b4\uc694."
      : "\uc804\uccb4 \ub370\uc774\ud130\ub97c \ub2e4\uc2dc \uc218\uc9d1\ud558\uace0 \uc788\uc5b4\uc694.";
  const triggerDetail =
    trigger === "cache-expiry"
      ? "\uc804\uccb4\ud604\ud669\uacfc \uc0ac\uc774\ud2b8\ubcc4 \uc0c1\uc138\ud0ed\uc744 \ubaa8\ub450 \ucd5c\uc2e0 \uc0c1\ud0dc\ub85c \ub9de\ucd94\ub294 \uc911\uc785\ub2c8\ub2e4."
      : "\uc0ac\uc774\ud2b8 \ubaa9\ub85d\ubd80\ud130 expose, diagnosisMeta, crawl, backlink\uae4c\uc9c0 \uc21c\uc11c\ub300\ub85c \uac31\uc2e0\ud569\ub2c8\ub2e4.";
  recordRuntimeEvent("full-refresh-start", {
    trigger: trigger,
    ttlMs: getDataTtlMs(),
    siteCount: allSites.length,
  });
  if (shouldRenderProgress) {
    renderFullRefreshProgress(triggerLabel, triggerDetail, 0);
    labelEl.innerHTML = sanitizeHTML("<span>\uc804\uccb4 \uc7ac\uc218\uc9d1 \uc9c4\ud589 \uc911</span>");
  }
  const btn = options && options.button ? options.button : null;
  recordRuntimeEvent("collect-export-start", {
    source: "full-refresh",
    trigger: trigger,
    refreshMode: "refresh",
    siteCount: allSites.length,
  });
  const payload = await collectExportData(
    function (done, total, site, stats) {
      const safeTotal = Math.max(1, total);
      const shortSite = site
        ? site.replace("https://", "").replace("http://", "")
        : "";
      const detail =
        done +
        " / " +
        safeTotal +
        " \uc0ac\uc774\ud2b8 \ucc98\ub9ac \uc911" +
        (shortSite ? " · " + shortSite : "");
      if (shouldRenderProgress) {
        renderFullRefreshProgress(triggerLabel, detail, done / safeTotal, stats);
      }
      if (btn) btn.textContent = done + "/" + safeTotal;
      if (options && typeof options.onProgress === "function") {
        options.onProgress(done, safeTotal, site, stats);
      }
    },
    { refreshMode: "refresh" },
  );
  recordRuntimeEvent("collect-export-complete", {
    source: "full-refresh",
    trigger: trigger,
    refreshMode: "refresh",
    siteCount: payload && payload.summaryRows ? payload.summaryRows.length : allSites.length,
    stats: payload && payload.stats ? payload.stats : null,
  });
  window.__sadvRows = payload.summaryRows;
  buildCombo(payload.summaryRows);
  assignColors();
  ensureCurrentSite();
  if (curSite) setComboSite(curSite);
  if (curMode === "site" && curSite) {
    await loadSiteView(curSite);
  } else {
    setAllSitesLabel();
    await renderAllSites();
  }
  setCachedUiState();
  if (payload.stats && (payload.stats.failed > 0 || payload.stats.errors.length > 0)) {
    renderFailureSummary(payload.stats);
  }
  recordRuntimeEvent("full-refresh-complete", {
    trigger: trigger,
    siteCount: payload.summaryRows.length,
    stats: payload.stats || null,
  });
  return payload;
  })();
  try {
    return await fullRefreshInFlightPromise;
  } catch (e) {
    recordRuntimeEvent("full-refresh-failure", {
      trigger: options && options.trigger ? options.trigger : "manual",
      message: e && e.message ? e.message : String(e),
    });
    throw e;
  } finally {
    fullRefreshInFlightPromise = null;
    fullRefreshInFlightMeta = null;
  }
}

/**
 * Render a failure summary popup when data collection has issues
 * Shows failed and partial counts, and displays error details
 * @param {Object} stats - Statistics object with failed, partial, and errors
 * @returns {void}
 * @example
 * renderFailureSummary({
 *   failed: 2,
 *   partial: 1,
 *   errors: [{ site: 'https://example.com', error: 'Network error' }]
 * });
 */
function renderFailureSummary(stats) {
  if (!stats || (stats.failed === 0 && stats.errors.length === 0)) return;
  const summaryEl = document.createElement("div");
  summaryEl.id = "sadv-failure-summary";
  summaryEl.style.cssText =
    "position:fixed;bottom:12px;right:12px;background:#120d0a;border:1px solid rgba(255,90,54,0.45);border-radius:" + T.radiusNone + ";padding:12px " + T.spaceCard + ";font-size:11px;color:var(--sadv-text-secondary,#ffe9a8);max-width:340px;z-index:10000000;box-shadow:" + T.shadowPanel + ";font-family:" + T.fontSans;
  const failedCount = stats.failed || 0;
  const partialCount = stats.partial || 0;
  const errorItems = (stats.errors || []).slice(0, 5);
  const headerRow = document.createElement("div");
  headerRow.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:6px";
  const titleSpan = document.createElement("span");
  titleSpan.style.cssText = "font-weight:800;color:var(--sadv-text,#fffdf5)";
  titleSpan.textContent = "데이터 수집 이슈";
  headerRow.appendChild(titleSpan);
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "\u00d7";
  closeBtn.style.cssText = "background:transparent;border:1px solid rgba(255,90,54,0.35);color:#ff5a36;cursor:pointer;font-size:13px;padding:1px 7px;line-height:1.2";
  closeBtn.onclick = function () { summaryEl.remove(); };
  headerRow.appendChild(closeBtn);
  summaryEl.appendChild(headerRow);
  const countDiv = document.createElement("div");
  countDiv.style.cssText = "color:var(--sadv-text-secondary,#ffe9a8);line-height:1.5";
  countDiv.innerHTML = sanitizeHTML(
    (failedCount > 0 ? '<span style="color:' + C.red + ';font-weight:700">실패 ' + escHtml(String(failedCount)) + '개</span>' : "") +
    (failedCount > 0 && partialCount > 0 ? '<span style="color:var(--sadv-text-tertiary,#b9a55a)"> · </span>' : "") +
    (partialCount > 0 ? '<span style="color:' + C.amber + ';font-weight:700">부분 ' + escHtml(String(partialCount)) + '개</span>' : "")
  );
  summaryEl.appendChild(countDiv);
  if (errorItems.length > 0) {
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = "margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,90,54,0.25);font-size:10px;line-height:1.5";
    errorItems.forEach(function (e) {
      const line = document.createElement("div");
      const siteShort = e.site ? e.site.replace(/^https?:\/\//, "").slice(0, 30) : "unknown";
      line.textContent = siteShort + ": " + (e.error || "unknown error");
      errorDiv.appendChild(line);
    });
    if (stats.errors.length > 5) {
      const moreLine = document.createElement("div");
      moreLine.style.color = C.amber;
      moreLine.textContent = "... +" + (stats.errors.length - 5) + "개 더 있음";
      errorDiv.appendChild(moreLine);
    }
    summaryEl.appendChild(errorDiv);
  }
  const existing = document.getElementById("sadv-failure-summary");
  if (existing) existing.remove();
  document.body.appendChild(summaryEl);
  setTimeout(function () {
    if (summaryEl && summaryEl.parentElement) summaryEl.remove();
  }, 30000);
}
