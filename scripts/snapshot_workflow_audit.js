#!/usr/bin/env node
/**
 * Snapshot workflow audit
 *
 * Purpose:
 * - reopen one saved HTML file exactly as an end user would
 * - exercise the high-risk snapshot-only workflow transitions
 * - emit structured JSON so humans/agents can spot which stage regressed
 *
 * This complements verify_snapshot_contract.js:
 * - verify_snapshot_contract.js = fast static string contract guard
 * - snapshot_workflow_audit.js = real browser workflow audit for reopened HTML
 *
 * Non-goals:
 * - it does not validate the live panel
 * - it does not prove pixel-perfect parity with the live runtime
 * - it does not replace targeted manual review when layout/theming changes
 */
const path = require("path");
const { chromium } = require("playwright");

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: node scripts/snapshot_workflow_audit.js <snapshot-html-path>");
    process.exit(1);
  }

  const filePath = target.startsWith("file://")
    ? target
    : "file://" + path.resolve(process.cwd(), target);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  const pageErrors = [];
  const consoleErrors = [];

  page.on("pageerror", (error) => pageErrors.push(String(error)));
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  await page.goto(filePath, { waitUntil: "load" });
  await page.waitForTimeout(1200);

  const result = {};
  const failures = [];

  function assertAudit(condition, message) {
    if (!condition) failures.push(message);
  }

  // Stage 1. Initial reopened saved HTML health check.
  // Signals to watch:
  // - missing ref badge can indicate the wrong build/output was exported
  // - no cards can indicate payload normalization/render bootstrap failure
  result.initial = await page.evaluate(() => ({
    ref: document.getElementById("sadv-runtime-badge")?.textContent?.trim() || null,
    modeAll: !!document.querySelector('.sadv-mode[data-m="all"].on'),
    modeSite: !!document.querySelector('.sadv-mode[data-m="site"].on'),
    comboLabel: document.getElementById("sadv-combo-label")?.textContent?.trim() || null,
    hasCards: !!document.querySelector(".sadv-allcard[data-site]"),
  }));

  // Stage 1.2. All-sites card graph parity check.
  // Saved HTML used to render only the KPI grid while dropping the click/index
  // mini graphs, even though the payload still had click/index history data.
  // Keep this close to the initial render check so regressions fail fast.
  result.allSitesGraphs = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".sadv-allcard[data-site]"));
    const counts = cards.map((card) => ({
      site: card.getAttribute("data-site"),
      svgCount: card.querySelectorAll("svg").length,
      pathCount: card.querySelectorAll("path").length,
      hasIndexLabel: /색인 추이|응답 확인/.test(card.textContent || ""),
    }));
    const first = counts[0] || null;
    return {
      cardsChecked: counts.length,
      cardsWithSvg: counts.filter((item) => item.svgCount > 0).length,
      cardsWithPath: counts.filter((item) => item.pathCount > 0).length,
      cardsWithIndexBlock: counts.filter((item) => item.hasIndexLabel).length,
      firstCard: first,
    };
  });

  // Stage 1.5. Shell-state vs runtime-state parity check.
  // This catches subtle regressions where the saved HTML still renders, but the
  // injected shell contract silently drops fields such as mergedMeta that a
  // future compat layer or shell rehydrator expects.
  result.shellParity = await page.evaluate(() => {
    const hasOwn = Object.prototype.hasOwnProperty;
    const shellState = window.__SEARCHADVISOR_SNAPSHOT_SHELL_STATE__ || null;
    const snapshotApi = window.__SEARCHADVISOR_SNAPSHOT_API__ || null;
    const apiState =
      snapshotApi && typeof snapshotApi.getState === "function"
        ? snapshotApi.getState()
        : null;
    const shellSiteMetaCount =
      shellState && shellState.siteMeta && typeof shellState.siteMeta === "object"
        ? Object.keys(shellState.siteMeta).length
        : 0;
    const apiSiteMetaCount =
      apiState && apiState.siteMeta && typeof apiState.siteMeta === "object"
        ? Object.keys(apiState.siteMeta).length
        : 0;
    return {
      hasShellState: !!shellState,
      hasSnapshotApi: !!snapshotApi,
      hasApiGetState: !!(snapshotApi && typeof snapshotApi.getState === "function"),
      shellStateHasMergedMeta: !!(shellState && hasOwn.call(shellState, "mergedMeta")),
      apiStateHasMergedMeta: !!(apiState && hasOwn.call(apiState, "mergedMeta")),
      mergedMetaEqual:
        JSON.stringify(shellState && hasOwn.call(shellState, "mergedMeta") ? shellState.mergedMeta : null) ===
        JSON.stringify(apiState && hasOwn.call(apiState, "mergedMeta") ? apiState.mergedMeta : null),
      allSitesCount: {
        shell: Array.isArray(shellState?.allSites) ? shellState.allSites.length : 0,
        api: Array.isArray(apiState?.allSites) ? apiState.allSites.length : 0,
      },
      rowsCount: {
        shell: Array.isArray(shellState?.rows) ? shellState.rows.length : 0,
        api: Array.isArray(apiState?.rows) ? apiState.rows.length : 0,
      },
      siteMetaCount: {
        shell: shellSiteMetaCount,
        api: apiSiteMetaCount,
      },
      runtimeVersion: {
        shell: shellState?.runtimeVersion || null,
        api: apiState?.runtimeVersion || null,
      },
    };
  });

  // Stage 1.6. Snapshot runtime contract / capability health check.
  // Saved HTML can still "look okay" while silently losing the runtime-kind
  // flag, shell host, or read-only capability contract that later refactors
  // expect. Keep this close to shellParity so export/bootstrap regressions fail
  // before we start interactive navigation.
  result.contract = await page.evaluate(() => {
    const snapshotApi = window.__SEARCHADVISOR_SNAPSHOT_API__ || null;
    const publicApi = window.__sadvApi || null;
    const capabilities =
      publicApi && typeof publicApi.getCapabilities === "function"
        ? publicApi.getCapabilities()
        : snapshotApi && typeof snapshotApi.getCapabilities === "function"
          ? snapshotApi.getCapabilities()
          : null;
    return {
      runtimeKind: window.__SEARCHADVISOR_RUNTIME_KIND__ || null,
      hasShellHost: !!document.getElementById("sadv-react-shell-host"),
      hasPanel: !!document.getElementById("sadv-p"),
      hasHeader: !!document.getElementById("sadv-header"),
      hasBody: !!document.getElementById("sadv-bd"),
      hasTabs: !!document.getElementById("sadv-tabs"),
      hasSnapshotApi: !!snapshotApi,
      hasPublicApi: !!publicApi,
      capabilities: capabilities
        ? {
            mode: capabilities.mode || null,
            canRefresh: !!capabilities.canRefresh,
            canSave: !!capabilities.canSave,
            canClose: !!capabilities.canClose,
            isReadOnly: !!capabilities.isReadOnly,
          }
        : null,
      hiddenActions: ["sadv-refresh-btn", "sadv-save-btn", "sadv-x"].map((id) => {
        const el = document.getElementById(id);
        return {
          id,
          exists: !!el,
          hidden: !!(el && (el.hidden || getComputedStyle(el).display === "none")),
          removedOrHidden: !el || el.hidden || getComputedStyle(el).display === "none",
        };
      }),
    };
  });

  // Stage 2. Force site mode. This catches shell-state/bootstrap regressions
  // where saved HTML can render, but mode/tabs/site bar never rehydrate.
  await page.evaluate(() => {
    document.querySelector('.sadv-mode[data-m="site"]')?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  });
  await page.waitForTimeout(500);

  result.siteMode = await page.evaluate(() => ({
    modeAll: !!document.querySelector('.sadv-mode[data-m="all"].on'),
    modeSite: !!document.querySelector('.sadv-mode[data-m="site"].on'),
    siteBarClass: document.getElementById("sadv-site-bar")?.className || null,
    tabsClass: document.getElementById("sadv-tabs")?.className || null,
    comboLabel: document.getElementById("sadv-combo-label")?.textContent?.trim() || null,
  }));

  // Stage 3. Open the combo dropdown and inspect layering.
  // We sample multiple Y coordinates with elementFromPoint() because a dropdown
  // can appear visually correct near the top while the lower half is still
  // buried under #sadv-bd. Seeing insideDrop=true and insideBd=false across
  // several points is a stronger signal than checking only bounding boxes.
  await page.evaluate(() => {
    document.getElementById("sadv-combo-btn")?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  });
  await page.waitForTimeout(400);

  result.comboOpen = await page.evaluate(() => {
    const drop = document.getElementById("sadv-combo-drop");
    const bd = document.getElementById("sadv-bd");
    const dr = drop?.getBoundingClientRect?.();
    const points = dr
      ? [dr.top + 20, dr.top + 80, dr.top + 140, dr.bottom - 8].map((y) => {
          const x = dr.left + 20;
          const el = document.elementFromPoint(x, y);
          return {
            y,
            insideDrop: !!(drop && el && drop.contains(el)),
            insideBd: !!(bd && el && bd.contains(el)),
            id: el?.id || null,
            className: el?.className || null,
          };
        })
      : [];
    return {
      wrapOpen: document.getElementById("sadv-combo-wrap")?.classList.contains("open") || false,
      display: drop ? getComputedStyle(drop).display : null,
      position: drop ? getComputedStyle(drop).position : null,
      zIndex: drop ? getComputedStyle(drop).zIndex : null,
      background: drop ? getComputedStyle(drop).backgroundColor : null,
      border: drop ? getComputedStyle(drop).borderColor : null,
      points,
      itemCount: drop ? drop.querySelectorAll(".sadv-combo-item[data-site]").length : 0,
    };
  });

  // Stage 4. Search/filter behavior. This is where stale display:flex/none
  // logic or broken combo bindings usually become obvious.
  const comboSearchSeed = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll(".sadv-combo-item[data-site]")).map((el) => ({
      site: el.getAttribute("data-site") || "",
      text: (el.textContent || "").trim(),
    }));
    function pickSearchTerm(value) {
      const tokens = String(value || "")
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .split(/[^a-z0-9가-힣]+/)
        .filter((token) => token.length >= 3);
      if (!tokens.length) return "";
      const preferred = tokens.find((token) => token.length >= 4);
      return preferred || tokens[0] || "";
    }
    const candidate = items.find((item, index) => {
      if (!item.site) return false;
      if (index === 0 && items.length > 1) return false;
      return !!pickSearchTerm(item.text || item.site);
    }) || items[0] || null;
    const searchTerm = candidate ? pickSearchTerm(candidate.text || candidate.site) : "";
    return {
      searchTerm,
      expectedSite: candidate ? candidate.site : null,
      totalItems: items.length,
    };
  });
  if (comboSearchSeed.searchTerm) {
    await page.fill("#sadv-combo-search", comboSearchSeed.searchTerm);
  }
  await page.waitForTimeout(200);
  result.comboSearch = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll(".sadv-combo-item[data-site]"));
    return {
      searchTerm: document.getElementById("sadv-combo-search")?.value || "",
      totalItems: items.length,
      visibleItems: items
        .filter((el) => getComputedStyle(el).display !== "none")
        .map((el) => el.dataset.site || ""),
      hiddenCount: items.filter((el) => getComputedStyle(el).display === "none").length,
    };
  });

  // Stage 5. Select one visible site and confirm the saved HTML shell updates.
  const visibleItems = await page.locator('.sadv-combo-item[data-site]').evaluateAll((els) =>
    els
      .filter((el) => getComputedStyle(el).display !== "none")
      .map((el) => el.getAttribute("data-site")),
  );
  if (visibleItems.length > 0) {
    await page.locator(`.sadv-combo-item[data-site="${visibleItems[0]}"]`).click();
    await page.waitForTimeout(500);
  }

  result.comboSelect = await page.evaluate(() => ({
    selectedSite: Array.from(document.querySelectorAll(".sadv-combo-item.active"))
      .map((el) => el.dataset.site || "")[0] || null,
    comboLabel: document.getElementById("sadv-combo-label")?.textContent?.trim() || null,
    wrapOpen: document.getElementById("sadv-combo-wrap")?.classList.contains("open") || false,
    activeItems: Array.from(document.querySelectorAll(".sadv-combo-item.active")).map(
      (el) => el.dataset.site || "",
    ),
  }));

  // Stage 6. Go back through all-sites card -> site mode path.
  // This covers the other common navigation entrypoint that bypasses combo
  // search and often regresses independently.
  await page.evaluate(() => {
    document.querySelector('.sadv-mode[data-m="all"]')?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  });
  await page.waitForTimeout(400);
  await page.locator(".sadv-allcard[data-site]").first().click();
  await page.waitForTimeout(500);

  result.cardToSite = await page.evaluate(() => ({
    modeAll: !!document.querySelector('.sadv-mode[data-m="all"].on'),
    modeSite: !!document.querySelector('.sadv-mode[data-m="site"].on'),
    comboLabel: document.getElementById("sadv-combo-label")?.textContent?.trim() || null,
  }));

  // Stage 7. Sub-tab transition. Saved HTML can sometimes restore the first tab
  // but fail on later tab event wiring or body rerender.
  const visibleTabs = await page.locator(".sadv-t").allTextContents();
  if (visibleTabs.length > 1) {
    await page.locator(".sadv-t").nth(1).click();
    await page.waitForTimeout(300);
  }

  result.subTabs = await page.evaluate(() => ({
    visibleTabs: Array.from(document.querySelectorAll(".sadv-t")).map((el) => ({
      label: el.textContent?.trim() || "",
      on: el.classList.contains("on"),
    })),
  }));

  // Stage 8. Keep a screenshot artifact for fast triage after a failure.
  await page.screenshot({
    path: path.resolve(process.cwd(), "tmp_snapshot_workflow_audit.png"),
    fullPage: true,
  });

  // Interpret result.pageErrors as the strongest hard-failure signal.
  // consoleErrors can include noisy warnings, but a sudden increase still helps
  // correlate UI regressions with missing bindings/style dependencies.
  result.pageErrors = pageErrors;
  result.consoleErrors = consoleErrors;
  result.failures = failures;

  assertAudit(result.initial.modeAll, 'initial mode should start in all-sites view');
  assertAudit(result.initial.hasCards, 'initial saved HTML should render at least one all-sites card');
  assertAudit(
    result.allSitesGraphs.cardsWithSvg > 0,
    'all-sites cards should render at least one svg mini-graph in saved HTML',
  );
  assertAudit(
    result.allSitesGraphs.cardsWithPath > 0,
    'all-sites cards should render at least one graph path in saved HTML',
  );
  assertAudit(
    result.allSitesGraphs.cardsWithIndexBlock > 0,
    'all-sites cards should render index trend/fallback block in saved HTML',
  );

  assertAudit(result.shellParity.hasShellState, 'saved HTML should inject __SEARCHADVISOR_SNAPSHOT_SHELL_STATE__');
  assertAudit(result.shellParity.hasSnapshotApi, 'saved HTML should expose __SEARCHADVISOR_SNAPSHOT_API__');
  assertAudit(result.shellParity.hasApiGetState, 'saved HTML snapshot API should expose getState()');
  assertAudit(result.shellParity.shellStateHasMergedMeta, 'shell state JSON should preserve mergedMeta field');
  assertAudit(result.shellParity.apiStateHasMergedMeta, 'snapshot API state should preserve mergedMeta field');
  assertAudit(result.shellParity.mergedMetaEqual, 'shell state and snapshot API should agree on mergedMeta');
  assertAudit(
    result.shellParity.allSitesCount.shell === result.shellParity.allSitesCount.api,
    'shell state and snapshot API should agree on allSites length',
  );
  assertAudit(
    result.shellParity.rowsCount.shell === result.shellParity.rowsCount.api,
    'shell state and snapshot API should agree on rendered row count',
  );
  assertAudit(
    result.shellParity.runtimeVersion.shell === result.shellParity.runtimeVersion.api,
    'shell state and snapshot API should agree on runtimeVersion',
  );

  assertAudit(result.contract.runtimeKind === "snapshot", 'saved HTML runtime kind should be "snapshot"');
  assertAudit(result.contract.hasShellHost, 'saved HTML should include #sadv-react-shell-host');
  assertAudit(result.contract.hasPanel, 'saved HTML should include #sadv-p');
  assertAudit(result.contract.hasHeader, 'saved HTML should include #sadv-header');
  assertAudit(result.contract.hasBody, 'saved HTML should include #sadv-bd');
  assertAudit(result.contract.hasTabs, 'saved HTML should include #sadv-tabs');
  assertAudit(result.contract.hasSnapshotApi, 'saved HTML should expose snapshot API');
  assertAudit(!!result.contract.capabilities, 'saved HTML should expose runtime capabilities');
  assertAudit(
    !!result.contract.capabilities && result.contract.capabilities.isReadOnly,
    'saved HTML capabilities should report read-only mode',
  );
  assertAudit(
    !!result.contract.capabilities &&
      !result.contract.capabilities.canRefresh &&
      !result.contract.capabilities.canSave &&
      !result.contract.capabilities.canClose,
    'saved HTML capabilities should disable live-only actions',
  );
  assertAudit(
    Array.isArray(result.contract.hiddenActions) &&
      result.contract.hiddenActions.every((item) => item.removedOrHidden),
    'saved HTML action buttons should be removed or hidden in read-only mode',
  );

  assertAudit(result.siteMode.modeSite, 'saved HTML should switch into site mode');
  assertAudit(!result.siteMode.modeAll, 'all-sites mode should turn off after switching to site mode');

  assertAudit(result.comboOpen.wrapOpen, 'combo dropdown should open in site mode');
  assertAudit(result.comboOpen.display === 'block', 'combo dropdown should be visible after opening');
  assertAudit(result.comboOpen.position === 'fixed', 'combo dropdown should use fixed positioning in saved HTML');
  assertAudit(
    Number(result.comboOpen.zIndex || 0) >= 2147483646,
    'combo dropdown should keep the top-layer z-index contract',
  );
  assertAudit(result.comboOpen.itemCount > 0, 'combo dropdown should render at least one selectable site');
  assertAudit(
    Array.isArray(result.comboOpen.points) &&
      result.comboOpen.points.length > 0 &&
      result.comboOpen.points.every((point) => point.insideDrop && !point.insideBd),
    'combo dropdown sample points should stay above #sadv-bd',
  );

  assertAudit(
    !!result.comboSearch.searchTerm,
    'combo search step should derive a real search term from the reopened saved HTML',
  );
  assertAudit(
    result.comboSearch.visibleItems.length > 0,
    'combo search should leave at least one visible result',
  );
  assertAudit(
    result.comboSearch.hiddenCount > 0,
    'combo search should hide at least one non-matching result',
  );
  if (comboSearchSeed.expectedSite) {
    assertAudit(
      result.comboSearch.visibleItems.includes(comboSearchSeed.expectedSite),
      'combo search should keep the expected matching site visible',
    );
  }

  assertAudit(
    result.comboSelect.activeItems.length > 0,
    'combo selection should leave one active combo item',
  );
  assertAudit(
    result.comboSelect.wrapOpen === false,
    'combo dropdown should close after selecting a site',
  );
  if (comboSearchSeed.expectedSite) {
    assertAudit(
      result.comboSelect.selectedSite === comboSearchSeed.expectedSite,
      'combo selection should activate the expected searched site',
    );
  }

  assertAudit(result.cardToSite.modeSite, 'all-sites card click should return to site mode');
  assertAudit(
    Array.isArray(result.subTabs.visibleTabs) &&
      result.subTabs.visibleTabs.some((tab) => tab.on),
    'saved HTML should keep one active sub-tab after tab navigation',
  );
  assertAudit(result.pageErrors.length === 0, 'saved HTML should not raise pageerror during audit');

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (failures.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
