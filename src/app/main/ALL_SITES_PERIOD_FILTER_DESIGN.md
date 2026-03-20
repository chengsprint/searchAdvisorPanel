# All-Sites Period Filter Design

이 문서는 **전체현황 전용 기간 필터(1/7/30/60/90일)** 의 설계 의도와 구현 규칙을
코드 바로 옆에 고정해 두기 위한 정본 문서다.

---

## 1. 범위

적용 대상:

- 전체현황 상단 KPI
- 전체현황 상단 클릭 TOP 차트
- 전체현황 사이트 카드의
  - 클릭
  - 노출
  - CTR
  - 클릭 추이

비적용 대상:

- 색인 추이
- 사이트별 탭 전체
- 개별 탭 하위 렌더러 전반
- fetch / refresh / cache 정책

즉, 이 기능은 **전체현황 화면에만 존재하는 로컬 view filter** 다.

---

## 2. 가장 중요한 원칙

### 원칙 A — canonical 90일 row는 유지

`buildSiteSummaryRow()` 는 여전히 **90일 정본 row builder** 로 유지한다.
기간 필터는 이 row를 직접 바꾸지 않고, 파생(display) row를 별도로 만든다.

### 원칙 B — fetch 없는 로컬 계산

기간 토글은 기존 90일 시계열을 슬라이스해서 계산한다.
토글 클릭으로 새로운 fetch가 나가면 안 된다.

### 원칙 C — 색인 추이는 고정

색인 추이 관련 필드:

- `diagnosisIndexedValues`
- `diagnosisIndexedDates`
- `diagnosisIndexedCurrent`

는 period 필터를 적용하지 않는다.

### 원칙 D — live / saved HTML / merge 같은 규칙

세 런타임 모두:

- 같은 period 옵션
- 같은 계산식
- 같은 정렬 기준
- 같은 UI 반응

을 가져야 한다.

---

## 3. state shape

권장 필드:

```js
allSitesPeriodDays: 90
```

의미:

- global filter 아님
- site mode 상태 아님
- **all-sites 전용 local view state**

저장본(saved HTML)도 이 state를 보존해야 한다.

---

## 4. 데이터 계산 규칙

새 helper는 pure function 이어야 한다.

권장 helper:

- `normalizeAllSitesPeriodDays(value)`
- `sliceLogsForPeriod(logs, days)`
- `deriveAllSitesPeriodRow(baseRow, days)`
- `deriveAllSitesPeriodRows(baseRows, days)`
- `computeAllSitesPeriodSummary(rows)`

이 helper는:

- DOM 접근 금지
- fetch 금지
- snapshot/live 분기 금지

원칙을 따른다.

---

## 5. 정렬 규칙

period 변경 시 아래는 모두 **period 적용 결과 기준으로 다시 계산**한다.

- 상단 KPI
- 상단 클릭 TOP 차트
- 사이트 카드 순서

단, combo 정렬과 site mode selection은 흔들지 않는다.

---

## 6. 주석 필수 위치

- `07-data-provider.js`
  - 왜 allSitesPeriodDays가 local view state인지
- `07-ui-state.js`
  - 왜 snapshot/live shell state에 같은 필드를 보존하는지
- `10-all-sites-view.js`
  - 왜 base row와 derived row를 분리하는지
  - 왜 색인 추이는 period 미적용인지
- `11-site-view.js`
  - 왜 raw fields를 additive 방식으로 보강하는지
- `12-snapshot.js`
  - 왜 saved HTML에서도 period 토글이 활성인지
  - 왜 저장 시점의 period를 보존해야 하는지

---

## 7. 금지사항

1. canonical row를 period 값으로 덮어쓰지 말 것
2. period 토글 시 `renderAllSites()` fetch 경로를 다시 태우지 말 것
3. 색인 추이에 period 필터를 적용하지 말 것
4. saved HTML에서 토글을 비활성화하지 말 것
5. combo ordering을 period 때문에 흔들지 말 것

---

## 8. 검증 포인트

### live

- 토글 전환 시 network 추가 요청 0건
- KPI/차트/카드 순서 즉시 변경
- 색인 추이는 그대로

### saved HTML

- 저장 시 선택한 period가 재오픈 후 유지되는지
- 토글이 동작하는지
- console/page error 없는지

### merge

- 같은 period 기준으로 KPI/CTR/활성 사이트 수가 자연스럽게 바뀌는지
