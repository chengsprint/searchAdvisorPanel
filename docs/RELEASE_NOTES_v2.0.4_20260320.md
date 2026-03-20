# SearchAdvisor Runtime v2.0.4 Release Notes

릴리즈 날짜: 2026-03-20  
태그: `v2.0.4`

## 요약
이번 릴리즈는 **저장본 HTML(snapshot) 안정화와 라이브/오프라인 경계 정리**에 초점을 맞춘 후속 안정화 릴리즈입니다.  
특히 저장 버튼 경로, 저장본 전체현황/사이트별 parity, 모바일 저장본 레이아웃, provider boundary 문서화와 감사 자동화가 크게 강화되었습니다.

## 핵심 개선 사항

### 1. 저장본 HTML parity 복구
- 저장본 전체현황 카드에 클릭/색인 미니 그래프를 복구했습니다.
- 저장본 사이트별/하위탭/콤보 전환 동작을 안정화했습니다.
- shell/api parity(`mergedMeta`, `runtimeVersion`)를 맞춰 저장본 내부 상태 일관성을 보강했습니다.

### 2. 저장 버튼 경로 안정화
- 저장 직전 HTML 후처리에서 shell host를 DOM 기준으로 먼저 삽입하도록 바꿔 anchor 탐색 취약성을 줄였습니다.
- 본문 anchor가 화면 상태에 따라 `sadv-bd` 또는 `sadv-tabpanel`로 바뀌는 문제를 정규화해, 간헐적 `snapshot panel not found` 오류를 해결했습니다.

### 3. 라이브/저장본 데이터 공급 경계 정리
- `07-data-provider.js`를 도입해 live/snapshot runtime kind, capabilities, state seam을 공통 경로에서 읽도록 정리했습니다.
- 라이브 패널이 snapshot으로 잘못 판별되는 회귀를 수정했습니다.
- UI는 공통 경로를 최대한 유지하고, 저장본은 read-only/offline provider만 다르게 쓰는 방향으로 구조를 정리했습니다.

### 4. 모바일 저장본 품질 개선
- 상단 snapshot 메타와 패널 본체의 중심축을 통일했습니다.
- 모바일 KPI 카드 숫자 clipping/overflow를 줄이도록 카드 비율과 폰트 스케일을 재조정했습니다.
- 전체현황 상세 작은 카드와 패턴 탭 mini card의 반응형 레이아웃을 보강했습니다.

### 5. 감사/운영 체계 강화
- `scripts/snapshot_workflow_audit.js`를 정식 편입했습니다.
- 저장본 계약(runtime kind, shell host, read-only capability, 하위탭 데이터, 모바일 layout)을 자동 검증하도록 감사 범위를 확대했습니다.
- snapshot 관련 의도와 경계를 코드 옆 문서와 운영 docs에 상세히 기록했습니다.

## 주요 수정 파일
- `src/app/main/07-data-provider.js`
- `src/app/main/09-ui-controls.js`
- `src/app/main/10-all-sites-view.js`
- `src/app/main/11-site-view.js`
- `src/app/main/12-snapshot.js`
- `scripts/snapshot_workflow_audit.js`
- `docs/FINAL_RELEASE_HANDOFF_20260320.md`

## 검증
- `npm run build`
- `npm run check`
- 저장본 HTML Playwright 감사 통과
- 실사용 기준 저장/재오픈/탭 전환/모바일 점검 통과

## 운영 메모
- 이미 저장해둔 HTML은 새 코드가 자동 반영되지 않습니다. 최신 runtime으로 다시 저장해야 최신 개선사항이 반영됩니다.
- snapshot 관련 구조는 현재 안정화 수준이 높지만, 장기적으로는 `12-snapshot.js`의 UI 역할을 더 줄이고 공통 UI 재사용을 확대하는 리팩토링 여지가 남아 있습니다.
