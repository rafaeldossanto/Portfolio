import { test, expect } from '@playwright/test';

const projects = [
  ['trisha', 'Trisha', 'Arquitetura'],
  ['wallet', 'Wallet', 'Arquitetura'],
  ['storage', 'Storage', 'Arquitetura'],
  ['tlt', 'TLT', 'O pipeline'],
  ['newstech', 'NewsTech', 'O pipeline'],
  ['faturamento', 'Faturamento distribuído', 'Os serviços'],
];

test('a apresentação e a experiência carregam sem erro de JavaScript', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Rafael Santos/);
  await expect(page.locator('.bio[lang="pt"]')).toBeVisible();
  await expect(page.locator('[data-panel="exp"]')).toContainText('Agibank');
  expect(errors).toEqual([]);
});

for (const [slug, title, section] of projects) {
  test(`abre os detalhes de ${title} e volta aos projetos`, async ({ page }) => {
    await page.goto('/#/projetos');
    await page.locator(`.cards a[href="#/${slug}"]`).click();
    const project = page.locator(`#view-${slug}`);
    await expect(project.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(project.getByRole('heading', { name: section, exact: true })).toBeVisible();
    await project.getByRole('link', { name: '← projetos', exact: true }).click();
    await expect(page.locator('[data-panel="projetos"]')).toBeVisible();
  });
}

test('preserva os links antigos de Trisha', async ({ page }) => {
  await page.goto('/#/trilha');
  await expect(page.locator('#view-trisha')).toBeVisible();
});

test('idioma e tema permanecem depois de recarregar', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-set-lang="en"]').click();
  await page.locator('[data-set-theme="light"]').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('.bio[lang="en"]')).toBeVisible();
});

test('apresentação e projetos cabem em uma tela de celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['', ...projects.map(([slug]) => slug)]) {
    await page.goto(`/#/${route}`);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content, `overflow na rota ${route || 'home'}`).toBeLessThanOrEqual(dimensions.viewport);
  }
});
