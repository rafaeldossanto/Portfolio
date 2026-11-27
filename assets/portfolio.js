import { createProjectDemo, createWebsiteLink } from './project-demos.js';
import { projects as data, caseStudies, projectRoutes, text } from './content.js';
(() => {
  const root = document.getElementById('rafael-portfolio');
  const stage = root.querySelector('.rs-stage');
  const detail = root.querySelector('.rs-detail');
  root.querySelector('.rs-full-projects').append(detail);
  detail.querySelector('[data-detail-title]').className = 'old-proj-title';
  const projectBack = detail.querySelector('[data-close-detail]');
  projectBack.classList.add('old-back');
  detail.prepend(projectBack);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const settings = {theme:'Automático',corners:'16 px',language:'pt'};
  let activeProject = null;
  let currentView = 'home';
  const viewRoutes = {projects:'projetos', experience:'experiencia', profile:'perfil', stack:'stack'};
  const routeViews = {'':'home',home:'home',projetos:'projects',experiencia:'experience',exp:'experience',perfil:'profile',stack:'stack'};
  const routeProjects = Object.fromEntries(Object.entries(projectRoutes).map(([key,route]) => [route,key]));
  Object.assign(routeProjects,{trilha:'trisha',neurons:'neurons'});
  const preferenceKey = 'rs-preferences-v2';
  let pendingScroll = 'content';

  root.querySelectorAll('.rs-project-description').forEach((el,index) => el.dataset.copy = ['neuronCopy','miniCopy','walletCopy'][index]);
  detail.querySelector('[data-close-detail]').dataset.copy = 'back';
  detail.querySelector('h3').dataset.copy = 'inside';
  const extra = document.createElement('div'); extra.className = 'rs-new-project-sections'; detail.append(extra);
  let projectDemo;
  const biography = root.querySelector('.rs-full-bio');
  const profileBiography = document.createElement('div'); profileBiography.className = 'rs-profile-biography';
  profileBiography.append(...biography.children);
  root.querySelector('[data-view-panel="profile"] > h2').after(profileBiography);
  const intro = document.createElement('p'); intro.dataset.copy = 'homeIntro'; biography.append(intro);
  root.querySelector('[data-scroll="contact"]').dataset.copy = 'contactNav';
  root.querySelector('.rs-cover-caption').dataset.copy = 'neuronTagline';
  root.querySelector('.rs-mini-poster p').dataset.copy = 'miniTagline';
  root.querySelector('.rs-wallet-poster p').dataset.copy = 'walletTagline';
  const categories = ['neuronsCategory','miniCategory','walletCategory'];
  root.querySelectorAll('.rs-project-meta').forEach((el,index) => {
    const label = document.createElement('span'); label.dataset.copy = categories[index];
    el.firstChild.replaceWith(label);
  });
  root.querySelector('.rs-status').dataset.copy = 'inDevelopment';
  const flowLabels = [['input','context'],['orchestration','agents'],['output','execution']];
  root.querySelectorAll('.rs-flow-node').forEach((el,index) => {
    const label = document.createElement('span'); label.dataset.copy = flowLabels[index][0];
    el.firstChild.replaceWith(label); el.querySelector('b').dataset.copy = flowLabels[index][1];
  });
  root.querySelector('[data-project="miniinfos"] .rs-tags span:last-child').dataset.copy = 'aiTools';
  document.querySelector('.rs-skip').dataset.copy = 'skip';
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey) || 'null');
    const oldTheme = localStorage.getItem('rs-tema');
    const language = saved?.language || localStorage.getItem('rs-idioma') || (navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en');
    const theme = saved?.theme || ({dark:'Escuro',light:'Claro'}[oldTheme]);
    if (['pt','en'].includes(language)) settings.language = language;
    if (['Automático','Claro','Escuro'].includes(theme)) settings.theme = theme;
  } catch { /* Preferências indisponíveis não impedem a navegação. */ }

  function remember() {
    try { localStorage.setItem(preferenceKey,JSON.stringify({theme:settings.theme,language:settings.language})); } catch {}
  }
  let themeTransition;
  let themeSequence = 0;
  async function toggleTheme(event, button) {
    const current = ++themeSequence;
    themeTransition?.skipTransition();
    const scheme = getComputedStyle(root).colorScheme;
    const dark = scheme === 'dark' || (scheme === 'light dark' && matchMedia('(prefers-color-scheme:dark)').matches);
    settings.theme = dark ? 'Claro' : 'Escuro';
    const apply = () => { if (current === themeSequence) { applySettings(); remember(); } };
    const html = document.documentElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !document.startViewTransition) {
      apply(); themeTransition = undefined; html.classList.remove('rs-theme-changing'); return;
    }
    const bounds = button.getBoundingClientRect();
    const x = Math.max(0,Math.min(event.detail ? event.clientX : bounds.x + bounds.width / 2,innerWidth));
    const y = Math.max(0,Math.min(event.detail ? event.clientY : bounds.y + bounds.height / 2,innerHeight));
    const radius = Math.hypot(Math.max(x,innerWidth - x),Math.max(y,innerHeight - y)) + 32;
    html.style.setProperty('--theme-x',x + 'px');
    html.style.setProperty('--theme-y',y + 'px');
    html.classList.add('rs-theme-changing');
    try {
      const transition = document.startViewTransition(apply);
      themeTransition = transition;
      await transition.ready;
      if (current !== themeSequence) return;
      const animation = html.animate(
        [{'--theme-radius':'0px'},{'--theme-radius':radius + 'px'}],
        {duration:1200,easing:'cubic-bezier(0.65, 0, 0.35, 1)',fill:'both',pseudoElement:'::view-transition-new(root)'},
      );
      await animation.finished;
      await transition.finished;
    } catch {
      apply();
    } finally {
      if (current === themeSequence) { themeTransition = undefined; html.classList.remove('rs-theme-changing'); }
    }
  }
  function updateTitle() {
    const project = activeProject && (data[activeProject]?.title || root.querySelector('[data-full-project="' + activeProject + '"] .old-proj-title:not([hidden])')?.textContent);
    document.title = project ? project + ' · Rafael Santos' : 'Rafael Santos | ' + text[settings.language].homeRole;
  }
  function applySettings() {
    const scheme = settings.theme === 'Claro' ? 'light' : settings.theme === 'Escuro' ? 'dark' : 'light dark';
    root.style.colorScheme = scheme;
    document.documentElement.style.colorScheme = scheme;
    root.lang = document.documentElement.lang = settings.language === 'pt' ? 'pt-BR' : 'en';
    root.querySelector('[data-theme-toggle]').textContent = settings.theme === 'Escuro' ? '◑' : '◐';
    root.querySelector('[data-theme-toggle]').setAttribute('aria-label',text[settings.language].theme);
    root.querySelector('[data-language-toggle]').textContent = settings.language === 'pt' ? 'EN' : 'PT';
    root.querySelector('[data-language-toggle]').setAttribute('aria-label',text[settings.language].language);
    root.querySelector('.rs-menu').setAttribute('aria-label',text[settings.language][stage.classList.contains('rs-menu-open')?'closeMenu':'openMenu']);
    root.querySelectorAll('[data-i18n]').forEach(el => el.hidden = el.lang !== settings.language);
    document.querySelectorAll('[data-copy]').forEach(el => { const value = text[settings.language][el.dataset.copy]; if (value) el.textContent = value; });
    root.querySelectorAll('[data-project]').forEach(el => el.setAttribute('aria-label',(settings.language === 'pt'?'Explorar projeto ':'Explore project ') + ({neurons:'NeuronsAI',miniinfos:'MiniInfos',wallet:'Wallet'}[el.dataset.project])));
    if (activeProject && data[activeProject]) fillDetail(activeProject);
    updateTitle();
  }
  function closeMenu() {
    stage.classList.remove('rs-menu-open');
    stage.querySelector('main').inert = false;
    stage.querySelector('footer').inert = false;
    stage.querySelector('.rs-menu').setAttribute('aria-expanded','false');
    stage.querySelector('.rs-menu').setAttribute('aria-label',text[settings.language].openMenu);
  }
  function scrollToContent(el) {
    const target = el.querySelector('.old-back') || el;
    requestAnimationFrame(() => target.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'}));
  }
  function showView(view) {
    projectDemo?.dispose(); projectDemo = undefined;
    currentView = view; activeProject = null; closeMenu();
    root.querySelectorAll('[data-view-panel]').forEach(el => el.hidden = el.dataset.viewPanel !== view);
    root.querySelectorAll('[data-full-project]').forEach(el => el.hidden = true);
    detail.hidden = true;
    root.querySelectorAll('.rs-nav-links [data-view]').forEach(el => {
      if (el.dataset.view === view) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current');
    });
    const home = root.querySelector('[data-home]');
    if (view === 'home') home.setAttribute('aria-current','page'); else home.removeAttribute('aria-current');
    root.querySelectorAll('[data-project]').forEach(el => el.setAttribute('aria-expanded','false'));
    return root.querySelector('[data-view-panel="' + view + '"]');
  }
  function fillDetail(key) {
    const item = data[key]; const study = caseStudies[key]; const strings = item[settings.language];
    detail.dataset.currentProject = key;
    detail.querySelector('[data-detail-title]').textContent = item.title;
    detail.querySelector('[data-detail-copy]').textContent = strings[0];
    detail.querySelector('[data-detail-architecture]').textContent = strings[1];
    detail.querySelector('[data-detail-tags]').replaceChildren(...item.tags.map(tag => { const el = document.createElement('span'); el.textContent = tag; return el; }));
    const sections = study[settings.language].map(group => {
      const section = document.createElement('section'); section.className = 'old-section';
      const heading = document.createElement('h3'); heading.textContent = group.title;
      const list = document.createElement(group.kind === 'list' ? 'ul' : 'div');
      list.className = group.kind === 'grid' ? 'old-grid-2' : group.kind === 'list' ? 'old-facts' : group.kind === 'paths' ? 'old-repos' : 'rs-case-paragraphs';
      group.items.forEach(([title,copy]) => {
        if (group.kind === 'paragraphs') {
          const paragraph = document.createElement('p'); paragraph.textContent = copy; list.append(paragraph);
        } else if (group.kind === 'list') {
          const row = document.createElement('li'); const lead = document.createElement('b'); lead.textContent = title;
          row.append(lead,document.createTextNode(' ' + copy)); list.append(row);
        } else if (group.kind === 'paths') {
          const link = document.createElement('a'); link.className = 'old-repo';
          link.href = study.repository + '/tree/main/' + title.split('/').map(encodeURIComponent).join('/'); link.target = '_blank'; link.rel = 'noopener noreferrer';
          const path = document.createElement('code'); path.textContent = title;
          const description = document.createElement('span'); description.className = 'old-what'; description.textContent = copy;
          link.append(path,description); list.append(link);
        } else {
          const block = document.createElement('div'); block.className = 'old-box';
          const name = document.createElement('h4'); name.className = 'old-box-name'; name.textContent = title;
          const paragraph = document.createElement('p'); paragraph.textContent = copy;
          block.append(name,paragraph); list.append(block);
        }
      });
      section.append(heading,list); return section;
    });
    const links = document.createElement('div'); links.className = 'old-btns';
    const destinations = [[study.repository,settings.language === 'pt'?'Ver no GitHub ↗':'View on GitHub ↗'],[study.repository + '/blob/main/README.md',settings.language === 'pt'?'Documentação ↗':'Documentation ↗']];
    destinations.forEach(([href,label],index) => {
      const link = document.createElement('a'); link.className = 'old-btn' + (index === 0 && !study.website?' old-solid':''); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = label; links.append(link);
    });
    const actions = document.createElement('div'); actions.className = 'rs-case-actions';
    if (study.website) actions.append(createWebsiteLink(study.website,settings.language));
    actions.append(links);
    if (!projectDemo || projectDemo.key !== key) {
      projectDemo?.dispose(); projectDemo = createProjectDemo(key,settings.language);
    } else projectDemo.setLanguage(settings.language);
    extra.replaceChildren(actions,projectDemo.element,...sections);
  }
  function openProject(key) {
    const page = root.querySelector('[data-full-project="' + key + '"]');
    if (!page && !data[key]) return showView('projects');
    showView('projects'); activeProject = key;
    root.querySelector('[data-view-panel="projects"]').hidden = true;
    if (page) { page.hidden = false; return page; }
    fillDetail(key); detail.hidden = false; return detail;
  }
  function renderRoute(scroll = true) {
    if (location.hash && !location.hash.startsWith('#/')) return;
    let route = '';
    try { route = decodeURIComponent(location.hash.replace(/^#\/?/,'')); } catch {}
    const target = routeProjects[route] ? openProject(routeProjects[route]) : showView(routeViews[route] || 'home');
    updateTitle();
    if (scroll && pendingScroll === 'top') window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});
    else if (scroll) scrollToContent(target);
    pendingScroll = 'content';
  }
  function navigate(route,top = false) {
    pendingScroll = top ? 'top' : 'content';
    const hash = '#/' + route;
    if (location.hash === hash) renderRoute(); else location.hash = hash;
  }
  root.addEventListener('click',event => {
    if (event.target.closest('[data-home]')) { event.preventDefault(); navigate('',true); return; }
    const view = event.target.closest('[data-view]');
    if (view) { navigate(viewRoutes[view.dataset.view]); return; }
    const project = event.target.closest('[data-project]');
    if (project) { navigate(projectRoutes[project.dataset.project]); return; }
    if (event.target.closest('[data-close-detail]')) { navigate('projetos'); return; }
    const scroll = event.target.closest('[data-scroll]');
    if (scroll) { closeMenu(); scrollToContent(root.querySelector('[data-section="' + scroll.dataset.scroll + '"]')); return; }
    const themeButton = event.target.closest('[data-theme-toggle]');
    if (themeButton) { void toggleTheme(event,themeButton); return; }
    if (event.target.closest('[data-language-toggle]')) { settings.language = settings.language === 'pt' ? 'en' : 'pt'; applySettings(); remember(); return; }
    const menu = event.target.closest('.rs-menu');
    if (menu) {
      const open = stage.classList.toggle('rs-menu-open');
      stage.querySelector('main').inert = open; stage.querySelector('footer').inert = open;
      menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',text[settings.language][open?'closeMenu':'openMenu']);
    }
  });
  window.addEventListener('hashchange',() => renderRoute());
  window.addEventListener('keydown',event => {
    if (event.key === 'Escape' && stage.classList.contains('rs-menu-open')) { closeMenu(); stage.querySelector('.rs-menu').focus(); }
  });
  matchMedia('(max-width:760px)').addEventListener('change',event => { if (!event.matches) closeMenu(); });
  applySettings(); renderRoute(Boolean(location.hash));
})();
