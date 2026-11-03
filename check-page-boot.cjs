const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const current=fs.readFileSync('dist/skills.html','utf8');
const variants=[['current',current],['cached without bulk reset',current.replace(/<button id="reset-all-practice">.*?<\/button>/,'')]];
for(const [label,html] of variants){
 const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));
 const nodes=new Map();
 const node=s=>{
  if(s.startsWith('#')&&!ids.has(s.slice(1)))return null;
  if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',style:{},hidden:false,getAnimations:()=>[],animate(){},addEventListener(){},insertAdjacentHTML(position,markup){for(const m of markup.matchAll(/id="([^"]+)"/g))ids.add(m[1]);},showModal(){},close(){}});
  return nodes.get(s);
 };
 const ctx={URLSearchParams,location:{search:'?course=b2'},localStorage:{getItem:()=>null,setItem(){}},document:{querySelector:node,querySelectorAll:()=>[]},window:{scrollTo(){}},matchMedia:()=>({matches:true}),confirm:()=>false};
 vm.createContext(ctx);
 for(const file of ['skill-content.js','case-content.js','case-matcher.js','skills.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),ctx,{filename:file});
 assert.ok(node('#exercise').innerHTML.includes('转换发车时间'),label+': B2 answer area must contain the first question');
 console.log('PASS',label,'B2 question rendered');
}
