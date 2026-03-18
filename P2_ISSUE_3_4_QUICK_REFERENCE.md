# P2 Issue #3, #4 Quick Reference

## P2-3: API 응답 검증

### 사용 방법

```javascript
// API 응답 검증
const validation = validateApiResponse(responseData, 'EXPOSE');
if (!validation.valid) {
  console.error('Validation failed:', validation.errors);
}

// 안전한 JSON 파싱
const data = await safeParseJson(response, 'EXPOSE');
```

### 지원 API 타입

- `EXPOSE` - 노출 데이터 API
- `CRAWL` - 크롤링 데이터 API
- `BACKLINK` - 백링크 데이터 API
- `DIAGNOSIS_META` - 진단 메타 API

## P2-4: 번들 크기 최적화

### 현재 번들 크기

```
총 크기: 672.72 KB
목표: 620 KB
달성도: 48%
```

### 최적화 방법

1. **상수 외부화** - `00-constants-external.js`
2. **코드 압축** - JSDoc 제거, 함수 최적화
3. **미사용 코드 제거** - index 아이콘 제거
4. **Optional Chaining** - `?.` 연산자 사용

### 추가 최적화 필요

- React 코드 스플리팅
- Terser 압축
- CSS 압축
- 지연 로딩

## 파일 위치

- API 검증: `/tmp/worktree-p2/src/app/main/04-api.js`
- 외부 상수: `/tmp/worktree-p2/src/app/main/00-constants-external.js`
- 보고서: `/tmp/worktree-p2/P2_ISSUE_3_4_COMPLETION_REPORT.md`

## 빌드 명령

```bash
cd /tmp/worktree-p2
node build.js
```
