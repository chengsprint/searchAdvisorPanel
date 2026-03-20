# Snapshot QA Decision Tree — 2026-03-20

이 문서는 변경 유형별로 어떤 워크플로우를 꼭 확인해야 하는지 빠르게 판단하기 위한 QA 결정표다.

---

## 1. 헤더 / 메타 / 상단 layout 변경

확인:

- live desktop
- live mobile
- saved HTML desktop
- saved HTML mobile

특히:

- 중앙 정렬
- 폭/패딩 일치
- KPI 숫자 overflow

---

## 2. 콤보 변경

확인:

- live: open / search / select / outside click
- saved HTML: open / search / select / outside click
- top-layer / z-index / portal
- mobile viewport

---

## 3. 전체현황 카드 변경

확인:

- live all-sites
- saved HTML all-sites
- 카드 클릭 -> site mode
- mini KPI overflow
- 미니 그래프 표시

---

## 4. 사이트별 하위탭 변경

확인:

- overview
- daily
- queries
- pages
- crawl
- backlink
- diagnosis
- pattern
- insight

각 탭마다:

- desktop/mobile
- pageErrors
- consoleErrors
- 숫자/card overflow

---

## 5. snapshot export / bootstrap 변경

확인:

- build/check
- saved HTML reopen
- shell/api parity
- runtimeVersion parity
- mergedMeta parity
- helper/token 누락 없음

---

## 6. 최소 실행 명령

```bash
npm run build
npm run check
node scripts/snapshot_workflow_audit.js <saved-html-path>
```
