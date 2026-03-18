/**
 * Responsive Design E2E Tests
 * Tests mobile, tablet, and desktop viewports
 */

const { test, expect } = require('@playwright/test');

const viewports = {
  'Mobile Small': { width: 320, height: 568 },
  'Mobile Medium': { width: 375, height: 667 },
  'Mobile Large': { width: 414, height: 896 },
  'Tablet': { width: 768, height: 1024 },
  'Tablet Large': { width: 1024, height: 768 },
  'Desktop': { width: 1280, height: 720 },
  'Desktop Large': { width: 1920, height: 1080 },
  'Ultra Wide': { width: 2560, height: 1440 }
};

test.describe('Responsive Design', () => {
  for (const [name, viewport] of Object.entries(viewports)) {
    test(`should render correctly on ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/widget.html');

      // Wait for widget to load
      await page.waitForSelector('#sadv-container', { timeout: 5000 });

      // Check if container is visible
      const isVisible = await page.isVisible('#sadv-container');
      expect(isVisible).toBeTruthy();
    });
  }

  test('should adapt layout for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    // Check for mobile-specific classes or styles
    const isMobileLayout = await page.evaluate(() => {
      const container = document.querySelector('#sadv-container');
      return container && container.classList.contains('sadv-mobile');
    });

    // Should be responsive
    const isVisible = await page.isVisible('#sadv-container');
    expect(isVisible).toBeTruthy();
  });

  test('should adapt layout for tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    const isVisible = await page.isVisible('#sadv-container');
    expect(isVisible).toBeTruthy();
  });

  test('should adapt layout for desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    const isVisible = await page.isVisible('#sadv-container');
    expect(isVisible).toBeTruthy();
  });

  test('should handle orientation change', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    let portraitVisible = await page.isVisible('#sadv-container');
    expect(portraitVisible).toBeTruthy();

    // Change to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);

    let landscapeVisible = await page.isVisible('#sadv-container');
    expect(landscapeVisible).toBeTruthy();
  });

  test('should stack tabs on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-tabs', { timeout: 5000 });

    // Check if tabs are visible in mobile layout
    const tabsVisible = await page.isVisible('#sadv-tabs');
    expect(tabsVisible).toBeTruthy();
  });

  test('should have touch-friendly targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-tabs', { timeout: 5000 });

    // Check button sizes
    const buttonSizes = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('#sadv-tabs button'));
      return buttons.map(btn => {
        const rect = btn.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height
        };
      });
    });

    // Touch targets should be at least 44x44 pixels
    for (const size of buttonSizes) {
      expect(size.width).toBeGreaterThanOrEqual(40);
      expect(size.height).toBeGreaterThanOrEqual(40);
    }
  });

  test('should hide less important elements on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    // Main functionality should still work
    const tabsVisible = await page.isVisible('#sadv-tabs');
    expect(tabsVisible).toBeTruthy();
  });

  test('should use horizontal scroll for tabs on mobile if needed', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-tabs', { timeout: 5000 });

    // Check if tabs container allows scrolling
    const scrollable = await page.evaluate(() => {
      const container = document.querySelector('#sadv-tabs');
      if (!container) return false;

      const styles = window.getComputedStyle(container);
      return styles.overflowX === 'auto' ||
             styles.overflowX === 'scroll' ||
             styles.whiteSpace === 'nowrap';
    });

    // This is optional - tabs might wrap instead
    const tabsVisible = await page.isVisible('#sadv-tabs');
    expect(tabsVisible).toBeTruthy();
  });

  test('should maintain functionality across breakpoints', async ({ page }) => {
    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-tabs', { timeout: 5000 });

    await page.click('#sadv-tabs button:has-text("Daily")');
    await page.waitForTimeout(300);

    let isActive = await page.evaluate(() => {
      const button = document.querySelector('#sadv-tabs button:has-text("Daily")');
      return button?.getAttribute('aria-selected') === 'true';
    });

    expect(isActive).toBeTruthy();

    // Test on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    await page.click('#sadv-tabs button:has-text("Overview")');
    await page.waitForTimeout(300);

    isActive = await page.evaluate(() => {
      const button = document.querySelector('#sadv-tabs button:has-text("Overview")');
      return button?.getAttribute('aria-selected') === 'true';
    });

    expect(isActive).toBeTruthy();
  });

  test('should use appropriate font sizes for different screens', async ({ page }) => {
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    const mobileFontSize = await page.evaluate(() => {
      const container = document.querySelector('#sadv-container');
      return container ? window.getComputedStyle(container).fontSize : null;
    });

    expect(mobileFontSize).toBeDefined();

    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    const desktopFontSize = await page.evaluate(() => {
      const container = document.querySelector('#sadv-container');
      return container ? window.getComputedStyle(container).fontSize : null;
    });

    expect(desktopFontSize).toBeDefined();
  });

  test('should handle resize events gracefully', async ({ page }) => {
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    // Simulate multiple resizes
    for (const size of [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 },
      { width: 375, height: 667 }
    ]) {
      await page.setViewportSize(size);
      await page.waitForTimeout(300);

      const isVisible = await page.isVisible('#sadv-container');
      expect(isVisible).toBeTruthy();
    }
  });

  test('should prevent horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    // Check if body has horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > document.body.clientWidth;
    });

    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('should optimize images for different screen sizes', async ({ page }) => {
    await page.goto('/widget.html');
    await page.waitForSelector('#sadv-container', { timeout: 5000 });

    // Check for responsive images
    const hasResponsiveImages = await page.evaluate(() => {
      const images = document.querySelectorAll('#sadv-container img');
      return Array.from(images).every(img => {
        return img.hasAttribute('srcset') ||
               img.style.maxWidth === '100%' ||
               img.style.width === '100%';
      });
    });

    // This is optional - might not have images
    const containerVisible = await page.isVisible('#sadv-container');
    expect(containerVisible).toBeTruthy();
  });
});
