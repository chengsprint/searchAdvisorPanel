# Snapshot UI / Data Architecture — 2026-03-20

## 목적

저장본 패널이 라이브 패널과 **같은 디자인 공급망**을 따르고,
차이는 **데이터 공급 방식(live vs offline)** 으로만 제한되게 만들기 위한 상위 설계 문서다.

---

## 문제 배경

그동안 저장본 관련 회귀는 대부분 아래에서 발생했다.

- snapshot 전용 UI 분기
- helper/style token 누락
- 저장본 전용 shell/meta/layout drift
- combo top-layer 예외
- mobile parity 불일치

즉 문제의 본질은
**저장본이 다른 UI처럼 자라난 것**이다.

---

## 목표 구조

### 공통 UI 레이어

- shell
- tabs
- combo
- cards
- KPI
- renderers
- responsive rules
- style tokens

### data provider 레이어

- live provider
  - fetch
  - cache
  - refresh
- offline provider
  - payload
  - read-only

### snapshot entry 레이어

- export HTML 생성
- payload inject
- bootstrap entry
- compat/no-op API

---

## 원칙

1. 디자인 관련 변경은 공통 UI에서 해결한다.
2. snapshot 전용 UI는 최소화한다.
3. provider 차이는 UI 차이로 번역하지 않는다.
4. 저장본은 “다른 앱”이 아니라 “같은 앱의 offline provider 모드”를 목표로 한다.

---

## 단계별 수렴 계획

### 1단계

문서/주석 정비

### 2단계

공통 UI 경계 명시

### 3단계

snapshot 전용 렌더/markup 축소

### 4단계

provider 기반 공통 런타임 확대

---

## snapshot 전용으로 남길 최소셋

- payload 직렬화
- inline escape
- bootstrap entry
- offline state hydrate
- read-only API
- combo top-layer 예외(현실적 최소 예외)

---

## QA 기준

변경 후 반드시:

- live desktop/mobile
- saved HTML desktop/mobile
- all mode / site mode / combo / subtabs
- pageErrors / consoleErrors

를 확인한다.
