(() => {
 const main=document.querySelector('.c-main');if(!main)return;
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(!preference.matches&&typeof Element.prototype.animate==='function'){
  const targets=[document.querySelector('.c-title h1'),document.querySelector('.c-title p'),...document.querySelectorAll('.c-portal')];
  const running=[];
  targets.forEach((element,index)=>{
   if(!element)return;
   const from={opacity:0,transform:'translate3d(0,18px,0)'},to={opacity:1,transform:'translate3d(0,0,0)'};
   if(element.classList.contains('c-portal')){from.clipPath='inset(0 0 14% 0)';to.clipPath='inset(0 0 0 0)';}
   running.push(element.animate([from,to],{duration:950,delay:index*100,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
  });
  preference.addEventListener?.('change',()=>{if(preference.matches)running.forEach(animation=>animation.cancel());});
 }
 // Real links remain usable without JavaScript; the standalone preview manages its own navigation.
 if(window.parent!==window)return;
 let leaving=false;
 document.querySelectorAll('.c-portal').forEach(link=>link.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||preference.matches||typeof main.animate!=='function')return;
  event.preventDefault();if(leaving)return;leaving=true;
  const animation=main.animate([{opacity:1},{opacity:0}],{duration:180,fill:'forwards',easing:'ease-out'});
  animation.finished.then(()=>window.location.assign(link.href),()=>window.location.assign(link.href));
 }));
 window.addEventListener('pageshow',event=>{if(event.persisted){main.getAnimations().forEach(animation=>animation.cancel());leaving=false;}});
})();
