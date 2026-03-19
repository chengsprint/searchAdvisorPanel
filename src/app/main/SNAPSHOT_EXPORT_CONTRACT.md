# Snapshot Export Contract

이 문서는 `src/app/main/12-snapshot.js` 를 수정하는 사람/에이전트가
**저장 HTML(snapshot export)** 의 구조를 빠르게 이해하고, 같은 실수를 반복하지 않도록
코드 근처에 두는 운영 문서다.

## 1. 정본(canonical source)

- **active snapshot 구현 정본은 `src/app/main/12-snapshot.js`**
- `dist/runtime.js` 는 `build.js` 가 `src/app/main/*` 모듈을 조립한 산출물
- `src/app/main.js` 에도 snapshot 관련 코드가 남아 있지만, 현재 active runtime build 경로는 아님

중요:

- 다만 `src/app/main.js` 는 레거시/참고/과거 진입점 역할 때문에 남아 있어,
  snapshot 핵심 로직을 수정할 때 **동일 규칙으로 동기화하거나, 최소한 stale 여부를 확인**해야 한다.

## 2. snapshot이 실제로 하는 일

snapshot 저장은 “dict(payload)만 넣고 원본 패널이 그대로 다시 도는 것”이 아니다.

실제로는:

1. 현재 패널 DOM 일부 clone
2. export payload(JSON) 삽입
3. 렌더러/헬퍼/상태 복원 로직 일부를 문자열 직렬화해서 저장 HTML에 삽입
4. 저장 HTML이 오프라인에서 자체 bootstrap

즉 snapshot은 **오프라인 self-contained runtime** 이어야 한다.

## 3. 가장 중요한 규칙

### 규칙 A — snapshot은 self-contained 여야 한다

저장 HTML 안에 들어가는 함수/렌더러/탭 로직은
live panel의 외부 클로저나 전역에 의존하면 안 된다.

### 규칙 B — 직렬화되는 함수가 참조하는 심볼은 명시적으로 포함해야 한다

예:

- helper 함수: `isFiniteValue`, `normalizeSiteUrl`, `getSiteLabel`
- 공용 토큰/맵: `C`, `S`, `T`, `ERROR_MESSAGES`, `TABS`
- 차트/툴팁 함수: `sparkline`, `barchart`, `showTip`, `hideTip`

### 규칙 C — 화살표 함수는 “정의”가 아니라 “바인딩”으로 넣어야 한다

잘못된 예:

```js
${isFiniteValue.toString()}
```

위 코드는 이름 없는 함수 조각만 들어갈 수 있다.

올바른 예:

```js
const isFiniteValue = ${isFiniteValue.toString()};
```

### 규칙 D — style/token 객체도 실행 의존성으로 취급해야 한다

`S.row` 같은 것은 단순 스타일 옵션이 아니라 렌더러가 실제로 참조하는 심볼이다.
빠지면 저장본에서 `ReferenceError` 가 난다.

## 4. 최근 실제로 터졌던 회귀

### 회귀 1 — `isFiniteValue` 누락

- 증상: 저장본에서 `ReferenceError: isFiniteValue is not defined`
- 원인: `sparkline()` 이 helper를 참조하지만 snapshot에 바인딩이 없었음

### 회귀 2 — `S` 누락

- 증상: 저장본 사이트별 overview 진입 시 `ReferenceError: S is not defined`
- 원인: renderer가 `S.row` 를 쓰는데 snapshot bootstrap에 `S` 가 없었음

### 회귀 3 — combo search stale 코드

- 증상: 저장본 콤보 검색이 동작하지 않거나 레이아웃이 망가짐
- 원인: 예전 `display:flex/none` 토글 코드가 남아 있었음
- 현재 규칙: `grid/none + !important`

## 5. 수정 시 반드시 같이 볼 것

### 코드

- `src/app/main/12-snapshot.js`
- `src/app/main/09-ui-controls.js`
- `src/app/main.js` (레거시 경로 동기화/비교용)
- `scripts/verify_snapshot_contract.js`

### 문서

- `docs/SNAPSHOT_CONTRACT_GUARDRAILS.20260320.md`

## 6. 수정 후 필수 체크

### 정적 체크

```bash
npm run build
npm run check
```

### 실제 저장본 워크플로우 체크

```bash
node scripts/snapshot_workflow_audit.js <saved-html-path>
```

확인할 것:

1. `pageErrors` 가 0인지
2. `전체현황 -> 사이트별` 전환이 되는지
3. combo 열기/선택/필터가 되는지
4. 하위탭 전환이 되는지
5. 그래프/차트가 비지 않는지

## 7. 앞으로의 구조 개선 방향

1. snapshot 구현 정본을 하나로 수렴
2. serializer dependency contract 명시화
3. snapshot bootstrap allowlist/검증 자동화 강화
4. 가능하면 레거시 `src/app/main.js` snapshot 구현을 thin facade 또는 제거 대상으로 축소
