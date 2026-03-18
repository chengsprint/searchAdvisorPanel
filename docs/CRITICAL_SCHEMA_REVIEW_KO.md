# V2 JSON Schema 비판적 점검 보고서

**작성일**: 2026-03-18
**검토 대상**: V2 JSON Schema 구조 및 구현

---

## 🔴 발견된 문제점

### 1. 데이터 일관성 검증 부재 (P1)

**문제:**
```javascript
// 현재 코드
const sites = account.sites || [];
const dataBySite = account.dataBySite || {};

// sites에 있지만 dataBySite에 없는 URL 처리 없음
// sites: ["site1.com", "site2.com"]
// dataBySite: { "site1.com": {...} }
// → "site2.com" 데이터 누락 감지 안 함
```

**영향:**
- 사이트 목록에 있지만 데이터가 없는 경우 오류 발생 가능
- UI에서 사이트 선택 시 데이터 없음 오류

**해결 방안:**
```javascript
// 데이터 일관성 검증 추가
function validateAccountData(account) {
  const sites = account.sites || [];
  const dataBySite = account.dataBySite || {};

  const missingData = [];
  for (const site of sites) {
    if (!dataBySite[site]) {
      missingData.push(site);
    }
  }

  // orphan 데이터 (dataBySite에만 있는 것)도 체크
  const orphanSites = Object.keys(dataBySite).filter(url => !sites.includes(url));

  return { valid: missingData.length === 0 && orphanSites.length === 0, missingData, orphanSites };
}
```

---

### 2. V1 → V2 마이그레이션 로직 부재 (P0)

**문제:**
```javascript
// 현재 코드 - 레거시는 단순 fallback만 처리
if (exportPayload.allSites && Array.isArray(exportPayload.allSites)) {
  // 기존 방식 그대로 처리 - V2 구조로 변환 안 함
}
```

**영향:**
- V1 데이터를 가진 사용자가 V2 구조의 이점을 못 받음
- 다중 계정 병합이 V1 데이터에서 불가능
- 데이터 포맷 불일치로 혼란

**해결 방안:**
```javascript
// V1 → V2 마이그레이션 함수 추가
function migrateV1ToV2(v1Payload) {
  const { accountLabel, encId } = ACCOUNT_UTILS.getAccountInfo();
  const accountEmail = accountLabel || 'unknown@naver.com';

  return {
    __meta: {
      version: "1.0",
      migratedFrom: "1.0",
      migratedAt: new Date().toISOString(),
      accountCount: 1
    },
    accounts: {
      [accountEmail]: {
        encId: encId || v1Payload.accountEncId || 'unknown',
        sites: v1Payload.allSites || [],
        siteMeta: v1Payload.siteMeta || {},
        dataBySite: v1Payload.dataBySite || {}
      }
    },
    ui: {
      curMode: v1Payload.curMode || 'all',
      curSite: v1Payload.curSite || null,
      curTab: v1Payload.curTab || 'overview'
    },
    stats: {
      success: (v1Payload.allSites || []).length,
      partial: 0,
      failed: 0,
      errors: []
    }
  };
}
```

---

### 3. 버전 관리 체계 부재 (P1)

**문제:**
```javascript
// 현재 코드
const PAYLOAD_V2 = {
  VERSION: "1.0"  // 하드코딩
};
```

**영향:**
- 향후 1.1, 2.0 등 버전업 시 대응 불가
- 구버전 payload와 호환성 문제

**해결 방안:**
```javascript
// 버전 상수 및 핸들러 추가
const SCHEMA_VERSIONS = {
  V1: "1.0",
  V2: "1.0",  // 현재
  FUTURE: "1.1"
};

// 버전 호환성 매트릭스
const VERSION_COMPATIBILITY = {
  "1.0": {
    canRead: ["1.0"],
    canMigrateTo: ["1.0"],
    minReader: "1.0"
  }
};

function getSchemaVersion(payload) {
  return payload?.__meta?.version || "1.0";
}

function isCompatible(payload, currentVersion = SCHEMA_VERSIONS.V2) {
  const payloadVersion = getSchemaVersion(payload);
  return payloadVersion === currentVersion;  // 현재는 동일 버전만
}
```

---

### 4. 다중 계정 병합 전략 고정 (P1)

**문제:**
```javascript
// 현재 코드 - "최신 우선" 전략만 하드코딩
if (!mergedSites[site] || newTime > existingTime) {
  mergedSites[site] = siteData;  // 무조건 최신 데이터 선택
}
```

**영향:**
- 사용자가 병합 전략 선택 불가
- 특정 계정 데이터를 우선하고 싶은 경우 불가능

**해결 방안:**
```javascript
// 병합 전략 상수 추가
const MERGE_STRATEGIES = {
  NEWER: 'newer',      // 최신 데이터 우선 (현재)
  FIRST: 'first',      // 첫 번째 계정 우선
  ASK: 'ask',          // 사용자에게 물음
  ALL: 'all'           // 모든 데이터 보존
};

// 전략에 따른 병합
function mergeSiteData(existingData, newData, strategy = MERGE_STRATEGIES.NEWER) {
  switch (strategy) {
    case MERGE_STRATEGIES.NEWER:
      return selectNewer(existingData, newData);
    case MERGE_STRATEGIES.FIRST:
      return existingData || newData;
    case MERGE_STRATEGIES.ALL:
      return preserveAll(existingData, newData);
    default:
      return selectNewer(existingData, newData);
  }
}
```

---

### 5. _siteOwnership 누락 (P2)

**문제:**
```javascript
// handleV2MultiAccount에서 계산하지만 export에 포함 안 될 수 있음
const siteOwnership = {};  // 계산됨
// 하지만 exportCurrentAccountData에서 _siteOwnership이 항상 포함되는지 확인 필요
```

**해결 방안:**
```javascript
// export 시 항상 포함되도록 수정
return {
  __meta: { ... },
  accounts: { ... },
  ui: { ... },
  stats: { ... },
  _siteOwnership: window.__sadvInitData?.siteOwnership || {}  // 항상 포함
};
```

---

### 6. null/undefined 처리 불일치 (P2)

**문제:**
```javascript
// 현재 코드
const sites = account.sites || [];          // 빈 배열로 처리
const siteMeta = account.siteMeta || {};    // 빈 객체로 처리
const dataBySite = account.dataBySite || {} // 빈 객체로 처리

// 하지만 실제로 sites가 null인 경우와 빈 배열인 경우 구분 없음
// 의도적으로 null인 경우 (데이터 로드 실패 등)를 구별 못 함
```

**해결 방안:**
```javascript
// 명시적 null 처리 추가
function normalizeAccountData(account) {
  return {
    encId: account?.encId || null,
    sites: Array.isArray(account?.sites) ? account.sites : [],
    siteMeta: account?.siteMeta && typeof account.siteMeta === 'object'
      ? account.siteMeta
      : {},
    dataBySite: account?.dataBySite && typeof account.dataBySite === 'object'
      ? account.dataBySite
      : {}
  };
}
```

---

### 7. UI 상태 복원 불완전 (P2)

**문제:**
```javascript
// 현재 코드
ui: {
  curMode: currentCurMode,
  curSite: currentCurSite,
  curTab: currentCurTab,
  curAccount: (typeof window.__sadvAccountState?.currentAccount !== "undefined")
    ? window.__sadvAccountState.currentAccount
    : validAccountEmail
}

// curAccount가 다중 계정이 아닐 때도 포함됨
// curSite가 현재 계정에 없을 때의 처리 부족
```

**해결 방안:**
```javascript
// UI 상태 유효성 검증 추가
function validateUIState(ui, accountData) {
  const sites = accountData?.sites || [];

  return {
    curMode: ui?.curMode && ['all', 'site'].includes(ui.curMode)
      ? ui.curMode
      : 'all',
    curSite: ui?.curSite && sites.includes(ui.curSite)
      ? ui.curSite
      : (sites[0] || null),
    curTab: ui?.curTab || 'overview',
    curAccount: ui?.curAccount || null
  };
}
```

---

## ✅ 괜찮은 부분

### 1. 기본 구조 (sites + dataBySite 분리)
- 순서 보장과 O(1) 조회를 모두 만족
- 확장에 용이

### 2. 중첩 accounts 구조
- 다중 계정 지원에 적합
- 계정별 데이터 격리

### 3. __meta에 버전 필드
- 향후 버전 관리의 기초 마련

### 4. stats 필드
- 성공/실패 추적용으로 적절

---

## 📋 우선 수정 순서

### 즉시 수정 (P0)
1. **V1 → V2 마이그레이션 함수 추가**
   - 기존 V1 데이터를 V2 구조로 변환
   - 레거시 호환성 확보

### 빠른 시일 내 수정 (P1)
2. **데이터 일관성 검증 추가**
   - sites와 dataBySite 불일치 감지
3. **버전 관리 체계 구축**
   - 버전 상수, 호환성 매트릭스
4. **병합 전략 선택 가능하게**
   - MERGE_STRATEGIES 상수 추가

### 차기 수정 (P2)
5. **_siteOwnership 항상 포함**
6. **null/undefined 처리 표준화**
7. **UI 상태 복원 강화**

---

## 🎯 결론

**현재 구조는 기본적으로 훌륭하지만, 안전장치가 부족합니다.**

- 단일 계정, 정상 데이터: ✅ 잘 작동
- 다중 계정, 정상 데이터: ✅ 잘 작동
- 레거시 데이터: ❌ 마이그레이션 필요
- 불일치 데이터: ❌ 검증 필요
- 버전 업데이트: ❌ 대응 체계 필요

**Phase 2에서 P0, P1 문제들을 우선 수정하시길 권장합니다.**
