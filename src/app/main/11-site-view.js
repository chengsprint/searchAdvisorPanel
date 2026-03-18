  /**
 * Load and render the site detail view for a specific site
 * Fetches all data types (expose, crawl, backlink, diagnosisMeta) and renders tabs
 * @param {string} site - Site URL to load
 * @returns {Promise<void>}
 * @example
 * await loadSiteView('https://example.com');
 * @see {buildRenderers}
 */
  async function loadSiteView(site) {
    if (!site) {
      bdEl.innerHTML = createInlineError(
        ERROR_MESSAGES.SITE_NOT_FOUND,
        () => window.location.reload(),
        '새로고침'
      ).outerHTML;
      return;
    }
    const requestId = ++siteViewReqId;

    // Get account label from siteOwnership for display
    let accountLabel = null;
    if (window.__sadvInitData && window.__sadvInitData.siteOwnership) {
      const owners = window.__sadvInitData.siteOwnership[site];
      if (owners && owners.length > 0) {
        accountLabel = owners[0];
        if (owners.length > 1) {
          accountLabel = `${owners[0]} (+${owners.length - 1})`;
        }
      }
    }

    // Update label with account info
    const labelContent = `<span>${escHtml(getSiteLabel(site))}</span>`;
    if (accountLabel) {
      labelEl.innerHTML = sanitizeHTML(
        labelContent +
        `<span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;border:1px solid rgba(14,165,233,0.2);color:#0ea5e9;background:rgba(14,165,233,0.1);font-size:10px;font-weight:600;margin-left:8px" title="${escHtml(accountLabel)}">${escHtml(accountLabel.includes("@") ? accountLabel.split("@")[0] : accountLabel)}</span>`
      );
    } else {
      labelEl.innerHTML = sanitizeHTML(labelContent);
    }

    bdEl.innerHTML = sanitizeHTML(`<div style="padding:50px 20px;text-align:center;color:#64748b"><div style="display:inline-flex;align-items:center;gap:8px">${ICONS.refresh.replace('width="13" height="13"','width="16" height="16"')} 로딩 중...</div></div>`);
    let d;
    try {
      d = await fetchSiteData(site);
    } catch (e) {
      bdEl.innerHTML = createInlineError(
        ERROR_MESSAGES.DATA_LOAD_FAILED,
        () => loadSiteView(site),
        '다시 시도'
      ).outerHTML;
      return;
    }
    if (requestId !== siteViewReqId || site !== curSite) return;
    if (!d || !d.expose || !d.expose.items || !d.expose.items.length) {
      bdEl.innerHTML = sanitizeHTML(
        `<div style="padding:40px 20px;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:16px;color:#ef4444">${ICONS.xMark.replace('width="14" height="14"','width="22" height="22"')}</div><div style="color:#f8fafc;font-weight:700;font-size:14px;margin-bottom:6px">데이터 없음</div><div style="color:#64748b;font-size:12px">이 사이트의 데이터가 없습니다</div></div>`
      );
      return;
    }
    const R = buildRenderers(d.expose, d.crawl, d.backlink, d.diagnosisMeta);
    window.__sadvR = R;
    renderTab(R);
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
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
    const item = (data && data.expose && data.expose.items && data.expose.items[0]) || {};
    const logs = (item.logs || []).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const clicks = logs.map((r) => Number(r.clickCount) || 0);
    const exposes = logs.map((r) => Number(r.exposeCount) || 0);
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

    // Get account ownership from siteOwnership (V2 multi-account)
    let accountLabel = null;
    if (typeof window !== "undefined" && window.__sadvInitData && window.__sadvInitData.siteOwnership) {
      const owners = window.__sadvInitData.siteOwnership[site];
      if (owners && owners.length > 0) {
        // Use first owner email as account label
        accountLabel = owners[0];
        // If multiple accounts, show count
        if (owners.length > 1) {
          accountLabel = `${owners[0]} (+${owners.length - 1})`;
        }
      }
    }
    // Fallback to sourceAccount if available
    if (!accountLabel && sourceAccount) {
      accountLabel = typeof sourceAccount === "object" && sourceAccount.accountLabel
        ? sourceAccount.accountLabel
        : sourceAccount;
    }

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
