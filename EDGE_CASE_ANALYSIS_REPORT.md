# SearchAdvisor Edge Case Analysis Report

## Executive Summary
This report analyzes edge case handling across 15 core files of the SearchAdvisor application. The analysis covers 7 categories: empty data handling, boundary values, special characters, concurrency issues, network failures, data type conversion, and user input validation.

**Overall Assessment**: The codebase demonstrates **strong edge case handling** with comprehensive null checks, type validation, and error handling. However, several areas require improvement for production robustness.

---

## 1. Empty Array/Object Handling (null, undefined, [])

### ✅ **Excellent Handling**

**File: `00-constants.js`**
- Lines 327-336: `DATA_VALIDATION.isObject()`, `isNonEmptyArray()` - Proper type checking
- Lines 343-348: Email validation with type checking
- Lines 355-361: Timestamp validation with range checks

**File: `01-helpers.js`**
- Line 577: `normalizeSiteUrl()` - Handles null/undefined input
```javascript
if (!url || typeof url !== 'string') return '';
```

**File: `03-data-manager.js`**
- Lines 37-47: `getCachedData()` - Multiple null checks
- Lines 176-218: `normalizeSiteData()` - Comprehensive null coalescing

**File: `08-renderers.js`**
- Lines 489-497: `escHtml()` - Handles null/undefined values
```javascript
function escHtml(v) {
  return String(v || "")
    .replace(/&/g, "&amp;")
    // ...
}
```

### ⚠️ **Needs Improvement**

**File: `02-dom-init.js`**
- **Line 139-147**: `fileSafe()` function
```javascript
function fileSafe(v) {
  return String(v || "snapshot")  // ✅ Good: handles null
    .replace(/^https?:\/\//, "")
    .replace(/[\\/:*?"<>|]+/g, "-")  // ⚠️ Missing: Unicode characters
    // ...
}
```
**Issue**: Doesn't handle Unicode characters in file paths (Korean, Chinese, etc.)
**Recommendation**: Add `.replace(/[^\x00-\x7F]/g, "")` for ASCII-only filenames

---

## 2. Boundary Value Checks (0, negatives, very large numbers)

### ✅ **Good Handling**

**File: `08-renderers.js`**
- Lines 33-47: `sparkline()` function
```javascript
const definedVals = vals.filter(isFiniteValue);
const floorMin = typeof opts.minValue === "number" && Number.isFinite(opts.minValue)
  ? opts.minValue
  : null;
```
- Lines 453-473: `st()` - Statistical functions handle empty arrays
```javascript
if (!arr || !arr.length)
  return { mean: 0, std: 0, cv: 0, slope: 0, outliers: [] };
```

**File: `04-api.js`**
- Lines 514-542: `fetchWithRetry()` - Handles timeout and max retries
```javascript
const delay = Math.min(CONFIG.RETRY.BASE_DELAY_MS * Math.pow(2, attempt - 1),
                       CONFIG.RETRY.MAX_DELAY_MS);
```

### ⚠️ **Needs Improvement**

**File: `10-all-sites-view.js`**
- **Line 86**: `barchart()` could receive empty array
```javascript
const mx = Math.max(...vals) || 1,  // ⚠️ If vals is empty, returns -Infinity
```
**Issue**: `Math.max()` on empty array returns `-Infinity`
**Recommendation**:
```javascript
const mx = vals.length ? Math.max(...vals) : 1;
```

**File: `05-demo-mode.js`**
- **Lines 48-66**: Random number generation without bounds
```javascript
const baseClicks = Math.floor(Math.random() * 5000) + 1000;  // ✅ Has bounds
const clickCount = Math.floor(Math.random() * 400) + 50;     // ✅ Has bounds
```
**Assessment**: Actually has proper bounds (50-450 range) - GOOD

---

## 3. Special Characters (URL, HTML, Unicode)

### ✅ **Excellent Handling**

**File: `08-renderers.js`**
- Lines 489-497: `escHtml()` function - Comprehensive XSS prevention
```javascript
function escHtml(v) {
  return String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;");
}
```

**File: `01-helpers.js`**
- Lines 577-591: `normalizeSiteUrl()` - URL normalization
```javascript
function normalizeSiteUrl(url) {
  if (!url || typeof url !== 'string') return '';
  let normalized = url.trim().toLowerCase();
  normalized = normalized.replace(/\/+$/, '');  // Remove trailing slashes
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }
  return normalized;
}
```

**File: `04-api.js`**
- Lines 29-30, 76-77, 141-142: Proper URL encoding
```javascript
const enc = encodeURIComponent(site),
```

### ⚠️ **Potential Issues**

**File: `03-data-manager.js`**
- **Line 71**: Base64 encoding without error handling for invalid UTF-8
```javascript
const encoded = btoa(encodeURIComponent(site));
```
**Issue**: Some Unicode characters may cause `btoa()` to fail
**Current mitigation**: Lines 73-77 have try-catch with fallback ✅

**File: `12-snapshot.js`**
- **Line 273**: JSON.stringify without circular reference check
```javascript
const EXPORT_PAYLOAD_RAW = ${JSON.stringify(payload)};
```
**Issue**: If payload has circular references, will throw error
**Recommendation**: Use safe stringify or try-catch

---

## 4. Concurrency Issues (Race conditions)

### ✅ **Good Handling**

**File: `04-api.js`**
- Lines 3-7: In-flight request tracking prevents duplicate requests
```javascript
const inflightExpose = {};
const inflightCrawl = {};
const inflightBacklink = {};
const inflightDiagnosisMeta = {};
```
- Lines 28, 74, 139, 205, 325: Checks for existing requests
```javascript
if (!(options && options.force) && inflightExpose[site]) return inflightExpose[site];
```

**File: `07-ui-state.js`**
- Lines 13-15: Request ID tracking for cancellation
```javascript
let siteViewReqId = 0;
let allViewReqId = 0;
```

**File: `11-site-view.js`**
- Lines 14-15, 65-68: Window-level counter with race condition protection
```javascript
const requestId = ++window.__siteViewReqId;
if (requestId !== window.__siteViewReqId || site !== curSite) {
  console.log('[loadSiteView] Returning early - requestId mismatch');
  return;
}
```

### ⚠️ **Potential Race Condition**

**File: `06-merge-manager.js`**
- **Line 305**: `mergeSiteData()` not atomic
```javascript
importedCache[site] = mergeSiteData(
  { [site]: importedCache[site] },  // ⚠️ Could change between reads
  { [site]: data },
  options
)[site];
```
**Issue**: If `importedCache[site]` changes between the two reads, inconsistent merge
**Recommendation**: Use temp variable:
```javascript
const existing = importedCache[site];
importedCache[site] = mergeSiteData(
  { [site]: existing },
  { [site]: data },
  options
)[site];
```

---

## 5. Network Failure Handling (timeout, offline, server error)

### ✅ **Excellent Handling**

**File: `00-constants.js`**
- Lines 514-542: `fetchWithRetry()` with comprehensive error handling
```javascript
async function fetchWithRetry(url, options, maxRetries = 2) {
  // ...
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);  // 30s timeout
  // ...
  if (res.ok) return res;
  if (res.status !== 429 && res.status < 500) return res; // Don't retry 4xx
  // ...
}
```

**File: `04-api.js`**
- Lines 46-53, 109-120, 173-184: Proper error handling in all fetch functions
```javascript
} catch (e) {
  return persistSiteData(site, {
    expose: null,
    exposeFetchState: "failure",
    exposeFetchedAt: Date.now(),
    // ...
  });
}
```

**File: `03-data-manager.js`**
- Lines 156-163: Failure cooldown to prevent retry storms
```javascript
function hasRecentFieldFailure(data, key, cooldownMs = FIELD_FAILURE_RETRY_MS) {
  return !!(
    data &&
    data[key + "FetchState"] === "failure" &&
    typeof data[key + "FetchedAt"] === "number" &&
    Date.now() - data[key + "FetchedAt"] < cooldownMs  // 5 minute cooldown
  );
}
```

### ⚠️ **Missing: Offline Detection**

**File: `05-demo-mode.js`**
- **Lines 8-22**: Demo mode detection doesn't check network status
```javascript
const IS_DEMO_MODE = (function() {
  try {
    const protocol = (location && location.protocol) || "";
    const host = (location && location.hostname) || "";
    return protocol === "file:" || host === "localhost" || ...
  } catch (e) {
    return false;
  }
})();
```
**Recommendation**: Add `navigator.onLine` check
```javascript
return protocol === "file:" || host === "localhost" || !navigator.onLine;
```

---

## 6. Data Type Conversion (Type casting, parsing)

### ✅ **Good Handling**

**File: `00-constants.js`**
- Lines 327-336: Type validation functions
```javascript
isObject: function(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
},
isNonEmptyArray: function(value) {
  return Array.isArray(value) && value.length > 0;
}
```

**File: `08-renderers.js`**
- Lines 9-11: Safe number conversion
```javascript
const clicks = logs.map((r) => Number(r.clickCount) || 0),  // || 0 handles NaN
const exposes = logs.map((r) => Number(r.exposeCount) || 0),
const ctrs = logs.map((r) => {
  const n = parseFloat(r.ctr);
  return Number.isFinite(n) ? n : 0;
});
```

**File: `03-data-manager.js`**
- Lines 19-35: Safe JSON parsing
```javascript
function lsGet(k) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    console.error('[lsGet] Error:', e);
    return null;  // ✅ Returns null on parse error
  }
}
```

### ⚠️ **Needs Improvement**

**File: `11-site-view.js`**
- **Line 87**: Unsafe array access
```javascript
const item = (data && data.expose && data.expose.items && data.expose.items[0]) || {};
```
**Better**: Already well-protected ✅

**File: `10-all-sites-view.js`**
- **Line 86**: Array.reduce on potentially empty array
```javascript
const rows = sitesToLoad.map((site, i) =>
  siteDataBySite[site]
    ? buildSiteSummaryRow(site, siteDataBySite[site])
    : exposeResults[i] && exposeResults[i].status === "fulfilled"
      ? buildSiteSummaryRow(site, exposeResults[i].value)
      : buildSiteSummaryRow(site, null),
).sort((a, b) => b.totalC - a.totalC);
```
**Issue**: `buildSiteSummaryRow` assumes valid data structure
**Assessment**: Has fallback to `null` ✅

---

## 7. User Input Validation (XSS, SQL injection, CSRF)

### ✅ **Excellent XSS Protection**

**File: `08-renderers.js`**
- Lines 413-434: `ibox()` with security warning
```javascript
function ibox(type, html) {
  // Development mode security warning
  if (typeof window !== "undefined" &&
      typeof html === "string" &&
      html.includes("<") &&
      !html.includes("&lt;") &&
      !/^(<span|<div|<b>|<strong>|<em>|<i>|<br|<hr|\/[a-z]+>|\s+)*$/i.test(html)) {
    console.warn("[SECURITY] ibox() 호출에 원시 HTML이 포함되어 있습니다.");
    console.trace("[SECURITY] 호출 스택:");
  }
  // ...
  d.innerHTML = html; // SECURITY WARNING: Ensure html parameter is sanitized
  return d;
}
```

**File: `08-renderers.js`**
- Lines 558-559: Fixed XSS vulnerability (commented in code)
```javascript
// Security Note: This function uses innerHTML for HTML content. All dynamic values in
// call sites MUST be escaped using escHtml(). Fixed: 08-renderers.js line 558 (slug value).
```

**File: `02-dom-init.js`**
- **Lines 107-109**: `pad2()` doesn't validate input
```javascript
function pad2(v) {
  return String(v).padStart(2, "0");  // ⚠️ No validation
}
```
**Issue**: If `v` is not a number or has unexpected length, could produce invalid output
**Recommendation**: Add validation
```javascript
function pad2(v) {
  const num = parseInt(v, 10);
  return isNaN(num) ? "00" : String(Math.max(0, Math.min(99, num))).padStart(2, "0");
}
```

### ✅ **URL Validation**

**File: `01-helpers.js`**
- Lines 577-591: `normalizeSiteUrl()` validates and normalizes URLs
```javascript
function normalizeSiteUrl(url) {
  if (!url || typeof url !== 'string') return '';
  let normalized = url.trim().toLowerCase();
  // ... protocol validation
  return normalized;
}
```

**File: `12-snapshot.js`**
- **Lines 236-243**: Safe URL construction
```javascript
const pageUrl = (() => {
  try {
    return /^https?:\/\//.test(u.key)
      ? u.key
      : new URL(u.key, curSite).toString();
  } catch (e) {
    return u.key;  // ⚠️ Returns original on error
  }
})(),
```
**Issue**: Could return invalid URL if `u.key` is malformed
**Recommendation**: Return safe default
```javascript
} catch (e) {
  return curSite || 'about:blank';
}
```

---

## Summary of Findings

### Critical Issues (Immediate Action Required)
**None Found** - The codebase has robust security measures in place.

### High Priority Issues
1. **File: `02-dom-init.js` Line 139** - `fileSafe()` doesn't handle Unicode filenames
2. **File: `10-all-sites-view.js` Line 86** - `Math.max()` on empty array returns `-Infinity`
3. **File: `06-merge-manager.js` Line 305** - Potential race condition in merge

### Medium Priority Issues
1. **File: `12-snapshot.js` Line 273** - JSON.stringify without circular reference check
2. **File: `05-demo-mode.js` Line 8** - No offline detection
3. **File: `02-dom-init.js` Line 107** - `pad2()` doesn't validate input range

### Low Priority Issues
1. **File: `11-site-view.js` Line 236** - URL construction could return invalid URL

---

## Recommendations

### 1. Add Input Validation Helpers
Create a utility module for common validations:
```javascript
const VALIDATORS = {
  safeInteger: (v, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const n = parseInt(v, 10);
    return !isNaN(n) && n >= min && n <= max ? n : null;
  },
  safeFilename: (v) => String(v || "")
    .replace(/[^\x00-\x7F]/g, "")  // Remove non-ASCII
    .replace(/[\\/:*?"<>|]+/g, "-"),
  safeUrl: (v) => {
    try {
      return new URL(v).toString();
    } catch {
      return null;
    }
  }
};
```

### 2. Add Circular Reference Detection
```javascript
function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  });
}
```

### 3. Add Network Status Monitoring
```javascript
function isOnline() {
  return navigator.onLine &&
         (navigator.connection?.effectiveType !== 'slow-2g');
}

window.addEventListener('offline', () => {
  console.warn('[Network] Connection lost');
  // Pause requests, show offline UI
});
```

### 4. Improve Error Boundaries
```javascript
function withErrorBoundary(fn, fallback) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (e) {
      console.error('[ErrorBoundary]', e);
      return fallback;
    }
  };
}
```

---

## Conclusion

The SearchAdvisor codebase demonstrates **mature edge case handling** with:
- ✅ Comprehensive null/undefined checks
- ✅ Strong XSS protection with `escHtml()`
- ✅ Proper race condition prevention with request tracking
- ✅ Robust network error handling with retries and cooldowns
- ✅ Good type validation and conversion

**Key Strengths:**
1. Security-conscious development (XSS prevention)
2. Defensive programming (null coalescing everywhere)
3. Proper async error handling
4. Request deduplication to prevent race conditions

**Areas for Enhancement:**
1. Add Unicode filename sanitization
2. Improve array boundary checks
3. Add circular reference detection for JSON serialization
4. Implement offline detection and handling

**Overall Rating: 8.5/10** - Production-ready with minor improvements recommended.
