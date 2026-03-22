#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ARTIFACT_ROOT = path.join(ROOT_DIR, 'test-results', 'direct-save-qa');
const SCREENSHOT_DIR = path.join(ARTIFACT_ROOT, 'screenshots');
const DOWNLOAD_DIR = path.join(ARTIFACT_ROOT, 'downloads');
const REPORT_PATH = path.join(ARTIFACT_ROOT, 'direct-save-qa-report.md');
const PORT = 8092;
const HOST = `http://127.0.0.1:${PORT}`;
const SCENARIO_FILTER = (process.env.SADV_SCENARIO_FILTER || '')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);
const DEMO_SITES = [
  'https://example-shop.com',
  'https://tech-blog.kr',
  'https://online-store.net',
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function encodeSiteKey(site) {
  return Buffer.from(encodeURIComponent(site), 'utf8').toString('base64').replace(/=/g, '');
}

function buildLogs(multiplier) {
  return Array.from({ length: 15 }, (_, index) => {
    const clickCount = 120 + index * 18 + multiplier * 12;
    const exposeCount = 480 + index * 35 + multiplier * 20;
    const date = new Date(Date.UTC(2026, 2, 1 + index));
    return {
      date: date.toISOString().slice(0, 10).replace(/-/g, ''),
      clickCount,
      exposeCount,
      ctr: ((clickCount / exposeCount) * 100).toFixed(2),
    };
  });
}

function buildSiteData(multiplier, variantLabel) {
  const logs = buildLogs(multiplier);
  return {
    expose: {
      code: 0,
      items: [{
        period: {
          start: logs[0].date,
          end: logs[logs.length - 1].date,
          prevClickRatio: (4.2 + multiplier).toFixed(1),
          prevExposeRatio: (6.8 + multiplier).toFixed(1),
        },
        logs,
        urls: Array.from({ length: 8 }, (_, idx) => ({
          key: `https://content.example/${variantLabel}/page-${idx + 1}`,
          clickCount: 60 + idx * 9 + multiplier * 6,
          exposeCount: 180 + idx * 14 + multiplier * 11,
          ctr: (2.4 + idx * 0.12 + multiplier * 0.08).toFixed(2),
        })),
        querys: Array.from({ length: 8 }, (_, idx) => ({
          key: `${variantLabel}-keyword-${idx + 1}`,
          clickCount: 32 + idx * 5 + multiplier * 2,
          exposeCount: 140 + idx * 11 + multiplier * 7,
          ctr: (1.8 + idx * 0.09 + multiplier * 0.05).toFixed(2),
        })),
      }],
    },
    crawl: {
      code: 0,
      items: [{
        stats: logs.map((log, idx) => ({
          date: log.date,
          pageCount: 1800 + idx * 44 + multiplier * 30,
          downloadSize: 18000000 + idx * 400000 + multiplier * 250000,
          sumTryCount: 70 + idx * 2,
          sumErrorCount: idx % 6 === 0 ? 1 : 0,
          notFound: idx % 9 === 0 ? 2 : 0,
          serverError: idx % 10 === 0 ? 1 : 0,
          connectTimeout: 0,
        })),
        sitemaps: [{ url: 'https://content.example/sitemap.xml', status: 'ok', count: 128 }],
      }],
    },
    backlink: {
      code: 0,
      items: [{
        total: 640 + multiplier * 30,
        domains: 42 + multiplier * 2,
        countTime: logs.map((log, idx) => ({
          timeStamp: log.date,
          backlinkCnt: 210 + idx * 7 + multiplier * 9,
        })),
        topDomain: Array.from({ length: 5 }, (_, idx) => ({
          domain: `${variantLabel}-partner-${idx + 1}.example`,
          backlinkCnt: 90 - idx * 8 + multiplier * 6,
        })),
      }],
    },
    diagnosisMeta: {
      code: 0,
      items: [{
        meta: logs.map((log, idx) => ({
          date: log.date,
          stateCount: {
            '1': 980 + idx * 15 + multiplier * 10,
            '2': 42 + (idx % 4),
            '3': 8 + (idx % 3),
            '4': 3 + (idx % 2),
          },
        })),
      }],
    },
    diagnosisMetaRange: {
      start: logs[0].date,
      end: logs[logs.length - 1].date,
    },
    detailLoaded: true,
    __cacheSavedAt: Date.now(),
  };
}

function buildDataset(tag) {
  const variantBase = tag === 'refreshed' ? 4 : 1;
  return DEMO_SITES.reduce((acc, site, index) => {
    acc[site] = buildSiteData(variantBase + index, `${tag}-site-${index + 1}`);
    return acc;
  }, {});
}

function createStaticServer(rootDir, port) {
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
  };

  const server = http.createServer((req, res) => {
    const reqPath = req.url === '/' ? '/demo.html' : req.url.split('?')[0];
    if (reqPath === '/__runner__.html') {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      res.end('<!doctype html><html><head><meta charset="utf-8"><title>Direct Save QA Runner</title></head><body></body></html>');
      return;
    }
    const safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(rootDir, safePath);

    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': contentTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function waitForPanelReady(page, readyDelayMs = 500) {
  await page.waitForSelector('#sadv-p', { timeout: 15000, state: 'attached' });
  await page.waitForFunction(() => !!window.__sadvApi && typeof window.__sadvApi.directSave === 'function', null, {
    timeout: 15000,
  });
  if (readyDelayMs > 0) {
    await page.waitForTimeout(readyDelayMs);
  }
}

async function seedCache(page, dataset, timestamp) {
  await page.evaluate(({ dataset, timestamp }) => {
    localStorage.setItem('sadv_sites_v1_demo', JSON.stringify({
      ts: timestamp,
      sites: Object.keys(dataset),
    }));
    const encodeKey = (site) => btoa(encodeURIComponent(site)).replace(/=/g, '');
    Object.entries(dataset).forEach(([site, data]) => {
      localStorage.setItem(`sadv_data_v2_demo_${encodeKey(site)}`, JSON.stringify({
        ts: timestamp,
        data,
      }));
    });
  }, { dataset, timestamp });
}

async function installStatusProbe(page) {
  await page.evaluate(() => {
    window.__SADV_SAVE_EVENTS = [];
    if (window.__SADV_SAVE_UNSUB__) {
      try { window.__SADV_SAVE_UNSUB__(); } catch (e) {}
    }
    window.__SADV_SAVE_UNSUB__ = window.__sadvApi.subscribeSaveStatus((status) => {
      try {
        window.__SADV_SAVE_EVENTS.push(JSON.parse(JSON.stringify(status)));
      } catch (e) {
        window.__SADV_SAVE_EVENTS.push({ state: status && status.state, phase: status && status.phase });
      }
    });
  });
}

async function installRequestProbe(page) {
  await page.evaluate(() => {
    window.__SADV_REQUEST_EVENTS = Array.isArray(window.__SADV_REQUEST_EVENTS)
      ? window.__SADV_REQUEST_EVENTS
      : [];
    window.__SADV_TEST_EVENTS = Array.isArray(window.__SADV_TEST_EVENTS)
      ? window.__SADV_TEST_EVENTS
      : [];
    window.__SADV_SAVE_TRIGGER_AT__ =
      typeof window.__SADV_SAVE_TRIGGER_AT__ === 'number'
        ? window.__SADV_SAVE_TRIGGER_AT__
        : null;
  });
}

async function startDirectSave(page, options) {
  return page.evaluate((directSaveOptions) => {
    window.__SADV_SAVE_TRIGGER_AT__ = Date.now();
    window.__SADV_DIRECTSAVE_RESULT__ = null;
    window.__SADV_DIRECTSAVE_ERROR__ = null;
    window.__SADV_DIRECTSAVE_PROMISE__ = window.__sadvApi.directSave(directSaveOptions)
      .then((result) => {
        window.__SADV_DIRECTSAVE_RESULT__ = result;
        return result;
      })
      .catch((error) => {
        window.__SADV_DIRECTSAVE_ERROR__ = error ? String(error.message || error) : 'unknown-error';
        throw error;
      });
    return true;
  }, options || null);
}

async function startSaveButtonDownload(page) {
  await page.evaluate(() => {
    window.__SADV_SAVE_TRIGGER_AT__ = Date.now();
  });
  await page.click('#sadv-save-btn');
  return true;
}

async function startBackgroundHeadlessSave(page, options) {
  return page.evaluate((backgroundOptions) => {
    window.__SADV_SAVE_TRIGGER_AT__ = Date.now();
    window.__SADV_DIRECTSAVE_RESULT__ = null;
    window.__SADV_DIRECTSAVE_ERROR__ = null;
    window.__SADV_DIRECTSAVE_PROMISE__ = window.__sadvApi.loadAndDirectSaveHeadless(backgroundOptions)
      .then((result) => {
        window.__SADV_DIRECTSAVE_RESULT__ = result;
        return result;
      })
      .catch((error) => {
        window.__SADV_DIRECTSAVE_ERROR__ = error ? String(error.message || error) : 'unknown-error';
        throw error;
      });
    return true;
  }, options || null);
}

async function waitForSaveState(page, expectedState, timeoutMs = 30000) {
  await page.waitForFunction((state) => {
    const status = window.__SEARCHADVISOR_SAVE_STATUS__;
    if (status && status.state === state) return true;
    const el = document.getElementById('sadv-save-status-overlay');
    return !!el && el.dataset.state === state;
  }, expectedState, { timeout: timeoutMs });
}

async function waitForSaveSettle(page, timeoutMs = 40000) {
  await page.waitForFunction(() => {
    const status = window.__SEARCHADVISOR_SAVE_STATUS__;
    return !!status && status.active === false && (
      status.state === 'completed' ||
      status.state === 'completed-with-issues' ||
      status.state === 'blocked' ||
      status.state === 'failed'
    );
  }, null, { timeout: timeoutMs });
}

async function getScenarioResult(page, downloadTriggered) {
  return page.evaluate((downloadTriggeredValue) => ({
    requestProbe: (() => {
      const requestEvents = Array.isArray(window.__SADV_REQUEST_EVENTS)
        ? window.__SADV_REQUEST_EVENTS
        : [];
      const saveTriggeredAt =
        typeof window.__SADV_SAVE_TRIGGER_AT__ === 'number' ? window.__SADV_SAVE_TRIGGER_AT__ : null;
      const reportEvents = requestEvents.filter((entry) => !!entry && typeof entry.reportKey === 'string' && entry.reportKey);
      const reportCounts = new Map();
      const reportCountsAfterSave = new Map();
      const reportKeysBeforeSave = new Set();
      reportEvents.forEach((entry) => {
        reportCounts.set(entry.reportKey, (reportCounts.get(entry.reportKey) || 0) + 1);
        if (typeof saveTriggeredAt === 'number' && entry.at < saveTriggeredAt) {
          reportKeysBeforeSave.add(entry.reportKey);
        }
        if (typeof saveTriggeredAt === 'number' && entry.at >= saveTriggeredAt) {
          reportCountsAfterSave.set(entry.reportKey, (reportCountsAfterSave.get(entry.reportKey) || 0) + 1);
        }
      });
      const duplicateReportKeys = Array.from(reportCounts.entries())
        .filter(([, count]) => count > 1)
        .map(([key]) => key);
      const duplicateReportKeysAfterSave = Array.from(reportCountsAfterSave.entries())
        .filter(([key, count]) => count > 1 || reportKeysBeforeSave.has(key))
        .map(([key]) => key);
      const saveEvents = Array.isArray(window.__SADV_SAVE_EVENTS) ? window.__SADV_SAVE_EVENTS : [];
      const waitingIndex = saveEvents.findIndex((entry) => entry && entry.state === 'waiting-refresh');
      const collectingAfterWaiting =
        waitingIndex >= 0 &&
        saveEvents.slice(waitingIndex + 1).some((entry) => entry && entry.state === 'collecting');
      return {
        saveTriggeredAt,
        totalRequestEvents: requestEvents.length,
        totalReportRequests: reportEvents.length,
        duplicateReportKeys,
        duplicateReportKeysAfterSave,
        collectingAfterWaiting,
      };
    })(),
    saveStatus: window.__sadvApi.getSaveStatus(),
    directSaveResult: window.__SADV_DIRECTSAVE_RESULT__,
    directSaveError: window.__SADV_DIRECTSAVE_ERROR__,
    captureProbe: window.__SADV_CAPTURE_PROBE__ || null,
    saveEvents: Array.isArray(window.__SADV_SAVE_EVENTS) ? window.__SADV_SAVE_EVENTS : [],
    overlayState: document.getElementById('sadv-save-status-overlay')?.dataset?.state || null,
    overlayPhase: document.getElementById('sadv-save-status-overlay')?.dataset?.phase || null,
    overlayUiHidden: document.getElementById('sadv-save-status-overlay')?.dataset?.uiHidden || null,
    overlayText: document.getElementById('sadv-save-status-overlay')?.innerText || '',
    panelVisibility: document.getElementById('sadv-p') ? getComputedStyle(document.getElementById('sadv-p')).visibility : null,
    panelOpacity: document.getElementById('sadv-p') ? getComputedStyle(document.getElementById('sadv-p')).opacity : null,
    failureSummaryText: document.getElementById('sadv-refresh-failure-summary')?.innerText || '',
    downloadTriggered: downloadTriggeredValue,
  }), downloadTriggered);
}

function validateScenarioResult(scenario, scenarioResult) {
  const requestProbe = scenarioResult.result.requestProbe || {};
  const collectProbe = scenarioResult.result.collectProbe || {};
  if (scenario.expectNoCollectingAfterWaitingRefresh && requestProbe.collectingAfterWaiting) {
    throw new Error(
      `[${scenario.name}] waiting-refresh 이후 collecting 상태가 다시 발생했습니다.`
    );
  }
  if (
    scenario.expectNoDuplicateReportKeys &&
    Array.isArray(requestProbe.duplicateReportKeys) &&
    requestProbe.duplicateReportKeys.length > 0
  ) {
    throw new Error(
      `[${scenario.name}] report 요청 중복이 감지됐습니다: ${requestProbe.duplicateReportKeys.join(', ')}`
    );
  }
  if (
    scenario.expectNoDuplicateReportKeysAfterSave &&
    Array.isArray(requestProbe.duplicateReportKeysAfterSave) &&
    requestProbe.duplicateReportKeysAfterSave.length > 0
  ) {
    throw new Error(
      `[${scenario.name}] save 시작 이후 중복 report 요청이 감지됐습니다: ${requestProbe.duplicateReportKeysAfterSave.join(', ')}`
    );
  }
  if (scenario.expectedCollectStartsBySource && collectProbe.bySource) {
    const expectedEntries = Object.entries(scenario.expectedCollectStartsBySource);
    const mismatched = expectedEntries.filter(([source, expectedCount]) => {
      const actualCount = collectProbe.bySource[source] || 0;
      return actualCount !== expectedCount;
    });
    if (mismatched.length > 0) {
      throw new Error(
        `[${scenario.name}] collect-export-start source mismatch: ` +
          mismatched
            .map(([source, expectedCount]) => {
              const actualCount = collectProbe.bySource[source] || 0;
              return `${source} expected=${expectedCount} actual=${actualCount}`;
            })
            .join(', ')
      );
    }
  }
}

async function runScenario(browser, scenario, dataset) {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1400 },
    acceptDownloads: true,
  });
  let downloadTriggered = false;
  let downloadPath = null;
  context.on('page', () => {});
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message || String(error));
  });
  page.on('download', async (download) => {
    downloadTriggered = true;
    try {
      const safeName =
        (scenario.name || 'download') + '-' + (download.suggestedFilename ? download.suggestedFilename() : 'artifact.html');
      const targetPath = path.join(DOWNLOAD_DIR, safeName);
      ensureDir(DOWNLOAD_DIR);
      await download.saveAs(targetPath);
      downloadPath = targetPath;
    } catch (e) {}
  });

  await page.addInitScript((seed) => {
    window.__FORCE_DEMO_MODE__ = true;
    window.__sadvInitData = seed.initData;
    if (seed.initMergedData) {
      window.__sadvMergedData = seed.initMergedData;
    }
    if (seed.bootRequest) {
      window.__SEARCHADVISOR_BOOT_REQUEST__ = seed.bootRequest;
    }
  }, {
    initData:
      scenario.initData || { sites: Object.fromEntries(DEMO_SITES.map((site) => [site, null])) },
    initMergedData: scenario.initMergedData || null,
    bootRequest: scenario.bootRequest || null,
  });
  await page.addInitScript(() => {
    window.__SADV_REQUEST_EVENTS = [];
    window.__SADV_SAVE_TRIGGER_AT__ = null;
    const originalFetch = window.fetch.bind(window);
    function buildReportKey(rawUrl, method) {
      try {
        const parsed = new URL(rawUrl, window.location.href);
        if (
          method !== 'GET' ||
          parsed.host !== 'searchadvisor.naver.com' ||
          parsed.pathname.indexOf('/api-console/report/') === -1
        ) {
          return null;
        }
        const field = parsed.searchParams.get('field') || '';
        const site = parsed.searchParams.get('site') || '';
        return `${parsed.pathname}|field=${field}|site=${site}`;
      } catch (e) {
        return null;
      }
    }
    window.fetch = function (input, init) {
      const requestUrl =
        typeof input === 'string'
          ? input
          : input && typeof input.url === 'string'
            ? input.url
            : String(input);
      const method =
        (init && init.method) ||
        (input && input.method) ||
        'GET';
      const normalizedMethod = String(method).toUpperCase();
      window.__SADV_REQUEST_EVENTS.push({
        at: Date.now(),
        method: normalizedMethod,
        url: requestUrl,
        reportKey: buildReportKey(requestUrl, normalizedMethod),
      });
      return originalFetch(input, init);
    };
  });

  await page.goto(`${HOST}/__runner__.html`, { waitUntil: 'domcontentloaded' });
  if (scenario.preloadCache) {
    await scenario.preloadCache(page, dataset);
  }
  if (scenario.beforeLoad) {
    await scenario.beforeLoad(page, dataset);
  }

  await page.addScriptTag({ url: `${HOST}/runtime.js?ts=${Date.now()}` });
  await waitForPanelReady(page, scenario.readyDelayMs == null ? 500 : scenario.readyDelayMs);
  await installStatusProbe(page);
  await installRequestProbe(page);

  if (scenario.beforeStart) {
    await scenario.beforeStart(page, dataset);
  }

  if (typeof scenario.start === 'function') {
    await scenario.start(page, dataset);
  } else if (!scenario.autoStart) {
    await startDirectSave(page, scenario.directSaveOptions || null);
  }

  if (scenario.captureState) {
    await waitForSaveState(page, scenario.captureState, scenario.captureTimeoutMs || 30000);
  }

  if (scenario.beforeCapture) {
    await scenario.beforeCapture(page);
  }
  if (scenario.captureProbe) {
    await page.evaluate(() => {
      const overlay = document.getElementById('sadv-save-status-overlay');
      const panel = document.getElementById('sadv-p');
      window.__SADV_CAPTURE_PROBE__ = {
        overlayPresent: !!overlay,
        overlayState: overlay?.dataset?.state || null,
        overlayUiHidden: overlay?.dataset?.uiHidden || null,
        panelVisibility: panel ? getComputedStyle(panel).visibility : null,
        panelOpacity: panel ? getComputedStyle(panel).opacity : null,
      };
    });
  }

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, scenario.screenshot),
    fullPage: true,
  });

  await waitForSaveSettle(page, scenario.settleTimeoutMs || 45000);
  await page.waitForTimeout(200);

  const result = await getScenarioResult(page, downloadTriggered);
  const scenarioResult = {
    name: scenario.name,
    description: scenario.description,
    screenshot: scenario.screenshot,
    downloadPath,
    result,
    consoleMessages,
    pageErrors,
  };
  validateScenarioResult(scenario, scenarioResult);
  await page.close();
  await context.close();
  return scenarioResult;
}

async function runSavedVerification(browser, savedHtmlPath) {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1400 },
  });
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message || String(error));
  });

  await page.goto(`file://${savedHtmlPath}`, { waitUntil: 'load' });
  await page.waitForSelector('#sadv-p', { timeout: 15000 });
  await page.waitForFunction(() => !!window.__sadvApi, null, { timeout: 15000 });
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '08-saved-runtime-opened.png'),
    fullPage: true,
  });
  const result = await page.evaluate(() => ({
    runtimeKind: window.__SEARCHADVISOR_RUNTIME_KIND__ || null,
    saveStatus: window.__sadvApi.getSaveStatus(),
    hasPublicApi: !!window.__sadvApi,
    hasSnapshotApi: !!window.__SEARCHADVISOR_SNAPSHOT_API__,
  }));
  await page.close();
  await context.close();
  return {
    name: '08-saved-runtime-opened',
    description: '저장된 HTML을 다시 열었을 때 saveStatus.runtimeType이 saved로 보이는지 확인',
    screenshot: '08-saved-runtime-opened.png',
    result,
    consoleMessages,
    pageErrors,
  };
}

function renderScenarioSection(lines, scenarioResult) {
  const saveStatus = scenarioResult.result.saveStatus || {};
  const directSaveResult = scenarioResult.result.directSaveResult || null;
  const directSaveError = scenarioResult.result.directSaveError || null;

  lines.push(`## ${scenarioResult.name}`);
  lines.push('');
  lines.push(`- 설명: ${scenarioResult.description}`);
  lines.push(`- 캡처: screenshots/${scenarioResult.screenshot}`);
  lines.push(`- 최종 상태: ${saveStatus.state || '(none)'}`);
  lines.push(`- phase: ${saveStatus.phase || '(none)'}`);
  lines.push(`- runtimeType: ${saveStatus.runtimeType || '(none)'}`);
  lines.push(`- downloadTriggered: ${scenarioResult.result.downloadTriggered ? 'true' : 'false'}`);
  if (scenarioResult.result.overlayUiHidden != null) {
    lines.push(`- overlay uiHidden: ${scenarioResult.result.overlayUiHidden}`);
  }
  if (scenarioResult.result.panelVisibility != null) {
    lines.push(`- panel visibility: ${scenarioResult.result.panelVisibility}`);
  }
  if (scenarioResult.result.panelOpacity != null) {
    lines.push(`- panel opacity: ${scenarioResult.result.panelOpacity}`);
  }
  if (scenarioResult.result.captureProbe) {
    const probe = scenarioResult.result.captureProbe;
    lines.push(`- capture probe overlayPresent: ${probe.overlayPresent ? 'true' : 'false'}`);
    lines.push(`- capture probe overlayState: ${probe.overlayState || '(none)'}`);
    lines.push(`- capture probe overlayUiHidden: ${probe.overlayUiHidden || '(none)'}`);
    lines.push(`- capture probe panel visibility: ${probe.panelVisibility || '(none)'}`);
    lines.push(`- capture probe panel opacity: ${probe.panelOpacity || '(none)'}`);
  }
  if (directSaveResult) {
    lines.push(`- directSave 반환 ok: ${String(!!directSaveResult.ok)}`);
    lines.push(`- directSave 반환 status: ${directSaveResult.status || '(none)'}`);
    lines.push(`- directSave 반환 hasIssues: ${String(!!directSaveResult.hasIssues)}`);
    if (directSaveResult.fileName) lines.push(`- fileName: ${directSaveResult.fileName}`);
    if (directSaveResult.stats) {
      lines.push(`- stats: success ${directSaveResult.stats.success || 0} / partial ${directSaveResult.stats.partial || 0} / failed ${directSaveResult.stats.failed || 0}`);
    }
  }
  if (directSaveError) {
    lines.push(`- directSave 에러: ${directSaveError}`);
  }
  if (scenarioResult.result.failureSummaryText) {
    lines.push(`- 실패 요약 UI: ${scenarioResult.result.failureSummaryText.replace(/\s+/g, ' ').trim()}`);
  }
  if (scenarioResult.result.requestProbe) {
    lines.push(`- report 요청 수: ${scenarioResult.result.requestProbe.totalReportRequests || 0}`);
    if (scenarioResult.result.requestProbe.duplicateReportKeys?.length) {
      lines.push(`- duplicate report keys: ${scenarioResult.result.requestProbe.duplicateReportKeys.join(', ')}`);
    }
    if (scenarioResult.result.requestProbe.duplicateReportKeysAfterSave?.length) {
      lines.push(`- duplicate report keys after save: ${scenarioResult.result.requestProbe.duplicateReportKeysAfterSave.join(', ')}`);
    }
    lines.push(`- collecting after waiting-refresh: ${scenarioResult.result.requestProbe.collectingAfterWaiting ? 'true' : 'false'}`);
  }
  if (scenarioResult.result.collectProbe) {
    lines.push(`- collect-export-start total: ${scenarioResult.result.collectProbe.totalCollectStarts || 0}`);
    if (scenarioResult.result.collectProbe.bySource) {
      lines.push(`- collect-export-start by source: ${JSON.stringify(scenarioResult.result.collectProbe.bySource)}`);
    }
  }
  if (scenarioResult.pageErrors.length) {
    lines.push(`- pageErrors: ${scenarioResult.pageErrors.join(' | ')}`);
  }
  const errorConsole = scenarioResult.consoleMessages.filter((entry) => entry.type === 'error');
  if (errorConsole.length) {
    lines.push(`- console error 수: ${errorConsole.length}`);
  }
  lines.push('');
}

async function main() {
  ensureDir(SCREENSHOT_DIR);
  const server = await createStaticServer(DIST_DIR, PORT);
  const browser = await chromium.launch({ headless: true });
  const freshDataset = buildDataset('fresh');
  const freshTimestamp = Date.now();
  const expiredTimestamp = Date.now() - 14 * 24 * 60 * 60 * 1000;

  const scenarios = [
    {
      name: '01-fresh-cache-direct-save-success',
      description: '신선한 캐시가 있을 때 directSave가 refresh 없이 완료되는지 확인',
      screenshot: '01-fresh-cache-direct-save-success.png',
      preloadCache: async (page, dataset) => {
        await seedCache(page, dataset, freshTimestamp);
      },
      captureState: 'completed',
    },
    {
      name: '02-cache-miss-direct-save-refreshing',
      description: '캐시가 없을 때 directSave가 자동 refresh 단계로 들어가는지 확인',
      screenshot: '02-cache-miss-direct-save-refreshing.png',
      captureState: 'refreshing',
      beforeCapture: async (page) => {
        await page.waitForTimeout(300);
      },
    },
    {
      name: '03-partial-issue-direct-save',
      description: '일부 사이트를 partial 상태로 강제했을 때 completed-with-issues와 실패 요약 UI가 보이는지 확인',
      screenshot: '03-partial-issue-direct-save.png',
      preloadCache: async (page, dataset) => {
        const partialDataset = JSON.parse(JSON.stringify(dataset));
        partialDataset[DEMO_SITES[1]] = {
          ...partialDataset[DEMO_SITES[1]],
          crawl: null,
          backlink: null,
          detailLoaded: false,
        };
        await seedCache(page, partialDataset, freshTimestamp);
      },
      beforeStart: async (page) => {
        await page.evaluate((partialSite) => {
          const originalFetch = window.fetch.bind(window);
          window.fetch = function (input, init) {
            const url = String(input);
            const isTargetSite = url.includes(encodeURIComponent(partialSite));
            const isDetailRequest =
              url.includes('/report/crawl/') ||
              url.includes('/report/backlink/') ||
              url.includes('field=crawl') ||
              url.includes('field=backlink');
            if (isTargetSite && isDetailRequest) {
              return Promise.reject(new Error('Injected partial detail block for directSave QA'));
            }
            return originalFetch(input, init);
          };
        }, DEMO_SITES[1]);
      },
      beforeCapture: async (page) => {
        await page.waitForTimeout(500);
      },
    },
    {
      name: '04-hard-failure-direct-save',
      description: '다운로드 채널 자체를 차단했을 때 failed 상태와 실패 UI가 보이는지 확인',
      screenshot: '04-hard-failure-direct-save.png',
      preloadCache: async (page, dataset) => {
        await seedCache(page, dataset, freshTimestamp);
      },
      beforeStart: async (page) => {
        await page.evaluate(() => {
          const originalCreateObjectURL = URL.createObjectURL.bind(URL);
          window.__SADV_ORIGINAL_CREATE_OBJECT_URL__ = originalCreateObjectURL;
          URL.createObjectURL = function () {
            throw new Error('Injected download block for directSave QA');
          };
        });
      },
      captureState: 'failed',
      beforeCapture: async (page) => {
        await page.waitForTimeout(300);
      },
    },
    {
      name: '05-merge-direct-save-success',
      description: '병합 메타가 있는 런타임에서 directSave가 MERGE 타입으로 동작하는지 확인',
      screenshot: '05-merge-direct-save-success.png',
      initData: { sites: Object.fromEntries(DEMO_SITES.map((site) => [site, null])) },
      initMergedData: {
        sites: freshDataset,
        accounts_merged: ['alpha@demo.local', 'beta@demo.local'],
      },
      preloadCache: async (page, dataset) => {
        await seedCache(page, dataset, freshTimestamp);
      },
      captureState: 'completed',
    },
    {
      name: '06-headless-direct-save-success',
      description: 'headless directSave가 저장 중 패널을 숨기고 overlay 없이 완료되는지 확인',
      screenshot: '06-headless-direct-save-success.png',
      directSaveOptions: { headless: true },
      captureState: 'refreshing',
      captureTimeoutMs: 40000,
      captureProbe: true,
      beforeCapture: async (page) => {
        await page.waitForTimeout(300);
      },
    },
    {
      name: '07-background-download-boot-hidden',
      description: '부트 순간부터 패널을 숨긴 채 기존 저장 버튼 경로(downloadSnapshot)로 저장되는지 확인',
      screenshot: '07-background-download-boot-hidden.png',
      readyDelayMs: 0,
      autoStart: true,
      bootRequest: { action: 'background-download', cleanupDelayMs: 1800 },
      preloadCache: async (page, dataset) => {
        await seedCache(page, dataset, freshTimestamp);
      },
      captureProbe: true,
      beforeCapture: async (page) => {
        await page.waitForTimeout(250);
      },
    },
    {
      name: '08-direct-save-blocked-on-failure-ratio',
      description: '사이트 실패율이 20%를 넘으면 저장이 차단되고 다운로드가 발생하지 않는지 확인',
      screenshot: '08-direct-save-blocked-on-failure-ratio.png',
      beforeStart: async (page) => {
        await page.evaluate(() => {
          const originalFetch = window.fetch.bind(window);
          window.fetch = function (input, init) {
            const url = String(input);
            const isExposeRequest =
              url.includes('searchadvisor.naver.com') &&
              (url.includes('/report/expose/') || url.includes('field=expose'));
            if (isExposeRequest) {
              return Promise.reject(new Error('Injected failure-ratio block for directSave QA'));
            }
            return originalFetch(input, init);
          };
        });
      },
      captureState: 'blocked',
      captureTimeoutMs: 40000,
      beforeCapture: async (page) => {
        await page.waitForTimeout(400);
      },
    },
    {
      name: '09-direct-save-blocked-on-panel-error',
      description: '치명적인 패널 사용자 오류 배너가 살아 있으면 저장이 차단되고 다운로드가 발생하지 않는지 확인',
      screenshot: '09-direct-save-blocked-on-panel-error.png',
      preloadCache: async (page, dataset) => {
        await seedCache(page, dataset, freshTimestamp);
      },
      beforeStart: async (page) => {
        await page.evaluate(() => {
          const banner = document.createElement('div');
          banner.id = 'sadv-user-error-banner';
          banner.textContent = '패널 작업 중 문제가 발생했어요';
          document.body.appendChild(banner);
          window.__SEARCHADVISOR_LAST_USER_ERROR__ = {
            message: '사용자 정보를 찾을 수 없어요. 서치어드바이저 페이지에서 다시 실행해주세요.',
            technical: 'Injected panel user error for save blocking QA',
            context: 'save-blocking-qa',
            at: Date.now(),
          };
        });
      },
      captureState: 'blocked',
      captureTimeoutMs: 40000,
      beforeCapture: async (page) => {
        await page.waitForTimeout(400);
      },
    },
    {
      name: '10-save-button-waits-auto-refresh',
      description: 'cache-expiry auto refresh가 이미 진행 중이면 저장 버튼이 waiting-refresh 상태로 합류하는지 확인',
      screenshot: '10-save-button-waits-auto-refresh.png',
      expectNoCollectingAfterWaitingRefresh: true,
      expectNoDuplicateReportKeysAfterSave: true,
      readyDelayMs: 0,
      preloadCache: async (page, dataset) => {
        await seedCache(page, dataset, expiredTimestamp);
      },
      beforeLoad: async (page) => {
        await page.addInitScript(() => {
          const originalFetch = window.fetch.bind(window);
          window.fetch = async function (input, init) {
            const url = String(input);
            const isReportRequest =
              url.includes('searchadvisor.naver.com/api-console/report/');
            if (isReportRequest) {
              await new Promise((resolve) => setTimeout(resolve, 250));
            }
            return originalFetch(input, init);
          };
        });
      },
      start: async (page) => {
        await startSaveButtonDownload(page);
      },
      captureState: 'waiting-refresh',
      captureTimeoutMs: 20000,
      expectNoCollectingAfterWaitingRefresh: true,
      expectNoDuplicateReportKeys: true,
      expectNoDuplicateReportKeysAfterSave: true,
      beforeCapture: async (page) => {
        await page.waitForTimeout(300);
      },
    },
    {
      name: '11-direct-save-waits-auto-refresh',
      description: 'cache-expiry auto refresh가 이미 진행 중이면 directSave가 waiting-refresh 상태로 합류하는지 확인',
      screenshot: '11-direct-save-waits-auto-refresh.png',
      expectNoCollectingAfterWaitingRefresh: true,
      expectNoDuplicateReportKeysAfterSave: true,
      readyDelayMs: 0,
      preloadCache: async (page, dataset) => {
        await seedCache(page, dataset, expiredTimestamp);
      },
      beforeLoad: async (page) => {
        await page.addInitScript(() => {
          const originalFetch = window.fetch.bind(window);
          window.fetch = async function (input, init) {
            const url = String(input);
            const isReportRequest =
              url.includes('searchadvisor.naver.com/api-console/report/');
            if (isReportRequest) {
              await new Promise((resolve) => setTimeout(resolve, 250));
            }
            return originalFetch(input, init);
          };
        });
      },
      captureState: 'waiting-refresh',
      captureTimeoutMs: 20000,
      expectNoCollectingAfterWaitingRefresh: true,
      expectNoDuplicateReportKeys: true,
      expectNoDuplicateReportKeysAfterSave: true,
      beforeCapture: async (page) => {
        await page.waitForTimeout(300);
      },
    },
    {
      name: '12-background-download-waits-auto-refresh',
      description: 'cache-expiry auto refresh가 이미 진행 중이면 boot-hidden background download도 waiting-refresh로 합류하는지 확인',
      screenshot: '12-background-download-waits-auto-refresh.png',
      expectNoCollectingAfterWaitingRefresh: true,
      expectNoDuplicateReportKeysAfterSave: true,
      readyDelayMs: 0,
      autoStart: true,
      bootRequest: { action: 'background-download', cleanupDelayMs: 1800 },
      preloadCache: async (page, dataset) => {
        await seedCache(page, dataset, expiredTimestamp);
      },
      beforeLoad: async (page) => {
        await page.addInitScript(() => {
          const originalFetch = window.fetch.bind(window);
          window.fetch = async function (input, init) {
            const url = String(input);
            const isReportRequest =
              url.includes('searchadvisor.naver.com/api-console/report/');
            if (isReportRequest) {
              await new Promise((resolve) => setTimeout(resolve, 250));
            }
            return originalFetch(input, init);
          };
        });
      },
      captureState: 'waiting-refresh',
      captureTimeoutMs: 20000,
      expectNoCollectingAfterWaitingRefresh: true,
      expectNoDuplicateReportKeys: true,
      expectNoDuplicateReportKeysAfterSave: true,
      captureProbe: true,
      beforeCapture: async (page) => {
        await page.waitForTimeout(300);
      },
    },
  ];
  const activeScenarios =
    SCENARIO_FILTER.length > 0
      ? scenarios.filter((scenario) => SCENARIO_FILTER.includes(scenario.name))
      : scenarios;

  const results = [];
  let savedVerification = null;
  try {
    for (const scenario of activeScenarios) {
      console.log(`[direct-save-qa] start ${scenario.name}`);
      const result = await runScenario(browser, scenario, freshDataset);
      console.log(`[direct-save-qa] done ${scenario.name}`);
      results.push(result);
    }
    const savedSource = results.find((item) => item.name === '01-fresh-cache-direct-save-success');
    if (savedSource && savedSource.downloadPath) {
      savedVerification = await runSavedVerification(browser, savedSource.downloadPath);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const lines = [
    '# Direct Save QA Report',
    '',
    `- 실행 시각(UTC): ${new Date().toISOString()}`,
    `- 대상 빌드: dist/runtime.js`,
    `- 브라우저: Chromium (Playwright)`,
    '',
    '## 시나리오 요약',
    '',
    '- 정상 저장',
    '- 캐시 미스 후 자동 갱신 저장',
    '- 일부 요청 실패 후 `completed-with-issues`',
    '- 다운로드 채널 차단 후 `failed`',
    '- headless directSave',
    '- boot-hidden background download',
    '- auto refresh in-flight save reuse (`waiting-refresh`)',
    '',
  ];

  results.forEach((scenarioResult) => renderScenarioSection(lines, scenarioResult));

  if (savedVerification) {
    lines.push(`## ${savedVerification.name}`);
    lines.push('');
    lines.push(`- 설명: ${savedVerification.description}`);
    lines.push(`- 캡처: screenshots/${savedVerification.screenshot}`);
    lines.push(`- runtimeKind: ${savedVerification.result.runtimeKind || '(none)'}`);
    lines.push(`- saveStatus.runtimeType: ${savedVerification.result.saveStatus?.runtimeType || '(none)'}`);
    lines.push(`- hasPublicApi: ${savedVerification.result.hasPublicApi ? 'true' : 'false'}`);
    lines.push(`- hasSnapshotApi: ${savedVerification.result.hasSnapshotApi ? 'true' : 'false'}`);
    if (savedVerification.pageErrors.length) {
      lines.push(`- pageErrors: ${savedVerification.pageErrors.join(' | ')}`);
    }
    lines.push('');
  }

  fs.writeFileSync(REPORT_PATH, lines.join('\n'), 'utf8');
  console.log(JSON.stringify({
    status: 'ok',
    report: REPORT_PATH,
    screenshots: fs.readdirSync(SCREENSHOT_DIR).map((file) => path.join(SCREENSHOT_DIR, file)),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
