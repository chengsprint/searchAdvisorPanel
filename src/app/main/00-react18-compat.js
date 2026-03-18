// React 18 Compatibility Layer
// 이 파일은 React 17/18 호환성을 위한 유틸리티를 제공합니다.

// ============================================================================
// React 버전 감지
// ============================================================================

/**
 * React 버전을 감지합니다.
 * @returns {Object} { major: number, minor: number, patch: number, isConcurrent: boolean }
 * @example
 * const version = detectReactVersion();
 * console.log(version.major); // 18
 * console.log(version.isConcurrent); // true
 */
function detectReactVersion() {
  const React = (typeof window !== 'undefined' && window.React) ||
                (typeof require === 'function' && require('react'));

  if (!React || !React.version) {
    return { major: 0, minor: 0, patch: 0, isConcurrent: false };
  }

  const parts = React.version.split('.').map(Number);
  const major = parts[0] || 0;
  const minor = parts[1] || 0;
  const patch = parts[2] || 0;

  // React 18+ supports Concurrent Mode
  const isConcurrent = major >= 18;

  return { major, minor, patch, isConcurrent };
}

/**
 * React 18 Concurrent Features 지원 여부를 확인합니다.
 * @returns {boolean} Concurrent Features 지원 여부
 */
function supportsConcurrentFeatures() {
  const version = detectReactVersion();
  return version.isConcurrent;
}

// ============================================================================
// MutationObserver 대체 (React 18 호환)
// ============================================================================

/**
 * React 18 호환 가능한 DOM 관찰자를 생성합니다.
 * MutationObserver는 React 18의 Concurrent Mode와 함께 사용할 때
 * 문제를 일으킬 수 있으므로, 대안을 제공합니다.
 *
 * @param {Element} target - 관찰할 DOM 요소
 * @param {Function} callback - 변경 시 호출할 콜백
 * @param {Object} options - 관찰 옵션
 * @returns {Object} { disconnect: Function, observe: Function }
 * @example
 * const observer = createReact18CompatibleObserver(document.body, () => {
 *   console.log('DOM changed');
 * }, { subtree: true });
 */
function createReact18CompatibleObserver(target, callback, options = {}) {
  const version = detectReactVersion();

  // React 17 이하 또는 MutationObserver가 없는 경우
  if (version.major < 18 || typeof MutationObserver === 'undefined') {
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(callback);
      observer.observe(target, options);
      return {
        disconnect: () => observer.disconnect(),
        observe: (t, opts) => observer.observe(t, opts)
      };
    } else {
      // MutationObserver가 없는 경우 (아주 오래된 브라우저)
      // 폴리필을 사용하거나 대체 전략을 사용합니다.
      return {
        disconnect: () => {},
        observe: () => {}
      };
    }
  }

  // React 18+인 경우, 더 안전한 관찰 전략을 사용합니다.
  // Concurrent Mode에서는 MutationObserver가 과도하게 트리거될 수 있습니다.
  let timeoutId = null;
  let isScheduled = false;

  const scheduleCallback = () => {
    if (isScheduled) return;

    isScheduled = true;

    // React 18의 스케줄링을 활용하여 렌더링을 방해하지 않도록 합니다.
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        callback();
        isScheduled = false;
      }, { timeout: 1000 });
    } else if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        callback();
        isScheduled = false;
      });
    } else {
      setTimeout(() => {
        callback();
        isScheduled = false;
      }, 0);
    }
  };

  // React 18에서도 MutationObserver는 사용하지만,
  // 디바운스를 적용하여 과도한 트리거를 방지합니다.
  const debouncedCallback = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(scheduleCallback, 100);
  };

  const observer = new MutationObserver(debouncedCallback);
  observer.observe(target, options);

  return {
    disconnect: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      observer.disconnect();
    },
    observe: (t, opts) => observer.observe(t, opts)
  };
}

// ============================================================================
// Concurrent Mode 호환 비동기 처리
// ============================================================================

/**
 * React 18 Concurrent Mode에 최적화된 비동기 작업 스케줄러입니다.
 * Concurrent Mode를 방해하지 않도록 적절한 우선순위로 작업을 예약합니다.
 *
 * @param {Function} task - 실행할 비동기 작업
 * @param {Object} options - { priority: 'user-visible' | 'background' | 'idle', timeout: number }
 * @returns {Promise} 작업 완료 Promise
 * @example
 * await runConcurrentTask(async () => {
 *   await fetchData();
 * }, { priority: 'user-visible', timeout: 5000 });
 */
function runConcurrentTask(task, options = {}) {
  const { priority = 'user-visible', timeout = 5000 } = options;
  const version = detectReactVersion();

  return new Promise((resolve, reject) => {
    const executeTask = async () => {
      try {
        const result = await task();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    if (!version.isConcurrent) {
      // React 17 이하에서는 일반 Promise를 사용합니다.
      executeTask();
      return;
    }

    // React 18+에서는 우선순위에 따라 다른 스케줄링을 사용합니다.
    switch (priority) {
      case 'user-visible':
        // 사용자에게 보이는 작업: 즉시 실행
        if (typeof scheduler !== 'undefined' && scheduler.unstable_scheduleCallback) {
          scheduler.unstable_scheduleCallback(
            scheduler.unstable_UserBlockingPriority,
            executeTask
          );
        } else {
          Promise.resolve().then(executeTask);
        }
        break;

      case 'background':
        // 백그라운드 작업: 낮은 우선순위
        if (typeof scheduler !== 'undefined' && scheduler.unstable_scheduleCallback) {
          scheduler.unstable_scheduleCallback(
            scheduler.unstable_NormalPriority,
            executeTask
          );
        } else {
          Promise.resolve().then(executeTask);
        }
        break;

      case 'idle':
        // 유휴 시 작업: 브라우저가 유휴 상태일 때 실행
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(() => executeTask(), { timeout });
        } else if (typeof scheduler !== 'undefined' && scheduler.unstable_scheduleCallback) {
          scheduler.unstable_scheduleCallback(
            scheduler.unstable_IdlePriority,
            executeTask
          );
        } else {
          setTimeout(executeTask, 0);
        }
        break;

      default:
        executeTask();
    }
  });
}

/**
 * React 18의 useTransition과 유사한 기능을 제공합니다.
 * 긴 작업을 수행하면서도 UI를 반응형으로 유지합니다.
 *
 * @param {Function} task - 실행할 작업
 * @returns {Promise} 작업 완료 Promise
 * @example
 * const [startTransition, isPending] = createTransition();
 * await startTransition(async () => {
 *   await heavyComputation();
 * });
 */
function createTransition() {
  const version = detectReactVersion();
  let isPending = false;

  const startTransition = async (task) => {
    isPending = true;
    try {
      await runConcurrentTask(task, { priority: 'background' });
    } finally {
      isPending = false;
    }
  };

  return [startTransition, () => isPending];
}

// ============================================================================
// StrictMode 지원
// ============================================================================

/**
 * React 18 StrictMode에서 안전한 side-effect 함수를 생성합니다.
 * StrictMode는 개발 모드에서 이중 렌더링을 수행하므로,
 * side-effect가 여러 번 실행되는 것을 방지해야 합니다.
 *
 * @param {Function} effect - side-effect 함수
 * @returns {Function} StrictMode-safe wrapper 함수
 * @example
 * const safeEffect = createStrictModeSafeEffect(() => {
 *   console.log('This will only run once per mount');
 * });
 */
function createStrictModeSafeEffect(effect) {
  let cleanup = null;
  let ran = false;

  return (...args) => {
    if (ran) {
      // 이미 실행된 경우, cleanup만 실행합니다.
      if (typeof cleanup === 'function') {
        cleanup();
      }
      return;
    }

    ran = true;
    cleanup = effect(...args);

    // cleanup 함수를 반환합니다.
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
      ran = false;
    };
  };
}

/**
 * 이중 렌더링을 감지하고 방지하는 래퍼 함수입니다.
 * React 18 StrictMode에서는 개발 모드에서 컴포넌트가 두 번 렌더링됩니다.
 *
 * @param {Function} fn - 실행할 함수
 * @param {Object} options - { key: string, debounceMs: number }
 * @returns {Function} 래핑된 함수
 * @example
 * const safeRender = preventDoubleRender(() => {
 *   initializeComponent();
 * }, { key: 'component-init', debounceMs: 100 });
 */
function preventDoubleRender(fn, options = {}) {
  const { key = 'default', debounceMs = 100 } = options;
  const cacheKey = `__prevent_double_render_${key}`;
  let lastCallTime = 0;

  return (...args) => {
    const now = Date.now();

    if (typeof window !== 'undefined') {
      const lastTime = window[cacheKey] || 0;

      if (now - lastTime < debounceMs) {
        // 아직 debounce 기간 내이면 무시합니다.
        return;
      }

      window[cacheKey] = now;
    }

    return fn(...args);
  };
}

// ============================================================================
// 전역 상태 관리 (React 18 호환)
// ============================================================================

/**
 * React 18 호환 전역 상태 관리자입니다.
 * Concurrent Mode에서도 안전하게 사용할 수 있습니다.
 *
 * @param {Object} initialState - 초기 상태
 * @returns {Object} { getState, setState, subscribe }
 * @example
 * const store = createReact18CompatibleState({ count: 0 });
 * store.subscribe((state) => console.log(state));
 * store.setState({ count: 1 });
 */
function createReact18CompatibleState(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();
  const version = detectReactVersion();

  const notifyListeners = () => {
    if (version.isConcurrent) {
      // React 18에서는 다음 타이머 틱에 알림을 보냅니다.
      Promise.resolve().then(() => {
        const stateSnapshot = { ...state };
        listeners.forEach((listener) => {
          try {
            listener(stateSnapshot);
          } catch (error) {
            console.error('[React18Compat] Listener error:', error);
          }
        });
      });
    } else {
      // React 17 이하에서는 즉시 알림을 보냅니다.
      const stateSnapshot = { ...state };
      listeners.forEach((listener) => {
        try {
          listener(stateSnapshot);
        } catch (error) {
          console.error('[React18Compat] Listener error:', error);
        }
      });
    }
  };

  return {
    getState: () => ({ ...state }),

    setState: (partial) => {
      const nextState = typeof partial === 'function'
        ? partial(state)
        : partial;

      state = { ...state, ...nextState };
      notifyListeners();
    },

    subscribe: (listener) => {
      listeners.add(listener);

      // 구독 해제 함수를 반환합니다.
      return () => {
        listeners.delete(listener);
      };
    }
  };
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 현재 환경이 React 18 StrictMode인지 확인합니다.
 * @returns {boolean} StrictMode 여부
 */
function isStrictMode() {
  const version = detectReactVersion();

  if (version.major < 18) {
    return false;
  }

  // React 18에서는 개발 모드일 때 자동으로 StrictMode가 활성화될 수 있습니다.
  // 실제 StrictMode 여부는 런타임에 확인하기 어렵습니다.
  // 대신, 개발 모드인지 확인합니다.
  return typeof process !== 'undefined' &&
         process.env &&
         process.env.NODE_ENV === 'development';
}

/**
 * React 18 호환성 정보를 반환합니다.
 * @returns {Object} 호환성 정보
 */
function getReact18CompatibilityInfo() {
  const version = detectReactVersion();

  return {
    version,
    supportsConcurrent: supportsConcurrentFeatures(),
    isStrictMode: isStrictMode(),
    features: {
      createRoot: version.major >= 18,
      concurrentMode: version.major >= 18,
      automaticBatching: version.major >= 18,
      strictModeDoubleRender: version.major >= 18,
      transition: version.major >= 18,
      deferredValue: version.major >= 18
    },
    recommendations: version.major >= 18
      ? ['createRoot 사용 권장', 'Concurrent Features 활용 가능', 'StrictMode 이중 렌더링 주의']
      : ['ReactDOM.render 사용', 'Concurrent Features 미지원', '향후 React 18 업그레이드 권장']
  };
}

// ============================================================================
// 전역 노출 (디버깅 및 테스트용)
// ============================================================================

if (typeof window !== 'undefined') {
  window.__REACT18_COMPAT__ = {
    detectReactVersion,
    supportsConcurrentFeatures,
    createReact18CompatibleObserver,
    runConcurrentTask,
    createTransition,
    createStrictModeSafeEffect,
    preventDoubleRender,
    createReact18CompatibleState,
    isStrictMode,
    getReact18CompatibilityInfo
  };

  // 개발 모드에서 호환성 정보를 콘솔에 출력합니다.
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
    console.log('[React18Compat] Compatibility Info:', getReact18CompatibilityInfo());
  }
}

// ============================================================================
// 내보내기 (ES6 모듈 방식)
// ============================================================================

export {
  detectReactVersion,
  supportsConcurrentFeatures,
  createReact18CompatibleObserver,
  runConcurrentTask,
  createTransition,
  createStrictModeSafeEffect,
  preventDoubleRender,
  createReact18CompatibleState,
  isStrictMode,
  getReact18CompatibilityInfo
};
