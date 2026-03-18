  function validateDataSchema(data) {
    const result = { valid: true, version: null, errors: [] };

    if (!data || typeof data !== 'object') {
      result.valid = false;
      result.errors.push('Data is not an object');
      return result;
    }

    // Check schema version
    if (data.__schema_version) {
      result.version = data.__schema_version;
      const supportedVersions = ['1.0', '1'];
      if (!supportedVersions.includes(result.version)) {
        result.valid = false;
        result.errors.push(`Unsupported schema version: ${result.version}`);
      }
    } else {
      // Legacy data (no version) - treat as v1.0
      result.version = '1.0';
    }

    // Check required metadata fields
    const isSingleExport = data.exportFormat === "snapshot-v2" || (data.__exported_at && data.__source_enc_id);
    const isMerged = data.__merged_at && data.accounts_merged;

    if (!isSingleExport && !isMerged) {
      result.valid = false;
      result.errors.push('Missing required export/merge metadata fields');
    }

    // Validate sites object
    if (data.sites && typeof data.sites === 'object') {
      for (const [site, siteData] of Object.entries(data.sites)) {
        if (!site.startsWith('http')) {
          result.valid = false;
          result.errors.push(`Invalid site URL: ${site}`);
        }
        if (siteData && typeof siteData === 'object') {
          // Site data must have at least expose field
          if (!siteData.expose && !siteData.crawl && !siteData.backlink) {
            result.valid = false;
            result.errors.push(`Site ${site} has no data fields`);
          }
        }
      }
    }

    return result;
  }

  /**
   * Migrate data to target schema version
   * @param {Object} data - Data to migrate
   * @param {string} targetVersion - Target version (e.g., "1.0")
   * @returns {Object} Migrated data
   */
  function migrateSchema(data, targetVersion = SCHEMA_VERSION) {
    if (!data) return null;

    const validation = validateDataSchema(data);
    let currentVersion = validation.version || '1.0';

    // Add version if missing (must be before version check for legacy data)
    if (!data.__schema_version) {
      data.__schema_version = currentVersion;
    }

    // If already at target version, return as-is
    if (currentVersion === targetVersion) {
      return data;
    }

    // Future migrations will go here
    // Example: if (currentVersion === '1.0' && targetVersion === '2.0') { ... }

    return data;
  }

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
   * Export current account data with full metadata
   * @returns {Object} Exportable data object
   */
  function exportCurrentAccountData() {
    const now = new Date().toISOString();

    // Collect all site data from localStorage
    const sites = {};
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

        const site = atob(match[1]);

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
            __source: accountLabel || 'unknown',
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
        console.error('[Export] Error processing key:', key, e);
      }
    }

    // V2: Nested accounts structure
    const accountEmail = (accountLabel && accountLabel.includes('@'))
      ? accountLabel
      : 'unknown@naver.com';
    const siteList = Object.keys(sites);

    return {
      __meta: {
        version: PAYLOAD_V2.VERSION,
        exportedAt: now,
        generator: 'SearchAdvisor Runtime',
        generatorVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || 'unknown',
        accountCount: 1
      },
      accounts: {
        [accountEmail]: {
          encId: encId || 'unknown',
          sites: siteList,
          siteMeta: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
          dataBySite: sites
        }
      }
    };
  }

  /**
   * Import account data from exported format
   * @param {Object} exportData - Data from exportCurrentAccountData()
   * @param {Object} options - Import options
   * @returns {Object} Import result
   */
  function importAccountData(exportData, options = {}) {
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
          error: 'No accounts found in export data'
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
      // Legacy format
      data = exportData;

      // Validate schema if requested
      if (validate) {
        const validation = validateDataSchema(exportData);
        if (!validation.valid) {
          return {
            success: false,
            error: 'Schema validation failed',
            errors: validation.errors
          };
        }
      }

      // Migrate to current schema if needed
      const migrated = migrateSchema(exportData);
      sourceAccount = migrated.__source_account || 'unknown';
      sourceEncId = migrated.__source_enc_id || 'unknown';
      sitesToImport = migrated.sites || {};
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

    // Import each site
    for (const [site, siteData] of Object.entries(sitesToImport)) {
      try {
        const cacheKey = getSiteDataCacheKey(site);
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
        console.error('[Import] Error importing site:', site, e);
      }
    }

    saveMergeRegistry(registry);

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
   * Save merge registry
   */
  function saveMergeRegistry(registry) {
    try {
      localStorage.setItem(MERGE_REGISTRY_KEY, JSON.stringify(registry));
    } catch (e) {}
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
