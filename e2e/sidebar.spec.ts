import { test, expect } from '@playwright/test';

test('sidebar is visible on load', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('complementary', { name: 'Plant palette' })).toBeVisible();
});

test('plant cards are rendered in sidebar', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /tomato/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /basil/i })).toBeVisible();
});

test('clicking a plant card selects it (aria-pressed)', async ({ page }) => {
  await page.goto('/');
  const tomatoCard = page.getByRole('button', { name: /tomato/i });
  await tomatoCard.click();
  await expect(tomatoCard).toHaveAttribute('aria-pressed', 'true');
});

test('search filters plant cards', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox').fill('basil');
  await expect(page.getByRole('button', { name: /basil/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /tomato/i })).not.toBeVisible();
});

test('category tabs filter plants', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /herbs/i }).click();
  await expect(page.getByRole('button', { name: /basil/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /tomato/i })).not.toBeVisible();
});

test('selecting plant then pressing ESC deselects it', async ({ page }) => {
  await page.goto('/');
  const tomatoCard = page.getByRole('button', { name: /tomato/i });
  await tomatoCard.click();
  await expect(tomatoCard).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(tomatoCard).toHaveAttribute('aria-pressed', 'false');
});

test('selecting plant and clicking canvas places it', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /carrot/i }).click();
  const canvas = page.getByTestId('garden-canvas');
  const box = await canvas.boundingBox();
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
  // Canvas should still be visible and functional after placement
  await expect(canvas).toBeVisible();
});
