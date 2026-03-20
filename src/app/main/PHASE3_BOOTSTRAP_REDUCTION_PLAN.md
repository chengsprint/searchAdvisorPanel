# Phase 3 Bootstrap Reduction Plan

## 1. 목적

Phase 2가 "공통 contract 정리 + saved bootstrap 책임 분리 시작"이었다면,
Phase 3의 목적은 남아 있는 saved 전용 bootstrap/compat/string 조립 책임을
**더 적은 coupling으로 재배치**하는 것이다.

핵심 문장:

> Phase 3는 기능 확장이 아니라  
> `12-snapshot.js`와 주변 compat/injection 레이어를 더 얇게 만드는 단계다.

---

## 2. 진입 조건

Phase 3는 아래가 만족된 상태에서만 시작한다.

1. fresh saved HTML audit 반복 통과
2. build/check 통과
3. merge test 통과
4. public facade contract 고정
5. Phase 2 handoff/roadmap 문서 최신화

현재 기준으로 위 조건은 충족된 것으로 본다.

---

## 3. 범위

### 포함
- `buildSnapshotApiCompatScript()`
- `buildSnapshotShellBootstrapScript()`
- `injectSnapshotReactShell()`
- snapshot helper pack의 transitive dependency 점검 체계

### 제외
- `normalizeSnapshotPayloadForOfflineShell()`의 의미 변경
- canonical 90일 row 의미 변경
- live fetch/cache 정책 변경
- merge schema 변경

즉 payload 계약 중심부는 Phase 3 초반에 건드리지 않는다.

---

## 4. 첫 번째로 할 일

Phase 3 첫 삽은 **`buildSnapshotApiCompatScript()` 책임 정리**를 권장한다.

이유:

1. legacy compat/runtime bridge라서 경계가 비교적 명확하다.
2. `normalizeSnapshotPayloadForOfflineShell()`보다 fan-out이 작다.
3. `injectSnapshotReactShell()`의 regex/string 조립보다도
   먼저 "API bridge 책임"을 분리하면 이후 injection 단계와 boot 단계를 더 깔끔하게 나눌 수 있다.

즉 첫 슬라이스는:

- compat bridge 내부 state clone/sync
- public action fallback
- observer/subscribe wiring

을 더 읽기 쉽게 묶는 것이다.

---

## 5. Workstream

### Workstream A — Snapshot Compat Bridge Slim
- `buildSnapshotApiCompatScript()` 내부 책임 분리
- state clone / DOM sync / public action fallback / observer wiring 구분

### Workstream B — Shell Bootstrap String Reduction
- `buildSnapshotShellBootstrapScript()` 안의 mount/unmount/portal 조립을 더 좁힘
- 가능하면 line-builder 책임을 더 명시적으로 분리

### Workstream C — Injection Layer Reduction
- `injectSnapshotReactShell()`의 string/regex 후처리를 더 작게 분리
- host 보장 / shell state 삽입 / bootstrap append 이후의 남은 결합 축소

### Workstream D — Payload Core Revisit (후순위)
- `normalizeSnapshotPayloadForOfflineShell()` 재검토
- 이건 가장 마지막에 본다

---

## 6. 금지사항

1. fresh saved QA 없이 구조 변경 완료라고 판단하지 말 것
2. payload normalization 의미를 초반에 건드리지 말 것
3. live contract를 흔들면서 saved를 맞추지 말 것
4. helper 누락을 막겠다고 다시 무차별 직렬화로 돌아가지 말 것

---

## 7. 검증 기준

```bash
npm run build
npm run check
node tests/merge-test.js
node tests/phase1-verify-runtime.js
node scripts/snapshot_workflow_audit.js <fresh-saved-html>
```

saved 기준 통과 조건:
- `failures: []`
- `pageErrors: []`
- `consoleErrors: []`

---

## 8. 한 줄 결론

Phase 3는 지금 당장 필수 버그 수정 단계가 아니라,
남아 있는 compat/bootstrap/injection coupling을 더 줄이는 장기 정리 단계다.
