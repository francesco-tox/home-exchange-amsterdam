(() => {
 const gallery=document.querySelector('[data-canal-gallery]');if(!gallery)return;
 const figures=[...gallery.querySelectorAll('.n-gallery-stage>.e-shot')];
 const thumbs=[...gallery.querySelectorAll('[data-canal-index]')];
 const rail=gallery.querySelector('.n-thumbnail-rail'),counter=gallery.querySelector('#canalPosition');
 if(!figures.length||figures.length!==thumbs.length)return;
 let current=0;
 function show(index,follow=false){
  current=(index+figures.length)%figures.length;
  figures.forEach((figure,i)=>{figure.hidden=i!==current;});
  thumbs.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
  const selected=figures[current].querySelector('img');
  selected.loading='eager';
  const selectedIndex=current;
  const warmNext=()=>{
   if(current!==selectedIndex)return;
   const next=figures[(current+1)%figures.length].querySelector('img');
   next.setAttribute('fetchpriority','low');next.loading='eager';
  };
  if(selected.complete&&selected.naturalWidth)warmNext();
  else selected.addEventListener('load',warmNext,{once:true});
  counter.textContent=String(current+1).padStart(2,'0')+' / '+String(figures.length).padStart(2,'0');
  if(follow){
   const button=thumbs[current],left=button.offsetLeft-rail.offsetLeft;
   if(left<rail.scrollLeft)rail.scrollLeft=left;
   else if(left+button.offsetWidth>rail.scrollLeft+rail.clientWidth)rail.scrollLeft=left+button.offsetWidth-rail.clientWidth;
  }
 }
 thumbs.forEach((button,index)=>button.addEventListener('click',()=>show(index)));
 gallery.querySelectorAll('[data-canal-step]').forEach(button=>button.addEventListener('click',()=>show(current+Number(button.dataset.canalStep),true)));
 gallery.addEventListener('keydown',event=>{
  if(!event.target.closest('button')||!['ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();show(current+(event.key==='ArrowRight'?1:-1),true);
 });
 gallery.classList.add('is-ready');show(0);
 gallery.querySelector('.n-gallery-controls').hidden=false;rail.hidden=false;
})();
