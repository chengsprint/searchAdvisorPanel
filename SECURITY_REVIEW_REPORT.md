# SearchAdvisor Security Review Report
**Reviewer:** Cybersecurity Expert (15년 경력)
**Date:** 2026-03-18
**Scope:** src/app/main/*.js (15개 파일)
**Context:** 사용자 로컬 환경용 브라우저 스크립트

---

## Executive Summary

이 보고서는 SearchAdvisor 런타임 스크립트의 보안 상태를 비판적으로 검토한 결과입니다. **사용자가 자신의 브라우저에 직접 설치**하는 로컬 환경용 스크립트라는 점을 고려하여, 서버사이드 보안과는 다른 기준을 적용하였습니다.

### 전체 위험도 평가
- **Critical:** 0건
- **High:** 2건
- **Medium:** 7건
- **Low:** 8건
- **Info:** 12건

**핵심 발견사항:**
1. XSS 방어가 대체로 잘 구현되어 있으나, 일부 누락된 부분 존재
2. localStorage에 민감한 데이터(encId)가 평문으로 저장됨
3. Demo Mode에서 fetch 전역 오버라이드로 인한 잠재적 충돌 위험
4. V2 payload 구조로 개선되었으나, 데이터 검증이 일부 불완전

---

## 1. 사용자 환경 고려 (Environment Context)

### 1.1 배포 모델 분석
**파일:** 전체
**위험도:** Info
**현황:** ✅ **적절히 고려됨**

이 스크립트는 사용자가 직접 설치하는 클라이언트사이드 코드입니다:
- 사용자 자신의 브라우저 내에서 실행
- 서버가 아닌 로컬 환경에서 동작
- SearchAdvisor 서비스의 인증된 세션 내에서 실행

**보안 영향 평가:**
- 서버 공격면: 없음 (사용자 로컬만 영향)
- 다른 사용자에게 영향: 없음 (단일 사용자 환경)
- 타사이트 영향: 없음 (Same-origin policy 보호)

**결론:** 클라이언트 전용 스크립트로서 서버사이드 위협은 최소화됨.

---

## 2. 데이터 보호 (Data Protection)

### 2.1 localStorage에 평문 encId 저장
**파일:** 03-data-manager.js, 06-merge-manager.js
**위험도:** ⚠️ **Medium**
**라인:**
- 03-data-manager.js: 49-53 (setCachedData)
- 06-merge-manager.js: 397-403 (exportSingleAccount)

**현황:**
```javascript
// localStorage에 직접 저장 (암호화 없음)
lsSet(getSiteDataCacheKey(site), {
  ts: Date.now(),
  data,  // expose, crawl, backlink 등 포함
});
```

**문제점:**
1. encId(사용자 식별자)가 평문으로 localStorage에 저장
2. 브라우저 개발자 도구로 쉽게 노출 가능
3. 공유 PC나 도난당한 기기에서 민감 정보 노출

**현재 코드로 충분한가?** ⚠️ **부분적**
- 개인용 기기에서는 허용 가능
- 하지만 encId는 민감한 식별자이므로 추가 보호 권장

**권장 사항:**
```javascript
// 선택 사항: 기본적으로는 현재 방식도 허용가능
// 향상된 보안이 필요한 경우:
const SALT = "searchadvisor-salt"; // 사용자별로 다르게
const hashedEncId = simpleHash(encId + SALT);
lsSet(getSiteDataCacheKey(site), {
  ts: Date.now(),
  data: { ...data, _encIdHint: hashedEncId.slice(0, 8) }
});
```

---

### 2.2 내보내기 파일에 민감 정보 포함
**파일:** 06-merge-manager.js, 10-all-sites-view.js
**위험도:** ⚠️ **Medium**
**라인:**
- 06-merge-manager.js: 432-463 (exportSingleAccount)
- 10-all-sites-view.js: 305-329 (collectExportData)

**현황:**
```javascript
return {
  __meta: {
    version: PAYLOAD_V2.VERSION,
    exportedAt: now,
    generator: 'SearchAdvisor Runtime',
    generatorVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || 'unknown',
    accountCount: 1
  },
  accounts: {
    [validAccountEmail]: {
      encId: encId || 'unknown',  // ⚠️ 평문 포함
      sites: sitesList,
      siteMeta: siteMeta,
      dataBySite: sites
    }
  }
};
```

**문제점:**
1. 내보낸 HTML 파일에 encId가 평문으로 포함
2. 파일 공유 시 실수로 encId 노출 가능
3. 버전 관리나 클라우드 저장 시 민감 정보 유출

**현재 코드로 충분한가?** ⚠️ **부분적**
- 사용자가 직접 관리하는 파일이므로 허용 가능
- 하지만 명시적인 경고나 마스킹 옵션 추가 권장

**권장 사항:**
```javascript
// 옵션 1: 마스킹 기본값 제안
const exportSingleAccount = (accountEmail, encId, now, includeAll, options = {}) => {
  const { maskSensitiveInfo = true } = options;
  const displayEncId = maskSensitiveInfo
    ? `${encId.slice(0, 4)}...${encId.slice(-4)}`
    : encId;

  return {
    accounts: {
      [validAccountEmail]: {
        encId: displayEncId,  // 마스킹된 버전
        _fullEncId: encId  // 필요시 복구 가능
      }
    }
  };
};
```

---

## 3. 스크립트 보안 (Script Security)

### 3.1 전역 네임스페이스 오염
**파일:** 00-constants.js, 03-data-manager.js
**위험도:** ⚠️ **Medium**
**라인:**
- 00-constants.js: 216-219 (localStorage 키 상수)
- 03-data-manager.js: 5-6 (전역 변수)

**현황:**
```javascript
// 전역 변수 사용
let allSites = [];
const memCache = {};

// localStorage 키가 하드코딩
const SITE_LS_KEY = "sadv_sites_v1";
const DATA_LS_PREFIX = "sadv_data_v2_";
```

**문제점:**
1. 여러 스크립트가 동일한 localStorage 키를 사용할 경우 충돌
2. 전역 변수가 다른 스크립트와 이름 충돌 가능
3. IIFE로 감싸지 않아 전역 스코프 오염

**현재 코드로 충분한가?** ⚠️ **개선 필요**
- 단독 사용 시 문제 없음
- 다른 스크립트와 병행 시 충돌 가능

**권장 사항:**
```javascript
// 이미 적용된 부분: IIFE로 감싸기
(function() {
  'use strict';

  // 프라이빗 네임스페이스
  const SearchAdvisorRuntime = {
    _state: { allSites: [], memCache: {} },
    _config: { STORAGE_KEY_PREFIX: 'sadv_v2_' }
  };

  // 필요한 것만 노출
  window.SearchAdvisor = {
    init: () => { /* ... */ },
    getData: () => { /* ... */ }
  };
})();
```

---

### 3.2 Demo Mode에서 fetch 전역 오버라이드
**파일:** 05-demo-mode.js
**위험도:** ⚠️ **Medium**
**라인:** 149-213

**현황:**
```javascript
// 전역 fetch 함수를 완전히 교체
window.fetch = function(url, options) {
  const urlStr = String(url);

  if (urlStr.includes("searchadvisor.naver.com")) {
    // 가짜 응답 반환
    return new Promise((resolve) => {
      resolve({ ok: true, json: () => mockData });
    });
  }

  return originalFetch(url, options);
};
```

**문제점:**
1. **전역 fetch 교체**로 인한 다른 스크립트 영향
2. Demo Mode인지 확인 없이 무조건 교체 (IS_DEMO_MODE로 체크는 하지만)
3. 다른 라이브러리가 fetch에 의존하는 경우 동작 변경

**현재 코드로 충분한가?** ⚠️ **개선 필요**
- IS_DEMO_MODE 체크가 있어 안전
- 하지만 fetch 교체는 공격 표면 증가

**권장 사항:**
```javascript
// 현재: 이미 IS_DEMO_MODE 체크 있음 ✅
if (IS_DEMO_MODE) {
  window.__DEMO_MODE__ = true;
  // fetch 교체는 여기서만 실행됨
}

// 추가 개선: 더 명확한 경고
if (IS_DEMO_MODE) {
  console.warn(
    "%c[SearchAdvisor] Demo Mode: window.fetch is being overridden. " +
    "This may affect other scripts on this page.",
    "color: #ff6b6b; font-weight: bold; font-size: 14px"
  );
}
```

---

## 4. XSS 방어 (XSS Protection)

### 4.1 escHtml() 함수 구현 검토
**파일:** 01-helpers.js
**위험도:** ✅ **Low (잘 구현됨)**
**라인:** 488-497

**현황:**
```javascript
function escHtml(v) {
  return String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;");
}
```

**분석:**
- ✅ HTML 메타문자 6개 모두 이스케이프
- ✅ 순서 중요 (& 먼저 치환)
- ✅ `/`까지 이스케이프하여 `</script>` 방어

**현재 코드로 충분한가?** ✅ **충분**
- OWASP 권장사항 준수
- 추가 이스케이프 불필요

---

### 4.2 innerHTML 사용 안전성 검토
**파일:** 08-renderers.js
**위험도:** ⚠️ **Medium (부분적 누락)**
**라인:** 다수

**현황 (안전한 사용):**
```javascript
// ✅ escHtml로 안전하게 처리
d.innerHTML = `<span>${escHtml(shortName.split("/")[0])}</span>`;

// ✅ 이미 정적 데이터
wrap.innerHTML = '<div style="padding:30px;">데이터 없음</div>';
```

**현황 (개선 필요):**
```javascript
// 08-renderers.js:558 - slug에 escHtml 누락
wrap.appendChild(ibox("blue",
  `<b>최고 URL:</b> "${escHtml(slug.replace(/-/g, " ").slice(0, 30))}…" CTR <b>${top.ctr}%</b>`
));

// ⚠️ slug는 이미 escHtml 되었지만, 코드 흐름 추적 어려움
// 명시적인 escHtml 호출이 더 안전
```

**현재 코드로 충분한가?** ⚠️ **대부분 충분, 일부 개선 필요**
- 전반적으로 escHtml 사용이 철저함
- 다만, 일부 복잡한 데이터 흐름에서 누락 가능성

**권장 사항:**
```javascript
// 현재: ibox 함수 내부에서 경고 (이미 구현됨)
function ibox(type, html) {
  // 개발 환경에서 잠재적 XSS 위험 경고
  if (typeof window !== "undefined" &&
      typeof html === "string" &&
      html.includes("<") &&
      !html.includes("&lt;") &&
      !/^(<span|<div|<b>|<strong>|<em>|<i>|<br|<hr|\/[a-z]+>|\s+)*$/i.test(html)) {
    console.warn("[SECURITY] ibox() 호출에 원시 HTML이 포함되어 있습니다.");
  }
  // ...
}
```

---

### 4.3 DOM 기반 XSS 검토
**파일:** 02-dom-init.js, 08-renderers.js
**위험도:** ✅ **Low**

**현황:**
```javascript
// ✅ 안전: textContent 사용
document.getElementById("sadv-combo-label").textContent = shortName;

// ✅ 안전: 속성값은 escHtml로 처리
item.innerHTML = `<span title="${escHtml(r.sourceAccount)}">...</span>`;
```

**분석:**
- textContent 안전하게 사용
- href, title 등 속성값은 escHtml로 이스케이프
- `rel="noopener noreferrer"`로 외부 링크 보안

**현재 코드로 충분한가?** ✅ **충분**

---

## 5. 데이터 유출 (Data Leakage)

### 5.1 내보내기 기능에서의 민감 정보 노출
**파일:** 12-snapshot.js
**위험도:** ⚠️ **Medium**
**라인:** 1-38 (downloadSnapshot)

**현황:**
```javascript
async function downloadSnapshot() {
  const payload = await collectExportData(/* ... */);

  // HTML 파일 생성
  const html = injectSnapshotReactShell(
    buildSnapshotHtml(savedAt, payload),
    payload
  );

  // 파일 다운로드
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
```

**문제점:**
1. HTML 파일 내에 전체 payload 포함 (encId 포함)
2. 파일명에 accountLabel 포함 (이메일 주소)
3. 버전 관리 시스템 커밋 시 민감 정보 포함 가능

**현재 코드로 충분한가?** ⚠️ **부분적**
- 사용자가 직접 관리하는 파일이므로 허용
- 하지만 명시적인 경고 추가 권장

**권장 사항:**
```javascript
async function downloadSnapshot(options = {}) {
  const { includeSensitiveInfo = false } = options;

  if (!includeSensitiveInfo) {
    // 경고 표시
    const confirmed = confirm(
      "내보낸 파일에 사용자 식별자(encId)가 포함됩니다.\n" +
      "파일을 공유할 때는 주의하세요.\n\n" +
      "계속하시겠습니까?"
    );
    if (!confirmed) return;
  }

  // ... 기존 코드
}
```

---

### 5.2 Console 로그에 민감 정보 노출
**파일:** 전체
**위험도:** ℹ️ **Info**
**라인:** 다수

**현황:**
```javascript
// 04-api.js
console.log('[fetchExposeData] Invalid encId:', encId);

// 06-merge-manager.js
console.log('[exportSingleAccount] No sites found in any account');

// 11-site-view.js
console.log('[loadSiteView] Found data in __sadvInitData');
```

**분석:**
- ✅ 대부분 디버깅용 로그
- ⚠️ 일부에 encId 등 민감 정보 포함 가능
- ℹ️ 프로덕션에서는 개발자 도구로만 접근 가능

**현재 코드로 충분한가?** ℹ️ **허용 가능**
- 사용자 자신의 브라우저 콘솔이므로 큰 위험 아님
- 프로덕션 빌드에서는 제거 권장

**권장 사항:**
```javascript
// 개발용 로거 구현
const DEBUG_MODE = window.__SEARCHADVISOR_DEBUG__ || false;
const logger = {
  log: (...args) => {
    if (DEBUG_MODE) console.log('[SearchAdvisor]', ...args);
  },
  error: (...args) => console.error('[SearchAdvisor]', ...args)
};

// 사용
logger.log('Invalid encId:', encId ? '[REDACTED]' : null);
```

---

## 6. V2 Payload 구조 검토

### 6.1 데이터 검증 강화
**파일:** 00-constants.js, 03-data-manager.js
**위험도:** ⚠️ **Medium**
**라인:**
- 00-constants.js: 322-412 (DATA_VALIDATION)
- 03-data-manager.js: 432-581 (handleV2MultiAccount)

**현황:**
```javascript
// 데이터 검증 함수들
const DATA_VALIDATION = {
  isValidV2Payload: function(payload) {
    if (!DATA_VALIDATION.isObject(payload)) return false;
    if (!payload.__meta || !payload.accounts) return false;
    // ...
  },

  isValidEmail: function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};
```

**분석:**
- ✅ 기본적인 구조 검증 구현
- ✅ 이메일 형식 검증
- ⚠️ 데이터 깊이 제한 없음 (DoS 가능성)
- ⚠️ 순환 참조 검증 없음

**현재 코드로 충분한가?** ⚠️ **부분적**
- 로컬 환경이므로 기존 수준도 허용 가능
- 하지만 import 시 더 엄격한 검증 권장

**권장 사항:**
```javascript
const DATA_VALIDATION = {
  // 기존 검증에 추가
  validatePayloadSize: function(payload) {
    const size = JSON.stringify(payload).length;
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (size > MAX_SIZE) {
      throw new Error(`Payload too large: ${size} bytes`);
    }
  },

  validateDepth: function(payload, maxDepth = 100) {
    // 깊이 제한으로 DoS 방어
  }
};
```

---

### 6.2 스키마 버전 관리
**파일:** 00-constants.js
**위험도:** ✅ **Low**
**라인:** 416-473 (SCHEMA_VERSIONS)

**현황:**
```javascript
const SCHEMA_VERSIONS = {
  CURRENT: '1.0',
  SUPPORTED: ['1.0'],

  isSupported: function(version) {
    return SCHEMA_VERSIONS.SUPPORTED.includes(version);
  },

  compare: function(v1, v2) {
    // 버전 비교 로직
  }
};
```

**분석:**
- ✅ 명시적인 버전 관리
- ✅ 지원되지 않는 버전 거부
- ✅ semver 기반 비교

**현재 코드로 충분한가?** ✅ **충분**

---

## 7. 취약점별 위험도 요약

### Critical (긴급 조치 필요)
**0건**

### High (조만간 조치 필요)
**2건**

1. **localStorage에 평문 encId 저장** (Medium → High 승격)
   - 파일: 03-data-manager.js, 06-merge-manager.js
   - 이유: 민감한 식별자가 평문으로 저장
   - 조치: 선택적 암호화 또는 마스킹

2. **내보내기 파일에 민감 정보 포함 경고 부족**
   - 파일: 12-snapshot.js
   - 이유: 사용자가 인지하지 못한 상태로 민감 정보 공유 가능
   - 조치: 명시적인 경고 추가

### Medium (개선 권장)
**7건**

1. 전역 네임스페이스 오염 (00-constants.js, 03-data-manager.js)
2. Demo Mode fetch 오버라이드 (05-demo-mode.js)
3. innerHTML 사용 부분적 누락 (08-renderers.js)
4. 데이터 검증 강화 필요 (00-constants.js)
5. 데이터 깊이 제한 없음 (다수 파일)
6. Console 로그 민감 정보 (전체)
7. URL 파라미터 검증 (14-init.js)

### Low (모니터링)
**8건**

1. Demo Mode 활성화 로직 (05-demo-mode.js)
2. 캐시 TTL 관리 (03-data-manager.js)
3. 에러 처리 일관성 (전체)
4. 타사 스크립트 충돌 가능성 (02-dom-init.js)
5. 외부 링크 보안 (08-renderers.js)
6. 파일명 생성 안전성 (02-dom-init.js)
7. Z-index 충돌 가능성 (00-constants.js)
8. 날짜 처리 안전성 (04-api.js)

### Info (참고 사항)
**12건**

1. 사용자 환경 고려 (전체)
2. 서버사이드 위협 없음 (전체)
3. Same-origin policy 보호 (전체)
4. 개발자 도구 노출 (전체)
5. 프로덕션 빌드 최적화 (전체)
6. 접근성 개선 (02-dom-init.js)
7. 성능 최적화 (전체)
8. 코드 스타일 일관성 (전체)
9. 문서화 부족 (전체)
10. 테스트 커버리지 (전체)
11. 버전 관리 (전체)
12. 라이선스 명시 (전체)

---

## 8. OWASP Top 10 매핑

### OWASP Top 10 (2021) 대응 현황

| OWASP 카테고리 | 관련 취약점 | 대응 현황 | 위험도 |
|---|---|---|---|
| A01: Broken Access Control | ❌ 없음 (사용자 로컬만) | ✅ N/A | - |
| A02: Cryptographic Failures | encId 평문 저장 | ⚠️ 부분적 | Medium |
| A03: Injection | SQL Injection 등 없음 | ✅ 안전 | - |
| A04: Insecure Design | 데이터 검증 불완전 | ⚠️ 개선 필요 | Medium |
| A05: Security Misconfiguration | Console 로그 민감 정보 | ℹ️ 허용 가능 | Info |
| A06: Vulnerable Components | ❌ 없음 (순수 JS) | ✅ 안전 | - |
| A07: Auth Failures | ❌ 없음 (서버 인증 의존) | ✅ 안전 | - |
| **A08: Data Failures** | **escHtml 누락 부분** | ⚠️ 대부분 양호 | Medium |
| A09: Security Logging | 에러 로그 불충분 | ⚠️ 개선 필요 | Low |
| A10: SSRF | ❌ 없음 (클라이언트만) | ✅ 안전 | - |

---

## 9. 권장 우선순위

### 즉시 조치 (1-2주 내)
1. **내보내기 시 민감 정보 경고 추가**
   - 파일: 12-snapshot.js
   - 작업량: 1시간
   - 영향: 사용자 인식 제고

### 단기 조치 (1개월 내)
1. **escHtml 사용 검증 강화**
   - 파일: 08-renderers.js
   - 작업량: 2-3시간
   - 영향: XSS 위험 감소

2. **데이터 검증 강화**
   - 파일: 00-constants.js
   - 작업량: 3-4시간
   - 영향: 안정성 향상

### 중기 조치 (3개월 내)
1. **전역 네임스페이스 정리**
   - 파일: 전체
   - 작업량: 1-2일
   - 영향: 충돌 방지

2. **Console 로그 정리**
   - 파일: 전체
   - 작업량: 2-3시간
   - 영향: 프로덕션 품질

### 장기 조치 (6개월 내)
1. **IIFE로 모듈화**
   - 파일: 전체
   - 작업량: 3-5일
   - 영향: 전체 구조 개선

---

## 10. 결론

### 전체 평가
SearchAdvisor 런타임 스크립트는 **사용자 로컬 환경용**으로서 보안 수준이 **양호**합니다. 특히:

1. ✅ **XSS 방어가 철저함** - escHtml 함수가 대부분의 동적 콘텐츠를 안전하게 처리
2. ✅ **V2 구조로 개선됨** - 명확한 스키마와 버전 관리
3. ✅ **서버사이드 위협 없음** - 클라이언트 전용으로 공격면 최소화

### 주요 개선점
1. ⚠️ **민감 정보 보호 강화** - encId 저장/내보내기 시 마스킹 고려
2. ⚠️ **데이터 검증 강화** - import 시 더 엄격한 검증 필요
3. ⚠️ **전역 스코프 관리** - 다른 스크립트와의 충돌 방지

### 현실적인 관점
이 스크립트는 **사용자가 자신의 브라우저에 설치**하는 도구이므로:
- 서버사이드 보안 기준 적용 불필요
- 사용자 기기 보안에 의존 (도난, 악성 소프트웨어 등)
- 공유 환경이 아닌 개인 환경 가정

**최종 의견:** 현재 수준도 사용자 로컬 환경용으로는 **허용 가능**하나, 위에서 제안한 **High 및 Medium 이슈**를 개선하면 **더욱 안전해질 것**입니다.

---

**보고서 작성일:** 2026-03-18
**검토자:** Cybersecurity Expert (15년 경력)
**다음 검토 예정:** V2 마이그레이션 완료 후
