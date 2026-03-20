# Phase 2 Shared App Entry Plan

## 1. 목적

Phase 1의 목적은 기존 전역 상태/rows/action 흐름을 바로 뒤엎지 않고,
`selection state -> provider facade -> UI action seam` 순서로 경계를 세우는 것이었다.

Phase 2의 목적은 그 다음 단계로,

- live runtime
- saved(snapshot) runtime

이 **같은 UI entry / 같은 렌더 경로 / 같은 action contract**를 더 많이 공유하도록
구조를 실제로 좁혀 가는 것이다.

핵심 문장:

> Saved HTML은 "별도의 UI 재조립물"이 아니라,  
> "같은 앱을 offline provider로 실행하는 모드"에 더 가까워져야 한다.

---

## 2. 이번 단계에서 바꾸려는 것

Phase 2는 한 번에 전체 대공사를 하는 단계가 아니다.
이번 단계에서 의도하는 변화는 다음과 같다.

1. `12-snapshot.js`가 직접 쥐고 있는 UI 책임을 줄인다.
2. public action entry(`__sadvApi`)와 snapshot entry(`__SEARCHADVISOR_SNAPSHOT_API__`)의
   책임 차이를 더 명확히 한다.
3. live/saved가 공통 UI 함수 집합을 더 많이 공유하게 만든다.
4. helper 직렬화 allowlist 누락에 따른 saved-only 회귀를 줄인다.

즉 Phase 2는:

- snapshot bootstrap을 없애는 단계가 아니라,
- snapshot bootstrap을 **payload boot + provider wiring** 쪽으로 좁히는 단계다.

---

## 3. 바꾸지 않을 것

아래는 Phase 2에서 의도적으로 건드리지 않는다.

1. `buildSiteSummaryRow()`의 canonical 90일 row 의미
2. live fetch/cache/refresh 정책
3. snapshot 단일 HTML 오프라인 요구사항
4. period filter의 범위
   - 전체현황 전용
   - 색인 추이 비적용
5. merge schema / merge data contract

이 항목들은 이미 안정화된 영역이며,
Phase 2가 여기까지 흔들면 회귀 범위가 과도하게 커진다.

---

## 4. Shared App Entry의 정의

이 문서에서 "shared app entry"는 다음 의미로 쓴다.

### Shared
- `09-ui-controls.js`
- `10-all-sites-view.js`
- `11-site-view.js`
- `08-renderers-*`

처럼 실제 UI를 그리는 경로가
live와 saved에서 최대한 동일한 코드 경로를 타는 상태

### Entry
- 앱이 시작할 때 UI가 의존하는 state/provider/action contract를
  하나의 공통 진입점으로 맞추는 것

즉 shared app entry는

- "같은 UI 함수"
- "같은 action 이름"
- "같은 state shape"
- "다른 provider"

구조로 수렴하는 작업이다.

---

## 5. 현재 구조에서 가장 큰 결합 지점

### A. `12-snapshot.js`
현재도 다음 역할을 동시에 수행하고 있다.

- payload 직렬화
- saved bootstrap
- helper allowlist 관리
- 일부 snapshot runtime state 보정
- snapshot API 생성
- shell host 후처리

문제:
- 새 helper가 공통 UI에 추가될 때 saved allowlist 누락 위험
- helper 초기화 순서 문제
- live는 멀쩡하지만 saved에서만 터지는 회귀 발생

### B. `09-ui-controls.js`
공통 interaction layer이지만,
Phase 1까지는 "semantic seam" 중심으로 정리했을 뿐
여전히 saved bootstrap과 강하게 연결되는 함수들이 있다.

대표:
- `buildCombo`
- `setComboSite`
- `renderTab`
- `switchMode`

### C. `10-all-sites-view.js`
all-sites helper를 분리해 놓았지만,
이 helper들이 saved 직렬화 allowlist와 아직 결합돼 있다.

대표:
- `getAllSitesSelectionState`
- `getAllSitesCanonicalRows`
- `setAllSitesCanonicalRows`
- `setAllSitesSelectedSite`

---

## 6. Phase 2 작업 묶음

### Workstream A — Public Entry Convergence

목표:
- live와 saved가 모두 같은 public action entry를 안정적으로 노출
- `window.__sadvApi`를 canonical public facade로 간주

해야 할 일:
1. public API 계약 문서와 실제 노출 위치 일치 검증
2. saved에서 `__sadvApi`가 shell ready 이후 항상 유효하도록 고정
3. 외부 automation/QA가 runtime kind를 모른 채 같은 API를 호출할 수 있게 유지
4. `switchSite(site)`처럼 intent가 명확한 canonical action 이름을 public facade에 정착

주의:
- snapshot richer API(`__SEARCHADVISOR_SNAPSHOT_API__`)는 없애지 않는다.
- public facade와 snapshot API의 역할 차이를 문서에 남긴다.

---

### Workstream B — Shared UI Helper Packaging

목표:
- saved가 공통 UI helper를 재사용할 때 allowlist 누락으로 깨지는 일을 줄인다.

해야 할 일:
1. saved 직렬화 대상 helper를 "기능 단위"로 묶는다.
   - 예: shared public entry / all-sites local helper / ui-controls helper
2. `09-ui-controls.js` / `10-all-sites-view.js` helper가
   어떤 dependency cluster를 이루는지 문서화한다.
3. 가능하면 helper 단위 allowlist가 아니라
   "공통 UI helper pack" 개념으로 직렬화 범위를 묶는다.
4. bootstrap 단계에서 richer API 생성과 public facade 게시를 helper로 분리해,
   `12-snapshot.js`가 직접 global publish 세부 구현을 덜 알게 만든다.
5. offline runtime 내부 boot도
   - "payload/state/rows/selection/combo 복원"
   - "render 후 finalize"
   같은 명시적 helper로 나눠, `switchMode(INITIAL_MODE)` 같은 렌더 진입점은
   가능한 한 바깥에 남긴다.

주의:
- 지금 단계에서 완전한 bundler 교체는 하지 않는다.
- 먼저 누락되기 쉬운 helper 경계를 묶어 회귀를 줄이는 쪽으로 간다.

---

### Workstream C — Snapshot Bootstrap Slim

목표:
- `12-snapshot.js`가 UI 구현을 직접 소유하는 범위를 줄인다.

해야 할 일:
1. saved bootstrap이 실제로 하는 일을 목록화
   - payload 주입
   - state 복원
   - provider/API wiring
   - shell host boot
2. 이 중 UI 구현 책임과 boot 책임을 분리
3. UI 책임은 공통 파일 쪽으로 더 이동
4. boot helper는 `SNAPSHOT_RUNTIME_BOOT_HELPERS`로만 직렬화하고,
   export 시점 shell injection helper와 offline runtime 내부 boot helper를 문서상에서 구분한다.
5. export 시점 shell injection도
   - host 보장
   - runtime shell state 주입
   - bootstrap script 주입
   으로 helper를 나눠, `injectSnapshotReactShell()`이 조립 함수 역할만 하도록 좁힌다.

주의:
- 이 단계에서 saved HTML 구조를 깨면 안 된다.
- "동작 동일성"이 "구조 순수성"보다 우선이다.

---

## 7. 파일별 우선순위

### 1순위
- `src/app/main/12-snapshot.js`
- `src/app/main/SNAPSHOT_IMPLEMENTATION_GUIDE.md`
- `src/app/main/PROVIDER_ACTION_CONTRACT.md`

이유:
- saved-only 회귀의 대부분이 이 레이어에서 발생

### 2순위
- `src/app/main/09-ui-controls.js`
- `src/app/main/10-all-sites-view.js`

이유:
- shared app entry 수렴의 핵심 UI 경로

### 3순위
- `src/app/main/07-data-provider.js`
- `src/app/main/07-ui-state.js`

이유:
- facade/state contract는 이미 Phase 1에서 많이 정리됨
- Phase 2에서는 지원 역할이 중심

---

## 8. 테스트 기준

Phase 2는 구조 개선 단계라서,
기능이 같아 보여도 contract가 깨질 수 있다.
따라서 아래를 항상 같이 본다.

### Live
- 전체현황
- 사이트별
- 콤보
- 하위탭
- 저장

### Saved
- fresh generated HTML만 감사 대상으로 인정
- `snapshot_workflow_audit.js` 결과
  - `failures: []`
  - `pageErrors: []`
  - `consoleErrors: []`

### Merge
- `node tests/merge-test.js`
- selection/export contract 유지

---

## 9. 금지사항

1. saved 회귀를 막겠다고 live UI 흐름을 분기시키지 말 것
2. `12-snapshot.js`에 새로운 saved 전용 UI를 계속 쌓지 말 것
3. helper 누락을 막겠다고 무작정 모든 함수를 직렬화하지 말 것
4. canonical state를 phase 2에서 다시 흔들지 말 것
5. shared app entry라는 명분으로 saved 오프라인 요구사항을 깨지 말 것

---

## 10. 완료 기준

Phase 2 초입이 제대로 시작됐다고 보려면:

1. public facade contract가 live/saved에서 동일하게 노출되고
2. saved helper allowlist가 기능 단위로 더 안정화되며
3. `12-snapshot.js` 문서상 책임이 boot/provider 쪽으로 더 좁혀지고
4. fresh saved audit가 새 helper 추가 후에도 반복적으로 안정적이어야 한다.

이 단계가 끝나면 다음엔
실제 shared app entry 수렴 폭을 더 넓히는 작업으로 넘어갈 수 있다.
