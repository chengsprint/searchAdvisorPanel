# Snapshot Export Contract

이 문서는 `src/app/main/12-snapshot.js` 를 수정하는 사람/에이전트가
**저장본 HTML(snapshot export)** 의 구조를 빠르게 이해하고, 같은 실수를 반복하지 않도록
코드 근처에 두는 운영 문서다.

용어 기준:

- UI 비교 용어는 `라이브 패널` / `저장본 HTML` / `저장본 패널`로 맞춘다.
- `원본 패널`이라는 표현은 쓰지 않는다. `원본`은 원본 데이터/파일을 뜻할 때만 사용한다.
- 공용 기준은 `docs/SNAPSHOT_TERMINOLOGY.20260320.md` 를 따른다.

## 1. 정본(canonical source)

- **active snapshot 구현 정본은 `src/app/main/12-snapshot.js`**
- `dist/runtime.js` 는 `build.js` 가 `src/app/main/*` 모듈을 조립한 산출물
- `src/app/legacy-main.js` 에도 snapshot 관련 코드가 남아 있지만, 현재 active runtime build 경로는 아님

중요:

- 다만 `src/app/legacy-main.js` 는 레거시/참고/과거 진입점 역할 때문에 남아 있어,
  snapshot 핵심 로직을 수정할 때 **동일 규칙으로 동기화하거나, 최소한 stale 여부를 확인**해야 한다.

## 2. snapshot이 실제로 하는 일

저장본 HTML 내보내기는 “dict(payload)만 넣고 라이브 패널이 그대로 다시 도는 것”이 아니다.

실제로는:

1. 현재 라이브 패널 DOM 일부 clone
2. export payload(JSON) 삽입
3. 렌더러/헬퍼/상태 복원 로직 일부를 문자열 직렬화해서 저장본 HTML에 삽입
4. 저장본 HTML이 오프라인에서 자체 bootstrap

즉 저장본 HTML은 **오프라인 self-contained runtime** 이어야 한다.

## 3. 가장 중요한 규칙

### 규칙 A — 저장본 HTML은 self-contained 여야 한다

저장본 HTML 안에 들어가는 함수/렌더러/탭 로직은
라이브 패널 runtime의 외부 클로저나 전역에 의존하면 안 된다.

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

## 3.5 이번 회차 기준 의도와 금지사항

### 의도

- snapshot 직렬화는 "함수 문자열을 적당히 끼워 넣는 작업"이 아니라,
  저장본 HTML이 다시 열렸을 때 스스로 동작할 수 있게 하는 **오프라인 런타임 계약 유지 작업**이다.
- active export payload는 계속 진화할 수 있으므로,
  저장본 HTML 쪽에서는 **정해진 flat shell contract** 로 한 번 정규화한 뒤 읽는다.
- 이 flat shell contract(`window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__`)는 최소한
  `accountLabel`, `allSites`, `rows`, `siteMeta`, `mergedMeta`, `curMode`, `curSite`, `curTab`,
  `runtimeVersion`, `cacheMeta` 를 보존해야 한다.
- helper 함수와 style/token 맵은 모두 저장본 런타임의 실행 의존성으로 본다.

### 금지사항

1. `${fn.toString()}` 만 넣고 실제 심볼 바인딩 없이 끝내지 말 것
2. `dist/runtime.js` 를 정본처럼 직접 수정하지 말 것
3. `src/app/legacy-main.js` 레거시 경로를 동기화 확인 없이 방치하지 말 것
4. 저장본 HTML 재오픈 런타임 곳곳에 V2/legacy shape 분기 코드를 흩뿌리지 말 것
5. 정적 검증(`verify_snapshot_contract.js`)만 통과했다고 실행 워크플로우 검증을 생략하지 말 것
6. shell state/compat API 에서 `mergedMeta` 같은 필드를 “지금 안 쓸 것 같아 보여서” 임의로 누락하지 말 것

## 4. 최근 실제로 터졌던 회귀

### 회귀 1 — `isFiniteValue` 누락

- 증상: 저장본에서 `ReferenceError: isFiniteValue is not defined`
- 원인: `sparkline()` 이 helper를 참조하지만 저장본 HTML 쪽 바인딩이 없었음

### 회귀 2 — `S` 누락

- 증상: 저장본 사이트별 overview 진입 시 `ReferenceError: S is not defined`
- 원인: renderer가 `S.row` 를 쓰는데 저장본 HTML bootstrap에 `S` 가 없었음

### 회귀 3 — combo search stale 코드

- 증상: 저장본 콤보 검색이 동작하지 않거나 레이아웃이 망가짐
- 원인: 예전 `display:flex/none` 토글 코드가 남아 있었음
- 현재 규칙: `grid/none + !important`

## 5. 수정 시 반드시 같이 볼 것

### 코드

- `src/app/main/12-snapshot.js`
- `src/app/main/09-ui-controls.js`
- `src/app/legacy-main.js` (레거시 경로 동기화/비교용)
- `scripts/verify_snapshot_contract.js`

### 문서

- `docs/SNAPSHOT_CONTRACT_GUARDRAILS.20260320.md`
- `docs/SNAPSHOT_TERMINOLOGY.20260320.md`

## 6. 수정 후 필수 체크

### 정적 체크

```bash
npm run build
npm run check
```

`npm run check` 의 snapshot 관련 핵심은
`scripts/verify_snapshot_contract.js` 이다.
이 스크립트는 **빠른 문자열 기반 계약 검사**이며,
실제 재오픈 워크플로우는 아래 audit로 별도 확인해야 한다.

`scripts/snapshot_workflow_audit.js` 는 이제 단순 리포트 출력기가 아니라,
다음이 깨지면 비정상 종료하도록 유지한다.

- shell state ↔ snapshot API parity (`mergedMeta`, `allSites`, `rows`, `runtimeVersion`)
- combo top-layer/fixed positioning 계약
- combo 검색 후 visible/hidden 결과 존재 여부
- combo 선택 후 닫힘/active state
- `pageErrors === 0`

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
6. `shellParity` 에서 `mergedMeta`/`rows`/`allSites`/`runtimeVersion` 이 어긋나지 않는지

## 7. 앞으로의 구조 개선 방향

1. snapshot 구현 정본을 하나로 수렴
2. serializer dependency contract 명시화
3. 저장본 HTML bootstrap allowlist/검증 자동화 강화
4. 가능하면 레거시 `src/app/legacy-main.js` snapshot 구현을 thin facade 또는 제거 대상으로 축소
