# QA 엔지니어 관점: 테스트 가능성 분석 보고서

**분석 대상:** `src/app/main/*.js` (15개 파일)
**분석일:** 2026-03-18
**분석자:** QA 엔지니어 (15년 경력)

---

## 🔴 실행 요약 (Executive Summary)

### 테스트 가능성 등급: **C- (개선 필요)**

이 코드베이스는 브라우저 환경용 사용자 스크립트로 설계되었으므로 **E2E(End-to-End) 테스트에 최적화**되어 있으며, 단위 테스트는 제한적입니다. Playwright 기반 E2E 테스트를 강력히 권장합니다.

### 주요 문제점 요약
- **Blocking:** 0건
- **Critical:** 3건 (전역 상태 의존성, DOM 직접 조작)
- **Major:** 12건 (에러 처리 부재, 모의 불가능한 외부 의존성)
- **Minor:** 18건

---

## 1. 테스트 문제점 분류

### 🔴 Critical (긴급 수정 필요)

#### #C-1: 전역 상태 과도 의존 (Global State Coupling)
**파일:** 전체
**라인:** 다수
**문제:** `curMode`, `curSite`, `curTab`, `allSites`, `memCache` 등 전역 변수에 과도 의존

```javascript
// 07-ui-state.js: 8-10
let curMode = CONFIG.MODE.ALL,
  curSite = null,
  curTab = "overview";
```

**영향:**
- 단위 테스트 시 테스트 간 격리 불가능
- 테스트 순서에 의존적인 플레이킹(flaky test) 발생
- 병렬 테스트 실행 불가능

**테스트 방해 요소:** ⚠️ 테스트할 때마다 전역 상태를 초기화해야 함

#### #C-2: DOM 직접 조작으로 인한 모의 불가
**파일:** `02-dom-init.js`, `09-ui-controls.js`
**라인:** `02-dom-init.js:6-24`, `09-ui-controls.js:전체`
**문제:** DOM을 직접 생성하고 조작하여 브라우저 환경 없이 테스트 불가

```javascript
// 02-dom-init.js:21-25
const p = document.createElement("div");
p.id = "sadv-p";
p.style.cssText = "position:fixed;top:0;right:0;width:min(${PNL}px,100vw)";
document.body.appendChild(p);
```

**영향:**
- Node.js 환경에서 단위 테스트 불가
- jsdom 같은 가상 DOM 환경 필수

#### #C-3: fetch API 직접 사용으로 모의 불가
**파일:** `04-api.js`
**라인:** `514-542` (`fetchWithRetry`), `34-37` (`fetchExposeData`)
**문제:** `fetch`를 직접 호출하여 네트워크 요청을 모의하기 어려움

```javascript
// 04-api.js:34-37
const exposeRes = await fetchWithRetry(
  base + "/expose/" + encId + "?site=" + enc + "&period=90&device=&topN=50",
  { credentials: "include", headers: { accept: "application/json" } },
);
```

**영향:**
- API 호출을 가로채기困难
- 테스트 시 가짜 응답을 제어하기 어려움

---

### 🟠 Major (중요 개선 필요)

#### #M-1: null/undefined 체크 부재
**파일:** `03-data-manager.js`, `11-site-view.js`
**라인:** `03-data-manager.js:314-318`, `11-site-view.js:84-161`
**문제:** 데이터가 없는 경우 null 참조 가능성

```javascript
// 03-data-manager.js:314-318
function getCachedSiteSnapshot(site) {
  const cached = normalizeSiteData(getCachedData(site));
  const live = normalizeSiteData(memCache[site]); // memCache[site]가 undefined일 수 있음
  if (!cached && !live) return null;
  return normalizeSiteData({ ...(cached || {}), ...(live || {}) });
}
```

**엣지 케이스:**
- `memCache[site]`가 undefined인 경우
- `getCachedData(site)`가 null을 반환하는 경우
- 빈 객체 `{}`가 전달된 경우

#### #M-2: 에러 처리 부재 (Silent Failures)
**파일:** `04-api.js`, `10-all-sites-view.js`
**라인:** `04-api.js:46-53`, `10-all-sites-view.js:46-54`
**문제:** 에러가 발생해도 콘솔에만 출력하고 계속 진행

```javascript
// 04-api.js:46-53
} catch (e) {
  return persistSiteData(site, {
    expose: null,
    exposeFetchState: "failure",
    exposeFetchedAt: Date.now(),
    exposeStatus: null,
    detailLoaded: false,
  });
}
```

**문제점:**
- 에러가 발생했는지 호출자가 알 수 없음
- 실패 사유를 추적하기 어려움
- 재시도 로직을 구현하기 어려움

#### #M-3: localStorage 직접 사용으로 테스트 어려움
**파일:** `03-data-manager.js`
**라인:** `19-35` (`lsGet`, `lsSet`)
**문제:** localStorage를 직접 사용하여 Node.js 환경에서 테스트 불가

```javascript
// 03-data-manager.js:19-27
function lsGet(k) {
  try {
    const v = localStorage.getItem(k); // 브라우저 전역 API
    return v ? JSON.parse(v) : null;
  } catch (e) {
    console.error('[lsGet] Error:', e);
    return null;
  }
}
```

#### #M-4: window 객체에 강력 결합
**파일:** `03-data-manager.js`, `05-demo-mode.js`, `07-ui-state.js`
**라인:** `03-data-manager.js:375-424`, `05-demo-mode.js:150-213`, `07-ui-state.js:192-218`
**문제:** `window.__NUXT__`, `window.location` 등에 직접 접근

```javascript
// 03-data-manager.js:375
const exportPayload = window.__SEARCHADVISOR_EXPORT_PAYLOAD__;
if (exportPayload) {
  // ...
}
```

#### #M-5: 날짜/시간 직접 사용으로 테스트 시간 의존
**파일:** `04-api.js`, `10-all-sites-view.js`
**라인:** `04-api.js:78-82`, `10-all-sites-view.js:332-346`
**문제:** `new Date()`, `Date.now()`를 직접 사용하여 테스트 시간 고정 불가

```javascript
// 04-api.js:78-82
const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const d90 = new Date(Date.now() - 90 * 864e5)
  .toISOString()
  .slice(0, 10)
  .replace(/-/g, "");
```

#### #M-6: setTimeout 사용으로 비동기 테스트 복잡
**파일:** `05-demo-mode.js`, `10-all-sites-view.js`
**라인:** `05-demo-mode.js:157-208`, `10-all-sites-view.js:282-293`
**문제:** 네트워크 요청 모의를 위해 setTimeout 사용

```javascript
// 05-demo-mode.js:157-208
return new Promise((resolve) => {
  setTimeout(() => {
    // API 응답 모의
    resolve({ ok: true, json: () => exposeData });
  }, 50);
});
```

#### #M-7: 콘솔 출력만으로 에러 로깅
**파일:** 전반적으로 발생
**문제:** 에러가 `console.error`로만 출력되어 테스트에서 에러를 감지하기 어려움

```javascript
// 다수 파일에서 발견
console.error('[FunctionName] Error:', e);
return null; // 에러를 무시하고 null 반환
```

#### #M-8: 배열/객체 메서드 체이닝에서 안전성 부족
**파일:** `01-helpers.js`, `08-renderers.js`
**라인:** `01-helpers.js:259-261`, `08-renderers.js:2-11`
**문제:** 옵셔널 체이닝 미사용으로 런타임 에러 가능

```javascript
// 08-renderers.js:2-11
function buildRenderers(expose, crawlData, backlinkData, diagnosisMeta) {
  const item = (expose && expose.items && expose.items[0]) || {}; // 안전하지만 길다
  const period = item.period || {}, // item이 undefined면 에러
```

#### #M-9: 계정 이메일 검증 로직 불충분
**파일:** `03-data-manager.js`, `06-merge-manager.js`
**라인:** `03-data-manager.js:421-425`, `06-merge-manager.js:422-426`
**문제:** 이메일 형식 검증이 느슨하여 엣지 케이스 처리 부족

```javascript
// 06-merge-manager.js:422-426
const validAccountEmail = (accountEmail && typeof accountEmail === 'string' &&
                      accountEmail.trim() && accountEmail.includes('@'))
  ? accountEmail.trim()
  : 'unknown@naver.com';
```

**엣지 케이스:**
- `"@naver.com"` (로컬 파트 없음)
- `"test@"` (도메인 없음)
- `"test @naver.com"` (공백 포함)

#### #M-10: 대용량 데이터 처리 미고려
**파일:** `10-all-sites-view.js`, `12-snapshot.js`
**라인:** `10-all-sites-view.js:23-94`, `12-snapshot.js:189-743`
**문제:** 사이트 수가 100개 이상일 때 성능 저하 가능

```javascript
// 10-all-sites-view.js:46-54
const batchResults = await Promise.allSettled(batchSites.map((site) => fetchExposeData(site)));
// 동시 요청이 너무 많으면 rate limiting 발생 가능
```

#### #M-11: 비동기 요청 취소 로직 부재
**파일:** `11-site-view.js`
**라인:** `11-site-view.js:1-82`
**문제:** `requestId`로 체크하지만 실제 요청은 취소되지 않음

```javascript
// 11-site-view.js:14-16
const requestId = ++window.__siteViewReqId;
// 나중에 체크하지만 fetch 자체는 취소되지 않음
if (requestId !== window.__siteViewReqId || site !== curSite) {
  return;
}
```

#### #M-12: 메모리 누수 가능성
**파일:** `01-helpers.js`, `04-api.js`
**라인:** `01-helpers.js:512-557`, `04-api.js:4-7`
**문제:** �시 무제한 증가, 이벤트 리스너 미정리

```javascript
// 01-helpers.js:512-557
const v2Cache = new Map(); // 크기 제한 없음
```

---

### 🟡 Minor (개선 권장)

#### #M1-#M18: (상세 내용은 보고서 전문 참조)
- 반복되는 null 체크 패턴
- 매직 넘버 사용
- 함수가 너무 길어 테스트 어려움
- 하드코딩된 타임아웃 값
- 등등...

---

## 2. 엣지 케이스 분석

### 데이터 관련 엣지 케이스

| 엣지 케이스 | 현재 처리 | 문제 여부 | 우선순위 |
|------------|----------|----------|----------|
| 빈 배열 `[]` | 일부 처리 | ⚠️ 부분 | P2 |
| `null`/`undefined` | 체크 있으나 불충분 | ⚠️ 예 | P1 |
| 빈 문자열 `""` | 처리 안 함 | ⚠️ 예 | P2 |
| 대소문자混在 URL | 처리 안 함 | ⚠️ 예 | P3 |
| 유니코드 도메인 | 처리 안 함 | ⚠️ 예 | P3 |
| 100+ 사이트 | 처리하나 느림 | ⚠️ 예 | P2 |
| 1000+ 사이트 | 타임아웃 가능 | 🔴 예 | P1 |
| 0바이트 응답 | 처리 안 함 | ⚠️ 예 | P2 |
| JSON 파싱 실패 | try-catch 있음 | ✅ 아니오 | - |
| localStorage 꽉 참 | 처리 안 함 | ⚠️ 예 | P2 |
| 네트워크 완전 단절 | 재시도 있음 | ✅ 아니오 | - |

### UI 관련 엣지 케이스

| 엣지 케이스 | 현재 처리 | 문제 여부 | 우선순위 |
|------------|----------|----------|----------|
| DOM 요소 없음 | 체크 후 early return | ✅ 아니오 | - |
| 중복 클릭 | 처리 안 함 | ⚠️ 예 | P3 |
| 빠른 모드 전환 | requestId 체크 | ✅ 아니오 | - |
| 스크롤 위치 유실 | 처리 안 함 | ⚠️ 예 | P3 |
| 창 크기 변경 | 처리 안 함 | ⚠️ 예 | P3 |
| 인터넷 익스플로러 | 지원 안 함 | ✅ 아니오 | - |
| 모바일 브라우저 | 처리 안 함 | ⚠️ 예 | P3 |

---

## 3. 에러 처리 현황

### 현재 에러 처리 패턴

```javascript
// 패턴 1: Silent Failure (가장 흔함)
try {
  // ...
} catch (e) {
  console.error('[Function] Error:', e);
  return null; // 또는 빈 객체 반환
}

// 패턴 2: 상태만 반환
return {
  expose: null,
  exposeFetchState: "failure", // 상태만 표시
  exposeStatus: null
};

// 패턴 3: 에러를 던지지 않음 (거의 없음)
// 거의 모든 함수가 에러를 던지지 않음
```

### 문제점
1. **에러 추적 불가:** 어떤 에러가 발생했는지 로그를 뒤져야 함
2. **재시도 로직 구현 어려움:** 에러 타입을 구별할 수 없음
3. **사용자 경험 악화:** 실패해도 아무것도 표시 안 함

---

## 4. 결합도 분석

### 모듈 간 의존성 그래프

```
00-constants.js (상수)
    ↓
01-helpers.js (유틸리티)
    ↓
02-dom-init.js (DOM 초기화)
    ↓
03-data-manager.js (데이터 관리)
    ↓
04-api.js (API 호출) ← 05-demo-mode.js (모의 데이터)
    ↓
06-merge-manager.js (병합 로직)
    ↓
07-ui-state.js (UI 상태)
    ↓
08-renderers.js (렌더링)
    ↓
09-ui-controls.js (UI 컨트롤)
    ↓
10-all-sites-view.js (전체 사이트 뷰)
    ↓
11-site-view.js (사이트 뷰)
    ↓
12-snapshot.js (스냅샷)
    ↓
13-refresh.js (새로고침)
    ↓
14-init.js (초기화)
```

### 높은 결합도 지점
1. **전역 상태:** 모든 파일이 `curMode`, `curSite`, `curTab`에 의존
2. **DOM:** 대부분의 파일이 DOM을 직접 조작
3. **localStorage:** 데이터 관리 파일이 localStorage에 직접 의존

### 낮은 결합도 지점
1. **00-constants.js:** 상수만 정의, 의존성 없음
2. **01-helpers.js:** 대부분 순수 함수
3. **06-merge-manager.js:** 비즈니스 로직이 순수함수에 가까움

---

## 5. 모의(Mock) 가능성 분석

### 모의 가능한 외부 의존성

| 의존성 | 모의 가능성 | 난이도 | 방법 |
|--------|-----------|--------|------|
| `fetch` API | 🔴 어려움 | 높음 | Service Worker 또는 MSW |
| `localStorage` | 🟡 보통 | 중간 | localStorage mock 라이브러리 |
| `window.location` | 🟢 쉬움 | 낮음 | JSDOM 환경 변수 설정 |
| `Date.now()` | 🔴 어려움 | 높음 | Sinon.js 사용 필요 |
| DOM API | 🔴 어려움 | 높음 | JSDOM 또는 Playwright |
| `setTimeout` | 🟡 보통 | 중간 | fake timers 사용 |

---

## 6. 테스트 커버리지 목표

### 현재 테스트 상태
- **단위 테스트:** 0% (테스트 파일 없음)
- **통합 테스트:** 0% (테스트 파일 없음)
- **E2E 테스트:** 0% (Playwright 테스트 없음)

### 권장 커버리지 목표

| 테스트 유형 | 목표 커버리지 | 우선순위 | 예상 노력 |
|------------|--------------|----------|----------|
| E2E 테스트 (주요 흐름) | 80% | P0 | 2주 |
| 단위 테스트 (순수 함수) | 70% | P1 | 1주 |
| 통합 테스트 (API) | 50% | P2 | 1주 |
| 시각적 회귀 테스트 | 30% | P3 | 3일 |

---

## 7. 테스트 전략 제안

### 🎯 전략 1: E2E 테스트 집중 (권장)

이 프로젝트는 사용자 브라우저 환경용 스크립트이므로 **Playwright E2E 테스트**가 가장 적합합니다.

#### Playwright 테스트 구조

```typescript
// tests/e2e/main-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('SearchAdvisor Main Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Naver SearchAdvisor 페이지로 이동
    await page.goto('https://searchadvisor.naver.com/api-console/board');

    // 스크립트 주입 (개발 환경에서는 이미 주입되어 있음)
    await page.addInitScript({ path: './dist/bundle.js' });
  });

  test('전체 현황 모드에서 사이트 목록을 표시한다', async ({ page }) => {
    // 전체 현황 버튼 클릭
    await page.click('[data-m="all"]');

    // 로딩 대기
    await page.waitForSelector('.sadv-allcard', { timeout: 10000 });

    // 사이트 카드 확인
    const cards = await page.locator('.sadv-allcard').count();
    expect(cards).toBeGreaterThan(0);

    // KPI 그리드 확인
    await expect(page.locator('text=전체 클릭')).toBeVisible();
  });

  test('사이트별 모드에서 탭을 전환한다', async ({ page }) => {
    // 사이트별 모드로 전환
    await page.click('[data-m="site"]');

    // 첫 번째 사이트 선택
    await page.click('.sadv-combo-item:first-child');

    // 탭 전환 테스트
    const tabs = ['overview', 'daily', 'urls', 'queries', 'crawl', 'backlink'];
    for (const tab of tabs) {
      await page.click(`[data-t="${tab}"]`);
      await page.waitForTimeout(500); // 렌더링 대기
      await expect(page.locator(`[data-t="${tab}"].on`)).toBeVisible();
    }
  });

  test('데이터 새로고침이 작동한다', async ({ page }) => {
    const refreshCountBefore = await page.evaluate(() => {
      return window.__sadvRows?.length || 0;
    });

    // 새로고침 버튼 클릭
    await page.click('#sadv-refresh-btn');

    // 진행률 표시 확인
    await expect(page.locator('text=전체 데이터를 다시 수집')).toBeVisible();

    // 완료 대기
    await page.waitForSelector('.sadv-allcard', { timeout: 30000 });

    const refreshCountAfter = await page.evaluate(() => {
      return window.__sadvRows?.length || 0;
    });

    expect(refreshCountAfter).toBeGreaterThan(0);
  });
});
```

#### E2E 테스트 실행 방법

```bash
# Playwright 설치
npm install -D @playwright/test

# 테스트 실행
npx playwright test

# 헤드드 모드로 실행
npx playwright test --headed

# 특정 브라우저로 실행
npx playwright test --project=chromium
```

---

### 🧪 전략 2: 단위 테스트 (순수 함수 중심)

순수 함수만 단위 테스트로 분리합니다.

```javascript
// tests/unit/helpers.test.js
import { describe, it, expect } from 'vitest';
import {
  escHtml,
  fmt,
  fmtD,
  fmtB,
  st,
  pearson,
  normalizeSiteUrl,
  isV2Payload,
  validateV2Payload
} from '../src/app/main/01-helpers.js';

describe('escHtml', () => {
  it('HTML을 이스케이프한다', () => {
    expect(escHtml('<script>alert("XSS")</script>'))
      .toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
  });

  it('빈 문자열을 처리한다', () => {
    expect(escHtml('')).toBe('');
  });

  it('null을 처리한다', () => {
    expect(escHtml(null)).toBe('');
  });

  it('특수 문자를 처리한다', () => {
    expect(escHtml('\'"<>&/')).toBe('&#x27;&quot;&lt;&gt;&amp;&#x2F;');
  });
});

describe('fmt (숫자 서식)', () => {
  it('천 단위 구분자를 추가한다', () => {
    expect(fmt(1234567)).toBe('1,234,567');
  });

  it('0을 처리한다', () => {
    expect(fmt(0)).toBe('0');
  });

  it('소수점을 처리한다', () => {
    expect(fmt(1234.56)).toBe('1,235'); // 반올림
  });
});

describe('st (통계 함수)', () => {
  it('평균을 계산한다', () => {
    expect(st([1, 2, 3, 4, 5]).mean).toBe(3);
  });

  it('빈 배열을 처리한다', () => {
    expect(st([])).toEqual({
      mean: 0,
      std: 0,
      cv: 0,
      slope: 0,
      outliers: []
    });
  });

  it('이상치를 감지한다', () => {
    const data = [1, 2, 3, 4, 100]; // 100은 이상치
    expect(st(data).outliers).toContain(100);
  });
});

describe('normalizeSiteUrl', () => {
  it('URL을 정규화한다', () => {
    expect(normalizeSiteUrl('example.com/')).toBe('https://example.com');
    expect(normalizeSiteUrl('http://example.com')).toBe('http://example.com');
    expect(normalizeSiteUrl('https://example.com/')).toBe('https://example.com');
  });

  it('빈 문자열을 처리한다', () => {
    expect(normalizeSiteUrl('')).toBe('');
    expect(normalizeSiteUrl(null)).toBe('');
  });
});

describe('V2 Payload Validation', () => {
  it('유효한 V2 payload를 감지한다', () => {
    const validPayload = {
      __meta: { version: '1.0', savedAt: '2026-03-18' },
      accounts: {
        'test@example.com': {
          encId: 'abc123',
          sites: ['https://example.com'],
          dataBySite: {}
        }
      }
    };
    expect(isV2Payload(validPayload)).toBe(true);
  });

  it('잘못된 payload를 거부한다', () => {
    expect(isV2Payload(null)).toBe(false);
    expect(isV2Payload({})).toBe(false);
    expect(isV2Payload({ __meta: {} })).toBe(false);
  });
});
```

---

### 🔌 전략 3: API 모킹 테스트

API 호출을 모킹하여 네트워크 없이 테스트합니다.

```javascript
// tests/integration/api.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWithRetry } from '../src/app/main/04-api.js';

describe('fetchWithRetry', () => {
  beforeEach(() => {
    // fetch 모킹
    global.fetch = vi.fn();
  });

  it('성공 응답을 반환한다', async () => {
    const mockResponse = { ok: true, json: async () => ({ data: 'test' }) };
    global.fetch.mockResolvedValueOnce(mockResponse);

    const result = await fetchWithRetry('https://api.example.com/test');
    expect(result.ok).toBe(true);
  });

  it('재시도 로직이 작동한다', async () => {
    // 첫 번째는 실패, 두 번째는 성공
    global.fetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: 'test' }) });

    const result = await fetchWithRetry('https://api.example.com/test');
    expect(result.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('최대 재시도 횟수를 초과하면 에러를 던진다', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    await expect(
      fetchWithRetry('https://api.example.com/test', {}, 2)
    ).rejects.toThrow('Max retries exceeded');
  });

  it('timeout이 작동한다', async () => {
    // 타임아웃 모킹
    vi.useFakeTimers();

    const slowPromise = new Promise(() => {}); // 절대 해결되지 않음
    global.fetch.mockReturnValueOnce(slowPromise);

    const fetchPromise = fetchWithRetry('https://api.example.com/test');

    // 30초 경과
    vi.advanceTimersByTime(30000);

    await expect(fetchPromise).rejects.toThrow();

    vi.useRealTimers();
  });
});
```

---

## 8. 테스트 우선순위 리스트

### P0: 즉시 테스트 필요 (주요 비즈니스 로직)

1. **사이트 로딩 및 렌더링** (`10-all-sites-view.js`)
   - [ ] 사이트 목록이 비어있을 때 처리
   - [ ] API 호출 실패 시 처리
   - [ ] 진행률 표시

2. **사이트별 뷰** (`11-site-view.js`)
   - [ ] 데이터 없는 사이트 접근
   - [ ] 탭 전환
   - [ ] 요청 취소

3. **데이터 내보내기** (`12-snapshot.js`)
   - [ ] HTML 생성
   - [ ] V2 포맷 지원

4. **초기화** (`14-init.js`)
   - [ ] 첫 로딩 시 기본 모드
   - [ ] 캐시된 UI 상태 복원

### P1: 중요 테스트 (일반적 사용)

1. **API 호출** (`04-api.js`)
   - [ ] 재시도 로직
   - [ ] 타임아웃
   - [ ] 동시 요청 처리

2. **데이터 병합** (`06-merge-manager.js`)
   - [ ] 충돌 감지
   - [ ] 병합 전략

3. **UI 컨트롤** (`09-ui-controls.js`)
   - [ ] 모드 전환
   - [ ] 사이트 선택
   - [ ] 탭 전환

### P2: 테스트 권장 (엣지 케이스)

1. **데이터 관리** (`03-data-manager.js`)
   - [ ] 캐시 만료
   - [ ] localStorage 꽉 참
   - [ ] V2 다중 계정

2. **데모 모드** (`05-demo-mode.js`)
   - [ ] localhost 감지
   - [ ] 모의 데이터 생성

3. **새로고침** (`13-refresh.js`)
   - [ ] 전체 새로고침
   - [ ] 실패 요약 표시

### P3: 선택적 테스트 (개선 사항)

1. **도우미 함수** (`01-helpers.js`)
   - [ ] 차트 생성
   - [ ] 포맷팅 함수
   - [ ] 통계 함수

2. **DOM 초기화** (`02-dom-init.js`)
   - [ ] 패널 생성
   - [ ] 스타일 주입

3. **렌더러** (`08-renderers.js`)
   - [ ] KPI 그리드
   - [ ] 차트 카드
   - [ ] 정보 박스

---

## 9. 모의(Mock) 전략

### Playwright에서의 모킹

```typescript
// tests/e2e/api-mocking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Mocking', () => {
  test('모의 API로 빠르게 테스트한다', async ({ page }) => {
    // API 라우팅 설정
    await page.route('**/searchadvisor.naver.com/**', async (route) => {
      // 모의 응답 반환
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [{
            period: { start: '20260301', end: '20260315' },
            logs: [
              { date: '20260301', clickCount: 100, exposeCount: 1000, ctr: '10.00' },
              { date: '20260302', clickCount: 150, exposeCount: 1500, ctr: '10.00' }
            ],
            urls: [],
            querys: []
          }]
        })
      });
    });

    // 페이지 이동 및 테스트
    await page.goto('https://searchadvisor.naver.com/api-console/board');
    await page.addInitScript({ path: './dist/bundle.js' });

    // ... 테스트 계속
  });

  test('API 에러를 모킹한다', async ({ page }) => {
    await page.route('**/searchadvisor.naver.com/**', route => {
      route.abort('failed'); // 네트워크 실패 모킹
    });

    await page.goto('https://searchadvisor.naver.com/api-console/board');
    await page.addInitScript({ path: './dist/bundle.js' });

    // 에러 메시지 확인
    await expect(page.locator('text=데이터 없음')).toBeVisible();
  });
});
```

### MSW (Mock Service Worker) 사용

```javascript
// tests/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  // expose API 모킹
  rest.get('https://searchadvisor.naver.com/api-console/report/expose/:encId', (req, res, ctx) => {
    const { encId } = req.params;

    if (!encId) {
      return res(ctx.status(401));
    }

    return res(
      ctx.status(200),
      ctx.json({
        items: [{
          period: {
            start: '20260301',
            end: '20260315',
            prevClickRatio: '5.2',
            prevExposeRatio: '3.1'
          },
          logs: [
            { date: '20260301', clickCount: 100, exposeCount: 1000, ctr: '10.00' },
            { date: '20260302', clickCount: 150, exposeCount: 1500, ctr: '10.00' }
          ],
          urls: [
            { key: 'https://example.com/page1', clickCount: 50, exposeCount: 500, ctr: '10.00' }
          ],
          querys: [
            { key: '검색어1', clickCount: 30, exposeCount: 300, ctr: '10.00' }
          ]
        }]
      })
    );
  }),

  // diagnosis API 모킹
  rest.get('https://searchadvisor.naver.com/api-console/report/diagnosis/meta/:encId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 0,
        items: [{
          meta: [
            { date: '20260301', stateCount: { '1': 1000, '2': 50, '3': 10, '4': 5 } }
          ]
        }]
      })
    );
  })
];

// tests/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

---

## 10. 테스트 실행 환경 설정

### 패키지 설치

```bash
# E2E 테스트
npm install -D @playwright/test

# 단위/통합 테스트
npm install -D vitest

# API 모킹
npm install -D msw

# 커버리지
npm install -D @vitest/coverage-v8

# 추가 유틸리티
npm install -D sinon jsdom
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/app/main/**/*.js'],
      exclude: ['src/app/main/00-constants.js']
    }
  },
  resolve: {
    alias: {
      '@test': '/tests'
    }
  }
});
```

### tests/setup.js

```javascript
import { vi } from 'vitest';
import { server } from './mocks/server';

// MSW 서버 시작
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// localStorage 모킹
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] || null
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// window.location 모킹
Object.defineProperty(window, 'location', {
  value: {
    href: 'https://searchadvisor.naver.com/api-console/board',
    protocol: 'https:',
    hostname: 'searchadvisor.naver.com',
    pathname: '/api-console/board',
    search: ''
  },
  writable: true
});

// Date 모킹 (필요시)
vi.useFakeTimers();
```

---

## 11. 결론 및 권장사항

### 요약
이 코드베이스는 **사용자 브라우저 환경용 스크립트**로 설계되었으므로:

1. **E2E 테스트(Playwright)가 최적의 접근법**
2. **단위 테스트는 순수 함수로 제한**
3. **통합 테스트는 API 모킹에 집중**

### 즉시 실행할 조치 (P0)

1. **주요 E2E 테스트 작성** (1주)
   - [ ] 전체 현황 모드 로딩
   - [ ] 사이트별 모드 로딩
   - [ ] 탭 전환
   - [ ] 새로고침 기능

2. **Playwright 프로젝트 설정** (1일)
   - [ ] `playwright.config.ts` 작성
   - [ ] 테스트 환경 구축
   - [ ] CI/CD 통합

3. **API 모킹 레이어 구축** (2일)
   - [ ] MSW 핸들러 작성
   - [ ] 공통 모의 데이터 생성

### 단계적 개선 계획

| 단계 | 기간 | 목표 | 산출물 |
|------|------|------|--------|
| Phase 1 | 1주 | E2E 기반 테스트 구축 | Playwright 테스트 10개 |
| Phase 2 | 1주 | 순수 함수 단위 테스트 | Vitest 테스트 20개 |
| Phase 3 | 1주 | API 통합 테스트 | MSW 기반 테스트 15개 |
| Phase 4 | 3일 | 커버리지 70% 달성 | 커버리지 리포트 |
| Phase 5 | 2일 | CI/CD 통합 | GitHub Actions 워크플로우 |

### 최종 목표
- **E2E 커버리지:** 80%
- **단위 테스트 커버리지:** 70%
- **통합 테스트 커버리지:** 50%
- **전체 커버리지:** 65% 이상

---

## 부록: 테스트 케이스 예시

### E2E 테스트 템플릿

```typescript
// tests/e2e/template.spec.ts
import { test, expect } from '@playwright/test';

test.describe('SearchAdvisor E2E Template', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://searchadvisor.naver.com/api-console/board');
    await page.addInitScript({ path: './dist/bundle.js' });
    await page.waitForSelector('#sadv-p', { timeout: 5000 });
  });

  test.afterEach(async ({ page }, testInfo) => {
    // 실패 시 스크린샷
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test('테스트 케이스 템플릿', async ({ page }) => {
    // Given
    const expectedValue = '기대값';

    // When
    await page.click('selector');

    // Then
    await expect(page.locator('selector')).toHaveText(expectedValue);
  });
});
```

### 단위 테스트 템플릿

```javascript
// tests/unit/template.test.js
import { describe, it, expect } from 'vitest';
import { functionName } from '../src/app/main/file.js';

describe('functionName', () => {
  it('정상적인 입력을 처리한다', () => {
    const input = 'test input';
    const expected = 'expected output';
    expect(functionName(input)).toBe(expected);
  });

  it('null을 처리한다', () => {
    expect(functionName(null)).toBe('default');
  });

  it('빈 문자열을 처리한다', () => {
    expect(functionName('')).toBe('default');
  });

  it('엣지 케이스를 처리한다', () => {
    expect(functionName('edge case')).toBe('handled');
  });
});
```

---

**보고서 종료**
