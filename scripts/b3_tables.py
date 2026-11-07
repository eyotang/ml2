"""Keep B3's written tables ahead of its collaboration diagram."""
from html.parser import HTMLParser
import re, html

class Tables(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.row=None;self.cell=None
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.tables.append({'headers':[],'rows':[]})
  elif tag=='tr':self.row=[]
  elif tag in ('th','td'):self.cell=[]
 def handle_data(self,text):
  if self.cell is not None:self.cell.append(text)
 def handle_endtag(self,tag):
  if tag in ('th','td') and self.cell is not None:self.row.append(''.join(self.cell));self.cell=None
  elif tag=='tr' and self.row is not None:
   table=self.tables[-1]
   if not table['headers']:table['headers']=self.row
   else:table['rows'].append(self.row)
   self.row=None

def build(course):
 for task,titles in zip(course['tasks'],[['智能产品应用设计表','运行规则表'],['验收指标表','三阶段实施计划表']]):
  parser=Tables();parser.feed(task['answerHTML'])
  task['answerTables']=parser.tables
  for table,title in zip(task['answerTables'],titles):table['title']=title
 t2=course['tasks'][1]['answerTables']
 t2[0]['editableColumns']=[3]
 plan=t2[1]
 plan['headers']=['阶段名称','时间周期','关键任务','验收输出','主要责任人']
 plan['rows']=[[re.sub(r'（.*', '', row[0]), '第'+['1～2','3～5','6～8'][i]+'周', *row[1:]] for i,row in enumerate(plan['rows'])]
 plan['editableColumns']=[2,3,4]
 course['tasks'][1]['providedAnswers']=['1～2','3～5','6～8']
 t2.extend([
  {'title':'人机协作边界与验收口径','headers':['事项','工作边界或统计口径'],'rows':[
   ['智能系统','采集、质量标记、预测、约束校验、建议生成、授权范围内控制与留痕。'],
   ['工作人员','高风险策略审批、设备故障排查、运行边界制定、异常接管和验收。'],
   ['数据完整率','有效实测数据点数÷应采数据点数；临时估计不计入有效实测。'],
   ['风险响应时间','从风险事件生成到首次成功调节反馈；未成功事件单列，不删除失败记录。']]},
  {'title':'运行风险控制措施表','headers':['运行风险','控制措施'],'rows':[
   ['仪表离线或采集异常','超过5分钟重试并标记，仍失败则用最近可靠值临时估计并通知运维；持续异常时保守降级，实测恢复后对账。'],
   ['季节或业态变化导致预测失准','按季节、时段和楼栋监测误差及峰值漏报；达到预设条件后用新数据回测再训练并灰度发布，保留旧模型与人工策略。'],
   ['指令未执行或设备异常','采用指令编号、有效期、幂等和状态回读；60秒无成功反馈即停发、恢复安全策略、通知值班，无法确认时人工接管。'],
   ['电费及季节表现验收','采用完整可比账单周期，核对天气、工作日、业态和电价；8周未覆盖代表性季节时补充复核，不将短期收益直接认定为长期收益。']]}
 ])
 # IDs and answer slots remain unchanged so existing progress survives.
 configs=[
  (0,0,None,{'0-3':'{{0}}；异常重试与运维通知。','1-3':'{{1}}、预期效果及审批任务。','2-3':'{{2}}；失败时停发、恢复安全策略并通知值班。'}),
  (1,1,[0],{'0-1':'连续超过 {{0}} 分钟仍无数据。','0-2':'重试采集并标记异常；仍失败则用 {{1}} 临时估计，记录原值时间和估计标志，同时通知运维。'}),
  (2,1,[1],{'1-1':'未来 {{0}} 分钟预测负荷达到或超过 {{1}} kW。'}),
  (3,1,[2],{'2-1':'预计办公温度低于 {{0}} ℃或高于 {{1}} ℃，或涉及关键负荷自动削减。','2-2':'关键负荷 {{2}}；拒绝越界方案并重新优化或交人工处理。'}),
  (4,1,[3],{'3-1':'下发后 {{0}} 秒内未收到成功反馈，包括明确失败。','3-2':'{{1}}，通知值班人员并核查设备实际状态；高风险策略必须由 {{2}} 确认后执行，全程留痕。'}),
  (6,0,None,{'0-3':'不高于 {{0}} kW（1680×0.88），削减至少201.6 kW。','1-3':'不高于 {{1}} 万元（125×0.92），节省至少10万元。','2-3':'不低于 {{2}}%，提高至少8个百分点。','3-3':'平均不超过 {{3}} 分钟，缩短至少80%。'}),
  (7,1,None,{'0-1':'第 {{0}} 周','1-1':'第 {{1}} 周','2-1':'第 {{2}} 周'}),
  (8,2,None,{'1-1':'{{0}}、设备故障排查、运行边界制定、异常接管和验收。','2-1':'{{1}} ÷ 应采数据点数；临时估计不计入有效实测。','3-1':'风险事件生成至 {{2}}；未成功事件单列，不删除失败记录。'}),
  (9,3,None,{'1-1':'按季节、时段和楼栋监测误差及峰值漏报，达到预设条件后 {{0}}，保留旧模型与人工策略。','3-1':'采用 {{1}}，核对天气、工作日、业态和电价；8周未覆盖代表性季节时补充复核，不将短期收益直接认定为长期收益。'})
 ]
 for index,table,rows,cells in configs:
  step=course['steps'][index]
  step.pop('flowchartHTML',None)
  step['tablePractice']={'table':table,'rows':rows,'cells':cells}

 for task in course['tasks']:
  tables=iter(task['answerTables'][:2])
  def markup(table):
   return '<table><caption>'+html.escape(table['title'])+'</caption><thead><tr>'+''.join('<th>'+html.escape(h)+'</th>' for h in table['headers'])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+html.escape(v)+'</td>' for v in row)+'</tr>' for row in table['rows'])+'</tbody></table>'
  task['answerHTML']=re.sub(r'<table>.*?</table>', lambda _:markup(next(tables)), task['answerHTML'], flags=re.S)
  task['answerHTML']+=''.join(markup(table) for table in task['answerTables'][2:])
