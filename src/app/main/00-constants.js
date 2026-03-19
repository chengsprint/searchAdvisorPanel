const CONFIG = {
  UI: {
    PANEL_WIDTH: 490,
    PANEL_PADDING: 32,
    Z_INDEX_TOOLTIP: 10000000,
    MOBILE_BREAKPOINT: 768,
    MOBILE_PANEL_WIDTH: '100vw',
    MIN_TOUCH_TARGET: 44,
    RESPONSIVE: {
      MOBILE: 768,
      TABLET: 1024,
      DESKTOP: 1280
    }
  },
  CHART: {
    MIN_HEIGHT: 65,
    PADDING: { LEFT: 4, RIGHT: 4, TOP: 6, BOTTOM: 6 },
    TOOLTIP_OFFSET: { X: 14, Y: 36 },
    BAR_GAP: 3,
    MIN_BAR_WIDTH: 3,
    Y_AXIS_COLLISION_THRESHOLD: 8,
    RESPONSIVE: {
      MOBILE_HEIGHT: 55,
      MOBILE_BAR_GAP: 2,
      MOBILE_PADDING: { LEFT: 2, RIGHT: 2, TOP: 4, BOTTOM: 4 }
    }
  },
  RETRY: {
    JITTER_MS: 500,
    BASE_DELAY_MS: 1000,
    MAX_DELAY_MS: 4000
  },
  MODE: {
    ALL: 'all',
    SITE: 'site'
  },
  PROGRESS: {
    BASE_RATIO_START: 0.08,
    EXPOSE_PHASE_RATIO_RANGE: 0.42,
    META_PHASE_RATIO_START: 0.55,
    META_PHASE_RATIO_RANGE: 0.38
  }
};

// ============================================================
// ERROR TRACKING SYSTEM (Minimal for bundle size)
// ============================================================
const ERROR_TRACKING = {
  enabled: false,
  endpoint: null,
  sampleRate: 1.0,
  maxQueueSize: 10,
  errorQueue: [],
  reportError: function(errorContext) {
    if (!this.enabled) {
      console.error('[Error Tracking]', errorContext);
      return;
    }
    const enrichedError = {
      ...errorContext,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      page: window.location.href,
      appVersion: window.__SEARCHADVISOR_VERSION__ || '1.0.0',
      siteCount: window.__sadvInitData?.sites?.length || 0,
      isMultiAccount: window.__sadvAccountState?.isMultiAccount || false
    };
    if (Math.random() > this.sampleRate) return;
    if (this.endpoint) {
      this.sendToEndpoint(enrichedError);
    } else {
      if (this.errorQueue.length >= this.maxQueueSize) {
        this.errorQueue.shift();
      }
      this.errorQueue.push(enrichedError);
    }
  },
  sendToEndpoint: function(errorData) {
    if (!this.endpoint) return;
    fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData),
      keepalive: true
    }).catch(err => {
      console.error('[Error Tracking] Failed to report error:', err);
      if (this.errorQueue.length < this.maxQueueSize) {
        this.errorQueue.push(errorData);
      }
    });
  },
  flushQueue: function() {
    if (!this.endpoint || this.errorQueue.length === 0) return;
    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];
    errorsToSend.forEach(error => {
      this.sendToEndpoint(error);
    });
  },
  enable: function(endpoint) {
    this.enabled = true;
    this.endpoint = endpoint;
    console.log('[Error Tracking] Enabled with endpoint:', endpoint);
  },
  disable: function() {
    this.enabled = false;
    console.log('[Error Tracking] Disabled');
  }
};
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    ERROR_TRACKING.reportError({
      type: 'unhandledError',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });
  window.addEventListener('unhandledrejection', (event) => {
    ERROR_TRACKING.reportError({
      type: 'unhandledRejection',
      reason: event.reason?.message || String(event.reason),
      stack: event.reason?.stack
    });
  });
}

const ICONS = {
  // KPI / 통계 아이콘
  click: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="m15 11-1 9"/></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  chart: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  up: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  down: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  link: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  external: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  // 탭 전용 아이콘 (13px)
  dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
  calendarDays: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>',
  urlLink: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  searchTab: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  database: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>',
  activity: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  backLinkTab: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  barChart: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
  // UI 컨트롤 아이콘
  globe: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  layers: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  refresh: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
  save: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  xMark: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  logoSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f1c21b" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  trendUp: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  linkInsight: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  pieChart: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
};
const C = {
  green: "#42be65",
  blue: "#f1c21b",
  amber: "#ffb000",
  red: "#fa4d56",
  purple: "#be95ff",
  teal: "#08bdba",
  orange: "#ff832b",
  pink: "#ff7eb6",
  bg0: "#0b0b0c",
  bg1: "#141414",
  bg2: "#1f1f1f",
  border: "#403b18",
  text: "#fff9db",
  muted: "#a89f67",
  sub: "#e6d98b",
};
const COLORS = [C.green, C.blue, C.amber, C.teal, C.purple, C.orange, C.pink];

// ============================================================
// V2 PAYLOAD SCHEMA CONSTANTS
// ============================================================

const P = {
  // 스키마 버전 (하드코딩 제거)
  VERSION: "1.0",
  MODE: CONFIG.MODE.ALL,  // "all" | "site"

  // 최상위 필드 (v1 호환성)
  ROOT: {
    META: "__meta",
    SAVED_AT: "savedAt",
    ALL_SITES: "allSites",
    CUR_MODE: "curMode",
    CUR_SITE: "curSite",
    CUR_TAB: "curTab",
    DATA_BY_SITE: "dataBySite",
    SITE_META: "siteMeta",
    MERGED_META: "mergedMeta",
    ACCOUNTS: "accounts",
    UI: "ui",
    STATS: "stats"
  },

  // 사이트 메타 필드
  SITE_META: {
    CACHE_SAVED_AT: "__cacheSavedAt",
    SOURCE: "__source",
    META: "__meta",
    FETCHED_AT: "__fetched_at"
  },

  // 데이터 상태 필드
  FIELD_STATE: {
    DETAIL_LOADED: "detailLoaded",
    CACHE_SAVED_AT: "__cacheSavedAt"
  },

  // 기본값
  DEFAULTS: {
    MODE: CONFIG.MODE.ALL,
    VERSION: "1.0",
    SAVED_AT: null,
    ALL_SITES: [],
    CUR_SITE: null,
    CUR_TAB: "overview"
  }
};

// 스키마 검증용
const PAYLOAD_SCHEMA = {
  VERSION: "1.0",

  ROOT: {
    REQUIRED: ["savedAt", "allSites", "curMode", "dataBySite"],
    OPTIONAL: ["curSite", "curTab", "siteMeta", "mergedMeta"]
  },

  SITE: {
    REQUIRED: [],
    OPTIONAL: ["expose", "crawl", "backlink", "diagnosisMeta", "__cacheSavedAt", "__meta"]
  },

  DEFAULTS: {
    curMode: CONFIG.MODE.ALL,
    curTab: "overview",
    savedAt: null,
    allSites: [],
    curSite: null,
    siteMeta: {},
    mergedMeta: null,
    dataBySite: {}
  }
};

// ============================================================
// V2 PAYLOAD FIELD NAMES (for helper functions)
// ============================================================

const PAYLOAD_FIELDS = {
  // Root fields
  META: "__meta",
  VERSION: "version",
  SAVED_AT: "savedAt",
  ACCOUNT_COUNT: "accountCount",

  // Account fields
  ACCOUNTS: "accounts",
  SITES: "sites",
  SITE_META: "siteMeta",
  DATA_BY_SITE: "dataBySite",
  ENC_ID: "encId",

  // UI fields
  UI: "ui",
  CUR_MODE: "curMode",
  CUR_SITE: "curSite",
  CUR_TAB: "curTab",

  // Site metadata
  LABEL: "label",

  // Summary fields
  SUMMARY: "_summary"
};

// V2 Payload version constant
const PAYLOAD_V2 = {
  VERSION: "1.0"
};

// Performance: Reusable style strings (reduces string allocation)
const S = {
  card: "background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)",
  row: "display:flex;justify-content:space-between;align-items:center;padding:16px;background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:12px;transition:all 0.2s",
  flexBetween: "display:flex;justify-content:space-between;align-items:center",
  muted: "font-size:12px;color:#94a3b8",
  valueGreen: "font-size:12px;font-weight:600;color:#10b981",
};

// Performance: Hoisted helper functions (avoids recreation on each call)
const isFiniteValue = (v) => typeof v === "number" && Number.isFinite(v);
const fmt = (v) => Number(v).toLocaleString();
const fmtD = (s) =>
  s ? s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8) : "";
const fmtB = (s) => (s ? s.slice(4, 6) + "/" + s.slice(6, 8) : "");
const PNL = CONFIG.UI.PANEL_WIDTH;
const CHART_W = PNL - CONFIG.UI.PANEL_PADDING;
const DOW = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"];
const SITE_COLORS_MAP = {};
const SITE_LS_KEY = "sadv_sites_v1";
const DATA_LS_PREFIX = "sadv_data_v2_";
const UI_STATE_LS_KEY = "sadv_ui_state_v1";
const DATA_TTL = 12 * 60 * 60 * 1000;

function getDataTtlMs() {
  try {
    const override = Number(window.__SADV_TEST_TTL_MS);
    if (Number.isFinite(override) && override > 0) return override;
  } catch (e) {}
  return DATA_TTL;
}

function getCacheMonitorIntervalMs() {
  try {
    const override = Number(window.__SADV_TEST_CACHE_MONITOR_INTERVAL_MS);
    if (Number.isFinite(override) && override > 0) return override;
  } catch (e) {}
  const ttlMs = getDataTtlMs();
  return Math.max(1000, Math.min(30000, Math.floor(ttlMs / 4) || 30000));
}

function recordRuntimeEvent(type, detail) {
  try {
    if (!Array.isArray(window.__SADV_TEST_EVENTS)) return;
    window.__SADV_TEST_EVENTS.push({
      type: String(type || "unknown"),
      detail: detail && typeof detail === "object" ? detail : detail ?? null,
      at: Date.now(),
    });
  } catch (e) {}
}

// ============================================================
// P0-3: ACCOUNT_UTILS - 계정 유틸리티 통합
// ============================================================
function findNuxtAuthUser() {
  try {
    return window.__NUXT__?.state?.authUser || window.__NUXT__?.state?.user || null;
  } catch (e) {
    return null;
  }
}

function findEncIdFallback() {
  try {
    const authUser = findNuxtAuthUser();
    const directEncId = authUser?.encId || authUser?.enc_id || "";
    if (typeof directEncId === "string" && directEncId) return directEncId;
  } catch (e) {}

  try {
    for (const key of Object.keys(window)) {
      const value = window[key];
      const candidate = value?.encId || value?.enc_id || "";
      if (typeof candidate === "string" && /^[a-f0-9]{64}$/i.test(candidate)) {
        return candidate;
      }
    }
  } catch (e) {}

  try {
    for (const entry of performance.getEntriesByType("resource")) {
      const match = String(entry?.name || "").match(/([a-f0-9]{64})/i);
      if (match) return match[1];
    }
  } catch (e) {}

  return "";
}

const ACCOUNT_UTILS = {
  getAccountLabel: function() {
    try {
      const authUser = findNuxtAuthUser();
      return authUser?.email || "";
    } catch (e) {
      return "";
    }
  },
  getEncId: function() {
    try {
      return findEncIdFallback();
    } catch (e) {
      return "";
    }
  },
  getAccountInfo: function() {
    try {
      const authUser = findNuxtAuthUser();
      return {
        accountLabel: authUser?.email || "",
        encId: findEncIdFallback()
      };
    } catch (e) {
      return { accountLabel: "", encId: "" };
    }
  },
  getCurrentAccount: function() {
    return window.__sadvAccountState?.currentAccount ||
           ACCOUNT_UTILS.getAccountLabel();
  },
  isMultiAccount: function() {
    return window.__sadvAccountState?.isMultiAccount || false;
  },
  getAllAccounts: function() {
    if (!ACCOUNT_UTILS.isMultiAccount()) {
      const label = ACCOUNT_UTILS.getAccountLabel();
      return label ? [label] : [];
    }
    const accounts = window.__sadvAccountState?.allAccounts;
    return accounts ? [...accounts] : [];
  },
  getAccountData: function(accountEmail) {
    if (!window.__sadvAccountState?.isMultiAccount) {
      return null;
    }
    return window.__sadvAccountState.accountsData?.[accountEmail] || null;
  },
  getAccountState: function() {
    return window.__sadvAccountState || null;
  }
};

// ============================================================
// P1: V2 DATA VALIDATION CONSTANTS
// ============================================================
const DATA_VALIDATION = {
  /**
   * 객체 타입 검증
   */
  isObject: function(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },

  /**
   * 비어있지 않은 배열 검증
   */
  isNonEmptyArray: function(value) {
    return Array.isArray(value) && value.length > 0;
  },

  /**
   * 유효한 이메일 검증
   * @param {string} email - 검증할 이메일 주소
   * @returns {boolean} 유효함 여부
   */
  isValidEmail: function(email) {
    if (typeof email !== 'string') return false;
    // 기본 형식: local@domain.tld
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 유효한 타임스탬프 검증
   * @param {number} ts - 검증할 타임스탬프 (밀리초)
   * @returns {boolean} 유효함 여부
   */
  isValidTimestamp: function(ts) {
    if (typeof ts !== 'number') return false;
    // 2000년 이후, 현재로부터 1년 후까지
    const minTimestamp = 946684800000; // 2000-01-01
    const maxTimestamp = Date.now() + 31536000000; // 현재 + 1년
    return ts > minTimestamp && ts < maxTimestamp;
  },

  /**
   * V2 payload 기본 검증
   */
  isValidV2Payload: function(payload) {
    if (!DATA_VALIDATION.isObject(payload)) return false;
    if (!payload.__meta || !payload.accounts) return false;
    if (!DATA_VALIDATION.isObject(payload.__meta)) return false;
    if (!DATA_VALIDATION.isObject(payload.accounts)) return false;
    return true;
  },

  /**
   * 계정 구조 검증
   */
  isValidAccount: function(account) {
    if (!DATA_VALIDATION.isObject(account)) return false;
    if (!account.encId || typeof account.encId !== 'string') return false;
    if (!Array.isArray(account.sites)) return false;
    return true;
  },

  /**
   * 계정 데이터 일관성 검증
   * sites 배열과 dataBySite 키 불일치 감지
   */
  validateAccountData: function(account) {
    const sites = account?.sites || [];
    const dataBySite = account?.dataBySite || {};

    // 성능 최적화: Set을 사용하여 O(1) 조회
    const sitesSet = new Set(sites);

    const missingData = [];
    for (const site of sites) {
      if (!dataBySite[site]) {
        missingData.push(site);
      }
    }

    const orphanSites = Object.keys(dataBySite).filter(url => !sitesSet.has(url));

    return {
      valid: missingData.length === 0 && orphanSites.length === 0,
      missingData,
      orphanSites,
      sitesCount: sites.length,
      dataCount: Object.keys(dataBySite).length
    };
  }
};

// ============================================================
// P1: V2 SCHEMA VERSION CONSTANTS
// ============================================================
const SCHEMA_VERSIONS = {
  // 현재 지원하는 스키마 버전
  CURRENT: '1.0',

  // 지원 가능한 버전 목록
  SUPPORTED: ['1.0'],

  /**
   * 버전이 지원되는지 확인
   */
  isSupported: function(version) {
    return SCHEMA_VERSIONS.SUPPORTED.includes(version);
  },

  /**
   * 버전 비교
   * @param {string} v1 - 첫 번째 버전
   * @param {string} v2 - 두 번째 버전
   * @returns {number} -1: v1 < v2, 0: v1 == v2, 1: v1 > v2
   */
  compare: function(v1, v2) {
    // 명시적인 null/undefined 체크 (빈 문자열과 구분)
    if (v1 == null && v2 == null) return 0;
    if (v1 == null) return -1;
    if (v2 == null) return 1;

    // 타입 검증
    if (typeof v1 !== 'string' || typeof v2 !== 'string') {
      console.warn('[SCHEMA_VERSIONS.compare] Invalid version types:', v1, v2);
      return 0;
    }

    // 빈 문자열 체크
    const t1 = v1.trim();
    const t2 = v2.trim();
    if (!t1 && !t2) return 0;
    if (!t1) return -1;
    if (!t2) return 1;

    const parts1 = t1.split('.').map(p => {
      const num = parseInt(p, 10);
      return isNaN(num) ? 0 : num;
    });
    const parts2 = t2.split('.').map(p => {
      const num = parseInt(p, 10);
      return isNaN(num) ? 0 : num;
    });

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }
    return 0;
  }
};

// ============================================================
// P1: V2 MERGE STRATEGY CONSTANTS
// ============================================================
const MERGE_STRATEGIES = {
  // 전략 유형
  NEWER: 'newer',      // 최신 데이터 우선
  FIRST: 'first',      // 첫 번째 계정 데이터 우선
  ALL: 'all',          // 모든 데이터 병합
  SOURCE: 'source',    // 소스 데이터 우선
  TARGET: 'target',    // 타겟 데이터 우선

  // 기본 전략
  DEFAULT: 'newer',

  /**
   * 전략 유효성 검증
   */
  isValid: function(strategy) {
    const validStrategies = [MERGE_STRATEGIES.NEWER, MERGE_STRATEGIES.FIRST, MERGE_STRATEGIES.ALL, MERGE_STRATEGIES.SOURCE, MERGE_STRATEGIES.TARGET];
    return validStrategies.includes(strategy);
  },

  /**
   * 전략별 설명
   */
  DESCRIPTIONS: {
    newer: '가장 최신 데이터(__fetched_at 기준)를 사용합니다',
    first: '첫 번째 계정의 데이터를 우선 사용합니다',
    all: '모든 데이터를 병합하여 중복을 제거합니다',
    source: '가져오는 데이터를 우선 적용합니다',
    target: '기존 데이터를 유지합니다'
  }
};

const ALL_SITES_BATCH = 4;
const FULL_REFRESH_BATCH_SIZE = 1;
const FULL_REFRESH_SITE_DELAY_MS = 350;
const FULL_REFRESH_JITTER_MS = 150;

// ============================================================
// P2 Issue #2: V1 SCHEMA DEFINITION (Compressed)
// ============================================================
const V1_SCHEMA = {
  FIELDS: ['sites', 'dataBySite', 'siteMeta', 'savedAt', 'encId', '__schema_version'],
  META: { SCHEMA_VERSION: '__schema_version', EXPORTED_AT: '__exported_at', SOURCE_ACCOUNT: '__source_account', SOURCE_ENC_ID: '__source_enc_id' },
  DEFAULTS: { SCHEMA_VERSION: '1.0', SAVED_AT: null, SITES: [], DATA_BY_SITE: {}, SITE_META: {} },
  SITE_FIELDS: ['expose', 'crawl', 'backlink', 'diagnosisMeta', 'detailLoaded', '__cacheSavedAt']
};
const V1_MIGRATION = {
  VERSION: '1.0.0',
  SUPPORTED_V1_VERSIONS: ['1.0'],
  MODES: { AUTO: 'auto', MANUAL: 'manual', ROLLBACK: 'rollback' },
  STATUS: { SUCCESS: 'success', PARTIAL: 'partial', FAILED: 'failed', SKIPPED: 'skipped', INVALID: 'invalid' },
  LS_KEYS: { V1_BACKUP: 'sadv_v1_backup_', MIGRATION_LOG: 'sadv_migration_log_', LAST_MIGRATION: 'sadv_last_migration' }
};

// ============================================================
// P1: USER-FRIENDLY ERROR MESSAGES
// ============================================================
const ERROR_MESSAGES = {
  // Network/Fetch Errors
  NETWORK_ERROR: "네트워크 연결을 확인하고 다시 시도해주세요.",
  REQUEST_TIMEOUT: "요청 시간이 초과했어요. 잠시 후 다시 시도해주세요.",
  MAX_RETRIES_EXCEEDED: "데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  INVALID_ENCID: "사용자 정보를 찾을 수 없어요. 서치어드바이저 페이지에서 다시 실행해주세요.",

  // Data Loading Errors
  DATA_LOAD_ERROR: "데이터를 불러오는 중 오류가 발생했어요.",
  DATA_LOAD_FAILED: "데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  NO_SITE_DATA: "이 사이트의 데이터가 없습니다.",
  EXPOSE_DATA_MISSING: "기본 리포트 데이터가 없어요.",
  DETAIL_DATA_MISSING: "상세 정보를 불러올 수 없어요.",

  // Download/Export Errors
  DOWNLOAD_FAILED: "파일 다운로드에 실패했어요. 다시 시도해주세요.",
  HTML_SAVE_ERROR: "HTML 저장 중 오류가 발생했어요. 다시 시도해주세요.",
  EXPORT_INCOMPLETE: "일부 사이트 데이터를 내보내지 못했어요.",

  // Import/Merge Errors
  IMPORT_FAILED: "데이터 가져오기에 실패했어요.",
  IMPORT_FORMAT_ERROR: "지원하지 않는 파일 형식이에요. V2 형식 파일을 사용해주세요.",
  MERGE_FAILED: "데이터 병합에 실패했어요.",
  NO_VALID_ACCOUNTS: "가져올 계정 데이터가 없어요.",

  // UI Errors
  SITE_NOT_FOUND: "사이트를 찾을 수 없어요.",
  SNAPSHOT_PANEL_NOT_FOUND: "패널을 찾을 수 없어요.",
  RENDER_ERROR: "화면 표시 중 오류가 발생했어요.",

  // Storage Errors
  STORAGE_ERROR: "데이터 저장 중 오류가 발생했어요.",
  CACHE_ERROR: "캐시 데이터를 읽는 중 오류가 발생했어요.",

  // Validation Errors
  INVALID_PAYLOAD: "데이터 형식이 올바르지 않아요.",
  INVALID_ACCOUNT_DATA: "계정 데이터가 올바르지 않아요.",
  DATA_INCONSISTENCY: "데이터 일관성 검사에 실패했어요.",

  // Generic Errors
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
  RETRY_LATER: "잠시 후 다시 시도해주세요.",
  CONTACT_SUPPORT: "문제가 지속되면 고객센터에 문의해주세요."
};

// Helper function to display user-friendly errors
function showError(userMessage, technicalError = null, context = null) {
  // Log technical error for debugging
  if (technicalError) {
    console.error('[Error]', context || 'Unknown', technicalError);
  }

  // Report to error tracking system
  if (typeof ERROR_TRACKING !== 'undefined' && ERROR_TRACKING.reportError) {
    ERROR_TRACKING.reportError({
      type: 'userError',
      message: userMessage,
      technicalError: technicalError?.message || String(technicalError),
      context: context
    });
  }

  return userMessage;
}

// Helper function to create inline error message element
function createInlineError(message, actionCallback = null, actionText = '다시 시도') {
  const container = document.createElement('div');
  container.style.cssText = 'padding:20px;text-align:center;background:#0f172a;border:1px solid #334155;border-radius:12px;margin:16px 0';

  const icon = document.createElement('div');
  icon.style.cssText = 'font-size:32px;margin-bottom:12px;color:#ef4444';
  icon.textContent = '⚠️';

  const messageEl = document.createElement('div');
  messageEl.style.cssText = 'color:#f8fafc;font-weight:700;font-size:14px;margin-bottom:8px';
  messageEl.textContent = message;

  container.appendChild(icon);
  container.appendChild(messageEl);

  if (actionCallback) {
    const button = document.createElement('button');
    button.style.cssText = 'margin-top:12px;padding:8px 16px;background:#0ea5e9;color:#f8fafc;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;transition:background 0.2s';
    button.textContent = actionText;
    button.onmouseover = () => button.style.background = '#0284c7';
    button.onmouseout = () => button.style.background = '#0ea5e9';
    button.onclick = actionCallback;
    container.appendChild(button);
  }

  return container;
}

async function fetchWithRetry(url, options, maxRetries = 2) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) return res;
      if (res.status !== 429 && res.status < 500) return res; // Don't retry 4xx (except 429)
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        console.error('[fetchWithRetry] Request timeout:', url);
        throw new Error(ERROR_MESSAGES.REQUEST_TIMEOUT);
      }
      if (attempt === maxRetries) throw new Error(ERROR_MESSAGES.MAX_RETRIES_EXCEEDED);
    }
    attempt++;
    if (attempt <= maxRetries) {
      const delay = Math.min(CONFIG.RETRY.BASE_DELAY_MS * Math.pow(2, attempt - 1), CONFIG.RETRY.MAX_DELAY_MS);
      const jitter = Math.floor(Math.random() * CONFIG.RETRY.JITTER_MS);
      await new Promise((r) => setTimeout(r, delay + jitter));
    }
  }
  throw new Error(ERROR_MESSAGES.MAX_RETRIES_EXCEEDED);
}
