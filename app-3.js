function playVerdeRayoStyleMelody(){
  ensureAudio();
  if(!soundEnabled || !audioContext)return 7200;
  const ctx=audioContext;
  const now=ctx.currentTime;
  const master=ctx.createGain();
  master.gain.setValueAtTime(.155,now);
  master.connect(ctx.destination);
  const dry=ctx.createGain();
  dry.gain.setValueAtTime(.80,now);
  dry.connect(master);
  const delayL=ctx.createDelay(.5);
  const delayR=ctx.createDelay(.5);
  delayL.delayTime.setValueAtTime(.075,now);
  delayR.delayTime.setValueAtTime(.135,now);
  const egL=ctx.createGain(), egR=ctx.createGain();
  egL.gain.setValueAtTime(.15,now);
  egR.gain.setValueAtTime(.12,now);
  const pL=ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  const pR=ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  if(pL && pR){
    pL.pan.setValueAtTime(-.7,now);
    pR.pan.setValueAtTime(.7,now);
    delayL.connect(egL); egL.connect(pL); pL.connect(master);
    delayR.connect(egR); egR.connect(pR); pR.connect(master);
  }else{
    delayL.connect(egL); egL.connect(master);
    delayR.connect(egR); egR.connect(master);
  }
  const notes=[
    [587.33,0.00,.28],[659.25,.30,.28],[739.99,.60,.30],[880.00,.92,.38],
    [783.99,1.34,.28],[739.99,1.64,.28],[659.25,1.94,.38],
    [698.46,2.36,.26],[783.99,2.64,.26],[880.00,2.92,.30],[987.77,3.24,.42],
    [880.00,3.70,.28],[783.99,4.00,.28],[698.46,4.30,.34],
    [659.25,4.68,.26],[739.99,4.96,.26],[783.99,5.24,.30],[880.00,5.56,.30],
    [783.99,5.90,.26],[739.99,6.18,.26],[659.25,6.46,.58]
  ];
  notes.forEach((n,i)=>{
    const [freq,offset,dur]=n;
    const o=ctx.createOscillator();
    const g=ctx.createGain();
    const p=ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    o.type="sine";
    o.frequency.setValueAtTime(freq,now+offset);
    g.gain.setValueAtTime(.001,now+offset);
    g.gain.linearRampToValueAtTime(.095,now+offset+.02);
    g.gain.exponentialRampToValueAtTime(.001,now+offset+dur);
    if(p){
      const pos=(i%5<3)?-.22:.22;
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
    o2.frequency.setValueAtTime(freq*1.5,now+offset);
    g2.gain.setValueAtTime(.001,now+offset);
    g2.gain.linearRampToValueAtTime(.018,now+offset+.015);
    g2.gain.exponentialRampToValueAtTime(.001,now+offset+Math.min(dur,.22));
    o2.connect(g2); g2.connect(dry);
    o2.start(now+offset);
    o2.stop(now+offset+Math.min(dur,.24)+.02);
  });
  [.18,.32,.46].forEach((dt,idx)=>{
    const d=ctx.createDelay(.6);
    const gg=ctx.createGain();
    d.delayTime.setValueAtTime(dt,now);
    gg.gain.setValueAtTime(.042/(idx+1),now);
    dry.connect(d); d.connect(gg); gg.connect(master);
  });
  return 7200;
}
let departureMelodyVariant=0;