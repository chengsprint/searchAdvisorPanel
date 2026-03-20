# SearchAdvisor Loader + Stable Manifest Workflow

## 왜 이 구조를 도입하는가
기존처럼 외부 스크립트가 `runtime.js`를 직접 보면 두 가지 문제가 생깁니다.

1. 운영 반영 때마다 외부 스크립트의 URL을 다시 바꿔야 함
2. `@main`을 직접 보면 개발 중 테스트 푸시가 실사용자에게 바로 노출될 수 있음

이 문제를 피하기 위해, 운영 진입점은 아래처럼 단순화합니다.

- 외부 스크립트 → 항상 `loader.js`
- `loader.js` → 항상 `stable.json`
- `stable.json` → 현재 운영 승인된 `runtime.js` 태그 URL

즉 **외부 스크립트는 고정**, **실제 운영 버전은 manifest만 교체**하는 구조입니다.

---

## 파일 역할

### `dist/loader.js`
- 외부 스크립트가 고정으로 참조하는 진입점
- 동일 채널의 `stable.json`을 읽고 실제 runtime을 삽입
- manifest 실패 시 fallback runtime을 로드

### `dist/stable.json`
- 현재 운영 승인된 버전만 기록
- 사용자가 실제로 받는 runtime의 단일 source of truth

### `scripts/write_stable_manifest.js`
- `stable.json`을 수동 편집하다 실수하지 않도록 돕는 보조 도구

---

## GitHub 운영 방식 (가장 단순한 권장안)

### 개발용
- `main`
- 개발/테스트 푸시는 모두 여기서 수행
- 개인 테스트 시에는 `@main/dist/runtime.js` 또는 커밋 핀으로 확인

### 운영용
- `release` 브랜치를 하나 만든다
- 외부 스크립트는 **항상** 아래만 로드한다

```text
https://cdn.jsdelivr.net/gh/chengsprint/searchAdvisorPanel@release/dist/loader.js
```

즉, 실사용자는 `main`이 아니라 `release` 채널만 본다.

---

## 실제 배포 절차

### 1. 개발
- `main`에서 개발
- 필요하면 커밋 핀/`@main`으로 테스트

### 2. 릴리즈 확정
- 안정화되면 태그 생성
- 예: `v2.0.5`

### 3. 운영 승격
- `release` 브랜치에서 `dist/stable.json`을 아래처럼 바꾼다
- 또는 `node scripts/write_stable_manifest.js v2.0.5 v2.0.4`

예:
```json
{
  "channel": "stable",
  "version": "v2.0.5",
  "runtime_url": "https://cdn.jsdelivr.net/gh/chengsprint/searchAdvisorPanel@v2.0.5/dist/runtime.js",
  "fallback_url": "https://cdn.jsdelivr.net/gh/chengsprint/searchAdvisorPanel@v2.0.4/dist/runtime.js"
}
```

### 4. 푸시
- `release` 브랜치 푸시
- 그러면 외부 스크립트는 그대로인데 운영 버전만 자동 갱신된다

---

## 중요한 설계 의도

### 왜 `loader.js`를 별도 파일로 두는가
- 외부 스크립트는 가능한 한 안 바뀌어야 한다
- 운영/테스트 분리를 URL 1개 수준에서 끝내기 위해서다

### 왜 `stable.json`을 별도 파일로 두는가
- "어느 버전이 운영판인지"를 코드가 아니라 데이터 파일 1개로 명확히 선언하기 위해서다
- 초보자도 `version`과 `runtime_url`만 보면 현재 운영판을 이해할 수 있다

### 왜 `main`을 운영으로 직접 쓰지 않는가
- 개발 중 테스트 푸시가 실사용자에게 바로 반영되면 위험하다
- 운영 반영은 반드시 "승격" 단계가 있어야 한다

---

## 절대 하면 안 되는 것

1. 외부 스크립트가 `@main/dist/runtime.js`를 직접 보게 만들기
2. 운영 채널 없이 커밋 핀 URL을 외부 코드에 직접 박아두기
3. stable manifest 없이 "마지막으로 기억나는 태그"를 수동으로 여기저기 붙여넣기

---

## 다음 작업자가 반드시 지켜야 할 규칙

1. 운영 사용자용 URL은 `runtime.js` 직접 링크가 아니라 `loader.js`여야 한다
2. 운영 반영은 `stable.json` 수정으로만 한다
3. `main` 푸시는 개발용이지 운영 배포가 아니다
4. 새 버전 배포 전에는 태그 생성과 저장본 감사가 먼저 끝나야 한다

