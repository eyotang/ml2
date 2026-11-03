const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map(),node=s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',style:{},getAnimations:()=>[],animate(){},addEventListener(){},showModal(){},close(){}});return nodes.get(s)};
let stored;const ctx={assert,URLSearchParams,location:{search:'?course=b12'},localStorage:{getItem:()=>null,setItem:(k,v)=>stored=JSON.parse(v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{scrollTo(){},PythonPracticeRunner:{mount(){},codeChanged(){},reset(){}}},matchMedia:()=>({matches:true}),confirm:()=>true};
vm.createContext(ctx);for(const f of ['skill-content.js','case-matcher.js','skills.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),ctx);
vm.runInContext(`
assert.equal(course.steps.length,12);assert.equal(course.tasks.length,2);assert.equal(course.tasks[0].id,'b12t2');assert.equal(course.tasks[1].id,'b12t3');
const firstCode=course.steps[0].id;progress.mode='pick';values()[0]='drop_duplicates';save();
for(let i=7;i<12;i++){
 go(i);assert.equal(isWrittenStep(),true);assert.ok(document.querySelector('#exercise').innerHTML.includes('答题要点'));
 for(const mode of ['pick','type']){progress.mode=mode;current().slots.forEach((s,j)=>values()[j]=s.answer);check();assert.equal(feedback.correct,true);}
 values()[0]='我的其他合理方案';check();assert.equal(feedback.details[0].status,'review');
 for(const slot of current().slots)for(const wrong of slot.choices.slice(1))assert.equal(window.CaseAnswerMatcher.check(slot,wrong).status,'conflict');
}
assert.equal(progress.draftsByMode.pick[firstCode][0],'drop_duplicates');
progress.caseDrafts={b12t2:'任务二草稿',b12t3:'任务三草稿'};progress.originalDraft='任务一代码草稿';progress.mode='original';render();
const html=document.querySelector('#exercise').innerHTML;assert.ok(html.includes('任务二草稿'));assert.ok(html.includes('任务三草稿'));assert.ok(html.includes('任务一代码草稿'));assert.ok(html.includes('id="python-runner"'));assert.ok(html.includes('id="written-b12t2"'));assert.ok(html.includes('id="written-b12t3"'));
check();assert.ok(document.querySelector('#exercise').innerHTML.includes('数据使用'));assert.ok(document.querySelector('#exercise').innerHTML.includes('验证方法'));assert.ok(document.querySelector('#exercise').innerHTML.includes('要点辅助核对'));
assert.equal(progress.originalDraft,'任务一代码草稿');assert.equal(progress.caseDrafts.b12t2,'任务二草稿');assert.equal(progress.caseDrafts.b12t3,'任务三草稿');save();
assert.equal(window.CaseAnswerMatcher.check(course.steps[8].slots[1],'需考虑座位人数和投屏设备').status,'covered');
assert.equal(window.CaseAnswerMatcher.check(course.steps[9].slots[0],'避免数据泄漏').status,'covered');
assert.ok(course.referenceCode.includes('pd.read_csv'));assert.ok(!course.referenceCode.includes('任务二'));
`,ctx);
assert.equal(stored.b12.caseDrafts.b12t3,'任务三草稿');
const csv=name=>{const lines=fs.readFileSync('dist/materials/data/'+name,'utf8').trim().replace(/^\uFEFF/,'').split(/\r?\n/);const heads=lines.shift().split(',');return lines.map(l=>Object.fromEntries(l.split(',').map((v,i)=>[heads[i],v])))};
const clean=[...new Map(csv('meeting_bookings.csv').map(r=>[r.booking_id,r])).values()],valid=clean.filter(r=>r.status!=='已取消');assert.equal(clean.length,240);assert.equal(valid.length,216);
for(const [name,count,noShow] of [['午间',42,15],['傍晚',54,18],['上午',60,6],['下午',60,3]]){const group=valid.filter(r=>r.time_slot===name);assert.equal(group.length,count);assert.equal(group.filter(r=>r.status==='爽约').length,noShow)}
const candidates=csv('meeting_rooms.csv').filter(r=>{const used=valid.filter(b=>b.room_id===r.room_id&&b.status==='已使用');const rate=used.reduce((n,b)=>n+Number(b.attendees)/Number(r.capacity),0)/used.length;return +r.capacity>=12&&used.length>=20&&rate<.4}).map(r=>r.room_name);assert.deepEqual(candidates,['冬青室','星河室']);
console.log('PASS B1-2 tasks 2/3: 5 written steps, both modes, semantic checks, original drafts, Python coexistence, independent CSV facts');
