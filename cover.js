(() => {
 const main=document.querySelector('.c-main');if(!main)return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)'),links=[...document.querySelectorAll('.c-portal')];
 const opening=[],curtains=[];let finished=true,safetyTimer=0,waitTimer=0,leaving=false;
 const easing='cubic-bezier(.22,1,.36,1)';
 function finishOpening(){
  if(finished)return;finished=true;clearTimeout(safetyTimer);clearTimeout(waitTimer);
  opening.forEach(animation=>animation.cancel());curtains.forEach(panel=>panel.remove());
  document.body.removeAttribute('data-opening');
 }
 function add(element,keyframes,duration,delay){
  if(!element)return;
  const animation=element.animate(keyframes,{duration,delay,easing,fill:'both'});
  animation.pause();animation.currentTime=0;opening.push(animation);
 }
 if(!preference.matches&&typeof Element.prototype.animate==='function'){
  finished=false;document.body.setAttribute('data-opening','true');
  safetyTimer=setTimeout(finishOpening,2200);
  try{
   add(document.querySelector('.c-title h1'),[
    {opacity:0,transform:'translate3d(-14px,0,0)',clipPath:'inset(-12% 100% -12% 0%)'},
    {opacity:1,transform:'translate3d(0,0,0)',clipPath:'inset(-12% -2% -12% -2%)'}
   ],900,40);
   add(document.querySelector('.c-title p'),[
    {opacity:0,transform:'translate3d(-10px,0,0)',clipPath:'inset(-12% 100% -12% 0%)'},
    {opacity:1,transform:'translate3d(0,0,0)',clipPath:'inset(-12% -2% -12% -2%)'}
   ],800,180);
   links.forEach((link,index)=>{
    const panel=document.createElement('span');panel.className='c-curtain';panel.setAttribute('aria-hidden','true');link.append(panel);curtains.push(panel);
    add(panel,[{transform:'translateX(0)'},{transform:'translateX('+(index===0?'-101':'101')+'%)'}],1120,140+index*90);
    add(link.querySelector('img'),[{transform:'scale(1.035)'},{transform:'scale(1)'}],1300,100);
    add(link.querySelector('.c-portal-label'),[{opacity:0,transform:'translate3d(-7px,0,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],430,820+index*80);
   });
   const images=links.map(link=>{const image=link.querySelector('img');return image?.decode?image.decode().catch(()=>{}):Promise.resolve();});
   const ready=Promise.allSettled([...images,document.fonts?.ready??Promise.resolve()]);
   Promise.race([ready,new Promise(resolve=>{waitTimer=setTimeout(resolve,300);})]).then(()=>{
    if(finished)return;clearTimeout(waitTimer);
    const start=document.timeline.currentTime;
    opening.forEach(animation=>{animation.play();animation.startTime=start;});
    Promise.allSettled(opening.map(animation=>animation.finished)).then(finishOpening);
   }).catch(finishOpening);
  }catch{finishOpening();}
 }
 preference.addEventListener?.('change',()=>{if(preference.matches)finishOpening();});
 window.addEventListener('pagehide',finishOpening);
 window.addEventListener('pageshow',event=>{if(event.persisted){finishOpening();main.getAnimations().forEach(animation=>animation.cancel());leaving=false;}});
 if(window.parent!==window)return;
 links.forEach(link=>link.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||preference.matches||typeof main.animate!=='function')return;
  event.preventDefault();if(leaving)return;leaving=true;finishOpening();
  const animation=main.animate([{opacity:1},{opacity:0}],{duration:180,fill:'forwards',easing:'ease-out'});
  animation.finished.then(()=>location.assign(link.href),()=>location.assign(link.href));
 }));
})();
