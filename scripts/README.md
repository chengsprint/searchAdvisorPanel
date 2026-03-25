# `scripts/` 디렉토리 요약

이 디렉토리는 공개 저장소에 남겨 둔 최소한의 운영/검증 보조 스크립트를 담습니다.

## 구성

- `verify_snapshot_contract.js`
  - 저장본 HTML 직렬화 계약이 깨지지 않았는지 정적으로 검사합니다.
  - live 런타임만 정상이고 saved HTML이 깨지는 회귀를 빠르게 잡기 위한 가드레일입니다.
- `write_stable_manifest.js`
  - `dist/stable.json`을 일관된 형식으로 갱신하는 최소 도구입니다.
  - 운영 반영 시 stable 채널 runtime URL과 fallback URL을 관리합니다.

## 역할 경계

- 이 디렉토리는 테스트 러너 전체를 담지 않습니다.
- 런타임 코드 변경이 아니라, 검증과 배포 메타 작업을 보조하는 용도입니다.

## 관련 문서

- [`src/app/main/` 문서](../src/app/main/README.md)
- [`dist/` 문서](../dist/README.md)
