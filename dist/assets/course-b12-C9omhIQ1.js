var e={id:`b12`,title:`B1-2 · 共享会议室预约与空间利用`,steps:[{id:`b12-1`,title:`按预约编号去重`,goal:`同一预约可能被重复导出，先保留每笔预约的一条记录。`,code:`# M1（1分）：数据准备
# 按booking_id去重，再排除已取消预约
clean = bookings.{{}}(subset={{}})`,slots:[{answer:`drop_duplicates`,choices:[`drop_duplicates`,`dropna`,`sort_values`],why:`drop_duplicates 删除重复记录；dropna 删除缺失值，不负责去重。`},{answer:`'booking_id'`,choices:[`'booking_id'`,`'room_id'`,`'department'`],why:`booking_id 标识一笔预约；按 room_id 去重会误删不同日期或时段的预约。`}],hint:`一笔预约的唯一标识是 booking_id。`,context:`bookings = pd.read_csv('meeting_bookings.csv', encoding='utf-8-sig')
rooms = pd.read_csv('meeting_rooms.csv', encoding='utf-8-sig')`,solution:`# M1（1分）：数据准备
# 按booking_id去重，再排除已取消预约
clean = bookings.drop_duplicates(subset='booking_id')`,examComments:`# M1（1分）：数据准备
# 按booking_id去重，再排除已取消预约`,teacherExpression:`bookings.drop_duplicates(subset='booking_id')`,websiteReferences:[`bookings.drop_duplicates(subset='booking_id')`,`bookings.drop_duplicates(subset="booking_id")`,`bookings.drop_duplicates('booking_id')`],websiteHint:`drop_duplicates 指定 subset 为预约编号列`},{id:`b12-2`,title:`排除已取消预约`,goal:`有效预约包含已使用和爽约，不包含已取消。`,code:`# M1（1分）：数据准备
# 按booking_id去重，再排除已取消预约
valid = clean[clean['status'] {{}} {{}}]`,slots:[{answer:`!=`,choices:[`!=`,`==`,`>=`],why:`需要排除取消状态，所以使用不等于。`},{answer:`'已取消'`,choices:[`'已取消'`,`'已使用'`,`'爽约'`],why:`取消预约不应进入有效预约数和爽约率的分母。`}],hint:`不要把爽约也过滤掉。`,context:``,solution:`# M1（1分）：数据准备
# 按booking_id去重，再排除已取消预约
valid = clean[clean['status'] != '已取消']`,examComments:`# M1（1分）：数据准备
# 按booking_id去重，再排除已取消预约`,teacherExpression:`clean[clean['status'] != '已取消']`,websiteReferences:[`clean[clean['status'] != '已取消']`,`clean[clean['status'].isin(['已使用','爽约'])]`,`clean[clean["status"] != "已取消"]`],websiteHint:`按 status 列过滤掉「已取消」（或只保留已使用/爽约）`},{id:`b12-3`,title:`生成爽约标记`,goal:`为每条有效预约创建布尔标记，便于后面求和与求平均。`,code:`# M2（2分）：识别爽约高发时段
# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列
valid['is_no_show'] = (valid[{{}}] == {{}}).astype(int)`,slots:[{answer:`'status'`,choices:[`'status'`,`'attendees'`,`'time_slot'`],why:`status 保存最终预约状态。`},{answer:`'爽约'`,choices:[`'爽约'`,`'已取消'`,`'已使用'`],why:`布尔值 True 表示爽约，按组求平均即可得到爽约率。`}],hint:`True 可按 1、False 可按 0 参与聚合。`,context:``,solution:`# M2（2分）：识别爽约高发时段
# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列
valid['is_no_show'] = (valid['status'] == '爽约').astype(int)`,examComments:`# M2（2分）：识别爽约高发时段
# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列`,teacherExpression:`(valid['status'] == '爽约').astype(int)`,websiteReferences:[`(valid['status'] == '爽约').astype(int)`,`(valid['status'] == '爽约') * 1`,`valid['status'].apply(lambda x: 1 if x == '爽约' else 0)`],websiteHint:`status 等于「爽约」时取 1，否则 0，转整型便于求和求均值`},{id:`b12-4`,title:`按时段汇总爽约情况`,goal:`统计有效预约数、爽约数、爽约率，并将爽约率最高的时段排在前面。`,code:`# M2（2分）：识别爽约高发时段
# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列
slot_summary = valid.groupby({{}}).agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show',{{}}), 爽约率=('is_no_show',{{}})).sort_values('爽约率', ascending={{}})`,slots:[{answer:`'time_slot'`,choices:[`'time_slot'`,`'room_id'`,`'department'`],why:`目标是比较时段，需要按 time_slot 分组。`},{answer:`'sum'`,choices:[`'sum'`,`'count'`,`'max'`],why:`布尔列求和得到爽约条数；count 会计算全部非空记录。`},{answer:`'mean'`,choices:[`'mean'`,`'sum'`,`'min'`],why:`布尔均值等于爽约数除以有效预约数。`},{answer:`False`,choices:[`False`,`True`,`None`],why:`ascending=False 表示降序，优先显示高爽约率时段。`}],hint:`次数用 sum，比例用 mean；排序要降序。`,context:``,solution:`# M2（2分）：识别爽约高发时段
# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列
slot_summary = valid.groupby('time_slot').agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show','sum'), 爽约率=('is_no_show','mean')).sort_values('爽约率', ascending=False)`,examComments:`# M2（2分）：识别爽约高发时段
# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列`,teacherExpression:`valid.groupby('time_slot').agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show','sum'), 爽约率=('is_no_show','mean')).sort_values('爽约率', ascending=False)`,websiteReferences:[`valid.groupby('time_slot').agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show','sum'), 爽约率=('is_no_show','mean')).sort_values('爽约率', ascending=False)`],websiteHint:`groupby('time_slot') + agg 命名聚合（count / sum / mean）+ sort_values 降序`},{id:`b12-5`,title:`关联已使用预约与会议室容量`,goal:`只分析实际使用过的预约，再通过会议室编号关联容量。`,code:`# M3（2分）：分析会议室容量匹配
# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率
used = valid[valid['status'] == {{}}].merge(rooms, on={{}})`,slots:[{answer:`'已使用'`,choices:[`'已使用'`,`'爽约'`,`'已取消'`],why:`容量利用分析只统计已使用预约，不能把爽约人数 0 当作真实使用场次。`},{answer:`'room_id'`,choices:[`'room_id'`,`'booking_id'`,`'room_name'`],why:`两张表通过 room_id 关联。`}],hint:`会议室资料表中 room_id 唯一且完整匹配。`,context:``,solution:`# M3（2分）：分析会议室容量匹配
# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率
used = valid[valid['status'] == '已使用'].merge(rooms, on='room_id')`,examComments:`# M3（2分）：分析会议室容量匹配
# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率`,teacherExpression:`valid[valid['status'] == '已使用'].merge(rooms, on='room_id')`,websiteReferences:[`valid[valid['status'] == '已使用'].merge(rooms, on='room_id')`,`valid[valid['status']=='已使用'].merge(rooms, on='room_id', how='left')`],websiteHint:`先筛 status == '已使用'，再 merge rooms（on='room_id'）`},{id:`b12-6`,title:`汇总会议室座位利用率`,goal:`利用率为实际参会人数除以容量；按会议室汇总使用场次和平均利用率。`,code:`# M3（2分）：分析会议室容量匹配
# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率
used['seat_util'] = used["attendees"] / used["capacity"]
room_summary = used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id',{{}}), 平均座位利用率=('seat_util',{{}})).reset_index()`,slots:[{answer:`'count'`,choices:[`'count'`,`'sum'`,`'mean'`],why:`使用场次是记录数量，不能对预约编号求均值。`},{answer:`'mean'`,choices:[`'mean'`,`'sum'`,`'max'`],why:`题目要求平均座位利用率，因此对每场利用率求均值。`}],hint:`每行是一次已使用预约，先计算单场利用率再聚合。`,context:``,solution:`# M3（2分）：分析会议室容量匹配
# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率
used['seat_util'] = used["attendees"] / used["capacity"]
room_summary = used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()`,examComments:`# M3（2分）：分析会议室容量匹配
# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率`,teacherExpression:`used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()`,websiteReferences:[`used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()`],websiteHint:`groupby 会议室维度 + agg（count 场次、mean 利用率）+ reset_index`},{id:`b12-7`,title:`筛选空间优化候选`,goal:`找出容量不少于 12、使用不少于 20 场、平均座位利用率低于 40% 的会议室。`,code:`# M4（1分）：输出空间匹配优化候选清单
# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室
candidates = room_summary[(room_summary['capacity'] {{}} 12) {{}} (room_summary['使用场次'] {{}} 20) {{}} (room_summary['平均座位利用率'] {{}} 0.4)]`,slots:[{answer:`>=`,choices:[`>=`,`>`,`<=`],why:`不少于 12 包含恰好 12。`},{answer:`&`,choices:[`&`,`|`,`and`],why:`多个 Series 条件使用 & 表示同时满足；每个条件需加括号。`},{answer:`>=`,choices:[`>=`,`>`,`<`],why:`不少于 20 包含恰好 20。`},{answer:`&`,choices:[`&`,`|`,`or`],why:`三个条件必须同时满足，不能用或连接。`},{answer:`<`,choices:[`<`,`<=`,`>`],why:`低于 40% 不包含恰好 40%。`}],hint:`注意“不少于”和“低于”的边界，以及 pandas 的 &。`,context:``,solution:`# M4（1分）：输出空间匹配优化候选清单
# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室
candidates = room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]`,examComments:`# M4（1分）：输出空间匹配优化候选清单
# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室`,teacherExpression:`room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]`,websiteReferences:[`room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]`],websiteHint:`三个条件用 & 连接，注意每个条件各自加括号`},{id:`b12-8`,kind:`case`,taskIndex:0,title:`任务二：挖掘预约效率价值`,goal:`从比例与数量两方面解释发现，再提出可执行措施。`,code:`午间爽约率 35.71%，傍晚 33.33%；午间比例最高，傍晚数量最多。
隐藏价值：{{}}。
措施：优先开展 {{}}。
释放会议室之前：{{}}。`,solution:`午间爽约率 35.71%，傍晚 33.33%；午间比例最高，傍晚数量最多。
隐藏价值：减少空占并提高会议室可获得性。
措施：优先开展 会前提醒、二次确认与便捷取消。
释放会议室之前：核实取消或按已告知规则核实爽约。`,slots:[{answer:`减少空占并提高会议室可获得性`,choices:[`减少空占并提高会议室可获得性`,`只增加预约总次数`,`全部爽约时长都算已实现收益`],why:`把未被实际使用的预约窗口转化为可用资源机会，减少找房成本，效果仍需试点验证。`,accepted:[],matchRule:{groups:[[`空占`,`空置`,`闲置`,`爽约`],[`可获得`,`可用`,`释放`,`利用`,`找房`]]}},{answer:`会前提醒、二次确认与便捷取消`,choices:[`会前提醒、二次确认与便捷取消`,`直接删除所有晚间预约`,`仅优化页面颜色`],why:`午间和傍晚是优先干预时段；提醒后让预约人确认或及时取消。`,accepted:[],matchRule:{groups:[[`提醒`],[`确认`,`取消`]]}},{answer:`核实取消或按已告知规则核实爽约`,choices:[`核实取消或按已告知规则核实爽约`,`按风险分数直接取消`,`一律立即放给他人`],why:`不能把预测风险当作实际爽约，避免误释放仍然有效的预约。`,accepted:[],matchRule:{groups:[[`核实`,`确认`,`签到`],[`取消`,`爽约`,`规则`]]}}],hint:`发现→业务价值→干预措施→释放边界，不能只复述两个百分比。`,context:``},{id:`b12-9`,kind:`case`,taskIndex:0,title:`任务二：挖掘空间匹配价值`,goal:`候选会议室是冬青室与星河室；改善容量配置时仍要满足业务需要。`,code:`冬青室：12座、28场、平均25%；星河室：16座、28场、平均37.5%。
隐藏价值：{{}}。
推荐替代会议室必须满足 {{}}。
预约人确认后调整，跟踪 {{}}。`,solution:`冬青室：12座、28场、平均25%；星河室：16座、28场、平均37.5%。
隐藏价值：减少小会占大房的容量浪费。
推荐替代会议室必须满足 容量与设备需求。
预约人确认后调整，跟踪 座位利用率、改约率与用户满意度。`,slots:[{answer:`减少小会占大房的容量浪费`,choices:[`减少小会占大房的容量浪费`,`把爽约人数0混入座位利用率`,`所有大房间全部停用`],why:`本任务的平均座位利用率是已使用场次中人数/容量的均值，不是时间占用率。`,accepted:[],matchRule:{groups:[[`小会`,`少数人`,`小团队`,`人数少`,`容量`],[`大房`,`大会议室`,`浪费`,`匹配`]]}},{answer:`容量与设备需求`,choices:[`容量与设备需求`,`只比较会议室面积`,`忽略视频会议设施`],why:`需新增收集预计参会人数和设备需求；历史实际人数不能直接代表未来会议需求。`,accepted:[],matchRule:{groups:[[`容量`,`人数`,`座位`],[`设备`,`设施`]]}},{answer:`座位利用率、改约率与用户满意度`,choices:[`座位利用率、改约率与用户满意度`,`仅统计登录次数`,`只看推荐点击次数`],why:`同时衡量资源利用和使用体验，防止为提高指标而制造强制改约。`,accepted:[],matchRule:{groups:[[`利用率`,`匹配率`],[`满意`,`改约`,`体验`]]}}],hint:`数据发现→容量浪费价值→满足约束的推荐→体验与利用效果。`,context:``},{id:`b12-10`,kind:`case`,taskIndex:1,title:`任务三：选择数据与模型`,goal:`以爽约风险辅助提醒为例，保留会前信息边界与可解释基线。`,code:`特征：时段、部门、会议室、星期和提前预约时长。
最终status及实际attendees：{{}}。
先建立时段规则基线，再尝试 {{}}。
训练验证按 {{}} 划分。`,solution:`特征：时段、部门、会议室、星期和提前预约时长。
最终status及实际attendees：不作为会前预测特征。
先建立时段规则基线，再尝试 逻辑回归或浅层决策树。
训练验证按 时间先后 划分。`,slots:[{answer:`不作为会前预测特征`,choices:[`不作为会前预测特征`,`直接作为会前特征`,`使用实际爽约标签预测同一条预约`],why:`最终状态用于历史标签，实际人数会后才知道，直接当会前输入会造成数据泄漏。`,accepted:[`避免数据泄漏`,`仅使用会前可获得信息`],matchRule:{groups:[]}},{answer:`逻辑回归或浅层决策树`,choices:[`逻辑回归或浅层决策树`,`不验证直接用深层模型`,`按随机编号决定是否爽约`],why:`给出适合小数据和可解释需求的候选；样本仅10个工作日，先规则试点并积累数据。`,accepted:[`逻辑回归`,`决策树`,`可解释分类模型`],matchRule:{groups:[[`逻辑回归`,`决策树`]]}},{answer:`时间先后`,choices:[`时间先后`,`未来训练过去验证`,`用同一数据拟合再报告训练分数`],why:`模拟真实未来预测，预处理在训练数据上拟合，避免未来信息泄漏。`,accepted:[],matchRule:{groups:[[`时间`,`滚动`,`过去训练未来验证`]]}}],hint:`数据使用方式、模型及其适用条件都要写，不能只写“用AI预测”。`,context:``},{id:`b12-11`,kind:`case`,taskIndex:1,title:`任务三：设计应用与预期效果`,goal:`风险评分用于辅助提醒，资源释放仍受确认和企业规则约束。`,code:`业务链：预约→会前特征→风险预测→ {{}}
→核实状态后释放／保留→候补通知→记录结果。
目标：{{}}。
必须同步监测 {{}}。`,solution:`业务链：预约→会前特征→风险预测→ 提醒与二次确认
→核实状态后释放／保留→候补通知→记录结果。
目标：减少爽约和空占、提高再利用。
必须同步监测 错误释放、投诉与提醒负担。`,slots:[{answer:`提醒与二次确认`,choices:[`提醒与二次确认`,`按分数直接取消预约`,`直接强制更换会议室`],why:`风险高不等于真实爽约，先提醒并请求确认。`,accepted:[],matchRule:{groups:[[`提醒`],[`确认`]]}},{answer:`减少爽约和空占、提高再利用`,choices:[`减少爽约和空占、提高再利用`,`承诺立刻节约固定金额`,`只提高模型训练准确率`],why:`明确业务效果但不编造收益，效果需通过试点评估。`,accepted:[],matchRule:{groups:[[`爽约`,`空占`],[`再利用`,`复用`,`利用率`,`减少`,`降低`]]}},{answer:`错误释放、投诉与提醒负担`,choices:[`错误释放、投诉与提醒负担`,`只监测点击量`,`忽略用户投诉`],why:`效果评价要有保护指标，避免提醒过量和误伤正常预约。`,accepted:[],matchRule:{groups:[[`误释放`,`错误释放`,`误取消`,`投诉`],[`提醒`,`负担`,`打扰`,`投诉`]]}}],hint:`数据→模型→业务动作→可验证目标→保护指标，形成可实施方案。`,context:``},{id:`b12-12`,kind:`case`,taskIndex:1,title:`任务三：验证模型与业务效果`,goal:`同时验证离线预测质量与线上真实收益，指标必须有口径。`,code:`离线：按时间留出验证，报告 {{}} 并与规则基线比较。
线上：开展 {{}}，覆盖可比会议室、日期和时段。
爽约率分母：{{}}。
再利用率分母：{{}}。`,solution:`离线：按时间留出验证，报告 精确率、召回率和F1 并与规则基线比较。
线上：开展 随机对照试点，覆盖可比会议室、日期和时段。
爽约率分母：同周期有效预约笔数。
再利用率分母：同周期已释放时段数。`,slots:[{answer:`精确率、召回率和F1`,choices:[`精确率、召回率和F1`,`只报训练准确率`,`不报告样本量`],why:`指标聚焦爽约类别，并报告样本量、混淆矩阵和误报/漏报，不能以预测指标代替业务收益。`,accepted:[],matchRule:{groups:[[`精确率`,`precision`],[`召回率`,`recall`],[`f1`]]}},{answer:`随机对照试点`,choices:[`随机对照试点`,`干预前后任意各挑一天`,`只挑效果最好的时段`],why:`比较原流程与提醒流程，尽量控制跨组干扰，并约定观察周期及回退条件。`,accepted:[],matchRule:{groups:[[`对照`,`ab测试`,`a/b`,`随机分组`]]}},{answer:`同周期有效预约笔数`,choices:[`同周期有效预约笔数`,`全部导出行数含重复和取消`,`所有已使用人数`],why:`按booking_id去重，排除已取消，与分子爽约笔数使用相同周期。`,accepted:[],matchRule:{groups:[[`有效预约`]]}},{answer:`同周期已释放时段数`,choices:[`同周期已释放时段数`,`全部预约笔数`,`成功再预约时段数`],why:`分子是释放后又被预约且实际使用的时段数；分母是同周期全部已释放时段数。`,accepted:[],matchRule:{groups:[[`已释放`,`释放的`,`释放时段`]]}}],hint:`离线评估+线上对照试点；写清指标分子、分母、周期和保护项。`,context:``}],count:12,originalCode:`import pandas as pd


# 读取数据
bookings = pd.read_csv('meeting_bookings.csv', encoding='utf-8-sig')
rooms = pd.read_csv('meeting_rooms.csv', encoding='utf-8-sig')

# M1（1分）：数据准备
# 按booking_id去重，再排除已取消预约
clean = ______________________________
valid = ______________________________

print('数据准备结果')
print('去重后预约数：', len(clean))
print('有效预约数：', len(valid))

# M2（2分）：识别爽约高发时段
# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列
valid['is_no_show'] = ______________________________
slot_summary = ______________________________


print('\\n各时段爽约情况')
print(slot_summary)


# M3（2分）：分析会议室容量匹配
# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率
used = ______________________________
used['seat_util'] = used["attendees"] / used["capacity"]
room_summary = ______________________________


print('\\n各会议室空间利用情况')
print(room_summary)


# M4（1分）：输出空间匹配优化候选清单
# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室
candidates = ______________________________


print('\\n空间匹配优化候选清单')
print(candidates)
`,referenceCode:`import pandas as pd

# 读取数据
bookings = pd.read_csv('meeting_bookings.csv', encoding='utf-8-sig')
rooms = pd.read_csv('meeting_rooms.csv', encoding='utf-8-sig')

# M1（1分）：数据准备
# 按booking_id去重，再排除已取消预约
clean = bookings.drop_duplicates(subset='booking_id')
valid = clean[clean['status'] != '已取消']

print('数据准备结果')
print('去重后预约数：', len(clean))
print('有效预约数：', len(valid))

# M2（2分）：识别爽约高发时段
# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列
valid['is_no_show'] = (valid['status'] == '爽约').astype(int)
slot_summary = valid.groupby('time_slot').agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show','sum'), 爽约率=('is_no_show','mean')).sort_values('爽约率', ascending=False)

print('\\n各时段爽约情况')
print(slot_summary)

# M3（2分）：分析会议室容量匹配
# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率
used = valid[valid['status'] == '已使用'].merge(rooms, on='room_id')
used['seat_util'] = used["attendees"] / used["capacity"]
room_summary = used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()

print('\\n各会议室空间利用情况')
print(room_summary)

# M4（1分）：输出空间匹配优化候选清单
# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室
candidates = room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]

print('\\n空间匹配优化候选清单')
print(candidates)`,websiteURL:`https://ai-trainer-exam-87484.app.workbuddy.host/?sharecode=P6SA3BBFCH`,websiteNote:`主答案采用老师提供的参考代码，分步练习仅在老师的原表达式上挖空；老师列出的等价写法保留供对照。`,websiteCode:`import pandas as pd

# 读取数据
bookings = pd.read_csv('meeting_bookings.csv', encoding='utf-8-sig')
rooms = pd.read_csv('meeting_rooms.csv', encoding='utf-8-sig')

# M1（1分）：数据准备
# 按booking_id去重，再排除已取消预约
clean = bookings.drop_duplicates(subset='booking_id')
valid = clean[clean['status'] != '已取消']

print('数据准备结果')
print('去重后预约数：', len(clean))
print('有效预约数：', len(valid))

# M2（2分）：识别爽约高发时段
# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列
valid['is_no_show'] = (valid['status'] == '爽约').astype(int)
slot_summary = valid.groupby('time_slot').agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show','sum'), 爽约率=('is_no_show','mean')).sort_values('爽约率', ascending=False)

print('\\n各时段爽约情况')
print(slot_summary)

# M3（2分）：分析会议室容量匹配
# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率
used = valid[valid['status'] == '已使用'].merge(rooms, on='room_id')
used['seat_util'] = used["attendees"] / used["capacity"]
room_summary = used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()

print('\\n各会议室空间利用情况')
print(room_summary)

# M4（1分）：输出空间匹配优化候选清单
# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室
candidates = room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]

print('\\n空间匹配优化候选清单')
print(candidates)`,answerSchema:2,tasks:[{id:`b12t2`,title:`任务二 · 挖掘隐藏价值`,promptHTML:`<p>针对任务一中的两个业务场景，结合分析结果说明其中隐藏的业务和运营价值，并提出相应的改进措施。</p>`,answerHTML:`<h4>场景一：预约效率优化</h4><p>按 booking_id 去重后 240 笔，排除已取消后有效预约 216 笔。午间 15/42=35.71%，傍晚 18/54=33.33%，高于上午 6/60=10% 和下午 3/60=5%。午间比例最高，傍晚爽约数量最多，应同时关注比例与数量，不能混为一谈。</p><p><strong>隐藏价值：</strong>识别被占用但未实际使用的时间窗口，减少找房和现场协调成本，提高会议室可获得性。42 次爽约对应 84 个预约小时，仅是历史未使用时长，不能直接承诺全部释放或转化为收益。</p><p><strong>措施：</strong>优先在午间、傍晚做会前提醒和二次确认，提供便捷取消及候补通知。未确认时先提醒、人工核实，确认取消或依已告知的签到规则核实爽约后再释放；不得仅凭模型预测自动取消预约。保留审批或确认及操作记录。</p><h4>场景二：空间匹配优化</h4><p>仅在已使用记录中，以每场 attendees/capacity 的平均值衡量座位利用率。冬青室 12 座、28 场、平均 25%；星河室 16 座、28 场、平均 37.5%，均满足容量≥12、使用≥20场、平均利用率&lt;40%的候选条件。远山室虽有20座，但平均80%，不属于该候选清单。该利用率不是会议室被占用时间的比例。</p><p><strong>隐藏价值：</strong>减少少数人占用大房间的容量浪费，把适配大房间的机会留给确有需求的团队，降低沟通和改约成本。</p><p><strong>措施：</strong>在预约时新增采集预计参会人数及设备需求，在容量和设备满足的前提下推荐更合适的小会议室，由预约人确认后调整，不能仅因历史人数少就强制换房。继续监测座位利用率、匹配率、改约率与用户满意度。</p>`},{id:`b12t3`,title:`任务三 · 提出解决方案`,promptHTML:`<p>针对任务一中的其中一个业务场景，结合人工智能技术提出解决方案。方案应包括数据使用方式、所选算法模型、业务应用方式和预期效果、验证方法。</p>`,answerHTML:`<h4>选择场景：预约效率优化——爽约风险辅助提醒</h4><p><strong>数据使用：</strong>历史数据按 booking_id 去重，按题设定义有效预约和爽约标签。用预约前已知的 time_slot、department、room_id、会议室容量、星期及 start_time−booked_at 的提前预约时长构造特征。status 的最终值只用于生成历史标签，不能作为预测特征；实际 attendees 在会后才可确认，也不作为会前预测特征。只使用必要字段，权限分级，设置留存周期。新增提醒、确认、取消、签到、释放及再预约事件日志，为后续验证服务。</p><p><strong>算法模型：</strong>先以“午间/傍晚优先提醒”的规则为基线；数据积累后试用逻辑回归或浅层决策树预测爽约风险，使用分类特征编码并处理类不均衡。历史样本仅覆盖10个工作日，初期可先用规则试点，不能据此承诺模型稳定泛化。训练和验证按时间先后划分，预处理仅在训练数据拟合，必要时开展滚动时间验证。</p><p><strong>业务应用：</strong>预约产生→提取会前特征→计算风险等级→高风险会前提醒和二次确认→预约人保留或取消→按核实的状态及已告知签到规则处理资源释放→通知候补→记录结果。风险分数仅辅助提醒，不替代用户确认和企业规则，不按模型分数直接取消预约。</p><p><strong>预期效果：</strong>目标是减少爽约和空占、提高被释放时段的再预约使用率、减少找房耗时，同时控制额外提醒负担和错误释放。此处为待验证目标，不虚构改善百分比或成本节省金额。</p><p><strong>验证方法：</strong>先做历史时间留出验证，报告爽约类精确率、召回率、F1及样本量、混淆矩阵，并与规则基线比较。再将可比会议室/日期的预约随机分配到原流程与提醒流程，尽量控制跨组干扰并覆盖相同时段；观察至少预先约定的完整周期，不只挑最好的一天。</p><p>线上业务指标：爽约率=爽约笔数/同周期有效预约笔数；释放后再利用率=被释放且又被预约并实际使用的时段数/同周期已释放时段数。同步报告各分母、提醒量、投诉及错误释放事件；比较组间改善和不确定性，结合用户反馈复核，未达到预设目标则调整规则或回退。</p>`}],writtenDownloadPath:`materials/b12-written-reference.html`};export{e as default};