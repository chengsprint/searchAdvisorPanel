// ============================================================
// V2 PAYLOAD HELPER FUNCTIONS - FINAL VERSION
// ============================================================
// Integration Point: /home/seung/.cokacdir/workspace/yif7zotu/src/app/main/01-helpers.js
// Insert Location: After line 485 (after escHtml function)
// Dependencies: Uses P, PAYLOAD_SCHEMA from 00-constants.js
// Strategy: Big Bang Migration (v1 legacy removed)
// ============================================================

// ============================================================
// CACHE IMPLEMENTATION (Map + TTL 5 minutes)
// ============================================================

const V2_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const v2Cache = new Map();

/**
 * Create cache entry with timestamp
 * @private
 */
function createV2CacheEntry(value) {
  return {
    value,
    expiresAt: Date.now() + V2_CACHE_TTL_MS
  };
}

/**
 * Get cached value if not expired
 * @private
 */
function getV2Cached(key) {
  const entry = v2Cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    v2Cache.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Set cached value with TTL
 * @private
 */
function setV2Cached(key, value) {
  v2Cache.set(key, createV2CacheEntry(value));

  // Prevent unbounded growth: clean old entries periodically
  if (v2Cache.size > 100) {
    const now = Date.now();
    for (const [k, v] of v2Cache.entries()) {
      if (now > v.expiresAt) {
        v2Cache.delete(k);
      }
    }
  }
}

/**
 * Clear all V2 cache entries
 * @public
 */
function clearV2Cache() {
  v2Cache.clear();
}

// ============================================================
// URL NORMALIZATION (Extracted to reduce duplication)
// ============================================================

/**
 * Normalize site URL to canonical form
 * Removes trailing slashes, ensures https:// prefix
 * @param {string} url - Site URL
 * @returns {string} Normalized URL
 */
function normalizeSiteUrl(url) {
  if (!url || typeof url !== 'string') return '';

  let normalized = url.trim().toLowerCase();

  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');

  // Ensure protocol
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }

  return normalized;
}

// ============================================================
// V2 PAYLOAD DETECTION & VALIDATION
// ============================================================

/**
 * Check if payload is V2 format
 * Uses P constants from 00-constants.js for field names
 * @param {Object} payload - Payload object to check
 * @returns {boolean} True if V2 payload
 */
function isV2Payload(payload) {
  if (!payload || typeof payload !== 'object') return false;

  // Check for __meta field (V2 marker)
  const meta = payload[P.ROOT.META] || payload.__meta;
  if (!meta || typeof meta !== 'object') return false;

  // Check version (use P constant or fallback)
  const version = meta[PAYLOAD_FIELDS.VERSION] || meta.version;
  return version === PAYLOAD_V2.VERSION;
}

/**
 * Validate V2 payload structure
 * @param {Object} payload - Payload to validate
 * @returns {Object} Validation result {valid, errors}
 */
function validateV2Payload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    errors.push('Payload must be an object');
    return { valid: false, errors };
  }

  // Check required root fields
  const meta = payload[PAYLOAD_FIELDS.META] || payload.__meta;
  if (!meta) errors.push('Missing __meta field');

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') {
    errors.push('Missing or invalid accounts field');
  }

  const ui = payload[PAYLOAD_FIELDS.UI] || payload.ui;
  if (!ui || typeof ui !== 'object') {
    errors.push('Missing or invalid ui field');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================
// ACCOUNT OPERATIONS
// ============================================================

/**
 * Get account count from payload
 * @param {Object} payload - V2 payload
 * @returns {number} Account count (0 if invalid)
 */
function getAccountCount(payload) {
  if (!payload) return 0;

  const meta = payload[PAYLOAD_FIELDS.META] || payload.__meta;
  if (meta) {
    return meta[PAYLOAD_FIELDS.ACCOUNT_COUNT] || meta.accountCount || 0;
  }

  // Fallback: count actual accounts
  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (accounts && typeof accounts === 'object') {
    return Object.keys(accounts).length;
  }

  return 0;
}

/**
 * Get all account emails from payload
 * @param {Object} payload - V2 payload
 * @returns {string[]} Array of email addresses
 */
function getAccountEmails(payload) {
  if (!payload) return [];

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') return [];

  return Object.keys(accounts);
}

/**
 * Get specific account data by email
 * @param {Object} payload - V2 payload
 * @param {string} email - Account email
 * @returns {Object|null} Account object or null
 */
function getAccountByEmail(payload, email) {
  if (!payload || !email) return null;

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') return null;

  return accounts[email] || null;
}

// ============================================================
// SITE OPERATIONS (O(1) optimized with index)
// ============================================================

/**
 * Build site-to-account index for O(1) lookups
 * Cached for 5 minutes to avoid rebuilding
 * @private
 */
function buildSiteToAccountIndex(payload) {
  const cacheKey = 'siteIndex_' + (payload?.__meta?.savedAt || 'unknown');
  let index = getV2Cached(cacheKey);

  if (index) return index;

  index = new Map();

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') {
    setV2Cached(cacheKey, index);
    return index;
  }

  for (const [email, account] of Object.entries(accounts)) {
    const sites = account[PAYLOAD_FIELDS.SITES] || account.sites || [];
    for (const site of sites) {
      const normalized = normalizeSiteUrl(site);
      if (normalized) {
        index.set(normalized, email);
      }
    }
  }

  setV2Cached(cacheKey, index);
  return index;
}

/**
 * Get all unique sites from all accounts (deduplicated, sorted)
 * @param {Object} payload - V2 payload
 * @returns {string[]} Sorted array of unique site URLs
 */
function getAllSites(payload) {
  if (!payload) return [];

  const cacheKey = 'allSites_' + (payload?.__meta?.savedAt || 'unknown');
  let cached = getV2Cached(cacheKey);
  if (cached) return cached;

  const sites = new Set();

  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || payload.accounts;
  if (!accounts || typeof accounts !== 'object') {
    return [];
  }

  for (const account of Object.values(accounts)) {
    const accountSites = account[PAYLOAD_FIELDS.SITES] || account.sites || [];
    for (const site of accountSites) {
      const normalized = normalizeSiteUrl(site);
      if (normalized) {
        sites.add(normalized);
      }
    }
  }

  const result = Array.from(sites).sort();
  setV2Cached(cacheKey, result);
  return result;
}

/**
 * Find account email that owns a specific site
 * Uses index for O(1) lookup instead of O(n) iteration
 * @param {string} siteUrl - Site URL to find
 * @param {Object} payload - V2 payload
 * @returns {string|null} Account email or null
 */
function getAccountForSite(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  const normalized = normalizeSiteUrl(siteUrl);
  if (!normalized) return null;

  const index = buildSiteToAccountIndex(payload);
  return index.get(normalized) || null;
}

/**
 * Check if a site exists in the payload
 * @param {string} siteUrl - Site URL to check
 * @param {Object} payload - V2 payload
 * @returns {boolean} True if site exists
 */
function hasSite(siteUrl, payload) {
  return getAccountForSite(siteUrl, payload) !== null;
}

// ============================================================
// SITE DATA OPERATIONS
// ============================================================

/**
 * Get data for a specific site
 * @param {string} siteUrl - Site URL
 * @param {Object} payload - V2 payload
 * @returns {Object|null} Site data object or null
 */
function getSiteData(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  const email = getAccountForSite(siteUrl, payload);
  if (!email) return null;

  const account = getAccountByEmail(payload, email);
  if (!account) return null;

  const normalized = normalizeSiteUrl(siteUrl);
  const dataBySite = account[PAYLOAD_FIELDS.DATA_BY_SITE] || account.dataBySite;

  return dataBySite?.[normalized] || null;
}

/**
 * Get metadata for a specific site
 * @param {string} siteUrl - Site URL
 * @param {Object} payload - V2 payload
 * @returns {Object|null} Site metadata or null
 */
function getSiteMeta(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  const email = getAccountForSite(siteUrl, payload);
  if (!email) return null;

  const account = getAccountByEmail(payload, email);
  if (!account) return null;

  const normalized = normalizeSiteUrl(siteUrl);
  const siteMeta = account[PAYLOAD_FIELDS.SITE_META] || account.siteMeta;

  return siteMeta?.[normalized] || null;
}

/**
 * Get site label (display name)
 * @param {string} siteUrl - Site URL
 * @param {Object} payload - V2 payload
 * @returns {string} Label or URL fallback
 */
function getSiteLabel(siteUrl, payload) {
  const meta = getSiteMeta(siteUrl, payload);
  if (meta) {
    return meta[PAYLOAD_FIELDS.LABEL] || meta.label || siteUrl;
  }
  return siteUrl || '';
}

// ============================================================
// UI STATE OPERATIONS
// ============================================================

/**
 * Get current UI state from payload
 * @param {Object} payload - V2 payload
 * @returns {Object} {curMode, curSite, curTab}
 */
function getUIState(payload) {
  if (!payload) {
    return {
      curMode: P.DEFAULTS.MODE,
      curSite: P.DEFAULTS.CUR_SITE,
      curTab: P.DEFAULTS.CUR_TAB
    };
  }

  const ui = payload[PAYLOAD_FIELDS.UI] || payload.ui || {};

  return {
    curMode: ui[PAYLOAD_FIELDS.CUR_MODE] || ui.curMode || P.DEFAULTS.MODE,
    curSite: ui[PAYLOAD_FIELDS.CUR_SITE] || ui.curSite || P.DEFAULTS.CUR_SITE,
    curTab: ui[PAYLOAD_FIELDS.CUR_TAB] || ui.curTab || P.DEFAULTS.CUR_TAB
  };
}

/**
 * Set UI state in payload
 * @param {Object} payload - V2 payload (modified in place)
 * @param {Object} state - {curMode, curSite, curTab}
 * @returns {Object} Modified payload
 */
function setUIState(payload, state) {
  if (!payload || !state) return payload;

  if (!payload.ui) payload.ui = {};
  const ui = payload.ui;

  if (state.curMode !== undefined) ui.curMode = state.curMode;
  if (state.curSite !== undefined) ui.curSite = state.curSite;
  if (state.curTab !== undefined) ui.curTab = state.curTab;

  return payload;
}

// ============================================================
// STATS & SUMMARY OPERATIONS
// ============================================================

/**
 * Get stats from payload
 * @param {Object} payload - V2 payload
 * @returns {Object} {success, partial, failed, errors}
 */
function getStats(payload) {
  if (!payload) {
    return { success: 0, partial: 0, failed: 0, errors: [] };
  }

  const stats = payload.stats || {};
  return {
    success: stats.success || 0,
    partial: stats.partial || 0,
    failed: stats.failed || 0,
    errors: Array.isArray(stats.errors) ? stats.errors : []
  };
}

/**
 * Get summary data (for merged reports)
 * @param {Object} payload - V2 payload
 * @returns {Object|null} Summary object or null
 */
function getSummary(payload) {
  if (!payload) return null;
  return payload[PAYLOAD_FIELDS.SUMMARY] || payload._summary || null;
}

/**
 * Get site ownership map (for conflict resolution)
 * @param {Object} payload - V2 payload
 * @returns {Object} Map of site -> [emails]
 */
function getSiteOwnership(payload) {
  const summary = getSummary(payload);
  if (!summary) return {};

  return summary.siteOwnership || {};
}

// ============================================================
// MIGRATION HELPERS (Big Bang - no v1 support)
// ============================================================

/**
 * Create empty V2 payload structure
 * @param {string} email - Account email
 * @param {string} encId - Encrypted ID
 * @returns {Object} Empty V2 payload
 */
function createEmptyV2Payload(email, encId) {
  return {
    __meta: {
      version: PAYLOAD_V2.VERSION,
      savedAt: new Date().toISOString(),
      accountCount: 1
    },
    accounts: {
      [email]: {
        encId: encId || 'unknown',
        sites: [],
        siteMeta: {},
        dataBySite: {}
      }
    },
    ui: {
      curMode: P.DEFAULTS.MODE,
      curSite: P.DEFAULTS.CUR_SITE,
      curTab: P.DEFAULTS.CUR_TAB
    },
    stats: {
      success: 0,
      partial: 0,
      failed: 0,
      errors: []
    }
  };
}

/**
 * Clone V2 payload (deep copy)
 * @param {Object} payload - V2 payload
 * @returns {Object} Cloned payload
 */
function cloneV2Payload(payload) {
  if (!payload) return null;

  try {
    return JSON.parse(JSON.stringify(payload));
  } catch (e) {
    console.error('[cloneV2Payload] Failed to clone:', e);
    return null;
  }
}

// ============================================================
// EXPORT FUNCTIONS (for use in other modules)
// ============================================================

// Export all functions for module use (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Cache
    clearV2Cache,
    // Validation
    isV2Payload,
    validateV2Payload,
    // URL
    normalizeSiteUrl,
    // Accounts
    getAccountCount,
    getAccountEmails,
    getAccountByEmail,
    // Sites
    getAllSites,
    getAccountForSite,
    hasSite,
    // Site Data
    getSiteData,
    getSiteMeta,
    getSiteLabel,
    // UI State
    getUIState,
    setUIState,
    // Stats
    getStats,
    getSummary,
    getSiteOwnership,
    // Creation
    createEmptyV2Payload,
    cloneV2Payload
  };
}

// ============================================================
// END OF V2 HELPER FUNCTIONS
// ============================================================
