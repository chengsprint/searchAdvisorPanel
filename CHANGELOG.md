# SearchAdvisor Runtime Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.3] - 2026-03-19

### Fixed
- 모듈 빌드 경로에서 상단 `새로고침` 버튼이 실제 수동 전체 갱신으로 연결되지 않던 문제 수정
- 모듈 빌드 runtime에서 `window.__sadvApi.refresh()`가 누락되어 외부 자동화/디버깅 진입점이 사라졌던 문제 수정
- `닫기` / `저장` 액션 바인딩이 모듈 빌드 경로에 일관되게 반영되지 않던 문제 정리

### Changed
- 헤더에 `캐시저장`, `자동갱신까지`, `12시간 TTL` 메타 칩 표시 추가
- UI snapshot/state 응답에 live cache metadata(`updatedAt`, `remainingMs`, `ttlMs`, `sourceCount`) 포함
- 캐시 잔여시간이 세션 중에도 갱신되도록 header sync 경로 보강

### Validation
- `npm run build` 통과
- Playwright 기반 검증에서 헤더 메타 표시 확인
- Playwright 기반 검증에서 `#sadv-refresh-btn` 클릭 시 `trigger: "manual"` 이벤트 발생 확인
- 브라우저 런타임 상태에서 `window.__SEARCHADVISOR_UI_STATE__.getState().cacheMeta` 노출 확인

### Documentation
- `docs/RELEASE_NOTES_v2.0.3_20260319.md` 추가

## [2.0.2] - 2026-03-19

### Fixed
- SearchAdvisor 실페이지에서 `encId`를 찾지 못해 `fetchDiagnosisMeta`가 실패하던 문제 수정
- `secTitle()`가 HTML 보조 라벨까지 escape하여 문자열로 노출되던 렌더링 문제 수정
- 툴팁 HTML이 escape되어 강조/줄바꿈이 깨지던 문제 수정
- 상단 `새로고침`/`저장` 버튼이 좁은 폭에서 줄바꿈되던 레이아웃 문제 수정

### Changed
- `ACCOUNT_UTILS.getEncId()`에 `enc_id`, window object scan, resource scan fallback 추가
- shell 액션 버튼에 `nowrap`, `min-width`, `flex-shrink` 보정 적용

### Validation
- `npm run build` 통과
- mock `authUser.enc_id` 주입 기준 badge/shell 렌더 확인

### Documentation
- `docs/RELEASE_NOTES_v2.0.2_20260319.md` 추가

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
