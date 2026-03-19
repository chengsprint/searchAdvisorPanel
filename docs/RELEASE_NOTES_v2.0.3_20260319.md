# SearchAdvisor Runtime 2.0.3 Release Notes

Date: 2026-03-19
Release Tag: `v2.0.3`

## Summary

이번 패치 릴리즈는 캐시 상태 가시성과 수동 갱신 신뢰성을 보강하는 hotfix입니다.

대표적으로 다음 문제가 해결되었습니다.

- 기본 12시간 캐시 정책이 UI에 드러나지 않아 현재 상태를 판단하기 어려운 문제
- 자동 갱신까지 남은 시간이 보이지 않아 사용자가 캐시 만료 시점을 추정해야 했던 문제
- 상단 `새로고침` 버튼이 모듈 빌드 runtime에서 실제 전체 갱신으로 연결되지 않던 문제

## User-Reported Symptoms

- "캐시 갱신 타임이나 이런거 12시간 기준 맞지?"
- "캐시 자동갱신 잔여시간이랑 이런거 다 표시해줘야지"
- "지금 새로고침 버튼도 안먹는거같음"

## Root Cause

### 1) 캐시 메타데이터는 있었지만 shell header로 연결되지 않음

캐시 timestamp는 site list / site data 경로에 존재했지만,
모듈 runtime의 UI state snapshot에 일관되게 포함되지 않아 헤더에서 활용할 수 없었습니다.

### 2) 모듈 빌드 경로에서 액션 버튼 바인딩 누락

legacy/monolith 경로에는 `window.__sadvApi`와 수동 refresh 진입점이 있었지만,
현재 배포에 사용되는 modular source에는 같은 연결이 빠져 있었습니다.

### 3) 상태 변경 후 header 메타 재동기화 부족

초기 렌더 이후 캐시 잔여시간과 최신 저장 시각을 상단에 다시 밀어 넣는 sync 경로가 약해,
화면에는 유효한 캐시 정보가 있어도 사용자가 확인할 수 없었습니다.

## What Changed

### Cache visibility

- 헤더에 `캐시저장`, `자동갱신까지`, `12시간 TTL` 메타 칩 추가
- live cache metadata 계산 helper 추가
- `window.__SEARCHADVISOR_UI_STATE__.getState()` 응답에 다음 필드 포함
  - `cacheMeta.updatedAt`
  - `cacheMeta.remainingMs`
  - `cacheMeta.ttlMs`
  - `cacheMeta.sourceCount`

### Manual refresh wiring

- `#sadv-refresh-btn` 클릭 시 `runFullRefreshPipeline({ trigger: "manual" })` 호출되도록 복구
- 새로고침 중 버튼 상태를 `로딩 중...`으로 명확히 표시
- modular runtime에 `window.__sadvApi.refresh()` / `download()` / `close()` 재노출

### Header sync consistency

- UI notify 시점마다 header cache meta를 재동기화하도록 보강
- close/save/refresh 액션 바인딩을 modular runtime 기준으로 재정렬

## Files Updated

- `src/app/main/02-dom-init.js`
- `src/app/main/07-ui-state.js`
- `src/app/main/09-ui-controls.js`
- `CHANGELOG.md`
- `dist/runtime.js`

## Validation

### Build

- `npm run build` 성공

### Browser / Playwright Checks

- 헤더에 아래 텍스트 노출 확인
  - `캐시저장 03. 19. 07:22`
  - `자동갱신까지 12시간 0분`
  - `12시간 TTL`
- `window.__SEARCHADVISOR_UI_STATE__.getState().cacheMeta` 존재 확인
- `#sadv-refresh-btn` 클릭 시 `trigger: "manual"` 이벤트 발생 확인
- 새로고침 버튼 클릭 직후 `로딩 중...` 상태 진입 확인

## Operator Notes

- 기본 데이터 TTL은 `12시간`입니다.
- 테스트 시에는 `window.__SADV_TEST_TTL_MS`로 TTL override가 가능합니다.
- 남은 시간은 현재 메모리/로컬 캐시 timestamp 기준으로 계산됩니다.

## Recommended Re-Test

실페이지 테스트 시에는 새로고침 후 아래 커밋 또는 태그 기준으로 다시 로드하는 것을 권장합니다.

```js
(() => {
  const url = 'https://cdn.jsdelivr.net/gh/chengsprint/searchAdvisorPanel@v2.0.3/dist/runtime.js?t=' + Date.now();
  const s = document.createElement('script');
  s.src = url;
  s.onload = () => console.log('[SearchAdvisor] loaded:', url);
  s.onerror = (e) => console.error('[SearchAdvisor] load failed:', url, e);
  document.head.appendChild(s);
})();
```
