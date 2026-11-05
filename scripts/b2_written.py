"""Written conclusion required by B2 task three."""
def enrich(c):
 title='任务三 · 形成算法测试结论'
 prompt='<p>结合冷链温控异常预警业务，说明应优先关注的分类指标及理由，并针对不同货物类型测试表现存在明显差异的情况提出一项改进措施。</p>'
 answer='''<h4>优先指标及理由</h4><p>优先关注温控异常类（temp_alarm=1）的召回率，即 TP/(TP+FN)：实际异常运输中有多少被正确预警。漏报可能使温控异常未被及时处置，带来货损和质量安全风险，因此应重点减少 FN。不能只看总体准确率，正常样本较多时它可能掩盖异常漏报。也不能孤立追求召回率：同时报告精确率、F1和混淆矩阵，评估误报造成的人工复核和运营成本。具体目标需结合业务风险与处置能力确定，不虚构固定达标值。</p><h4>货物类型表现差异与一项改进</h4><p>依据本次测试输出，列出各货物类型的异常召回率、异常样本数及漏报数，识别薄弱类别；总体指标不能代表每个货类。样本很少时还应报告不确定性，不能凭一次划分认定业务差异一定稳定存在。</p><p><strong>改进措施：</strong>针对异常召回率偏低的货物类型，补充具有代表性的异常正样本，覆盖不同线路、季节和温度条件，并由业务人员核验标签，再加入训练集重新训练。这是一项“针对薄弱货类的数据补充与核验”措施；不能为了抬高指标而删除该组难例、修改测试标签或把测试集并入训练集。</p><p><strong>验证：</strong>保留独立测试集，原模型与新模型在同一测试口径上对比薄弱货类异常召回率、漏报数和异常样本数，同时核对总体召回率、各组精确率及误报负担。若反复据测试结果调参，应另设验证集，并保留最终未参与选型的测试数据；必要时补充独立时间批次复核。改善需由实际结果证实，不能仅凭训练集分数承诺上线效果。</p>'''
 import re,html
 paragraphs=[re.sub('<[^>]+>','',p) for p in re.findall(r'<p>(.*?)</p>',answer)]
 first=paragraphs[0];a=first.index('漏报可能');b=first.index('也不能孤立')
 validation=paragraphs[3].removeprefix('验证：');v=validation.index('同时核对');end=validation.index('若反复')
 tables=[dict(title='优先指标与业务理由',headers=['答题要点','回答内容'],rows=[['优先指标及含义',first[:a]],['业务理由',first[a:b]],['兼顾指标与目标',first[b:]]]),dict(title='薄弱货类改进与验证',headers=['答题要点','回答内容'],rows=[['差异诊断',paragraphs[1]],['一项改进措施',paragraphs[2].removeprefix('改进措施：')],['验证数据与比较',validation[:v]],['效果检查',validation[v:end]],['结果使用边界',validation[end:]]])]
 answer=''.join('<table><caption>'+t['title']+'</caption><thead><tr>'+''.join('<th>'+h+'</th>' for h in t['headers'])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+html.escape(x)+'</td>' for x in row)+'</tr>' for row in t['rows'])+'</tbody></table>' for t in tables)
 c['tasks']=[dict(id='b2t3',title=title,promptHTML=prompt,answerHTML=answer,conclusionTables=tables)]
 def slot(a,wrong,why,groups,aliases=()):return dict(answer=a,choices=[a,*wrong],why=why,accepted=list(aliases),matchRule=dict(groups=groups))
 specs=[('任务三：选择优先指标并解释理由','把冷链漏报风险与指标含义对应起来。','优先关注异常类的 {{}}。\n理由：{{}}。\n同时关注 {{}}，避免只追求单一指标。',[
 slot('召回率',['总体准确率','仅看正常类预测数量'],'异常召回率=TP/(TP+FN)，衡量真实异常被识别的比例。',[['召回率','recall']]),
 slot('漏报可能导致货损与质量安全风险',['误报完全没有成本','总体准确率高就一定没有风险'],'冷链异常漏报会延迟干预，导致异常运输未及时处置。',[['漏报','漏检','未识别'],['货损','安全','质量','损失']]),
 slot('精确率、F1及误报处置成本',['只看训练集准确率','忽略误报与人工负担'],'需要兼顾误报、人工复核和运营负担，不能只看召回率。',[['精确率','precision'],['误报','成本','负担','f1']])]),
 ('任务三：改进薄弱货类并验证','提出一项针对性的改进措施，再说明怎样证明有效。','先比较各货类召回率、异常样本数和漏报数。\n措施：针对薄弱货类 {{}}。\n重新训练后用 {{}} 对比。\n核对薄弱组召回率和漏报数，同时检查 {{}}。',[
 slot('补充代表性异常正样本并核验标签',['删除该组测试难例','修改测试标签让分数变高'],'补充薄弱类别真实异常数据用于训练，覆盖多样条件，先核验标签。',[['补充','增加','采集'],['异常','正样本'],['标签','核验','审核']]),
 slot('保留的独立测试集',['并入训练的原测试集','只在训练数据上'],'测试数据不能参与训练或反复选型；必要时另设验证集和最终独立测试批次。',[['独立','保留','未参与'],['测试','验证']]),
 slot('总体表现、各组精确率和误报负担',['只看训练分数','忽略其他货物类型'],'改善弱组的同时评估总体与其他分组，防止以大量误报换取召回。',[['总体','其他组','分组'],['精确率','误报','成本']])])]
 for title,goal,code,slots in specs:
  solution=code
  for s in slots:solution=solution.replace('{{}}',s['answer'],1)
  c['steps'].append(dict(id='b2-'+str(len(c['steps'])+1),kind='case',taskIndex=0,title=title,goal=goal,code=code,solution=solution,slots=slots,hint='结合业务说明指标和理由；改进措施要具体，效果需在独立数据上验证。',context=''))
 c['count']=len(c['steps']);c['writtenDownloadPath']='materials/b2-written-reference.html'
 return '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>B2任务三参考答案</title><style>body{max-width:860px;margin:30px auto;padding:0 20px;font:15px/1.9 sans-serif;color:#294352}</style><h1>任务三 · 形成算法测试结论</h1><p>依据2026年样卷要求整理的一种参考方案，不是唯一标准答案；指标数值以本次实际运行输出为准。</p>'+prompt+answer+'</html>'
