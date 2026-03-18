#!/bin/bash
# React 18 호환성 검증 스크립트
# 이 스크립트는 React 18 호환성 구현을 검증합니다.

set -e

echo "================================"
echo "React 18 호환성 검증"
echo "================================"
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 검증 카운터
PASSED=0
FAILED=0

# 검증 함수
verify() {
  local name="$1"
  local command="$2"

  echo -n "검증: $name... "

  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}FAIL${NC}"
    ((FAILED++))
    return 1
  fi
}

echo "1. 파일 존재 확인"
echo "----------------"
verify "React 18 호환성 모듈" "test -f /tmp/worktree-p2/src/app/main/00-react18-compat.js"
verify "수정된 12-snapshot.js" "test -f /tmp/worktree-p2/src/app/main/12-snapshot.js"
verify "수정된 14-init.js" "test -f /tmp/worktree-p2/src/app/main/14-init.js"
verify "수정된 07-ui-state.js" "test -f /tmp/worktree-p2/src/app/main/07-ui-state.js"
verify "수정된 build.js" "test -f /tmp/worktree-p2/build.js"
verify "빌드 결과물" "test -f /tmp/worktree-p2/dist/runtime.js"
echo ""

echo "2. 코드 내용 확인"
echo "----------------"
verify "00-react18-compat.js에 detectReactVersion 존재" "grep -q 'detectReactVersion' /tmp/worktree-p2/src/app/main/00-react18-compat.js"
verify "00-react18-compat.js에 createReact18CompatibleObserver 존재" "grep -q 'createReact18CompatibleObserver' /tmp/worktree-p2/src/app/main/00-react18-compat.js"
verify "00-react18-compat.js에 runConcurrentTask 존재" "grep -q 'runConcurrentTask' /tmp/worktree-p2/src/app/main/00-react18-compat.js"
verify "12-snapshot.js에 __REACT18_COMPAT__ 참조" "grep -q '__REACT18_COMPAT__' /tmp/worktree-p2/src/app/main/12-snapshot.js"
verify "14-init.js에 __REACT18_COMPAT__ 참조" "grep -q '__REACT18_COMPAT__' /tmp/worktree-p2/src/app/main/14-init.js"
verify "07-ui-state.js에 __SEARCHADVISOR_UI_STATE__ 존재" "grep -q '__SEARCHADVISOR_UI_STATE__' /tmp/worktree-p2/src/app/main/07-ui-state.js"
verify "build.js에 00-react18-compat.js 포함" "grep -q '00-react18-compat.js' /tmp/worktree-p2/build.js"
echo ""

echo "3. JavaScript 문법 검증"
echo "----------------"
verify "00-react18-compat.js 문법" "node --check /tmp/worktree-p2/src/app/main/00-react18-compat.js"
verify "12-snapshot.js 문법" "node --check /tmp/worktree-p2/src/app/main/12-snapshot.js"
verify "14-init.js 문법" "node --check /tmp/worktree-p2/src/app/main/14-init.js"
verify "07-ui-state.js 문법" "node --check /tmp/worktree-p2/src/app/main/07-ui-state.js"
verify "runtime.js 문법" "node --check /tmp/worktree-p2/dist/runtime.js"
echo ""

echo "4. 빌드 검증"
echo "----------------"
verify "runtime.js 파일 크기 (> 600KB)" "test \$(stat -c%s /tmp/worktree-p2/dist/runtime.js) -gt 600000"
verify "runtime.js 라인 수 (> 8000)" "test \$(wc -l < /tmp/worktree-p2/dist/runtime.js) -gt 8000"
echo ""

echo "5. 기능 검증"
echo "----------------"
verify "테스트 스위트 실행" "node /tmp/worktree-p2/tests/react18-compat.test.js"
echo ""

echo "6. 문서화 확인"
echo "----------------"
verify "완료 보고서 존재" "test -f /tmp/worktree-p2/P2_REACT18_COMPATIBILITY_REPORT.md"
verify "빠른 참조 가이드 존재" "test -f /tmp/worktree-p2/REACT18_QUICK_REFERENCE.md"
echo ""

echo "================================"
echo "검증 결과 요약"
echo "================================"
echo -e "통과: ${GREEN}$PASSED${NC}"
echo -e "실패: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ 모든 검증 통과!${NC}"
  echo ""
  echo "React 18 호환성 구현이 성공적으로 완료되었습니다."
  echo ""
  echo "주요 변경사항:"
  echo "  - React 18 호환성 계층 추가 (00-react18-compat.js)"
  echo "  - MutationObserver → React 18 호환 Observer로 대체"
  echo "  - 비동기 초기화 → Concurrent Mode 최적화"
  echo "  - 전역 상태 관리 → React 18 호환 상태 관리"
  echo "  - StrictMode 지원 추가"
  echo ""
  echo "다음 단계:"
  echo "  1. 실제 NAVER 환경에서 테스트"
  echo "  2. React 18 전용 기능 활용 검토"
  echo "  3. 상태 관리 라이브러리 도입 검토"
  echo ""
  exit 0
else
  echo -e "${RED}✗ 일부 검증 실패${NC}"
  echo "실패한 항목을 확인하고 수정하세요."
  exit 1
fi
