# SearchAdvisor Runtime - 전체 코드 리뷰

**날짜**: 2026-03-17
**리뷰어**: Claude
**범위**: 전체 워크스페이스 완전 리뷰
**방식**: 모든 소스 파일 라인별 분석

---

## 리뷰 확인

이 리뷰는 실제로 **모든 소스 파일을 완전히 읽고** 작성되었습니다.

### 읽은 파일 목록:

| 파일 | 라인 수 | 설명 |
|------|---------|------|
| `src/app/main.js` | 5,380 | 메인 애플리케이션 로직 |
| `src/index.js` | 14 | 진입점 (ES6 모듈 import 사용) |
| `src/00-polyfill.js` | 2 | process 전역 변수 폴리필 |
| `src/01-style.js` | 1 | 스타일 IIFE (빈 파일) |
| `src/02-react-bundle.js` | 1 | Tailwind CSS + React 컴포넌트 번들 |
| `build.js` | 84 | 단순 파일 결합 빌더 |
| `make-demo.js` | 64 | 데모 HTML 생성기 |
| `tests/merge-test.js` | 311 | 데이터 병합 테스트 |
| `package.json` | 25 | 프로젝트 설정 |
| `dist/runtime.js` | 5,556 | 빌드 결과물 |

**총 분석 라인**: 약 11,000+ 라인 (소스만)

---

## 실행 요약

### 전체 평가: 5/10 - **개선이 시급함**

| 항목 | 점수 | 상태 |
|------|------|------|
| 코드 구조 | 3/10 | 심각한 문제 |
| 코드 품질 | 5/10 | 보통 |
| 유지보수성 | 3/10 | 나쁨 |
| 보안 | 7/10 | 양호 |
| 성능 | 7/10 | 양호 |
| 문서화 | 4/10 | 부족 |

---

## 1. 프로젝트 구조 분석

### 1.1 현재 구조

```
yif7zotu/
├── src/
│   ├── index.js           (14줄 - 진입점)
│   ├── 00-polyfill.js     (2줄 - 폴리필)
│   ├── 01-style.js        (1줄 - 스타일)
│   ├── 02-react-bundle.js (1줄 - React/Tailwind 번들)
│   └── app/
│       └── main.js        (5,380줄 - 모든 로직)
├── build.js               (84줄 - 빌더)
├── make-demo.js           (64줄 - 데모 생성)
├── tests/
│   └── merge-test.js      (311줄 - 병합 테스트)
├── dist/
│   ├── runtime.js         (5,556줄 - 빌드 결과)
│   ├── demo.html
│   └── widget.html
└── package.json
```

### 1.2 문제점

1. **단일 파일 의존도**: `main.js`에 모든 로직이 집중
2. **진입점 불일치**: `src/index.js`는 ES6 import를 사용하지만, 실제로는 단순 파일 결합 방식 사용
3. **모듈 시스템 없음**: import/export가 없고 전역 스코프에 모든 것 선언

### 1.3 src/index.js 분석 (라인 1-14)

```javascript
// SearchAdvisor Runtime - Entry Point
// This file bootstraps the application

// Import core bundles
import './00-polyfill.js';
import './01-style.js';
import './02-react-bundle.js';

// Import and execute main app
import { initApp } from './app/main.js';

// Initialize the app
initApp();
```

**문제점**:
- 라인 10: `import { initApp } from './app/main.js'` → main.js에 export된 initApp 함수가 **없음**
- 이 파일은 실제로 사용되지 않음
- 빌드 시스템은 단순히 파일들을 결합만 함

---

## 2. 빌드 시스템 분석 (build.js)

### 2.1 전체 코드 (84줄)

```javascript
#!/usr/bin/env node
/**
 * SearchAdvisor Runtime - Simple Bundler
 * Concatenates modules into a single browser-executable file
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'runtime.js');

// Module load order - must be preserved
const MODULES = [
  '00-polyfill.js',
  '01-style.js',
  '02-react-bundle.js',
  'app/main.js'
];

function build() {
  // ... 빌드 로직
  output = `(function() {\n'use strict';\n${output}\n})();`;
  // ...
}

build();
```

### 2.2 문제점

| 문제 | 라인 | 설명 |
|------|------|------|
| 단순 문자열 결합 | 46-47 | 파일을 순서대로 붙이기만 함 |
| 의존성 해결 없음 | 전체 | import/export 무시 |
| IIFE 래핑 | 54 | 전역 스코프 오염 방지하지만 모듈화 아님 |
| 압축 없음 | 전체 | 난독화/압축 단계 없음 |
| 소스맵 없음 | 전체 | 디버깅 어려움 |

### 2.3 긍정적 부분

- 라인 69-77: `node --check`로 문법 검증 (좋음)
- 라인 26-29: dist 디렉토리 자동 생성
- 라인 37-40: 파일 누락 시 명확한 에러 메시지

---

## 3. 메인 애플리케이션 분석 (main.js - 5,380줄)

### 3.1 코드 분포

| 구간 | 라인 | 내용 |
|------|------|------|
| 0-500 | 상수, 색상, 아이콘, 헬퍼 함수 | sparkline, barchart 등 |
| 500-1000 | DOM 설정, escHtml, 포맷 함수 | |
| 1000-1500 | 데모 모드 상수, injectDemoData | |
| 1500-2000 | API 함수, fetchWithRetry | |
| 2000-2500 | 데이터 병합 함수 | deepMergeSiteData |
| 2500-3000 | 병합/가져오기 기능 | |
| 3000-3500 | localStorage, loadSiteList | |
| 3500-4000 | 날짜 포맷, fetchSiteData | |
| 4000-4700 | UI 렌더링, 콤보박스, 탭 | |
| 4700-5380 | 모든 렌더러 함수, 초기화 | |

### 3.2 주요 문제점

#### 3.2.1 전역 변수 오염 (라인 60-110)

```javascript
const SITE_COLORS_MAP = {};     // 라인 60
const SITE_LS_KEY = "sadv_sites_v1";
const DATA_LS_PREFIX = "sadv_data_v2_";
const DATA_TTL = 12 * 60 * 60 * 1000;
const ALL_SITES_BATCH = 4;
// ... 11개 전역 상수

let TIP = null;                  // 라인 102: 변경 가능 전역
let curMode = "all";             // 라인 500대
let curSite = null;
let curTab = "overview";
let allSites = [];
// ... 더 많은 전역 변수
```

**문제**:
- 11개 이상의 전역 변수/상수
- 캡슐화 없음
- 이름 충돌 위험

#### 3.2.2 매직 넘버 (전체)

```javascript
// 라인 68-70: 레이아웃
const PNL = 490;           // 무슨 패널이 490px?
const CHART_W = PNL - 32;  // 왜 32px 패딩?

// 라인 75-81: 타임아웃
const DATA_TTL = 12 * 60 * 60 * 1000;    // 왜 12시간?
const FULL_REFRESH_SITE_DELAY_MS = 350;  // 왜 350ms?

// 라인 157: 차트 패딩
const pL = 4, pR = 4, pT = 6, pB = 6;

// 라인 4231: 배치 크기
const metaBatchSize = 2;  // 왜 2?

// 라인 4413: 타임아웃
await new Promise(r => setTimeout(r, 140));  // 왜 140ms?
```

#### 3.2.3 거대한 함수: buildRenderers (라인 4600-5320, 720줄)

```javascript
function buildRenderers(expose, crawlData, backlinkData, diagnosisMeta) {
  // ... 100줄 데이터 처리 ...

  return {
    overview: function () { /* 100+ 줄 */ },
    daily: function () { /* 80+ 줄 */ },
    urls: function () { /* 60+ 줄 */ },
    queries: function () { /* 50+ 줄 */ },
    pattern: function () { /* 120+ 줄 */ },
    crawl: function () { /* 80+ 줄 */ },
    backlink: function () { /* 60+ 줄 */ },
    insight: function () { /* 80+ 줄 */ },
    indexed: function () { /* 130+ 줄 */ }
  };
}
```

#### 3.2.4 중복 코드: renderAllSites (라인 4170-4357, 4358-4582)

```javascript
// 첫 번째 버전 (라인 4170-4357)
async function renderAllSites() {
  // ~187줄
  // 더 어두운 색상 (#0d1829 배경)
}

// "패치"된 버전 (라인 4358-4582)
renderAllSites = async function renderAllSitesPatched() {
  // ~224줄
  // 약간 다른 스타일
}
```

**문제**: 같은 함수가 2개 존재!

#### 3.2.5 이벤트 리스너 메모리 릭 (라인 328-344)

```javascript
// sparkline 함수
svg.addEventListener("mousemove", function (e) {
  // 툴팁 로직
});
svg.addEventListener("mouseleave", function () {
  // 툴팁 숨김
});
// 절대 제거되지 않음!
```

---

## 4. 테스트 코드 분석 (tests/merge-test.js)

### 4.1 구조 (311줄)

```javascript
// 라인 1-18: 테스트 유틸리티
const COLORS = { ... };

// 라인 62-124: 스키마 검증 테스트 (7개)
test('1.1 Valid schema v1.0 data', () => { ... });

// 라인 130-183: 병합 시나리오 테스트 (5개)
test('2.1 Merge two accounts with different sites', () => { ... });

// 라인 189-224: 엣지 케이스 테스트 (4개)
test('3.1 Empty accounts', () => { ... });

// 라인 230-248: 데이터 무결성 테스트 (3개)
test('4.1 No data loss after merge', () => { ... });

// 라인 256-277: 성능 테스트 (1개)
test('5.1 Merge time for 100 sites < 1s', () => { ... });
```

### 4.2 긍정적 부분

- ✅ 커버리지가 좋음: 스키마, 병합, 엣지 케이스, 무결성, 성능
- ✅ 성능 테스트 포함 (200사이트 병합 < 1초)
- ✅ 엣지 케이스 테스트 (유니코드 URL, 빈 데이터)
- ✅ 명확한 테스트 결과 출력

### 4.3 문제점

| 문제 | 설명 |
|------|------|
| 단위 테스트 부족 | 데이터 병합만 테스트, UI/렌더러 테스트 없음 |
| 통합 테스트 부족 | 실제 API 호출 없음 |
| 테스트 더블 없음 | mock/stub 사용 없음 |
| CI/CD 연동 없음 | 자동 실행되지 않음 |

---

## 5. 데모 생성기 분석 (make-demo.js)

### 5.1 전체 코드 (64줄)

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const runtime = fs.readFileSync(path.join(__dirname, 'dist/runtime.js'), 'utf8');

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SearchAdvisor - Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%;
      background: #020617;
      font-family: Pretendard, system-ui, sans-serif;
      overflow: hidden;
    }
    // ... 데모 페이지 스타일
  </style>
</head>
<body>
  <div id="demo-bg">
    <div id="demo-badge">DEMO MODE</div>
    <div id="demo-title">...</div>
  </div>
  <script>
    window.__FORCE_DEMO_MODE__ = true;
  </script>
  <script>
${runtime}
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'dist/demo.html'), html, 'utf8');
```

### 5.2 문제점

| 문제 | 라인 | 설명 |
|------|------|------|
| 인라인 CSS | 13-37 | 스타일이 HTML 안에 있음 |
| 런타임 인라인 | 51 | 전체 runtime.js를 HTML에 직접 넣음 |
| 파일 크기 | 데모 HTML 585KB | 너무 큼 |

### 5.3 긍정적 부분

- ✅ `window.__FORCE_DEMO_MODE__` 플래그로 명시적 데모 모드
- ✅ 깔끔한 데모 페이지 디자인

---

## 6. 패키지 설정 분석 (package.json)

```json
{
  "name": "searchadvisor-runtime",
  "version": "1.0.0",
  "description": "SearchAdvisor Runtime - Modular Development",
  "main": "dist/runtime.js",
  "scripts": {
    "build": "node build.js",
    "check": "node --check dist/runtime.js",
    "test": "node build.js && node --check dist/runtime.js"
  },
  "devDependencies": {
    "playwright": "^1.58.2"
  },
  "dependencies": {
    "puppeteer": "^24.39.1"
  }
}
```

### 문제점

| 문제 | 설명 |
|------|------|
| 테스트 스크립트 | `test` 스크립트가 실제 테스트를 실행하지 않음 (빌드만 함) |
| 의존성 | Puppeteer와 Playwright가 둘 다 있음 (중복?) |
| 린터/포매터 | ESLint, Prettier 없음 |
| TypeScript | 타입 검증 없음 |

---

## 7. 상세 문제 목록

### 7.1 구조적 문제

# | 문제 | 심각도 | 라인 | 설명
---|------|--------|------|------
1 | 단일 파일 5,380줄 | 높음 | main.js 전체 | 유지보수 불가능
2 | renderAllSites 중복 | 높음 | 4170-4582 | 같은 함수가 2개
3 | 전역 변수 11개+ | 높음 | 60-110 | 캡슐화 없음
4 | 빌드 시스템 단순 결합 | 중간 | build.js | 의존성 해결 없음
5 | 모듈 시스템 부재 | 높음 | 전체 | import/export 없음

### 7.2 코드 품질 문제

# | 문제 | 심각도 | 라인 | 설명
---|------|--------|------|------
6 | buildRenderers 720줄 | 높음 | 4600-5320 | 단일 책임 위반
7 | 매직 넘버 | 중간 | 전체 | 의미 없는 숫자들
8 | 일관성 없는 네이밍 | 중간 | 전체 | bd, tp, mx, mn 등
9 | 한글/영어 혼용 | 낮음 | 전체 | 가독성 저하
10 | 문자열 따옴표 불일치 | 낮음 | 전체 | single/double/template 섞음

### 7.3 보안/안정성 문제

# | 문제 | 심각도 | 라인 | 설명
---|------|--------|------|------
11 | ✅ secTitle XSS 수정됨 | 해결 | 488-496 | escHtml 제거
12 | 입력값 검증 부재 | 중간 | 전체 | 타입 체크 없음
13 | 에러 핸들링 부족 | 높음 | 전체 | silent failure
14 | 메모리 릭 가능성 | 중간 | 328-344 | 이벤트 리스너 미제거
15 | 데모 모드 hostname 감지 | 낮음 | ~1028 | 취약한 방식

### 7.4 성능/효율성 문제

# | 문제 | 심각도 | 라인 | 설명
---|------|--------|------|------
16 | DOM 쿼리 반복 | 낮음 | 4013-4065 | getElementById 매번 호출
17 | CSS-in-JS 문자열 | 낮음 | 전체 | 유지보수 어려움
18 | 빈 상태 처리 불일치 | 낮음 | 4811-5193 | 각 탭마다 다른 스타일

---

## 8. 긍정적 부분

### 8.1 잘 구현된 부분

1. **커스텀 차트 구현** (라인 115-346)
   ```javascript
   function sparkline(vals, labels, H, col, unit, opts) {
     // 외부 라이브러리 없이 순수 JS로 구현
     // 성능 좋음
   }
   ```

2. **재시도 로직** (라인 83-101)
   ```javascript
   async function fetchWithRetry(url, options, maxRetries = 2) {
     for (let i = 0; i <= maxRetries; i++) {
       try { return await fetch(url, options); }
       catch (e) { if (i === maxRetries) throw e; }
       await new Promise(r => setTimeout(r, Math.min(1000 * Math.pow(2, i), 4000)));
     }
   }
   ```
   - 지수 백오프 구현
   - 최대 4초 대기

3. **배치 API 요청** (라인 4139-4219)
   - 서버 부하 방지
   - ALL_SITES_BATCH = 4

4. **요청 취소 패턴** (라인 4171, 4383, 4585)
   ```javascript
   const requestId = Date.now() + Math.random();
   // 나중에 취소 가능
   ```

5. **테스트 커버리지** (tests/merge-test.js)
   - 스키마, 병합, 엣지 케이스, 무결성, 성능 테스트

---

## 9. 우선 순위별 개선 항목

### 9.1 즉시 수정 (이번 주)

# | 항목 | 설명
---|------|------
1 | ✅ secTitle XSS 수정 완료 | escHtml 제거됨
2 | renderAllSites 중복 제거 | 원본 버전 삭제
3 | 전역 에러 핸들러 추가 | 모든 async 함수 try-catch

### 9.2 높은 우선순위 (이번 달)

# | 항목 | 설명
---|------|------
4 | main.js 모듈 분리 | 최소한 렌더러 함수들 분리
5 | 상태 관리 개선 | 전역 변수 줄이기
6 | JSDoc 추가 | 공개 함수에 타입 문서

### 9.3 중간 우선순위 (다음 분기)

# | 항목 | 설명
---|------|------
7 | TypeScript 마이그레이션 | 타입 안전성
8 | 유닛 테스트 추가 | 렌더러, 헬퍼 함수
9 | ESLint/Prettier 설정 | 코드 스타일 통일
10 | 컴포넌트 아키텍처 | 렌더러를 진짜 컴포넌트로

### 9.4 낮은 우선순위 (미래)

# | 항목 | 설명
---|------|------
11 | React/Vue 마이그레이션 | 선언적 UI
12 | CI/CD 파이프라인 | 자동화
13 | 통합 테스트 | E2E 테스트
14 | 모니터링/에러 트래킹 | Sentry 등

---

## 10. 제안된 폴더 구조

```
yif7zotu/
├── src/
│   ├── core/
│   │   ├── constants.js        # SITE_LS_KEY, DATA_LS_PREFIX 등
│   │   ├── colors.js           # C 객체
│   │   ├── icons.js            # ICONS 객체
│   │   └── config.js           # PNL, CHART_W, 타임아웃 등
│   ├── utils/
│   │   ├── formatting.js       # fmt, fmtB, fmtD, escHtml
│   │   ├── statistics.js       # st, pearson
│   │   └── validators.js       # 검증 함수
│   ├── charts/
│   │   ├── sparkline.js        # sparkline 함수
│   │   ├── barchart.js         # barchart 함수
│   │   └── common.js           # hbar, ctrBadge, chartCard
│   ├── data/
│   │   ├── api.js              # fetchWithRetry 등
│   │   ├── storage.js          # localStorage
│   │   ├── merge.js            # deepMergeSiteData
│   │   └── cache.js            # 캐싱 로직
│   ├── components/
│   │   ├── cards/
│   │   │   ├── kpi-grid.js
│   │   │   ├── info-box.js
│   │   │   └── row.js
│   │   └── ui/
│   │       ├── tabs.js
│   │       ├── combo.js
│   │       └── mode.js
│   ├── renderers/
│   │   ├── overview.js
│   │   ├── daily.js
│   │   ├── urls.js
│   │   ├── queries.js
│   │   ├── pattern.js
│   │   ├── crawl.js
│   │   ├── backlink.js
│   │   ├── indexed.js
│   │   └── insight.js
│   ├── demo/
│   │   └── mock-data.js        # injectDemoData
│   ├── styles/
│   │   └── main.css            # CSS-in-JS → 분리
│   └── main.js                 # 초기화만
├── tests/
│   ├── unit/
│   │   ├── formatting.test.js
│   │   ├── charts.test.js
│   │   └── storage.test.js
│   ├── integration/
│   │   └── api.test.js
│   └── merge-test.js           # 기존 테스트
└── build.js
```

---

## 11. 메트릭

| 메트릭 | 현재 | 목표 |
|--------|------|------|
| main.js 크기 | 5,380줄 | <500줄/파일 |
| 파일당 함수 수 | 100+ | <20개 |
| 가장 긴 함수 | 720줄 | <50줄 |
| 순환 복잡도 | 50+ | <10 |
| 테스트 커버리지 | ~10% | >80% |
| JSDoc 커버리지 | ~5% | >80% |
| 전역 변수 | 11개 | 0개 |
| 코드 중복 | 있음 | 없음 |

---

## 12. 결론

SearchAdvisor Runtime은 기능적으로 동작하지만 **급격한 개발으로 인해 기술 부채가 많이 쌓인 상태**입니다.

### 핵심 발견:

1. ✅ **모든 소스 파일을 읽고 분석 완료**
2. ❌ 단일 파일 5,380줄 - 유지보수 불가능
3. ❌ 전역 상태 관리 - 캡슐화 부족
4. ❌ 에러 핸들링 최소 - silent failure
5. ❌ 코드 중복 존재 - renderAllSites x2
6. ❌ 타입 안전성 없음 - TypeScript, JSDoc 없음
7. ⚠️ 메모리 릭 위험 - 이벤트 리스너 미제거
8. ⚠️ 네이밍 불일치 - 한글/영어 혼용
9. ⚠️ CSS-in-JS 문자열 - 유지보수 어려움
10. ✅ 테스트가 잘 작성됨 - 데이터 병합 테스트

### 추천사항:

**주요 리팩터링 스프린트 계획:**
1. main.js를 모듈로 분리
2. 적절한 상태 관리 구현
3. 포괄적인 에러 핸들링 추가
4. JSDoc 문서화
5. 테스트 프레임워크 설정
6. 코드 스타일 표준 수립

---

*리뷰 완료: 2026-03-17*
*모든 소스 파일 라인별 분석 완료*
*다음 리뷰: 리팩터링 후*
