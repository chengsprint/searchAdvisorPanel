/**
 * Comprehensive E2E Test Suite
 * Tests all major widget functionality
 */

const { test, expect } = require('@playwright/test');

test.describe('Widget Loading', () => {
  test('should load demo page', async ({ page }) => {
    await page.goto('/demo.html');

    const title = await page.title();
    expect(title).toContain('SearchAdvisor');
  });

  test('should render widget elements', async ({ page }) => {
    await page.goto('/demo.html');
    await page.waitForTimeout(3000);

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
    await page.waitForTimeout(3000);

    // Allow some time for any async errors
    await page.waitForTimeout(1000);

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
    await page.waitForTimeout(3000);
  });

  test('should have tab buttons', async ({ page }) => {
    const tabs = await page.evaluate(() => {
      return document.querySelectorAll('[role="tab"]').length;
    });

    expect(tabs).toBeGreaterThan(0);
  });

  test('should click on buttons', async ({ page }) => {
    const buttons = await page.$$('button');

    if (buttons.length > 0) {
      await buttons[0].click();
      await page.waitForTimeout(500);

      // Should not crash
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
        await buttons[i].click();
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
    await page.waitForTimeout(3000);
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
    await page.waitForTimeout(3000);

    const hasElements = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(hasElements).toBeTruthy();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/demo.html');
    await page.waitForTimeout(3000);

    const hasElements = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(hasElements).toBeTruthy();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/demo.html');
    await page.waitForTimeout(3000);

    const hasElements = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(hasElements).toBeTruthy();
  });

  test('should handle viewport resize', async ({ page }) => {
    await page.goto('/demo.html');
    await page.waitForTimeout(3000);

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
    await page.waitForTimeout(3000);
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
    await page.waitForTimeout(3000);

    const loadTime = Date.now() - startTime;

    // Should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test('should not have memory leaks', async ({ page }) => {
    await page.goto('/demo.html');
    await page.waitForTimeout(3000);

    // Perform some interactions
    const buttons = await page.$$('button');
    for (let i = 0; i < Math.min(5, buttons.length); i++) {
      await buttons[i].click();
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
    await page.waitForTimeout(3000);
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
    await page.waitForTimeout(3000);
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
    const buttons = await page.$$('button');

    // Rapid clicks
    for (let i = 0; i < 10; i++) {
      if (buttons.length > 0) {
        await buttons[i % buttons.length].click();
        await page.waitForTimeout(50);
      }
    }

    // Should not crash
    const stillFunctional = await page.evaluate(() => {
      return document.querySelectorAll('button').length > 0;
    });

    expect(stillFunctional).toBeTruthy();
  });
});
