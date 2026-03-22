# SearchAdvisor Runtime 10-Pass Codebase Review

Date: 2026-03-22  
Scope: live / saved / merge / save-direct / background-save / auto-refresh competition  
Primary files reviewed:

- `src/app/main/09-ui-controls.js`
- `src/app/main/12-snapshot.js`
- `src/app/main/13-refresh.js`
- `src/app/main/14-init.js`
- `src/app/main/PROVIDER_ACTION_CONTRACT.md`
- `src/app/main/SNAPSHOT_IMPLEMENTATION_GUIDE.md`

---

## Executive Summary

현재 코드베이스는 **운영 가능한 수준으로 안정적**이다. 특히:

- 저장 버튼 / `directSave()` / background save의 역할 구분이 문서와 코드에서 비교적 명확하다.
- `blocked` / `failed` / `waiting-refresh` 정책이 정리되어 있다.
- `cache-expiry` auto refresh와 save 경쟁 처리도 **단일 알고리즘**으로 수렴 중이다.

다만 여전히 가장 큰 hotspot은:

1. `12-snapshot.js`의 높은 역할 밀도
2. live DOM clone + saved shell/API bootstrap의 이중 정본 구조
3. auto refresh progress UI와 save status overlay의 체감상 중복 인지 가능성

즉 **기능은 안정적이지만 구조는 여전히 조심해서 다뤄야 하는 상태**다.

---

## Review Pass 1 — Public Entry Semantics

현재 public facade는 다음처럼 역할이 나뉜다.

- `download()` = 기존 저장 버튼과 같은 cache-first 저장
- `directSave()` = stale/missing cache를 점검하고 필요 시 refresh 후 저장
- `loadAndDirectSaveHeadless()` = 기존 저장 버튼 경로를 패널 비노출 상태로 실행

평가:

- 의미 구분은 명확하다.
- 특히 `loadAndDirectSaveHeadless()`가 “smart save”가 아니라 **기존 저장 버튼의 background 실행**이라는 점이 문서와 코드에서 일치한다.

잔여 위험:

- 외부 호출자가 `download()`와 `directSave()`를 같은 의미로 오해할 여지는 남아 있다.
- public entry 이름은 명확하지만, 실제 운영 가이드는 계속 이 차이를 강조해야 한다.

---

## Review Pass 2 — Save Policy Consistency

세 저장 경로는 아래 정책을 공통으로 공유한다.

- 치명적 패널 오류 배너가 살아 있으면 `blocked`
- `payload.stats.failed / totalSites > 20%` 이면 `blocked`
- 나머지는 저장 허용

평가:

- 저장 정책이 버튼/스크립트/background로 갈라지지 않고 공통화된 점은 좋다.
- 운영 관점에서 일관성이 있다.

잔여 위험:

- `partial`은 저장 허용으로 남아 있으므로, “경미한 이슈 허용” 정책이 계속 맞는지 운영 중 재평가가 필요할 수 있다.

---

## Review Pass 3 — Auto Refresh Competition Handling

현재 핵심 원칙:

- save는 이미 진행 중인 `cache-expiry` refresh만 재사용한다.
- save가 재사용 가능하다고 판단한 **그 순간의 in-flight promise를 직접 캡처**한다.
- 나중에 다시 재판정해서 fallback collect로 내려가면 안 된다.

평가:

- 이전 race(상태는 `waiting-refresh`인데 실제로는 새 collect로 내려가는 문제)를 잡는 방향으로 적절하다.
- `selection snapshot` 유지와 결합되어 있어서 save 결과 일관성도 좋아졌다.

잔여 위험:

- `13-refresh.js`의 reuse context는 `siteSignature`까지 포함해 개선됐지만, 여전히 “같은 site signature / 다른 의미 상태” 같은 edge case가 완전히 0은 아니다.
- 다만 현재 수준에서는 과도한 복잡도 없이 균형이 맞는 편이다.

---

## Review Pass 4 — Save State Model

현재 save 상태 모델:

- `checking-cache`
- `waiting-refresh`
- `refreshing`
- `collecting`
- `building-html`
- `triggering-download`
- `completed`
- `completed-with-issues`
- `blocked`
- `failed`

평가:

- 외부 드라이버와 사용자 UI가 같은 상태 모델을 공유한다는 점이 좋다.
- `blocked`와 `failed`를 분리한 것은 운영/자동화 모두에 유리하다.

잔여 위험:

- 실제 사용자는 `blocked`와 `failed`를 둘 다 “실패”로 느낄 수 있다.
- 따라서 모달 문구가 정책상 차단인지, 진짜 예외 실패인지 계속 분명해야 한다.

---

## Review Pass 5 — UX Clarity During In-Flight Refresh

현재 save가 auto refresh에 합류하면:

- 패널 본문에는 auto refresh progress
- 중앙 overlay에는 `waiting-refresh`

가 동시에 보일 수 있다.

평가:

- 내부적으로는 올바른 구조여도, 사용자 체감은 “두 개가 동시에 도는 것 같다”로 느껴질 수 있다.
- 이번 라운드에서 `waiting-refresh` 문구가
  “이미 진행 중인 자동 갱신 결과를 재사용한다” 쪽으로 개선된 것은 맞는 방향이다.

잔여 위험:

- 패널 내부 progress UI와 save overlay가 동시에 존재하는 한, 시각적 혼동은 완전히 0이 되지 않는다.
- 이는 기능 버그라기보다 UX 레벨의 구조적 한계에 가깝다.

---

## Review Pass 6 — Snapshot Export Integrity

`12-snapshot.js`는 save/export/shell/bootstrap을 여전히 많이 쥐고 있다.

평가:

- helper pack, public facade, bootstrap helper, background boot contract는 이전보다 훨씬 명확해졌다.
- 저장 직전 selection snapshot을 payload에 덮어쓰는 구조도 parity 유지에 유리하다.

잔여 위험:

- live DOM clone + saved shell/API bootstrap이 동시에 존재하는 구조는 여전히 이중 정본 위험을 남긴다.
- 따라서 saved parity는 계속 QA 게이트로 감시해야 한다.

---

## Review Pass 7 — Refresh / Save Boundary

현재 경계는 대체로 합리적이다.

- `13-refresh.js`는 full refresh owner
- `12-snapshot.js`는 save/export owner
- save는 refresh internals 전체를 아는 대신, reusable handle을 소비하는 쪽으로 유지

평가:

- 결합도가 과도하게 높아지는 방향은 어느 정도 막고 있다.

잔여 위험:

- `12-snapshot.js`가 여전히 너무 커서, 작은 수정도 save/export/bootstrap 전반에 영향 줄 수 있다.
- 장기적으로는 이것이 가장 큰 maintenance hotspot이다.

---

## Review Pass 8 — QA Coverage Quality

현재 좋은 점:

- build/check
- merge test
- runtime verify
- direct save / blocked / background save / saved reopen
- auto refresh in-flight 경쟁 시나리오

가 존재한다.

이번 라운드에서 특히 강화된 것:

- `waiting-refresh -> collecting` 금지
- `/api-console/report/` 요청 key 중복 금지
- `collect-export-start` source expectation

평가:

- 이제 “의도한 상태가 찍혔는지”뿐 아니라, **실제 중복 요청이 없는지**까지 검증하는 방향으로 한 단계 올라갔다.

잔여 위험:

- Playwright 전체 스위트는 환경/포트 이슈로 가끔 flaky할 수 있다.
- 그래서 핵심 경쟁 시나리오(10/11/12)처럼 **좁고 강한 시나리오를 따로 돌릴 수 있는 운영 습관**이 중요하다.

---

## Review Pass 9 — Live / Saved / Merge Parity

평가:

- Live: save 경쟁 처리와 blocked 정책이 안정적으로 들어간 상태
- Saved: selection snapshot과 saved reopen QA 기준으로 parity 유지 중
- Merge: `runtimeType` / merge save path / merge tests 모두 유지

잔여 위험:

- Saved는 여전히 bootstrap/clone parity 문제를 가장 잘 드러내는 경로다.
- Merge는 직접 저장 경쟁보다 metadata/capability 표면 drift를 더 경계해야 한다.

---

## Review Pass 10 — Current Recommendation

현재 상태에 대한 최종 판단:

### 당장 해도 되는 것

- 운영 사용
- 사용자 재테스트
- 정상 저장 / direct save / background save 비교 테스트

### 지금은 건드리지 않는 게 더 좋은 것

- `12-snapshot.js` 대공사
- save/export/bootstrap을 한 번에 다시 뒤엎는 리팩토링
- live/saved parity를 건드리는 DOM 구조 변경

### 다음에 의미 있는 후속

1. 필요 시 `waiting-refresh` UX를 더 명확히 다듬기
2. 경쟁 시나리오 QA를 CI/release gate 쪽으로 더 올리기
3. `12-snapshot.js` 장기 분해는 별도 Phase 4급 작업으로 다루기

---

## Final Assessment

### Overall

- **기능 안정성**: 높음
- **정책 일관성**: 높음
- **save 경쟁 처리**: 이전보다 명확하고 안전해짐
- **테스트 신뢰도**: 핵심 시나리오 기준으로 유의미하게 강화됨

### Main Hotspots

1. `12-snapshot.js`의 높은 복합도
2. saved parity가 DOM clone + bootstrap 이중 구조에 기대는 점
3. UI상 auto refresh + save overlay 동시 표시에 따른 체감 혼동

### Final Conclusion

현재 코드는 **운영 가능한 상태**이며,  
이번 라운드 기준 save/directSave/background save/auto refresh 경쟁 처리까지 포함해  
**충분히 통제 가능한 구조**로 보고 운영해도 된다.

다만 구조적으로 가장 위험한 축은 여전히 `12-snapshot.js`이고,  
그 이상의 대규모 순화는 **지금 당장 필수 작업이 아니라 별도 장기 리팩토링 트랙**으로 보는 것이 맞다.
