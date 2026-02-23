import { test, expect } from '@playwright/test';

test('garden canvas is visible on load', async ({ page }) => {
  await page.goto('/');
  const canvas = page.getByTestId('garden-canvas');
  await expect(canvas).toBeVisible();
});

test('canvas has non-zero dimensions', async ({ page }) => {
  await page.goto('/');
  const canvas = page.getByTestId('garden-canvas');
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);
});

test('canvas fills the available space (excluding sidebar)', async ({ page }) => {
  await page.goto('/');
  const canvas = page.getByTestId('garden-canvas');
  const box = await canvas.boundingBox();
  const viewport = page.viewportSize();
  // Sidebar is 280px; canvas takes the remaining width
  expect(box!.width).toBeGreaterThan(viewport!.width * 0.5);
  expect(box!.height).toBeCloseTo(viewport!.height, -1);
});
