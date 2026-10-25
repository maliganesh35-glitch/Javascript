import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.youtube.com/');
  await page.getByRole('combobox', { name: 'Search' }).click();
  await page.getByRole('combobox', { name: 'Search' }).fill('cod');
  await page.getByRole('combobox', { name: 'Search' }).press('Enter');
  await page.getByRole('link', { name: 'Fully Maxed Mythic RAM-7 Is', description: 'Fully Maxed Mythic RAM-7 Is Back To Dominate Again 😍 | COD Mobile' }).click();
});