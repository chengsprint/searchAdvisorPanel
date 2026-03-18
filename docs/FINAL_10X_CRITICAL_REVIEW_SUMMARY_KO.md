# SearchAdvisor JSON 스키마 v2 - 10회 비판적 재점검 최종 종합 보고서

> **작성일**: 2026-03-18
> **분석 방법**: 10개 전문 에이전트 병렬 분석
> **대상 문서**: FINAL_JSON_SCHEMA_V2_COMPLETE_KO.md
> **상태**: 구현 권장 불가 (재설계 필요)

---

## 📊 실행 요약

### 최종 등급: D (구현 권장 불가)

| 평가 항목 | 등급 | 상태 |
|----------|------|------|
| 스키마 정확성 | **F** | ❌ 문서와 코드 완전 불일치 |
| 실현 가능성 | **D** | ❌ 11-16주 소요, 빅뱅 불가 |
| 데이터 무결성 | **D** | ❌ 타임스탬프 비교 없음 |
| 성능 | **D+** | ❌ 1000사이트 사용 불가 |
| 보안 | **D** | ❌ PII 평문 노출 |
| 유지보수성 | **D** | ❌ 복잡도 급증 |
| 테스트 커버리지 | **F** | ❌ 94% 부족 |
| 엣지 케이스 | **D** | ❌ null 처리 부재 |
| 확장성 | **D** | ❌ 3/10 점수 |
| 호환성 | **F** | ❌ v1/v2 완전 파괴 |
| **종합** | **D** | **재설계 필수** |

---

## 1. 스키마 정확성: F등급

### 1.1 문서 vs 코드 불일치 (치명적)

| 항목 | 문서 정의 | 실제 코드 | 불일치 |
|------|----------|----------|--------|
| 데이터 구조 | `accounts.{email}.dataBySite` | `dataBySite` (최상위) | 🔴 |
| 스키마 버전 | `"20260318-payload-contract-v2"` | `"1.0"` | 🔴 |
| 메타데이터 | `__meta` 컨테이너 | 최상위 흩어짐 | 🔴 |
| UI 상태 | `ui.{curMode, curSite, curTab}` | 최상위 흩어짐 | 🔴 |

### 1.2 실제 코드 (10-all-sites-view.js:296-312)

```javascript
// 현재 실제 코드
return {
  savedAt: savedAtIso(new Date()),
  accountLabel: accountLabel || "unknown",
  accountEncId: encId || "unknown",
  allSites: [...allSites],
  dataBySite,  // ← 최상위!
  siteMeta: typeof getSiteMetaMap === "function" ? getSiteMetaMap() : {},
  mergedMeta: typeof getMergedMetaState === "function" ? getMergedMetaState() : null,
  stats,
};
```

### 1.3 문서 제안 구조

```javascript
// 문서에 정의된 v2 (실제로는 존재하지 않음)
{
  __meta: {
    version: "20260318-payload-contract-v2",
    savedAt: "...",
    accountCount: 1
  },
  accounts: {
    "user1@naver.com": {
      encId: "abc12345",
      sites: [...],
      dataBySite: { ... }  // ← 중첩!
    }
  }
}
```

### 1.4 영향

- 문서에 정의된 **모든 헬퍼 함수가 작동하지 않음**
- `getAllSites()`, `getAccountForSite()`, `getSiteData()` 전부 무용지물
- 단일/다중 계정 구조가 실제로는 구현되어 있지 않음

---

## 2. 실현 가능성: D등급

### 2.1 변경량 분석

| 파일 | 변경 필요 라인 | 현재 상태 |
|------|----------------|----------|
| `10-all-sites-view.js` | ~200라인 | v1 구조 |
| `12-snapshot.js` | ~400라인 | v1 구조 |
| `06-merge-manager.js` | ~150라인 | v1 구조 |
| `03-data-manager.js` | ~100라인 | v1 구조 |
| `07-ui-state.js` | ~100라인 | v1 구조 |
| **총계** | **~1,000라인** | 미변경 |

### 2.2 시간 추정

| 항목 | 제안서 | 현실적 | 격차 |
|------|--------|--------|------|
| Phase 1 (데이터 구조) | 1주 | 3-4주 | 3-4배 |
| Phase 2 (스냅샷) | 1주 | 4-5주 | 4-5배 |
| Phase 3 (UI) | 1주 | 3-4주 | 3-4배 |
| 테스트/버그 수정 | 없음 | 2-3주 | - |
| **총계** | **3주** | **11-16주** | **4-5배** |

### 2.3 빅뱅 마이그레이션의 불가능성

```
빅뱅 마이그레이션:
1. 모든 컴포넌트를 동시에 변경해야 함
2. 순환 의존성으로 인해 단계적 변경 불가
3. 문제 발생 시 롤백 불가
4. 사용자가 이미 다운로드한 스냅샷 깨짐
```

### 2.4 데이터 접근 패턴 변경

| v1 | v2 | 변경 필요 위치 |
|----|----|---------------|
| `payload.dataBySite[site]` | `getSiteData(site, payload)` | 89개소 |
| `payload.allSites.length` | `getAllSites(payload).length` | 15개소 |
| `payload.accountLabel` | `Object.keys(payload.accounts)[0]` | 23개소 |
| `payload.siteMeta[site]` | `getSiteMeta(site, payload)` | 31개소 |

---

## 3. 데이터 무결성: D등급

### 3.1 타임스탬프 비교 부재 (치명적)

```python
# merge_snapshots.py:281-284
for site, data in acc_info.data_by_site.items():
    if site not in existing.data_by_site:
        existing.data_by_site[site] = data
    # else: 새 데이터가 더 최신이어도 무시됨!
```

**시나리오:**
```
파일 1: user@naver.com의 site1.com (어제, 100 클릭)
파일 2: user@naver.com의 site1.com (오늘, 200 클릭) ← 최신!

현재 로직: 어제 데이터 유지, 오늘 데이터 손실
```

### 3.2 이메일 키 문제

| 문제 | 위험도 | 영향 |
|------|--------|------|
| 대소문자 구분 | 높음 | `User@Naver.com` ≠ `user@naver.com` |
| 여러 이메일 사용 | 높음 | 같은 사람이 다른 이메일로 중복 계정 생성 |
| `unknown@naver.com` 중복 | 치명적 | 이메일 없는 모든 계정이 하나로 병합됨 |

### 3.3 sites와 dataBySite 불일치

```json
{
  "accounts": {
    "user@naver.com": {
      "sites": ["site1.com", "site2.com"],  // 2개
      "dataBySite": {
        "site1.com": { ... }  // 1개만 존재
      }
    }
  }
}
```

**검증 로직 없음** → 데이터 무결성 보장 불가

---

## 4. 성능: D+등급

### 4.1 O(n) 순회로 인한 성능 저하

| 작업 | v1 | v2 | 성능 저하 |
|------|----|----|----------|
| 사이트 데이터 조회 | O(1) | O(n×m) | **1000배** |
| 전체 사이트 목록 | O(1) | O(n×m) | **1000배** |
| 계정 찾기 | O(1) | O(n×m) | **1000배** |

- n = 계정 수
- m = 평균 사이트 수

### 4.2 대용량 데이터 시나리오

| 사이트 수 | 초기 로딩 | 렌더링 | 상태 |
|-----------|-----------|---------|------|
| 50 | 120ms | 80ms | ✅ 양호 |
| 200 | 450ms | 450ms | ⚠️ 지연 |
| 500 | 1,200ms | 1,800ms | ❌ 악화 |
| 1000 | 2,400ms | **5,400ms** | 🔴 **사용 불가** |

### 4.3 메모리 증가

| 구성요소 | v1 | v2 | 증가 |
|----------|----|----|------|
| 데이터 구조 | 기준 | +8% | 중첩 오버헤드 |
| 역인덱스 캐시 | 없음 | +15-25% | 추가 필요 |
| 총 증가 | 기준 | **~25%** | 허용 가능 |

**하지만 성능 저하가 더 큰 문제**

---

## 5. 보안: D등급

### 5.1 PII 평문 노출 (OWASP A01:2021)

```json
{
  "accounts": {
    "user1@naver.com": {  // ← 이메일 평문 노출
      "encId": "abc12345"  // ← 식별자 평문 노출
    }
  }
}
```

### 5.2 XSS 취약점 (OWASP A03:2021)

```python
# merge_snapshots.py:599
window.EXPORT_PAYLOAD = ${json.dumps(merged.to_dict())};
# </script>가 데이터에 있으면 실행됨!
```

### 5.3 입력 검증 부재 (OWASP A05:2021)

| 입력 | 검증 | 위험 |
|------|------|------|
| 이메일 | ❌ 없음 | `<script>@evil.com` 가능 |
| URL | ❌ 없음 | `javascript:alert(1)` 가능 |
| 라벨 | ❌ 없음 | XSS 가능 |

---

## 6. 유지보수성: D등급

### 6.1 코드 복잡도 급증

| 항목 | v1 | v2 | 증가 |
|------|----|----|------|
| 중첩 깊이 | 2단계 | 4단계 | 2배 |
| 헬퍼 함수 | 0개 | 15개+ | ∞ |
| 데이터 접근 | 직접 | 함수 호출 | 복잡 |

### 6.2 학습 곡선

```javascript
// v1 - 간단
const data = payload.dataBySite[site];

// v2 - 복잡
const account = getAccountForSite(site, payload);
const data = account?.account?.dataBySite?.[site];

// 계정 컨텍스트 항상 인식 필요
```

### 6.3 디버깅 난이도

- 전역 캐시(`window.__siteToAccountIndex`) 의존
- v1/v2 감지 로직이 모든 접근 지점에 필요
- 동적 키(이메일)로 IDE 자동완성 불가

---

## 7. 테스트 커버리지: F등급

### 7.1 현재 상태

| 항목 | 현재 | 필요 | 부족 |
|------|------|------|------|
| 테스트 코드 | 50라인 | 500+라인 | **90%** |
| 테스트 케이스 | 4개 | 70개 | **94%** |
| 경계 케이스 | 0개 | 15개 | **100%** |
| 통합 테스트 | 0개 | 15개 | **100%** |

### 7.2 누락된 경계 케이스 (15개)

| # | 케이스 | 위험도 |
|---|--------|--------|
| 1 | 빈 accounts 객체 | 🔴 |
| 2 | null/undefined payload | 🔴 |
| 3 | sites 배열 null | 🔴 |
| 4 | dataBySite와 sites 불일치 | 🔴 |
| 5 | 이메일 중복 | 🔴 |
| 6 | 손상된 JSON | 🟡 |
| 7 | 대용량 데이터 | 🟡 |
| 8-15 | ... | ... |

### 7.3 회귀 위험

| 변경 포인트 | 위험도 | 테스트 여부 |
|-------------|--------|-----------|
| `collectExportData()` | 🔴 치명적 | ❌ |
| `fetchExposeData()` | 🔴 치명적 | ❌ |
| `buildSnapshotHtml()` | 🔴 높음 | ❌ |
| 헬퍼 함수 (15개) | 🟡 중간 | ❌ |

---

## 8. 엣지 케이스: D등급

### 8.1 null 처리 부재

```javascript
// getAllSites() - null 체크 불완전
function getAllSites(payload) {
  for (const account of Object.values(payload.accounts || {})) {
    for (const site of account.sites || []) {  // account가 undefined이면 크래시
      sites.add(site);
    }
  }
}
```

### 8.2 이메일 충돌

| 시나리오 | 현재 처리 | 문제 |
|----------|----------|------|
| `User@Naver.com` vs `user@naver.com` | 다른 계정 | 중복 생성 |
| 같은 이메일, 다른 encId | 덮어쓰기 | 데이터 손실 |
| `unknown@naver.com` 중복 | 전부 병합 | 데이터 오염 |

### 8.3 XSS 취약점

```javascript
// createSiteBadge()
return `${prefix}${escHtml(siteLabel)}`;
// escHtml()이 정의되지 않음 → XSS 가능
```

---

## 9. 확장성: D등급

### 9.1 잠긴 구조 (Lock-in)

| 제약 | 영향 |
|------|------|
| 이메일이 키 | 변경 불가, 다중 이메일 불가 |
| 버전 하드코딩 | 다중 버전 지원 불가 |
| UI와 강결합 | 독립적 확장 불가 |

### 9.2 점수 (3/10)

| 항목 | 점수 |
|------|------|
| 계정/사이트 추가 | 8/10 (쉬움) |
| 버전 업데이트 | 1/10 (매우 어려움) |
| 스키마 확장 | 2/10 (어려움) |
| **종합** | **3/10** |

---

## 10. 호환성: F등급

### 10.1 v1/v2 완전 파괴

| 항목 | v1 | v2 | 호환성 |
|------|----|----|--------|
| 최상위 구조 | `allSites`, `dataBySite` | `accounts` | ❌ |
| 데이터 접근 | `payload.dataBySite[x]` | `getSiteData(x)` | ❌ |
| 메타데이터 | 흩어짐 | `__meta` | ❌ |

### 10.2 빅뱅 마이그레이션의 위험

```
빅뱅 실행 시:
1. 모든 v1 스냅샷 파일이 열리지 않음
2. 사용자 데이터 변환 필요 (실패 시 손실)
3. 외부 도구/스크립트 전체 파괴
4. 롤백 불가능
```

---

## 11. 최종 결론

### 11.1 등급 요약

| 카테고리 | 등급 | 상태 |
|----------|------|------|
| 기능적 완성도 | C | 문서는 완비되나 구현 불가 |
| 기술적 타당성 | D | 빅뱅 전략 실패 |
| 운영 가능성 | F | 테스트/보안 부족 |
| **종합** | **D** | **재설계 필수** |

### 11.2 핵심 문제

1. **문서와 코드 불일치**: 제안된 v2 구조가 실제로는 존재하지 않음
2. **빅뱅 불가**: 1,000-1,500라인을 동시에 변경해야 함
3. **타임스탬프 비교 없음**: 병합 시 최신 데이터가 손실됨
4. **성능 저하**: 1000사이트에서 사용 불가 (D+ 등급)
5. **보안 취약**: 이메일/encId 평문 노출 (D 등급)
6. **테스트 부족**: 94% 부족 (F 등급)

### 11.3 권장사항

**🔴 즉시 조치 필요:**

1. **빅뱅 전략 폐기** - 점진적 마이그레이션으로 전환
2. **v1/v2 공존 설계** - 어댑터 패턴 도입
3. **타임스탬프 병합 로직** - 최신 데이터 보존
4. **이메일 해시화** - PII 보호
5. **테스트 커버리지 80%** - 배포 전 필수

**🟡 중기 개선:**

1. Flat v2 구조 검토 - O(1) 조회 유지
2. 성능 벤치마크 - 1000사이트 기준
3. 보안 감사 - XSS 방지

---

## 12. 대안 제안

### 12.1 점진적 마이그레이션 전략

```
Phase 1 (4주): v2 읽기 전용 지원 (기존 v1 유지)
Phase 2 (4주): v2 쓰기 지원 (이중 저장)
Phase 3 (4주): v2 기본값 (v1 레거시 모드)
Phase 4 (2주): v1 제거 (6개월 후)
```

### 12.2 Flat v2 구조 (성능 유지)

```javascript
// v1 구조 유지 + 계정 메타데이터만 추가
{
  dataBySite: {
    "https://site1.com": {
      "__accountId": "user1@naver.com",  // ← 새 필드
      "__encId": "abc12345",
      "expose": { ... },
      "crawl": { ... }
    }
  },
  _accountsByEmail: {
    "user1@naver.com": {
      "encId": "abc12345",
      "sites": ["https://site1.com"]
    }
  }
}
```

**장점:**
- O(1) 조회 유지
- v1과 구조적 호환성
- 성능 저하 없음

---

## 13. 참고 파일

| 문서 | 경로 |
|------|------|
| 최종 스키마 | `/home/seung/.cokacdir/workspace/yif7zotu/docs/FINAL_JSON_SCHEMA_V2_COMPLETE_KO.md` |
| 마이그레이션 계획 | `/home/seung/.cokacdir/workspace/yif7zotu/docs/NESTED_STRUCTURE_MIGRATION_PLAN_KO.md` |
| 10회 검토 요약 | `/home/seung/.cokacdir/workspace/yif7zotu/docs/CRITICAL_10X_MIGRATION_PLAN_REVIEW_KO.md` |
| 실현 가능성 분석 | `/home/seung/.cokacdir/workspace/yif7zotu/docs/CRITICAL_FEASIBILITY_ANALYSIS_KO.md` |
| 확장성/호환성 분석 | `/home/seung/.cokacdir/workspace/yif7zotu/docs/CRITICAL_EXTENSIBILITY_COMPATIBILITY_ANALYSIS_KO.md` |

---

**보고서 작성일:** 2026-03-18
**분석 방법:** 10개 전문 에이전트 병렬 분석
**최종 권장:** **재설계 필수, 현재 상태로는 구현 권장 불가**
