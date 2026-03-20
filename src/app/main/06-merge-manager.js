  // ============================================================================
  // CONSTANTS & CONFIGURATION
  // ============================================================================
  const SCHEMA_VERSION = "1.0";
  const MERGE_REGISTRY_KEY = "sadv_merge_registry";

  // P0-3: ACCOUNT_UTILS 통합 - 중복 제거
  // 이제 ACCOUNT_UTILS.getAccountInfo()을 사용하세요.
  // getAccountInfo()는 ACCOUNT_UTILS로 이동됨.

  // ============================================================================
  // P1: V2 레거시 제거 - validateDataSchema, migrateSchema 함수 제거됨
  // V2 포맷만 지원하며 레거시 마이그레이션은 불필요
  // ============================================================================

  /**
   * Detect conflicts between multiple accounts
   * @param {Object} accounts - Map of account data { encId: { sites: {...} } }
   * @returns {Object} { conflicts: [], bySite: {} }
   */
  function detectConflicts(accounts) {
    const result = { conflicts: [], bySite: {} };

    if (!accounts || typeof accounts !== 'object') {
      return result;
    }

    // Collect all sites from all accounts
    const siteAccounts = {}; // { site: [encId1, encId2, ...] }

    for (const [encId, accountData] of Object.entries(accounts)) {
      if (!accountData.sites) continue;

      for (const site of Object.keys(accountData.sites)) {
        if (!siteAccounts[site]) {
          siteAccounts[site] = [];
        }
        siteAccounts[site].push(encId);
      }
    }

    // Find sites that appear in multiple accounts
    for (const [site, accountList] of Object.entries(siteAccounts)) {
      if (accountList.length > 1) {
        result.bySite[site] = {
          accounts: accountList,
          count: accountList.length,
          severity: accountList.length > 2 ? 'high' : 'medium'
        };
        result.conflicts.push({
          site: site,
          accounts: accountList,
          message: `Site "${site}" exists in ${accountList.length} accounts`
        });
      }
    }

    return result;
  }

  /**
   * Merge data from multiple accounts
   * @param {Object} targetData - Base data
   * @param {Object} sourceData - Data to merge in
   * @param {Object} options - Merge options
   * @returns {Object} Merged data
   */
  function mergeAccounts(targetData, sourceData, options = {}) {
    const {
      strategy = 'newer',      // 'newer', 'all', 'target', 'source'
      onConflict = null,        // Custom conflict handler
      mergeLogs = true,         // Merge logs arrays
      mergeDates = true,        // Merge date ranges
      preserveSources = true    // Track data sources
    } = options;

    if (!sourceData || !sourceData.sites) {
      return targetData;
    }

    if (!targetData || !targetData.sites) {
      return sourceData;
    }

    const result = {
      ...targetData,
      sites: { ...targetData.sites }
    };

    const mergeInfo = [];

    for (const [site, sourceSiteData] of Object.entries(sourceData.sites)) {
      const targetSiteData = result.sites[site];

      if (!targetSiteData) {
        // New site - just add it
        result.sites[site] = sourceSiteData;
        mergeInfo.push({ site, action: 'added', source: 'source' });
      } else {
        // Site exists in both - merge based on strategy
        let mergedSiteData;

        switch (strategy) {
          case 'newer':
            // Support both _merge and __meta formats
            const sourceTime = sourceSiteData.__meta?.__fetched_at ||
                              sourceSiteData._merge?.__fetchedAt || 0;
            const targetTime = targetSiteData.__meta?.__fetched_at ||
                              targetSiteData._merge?.__fetchedAt || 0;
            mergedSiteData = sourceTime > targetTime ? sourceSiteData : targetSiteData;
            mergeInfo.push({ site, action: sourceTime > targetTime ? 'newer_source' : 'kept_target' });
            break;

          case 'source':
            mergedSiteData = sourceSiteData;
            mergeInfo.push({ site, action: 'overwrote_source' });
            break;

          case 'target':
            mergedSiteData = targetSiteData;
            mergeInfo.push({ site, action: 'kept_target' });
            break;

          case 'all':
            mergedSiteData = deepMergeSiteData(targetSiteData, sourceSiteData, {
              mergeLogs,
              mergeDates,
              preserveSources
            });
            mergeInfo.push({ site, action: 'deep_merged' });
            break;

          default:
            mergedSiteData = targetSiteData;
            mergeInfo.push({ site, action: 'kept_target_default' });
        }

        result.sites[site] = mergedSiteData;

        // Track sources if requested
        if (preserveSources) {
          if (!mergedSiteData.__sources) {
            mergedSiteData.__sources = [];
          }
          if (!mergedSiteData.__sources.includes(sourceData.__source_account)) {
            mergedSiteData.__sources.push(sourceData.__source_account);
          }
        }
      }
    }

    // Add merge metadata
    result.__merge_info = {
      merged_at: Date.now(),
      merge_count: mergeInfo.length,
      details: mergeInfo,
      strategy_used: strategy
    };

    return result;
  }

  /**
   * Deep merge site data (for 'all' strategy)
   */
  function deepMergeSiteData(target, source, options = {}) {
    const { mergeLogs = true, mergeDates = true, preserveSources = true } = options;

    const merged = { ...target };

    // Merge each data type (expose, crawl, backlink, diagnosisMeta)
    const dataTypes = ['expose', 'crawl', 'backlink', 'diagnosisMeta'];

    for (const type of dataTypes) {
      if (source[type] && target[type]) {
        merged[type] = deepMergeDataType(target[type], source[type], type, options);
      } else if (source[type]) {
        merged[type] = source[type];
      }
    }

    // Merge metadata (support both __meta and _merge)
    if (source.__meta && target.__meta) {
      merged.__meta = {
        ...target.__meta,
        __merged_at: Date.now(),
        __merge_sources: [
          ...(target.__meta.__merge_sources || [target.__meta.__source]),
          source.__meta.__source
        ].filter(Boolean)
      };
    }

    // Also merge _merge for compatibility
    if (source._merge && target._merge) {
      merged._merge = {
        ...target._merge,
        __mergedAt: Date.now(),
        __mergedFrom: [
          ...(target._merge.__mergedFrom || [target._merge.__source]),
          source._merge.__source
        ].filter(Boolean)
      };
    }

    return merged;
  }

  /**
   * Deep merge specific data type
   */
  function deepMergeDataType(target, source, type, options) {
    const { mergeLogs = true } = options;

    if (!target.items || !source.items) {
      return source || target;
    }

    const targetItem = target.items[0] || {};
    const sourceItem = source.items[0] || {};

    const mergedItem = { ...targetItem };

    // Merge logs by date
    if (mergeLogs && targetItem.logs && sourceItem.logs) {
      const logsMap = new Map();

      for (const log of [...targetItem.logs, ...sourceItem.logs]) {
        if (log && log.date) {
          const existing = logsMap.get(log.date);
          if (!existing || (log.__fetched_at || 0) > (existing.__fetched_at || 0)) {
            logsMap.set(log.date, log);
          }
        }
      }

      mergedItem.logs = Array.from(logsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }

    // Merge other arrays (urls, querys, stats, countTime)
    const arrayFields = {
      expose: ['urls', 'querys'],
      crawl: ['stats'],
      backlink: ['countTime'],
      diagnosisMeta: ['meta']
    }[type] || [];

    for (const field of arrayFields) {
      if (targetItem[field] && sourceItem[field]) {
        const map = new Map();
        for (const item of [...targetItem[field], ...sourceItem[field]]) {
          if (item && (item.url || item.key || item.domain || item.date || item.timeStamp)) {
            const key = item.url || item.key || item.domain || item.date || item.timeStamp;
            const existing = map.get(key);
            if (!existing) {
              map.set(key, item);
            }
          }
        }
        mergedItem[field] = Array.from(map.values());
      } else if (sourceItem[field]) {
        mergedItem[field] = sourceItem[field];
      }
    }

    // Merge topDomain if exists
    if (type === 'backlink' && (targetItem.topDomain || sourceItem.topDomain)) {
      mergedItem.topDomain = [...(targetItem.topDomain || []), ...(sourceItem.topDomain || [])];
    }

    return { items: [mergedItem] };
  }

  /**
   * P0-4: Export current account data with multi-account support
   * @param {Object} options - Export options { mode: 'current'|'all', includeAll: boolean }
   * @returns {Object} Exportable data object
   */
  function exportCurrentAccountData(options = {}) {
    const { mode = 'current', includeAll = false } = options;
    const now = new Date().toISOString();
    // P0-3: ACCOUNT_UTILS 사용
    const { accountLabel, encId } = ACCOUNT_UTILS.getAccountInfo();

    // 다중 계정 확인
    const isMultiAccount = window.__sadvAccountState?.isMultiAccount || false;

    // 다중 계정 모드에서 includeAll이 true면 모든 계정 내보내기
    if (isMultiAccount && includeAll) {
      return exportSingleAccount(null, encId, now, true);
    }

    // 단일 계정 모드이거나 현재 계정만 내보내기
    const currentAcc = isMultiAccount
      ? (window.__sadvAccountState?.currentAccount || accountLabel)
      : accountLabel;
    return exportSingleAccount(currentAcc, encId, now, false);
  }

  /**
   * P0-4: Export single account data
   * @param {string} accountEmail - Account email to export
   * @param {string} encId - Encrypted ID
   * @param {string} now - ISO timestamp
   * @param {boolean} includeAll - Whether to include all accounts
   * @returns {Object} Exportable V2 payload
   */
  function exportSingleAccount(accountEmail, encId, now, includeAll) {
    // 파라미터 검증 및 기본값 설정
    if (!now) {
      now = new Date().toISOString();
    }
    if (!encId) {
      encId = 'unknown';
    }

    let sites = {};
    let sitesList = [];
    let siteMeta = {};

    // 다중 계정 모드에서 includeAll이 true면 모든 계정 내보내기
    const shouldExportAll = includeAll && window.__sadvAccountState?.isMultiAccount;

    if (shouldExportAll) {
      // 모든 계정 내보내기
      const allAccounts = window.__sadvAccountState.allAccounts;

      // null 체크 및 유효성 검증
      if (!allAccounts || !Array.isArray(allAccounts) || allAccounts.length === 0) {
        console.warn('[exportSingleAccount] No valid accounts for export, falling back to single account mode');
        // 단일 계정 모드로 폴백
      } else {
        for (const accKey of allAccounts) {
          const accData = window.__sadvAccountState.accountsData[accKey];
          if (!accData) {
            console.warn(`[exportSingleAccount] Missing data for account: ${accKey}`);
            continue;
          }
          const accSites = accData?.sites || [];
          sitesList.push(...accSites);

          if (accData?.dataBySite) {
            Object.assign(sites, accData.dataBySite);
          }

          if (accData?.siteMeta) {
            Object.assign(siteMeta, accData.siteMeta);
          }
        }
        // 모든 계정 처리 성공
        if (sitesList.length > 0) {
          siteMeta = typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {};
          return buildExportPayload(accountEmail, encId, now, sitesList, sites, siteMeta, true);
        } else {
          console.warn('[exportSingleAccount] No sites found in any account, falling back to single account mode');
        }
      }
    }

    // 단일 계정 모드이거나 다중 계정 모드 실패 시 폴백
    if (!shouldExportAll || sitesList.length === 0) {
      // 현재 계정만 내보내기 (localStorage에서 데이터 수집)
      const keysToCheck = Object.keys(localStorage);

      for (const key of keysToCheck) {
        if (!key.startsWith(DATA_LS_PREFIX)) continue;
        if (!key.includes(getCacheNamespace())) continue;

        try {
          const value = localStorage.getItem(key);
          if (!value) continue;

          const data = JSON.parse(value);

          // Extract site from key
          const match = key.match(/_([^_]+)$/);
          if (!match) continue;

          let site;
          try {
            site = atob(match[1]);
          } catch (decodeError) {
            showError(ERROR_MESSAGES.DATA_INCONSISTENCY, decodeError, 'exportSingleAccount-decode');
            continue;
          }

          // Structure site data
          const fetchedAt = data.__cacheSavedAt || data.__fetched_at || Date.now();
          sites[site] = {
            // Current format (__meta)
            __meta: {
              __source: encId || 'unknown',
              __fetched_at: fetchedAt,
              __schema: SCHEMA_VERSION,
              __namespace: getCacheNamespace()
            },
            // Legacy format (_merge) for test compatibility
            _merge: {
              __source: accountEmail || 'unknown',
              __accountId: encId || 'unknown',
              __fetchedAt: fetchedAt,
              __version: 1
            },
            expose: data.expose || null,
            crawl: data.crawl || null,
            backlink: data.backlink || null,
            diagnosisMeta: data.diagnosisMeta || null,
            diagnosisMetaRange: data.diagnosisMetaRange || null,
            detailLoaded: data.detailLoaded || false
          };
        } catch (e) {
          showError(ERROR_MESSAGES.EXPORT_INCOMPLETE, e, 'exportSingleAccount');
        }
      }

      sitesList = Object.keys(sites);
      siteMeta = typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {};
    }

    // V2: Nested accounts structure
    // 계정 이메일 검증 강화 (공백 문자열, null, undefined 체크)
    const validAccountEmail = (accountEmail && typeof accountEmail === 'string' &&
                          accountEmail.trim() && accountEmail.includes('@'))
      ? accountEmail.trim()
      : 'unknown@naver.com';

    // Phase 1 seam:
    // merge/export payload도 현재 선택 상태를 curMode/curSite/curTab 전역에서 직접 읽기보다
    // selection facade를 우선 사용한다.
    //
    // 이유:
    // - merge 역시 live/saved와 같은 selection contract를 따라야 하고
    // - 이후 shared app entry 단계에서 export payload가 runtime kind에 따라
    //   다른 선택 상태를 담는 drift를 줄일 수 있기 때문이다.
    const currentSelectionState =
      typeof getRuntimeSelectionState === "function"
        ? getRuntimeSelectionState()
        : {
            curMode: (typeof curMode !== "undefined") ? curMode : "all",
            curSite: (typeof curSite !== "undefined") ? curSite : null,
            curTab: (typeof curTab !== "undefined") ? curTab : "overview",
          };

    return {
      __meta: {
        version: PAYLOAD_V2.VERSION,
        exportedAt: now,
        generator: 'SearchAdvisor Runtime',
        generatorVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || 'unknown',
        accountCount: includeAll ? (window.__sadvAccountState?.allAccounts?.length || 1) : 1
      },
      accounts: includeAll ? window.__sadvAccountState?.accountsData : {
        [validAccountEmail]: {
          encId: encId || 'unknown',
          sites: sitesList,
          siteMeta: siteMeta,
          dataBySite: sites
        }
      },
      ui: {
        curMode: currentSelectionState.curMode,
        curSite: currentSelectionState.curSite,
        curTab: currentSelectionState.curTab,
        curAccount: (typeof window.__sadvAccountState?.currentAccount !== "undefined")
          ? window.__sadvAccountState.currentAccount
          : validAccountEmail
      },
      stats: {
        success: sitesList.length,
        partial: 0,
        failed: 0,
        errors: []
      },
      _siteOwnership: window.__sadvInitData?.siteOwnership || {}
    };
  }

  /**
   * P1: Import account data from exported format with queue serialization
   * @param {Object} exportData - Data from exportCurrentAccountData()
   * @param {Object} options - Import options { overwrite, mergeStrategy, validate }
   * @returns {Promise<Object>} Promise that resolves with import result
   */
  async function importAccountData(exportData, options = {}) {
    const {
      overwrite = false,
      mergeStrategy = 'newer',
      validate = true
    } = options;

    // Handle V2 format
    let data, sourceAccount, sourceEncId, sitesToImport;

    if (exportData.__meta && exportData.accounts) {
      // V2 format
      const accounts = exportData.accounts;
      const accountKeys = Object.keys(accounts);
      if (accountKeys.length === 0) {
        return {
          success: false,
          error: ERROR_MESSAGES.NO_VALID_ACCOUNTS
        };
      }

      // For now, handle single account (first one found)
      const accountEmail = accountKeys[0];
      const account = accounts[accountEmail];

      data = exportData.__meta;
      sourceAccount = accountEmail;
      sourceEncId = account.encId || 'unknown';
      sitesToImport = account.dataBySite || {};
    } else {
      // V2 포맷이 아닌 레거시 데이터는 지원하지 않음
      return {
        success: false,
        error: ERROR_MESSAGES.IMPORT_FORMAT_ERROR
      };
    }

    const registry = getMergeRegistry();

    // Track this account
    registry.accounts[sourceEncId] = {
      label: sourceAccount,
      importedAt: Date.now(),
      encId: sourceEncId,
      schemaVersion: data.version || data.__schema_version
    };

    let importedCount = 0;
    let mergedCount = 0;
    let skippedCount = 0;
    const errors = [];

    // P1: Import sites sequentially to avoid race conditions
    for (const [site, siteData] of Object.entries(sitesToImport)) {
      try {
        const cacheKey = getSiteDataCacheKey(site);

        // Use safeWrite for each site import
        await safeWrite(cacheKey, async () => {
          const existing = localStorage.getItem(cacheKey);

          if (existing && !overwrite) {
            const existingData = JSON.parse(existing);
            // Support both _merge and __meta formats
            const sourceTime = siteData.__meta?.__fetched_at ||
                              siteData._merge?.__fetchedAt || 0;
            const targetTime = existingData.__cacheSavedAt ||
                              existingData.__meta?.__fetched_at ||
                              existingData._merge?.__fetchedAt || 0;

            if (mergeStrategy === 'newer' && sourceTime > targetTime) {
              // Import newer data
              siteData.__meta = siteData.__meta || {};
              siteData.__meta.__imported_from = sourceEncId;
              siteData.__meta.__imported_at = Date.now();
              localStorage.setItem(cacheKey, JSON.stringify(siteData));
              mergedCount++;
            } else {
              skippedCount++;
            }
          } else {
            // No existing data or overwrite
            siteData.__meta = siteData.__meta || {};
            siteData.__meta.__imported_from = sourceEncId;
            siteData.__meta.__imported_at = Date.now();
            localStorage.setItem(cacheKey, JSON.stringify(siteData));
            importedCount++;
          }
        });

        // Track in registry
        if (!registry.mergedSites) {
          registry.mergedSites = {};
        }
        if (!registry.mergedSites[site]) {
          registry.mergedSites[site] = [];
        }
        registry.mergedSites[site].push({
          encId: sourceEncId,
          importedAt: Date.now(),
          strategy: mergeStrategy
        });

      } catch (e) {
        errors.push({ site, error: e.message });
        showError(`${ERROR_MESSAGES.IMPORT_FAILED}: ${site}`, e, 'importAccountData');
      }
    }

    await saveMergeRegistry(registry);

    return {
      success: true,
      importedCount,
      mergedCount,
      skippedCount,
      errors,
      sourceAccount,
      sourceEncId
    };
  }

  /**
   * Get merge registry (tracks all imported accounts)
   */
  function getMergeRegistry() {
    try {
      const reg = localStorage.getItem(MERGE_REGISTRY_KEY);
      return reg ? JSON.parse(reg) : { accounts: {}, mergedSites: {} };
    } catch (e) {
      return { accounts: {}, mergedSites: {} };
    }
  }

  /**
   * P1: Save merge registry with queue serialization
   * @param {Object} registry - Registry data to save
   * @returns {Promise<void>} Promise that resolves when registry is saved
   */
  async function saveMergeRegistry(registry) {
    return safeWrite(MERGE_REGISTRY_KEY, async () => {
      try {
        localStorage.setItem(MERGE_REGISTRY_KEY, JSON.stringify(registry));
      } catch (e) {
        console.error('[saveMergeRegistry] Error:', e);
        throw e;
      }
    }, { skipLock: true }); // Skip lock for registry to avoid deadlock
  }

  /**
   * Get imported accounts list
   * @returns {Array} List of imported account info
   */
  function getImportedAccounts() {
    const registry = getMergeRegistry();
    return Object.values(registry.accounts).map(acc => ({
      label: acc.label,
      encId: acc.encId,
      importedAt: acc.importedAt,
      schemaVersion: acc.schemaVersion
    }));
  }

  /**
   * Get sites from a specific account
   * @param {string} encId - Account encId
   * @returns {Array} List of sites
   */
  function getSitesByAccount(encId) {
    const registry = getMergeRegistry();
    const sites = [];

    for (const [site, merges] of Object.entries(registry.mergedSites)) {
      if (merges && merges.some(m => m.encId === encId)) {
        sites.push(site);
      }
    }
    return sites;
  }
