# React 18 호환성 빠른 참조 가이드

## 개요

이 가이드는 React 18 호환성 기능을 빠르게 찾아 사용하기 위한 참조 문서입니다.

## 전역 API

### `window.__REACT18_COMPAT__`

React 18 호환성 기능에 접근하는 전역 객체입니다.

```javascript
// React 버전 확인
const version = window.__REACT18_COMPAT__.detectReactVersion();
console.log(version.major); // 18 또는 17

// Concurrent Features 지원 여부
const supportsConcurrent = window.__REACT18_COMPAT__.supportsConcurrentFeatures();

// 전체 호환성 정보
const info = window.__REACT18_COMPAT__.getReact18CompatibilityInfo();
console.log(info);
```

## 주요 함수

### 1. `detectReactVersion()`

실행 시점의 React 버전을 감지합니다.

```javascript
const version = window.__REACT18_COMPAT__.detectReactVersion();
// { major: 18, minor: 0, patch: 0, isConcurrent: true }
```

**반환값:**
- `major`: 주 버전 (17, 18)
- `minor`: 부 버전
- `patch`: 패치 버전
- `isConcurrent`: Concurrent Mode 지원 여부

### 2. `createReact18CompatibleObserver(target, callback, options)`

React 18에 최적화된 DOM 관찰자를 생성합니다.

```javascript
const observer = window.__REACT18_COMPAT__.createReact18CompatibleObserver(
  document.body,
  () => {
    console.log('DOM changed');
  },
  {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true
  }
);

// 나중에 정리
observer.disconnect();
```

**파라미터:**
- `target`: 관찰할 DOM 요소
- `callback`: 변경 시 호출할 함수
- `options`: 관찰 옵션 (MutationObserver 옵션과 동일)

**반환값:**
- `disconnect()`: 관찰 중지
- `observe()`: 다시 관찰 시작

### 3. `runConcurrentTask(task, options)`

React 18 Concurrent Mode에 최적화된 비동기 작업을 실행합니다.

```javascript
await window.__REACT18_COMPAT__.runConcurrentTask(
  async () => {
    await fetchData();
    processData();
  },
  {
    priority: 'user-visible', // 'user-visible' | 'background' | 'idle'
    timeout: 5000
  }
);
```

**파라미터:**
- `task`: 실행할 비동기 함수
- `options.priority`: 작업 우선순위
  - `'user-visible'`: 사용자에게 보이는 작업 (높은 우선순위)
  - `'background'`: 백그라운드 작업 (일반 우선순위)
  - `'idle'`: 유휴 시 작업 (낮은 우선순위)
- `options.timeout`: 타임아웃 (밀리초)

### 4. `createTransition()`

React 18의 `useTransition`과 유사한 기능을 제공합니다.

```javascript
const [startTransition, isPending] = window.__REACT18_COMPAT__.createTransition();

await startTransition(async () => {
  await heavyComputation();
});

if (isPending()) {
  console.log('Transition in progress...');
}
```

**반환값:**
- `[0]`: `startTransition(task)` - 트랜지션 시작 함수
- `[1]`: `isPending()` - 진행 중 여부 확인 함수

### 5. `createStrictModeSafeEffect(effect)`

React 18 StrictMode에서 안전한 side-effect를 생성합니다.

```javascript
const safeEffect = window.__REACT18_COMPAT__.createStrictModeSafeEffect(() => {
  console.log('This will only run once per mount');
  return () => {
    console.log('Cleanup');
  };
});

// 컴포넌트 마운트 시
const cleanup = safeEffect();

// 컴포넌트 언마운트 시
cleanup();
```

### 6. `preventDoubleRender(fn, options)`

이중 렌더링을 감지하고 방지하는 래퍼 함수입니다.

```javascript
const safeRender = window.__REACT18_COMPAT__.preventDoubleRender(() => {
  initializeComponent();
}, {
  key: 'component-init',
  debounceMs: 100
});

safeRender(); // 한 번만 실행됨
```

**파라미터:**
- `fn`: 실행할 함수
- `options.key`: 중복 실행 방지를 위한 고유 키
- `options.debounceMs`: 디바운스 시간 (밀리초)

### 7. `createReact18CompatibleState(initialState)`

React 18 Concurrent Mode에 최적화된 상태 관리자를 생성합니다.

```javascript
const store = window.__REACT18_COMPAT__.createReact18CompatibleState({
  count: 0,
  user: null
});

// 상태 구독
const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state);
});

// 상태 업데이트
store.setState({ count: 1 });

// 상태 조회
const currentState = store.getState();

// 구독 해지
unsubscribe();
```

**API:**
- `getState()`: 현재 상태 반환
- `setState(partial)`: 상태 업데이트
- `subscribe(listener)`: 상태 변경 구독, 구독 해지 함수 반환

## 사용 예제

### 예제 1: React 버전에 따른 분기 처리

```javascript
if (window.__REACT18_COMPAT__) {
  const version = window.__REACT18_COMPAT__.detectReactVersion();

  if (version.major >= 18) {
    // React 18 전용 로직
    await window.__REACT18_COMPAT__.runConcurrentTask(task, {
      priority: 'user-visible'
    });
  } else {
    // React 17 이하 로직
    await task();
  }
}
```

### 예제 2: 최적화된 DOM 관찰

```javascript
const observer = window.__REACT18_COMPAT__.createReact18CompatibleObserver(
  document.getElementById('my-element'),
  () => {
    console.log('Element changed');
  },
  { subtree: true, childList: true }
);

// 나중에 정리
window.addEventListener('beforeunload', () => {
  observer.disconnect();
});
```

### 예제 3: Concurrent Mode 친화적 데이터 로딩

```javascript
async function loadData() {
  await window.__REACT18_COMPAT__.runConcurrentTask(
    async () => {
      const response = await fetch('/api/data');
      const data = await response.json();
      updateUI(data);
    },
    {
      priority: 'user-visible',
      timeout: 10000
    }
  );
}
```

### 예제 4: StrictMode 안전한 초기화

```javascript
const safeInit = window.__REACT18_COMPAT__.preventDoubleRender(() => {
  // 초기화 로직
  setupEventListeners();
  fetchData();
}, {
  key: 'app-init',
  debounceMs: 200
});

// 앱 시작 시 호출
safeInit();
```

## UI 상태 관리

### `window.__SEARCHADVISOR_UI_STATE__`

SearchAdvisor UI 상태에 접근하는 전역 객체입니다.

```javascript
// 상태 조회
const state = window.__SEARCHADVISOR_UI_STATE__.getState();
console.log(state.curMode); // 'all' or 'site'
console.log(state.curSite); // 현재 사이트 URL
console.log(state.curTab); // 현재 탭 ID

// 상태 변경 구독
const unsubscribe = window.__SEARCHADVISOR_UI_STATE__.subscribe((state) => {
  console.log('UI state changed:', state);
});

// React 18 Concurrent Mode 호환 알림
window.__SEARCHADVISOR_UI_STATE__.notifyConcurrent();

// 구독 해지
unsubscribe();
```

## 디버깅

### 개발 모드에서 호환성 정보 확인

```javascript
// 브라우저 콘솔에서
console.log('[React18Compat] Compatibility Info:',
  window.__REACT18_COMPAT__.getReact18CompatibilityInfo()
);

// 출력 예시:
// {
//   version: { major: 18, minor: 0, patch: 0, isConcurrent: true },
//   supportsConcurrent: true,
//   isStrictMode: true,
//   features: {
//     createRoot: true,
//     concurrentMode: true,
//     automaticBatching: true,
//     strictModeDoubleRender: true,
//     transition: true,
//     deferredValue: true
//   },
//   recommendations: [
//     'createRoot 사용 권장',
//     'Concurrent Features 활용 가능',
//     'StrictMode 이중 렌더링 주의'
//   ]
// }
```

## 일반적인 문제 해결

### 문제 1: MutationObserver가 너무 자주 트리거됨

**해결:** React 18 호환 Observer를 사용하면 자동으로 디바운스가 적용됩니다.

```javascript
// ❌ 기존 방식
const observer = new MutationObserver(callback);

// ✅ React 18 호환 방식
const observer = window.__REACT18_COMPAT__.createReact18CompatibleObserver(
  target, callback, options
);
```

### 문제 2: 무거운 작업이 UI를 차단함

**해결:** `runConcurrentTask`를 사용하여 우선순위를 지정합니다.

```javascript
// ❌ 기존 방식
await heavyTask();

// ✅ React 18 호환 방식
await window.__REACT18_COMPAT__.runConcurrentTask(heavyTask, {
  priority: 'background'
});
```

### 문제 3: StrictMode에서 함수가 두 번 호출됨

**해결:** `preventDoubleRender`를 사용합니다.

```javascript
// ❌ 기존 방식
function init() { /* ... */ }
init();

// ✅ React 18 호환 방식
const safeInit = window.__REACT18_COMPAT__.preventDoubleRender(init);
safeInit();
```

## 브라우저 호환성

| 기능 | Chrome | Firefox | Safari | Edge |
|-----|--------|---------|--------|------|
| React 17 지원 | ✅ | ✅ | ✅ | ✅ |
| React 18 지원 | ✅ | ✅ | ✅ | ✅ |
| MutationObserver | ✅ | ✅ | ✅ | ✅ |
| requestIdleCallback | ✅ | ✅ | ✅ | ✅ |
| scheduler API | ⚠️ | ⚠️ | ⚠️ | ⚠️ |

*scheduler API는 선택 사항이며, 없는 경우 폴백이 사용됩니다.*

## 추가 참고

- [React 18 공식 문서](https://react.dev/blog/2022/03/29/react-v18)
- [Concurrent Features](https://react.dev/learn/concurrent-features)
- [P2 완료 보고서](./P2_REACT18_COMPATIBILITY_REPORT.md)

---

**마지막 업데이트**: 2026-03-18
