import { test, expect } from '@playwright/test';

test('homepage loads with garden planner heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /garden planner/i })).toBeVisible();
});
