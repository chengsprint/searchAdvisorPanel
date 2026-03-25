# `.github/` 디렉토리 요약

이 디렉토리는 저장소 자동화 설정을 담습니다.

## 구성

- `workflows/ci.yml`
  - lint / build / unit / integration / e2e / security 파이프라인 정의

## 주의점

- 현재 공개 저장소는 최소화되어 있어, 일부 잡은 `--if-present` 형태로 느슨하게 구성되어 있습니다.
- 실제 필수 품질 게이트는 `npm run build`, `npm run check` 쪽입니다.

## 관련 문서

- [루트 README](../README.md)
- [`scripts/` 문서](../scripts/README.md)
