import { test, expect } from '@playwright/test';

test.describe('Sorting Visualizer smoke', () => {
  test('loads without console errors, can randomize and run sort', async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (['error'].includes(msg.type())) {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      }
    });

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Sorting Algorithm Visualizer' })).toBeVisible();

    // Randomize array
    await page.getByRole('button', { name: '🎲 Randomize Array' }).click();

    // Start sort
    await page.getByRole('button', { name: '▶️ Start Sort' }).click();

    // Wait for some steps to occur (worker streaming)
    await page.waitForTimeout(1000);

    // Pause if visible, then stop
    const pause = page.getByRole('button', { name: '⏸️ Pause' });
    if (await pause.isVisible()) {
      await pause.click();
    }
    const stop = page.getByRole('button', { name: '⏹️ Stop' });
    if (await stop.isVisible()) {
      await stop.click();
    }

    // Ensure no console errors
    expect(consoleMessages).toEqual([]);
  });

  test('streaming updates visible with small array and low delay', async ({ page }) => {
    await page.goto('/');

    // Set small array (10) and low delay (5ms)
    const sizeSlider = page.locator('input[aria-label="Array size"]');
    await sizeSlider.evaluate((el: HTMLInputElement) => {
      el.value = '10';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.getByRole('button', { name: '🎲 Randomize Array' }).click();

    const speedSlider = page.locator('input[aria-label="Animation speed"]');
    await speedSlider.evaluate((el: HTMLInputElement) => {
      el.value = '10';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Capture initial values of first 10 bars
    const readValues = async () => {
      const values = await page.$$eval('.bar', bars => bars.slice(0, 10).map(b => Number((b as HTMLElement).dataset.value)));
      return values as number[];
    };
    const initial = await readValues();

    await page.getByRole('button', { name: '▶️ Start Sort' }).click();

    // During run: wait until at least one value differs (with low delay)
    let changed = false;
    const startTime = Date.now();
    while (Date.now() - startTime < 2000) {
      const now = await readValues();
      if (now.some((v, i) => v !== initial[i])) { changed = true; break; }
      await page.waitForTimeout(50);
    }
    expect(changed).toBeTruthy();
    // Also ensure step indicator is visible during run
    await expect(page.locator('.step-indicator')).toBeVisible({ timeout: 2000 });
  });

  test('can switch algorithms and step through one operation', async ({ page }) => {
    await page.goto('/');
    // Open algorithm selector (Headless UI Listbox)
    const selectorButton = page.getByRole('button', { name: /Choose Algorithm|Select sorting algorithm|Algorithm/i });
    await selectorButton.click({ trial: true }).catch(() => {});
    await selectorButton.click().catch(() => {});

    // Select Insertion Sort (fall back to visible option text)
    const insertionOption = page.getByRole('option', { name: /Insertion Sort/i });
    await insertionOption.click();

    // Click Step once
    await page.getByRole('button', { name: '⏭️ Step' }).click();
    // Expect the array info to remain visible
    await expect(page.locator('.array-info')).toBeVisible();
  });

  test('can toggle theme via ThemeSwitcher', async ({ page }) => {
    await page.goto('/');
    // Open Theme menu
    const themeButton = page.getByRole('button', { name: /Theme/i });
    await themeButton.click();

    // Click Dark (menuitem role from Headless UI)
    const darkItem = page.getByRole('menuitem', { name: /Dark/i }).or(page.getByRole('button', { name: /Dark/i }));
    await darkItem.click();

    // Verify data-theme attribute on html root updates to dark
    await expect.poll(async () => await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('dark');
  });
});


