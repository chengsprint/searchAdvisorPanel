# Shared App + Provider Refactor (2026-03-20)

이 문서는 라이브 패널과 saved HTML(snapshot)을 장기적으로
**같은 앱 + 다른 data provider** 구조로 옮기기 위한 상위 설계 문서다.

이 문서는 실무 문서 4개를 요약하고 연결한다.

- `src/app/main/PHASE1_PROVIDER_REFACTOR_PLAN.md`
- `src/app/main/RUNTIME_STATE_CONTRACT.md`
- `src/app/main/PROVIDER_ACTION_CONTRACT.md`
- `src/app/main/SNAPSHOT_REFACTOR_GUARDRAILS.md`

---

## 현재 문제 정의

saved HTML은 현재:
- 오프라인 단일 파일 요구를 만족
- 상당한 수준의 parity 확보

상태지만, 구조적으로는 여전히 아래 문제가 있다.

- helper / 상수 / 초기화 순서 회귀
- saved-only drift
- UI와 bootstrap 책임 혼합
- state contract 불명확

즉 지금 구조는 **당장 usable 하지만 장기 최선은 아니다.**

---

## 목표 구조

### live
- shared app
- live provider

### saved
- shared app
- snapshot provider

즉:
- UI / 상태기계 / 렌더러 = 공통
- data fetch / refresh / cache / read-only = provider 차이

---

## 단계별 계획

### Phase 1 — Contract Stabilization
- state / provider / action contract 문서화
- facade 중심 구조로 경계 고정
- 금지사항 명문화

### Phase 2 — Shared App Entry
- live/saved가 같은 UI 엔트리로 수렴
- saved는 offline provider만 다르게

### Phase 3 — Snapshot Bootstrap Slim
- `12-snapshot.js`를 payload boot/provider seed 파일로 축소
- helper 직렬화와 UI 재조립 최소화

---

## 구현 전에 꼭 지켜야 할 것

1. 문서 먼저
2. 코드 주석은 “왜 이렇게 했는가” 중심
3. saved 전용 UI 분기 최소화
4. canonical state 의미 보존
5. 매 단계마다 live + saved 회귀 확인

---

## 관련 위험

- saved HTML 호환성
- bootstrap 순서 회귀
- 전역 상태 drift
- provider seam이 약해지는 추상화만 생길 위험

---

## 작업자용 짧은 지침

새 기능/리팩토링 시:

1. 이 변경이 UI 공통화에 도움이 되는가?
2. provider가 흡수해야 할 차이를 UI에 새 분기로 만들고 있진 않은가?
3. saved-only helper/상수 직렬화를 또 늘리고 있진 않은가?
4. canonical row/state 의미를 깨진 않았는가?

---

## 결론

장기적으로 맞는 방향은:

> **saved를 별도 UI로 재조립하지 않고, 같은 앱을 offline provider로 실행하는 구조**

이다.
