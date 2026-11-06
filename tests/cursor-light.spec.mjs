import { test, expect } from '@playwright/test';

test('a luz acompanha o mouse em todas as páginas e no menu', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  const routes = ['','projetos','experiencia','perfil','stack','neuronsai','miniinfos','trisha','wallet','storage','tlt','newstech','faturamento'];
  for (const [index,route] of routes.entries()) {
    await page.goto(`/#/${route}`);
    const light = page.locator('.rs-cursor-light');
    await expect(light).toHaveCount(1);
    await page.mouse.move(64+index,96);
    await expect(light).toHaveClass(/is-visible/);
    await expect(light).toBeVisible();
    await expect(light).toHaveCSS('pointer-events','none');
  }
  await page.locator('.rs-nav').hover();
  await expect(page.locator('.rs-cursor-light')).toHaveClass(/is-visible/);
  await page.goto('/404.html');
  await page.mouse.move(120,180);
  await expect(page.locator('.rs-cursor-light')).toHaveClass(/is-visible/);
  await expect(page.getByRole('link',{name:'Voltar ao portfólio ↗'})).toBeVisible();
});

test('a luz não aparece em dispositivos de toque', async ({ browser }) => {
  const page = await browser.newPage({isMobile:true,hasTouch:true,viewport:{width:390,height:844}});
  await page.goto('/');
  await page.touchscreen.tap(32,160);
  await expect(page.locator('.rs-cursor-light')).toBeHidden();
  await page.close();
});
