import { test, expect } from '@playwright/test';

test.describe('Memory stability (Chromium only)', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Heap usage CDP is Chromium-specific');

  test('heap usage does not grow unbounded across repeated sorts', async ({ page, context }) => {
    await page.goto('/');

    // Set array size to 20 and speed to 0 (instant) to complete quickly
    const sizeSlider = page.locator('input[aria-label="Array size"]');
    await sizeSlider.evaluate((el: HTMLInputElement) => {
      el.value = '20';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const speedSlider = page.locator('input[aria-label="Animation speed"]');
    await speedSlider.evaluate((el: HTMLInputElement) => {
      el.value = '0';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const session = await context.newCDPSession(page);
    const heapBefore = await session.send('Runtime.getHeapUsage');

    // Run several sorts back-to-back
    for (let i = 0; i < 2; i++) {
      await page.getByRole('button', { name: '🎲 Randomize Array' }).click();
      await page.getByRole('button', { name: '▶️ Start Sort' }).click();

      // Let it run briefly, then stop deterministically to bound runtime
      await page.waitForTimeout(1000);
      const stop = page.getByRole('button', { name: '⏹️ Stop' });
      if (await stop.isVisible()) {
        await stop.click();
      }
    }

    const heapAfter = await session.send('Runtime.getHeapUsage');

    const usedBefore = heapBefore.usedSize as number;
    const usedAfter = heapAfter.usedSize as number;
    const delta = usedAfter - usedBefore;

    // Allow modest growth (< 10 MB) for code/data caches
    expect(delta).toBeLessThan(10 * 1024 * 1024);
  });
});


