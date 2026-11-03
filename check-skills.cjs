const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const content=fs.readFileSync(__dirname+'/dist/skill-content.js','utf8');
vm.runInNewContext(content+`;assert.equal(SKILL_COURSES.b12.steps.length,12);assert.equal(SKILL_COURSES.b2.steps.length,17);for(const c of Object.values(SKILL_COURSES)){assert.ok(c.websiteURL.includes('87484.app.'));assert.ok(c.websiteCode);assert.equal(c.referenceCode,c.websiteCode);for(const q of c.steps.filter(q=>q.kind!=='case')){assert.ok(q.websiteReferences.includes(q.teacherExpression));assert.ok(q.websiteReferences.length)}}for(const c of Object.values(SKILL_COURSES)){for(const q of c.steps){if(q.kind!=='case'){assert.ok(q.examComments.startsWith('#'));assert.ok(q.code.startsWith(q.examComments));}assert.equal(q.code.split('{{}}').length-1,q.slots.length);assert.ok(!q.solution.includes('{{}}'));for(const slot of q.slots){assert.ok(slot.choices.includes(slot.answer));assert.equal(new Set(slot.choices).size,slot.choices.length);assert.ok(slot.why.length>10)}}}`,{assert});
// A variable blank must follow stratify=, never split the parameter name.
vm.runInNewContext(content+`;const q=SKILL_COURSES.b2.steps[8];assert.ok(q.code.includes('stratify={{}}'));assert.ok(!q.code.includes('stratif{{}}'));assert.equal(q.slots[1].answer,'y');for(const c of Object.values(SKILL_COURSES))for(const q of c.steps){const parts=q.code.split('{{}}');q.slots.forEach((s,i)=>{if(/^[A-Za-z_]\\w*$/.test(s.answer)){assert.ok(!/\\w$/.test(parts[i]));assert.ok(!/^\\w/.test(parts[i+1]))}})}`,{assert});
// Exercise the real page handlers with a minimal document, including incorrect answers and persistence.
const nodes=new Map();const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',style:{},hidden:false,handlers:{},addEventListener(n,f){this.handlers[n]=f},getAnimations:()=>[],animate:()=>{},showModal(){},close(){}});return nodes.get(selector)};
let stored=null;const context={URLSearchParams,location:{search:'?course=b12'},localStorage:{getItem:()=>null,setItem:(k,v)=>stored=JSON.parse(v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{scrollTo:()=>{}},matchMedia:()=>({matches:true}),confirm:()=>true,assert};
vm.createContext(context);vm.runInContext(content+fs.readFileSync(__dirname+'/dist/skills.js','utf8'),context);
vm.runInContext(`
check();assert.ok(document.querySelector('#feedback').innerHTML.includes('还有空位'));
current().slots.forEach((s,i)=>values()[i]=s.choices[1]);check();assert.equal(feedback.correct,false);
values()[0]=current().slots[0].answer;values()[1]=current().slots[1].choices[1];check();assert.equal(feedback.matches.join(','),'true,false');assert.ok(document.querySelector('#exercise').innerHTML.includes(' incorrect'));assert.ok(document.querySelector('#feedback').innerHTML.includes('slot-correct'));assert.ok(document.querySelector('#feedback').innerHTML.includes('slot-incorrect'));
current().slots.forEach((s,i)=>values()[i]=s.answer);check();assert.equal(feedback.correct,true);assert.equal(progress.records[current().id].correct,true);
assert.equal(normalizeCode(' "booking_id" '),normalizeCode("'booking_id'"));
for(let i=0;i<course.count;i++){go(i);current().slots.forEach((s,j)=>values()[j]=s.answer);check();assert.equal(feedback.correct,true)}
finish();assert.equal(finished,true);assert.equal(Object.values(progress.records).filter(r=>r.correct).length,12);
progress.originalDraft='正在填写的原题';const originalIndex=progress.index;progress.mode='original';render();openPracticeHistory();assert.ok(document.querySelector('#practice-history-items').innerHTML.includes('点选补全'));assert.ok(document.querySelector('#practice-history-items').innerHTML.includes('drop_duplicates'));assert.ok(document.querySelector('#practice-history-items').innerHTML.includes('参考解法'));assert.equal(progress.originalDraft,'正在填写的原题');assert.equal(progress.index,originalIndex);assert.equal(progress.mode,'original');assert.ok(document.querySelector('#exercise').innerHTML.includes('原题模板'));check();assert.ok(document.querySelector('#feedback').innerHTML.includes('完整参考解法'));assert.ok(document.querySelector('#feedback').innerHTML.includes('指定网站的完整写法'));progress.mode='pick';
go(0);reveal();assert.equal(showSolution,true);assert.equal(progress.records[current().id].reviewed,true);

// Previous/next preserve answers, and do not mark an unanswered step as completed.
const firstDraft=JSON.stringify(progress.drafts[course.steps[0].id]);
document.querySelector('#next-step').onclick();assert.equal(progress.index,1);
document.querySelector('#prev-step').onclick();assert.equal(progress.index,0);assert.equal(JSON.stringify(progress.drafts[course.steps[0].id]),firstDraft);
const card=document.querySelector('#exercise');
const start=(x,y,input=false)=>card.handlers.touchstart({touches:[{clientX:x,clientY:y}],target:{closest:()=>input}});
const end=(x,y)=>card.handlers.touchend({touches:[],changedTouches:[{clientX:x,clientY:y}]});
start(200,100);end(100,105);assert.equal(progress.index,1);
start(100,100);end(200,105);assert.equal(progress.index,0);
start(100,100);end(200,105);assert.equal(progress.index,0);
progress.mode='type';start(200,100);end(100,105);assert.equal(progress.index,1);
start(200,100,true);end(100,105);assert.equal(progress.index,1);
progress.mode='original';start(200,100);end(100,105);assert.equal(progress.index,1);
`,context);
assert.equal(Object.keys(stored.b12.records).length,12);
console.log('PASS: 29 step schemas, blank selection, wrong/correct checks, hints, completion, local persistence');
