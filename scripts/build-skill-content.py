import json,re
from pathlib import Path
from zipfile import ZipFile
root=Path(__file__).resolve().parents[1]
def read_template(source):
 key='b12' if source.startswith('B1.2') else 'b2'
 with ZipFile(root/'dist/materials'/f'{key}-original.zip') as archive:
  return json.loads(archive.read(Path(source).name).decode('utf-8'))
courses={}
def course(key,title):
 courses[key]={'id':key,'title':title,'steps':[]}
def add(key,title,goal,code,slots,hint,context=''):
 # Each blank is a meaningful function, argument, field, or expression.
 row={'id':f'{key}-{len(courses[key]["steps"])+1}','title':title,'goal':goal,'code':code,'slots':[{'answer':a,'choices':[a,*d],'why':w} for a,d,w in slots],'hint':hint,'context':context}
 assert code.count('{{}}')==len(slots)
 row['solution']=code
 for slot in row['slots']:row['solution']=row['solution'].replace('{{}}',slot['answer'],1)
 courses[key]['steps'].append(row)
course('b12','B1-2 · 共享会议室预约与空间利用')
add('b12','按预约编号去重','同一预约可能被重复导出，先保留每笔预约的一条记录。',"clean = bookings.{{}}(subset={{}})",[
('drop_duplicates',['dropna','sort_values'],'drop_duplicates 删除重复记录；dropna 删除缺失值，不负责去重。'),("'booking_id'",["'room_id'","'department'"],'booking_id 标识一笔预约；按 room_id 去重会误删不同日期或时段的预约。')], '一笔预约的唯一标识是 booking_id。',"bookings = pd.read_csv('meeting_bookings.csv', encoding='utf-8-sig')\nrooms = pd.read_csv('meeting_rooms.csv', encoding='utf-8-sig')")
add('b12','排除已取消预约','有效预约包含已使用和爽约，不包含已取消。',"valid = clean.loc[clean['status'] {{}} {{}}].copy()",[
('!=',['==','>='],'需要排除取消状态，所以使用不等于。'),("'已取消'",["'已使用'","'爽约'"],'取消预约不应进入有效预约数和爽约率的分母。')],'不要把爽约也过滤掉。')
add('b12','生成爽约标记','为每条有效预约创建布尔标记，便于后面求和与求平均。',"valid['is_no_show'] = valid[{{}}] == {{}}",[
("'status'",["'attendees'","'time_slot'"],'status 保存最终预约状态。'),("'爽约'",["'已取消'","'已使用'"],'布尔值 True 表示爽约，按组求平均即可得到爽约率。')],'True 可按 1、False 可按 0 参与聚合。')
add('b12','按时段汇总爽约情况','统计有效预约数、爽约数、爽约率，并将爽约率最高的时段排在前面。',"slot_summary = valid.groupby({{}}).agg(\n    valid_count=('booking_id', 'count'),\n    no_show_count=('is_no_show', {{}}),\n    no_show_rate=('is_no_show', {{}})\n).sort_values('no_show_rate', ascending={{}})",[
("'time_slot'",["'room_id'","'department'"],'目标是比较时段，需要按 time_slot 分组。'),("'sum'",["'count'","'max'"],'布尔列求和得到爽约条数；count 会计算全部非空记录。'),("'mean'",["'sum'","'min'"],'布尔均值等于爽约数除以有效预约数。'),('False',['True','None'],'ascending=False 表示降序，优先显示高爽约率时段。')],'次数用 sum，比例用 mean；排序要降序。')
add('b12','关联已使用预约与会议室容量','只分析实际使用过的预约，再通过会议室编号关联容量。',"used = valid.loc[valid['status'] == {{}}].merge(\n    rooms, on={{}}, how='left'\n)",[
("'已使用'",["'爽约'","'已取消'"],'容量利用分析只统计已使用预约，不能把爽约人数 0 当作真实使用场次。'),("'room_id'",["'booking_id'","'room_name'"],'两张表通过 room_id 关联。')],'会议室资料表中 room_id 唯一且完整匹配。')
add('b12','汇总会议室座位利用率','利用率为实际参会人数除以容量；按会议室汇总使用场次和平均利用率。',"used['seat_util'] = used['attendees'] / used['capacity']\nroom_summary = used.groupby(['room_id', 'room_name', 'capacity'], as_index=False).agg(\n    used_count=('booking_id', {{}}),\n    avg_seat_util=('seat_util', {{}})\n)",[
("'count'",["'sum'","'mean'"],'使用场次是记录数量，不能对预约编号求均值。'),("'mean'",["'sum'","'max'"],'题目要求平均座位利用率，因此对每场利用率求均值。')],'每行是一次已使用预约，先计算单场利用率再聚合。')
add('b12','筛选空间优化候选','找出容量不少于 12、使用不少于 20 场、平均座位利用率低于 40% 的会议室。',"candidates = room_summary.loc[\n    (room_summary['capacity'] {{}} 12) {{}}\n    (room_summary['used_count'] {{}} 20) {{}}\n    (room_summary['avg_seat_util'] {{}} 0.4)\n]",[
('>=',['>','<='],'不少于 12 包含恰好 12。'),('&',['|','and'],'多个 Series 条件使用 & 表示同时满足；每个条件需加括号。'),('>=',['>','<'],'不少于 20 包含恰好 20。'),('&',['|','or'],'三个条件必须同时满足，不能用或连接。'),('<',['<=','>'],'低于 40% 不包含恰好 40%。')],'注意“不少于”和“低于”的边界，以及 pandas 的 &。')
course('b2','B2 · 冷链运输温控异常预警')
add('b2','转换发车时间','将字符串转换为 pandas 日期时间，便于提取小时。',"df['depart_time'] = pd.{{}}(df['depart_time'])",[('to_datetime',['to_numeric','get_dummies'],'to_datetime 用于日期时间转换；to_numeric 用于数值转换。')],'使用 pandas 的日期时间转换函数。',"df = pd.read_csv('cold_chain_shipments.csv')")
add('b2','提取发车小时','从转换后的时间列生成 0～23 的小时特征。',"df['depart_hour'] = df['depart_time'].{{}}.{{}}",[('dt',['str','loc'],'日期时间 Series 的向量化访问器是 dt。'),('hour',['day','month'],'hour 提取小时，day 与 month 提取日和月。')],'先使用 dt 访问器，再获取小时。')
add('b2','按运输单号去重','同一运输单号代表同一次运输，只保留一条记录。',"df = df.{{}}(subset={{}})",[('drop_duplicates',['dropna','reset_index'],'drop_duplicates 按指定字段去重。'),("'shipment_id'",["'cargo_type'","'route_region'"],'shipment_id 标识运输任务；按货物类型或区域去重会丢失大量合法样本。')],'唯一标识是 shipment_id。')
add('b2','过滤非法记录','只保留计划时长大于 0，传感器缺失率在闭区间 [0, 1] 的记录。',"df = df.loc[\n    (df['planned_hours'] {{}} 0) &\n    df['sensor_missing_rate'].{{}}(0, 1)\n].copy()",[('>',['>=','<'],'运输时长必须为正，0 也需要排除。'),('between',['isin','eq'],'between(0, 1) 默认包含边界 0 和 1；isin([0,1]) 只能保留两个端点。')],'时长为正；缺失率 0 和 1 都有效。')
add('b2','按货物类型填补缺失温度','用同货物类型的平均温度中位数，填补 avg_temp 的缺失值。',"df['avg_temp'] = df['avg_temp'].{{}}(\n    df.groupby('cargo_type')['avg_temp'].{{}}({{}})\n)",[('fillna',['dropna','replace'],'fillna 只填补缺失项，不覆盖已有温度。'),('transform',['agg','count'],'transform 返回与原行对齐的分组结果，适合逐行填补。'),("'median'",["'mean'","'max'"],'题目指定组内中位数，不是均值或最大值。')],'transform 保持原数据行数和索引，agg 则返回分组汇总。')
add('b2','统计货物与区域分布','按货物类型、线路区域统计样本数、报警率和平均传感器缺失率。',"cargo_region_summary = df.groupby({{}}).agg(\n    sample_count=('shipment_id', 'count'),\n    alarm_rate=('temp_alarm', {{}}),\n    avg_missing_rate=('sensor_missing_rate', 'mean')\n)",[("['cargo_type', 'route_region']",["['vehicle_type']","['shipment_id']"],'题目要求货物类型与线路区域两个分组维度。'),("'mean'",["'sum'","'count'"],'temp_alarm 是 0/1 标签，均值是报警比例；求和仅得到报警数。')],'0/1 标签的均值可以表示事件发生率。')
add('b2','编码特征矩阵','从指定 feature_cols 取特征，对 category_cols 三个分类字段独热编码。',"X = pd.{{}}(df[feature_cols], columns={{}})",[('get_dummies',['concat','to_numeric'],'get_dummies 将类别转换成指示变量。'),('category_cols',['feature_cols',"['temp_alarm']"],'只对分类字段编码，不能把目标标签作为输入特征。')],'category_cols 已定义为区域、车型、货物类型。',"feature_cols = ['route_region', 'vehicle_type', 'cargo_type', 'planned_hours',\n    'outside_temp', 'avg_temp', 'max_temp', 'door_open_count',\n    'sensor_missing_rate', 'driver_experience_years', 'depart_hour']\ncategory_cols = ['route_region', 'vehicle_type', 'cargo_type']")
add('b2','提取目标变量','预测目标是运输是否出现温控报警。',"y = df[{{}}]",[("'temp_alarm'",["'max_temp'","'cargo_type'"],'temp_alarm 是 0/1 监督标签，max_temp 属于输入特征。')],'标签列是 temp_alarm。')
add('b2','分层划分训练与测试集','训练集占 75%，测试集占 25%，固定随机种子 42，并保持标签比例。',"X_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size={{}}, random_state={{}}, stratify={{}}\n)",[('0.25',['0.75','25'],'test_size 表示测试集占比，25% 应写 0.25。'),('42',['0','None'],'题目指定 random_state=42，以便复现划分。'),('y',['X','None'],'stratify=y 按目标类别分层，保持训练和测试的标签分布。')],'test_size 是测试集比例；分层依据是目标 y。')
add('b2','配置随机森林','使用 100 棵树、最大深度 6、平衡类别权重、随机种子 42。',"model = RandomForestClassifier(\n    n_estimators={{}}, max_depth={{}},\n    class_weight={{}}, random_state=42\n)",[('100',['6','42'],'n_estimators 是树的数量。'),('6',['100','None'],'max_depth 限制每棵树的最大深度。'),("'balanced'",["None","'balance'"],'合法参数值是 balanced，根据类别频率调整权重；balance 不是该参数的有效值。')],'区分树的数量和深度，类别权重写 balanced。')
add('b2','训练模型','仅用训练集特征及训练集标签拟合分类器。',"model.{{}}({{}}, {{}})",[('fit',['predict','score'],'fit 进行模型训练。'),('X_train',['X_test','X'],'训练数据是 X_train，不可拿测试集拟合。'),('y_train',['y_test','y'],'标签必须与训练集特征一一对应。')],'测试集用于独立评估，不能参与拟合。')
add('b2','预测测试集','对保留的测试集生成类别预测。',"y_pred = model.{{}}({{}})",[('predict',['fit','predict_proba'],'predict 输出类别标签；predict_proba 输出概率，不能直接作为这些分类指标的类别输入。'),('X_test',['X_train','y_test'],'最终测试指标应基于 X_test 的预测结果。')],'训练用 fit，预测类别用 predict。')
for title,var,func,why in [('精确率','precision','precision_score','精确率是预测报警中真实报警的比例，关注误报。'),('召回率','recall','recall_score','召回率是真实报警中被找出的比例，关注漏报。'),('F1 值','f1','f1_score','F1 综合精确率与召回率，不能只看准确率。'),('混淆矩阵','cm','confusion_matrix','混淆矩阵展示真实类别和预测类别的组合，便于定位误报与漏报。')]:
 add('b2','计算'+title,'使用测试集真实标签与预测标签计算'+title+'。',f"{var} = {{{{}}}}({{{{}}}}, {{{{}}}})",[(func,[x for x in ['precision_score','recall_score','f1_score','confusion_matrix'] if x!=func],why),('y_test',['y_train','y_pred'],'第一个参数是真实标签 y_test。'),('y_pred',['y_test','X_test'],'第二个参数是预测标签 y_pred；顺序交换会改变精确率和召回率的意义。')],'指标函数的参数顺序：真实值在前，预测值在后。')
add('b2','比较各货物类型召回率','保留测试集原始索引，关联货物类型后按组评估召回率。',"test_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()\ntest_result['actual'] = y_test.to_numpy()\ntest_result['predicted'] = y_pred\ncargo_recall = test_result.groupby({{}})[['actual', 'predicted']].apply(\n    lambda group: {{}}(group[{{}}], group[{{}}], zero_division=0)\n)",[("'cargo_type'",["'shipment_id'","'predicted'"],'业务要求比较货物类型，不能按预测标签分组。'),('recall_score',['precision_score','f1_score'],'需要比较召回率，即各组真实报警被找出的比例。'),("'actual'",["'predicted'","'cargo_type'"],'actual 保存测试集真实标签。'),("'predicted'",["'actual'","'shipment_id'"],'predicted 保存对应行的预测标签。')],'先按测试集索引对齐业务字段，再分组计算；无正样本时需单独解释，不能把 0 当成有正样本的漏检率。')
# Preserve the original comment block for every exam blank, including shared instructions.
for key,source in [('b12','B1.2素材/B1.2.ipynb'),('b2','B2素材/B2.ipynb')]:
 notebook=read_template(source)
 comment_blocks=[]
 for cell in notebook['cells']:
  if cell['cell_type']!='code':continue
  block=[];in_comments=False
  for line in ''.join(cell['source']).splitlines():
   stripped=line.strip()
   if stripped.startswith('#'):
    if not in_comments:block=[]
    block.append(line);in_comments=True
   elif stripped:
    in_comments=False
    if re.search(r'_{5,}',line):comment_blocks.append('\n'.join(block))
 assert len(comment_blocks)==len(courses[key]['steps'])
 for step,comments in zip(courses[key]['steps'],comment_blocks):
  assert comments
  step['examComments']=comments
  step['code']=comments+'\n'+step['code']
  step['solution']=comments+'\n'+step['solution']
# Make the user-designated reference the main teaching style, keeping meaningful blanks.
templates={
 ('b12',1):"valid = clean[clean['status'] {{}} {{}}]",
 ('b12',2):"valid['is_no_show'] = (valid[{{}}] == {{}}).astype(int)",
 ('b12',3):"slot_summary = valid.groupby({{}}).agg(\n    有效预约数=('is_no_show', 'count'),\n    爽约数=('is_no_show', {{}}),\n    爽约率=('is_no_show', {{}})\n).sort_values('爽约率', ascending={{}})",
 ('b12',4):"used = valid[valid['status'] == {{}}].merge(rooms, on={{}})",
 ('b12',5):"used['seat_util'] = used['attendees'] / used['capacity']\nroom_summary = used.groupby(['room_id', 'room_name', 'capacity']).agg(\n    使用场次=('booking_id', {{}}),\n    平均座位利用率=('seat_util', {{}})\n).reset_index()",
 ('b12',6):"candidates = room_summary[\n    (room_summary['capacity'] {{}} 12) {{}}\n    (room_summary['使用场次'] {{}} 20) {{}}\n    (room_summary['平均座位利用率'] {{}} 0.4)\n]",
 ('b2',4):"df['avg_temp'] = df.groupby('cargo_type')['avg_temp'].{{}}(\n    lambda s: s.{{}}(s.{{}}())\n)",
 ('b2',5):"cargo_region_summary = df.groupby({{}}).agg(\n    样本数=('shipment_id', 'count'),\n    报警率=('temp_alarm', {{}}),\n    平均传感器缺失率=('sensor_missing_rate', 'mean')\n).reset_index()",
 ('b2',8):"X_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size={{}}, stratify={{}}, random_state={{}}\n)",
 ('b2',16):"test_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()\ntest_result['actual'] = y_test.to_numpy()\ntest_result['predicted'] = y_pred\ncargo_recall = test_result.groupby({{}}).apply(\n    lambda g: {{}}(g[{{}}], g[{{}}])\n)"
}
q=courses['b2']['steps'][4]
q['slots']=[q['slots'][1],q['slots'][0],q['slots'][2]]
q['slots'][2]['answer']='median';q['slots'][2]['choices']=['median','mean','max']
q['hint']='先 groupby，再用 transform 保持行对齐，在每个货物类型组内填补中位数。'
q=courses['b2']['steps'][8];q['slots']=[q['slots'][0],q['slots'][2],q['slots'][1]]
for (key,index),template in templates.items():
 q=courses[key]['steps'][index];q['code']=q['examComments']+'\n'+template;q['solution']=q['code']
 for slot in q['slots']:q['solution']=q['solution'].replace('{{}}',slot['answer'],1)
 assert q['code'].count('{{}}')==len(q['slots'])
courses['b2']['steps'][16]['hint']='按 cargo_type 分组，在组内用 actual 与 predicted 计算召回率。'
for c in courses.values():
 c['count']=len(c['steps'])
assert courses['b12']['count']==7 and courses['b2']['count']==17
for key,source in [('b12','B1.2素材/B1.2.ipynb'),('b2','B2素材/B2.ipynb')]:
 notebook=read_template(source)
 courses[key]['originalCode']='\n\n'.join(''.join(c['source']) for c in notebook['cells'] if c['cell_type']=='code')
 courses[key]['referenceCode']=("import pandas as pd\n" if key=='b12' else "import pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix\n")+'\n\n'.join((step['context']+'\n' if step['context'] else '')+step['solution'] for step in courses[key]['steps'])
# Supplement with the user-specified website's inspected code answers, without importing its scripts or grading rules.
website='https://ai-trainer-exam-87484.app.workbuddy.host/?sharecode=P6SA3BBFCH'
for reference in json.loads((root/'scripts/web-code-reference.json').read_text()):
 c=courses[reference['id']]
 assert len(reference['blanks'])==len(c['steps'])
 c['websiteURL']=website
 c['websiteNote']='主答案采用老师提供的参考代码，分步练习仅在老师的原表达式上挖空；老师列出的等价写法保留供对照。'
 if reference['id']=='b2':c['websiteNote']+='planned_hours≤72 是老师参考代码中的运输计划时长筛选条件，不是答题时长限制；本页按老师写法保留。'
 code=reference['snippet']
 for step,blank in zip(c['steps'],reference['blanks']):
  # Use an expression actually supplied by the teacher, not a rewritten equivalent.
  chosen=None
  for expression in blank['ref']:
   template=expression;offset=0;ok=True
   for slot in step['slots']:
    pattern=re.escape(slot['answer']).replace(r'\ ',r'\s*')
    match=re.search(pattern,template[offset:])
    if not match:ok=False;break
    start=offset+match.start();end=offset+match.end()
    template=template[:start]+'{{}}'+template[end:];offset=start+4
   if ok:chosen=(expression,template);break
  assert chosen is not None,(reference['id'],blank['i'])
  prefix=re.search(r'(^[^\n]*?)\{\{'+str(blank['i'])+r'\}\}',reference['snippet'],re.M).group(1)
  prelude=''
  if reference['id']=='b12' and blank['i']==5:prelude='used[\'seat_util\'] = used["attendees"] / used["capacity"]\n'
  if reference['id']=='b2' and blank['i']==16:prelude="test_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()\ntest_result['actual'] = y_test.to_numpy()\ntest_result['predicted'] = y_pred\n"
  step['code']=step['examComments']+'\n'+prelude+prefix+chosen[1]
  step['solution']=step['examComments']+'\n'+prelude+prefix+chosen[0]
  step['teacherExpression']=chosen[0]
  if reference['id']=='b2' and blank['i']==3:
   step['goal']='按老师参考代码，保留 0<planned_hours≤72 且 sensor_missing_rate 在 [0,1] 的记录；72 小时是运输时长上界，不是答题时限。'
   step['hint']='保留老师参考的运输时长上界 72；between(0,1) 包含两个边界。'
  step['websiteReferences']=blank['ref']
  step['websiteHint']=blank['hint']
  for expression in blank['ref']:compile(expression,'website-reference','exec')
  code=code.replace('{{'+str(blank['i'])+'}}',blank['ref'][0])
 c['websiteCode']=code
 primary=code
 c['referenceCode']=primary
 c['answerSchema']=2
 compile(code,'website-reference','exec')
 (root/'dist/materials'/f"{reference['id']}-website-reference.py").write_text('# 来源：'+website+'\n# '+c['websiteNote']+'\n'+code+'\n')
(root/'dist/skill-content.js').write_text('const SKILL_COURSES = '+json.dumps(courses,ensure_ascii=False,indent=2)+';\n')
# Fill the original notebooks with executable reference code and retain original instructions/imports.
for key,source in [('b12','B1.2素材/B1.2.ipynb'),('b2','B2素材/B2.ipynb')]:
 notebook=read_template(source)
 text=courses[key]['referenceCode']
 compile(text,'teacher-reference','exec')
 cells=[{'cell_type':'markdown','metadata':{},'source':['老师提供的参考答案。代码顺序、变量名、列名和表达式保留原写法。请与原题 CSV 放在同一目录运行。']},
        {'cell_type':'code','metadata':{},'execution_count':None,'outputs':[],'source':text.splitlines(True)}]
 notebook['cells']=cells
 (root/'dist/materials'/f'{key}-reference.ipynb').write_text(json.dumps(notebook,ensure_ascii=False,indent=2))
print('Generated 24 steps and 2 syntax-checked reference notebooks')
