"use strict";
const stations=["東神奈川","菊名","新横浜","小机","中山","長津田","町田","相模原","橋本","八王子"];
let stationIndex=0,clearStations=0,phase="idle",input="",currentProblem=null,soundEnabled=true,audioContext=null,difficulty="easy",subjectMode="angle";
const scene=document.getElementById("scene"),stationBackdrop=document.getElementById("stationBackdrop"),consist=document.getElementById("consist"),frontCar=document.getElementById("frontCar"),doorCamera=document.getElementById("doorCamera"),camState=document.getElementById("camState"),statusEl=document.getElementById("status"),stationSign=document.getElementById("stationSign"),currentStation=document.getElementById("currentStation"),clearCount=document.getElementById("clearCount"),routeMap=document.getElementById("routeMap"),missionTitle=document.getElementById("missionTitle"),promptEl=document.getElementById("prompt"),answerText=document.getElementById("answerText"),feedback=document.getElementById("feedback"),angleRay=document.getElementById("angleRay"),angleArc=document.getElementById("angleArc"),angleLabel=document.getElementById("angleLabel"),angleDiagram=document.getElementById("angleDiagram"),graphDiagram=document.getElementById("graphDiagram"),graphSvg=document.getElementById("graphSvg"),fractionDiagram=document.getElementById("fractionDiagram"),fractionExpr=document.getElementById("fractionExpr"),angleChip=document.getElementById("angleChip"),graphChip=document.getElementById("graphChip"),fractionChip=document.getElementById("fractionChip"),answerUnit=document.getElementById("answerUnit"),sparkles=document.getElementById("sparkles"),challenge=document.getElementById("challenge"),passCounter=document.getElementById("passCounter"),doorImpact=document.getElementById("doorImpact"),speedBars=document.getElementById("speedBars"),speedText=document.getElementById("speedText");
function ensureAudio(){if(!audioContext){const C=window.AudioContext||window.webkitAudioContext;if(C)audioContext=new C()}if(audioContext&&audioContext.state==="suspended")audioContext.resume()}
function tone(freq,start,dur,vol=.07){if(!soundEnabled||!audioContext)return;const o=audioContext.createOscillator(),g=audioContext.createGain();o.type="sine";o.frequency.value=freq;g.gain.setValueAtTime(.0001,audioContext.currentTime+start);g.gain.exponentialRampToValueAtTime(vol,audioContext.currentTime+start+.02);g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+start+dur);o.connect(g);g.connect(audioContext.destination);o.start(audioContext.currentTime+start);o.stop(audioContext.currentTime+start+dur+.03)}
function setDoorOpen(isOpen,animateClose=true){
  clearTimeout(setDoorOpen._timer);
  clearTimeout(setDoorOpen._stateTimer);
  clearTimeout(setDoorOpen._impactTimer);
  clearTimeout(setDoorOpen._soundTimer);
  clearTimeout(setDoorOpen._bounceTimer);
  clearTimeout(setDoorOpen._sealTimer);
  frontCar.classList.remove("door-sealed","door-impact","door-bounce");
  doorCamera.classList.remove("door-sealed","door-impact","door-bounce");
  doorImpact.classList.remove("show");
  if(isOpen){
    frontCar.classList.remove("door-closing");
    doorCamera.classList.remove("door-closing");
    camState.textContent="UNLOCK";
    setDoorOpen._timer=setTimeout(()=>{
      frontCar.classList.add("open");
      doorCamera.classList.add("open");
      setDoorOpen._stateTimer=setTimeout(()=>camState.textContent="OPEN",950);
    },140);
    return;
  }
  if(!animateClose){
    frontCar.classList.remove("open","door-closing","door-impact","door-bounce","door-sealed");
    doorCamera.classList.remove("open","door-closing","door-impact","door-bounce","door-sealed");
    camState.textContent="CLOSED";
    return;
  }
  camState.textContent="DOOR";
  setDoorOpen._timer=setTimeout(()=>{
    pneumaticDoorSound();
    frontCar.classList.add("door-closing");
    doorCamera.classList.add("door-closing");
    camState.textContent="CLOSING";
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      frontCar.classList.remove("open");
      doorCamera.classList.remove("open");
    }));
    setDoorOpen._soundTimer=setTimeout(()=>{doorImpactSound();},900);
    setDoorOpen._impactTimer=setTimeout(()=>{
      frontCar.classList.add("door-impact");
      doorCamera.classList.add("door-impact");
      doorImpact.classList.remove("show");
      void doorImpact.offsetWidth;
      doorImpact.classList.add("show");
      setDoorOpen._bounceTimer=setTimeout(()=>{
        frontCar.classList.remove("door-impact");
        doorCamera.classList.remove("door-impact");
        frontCar.classList.add("door-bounce");
        doorCamera.classList.add("door-bounce");
      },120);
      setDoorOpen._sealTimer=setTimeout(()=>{
        frontCar.classList.remove("door-bounce","door-closing");
        doorCamera.classList.remove("door-bounce","door-closing");
        frontCar.classList.add("door-sealed");
        doorCamera.classList.add("door-sealed");
        camState.textContent="CLOSED";
        setTimeout(()=>{
          frontCar.classList.remove("door-sealed");
          doorCamera.classList.remove("door-sealed");
        },220);
      },300);
    },1120);
  },230);
}
function pneumaticDoorSound(){
  if(!soundEnabled)return;
  ensureAudio();
  if(!audioContext)return;
  const now=audioContext.currentTime;
  const duration=.48;
  const buffer=audioContext.createBuffer(1,Math.floor(audioContext.sampleRate*duration),audioContext.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++){
    const t=i/data.length;
    const env=Math.pow(1-t,1.7);
    data[i]=(Math.random()*2-1)*env;
  }
  const src=audioContext.createBufferSource();
  const filter=audioContext.createBiquadFilter();
  const gain=audioContext.createGain();
  filter.type="bandpass";
  filter.frequency.setValueAtTime(1500,now);
  filter.Q.setValueAtTime(.65,now);
  gain.gain.setValueAtTime(.001,now);
  gain.gain.linearRampToValueAtTime(.09,now+.035);
  gain.gain.exponentialRampToValueAtTime(.001,now+duration);
  src.buffer=buffer;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  src.start(now);
}
function doorImpactSound(){
  if(!soundEnabled || !audioContext)return;
  const now=audioContext.currentTime;
  const o=audioContext.createOscillator(),g=audioContext.createGain();
  o.type="triangle";o.frequency.setValueAtTime(105,now);o.frequency.exponentialRampToValueAtTime(58,now+.16);
  g.gain.setValueAtTime(.22,now);g.gain.exponentialRampToValueAtTime(.001,now+.2);
  o.connect(g);g.connect(audioContext.destination);o.start(now);o.stop(now+.21);
  const o2=audioContext.createOscillator(),g2=audioContext.createGain();
  o2.type="square";o2.frequency.setValueAtTime(210,now+.02);o2.frequency.exponentialRampToValueAtTime(120,now+.09);
  g2.gain.setValueAtTime(.07,now+.02);g2.gain.exponentialRampToValueAtTime(.001,now+.12);
  o2.connect(g2);g2.connect(audioContext.destination);o2.start(now+.02);o2.stop(now+.13);
}
function arrivalSound(){ensureAudio();tone(440,0,.18);tone(523,.2,.18);tone(659,.4,.35)}
function correctSound(){ensureAudio();tone(660,0,.15);tone(880,.14,.2);tone(1100,.3,.23)}
function departureSound(){
  if(!soundEnabled)return;
  ensureAudio();
  if(!audioContext)return;
  const ctx=audioContext,now=ctx.currentTime;
  const o=ctx.createOscillator(),g=ctx.createGain();
  const p=ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  o.type="sawtooth";
  o.frequency.setValueAtTime(78,now);
  o.frequency.exponentialRampToValueAtTime(145,now+2.2);
  g.gain.setValueAtTime(.001,now);
  g.gain.linearRampToValueAtTime(.045,now+.15);
  g.gain.exponentialRampToValueAtTime(.001,now+2.4);
  if(p){
    p.pan.setValueAtTime(-.12,now);
    p.pan.linearRampToValueAtTime(.38,now+2.4);
    o.connect(g);g.connect(p);p.connect(ctx.destination);
  }else{
    o.connect(g);g.connect(ctx.destination);
  }
  o.start(now);o.stop(now+2.45);
}
function stationChord(freqs,start,duration,volume=.015){freqs.forEach((f,i)=>stationBellTone(f,start+i*.012,duration,volume));}