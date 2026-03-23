/**
 * ========================================================================
 * SearchAdvisor Runtime - 내부용 로컬 전용 모듈
 * ========================================================================
 *
 * ⚠️ IMPORTANT: 이 모듈은 각 사용자의 로컬 환경에서만 사용됩니다.
 * - 브라우저 콘솔에서 직접 실행
 * - 외부 패키지로 배포하지 않음
 * - ES6 import/export 사용하지 않음 (IIFE 패턴)
 *
 * @internal
 * @private
 */

// Async initialization - wait for site list to load
console.log('[Init] Starting async initialization...');
if (typeof window !== "undefined") {
  window.__SEARCHADVISOR_RUNTIME_KIND__ = "live";
}
  /**
   * Initialize the SearchAdvisor application
   * Loads site list, sets up UI state, and renders initial view
   * This is the main entry point that runs on page load
   * @returns {Promise<void>}
   * @example
   // Automatically called on page load
   * @see {loadSiteList}
   * @see {renderAllSites}
   * @see {loadSiteView}
   */
  (async function() {
    console.log('[Init] Inside async IIFE, calling loadSiteList...');

    // React 18 호환성 확인
    const react18Compat = typeof window !== 'undefined' && window.__REACT18_COMPAT__;
    if (react18Compat) {
      const compatInfo = react18Compat.getReact18CompatibilityInfo();
      console.log('[Init] React Compatibility Info:', compatInfo);
    }

    // React 18 Concurrent Mode에 최적화된 초기화 사용
    const initTask = async () => {
      if (!modeBar || !siteBar || !tabsEl || !bdEl || !labelEl) {
        console.error('[Init] Required shell elements are missing. Aborting interactive initialization.');
        return;
      }

      await loadSiteList(false);
      injectDemoData(); // Inject mock data if on localhost
      assignColors();
      const cachedUiState = getCachedUiState();
      let bootMode = CONFIG.MODE.ALL;
      let bootSite = null;
      const applyBootShellState = function (mode, site) {
        if (mode === CONFIG.MODE.SITE && site) {
          curMode = CONFIG.MODE.SITE;
          modeBar.querySelectorAll(".sadv-mode").forEach((b) => b.classList.remove("on"));
          const siteModeBtn = modeBar.querySelector('[data-m="site"]');
          if (siteModeBtn) siteModeBtn.classList.add("on");
          siteBar.classList.add("show");
          tabsEl.classList.add("show");
          return;
        }
        curMode = CONFIG.MODE.ALL;
        modeBar.querySelectorAll(".sadv-mode").forEach((b) => b.classList.remove("on"));
        const allModeBtn = modeBar.querySelector('[data-m="all"]');
        if (allModeBtn) allModeBtn.classList.add("on");
        siteBar.classList.remove("show");
        tabsEl.classList.remove("show");
      };
      // In demo mode, default to site mode with first demo site
      if (IS_DEMO_MODE && allSites.length > 0) {
        bootMode = CONFIG.MODE.SITE;
        bootSite = allSites[0];
      }
      const curSiteMatch = location.search.match(/site=([^&]+)/);
      if (curSiteMatch) {
        const cur = decodeURIComponent(curSiteMatch[1]);
        if (allSites.includes(cur)) {
          bootSite = cur;
          bootMode = CONFIG.MODE.SITE;
        }
      } else if (cachedUiState) {
        if (cachedUiState.site && allSites.includes(cachedUiState.site)) bootSite = cachedUiState.site;
        if (cachedUiState.mode === CONFIG.MODE.SITE && bootSite) bootMode = CONFIG.MODE.SITE;
        if (cachedUiState.mode === CONFIG.MODE.ALL) bootMode = CONFIG.MODE.ALL;
        if (
          cachedUiState.tab &&
          TABS.some(function (tab) {
            return tab.id === cachedUiState.tab;
          })
        ) {
          curTab = cachedUiState.tab;
          if (tabsEl) {
            tabsEl.querySelectorAll(".sadv-t").forEach(function (btn) {
              btn.classList.toggle("on", btn.dataset.t === curTab);
            });
          }
        }
      }
      if (bootSite) curSite = bootSite;
      ensureCurrentSite();
      buildCombo(null);
      if (curSite) setComboSite(curSite);
      const refreshStatus =
        typeof getBootstrapFullRefreshStatus === "function"
          ? getBootstrapFullRefreshStatus()
          : {
              shouldRefresh:
                typeof shouldBootstrapFullRefresh === "function" ? shouldBootstrapFullRefresh() : false,
              reason: null,
            };
      const startupRefreshFirst = !IS_DEMO_MODE && !!(refreshStatus && refreshStatus.shouldRefresh);
      // startup owner arbitration:
      // cache/site-data miss가 감지된 직후에는 panel bootstrap fetch(renderAllSites/loadSiteView)와
      // cache-expiry full refresh가 같은 report key를 동시에 owner처럼 잡으면 안 된다.
      // 따라서 live startup에서는 refresh-first를 우선 owner로 두고,
      // panel bootstrap은 shell state/selection만 준비한 뒤 refresh 결과를 소비하게 만든다.
      applyBootShellState(bootMode, curSite);
      if (startupRefreshFirst) {
        if (typeof recordRuntimeEvent === "function") {
          recordRuntimeEvent("startup-refresh-arbitrated", {
            mode: bootMode,
            site: curSite || null,
            reason: refreshStatus.reason || null,
          });
        }
        runFullRefreshPipeline({ trigger: "cache-expiry" }).catch(function (error) {
          console.error("[Init] Startup refresh-first pipeline failed:", error);
        });
      } else {
        if (bootMode === CONFIG.MODE.SITE && curSite && modeBar && siteBar && tabsEl) {
          loadSiteView(curSite);
        } else {
          if (bootMode === CONFIG.MODE.SITE && curSite && (!modeBar || !siteBar || !tabsEl)) {
            console.error("[Init] Site mode UI scaffold missing, falling back to all-sites view.");
          }
          setAllSitesLabel();
          renderAllSites();
        }
      }
      setCachedUiState();
      startCacheExpiryMonitor();
      if (typeof syncPendingPanelUserError === "function") {
        syncPendingPanelUserError();
      }
      __sadvMarkReady();
      const bootRequest = getSearchAdvisorBootRequest();
      if (
        isSearchAdvisorBackgroundDownloadBootRequest(bootRequest) &&
        typeof runBackgroundSnapshotDownload === "function"
      ) {
        Promise.resolve()
          .then(function () {
            return runBackgroundSnapshotDownload(bootRequest);
          })
          .catch(function (error) {
            console.error("[Init] Background snapshot download failed:", error);
          });
      }
    };

    // React 18 Concurrent Mode 지원 시 사용
    if (react18Compat && typeof react18Compat.runConcurrentTask === 'function') {
      await react18Compat.runConcurrentTask(initTask, {
        priority: 'user-visible',
        timeout: 10000
      });
    } else {
      // React 17 이하 또는 호환성 계층 없음
      await initTask();
    }
  })().catch((e) => {
    console.error('[Init Error]', e);
  });
