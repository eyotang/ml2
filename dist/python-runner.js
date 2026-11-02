(() => {
  const dataFiles={b12:['meeting_bookings.csv','meeting_rooms.csv'],b2:['cold_chain_shipments.csv']};
  let config,worker,busy=false,status='环境按需加载，点击运行后开始。',outputs=[],outputSize=0,truncated=false,lastSource=null;
  function push(item){
    const size=JSON.stringify(item).length;
    if(outputs.length>=300||outputSize+size>3000000){if(!truncated){outputs.push({kind:'stderr',text:'输出过多，已截断显示；可以停止运行并调整代码。'});truncated=true;}return;}
    outputs.push(item);outputSize+=size;
  }
  function root(){return document.querySelector('#python-runner')}
  function stop(text){worker?.terminate();worker=null;busy=false;status=text;draw();}
  function draw(){const host=root();if(!host)return;host.replaceChildren();
    const toolbar=document.createElement('div');toolbar.className='runner-toolbar';
    for(const [label,action,disabled] of [['▶ 运行全部',()=>run(true),busy],['运行选中代码',()=>run(false),busy],['停止',()=>stop('已停止，运行环境已释放；已填写的代码保留。'),!busy],['重置环境',()=>{if(busy&&!confirm('正在运行，确定停止并重置 Python 环境？填写的代码不会清除。'))return;outputs=[];outputSize=0;truncated=false;stop('环境已重置，下次运行会重新初始化。');},false]]){
      const b=document.createElement('button');b.textContent=label;b.onclick=action;b.disabled=disabled;toolbar.append(b);
    }
    const caption=document.createElement('p');caption.className='runner-status';caption.textContent=!busy&&outputs.length&&lastSource!==config.getCode()?'代码已修改，下方是上次运行结果；请重新运行。':status;caption.setAttribute('role','status');
    const region=document.createElement('div');region.className='runner-output';region.setAttribute('aria-label','Python 运行输出');
    for(const item of outputs){
      if(item.kind==='table'){
        const wrap=document.createElement('div');wrap.className='runner-table';const table=document.createElement('table');const head=document.createElement('tr');
        for(const value of item.columns){const th=document.createElement('th');th.textContent=value;head.append(th)}table.append(head);
        for(const row of item.rows){const tr=document.createElement('tr');for(const value of row){const td=document.createElement('td');td.textContent=value;tr.append(td)}table.append(tr)}
        wrap.append(table);const note=document.createElement('small');note.textContent=`${item.totalRows} 行 × ${item.totalColumns} 列${item.totalRows>100||item.totalColumns>30?'（预览最多 100 行、30 列）':''}`;wrap.append(note);region.append(wrap);
      }else if(item.kind==='image'){
        const img=document.createElement('img');img.alt='Python 生成的图表';img.src='data:image/png;base64,'+item.data;region.append(img);
      }else{const pre=document.createElement('pre');pre.className=item.kind==='stderr'?'runner-error':'';pre.textContent=item.text;region.append(pre);}
    }
    host.append(toolbar,caption,region);
    const note=document.createElement('small');note.className='runner-note';note.textContent='真实 Python 运算 · 原题 CSV 自动载入 · 运行全部从干净变量环境开始；运行选中代码沿用当前变量。首次需联网加载运行库。';host.append(note);
  }
  function run(fresh){if(busy||!config)return;
    const selection=config.getSelection();const code=fresh?config.getCode():selection.code;
    if(!code.trim()){status=fresh?'请先填写代码。':'请先在代码框中选中需要运行的完整语句。';draw();return;}
    config.saveCode();lastSource=config.getCode();outputs=[];outputSize=0;truncated=false;busy=true;status='准备运行…';draw();
    try{
      if(!worker){worker=new Worker(new URL('python-worker.js?v=24',document.baseURI),{type:'module'});
        worker.onmessage=({data})=>{
          if(data.type==='status')status=data.text;
          else if(data.type==='stdout'||data.type==='stderr')push({kind:data.type,text:data.text});
          else if(data.type==='display')push(data.value);
          else if(data.type==='done'){busy=false;status='运行完成。输出为当前代码的真实结果，不代表已自动判分。';}
          else if(data.type==='error'){busy=false;status='运行出错，请根据下方信息修改代码。';push({kind:'stderr',text:data.text});if(!data.recoverable){worker.terminate();worker=null;}}
          draw();
        };
        worker.onerror=event=>{push({kind:'stderr',text:event.message||'Python 环境加载失败，请检查网络或部署网站的运行文件访问权限。'});stop('运行环境未能启动；代码已保留，可以重试。');};
      }
      worker.postMessage({fresh,code:fresh?code:'\n'.repeat(selection.lineOffset)+code,courseId:config.courseId,files:dataFiles[config.courseId].map(name=>({name,url:new URL('materials/data/'+name,document.baseURI).href}))});
    }catch(error){push({kind:'stderr',text:String(error.message||error)});stop('无法启动运行环境，代码已保留。');}
  }
  window.PythonPracticeRunner={mount(options){config=options;draw();},reset(){outputs=[];outputSize=0;truncated=false;lastSource=null;stop('环境与运行结果已重置，原题可重新填写。');},codeChanged(){draw();},stop(){stop('环境已释放。')}};
})();
