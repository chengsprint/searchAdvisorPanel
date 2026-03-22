# SearchAdvisor Runtime 10-Pass Boundary Review

작성일: 2026-03-22  
대상 범위: `src/app/main`  
집중 파일:
- `07-data-provider.js`
- `09-ui-controls.js`
- `12-snapshot.js`
- `13-refresh.js`
- `14-init.js`

## 목적

현재 런타임이:
- Live / Saved / Merge를 충분히 일관되게 다루는지
- save / directSave / background save / auto refresh 경쟁 조건이 안전한지
- 모듈 경계가 어느 정도 정리됐는지

를 다시 10회 수준으로 반복 점검한 결과를 고정한다.

---

## 총평

현재 구조는 **초기 대공사 목표(Phase 1~3 current scope)** 대비 꽤 많이 정리됐다.  
특히:
- provider facade
- public API seam
- save status seam
- background download boot contract
- refresh reuse seam

은 이미 “없던 경계”를 분명히 만들었다.

다만 여전히 가장 큰 hotspot은 `12-snapshot.js`이며,  
`09-ui-controls.js`와 `14-init.js`도 orchestration 성격이 강해서 **행동 순서 의존성**이 남아 있다.

즉 현재 상태는:
- **운영 가능**
- **구조 경계는 이전보다 선명**
- **하지만 orchestration과 snapshot special-case가 여전히 크다**

로 요약된다.

---

## 10회 반복점검 결과

### 1. `07-data-provider.js`는 현재 구조의 가장 중요한 경계 파일이다

좋은 점:
- runtime kind 판별
- capability contract
- public API publish seam
- save status global mirror

가 한 곳에 모여 있다.

의미:
- UI가 live/snapshot를 직접 알지 않게 만드는 핵심 facade 역할을 하고 있다.

남은 점:
- provider 역할이 “상태 읽기/쓰기 seam”과 “public facade publish”를 둘 다 갖고 있어서
  점차 커질 수 있다.
- 장기적으로는 `save status`, `public facade publish`, `runtime capability`가
  더 쪼개질 수 있다.

판단:
- **현재는 잘하고 있음**
- 다만 “좋은 중심점”이라서 더 비대해지지 않게 주의 필요

---

### 2. `09-ui-controls.js`는 semantic action 경계가 많이 좋아졌지만 여전히 orchestration이 크다

좋은 점:
- `applyUiControlsMode/Site/Tab`
- `getUiControlsSelectionState`

같은 helper 덕분에 UI가 selection seam을 직접 덜 건드린다.

남은 hotspot:
- 여전히 파일 자체가 큼
- combo / mode / tab / header meta / refresh/save button wiring이 함께 있다
- “UI 반응 규칙”과 “행동 orchestration”이 같이 있어서 읽기 부담이 큼

판단:
- 경계는 좋아졌지만
- **조작 이벤트가 많이 모여 있는 통합 진입점**이라는 성격은 아직 강함

---

### 3. `12-snapshot.js`는 여전히 최대 hotspot이다

좋은 점:
- 예전보다 helper 단위로 많이 분해됨
- save flow, overlay, background boot, payload normalize, snapshot bootstrap이
  전부 주석/계약으로 정리돼 있음

핵심 문제:
- 그래도 역할이 많다.
  - snapshot export
  - saved bootstrap
  - save status UI
  - blocked 정책
  - directSave / background save
  - compat bridge

판단:
- 지금은 “정리된 큰 파일”
- 장기적으로는 여전히 가장 회귀 가능성이 큰 파일

즉:
- **현재 운영은 가능**
- **향후 구조 순화 시 1순위 후보**

---

### 4. `13-refresh.js`는 점점 “재사용 가능한 refresh 엔진” 쪽으로 가고 있다

좋은 점:
- `shouldBootstrapFullRefresh`
- `runFullRefreshPipeline`
- reusable refresh context/signature
- in-flight promise/meta

가 한 파일에 모여 있어 save 재사용 정책을 이해하기 쉽다.

이번 라운드 기준 중요 포인트:
- save가 `waiting-refresh` 상태에서
  **재판정 없이 당시 in-flight promise를 그대로 await** 하도록 고쳐져
  경쟁 레이스가 줄었다.

남은 점:
- refresh engine이 UI progress까지 직접 만진다.
- 즉 pure data pipeline이라기보다 **engine + progress renderer** 성격이 섞여 있다.

판단:
- 현재로선 실용적
- 장기적으로는 progress UI 분리 여지 있음

---

### 5. `14-init.js`는 여전히 orchestration 밀도가 높다

좋은 점:
- boot sequence가 한 군데 보인다.
- site list load → cached UI restore → initial render → monitor start → boot request 처리
  순서가 명확하다.

남은 hotspot:
- `shouldBootstrapFullRefresh() && runFullRefreshPipeline(...)`
  가 await 없이 시작된다.
- boot와 background download orchestration이 이어져 있어서
  타이밍 민감도가 남아 있다.

판단:
- 현재 구조상 자연스러운 위치이긴 하지만
- **초기화/백그라운드 실행/auto refresh 경쟁의 출발점**이라 매우 민감한 파일이다.

---

### 6. save 계열 3경로는 이제 “같은 정책”으로 보는 게 맞다

현재 공통으로 묶인 것:
- 저장 차단 정책(`blocked`)
- 실패율 20% 초과 차단
- 치명 오류 배너 차단
- save status 모델
- auto refresh 재사용 정책

긍정적 변화:
- 저장 버튼
- `directSave()`
- background save

가 따로 놀지 않게 만드는 방향은 현재 맞다.

남은 점:
- implementation entry는 다르므로 QA는 계속 별도 유지 필요

판단:
- **알고리즘은 통일**
- **검증은 경로별 개별 유지**

---

### 7. selection snapshot 고정은 현재 구조에서 필수 불변식이다

현재 중요한 불변식:
- save 요청 시점의
  - `curMode`
  - `curSite`
  - `curTab`
  - `allSitesPeriodDays`

를 canonical snapshot으로 본다.

이유:
- auto refresh 대기 중 UI 변경이 생겨도
- 저장본은 요청 시점 상태를 보존해야 하기 때문이다.

판단:
- 이 규칙은 지금 구조에서 절대 깨면 안 된다.
- 향후 saved parity 이슈가 다시 생기면 가장 먼저 이 불변식부터 확인해야 한다.

---

### 8. save status seam은 외부 드라이버 대응 관점에서 매우 잘 잡혔다

좋은 점:
- `window.__SEARCHADVISOR_SAVE_STATUS__`
- `getSaveStatus()`
- `subscribeSaveStatus()`
- 중앙 overlay DOM

이 모두 같은 상태를 본다.

효과:
- 사람도 볼 수 있고
- 외부 Python/driver도 polling 가능
- blocked/failed/waiting-refresh 구분 가능

남은 점:
- 상태 문구는 점점 더 계약이 되므로 wording drift 주의 필요

판단:
- **현재 구조의 강점**

---

### 9. QA는 상태 중심에서 “요청 중복 없음” 중심으로 한 단계 올라갔다

이번 라운드 기준 의미 있는 변화:
- `waiting-refresh` 진입만 보는 게 아니라
- `waiting-refresh -> collecting` 재진입 금지
- `/api-console/report/` key 중복 검증
- `collect-export-start` source 검증

로 강화됐다.

판단:
- 이건 매우 중요함
- 앞으로 경쟁 조건 이슈는 **상태 + 네트워크 + source**를 같이 봐야 한다는 기준이 생겼다.

---

### 10. 현재 남은 구조적 hotspot은 “큰 버그”보다 “큰 파일 + orchestration 결합”이다

지금 남은 위험은 주로:
- `12-snapshot.js` 비대함
- `09-ui-controls.js` orchestration 밀집
- `14-init.js` timing sensitivity

같은 쪽이다.

즉 지금은:
- 기능이 안 되는 수준의 blocker보다는
- **장기 유지보수 시 다시 drift/reuse race가 날 수 있는 구간**
이 남아 있다고 보는 게 맞다.

---

## 파일별 경계 요약

### `07-data-provider.js`
- 현재 역할 경계: **좋음**
- 상태: facade 중심점
- 주의: 비대화 금지

### `09-ui-controls.js`
- 현재 역할 경계: **보통 이상**
- 상태: semantic action은 좋아졌지만 orchestration 많음
- 주의: UI 반응과 data orchestration 재혼합 금지

### `12-snapshot.js`
- 현재 역할 경계: **개선됐지만 여전히 가장 무거움**
- 상태: 최대 hotspot
- 주의: 새 기능 누적 금지, helper/contract 중심 유지

### `13-refresh.js`
- 현재 역할 경계: **좋음**
- 상태: refresh engine seam이 유용함
- 주의: progress UI 책임 과증식 주의

### `14-init.js`
- 현재 역할 경계: **실용적이지만 민감**
- 상태: boot orchestration 중심
- 주의: await/순서 변경은 회귀 위험 높음

---

## 지금 당장 꼭 고쳐야 하는가?

### 필수 blocker
- 현재 기준 **없음**

### 계속 주의해서 봐야 할 것
- auto refresh 경쟁
- saved parity
- background save hidden path
- `12-snapshot.js` 신규 기능 누적

---

## 운영 기준 최종 판단

현재 상태는:
- **운영 가능**
- **Live / Saved / Merge / Save 경쟁 처리 기준 충분히 실전적**
- **자동 QA도 이전보다 훨씬 강함**

다만 장기적으로는:
- `12-snapshot.js` 추가 비대화
- `09-ui-controls.js` orchestration 증가
- `14-init.js` 타이밍 변경

이 세 가지를 계속 경계해야 한다.

---

## 한 줄 결론

현재 런타임 구조는 **“대공사 이후 안정화된 실전형 구조”**에 가깝다.  
가장 큰 성과는 **공통 저장 정책, save status seam, refresh 재사용 규칙**을 정리한 것이고,  
남은 구조 리스크는 주로 **snapshot/orchestration 파일의 비대화**다.
