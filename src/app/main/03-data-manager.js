// ============================================================
// DATA-MANAGER - Data storage and caching utilities
// ============================================================
//
// ⚠️ 내부용 로컬 전용 모듈 (INTERNAL LOCAL-ONLY MODULE)
//
// 이 모듈은 각 사용자의 로컬 환경에서만 사용됩니다:
// - 브라우저 콘솔에서 직접 실행
// - 외부 패키지로 배포하지 않음
// - ES6 import/export 사용하지 않음
//
// This module is the entry point for data management functionality.
// It has been split into 4 focused modules:
//
// - 03-data-cache.js: Cache management (lsGet, lsSet, getCachedData, setCachedData)
// - 03-data-v2.js: V2 processing (handleV2MultiAccount, migrateV1ToV2)
// - 03-data-api.js: API calls (fetchExposeData, fetchCrawlData, fetchBacklinkData)
// - 03-data-state.js: State management (switchAccount, getCurrentAccount, loadSiteList)
//
// All public APIs are re-exported here for backward compatibility.
// ============================================================

// ============================================================
// PUBLIC API EXPORTS
// ============================================================

/**
 * Data Manager API
 * Provides access to all data management functionality
 */
const DATA_MANAGER_API = {
  // Cache operations (from 03-data-cache.js)
  lsGet,
  lsSet,
  getCachedData,
  setCachedData,
  clearCachedData,
  getSiteListCacheKey,
  getSiteDataCacheKey,
  getSiteListCacheStamp,
  getSiteDataCacheStamp,
  getUiStateCacheKey,
  getCachedUiState,
  setCachedUiState,
  getMemCache,
  getAllSites,
  setAllSites,

  // V2 operations (from 03-data-v2.js)
  handleV2MultiAccount,
  migrateV1ToV2,
  migrateV2ToV1,
  normalizeLegacyCache,
  detectAndMigrateV1Data,
  extractSiteUrlFromCacheKey,
  backupV1Data,
  canMigrateV1,
  getMigrationStats,

  // API operations (from 03-data-api.js)
  hasOwnDataField,
  getFieldSnapshotFetchedAt,
  hasFreshFieldSnapshot,
  hasLegacySuccessfulFieldSnapshot,
  hasSuccessfulFieldSnapshot,
  hasRecentFieldFailure,
  shouldFetchField,
  hasDetailSnapshot,
  hasSuccessfulDiagnosisMetaSnapshot,
  hasRecentDiagnosisMetaFailure,
  hasDiagnosisMetaSnapshot,
  shouldFetchDiagnosisMeta,
  normalizeSiteData,
  getCachedSiteSnapshot,
  emptySiteData,
  persistSiteData,
  mergeSiteData,
  exportSiteData,
  importSiteData,
  fetchExposeData,
  fetchCrawlData,
  fetchBacklinkData,

  // State operations (from 03-data-state.js)
  loadSiteList,
  switchAccount,
  getAccountList,
  getCurrentAccount,
  isMultiAccountMode,
  getAccountState,
  setAccountState,
};

// Make API available globally for debugging
if (typeof window !== 'undefined') {
  window.DATA_MANAGER_API = DATA_MANAGER_API;
}
