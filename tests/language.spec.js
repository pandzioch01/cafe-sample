import { test, expect } from '@playwright/test';

async function switchTo(page, name, code) {
  await page.getByRole('button', { name, exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', code);
  await expect(page.locator('.language-switcher')).toHaveAttribute('aria-busy', 'false');
}

test('English covers the page, full menu, allergens, gallery and accessible labels', async ({ page }) => {
  await page.goto('/');
  await switchTo(page, 'English', 'en');
  await expect(page).toHaveTitle('Między — coffee, cake, good times.');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /specialty coffee, homemade bakes/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Good things');
  await expect(page.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByAltText('A cappuccino and a butter croissant on a wooden table in a sunlit café')).toBeVisible();
  await page.getByRole('button', { name: 'Full menu', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Something sweet' })).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Beyond coffee' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Print menu' })).toBeVisible();
  await dialog.getByRole('button', { name: /Butter croissant/ }).click();
  await expect(dialog).toContainText('Gluten (wheat), milk, eggs.');
  await expect(dialog).toContainText('12 PLN');
  await expect(dialog).toContainText('1 piece');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Enlarge photo: Your favourite table' }).click();
  await expect(dialog).toContainText('Plenty of light, warm wood and room to breathe.');
  await page.keyboard.press('ArrowRight');
  await expect(dialog).toContainText('Unhurried mornings');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Can I bring my dog?' }).click();
  await expect(page.getByText(/Four-legged friends are very welcome/)).toBeVisible();
  await expect(page.locator('footer')).toContainText('For the love of little pleasures.');
  await expect(page.locator('footer')).not.toContainText('Z miłości');
});

test('switching preserves reading position and interactive state, and survives reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Kawa', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Przelew dnia');
  await page.getByRole('button', { name: 'Następne zdjęcia', exact: true }).click();
  await expect(page.locator('.gallery-footnote')).toContainText('02');
  await page.getByRole('button', { name: 'Czy mogę wpaść z psem?' }).click();
  await expect(page.getByText(/Czworonożni goście są u nas mile widziani/)).toBeVisible();
  const faqTop = await page.locator('.faq-section').evaluate(element => element.getBoundingClientRect().top);
  // Use a real pointer click on the visible sticky header: locator.click() calls
  // scrollIntoView first, which can move the page before the language switch starts.
  const languageButton = page.getByRole('button', { name: 'English', exact: true });
  await expect(languageButton).toBeInViewport();
  const button = await languageButton.boundingBox();
  await page.mouse.click(button.x + button.width / 2, button.y + button.height / 2);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.language-switcher')).toHaveAttribute('aria-busy', 'false');
  await expect(page.getByRole('tab', { name: 'Coffee', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'Can I bring my dog?' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.gallery-footnote')).toContainText('02');
  expect(Math.abs(await page.locator('.faq-section').evaluate(element => element.getBoundingClientRect().top) - faqTop)).toBeLessThan(5);
  await expect(page.getByRole('button', { name: 'English', exact: true })).toBeFocused();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await switchTo(page, 'Polski', 'pl');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dobre rzeczy');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
});

test('blocked storage does not prevent switching, and reduced motion skips page animation', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); };
    Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
    window.languageTransitionCalls = 0;
    document.startViewTransition = () => { window.languageTransitionCalls++; throw new Error('Reduced motion must skip animation'); };
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await switchTo(page, 'English', 'en');
  await switchTo(page, 'Polski', 'pl');
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => window.languageTransitionCalls)).toBe(0);
  await expect(page.locator('body')).toHaveCSS('opacity', '1');
});

test('normal motion runs the crossfade and remains switchable afterwards', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = update => {
      const transition = start(update);
      transition.ready.then(() => {
        window.languageAnimation = getComputedStyle(document.documentElement, '::view-transition-new(root)').animationName;
      });
      return transition;
    };
  });
  await page.goto('/');
  await switchTo(page, 'English', 'en');
  expect(await page.evaluate(() => window.languageAnimation)).toBe('language-in');
  await switchTo(page, 'Polski', 'pl');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dobre rzeczy');
});

test('older browsers use the animated fallback and restore opacity', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => { document.startViewTransition = undefined; });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await switchTo(page, 'English', 'en');
  await expect(page.locator('body')).toHaveCSS('opacity', '1');
  await switchTo(page, 'Polski', 'pl');
  await expect(page.locator('body')).toHaveCSS('opacity', '1');
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1440]) {
  test(`English layout and language control at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await switchTo(page, 'English', 'en');
    if (width < 761) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toContainText('Our story');
      await switchTo(page, 'Polski', 'pl');
      await expect(page.getByRole('navigation', { name: 'Nawigacja mobilna' })).toContainText('Nasza historia');
      await page.getByRole('button', { name: 'Zamknij nawigację' }).click();
      await switchTo(page, 'English', 'en');
    }
    for (const category of ['Our favourites', 'Coffee', 'Something sweet', 'Beyond coffee']) {
      await page.getByRole('tab', { name: category, exact: true }).click();
      await expect(page.getByRole('tabpanel')).toHaveAccessibleName(category);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.locator('footer').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'English', exact: true })).toBeVisible();
  });
}
