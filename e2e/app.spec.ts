import { test, expect } from '@playwright/test';

test('homepage loads the garden canvas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('garden-canvas')).toBeVisible();
});
