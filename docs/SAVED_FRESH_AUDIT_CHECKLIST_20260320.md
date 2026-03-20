# Saved Fresh Audit Checklist

이 문서는 **새로 저장한 fresh saved HTML**을 검수할 때 쓰는 운영 체크리스트다.

중요:
- **오래된 saved HTML로 현재 runtime 회귀 여부를 판정하지 않는다**
- 반드시 **현재 runtime으로 새로 저장한 파일**만 audit 대상으로 삼는다

---

## 1. Saved fresh audit 체크리스트

fresh saved HTML을 새로 생성한 뒤 아래를 순서대로 본다.

### 1) 초기 열림
- ref badge 표시
- 패널 / 헤더 / 본문 / 탭 존재
- `pageErrors = []`
- `consoleErrors = []`

### 2) 모드 전환
- `전체현황 -> 사이트별 -> 전체현황` 왕복 가능
- active mode 상태가 실제 화면과 일치

### 3) 콤보 / 사이트 전환
- 콤보 열림
- 검색 동작
- 사이트 선택 후 라벨 / active item / 본문이 같이 갱신

### 4) 탭 전환
- overview 및 대표 하위탭 1~2개 전환 가능
- `데이터 없음`이 비정상적으로 전면 표시되지 않음

### 5) 전체현황 특화 기능
- period 버튼(`1/7/30/60/90`) 존재
- period 변경 시 KPI / 차트 / 카드 순서가 바뀜
- 색인 추이는 그대로 유지

### 6) read-only 계약
- refresh / save / close는 숨김 또는 비활성
- snapshot capability가 `isReadOnly = true`
- runtime kind가 `snapshot`

---

## 2. 통과 기준

아래를 모두 만족하면 **Saved fresh audit 통과**로 본다.

- `pageErrors = []`
- `consoleErrors = []`
- mode / combo / tab 전환이 모두 실제로 동작
- period 필터가 전체현황에서만 정상 작동
- shell/api state parity 핵심 필드가 일치
  - `curMode`
  - `curSite`
  - `curTab`
  - `allSitesPeriodDays`
  - `mergedMeta`
- read-only contract가 유지됨
- public action contract가 유지됨
  - `__sadvApi.switchMode`
  - `__sadvApi.setSite`
  - `__sadvApi.setTab`
- snapshot action contract가 유지됨
  - `getState`
  - `setSelectionState`
  - `setAllSitesPeriodDays`

---

## 3. Live / Saved / Merge 한 줄 기준

- **Live:** mode / site / tab / period 전환 시 fetch 정책과 기존 UX가 깨지지 않고 실제 데이터가 정상 표시될 것
- **Saved:** 새로 저장한 HTML이 오류 없이 열리고, mode / combo / tab / period 전환이 read-only 상태에서 정상 동작할 것
- **Merge:** export/merge payload가 current selection state를 facade 기준으로 보존하고, merged rows / summary parity가 깨지지 않을 것

---

## 4. 주의사항

- Saved 회귀는 UI보다 먼저 `pageerror / console error`로 본다
- Phase 1에서는 `12-snapshot.js` 대수술보다 contract 유지 여부를 우선 본다
- selection/action/provider contract가 깨졌다면 UI가 얼핏 보이더라도 통과로 처리하지 않는다

---

## 5. 가장 짧은 요약

> Saved fresh audit 통과 기준은 “새로 저장한 HTML이 오류 없이 열리고, 전체현황/사이트별/콤보/탭/period 전환이 read-only 상태에서 정상 동작하며, shell/api/action contract가 유지되는 것”이다.
