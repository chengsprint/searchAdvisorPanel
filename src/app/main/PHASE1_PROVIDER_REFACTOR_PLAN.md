# Phase 1 Provider Refactor Plan

이 문서는 라이브 패널과 saved HTML(snapshot)을 **같은 앱 + 다른 data provider**
구조로 재정렬하기 위한 **1단계(Contract Stabilization)** 정본 설계 문서다.

이 문서는 구현보다 우선한다. 이후 작업자는 반드시 이 문서를 먼저 읽고,
여기서 정의한 경계/계약/금지사항을 지켜야 한다.

---

## 1. 왜 이 문서가 필요한가

현재 saved HTML은 기능적으로는 많이 안정화됐지만, 구조적으로는 여전히 아래 문제가 있다.

- `12-snapshot.js`가 payload normalize / HTML export / bootstrap / helper 직렬화 / saved API 역할을 동시에 맡고 있다.
- saved HTML은 “같은 앱의 offline 실행”이라기보다 “앱 조각을 오프라인용으로 재조립한 결과물”에 가깝다.
- 이 때문에 상수 누락, helper 누락, 초기화 순서 문제(TDZ), state parity drift가 반복된다.

즉, 지금 구조는 **실용적이지만 장기 최선은 아니다.**

장기적으로는 아래 구조가 목표다:

- **공통 UI / 공통 상태기계 / 공통 렌더러**
- **다른 data provider**
  - live provider
  - snapshot provider

한 줄로:

> 라이브와 saved는 다른 앱이 아니라, **같은 앱이 다른 공급원으로 실행되는 형태**여야 한다.

---

## 2. Phase 1의 목적

Phase 1은 구조 전체를 한 번에 뒤엎지 않는다.

목적은 딱 3개다.

1. **공용 state / provider / action contract를 문서와 코드에 고정**
2. **UI가 직접 전역/암묵 상태를 읽지 않도록 facade 기준을 세움**
3. **saved 전용 bootstrap은 남겨두되, 무엇을 절대 담당하면 안 되는지 경계 설정**

즉, Phase 1은 “완성 리팩토링”이 아니라
**후속 대공사를 안전하게 할 수 있게 경계를 고정하는 단계**다.

---

## 3. 이번 단계에서 바꾸는 것 / 안 바꾸는 것

### 바꾸는 것
- 문서/주석 기반 경계 고정
- public contract 정의
- provider facade를 canonical seam으로 승격하기 위한 준비
- UI가 직접 참조하는 전역 상태를 줄이는 방향으로 코드 정리

### 안 바꾸는 것
- fetch/cache 전체 구조를 한 번에 교체하지 않음
- `12-snapshot.js`를 한 번에 삭제/대체하지 않음
- 전체 저장 포맷을 새 포맷으로 갈아엎지 않음
- saved HTML 호환성을 깨는 급진적 변경 금지

---

## 4. 핵심 설계 원칙

### 원칙 A — UI는 provider-neutral 해야 한다
라이브든 saved든, UI는 가능하면 아래만 알아야 한다.

- 현재 state
- 현재 capabilities
- action 호출 진입점

UI가 직접:
- `window.__sadvRows`
- `curMode`
- `curSite`
- `window.__SEARCHADVISOR_SNAPSHOT_API__`
같은 공급원별 전역을 읽으면 안 된다.

### 원칙 B — canonical state와 display state를 분리한다
예:
- canonical row = 90일 정본
- derived row = 전체현황 기간 필터용 뷰 계산 결과

이 원칙을 깨면 live/saved/merge parity가 무너진다.

### 원칙 C — snapshot은 UI 구현 파일이 아니라 boot/provider 파일이어야 한다
`12-snapshot.js`는 장기적으로:
- payload 적재
- offline provider seed
- read-only capability 설정
- app boot
정도만 담당해야 한다.

UI/렌더 복제는 최대한 제거한다.

### 원칙 D — saved에서만 필요한 차이는 “행동 제한”이어야지 “UI 분기”가 아니어야 한다
즉:
- refresh 없음
- download 없음
- close 없음
- fetch 없음

이 차이만 남기고,
UI 자체는 공통 엔트리를 타게 만드는 것이 목표다.

---

## 5. 파일별 책임 재정의

### 공통 UI / 상태 / 렌더 경로
- `00-constants.js`
- `01-helpers.js`
- `02-dom-init.js`
- `07-ui-state.js`
- `07-data-provider.js`
- `08-renderers-*.js`
- `09-ui-controls.js`
- `10-all-sites-view.js`
- `11-site-view.js`

### live provider / live-only 행동 경로
- `03-data-*`
- `04-api.js`
- `13-refresh.js`

### snapshot 전용 경로
- `12-snapshot.js`

### 레거시 참고
- `src/app/legacy-main.js`

---

## 6. 이번 단계의 실행 순서

1. 문서/계약/금지사항 고정
2. 코드 주석 보강
3. provider facade가 public seam이라는 점을 코드에 반영
4. UI가 facade 이외 전역 참조를 직접 늘리지 못하게 차단
5. 후속 단계에서 shared app entry로 갈 수 있게 영향 범위 정리

---

## 6.1 진행 상태 트래킹

이 문서는 설계 문서이면서 동시에 **Phase 1 진행 현황 기록** 역할도 겸한다.
다음 작업자는 아래 상태를 먼저 확인하고 이어서 작업해야 한다.

### 완료
- 문서/계약/guardrail 고정
- `07-data-provider.js` selection setter seam 추가
- `07-ui-state.js` selection state entry(`getSelectionStateValue` / `setSelectionStateValue`) 추가
- `09-ui-controls.js`
  - combo/site/tab/mode 일부가 selection seam을 타도록 1차 정리
  - `renderTab()`이 `curTab` 직접 read 대신 selection seam read를 우선 사용하도록 2차 정리
- `09-ui-controls.js`
  - combo/tab/mode 상호작용이 `setRuntimeMode/setRuntimeSite/setRuntimeTab` action wrapper를 우선 사용하도록 3차 정리
  - 반복적인 selection fallback object를 `getUiControlsSelectionState()` helper로 정리
- `10-all-sites-view.js`
  - canonical rows read를 facade 우선으로 정리
  - all-sites progress/render guard의 `curMode` direct read를 selection seam으로 이동
- `10-all-sites-view.js`
  - 카드 클릭이 `setRuntimeSite()` action seam을 우선 사용하도록 정리
  - selection/rows read를 `getAllSitesSelectionState()` / `getAllSitesCanonicalRows()` helper로 정리
- `11-site-view.js`
  - request guard의 `curSite` direct read를 selection seam으로 이동
- `06-merge-manager.js`
  - export payload가 selection/period state를 facade 우선으로 읽도록 정리
- `07-data-provider.js`
  - fallback shell state도 canonical rows getter를 우선 사용하도록 정리

### 아직 남음
- `09-ui-controls.js` 내부 direct global fallback 추가 축소
- `10-all-sites-view.js`의 canonical rows write(`window.__sadvRows = rows`) 축소 준비
- `12-snapshot.js`를 boot/provider 중심으로 좁히는 2단계 준비
- shared app entry 도입 전, public action seam 추가 정리

### rows seam 관점의 현재 판단
- **지금 당장 안전한 곳**
  - `07-ui-state.js`
  - `07-data-provider.js`
  - `10-all-sites-view.js`의 rows read/write facade 우선 사용
- **아직 위험해서 보류하는 곳**
  - `12-snapshot.js`의 `window.__sadvRows` direct write/read 다수
  - saved boot 초기화 순서와 묶인 rows 적재 지점

즉 Phase 1에서는 rows seam도 **provider/live 쪽부터 줄이고**, saved bootstrap rows 적재는
Phase 2 이상에서 다루는 것이 원칙이다.

### 이번 단계에서 의도적으로 보류한 것
- `12-snapshot.js` 로컬 `curMode/curSite/curTab` 대수술
- `switchMode()/setComboSite()/setTab()` 호출 순서 변경
- `window.__sadvRows` 즉시 제거

이 보류 항목들은 모두 saved HTML 회귀 위험이 커서 **Phase 1 후반 또는 Phase 2**로 넘긴다.

---

## 7. Phase 2 / 3을 위한 준비 포인트

### Phase 2 (Shared App Entry)
- live/saved가 같은 UI 엔트리를 타게 만들기
- saved는 offline provider만 다르게

### Phase 3 (Snapshot Bootstrap Slim)
- saved bootstrap이 payload + provider + boot만 하도록 축소
- helper 직렬화와 UI 재조립 최소화

---

## 8. 작업자 지침

향후 작업자는 반드시 다음 순서를 지켜야 한다.

1. 이 문서를 먼저 읽는다
2. `RUNTIME_STATE_CONTRACT.md`, `PROVIDER_ACTION_CONTRACT.md`, `SNAPSHOT_REFACTOR_GUARDRAILS.md`를 읽는다
3. 변경 대상 파일에서 해당 계약을 깨는지 먼저 판단한다
4. 코드 수정 후에는 live + saved 모두 검수한다

특히 금지:
- saved 전용 UI 분기를 또 새로 만드는 것
- UI가 provider 전역을 직접 읽게 만드는 것
- canonical state 의미를 은근히 바꾸는 것

---

## 9. 한 줄 결론

Phase 1의 목적은 구현을 많이 하는 게 아니라,

> **“같은 앱 + 다른 provider” 구조로 안전하게 갈 수 있도록 공용 계약과 경계를 먼저 고정하는 것**

이다.
