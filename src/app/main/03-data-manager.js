// ============================================================
// DATA-MANAGER - Data storage and caching utilities
// ============================================================

let allSites = [];
const memCache = {};

function getCacheNamespace() {
  // For demo/test mode, use a fixed namespace
  if (IS_DEMO_MODE) return 'demo';
  // For production, use account-based namespace
  return 'default';
}

// P0-3: ACCOUNT_UTILS 통합 - 중복 제거
// 이제 ACCOUNT_UTILS.getAccountLabel()을 사용하세요.
// getAccountLabel()은 ACCOUNT_UTILS로 이동됨.

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

async function loadSiteList(refresh = false) {
  console.log('[loadSiteList] Called with refresh:', refresh);

  // Check V2 format EXPORT_PAYLOAD first
  const exportPayload = window.__SEARCHADVISOR_EXPORT_PAYLOAD__;
  if (exportPayload) {
    console.log('[loadSiteList] Found EXPORT_PAYLOAD');

    // P0-2: V2 다중 계정 구조 지원 완성
    if (exportPayload.__meta && exportPayload.accounts) {
      return handleV2MultiAccount(exportPayload);
    }

    // 레거시 V1 포맷은 지원하지 않음 (Big Bang Migration 완료)
    // V2 포맷이 아닌 경우 빈 배열 반환
    if (exportPayload && !exportPayload.__meta) {
      console.warn('[loadSiteList] Unsupported payload format (missing __meta)');
      return [];
    }
  }

  // Check if we have init data
  const initData = window.__sadvInitData;
  if (initData && initData.sites) {
    const sites = Object.keys(initData.sites);
    console.log('[loadSiteList] Found init data with sites:', sites);
    allSites.length = 0;
    allSites.push(...sites);
    return sites;
  }

  // Check merged data
  const mergedData = window.__sadvMergedData;
  if (mergedData && mergedData.sites) {
    const sites = Object.keys(mergedData.sites);
    console.log('[loadSiteList] Found merged data with sites:', sites);
    allSites.length = 0;
    allSites.push(...sites);
    return sites;
  }

  // Check cache
  if (!refresh) {
    const cached = lsGet(getSiteListCacheKey());
    if (cached && cached.sites && Array.isArray(cached.sites)) {
      console.log('[loadSiteList] Found cached sites:', cached.sites);
      allSites.length = 0;
      allSites.push(...cached.sites);
      return cached.sites;
    }
  }

  console.log('[loadSiteList] No sites found, returning empty array');
  return [];
}

// ============================================================================
// P0-2: V2 다중 계정 구조 지원 완성
// ============================================================================
// V2 다중 계정 감지 및 병합 처리
// ============================================================================
function handleV2MultiAccount(payload, mergeStrategy) {
  // P1: V2 데이터 검증
  // 1. 기본 V2 포맷 검증
  if (!DATA_VALIDATION.isValidV2Payload(payload)) {
    console.error('[V2 Multi-Account] Invalid V2 payload format');
    return [];
  }

  // 2. 메타데이터 검증
  const meta = payload.__meta;
  if (!meta.version || !meta.exportedAt) {
    console.error('[V2 Multi-Account] Invalid metadata');
    return [];
  }

  // 3. 스키마 버전 검증
  if (!SCHEMA_VERSIONS.isSupported(meta.version)) {
    console.warn(`[V2 Multi-Account] Unsupported schema version: ${meta.version}`);
  }

  // 4. 계정 데이터 검증 및 유효한 계정만 필터링
  const accountKeys = Object.keys(payload.accounts);
  if (accountKeys.length === 0) {
    console.error('[V2 Multi-Account] No accounts found');
    return [];
  }

  const validAccounts = [];
  for (const accKey of accountKeys) {
    const account = payload.accounts[accKey];
    if (DATA_VALIDATION.isValidAccount(account)) {
      // P1: 데이터 일관성 검증
      const validation = DATA_VALIDATION.validateAccountData(account);
      if (!validation.valid) {
        console.warn(`[V2 Multi-Account] Account ${accKey} data inconsistency:`, validation);

        // 불일치가 있는 계정은 유효 목록에 추가하지 않음 (원본 데이터 보존)
        if (validation.missingData.length > 0 || validation.orphanSites.length > 0) {
          console.warn(`[V2 Multi-Account] Skipping ${accKey}: ${validation.missingData.length} missing, ${validation.orphanSites.length} orphan sites`);
        }
      } else {
        validAccounts.push(accKey);
      }
    } else {
      console.warn(`[V2 Multi-Account] Invalid account structure: ${accKey}`);
    }
  }

  if (validAccounts.length === 0) {
    console.error('[V2 Multi-Account] No valid accounts found');
    return [];
  }

  console.log(`[V2 Multi-Account] Found ${validAccounts.length} valid accounts (out of ${accountKeys.length} total)`);

  // 병합 전략 기본값 설정
  mergeStrategy = mergeStrategy || MERGE_STRATEGIES.DEFAULT;

  // P0-2: 다중 계정 상태 저장
  window.__sadvAccountState = {
    isMultiAccount: validAccounts.length > 1,
    currentAccount: validAccounts[0],
    allAccounts: validAccounts,
    accountsData: {},
    mergeStrategy: mergeStrategy
  };

  // 모든 계정 데이터 사이트별 병합
  const mergedSites = {};
  const siteOwnership = {}; // site -> [accountEmails]

  for (const accKey of validAccounts) {
    const account = payload.accounts[accKey];
    const sites = account.sites || [];

    for (const site of sites) {
      // 사이트별로 계정 목록 추적
      if (!siteOwnership[site]) {
        siteOwnership[site] = [];
      }
      siteOwnership[site].push(accKey);

      // 데이터 병합 (전략에 따라 처리)
      const siteData = account.dataBySite?.[site];
      if (siteData) {
        let shouldMerge = false;

        switch (mergeStrategy) {
          case MERGE_STRATEGIES.NEWER:
            // 최신 데이터 우선
            const existingTime = mergedSites[site]?.__meta?.__fetched_at ||
                                 mergedSites[site]?._merge?.__fetchedAt || 0;
            const newTime = siteData.__meta?.__fetched_at ||
                           siteData._merge?.__fetchedAt || 0;
            shouldMerge = !mergedSites[site] || newTime > existingTime;
            break;

          case MERGE_STRATEGIES.FIRST:
            // 첫 번째 계정 데이터 우선 (이미 병합된 데이터 유지)
            shouldMerge = !mergedSites[site];
            break;

          case MERGE_STRATEGIES.SOURCE:
            // 소스 데이터 우선 (나중에 들어온 데이터로 덮어쓰기)
            shouldMerge = true;
            break;

          case MERGE_STRATEGIES.ALL:
            // 모든 데이터 보존 - 현재는 첫 번째만 사용 (향후 확장)
            shouldMerge = !mergedSites[site];
            break;

          default:
            // 알 수 없는 전략은 NEWER로 처리
            const defTime = mergedSites[site]?.__meta?.__fetched_at ||
                            mergedSites[site]?._merge?.__fetchedAt || 0;
            const srcTime = siteData.__meta?.__fetched_at ||
                           siteData._merge?.__fetchedAt || 0;
            shouldMerge = !mergedSites[site] || srcTime > defTime;
        }

        if (shouldMerge) {
          mergedSites[site] = siteData;
        }
      }
    }

    // 계정별 데이터 저장
    window.__sadvAccountState.accountsData[accKey] = {
      encId: account.encId,
      sites: sites,
      siteMeta: account.siteMeta || {},
      dataBySite: account.dataBySite || {}
    };
  }

  // 병합된 사이트 데이터를 __sadvInitData에 저장
  window.__sadvInitData = {
    sites: mergedSites,
    siteOwnership: siteOwnership,
    isV2: true,
    currentAccount: accountKeys[0],
    _rawPayload: payload
  };

  const siteList = Object.keys(mergedSites);
  console.log(`[V2 Multi-Account] Merged ${siteList.length} sites from ${accountKeys.length} accounts`);

  allSites.length = 0;
  allSites.push(...siteList);

  return siteList;
}

// ============================================================================
// P0-2: 계정 전환 UI 추가
// ============================================================================
function switchAccount(accountEmail) {
  if (!window.__sadvAccountState || !window.__sadvAccountState.isMultiAccount) {
    console.warn('[Account] Not multi-account mode');
    return;
  }

  const prevAccount = window.__sadvAccountState.currentAccount;

  // 현재 계정 업데이트
  window.__sadvAccountState.currentAccount = accountEmail;

  console.log(`[Account] Switching from ${prevAccount} to ${accountEmail}`);

  // 계정별 데이터 로드
  const accountData = window.__sadvAccountState.accountsData[accountEmail];
  if (!accountData) {
    console.error(`[Account] No data found for account: ${accountEmail}`);
    return;
  }

  // 현재 사이트가 이 계정에 있는지 확인
  const currentSite = curSite || null;
  const sitesInAccount = accountData.sites || [];

  // __sadvInitData 업데이트
  window.__sadvInitData.sites = accountData.dataBySite || {};
  window.__sadvInitData.currentAccount = accountEmail;

  // UI 업데이트
  if (typeof updateUIState === 'function') {
    updateUIState({ curAccount: accountEmail });
  }

  // 현재 사이트가 이 계정에 없으면 첫 번째 사이트로 변경
  if (currentSite && !sitesInAccount.includes(currentSite)) {
    const newSite = sitesInAccount[0] || null;
    if (typeof updateUIState === 'function') {
      updateUIState({ curSite: newSite });
    }
    if (newSite && typeof setComboSite === 'function') {
      setComboSite(newSite);
    }
  }

  // 사이트 콤보 재구축
  if (typeof buildCombo === 'function') {
    buildCombo(window.__sadvRows || null);
  }

  // 현재 뷰 다시 렌더링
  if (curMode === CONFIG.MODE.SITE && curSite) {
    if (typeof loadSiteView === 'function') {
      loadSiteView(curSite);
    }
  } else if (curMode === CONFIG.MODE.ALL) {
    if (typeof renderAllSites === 'function') {
      renderAllSites();
    }
  }

  if (typeof __sadvNotify === 'function') {
    __sadvNotify();
  }
}

// 계정 정보 반환 함수
function getAccountList() {
  if (!window.__sadvAccountState || !window.__sadvAccountState.isMultiAccount) {
    return [];
  }

  return window.__sadvAccountState.allAccounts.map(accKey => {
    const accData = window.__sadvAccountState.accountsData[accKey];
    return {
      email: accKey,
      label: accKey.split('@')[0],
      fullLabel: accKey,
      encId: accData?.encId || '',
      siteCount: accData?.sites?.length || 0
    };
  });
}
