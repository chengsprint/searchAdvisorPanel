const CONFIG = {
  UI: {
    PANEL_WIDTH: 490,
    PANEL_PADDING: 32,
    Z_INDEX_TOOLTIP: 10000000
  },
  CHART: {
    MIN_HEIGHT: 65,
    PADDING: { LEFT: 4, RIGHT: 4, TOP: 6, BOTTOM: 6 },
    TOOLTIP_OFFSET: { X: 14, Y: 36 },
    BAR_GAP: 3,
    MIN_BAR_WIDTH: 3,
    Y_AXIS_COLLISION_THRESHOLD: 8
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

const ICONS = {
  // KPI / 통계 아이콘
  click: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="m15 11-1 9"/></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  chart: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  up: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  down: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  index: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
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
  logoSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  trendUp: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  linkInsight: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  pieChart: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
};
const C = {
  green: "#10b981",
  blue: "#0ea5e9",
  amber: "#f59e0b",
  red: "#ef4444",
  purple: "#a855f7",
  teal: "#14b8a6",
  orange: "#f97316",
  pink: "#ec4899",
  bg0: "#020617",
  bg1: "#0f172a",
  bg2: "#1e293b",
  border: "#334155",
  text: "#f8fafc",
  muted: "#64748b",
  sub: "#94a3b8",
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
const ALL_SITES_BATCH = 4;
const FULL_REFRESH_BATCH_SIZE = 1;
const FULL_REFRESH_SITE_DELAY_MS = 350;
const FULL_REFRESH_JITTER_MS = 150;

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
      }
      if (attempt === maxRetries) throw e;
    }
    attempt++;
    if (attempt <= maxRetries) {
      const delay = Math.min(CONFIG.RETRY.BASE_DELAY_MS * Math.pow(2, attempt - 1), CONFIG.RETRY.MAX_DELAY_MS);
      const jitter = Math.floor(Math.random() * CONFIG.RETRY.JITTER_MS);
      await new Promise((r) => setTimeout(r, delay + jitter));
    }
  }
  throw new Error("Max retries exceeded");
}
