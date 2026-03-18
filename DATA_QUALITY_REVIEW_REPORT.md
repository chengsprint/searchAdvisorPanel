# 데이터 품질 리뷰 보고서
## SearchAdvisor V2 - 데이터 엔지니어링 관점

**작성일:** 2026-03-18
**검토 범위:** src/app/main/*.js (15개 파일)
**검토자:** 데이터 엔지니어 (10년 경력)
**관점:** 브라우저 환경 데이터 정확성 및 일관성

---

## 1. 실행 요약 (Executive Summary)

### 전체 평가
- **데이터 품질 점수:** 82/100
- **주요 강점:** V2 스키마 설계, 다중 계정 지원, 데이터 검증 로직
- **주요 취약점:** 레거시 호환성 제거로 인한 데이터 손실 위험, 일관성 검증 부족, 로그/이벤트 데이터 부재

### Critical 리스크 (2건)
1. **V1 레거시 데이터 완전 제거로 인한 데이터 손실** (Critical)
2. **다중 계정 병합 시 데이터 일관성 보장 부족** (Critical)

### High 리스크 (3건)
1. **데이터 검증 함수의 부재한 타입 체크**
2. **localStorage 키 충돌 가능성**
3. **데이터 내보내기 시 불완전한 데이터 포함**

---

## 2. 데이터 리스크 분류 및 해결 방안

### 2.1 Critical 리스크

#### 🔴 CRITICAL-1: V1 레거시 데이터 완전 제거

**위험도:** Critical
**위치:**
- `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/03-data-manager.js` (Line 371-425)
- `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/14-init.js` (Line 3-76)

**문제점:**
```javascript
// 03-data-manager.js Line 386-389
if (exportPayload && !exportPayload.__meta) {
  console.warn('[loadSiteList] Unsupported payload format (missing __meta)');
  return [];  // V1 데이터를 완전히 거부
}
```

**영향:**
- V1 포맷으로 저장된 모든 데이터가 로드되지 않음
- 사용자가 기존 데이터를 완전히 잃을 수 있음
- 롤백이 불가능한 Big Bang Migration

**해결 방안:**
```javascript
// 추천: V1→V2 마이그레이션 함수 추가
function migrateV1ToV2(v1Payload) {
  if (!v1Payload || !v1Payload.savedAt) return null;

  return {
    __meta: {
      version: PAYLOAD_V2.VERSION,
      savedAt: v1Payload.savedAt,
      migratedFrom: 'v1',
      migratedAt: new Date().toISOString()
    },
    accounts: {
      [v1Payload.accountLabel || 'unknown@naver.com']: {
        encId: v1Payload.accountEncId || 'unknown',
        sites: v1Payload.allSites || [],
        siteMeta: v1Payload.siteMeta || {},
        dataBySite: v1Payload.dataBySite || {}
      }
    },
    ui: {
      curMode: v1Payload.curMode || 'all',
      curSite: v1Payload.curSite || null,
      curTab: v1Payload.curTab || 'overview'
    }
  };
}
```

---

#### 🔴 CRITICAL-2: 다중 계정 병합 시 데이터 일관성 보장 부족

**위험도:** Critical
**위치:**
- `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/06-merge-manager.js` (Line 68-161)
- `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/03-data-manager.js` (Line 432-581)

**문제점:**
```javascript
// 06-merge-manager.js Line 104-136
switch (strategy) {
  case 'newer':
    const sourceTime = sourceSiteData.__meta?.__fetched_at ||
                      sourceSiteData._merge?.__fetchedAt || 0;
    const targetTime = targetSiteData.__meta?.__fetched_at ||
                      targetSiteData._merge?.__fetchedAt || 0;
    mergedSiteData = sourceTime > targetTime ? sourceSiteData : targetSiteData;
    // ⚠️ 데이터 충돌 시 일관성 검증 없이 덮어쓰기
    break;
}
```

**영향:**
- 동일 사이트가 여러 계정에 있을 경우 데이터 불일치
- 병합 전략에 따라 데이터 손실 가능
- 사용자가 어느 계정의 데이터를 보고 있는지 명확하지 않음

**해결 방안:**
```javascript
// 추천: 병합 충돌 감지 및 사용자 알림
function mergeAccountsWithValidation(targetData, sourceData, options = {}) {
  const conflicts = detectMergeConflicts(targetData, sourceData);

  if (conflicts.length > 0 && !options.autoResolve) {
    // 사용자에게 충돌 알림
    console.warn('[Merge] Data conflicts detected:', conflicts);
    if (typeof options.onConflict === 'function') {
      return options.onConflict(conflicts, targetData, sourceData);
    }
  }

  // 각 충돌 데이터에 출처 명시
  const merged = mergeAccounts(targetData, sourceData, {
    ...options,
    preserveSources: true  // __sources 배열 유지
  });

  return merged;
}

function detectMergeConflicts(target, source) {
  const conflicts = [];
  for (const [site, sourceData] of Object.entries(source.sites)) {
    if (target.sites[site]) {
      const targetTime = target.sites[site].__meta?.__fetched_at || 0;
      const sourceTime = sourceData.__meta?.__fetched_at || 0;
      const timeDiff = Math.abs(targetTime - sourceTime);

      // 1시간 이내의 데이터 충돌만 감지
      if (timeDiff < 3600000 && timeDiff > 0) {
        conflicts.push({
          site,
          targetTime: new Date(targetTime),
          sourceTime: new Date(sourceTime),
          targetAccount: target.__source_account,
          sourceAccount: source.__source_account
        });
      }
    }
  }
  return conflicts;
}
```

---

### 2.2 High 리스크

#### 🟠 HIGH-1: 데이터 검증 함수의 부재한 타입 체크

**위험도:** High
**위치:** `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/01-helpers.js` (Line 323-411)

**문제점:**
```javascript
// 01-helpers.js Line 343-348
isValidEmail: function(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
  // ⚠️ 공백 문자열, null, undefined에 대한 추가 검증 필요
}
```

**영향:**
- 잘못된 데이터가 메모리에 저장될 수 있음
- 캐시 키 생성 오류 가능성
- UI 렌더링 시 오류 발생

**해결 방안:**
```javascript
// 추천: 강화된 데이터 검증
const DATA_VALIDATION = {
  isValidEmail: function(email) {
    // 타입 + 빈 문자열 검증
    if (typeof email !== 'string' || !email.trim()) return false;

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    // 도메인 유효성 검증 (최소 2글자 TLD)
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    if (domain.split('.').pop().length < 2) return false;

    return true;
  },

  // 새로운 URL 검증 함수 추가
  isValidUrl: function(url) {
    if (typeof url !== 'string' || !url.trim()) return false;

    try {
      const parsed = new URL(url);
      // http/https 프로토콜만 허용
      if (!['http:', 'https:'].includes(parsed.protocol)) return false;
      // 도메인 필수
      if (!parsed.hostname) return false;
      return true;
    } catch (e) {
      return false;
    }
  },

  // 타임스탬프 검증 강화
  isValidTimestamp: function(ts) {
    if (typeof ts !== 'number') return false;

    // 합리적인 범위: 2000년 ~ 현재 + 30일
    const minTimestamp = 946684800000; // 2000-01-01
    const maxTimestamp = Date.now() + (30 * 24 * 60 * 60 * 1000);

    if (ts < minTimestamp || ts > maxTimestamp) return false;

    // 미래 타임스탬프 경고
    if (ts > Date.now()) {
      console.warn('[DATA_VALIDATION] Future timestamp detected:', ts);
    }

    return true;
  }
};
```

---

#### 🟠 HIGH-2: localStorage 키 충돌 가능성

**위험도:** High
**위치:**
- `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/03-data-manager.js` (Line 68-78)
- `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/00-constants.js` (Line 216-219)

**문제점:**
```javascript
// 03-data-manager.js Line 68-78
function getSiteDataCacheKey(site) {
  try {
    const encoded = btoa(encodeURIComponent(site));
    return DATA_LS_PREFIX + getCacheNamespace() + "_" + encoded.replace(/=/g, "");
  } catch (e) {
    // ⚠️ 실패 시 타임스탬프 기반 폴백 키 사용
    return DATA_LS_PREFIX + getCacheNamespace() + "_" + Date.now();
  }
}
```

**영향:**
- 인코딩 실패 시 타임스탬프 키가 중복될 가능성
- 다른 사이트 데이터를 덮어쓰거나 읽을 수 있음
- 네임스페이스 충돌 가능성

**해결 방안:**
```javascript
// 추천: 강화된 캐시 키 생성
function getSiteDataCacheKey(site) {
  if (typeof site !== 'string' || !site.trim()) {
    throw new Error('[getSiteDataCacheKey] Invalid site URL');
  }

  try {
    // 1단계: URL 정규화
    const normalized = normalizeSiteUrl(site);

    // 2단계: 해시 기반 키 생성 (충돌 방지)
    const hash = simpleHash(normalized);

    // 3단계: 네임스페이스 + 해시 조합
    const key = `${DATA_LS_PREFIX}${getCacheNamespace()}_hash_${hash}`;

    // 4단계: 키 길이 제한 확인 (localStorage 제한: ~5MB)
    if (key.length > 100) {
      console.warn('[getSiteDataCacheKey] Key too long, truncating:', key.length);
      return key.substring(0, 100);
    }

    return key;
  } catch (e) {
    console.error('[getSiteDataCacheKey] Fatal error for site:', site, e);
    // 실패해도 타임스탬프 대신 랜덤 UUID 사용
    return `${DATA_LS_PREFIX}${getCacheNamespace()}_err_${crypto.randomUUID()}`;
  }
}

// 간단 해시 함수 (DJB2 알고리즘)
function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash).toString(36);
}
```

---

#### 🟠 HIGH-3: 데이터 내보내기 시 불완전한 데이터 포함

**위험도:** High
**위치:** `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/06-merge-manager.js` (Line 279-464)

**문제점:**
```javascript
// 06-merge-manager.js Line 360-418
for (const key of keysToCheck) {
  if (!key.startsWith(DATA_LS_PREFIX)) continue;

  try {
    const value = localStorage.getItem(key);
    if (!value) continue;

    const data = JSON.parse(value);
    // ⚠️ 데이터 완전성 검증 없이 바로 추가
    sites[site] = { expose: data.expose || null, ... };
  } catch (e) {
    console.error('[Export] Error processing key:', key, e);
    // ⚠️ 손상된 데이터를 건너뛰지만 기록하지 않음
  }
}
```

**영향:**
- 손상된 데이터가 내보내기에 포함될 수 있음
- 복구 시 데이터 무결성 보장 어려움
- 사용자에게 데이터 품질 정보 제공 부족

**해결 방안:**
```javascript
// 추천: 데이터 내보내기 품질 보고서
function exportCurrentAccountData(options = {}) {
  const { includeQualityReport = true } = options;
  const exportData = exportSingleAccount(...);

  if (includeQualityReport) {
    exportData.qualityReport = generateDataQualityReport(exportData);
  }

  return exportData;
}

function generateDataQualityReport(exportData) {
  const report = {
    timestamp: new Date().toISOString(),
    totalSites: 0,
    validSites: 0,
    incompleteSites: 0,
    corruptSites: 0,
    details: []
  };

  for (const [email, account] of Object.entries(exportData.accounts)) {
    report.totalSites += account.sites.length;

    for (const site of account.sites) {
      const siteData = account.dataBySite[site];
      const siteReport = {
        site,
        hasExpose: false,
        hasCrawl: false,
        hasBacklink: false,
        hasDiagnosis: false,
        timestamp: null,
        issues: []
      };

      // 데이터 존재 여부 확인
      if (siteData.expose?.items?.length > 0) {
        siteReport.hasExpose = true;
      } else {
        siteReport.issues.push('expose_missing');
      }

      if (siteData.crawl?.items?.length > 0) {
        siteReport.hasCrawl = true;
      } else {
        siteReport.issues.push('crawl_missing');
      }

      if (siteData.backlink?.items?.length > 0) {
        siteReport.hasBacklink = true;
      } else {
        siteReport.issues.push('backlink_missing');
      }

      if (siteData.diagnosisMeta?.items?.length > 0) {
        siteReport.hasDiagnosis = true;
      } else {
        siteReport.issues.push('diagnosis_missing');
      }

      // 타임스탬프 확인
      const timestamp = siteData.__meta?.__fetched_at ||
                       siteData._merge?.__fetchedAt;
      if (timestamp) {
        siteReport.timestamp = new Date(timestamp);
        // 데이터 신선도 확인 (7일 이내)
        const age = Date.now() - timestamp;
        if (age > 7 * 24 * 60 * 60 * 1000) {
          siteReport.issues.push('stale_data');
        }
      }

      // 데이터 상태 분류
      if (siteReport.issues.length === 0) {
        report.validSites++;
      } else if (siteReport.hasExpose) {
        report.incompleteSites++;
      } else {
        report.corruptSites++;
      }

      report.details.push(siteReport);
    }
  }

  report.quality = report.validSites / report.totalSites;

  return report;
}
```

---

### 2.3 Medium 리스크

#### 🟡 MEDIUM-1: 데이터 TTL 검증 불일치

**위험도:** Medium
**위치:** `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/03-data-manager.js` (Line 37-54)

**문제점:**
```javascript
// TTL 상수
const DATA_TTL = 12 * 60 * 60 * 1000;  // 12시간

// 하지만 UI 상태 캐시는 7일 TTL
function getCachedUiState() {
  const cached = lsGet(getUiStateCacheKey());
  if (cached && Date.now() - cached.ts > 7 * 24 * 60 * 60 * 1000) return null;
  // ⚠️ 데이터와 UI 상태의 TTL이 다름
}
```

**해결 방안:**
```javascript
// 추천: TTL 상수 통합 관리
const TTL_CONFIG = {
  DATA: 12 * 60 * 60 * 1000,        // 12시간
  UI_STATE: 7 * 24 * 60 * 60 * 1000,  // 7일
  MERGE_REGISTRY: 30 * 24 * 60 * 60 * 1000,  // 30일
  DEMO_DATA: 365 * 24 * 60 * 60 * 1000  // 1년
};

// TTL 검증 유틸리티
function isDataExpired(data, ttlMs = TTL_CONFIG.DATA) {
  if (!data) return true;

  const timestamps = [
    data.__cacheSavedAt,
    data.__meta?.__fetched_at,
    data._merge?.__fetchedAt
  ].filter(Boolean);

  if (timestamps.length === 0) return true;

  const latestTimestamp = Math.max(...timestamps);
  return (Date.now() - latestTimestamp) > ttlMs;
}
```

---

#### 🟡 MEDIUM-2: API 응답 데이터 검증 부족

**위험도:** Medium
**위치:** `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/04-api.js` (Line 31-59)

**문제점:**
```javascript
// 04-api.js Line 38-44
const expose = exposeRes.ok ? await exposeRes.json() : null;
return persistSiteData(site, {
  expose: exposeRes.ok ? expose : null,
  exposeFetchState: exposeRes.ok ? "success" : "failure",
  // ⚠️ API 응답 구조 검증 없이 바로 저장
});
```

**해결 방안:**
```javascript
// 추천: API 응답 스키마 검증
function validateExposeApiResponse(response) {
  if (!response) return { valid: false, errors: ['Response is null'] };

  const errors = [];

  // 기본 구조 확인
  if (!response.items || !Array.isArray(response.items)) {
    errors.push('Missing or invalid items array');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const item = response.items[0];
  if (!item) {
    return { valid: true, warnings: ['Empty items array'] };
  }

  // 필수 필드 확인
  const requiredFields = ['period', 'logs'];
  for (const field of requiredFields) {
    if (!item[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // 데이터 형식 확인
  if (item.logs && !Array.isArray(item.logs)) {
    errors.push('logs must be an array');
  }

  // 로그 데이터 검증
  if (item.logs && Array.isArray(item.logs)) {
    for (let i = 0; i < Math.min(3, item.logs.length); i++) {
      const log = item.logs[i];
      if (!log.date || typeof log.clickCount !== 'number') {
        errors.push(`Invalid log data at index ${i}`);
        break;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}

// API 함수에서 사용
async function fetchExposeData(site, options) {
  // ... 기존 코드 ...
  try {
    const exposeFetchedAt = Date.now();
    const exposeRes = await fetchWithRetry(...);
    const expose = exposeRes.ok ? await exposeRes.json() : null;

    // 데이터 검증 추가
    if (exposeRes.ok && expose) {
      const validation = validateExposeApiResponse(expose);
      if (!validation.valid) {
        console.error('[fetchExposeData] Invalid API response:', validation.errors);
        return persistSiteData(site, {
          expose: null,
          exposeFetchState: "failure",
          exposeFetchedAt,
          exposeStatus: exposeRes.status,
          detailLoaded: false,
          validationErrors: validation.errors  // 검증 오류 저장
        });
      }
    }

    return persistSiteData(site, {
      expose: exposeRes.ok ? expose : null,
      exposeFetchState: exposeRes.ok ? "success" : "failure",
      exposeFetchedAt,
      exposeStatus: exposeRes.status,
      detailLoaded: false,
    });
  } catch (e) {
    // ... 에러 처리 ...
  }
}
```

---

### 2.4 Low 리스크

#### 🟢 LOW-1: 데모 모드 데이터 무결성

**위험도:** Low
**위치:** `/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/05-demo-mode.js` (Line 39-456)

**문제점:**
- 데모 모드에서 생성되는 더미 데이터가 실제 API 응답과 구조가 다를 수 있음
- 데모 데이터로 테스트 시 실제 환경과 다른 동작 가능

**해결 방안:**
```javascript
// 추천: 데모 데이터 검증 함수
function validateDemoDataStructure(demoData) {
  // 실제 API 응답 구조와 동일한지 확인
  const structure = {
    expose: { required: ['items'], optional: ['period', 'logs', 'urls', 'querys'] },
    crawl: { required: ['items'], optional: ['stats', 'sitemaps'] },
    backlink: { required: ['items'], optional: ['total', 'domains', 'countTime', 'topDomain'] },
    diagnosisMeta: { required: ['code', 'items'], optional: [] }
  };

  for (const [key, config] of Object.entries(structure)) {
    const data = demoData[key];
    if (!data) {
      console.warn(`[Demo Mode] Missing ${key} data`);
      return false;
    }

    for (const field of config.required) {
      if (!(field in data)) {
        console.warn(`[Demo Mode] Missing required field: ${key}.${field}`);
        return false;
      }
    }
  }

  return true;
}
```

---

#### 🟢 LOW-2: 로그/이벤트 데이터 수집 부족

**위험도:** Low
**위치:** 전체 파일

**문제점:**
- 사용자 동작에 대한 로그/이벤트 데이터 수집이 없음
- 데이터 오류 발생 시 추적 어려움
- A/B 테스트나 사용자 행동 분석 불가능

**해결 방안:**
```javascript
// 추천: 이벤트 로깅 시스템
const DATA_EVENT_LOGGER = {
  // 로그 저장소 (localStorage에 저장)
  storageKey: 'sadv_event_log_v1',
  maxLogs: 1000,  // 최대 1000개 로그 유지
  retentionDays: 30,  // 30일 보관

  // 이벤트 타입
  eventTypes: {
    DATA_FETCH: 'data_fetch',
    DATA_CACHE_HIT: 'data_cache_hit',
    DATA_CACHE_MISS: 'data_cache_miss',
    DATA_VALIDATION_ERROR: 'data_validation_error',
    DATA_MERGE: 'data_merge',
    DATA_EXPORT: 'data_export',
    DATA_IMPORT: 'data_import'
  },

  // 로그 기록
  log: function(type, data) {
    const entry = {
      timestamp: Date.now(),
      type,
      data,
      session: getSessionId()
    };

    try {
      const logs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      logs.push(entry);

      // 로그 제한
      if (logs.length > this.maxLogs) {
        logs.splice(0, logs.length - this.maxLogs);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (e) {
      console.error('[EVENT_LOGGER] Failed to log:', e);
    }
  },

  // 로그 조회
  getLogs: function(filter = {}) {
    try {
      const logs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

      // 필터링
      if (filter.type) {
        return logs.filter(log => log.type === filter.type);
      }

      if (filter.startDate && filter.endDate) {
        return logs.filter(log =>
          log.timestamp >= filter.startDate &&
          log.timestamp <= filter.endDate
        );
      }

      return logs;
    } catch (e) {
      console.error('[EVENT_LOGGER] Failed to get logs:', e);
      return [];
    }
  },

  // 오래된 로그 정리
  cleanup: function() {
    try {
      const logs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const cutoff = Date.now() - (this.retentionDays * 24 * 60 * 60 * 1000);

      const filtered = logs.filter(log => log.timestamp > cutoff);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    } catch (e) {
      console.error('[EVENT_LOGGER] Cleanup failed:', e);
    }
  }
};

// 사용 예시
function persistSiteData(site, data) {
  const next = normalizeSiteData(...);
  memCache[site] = next;
  setCachedData(site, next);

  // 이벤트 로그
  DATA_EVENT_LOGGER.log(DATA_EVENT_LOGGER.eventTypes.DATA_CACHE_WRITE, {
    site,
    hasExpose: !!next.expose,
    hasCrawl: !!next.crawl,
    hasBacklink: !!next.backlink
  });

  return next;
}
```

---

## 3. 데이터 품질 점검 체크리스트

### 3.1 데이터 검증 (Data Validation)

| 항목 | 상태 | 비고 |
|------|------|------|
| 입력 데이터 타입 검증 | ⚠️ 부분 | 일부 함수에서만 수행 |
| 이메일 형식 검증 | ✅ 양호 | 정규표현식 사용 |
| URL 형식 검증 | ❌ 미흡 | 추가 필요 |
| 타임스탬프 범위 검증 | ✅ 양호 | 합리적인 범위 설정 |
| API 응답 스키마 검증 | ❌ 미흡 | 추가 필요 |
| 데이터 완전성 검증 | ⚠️ 부분 | 필수 필드 검증만 |

**권장 사항:**
```javascript
// 통합 데이터 검증 함수
function validateInput(data, schema) {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // 필수 여부 확인
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${field}: Required field is missing`);
      continue;
    }

    // 타입 확인
    if (value !== undefined && value !== null && rules.type) {
      const expectedType = rules.type;
      const actualType = typeof value;

      if (expectedType === 'array' && !Array.isArray(value)) {
        errors.push(`${field}: Expected array, got ${actualType}`);
      } else if (expectedType !== 'array' && actualType !== expectedType) {
        errors.push(`${field}: Expected ${expectedType}, got ${actualType}`);
      }
    }

    // 사용자 정의 검증
    if (rules.validate && !rules.validate(value)) {
      errors.push(`${field}: Custom validation failed`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

---

### 3.2 데이터 일관성 (Data Consistency)

| 항목 | 상태 | 비고 |
|------|------|------|
| 다중 계정 간 데이터 일관성 | ❌ 미흡 | 병합 시 충돌 처리 부족 |
| 캐시와 메모리 데이터 일관성 | ✅ 양호 | normalizeSiteData 사용 |
| UI 상태와 실제 데이터 일관성 | ✅ 양호 | __sadvNotify 사용 |
| sites 배열과 dataBySite 키 일치 | ⚠️ 부분 | 검증 함수 있지만 미사용 |
| 타임스탬프 일관성 | ⚠️ 부분 | 여러 타임스탬프 필드 존재 |

**권장 사항:**
```javascript
// 데이터 일관성 검증 함수
function validateDataConsistency(payload) {
  const issues = [];

  if (payload.__meta && payload.accounts) {
    // V2 포맷 검증
    for (const [email, account] of Object.entries(payload.accounts)) {
      // sites 배열과 dataBySite 키 일치 확인
      const sites = account.sites || [];
      const dataBySite = account.dataBySite || {};

      const sitesSet = new Set(sites);
      const dataKeys = new Set(Object.keys(dataBySite));

      // dataBySite에 없는 사이트
      const missingData = sites.filter(s => !dataKeys.has(s));
      if (missingData.length > 0) {
        issues.push({
          type: 'missing_data',
          account: email,
          sites: missingData
        });
      }

      // sites에 없는 데이터 (orphan 데이터)
      const orphanSites = Object.keys(dataBySite).filter(s => !sitesSet.has(s));
      if (orphanSites.length > 0) {
        issues.push({
          type: 'orphan_data',
          account: email,
          sites: orphanSites
        });
      }

      // 타임스탬프 일관성 확인
      for (const [site, siteData] of Object.entries(dataBySite)) {
        const timestamps = [
          siteData.__meta?.__fetched_at,
          siteData._merge?.__fetchedAt,
          siteData.__cacheSavedAt
        ].filter(Boolean);

        if (timestamps.length > 1) {
          const min = Math.min(...timestamps);
          const max = Math.max(...timestamps);
          if (max - min > 3600000) {  // 1시간 이상 차이
            issues.push({
              type: 'timestamp_inconsistency',
              account: email,
              site,
              timestamps: timestamps.map(t => new Date(t))
            });
          }
        }
      }
    }
  }

  return {
    consistent: issues.length === 0,
    issues
  };
}
```

---

### 3.3 데이터 보존 (Data Preservation)

| 항목 | 상태 | 비고 |
|------|------|------|
| 중요 데이터 손실 방지 | ⚠️ 부분 | V1 데이터 미지원 |
| 데이터 백업 기능 | ✅ 양호 | exportCurrentAccountData 존재 |
| 데이터 복구 기능 | ✅ 양호 | importAccountData 존재 |
| 데이터 암호화 | ❌ 미흡 | 평문 localStorage 저장 |
| 데이터 버전 관리 | ✅ 양호 | V2 스키마 버전 존재 |

**권장 사항:**
```javascript
// 데이터 백업 자동화
const DATA_BACKUP_MANAGER = {
  backupInterval: 24 * 60 * 60 * 1000,  // 24시간
  maxBackups: 5,  // 최대 5개 백업 유지

  // 자동 백업 스케줄링
  scheduleAutoBackup: function() {
    setInterval(() => {
      this.createBackup();
    }, this.backupInterval);
  },

  // 백업 생성
  createBackup: function() {
    try {
      const backup = exportCurrentAccountData({ includeAll: true });
      const timestamp = new Date().toISOString();

      const backups = this.getBackups();
      backups.push({
        timestamp,
        payload: backup,
        size: JSON.stringify(backup).length
      });

      // 백업 제한
      if (backups.length > this.maxBackups) {
        backups.splice(0, backups.length - this.maxBackups);
      }

      localStorage.setItem('sadv_backups', JSON.stringify(backups));
      console.log('[BACKUP] Backup created:', timestamp);
    } catch (e) {
      console.error('[BACKUP] Failed:', e);
    }
  },

  // 백업 목록 조회
  getBackups: function() {
    try {
      return JSON.parse(localStorage.getItem('sadv_backups') || '[]');
    } catch (e) {
      return [];
    }
  },

  // 백업 복구
  restoreFromBackup: function(timestamp) {
    const backups = this.getBackups();
    const backup = backups.find(b => b.timestamp === timestamp);

    if (!backup) {
      throw new Error('Backup not found');
    }

    return importAccountData(backup.payload);
  }
};
```

---

### 3.4 데이터 마이그레이션 (Data Migration)

| 항목 | 상태 | 비고 |
|------|------|------|
| V1 → V2 마이그레이션 | ❌ 미흡 | Big Bang으로 레거시 제거 |
| 마이그레이션 데이터 검증 | ❌ 미흡 | 검증 함수 부족 |
| 롤백 기능 | ❌ 없음 | 되돌릴 수 없음 |
| 마이그레이션 로그 | ❌ 없음 | 기록 없음 |

**권장 사항:**
```javascript
// V1 → V2 마이그레이션 함수
const V1_MIGRATOR = {
  // V1 데이터 감지
  detectV1Data: function() {
    const keys = Object.keys(localStorage);
    return keys.some(key =>
      key.startsWith('sadv_') &&
      !key.includes('_v2_') &&
      !key.includes('snapshot')
    );
  },

  // V1 데이터 백업
  backupV1Data: function() {
    const backup = {};
    const keys = Object.keys(localStorage);

    for (const key of keys) {
      if (key.startsWith('sadv_') && !key.includes('_v2_')) {
        try {
          backup[key] = localStorage.getItem(key);
        } catch (e) {
          console.error('[V1_MIGRATOR] Backup failed for key:', key, e);
        }
      }
    }

    const timestamp = new Date().toISOString();
    localStorage.setItem('sadv_v1_backup_' + timestamp, JSON.stringify(backup));

    return timestamp;
  },

  // V1 → V2 변환
  migrateV1ToV2: function() {
    const migrationLog = {
      startedAt: new Date().toISOString(),
      steps: []
    };

    try {
      // 1단계: V1 데이터 백업
      const backupTimestamp = this.backupV1Data();
      migrationLog.steps.push({
        step: 'backup',
        status: 'success',
        timestamp: backupTimestamp
      });

      // 2단계: V1 데이터 수집
      const v1Data = this.collectV1Data();
      migrationLog.steps.push({
        step: 'collect',
        status: 'success',
        sitesCount: v1Data.allSites?.length || 0
      });

      // 3단계: V2로 변환
      const v2Payload = this.convertToV2(v1Data);
      migrationLog.steps.push({
        step: 'convert',
        status: 'success',
        version: v2Payload.__meta.version
      });

      // 4단계: V2 데이터 저장
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = v2Payload;
      migrationLog.steps.push({
        step: 'save',
        status: 'success'
      });

      migrationLog.status = 'success';
      migrationLog.completedAt = new Date().toISOString();

      // 마이그레이션 로그 저장
      localStorage.setItem('sadv_migration_log', JSON.stringify(migrationLog));

      return v2Payload;
    } catch (e) {
      migrationLog.status = 'failed';
      migrationLog.error = e.message;
      migrationLog.completedAt = new Date().toISOString();

      console.error('[V1_MIGRATOR] Migration failed:', e);

      // 실패 시 로그 저장 후 에러 발생
      localStorage.setItem('sadv_migration_log', JSON.stringify(migrationLog));
      throw e;
    }
  },

  // V1 데이터 수집
  collectV1Data: function() {
    // V1 localStorage 키에서 데이터 수집
    const siteListKey = 'sadv_sites_v1';
    const dataPrefix = 'sadv_data_';

    const siteList = JSON.parse(localStorage.getItem(siteListKey) || '[]');
    const dataBySite = {};

    for (const site of siteList) {
      try {
        const encoded = btoa(encodeURIComponent(site));
        const key = dataPrefix + encoded.replace(/=/g, '');
        const cached = JSON.parse(localStorage.getItem(key));

        if (cached && cached.data) {
          dataBySite[site] = cached.data;
        }
      } catch (e) {
        console.error('[V1_MIGRATOR] Failed to load site:', site, e);
      }
    }

    return {
      savedAt: new Date().toISOString(),
      accountLabel: window.__NUXT__?.state?.authUser?.email || 'unknown@naver.com',
      accountEncId: window.__NUXT__?.state?.authUser?.encId || 'unknown',
      allSites: siteList,
      dataBySite: dataBySite
    };
  },

  // V2로 변환
  convertToV2: function(v1Data) {
    return {
      __meta: {
        version: PAYLOAD_V2.VERSION,
        savedAt: v1Data.savedAt,
        exportedAt: new Date().toISOString(),
        migratedFrom: 'v1',
        migratedAt: new Date().toISOString(),
        accountCount: 1
      },
      accounts: {
        [v1Data.accountLabel]: {
          encId: v1Data.accountEncId,
          sites: v1Data.allSites,
          siteMeta: {},
          dataBySite: v1Data.dataBySite
        }
      },
      ui: {
        curMode: 'all',
        curSite: null,
        curTab: 'overview'
      },
      stats: {
        success: v1Data.allSites.length,
        partial: 0,
        failed: 0,
        errors: []
      }
    };
  }
};
```

---

### 3.5 데이터 내보내기 (Data Export)

| 항목 | 상태 | 비고 |
|------|------|------|
| 사용자 데이터 백업 지원 | ✅ 양호 | HTML + JSON 다운로드 |
| 내보내기 데이터 완전성 | ⚠️ 부분 | 품질 보고서 없음 |
| 내보내기 형식 다양성 | ⚠️ 부분 | HTML만 지원, JSON 없음 |
| 대용량 데이터 처리 | ⚠️ 부분 | 메모리 부족 가능성 |

**권장 사항:**
```javascript
// 데이터 내보내기 기능 강화
const DATA_EXPORT_MANAGER = {
  // 다양한 형식 지원
  formats: {
    HTML: 'html',
    JSON: 'json',
    CSV: 'csv'
  },

  // 내보내기 실행
  export: function(format, options = {}) {
    const data = exportCurrentAccountData(options);

    switch (format) {
      case this.formats.JSON:
        return this.exportAsJson(data);
      case this.formats.CSV:
        return this.exportAsCsv(data);
      case this.formats.HTML:
      default:
        return this.exportAsHtml(data);
    }
  },

  // JSON 내보내기
  exportAsJson: function(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8'
    });

    const timestamp = stampFile(new Date());
    const filename = `searchadvisor-${timestamp}.json`;

    this.download(blob, filename);
  },

  // CSV 내보내기
  exportAsCsv: function(data) {
    const rows = [];

    // 헤더
    rows.push([
      'Site',
      'Clicks',
      'Exposes',
      'CTR',
      'Indexed',
      'Crawled',
      'Backlinks',
      'Last Updated'
    ]);

    // 데이터
    for (const [email, account] of Object.entries(data.accounts)) {
      for (const site of account.sites) {
        const siteData = account.dataBySite[site];
        const exposeItem = siteData.expose?.items?.[0];
        const logs = exposeItem?.logs || [];

        const clicks = logs.reduce((sum, log) => sum + (log.clickCount || 0), 0);
        const exposes = logs.reduce((sum, log) => sum + (log.exposeCount || 0), 0);
        const ctr = exposes > 0 ? ((clicks / exposes) * 100).toFixed(2) : '0.00';

        const diagnosisItem = siteData.diagnosisMeta?.items?.[0];
        const diagnosisLatest = diagnosisItem?.meta?.[diagnosisItem.meta.length - 1];
        const indexed = diagnosisLatest?.stateCount?.['1'] || 0;

        const crawlItem = siteData.crawl?.items?.[0];
        const crawled = crawlItem?.stats?.reduce((sum, stat) => sum + (stat.pageCount || 0), 0) || 0;

        const backlinkItem = siteData.backlink?.items?.[0];
        const backlinks = backlinkItem?.total || 0;

        const timestamp = siteData.__meta?.__fetched_at ||
                         siteData._merge?.__fetchedAt;
        const lastUpdated = timestamp ? new Date(timestamp).toLocaleString() : '-';

        rows.push([
          site,
          clicks,
          exposes,
          ctr,
          indexed,
          crawled,
          backlinks,
          lastUpdated
        ]);
      }
    }

    const csv = rows.map(row =>
      row.map(cell =>
        `"${String(cell).replace(/"/g, '""')}"`
      ).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csv], {  // BOM for Excel
      type: 'text/csv;charset=utf-8'
    });

    const timestamp = stampFile(new Date());
    const filename = `searchadvisor-${timestamp}.csv`;

    this.download(blob, filename);
  },

  // 다운로드 헬퍼
  download: function(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 1000);
  }
};
```

---

### 3.6 데이터 분석 (Data Analytics)

| 항목 | 상태 | 비고 |
|------|------|------|
| 사용자 행동 로그 수집 | ❌ 없음 | 이벤트 트래킹 부족 |
| 데이터 사용 패턴 분석 | ❌ 없음 | 사용 통계 없음 |
| 성능 모니터링 | ⚠️ 부분 | console.log만 존재 |
| 오류 추적 | ⚠️ 부분 | try-catch는 있지만 집계 없음 |

**권장 사항:**
```javascript
// 데이터 분석 시스템
const DATA_ANALYTICS = {
  storageKey: 'sadv_analytics_v1',

  // 이벤트 추적
  track: function(category, action, label, value) {
    const event = {
      timestamp: Date.now(),
      category,
      action,
      label,
      value,
      session: getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    try {
      const events = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      events.push(event);

      // 최대 1000개 이벤트 유지
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(events));
    } catch (e) {
      console.error('[ANALYTICS] Failed to track event:', e);
    }
  },

  // 성능 측정
  measurePerformance: function(operationName, operation) {
    const start = performance.now();

    try {
      const result = operation();
      const duration = performance.now() - start;

      this.track('performance', operationName, 'success', duration);

      return result;
    } catch (e) {
      const duration = performance.now() - start;

      this.track('performance', operationName, 'error', duration);

      throw e;
    }
  },

  // 데이터 사용 통계
  getUsageStats: function() {
    const events = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

    const stats = {
      totalEvents: events.length,
      byCategory: {},
      byAction: {},
      byDay: {},
      errors: 0
    };

    for (const event of events) {
      // 카테고리별 집계
      if (!stats.byCategory[event.category]) {
        stats.byCategory[event.category] = 0;
      }
      stats.byCategory[event.category]++;

      // 액션별 집계
      if (!stats.byAction[event.action]) {
        stats.byAction[event.action] = 0;
      }
      stats.byAction[event.action]++;

      // 날짜별 집계
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!stats.byDay[date]) {
        stats.byDay[date] = 0;
      }
      stats.byDay[date]++;

      // 오류 집계
      if (event.action === 'error') {
        stats.errors++;
      }
    }

    return stats;
  }
};

// 사용 예시
function fetchSiteData(site, options) {
  return DATA_ANALYTICS.measurePerformance('fetchSiteData', () => {
    // ... 기존 코드 ...
  });
}
```

---

## 4. 데이터 마이그레이션 검증 계획

### 4.1 V1 → V2 마이그레이션 검증 체크리스트

#### 사전 검증 (Pre-Migration)

| 항목 | 검증 방법 | 기준 |
|------|-----------|------|
| V1 데이터 백업 존재 | localStorage 확인 | 백업 파일 존재 |
| 백업 무결성 | JSON 파싱 | 파싱 오류 없음 |
| 디스크 공간 | navigator.storage.estimate | 10MB 이상 여유 |
| 브라우저 호환성 | feature detection | 필수 API 지원 |

#### 마이그레이션 중 검증 (During Migration)

| 항목 | 검증 방법 | 기준 |
|------|-----------|------|
| 데이터 변환 정확성 | V1 vs V2 필드 매핑 | 100% 매핑 |
| 데이터 손실 확인 | 레코드 수 비교 | V1 == V2 |
| 타입 변환 확인 | typeof 검증 | 타입 일치 |
| 참조 무결성 | sites vs dataBySite | 모든 키 존재 |

#### 사후 검증 (Post-Migration)

| 항목 | 검증 방법 | 기준 |
|------|-----------|------|
| 기능 동작 확인 | smoke test | 필수 기능 작동 |
| 데이터 렌더링 | 시각적 확인 | UI 정상 표시 |
| 성능 저하 확인 | load time 측정 | 20% 이하 증가 |
| 오류 없음 | console.error 검증 | 0개 |

### 4.2 다중 계정 병합 검증 계획

#### 병합 전 검증

| 항목 | 검증 방법 | 기준 |
|------|-----------|------|
| 계정 데이터 유효성 | validateAccountData | valid: true |
| 중복 사이트 감지 | sites 교집합 | 목록 작성 |
| 데이터 충돌 확인 | timestamp 비교 | 충돌 목록 작성 |
| 병합 전략 유효성 | MERGE_STRATEGIES.isValid | 유효한 전략 |

#### 병합 중 검증

| 항목 | 검증 방법 | 기준 |
|------|-----------|------|
| 데이터 출처 추적 | __sources 배열 존재 | 모든 데이터에 출처 명시 |
| 타임스탬프 보존 | __fetched_at 유지 | 원본 값 유지 |
| 병합 로그 기록 | __merge_info 존재 | 병합 정보 포함 |

#### 병합 후 검증

| 항목 | 검증 방법 | 기준 |
|------|-----------|------|
| 데이터 완전성 | sites.length == dataBySite.keys | 일치 |
| 일관성 검증 | validateDataConsistency | consistent: true |
| UI 표시 확인 | 병합 정보 표시 | mergedMeta 정상 표시 |
| 계정 전환 기능 | switchAccount | 정상 동작 |

---

## 5. 데이터 백업/복구 전략

### 5.1 백업 전략

#### 자동 백업

```javascript
const BACKUP_STRATEGY = {
  // 증분 백업 (매시간)
  incremental: {
    interval: 60 * 60 * 1000,  // 1시간
    retention: 24 * 60 * 60 * 1000,  // 24시간
    maxFiles: 24
  },

  // 전체 백업 (매일)
  full: {
    interval: 24 * 60 * 60 * 1000,  // 24시간
    retention: 30 * 24 * 60 * 60 * 1000,  // 30일
    maxFiles: 30
  },

  // 수동 백업
  manual: {
    retention: 90 * 24 * 60 * 60 * 1000,  // 90일
    maxFiles: 10
  }
};
```

#### 백업 데이터 구조

```javascript
{
  version: "1.0",
  type: "full|incremental|manual",
  timestamp: "2026-03-18T10:00:00Z",
  size: 1234567,  // bytes
  checksum: "sha256:...",
  payload: { /* exportCurrentAccountData() 결과 */ },
  metadata: {
    browser: navigator.userAgent,
    url: window.location.href,
    accountCount: 3,
    siteCount: 15
  }
}
```

### 5.2 복구 전략

#### 복구 우선순위

1. **Critical:** 최신 전체 백업
2. **High:** 24시간 이내 증분 백업
3. **Medium:** 수동 백업
4. **Low:** 오래된 백업

#### 복구 절차

```javascript
const RECOVERY_PROCEDURE = {
  // 1단계: 백업 목록 조회
  listBackups: function() {
    const backups = JSON.parse(localStorage.getItem('sadv_backups') || '[]');
    return backups.sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  },

  // 2단계: 백업 검증
  validateBackup: function(backup) {
    // 체크섬 확인
    if (backup.checksum) {
      const computed = computeChecksum(backup.payload);
      if (computed !== backup.checksum) {
        throw new Error('Checksum mismatch');
      }
    }

    // 데이터 구조 검증
    const validation = validateV2Payload(backup.payload);
    if (!validation.valid) {
      throw new Error('Invalid payload: ' + validation.errors.join(', '));
    }

    return true;
  },

  // 3단계: 복구 실행
  restore: function(backupTimestamp) {
    const backups = this.listBackups();
    const backup = backups.find(b => b.timestamp === backupTimestamp);

    if (!backup) {
      throw new Error('Backup not found');
    }

    // 백업 검증
    this.validateBackup(backup);

    // 현재 데이터 백업
    const currentBackup = exportCurrentAccountData({ includeAll: true });
    const emergencyBackup = {
      timestamp: new Date().toISOString(),
      type: 'emergency',
      payload: currentBackup
    };

    try {
      // 복구 실행
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = backup.payload;

      // 성공 로그
      console.log('[RECOVERY] Successfully restored from:', backupTimestamp);

      return {
        success: true,
        backup: backup,
        emergencyBackup: emergencyBackup
      };
    } catch (e) {
      // 실패 시 긴급 복구
      window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = emergencyBackup.payload;

      throw new Error('Recovery failed, rolled back: ' + e.message);
    }
  }
};
```

---

## 6. 최종 권장 사항

### 6.1 즉시 조치 (Immediate Actions)

1. **V1 → V2 마이그레이션 기능 구현** (Critical)
   - `V1_MIGRATOR` 모듈 추가
   - 마이그레이션 전 자동 백업
   - 롤백 기능 제공

2. **다중 계정 병합 충돌 감지** (Critical)
   - `detectMergeConflicts` 함수 추가
   - 사용자에게 충돌 알림
   - 병합 전략 선택 UI 제공

3. **데이터 검증 강화** (High)
   - API 응답 스키마 검증
   - URL 형식 검증 추가
   - 입력 데이터 타입 검증

### 6.2 단계적 개선 (Phased Improvements)

**Phase 1 (1-2주):**
- 데이터 검증 함수 완성
- 이벤트 로깅 시스템 추가
- 백업/복구 기능 강화

**Phase 2 (3-4주):**
- 데이터 분석 시스템 구축
- 내보내기 형식 다양화 (JSON, CSV)
- 성능 모니터링 대시보드

**Phase 3 (1-2개월):**
- A/B 테스트 프레임워크
- 사용자 행동 분석
- 데이터 품질 대시보드

### 6.3 모니터링 지표 (Monitoring Metrics)

| 지표 | 현재 | 목표 | 측정 방법 |
|------|------|------|-----------|
| 데이터 로딩 성공률 | Unknown | 99.9% | event logs |
| 캐시 적중률 | Unknown | 80% | performance API |
| 평균 데이터 로딩 시간 | Unknown | <2s | performance API |
| 데이터 검증 실패율 | Unknown | <0.1% | validation logs |
| 병합 충돌 발생률 | Unknown | <5% | merge logs |

---

## 7. 결론

SearchAdvisor V2의 데이터 품질은 전반적으로 **양호한 상태**이나, 몇 가지 **치명적인 리스크**가 존재합니다.

### 주요 문제점
1. V1 레거시 데이터 지원 완전 제거로 인한 데이터 손실 위험
2. 다중 계정 병합 시 데이터 일관성 보장 부족
3. 데이터 검증 기능의 불완전한 구현

### 강점
1. V2 스키마 설계가 잘 되어 있음
2. 다중 계정 지원을 위한 기반 구축
3. 캐시 및 데이터 관리 로직이 체계적

### 우선순위
1. **즉시:** V1 마이그레이션 기능 추가 (Critical)
2. **즉시:** 병합 충돌 감지 기능 추가 (Critical)
3. **1주 이내:** 데이터 검증 강화 (High)
4. **1개월 이내:** 이벤트 로깅 및 분석 시스템 (Medium)

데이터 엔지니어링 관점에서, **데이터 정확성과 일관성**을 최우선으로 개선할 것을 권장합니다. 브라우저 환경이므로 대용량 처리보다는 **데이터 무결성**에 집중해야 합니다.

---

**보고서 종료**
