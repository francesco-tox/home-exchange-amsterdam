/* Native anchors stay usable without JavaScript. No reveal or scroll animation. */
(() => {
 const nav = document.querySelector('.p-section-nav');
 if (!nav) return;
 const header = document.querySelector('.e-header');
 const links = [...nav.querySelectorAll('a[href^="#"]')];
 const sections = links.map(link => document.getElementById(link.hash.slice(1)));
 const root = document.documentElement;
 let current = 0, queued = false;
 function select(index) {
  current = index;
  links.forEach((link, i) => i === index ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
 }
 function update() {
  queued = false;
  const headerHeight = header.getBoundingClientRect().height;
  const offset = headerHeight + nav.getBoundingClientRect().height + 16;
  root.style.setProperty('--p-header-height', headerHeight + 'px');
  root.style.setProperty('--p-anchor-offset', offset + 'px');
  const tops = sections.map(section => section.getBoundingClientRect().top);
  let next = 0, nearest = -Infinity;
  tops.forEach((top, i) => {
   if (top <= offset + 2 && top > nearest + 2) { next = i; nearest = top; }
  });
  // A short final section can be visible before its heading reaches the rail.
  if (window.scrollY + window.innerHeight >= root.scrollHeight - 2) next = links.length - 1;
  // Two columns may share a row; retain the link chosen for that row.
  if (Math.abs(tops[current] - tops[next]) <= 2) next = current;
  select(next);
 }
 function schedule() {
  if (!queued) { queued = true; requestAnimationFrame(update); }
 }
 nav.addEventListener('click', event => {
  const index = links.indexOf(event.target.closest('a'));
  if (index !== -1) select(index);
 });
 addEventListener('scroll', schedule, {passive:true});
 addEventListener('resize', schedule);
 addEventListener('hashchange', () => {
  const index = links.findIndex(link => link.hash === location.hash);
  if (index !== -1) select(index);
 });
 if ('ResizeObserver' in window) {
  const observer = new ResizeObserver(schedule);
  observer.observe(header); observer.observe(nav);
 }
 const index = links.findIndex(link => link.hash === location.hash);
 if (index !== -1) select(index);
 update();
})();
