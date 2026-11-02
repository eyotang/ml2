# 来源：https://ai-trainer-exam-87484.app.workbuddy.host/?sharecode=P6SA3BBFCH
# 主答案采用老师提供的参考代码，分步练习仅在老师的原表达式上挖空；老师列出的等价写法保留供对照。
import pandas as pd

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

print('\n各时段爽约情况')
print(slot_summary)

# M3（2分）：分析会议室容量匹配
# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率
used = valid[valid['status'] == '已使用'].merge(rooms, on='room_id')
used['seat_util'] = used["attendees"] / used["capacity"]
room_summary = used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()

print('\n各会议室空间利用情况')
print(room_summary)

# M4（1分）：输出空间匹配优化候选清单
# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室
candidates = room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]

print('\n空间匹配优化候选清单')
print(candidates)
