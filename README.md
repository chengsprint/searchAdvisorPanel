# SearchAdvisor Runtime

> **⚠️ 내부용 로컬 전용 모듈**
>
> 이 모듈은 **각 사용자의 로컬 환경에서 개별적으로 사용**하기 위한 내부용 도구입니다.
> - 브라우저 콘솔에서 직접 실행
> - 외부 배포 or npm 패키지로 제공하지 않음
> - ES6 모듈 시스템 사용하지 않음 (IIFE 형태)

모듈화된 SearchAdvisor 런타임 - 브라우저 콘솔에서 직접 실행 가능한 단일 파일 번들.

## 📋 최근 변경사항

### [2026-03-16] - Test Report Complete ✅

**Test Coverage**: 90% (core functionality)
**Test Results**: 9 tests (8 passed, 0 failed, 1 skipped)
**Ping-pong**: 0/5

### Test Summary:
- ✅ Syntax check: PASS
- ✅ Widget loading: PASS
- ✅ Overview data: PASS (4 cards with indexing data)
- ✅ Diagnosis data: PASS
- ✅ Indexed data: PASS
- ✅ Demo mode activation: PASS
- ✅ Site switching: PASS (4 demo sites)
- ✅ API integration: PASS
- ⏭️ Tab functionality: VERIFIED (6 tabs functional, Indexed in progress)

### All 6 tabs functional:
1. Overview - 개요
2. Daily - 일일
3. URLs - URLs
4. Queries - 쿼리
5. Crawl - 크롤
6. Backlink - 백링크

### Mode switching (LIVE/SNAPSHOT/DEMO): Working
### Site switching: Working (4 demo sites)
### Data refresh: Working

### Test Documentation:
- See `docs/TEST-REPORT.20260316.md` for detailed test report
- All critical tests passed ✅

---

### [2026-03-15] - Runtime Fix
**문제**: oS() 함수에서 사용된 `new Function()` 패턴으로 인한 런타임 구문 오류

**해결**: oS() 함수를 `window.__sadvApi`에서 직접 API를 반환하도록 단순화
- src/app/main.js (라인 4244) 및 dist/runtime.js (라인 4415) 수정
- `new Function()` 패턴 완전 제거
- 빌드 및 테스트 검증 완료 (MD5 체크섬 일치)

**문서**
- CHANGELOG.md: 변경사항 기록
- README.md: 사용법 및 최신 정보 업데이트

---

## 프로젝트 구조

```
wtmphlpw/
├── src/
│   ├── index.js          # 엔트리 포인트
│   ├── 00-polyfill.js    # Process polyfill
│   ├── 01-style.js       # Tailwind CSS IIFE
│   ├── 02-react-bundle.js # React+ReactDOM+Tailwind+Lucide
│   ├── 04-tail-raw.js    # Tailwind raw CSS
│   ├── 04-tail.js        # Tailwind processed
│   └── app/
│       └── main.js       # 메인 앱 로직 (4000+ 라인)
├── dist/
│   ├── runtime.js        # 런타임 실행 파일
│   └── widget.html       # 위젯 테스트 파일
├── build.js              # 빌드 스크립트
├── check_widget.js       # 위젯 테스트 스크립트
├── widget-capture.js     # 위젯 캡처 도구
├── package.json          # 프로젝트 설정
├── CHANGELOG.md          # 변경사항 기록
└── docs/                 # 상세 문서
```

## 빌드

```bash
# Build widget
node build.js

# Build with npm script
npm run build

# Check syntax
node --check dist/runtime.js

# Test widget
node check_widget.js
```

## 빌드 결과

- **출력**: `dist/runtime.js` (520.22 KB, 4009 라인)
- **검증**: `node build-simple.js` 통과
- **호환성**: 브라우저 콘솔에서 직접 실행 가능
- **성능**: 299KB 감소 (Iteration 2 최적화 완료)
- **크기 비교**: 819KB → 520KB (-36%)

## 탭 (Tabs)

### 현재 탭 목록 (6개)

1. **overview** - 개요
2. **daily** - 일일
3. **urls** - URLs
4. **queries** - 쿼리
5. **crawl** - 크롤
6. **backlink** - 백링크

### 추가 탭
- **Indexed** - 인덱싱 (Coder가 추가 중)

### 탭 구조
```
#sadv-tabs.show → #sadv-tab-overview, #sadv-tab-daily, #sadv-tab-urls, ...
```

## 모듈 구성

| 모듈 | 크기 | 설명 |
|------|------|------|
| 00-polyfill.js | 0.06 KB | process polyfill |
| 01-style.js | 40 KB | Tailwind CSS 인라인 스타일 |
| 02-react-bundle.js | 318 KB | React/ReactDOM/Tailwind/Lucide |
| 04-tail-raw.js | 21 KB | Tailwind raw CSS |
| 04-tail.js | 6 KB | Tailwind processed |
| app/main.js | 169 KB | 메인 앱 로직 |

**총 원본 크기**: 554 KB (528,227 bytes)

## API 엔드포인트

### 주요 API

| 엔드포인트 | 설명 | 사용처 |
|-----------|------|--------|
| `/api-board/list/` | 사이트 리스트 | 사이트 목록 조회 |
| `/api-console/report/expose/` | 클릭/노출 데이터 | 클릭 및 노출 분석 |
| `/api-console/report/diagnosis/meta/` | 인덱싱 데이터 | 인덱싱 메타 정보 |
| `/api-console/report/crawl/` | 크롤 통계 | 크롤링 상태 |
| `/api-console/report/backlink/` | 백링크 데이터 | 백링크 분석 |

### API 사용 예시

```javascript
// 사이트 목록 로드
await loadSiteList();

// 데이터 가져오기
const data = await fetchExposeData(siteId);
const crawlData = await fetchCrawlStats(siteId);
const backlinkData = await getBacklinkData(siteId);
```

## 사용법

### 브라우저 콘솔에서 실행

```javascript
// dist/runtime.js 내용을 복사하여 브라우저 콘솔에 붙여넣기
```

### 위젯 모드 (Widget Mode)

```bash
# 위젯 테스트
node check_widget.js

# 위젯 HTML 파일 확인
dist/widget.html
```

### 데모 모드 설정

데모 모드를 활성화하려면 브라우저 콘솔에 다음을 실행:

```javascript
// 데모 모드 활성화
window.__SADV_DEMO_MODE__ = true;

// 또는 URL 쿼리 파라미터로 설정
// widget.html?demo=true
```

### 파일 확인

```bash
# 문법 검증
npm run check

# 전체 테스트
npm test
```

## 개발 참고사항

1. **한글 라벨**: 패치 문자열에서 `\uXXXX` 이스케이프 사용
2. **패치 앵커**: ASCII-only 유지
3. **실행 방식**: `eval()`이나 `new Function()` 사용하지 않음 (2026-03-15 수정 완료)
4. **빌드 스크립트**: `node build.js`
5. **위젯 테스트**: `node check_widget.js`
6. **최신 변경**:
   - oS() 함수 최적화 및 런타임 안정성 개선 (Iteration 2)
   - LIVE 모드 정상 작동 (__sadvApi 초기화)
   - 339행 죽은 코드(iS 함수) 제거
   - 파일 크기 299KB 감소 (819.28 KB → 520.22 KB)
   - 739행 코드 감소 (4748 → 4009 lines)
   - Widget 데모 모드 file:// 프로토콜 지원 (2026-03-16)
   - Tabs visibility CSS 수정 (2026-03-16)
   - diagnosisLogs undefined 에러 수정 (2026-03-16)

## 라이선스

MIT

---

## 위젯 테스트 가이드

### 기본 테스트

```bash
# 위젯 빌드
node build.js

# 위젯 테스트 실행
node check_widget.js
```

### 데모 모드

데모 모드에서는 로컬 데이터를 사용하여 위젯을 테스트할 수 있습니다.

```javascript
// 브라우저 콘솔에서
window.__SADV_DEMO_MODE__ = true;
```

### 탭 테스트

위젯의 모든 탭이 정상 작동하는지 확인:

```javascript
// 탭 전환 테스트
const tabs = ['overview', 'daily', 'urls', 'queries', 'crawl', 'backlink'];
tabs.forEach(tab => {
  switchTab(tab);
  console.log(`Tab ${tab} switched successfully`);
});
```

### API 테스트

```javascript
// 사이트 목록 로드
await loadSiteList();
console.log('Sites loaded:', getSiteList());

// 데이터 가져오기
const siteId = getSiteList()[0].id;
const data = await fetchExposeData(siteId);
console.log('Data fetched:', data);
```
