(() => {
 // A single decorative opening for the whole page. Content stays still.
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 if(preference.matches||typeof Element.prototype.animate!=='function'||location.hash||window.scrollY>24)return;
 const navigation=performance.getEntriesByType?.('navigation')[0];
 if(navigation?.type==='back_forward')return;
 let panel,animation,timer;
 const events=['pointerdown','wheel','touchstart','keydown'];
 function clear(){
  clearTimeout(timer);animation?.cancel();panel?.remove();
  events.forEach(name=>window.removeEventListener(name,clear,true));
  window.removeEventListener('pagehide',clear);
  window.removeEventListener('resize',clear);
  preference.removeEventListener?.('change',onPreference);
 }
 function onPreference(){if(preference.matches)clear();}
 try{
  panel=document.createElement('div');panel.className='p-page-panel';panel.setAttribute('aria-hidden','true');
  const header=document.querySelector('.e-header');
  panel.style.setProperty('--p-panel-top',Math.max(0,header?.getBoundingClientRect().bottom||0)+'px');
  document.body.append(panel);
  events.forEach(name=>window.addEventListener(name,clear,{capture:true,passive:true}));
  window.addEventListener('pagehide',clear,{once:true});
  window.addEventListener('resize',clear,{once:true});
  preference.addEventListener?.('change',onPreference);
  timer=setTimeout(clear,1800);
  animation=panel.animate([
   {transform:'translate3d(0,0,0)'},
   {transform:'translate3d(101%,0,0)'}
  ],{duration:1200,easing:'cubic-bezier(.45,0,.2,1)',fill:'forwards'});
  animation.finished.then(clear,clear);
 }catch{clear();}
})();
