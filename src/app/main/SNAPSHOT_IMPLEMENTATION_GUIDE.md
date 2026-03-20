# Snapshot Implementation Guide

이 문서는 snapshot 관련 작업을 실제로 수정하는 AI/개발자를 위한
**실행 지침서**다.

설계 배경은 `SNAPSHOT_EXPORT_CONTRACT.md`, `UI_DATA_PIPELINE_BOUNDARY.md` 를 먼저 본다.

---

## 1. 먼저 판단할 것

수정하려는 변경이 아래 중 어디에 속하는지 먼저 분류한다.

### A. 공통 UI 변경

예:

- 헤더
- 탭
- 콤보
- 카드
- KPI
- 차트
- 반응형

이 경우 원칙:

- **live/snapshot 공통 소스 먼저 수정**
- 저장본 전용 분기는 마지막 수단

### B. live data provider 변경

예:

- API 엔드포인트
- 캐시 정책
- refresh pipeline
- bootstrap refresh

이 경우 원칙:

- live 전용으로 본다
- snapshot은 영향 범위만 검토

### C. snapshot entry / export 변경

예:

- 저장 버튼
- export payload
- inline JSON escape
- offline bootstrap

이 경우 원칙:

- snapshot 전용 변경 가능
- self-contained contract 검증 필수

---

## 2. 변경 유형별 필수 체크

### 헤더/메타 변경

확인:

- live desktop
- live mobile
- saved HTML desktop
- saved HTML mobile

### 콤보 변경

확인:

- live open/search/select
- saved HTML open/search/select
- outside click close
- top-layer / z-index / portal

### 전체현황 카드 변경

확인:

- live all-sites
- saved HTML all-sites
- 사이트 카드 클릭 -> site mode
- 모바일 숫자 overflow

### 사이트별 하위탭 변경

확인:

- overview / daily / queries / pages / crawl / backlink / diagnosis / insight / pattern
- live
- saved HTML
- mobile overflow
- pageErrors / consoleErrors

### snapshot bootstrap 변경

확인:

- helper/token 누락 여부
- shell/api parity
- runtimeVersion parity
- mergedMeta parity

---

## 3. 절대 하지 말아야 할 것

1. UI 문제를 snapshot 전용 복제 마크업으로 해결하지 말 것
2. 공통 renderer 수정 없이 snapshot 전용 HTML만 임시로 맞추지 말 것
3. helper/style token 의존성을 “아마 있겠지”라고 가정하지 말 것
4. `dist/runtime.js`를 정본처럼 직접 수정하지 말 것
5. saved HTML 재생성 검증 없이 parity 완료라고 판단하지 말 것

---

## 4. 수정 후 최소 검증

```bash
npm run build
npm run check
node scripts/snapshot_workflow_audit.js <saved-html-path>
```

그리고 아래를 실제로 확인한다.

- 전체현황 -> 사이트별
- 콤보 검색/선택
- 하위탭 전환
- 그래프 비어 있음 여부
- 모바일 overflow
- `pageErrors === 0`

---

## 5. 다음 AI를 위한 handoff 방식

작업이 끝나면 최소한 아래를 남긴다.

1. 무엇을 수정했는지
2. 왜 그 파일이 정본인지
3. 어떤 리스크를 줄였는지
4. 남은 리스크
5. 다음에 꼭 봐야 할 파일/워크플로우

이 형식을 생략하지 않는다.
