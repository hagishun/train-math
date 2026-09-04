function newProblem(){
  input="";
  answerText.textContent="＿";
  feedback.className="feedback";
  feedback.textContent="テンキーで答えを入れよう。";
  currentProblem=makeProblem();
  missionTitle.textContent=currentProblem.title;
  promptEl.textContent=currentProblem.prompt;
  if(currentProblem.kind==="graph"){
    setProblemKind("graph");
    drawLineGraph(currentProblem.graphLabels,currentProblem.graphValues,currentProblem.showValues);
  }else if(currentProblem.kind==="fraction"){
    setProblemKind("fraction");
    fractionExpr.textContent=currentProblem.expr;
    answerUnit.textContent=`/${currentProblem.denominator}`;
  }else{
    setProblemKind("angle");
    drawAngle(currentProblem.draw,false);
  }
  if(stations[stationIndex]==="相模原"){
    challenge.classList.add("show");
    setTimeout(()=>challenge.classList.remove("show"),1300);
  }
}
function updateStationBackground(){
  const st=stations[stationIndex];
  stationBackdrop.className="stationBackdrop";
  stationBackdrop.innerHTML="";
  const city=document.createElement("div");
  city.className="city";
  const heights=[42,68,53,84,61,74,48];
  heights.forEach((h,i)=>{const b=document.createElement("i");b.className="building";b.style.left=(i*15)+"%";b.style.width="12%";b.style.height=h+"%";city.appendChild(b)});
  stationBackdrop.appendChild(city);
  if(st==="菊名"){
    stationBackdrop.innerHTML+=`<div class="bgTrack"></div><div class="bgTrain secondary" style="--bgstripe:#d94a67;animation-duration:9s"><span class="bgWin"></span><span class="bgWin"></span><span class="bgWin"></span><b class="bgLabel">東急東横線</b></div>`;
  }else if(st==="新横浜"){
    stationBackdrop.classList.add("shinkansen");
    stationBackdrop.innerHTML+=`<div class="bgTrack"></div><div class="bgTrain"><span class="bgWin"></span><span class="bgWin"></span><span class="bgWin"></span><b class="bgLabel">新幹線</b></div>`;
  }else if(st==="八王子"){
    stationBackdrop.classList.add("chuo","hachiko");
    stationBackdrop.innerHTML+=`<div class="bgTrack"></div><div class="bgTrain"><span class="bgWin"></span><span class="bgWin"></span><span class="bgWin"></span><b class="bgLabel">中央線</b></div><div class="bgTrain secondary"><span class="bgWin"></span><span class="bgWin"></span><b class="bgLabel">八高線</b></div>`;
  }else if(st==="東神奈川"){
    stationBackdrop.innerHTML+=`<div class="bgTrack"></div><div class="bgTrain secondary" style="--bgstripe:#63b7d5"><span class="bgWin"></span><span class="bgWin"></span><span class="bgWin"></span><b class="bgLabel">京浜東北線</b></div>`;
  }else if(st==="町田"){
    stationBackdrop.innerHTML+=`<div class="bgTrack"></div><div class="bgTrain secondary" style="--bgstripe:#2457a7"><span class="bgWin"></span><span class="bgWin"></span><span class="bgWin"></span><b class="bgLabel">小田急線</b></div>`;
  }
}
function carStep(){const car=consist.querySelector(".car");return car.getBoundingClientRect().width+4}
function stoppedLeft(){const step=carStep();const carWidth=step-4;const desiredFrontEdge=Math.min(scene.clientWidth*.88,scene.clientWidth-24);return Math.round(desiredFrontEdge-(step*9+carWidth))}
function offscreenLeft(){return Math.round(-carStep()*10-80)}
function setConsistLeft(px,animate=true,duration="2.5s",easing="cubic-bezier(.18,.72,.18,1)"){consist.style.transition=animate?`left ${duration} ${easing}`:"none";consist.style.left=px+"px"}
function arrive(){phase="arriving";updateStationBackground();setDoorOpen(false,false);passCounter.classList.remove("show");statusEl.textContent="まもなく到着";missionTitle.textContent="205系が入線します";promptEl.textContent=stations[stationIndex]+"駅に到着";feedback.textContent="先頭車が止まるまで見てね。";setConsistLeft(offscreenLeft(),false);void consist.offsetWidth;setTimeout(()=>{setConsistLeft(stoppedLeft(),true,"3.2s")},80);setTimeout(()=>{arrivalSound();phase="question";statusEl.textContent="停車中";newProblem()},3400)}
function showSparkles(){sparkles.innerHTML="";[[16,65],[28,42],[43,72],[57,38],[69,67],[81,45],[90,70]].forEach((p,i)=>{const s=document.createElement("span");s.textContent=i%2?"⭐":"✨";s.style.left=p[0]+"%";s.style.top=p[1]+"%";s.style.animationDelay=i*.07+"s";sparkles.append(s)});sparkles.classList.add("show");setTimeout(()=>sparkles.classList.remove("show"),1200)}
function departurePass(){
  phase="departing";statusEl.textContent="発車";missionTitle.textContent="205系 発車！";promptEl.textContent="ゆっくり発車して、だんだん速くなるよ";departureSound();passCounter.classList.add("show");
  let passed=1;passCounter.textContent=`10両編成 通過中：${passed} / 10`;
  const bars=[...speedBars.querySelectorAll("i")];bars.forEach(b=>b.classList.remove("on"));speedText.textContent="0 km/h";
  const step=carStep();const start=performance.now();const duration=Math.max(9000,step*10/0.48);setConsistLeft(scene.clientWidth+60,true,(duration/1000)+"s","cubic-bezier(.48,0,1,1)");
  const timer=setInterval(()=>{const elapsed=Math.min(duration,performance.now()-start);const t=elapsed/duration;const progress=t*t;passed=Math.min(10,1+Math.floor(progress*10));passCounter.textContent=`10両編成 通過中：${passed} / 10`;const kmh=Math.round(32*progress);speedText.textContent=`${kmh} km/h`;const lit=Math.min(6,Math.ceil(progress*6));bars.forEach((b,i)=>b.classList.toggle("on",i<lit));if(elapsed>=duration)clearInterval(timer)},90);
  setTimeout(()=>{passCounter.classList.remove("show");bars.forEach(b=>b.classList.remove("on"));speedText.textContent="0 km/h";clearStations++;clearCount.textContent=clearStations;if(stationIndex>=stations.length-1){phase="finished";statusEl.textContent="終点";missionTitle.textContent="🎉 横浜線 全駅クリア！";promptEl.textContent="205系、運転成功！";feedback.className="feedback good";feedback.textContent="10両編成で八王子まで到着！";renderRoute();return}stationIndex++;currentStation.textContent=stations[stationIndex];stationSign.textContent=stations[stationIndex];renderRoute();setTimeout(arrive,600)},duration+250);
}
function correct(){
  correctSound();feedback.className="feedback good";feedback.textContent="正解！ドアが開きます。";if(currentProblem.kind==="angle")drawAngle(currentProblem.answer,true);setDoorOpen(true);statusEl.textContent="ドア開";if(stations[stationIndex]==="相模原")showSparkles();
  setTimeout(()=>{statusEl.textContent="♪ 発車メロディー";feedback.textContent="♪ 発車メロディーが流れています";const melodyMs=playDepartureMelody();setTimeout(()=>{setDoorOpen(false,true);statusEl.textContent="ドア閉";feedback.textContent="ドアが閉まりました。まもなく発車！";setTimeout(departurePass,1800)},melodyMs)},1200);
}