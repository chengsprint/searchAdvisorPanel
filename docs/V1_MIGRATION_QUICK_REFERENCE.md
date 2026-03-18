# V1 마이그레이션 함수 퀵 레퍼런스

## 상수 (00-constants.js)

### V1_SCHEMA
```javascript
V1_SCHEMA.FIELDS        // V1 페이로드 필드 목록
V1_SCHEMA.META          // V1 메타데이터 필드
V1_SCHEMA.DEFAULTS      // V1 기본값
V1_SCHEMA.SITE_FIELDS   // V1 사이트 데이터 필드
```

### V1_MIGRATION
```javascript
V1_MIGRATION.VERSION                // 마이그레이션 버전
V1_MIGRATION.SUPPORTED_V1_VERSIONS  // 지원하는 V1 버전
V1_MIGRATION.MODES                  // 마이그레이션 모드
V1_MIGRATION.STATUS                 // 마이그레이션 상태
V1_MIGRATION.LS_KEYS                // localStorage 키
```

## 핵심 함수 (03-data-manager.js)

### validateV1Payload(payload)
V1 페이로드 유효성 검증

```javascript
const validation = validateV1Payload(v1Payload);
// { valid: boolean, errors: string[], version: string }
```

**반환값:**
- `valid`: 유효함 여부
- `errors`: 에러 메시지 배열
- `version`: V1 스키마 버전

### migrateV1ToV2(v1Payload, options)
V1 → V2 변환

```javascript
const v2Payload = migrateV1ToV2(v1Payload, {
  accountEmail: 'user@naver.com',  // 계정 이메일 (선택)
  encId: 'encrypted_id',           // 암호화된 ID (선택)
  validate: true                   // 유효성 검증 (기본값: true)
});
```

**옵션:**
- `accountEmail`: 계정 이메일 (없으면 자동 감지)
- `encId`: 암호화된 계정 ID
- `validate`: 유효성 검증 여부

**반환값:** V2 페이로드 객체

### migrateV2ToV1(v2Payload, options)
V2 → V1 롤백

```javascript
const v1Payload = migrateV2ToV1(v2Payload, {
  accountEmail: 'user@naver.com',  // 계정 이메일 (선택)
  includeMetadata: true            // 메타데이터 포함 (기본값: true)
});
```

**옵션:**
- `accountEmail`: 롤백할 계정 이메일
- `includeMetadata`: 롤백 메타데이터 포함 여부

**반환값:** V1 페이로드 객체

### canMigrateV1(payload)
마이그레이션 가능한 데이터 확인

```javascript
if (canMigrateV1(payload)) {
  // V1 데이터 - 마이그레이션 필요
  const v2Payload = migrateV1ToV2(payload);
} else {
  // V2 데이터 - 그대로 사용
}
```

**반환값:** boolean

### detectAndMigrateV1Data()
localStorage에서 V1 데이터 탐지 및 마이그레이션

```javascript
const result = detectAndMigrateV1Data();
// {
//   detected: boolean,
//   migrated: boolean,
//   payload: Object|null,
//   log: Object
// }
```

**반환값:**
- `detected`: V1 데이터 감지 여부
- `migrated`: 마이그레이션 성공 여부
- `payload`: 마이그레이션된 V2 페이로드
- `log`: 마이그레이션 로그

### backupV1Data(v1Payload)
V1 데이터 백업

```javascript
const backupKey = backupV1Data(v1Payload);
// localStorage에 백업 저장, 키 반환
```

**반환값:** 백업 키 문자열

### getMigrationStats()
마이그레이션 통계

```javascript
const stats = getMigrationStats();
// {
//   detectedAt: timestamp,
//   migratedAt: timestamp,
//   status: string,
//   siteCount: number
// }
```

**반환값:** 마이그레이션 통계 객체

## 캐시 관련 함수

### normalizeLegacyCache(cacheKey, data)
레거시 캐시 데이터 정규화

```javascript
const normalized = normalizeLegacyCache('sadv_data_v1_xxx', v1CacheData);
```

**특징:**
- V1 `sites` → V2 `dataBySite` 변환
- `ts` → `__cacheSavedAt` 표준화
- V2 캐시는 그대로 반환

### extractSiteUrlFromCacheKey(cacheKey)
캐시 키에서 사이트 URL 추출

```javascript
const siteUrl = extractSiteUrlFromCacheKey('sadv_data_v2_default_aHR0cHM');
```

**반환값:** 사이트 URL 또는 null

## 사용 예시

### 예시 1: 자동 마이그레이션 (loadSiteList)
```javascript
// loadSiteList 함수 내에서 자동 처리됨
const sites = loadSiteList(false);
// V1 데이터가 있으면 자동으로 V2로 변환됨
```

### 예시 2: 수동 마이그레이션
```javascript
// 1. V1 페이로드 로드
const v1Payload = {
  sites: { 'https://example.com': { expose: {...} } },
  dataBySite: { 'https://example.com': { crawl: {...} } }
};

// 2. 유효성 검증
const validation = validateV1Payload(v1Payload);
if (!validation.valid) {
  console.error('Invalid:', validation.errors);
  return;
}

// 3. 마이그레이션
const v2Payload = migrateV1ToV2(v1Payload, {
  accountEmail: 'user@naver.com',
  validate: false  // 이미 검증했으므로 건너뜀
});

// 4. V2 페이로드 사용
window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = v2Payload;
```

### 예시 3: 롤백
```javascript
// V2 → V1 변환
const v1Payload = migrateV2ToV1(v2Payload, {
  accountEmail: 'user@naver.com',
  includeMetadata: true
});

// 롤백 메타데이터 확인
console.log('Rolled back from:', v1Payload.__rolled_back_from);
console.log('Rolled back at:', v1Payload.__rolled_back_at);
```

### 예시 4: 캐시 탐지
```javascript
// localStorage에서 V1 데이터 자동 탐지
const result = detectAndMigrateV1Data();

if (result.detected) {
  if (result.migrated) {
    console.log('마이그레이션 성공:', result.payload);
    // 마이그레이션된 데이터 사용
    window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = result.payload;
  } else {
    console.error('마이그레이션 실패:', result.error);
  }
} else {
  console.log('V1 데이터 없음');
}
```

## 데이터 구조

### V1 페이로드 구조
```javascript
{
  __schema_version: "1.0",        // 스키마 버전
  __source_account: "user@naver.com",  // 소스 계정
  __source_enc_id: "encrypted_id",     // 암호화된 ID
  savedAt: 1710705600000,        // 저장 시간
  encId: "encrypted_id",         // 암호화된 ID
  sites: {                        // 사이트 데이터
    "https://example.com": {
      expose: { ... },
      crawl: { ... }
    }
  },
  dataBySite: {                   // 상세 데이터
    "https://example.com": {
      expose: { ... },
      __fetched_at: 1710705600000
    }
  },
  siteMeta: {                     // 사이트 메타
    "https://example.com": { label: "Example" }
  }
}
```

### V2 페이로드 구조 (변환 후)
```javascript
{
  __meta: {
    version: "1.0",
    exportedAt: 1710705600000,
    migratedFrom: "V1",
    migratedAt: 1710705600000,
    originalVersion: "1.0"
  },
  accounts: {
    "user@naver.com": {
      encId: "encrypted_id",
      sites: ["https://example.com"],
      dataBySite: {
        "https://example.com": {
          expose: { ... },
          crawl: { ... },
          __source: "user@naver.com",
          __fetched_at: 1710705600000,
          __migratedFrom: "V1",
          __migratedAt: 1710705600000
        }
      },
      siteMeta: {
        "https://example.com": { label: "Example" }
      }
    }
  }
}
```

## 에러 처리

### 유효하지 않은 V1 페이로드
```javascript
try {
  const v2Payload = migrateV1ToV2(invalidPayload);
} catch (e) {
  console.error('마이그레이션 실패:', e.message);
  // "유효하지 않은 V1 페이로드: sites 또는 dataBySite 필드가 없습니다"
}
```

### 유효성 검증 에러
```javascript
const validation = validateV1Payload(payload);
if (!validation.valid) {
  console.error('검증 실패:', validation.errors);
  // ["sites 또는 dataBySite 필드가 없습니다", "encId 필드가 문자열이 아닙니다"]
}
```

## localStorage 키

### V1 백업
```javascript
// 백업 키 패턴
sadv_v1_backup_1710705600000

// 백업 데이터 구조
{
  payload: { /* V1 페이로드 */ },
  backedUpAt: 1710705600000,
  version: "1.0"
}
```

### 마이그레이션 로그
```javascript
// 로그 키
sadv_migration_log_1710705600000

// 로그 데이터
{
  detectedAt: 1710705600000,
  migratedAt: 1710705600000,
  v1Keys: ["sadv_data_v1_xxx", "sadv_sites_v1_xxx"],
  status: "success",
  siteCount: 10
}
```

### 최종 마이그레이션
```javascript
// 키
sadv_last_migration

// 데이터 (getMigrationStats 반환값)
{
  detectedAt: 1710705600000,
  migratedAt: 1710705600000,
  status: "success",
  siteCount: 10
}
```

## 성능 팁

1. **이중 검증 방지**: 이미 `validateV1Payload`를 호출했으면 `migrateV1ToV2`에서 `validate: false` 사용
2. **계정 정보 캐싱**: `ACCOUNT_UTILS.getAccountLabel()` 결과를 재사용
3. **백업 선택적 사용**: 중요한 데이터만 `backupV1Data` 호출
4. **자동 탐지**: `detectAndMigrateV1Data`로 localStorage 전체 스캔보다 `loadSiteList` 내장 탐지 사용

---

**참고:** 전체 구현 상세는 `P2_ISSUE_2_V1_MIGRATION_COMPLETION_REPORT.md` 참조
