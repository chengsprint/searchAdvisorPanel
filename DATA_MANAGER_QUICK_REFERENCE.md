# Data Manager Module Split - Quick Reference

## File Structure

```
src/app/main/
├── 03-data-cache.js      (342 lines) - Cache management
├── 03-data-v2.js         (647 lines) - V2 multi-account support
├── 03-data-api.js        (557 lines) - API calls and data fetching
├── 03-data-state.js      (261 lines) - State management
└── 03-data-manager.js    (90 lines)  - Entry point (re-exports all APIs)
```

## Module Responsibilities

### 03-data-cache.js
**localStorage and cache operations**

```javascript
// Basic cache operations
lsGet(key)                      // Safe localStorage get
lsSet(key, value)               // Safe localStorage set (async)
getCachedData(site)             // Get cached site data
setCachedData(site, data)       // Set cached site data (async)
clearCachedData(site)           // Clear cached data (async)

// Cache key helpers
getSiteListCacheKey()           // Get site list cache key
getSiteDataCacheKey(site)       // Get site data cache key
getSiteListCacheStamp()         // Get site list timestamp
getSiteDataCacheStamp(site)     // Get site data timestamp

// UI state caching
getUiStateCacheKey()            // Get UI state cache key
getCachedUiState()              // Get cached UI state
setCachedUiState()              // Set cached UI state (async)

// Memory cache access
getMemCache()                   // Get memory cache reference
getAllSites()                   // Get all sites array
setAllSites(sites)              // Set all sites array
```

### 03-data-v2.js
**V2 multi-account support and V1 migration**

```javascript
// V2 multi-account handling
handleV2MultiAccount(payload, strategy)  // Handle V2 payload

// V1 to V2 migration
migrateV1ToV2(v1Payload, options)        // Migrate V1 to V2
migrateV2ToV1(v2Payload, options)        // Rollback V2 to V1
validateV1Payload(payload)               // Validate V1 payload
canMigrateV1(payload)                    // Check if migratable

// Cache migration
detectAndMigrateV1Data()                 // Detect and migrate V1 cache
normalizeLegacyCache(key, data)          // Normalize legacy cache
extractSiteUrlFromCacheKey(key)          // Extract URL from cache key

// Migration utilities
backupV1Data(payload)                    // Backup V1 data
getMigrationStats()                      // Get migration statistics
```

### 03-data-api.js
**API calls and data operations**

```javascript
// API calls
fetchExposeData(site, options)           // Fetch expose data (async)
fetchCrawlData(site, options)            // Fetch crawl data (async)
fetchBacklinkData(site, options)         // Fetch backlink data (async)

// Data validation
hasOwnDataField(data, key)               // Check for own property
hasSuccessfulFieldSnapshot(data, key)    // Check for successful data
shouldFetchField(data, key, options)     // Check if should fetch
hasDetailSnapshot(data)                  // Check for detail data

// Data normalization
normalizeSiteData(data)                  // Normalize site data
getCachedSiteSnapshot(site)              // Get site snapshot
emptySiteData()                          // Create empty site data

// Data persistence
persistSiteData(site, data)              // Persist site data (async)

// Data import/export
mergeSiteData(target, source, options)   // Merge site data
exportSiteData(memCache)                 // Export data
importSiteData(memCache, data, options)  // Import data
```

### 03-data-state.js
**State management and account switching**

```javascript
// Site list loading
loadSiteList(refresh)                    // Load site list (async)

// Account management (multi-account)
switchAccount(accountEmail)              // Switch active account
getAccountList()                         // Get list of accounts
getCurrentAccount()                      // Get current account
isMultiAccountMode()                     // Check multi-account mode

// Account state
getAccountState()                        // Get account state object
setAccountState(state)                   // Update account state
```

## Usage Examples

### Using the Entry Point (Recommended)
```javascript
// All functions available from main module
import { getCachedData, setCachedData, loadSiteList } from './03-data-manager.js';

// Or access via global API (for debugging)
window.DATA_MANAGER_API.getCachedData(site);
```

### Direct Module Imports (Advanced)
```javascript
// Import from specific modules for better tree-shaking
import { lsGet, lsSet } from './03-data-cache.js';
import { handleV2MultiAccount } from './03-data-v2.js';
import { fetchExposeData } from './03-data-api.js';
import { switchAccount } from './03-data-state.js';
```

## Common Patterns

### Reading Cached Data
```javascript
const data = getCachedData(site);
if (data) {
  console.log('Found cached data:', data);
} else {
  console.log('No cached data, fetching...');
}
```

### Writing Cached Data
```javascript
await setCachedData(site, {
  expose: exposeData,
  crawl: crawlData,
  backlink: backlinkData
});
```

### Multi-Account Switching
```javascript
if (isMultiAccountMode()) {
  const accounts = getAccountList();
  console.log('Available accounts:', accounts);
  switchAccount(accounts[0].email);
}
```

### V1 to V2 Migration
```javascript
if (canMigrateV1(payload)) {
  try {
    const v2Payload = migrateV1ToV2(payload, {
      accountEmail: 'user@example.com',
      encId: 'encrypted-id',
      validate: true
    });
    console.log('Migration successful:', v2Payload);
  } catch (e) {
    console.error('Migration failed:', e);
  }
}
```

## Dependencies

Module load order (as defined in build.js):
1. 03-data-cache.js (no dependencies on other data modules)
2. 03-data-v2.js (depends on cache module)
3. 03-data-api.js (depends on cache module)
4. 03-data-state.js (depends on cache and v2 modules)
5. 03-data-manager.js (entry point - re-exports all)

## Migration from Original File

### Before (Single File)
```javascript
// All functions in one file
import { getCachedData, setCachedData } from './03-data-manager.js';
```

### After (Split Modules)
```javascript
// Still works the same way!
import { getCachedData, setCachedData } from './03-data-manager.js';

// Or import from specific modules
import { getCachedData, setCachedData } from './03-data-cache.js';
```

## Benefits

1. **Maintainability**: Average 316 lines per module vs 1,392 lines
2. **Focus**: Each module has a single, clear purpose
3. **Navigation**: Easier to find and modify specific functionality
4. **Testing**: Smaller modules are easier to test in isolation
5. **Tree-shaking**: Can import only what you need (advanced usage)

## Backward Compatibility

✅ All existing code continues to work without changes
✅ All functions are re-exported from entry point
✅ Same API as before
✅ Global `DATA_MANAGER_API` available for debugging
