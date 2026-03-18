# SearchAdvisor Runtime Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
