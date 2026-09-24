import { test, expect } from '@playwright/test';

test('guests can browse categories with keyboard and read product allergens', async ({ page }) => {
  await page.goto('/');
  const favorites = page.getByRole('tab', { name: 'Nasze ulubione' });
  await favorites.focus();
  await favorites.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Kawa', exact: true })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('Espresso');
  await page.getByRole('tab', { name: 'Coś słodkiego' }).click();
  await page.getByRole('tabpanel').getByRole('button', { name: /Croissant maślany/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Gluten (pszenica), mleko, jaja.');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('tabpanel').getByRole('button', { name: /Croissant maślany/ })).toBeFocused();
});

test('full menu, gallery arrows, and FAQ work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Cała karta menu', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Iced matcha latte');
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Wydrukuj menu' })).toBeVisible();
  await page.getByRole('button', { name: 'Zamknij okno' }).click();
  await page.getByRole('button', { name: 'Powiększ zdjęcie: Twój ulubiony stolik' }).click();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog')).toContainText('Poranki bez pośpiechu');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Czy mogę wpaść z psem?' }).click();
  await expect(page.getByText(/Czworonożni goście są u nas mile widziani/)).toBeVisible();
});

test('images have alt text and the favicon uses the deployment base', async ({ page }) => {
  await page.goto('/cafe-sample/');
  const images = page.locator('img');
  await expect(images.first()).toBeVisible();
  expect(await images.count()).toBeGreaterThan(0);
  for (const image of await images.all()) {
    await expect(image).toHaveAttribute('alt', /\S+/);
  }
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/cafe-sample/favicon.svg');
});

test('the matching 404 page leads guests home', async ({ page }) => {
  await page.goto('/cafe-sample/404.html');
  await expect(page).toHaveTitle('404 — Między');
  await expect(page.getByRole('heading', { name: 'Zabłądziłeś między stronami.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Wróć do strony głównej/ })).toHaveAttribute('href', '/cafe-sample/');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/cafe-sample/favicon.svg');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

for (const width of [320, 390, 768, 1440]) {
  test(`responsive page and images at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    if (width < 761) {
      await page.getByRole('button', { name: 'Otwórz nawigację' }).click();
      await page.getByRole('navigation', { name: 'Nawigacja mobilna' }).getByRole('link', { name: 'Menu', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Otwórz nawigację' })).toBeVisible();
    }
    // Lazy images are intentionally loaded only when the guest scrolls nearby.
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
