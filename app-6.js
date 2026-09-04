document.querySelectorAll(".key").forEach(b=>b.addEventListener("click",()=>{if(phase!=="question")return;if(input.length>=3)return;input+=b.textContent;answerText.textContent=input}));document.getElementById("clearBtn").addEventListener("click",()=>{input="";answerText.textContent="＿"});document.getElementById("okBtn").addEventListener("click",()=>{if(phase!=="question"||!currentProblem)return;if(input===""){feedback.className="feedback warn";feedback.textContent="数字を入れてね。";return}if(Number(input)===currentProblem.answer){phase="solved";correct()}else{feedback.className="feedback warn";feedback.textContent="おしい！もう一度考えてみよう。";input="";answerText.textContent="＿"}});document.getElementById("hintBtn").addEventListener("click",()=>{if(!currentProblem)return;feedback.className="feedback warn";feedback.textContent="ヒント："+currentProblem.hint});
document.querySelectorAll(".subjectBtn").forEach(btn=>btn.addEventListener("click",()=>{
  if(phase!=="idle")return;
  subjectMode=btn.dataset.subject;
  document.querySelectorAll(".subjectBtn").forEach(b=>b.classList.toggle("selected",b===btn));
  if(subjectMode==="graph"){
    setProblemKind("graph");
    drawLineGraph(["東神奈川","菊名","新横浜","町田","橋本"],[40,60,90,70,80],true);
    missionTitle.textContent="📈 折れ線グラフモード";
    promptEl.textContent="運転スタートでグラフ問題だけ出るよ。";
  }else if(subjectMode==="fraction"){
    setProblemKind("fraction");
    fractionExpr.textContent="1/4 ＋ 2/4";
    answerUnit.textContent="/4";
    missionTitle.textContent="🍕 分数モード";
    promptEl.textContent="同じ下の数どうしの、たし算・ひき算だよ。";
  }else if(subjectMode==="mix"){
    setProblemKind("angle");
    drawAngle(60,false);
    missionTitle.textContent="🎲 ミックスモード";
    promptEl.textContent="角度・グラフ・分数がランダムで出るよ。";
  }else{
    setProblemKind("angle");
    drawAngle(60,false);
    missionTitle.textContent="📐 角度モード";
    promptEl.textContent="三角定規や180°を使って角度を考えるよ。";
  }
}));
document.querySelectorAll(".modeBtn").forEach(btn=>btn.addEventListener("click",()=>{if(phase!=="idle")return;difficulty=btn.dataset.level;document.querySelectorAll(".modeBtn").forEach(b=>b.classList.toggle("selected",b===btn))}));
document.getElementById("startBtn").addEventListener("click",()=>{ensureAudio();if(phase==="idle")arrive()});document.getElementById("soundBtn").addEventListener("click",function(){ensureAudio();soundEnabled=!soundEnabled;this.textContent=soundEnabled?"🔊 音あり":"🔇 音なし"});document.getElementById("resetBtn").addEventListener("click",resetGame);window.addEventListener("resize",()=>{if(phase==="question"||phase==="solved")setConsistLeft(stoppedLeft(),false)});
function resetGame(){stationIndex=0;clearStations=0;phase="idle";input="";currentProblem=null;clearCount.textContent="0";currentStation.textContent=stations[0];stationSign.textContent=stations[0];statusEl.textContent="運転準備";missionTitle.textContent="運転スタートを押してね";promptEl.textContent="205系がやってくるよ。";answerText.textContent="＿";feedback.className="feedback";feedback.textContent="問題が出たらテンキーで答えよう。";setDoorOpen(false,false);passCounter.classList.remove("show");setConsistLeft(offscreenLeft(),false);if(speedBars){[...speedBars.querySelectorAll("i")].forEach(b=>b.classList.remove("on"));}if(speedText)speedText.textContent="0 km/h";difficulty="easy";subjectMode="angle";document.querySelectorAll(".modeBtn").forEach((b,i)=>b.classList.toggle("selected",i===0));document.querySelectorAll(".subjectBtn").forEach((b,i)=>b.classList.toggle("selected",i===0));setProblemKind("angle");drawAngle(60,false);renderRoute();updateStationBackground()}

/* v9: 小4の角度学習を「見た目当て」から、三角定規・一直線・一周を使って考える問題へ */
function clearAngleLearningLayer(showBase=true){
  const svg=angleDiagram.querySelector("svg");
  if(!svg)return null;
  const old=svg.querySelector("#angleLearningLayer");
  if(old)old.remove();
  const baseLine=svg.querySelector("line:not(#angleRay)");
  [baseLine,angleRay,angleArc,angleLabel].forEach(el=>{if(el)el.setAttribute("visibility",showBase?"visible":"hidden")});
  return svg;
}
function addAngleLearningLayer(markup){
  const svg=clearAngleLearningLayer(false);
  if(!svg)return;
  const g=document.createElementNS("http://www.w3.org/2000/svg","g");
  g.setAttribute("id","angleLearningLayer");
  g.innerHTML=markup;
  svg.appendChild(g);
}
function drawPlainAngle(deg,show){
  clearAngleLearningLayer(true);
  const cx=150,cy=130,r=91,rad=deg*Math.PI/180,x2=cx+Math.cos(-rad)*100,y2=cy+Math.sin(-rad)*100;
  angleRay.setAttribute("x2",x2);angleRay.setAttribute("y2",y2);
  const sx=cx+r,sy=cy,ex=cx+Math.cos(-rad)*r,ey=cy+Math.sin(-rad)*r,large=deg>180?1:0;
  angleArc.setAttribute("d",`M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`);
  angleLabel.textContent=show?deg+"°":"?";
}
function rulerTypeFor(angle,pairedAngle){
  if(angle===45)return "4545";
  if(angle===90&&pairedAngle===45)return "4545";
  return "3060";
}
function rulerMarkup(x,type,focus,tint){
  const y=118;
  if(type==="4545"){
    const labels=[
      {v:45,x:x+14,y:y-9},
      {v:90,x:x+62,y:y-9},
      {v:45,x:x+62,y:y-54}
    ];
    return `<polygon points="${x},${y} ${x+78},${y} ${x+78},${y-78}" fill="${tint}" fill-opacity=".22" stroke="${tint}" stroke-width="4"/>
      <path d="M ${x+62} ${y} L ${x+62} ${y-16} L ${x+78} ${y-16}" fill="none" stroke="${tint}" stroke-width="3"/>
      ${labels.map(o=>`<text x="${o.x}" y="${o.y}" font-size="${o.v===focus?17:13}" font-weight="${o.v===focus?900:700}" fill="${o.v===focus?"#d86416":"#52616b"}">${o.v}°</text>`).join("")}`;
  }
  const labels=[
    {v:30,x:x+12,y:y-8},
    {v:90,x:x+70,y:y-8},
    {v:60,x:x+64,y:y-42}
  ];
  return `<polygon points="${x},${y} ${x+88},${y} ${x+88},${y-51}" fill="${tint}" fill-opacity=".22" stroke="${tint}" stroke-width="4"/>
    <path d="M ${x+72} ${y} L ${x+72} ${y-16} L ${x+88} ${y-16}" fill="none" stroke="${tint}" stroke-width="3"/>
    ${labels.map(o=>`<text x="${o.x}" y="${o.y}" font-size="${o.v===focus?17:13}" font-weight="${o.v===focus?900:700}" fill="${o.v===focus?"#d86416":"#52616b"}">${o.v}°</text>`).join("")}`;
}
function drawRulerProblem(problem,show){
  const op=problem.visual==="ruler-sub"?"−":"+";
  const result=show?problem.answer+"°":"?°";
  const typeA=problem.rulerA||rulerTypeFor(problem.a,problem.b);
  const typeB=problem.rulerB||rulerTypeFor(problem.b,problem.a);
  addAngleLearningLayer(`
    <text x="150" y="18" text-anchor="middle" font-size="14" font-weight="900" fill="#315b70">三角定規の決まった角を使おう</text>
    ${rulerMarkup(18,typeA,problem.a,"#58a9cf")}
    <text x="150" y="91" text-anchor="middle" font-size="30" font-weight="900" fill="#21313a">${op}</text>
    ${rulerMarkup(190,typeB,problem.b,"#77b96c")}
    <rect x="67" y="135" width="166" height="22" rx="10" fill="#fff5cf" stroke="#e1b94b" stroke-width="2"/>
    <text x="150" y="151" text-anchor="middle" font-size="17" font-weight="900" fill="#21313a">${problem.a}° ${op} ${problem.b}° = ${result}</text>`);
}
function drawStraightProblem(problem,show){
  const known=problem.given;
  const answer=problem.answer;
  const theta=180-known;
  const rad=-theta*Math.PI/180;
  const x2=150+Math.cos(rad)*82,y2=112+Math.sin(rad)*82;
  const knownMid=(180-known/2)*Math.PI/180;
  const unknownMid=(theta/2)*Math.PI/180;
  const kx=150+Math.cos(-knownMid)*42,ky=112+Math.sin(-knownMid)*42;
  const ux=150+Math.cos(-unknownMid)*48,uy=112+Math.sin(-unknownMid)*48;
  addAngleLearningLayer(`
    <text x="150" y="18" text-anchor="middle" font-size="14" font-weight="900" fill="#315b70">一直線の角は 180°</text>
    <line x1="28" y1="112" x2="272" y2="112" stroke="#21313a" stroke-width="7" stroke-linecap="round"/>
    <line x1="150" y1="112" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#3d8a50" stroke-width="7" stroke-linecap="round"/>
    <circle cx="150" cy="112" r="6" fill="#21313a"/>
    <text x="${kx.toFixed(1)}" y="${ky.toFixed(1)}" text-anchor="middle" font-size="17" font-weight="900" fill="#d86416">${known}°</text>
    <text x="${ux.toFixed(1)}" y="${uy.toFixed(1)}" text-anchor="middle" font-size="22" font-weight="900" fill="#315b70">${show?answer+"°":"?"}</text>
    <rect x="72" y="135" width="156" height="22" rx="10" fill="#fff5cf" stroke="#e1b94b" stroke-width="2"/>
    <text x="150" y="151" text-anchor="middle" font-size="17" font-weight="900" fill="#21313a">180° − ${known}° = ${show?answer+"°":"?°"}</text>`);
}
function drawTwoStepProblem(problem,show){
  const result=show?problem.answer+"°":"?°";
  addAngleLearningLayer(`
    <text x="150" y="17" text-anchor="middle" font-size="14" font-weight="900" fill="#315b70">① 三角定規を足す → ② 180°から引く</text>
    ${rulerMarkup(23,rulerTypeFor(problem.a,problem.b),problem.a,"#58a9cf")}
    <text x="150" y="89" text-anchor="middle" font-size="27" font-weight="900" fill="#21313a">＋</text>
    ${rulerMarkup(190,rulerTypeFor(problem.b,problem.a),problem.b,"#77b96c")}
    <rect x="38" y="134" width="224" height="24" rx="10" fill="#fff5cf" stroke="#e1b94b" stroke-width="2"/>
    <text x="150" y="151" text-anchor="middle" font-size="15" font-weight="900" fill="#21313a">180° − (${problem.a}°＋${problem.b}°) = ${result}</text>`);
}
function drawFullTurnProblem(problem,show){
  const theta=problem.given;
  const rad=-theta*Math.PI/180;
  const x2=150+Math.cos(rad)*48,y2=78+Math.sin(rad)*48;
  addAngleLearningLayer(`
    <text x="150" y="17" text-anchor="middle" font-size="14" font-weight="900" fill="#315b70">一周の角は 360°</text>
    <circle cx="150" cy="76" r="49" fill="#e7f5ff" stroke="#315b70" stroke-width="4"/>
    <line x1="150" y1="76" x2="199" y2="76" stroke="#21313a" stroke-width="5" stroke-linecap="round"/>
    <line x1="150" y1="76" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#3d8a50" stroke-width="5" stroke-linecap="round"/>
    <text x="105" y="72" text-anchor="middle" font-size="16" font-weight="900" fill="#d86416">${problem.given}°</text>
    <text x="190" y="53" text-anchor="middle" font-size="20" font-weight="900" fill="#315b70">${show?problem.answer+"°":"?"}</text>
    <rect x="70" y="135" width="160" height="22" rx="10" fill="#fff5cf" stroke="#e1b94b" stroke-width="2"/>
    <text x="150" y="151" text-anchor="middle" font-size="16" font-weight="900" fill="#21313a">360° − ${problem.given}° = ${show?problem.answer+"°":"?°"}</text>`);
}
function drawAngle(deg,show){
  if(currentProblem&&currentProblem.kind==="angle"){
    if(currentProblem.visual==="ruler-add"||currentProblem.visual==="ruler-sub"){drawRulerProblem(currentProblem,show);return}
    if(currentProblem.visual==="straight"){drawStraightProblem(currentProblem,show);return}
    if(currentProblem.visual==="two-step"){drawTwoStepProblem(currentProblem,show);return}
    if(currentProblem.visual==="full-turn"){drawFullTurnProblem(currentProblem,show);return}
  }
  drawPlainAngle(deg,show);
}
function makeAngleProblem(){
  if(difficulty==="easy"){
    const q=pick([
      {a:30,b:45,answer:75},
      {a:30,b:60,answer:90},
      {a:45,b:45,answer:90,rulerA:"4545",rulerB:"4545"},
      {a:60,b:45,answer:105},
      {a:30,b:30,answer:60}
    ]);
    return{kind:"angle",visual:"ruler-add",...q,title:"📐 三角定規でたし算",prompt:`三角定規の ${q.a}° と ${q.b}° を合わせると何度？`,hint:`${q.a} + ${q.b} を計算しよう。三角定規の角は30°・45°・60°・90°だよ。`};
  }
  if(difficulty==="normal"){
    if(Math.random()<.5){
      const q=pick([
        {a:90,b:30,answer:60,rulerA:"3060",rulerB:"3060"},
        {a:90,b:45,answer:45,rulerA:"4545",rulerB:"4545"},
        {a:60,b:30,answer:30,rulerA:"3060",rulerB:"3060"}
      ]);
      return{kind:"angle",visual:"ruler-sub",...q,title:"📐 三角定規でひき算",prompt:`${q.a}° から ${q.b}° を引くと何度？`,hint:`${q.a} − ${q.b} を計算しよう。図の三角定規の角も見てね。`};
    }
    const given=pick([30,45,60,75,90,120]);
    return{kind:"angle",visual:"straight",given,answer:180-given,title:"📐 一直線の残り",prompt:`一直線は180°。${given}°のとなりの角は何度？`,hint:`180 − ${given} を計算しよう。`};
  }
  const type=pick(["two-step","two-step","full-turn","estimate"]);
  if(type==="two-step"){
    const q=pick([{a:30,b:45},{a:30,b:60},{a:45,b:45},{a:60,b:45}]);
    const sum=q.a+q.b;
    return{kind:"angle",visual:"two-step",a:q.a,b:q.b,answer:180-sum,title:"📐 2段階チャレンジ",prompt:`180° から (${q.a}°＋${q.b}°) を引くと何度？`,hint:`まず ${q.a}+${q.b}=${sum}。つぎに 180−${sum} を計算しよう。`};
  }
  if(type==="full-turn"){
    const given=pick([210,225,240,270]);
    return{kind:"angle",visual:"full-turn",given,answer:360-given,title:"📐 一周の残り",prompt:`一周360°から${given}°を引いた残りは何度？`,hint:`360 − ${given} を計算しよう。`};
  }
  const answer=pick([75,105,120,135,150]);
  return{kind:"angle",visual:"estimate",answer,draw:answer,title:"📐 目測チャレンジ",prompt:"90°と180°を手がかりに、この角度を予想しよう。",hint:"まず90°より大きいか小さいか。次に180°の半分や三角定規の角を手がかりにしよう。"};
}
function makeProblem(){
  const isSag=stations[stationIndex]==="相模原";
  let kind=subjectMode;
  if(subjectMode==="mix")kind=pick(["angle","graph","fraction"]);
  if(isSag&&difficulty==="hard"&&kind==="angle"){
    const q=pick([
      {kind:"angle",visual:"two-step",a:30,b:45,answer:105,title:"⭐ 相模原チャレンジ",prompt:"180°から(30°＋45°)を引くと何度？",hint:"30+45=75。そのあと180−75を計算しよう。"},
      {kind:"angle",visual:"straight",given:75,answer:105,title:"⭐ 相模原チャレンジ",prompt:"一直線180°で、75°のとなりは何度？",hint:"180−75を計算しよう。"},
      {kind:"angle",visual:"full-turn",given:210,answer:150,title:"⭐ 相模原チャレンジ",prompt:"一周360°から210°を引いた残りは何度？",hint:"360−210を計算しよう。"}
    ]);
    return q;
  }
  if(kind==="graph")return makeGraphProblem();
  if(kind==="fraction")return makeFractionProblem();
  return makeAngleProblem();
}
resetGame();
