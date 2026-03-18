  // Async initialization - wait for site list to load
  console.log('[Init] Starting async initialization...');
  (async function() {
    console.log('[Init] Inside async IIFE, calling loadSiteList...');
    await loadSiteList(false);
    injectDemoData(); // Inject mock data if on localhost
    assignColors();
    const cachedUiState = getCachedUiState();
    shouldBootstrapFullRefresh() && runFullRefreshPipeline({ trigger: "cache-expiry" });
    let bootMode = CONFIG.MODE.ALL;
    let bootSite = null;
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
        tabsEl.querySelectorAll(".sadv-t").forEach(function (btn) {
          btn.classList.toggle("on", btn.dataset.t === curTab);
        });
      }
    }
    if (bootSite) curSite = bootSite;
    ensureCurrentSite();
    buildCombo(null);
    if (curSite) setComboSite(curSite);
    if (bootMode === CONFIG.MODE.SITE && curSite) {
      curMode = CONFIG.MODE.SITE;
      modeBar.querySelectorAll(".sadv-mode").forEach((b) => b.classList.remove("on"));
      modeBar.querySelector('[data-m="site"]').classList.add("on");
      siteBar.classList.add("show");
      tabsEl.classList.add("show");
      loadSiteView(curSite);
    } else {
      setAllSitesLabel();
      renderAllSites();
    }
    setCachedUiState();
    __sadvMarkReady();
  })().catch((e) => {
    console.error('[Init Error]', e);
  });
