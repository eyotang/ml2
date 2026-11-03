// Python runs in a disposable worker: stopping execution never blocks the practice page.
const PYODIDE_URL='https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
let pyodide,globals,busy=false;
const send=(type,extra={})=>postMessage({type,...extra});
async function initialize(courseId,files){
  send('status',{text:'首次加载 Python 环境，请稍候…'});
  const {loadPyodide}=await import(PYODIDE_URL+'pyodide.mjs');
  pyodide=await loadPyodide({indexURL:PYODIDE_URL});
  pyodide.setStdout({batched:text=>send('stdout',{text})});
  pyodide.setStderr({batched:text=>send('stderr',{text})});
  pyodide.setStdin({error:true});
  send('status',{text:courseId==='b2'?'加载 pandas 与机器学习库…':'加载 pandas…'});
  await pyodide.loadPackage(courseId==='b2'?['pandas','scikit-learn']:['pandas'],{messageCallback:text=>send('status',{text:'加载运行库：'+text}),errorCallback:text=>send('stderr',{text})});
  for(const file of files){
    const response=await fetch(file.url);if(!response.ok)throw new Error('原题数据加载失败：'+file.name);
    pyodide.FS.writeFile('/home/pyodide/'+file.name,new Uint8Array(await response.arrayBuffer()));
  }
  pyodide.runPython("import os\nos.chdir('/home/pyodide')");
  pyodide.globals.set('__trainer_emit',message=>send('display',{value:JSON.parse(message)}));
  await pyodide.runPythonAsync(`
import ast as __trainer_ast, json as __trainer_json, builtins as __trainer_builtins
import pandas as __trainer_pd
__trainer_original_print = __trainer_builtins.print

def __trainer_display(*objects, **kwargs):
    for obj in objects:
        if isinstance(obj, __trainer_pd.Series):
            obj = obj.to_frame()
        if isinstance(obj, __trainer_pd.DataFrame):
            sample = obj.iloc[:100, :30]
            __trainer_emit(__trainer_json.dumps({'kind':'table', 'columns':['索引']+[str(x) for x in sample.columns], 'rows':[[str(idx)]+[str(x) for x in row] for idx,row in zip(sample.index,sample.itertuples(index=False,name=None))], 'totalRows':len(obj), 'totalColumns':len(obj.columns)},ensure_ascii=False))
        elif type(obj).__module__.startswith('matplotlib') and hasattr(obj, 'savefig'):
            import io, base64
            buf=io.BytesIO();obj.savefig(buf,format='png',bbox_inches='tight')
            __trainer_emit(__trainer_json.dumps({'kind':'image','data':base64.b64encode(buf.getvalue()).decode()}))
        elif obj is not None:
            __trainer_original_print(obj)

def __trainer_print(*objects, **kwargs):
    if len(objects)==1 and isinstance(objects[0],(__trainer_pd.DataFrame,__trainer_pd.Series)) and not kwargs:
        __trainer_display(objects[0])
    else:
        __trainer_original_print(*objects, **kwargs)

def __trainer_execute(source, namespace):
    tree=__trainer_ast.parse(source,filename='原题代码',mode='exec')
    if tree.body and isinstance(tree.body[-1],__trainer_ast.Expr):
        expression=tree.body.pop()
        exec(compile(tree,'原题代码','exec'),namespace)
        value=eval(compile(__trainer_ast.Expression(expression.value),'原题代码','eval'),namespace)
        if value is not None:__trainer_display(value)
    else:
        exec(compile(tree,'原题代码','exec'),namespace)
    if 'matplotlib.pyplot' in __import__('sys').modules:
        import matplotlib.pyplot as plt
        for number in plt.get_fignums():__trainer_display(plt.figure(number))
        plt.close('all')
`);
}
function newGlobals(){if(globals)globals.destroy();globals=pyodide.runPython("{'__name__':'__main__','print':__trainer_print,'display':__trainer_display}");}
self.onmessage=async({data})=>{
  if(busy)return;busy=true;
  try{
    if(!pyodide)await initialize(data.courseId,data.files);
    send('status',{text:'正在运行…'});
    // Only imports actually used by the learner trigger optional library downloads.
    await pyodide.loadPackagesFromImports(data.code,{messageCallback:text=>send('status',{text:'加载依赖：'+text}),errorCallback:text=>send('stderr',{text})});
    if(!globals||data.fresh)newGlobals();
    pyodide.globals.set('__trainer_source',data.code);
    pyodide.globals.set('__trainer_namespace',globals);
    const result=await pyodide.runPythonAsync('__trainer_execute(__trainer_source, __trainer_namespace)');
    result?.destroy?.();send('done');
  }catch(error){send('error',{text:String(error?.message||error),recoverable:!!globals});}
  finally{busy=false;}
};
