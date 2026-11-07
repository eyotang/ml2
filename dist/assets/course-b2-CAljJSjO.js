var e={id:`b2`,title:`B2 · 冷链运输温控异常预警`,steps:[{id:`b2-1`,title:`转换发车时间`,goal:`将字符串转换为 pandas 日期时间，便于提取小时。`,code:`# 转换发车时间并提取发车小时
df['depart_time'] = pd.{{}}(df['depart_time'])`,slots:[{answer:`to_datetime`,choices:[`to_datetime`,`to_numeric`,`get_dummies`],why:`to_datetime 用于日期时间转换；to_numeric 用于数值转换。`}],hint:`使用 pandas 的日期时间转换函数。`,context:`df = pd.read_csv('cold_chain_shipments.csv')`,solution:`# 转换发车时间并提取发车小时
df['depart_time'] = pd.to_datetime(df['depart_time'])`,examComments:`# 转换发车时间并提取发车小时`,teacherExpression:`pd.to_datetime(df['depart_time'])`,websiteReferences:[`pd.to_datetime(df['depart_time'])`,`pd.to_datetime(df["depart_time"])`],websiteHint:`pd.to_datetime(...)`},{id:`b2-2`,title:`提取发车小时`,goal:`从转换后的时间列生成 0～23 的小时特征。`,code:`# 转换发车时间并提取发车小时
df['depart_hour'] = df['depart_time'].{{}}.{{}}`,slots:[{answer:`dt`,choices:[`dt`,`str`,`loc`],why:`日期时间 Series 的向量化访问器是 dt。`},{answer:`hour`,choices:[`hour`,`day`,`month`],why:`hour 提取小时，day 与 month 提取日和月。`}],hint:`先使用 dt 访问器，再获取小时。`,context:``,solution:`# 转换发车时间并提取发车小时
df['depart_hour'] = df['depart_time'].dt.hour`,examComments:`# 转换发车时间并提取发车小时`,teacherExpression:`df['depart_time'].dt.hour`,websiteReferences:[`df['depart_time'].dt.hour`,`df["depart_time"].dt.hour`],websiteHint:`Series.dt.hour`},{id:`b2-3`,title:`按运输单号去重`,goal:`同一运输单号代表同一次运输，只保留一条记录。`,code:`# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录
df = df.{{}}(subset={{}})`,slots:[{answer:`drop_duplicates`,choices:[`drop_duplicates`,`dropna`,`reset_index`],why:`drop_duplicates 按指定字段去重。`},{answer:`'shipment_id'`,choices:[`'shipment_id'`,`'cargo_type'`,`'route_region'`],why:`shipment_id 标识运输任务；按货物类型或区域去重会丢失大量合法样本。`}],hint:`唯一标识是 shipment_id。`,context:``,solution:`# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录
df = df.drop_duplicates(subset='shipment_id')`,examComments:`# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录`,teacherExpression:`df.drop_duplicates(subset='shipment_id')`,websiteReferences:[`df.drop_duplicates(subset='shipment_id')`,`df.drop_duplicates(subset="shipment_id")`],websiteHint:`drop_duplicates(subset=...)`},{id:`b2-4`,title:`过滤非法记录`,goal:`保留 0<planned_hours≤24 且 sensor_missing_rate 在 [0,1] 的记录；排除0、包含24，24小时是运输时长上界，不是答题时限。`,code:`# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录
df = df[(df['planned_hours']{{}}0)&(df['planned_hours']<=24)&(df['sensor_missing_rate'].{{}}(0,1))]`,slots:[{answer:`>`,choices:[`>`,`>=`,`<`],why:`运输时长必须为正，0 也需要排除。`},{answer:`between`,choices:[`between`,`isin`,`eq`],why:`between(0, 1) 默认包含边界 0 和 1；isin([0,1]) 只能保留两个端点。`}],hint:`计划运输时长必须大于0且不超过24小时；传感器缺失率的 between(0,1) 包含两个边界。`,context:``,solution:`# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录
df = df[(df['planned_hours']>0)&(df['planned_hours']<=24)&(df['sensor_missing_rate'].between(0,1))]`,examComments:`# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录`,teacherExpression:`df[(df['planned_hours']>0)&(df['planned_hours']<=24)&(df['sensor_missing_rate'].between(0,1))]`,websiteReferences:[`df[(df['planned_hours'] > 0) & (df['planned_hours'] <= 24) & (df['sensor_missing_rate'] >= 0) & (df['sensor_missing_rate'] <= 1)]`,`df[(df['planned_hours']>0)&(df['planned_hours']<=24)&(df['sensor_missing_rate'].between(0,1))]`],websiteHint:`计划时长须为正且合理（≤24），缺失率须在 0~1`},{id:`b2-5`,title:`按货物类型填补缺失温度`,goal:`用同货物类型的平均温度中位数，填补 avg_temp 的缺失值。`,code:`# 按货物类型的中位数填补 avg_temp 缺失值
df['avg_temp'] = df.groupby('cargo_type')['avg_temp'].{{}}(lambda s: s.{{}}(s.{{}}()))`,slots:[{answer:`transform`,choices:[`transform`,`agg`,`count`],why:`transform 返回与原行对齐的分组结果，适合逐行填补。`},{answer:`fillna`,choices:[`fillna`,`dropna`,`replace`],why:`fillna 只填补缺失项，不覆盖已有温度。`},{answer:`median`,choices:[`median`,`mean`,`max`],why:`题目指定组内中位数，不是均值或最大值。`}],hint:`先 groupby，再用 transform 保持行对齐，在每个货物类型组内填补中位数。`,context:``,solution:`# 按货物类型的中位数填补 avg_temp 缺失值
df['avg_temp'] = df.groupby('cargo_type')['avg_temp'].transform(lambda s: s.fillna(s.median()))`,examComments:`# 按货物类型的中位数填补 avg_temp 缺失值`,teacherExpression:`df.groupby('cargo_type')['avg_temp'].transform(lambda s: s.fillna(s.median()))`,websiteReferences:[`df.groupby('cargo_type')['avg_temp'].transform(lambda s: s.fillna(s.median()))`,`df.groupby("cargo_type")["avg_temp"].transform(lambda s: s.fillna(s.median()))`],websiteHint:`groupby + transform，不能用全列中位数`},{id:`b2-6`,title:`统计货物与区域分布`,goal:`按货物类型、线路区域统计样本数、报警率和平均传感器缺失率。`,code:`# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率
cargo_region_summary = df.groupby({{}}).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm',{{}}), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()`,slots:[{answer:`['cargo_type', 'route_region']`,choices:[`['cargo_type', 'route_region']`,`['vehicle_type']`,`['shipment_id']`],why:`题目要求货物类型与线路区域两个分组维度。`},{answer:`'mean'`,choices:[`'mean'`,`'sum'`,`'count'`],why:`temp_alarm 是 0/1 标签，均值是报警比例；求和仅得到报警数。`}],hint:`0/1 标签的均值可以表示事件发生率。`,context:``,solution:`# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率
cargo_region_summary = df.groupby(['cargo_type','route_region']).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm','mean'), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()`,examComments:`# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率`,teacherExpression:`df.groupby(['cargo_type','route_region']).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm','mean'), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()`,websiteReferences:[`df.groupby(['cargo_type','route_region']).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm','mean'), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()`],websiteHint:`两级 groupby + 命名聚合 agg`},{id:`b2-7`,title:`编码特征矩阵`,goal:`从指定 feature_cols 取特征，对 category_cols 三个分类字段独热编码。`,code:`# 构造特征矩阵与目标变量，并对分类字段进行独热编码
X = pd.{{}}(df[feature_cols], columns={{}})`,slots:[{answer:`get_dummies`,choices:[`get_dummies`,`concat`,`to_numeric`],why:`get_dummies 将类别转换成指示变量。`},{answer:`category_cols`,choices:[`category_cols`,`feature_cols`,`['temp_alarm']`],why:`只对分类字段编码，不能把目标标签作为输入特征。`}],hint:`category_cols 已定义为区域、车型、货物类型。`,context:`feature_cols = ['route_region', 'vehicle_type', 'cargo_type', 'planned_hours',
    'outside_temp', 'avg_temp', 'max_temp', 'door_open_count',
    'sensor_missing_rate', 'driver_experience_years', 'depart_hour']
category_cols = ['route_region', 'vehicle_type', 'cargo_type']`,solution:`# 构造特征矩阵与目标变量，并对分类字段进行独热编码
X = pd.get_dummies(df[feature_cols], columns=category_cols)`,examComments:`# 构造特征矩阵与目标变量，并对分类字段进行独热编码`,teacherExpression:`pd.get_dummies(df[feature_cols], columns=category_cols)`,websiteReferences:[`pd.get_dummies(df[feature_cols], columns=category_cols)`,`pd.get_dummies(df[feature_cols], columns=category_cols).astype(float)`],websiteHint:`pd.get_dummies(..., columns=...)`},{id:`b2-8`,title:`提取目标变量`,goal:`预测目标是运输是否出现温控报警。`,code:`# 构造特征矩阵与目标变量，并对分类字段进行独热编码
y = df[{{}}]`,slots:[{answer:`'temp_alarm'`,choices:[`'temp_alarm'`,`'max_temp'`,`'cargo_type'`],why:`temp_alarm 是 0/1 监督标签，max_temp 属于输入特征。`}],hint:`标签列是 temp_alarm。`,context:``,solution:`# 构造特征矩阵与目标变量，并对分类字段进行独热编码
y = df['temp_alarm']`,examComments:`# 构造特征矩阵与目标变量，并对分类字段进行独热编码`,teacherExpression:`df['temp_alarm']`,websiteReferences:[`df['temp_alarm']`,`df["temp_alarm"]`],websiteHint:`温控报警标签列`},{id:`b2-9`,title:`分层划分训练与测试集`,goal:`训练集占 75%，测试集占 25%，固定随机种子 42，并保持标签比例。`,code:`# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size={{}}, stratify={{}}, random_state={{}})`,slots:[{answer:`0.25`,choices:[`0.25`,`0.75`,`25`],why:`test_size 表示测试集占比，25% 应写 0.25。`},{answer:`y`,choices:[`y`,`X`,`None`],why:`stratify=y 按目标类别分层，保持训练和测试的标签分布。`},{answer:`42`,choices:[`42`,`0`,`None`],why:`题目指定 random_state=42，以便复现划分。`}],hint:`test_size 是测试集比例；分层依据是目标 y。`,context:``,solution:`# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)`,examComments:`# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42`,teacherExpression:`train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)`,websiteReferences:[`train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)`],websiteHint:`test_size=0.25、stratify=y、random_state=42 缺一不可`},{id:`b2-10`,title:`配置随机森林`,goal:`使用 100 棵树、最大深度 6、平衡类别权重、随机种子 42。`,code:`# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42
model = RandomForestClassifier(n_estimators={{}}, max_depth={{}}, class_weight={{}}, random_state=42)`,slots:[{answer:`100`,choices:[`100`,`6`,`42`],why:`n_estimators 是树的数量。`},{answer:`6`,choices:[`6`,`100`,`None`],why:`max_depth 限制每棵树的最大深度。`},{answer:`'balanced'`,choices:[`'balanced'`,`None`,`'balance'`],why:`合法参数值是 balanced，根据类别频率调整权重；balance 不是该参数的有效值。`}],hint:`区分树的数量和深度，类别权重写 balanced。`,context:``,solution:`# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42
model = RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)`,examComments:`# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42`,teacherExpression:`RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)`,websiteReferences:[`RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)`],websiteHint:`四个参数都要写全`},{id:`b2-11`,title:`训练模型`,goal:`仅用训练集特征及训练集标签拟合分类器。`,code:`# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42
model.{{}}({{}}, {{}})`,slots:[{answer:`fit`,choices:[`fit`,`predict`,`score`],why:`fit 进行模型训练。`},{answer:`X_train`,choices:[`X_train`,`X_test`,`X`],why:`训练数据是 X_train，不可拿测试集拟合。`},{answer:`y_train`,choices:[`y_train`,`y_test`,`y`],why:`标签必须与训练集特征一一对应。`}],hint:`测试集用于独立评估，不能参与拟合。`,context:``,solution:`# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42
model.fit(X_train, y_train)`,examComments:`# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42`,teacherExpression:`model.fit(X_train, y_train)`,websiteReferences:[`model.fit(X_train, y_train)`],websiteHint:`model.fit(...)`},{id:`b2-12`,title:`预测测试集`,goal:`对保留的测试集生成类别预测。`,code:`# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42
y_pred = model.{{}}({{}})`,slots:[{answer:`predict`,choices:[`predict`,`fit`,`predict_proba`],why:`predict 输出类别标签；predict_proba 输出概率，不能直接作为这些分类指标的类别输入。`},{answer:`X_test`,choices:[`X_test`,`X_train`,`y_test`],why:`最终测试指标应基于 X_test 的预测结果。`}],hint:`训练用 fit，预测类别用 predict。`,context:``,solution:`# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42
y_pred = model.predict(X_test)`,examComments:`# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42`,teacherExpression:`model.predict(X_test)`,websiteReferences:[`model.predict(X_test)`],websiteHint:`model.predict(...)`},{id:`b2-13`,title:`计算精确率`,goal:`使用测试集真实标签与预测标签计算精确率。`,code:`# 计算精确率、召回率、F1值和混淆矩阵
precision = {{}}({{}}, {{}})`,slots:[{answer:`precision_score`,choices:[`precision_score`,`recall_score`,`f1_score`,`confusion_matrix`],why:`精确率是预测报警中真实报警的比例，关注误报。`},{answer:`y_test`,choices:[`y_test`,`y_train`,`y_pred`],why:`第一个参数是真实标签 y_test。`},{answer:`y_pred`,choices:[`y_pred`,`y_test`,`X_test`],why:`第二个参数是预测标签 y_pred；顺序交换会改变精确率和召回率的意义。`}],hint:`指标函数的参数顺序：真实值在前，预测值在后。`,context:``,solution:`# 计算精确率、召回率、F1值和混淆矩阵
precision = precision_score(y_test, y_pred)`,examComments:`# 计算精确率、召回率、F1值和混淆矩阵`,teacherExpression:`precision_score(y_test, y_pred)`,websiteReferences:[`precision_score(y_test, y_pred)`],websiteHint:`precision_score(真实值, 预测值)`},{id:`b2-14`,title:`计算召回率`,goal:`使用测试集真实标签与预测标签计算召回率。`,code:`# 计算精确率、召回率、F1值和混淆矩阵
recall = {{}}({{}}, {{}})`,slots:[{answer:`recall_score`,choices:[`recall_score`,`precision_score`,`f1_score`,`confusion_matrix`],why:`召回率是真实报警中被找出的比例，关注漏报。`},{answer:`y_test`,choices:[`y_test`,`y_train`,`y_pred`],why:`第一个参数是真实标签 y_test。`},{answer:`y_pred`,choices:[`y_pred`,`y_test`,`X_test`],why:`第二个参数是预测标签 y_pred；顺序交换会改变精确率和召回率的意义。`}],hint:`指标函数的参数顺序：真实值在前，预测值在后。`,context:``,solution:`# 计算精确率、召回率、F1值和混淆矩阵
recall = recall_score(y_test, y_pred)`,examComments:`# 计算精确率、召回率、F1值和混淆矩阵`,teacherExpression:`recall_score(y_test, y_pred)`,websiteReferences:[`recall_score(y_test, y_pred)`],websiteHint:`recall_score(...)`},{id:`b2-15`,title:`计算F1 值`,goal:`使用测试集真实标签与预测标签计算F1 值。`,code:`# 计算精确率、召回率、F1值和混淆矩阵
f1 = {{}}({{}}, {{}})`,slots:[{answer:`f1_score`,choices:[`f1_score`,`precision_score`,`recall_score`,`confusion_matrix`],why:`F1 综合精确率与召回率，不能只看准确率。`},{answer:`y_test`,choices:[`y_test`,`y_train`,`y_pred`],why:`第一个参数是真实标签 y_test。`},{answer:`y_pred`,choices:[`y_pred`,`y_test`,`X_test`],why:`第二个参数是预测标签 y_pred；顺序交换会改变精确率和召回率的意义。`}],hint:`指标函数的参数顺序：真实值在前，预测值在后。`,context:``,solution:`# 计算精确率、召回率、F1值和混淆矩阵
f1 = f1_score(y_test, y_pred)`,examComments:`# 计算精确率、召回率、F1值和混淆矩阵`,teacherExpression:`f1_score(y_test, y_pred)`,websiteReferences:[`f1_score(y_test, y_pred)`],websiteHint:`f1_score(...)`},{id:`b2-16`,title:`计算混淆矩阵`,goal:`使用测试集真实标签与预测标签计算混淆矩阵。`,code:`# 计算精确率、召回率、F1值和混淆矩阵
cm = {{}}({{}}, {{}})`,slots:[{answer:`confusion_matrix`,choices:[`confusion_matrix`,`precision_score`,`recall_score`,`f1_score`],why:`混淆矩阵展示真实类别和预测类别的组合，便于定位误报与漏报。`},{answer:`y_test`,choices:[`y_test`,`y_train`,`y_pred`],why:`第一个参数是真实标签 y_test。`},{answer:`y_pred`,choices:[`y_pred`,`y_test`,`X_test`],why:`第二个参数是预测标签 y_pred；顺序交换会改变精确率和召回率的意义。`}],hint:`指标函数的参数顺序：真实值在前，预测值在后。`,context:``,solution:`# 计算精确率、召回率、F1值和混淆矩阵
cm = confusion_matrix(y_test, y_pred)`,examComments:`# 计算精确率、召回率、F1值和混淆矩阵`,teacherExpression:`confusion_matrix(y_test, y_pred)`,websiteReferences:[`confusion_matrix(y_test, y_pred)`],websiteHint:`confusion_matrix(...)`},{id:`b2-17`,title:`比较各货物类型召回率`,goal:`保留测试集原始索引，关联货物类型后按组评估召回率。`,code:`# 计算测试集中不同货物类型的召回率
test_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()
test_result['actual'] = y_test.to_numpy()
test_result['predicted'] = y_pred
cargo_recall = test_result.groupby({{}}).apply(lambda g: {{}}(g[{{}}], g[{{}}]))`,slots:[{answer:`'cargo_type'`,choices:[`'cargo_type'`,`'shipment_id'`,`'predicted'`],why:`业务要求比较货物类型，不能按预测标签分组。`},{answer:`recall_score`,choices:[`recall_score`,`precision_score`,`f1_score`],why:`需要比较召回率，即各组真实报警被找出的比例。`},{answer:`'actual'`,choices:[`'actual'`,`'predicted'`,`'cargo_type'`],why:`actual 保存测试集真实标签。`},{answer:`'predicted'`,choices:[`'predicted'`,`'actual'`,`'shipment_id'`],why:`predicted 保存对应行的预测标签。`}],hint:`按 cargo_type 分组，在组内用 actual 与 predicted 计算召回率。`,context:``,solution:`# 计算测试集中不同货物类型的召回率
test_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()
test_result['actual'] = y_test.to_numpy()
test_result['predicted'] = y_pred
cargo_recall = test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))`,examComments:`# 计算测试集中不同货物类型的召回率`,teacherExpression:`test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))`,websiteReferences:[`test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))`,`test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']), include_groups=False)`],websiteHint:`按 cargo_type 分组后对每组算 recall_score`},{id:`b2-18`,kind:`case`,taskIndex:0,title:`任务三：选择优先指标并解释理由`,goal:`把冷链漏报风险与指标含义对应起来。`,code:`优先关注异常类的 {{}}。
理由：{{}}。
同时关注 {{}}，避免只追求单一指标。`,solution:`优先关注异常类的 召回率。
理由：漏报可能导致货损与质量安全风险。
同时关注 精确率、F1及误报处置成本，避免只追求单一指标。`,slots:[{answer:`召回率`,choices:[`召回率`,`总体准确率`,`仅看正常类预测数量`],why:`异常召回率=TP/(TP+FN)，衡量真实异常被识别的比例。`,accepted:[],matchRule:{groups:[[`召回率`,`recall`]]}},{answer:`漏报可能导致货损与质量安全风险`,choices:[`漏报可能导致货损与质量安全风险`,`误报完全没有成本`,`总体准确率高就一定没有风险`],why:`冷链异常漏报会延迟干预，导致异常运输未及时处置。`,accepted:[],matchRule:{groups:[[`漏报`,`漏检`,`未识别`],[`货损`,`安全`,`质量`,`损失`]]}},{answer:`精确率、F1及误报处置成本`,choices:[`精确率、F1及误报处置成本`,`只看训练集准确率`,`忽略误报与人工负担`],why:`需要兼顾误报、人工复核和运营负担，不能只看召回率。`,accepted:[],matchRule:{groups:[[`精确率`,`precision`],[`误报`,`成本`,`负担`,`f1`]]}}],hint:`结合业务说明指标和理由；改进措施要具体，效果需在独立数据上验证。`,context:``},{id:`b2-19`,kind:`case`,taskIndex:0,title:`任务三：改进薄弱货类并验证`,goal:`提出一项针对性的改进措施，再说明怎样证明有效。`,code:`先比较各货类召回率、异常样本数和漏报数。
措施：针对薄弱货类 {{}}。
重新训练后用 {{}} 对比。
核对薄弱组召回率和漏报数，同时检查 {{}}。`,solution:`先比较各货类召回率、异常样本数和漏报数。
措施：针对薄弱货类 补充代表性异常正样本并核验标签。
重新训练后用 保留的独立测试集 对比。
核对薄弱组召回率和漏报数，同时检查 总体表现、各组精确率和误报负担。`,slots:[{answer:`补充代表性异常正样本并核验标签`,choices:[`补充代表性异常正样本并核验标签`,`删除该组测试难例`,`修改测试标签让分数变高`],why:`补充薄弱类别真实异常数据用于训练，覆盖多样条件，先核验标签。`,accepted:[],matchRule:{groups:[[`补充`,`增加`,`采集`],[`异常`,`正样本`],[`标签`,`核验`,`审核`]]}},{answer:`保留的独立测试集`,choices:[`保留的独立测试集`,`并入训练的原测试集`,`只在训练数据上`],why:`测试数据不能参与训练或反复选型；必要时另设验证集和最终独立测试批次。`,accepted:[],matchRule:{groups:[[`独立`,`保留`,`未参与`],[`测试`,`验证`]]}},{answer:`总体表现、各组精确率和误报负担`,choices:[`总体表现、各组精确率和误报负担`,`只看训练分数`,`忽略其他货物类型`],why:`改善弱组的同时评估总体与其他分组，防止以大量误报换取召回。`,accepted:[],matchRule:{groups:[[`总体`,`其他组`,`分组`],[`精确率`,`误报`,`成本`]]}}],hint:`结合业务说明指标和理由；改进措施要具体，效果需在独立数据上验证。`,context:``}],count:19,originalCode:`import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix


# 读取与清洗数据
df = pd.read_csv('cold_chain_shipments.csv')

# 转换发车时间并提取发车小时
df['depart_time'] = ______________________________
df['depart_hour'] = ______________________________

# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录
df = _____________________________________________
df = _____________________________________________

# 按货物类型的中位数填补 avg_temp 缺失值
df['avg_temp'] = __________________________________

print('清洗后记录数：', len(df))


# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率
cargo_region_summary = ______________________________________________
print(cargo_region_summary)


feature_cols = [
    'route_region', 'vehicle_type', 'cargo_type', 'planned_hours',
    'outside_temp', 'avg_temp', 'max_temp', 'door_open_count',
    'sensor_missing_rate', 'driver_experience_years', 'depart_hour'
]
category_cols = ['route_region', 'vehicle_type', 'cargo_type']

# 构造特征矩阵与目标变量，并对分类字段进行独热编码
X = _______________________________________________
y = _______________________________________________

# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42
X_train, X_test, y_train, y_test = _________________________________

# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42
model = _____________________________________________________________
_____________________________________________________________
y_pred = ____________________________________________________________

# 计算精确率、召回率、F1值和混淆矩阵
precision = __________________________
recall = _____________________________
f1 = _________________________________
cm = _________________________________
print('precision=', round(precision, 3))
print('recall=', round(recall, 3))
print('f1=', round(f1, 3))
print('confusion matrix=\\n', cm)

# 计算测试集中不同货物类型的召回率
test_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()
test_result['actual'] = y_test.to_numpy()
test_result['predicted'] = y_pred
cargo_recall = ______________________________________________________
print(cargo_recall)
`,referenceCode:`import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix

# 读取与清洗数据
df = pd.read_csv('cold_chain_shipments.csv')

# 转换发车时间并提取发车小时
df['depart_time'] = pd.to_datetime(df['depart_time'])
df['depart_hour'] = df['depart_time'].dt.hour

# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录
df = df.drop_duplicates(subset='shipment_id')
df = df[(df['planned_hours'] > 0) & (df['planned_hours'] <= 24) & (df['sensor_missing_rate'] >= 0) & (df['sensor_missing_rate'] <= 1)]

# 按货物类型的中位数填补 avg_temp 缺失值
df['avg_temp'] = df.groupby('cargo_type')['avg_temp'].transform(lambda s: s.fillna(s.median()))

print('清洗后记录数：', len(df))

# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率
cargo_region_summary = df.groupby(['cargo_type','route_region']).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm','mean'), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()
print(cargo_region_summary)

feature_cols = [
    'route_region', 'vehicle_type', 'cargo_type', 'planned_hours',
    'outside_temp', 'avg_temp', 'max_temp', 'door_open_count',
    'sensor_missing_rate', 'driver_experience_years', 'depart_hour'
]
category_cols = ['route_region', 'vehicle_type', 'cargo_type']

# 构造特征矩阵与目标变量，并对分类字段进行独热编码
X = pd.get_dummies(df[feature_cols], columns=category_cols)
y = df['temp_alarm']

# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42
model = RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# 计算精确率、召回率、F1值和混淆矩阵
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
cm = confusion_matrix(y_test, y_pred)
print('precision=', round(precision, 3))
print('recall=', round(recall, 3))
print('f1=', round(f1, 3))
print('confusion matrix=\\n', cm)

# 计算测试集中不同货物类型的召回率
test_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()
test_result['actual'] = y_test.to_numpy()
test_result['predicted'] = y_pred
cargo_recall = test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))
print(cargo_recall)`,websiteURL:`https://ai-trainer-exam-87484.app.workbuddy.host/?sharecode=P6SA3BBFCH`,websiteNote:`主答案采用老师提供的参考代码，分步练习仅在老师的原表达式上挖空；老师列出的等价写法保留供对照。本练习按已确认规则将计划运输时长上限调整为24小时，保留原有 >0、<= 的筛选写法；不是答题时长限制。`,websiteCode:`import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix

# 读取与清洗数据
df = pd.read_csv('cold_chain_shipments.csv')

# 转换发车时间并提取发车小时
df['depart_time'] = pd.to_datetime(df['depart_time'])
df['depart_hour'] = df['depart_time'].dt.hour

# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录
df = df.drop_duplicates(subset='shipment_id')
df = df[(df['planned_hours'] > 0) & (df['planned_hours'] <= 24) & (df['sensor_missing_rate'] >= 0) & (df['sensor_missing_rate'] <= 1)]

# 按货物类型的中位数填补 avg_temp 缺失值
df['avg_temp'] = df.groupby('cargo_type')['avg_temp'].transform(lambda s: s.fillna(s.median()))

print('清洗后记录数：', len(df))

# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率
cargo_region_summary = df.groupby(['cargo_type','route_region']).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm','mean'), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()
print(cargo_region_summary)

feature_cols = [
    'route_region', 'vehicle_type', 'cargo_type', 'planned_hours',
    'outside_temp', 'avg_temp', 'max_temp', 'door_open_count',
    'sensor_missing_rate', 'driver_experience_years', 'depart_hour'
]
category_cols = ['route_region', 'vehicle_type', 'cargo_type']

# 构造特征矩阵与目标变量，并对分类字段进行独热编码
X = pd.get_dummies(df[feature_cols], columns=category_cols)
y = df['temp_alarm']

# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

# 构建随机森林分类器并完成训练和预测
# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42
model = RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# 计算精确率、召回率、F1值和混淆矩阵
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
cm = confusion_matrix(y_test, y_pred)
print('precision=', round(precision, 3))
print('recall=', round(recall, 3))
print('f1=', round(f1, 3))
print('confusion matrix=\\n', cm)

# 计算测试集中不同货物类型的召回率
test_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()
test_result['actual'] = y_test.to_numpy()
test_result['predicted'] = y_pred
cargo_recall = test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))
print(cargo_recall)`,answerSchema:2,tasks:[{id:`b2t3`,title:`任务三 · 形成算法测试结论`,promptHTML:`<p>结合冷链温控异常预警业务，说明应优先关注的分类指标及理由，并针对不同货物类型测试表现存在明显差异的情况提出一项改进措施。</p>`,answerHTML:`<table><caption>优先指标与业务理由</caption><thead><tr><th>答题要点</th><th>回答内容</th></tr></thead><tbody><tr><td>优先指标及含义</td><td>优先关注温控异常类（temp_alarm=1）的召回率，即 TP/(TP+FN)：实际异常运输中有多少被正确预警。</td></tr><tr><td>业务理由</td><td>漏报可能使温控异常未被及时处置，带来货损和质量安全风险，因此应重点减少 FN。不能只看总体准确率，正常样本较多时它可能掩盖异常漏报。</td></tr><tr><td>兼顾指标与目标</td><td>也不能孤立追求召回率：同时报告精确率、F1和混淆矩阵，评估误报造成的人工复核和运营成本。具体目标需结合业务风险与处置能力确定，不虚构固定达标值。</td></tr></tbody></table><table><caption>薄弱货类改进与验证</caption><thead><tr><th>答题要点</th><th>回答内容</th></tr></thead><tbody><tr><td>差异诊断</td><td>依据本次测试输出，列出各货物类型的异常召回率、异常样本数及漏报数，识别薄弱类别；总体指标不能代表每个货类。样本很少时还应报告不确定性，不能凭一次划分认定业务差异一定稳定存在。</td></tr><tr><td>一项改进措施</td><td>针对异常召回率偏低的货物类型，补充具有代表性的异常正样本，覆盖不同线路、季节和温度条件，并由业务人员核验标签，再加入训练集重新训练。这是一项“针对薄弱货类的数据补充与核验”措施；不能为了抬高指标而删除该组难例、修改测试标签或把测试集并入训练集。</td></tr><tr><td>验证数据与比较</td><td>保留独立测试集，原模型与新模型在同一测试口径上对比薄弱货类异常召回率、漏报数和异常样本数，</td></tr><tr><td>效果检查</td><td>同时核对总体召回率、各组精确率及误报负担。</td></tr><tr><td>结果使用边界</td><td>若反复据测试结果调参，应另设验证集，并保留最终未参与选型的测试数据；必要时补充独立时间批次复核。改善需由实际结果证实，不能仅凭训练集分数承诺上线效果。</td></tr></tbody></table>`,conclusionTables:[{title:`优先指标与业务理由`,headers:[`答题要点`,`回答内容`],rows:[[`优先指标及含义`,`优先关注温控异常类（temp_alarm=1）的召回率，即 TP/(TP+FN)：实际异常运输中有多少被正确预警。`],[`业务理由`,`漏报可能使温控异常未被及时处置，带来货损和质量安全风险，因此应重点减少 FN。不能只看总体准确率，正常样本较多时它可能掩盖异常漏报。`],[`兼顾指标与目标`,`也不能孤立追求召回率：同时报告精确率、F1和混淆矩阵，评估误报造成的人工复核和运营成本。具体目标需结合业务风险与处置能力确定，不虚构固定达标值。`]]},{title:`薄弱货类改进与验证`,headers:[`答题要点`,`回答内容`],rows:[[`差异诊断`,`依据本次测试输出，列出各货物类型的异常召回率、异常样本数及漏报数，识别薄弱类别；总体指标不能代表每个货类。样本很少时还应报告不确定性，不能凭一次划分认定业务差异一定稳定存在。`],[`一项改进措施`,`针对异常召回率偏低的货物类型，补充具有代表性的异常正样本，覆盖不同线路、季节和温度条件，并由业务人员核验标签，再加入训练集重新训练。这是一项“针对薄弱货类的数据补充与核验”措施；不能为了抬高指标而删除该组难例、修改测试标签或把测试集并入训练集。`],[`验证数据与比较`,`保留独立测试集，原模型与新模型在同一测试口径上对比薄弱货类异常召回率、漏报数和异常样本数，`],[`效果检查`,`同时核对总体召回率、各组精确率及误报负担。`],[`结果使用边界`,`若反复据测试结果调参，应另设验证集，并保留最终未参与选型的测试数据；必要时补充独立时间批次复核。改善需由实际结果证实，不能仅凭训练集分数承诺上线效果。`]]}]}],writtenDownloadPath:`materials/b2-written-reference.html`};export{e as default};