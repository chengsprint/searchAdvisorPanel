// fetchWithRetry function is provided by 00-constants.js

// ============================================================
// P2-3: API RESPONSE VALIDATION
// ============================================================

/**
 * API 응답 스키마 정의 (간소화 버전)
 * 각 API 엔드포인트의 예상 응답 구조 정의
 */
const API_RESPONSE_SCHEMAS = {
  EXPOSE: {
    required: ['code'],
    optional: ['items', 'message']
  },
  CRAWL: {
    required: ['code'],
    optional: ['items', 'message']
  },
  BACKLINK: {
    required: ['code'],
    optional: ['items', 'message']
  },
  DIAGNOSIS_META: {
    required: ['code'],
    optional: ['items', 'message']
  }
};

/**
 * API 응답 기본 검증
 * @param {object} response - 검증할 API 응답
 * @param {string} apiType - API 유형
 * @returns {object} { valid: boolean, errors: string[] }
 */
function validateApiResponse(response, apiType) {
  const schema = API_RESPONSE_SCHEMAS[apiType];
  if (!schema) {
    return { valid: true, errors: [] }; // 알 수 없는 타입은 통과
  }

  const errors = [];

  // null 체크
  if (!response || typeof response !== 'object') {
    return { valid: false, errors: ['Response is null or not an object'] };
  }

  // 필수 필드 검증
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in response)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // code 필드 검증 (대부분의 API 응답에 있음)
  if ('code' in response && response.code !== 0) {
    errors.push(`API returned error code: ${response.code}`);
  }

  // items 배열 구조 기본 검증
  if (response.items && !Array.isArray(response.items)) {
    errors.push('items field is not an array');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 안전한 JSON 파싱 함수
 * @param {Response} response - fetch Response 객체
 * @param {string} apiType - API 유형
 * @returns {Promise<object|null>} 파싱된 데이터 또는 null
 */
async function safeParseJson(response, apiType) {
  try {
    const data = await response.json();
    const validation = validateApiResponse(data, apiType);

    if (!validation.valid) {
      console.warn(`[API] ${apiType} validation warnings:`, validation.errors.join(', '));
      // 데이터가 있으면 반환하고, 에러만 기록
      if (data && typeof data === 'object') {
        return data;
      }
    }
    return data;
  } catch (e) {
    console.error(`[API] ${apiType} JSON parse error:`, e);
    return null;
  }
}

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
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchExposeData');
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
      const expose = exposeRes.ok ? await safeParseJson(exposeRes, 'EXPOSE') : null;
      return persistSiteData(site, {
        expose: exposeRes.ok ? expose : null,
        exposeFetchState: exposeRes.ok ? "success" : "failure",
        exposeFetchedAt,
        exposeStatus: exposeRes.status,
        detailLoaded: false,
      });
    } catch (e) {
      showError(ERROR_MESSAGES.DATA_LOAD_FAILED, e, 'fetchExposeData');
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
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchCrawlData');
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
      const crawl = crawlRes.ok ? await safeParseJson(crawlRes, 'CRAWL') : null;
      return persistSiteData(site, {
        ...baseData,
        crawl: crawlRes.ok ? crawl : null,
        crawlFetchState: crawlRes.ok ? "success" : "failure",
        crawlFetchedAt,
        crawlStatus: crawlRes.status,
        detailLoaded: baseData.detailLoaded,
      });
    } catch (e) {
      showError(ERROR_MESSAGES.DETAIL_DATA_MISSING, e, 'fetchCrawlData');
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
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchBacklinkData');
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
      const backlink = backlinkRes.ok ? await safeParseJson(backlinkRes, 'BACKLINK') : null;
      return persistSiteData(site, {
        ...baseData,
        backlink: backlinkRes.ok ? backlink : null,
        backlinkFetchState: backlinkRes.ok ? "success" : "failure",
        backlinkFetchedAt,
        backlinkStatus: backlinkRes.status,
        detailLoaded: baseData.detailLoaded,
      });
    } catch (e) {
      showError(ERROR_MESSAGES.DETAIL_DATA_MISSING, e, 'fetchBacklinkData');
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
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchSiteData');
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
                  data: response.ok ? await safeParseJson(response, 'CRAWL') : null,
                  fetchedAt: Date.now(),
                };
              })
              .catch(function (e) {
                showError(ERROR_MESSAGES.DETAIL_DATA_MISSING, e, 'fetchSiteData-crawl');
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
                  data: response.ok ? await safeParseJson(response, 'BACKLINK') : null,
                  fetchedAt: Date.now(),
                };
              })
              .catch(function (e) {
                showError(ERROR_MESSAGES.DETAIL_DATA_MISSING, e, 'fetchSiteData-backlink');
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

async function refreshExportSiteData(site) {
  delete memCache[site];
  clearCachedData(site);
  return fetchSiteData(site, { force: true, retryIncomplete: true });
}

async function ensureExportSiteList(refreshMode) {
  const forceSiteListRefresh = refreshMode === "refresh";
  await loadSiteList(forceSiteListRefresh);
  assignColors();
  ensureCurrentSite();
}

async function resolveExportSiteData(site, options) {
  const refreshMode = options && options.refreshMode === "refresh" ? "refresh" : "cache-first";
  if (refreshMode === "refresh") return refreshExportSiteData(site);
  return fetchSiteData(site, { retryIncomplete: true });
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
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchDiagnosisMeta');
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
        diagnosisMeta = response.ok ? await safeParseJson(response, 'DIAGNOSIS_META') : null;
        if (response.ok && diagnosisMeta && diagnosisMeta.code === 0) {
          diagnosisMetaFetchState = "success";
        }
      } catch (e) {
        showError(ERROR_MESSAGES.DATA_LOAD_ERROR, e, 'fetchDiagnosisMeta');
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
