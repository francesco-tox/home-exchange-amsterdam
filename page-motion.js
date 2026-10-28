(() => {
 // Animate visible content only; the unenhanced page always remains readable.
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 if(preference.matches||typeof Element.prototype.animate!=='function')return;
 const running=new Set(),seen=new WeakSet();let observer;
 const easing='cubic-bezier(.22,1,.36,1)';
 function reveal(element,kind='section',delay=0){
  if(!element||seen.has(element)||preference.matches)return;
  seen.add(element);
  let from={opacity:0,transform:'translate3d(0,14px,0)'},to={opacity:1,transform:'translate3d(0,0,0)'},duration=650;
  if(kind==='title'){
   from={opacity:0,transform:'translate3d(-10px,0,0)',clipPath:'inset(-12% 100% -12% 0%)'};
   to={opacity:1,transform:'translate3d(0,0,0)',clipPath:'inset(-12% -2% -12% -2%)'};duration=800;
  }else if(kind==='photo'){
   from={opacity:.5,clipPath:'inset(0 100% 0 0)'};
   to={opacity:1,clipPath:'inset(0 0% 0 0)'};duration=950;
  }
  try{
   const animation=element.animate([from,to],{duration,delay,easing,fill:'backwards'});
   running.add(animation);
   animation.finished.then(()=>{running.delete(animation);animation.cancel();},()=>running.delete(animation));
  }catch{/* Motion must never interrupt the gallery or form. */}
 }
 reveal(document.querySelector('main h1'),'title');
 document.querySelectorAll('.e-apartment-note,.i-heading>p,.i-contact-intro>p,.x-intro,.x-eyebrow,.x-discover').forEach((element,index)=>reveal(element,'section',70+Math.min(index*45,135)));
 const hero=document.querySelector('.e-cover img,.x-hero-photo img');
 reveal(hero,'photo',100);
 if('IntersectionObserver'in window){
  observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const element=entry.target;
    reveal(element,element.classList.contains('e-shot')?'photo':'section');
    observer.unobserve(element);
   });
  },{threshold:.06,rootMargin:'0px 0px -20px 0px'});
  document.querySelectorAll('.e-album-toolbar,.e-shot,.e-stay-heading,.e-amenities>div,.n-gallery-heading,.i-section-title,.i-places>li,.i-transit>h2,.i-transit-intro,.i-transit-grid>div,.i-transit-links,.i-history-intro,.x-destinations,.x-agreements>h2,.i-agreements>div,.i-form-row,.i-form>.i-field,.i-form-actions').forEach(element=>observer.observe(element));
 }
 function clear(){observer?.disconnect();running.forEach(animation=>animation.cancel());running.clear();}
 preference.addEventListener?.('change',()=>{if(preference.matches)clear();});
 window.addEventListener('pagehide',clear);
})();
