// fetchWithRetry function is provided by 00-constants.js

// In-flight request tracking (prevents duplicate concurrent requests)
const inflightExpose = {};
const inflightCrawl = {};
const inflightBacklink = {};
const inflightDiagnosisMeta = {};

/**
 * Fetch expose data for a site
 * @param {string} site - Site URL
 * @param {object} options - Options { force, retryIncomplete }
 * @returns {Promise<object>} Site data with expose information
 */
async function fetchExposeData(site, options) {
  if (!encId || typeof encId !== 'string') {
    console.error('[fetchExposeData] Invalid encId:', encId);
    return null;
  }
  if (memCache[site] && !shouldFetchField(memCache[site], "expose", options)) {
    return normalizeSiteData(memCache[site]);
  }
  const cached = getCachedSiteSnapshot(site);
  if (cached && !shouldFetchField(cached, "expose", options)) {
    memCache[site] = cached;
    return cached;
  }
  if (!(options && options.force) && inflightExpose[site]) return inflightExpose[site];
  const enc = encodeURIComponent(site),
    base = "https://searchadvisor.naver.com/api-console/report";
  inflightExpose[site] = (async function () {
    try {
      const exposeFetchedAt = Date.now();
      const exposeRes = await fetchWithRetry(
        base + "/expose/" + encId + "?site=" + enc + "&period=90&device=&topN=50",
        { credentials: "include", headers: { accept: "application/json" } },
      );
      const expose = exposeRes.ok ? await exposeRes.json() : null;
      return persistSiteData(site, {
        expose: exposeRes.ok ? expose : null,
        exposeFetchState: exposeRes.ok ? "success" : "failure",
        exposeFetchedAt,
        exposeStatus: exposeRes.status,
        detailLoaded: false,
      });
    } catch (e) {
      return persistSiteData(site, {
        expose: null,
        exposeFetchState: "failure",
        exposeFetchedAt: Date.now(),
        exposeStatus: null,
        detailLoaded: false,
      });
    } finally {
      delete inflightExpose[site];
    }
  })();
  return inflightExpose[site];
}

/**
 * Fetch crawl data for a site
 * @param {string} site - Site URL
 * @param {object} options - Options { force, retryIncomplete }
 * @returns {Promise<object>} Site data with crawl information
 */
async function fetchCrawlData(site, options) {
  if (!encId || typeof encId !== 'string') {
    console.error('[fetchCrawlData] Invalid encId:', encId);
    return null;
  }
  const baseData = await fetchExposeData(site, options);
  if (!shouldFetchField(baseData, "crawl", options)) return baseData;
  if (!(options && options.force) && inflightCrawl[site]) return inflightCrawl[site];

  const enc = encodeURIComponent(site);
  const base = "https://searchadvisor.naver.com/api-console/report";
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const d90 = new Date(Date.now() - 90 * 864e5)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  inflightCrawl[site] = (async function () {
    try {
      const crawlFetchedAt = Date.now();
      const crawlRes = await fetchWithRetry(
        base +
          "/crawl/" +
          encId +
          "?site=" +
          enc +
          "&start_date=" +
          d90 +
          "&end_date=" +
          today +
          "&isAlly=false&count=5",
        { credentials: "include", headers: { accept: "application/json" } },
      );
      const crawl = crawlRes.ok ? await crawlRes.json() : null;
      return persistSiteData(site, {
        ...baseData,
        crawl: crawlRes.ok ? crawl : null,
        crawlFetchState: crawlRes.ok ? "success" : "failure",
        crawlFetchedAt,
        crawlStatus: crawlRes.status,
        detailLoaded: baseData.detailLoaded,
      });
    } catch (e) {
      return persistSiteData(site, {
        ...baseData,
        crawl: null,
        crawlFetchState: "failure",
        crawlFetchedAt: Date.now(),
        crawlStatus: null,
        detailLoaded: baseData.detailLoaded,
      });
    } finally {
      delete inflightCrawl[site];
    }
  })();

  return inflightCrawl[site];
}

/**
 * Fetch backlink data for a site
 * @param {string} site - Site URL
 * @param {object} options - Options { force, retryIncomplete }
 * @returns {Promise<object>} Site data with backlink information
 */
async function fetchBacklinkData(site, options) {
  if (!encId || typeof encId !== 'string') {
    console.error('[fetchBacklinkData] Invalid encId:', encId);
    return null;
  }
  const baseData = await fetchExposeData(site, options);
  if (!shouldFetchField(baseData, "backlink", options)) return baseData;
  if (!(options && options.force) && inflightBacklink[site]) return inflightBacklink[site];

  const enc = encodeURIComponent(site);
  const base = "https://searchadvisor.naver.com/api-console/report";
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const d90 = new Date(Date.now() - 90 * 864e5)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  inflightBacklink[site] = (async function () {
    try {
      const backlinkFetchedAt = Date.now();
      const backlinkRes = await fetchWithRetry(
        base +
          "/backlink/" +
          encId +
          "?site=" +
          enc +
          "&start_date=" +
          d90 +
          "&end_date=" +
          today,
        { credentials: "include", headers: { accept: "application/json" } },
      );
      const backlink = backlinkRes.ok ? await backlinkRes.json() : null;
      return persistSiteData(site, {
        ...baseData,
        backlink: backlinkRes.ok ? backlink : null,
        backlinkFetchState: backlinkRes.ok ? "success" : "failure",
        backlinkFetchedAt,
        backlinkStatus: backlinkRes.status,
        detailLoaded: baseData.detailLoaded,
      });
    } catch (e) {
      return persistSiteData(site, {
        ...baseData,
        backlink: null,
        backlinkFetchState: "failure",
        backlinkFetchedAt: Date.now(),
        backlinkStatus: null,
        detailLoaded: baseData.detailLoaded,
      });
    } finally {
      delete inflightBacklink[site];
    }
  })();

  return inflightBacklink[site];
}

/**
 * Fetch complete site data (expose + crawl + backlink)
 * @param {string} site - Site URL
 * @param {object} options - Options { force, retryIncomplete }
 * @returns {Promise<object>} Complete site data
 */
async function fetchSiteData(site, options) {
  if (!encId || typeof encId !== 'string') {
    console.error('[fetchSiteData] Invalid encId:', encId);
    return null;
  }
  const baseData = await fetchDiagnosisMeta(site, null, options);
  const needCrawl = shouldFetchField(baseData, "crawl", options);
  const needBacklink = shouldFetchField(baseData, "backlink", options);
  if (!needCrawl && !needBacklink) return baseData;
  if (!(options && options.force) && inflightDetail[site]) return inflightDetail[site];
  const enc = encodeURIComponent(site),
    base = "https://searchadvisor.naver.com/api-console/report";
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const d90 = new Date(Date.now() - 90 * 864e5)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  inflightDetail[site] = (async function () {
    try {
      const requests = await Promise.all([
        needCrawl
          ? fetchWithRetry(
              base +
                "/crawl/" +
                encId +
                "?site=" +
                enc +
                "&start_date=" +
                d90 +
                "&end_date=" +
                today +
                "&isAlly=false&count=5",
              { credentials: "include", headers: { accept: "application/json" } },
            )
              .then(async function (response) {
                return {
                  key: "crawl",
                  ok: response.ok,
                  status: response.status,
                  data: response.ok ? await response.json() : null,
                  fetchedAt: Date.now(),
                };
              })
              .catch(function () {
                return {
                  key: "crawl",
                  ok: false,
                  status: null,
                  data: null,
                  fetchedAt: Date.now(),
                };
              })
          : Promise.resolve({
              key: "crawl",
              ok: hasSuccessfulFieldSnapshot(baseData, "crawl"),
              status: baseData.crawlStatus ?? null,
              data: baseData.crawl ?? null,
              fetchedAt: baseData.crawlFetchedAt ?? null,
            }),
        needBacklink
          ? fetchWithRetry(
              base +
                "/backlink/" +
                encId +
                "?site=" +
                enc +
                "&start_date=" +
                d90 +
                "&end_date=" +
                today,
              { credentials: "include", headers: { accept: "application/json" } },
            )
              .then(async function (response) {
                return {
                  key: "backlink",
                  ok: response.ok,
                  status: response.status,
                  data: response.ok ? await response.json() : null,
                  fetchedAt: Date.now(),
                };
              })
              .catch(function () {
                return {
                  key: "backlink",
                  ok: false,
                  status: null,
                  data: null,
                  fetchedAt: Date.now(),
                };
              })
          : Promise.resolve({
              key: "backlink",
              ok: hasSuccessfulFieldSnapshot(baseData, "backlink"),
              status: baseData.backlinkStatus ?? null,
              data: baseData.backlink ?? null,
              fetchedAt: baseData.backlinkFetchedAt ?? null,
            }),
      ]);
      const next = { ...baseData };
      requests.forEach(function (result) {
        next[result.key] = result.ok ? result.data : null;
        next[result.key + "FetchState"] = result.ok ? "success" : "failure";
        next[result.key + "FetchedAt"] = result.fetchedAt;
        next[result.key + "Status"] = result.status;
      });
      next.detailLoaded =
        next.crawlFetchState === "success" && next.backlinkFetchState === "success";
      return persistSiteData(site, next);
    } finally {
      delete inflightDetail[site];
    }
  })();
  return inflightDetail[site];
}

/**
 * Fetch diagnosis meta data for a site
 * @param {string} site - Site URL
 * @param {object} seedData - Base data to use if available
 * @param {object} options - Options { force, retryIncomplete }
 * @returns {Promise<object>} Site data with diagnosis meta information
 */
async function fetchDiagnosisMeta(site, seedData, options) {
  if (!encId || typeof encId !== 'string') {
    console.error('[fetchDiagnosisMeta] Invalid encId:', encId);
    return null;
  }
  const baseData = seedData || (await fetchExposeData(site, options));
  if (!shouldFetchDiagnosisMeta(baseData, options)) return baseData;
  if (!(options && options.force) && inflightDiagnosisMeta[site]) return inflightDiagnosisMeta[site];
  const enc = encodeURIComponent(site),
    base = "https://searchadvisor.naver.com/api-console/report";
  const range = getDiagnosisMetaRange();
  inflightDiagnosisMeta[site] = (async function () {
    try {
      let response = null;
      let diagnosisMeta = null;
      let diagnosisMetaFetchState = "failure";
      const diagnosisMetaFetchedAt = Date.now();
      try {
        response = await fetchWithRetry(
          base +
            "/diagnosis/meta/" +
            encId +
            "?site=" +
            enc +
            "&startDate=" +
            range.startDate +
            "&endDate=" +
            range.endDate,
          { credentials: "include", headers: { accept: "application/json" } },
        );
        diagnosisMeta = response.ok ? await response.json() : null;
        if (response.ok && diagnosisMeta && diagnosisMeta.code === 0) {
          diagnosisMetaFetchState = "success";
        }
      } catch (e) {
        console.error('[fetchDiagnosisMeta] Error:', e);
      }
      return persistSiteData(site, {
        ...baseData,
        diagnosisMeta: diagnosisMetaFetchState === "success" ? diagnosisMeta : null,
        diagnosisMetaStatus: response ? response.status : null,
        diagnosisMetaRange: range,
        diagnosisMetaFetchState,
        diagnosisMetaFetchedAt,
        detailLoaded: !!baseData.detailLoaded,
      });
    } finally {
      delete inflightDiagnosisMeta[site];
    }
  })();
  return inflightDiagnosisMeta[site];
}

/**
 * Fetch expose data for multiple sites in batches
 * @param {string[]} sites - Array of site URLs
 * @returns {Promise<PromiseSettledResult<?>[]>} Array of settled promises
 */
async function fetchExposeDataBatch(sites) {
  const results = [];
  for (let i = 0; i < sites.length; i += ALL_SITES_BATCH) {
    results.push(
      ...(await Promise.allSettled(
        sites.slice(i, i + ALL_SITES_BATCH).map((s) => fetchExposeData(s)),
      )),
    );
    if (i + ALL_SITES_BATCH < sites.length) {
      await new Promise(r => setTimeout(r, 150 + Math.floor(Math.random() * 100)));
    }
  }
  return results;
}

/**
 * Calculate date range for diagnosis meta requests
 * @returns {object} Date range with startDate and endDate in YYYYMMDD format
 */
function getDiagnosisMetaRange() {
  const formatYmd = function (date) {
    if (!date) return "";
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return String(year) + month + day;
  };
  const todayKstLocal = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );
  const todayKst = new Date(
    Date.UTC(
      todayKstLocal.getFullYear(),
      todayKstLocal.getMonth(),
      todayKstLocal.getDate(),
    ),
  );
  const effectiveEndDate = todayKst;
  const effectiveStartDate = new Date(effectiveEndDate.getTime() - 40 * 864e5);
  return {
    startDate: formatYmd(effectiveStartDate),
    endDate: formatYmd(effectiveEndDate),
  };
}
