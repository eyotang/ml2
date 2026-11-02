const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync(__dirname+'/dist/app.js','utf8');
const source=app.slice(app.indexOf('// Keep vertical scrolling'),app.indexOf("$('#mobile-favorite').onclick"));
async function run(){
const handlers={},card={style:{},addEventListener:(n,f)=>handlers[n]=f,getBoundingClientRect:()=>({width:360}),getAnimations:()=>[],animate:()=>({finished:Promise.resolve()})};
let navigated=0;const state={current:1};
vm.runInNewContext(source,{$:()=>card,state,Date,Math,matchMedia:()=>({matches:false}),clearTimeout:()=>{},timer:null,list:()=>[{id:0},{id:1},{id:2}],navigate:n=>navigated=n,toast:()=>{}});
const touch=(x,y)=>({clientX:x,clientY:y});
const start=(x,y,input=false)=>handlers.touchstart({touches:[touch(x,y)],target:{closest:()=>input}});
const move=(x,y)=>handlers.touchmove({touches:[touch(x,y)]});
const end=(x,y)=>handlers.touchend({touches:[],changedTouches:[touch(x,y)]});
start(250,100);move(150,105);assert.ok(card.style.transform?.includes('-100'),'question must follow finger before release');await end(150,105);assert.equal(navigated,1);
navigated=0;start(100,100);move(190,105);assert.ok(card.style.transform.includes('90'));await end(190,105);assert.equal(navigated,-1);
navigated=0;start(100,100);move(125,102);await end(125,102);assert.equal(navigated,0);assert.equal(card.style.transform,'');
start(100,100);move(120,190);await end(10,190);assert.equal(navigated,0);assert.equal(card.style.transform,'');
start(100,100,true);move(10,100);await end(10,100);assert.equal(navigated,0);
console.log('PASS: live drag, next/previous, rebound, vertical scroll, input exclusion');
}run().catch(e=>{console.error(e.message);process.exitCode=1});
