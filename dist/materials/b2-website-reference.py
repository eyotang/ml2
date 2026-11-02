# 来源：https://ai-trainer-exam-87484.app.workbuddy.host/?sharecode=P6SA3BBFCH
# 主答案采用老师提供的参考代码，分步练习仅在老师的原表达式上挖空；老师列出的等价写法保留供对照。planned_hours≤72 是老师参考代码中的运输计划时长筛选条件，不是答题时长限制；本页按老师写法保留。
import pandas as pd
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
df = df[(df['planned_hours'] > 0) & (df['planned_hours'] <= 72) & (df['sensor_missing_rate'] >= 0) & (df['sensor_missing_rate'] <= 1)]

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
print('confusion matrix=\n', cm)

# 计算测试集中不同货物类型的召回率
test_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()
test_result['actual'] = y_test.to_numpy()
test_result['predicted'] = y_pred
cargo_recall = test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))
print(cargo_recall)
