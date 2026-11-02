const TYPES=['判断题','单选题','多选题','简答题'];
const KEY='zhilian-v1';
let state;try{state=JSON.parse(localStorage.getItem(KEY))}catch{};
state={current:0,mode:'answer',view:'all',filter:'all',filterIds:null,auto:true,records:{},favorites:[],drafts:{},...state};
// Enable the new default once for existing learners without changing their records.
if(state.autoJumpVersion!==1){state.auto=true;state.autoJumpVersion=1;}
if(!QUESTIONS[state.current])state.current=0;
let selected=[],revealed=false,timer;
const $=s=>document.querySelector(s);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isSame=(a,b)=>a.length===b.length&&[...a].sort().join(',')===[...b].sort().join(',');
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{toast('浏览器无法保存记录，请检查存储设置')}}
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('visible');setTimeout(()=>$('#toast').classList.remove('visible'),2200)}
function list(){return QUESTIONS.filter(q=>(state.view==='wrong'?state.records[q.id]?.correct===false:state.view==='favorites'?state.favorites.includes(q.id):true)&&(state.filter==='all'||!Array.isArray(state.filterIds)||state.filterIds.includes(q.id)))}
function setQuestionFilter(filter){
  clearTimeout(timer);state.view='all';state.filter=filter;
  // Keep this practice queue stable while answering; reselect a filter to refresh it.
  state.filterIds=filter==='all'?null:QUESTIONS.filter(q=>filter==='unanswered'?!state.records[q.id]:state.records[q.id]?.correct===false).map(q=>q.id);
  const qs=list();jump(qs.some(q=>q.id===state.current)?state.current:qs[0]?.id??0);
  $('#answer-map').scrollTop=0;
}
function jump(id){clearTimeout(timer);resetSwipeVisual();state.current=id;selected=[...(state.records[id]?.selected||[])];revealed=!!state.records[id];save();render();if(matchMedia('(max-width:680px)').matches)window.scrollTo(0,0)}
function navigate(step){const qs=list(),i=qs.findIndex(q=>q.id===state.current);if(qs[i+step])jump(qs[i+step].id);else if(step>0)toast('已到最后一题，做得不错！')}
function setView(view){closeMobileMenu();state.view=view;state.filter='all';state.filterIds=null;const qs=list();if(!qs.some(q=>q.id===state.current)&&qs.length)state.current=qs[0].id;jump(state.current)}
function choose(i){const q=QUESTIONS[state.current];if(state.mode==='study'||revealed)return;if(q.type===2){selected=selected.includes(i)?selected.filter(x=>x!==i):[...selected,i];renderQuestion()}else{selected=[i];submit()}}
function submit(){const q=QUESTIONS[state.current];if(q.type!==3&&!selected.length)return;if(q.type===3){revealed=true;renderQuestion();return}revealed=true;if(q.answer){const correct=isSame(selected,q.answer);state.records[q.id]={selected:[...selected],correct};save();render();if(correct&&state.view==='wrong'){toast('回答正确，已移出错题');setView('wrong');return}if(correct&&state.auto){const id=q.id;timer=setTimeout(()=>{if(state.current===id&&state.mode==='answer')navigate(1)},300)}}else{toast('题目数据异常，请刷新后重试');renderQuestion()}}
function selfAssess(level){state.records[state.current]={self:level};save();render()}
function renderQuestion(){const qs=list(),q=QUESTIONS[state.current];const card=$('#question-card');if(!qs.length){card.innerHTML=`<div class="empty"><strong>${state.filter==='unanswered'?'全部题目已完成':state.filter==='wrong'||state.view==='wrong'?'暂时没有错题':'还没有收藏题目'}</strong>${state.filter==='unanswered'?'可以切换全部重新练习。':state.filter==='wrong'||state.view==='wrong'?'答错的题会自动收录在这里。':'点击题目下方的 ☆ 即可加入收藏。'}<br><button class="submit" onclick="setView('all')">开始顺序练习</button></div>`;return}
const show=state.mode==='study'||revealed;const record=state.records[q.id];
let html=`<div class="q-meta"><span class="type-badge">${TYPES[q.type]}${q.type===2?' · 多项选择':''}</span><span>第 ${q.num} 题 / ${QUESTIONS.filter(x=>x.type===q.type).length} 题</span></div><h2 class="q-text"><span class="mobile-type-badge">${TYPES[q.type]}</span>${escapeHTML(q.text)}</h2>`;
if(q.type===3){if(state.mode==='answer')html+=`<textarea id="short-answer" aria-label="简答题答案" placeholder="试着按要点组织答案，内容会自动保存…">${escapeHTML(state.drafts[q.id]||'')}</textarea>`;if(!show)html+='<button class="submit" id="submit">提交并对照要点</button>';if(show)html+=`<section class="result"><h3>参考答题框架</h3><p class="answer-label">${q.points.map(p=>escapeHTML(p.split('：')[0])).join(' → ')}</p><div class="analysis-label">参考要点 · 非官方评分标准</div><ol class="points">${q.points.map(p=>`<li>${escapeHTML(p)}</li>`).join('')}</ol>${state.mode==='answer'?`<h3>对照要点，评估掌握程度</h3><div class="self-actions">${['需复习','部分掌握','已掌握'].map(x=>`<button class="${record?.self===x?'selected':''}" onclick="selfAssess('${x}')">${x}</button>`).join('')}</div>`:''}</section>`}
else{html+='<div class="options">'+q.options.map((o,i)=>{const right=show&&q.answer?.includes(i),wrong=show&&selected.includes(i)&&q.answer&&!q.answer.includes(i);return `<button class="option ${right?'correct':wrong?'wrong':selected.includes(i)?'selected':''}" data-option="${i}" ${show?'disabled':''} aria-pressed="${selected.includes(i)}"><span class="letter">${q.type===0?(i===0?'✓':'×'):String.fromCharCode(65+i)}</span><span>${escapeHTML(o)}</span>${right?'<span class="result-tag">正确答案</span>':''}</button>`}).join('')+'</div>';if(q.type===2&&!show)html+=`<button class="submit" id="submit" ${!selected.length?'disabled':''}>确认答案${selected.length?'（已选 '+selected.length+' 项）':''}</button>`;if(show){if(!q.answer)html+='<section class="result"><h3>题目数据异常</h3><p>请刷新页面重新加载题库。</p></section>';else{const correct=isSame(selected,q.answer);html+=`<section class="result ${state.mode==='answer'&&!correct?'error':''}" role="status"><h3>${state.mode==='study'?'先理解，再记忆':correct?'✓ 回答正确，继续保持':'再想一想，这道题值得复习'}</h3><p class="answer-label">正确答案：<strong>${q.answer.map(i=>q.type===0?q.options[i]:String.fromCharCode(65+i)).join('、')}</strong>${state.mode==='answer'?'　你的答案：'+selected.map(i=>q.type===0?q.options[i]:String.fromCharCode(65+i)).join('、'):''}</p><div class="analysis-label">题目解析</div><p>${escapeHTML(q.explanation)}</p>${q.source?`<p class="law-source">依据：<a href="${escapeHTML(q.source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(q.source.title)}</a></p>`:''}${q.type===2&&state.mode==='answer'?`<p>漏选：${q.answer.filter(i=>!selected.includes(i)).map(i=>String.fromCharCode(65+i)).join('、')||'无'}　错选：${selected.filter(i=>!q.answer.includes(i)).map(i=>String.fromCharCode(65+i)).join('、')||'无'}</p>`:''}</section>`}}}
if(state.mode==='answer'&&revealed&&record)html+='<button class="submit" id="retry">重新作答</button>';card.innerHTML=html;if($('#retry'))$('#retry').onclick=()=>{clearTimeout(timer);revealed=false;selected=[];renderQuestion()};card.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>choose(Number(b.dataset.option)));if($('#submit'))$('#submit').onclick=submit;if($('#short-answer'))$('#short-answer').oninput=e=>{state.drafts[q.id]=e.target.value;save()};}
function render(){const qs=list(),q=QUESTIONS[state.current],empty=!qs.length;
document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',state.filter===b.dataset.filter);b.setAttribute('aria-pressed',String(state.filter===b.dataset.filter));b.onclick=()=>setQuestionFilter(b.dataset.filter)});
$('#nav').innerHTML=[['all','▤','顺序练习',83],['wrong','↺','错题复习',Object.values(state.records).filter(r=>r.correct===false).length],['favorites','☆','我的收藏',state.favorites.length]].map(([key,icon,title,n])=>`<button class="nav-item ${state.view===key?'active':''}" data-view="${key}"><span>${icon}</span>${title}<b>${n}</b></button>`).join('');document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.querySelectorAll('[data-mobile-view]').forEach(b=>{b.classList.toggle('active',state.view===b.dataset.mobileView);b.onclick=()=>setView(b.dataset.mobileView)});const viewName={all:'顺序练习',wrong:'错题复习',favorites:'我的收藏'}[state.view];$('#crumb').textContent=viewName;$('#title').textContent=state.view==='all'?'每一道题，都更进一步。':state.view==='wrong'?'把薄弱点，练成得分点。':'值得记住的，再看一遍。';$('#subtitle').textContent=state.view==='all'?'按样卷顺序练习，让知识慢慢变成底气。':state.view==='wrong'?'重做答对后移出错题，参考解析会帮助你理解。':'收藏那些需要多想一步的知识。';
$('#answer-mode').classList.toggle('active',state.mode==='answer');$('#study-mode').classList.toggle('active',state.mode==='study');$('#auto').checked=state.auto;$('#auto').disabled=state.mode==='study';
$('#type-tabs').innerHTML=TYPES.map((t,i)=>`<button data-type="${i}" class="${!empty&&q.type===i?'active':''}" ${!qs.some(x=>x.type===i)?'disabled':''}>${t}<small>${qs.filter(x=>x.type===i).length}</small></button>`).join('');document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{const first=qs.find(x=>x.type===Number(b.dataset.type));if(first){jump(first.id);closeMobileMenu()}});
renderQuestion();const pos=qs.findIndex(x=>x.id===q.id);$('#prev').disabled=empty||pos<=0;$('#next').disabled=empty||pos>=qs.length-1;$('#favorite').disabled=empty;$('#favorite').classList.toggle('saved',state.favorites.includes(q.id));$('#favorite').textContent=state.favorites.includes(q.id)?'★ 已收藏':'☆ 收藏本题';
$('#mobile-position').textContent=empty?'0 / 0':`${pos+1} / ${qs.length}`;$('#mobile-favorite').disabled=empty;$('#mobile-favorite').textContent=state.favorites.includes(q.id)?'★ 已收藏':'☆ 收藏';$('#mobile-favorite').classList.toggle('saved',state.favorites.includes(q.id));
const records=Object.values(state.records),graded=records.filter(r=>typeof r.correct==='boolean'),correct=graded.filter(r=>r.correct).length;$('#done-count').innerHTML=`${records.length}<small>/ 83</small>`;$('#progress-bar').style.width=records.length/83*100+'%';$('#correct-count').textContent=correct;$('#mobile-correct-count').textContent=correct;$('#mobile-wrong-count').textContent=graded.length-correct;$('#wrong-count').textContent=graded.length-correct;$('#rate').textContent=graded.length?Math.round(correct/graded.length*100)+'%':'—';$('#map-count').textContent=qs.length+' 题';
$('#answer-map').innerHTML=TYPES.map((t,i)=>{const group=qs.filter(x=>x.type===i);return group.length?`<div class="map-group"><h3>${t} · ${group.length} 题</h3><div class="map-grid">${group.map(x=>{const r=state.records[x.id];return `<button data-jump="${x.id}" class="${r?.correct===true?'correct':r?.correct===false?'wrong':r?.self?'self':''} ${x.id===q.id?'current':''} ${state.favorites.includes(x.id)?'star':''}" aria-label="${t}第${x.num}题${r?.correct===true?'，正确':r?.correct===false?'，错误':''}" ${x.id===q.id?'aria-current="true"':''}>${x.num}</button>`}).join('')}</div></div>`:''}).join('')||'<p class="map-empty">当前筛选没有题目</p>';document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{jump(Number(b.dataset.jump));closeMap()});}
function closeMobileMenu(){document.body.classList.remove('mobile-menu-open');$('#mobile-menu-toggle').setAttribute('aria-expanded','false');}
function closeMap(){$('#map-panel').classList.remove('open');$('#scrim').classList.remove('open')}
$('#answer-mode').onclick=()=>{state.mode='answer';jump(state.current)};$('#study-mode').onclick=()=>{state.mode='study';clearTimeout(timer);save();render()};$('#auto').onchange=e=>{state.auto=e.target.checked;clearTimeout(timer);save()};$('#prev').onclick=()=>navigate(-1);$('#next').onclick=()=>navigate(1);$('#favorite').onclick=()=>{const id=state.current;state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();if(state.view==='favorites')setView('favorites');else render()};$('#open-map').onclick=()=>{$('#map-panel').classList.add('open');$('#scrim').classList.add('open')};$('#close-map').onclick=closeMap;$('#scrim').onclick=closeMap;document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMap()});
jump(state.current);

// Keep vertical scrolling native; only deliberate one-finger horizontal swipes navigate.
function swipeDirection(dx,dy,elapsed){
  return elapsed<=800&&Math.abs(dx)>=60&&Math.abs(dx)>Math.abs(dy)*1.6?(dx<0?1:-1):0;
}
function resetSwipeVisual(){
  const card=$('#question-card');
  card.getAnimations().forEach(animation=>animation.cancel());
  card.style.transform='';
}
function reboundSwipe(){
  const from=$('#question-card').style.transform;
  resetSwipeVisual();
  if(from&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    $('#question-card').animate([{transform:from},{transform:'translateX(0)'}],{duration:180,easing:'ease-out'});
  }
}
let swipeStart=null,suppressSwipeClick=false;
const swipeCard=$('#question-card');
swipeCard.addEventListener('touchstart',e=>{
  resetSwipeVisual();suppressSwipeClick=false;
  swipeStart=e.touches.length===1&&!e.target.closest('textarea,input,select,[contenteditable]')?{x:e.touches[0].clientX,y:e.touches[0].clientY,time:Date.now(),id:state.current}:null;
},{passive:true});
swipeCard.addEventListener('touchmove',e=>{
  if(!swipeStart)return;
  if(e.touches.length!==1){swipeStart=null;reboundSwipe();return;}
  const dx=e.touches[0].clientX-swipeStart.x,dy=e.touches[0].clientY-swipeStart.y;
  if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){swipeStart=null;reboundSwipe();return;}
  if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.3){
    clearTimeout(timer);
    const qs=list(),pos=qs.findIndex(q=>q.id===state.current);
    const edge=(dx>0&&pos<=0)||(dx<0&&pos===qs.length-1);
    swipeCard.style.transform=`translateX(${edge?dx*0.25:dx}px)`;
    suppressSwipeClick=true;
  }
},{passive:true});
swipeCard.addEventListener('touchcancel',()=>{swipeStart=null;reboundSwipe();},{passive:true});
swipeCard.addEventListener('touchend',async e=>{
  const start=swipeStart;swipeStart=null;
  if(!start||e.touches.length||e.changedTouches.length!==1||state.current!==start.id){reboundSwipe();return;}
  const direction=swipeDirection(e.changedTouches[0].clientX-start.x,e.changedTouches[0].clientY-start.y,Date.now()-start.time);
  const qs=list(),pos=qs.findIndex(q=>q.id===state.current);
  if(!direction){reboundSwipe();return;}
  suppressSwipeClick=true;clearTimeout(timer);
  if(!qs[pos+direction]){reboundSwipe();toast(direction<0?'已经是第一题':'已到最后一题');return;}
  const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!reduceMotion){
    const width=swipeCard.getBoundingClientRect().width;
    const animation=swipeCard.animate([{transform:swipeCard.style.transform||'translateX(0)'},{transform:`translateX(${-direction*width}px)`}],{duration:140,easing:'ease-out',fill:'forwards'});
    try{await animation.finished;}catch{return;}
    if(state.current!==start.id)return;
    resetSwipeVisual();navigate(direction);
    swipeCard.animate([{transform:`translateX(${direction*width}px)`},{transform:'translateX(0)'}],{duration:180,easing:'ease-out'});
  }else{resetSwipeVisual();navigate(direction);}
},{passive:true});
swipeCard.addEventListener('click',e=>{if(suppressSwipeClick){e.preventDefault();e.stopPropagation();suppressSwipeClick=false;}},true);

$('#mobile-favorite').onclick=()=>$('#favorite').click();
$('#mobile-menu-toggle').onclick=()=>{const open=document.body.classList.toggle('mobile-menu-open');$('#mobile-menu-toggle').setAttribute('aria-expanded',String(open));};

function resetAllAnswers(){
  if(!confirm('确定重置全部答题记录？答题结果、错题、简答草稿和自评将清空，从第一题重新开始。收藏会保留。'))return;
  clearTimeout(timer);
  state.records={};state.drafts={};state.view='all';state.filter='all';state.filterIds=null;state.mode='answer';
  swipeStart=null;suppressSwipeClick=false;
  closeMobileMenu();jump(QUESTIONS[0].id);
  toast('答题记录已清空，可以重新开始');
}
$('#reset-all').onclick=resetAllAnswers;

const entryView=new URLSearchParams(location.search).get('view');
if(['all','wrong','favorites'].includes(entryView))setView(entryView);
const entryMode=new URLSearchParams(location.search).get('mode');
if(['answer','study'].includes(entryMode)){state.mode=entryMode;save();render();}
