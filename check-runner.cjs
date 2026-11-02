const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function element(tag){return {tag,children:[],textContent:'',append(...nodes){this.children.push(...nodes)},replaceChildren(){this.children=[]},setAttribute(){}}}
const host=element('section'),instances=[];
class FakeWorker{constructor(url,options){assert.equal(options.type,'module');instances.push(this)}postMessage(data){this.message=data}terminate(){this.stopped=true}}
let code='x = 1\nprint(x)',saved=0;
const context={window:{},document:{baseURI:'https://example.test/study/skills.html',querySelector:()=>host,createElement:element},Worker:FakeWorker,URL,confirm:()=>true};
vm.runInNewContext(fs.readFileSync(__dirname+'/dist/python-runner.js','utf8'),context);
const controls=()=>host.children[0].children;
context.window.PythonPracticeRunner.mount({courseId:'b12',getCode:()=>code,getSelection:()=>({code:'print(x)',lineOffset:1}),saveCode:()=>saved++});
controls()[0].onclick();assert.equal(instances[0].message.fresh,true);assert.equal(instances[0].message.files.length,2);assert.equal(saved,1);assert.equal(controls()[0].disabled,true);
instances[0].onmessage({data:{type:'stdout',text:'<script>not executable</script>'}});assert.equal(host.children[2].children[0].textContent,'<script>not executable</script>');
instances[0].onmessage({data:{type:'done'}});assert.equal(controls()[0].disabled,false);
code='print(2)';context.window.PythonPracticeRunner.codeChanged();assert.ok(host.children[1].textContent.includes('代码已修改'));
controls()[1].onclick();assert.equal(instances[0].message.fresh,false);assert.equal(instances[0].message.code,'\nprint(x)');
controls()[2].onclick();assert.equal(instances[0].stopped,true);assert.equal(code,'print(2)');
controls()[0].onclick();assert.equal(instances.length,2);instances[1].onmessage({data:{type:'error',text:'NameError'}});assert.equal(instances[1].stopped,true);
controls()[3].onclick();assert.equal(host.children[2].children.length,0);
console.log('PASS: full/selected execution, local data URLs, escaped output, stale result notice, stop/retry/reset, draft preservation');
