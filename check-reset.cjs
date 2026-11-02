const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const sources=['skill-content.js','case-content.js','case-matcher.js','skills.js'].map(f=>fs.readFileSync(__dirname+'/dist/'+f,'utf8')).join('\n');
for(const id of ['b12','b11']){
 const nodes=new Map(),node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',style:{},getAnimations:()=>[],animate(){},addEventListener(){},showModal(){},close(){}});return nodes.get(s)};
 let allowed=false,resets=0;const ctx={assert,URLSearchParams,location:{search:'?course='+id},localStorage:{getItem:()=>null,setItem(){}},document:{querySelector:node,querySelectorAll:()=>[]},window:{scrollTo(){},PythonPracticeRunner:{mount(){},reset(){resets++}}},confirm:()=>allowed,matchMedia:()=>({matches:true})};
 vm.createContext(ctx);vm.runInContext(sources,ctx);
 vm.runInContext(`
 progress.mode='pick';current().slots.forEach((s,i)=>values()[i]=s.answer);check();
 progress.mode='type';current().slots.forEach((s,i)=>values()[i]=s.answer);check();
 progress.draftsByMode.type[course.steps[1].id]=['另一题的填写'];progress.originalDraft='原题草稿';
 const before=JSON.stringify(progress);resetCurrentPractice();assert.equal(JSON.stringify(progress),before);
 `,ctx);
 allowed=true;
 vm.runInContext(`
 resetCurrentPractice();assert.ok(values().every(v=>v===''));assert.ok(progress.draftsByMode.pick[current().id].some(Boolean));assert.ok(progress.records[current().id].modeAnswers.pick);assert.ok(!progress.records[current().id].modeAnswers.type);assert.equal(progress.originalDraft,'原题草稿');assert.equal(progress.draftsByMode.type[course.steps[1].id][0],'另一题的填写');
 progress.mode='original';progress.originalDraft='独立代码';progress.originalSelf='done';progress.caseDrafts={task:'方案'};progress.caseSelf={task:true};resetCurrentPractice();assert.equal(progress.originalDraft,undefined);assert.equal(progress.originalSelf,undefined);assert.equal(Object.keys(progress.caseDrafts).length,0);assert.equal(Object.keys(progress.caseSelf).length,0);assert.ok(progress.draftsByMode.pick[current().id].some(Boolean));assert.ok(progress.records[current().id].modeAnswers.pick);
 `,ctx);
 assert.equal(resets,1);console.log('PASS',id,'cancel, per-step keyword reset, original template reset, other modes and steps preserved, runtime reset');
}
