# Snapshot Implementation Guide

이 문서는 snapshot 관련 작업을 실제로 수정하는 AI/개발자를 위한
**실행 지침서**다.

설계 배경은 `SNAPSHOT_EXPORT_CONTRACT.md`, `UI_DATA_PIPELINE_BOUNDARY.md` 를 먼저 본다.

장기 리팩토링 관련해서는 아래 문서를 함께 본다.

- `PHASE1_PROVIDER_REFACTOR_PLAN.md`
- `RUNTIME_STATE_CONTRACT.md`
- `PROVIDER_ACTION_CONTRACT.md`
- `SNAPSHOT_REFACTOR_GUARDRAILS.md`
- `../../docs/SHARED_APP_PROVIDER_REFACTOR_20260320.md`

전체현황 기간 필터를 건드릴 때는 아래 문서를 함께 본다.

- `ALL_SITES_PERIOD_FILTER_DESIGN.md`

---

## 1. 먼저 판단할 것

수정하려는 변경이 아래 중 어디에 속하는지 먼저 분류한다.

### A. 공통 UI 변경

예:

- 헤더
- 탭
- 콤보
- 카드
- KPI
- 차트
- 반응형

이 경우 원칙:

- **live/snapshot 공통 소스 먼저 수정**
- 저장본 전용 분기는 마지막 수단

### B. live data provider 변경

예:

- API 엔드포인트
- 캐시 정책
- refresh pipeline
- bootstrap refresh

이 경우 원칙:

- live 전용으로 본다
- snapshot은 영향 범위만 검토
- 가능하면 UI 파일이 전역 상태를 직접 읽지 않게 하고,
  `07-data-provider.js` facade를 먼저 확장해 seam을 만든다.
- 현재 권장 seam:
  - `getRuntimeAllSites()`
  - `getRuntimeMergedMeta()`
  - `getRuntimeSelectionState()`

### C. snapshot entry / export 변경

예:

- 저장 버튼
- export payload
- inline JSON escape
- offline bootstrap

이 경우 원칙:

- snapshot 전용 변경 가능
- self-contained contract 검증 필수
- 단, 표현/UI 복제보다 payload / bootstrap / read-only guard 같은
  adapter 층 문제인지 먼저 확인한다.

---

## 2. 변경 유형별 필수 체크

### 헤더/메타 변경

확인:

- live desktop
- live mobile
- saved HTML desktop
- saved HTML mobile

### 콤보 변경

확인:

- live open/search/select
- saved HTML open/search/select
- outside click close
- top-layer / z-index / portal

### 전체현황 카드 변경

확인:

- live all-sites
- saved HTML all-sites
- 사이트 카드 클릭 -> site mode
- 모바일 숫자 overflow

### 사이트별 하위탭 변경

확인:

- overview / daily / queries / pages / crawl / backlink / diagnosis / insight / pattern
- live
- saved HTML
- mobile overflow
- pageErrors / consoleErrors

### snapshot bootstrap 변경

확인:

- helper/token 누락 여부
- 공통 UI helper allowlist 누락 여부
- shell/api parity
- runtime kind / shell host / public API contract
- read-only capability contract
- runtimeVersion parity
- mergedMeta parity

특히 주의:

- `09-ui-controls.js`에 새 helper를 추가했는데
  `12-snapshot.js` 직렬화 allowlist에 같이 안 넣으면
  live는 멀쩡하지만 saved HTML에서만 `is not defined` 회귀가 날 수 있다.
- 같은 이유로 `10-all-sites-view.js`의 local helper
  (`getAllSitesSelectionState`, `getAllSitesCanonicalRows`,
  `setAllSitesCanonicalRows`, `setAllSitesSelectedSite`)도
  saved HTML 직렬화 allowlist에 같이 실리는지 확인해야 한다.
- helper pack 분류 규칙:
  - payload/state 복원, provider wiring, shell host boot → `SNAPSHOT_RUNTIME_BOOT_HELPERS`
  - public facade publish/clear → `SNAPSHOT_SHARED_PUBLIC_ENTRY_HELPERS`
  - mode/site/tab 의미 action wrapper → `SNAPSHOT_UI_CONTROLS_HELPER_PACK`
  - canonical rows / all-sites selection helper → `SNAPSHOT_ALL_SITES_HELPER_PACK`
  새 helper를 추가할 때는 "무엇을 계산하나?"보다 "어느 책임층에 속하나?"를 먼저 보고 pack을 고른다.
- Phase 2부터는 helper를 낱개 allowlist로 흩어 두지 말고,
  `SNAPSHOT_SHARED_PUBLIC_ENTRY_HELPERS`,
  `SNAPSHOT_RUNTIME_BOOT_HELPERS`,
  `SNAPSHOT_ALL_SITES_HELPER_PACK`,
  `SNAPSHOT_UI_CONTROLS_HELPER_PACK`
  같은 pack 단위로 관리한다.
  새 helper가 해당 책임 범위에 추가되면 pack에 먼저 넣고,
  그 뒤 saved HTML fresh audit를 돌리는 순서를 지킨다.
- 특히 `createSnapshotPublicFacade`, `publishSnapshotRuntimeApis`는
  "snapshot richer API 생성"과 "public facade 게시"를 분리하는
  boot/provider wiring 책임 helper이므로,
  이 helper들을 우회해서 `window.__sadvApi` / `window.__SEARCHADVISOR_SNAPSHOT_API__`
  를 직접 다시 만지지 않도록 주의한다.
- boot helper는 `SNAPSHOT_RUNTIME_BOOT_HELPERS`에 넣고 관리한다.
  새 helper를 추가할 때는 `SNAPSHOT_UI_CONTROLS_HELPER_PACK`나
  `SNAPSHOT_ALL_SITES_HELPER_PACK`로 보내지 말고, 먼저 그 helper가
  "payload/state 복원 / provider wiring / shell host boot" 책임인지 확인한다.
- snapshot boot에는 두 단계가 있다.
  1) offline runtime 내부 boot (`restoreSnapshotUiBootState`, `finalizeSnapshotUiBoot` 등)
  2) export 시점 HTML shell injection (`buildSnapshotShellBootstrapScript`, `injectSnapshotReactShell`)
  어느 단계 helper인지 문서와 pack 선언에서 먼저 구분하고 수정한다.
- export 시점 shell injection 쪽을 건드릴 때는
  `ensureSnapshotReactShellHostMarkup()`,
  `injectSnapshotRuntimeShellState()`,
  `appendSnapshotShellBootstrap()`
  같은 helper를 우선 본다.
  이 단계는 HTML 문자열 후처리 책임이므로, offline runtime 내부 상태 복원 helper와 섞지 않는다.
- `buildSnapshotApiCompatScript()`를 건드릴 때는 compat bridge 전체를 한 번에 뒤집지 말고,
  `buildSnapshotApiCompatStateLines()`,
  `buildSnapshotApiCompatLabelResolverLines()`,
  `buildSnapshotApiCompatSyncLines()`,
  `buildSnapshotApiCompatActionLines()`,
  `buildSnapshotApiCompatObserverLines()`
  같은 line builder 단위로 먼저 나눈다.
  Phase 3 첫 단계의 목표는 "동작 변경"이 아니라 "읽기 가능한 경계 만들기"다.
- state builder도 같은 원칙으로
  `buildSnapshotApiCompatStateSeedLines()`,
  `buildSnapshotApiCompatStateCloneLines()`,
  `buildSnapshotApiCompatStateNotifyLines()`
  처럼 나눌 수 있다.
  단, shell state에서 어떤 필드를 읽는지와 `cloneState()`가 반환하는 shape는
  compat bridge 소비자 계약으로 보고 바꾸지 않는다.
- `buildSnapshotApiCompatScript()` 내부 조립 순서도
  `buildSnapshotApiCompatBodyLines()`
  같은 helper로 감싸서
  state → label → sync → action → observer
  순서를 눈에 보이는 계약으로 드러내는 것이 좋다.
- observer wiring은 compat bridge 안에서도 비교적 fan-out이 작아서,
  `buildSnapshotApiCompatReactObserverLines()`,
  `buildSnapshotApiCompatMutationObserverLines()`,
  `buildSnapshotApiCompatObserverFinalizeLines()`,
  `buildSnapshotApiCompatObserverBodyLines()`
  처럼 더 세밀하게 나누는 다음 slice로 적합하다.
  label resolver도 같은 이유로 비교적 안전한 구조-only slice다.
  `buildSnapshotApiCompatSiteShortNameLines()`,
  `buildSnapshotApiCompatSiteLabelLines()`,
  `buildSnapshotApiCompatLegacySiteResolverLines()`
  처럼 나눌 수 있지만, `https://` / `http://` 제거 규칙,
  `displayLabel || label || shortName` 우선순위,
  exact match 이후 lower-case normalized match 순서는 불변식으로 본다.
  sync 단계도 같은 이유로 비교적 안전한 slice다.
  `buildSnapshotApiCompatSyncDomReadLines()`,
  `buildSnapshotApiCompatSyncResolvedSiteLines()`,
  `buildSnapshotApiCompatSyncScheduleLines()`
  처럼 쪼개더라도, `syncFromLegacy()`가 읽는 DOM selector와
  resolved-site 우선순위는 바꾸지 않는 것이 불변식이다.
  반대로 action fallback은 `setSite`/`switchSite` alias 의미와
  `scheduleSync()` 타이밍을 그대로 유지해야 하므로,
  지금 단계에서는 구조 변경보다 주석/문서 고정이 우선이다.
- 특히 `buildSnapshotApiCompatScript()`는 현재 활성 saved bootstrap 정본이 아니라,
  richer snapshot API가 아직 없던 시절의 legacy/dormant compat bridge에 가깝다.
  현재 활성 경로는 `buildSnapshotHtml()` 안 inline snapshotApi + `publishSnapshotRuntimeApis()` 쪽이다.
  따라서 이 함수를 리팩토링할 때는 "정본을 교체한다"가 아니라
  "남아 있는 compat bridge의 책임을 더 읽기 쉽게 만든다"는 관점으로 접근한다.
- compat bridge action fallback은 `buildSnapshotApiCompatActionLines()` 안에 계속 큰 문자열로 두지 말고
  mode / site / tab / noop builder로 점진 분해한다.
  단, `setSite`는 `switchSite`의 backward-compat alias이므로 의미를 억지로 분리하지 않는다.
- 현재 계획된 Phase 3 범위는 위 builder 분해와 조립 순서 고정까지를 포함해
  사실상 마감선에 도달한 상태로 본다.
  이후 작업은 "필수 잔여"가 아니라 deeper reduction / follow-up cleanup 성격으로 분류한다.
- compat bridge 안의 `snapshotState`는 full runtime owner가 아니라
  `__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__`를 바탕으로 한 shell mirror + selection mirror에 가깝다.
  `allSites/rows/siteMeta/mergedMeta/runtimeVersion/cacheMeta`는 shell state에서 초기화되고,
  `curMode/curSite/curTab`는 이후 legacy DOM을 다시 읽어 sync하는 구조라는 점을 잊지 않는다.
- `restoreSnapshotUiBootState()`는 "기간/rows/selection/combo 복원"까지만 담당하고,
  `switchMode(INITIAL_MODE)` 호출은 바깥에 남긴다.
  렌더 진입점까지 helper 안에 숨기면 saved 회귀가 났을 때 부수효과를 추적하기 어렵다.
- `finalizeSnapshotUiBoot()`는 반드시 `switchMode(INITIAL_MODE)` 뒤에서만 호출한다.
  카드 링크 바인딩과 report decoration은 렌더된 DOM이 있어야 정상 동작한다.
- boot 실행 순서 불변식:
  1) `publishSnapshotRuntimeApis`
  2) `restoreSnapshotUiBootState`
  3) `switchMode(INITIAL_MODE)`
  4) `finalizeSnapshotUiBoot`
  이 순서는 구현 디테일이 아니라 계약에 가깝다. 중간 단계를 helper 안으로 숨기거나
  순서를 바꾸면 saved-only 회귀가 날 가능성이 높다.
- 직렬화 섹션 편집은 `buildSnapshotSerializedHelperSection()`을 기준으로 본다.
  helper pack 배치/순서/설명을 조정할 때는 이 함수와 pack 선언부를 같이 보며,
  템플릿 본문 안에서 다시 helper 직렬화 블록을 낱개로 늘리지 않는다.
- saved HTML은 snapshot 전용 richer API를 `window.__SEARCHADVISOR_SNAPSHOT_API__`에 유지하더라도,
  공용 제어 계약은 live와 같은 `window.__sadvApi` alias로도 노출해야 한다.
  그래야 QA/audit/외부 automation이 runtime kind를 분기하지 않고
  `switchMode/setSite/setTab/getState`를 같은 이름으로 호출할 수 있다.
- live 런타임의 저장 파이프라인은 이제
  - `download()` = cache-first buttonless save
  - `directSave()` = stale/missing cache를 점검하고 필요하면 refresh 후 저장
  - `loadAndDirectSaveHeadless()` = **기존 저장 버튼과 동일한 background download 경로를 패널 비노출 상태에서 실행**
  으로 의미가 나뉜다.
  이때 외부 automation이 읽는 canonical 상태는
  `window.__SEARCHADVISOR_SAVE_STATUS__` / `getSaveStatus()` / `subscribeSaveStatus()`
  세 entry가 같은 정보를 바라보도록 유지해야 한다.
  저장 상태 UI는 중앙 모달형 overlay를 사용하며, 상태 객체와 DOM 모두 `runtimeType`
  (`live` / `saved` / `merge`)를 함께 노출해 외부 automation과 사용자가 같은 타입 판정을 공유해야 한다.
- `directSave({ headless: true })`는 저장 중 패널과 overlay를 **일시적으로 숨기되**
  panel mount 자체는 유지해야 한다.
  저장본은 live 패널 DOM을 그대로 clone/serialize하므로,
  `display:none`처럼 panel width를 0으로 만드는 방식은 parity를 깨뜨릴 수 있다.
  따라서 현재 headless 구현은 `visibility:hidden + opacity:0 + pointer-events:none`만 사용한다.
- headless directSave를 external automation이 안정적으로 추적할 수 있게
  save status mirror와 `#sadv-save-status-overlay` dataset에는 `uiHidden` 정보도 함께 노출한다.
- `loadAndDirectSaveHeadless()`는 요구사항이 다르다.
  - 패널을 first-frame부터 비노출 상태로 둔 뒤,
  - 기존 `downloadSnapshot()` 경로를 그대로 실행한다.
  - 즉 "smart save"가 아니라 "기존 저장 버튼의 background 실행"으로 이해해야 한다.
  - 이 경로에서도 panel mount 자체는 유지하고, `display:none`은 사용하지 않는다.
- 저장 차단 정책은 세 저장 entry에서 동일해야 한다.
  - `download()`
  - `directSave()`
  - `loadAndDirectSaveHeadless()`
  위 3개 모두 같은 gate를 통과해야 한다.
  - 치명적 패널 오류 배너가 살아 있으면 저장을 차단한다.
  - `payload.stats.failed / totalSites > 20%`이면 저장을 차단한다.
  - 차단 시 다운로드는 발생하지 않고, save status는 `blocked`가 된다.
  - `completed-with-issues`는 저장이 허용된 경미/부분 이슈,
    `blocked`는 정책상 다운로드를 멈춘 상태라는 의미로 구분한다.
- auto refresh와 save가 경쟁할 때는 save가 별도 `collectExportData()`를 또 시작하지 않도록 주의한다.
  - 이미 진행 중인 `cache-expiry` refresh만 save가 재사용할 수 있다.
  - 또한 패널이 이미 `renderAllSites()` / `loadSiteView()` 초기 로딩을 진행 중이면,
    save는 해당 in-flight 작업을 먼저 재사용하고 나서 refresh 필요 여부를 다시 판단해야 한다.
    즉 실사용 경쟁 상대는 auto refresh뿐 아니라 초기 all-sites/site-view fetch도 포함된다.
  - 이때 save status는 상황에 따라 `waiting-runtime` 또는 `waiting-refresh`를 거칠 수 있다.
    - `waiting-runtime`: 현재 화면 기본 데이터 로딩 대기
    - `waiting-refresh`: 이미 진행 중인 auto refresh 결과 대기
  - 이때 save status는 `waiting-refresh`를 먼저 거친다.
  - `waiting-refresh`로 들어간 뒤에는, 재사용 가능하다고 판정한 시점의 in-flight refresh promise를
    그대로 await 해야 한다. 나중에 다시 재판정해서 fallback collect로 내려가면 경쟁 버그가 재발한다.
  - 저장 시작 시점의 `curMode/curSite/curTab/allSitesPeriodDays`를 canonical selection snapshot으로 고정하고,
    재사용한 refresh payload의 `ui`에도 그 snapshot을 덮어써야 한다.
  - 즉 “최신 payload 재사용”과 “save 요청 시점 selection 고정”을 같이 유지해야 parity가 안 깨진다.
  - QA도 `waiting-refresh` 상태 진입만 보지 말고,
    `waiting-refresh -> collecting` 금지,
    `waiting-runtime` 이후 중복 collect 재시작 금지,
    `/api-console/report/` 요청 key 중복 금지까지 같이 검증해야 한다.
- background download boot contract는
  - `SEARCHADVISOR_BOOT.REQUEST_WINDOW_KEY`
  - `SEARCHADVISOR_BOOT.ACTIONS.BACKGROUND_DOWNLOAD`
  - `getSearchAdvisorBootRequest()`
  - `isSearchAdvisorBackgroundDownloadBootRequest()`
  조합을 기준으로 읽는다.
  문자열 `"background-download"`나 `window.__SEARCHADVISOR_BOOT_REQUEST__`를
  개별 파일에서 직접 해석하지 않는다.
- `ensureCurrentSite`, `buildCombo`, `setComboSite`, `renderTab`, `switchMode`처럼
  saved가 직접 호출하는 공통 UI 함수는 **그 함수가 참조하는 helper까지 같이 serialize**
  되는지 반드시 확인한다.

---

## 3. 절대 하지 말아야 할 것

1. UI 문제를 snapshot 전용 복제 마크업으로 해결하지 말 것
2. 공통 renderer 수정 없이 snapshot 전용 HTML만 임시로 맞추지 말 것
3. helper/style token 의존성을 “아마 있겠지”라고 가정하지 말 것
4. `dist/runtime.js`를 정본처럼 직접 수정하지 말 것
5. saved HTML 재생성 검증 없이 parity 완료라고 판단하지 말 것
6. 공통 UI 파일에서 `allSites`, `curMode`, `curSite`, `curTab` 직접 참조를 늘리는 방향으로
   임시 수정하지 말 것. 먼저 facade seam 추가 가능성을 검토한다.

---

## 4. 수정 후 최소 검증

```bash
npm run build
npm run check
node scripts/snapshot_workflow_audit.js <saved-html-path>
```

그리고 아래를 실제로 확인한다.

- 전체현황 -> 사이트별
- 콤보 검색/선택
- 하위탭 전환
- 그래프 비어 있음 여부
- 모바일 overflow
- `pageErrors === 0`

---

## 5. 다음 AI를 위한 handoff 방식

작업이 끝나면 최소한 아래를 남긴다.

1. 무엇을 수정했는지
2. 왜 그 파일이 정본인지
3. 어떤 리스크를 줄였는지
4. 남은 리스크
5. 다음에 꼭 봐야 할 파일/워크플로우

이 형식을 생략하지 않는다.
