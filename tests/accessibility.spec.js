import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('WCAG automated checks for explorer, profile, comparison and notes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const scan = async () =>
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
  await scan();
  await page.locator('.city-name').first().click();
  await scan();
  await page.keyboard.press('Escape');
  await page
    .getByRole('navigation', { name: 'Main views' })
    .getByRole('button', { name: /Compare/ })
    .click();
  await scan();
  await page.getByRole('button', { name: 'Field notes', exact: true }).click();
  await scan();
});
