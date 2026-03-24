# Changelog

이 프로젝트의 주요 공개 변경 이력을 기록합니다.

## [2.0.5] - 2026-03-21

### Added
- `dist/loader.js`
- `dist/stable.json`
- `scripts/write_stable_manifest.js`
- 전체현황 기간 필터
- merge saved snapshot용 엑셀 내보내기 흐름
- `merge.py` 기반 병합 워크플로우

### Changed
- `loader.js -> stable.json -> runtime.js` 배포 경로 정리
- live / saved / merge 런타임 계약 정리
- saved reopen / merge display / XLSX export 워크플로우 보강

### Fixed
- saved HTML reopen 회귀
- merge saved snapshot 표시/내보내기 경계
- auth 실패 시 불필요한 사이트별 요청 지속 문제

## [2.0.4] - 2026-03-20

### Fixed
- saved HTML 렌더 parity 문제
- 사이트별/하위탭/콤보 전환 안정성
- 모바일 저장본 레이아웃 문제

## [2.0.3] - 2026-03-19

### Changed
- 캐시 메타 표시 강화
- 수동 새로고침 경로와 facade 노출 보강

## [2.0.2] - 2026-03-19

### Fixed
- `encId` fallback 복구
- 상단 액션 버튼 레이아웃 문제

## [2.0.1] - 2026-03-18

### Fixed
- shell 초기화 및 runtime 오류 방어
- 모듈 빌드 경로 누락 helper 보강

## [2.0.0] - 2026-03-18

### Changed
- V2 payload/runtime 구조 도입
- 다중 계정 및 병합 기반 구조 정리
