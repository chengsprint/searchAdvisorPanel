/*!
 * SearchAdvisor Stable Loader
 * ========================================================================
 *
 * 이 파일은 "운영용 진입점" 입니다.
 *
 * 왜 필요한가?
 * - 외부 스크립트에 runtime.js의 태그/커밋 URL을 직접 심어두면
 *   새 버전을 배포할 때마다 외부 스크립트를 다시 수정해야 합니다.
 * - 반대로 @main/runtime.js 를 바로 보게 하면 개발 중 테스트 푸시가
 *   곧바로 실사용자에게 반영되는 위험이 있습니다.
 *
 * 따라서 이 loader는 아래 원칙을 따릅니다.
 * 1) 외부 스크립트는 항상 이 loader.js 하나만 고정으로 로드한다.
 * 2) loader는 같은 채널(브랜치/태그)의 stable.json 을 읽는다.
 * 3) stable.json 이 가리키는 "운영 승인된 runtime_url"만 실제로 로드한다.
 * 4) manifest 로드가 실패하면 fallback_url 로 한 번 더 시도한다.
 *
 * 중요한 운영 규칙
 * - 개발자는 main 에 자유롭게 푸시한다.
 * - 실사용 외부 스크립트는 @main 이 아니라 운영 전용 채널
 *   (예: @release/dist/loader.js) 을 보게 한다.
 * - 실제 운영 반영은 stable.json 의 runtime_url 을 바꾸는 "승격"으로만 한다.
 *
 * 즉, 디자인/기능 개발과 운영 배포를 분리하기 위한 최소 안전장치다.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__SEARCHADVISOR_LOADER_ACTIVE__) return;
  window.__SEARCHADVISOR_LOADER_ACTIVE__ = true;

  /**
   * 기본 fallback.
   *
   * manifest(stable.json) 로드가 실패하거나 비정상인 경우에도
   * 완전히 빈 상태로 끝나지 않게 하기 위한 마지막 안전망이다.
   *
   * 주의:
   * - 이 값은 "현재 마지막 안정판" 기준으로 수동 갱신해도 된다.
   * - 다만 일반 운영에선 stable.json 이 우선이며, 이 값은 비상용이다.
   */
  var DEFAULT_RUNTIME_URL =
    'https://cdn.jsdelivr.net/gh/chengsprint/searchAdvisorPanel@v2.0.4/dist/runtime.js';

  function currentScriptSrc() {
    try {
      var current = document.currentScript;
      if (current && current.src) return current.src;
      var scripts = Array.prototype.slice.call(document.scripts || []);
      for (var i = scripts.length - 1; i >= 0; i -= 1) {
        if (scripts[i] && scripts[i].src && /\/dist\/loader\.js(?:\?|$)/i.test(scripts[i].src)) {
          return scripts[i].src;
        }
      }
    } catch (_) {}
    return '';
  }

  /**
   * loader 자신이 로드된 동일한 채널에서 stable.json 을 찾는다.
   *
   * 예:
   * - @release/dist/loader.js -> @release/dist/stable.json
   * - @main/dist/loader.js    -> @main/dist/stable.json
   * - @v2.0.4/dist/loader.js  -> @v2.0.4/dist/stable.json
   *
   * 이렇게 하면 loader 자체는 환경에 독립적이고,
   * "어느 채널을 운영용으로 쓸지"는 URL을 심는 쪽에서 결정할 수 있다.
   */
  function deriveManifestUrl(loaderSrc) {
    if (!loaderSrc) return '';
    var base = loaderSrc.replace(/([?#].*)$/, '');
    if (!/\/dist\/loader\.js$/i.test(base)) return '';
    return base.replace(/\/dist\/loader\.js$/i, '/dist/stable.json') + '?t=' + Date.now();
  }

  function injectRuntime(url, meta) {
    if (!url) return false;
    if (window.__SEARCHADVISOR_RUNTIME_LOADING_URL__ === url) return true;
    window.__SEARCHADVISOR_RUNTIME_LOADING_URL__ = url;
    window.__SEARCHADVISOR_LOADER_META__ = meta || null;

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
    script.async = true;
    script.onerror = function (event) {
      console.error('[SearchAdvisor Loader] runtime load failed:', url, event);
    };
    document.head.appendChild(script);
    return true;
  }

  function loadFallback(reason) {
    injectRuntime(DEFAULT_RUNTIME_URL, {
      channel: 'fallback',
      reason: reason || 'unknown',
      runtime_url: DEFAULT_RUNTIME_URL,
    });
  }

  function readManifest(url) {
    return fetch(url, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) {
        throw new Error('stable manifest request failed: ' + response.status);
      }
      return response.json();
    });
  }

  var loaderSrc = currentScriptSrc();
  var manifestUrl = deriveManifestUrl(loaderSrc);

  if (!manifestUrl) {
    console.warn('[SearchAdvisor Loader] manifest url could not be derived; using fallback runtime');
    loadFallback('manifest-url-missing');
    return;
  }

  readManifest(manifestUrl)
    .then(function (manifest) {
      var runtimeUrl = manifest && typeof manifest.runtime_url === 'string' ? manifest.runtime_url : '';
      var fallbackUrl = manifest && typeof manifest.fallback_url === 'string' ? manifest.fallback_url : '';

      if (!runtimeUrl) {
        throw new Error('runtime_url missing in stable manifest');
      }

      var injected = injectRuntime(runtimeUrl, manifest);
      if (!injected) {
        throw new Error('runtime inject refused');
      }

      if (fallbackUrl) {
        window.__SEARCHADVISOR_LOADER_FALLBACK_URL__ = fallbackUrl;
      }
    })
    .catch(function (error) {
      console.error('[SearchAdvisor Loader] manifest load failed:', error);
      loadFallback(error && error.message ? error.message : 'manifest-error');
    });
})();
