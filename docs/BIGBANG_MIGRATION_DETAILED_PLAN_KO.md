# SearchAdvisor v2 빅뱅 마이그레이션 상세 실행 계획

> **작성일**: 2026-03-18
> **전략**: 빅뱅 마이그레이션 (단일 커밋 전체 교체)
> **상태**: 개발 중 (사용자: 1명, 배포 없음)
> **목표**: JSON 스키마 v2로 완전히 전환

---

## 📋 개요

### 전제 조건
- ✅ 개발 단계 (배포 없음)
- ✅ 단일 사용자 (데이터 손실 위험 최소화)
- ✅ 구조 자유로운 변경 가능
- ✅ 네이버 API 엔드포인트 불변

### 목표 스키마

```json
{
  "__meta": {
    "version": "20260318-payload-contract-v2",
    "savedAt": "2026-03-18T14:30:00.000Z",
    "accountCount": 1
  },
  "accounts": {
    "user1@naver.com": {
      "encId": "abc12345",
      "sites": ["https://site1.com", "https://site2.com"],
      "siteMeta": {
        "https://site1.com": {
          "label": "내 블로그",
          "displayLabel": "내 블로그",
          "shortName": "myblog"
        }
      },
      "dataBySite": {
        "https://site1.com": {
          "expose": { "items": [...] },
          "crawl": { "items": [...] },
          "backlink": { "items": [...] },
          "__cacheSavedAt": 1742292800000,
          "detailLoaded": true
        }
      }
    }
  },
  "ui": {
    "curMode": "all",
    "curSite": "https://site1.com",
    "curTab": "overview"
  },
  "stats": {
    "success": 2,
    "partial": 0,
    "failed": 0,
    "errors": []
  }
}
```

---

## 🎯 실행 원칙

### 1. 원자적 커밋 (Atomic Commit)
- 모든 변경을 **단일 커밋**으로 완료
- 중간 상태에서의 실행 불가 상태 방지
- Git 태그로 v1/v2 경계 명확히 구분

### 2. 상수 우선 정의
- 모든 상수를 코드 상단에 정의
- 파일 간 일관성 보장
- 테스트 코드와 동일한 상수 사용

### 3. 타임스탬프 기반 병합
- 항상 최신 데이터 보존
- `__cacheSavedAt` 필드 활용
- 충돌 시 명확한 우선순위

### 4. 방어적 코딩
- null/undefined 체크
- 기본값 제공
- 에러 메시지 구체화

---

## 📁 파일별 변경 계획

### Phase 1: 상수 및 헬퍼 함수 정의

#### 파일 1.1: `/src/app/main/00-constants.js`

**추가할 상수:**

```javascript
// ============================================================
// V2 PAYLOAD CONSTANTS
// ============================================================

const PAYLOAD_V2 = {
  VERSION: "20260318-payload-contract-v2",
  DATA_FORMAT: "sadv_snapshot_v2",
  GENERATOR: "SearchAdvisor Runtime",
};

// 필드명 상수
const PAYLOAD_FIELDS = {
  // 최상위
  META: "__meta",
  ACCOUNTS: "accounts",
  UI: "ui",
  STATS: "stats",
  SUMMARY: "_summary",

  // __meta 내부
  VERSION: "version",
  SAVED_AT: "savedAt",
  ACCOUNT_COUNT: "accountCount",
  TOTAL_SITES: "totalSites",

  // accounts.{email} 내부
  ENC_ID: "encId",
  SITES: "sites",
  SITE_META: "siteMeta",
  DATA_BY_SITE: "dataBySite",

  // siteMeta 내부
  LABEL: "label",
  DISPLAY_LABEL: "displayLabel",
  SHORT_NAME: "shortName",

  // UI 내부
  CUR_MODE: "curMode",
  CUR_SITE: "curSite",
  CUR_TAB: "curTab",
};

// 기본값
const PAYLOAD_DEFAULTS = {
  MODE: "all",
  TAB: "overview",
  ACCOUNT_EMAIL: "unknown@naver.com",
  ENC_ID: "unknown",
};
```

**추가 위치:** 파일 하단 (기존 상수 정의 후)

---

#### 파일 1.2: `/src/app/main/01-helpers.js`

**추가할 헬퍼 함수:**

```javascript
// ============================================================
// V2 PAYLOAD HELPERS
// ============================================================

/**
 * V2 페이로드인지 확인
 */
function isV2Payload(payload) {
  return payload &&
         payload[PAYLOAD_FIELDS.META] &&
         payload[PAYLOAD_FIELDS.META][PAYLOAD_FIELDS.VERSION] === PAYLOAD_V2.VERSION;
}

/**
 * 페이로드의 계정 수 반환
 */
function getAccountCount(payload) {
  if (!payload) return 0;
  if (isV2Payload(payload)) {
    return payload[PAYLOAD_FIELDS.META]?.[PAYLOAD_FIELDS.ACCOUNT_COUNT] || 0;
  }
  return 1; // v1은 항상 단일 계정
}

/**
 * 전체 사이트 목록 반환 (중복 제거, 정렬)
 */
function getAllSites(payload) {
  if (!payload) return [];

  if (isV2Payload(payload)) {
    const sites = new Set();
    const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || {};
    for (const account of Object.values(accounts)) {
      const accountSites = account[PAYLOAD_FIELDS.SITES] || [];
      for (const site of accountSites) {
        sites.add(site);
      }
    }
    return Array.from(sites).sort();
  }

  // v1 레거시 (이 단계에서는 이미 없어야 함)
  return payload.allSites || [];
}

/**
 * 특정 사이트가 속한 계정 찾기
 */
function getAccountForSite(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  if (isV2Payload(payload)) {
    const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || {};
    for (const [email, account] of Object.entries(accounts)) {
      const sites = account[PAYLOAD_FIELDS.SITES] || [];
      if (sites.includes(siteUrl)) {
        return { email, account };
      }
    }
  }
  return null;
}

/**
 * 특정 사이트의 데이터 반환
 */
function getSiteData(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  if (isV2Payload(payload)) {
    const result = getAccountForSite(siteUrl, payload);
    if (result) {
      return result.account[PAYLOAD_FIELDS.DATA_BY_SITE]?.[siteUrl] || null;
    }
  }
  return null;
}

/**
 * 특정 사이트의 메타데이터 반환
 */
function getSiteMeta(siteUrl, payload) {
  if (!payload || !siteUrl) return null;

  if (isV2Payload(payload)) {
    const result = getAccountForSite(siteUrl, payload);
    if (result) {
      return result.account[PAYLOAD_FIELDS.SITE_META]?.[siteUrl] || null;
    }
  }
  return null;
}

/**
 * 사이트 라벨 반환
 */
function getSiteLabel(siteUrl, payload) {
  if (!siteUrl) return "사이트 선택";

  const meta = getSiteMeta(siteUrl, payload);
  if (meta) {
    return (
      meta[PAYLOAD_FIELDS.LABEL] ||
      meta[PAYLOAD_FIELDS.DISPLAY_LABEL] ||
      meta[PAYLOAD_FIELDS.SHORT_NAME] ||
      siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    );
  }
  return siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * 이메일에서 짧은 라벨 추출
 */
function getShortLabel(email) {
  if (!email) return "unknown";
  return email.split("@")[0];
}

/**
 * 전체 계정 목록 반환
 */
function getAllAccounts(payload) {
  if (!payload) return [];
  if (isV2Payload(payload)) {
    return Object.keys(payload[PAYLOAD_FIELDS.ACCOUNTS] || {});
  }
  // v1: accountLabel에서 추출
  return [payload.accountLabel || PAYLOAD_DEFAULTS.ACCOUNT_EMAIL];
}

/**
 * 사이트 → 계정 역인덱스 생성 (캐싱용)
 */
function buildSiteToAccountIndex(payload) {
  const index = {};
  if (!payload) return index;

  if (isV2Payload(payload)) {
    const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || {};
    for (const [email, account] of Object.entries(accounts)) {
      const sites = account[PAYLOAD_FIELDS.SITES] || [];
      for (const site of sites) {
        if (!index[site]) {
          index[site] = [];
        }
        if (!index[site].includes(email)) {
          index[site].push(email);
        }
      }
    }
  }
  return index;
}

/**
 * 타임스탬프 비교 (최신 데이터 선택용)
 */
function compareTimestamps(a, b) {
  const tsA = a?.__cacheSavedAt || a?.fetchedAt || 0;
  const tsB = b?.__cacheSavedAt || b?.fetchedAt || 0;
  return tsB - tsA; // 양수: b가 더 최신
}

/**
 * siteMeta 병합 (최신 우선)
 */
function mergeSiteMeta(existing, incoming) {
  if (!existing) return incoming;
  if (!incoming) return existing;

  return {
    [PAYLOAD_FIELDS.LABEL]: incoming[PAYLOAD_FIELDS.LABEL] || existing[PAYLOAD_FIELDS.LABEL] || "",
    [PAYLOAD_FIELDS.DISPLAY_LABEL]: incoming[PAYLOAD_FIELDS.DISPLAY_LABEL] || existing[PAYLOAD_FIELDS.DISPLAY_LABEL] || "",
    [PAYLOAD_FIELDS.SHORT_NAME]: incoming[PAYLOAD_FIELDS.SHORT_NAME] || existing[PAYLOAD_FIELDS.SHORT_NAME] || "",
  };
}
```

---

### Phase 2: 데이터 수집 및 내보내기 변경

#### 파일 2.1: `/src/app/main/10-all-sites-view.js`

**변경 2.1-1: `collectExportData()` 함수 (라인 231-312 전체 교체)**

```javascript
async function collectExportData(onProgress, options) {
  // ============================================================
  // V2: 계정 정보 수집
  // ============================================================

  const email = accountLabel || PAYLOAD_DEFAULTS.ACCOUNT_EMAIL;
  const encIdValue = encId || PAYLOAD_DEFAULTS.ENC_ID;

  // ============================================================
  // V2: 데이터 수집 (기존 로직 유지, 구조만 변경)
  // ============================================================

  const dataBySite = {};
  const summaryRows = [];
  const batchSize = FULL_REFRESH_BATCH_SIZE;
  const refreshMode = options && options.refreshMode === "refresh" ? "refresh" : "cache-first";

  await ensureExportSiteList(refreshMode);
  const total = allSites.length;
  let done = 0;
  const stats = { success: 0, partial: 0, failed: 0, errors: [] };

  for (let i = 0; i < allSites.length; i += batchSize) {
    const batch = allSites.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(function (site) {
        return resolveExportSiteData(site, { refreshMode });
      }),
    );

    results.forEach(function (res, idx) {
      const site = batch[idx];
      let siteData;

      if (res.status === "fulfilled") {
        siteData = normalizeSiteData(res.value);
        const hasExpose = siteData && siteData.expose != null;
        const hasDetail = siteData && siteData.detailLoaded === true;

        if (hasExpose && hasDetail) {
          stats.success++;
        } else if (hasExpose) {
          stats.partial++;
        } else {
          stats.failed++;
          if (res.reason && res.reason.message) {
            stats.errors.push({ site, error: res.reason.message.slice(0, 100) });
          } else {
            stats.errors.push({ site, error: "expose data missing" });
          }
        }
      } else {
        siteData = { expose: null, crawl: null, backlink: null, detailLoaded: false };
        stats.failed++;
        if (res.reason && res.reason.message) {
          stats.errors.push({ site, error: res.reason.message.slice(0, 100) });
        } else {
          stats.errors.push({ site, error: "request rejected" });
        }
      }

      // V2: 데이터에 소스 정보 추가
      dataBySite[site] = {
        ...siteData,
        __source: {
          accountEmail: email,
          accountEncId: encIdValue,
          fetchedAt: siteData.__cacheSavedAt || Date.now(),
          exportedAt: new Date().toISOString(),
        }
      };

      summaryRows.push(buildSiteSummaryRow(site, siteData));
      done++;
      if (onProgress) onProgress(done, total, site, stats);
    });

    if (refreshMode === "refresh" && i + batchSize < allSites.length) {
      const jitter = Math.floor(Math.random() * FULL_REFRESH_JITTER_MS);
      await new Promise(function (resolve) {
        setTimeout(resolve, FULL_REFRESH_SITE_DELAY_MS + jitter);
      });
    }
  }

  summaryRows.sort((a, b) => b.totalC - a.totalC);

  // ============================================================
  // V2: 새로운 구조로 반환
  // ============================================================

  const now = new Date();

  return {
    // __meta
    [PAYLOAD_FIELDS.META]: {
      [PAYLOAD_FIELDS.VERSION]: PAYLOAD_V2.VERSION,
      [PAYLOAD_FIELDS.SAVED_AT]: savedAtIsoV2(now),
      [PAYLOAD_FIELDS.ACCOUNT_COUNT]: 1,
      [PAYLOAD_FIELDS.TOTAL_SITES]: allSites.length,
    },

    // accounts
    [PAYLOAD_FIELDS.ACCOUNTS]: {
      [email]: {
        [PAYLOAD_FIELDS.ENC_ID]: encIdValue,
        [PAYLOAD_FIELDS.SITES]: [...allSites],
        [PAYLOAD_FIELDS.SITE_META]: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
        [PAYLOAD_FIELDS.DATA_BY_SITE]: dataBySite,
      }
    },

    // ui
    [PAYLOAD_FIELDS.UI]: {
      [PAYLOAD_FIELDS.CUR_MODE]: curMode || PAYLOAD_DEFAULTS.MODE,
      [PAYLOAD_FIELDS.CUR_SITE]: curSite || null,
      [PAYLOAD_FIELDS.CUR_TAB]: curTab || PAYLOAD_DEFAULTS.TAB,
    },

    // stats
    [PAYLOAD_FIELDS.STATS]: stats,
  };
}

/**
 * V2: ISO 8601 형식으로 변환 (밀리초 + Timezone 포함)
 */
function savedAtIsoV2(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds()) +
    "." +
    String(d.getMilliseconds()).padStart(3, '0') +
    "Z"
  );
}
```

**변경 2.1-2: `renderAllSites()` 함수 (라인 5-229)**

```javascript
// 라인 97-100 변경 (병합 메타 확인)
const mergedMeta = typeof getMergedMetaState === "function" ? getMergedMetaState() : null;
const isMerged = mergedMeta && mergedMeta.accounts && mergedMeta.accounts.length > 1;

if (isMerged && mergedMeta && mergedMeta.accounts) {
  wrap.appendChild(createMergedAccountsInfo(mergedMeta));
}

// 라인 142-146 변경 (sourceAccount 표시)
// V2: getAccountForSite() 활용
const accountResult = isMerged ? getAccountForSite(r.site, window.__sadvMergedPayload || EXPORT_PAYLOAD) : null;
const sourceBadge = accountResult
  ? `<span style="font-size:10px;color:#64748b;background:#1e293b;padding:2px 6px;border-radius:4px;margin-left:8px;white-space:nowrap;border:1px solid #334155" title="${escHtml(accountResult.email)}">${escHtml(getShortLabel(accountResult.email))}</span>`
  : "";
```

---

#### 파일 2.2: `/src/app/main/06-merge-manager.js`

**변경 2.2-1: `exportCurrentAccountData()` 함수**

```javascript
function exportCurrentAccountData() {
  // ============================================================
  // V2: 계정 정보 추출
  // ============================================================

  const email = accountLabel || PAYLOAD_DEFAULTS.ACCOUNT_EMAIL;
  const encIdValue = getCurrentEncId() || PAYLOAD_DEFAULTS.ENC_ID;

  // 사이트 데이터 수집 (기존 방식)
  const allSitesList = getAllSitesList();
  const siteMetaMap = getSiteMetaMap() || {};
  const dataBySite = {};

  for (const site of allSitesList) {
    const cached = getCachedSiteData(site);
    dataBySite[site] = cached || {
      expose: null,
      crawl: null,
      backlink: null,
      diagnosisMeta: null,
      diagnosisMetaRange: null,
      detailLoaded: false
    };
  }

  const now = new Date();

  // ============================================================
  // V2: 새로운 구조로 반환
  // ============================================================

  return {
    [PAYLOAD_FIELDS.META]: {
      [PAYLOAD_FIELDS.VERSION]: PAYLOAD_V2.VERSION,
      [PAYLOAD_FIELDS.SAVED_AT]: savedAtIsoV2(now),
      [PAYLOAD_FIELDS.ACCOUNT_COUNT]: 1,
      [PAYLOAD_FIELDS.TOTAL_SITES]: allSitesList.length,
    },

    [PAYLOAD_FIELDS.ACCOUNTS]: {
      [email]: {
        [PAYLOAD_FIELDS.ENC_ID]: encIdValue,
        [PAYLOAD_FIELDS.SITES]: allSitesList,
        [PAYLOAD_FIELDS.SITE_META]: siteMetaMap,
        [PAYLOAD_FIELDS.DATA_BY_SITE]: dataBySite,
      }
    },

    [PAYLOAD_FIELDS.UI]: {
      [PAYLOAD_FIELDS.CUR_MODE]: getCurMode() || PAYLOAD_DEFAULTS.MODE,
      [PAYLOAD_FIELDS.CUR_SITE]: getCurSite() || null,
      [PAYLOAD_FIELDS.CUR_TAB]: getCurTab() || PAYLOAD_DEFAULTS.TAB,
    },

    [PAYLOAD_FIELDS.STATS]: {
      success: allSitesList.filter(s => dataBySite[s]?.expose).length,
      partial: 0,
      failed: allSitesList.filter(s => !dataBySite[s]?.expose).length,
      errors: []
    }
  };
}
```

**변경 2.2-2: `importAccountData()` 함수**

```javascript
function importAccountData(exportedData) {
  // ============================================================
  // V2: 데이터 구조 감지 및 변환
  // ============================================================

  // 이미 v2인 경우
  if (exportedData[PAYLOAD_FIELDS.ACCOUNTS]) {
    const accounts = exportedData[PAYLOAD_FIELDS.ACCOUNTS] || {};
    const newAccounts = [];

    for (const [email, accountData] of Object.entries(accounts)) {
      const sites = accountData[PAYLOAD_FIELDS.SITES] || [];
      const siteMeta = accountData[PAYLOAD_FIELDS.SITE_META] || {};
      const dataBySite = accountData[PAYLOAD_FIELDS.DATA_BY_SITE] || {};

      newAccounts.push({
        email,
        encId: accountData[PAYLOAD_FIELDS.ENC_ID] || "",
        sites,
        siteMeta,
        dataBySite
      });
    }

    return {
      accounts: newAccounts,
      totalSites: newAccounts.reduce((sum, acc) => sum + acc.sites.length, 0)
    };
  }

  // v1 레거시 (이 단계에서는 없어야 하지만 방어적으로 처리)
  console.warn("[importAccountData] 레거시 v1 포맷 감지, v2로 변환");
  return migrateV1ToV2Wrapper(exportedData);
}

/**
 * v1을 v2로 래핑 (방어적)
 */
function migrateV1ToV2Wrapper(v1Data) {
  const email = v1Data.accountLabel || v1Data.__source_account || PAYLOAD_DEFAULTS.ACCOUNT_EMAIL;
  const encIdValue = v1Data.accountEncId || v1Data.__source_enc_id || PAYLOAD_DEFAULTS.ENC_ID;

  return {
    accounts: [{
      email,
      encId: encIdValue,
      sites: v1Data.allSites || [],
      siteMeta: v1Data.siteMeta || {},
      dataBySite: v1Data.dataBySite || {}
    }],
    totalSites: (v1Data.allSites || []).length
  };
}
```

---

### Phase 3: 스냅샷 처리 변경

#### 파일 3.1: `/src/app/main/12-snapshot.js`

**변경 3.1-1: `buildSnapshotHtml()` 함수의 페이로드 주입 부분 (라인 227)**

```javascript
// 기존
const html = `<!doctype html>
<html>
<body>
  <script>
    const EXPORT_PAYLOAD = ${JSON.stringify(payload)};
    // ...
</body>
</html>`;

// 변경 후
const html = `<!doctype html>
<html>
<body>
  <script>
    // V2: 페이로드 버전 명시
    const EXPORT_PAYLOAD = ${JSON.stringify(payload)};
    const EXPORT_PAYLOAD_VERSION = "${PAYLOAD_V2.VERSION}";

    // V2: 역인덱스 초기화 (성능 최적화)
    const EXPORT_SITE_TO_ACCOUNT_INDEX = (function() {
      const index = {};
      if (EXPORT_PAYLOAD.${PAYLOAD_FIELDS.ACCOUNTS}) {
        for (const [email, account] of Object.entries(EXPORT_PAYLOAD.${PAYLOAD_FIELDS.ACCOUNTS})) {
          const sites = account.${PAYLOAD_FIELDS.SITES} || [];
          for (const site of sites) {
            if (!index[site]) index[site] = [];
            if (!index[site].includes(email)) index[site].push(email);
          }
        }
      }
      return index;
    })();

    // V2: 헬퍼 함수 내장
    ${getAllSites.toString()}
    ${getAccountForSite.toString()}
    ${getSiteData.toString()}
    ${getSiteMeta.toString()}
    ${getSiteLabel.toString()}
    ${getShortLabel.toString()}
    ${buildSiteToAccountIndex.toString()}
    ${isV2Payload.toString()}
    ${getAccountCount.toString()}
    ${compareTimestamps.toString()}

    // 레거시 호환성을 위한 전역 변수
    var allSites = getAllSites(EXPORT_PAYLOAD);
    var siteToAccountIndex = EXPORT_SITE_TO_ACCOUNT_INDEX;

    // PAYLOAD_CONTRACT 업데이트
    window.__SEARCHADVISOR_PAYLOAD_CONTRACT__ = {
      version: "${PAYLOAD_V2.VERSION}",
      mode: "saved-html",
      isV2Payload,
      getAccountCount,
      getAllSites,
      getAccountForSite,
      getSiteData,
      getSiteMeta,
      getSiteLabel,
      getShortLabel,
      buildSiteToAccountIndex,
      compareTimestamps,
    };
  <\/script>
</body>
</html>`;
```

**변경 3.1-2: `buildSnapshotShellState()` 함수 (라인 39-93)**

```javascript
function buildSnapshotShellState(payload) {
  // V2: 페이로드 구조 확인
  const isV2 = isV2Payload(payload);

  // V2: 전체 사이트 목록 가져오기
  const allSites = isV2 ? getAllSites(payload) : (payload.allSites || []);

  const snapshotTabIds = [
    "overview", "daily", "queries", "pages", "crawl", "backlink", "diagnosis", "insight",
  ];

  // 캐시 저장 시간 추출
  const cacheSavedAtValues = allSites
    .map(function (site) {
      if (isV2) {
        const data = getSiteData(site, payload);
        return data?.__cacheSavedAt || data?.expose?.__cacheSavedAt || null;
      } else {
        const data = payload.dataBySite && payload.dataBySite[site];
        return data && typeof data.__cacheSavedAt === "number"
          ? data.__cacheSavedAt
          : null;
      }
    })
    .filter(function (value) {
      return typeof value === "number";
    });

  const savedAtValue =
    (isV2 ? payload[PAYLOAD_FIELDS.META]?.[PAYLOAD_FIELDS.SAVED_AT] : payload.savedAt) &&
    !Number.isNaN(new Date(isV2 ? payload[PAYLOAD_FIELDS.META]?.[PAYLOAD_FIELDS.SAVED_AT] : payload.savedAt).getTime())
      ? new Date(isV2 ? payload[PAYLOAD_FIELDS.META]?.[PAYLOAD_FIELDS.SAVED_AT] : payload.savedAt)
      : null;

  const updatedAt = cacheSavedAtValues.length
    ? new Date(Math.max.apply(null, cacheSavedAtValues))
    : savedAtValue;

  // V2: 계정 정보 추출
  let accountLabel = "unknown";
  if (isV2) {
    const accounts = getAllAccounts(payload);
    accountLabel = accounts.length > 1
      ? `병합 (${accounts.length}개)`
      : getShortLabel(accounts[0] || "unknown");
  } else {
    accountLabel = payload.accountLabel || "unknown";
  }

  // V2: siteMeta 통합
  let siteMeta = {};
  if (isV2) {
    const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || {};
    for (const account of Object.values(accounts)) {
      const meta = account[PAYLOAD_FIELDS.SITE_META] || {};
      siteMeta = { ...siteMeta, ...meta };
    }
  } else {
    siteMeta = payload.siteMeta || {};
  }

  return {
    accountLabel: accountLabel,
    allSites: allSites,
    rows: Array.isArray(payload.summaryRows) ? payload.summaryRows.slice() : [],
    siteMeta: siteMeta,
    mergedMeta: isV2 ? buildMergedMetaFromV2(payload) : (payload.mergedMeta || null),
    curMode: isV2 ? payload[PAYLOAD_FIELDS.UI]?.[PAYLOAD_FIELDS.CUR_MODE] : (payload.curMode === "site" ? "site" : "all"),
    curSite: isV2 ? payload[PAYLOAD_FIELDS.UI]?.[PAYLOAD_FIELDS.CUR_SITE] : (
      typeof payload.curSite === "string"
        ? payload.curSite
        : allSites[0] || null
    ),
    curTab: snapshotTabIds.indexOf(isV2 ? payload[PAYLOAD_FIELDS.UI]?.[PAYLOAD_FIELDS.CUR_TAB] : payload.curTab) !== -1
      ? (isV2 ? payload[PAYLOAD_FIELDS.UI]?.[PAYLOAD_FIELDS.CUR_TAB] : payload.curTab)
      : "overview",
    runtimeVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "snapshot",
    cacheMeta: updatedAt
      ? {
          label: "snapshot",
          updatedAt,
          remainingMs: null,
          sourceCount: allSites.length,
          measuredAt: Date.now(),
        }
      : null,
  };
}

/**
 * V2: 병합 메타데이터 생성
 */
function buildMergedMetaFromV2(payload) {
  const accounts = payload[PAYLOAD_FIELDS.ACCOUNTS] || {};
  const accountEntries = Object.entries(accounts);

  if (accountEntries.length <= 1) return null;

  return {
    isMerged: true,
    accounts: accountEntries.map(([email, account]) => ({
      email,
      label: getShortLabel(email),
      encId: account[PAYLOAD_FIELDS.ENC_ID] || "",
    })),
    mergedAt: payload[PAYLOAD_FIELDS.META]?.[PAYLOAD_FIELDS.SAVED_AT] || new Date().toISOString(),
    naverIds: accountEntries.map(([email]) => email),
  };
}
```

**변경 3.1-3: `fetchExposeData()` 함수 (라인 416-425 전체 교체)**

```javascript
async function fetchExposeData(site) {
  // V2: 페이로드에서 데이터 가져오기
  const isV2 = isV2Payload(EXPORT_PAYLOAD);

  if (isV2) {
    // V2: 역인덱스 활용
    const index = window.__siteToAccountIndex || window.EXPORT_SITE_TO_ACCOUNT_INDEX;
    if (!index) {
      window.__siteToAccountIndex = buildSiteToAccountIndex(EXPORT_PAYLOAD);
    }

    const owners = (window.__siteToAccountIndex || {})[site] || [];
    if (owners.length > 0) {
      const email = owners[0];
      const account = EXPORT_PAYLOAD[PAYLOAD_FIELDS.ACCOUNTS]?.[email];
      return account?.[PAYLOAD_FIELDS.DATA_BY_SITE]?.[site] || {
        expose: null,
        crawl: null,
        backlink: null,
        detailLoaded: false
      };
    }

    return {
      expose: null,
      crawl: null,
      backlink: null,
      detailLoaded: false
    };
  }

  // v1 레거시 (이 단계에서는 없어야 함)
  return (
    EXPORT_PAYLOAD.dataBySite?.[site] || {
      expose: null,
      crawl: null,
      backlink: null,
      detailLoaded: false
    }
  );
}
```

**변경 3.1-4: `createMergedAccountsInfo()` 함수 (라인 860-881)**

```javascript
function createMergedAccountsInfo(mergedMeta) {
  // V2: mergedMeta 구조 확인
  const accounts = mergedMeta.accounts || [];

  const mergedInfo = document.createElement("div");
  mergedInfo.style.cssText = "background:linear-gradient(135deg,#1a2d45,#0d1829);border:1px solid #2a4060;border-radius:8px;padding:12px 16px;margin-bottom:16px";

  const accountLabels = accounts.map((acc, i) => {
    const fullLabel = acc.email || acc.label || acc.encId?.slice(0, 8) || `계정${i + 1}`;
    const shortLabel = fullLabel.includes('@') ? fullLabel.split('@')[0] : fullLabel;
    return `<span tabindex="0" role="button" aria-describedby="merged-acc-full-${i}" style="display:inline-block;background:#2a4060;color:#8bb8e8;padding:3px 8px;border-radius:4px;font-size:11px;margin:2px;cursor:default" title="${escHtml(fullLabel)}">${escHtml(shortLabel)}<span id="merged-acc-full-${i}" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">전체: ${escHtml(fullLabel)}</span></span>`;
  }).join(" ");

  mergedInfo.setAttribute("role", "region");
  mergedInfo.setAttribute("aria-label", `병합된 계정 정보, ${accounts.length}개 계정`);
  mergedInfo.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:16px" aria-hidden="true">🔀</span>
        <span style="font-size:13px;font-weight:700;color:#e0ecff">병합된 계정</span>
        <span style="font-size:10px;color:#6482a2;background:#0d1829;padding:2px 6px;border-radius:4px">${accounts.length}개 계정</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">${accountLabels}</div>
      <div style="font-size:9px;color:#6482a2;margin-top:8px">병합 시각: ${mergedMeta.mergedAt ? new Date(mergedMeta.mergedAt).toLocaleString('ko-KR') : '-'}</div>
    `;
  return mergedInfo;
}
```

---

### Phase 4: Python 스크립트 업데이트

#### 파일 4.1: `/scripts/merge_snapshots.py`

**완전히 재작성된 v2 지원 스크립트**

```python
"""
SearchAdvisor 스냅샷 병합 스크립트 v2
20260318-payload-contract-v2 구조 지원
"""

import re
import json
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from pathlib import Path

# ============================================================
# V2 상수
# ============================================================

PAYLOAD_V2_VERSION = "20260318-payload-contract-v2"
PAYLOAD_FIELDS = {
    "META": "__meta",
    "ACCOUNTS": "accounts",
    "UI": "ui",
    "STATS": "stats",
    "SUMMARY": "_summary",
    "VERSION": "version",
    "SAVED_AT": "savedAt",
    "ACCOUNT_COUNT": "accountCount",
    "TOTAL_SITES": "totalSites",
    "ENC_ID": "encId",
    "SITES": "sites",
    "SITE_META": "siteMeta",
    "DATA_BY_SITE": "dataBySite",
    "LABEL": "label",
    "DISPLAY_LABEL": "displayLabel",
    "SHORT_NAME": "shortName",
    "CUR_MODE": "curMode",
    "CUR_SITE": "curSite",
    "CUR_TAB": "curTab",
}


# ============================================================
# V2 데이터 클래스
# ============================================================

@dataclass
class SiteData:
    """사이트 데이터"""
    url: str
    expose: Optional[Dict[str, Any]] = None
    crawl: Optional[Dict[str, Any]] = None
    backlink: Optional[Dict[str, Any]] = None
    diagnosis_meta: Optional[Dict[str, Any]] = None
    diagnosis_meta_range: Optional[Dict[str, Any]] = None
    detail_loaded: bool = False
    cache_saved_at: int = 0

    @classmethod
    def from_dict(cls, url: str, data: Dict[str, Any]) -> 'SiteData':
        return cls(
            url=url,
            expose=data.get('expose'),
            crawl=data.get('crawl'),
            backlink=data.get('backlink'),
            diagnosis_meta=data.get('diagnosisMeta'),
            diagnosis_meta_range=data.get('diagnosisMetaRange'),
            detail_loaded=data.get('detailLoaded', False),
            cache_saved_at=data.get('__cacheSavedAt', 0)
        )

    def to_dict(self) -> Dict[str, Any]:
        result = {}
        if self.expose:
            result['expose'] = self.expose
        if self.crawl:
            result['crawl'] = self.crawl
        if self.backlink:
            result['backlink'] = self.backlink
        if self.diagnosis_meta:
            result['diagnosisMeta'] = self.diagnosis_meta
        if self.diagnosis_meta_range:
            result['diagnosisMetaRange'] = self.diagnosis_meta_range
        result['detailLoaded'] = self.detail_loaded
        if self.cache_saved_at:
            result['__cacheSavedAt'] = self.cache_saved_at
        return result


@dataclass
class AccountInfo:
    """계정 정보"""
    email: str
    enc_id: str = ""
    sites: List[str] = field(default_factory=list)
    site_meta: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    sites_data: Dict[str, SiteData] = field(default_factory=dict)

    def merge_with(self, other: 'AccountInfo') -> None:
        """
        다른 계정 정보와 병합
        타임스탬프 기반으로 최신 데이터 보존
        """
        # 사이트 목록 병합
        for site in other.sites:
            if site not in self.sites:
                self.sites.append(site)

        # siteMeta 병합 (최신 우선)
        for site, meta in other.site_meta.items():
            if site not in self.site_meta:
                self.site_meta[site] = meta
            else:
                # label이 있으면 최신 것 유지
                if meta.get('label'):
                    self.site_meta[site]['label'] = meta['label']
                if meta.get('displayLabel'):
                    self.site_meta[site]['displayLabel'] = meta['displayLabel']
                if meta.get('shortName'):
                    self.site_meta[site]['shortName'] = meta['shortName']

        # sitesData 병합 (타임스탬프 비교)
        for site, data in other.sites_data.items():
            if site not in self.sites_data:
                self.sites_data[site] = data
            else:
                existing = self.sites_data[site]
                # 최신 데이터 유지
                if data.cache_saved_at > existing.cache_saved_at:
                    self.sites_data[site] = data


@dataclass
class MergedSnapshot:
    """병합된 스냅샷"""
    meta: Dict[str, Any] = field(default_factory=dict)
    accounts: Dict[str, AccountInfo] = field(default_factory=dict)
    summary: Dict[str, Any] = field(default_factory=dict)
    ui: Dict[str, Any] = field(default_factory=dict)
    stats: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """딕셔너리로 변환 (v2 구조)"""
        accounts_dict = {}
        for email, acc in self.accounts.items():
            sites_data_dict = {}
            for site, data in acc.sites_data.items():
                sites_data_dict[site] = data.to_dict()

            accounts_dict[email] = {
                PAYLOAD_FIELDS['ENC_ID']: acc.enc_id,
                PAYLOAD_FIELDS['SITES']: acc.sites,
                PAYLOAD_FIELDS['SITE_META']: acc.site_meta,
                PAYLOAD_FIELDS['DATA_BY_SITE']: sites_data_dict,
            }

        return {
            PAYLOAD_FIELDS['META']: self.meta,
            PAYLOAD_FIELDS['ACCOUNTS']: accounts_dict,
            PAYLOAD_FIELDS['SUMMARY']: self.summary if self.summary else None,
            PAYLOAD_FIELDS['UI']: self.ui,
            PAYLOAD_FIELDS['STATS']: self.stats,
        }


# ============================================================
# V2 유틸리티 함수
# ============================================================

def is_v2_payload(payload: Dict[str, Any]) -> bool:
    """V2 페이로드인지 확인"""
    return bool(
        payload and
        payload.get(PAYLOAD_FIELDS['META']) and
        payload[PAYLOAD_FIELDS['META']].get(PAYLOAD_FIELDS['VERSION']) == PAYLOAD_V2_VERSION
    )


def migrate_v1_to_v2(legacy: Dict[str, Any]) -> Dict[str, Any]:
    """레거시 v1을 v2로 변환"""
    # 이메일 결정
    email = (
        legacy.get('accountLabel') or
        legacy.get(PAYLOAD_FIELDS['META'], {}).get('accountEmail') or
        legacy.get(PAYLOAD_FIELDS['META'], {}).get('source_account') or
        "unknown@naver.com"
    )

    enc_id = (
        legacy.get('accountEncId') or
        legacy.get(PAYLOAD_FIELDS['META'], {}).get('encId') or
        legacy.get(PAYLOAD_FIELDS['META'], {}).get('source_enc_id') or
        ""
    )

    all_sites = legacy.get('allSites') or []
    site_meta = legacy.get('siteMeta') or {}
    data_by_site = legacy.get('dataBySite') or {}

    saved_at = (
        legacy.get('savedAt') or
        legacy.get(PAYLOAD_FIELDS['META'], {}).get('savedAt') or
        datetime.now().isoformat()
    )

    return {
        PAYLOAD_FIELDS['META']: {
            PAYLOAD_FIELDS['VERSION']: PAYLOAD_V2_VERSION,
            PAYLOAD_FIELDS['SAVED_AT']: saved_at,
            PAYLOAD_FIELDS['ACCOUNT_COUNT']: 1,
            PAYLOAD_FIELDS['TOTAL_SITES']: len(all_sites),
        },
        PAYLOAD_FIELDS['ACCOUNTS']: {
            email: {
                PAYLOAD_FIELDS['ENC_ID']: enc_id,
                PAYLOAD_FIELDS['SITES']: all_sites,
                PAYLOAD_FIELDS['SITE_META']: site_meta,
                PAYLOAD_FIELDS['DATA_BY_SITE']: data_by_site,
            }
        },
        PAYLOAD_FIELDS['UI']: {
            PAYLOAD_FIELDS['CUR_MODE']: legacy.get('curMode', 'all'),
            PAYLOAD_FIELDS['CUR_SITE']: legacy.get('curSite'),
            PAYLOAD_FIELDS['CUR_TAB']: legacy.get('curTab', 'overview'),
        },
        PAYLOAD_FIELDS['STATS']: legacy.get('stats') or {
            'success': 0,
            'partial': 0,
            'failed': 0,
            'errors': []
        }
    }


def extract_payload_from_html(html_path: str) -> Dict[str, Any]:
    """HTML에서 payload 추출 (v1, v2 자동 감지)"""
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # EXPORT_PAYLOAD 추출
    match = re.search(r'const EXPORT_PAYLOAD = (\{.*?\});', html, re.DOTALL)
    if not match:
        raise ValueError(f"EXPORT_PAYLOAD를 찾을 수 없습니다: {html_path}")

    try:
        payload = json.loads(match.group(1))
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 파싱 실패: {e}")

    # v1이면 v2로 변환
    if not is_v2_payload(payload):
        print(f"[INFO] 레거시 v1 감지, v2로 변환: {html_path}")
        payload = migrate_v1_to_v2(payload)

    return payload


def merge_snapshots(html_paths: List[str]) -> MergedSnapshot:
    """
    스냅샷 병합 (모두 v2 구조)
    타임스탬프 기반으로 최신 데이터 보존
    """
    merged = MergedSnapshot()

    # 메타데이터 초기화
    merged.meta = {
        PAYLOAD_FIELDS['VERSION']: PAYLOAD_V2_VERSION,
        PAYLOAD_FIELDS['SAVED_AT']: datetime.now().isoformat(),
        PAYLOAD_FIELDS['ACCOUNT_COUNT']: 0,
        PAYLOAD_FIELDS['TOTAL_SITES']: 0,
    }

    site_ownership = {}  # site -> [emails]
    conflicts = []

    for html_path in html_paths:
        print(f"[INFO] 처리 중: {html_path}")
        payload = extract_payload_from_html(html_path)

        # 계정 병합
        accounts = payload.get(PAYLOAD_FIELDS['ACCOUNTS'], {})

        for email, account_data in accounts.items():
            # AccountInfo 생성
            sites = account_data.get(PAYLOAD_FIELDS['SITES'], [])
            site_meta = account_data.get(PAYLOAD_FIELDS['SITE_META'], {})
            data_by_site = account_data.get(PAYLOAD_FIELDS['DATA_BY_SITE'], {})

            sites_data = {}
            for site, data in data_by_site.items():
                sites_data[site] = SiteData.from_dict(site, data)

            account_info = AccountInfo(
                email=email,
                enc_id=account_data.get(PAYLOAD_FIELDS['ENC_ID'], ''),
                sites=sites,
                site_meta=site_meta,
                sites_data=sites_data
            )

            # 기존 계정과 병합
            if email not in merged.accounts:
                merged.accounts[email] = account_info
            else:
                merged.accounts[email].merge_with(account_info)
                print(f"[INFO] 계정 병합: {email}")

            # 사이트 소유권 기록
            for site in sites:
                if site not in site_ownership:
                    site_ownership[site] = []
                if email not in site_ownership[site]:
                    site_ownership[site].append(email)

    # 충돌 확인 (같은 사이트가 여러 계정에 있음)
    for site, owners in site_ownership.items():
        if len(owners) > 1:
            conflicts.append({'site': site, 'owners': owners})
            print(f"[WARN] 충돌: {site} 소유자={owners}")

    # 메타데이터 업데이트
    merged.meta[PAYLOAD_FIELDS['ACCOUNT_COUNT']] = len(merged.accounts)
    merged.meta[PAYLOAD_FIELDS['TOTAL_SITES']] = len(site_ownership)

    # 요약 정보
    all_sites_list = []
    for account in merged.accounts.values():
        all_sites_list.extend(account.sites)
    all_sites_unique = sorted(set(all_sites_list))

    merged.summary = {
        'siteOwnership': site_ownership,
        'conflicts': conflicts,
        'totalSites': len(all_sites_unique),
    }

    # UI 상태
    merged.ui = {
        PAYLOAD_FIELDS['CUR_MODE']: 'all',
        PAYLOAD_FIELDS['CUR_SITE']: all_sites_unique[0] if all_sites_unique else None,
        PAYLOAD_FIELDS['CUR_TAB']: 'overview',
    }

    # 통계
    success_count = 0
    for account in merged.accounts.values():
        for data in account.sites_data.values():
            if data.expose:
                success_count += 1
                break

    merged.stats = {
        'success': success_count,
        'partial': 0,
        'failed': 0,
        'errors': []
    }

    return merged


def main():
    """메인 함수"""
    import argparse

    parser = argparse.ArgumentParser(description="SearchAdvisor 스냅샷 병합 v2")
    parser.add_argument("files", nargs="+", help="HTML 스냅샷 파일들")
    parser.add_argument("-o", "--output", default="merged.html", help="출력 HTML 파일")
    parser.add_argument("--json", action="store_true", help="JSON으로 내보내기")
    parser.add_argument("--pretty", action="store_true", help="예쁘게 출력")

    args = parser.parse_args()

    if len(args.files) < 2:
        print("[ERROR] 최소 2개 이상의 파일이 필요합니다")
        return 1

    print(f"[INFO] {len(args.files)}개 파일 병합 시작")
    merged = merge_snapshots(args.files)

    print(f"[INFO] 병합 완료:")
    print(f"  - 계정: {merged.meta[PAYLOAD_FIELDS['ACCOUNT_COUNT']]}개")
    print(f"  - 사이트: {merged.meta[PAYLOAD_FIELDS['TOTAL_SITES']]}개")
    print(f"  - 충돌: {len(merged.summary['conflicts'])}개")

    if args.json:
        # JSON 출력
        indent = 2 if args.pretty else None
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(merged.to_dict(), f, ensure_ascii=False, indent=indent)
        print(f"[INFO] JSON 저장 완료: {args.output}")
    else:
        # HTML 출력 (템플릿 파일 필요)
        print(f"[INFO] HTML 출력: {args.output} (템플릿 적용 필요)")
        # 여기에 HTML 템플릿 적용 로직 추가

    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
```

---

### Phase 5: 데이터 관리자 변경

#### 파일 5.1: `/src/app/main/03-data-manager.js`

**추가할 함수:**

```javascript
// ============================================================
// V2 PAYLOAD 데이터 관리
// ============================================================

/**
 * V2: 사이트 데이터 캐싱
 */
function cacheSiteDataV2(site, data, accountEmail) {
  if (!site || !accountEmail) return;

  const cacheKey = `site_data_${accountEmail}_${site}`;
  const payload = {
    data,
    accountEmail,
    cachedAt: Date.now()
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch (e) {
    console.warn('[cacheSiteDataV2] 캐시 실패:', e);
  }
}

/**
 * V2: 캐시된 사이트 데이터 로드
 */
function getCachedSiteDataV2(site, accountEmail) {
  if (!site || !accountEmail) return null;

  const cacheKey = `site_data_${accountEmail}_${site}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const payload = JSON.parse(cached);
      return payload.data;
    }
  } catch (e) {
    console.warn('[getCachedSiteDataV2] 캐시 로드 실패:', e);
  }

  return null;
}

/**
 * V2: 계정별 캐시 정리
 */
function clearAccountCache(accountEmail) {
  if (!accountEmail) return;

  const prefix = `site_data_${accountEmail}_`;
  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`[clearAccountCache] ${accountEmail} 캐시 정리 완료: ${keysToRemove.length}개`);
}
```

---

### Phase 6: UI 상태 변경

#### 파일 6.1: `/src/app/main/07-ui-state.js`

**변경할 내용:**

```javascript
// ============================================================
// V2: UI 상태 관리 업데이트
// ============================================================

/**
 * V2: 현재 페이로드에서 UI 상태 추출
 */
function getCurrentUiState(payload) {
  if (!payload) return null;

  if (isV2Payload(payload)) {
    return payload[PAYLOAD_FIELDS.UI] || null;
  }

  // v1 레거시
  return {
    curMode: payload.curMode,
    curSite: payload.curSite,
    curTab: payload.curTab
  };
}

/**
 * V2: UI 상태 병합
 */
function mergeUiStates(base, override) {
  return {
    [PAYLOAD_FIELDS.CUR_MODE]: override?.[PAYLOAD_FIELDS.CUR_MODE] || base?.[PAYLOAD_FIELDS.CUR_MODE] || PAYLOAD_DEFAULTS.MODE,
    [PAYLOAD_FIELDS.CUR_SITE]: override?.[PAYLOAD_FIELDS.CUR_SITE] || base?.[PAYLOAD_FIELDS.CUR_SITE] || null,
    [PAYLOAD_FIELDS.CUR_TAB]: override?.[PAYLOAD_FIELDS.CUR_TAB] || base?.[PAYLOAD_FIELDS.CUR_TAB] || PAYLOAD_DEFAULTS.TAB,
  };
}
```

---

## 🔄 실행 순서

### Step 1: 상수 정의 (30분)
1. `/src/app/main/00-constants.js`에 V2 상수 추가
2. 빌드 후 문법 확인

### Step 2: 헬퍼 함수 추가 (1시간)
1. `/src/app/main/01-helpers.js`에 V2 헬퍼 함수 추가
2. 빌드 후 테스트

### Step 3: 데이터 수집 변경 (2시간)
1. `/src/app/main/10-all-sites-view.js`의 `collectExportData()` 변경
2. `savedAtIsoV2()` 함수 추가
3. 빌드 후 스냅샷 생성 테스트

### Step 4: 병합 관리자 변경 (1시간)
1. `/src/app/main/06-merge-manager.js`의 `exportCurrentAccountData()` 변경
2. `importAccountData()` 변경
3. 빌드 후 가져오기/내보내기 테스트

### Step 5: 스냅샷 처리 변경 (3시간)
1. `/src/app/main/12-snapshot.js`의 4개 함수 변경
2. 빌드 후 HTML 스냅샷 로드 테스트

### Step 6: Python 스크립트 업데이트 (2시간)
1. `/scripts/merge_snapshots.py` 완전 재작성
2. 테스트 실행

### Step 7: 데이터 관리자 업데이트 (1시간)
1. `/src/app/main/03-data-manager.js`에 V2 캐싱 함수 추가

### Step 8: UI 상태 업데이트 (1시간)
1. `/src/app/main/07-ui-state.js`에 V2 UI 함수 추가

### Step 9: 통합 빌드 및 테스트 (2시간)
1. 전체 빌드
2. 단일 계정 스냅샷 테스트
3. 다중 계정 병합 테스트
4. 레거시 v1 로드 테스트

### Step 10: Git 커밋 (30분)
1. 모든 변경 스테이징
2. 커밋 메시지 작성
3. 태그 생성: `v2.0.0-migration`

---

## ✅ 검증 체크리스트

### 단일 계정 스냅샷
- [ ] 스냅샷 저장 시 v2 구조로 저장됨
- [ ] `__meta.version`이 `"20260318-payload-contract-v2"`임
- [ ] `accounts` 객체에 계정 이메일이 키로 존재
- [ ] `dataBySite`가 `accounts.{email}.dataBySite`에 위치
- [ ] UI 상태가 `ui` 컨테이너 안에 있음
- [ ] 저장된 스냅샷을 다시 열 수 있음

### 다중 계정 병합
- [ ] 2개 이상의 스냅샷 병합 가능
- [ ] 각 계정이 `accounts`에 별도 키로 존재
- [ ] `__meta.accountCount`가 정확함
- [ ] 동일 사이트의 최신 데이터가 보존됨
- [ ] 병합 정보가 `_summary`에 기록됨

### Python 스크립트
- [ ] v1 스냅샷 자동 변환
- [ ] v2 스냅샷 직접 처리
- [ ] 타임스탬프 기반 병합
- [ ] 충돌 감지 및 보고

### 헬퍼 함수
- [ ] `getAllSites()` 정상 작동
- [ ] `getAccountForSite()` 정상 작동
- [ ] `getSiteData()` 정상 작동
- [ ] `getSiteLabel()` 정상 작동
- [ ] `isV2Payload()` 정상 작동

---

## 🎯 커밋 메시지 템플릿

```
feat: JSON 스키마 v2로 빅뱅 마이그레이션

## 변경 내용

### 스키마 변경
- 최상위 구조를 `accounts.{email}` 중첩 구조로 변경
- 메타데이터를 `__meta` 컨테이너로 통합
- UI 상태를 `ui` 컨테이너로 이동
- 계정 이메일을 최상위 키로 사용

### 데이터 접근
- `dataBySite[site]` → `getSiteData(site, payload)`로 변경
- `allSites` → `getAllSites(payload)`로 변경
- 역인덱싱으로 성능 최적화

### 병합 개선
- 타임스탬프 기반 병합 (최신 데이터 보존)
- 다중 계정 지원
- 충돌 감지 및 보고

### Python 스크립트
- v1/v2 자동 감지 및 변환
- AccountInfo, SiteData 클래스 도입
- 타임스탬프 비교 로직 추가

## 호환성

- 기존 v1 스냅샷 자동 변환 지원
- 레거시 데이터 구조 레거시 모드 지원

## Breaking Changes

- 내보내기 기본 형식이 v2로 변경
- 헬퍼 함수 호출 방식 변경
- 스냅샷 파일 구조 변경

Refs: #v2-migration
```

---

**문서 버전:** 1.0
**총 예상 시간:** 12-14시간
**난이도:** 상
**위험도:** 높음 (빅뱅 전략)
