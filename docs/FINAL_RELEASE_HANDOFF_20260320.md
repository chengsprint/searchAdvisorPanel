# Final Release Handoff — 2026-03-20

이 문서는 현재 시점의 **최종 안정 상태**, **이미 해결된 핵심 회귀**, **남은 보류 리팩토링**, **릴리즈 직전 체크리스트**를 한 번에 전달하기 위한 handoff 문서다.

관련 정본 문서:
- `src/app/main/SNAPSHOT_EXPORT_CONTRACT.md`
- `src/app/main/UI_DATA_PIPELINE_BOUNDARY.md`
- `src/app/main/SNAPSHOT_IMPLEMENTATION_GUIDE.md`
- `docs/SNAPSHOT_UI_DATA_ARCHITECTURE.20260320.md`
- `docs/SNAPSHOT_QA_DECISION_TREE.20260320.md`

---

## 1. 현재 기준 안정 ref

- 라이브/저장 경로 핵심 회귀 안정화 기준:
  - `926462e` — `Normalize snapshot body anchor before export`
- 감사 스크립트/마감 정리 기준:
  - 이 문서가 추가된 커밋 이후 최신 `main`

주의:
- 저장본 HTML은 **생성 시점의 runtime ref를 내장**한다.
- `main`이 업데이트돼도 **이미 저장한 HTML은 자동 갱신되지 않는다**.

---

## 2. 이번 라운드에서 해결된 핵심 문제

### A. 저장 버튼 간헐 실패

증상:
- `downloadSnapshot Error: snapshot panel not found`

실제 원인:
- 라이브 패널 본문 id가 항상 `sadv-bd`가 아니었다.
- `renderTab()` 경로에서 본문 id가 `sadv-tabpanel`로 바뀔 수 있었고,
  저장 경로는 여전히 `#sadv-bd`만 anchor로 가정했다.

해결:
- `buildSnapshotHtml()`에서 `#sadv-bd, #sadv-tabpanel` 둘 다 허용
- 저장 직전 본문 anchor를 `sadv-bd`로 정규화
- fallback regex도 `sadv-bd|sadv-tabpanel` 둘 다 허용

왜 중요한가:
- 이 수정으로 전체현황 / 사이트별 / 하위탭 상태에서 저장해도
  같은 anchor 계약을 유지할 수 있게 됐다.

### B. 저장본 전체현황 카드 parity

증상:
- 저장본에서 전체현황 카드 미니 그래프가 빠짐

원인:
- snapshot 전용 전체현황 카드 렌더가 live 카드보다 축약 구현이었음

해결:
- 클릭 sparkline / 색인 추이 block parity 복구

### C. 저장본 contract / shell parity

해결된 항목:
- `mergedMeta` shell/api parity
- `runtimeVersion` shell/api parity
- read-only capability 계약
- action button 제거/숨김 정합성

### D. 모바일 저장본 회귀

해결된 항목:
- snapshot meta / panel / header 중심축 불일치
- KPI 숫자 clipping
- 패턴/compact KPI overflow

---

## 3. provider boundary 진행 상황

### 완료

#### 1단계
- `07-data-provider.js` facade 도입
- live/snapshot runtime kind 구분
- shell state / rows / allSites / mergedMeta / cacheMeta / site data seam 추가

#### 2단계 1차
- UI가 capability를 실제 소비
- `09-ui-controls.js` action button / public API 경계 강화
- `10-all-sites-view.js`에서 provider seam 확대

#### 2단계 2차
- `assignColors()`
- `ensureCurrentSite()`
- `buildCombo()`
- `setComboSite()`
에서 `getRuntimeAllSites()` 경유 확대
- selection state seam 추가

### 아직 보류
- `injectSnapshotReactShell()` DOMParser 전환
- `12-snapshot.js`의 UI 역할 대폭 축소
- combo renderer / behavior 완전 분리

왜 보류하는가:
- 지금은 저장/저장본 흐름이 실제 사용자 기준으로 안정화된 상태다.
- release 직전에 큰 구조 변경은 오히려 회귀 위험이 크다.

---

## 4. 지금 기준으로 절대 건드리면 안 되는 영역

다음 작업자가 아래를 목적 없이 건드리면 회귀 위험이 높다.

1. `12-snapshot.js`
   - shell host 삽입 순서
   - `buildSnapshotHtml()` ↔ `injectSnapshotReactShell()` 계약

2. 저장본 combo top-layer 보정
   - fixed positioning
   - z-index
   - `style.setProperty(..., "important")`

3. 모바일 compact KPI 레이아웃
   - 전체현황
   - 사이트별 작은 박스
   - 패턴 탭

4. runtime kind 계약
   - live: `window.__SEARCHADVISOR_RUNTIME_KIND__ = "live"`
   - snapshot: `window.__SEARCHADVISOR_RUNTIME_KIND__ = "snapshot"`

---

## 5. 릴리즈 직전 체크리스트

### A. 라이브 패널
1. 전체현황 진입
2. 사이트별 진입
3. 하위탭 2~3개 전환
4. 새로고침
5. 저장
6. 닫기

### B. 저장본 HTML
1. 전체현황 시작
2. 사이트별 전환
3. 콤보 열기/검색/선택
4. 전체현황 카드 클릭 → 사이트별
5. 하위탭 전환
6. console/page error 0

### C. 모바일
1. meta / panel / header 중심축 일치
2. 상단 KPI 숫자 clipping 없음
3. 사이트별 작은 KPI overflow 없음
4. 패턴 탭 compact 카드 overflow 없음

### D. 명령형 검증
```bash
npm run build
npm run check
NODE_PATH=/home/seung/.cokacdir/workspace/yif7zotu/node_modules \
  node scripts/snapshot_workflow_audit.js <saved-html-path>
```

---

## 6. 사용자에게 안내할 수 있는 주의사항

1. 저장본 HTML은 생성 시점의 ref를 내장하므로, `main`이 업데이트돼도 이미 저장한 파일은 자동 갱신되지 않는다.
2. 저장 경로가 바뀐 경우에는 반드시 **새로 저장한 HTML**로 다시 검증해야 한다.
3. `main` 테스트 시에는 같은 페이지에 반복 주입하지 말고, 가능하면 새로고침 후 다시 로드하는 것이 좋다.

---

## 7. 다음 작업자에게 남기는 실무 메모

다음 라운드에서 가장 안전한 작업:
1. 감사 스크립트 유지/보강
2. release note / QA 문서 정리
3. 필요 시 DOMParser 기반 후처리 리팩토링 설계만 먼저

다음 라운드에서 가장 위험한 작업:
1. 저장/부트스트랩 경로를 목적 없이 재배치
2. snapshot 전용 UI를 새로 늘리기
3. combo / 모바일 레이아웃을 대수술

한 줄 결론:
**지금은 기능을 더 크게 바꾸는 시점이 아니라, 회귀 방지와 release 마감을 정리하는 시점이다.**
