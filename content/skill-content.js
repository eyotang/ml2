const SKILL_COURSES = {
  "b12": {
    "id": "b12",
    "title": "B1-2 · 共享会议室预约与空间利用",
    "steps": [
      {
        "id": "b12-1",
        "title": "按预约编号去重",
        "goal": "同一预约可能被重复导出，先保留每笔预约的一条记录。",
        "code": "# M1（1分）：数据准备\n# 按booking_id去重，再排除已取消预约\nclean = bookings.{{}}(subset={{}})",
        "slots": [
          {
            "answer": "drop_duplicates",
            "choices": [
              "drop_duplicates",
              "dropna",
              "sort_values"
            ],
            "why": "drop_duplicates 删除重复记录；dropna 删除缺失值，不负责去重。"
          },
          {
            "answer": "'booking_id'",
            "choices": [
              "'booking_id'",
              "'room_id'",
              "'department'"
            ],
            "why": "booking_id 标识一笔预约；按 room_id 去重会误删不同日期或时段的预约。"
          }
        ],
        "hint": "一笔预约的唯一标识是 booking_id。",
        "context": "bookings = pd.read_csv('meeting_bookings.csv', encoding='utf-8-sig')\nrooms = pd.read_csv('meeting_rooms.csv', encoding='utf-8-sig')",
        "solution": "# M1（1分）：数据准备\n# 按booking_id去重，再排除已取消预约\nclean = bookings.drop_duplicates(subset='booking_id')",
        "examComments": "# M1（1分）：数据准备\n# 按booking_id去重，再排除已取消预约",
        "teacherExpression": "bookings.drop_duplicates(subset='booking_id')",
        "websiteReferences": [
          "bookings.drop_duplicates(subset='booking_id')",
          "bookings.drop_duplicates(subset=\"booking_id\")",
          "bookings.drop_duplicates('booking_id')"
        ],
        "websiteHint": "drop_duplicates 指定 subset 为预约编号列"
      },
      {
        "id": "b12-2",
        "title": "排除已取消预约",
        "goal": "有效预约包含已使用和爽约，不包含已取消。",
        "code": "# M1（1分）：数据准备\n# 按booking_id去重，再排除已取消预约\nvalid = clean[clean['status'] {{}} {{}}]",
        "slots": [
          {
            "answer": "!=",
            "choices": [
              "!=",
              "==",
              ">="
            ],
            "why": "需要排除取消状态，所以使用不等于。"
          },
          {
            "answer": "'已取消'",
            "choices": [
              "'已取消'",
              "'已使用'",
              "'爽约'"
            ],
            "why": "取消预约不应进入有效预约数和爽约率的分母。"
          }
        ],
        "hint": "不要把爽约也过滤掉。",
        "context": "",
        "solution": "# M1（1分）：数据准备\n# 按booking_id去重，再排除已取消预约\nvalid = clean[clean['status'] != '已取消']",
        "examComments": "# M1（1分）：数据准备\n# 按booking_id去重，再排除已取消预约",
        "teacherExpression": "clean[clean['status'] != '已取消']",
        "websiteReferences": [
          "clean[clean['status'] != '已取消']",
          "clean[clean['status'].isin(['已使用','爽约'])]",
          "clean[clean[\"status\"] != \"已取消\"]"
        ],
        "websiteHint": "按 status 列过滤掉「已取消」（或只保留已使用/爽约）"
      },
      {
        "id": "b12-3",
        "title": "生成爽约标记",
        "goal": "为每条有效预约创建布尔标记，便于后面求和与求平均。",
        "code": "# M2（2分）：识别爽约高发时段\n# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列\nvalid['is_no_show'] = (valid[{{}}] == {{}}).astype(int)",
        "slots": [
          {
            "answer": "'status'",
            "choices": [
              "'status'",
              "'attendees'",
              "'time_slot'"
            ],
            "why": "status 保存最终预约状态。"
          },
          {
            "answer": "'爽约'",
            "choices": [
              "'爽约'",
              "'已取消'",
              "'已使用'"
            ],
            "why": "布尔值 True 表示爽约，按组求平均即可得到爽约率。"
          }
        ],
        "hint": "True 可按 1、False 可按 0 参与聚合。",
        "context": "",
        "solution": "# M2（2分）：识别爽约高发时段\n# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列\nvalid['is_no_show'] = (valid['status'] == '爽约').astype(int)",
        "examComments": "# M2（2分）：识别爽约高发时段\n# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列",
        "teacherExpression": "(valid['status'] == '爽约').astype(int)",
        "websiteReferences": [
          "(valid['status'] == '爽约').astype(int)",
          "(valid['status'] == '爽约') * 1",
          "valid['status'].apply(lambda x: 1 if x == '爽约' else 0)"
        ],
        "websiteHint": "status 等于「爽约」时取 1，否则 0，转整型便于求和求均值"
      },
      {
        "id": "b12-4",
        "title": "按时段汇总爽约情况",
        "goal": "统计有效预约数、爽约数、爽约率，并将爽约率最高的时段排在前面。",
        "code": "# M2（2分）：识别爽约高发时段\n# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列\nslot_summary = valid.groupby({{}}).agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show',{{}}), 爽约率=('is_no_show',{{}})).sort_values('爽约率', ascending={{}})",
        "slots": [
          {
            "answer": "'time_slot'",
            "choices": [
              "'time_slot'",
              "'room_id'",
              "'department'"
            ],
            "why": "目标是比较时段，需要按 time_slot 分组。"
          },
          {
            "answer": "'sum'",
            "choices": [
              "'sum'",
              "'count'",
              "'max'"
            ],
            "why": "布尔列求和得到爽约条数；count 会计算全部非空记录。"
          },
          {
            "answer": "'mean'",
            "choices": [
              "'mean'",
              "'sum'",
              "'min'"
            ],
            "why": "布尔均值等于爽约数除以有效预约数。"
          },
          {
            "answer": "False",
            "choices": [
              "False",
              "True",
              "None"
            ],
            "why": "ascending=False 表示降序，优先显示高爽约率时段。"
          }
        ],
        "hint": "次数用 sum，比例用 mean；排序要降序。",
        "context": "",
        "solution": "# M2（2分）：识别爽约高发时段\n# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列\nslot_summary = valid.groupby('time_slot').agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show','sum'), 爽约率=('is_no_show','mean')).sort_values('爽约率', ascending=False)",
        "examComments": "# M2（2分）：识别爽约高发时段\n# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列",
        "teacherExpression": "valid.groupby('time_slot').agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show','sum'), 爽约率=('is_no_show','mean')).sort_values('爽约率', ascending=False)",
        "websiteReferences": [
          "valid.groupby('time_slot').agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show','sum'), 爽约率=('is_no_show','mean')).sort_values('爽约率', ascending=False)"
        ],
        "websiteHint": "groupby('time_slot') + agg 命名聚合（count / sum / mean）+ sort_values 降序"
      },
      {
        "id": "b12-5",
        "title": "关联已使用预约与会议室容量",
        "goal": "只分析实际使用过的预约，再通过会议室编号关联容量。",
        "code": "# M3（2分）：分析会议室容量匹配\n# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率\nused = valid[valid['status'] == {{}}].merge(rooms, on={{}})",
        "slots": [
          {
            "answer": "'已使用'",
            "choices": [
              "'已使用'",
              "'爽约'",
              "'已取消'"
            ],
            "why": "容量利用分析只统计已使用预约，不能把爽约人数 0 当作真实使用场次。"
          },
          {
            "answer": "'room_id'",
            "choices": [
              "'room_id'",
              "'booking_id'",
              "'room_name'"
            ],
            "why": "两张表通过 room_id 关联。"
          }
        ],
        "hint": "会议室资料表中 room_id 唯一且完整匹配。",
        "context": "",
        "solution": "# M3（2分）：分析会议室容量匹配\n# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率\nused = valid[valid['status'] == '已使用'].merge(rooms, on='room_id')",
        "examComments": "# M3（2分）：分析会议室容量匹配\n# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率",
        "teacherExpression": "valid[valid['status'] == '已使用'].merge(rooms, on='room_id')",
        "websiteReferences": [
          "valid[valid['status'] == '已使用'].merge(rooms, on='room_id')",
          "valid[valid['status']=='已使用'].merge(rooms, on='room_id', how='left')"
        ],
        "websiteHint": "先筛 status == '已使用'，再 merge rooms（on='room_id'）"
      },
      {
        "id": "b12-6",
        "title": "汇总会议室座位利用率",
        "goal": "利用率为实际参会人数除以容量；按会议室汇总使用场次和平均利用率。",
        "code": "# M3（2分）：分析会议室容量匹配\n# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率\nused['seat_util'] = used[\"attendees\"] / used[\"capacity\"]\nroom_summary = used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id',{{}}), 平均座位利用率=('seat_util',{{}})).reset_index()",
        "slots": [
          {
            "answer": "'count'",
            "choices": [
              "'count'",
              "'sum'",
              "'mean'"
            ],
            "why": "使用场次是记录数量，不能对预约编号求均值。"
          },
          {
            "answer": "'mean'",
            "choices": [
              "'mean'",
              "'sum'",
              "'max'"
            ],
            "why": "题目要求平均座位利用率，因此对每场利用率求均值。"
          }
        ],
        "hint": "每行是一次已使用预约，先计算单场利用率再聚合。",
        "context": "",
        "solution": "# M3（2分）：分析会议室容量匹配\n# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率\nused['seat_util'] = used[\"attendees\"] / used[\"capacity\"]\nroom_summary = used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()",
        "examComments": "# M3（2分）：分析会议室容量匹配\n# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率",
        "teacherExpression": "used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()",
        "websiteReferences": [
          "used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()"
        ],
        "websiteHint": "groupby 会议室维度 + agg（count 场次、mean 利用率）+ reset_index"
      },
      {
        "id": "b12-7",
        "title": "筛选空间优化候选",
        "goal": "找出容量不少于 12、使用不少于 20 场、平均座位利用率低于 40% 的会议室。",
        "code": "# M4（1分）：输出空间匹配优化候选清单\n# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室\ncandidates = room_summary[(room_summary['capacity'] {{}} 12) {{}} (room_summary['使用场次'] {{}} 20) {{}} (room_summary['平均座位利用率'] {{}} 0.4)]",
        "slots": [
          {
            "answer": ">=",
            "choices": [
              ">=",
              ">",
              "<="
            ],
            "why": "不少于 12 包含恰好 12。"
          },
          {
            "answer": "&",
            "choices": [
              "&",
              "|",
              "and"
            ],
            "why": "多个 Series 条件使用 & 表示同时满足；每个条件需加括号。"
          },
          {
            "answer": ">=",
            "choices": [
              ">=",
              ">",
              "<"
            ],
            "why": "不少于 20 包含恰好 20。"
          },
          {
            "answer": "&",
            "choices": [
              "&",
              "|",
              "or"
            ],
            "why": "三个条件必须同时满足，不能用或连接。"
          },
          {
            "answer": "<",
            "choices": [
              "<",
              "<=",
              ">"
            ],
            "why": "低于 40% 不包含恰好 40%。"
          }
        ],
        "hint": "注意“不少于”和“低于”的边界，以及 pandas 的 &。",
        "context": "",
        "solution": "# M4（1分）：输出空间匹配优化候选清单\n# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室\ncandidates = room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]",
        "examComments": "# M4（1分）：输出空间匹配优化候选清单\n# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室",
        "teacherExpression": "room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]",
        "websiteReferences": [
          "room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]"
        ],
        "websiteHint": "三个条件用 & 连接，注意每个条件各自加括号"
      },
      {
        "id": "b12-8",
        "kind": "case",
        "taskIndex": 0,
        "title": "任务二：挖掘预约效率价值",
        "goal": "从比例与数量两方面解释发现，再提出可执行措施。",
        "code": "午间爽约率 35.71%，傍晚 33.33%；午间比例最高，傍晚数量最多。\n隐藏价值：{{}}。\n措施：优先开展 {{}}。\n释放会议室之前：{{}}。",
        "solution": "午间爽约率 35.71%，傍晚 33.33%；午间比例最高，傍晚数量最多。\n隐藏价值：减少空占并提高会议室可获得性。\n措施：优先开展 会前提醒、二次确认与便捷取消。\n释放会议室之前：核实取消或按已告知规则核实爽约。",
        "slots": [
          {
            "answer": "减少空占并提高会议室可获得性",
            "choices": [
              "减少空占并提高会议室可获得性",
              "只增加预约总次数",
              "全部爽约时长都算已实现收益"
            ],
            "why": "把未被实际使用的预约窗口转化为可用资源机会，减少找房成本，效果仍需试点验证。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "空占",
                  "空置",
                  "闲置",
                  "爽约"
                ],
                [
                  "可获得",
                  "可用",
                  "释放",
                  "利用",
                  "找房"
                ]
              ]
            }
          },
          {
            "answer": "会前提醒、二次确认与便捷取消",
            "choices": [
              "会前提醒、二次确认与便捷取消",
              "直接删除所有晚间预约",
              "仅优化页面颜色"
            ],
            "why": "午间和傍晚是优先干预时段；提醒后让预约人确认或及时取消。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "提醒"
                ],
                [
                  "确认",
                  "取消"
                ]
              ]
            }
          },
          {
            "answer": "核实取消或按已告知规则核实爽约",
            "choices": [
              "核实取消或按已告知规则核实爽约",
              "按风险分数直接取消",
              "一律立即放给他人"
            ],
            "why": "不能把预测风险当作实际爽约，避免误释放仍然有效的预约。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "核实",
                  "确认",
                  "签到"
                ],
                [
                  "取消",
                  "爽约",
                  "规则"
                ]
              ]
            }
          }
        ],
        "hint": "发现→业务价值→干预措施→释放边界，不能只复述两个百分比。",
        "context": ""
      },
      {
        "id": "b12-9",
        "kind": "case",
        "taskIndex": 0,
        "title": "任务二：挖掘空间匹配价值",
        "goal": "候选会议室是冬青室与星河室；改善容量配置时仍要满足业务需要。",
        "code": "冬青室：12座、28场、平均25%；星河室：16座、28场、平均37.5%。\n隐藏价值：{{}}。\n推荐替代会议室必须满足 {{}}。\n预约人确认后调整，跟踪 {{}}。",
        "solution": "冬青室：12座、28场、平均25%；星河室：16座、28场、平均37.5%。\n隐藏价值：减少小会占大房的容量浪费。\n推荐替代会议室必须满足 容量与设备需求。\n预约人确认后调整，跟踪 座位利用率、改约率与用户满意度。",
        "slots": [
          {
            "answer": "减少小会占大房的容量浪费",
            "choices": [
              "减少小会占大房的容量浪费",
              "把爽约人数0混入座位利用率",
              "所有大房间全部停用"
            ],
            "why": "本任务的平均座位利用率是已使用场次中人数/容量的均值，不是时间占用率。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "小会",
                  "少数人",
                  "小团队",
                  "人数少",
                  "容量"
                ],
                [
                  "大房",
                  "大会议室",
                  "浪费",
                  "匹配"
                ]
              ]
            }
          },
          {
            "answer": "容量与设备需求",
            "choices": [
              "容量与设备需求",
              "只比较会议室面积",
              "忽略视频会议设施"
            ],
            "why": "需新增收集预计参会人数和设备需求；历史实际人数不能直接代表未来会议需求。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "容量",
                  "人数",
                  "座位"
                ],
                [
                  "设备",
                  "设施"
                ]
              ]
            }
          },
          {
            "answer": "座位利用率、改约率与用户满意度",
            "choices": [
              "座位利用率、改约率与用户满意度",
              "仅统计登录次数",
              "只看推荐点击次数"
            ],
            "why": "同时衡量资源利用和使用体验，防止为提高指标而制造强制改约。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "利用率",
                  "匹配率"
                ],
                [
                  "满意",
                  "改约",
                  "体验"
                ]
              ]
            }
          }
        ],
        "hint": "数据发现→容量浪费价值→满足约束的推荐→体验与利用效果。",
        "context": ""
      },
      {
        "id": "b12-10",
        "kind": "case",
        "taskIndex": 1,
        "title": "任务三：选择数据与模型",
        "goal": "以爽约风险辅助提醒为例，保留会前信息边界与可解释基线。",
        "code": "特征：时段、部门、会议室、星期和提前预约时长。\n最终status及实际attendees：{{}}。\n先建立时段规则基线，再尝试 {{}}。\n训练验证按 {{}} 划分。",
        "solution": "特征：时段、部门、会议室、星期和提前预约时长。\n最终status及实际attendees：不作为会前预测特征。\n先建立时段规则基线，再尝试 逻辑回归或浅层决策树。\n训练验证按 时间先后 划分。",
        "slots": [
          {
            "answer": "不作为会前预测特征",
            "choices": [
              "不作为会前预测特征",
              "直接作为会前特征",
              "使用实际爽约标签预测同一条预约"
            ],
            "why": "最终状态用于历史标签，实际人数会后才知道，直接当会前输入会造成数据泄漏。",
            "accepted": [
              "避免数据泄漏",
              "仅使用会前可获得信息"
            ],
            "matchRule": {
              "groups": []
            }
          },
          {
            "answer": "逻辑回归或浅层决策树",
            "choices": [
              "逻辑回归或浅层决策树",
              "不验证直接用深层模型",
              "按随机编号决定是否爽约"
            ],
            "why": "给出适合小数据和可解释需求的候选；样本仅10个工作日，先规则试点并积累数据。",
            "accepted": [
              "逻辑回归",
              "决策树",
              "可解释分类模型"
            ],
            "matchRule": {
              "groups": [
                [
                  "逻辑回归",
                  "决策树"
                ]
              ]
            }
          },
          {
            "answer": "时间先后",
            "choices": [
              "时间先后",
              "未来训练过去验证",
              "用同一数据拟合再报告训练分数"
            ],
            "why": "模拟真实未来预测，预处理在训练数据上拟合，避免未来信息泄漏。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "时间",
                  "滚动",
                  "过去训练未来验证"
                ]
              ]
            }
          }
        ],
        "hint": "数据使用方式、模型及其适用条件都要写，不能只写“用AI预测”。",
        "context": ""
      },
      {
        "id": "b12-11",
        "kind": "case",
        "taskIndex": 1,
        "title": "任务三：设计应用与预期效果",
        "goal": "风险评分用于辅助提醒，资源释放仍受确认和企业规则约束。",
        "code": "业务链：预约→会前特征→风险预测→ {{}}\n→核实状态后释放／保留→候补通知→记录结果。\n目标：{{}}。\n必须同步监测 {{}}。",
        "solution": "业务链：预约→会前特征→风险预测→ 提醒与二次确认\n→核实状态后释放／保留→候补通知→记录结果。\n目标：减少爽约和空占、提高再利用。\n必须同步监测 错误释放、投诉与提醒负担。",
        "slots": [
          {
            "answer": "提醒与二次确认",
            "choices": [
              "提醒与二次确认",
              "按分数直接取消预约",
              "直接强制更换会议室"
            ],
            "why": "风险高不等于真实爽约，先提醒并请求确认。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "提醒"
                ],
                [
                  "确认"
                ]
              ]
            }
          },
          {
            "answer": "减少爽约和空占、提高再利用",
            "choices": [
              "减少爽约和空占、提高再利用",
              "承诺立刻节约固定金额",
              "只提高模型训练准确率"
            ],
            "why": "明确业务效果但不编造收益，效果需通过试点评估。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "爽约",
                  "空占"
                ],
                [
                  "再利用",
                  "复用",
                  "利用率",
                  "减少",
                  "降低"
                ]
              ]
            }
          },
          {
            "answer": "错误释放、投诉与提醒负担",
            "choices": [
              "错误释放、投诉与提醒负担",
              "只监测点击量",
              "忽略用户投诉"
            ],
            "why": "效果评价要有保护指标，避免提醒过量和误伤正常预约。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "误释放",
                  "错误释放",
                  "误取消",
                  "投诉"
                ],
                [
                  "提醒",
                  "负担",
                  "打扰",
                  "投诉"
                ]
              ]
            }
          }
        ],
        "hint": "数据→模型→业务动作→可验证目标→保护指标，形成可实施方案。",
        "context": ""
      },
      {
        "id": "b12-12",
        "kind": "case",
        "taskIndex": 1,
        "title": "任务三：验证模型与业务效果",
        "goal": "同时验证离线预测质量与线上真实收益，指标必须有口径。",
        "code": "离线：按时间留出验证，报告 {{}} 并与规则基线比较。\n线上：开展 {{}}，覆盖可比会议室、日期和时段。\n爽约率分母：{{}}。\n再利用率分母：{{}}。",
        "solution": "离线：按时间留出验证，报告 精确率、召回率和F1 并与规则基线比较。\n线上：开展 随机对照试点，覆盖可比会议室、日期和时段。\n爽约率分母：同周期有效预约笔数。\n再利用率分母：同周期已释放时段数。",
        "slots": [
          {
            "answer": "精确率、召回率和F1",
            "choices": [
              "精确率、召回率和F1",
              "只报训练准确率",
              "不报告样本量"
            ],
            "why": "指标聚焦爽约类别，并报告样本量、混淆矩阵和误报/漏报，不能以预测指标代替业务收益。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "精确率",
                  "precision"
                ],
                [
                  "召回率",
                  "recall"
                ],
                [
                  "f1"
                ]
              ]
            }
          },
          {
            "answer": "随机对照试点",
            "choices": [
              "随机对照试点",
              "干预前后任意各挑一天",
              "只挑效果最好的时段"
            ],
            "why": "比较原流程与提醒流程，尽量控制跨组干扰，并约定观察周期及回退条件。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "对照",
                  "ab测试",
                  "a/b",
                  "随机分组"
                ]
              ]
            }
          },
          {
            "answer": "同周期有效预约笔数",
            "choices": [
              "同周期有效预约笔数",
              "全部导出行数含重复和取消",
              "所有已使用人数"
            ],
            "why": "按booking_id去重，排除已取消，与分子爽约笔数使用相同周期。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "有效预约"
                ]
              ]
            }
          },
          {
            "answer": "同周期已释放时段数",
            "choices": [
              "同周期已释放时段数",
              "全部预约笔数",
              "成功再预约时段数"
            ],
            "why": "分子是释放后又被预约且实际使用的时段数；分母是同周期全部已释放时段数。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "已释放",
                  "释放的",
                  "释放时段"
                ]
              ]
            }
          }
        ],
        "hint": "离线评估+线上对照试点；写清指标分子、分母、周期和保护项。",
        "context": ""
      }
    ],
    "count": 12,
    "originalCode": "import pandas as pd\n\n\n# 读取数据\nbookings = pd.read_csv('meeting_bookings.csv', encoding='utf-8-sig')\nrooms = pd.read_csv('meeting_rooms.csv', encoding='utf-8-sig')\n\n# M1（1分）：数据准备\n# 按booking_id去重，再排除已取消预约\nclean = ______________________________\nvalid = ______________________________\n\nprint('数据准备结果')\nprint('去重后预约数：', len(clean))\nprint('有效预约数：', len(valid))\n\n# M2（2分）：识别爽约高发时段\n# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列\nvalid['is_no_show'] = ______________________________\nslot_summary = ______________________________\n\n\nprint('\\n各时段爽约情况')\nprint(slot_summary)\n\n\n# M3（2分）：分析会议室容量匹配\n# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率\nused = ______________________________\nused['seat_util'] = used[\"attendees\"] / used[\"capacity\"]\nroom_summary = ______________________________\n\n\nprint('\\n各会议室空间利用情况')\nprint(room_summary)\n\n\n# M4（1分）：输出空间匹配优化候选清单\n# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室\ncandidates = ______________________________\n\n\nprint('\\n空间匹配优化候选清单')\nprint(candidates)\n",
    "referenceCode": "import pandas as pd\n\n# 读取数据\nbookings = pd.read_csv('meeting_bookings.csv', encoding='utf-8-sig')\nrooms = pd.read_csv('meeting_rooms.csv', encoding='utf-8-sig')\n\n# M1（1分）：数据准备\n# 按booking_id去重，再排除已取消预约\nclean = bookings.drop_duplicates(subset='booking_id')\nvalid = clean[clean['status'] != '已取消']\n\nprint('数据准备结果')\nprint('去重后预约数：', len(clean))\nprint('有效预约数：', len(valid))\n\n# M2（2分）：识别爽约高发时段\n# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列\nvalid['is_no_show'] = (valid['status'] == '爽约').astype(int)\nslot_summary = valid.groupby('time_slot').agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show','sum'), 爽约率=('is_no_show','mean')).sort_values('爽约率', ascending=False)\n\nprint('\\n各时段爽约情况')\nprint(slot_summary)\n\n# M3（2分）：分析会议室容量匹配\n# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率\nused = valid[valid['status'] == '已使用'].merge(rooms, on='room_id')\nused['seat_util'] = used[\"attendees\"] / used[\"capacity\"]\nroom_summary = used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()\n\nprint('\\n各会议室空间利用情况')\nprint(room_summary)\n\n# M4（1分）：输出空间匹配优化候选清单\n# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室\ncandidates = room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]\n\nprint('\\n空间匹配优化候选清单')\nprint(candidates)",
    "websiteURL": "https://ai-trainer-exam-87484.app.workbuddy.host/?sharecode=P6SA3BBFCH",
    "websiteNote": "主答案采用老师提供的参考代码，分步练习仅在老师的原表达式上挖空；老师列出的等价写法保留供对照。",
    "websiteCode": "import pandas as pd\n\n# 读取数据\nbookings = pd.read_csv('meeting_bookings.csv', encoding='utf-8-sig')\nrooms = pd.read_csv('meeting_rooms.csv', encoding='utf-8-sig')\n\n# M1（1分）：数据准备\n# 按booking_id去重，再排除已取消预约\nclean = bookings.drop_duplicates(subset='booking_id')\nvalid = clean[clean['status'] != '已取消']\n\nprint('数据准备结果')\nprint('去重后预约数：', len(clean))\nprint('有效预约数：', len(valid))\n\n# M2（2分）：识别爽约高发时段\n# 统计各时段的有效预约数、爽约数和爽约率，并按爽约率降序排列\nvalid['is_no_show'] = (valid['status'] == '爽约').astype(int)\nslot_summary = valid.groupby('time_slot').agg(有效预约数=('is_no_show','count'), 爽约数=('is_no_show','sum'), 爽约率=('is_no_show','mean')).sort_values('爽约率', ascending=False)\n\nprint('\\n各时段爽约情况')\nprint(slot_summary)\n\n# M3（2分）：分析会议室容量匹配\n# 只分析已使用预约，关联会议室容量，统计使用场次和平均座位利用率\nused = valid[valid['status'] == '已使用'].merge(rooms, on='room_id')\nused['seat_util'] = used[\"attendees\"] / used[\"capacity\"]\nroom_summary = used.groupby(['room_id','room_name','capacity']).agg(使用场次=('booking_id','count'), 平均座位利用率=('seat_util','mean')).reset_index()\n\nprint('\\n各会议室空间利用情况')\nprint(room_summary)\n\n# M4（1分）：输出空间匹配优化候选清单\n# 筛选容量不少于12、实际使用不少于20场、平均座位利用率低于40%的会议室\ncandidates = room_summary[(room_summary['capacity'] >= 12) & (room_summary['使用场次'] >= 20) & (room_summary['平均座位利用率'] < 0.4)]\n\nprint('\\n空间匹配优化候选清单')\nprint(candidates)",
    "answerSchema": 2,
    "tasks": [
      {
        "id": "b12t2",
        "title": "任务二 · 挖掘隐藏价值",
        "promptHTML": "<p>针对任务一中的两个业务场景，结合分析结果说明其中隐藏的业务和运营价值，并提出相应的改进措施。</p>",
        "answerHTML": "<h4>场景一：预约效率优化</h4><p>按 booking_id 去重后 240 笔，排除已取消后有效预约 216 笔。午间 15/42=35.71%，傍晚 18/54=33.33%，高于上午 6/60=10% 和下午 3/60=5%。午间比例最高，傍晚爽约数量最多，应同时关注比例与数量，不能混为一谈。</p><p><strong>隐藏价值：</strong>识别被占用但未实际使用的时间窗口，减少找房和现场协调成本，提高会议室可获得性。42 次爽约对应 84 个预约小时，仅是历史未使用时长，不能直接承诺全部释放或转化为收益。</p><p><strong>措施：</strong>优先在午间、傍晚做会前提醒和二次确认，提供便捷取消及候补通知。未确认时先提醒、人工核实，确认取消或依已告知的签到规则核实爽约后再释放；不得仅凭模型预测自动取消预约。保留审批或确认及操作记录。</p><h4>场景二：空间匹配优化</h4><p>仅在已使用记录中，以每场 attendees/capacity 的平均值衡量座位利用率。冬青室 12 座、28 场、平均 25%；星河室 16 座、28 场、平均 37.5%，均满足容量≥12、使用≥20场、平均利用率&lt;40%的候选条件。远山室虽有20座，但平均80%，不属于该候选清单。该利用率不是会议室被占用时间的比例。</p><p><strong>隐藏价值：</strong>减少少数人占用大房间的容量浪费，把适配大房间的机会留给确有需求的团队，降低沟通和改约成本。</p><p><strong>措施：</strong>在预约时新增采集预计参会人数及设备需求，在容量和设备满足的前提下推荐更合适的小会议室，由预约人确认后调整，不能仅因历史人数少就强制换房。继续监测座位利用率、匹配率、改约率与用户满意度。</p>"
      },
      {
        "id": "b12t3",
        "title": "任务三 · 提出解决方案",
        "promptHTML": "<p>针对任务一中的其中一个业务场景，结合人工智能技术提出解决方案。方案应包括数据使用方式、所选算法模型、业务应用方式和预期效果、验证方法。</p>",
        "answerHTML": "<h4>选择场景：预约效率优化——爽约风险辅助提醒</h4><p><strong>数据使用：</strong>历史数据按 booking_id 去重，按题设定义有效预约和爽约标签。用预约前已知的 time_slot、department、room_id、会议室容量、星期及 start_time−booked_at 的提前预约时长构造特征。status 的最终值只用于生成历史标签，不能作为预测特征；实际 attendees 在会后才可确认，也不作为会前预测特征。只使用必要字段，权限分级，设置留存周期。新增提醒、确认、取消、签到、释放及再预约事件日志，为后续验证服务。</p><p><strong>算法模型：</strong>先以“午间/傍晚优先提醒”的规则为基线；数据积累后试用逻辑回归或浅层决策树预测爽约风险，使用分类特征编码并处理类不均衡。历史样本仅覆盖10个工作日，初期可先用规则试点，不能据此承诺模型稳定泛化。训练和验证按时间先后划分，预处理仅在训练数据拟合，必要时开展滚动时间验证。</p><p><strong>业务应用：</strong>预约产生→提取会前特征→计算风险等级→高风险会前提醒和二次确认→预约人保留或取消→按核实的状态及已告知签到规则处理资源释放→通知候补→记录结果。风险分数仅辅助提醒，不替代用户确认和企业规则，不按模型分数直接取消预约。</p><p><strong>预期效果：</strong>目标是减少爽约和空占、提高被释放时段的再预约使用率、减少找房耗时，同时控制额外提醒负担和错误释放。此处为待验证目标，不虚构改善百分比或成本节省金额。</p><p><strong>验证方法：</strong>先做历史时间留出验证，报告爽约类精确率、召回率、F1及样本量、混淆矩阵，并与规则基线比较。再将可比会议室/日期的预约随机分配到原流程与提醒流程，尽量控制跨组干扰并覆盖相同时段；观察至少预先约定的完整周期，不只挑最好的一天。</p><p>线上业务指标：爽约率=爽约笔数/同周期有效预约笔数；释放后再利用率=被释放且又被预约并实际使用的时段数/同周期已释放时段数。同步报告各分母、提醒量、投诉及错误释放事件；比较组间改善和不确定性，结合用户反馈复核，未达到预设目标则调整规则或回退。</p>"
      }
    ],
    "writtenDownloadPath": "materials/b12-written-reference.html"
  },
  "b2": {
    "id": "b2",
    "title": "B2 · 冷链运输温控异常预警",
    "steps": [
      {
        "id": "b2-1",
        "title": "转换发车时间",
        "goal": "将字符串转换为 pandas 日期时间，便于提取小时。",
        "code": "# 转换发车时间并提取发车小时\ndf['depart_time'] = pd.{{}}(df['depart_time'])",
        "slots": [
          {
            "answer": "to_datetime",
            "choices": [
              "to_datetime",
              "to_numeric",
              "get_dummies"
            ],
            "why": "to_datetime 用于日期时间转换；to_numeric 用于数值转换。"
          }
        ],
        "hint": "使用 pandas 的日期时间转换函数。",
        "context": "df = pd.read_csv('cold_chain_shipments.csv')",
        "solution": "# 转换发车时间并提取发车小时\ndf['depart_time'] = pd.to_datetime(df['depart_time'])",
        "examComments": "# 转换发车时间并提取发车小时",
        "teacherExpression": "pd.to_datetime(df['depart_time'])",
        "websiteReferences": [
          "pd.to_datetime(df['depart_time'])",
          "pd.to_datetime(df[\"depart_time\"])"
        ],
        "websiteHint": "pd.to_datetime(...)"
      },
      {
        "id": "b2-2",
        "title": "提取发车小时",
        "goal": "从转换后的时间列生成 0～23 的小时特征。",
        "code": "# 转换发车时间并提取发车小时\ndf['depart_hour'] = df['depart_time'].{{}}.{{}}",
        "slots": [
          {
            "answer": "dt",
            "choices": [
              "dt",
              "str",
              "loc"
            ],
            "why": "日期时间 Series 的向量化访问器是 dt。"
          },
          {
            "answer": "hour",
            "choices": [
              "hour",
              "day",
              "month"
            ],
            "why": "hour 提取小时，day 与 month 提取日和月。"
          }
        ],
        "hint": "先使用 dt 访问器，再获取小时。",
        "context": "",
        "solution": "# 转换发车时间并提取发车小时\ndf['depart_hour'] = df['depart_time'].dt.hour",
        "examComments": "# 转换发车时间并提取发车小时",
        "teacherExpression": "df['depart_time'].dt.hour",
        "websiteReferences": [
          "df['depart_time'].dt.hour",
          "df[\"depart_time\"].dt.hour"
        ],
        "websiteHint": "Series.dt.hour"
      },
      {
        "id": "b2-3",
        "title": "按运输单号去重",
        "goal": "同一运输单号代表同一次运输，只保留一条记录。",
        "code": "# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录\ndf = df.{{}}(subset={{}})",
        "slots": [
          {
            "answer": "drop_duplicates",
            "choices": [
              "drop_duplicates",
              "dropna",
              "reset_index"
            ],
            "why": "drop_duplicates 按指定字段去重。"
          },
          {
            "answer": "'shipment_id'",
            "choices": [
              "'shipment_id'",
              "'cargo_type'",
              "'route_region'"
            ],
            "why": "shipment_id 标识运输任务；按货物类型或区域去重会丢失大量合法样本。"
          }
        ],
        "hint": "唯一标识是 shipment_id。",
        "context": "",
        "solution": "# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录\ndf = df.drop_duplicates(subset='shipment_id')",
        "examComments": "# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录",
        "teacherExpression": "df.drop_duplicates(subset='shipment_id')",
        "websiteReferences": [
          "df.drop_duplicates(subset='shipment_id')",
          "df.drop_duplicates(subset=\"shipment_id\")"
        ],
        "websiteHint": "drop_duplicates(subset=...)"
      },
      {
        "id": "b2-4",
        "title": "过滤非法记录",
        "goal": "按老师参考代码，保留 0<planned_hours≤72 且 sensor_missing_rate 在 [0,1] 的记录；72 小时是运输时长上界，不是答题时限。",
        "code": "# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录\ndf = df[(df['planned_hours']{{}}0)&(df['planned_hours']<=72)&(df['sensor_missing_rate'].{{}}(0,1))]",
        "slots": [
          {
            "answer": ">",
            "choices": [
              ">",
              ">=",
              "<"
            ],
            "why": "运输时长必须为正，0 也需要排除。"
          },
          {
            "answer": "between",
            "choices": [
              "between",
              "isin",
              "eq"
            ],
            "why": "between(0, 1) 默认包含边界 0 和 1；isin([0,1]) 只能保留两个端点。"
          }
        ],
        "hint": "保留老师参考的运输时长上界 72；between(0,1) 包含两个边界。",
        "context": "",
        "solution": "# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录\ndf = df[(df['planned_hours']>0)&(df['planned_hours']<=72)&(df['sensor_missing_rate'].between(0,1))]",
        "examComments": "# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录",
        "teacherExpression": "df[(df['planned_hours']>0)&(df['planned_hours']<=72)&(df['sensor_missing_rate'].between(0,1))]",
        "websiteReferences": [
          "df[(df['planned_hours'] > 0) & (df['planned_hours'] <= 72) & (df['sensor_missing_rate'] >= 0) & (df['sensor_missing_rate'] <= 1)]",
          "df[(df['planned_hours']>0)&(df['planned_hours']<=72)&(df['sensor_missing_rate'].between(0,1))]"
        ],
        "websiteHint": "计划时长须为正且合理（如 ≤72），缺失率须在 0~1"
      },
      {
        "id": "b2-5",
        "title": "按货物类型填补缺失温度",
        "goal": "用同货物类型的平均温度中位数，填补 avg_temp 的缺失值。",
        "code": "# 按货物类型的中位数填补 avg_temp 缺失值\ndf['avg_temp'] = df.groupby('cargo_type')['avg_temp'].{{}}(lambda s: s.{{}}(s.{{}}()))",
        "slots": [
          {
            "answer": "transform",
            "choices": [
              "transform",
              "agg",
              "count"
            ],
            "why": "transform 返回与原行对齐的分组结果，适合逐行填补。"
          },
          {
            "answer": "fillna",
            "choices": [
              "fillna",
              "dropna",
              "replace"
            ],
            "why": "fillna 只填补缺失项，不覆盖已有温度。"
          },
          {
            "answer": "median",
            "choices": [
              "median",
              "mean",
              "max"
            ],
            "why": "题目指定组内中位数，不是均值或最大值。"
          }
        ],
        "hint": "先 groupby，再用 transform 保持行对齐，在每个货物类型组内填补中位数。",
        "context": "",
        "solution": "# 按货物类型的中位数填补 avg_temp 缺失值\ndf['avg_temp'] = df.groupby('cargo_type')['avg_temp'].transform(lambda s: s.fillna(s.median()))",
        "examComments": "# 按货物类型的中位数填补 avg_temp 缺失值",
        "teacherExpression": "df.groupby('cargo_type')['avg_temp'].transform(lambda s: s.fillna(s.median()))",
        "websiteReferences": [
          "df.groupby('cargo_type')['avg_temp'].transform(lambda s: s.fillna(s.median()))",
          "df.groupby(\"cargo_type\")[\"avg_temp\"].transform(lambda s: s.fillna(s.median()))"
        ],
        "websiteHint": "groupby + transform，不能用全列中位数"
      },
      {
        "id": "b2-6",
        "title": "统计货物与区域分布",
        "goal": "按货物类型、线路区域统计样本数、报警率和平均传感器缺失率。",
        "code": "# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率\ncargo_region_summary = df.groupby({{}}).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm',{{}}), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()",
        "slots": [
          {
            "answer": "['cargo_type', 'route_region']",
            "choices": [
              "['cargo_type', 'route_region']",
              "['vehicle_type']",
              "['shipment_id']"
            ],
            "why": "题目要求货物类型与线路区域两个分组维度。"
          },
          {
            "answer": "'mean'",
            "choices": [
              "'mean'",
              "'sum'",
              "'count'"
            ],
            "why": "temp_alarm 是 0/1 标签，均值是报警比例；求和仅得到报警数。"
          }
        ],
        "hint": "0/1 标签的均值可以表示事件发生率。",
        "context": "",
        "solution": "# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率\ncargo_region_summary = df.groupby(['cargo_type','route_region']).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm','mean'), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()",
        "examComments": "# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率",
        "teacherExpression": "df.groupby(['cargo_type','route_region']).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm','mean'), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()",
        "websiteReferences": [
          "df.groupby(['cargo_type','route_region']).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm','mean'), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()"
        ],
        "websiteHint": "两级 groupby + 命名聚合 agg"
      },
      {
        "id": "b2-7",
        "title": "编码特征矩阵",
        "goal": "从指定 feature_cols 取特征，对 category_cols 三个分类字段独热编码。",
        "code": "# 构造特征矩阵与目标变量，并对分类字段进行独热编码\nX = pd.{{}}(df[feature_cols], columns={{}})",
        "slots": [
          {
            "answer": "get_dummies",
            "choices": [
              "get_dummies",
              "concat",
              "to_numeric"
            ],
            "why": "get_dummies 将类别转换成指示变量。"
          },
          {
            "answer": "category_cols",
            "choices": [
              "category_cols",
              "feature_cols",
              "['temp_alarm']"
            ],
            "why": "只对分类字段编码，不能把目标标签作为输入特征。"
          }
        ],
        "hint": "category_cols 已定义为区域、车型、货物类型。",
        "context": "feature_cols = ['route_region', 'vehicle_type', 'cargo_type', 'planned_hours',\n    'outside_temp', 'avg_temp', 'max_temp', 'door_open_count',\n    'sensor_missing_rate', 'driver_experience_years', 'depart_hour']\ncategory_cols = ['route_region', 'vehicle_type', 'cargo_type']",
        "solution": "# 构造特征矩阵与目标变量，并对分类字段进行独热编码\nX = pd.get_dummies(df[feature_cols], columns=category_cols)",
        "examComments": "# 构造特征矩阵与目标变量，并对分类字段进行独热编码",
        "teacherExpression": "pd.get_dummies(df[feature_cols], columns=category_cols)",
        "websiteReferences": [
          "pd.get_dummies(df[feature_cols], columns=category_cols)",
          "pd.get_dummies(df[feature_cols], columns=category_cols).astype(float)"
        ],
        "websiteHint": "pd.get_dummies(..., columns=...)"
      },
      {
        "id": "b2-8",
        "title": "提取目标变量",
        "goal": "预测目标是运输是否出现温控报警。",
        "code": "# 构造特征矩阵与目标变量，并对分类字段进行独热编码\ny = df[{{}}]",
        "slots": [
          {
            "answer": "'temp_alarm'",
            "choices": [
              "'temp_alarm'",
              "'max_temp'",
              "'cargo_type'"
            ],
            "why": "temp_alarm 是 0/1 监督标签，max_temp 属于输入特征。"
          }
        ],
        "hint": "标签列是 temp_alarm。",
        "context": "",
        "solution": "# 构造特征矩阵与目标变量，并对分类字段进行独热编码\ny = df['temp_alarm']",
        "examComments": "# 构造特征矩阵与目标变量，并对分类字段进行独热编码",
        "teacherExpression": "df['temp_alarm']",
        "websiteReferences": [
          "df['temp_alarm']",
          "df[\"temp_alarm\"]"
        ],
        "websiteHint": "温控报警标签列"
      },
      {
        "id": "b2-9",
        "title": "分层划分训练与测试集",
        "goal": "训练集占 75%，测试集占 25%，固定随机种子 42，并保持标签比例。",
        "code": "# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size={{}}, stratify={{}}, random_state={{}})",
        "slots": [
          {
            "answer": "0.25",
            "choices": [
              "0.25",
              "0.75",
              "25"
            ],
            "why": "test_size 表示测试集占比，25% 应写 0.25。"
          },
          {
            "answer": "y",
            "choices": [
              "y",
              "X",
              "None"
            ],
            "why": "stratify=y 按目标类别分层，保持训练和测试的标签分布。"
          },
          {
            "answer": "42",
            "choices": [
              "42",
              "0",
              "None"
            ],
            "why": "题目指定 random_state=42，以便复现划分。"
          }
        ],
        "hint": "test_size 是测试集比例；分层依据是目标 y。",
        "context": "",
        "solution": "# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)",
        "examComments": "# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42",
        "teacherExpression": "train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)",
        "websiteReferences": [
          "train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)"
        ],
        "websiteHint": "test_size=0.25、stratify=y、random_state=42 缺一不可"
      },
      {
        "id": "b2-10",
        "title": "配置随机森林",
        "goal": "使用 100 棵树、最大深度 6、平衡类别权重、随机种子 42。",
        "code": "# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42\nmodel = RandomForestClassifier(n_estimators={{}}, max_depth={{}}, class_weight={{}}, random_state=42)",
        "slots": [
          {
            "answer": "100",
            "choices": [
              "100",
              "6",
              "42"
            ],
            "why": "n_estimators 是树的数量。"
          },
          {
            "answer": "6",
            "choices": [
              "6",
              "100",
              "None"
            ],
            "why": "max_depth 限制每棵树的最大深度。"
          },
          {
            "answer": "'balanced'",
            "choices": [
              "'balanced'",
              "None",
              "'balance'"
            ],
            "why": "合法参数值是 balanced，根据类别频率调整权重；balance 不是该参数的有效值。"
          }
        ],
        "hint": "区分树的数量和深度，类别权重写 balanced。",
        "context": "",
        "solution": "# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42\nmodel = RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)",
        "examComments": "# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42",
        "teacherExpression": "RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)",
        "websiteReferences": [
          "RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)"
        ],
        "websiteHint": "四个参数都要写全"
      },
      {
        "id": "b2-11",
        "title": "训练模型",
        "goal": "仅用训练集特征及训练集标签拟合分类器。",
        "code": "# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42\nmodel.{{}}({{}}, {{}})",
        "slots": [
          {
            "answer": "fit",
            "choices": [
              "fit",
              "predict",
              "score"
            ],
            "why": "fit 进行模型训练。"
          },
          {
            "answer": "X_train",
            "choices": [
              "X_train",
              "X_test",
              "X"
            ],
            "why": "训练数据是 X_train，不可拿测试集拟合。"
          },
          {
            "answer": "y_train",
            "choices": [
              "y_train",
              "y_test",
              "y"
            ],
            "why": "标签必须与训练集特征一一对应。"
          }
        ],
        "hint": "测试集用于独立评估，不能参与拟合。",
        "context": "",
        "solution": "# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42\nmodel.fit(X_train, y_train)",
        "examComments": "# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42",
        "teacherExpression": "model.fit(X_train, y_train)",
        "websiteReferences": [
          "model.fit(X_train, y_train)"
        ],
        "websiteHint": "model.fit(...)"
      },
      {
        "id": "b2-12",
        "title": "预测测试集",
        "goal": "对保留的测试集生成类别预测。",
        "code": "# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42\ny_pred = model.{{}}({{}})",
        "slots": [
          {
            "answer": "predict",
            "choices": [
              "predict",
              "fit",
              "predict_proba"
            ],
            "why": "predict 输出类别标签；predict_proba 输出概率，不能直接作为这些分类指标的类别输入。"
          },
          {
            "answer": "X_test",
            "choices": [
              "X_test",
              "X_train",
              "y_test"
            ],
            "why": "最终测试指标应基于 X_test 的预测结果。"
          }
        ],
        "hint": "训练用 fit，预测类别用 predict。",
        "context": "",
        "solution": "# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42\ny_pred = model.predict(X_test)",
        "examComments": "# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42",
        "teacherExpression": "model.predict(X_test)",
        "websiteReferences": [
          "model.predict(X_test)"
        ],
        "websiteHint": "model.predict(...)"
      },
      {
        "id": "b2-13",
        "title": "计算精确率",
        "goal": "使用测试集真实标签与预测标签计算精确率。",
        "code": "# 计算精确率、召回率、F1值和混淆矩阵\nprecision = {{}}({{}}, {{}})",
        "slots": [
          {
            "answer": "precision_score",
            "choices": [
              "precision_score",
              "recall_score",
              "f1_score",
              "confusion_matrix"
            ],
            "why": "精确率是预测报警中真实报警的比例，关注误报。"
          },
          {
            "answer": "y_test",
            "choices": [
              "y_test",
              "y_train",
              "y_pred"
            ],
            "why": "第一个参数是真实标签 y_test。"
          },
          {
            "answer": "y_pred",
            "choices": [
              "y_pred",
              "y_test",
              "X_test"
            ],
            "why": "第二个参数是预测标签 y_pred；顺序交换会改变精确率和召回率的意义。"
          }
        ],
        "hint": "指标函数的参数顺序：真实值在前，预测值在后。",
        "context": "",
        "solution": "# 计算精确率、召回率、F1值和混淆矩阵\nprecision = precision_score(y_test, y_pred)",
        "examComments": "# 计算精确率、召回率、F1值和混淆矩阵",
        "teacherExpression": "precision_score(y_test, y_pred)",
        "websiteReferences": [
          "precision_score(y_test, y_pred)"
        ],
        "websiteHint": "precision_score(真实值, 预测值)"
      },
      {
        "id": "b2-14",
        "title": "计算召回率",
        "goal": "使用测试集真实标签与预测标签计算召回率。",
        "code": "# 计算精确率、召回率、F1值和混淆矩阵\nrecall = {{}}({{}}, {{}})",
        "slots": [
          {
            "answer": "recall_score",
            "choices": [
              "recall_score",
              "precision_score",
              "f1_score",
              "confusion_matrix"
            ],
            "why": "召回率是真实报警中被找出的比例，关注漏报。"
          },
          {
            "answer": "y_test",
            "choices": [
              "y_test",
              "y_train",
              "y_pred"
            ],
            "why": "第一个参数是真实标签 y_test。"
          },
          {
            "answer": "y_pred",
            "choices": [
              "y_pred",
              "y_test",
              "X_test"
            ],
            "why": "第二个参数是预测标签 y_pred；顺序交换会改变精确率和召回率的意义。"
          }
        ],
        "hint": "指标函数的参数顺序：真实值在前，预测值在后。",
        "context": "",
        "solution": "# 计算精确率、召回率、F1值和混淆矩阵\nrecall = recall_score(y_test, y_pred)",
        "examComments": "# 计算精确率、召回率、F1值和混淆矩阵",
        "teacherExpression": "recall_score(y_test, y_pred)",
        "websiteReferences": [
          "recall_score(y_test, y_pred)"
        ],
        "websiteHint": "recall_score(...)"
      },
      {
        "id": "b2-15",
        "title": "计算F1 值",
        "goal": "使用测试集真实标签与预测标签计算F1 值。",
        "code": "# 计算精确率、召回率、F1值和混淆矩阵\nf1 = {{}}({{}}, {{}})",
        "slots": [
          {
            "answer": "f1_score",
            "choices": [
              "f1_score",
              "precision_score",
              "recall_score",
              "confusion_matrix"
            ],
            "why": "F1 综合精确率与召回率，不能只看准确率。"
          },
          {
            "answer": "y_test",
            "choices": [
              "y_test",
              "y_train",
              "y_pred"
            ],
            "why": "第一个参数是真实标签 y_test。"
          },
          {
            "answer": "y_pred",
            "choices": [
              "y_pred",
              "y_test",
              "X_test"
            ],
            "why": "第二个参数是预测标签 y_pred；顺序交换会改变精确率和召回率的意义。"
          }
        ],
        "hint": "指标函数的参数顺序：真实值在前，预测值在后。",
        "context": "",
        "solution": "# 计算精确率、召回率、F1值和混淆矩阵\nf1 = f1_score(y_test, y_pred)",
        "examComments": "# 计算精确率、召回率、F1值和混淆矩阵",
        "teacherExpression": "f1_score(y_test, y_pred)",
        "websiteReferences": [
          "f1_score(y_test, y_pred)"
        ],
        "websiteHint": "f1_score(...)"
      },
      {
        "id": "b2-16",
        "title": "计算混淆矩阵",
        "goal": "使用测试集真实标签与预测标签计算混淆矩阵。",
        "code": "# 计算精确率、召回率、F1值和混淆矩阵\ncm = {{}}({{}}, {{}})",
        "slots": [
          {
            "answer": "confusion_matrix",
            "choices": [
              "confusion_matrix",
              "precision_score",
              "recall_score",
              "f1_score"
            ],
            "why": "混淆矩阵展示真实类别和预测类别的组合，便于定位误报与漏报。"
          },
          {
            "answer": "y_test",
            "choices": [
              "y_test",
              "y_train",
              "y_pred"
            ],
            "why": "第一个参数是真实标签 y_test。"
          },
          {
            "answer": "y_pred",
            "choices": [
              "y_pred",
              "y_test",
              "X_test"
            ],
            "why": "第二个参数是预测标签 y_pred；顺序交换会改变精确率和召回率的意义。"
          }
        ],
        "hint": "指标函数的参数顺序：真实值在前，预测值在后。",
        "context": "",
        "solution": "# 计算精确率、召回率、F1值和混淆矩阵\ncm = confusion_matrix(y_test, y_pred)",
        "examComments": "# 计算精确率、召回率、F1值和混淆矩阵",
        "teacherExpression": "confusion_matrix(y_test, y_pred)",
        "websiteReferences": [
          "confusion_matrix(y_test, y_pred)"
        ],
        "websiteHint": "confusion_matrix(...)"
      },
      {
        "id": "b2-17",
        "title": "比较各货物类型召回率",
        "goal": "保留测试集原始索引，关联货物类型后按组评估召回率。",
        "code": "# 计算测试集中不同货物类型的召回率\ntest_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()\ntest_result['actual'] = y_test.to_numpy()\ntest_result['predicted'] = y_pred\ncargo_recall = test_result.groupby({{}}).apply(lambda g: {{}}(g[{{}}], g[{{}}]))",
        "slots": [
          {
            "answer": "'cargo_type'",
            "choices": [
              "'cargo_type'",
              "'shipment_id'",
              "'predicted'"
            ],
            "why": "业务要求比较货物类型，不能按预测标签分组。"
          },
          {
            "answer": "recall_score",
            "choices": [
              "recall_score",
              "precision_score",
              "f1_score"
            ],
            "why": "需要比较召回率，即各组真实报警被找出的比例。"
          },
          {
            "answer": "'actual'",
            "choices": [
              "'actual'",
              "'predicted'",
              "'cargo_type'"
            ],
            "why": "actual 保存测试集真实标签。"
          },
          {
            "answer": "'predicted'",
            "choices": [
              "'predicted'",
              "'actual'",
              "'shipment_id'"
            ],
            "why": "predicted 保存对应行的预测标签。"
          }
        ],
        "hint": "按 cargo_type 分组，在组内用 actual 与 predicted 计算召回率。",
        "context": "",
        "solution": "# 计算测试集中不同货物类型的召回率\ntest_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()\ntest_result['actual'] = y_test.to_numpy()\ntest_result['predicted'] = y_pred\ncargo_recall = test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))",
        "examComments": "# 计算测试集中不同货物类型的召回率",
        "teacherExpression": "test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))",
        "websiteReferences": [
          "test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))",
          "test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']), include_groups=False)"
        ],
        "websiteHint": "按 cargo_type 分组后对每组算 recall_score"
      },
      {
        "id": "b2-18",
        "kind": "case",
        "taskIndex": 0,
        "title": "任务三：选择优先指标并解释理由",
        "goal": "把冷链漏报风险与指标含义对应起来。",
        "code": "优先关注异常类的 {{}}。\n理由：{{}}。\n同时关注 {{}}，避免只追求单一指标。",
        "solution": "优先关注异常类的 召回率。\n理由：漏报可能导致货损与质量安全风险。\n同时关注 精确率、F1及误报处置成本，避免只追求单一指标。",
        "slots": [
          {
            "answer": "召回率",
            "choices": [
              "召回率",
              "总体准确率",
              "仅看正常类预测数量"
            ],
            "why": "异常召回率=TP/(TP+FN)，衡量真实异常被识别的比例。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "召回率",
                  "recall"
                ]
              ]
            }
          },
          {
            "answer": "漏报可能导致货损与质量安全风险",
            "choices": [
              "漏报可能导致货损与质量安全风险",
              "误报完全没有成本",
              "总体准确率高就一定没有风险"
            ],
            "why": "冷链异常漏报会延迟干预，导致异常运输未及时处置。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "漏报",
                  "漏检",
                  "未识别"
                ],
                [
                  "货损",
                  "安全",
                  "质量",
                  "损失"
                ]
              ]
            }
          },
          {
            "answer": "精确率、F1及误报处置成本",
            "choices": [
              "精确率、F1及误报处置成本",
              "只看训练集准确率",
              "忽略误报与人工负担"
            ],
            "why": "需要兼顾误报、人工复核和运营负担，不能只看召回率。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "精确率",
                  "precision"
                ],
                [
                  "误报",
                  "成本",
                  "负担",
                  "f1"
                ]
              ]
            }
          }
        ],
        "hint": "结合业务说明指标和理由；改进措施要具体，效果需在独立数据上验证。",
        "context": ""
      },
      {
        "id": "b2-19",
        "kind": "case",
        "taskIndex": 0,
        "title": "任务三：改进薄弱货类并验证",
        "goal": "提出一项针对性的改进措施，再说明怎样证明有效。",
        "code": "先比较各货类召回率、异常样本数和漏报数。\n措施：针对薄弱货类 {{}}。\n重新训练后用 {{}} 对比。\n核对薄弱组召回率和漏报数，同时检查 {{}}。",
        "solution": "先比较各货类召回率、异常样本数和漏报数。\n措施：针对薄弱货类 补充代表性异常正样本并核验标签。\n重新训练后用 保留的独立测试集 对比。\n核对薄弱组召回率和漏报数，同时检查 总体表现、各组精确率和误报负担。",
        "slots": [
          {
            "answer": "补充代表性异常正样本并核验标签",
            "choices": [
              "补充代表性异常正样本并核验标签",
              "删除该组测试难例",
              "修改测试标签让分数变高"
            ],
            "why": "补充薄弱类别真实异常数据用于训练，覆盖多样条件，先核验标签。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "补充",
                  "增加",
                  "采集"
                ],
                [
                  "异常",
                  "正样本"
                ],
                [
                  "标签",
                  "核验",
                  "审核"
                ]
              ]
            }
          },
          {
            "answer": "保留的独立测试集",
            "choices": [
              "保留的独立测试集",
              "并入训练的原测试集",
              "只在训练数据上"
            ],
            "why": "测试数据不能参与训练或反复选型；必要时另设验证集和最终独立测试批次。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "独立",
                  "保留",
                  "未参与"
                ],
                [
                  "测试",
                  "验证"
                ]
              ]
            }
          },
          {
            "answer": "总体表现、各组精确率和误报负担",
            "choices": [
              "总体表现、各组精确率和误报负担",
              "只看训练分数",
              "忽略其他货物类型"
            ],
            "why": "改善弱组的同时评估总体与其他分组，防止以大量误报换取召回。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "总体",
                  "其他组",
                  "分组"
                ],
                [
                  "精确率",
                  "误报",
                  "成本"
                ]
              ]
            }
          }
        ],
        "hint": "结合业务说明指标和理由；改进措施要具体，效果需在独立数据上验证。",
        "context": ""
      }
    ],
    "count": 19,
    "originalCode": "import pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix\n\n\n# 读取与清洗数据\ndf = pd.read_csv('cold_chain_shipments.csv')\n\n# 转换发车时间并提取发车小时\ndf['depart_time'] = ______________________________\ndf['depart_hour'] = ______________________________\n\n# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录\ndf = _____________________________________________\ndf = _____________________________________________\n\n# 按货物类型的中位数填补 avg_temp 缺失值\ndf['avg_temp'] = __________________________________\n\nprint('清洗后记录数：', len(df))\n\n\n# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率\ncargo_region_summary = ______________________________________________\nprint(cargo_region_summary)\n\n\nfeature_cols = [\n    'route_region', 'vehicle_type', 'cargo_type', 'planned_hours',\n    'outside_temp', 'avg_temp', 'max_temp', 'door_open_count',\n    'sensor_missing_rate', 'driver_experience_years', 'depart_hour'\n]\ncategory_cols = ['route_region', 'vehicle_type', 'cargo_type']\n\n# 构造特征矩阵与目标变量，并对分类字段进行独热编码\nX = _______________________________________________\ny = _______________________________________________\n\n# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42\nX_train, X_test, y_train, y_test = _________________________________\n\n# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42\nmodel = _____________________________________________________________\n_____________________________________________________________\ny_pred = ____________________________________________________________\n\n# 计算精确率、召回率、F1值和混淆矩阵\nprecision = __________________________\nrecall = _____________________________\nf1 = _________________________________\ncm = _________________________________\nprint('precision=', round(precision, 3))\nprint('recall=', round(recall, 3))\nprint('f1=', round(f1, 3))\nprint('confusion matrix=\\n', cm)\n\n# 计算测试集中不同货物类型的召回率\ntest_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()\ntest_result['actual'] = y_test.to_numpy()\ntest_result['predicted'] = y_pred\ncargo_recall = ______________________________________________________\nprint(cargo_recall)\n",
    "referenceCode": "import pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix\n\n# 读取与清洗数据\ndf = pd.read_csv('cold_chain_shipments.csv')\n\n# 转换发车时间并提取发车小时\ndf['depart_time'] = pd.to_datetime(df['depart_time'])\ndf['depart_hour'] = df['depart_time'].dt.hour\n\n# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录\ndf = df.drop_duplicates(subset='shipment_id')\ndf = df[(df['planned_hours'] > 0) & (df['planned_hours'] <= 72) & (df['sensor_missing_rate'] >= 0) & (df['sensor_missing_rate'] <= 1)]\n\n# 按货物类型的中位数填补 avg_temp 缺失值\ndf['avg_temp'] = df.groupby('cargo_type')['avg_temp'].transform(lambda s: s.fillna(s.median()))\n\nprint('清洗后记录数：', len(df))\n\n# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率\ncargo_region_summary = df.groupby(['cargo_type','route_region']).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm','mean'), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()\nprint(cargo_region_summary)\n\nfeature_cols = [\n    'route_region', 'vehicle_type', 'cargo_type', 'planned_hours',\n    'outside_temp', 'avg_temp', 'max_temp', 'door_open_count',\n    'sensor_missing_rate', 'driver_experience_years', 'depart_hour'\n]\ncategory_cols = ['route_region', 'vehicle_type', 'cargo_type']\n\n# 构造特征矩阵与目标变量，并对分类字段进行独热编码\nX = pd.get_dummies(df[feature_cols], columns=category_cols)\ny = df['temp_alarm']\n\n# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)\n\n# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42\nmodel = RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)\n\n# 计算精确率、召回率、F1值和混淆矩阵\nprecision = precision_score(y_test, y_pred)\nrecall = recall_score(y_test, y_pred)\nf1 = f1_score(y_test, y_pred)\ncm = confusion_matrix(y_test, y_pred)\nprint('precision=', round(precision, 3))\nprint('recall=', round(recall, 3))\nprint('f1=', round(f1, 3))\nprint('confusion matrix=\\n', cm)\n\n# 计算测试集中不同货物类型的召回率\ntest_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()\ntest_result['actual'] = y_test.to_numpy()\ntest_result['predicted'] = y_pred\ncargo_recall = test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))\nprint(cargo_recall)",
    "websiteURL": "https://ai-trainer-exam-87484.app.workbuddy.host/?sharecode=P6SA3BBFCH",
    "websiteNote": "主答案采用老师提供的参考代码，分步练习仅在老师的原表达式上挖空；老师列出的等价写法保留供对照。planned_hours≤72 是老师参考代码中的运输计划时长筛选条件，不是答题时长限制；本页按老师写法保留。",
    "websiteCode": "import pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix\n\n# 读取与清洗数据\ndf = pd.read_csv('cold_chain_shipments.csv')\n\n# 转换发车时间并提取发车小时\ndf['depart_time'] = pd.to_datetime(df['depart_time'])\ndf['depart_hour'] = df['depart_time'].dt.hour\n\n# 按运输单号去重，并删除运输时长或传感器缺失率不合法的记录\ndf = df.drop_duplicates(subset='shipment_id')\ndf = df[(df['planned_hours'] > 0) & (df['planned_hours'] <= 72) & (df['sensor_missing_rate'] >= 0) & (df['sensor_missing_rate'] <= 1)]\n\n# 按货物类型的中位数填补 avg_temp 缺失值\ndf['avg_temp'] = df.groupby('cargo_type')['avg_temp'].transform(lambda s: s.fillna(s.median()))\n\nprint('清洗后记录数：', len(df))\n\n# 统计不同货物类型、不同线路区域的样本数、报警率和平均传感器缺失率\ncargo_region_summary = df.groupby(['cargo_type','route_region']).agg(样本数=('shipment_id','count'), 报警率=('temp_alarm','mean'), 平均传感器缺失率=('sensor_missing_rate','mean')).reset_index()\nprint(cargo_region_summary)\n\nfeature_cols = [\n    'route_region', 'vehicle_type', 'cargo_type', 'planned_hours',\n    'outside_temp', 'avg_temp', 'max_temp', 'door_open_count',\n    'sensor_missing_rate', 'driver_experience_years', 'depart_hour'\n]\ncategory_cols = ['route_region', 'vehicle_type', 'cargo_type']\n\n# 构造特征矩阵与目标变量，并对分类字段进行独热编码\nX = pd.get_dummies(df[feature_cols], columns=category_cols)\ny = df['temp_alarm']\n\n# 按 75%/25% 划分训练集和测试集，按 y 分层，random_state=42\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)\n\n# 构建随机森林分类器并完成训练和预测\n# 参数：决策树的数量为100，最大深度是6，采用平衡类别权重，random_state=42\nmodel = RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)\n\n# 计算精确率、召回率、F1值和混淆矩阵\nprecision = precision_score(y_test, y_pred)\nrecall = recall_score(y_test, y_pred)\nf1 = f1_score(y_test, y_pred)\ncm = confusion_matrix(y_test, y_pred)\nprint('precision=', round(precision, 3))\nprint('recall=', round(recall, 3))\nprint('f1=', round(f1, 3))\nprint('confusion matrix=\\n', cm)\n\n# 计算测试集中不同货物类型的召回率\ntest_result = df.loc[X_test.index, ['shipment_id', 'cargo_type']].copy()\ntest_result['actual'] = y_test.to_numpy()\ntest_result['predicted'] = y_pred\ncargo_recall = test_result.groupby('cargo_type').apply(lambda g: recall_score(g['actual'], g['predicted']))\nprint(cargo_recall)",
    "answerSchema": 2,
    "tasks": [
      {
        "id": "b2t3",
        "title": "任务三 · 形成算法测试结论",
        "promptHTML": "<p>结合冷链温控异常预警业务，说明应优先关注的分类指标及理由，并针对不同货物类型测试表现存在明显差异的情况提出一项改进措施。</p>",
        "answerHTML": "<h4>优先指标及理由</h4><p>优先关注温控异常类（temp_alarm=1）的召回率，即 TP/(TP+FN)：实际异常运输中有多少被正确预警。漏报可能使温控异常未被及时处置，带来货损和质量安全风险，因此应重点减少 FN。不能只看总体准确率，正常样本较多时它可能掩盖异常漏报。也不能孤立追求召回率：同时报告精确率、F1和混淆矩阵，评估误报造成的人工复核和运营成本。具体目标需结合业务风险与处置能力确定，不虚构固定达标值。</p><h4>货物类型表现差异与一项改进</h4><p>依据本次测试输出，列出各货物类型的异常召回率、异常样本数及漏报数，识别薄弱类别；总体指标不能代表每个货类。样本很少时还应报告不确定性，不能凭一次划分认定业务差异一定稳定存在。</p><p><strong>改进措施：</strong>针对异常召回率偏低的货物类型，补充具有代表性的异常正样本，覆盖不同线路、季节和温度条件，并由业务人员核验标签，再加入训练集重新训练。这是一项“针对薄弱货类的数据补充与核验”措施；不能为了抬高指标而删除该组难例、修改测试标签或把测试集并入训练集。</p><p><strong>验证：</strong>保留独立测试集，原模型与新模型在同一测试口径上对比薄弱货类异常召回率、漏报数和异常样本数，同时核对总体召回率、各组精确率及误报负担。若反复据测试结果调参，应另设验证集，并保留最终未参与选型的测试数据；必要时补充独立时间批次复核。改善需由实际结果证实，不能仅凭训练集分数承诺上线效果。</p>"
      }
    ],
    "writtenDownloadPath": "materials/b2-written-reference.html"
  }
};
