const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/dist/skill-content.js','utf8')+fs.readFileSync(__dirname+'/dist/case-content.js','utf8');
for(const id of ['b11','b3','b4','c']){
 const nodes=new Map(),node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',style:{},getAnimations:()=>[],animate(){},addEventListener(){},showModal(){},close(){}});return nodes.get(s)};
 let stored;
 const ctx={assert,URLSearchParams,location:{search:'?course='+id},localStorage:{getItem:()=>null,setItem:(k,v)=>stored=JSON.parse(v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{scrollTo(){}},matchMedia:()=>({matches:true}),confirm:()=>true};
 vm.createContext(ctx);vm.runInContext(source+fs.readFileSync(__dirname+'/dist/case-matcher.js','utf8')+fs.readFileSync(__dirname+'/dist/skills.js','utf8'),ctx);
 vm.runInContext(`
 assert.equal(isCase,true);assert.equal(course.kind,'case');assert.equal(course.tasks.length,courseId==='b3'?2:3);
 for(let i=0;i<course.count;i++){
   go(i);const q=current();assert.ok(course.tasks[q.taskIndex]);assert.equal(q.code.split('{{}}').length-1,q.slots.length);
   q.slots.forEach((s,j)=>{assert.ok(s.choices.includes(s.answer));assert.equal(new Set(s.choices).size,s.choices.length);values()[j]=s.answer});
   check();assert.equal(feedback.correct,true);
   values()[0]=q.slots[0].choices[1];check();assert.equal(feedback.matches[0],false);
   if(q.slots[0].accepted?.length){values()[0]=q.slots[0].accepted[0];check();assert.equal(feedback.matches[0],true)}
 }
 const first=course.tasks[0].id;progress.caseDrafts={[first]:'我的独立方案草稿'};progress.mode='original';render();
 assert.ok(document.querySelector('#exercise').innerHTML.includes('我的独立方案草稿'));
 check();assert.ok(document.querySelector('#exercise').innerHTML.includes('本任务参考答案'));assert.ok(document.querySelector('#exercise').innerHTML.includes('要点辅助核对'));assert.equal(progress.caseDrafts[first],'我的独立方案草稿');
 openPracticeHistory();assert.ok(document.querySelector('#practice-history-items').innerHTML.includes('参考解法'));
 for(const task of course.tasks){assert.ok(task.promptHTML);assert.ok(task.answerHTML.length>100);assert.ok(!/<script|onerror|javascript:/i.test(task.answerHTML))}
 assert.ok(!/<script|onerror|javascript:/i.test(course.materialHTML));
 if(courseId==='c'){assert.equal(course.count,12);const config=JSON.parse(course.tasks[1].answerHTML.split('<pre>')[1].split('</pre>')[0].replace(/&quot;/g,'\"'));assert.equal(config.forecast_window_minutes,15);assert.equal(config.manual_confirm_required,true);assert.ok(course.steps[3].flowchartHTML.includes('flow-decision'));assert.ok(course.tasks[1].flowchart);assert.ok(course.tasks[2].answerHTML.includes('待确认'));}
 if(courseId==='b11')assert.ok(course.tasks[1].answerHTML.includes('业务流程图'));
 if(courseId==='b3'){assert.ok(course.tasks[0].answerHTML.includes('8 个主要节点'));assert.ok(course.tasks[1].answerHTML.includes('1478.4'))}
 `,ctx);
 assert.ok(stored[id]);console.log('PASS',id,'task coverage, every blank right/wrong, aliases, original draft and reference, sanitized data');
}
