function updateHomeProgress(){
  let state={};try{state=JSON.parse(localStorage.getItem('zhilian-v1'))||{}}catch{}
  const records=Object.values(state.records||{}),graded=records.filter(r=>typeof r.correct==='boolean'),correct=graded.filter(r=>r.correct).length;
  document.querySelector('#home-progress').textContent=`${records.length} / 83`;
  document.querySelector('.practice-circle').style.setProperty('--progress',`${records.length/83*100}%`);
  document.querySelector('#home-done').textContent=records.length;
  document.querySelector('#home-correct').textContent=correct;
  document.querySelector('#home-wrong').textContent=`${graded.length-correct} 道待复习`;
  document.querySelector('#home-favorites').textContent=`已收藏 ${(state.favorites||[]).length} 道题`;
  document.querySelector('#home-rate').textContent=graded.length?`${Math.round(correct/graded.length*100)}%`:'—';
}
function selectModule(){
  const module=['theory','skills','review'].includes(location.hash.slice(1))?location.hash.slice(1):'theory';
  document.querySelectorAll('[data-module]').forEach(a=>{const active=a.dataset.module===module;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  document.querySelectorAll('.module-panel').forEach(panel=>panel.hidden=panel.id!==module);
}
addEventListener('hashchange',selectModule);addEventListener('pageshow',updateHomeProgress);addEventListener('storage',updateHomeProgress);selectModule();updateHomeProgress();
