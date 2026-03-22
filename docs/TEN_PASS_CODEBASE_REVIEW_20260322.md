# SearchAdvisor Panel 10-Pass Codebase Review

작성일: 2026-03-22  
대상 범위: `src/app/main/*`, `tests/playwright-direct-save-qa.js`, 관련 설계 문서  
검토 관점: Live / Saved / Merge / save 경쟁 처리 / public facade / QA 커버리지

## 목적

이 문서는 현재 코드베이스를 다시 순회하면서, 아래 질문에 답하기 위해 작성한다.

- 지금 구조를 운영 기준으로 믿어도 되는가?
- Live / Saved / Merge가 같은 계약 위에서 움직이고 있는가?
- save / directSave / background save는 동일한 알고리즘과 정책을 따르는가?
- QA는 어디까지 커버하고 있고, 어디가 아직 핫스팟인가?

## 검토 방법

- 핵심 파일 직접 재순회
  - `07-data-provider.js`
  - `09-ui-controls.js`
  - `12-snapshot.js`
  - `13-refresh.js`
  - `14-init.js`
- 저장 경쟁 시나리오 QA 결과 재검토
- 다관점 에이전트 검토 결과 반영

## 10-pass 반복 점검 결과

### 1. Runtime public facade / provider seam

현재 `window.__sadvApi`는 live/saved 공통 public facade 이름으로 유지되고,  
saved richer API는 `window.__SEARCHADVISOR_SNAPSHOT_API__`로 별도 유지된다.

판단:
- 좋음: facade 이름이 공통이고 책임이 문서화되어 있음
- 남은 주의점: `09-ui-controls.js`가 save/direction orchestration 쪽 public entry를 계속 쥐고 있으므로, 이후 기능 추가 시 의미 drift에 주의해야 함

### 2. Saved helper packaging / snapshot assembly

`12-snapshot.js`는 여전히 크지만, helper pack / shell injection / boot helper / public API publish helper 단위로 상당히 분해돼 있다.

판단:
- 좋음: 예전의 saved helper allowlist 누락 회귀는 많이 줄어든 상태
- 핫스팟: 여전히 `12-snapshot.js`가 가장 큰 fan-in/fan-out 파일이다

### 3. Shell / API / DOM parity

saved reopen QA와 fresh saved audit 체계 덕분에 shell/API/DOM parity를 지속적으로 보고 있다.

판단:
- 좋음: 현재 saved reopen 기준으로 public API / snapshot API / read-only / mode/tab/site parity가 안정적임
- 핫스팟: non-default selection 상태에서의 parity는 앞으로도 saved regressions의 1순위 리스크다

### 4. Save 정책(`completed` / `completed-with-issues` / `blocked` / `failed`)

저장 차단 기준은 이제 세 경로 공통으로 적용된다.

- 치명적 패널 사용자 오류 → `blocked`
- 실패율 20% 초과 → `blocked`
- 예외 실패 → `failed`

판단:
- 좋음: “문제가 있어도 저장본 생성”에서 “정책상 unsafe면 차단”으로 기준이 선명해짐
- 핫스팟: 사람 눈에는 `blocked`와 `failed`가 비슷하게 느껴질 수 있어 문구 일관성을 계속 유지해야 함

### 5. Save 버튼 / directSave / background save의 동일성

핵심 원칙은 다음과 같다.

- 저장 버튼
- `directSave()`
- `loadAndDirectSaveHeadless()`

이 3경로는 저장 정책, 상태 모델, 경쟁 처리 원칙을 같이 따라야 한다.

판단:
- 좋음: 현재 설계/문서 기준으로는 같은 알고리즘을 따른다
- 핫스팟: 한 경로만 예외 처리하면 바로 drift가 생기므로 이후 수정은 반드시 3경로 같이 봐야 함

### 6. Auto refresh in-flight save reuse 경쟁 처리

이번 라운드에서 가장 중요한 수정 포인트였다.

현재 원칙:
- 이미 진행 중인 `cache-expiry` refresh만 save가 재사용 가능
- `reusable` 판정 순간의 in-flight promise를 직접 캡처
- 이후 재판정하지 않고 그 promise를 await
- save 요청 시점 selection snapshot 유지

판단:
- 좋음: “`waiting-refresh`는 찍히는데 실제론 다시 collect” race를 잡는 방향으로 정리됨
- 핫스팟: 이 경쟁 처리의 진실은 상태만이 아니라 네트워크 요청 수로 검증해야 함

### 7. Merge / export parity

merge/export selection facade 정리는 이미 들어가 있고, merge 테스트도 계속 통과 중이다.

판단:
- 좋음: merge는 저장 경쟁 처리와 직접 충돌하지 않고, selection facade도 정리된 상태
- 핫스팟: merge는 문제를 일으키는 축이라기보다, 변경 시 무심코 깨뜨리기 쉬운 축이므로 regression guard 성격으로 계속 봐야 한다

### 8. QA 커버리지

현재 QA는 세 층으로 나뉜다.

- 빌드/정적 검증
  - `npm run build`
  - `npm run check`
- 데이터/머지 검증
  - `merge-test.js`
  - `phase1-verify-runtime.js`
- 브라우저 저장 흐름 검증
  - `playwright-direct-save-qa.js`

특히 direct save QA는 현재 다음을 본다.

- 정상 저장
- 캐시 미스 후 자동 갱신
- partial issue
- hard failure
- merge runtime
- headless directSave
- boot-hidden background download
- blocked on failure ratio
- blocked on panel error
- auto refresh in-flight 경쟁 시나리오 10/11/12

판단:
- 좋음: save 경쟁 처리와 blocked 정책까지 자동 검증됨
- 핫스팟: 전체 Playwright long suite는 가끔 flaky할 수 있으므로, 핵심 시나리오 필터 실행도 운영적으로 유용함

### 9. 네트워크 중복 검증 수준

이번 리뷰에서 중요한 결론은 “상태만 보면 안 된다”였다.

현재 핵심 검증:
- `waiting-refresh -> collecting` 금지
- `/api-console/report/` 요청 key 중복 금지
- `collect-export-start` source 기대값 확인
  - `full-refresh`: 1
  - `download-snapshot`: 0

판단:
- 좋음: 사용자가 실제로 본 “중복 수집되는 것 같다” 현상을 코드/요청 기준으로 잡아낼 수 있게 됨
- 핫스팟: request key 정규화 규칙을 너무 넓히거나 좁히면 false positive/false negative가 생길 수 있으므로 유지보수 시 주의

### 10. 현재 전체 판단

운영 관점 결론은 다음과 같다.

- Live: 안정적
- Saved: parity/contract/reopen 기준 안정적
- Merge: regression guard 기준 안정적
- save 경쟁 처리: 이번 라운드 핵심 수정으로 구조적으로 더 안전해짐

즉 현재 planned scope 기준으로는:
- 기능 안정성: 충분
- 구조적 명확성: 상당히 확보
- 남은 것은 필수 작업이라기보다, 장기 순화/가독성 개선 쪽이다

## 현재 강점

1. Live / Saved / Merge를 같은 계약으로 보는 습관이 코드/문서/QA에 모두 반영됨
2. saved helper packaging / public facade 분리가 많이 안정화됨
3. `blocked` 정책 도입으로 unsafe saved HTML 생성을 막을 수 있음
4. save 경쟁 처리에 대한 QA가 이제 상태 + 네트워크 둘 다 보기 시작함

## 현재 핫스팟

1. `12-snapshot.js`
   - 여전히 가장 큰 구조적 hotspot
2. 저장 관련 UX 문구
   - `waiting-refresh`, `blocked`, `failed` 문구는 계속 일관되게 유지해야 함
3. Playwright long suite flaky 가능성
   - 핵심 시나리오 선택 실행 흐름을 유지하는 것이 유용함

## 지금 기준에서 손대면 안 되는 것

- hidden/background save만 따로 예외 처리하는 패치
- save 버튼 / directSave / background save 중 한 경로만 먼저 수정하는 접근
- `waiting-refresh`를 sleep/retry로 덮는 임시봉합
- saved parity 문제를 DOM class 읽기 임시복구로 해결하려는 시도

## 지금 기준에서 손대도 되는 것

- QA 리포트 개선
- 상태 문구/운영 문구 미세 조정
- `12-snapshot.js` 추가 분해
- refresh/save seam 가독성 향상

## 최종 결론

현재 코드베이스는 **운영 가능한 수준으로 충분히 안정적**이다.  
특히 save / directSave / background save / blocked 정책 / saved reopen parity까지  
같은 계약으로 묶여 있다는 점이 중요하다.

다만 가장 큰 hotspot은 여전히 `12-snapshot.js`이며,  
추가 작업이 필요하다면 그것은 “필수 버그 수정”보다는  
장기적인 구조 순화와 가독성 개선에 가까운 성격이다.
