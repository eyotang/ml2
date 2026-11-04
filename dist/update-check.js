/* Static-host release discovery. Never clear local learning records. */
(() => {
  const current = document.documentElement.dataset.appVersion;
  if (!current) return;
  let pending, checking = false;
  function show(version) {
    pending = version;
    if (document.getElementById('release-update')) return;
    const bar = document.createElement('aside');
    bar.id = 'release-update';
    bar.setAttribute('role', 'status');
    bar.style.cssText='position:fixed;z-index:10000;bottom:calc(12px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);max-width:90vw;width:max-content;background:var(--theme-surface,#fff);color:var(--ink,#173c38);border:1px solid #20a592;border-radius:12px;padding:12px;box-shadow:0 4px 24px #0003;font:14px/1.6 system-ui;display:flex;gap:12px;align-items:center';
    const label=document.createElement('span');label.textContent='新版本已就绪，学习记录会保留。';
    const update=document.createElement('button');update.style.cssText='flex:none;white-space:nowrap;font:inherit';update.textContent='更新题目';update.onclick=()=>{
      const url=new URL(location.href);url.searchParams.set('_v',pending);location.replace(url.href);
    };
    const later=document.createElement('button');later.style.cssText='flex:none;white-space:nowrap;font:inherit';later.textContent='稍后';later.onclick=()=>bar.remove();
    bar.append(label,update,later);document.body.append(bar);
  }
  async function check() {
    if(checking||document.hidden)return;
    checking=true;
    try {
      const response=await fetch(new URL('version.json?_='+Date.now(),document.baseURI),{cache:'no-store'});
      if(!response.ok)return;
      const data=await response.json();
      if(typeof data.version==='string'&&/^[a-f0-9]{16}$/.test(data.version)&&data.version!==current)show(data.version);
    }catch{/* Offline learners keep their current page. */}finally{checking=false}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check,{once:true});else check();
  window.addEventListener('pageshow',check);
  document.addEventListener('visibilitychange',check);
  window.addEventListener('error',e=>{if(e.target?.tagName==='SCRIPT')check()},true);
  setInterval(check,60000);
})();
