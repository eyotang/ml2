const params=new URLSearchParams(location.search),courseId=params.get('course')||'b12';
const course=SKILL_COURSES[courseId];
if(!course){location.replace('./#skills');throw new Error('Unknown course')}
const isCase=course.kind==='case';
document.title=isCase?'知练 · 技能方案练习':'知练 · 代码补全';
const STORE='zhilian-skills-v1';let all={};try{all=JSON.parse(localStorage.getItem(STORE))||{}}catch{}
const progress={index:0,mode:'pick',records:{},drafts:{},...all[courseId]};
// Preserve existing work when reference-aligned blanks change their order.
if(!isCase&&progress.answerSchema!==2){
  if(courseId==='b2')for(const [id,order] of [['b2-5',[1,0,2]],['b2-9',[0,2,1]]]){
    const migrate=arr=>order.map(i=>arr[i]);
    const cleanMedian=arr=>id==='b2-5'?arr.map((v,i)=>i===2&&typeof v==='string'?v.replace(/^['"]|['"]$/g,''):v):arr;
    if(progress.drafts[id])progress.drafts[id]=cleanMedian(migrate(progress.drafts[id]));
    for(const version of Object.values(progress.records[id]?.modeAnswers||{})){
      if(version.values)version.values=cleanMedian(migrate(version.values));
      if(version.matches)version.matches=migrate(version.matches);
    }
  }
  progress.answerSchema=2;
}
progress.draftsByMode=progress.draftsByMode||{pick:JSON.parse(JSON.stringify(progress.drafts)),type:JSON.parse(JSON.stringify(progress.drafts))};
if(!course.steps[progress.index])progress.index=0;
let active=0,feedback=null,showSolution=false,finished=false;
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Accept spacing and quote style differences in these bounded keyword fields, not arbitrary Python programs.
function normalizeCode(s){return String(s).trim().replace(/(["'])(.*?)\1|\s+/g,(match,quote,content)=>quote?JSON.stringify(content):'')}
function current(){return course.steps[progress.index]}
function values(){const q=current(),mode=progress.mode==='type'?'type':'pick';progress.drafts=progress.draftsByMode[mode]||(progress.draftsByMode[mode]={});return progress.drafts[q.id]||(progress.drafts[q.id]=q.slots.map(()=>''))}
function save(){all[courseId]=progress;try{localStorage.setItem(STORE,JSON.stringify(all))}catch{$('#feedback').innerHTML='<p class="warning">浏览器存储不可用，请勿关闭页面，以免丢失进度。</p>'}}
function go(index){if(!course.steps[index])return;resetSkillDrag();progress.index=index;active=0;feedback=null;showSolution=false;finished=false;save();render();window.scrollTo(0,0)}
function setValue(value){values()[active]=value;feedback=null;save();const firstEmpty=values().findIndex((v,i)=>i>active&&!v);if(firstEmpty>=0)active=firstEmpty;render()}
function check(){if(progress.mode==='original'){renderOriginal(true);return}const q=current(),filled=values();if(filled.some(v=>!v.trim())){feedback={empty:true};renderFeedback();return}const details=q.slots.map((slot,i)=>isCase&&progress.mode==='type'&&window.CaseAnswerMatcher?window.CaseAnswerMatcher.check(slot,filled[i]):{status:[slot.answer,...(slot.accepted||[])].some(answer=>normalizeCode(answer)===normalizeCode(filled[i]))?'covered':'conflict'});const matches=details.map(result=>result.status==='covered');const old=progress.records[q.id]||{};feedback={correct:matches.every(Boolean),matches,details};progress.records[q.id]={...old,modeAnswers:{...old.modeAnswers,[progress.mode]:{values:[...filled],matches:[...matches],details}},attempts:(old.attempts||0)+1,correct:matches.every(Boolean),needsReview:details.some(r=>r.status==='review'),reviewed:matches.every(Boolean)||!!old.reviewed||(isCase&&progress.mode==='type')};save();render()}
function reveal(){showSolution=true;progress.records[current().id]={...progress.records[current().id],reviewed:true};save();render()}
function renderFeedback(){const q=current();let html='';if(feedback?.empty)html='<div class="feedback warning">还有空位未填写，先补全再检查。</div>';else if(feedback){html=`<div class="feedback ${feedback.correct?'success':feedback.details?.some(r=>r.status==='review')||feedback.matches.some(Boolean)?'partial':'error'}"><h3>${feedback.correct?(isCase?'✓ 已识别全部要点':'✓ 补全正确'):(isCase?'请核对以下要点':'还有几处需要调整')}</h3><ul>${q.slots.map((slot,i)=>`<li class="${feedback.matches[i]?'slot-correct':feedback.details?.[i]?.status==='review'?'slot-review':'slot-incorrect'}"><strong>${feedback.matches[i]?'✓':feedback.details?.[i]?.status==='review'?'?':'×'} 第 ${i+1} 空</strong>：${feedback.details?.[i]?.status==='review'?'未充分识别你的表述，不等同答错。':''}${esc(slot.why)}${!feedback.matches[i]?`<br><span class="answer-reference">${isCase?'参考表达':'此处应填'} <code>${esc(slot.answer)}</code></span>`:''}</li>`).join('')}</ul>${!feedback.correct?`<button id="reveal-answer">查看${isCase?'本步参考答案':'完整参考代码'}</button>`:''}</div>`}if(showSolution||feedback?.correct)html+=`<div class="solution"><h3>${isCase?'本步参考答案':'完整参考代码'}</h3><pre>${esc(q.solution)}</pre><small>${isCase?'可参考不同表述，重点核对业务约束与任务覆盖。':'可用于对照理解；也可以回到原 Notebook 独立练习。'}</small></div>`;if((showSolution||feedback?.correct)&&q.websiteReferences)html+=websiteStepReference(q);$('#feedback').innerHTML=html;if($('#reveal-answer'))$('#reveal-answer').onclick=reveal;const passed=feedback?.correct||showSolution||(isCase&&feedback?.details?.some(r=>r.status==='review'));$('#check-button').hidden=!!passed;$('#next-button').hidden=!passed;$('#hint-button').hidden=finished;}
function render(){$('#reset-practice').hidden=progress.mode==='pick';$('#reset-practice').textContent=progress.mode==='original'?(isCase?'重置原题':'重置原题'):'重置本步';$('.step-navigation').hidden=progress.mode==='original';$('#prev-step').disabled=progress.index===0;$('#next-step').disabled=progress.index===course.count-1;$('#step-navigation-label').textContent=`第 ${progress.index+1} 步 / ${course.count} 步`;$('#check-button').textContent='检查答案';const q=current(),draft=values();$('#exercise').hidden=false;$('#finish').hidden=true;$('#course-code').textContent=course.category||(courseId==='b12'?'业务分析 · B1-2':'智能训练 · B2');$('#course-name').textContent=course.title.split(' · ')[1];$('#step-count').textContent=`${progress.index+1} / ${course.count}`;$('#skill-progress').style.width=`${Object.values(progress.records).filter(r=>r.reviewed).length/course.count*100}%`;$('#mastered-count').textContent=`已掌握 ${Object.values(progress.records).filter(r=>r.correct).length} 步`;
document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',progress.mode===b.dataset.mode);b.onclick=()=>{progress.mode=b.dataset.mode;active=0;feedback=null;showSolution=false;finished=false;save();render()}});
const parts=q.code.split('{{}}');let code=esc(parts[0]);q.slots.forEach((slot,i)=>{const cls=feedback?.matches?(feedback.matches[i]?' correct':feedback.details?.[i]?.status==='review'?' review':' incorrect'):'';code+=progress.mode==='pick'?`<button class="blank ${active===i?'active':''}${cls}" data-slot="${i}" aria-label="第 ${i+1} 空${feedback?.matches?(feedback.matches[i]?'，正确':feedback.details?.[i]?.status==='review'?'，待自检':'，错误'):''}">${feedback?.matches?`<span class="blank-result" aria-hidden="true">${feedback.matches[i]?'✓':feedback.details?.[i]?.status==='review'?'?':'×'}</span>`:''}${draft[i]?esc(draft[i]):`空 ${i+1}`}</button>`:`<input class="blank code-input${cls}" data-slot="${i}" value="${esc(draft[i])}" placeholder="空 ${i+1}" aria-label="第 ${i+1} 空" spellcheck="false" autocomplete="off" autocapitalize="off">`;code+=esc(parts[i+1])});
$('#exercise').innerHTML=`<span class="task-tag">${progress.index+1 < 10?'0':''}${progress.index+1} · ${progress.mode==='pick'?(isCase?'补全答题要点':'补全代码'):(isCase?'回忆关键要点':'回忆关键写法')}</span><h1>${esc(q.title)}</h1><p class="task-goal">${esc(q.goal)}</p>${isCase?`<details class="context case-task"><summary>查看本步原题要求</summary><div class="case-rich">${course.tasks[q.taskIndex].promptHTML}</div></details>`:''}${q.context?`<details class="context"><summary>查看已提供的代码</summary><pre>${esc(q.context)}</pre></details>`:''}<div class="code-box"><div class="code-label">${isCase?'答题要点':'PYTHON'} <small>点击空位可切换或修改</small></div><pre class="code-template ${isCase?'case-template':''}">${code}</pre></div>${progress.mode==='pick'?`<div class="bank-caption">第 ${active+1} 空 · ${isCase?'选择合适的要点':'选择合适的代码'}</div><div class="code-bank">${shuffledChoices(q.slots[active].choices).map(choice=>`<button data-choice="${esc(choice)}">${esc(choice)}</button>`).join('')}</div>`:`<p class="type-note">${isCase?'按近义表达与要点进行本地匹配；未识别不等同答错。关键数值和禁止事项仍需准确，请对照参考自检。':'输入函数、字段或参数即可；引号样式和空格差异不影响检查。'}</p>`}`;
document.querySelectorAll('[data-slot]').forEach(b=>{if(progress.mode==='pick')b.onclick=()=>{active=Number(b.dataset.slot);render()};else{b.onfocus=()=>active=Number(b.dataset.slot);b.oninput=e=>{values()[Number(b.dataset.slot)]=e.target.value;feedback=null;showSolution=false;save();renderFeedback()}}});document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{showSolution=false;setValue(b.dataset.choice)});renderFeedback();renderLessons();if(progress.mode==='original')renderOriginal();}
function shuffledChoices(choices){return [...choices].sort((a,b)=>{const hash=s=>[...s].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7);return hash(a)-hash(b)})}
function renderLessons(){$('#lesson-items').innerHTML=course.steps.map((q,i)=>{const r=progress.records[q.id];return `<button data-lesson="${i}" class="${i===progress.index?'current':''}"><span>${r?.correct?'✓':r?.reviewed?'◌':i+1}</span>${esc(q.title)}<small>${r?.correct?'已掌握':r?.needsReview?'待自检':r?.reviewed?'已看答案':'待练习'}</small></button>`}).join('');document.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>{$('#lesson-dialog').close();progress.mode='pick';go(Number(b.dataset.lesson))});}
function finish(){finished=true;$('#exercise').hidden=true;$('#feedback').innerHTML='';$('#finish').hidden=false;const mastered=Object.values(progress.records).filter(r=>r.correct).length;$('#finish').innerHTML=`<div class="finish-icon">✓</div><h1>这一轮练习完成</h1><p>已掌握 ${mastered} / ${course.count} 步</p><p class="task-goal">${isCase?'下一步：进入原题答题，按任务独立组织方案，并核对完整参考答案。':'下一步：下载原题 Notebook，不看提示，再独立完成一遍。'}</p><a class="download-link" href="${course.downloadPath||`materials/${courseId}-reference.ipynb`}" download>下载${isCase?'完整参考答案':'完整参考 Notebook'}</a><button id="practice-again" class="download-link secondary">再练一遍</button><a class="back-link" href="./#skills">返回技能操作 →</a>`;$('#check-button').hidden=true;$('#next-button').hidden=true;$('#hint-button').hidden=true;$('#practice-again').onclick=()=>go(0);window.scrollTo(0,0)}
$('#check-button').onclick=check;$('#next-button').onclick=()=>{if(progress.mode==='original'){progress.mode='pick';go(0);return}progress.index<course.count-1?go(progress.index+1):finish()};$('#hint-button').onclick=()=>{$('#feedback').innerHTML=`<div class="feedback hint"><h3>一点提示</h3><p>${esc(current().hint)}</p></div>`};$('#lesson-map').onclick=()=>$('#lesson-dialog').showModal();$('#close-lessons').onclick=()=>$('#lesson-dialog').close();$('#reference-download').href=course.downloadPath||`materials/${courseId}-reference.ipynb`;$('#source-download').href=`materials/${courseId}-original.zip`;if(isCase){$('#source-download').hidden=true;$('#reference-download').textContent='下载完整参考答案';}$('#restart-course').onclick=()=>{if(confirm('清空本模块练习记录和填写内容，从第一步重新开始？理论知识记录不受影响。')){progress.records={};progress.drafts={};progress.draftsByMode={pick:{},type:{}};progress.caseDrafts={};progress.caseSelf={};progress.originalDraft=undefined;progress.originalSelf=undefined;$('#lesson-dialog').close();go(0)}};
if(isCase){
  $('#case-material').innerHTML=`<details class="context case-task"><summary>查看完整案例背景与运行约束</summary><div class="case-rich">${course.materialHTML}</div></details>`;
  document.querySelector('[data-mode="pick"]').textContent='点选要点';document.querySelector('[data-mode="type"]').textContent='关键填空';document.querySelector('[data-mode="original"]').textContent='原题答题';
  $('.reference-note').innerHTML='参考用户提供答案并对照 2026 样卷整理 · 非官方评分细则<br>要点题支持近义表达匹配，原题按要点辅助自检；不是 AI 阅卷或官方评分。';
}
render();

function renderOriginal(showReference=false){
  if(isCase){renderCaseOriginal(showReference);return;}
  $('#step-count').textContent='原题';$('#feedback').innerHTML='';
  $('#exercise').innerHTML=`<span class="task-tag">原始模板 · 独立补全</span><h1>不看选项，再完整写一遍</h1><p class="task-goal">在下方原题模板中补全所有空白。完成后对照参考解法自检；原题允许等价的 Python 写法，本模式不按字符串直接判错。</p><div class="original-tools"><span>原题代码</span><button id="open-practice-history">▤ 查看前面练习</button></div><textarea class="original-editor" aria-label="原题代码" spellcheck="false" autocapitalize="off">${esc(progress.originalDraft??course.originalCode)}</textarea><section id="python-runner" aria-label="运行 Python 代码"></section>`;
  $('#open-practice-history').onclick=openPracticeHistory;
  window.PythonCodeEditor?.mount($('.original-editor'));
  $('.original-editor').oninput=e=>{progress.originalDraft=e.target.value;save();window.PythonPracticeRunner?.codeChanged()};
  if(window.PythonPracticeRunner)window.PythonPracticeRunner.mount({courseId,getCode:()=>$('.original-editor').value,getSelection:()=>{const editor=$('.original-editor');return {code:editor.value.slice(editor.selectionStart,editor.selectionEnd),lineOffset:editor.value.slice(0,editor.selectionStart).split('\n').length-1}},saveCode:()=>{progress.originalDraft=$('.original-editor').value;save()}});
  $('#hint-button').hidden=true;$('#check-button').hidden=false;$('#check-button').textContent='对照参考解法';$('#next-button').hidden=true;
  if(showReference){$('#feedback').innerHTML=`<section class="solution"><h3>完整参考解法</h3><pre>${esc(course.referenceCode)}</pre></section>${course.websiteCode?`<details class="solution website-reference"><summary>对照指定网站的完整写法</summary><p>${esc(course.websiteNote)}</p><pre>${esc(course.websiteCode)}</pre><a href="${esc(course.websiteURL)}" target="_blank" rel="noopener noreferrer">查看参考来源 ↗</a></details>`:''}<div class="feedback hint"><h3>完成自检</h3><p>核对数据范围、字段、聚合方式、边界条件与模型参数。可下载参考 Notebook 在原题数据上运行。</p><div class="self-check"><button data-self="review">需要复习</button><button data-self="done">已独立完成</button></div><p id="self-saved"></p></div>`;document.querySelectorAll('[data-self]').forEach(b=>b.onclick=()=>{progress.originalSelf=b.dataset.self;save();$('#self-saved').textContent='自评已保存';});}
}

function filledPracticeCode(q,filled){
  return q.code.split('{{}}').map((part,i)=>part+(i<q.slots.length?(filled?.[i]||'________'):'')).join('');
}
function openPracticeHistory(){
  $('#practice-history-items').innerHTML='<p class="history-note">可查看分步练习的填写记录，或展开参考解法。关闭后继续原题，草稿不会改变。</p>'+course.steps.map((q,i)=>{
    const record=progress.records[q.id]||{};
    const versions=Object.entries(record.modeAnswers||{}).filter(([mode])=>['pick','type'].includes(mode));
    if(!versions.length&&progress.drafts[q.id]?.some(Boolean))versions.push(['latest',{values:progress.drafts[q.id]}]);
    return `<section class="history-step"><h3>${i+1}. ${esc(q.title)}</h3>${versions.length?versions.map(([mode,answer])=>`<div class="history-attempt"><h4>${mode==='pick'?'点选补全':mode==='type'?'关键填空':'最近填写'}<span>${answer.matches?(answer.matches.every(Boolean)?'✓ 全部正确':answer.details?.some(r=>r.status==='review')?'有要点待自检':'含错误，请对照修正'):'未检查'}</span></h4><pre>${esc(filledPracticeCode(q,answer.values))}</pre></div>`).join(''):'<p class="history-note">尚无填写记录</p>'}<details class="history-solution"><summary>查看本步参考解法</summary><pre>${esc(q.solution)}</pre><ul>${q.slots.map((slot,j)=>`<li>第 ${j+1} 空：${esc(slot.why)}</li>`).join('')}</ul></details></section>`;
  }).join('');
  $('#practice-history-dialog').showModal();
}
$('#close-practice-history').onclick=()=>$('#practice-history-dialog').close();

$('#prev-step').onclick=()=>go(progress.index-1);
$('#next-step').onclick=()=>go(progress.index+1);
function resetSkillDrag(){
  const card=$('#exercise');card.getAnimations().forEach(a=>a.cancel());card.style.transform='';
}
function skillSwipeDirection(dx,dy,elapsed){
  return elapsed<=800&&Math.abs(dx)>=60&&Math.abs(dx)>Math.abs(dy)*1.6?(dx<0?1:-1):0;
}
let skillDrag=null,blockSkillClick=false;
const skillCard=$('#exercise');
skillCard.addEventListener('touchstart',e=>{
  resetSkillDrag();blockSkillClick=false;
  skillDrag=progress.mode!=='original'&&e.touches.length===1&&!e.target.closest('input,textarea,select,[contenteditable]')?{x:e.touches[0].clientX,y:e.touches[0].clientY,time:Date.now(),index:progress.index}:null;
},{passive:true});
skillCard.addEventListener('touchmove',e=>{
  if(!skillDrag)return;
  if(e.touches.length!==1){skillDrag=null;resetSkillDrag();return;}
  const dx=e.touches[0].clientX-skillDrag.x,dy=e.touches[0].clientY-skillDrag.y;
  if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){skillDrag=null;resetSkillDrag();return;}
  if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.3){
    blockSkillClick=true;
    const edge=(dx>0&&progress.index===0)||(dx<0&&progress.index===course.count-1);
    skillCard.style.transform=`translateX(${edge?dx*0.25:dx}px)`;
  }
},{passive:true});
skillCard.addEventListener('touchcancel',()=>{skillDrag=null;resetSkillDrag();},{passive:true});
skillCard.addEventListener('touchend',e=>{
  const start=skillDrag;skillDrag=null;
  const from=skillCard.style.transform;
  resetSkillDrag();
  if(!start||e.touches.length||e.changedTouches.length!==1||start.index!==progress.index||progress.mode==='original')return;
  const direction=skillSwipeDirection(e.changedTouches[0].clientX-start.x,e.changedTouches[0].clientY-start.y,Date.now()-start.time);
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(direction&&course.steps[progress.index+direction]){
    go(progress.index+direction);
    if(!reduced)skillCard.animate([{transform:`translateX(${direction*30}px)`,opacity:0.7},{transform:'translateX(0)',opacity:1}],{duration:150,easing:'ease-out'});
  }else if(from&&!reduced){skillCard.animate([{transform:from},{transform:'translateX(0)'}],{duration:180,easing:'ease-out'});}
},{passive:true});
skillCard.addEventListener('click',e=>{if(blockSkillClick){e.preventDefault();e.stopPropagation();blockSkillClick=false;}},true);

function renderCaseOriginal(showReference=false){
  $('#step-count').textContent='原题';$('#feedback').innerHTML='';
  progress.caseDrafts=progress.caseDrafts||{};progress.caseSelf=progress.caseSelf||{};
  $('#exercise').innerHTML=`<span class="task-tag">案例方案 · 独立作答</span><h1>按原题任务组织完整方案</h1><p class="task-goal">保留原题要求。表格可以按“字段：内容”逐行填写；流程图可以先用节点、条件分支和箭头写出草稿，再在考试绘图工具中完成。开放方案不按措辞相同与否自动判错。</p><div class="original-tools"><span>逐任务作答</span><button id="open-practice-history">▤ 查看前面练习</button></div>${course.tasks.map((task,i)=>`<section class="case-answer-task"><h2>${i+1}. ${esc(task.title)}</h2><div class="case-rich">${task.promptHTML}</div><textarea class="case-answer-editor" data-task="${task.id}" aria-label="${esc(task.title)}的答案" placeholder="按题目要求逐项回答，内容自动保存…">${esc(progress.caseDrafts[task.id]||'')}</textarea>${showReference?`<details class="case-solution" open><summary>本任务参考答案与核对要点</summary><div id="coverage-${task.id}">${renderCaseCoverage(i,progress.caseDrafts[task.id]||'')}</div><div class="case-rich">${task.answerHTML}</div><label class="case-self"><input type="checkbox" data-case-self="${task.id}" ${progress.caseSelf[task.id]?'checked':''}> 我已逐项核对任务要求与运行约束</label></details>`:''}</section>`).join('')}`;
  $('#open-practice-history').onclick=openPracticeHistory;
  document.querySelectorAll('[data-task]').forEach(area=>area.oninput=e=>{progress.caseDrafts[area.dataset.task]=e.target.value;delete progress.caseSelf[area.dataset.task];save();const coverage=$('#coverage-'+area.dataset.task);if(coverage)coverage.innerHTML=renderCaseCoverage(course.tasks.findIndex(t=>t.id===area.dataset.task),e.target.value)});
  document.querySelectorAll('[data-case-self]').forEach(box=>box.onchange=e=>{progress.caseSelf[box.dataset.caseSelf]=e.target.checked;save()});
  $('#hint-button').hidden=true;$('#next-button').hidden=true;$('#check-button').hidden=false;$('#check-button').textContent='核对要点与参考答案';
}

function websiteStepReference(q){
  return `<details class="solution website-reference"><summary>网站参考：原题空白处的完整表达式</summary><p>${esc(course.websiteNote)}</p>${q.websiteReferences.map((code,i)=>`<h4>写法 ${i+1}</h4><pre>${esc(code)}</pre>`).join('')}<p>${esc(q.websiteHint||'')}</p><a href="${esc(course.websiteURL)}" target="_blank" rel="noopener noreferrer">查看参考来源 ↗</a></details>`;
}

function resetCurrentPractice(){
  const original=progress.mode==='original';
  if(!original&&progress.mode!=='type')return;
  const message=original?'重置本课程的原题填写、自评和运行结果？原题模板会恢复，分步练习记录保留。':'重置当前这一步的关键填空及判定结果？点选补全、其他步骤和原题草稿保留。';
  if(!confirm(message))return;
  if(original){
    delete progress.originalDraft;delete progress.originalSelf;
    progress.caseDrafts={};progress.caseSelf={};
    window.PythonPracticeRunner?.reset();
  }else{
    const id=current().id;
    delete progress.draftsByMode.type[id];
    const record=progress.records[id];
    if(record){
      delete record.modeAnswers?.type;
      const remaining=Object.values(record.modeAnswers||{});
      if(remaining.length){record.correct=remaining.some(r=>r.matches?.every(Boolean));record.reviewed=true;}
      else delete progress.records[id];
    }
  }
  active=0;feedback=null;showSolution=false;finished=false;
  save();render();window.scrollTo(0,0);
}
$('#reset-practice').onclick=resetCurrentPractice;

function renderCaseCoverage(taskIndex,text){
  if(!window.CaseAnswerMatcher)return '';
  const points=window.CaseAnswerMatcher.coverage(course,taskIndex,text);
  const unique=points.filter((p,i)=>points.findIndex(x=>x.label===p.label)===i),covered=unique.filter(p=>p.status==='covered').length;
  return `<section class="case-coverage"><h3>要点辅助核对 · 已识别 ${covered} / ${unique.length}</h3><p>按近义词与关键含义进行本地检查，未识别不代表答错，也不等同正式评分。数值命中仍需核对单位、前提和边界。</p><ul>${unique.map(p=>`<li class="${p.status==='covered'?'slot-correct':p.status==='conflict'?'slot-incorrect':'slot-review'}"><strong>${p.status==='covered'?'✓ 已识别':p.status==='conflict'?'× 请修正':'? 待自检'}</strong> ${esc(p.label)}<small>${esc(p.message)}</small></li>`).join('')}</ul></section>`;
}

$('#study-tips-button').onclick=()=>window.StudyTips?.open(courseId);
