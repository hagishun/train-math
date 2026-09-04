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
    promptEl.textContent="運転スタートで角度問題だけ出るよ。";
  }
}));
document.querySelectorAll(".modeBtn").forEach(btn=>btn.addEventListener("click",()=>{if(phase!=="idle")return;difficulty=btn.dataset.level;document.querySelectorAll(".modeBtn").forEach(b=>b.classList.toggle("selected",b===btn))}));
document.getElementById("startBtn").addEventListener("click",()=>{ensureAudio();if(phase==="idle")arrive()});document.getElementById("soundBtn").addEventListener("click",function(){ensureAudio();soundEnabled=!soundEnabled;this.textContent=soundEnabled?"🔊 音あり":"🔇 音なし"});document.getElementById("resetBtn").addEventListener("click",resetGame);window.addEventListener("resize",()=>{if(phase==="question"||phase==="solved")setConsistLeft(stoppedLeft(),false)});
function resetGame(){stationIndex=0;clearStations=0;phase="idle";input="";currentProblem=null;clearCount.textContent="0";currentStation.textContent=stations[0];stationSign.textContent=stations[0];statusEl.textContent="運転準備";missionTitle.textContent="運転スタートを押してね";promptEl.textContent="205系がやってくるよ。";answerText.textContent="＿";feedback.className="feedback";feedback.textContent="問題が出たらテンキーで答えよう。";setDoorOpen(false,false);passCounter.classList.remove("show");setConsistLeft(offscreenLeft(),false);if(speedBars){[...speedBars.querySelectorAll("i")].forEach(b=>b.classList.remove("on"));}if(speedText)speedText.textContent="0 km/h";difficulty="easy";subjectMode="angle";document.querySelectorAll(".modeBtn").forEach((b,i)=>b.classList.toggle("selected",i===0));document.querySelectorAll(".subjectBtn").forEach((b,i)=>b.classList.toggle("selected",i===0));setProblemKind("angle");drawAngle(60,false);renderRoute();updateStationBackground()}
resetGame();