# Phase 3 Bootstrap Reduction Roadmap (2026-03-21)

## 요약

Phase 2가 saved를 "같은 앱 + 다른 provider" 구조로 더 가깝게 만드는 단계였다면,
Phase 3는 남아 있는 bootstrap/compat/injection coupling을 더 줄이는 단계다.

핵심:

- 기능 안정화는 이미 충분하다.
- 이제는 남아 있는 구조적 거칠음을 줄인다.
- 단, payload core 의미는 마지막까지 보수적으로 다룬다.

## 왜 필요한가

현재도 Live / Saved / Merge는 잘 맞는다.
하지만 아직 아래 hotspot은 남아 있다.

- `buildSnapshotApiCompatScript()`
- `buildSnapshotShellBootstrapScript()`
- `injectSnapshotReactShell()`
- transitive serialization dependency

즉 지금부터는 "회귀 없는 상태"를 유지하면서
이 bootstrap/compat 층을 더 얇게 만드는 게 목적이다.

## 첫 번째 추천 slice

가장 먼저 권장하는 것은:

### `buildSnapshotApiCompatScript()` 책임 정리

이유:

1. legacy compat/runtime bridge라 경계가 비교적 명확함
2. payload normalization보다 fan-out이 작음
3. 이후 shell bootstrap / injection 정리를 위한 중간 발판이 됨

## 하지 말아야 할 것

- 초반부터 `normalizeSnapshotPayloadForOfflineShell()` 의미 변경
- fresh saved audit 없이 구조 변경 완료 선언
- live 흐름을 흔들며 saved를 맞추기

## 계속 지켜야 할 기준

```bash
npm run build
npm run check
node tests/merge-test.js
node tests/phase1-verify-runtime.js
node scripts/snapshot_workflow_audit.js <fresh-saved-html>
```

saved 기준:
- `failures: []`
- `pageErrors: []`
- `consoleErrors: []`

## 한 줄 결론

Phase 3는 “새 기능 추가”가 아니라
남은 bootstrap/compat coupling을 줄이는 후반 대공사 단계다.
