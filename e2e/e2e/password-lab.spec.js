import { test, expect } from '@playwright/test';

test('Password Lab loads and evaluates input', async ({ page }) => {
  // 1. Go to your local Vite dev server (make sure 'npm run dev' is running in another tab!)
  await page.goto('/');

  // 2. Check that the title renders
  await expect(page.locator('h2')).toHaveText('Password Lab');

  // 3. Find the input and type a password
  const input = page.locator('input').first();
  await input.fill('SecretPassword99!');

  // 4. Verify that your app responds to the input
  await expect(page.locator('.password-lab')).toContainText('Password Lab');
});