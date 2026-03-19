/**
 * ========================================================================
 * SearchAdvisor UI Controls - 내부용 로컬 전용 모듈
 * ========================================================================
 *
 * ⚠️ INTERNAL LOCAL-ONLY MODULE
 *
 * 이 모듈은 각 사용자의 로컬 브라우저 환경에서만 사용됩니다.
 * 외부 배포 or npm 패키지로 제공하지 않습니다.
 *
 * @internal
 * @private
 */

  /**
 * Assign colors to all sites from the color palette
 * Each site gets a consistent color based on its index
 * @returns {void}
 * @example
 * assignColors();
 * console.log(SITE_COLORS_MAP['https://example.com']); // "#10b981"
 */
  function assignColors() {
    allSites.forEach((s, i) => {
      if (!SITE_COLORS_MAP[s]) SITE_COLORS_MAP[s] = COLORS[i % COLORS.length];
    });
  }
  /**
 * Ensure curSite is set to a valid site from allSites
 * If curSite is null or invalid, sets it to the first site
 * @returns {string|null} The current site URL or null if no sites available
 * @example
 * const site = ensureCurrentSite();
 * console.log(site); // "https://example.com" or null
 */
  function ensureCurrentSite() {
    if (!allSites.length) {
      curSite = null;
      return null;
    }
    if (!curSite || !allSites.includes(curSite)) curSite = allSites[0];
    return curSite;
  }
  /**
 * Update the all sites label text in the header
 * Shows site count and merge information if applicable
 * @returns {void}
 * @example
 * setAllSitesLabel(); // Updates header label
 */
  function setAllSitesLabel() {
    if (!labelEl) return;
    const mergedMeta = getMergedMetaState();
    const summary = isMergedReport() && mergedMeta && mergedMeta.sourceCount
      ? `${allSites.length}개 사이트 등록됨 · ${mergedMeta.sourceCount}개 스냅샷 병합`
      : `${allSites.length}개 사이트 등록됨`;
    const labelTextEl = labelEl.querySelector("span");
    labelEl.classList.remove("sadv-meta-hidden");
    if (labelTextEl) labelTextEl.textContent = summary;
    else labelEl.textContent = summary;
    labelEl.title = summary;
  }
  function formatCacheMetaTime(dateLike) {
    const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  function formatRemainingMsLabel(ms) {
    if (!(typeof ms === "number") || !Number.isFinite(ms)) return "-";
    if (ms <= 0) return "곧 갱신";
    const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return `${days}일 ${hours}시간`;
    if (hours > 0) return `${hours}시간 ${minutes}분`;
    return `${minutes}분`;
  }
  function syncLiveHeaderMeta(snapshot) {
    const metaEl = document.getElementById("sadv-cache-meta");
    if (!metaEl) return;
    const state = snapshot && snapshot.cacheMeta ? snapshot : __sadvSnapshot();
    const cacheMeta = state && state.cacheMeta ? state.cacheMeta : null;
    if (!cacheMeta || !cacheMeta.updatedAt) {
      metaEl.innerHTML = "";
      return;
    }
    const ttlHours =
      typeof cacheMeta.ttlMs === "number" && cacheMeta.ttlMs > 0
        ? Math.round(cacheMeta.ttlMs / 3600000)
        : null;
    const remainingLabel =
      typeof cacheMeta.remainingMs === "number"
        ? formatRemainingMsLabel(cacheMeta.remainingMs)
        : null;
    const isNearExpiry =
      typeof cacheMeta.remainingMs === "number" &&
      Number.isFinite(cacheMeta.remainingMs) &&
      cacheMeta.remainingMs > 0 &&
      cacheMeta.remainingMs <= 60 * 60 * 1000;
    const isExpired =
      typeof cacheMeta.remainingMs === "number" &&
      Number.isFinite(cacheMeta.remainingMs) &&
      cacheMeta.remainingMs <= 0;
    const borderCol = isExpired
      ? T.dangerSoftBg
      : isNearExpiry
        ? T.warningSoftBorder
        : "rgba(255,212,0,0.12)";
    const bgCol = isExpired
      ? T.dangerSoftBg
      : isNearExpiry
        ? T.warningSoftBg
        : "rgba(255,255,255,0.02)";
    const textCol = isExpired
      ? C.red
      : isNearExpiry
        ? C.amber
        : "var(--sadv-text-tertiary,#b9a55a)";
    const titleParts = [
      `캐시저장 ${formatCacheMetaTime(cacheMeta.updatedAt)}`,
      remainingLabel ? `자동갱신까지 ${remainingLabel}` : null,
      ttlHours ? `${ttlHours}시간 TTL` : null,
    ].filter(Boolean);
    const compactParts = [
      `캐시 ${formatCacheMetaTime(cacheMeta.updatedAt)}`,
      ttlHours ? `${ttlHours}h` : null,
      remainingLabel,
    ].filter(Boolean);
    const chipStyle =
      "display:inline-flex;align-items:center;max-width:100%;min-height:22px;padding:2px 10px;border-radius:" +
      T.radiusPill +
      ";border:1px solid " +
      borderCol +
      ";background:" +
      bgCol +
      ";color:" +
      textCol +
      ";font-size:10px;font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
    metaEl.innerHTML = sanitizeHTML(
      `<span style="${chipStyle}" title="${escHtml(titleParts.join(" · "))}">${escHtml(compactParts.join(" · "))}</span>`
    );
  }
  /**
 * Build the site selector combo box dropdown
 * Creates clickable items for each site with search functionality
 * @param {Array|null} rows - Optional array of site summary rows for ordering
 * @returns {void}
 * @example
 * buildCombo(summaryRows); // Builds combo with sites ordered by clicks
 * @see {setComboSite}
 */
  function buildCombo(rows) {
    console.log('[buildCombo] Called, allSites:', allSites, 'rows:', rows);
    const drop = document.getElementById("sadv-combo-drop");
    if (!drop) {
      console.error('[buildCombo] sadv-combo-drop not found!');
      return;
    }
    const rowsMap = {};
    if (rows && rows.length)
      rows.forEach((r) => {
        if (allSites.includes(r.site)) rowsMap[r.site] = r;
      });
    const rowSites =
      rows && rows.length
        ? rows.map((r) => r.site).filter((site) => allSites.includes(site))
        : [];
    const restSites = allSites.filter((s) => !rowsMap[s]);
    const orderedSites = [...rowSites, ...restSites];
    console.log('[buildCombo] orderedSites:', orderedSites);

    // Create search container
    const searchDiv = document.createElement("div");
    const isMobile = window.innerWidth <= 768;
    searchDiv.style.cssText = isMobile
      ? "padding:12px 12px 10px;position:sticky;top:0;z-index:1;background:var(--sadv-layer-01,#262626);border-bottom:1px solid var(--sadv-border-subtle,#393939)"
      : "padding:12px 12px 10px;position:sticky;top:0;z-index:1;background:var(--sadv-layer-01,#262626);border-bottom:1px solid var(--sadv-border-subtle,#393939)";

    const input = document.createElement("input");
    input.id = "sadv-combo-search";
    input.placeholder = "사이트 검색...";
    input.style.cssText = isMobile
      ? "width:100%;padding:0 12px;font-size:14px;min-height:44px;border-radius:0;border:1px solid var(--sadv-border,#525252);background:var(--sadv-bg,#161616);color:var(--sadv-text,#f4f4f4);box-sizing:border-box"
      : "width:100%;padding:0 12px;font-size:13px;min-height:40px;border-radius:0;border:1px solid var(--sadv-border,#525252);background:var(--sadv-bg,#161616);color:var(--sadv-text,#f4f4f4);box-sizing:border-box";

    searchDiv.appendChild(input);

    // Create count display
    const countDiv = document.createElement("div");
    countDiv.style.cssText = isMobile
      ? "font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--sadv-text-tertiary,#8d8d8d);padding:10px 14px 8px;background:var(--sadv-layer-01,#262626)"
      : "font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--sadv-text-tertiary,#8d8d8d);padding:10px 14px 8px;background:var(--sadv-layer-01,#262626)";
    countDiv.textContent = "전체 " + orderedSites.length + " 개 · 클릭많은순";

    drop.replaceChildren(searchDiv, countDiv);
    orderedSites.forEach(function (s) {
      const col = SITE_COLORS_MAP[s] || C.muted,
        fullLabel = getSiteLabel(s),
        shortName = getSiteShortName(s),
        siteUrlLabel = normalizeSiteUrl(s),
        row = rowsMap[s],
        clickStr = row ? fmt(row.totalC) + "\uD074\uB9AD" : "—",
        clickCol = row ? C.green : C.muted;
      const item = document.createElement("div");
      item.className = "sadv-combo-item sadv-copt" + (s === curSite ? " active" : "");
      item.dataset.site = s;
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", s === curSite ? "true" : "false");
      item.style.cursor = "pointer";
      item.innerHTML = `<div class="sadv-combo-item-dot" style="background:${col}"></div><div class="sadv-combo-item-info"><div class="sadv-combo-item-name">${escHtml(shortName || fullLabel || s)}</div><div class="sadv-combo-item-url">${escHtml(siteUrlLabel || fullLabel || s)}</div></div><div class="sadv-combo-item-click" style="color:${clickCol}">${escHtml(clickStr)}</div>`;
      item.addEventListener("click", function () {
        setComboSite(s);
        const wrap = document.getElementById("sadv-combo-wrap");
        if (wrap) {
          wrap.classList.remove("open");
          wrap.setAttribute("aria-expanded", "false");
        }
      });
      // Keyboard navigation for combo items
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setComboSite(s);
          const wrap = document.getElementById("sadv-combo-wrap");
          if (wrap) {
            wrap.classList.remove("open");
            wrap.setAttribute("aria-expanded", "false");
          }
          // Return focus to combo button
          const comboBtn = document.getElementById("sadv-combo-btn");
          if (comboBtn) comboBtn.focus();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          const wrap = document.getElementById("sadv-combo-wrap");
          if (wrap) {
            wrap.classList.remove("open");
            wrap.setAttribute("aria-expanded", "false");
          }
          const comboBtn = document.getElementById("sadv-combo-btn");
          if (comboBtn) comboBtn.focus();
        }
        // Arrow key navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const items = Array.from(drop.querySelectorAll('.sadv-combo-item[data-site]'));
          const currentIndex = items.indexOf(item);
          const nextIndex = e.key === 'ArrowDown'
            ? Math.min(currentIndex + 1, items.length - 1)
            : Math.max(currentIndex - 1, 0);
          if (items[nextIndex]) items[nextIndex].focus();
        }
      });
      drop.appendChild(item);
    });
    console.log('[buildCombo] Built', orderedSites.length, 'combo items');
  }
  function setComboSite(site) {
    if (!site || !allSites.includes(site)) return;
    const sameSite = curSite === site;
    curSite = site;
    const col = SITE_COLORS_MAP[site] || C.muted,
      shortName = getSiteLabel(site);
    const comboDot = document.getElementById("sadv-combo-dot");
    const comboLabel = document.getElementById("sadv-combo-label");
    if (comboDot) comboDot.style.background = col;
    if (comboLabel) comboLabel.textContent = shortName;
    document.querySelectorAll(".sadv-combo-item[data-site]").forEach((el) => {
      const isActive = el.dataset.site === site;
      el.classList.toggle("active", isActive);
      el.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    setCachedUiState();
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    if (curMode === CONFIG.MODE.SITE && !sameSite) loadSiteView(site);
    __sadvNotify();
  }
  /**
 * Set the currently selected site in the combo box
 * Updates the combo button, highlights the active item, and loads site view if needed
 * @param {string} site - Site URL to select
 * @returns {void}
 * @example
 * setComboSite('https://example.com');
 * @see {buildCombo}
 */
  function setComboSite(site) {
    if (!site || !allSites.includes(site)) return;
    const sameSite = curSite === site;
    curSite = site;
    const col = SITE_COLORS_MAP[site] || C.muted,
      shortName = getSiteLabel(site);
    const comboDot = document.getElementById("sadv-combo-dot");
    const comboLabel = document.getElementById("sadv-combo-label");
    if (comboDot) comboDot.style.background = col;
    if (comboLabel) comboLabel.textContent = shortName;
    document.querySelectorAll(".sadv-combo-item[data-site]").forEach((el) => {
      const isActive = el.dataset.site === site;
      el.classList.toggle("active", isActive);
      el.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    setCachedUiState();
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    if (curMode === CONFIG.MODE.SITE && !sameSite) loadSiteView(site);
    __sadvNotify();
  }
  const comboWrapMain = document.getElementById("sadv-combo-wrap");
  if (comboWrapMain) {
    comboWrapMain.setAttribute("role", "combobox");
    comboWrapMain.setAttribute("aria-expanded", "false");
  }
  const comboBtn = document.getElementById("sadv-combo-btn");
  if (comboBtn) {
    comboBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const wrap = document.getElementById("sadv-combo-wrap");
      if (!wrap) return;
      wrap.classList.toggle("open");
      wrap.setAttribute("aria-expanded", wrap.classList.contains("open") ? "true" : "false");
      if (wrap.classList.contains("open")) {
        setTimeout(function () {
          const inp = document.getElementById("sadv-combo-search");
          if (inp) {
            inp.style.display = "block";
            inp.value = "";
            inp.focus();
            inp.oninput = function () {
              const q = inp.value.toLowerCase();
              document
                .querySelectorAll(".sadv-combo-item[data-site]")
                .forEach(function (el) {
                  el.style.display =
                    !q ||
                    (((el.dataset.site || "") + " " + getSiteLabel(el.dataset.site || "")).toLowerCase().includes(q))
                      ? "flex"
                      : "none";
                });
            };
          }
        }, 50);
      }
    });
    // Keyboard support for combo button
    comboBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        const wrap = document.getElementById("sadv-combo-wrap");
        if (wrap && wrap.classList.contains("open")) {
          wrap.classList.remove("open");
          wrap.setAttribute("aria-expanded", "false");
        }
      }
      if (e.key === 'ArrowDown' && this.getAttribute("aria-expanded") === "true") {
        e.preventDefault();
        const firstItem = document.querySelector(".sadv-combo-item[data-site]:not([style*='display: none'])");
        if (firstItem) firstItem.focus();
      }
    });
  } else {
    console.warn("[UI Controls] #sadv-combo-btn not found during initialization");
  }
  document.addEventListener("click", function (e) {
    const wrap = document.getElementById("sadv-combo-wrap");
    if (wrap && !wrap.contains(e.target)) {
      wrap.classList.remove("open");
      wrap.setAttribute("aria-expanded", "false");
    }
  });
  // ESC key to close combo dropdown
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const wrap = document.getElementById("sadv-combo-wrap");
      if (wrap && wrap.classList.contains("open")) {
        wrap.classList.remove("open");
        wrap.setAttribute("aria-expanded", "false");
        const activeComboBtn = document.getElementById("sadv-combo-btn");
        if (activeComboBtn) activeComboBtn.focus();
      }
    }
  });
  const TABS = [
    { id: "overview", label: "개요", icon: ICONS.dashboard },
    { id: "daily", label: "일별", icon: ICONS.calendarDays },
    { id: "urls", label: "URL", icon: ICONS.urlLink },
    { id: "queries", label: "검색어", icon: ICONS.searchTab },
    { id: "indexed", label: "색인", icon: ICONS.database },
    { id: "crawl", label: "크롤", icon: ICONS.activity },
    { id: "backlink", label: "백링크", icon: ICONS.backLinkTab },
    { id: "pattern", label: "패턴", icon: ICONS.barChart },
    { id: "insight", label: "인사이트", icon: ICONS.lightbulb },
  ];
  if (tabsEl) {
    tabsEl.setAttribute("role", "tablist");
    tabsEl.replaceChildren(...TABS.map((t) => {
      const btn = document.createElement("button");
      btn.className = `sadv-t${t.id === curTab ? " on" : ""}`;
      btn.dataset.t = t.id;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", t.id === curTab ? "true" : "false");
      btn.setAttribute("aria-controls", "sadv-tabpanel");
      btn.style.cssText = "display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;flex:0 0 auto";
      btn.innerHTML = `${t.icon}${escHtml(t.label)}`;
      return btn;
    }));
    tabsEl.addEventListener("click", function (e) {
      const t = e.target.closest("[data-t]");
      if (!t || t.dataset.t === curTab) return;
      curTab = t.dataset.t;
      tabsEl.querySelectorAll(".sadv-t").forEach((b) => {
        b.classList.remove("on");
        b.setAttribute("aria-selected", "false");
      });
      t.classList.add("on");
      t.setAttribute("aria-selected", "true");
      setCachedUiState();
      if (window.__sadvR) renderTab(window.__sadvR);
      __sadvNotify();
    });
    // Keyboard navigation for tabs
    tabsEl.addEventListener('keydown', function(e) {
      const tab = e.target.closest('.sadv-t');
      if (!tab) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
      }
      // Arrow key navigation
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const tabs = Array.from(tabsEl.querySelectorAll('.sadv-t'));
        const currentIndex = tabs.indexOf(tab);
        const nextIndex = e.key === 'ArrowRight'
          ? Math.min(currentIndex + 1, tabs.length - 1)
          : Math.max(currentIndex - 1, 0);
        if (tabs[nextIndex]) {
          tabs[nextIndex].focus();
          tabs[nextIndex].click();
        }
      }
    });
  } else {
    console.warn("[UI Controls] #sadv-tabs not found during initialization");
  }
  /**
 * Render the current tab content using the provided renderers
 * @param {Object} R - Renderers object with functions for each tab
 * @returns {void}
 * @example
 * renderTab(buildRenderers(expose, crawl, backlink, diagnosisMeta));
 * @see {buildRenderers}
 */
  function renderTab(R) {
    if (!bdEl || !R || typeof R[curTab] !== "function") return;
    bdEl.setAttribute("role", "tabpanel");
    bdEl.id = "sadv-tabpanel";
    bdEl.replaceChildren(R[curTab]());
    bdEl.scrollTop = 0;
  }
  if (modeBar) {
    modeBar.setAttribute("role", "tablist");
    modeBar.addEventListener("click", function (e) {
      const m = e.target.closest("[data-m]");
      if (!m) return;
      switchMode(m.dataset.m);
    });
    // Keyboard navigation for mode buttons
    modeBar.addEventListener('keydown', function(e) {
      const modeBtn = e.target.closest('.sadv-mode');
      if (!modeBtn) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        modeBtn.click();
      }
      // Arrow key navigation
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const modeButtons = Array.from(modeBar.querySelectorAll('.sadv-mode'));
        const currentIndex = modeButtons.indexOf(modeBtn);
        const nextIndex = e.key === 'ArrowRight'
          ? Math.min(currentIndex + 1, modeButtons.length - 1)
          : Math.max(currentIndex - 1, 0);
        if (modeButtons[nextIndex]) {
          modeButtons[nextIndex].focus();
          modeButtons[nextIndex].click();
        }
      }
    });
  } else {
    console.warn("[UI Controls] #sadv-mode-bar not found during initialization");
  }
  /**
 * Switch between 'all' and 'site' view modes
 * Updates UI visibility and loads appropriate view
 * @param {string} mode - Mode to switch to ('all' or 'site')
 * @returns {void}
 * @example
 * switchMode('all'); // Shows all sites overview
 * switchMode('site'); // Shows current site detail
 * @see {renderAllSites}
 * @see {loadSiteView}
 */
  function switchMode(mode) {
    if (mode === curMode) return;
    if (!modeBar || !siteBar || !tabsEl) {
      curMode = mode;
      console.warn("[UI Controls] Missing mode UI containers; switchMode skipped");
      setCachedUiState();
      if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
      __sadvNotify();
      return;
    }
    curMode = mode;
    modeBar
      .querySelectorAll(".sadv-mode")
      .forEach((b) => {
        b.classList.remove("on");
        b.setAttribute("aria-selected", "false");
      });
    const targetBtn = modeBar.querySelector(`[data-m="${mode}"]`);
    if (targetBtn) {
      targetBtn.classList.add("on");
      targetBtn.setAttribute("aria-selected", "true");
    }
    if (mode === CONFIG.MODE.ALL) {
      siteBar.classList.remove("show");
      tabsEl.classList.remove("show");
      setAllSitesLabel();
      renderAllSites();
    } else {
      siteBar.classList.add("show");
      tabsEl.classList.add("show");
      ensureCurrentSite();
      if (curSite) loadSiteView(curSite);
    }
    setCachedUiState();
    if (typeof notifySnapshotShellState === "function") notifySnapshotShellState();
    __sadvNotify();
  }

  var sadvRefreshBtnEl = document.getElementById("sadv-refresh-btn");
  if (sadvRefreshBtnEl) {
    sadvRefreshBtnEl.addEventListener("click", async function () {
      if (this.disabled || this.dataset.busy === "true") return;
      const btn = this;
      const originalHTML = btn.innerHTML;
      btn.dataset.busy = "true";
      btn.disabled = true;
      btn.classList.add("spinning");
      btn.innerHTML = ICONS.refresh + " 로딩 중...";
      try {
        await runFullRefreshPipeline({ trigger: "manual", button: btn });
      } finally {
        btn.classList.remove("spinning");
        btn.disabled = false;
        btn.dataset.busy = "false";
        btn.innerHTML = originalHTML;
        __sadvNotify();
      }
    });
  } else {
    console.warn("[UI Controls] #sadv-refresh-btn not found during initialization");
  }

  var sadvSaveBtnEl = document.getElementById("sadv-save-btn");
  if (sadvSaveBtnEl) {
    sadvSaveBtnEl.addEventListener("click", function () {
      downloadSnapshot();
    });
  } else {
    console.warn("[UI Controls] #sadv-save-btn not found during initialization");
  }

  var sadvCloseBtnEl = document.getElementById("sadv-x");
  if (sadvCloseBtnEl) {
    sadvCloseBtnEl.addEventListener("click", function () {
      const panel = document.getElementById("sadv-p");
      const inj = document.getElementById("sadv-inj");
      if (typeof stopCacheExpiryMonitor === "function") stopCacheExpiryMonitor();
      if (panel) panel.remove();
      if (inj) inj.remove();
      if (typeof window !== "undefined") delete window.__sadvApi;
    });
  } else {
    console.warn("[UI Controls] #sadv-x not found during initialization");
  }

  if (typeof window !== "undefined") {
    window.__sadvApi = {
      getState: __sadvSnapshot,
      isReady: function () {
        return __sadvInitialReady;
      },
      waitUntilReady: function (timeoutMs) {
        return new Promise(function (resolve, reject) {
          if (__sadvInitialReady) {
            resolve(true);
            return;
          }
          let timer = null;
          const done = function (ok) {
            if (timer) clearTimeout(timer);
            resolve(ok);
          };
          __sadvReadyResolvers.push(done);
          if (timeoutMs && timeoutMs > 0) {
            timer = setTimeout(function () {
              const idx = __sadvReadyResolvers.indexOf(done);
              if (idx >= 0) __sadvReadyResolvers.splice(idx, 1);
              reject(new Error("legacy init timeout"));
            }, timeoutMs);
          }
        });
      },
      subscribe: function (fn) {
        __sadvListeners.add(fn);
        return function () {
          __sadvListeners.delete(fn);
        };
      },
      switchMode: function (mode) {
        switchMode(mode);
      },
      setSite: function (site) {
        setComboSite(site);
      },
      setTab: function (tab) {
        if (!tabsEl || !TABS.some(function (item) { return item.id === tab; }) || curTab === tab) return;
        curTab = tab;
        tabsEl.querySelectorAll(".sadv-t").forEach(function (b) {
          b.classList.remove("on");
          b.setAttribute("aria-selected", "false");
        });
        const btn = tabsEl.querySelector('[data-t="' + tab + '"]');
        if (btn) {
          btn.classList.add("on");
          btn.setAttribute("aria-selected", "true");
        }
        if (window.__sadvR) renderTab(window.__sadvR);
        __sadvNotify();
      },
      refresh: function () {
        const btn = document.getElementById("sadv-refresh-btn");
        if (btn) btn.click();
      },
      download: function () {
        downloadSnapshot();
      },
      exportSnapshotData: function (onProgress, options) {
        return collectExportData(onProgress, options);
      },
      buildLegacySnapshotHtml: function (savedAt, payload) {
        return buildSnapshotHtml(savedAt, payload);
      },
      close: function () {
        const panel = document.getElementById("sadv-p");
        const inj = document.getElementById("sadv-inj");
        if (typeof stopCacheExpiryMonitor === "function") stopCacheExpiryMonitor();
        if (panel) panel.remove();
        if (inj) inj.remove();
        delete window.__sadvApi;
      },
    };
  }
