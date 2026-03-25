# `src/` 디렉토리 요약

이 디렉토리는 브라우저에서 실행되는 SearchAdvisor 런타임의 상위 진입점 레이어입니다.

## 구성

- `00-polyfill.js`
  - 런타임이 기대하는 브라우저 호환 보조 코드를 먼저 로드합니다.
- `01-style.js`
  - 런타임 전역 스타일과 공통 CSS 주입을 담당합니다.
- `02-react-bundle.js`
  - 런타임이 기대하는 React/ReactDOM 번들 연결 지점을 제공합니다.
- `index.js`
  - 현재 앱 진입점입니다.
  - 실제 초기화는 `src/app/legacy-main.js`의 `initApp`으로 연결됩니다.
- `app/`
  - 실제 비즈니스 로직과 UI 로직이 들어 있는 앱 레이어입니다.

## 유지보수 포인트

- 상위 파일들은 로드 순서에 민감합니다.
- 실제 기능 수정은 대부분 `src/app/main/`에서 이뤄집니다.
- 빌드 스크립트는 `build.js`의 모듈 순서를 기준으로 이 파일들을 결합합니다.

## 관련 문서

- [루트 README](../README.md)
- [`src/app/` 문서](./app/README.md)
- [`src/app/main/` 문서](./app/main/README.md)
