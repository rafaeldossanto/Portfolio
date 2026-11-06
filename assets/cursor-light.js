// One shared layer across all routes, outside panels that navigation hides.
const surface = document.querySelector('#rafael-portfolio .rs-stage');
if (surface) {
  const light = document.createElement('div');
  light.className = 'rs-cursor-light'; light.setAttribute('aria-hidden','true');
  surface.append(light);
  const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame = 0, x = 0, y = 0;
  const hide = () => { cancelAnimationFrame(frame); frame = 0; light.classList.remove('is-visible'); };
  surface.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !allowed.matches) { hide(); return; }
    x = event.clientX; y = event.clientY;
    if (!frame) frame = requestAnimationFrame(() => {
      light.style.setProperty('--cursor-x',`${x}px`); light.style.setProperty('--cursor-y',`${y}px`);
      light.classList.add('is-visible'); frame = 0;
    });
  });
  surface.addEventListener('pointerleave',hide);
  allowed.addEventListener('change',hide);
  window.addEventListener('blur',hide);
  document.addEventListener('visibilitychange',hide);
}
