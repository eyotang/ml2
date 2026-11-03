const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/skill-content.js','utf8')+fs.readFileSync('dist/case-content.js','utf8');
for(const id of ['b11','b3']){
 const nodes=new Map(),node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',style:{},getAnimations:()=>[],animate(){},addEventListener(){},showModal(){},close(){}});return nodes.get(s)};
 let stored;const ctx={assert,URLSearchParams,location:{search:'?course='+id},localStorage:{getItem:()=>null,setItem:(k,v)=>stored=JSON.parse(v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{scrollTo(){}},matchMedia:()=>({matches:true}),confirm:()=>true};vm.createContext(ctx);
 vm.runInContext(source+fs.readFileSync('dist/case-matcher.js','utf8')+fs.readFileSync('dist/skills.js','utf8'),ctx);
 vm.runInContext(String.raw`
 const flowSteps=course.steps.filter(q=>q.flowchartHTML);assert.equal(flowSteps.length,courseId==='b11'?3:6);
 for(const q of flowSteps){
  const refs=[...q.flowchartHTML.matchAll(/\{\{(\d+)\}\}/g)].map(m=>Number(m[1])).sort();assert.equal(refs.join(','),q.slots.map((_,i)=>i).join(','));
  go(course.steps.indexOf(q));assert.ok(document.querySelector('#exercise').innerHTML.includes('flow-decision'));assert.ok(!document.querySelector('#exercise').innerHTML.includes('undefined'));
  q.slots.forEach((s,j)=>values()[j]=s.answer);check();assert.equal(feedback.correct,true);assert.ok(document.querySelector('#feedback').innerHTML.includes('flow-canvas'));
 }
 const task=course.tasks.find(t=>t.flowchart);assert.ok(task.answerHTML.includes('flow-decision'));assert.ok(task.answerHTML.includes('marker-end'));assert.ok(task.answerHTML.includes('业务流程图'));
 progress.mode='original';progress.flowDrafts={[task.id]:task.flowchart.slots.map(s=>s.answer)};progress.caseDrafts={[task.id]:'已有文字答案'};render();check();
 const html=document.querySelector('#exercise').innerHTML;assert.equal((html.match(/data-flow-slot=/g)||[]).length,task.flowchart.slots.length);assert.ok(!html.includes('{{'));assert.ok(html.includes('已有文字答案'));assert.ok(html.includes(' correct'));save();
 assert.ok(renderCaseCoverage(course.tasks.indexOf(task),'').includes('已识别'));
 progress.mode='type';resetCurrentPractice();assert.ok(progress.flowDrafts[task.id]);
 progress.mode='original';resetCurrentPractice();assert.equal(Object.keys(progress.flowDrafts).length,0);
 `,ctx);assert.ok(stored[id]);console.log('PASS',id,'diagram slots, typed/drawn reference, original draft persistence, matching, isolated resets');
}
