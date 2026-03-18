/**
 * Build renderer functions for all site data tabs
 * P0 Critical: Refactored into modular tab-specific renderers
 *
 * Architecture:
 * - Each tab has its own renderer module (08-renderers-*.js)
 * - Registry pattern for easy extensibility
 * - Shared data preparation logic
 * - Clear separation of concerns
 */

/**
 * Renderer Registry
 * Maps tab IDs to their renderer factory functions
 * New tabs can be added by registering here
 */
const RENDERER_REGISTRY = {
  overview: createOverviewRenderer,
  daily: createDailyRenderer,
  queries: createQueriesRenderer,
  urls: createPagesRenderer,
  pages: createPagesRenderer, // Alias for backward compatibility
  pattern: createPatternRenderer,
  crawl: createCrawlRenderer,
  backlink: createBacklinkRenderer,
  indexed: createDiagnosisRenderer,
  diagnosis: createDiagnosisRenderer, // Alias for backward compatibility
  insight: createInsightRenderer,
};

/**
 * Prepare shared data from raw API responses
 * This function transforms raw data into a format suitable for all renderers
 *
 * @param {Object} expose - Search Console exposure data
 * @param {Object} crawlData - Crawl statistics data
 * @param {Object} backlinkData - Backlink data
 * @param {Object} diagnosisMeta - Diagnosis/metadata
 * @returns {Object} Prepared data object with all computed values
 */
function prepareRendererData(expose, crawlData, backlinkData, diagnosisMeta) {
  const item = (expose && expose.items && expose.items[0]) || {};
  const period = item.period || {};
  const rawLogs = item.logs || [];
  const urls = item.urls || [];
  const queries = item.querys || [];

  // Process logs
  const logs = [...rawLogs].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const dates = logs.map((r) => fmtB(r.date));
  const clicks = logs.map((r) => Number(r.clickCount) || 0);
  const exposes = logs.map((r) => Number(r.exposeCount) || 0);
  const ctrs = logs.map((r) => {
    const n = parseFloat(r.ctr);
    return Number.isFinite(n) ? n : 0;
  });

  // Calculate statistics
  const cSt = st(clicks);
  const totalC = clicks.reduce((a, b) => a + b, 0);
  const totalE = exposes.reduce((a, b) => a + b, 0);
  const avgCtr = totalE ? ((totalC / totalE) * 100).toFixed(2) : "0.00";
  const corr = pearson(exposes, clicks);

  // Extract diagnosis data
  const diagnosisItem = (diagnosisMeta && diagnosisMeta.items && diagnosisMeta.items[0]) || {};
  const diagnosisLogs = [...(diagnosisItem.meta || [])].sort((a, b) =>
    (a.date || "").localeCompare(b.date || ""),
  );
  const diagnosisLatest = diagnosisLogs.length > 0 ? diagnosisLogs[diagnosisLogs.length - 1] : null;
  const diagnosisLatestCounts = diagnosisLatest?.stateCount || {};
  const diagnosisIndexedCurrent = diagnosisLatestCounts["1"] || 0;
  const diagnosisIndexedValues = diagnosisLogs.map(r => r.stateCount?.["1"] || 0);
  const diagnosisIndexedSeries = {
    current: diagnosisIndexedCurrent,
    values: diagnosisIndexedValues,
    color: C.purple,
  };

  // Day of week analysis
  const dowAcc = {};
  logs.forEach(function (r) {
    const dw = new Date(fmtD(r.date)).getDay();
    if (!dowAcc[dw]) dowAcc[dw] = { c: 0, n: 0 };
    dowAcc[dw].c += r.clickCount;
    dowAcc[dw].n++;
  });

  const dowRows = DOW.map(function (l, i) {
    return {
      label: l,
      avgC: dowAcc[i] ? Math.round(dowAcc[i].c / dowAcc[i].n) : 0,
      n: dowAcc[i] ? dowAcc[i].n : 0,
    };
  });

  const bestDow = dowRows.reduce(
    (a, b) => (b.avgC > a.avgC ? b : a),
    dowRows[0],
  );
  const worstDow = dowRows
    .filter((x) => x.n > 0)
    .reduce((a, b) => (b.avgC < a.avgC ? b : a), dowRows[0]);

  // Crawl data
  const crawlStats = crawlData?.items?.[0]?.stats || [];
  const crawlSorted = [...crawlStats].sort((a, b) =>
    (a.date || "").localeCompare(b.date || ""),
  );

  // Backlink data
  const blData = backlinkData?.items?.[0] || {};
  const blTime = (blData.countTime || []).sort((a, b) =>
    a.timeStamp?.localeCompare?.(b.timeStamp) || 0
  );
  const blTopDomains = blData.topDomain || [];

  return {
    // Basic data
    logs,
    urls,
    queries,
    dates,
    clicks,
    exposes,
    ctrs,
    period,

    // Computed values
    totalC,
    totalE,
    avgCtr,
    corr,
    cSt,

    // Day of week
    dowRows,
    bestDow,
    worstDow,

    // Diagnosis
    diagnosisLogs,
    diagnosisIndexedSeries,

    // Crawl
    crawlSorted,

    // Backlink
    blTime,
    blTopDomains,
  };
}

/**
 * Build renderers for all tabs using the registry pattern
 *
 * @param {Object} expose - Search Console exposure data
 * @param {Object} crawlData - Crawl statistics data
 * @param {Object} backlinkData - Backlink data
 * @param {Object} diagnosisMeta - Diagnosis/metadata
 * @returns {Object} Object with renderer functions for each tab
 */
function buildRenderers(expose, crawlData, backlinkData, diagnosisMeta) {
  // Prepare shared data once
  const data = prepareRendererData(expose, crawlData, backlinkData, diagnosisMeta);

  // Build renderers using registry
  const renderers = {};

  for (const [tabId, factory] of Object.entries(RENDERER_REGISTRY)) {
    if (typeof factory === 'function') {
      renderers[tabId] = factory(data);
    }
  }

  return renderers;
}

/**
 * Register a new renderer dynamically
 * Useful for plugins or extensions
 *
 * @param {string} tabId - Tab identifier
 * @param {Function} factory - Renderer factory function
 */
function registerRenderer(tabId, factory) {
  RENDERER_REGISTRY[tabId] = factory;
}

/**
 * Get list of available renderer tabs
 *
 * @returns {Array<string>} Array of tab IDs
 */
function getAvailableRenderers() {
  return Object.keys(RENDERER_REGISTRY);
}
