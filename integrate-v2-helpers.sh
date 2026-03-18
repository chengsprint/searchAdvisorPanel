#!/bin/bash
# ============================================================
# V2 헬퍼 함수 통합 자동화 스크립트
# 주의: 백업 후 실행할 것!
# 사용법: bash integrate-v2-helpers.sh
# ============================================================

set -e

# 색상
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

cd /home/seung/.cokacdir/workspace/yif7zotu

echo "============================================================"
echo "V2 헬퍼 함수 통합 자동화"
echo "============================================================"
echo ""

# ============================================================
# 1. 백업
# ============================================================
log_info "1. 백업 생성..."

BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

cp src/app/main/00-constants.js "$BACKUP_DIR/"
cp src/app/main/01-helpers.js "$BACKUP_DIR/"

log_success "백업 생성됨: $BACKUP_DIR"
echo ""

# ============================================================
# 2. 00-constants.js 수정
# ============================================================
log_info "2. 00-constants.js 수정..."

# P.ROOT.META 추가 확인
if grep -q 'META: "__meta"' src/app/main/00-constants.js; then
  log_success "P.ROOT.META 이미 존재함"
else
  # MERGED_META 뒤에 META 추가
  sed -i '/MERGED_META: "mergedMeta"/a\    META: "__meta"' src/app/main/00-constants.js
  log_success "P.ROOT.META 추가됨"
fi

# PAYLOAD_V2 상수 추가 확인
if grep -q 'const PAYLOAD_V2' src/app/main/00-constants.js; then
  log_success "PAYLOAD_V2 이미 존재함"
else
  # 파일 끝에 PAYLOAD_V2 추가
  cat >> src/app/main/00-constants.js << 'EOF'

// V2 PAYLOAD CONSTANTS
const PAYLOAD_V2 = {
  VERSION: "20260318-payload-contract-v2",
  DATA_FORMAT: "sadv_snapshot_v2",
  GENERATOR: "SearchAdvisor Runtime",
};

const PAYLOAD_FIELDS = {
  META: "__meta",
  ACCOUNTS: "accounts",
  UI: "ui",
  STATS: "stats",
  SUMMARY: "_summary",
  VERSION: "version",
  SAVED_AT: "savedAt",
  ACCOUNT_COUNT: "accountCount",
  TOTAL_SITES: "totalSites",
  ENC_ID: "encId",
  SITES: "sites",
  SITE_META: "siteMeta",
  DATA_BY_SITE: "dataBySite",
  LABEL: "label",
  DISPLAY_LABEL: "displayLabel",
  SHORT_NAME: "shortName",
  CUR_MODE: "curMode",
  CUR_SITE: "curSite",
  CUR_TAB: "curTab",
};

const PAYLOAD_DEFAULTS = {
  MODE: "all",
  TAB: "overview",
  ACCOUNT_EMAIL: "unknown@naver.com",
  ENC_ID: "unknown",
};
EOF
  log_success "PAYLOAD_V2, PAYLOAD_FIELDS, PAYLOAD_DEFAULTS 추가됨"
fi

echo ""

# ============================================================
# 3. 01-helpers.js 수정
# ============================================================
log_info "3. 01-helpers.js 수정..."

# V2 함수 존재 확인
if grep -q 'function isV2Payload' src/app/main/01-helpers.js; then
  log_warning "V2 함수 이미 존재함, 건너뜀"
else
  # escHtml 함수 끝(line 485) 찾기
  # V2_HELPERS_FINAL.js 내용 추가
  if [ -f V2_HELPERS_FINAL.js ]; then
    # escHtml 함수 끝에 V2 함수 추가
    sed -i '/^function escHtml/,/^}$/ {
      /^}$/ {
        a\
\
// ============================================================\
// V2 PAYLOAD HELPER FUNCTIONS\
// ============================================================\
// Cache Implementation (Map + TTL 5 minutes)\
const V2_CACHE_TTL_MS = 5 * 60 * 1000;\
const v2Cache = new Map();\
function createV2CacheEntry(value) {\
  return { value, expiresAt: Date.now() + V2_CACHE_TTL_MS };\
}\
function getV2Cached(key) {\
  const entry = v2Cache.get(key);\
  if (!entry) return null;\
  if (Date.now() > entry.expiresAt) {\
    v2Cache.delete(key);\
    return null;\
  }\
  return entry.value;\
}\
function setV2Cached(key, value) {\
  v2Cache.set(key, createV2CacheEntry(value));\
  if (v2Cache.size > 100) {\
    const now = Date.now();\
    for (const [k, v] of v2Cache.entries()) {\
      if (now > v.expiresAt) v2Cache.delete(k);\
    }\
  }\
}\
function clearV2Cache() {\
  v2Cache.clear();\
}\
// URL Normalization\
function normalizeSiteUrl(url) {\
  if (!url || typeof url !== "string") return "";\
  let normalized = url.trim().toLowerCase();\
  normalized = normalized.replace(/\/+$/, "");\
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {\
    normalized = "https://" + normalized;\
  }\
  return normalized;\
}\
// V2 Detection & Validation\
function isV2Payload(payload) {\
  if (!payload || typeof payload !== "object") return false;\
  const meta = payload.__meta;\
  if (!meta || typeof meta !== "object") return false;\
  return meta.version === PAYLOAD_V2.VERSION;\
}\
function validateV2Payload(payload) {\
  const errors = [];\
  if (!payload || typeof payload !== "object") {\
    errors.push("Payload must be an object");\
    return { valid: false, errors };\
  }\
  if (!payload.__meta) errors.push("Missing __meta field");\
  if (!payload.accounts || typeof payload.accounts !== "object") {\
    errors.push("Missing or invalid accounts field");\
  }\
  if (!payload.ui || typeof payload.ui !== "object") {\
    errors.push("Missing or invalid ui field");\
  }\
  return { valid: errors.length === 0, errors };\
}\
// Account Operations\
function getAccountCount(payload) {\
  if (!payload) return 0;\
  const meta = payload.__meta;\
  if (meta) return meta.accountCount || 0;\
  const accounts = payload.accounts;\
  if (accounts && typeof accounts === "object") {\
    return Object.keys(accounts).length;\
  }\
  return 0;\
}\
function getAccountEmails(payload) {\
  if (!payload) return [];\
  const accounts = payload.accounts;\
  if (!accounts || typeof accounts !== "object") return [];\
  return Object.keys(accounts);\
}\
function getAccountByEmail(payload, email) {\
  if (!payload || !email) return null;\
  const accounts = payload.accounts;\
  if (!accounts || typeof accounts !== "object") return null;\
  return accounts[email] || null;\
}\
// Site Operations (O(1) optimized)\
function buildSiteToAccountIndex(payload) {\
  const cacheKey = "siteIndex_" + (payload?.__meta?.savedAt || "unknown");\
  let index = getV2Cached(cacheKey);\
  if (index) return index;\
  index = new Map();\
  const accounts = payload.accounts;\
  if (!accounts || typeof accounts !== "object") {\
    setV2Cached(cacheKey, index);\
    return index;\
  }\
  for (const [email, account] of Object.entries(accounts)) {\
    const sites = account.sites || [];\
    for (const site of sites) {\
      const normalized = normalizeSiteUrl(site);\
      if (normalized) index.set(normalized, email);\
    }\
  }\
  setV2Cached(cacheKey, index);\
  return index;\
}\
function getAllSites(payload) {\
  if (!payload) return [];\
  const cacheKey = "allSites_" + (payload?.__meta?.savedAt || "unknown");\
  let cached = getV2Cached(cacheKey);\
  if (cached) return cached;\
  const sites = new Set();\
  const accounts = payload.accounts;\
  if (!accounts || typeof accounts !== "object") return [];\
  for (const account of Object.values(accounts)) {\
    const accountSites = account.sites || [];\
    for (const site of accountSites) {\
      const normalized = normalizeSiteUrl(site);\
      if (normalized) sites.add(normalized);\
    }\
  }\
  const result = Array.from(sites).sort();\
  setV2Cached(cacheKey, result);\
  return result;\
}\
function getAccountForSite(siteUrl, payload) {\
  if (!payload || !siteUrl) return null;\
  const normalized = normalizeSiteUrl(siteUrl);\
  if (!normalized) return null;\
  const index = buildSiteToAccountIndex(payload);\
  return index.get(normalized) || null;\
}\
function hasSite(siteUrl, payload) {\
  return getAccountForSite(siteUrl, payload) !== null;\
}\
// Site Data Operations\
function getSiteData(siteUrl, payload) {\
  if (!payload || !siteUrl) return null;\
  const email = getAccountForSite(siteUrl, payload);\
  if (!email) return null;\
  const account = getAccountByEmail(payload, email);\
  if (!account) return null;\
  const normalized = normalizeSiteUrl(siteUrl);\
  const dataBySite = account.dataBySite;\
  return dataBySite?.[normalized] || null;\
}\
function getSiteMeta(siteUrl, payload) {\
  if (!payload || !siteUrl) return null;\
  const email = getAccountForSite(siteUrl, payload);\
  if (!email) return null;\
  const account = getAccountByEmail(payload, email);\
  if (!account) return null;\
  const normalized = normalizeSiteUrl(siteUrl);\
  const siteMeta = account.siteMeta;\
  return siteMeta?.[normalized] || null;\
}\
function getSiteLabel(siteUrl, payload) {\
  const meta = getSiteMeta(siteUrl, payload);\
  if (meta) return meta.label || siteUrl;\
  return siteUrl || "";\
}\
// UI State Operations\
function getUIState(payload) {\
  if (!payload) {\
    return { curMode: "all", curSite: null, curTab: "overview" };\
  }\
  const ui = payload.ui || {};\
  return {\
    curMode: ui.curMode || "all",\
    curSite: ui.curSite || null,\
    curTab: ui.curTab || "overview"\
  };\
}\
function setUIState(payload, state) {\
  if (!payload || !state) return payload;\
  if (!payload.ui) payload.ui = {};\
  const ui = payload.ui;\
  if (state.curMode !== undefined) ui.curMode = state.curMode;\
  if (state.curSite !== undefined) ui.curSite = state.curSite;\
  if (state.curTab !== undefined) ui.curTab = state.curTab;\
  return payload;\
}\
// Stats & Summary\
function getStats(payload) {\
  if (!payload) return { success: 0, partial: 0, failed: 0, errors: [] };\
  const stats = payload.stats || {};\
  return {\
    success: stats.success || 0,\
    partial: stats.partial || 0,\
    failed: stats.failed || 0,\
    errors: Array.isArray(stats.errors) ? stats.errors : []\
  };\
}\
function getSummary(payload) {\
  if (!payload) return null;\
  return payload._summary || null;\
}\
function getSiteOwnership(payload) {\
  const summary = getSummary(payload);\
  if (!summary) return {};\
  return summary.siteOwnership || {};\
}\
// Creation\
function createEmptyV2Payload(email, encId) {\
  return {\
    __meta: {\
      version: PAYLOAD_V2.VERSION,\
      savedAt: new Date().toISOString(),\
      accountCount: 1\
    },\
    accounts: {\
      [email]: {\
        encId: encId || "unknown",\
        sites: [],\
        siteMeta: {},\
        dataBySite: {}\
      }\
    },\
    ui: {\
      curMode: "all",\
      curSite: null,\
      curTab: "overview"\
    },\
    stats: {\
      success: 0,\
      partial: 0,\
      failed: 0,\
      errors: []\
    }\
  };\
}\
function cloneV2Payload(payload) {\
  if (!payload) return null;\
  try {\
    return JSON.parse(JSON.stringify(payload));\
  } catch (e) {\
    console.error("[cloneV2Payload] Failed to clone:", e);\
    return null;\
  }\
}
      }
    }' src/app/main/01-helpers.js
    log_success "V2 헬퍼 함수 추가됨"
  else
    log_error "V2_HELPERS_FINAL.js 파일을 찾을 수 없음"
    exit 1
  fi
fi

echo ""

# ============================================================
# 4. 문법 검증
# ============================================================
log_info "4. 문법 검증..."

if node -c src/app/main/00-constants.js 2>/dev/null; then
  log_success "00-constants.js 문법 정상"
else
  log_error "00-constants.js 문법 오류"
  log_info "백업에서 복원 중..."
  cp "$BACKUP_DIR/00-constants.js" src/app/main/
  exit 1
fi

if node -c src/app/main/01-helpers.js 2>/dev/null; then
  log_success "01-helpers.js 문법 정상"
else
  log_error "01-helpers.js 문법 오류"
  log_info "백업에서 복원 중..."
  cp "$BACKUP_DIR/01-helpers.js" src/app/main/
  exit 1
fi

echo ""

# ============================================================
# 5. 빌드 실행
# ============================================================
log_info "5. 빌드 실행..."

if node build.js > /tmp/build.log 2>&1; then
  log_success "빌드 성공"

  if [ -f dist/runtime.js ]; then
    SIZE=$(du -h dist/runtime.js | cut -f1)
    log_success "dist/runtime.js 생성됨 ($SIZE)"
  fi
else
  log_error "빌드 실패"
  cat /tmp/build.log
  log_info "백업에서 복원 중..."
  cp "$BACKUP_DIR/00-constants.js" src/app/main/
  cp "$BACKUP_DIR/01-helpers.js" src/app/main/
  exit 1
fi

echo ""
echo "============================================================"
log_success "V2 헬퍼 함수 통합 완료!"
echo "============================================================"
echo ""
echo "백업 위치: $BACKUP_DIR"
echo "다음 단계:"
echo "  1. 브라우저에서 테스트"
echo "  2. 콘솔에서 V2 함수 테스트"
echo ""
echo "롤백 명령어:"
echo "  cp $BACKUP_DIR/00-constants.js src/app/main/"
echo "  cp $BACKUP_DIR/01-helpers.js src/app/main/"
echo ""
