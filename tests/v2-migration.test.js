const { test, expect } = require('@playwright/test');

// V2 마이그레이션 검증 테스트
test.describe('V2 JSON Schema Migration', () => {
  test.beforeEach(async ({ page }) => {
    // 콘솔 오류 수집
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console Error:', msg.text());
      }
    });
  });

  test.describe('단일 계정 테스트', () => {
    test('전체 현황 페이지 로드 (mode=all)', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(2000); // 초기화 대기

      // 패널이 렌더링되는지 확인
      const panel = page.locator('#sadv-react-shell-root').or(page.locator('.sadvx-shell'));
      await expect(panel.first()).toBeVisible({ timeout: 5000 });

      // 사이트가 로드되는지 확인
      const sites = await page.evaluate(() => {
        return window.allSites || [];
      });
      expect(sites.length).toBeGreaterThan(0);
      expect(sites).toContain('https://site1-example.com');
      expect(sites).toContain('https://site2-example.com');
    });

    test('개별 사이트 페이지 로드 (mode=site)', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(2000);

      // 첫 번째 사이트 선택
      const siteButton = page.locator('text=site1-example.com').or(page.locator('[data-site="https://site1-example.com"]'));
      if (await siteButton.count() > 0) {
        await siteButton.first().click();
        await page.waitForTimeout(1000);
      }

      // 사이트 데이터가 로드되는지 확인
      const hasSiteData = await page.evaluate(() => {
        const site = 'https://site1-example.com';
        return window.memCache && window.memCache[site] && window.memCache[site].detailLoaded;
      });
      expect(hasSiteData).toBe(true);
    });

    test('모든 하위 탭 렌더링 확인', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(3000);

      const tabs = ['overview', 'daily', 'queries', 'pages', 'crawl', 'backlink', 'diagnosis', 'insight'];

      for (const tab of tabs) {
        // 탭 클릭 시도
        const tabSelector = `[data-tab="${tab}"], .${tab}-tab, text=${tab}`;
        const tabElement = page.locator(tabSelector).first();

        if (await tabElement.count() > 0) {
          await tabElement.click();
          await page.waitForTimeout(500);

          // 콘솔 오류 확인
          const hasErrors = await page.evaluate(() => {
            return window.__v2Errors || false;
          });
          expect(hasErrors).toBe(false);
        }
      }
    });
  });

  test.describe('복합 계정 (Merge) 테스트', () => {
    test('전체 현황 페이지 로드 (merged accounts)', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-merged.html');
      await page.waitForTimeout(2000);

      // 패널이 렌더링되는지 확인
      const panel = page.locator('#sadv-react-shell-root').or(page.locator('.sadvx-shell'));
      await expect(panel.first()).toBeVisible({ timeout: 5000 });

      // 병합 메타데이터 확인
      const mergedMeta = await page.evaluate(() => {
        return window.__SEARCHADVISOR_EXPORT_PAYLOAD__?.mergedMeta;
      });
      expect(mergedMeta).toBeDefined();
      expect(mergedMeta.isMerged).toBe(true);
      expect(mergedMeta.sourceCount).toBe(2);
    });

    test('중복 사이트 처리 확인', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-merged.html');
      await page.waitForTimeout(2000);

      // 사이트 목록 확인
      const sites = await page.evaluate(() => {
        return window.allSites || [];
      });

      // 중복 사이트가 제대로 처리되는지 확인
      expect(sites.length).toBeGreaterThan(0);
      expect(sites).toContain('https://shared-site.com');
    });
  });

  test.describe('데이터 로드 검증', () => {
    test('V2 페이로드 파싱', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(2000);

      // V2 데이터가 로드되는지 확인
      const v2DataLoaded = await page.evaluate(() => {
        const site = 'https://site1-example.com';
        const data = window.memCache?.[site];
        return data && data.__meta && data.__meta.__schema === '1.0';
      });
      expect(v2DataLoaded).toBe(true);
    });

    test('사이트 메타데이터 표시', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(2000);

      // 사이트 메타데이터 확인
      const siteMeta = await page.evaluate(() => {
        const site = 'https://site1-example.com';
        const data = window.memCache?.[site];
        return data ? {
          hasExpose: !!data.expose,
          hasCrawl: !!data.crawl,
          hasBacklink: !!data.backlink,
          hasDiagnosis: !!data.diagnosisMeta,
          detailLoaded: data.detailLoaded
        } : null;
      });
      expect(siteMeta).toBeDefined();
      expect(siteMeta.hasExpose).toBe(true);
      expect(siteMeta.hasCrawl).toBe(true);
      expect(siteMeta.hasBacklink).toBe(true);
      expect(siteMeta.hasDiagnosis).toBe(true);
      expect(siteMeta.detailLoaded).toBe(true);
    });

    test('요약 데이터 (summaryRows) 렌더링', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(3000);

      // 요약 카드가 렌더링되는지 확인
      const summaryCards = page.locator('[class*="card"], [class*="summary"]').filter({ hasText: /(클릭|노출|CTR)/ });
      expect(await summaryCards.count()).toBeGreaterThan(0);
    });

    test('UI 상태 적용 (curMode, curSite, curTab)', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(2000);

      // 초기 UI 상태 확인
      const uiState = await page.evaluate(() => {
        return {
          curMode: window.curMode,
          curSite: window.curSite,
          curTab: window.curTab
        };
      });
      expect(uiState.curMode).toBeDefined();
      expect(uiState.curTab).toBeDefined();
    });
  });

  test.describe('잠재적 문제점 확인', () => {
    test('콘솔 오류 확인', async ({ page }) => {
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(3000);

      // 치명적인 오류만 확인 (React warning 등은 무시)
      const criticalErrors = errors.filter(e =>
        e.includes('TypeError') ||
        e.includes('ReferenceError') ||
        e.includes('undefined is not')
      );
      expect(criticalErrors.length).toBe(0);
    });

    test('데이터 누락 확인', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(2000);

      // 모든 필수 데이터가 있는지 확인
      const dataComplete = await page.evaluate(() => {
        const site = 'https://site1-example.com';
        const data = window.memCache?.[site];
        if (!data) return false;

        return !!(
          data.expose?.items?.[0]?.logs &&
          data.crawl?.items?.[0]?.stats &&
          data.backlink?.items?.[0]?.total &&
          data.diagnosisMeta?.items?.[0]?.meta
        );
      });
      expect(dataComplete).toBe(true);
    });

    test('렌더링 문제 확인', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(3000);

      // 주요 컴포넌트가 렌더링되는지 확인
      const components = {
        panel: page.locator('#sadv-react-shell-root, .sadvx-shell'),
        tabs: page.locator('[role="tab"]'),
        content: page.locator('#sadv-p, .sadvx-content')
      };

      for (const [name, locator] of Object.entries(components)) {
        const count = await locator.count();
        expect(count, `${name} component should be rendered`).toBeGreaterThan(0);
      }
    });

    test('V2 ↔ Legacy 변환 오류 확인', async ({ page }) => {
      await page.goto('file:///home/seung/.cokacdir/workspace/yif7zotu/dist/test-single.html');
      await page.waitForTimeout(2000);

      // 변환 관련 오류 확인
      const conversionErrors = await page.evaluate(() => {
        return window.__v2ConversionErrors || [];
      });
      expect(conversionErrors.length).toBe(0);
    });
  });
});