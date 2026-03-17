# SearchAdvisor Runtime - 데이터 스키마 v1.0

## 개요

이 문서는 SearchAdvisor Runtime의 데이터 스키마와 병합(Merge) 시맨틱스를 정의합니다.

## 1. 스키마 버전 관리

### 1.1 버전 형식

```
__schema_version: "MAJOR.MINOR"
```

- **MAJOR**: 호환되지 않는 스키마 변경
- **MINOR**: 호환되는 기능 추가

### 1.2 현재 버전

```
__schema_version: "1.0"
```

## 2. 데이터 구조

### 2.1 최상위 구조 (Account Export)

```json
{
  "__schema_version": "1.0",
  "__exported_at": "2026-03-16T10:00:00Z",
  "__source_account": "account@naver.com",
  "__source_enc_id": "<encrypted_account_id>",
  "sites": {
    "<site_url>": { ... }
  }
}
```

### 2.2 메타데이터 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `__schema_version` | string | Y | 스키마 버전 (예: "1.0") |
| `__exported_at` | ISO8601 | Y | 내보내기 시간 |
| `__source_account` | string | Y | 소스 계정 이메일 |
| `__source_enc_id` | string | Y | 암호화된 계정 ID |

### 2.3 병합 메타데이터 (Merged Data)

```json
{
  "__schema_version": "1.0",
  "__merged_at": "2026-03-16T11:00:00Z",
  "__merge_strategy": "newer",
  "accounts_merged": ["account-a@naver.com", "account-b@naver.com"],
  "sites": { ... }
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `__merged_at` | ISO8601 | Y | 병합 완료 시간 |
| `__merge_strategy` | string | Y | 병합 전략 ("newer", "overwrite") |
| `accounts_merged` | string[] | Y | 병합된 계정 목록 |

## 3. 사이트 데이터 구조

### 3.1 사이트 기본 구조

```json
{
  "sites": {
    "https://example.com": {
      "expose": { "items": [...] },
      "crawl": { "items": [...] },
      "backlink": { "items": [...] },
      "diagnosisMeta": { "code": 0, "items": [...] },
      "_merge": { ... }
    }
  }
}
```

### 3.2 노출 데이터 (expose)

검색 노출 통계 데이터입니다.

```json
{
  "expose": {
    "items": [{
      "period": {
        "start": "20260301",
        "end": "20260315",
        "prevClickRatio": "+5.0",
        "prevExposeRatio": "+3.0"
      },
      "logs": [
        { "date": "20260301", "clickCount": 100, "exposeCount": 200, "ctr": "50.00" }
      ],
      "urls": [
        { "key": "https://example.com/page1", "clickCount": 50, "exposeCount": 100, "ctr": "50.00" }
      ],
      "querys": [
        { "key": "검색어", "clickCount": 80, "exposeCount": 160, "ctr": "50.00" }
      ]
    }]
  }
}
```

#### 필드 정의

| 경로 | 필드 | 타입 | 설명 |
|------|------|------|------|
| `period.start` | string | 집계 시작일 (YYYYMMDD) |
| `period.end` | string | 집계 종료일 (YYYYMMDD) |
| `period.prevClickRatio` | string | 전주 대비 클릭률 변화 |
| `period.prevExposeRatio` | string | 전주 대비 노출률 변화 |
| `logs[].date` | string | 날짜 (YYYYMMDD) |
| `logs[].clickCount` | number | 클릭 수 |
| `logs[].exposeCount` | number | 노출 수 |
| `logs[].ctr` | string | 클릭률 (백분율) |
| `urls[].key` | string | URL |
| `urls[].clickCount` | number | 해당 URL 클릭 수 |
| `urls[].exposeCount` | number | 해당 URL 노출 수 |
| `querys[].key` | string | 검색어 |
| `querys[].clickCount` | number | 해당 검색어 클릭 수 |

### 3.3 크롤링 데이터 (crawl)

네이버봇 크롤링 통계입니다.

```json
{
  "crawl": {
    "items": [{
      "stats": [
        {
          "date": "20260301",
          "pageCount": 1000,
          "downloadSize": 10000000,
          "sumTryCount": 50,
          "sumErrorCount": 0,
          "notFound": 0,
          "serverError": 0,
          "connectTimeout": 0
        }
      ],
      "sitemaps": [
        { "url": "https://example.com/sitemap.xml", "status": "ok", "count": 50 }
      ]
    }]
  }
}
```

#### 필드 정의

| 필드 | 타입 | 설명 |
|------|------|------|
| `stats[].date` | string | 날짜 (YYYYMMDD) |
| `stats[].pageCount` | number | 크롤링 페이지 수 |
| `stats[].downloadSize` | number | 다운로드 크기 (bytes) |
| `stats[].sumTryCount` | number | 크롤 시도 횟수 |
| `stats[].sumErrorCount` | number | 총 에러 수 |
| `stats[].notFound` | number | 404 에러 수 |
| `stats[].serverError` | number | 500 에러 수 |
| `stats[].connectTimeout` | number | 타임아웃 횟수 |
| `sitemaps[].url` | string | 사이트맵 URL |
| `sitemaps[].status` | string | 상태 ("ok", "error") |
| `sitemaps[].count` | number | 제출된 URL 수 |

### 3.4 백링크 데이터 (backlink)

외부 링크 통계입니다.

```json
{
  "backlink": {
    "items": [{
      "total": 100,
      "domains": 10,
      "countTime": [
        { "timeStamp": "20260301", "backlinkCnt": 95 }
      ],
      "topDomain": [
        { "domain": "link-source.com", "backlinkCnt": 50 }
      ]
    }]
  }
}
```

#### 필드 정의

| 필드 | 타입 | 설명 |
|------|------|------|
| `total` | number | 총 백링크 수 |
| `domains` | number | 링크 도메인 수 |
| `countTime[].timeStamp` | string | 시점 (YYYYMMDD) |
| `countTime[].backlinkCnt` | number | 해당 시점 백링크 수 |
| `topDomain[].domain` | string | 도메인 |
| `topDomain[].backlinkCnt` | number | 해당 도메인 링크 수 |

### 3.5 진단 메타데이터 (diagnosisMeta)

사이트 진단 정보입니다.

```json
{
  "diagnosisMeta": {
    "code": 0,
    "items": [{
      "meta": [
        {
          "date": "20260301",
          "stateCount": {
            "1": 500,
            "2": 10,
            "3": 5,
            "4": 2
          }
        }
      ]
    }]
  }
}
```

#### 필드 정의

| 필드 | 타입 | 설명 |
|------|------|------|
| `code` | number | 진단 코드 (0: 정상) |
| `meta[].date` | string | 진단 날짜 (YYYYMMDD) |
| `meta[].stateCount` | object | 상태별 페이지 수 |
| `stateCount["1"]` | number | 정상 페이지 |
| `stateCount["2"]` | number | 주의 페이지 |
| `stateCount["3"]` | number | 경고 페이지 |
| `stateCount["4"]` | number | 심각 페이지 |

### 3.6 병합 메타데이터 (_merge)

각 사이트의 출처 정보를 추적합니다.

```json
{
  "_merge": {
    "__source": "account@naver.com",
    "__accountId": "<encrypted_id>",
    "__fetchedAt": 1710555200000,
    "__version": 1,
    "__mergedFrom": "original-account@naver.com",
    "__mergedAt": 1710558800000,
    "__conflict": "description of conflict resolution"
  }
}
```

#### 필드 정의

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `__source` | string | Y | 원본 계정 이메일 |
| `__accountId` | string | Y | 암호화된 계정 ID |
| `__fetchedAt` | timestamp | Y | 데이터 가져온 시간 |
| `__version` | number | Y | 데이터 버전 |
| `__mergedFrom` | string | N | 병합 전 소스 (충돌 시) |
| `__mergedAt` | timestamp | N | 병합 시간 (충돌 시) |
| `__conflict` | string | N | 충돌 해결 설명 |

## 4. 병합 시맨틱스 (Merge Semantics)

### 4.1 병합 전략

#### `newer` 전략 (기본값)

```javascript
// 같은 사이트가 두 계정에 있을 경우
if (source.__fetchedAt > target.__fetchedAt) {
  // 더 최신 데이터 사용
  result = source;
  result._merge.__mergedFrom = source.__source;
  result._merge.__conflict = `${target.__source} had older data`;
}
```

#### `overwrite` 전략

```javascript
// 소스 데이터로 항상 덮어쓰기
result = source;
```

### 4.2 병합 규칙

| 시나리오 | 동작 |
|----------|------|
| **다른 사이트** | 두 사이트 모두 결과에 포함 |
| **같은 사이트, 다른 날짜** | `newer`: 최신 날짜 선택<br>`overwrite`: 소스 선택 |
| **같은 사이트, 같은 날짜** | 타겟 유지 (소스 무시) |
| **데이터가 없는 섹션** | `null` 또는 빈 객체 허용 |
| **부분 데이터** | 있는 데이터만 병합, 없는 필드는 `null` |

### 4.3 충돌 해결

충돌 발생 시 `_merge` 섹션에 기록이 남습니다:

```json
{
  "_merge": {
    "__source": "account-b@naver.com",
    "__mergedFrom": "account-b@naver.com",
    "__fetchedAt": 1710558800000,
    "__mergedAt": 1710558800000,
    "__version": 1,
    "__conflict": "account-a@naver.com had older data"
  }
}
```

## 5. API 레퍼런스

### 5.1 exportCurrentAccountData()

현재 계정 데이터를 내보냅니다.

```javascript
const exportData = exportCurrentAccountData();
// 반환: { __schema_version, __exported_at, __source_account, __source_enc_id, sites }
```

### 5.2 importAccountData(exportData, options)

데이터를 가져와서 병합합니다.

```javascript
const options = {
  strategy: 'newer',  // 또는 'overwrite'
  dryRun: false       // true면 실제 적용하지 않고 테스트만
};
const result = importAccountData(exportData, options);
console.log(`Added ${result.addedSites} sites, merged ${result.mergedSites}`);
```

### 5.3 getMergeRegistry()

병합 레지스트리를 조회합니다.

```javascript
const registry = getMergeRegistry();
// 반환: { lastMergedAt, accountCount, accounts: [...] }
```

### 5.4 validateDataSchema(data)

데이터 스키마를 검증합니다.

```javascript
const validation = validateDataSchema(data);
// 반환: { valid: boolean, errors: string[], version: string }
```

### 5.5 detectMergeConflicts(accounts)

병합 충돌을 감지합니다.

```javascript
const conflicts = detectMergeConflicts([accountA, accountB]);
// 반환: [{ site: "url", accounts: [...], reason: "..." }]
```

## 6. 사용 예제

### 6.1 데이터 내보내기

```javascript
// 계정 A에서 내보내기
const accountAData = exportCurrentAccountData();
// JSON 파일로 저장
localStorage.setItem('backup-account-a', JSON.stringify(accountAData));
```

### 6.2 데이터 가져오기

```javascript
// 계정 B에서 계정 A 데이터 가져오기
const accountAData = JSON.parse(localStorage.getItem('backup-account-a'));
const result = importAccountData(accountAData, { strategy: 'newer' });
console.log(`Added ${result.addedSites} sites, merged ${result.mergedSites}`);
```

### 6.3 다중 계정 병합

```javascript
// 여러 계정 데이터 병합
let merged = { sites: {} };
for (const accountData of [accountA, accountB, accountC]) {
  const result = mergeAccounts(merged, accountData, { strategy: 'newer' });
  merged = result.merged;
}
```

## 7. 스키마 마이그레이션

### 7.1 버전 업그레이드

```javascript
function migrateSchema(data, targetVersion) {
  const currentVersion = data.__schema_version || '1.0';

  if (currentVersion === targetVersion) {
    return data;  // 이미 최신
  }

  // 마이그레이션 로직...
  return migratedData;
}
```

### 7.2 하위 호환성

- v1.0 데이터는 v1.x에서 항상 호환됩니다.
- 누락된 필드는 기본값으로 처리됩니다.
- 알 수 없는 필드는 보존됩니다.

## 8. 제약사항

1. **오프라인 동작**: 모든 병합은 localStorage에서 이루어집니다.
2. **파일 크기**: 단일 JSON 파일은 ~50MB 제한 (브라우저 localStorage 한계).
3. **동시성**: 동시에 두 계정에서 편집하면 마지막 쓰기가 승리합니다.
4. **데이터 무결성**: 가져오기 전 반드시 스키마 검증을 수행하세요.

## 9. 버전 History

| 버전 | 날짜 | 변경사항 |
|------|------|----------|
| 1.0 | 2026-03-16 | 초기 스키마 정의 |
