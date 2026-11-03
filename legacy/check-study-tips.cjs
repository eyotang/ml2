const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let dialog;const ctx={window:{},document:{querySelector:()=>dialog,body:{append(node){dialog=node}},createElement(){return {innerHTML:'',setAttribute(){},querySelector(){return this.button||(this.button={})},showModal(){this.open=true},close(){this.open=false}}}}};
vm.runInNewContext(fs.readFileSync(__dirname+'/study-tips.js','utf8'),ctx);
for(const key of ['b11','b12','b2','b3','b4','theory','a1','a2','a3','a4','a5','a6']){
 const tip=ctx.window.StudyTips.forCourse(key);assert.ok(tip.framework);assert.ok(tip.points.length);assert.ok(tip.checklist.length);
 ctx.window.StudyTips.open(key);assert.equal(dialog.open,true);assert.ok(dialog.innerHTML.includes('ai-trainer-exam-courseware.app.workbuddy.host'));dialog.button.onclick();assert.equal(dialog.open,false);
}
assert.ok(ctx.window.StudyTips.forCourse('b2').checklist.some(x=>x.includes('当前输出')));
console.log('PASS: 5 skill courses, 6 essay tips, general tips, source link, dialog open/close');
