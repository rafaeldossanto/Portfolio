// Isolated, local examples. These controls never call model APIs or read user data.
const copy = {
  pt: {
    graphTitle:'Explore o grafo', graphIntro:'Arraste os nós e simule a execução de um fluxo.',
    interactive:'Demonstração interativa', manual:'Manual', planner:'Planejador', api:'AGENTE · API',
    executor:'Executor', terminal:'AGENTE · TERMINAL', memory:'Memória', tool:'FERRAMENTA', context:'Contexto compartilhado',
    run:'Executar demo', pause:'Pausar', resume:'Continuar', reset:'Reiniciar',
    graphHint:'Arraste os nós ou use as setas do teclado.', graphLabel:'Grafo de demonstração com nós móveis',
    nodeHint:'Use as setas para mover este nó.', simulation:'Simulação local · sem chamadas de API',
    idle:'Pronto para simular', running:'Executando', paused:'Simulação pausada', finished:'Demonstração concluída',
    miniTitle:'Experimente o MiniInfos', miniIntro:'Uma prévia do widget que fica perto do seu trabalho.',
    split:'Visão dividida', providers:'Visualização da demonstração', window:'Janela 5h', week:'Semanal',
    today:'Tokens hoje', currentContext:'Contexto atual', resetIn:'Reinicia em', demo:'Dados de demonstração',
    switchTitle:'Alterne a ferramenta', switchCopy:'Veja Claude ou Codex separadamente, ou escolha a visão dividida.',
    compareTitle:'Compare lado a lado', compareCopy:'Acompanhe os limites e o consumo das duas ferramentas.',
    resetTitle:'Reinicie a demonstração', resetCopy:'Volte à visualização e aos dados de exemplo.',
    privacy:'Dados de exemplo. Nada é lido do seu computador.', visit:'Conheça o MiniInfos',
  },
  en: {
    graphTitle:'Explore the graph', graphIntro:'Drag nodes and run a simulated workflow.',
    interactive:'Interactive demo', manual:'Manual', planner:'Planner', api:'AGENT · API',
    executor:'Executor', terminal:'AGENT · TERMINAL', memory:'Memory', tool:'TOOL', context:'Shared context',
    run:'Run demo', pause:'Pause', resume:'Resume', reset:'Reset',
    graphHint:'Drag nodes or use the arrow keys.', graphLabel:'Demo graph with movable nodes',
    nodeHint:'Use the arrow keys to move this node.', simulation:'Local simulation · no API calls',
    idle:'Ready to simulate', running:'Running', paused:'Simulation paused', finished:'Demo completed',
    miniTitle:'Try MiniInfos', miniIntro:'A small preview of the desktop widget.',
    split:'Split view', providers:'Demo view', window:'5h window', week:'Weekly',
    today:'Tokens today', currentContext:'Current context', resetIn:'Resets in', demo:'Demo data',
    switchTitle:'Switch provider', switchCopy:'View Claude or Codex separately, or choose Split view.',
    compareTitle:'Compare side by side', compareCopy:'See usage and limits for two tools at once.',
    resetTitle:'Reset the demo', resetCopy:'Return to the example view and sample data.',
    privacy:'Sample data. Nothing is read from your computer.', visit:'Explore MiniInfos',
  },
};

const paths = {
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/>',
  arrow:'<path d="M6 18L18 6M6 6h12v12"/>',
  reset:'<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  play:'<path d="M8 5v14l11-7Z"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',
  windows:'<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 7V3h13v14h-5"/>',
};
function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

function updateCopy(element, language) {
  const strings = copy[language];
  element.querySelectorAll('[data-demo-text]').forEach(node => { node.textContent = strings[node.dataset.demoText]; });
}

export function createWebsiteLink(url, language) {
  const link = document.createElement('a');
  link.className = 'rs-site-cta'; link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.innerHTML = `${icon('globe')}<span class="rs-site-cta-copy"><strong></strong><span></span></span>${icon('arrow')}`;
  link.querySelector('strong').textContent = copy[language].visit;
  link.querySelector('.rs-site-cta-copy > span').textContent = new URL(url).hostname;
  return link;
}

export function attachCursorLight(detail) {
  const light = document.createElement('div'); light.className = 'rs-cursor-light'; light.setAttribute('aria-hidden','true');
  detail.append(light);
  const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame = 0, x = 0, y = 0;
  const hide = () => { cancelAnimationFrame(frame); frame = 0; light.classList.remove('is-visible'); };
  detail.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !allowed.matches) { hide(); return; }
    x = event.clientX; y = event.clientY;
    if (!frame) frame = requestAnimationFrame(() => {
      light.style.setProperty('--cursor-x',`${x}px`); light.style.setProperty('--cursor-y',`${y}px`);
      light.classList.add('is-visible'); frame = 0;
    });
  });
  detail.addEventListener('pointerleave',hide);
  allowed.addEventListener('change',hide);
}

export function createProjectDemo(key, language) {
  return key === 'neurons' ? createGraphDemo(language) : createMiniInfosDemo(language);
}

function createGraphDemo(language) {
  const element = document.createElement('section'); element.className = 'rs-case-demo'; element.dataset.projectDemo = 'neurons';
  const events = new AbortController(); const signal = events.signal;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const wideLayout = {
    manual:{x:28,y:157,width:134,height:50}, planner:{x:275,y:133,width:220,height:100},
    executor:{x:660,y:36,width:220,height:100}, memory:{x:660,y:246,width:220,height:90},
  };
  const compactLayout = {
    manual:{x:133,y:16,width:134,height:50}, planner:{x:90,y:110,width:220,height:100},
    executor:{x:90,y:260,width:220,height:100}, memory:{x:90,y:410,width:220,height:90},
  };
  let compact = matchMedia('(max-width:760px)').matches;
  let initial = compact ? compactLayout : wideLayout;
  const nodes = structuredClone(initial);
  element.innerHTML = `
    <header class="rs-case-demo-head"><div><h3 class="heading-6" data-demo-text="graphTitle"></h3><p class="body-6" data-demo-text="graphIntro"></p></div><span class="rs-demo-badge caption-4" data-demo-text="interactive"></span></header>
    <div class="rs-demo-graph" tabindex="0"><svg class="rs-demo-canvas" viewBox="0 0 960 360">
      <defs><pattern id="rs-case-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#88887e" opacity=".3"/></pattern></defs>
      <rect width="960" height="360" fill="url(#rs-case-grid)"/>
      <g class="rs-demo-edges"><path data-edge="manual-planner"/><path data-edge="planner-executor"/><path data-edge="planner-memory"/><path data-edge="executor-memory" class="rs-demo-memory-edge"/></g>
      <g class="rs-demo-node rs-demo-trigger" data-agent-node="manual" tabindex="0" role="button"><rect width="134" height="50" rx="25"/><path class="rs-demo-trigger-icon" d="M18 15v20l15-10Z"/><text x="46" y="31" class="rs-demo-node-title" data-demo-text="manual"></text><circle class="rs-demo-port" cx="134" cy="25" r="5"/></g>
      <g class="rs-demo-node is-selected" data-agent-node="planner" tabindex="0" role="button"><rect width="220" height="100" rx="8"/><rect class="rs-demo-node-icon" x="16" y="16" width="40" height="40" rx="8"/><path class="rs-demo-node-symbol" d="M27 42h19c8 0 8-12 0-12-2-9-15-9-16 1-9 0-11 11-3 11Z"/><text x="68" y="29" class="rs-demo-node-title" data-demo-text="planner"></text><text x="68" y="49" class="rs-demo-node-kind" data-demo-text="api"></text><text x="16" y="81" class="rs-demo-node-detail" data-demo-text="context"></text><circle class="rs-demo-port" cx="0" cy="50" r="5"/><circle class="rs-demo-port" cx="220" cy="50" r="5"/></g>
      <g class="rs-demo-node" data-agent-node="executor" tabindex="0" role="button"><rect width="220" height="100" rx="8"/><rect class="rs-demo-node-icon" x="16" y="16" width="40" height="40" rx="8"/><path class="rs-demo-node-symbol" d="M27 27l8 8-8 8m12 0h8"/><text x="68" y="29" class="rs-demo-node-title" data-demo-text="executor"></text><text x="68" y="49" class="rs-demo-node-kind" data-demo-text="terminal"></text><text x="16" y="81" class="rs-demo-node-detail">Codex CLI</text><circle class="rs-demo-port" cx="0" cy="50" r="5"/><circle class="rs-demo-port" cx="110" cy="100" r="5"/></g>
      <g class="rs-demo-node" data-agent-node="memory" tabindex="0" role="button"><rect width="220" height="90" rx="8"/><rect class="rs-demo-node-icon" x="16" y="16" width="40" height="40" rx="8"/><path class="rs-demo-node-symbol" d="M26 27h10v20H26Zm10 0h10v20H36Z"/><text x="68" y="29" class="rs-demo-node-title" data-demo-text="memory"></text><text x="68" y="49" class="rs-demo-node-kind" data-demo-text="tool"></text><text x="16" y="76" class="rs-demo-node-detail">Obsidian</text><circle class="rs-demo-port" cx="0" cy="45" r="5"/><circle class="rs-demo-port" cx="110" cy="0" r="5"/></g>
    </svg></div>
    <div class="rs-demo-controls"><button type="button" class="rs-demo-run button-sm" data-demo-run></button><button type="button" class="rs-demo-reset button-sm" data-demo-reset>${icon('reset')}<span data-demo-text="reset"></span></button><span class="rs-demo-keyboard caption-4" data-demo-text="graphHint"></span></div>
    <div class="rs-demo-notes caption-4"><output role="status" data-demo-status></output><span data-demo-text="simulation"></span></div>`;
  const svg = element.querySelector('svg.rs-demo-canvas');
  const runButton = element.querySelector('[data-demo-run]');
  const status = element.querySelector('[data-demo-status]');
  const sequence = ['manual','planner','executor','memory'];
  let selected = 'planner', drag, timer, step = -1, state = 'idle';

  function paintGraph() {
    svg.setAttribute('viewBox',compact ? '0 0 400 520' : '0 0 960 360');
    Object.entries(nodes).forEach(([key,node]) => {
      const block = svg.querySelector(`[data-agent-node="${key}"]`);
      block.setAttribute('transform',`translate(${node.x} ${node.y})`);
      block.classList.toggle('is-selected',key === selected);
      block.classList.toggle('is-running',state === 'running' && sequence[step] === key);
      const top = [node.width/2,0], bottom = [node.width/2,node.height];
      const inlet = compact ? top : [0,node.height/2];
      const outlet = compact ? bottom : [node.width,node.height/2];
      const ports = {manual:[outlet],planner:[inlet,outlet],executor:[inlet,bottom],memory:[inlet,top]}[key];
      block.querySelectorAll('.rs-demo-port').forEach((port,index) => {
        port.setAttribute('cx',ports[index][0]); port.setAttribute('cy',ports[index][1]);
      });
    });
    [['manual','planner'],['planner','executor'],['planner','memory']].forEach(([from,to]) => {
      const a = nodes[from], b = nodes[to]; const x1 = a.x + a.width, y1 = a.y + a.height / 2;
      const x2 = b.x, y2 = b.y + b.height / 2, bend = Math.max(40,Math.abs(x2 - x1) / 2);
      const edge = svg.querySelector(`[data-edge="${from}-${to}"]`);
      if (compact) {
        const startX = a.x+a.width/2, startY = a.y+a.height, endX = b.x+b.width/2, endY = b.y;
        const detour = from === 'planner' && to === 'memory';
        const middle = (startY+endY)/2;
        edge.setAttribute('d',detour ? `M${startX} ${startY}C390 ${startY} 390 ${endY} ${endX} ${endY}` : `M${startX} ${startY}C${startX} ${middle} ${endX} ${middle} ${endX} ${endY}`);
      } else edge.setAttribute('d',`M${x1} ${y1}C${x1 + bend} ${y1} ${x2 - bend} ${y2} ${x2} ${y2}`);
      edge.classList.toggle('is-running',state === 'running' && sequence[step] === to);
    });
    const a = nodes.executor, b = nodes.memory;
    svg.querySelector('[data-edge="executor-memory"]').setAttribute('d',`M${a.x + a.width/2} ${a.y + a.height}C${a.x + a.width/2} ${a.y + a.height + 32} ${b.x + b.width/2} ${b.y - 32} ${b.x + b.width/2} ${b.y}`);
  }
  function paintState() {
    const strings = copy[language];
    const running = state === 'running';
    runButton.innerHTML = `${icon(running?'pause':'play')}<span>${strings[running?'pause':state === 'paused'?'resume':'run']}</span>`;
    runButton.setAttribute('aria-pressed',String(running));
    status.textContent = strings[state] + (running ? ` · ${strings[sequence[step]]}` : '');
    element.dataset.runState = state; paintGraph();
  }
  function advance() {
    step += 1;
    if (step >= sequence.length) { state = 'finished'; paintState(); return; }
    paintState(); timer = setTimeout(advance,750);
  }
  runButton.addEventListener('click',() => {
    clearTimeout(timer);
    if (state === 'running') state = 'paused';
    else if (reduced.matches) { state = 'finished'; step = sequence.length; }
    else { if (state !== 'paused') step = -1; state = 'running'; advance(); return; }
    paintState();
  },{signal});
  element.querySelector('[data-demo-reset]').addEventListener('click',() => {
    clearTimeout(timer); state = 'idle'; step = -1; selected = 'planner';
    Object.entries(initial).forEach(([key,node]) => Object.assign(nodes[key],node)); paintState();
  },{signal});
  function point(event) { return new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.getScreenCTM().inverse()); }
  function moveNode(key,x,y) {
    nodes[key].x = Math.max(12,Math.min(x,(compact ? 388 : 948) - nodes[key].width));
    nodes[key].y = Math.max(12,Math.min(y,(compact ? 508 : 348) - nodes[key].height)); paintGraph();
  }
  svg.addEventListener('pointerdown',event => {
    const block = event.target.closest('[data-agent-node]');
    if (!block || event.button !== 0 || drag) return;
    const key = block.dataset.agentNode, cursor = point(event);
    selected = key; drag = {key,id:event.pointerId,dx:cursor.x - nodes[key].x,dy:cursor.y - nodes[key].y};
    block.focus({preventScroll:true}); svg.setPointerCapture(event.pointerId); paintGraph(); event.preventDefault();
  },{signal});
  svg.addEventListener('pointermove',event => {
    if (!drag || drag.id !== event.pointerId) return;
    const cursor = point(event); moveNode(drag.key,cursor.x - drag.dx,cursor.y - drag.dy);
  },{signal});
  const endDrag = event => {
    if (!drag || drag.id !== event.pointerId) return;
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
    drag = undefined;
  };
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => svg.addEventListener(type,endDrag,{signal}));
  svg.addEventListener('keydown',event => {
    const block = event.target.closest('[data-agent-node]');
    const delta = {ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
    if (!block || !delta) return;
    event.preventDefault(); selected = block.dataset.agentNode;
    const node = nodes[selected], distance = event.shiftKey ? 24 : 12;
    moveNode(selected,node.x + delta[0]*distance,node.y + delta[1]*distance);
  },{signal});
  function setLanguage(next) {
    language = next; updateCopy(element,language);
    const strings = copy[language]; element.setAttribute('aria-label',strings.graphTitle);
    element.querySelector('.rs-demo-graph').setAttribute('aria-label',strings.graphLabel);
    svg.querySelectorAll('[data-agent-node]').forEach(node => node.setAttribute('aria-label',`${strings[node.dataset.agentNode]}. ${strings.nodeHint}`));
    paintState();
  }
  const resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry.contentRect.width) return;
    const next = entry.contentRect.width < 640;
    if (next === compact) return;
    compact = next; initial = compact ? compactLayout : wideLayout;
    if (drag && svg.hasPointerCapture(drag.id)) svg.releasePointerCapture(drag.id);
    drag = undefined;
    Object.entries(initial).forEach(([key,node]) => Object.assign(nodes[key],node)); paintGraph();
  });
  resizeObserver.observe(element.querySelector('.rs-demo-graph'));
  setLanguage(language);
  return {key:'neurons',element,setLanguage,dispose() {clearTimeout(timer); resizeObserver.disconnect(); events.abort(); element.remove();}};
}

function createMiniInfosDemo(language) {
  const element = document.createElement('section'); element.className = 'rs-case-demo'; element.dataset.projectDemo = 'miniinfos';
  const events = new AbortController(), signal = events.signal;
  const samples = [
    {id:'claude',name:'Claude',window:51,week:9,today:128,context:24,reset:'3h 8min',weekReset:'6d 19h'},
    {id:'codex',name:'Codex',window:27,week:19,today:46.5,context:78,reset:'3h 42min',weekReset:'6d 17h'},
  ];
  element.innerHTML = `
    <header class="rs-case-demo-head"><div><h3 class="heading-6" data-demo-text="miniTitle"></h3><p class="body-6" data-demo-text="miniIntro"></p></div></header>
    <div class="rs-mini-demo-layout"><div class="rs-mini-demo-widget">
      <div class="rs-mini-demo-title title-3">${icon('windows')}<span>MiniInfos</span></div>
      <img class="rs-mini-demo-art" src="assets/miniinfos-widget-header.webp" alt="" width="1200" height="400" loading="lazy">
      <div class="rs-mini-demo-switch" role="group"><button type="button" class="button-sm" data-demo-provider="claude">Claude</button><button type="button" class="button-sm" data-demo-provider="codex">Codex</button><button type="button" class="button-sm" data-demo-provider="split" data-demo-text="split"></button></div>
      <div class="rs-mini-demo-columns">${samples.map(sample => `
        <section data-mini-provider="${sample.id}" aria-label="${sample.name}">
          <h4 class="title-3"><span class="rs-mini-ai-icon" aria-hidden="true">✳</span>${sample.name}</h4>
          ${['window','week'].map(kind => `<div class="rs-mini-demo-meter"><div class="caption-4"><span data-demo-text="${kind}"></span><b>${sample[kind]}%</b></div><div class="rs-mini-demo-track"><span style="--meter-fill:${sample[kind]}%"></span></div><p class="caption-4"><span data-demo-text="resetIn"></span> ${kind === 'window'?sample.reset:sample.weekReset}</p></div>`).join('')}
          <div class="rs-mini-demo-totals caption-4"><span data-demo-text="today"></span><strong data-mini-total="${sample.id}"></strong><span data-demo-text="currentContext"></span><strong>${sample.context}%</strong></div>
        </section>`).join('')}</div>
      <div class="rs-mini-demo-footer caption-4"><span data-demo-text="demo"></span><button type="button" class="button-sm" data-demo-reset>${icon('reset')}<span data-demo-text="reset"></span></button></div>
    </div><aside class="rs-mini-demo-guide">
      ${['switch','compare','reset'].map((key,index) => `<div><span class="rs-demo-step caption-4">0${index+1}</span><div><h4 class="title-3" data-demo-text="${key}Title"></h4><p class="body-6" data-demo-text="${key}Copy"></p></div></div>`).join('')}
      <p class="rs-demo-privacy body-6" data-demo-text="privacy"></p>
    </aside></div>`;
  let view = 'split';
  const columns = element.querySelector('.rs-mini-demo-columns');
  function select(next,animate = true) {
    view = next; element.dataset.miniView = view;
    element.querySelectorAll('[data-demo-provider]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.demoProvider === view)));
    columns.dataset.view = view;
    columns.querySelectorAll('[data-mini-provider]').forEach(provider => {
      provider.hidden = view !== 'split' && provider.dataset.miniProvider !== view;
      if (!provider.hidden && animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        provider.querySelectorAll('.rs-mini-demo-track span').forEach(bar => bar.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:700,easing:'cubic-bezier(0.22,1,0.36,1)'}));
      }
    });
  }
  element.querySelectorAll('[data-demo-provider]').forEach(button => button.addEventListener('click',() => select(button.dataset.demoProvider),{signal}));
  element.querySelector('[data-demo-reset]').addEventListener('click',() => select('split'),{signal});
  function setLanguage(next) {
    language = next; updateCopy(element,language);
    element.setAttribute('aria-label',copy[language].miniTitle);
    element.querySelector('[role="group"]').setAttribute('aria-label',copy[language].providers);
    samples.forEach(sample => { element.querySelector(`[data-mini-total="${sample.id}"]`).textContent = `${new Intl.NumberFormat(language === 'pt'?'pt-BR':'en',{maximumFractionDigits:1}).format(sample.today)} M`; });
  }
  setLanguage(language); select('split',false);
  return {key:'miniinfos',element,setLanguage,dispose() {events.abort(); element.remove();}};
}
