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
  const phraseDuration=7.1;
  const fullNotes=notes.concat(notes.map(([freq,offset,dur])=>[freq,offset+phraseDuration,dur]));
  fullNotes.forEach((n,i)=>{
    const [freq,offset,dur]=n;
    const pos=(i%5<3)?-.20:.20;
    playDepartureMelodyNote(ctx,now,freq,offset,dur,pos,dry,delayL,delayR);
  });
  [.18,.32,.46].forEach((dt,idx)=>{
    const d=ctx.createDelay(.6);
    const gg=ctx.createGain();
    d.delayTime.setValueAtTime(dt,now);
    gg.gain.setValueAtTime(.042/(idx+1),now);
    dry.connect(d); d.connect(gg); gg.connect(master);
  });
  return 14600;
}
let departureMelodyVariant=0;
function playGlassBellNote(ctx,start,frequency,duration,volume,pan,dry,send){
  const out=ctx.createGain();
  out.gain.setValueAtTime(volume,start);
  const panner=ctx.createStereoPanner?ctx.createStereoPanner():null;
  if(panner){panner.pan.setValueAtTime(pan,start);out.connect(panner);panner.connect(dry);panner.connect(send)}
  else{out.connect(dry);out.connect(send)}
  [[1,1,duration],[3,.08,duration*.4],[6.003,.85,duration*.55],[7.996,.75,duration*.45]].forEach(([ratio,level,ring])=>{
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    const end=start+Math.max(.12,ring);
    osc.type="sine";
    osc.frequency.setValueAtTime(frequency*ratio,start);
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.exponentialRampToValueAtTime(level,start+.005);
    gain.gain.exponentialRampToValueAtTime(.0001,end);
    osc.connect(gain);
    gain.connect(out);
    osc.start(start);
    osc.stop(end+.03);
  });
}
function playStationReferenceStyleMelody(){
  ensureAudio();
  if(!soundEnabled || !audioContext)return 13000;
  const ctx=audioContext;
  const now=ctx.currentTime+.03;
  const step=.205;
  const master=ctx.createGain();
  master.gain.setValueAtTime(.16,now);
  master.connect(ctx.destination);
  const speaker=ctx.createBiquadFilter();
  speaker.type="highpass";
  speaker.frequency.setValueAtTime(110,now);
  speaker.connect(master);
  const dry=ctx.createGain();
  dry.gain.setValueAtTime(.85,now);
  dry.connect(speaker);
  const send=ctx.createGain();
  send.gain.setValueAtTime(.3,now);
  [[.11,-.6,.5],[.23,.6,.35],[.37,-.3,.22]].forEach(([time,pan,level])=>{
    const delay=ctx.createDelay(.6);
    const gain=ctx.createGain();
    const panner=ctx.createStereoPanner?ctx.createStereoPanner():null;
    delay.delayTime.setValueAtTime(time,now);
    gain.gain.setValueAtTime(level,now);
    send.connect(delay);
    delay.connect(gain);
    if(panner){panner.pan.setValueAtTime(pan,now);gain.connect(panner);panner.connect(speaker)}
    else gain.connect(speaker);
  });
  const hz={"D#4":311.13,E4:329.63,"F#4":369.99,"G#4":415.3,A4:440,B4:493.88,"C#5":554.37,"D#5":622.25,E5:659.25};
  const phrases=[
    [["B4",1],["G#4",1],["E4",1],["G#4",1],["B4",1],["C#5",1],["B4",1],["A4",1],["G#4",1],["F#4",1],["G#4",2],[null,2]],
    [["B4",1],["G#4",1],["E4",1],["G#4",1],["B4",1],["E5",1],["D#5",1],["C#5",1],["B4",1],["C#5",1],["A4",2],[null,2]],
    [["C#5",1],["B4",1],["A4",1],["F#4",1],["A4",1],["B4",1],["G#4",1],["E4",1],["F#4",1],["G#4",1],["A4",2],[null,2]],
    [["B4",2],["F#4",2],["D#4",2],["E4",8]]
  ];
  let beat=0;
  phrases.flat().forEach(([note,length],i)=>{
    if(note){
      const ring=length>=8?2.4:Math.max(.5,length*step*2.2);
      playGlassBellNote(ctx,now+beat*step,hz[note],ring,.22,i%2?.18:-.18,dry,send);
    }
    beat+=length;
  });
  const bass=[[82.41,0],[82.41,4],[123.47,8],[82.41,12],[82.41,14],[69.3,18],[110,22],[123.47,26],[110,28],[92.5,32],[82.41,36],[110,40],[123.47,42],[123.47,46],[82.41,48]];
  bass.forEach(([freq,at],i)=>{
    const start=now+at*step;
    const length=i===bass.length-1?2.8:Math.min(.85,((bass[i+1]?.[1]??at+4)-at)*step);
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type="triangle";
    osc.frequency.setValueAtTime(freq,start);
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.exponentialRampToValueAtTime(.07,start+.015);
    gain.gain.exponentialRampToValueAtTime(.0001,start+length);
    osc.connect(gain);
    gain.connect(dry);
    osc.start(start);
    osc.stop(start+length+.03);
  });
  return 13000;
}
