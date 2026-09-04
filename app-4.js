function playDepartureMelody(){
  const variant=departureMelodyVariant%3;
  departureMelodyVariant=(departureMelodyVariant+1)%3;
  if(variant===0)return playOriginalDepartureMelody();
  if(variant===1)return playSpringBoxStyleMelody();
  return playVerdeRayoStyleMelody();
}
consist.querySelectorAll(".car:not(.frontcar)").forEach(car=>{if(!car.querySelector(".d4")){const d=document.createElement("div");d.className="door d4";car.appendChild(d)}});
function renderRoute(){routeMap.innerHTML="<strong>路線：</strong>";stations.forEach((n,i)=>{const w=document.createElement("span"),d=document.createElement("span"),l=document.createElement("span");w.className="stationNode";d.className="dot";if(i<stationIndex)d.classList.add("done");if(i===stationIndex&&phase!=="finished")d.classList.add("now");l.textContent=n;w.append(d,l);routeMap.append(w);if(i<stations.length-1){const a=document.createElement("span");a.className="arrow";a.textContent="→";routeMap.append(a)}})}
function drawAngle(deg,show){const cx=150,cy=130,r=91,rad=deg*Math.PI/180,x2=cx+Math.cos(-rad)*100,y2=cy+Math.sin(-rad)*100;angleRay.setAttribute("x2",x2);angleRay.setAttribute("y2",y2);const sx=cx+r,sy=cy,ex=cx+Math.cos(-rad)*r,ey=cy+Math.sin(-rad)*r,large=deg>180?1:0;angleArc.setAttribute("d",`M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`);angleLabel.textContent=show?deg+"°":"?"}
const pick=a=>a[Math.floor(Math.random()*a.length)];
function setProblemKind(kind){const isGraph=kind==="graph";const isFraction=kind==="fraction";answerUnit.textContent=isGraph?"人":isFraction?"":"°";angleDiagram.style.display=(!isGraph&&!isFraction)?"flex":"none";graphDiagram.style.display=isGraph?"block":"none";fractionDiagram.style.display=isFraction?"flex":"none";angleChip.classList.toggle("active",!isGraph&&!isFraction);graphChip.classList.toggle("active",isGraph);fractionChip.classList.toggle("active",isFraction)}
function drawLineGraph(labels,values,showValues=false){const w=360,h=190,left=46,right=14,top=14,bottom=42,pw=w-left-right,ph=h-top-bottom,maxV=Math.max(10,Math.ceil(Math.max(...values)/10)*10);let s=[];for(let i=0;i<=5;i++){const y=top+ph*i/5,val=Math.round(maxV*(1-i/5));s.push(`<line class="graph-grid" x1="${left}" y1="${y}" x2="${w-right}" y2="${y}"/>`,`<text class="graph-label" x="${left-8}" y="${y+4}" text-anchor="end">${val}</text>`)}s.push(`<line class="graph-axis" x1="${left}" y1="${top}" x2="${left}" y2="${top+ph}"/>`,`<line class="graph-axis" x1="${left}" y1="${top+ph}" x2="${w-right}" y2="${top+ph}"/>`);const pts=values.map((v,i)=>{const x=left+pw*i/(labels.length-1),y=top+ph*(1-v/maxV);return{x,y,v,label:labels[i]}});s.push(`<polyline class="graph-line" points="${pts.map(p=>`${p.x},${p.y}`).join(" ")}"/>`);pts.forEach(p=>{s.push(`<circle class="graph-point" cx="${p.x}" cy="${p.y}" r="5"/>`,`<text class="graph-label" x="${p.x}" y="${top+ph+20}" text-anchor="middle">${p.label}</text>`);if(showValues)s.push(`<text class="graph-value" x="${p.x}" y="${p.y-10}" text-anchor="middle">${p.v}</text>`)});graphSvg.innerHTML=s.join("")}
function makeGraphProblem(){
  const labels=["東神奈川","菊名","新横浜","町田","橋本"];
  const v=[30+Math.floor(Math.random()*5)*10,40+Math.floor(Math.random()*5)*10,50+Math.floor(Math.random()*5)*10,40+Math.floor(Math.random()*6)*10,30+Math.floor(Math.random()*6)*10];
  if(difficulty==="easy"){
    const type=pick(["max","min","diff"]);
    if(type==="max"){const m=Math.max(...v),i=v.indexOf(m);return{kind:"graph",answer:m,title:"📈 得意をのばそう！",prompt:"このグラフで、いちばん多い駅は何人？",hint:`いちばん高い点（${labels[i]}）を見よう。`,graphLabels:labels,graphValues:v,showValues:true}}
    if(type==="min"){const m=Math.min(...v),i=v.indexOf(m);return{kind:"graph",answer:m,title:"📈 得意をのばそう！",prompt:"このグラフで、いちばん少ない駅は何人？",hint:`いちばん低い点（${labels[i]}）を見よう。`,graphLabels:labels,graphValues:v,showValues:true}}
    const a=Math.floor(Math.random()*(labels.length-1)),b=a+1;return{kind:"graph",answer:Math.abs(v[b]-v[a]),title:"📈 得意をのばそう！",prompt:`${labels[a]}と${labels[b]}では、何人ちがう？`,hint:"グラフに書いてある2つの数字を引いてみよう。",graphLabels:labels,graphValues:v,showValues:true};
  }
  if(difficulty==="normal"){
    const type=pick(["largestChange","twoStep"]);
    if(type==="largestChange"){let best=-1;for(let i=0;i<v.length-1;i++)best=Math.max(best,Math.abs(v[i+1]-v[i]));return{kind:"graph",answer:best,title:"📈 変化を見つけよう",prompt:"となり合う駅で、いちばん大きく変化したのは何人？",hint:"各区間の差をくらべよう。",graphLabels:labels,graphValues:v,showValues:false}}
    const a=0,b=2;return{kind:"graph",answer:Math.abs(v[b]-v[a]),title:"📈 2駅先まで読む",prompt:`${labels[a]}と${labels[b]}では何人ちがう？`,hint:"少し離れた2つの点をくらべよう。",graphLabels:labels,graphValues:v,showValues:false};
  }
  let inc=0,dec=0;for(let i=0;i<v.length-1;i++){const d=v[i+1]-v[i];if(d>0)inc+=d;else dec+=Math.abs(d)}
  const type=pick(["net","totalMove"]);if(type==="net")return{kind:"graph",answer:Math.abs(v[v.length-1]-v[0]),title:"📈 グラフ分析チャレンジ",prompt:"最初の駅と最後の駅では、乗客数は何人ちがう？",hint:"途中ではなく、最初と最後の点に注目。",graphLabels:labels,graphValues:v,showValues:false};
  return{kind:"graph",answer:inc+dec,title:"📈 グラフ分析チャレンジ",prompt:"駅ごとの増減を全部たすと、変化量の合計は何人？",hint:"各区間の『差の大きさ』を全部たそう。",graphLabels:labels,graphValues:v,showValues:false};
}
function makeFractionProblem(){
  const den=pick([3,4,5,6,8]);
  if(difficulty==="easy"){
    const add=Math.random()<.6;
    if(add){let a=1+Math.floor(Math.random()*(den-2));let b=1+Math.floor(Math.random()*(den-a-1));const ans=a+b;return{kind:"fraction",answer:ans,denominator:den,title:"🍕 分数のたし算",prompt:`${a}/${den} + ${b}/${den} = ?/${den}`,expr:`${a}/${den} ＋ ${b}/${den}`,hint:`下の数は${den}のまま。上の数 ${a} と ${b} をたそう。`}}
    const a=2+Math.floor(Math.random()*(den-1));const b=1+Math.floor(Math.random()*(a-1));return{kind:"fraction",answer:a-b,denominator:den,title:"🍕 分数のひき算",prompt:`${a}/${den} − ${b}/${den} = ?/${den}`,expr:`${a}/${den} − ${b}/${den}`,hint:`下の数は${den}のまま。上の数だけ引こう。`};
  }
  if(difficulty==="normal"){const a=1+Math.floor(Math.random()*(den-2));const b=1+Math.floor(Math.random()*(den-a-1));return{kind:"fraction",answer:a+b,denominator:den,title:"🍕 分数を合わせよう",prompt:`ジュースを ${a}/${den} L と ${b}/${den} L 飲みました。合わせて ?/${den} L？`,expr:`${a}/${den} ＋ ${b}/${den}`,hint:"同じ大きさに分けた分数だから、上の数を足せばOK。"}}
  const a=1+Math.floor(Math.random()*(den-3));const b=1+Math.floor(Math.random()*(den-a-2));const c=1;return{kind:"fraction",answer:a+b+c,denominator:den,title:"🍕 分数3つチャレンジ",prompt:`${a}/${den} + ${b}/${den} + ${c}/${den} = ?/${den}`,expr:`${a}/${den} ＋ ${b}/${den} ＋ ${c}/${den}`,hint:`下の数は${den}のまま。上の数を3つ足そう。`};
}
function makeAngleProblem(){if(difficulty==="easy"){const a=pick([30,45,60,90,120,135,150]);return{kind:"angle",answer:a,title:"📐 角度を読もう",prompt:"この角度は何度？",draw:a,hint:"90°より大きいか小さいかを先に見よう。"}}if(difficulty==="normal"){const u=pick([30,45,60,75,90,120,135]);return{kind:"angle",answer:180-u,title:"📐 残りの角度",prompt:`180°から${u}°を引くと何度？`,draw:u,hint:`180 − ${u} を計算しよう。`}}const p=pick([[210,360],[225,360],[120,180],[75,180],[240,360]]);return{kind:"angle",answer:p[1]-p[0],title:"📐 むずかしい角度",prompt:`${p[1]}°から${p[0]}°を引いた残りは何度？`,draw:p[0]>180?p[1]-p[0]:p[0],hint:`${p[1]} − ${p[0]} を計算しよう。`}}
function makeProblem(){
  const isSag=stations[stationIndex]==="相模原";
  let kind=subjectMode;
  if(subjectMode==="mix")kind=pick(["angle","graph","fraction"]);
  if(isSag&&difficulty==="hard"&&kind==="angle"){
    const q=pick([{answer:60,title:"⭐ 相模原チャレンジ",prompt:"180°から120°を引いた残りは何度？",draw:120,hint:"180 − 120 を計算しよう。"},{answer:105,title:"⭐ 相模原チャレンジ",prompt:"一直線180°から75°を引くと残りは何度？",draw:75,hint:"180 − 75 を計算しよう。"},{answer:75,title:"⭐ 相模原チャレンジ",prompt:"三角定規の30°と45°を合わせると何度？",draw:75,hint:"30 + 45 を計算しよう。"},{answer:150,title:"⭐ 相模原チャレンジ",prompt:"一周360°から210°を引いた残りは何度？",draw:150,hint:"360 − 210 を計算しよう。"}]);q.kind="angle";return q;
  }
  if(kind==="graph")return makeGraphProblem();if(kind==="fraction")return makeFractionProblem();return makeAngleProblem();
}