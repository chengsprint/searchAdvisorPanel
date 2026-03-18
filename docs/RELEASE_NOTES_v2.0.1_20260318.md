# SearchAdvisor Runtime 2.0.1 Release Notes

Date: 2026-03-18
Release Tag: `v2.0.1`

## Summary

이번 릴리즈는 로컬 Chrome/외부 페이지에서 runtime shell이 초기화되는 과정에서 발생하던 치명적인 런타임 오류를 수정하는 hotfix입니다.

대표적으로 다음 문제가 해결되었습니다.

- `Cannot read properties of null (reading 'addEventListener')`
- DOMPurify 로드 실패 시 UI shell이 문자열로 출력되며 버튼/탭 DOM이 사라지는 문제
- modular runtime 경로에서 발생하던 `isMergedReport is not defined`
- TDZ/전역 참조 누락으로 인한 `accountLabel is not defined`

## Root Cause

문제는 단일 원인이 아니라 다음 조건이 겹치며 발생했습니다.

1. DOMPurify CDN 로드 실패 또는 로드 타이밍 지연
2. fallback sanitizer가 shell HTML까지 escape 처리
3. 그 결과 `#sadv-combo-btn`, `#sadv-tabs`, `#sadv-bd` 등 필수 DOM이 생성되지 않음
4. 이후 공통 UI 초기화 코드가 null 대상에 `addEventListener`를 바인딩하며 예외 발생
5. modular runtime 경로에서 일부 helper/global 참조가 누락되어 연쇄 런타임 오류 발생

## What Changed

### Runtime / Security

- DOMPurify fallback을 내장 sanitizer 방식으로 교체해 shell HTML이 유지되도록 수정
- shell 구성에 필요한 `button`, `input`, `aria-*`, `data-*` 속성 허용 보강
- DOMPurify CDN script의 문제를 유발하던 integrity 의존 제거
- fallback sanitizer 경고를 1회만 출력하도록 정리

### UI Initialization

- combo/tabs/mode 바인딩에 null-safe guard 추가
- shell DOM 생성 직후 필수 scaffold 존재 여부를 검증하도록 보강
- 초기화 진입 시 필수 shell 요소가 없으면 안전하게 중단하도록 수정

### Runtime Consistency

- `isMergedReport()` 전역 helper 추가
- `accountLabel` 조회를 전역 bare identifier 대신 안전한 runtime state 기반으로 변경

## Files Updated

- `src/00-polyfill.js`
- `src/app/main/01-helpers.js`
- `src/app/main/02-dom-init.js`
- `src/app/main/07-ui-state.js`
- `src/app/main/09-ui-controls.js`
- `src/app/main/12-snapshot.js`
- `src/app/main/14-init.js`
- `src/app/main.js`
- `src/app/main/04-api.js`
- `dist/runtime.js`

## Validation

### Build

- `npm run build` 성공

### Browser Runtime Checks

- Chromium 기반 주입 테스트에서 다음 DOM 생성 확인
  - `#sadv-combo-btn`
  - `#sadv-tabs`
  - `#sadv-bd`
- 실페이지 컨텍스트에서 console error 0건 확인

## Recommended Verification

외부 환경에서 아래를 우선 확인하는 것을 권장합니다.

1. 최신 `main` 브랜치 pull
2. 최신 `dist/runtime.js` 기준으로 브라우저 콘솔 또는 주입 환경에서 실행
3. shell header / mode bar / combo / tabs 표시 여부 확인
4. console에 null `addEventListener` 오류 재발 여부 확인

## Release Intent

이 릴리즈는 기능 추가보다 runtime shell 안정성과 외부 테스트 가능 상태 확보를 목표로 하는 patch hotfix입니다.
