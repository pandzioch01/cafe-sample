import { test, expect } from '@playwright/test';

const firstTitle = 'Twój ulubiony stolik';
const lastTitle = 'Odrobina zieleni';
const photo = (page, title) => page.getByRole('button', { name: `Powiększ zdjęcie: ${title}`, exact: true });
const dot = (page, title) => page.getByRole('button', { name: `Przejdź do zdjęcia: ${title}`, exact: true });
const next = page => page.getByRole('button', { name: 'Następne zdjęcia', exact: true });
const prev = page => page.getByRole('button', { name: 'Poprzednie zdjęcia', exact: true });

async function expectAligned(page, title) {
  await expect.poll(async () => {
    const image = await photo(page, title).boundingBox();
    const viewport = await page.locator('.gallery-viewport').boundingBox();
    return image ? Math.abs(image.x - viewport.x) : Infinity;
  }).toBeLessThan(2);
}

for (const width of [390, 1440]) {
  test(`slider moves continuously across the loop boundary at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/#galeria');
    await prev(page).click();
    await expect(dot(page, lastTitle)).toHaveAttribute('aria-current', 'true');
    await expectAligned(page, lastTitle);

    // Follow the incoming first photo through the seam: it must slide in at a
    // constant size instead of teleporting, fading, or being replaced in a grid.
    await page.evaluate(() => {
      window.galleryFrames = [];
      const sample = () => {
        const card = document.querySelector('.gallery-slide .gallery-card');
        const viewport = document.querySelector('.gallery-viewport');
        const rect = card.getBoundingClientRect();
        window.galleryFrames.push({ x: rect.x - viewport.getBoundingClientRect().x, width: rect.width, opacity: getComputedStyle(card).opacity });
        if (window.galleryFrames.length < 90) window.galleryFrameId = requestAnimationFrame(sample);
      };
      sample();
    });
    await next(page).click();
    await expectAligned(page, firstTitle);
    const frames = await page.evaluate(() => { cancelAnimationFrame(window.galleryFrameId); return window.galleryFrames; });
    const distance = frames[0].x;
    expect(distance).toBeGreaterThan(100);
    expect(frames.some(frame => frame.x > 5 && frame.x < distance - 5)).toBe(true);
    expect(frames.every(frame => Math.abs(frame.width - frames[0].width) < 1 && frame.opacity === '1')).toBe(true);
    for (let i = 1; i < frames.length; i++) {
      const movement = frames[i].x - frames[i - 1].x;
      expect(movement).toBeLessThan(2);
      expect(Math.abs(movement)).toBeLessThan(distance * 0.6);
    }
    // Fast repeated input must preserve the loop and selected photo.
    await next(page).click({ clickCount: 6, delay: 30 });
    await expect(dot(page, 'Poranki bez pośpiechu')).toHaveAttribute('aria-current', 'true');
    await expectAligned(page, 'Poranki bez pośpiechu');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('keyboard, dots, lightbox and reduced motion preserve the selected slide', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/#galeria');
  const viewport = page.locator('.gallery-viewport');
  await viewport.focus();
  await viewport.press('ArrowLeft');
  await expectAligned(page, lastTitle);
  await viewport.press('ArrowRight');
  await expectAligned(page, firstTitle);
  await viewport.press('End');
  await expectAligned(page, lastTitle);
  await viewport.press('Home');
  await expectAligned(page, firstTitle);
  await dot(page, 'Z miłości do kawy').click();
  await expectAligned(page, 'Z miłości do kawy');
  expect(await page.locator('.gallery-slide[inert]').count()).toBeGreaterThan(0);
  await viewport.focus();
  await page.keyboard.press('Tab');
  await expect(photo(page, 'Z miłości do kawy')).toBeFocused();
  await photo(page, 'Z miłości do kawy').click();
  await expect(page.getByRole('dialog')).toContainText('Każda filiżanka zasługuje na chwilę uwagi.');
  await page.keyboard.press('Escape');
  await expect(photo(page, 'Z miłości do kawy')).toBeFocused();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Go to photo: For the love of coffee', exact: true })).toHaveAttribute('aria-current', 'true');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.gallery-footnote')).toContainText('04');
  await expect(page.getByRole('button', { name: 'Enlarge photo: For the love of coffee', exact: true })).toBeVisible();
});

test('dragging on mobile moves photos without accidentally opening the lightbox', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#galeria');
  await photo(page, firstTitle).scrollIntoViewIfNeeded();
  await expectAligned(page, firstTitle);
  const box = await page.locator('.gallery-viewport').boundingBox();
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height / 2, { steps: 20 });
  await page.mouse.up();
  await expect(dot(page, 'Poranki bez pośpiechu')).toHaveAttribute('aria-current', 'true');
  await expectAligned(page, 'Poranki bez pośpiechu');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
