import { test, expect } from '@playwright/test';
import { cities, filterCities, mean, csvFor } from '../src/data.js';
test('dataset is complete, uniquely identified and consistently bounded', () => {
  expect(cities).toHaveLength(20);
  expect(new Set(cities.map((c) => c.id)).size).toBe(20);
  for (const city of cities) {
    for (const key of [
      'sustainability',
      'mobility',
      'cost',
      'green',
      'digital',
    ]) {
      expect(city[key]).toBeGreaterThanOrEqual(0);
      expect(city[key]).toBeLessThanOrEqual(100);
    }
    expect(city.population).toBeGreaterThan(0);
  }
  const europe = filterCities({ region: 'Europe', minimum: 85 });
  expect(europe.map((c) => c.name)).toEqual([
    'Helsinki',
    'Copenhagen',
    'Vienna',
    'Amsterdam',
  ]);
  expect(filterCities({ query: '  JAPAN  ' }).map((c) => c.id)).toEqual([
    'tokyo',
  ]);
  expect(mean([], 'green')).toBe(0);
  expect(mean([{ green: 20 }, { green: 40 }], 'green')).toBe(30);
  expect(csvFor(filterCities({ query: 'Japan' })).split('\n')).toHaveLength(2);
});
test('filters, empty state and detail profile are connected', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.city-card')).toHaveCount(20);
  await page.getByRole('searchbox').fill('Tokyo');
  await expect(page.locator('.city-card')).toHaveCount(1);
  await page.locator('.city-name').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#city-title')).toContainText('Tokyo');
  await page.screenshot({ path: 'docs/screenshots/city-profile.png' });
  await page.keyboard.press('Escape');
  await page.getByRole('searchbox').fill('not-a-city');
  await expect(page.getByText('No cities in this view.')).toBeVisible();
  await page.getByRole('button', { name: 'Show all cities' }).click();
  await expect(page.locator('.city-card')).toHaveCount(20);
});
test('comparison uses selected cities and field notes start a real comparison', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Compare Tokyo', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Compare Vienna', exact: true })
    .click();
  await expect(page.locator('.announcement')).toContainText('three cities');
  await page
    .getByRole('navigation', { name: 'Main views' })
    .getByRole('button', { name: /Compare/ })
    .click();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(
    page.getByRole('columnheader', { name: 'Tokyo', exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: 'docs/screenshots/comparison.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Field notes', exact: true }).click();
  await expect(
    page.getByText('The cities are real.', { exact: false }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Explore this comparison' })
    .first()
    .click();
  await expect(
    page.getByRole('columnheader', { name: 'Tokyo', exact: true }),
  ).toBeVisible();
});
test('CSV export and scatterplot work without external data', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.getByLabel('REGION', { exact: true }).selectOption('Asia');
  await expect(page.locator('.city-card')).toHaveCount(4);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect((await download).suggestedFilename()).toBe(
    'atlas-lab-scenario-cities.csv',
  );
  await page.getByRole('button', { name: 'Scatterplot view' }).click();
  await expect(page.locator('svg.scatter')).toBeVisible();
  await page.screenshot({ path: 'docs/screenshots/scatterplot.png' });
  expect(errors).toEqual([]);
});
for (const width of [360, 768, 1440, 2560]) {
  test('responsive workspace and screenshot at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 360 ? 800 : 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path:
        'docs/screenshots/' +
        (width === 360
          ? 'mobile'
          : width === 1440
            ? 'desktop'
            : 'responsive-' + width) +
        '.png',
      fullPage: false,
    });
    await page
      .getByRole('navigation', { name: 'Main views' })
      .getByRole('button', { name: /Compare/ })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page
      .getByRole('button', { name: 'Field notes', exact: true })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
}
