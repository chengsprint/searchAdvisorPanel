# SearchAdvisor Runtime 10-Pass Review

- 작성일(UTC): 2026-03-22
- 기준 커밋:
  - `cfeded4` Reuse inflight refresh for save requests
  - `438230a` Fix inflight refresh reuse race for saves
  - `b0cf6fd` Tighten save reuse race QA coverage
- 검토 범위:
  - `src/app/main/07-data-provider.js`
  - `src/app/main/09-ui-controls.js`
  - `src/app/main/12-snapshot.js`
  - `src/app/main/13-refresh.js`
  - `src/app/main/14-init.js`
  - `tests/playwright-direct-save-qa.js`
  - 저장 정책(`blocked`/`failed`/`waiting-refresh`)
  - Live / Saved / Merge parity

## 목적

최근 라운드에서 반영한 다음 항목이 실제로 일관되게 유지되는지 다시 검토한다.

- 저장 버튼 / `directSave()` / background save의 공통 알고리즘
- auto refresh in-flight 상황에서 save가 중복 collect를 다시 시작하지 않는지
- save-request-time selection snapshot이 계속 canonical source로 유지되는지
- `blocked`/`failed`/`waiting-refresh` 정책이 세 저장 경로에서 동일한지
- Saved/ Merge / Live 동작 및 QA 커버리지가 충분한지

---

## Pass 1 — 런타임 모듈 경계

현재 구조는 예전보다 훨씬 선명하다.

- `09-ui-controls.js`
  - 사용자 상호작용과 public facade 게시 책임
- `12-snapshot.js`
  - 저장/저장본/snapshot shell/저장 상태 UI
- `13-refresh.js`
  - full refresh orchestration
- `14-init.js`
  - bootstrap 진입과 cache-expiry auto refresh 시작

평가:
- 경계는 예전보다 훨씬 좋아졌지만, `12-snapshot.js`는 여전히 가장 큰 hotspot이다.
- 다만 현재 범위에서는 save/export 관련 조립 책임을 이 파일이 갖는 것이 현실적으로 맞다.

판정:
- **통과**
- 남은 hotspot은 있으나 현재 요청 범위를 막는 수준은 아님

---

## Pass 2 — 저장 경로의 공통 알고리즘

세 저장 경로는 이제 같은 원칙을 따른다.

- 저장 버튼 → `downloadSnapshot()`
- `directSave()` → stale 판단 + 필요 시 refresh + 최종 `downloadSnapshot(...)`
- background save → boot-hidden 상태에서 `downloadSnapshot(...)`

공통 정책:
- 치명적 패널 오류면 차단
- 실패율 20% 초과면 차단
- save-request selection snapshot 고정
- auto refresh in-flight 재사용

판정:
- **통과**
- 더 이상 경로별로 정책이 따로 노는 구조는 아니다

---

## Pass 3 — auto refresh와 save 경쟁 처리

이번 라운드 핵심 수정 대상이었다.

문제였던 점:
- `waiting-refresh` 상태는 찍혔지만
- 실제 payload를 받을 때 다시 재판정하면서
- refresh가 막 끝난 타이밍엔 save가 다시 `collectExportData()`로 떨어질 수 있는 race가 있었다

현재:
- reusable 판정 시점의 **in-flight promise 자체를 캡처**
- 이후 재판정 없이 그 promise를 await

의미:
- 패널 auto refresh가 이미 돌고 있을 때
- 저장 버튼/directSave/background save는
- **새로운 collect를 다시 시작하지 않고**
- 기존 refresh 결과를 재사용한다

판정:
- **통과**
- 현재 경쟁 버그의 핵심 race는 해소된 것으로 본다

---

## Pass 4 — selection snapshot canonicality

save 요청 시점의 selection snapshot:

- `curMode`
- `curSite`
- `curTab`
- `allSitesPeriodDays`

는 계속 canonical source로 유지된다.

이건 중요하다.

왜냐하면:
- refresh를 기다리는 동안 사용자가 UI를 바꿀 수 있고
- 저장본은 “save 요청 당시 상태”를 기준으로 만들어져야 하기 때문이다

현재:
- payload 재사용과 selection snapshot 고정이 함께 유지된다

판정:
- **통과**

---

## Pass 5 — 저장 상태 모델과 UX 문구

현재 저장 상태 모델:

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

이번 라운드에서 중요한 문구 보강:

- `waiting-refresh`
  - “기존 갱신 대기 중” 같은 애매한 표현에서
  - “이미 진행 중인 자동 갱신이 끝나면 바로 저장합니다. 새로운 수집을 다시 시작하지 않고 현재 갱신 결과를 그대로 재사용합니다.”
  로 의미를 더 명확히 했다.

평가:
- 패널 progress UI와 중앙 저장 모달이 동시에 보이기 때문에 사용자 착시는 여전히 가능하다.
- 하지만 적어도 저장 모달 문구는 “새 refresh를 다시 시작하는 것”처럼 보이지 않도록 개선되었다.

판정:
- **조건부 통과**
- UX 혼란은 줄었지만, 패널 progress UI와 save modal의 동시 노출은 근본적으로 남는다

---

## Pass 6 — 저장 차단 정책(`blocked`)

현재 저장 차단 정책:

1. 치명적인 패널 사용자 오류가 있으면 차단
2. 실패 사이트 비율이 20% 초과면 차단

세 저장 경로 모두 동일:
- 저장 버튼
- `directSave()`
- background save

의미:
- “문제가 있어도 저장본 생성”이 아니라
- “정책상 신뢰할 수 없는 저장본이면 아예 다운로드를 막는다”

판정:
- **통과**

---

## Pass 7 — Saved parity

Saved 쪽에서 현재 중요하게 보는 것:

- shell state
- snapshot API state
- DOM active state
- public API alias

이전 라운드에서 fresh saved QA 반복 통과했고,
현재 저장 경로 수정은 save-side orchestration을 건드린 것이므로 saved shell 자체를 뒤흔드는 타입은 아니다.

주의:
- selection parity 문제는 예전에 실제로 있었기 때문에 계속 경계 대상이다.
- 하지만 이번 수정은 “중복 collect race”를 겨냥한 것으로, saved parity를 악화시키는 방향은 아니다.

판정:
- **통과**
- 다만 background 저장본을 사용자가 추가로 다시 열어보는 수동 QA는 여전히 높은 가치가 있다

---

## Pass 8 — Merge parity

Merge 쪽은 이번 수정의 직접 대상은 아니다.

하지만 다음은 유지돼야 한다.

- merge/export selection facade
- save status runtimeType
- merge runtime에서 directSave 경로

확인 결과:
- merge 테스트는 계속 통과
- merge directSave 시나리오도 기존 자동 QA 기준 유지

판정:
- **통과**

---

## Pass 9 — QA 커버리지

이번 라운드에서 가장 크게 보강된 부분이다.

### 기존 부족점
- `waiting-refresh` 상태 진입만 보면
- 실제 중복 요청이 없는지까지는 알 수 없었다

### 현재 보강점
`tests/playwright-direct-save-qa.js`에 다음을 포함한다.

- `waiting-refresh -> collecting` 금지
- `/api-console/report/` 요청 key 중복 검증
- `collect-export-start` runtime event 계측
- 시나리오 10/11/12에 대해
  - save 버튼
  - `directSave()`
  - background save
  각각 경쟁 상황 검증

### 참고
전체 장시간 Playwright 스위트는 환경상 간헐 flaky가 있었으므로,
이번 라운드 핵심은 **경쟁 시나리오 10/11/12를 필터 실행**해서
보다 정확하게 재검증했다.

판정:
- **통과**
- 경쟁 문제에 대한 자동 QA는 이전보다 확실히 강해졌다

---

## Pass 10 — 남은 hotspot과 비권장 수정

### 남은 hotspot
1. `12-snapshot.js`는 여전히 가장 큰 파일
2. 패널 auto refresh UI + 저장 모달이 동시에 보여 사용자가 “두 작업”처럼 느낄 수 있음
3. 전체 Playwright 스위트는 일부 환경에서 flaky할 수 있음

### 지금 하지 말아야 할 것
1. `setTimeout` 추가로 덮는 임시봉합
2. hidden/background 경로만 예외 처리
3. `display:none`로 패널을 숨기는 변경
4. save 정책을 경로마다 따로 다르게 만드는 것

### 향후 개선 후보
1. refresh progress UI와 save modal 관계를 더 명확하게 표현
2. `12-snapshot.js`의 세부 책임 분리
3. full QA 스위트 flaky 원인 별도 정리

판정:
- **비차단 이슈**
- 당장 운영을 막는 수준은 아니다

---

## 최종 판정

### 현재 상태
- Live: 정상
- Saved: 정상
- Merge: 정상
- save 차단 정책: 정상
- auto refresh 재사용: 정상
- 저장 경로 공통 알고리즘: 정상

### 이번 리뷰의 핵심 결론
현재 코드는:

- 저장 버튼
- `directSave()`
- background save

가 **같은 알고리즘**으로 움직이고,
auto refresh in-flight 상황에서도 **중복 collect를 다시 시작하지 않도록** 보강된 상태다.

또한 이 결론은:
- 코드 구조 점검
- 상태 모델 점검
- 저장 차단 정책 점검
- 경쟁 시나리오 QA 강화

를 모두 포함한 결과다.

## 최종 한 줄 요약

**2026-03-22 기준 runtime/save 구조는 운영 가능한 상태이며, 최근 문제였던 auto refresh/save 경쟁 race는 공통 알고리즘 + 강화된 QA까지 포함해 실질적으로 정리된 상태로 판단한다.**
