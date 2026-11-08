"use strict";
const stations=["東神奈川","菊名","新横浜","小机","中山","長津田","町田","相模原","橋本","八王子"];
let stationIndex=0,clearStations=0,phase="idle",input="",currentProblem=null,soundEnabled=true,audioContext=null,difficulty="easy",subjectMode="angle";
const scene=document.getElementById("scene"),stationBackdrop=document.getElementById("stationBackdrop"),consist=document.getElementById("consist"),frontCar=document.getElementById("frontCar"),doorCamera=document.getElementById("doorCamera"),camState=document.getElementById("camState"),statusEl=document.getElementById("status"),stationSign=document.getElementById("stationSign"),currentStation=document.getElementById("currentStation"),clearCount=document.getElementById("clearCount"),routeMap=document.getElementById("routeMap"),missionTitle=document.getElementById("missionTitle"),promptEl=document.getElementById("prompt"),answerText=document.getElementById("answerText"),feedback=document.getElementById("feedback"),angleRay=document.getElementById("angleRay"),angleArc=document.getElementById("angleArc"),angleLabel=document.getElementById("angleLabel"),angleDiagram=document.getElementById("angleDiagram"),graphDiagram=document.getElementById("graphDiagram"),graphSvg=document.getElementById("graphSvg"),fractionDiagram=document.getElementById("fractionDiagram"),fractionExpr=document.getElementById("fractionExpr"),angleChip=document.getElementById("angleChip"),graphChip=document.getElementById("graphChip"),fractionChip=document.getElementById("fractionChip"),answerUnit=document.getElementById("answerUnit"),sparkles=document.getElementById("sparkles"),challenge=document.getElementById("challenge"),passCounter=document.getElementById("passCounter"),doorImpact=document.getElementById("doorImpact"),speedBars=document.getElementById("speedBars"),speedText=document.getElementById("speedText");
const stationAnnouncements={
  approach:new Audio("audio/approach-announcement.mp3"),
  departure:new Audio("audio/departure-announcement.mp3")
};
Object.values(stationAnnouncements).forEach(audio=>{audio.preload="auto";audio.volume=.9});
const departureMelodies=[
  new Audio("audio/JRE-IKST-017-01.wav"),
  new Audio("audio/JRE-IKST-017-02.wav")
];
departureMelodies.forEach(audio=>{audio.preload="auto";audio.volume=.85});
let activeDepartureMelody=null;
let queuedDepartureMelody=null;
let activeStationAnnouncement=null;
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
  const duration=.82;
  const buffer=audioContext.createBuffer(1,Math.floor(audioContext.sampleRate*duration),audioContext.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++){
    const t=i/data.length;
    const env=Math.sin(Math.PI*t)*Math.pow(1-t,.25);
    data[i]=(Math.random()*2-1)*env;
  }
  const src=audioContext.createBufferSource();
  const highpass=audioContext.createBiquadFilter();
  const lowpass=audioContext.createBiquadFilter();
  const gain=audioContext.createGain();
  highpass.type="highpass";
  highpass.frequency.setValueAtTime(260,now);
  lowpass.type="lowpass";
  lowpass.frequency.setValueAtTime(1900,now);
  gain.gain.setValueAtTime(.001,now);
  gain.gain.linearRampToValueAtTime(.055,now+.08);
  gain.gain.exponentialRampToValueAtTime(.001,now+duration);
  src.buffer=buffer;
  src.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(audioContext.destination);
  src.start(now);
}
function doorImpactSound(){
  if(!soundEnabled || !audioContext)return;
  const now=audioContext.currentTime;
  const o=audioContext.createOscillator(),g=audioContext.createGain();
  o.type="sine";o.frequency.setValueAtTime(92,now);o.frequency.exponentialRampToValueAtTime(54,now+.13);
  g.gain.setValueAtTime(.001,now);g.gain.linearRampToValueAtTime(.075,now+.008);g.gain.exponentialRampToValueAtTime(.001,now+.17);
  o.connect(g);g.connect(audioContext.destination);o.start(now);o.stop(now+.21);
  const o2=audioContext.createOscillator(),g2=audioContext.createGain();
  o2.type="triangle";o2.frequency.setValueAtTime(520,now+.012);o2.frequency.exponentialRampToValueAtTime(240,now+.065);
  g2.gain.setValueAtTime(.001,now+.012);g2.gain.linearRampToValueAtTime(.025,now+.018);g2.gain.exponentialRampToValueAtTime(.001,now+.09);
  o2.connect(g2);g2.connect(audioContext.destination);o2.start(now+.012);o2.stop(now+.1);
}
function arrivalSound(){ensureAudio();tone(440,0,.18);tone(523,.2,.18);tone(659,.4,.35)}
function playDepartureChime(){
  if(!soundEnabled||!audioContext)return;
  const ctx=audioContext,now=ctx.currentTime;
  const master=ctx.createGain(),filter=ctx.createBiquadFilter();
  filter.type="lowpass";
  filter.frequency.setValueAtTime(5200,now);
  filter.Q.setValueAtTime(.55,now);
  master.gain.setValueAtTime(.42,now);
  filter.connect(master);
  master.connect(ctx.destination);
  const echo=ctx.createDelay(.2),echoGain=ctx.createGain();
  echo.delayTime.setValueAtTime(.09,now);
  echoGain.gain.setValueAtTime(.16,now);
  echo.connect(echoGain);
  echoGain.connect(filter);
  const notes=[[783.99,0,-.18],[987.77,.17,0],[1174.66,.34,.18],[1567.98,.56,0]];
  notes.forEach(([frequency,offset,pan])=>{
    [[1,.10,.42],[2.01,.027,.29],[3.92,.008,.17]].forEach(([partial,volume,duration])=>{
      const oscillator=ctx.createOscillator(),gain=ctx.createGain();
      const panner=ctx.createStereoPanner?ctx.createStereoPanner():null;
      const start=now+offset;
      oscillator.type="sine";
      oscillator.frequency.setValueAtTime(frequency*partial,start);
      gain.gain.setValueAtTime(.0001,start);
      gain.gain.exponentialRampToValueAtTime(volume,start+.007);
      gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
      if(panner){
        panner.pan.setValueAtTime(pan,start);
        oscillator.connect(gain);gain.connect(panner);panner.connect(filter);panner.connect(echo);
      }else{
        oscillator.connect(gain);gain.connect(filter);gain.connect(echo);
      }
      oscillator.start(start);
      oscillator.stop(start+duration+.02);
    });
  });
}
function playDepartureMelodyNote(ctx,now,frequency,offset,duration,pan,dry,delayL,delayR){
  const start=now+offset;
  const panner=ctx.createStereoPanner?ctx.createStereoPanner():null;
  const voiceFilter=ctx.createBiquadFilter();
  voiceFilter.type="lowpass";
  voiceFilter.frequency.setValueAtTime(Math.min(7200,frequency*7),start);
  voiceFilter.Q.setValueAtTime(.45,start);
  if(panner){
    panner.pan.setValueAtTime(pan,start);
    voiceFilter.connect(panner);
    panner.connect(dry);
    panner.connect(delayL);
    panner.connect(delayR);
  }else{
    voiceFilter.connect(dry);
    voiceFilter.connect(delayL);
    voiceFilter.connect(delayR);
  }
  [[1,"triangle",.075],[2,"sine",.018],[3,"sine",.005]].forEach(([partial,type,volume])=>{
    const oscillator=ctx.createOscillator();
    const gain=ctx.createGain();
    const attack=start+.009;
    const settle=start+.045;
    const release=start+duration;
    oscillator.type=type;
    oscillator.frequency.setValueAtTime(frequency*partial*1.003,start);
    oscillator.frequency.exponentialRampToValueAtTime(frequency*partial,settle);
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.exponentialRampToValueAtTime(volume,attack);
    gain.gain.exponentialRampToValueAtTime(volume*.68,settle);
    gain.gain.exponentialRampToValueAtTime(.0001,release);
    oscillator.connect(gain);
    gain.connect(voiceFilter);
    oscillator.start(start);
    oscillator.stop(release+.025);
  });
}
function stopStationAnnouncement(){
  if(!activeStationAnnouncement)return;
  activeStationAnnouncement.audio.pause();
  activeStationAnnouncement.audio.currentTime=0;
  activeStationAnnouncement.finish();
}
function stopDepartureMelody(){
  if(!activeDepartureMelody)return;
  activeDepartureMelody.pause();
  activeDepartureMelody.currentTime=0;
  activeDepartureMelody=null;
}
function playDepartureAudio(){
  if(!soundEnabled)return;
  stopDepartureMelody();
  const audio=queuedDepartureMelody||departureMelodies[departureMelodyVariant++%departureMelodies.length];
  queuedDepartureMelody=null;
  activeDepartureMelody=audio;
  audio.currentTime=0;
  audio.play()?.catch(error=>{
    if(activeDepartureMelody!==audio||!soundEnabled)return;
    console.error("Failed to play departure melody",error);
    if(phase!=="idle"){feedback.className="feedback warn";feedback.textContent="発車メロディーを再生できませんでした。"}
  });
}
function unlockDepartureMelody(){
  if(!soundEnabled)return;
  const audio=departureMelodies[departureMelodyVariant++%departureMelodies.length];
  queuedDepartureMelody=audio;
  audio.muted=true;
  audio.currentTime=0;
  const playback=audio.play();
  if(!playback){
    audio.pause();
    audio.currentTime=0;
    audio.muted=false;
    return;
  }
  playback.then(()=>{
    audio.pause();
    audio.currentTime=0;
    audio.muted=false;
  }).catch(error=>{
    audio.muted=false;
    console.error("Failed to unlock departure melody",error);
  });
}
function unlockStationAnnouncement(kind){
  if(!soundEnabled)return;
  const audio=stationAnnouncements[kind];
  audio.muted=true;
  audio.currentTime=0;
  const playback=audio.play();
  if(!playback){
    audio.pause();
    audio.currentTime=0;
    audio.muted=false;
    return;
  }
  playback.then(()=>{
    audio.pause();
    audio.currentTime=0;
    audio.muted=false;
  }).catch(error=>{
    audio.muted=false;
    console.error(`Failed to unlock ${kind} station announcement`,error);
  });
}
function playStationAnnouncement(kind){
  stopStationAnnouncement();
  if(!soundEnabled)return Promise.resolve();
  const audio=stationAnnouncements[kind];
  return new Promise(resolve=>{
    let finished=false;
    const cleanup=()=>{audio.removeEventListener("ended",finish);audio.removeEventListener("error",onError);clearTimeout(timeout)};
    const finish=()=>{if(finished)return;finished=true;cleanup();if(activeStationAnnouncement?.audio===audio)activeStationAnnouncement=null;resolve()};
    const onError=()=>{console.error(`Failed to play ${kind} station announcement`,audio.error);if(phase!=="idle"){feedback.className="feedback warn";feedback.textContent="駅の放送を再生できませんでした。"}finish()};
    const timeout=setTimeout(onError,15000);
    activeStationAnnouncement={audio,finish};
    audio.addEventListener("ended",finish,{once:true});
    audio.addEventListener("error",onError,{once:true});
    try{
      audio.currentTime=0;
      audio.play()?.catch(error=>{console.error(`Failed to play ${kind} station announcement`,error);if(phase!=="idle"){feedback.className="feedback warn";feedback.textContent="駅の放送を再生できませんでした。"}finish()});
    }catch(error){
      console.error(`Failed to play ${kind} station announcement`,error);
      if(phase!=="idle"){feedback.className="feedback warn";feedback.textContent="駅の放送を再生できませんでした。"}
      finish();
    }
  });
}
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