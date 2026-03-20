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
  /**
 * Download the current view as a standalone HTML snapshot file
 * Collects all data, generates HTML with embedded payload, and triggers download
 * @returns {Promise<void>}
 * @example
 * await downloadSnapshot(); // Downloads searchadvisor-user-20260315-143045.html
 * @see {collectExportData}
 * @see {buildSnapshotHtml}
 */
  async function downloadSnapshot() {
    const capabilities =
      typeof getRuntimeCapabilities === "function" ? getRuntimeCapabilities() : null;
    if (capabilities && capabilities.isReadOnly) {
      throw new Error("snapshot export is disabled in read-only mode");
    }
    const runtimeSites =
      typeof getRuntimeAllSites === "function" ? getRuntimeAllSites() : allSites;
    const btn = document.getElementById("sadv-save-btn");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "0/" + runtimeSites.length;
    try {
      const savedAt = new Date();
      const payload = await collectExportData(
        function (done, total) {
          btn.textContent = done + "/" + total;
        },
        { refreshMode: "cache-first" },
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
      showError(ERROR_MESSAGES.HTML_SAVE_ERROR, e, 'downloadSnapshot');
      bdEl.innerHTML = createInlineError(
        ERROR_MESSAGES.HTML_SAVE_ERROR,
        () => downloadSnapshot(),
        '다시 시도'
      ).outerHTML;
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
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
    ${buildRenderers.toString()}
    ${assignColors.toString()}
    // Shared public entry seam:
    // Phase 2에서는 live/saved가 같은 public facade(window.__sadvApi)를
    // 같은 helper를 통해 게시/해제하도록 수렴시킨다.
    ${setRuntimePublicApi.toString()}
    ${clearRuntimePublicApi.toString()}
    // All-sites local helper contract:
    // 10-all-sites-view.js는 canonical rows read/write와 card-selection을
    // local helper로 감싸고 있으므로, saved HTML도 이 helper들을 먼저
    // serialize해야 renderAllSites/buildAllSitesDisplayWrap 경로가 깨지지 않는다.
    ${getAllSitesSelectionState.toString()}
    ${getAllSitesCanonicalRows.toString()}
    ${setAllSitesCanonicalRows.toString()}
    ${setAllSitesSelectedSite.toString()}
    // Shared UI controls helper contract:
    // 09-ui-controls.js가 semantic selection helpers를 통해 mode/site/tab
    // interaction을 공통화하고 있으므로, saved HTML 직렬화도 이 helper들을
    // 의존 함수들보다 먼저 같이 실어야 한다.
    // live는 번들 전체가 한 스코프에 있지만, saved는 allowlist에 넣은 함수만
    // 포함되므로 여기서 빠지면 saved-only is-not-defined 회귀가 생긴다.
    ${getUiControlsSelectionState.toString()}
    ${applyUiControlsMode.toString()}
    ${applyUiControlsSite.toString()}
    ${applyUiControlsTab.toString()}
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
      download: function () {
        return false;
      },
      close: function () {
        return false;
      },
    };
    window.__SEARCHADVISOR_SNAPSHOT_API__ = snapshotApi;
    const publicApi = {
      // Phase 2 thin public facade:
      // __SEARCHADVISOR_SNAPSHOT_API__는 richer snapshot control surface를 유지하고,
      // __sadvApi는 live와 이름/역할을 맞춘 공통 subset만 노출한다.
      // 이렇게 분리해 두면 external automation/QA는 public facade만 보고,
      // snapshot 전용 제어는 richer API에만 남겨 책임을 분리할 수 있다.
      getState: snapshotApi.getState,
      getCapabilities: snapshotApi.getCapabilities,
      isReady: snapshotApi.isReady,
      waitUntilReady: snapshotApi.waitUntilReady,
      subscribe: snapshotApi.subscribe,
      switchMode: snapshotApi.switchMode,
      setSite: snapshotApi.setSite,
      switchSite: snapshotApi.switchSite,
      setTab: snapshotApi.setTab,
      refresh: snapshotApi.refresh,
      download: snapshotApi.download,
      close: snapshotApi.close,
    };
    if (typeof setRuntimePublicApi === "function") {
      setRuntimePublicApi(publicApi);
    } else {
      window.__sadvApi = publicApi;
    }
    if (snapshotUiReady) {
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
      switchMode(INITIAL_MODE);
      bindSnapshotAllCardLinks();
      applySnapshotReportDecorations();
      notifySnapshotShellState();
    }
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
      '    switchSite: function (site) { if (typeof setComboSite === "function") setComboSite(site); else { const items = Array.from(document.querySelectorAll(".sadv-combo-item")); const button = items.find(function (item) { return (item.getAttribute("data-site") || "") === site; }); if (button) button.click(); } if (typeof switchMode === "function") switchMode("site"); scheduleSync(); },',
      '    setTab: function (tab) { if (typeof setTab === "function") setTab(tab); else { const button = document.querySelector("#sadv-tabs [data-t=\\"" + tab + "\\"]"); if (button) button.click(); } scheduleSync(); },',
      '    refresh: function () { return false; },',
      '    download: function () { return false; },',
      '    close: function () { return false; },',
      "  };",
      "  window.__SEARCHADVISOR_SNAPSHOT_API__ = api;",
      "  const publicApi = {",
      "    getState: api.getState,",
      "    isReady: api.isReady,",
      "    waitUntilReady: api.waitUntilReady,",
      "    subscribe: api.subscribe,",
      "    switchMode: api.switchMode,",
      "    setSite: api.setSite,",
      "    switchSite: api.switchSite,",
      "    setTab: api.setTab,",
      "    refresh: api.refresh,",
      "    download: api.download,",
      "    close: api.close,",
      "  };",
      '  if (typeof setRuntimePublicApi === "function") setRuntimePublicApi(publicApi); else window.__sadvApi = publicApi;',
      '  const target = document.getElementById("sadv-p") || document.body;',
      '  if (target) {',
      '    // React 18 호환 가능한 DOM 관찰자 사용',
      '    if (typeof window.__REACT18_COMPAT__ === "object" && typeof window.__REACT18_COMPAT__.createReact18CompatibleObserver === "function") {',
      '      const observer = window.__REACT18_COMPAT__.createReact18CompatibleObserver(',
      '        target,',
      '        function () { scheduleSync(); },',
      '        { subtree: true, childList: true, attributes: true, characterData: true }',
      "      );",
      '      // Observer는 자동으로 관리되며, 명시적인 정리가 필요한 경우:',
      '      window.__SEARCHADVISOR_SNAPSHOT_OBSERVER__ = observer;',
      '    } else if (typeof MutationObserver === "function") {',
      '      // 폴백: 기존 MutationObserver 사용',
      "      const observer = new MutationObserver(function () { scheduleSync(); });",
      "      observer.observe(target, { subtree: true, childList: true, attributes: true, characterData: true });",
      '      window.__SEARCHADVISOR_SNAPSHOT_OBSERVER__ = observer;',
      "    }",
      "  }",
      "  syncFromLegacy();",
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

  function injectSnapshotReactShell(html, payload) {
    const panelBodyPattern = /<div\b([^>]*\bid=(["'])(sadv-bd|sadv-tabpanel)\2[^>]*)>/i;
    const reactShellHostPattern = /<div\b([^>]*\bid=(["'])sadv-react-shell-host\2[^>]*)><\/div>/i;
    if (!panelBodyPattern.test(html) && !reactShellHostPattern.test(html)) {
      throw new Error("snapshot panel not found");
    }
    const reactShellCss = escapeInlineStyleText(
      document.getElementById("sadv-react-style")?.textContent || "",
    );
    const shellState = buildSnapshotShellState(payload);
    html = html.replace(
      "</head>",
      `<style id="sadv-react-style">${reactShellCss}</style><style id="sadv-snapshot-shell-hide">#sadv-react-shell-host{display:block !important;width:100% !important;flex-shrink:0}</style></head>`,
    );
    html = html.replace(
      "<body>",
      `<body><script>window.__SEARCHADVISOR_RUNTIME_KIND__="snapshot";window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__=${stringifyForInlineJson(shellState)};<\/script>`,
    );
    if (!reactShellHostPattern.test(html)) {
      html = html.replace(
        panelBodyPattern,
        `<div id="sadv-react-shell-host"></div><div$1>`,
      );
    }
    html = html.replace(
      "</body>",
      `<script>${escapeInlineScriptText(buildSnapshotShellBootstrapScript())}<\/script></body>`,
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
