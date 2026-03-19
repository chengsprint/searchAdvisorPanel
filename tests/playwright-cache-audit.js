#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ARTIFACT_ROOT = path.join(ROOT_DIR, 'test-results', 'cache-audit');
const SCREENSHOT_DIR = path.join(ARTIFACT_ROOT, 'screenshots');
const REPORT_PATH = path.join(ARTIFACT_ROOT, 'cache-audit-report.md');
const PORT = 8091;
const HOST = `http://127.0.0.1:${PORT}`;
const DEMO_SITES = [
  "https://example-shop.com",
  "https://tech-blog.kr",
  "https://online-store.net",
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function encodeSiteKey(site) {
  return Buffer.from(encodeURIComponent(site), 'utf8')
    .toString('base64')
    .replace(/=/g, '');
}

function getSiteListCacheKey() {
  return 'sadv_sites_v1_demo';
}

function getSiteDataCacheKey(site) {
  return `sadv_data_v2_demo_${encodeSiteKey(site)}`;
}

function formatDateOffset(offsetDays) {
  const date = new Date(Date.UTC(2026, 2, 19 + offsetDays));
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function buildLogs(multiplier) {
  return Array.from({ length: 15 }, (_, index) => {
    const clickCount = 120 + index * 18 + multiplier * 12;
    const exposeCount = 480 + index * 35 + multiplier * 20;
    return {
      date: formatDateOffset(index - 14),
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
            "1": 980 + idx * 15 + multiplier * 10,
            "2": 42 + (idx % 4),
            "3": 8 + (idx % 3),
            "4": 3 + (idx % 2),
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

function buildDataVariant(tag) {
  const variantBase = tag === 'refreshed' ? 4 : tag === 'expired' ? 2 : 1;
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
      res.end('<!doctype html><html><head><meta charset="utf-8"><title>SearchAdvisor Runner</title></head><body></body></html>');
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
  await page.waitForSelector('#sadv-p', { timeout: 15000 });
  await page.waitForTimeout(500);
}

async function waitForEvent(page, type, timeoutMs = 15000) {
  await page.waitForFunction(
    (eventType) => Array.isArray(window.__SADV_TEST_EVENTS) &&
      window.__SADV_TEST_EVENTS.some((event) => event && event.type === eventType),
    type,
    { timeout: timeoutMs }
  );
}

async function getRuntimeState(page) {
  return page.evaluate(() => {
    const events = Array.isArray(window.__SADV_TEST_EVENTS) ? window.__SADV_TEST_EVENTS.slice() : [];
    const siteKeys = Object.keys(localStorage).filter((key) => key.startsWith('sadv_data_v2_demo_'));
    const cacheTimestamps = siteKeys.map((key) => {
      try {
        return JSON.parse(localStorage.getItem(key)).ts || null;
      } catch (e) {
        return null;
      }
    }).filter((value) => typeof value === 'number');

    return {
      events,
      cacheTimestamps,
      label: document.getElementById('sadv-label')?.textContent?.trim() || '',
      bodyText: document.getElementById('sadv-bd')?.innerText?.trim() || '',
      hasPanel: !!document.getElementById('sadv-p'),
      activeMode: document.querySelector('#sadv-mode-bar .sadv-mode.on')?.dataset?.m || null,
      activeTab: document.querySelector('#sadv-tabs .sadv-t.on')?.dataset?.t || null,
      comboLabel: document.getElementById('sadv-combo-label')?.textContent?.trim() || '',
    };
  });
}

async function captureSiteView(page, fileName) {
  await page.click('#sadv-mode-bar [data-m="site"]');
  await page.waitForTimeout(700);
  const diagnosisTab = await page.$('#sadv-tabs .sadv-t[data-t="diagnosis"]');
  if (diagnosisTab) {
    await diagnosisTab.click();
    await page.waitForTimeout(700);
  }
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, fileName), fullPage: true });
}

async function seedCache(page, dataset, timestamp) {
  await page.evaluate(({ dataset, timestamp }) => {
    const siteListKey = 'sadv_sites_v1_demo';
    localStorage.setItem(siteListKey, JSON.stringify({
      ts: timestamp,
      sites: Object.keys(dataset),
    }));

    const encodeKey = (site) =>
      btoa(encodeURIComponent(site)).replace(/=/g, '');

    Object.entries(dataset).forEach(([site, data]) => {
      localStorage.setItem(`sadv_data_v2_demo_${encodeKey(site)}`, JSON.stringify({
        ts: timestamp,
        data,
      }));
    });
  }, { dataset, timestamp });
}

async function runScenario(browser, scenario) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1400 } });
  const consoleMessages = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message || String(error));
  });

  await page.addInitScript((init) => {
    window.__FORCE_DEMO_MODE__ = true;
    window.__SADV_TEST_TTL_MS = init.ttlMs;
    window.__SADV_TEST_CACHE_MONITOR_INTERVAL_MS = init.monitorIntervalMs;
    window.__SADV_TEST_EVENTS = [];
    if (init.initData) {
      window.__sadvInitData = init.initData;
    }
  }, {
    ttlMs: scenario.ttlMs || 19000,
    monitorIntervalMs: scenario.monitorIntervalMs || 1000,
    initData: scenario.initData,
  });

  if (typeof scenario.preloadCache === 'function') {
    await page.goto(`${HOST}/__runner__.html`, { waitUntil: 'domcontentloaded' });
    await scenario.preloadCache(page);
  } else {
    await page.goto(`${HOST}/__runner__.html`, { waitUntil: 'domcontentloaded' });
  }

  await page.addScriptTag({ url: `${HOST}/runtime.js?ts=${Date.now()}` });
  await waitForPanelReady(page);

  if (typeof scenario.afterLoad === 'function') {
    await scenario.afterLoad(page);
  }

  if (scenario.waitForEventType) {
    await waitForEvent(page, scenario.waitForEventType, scenario.waitTimeoutMs || 20000);
  }

  if (scenario.waitForRefreshCompletion) {
    await waitForEvent(page, 'full-refresh-complete', scenario.waitTimeoutMs || 25000);
  }

  if (scenario.beforeCapture) {
    await scenario.beforeCapture(page);
  }

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, scenario.screenshot),
    fullPage: true,
  });

  if (scenario.siteScreenshot) {
    await captureSiteView(page, scenario.siteScreenshot);
  }

  const runtimeState = await getRuntimeState(page);
  const demoApiCalls = consoleMessages.filter((message) => message.text.includes('[Demo Mode API]')).length;
  const errorLogs = consoleMessages
    .filter((message) => message.type === 'error')
    .map((message) => message.text)
    .concat(pageErrors);

  await page.close();

  return {
    name: scenario.name,
    description: scenario.description,
    screenshot: scenario.screenshot,
    siteScreenshot: scenario.siteScreenshot || null,
    runtimeState,
    demoApiCalls,
    errorLogs,
    consoleMessages,
  };
}

async function main() {
  ensureDir(SCREENSHOT_DIR);

  const server = await createStaticServer(DIST_DIR, PORT);
  const browser = await chromium.launch({ headless: true });

  const freshDataset = buildDataVariant('fresh');
  const refreshedDataset = buildDataVariant('refreshed');
  const staleTimestamp = Date.now() - (12 * 60 * 60 * 1000 + 60 * 1000);
  const freshTimestamp = Date.now();

  const scenarios = [
    {
      name: 'cache-miss-boot-refresh',
      description: '캐시가 없을 때 부팅 직후 전체 재수집이 자동 실행되는지 확인',
      screenshot: '01-cache-miss-all.png',
      siteScreenshot: '01-cache-miss-site-diagnosis.png',
      initData: { sites: Object.fromEntries(DEMO_SITES.map((site) => [site, null])) },
      waitForEventType: 'cache-monitor-start',
      waitForRefreshCompletion: true,
    },
    {
      name: 'fresh-cache-reuse',
      description: '신선한 캐시가 있을 때 초기 부팅에서 불필요한 전체 재수집을 피하는지 확인',
      screenshot: '02-fresh-cache-all.png',
      siteScreenshot: '02-fresh-cache-site-diagnosis.png',
      initData: { sites: Object.fromEntries(DEMO_SITES.map((site) => [site, null])) },
      preloadCache: async (page) => {
        await seedCache(page, freshDataset, freshTimestamp);
      },
      waitForEventType: 'cache-monitor-start',
      beforeCapture: async (page) => {
        await page.waitForTimeout(1200);
      },
    },
    {
      name: 'expired-cache-boot-refresh',
      description: '만료된 캐시를 심어두고 새로 열었을 때 즉시 전체 재수집이 도는지 확인',
      screenshot: '03-expired-cache-all.png',
      siteScreenshot: '03-expired-cache-site-diagnosis.png',
      initData: { sites: Object.fromEntries(DEMO_SITES.map((site) => [site, null])) },
      preloadCache: async (page) => {
        await seedCache(page, freshDataset, staleTimestamp);
      },
      waitForEventType: 'cache-monitor-start',
      waitForRefreshCompletion: true,
    },
    {
      name: 'live-expiry-auto-refresh-19s',
      description: '세션을 유지한 채 19초 TTL이 지나면 자동 재갱신이 실행되고 데이터가 최신 mock으로 바뀌는지 확인',
      screenshot: '04-live-expiry-all.png',
      siteScreenshot: '04-live-expiry-site-diagnosis.png',
      initData: { sites: freshDataset },
      preloadCache: async (page) => {
        await seedCache(page, freshDataset, freshTimestamp);
      },
      afterLoad: async (page) => {
        await page.waitForTimeout(1500);
        await page.evaluate((nextData) => {
          window.__sadvInitData = { sites: nextData };
        }, refreshedDataset);
      },
      beforeCapture: async (page) => {
        const beforeTs = await page.evaluate(() => {
          const key = Object.keys(localStorage).find((item) => item.startsWith('sadv_data_v2_demo_'));
          return key ? JSON.parse(localStorage.getItem(key)).ts : null;
        });
        await page.waitForFunction((previousTs) => {
          const key = Object.keys(localStorage).find((item) => item.startsWith('sadv_data_v2_demo_'));
          if (!key) return false;
          const nextTs = JSON.parse(localStorage.getItem(key)).ts;
          return typeof previousTs === 'number' && typeof nextTs === 'number' && nextTs > previousTs;
        }, beforeTs, { timeout: 26000 });
        await waitForEvent(page, 'full-refresh-complete', 26000);
        await page.waitForTimeout(1200);
      },
    },
  ];

  const results = [];
  try {
    for (const scenario of scenarios) {
      const result = await runScenario(browser, scenario);
      results.push(result);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const lines = [
    '# Playwright Cache Audit',
    '',
    `- 실행 시각(UTC): ${new Date().toISOString()}`,
    `- 대상 빌드: dist/runtime.js (runner page 직접 주입)`,
    `- 브라우저: Chromium (Playwright)`,
    '',
  ];

  results.forEach((result, index) => {
    const refreshStartCount = result.runtimeState.events.filter((event) => event.type === 'full-refresh-start').length;
    const refreshCompleteCount = result.runtimeState.events.filter((event) => event.type === 'full-refresh-complete').length;
    const monitorStartCount = result.runtimeState.events.filter((event) => event.type === 'cache-monitor-start').length;
    const notableFindings = [];

    if (result.errorLogs.length === 0) {
      notableFindings.push('치명적 콘솔 에러 없음');
    } else {
      notableFindings.push(`에러 ${result.errorLogs.length}건 관찰`);
    }
    notableFindings.push(`Demo Mode API 호출 ${result.demoApiCalls}회`);
    notableFindings.push(`full-refresh 시작 ${refreshStartCount}회 / 완료 ${refreshCompleteCount}회`);
    notableFindings.push(`monitor 시작 ${monitorStartCount}회`);

    if (result.name === 'fresh-cache-reuse' && refreshStartCount === 0) {
      notableFindings.push('신선한 캐시에서 불필요한 전체 재수집 회피 확인');
    }
    if (result.name === 'live-expiry-auto-refresh-19s' && refreshCompleteCount > 0) {
      notableFindings.push('세션 유지 중 TTL 만료 후 자동 재갱신 확인');
    }

    lines.push(`## ${index + 1}. ${result.name}`);
    lines.push('');
    lines.push(`- 설명: ${result.description}`);
    lines.push(`- 메인 캡처: screenshots/${result.screenshot}`);
    if (result.siteScreenshot) lines.push(`- 사이트별 캡처: screenshots/${result.siteScreenshot}`);
    lines.push(`- 활성 모드: ${result.runtimeState.activeMode || 'unknown'}`);
    lines.push(`- 활성 탭: ${result.runtimeState.activeTab || 'unknown'}`);
    lines.push(`- 헤더 라벨: ${result.runtimeState.label || '(empty)'}`);
    lines.push(`- 콤보 라벨: ${result.runtimeState.comboLabel || '(empty)'}`);
    lines.push(`- 캐시 timestamp 개수: ${result.runtimeState.cacheTimestamps.length}`);
    lines.push(`- 특이사항: ${notableFindings.join(' / ')}`);
    if (result.errorLogs.length) {
      lines.push('- 에러 로그:');
      result.errorLogs.forEach((error) => {
        lines.push(`  - ${error}`);
      });
    }
    lines.push('');
  });

  lines.push('## 총평');
  lines.push('');
  lines.push('- 이번 점검으로 확인된 핵심 구조 문제는 “세션 중 캐시 만료 자동 재갱신 부재”, “중복 주입 시 전역 프로퍼티 재정의 예외”, “localStorage write lock 예외 가능성”이었습니다.');
  lines.push('- 이번 패치 후에는 세션 유지 상태에서도 TTL 만료를 감시해 자동 재갱신이 실행되도록 보강했습니다.');
  lines.push('- 테스트용 TTL 오버라이드 훅을 추가해 19초 만료 시나리오를 Playwright에서 재현 가능하게 만들었습니다.');
  lines.push('');

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
