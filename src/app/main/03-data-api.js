// ============================================================
// DATA-API - API calls and data fetching
// ============================================================

const FIELD_FAILURE_RETRY_MS = 5 * 60 * 1000;
const FIELD_SUCCESS_TTL_MS = DATA_TTL;

/**
 * Check if data has own property
 * @param {Object} data - Data object
 * @param {string} key - Property key
 * @returns {boolean} True if has own property
 */
function hasOwnDataField(data, key) {
  return !!data && Object.prototype.hasOwnProperty.call(data, key);
}

/**
 * Get field snapshot fetched timestamp
 * @param {Object} data - Data object
 * @param {string} key - Field key
 * @returns {number|null} Timestamp or null
 */
function getFieldSnapshotFetchedAt(data, key) {
  if (!data) return null;
  const fetchedAt = data[key + "FetchedAt"];
  if (typeof fetchedAt === "number") return fetchedAt;
  return typeof data.__cacheSavedAt === "number" ? data.__cacheSavedAt : null;
}

/**
 * Check if has fresh field snapshot
 * @param {Object} data - Data object
 * @param {string} key - Field key
 * @param {number} ttlMs - TTL in milliseconds
 * @returns {boolean} True if has fresh snapshot
 */
function hasFreshFieldSnapshot(data, key, ttlMs = FIELD_SUCCESS_TTL_MS) {
  const fetchedAt = getFieldSnapshotFetchedAt(data, key);
  const effectiveTtlMs =
    typeof ttlMs === "number" && Number.isFinite(ttlMs) && ttlMs > 0
      ? ttlMs
      : getDataTtlMs();
  return typeof fetchedAt === "number" && Date.now() - fetchedAt < effectiveTtlMs;
}

/**
 * Check if has legacy successful field snapshot
 * @param {Object} data - Data object
 * @param {string} key - Field key
 * @returns {boolean} True if has legacy snapshot
 */
function hasLegacySuccessfulFieldSnapshot(data, key) {
  if (!data) return false;
  if (key === "expose") return data.expose != null;
  if ((key === "crawl" || key === "backlink") && data.detailLoaded === true) {
    return data[key] != null;
  }
  return false;
}

/**
 * Check if has successful field snapshot
 * @param {Object} data - Data object
 * @param {string} key - Field key
 * @returns {boolean} True if has successful snapshot
 */
function hasSuccessfulFieldSnapshot(data, key) {
  return !!(
    data &&
    hasFreshFieldSnapshot(data, key) &&
    hasOwnDataField(data, key) &&
    (data[key + "FetchState"] === "success" ||
      hasLegacySuccessfulFieldSnapshot(data, key))
  );
}

/**
 * Check if has recent field failure
 * @param {Object} data - Data object
 * @param {string} key - Field key
 * @param {number} cooldownMs - Cooldown in milliseconds
 * @returns {boolean} True if has recent failure
 */
function hasRecentFieldFailure(data, key, cooldownMs = FIELD_FAILURE_RETRY_MS) {
  return !!(
    data &&
    data[key + "FetchState"] === "failure" &&
    typeof data[key + "FetchedAt"] === "number" &&
    Date.now() - data[key + "FetchedAt"] < cooldownMs
  );
}

/**
 * Check if should fetch field
 * @param {Object} data - Data object
 * @param {string} key - Field key
 * @param {Object} options - Options { force, retryIncomplete }
 * @returns {boolean} True if should fetch
 */
function shouldFetchField(data, key, options) {
  if (options && options.force) return true;
  if (hasSuccessfulFieldSnapshot(data, key)) return false;
  if (options && options.retryIncomplete) return true;
  return !hasRecentFieldFailure(data, key);
}

/**
 * Check if has detail snapshot
 * @param {Object} data - Data object
 * @returns {boolean} True if has detail snapshot
 */
function hasDetailSnapshot(data) {
  return hasSuccessfulFieldSnapshot(data, "crawl") && hasSuccessfulFieldSnapshot(data, "backlink");
}

/**
 * Check if has successful diagnosis meta snapshot
 * @param {Object} data - Data object
 * @returns {boolean} True if has successful diagnosis meta
 */
function hasSuccessfulDiagnosisMetaSnapshot(data) {
  return !!(
    data &&
    hasFreshFieldSnapshot(data, "diagnosisMeta") &&
    ((data.diagnosisMeta && data.diagnosisMeta.code === 0 && data.diagnosisMetaRange) ||
      data.diagnosisMetaFetchState === "success")
  );
}

/**
 * Check if has recent diagnosis meta failure
 * @param {Object} data - Data object
 * @param {number} cooldownMs - Cooldown in milliseconds
 * @returns {boolean} True if has recent failure
 */
function hasRecentDiagnosisMetaFailure(
  data,
  cooldownMs = FIELD_FAILURE_RETRY_MS,
) {
  return !!(
    data &&
    data.diagnosisMetaFetchState === "failure" &&
    typeof data.diagnosisMetaFetchedAt === "number" &&
    Date.now() - data.diagnosisMetaFetchedAt < cooldownMs
  );
}

/**
 * Check if has diagnosis meta snapshot
 * @param {Object} data - Data object
 * @returns {boolean} True if has diagnosis meta snapshot
 */
function hasDiagnosisMetaSnapshot(data) {
  return hasSuccessfulDiagnosisMetaSnapshot(data) || hasRecentDiagnosisMetaFailure(data);
}

/**
 * Check if should fetch diagnosis meta
 * @param {Object} data - Data object
 * @param {Object} options - Options
 * @returns {boolean} True if should fetch
 */
function shouldFetchDiagnosisMeta(data, options) {
  if (options && options.force) return true;
  if (hasSuccessfulDiagnosisMetaSnapshot(data)) return false;
  if (options && options.retryIncomplete) return true;
  return !hasRecentDiagnosisMetaFailure(data);
}

/**
 * Normalize site data
 * @param {Object} data - Raw site data
 * @returns {Object|null} Normalized site data
 */
function normalizeSiteData(data) {
  if (!data) return null;
  const normalized = {
    expose: hasOwnDataField(data, "expose") ? data.expose ?? null : null,
    crawl: hasOwnDataField(data, "crawl") ? data.crawl ?? null : null,
    backlink: hasOwnDataField(data, "backlink") ? data.backlink ?? null : null,
    detailLoaded:
      typeof data.detailLoaded === "boolean"
        ? data.detailLoaded || hasDetailSnapshot(data)
        : hasDetailSnapshot(data),
  };
  if (hasOwnDataField(data, "diagnosisMeta")) normalized.diagnosisMeta = data.diagnosisMeta ?? null;
  if (hasOwnDataField(data, "diagnosisMetaStatus"))
    normalized.diagnosisMetaStatus = data.diagnosisMetaStatus ?? null;
  if (hasOwnDataField(data, "diagnosisMetaRange"))
    normalized.diagnosisMetaRange = data.diagnosisMetaRange ?? null;
  if (hasOwnDataField(data, "diagnosisMetaFetchState"))
    normalized.diagnosisMetaFetchState = data.diagnosisMetaFetchState ?? null;
  if (hasOwnDataField(data, "diagnosisMetaFetchedAt"))
    normalized.diagnosisMetaFetchedAt = data.diagnosisMetaFetchedAt ?? null;
  if (hasOwnDataField(data, "exposeFetchState")) normalized.exposeFetchState = data.exposeFetchState ?? null;
  if (hasOwnDataField(data, "exposeFetchedAt")) normalized.exposeFetchedAt = data.exposeFetchedAt ?? null;
  if (hasOwnDataField(data, "exposeStatus")) normalized.exposeStatus = data.exposeStatus ?? null;
  if (hasOwnDataField(data, "crawlFetchState")) normalized.crawlFetchState = data.crawlFetchState ?? null;
  if (hasOwnDataField(data, "crawlFetchedAt")) normalized.crawlFetchedAt = data.crawlFetchedAt ?? null;
  if (hasOwnDataField(data, "crawlStatus")) normalized.crawlStatus = data.crawlStatus ?? null;
  if (hasOwnDataField(data, "backlinkFetchState"))
    normalized.backlinkFetchState = data.backlinkFetchState ?? null;
  if (hasOwnDataField(data, "backlinkFetchedAt"))
    normalized.backlinkFetchedAt = data.backlinkFetchedAt ?? null;
  if (hasOwnDataField(data, "backlinkStatus")) normalized.backlinkStatus = data.backlinkStatus ?? null;
  if (hasOwnDataField(data, "__cacheSavedAt")) normalized.__cacheSavedAt = data.__cacheSavedAt ?? null;

  // Merge metadata for multi-account support
  normalized.__source = hasOwnDataField(data, "__source") ? data.__source : null;
  normalized.__fetchedAt = hasOwnDataField(data, "__fetchedAt") ? data.__fetchedAt : null;
  normalized.__version = hasOwnDataField(data, "__version") ? data.__version : 1;
  normalized.__accountId = hasOwnDataField(data, "__accountId") ? data.__accountId : null;
  normalized.__importedFrom = hasOwnDataField(data, "__importedFrom") ? data.__importedFrom : null;
  normalized.__importedAt = hasOwnDataField(data, "__importedAt") ? data.__importedAt : null;

  return normalized;
}

/**
 * Get cached site snapshot
 * @param {string} site - Site URL
 * @returns {Object|null} Site snapshot
 */
function getCachedSiteSnapshot(site) {
  const cached = normalizeSiteData(getCachedData(site));
  const memCache = getMemCache();
  const live = normalizeSiteData(memCache[site]);
  if (!cached && !live) return null;
  return normalizeSiteData({ ...(cached || {}), ...(live || {}) });
}

/**
 * Create empty site data object
 * @returns {Object} Empty site data
 */
function emptySiteData() {
  return {
    expose: null,
    crawl: null,
    backlink: null,
    detailLoaded: false,
  };
}

/**
 * Persist site data
 * @param {string} site - Site URL
 * @param {Object} data - Site data to persist
 * @returns {Promise<Object>} Persisted data
 */
function persistSiteData(site, data) {
  const memCache = getMemCache();
  const next =
    normalizeSiteData({ ...(getCachedSiteSnapshot(site) || emptySiteData()), ...(data || {}) }) ||
    emptySiteData();
  memCache[site] = next;

  // Return promise for async write
  return setCachedData(site, next).then(() => next);
}

/**
 * Merge data from multiple accounts into a single dataset
 * @param {Object} target - Target memCache object
 * @param {Object} source - Source data to merge
 * @param {Object} options - Merge options { overwrite: boolean, mergeStrategy: 'newer'|'all' }
 * @returns {Object} Merged data
 */
function mergeSiteData(target, source, options = {}) {
  const { overwrite = false, mergeStrategy = 'newer' } = options;

  if (!source) return target;
  if (!target) return source;

  const result = { ...target };

  for (const site of Object.keys(source)) {
    const sourceData = source[site];
    const targetData = result[site];

    if (!targetData) {
      // New site - just add it
      result[site] = sourceData;
    } else {
      // Existing site - merge based on strategy
      const shouldOverwrite = overwrite ||
        (mergeStrategy === 'newer' &&
         (sourceData.__fetchedAt || 0) > (targetData.__fetchedAt || 0));

      if (shouldOverwrite) {
        result[site] = sourceData;
      } else {
        // Merge individual fields
        for (const key of Object.keys(sourceData)) {
          if (!targetData[key] || overwrite) {
            result[site][key] = sourceData[key];
          }
        }
      }
    }
  }

  return result;
}

/**
 * Export data for backup/transfer
 * @param {Object} memCache - Memory cache to export
 * @returns {Object} Exportable data with metadata
 */
function exportSiteData(memCache) {
  return {
    __exportVersion: 1,
    __exportedAt: Date.now(),
    __exportSource: 'SearchAdvisor Runtime',
    sites: Object.keys(memCache).reduce((acc, site) => {
      acc[site] = { ...memCache[site] };
      return acc;
    }, {})
  };
}

/**
 * Import data from export
 * @param {Object} memCache - Target memory cache
 * @param {Object} exportData - Data to import
 * @param {Object} options - Import options
 * @returns {Object} Merged memCache
 */
function importSiteData(memCache, exportData, options = {}) {
  if (!exportData || !exportData.sites) return memCache;

  const importedCache = { ...memCache };

  // Add import metadata
  for (const site of Object.keys(exportData.sites)) {
    const data = exportData.sites[site];
    data.__importedFrom = exportData.__exportSource || 'unknown';
    data.__importedAt = Date.now();

    if (!importedCache[site]) {
      importedCache[site] = data;
    } else {
      // Use merge function
      importedCache[site] = mergeSiteData(
        { [site]: importedCache[site] },
        { [site]: data },
        options
      )[site];
    }
  }

  return importedCache;
}

/**
 * Fetch expose data from API
 * @param {string} site - Site URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Fetch result
 */
async function fetchExposeData(site, options = {}) {
  try {
    const apiUrl = `${API.BASE_URL}${API.ENDPOINTS.EXPOSE}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site: site,
        encId: ACCOUNT_UTILS.getEncId(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response
    if (!DATA_VALIDATION.isValidExposeResponse(data)) {
      throw new Error('Invalid expose response format');
    }

    // Update site data with fetched data
    const memCache = getMemCache();
    const siteData = memCache[site] || emptySiteData();

    siteData.expose = data;
    siteData.exposeFetchState = 'success';
    siteData.exposeFetchedAt = Date.now();
    siteData.exposeStatus = data.code === 0 ? 'success' : 'error';

    // Persist to cache
    await persistSiteData(site, siteData);

    return {
      success: true,
      data: data,
      cached: false,
    };
  } catch (error) {
    console.error('[fetchExposeData] Error:', error);

    // Update failure state
    const memCache = getMemCache();
    const siteData = memCache[site] || emptySiteData();
    siteData.exposeFetchState = 'failure';
    siteData.exposeFetchedAt = Date.now();
    siteData.exposeStatus = 'error';

    await persistSiteData(site, siteData);

    return {
      success: false,
      error: error.message,
      cached: false,
    };
  }
}

/**
 * Fetch crawl data from API
 * @param {string} site - Site URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Fetch result
 */
async function fetchCrawlData(site, options = {}) {
  try {
    const apiUrl = `${API.BASE_URL}${API.ENDPOINTS.CRAWL}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site: site,
        encId: ACCOUNT_UTILS.getEncId(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response
    if (!DATA_VALIDATION.isValidCrawlResponse(data)) {
      throw new Error('Invalid crawl response format');
    }

    // Update site data with fetched data
    const memCache = getMemCache();
    const siteData = memCache[site] || emptySiteData();

    siteData.crawl = data;
    siteData.crawlFetchState = 'success';
    siteData.crawlFetchedAt = Date.now();
    siteData.crawlStatus = data.code === 0 ? 'success' : 'error';
    siteData.detailLoaded = true;

    // Persist to cache
    await persistSiteData(site, siteData);

    return {
      success: true,
      data: data,
      cached: false,
    };
  } catch (error) {
    console.error('[fetchCrawlData] Error:', error);

    // Update failure state
    const memCache = getMemCache();
    const siteData = memCache[site] || emptySiteData();
    siteData.crawlFetchState = 'failure';
    siteData.crawlFetchedAt = Date.now();
    siteData.crawlStatus = 'error';

    await persistSiteData(site, siteData);

    return {
      success: false,
      error: error.message,
      cached: false,
    };
  }
}

/**
 * Fetch backlink data from API
 * @param {string} site - Site URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Fetch result
 */
async function fetchBacklinkData(site, options = {}) {
  try {
    const apiUrl = `${API.BASE_URL}${API.ENDPOINTS.BACKLINK}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site: site,
        encId: ACCOUNT_UTILS.getEncId(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response
    if (!DATA_VALIDATION.isValidBacklinkResponse(data)) {
      throw new Error('Invalid backlink response format');
    }

    // Update site data with fetched data
    const memCache = getMemCache();
    const siteData = memCache[site] || emptySiteData();

    siteData.backlink = data;
    siteData.backlinkFetchState = 'success';
    siteData.backlinkFetchedAt = Date.now();
    siteData.backlinkStatus = data.code === 0 ? 'success' : 'error';
    siteData.detailLoaded = true;

    // Persist to cache
    await persistSiteData(site, siteData);

    return {
      success: true,
      data: data,
      cached: false,
    };
  } catch (error) {
    console.error('[fetchBacklinkData] Error:', error);

    // Update failure state
    const memCache = getMemCache();
    const siteData = memCache[site] || emptySiteData();
    siteData.backlinkFetchState = 'failure';
    siteData.backlinkFetchedAt = Date.now();
    siteData.backlinkStatus = 'error';

    await persistSiteData(site, siteData);

    return {
      success: false,
      error: error.message,
      cached: false,
    };
  }
}
