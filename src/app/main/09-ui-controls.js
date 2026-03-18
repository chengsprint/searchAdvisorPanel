  function assignColors() {
    allSites.forEach((s, i) => {
      if (!SITE_COLORS_MAP[s]) SITE_COLORS_MAP[s] = COLORS[i % COLORS.length];
    });
  }
  function ensureCurrentSite() {
    if (!allSites.length) {
      curSite = null;
      return null;
    }
    if (!curSite || !allSites.includes(curSite)) curSite = allSites[0];
    return curSite;
  }
  function setAllSitesLabel() {
    const mergedMeta = getMergedMetaState();
    const summary = isMergedReport() && mergedMeta && mergedMeta.sourceCount
      ? `${allSites.length}개 사이트 등록됨 · ${mergedMeta.sourceCount}개 스냅샷 병합`
      : `${allSites.length}개 사이트 등록됨`;
    labelEl.textContent = summary;
  }
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
    searchDiv.style.cssText = "padding:6px 6px 4px;position:relative";

    const input = document.createElement("input");
    input.id = "sadv-combo-search";
    input.placeholder = "사이트 검색...";

    searchDiv.appendChild(input);

    // Create count display
    const countDiv = document.createElement("div");
    countDiv.style.cssText = "font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#3d5a78;padding:3px 9px 6px;border-bottom:1px solid #1a2d45;margin-bottom:3px";
    countDiv.textContent = "전체 " + orderedSites.length + " 개 · 클릭증은순";

    drop.replaceChildren(searchDiv, countDiv);
    orderedSites.forEach(function (s) {
      const col = SITE_COLORS_MAP[s] || C.muted,
        shortName = getSiteLabel(s),
        row = rowsMap[s],
        clickStr = row ? fmt(row.totalC) + "\uD074\uB9AD" : "—",
        clickCol = row ? C.green : C.muted;
      const item = document.createElement("div");
      item.className = "sadv-copt" + (s === curSite ? " active" : "");
      item.dataset.site = s;
      item.innerHTML = `<div class="sadv-combo-item-dot" style="background:${col}"></div><div class="sadv-combo-item-info"><div class="sadv-combo-item-name">${escHtml(shortName.split("/")[0])}</div><div class="sadv-combo-item-url">${escHtml(shortName)}</div></div><div class="sadv-combo-item-click" style="color:${clickCol}">${escHtml(clickStr)}</div>`;
      item.addEventListener("click", function () {
        setComboSite(s);
        const wrap = document.getElementById("sadv-combo-wrap");
        wrap.classList.remove("open");
        wrap.setAttribute("aria-expanded", "false");
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
    document.getElementById("sadv-combo-dot").style.background = col;
    document.getElementById("sadv-combo-label").textContent = shortName;
    document.querySelectorAll(".sadv-combo-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.site === site);
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

  document
    .getElementById("sadv-combo-btn")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      const wrap = document.getElementById("sadv-combo-wrap");
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
                .querySelectorAll(".sadv-combo-item")
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
  document.addEventListener("click", function (e) {
    const wrap = document.getElementById("sadv-combo-wrap");
    if (wrap && !wrap.contains(e.target)) {
      wrap.classList.remove("open");
      wrap.setAttribute("aria-expanded", "false");
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
  tabsEl.setAttribute("role", "tablist");
  tabsEl.replaceChildren(...TABS.map((t) => {
    const btn = document.createElement("button");
    btn.className = `sadv-t${t.id === curTab ? " on" : ""}`;
    btn.dataset.t = t.id;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", t.id === curTab);
    btn.setAttribute("aria-controls", "sadv-tabpanel");
    btn.style.cssText = "display:inline-flex;align-items:center;gap:5px";
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
  function renderTab(R) {
    bdEl.setAttribute("role", "tabpanel");
    bdEl.id = "sadv-tabpanel";
    bdEl.replaceChildren(R[curTab]());
    bdEl.scrollTop = 0;
  }
  modeBar.setAttribute("role", "tablist");
  modeBar.addEventListener("click", function (e) {
    const m = e.target.closest("[data-m]");
    if (!m) return;
    switchMode(m.dataset.m);
  });
  function switchMode(mode) {
    if (mode === curMode) return;
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
