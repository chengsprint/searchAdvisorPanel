// ============================================================
// 추가할 내용: /home/seung/.cokacdir/workspace/yif7zotu/src/app/main/00-constants.js
// 추가 위치: 파일 끝 (line 214 이후)
// ============================================================

// 1. P.ROOT.META 상수 추가 (line 104附近)
// 기존 코드:
const P = {
  // ...
  ROOT: {
    SAVED_AT: "savedAt",
    ALL_SITES: "allSites",
    CUR_MODE: "curMode",
    CUR_SITE: "curSite",
    CUR_TAB: "curTab",
    DATA_BY_SITE: "dataBySite",
    SITE_META: "siteMeta",
    MERGED_META: "mergedMeta"
    // META: "__meta"를 여기에 추가
  },
  // ...
};

// 수정된 코드:
const P = {
  // ...
  ROOT: {
    SAVED_AT: "savedAt",
    ALL_SITES: "allSites",
    CUR_MODE: "curMode",
    CUR_SITE: "curSite",
    CUR_TAB: "curTab",
    DATA_BY_SITE: "dataBySite",
    SITE_META: "siteMeta",
    MERGED_META: "mergedMeta",
    META: "__meta"  // ← 추가
  },
  // ...
};

// ============================================================
// 2. 파일 끝에 V2 상수 추가 (line 214 이후)
// ============================================================

// V2 PAYLOAD CONSTANTS
const PAYLOAD_V2 = {
  VERSION: "20260318-payload-contract-v2",
  DATA_FORMAT: "sadv_snapshot_v2",
  GENERATOR: "SearchAdvisor Runtime",
};

// V2 필드명 상수
const PAYLOAD_FIELDS = {
  // 최상위 필드
  META: "__meta",
  ACCOUNTS: "accounts",
  UI: "ui",
  STATS: "stats",
  SUMMARY: "_summary",

  // __meta 내부 필드
  VERSION: "version",
  SAVED_AT: "savedAt",
  ACCOUNT_COUNT: "accountCount",
  TOTAL_SITES: "totalSites",

  // accounts.{email} 내부 필드
  ENC_ID: "encId",
  SITES: "sites",
  SITE_META: "siteMeta",
  DATA_BY_SITE: "dataBySite",

  // siteMeta 내부 필드
  LABEL: "label",
  DISPLAY_LABEL: "displayLabel",
  SHORT_NAME: "shortName",

  // UI 내부 필드
  CUR_MODE: "curMode",
  CUR_SITE: "curSite",
  CUR_TAB: "curTab",
};

// V2 기본값 상수
const PAYLOAD_DEFAULTS = {
  MODE: "all",
  TAB: "overview",
  ACCOUNT_EMAIL: "unknown@naver.com",
  ENC_ID: "unknown",
};
