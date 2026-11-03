(() => {
  const source='https://ai-trainer-exam-courseware.app.workbuddy.host/?sharecode=U7DGZ5NTK5';
  const lessons={
    c:{title:'C · 综合评审',anchor:'c',framework:'功能卡 → 协同流程与配置 → 分级规则 → 状态与验证闭环。',points:['功能卡写齐角色、触发、行为、输出及可量化验收。','主流程6～8节点，判断用菱形；负责人确认后发布，未缓解重新生成方案并确认。','15分钟预测窗口遵循题设，0.85、10分钟等是方案示例；JSON不写注释，接口注明方向与字段。'],checklist:['三项功能、三个风险等级、四个状态、三类运行场景是否完整？','日常、高峰、数据异常是否均有人员职责和结果记录？','缺失数据是否误当作安全？未确认方案是否被阻止发布？']},
    b11:{title:'B1-1 · 业务框架与流程',anchor:'b11',framework:'框架说明模块与职责，流程交代条件和去向，改进写措施与验证。',points:['规则按“条件—动作—去向—留痕”逐行写；判断节点补上不满足条件的分支。','先检查图像质量，再按分数分流。隔离不等于报废，不确定保持待检，返工后重检。','P004 先补拍，后续由新图与新分数决定；P005 按现行规则自动放行，不能借用事后人工真值改写路径。'],checklist:['模块、人机职责、输入输出记录是否齐全？','0.20 与 0.80 的边界、包装前有效状态是否明确？','指标是否写清分子、分母、周期、数据来源？抽检比例不能直接冒充总体真实漏放率。']},
    b12:{title:'B1-2 · 数据分析与业务建议',anchor:'b12',framework:'先清理范围，再统计比较，最后把发现转成措施与验证方案。',points:['沿用老师代码的列名；会读数据、去重、筛选、分组、关联、排序，再逐步脱离选项。','爽约率分母是有效预约，排除已取消；座位利用率只分析已使用记录。','业务建议按“发现—价值—措施”组织；AI 方案写数据、模型、应用方式、预期效果和验证。'],checklist:['汇总后的列名是否与候选筛选一致？','图表是否有标题、轴或图例，并说明业务含义？','容量≥12、场次≥20、平均利用率<40% 三项是否同时满足？']},
    b2:{title:'B2 · 训练、评估与结论',anchor:'b2',framework:'清洗 → 编码 → 分层划分 → 训练预测 → 总体与分群评估。',points:['记清 test_size=0.25、stratify=y、random_state=42；树数100、深度6、balanced 权重和种子都要写全。','分组中位数填补用 transform 保持行对齐；指标参数是真实值在前、预测值在后。','结合冷链漏报代价解释召回率，同时关注误报；按货物类型找薄弱分群，写改进和验证。'],checklist:['训练是否仅使用训练集？测试集业务字段是否按原索引对齐？','结论是否引用本次运行的指标、混淆矩阵和分群结果？','课件中的数值只是该环境示例，不能替代当前输出；阈值调整需验证，不直接承诺效果。']},
    b3:{title:'B3 · 多产品方案与实施',anchor:'b3',framework:'产品表 → 规则表 → 协同流程 → 验收 → 实施计划 → 人机与风险边界。',points:['每类产品按“解决问题—数据输入—输出动作”写，流程保持6～8个主要节点并画清异常分支。','降幅目标用现状×(1−降幅)，上限写≤、下限写≥；风险阈值与验收值分开。','按1～2、3～5、6～8周写任务、验收输出和责任人；高风险审批必须在执行前。'],checklist:['1478.4kW、115万元、≥99%、≤5分钟的方向和单位是否正确？','缺失超过5分钟、1500kW风险、24～27℃、60秒执行保护是否覆盖？','关键负荷、失败恢复和全过程留痕是否明确？']},
    b4:{title:'B4 · 培训与指导',anchor:'b4',framework:'讲原则 → 看示范 → 练案例 → 考实操 → 上岗抽查与补训。',points:['知识培训讲功能和边界，技术培训练核验与纠错；面向目标学员，重操作与证据。','优先核对回复发布前的有效知识依据，包括金额、期限、适用条件和承诺。','用正常、有错误、依据不足三类工单练习；拿不准先澄清或升级。'],checklist:['是否各写了1项知识内容和技术内容？','是否突出1个最优先关键点，并给出对应教学方法？','建议时长或合格率要标为方案设置，不当作题设强制要求；关键风险漏检需补训。']},
    theory:{title:'理论题 · 场景判断与简答',anchor:'a-essay',framework:'先读限定条件，再找题目要求；简答按题干列出的要素逐项作答。',points:['客观题先核对适用条件与边界，不只凭关键词选择。','简答每个要素都写成可执行动作，并说明责任、证据或检查方法。','不要把相关性写成因果，把总体指标写成全部分群的表现，或把模型输出写成最终业务裁定。'],checklist:['题干要求的每个要素是否都出现？','是否有数据口径、可验证结果与异常闭环？']},
    a1:{title:'简答1 · 流程合规核查',anchor:'a-essay',framework:'日志 → 标准模型 → 符合性 → 职责分离 → 异常处置 → 持续监控。',points:['围绕工单、活动、人员角色与时间建立追溯链，再说明如何发现越权和跳步。'],checklist:['违规发现后由谁复核、怎样整改、如何复查？']},
    a2:{title:'简答2 · 广告增量评估',anchor:'a-essay',framework:'指标口径 → 对照 → 混杂 → 方法 → 统计判断 → 业务决策。',points:['先回答“没有这次广告会怎样”，再讨论增量；方法选择需满足相应假设。'],checklist:['是否把自然增长或渠道结构变化误当成广告效果？']},
    a3:{title:'简答3 · 需求预测评估',anchor:'a-essay',framework:'时间切分 → 可用特征 → 基线 → 指标 → 滚动回测 → 误差解释。',points:['站在预测时点选择可获得信息，按未来四周的实际使用方式回测。'],checklist:['是否泄漏未来信息？是否处理零销量与商品分群差异？']},
    a4:{title:'简答4 · 监控再训练闭环',anchor:'a-essay',framework:'输入质量 → 分群性能 → 告警 → 人工复核 → 触发 → 灰度 → 回滚。',points:['把监测、触发条件、责任人与版本回退连接起来；自定阈值需说明是方案示例。'],checklist:['总体准确率稳定时，是否继续检查投诉分群与漏报？']},
    a5:{title:'简答5 · 文本分类数据与评估',anchor:'a-essay',framework:'标签体系 → 抽样 → 标注一致性 → 划分 → 指标 → 错误分析。',points:['先清晰定义标签边界，再补长尾数据；相同工单或近重复文本不能跨集合泄漏。'],checklist:['是否报告宏平均F1、重点类别表现与样本量，并反馈修订标注规则？']},
    a6:{title:'简答6 · 无障碍体验评估',anchor:'a-essay',framework:'招募 → 任务 → 检查标准 → 证据 → 问题分级 → 修复复测。',points:['覆盖目标用户与实际辅助技术，结合完成率、耗时和观察访谈定位问题。'],checklist:['是否验证用户能独立完成核验，并对阻断问题优先复测？']}
  };
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function open(key){const lesson=lessons[key]||lessons.theory;let dialog=document.querySelector('#study-tips-dialog');
    if(!dialog){dialog=document.createElement('dialog');dialog.id='study-tips-dialog';dialog.className='study-tips-dialog';dialog.setAttribute('aria-labelledby','study-tips-title');document.body.append(dialog);}
    dialog.innerHTML=`<header class="study-tips-header"><h2 id="study-tips-title">${esc(lesson.title)}</h2><button aria-label="关闭答题技巧">×</button></header><div class="study-tips-body"><h3>答题框架</h3><p class="study-tips-framework">${esc(lesson.framework)}</p><h3>如何展开</h3><ul>${lesson.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul><h3>交卷前自检</h3><ul class="study-tips-checks">${lesson.checklist.map(p=>`<li>${esc(p)}</li>`).join('')}</ul><p class="study-tips-note">根据老师课件整理，具体作答请结合原题要求。</p><a href="${source}#${lesson.anchor}" target="_blank" rel="noopener noreferrer">查看老师解析课件 ↗</a></div>`;
    dialog.querySelector('button').onclick=()=>dialog.close();dialog.showModal();
  }
  window.StudyTips={open,forCourse:key=>lessons[key]||lessons.theory};
})();
