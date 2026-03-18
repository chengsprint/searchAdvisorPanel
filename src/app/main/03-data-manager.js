// ============================================================
// DATA-MANAGER - Data storage and caching utilities
// ============================================================

let allSites = [];
const memCache = {};

function lsGet(k) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    console.error('[lsGet] Error:', e);
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

function getCachedData(site) {
  const d = lsGet(getSiteDataCacheKey(site));
  if (!d) return null;
  if (!d.data || typeof d.data !== "object") return null;
  if (d.ts && Date.now() - d.ts > DATA_TTL) return null; // TTL 검증 추가
  return {
    ...d.data,
    __cacheSavedAt: typeof d.ts === "number" ? d.ts : null,
  };
}

function setCachedData(site, data) {
  lsSet(getSiteDataCacheKey(site), {
    ts: Date.now(),
    data,
  });
}

function clearCachedData(site) {
  try {
    localStorage.removeItem(getSiteDataCacheKey(site));
  } catch (e) {
    console.error('[clearCachedData] Error:', e);
  }
}

function getSiteListCacheKey() {
  return SITE_LS_KEY + "_" + getCacheNamespace();
}

function getSiteDataCacheKey(site) {
  return DATA_LS_PREFIX + getCacheNamespace() + "_" + btoa(site).replace(/=/g, "");
}

function getSiteListCacheStamp() {
  const cached = lsGet(getSiteListCacheKey());
  return cached && typeof cached.ts === "number" ? cached.ts : null;
}

function getSiteDataCacheStamp(site) {
  const cached = lsGet(getSiteDataCacheKey(site));
  return cached && typeof cached.ts === "number" ? cached.ts : null;
}

function getUiStateCacheKey() {
  return UI_STATE_LS_KEY + "_" + getCacheNamespace();
}

function getCachedUiState() {
  const cached = lsGet(getUiStateCacheKey());
  if (!cached || typeof cached !== "object") return null;
  if (cached.ts && Date.now() - cached.ts > 7 * 24 * 60 * 60 * 1000) return null; // 7일 TTL
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

const FIELD_FAILURE_RETRY_MS = 5 * 60 * 1000;
const FIELD_SUCCESS_TTL_MS = DATA_TTL;

function hasOwnDataField(data, key) {
  return !!data && Object.prototype.hasOwnProperty.call(data, key);
}

function getFieldSnapshotFetchedAt(data, key) {
  if (!data) return null;
  const fetchedAt = data[key + "FetchedAt"];
  if (typeof fetchedAt === "number") return fetchedAt;
  return typeof data.__cacheSavedAt === "number" ? data.__cacheSavedAt : null;
}

function hasFreshFieldSnapshot(data, key, ttlMs = FIELD_SUCCESS_TTL_MS) {
  const fetchedAt = getFieldSnapshotFetchedAt(data, key);
  return typeof fetchedAt === "number" && Date.now() - fetchedAt < ttlMs;
}

function hasLegacySuccessfulFieldSnapshot(data, key) {
  if (!data) return false;
  if (key === "expose") return data.expose != null;
  if ((key === "crawl" || key === "backlink") && data.detailLoaded === true) {
    return data[key] != null;
  }
  return false;
}

function hasSuccessfulFieldSnapshot(data, key) {
  return !!(
    data &&
    hasFreshFieldSnapshot(data, key) &&
    hasOwnDataField(data, key) &&
    (data[key + "FetchState"] === "success" ||
      hasLegacySuccessfulFieldSnapshot(data, key))
  );
}

function hasRecentFieldFailure(data, key, cooldownMs = FIELD_FAILURE_RETRY_MS) {
  return !!(
    data &&
    data[key + "FetchState"] === "failure" &&
    typeof data[key + "FetchedAt"] === "number" &&
    Date.now() - data[key + "FetchedAt"] < cooldownMs
  );
}

function shouldFetchField(data, key, options) {
  if (options && options.force) return true;
  if (hasSuccessfulFieldSnapshot(data, key)) return false;
  if (options && options.retryIncomplete) return true;
  return !hasRecentFieldFailure(data, key);
}

function hasDetailSnapshot(data) {
  return hasSuccessfulFieldSnapshot(data, "crawl") && hasSuccessfulFieldSnapshot(data, "backlink");
}

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

function getCachedSiteSnapshot(site) {
  const cached = normalizeSiteData(getCachedData(site));
  const live = normalizeSiteData(memCache[site]);
  if (!cached && !live) return null;
  return normalizeSiteData({ ...(cached || {}), ...(live || {}) });
}

function emptySiteData() {
  return {
    expose: null,
    crawl: null,
    backlink: null,
    detailLoaded: false,
  };
}

function persistSiteData(site, data) {
  const next =
    normalizeSiteData({ ...(getCachedSiteSnapshot(site) || emptySiteData()), ...(data || {}) }) ||
    emptySiteData();
  memCache[site] = next;
  setCachedData(site, next);
  return next;
}

function hasSuccessfulDiagnosisMetaSnapshot(data) {
  return !!(
    data &&
    hasFreshFieldSnapshot(data, "diagnosisMeta") &&
    ((data.diagnosisMeta && data.diagnosisMeta.code === 0 && data.diagnosisMetaRange) ||
      data.diagnosisMetaFetchState === "success")
  );
}

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

function hasDiagnosisMetaSnapshot(data) {
  return hasSuccessfulDiagnosisMetaSnapshot(data) || hasRecentDiagnosisMetaFailure(data);
}

function shouldFetchDiagnosisMeta(data, options) {
  if (options && options.force) return true;
  if (hasSuccessfulDiagnosisMetaSnapshot(data)) return false;
  if (options && options.retryIncomplete) return true;
  return !hasRecentDiagnosisMetaFailure(data);
}
