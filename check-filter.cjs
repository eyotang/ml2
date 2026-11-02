const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync(__dirname+'/dist/app.js','utf8');
const functions=app.slice(app.indexOf('function list()'),app.indexOf('function jump('));
const navigate=app.match(/function navigate\(step\)\{[^\n]+/)[0];
const context={state:{view:'all',filter:'all',filterIds:null,current:0,records:{0:{correct:true},2:{correct:false},4:{self:'已掌握'}},favorites:[2]},QUESTIONS:Array.from({length:6},(_,id)=>({id})),clearTimeout:()=>{},timer:null,$:()=>({scrollTop:10}),toast:()=>{},jump:id=>context.state.current=id,assert};
vm.createContext(context);vm.runInContext(functions+'\n'+navigate,context);
vm.runInContext(`
setQuestionFilter('unanswered');assert.equal(list().map(q=>q.id).join(','),'1,3,5');assert.equal(state.current,1);
navigate(1);assert.equal(state.current,3);navigate(-1);assert.equal(state.current,1);
state.records[1]={correct:true};navigate(1);assert.equal(state.current,3);
setQuestionFilter('unanswered');assert.equal(list().map(q=>q.id).join(','),'3,5');
setQuestionFilter('wrong');assert.equal(list().map(q=>q.id).join(','),'2');navigate(1);assert.equal(state.current,2);
setQuestionFilter('all');assert.equal(list().length,6);
for(let i=0;i<6;i++)state.records[i]={correct:true};setQuestionFilter('wrong');assert.equal(list().length,0);
`,context);
console.log('PASS: all/unanswered/wrong filters, next/previous within queue, refresh filter, empty state');
