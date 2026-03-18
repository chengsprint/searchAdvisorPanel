  async function downloadSnapshot() {
    const btn = document.getElementById("sadv-save-btn");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "0/" + allSites.length;
    try {
      const savedAt = new Date();
      const payload = await collectExportData(
        function (done, total) {
          btn.textContent = done + "/" + total;
        },
        { refreshMode: "refresh" },
      );
      const html = injectSnapshotReactShell(buildSnapshotHtml(savedAt, payload), payload);
      const fileName =
        "searchadvisor-" +
        accountIdFromLabel(accountLabel) +
        "-" +
        stampFile(savedAt) +
        ".html";
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
    } catch (e) {
      console.error(e);
      alert("HTML 저장 중 오류가 발생했어요. 다시 시도해주세요.");
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
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
      curMode = payload.ui?.curMode || "all";
      curSite = payload.ui?.curSite || null;
      curTab = payload.ui?.curTab || "overview";
    } else {
      // Legacy format (should not happen in big bang, but kept for safety)
      accountLabel = payload.accountLabel || "";
      allSites = Array.isArray(payload.allSites) ? payload.allSites.slice() : [];
      dataBySite = payload.dataBySite || {};
      summaryRows = payload.summaryRows || [];
      siteMeta = payload.siteMeta || {};
      savedAt = payload.savedAt;
      curMode = payload.curMode || "all";
      curSite = payload.curSite || null;
      curTab = payload.curTab || "overview";
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
      curMode: curMode === "site" ? "site" : "all",
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
    delete clone.dataset.sadvSaveHidden;
    delete clone.dataset.sadvPrevVisibility;
    delete clone.dataset.sadvPrevPointerEvents;
    delete clone.dataset.sadvPrevBackground;
    delete clone.dataset.sadvPrevBorderLeftColor;
    const savedLabel = stampLabel(savedAt);

    // Handle V2 format for UI state
    let curMode, curSite, curTab, allSites;
    if (payload.__meta && payload.accounts) {
      // V2 format
      curMode = payload.ui?.curMode || "all";
      curSite = payload.ui?.curSite || null;
      curTab = payload.ui?.curTab || "overview";
      const accountKeys = Object.keys(payload.accounts);
      allSites = accountKeys.length > 0 ? (payload.accounts[accountKeys[0]]?.sites || []) : [];
    } else {
      // Legacy format
      curMode = payload.curMode || "all";
      curSite = payload.curSite || null;
      curTab = payload.curTab || "overview";
      allSites = payload.allSites || [];
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
    if (siteLabelEl) {
      siteLabelEl.innerHTML = `<span>${escHtml(siteLabel)}</span><span style="display:inline-flex;align-items:center;padding:2px 7px;border-radius:999px;border:1px solid #284766;color:#a8d8ff;background:rgba(12,23,38,.72)">${escHtml(activeTabLabel)}</span>`;
    }
    ["sadv-refresh-btn", "sadv-save-btn", "sadv-x"].forEach(function (id) {
      const el = clone.querySelector("#" + id);
      if (el) el.remove();
    });
    if (topRow && topRow.lastElementChild) {
      const meta = document.createElement("div");
      meta.style.cssText =
        "display:flex;align-items:center;padding:6px 10px;border-radius:999px;border:1px solid #284766;color:#d4ecff;background:rgba(7,13,22,.62);font-size:10px;font-weight:800";
      meta.textContent = "Saved " + savedLabel;
      topRow.lastElementChild.replaceWith(meta);
    }
    const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escHtml("SearchAdvisor Snapshot - " + siteLabel)}</title>
  <style>
    html,body{margin:0;padding:0;background:#06101a;color:#e0ecff;font-family:Apple SD Gothic Neo,system-ui,sans-serif}
    body{padding:28px 18px 40px}
    a{color:#40c4ff}
    :root{--snapshot-panel-width:520px}
    .snapshot-meta{
      width:min(100%,var(--snapshot-panel-width));
      box-sizing:border-box;
      margin:0 auto 12px;
      padding:10px 12px;
      border:1px solid #1a2d45;
      border-radius:20px;
      background:
        radial-gradient(circle at top right, rgba(64,196,255,.12), transparent 34%),
        linear-gradient(180deg, rgba(13,24,41,.98), rgba(7,13,22,.98));
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
    .snapshot-meta-title{font-size:13px;font-weight:800;line-height:1.2;color:#f3fbff}
    .snapshot-meta-copy{margin-top:6px;font-size:11px;line-height:1.7;color:#7f9cbc}
    #sadv-p{
      position:relative !important;
      top:auto !important;
      right:auto !important;
      width:min(100%,var(--snapshot-panel-width)) !important;
      box-sizing:border-box !important;
      height:auto !important;
      margin:0 auto !important;
      border:1px solid #1a2d45 !important;
      border-radius:20px !important;
      overflow:hidden !important;
      box-shadow:0 26px 60px rgba(0,0,0,.3) !important;
    }
    #sadv-bd{
      overflow:visible !important;
      max-height:none !important;
      height:auto !important;
    }
  </style>
</head>
<body>
  <div class="snapshot-meta">
    <details class="snapshot-meta-details">
      <summary class="snapshot-meta-summary">
        <span class="snapshot-meta-title">SearchAdvisor Snapshot</span>
      </summary>
      <div class="snapshot-meta-copy">\uc800\uc7a5 \uc2dc\uac01: ${escHtml(savedLabel)}<br>\ud504\ub85c\uadf8\ub7a8 \ubc84\uc804: ${escHtml((window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot"))}</div>
    </details>
  </div>
  ${clone.outerHTML}
  <script>
    // <!-- SADV_PAYLOAD_START -->
    const EXPORT_PAYLOAD_RAW = ${JSON.stringify(payload)};
    // Normalize V2 format to legacy format for snapshot HTML compatibility
    const EXPORT_PAYLOAD = (function normalizePayload(p) {
      if (p.__meta && p.accounts) {
        // V2 format - convert to legacy format
        const accountKeys = Object.keys(p.accounts);
        const firstAccount = accountKeys.length > 0 ? p.accounts[accountKeys[0]] : null;
        return {
          savedAt: p.__meta.savedAt || p.savedAt,
          accountLabel: accountKeys[0] || "",
          accountEncId: firstAccount?.encId || "unknown",
          generatorVersion: p.__meta.generatorVersion || "unknown",
          exportFormat: p.__meta.exportFormat || "snapshot-v2",
          allSites: firstAccount?.sites || [],
          summaryRows: p.summaryRows || [],
          dataBySite: firstAccount?.dataBySite || {},
          siteMeta: firstAccount?.siteMeta || {},
          mergedMeta: p.mergedMeta || null,
          curMode: p.ui?.curMode || "all",
          curSite: p.ui?.curSite || null,
          curTab: p.ui?.curTab || "overview"
        };
      }
      // Legacy format - return as is
      return p;
    })(EXPORT_PAYLOAD_RAW);
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
      return f || (a ? a.replace(/^https?:\\\\/\\\\//, "") : "\uc0ac\uc774\ud2b8 \uc120\ud0dd");
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
        currentSite: curSite || "",
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
    const ICONS = ${JSON.stringify(ICONS)};
    const C = ${JSON.stringify(C)};
    const COLORS = ${JSON.stringify(COLORS)};
    const DOW = ${JSON.stringify(DOW)};
    const PNL = ${JSON.stringify(PNL)};
    const CHART_W = PNL - 32;
    const TABS = ${JSON.stringify(TABS)};
    let TIP = null;
    const fmt = (v) => Number(v).toLocaleString();
    const fmtD = (s) => s ? s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8) : "";
    const fmtB = (s) => s ? s.slice(4, 6) + "/" + s.slice(6, 8) : "";
    ${tip.toString()}
    ${showTip.toString()}
    ${moveTip.toString()}
    ${hideTip.toString()}
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
    ${buildSiteSummaryRow.toString()}
    ${buildRenderers.toString()}
    ${assignColors.toString()}
    ${ensureCurrentSite.toString()}
    ${buildCombo.toString()}
    ${setComboSite.toString()}
    ${renderTab.toString()}
    ${switchMode.toString()}
    ${setAllSitesLabel.toString()}
    ${renderSnapshotAllSites.toString()}
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
    const INITIAL_MODE = EXPORT_PAYLOAD.curMode || "all";
    let curMode = null;  // Initialize to null so switchMode() triggers on first call
    let curSite = EXPORT_PAYLOAD.curSite || (allSites[0] || null);
    let curTab = EXPORT_PAYLOAD.curTab || "overview";
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
        runtimeVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot",
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
      };
    }
    function setCachedUiState() {
      lsSet(getUiStateCacheKey(), {
        ts: Date.now(),
        mode: curMode,
        tab: curTab,
        site: curSite,
      });
    }
    const SITE_COLORS_MAP = {};
    const memCache = {};
    let siteViewReqId = 0;
    let allViewReqId = 0;
    const p = document.getElementById("sadv-p");
    const modeBar = document.getElementById("sadv-mode-bar");
    const siteBar = document.getElementById("sadv-site-bar");
    const tabsEl = document.getElementById("sadv-tabs");
    const bdEl = document.getElementById("sadv-bd");
    const labelEl = document.getElementById("sadv-site-label");
    tabsEl.innerHTML = TABS.map(function (t) {
      return '<button class="sadv-t' + (t.id === curTab ? " on" : "") + '" data-t="' + t.id + '">' + t.label + "</button>";
    }).join("");
    function setTab(tab) {
      if (!tab || tab === curTab) return;
      const t = tabsEl.querySelector('[data-t="' + tab + '"]');
      if (!t) return;
      curTab = tab;
      tabsEl.querySelectorAll(".sadv-t").forEach(function (b) {
        b.classList.remove("on");
      });
      t.classList.add("on");
      if (window.__sadvR) renderTab(window.__sadvR);
      setCachedUiState();
      notifySnapshotShellState();
    }
    tabsEl.addEventListener("click", function (e) {
      const t = e.target.closest("[data-t]");
      if (!t) return;
      setTab(t.dataset.t);
    });
    document.getElementById("sadv-combo-btn").addEventListener("click", function (e) {
      e.stopPropagation();
      const wrap = document.getElementById("sadv-combo-wrap");
      wrap.classList.toggle("open");
      if (wrap.classList.contains("open")) {
        setTimeout(function () {
          const inp = document.getElementById("sadv-combo-search");
          if (inp) {
            inp.style.display = "block";
            inp.value = "";
            inp.focus();
            inp.oninput = function () {
              const q = inp.value.toLowerCase();
              document.querySelectorAll(".sadv-combo-item").forEach(function (el) {
                const searchTarget = ((el.dataset.site || "") + " " + getSiteLabel(el.dataset.site || "")).toLowerCase();
                el.style.display = !q || searchTarget.includes(q) ? "flex" : "none";
              });
            };
          }
        }, 50);
      }
    });
    document.addEventListener("click", function (e) {
      const wrap = document.getElementById("sadv-combo-wrap");
      if (wrap && !wrap.contains(e.target)) wrap.classList.remove("open");
    });
    modeBar.addEventListener("click", function (e) {
      const m = e.target.closest("[data-m]");
      if (!m) return;
      switchMode(m.dataset.m);
    });
    window.__SEARCHADVISOR_SNAPSHOT_API__ = {
      getState: cloneSnapshotShellState,
      isReady: function () {
        return true;
      },
      waitUntilReady: function () {
        return Promise.resolve(true);
      },
      subscribe: function (listener) {
        SNAPSHOT_SHELL_LISTENERS.add(listener);
        return function () {
          SNAPSHOT_SHELL_LISTENERS.delete(listener);
        };
      },
      switchMode: function (mode) {
        switchMode(mode);
      },
      setSite: function (site) {
        setComboSite(site);
        if (curMode !== "site") switchMode("site");
      },
      setTab: function (tab) {
        setTab(tab);
      },
      refresh: function () {
        alert("??ν\ube44 HTML? ?\ube60\uc744 ?\uc5bc\uaca9? 좌측 상단 메뉴에서 다운로드하세요.");
      },
      download: function () {
        alert("??ν\ube33 HTML ?\ubd84\uc5d0 \ub2e4\uc2dc ?\uc800\uc7a5\ud560 \uc218 ?右?uc2b5\ub2c8\ub2e4. ??ν\uc6d0\ud3a0? ?\ub3d9\uc791? \uc774\uc0c1\uc774 ?\uc0ac\ub77c\uc9c0\uba74 ?\uc885\ub8cc\ud574 \uc8fc\uc138\uc694.");
      },
      close: function () {
        const unmountShell = window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__;
        if (typeof unmountShell === "function") {
          try {
            unmountShell();
          } catch (e) {
            console.error('[close] Error:', e);
          }
        }
        const panel = document.getElementById("sadv-p");
        if (panel) panel.remove();
        const meta = document.querySelector(".snapshot-meta");
        if (meta) meta.remove();
        const host = document.getElementById("sadv-react-shell-host");
        if (host) host.remove();
        delete window.__SEARCHADVISOR_SNAPSHOT_API__;
        delete window.__SEARCHADVISOR_SNAPSHOT_SHELL_ROOT__;
      },
    };
    assignColors();
    window.__sadvRows = (EXPORT_PAYLOAD.summaryRows || []).filter(function (row) {
      return row && allSites.includes(row.site);
    });
    ensureCurrentSite();
    buildCombo(window.__sadvRows.length ? window.__sadvRows : null);
    if (curSite) setComboSite(curSite);
    setAllSitesLabel();
    switchMode(INITIAL_MODE);
    applySnapshotReportDecorations();
    notifySnapshotShellState();
  <\/script>
</body>
</html>`;
    return html;
  }
  function buildSnapshotShellBootstrapScript() {
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
      '  const shellIds = ["sadv-header", "sadv-mode-bar", "sadv-site-bar", "sadv-tabs"];',
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
      "  window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__ = function () {",
      "    moved.forEach(function (entry) {",
      "      if (entry.parent) entry.parent.insertBefore(entry.node, entry.next);",
      "    });",
      "    host.replaceChildren();",
      "    host.appendChild(portal);",
      "    delete window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__;",
      "  };",
      "})();",
    ].join(String.fromCharCode(10));
  }
  function buildSnapshotApiCompatScript() {
    return [
      "(function () {",
      "  if (window.__SEARCHADVISOR_SNAPSHOT_API__) return;",
      "  const shellStateSource = window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__ || {};",
      "  const snapshotState = {",
      '    accountLabel: shellStateSource.accountLabel || "",',
      "    allSites: Array.isArray(shellStateSource.allSites) ? shellStateSource.allSites.slice() : [],",
      "    rows: Array.isArray(shellStateSource.rows) ? shellStateSource.rows.slice() : [],",
      '    siteMeta: shellStateSource.siteMeta && typeof shellStateSource.siteMeta === "object" ? shellStateSource.siteMeta : {},',
      '    curMode: shellStateSource.curMode === "site" ? "site" : "all",',
      '    curSite: typeof shellStateSource.curSite === "string" ? shellStateSource.curSite : null,',
      '    curTab: typeof shellStateSource.curTab === "string" ? shellStateSource.curTab : "overview",',
      '    runtimeVersion: shellStateSource.runtimeVersion || "snapshot",',
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
      "  function cloneState() {",
      "    return {",
      "      accountLabel: snapshotState.accountLabel,",
      "      allSites: Array.isArray(snapshotState.allSites) ? snapshotState.allSites.slice() : [],",
      "      rows: Array.isArray(snapshotState.rows) ? snapshotState.rows.slice() : [],",
      '      siteMeta: snapshotState.siteMeta && typeof snapshotState.siteMeta === "object" ? snapshotState.siteMeta : {},',
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
      "  function notify() {",
      "    const nextState = cloneState();",
      "    listeners.forEach(function (listener) {",
      "      try { listener(nextState); } catch (_) {}",
      "    });",
      "  }",
      "  function getSiteShortName(site) {",
      '    if (!site) return "site";',
      '    if (site.indexOf("https://") === 0) return site.slice(8);',
      '    if (site.indexOf("http://") === 0) return site.slice(7);',
      "    return site;",
      "  }",
      "  function getSiteLabel(site) {",
      '    if (!site) return "site";',
      '    const meta = snapshotState.siteMeta && typeof snapshotState.siteMeta === "object" ? snapshotState.siteMeta[site] || null : null;',
      '    const label = meta ? (meta.displayLabel || meta.label || meta.shortName || "").trim() : "";',
      "    return label || getSiteShortName(site);",
      "  }",
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
      "  function syncFromLegacy() {",
      '    const activeMode = document.querySelector("#sadv-mode-bar .sadv-mode.on");',
      '    const activeTab = document.querySelector("#sadv-tabs .sadv-t.on");',
      '    const comboLabel = document.getElementById("sadv-combo-label");',
      '    const siteLabel = document.querySelector("#sadv-site-label span") || document.getElementById("sadv-site-label");',
      "    if (activeMode) snapshotState.curMode = activeMode.getAttribute('data-m') === 'site' ? 'site' : 'all';",
      "    if (activeTab) snapshotState.curTab = activeTab.getAttribute('data-t') || 'overview';",
      "    const resolvedSite =",
      '      resolveSiteFromLegacyLabel(comboLabel ? comboLabel.textContent : "") ||',
      '      resolveSiteFromLegacyLabel(siteLabel ? siteLabel.textContent : "") ||',
      "      snapshotState.curSite ||",
      "      snapshotState.allSites[0] ||",
      "      null;",
      "    snapshotState.curSite = resolvedSite;",
      "    notify();",
      "  }",
      "  function scheduleSync() { Promise.resolve().then(syncFromLegacy); }",
      "  const api = {",
      "    getState: cloneState,",
      "    isReady: function () { return true; },",
      "    waitUntilReady: function () { return Promise.resolve(true); },",
      "    subscribe: function (listener) { listeners.add(listener); return function () { listeners.delete(listener); }; },",
      '    switchMode: function (mode) { if (typeof switchMode === "function") switchMode(mode); else { const button = document.querySelector("#sadv-mode-bar [data-m=\\"" + mode + "\\"]"); if (button) button.click(); } scheduleSync(); },',
      '    setSite: function (site) { if (typeof setComboSite === "function") setComboSite(site); else { const items = Array.from(document.querySelectorAll(".sadv-combo-item")); const button = items.find(function (item) { return (item.getAttribute("data-site") || "") === site; }); if (button) button.click(); } if (typeof switchMode === "function") switchMode("site"); scheduleSync(); },',
      '    setTab: function (tab) { if (typeof setTab === "function") setTab(tab); else { const button = document.querySelector("#sadv-tabs [data-t=\\"" + tab + "\\"]"); if (button) button.click(); } scheduleSync(); },',
      '    refresh: function () { alert("\uc800\uc7a5\ub41c HTML\uc740 \uc815\uc801 \uc2a4\ub0c5\uc0f7\uc785\ub2c8\ub2e4. \uc6d0\ubcf8 \ud328\ub110\uc5d0\uc11c \ub2e4\uc2dc \uac31\uc2e0\ud574 \uc8fc\uc138\uc694."); },',
      '    download: function () { alert("\uc800\uc7a5\ub41c HTML \ud30c\uc77c\uc5d0\uc11c\ub294 \ub2e4\uc2dc \uc800\uc7a5\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. \uc6d0\ubcf8 \ud328\ub110\uc5d0\uc11c \ub2e4\uc2dc \uc800\uc7a5\ud574 \uc8fc\uc138\uc694."); },',
      '    close: function () { const unmountShell = window.__SEARCHADVISOR_SNAPSHOT_SHELL_UNMOUNT__; if (typeof unmountShell === "function") { try { unmountShell(); } catch (_) {} } const panel = document.getElementById("sadv-p"); if (panel) panel.remove(); const meta = document.querySelector(".snapshot-meta"); if (meta) meta.remove(); const host = document.getElementById("sadv-react-shell-host"); if (host) host.remove(); delete window.__SEARCHADVISOR_SNAPSHOT_API__; delete window.__SEARCHADVISOR_SNAPSHOT_SHELL_ROOT__; },',
      "  };",
      "  window.__SEARCHADVISOR_SNAPSHOT_API__ = api;",
      '  const target = document.getElementById("sadv-p") || document.body;',
      '  if (target && typeof MutationObserver === "function") {',
      "    const observer = new MutationObserver(function () { scheduleSync(); });",
      "    observer.observe(target, { subtree: true, childList: true, attributes: true, characterData: true });",
      "  }",
      "  syncFromLegacy();",
      "})();",
    ].join("\n");
  }
  function injectSnapshotReactShell(html, payload) {
    if (!html.includes('<div id="sadv-bd">')) {
      throw new Error("snapshot panel not found");
    }
    const reactShellCss = vS(document.getElementById("sadv-react-style")?.textContent || "");
    const shellState = buildSnapshotShellState(payload);
    html = html.replace(
      "</head>",
      `<style id="sadv-react-style">${reactShellCss}</style><style id="sadv-snapshot-shell-hide">#sadv-header,#sadv-mode-bar,#sadv-site-bar{display:none !important}#sadv-react-shell-host{display:block !important;width:100% !important;flex-shrink:0}</style></head>`,
    );
    html = html.replace(
      "<body>",
      `<body><script>window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__=${JSON.stringify(shellState)};<\/script>`,
    );
    html = html.replace('<div id="sadv-bd">', `<div id="sadv-react-shell-host"></div><div id="sadv-bd">`);
    html = html.replace(
      "</body>",
      `<script>${gS(buildSnapshotShellBootstrapScript())}<\/script></body>`,
    );
    return html;
  }
  /**
   * 병합된 계정 정보를 표시하는 DOM 요소를 생성합니다.
   * @param {Object} mergedMeta - 병합 메타데이터 (accounts, mergedAt 포함)
   * @returns {HTMLElement} 병합된 계정 정보를 표시하는 div 요소
   */
  function createMergedAccountsInfo(mergedMeta) {
    const mergedInfo = document.createElement("div");
    mergedInfo.style.cssText = "background:linear-gradient(135deg,#1a2d45,#0d1829);border:1px solid #2a4060;border-radius:8px;padding:12px 16px;margin-bottom:16px";
    const validAccounts = mergedMeta.accounts.filter(Boolean);
    const accountLabels = validAccounts.map((acc, i) => {
      const fullLabel = acc.label || acc.encId?.slice(0, 8) || `계정${i + 1}`;
      const shortLabel = fullLabel.includes('@') ? fullLabel.split('@')[0] : fullLabel;
      return `<span tabindex="0" role="button" aria-describedby="merged-acc-full-${i}" style="display:inline-block;background:#2a4060;color:#8bb8e8;padding:3px 8px;border-radius:4px;font-size:11px;margin:2px;cursor:default" title="${escHtml(fullLabel)}">${escHtml(shortLabel)}<span id="merged-acc-full-${i}" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">전체: ${escHtml(fullLabel)}</span></span>`;
    }).join(" ");
    mergedInfo.setAttribute("role", "region");
    mergedInfo.setAttribute("aria-label", `병합된 계정 정보, ${validAccounts.length}개 계정`);
    mergedInfo.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:16px" aria-hidden="true">🔀</span>
          <span style="font-size:13px;font-weight:700;color:#e0ecff">병합된 계정</span>
          <span style="font-size:10px;color:#6482a2;background:#0d1829;padding:2px 6px;border-radius:4px">${validAccounts.length}개 계정</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">${accountLabels}</div>
        <div style="font-size:9px;color:#6482a2;margin-top:8px">병합 시각: ${mergedMeta.mergedAt ? new Date(mergedMeta.mergedAt).toLocaleString('ko-KR') : '-'}</div>
      `;
    return mergedInfo;
  }
