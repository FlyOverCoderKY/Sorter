import { test, expect } from '@playwright/test';

test.describe('Theme system', () => {
  test('System theme maps to OS preference (dark)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    // Open Theme menu and choose System
    await page.getByRole('button', { name: /Theme/i }).click();
    await page.getByRole('menuitem', { name: /System/i }).click();

    await expect.poll(async () => await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('dark');
  });

  test('Reduced motion disables bar transitions', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Ensure bars are present
    await page.getByRole('button', { name: '🎲 Randomize Array' }).click();
    const bar = page.locator('.bar').first();
    await expect(bar).toBeVisible();

    // Check computed style for transition duration (should be 0s)
    const transitionDuration = await bar.evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(transitionDuration).toBe('0s');
  });
});


