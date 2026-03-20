# UI / Data Pipeline Boundary

이 문서는 `src/app/main/` 내부에서
**무엇이 디자인 공급망(UI supply chain)이고, 무엇이 데이터 공급망(data supply chain)인지**
명확히 구분하기 위한 실무용 정본 문서다.

목표:

- 라이브 패널과 저장본 패널이 **같은 UI 소스**를 최대한 공유하게 만들기
- live/offline 차이는 **data provider** 와 bootstrap 단계로만 제한하기
- 다음 AI/개발자가 snapshot 전용 UI를 불필요하게 다시 만들지 못하게 막기

---

## 1. 핵심 원칙

### 원칙 A — 디자인은 공통

아래는 라이브/저장본이 동일한 소스를 써야 한다.

- shell 구조
- header / tabs / combo / buttons
- KPI / card / chart / empty-state / error-state
- 전체현황 렌더
- 사이트별 상세 렌더
- 하위탭 렌더러
- 반응형 규칙

### 원칙 B — 데이터만 분리

아래는 live / snapshot이 다르게 가져가도 된다.

- live fetch / cache / refresh pipeline
- offline export payload
- read-only bootstrap
- snapshot compat API

추가 경계 규칙:

- 공통 UI 파일은 `allSites`, `mergedMeta`, `cacheMeta`, `curMode`, `curSite`, `curTab`
  같은 값을 직접 전역에서 읽기보다 **provider facade (`07-data-provider.js`)** 를 우선 사용한다.
- 특히 `09-ui-controls.js`, `10-all-sites-view.js`, `11-site-view.js` 에서
  새로운 전역 직접 참조를 늘리는 방식으로 문제를 해결하지 않는다.

### 원칙 C — snapshot 전용 UI는 예외로만 허용

허용 범위:

- payload 직렬화
- inline JSON/script/style escape
- offline bootstrap entry
- no-op API
- snapshot 파일 메타 표시
- combo top-layer 보정(현 시점 예외)

허용하지 않는 것:

- snapshot 전용 카드 마크업 복제
- snapshot 전용 탭 UI 복제
- snapshot 전용 색상/spacing 분기 남발
- live renderer와 다른 별도 layout 구현

---

## 2. 파일별 역할

### 공통 UI 정본

- `00-constants.js`
  - 탭 정의, 색상 토큰, UI 상수
- `01-helpers.js`
  - KPI, 카드, 차트, 공통 surface helper
- `02-dom-init.js`
  - 패널 shell 생성
- `08-renderers-*.js`
  - 사이트별 하위탭 렌더러
- `09-ui-controls.js`
  - 모드/탭/콤보 등 공통 상호작용
- `10-all-sites-view.js`
  - 전체현황 UI 정본
- `11-site-view.js`
  - 사이트별 UI 정본

### live data provider 영역

- `04-api.js`
- `13-refresh.js`
- data/cache 관련 모듈

### snapshot 전용 entry / adapter 영역

- `12-snapshot.js`
  - export 진입점
  - payload normalize
  - offline shell state
  - read-only bootstrap
  - compat API

---

## 3. 설계 배경

과거 회귀 대부분은 snapshot 쪽에서
UI 공급망과 데이터 공급망을 같이 건드렸기 때문에 생겼다.

예:

- helper/style token 누락
- 저장본 전용 전체현황 카드 drift
- 저장본 전용 콤보/탭/레이아웃 예외
- 모바일 parity 불일치

따라서 앞으로는:

- UI는 공통 경로에 더 많이 수렴
- snapshot은 data adapter + bootstrap 중심으로 축소

해야 한다.

---

## 4. 변경 유형별 규칙

### 전체현황 기간 필터 변경

관련 문서:

- `ALL_SITES_PERIOD_FILTER_DESIGN.md`

원칙:

- 전체현황 전용 local view state로 본다.
- canonical 90일 row를 직접 바꾸지 않는다.
- click/expose/CTR/click trend만 period 파생 계산한다.
- 색인 추이는 pass-through 유지한다.

### 헤더 / 탭 / 콤보 / 카드 디자인 변경

먼저 공통 UI 파일을 수정한다.

함께 볼 파일:

- `02-dom-init.js`
- `09-ui-controls.js`
- `10-all-sites-view.js`
- `11-site-view.js`
- `08-renderers-*`

### fetch / refresh / cache 정책 변경

live provider 변경으로 본다.

함께 볼 파일:

- `04-api.js`
- `13-refresh.js`
- cache/data manager 계열

### 저장 버튼 / export / payload 변경

snapshot entry 변경으로 본다.

함께 볼 파일:

- `12-snapshot.js`
- `SNAPSHOT_EXPORT_CONTRACT.md`
- `scripts/verify_snapshot_contract.js`

---

## 5. 다음 작업자가 반드시 지켜야 할 금지사항

1. snapshot 전용 카드/탭 UI를 새로 만들지 말 것
2. live 쪽 UI 변경을 snapshot CSS patch로만 덮지 말 것
3. provider 차이를 UI 차이로 해결하지 말 것
4. `12-snapshot.js` 안에 새로운 표현 로직을 과도하게 집어넣지 말 것
5. 공통 renderer 수정 후 saved HTML 검증을 생략하지 말 것
6. 공통 UI에서 `allSites`/`mergedMeta`/selection state 직접 참조를 다시 늘리지 말 것

---

## 6. 실행 순서 원칙

1. 문서/주석 먼저
2. 공통화 대상 확정
3. snapshot 전용 예외 최소셋 확정
4. 그 다음에 리팩토링

이 순서를 어기지 않는다.
