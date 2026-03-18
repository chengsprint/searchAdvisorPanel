# P1 에러 메시지 개선 - 빠른 참조 가이드

## 개발자를 위한 빠른 참조

### ERROR_MESSAGES 상수 사용법

```javascript
// 1. 기본 사용
showError(ERROR_MESSAGES.NETWORK_ERROR, error, 'context-name');

// 2. 커스텀 메시지와 함께 사용
showError(
  ERROR_MESSAGES.DATA_LOAD_FAILED,
  technicalError,
  'fetchSiteData'
);
```

### 인라인 에러 UI 생성

```javascript
// 재시도 버튼이 있는 인라인 에러
bdEl.innerHTML = createInlineError(
  ERROR_MESSAGES.DATA_LOAD_FAILED,
  () => loadData(), // 재시도 콜백
  '다시 시도'      // 버튼 텍스트 (기본값: '다시 시도')
).outerHTML;

// 단순 메시지만 표시
const errorEl = createInlineError(ERROR_MESSAGES.NO_SITE_DATA);
bdEl.appendChild(errorEl);
```

### 주요 에러 메시지 카테고리

#### 네트워크/Fetch 에러
- `ERROR_MESSAGES.NETWORK_ERROR` - 네트워크 연결 문제
- `ERROR_MESSAGES.REQUEST_TIMEOUT` - 요청 시간 초과
- `ERROR_MESSAGES.MAX_RETRIES_EXCEEDED` - 최대 재시도 횟수 초과
- `ERROR_MESSAGES.INVALID_ENCID` - 사용자 정보 없음

#### 데이터 로딩 에러
- `ERROR_MESSAGES.DATA_LOAD_ERROR` - 데이터 로딩 중 오류
- `ERROR_MESSAGES.DATA_LOAD_FAILED` - 데이터 로딩 실패
- `ERROR_MESSAGES.NO_SITE_DATA` - 사이트 데이터 없음
- `ERROR_MESSAGES.EXPOSE_DATA_MISSING` - 기본 리포트 없음
- `ERROR_MESSAGES.DETAIL_DATA_MISSING` - 상세 정보 없음

#### 다운로드/내보내기 에러
- `ERROR_MESSAGES.DOWNLOAD_FAILED` - 파일 다운로드 실패
- `ERROR_MESSAGES.HTML_SAVE_ERROR` - HTML 저장 오류
- `ERROR_MESSAGES.EXPORT_INCOMPLETE` - 내보내기 불완전

#### 가져오기/병합 에러
- `ERROR_MESSAGES.IMPORT_FAILED` - 가져오기 실패
- `ERROR_MESSAGES.IMPORT_FORMAT_ERROR` - 파일 형식 오류
- `ERROR_MESSAGES.MERGE_FAILED` - 병합 실패
- `ERROR_MESSAGES.NO_VALID_ACCOUNTS` - 유효한 계정 없음

#### UI 에러
- `ERROR_MESSAGES.SITE_NOT_FOUND` - 사이트를 찾을 수 없음
- `ERROR_MESSAGES.SNAPSHOT_PANEL_NOT_FOUND` - 패널을 찾을 수 없음
- `ERROR_MESSAGES.RENDER_ERROR` - 렌더링 오류

### 코드 예시

#### 예시 1: API 호출 에러 처리
```javascript
async function fetchData(site) {
  if (!encId) {
    showError(ERROR_MESSAGES.INVALID_ENCID, null, 'fetchData');
    return null;
  }

  try {
    const response = await fetchWithRetry(url, options);
    return response.json();
  } catch (e) {
    showError(ERROR_MESSAGES.DATA_LOAD_FAILED, e, 'fetchData');
    return null;
  }
}
```

#### 예시 2: UI 에러 표시
```javascript
async function loadView() {
  try {
    const data = await fetchData();
    if (!data) {
      bdEl.innerHTML = createInlineError(
        ERROR_MESSAGES.NO_SITE_DATA,
        () => loadView(),
        '다시 로드'
      ).outerHTML;
      return;
    }
    renderView(data);
  } catch (e) {
    bdEl.innerHTML = createInlineError(
      ERROR_MESSAGES.RENDER_ERROR,
      () => location.reload(),
      '새로고침'
    ).outerHTML;
  }
}
```

#### 예시 3: 가져오기/내보내기 에러 처리
```javascript
function importData(exportData) {
  if (!exportData.__meta || !exportData.accounts) {
    return {
      success: false,
      error: ERROR_MESSAGES.IMPORT_FORMAT_ERROR
    };
  }

  try {
    // 데이터 처리 로직
    return { success: true };
  } catch (e) {
    showError(ERROR_MESSAGES.IMPORT_FAILED, e, 'importData');
    return { success: false, error: ERROR_MESSAGES.IMPORT_FAILED };
  }
}
```

### 에러 추적 시스템 연동

`showError()` 함수는 자동으로 `ERROR_TRACKING` 시스템에 에러를 리포팅합니다:

```javascript
// 자동 리포팅됨
showError(
  ERROR_MESSAGES.DATA_LOAD_FAILED,
  technicalError,
  'fetchSiteData'
);

// 수동으로도 가능
ERROR_TRACKING.reportError({
  type: 'userError',
  message: '사용자 정의 에러 메시지',
  technicalError: '기술적 에러 정보',
  context: 'context-name'
});
```

### UI 스타일

인라인 에러 UI는 일관된 스타일을 사용합니다:

```css
/* 컨테이너 */
padding: 20px;
text-align: center;
background: #0f172a;
border: 1px solid #334155;
border-radius: 12px;
margin: 16px 0;

/* 아이콘 */
font-size: 32px;
color: #ef4444;

/* 메시지 */
color: #f8fafc;
font-weight: 700;
font-size: 14px;

/* 버튼 */
background: #0ea5e9;
color: #f8fafc;
border: none;
border-radius: 6px;
font-size: 13px;
font-weight: 600;
cursor: pointer;
transition: background 0.2s;
```

### 모범 사례

1. **항상 사용자 친화적 메시지 사용**
   ```javascript
   // 좋음
   showError(ERROR_MESSAGES.DATA_LOAD_FAILED, e, 'context');

   // 나쁨
   alert("Failed to load data");
   ```

2. **재시도 기능 제공**
   ```javascript
   createInlineError(
     ERROR_MESSAGES.DATA_LOAD_FAILED,
     () => retryOperation(),
     '다시 시도'
   );
   ```

3. **기술적 에러는 콘솔에만**
   ```javascript
   // showError()가 자동으로 콘솔에 기록함
   showError(ERROR_MESSAGES.NETWORK_ERROR, e, 'context');
   ```

4. **컨텍스트 정보 포함**
   ```javascript
   showError(
     ERROR_MESSAGES.DATA_LOAD_FAILED,
     e,
     'fetchSiteData-crawl' // 명확한 컨텍스트
   );
   ```

---

## 빠른 참조 표

| 상황 | 사용할 메시지 | 재시드 버튼? |
|------|--------------|--------------|
| 네트워크 연결 실패 | `NETWORK_ERROR` | 예 |
| 요청 시간 초과 | `REQUEST_TIMEOUT` | 예 |
| 데이터 로딩 실패 | `DATA_LOAD_FAILED` | 예 |
| 사이트 데이터 없음 | `NO_SITE_DATA` | 아니오 |
| HTML 저장 실패 | `HTML_SAVE_ERROR` | 예 |
| 파일 형식 오류 | `IMPORT_FORMAT_ERROR` | 아니오 |
| 사용자 정보 없음 | `INVALID_ENCID` | 아니오 (페이지 새로고침) |

---

추가 문의사항이나 도움이 필요하면 전체 보고서를 참조하거나 개발팀에 문의해주세요.
