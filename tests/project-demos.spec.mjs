import { test, expect } from '@playwright/test';

test('o grafo permite arraste, teclado, pausa, conclusão e reinício', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion:'no-preference' });
  await page.goto('/#/neuronsai');
  const demo = page.locator('[data-project-demo="neurons"]');
  const planner = demo.locator('[data-agent-node="planner"]');
  const edge = demo.locator('[data-edge="planner-executor"]');
  const originalTransform = await planner.getAttribute('transform');
  const originalPath = await edge.getAttribute('d');
  const bounds = await planner.boundingBox();
  await page.mouse.move(bounds.x + bounds.width/2,bounds.y + bounds.height/2);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width/2 + 30,bounds.y + bounds.height/2 + 20,{steps:5});
  await page.mouse.up();
  await expect(planner).not.toHaveAttribute('transform',originalTransform);
  await expect(edge).not.toHaveAttribute('d',originalPath);
  const dragged = await planner.getAttribute('transform');
  await planner.focus(); await page.keyboard.press('ArrowLeft');
  await expect(planner).not.toHaveAttribute('transform',dragged);
  await demo.locator('[data-demo-run]').click();
  await expect(demo).toHaveAttribute('data-run-state','running');
  await demo.getByRole('button',{name:'Pausar',exact:true}).click();
  await expect(demo).toHaveAttribute('data-run-state','paused');
  await page.locator('[data-language-toggle]').click();
  await expect(demo).toHaveAttribute('data-run-state','paused');
  await expect(planner).not.toHaveAttribute('transform',originalTransform);
  await demo.getByRole('button',{name:'Resume',exact:true}).click();
  await expect(demo.getByRole('status')).toHaveText('Demo completed');
  await demo.getByRole('button',{name:'Reset',exact:true}).click();
  await expect(demo).toHaveAttribute('data-run-state','idle');
  await expect(planner).toHaveAttribute('transform',originalTransform);
  await expect(edge).toHaveAttribute('d',originalPath);
  await expect(page).toHaveURL(/#\/neuronsai$/);
  expect(errors).toEqual([]);
});

test('MiniInfos alterna as ferramentas e preserva a seleção ao mudar o idioma', async ({ page }) => {
  await page.goto('/#/miniinfos');
  const demo = page.locator('[data-project-demo="miniinfos"]');
  const claude = demo.locator('[data-mini-provider="claude"]');
  const codex = demo.locator('[data-mini-provider="codex"]');
  await expect(claude).toBeVisible(); await expect(codex).toBeVisible();
  await demo.getByRole('button',{name:'Codex',exact:true}).click();
  await expect(claude).toBeHidden(); await expect(codex).toBeVisible();
  await expect(codex).toContainText('46,5 M');
  await page.locator('[data-language-toggle]').click();
  await expect(claude).toBeHidden(); await expect(codex).toBeVisible();
  await expect(codex).toContainText('46.5 M');
  await expect(demo.getByRole('button',{name:'Codex',exact:true})).toHaveAttribute('aria-pressed','true');
  await demo.getByRole('button',{name:'Claude',exact:true}).click();
  await expect(claude).toBeVisible(); await expect(codex).toBeHidden();
  await demo.getByRole('button',{name:'Reset',exact:true}).click();
  await expect(claude).toBeVisible(); await expect(codex).toBeVisible();
  await expect(demo.getByRole('button',{name:'Split view',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(page).toHaveURL(/#\/miniinfos$/);
  await expect(page.getByRole('heading',{name:'Architecture',exact:true})).toBeVisible();
});

test('a luz respeita movimento reduzido e continua na Home após navegar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'no-preference' });
  await page.goto('/#/neuronsai');
  const demo = page.locator('[data-project-demo="neurons"]');
  const light = page.locator('.rs-cursor-light');
  await demo.hover();
  await expect(light).toHaveClass(/is-visible/);
  await page.emulateMedia({ reducedMotion:'reduce' });
  await expect(light).toBeHidden();
  await demo.getByRole('button',{name:'Executar demo',exact:true}).click();
  await expect(demo.getByRole('status')).toHaveText('Demonstração concluída');
  await page.getByRole('link',{name:'Rafael Santos, início',exact:true}).click();
  await expect(page.locator('[data-view-panel="home"]')).toBeVisible();
  await expect(light).toBeHidden();
  await expect(page.locator('[data-project-demo]')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion:'no-preference' });
  await page.locator('.rs-nav').hover();
  await expect(light).toHaveClass(/is-visible/);
  await expect(light).toBeVisible();
});

test('sair de uma execução e reabrir o projeto inicia uma demonstração limpa', async ({ page }) => {
  const errors = [];
  page.on('pageerror',error => errors.push(error.message));
  await page.goto('/#/neuronsai');
  await page.locator('[data-demo-run]').click();
  await page.getByRole('button',{name:'← Todos os projetos',exact:true}).click();
  await expect(page.locator('[data-view-panel="projects"]')).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-project-demo="neurons"]')).toHaveAttribute('data-run-state','idle');
  expect(errors).toEqual([]);
});

test('no celular todos os nós cabem no grafo sem rolagem lateral', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#/neuronsai');
  const graph = page.locator('.rs-demo-graph');
  await expect(page.locator('.rs-demo-canvas')).toHaveAttribute('viewBox','0 0 400 520');
  const frame = await graph.boundingBox();
  for (const node of await graph.locator('[data-agent-node]').all()) {
    const bounds = await node.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(frame.x);
    expect(bounds.x+bounds.width).toBeLessThanOrEqual(frame.x+frame.width);
    expect(bounds.y).toBeGreaterThanOrEqual(frame.y);
    expect(bounds.y+bounds.height).toBeLessThanOrEqual(frame.y+frame.height);
  }
  await page.setViewportSize({width:1440,height:1000});
  await expect(page.locator('.rs-demo-canvas')).toHaveAttribute('viewBox','0 0 960 360');
});
