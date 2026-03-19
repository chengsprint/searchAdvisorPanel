// ============================================================
// DATA-CACHE - Cache management utilities
// ============================================================

let allSites = [];

// ============================================================================
// P1: LRU Cache Implementation
// ============================================================================

/**
 * LRU (Least Recently Used) Cache with TTL support
 * Prevents unbounded memory growth by evicting least recently used entries
 */
class LRUCache {
  /**
   * @param {number} capacity - Maximum number of entries (default: 100)
   * @param {number} ttl - Time-to-live in milliseconds (default: 12 hours)
   */
  constructor(capacity = 100, ttl = 12 * 60 * 60 * 1000) {
    this.capacity = capacity;
    this.ttl = ttl;
    this.cache = new Map();
    this.access = new Map();
    this.evictionCallback = null;
  }

  /**
   * Set callback to be invoked when entries are evicted
   * @param {Function} callback - Function to call on eviction (key, value) => void
   */
  onEviction(callback) {
    this.evictionCallback = callback;
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined if not found/expired
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return undefined;

    // Check TTL
    if (Date.now() - item.timestamp > this.ttl) {
      this.delete(key);
      return undefined;
    }

    // Update access time for LRU tracking
    this.access.set(key, Date.now());
    return item.value;
  }

  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   */
  set(key, value) {
    const now = Date.now();

    // Check if we need to evict (at capacity and key doesn't exist)
    if (this.cache.size >= this.capacity && !this.cache.has(key)) {
      this._evictLRU();
    }

    // Store value with timestamp
    this.cache.set(key, { value, timestamp: now });
    this.access.set(key, now);
  }

  /**
   * Check if a key exists in the cache (and is not expired)
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists and is valid
   */
  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;

    // Check TTL
    if (Date.now() - item.timestamp > this.ttl) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a specific key from the cache
   * @param {string} key - Cache key to delete
   * @returns {boolean} True if key was deleted
   */
  delete(key) {
    const deleted = this.cache.delete(key);
    this.access.delete(key);
    return deleted;
  }

  /**
   * Clear all entries from the cache
   */
  clear() {
    this.cache.clear();
    this.access.clear();
  }

  /**
   * Get current cache size
   * @returns {number} Number of entries in cache
   */
  get size() {
    return this.cache.size;
  }

  /**
   * Get all keys in the cache
   * @returns {Array<string>} Array of cache keys
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Evict the least recently used entry
   * @private
   */
  _evictLRU() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, time] of this.access.entries()) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const item = this.cache.get(oldestKey);
      const value = item ? item.value : undefined;

      this.delete(oldestKey);

      // Call eviction callback if registered
      if (this.evictionCallback && typeof this.evictionCallback === 'function') {
        try {
          this.evictionCallback(oldestKey, value);
        } catch (e) {
          console.error('[LRUCache] Eviction callback error:', e);
        }
      }

      console.log(`[LRUCache] Evicted LRU entry: ${oldestKey}`);
    }
  }

  /**
   * Clean up expired entries
   * @returns {number} Number of entries cleaned up
   */
  cleanupExpired() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[LRUCache] Cleaned up ${cleaned} expired entries`);
    }

    return cleaned;
  }
}

// Initialize memCache as LRUCache instance
const memCache = new LRUCache(
  100, // capacity: 100 entries
  12 * 60 * 60 * 1000 // ttl: 12 hours
);

// Optional: Set up eviction callback for logging
memCache.onEviction((key, value) => {
  console.debug(`[LRUCache] Evicted cache entry: ${key}`);
});

// Periodic cleanup of expired entries (every 30 minutes)
setInterval(() => {
  memCache.cleanupExpired();
}, 30 * 60 * 1000);

// ============================================================================
// P1: localStorage Race Condition Fix - Write Queue System
// ============================================================================
let writeQueue = Promise.resolve();
const writeLocks = new Map(); // Key-based locks for optimistic locking
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 100;

/**
 * Execute a write operation with queue serialization and optimistic locking
 * @param {string} key - localStorage key
 * @param {Function} writeFn - Function that performs the write operation
 * @param {Object} options - Options { retries: number, skipLock: boolean }
 * @returns {Promise<void>}
 */
function safeWrite(key, writeFn, options = {}) {
  const { retries = MAX_RETRIES, skipLock = false } = options;

  // Add to write queue for serialization
  writeQueue = writeQueue.then(async () => {
    let attempt = 0;
    let lockId = null;

    while (attempt <= retries) {
      try {
        // Optimistic lock check
        if (!skipLock && writeLocks.has(key)) {
          const lockInfo = writeLocks.get(key);
          const age = Date.now() - lockInfo.timestamp;
          // Lock is stale (older than 5 seconds), break it
          if (age > 5000) {
            writeLocks.delete(key);
          } else {
            // Lock is active, wait and retry
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            attempt++;
            continue;
          }
        }

        // Acquire lock
        lockId = Math.random().toString(36).substr(2, 9);
        if (!skipLock) {
          writeLocks.set(key, { id: lockId, timestamp: Date.now() });
        }

        // Execute write function
        await writeFn();

        // Release lock
        if (!skipLock && writeLocks.get(key)?.id === lockId) {
          writeLocks.delete(key);
        }

        return; // Success
      } catch (e) {
        // Release lock on error
        if (!skipLock && writeLocks.get(key)?.id === lockId) {
          writeLocks.delete(key);
        }

        // Handle QuotaExceededError with cache cleanup
        if (e.name === 'QuotaExceededError') {
          console.warn('[safeWrite] Quota exceeded, cleaning cache...');
          const cleaned = cleanupOldCache();

          if (!cleaned && attempt >= retries) {
            throw new Error('localStorage quota exceeded and no old cache to clean');
          }
        }

        // Retry logic
        if (attempt >= retries) {
          throw e;
        }

        attempt++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  });

  return writeQueue;
}

/**
 * Clean up old cache entries to free space
 * @returns {boolean} True if cache was cleaned, false if nothing to clean
 */
function cleanupOldCache() {
  try {
    const keysToCheck = Object.keys(localStorage);
    const now = Date.now();
    let cleaned = false;

    // Sort keys by cache timestamp (oldest first)
    const cacheEntries = [];
    for (const key of keysToCheck) {
      if (key.startsWith(DATA_LS_PREFIX)) {
        try {
          const value = localStorage.getItem(key);
          if (!value) continue;

          const data = JSON.parse(value);
          const timestamp = data.ts || data.__cacheSavedAt || data.__fetched_at || 0;

          cacheEntries.push({ key, timestamp });
        } catch (e) {
          // Invalid data, mark for removal
          cacheEntries.push({ key, timestamp: 0 });
        }
      }
    }

    // Sort by timestamp (oldest first)
    cacheEntries.sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest entries that are expired
    for (const entry of cacheEntries) {
      if (now - entry.timestamp > getDataTtlMs()) {
        localStorage.removeItem(entry.key);
        cleaned = true;
        console.log(`[cleanupOldCache] Removed expired cache: ${entry.key}`);
      }
    }

    // If still no space, remove oldest 10% of entries
    if (!cleaned && cacheEntries.length > 10) {
      const toRemove = Math.ceil(cacheEntries.length * 0.1);
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(cacheEntries[i].key);
        cleaned = true;
        console.log(`[cleanupOldCache] Removed old cache to free space: ${cacheEntries[i].key}`);
      }
    }

    return cleaned;
  } catch (e) {
    console.error('[cleanupOldCache] Error:', e);
    return false;
  }
}

/**
 * Get cache namespace with account support
 */
function getCacheNamespace() {
  // For demo/test mode, use a fixed namespace
  if (IS_DEMO_MODE) return 'demo';
  // For production, use account-based namespace
  return 'default';
}

/**
 * P1: Safe localStorage get with error handling
 * @param {string} k - Key to retrieve
 * @returns {any|null} Parsed value or null on error
 */
function lsGet(k) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    console.error('[lsGet] Error:', e);
    return null;
  }
}

/**
 * P1: Safe localStorage set with queue serialization and retry logic
 * @param {string} k - Key to set
 * @param {any} v - Value to store (will be JSON.stringified)
 * @returns {Promise<void>} Promise that resolves when write is complete
 */
function lsSet(k, v) {
  return safeWrite(k, async () => {
    const serialized = JSON.stringify(v);

    // Check size before writing (warn if > 1MB)
    if (serialized.length > 1024 * 1024) {
      console.warn(`[lsSet] Large data size for key "${k}": ${serialized.length} bytes`);
    }

    localStorage.setItem(k, serialized);
  });
}

/**
 * Get cached data for a site
 * @param {string} site - Site identifier
 * @returns {Object|null} Cached data or null if not found/expired
 */
function getCachedData(site) {
  const d = lsGet(getSiteDataCacheKey(site));
  if (!d) return null;
  if (!d.data || typeof d.data !== "object") return null;
  // TTL 검증 (타입 체크 추가)
  if (d.ts && typeof d.ts === "number" && Date.now() - d.ts > getDataTtlMs()) return null;
  return {
    ...d.data,
    __cacheSavedAt: typeof d.ts === "number" ? d.ts : null,
  };
}

/**
 * P1: Set cached data with queue serialization
 * @param {string} site - Site identifier
 * @param {Object} data - Data to cache
 * @returns {Promise<void>} Promise that resolves when cache is written
 */
function setCachedData(site, data) {
  return lsSet(getSiteDataCacheKey(site), {
    ts: Date.now(),
    data,
  });
}

/**
 * P1: Clear cached data with queue serialization
 * @param {string} site - Site identifier
 * @returns {Promise<void>} Promise that resolves when cache is cleared
 */
function clearCachedData(site) {
  return safeWrite(getSiteDataCacheKey(site), async () => {
    localStorage.removeItem(getSiteDataCacheKey(site));
  });
}

/**
 * Get site list cache key
 * @returns {string} Cache key for site list
 */
function getSiteListCacheKey() {
  return SITE_LS_KEY + "_" + getCacheNamespace();
}

/**
 * Get site data cache key
 * @param {string} site - Site identifier
 * @returns {string} Cache key for site data
 */
function getSiteDataCacheKey(site) {
  try {
    // 유니코드 지원을 위해 encodeURIComponent 후 인코딩
    const encoded = btoa(encodeURIComponent(site));
    return DATA_LS_PREFIX + getCacheNamespace() + "_" + encoded.replace(/=/g, "");
  } catch (e) {
    console.error('[getSiteDataCacheKey] Encoding error for site:', site, e);
    // 실패 시 타임스탬프 기반 폴백 키 사용
    return DATA_LS_PREFIX + getCacheNamespace() + "_" + Date.now();
  }
}

/**
 * Get site list cache timestamp
 * @returns {number|null} Timestamp or null
 */
function getSiteListCacheStamp() {
  const cached = lsGet(getSiteListCacheKey());
  return cached && typeof cached.ts === "number" ? cached.ts : null;
}

/**
 * Get site data cache timestamp
 * @param {string} site - Site identifier
 * @returns {number|null} Timestamp or null
 */
function getSiteDataCacheStamp(site) {
  const cached = lsGet(getSiteDataCacheKey(site));
  return cached && typeof cached.ts === "number" ? cached.ts : null;
}

/**
 * Get UI state cache key
 * @returns {string} Cache key for UI state
 */
function getUiStateCacheKey() {
  return UI_STATE_LS_KEY + "_" + getCacheNamespace();
}

/**
 * Get cached UI state
 * @returns {Object|null} Cached UI state or null
 */
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

/**
 * P1: Set cached UI state with queue serialization
 * @returns {Promise<void>} Promise that resolves when state is saved
 */
function setCachedUiState() {
  return lsSet(getUiStateCacheKey(), {
    ts: Date.now(),
    mode: curMode,
    tab: curTab,
    site: curSite,
  });
}

/**
 * Get memory cache reference (read-only access)
 * @returns {Object} Reference to memory cache
 */
function getMemCache() {
  return memCache;
}

/**
 * Get all sites list (read-only access)
 * @returns {Array} Reference to all sites array
 */
function getAllSites() {
  return allSites;
}

/**
 * Set all sites list
 * @param {Array} sites - Sites array to set
 */
function setAllSites(sites) {
  allSites.length = 0;
  allSites.push(...sites);
}
