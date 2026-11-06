import { test, expect } from '@playwright/test';

const projects = [
  ['neuronsai', 'NeuronsAI', 'Arquitetura', 'neurons'],
  ['miniinfos', 'MiniInfos', 'Arquitetura', 'miniinfos'],
  ['trisha', 'Trisha', 'Arquitetura'],
  ['wallet', 'Wallet', 'Arquitetura', 'wallet'],
  ['storage', 'Storage', 'Arquitetura'],
  ['tlt', 'TLT', 'O pipeline'],
  ['newstech', 'NewsTech', 'O pipeline'],
  ['faturamento', 'Faturamento distribuído', 'Os serviços'],
];

test('a apresentação carrega com retrato e sem erros de JavaScript', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.rs-hero h1')).toHaveText('Rafael Santos');
  await expect(page.locator('[data-view-panel="home"]')).toBeVisible();
  const portrait = page.getByRole('img', { name: 'Rafael Santos', exact: true });
  await expect(portrait).toBeVisible();
  await expect.poll(() => portrait.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  expect(errors).toEqual([]);
});

test('a experiência mantém os detalhes do Agibank', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Experiência', exact: true }).click();
  await expect(page).toHaveURL(/#\/experiencia$/);
  const experience = page.locator('[data-view-panel="experience"]');
  await expect(experience).toBeVisible();
  await expect(experience).toContainText('Plataforma e Cadastro');
  await expect(experience).toContainText('Camunda');
  await expect(experience).toContainText('Apache Kafka');
});

for (const [slug, title, section, key] of projects) {
  test(`abre ${title}, apresenta os detalhes e volta aos projetos`, async ({ page }) => {
    await page.goto('/#/projetos');
    if (key) await page.locator(`[data-view-panel="projects"] [data-project="${key}"]`).click();
    else await page.locator(`.rs-archive-grid a[href="#/${slug}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#/${slug}$`));
    const project = page.locator(key && key !== 'wallet' ? '.rs-detail' : `[data-full-project="${slug}"]`);
    await expect(project).toBeVisible();
    await expect(project.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(project.getByRole('heading', { name: section, exact: true })).toBeVisible();
    if (key && key !== 'wallet') {
      await expect(project.getByRole('heading', { name: 'Decisões de engenharia', exact: true })).toBeVisible();
      await expect(project.getByRole('heading', { name: 'Qualidade e distribuição', exact: true })).toBeVisible();
      await project.getByRole('button', { name: '← Todos os projetos', exact: true }).click();
    } else await project.getByRole('link', { name: '← projetos', exact: true }).click();
    await expect(page.locator('[data-view-panel="projects"]')).toBeVisible();
  });
}

test('preserva links antigos e o histórico do navegador', async ({ page }) => {
  await page.goto('/#/trilha');
  await expect(page.locator('[data-full-project="trisha"]')).toBeVisible();
  await page.getByRole('link', { name: '← projetos', exact: true }).click();
  await page.goBack();
  await expect(page.locator('[data-full-project="trisha"]')).toBeVisible();
  await page.goForward();
  await expect(page.locator('[data-view-panel="projects"]')).toBeVisible();
});

test('links diretos abrem os estudos de caso completos', async ({ page }) => {
  for (const slug of ['miniinfos', 'neuronsai']) {
    await page.goto(`/#/${slug}`);
    await expect(page.locator('.rs-detail')).toBeVisible();
    await expect(page.locator('.rs-detail').getByRole('heading', { name: 'Dentro do código', exact: true })).toBeVisible();
  }
});

test('a página de erro oferece um caminho de volta ao portfólio', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { name: 'Página não encontrada.', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar ao portfólio ↗', exact: true }).click();
  await expect(page.locator('.rs-hero h1')).toHaveText('Rafael Santos');
});

test('idioma e tema permanecem depois de recarregar', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-language-toggle]').click();
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).not.toHaveClass(/rs-theme-changing/);
  const theme = await page.locator('#rafael-portfolio').evaluate(el => getComputedStyle(el).colorScheme);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#rafael-portfolio')).toHaveCSS('color-scheme', theme);
  await expect(page.locator('[data-copy="homeIntro"]')).toContainText('I build systems');
  await page.goto('/#/perfil');
  await expect(page.locator('.old-bio[lang="en"]')).toBeVisible();
  await page.goto('/#/miniinfos');
  await expect(page.getByRole('heading', { name: 'Engineering decisions', exact: true })).toBeVisible();
});

test('a marca abre a página inicial e o menu mantém as seções existentes', async ({ page }) => {
  await page.goto('/#/projetos');
  await page.getByRole('link', { name: 'Rafael Santos, início' }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.locator('[data-view-panel="home"]')).toBeVisible();
  await expect(page.locator('[data-view-panel="projects"]')).toBeHidden();
  await expect(page.locator('.rs-nav-links [data-view]')).toHaveText(['Experiência', 'Projetos', 'Perfil', 'Stack']);
  await expect(page.locator('.rs-nav-links')).not.toContainText('Home');
  await page.getByRole('button', { name: 'Explorar projetos ↗', exact: true }).click();
  await expect(page.locator('[data-view-panel="home"]')).toBeHidden();
  await expect(page.locator('[data-view-panel="projects"]')).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-view-panel="home"]')).toBeVisible();
  await page.locator('[data-view-panel="home"] [data-project="miniinfos"]').click();
  await expect(page).toHaveURL(/#\/miniinfos$/);
  await expect(page.locator('.rs-detail')).toBeVisible();
});

test('MiniInfos oferece a landing page em português e inglês', async ({ page }) => {
  await page.goto('/#/miniinfos');
  const site = page.locator('.rs-detail a[href="https://miniinfos.com"]');
  await expect(site).toContainText('Conheça o MiniInfos');
  await expect(site).toContainText('miniinfos.com');
  await expect(site).toHaveAttribute('target', '_blank');
  await expect(site).toHaveAttribute('rel', 'noopener noreferrer');
  await page.locator('[data-language-toggle]').click();
  await expect(site).toContainText('Explore MiniInfos');
  await page.goto('/#/neuronsai');
  await expect(page.locator('.rs-detail a[href="https://miniinfos.com"]')).toHaveCount(0);
});

test('a troca de tema revela um círculo a partir do botão nos dois sentidos', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.goto('/');
  const button = page.locator('[data-theme-toggle]');
  for (const scheme of ['dark', 'light']) {
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveClass(/rs-theme-changing/);
    await expect(page.locator('#rafael-portfolio')).toHaveCSS('color-scheme', scheme);
    const reveal = await page.evaluate(() => {
      const root = document.documentElement;
      const bounds = document.querySelector('[data-theme-toggle]').getBoundingClientRect();
      return {
        x: parseFloat(root.style.getPropertyValue('--theme-x')),
        y: parseFloat(root.style.getPropertyValue('--theme-y')),
        centerX: bounds.x + bounds.width / 2,
        centerY: bounds.y + bounds.height / 2,
        mask: getComputedStyle(root, '::view-transition-new(root)').maskImage,
      };
    });
    expect(reveal.x).toBeCloseTo(reveal.centerX);
    expect(reveal.y).toBeCloseTo(reveal.centerY);
    expect(reveal.mask).toContain('radial-gradient');
    await expect(page.locator('html')).not.toHaveClass(/rs-theme-changing/);
  }
  expect(errors).toEqual([]);
});

for (const fallback of ['reduced-motion', 'unsupported']) {
  test(`a troca de tema funciona sem animação: ${fallback}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: fallback === 'reduced-motion' ? 'reduce' : 'no-preference' });
    if (fallback === 'unsupported') await page.addInitScript(() => { document.startViewTransition = undefined; });
    await page.goto('/');
    await page.locator('[data-theme-toggle]').click();
    await expect(page.locator('#rafael-portfolio')).toHaveCSS('color-scheme', 'dark');
    await expect(page.locator('html')).not.toHaveClass(/rs-theme-changing/);
    await page.reload();
    await expect(page.locator('#rafael-portfolio')).toHaveCSS('color-scheme', 'dark');
  });
}

test('o menu do celular abre, navega e fecha com Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  await page.getByRole('button', { name: 'Experiência', exact: true }).click();
  await expect(page.locator('[data-view-panel="experience"]')).toBeVisible();
  await expect(page.locator('.rs-menu')).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.rs-menu')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('main')).not.toHaveAttribute('inert');
});

for (const width of [320, 390]) {
  test(`o conteúdo cabe em uma tela de ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['', 'experiencia', 'perfil', 'stack', ...projects.map(([slug]) => slug)]) {
      await page.goto(`/#/${route}`);
      const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
      expect(dimensions.content, `overflow na rota ${route || 'home'}`).toBeLessThanOrEqual(dimensions.viewport);
    }
  });
}
