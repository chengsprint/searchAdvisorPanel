  /**
 * Load and render the site detail view for a specific site
 * Fetches all data types (expose, crawl, backlink, diagnosisMeta) and renders tabs
 * @param {string} site - Site URL to load
 * @returns {Promise<void>}
 * @example
 * await loadSiteView('https://example.com');
 * @see {buildRenderers}
 */
  function getSiteViewLoadLeaseForSave() {
    // 저장 실행 contract seam:
    // site mode에서 패널이 이미 fetchSiteData(site)로 상세 데이터를 준비 중이면,
    // save가 같은 사이트 상세 데이터를 다시 따로 요청하지 않도록 in-flight load를
    // 재사용 가능한 lease로 노출한다.
    // 중요:
    // - 이 seam은 same-site reuse만 허용하는 좁은 lease다.
    // - 여기서의 site 일치는 live current UI 표시보다 save request selection snapshot과 같은 의미를 유지해야 한다.
    const selectionState =
      typeof getRuntimeSelectionState === "function"
        ? getRuntimeSelectionState()
        : { curMode, curSite, curTab };
    const reusable = !!(
      siteViewLoadInFlightPromise &&
      siteViewLoadInFlightMeta &&
      siteViewLoadInFlightMeta.requestId === siteViewReqId &&
      selectionState.curMode === CONFIG.MODE.SITE &&
      typeof selectionState.curSite === "string" &&
      selectionState.curSite === siteViewLoadInFlightMeta.site
    );
    return {
      reusable: reusable,
      kind: "site-view-load",
      site: reusable ? siteViewLoadInFlightMeta.site : null,
      startedAt:
        reusable && typeof siteViewLoadInFlightMeta.startedAt === "number"
          ? siteViewLoadInFlightMeta.startedAt
          : null,
      promise: reusable ? siteViewLoadInFlightPromise : null,
      getProgress:
        reusable && siteViewLoadInFlightMeta
          ? function () {
              const progress =
                siteViewLoadInFlightMeta && siteViewLoadInFlightMeta.progress
                  ? siteViewLoadInFlightMeta.progress
                  : null;
              return progress ? { ...progress } : null;
            }
          : null,
    };
  }

  function getSiteOwnershipLabelsForDisplay(site) {
    if (!site) return [];
    const labels = [];
    function pushLabel(label) {
      if (typeof label !== "string" || !label) return;
      if (labels.indexOf(label) === -1) labels.push(label);
    }
    const initOwnership =
      window.__sadvInitData &&
      window.__sadvInitData.siteOwnership &&
      window.__sadvInitData.siteOwnership[site];
    if (Array.isArray(initOwnership)) initOwnership.forEach(pushLabel);
    const payloadOwnership =
      typeof window !== "undefined" &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__ &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteOwnershipBySite &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteOwnershipBySite[site];
    if (Array.isArray(payloadOwnership)) payloadOwnership.forEach(pushLabel);
    const mergedOwnership =
      typeof window !== "undefined" &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__ &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__.mergedMeta &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__.mergedMeta.siteOwnershipBySite &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__.mergedMeta.siteOwnershipBySite[site];
    if (Array.isArray(mergedOwnership)) mergedOwnership.forEach(pushLabel);
    return labels;
  }

  function getSourceAccountLabelForDisplay(sourceAccount) {
    if (!sourceAccount) return "";
    if (typeof sourceAccount === "string") return sourceAccount;
    if (typeof sourceAccount === "object") {
      if (typeof sourceAccount.accountLabel === "string" && sourceAccount.accountLabel) {
        return sourceAccount.accountLabel;
      }
      if (typeof sourceAccount.email === "string" && sourceAccount.email) {
        return sourceAccount.email;
      }
    }
    return "";
  }

  function formatSiteOwnershipLabelForDisplay(site, sourceAccount) {
    const owners = getSiteOwnershipLabelsForDisplay(site);
    if (owners.length > 1) {
      return `${owners[0]} (+${owners.length - 1})`;
    }
    if (owners.length === 1) return owners[0];
    return getSourceAccountLabelForDisplay(sourceAccount);
  }

  async function loadSiteView(site) {
    // 사이트별 상세는 live/snapshot이 최대한 같은 renderer 경로를 타야 하는 핵심 영역이다.
    // 목표는 snapshot 전용 site UI가 아니라, 같은 site UI를 다른 provider에서 그리는 것이다.
    if (!site) {
      bdEl.innerHTML = createInlineError(
        ERROR_MESSAGES.SITE_NOT_FOUND,
        () => window.location.reload(),
        '새로고침'
      ).outerHTML;
      return;
    }
    const requestId = ++siteViewReqId;
    const requestStartedAt = Date.now();
    const requestMeta = {
      requestId: requestId,
      site: site,
      startedAt: requestStartedAt,
      progress: {
        owner: "runtime-bootstrap",
        kind: "site-view-load",
        state: "loading",
        progressKind: "indeterminate",
        done: 0,
        total: 0,
        ratio: 0,
        percent: 0,
        label: "원본 패널 진행상태와 동기화 중",
        detail:
          getSiteLabel(site) +
          " 사이트 상세 데이터를 불러오는 중입니다. 새로운 수집을 다시 시작하지 않습니다.",
        updatedAt: requestStartedAt,
      },
    };
    siteViewLoadInFlightMeta = requestMeta;
    const requestPromise = (async function () {

    // Get account label from siteOwnership for display
    const payloadSiteData =
      (typeof window !== "undefined" &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__ &&
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__.dataBySite)
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__.dataBySite[site]
        : null;
    const payloadSourceAccount =
      (payloadSiteData && payloadSiteData.__source) ||
      (payloadSiteData && payloadSiteData.__meta && payloadSiteData.__meta.__source) ||
      (payloadSiteData && payloadSiteData._merge && payloadSiteData._merge.__source) ||
      null;
    const accountLabel = formatSiteOwnershipLabelForDisplay(site, payloadSourceAccount);

    // Keep header meta concise in site mode; current site is already visible in the combo box.
    labelEl.innerHTML = sanitizeHTML(`<span></span>`);
    labelEl.classList.add("sadv-meta-hidden");
    labelEl.title = accountLabel
      ? `${getSiteLabel(site)} · ${accountLabel}`
      : getSiteLabel(site);

    bdEl.replaceChildren(
      createStateCard(
        "로딩 중",
        "사이트 데이터를 불러오고 있습니다.",
        ICONS.refresh.replace('width="13" height="13"', 'width="18" height="18"'),
        "neutral",
      )
    );
    let d;
    try {
      if (typeof getRuntimeMode === "function" && getRuntimeMode() === "snapshot") {
        d = typeof getRuntimeSiteData === "function" ? getRuntimeSiteData(site) : null;
      } else {
        d = await fetchSiteData(site);
      }
    } catch (e) {
      bdEl.innerHTML = createInlineError(
        ERROR_MESSAGES.DATA_LOAD_FAILED,
        () => loadSiteView(site),
        '다시 시도'
      ).outerHTML;
      return;
    }
    // Phase 1 seam:
    // site detail request guard도 현재 선택 사이트를 selection seam에서 읽는다.
    // 이유:
    // - live/saved가 같은 "현재 선택 사이트" 정의를 공유해야 하고
    // - 향후 curSite direct read 제거 시 가장 먼저 안전하게 옮길 수 있는 읽기 지점이기 때문이다.
    const selectionState =
      typeof getRuntimeSelectionState === "function"
        ? getRuntimeSelectionState()
        : { curMode, curSite, curTab };
    if (requestId !== siteViewReqId || site !== selectionState.curSite) return;
    if (!d || !d.expose || !d.expose.items || !d.expose.items.length) {
      bdEl.replaceChildren(
        createStateCard(
          "데이터 없음",
          "이 사이트의 데이터가 없습니다.",
          ICONS.xMark.replace('width="14" height="14"', 'width="22" height="22"'),
          "warning",
        )
      );
      return;
    }
    const R = buildRenderers(d.expose, d.crawl, d.backlink, d.diagnosisMeta);
    window.__sadvR = R;
    renderTab(R);
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    })();
    siteViewLoadInFlightPromise = requestPromise;
    try {
      return await requestPromise;
    } finally {
      if (siteViewLoadInFlightPromise === requestPromise) {
        siteViewLoadInFlightPromise = null;
        siteViewLoadInFlightMeta = null;
      }
    }
  }

  /**
 * Build a summary row object for a site in the all sites view
 * Extracts key metrics from site data for display in the overview
 * @param {string} site - Site URL
 * @param {Object|null} data - Site data object with expose, crawl, backlink, diagnosisMeta
 * @returns {Object} Summary row object with metrics
 * @example
 * const row = buildSiteSummaryRow('https://example.com', siteData);
 * console.log(row.totalC); // Total clicks
 * console.log(row.avgCtr); // Average CTR
 */
  function buildSiteSummaryRow(site, data) {
    // 이 row는 전체현황/live/snapshot/merge가 공유하는 90일 canonical row다.
    // period filter 기능은 이 row의 의미를 바꾸지 않고,
    // 클릭/노출/날짜 raw series만 additive로 더 제공해 derived row 계산에 쓴다.
    const item = (data && data.expose && data.expose.items && data.expose.items[0]) || {};
    const logs = (item.logs || []).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const clicks = logs.map((r) => Number(r.clickCount) || 0);
    const exposes = logs.map((r) => Number(r.exposeCount) || 0);
    const dates = logs.map(function (r) {
      return String((r && r.date) || "").replace(/[^\d]/g, "").slice(0, 8);
    });
    const totalC = clicks.reduce((a, b) => a + b, 0);
    const totalE = exposes.reduce((a, b) => a + b, 0);
    const avgCtr = totalE ? (totalC / totalE) * 100 : 0;
    const cSt = st(clicks);
    const period = item.period || {};
    const diagnosisItem =
      (data && data.diagnosisMeta && data.diagnosisMeta.items && data.diagnosisMeta.items[0]) || {};
    const diagnosisLogs = [...(diagnosisItem.meta || [])].sort((a, b) =>
      (a.date || "").localeCompare(b.date || ""),
    );

    // Debug logging for diagnosis data
    if (diagnosisLogs.length > 0) {
      }
    const diagnosisLatest =
      diagnosisLogs.length > 0 ? diagnosisLogs[diagnosisLogs.length - 1] : null;
    const diagnosisLatestCounts =
      diagnosisLatest && diagnosisLatest.stateCount ? diagnosisLatest.stateCount : {};
    const diagnosisIndexedValues = diagnosisLogs.map(function (row) {
      return (row.stateCount && row.stateCount["1"]) || 0;
    });
    const diagnosisIndexedDates = diagnosisLogs.map(function (row) {
      const digits = String(row.date || "").replace(/[^\d]/g, "");
      return digits.length === 8 ? fmtB(digits) : row.date || "";
    });
    // Get source account from active payload/merge metadata
    const initSiteData =
      (typeof window !== "undefined" && window.__sadvMergedData && window.__sadvMergedData.sites
        ? window.__sadvMergedData.sites[site]
        : null) ||
      (typeof window !== "undefined" && window.__sadvInitData && window.__sadvInitData.sites
        ? window.__sadvInitData.sites[site]
        : null) ||
      (typeof window !== "undefined" && window.__SEARCHADVISOR_EXPORT_PAYLOAD__ && window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteData
        ? window.__SEARCHADVISOR_EXPORT_PAYLOAD__.siteData[site]
        : null);
    const sourceAccount =
      (data && data._merge && data._merge.__source) ||
      (data && data.__meta && data.__meta.__source) ||
      (data && data.__source) ||
      (initSiteData && initSiteData._merge && initSiteData._merge.__source) ||
      (initSiteData && initSiteData.__meta && initSiteData.__meta.__source) ||
      null;

    const accountLabel = formatSiteOwnershipLabelForDisplay(site, sourceAccount);

    return {
      site,
      totalC,
      totalE,
      avgCtr: +avgCtr.toFixed(2),
      trend: cSt.slope || 0,
      latestClick: clicks.slice(-7).reduce((a, b) => a + b, 0),
      prevClickRatio: period.prevClickRatio != null && Number.isFinite(parseFloat(period.prevClickRatio)) ? parseFloat(period.prevClickRatio) : undefined,
      logs,
      clicks,
      exposes,
      dates,
      baseWindowDays: 90,
      diagnosisIndexedCurrent: diagnosisLatestCounts["1"] || 0,
      diagnosisIndexedValues,
      diagnosisIndexedDates,
      diagnosisLatestDate: diagnosisLatest && diagnosisLatest.date ? diagnosisLatest.date : "-",
      diagnosisMetaCode:
        data && data.diagnosisMeta && typeof data.diagnosisMeta.code !== "undefined"
          ? data.diagnosisMeta.code
          : null,
      diagnosisMetaStatus:
        data && typeof data.diagnosisMetaStatus !== "undefined"
          ? data.diagnosisMetaStatus
          : null,
      diagnosisMetaRange:
        data && typeof data.diagnosisMetaRange !== "undefined"
          ? data.diagnosisMetaRange
          : null,
      sourceAccount: sourceAccount,
      accountLabel: accountLabel, // New field for account label display
    };
  }
