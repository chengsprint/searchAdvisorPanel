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
      '<span style="color:' + C.green + '">' + st.success + ' success</span>' +
      '<span style="color:' + C.amber + '">' + st.partial + ' partial</span>' +
      '<span style="color:' + C.red + '">' + st.failed + ' failed</span>' +
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
function shouldBootstrapFullRefresh() {
  if (!allSites.length) return false;
  const now = Date.now();
  const ttlMs = getDataTtlMs();
  const siteListTs = getSiteListCacheStamp();
  if (!(typeof siteListTs === "number") || now - siteListTs >= ttlMs) return true;
  return allSites.some(function (site) {
    const siteTs = getSiteDataCacheStamp(site);
    return !(typeof siteTs === "number") || now - siteTs >= ttlMs;
  });
}

let fullRefreshInFlightPromise = null;
let cacheExpiryMonitorId = null;

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
  fullRefreshInFlightPromise = (async function () {
  const trigger = options && options.trigger ? options.trigger : "manual";
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
  renderFullRefreshProgress(triggerLabel, triggerDetail, 0);
  labelEl.innerHTML = sanitizeHTML("<span>\uc804\uccb4 \uc7ac\uc218\uc9d1 \uc9c4\ud589 \uc911</span>");
  const btn = options && options.button ? options.button : null;
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
      renderFullRefreshProgress(triggerLabel, detail, done / safeTotal, stats);
      if (btn) btn.textContent = done + "/" + safeTotal;
    },
    { refreshMode: "refresh" },
  );
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
    "position:fixed;bottom:12px;right:12px;background:#120d0a;border:1px solid rgba(255,90,54,0.45);border-radius:0;padding:12px 16px;font-size:11px;color:#ff5a36;max-width:320px;z-index:10000000;box-shadow:0 10px 28px rgba(0,0,0,.42);font-family:Apple SD Gothic Neo,system-ui";
  const failedCount = stats.failed || 0;
  const partialCount = stats.partial || 0;
  const errorItems = (stats.errors || []).slice(0, 5);
  const headerRow = document.createElement("div");
  headerRow.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:4px";
  const titleSpan = document.createElement("span");
  titleSpan.style.fontWeight = "700";
  titleSpan.textContent = "Data Collection Issues";
  headerRow.appendChild(titleSpan);
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "\u00d7";
  closeBtn.style.cssText = "background:none;border:none;color:#ff5a36;cursor:pointer;font-size:14px;padding:0 4px";
  closeBtn.onclick = function () { summaryEl.remove(); };
  headerRow.appendChild(closeBtn);
  summaryEl.appendChild(headerRow);
  const countDiv = document.createElement("div");
  countDiv.style.color = C.amber;
  countDiv.textContent = failedCount + " failed" + (partialCount > 0 ? ", " + partialCount + " partial" : "");
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
      moreLine.textContent = "... +" + (stats.errors.length - 5) + " more";
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
