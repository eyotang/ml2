const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=['questions.js','answers.js'].map(f=>fs.readFileSync(__dirname+'/dist/'+f,'utf8')).join('\n');
vm.runInNewContext(source+`\nassert.deepEqual(Array.from({length:4},(_,i)=>QUESTIONS.filter(q=>q.type===i).length),[14,56,7,6]);assert.equal(QUESTIONS.filter(q=>q.type<3&&!q.answer).length,0);for(const q of QUESTIONS){assert.ok(q.text.length>10);if(q.type===1||q.type===2)assert.equal(q.options.length,4);if(q.answer)for(const i of q.answer)assert.ok(i>=0&&i<q.options.length);if(q.type===3)assert.equal(q.points.length,6)}assert.equal(SINGLE_KEYS.length,56);assert.equal(S_EXPLAIN.length,56);`,{assert});
new vm.Script(fs.readFileSync(__dirname+'/dist/app.js','utf8'));
console.log('PASS: 83 questions, answer bounds, 4 options, reference points, complete objective answers, JS syntax');

const app=fs.readFileSync(__dirname+'/dist/app.js','utf8');
const swipe=app.match(/function swipeDirection\(dx,dy,elapsed\)\{[\s\S]*?\n\}/)[0];
vm.runInNewContext(swipe+`;assert.equal(swipeDirection(-90,10,300),1);assert.equal(swipeDirection(90,-10,300),-1);assert.equal(swipeDirection(20,2,100),0);assert.equal(swipeDirection(80,90,300),0);assert.equal(swipeDirection(90,0,1000),0);`,{assert});
console.log('PASS: left/right swipe, tap, vertical scroll, long gesture');

vm.runInNewContext(source+`;for(const q of QUESTIONS.filter(q=>q.type<3)){assert.ok(q.answer.length);assert.ok(q.explanation.trim())}for(const [id,answer] of [[8,1],[24,1],[27,2]]){const q=QUESTIONS[id];assert.equal(q.answer[0],answer);assert.ok(q.source.url.startsWith('https://'));assert.ok(q.explanation.includes('条'))}`,{assert});
console.log('PASS: all 77 objective questions have answers and explanations; 3 legal answers have sources');
