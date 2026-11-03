"""Editable, native HTML/SVG flowcharts; coordinates keep labels off connectors."""
import html

def node(kind,x,y,w,h,text):return (kind,x,y,w,h,text)
def chart(key,nodes,edges,width,height):
 out=[f'<div class="flow-scroll" tabindex="0" aria-label="业务流程图，可横向滚动"><div class="flow-canvas" style="width:{width}px;height:{height}px"><svg class="flow-lines" viewBox="0 0 {width} {height}" aria-hidden="true"><defs><marker id="arrow-{key}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#7296aa"/></marker></defs>']
 for path,label,x,y in edges:
  ending='stroke-dasharray="4 3"' if label in ('约束','人机协作') else f'marker-end="url(#arrow-{key})"'
  out.append(f'<path d="{path}" fill="none" stroke="#7296aa" stroke-width="1.6" {ending}/>')
  if label:out.append(f'<text x="{x}" y="{y}" text-anchor="middle" class="flow-edge-label">{html.escape(label)}</text>')
 out.append('</svg>')
 for kind,x,y,w,h,text in nodes:
  shape=f'<svg class="flow-shape" viewBox="0 0 {w} {h}" preserveAspectRatio="none" aria-hidden="true"><polygon points="{w/2},1 {w-1},{h/2} {w/2},{h-1} 1,{h/2}"/></svg>' if kind=='decision' else ''
  out.append(f'<div class="flow-box flow-{kind}" style="left:{x-w/2}px;top:{y-h/2}px;width:{w}px;height:{h}px">{shape}<div class="flow-text">{html.escape(text).replace(chr(10),"<br>")}</div></div>')
 out.append('</div></div>')
 return ''.join(out)

B11_N=[
 node('terminal',380,28,130,34,'开始'),node('process',380,95,230,52,'采集产品、批次与图像'),
 node('decision',380,200,230,110,'图像是否可用？'),
 node('process',110,200,180,88,'原分数无效\n补拍一次'),node('decision',110,350,190,100,'新图是否可用？'),
 node('process',380,350,230,52,'视觉模型检测\n取得新图的缺陷分数 s'),
 node('decision',380,460,200,100,'s < 0.20？'),node('process',650,460,170,60,'自动放行'),
 node('decision',380,600,200,100,'s < 0.80？'),
 node('process',110,600,190,122,'质检员复核／检查实物\n合格→放行；不合格→隔离\n不确定→待检，交主管'),
 node('process',380,760,260,126,'自动隔离，质量人员处置\n放行／返工／报废\n返工完成→R，重新检测'),
 node('connector',555,760,38,38,'R'),node('connector',555,95,38,38,'R'),
 node('process',380,920,280,78,'记录处理结果与当前有效状态\n关联原图、模型版本\n人工改判：人员、理由、时间'),
 node('decision',380,1050,240,110,'当前有效状态\n是否已放行？'),
 node('process',650,1050,170,60,'进入包装'),node('process',110,1050,180,70,'阻止进入包装\n按当前状态继续处置'),node('terminal',650,1150,130,34,'结束')]
B11_E=[('M380 45V69','',0,0),('M380 121V145','',0,0),('M265 200H200','否',232,188),('M110 244V300','',0,0),('M205 350H265','是',234,338),('M380 255V324','是',395,291),('M110 400H5V600H15','否：检查实物',85,425),('M380 376V410','',0,0),('M480 460H565','是',525,448),('M380 510V550','否：s ≥ 0.20',440,532),('M280 600H205','是：中间分数',239,581),('M380 650V697','否：s ≥ 0.80',441,678),('M510 760H536','返工',535,745),('M536 95H495','重检',520,81),('M380 823V881','放行／报废等结果',452,860),('M110 661V920H240','结果',160,908),('M650 490V920H520','结果',590,908),('M380 959V995','',0,0),('M500 1050H565','是',531,1038),('M260 1050H200','否',232,1038),('M650 1080V1133','',0,0)]

B3_N=[node('process',380,60,260,70,'① IoT终端持续采集\n电表／楼控／储能／充电数据'),node('decision',380,190,250,110,'② 数据是否可用？'),node('annotation',100,190,180,112,'连续缺失 >5分钟：重试\n仍失败→最近可靠值估计\n保留估计标志并通知运维\n降级数据重新校验'),node('decision',380,355,280,120,'③ AI预测未来30分钟\n负荷 ≥1500kW？'),node('process',380,510,280,90,'④ AI平台生成削峰建议\n运行边界校验'),node('annotation',650,510,180,100,'温度24～27℃\n不得自动削减关键负荷\n越界→修改／重新优化'),node('decision',380,665,280,130,'⑤ 边界合规且\n必要审批已通过？'),node('annotation',100,665,180,104,'高风险→能源管理员确认\n未批准不得执行\n低风险须在授权范围内'),node('process',380,815,260,70,'⑥ 控制网关执行\n接收策略、回传设备状态'),node('decision',380,960,260,120,'⑦ 60秒内收到\n成功反馈？'),node('annotation',650,960,180,110,'明确失败或超时：\n停止继续下发\n恢复安全策略并通知值班\n核对实际设备状态'),node('process',380,1120,280,115,'⑧ 留痕与实际负荷复核\n记录策略、审批、指令与结果\n反馈至持续采集与模型改进')]
B3_E=[('M380 95V135','',0,0),('M255 190H190','否',221,178),('M100 134V110H380V135','重试／降级校验',175,102),('M380 245V295','是',395,272),('M380 415V465','是',395,445),('M520 355H750V1120H520','否：记录后持续监测',651,343),('M380 555V600','',0,0),('M520 510H560','约束',543,495),('M240 665H220V510H240','否：修改后重审',174,545),('M380 730V780','是',395,758),('M380 850V900','',0,0),('M380 1020V1062','是',395,1050),('M510 960H560','否',535,948),('M650 1015V1120H520','处置结果',637,1106),('M380 1177V1190H15V60H250','持续监测与反馈闭环',145,1180)]

CSS='''
.flow-scroll{overflow:auto;max-width:100%;border:1px solid #dce8ef;border-radius:10px;background:#fff;overscroll-behavior-x:contain;touch-action:pan-x pan-y;margin:14px 0}.flow-canvas{position:relative;margin:auto;font:12px/1.6 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;color:#294b60}.flow-lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.flow-edge-label{font:11px sans-serif;fill:#4f7287;paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round}.flow-box{position:absolute;display:flex;align-items:center;justify-content:center;text-align:center;padding:9px;border:1.5px solid #7fa8be;background:white;box-sizing:border-box}.flow-terminal{border-radius:30px;background:#f0f9fd}.flow-connector{border-radius:50%;padding:0;font-weight:bold}.flow-annotation{border:1px dashed #b7c9d4;color:#617b8b;background:#f8fbfd;font-size:11px}.flow-decision{border:0;background:transparent;padding:0}.flow-shape{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.flow-shape polygon{fill:#f1f9fd;stroke:#7fa8be;stroke-width:1.5px;vector-effect:non-scaling-stroke}.flow-text{position:relative;max-width:100%;overflow-wrap:anywhere}.flow-decision .flow-text{max-width:65%;line-height:1.5}.flow-box .blank{font-family:inherit;font-size:12px;line-height:1.5;min-width:90px;min-height:28px;text-align:center;padding:3px 6px;margin:2px;white-space:normal}.flow-box input.blank{width:100%;max-width:220px}.flow-legend{font-size:11px;color:#718a9b;line-height:1.8}.flow-legend span{margin-right:14px}.flow-legend b{color:#2388b2}.flow-practice .code-label{letter-spacing:0}.flow-practice{background:none;border:0}.flow-practice .code-label{padding:8px 0}.flow-practice .code-label small{float:none;margin-left:12px}.flow-caption{color:#768e9d;font-size:11px;line-height:1.8}.flow-box .review{border-color:#c9ac52;background:#fff9e8;color:#927630}
'''

def diagrams(courses):
 def make(key,nodes,edges,height):return chart(key,nodes,edges,760,height)
 b11=make('b11',B11_N,B11_E,1190)
 b3=make('b3',B3_N,B3_E,1220)
 # Existing practice blanks retain their IDs and stored answers.
 for idx,replacements in [(2,{'补拍一次':'{{}}','质检员复核／检查实物':'人工复核／{{}}'}),(3,{'自动放行':'{{}}','质检员复核／检查实物':'{{}}／检查实物','自动隔离，质量人员处置':'{{}}，质量人员处置'}),(4,{'不确定→待检，交主管':'不确定→{{}}','返工完成→R，重新检测':'返工完成→R，{{}}','是否已放行？':'是否{{}}？'})]:
  # Bind placeholders in the same semantic order as the existing slot array.
  order={2:['补拍一次','质检员复核／检查实物'],3:['自动放行','质检员复核／检查实物','自动隔离，质量人员处置'],4:['不确定→待检，交主管','返工完成→R，重新检测','是否已放行？']}[idx]
  marked=b11
  for i,text in enumerate(order):marked=marked.replace(text,replacements[text].replace('{{}}','{{'+str(i)+'}}'),1)
  courses['b11']['steps'][idx]['flowchartHTML']=marked
 # Focused diagrams teach each workflow section; step 6 joins them into the full eight-node diagram.
 focused=[
 ([node('process',380,70,300,110,'IoT采集终端输出\n{{0}}'),node('process',380,230,320,120,'AI平台输出\n{{1}}'),node('decision',380,405,260,130,'运行边界合规且\n必要审批已通过？'),node('process',380,580,300,110,'控制网关\n{{2}}'),node('process',380,750,300,80,'记录执行结果与实际状态\n反馈至采集端和AI平台'),node('process',100,405,180,90,'拒绝执行\n修改方案后重审')],
  [('M380 125V170','数据',402,150),('M380 290V340','建议与策略',421,322),('M380 470V525','是',395,503),('M250 405H190','否',221,392),('M100 360V230H220','修改后重新校验',152,215),('M380 635V710','状态回执',420,679),('M380 790V840H20V70H230','监测与反馈闭环',173,830)],870),
 ([node('process',380,45,250,60,'持续采集与数据质量检查'),node('decision',380,205,320,210,'连续缺失超过\n{{0}} 分钟？'),node('process',100,385,180,70,'重试并标记异常'),node('decision',100,525,180,100,'重试是否恢复？'),node('process',380,525,260,150,'仍失败，临时估计采用\n{{1}}\n标记估计值并通知运维'),node('process',650,385,170,80,'使用有效实测数据\n进入后续分析'),node('process',380,750,280,100,'记录数据来源、质量与时效\n降级估计重新校验\n恢复后切回实测数据')],
  [('M380 75V100','',0,0),('M220 205H100V350','是',161,193),('M540 205H650V345','否',590,193),('M100 420V475','',0,0),('M190 525H250','否',219,512),('M100 575V750H240','是：恢复实测',139,736),('M650 425V750H520','有效数据',598,736),('M380 600V700','重新校验',421,657)],830),
 ([node('process',380,80,300,130,'AI平台负荷预测\n预测窗口（分钟）\n{{0}}'),node('decision',380,310,320,210,'预测负荷达到阈值？\n≥ {{1}} kW'),node('process',110,510,190,90,'未触发削峰\n持续监测'),node('process',590,510,280,100,'生成削峰建议\n校验24～27℃及关键负荷边界\n必要时由能源管理员审批'),node('process',380,710,290,90,'授权执行或记录未触发结果\n复核实际负荷并反馈')],
  [('M380 145V205','',0,0),('M220 310H110V465','否',155,297),('M540 310H590V460','是',568,297),('M110 555V710H235','',0,0),('M590 560V710H525','',0,0),('M380 755V800H20V80H230','持续监测',132,789)],830),
 ([node('process',380,90,290,160,'生成削峰建议并设置办公温度\n下限（℃） {{0}}\n上限（℃） {{1}}'),node('decision',380,340,290,140,'温度范围合规且\n未自动削减关键负荷？'),node('process',100,540,190,160,'关键负荷\n{{2}}\n越界方案拒绝执行\n重新优化或转人工'),node('process',590,540,270,100,'通过边界校验\n高风险先由能源管理员审批\n在授权范围内执行'),node('process',380,760,290,85,'记录校验、审批与执行结果\n复核实际运行状态')],
  [('M380 170V270','',0,0),('M235 340H100V460','否',167,327),('M525 340H590V490','是',558,327),('M100 620V670H20V90H235','修改后重审',119,657),('M590 590V760H525','',0,0)],830),
 ([node('decision',380,85,260,130,'策略是否属于高风险？'),node('process',100,270,190,150,'执行前必须由\n{{2}}\n确认通过\n未批准不得下发'),node('process',380,470,290,80,'边界合规、必要审批通过\n网关下发已授权控制策略'),node('decision',380,680,320,220,'在 {{0}} 秒内\n收到成功反馈？'),node('process',650,870,190,150,'明确失败或超时\n{{1}}\n通知值班并核对实际状态'),node('process',380,1050,300,100,'记录策略、审批人、指令\n反馈结果及时间\n复核实际状态，进入监测闭环')],
  [('M250 85H100V195','是',173,72),('M380 150V430','否：授权低风险',453,356),('M100 345V470H235','已批准',143,456),('M380 510V570','',0,0),('M540 680H650V795','否',596,667),('M380 790V1000','是',395,914),('M650 945V1050H530','处置结果',608,1036)],1130)
 ]
 for index,(nodes,edges,height) in enumerate(focused):
  courses['b3']['steps'][index]['flowchartHTML']=make('b3-step-'+str(index),nodes,edges,height)
 q=next(s for s in courses['b3']['steps'] if '八节点' in s['title'])
 q['flowchartHTML']=b3.replace('运行边界校验','{{0}}',1).replace('高风险→能源管理员确认','{{1}}',1).replace('⑧ 留痕与实际负荷复核','⑧ {{2}}',1)
 for key,index,diagram in [('b11',1,b11),('b3',0,b3)]:
  c=courses[key];task=c['tasks'][index]
  task['answerHTML']+='<h4>规范业务流程图（参考方案）</h4>'+diagram
  task['flowchart']={'html':diagram,'slots':[]}
  mapping=[(courses['b11']['steps'][2],0,'补拍一次'),(courses['b11']['steps'][3],0,'自动放行'),(courses['b11']['steps'][3],1,'质检员复核／检查实物'),(courses['b11']['steps'][3],2,'自动隔离，质量人员处置'),(courses['b11']['steps'][4],0,'不确定→待检，交主管'),(courses['b11']['steps'][4],1,'返工完成→R，重新检测'),(courses['b11']['steps'][4],2,'是否已放行？')] if key=='b11' else [(q,0,'运行边界校验'),(q,1,'高风险→能源管理员确认'),(q,2,'⑧ 留痕与实际负荷复核')]
  for j,(step,i,label) in enumerate(mapping):
   task['flowchart']['html']=task['flowchart']['html'].replace(label,({'不确定→待检，交主管':'不确定→{{'+str(j)+'}}','返工完成→R，重新检测':'返工完成→R，{{'+str(j)+'}}','是否已放行？':'是否{{'+str(j)+'}}？'}.get(label,'{{'+str(j)+'}}')),1)
   task['flowchart']['slots'].append(step['slots'][i])
