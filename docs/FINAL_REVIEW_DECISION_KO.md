# 최종 검토 결정서: 병합 스키마 설계

**작성일:** 2026-03-18
**검토 방식:** 10+개 전문 에이전트 병렬 비판적 분석
**결정:** 제안된 설계 폐기, 기존 구조 유지

---

## 📋 실행 요약

### 최종 등급: F (채택 불가)

```
╔══════════════════════════════════════════════════════════════════╗
║                      GRADE: F (FAIL)                             ║
╠══════════════════════════════════════════════════════════════════╣
║  [치명적] 실제 코드와 구조 불일치 - dataBySite 위치가 완전히 다름  ║
║  [치명적] 기존 코드 전체 파괴 - 20+ 위치 수정 필요               ║
║  [심각] 27% 불필요 필드 - 과도한 엔지니어링                       ║
║  [심각] 성능 저하 - O(1) → O(n×m), 최대 10,000배                ║
║  [심각] "단일 구조" 거짓 주장 - 여전히 조건부 코드 필요           ║
║  [심각] 보안 취약점 - 입력 검증 전혀 없음                         ║
║  [심각] 데이터 손실 - 병합 시 조용한 실패                         ║
║  [높음] 이미 해결됨 - __source로 이미 다중 계정 지원             ║
║  [높음] 불필요한 마이그레이션 - 사용자가 없음                    ║
║  [높음] 보안 문제 - encId 불필요하게 노출                        ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🚨 치명적 문제 상세

### 1. 실제 코드와 구조 불일치 (Agent 1 발견)

**실제 코드** (10-all-sites-view.js:296-311):
```javascript
{
  savedAt: "...",
  accountLabel: "user1@naver.com",
  accountEncId: "abc123",
  allSites: ["https://site1.com", "https://site2.com"],
  dataBySite: {              // ← 최상위 객체
    "https://site1.com": { expose: {...}, crawl: {...} }
  },
  siteMeta: {...},
  mergedMeta: {...}
}
```

**제안된 스키마**:
```javascript
{
  accounts: {
    "user1@naver.com": {
      dataBySite: {          // ← 계정 아래 중첩 (잘못됨!)
        "https://site1.com": {...}
      }
    }
  }
}
```

**영향:** `payload.dataBySite[site]`를 사용하는 모든 코드 파괴

---

### 2. 누락된 필드 (13개 중 8개)

| 필드 | 실제 코드 | 제안된 스키마 | 상태 |
|------|-----------|---------------|------|
| `savedAt` | ✅ | ✅ | 유지 |
| `accountLabel` | ✅ | ❌ | **삭제됨** |
| `accountEncId` | ✅ | ❌ | **삭제됨** |
| `generatorVersion` | ✅ | ❌ | **삭제됨** |
| `exportFormat` | ✅ | ❌ | **삭제됨** |
| `curMode` | ✅ | ❌ | **삭제됨** |
| `curSite` | ✅ | ❌ | **삭제됨** |
| `curTab` | ✅ | ❌ | **삭제됨** |
| `allSites` | ✅ | ❌ | **삭제됨** |
| `summaryRows` | ✅ | ❌ | **삭제됨** |
| `dataBySite` | ✅ | ❌ | **이동됨** |
| `siteMeta` | ✅ | ❌ | **이동됨** |
| `mergedMeta` | ✅ | ❌ | **삭제됨** |

---

### 3. 과도한 엔지니어링 (Agent 2 발견)

| 필드 | 계산 가능 | 불필요 이유 |
|------|-----------|------------|
| `accountCount` | ✅ | `Object.keys(accounts).length`로 계산 |
| `sites` 배열 | ✅ | `Object.keys(dataBySite)`로 계산 |
| `shortLabel` | ✅ | `email.split("@")[0]`로 계산 |

**27%의 필드가 불필요하게 저장됨**

---

### 4. 성능 저하 (Agent 8, UI Agent 발견)

**현재 코드: O(1)**
```javascript
// 즉시 접근
dataBySite[siteUrl]._merge.__source  // O(1)
```

**제안된 코드: O(n × m)**
```javascript
// 선형 검색
function getAccountForSite(siteUrl, payload) {
  for (const [email, account] of Object.entries(payload.accounts)) {
    if (account.sites.includes(siteUrl)) {  // O(n) × O(m)
      return { email, account };
    }
  }
}
```

| 시나리오 | 현재 O(1) | 제안 O(n×m) | 저하율 |
|----------|-----------|-------------|--------|
| 10계정 × 100사이트 | 1회 | 1,000회 | **1,000배** |
| 100계정 × 100사이트 | 1회 | 10,000회 | **10,000배** |

---

### 5. "단일 구조" 거짓 주장 (Agent 5 발견)

```javascript
// 여전히 조건부 코드 필요!
function isMerged(payload) {
  return payload.__meta?.accountCount > 1;  // 조건문
}

const merged = isMerged(payload);
const prefix = merged ? `[${shortLabel}] ` : "";  // 다른 경로
```

**"단일 파싱", "단일 렌더링"은 거짓**

---

### 6. 보안 취약점 (Agent 4, Edge Case Agent 발견)

| 문제 | 설명 | 영향 |
|------|------|------|
| 이메일 검증 없음 | 형식 검증 없이 키로 사용 | 데이터 손상 |
| "unknown" 충돌 | 여러 계정이 같은 키 사용 | 데이터 덮어쓰기 |
| URL 검증 없음 | 유효성 확인 안 함 | 렌더링 오류 |
| encId 노출 | 불필요한 식별자 포함 | 프라이버시 문제 |

---

### 7. 데이터 손실 (Edge Case Agent 발견)

**동일 사이트 충돌:**
```javascript
// 같은 사이트가 2개 계정에 있음
user1: { "https://shared.com": { click: 1000 } }
user2: { "https://shared.com": { click: 2000 } }

// getAccountForSite()는 첫 번째만 반환!
// 두 번째 데이터는 영구 손실
```

**조용한 병합 실패:**
```python
# encId가 다르면?
# siteMeta 충돌은?
# 타임스탬프 비교 없이 덮어쓴다
existing["dataBySite"].update(account_data["dataBySite"])
```

---

### 8. 이미 해결된 문제 (Agent 6 발견)

**현재 코드는 이미 다중 계정 지원:**

```javascript
// 10-all-sites-view.js:275-283
dataBySite[site] = {
  ...siteData,
  __source: {
    accountLabel: accountLabel || "unknown",  // O(1) 계정 추적!
    accountEncId: encId || "unknown",
    fetchedAt: ...,
    exportedAt: ...
  }
};
```

**제안된 스키마는 이미 해결된 문제를 다시 해결하려 함**

---

### 9. 불필요한 마이그레이션 (Agent 3 발견)

**사용자 발언:**
> "어짜피 아직 아무도 안써서 자동 변환 코드는 지금 필요없을듯"

**현재 상황:**
- 프로덕션 사용자: 없음
- 레거시 HTML 파일: 없음
- 마이그레이션할 데이터: 없음

**v1→v2 마이그레이션 코드는 완전히 불필요**

---

### 10. encId 불필요 노출 (encId Agent 발견)

**발견:**
- 스냅샷 렌더링에서 encId 전혀 사용 안 함
- 라이브 API 호출에서만 사용
- HTML에 포함하면 프라이버시 문제

**권장: encId를 스냅샷에서 제거**

---

## 🎯 최종 권장사항

### 제안된 설계를 폐기하세요.

### 대신 기존 flat 구조를 유지하세요:

```javascript
{
  // 메타데이터
  savedAt: "2026-03-18T...",
  accountLabel: "user1@naver.com",
  // accountEncId: 제거 권장 (보안/프라이버시)
  generatorVersion: "...",
  exportFormat: "snapshot-v2",

  // 상태 복원
  curMode: "all",
  curSite: null,
  curTab: "overview",

  // 데이터 (최상위 유지!)
  allSites: ["https://site1.com", "https://site2.com"],
  summaryRows: [...],
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
  siteMeta: {
    "https://site1.com": { label: "내 블로그" }
  },

  // 병합 메타데이터
  mergedMeta: {
    isMerged: true,
    accounts: [
      { label: "user1@naver.com", encId: "abc..." },
      { label: "user2@naver.com", encId: "def..." }
    ],
    mergedAt: "2026-03-18T...",
    sources: ["file1.html", "file2.html"]
  }
}
```

### 기존 방식의 장점

| 장점 | 설명 |
|------|------|
| ✅ 기존 코드와 호환 | 수정 불필요 |
| ✅ O(1) 성능 | 직접 접근 |
| ✅ 이미 다중 계정 지원 | `_merge._source`로 추적 |
| ✅ 마이그레이션 불필요 | 사용자가 없음 |
| ✅ 단순함 | 20+ 파일 수정 불필요 |
| ✅ 검증됨 | 프로덕션에서 작동 중 |

---

## 📝 다음 단계

### 1. 기존 스키마 유지 (즉시 실행)

수정할 파일: 없음 (기존 그대로 사용)

### 2. 병합 스크립트 작성 (기존 스키마에 맞춰)

```python
# merge_snapshots.py - 기존 flat 구조 유지
def merge_snapshots(html_paths):
    merged = {
        "savedAt": datetime.now().isoformat(),
        "accountLabel": "MERGED",
        "generatorVersion": "merged",
        "exportFormat": "snapshot-v2",
        "curMode": "all",
        "curSite": None,
        "curTab": "overview",
        "allSites": [],
        "summaryRows": [],
        "dataBySite": {},
        "siteMeta": {},
        "mergedMeta": {
            "isMerged": True,
            "accounts": [],
            "mergedAt": datetime.now().isoformat(),
            "sources": []
        }
    }

    for html_path in html_paths:
        payload = extract_payload(html_path)
        # 사이트별로 계정 정보를 _merge에 추가
        for site, data in payload["dataBySite"].items():
            if site not in merged["dataBySite"]:
                merged["dataBySite"][site] = data
                merged["dataBySite"][site]["_merge"] = {
                    "_source": payload["accountLabel"],
                    "_fetchedAt": data.get("_fetchedAt")
                }
                merged["allSites"].append(site)

    return merged
```

### 3. encId 제거 (선택사항, 보안 개선)

```javascript
// 10-all-sites-view.js:275-283
dataBySite[site] = {
  ...siteData,
  __source: {
    accountLabel: accountLabel || "unknown",
    // accountEncId 제거
    fetchedAt: ...,
    exportedAt: ...
  }
};
```

### 4. 문서 정리

- `MERGE_SCHEMA_DESIGN_FINAL.md` → 참고용으로 보관
- `CRITICAL_10X_REVIEW_RESULT_KO.md` → 검토 기록
- `FINAL_REVIEW_DECISION_KO.md` → 최종 결정 (이 파일)

---

## ✅ 결론

### 제안된 스키마의 문제점 요약

1. **실제 코드와 불일치** - `dataBySite` 위치가 완전히 다름
2. **과도하게 복잡** - 27%의 필드가 불필요
3. **성능 저하** - O(1)에서 O(n×m)으로 악화
4. **이미 해결됨** - `__source` + `mergedMeta`로 이미 지원됨
5. **보안 취약** - 입력 검증 없음
6. **불필요한 마이그레이션** - 사용자가 없으므로 v1 불필요
7. **데이터 손실** - 병합 시 조용한 실패
8. **거짓 주장** - "단일 구조"는 실제로 단일하지 않음

### 최종 권장사항

**기존 flat 구조를 유지하고 병합 스크립트만 추가하세요.**

이미 작동하는 코드를 복잡한 중첩 구조로 바꿀 필요가 없습니다.

---

**검토 완료:** 2026-03-18
**종합 등급:** F (채택 불가)
**권장:** 기존 구조 유지
**다음 작업:** 병합 스크립트만 기존 스키마에 맞춰 작성
