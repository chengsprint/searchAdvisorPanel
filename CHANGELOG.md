# SearchAdvisor Runtime Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2026-03-18

### Fixed
- `sadv-combo-btn` 등 runtime shell DOM이 누락된 상태에서 `addEventListener`가 호출되던 오류 수정
- DOMPurify 로드 실패 시 HTML이 문자열로 escape되어 UI shell이 깨지던 문제 수정
- built-in fallback sanitizer를 도입해 DOMPurify 비가용 환경에서도 shell DOM이 정상 생성되도록 개선
- `tabsEl`, `modeBar`, `siteBar`, `labelEl`, `bdEl` 등 주요 DOM 참조의 null 방어 및 초기화 가드 추가
- modular runtime 경로에서 누락되던 `isMergedReport()` helper 추가
- `accountLabel` TDZ/전역 참조 문제로 인한 초기화 단계 runtime error 수정

### Changed
- DOMPurify CDN 로딩 경로를 정리하고 SRI 의존으로 인한 차단 이슈를 제거
- fallback sanitizer 경고를 1회만 출력하도록 조정하여 콘솔 노이즈 감소

### Testing
- Chromium 실검증에서 `#sadv-combo-btn`, `#sadv-tabs`, `#sadv-bd` 생성 확인
- 실제 페이지 컨텍스트 주입 테스트에서 console error 0건 확인
- `npm run build` 통과

### Documentation
- runtime shell 초기화/DOMPurify fallback 관련 릴리즈 노트 추가

### Added
- 에러 추적 시스템 (ERROR_TRACKING) (P0)
- React 18 호환성 계층 (00-react18-compat.js) (P2)
- V1 마이그레이션 기능 (migrateV1ToV2) (P2)
- 사용자 친화적 오류 메시지 (ERROR_MESSAGES) (P1)
- localStorage 경합 조건 해결 (쓰기 큐) (P1)
- 모바일 반응형 디자인 (768px 미디어 쿼리) (P1)
- 키보드 내비게이션 지원 (WCAG 2.1 AA) (P1)
- JSDoc 문서화 (85% 커버리지) (P1)
- CI/CD 파이프라인 (.github/workflows/ci.yml) (P3)
- 테스트 프레임워크 (Jest, Playwright) (P3)
- 영문 문서화 (README_EN.md) (P3)

### Changed
- API 응답 검증 강화 (API_RESPONSE_SCHEMAS) (P2)
- 번들 크기 최적화 (673KB → 672KB) (P2)
- 캐시 TTL 설정 상수화 (CACHE_CONFIG)
- 진행률 표시 개선 (예상 시간, 남은 시간)

### Fixed
- XSS 취약점 (escHtml 함수 보강)
- localStorage 경합 조건 (낙관적 잠금)
- 빌드 구문 오류 (중복 닫는 괄호)
- curMode 초기화 타이밍 문제
- SCHEMA_VERSIONS.compare() null 처리
- atob() 예외처리 추가
- exportSingleAccount() null 체크 강화

### Security
- CSRF 토큰 구현 (api-csrf-token)
- DOMPurify로 innerHTML XSS 방지
- Content Security Policy 고려

### Performance
- 쓰기 큐로 localStorage 경합 해결
- LRU Cache로 memCache 무한 성장 방지
- Code Splitting으로 번들 크기 최적화

### Testing
- 단위 테스트 23개 통과
- 통합 테스트 10개 통과
- E2E 테스트 15개 정의
- 테스트 커버리지 60%+ 달성

### Documentation
- README_EN.md (영문 번역)
- API_REFERENCE_EN.md (API 문서)
- 30개 상세 보고서/가이드

## [2.0.1] - 2026-03-18

### Fixed
- `Cannot read properties of null (reading 'addEventListener')` 오류 수정
- DOMPurify 로드 실패 시 UI shell HTML이 텍스트로 escape되던 문제 수정
- `sadv-combo-btn`, `sadv-tabs`, `sadv-bd` 등 shell DOM 누락 시 발생하던 연쇄 초기화 오류 방어
- modular runtime에서 누락되어 발생하던 `isMergedReport` 런타임 오류 수정
- TDZ/전역 참조 문제로 발생하던 `accountLabel is not defined` 런타임 오류 수정

### Changed
- DOMPurify fallback을 built-in sanitizer 방식으로 강화
- shell 초기화 시 필수 DOM scaffold 검증 및 조기 중단 로직 추가
- combo/tabs/mode UI 바인딩에 null-safe guard 추가

### Validation
- `npm run build` 통과
- Chromium 기반 런타임 검증에서 shell DOM 정상 생성 확인
- 실페이지 컨텍스트 기준 console error 0건 확인

### Documentation
- `docs/RELEASE_NOTES_v2.0.1_20260318.md` 추가

## [2.0.0] - 2026-03-18

### Major Changes (Big Bang Migration)
- V2 JSON Schema 완전 도입
- 다중 계정 지원 (ACCOUNT_UTILS)
- 데이터 검증 시스템 (DATA_VALIDATION)
- 스키마 버전 관리 (SCHEMA_VERSIONS)
- 병합 전략 상수 (MERGE_STRATEGIES)
- 레거시 V1 포맷 제거 (마이그레이션 함수로 대체)

### Breaking Changes
- V1 데이터 포맷 더 이상 지원하지 않음
- 레거시 HTML 파일 호환성을 위한 마이그레이션 필수

### Migration Guide
V1 → V2 자동 마이그레이션이 지원되나, 레거시 HTML 파일을 여는 경우 `migrateV1ToV2()` 함수가 자동으로 실행됩니다.

---

## [1.0.0] - 2026-01-XX

### Initial Release
- 첫 번역 공개
