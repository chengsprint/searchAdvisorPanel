# SearchAdvisor Runtime 2.0.2 Release Notes

Date: 2026-03-19
Release Tag: `v2.0.2`

## Summary

이번 패치 릴리즈는 실제 SearchAdvisor 사용 화면에서 확인된 3가지 문제를 직접 수정합니다.

- `encId` 탐지 실패로 인한 진단 API 호출 실패
- section title HTML 보조 라벨이 문자열로 노출되는 렌더링 버그
- 상단 액션 버튼(`새로고침`, `저장`) 줄바꿈/비율 깨짐

## User-Reported Symptoms

- `사용자 정보를 찾을 수 없어요. 서치어드바이저 페이지에서 다시 실행해주세요.`
- `클릭 랭킹 TOP 2 <SPAN STYLE=...>90일 합계</SPAN>` 형태의 문자열 노출
- 오른쪽 상단 버튼 텍스트 줄바꿈
- 일부 그래프/사이트별 화면의 의미 없는 0값 표시

## Root Cause

### 1) `encId` 탐지 로직 퇴행

modular runtime의 `ACCOUNT_UTILS.getEncId()`가 `window.__NUXT__.state.authUser.encId`만 확인하고 있었고,
예전 monolith에 있던 fallback(`enc_id`, window scan, resource URL scan)이 빠져 있었습니다.

### 2) helper escape 정책 충돌

`secTitle()`가 plain text 전용처럼 `escHtml()`를 먼저 적용하면서,
내부에서 의도적으로 전달한 HTML 보조 라벨까지 문자열로 escape하고 있었습니다.

### 3) shell action button layout 부족

상단 버튼에 `white-space: nowrap`, `min-width`, `flex-shrink` 제어가 부족해
좁은 폭에서 `새로고 / 침`, `저 / 장`처럼 줄바꿈이 발생했습니다.

## What Changed

### Runtime identity / account detection

- `findNuxtAuthUser()` helper 추가
- `findEncIdFallback()` helper 추가
- 지원 범위 확장:
  - `authUser.encId`
  - `authUser.enc_id`
  - window object scan
  - resource URL scan

### Rendering helpers

- `secTitle()`가 HTML subtitle을 유지하도록 수정
- `showTip()`가 tooltip HTML을 그대로 sanitizer에 전달하도록 수정

### UI shell layout

- `#sadv-refresh-btn`, `#sadv-save-btn`에 nowrap/min-width/flex-shrink 보강

## Files Updated

- `src/app/main/00-constants.js`
- `src/app/main/01-helpers.js`
- `src/app/main/02-dom-init.js`
- `dist/runtime.js`

## Validation

- `npm run build` 성공
- mock `authUser.enc_id` 주입 환경에서 account badge / shell 렌더 확인
- helper/DOM 경로 기준 null addEventListener 회귀 없음

## Recommended Re-Test

실제 테스트 시에는 기존 페이지를 새로고침한 뒤, 아래 고정 태그 버전을 다시 로드하는 것을 권장합니다.

```js
(() => {
  const url = 'https://cdn.jsdelivr.net/gh/chengsprint/searchAdvisorPanel@v2.0.2/dist/runtime.js?t=' + Date.now();
  const s = document.createElement('script');
  s.src = url;
  s.onload = () => console.log('[SearchAdvisor] loaded:', url);
  s.onerror = (e) => console.error('[SearchAdvisor] load failed:', url, e);
  document.head.appendChild(s);
})();
```
