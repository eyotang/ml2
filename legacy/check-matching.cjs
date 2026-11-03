const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},assert};vm.createContext(ctx);vm.runInContext(['skill-content.js','case-content.js','case-matcher.js'].map(f=>fs.readFileSync(__dirname+'/'+f,'utf8')).join('\n'),ctx);
vm.runInContext(`
const matcher=window.CaseAnswerMatcher;
const slots=SKILL_COURSES.b11.steps.flatMap(q=>q.slots);
const slot=answer=>slots.find(s=>s.answer===answer);
assert.equal(matcher.check(slot('现场采集与图像质量校验'),'采集图片并检查图像质量').status,'covered');
assert.equal(matcher.check(slot('质检员'),'质量检查人员').status,'covered');
assert.equal(matcher.check(slot('补拍一次'),'重新拍摄一次').status,'covered');
assert.equal(matcher.check(slot('人员、理由及时间'),'记录操作人、修改原因和操作时间').status,'covered');
assert.equal(matcher.check(slot('人工复核'),'无需人工复核').status,'review');
assert.equal(matcher.check(slot('人工复核'),'人工复核可以省略').status,'review');
assert.equal(matcher.check(slot('自动隔离待处理'),'直接报废').status,'conflict');
assert.equal(matcher.check(slot('现场采集与图像质量校验'),'自定义采集模块').status,'review');
const numeric=SKILL_COURSES.b3.steps[2].slots[1];
assert.equal(matcher.check(numeric,'1500').status,'covered');assert.notEqual(matcher.check(numeric,'15000').status,'covered');
assert.equal(matcher.check(numeric,'预测负荷达到1500kW',{longAnswer:true}).status,'covered');
assert.notEqual(matcher.check(numeric,'预测负荷达到15000kW',{longAnswer:true}).status,'covered');
const points=matcher.coverage(SKILL_COURSES.b11,0,'现场采集图片并检查图像质量，人工复核并隔离处理，包装前检查最新状态，改判记录操作人、原因和时间。');
assert.ok(points.filter(p=>p.status==='covered').length>=4);
for(const c of [SKILL_COURSES.b11,SKILL_COURSES.b3,SKILL_COURSES.b4])for(const q of c.steps)for(const s of q.slots){assert.equal(matcher.check(s,s.answer).status,'covered');for(const bad of s.choices.filter(v=>v!==s.answer))assert.notEqual(matcher.check(s,bad).status,'covered')}
`,ctx);
console.log('PASS: synonyms, concept groups, negation, contradiction, numeric boundaries, full-answer coverage, every canonical answer and distractor');
