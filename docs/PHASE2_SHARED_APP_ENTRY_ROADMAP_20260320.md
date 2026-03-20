# Phase 2 Shared App Entry Roadmap (2026-03-20)

## 요약

Phase 1이 "경계 세우기"였다면,
Phase 2는 "같은 앱 + 다른 provider" 구조로 실제 수렴하기 시작하는 단계다.

핵심 목표:

- Live / Saved / Merge가 같은 action/state contract를 더 많이 공유
- Saved는 오프라인 단일 HTML 요구를 유지
- `12-snapshot.js`는 UI 구현보다 boot/provider 역할 쪽으로 축소

## 왜 필요한가

지금까지 반복된 saved-only 회귀의 대부분은

- helper 누락
- helper 초기화 순서 문제
- saved 전용 allowlist drift

에서 나왔다.

즉 기능은 이미 잘 돌아가지만,
장기적으로 새 기능을 넣을 때마다
"live는 되는데 saved만 깨지는" 일이 다시 생길 수 있다.

Phase 2의 목적은 이 구조적 위험을 줄이는 것이다.

## 이번 단계에서 얻고 싶은 효과

1. 외부 automation/QA가 live/saved를 같은 public facade로 다룸
2. saved helper 직렬화가 기능 묶음 단위로 더 안정화됨
3. `12-snapshot.js`가 점점 boot/provider 파일처럼 바뀜

## 상세 문서

정본 계획 문서:

- `src/app/main/PHASE2_SHARED_APP_ENTRY_PLAN.md`

같이 봐야 할 문서:

- `src/app/main/PHASE1_PROVIDER_REFACTOR_PLAN.md`
- `src/app/main/SNAPSHOT_REFACTOR_GUARDRAILS.md`
- `src/app/main/PROVIDER_ACTION_CONTRACT.md`
- `src/app/main/SNAPSHOT_IMPLEMENTATION_GUIDE.md`

## 진입 전 체크

Phase 2 작업을 시작하기 전 아래가 만족돼야 한다.

1. fresh saved HTML audit 통과
2. merge test 통과
3. build/check 통과
4. 현재 공용 facade 계약이 문서로 고정되어 있을 것

현재 기준으로 위 4개는 이미 충족돼 있다.
