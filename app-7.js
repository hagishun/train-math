/* v20: worksheet-style angle puzzles using joined set squares */
(function(){
  function wsSvg(){
    const svg=angleDiagram && angleDiagram.querySelector('svg');
    if(!svg)return null;
    const old=svg.querySelector('#worksheetAngleLayer');
    if(old)old.remove();
    const oldLearning=svg.querySelector('#angleLearningLayer');
    if(oldLearning)oldLearning.remove();
    const baseLine=svg.querySelector('line:not(#angleRay)');
    [baseLine,angleRay,angleArc,angleLabel].forEach(el=>{if(el)el.setAttribute('visibility','hidden')});
    return svg;
  }
  function wsLayer(markup){
    const svg=wsSvg();
    if(!svg)return;
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('id','worksheetAngleLayer');
    g.innerHTML=markup;
    svg.appendChild(g);
  }
  function targetBubble(x,y,text,show){
    const label=show?`${text}°`:'?';
    const width=show?50:30;
    return `<rect x="${x-width/2}" y="${y-16}" width="${width}" height="30" rx="15" fill="#fff" stroke="#d86416" stroke-width="3"/>
      <text x="${x}" y="${y+6}" text-anchor="middle" font-size="${show?15:23}" font-weight="900" fill="#d86416">${label}</text>`;
  }
  function rightMark(x,y,flipX=1,flipY=-1){
    const s=13;
    const x1=x+flipX*s,y1=y;
    const x2=x+flipX*s,y2=y+flipY*s;
    const x3=x,y3=y+flipY*s;
    return `<path d="M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}" fill="none" stroke="#52616b" stroke-width="3"/>`;
  }
  function drawJoinedSum(p,show){
    const v={x:146,y:123};
    const angle=p.a;
    const rad=(-90-angle)*Math.PI/180;
    const ax=v.x+92*Math.cos(rad), ay=v.y+92*Math.sin(rad);
    const topY=ay;
    const topX=v.x;
    const rightX=246,rightY=v.y;
    const bubbleX=182,bubbleY=77;
    wsLayer(`
      <text x="150" y="17" text-anchor="middle" font-size="13" font-weight="900" fill="#315b70">三角定規を組み合わせて、○の角を求めよう</text>
      <polygon points="${v.x},${v.y} ${topX},${topY.toFixed(1)} ${ax.toFixed(1)},${ay.toFixed(1)}" fill="#92c7e7" fill-opacity=".68" stroke="#4f819d" stroke-width="3"/>
      <polygon points="${v.x},${v.y} ${topX},${Math.max(56,topY).toFixed(1)} ${rightX},${rightY}" fill="#a7d89e" fill-opacity=".68" stroke="#5b9660" stroke-width="3"/>
      ${rightMark(v.x,v.y,1,-1)}
      <text x="${v.x-24}" y="${v.y-19}" text-anchor="middle" font-size="17" font-weight="900" fill="#315b70">${p.a}°</text>
      <text x="${v.x+29}" y="${v.y-8}" text-anchor="middle" font-size="15" font-weight="900" fill="#52616b">90°</text>
      <path d="M ${v.x+39} ${v.y} A 39 39 0 0 0 ${v.x+39*Math.cos(rad)} ${v.y+39*Math.sin(rad)}" fill="none" stroke="#e7832e" stroke-width="5" stroke-linecap="round"/>
      ${targetBubble(bubbleX,bubbleY,p.answer,show)}
    `);
  }
  function drawStraightGap(p,show){
    const v={x:150,y:126};
    const l1=(-180+p.a)*Math.PI/180;
    const r1=(-p.b)*Math.PI/180;
    const lx=v.x+95*Math.cos(l1),ly=v.y+95*Math.sin(l1);
    const rx=v.x+95*Math.cos(r1),ry=v.y+95*Math.sin(r1);
    wsLayer(`
      <text x="150" y="17" text-anchor="middle" font-size="13" font-weight="900" fill="#315b70">一直線と三角定規の角を使って考えよう</text>
      <line x1="35" y1="${v.y}" x2="265" y2="${v.y}" stroke="#52616b" stroke-width="4"/>
      <polygon points="${v.x},${v.y} 35,${v.y} ${lx.toFixed(1)},${ly.toFixed(1)}" fill="#92c7e7" fill-opacity=".68" stroke="#4f819d" stroke-width="3"/>
      <polygon points="${v.x},${v.y} ${rx.toFixed(1)},${ry.toFixed(1)} 265,${v.y}" fill="#a7d89e" fill-opacity=".68" stroke="#5b9660" stroke-width="3"/>
      <text x="${v.x-59}" y="${v.y-13}" text-anchor="middle" font-size="17" font-weight="900" fill="#315b70">${p.a}°</text>
      <text x="${v.x+59}" y="${v.y-13}" text-anchor="middle" font-size="17" font-weight="900" fill="#315b70">${p.b}°</text>
      <path d="M ${v.x+48*Math.cos(l1)} ${v.y+48*Math.sin(l1)} A 48 48 0 0 1 ${v.x+48*Math.cos(r1)} ${v.y+48*Math.sin(r1)}" fill="none" stroke="#e7832e" stroke-width="5" stroke-linecap="round"/>
      ${targetBubble(150,62,p.answer,show)}
    `);
  }
  function drawAroundPoint(p,show){
    const v={x:150,y:89};
    const dirs=[0,-45,-105,-195];
    const pts=dirs.map(d=>({x:v.x+72*Math.cos(d*Math.PI/180),y:v.y+72*Math.sin(d*Math.PI/180)}));
    wsLayer(`
      <text x="150" y="17" text-anchor="middle" font-size="13" font-weight="900" fill="#315b70">三角定規をぐるっと組み合わせたチャレンジ</text>
      <polygon points="${v.x},${v.y} ${pts[0].x},${pts[0].y} ${pts[1].x.toFixed(1)},${pts[1].y.toFixed(1)}" fill="#a7d89e" fill-opacity=".7" stroke="#5b9660" stroke-width="3"/>
      <polygon points="${v.x},${v.y} ${pts[1].x.toFixed(1)},${pts[1].y.toFixed(1)} ${pts[2].x.toFixed(1)},${pts[2].y.toFixed(1)}" fill="#92c7e7" fill-opacity=".7" stroke="#4f819d" stroke-width="3"/>
      <polygon points="${v.x},${v.y} ${pts[2].x.toFixed(1)},${pts[2].y.toFixed(1)} ${pts[3].x.toFixed(1)},${pts[3].y.toFixed(1)}" fill="#d6c1e8" fill-opacity=".65" stroke="#8b72a5" stroke-width="3"/>
      <text x="186" y="75" font-size="15" font-weight="900" fill="#315b70">45°</text>
      <text x="145" y="48" font-size="15" font-weight="900" fill="#315b70">60°</text>
      <text x="102" y="86" font-size="15" font-weight="900" fill="#315b70">90°</text>
      <path d="M ${v.x+43*Math.cos(-195*Math.PI/180)} ${v.y+43*Math.sin(-195*Math.PI/180)} A 43 43 0 1 1 ${v.x+43} ${v.y}" fill="none" stroke="#e7832e" stroke-width="5" stroke-linecap="round"/>
      ${targetBubble(150,143,p.answer,show)}
    `);
  }
  function drawWorksheetPreview(){
    const p={a:30,b:90,answer:120,template:'sum'};
    drawJoinedSum(p,false);
  }

  drawAngle=function(deg,show){
    if(currentProblem&&currentProblem.kind==='angle'&&currentProblem.worksheet){
      if(currentProblem.template==='sum'){drawJoinedSum(currentProblem,show);return;}
      if(currentProblem.template==='gap'){drawStraightGap(currentProblem,show);return;}
      if(currentProblem.template==='around'){drawAroundPoint(currentProblem,show);return;}
    }
    if(!currentProblem&&subjectMode==='angle'){drawWorksheetPreview();return;}
    if(typeof drawPlainAngle==='function'){drawPlainAngle(deg,show);return;}
  };

  makeAngleProblem=function(){
    if(difficulty==='easy'){
      const q=pick([
        {a:30,b:90,answer:120},
        {a:45,b:90,answer:135},
        {a:60,b:90,answer:150}
      ]);
      return{kind:'angle',worksheet:true,template:'sum',...q,title:'📐 三角定規を組み合わせよう',prompt:'○の角度は何度？',hint:`○の角は ${q.a}° と 90° を合わせた角。${q.a} + 90 を計算しよう。`};
    }
    if(difficulty==='normal'){
      const q=pick([
        {a:30,b:45,answer:105},
        {a:45,b:45,answer:90},
        {a:60,b:45,answer:75},
        {a:30,b:60,answer:90}
      ]);
      return{kind:'angle',worksheet:true,template:'gap',...q,title:'📐 ○の角を見つけよう',prompt:'○の角度は何度？',hint:`一直線は180°。${q.a}° と ${q.b}° を先に足して、180°から引こう。`};
    }
    const q=pick([
      {a:30,b:60,answer:90},
      {a:45,b:60,answer:75},
      {a:60,b:60,answer:60}
    ]);
    return{kind:'angle',worksheet:true,template:'gap',...q,title:'📐 三角定規パズル',prompt:'○の角度は何度？',hint:`一直線180°から、${q.a}° と ${q.b}° のぶんを引こう。`};
  };

  makeProblem=function(){
    let kind=subjectMode;
    if(subjectMode==='mix')kind=pick(['angle','graph','fraction']);
    if(kind==='graph')return makeGraphProblem();
    if(kind==='fraction')return makeFractionProblem();
    const q=makeAngleProblem();
    if(stations[stationIndex]==='相模原'&&difficulty==='hard'){
      q.title='⭐ 相模原 三角定規チャレンジ';
    }
    return q;
  };

  if(phase==='idle'&&subjectMode==='angle'){
    currentProblem=null;
    setProblemKind('angle');
    drawWorksheetPreview();
    missionTitle.textContent='📐 三角定規パズル';
    promptEl.textContent='運転スタートで、○の角を求める問題が出るよ。';
  }
})();

/* v21: 九九モード + 相模原かけ算チャレンジ + 205系ドア動作のリアル化 */
(function(){
  const subjectPanel=document.querySelector('.subjectPanel');
  if(!subjectPanel)return;

  const style=document.createElement('style');
  style.textContent=`
    .subjectPanel{grid-template-columns:repeat(5,minmax(0,1fr))}
    .multiplyWrap{min-height:150px;border:3px solid var(--ink);border-radius:12px;background:linear-gradient(180deg,#fffdf4,#fff8d6);display:none;align-items:center;justify-content:center;padding:12px}
    .multiplyExpr{font-size:clamp(34px,7vw,68px);font-weight:1000;letter-spacing:.04em;color:#21313a;text-align:center}
    .multiplyNote{margin-top:8px;font-size:13px;font-weight:900;color:#52616b;text-align:center}
    .frontcar .gameDoor205 .leaf205,.doorCamera .camLeaf{transition-duration:1.02s!important;transition-timing-function:cubic-bezier(.38,.02,.18,1)!important}
    .frontcar.open .gameDoor205 .leaf205.left,.doorCamera.open .camLeaf.left{transition-delay:.02s!important}
    .frontcar.open .gameDoor205 .leaf205.right,.doorCamera.open .camLeaf.right{transition-delay:.07s!important}
    .frontcar.door-closing .gameDoor205 .leaf205,.doorCamera.door-closing .camLeaf{transition-duration:1.02s!important;transition-timing-function:cubic-bezier(.46,.01,.22,1)!important}
    .frontcar.door-closing .gameDoor205 .leaf205.left,.doorCamera.door-closing .camLeaf.left{transition-delay:.30s!important}
    .frontcar.door-closing .gameDoor205 .leaf205.right,.doorCamera.door-closing .camLeaf.right{transition-delay:0s!important}
    .frontcar.door-impact .gameDoor205,.doorCamera.door-impact .camDoor{animation:realDoorImpact .13s ease-out}
    .frontcar.door-bounce .gameDoor205,.doorCamera.door-bounce .camDoor{animation:realDoorSettle .22s ease-out}
    @keyframes realDoorImpact{0%{transform:translateX(0)}35%{transform:translateX(1.4px)}70%{transform:translateX(-.8px)}100%{transform:translateX(0)}}
    @keyframes realDoorSettle{0%{transform:translateX(0)}45%{transform:translateX(-.6px)}100%{transform:translateX(0)}}
    @media(max-width:1050px){.subjectPanel{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:800px){.subjectPanel{grid-template-columns:1fr}.multiplyWrap{min-height:120px}}
  `;
  document.head.appendChild(style);

  let multiplyButton=subjectPanel.querySelector('[data-subject="multiply"]');
  if(!multiplyButton){
    multiplyButton=document.createElement('button');
    multiplyButton.className='subjectBtn';
    multiplyButton.dataset.subject='multiply';
    multiplyButton.innerHTML='✖️ かけ算<div class="subjectHelp">九九＋相模原チャレンジ</div>';
    const mixButton=subjectPanel.querySelector('[data-subject="mix"]');
    subjectPanel.insertBefore(multiplyButton,mixButton||null);
  }

  const tabs=document.querySelector('.problem-tabs');
  const multiplyChip=document.createElement('span');
  multiplyChip.id='multiplyChip';
  multiplyChip.className='problem-chip';
  multiplyChip.textContent='✖️ かけ算';
  tabs.appendChild(multiplyChip);

  const diagramHost=angleDiagram.parentElement;
  const multiplyDiagram=document.createElement('div');
  multiplyDiagram.id='multiplyDiagram';
  multiplyDiagram.className='multiplyWrap';
  multiplyDiagram.innerHTML='<div><div id="multiplyExpr" class="multiplyExpr">3 × 8 = ?</div><div class="multiplyNote">数字をテンキーで入れてね</div></div>';
  diagramHost.appendChild(multiplyDiagram);
  const multiplyExpr=multiplyDiagram.querySelector('#multiplyExpr');

  function setMultiplyView(expr='3 × 8 = ?'){
    angleDiagram.style.display='none';
    graphDiagram.style.display='none';
    fractionDiagram.style.display='none';
    multiplyDiagram.style.display='flex';
    [angleChip,graphChip,fractionChip].forEach(chip=>chip&&chip.classList.remove('active'));
    multiplyChip.classList.add('active');
    answerUnit.textContent='';
    multiplyExpr.textContent=expr;
  }
  function hideMultiplyView(){
    multiplyDiagram.style.display='none';
    multiplyChip.classList.remove('active');
  }

  multiplyButton.addEventListener('click',()=>{
    if(phase!=='idle')return;
    subjectMode='multiply';
    document.querySelectorAll('.subjectBtn').forEach(b=>b.classList.toggle('selected',b===multiplyButton));
    setMultiplyView();
    missionTitle.textContent='✖️ 九九ミッション';
    promptEl.textContent='ふだんは九九。相模原では難易度でチャレンジが変わるよ。';
    feedback.className='feedback';
    feedback.textContent='運転スタートを押してね。';
  });

  document.querySelectorAll('.subjectBtn').forEach(btn=>{
    if(btn===multiplyButton)return;
    btn.addEventListener('click',()=>{if(phase==='idle')hideMultiplyView()});
  });
  document.getElementById('resetBtn').addEventListener('click',()=>hideMultiplyView());

  const rand=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
  function makeMultiplyProblem(){
    const isSag=stations[stationIndex]==='相模原';
    let a,b,level='九九';
    if(!isSag||difficulty==='easy'){
      a=rand(2,9);b=rand(2,9);
    }else if(difficulty==='normal'){
      a=rand(10,15);b=rand(2,9);level='ちょいむず';
    }else{
      a=rand(11,25);b=rand(3,9);level='むずかしい';
    }
    const answer=a*b;
    const challenge=isSag?`⭐ 相模原 ${level}かけ算チャレンジ`:'✖️ 九九ミッション';
    const hint=a<=9
      ?`${a}の段を思い出そう。${a}を${b}こ分だよ。`
      :`${a}を 10 と ${a-10} に分けると、10×${b} と ${a-10}×${b} で考えられるよ。`;
    return{kind:'multiply',a,b,answer,title:challenge,prompt:`${a} × ${b} はいくつ？`,hint};
  }

  const baseMakeProblem=makeProblem;
  makeProblem=function(){
    if(subjectMode==='multiply')return makeMultiplyProblem();
    return baseMakeProblem();
  };

  const baseNewProblem=newProblem;
  newProblem=function(){
    if(subjectMode!=='multiply'){
      hideMultiplyView();
      return baseNewProblem();
    }
    input='';
    answerText.textContent='＿';
    feedback.className='feedback';
    feedback.textContent='テンキーで答えを入れよう。';
    currentProblem=makeProblem();
    missionTitle.textContent=currentProblem.title;
    promptEl.textContent=currentProblem.prompt;
    setMultiplyView(`${currentProblem.a} × ${currentProblem.b} = ?`);
    if(stations[stationIndex]==='相模原'){
      challenge.classList.add('show');
      setTimeout(()=>challenge.classList.remove('show'),1300);
    }
  };

  let doorTimers=[];
  function clearDoorTimers(){doorTimers.forEach(clearTimeout);doorTimers=[];}
  function later(fn,ms){const id=setTimeout(fn,ms);doorTimers.push(id);return id;}

  setDoorOpen=function(isOpen,animateClose=true){
    clearDoorTimers();
    frontCar.classList.remove('door-sealed','door-impact','door-bounce');
    doorCamera.classList.remove('door-sealed','door-impact','door-bounce');
    doorImpact.classList.remove('show');

    if(isOpen){
      frontCar.classList.remove('door-closing');
      doorCamera.classList.remove('door-closing');
      camState.textContent='UNLOCK';
      pneumaticDoorSound();
      later(()=>{
        camState.textContent='OPENING';
        frontCar.classList.add('open');
        doorCamera.classList.add('open');
      },150);
      later(()=>{camState.textContent='OPEN';},1180);
      return;
    }

    if(!animateClose){
      frontCar.classList.remove('open','door-closing','door-impact','door-bounce','door-sealed');
      doorCamera.classList.remove('open','door-closing','door-impact','door-bounce','door-sealed');
      camState.textContent='CLOSED';
      return;
    }

    camState.textContent='STANDBY';
    later(()=>{
      pneumaticDoorSound();
      frontCar.classList.add('door-closing');
      doorCamera.classList.add('door-closing');
      camState.textContent='CLOSING';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        frontCar.classList.remove('open');
        doorCamera.classList.remove('open');
      }));
    },140);
    later(()=>{
      doorImpactSound();
      frontCar.classList.add('door-impact');
      doorCamera.classList.add('door-impact');
      doorImpact.classList.remove('show');
      void doorImpact.offsetWidth;
      doorImpact.classList.add('show');
    },1490);
    later(()=>{
      frontCar.classList.remove('door-impact');
      doorCamera.classList.remove('door-impact');
      frontCar.classList.add('door-bounce');
      doorCamera.classList.add('door-bounce');
      camState.textContent='LOCK';
    },1610);
    later(()=>{
      frontCar.classList.remove('door-bounce','door-closing');
      doorCamera.classList.remove('door-bounce','door-closing');
      frontCar.classList.add('door-sealed');
      doorCamera.classList.add('door-sealed');
      camState.textContent='CLOSED';
    },1780);
    later(()=>{
      frontCar.classList.remove('door-sealed');
      doorCamera.classList.remove('door-sealed');
    },1980);
  };

  correct=function(){
    correctSound();
    feedback.className='feedback good';
    feedback.textContent='正解！ドアが開きます。';
    if(currentProblem.kind==='angle')drawAngle(currentProblem.answer,true);
    setDoorOpen(true);
    statusEl.textContent='ドア開';
    if(stations[stationIndex]==='相模原')showSparkles();
    setTimeout(()=>{
      statusEl.textContent='♪ 発車メロディー';
      feedback.textContent='♪ 発車メロディーが流れています';
      const melodyMs=playDepartureMelody();
      setTimeout(()=>{
        setDoorOpen(false,true);
        statusEl.textContent='ドア閉動作';
        feedback.textContent='空気音と左右のドアの動きを見てね。';
        setTimeout(()=>{
          statusEl.textContent='ドア閉';
          feedback.textContent='ドアが閉まりました。まもなく発車！';
        },1980);
        setTimeout(departurePass,2250);
      },melodyMs);
    },1200);
  };
})();
