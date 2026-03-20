# Snapshot Contract Guardrails — 2026-03-20

같이 봐야 하는 코드 근처 문서:

- `src/app/main/SNAPSHOT_EXPORT_CONTRACT.md`
- `docs/SNAPSHOT_TERMINOLOGY.20260320.md`

## 문서 역할

- 상세 구현 계약/직렬화 의존성 설명의 정본은 `src/app/main/SNAPSHOT_EXPORT_CONTRACT.md`
- 이 문서는 운영 가드레일, 레거시 경로 동기화 포인트, 회귀 체크리스트만 빠르게 확인하는 용도

## 배경

저장본 HTML(snapshot)은 라이브 패널 DOM을 단순 복사하는 것이 아니라, 일부 UI/렌더/차트 함수 본문을 문자열로 직렬화해서 오프라인 HTML 안에 삽입한다.

이 구조에서는 다음 두 가지 회귀가 특히 위험하다.

1. 직렬화된 렌더 함수가 의존하는 helper가 저장본 HTML에 함께 포함되지 않음
   - 실제 장애 예: `ReferenceError: isFiniteValue is not defined`
2. 레거시 snapshot 경로와 모듈 snapshot 경로가 서로 다르게 유지되어 구버전 UI 로직이 다시 저장본에 섞임
   - 실제 장애 예: combo search가 `display:flex/none` 구버전 코드로 저장됨

## 이번에 추가한 가드레일

### 1) self-contained helper 보장

`src/app/main/12-snapshot.js` 의 snapshot bootstrap 직렬화 구간에

- `const isFiniteValue = ${isFiniteValue.toString()};`
- `const S = ${JSON.stringify(S)};`
- `const C = ${JSON.stringify(C)};`
- `const T = ${JSON.stringify(T)};`
- `const TABS = ${JSON.stringify(TABS)};`

를 명시적으로 포함한다.

이 helper는 `sparkline()` / `barchart()` 류의 오프라인 차트 렌더에서 사용되므로,
누락되면 저장본 HTML에서만 ReferenceError가 발생한다.

`S` 는 렌더러 공통 row/card style map 이다.
일부 overview / queries / pages / pattern / backlink 렌더러가 `S.row` 를 사용하므로,
누락되면 사이트별 진입 시 `ReferenceError: S is not defined` 가 발생한다.

`C`, `T`, `TABS` 도 저장본 렌더/탭 shell 이 직접 역참조하는 실행 토큰이다.
현재 verifier는 이 토큰들도 같이 검사해, helper만 있고 토큰 맵이 빠진 반쪽 수정이 들어오지 않도록 한다.

주의:

- 단순히 `${isFiniteValue.toString()}` 만 넣으면 이름 없는 화살표 함수 조각만 삽입되어
  실제 바인딩이 생기지 않는다.
- 반드시 `const isFiniteValue = ...;` 형태로 넣어야 한다.

### 2) 레거시 경로 동기화

`src/app/legacy-main.js` 의 snapshot combo filter 로직도 모듈 경로와 동일하게 맞췄다.

- 이전: `el.style.display = ... ? "flex" : "none"`
- 현재: `el.style.setProperty("display", ... ? "grid" : "none", "important")`

이유:

- snapshot combo item은 grid 기반 레이아웃을 사용
- CSS 우선순위/`!important`와 충돌 시 단순 `style.display` 토글이 실패할 수 있음

### 3) 정적 계약 검증 스크립트

`scripts/verify_snapshot_contract.js`

이 스크립트는 다음을 검사한다.

- `src/app/main/12-snapshot.js` 에 `isFiniteValue.toString()` 이 포함되는지
- `src/app/legacy-main.js` 에도 동일 helper / 토큰 맵 포함이 유지되는지
- `src/app/main/07-ui-state.js` 의 shell state builder 가 `mergedMeta` 를 보존하는지
- `src/app/main/12-snapshot.js` / `src/app/legacy-main.js` 의 compat snapshot API 가 `mergedMeta` 를 누락하지 않는지
- 두 파일 모두에 stale combo filter 문자열이 남아 있지 않은지
- `dist/runtime.js` 에도 위 변경이 실제로 반영됐는지

`package.json` 의 `npm run check` 에 포함되어, 빌드 산출물과 snapshot 계약을 같이 확인한다.
단, 이 스크립트는 **빠른 정적 문자열 검사**이며 AST 수준 구조 분석이나
브라우저 재오픈 워크플로우 검증을 대체하지는 않는다.

운영 원칙:

- 정적 계약이 깨졌는지 빠르게 찾는 용도로 유지한다.
- 실행 동작 확인은 `scripts/snapshot_workflow_audit.js` 또는 실제 저장본 HTML 수동 점검으로 보완한다.
- `scripts/snapshot_workflow_audit.js` 는 가능하면 **실패를 강제하는 회귀 게이트**로 유지한다.
  JSON만 출력하고 0으로 끝나는 리포트용 스크립트로 약화하지 않는다.
- audit 결과의 `shellParity` 를 통해 injected shell JSON 과 runtime snapshot API 상태가 같은지 함께 본다.

## 운영 원칙

1. 저장본 HTML은 **오프라인 self-contained 문서**여야 한다.
2. snapshot 전용 직렬화 영역에 들어가는 함수는 **외부 클로저 helper에 의존하면 안 된다.**
3. 모듈 경로와 레거시 경로가 동시에 존재하는 동안, snapshot 핵심 로직은 반드시 동기화 검증이 필요하다.
4. 가능하면 장기적으로는 `src/app/legacy-main.js` 의 snapshot 구현을 thin facade 또는 제거 대상으로 본다.

## 회귀 체크리스트

1. 저장본 HTML에서 `ReferenceError` 가 없는지
2. 사이트별 진입 후 combo search 입력 시 결과 수가 실제로 줄어드는지
3. combo item 선택/닫기/재오픈이 정상인지
4. 차트(sparkline/barchart)가 껍데기만 보이지 않는지
5. 저장본 상단 ref와 실제 직렬화 코드가 어긋나지 않는지
6. `shellParity.shellStateHasMergedMeta`, `shellParity.apiStateHasMergedMeta`, `shellParity.mergedMetaEqual` 이 모두 기대대로 맞는지
