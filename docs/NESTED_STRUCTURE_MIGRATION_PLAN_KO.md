# SearchAdvisor Runtime 중첩 구조(Nested Structure) 마이그레이션 계획

> **작성일**: 2026-03-18
> **버전**: 1.0
> **상태**: 최종

---

## 1. 개요

### 1.1 목표

단일 계정 스냅샷과 병합된 다중 계정 스냅샷을 **하나의 통합된 구조**로 표현하여:
- 계정별 데이터 격리 보장
- 명확한 계정 식별 (이메일을 최상위 키로 사용)
- 확장성 있는 병합 기능 지원
- 레거시 호환성 유지

### 1.2 핵심 원칙

1. **단일 구조 원칙**: 단일 계정과 다중 계정이 동일한 `accounts` 구조 사용
2. **명확한 계정 구분**: 네이버 이메일을 최상위 키로 사용하여 직관적인 계정 식별
3. **레이블 가시성**: 각 사이트에 레이블(닉네임)을 명확히 표시
4. **네이버 API 불변**: 네이버 서치어드바이저 엔드포인트는 절대 수정하지 않음

---

## 2. 최종 JSON 스키마

### 2.1 단일 계정 구조

```json
{
  "__meta": {
    "version": "20260317-payload-contract-v2",
    "savedAt": "2026-03-18T14:30:00.000Z",
    "schema": "searchadvisor-snapshot",
    "generator": "SearchAdvisor Runtime"
  },
  "accounts": {
    "user1@naver.com": {
      "encId": "abc12345",
      "label": "마이 블로그",
      "sites": ["https://site1.com", "https://site2.com"],
      "siteMeta": {
        "https://site1.com": { "label": "내 블로그" },
        "https://site2.com": { "label": "포트폴리오" }
      },
      "dataBySite": {
        "https://site1.com": {
          "expose": { "items": [...] },
          "crawl": { "items": [...] },
          "backlink": { "items": [...] },
          "diagnosisMeta": {...}
        },
        "https://site2.com": {
          "expose": { "items": [...] },
          "crawl": null,
          "backlink": null,
          "diagnosisMeta": null
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

### 2.2 다중 계정 병합 구조

```json
{
  "__meta": {
    "version": "20260317-payload-contract-v2",
    "savedAt": "2026-03-18T14:30:00.000Z",
    "accountCount": 2,
    "totalSites": 4,
    "hasConflicts": false
  },
  "accounts": {
    "user1@naver.com": {
      "encId": "abc12345",
      "label": "마이 블로그",
      "sites": ["https://site1.com"],
      "siteMeta": { "https://site1.com": { "label": "내 블로그" } },
      "dataBySite": { "https://site1.com": { "expose": {...} } }
    },
    "user2@naver.com": {
      "encId": "def67890",
      "label": "고객 사이트",
      "sites": ["https://site2.com", "https://site3.com"],
      "siteMeta": {
        "https://site2.com": { "label": "쇼핑몰" },
        "https://site3.com": { "label": "블로그" }
      },
      "dataBySite": {
        "https://site2.com": { "expose": {...} },
        "https://site3.com": { "expose": {...} }
      }
    }
  },
  "_summary": {
    "siteOwnership": {
      "https://site1.com": ["user1@naver.com"],
      "https://site2.com": ["user2@naver.com"],
      "https://site3.com": ["user2@naver.com"]
    },
    "conflicts": []
  },
  "ui": {
    "curMode": "all",
    "curSite": "https://site1.com",
    "curTab": "overview"
  },
  "stats": { "success": 3, "partial": 0, "failed": 0, "errors": [] }
}
```

---

## 3. 파일별 수정 계획

### 3.1 `/src/app/main/10-all-sites-view.js`

#### 변경 사항

| 함수 | 라인 | 변경 내용 |
|------|------|----------|
| `renderAllSites()` | 5-229 | `mergedMeta.accounts` 순회하여 사이트 목록 구성 |
| `collectExportData()` | 231-312 | 반환 구조를 `accounts` 기반으로 변경 |

#### collectExportData() 수정 예시

```javascript
// 변경 전
return {
  savedAt: savedAtIso(new Date()),
  accountLabel: accountLabel || "unknown",
  accountEncId: encId || "unknown",
  allSites: [...allSites],
  dataBySite,
  siteMeta: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
  mergedMeta: typeof getMergedMetaState === "function" ? getMergedMetaState() : null,
  stats,
};

// 변경 후
const mergedMeta = typeof getMergedMetaState === "function" ? getMergedMetaState() : null;

return {
  __meta: {
    version: "20260317-payload-contract-v2",
    savedAt: savedAtIso(new Date()),
    accountCount: mergedMeta?.accounts?.length || 1,
    totalSites: allSites.length,
  },
  accounts: mergedMeta?.accounts || {
    [accountLabel || "unknown"]: {
      encId: encId || "unknown",
      label: accountLabel || "unknown",
      sites: [...allSites],
      siteMeta: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
      dataBySite,
    }
  },
  ui: {
    curMode,
    curSite,
    curTab,
  },
  stats,
};
```

---

### 3.2 `/src/app/main/12-snapshot.js`

#### 변경 사항

| 함수 | 라인 | 변경 내용 |
|------|------|----------|
| `buildSnapshotHtml()` | 94-672 | `EXPORT_PAYLOAD.accounts` 구조 처리 |
| `fetchExposeData()` | 416-425 | `accounts`를 순회하며 사이트 데이터 찾기 |
| `cloneSnapshotShellState()` | 449-491 | 상태 구조를 새 형식으로 변경 |

#### fetchExposeData() 수정 예시

```javascript
// 변경 전
async function fetchExposeData(site) {
  return (
    EXPORT_PAYLOAD.dataBySite[site] || {
      expose: null,
      crawl: null,
      backlink: null,
      detailLoaded: false,
    }
  );
}

// 변경 후
async function fetchExposeData(site) {
  if (!EXPORT_PAYLOAD.accounts) {
    return { expose: null, crawl: null, backlink: null, detailLoaded: false };
  }

  for (const account of Object.values(EXPORT_PAYLOAD.accounts)) {
    if (account.dataBySite && account.dataBySite[site]) {
      return account.dataBySite[site];
    }
  }

  return { expose: null, crawl: null, backlink: null, detailLoaded: false };
}
```

---

### 3.3 `/src/app/main/06-merge-manager.js`

#### 변경 사항

| 함수 | 변경 내용 |
|------|----------|
| `exportCurrentAccountData()` | `accounts` 구조로 반환 |
| `importAccountData()` | `accounts` 구조 처리 및 레거시 지원 |
| `validateDataSchema()` | v2 스키마 검증 로직 추가 |

#### exportCurrentAccountData() 수정 예시

```javascript
// 변경 전
return {
  __schema_version: SCHEMA_VERSION,
  __exported_at: now,
  __source_account: accountLabel || 'unknown',
  __source_enc_id: encId || 'unknown',
  sites: sites
};

// 변경 후
return {
  __meta: {
    version: "20260317-payload-contract-v2",
    savedAt: now,
    schema: "searchadvisor-snapshot",
    generator: "SearchAdvisor Runtime",
    generatorVersion: window.__SEARCHADVISOR_RUNTIME_VERSION__ || "unknown",
  },
  accounts: {
    [accountLabel || 'unknown']: {
      encId: encId || 'unknown',
      label: accountLabel || 'unknown',
      sites: Object.keys(sites),
      siteMeta: {}, // 필요 시 채움
      dataBySite: sites
    }
  }
};
```

---

### 3.4 `/scripts/merge_snapshots.py`

이미 완전히 재작성되어 다음 기능을 지원합니다:
- v1/v2 자동 감지 및 변환
- 계정별 명확한 시각적 구분
- 사이트 충돌 감지 및 표시
- HTML 병합 시 계정별 섹션으로 분리

---

## 4. 변환 및 마이그레이션

### 4.1 스키마 감지 함수

```javascript
/**
 * 데이터 스키마 버전 감지
 */
function detectSchemaVersion(data) {
  // v2: accounts 구조
  if (data.accounts && typeof data.accounts === 'object') {
    return {
      version: 'v2',
      type: Object.keys(data.accounts).length > 1 ? 'merged' : 'single',
      needsMigration: false
    };
  }

  // v1: 레거시 구조
  if (data.exportFormat === 'snapshot-v2' || data.dataBySite) {
    return {
      version: 'v1',
      type: 'single',
      needsMigration: true
    };
  }

  return { version: 'unknown', type: 'unknown', needsMigration: true };
}
```

### 4.2 v1 → v2 변환 함수

```javascript
/**
 * 레거시 v1을 v2 구조로 변환
 */
function migrateV1ToV2(legacyData) {
  const accountEmail = legacyData.accountLabel || 'unknown@example.com';
  const accountEncId = legacyData.accountEncId || 'unknown';

  return {
    __meta: {
      version: "20260317-payload-contract-v2",
      savedAt: legacyData.savedAt || new Date().toISOString(),
      accountCount: 1,
      totalSites: legacyData.allSites?.length || 0,
      migratedFrom: 'v1'
    },
    accounts: {
      [accountEmail]: {
        encId: accountEncId,
        label: accountEmail,
        sites: legacyData.allSites || [],
        siteMeta: legacyData.siteMeta || {},
        dataBySite: legacyData.dataBySite || {}
      }
    },
    ui: {
      curMode: legacyData.curMode || 'all',
      curSite: legacyData.curSite || null,
      curTab: legacyData.curTab || 'overview'
    },
    stats: legacyData.stats || {}
  };
}
```

---

## 5. UI 레벨 변경

### 5.1 계정 필터링 UI

```javascript
/**
 * 계정 필터 컴포넌트 생성
 */
function createAccountFilter(accounts, onFilterChange) {
  const container = document.createElement('div');
  container.className = 'sadv-account-filter';

  const allBtn = document.createElement('button');
  allBtn.textContent = '전체';
  allBtn.dataset.filter = 'all';
  allBtn.className = 'sadv-filter-btn active';

  container.appendChild(allBtn);

  Object.entries(accounts).forEach(([email, account]) => {
    const btn = document.createElement('button');
    btn.textContent = account.label || email;
    btn.dataset.filter = email;
    btn.className = 'sadv-filter-btn';
    container.appendChild(btn);
  });

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('sadv-filter-btn')) {
      container.querySelectorAll('.sadv-filter-btn').forEach(b =>
        b.classList.remove('active'));
      e.target.classList.add('active');
      onFilterChange(e.target.dataset.filter);
    }
  });

  return container;
}
```

### 5.2 계정별 색상 할당

```javascript
/**
 * 계정별 일관된 색상 생성
 */
function getAccountColor(accountEmail) {
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
  let hash = 0;
  for (let i = 0; i < accountEmail.length; i++) {
    hash = accountEmail.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
```

---

## 6. 확장성 및 확장 포인트

### 6.1 계정 관리 API

```javascript
/**
 * 계정 관리를 위한 API 확장
 */
window.__sadvApi = {
  // 기존 API
  exportCurrentAccountData,
  importAccountData,

  // 신규 API
  getAccounts: () => Object.entries(EXPORT_PAYLOAD.accounts || {}),

  filterByAccount: (accountEmail) => {
    const account = EXPORT_PAYLOAD.accounts?.[accountEmail];
    return account ? account.sites.map(site => ({
      site,
      data: account.dataBySite[site],
      meta: account.siteMeta[site]
    })) : [];
  },

  addAccount: (accountData) => {
    // 계정 추가 로직
  },

  removeAccount: (accountEmail) => {
    // 계정 제거 로직
  }
};
```

### 6.2 예약 필드 (향후 확장용)

| 접두사 | 용도 |
|--------|------|
| `__meta` | 스키마/버전 메타데이터 |
| `_summary` | 병합 요약 정보 |
| `x_` | 사용자 정의 확장 필드 |

---

## 7. 구현 우선순위

### Phase 1: 핵심 데이터 구조 (1주)

1. `collectExportData()` 구조 변경
2. `exportCurrentAccountData()` 구조 변경
3. v1 → v2 변환 함수 구현
4. 기본 단위 테스트

### Phase 2: 스냅샷 처리 (1주)

1. `buildSnapshotHtml()` payload 처리 변경
2. `fetchExposeData()` accounts 순회 로직
3. `cloneSnapshotShellState()` 상태 구조 변경
4. 레거시 스냅샷 호환성 테스트

### Phase 3: UI 레벨 (1주)

1. 계정 필터링 UI 추가
2. 계정별 색상 코딩
3. `createMergedAccountsInfo()` 개선
4. UI 통합 테스트

### Phase 4: Python 스크립트 (완료됨)

- `merge_snapshots.py`는 이미 완전히 재작성됨

---

## 8. 테스트 계획

### 8.1 단위 테스트

```javascript
describe('Schema Migration', () => {
  it('should detect v1 schema correctly', () => {
    const v1Data = { exportFormat: 'snapshot-v2', dataBySite: {} };
    expect(detectSchemaVersion(v1Data).version).toBe('v1');
  });

  it('should migrate v1 to v2 correctly', () => {
    const v1Data = {
      accountLabel: 'test@naver.com',
      allSites: ['https://test.com'],
      dataBySite: {}
    };
    const v2Data = migrateV1ToV2(v1Data);
    expect(v2Data.accounts).toHaveProperty('test@naver.com');
  });
});
```

### 8.2 통합 테스트

1. 단일 계정 내보내기 → 가져오기
2. 다중 계정 병합 → 분리
3. 레거시 스냅샷 로드

---

## 9. 롤백 계획

마이그레이션 후 문제 발생 시:

1. **데이터 복구**: `migrateV2ToV1()` 함수로 레거시 형식 복원
2. **코드 롤백**: Git 태그를 사용하여 이전 버전 복원
3. **하위 호환성**: v1 데이터를 계속 지원하는 fallback 유지

---

## 10. 참고 파일

| 파일 경로 | 설명 |
|-----------|------|
| `/src/app/main/10-all-sites-view.js` | 전체 사이트 뷰 및 내보내기 |
| `/src/app/main/12-snapshot.js` | 스냅샷 HTML 생성 |
| `/src/app/main/06-merge-manager.js` | 계정 병합 관리 |
| `/scripts/merge_snapshots.py` | Python 병합 스크립트 |
| `/src/app/main/03-data-manager.js` | 데이터 캐시 관리 |
| `/src/app/main/07-ui-state.js` | UI 상태 관리 |

---

## 11. 요약

이 계획은 다음을 달성합니다:

1. ✅ 단일/다중 계정 통합 구조 (`accounts` 키 사용)
2. ✅ 명확한 계정 식별 (이메일을 최상위 키로)
3. ✅ 레이블 가시성 (각 사이트에 `siteMeta` 라벨)
4. ✅ 레거시 호환성 (v1 → v2 자동 변환)
5. ✅ 확장성 (계정 필터링, 색상 코딩, API 확장)
6. ✅ 네이버 API 불변 (엔드포인트 수정 없음)
