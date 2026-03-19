# Snapshot Contract Guardrails — 2026-03-20

## 배경

저장 HTML(snapshot)은 라이브 패널 DOM을 단순 복사하는 것이 아니라, 일부 UI/렌더/차트 함수 본문을 문자열로 직렬화해서 오프라인 HTML 안에 삽입한다.

이 구조에서는 다음 두 가지 회귀가 특히 위험하다.

1. 직렬화된 렌더 함수가 의존하는 helper가 저장본에 함께 포함되지 않음
   - 실제 장애 예: `ReferenceError: isFiniteValue is not defined`
2. 레거시 snapshot 경로와 모듈 snapshot 경로가 서로 다르게 유지되어 구버전 UI 로직이 다시 저장본에 섞임
   - 실제 장애 예: combo search가 `display:flex/none` 구버전 코드로 저장됨

## 이번에 추가한 가드레일

### 1) self-contained helper 보장

`src/app/main/12-snapshot.js` 의 snapshot bootstrap 직렬화 구간에

- `isFiniteValue.toString()`

를 명시적으로 포함했다.

이 helper는 `sparkline()` / `barchart()` 류의 오프라인 차트 렌더에서 사용되므로,
누락되면 저장본에서만 ReferenceError가 발생한다.

### 2) 레거시 경로 동기화

`src/app/main.js` 의 snapshot combo filter 로직도 모듈 경로와 동일하게 맞췄다.

- 이전: `el.style.display = ... ? "flex" : "none"`
- 현재: `el.style.setProperty("display", ... ? "grid" : "none", "important")`

이유:

- snapshot combo item은 grid 기반 레이아웃을 사용
- CSS 우선순위/`!important`와 충돌 시 단순 `style.display` 토글이 실패할 수 있음

### 3) 정적 계약 검증 스크립트

`scripts/verify_snapshot_contract.js`

이 스크립트는 다음을 검사한다.

- `src/app/main/12-snapshot.js` 에 `isFiniteValue.toString()` 이 포함되는지
- `src/app/main.js` 에도 동일 helper 포함이 유지되는지
- 두 파일 모두에 stale combo filter 문자열이 남아 있지 않은지
- `dist/runtime.js` 에도 위 변경이 실제로 반영됐는지

`package.json` 의 `npm run check` 에 포함되어, 빌드 산출물과 snapshot 계약을 같이 확인한다.

## 운영 원칙

1. 저장 HTML은 **오프라인 self-contained 문서**여야 한다.
2. snapshot 전용 직렬화 영역에 들어가는 함수는 **외부 클로저 helper에 의존하면 안 된다.**
3. 모듈 경로와 레거시 경로가 동시에 존재하는 동안, snapshot 핵심 로직은 반드시 동기화 검증이 필요하다.
4. 가능하면 장기적으로는 `src/app/main.js` 의 snapshot 구현을 thin facade 또는 제거 대상으로 본다.

## 회귀 체크리스트

1. 저장본 HTML에서 `ReferenceError` 가 없는지
2. 사이트별 진입 후 combo search 입력 시 결과 수가 실제로 줄어드는지
3. combo item 선택/닫기/재오픈이 정상인지
4. 차트(sparkline/barchart)가 껍데기만 보이지 않는지
5. 저장본 상단 ref와 실제 직렬화 코드가 어긋나지 않는지
