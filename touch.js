'use strict';
// Virtual controls: left half = move stick, right half drag = look, buttons for fire/E/F/R.
window.TOUCH={move:{x:0,y:0},look:{dx:0,dy:0},firing:false,enabled:false};
(function(){
  const T=window.TOUCH;
  const coarse=window.matchMedia&&matchMedia('(pointer:coarse)').matches&&!matchMedia('(any-pointer:fine)').matches;
  const want=/[?&]touch=1/.test(location.search)||(!/[?&]touch=0/.test(location.search)&&coarse&&(('ontouchstart' in window)||navigator.maxTouchPoints>0));
  if(!want)return;T.enabled=true;document.body.classList.add('touch');
  const ui=document.getElementById('touchui');ui.classList.remove('hidden');
  const base=document.getElementById('stick'),knob=document.getElementById('knob');
  let stickId=null,lookId=null,sx=0,sy=0,lx=0,ly=0;
  const R=55;
  function key(code,down){window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code}))}
  ui.addEventListener('touchstart',e=>{
    for(const t of e.changedTouches){
      const b=t.target.closest&&t.target.closest('[data-btn]');
      if(b){const k=b.dataset.btn;b.classList.add('on');if(k==='fire')T.firing=true;else key(k,true);b._id=t.identifier;continue}
      if(t.clientX<innerWidth*0.45&&stickId===null){stickId=t.identifier;sx=t.clientX;sy=t.clientY;base.style.left=sx+'px';base.style.top=sy+'px';base.classList.add('on')}
      else if(t.clientX>=innerWidth*0.45&&lookId===null){lookId=t.identifier;lx=t.clientX;ly=t.clientY}
    }e.preventDefault()},{passive:false});
  ui.addEventListener('touchmove',e=>{
    for(const t of e.changedTouches){
      if(t.identifier===stickId){let dx=t.clientX-sx,dy=t.clientY-sy;const l=Math.hypot(dx,dy);if(l>R){dx*=R/l;dy*=R/l}
        knob.style.transform=`translate(${dx}px,${dy}px)`;T.move.x=dx/R;T.move.y=-dy/R}
      else if(t.identifier===lookId){T.look.dx+=t.clientX-lx;T.look.dy+=t.clientY-ly;lx=t.clientX;ly=t.clientY}
    }e.preventDefault()},{passive:false});
  function end(e){for(const t of e.changedTouches){
      if(t.identifier===stickId){stickId=null;T.move.x=T.move.y=0;knob.style.transform='';base.classList.remove('on')}
      if(t.identifier===lookId)lookId=null;
      ui.querySelectorAll('[data-btn]').forEach(b=>{if(b._id===t.identifier){b.classList.remove('on');b._id=null;if(b.dataset.btn==='fire')T.firing=false;else key(b.dataset.btn,false)}})
    }}
  ui.addEventListener('touchend',end);ui.addEventListener('touchcancel',end);
})();
