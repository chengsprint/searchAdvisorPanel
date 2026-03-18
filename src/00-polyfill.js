var process=globalThis.process||{env:{NODE_ENV:"production"}};

// ============================================================
// P0 SECURITY: DOMPurify Integration
// This section loads DOMPurify for XSS prevention
// ============================================================

(function() {
  'use strict';

  var pendingCallbacks = [];

  // DOMPurify will be loaded from CDN if not already available
  if (typeof DOMPurify === 'undefined') {
    // Attempt to load from CDN (will be used in browser environment)
    if (typeof document !== 'undefined') {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.3.3/dist/purify.min.js';
      script.crossOrigin = 'anonymous';
      script.async = true;

      // Make DOMPurify available when loaded
      script.onload = function() {
        window.__DOMPurifyLoaded = true;
        pendingCallbacks.forEach(function(cb) { cb(); });
        pendingCallbacks = [];
      };

      // Fallback if CDN fails
      script.onerror = function() {
        console.warn('[SECURITY] Failed to load DOMPurify from CDN. Falling back to basic HTML escaping.');
        window.__DOMPurifyLoaded = false;
        window.__DOMPurifyFailed = true;
      };

      if (document.head) {
        document.head.insertBefore(script, document.head.firstChild);
      } else {
        document.documentElement.appendChild(script);
      }
    }
  } else {
    window.__DOMPurifyLoaded = true;
  }

  // Helper to check if DOMPurify is ready
  window.isDOMPurifyReady = function() {
    return typeof DOMPurify !== 'undefined' && DOMPurify.sanitize;
  };

  // Helper to wait for DOMPurify to be ready
  window.waitForDOMPurify = function(callback) {
    if (window.isDOMPurifyReady()) {
      callback();
    } else if (window.__DOMPurifyFailed) {
      callback(); // Proceed with fallback
    } else {
      pendingCallbacks.push(callback);
    }
  };
})();
