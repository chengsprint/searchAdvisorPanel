# V2 JSON Schema Migration - 포괄적 코드 리뷰 보고서

## 📋 Executive Summary

이번 V2 JSON Schema 마이그레이션은 플랫 구조(V1)에서 중첩 구조(V2)로의 전환을 목표로 수행되었습니다. 전체적으로 잘 구현되어 있으나, 몇 가지 **치명적인 버그**와 **중요한 개선 사항**이 발견되었습니다.

---

## 🔴 치명적 문제 (Critical Issues) - 3건

### 1. `SCHEMA_VERSION` 및 `MERGE_REGISTRY_KEY` 미정의 오류

**위치**: `src/app/main/06-merge-manager.js`

**문제점**:
- `SCHEMA_VERSION`과 `MERGE_REGISTRY_KEY`가 `main.js`에서 정의되어 있지만, 모듈화된 파일에서 참조할 수 없음

**해결 방안**: `06-merge-manager.js` 상단에 정의 추가

### 2. `encId` 및 `accountLabel` 변수 미정의 오류

**위치**: `src/app/main/06-merge-manager.js`

**문제점**:
- `exportCurrentAccountData()`에서 `encId`, `accountLabel` 변수가 미정의

**해결 방안**: `03-data-manager.js`에서 이미 정의된 변수를 가져오도록 모듈 의존성 재구성

### 3. V2 Payload 구조 불일치

**위치**: `src/app/main/06-merge-manager.js`

**문제점**:
- `exportCurrentAccountData()`가 `ui`와 `stats` 필드를 누락

**해결 방안**: V2 스키마에 맞게 `ui`, `stats` 필드 추가

---

## 🟡 중요 문제 (Medium Priority Issues) - 8건

1. **Edge Case 처리 미흡** - 복수 계정(merged) 경우 첫 번째 계정만 사용
2. **Null/Undefined 체크 부족** - `account.dataBySite` 접근 전 체크 필요
3. **Demo Mode에서 V2 데이터 처리 미완성** - `accounts` 필드 확인 필요
4. **Backward Compatibility 부족** - V1→V2 변환 로직 보완 필요
5. **Race Condition 가능성** - async 함수 완료 대기 필요
6. **메모리 누수 가능성** - 이벤트 리스너 정리 필요
7. **일관성 없는 Error Handling** - 표준화 필요
8. **V2 Cache 무효화 로직 누락** - 데이터 갱신 시 캐시 무효화 필요

---

## 🟢 개선 제안 (Low Priority Issues) - 6건

1. Code Duplication - V2 헬퍼 함수 추출
2. Performance Optimization - 인덱스 캐싱 개선
3. Type Safety 개선 - JSDoc 추가
4. Logging 개선 - 구조화된 로깅
5. Testing Coverage - Edge case 테스트 추가
6. Documentation - V2 구조 문서화

---

## ✅ Positive Findings

1. **V2 Helper Functions 체계** - `01-helpers.js`에 잘 정리됨
2. **Caching 전략** - 5분 TTL Map 기반 캐싱
3. **URL Normalization** - 일관된 URL 처리
4. **Validation** - 구조 검증 기능
5. **Error Resilience** - 대부분 null/undefined 체크

---

## 📝 요약 및 권장사항

### 즉시 수정 필요 (P0)
1. `SCHEMA_VERSION`, `MERGE_REGISTRY_KEY` 정의 추가
2. `encId`, `accountLabel` 참조 해결
3. `exportCurrentAccountData()` V2 구조 완성 (`ui`, `stats` 추가)

### 조기 수정 필요 (P1)
1. Edge Case 처리 개선
2. Null/Undefined 체크 강화
3. Demo Mode V2 처리 완성
4. Backward Compatibility 개선
5. Race Condition 해결
6. Memory Leak 방지
7. Error Handling 표준화
8. Cache Invalidation 로직 추가

---

**보고서 작성일**: 2026-03-18
**리뷰 대상**: V2 JSON Schema Migration
**발견된 문제**: 총 17건 (치명적 3건, 중요 8건, 개선 6건)
