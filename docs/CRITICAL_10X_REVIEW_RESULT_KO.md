# 병합 스키마 10회 비판적 재점검 종합 보고서

**작성일:** 2026-03-18
**검토 방식:** 10개 병렬 에이전트 비판적 분석
**상태:** ✅ 완료

---

## 🚨 실행 요약: 제안된 설계는 채택 불가

### 종합 평가: F (실패)

| 평가 항목 | 등급 | 상태 |
|----------|------|------|
| 실제 코드와 일치 | F | ❌ 완전 불일치 |
| 과도한 엔지니어링 | F | ❌ 27% 불필요 필드 |
| "단일 구조" 주장 | F | ❌ 거짓 주장 |
| 성능 | D | ❌ O(1)→O(n×m)로 저하 |
| 보안 | D | ❌ 이메일 검증 없음 |
| 호환성 | F | ❌ 기존 코드 전체 파괴 |

---

## 1. 실제 코드와의 불일치 (치명적)

### 1.1 dataBySite 위치 오류

**실제 코드** (10-all-sites-view.js:307):
```javascript
return {
  savedAt: savedAtIso(new Date()),
  accountLabel: accountLabel || "unknown",
  accountEncId: encId || "unknown",
  allSites: [...allSites],
  dataBySite,        // ← 최상위 객체
  siteMeta: {...},
  mergedMeta: {...}
};
```

**제안된 스키마** (MERGE_SCHEMA_DESIGN_FINAL.md):
```javascript
{
  "accounts": {
    "user1@naver.com": {
      "dataBySite": {    // ← 계정 아래 중첩 (잘못됨!)
        "https://site.com": {...}
      }
    }
  }
}
```

**영향:** `payload.dataBySite[site]`를 사용하는 모든 코드가 파괴됨

### 1.2 누락된 필드

| 필드 | 실제 코드 | 제안된 스키마 | 상태 |
|------|-----------|---------------|------|
| `savedAt` | ✅ | ✅ | 유지 |
| `accountLabel` | ✅ | ❌ | **삭제됨** |
| `accountEncId` | ✅ | ❌ (중첩) | **이동/삭제** |
| `generatorVersion` | ✅ | ❌ | **삭제됨** |
| `exportFormat` | ✅ | ❌ | **삭제됨** |
| `curMode` | ✅ | ❌ | **삭제됨** |
| `curSite` | ✅ | ❌ | **삭제됨** |
| `curTab` | ✅ | ❌ | **삭제됨** |
| `allSites` | ✅ | ❌ (계산됨) | **삭제됨** |
| `summaryRows` | ✅ | ❌ | **삭제됨** |
| `dataBySite` | ✅ | ❌ (중첩) | **이동됨** |
| `siteMeta` | ✅ | ❌ (중첩) | **이동됨** |
| `mergedMeta` | ✅ | ❌ | **삭제됨** |
| `stats` | ✅ | ❌ | **삭제됨** |

**13개 필드 중 8개가 삭제 또는 이동됨**

---

## 2. 과도한 엔지니어링 (27% 불필요)

### 2.1 중복 필드 목록

| 필드 | 계산 가능 여부 | 위치 | 문제점 |
|------|---------------|------|--------|
| `accountCount` | ✅ `Object.keys(accounts).length` | `__meta` | 동기화 필요 |
| `sites` 배열 | ✅ `Object.keys(dataBySite)` | `accounts.{email}` | 병합 로직 복잡 |
| `shortLabel` | ✅ `email.split("@")[0]` | (사용만 함) | 문서에서 제거됐지만 사용됨 |

### 2.2 단일 진실 공급원 위반

```python
# 잘못된 예: accountCount 저장
"__meta": {
    "accountCount": len(merged_accounts)  # 동기화 필요!
}

# 올바른 예: 계산으로 처리
def account_count(self):
    return len(self.accounts)
```

**27%의 필드가 불필요하게 저장됨**

---

## 3. "단일 구조" 주장은 거짓

### 3.1 구조적 차이가 여전히 존재

```javascript
// 단일 계정
{ "__meta": { "accountCount": 1 }, "accounts": { "email": {...} } }

// 병합된 계정
{ "__meta": { "accountCount": 2 }, "accounts": { "email1": {...}, "email2": {...} } }
```

### 3.2 조건부 코드 경로가 여전히 필요

```javascript
// 여전히 조건문 필요!
function isMerged(payload) {
  return payload.__meta?.accountCount > 1;
}

const merged = isMerged(payload);
const prefix = merged ? `[${shortLabel}] ` : "";  // 다른 코드 경로
```

**"단일 파싱", "단일 렌더링"은 거짓 주장**

---

## 4. 성능 저하 (O(1) → O(n×m))

### 4.1 제안된 헬퍼 함수

```javascript
// MERGE_SCHEMA_DESIGN_FINAL.md:188-195
function getAccountForSite(siteUrl, payload) {
  for (const [email, account] of Object.entries(payload.accounts)) {
    if (account.sites.includes(siteUrl)) {  // O(n) × O(m)
      return { email, account };
    }
  }
  return null;
}
```

**시간 복잡도: O(n × m)**
- n = 계정 수
- m = 사이트 수

### 4.2 현재 코드의 O(1) 접근

```javascript
// 실제 코드 (03-data-manager.js:189-194)
dataBySite[site] = {
  ...siteData,
  __source: {
    accountLabel: accountLabel || "unknown",  // O(1) 접근!
    accountEncId: encId || "unknown"
  }
};

// 사용: dataBySite[siteUrl]._merge.__source  (즉시 접근)
```

### 4.3 성능 비교

| 시나리오 | 현재 O(1) | 제안 O(n×m) | 저하율 |
|----------|-----------|-------------|--------|
| 10계정 × 100사이트 | 1회 | 1,000회 | **1,000배** |
| 100계정 × 100사이트 | 1회 | 10,000회 | **10,000배** |
| 드롭다운 렌더링 (100사이트) | 100회 | 100,000회 | **1,000배** |

**제안된 "최적화"가 실제로는 성능 저하**

---

## 5. 이메일을 객체 키로 사용의 문제점

### 5.1 보안 문제

| 문제 | 설명 | 영향 |
|------|------|------|
| 입력 검증 없음 | 이메일 형식 검증 없이 키로 사용 | 데이터 손상 |
| "unknown" 충돌 | 여러 계정이 같은 키 사용 | 데이터 덮어쓰기 |
| 특수 문자 | `@`, `.`이 포함된 키 | 악세스 불편 |
| 예약어 | `constructor`, `toString` | 프로토타입 오염 |

### 5.2 실제 코드는 encId 사용

```javascript
// 06-merge-manager.js:441
registry.accounts[sourceEncId] = {  // encId를 키로 사용!
  label: sourceAccount,
```

**설계 문서와 실제 코드 불일치**

---

## 6. 이미 해결된 문제를 다시 해결

### 6.1 현재 코드는 이미 병합 지원

```javascript
// 10-all-sites-view.js:275-283
dataBySite[site] = {
  ...siteData,
  __source: {
    accountLabel: accountLabel || "unknown",  // 계정 추적 이미 있음!
    accountEncId: encId || "unknown",
    fetchedAt: siteData.__cacheSavedAt || new Date().toISOString(),
    exportedAt: savedAtIso(new Date()),
  }
};
```

### 6.2 mergedMeta 이미 존재

```javascript
// 12-snapshot.js:309
mergedMeta: typeof getMergedMetaState === "function" ? getMergedMetaState() : null
```

**제안된 스키마는 이미 해결된 문제를 다시 해결하려 함**

---

## 7. 불필요한 v1→v2 마이그레이션

### 7.1 사용자 발언

> "어짜피 아직 아무도 안써서 자동 변환 코드는 지금 필요없을듯"

### 7.2 현재 상황

- **프로덕션 사용자:** 없음
- **레거시 HTML 파일:** 없음
- **마이그레이션할 데이터:** 없음

### 7.3 마이그레이션 코드 낭비

```python
# scripts/merge_snapshots.py:119-142
@classmethod
def _migrate_v1_to_v2(cls, legacy: Dict[str, Any]) -> Dict[str, Any]:
    # 24줄의 불필요한 코드
    # 마이그레이션할 데이터가 없음!
```

**v1을 만들지 말고 v2를 직접 만들어야 함**

---

## 8. 파이썬 스크립트의 취약점

### 8.1 패턴 매칭 신뢰성

```python
# scripts/merge_snapshots.py:87-91
PATTERNS = [
    r'window\.EXPORT_PAYLOAD\s*=\s*({.*?});\s*\/\/\s*EXPORT_PAYLOAD',
    r'window\.EXPORT_PAYLOAD\s*=\s*({.*?});',
    r'EXPORT_PAYLOAD\s*=\s*({.*?});',
]
```

| 문제 | 설명 |
|------|------|
| 압축된 JavaScript | 공백/줄바꿈 없으면 실패 |
| 여러 스크립트 태그 | 잘못된 매칭 가능 |
| 주석 변경 | 첫 번째 패턴 실패 |

### 8.2 오류 처리

```python
# Line 196
except Exception as e:
    print(f"  ❌ 오류: {e}")
    continue  # 조용히 계속?
```

**조용한 실패는 디버깅을 어렵게 만듦**

---

## 9. 최종 권장사항

### 9.1 채택하지 말아야 할 이유 요약

| 이유 | 중요도 | 설명 |
|------|--------|------|
| 기존 코드 파괴 | 🔴 치명적 | 20+ 위치 수정 필요 |
| 과도한 엔지니어링 | 🔴 심각 | 27% 불필요 필드 |
| 성능 저하 | 🔴 심각 | 최대 10,000배 느려짐 |
| 거짓 주장 | 🟡 높음 | "단일 구조"는 거짓 |
| 보안 취약점 | 🟡 높음 | 입력 검증 없음 |
| 이미 해결됨 | 🟡 높음 | `__source`로 이미 지원 |

### 9.2 권장 접근법

**옵션 A: 기존 구조 유지 (권장)**

```javascript
{
  savedAt: "2026-03-18T...",
  accountLabel: "user1@naver.com",
  accountEncId: "abc123...",
  allSites: ["https://site1.com", ...],
  dataBySite: {
    "https://site1.com": {
      expose: {...},
      crawl: {...},
      backlink: {...},
      _merge: {
        _source: "user1@naver.com",  // O(1) 계정 추적
        _fetchedAt: 1234567890
      }
    }
  },
  siteMeta: {...},
  mergedMeta: {               // 병합 메타데이터
    isMerged: true,
    accounts: [...],
    mergedAt: "..."
  }
}
```

**장점:**
- ✅ 기존 코드와 호환
- ✅ O(1) 성능 유지
- ✅ 이미 다중 계정 지원
- ✅ 마이그레이션 불필요

**옵션 B: 최소 변경만**

병합 스크립트만 추가, 스키마는 변경하지 않음:

```python
# merge_snapshots.py - 기존 스키마 유지하며 병합
def merge_snapshots(html_paths):
    merged = {
        "savedAt": datetime.now().isoformat(),
        "accountLabel": "MERGED",
        "mergedMeta": {...},
        "allSites": [],
        "dataBySite": {},
        "siteMeta": {}
    }
    # 사이트별로 계정 정보를 _merge에 추가
```

---

## 10. 결론

### 10.1 제안된 설계의 문제점

1. **실제 코드와 불일치:** `dataBySite` 위치가 완전히 다름
2. **과도하게 복잡:** 27%의 필드가 불필요
3. **성능 저하:** O(1)에서 O(n×m)으로 악화
4. **이미 해결됨:** `__source` + `mergedMeta`로 이미 지원됨
5. **불필요한 마이그레이션:** 사용자가 없으므로 v1 불필요

### 10.2 최종 권장사항

**제안된 스키마를 폐기하고 기존 구조를 유지하라.**

기존 코드의 `__source` + `mergedMeta` 접근법이:
- 더 간단함
- 더 빠름 (O(1))
- 이미 작동함
- 마이그레이션이 필요 없음

### 10.3 다음 단계

1. 제안된 스키마 문서를 참고용으로만 보관
2. 기존 flat 구조 유지
3. 병합 스크립트만 기존 스키마에 맞춰 작성
4. `__source` 필드 표준화 문서 작성

---

**검토 완료:** 2026-03-18
**종합 등급:** F (채택 불가)
**권장:** 기존 구조 유지
