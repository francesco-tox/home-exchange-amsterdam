(() => {
 // Progressive enhancement: content remains visible if animation is unavailable.
 try{if(document.body.classList.contains('e-home')){
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(!preference.matches&&typeof Element.prototype.animate==='function'){
   const running=new Set();let observer;
   const reveal=(element,delay=0,cover=false)=>{
    if(!element||preference.matches)return;
    const from={opacity:0,transform:'translate3d(0,24px,0)'},to={opacity:1,transform:'translate3d(0,0,0)'};
    if(cover){from.clipPath='inset(0 0 12% 0)';to.clipPath='inset(0 0 0 0)';}
    const animation=element.animate([from,to],{duration:cover?1100:800,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    running.add(animation);
    animation.finished.then(()=>running.delete(animation),()=>running.delete(animation));
   };
   reveal(document.querySelector('.e-home-intro h1'));
   reveal(document.querySelector('.e-hero-aside'),110);
   reveal(document.querySelector('.e-cover'),190,true);
   if('IntersectionObserver'in window){
    observer=new IntersectionObserver(entries=>{
     entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const element=entry.target;
      const delay=element.classList.contains('e-shot')?Math.min([...element.parentElement.children].indexOf(element)*90,180):0;
      reveal(element,delay);observer.unobserve(element);
     });
    },{threshold:.05,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.p-section-head,.e-home .e-shot,.e-home .e-footer-top').forEach(element=>observer.observe(element));
   }
   preference.addEventListener?.('change',()=>{
    if(!preference.matches)return;
    observer?.disconnect();running.forEach(animation=>animation.cancel());running.clear();
   });
  }
 }}catch{ /* Animation must never block navigation, photographs or content. */ }
 const toggle=document.getElementById('navToggle'),nav=document.getElementById('navLinks');
 if(toggle&&nav){
  if(!document.body.classList.contains('e-other'))toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
  nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});
 }
 document.querySelectorAll('[data-e-gallery]').forEach(gallery=>{
  if(gallery.dataset.layout==='stack')return;
  const items=[...gallery.querySelectorAll('.e-shot')];let lastWidth=0,pending=0;
  const layout=(force=false)=>{
   const width=gallery.clientWidth;if(!width||(!force&&Math.abs(width-lastWidth)<1))return;lastWidth=width;
   const visible=items.filter(e=>!e.hidden),gap=width<650?10:14,target=width<650?185:Number(gallery.dataset.target)||290;
   const ratios=visible.map(e=>Number(e.dataset.ratio)),n=ratios.length,memo=new Map();
   const plan=i=>{
    if(i===n)return {cost:0,rows:[]};if(memo.has(i))return memo.get(i);let best=null,sum=0;
    for(let end=i;end<Math.min(i+(width<650?2:5),n);end++){
     sum+=ratios[end];const count=end-i+1,height=(width-gap*(count-1))/sum;
     if(height<=0)continue;
     const min=width<650?115:165,max=width<650?290:420;
     let cost=((height-target)/target)**2;
     if(height<min)cost+=((min-height)/min)**2*12;
     if(height>max)cost+=((height-max)/max)**2*12;
     if(count===1&&ratios[i]<.9)cost+=2;
     const rest=plan(end+1);cost+=rest.cost;
     if(!best||cost<best.cost)best={cost,rows:[{start:i,end,height},...rest.rows]};
    }
    memo.set(i,best);return best;
   };
   const fragment=document.createDocumentFragment();
   for(const group of plan(0).rows){
    const row=document.createElement('div');row.className='e-photo-row';
    const height=(group.start===group.end&&group.end===n-1)?Math.min(group.height,target):group.height;
    for(let j=group.start;j<=group.end;j++){
     const item=visible[j],button=item.querySelector('.e-photo-link');
     item.style.width=(height*ratios[j])+'px';button.style.height=height+'px';row.append(item);
    }
    fragment.append(row);
   }
   gallery.replaceChildren(fragment);
  };
  const schedule=()=>{if(!pending)pending=requestAnimationFrame(()=>{pending=0;layout();});};
  new ResizeObserver(schedule).observe(gallery);layout(true);
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
   const filter=button.dataset.filter;
   items.forEach(item=>{item.hidden=filter!=='all'&&item.dataset.kind!==filter;});
   document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   const count=items.filter(i=>!i.hidden).length,output=document.querySelector('.e-album-count');
   if(output)output.textContent=count+' photographs';layout(true);
  }));
 });
 const dialog=document.getElementById('eLightbox');if(!dialog)return;
 const image=dialog.querySelector('img'),caption=document.getElementById('eImageCaption'),counter=document.getElementById('eImageCount');
 let photos=[],index=0,sourceButton=null,touchX=null,touchY=null;
 const show=()=>{const button=photos[index],original=button.querySelector('img');image.src=button.dataset.full||original.src;image.alt=original.alt;caption.textContent=button.closest('figure').querySelector('figcaption')?.textContent||original.alt;counter.textContent=String(index+1).padStart(2,'0')+' / '+String(photos.length).padStart(2,'0');};
 document.addEventListener('click',e=>{
  const button=e.target.closest('.e-photo-link');if(!button)return;sourceButton=button;
  const gallery=button.closest('[data-e-gallery]');photos=[...gallery.querySelectorAll('.e-photo-link')];index=photos.indexOf(button);show();dialog.showModal();document.documentElement.style.overflow='hidden';
 });
 const next=direction=>{index=(index+direction+photos.length)%photos.length;show();};
 dialog.addEventListener('click',e=>{const action=e.target.closest('[data-viewer]')?.dataset.viewer;if(action==='close'||e.target===dialog)dialog.close();else if(action==='prev')next(-1);else if(action==='next')next(1);});
 dialog.addEventListener('close',()=>{document.documentElement.style.overflow='';image.removeAttribute('src');sourceButton?.focus({preventScroll:true});});
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();next(-1);}if(e.key==='ArrowRight'){e.preventDefault();next(1);}});
 image.addEventListener('pointerdown',e=>{touchX=e.clientX;touchY=e.clientY;});
 image.addEventListener('pointerup',e=>{if(touchX!==null&&Math.abs(e.clientX-touchX)>50&&Math.abs(e.clientY-touchY)<50)next(e.clientX<touchX?1:-1);touchX=null;touchY=null;});
})();
