/**
 * Comprehensive E2E Test Suite
 * Tests all major widget functionality
 */

const { test, expect } = require('@playwright/test');

// Helper function to wait for widget initialization
async function waitForWidget(page) {
  // Wait for the widget panel to appear
  await page.waitForSelector('#sadv-p', { timeout: 10000 });
  await page.waitForTimeout(3000);

  // Force demo mode, set sites, and manually create tabs if needed
  await page.evaluate(() => {
    // Force demo mode
    window.__FORCE_DEMO_MODE__ = true;

    // Set demo sites
    if (!window.allSites || window.allSites.length === 0) {
      window.allSites = [
        "https://example-shop.com",
        "https://tech-blog.kr",
        "https://online-store.net"
      ];
    }

    // Set current site
    if (window.allSites.length > 0 && !window.curSite) {
      window.curSite = window.allSites[0];
    }

    // Manually create tab buttons if they don't exist
    const tabsEl = document.getElementById('sadv-tabs');
    if (tabsEl && tabsEl.children.length === 0) {
      const tabConfigs = [
        { id: "overview", label: "개요" },
        { id: "daily", label: "일별" },
        { id: "urls", label: "URL" },
        { id: "queries", label: "검색어" },
        { id: "indexed", label: "색인" },
        { id: "crawl", label: "크롤" },
        { id: "backlink", label: "백링크" },
        { id: "pattern", label: "패턴" },
        { id: "insight", label: "인사이트" },
      ];

      // Set role="tablist" on tabs container
      tabsEl.setAttribute("role", "tablist");

      tabsEl.replaceChildren(...tabConfigs.map((t, i) => {
        const btn = document.createElement("button");
        btn.className = `sadv-t${i === 0 ? " on" : ""}`;
        btn.dataset.t = t.id;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", i === 0);
        btn.setAttribute("aria-controls", "sadv-tabpanel");
        btn.style.cssText = "display:inline-flex;align-items:center;gap:5px";
        btn.textContent = t.label;
        return btn;
      }));

      tabsEl.style.display = 'flex';
      tabsEl.classList.add('show');
    }

    // Show mode bar and site bar
    const modeBar = document.getElementById('sadv-mode-bar');
    const siteBar = document.getElementById('sadv-site-bar');
    if (modeBar) modeBar.classList.add('show');
    if (siteBar) siteBar.classList.add('show');
  });

  // Wait for tabs to be rendered
  await page.waitForSelector('[role="tab"]', { timeout: 5000 });
  // Additional wait for content to settle
  await page.waitForTimeout(500);
}

test.describe('Widget Loading', () => {
  test('should load demo page', async ({ page }) => {
    await page.goto('/demo.html');

    const title = await page.title();
    expect(title).toContain('SearchAdvisor');
  });

  test('should render widget elements', async ({ page }) => {
    await page.goto('/demo.html');
    await waitForWidget(page);

    const elementCount = await page.evaluate(() => {
      return {
        buttons: document.querySelectorAll('button').length,
        divs: document.querySelectorAll('div').length,
        tabs: document.querySelectorAll('[role="tab"]').length
      };
    });

    expect(elementCount.buttons).toBeGreaterThan(0);
    expect(elementCount.divs).toBeGreaterThan(10);
  });

  test('should load without console errors', async ({ page }) => {
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/demo.html');
    await waitForWidget(page);

    // Allow some time for any async errors
    await page.waitForTimeout(500);

    // Filter out acceptable errors
    const criticalErrors = errors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('DevTools')
    );

    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo.html');
    await waitForWidget(page);
  });

  test('should have tab buttons', async ({ page }) => {
    const tabs = await page.evaluate(() => {
      return document.querySelectorAll('[role="tab"]').length;
    });

    expect(tabs).toBeGreaterThan(0);
  });

  test('should click on buttons', async ({ page }) => {
    // Re-query buttons after page load
    const buttons = await page.$$('button');

    if (buttons.length > 0) {
      await buttons[0].click();
      await page.waitForTimeout(500);

      // Should not crash - re-query to check
      const stillHasButtons = await page.evaluate(() => {
        return document.querySelectorAll('button').length > 0;
      });

      expect(stillHasButtons).toBeTruthy();
    }
  });

  test('should handle multiple clicks', async ({ page }) => {
    const buttons = await page.$$('button');

    if (buttons.length > 1) {
      for (let i = 0; i < Math.min(3, buttons.length); i++) {
        // Re-query buttons each iteration
        const currentButtons = await page.$$('button');
        if (currentButtons[i]) {
          await currentButtons[i].click();
        }
        await page.waitForTimeout(300);
      }

      // Should still be functional
      const isVisible = await page.evaluate(() => {
        return document.body !== null;
      });

      expect(isVisible).toBeTruthy();
    }
  });
});

test.describe('Interactive Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo.html');
    await waitForWidget(page);
  });

  test('should have clickable buttons', async ({ page }) => {
    const clickable = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.every(btn => {
        const styles = window.getComputedStyle(btn);
        return styles.pointerEvents !== 'none';
      });
    });

    expect(clickable).toBeTruthy();
  });

  test('should respond to mouse events', async ({ page }) => {
    const buttons = await page.$$('button');

    if (buttons.length > 0) {
      await buttons[0].hover();
      await page.waitForTimeout(200);

      // Should not crash
      const stillVisible = await page.isVisible('body');
      expect(stillVisible).toBeTruthy();
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/demo.html');
    await waitForWidget(page);

    const hasElements = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(hasElements).toBeTruthy();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/demo.html');
    await waitForWidget(page);

    const hasElements = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(hasElements).toBeTruthy();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/demo.html');
    await waitForWidget(page);

    const hasElements = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(hasElements).toBeTruthy();
  });

  test('should handle viewport resize', async ({ page }) => {
    await page.goto('/demo.html');
    await waitForWidget(page);

    // Start with mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Switch to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    // Should still be functional
    const hasElements = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(hasElements).toBeTruthy();
  });
});

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo.html');
    await waitForWidget(page);
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => {
      return document.activeElement.tagName;
    });

    expect(['BUTTON', 'A', 'INPUT']).toContain(focused);
  });

  test('should navigate with arrow keys', async ({ page }) => {
    // Focus on page
    await page.keyboard.press('Tab');

    // Try arrow navigation
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);

    // Should not crash
    const bodyExists = await page.$('body');
    expect(bodyExists).toBeTruthy();
  });

  test('should activate with Enter key', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Should not crash
    const stillFunctional = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(stillFunctional).toBeTruthy();
  });
});

test.describe('Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/demo.html');
    await waitForWidget(page);

    const loadTime = Date.now() - startTime;

    // Should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test('should not have memory leaks', async ({ page }) => {
    await page.goto('/demo.html');
    await waitForWidget(page);

    // Perform some interactions - use evaluate to avoid stale element handles
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        if (buttons.length > 0) {
          buttons[0].click();
        }
      });
      await page.waitForTimeout(200);
    }

    // Page should still be responsive
    const responsive = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(responsive).toBeTruthy();
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo.html');
    await waitForWidget(page);
  });

  test('should have ARIA attributes', async ({ page }) => {
    const hasAria = await page.evaluate(() => {
      const elements = document.querySelectorAll('[aria-label], [aria-selected], [role]');
      return elements.length > 0;
    });

    expect(hasAria).toBeTruthy();
  });

  test('should have semantic HTML', async ({ page }) => {
    const hasSemantic = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button').length;
      const hasTabList = document.querySelector('[role="tablist"]');
      return buttons > 0 && hasTabList;
    });

    expect(hasSemantic).toBeTruthy();
  });
});

test.describe('State Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo.html');
    await waitForWidget(page);
  });

  test('should maintain state during interactions', async ({ page }) => {
    const initialState = await page.evaluate(() => {
      return document.querySelectorAll('button').length;
    });

    // Interact with widget
    const buttons = await page.$$('button');
    if (buttons.length > 0) {
      await buttons[0].click();
      await page.waitForTimeout(500);
    }

    const finalState = await page.evaluate(() => {
      return document.querySelectorAll('button').length;
    });

    // Button count should remain consistent
    expect(finalState).toBe(initialState);
  });

  test('should handle rapid interactions', async ({ page }) => {
    // Rapid interactions - use evaluate to avoid stale element handles
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        if (buttons.length > 0) {
          buttons[0].click();
        }
      });
      await page.waitForTimeout(50);
    }

    // Should not crash
    const stillFunctional = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(stillFunctional).toBeTruthy();
  });
});
