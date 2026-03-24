# SearchAdvisor Runtime

SearchAdvisor 패널 런타임 공개 저장소입니다.

## 포함 범위

- `src/`: 런타임 소스
- `dist/runtime.js`: 배포 런타임 정본
- `dist/loader.js`: 고정 로더 진입점
- `dist/stable.json`: stable 채널 매니페스트
- `merge.py`: 저장된 HTML 병합 도구

## 기본 명령

```bash
npm install
npm run build
npm run check
```

## Stable 릴리즈 갱신

```bash
npm run release:stable -- v2.0.5
```

## merge.py

같은 디렉터리의 saved HTML을 계정별 최신본 기준으로 병합합니다.

```bash
python merge.py
python merge.py --ref release
python merge.py --ref <branch-or-commit>
```

기본 ref는 `release` 입니다.
