(() => {
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const keywords=new Set('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
  const builtins=new Set('print len range int float str bool list dict set tuple sum min max abs round enumerate zip isinstance sorted open display'.split(' '));
  // Display-only tokenizer. The original text is always kept in the native textarea.
  function highlight(source){
    const pattern=/#[^\n]*|(?:[rubf]{0,2})(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b[A-Za-z_]\w*\b/gim;
    let html='',end=0;
    for(const match of source.matchAll(pattern)){
      const token=match[0];let type='';
      if(token.startsWith('#'))type='comment';
      else if(/^[rubf]{0,2}['"]/i.test(token))type='string';
      else if(/^\d/.test(token))type='number';
      else if(keywords.has(token))type='keyword';
      else if(builtins.has(token))type='builtin';
      html+=escape(source.slice(end,match.index))+(type?`<span class="py-${type}">${escape(token)}</span>`:escape(token));end=match.index+token.length;
    }
    return html+escape(source.slice(end));
  }
  function mount(editor){
    if(editor.parentElement?.classList.contains('editor-viewport'))return;
    const shell=document.createElement('div');shell.className='python-editor';
    const header=document.createElement('div');header.className='editor-header';header.textContent='Python';
    const help=document.createElement('small');help.textContent='Tab 缩进 · Esc 离开编辑区';header.append(help);
    const body=document.createElement('div');body.className='editor-body';
    const gutter=document.createElement('div');gutter.className='editor-gutter';gutter.setAttribute('aria-hidden','true');
    const numbers=document.createElement('pre');gutter.append(numbers);
    const viewport=document.createElement('div');viewport.className='editor-viewport';
    const syntax=document.createElement('pre');syntax.className='editor-syntax';syntax.setAttribute('aria-hidden','true');
    editor.parentNode.insertBefore(shell,editor);viewport.append(syntax,editor);body.append(gutter,viewport);shell.append(header,body);
    editor.setAttribute('wrap','off');editor.setAttribute('autocorrect','off');
    function sync(){syntax.style.transform=`translate(${-editor.scrollLeft}px, ${-editor.scrollTop}px)`;numbers.style.transform=`translateY(${-editor.scrollTop}px)`;}
    function paint(){syntax.innerHTML=highlight(editor.value)+(editor.value.endsWith('\n')?' ':'');numbers.textContent=Array.from({length:editor.value.split('\n').length},(_,i)=>i+1).join('\n');sync();}
    editor.addEventListener('input',paint);editor.addEventListener('scroll',sync,{passive:true});
    editor.addEventListener('keydown',e=>{
      if(e.isComposing)return;
      if(e.key==='Escape'){document.querySelector('#python-runner button')?.focus();return;}
      if(e.key!=='Tab')return;e.preventDefault();
      const start=editor.selectionStart,end=editor.selectionEnd;
      if(start===end&&!e.shiftKey){editor.setRangeText('    ',start,end,'end');}
      else{
        const lineStart=editor.value.lastIndexOf('\n',start-1)+1;
        const block=editor.value.slice(lineStart,end);
        const updated=e.shiftKey?block.replace(/^(?: {1,4}|\t)/gm,''):block.replace(/^/gm,'    ');
        editor.setRangeText(updated,lineStart,end,'select');
      }
      editor.dispatchEvent(new Event('input',{bubbles:true}));
    });
    paint();
  }
  window.PythonCodeEditor={mount,highlight};
})();
