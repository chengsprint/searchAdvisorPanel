# Loader + Stable Manifest Contract

이 문서는 `dist/loader.js` 와 `dist/stable.json`의 운영 계약을 설명한다.

## 왜 이 파일들이 필요한가
기존에는 외부 스크립트가 `runtime.js`를 직접 로드했다.  
이 방식은 두 가지 문제가 있다.

1. 운영 버전이 바뀔 때마다 외부 스크립트 URL도 다시 바꿔야 한다.
2. `@main`을 직접 로드하면 개발 중 테스트 푸시가 실사용자에게 섞일 수 있다.

그래서 운영 경로를 다음처럼 분리한다.

- 외부 스크립트 → `loader.js`
- `loader.js` → `stable.json`
- `stable.json` → 현재 운영 승인된 `runtime.js`

즉, **진입점은 고정**하고 **실제 운영판만 manifest로 교체**한다.

---

## 파일 역할

### `loader.js`
- 외부 스크립트가 고정으로 바라볼 단일 진입점
- 동일 채널의 `stable.json`을 읽음
- manifest가 가리키는 `runtime_url`을 삽입
- manifest가 깨졌을 때 fallback runtime으로 한 번 더 시도

### `stable.json`
- 현재 운영판 runtime의 단일 source of truth
- 사람이 읽어도 바로 이해할 수 있어야 한다
- 복잡한 로직을 넣지 않는다

---

## 채널 원칙

### 개발 채널
- `main`
- 자유롭게 개발/테스트/푸시

### 운영 채널
- `release`
- 실사용 외부 스크립트는 `@release/dist/loader.js`만 바라본다

이 규칙을 지키면:
- 개발 중 실험은 `main`
- 실사용 운영판은 `release`
로 깔끔하게 분리된다.

---

## 절대 바꾸면 안 되는 설계 의도

1. 외부 스크립트가 `runtime.js`를 직접 보게 되돌리지 말 것
2. 운영 반영을 `stable.json`이 아니라 `main` 푸시로 처리하지 말 것
3. loader에 과도한 분기/채널/환경 옵션을 넣지 말 것

이 loader는 "최소 운영 장치"여야 한다.  
복잡한 배포 플랫폼이 아니라, 초보자도 관리 가능한 안전핀 역할만 맡는다.

---

## 수정 시 체크리스트

1. `node --check dist/loader.js`
2. `node scripts/write_stable_manifest.js <version> [fallback]`
3. `npm run build`
4. `npm run check`
5. 실사용 외부 스크립트가 참조할 URL이 `@release/dist/loader.js`인지 다시 확인

