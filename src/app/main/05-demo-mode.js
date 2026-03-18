// Demo Mode Module
// ============================================================
// This module provides demo mode functionality for local development
// and testing. It generates mock data for SearchAdvisor APIs when
// running on localhost, local networks, or file:// protocol.
// ============================================================

/**
 * Demo mode detection flag
 * Automatically enabled when running on localhost, local networks, or file:// protocol
 * @type {boolean}
 * @constant
 */
const IS_DEMO_MODE = (function() {
  try {
    const protocol = (location && location.protocol) || "";
    const host = (location && location.hostname) || "";
    // Enable demo mode for localhost, local networks, and file:// protocol
    return protocol === "file:" ||
           host === "localhost" ||
           host === "127.0.0.1" ||
           host.startsWith("192.168.") ||
           host.startsWith("10.") ||
           host.startsWith("172.");
  } catch (e) {
    return false;
  }
})();

if (IS_DEMO_MODE) {
  window.__DEMO_MODE__ = true;
  console.log("%c[SearchAdvisor Demo Mode] Running with dummy data", "color: #40c4ff; font-weight: bold");
}

// Define demo constants (used later, after allSites is declared)
const DEMO_ENC_ID = IS_DEMO_MODE ? "demo_mode_00000000000000000000000000000000000000000000000000000000000000" : null;
const DEMO_SITES = IS_DEMO_MODE ? [
  "https://example-shop.com",
  "https://tech-blog.kr",
  "https://online-store.net",
  "https://company-site.co.kr"
] : [];


// Mock API data for demo mode
if (IS_DEMO_MODE) {
  const DEMO_SITE_DATA = {};
  const now = Date.now();
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 14);

  DEMO_SITES.forEach((site, idx) => {
    const baseClicks = Math.floor(Math.random() * 5000) + 1000;
    const baseExposes = Math.floor(baseClicks * (1.5 + Math.random()));

    // Generate proper date format (YYYYMMDD)
    const logs = Array.from({length: 15}, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
      return {
        date: dateStr,
        clickCount: Math.floor(Math.random() * 400) + 50,
        exposeCount: Math.floor(Math.random() * 800) + 100
      };
    });

    // Calculate totals from logs
    const totalClicks = logs.reduce((sum, log) => sum + log.clickCount, 0);
    const totalExposes = logs.reduce((sum, log) => sum + log.exposeCount, 0);

    DEMO_SITE_DATA[site] = {
      expose: {
        items: [{
          period: {
            start: "20260301",
            end: "20260315",
            prevClickRatio: (Math.random() * 20 - 5).toFixed(1),
            prevExposeRatio: (Math.random() * 15 - 3).toFixed(1)
          },
          logs: logs.map(log => ({
            ...log,
            ctr: log.exposeCount > 0 ? ((log.clickCount / log.exposeCount) * 100).toFixed(2) : "0.00"
          })),
          urls: Array.from({length: 20}, (_, i) => ({
            key: `${site}/page-${i+1}`,
            clickCount: Math.floor(Math.random() * 200) + 10,
            exposeCount: Math.floor(Math.random() * 500) + 50,
            ctr: (Math.random() * 5 + 0.5).toFixed(2)
          })),
          querys: Array.from({length: 15}, (_, i) => ({
            key: `검색어${idx+1}-${i+1}`,
            clickCount: Math.floor(Math.random() * 100) + 5,
            exposeCount: Math.floor(Math.random() * 300) + 20,
            ctr: (Math.random() * 3 + 0.5).toFixed(2)
          }))
        }]
      },
      crawl: {
        items: [{
          stats: logs.map(log => ({
            date: log.date,
            pageCount: Math.floor(Math.random() * 5000) + 1000,
            downloadSize: Math.floor(Math.random() * 50000000) + 10000000,
            sumTryCount: Math.floor(Math.random() * 100) + 50,
            sumErrorCount: Math.random() > 0.8 ? Math.floor(Math.random() * 5) + 1 : 0,
            notFound: Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0,
            serverError: Math.random() > 0.95 ? Math.floor(Math.random() * 2) + 1 : 0,
            connectTimeout: 0
          })),
          sitemaps: [{ url: `${site}/sitemap.xml`, status: "ok", count: 156 }]
        }]
      },
      backlink: {
        items: [{
          total: Math.floor(Math.random() * 1000) + 200,
          domains: Math.floor(Math.random() * 50) + 10,
          countTime: logs.map(log => ({
            timeStamp: log.date,
            backlinkCnt: Math.floor(Math.random() * 200) + 180
          })),
          topDomain: [
            { domain: `backlink-source-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 100) + 50 },
            { domain: `partner-site-${idx+1}.net`, backlinkCnt: Math.floor(Math.random() * 80) + 30 },
            { domain: `news-portal-${idx+1}.kr`, backlinkCnt: Math.floor(Math.random() * 60) + 20 },
            { domain: `blog-platform-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 40) + 10 }
          ]
        }]
      },
      diagnosisMeta: {
        code: 0,  // 0 = success for diagnosis API
        items: [{
          meta: Array.from({length: 15}, (_, i) => {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
            return {
              date: dateStr,
              stateCount: {
                "1": 1000 + idx * 100 + i * 10,
                "2": Math.floor(Math.random() * 50) + 10,
                "3": Math.floor(Math.random() * 30) + 5,
                "4": Math.floor(Math.random() * 20) + 2
              }
            };
          })
        }]
      },
      diagnosisMetaRange: { start: "20260301", end: "20260315" }
    };

  });

  // Override fetch to return demo data
  const originalFetch = window.fetch.bind(window);
  window.fetch = function(url, options) {
    const urlStr = String(url);

    if (urlStr.includes("searchadvisor.naver.com")) {
      console.log("[Demo Mode API]", urlStr);

      return new Promise((resolve) => {
        setTimeout(() => {
          if (urlStr.includes("/api-board/list/")) {
            // Use custom sites if available, otherwise fall back to DEMO_SITES
            const customInitData = window.__sadvInitData;
            const customMergedData = window.__sadvMergedData;
            const customSites = customMergedData?.sites || customInitData?.sites || null;
            const sitesToUse = customSites ? Object.keys(customSites) : DEMO_SITES;

            resolve({
              ok: true,
              json: () => ({ items: sitesToUse.map(s => ({ site: s, verified: true })) }),
              text: () => JSON.stringify({ items: sitesToUse.map(s => ({ site: s, verified: true })) })
            });
            return;
          }

          const siteMatch = urlStr.match(/site=([^&]+)/);
          const customInitData = window.__sadvInitData;
          const customMergedData = window.__sadvMergedData;
          const customSites = customMergedData?.sites || customInitData?.sites || null;
          const customSitesList = customSites ? Object.keys(customSites) : DEMO_SITES;
          const site = siteMatch ? decodeURIComponent(siteMatch[1]) : customSitesList[0];

          // Priority: custom injected data > DEMO_SITE_DATA > memCache
          let siteData = null;
          if (customSites && customSites[site]) {
            siteData = customSites[site];
          } else if (DEMO_SITE_DATA[site]) {
            siteData = DEMO_SITE_DATA[site];
          } else {
            siteData = memCache[site] || {};
          }
          console.log('[Demo Mode] API call - site:', site, 'source:', customSites && customSites[site] ? 'custom' : (DEMO_SITE_DATA[site] ? 'DEMO_SITE_DATA' : 'memCache'));

          if (urlStr.includes("/report/expose/") || urlStr.includes("field=expose")) {
            const exposeData = siteData.expose || { items: [] };
            console.log('[Demo Mode] Returning expose data for', site, 'logs:', exposeData.items?.[0]?.logs?.length || 0);
            resolve({ ok: true, json: () => exposeData, text: () => JSON.stringify(exposeData) });
          } else if (urlStr.includes("/report/crawl/") || urlStr.includes("field=crawl")) {
            const crawlData = siteData.crawl || { items: [] };
            resolve({ ok: true, json: () => crawlData, text: () => JSON.stringify(crawlData) });
          } else if (urlStr.includes("/report/backlink/") || urlStr.includes("field=backlink")) {
            const backlinkData = siteData.backlink || { items: [] };
            resolve({ ok: true, json: () => backlinkData, text: () => JSON.stringify(backlinkData) });
          } else if (urlStr.includes("/diagnosis/meta") || urlStr.includes("field=diagnosisMeta")) {
            const diagnosisData = siteData.diagnosisMeta || { code: 1, items: [] };
            resolve({ ok: true, json: () => diagnosisData, text: () => JSON.stringify(diagnosisData) });
          } else {
            resolve({ ok: true, json: () => ({ items: [] }), text: () => "{}" });
          }
        }, 50);
      });
    }

    return originalFetch(url, options);
  };
}

/**
 * Inject demo mode mock data into the application
 * This function populates memCache with realistic mock data for all demo sites
 * It supports both built-in DEMO_SITES and custom injected data from __sadvInitData
 * @returns {boolean} True if demo data was injected, false otherwise
 * @example
 * // In demo mode, this is called during initialization
 * injectDemoData(); // returns true and populates memCache
 * @see {DEMO_SITES}
 */
function injectDemoData() {
  const protocol = (location && location.protocol) || "";
  const host = (location && location.hostname) || "";
  console.log('[injectDemoData] protocol:', protocol, 'host:', host);
  // Enable demo mode for localhost, local networks, file:// protocol, or forced demo mode
  const isDemoMode = window.__FORCE_DEMO_MODE__ ||
                     protocol === "file:" ||
                     host === "localhost" ||
                     host === "127.0.0.1" ||
                     host.startsWith("192.168.") ||
                     host.startsWith("10.") ||
                     host.startsWith("172.") ||
                     host.includes("local");
  console.log('[injectDemoData] isDemoMode:', isDemoMode);
  if (!isDemoMode) return false;

  console.log('[Demo Mode] Setting up demo sites and data...');

  // Check for custom injected data first (from generate-html-files.js)
  const customInitData = window.__sadvInitData;
  const customMergedData = window.__sadvMergedData;
  const hasCustomData = !!(customInitData || customMergedData);

  if (hasCustomData) {
    console.log('[Demo Mode] Found custom injected data, using it instead of DEMO_SITES');

    // Get sites from custom data
    const customSites = customMergedData?.sites || customInitData?.sites || {};
    const siteUrls = Object.keys(customSites);

    if (siteUrls.length > 0) {
      allSites = siteUrls;
      assignColors();

      // Populate memCache with custom data
      siteUrls.forEach((siteUrl) => {
        const siteData = customSites[siteUrl];
        if (siteData) {
          memCache[siteUrl] = {
            ...siteData,
            __source:
              (siteData._merge && siteData._merge.__source) ||
              siteData.__source ||
              "demo",
            exposeFetchedAt: Date.now(),
            exposeFetchState: 'success',
            crawlFetchedAt: Date.now(),
            crawlFetchState: 'success',
            backlinkFetchedAt: Date.now(),
            backlinkFetchState: 'success',
            diagnosisMetaFetchedAt: Date.now(),
            diagnosisMetaFetchState: 'success',
            diagnosisMetaRange: (siteData.diagnosisMeta && siteData.diagnosisMeta.items && siteData.diagnosisMeta.items.length > 0 && siteData.diagnosisMeta.items[0].meta && siteData.diagnosisMeta.items[0].meta.length > 0) ?
              { start: siteData.diagnosisMeta.items[0].meta[0].date, end: siteData.diagnosisMeta.items[0].meta[siteData.diagnosisMeta.items[0].meta.length - 1].date } :
              { start: "20260301", end: "20260315" },
            detailLoaded: true,
            __cacheSavedAt: Date.now()
          };
          console.log('[Demo Mode] Custom data loaded for', siteUrl);
        }
      });

      // Set up mergedMeta for merged view header
      if (customMergedData) {
        const accountsMerged = customMergedData.accounts_merged || [];
        const sourceCount = accountsMerged.length || 1;

        window.__SEARCHADVISOR_EXPORT_PAYLOAD__ = {
          siteMeta: {},
          mergedMeta: {
            isMerged: true,
            sourceCount: sourceCount,
            accounts: accountsMerged.map((acc, i) => ({
              encId: acc,
              label: acc
            })),
            naverIds: accountsMerged
          },
          mode: 'saved-html'
        };

        // Update snapshotMetaState
        setSnapshotMetaState({
          siteMeta: {},
          mergedMeta: window.__SEARCHADVISOR_EXPORT_PAYLOAD__.mergedMeta
        });

        console.log('[Demo Mode] Merged meta set for', sourceCount, 'accounts');
      }

      console.log('[Demo Mode] Complete: Custom data injected for', allSites.length, 'sites');
      return true;
    }
  }

  // Fall back to DEMO_SITES for consistency
  allSites = DEMO_SITES.slice();
  assignColors();

  // Populate memCache with complete data for each site
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 14);

  allSites.forEach((site, idx) => {
    // Generate logs with proper date format (YYYYMMDD)
    const logs = Array.from({length: 15}, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
      return {
        date: dateStr,
        clickCount: Math.floor(Math.random() * 400) + 50,
        exposeCount: Math.floor(Math.random() * 800) + 100
      };
    });

    const exposeData = {
      items: [{
        period: {
          start: "20260301",
          end: "20260315",
          prevClickRatio: (Math.random() * 20 - 5).toFixed(1),
          prevExposeRatio: (Math.random() * 15 - 3).toFixed(1)
        },
        logs: logs.map(log => ({
          ...log,
          ctr: log.exposeCount > 0 ? ((log.clickCount / log.exposeCount) * 100).toFixed(2) : "0.00"
        })),
        urls: Array.from({length: 20}, (_, i) => ({
          key: `${site}/page-${i+1}`,
          clickCount: Math.floor(Math.random() * 200) + 10,
          exposeCount: Math.floor(Math.random() * 500) + 50,
          ctr: (Math.random() * 5 + 0.5).toFixed(2)
        })),
        querys: Array.from({length: 15}, (_, i) => ({
          key: `검색어${idx+1}-${i+1}`,
          clickCount: Math.floor(Math.random() * 100) + 5,
          exposeCount: Math.floor(Math.random() * 300) + 20,
          ctr: (Math.random() * 3 + 0.5).toFixed(2)
        }))
      }]
    };

    const crawlData = {
      items: [{
        stats: logs.map(log => ({
          date: log.date,
          pageCount: 1000 + Math.floor(Math.random() * 500),
          downloadSize: 50000 + Math.floor(Math.random() * 10000),
          sumTryCount: 200 + Math.floor(Math.random() * 100),
          sumErrorCount: Math.floor(Math.random() * 10),
          notFound: Math.floor(Math.random() * 5),
          serverError: Math.floor(Math.random() * 2),
          connectTimeout: 0,
        })),
        sitemaps: [{ url: `${site}/sitemap.xml`, status: "ok", count: 156 }]
      }]
    };

    const backlinkData = {
      items: [{
        total: Math.floor(Math.random() * 1000) + 200,
        domains: Math.floor(Math.random() * 50) + 10,
        countTime: logs.map(log => ({
          timeStamp: log.date,
          backlinkCnt: Math.floor(Math.random() * 20) + 180
        })),
        topDomain: [
          { domain: `backlink-source-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 100) + 50 },
          { domain: `partner-site-${idx+1}.net`, backlinkCnt: Math.floor(Math.random() * 80) + 30 },
          { domain: `news-portal-${idx+1}.kr`, backlinkCnt: Math.floor(Math.random() * 60) + 20 },
          { domain: `blog-platform-${idx+1}.com`, backlinkCnt: Math.floor(Math.random() * 40) + 10 }
        ]
      }]
    };

    const diagnosisData = {
      code: 0,
      items: [{
        meta: Array.from({length: 15}, (_, i) => {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
          return {
            date: dateStr,
            stateCount: {
              "1": 1000 + idx * 100 + i * 10,
              "2": Math.floor(Math.random() * 50) + 10,
              "3": Math.floor(Math.random() * 30) + 5,
              "4": Math.floor(Math.random() * 20) + 2
            }
          };
        })
      }]
    };

    // Store in memCache with merge metadata
    memCache[site] = {
      // Core data
      expose: exposeData,
      crawl: crawlData,
      backlink: backlinkData,
      diagnosisMeta: diagnosisData,
      // Fetch metadata
      exposeFetchedAt: Date.now(),
      exposeFetchState: 'success',
      crawlFetchedAt: Date.now(),
      crawlFetchState: 'success',
      backlinkFetchedAt: Date.now(),
      backlinkFetchState: 'success',
      diagnosisMetaFetchedAt: Date.now(),
      diagnosisMetaFetchState: 'success',
      diagnosisMetaRange: { start: "20260301", end: "20260315" },
      detailLoaded: true,
      __cacheSavedAt: Date.now(),
      // Merge metadata for multi-account support
      __source: 'demo',
      __fetchedAt: Date.now(),
      __version: 1
    };

    console.log('[Demo Mode] Data injected for', site, '- logs:', logs.length, 'clicks:', logs.reduce((s, l) => s + l.clickCount, 0));
  });

  console.log('[Demo Mode] Complete: All mock data injected for', allSites.length, 'sites');

  // Remove snapshot shell hide CSS in demo mode
  const hideStyle = document.getElementById("sadv-snapshot-shell-hide");
  if (hideStyle) {
    hideStyle.remove();
    console.log('[Demo Mode] Removed snapshot shell hide CSS');
  }

  return true;
}
