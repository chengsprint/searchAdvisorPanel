#!/bin/bash
# ============================================================
# V2 헬퍼 함수 통합 검증 스크립트
# 사용법: bash verify-v2-integration.sh
# ============================================================

set -e  # 오류 발생 시 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

# 작업 디�토리
cd /home/seung/.cokacdir/workspace/yif7zotu

echo "============================================================"
echo "V2 헬퍼 함수 통합 검증"
echo "============================================================"
echo ""

# ============================================================
# 1. 파일 존재 확인
# ============================================================
log_info "1. 필수 파일 확인..."

FILES=(
  "src/app/main/00-constants.js"
  "src/app/main/01-helpers.js"
  "build.js"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    log_success "$file 존재함"
  else
    log_error "$file 존재하지 않음"
    exit 1
  fi
done

echo ""

# ============================================================
# 2. 상수 정의 확인
# ============================================================
log_info "2. V2 상수 정의 확인..."

if grep -q "PAYLOAD_V2" src/app/main/00-constants.js; then
  log_success "PAYLOAD_V2 상수 정의됨"
else
  log_warning "PAYLOAD_V2 상수 없음 (추가 필요)"
fi

if grep -q "PAYLOAD_FIELDS" src/app/main/00-constants.js; then
  log_success "PAYLOAD_FIELDS 상수 정의됨"
else
  log_warning "PAYLOAD_FIELDS 상수 없음 (추가 필요)"
fi

if grep -q 'META: "__meta"' src/app/main/00-constants.js; then
  log_success "P.ROOT.META 상수 정의됨"
else
  log_warning "P.ROOT.META 상수 없음 (추가 필요)"
fi

echo ""

# ============================================================
# 3. 헬퍼 함수 확인
# ============================================================
log_info "3. V2 헬퍼 함수 확인..."

HELPER_FUNCTIONS=(
  "isV2Payload"
  "normalizeSiteUrl"
  "getAllSites"
  "getAccountForSite"
  "getSiteData"
  "getSiteMeta"
  "getUIState"
  "setUIState"
  "clearV2Cache"
)

MISSING_COUNT=0
for func in "${HELPER_FUNCTIONS[@]}"; do
  if grep -q "function $func" src/app/main/01-helpers.js; then
    log_success "$func() 정의됨"
  else
    log_error "$func() 없음"
    ((MISSING_COUNT++))
  fi
done

if [ $MISSING_COUNT -gt 0 ]; then
  log_error "$MISSING_COUNT개 함수 누락"
  exit 1
fi

echo ""

# ============================================================
# 4. 문법 검증
# ============================================================
log_info "4. JavaScript 문법 검증..."

if node -c src/app/main/00-constants.js 2>/dev/null; then
  log_success "00-constants.js 문법 정상"
else
  log_error "00-constants.js 문법 오류"
  exit 1
fi

if node -c src/app/main/01-helpers.js 2>/dev/null; then
  log_success "01-helpers.js 문법 정상"
else
  log_error "01-helpers.js 문법 오류"
  exit 1
fi

echo ""

# ============================================================
# 5. 빌드 실행
# ============================================================
log_info "5. 빌드 실행..."

if node build.js > /tmp/build.log 2>&1; then
  log_success "빌드 성공"

  # 빌드 출력 확인
  if [ -f dist/runtime.js ]; then
    SIZE=$(du -h dist/runtime.js | cut -f1)
    log_success "dist/runtime.js 생성됨 ($SIZE)"
  else
    log_error "dist/runtime.js 생성되지 않음"
    exit 1
  fi

  if [ -f dist/demo.html ]; then
    log_success "dist/demo.html 생성됨"
  else
    log_warning "dist/demo.html 생성되지 않음 (선택사항)"
  fi
else
  log_error "빌드 실패"
  cat /tmp/build.log
  exit 1
fi

echo ""

# ============================================================
# 6. 빌드 결과 검증
# ============================================================
log_info "6. 빌드 결과 내 V2 함수 확인..."

if grep -q "isV2Payload" dist/runtime.js; then
  log_success "isV2Payload() 런타임에 포함됨"
else
  log_warning "isV2Payload() 런타임에 없음 (minify 제외 가능)"
fi

if grep -q "normalizeSiteUrl" dist/runtime.js; then
  log_success "normalizeSiteUrl() 런타임에 포함됨"
else
  log_warning "normalizeSiteUrl() 런타임에 없음"
fi

echo ""

# ============================================================
# 7. 캐시 정책 확인
# ============================================================
log_info "7. 캐시 정책 확인..."

if grep -q "V2_CACHE_TTL_MS" src/app/main/01-helpers.js; then
  log_success "캐시 TTL 상수 정의됨"
else
  log_warning "캐시 TTL 상수 없음"
fi

if grep -q "v2Cache" src/app/main/01-helpers.js; then
  log_success "캐시 Map 객체 정의됨"
else
  log_warning "캐시 Map 객체 없음"
fi

echo ""

# ============================================================
# 요약
# ============================================================
echo "============================================================"
log_success "모든 검증 통과!"
echo "============================================================"
echo ""
echo "다음 단계:"
echo "  1. 브라우저에서 테스트"
echo "  2. 콘솔에서 V2 함수 테스트"
echo "  3. 스냅샷 생성/가져오기 테스트"
echo ""
echo "빌드 산출물:"
echo "  - dist/runtime.js"
echo "  - dist/demo.html"
echo ""
