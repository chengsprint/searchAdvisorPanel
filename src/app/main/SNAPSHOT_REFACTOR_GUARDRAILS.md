# Snapshot Refactor Guardrails

이 문서는 saved HTML(snapshot) 대공사 시 **절대 반복하면 안 되는 실수**와
리팩토링 과정에서 지켜야 할 가드레일을 정리한다.

snapshot 관련 회귀는 대부분 “조금 편하게 하려다 생긴 우회 구현”에서 시작했다.
따라서 이 문서는 단순 메모가 아니라 **강한 금지사항 문서**다.

---

## 1. snapshot에서 제거해야 할 anti-pattern

### A. `fn.toString()` 기반 helper 직렬화 남용
예:
- `isFiniteValue`
- `S`
- `ALL_SITES_PERIOD_OPTIONS`
- period helper들

문제:
- 누락
- 초기화 순서
- 자유변수 의존성 숨김
- saved-only 회귀

원칙:
- 가능한 한 helper 조각을 늘리지 말고
- 공통 앱 엔트리를 실행하도록 구조를 바꿔야 한다.

---

### B. saved 전용 UI 재조립
saved HTML이 payload + helper + UI 조각을 다시 조립하는 구조는 최소화해야 한다.

원칙:
- saved는 UI를 재조립하는 쪽이 아니라
- **payload + offline provider + app boot** 쪽으로 가야 한다.

---

### C. 문자열 치환 기반 후처리 의존
예:
- anchor id 문자열 찾기
- regex로 shell host 삽입
- 특정 DOM 조각 문자열 치환

문제:
- drift에 취약
- 구조 바뀌면 저장이 다시 깨짐

원칙:
- 가능하면 DOM 기반
- 더 나아가선 후처리 자체를 줄이기

---

### D. saved 전용 UI 분기 추가
예:
- snapshot 전용 카드
- snapshot 전용 콤보 markup
- snapshot 전용 tab markup

문제:
- 디자인 drift
- 원본 변경 시 saved 늦게 반영

원칙:
- UI 분기는 최후 수단
- saved 전용은 read-only / provider / boot 수준으로 제한

---

## 2. 절대 건드리면 안 되는 의미

### `buildSiteSummaryRow()`
이 함수는 90일 canonical row 정본 의미를 유지해야 한다.

금지:
- period 의미를 여기서 바꾸기
- display-only 계산을 여기 섞기

### canonical rows
saved/live/merge가 공유하는 정본 데이터 의미를 바꾸지 않는다.

### indexed trend
기간 필터 같은 display 기능 때문에 색인 추이 의미를 함부로 흔들지 않는다.

---

## 3. snapshot이 반드시 보존해야 할 것

- runtime kind
- selection state
- all-sites local UI state
- canonical rows
- siteMeta / mergedMeta / cacheMeta
- runtime version
- capabilities

이 중 하나라도 빠지면 saved parity가 깨질 수 있다.

---

## 4. 리팩토링 중 회귀 테스트 포인트

매 단계마다 반드시 확인:

1. 파일이 열린다
2. 전체현황 전환
3. 사이트별 전환
4. 하위탭 전환
5. 콤보 열기/선택
6. pageErrors 0
7. consoleErrors 0
8. read-only capability 유지
9. live-only action 비활성 유지

---

## 5. 작업자 금지사항

### 금지 1
“빨리 고치기 위해” snapshot에 또 새 전역 상수를 하나 더 박아 넣지 않는다.

### 금지 2
saved에서만 동작하는 임시 UI 분기를 쉽게 추가하지 않는다.

### 금지 3
helper 누락을 임시로 막기 위해 random global을 또 늘리지 않는다.

### 금지 4
live와 saved가 서로 다른 엔트리를 계속 타게 방치하지 않는다.

---

## 6. 최종 목표

snapshot의 장기 목표는 다음과 같다.

> saved HTML은 “다른 UI”가 아니라 **같은 앱을 offline provider로 실행한 결과**여야 한다.

즉 `12-snapshot.js`는 장기적으로:
- payload 적재
- offline provider seed
- app boot
정도만 남는 것이 이상적이다.

---

## 7. 한 줄 결론

snapshot 리팩토링의 핵심은

> **saved 전용 UI를 줄이고, saved 전용 bootstrap/provider만 남기는 것**

이다.
