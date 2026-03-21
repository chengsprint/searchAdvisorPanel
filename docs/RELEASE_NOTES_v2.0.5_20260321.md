# SearchAdvisor Runtime v2.0.5 Release Notes

배포일: 2026-03-21  
태그: `v2.0.5`

## 핵심 요약

이번 릴리즈는 다음 세 가지를 중심으로 정리됐다.

1. **운영 배포 경로 정식화**
   - `loader.js -> stable.json -> runtime.js`
   - 개발 채널(`main`)과 운영 채널(`release`) 분리

2. **Live / Saved / Merge 호환성 안정화**
   - saved HTML fresh QA 반복 통과
   - public facade / snapshot API / selection parity 정리
   - 새 크롬/무캐시 board 페이지 site-list 회귀 복구

3. **Phase 1~3 current scope 마감**
   - provider/action/rows seam 정리
   - snapshot helper packaging / bootstrap 책임 분리
   - dormant compat bridge의 구조-only 분해 완료

## Added

- 전체현황 기간 필터(`1일 / 7일 / 30일 / 60일 / 90일`)
- canonical public action `switchSite(site)`
- 운영용 `dist/loader.js`
- 운영 승인 버전 manifest `dist/stable.json`
- `docs/PHASE2_FINAL_HANDOFF_20260321.md`
- `docs/PHASE3_CURRENT_SCOPE_HANDOFF_20260321.md`

## Changed

- 운영 배포 전략을 `@release/dist/loader.js` + `stable.json` 기반으로 정리
- Live / Saved / Merge가 더 공통 contract를 따르도록 provider/action/rows seam 수렴
- snapshot helper 직렬화를 helper pack 단위로 정리
- saved bootstrap / shell injection / public facade / compat bridge 책임을 더 읽기 쉬운 helper 경계로 분리
- dormant compat bridge를 state / label / sync / action / observer / body assembly 단위로 세분화

## Fixed

- 새 크롬/무캐시 환경에서 `console/board` 페이지가 사이트 목록을 복구하지 못하던 회귀 수정
- saved HTML에서 helper 누락/직렬화 순서 문제로 발생하던 전체현황 전환 / period / 콤보 / 카드 클릭 관련 회귀 보강
- public facade / snapshot richer API alias / selection parity 잔여 불일치 정리
- `fetchExposeData` / `INVALID_ENCID` 오류가 콘솔에만 남던 문제를 패널 상단 오류 배너로 보강

## Validation

다음 검증이 반복 통과한 상태다.

```bash
npm run build
npm run check
node tests/merge-test.js
node tests/phase1-verify-runtime.js
node scripts/snapshot_workflow_audit.js <fresh-saved-html>
```

fresh saved HTML 기준:

- `failures: []`
- `pageErrors: []`
- `consoleErrors: []`

## 운영 메모

- 외부 삽입 코드는 `@release/dist/loader.js`를 계속 사용한다.
- 운영 반영은 `dist/stable.json`이 가리키는 태그로 결정된다.
- 개발용 `main` 푸시가 즉시 운영 반영되지는 않는다.

## 현재 상태

- 제품 안정화/호환성: 완료
- Phase 1: 완료
- Phase 2: 완료
- Phase 3 current planned scope: 완료

이후 남은 일은 필수 잔여 작업이 아니라 optional deeper reduction / follow-up cleanup 성격으로 본다.
