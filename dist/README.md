# `dist/` 디렉토리 요약

이 디렉토리는 공개 배포 산출물만 보관합니다.

## 구성

- `runtime.js`
  - 브라우저에 주입되는 메인 런타임 번들
- `loader.js`
  - 안정 채널 로더 진입점
- `stable.json`
  - stable 채널이 실제 어떤 runtime.js를 가리키는지 정의하는 매니페스트

## 운영 원칙

- 공개 저장소의 `dist/`에는 배포에 필요한 최소 파일만 둡니다.
- 테스트용 HTML, 데모 파일, 임시 브라우저 산출물은 남기지 않습니다.
- stable 반영은 `loader.js -> stable.json -> runtime.js` 순으로 이뤄집니다.

## 관련 문서

- [`scripts/` 문서](../scripts/README.md)
- [루트 README](../README.md)
