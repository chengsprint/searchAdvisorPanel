# 5차 마무리 점검 인수인계 메모 — 2026-03-20

## 현재 판단 기준

- 정본 구현 경로: `src/app/main/*`
- 레거시 미러/참고 경로: `src/app/legacy-main.js`
- 빌드 산출물: `dist/runtime.js`
- snapshot 계약 정본 문서: `src/app/main/SNAPSHOT_EXPORT_CONTRACT.md`

핵심 원칙:

1. `dist/runtime.js` 를 직접 수정하지 않는다.
2. snapshot 관련 수정은 `src/app/main/12-snapshot.js`, `src/app/main/07-ui-state.js`, `scripts/verify_snapshot_contract.js`, 관련 문서를 함께 본다.
3. `src/app/legacy-main.js` 는 active build 입력은 아니지만 snapshot 회귀 재유입 방지를 위해 최소 동기화 상태를 계속 점검한다.

## 앞선 4회 작업에서 누적 반영된 것으로 확인한 사항

- snapshot helper/style/token self-contained embedding 강화
  - `isFiniteValue`, `S`, `C`, `T`, `TABS`
- 저장본 HTML 콤보 드롭다운 top-layer / fixed positioning 강화
- `mergedMeta` shell state / compat API 반영
- snapshot contract verifier 강화
- snapshot 용어 / 가드레일 / QA 체크 문서 추가
- 코드 근처 snapshot export contract 문서 추가

관련 파일:

- `src/app/main/07-ui-state.js`
- `src/app/main/12-snapshot.js`
- `src/app/legacy-main.js`
- `scripts/verify_snapshot_contract.js`
- `scripts/snapshot_workflow_audit.js`
- `src/app/main/SNAPSHOT_EXPORT_CONTRACT.md`
- `docs/SNAPSHOT_CONTRACT_GUARDRAILS.20260320.md`
- `docs/SNAPSHOT_COMBO_TOP_LAYER_NOTES.20260320.md`
- `docs/SNAPSHOT_TERMINOLOGY.20260320.md`
- `docs/SNAPSHOT_WORKFLOW_QA_CHECKLIST.20260320.md`

## 이번 5차 점검에서 실제로 다시 확인한 검증 결과

통과:

- `npm run build`
- `npm run check`
- `npm run test:unit`
- `npm run test:integration`

실패 / 주의:

1. `npm run lint`
   - `src/app/legacy-main.js:555` parsing error (`return` outside of function)
   - `tests/e2e/*` 의 기존 curly / quotes / no-unused-vars 등 누적 lint 부채 다수
   - 참고: `node --check src/app/legacy-main.js` 는 통과하므로, 현재 보이는 parse error는 레거시 스크립트 파일을 ESLint가 `sourceType: "module"` 로 읽는 설정 충돌 성격이 큼

2. `node scripts/snapshot_workflow_audit.js ./searchadvisor-hovertasty-20260320-032216.html`
   - 실패 포인트:
     - `shell state JSON should preserve mergedMeta field`
     - `shell state and snapshot API should agree on runtimeVersion`
   - 다만 combo top-layer / 검색 / 선택 / pageErrors 0은 통과
   - 해석: 감사 대상이 기존 저장본 artifact(`@4fa7ca3`)라 현재 소스보다 오래된 산출물일 가능성이 큼

## 남은 리스크

1. 기존 저장본 HTML artifact와 현재 소스 계약 사이 shell parity 불일치 가능성
2. `src/app/legacy-main.js` 레거시 mirror 유지 비용과 lint parse issue
3. `tests/e2e/*` 누적 lint 부채로 인한 신호 오염
4. 워킹트리에 `searchadvisor-*.html`, `tmp_*.png`, `photo_*.jpg` 등 감시/실험 산출물이 많아 다음 작업자가 혼동할 수 있음

## 다음 에이전트 우선순위 제안

1. 현재 HEAD로 새 저장본 HTML을 생성한 뒤 `npm run audit:snapshot-html -- <new-file>` 재실행
2. `src/app/legacy-main.js` 의 남은 레거시 직접 접근 정리
3. `src/app/legacy-main.js` 에 대한 ESLint override 또는 역할 축소 방향 결정
4. `tests/e2e/*` lint 부채 분리 정리

## 메모

- 중복 생성된 handoff 파일 `docs/HANDOFF_20260320_5TH_FINAL_CHECK.md` 는 이 문서로 안내하는 포인터만 남긴 상태다.
