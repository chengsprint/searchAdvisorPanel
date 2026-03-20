# Phase 2 Final Handoff (2026-03-21)

## 1. 현재 상태 요약

- 제품 안정화/호환성 트랙: 사실상 완료
- Live / Saved / Merge 공통 contract: 안정화 완료
- fresh saved HTML audit: 반복적으로 `failures: []`
- 장기 구조 개선:
  - Phase 1: 완료
  - Phase 2: 후반부 마감 상태
  - Phase 3: 아직 시작하지 않음

현재 판단:

> 지금은 “무리한 구조 순화”보다  
> “회귀 없는 상태에서 contract와 남은 coupling을 고정하는 것”이 더 중요하다.

---

## 2. 최근 완료된 핵심 항목

### public/shared entry
- `setRuntimePublicApi / clearRuntimePublicApi`
- `switchSite(site)` canonical public action
- saved public facade(`__sadvApi`)와 richer snapshot API(`__SEARCHADVISOR_SNAPSHOT_API__`) 분리

### helper packaging
- `SNAPSHOT_SHARED_PUBLIC_ENTRY_HELPERS`
- `SNAPSHOT_RUNTIME_BOOT_HELPERS`
- `SNAPSHOT_ALL_SITES_HELPER_PACK`
- `SNAPSHOT_UI_CONTROLS_HELPER_PACK`

### bootstrap slim
- `createSnapshotPublicFacade`
- `publishSnapshotRuntimeApis`
- `restoreSnapshotUiBootState`
- `finalizeSnapshotUiBoot`
- `buildSnapshotSerializedHelperSection`
- `ensureSnapshotReactShellHostMarkup`
- `injectSnapshotRuntimeShellState`
- `appendSnapshotShellBootstrap`

### shell mount readability
- `SNAPSHOT_SHELL_NODE_IDS`
- `buildSnapshotShellUnmountLines`

---

## 3. 현재 공통적으로 지켜지는 계약

### public facade contract
- `window.__sadvApi`
  - `switchMode`
  - `setSite`
  - `switchSite`
  - `setTab`

### saved richer API
- `window.__SEARCHADVISOR_SNAPSHOT_API__`
  - `getState`
  - `setSelectionState`
  - `setAllSitesPeriodDays`
  - read-only capability

### boot order invariants
아래 순서는 현재 구현 디테일이 아니라 계약으로 취급한다.

1. `publishSnapshotRuntimeApis`
2. `restoreSnapshotUiBootState`
3. `switchMode(INITIAL_MODE)`
4. `finalizeSnapshotUiBoot`

---

## 4. 검증 기준

이 상태를 “유지”하려면 최소 아래를 계속 같이 본다.

### build/runtime
```bash
npm run build
npm run check
node tests/merge-test.js
node tests/phase1-verify-runtime.js
```

### saved fresh audit
```bash
node scripts/snapshot_workflow_audit.js <fresh-saved-html>
```

통과 기준:
- `failures: []`
- `pageErrors: []`
- `consoleErrors: []`

---

## 5. 지금 남은 coupling hotspot

아래는 “지금 즉시 수정해야 할 버그”가 아니라,
Phase 3 후보 또는 장기 구조 순화 후보다.

1. `buildSnapshotShellBootstrapScript()`
2. `buildSnapshotApiCompatScript()`
3. `normalizeSnapshotPayloadForOfflineShell()`
4. `injectSnapshotReactShell()`
5. transitive serialization dependency 체인

즉, 지금은 이 항목을 무리해서 건드리기보다
문서와 QA 기준을 유지하는 쪽이 안전하다.

---

## 6. 다음 작업자가 바로 할 수 있는 일

### 안전한 일
1. 최신 ref 기준 fresh saved audit 1회 더 돌리기
2. contract/roadmap 문서 최신화
3. public facade/saved richer API 차이 문서 보강

### 주의가 필요한 일
1. `12-snapshot.js`에서 큰 블록 이동
2. payload normalization 구조 변경
3. compat script / shell bootstrap 대수술

이 3가지는 Phase 3로 넘기거나, 충분한 QA 시간을 확보했을 때만 진행한다.

---

## 7. 한 줄 결론

현재 상태는:

- 기능/호환성은 안정적이고
- 구조는 Phase 2 후반부까지 정리됐으며
- 이제부터는 “더 예쁜 구조”보다 “회귀 없는 마감 기준 유지”가 우선이다.
