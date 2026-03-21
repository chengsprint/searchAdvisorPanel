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

async function waitForPanelReady(page) {
  await page.waitForSelector('#sadv-p', { timeout: 15000, state: 'attached' });
  await page.waitForFunction(() => !!window.__sadvApi && typeof window.__sadvApi.directSave === 'function', null, {
    timeout: 15000,
  });
  await page.waitForTimeout(500);
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

async function startDirectSave(page, options) {
  return page.evaluate((directSaveOptions) => {
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
      status.state === 'failed'
    );
  }, null, { timeout: timeoutMs });
}

async function getScenarioResult(page, downloadTriggered) {
  return page.evaluate((downloadTriggeredValue) => ({
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

  await page.goto(`${HOST}/__runner__.html`, { waitUntil: 'domcontentloaded' });
  if (scenario.preloadCache) {
    await scenario.preloadCache(page, dataset);
  }

  await page.addScriptTag({ url: `${HOST}/runtime.js?ts=${Date.now()}` });
  await waitForPanelReady(page);
  await installStatusProbe(page);

  if (scenario.beforeStart) {
    await scenario.beforeStart(page, dataset);
  }

  if (!scenario.autoStart) {
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
  await page.close();
  await context.close();
  return {
    name: scenario.name,
    description: scenario.description,
    screenshot: scenario.screenshot,
    downloadPath,
    result,
    consoleMessages,
    pageErrors,
  };
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
      description: '일부 expose 요청을 강제로 차단했을 때 completed-with-issues와 실패 요약 UI가 보이는지 확인',
      screenshot: '03-partial-issue-direct-save.png',
      beforeStart: async (page) => {
        await page.evaluate((failSite) => {
          const originalFetch = window.fetch.bind(window);
          window.fetch = function (input, init) {
            const url = String(input);
            if (
              url.includes('searchadvisor.naver.com') &&
              (url.includes('/report/expose/') || url.includes('field=expose')) &&
              url.includes(encodeURIComponent(failSite))
            ) {
              return Promise.reject(new Error('Injected network block for directSave QA'));
            }
            return originalFetch(input, init);
          };
        }, DEMO_SITES[1]);
      },
      captureState: 'completed-with-issues',
      captureTimeoutMs: 40000,
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
  ];

  const results = [];
  let savedVerification = null;
  try {
    for (const scenario of scenarios) {
      const result = await runScenario(browser, scenario, freshDataset);
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
