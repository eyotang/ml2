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
// Bulk reset must cover every step and preserve the other mode, original work and other modules.
for(const id of ['b12','b11','b2','b3','b4'])for(const mode of ['pick','type']){
 const nodes=new Map(),node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',style:{},getAnimations:()=>[],animate(){},addEventListener(){},showModal(){},close(){}});return nodes.get(s)};
 let allowed=false,stored;const ctx={assert,mode,URLSearchParams,location:{search:'?course='+id},localStorage:{getItem:()=>null,setItem:(k,v)=>stored=JSON.parse(v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{scrollTo(){}},confirm:()=>allowed,matchMedia:()=>({matches:true})};
 vm.createContext(ctx);vm.runInContext(sources,ctx);
 vm.runInContext(`
 const other=mode==='pick'?'type':'pick';
 all.untouched={draft:'另一个模块'};
 for(let i=0;i<course.count;i++)for(const m of ['pick','type']){progress.mode=m;go(i);current().slots.forEach((s,j)=>values()[j]=s.answer);check();}
 progress.originalDraft='原题代码';progress.caseDrafts={task:'文字'};progress.flowDrafts={task:['流程图']};progress.caseSelf={task:true};
 progress.mode=mode;render();assert.equal(document.querySelector('#reset-all-practice').hidden,false);
 const before=JSON.stringify(progress);resetAllPractice();assert.equal(JSON.stringify(progress),before);
 `,ctx);
 allowed=true;
 vm.runInContext(`
 resetAllPractice();assert.equal(progress.index,0);assert.equal(progress.mode,mode);assert.ok(values().every(v=>v===''));
 for(const q of course.steps){assert.ok(!progress.draftsByMode[mode][q.id]?.some(Boolean));assert.ok(progress.draftsByMode[other][q.id].some(Boolean));assert.ok(!progress.records[q.id].modeAnswers[mode]);assert.ok(progress.records[q.id].modeAnswers[other]);}
 assert.equal(progress.originalDraft,'原题代码');assert.equal(progress.caseDrafts.task,'文字');assert.equal(progress.flowDrafts.task[0],'流程图');assert.equal(progress.caseSelf.task,true);assert.equal(all.untouched.draft,'另一个模块');
 assert.equal(feedback,null);assert.equal(showSolution,false);
 progress.mode='original';render();assert.equal(document.querySelector('#reset-all-practice').hidden,true);
 `,ctx);assert.ok(stored[id]);assert.ok(Object.values(stored[id].drafts).every(a=>a.every(v=>!v)));console.log('PASS',id,mode,'bulk cancel/reset, all steps, other mode/module and original work preserved');
}
