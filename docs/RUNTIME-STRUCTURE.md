# runtime.20260313.js 구조 및 모듈 맵

날짜: 2026-03-15  
목적: 단일 파일 런타임을 분석·파악·읽기 쉽게 하기 위한 논리적 구간 정리.  
기능 변경 없음. docs 계약(ARCHITECTURE, WORKING-GUIDE)과 불일치하는 부분만 교정 시 참고.

---

## 0. 코드 분리(빌드) – `src/` 모듈

런타임은 **src/만으로 조립**하며, 결과물은 `dist/runtime.js`이다. `runtime.20260313.js`는 참고용이며 제거 가능하다.

| 모듈 | 경로 | 역할 |
|------|------|------|
| 폴리필 | `src/00-polyfill.js` | `process` 폴리필 |
| 스타일 | `src/01-style.js` | Tailwind 인라인 스타일 IIFE |
| React 번들 | `src/02-react-bundle.js` | React·ReactDOM·Tailwind·lucide |
| 상수 | `src/app/constants.js` | `C`, `COLORS`, `fmt`, `DATA_TTL`, `FULL_REFRESH_*` 등 |
| 유틸 | `src/app/utils.js` | `escHtml`, `pad2`, `applyAccountBadge` 등 (편집용) |
| 앱 본문 | `src/app/body-rest.js` | nS 내부 나머지 전부 |
| 테일 | `src/04-tail.js` | k0, 활동 UI, 마운트, setSnapshotMetaState |

- **빌드**: `node build.js` → `dist/runtime.js` 생성 (참조 파일을 읽지 않음).
- **추출**: 참조가 있을 때 `node extract-from-runtime.js`로 src/를 한 번 재생성 가능.

---

## 1. 파일 개요

- **총 라인 수**: 약 4662줄
- **구성**: 상단 폴리필/스타일 → React·Tailwind 번들 → 메인 앱(문자열 `nS`) → 스냅샷/쉘 헬퍼 → React DOM Server → 진입점/마운트
- **실행**: 브라우저에서 단일 스크립트로 로드. 북마클릿 또는 직접 삽입 시 `nS` 내용이 `new Function(...)()` 등으로 실행됨.

---

## 2. 라인별 논리 구간

| 구간 (대략) | 설명 | 비고 |
|-------------|------|------|
| **1** | `process` 폴리필 | Node 환경 대비 |
| **2** | Tailwind CSS 인라인 스타일 IIFE | `#sadv-react-style` 주입 |
| **3 ~ 171** | React·ReactDOM·Tailwind·lucide 등 번들 | 미니파이된 의존성 |
| **172 ~ 4249** | **메인 앱 코드** (문자열 `nS`) | 아래 3절 세부 구간 참고 |
| **4255 ~ 4328** | 스냅샷/쉘 유틸 (`q0`, `LS`, `kS`) | 저장 HTML·머지 계약 (payload 정규화, shell 주입) |
| **4329** | `oS` – 라이브 API 래퍼 생성 | `window.__sadvApi` 기반 |
| **4332 ~ 4639** | React DOM Server 레거시 번들 | SSR/저장 HTML 생성 시 사용 |
| **4640 ~ 4662** | 직접 저장 UI, 마운트, `snapshotShellMetaState` | 즉시 저장·React 루트 마운트, 전역 상태 |

---

## 3. 메인 앱 코드 (`nS` 내부) 세부 구간

`nS`는 `` `javascript: (async () => { ... })();` `` 형태의 문자열이다. 아래는 그 안의 **논리적 모듈**과 대략적인 라인 범위(원본 파일 기준).

| 논리 모듈 | 대략 라인 (파일 기준) | 역할 |
|-----------|------------------------|------|
| **Constants & theme** | 173–204 | `C`, `COLORS`, `fmt`, `fmtD`, `fmtB`, `PNL`, `CHART_W`, `DOW`, `SITE_*`, `DATA_TTL`, `FULL_REFRESH_*` 등 |
| **Tip (툴팁)** | 205–234 | `tip()`, `showTip()`, `moveTip()`, `hideTip()` |
| **Charts** | 234–615 | `sparkline()`, `barchart()`, `xlbl()`, `chartCard()`, `kpiGrid()`, `secTitle()`, `ibox()`, `ctrBadge()`, `hbar()`, `st()`, `pearson()` |
| **Utils (문자열·날짜·계정)** | 751–826 | `escHtml()`, `pad2()`, `stampFile()`, `stampLabel()`, `fileSafe()`, `accountIdFromLabel()`, `getAccountLabel()`, `applyAccountBadge()` |
| **Export & full refresh** | 827–948 | `collectExportData()`, `renderFullRefreshProgress()`, `shouldBootstrapFullRefresh()`, `runFullRefreshPipeline()`, `savedAtIso()` |
| **Snapshot (저장 HTML)** | 964–1332 | `renderSnapshotAllSites()`, `buildSnapshotShellState()`, `buildSnapshotShellBootstrapScript()`, `buildSnapshotApiCompatScript()`, `injectSnapshotReactShell()`, `buildSnapshotHtml()` |
| **Snapshot state & report** | 1473–1651 | `setSnapshotMetaState()`, `getSiteMetaMap()`, `getMergedMetaState()`, `hasSuccessfulDiagnosisMetaSnapshot()`, `hasRecentDiagnosisMetaFailure()`, `getSiteShortName()`, `getSiteLabel()`, `isMergedReport()`, `fmtDateTime()`, `buildDefaultReportDecoration()`, `applySnapshotReportDecorations()` |
| **Snapshot fetch & shell notify** | 1652–1740 | `fetchExposeData()`, `fetchSiteData()`, `fetchExposeDataBatch()`, `cloneSnapshotShellState()`, `notifySnapshotShellState()` |
| **Cache (localStorage)** | 1740–1790 | `lsGet()`, `lsSet()`, `getUiStateCacheKey()`, `getCachedUiState()`, `setCachedUiState()` |
| **Tab & API shell** | 1790–1901 | `setTab()`, 탭/모드 UI, `isReady`/`waitUntilReady`/`subscribe`/`switchMode`/`setSite`/`setTab`/`refresh`/`download`/`close` |
| **Download snapshot** | 1902–1939 | `downloadSnapshot()` |
| **Data cache (live)** | 1940–2086 | `lsGet`/`lsSet`, `getCachedData()`/`setCachedData()`/`clearCachedData()`, `getEncIdCacheKey()` 등, `getCacheNamespace()`, `getSiteListCacheKey()`, `getSiteDataCacheKey()`, 캐시 타임스탬프, `getUiStateCacheKey()`, `setCachedUiState()` |
| **Site list & colors** | 2112–2149 | `loadSiteList()`, `assignColors()` |
| **Field/snapshot checks** | 2149–2230 | `hasOwnDataField()`, `getFieldSnapshotFetchedAt()`, `hasFreshFieldSnapshot()`, `hasSuccessfulFieldSnapshot()`, `shouldFetchField()`, `hasDetailSnapshot()`, `normalizeSiteData()`, `buildSiteSummaryRow()` |
| **Diagnosis meta** | 2287–2399 | `hasSuccessfulDiagnosisMetaSnapshot()`, `hasRecentDiagnosisMetaFailure()`, `hasDiagnosisMetaSnapshot()`, `shouldFetchDiagnosisMeta()`, `getDiagnosisMetaRange()`, `fetchDiagnosisMeta()` |
| **Cache & fetch (live)** | 2386–2590 | `getCachedSiteSnapshot()`, `emptySiteData()`, `persistSiteData()`, `fetchExposeData()`, `fetchSiteData()`, `refreshExportSiteData()`, `ensureExportSiteList()`, `resolveExportSiteData()`, `setSnapshotMetaState()`, `getSiteMetaMap()`, `getMergedMetaState()`, `getSiteShortName()`, `getSiteLabel()`, `isMergedReport()`, `ensureCurrentSite()`, `setAllSitesLabel()` |
| **Combo & mode** | 2637–2770 | `buildCombo()`, `setComboSite()`, `renderTab()`, `switchMode()`, `fetchExposeDataBatch()` |
| **Render all-sites** | 2800–3113 | `renderAllSites()`, 전체 현황 카드·차트·진행 UI |
| **Load site view** | 3114–3130 | `loadSiteView()` |
| **Tab renderers** | 3131–3925 | `buildRenderers()` → `overview`, `daily`, `urls`, `queries`, `pattern`, `crawl`, `backlink`, `insight` |
| **Legacy API** | 3926–4022 | `__sadvSnapshot()`, `__sadvNotify()`, `__sadvMarkReady()`, `window.__sadvApi` (getState, isReady, waitUntilReady, subscribe, switchMode, setSite, setTab, refresh, download, exportSnapshotData, buildLegacySnapshotHtml, close) |
| **Bootstrap & panel** | 4023–4249 | 패널 DOM 생성, 버튼 이벤트, 초기 로드/부트, `__sadvMarkReady()` 호출 |

---

## 4. docs 계약과의 정렬

- **ARCHITECTURE.20260314-html-snapshot-contract.md**  
  - Payload·스냅샷 메타·렌더 계약: `buildSnapshotHtml`, `buildSnapshotShellState`, `buildSnapshotApiCompatScript`, `EXPORT_PAYLOAD`/`siteMeta`/`mergedMeta` 사용부가 이 계약을 구현.
  - 스냅샷 재오픈 시 **직접 스냅샷 API + 단일 제어 쉘** 사용. 호환 레이어는 `buildSnapshotApiCompatScript` 및 `window.__SEARCHADVISOR_SNAPSHOT_API__` 등.

- **ARCHITECTURE.20260314-cache-bootstrap.md**  
  - 풀 새로고침: 캐시 만료·수동 새로고침·일반 HTML 저장·직접 HTML 저장이 **동일 풀 새로고침 파이프라인**을 타야 함.
  - `runFullRefreshPipeline`, `shouldBootstrapFullRefresh`, `collectExportData` 호출 경로가 이 정책과 맞는지 확인할 때 이 구간을 참고.

- **WORKING-GUIDE.20260314.md**  
  - 라이브 런타임 vs 저장 HTML vs 머지 스크립트 스트림 구분: 3절의 Export & full refresh, Snapshot*, Cache, Download snapshot vs 스냅샷 유틸(`q0`, `LS`, `kS`) 구간으로 나누어 보면 됨.
  - 인코딩·패치: 패치 앵커는 ASCII 위주로 유지; 한글 라벨은 `\uXXXX` 등 이스케이프 권장.

---

## 5. 읽기/수정 시 추천 순서

1. **상수·테마** → **Utils** → **Tip/Charts** (화면 부가 요소).
2. **Cache (live)** → **Site list & colors** → **Field/snapshot checks** → **Diagnosis meta** (데이터·캐시 계층).
3. **Export & full refresh** → **Snapshot*** (저장 HTML·스냅샷 계약).
4. **Combo & mode** → **Render all-sites** → **Load site view** → **Tab renderers** (라이브 UI).
5. **Tab & API shell** → **Legacy API** → **Bootstrap & panel** (진입·API·패널).
6. 파일 끝: **스냅샷 유틸** → **oS** → **직접 저장·마운트** → **snapshotShellMetaState**.

---

## 6. 관련 문서

- `AI-CONTROL-CENTER.20260314.md` – 문서 우선순위·진입점
- `ARCHITECTURE.20260314-html-snapshot-contract.md` – 스냅샷/페이로드 계약
- `ARCHITECTURE.20260314-cache-bootstrap.md` – 캐시·풀 새로고침 정책
- `WORKING-GUIDE.20260314.md` – 랩 가이드·검증 체크리스트
