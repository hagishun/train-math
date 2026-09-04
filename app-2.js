function playOriginalDepartureMelody(){
  ensureAudio();
  if(!soundEnabled || !audioContext)return 7100;
  const ctx=audioContext;
  const now=ctx.currentTime;
  const master=ctx.createGain();
  master.gain.setValueAtTime(.17,now);
  master.connect(ctx.destination);
  const dry=ctx.createGain();
  dry.gain.setValueAtTime(.82,now);
  dry.connect(master);
  const delayL=ctx.createDelay(.5);
  const delayR=ctx.createDelay(.5);
  delayL.delayTime.setValueAtTime(.07,now);
  delayR.delayTime.setValueAtTime(.12,now);
  const echoGainL=ctx.createGain();
  const echoGainR=ctx.createGain();
  echoGainL.gain.setValueAtTime(.18,now);
  echoGainR.gain.setValueAtTime(.13,now);
  const panL=ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  const panR=ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  if(panL && panR){
    panL.pan.setValueAtTime(-.72,now);
    panR.pan.setValueAtTime(.72,now);
    delayL.connect(echoGainL);echoGainL.connect(panL);panL.connect(master);
    delayR.connect(echoGainR);echoGainR.connect(panR);panR.connect(master);
  }else{
    delayL.connect(echoGainL);echoGainL.connect(master);
    delayR.connect(echoGainR);echoGainR.connect(master);
  }
  const notes=[
    [659.25,.00,.34],[783.99,.36,.34],[880.00,.72,.34],[783.99,1.08,.34],
    [659.25,1.44,.42],[587.33,1.90,.34],[659.25,2.28,.34],[698.46,2.66,.34],
    [783.99,3.04,.48],[659.25,3.56,.34],[587.33,3.94,.34],[523.25,4.32,.55],
    [587.33,4.92,.34],[659.25,5.30,.34],[698.46,5.68,.34],[659.25,6.06,.68]
  ];
  notes.forEach((n,i)=>{
    const [freq,offset,dur]=n;
    const o=ctx.createOscillator();
    const g=ctx.createGain();
    const p=ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    o.type="triangle";
    o.frequency.setValueAtTime(freq,now+offset);
    g.gain.setValueAtTime(.001,now+offset);
    g.gain.linearRampToValueAtTime(.10,now+offset+.025);
    g.gain.exponentialRampToValueAtTime(.001,now+offset+dur);
    if(p){
      const pos=(i%4<2)?-.30:.30;
      p.pan.setValueAtTime(pos,now+offset);
      o.connect(g);g.connect(p);p.connect(dry);
      p.connect(delayL);p.connect(delayR);
    }else{
      o.connect(g);g.connect(dry);
      g.connect(delayL);g.connect(delayR);
    }
    o.start(now+offset);
    o.stop(now+offset+dur+.03);
  });
  [.18,.31,.44].forEach((dt,idx)=>{
    const d=ctx.createDelay(.6);
    const gg=ctx.createGain();
    d.delayTime.setValueAtTime(dt,now);
    gg.gain.setValueAtTime(.05/(idx+1),now);
    dry.connect(d);d.connect(gg);gg.connect(master);
  });
  return 7100;
}
function playSpringBoxStyleMelody(){
  ensureAudio();
  if(!soundEnabled || !audioContext)return 6900;
  const ctx=audioContext;
  const now=ctx.currentTime;
  const master=ctx.createGain();
  master.gain.setValueAtTime(.16,now);
  master.connect(ctx.destination);
  const dry=ctx.createGain();
  dry.gain.setValueAtTime(.80,now);
  dry.connect(master);
  const delayL=ctx.createDelay(.5);
  const delayR=ctx.createDelay(.5);
  delayL.delayTime.setValueAtTime(.065,now);
  delayR.delayTime.setValueAtTime(.125,now);
  const egL=ctx.createGain(), egR=ctx.createGain();
  egL.gain.setValueAtTime(.16,now);
  egR.gain.setValueAtTime(.12,now);
  const pL=ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  const pR=ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  if(pL && pR){
    pL.pan.setValueAtTime(-.72,now);
    pR.pan.setValueAtTime(.72,now);
    delayL.connect(egL); egL.connect(pL); pL.connect(master);
    delayR.connect(egR); egR.connect(pR); pR.connect(master);
  }else{
    delayL.connect(egL); egL.connect(master);
    delayR.connect(egR); egR.connect(master);
  }
  const notes=[
    [523.25,0.00,.22],[659.25,.24,.22],[783.99,.48,.28],[659.25,.78,.22],
    [587.33,1.04,.22],[698.46,1.28,.22],[880.00,1.52,.34],[783.99,1.88,.22],
    [659.25,2.14,.22],[783.99,2.38,.22],[987.77,2.62,.30],[880.00,2.96,.22],
    [783.99,3.22,.22],[698.46,3.46,.22],[659.25,3.70,.40],
    [587.33,4.14,.22],[659.25,4.38,.22],[783.99,4.62,.26],[880.00,4.90,.26],
    [783.99,5.20,.22],[698.46,5.44,.22],[659.25,5.68,.22],[523.25,5.92,.56]
  ];
  notes.forEach((n,i)=>{
    const [freq,offset,dur]=n;
    const o=ctx.createOscillator();
    const g=ctx.createGain();
    const p=ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    o.type="sine";
    o.frequency.setValueAtTime(freq,now+offset);
    g.gain.setValueAtTime(.001,now+offset);
    g.gain.linearRampToValueAtTime(.11,now+offset+.015);
    g.gain.exponentialRampToValueAtTime(.001,now+offset+dur);
    if(p){
      const pos=(i%6<3)?-.26:.26;
      p.pan.setValueAtTime(pos,now+offset);
      o.connect(g); g.connect(p); p.connect(dry);
      p.connect(delayL); p.connect(delayR);
    }else{
      o.connect(g); g.connect(dry);
      g.connect(delayL); g.connect(delayR);
    }
    o.start(now+offset);
    o.stop(now+offset+dur+.03);
    const o2=ctx.createOscillator();
    const g2=ctx.createGain();
    o2.type="triangle";
    o2.frequency.setValueAtTime(freq*2,now+offset);
    g2.gain.setValueAtTime(.001,now+offset);
    g2.gain.linearRampToValueAtTime(.025,now+offset+.01);
    g2.gain.exponentialRampToValueAtTime(.001,now+offset+Math.min(dur,.18));
    o2.connect(g2); g2.connect(dry);
    o2.start(now+offset);
    o2.stop(now+offset+Math.min(dur,.2)+.02);
  });
  [.16,.28,.40].forEach((dt,idx)=>{
    const d=ctx.createDelay(.6);
    const gg=ctx.createGain();
    d.delayTime.setValueAtTime(dt,now);
    gg.gain.setValueAtTime(.045/(idx+1),now);
    dry.connect(d); d.connect(gg); gg.connect(master);
  });
  return 6900;
}