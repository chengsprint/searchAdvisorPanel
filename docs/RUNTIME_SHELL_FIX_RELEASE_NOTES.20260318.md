# Runtime Shell Fix Release Notes

Date: 2026-03-18
Release Tag: v2.0.1-runtime-shell-fix
Reference: release tag commit

## Summary

이번 릴리즈는 로컬 Chrome 및 실페이지 주입 환경에서 발생하던 runtime shell 초기화 오류를 안정화하는 핫픽스입니다.

대표 증상:

- `Cannot read properties of null (reading 'addEventListener')`
- shell UI 일부 또는 전체가 생성되지 않음
- DOMPurify 로드 실패 시 패널이 문자열처럼 깨져 보임
- 초기화 이후 `isMergedReport`, `accountLabel` 관련 연쇄 runtime error

## Root Cause

주요 원인은 다음과 같았습니다.

1. shell HTML이 sanitize 과정에서 DOMPurify 비가용 시 안전하지 않은 escape fallback을 타며 실제 DOM으로 렌더되지 않음
2. 그 결과 `#sadv-combo-btn`, `#sadv-tabs`, `#sadv-bd` 같은 핵심 요소가 생성되지 않음
3. 이후 이벤트 바인딩 코드가 null 대상에 접근하며 예외 발생
4. modular runtime 경로에서 일부 helper/global 참조(`isMergedReport`, `accountLabel`)가 안정적으로 보장되지 않음

## Implemented Fixes

### 1) DOMPurify fallback 복구

- built-in fallback sanitizer 추가
- DOMPurify 로드 실패 시에도 shell UI가 실제 DOM으로 생성되도록 수정
- `button`, `input`, `aria-*`, `data-*` 등 shell 구성에 필요한 태그/속성 허용 보강

### 2) Shell initialization hardening

- `comboBtn`, `tabsEl`, `modeBar`, `siteBar`, `labelEl`, `bdEl`에 대한 null 방어 추가
- 필수 shell 요소가 없을 경우 초기화를 중단하고 명시적 로그 출력
- snapshot/runtime 경로 모두 defensive initialization 적용

### 3) Runtime helper/global stabilization

- `isMergedReport()` helper를 modular runtime 경로에 추가
- `accountLabel` 참조를 TDZ-safe / global-safe 방식으로 정리

### 4) DOMPurify load-path cleanup

- CDN SRI 의존 제거
- head 미존재 환경에 대한 삽입 fallback 추가
- fallback sanitizer 경고는 1회만 출력되도록 변경

## Files Updated

- `src/00-polyfill.js`
- `src/app/main/01-helpers.js`
- `src/app/main/02-dom-init.js`
- `src/app/main/04-api.js`
- `src/app/main/07-ui-state.js`
- `src/app/main/09-ui-controls.js`
- `src/app/main/12-snapshot.js`
- `src/app/main/14-init.js`
- `src/app/main.js`
- `dist/runtime.js`

## Verification

다음 검증을 완료했습니다.

- `npm run build` 성공
- Chromium headless 환경 주입 테스트 수행
- 실제 페이지 컨텍스트(`https://example.com`)에서:
  - `#sadv-combo-btn` 존재 확인
  - `#sadv-tabs` 존재 확인
  - `#sadv-bd` 존재 확인
  - console error 0건 확인

## Recommended Usage

외부 테스트 시에는 아래 태그를 기준으로 사용하세요.

- `v2.0.1-runtime-shell-fix`
