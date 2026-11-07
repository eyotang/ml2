"""B3 tables and exercises follow the supplied teacher reference and sample scope."""
import html
import json
from pathlib import Path


def build(course):
 source=json.loads(Path(__file__).with_name('b3-teacher-reference.json').read_text())
 tables=source['tables']
 course['tasks'][0]['answerTables']=tables[:2]
 course['tasks'][1]['answerTables']=tables[2:]
 tables[2]['editableColumns']=[3]
 tables[3]['editableColumns']=[2,3,4]
 course['tasks'][1]['providedAnswers']=['1～2','3～5','6～8']

 def answer(index,slot,value):
  step=course['steps'][index];item=step['slots'][slot]
  old=item['answer']
  if old!=value:
   item['accepted'].append(old)
   item['answer']=value
   item['choices'][0]=value

 # Retain compatible previous expressions; the default wording is the teacher's.
 answer(0,0,'标准化实时能源数据流')
 answer(0,1,'未来30分钟负荷预测')
 answer(0,2,'60秒内执行状态反馈')
 answer(4,1,'停止继续下发指令，恢复安全策略')
 rules=json.loads(Path(__file__).with_name('case-matching.json').read_text())
 course['steps'][4]['slots'][1]['matchRule']=rules['停止继续下发并恢复安全策略']
 steps=course['steps']
 steps[0]['slots'][0]['matchRule']={'groups':[['标准化','标准数据'],['数据流','实时数据']]}
 steps[0]['slots'][1]['matchRule']={'groups':[['30分钟','半小时'],['负荷','用电'],['预测']]}
 steps[0]['slots'][2]['matchRule']={'groups':[['60秒','一分钟','1分钟'],['反馈','回传','返回'],['执行状态','执行结果','状态']]}
 steps[0]['slots'][0]['why']='采集终端汇聚四类接口数据，输出带时间戳、测点ID和质量标记的标准化数据流，并提供缺失告警、补采与临时估计值。'
 steps[0]['slots'][1]['why']='平台使用历史负荷、天气、工作日、活动和电价，输出未来30分钟负荷预测、峰值风险与削峰方案。'
 steps[0]['slots'][2]['why']='网关接收经确认的调度策略，调节非关键空调、储能和充电功率；60秒内反馈执行状态，失败时恢复安全策略并告警。'
 # Replace unrelated acceptance-method exercises with the required human roles and three risks.
 roles=steps[8]
 roles['title']='明确人机协作边界'
 roles['goal']='按老师参考答案区分系统自动工作与工作人员的审批、核查和应急职责。'
 roles['slots']=[
  dict(answer='高风险策略的审批确认',choices=['高风险策略的审批确认','自动绕过审批','删除异常记录'],accepted=['高风险策略审批'],why='能源管理员负责高风险策略的审批确认及运行边界规则调整。'),
  dict(answer='仪表离线核查、设备故障处置',choices=['仪表离线核查、设备故障处置','自动批准高风险策略','取消设备维护'],accepted=[],why='运维人员负责仪表离线核查及设备故障处置。',matchRule={'groups':[['离线','仪表'],['核查','检查'],['故障'],['处置','处理']]}),
  dict(answer='人工接管与应急处置',choices=['人工接管与应急处置','忽略执行失败','继续盲目下发'],accepted=['人工接管和应急处置'],why='执行失败时，值班人员负责人工接管与应急处置。',matchRule={'groups':[['人工接管'],['应急处置','应急处理']]})]
 roles['code']='能源管理员：{{}}、运行边界规则调整。\n运维人员：{{}}。\n值班人员：执行失败时{{}}。\n管理层：验收指标认定与策略效果复盘。'
 roles['hint']='系统负责建议和执行经批准的方案；工作人员负责决策与兜底。'
 risks=steps[9]
 risks['title']='制定三类运行风险控制措施'
 risks['goal']='围绕题目指定的采集异常、季节或业态变化、指令或设备异常三类风险填写控制措施。'
 risks['slots']=[
  dict(answer='模型再训练或人工修正',choices=['模型再训练或人工修正','删除预测误差','长期沿用失准模型'],accepted=['模型再训练或人工调整'],why='监测预测误差，在季节切换和业态变更时触发模型再训练或人工修正；阈值调整须审批留痕。',matchRule={'groups':[['再训练','重新训练','人工修正','人工调整']]}),
  dict(answer='人工调度模式',choices=['人工调度模式','无限重发指令','默认设备已经执行'],accepted=['人工调度'],why='60秒无成功反馈即停发、恢复安全策略并通知值班；设备故障转入人工调度模式。')]
 risks['code']='采集异常：缺失超过5分钟重试并标记；仍无数据用最近可靠值临时估计并通知运维。\n预测失准：监测预测误差，季节切换和业态变更时触发{{}}。\n指令或设备异常：60秒无成功反馈即停发、恢复安全策略并通知值班；设备故障转入{{}}。'
 risks['hint']='三类风险逐项对应，写清发现条件、控制动作和负责人员。'
 # Practice the provided table cells; all unmasked text stays identical to the reference.
 configs=[
  (0,0,None,{'0-3':tables[0]['rows'][0][3].replace('标准化实时能源数据流','{{0}}'),'1-3':tables[0]['rows'][1][3].replace('未来30分钟负荷预测','{{1}}'),'2-3':tables[0]['rows'][2][3].replace('60秒内执行状态反馈','{{2}}')}),
  (1,1,[0],{'0-1':tables[1]['rows'][0][1].replace('5','{{0}}'),'0-2':tables[1]['rows'][0][2].replace('最近可靠值','{{1}}')}),
  (2,1,[1],{'1-1':tables[1]['rows'][1][1].replace('30','{{0}}').replace('1500','{{1}}')}),
  (3,1,[2],{'2-1':tables[1]['rows'][2][1].replace('24','{{0}}').replace('27','{{1}}'),'2-2':tables[1]['rows'][2][2].replace('不得自动削减','{{2}}')}),
  (4,1,[3],{'3-1':tables[1]['rows'][3][1].replace('60','{{0}}'),'3-2':tables[1]['rows'][3][2].replace('停止继续下发指令，恢复安全策略','{{1}}')+'；高风险策略须{{2}}确认后执行。'}),
  (6,0,None,{'0-3':tables[2]['rows'][0][3].replace('1478.4','{{0}}'),'1-3':tables[2]['rows'][1][3].replace('115','{{1}}'),'2-3':tables[2]['rows'][2][3].replace('99','{{2}}'),'3-3':tables[2]['rows'][3][3].replace('5','{{3}}')}),
  (7,1,None,{'0-1':'第{{0}}周','1-1':'第{{1}}周','2-1':'第{{2}}周'}),
  (8,2,None,{'1-1':tables[4]['rows'][1][1].replace('高风险策略的审批确认','{{0}}').replace('仪表离线核查、设备故障处置','{{1}}').replace('人工接管与应急处置','{{2}}')}),
  (9,3,None,{'1-1':tables[5]['rows'][1][1].replace('模型再训练或人工修正','{{0}}'),'2-1':tables[5]['rows'][2][1].replace('人工调度模式','{{1}}')})]
 for index,table,rows,cells in configs:
  step=steps[index]
  step.pop('flowchartHTML',None)
  step['tablePractice']={'table':table,'rows':rows,'cells':cells}
  assert sum(v.count('{{') for v in cells.values())==len(step['slots']),step['id']
  step['solution']=step['code']
  for slot in step['slots']:step['solution']=step['solution'].replace('{{}}',slot['answer'],1)
 # Remove self-added method requirements from prose as well as the visible tables.
 steps[6]['goal']='根据题目基线计算四项验收目标，保留单位与不等号方向。'
 steps[6]['slots'][2]['why']='老师参考答案为能源数据完整率≥99%。'
 steps[6]['slots'][3]['why']='老师参考答案为峰值风险平均响应时间≤5分钟。'
 steps[7]['code']='第{{}}周：数据接入与基线建立。\n第{{}}周：策略仿真与小范围试点。\n第{{}}周：推广上线与指标验收。'
 steps[7]['hint']='按题目指定的三个阶段填写关键任务、验收输出和主要责任人。'
 for slot,row in zip(steps[7]['slots'],tables[3]['rows']):slot['why']=row[2]+'；验收输出：'+row[3]+'；责任人：'+row[4]+'。'
 steps[7]['solution']=steps[7]['code']
 for slot in steps[7]['slots']:steps[7]['solution']=steps[7]['solution'].replace('{{}}',slot['answer'],1)

 def markup(table):
  return '<table><caption>'+html.escape(table['title'])+'</caption><thead><tr>'+''.join('<th>'+html.escape(h)+'</th>' for h in table['headers'])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+html.escape(v)+'</td>' for v in row)+'</tr>' for row in table['rows'])+'</tbody></table>'
 for task in course['tasks']:
  diagram=task['answerHTML'].split('<h4>规范业务流程图（参考方案）</h4>')
  task['answerHTML']=''.join(markup(table) for table in task['answerTables'])
  if len(diagram)>1:task['answerHTML']+='<h4>规范业务流程图（参考方案）</h4>'+diagram[1]
 course['tasks'][1]['answerHTML']+='<p>'+html.escape(source['boundaryPrinciple'])+'</p>'
