# SearchAdvisor UI Runtime Notes — 2026-03-19

이 문서는 2026-03-19 기준 SearchAdvisor 패널 UI 관련 특이사항, 수정 내역, 주의사항을 한 파일에 정리한 운영 메모입니다.

## 이번에 정리한 핵심 이슈

### 1) 빈 사각형 아이콘
- 원인: sanitizer가 SVG 내부 `polygon`, `polyline`, `ellipse`, `points` 등을 충분히 허용하지 않아 아이콘 도형이 제거됨
- 조치:
  - SVG 허용 태그/속성 보강
  - 아이콘 도형이 비어 있으면 fallback 아이콘으로 복구

### 2) 콤보박스 사이트 이름이 `https:`만 보이던 문제
- 원인: 콤보 항목 제목을 만들 때 URL을 잘못 잘라 첫 조각만 표시
- 조치:
  - `getSiteShortName()` 추가
  - 항목 제목은 `host` 위주, 보조 줄은 전체 URL로 분리

### 3) 부팅 직후 혼자 자동 새로고침하는 문제
- 원인:
  - `shouldBootstrapFullRefresh()`가 localStorage 캐시 스탬프 중심으로만 만료 판단
  - 이미 페이지 안에 fresh 데이터가 있어도 로컬 스탬프가 비어 있으면 곧바로 재수집으로 판단 가능
- 조치:
  - `memCache`
  - `__sadvInitData`
  - `__sadvMergedData`
  안의 `__cacheSavedAt`도 함께 참조하도록 완화

### 4) 캐시 메타 UI가 너무 공간을 차지하는 문제
- 기존: `캐시저장 / 자동갱신까지 / TTL` 3개의 칩
- 변경:
  - compact summary 1칩으로 축약
  - 자세한 정보는 `title`로 유지
  - 임박/만료 상태는 색으로만 경고

## 디자인 토큰 정리 현황

1차:
- accent soft background / border / text
- warm dark background
- danger soft background

2차:
- radius
- spacing
- shadow

현재 공통 토큰은 `src/app/main/00-constants.js`의 `T` 객체에 모여 있습니다.

## 아직 남아 있는 기술 부채

### `02-dom-init.js` seed shell 문자열
- 현재 legacy seed shell 스타일 문자열이 남아 있음
- 다만 실행 직후 warm palette로 치환되도록 되어 있어 실제 결과물에는 큰 영향이 적음
- 향후 완전 정리 시:
  - seed shell HTML/CSS 자체를 warm theme 기준으로 리라이트하는 것이 바람직

## 운영/QA 시 주의사항

### 캐시 관련
- 기본 TTL은 12시간
- fresh payload가 있을 때는 자동 재수집이 과도하게 돌지 않도록 완화함
- 다만 실제 페이지 데이터에 `__cacheSavedAt`가 전혀 없으면 일부 케이스에서 보수적으로 동작할 수 있음

### 테스트 권장 방식
- `@main` 브랜치보다는 커밋 핀 테스트 권장
- 이유:
  - CDN branch cache 오해 가능성
  - 동일 페이지 중복 주입 시 진단이 꼬일 수 있음

## 최근 관련 커밋(발췌)
- `119a097` Fix combo site names and avoid eager auto refresh on fresh live data
- `5469a7e` Expand warm theme tokens to cards and status surfaces
- `fe711d1` Introduce shared warm theme tokens for badges and shell styles
- `1413715` Unify remaining status and snapshot colors with warm theme
- `67000cf` Fix empty-state SVG icons and polish warm shell theme

## 권장 다음 단계
1. 실페이지 체감 테스트
2. 남는 이슈만 수집
3. 필요 시 `02-dom-init.js` seed shell 완전 정리

## 2026-03-20 추가 메모: Snapshot 콤보 top-layer

- 저장본(snapshot)에서 `사이트별 > 콤보 하단 팝업`은 live panel과 stacking context가 달라 별도 처리 필요
- `#sadv-combo-drop` 기본 CSS에 `!important`가 있어 JS에서 일반 inline style만 넣어선 override되지 않음
- 현재 snapshot 쪽은:
  - top-layer portal
  - viewport 기준 fixed 위치
  - `style.setProperty(..., "important")`
  - rect retry sync
  방식을 사용
- 상세 설명은 `docs/SNAPSHOT_COMBO_TOP_LAYER_NOTES.20260320.md` 참고
