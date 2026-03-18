# V2 헬퍼 함수 최종 통합 가이드

## 📋 개요

두 에이전트의 결과를 종합하여 최종 V2 헬퍼 함수를 작성했습니다. 이 가이드를 따라 코드베이스에 즉시 적용할 수 있습니다.

---

## 🎯 주요 특징

### 1. 에이전트 1 결과 반영
- ✅ 12개 핵심 함수 추가
- ✅ Map 기반 캐싱 (TTL 5분)
- ✅ v1 레거시 완전 제거 (빅뱅 전략)

### 2. 에이전트 2 결과 반영
- ✅ 순환 참조 해결: 인덱스 매개변수 사용
- ✅ 함수 중복 제거: `normalizeSiteUrl()` 추출
- ✅ O(n) → O(1) 성능 최적화

### 3. 추가 최적화
- ✅ 상수(P, PAYLOAD_FIELDS) 활용
- ✅ JSDoc 주석 완비
- ✅ ES5 호환 코드 (화살표 함수 제거)
- ✅ 모듈 export 지원

---

## 📁 파일 구조

### 1. 생성된 파일
```
/home/seung/.cokacdir/workspace/yif7zotu/V2_HELPERS_FINAL.js
```

### 2. 통합 대상 파일
```
/home/seung/.cokacdir/workspace/yif7zotu/src/app/main/01-helpers.js
```

---

## 🔧 통합 절차

### Step 1: 상수 정의 확인

`00-constants.js`에 다음 상수가 이미 정의되어 있는지 확인:

```javascript
// 기존 상수 (이미 있음)
const P = {
  VERSION: "1.0",
  MODE: CONFIG.MODE.ALL,
  ROOT: {
    SAVED_AT: "savedAt",
    ALL_SITES: "allSites",
    CUR_MODE: "curMode",
    CUR_SITE: "curSite",
    CUR_TAB: "curTab",
    DATA_BY_SITE: "dataBySite",
    SITE_META: "siteMeta",
    MERGED_META: "mergedMeta",
    META: "__meta"  // 추가 필요
  },
  // ...
};
```

### Step 2: V2 상수 추가

`00-constants.js` 파일 끝에 다음을 추가:

```javascript
// ============================================================
// V2 PAYLOAD CONSTANTS
// ============================================================

const PAYLOAD_V2 = {
  VERSION: "20260318-payload-contract-v2",
  DATA_FORMAT: "sadv_snapshot_v2",
  GENERATOR: "SearchAdvisor Runtime",
};

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
```

### Step 3: 헬퍼 함수 추가

`01-helpers.js` 파일의 **485번째 줄** (`escHtml` 함수 끝) 바로 다음에:

```javascript
// ============================================================
// V2 PAYLOAD HELPER FUNCTIONS
// ============================================================

// [V2_HELPERS_FINAL.js 내용을 여기에 붙여넣기]
```

### Step 4: P.ROOT.META 상수 추가

`00-constants.js`의 P.ROOT 객체에 META 추가:

```javascript
const P = {
  // ...
  ROOT: {
    SAVED_AT: "savedAt",
    ALL_SITES: "allSites",
    CUR_MODE: "curMode",
    CUR_SITE: "curSite",
    CUR_TAB: "curTab",
    DATA_BY_SITE: "dataBySite",
    SITE_META: "siteMeta",
    MERGED_META: "mergedMeta",
    META: "__meta"  // ← 이 줄 추가
  },
  // ...
};
```

---

## 📊 함수 목록 (총 21개)

### 캐시 관리 (3개)
| 함수 | 설명 |
|------|------|
| `clearV2Cache()` | 모든 캐시 초기화 |
| `createV2CacheEntry(value)` | 캐시 엔트리 생성 (내부) |
| `getV2Cached(key)` / `setV2Cached(key, value)` | 캐시 조회/저장 (내부) |

### 검증 (2개)
| 함수 | 설명 |
|------|------|
| `isV2Payload(payload)` | V2 페이로드 확인 |
| `validateV2Payload(payload)` | 구조 검증 |

### URL 정규화 (1개)
| 함수 | 설명 |
|------|------|
| `normalizeSiteUrl(url)` | URL 정규화 (중복 제거용) |

### 계정 작업 (3개)
| 함수 | 설명 |
|------|------|
| `getAccountCount(payload)` | 계정 수 반환 |
| `getAccountEmails(payload)` | 모든 이메일 반환 |
| `getAccountByEmail(payload, email)` | 특정 계정 반환 |

### 사이트 작업 (3개)
| 함수 | 설명 | 복잡도 |
|------|------|--------|
| `getAllSites(payload)` | 모든 사이트 목록 | O(n) |
| `getAccountForSite(siteUrl, payload)` | 사이트 소유자 찾기 | **O(1)** |
| `hasSite(siteUrl, payload)` | 사이트 존재 확인 | **O(1)** |

### 사이트 데이터 (3개)
| 함수 | 설명 |
|------|------|
| `getSiteData(siteUrl, payload)` | 사이트 데이터 반환 |
| `getSiteMeta(siteUrl, payload)` | 사이트 메타데이터 반환 |
| `getSiteLabel(siteUrl, payload)` | 사이트 라벨 반환 |

### UI 상태 (2개)
| 함수 | 설명 |
|------|------|
| `getUIState(payload)` | UI 상태 조회 |
| `setUIState(payload, state)` | UI 상태 설정 |

### 통계 (3개)
| 함수 | 설명 |
|------|------|
| `getStats(payload)` | 통계 데이터 반환 |
| `getSummary(payload)` | 요약 정보 반환 |
| `getSiteOwnership(payload)` | 사이트 소유권 맵 |

### 생성 (2개)
| 함수 | 설명 |
|------|------|
| `createEmptyV2Payload(email, encId)` | 빈 V2 페이로드 생성 |
| `cloneV2Payload(payload)` | 페이로드 복제 |

---

## 🧪 빌드 검증 명령어

### 1. 빌드 실행
```bash
cd /home/seung/.cokacdir/workspace/yif7zotu
node build.js
```

### 2. 빌드 결과 확인
```bash
# 런타임 파일 생성 확인
ls -lh dist/runtime.js

# 데모 파일 생성 확인
ls -lh dist/demo.html
```

### 3. 문법 검증
```bash
# ESLint가 있는 경우
npx eslint src/app/main/01-helpers.js

# 구문 오류만 확인
node -c src/app/main/01-helpers.js
```

### 4. 테스트 실행 (있는 경우)
```bash
npm test
# 또는
yarn test
```

---

## ⚠️ 주의사항

### 1. 빅뱅 마이그레이션
- v1 호환 코드 완전 제거
- `isV1Payload()` 같은 함수 없음
- 기존 v1 데이터는 마이그레이션 필요

### 2. 상수 의존성
- `P`, `PAYLOAD_FIELDS`, `PAYLOAD_V2` 상수 필수
- `00-constants.js` 먼저 수정 필요

### 3. 캐시 정책
- TTL: 5분
- 최대 100개 엔트리 (자동 정리)
- 키는 `savedAt` 기반

### 4. 성능 특성
- `getAccountForSite()`: O(1) (인덱스 사용)
- `getAllSites()`: O(n) (캐시됨)
- 첫 호출 시 인덱스 빌드 필요

---

## 🚀 사용 예시

### 예시 1: 사이트 데이터 조회
```javascript
// 기존 방식 (v1)
const siteData = payload.dataBySite[siteUrl];

// V2 방식
const siteData = getSiteData(siteUrl, payload);
```

### 예시 2: 전체 사이트 목록
```javascript
// 기존 방식 (v1)
const allSites = payload.allSites;

// V2 방식
const allSites = getAllSites(payload);
```

### 예시 3: UI 상태 조회
```javascript
// 기존 방식 (v1)
const mode = payload.curMode;
const site = payload.curSite;

// V2 방식
const { curMode, curSite, curTab } = getUIState(payload);
```

---

## 📝 비판적 검토

### 장점
1. ✅ 완전한 모듈화 (21개 함수)
2. ✅ 일관된 인터페이스
3. ✅ 성능 최적화 (O(1) lookup)
4. ✅ 캐싱으로 중복 계산 방지
5. ✅ 상수 기반 유지보수성

### 단점/위험
1. ⚠️ 상수 의존성 높음 (순환 참조 위험)
2. ⚠️ 빅뱅 전환이므로 기존 데이터 호환성 없음
3. ⚠️ 캐시 정책이 하드코딩됨 (5분 고정)
4. ⚠️ 에러 처리가 부족함 (null 반환만)

### 개선 제안
1. 캐시 TTL을 설정 가능하게 만들기
2. 에러 타입 구분 (NotFoundError vs InvalidPayload)
3. 로깅 추가 (디버깅용)
4. 타입 검증 강화 (runtime type check)

---

## ✅ 통합 체크리스트

- [ ] `00-constants.js`에 PAYLOAD_V2 상수 추가
- [ ] `00-constants.js`에 PAYLOAD_FIELDS 상수 추가
- [ ] `00-constants.js`의 P.ROOT.META 상수 추가
- [ ] `01-helpers.js` 485번 줄 후에 V2 헬퍼 함수 추가
- [ ] 빌드 실행 (`node build.js`)
- [ ] 빌드 결과 확인 (`dist/runtime.js` 생성)
- [ ] 문법 검증 (`node -c src/app/main/01-helpers.js`)
- [ ] (선택) 단위 테스트 작성
- [ ] (선택) 통합 테스트 실행

---

## 📞 문제 발생 시

### 문제: "P is not defined"
**원인**: `00-constants.js`가 `01-helpers.js`보다 나중에 로딩됨
**해결**: `build.js`에서 로딩 순서 확인

### 문제: "PAYLOAD_FIELDS is not defined"
**원인**: V2 상수가 추가되지 않음
**해결**: `00-constants.js`에 PAYLOAD_FIELDS 추가

### 문제: 빌드 실패
**원인**: 문법 오류 또는 화살표 함수 사용
**해결**: `V2_HELPERS_FINAL.js`의 화살표 함수를 `function`으로 변경

---

## 📚 참고 문서

- [최종 JSON 스키마 v2](./FINAL_JSON_SCHEMA_V2_COMPLETE_KO.md)
- [빅뱅 마이그레이션 계획](./BIGBANG_MIGRATION_DETAILED_PLAN_KO.md)
- [에이전트 1 결과](./docs/)
- [에이전트 2 결과](./docs/)

---

**작성일**: 2026-03-18
**버전**: Final 1.0
**상태**: ✅ 코드 작성 완료, 통합 대기
