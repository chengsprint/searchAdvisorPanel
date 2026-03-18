# V2 JSON Schema 수정 종합 계획

**작성일**: 2026-03-18
**상태**: 계획 수립 완료
**기반**: 비판적 점검 보고서

---

## 📊 전체 코드 분석 결과

### 1. 레거시 코드 위치

| 파일 | 라인 | 내용 | 제거 필요 |
|------|------|------|----------|
| `03-data-manager.js` | 375-391 | V1 allSites 배열 처리 | ✅ |
| `06-merge-manager.js` | 537-540 | importAccountData 레거시 처리 | ✅ |

### 2. 현재 상태 점검

| 항목 | 상태 | 비고 |
|------|------|------|
| V2 다중 계정 지원 | ✅ 완료 | handleV2MultiAccount 동작 |
| ACCOUNT_UTILS 통합 | ✅ 완료 | 중앙 집중화 완료 |
| XSS 방지 | ✅ 완료 | ibox() 보안 강화 |
| _siteOwnership export | ✅ 완료 | 이미 포함됨 (498줄) |
| 레거시 제거 | ❌ 미완료 | V1 코드 남음 |
| 데이터 검증 | ❌ 미완료 | 일관성 체크 없음 |
| 버전 관리 | ❌ 미완료 | 하드코딩됨 |
| 병합 전략 | ❌ 미완료 | "newer"만 사용 |

---

## 🎯 수정 계획

### Phase 2-A: 레거시 제거 + 기본 안전장치 (우선)

#### 수정 1: 레거시 코드 제거 (30분)

**03-data-manager.js**
```javascript
// 제거 (375-391줄)
if (exportPayload.allSites && Array.isArray(exportPayload.allSites)) {
  // 전체 제거
}

// V2만 지원
if (exportPayload?.__meta?.version === PAYLOAD_V2.VERSION) {
  return handleV2MultiAccount(exportPayload);
}
```

**06-merge-manager.js**
```javascript
// 제거 (537-540줄)
else {
  // Legacy format ← 제거
}
```

#### 수정 2: 데이터 일관성 검증 추가 (1시간)

**00-constants.js에 추가**
```javascript
// 데이터 검증 유틸리티
const DATA_VALIDATION = {
  /**
   * 계정 데이터 일관성 검증
   * @returns {Object} { valid, missingData, orphanSites }
   */
  validateAccountData: function(account) {
    const sites = account?.sites || [];
    const dataBySite = account?.dataBySite || {};

    const missingData = [];
    for (const site of sites) {
      if (!dataBySite[site]) {
        missingData.push(site);
      }
    }

    const orphanSites = Object.keys(dataBySite).filter(url => !sites.includes(url));

    return {
      valid: missingData.length === 0 && orphanSites.length === 0,
      missingData,
      orphanSites,
      sitesCount: sites.length,
      dataCount: Object.keys(dataBySite).length
    };
  },

  /**
   * 전체 V2 payload 검증
   */
  validateV2Payload: function(payload) {
    if (!payload?.__meta?.version) {
      return { valid: false, errors: ['Missing __meta.version'] };
    }

    const accounts = payload?.accounts || {};
    const accountKeys = Object.keys(accounts);

    if (accountKeys.length === 0) {
      return { valid: false, errors: ['No accounts found'] };
    }

    const allErrors = [];
    for (const accKey of accountKeys) {
      const validation = this.validateAccountData(accounts[accKey]);
      if (!validation.valid) {
        allErrors.push({
          account: accKey,
          missingData: validation.missingData,
          orphanSites: validation.orphanSites
        });
      }
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      accountCount: accountKeys.length
    };
  }
};
```

**03-data-manager.js handleV2MultiAccount에 추가**
```javascript
// 데이터 일관성 검증
for (const accKey of accountKeys) {
  const account = payload.accounts[accKey];
  const validation = DATA_VALIDATION.validateAccountData(account);

  if (!validation.valid) {
    console.warn(`[V2 Multi-Account] Account ${accKey} data inconsistency:`, validation);

    // 누락된 데이터가 있는 sites는 목록에서 제거
    if (validation.missingData.length > 0) {
      account.sites = account.sites.filter(s => !validation.missingData.includes(s));
    }
  }
}
```

#### 수정 3: 버전 관리 상수 추가 (30분)

**00-constants.js에 추가**
```javascript
// ============================================================
// P1: 버전 관리 체계
// ============================================================

const SCHEMA_VERSIONS = {
  V1: "1.0",   // V1 스키마 (레거시, 제거 예정)
  V2: "1.0",   // V2 스키마 (현재)
  CURRENT: "1.0"
};

// 버전 상수 (간단한 버전 관리를 위해 PAYLOAD_V2와 병치 예정)
const SCHEMA_VERSION = SCHEMA_VERSIONS.V2;
```

**03-data-manager.js loadSiteList에 추가**
```javascript
// V2 포맷만 지원 (레거시 제거 후)
if (exportPayload?.__meta?.version === SCHEMA_VERSIONS.CURRENT) {
  return handleV2MultiAccount(exportPayload);
}

// 지원하지 않는 버전
if (exportPayload?.__meta?.version) {
  console.error(`[loadSiteList] Unsupported version: ${exportPayload.__meta.version}`);
  return [];
}
```

#### 수정 4: 병합 전략 상수 추가 (30분)

**00-constants.js에 추가**
```javascript
// ============================================================
// P1: 병합 전략 상수
// ============================================================

const MERGE_STRATEGIES = {
  NEWER: 'newer',   // 최신 데이터 우선 (기본)
  FIRST: 'first',   // 첫 번째 계정 우선
  ALL: 'all'        // 모든 데이터 보존 (추후 구현)
};

const DEFAULT_MERGE_STRATEGY = MERGE_STRATEGIES.NEWER;
```

**03-data-manager.js handleV2MultiAccount에 전략 파라미터 추가**
```javascript
function handleV2MultiAccount(payload, strategy = DEFAULT_MERGE_STRATEGY) {
  // ... 기존 코드

  // 전략에 따른 병합 (현재는 NEWER만 구현)
  switch (strategy) {
    case MERGE_STRATEGIES.NEWER:
      // 기존 로직 그대로
      break;
    case MERGE_STRATEGIES.FIRST:
      // 첫 번째 계정 데이터 우선 (구현 예정)
      break;
    default:
      console.warn(`[V2 Multi-Account] Unknown strategy: ${strategy}, using NEWER`);
  }
}
```

---

### Phase 2-B: 고급 기능 (차기 구현)

#### 수정 5: UI 상태 유효성 검증

```javascript
function validateUIState(ui, accountData) {
  const sites = accountData?.sites || [];

  return {
    curMode: ui?.curMode && ['all', 'site'].includes(ui.curMode) ? ui.curMode : 'all',
    curSite: ui?.curSite && sites.includes(ui.curSite) ? ui.curSite : (sites[0] || null),
    curTab: ui?.curTab || 'overview',
    curAccount: ui?.curAccount || null
  };
}
```

#### 수정 6: null/undefined 표준화

```javascript
function normalizeAccountData(account) {
  return {
    encId: account?.encId || null,
    sites: Array.isArray(account?.sites) ? account.sites : [],
    siteMeta: account?.siteMeta && typeof account.siteMeta === 'object' ? account.siteMeta : {},
    dataBySite: account?.dataBySite && typeof account.dataBySite === 'object' ? account.dataBySite : {}
  };
}
```

---

## 📅 실행 순서

### 1차: 레거시 제거 + 기본 안전장치 (2시간)

1. **레거시 코드 제거** (30분)
   - 03-data-manager.js 375-391줄 제거
   - 06-merge-manager.js 537-540줄 제거

2. **데이터 일관성 검증 추가** (1시간)
   - DATA_VALIDATION 객체 추가
   - handleV2MultiAccount에 검증 로직 추가

3. **버전 관리 상수 추가** (30분)
   - SCHEMA_VERSIONS 상수 추가
   - 버전 체크 로직 추가

4. **병합 전략 상수 추가** (30분)
   - MERGE_STRATEGIES 상수 추가
   - handleV2MultiAccount에 전략 파라미터 추가

5. **빌드 및 테스트** (30분)
   - 빌드 확인
   - 단일/다중 계정 테스트

### 2차: 고급 기능 (차기)

- UI 상태 유효성 검증
- null/undefined 표준화
- 병합 전략 UI (FIRST, ALL)

---

## 📝 예상 결과

### 수정 전
```
❌ 레거시 V1 코드 존재
❌ 데이터 불일치 감지 안 됨
❌ 버전 관리 없음
❌ 병합 전략 고정됨
```

### 수정 후
```
✅ V2만 지원 (코드 간소)
✅ 데이터 불일치 자동 감지/보정
✅ 버전 상수로 관리
✅ 병합 전략 상수화 (확장 용이)
```

---

## ✅ 체크리스트

- [ ] 레거시 코드 제거
- [ ] DATA_VALIDATION 객체 추가
- [ ] handleV2MultiAccount에 검증 로직 추가
- [ ] SCHEMA_VERSIONS 상수 추가
- [ ] MERGE_STRATEGIES 상수 추가
- [ ] 빌드 확인
- [ ] 단일 계정 테스트
- [ ] 다중 계정 테스트
- [ ] 데이터 불일치 테스트
