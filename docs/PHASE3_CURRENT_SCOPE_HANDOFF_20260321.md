# Phase 3 Current Scope Handoff — 2026-03-21

## 상태 요약

- 제품 안정화 / Live-Saved-Merge 호환성: 완료
- Phase 1: 완료
- Phase 2: 완료
- Phase 3: **현재 계획 범위 기준 사실상 완료**

현재 Phase 3는 `src/app/main/12-snapshot.js` 내부의 dormant compat bridge와
주변 bootstrap 가독성을 구조-only slice로 잘게 분해하는 범위까지를 목표로 삼았다.
이 범위는 현재 충족된 것으로 본다.

## 현재까지 완료된 Phase 3 항목

- compat state builder 세분화
  - `buildSnapshotApiCompatStateSeedLines()`
  - `buildSnapshotApiCompatStateCloneLines()`
  - `buildSnapshotApiCompatStateNotifyLines()`
- label resolver 세분화
  - `buildSnapshotApiCompatSiteShortNameLines()`
  - `buildSnapshotApiCompatSiteLabelLines()`
  - `buildSnapshotApiCompatLegacySiteResolverLines()`
- sync builder 세분화
  - `buildSnapshotApiCompatSyncDomReadLines()`
  - `buildSnapshotApiCompatSyncResolvedSiteLines()`
  - `buildSnapshotApiCompatSyncScheduleLines()`
- action fallback 세분화
  - `buildSnapshotApiCompatModeActionLines()`
  - `buildSnapshotApiCompatSiteActionLines(actionName)`
  - `buildSnapshotApiCompatTabActionLines()`
  - `buildSnapshotApiCompatNoopActionLines()`
- observer builder 세분화
  - `buildSnapshotApiCompatReactObserverLines()`
  - `buildSnapshotApiCompatMutationObserverLines()`
  - `buildSnapshotApiCompatObserverFinalizeLines()`
  - `buildSnapshotApiCompatObserverBodyLines()`
- compat body assembly helper화
  - `buildSnapshotApiCompatBodyLines()`

## 유지해야 할 불변식

1. active saved bootstrap 정본은 compat bridge가 아니라
   `buildSnapshotHtml()` 내부의 inline snapshot API + `publishSnapshotRuntimeApis()` 경로다.
2. `setSite`는 `switchSite`의 backward-compat alias다.
3. `snapshotState` seed 필드와 `cloneState()` 반환 shape는 계약으로 본다.
4. label resolver 우선순위는 유지한다.
5. sync selector / resolved-site 우선순위는 유지한다.
6. action fallback의 호출 순서와 `scheduleSync()` 타이밍은 유지한다.
7. observer finalize 뒤의 초기 `syncFromLegacy()` 호출은 유지한다.
8. compat body 조립 순서(state → label → sync → action → observer)는 유지한다.

## 현재 검증 기준

다음 명령을 통과하면 현재 planned scope 기준으로 충분하다.

```bash
npm run build
npm run check
node tests/merge-test.js
node tests/phase1-verify-runtime.js
```

fresh saved QA는 회귀 가능성이 큰 변경에서만 다시 요구한다.

## 이후 작업 분류

이후 남은 일은 필수 잔여 작업이 아니라 다음 범주로 본다.

- deeper reduction
- optional cleanup
- Phase 4급 장기 순화

예:
- dormant compat bridge 제거 판단
- payload core / compat bridge / active bootstrap 재배선
- string/regex injection 추가 순화

## 다음 작업자 안내

- 지금은 “더 예쁜 구조”보다 “현재 계약 유지”가 우선이다.
- 작은 구조-only slice는 계속 가능하지만,
  fresh saved QA를 다시 요구할 정도의 변경은 정말 필요할 때만 한다.
- Live 회귀 복구로 최근 `loadSiteList()` board API fallback도 되살렸으므로,
  board 페이지 fresh profile 이슈를 다시 깨지 않게 주의한다.
