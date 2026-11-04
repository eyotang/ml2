"""Additional sample-required visualizations; teacher code remains unchanged."""
import json

def enrich(course, root):
    code = '''# 样卷任务一补充：数据可视化（老师参考代码保持原样）
import matplotlib.pyplot as plt

# 对比各时段爽约率，标出需要优先干预的时段
slot_labels = {'上午': 'Morning', '午间': 'Midday', '下午': 'Afternoon', '傍晚': 'Evening'}
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].bar([slot_labels.get(str(x), str(x)) for x in slot_summary.index], slot_summary['爽约率'] * 100)
axes[0].set(title='No-show rate by time slot', ylabel='No-show rate (%)')

# 对比已使用场次的平均座位利用率；低于40%为优化候选
axes[1].bar(room_summary['room_id'].astype(str), room_summary['平均座位利用率'] * 100)
axes[1].axhline(40, color='red', linestyle='--', label='40% threshold')
axes[1].set(title='Mean seat utilization by room', ylabel='Seat utilization (%)', xlabel='Room')
axes[1].legend()
plt.tight_layout()
'''
    # Column names must match the teacher's actual aggregation output.
    course['visualizationCode'] = code
    steps=[]
    for id,title,comment,line,answers,wrong in [
      ('b12-13','任务一：时段爽约率图','# 对比各时段爽约率，纵轴使用百分比',"axes[0].{{}}(slot_summary.index.astype(str), slot_summary['爽约率'] * {{}})",['bar','100'],[['plotting','scatterplot'],['0.01','10']]),
      ('b12-14','任务一：会议室利用率图','# 平均座位利用率低于40%时，列入优化候选',"axes[1].bar(room_summary['room_id'].astype(str), room_summary['平均座位利用率'] * 100)\naxes[1].{{}}({{}}, color='red', linestyle='--')",['axhline','40'],[['axvline','hist'],['0.4','4']])]:
        template=comment+'\n'+line;solution=template
        slots=[]
        for a,w in zip(answers,wrong):
            solution=solution.replace('{{}}',a,1)
            slots.append(dict(answer=a,choices=[a,*w],why='柱状图用于类别对比；比例乘100转为百分数，横向阈值线便于识别低利用率。',accepted=[]))
        steps.append(dict(id=id,title=title,goal=comment[2:],code=template,solution=solution,slots=slots,hint='先运行老师参考代码得到汇总表，再在同一环境绘图。',context='补充样卷明确要求的数据可视化。'))
    course['steps'][7:7]=steps
    course['count']=len(course['steps'])
    course['originalCode'] += '\n\n'+code.replace("['爽约率'] * 100","['爽约率'] * ________").replace('axhline(40','axhline(________')
    course['visualizationDownloadPath']='materials/b12-visualization.ipynb'
    notebook=dict(nbformat=4,nbformat_minor=5,metadata={},cells=[dict(cell_type='markdown',metadata={},source=['原有老师参考代码完整保留；末尾补充样卷要求的可视化。']),dict(cell_type='code',metadata={},execution_count=None,outputs=[],source=course['referenceCode'].splitlines(True)),dict(cell_type='code',metadata={},execution_count=None,outputs=[],source=code.splitlines(True))])
    (root/'public/materials/b12-visualization.ipynb').write_text(json.dumps(notebook,ensure_ascii=False,indent=2))
