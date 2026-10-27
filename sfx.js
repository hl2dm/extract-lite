'use strict';
// Tiny WebAudio synth – no audio files.
window.SFX=(function(){
  let ctx=null,master=null,rotor=null;
  function init(){if(ctx)return;try{ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=0.5;master.connect(ctx.destination)}catch(e){ctx=null}}
  function resume(){init();if(ctx&&ctx.state==='suspended')ctx.resume()}
  function tone(f,d,type,vol,slide,delay){if(!ctx)return;const t=ctx.currentTime+(delay||0);const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f*slide),t+d);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||0.2,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g);g.connect(master);o.start(t);o.stop(t+d+0.05)}
  let nbuf=null;function noiseBuf(){if(!nbuf){nbuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const a=nbuf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}return nbuf}
  function noise(d,vol,freq,q,delay){if(!ctx)return;const t=ctx.currentTime+(delay||0);const s=ctx.createBufferSource();s.buffer=noiseBuf();
    const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=freq||1000;f.Q.value=q||0.8;const g=ctx.createGain();
    g.gain.setValueAtTime(vol||0.3,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+d+0.05)}
  const ARP=[[523],[523,659],[523,659,784],[523,659,784,988],[523,659,784,1047,1319,1568]];
  return{
    resume,
    tick(){tone(1400,0.03,'square',0.03)},                       // spinner tick
    reveal(r){const n=ARP[r];n.forEach((f,i)=>tone(f,0.18+r*0.05,r>=3?'triangle':'sine',0.12+r*0.03,null,i*0.06));
      if(r===4){[1047,1319,1568,2093].forEach(f=>tone(f,1.2,'sawtooth',0.04,null,0.4));for(let i=0;i<8;i++)tone(2000+Math.random()*3000,0.08,'sine',0.05,null,0.4+i*0.07);noise(0.6,0.15,6000,0.5,0.35)}},
    pickup(){tone(660,0.06,'square',0.06,1.5)},
    shoot(){noise(0.12,0.5,900,0.6);tone(140,0.1,'sawtooth',0.15,0.4)},
    enemyShot(dist){const v=Math.max(0.05,0.35-dist/120);noise(0.15,v,600,0.7)},
    hit(head){tone(head?1900:1300,0.06,'square',0.08)},
    hurt(){tone(180,0.15,'sawtooth',0.15,0.5)},
    kill(){tone(880,0.12,'square',0.1,null,0);tone(1320,0.25,'square',0.1,null,0.08);noise(0.5,0.25,300,0.5)},
    reload(){tone(400,0.05,'square',0.06);tone(300,0.05,'square',0.06,null,0.6);tone(700,0.06,'square',0.07,null,1.2)},
    deny(){tone(200,0.15,'square',0.07,0.7)},
    holster(){tone(900,0.04,'square',0.08);tone(500,0.05,'square',0.07,null,0.08);noise(0.08,0.15,2500,1,0.05)},
    door(){noise(0.25,0.35,250,0.7);tone(90,0.2,'sine',0.25,0.6)},
    whoosh(){noise(1.2,0.35,500,0.4);noise(1.0,0.2,1800,0.6,0.15)},
    sting(){[523,659,784,1047].forEach((f,i)=>tone(f,0.5,'triangle',0.13,null,i*0.09));tone(1568,0.9,'sine',0.08,null,0.4);tone(131,0.8,'sawtooth',0.08,null,0)},
    unlock(){tone(520,0.08,'triangle',0.1);tone(780,0.12,'triangle',0.1,null,0.08)},
    cash(){tone(1568,0.06,'square',0.06);tone(2093,0.12,'square',0.06,null,0.06);noise(0.08,0.12,5000,1)},
    alarm(){for(let i=0;i<3;i++){tone(880,0.14,'square',0.07,null,i*0.3);tone(660,0.14,'square',0.07,null,i*0.3+0.15)}},
    extract(){[392,523,659,784].forEach((f,i)=>tone(f,0.3,'triangle',0.12,null,i*0.12))},
    rotor(level){ // continuous chop; level 0..1
      if(!ctx)return;
      if(!rotor){const s=ctx.createBufferSource();s.buffer=noiseBuf();s.loop=true;const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=380;
        const g=ctx.createGain();g.gain.value=0;const lfo=ctx.createOscillator();lfo.type='square';lfo.frequency.value=6;const lg=ctx.createGain();lg.gain.value=0;
        lfo.connect(lg);lg.connect(g.gain);s.connect(f);f.connect(g);g.connect(master);s.start();lfo.start();rotor={g,lg,lfo}}
      const t=ctx.currentTime;rotor.g.gain.setTargetAtTime(level*0.35,t,0.1);rotor.lg.gain.setTargetAtTime(level*0.3,t,0.1);rotor.lfo.frequency.setTargetAtTime(4+level*10,t,0.3)}
  };
})();
