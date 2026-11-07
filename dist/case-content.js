Object.assign(SKILL_COURSES, {
  "b11": {
    "id": "b11",
    "kind": "case",
    "category": "业务分析 · B1-1",
    "title": "B1-1 · 产品外观智能质检业务框架与流程设计",
    "materialHTML": "<h4>业务背景</h4>\n<p>某制造企业生产小家电塑料外壳，需要在包装前检查划伤、凹陷等外观缺陷。现有流程为：操作员取件检查外观，在纸质表单中记录结果，合格品进入包装，不合格品放入周转箱，再由质量人员决定返工或报废。企业已试运行视觉检测模型。模型根据产品图像输出 0～1 的“缺陷分数”，分数越高表示模型越倾向于认为存在缺陷。缺陷分数不是已经验证的实际缺陷概率，也不能替代最终质量结论。企业准备将模型接入业务流程，但存在以下问题：</p>\n<ol><li>部分图像模糊或反光，模型仍会输出分数，直接使用可能导致错误放行。</li><li>浅色划伤、细小凹陷容易漏检，反光或正常纹理容易被误判为缺陷。</li><li>模型不确定时由谁检查、检查后如何流转尚未明确；已判定不合格的产品也可能因记录不同步而进入包装。</li><li>人工纠正结果只记在纸上，无法与原始图像、模型版本关联，也没有形成稳定的模型改进流程。</li></ol>\n<h4>试运行记录</h4>\n<p>下表中的人工结论来自试运行阶段的逐件复核，仅用于分析模型错误。正式自动处理时，人工结论不是预先可用的输入。</p>\n<div><table><thead><tr><th>产品编号</th><th>批次</th><th>图像质量</th><th>模型缺陷分数</th><th>人工最终结论</th><th>人工说明</th></tr></thead><tbody><tr><td>P001</td><td>B01</td><td>清晰</td><td>0.08</td><td>合格</td><td>无明显缺陷</td></tr><tr><td>P002</td><td>B01</td><td>清晰</td><td>0.92</td><td>不合格</td><td>明显划伤</td></tr><tr><td>P003</td><td>B01</td><td>清晰</td><td>0.55</td><td>合格</td><td>正常纹理被模型关注</td></tr><tr><td>P004</td><td>B02</td><td>模糊</td><td>0.04</td><td>不合格</td><td>检查实物后发现划伤</td></tr><tr><td>P005</td><td>B02</td><td>清晰</td><td>0.12</td><td>不合格</td><td>细小凹陷漏检</td></tr><tr><td>P006</td><td>B02</td><td>清晰</td><td>0.86</td><td>合格</td><td>反光被误判为缺陷</td></tr></tbody></table></div>\n<h4>业务规则</h4>\n<p>以下为企业拟采用的试行规则：</p>\n<ol><li>先检查图像质量。模糊、严重反光或主体不完整时，原分数无效，先补拍一次。补拍后仍不可用，转质检员检查实物，不得自动放行。</li><li>图像可用时按分数分流。缺陷分数小于 0.20，自动放行；大于或等于 0.20 且小于 0.80，转人工复核；大于或等于 0.80，自动隔离待质量人员处理。</li><li>人工复核具有裁定权。人工确认合格可放行，确认不合格应隔离；暂时无法判断的产品保持待检状态，由质量主管继续处理，不得默认合格。</li><li>隔离不等于报废。隔离产品由质量人员按企业标准决定放行、返工或报废。返工完成后重新进入检测流程，不直接送包装。</li><li>必须记录状态。只有当前有效状态为“已放行”的产品才能进入包装；人工改判需要记录人员、理由及时间。</li></ol>",
    "tasks": [
      {
        "id": "b11t1",
        "title": "业务框架设计",
        "promptHTML": "<p>用文字说明系统如何连接生产现场、视觉模型、质检人员和包装环节。至少写出：</p>\n<ul><li>四个必要业务模块及各自作用。</li><li>系统与质检人员的职责边界。</li><li>一组用于产品追溯的输入、输出记录，包括记录方向、来源或去向、关键字段。</li></ul>",
        "answerHTML": "<table><caption>业务模块与作用</caption><thead><tr><th>模块</th><th>连接场景</th><th>作用</th></tr></thead><tbody><tr><td>图像采集与质量检查模块</td><td>生产现场</td><td>产品到达检测工位时触发拍照，检查模糊、反光和主体完整性。图像不合格时补拍一次，仍不可用则转人工检查。</td></tr><tr><td>视觉模型推理与分流模块</td><td>视觉模型</td><td>对可用图像调用模型得到缺陷分数。低于 0.20 自动放行，0.20 ≤ 分数 &lt; 0.80 转人工复核，0.80 及以上自动隔离。模型负责初筛，质量结论按规则及人工裁定确定。</td></tr><tr><td>人工复核与质量处置模块</td><td>质检人员</td><td>对中间分数产品进行人工复核与裁定。隔离产品由质量人员按标准决定放行、返工或报废，返工后重新进入检测。</td></tr><tr><td>状态记录与追溯模块</td><td>包装环节</td><td>记录每件产品的唯一有效状态（待检、已放行、已隔离或待处置），包装前核验已放行状态。人工改判记录人员、理由和时间，关联原图与模型版本，作为模型改进数据。</td></tr></tbody></table><table><caption>人机职责边界</caption><thead><tr><th>责任主体</th><th>职责边界</th></tr></thead><tbody><tr><td>系统</td><td>检查图像质量并触发补拍，调用模型打分和执行三档分流，分派复核任务，同步状态并留痕。包装前核验当前有效状态，只允许已放行的产品进入包装。</td></tr><tr><td>质检人员</td><td>复核中间分数产品，检查补拍后仍不可用的实物并作出裁定。按标准决定隔离品放行、返工或报废，无法判断时保持待检并交质量主管处理。记录改判人、理由和时间，确认可用于模型改进的样本。</td></tr></tbody></table><table><caption>输入输出与追溯记录</caption><thead><tr><th>方向</th><th>记录</th><th>来源/去向</th><th>关键字段</th></tr></thead><tbody><tr><td>输入</td><td>检测任务记录</td><td>生产现场 → 系统</td><td>产品编号、批次、工位号、采集时间、原始图像ID、图像质量标记、模型版本号</td></tr><tr><td>输入</td><td>模型推理结果</td><td>视觉模型 → 系统</td><td>产品编号、缺陷分数、推理时间、模型版本号</td></tr><tr><td>输入</td><td>人工复核结论</td><td>质检员 → 系统</td><td>产品编号、复核结论（合格/不合格/待定）、复核人、理由、时间</td></tr><tr><td>输出</td><td>产品状态记录</td><td>系统 → 包装环节</td><td>产品编号、当前有效状态（已放行/已隔离/待检）、状态更新时间</td></tr><tr><td>输出</td><td>质量处置记录</td><td>系统 → 质量人员/返工线</td><td>产品编号、处置决定（放行/返工/报废）、处置人、时间；返工完成后生成新检测任务回流</td></tr><tr><td>输出</td><td>模型改进样本记录</td><td>系统 → 模型训练环节</td><td>图像ID、模型原分数、人工最终结论、错误类型（漏检/误判）、关联模型版本</td></tr></tbody></table>",
        "businessTables": [
          {
            "title": "业务模块与作用",
            "headers": [
              "模块",
              "连接场景",
              "作用"
            ],
            "rows": [
              [
                "图像采集与质量检查模块",
                "生产现场",
                "产品到达检测工位时触发拍照，检查模糊、反光和主体完整性。图像不合格时补拍一次，仍不可用则转人工检查。"
              ],
              [
                "视觉模型推理与分流模块",
                "视觉模型",
                "对可用图像调用模型得到缺陷分数。低于 0.20 自动放行，0.20 ≤ 分数 < 0.80 转人工复核，0.80 及以上自动隔离。模型负责初筛，质量结论按规则及人工裁定确定。"
              ],
              [
                "人工复核与质量处置模块",
                "质检人员",
                "对中间分数产品进行人工复核与裁定。隔离产品由质量人员按标准决定放行、返工或报废，返工后重新进入检测。"
              ],
              [
                "状态记录与追溯模块",
                "包装环节",
                "记录每件产品的唯一有效状态（待检、已放行、已隔离或待处置），包装前核验已放行状态。人工改判记录人员、理由和时间，关联原图与模型版本，作为模型改进数据。"
              ]
            ]
          },
          {
            "title": "人机职责边界",
            "headers": [
              "责任主体",
              "职责边界"
            ],
            "rows": [
              [
                "系统",
                "检查图像质量并触发补拍，调用模型打分和执行三档分流，分派复核任务，同步状态并留痕。包装前核验当前有效状态，只允许已放行的产品进入包装。"
              ],
              [
                "质检人员",
                "复核中间分数产品，检查补拍后仍不可用的实物并作出裁定。按标准决定隔离品放行、返工或报废，无法判断时保持待检并交质量主管处理。记录改判人、理由和时间，确认可用于模型改进的样本。"
              ]
            ]
          },
          {
            "title": "输入输出与追溯记录",
            "headers": [
              "方向",
              "记录",
              "来源/去向",
              "关键字段"
            ],
            "rows": [
              [
                "输入",
                "检测任务记录",
                "生产现场 → 系统",
                "产品编号、批次、工位号、采集时间、原始图像ID、图像质量标记、模型版本号"
              ],
              [
                "输入",
                "模型推理结果",
                "视觉模型 → 系统",
                "产品编号、缺陷分数、推理时间、模型版本号"
              ],
              [
                "输入",
                "人工复核结论",
                "质检员 → 系统",
                "产品编号、复核结论（合格/不合格/待定）、复核人、理由、时间"
              ],
              [
                "输出",
                "产品状态记录",
                "系统 → 包装环节",
                "产品编号、当前有效状态（已放行/已隔离/待检）、状态更新时间"
              ],
              [
                "输出",
                "质量处置记录",
                "系统 → 质量人员/返工线",
                "产品编号、处置决定（放行/返工/报废）、处置人、时间；返工完成后生成新检测任务回流"
              ],
              [
                "输出",
                "模型改进样本记录",
                "系统 → 模型训练环节",
                "图像ID、模型原分数、人工最终结论、错误类型（漏检/误判）、关联模型版本"
              ]
            ]
          }
        ]
      },
      {
        "id": "b11t2",
        "title": "业务流程与处置规则设计",
        "promptHTML": "<ol><li>编写简短的“条件—处理动作—后续去向”规则表，覆盖图像不可用、低分、中间分数和高分四种情况。</li><li>绘制一张简洁的业务流程图，体现图像检查、模型检测、放行／人工复核／隔离分流，以及处理结果记录。人工复核后的去向和隔离后的处置可直接写在对应节点中，无需画出所有异常支线。</li><li>分别说明 P004、P005 按拟上线规则会进入哪条路径。</li></ol>",
        "answerHTML": "<div><table><thead><tr><th>条件</th><th>处理动作</th><th>后续去向</th></tr></thead><tbody><tr><td>图像模糊、严重反光或主体不完整</td><td>使原分数失效，补拍一次；仍不可用则人工检查实物。</td><td>人工判合格则放行，不合格则隔离，无法判断则待检并交主管；不得自动放行。</td></tr><tr><td>图像可用且分数小于 0.20</td><td>按试行规则自动放行并记录。</td><td>更新已放行状态，包装入口再次校验。</td></tr><tr><td>图像可用且 0.20≤分数＜0.80</td><td>转质检员复核，记录裁定及理由。</td><td>合格放行，不合格隔离，不确定保持待检。</td></tr><tr><td>图像可用且分数≥0.80</td><td>自动隔离，等待质量人员处理。</td><td>质量人员决定放行、返工或报废；返工后重新检测。</td></tr></tbody></table></div>\n<table><caption>P004、P005 的路径判定</caption><thead><tr><th>产品</th><th>数据</th><th>按拟上线规则的路径</th></tr></thead><tbody><tr><td>P004</td><td>图像模糊，分数0.04；试运行人工结论：实物有划伤、不合格。</td><td>先检查图像质量：图像模糊→原分数0.04作废→补拍一次。补拍图像可用→按新图重新检测并按新分数分流；补拍仍不可用→质检员检查实物→按检查结论处置，不合格则隔离，无法判断则待检并交主管。不得用模糊图像的低分直接放行。</td></tr><tr><td>P005</td><td>图像清晰，分数0.12（&lt;0.20）；试运行人工结论：细小凹陷、不合格。</td><td>图像可用且0.12&lt;0.20→自动放行→进入包装（包装前核对当前有效状态）。这会造成错误放行，暴露模型或阈值对细小凹陷的漏检风险，需要在任务三验证改进。不能把事后人工结论当作分流前输入，改写成必然人工复核或隔离。</td></tr></tbody></table><p>判断要点：P004先处理图像不可用问题，不能凭旧分数放行；P005按当前规则会自动放行，需指出漏检风险。补拍后的新分数未知，不预先断言会进入哪条分数路径。0.20进入人工复核，0.80进入隔离；人工不确定不得默认合格。</p><h4>规范业务流程图（参考方案）</h4><div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1190px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1190\" aria-hidden=\"true\"><defs><marker id=\"arrow-b11\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 45V69\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M380 121V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M265 200H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"188\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M110 244V300\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M205 350H265\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"234\" y=\"338\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 255V324\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"395\" y=\"291\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M110 400V539\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"157\" y=\"471\" text-anchor=\"middle\" class=\"flow-edge-label\">否：检查实物</text><path d=\"M380 376V410\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M480 460H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"525\" y=\"448\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 510V550\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"440\" y=\"532\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.20</text><path d=\"M280 600H205\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"239\" y=\"581\" text-anchor=\"middle\" class=\"flow-edge-label\">是：中间分数</text><path d=\"M380 650V697\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"441\" y=\"678\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.80</text><path d=\"M510 760H536\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"535\" y=\"745\" text-anchor=\"middle\" class=\"flow-edge-label\">返工</text><path d=\"M536 95H495\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"520\" y=\"81\" text-anchor=\"middle\" class=\"flow-edge-label\">重检</text><path d=\"M380 823V881\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"452\" y=\"860\" text-anchor=\"middle\" class=\"flow-edge-label\">放行／报废等结果</text><path d=\"M110 661V920H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"160\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M650 490V920H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"590\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M380 959V995\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M500 1050H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"531\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M260 1050H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1080V1133\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/></svg><div class=\"flow-box flow-terminal\" style=\"left:315.0px;top:11.0px;width:130px;height:34px\"><div class=\"flow-text\">开始</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:69.0px;width:230px;height:52px\"><div class=\"flow-text\">采集产品、批次与图像</div></div><div class=\"flow-box flow-decision\" style=\"left:265.0px;top:145.0px;width:230px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 230 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"115.0,1 229,55.0 115.0,109 1,55.0\"/></svg><div class=\"flow-text\">图像是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:156.0px;width:180px;height:88px\"><div class=\"flow-text\">原分数无效<br>补拍一次</div></div><div class=\"flow-box flow-decision\" style=\"left:15.0px;top:300.0px;width:190px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 190 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"95.0,1 189,50.0 95.0,99 1,50.0\"/></svg><div class=\"flow-text\">新图是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:324.0px;width:230px;height:52px\"><div class=\"flow-text\">视觉模型检测<br>取得新图的缺陷分数 s</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:410.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.20？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:430.0px;width:170px;height:60px\"><div class=\"flow-text\">自动放行</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:550.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.80？</div></div><div class=\"flow-box flow-process\" style=\"left:15.0px;top:539.0px;width:190px;height:122px\"><div class=\"flow-text\">质检员复核／检查实物<br>合格→放行；不合格→隔离<br>不确定→待检，交主管</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:697.0px;width:260px;height:126px\"><div class=\"flow-text\">自动隔离，质量人员处置<br>放行／返工／报废<br>返工完成→R，重新检测</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:741.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:76.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:881.0px;width:280px;height:78px\"><div class=\"flow-text\">记录处理结果与当前有效状态<br>关联原图、模型版本<br>人工改判：人员、理由、时间</div></div><div class=\"flow-box flow-decision\" style=\"left:260.0px;top:995.0px;width:240px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 240 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"120.0,1 239,55.0 120.0,109 1,55.0\"/></svg><div class=\"flow-text\">当前有效状态<br>是否已放行？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:1020.0px;width:170px;height:60px\"><div class=\"flow-text\">进入包装</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:1015.0px;width:180px;height:70px\"><div class=\"flow-text\">阻止进入包装<br>按当前状态继续处置</div></div><div class=\"flow-box flow-terminal\" style=\"left:585.0px;top:1133.0px;width:130px;height:34px\"><div class=\"flow-text\">结束</div></div></div></div>",
        "pathTables": [
          {
            "title": "P004、P005 的路径判定",
            "headers": [
              "产品",
              "数据",
              "按拟上线规则的路径"
            ],
            "rows": [
              [
                "P004",
                "图像模糊，分数0.04；试运行人工结论：实物有划伤、不合格。",
                "先检查图像质量：图像模糊→原分数0.04作废→补拍一次。补拍图像可用→按新图重新检测并按新分数分流；补拍仍不可用→质检员检查实物→按检查结论处置，不合格则隔离，无法判断则待检并交主管。不得用模糊图像的低分直接放行。"
              ],
              [
                "P005",
                "图像清晰，分数0.12（<0.20）；试运行人工结论：细小凹陷、不合格。",
                "图像可用且0.12<0.20→自动放行→进入包装（包装前核对当前有效状态）。这会造成错误放行，暴露模型或阈值对细小凹陷的漏检风险，需要在任务三验证改进。不能把事后人工结论当作分流前输入，改写成必然人工复核或隔离。"
              ]
            ]
          }
        ],
        "flowchart": {
          "html": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1190px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1190\" aria-hidden=\"true\"><defs><marker id=\"arrow-b11\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 45V69\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M380 121V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M265 200H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"188\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M110 244V300\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M205 350H265\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"234\" y=\"338\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 255V324\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"395\" y=\"291\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M110 400V539\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"157\" y=\"471\" text-anchor=\"middle\" class=\"flow-edge-label\">否：检查实物</text><path d=\"M380 376V410\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M480 460H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"525\" y=\"448\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 510V550\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"440\" y=\"532\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.20</text><path d=\"M280 600H205\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"239\" y=\"581\" text-anchor=\"middle\" class=\"flow-edge-label\">是：中间分数</text><path d=\"M380 650V697\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"441\" y=\"678\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.80</text><path d=\"M510 760H536\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"535\" y=\"745\" text-anchor=\"middle\" class=\"flow-edge-label\">返工</text><path d=\"M536 95H495\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"520\" y=\"81\" text-anchor=\"middle\" class=\"flow-edge-label\">重检</text><path d=\"M380 823V881\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"452\" y=\"860\" text-anchor=\"middle\" class=\"flow-edge-label\">放行／报废等结果</text><path d=\"M110 661V920H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"160\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M650 490V920H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"590\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M380 959V995\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M500 1050H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"531\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M260 1050H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1080V1133\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/></svg><div class=\"flow-box flow-terminal\" style=\"left:315.0px;top:11.0px;width:130px;height:34px\"><div class=\"flow-text\">开始</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:69.0px;width:230px;height:52px\"><div class=\"flow-text\">采集产品、批次与图像</div></div><div class=\"flow-box flow-decision\" style=\"left:265.0px;top:145.0px;width:230px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 230 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"115.0,1 229,55.0 115.0,109 1,55.0\"/></svg><div class=\"flow-text\">图像是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:156.0px;width:180px;height:88px\"><div class=\"flow-text\">原分数无效<br>{{0}}</div></div><div class=\"flow-box flow-decision\" style=\"left:15.0px;top:300.0px;width:190px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 190 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"95.0,1 189,50.0 95.0,99 1,50.0\"/></svg><div class=\"flow-text\">新图是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:324.0px;width:230px;height:52px\"><div class=\"flow-text\">视觉模型检测<br>取得新图的缺陷分数 s</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:410.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.20？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:430.0px;width:170px;height:60px\"><div class=\"flow-text\">{{1}}</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:550.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.80？</div></div><div class=\"flow-box flow-process\" style=\"left:15.0px;top:539.0px;width:190px;height:122px\"><div class=\"flow-text\">{{2}}<br>合格→放行；不合格→隔离<br>不确定→{{4}}</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:697.0px;width:260px;height:126px\"><div class=\"flow-text\">{{3}}<br>放行／返工／报废<br>返工完成→R，{{5}}</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:741.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:76.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:881.0px;width:280px;height:78px\"><div class=\"flow-text\">记录处理结果与当前有效状态<br>关联原图、模型版本<br>人工改判：人员、理由、时间</div></div><div class=\"flow-box flow-decision\" style=\"left:260.0px;top:995.0px;width:240px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 240 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"120.0,1 239,55.0 120.0,109 1,55.0\"/></svg><div class=\"flow-text\">当前有效状态<br>是否{{6}}？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:1020.0px;width:170px;height:60px\"><div class=\"flow-text\">进入包装</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:1015.0px;width:180px;height:70px\"><div class=\"flow-text\">阻止进入包装<br>按当前状态继续处置</div></div><div class=\"flow-box flow-terminal\" style=\"left:585.0px;top:1133.0px;width:130px;height:34px\"><div class=\"flow-text\">结束</div></div></div></div>",
          "slots": [
            {
              "answer": "补拍一次",
              "choices": [
                "补拍一次",
                "重复使用原分数",
                "默认合格"
              ],
              "why": "题设只允许先补拍一次，再依新图质量决定后续。",
              "accepted": [],
              "matchRule": {
                "aliases": [
                  "重新拍摄一次",
                  "重拍一次",
                  "补拍1次",
                  "再拍一次",
                  "重新拍照一次",
                  "重拍1次"
                ]
              }
            },
            {
              "answer": "自动放行",
              "choices": [
                "自动放行",
                "人工复核",
                "自动报废"
              ],
              "why": "只在图像可用且小于 0.20 时自动放行。",
              "accepted": [],
              "matchRule": {
                "aliases": [
                  "自动判定放行",
                  "直接放行",
                  "自动通过",
                  "系统放行"
                ]
              }
            },
            {
              "answer": "人工复核",
              "choices": [
                "人工复核",
                "自动放行",
                "直接报废"
              ],
              "why": "0.20 属于复核区间，0.80 不属于复核区间。",
              "accepted": [],
              "matchRule": {
                "aliases": [
                  "人工复检",
                  "转人工审核",
                  "由质检人员复核",
                  "人工检查",
                  "人工核验"
                ]
              }
            },
            {
              "answer": "自动隔离待处理",
              "choices": [
                "自动隔离待处理",
                "直接报废",
                "自动放行"
              ],
              "why": "0.80 起隔离，但隔离不等于报废。",
              "accepted": [],
              "matchRule": {
                "groups": [
                  [
                    "隔离"
                  ],
                  [
                    "待处理",
                    "等待",
                    "待处置",
                    "交质量人员",
                    "人工处理",
                    "等待裁定"
                  ]
                ],
                "aliases": [
                  "自动隔离",
                  "隔离后由质量人员处置"
                ]
              }
            },
            {
              "answer": "保持待检并交质量主管",
              "choices": [
                "保持待检并交质量主管",
                "默认合格",
                "直接报废"
              ],
              "why": "不确定不能自动当作合格。",
              "accepted": [],
              "matchRule": {
                "groups": [
                  [
                    "待检",
                    "暂停放行",
                    "暂不放行",
                    "待判断"
                  ],
                  [
                    "质量主管",
                    "主管",
                    "上级"
                  ]
                ]
              }
            },
            {
              "answer": "重新进入检测流程",
              "choices": [
                "重新进入检测流程",
                "直接送包装",
                "沿用返工前分数"
              ],
              "why": "返工后需重检，建立关联记录。",
              "accepted": [],
              "matchRule": {
                "aliases": [
                  "重新检测",
                  "重新检验",
                  "返工后复检",
                  "重检",
                  "再检测",
                  "重新进入质检流程"
                ]
              }
            },
            {
              "answer": "当前有效状态为已放行",
              "choices": [
                "当前有效状态为已放行",
                "曾经被放行过",
                "分数低但图像不可用"
              ],
              "why": "状态联锁确保新隔离结论不会被旧状态绕过。",
              "accepted": [],
              "matchRule": {
                "groups": [
                  [
                    "当前",
                    "最新",
                    "有效"
                  ],
                  [
                    "已放行",
                    "放行状态"
                  ]
                ]
              }
            }
          ]
        }
      },
      {
        "id": "b11t3",
        "title": "设计验证与改进方案",
        "promptHTML": "<ol><li>针对 P005 的漏检和 P006 的误判，各提出一项具体改进措施，说明如何判断措施是否有效。</li><li>给出两个能够衡量新流程效果的指标，写清统计口径。</li></ol>",
        "answerHTML": "<table><caption>针对漏检与误判的改进及验证</caption><thead><tr><th>问题</th><th>具体改进措施</th><th>有效性验证方法</th></tr></thead><tbody><tr><td>P005 漏检：细小凹陷得0.12分被放行</td><td>补充不同角度、光照和批次的细小凹陷正样本，统一标注后微调模型。阈值在验证集选择，权衡漏检下降与人工复核量增加，避免只记住P005。</td><td>使用保留的独立凹陷测试集，对比改进前后缺陷召回率、漏检率；试运行按相同抽检标准验证实际漏放风险。</td></tr><tr><td>P006 误判：合格反光件得0.86分被隔离</td><td>采集合格反光困难负样本，由质检确认标签并回流训练；结合受控光源、偏振采集改善反光。</td><td>在独立合格反光测试集上比较误隔离率，同时确认真实缺陷召回率没有明显下降。</td></tr></tbody></table><table><caption>衡量新流程效果的两个指标</caption><thead><tr><th>指标</th><th>统计口径</th><th>意义与统计要求</th></tr></thead><tbody><tr><td>自动放行漏放率</td><td>经独立抽检确认实际不合格的自动放行件数 ÷ 被抽检的自动放行件数</td><td>衡量P005类错误放行风险；按预定随机或分层抽检，报告抽检量、批次和置信区间。</td></tr><tr><td>隔离误隔离率</td><td>质量人员最终确认合格的自动隔离件数 ÷ 已完成最终裁定的自动隔离件数</td><td>衡量P006类误隔离；固定周期与模型版本统计，未裁定件单列，上线前后保持裁定标准一致。</td></tr></tbody></table>",
        "reviewTables": [
          {
            "title": "针对漏检与误判的改进及验证",
            "headers": [
              "问题",
              "具体改进措施",
              "有效性验证方法"
            ],
            "rows": [
              [
                "P005 漏检：细小凹陷得0.12分被放行",
                "补充不同角度、光照和批次的细小凹陷正样本，统一标注后微调模型。阈值在验证集选择，权衡漏检下降与人工复核量增加，避免只记住P005。",
                "使用保留的独立凹陷测试集，对比改进前后缺陷召回率、漏检率；试运行按相同抽检标准验证实际漏放风险。"
              ],
              [
                "P006 误判：合格反光件得0.86分被隔离",
                "采集合格反光困难负样本，由质检确认标签并回流训练；结合受控光源、偏振采集改善反光。",
                "在独立合格反光测试集上比较误隔离率，同时确认真实缺陷召回率没有明显下降。"
              ]
            ]
          },
          {
            "title": "衡量新流程效果的两个指标",
            "headers": [
              "指标",
              "统计口径",
              "意义与统计要求"
            ],
            "rows": [
              [
                "自动放行漏放率",
                "经独立抽检确认实际不合格的自动放行件数 ÷ 被抽检的自动放行件数",
                "衡量P005类错误放行风险；按预定随机或分层抽检，报告抽检量、批次和置信区间。"
              ],
              [
                "隔离误隔离率",
                "质量人员最终确认合格的自动隔离件数 ÷ 已完成最终裁定的自动隔离件数",
                "衡量P006类误隔离；固定周期与模型版本统计，未裁定件单列，上线前后保持裁定标准一致。"
              ]
            ]
          }
        ]
      }
    ],
    "steps": [
      {
        "id": "b11-1",
        "title": "搭建四个业务模块",
        "goal": "连接生产现场、视觉模型、质检人员和包装环节，明确各模块职责。",
        "code": "四个模块：\n① {{}}\n② 视觉模型推理与分流模块\n③ {{}}\n④ {{}}",
        "solution": "四个模块：\n① 图像采集与质量检查模块\n② 视觉模型推理与分流模块\n③ 人工复核与质量处置模块\n④ 状态记录与追溯模块",
        "slots": [
          {
            "answer": "图像采集与质量检查模块",
            "choices": [
              "图像采集与质量检查模块",
              "直接放行",
              "先执行模型再判断图像"
            ],
            "why": "图像质量检查必须先于模型分数分流。",
            "accepted": [
              "现场采集与图像质量校验"
            ],
            "matchRule": {
              "groups": [
                [
                  "采集",
                  "拍摄",
                  "收集",
                  "获取"
                ],
                [
                  "图像",
                  "图片",
                  "影像"
                ],
                [
                  "质量",
                  "检查",
                  "校验",
                  "清晰度",
                  "有效性"
                ]
              ],
              "aliases": [
                "图像采集与检查",
                "现场采集和图像校验"
              ]
            }
          },
          {
            "answer": "人工复核与质量处置模块",
            "choices": [
              "人工复核与质量处置模块",
              "高分直接报废",
              "删除不确定记录"
            ],
            "why": "质检员作出裁定，质量人员决定隔离品后续处置。",
            "accepted": [
              "人工复核与隔离处置"
            ],
            "matchRule": {
              "groups": [
                [
                  "人工",
                  "质检",
                  "检验人员",
                  "质量人员"
                ],
                [
                  "复核",
                  "复检",
                  "检查"
                ],
                [
                  "隔离",
                  "处置",
                  "处理"
                ]
              ]
            }
          },
          {
            "answer": "状态记录与追溯模块",
            "choices": [
              "状态记录与追溯模块",
              "仅保存纸质结果",
              "包装前不读状态"
            ],
            "why": "包装入口需要核对当前有效状态，检测与人工改判全程留痕。",
            "accepted": [
              "状态追溯与包装联锁"
            ],
            "matchRule": {
              "groups": [
                [
                  "状态",
                  "追溯",
                  "记录"
                ],
                [
                  "包装"
                ],
                [
                  "联锁",
                  "校验",
                  "核验",
                  "检查",
                  "控制",
                  "放行"
                ]
              ]
            }
          }
        ],
        "hint": "先采集校验，再分流、人工处理，最后由状态控制包装。",
        "context": "",
        "taskIndex": 0,
        "examComments": "原题任务：业务框架设计"
      },
      {
        "id": "b11-2",
        "title": "人机边界与追溯记录",
        "goal": "明确谁执行规则、谁作最终裁定，以及输入输出记录的关联方式。",
        "code": "系统负责规则执行、分派与留痕；\n人工复核的裁定权属于 {{}}。\n输入：工位／相机 → 系统，记录产品、批次和图像。\n输出：系统 → 包装，发送产品编号、{{}} 和状态版本。\n人工改判记录：{{}}。\n检测任务名称：{{}}\n模型结果方向：{{}}\n推理记录关联字段：{{}}\n质量处置记录名称：{{}}\n返工后续：{{}}\n改进样本错误标记：{{}}",
        "solution": "系统负责规则执行、分派与留痕；\n人工复核的裁定权属于 质检员。\n输入：工位／相机 → 系统，记录产品、批次和图像。\n输出：系统 → 包装，发送产品编号、当前有效状态 和状态版本。\n人工改判记录：人员、理由及时间。\n检测任务名称：检测任务记录\n模型结果方向：视觉模型 → 系统\n推理记录关联字段：产品编号\n质量处置记录名称：质量处置记录\n返工后续：返工完成后生成新检测任务回流\n改进样本错误标记：错误类型（漏检/误判）",
        "slots": [
          {
            "answer": "质检员",
            "choices": [
              "质检员",
              "视觉模型",
              "包装设备"
            ],
            "why": "模型分数不能替代人工裁定；不确定时交质量主管。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "质检人员",
                "质量检查人员",
                "检验员",
                "人工质检",
                "质量检验人员"
              ]
            }
          },
          {
            "answer": "当前有效状态",
            "choices": [
              "当前有效状态",
              "历史任意一次放行状态",
              "模型分数即最终结论"
            ],
            "why": "防止旧放行状态覆盖后来的隔离结果。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "当前",
                  "最新",
                  "现行"
                ],
                [
                  "有效",
                  "状态"
                ]
              ]
            }
          },
          {
            "answer": "人员、理由及时间",
            "choices": [
              "人员、理由及时间",
              "只记录最终分数",
              "只保留操作员姓名"
            ],
            "why": "改判需说明责任人、原因与发生时间，并关联原图和模型版本。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "人员",
                  "操作人",
                  "责任人",
                  "经办人",
                  "谁"
                ],
                [
                  "理由",
                  "原因",
                  "依据"
                ],
                [
                  "时间",
                  "时刻",
                  "何时"
                ]
              ]
            }
          },
          {
            "answer": "检测任务记录",
            "choices": [
              "检测任务记录",
              "模型改进样本记录",
              "产品状态记录"
            ],
            "why": "生产现场输入检测任务，关联产品和采集图像。",
            "accepted": [],
            "matchRule": {}
          },
          {
            "answer": "视觉模型 → 系统",
            "choices": [
              "视觉模型 → 系统",
              "系统 → 视觉模型",
              "系统 → 包装环节"
            ],
            "why": "推理结果由视觉模型输入系统。",
            "accepted": [
              "视觉模型到系统",
              "视觉模型→系统"
            ],
            "matchRule": {}
          },
          {
            "answer": "产品编号",
            "choices": [
              "产品编号",
              "客户姓名",
              "订单金额"
            ],
            "why": "用同一产品编号关联检测、推理与复核。",
            "accepted": [
              "产品ID",
              "product_id"
            ],
            "matchRule": {}
          },
          {
            "answer": "质量处置记录",
            "choices": [
              "质量处置记录",
              "模型推理结果",
              "检测任务记录"
            ],
            "why": "质量处置记录面向质量人员与返工线。",
            "accepted": [],
            "matchRule": {}
          },
          {
            "answer": "返工完成后生成新检测任务回流",
            "choices": [
              "返工完成后生成新检测任务回流",
              "返工完成后直接包装",
              "返工后删除原记录"
            ],
            "why": "返工后应重新进入检测流程，不能直接放行。",
            "accepted": [
              "返工后重新检测",
              "返工完成后重新检测"
            ],
            "matchRule": {}
          },
          {
            "answer": "错误类型（漏检/误判）",
            "choices": [
              "错误类型（漏检/误判）",
              "客户满意度",
              "只保留图像大小"
            ],
            "why": "训练样本应标明漏检或误判，支持针对性改进。",
            "accepted": [
              "错误类型",
              "漏检或误判",
              "漏检/误判"
            ],
            "matchRule": {}
          }
        ],
        "hint": "同一产品编号串联图像、模型、人工、状态和包装记录。",
        "context": "",
        "taskIndex": 0,
        "examComments": "原题任务：业务框架设计"
      },
      {
        "id": "b11-3",
        "title": "图像不可用的处理",
        "goal": "图像模糊、严重反光或主体不完整时，原分数不能用于分流。",
        "code": "原分数无效 → {{}} → 仍不可用则 {{}}。",
        "solution": "原分数无效 → 补拍一次 → 仍不可用则 质检员检查实物。",
        "slots": [
          {
            "answer": "补拍一次",
            "choices": [
              "补拍一次",
              "重复使用原分数",
              "默认合格"
            ],
            "why": "题设只允许先补拍一次，再依新图质量决定后续。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "重新拍摄一次",
                "重拍一次",
                "补拍1次",
                "再拍一次",
                "重新拍照一次",
                "重拍1次"
              ]
            }
          },
          {
            "answer": "质检员检查实物",
            "choices": [
              "质检员检查实物",
              "直接包装",
              "自动报废"
            ],
            "why": "补拍后仍不可用不得自动放行，转人工检查。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "质检",
                  "检验员",
                  "人工",
                  "质量人员"
                ],
                [
                  "实物",
                  "产品实物"
                ],
                [
                  "检查",
                  "检测",
                  "复核",
                  "查验"
                ]
              ]
            }
          }
        ],
        "hint": "图像质量优先于分数。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：业务流程与处置规则设计",
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1190px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1190\" aria-hidden=\"true\"><defs><marker id=\"arrow-b11\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 45V69\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M380 121V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M265 200H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"188\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M110 244V300\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M205 350H265\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"234\" y=\"338\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 255V324\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"395\" y=\"291\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M110 400V539\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"157\" y=\"471\" text-anchor=\"middle\" class=\"flow-edge-label\">否：检查实物</text><path d=\"M380 376V410\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M480 460H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"525\" y=\"448\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 510V550\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"440\" y=\"532\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.20</text><path d=\"M280 600H205\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"239\" y=\"581\" text-anchor=\"middle\" class=\"flow-edge-label\">是：中间分数</text><path d=\"M380 650V697\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"441\" y=\"678\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.80</text><path d=\"M510 760H536\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"535\" y=\"745\" text-anchor=\"middle\" class=\"flow-edge-label\">返工</text><path d=\"M536 95H495\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"520\" y=\"81\" text-anchor=\"middle\" class=\"flow-edge-label\">重检</text><path d=\"M380 823V881\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"452\" y=\"860\" text-anchor=\"middle\" class=\"flow-edge-label\">放行／报废等结果</text><path d=\"M110 661V920H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"160\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M650 490V920H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"590\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M380 959V995\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M500 1050H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"531\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M260 1050H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1080V1133\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/></svg><div class=\"flow-box flow-terminal\" style=\"left:315.0px;top:11.0px;width:130px;height:34px\"><div class=\"flow-text\">开始</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:69.0px;width:230px;height:52px\"><div class=\"flow-text\">采集产品、批次与图像</div></div><div class=\"flow-box flow-decision\" style=\"left:265.0px;top:145.0px;width:230px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 230 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"115.0,1 229,55.0 115.0,109 1,55.0\"/></svg><div class=\"flow-text\">图像是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:156.0px;width:180px;height:88px\"><div class=\"flow-text\">原分数无效<br>{{0}}</div></div><div class=\"flow-box flow-decision\" style=\"left:15.0px;top:300.0px;width:190px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 190 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"95.0,1 189,50.0 95.0,99 1,50.0\"/></svg><div class=\"flow-text\">新图是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:324.0px;width:230px;height:52px\"><div class=\"flow-text\">视觉模型检测<br>取得新图的缺陷分数 s</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:410.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.20？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:430.0px;width:170px;height:60px\"><div class=\"flow-text\">自动放行</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:550.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.80？</div></div><div class=\"flow-box flow-process\" style=\"left:15.0px;top:539.0px;width:190px;height:122px\"><div class=\"flow-text\">人工复核／{{1}}<br>合格→放行；不合格→隔离<br>不确定→待检，交主管</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:697.0px;width:260px;height:126px\"><div class=\"flow-text\">自动隔离，质量人员处置<br>放行／返工／报废<br>返工完成→R，重新检测</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:741.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:76.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:881.0px;width:280px;height:78px\"><div class=\"flow-text\">记录处理结果与当前有效状态<br>关联原图、模型版本<br>人工改判：人员、理由、时间</div></div><div class=\"flow-box flow-decision\" style=\"left:260.0px;top:995.0px;width:240px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 240 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"120.0,1 239,55.0 120.0,109 1,55.0\"/></svg><div class=\"flow-text\">当前有效状态<br>是否已放行？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:1020.0px;width:170px;height:60px\"><div class=\"flow-text\">进入包装</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:1015.0px;width:180px;height:70px\"><div class=\"flow-text\">阻止进入包装<br>按当前状态继续处置</div></div><div class=\"flow-box flow-terminal\" style=\"left:585.0px;top:1133.0px;width:130px;height:34px\"><div class=\"flow-text\">结束</div></div></div></div>"
      },
      {
        "id": "b11-4",
        "title": "记住两个分流边界",
        "goal": "图像可用时，按试行规则精确处理 0.20 和 0.80 的边界。",
        "code": "分数 < 0.20：{{}}\n0.20 ≤ 分数 < 0.80：{{}}\n分数 ≥ 0.80：{{}}",
        "solution": "分数 < 0.20：自动放行\n0.20 ≤ 分数 < 0.80：人工复核\n分数 ≥ 0.80：自动隔离待处理",
        "slots": [
          {
            "answer": "自动放行",
            "choices": [
              "自动放行",
              "人工复核",
              "自动报废"
            ],
            "why": "只在图像可用且小于 0.20 时自动放行。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "自动判定放行",
                "直接放行",
                "自动通过",
                "系统放行"
              ]
            }
          },
          {
            "answer": "人工复核",
            "choices": [
              "人工复核",
              "自动放行",
              "直接报废"
            ],
            "why": "0.20 属于复核区间，0.80 不属于复核区间。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "人工复检",
                "转人工审核",
                "由质检人员复核",
                "人工检查",
                "人工核验"
              ]
            }
          },
          {
            "answer": "自动隔离待处理",
            "choices": [
              "自动隔离待处理",
              "直接报废",
              "自动放行"
            ],
            "why": "0.80 起隔离，但隔离不等于报废。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "隔离"
                ],
                [
                  "待处理",
                  "等待",
                  "待处置",
                  "交质量人员",
                  "人工处理",
                  "等待裁定"
                ]
              ],
              "aliases": [
                "自动隔离",
                "隔离后由质量人员处置"
              ]
            }
          }
        ],
        "hint": "低分放行，中间复核，高分隔离。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：业务流程与处置规则设计",
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1190px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1190\" aria-hidden=\"true\"><defs><marker id=\"arrow-b11\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 45V69\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M380 121V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M265 200H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"188\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M110 244V300\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M205 350H265\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"234\" y=\"338\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 255V324\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"395\" y=\"291\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M110 400V539\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"157\" y=\"471\" text-anchor=\"middle\" class=\"flow-edge-label\">否：检查实物</text><path d=\"M380 376V410\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M480 460H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"525\" y=\"448\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 510V550\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"440\" y=\"532\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.20</text><path d=\"M280 600H205\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"239\" y=\"581\" text-anchor=\"middle\" class=\"flow-edge-label\">是：中间分数</text><path d=\"M380 650V697\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"441\" y=\"678\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.80</text><path d=\"M510 760H536\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"535\" y=\"745\" text-anchor=\"middle\" class=\"flow-edge-label\">返工</text><path d=\"M536 95H495\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"520\" y=\"81\" text-anchor=\"middle\" class=\"flow-edge-label\">重检</text><path d=\"M380 823V881\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"452\" y=\"860\" text-anchor=\"middle\" class=\"flow-edge-label\">放行／报废等结果</text><path d=\"M110 661V920H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"160\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M650 490V920H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"590\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M380 959V995\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M500 1050H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"531\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M260 1050H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1080V1133\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/></svg><div class=\"flow-box flow-terminal\" style=\"left:315.0px;top:11.0px;width:130px;height:34px\"><div class=\"flow-text\">开始</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:69.0px;width:230px;height:52px\"><div class=\"flow-text\">采集产品、批次与图像</div></div><div class=\"flow-box flow-decision\" style=\"left:265.0px;top:145.0px;width:230px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 230 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"115.0,1 229,55.0 115.0,109 1,55.0\"/></svg><div class=\"flow-text\">图像是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:156.0px;width:180px;height:88px\"><div class=\"flow-text\">原分数无效<br>补拍一次</div></div><div class=\"flow-box flow-decision\" style=\"left:15.0px;top:300.0px;width:190px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 190 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"95.0,1 189,50.0 95.0,99 1,50.0\"/></svg><div class=\"flow-text\">新图是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:324.0px;width:230px;height:52px\"><div class=\"flow-text\">视觉模型检测<br>取得新图的缺陷分数 s</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:410.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.20？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:430.0px;width:170px;height:60px\"><div class=\"flow-text\">{{0}}</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:550.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.80？</div></div><div class=\"flow-box flow-process\" style=\"left:15.0px;top:539.0px;width:190px;height:122px\"><div class=\"flow-text\">{{1}}／检查实物<br>合格→放行；不合格→隔离<br>不确定→待检，交主管</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:697.0px;width:260px;height:126px\"><div class=\"flow-text\">{{2}}，质量人员处置<br>放行／返工／报废<br>返工完成→R，重新检测</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:741.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:76.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:881.0px;width:280px;height:78px\"><div class=\"flow-text\">记录处理结果与当前有效状态<br>关联原图、模型版本<br>人工改判：人员、理由、时间</div></div><div class=\"flow-box flow-decision\" style=\"left:260.0px;top:995.0px;width:240px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 240 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"120.0,1 239,55.0 120.0,109 1,55.0\"/></svg><div class=\"flow-text\">当前有效状态<br>是否已放行？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:1020.0px;width:170px;height:60px\"><div class=\"flow-text\">进入包装</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:1015.0px;width:180px;height:70px\"><div class=\"flow-text\">阻止进入包装<br>按当前状态继续处置</div></div><div class=\"flow-box flow-terminal\" style=\"left:585.0px;top:1133.0px;width:130px;height:34px\"><div class=\"flow-text\">结束</div></div></div></div>"
      },
      {
        "id": "b11-5",
        "title": "人工处置与流程闭环",
        "goal": "人工不确定和返工品不能默认流入包装。",
        "code": "人工无法判断 → {{}}。\n隔离后由质量人员决定放行、返工或报废。\n返工完成 → {{}}。\n包装前只允许 {{}} 的产品进入。",
        "solution": "人工无法判断 → 保持待检并交质量主管。\n隔离后由质量人员决定放行、返工或报废。\n返工完成 → 重新进入检测流程。\n包装前只允许 当前有效状态为已放行 的产品进入。",
        "slots": [
          {
            "answer": "保持待检并交质量主管",
            "choices": [
              "保持待检并交质量主管",
              "默认合格",
              "直接报废"
            ],
            "why": "不确定不能自动当作合格。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "待检",
                  "暂停放行",
                  "暂不放行",
                  "待判断"
                ],
                [
                  "质量主管",
                  "主管",
                  "上级"
                ]
              ]
            }
          },
          {
            "answer": "重新进入检测流程",
            "choices": [
              "重新进入检测流程",
              "直接送包装",
              "沿用返工前分数"
            ],
            "why": "返工后需重检，建立关联记录。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "重新检测",
                "重新检验",
                "返工后复检",
                "重检",
                "再检测",
                "重新进入质检流程"
              ]
            }
          },
          {
            "answer": "当前有效状态为已放行",
            "choices": [
              "当前有效状态为已放行",
              "曾经被放行过",
              "分数低但图像不可用"
            ],
            "why": "状态联锁确保新隔离结论不会被旧状态绕过。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "当前",
                  "最新",
                  "有效"
                ],
                [
                  "已放行",
                  "放行状态"
                ]
              ]
            }
          }
        ],
        "hint": "流程图必须包含人工分支、返工回路和结果记录。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：业务流程与处置规则设计",
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1190px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1190\" aria-hidden=\"true\"><defs><marker id=\"arrow-b11\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 45V69\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M380 121V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M265 200H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"188\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M110 244V300\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M205 350H265\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"234\" y=\"338\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 255V324\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"395\" y=\"291\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M110 400V539\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"157\" y=\"471\" text-anchor=\"middle\" class=\"flow-edge-label\">否：检查实物</text><path d=\"M380 376V410\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M480 460H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"525\" y=\"448\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 510V550\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"440\" y=\"532\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.20</text><path d=\"M280 600H205\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"239\" y=\"581\" text-anchor=\"middle\" class=\"flow-edge-label\">是：中间分数</text><path d=\"M380 650V697\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"441\" y=\"678\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.80</text><path d=\"M510 760H536\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"535\" y=\"745\" text-anchor=\"middle\" class=\"flow-edge-label\">返工</text><path d=\"M536 95H495\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"520\" y=\"81\" text-anchor=\"middle\" class=\"flow-edge-label\">重检</text><path d=\"M380 823V881\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"452\" y=\"860\" text-anchor=\"middle\" class=\"flow-edge-label\">放行／报废等结果</text><path d=\"M110 661V920H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"160\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M650 490V920H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"590\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M380 959V995\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M500 1050H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"531\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M260 1050H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1080V1133\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/></svg><div class=\"flow-box flow-terminal\" style=\"left:315.0px;top:11.0px;width:130px;height:34px\"><div class=\"flow-text\">开始</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:69.0px;width:230px;height:52px\"><div class=\"flow-text\">采集产品、批次与图像</div></div><div class=\"flow-box flow-decision\" style=\"left:265.0px;top:145.0px;width:230px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 230 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"115.0,1 229,55.0 115.0,109 1,55.0\"/></svg><div class=\"flow-text\">图像是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:156.0px;width:180px;height:88px\"><div class=\"flow-text\">原分数无效<br>补拍一次</div></div><div class=\"flow-box flow-decision\" style=\"left:15.0px;top:300.0px;width:190px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 190 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"95.0,1 189,50.0 95.0,99 1,50.0\"/></svg><div class=\"flow-text\">新图是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:324.0px;width:230px;height:52px\"><div class=\"flow-text\">视觉模型检测<br>取得新图的缺陷分数 s</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:410.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.20？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:430.0px;width:170px;height:60px\"><div class=\"flow-text\">自动放行</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:550.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.80？</div></div><div class=\"flow-box flow-process\" style=\"left:15.0px;top:539.0px;width:190px;height:122px\"><div class=\"flow-text\">质检员复核／检查实物<br>合格→放行；不合格→隔离<br>不确定→{{0}}</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:697.0px;width:260px;height:126px\"><div class=\"flow-text\">自动隔离，质量人员处置<br>放行／返工／报废<br>返工完成→R，{{1}}</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:741.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:76.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:881.0px;width:280px;height:78px\"><div class=\"flow-text\">记录处理结果与当前有效状态<br>关联原图、模型版本<br>人工改判：人员、理由、时间</div></div><div class=\"flow-box flow-decision\" style=\"left:260.0px;top:995.0px;width:240px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 240 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"120.0,1 239,55.0 120.0,109 1,55.0\"/></svg><div class=\"flow-text\">当前有效状态<br>是否{{2}}？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:1020.0px;width:170px;height:60px\"><div class=\"flow-text\">进入包装</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:1015.0px;width:180px;height:70px\"><div class=\"flow-text\">阻止进入包装<br>按当前状态继续处置</div></div><div class=\"flow-box flow-terminal\" style=\"left:585.0px;top:1133.0px;width:130px;height:34px\"><div class=\"flow-text\">结束</div></div></div></div>"
      },
      {
        "id": "b11-6",
        "title": "判断 P004 与 P005 的真实路径",
        "goal": "P004 图像模糊、分数 0.04；P005 图像清晰、分数 0.12。只能使用分流时已知的信息。",
        "code": "P004 首先 {{}}。\nP005 按拟上线规则会 {{}}，暴露出细小凹陷的漏放风险。",
        "solution": "P004 首先 补拍一次。\nP005 按拟上线规则会 自动放行，暴露出细小凹陷的漏放风险。",
        "slots": [
          {
            "answer": "补拍一次",
            "choices": [
              "补拍一次",
              "依据 0.04 自动放行",
              "直接引用试运行人工结论"
            ],
            "why": "模糊图像使原分数失效；后续由补拍结果决定。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "重新拍摄一次",
                "重拍一次",
                "补拍1次",
                "再拍一次",
                "重新拍照一次",
                "重拍1次"
              ]
            }
          },
          {
            "answer": "自动放行",
            "choices": [
              "自动放行",
              "必然人工复核",
              "自动隔离"
            ],
            "why": "图像清晰且 0.12 小于 0.20，不能事后把人工真值当作系统输入。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "自动判定放行",
                "直接放行",
                "自动通过",
                "系统放行"
              ]
            }
          }
        ],
        "hint": "区分“按规则走哪条路径”和“事后知道实际是否合格”。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：业务流程与处置规则设计"
      },
      {
        "id": "b11-7",
        "title": "针对漏检和误判改进",
        "goal": "分别处理 P005 的细小凹陷漏检，以及 P006 的合格反光误判。",
        "code": "P005：补充细小凹陷正样本，用 {{}} 检查漏检变化。\nP006：增加已核实的 {{}}，并改善光照采集。\n所有措施都需在独立数据上对比，兼顾缺陷召回率。",
        "solution": "P005：补充细小凹陷正样本，用 独立凹陷测试集 检查漏检变化。\nP006：增加已核实的 合格反光困难负样本，并改善光照采集。\n所有措施都需在独立数据上对比，兼顾缺陷召回率。",
        "slots": [
          {
            "answer": "独立凹陷测试集",
            "choices": [
              "独立凹陷测试集",
              "P005 单个样本",
              "训练集准确率"
            ],
            "why": "避免只记住个例，独立数据用于验证泛化。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "独立",
                  "未参与训练",
                  "留出"
                ],
                [
                  "凹陷",
                  "缺陷"
                ],
                [
                  "测试",
                  "评估",
                  "验证"
                ]
              ]
            }
          },
          {
            "answer": "合格反光困难负样本",
            "choices": [
              "合格反光困难负样本",
              "随机错误标签",
              "仅增加正常无反光样本"
            ],
            "why": "困难负样本帮助减少反光误判，验证误隔离率及召回率。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "合格",
                  "正常",
                  "无缺陷"
                ],
                [
                  "反光"
                ],
                [
                  "负样本",
                  "样本",
                  "数据"
                ]
              ]
            }
          }
        ],
        "hint": "漏检补正样本；误判补经核验的困难负样本。",
        "context": "",
        "taskIndex": 2,
        "examComments": "原题任务：设计验证与改进方案"
      },
      {
        "id": "b11-8",
        "title": "写清流程指标的分母",
        "goal": "分别衡量自动放行与自动隔离的错误，避免混淆分母。",
        "code": "自动放行漏放率 = 抽检中实际不合格的自动放行件数 ÷ {{}}。\n隔离误隔离率 = 最终确认合格的自动隔离件数 ÷ {{}}。",
        "solution": "自动放行漏放率 = 抽检中实际不合格的自动放行件数 ÷ 被抽检的自动放行件数。\n隔离误隔离率 = 最终确认合格的自动隔离件数 ÷ 已完成最终裁定的自动隔离件数。",
        "slots": [
          {
            "answer": "被抽检的自动放行件数",
            "choices": [
              "被抽检的自动放行件数",
              "全部生产件数",
              "所有隔离件数"
            ],
            "why": "采用预定抽样，报告样本量与统计周期，不以未检查总体直接作分母。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "抽检",
                  "抽样检查"
                ],
                [
                  "自动放行",
                  "放行产品",
                  "放行件"
                ],
                [
                  "件数",
                  "数量",
                  "总数"
                ]
              ]
            }
          },
          {
            "answer": "已完成最终裁定的自动隔离件数",
            "choices": [
              "已完成最终裁定的自动隔离件数",
              "全部放行件数",
              "未裁定件数"
            ],
            "why": "未裁定件单列，不能默认判合格或混入已裁定统计。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "已裁定",
                  "完成裁定",
                  "最终裁定",
                  "已判定"
                ],
                [
                  "隔离"
                ],
                [
                  "件数",
                  "数量",
                  "总数"
                ]
              ]
            }
          }
        ],
        "hint": "一个统计抽检的放行件，一个统计已裁定的隔离件。",
        "context": "",
        "taskIndex": 2,
        "examComments": "原题任务：设计验证与改进方案"
      }
    ],
    "count": 8,
    "originalCode": "业务框架设计\n\n业务流程与处置规则设计\n\n设计验证与改进方案",
    "referenceCode": "",
    "downloadPath": "materials/b11-reference.html",
    "referenceHTML": "<h1>B1-1 · 产品外观智能质检业务框架与流程设计</h1><p>参考解法（整理版），不代表唯一表述或官方评分细则。</p><h4>业务背景</h4>\n<p>某制造企业生产小家电塑料外壳，需要在包装前检查划伤、凹陷等外观缺陷。现有流程为：操作员取件检查外观，在纸质表单中记录结果，合格品进入包装，不合格品放入周转箱，再由质量人员决定返工或报废。企业已试运行视觉检测模型。模型根据产品图像输出 0～1 的“缺陷分数”，分数越高表示模型越倾向于认为存在缺陷。缺陷分数不是已经验证的实际缺陷概率，也不能替代最终质量结论。企业准备将模型接入业务流程，但存在以下问题：</p>\n<ol><li>部分图像模糊或反光，模型仍会输出分数，直接使用可能导致错误放行。</li><li>浅色划伤、细小凹陷容易漏检，反光或正常纹理容易被误判为缺陷。</li><li>模型不确定时由谁检查、检查后如何流转尚未明确；已判定不合格的产品也可能因记录不同步而进入包装。</li><li>人工纠正结果只记在纸上，无法与原始图像、模型版本关联，也没有形成稳定的模型改进流程。</li></ol>\n<h4>试运行记录</h4>\n<p>下表中的人工结论来自试运行阶段的逐件复核，仅用于分析模型错误。正式自动处理时，人工结论不是预先可用的输入。</p>\n<div><table><thead><tr><th>产品编号</th><th>批次</th><th>图像质量</th><th>模型缺陷分数</th><th>人工最终结论</th><th>人工说明</th></tr></thead><tbody><tr><td>P001</td><td>B01</td><td>清晰</td><td>0.08</td><td>合格</td><td>无明显缺陷</td></tr><tr><td>P002</td><td>B01</td><td>清晰</td><td>0.92</td><td>不合格</td><td>明显划伤</td></tr><tr><td>P003</td><td>B01</td><td>清晰</td><td>0.55</td><td>合格</td><td>正常纹理被模型关注</td></tr><tr><td>P004</td><td>B02</td><td>模糊</td><td>0.04</td><td>不合格</td><td>检查实物后发现划伤</td></tr><tr><td>P005</td><td>B02</td><td>清晰</td><td>0.12</td><td>不合格</td><td>细小凹陷漏检</td></tr><tr><td>P006</td><td>B02</td><td>清晰</td><td>0.86</td><td>合格</td><td>反光被误判为缺陷</td></tr></tbody></table></div>\n<h4>业务规则</h4>\n<p>以下为企业拟采用的试行规则：</p>\n<ol><li>先检查图像质量。模糊、严重反光或主体不完整时，原分数无效，先补拍一次。补拍后仍不可用，转质检员检查实物，不得自动放行。</li><li>图像可用时按分数分流。缺陷分数小于 0.20，自动放行；大于或等于 0.20 且小于 0.80，转人工复核；大于或等于 0.80，自动隔离待质量人员处理。</li><li>人工复核具有裁定权。人工确认合格可放行，确认不合格应隔离；暂时无法判断的产品保持待检状态，由质量主管继续处理，不得默认合格。</li><li>隔离不等于报废。隔离产品由质量人员按企业标准决定放行、返工或报废。返工完成后重新进入检测流程，不直接送包装。</li><li>必须记录状态。只有当前有效状态为“已放行”的产品才能进入包装；人工改判需要记录人员、理由及时间。</li></ol><h2>业务框架设计</h2><p>用文字说明系统如何连接生产现场、视觉模型、质检人员和包装环节。至少写出：</p>\n<ul><li>四个必要业务模块及各自作用。</li><li>系统与质检人员的职责边界。</li><li>一组用于产品追溯的输入、输出记录，包括记录方向、来源或去向、关键字段。</li></ul><table><caption>业务模块与作用</caption><thead><tr><th>模块</th><th>连接场景</th><th>作用</th></tr></thead><tbody><tr><td>图像采集与质量检查模块</td><td>生产现场</td><td>产品到达检测工位时触发拍照，检查模糊、反光和主体完整性。图像不合格时补拍一次，仍不可用则转人工检查。</td></tr><tr><td>视觉模型推理与分流模块</td><td>视觉模型</td><td>对可用图像调用模型得到缺陷分数。低于 0.20 自动放行，0.20 ≤ 分数 &lt; 0.80 转人工复核，0.80 及以上自动隔离。模型负责初筛，质量结论按规则及人工裁定确定。</td></tr><tr><td>人工复核与质量处置模块</td><td>质检人员</td><td>对中间分数产品进行人工复核与裁定。隔离产品由质量人员按标准决定放行、返工或报废，返工后重新进入检测。</td></tr><tr><td>状态记录与追溯模块</td><td>包装环节</td><td>记录每件产品的唯一有效状态（待检、已放行、已隔离或待处置），包装前核验已放行状态。人工改判记录人员、理由和时间，关联原图与模型版本，作为模型改进数据。</td></tr></tbody></table><table><caption>人机职责边界</caption><thead><tr><th>责任主体</th><th>职责边界</th></tr></thead><tbody><tr><td>系统</td><td>检查图像质量并触发补拍，调用模型打分和执行三档分流，分派复核任务，同步状态并留痕。包装前核验当前有效状态，只允许已放行的产品进入包装。</td></tr><tr><td>质检人员</td><td>复核中间分数产品，检查补拍后仍不可用的实物并作出裁定。按标准决定隔离品放行、返工或报废，无法判断时保持待检并交质量主管处理。记录改判人、理由和时间，确认可用于模型改进的样本。</td></tr></tbody></table><table><caption>输入输出与追溯记录</caption><thead><tr><th>方向</th><th>记录</th><th>来源/去向</th><th>关键字段</th></tr></thead><tbody><tr><td>输入</td><td>检测任务记录</td><td>生产现场 → 系统</td><td>产品编号、批次、工位号、采集时间、原始图像ID、图像质量标记、模型版本号</td></tr><tr><td>输入</td><td>模型推理结果</td><td>视觉模型 → 系统</td><td>产品编号、缺陷分数、推理时间、模型版本号</td></tr><tr><td>输入</td><td>人工复核结论</td><td>质检员 → 系统</td><td>产品编号、复核结论（合格/不合格/待定）、复核人、理由、时间</td></tr><tr><td>输出</td><td>产品状态记录</td><td>系统 → 包装环节</td><td>产品编号、当前有效状态（已放行/已隔离/待检）、状态更新时间</td></tr><tr><td>输出</td><td>质量处置记录</td><td>系统 → 质量人员/返工线</td><td>产品编号、处置决定（放行/返工/报废）、处置人、时间；返工完成后生成新检测任务回流</td></tr><tr><td>输出</td><td>模型改进样本记录</td><td>系统 → 模型训练环节</td><td>图像ID、模型原分数、人工最终结论、错误类型（漏检/误判）、关联模型版本</td></tr></tbody></table><h2>业务流程与处置规则设计</h2><ol><li>编写简短的“条件—处理动作—后续去向”规则表，覆盖图像不可用、低分、中间分数和高分四种情况。</li><li>绘制一张简洁的业务流程图，体现图像检查、模型检测、放行／人工复核／隔离分流，以及处理结果记录。人工复核后的去向和隔离后的处置可直接写在对应节点中，无需画出所有异常支线。</li><li>分别说明 P004、P005 按拟上线规则会进入哪条路径。</li></ol><div><table><thead><tr><th>条件</th><th>处理动作</th><th>后续去向</th></tr></thead><tbody><tr><td>图像模糊、严重反光或主体不完整</td><td>使原分数失效，补拍一次；仍不可用则人工检查实物。</td><td>人工判合格则放行，不合格则隔离，无法判断则待检并交主管；不得自动放行。</td></tr><tr><td>图像可用且分数小于 0.20</td><td>按试行规则自动放行并记录。</td><td>更新已放行状态，包装入口再次校验。</td></tr><tr><td>图像可用且 0.20≤分数＜0.80</td><td>转质检员复核，记录裁定及理由。</td><td>合格放行，不合格隔离，不确定保持待检。</td></tr><tr><td>图像可用且分数≥0.80</td><td>自动隔离，等待质量人员处理。</td><td>质量人员决定放行、返工或报废；返工后重新检测。</td></tr></tbody></table></div>\n<table><caption>P004、P005 的路径判定</caption><thead><tr><th>产品</th><th>数据</th><th>按拟上线规则的路径</th></tr></thead><tbody><tr><td>P004</td><td>图像模糊，分数0.04；试运行人工结论：实物有划伤、不合格。</td><td>先检查图像质量：图像模糊→原分数0.04作废→补拍一次。补拍图像可用→按新图重新检测并按新分数分流；补拍仍不可用→质检员检查实物→按检查结论处置，不合格则隔离，无法判断则待检并交主管。不得用模糊图像的低分直接放行。</td></tr><tr><td>P005</td><td>图像清晰，分数0.12（&lt;0.20）；试运行人工结论：细小凹陷、不合格。</td><td>图像可用且0.12&lt;0.20→自动放行→进入包装（包装前核对当前有效状态）。这会造成错误放行，暴露模型或阈值对细小凹陷的漏检风险，需要在任务三验证改进。不能把事后人工结论当作分流前输入，改写成必然人工复核或隔离。</td></tr></tbody></table><p>判断要点：P004先处理图像不可用问题，不能凭旧分数放行；P005按当前规则会自动放行，需指出漏检风险。补拍后的新分数未知，不预先断言会进入哪条分数路径。0.20进入人工复核，0.80进入隔离；人工不确定不得默认合格。</p><h4>规范业务流程图（参考方案）</h4><div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1190px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1190\" aria-hidden=\"true\"><defs><marker id=\"arrow-b11\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 45V69\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M380 121V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M265 200H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"188\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M110 244V300\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M205 350H265\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"234\" y=\"338\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 255V324\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"395\" y=\"291\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M110 400V539\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"157\" y=\"471\" text-anchor=\"middle\" class=\"flow-edge-label\">否：检查实物</text><path d=\"M380 376V410\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M480 460H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"525\" y=\"448\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 510V550\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"440\" y=\"532\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.20</text><path d=\"M280 600H205\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"239\" y=\"581\" text-anchor=\"middle\" class=\"flow-edge-label\">是：中间分数</text><path d=\"M380 650V697\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"441\" y=\"678\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.80</text><path d=\"M510 760H536\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"535\" y=\"745\" text-anchor=\"middle\" class=\"flow-edge-label\">返工</text><path d=\"M536 95H495\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"520\" y=\"81\" text-anchor=\"middle\" class=\"flow-edge-label\">重检</text><path d=\"M380 823V881\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"452\" y=\"860\" text-anchor=\"middle\" class=\"flow-edge-label\">放行／报废等结果</text><path d=\"M110 661V920H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"160\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M650 490V920H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"590\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M380 959V995\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M500 1050H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"531\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M260 1050H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1080V1133\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/></svg><div class=\"flow-box flow-terminal\" style=\"left:315.0px;top:11.0px;width:130px;height:34px\"><div class=\"flow-text\">开始</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:69.0px;width:230px;height:52px\"><div class=\"flow-text\">采集产品、批次与图像</div></div><div class=\"flow-box flow-decision\" style=\"left:265.0px;top:145.0px;width:230px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 230 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"115.0,1 229,55.0 115.0,109 1,55.0\"/></svg><div class=\"flow-text\">图像是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:156.0px;width:180px;height:88px\"><div class=\"flow-text\">原分数无效<br>补拍一次</div></div><div class=\"flow-box flow-decision\" style=\"left:15.0px;top:300.0px;width:190px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 190 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"95.0,1 189,50.0 95.0,99 1,50.0\"/></svg><div class=\"flow-text\">新图是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:324.0px;width:230px;height:52px\"><div class=\"flow-text\">视觉模型检测<br>取得新图的缺陷分数 s</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:410.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.20？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:430.0px;width:170px;height:60px\"><div class=\"flow-text\">自动放行</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:550.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.80？</div></div><div class=\"flow-box flow-process\" style=\"left:15.0px;top:539.0px;width:190px;height:122px\"><div class=\"flow-text\">质检员复核／检查实物<br>合格→放行；不合格→隔离<br>不确定→待检，交主管</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:697.0px;width:260px;height:126px\"><div class=\"flow-text\">自动隔离，质量人员处置<br>放行／返工／报废<br>返工完成→R，重新检测</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:741.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:76.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:881.0px;width:280px;height:78px\"><div class=\"flow-text\">记录处理结果与当前有效状态<br>关联原图、模型版本<br>人工改判：人员、理由、时间</div></div><div class=\"flow-box flow-decision\" style=\"left:260.0px;top:995.0px;width:240px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 240 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"120.0,1 239,55.0 120.0,109 1,55.0\"/></svg><div class=\"flow-text\">当前有效状态<br>是否已放行？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:1020.0px;width:170px;height:60px\"><div class=\"flow-text\">进入包装</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:1015.0px;width:180px;height:70px\"><div class=\"flow-text\">阻止进入包装<br>按当前状态继续处置</div></div><div class=\"flow-box flow-terminal\" style=\"left:585.0px;top:1133.0px;width:130px;height:34px\"><div class=\"flow-text\">结束</div></div></div></div><h2>设计验证与改进方案</h2><ol><li>针对 P005 的漏检和 P006 的误判，各提出一项具体改进措施，说明如何判断措施是否有效。</li><li>给出两个能够衡量新流程效果的指标，写清统计口径。</li></ol><table><caption>针对漏检与误判的改进及验证</caption><thead><tr><th>问题</th><th>具体改进措施</th><th>有效性验证方法</th></tr></thead><tbody><tr><td>P005 漏检：细小凹陷得0.12分被放行</td><td>补充不同角度、光照和批次的细小凹陷正样本，统一标注后微调模型。阈值在验证集选择，权衡漏检下降与人工复核量增加，避免只记住P005。</td><td>使用保留的独立凹陷测试集，对比改进前后缺陷召回率、漏检率；试运行按相同抽检标准验证实际漏放风险。</td></tr><tr><td>P006 误判：合格反光件得0.86分被隔离</td><td>采集合格反光困难负样本，由质检确认标签并回流训练；结合受控光源、偏振采集改善反光。</td><td>在独立合格反光测试集上比较误隔离率，同时确认真实缺陷召回率没有明显下降。</td></tr></tbody></table><table><caption>衡量新流程效果的两个指标</caption><thead><tr><th>指标</th><th>统计口径</th><th>意义与统计要求</th></tr></thead><tbody><tr><td>自动放行漏放率</td><td>经独立抽检确认实际不合格的自动放行件数 ÷ 被抽检的自动放行件数</td><td>衡量P005类错误放行风险；按预定随机或分层抽检，报告抽检量、批次和置信区间。</td></tr><tr><td>隔离误隔离率</td><td>质量人员最终确认合格的自动隔离件数 ÷ 已完成最终裁定的自动隔离件数</td><td>衡量P006类误隔离；固定周期与模型版本统计，未裁定件单列，上线前后保持裁定标准一致。</td></tr></tbody></table>"
  },
  "b3": {
    "id": "b3",
    "kind": "case",
    "category": "智能系统设计 · B3",
    "title": "B3 · 智慧园区能源预测与智能调度解决方案设计",
    "materialHTML": "<h4>业务背景</h4>\n<p>你是某智慧园区运营企业的人工智能训练师，正在参与园区能源管理系统升级。园区包含办公楼、商业配套、地下车库、新能源汽车充电区和储能设备。经调研，目前能源管理存在以下问题：</p>\n<ol><li>园区最大用电负荷为 1680kW，高峰负荷主要依靠人工观察后处理，容易产生需量费用。</li><li>月均电费约 125 万元，空调、储能和充电设施缺少统一调度。</li><li>能源数据完整率为 91%，部分仪表离线后不能及时补偿或告警。</li><li>从发现高峰风险到执行调节的平均时间为 25 分钟，响应速度较慢。</li><li>设备数据、预测结果、控制指令和执行反馈分散，无法形成完整追溯记录。</li></ol>\n<p>企业计划应用以下 3 类智能产品：</p>\n<ul><li>能源 IoT 采集终端</li><li>AI 负荷预测与能源优化平台</li><li>智能控制网关</li></ul>\n<p>园区现有电表、楼宇自控系统、储能系统和充电平台均可通过接口交换数据。AI 平台可结合历史负荷、天气预报、工作日类型、园区活动和分时电价，输出未来 30 分钟负荷预测、峰值风险及推荐调度方案。智能控制网关可接收经过确认的策略，对非关键空调负荷、储能充放电和充电设施功率进行调节，并返回执行状态。</p>\n<h4>运行约束</h4>\n<ol><li>能源数据连续缺失超过 5 分钟时，系统重试采集并标记异常；重试后仍无数据则使用最近可靠值形成临时估计，同时通知运维人员核查。</li><li>预测未来 30 分钟园区负荷达到或超过 1500kW 时，系统判定为峰值风险并生成削峰建议。</li><li>办公区域温度应保持在 24～27℃，消防、安防、数据机房等关键负荷不得自动削减。</li><li>调节指令发出后 60 秒内未收到成功反馈，应停止继续下发，恢复安全策略并通知值班人员。</li><li>策略、审批人、设备指令、执行结果和时间必须完整留痕；高风险策略必须由能源管理员确认后执行。</li></ol>",
    "tasks": [
      {
        "id": "b3t1",
        "title": "智能产品应用方案设计",
        "promptHTML": "<p>（1）完成智能产品应用设计表，写明每类产品解决的业务问题、主要数据输入、系统输出或下游动作。（2）根据题目给出的约束，完成运行规则表，填写判断条件和处理动作，覆盖能源数据连续缺失、预测出现峰值风险、调度方案触及运行边界、控制指令执行失败。（3）绘制多产品协同流程图：体现产品之间的信息传递、业务判断及分支处理、人机协作和结果闭环，主要节点控制在 6～8 个。</p>",
        "answerHTML": "<table><caption>智能产品应用设计表</caption><thead><tr><th>智能产品</th><th>解决的业务问题</th><th>主要数据输入</th><th>系统输出或下游动作</th></tr></thead><tbody><tr><td>能源 IoT 采集终端</td><td>能源数据完整率仅91%、仪表离线不能及时补偿告警；数据分散无法追溯</td><td>电表计量数据、楼宇自控系统数据、储能系统状态、充电平台数据（经接口汇聚）</td><td>标准化实时能源数据流（含时间戳、测点ID、数据质量标记）；离线/缺失告警；数据补采与临时估计值</td></tr><tr><td>AI 负荷预测与能源优化平台</td><td>高峰负荷靠人工观察、需量费用高；空调/储能/充电缺少统一调度</td><td>历史负荷曲线、天气预报、工作日类型、园区活动日历、分时电价</td><td>未来30分钟负荷预测、峰值风险判定（≥1500kW）、推荐调度方案（削峰策略）；策略推送至确认与执行环节</td></tr><tr><td>智能控制网关</td><td>从发现风险到执行调节平均25分钟，响应慢；执行结果无反馈闭环</td><td>经确认（高风险策略须能源管理员批准）的调度策略指令</td><td>对非关键空调负荷、储能充放电、充电设施功率的调节指令；60秒内执行状态反馈；失败时恢复安全策略并告警</td></tr></tbody></table><table><caption>运行规则表</caption><thead><tr><th>情况</th><th>判断条件</th><th>处理动作</th></tr></thead><tbody><tr><td>能源数据连续缺失</td><td>连续缺失超过 5 分钟</td><td>系统重试采集并标记异常；重试仍无数据→用最近可靠值形成临时估计，同时通知运维人员现场核查</td></tr><tr><td>预测出现峰值风险</td><td>未来30分钟园区负荷预测 ≥ 1500 kW</td><td>判定峰值风险，生成削峰建议（调非关键空调、储能放电、限制充电功率），推送能源管理员确认后下发执行</td></tr><tr><td>调度方案触及运行边界</td><td>方案将使办公区域温度超出 24~27℃，或涉及消防/安防/数据机房等关键负荷</td><td>拒绝执行该方案（关键负荷不得自动削减），退回平台重新生成替代策略，并记录越界拦截事件</td></tr><tr><td>控制指令执行失败</td><td>指令发出后 60 秒内未收到成功反馈</td><td>停止继续下发指令，恢复安全策略（回退到调节前状态），通知值班人员处理，全程留痕</td></tr></tbody></table><h4>规范业务流程图（参考方案）</h4><div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1220px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1220\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 105V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M255 190H210\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"232\" y=\"178\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M120 134V110H380V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"175\" y=\"102\" text-anchor=\"middle\" class=\"flow-edge-label\">重试／降级校验</text><path d=\"M380 245V295\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"272\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 415V465\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"445\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 355H750V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"651\" y=\"343\" text-anchor=\"middle\" class=\"flow-edge-label\">否：记录后持续监测</text><path d=\"M380 555V600\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M520 510H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"543\" y=\"495\" text-anchor=\"middle\" class=\"flow-edge-label\">约束</text><path d=\"M240 665H220V510H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"174\" y=\"545\" text-anchor=\"middle\" class=\"flow-edge-label\">否：修改后重审</text><path d=\"M380 730V780\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"758\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 850V900\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M380 1020V1062\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"1050\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M510 960H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"535\" y=\"948\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1015V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"637\" y=\"1106\" text-anchor=\"middle\" class=\"flow-edge-label\">处置结果</text><path d=\"M380 1177V1190H15V60H250\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"145\" y=\"1180\" text-anchor=\"middle\" class=\"flow-edge-label\">持续监测与反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:250.0px;top:15.0px;width:260px;height:90px\"><div class=\"flow-text\">① IoT终端持续采集<br>电表／楼控／储能／充电数据<br>标准化数据、质量标记与离线事件</div></div><div class=\"flow-box flow-decision\" style=\"left:255.0px;top:135.0px;width:250px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 250 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"125.0,1 249,55.0 125.0,109 1,55.0\"/></svg><div class=\"flow-text\">② 数据是否可用？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:134.0px;width:180px;height:112px\"><div class=\"flow-text\">连续缺失 &gt;5分钟：重试<br>仍失败→最近可靠值估计<br>保留估计标志并通知运维<br>降级数据重新校验</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:295.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ AI预测未来30分钟<br>负荷 ≥1500kW？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:465.0px;width:280px;height:90px\"><div class=\"flow-text\">④ AI平台生成削峰建议<br>未来30分钟预测、风险与削峰建议<br>运行边界校验</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:460.0px;width:180px;height:100px\"><div class=\"flow-text\">温度24～27℃<br>不得自动削减关键负荷<br>越界→修改／重新优化</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:600.0px;width:280px;height:130px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 130\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,65.0 140.0,129 1,65.0\"/></svg><div class=\"flow-text\">⑤ 边界合规且<br>必要审批已通过？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:613.0px;width:180px;height:104px\"><div class=\"flow-text\">高风险由能源管理员审批<br>未批准不得执行<br>低风险须在授权范围内</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:780.0px;width:260px;height:70px\"><div class=\"flow-text\">⑥ 控制网关执行<br>执行已校验策略并返回状态</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:900.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 60秒内收到<br>成功反馈？</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:905.0px;width:180px;height:110px\"><div class=\"flow-text\">明确失败或超时：<br>停止继续下发并恢复安全策略<br>通知值班<br>核对实际设备状态</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:1062.5px;width:280px;height:115px\"><div class=\"flow-text\">⑧ 结果留痕与实际负荷复核<br>记录策略、审批、指令与结果<br>反馈至持续采集与模型改进</div></div></div></div>",
        "flowchart": {
          "html": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1220px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1220\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 105V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M255 190H210\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"232\" y=\"178\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M120 134V110H380V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"175\" y=\"102\" text-anchor=\"middle\" class=\"flow-edge-label\">重试／降级校验</text><path d=\"M380 245V295\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"272\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 415V465\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"445\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 355H750V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"651\" y=\"343\" text-anchor=\"middle\" class=\"flow-edge-label\">否：记录后持续监测</text><path d=\"M380 555V600\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M520 510H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"543\" y=\"495\" text-anchor=\"middle\" class=\"flow-edge-label\">约束</text><path d=\"M240 665H220V510H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"174\" y=\"545\" text-anchor=\"middle\" class=\"flow-edge-label\">否：修改后重审</text><path d=\"M380 730V780\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"758\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 850V900\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M380 1020V1062\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"1050\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M510 960H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"535\" y=\"948\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1015V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"637\" y=\"1106\" text-anchor=\"middle\" class=\"flow-edge-label\">处置结果</text><path d=\"M380 1177V1190H15V60H250\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"145\" y=\"1180\" text-anchor=\"middle\" class=\"flow-edge-label\">持续监测与反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:250.0px;top:15.0px;width:260px;height:90px\"><div class=\"flow-text\">① IoT终端持续采集<br>电表／楼控／储能／充电数据<br>标准化数据、质量标记与离线事件</div></div><div class=\"flow-box flow-decision\" style=\"left:255.0px;top:135.0px;width:250px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 250 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"125.0,1 249,55.0 125.0,109 1,55.0\"/></svg><div class=\"flow-text\">② 数据是否可用？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:134.0px;width:180px;height:112px\"><div class=\"flow-text\">连续缺失 &gt;5分钟：重试<br>仍失败→最近可靠值估计<br>保留估计标志并通知运维<br>降级数据重新校验</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:295.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ AI预测未来30分钟<br>负荷 ≥1500kW？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:465.0px;width:280px;height:90px\"><div class=\"flow-text\">④ AI平台生成削峰建议<br>未来30分钟预测、风险与削峰建议<br>{{0}}</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:460.0px;width:180px;height:100px\"><div class=\"flow-text\">温度24～27℃<br>不得自动削减关键负荷<br>越界→修改／重新优化</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:600.0px;width:280px;height:130px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 130\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,65.0 140.0,129 1,65.0\"/></svg><div class=\"flow-text\">⑤ 边界合规且<br>必要审批已通过？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:613.0px;width:180px;height:104px\"><div class=\"flow-text\">{{1}}<br>未批准不得执行<br>低风险须在授权范围内</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:780.0px;width:260px;height:70px\"><div class=\"flow-text\">⑥ 控制网关执行<br>执行已校验策略并返回状态</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:900.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 60秒内收到<br>成功反馈？</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:905.0px;width:180px;height:110px\"><div class=\"flow-text\">明确失败或超时：<br>停止继续下发并恢复安全策略<br>通知值班<br>核对实际设备状态</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:1062.5px;width:280px;height:115px\"><div class=\"flow-text\">⑧ {{2}}<br>记录策略、审批、指令与结果<br>反馈至持续采集与模型改进</div></div></div></div>",
          "slots": [
            {
              "answer": "运行边界校验",
              "choices": [
                "运行边界校验",
                "直接强制执行",
                "删除越界记录"
              ],
              "why": "方案触及温度或关键负荷约束时先拒绝或重新优化。",
              "accepted": [],
              "matchRule": {
                "groups": [
                  [
                    "运行边界",
                    "安全边界",
                    "温度限制",
                    "关键负荷"
                  ],
                  [
                    "校验",
                    "检查",
                    "核验",
                    "验证"
                  ]
                ]
              }
            },
            {
              "answer": "高风险由能源管理员审批",
              "choices": [
                "高风险由能源管理员审批",
                "所有策略自动批准",
                "执行完才审批"
              ],
              "why": "高风险先审批后执行，未批准不得下发。",
              "accepted": [],
              "matchRule": {
                "groups": [
                  [
                    "高风险"
                  ],
                  [
                    "能源管理员",
                    "能源管理人员"
                  ],
                  [
                    "审批",
                    "确认",
                    "批准"
                  ]
                ]
              }
            },
            {
              "answer": "结果留痕与实际负荷复核",
              "choices": [
                "结果留痕与实际负荷复核",
                "仅保存预测值",
                "默认结果成功"
              ],
              "why": "执行后复核实际负荷与设备状态，结果回流形成闭环。",
              "accepted": [],
              "matchRule": {
                "groups": [
                  [
                    "留痕",
                    "记录",
                    "日志"
                  ],
                  [
                    "实际负荷",
                    "实际用电",
                    "执行结果"
                  ],
                  [
                    "复核",
                    "核验",
                    "验证",
                    "检查"
                  ]
                ]
              }
            }
          ]
        },
        "answerTables": [
          {
            "headers": [
              "智能产品",
              "解决的业务问题",
              "主要数据输入",
              "系统输出或下游动作"
            ],
            "rows": [
              [
                "能源 IoT 采集终端",
                "能源数据完整率仅91%、仪表离线不能及时补偿告警；数据分散无法追溯",
                "电表计量数据、楼宇自控系统数据、储能系统状态、充电平台数据（经接口汇聚）",
                "标准化实时能源数据流（含时间戳、测点ID、数据质量标记）；离线/缺失告警；数据补采与临时估计值"
              ],
              [
                "AI 负荷预测与能源优化平台",
                "高峰负荷靠人工观察、需量费用高；空调/储能/充电缺少统一调度",
                "历史负荷曲线、天气预报、工作日类型、园区活动日历、分时电价",
                "未来30分钟负荷预测、峰值风险判定（≥1500kW）、推荐调度方案（削峰策略）；策略推送至确认与执行环节"
              ],
              [
                "智能控制网关",
                "从发现风险到执行调节平均25分钟，响应慢；执行结果无反馈闭环",
                "经确认（高风险策略须能源管理员批准）的调度策略指令",
                "对非关键空调负荷、储能充放电、充电设施功率的调节指令；60秒内执行状态反馈；失败时恢复安全策略并告警"
              ]
            ],
            "title": "智能产品应用设计表"
          },
          {
            "headers": [
              "情况",
              "判断条件",
              "处理动作"
            ],
            "rows": [
              [
                "能源数据连续缺失",
                "连续缺失超过 5 分钟",
                "系统重试采集并标记异常；重试仍无数据→用最近可靠值形成临时估计，同时通知运维人员现场核查"
              ],
              [
                "预测出现峰值风险",
                "未来30分钟园区负荷预测 ≥ 1500 kW",
                "判定峰值风险，生成削峰建议（调非关键空调、储能放电、限制充电功率），推送能源管理员确认后下发执行"
              ],
              [
                "调度方案触及运行边界",
                "方案将使办公区域温度超出 24~27℃，或涉及消防/安防/数据机房等关键负荷",
                "拒绝执行该方案（关键负荷不得自动削减），退回平台重新生成替代策略，并记录越界拦截事件"
              ],
              [
                "控制指令执行失败",
                "指令发出后 60 秒内未收到成功反馈",
                "停止继续下发指令，恢复安全策略（回退到调节前状态），通知值班人员处理，全程留痕"
              ]
            ],
            "title": "运行规则表"
          }
        ]
      },
      {
        "id": "b3t2",
        "title": "实施与运营设计",
        "promptHTML": "<p>（1）计算并填写验收指标：最大用电负荷比现状降低 12%；月均电费比现状降低 8%；能源数据完整率达到 99% 以上；峰值风险平均响应时间缩短至 5 分钟以内。（2）制定三阶段实施计划（总周期 8 周）：数据接入与基线建立（第 1～2 周）、策略仿真与小范围试点（第 3～5 周）、推广上线与指标验收（第 6～8 周），写出各阶段关键任务、验收输出和主要责任人。（3）明确人机协作边界，说明智能系统和工作人员的工作边界。（4）制定运行风险控制措施，包括仪表离线或采集数据异常、负荷预测随季节和业态变化失准、控制指令未执行或设备状态异常。</p>",
        "answerHTML": "<table><caption>验收指标表</caption><thead><tr><th>指标</th><th>上线前</th><th>建设目标</th><th>验收目标值（计算结果）</th></tr></thead><tbody><tr><td>最大用电负荷</td><td>1680 kW</td><td>降低 12%</td><td>≤ 1478.4 kW（1680 × (1−12%) = 1680 × 0.88）</td></tr><tr><td>月均电费</td><td>125 万元</td><td>降低 8%</td><td>≤ 115 万元（125 × (1−8%) = 125 × 0.92）</td></tr><tr><td>能源数据完整率</td><td>91%</td><td>达到 99% 以上</td><td>≥ 99%</td></tr><tr><td>峰值风险平均响应时间</td><td>25 分钟</td><td>缩短至 5 分钟以内</td><td>≤ 5 分钟</td></tr></tbody></table><table><caption>三阶段实施计划表</caption><thead><tr><th>阶段名称</th><th>时间周期</th><th>关键任务</th><th>验收输出</th><th>主要责任人</th></tr></thead><tbody><tr><td>数据接入与基线建立</td><td>第1~2周</td><td>部署 IoT 采集终端并接入电表/楼宇自控/储能/充电平台接口；建立数据质量监控（完整率、缺失告警）；收集历史负荷、天气、电价数据训练初版预测模型；测定负荷/电费/响应时间基线值</td><td>数据接入验收单；数据完整率≥99%的监测报告；基线测定报告；初版预测模型及回测精度报告</td><td>IoT 集成工程师、人工智能训练师、能源管理员</td></tr><tr><td>策略仿真与小范围试点</td><td>第3~5周</td><td>用历史数据仿真削峰策略效果；选定部分楼宇/充电区试点：预测→人工确认→网关执行→反馈闭环全流程跑通；演练数据缺失与指令失败两条异常路径；根据试点修正阈值与策略</td><td>仿真评估报告；试点运行报告（含响应时间实测≤5分钟、削峰量实测）；异常场景演练记录</td><td>人工智能训练师、能源管理员、值班运维</td></tr><tr><td>推广上线与指标验收</td><td>第6~8周</td><td>全园区推广上线；人员培训与值班制度落地；按四项验收指标连续观测并出具验收报告；建立月度复盘与模型迭代机制</td><td>上线报告；四项验收指标达成证明（负荷≤1478.4kW、电费≤115万、完整率≥99%、响应≤5分钟）；运维手册与培训记录</td><td>项目经理、能源管理员、人工智能训练师</td></tr></tbody></table><table><caption>人机协作边界</caption><thead><tr><th>责任主体</th><th>工作边界</th></tr></thead><tbody><tr><td>智能系统</td><td>7×24 数据采集与缺失兜底（重试/临时估计/告警）；负荷预测与峰值风险判定；生成调度方案并做运行边界校验；执行经确认的控制指令；60秒超时保护与自动恢复安全策略；全流程留痕与统计报表。</td></tr><tr><td>工作人员</td><td>能源管理员：高风险策略的审批确认、运行边界规则的调整；运维人员：仪表离线核查、设备故障处置；值班人员：执行失败时的人工接管与应急处置；管理层：验收指标认定与策略效果复盘。</td></tr></tbody></table><table><caption>运行风险控制措施表</caption><thead><tr><th>风险</th><th>控制措施</th></tr></thead><tbody><tr><td>仪表离线或采集数据异常</td><td>缺失超5分钟自动重试并标记异常；仍无数据用最近可靠值临时估计并显著标记为估计值（不用于结算口径），同时告警运维限时核查；每日输出数据完整率报表，低于99%触发专项整改；关键测点配置冗余采集链路。</td></tr><tr><td>负荷预测随季节和业态变化失准</td><td>建立预测误差监控（每日比对预测 vs 实际，如 MAPE 超阈值告警）；季节切换与业态变更（新商户入驻/大型活动）时触发模型再训练或人工修正；保留人工调整峰值阈值的权限，调整须审批留痕。</td></tr><tr><td>控制指令未执行或设备状态异常</td><td>60秒无成功反馈即停止下发、恢复安全策略并通知值班；执行前校验设备在线状态；定期对控制链路做演练测试；设备故障转入人工调度模式，故障记录纳入设备维护计划。</td></tr></tbody></table><p>系统“建议+执行被批准的方案”，人“决策+兜底”；任何触及安全边界的操作，系统只有拒绝权没有执行权。</p>",
        "answerTables": [
          {
            "headers": [
              "指标",
              "上线前",
              "建设目标",
              "验收目标值（计算结果）"
            ],
            "rows": [
              [
                "最大用电负荷",
                "1680 kW",
                "降低 12%",
                "≤ 1478.4 kW（1680 × (1−12%) = 1680 × 0.88）"
              ],
              [
                "月均电费",
                "125 万元",
                "降低 8%",
                "≤ 115 万元（125 × (1−8%) = 125 × 0.92）"
              ],
              [
                "能源数据完整率",
                "91%",
                "达到 99% 以上",
                "≥ 99%"
              ],
              [
                "峰值风险平均响应时间",
                "25 分钟",
                "缩短至 5 分钟以内",
                "≤ 5 分钟"
              ]
            ],
            "title": "验收指标表",
            "editableColumns": [
              3
            ]
          },
          {
            "headers": [
              "阶段名称",
              "时间周期",
              "关键任务",
              "验收输出",
              "主要责任人"
            ],
            "rows": [
              [
                "数据接入与基线建立",
                "第1~2周",
                "部署 IoT 采集终端并接入电表/楼宇自控/储能/充电平台接口；建立数据质量监控（完整率、缺失告警）；收集历史负荷、天气、电价数据训练初版预测模型；测定负荷/电费/响应时间基线值",
                "数据接入验收单；数据完整率≥99%的监测报告；基线测定报告；初版预测模型及回测精度报告",
                "IoT 集成工程师、人工智能训练师、能源管理员"
              ],
              [
                "策略仿真与小范围试点",
                "第3~5周",
                "用历史数据仿真削峰策略效果；选定部分楼宇/充电区试点：预测→人工确认→网关执行→反馈闭环全流程跑通；演练数据缺失与指令失败两条异常路径；根据试点修正阈值与策略",
                "仿真评估报告；试点运行报告（含响应时间实测≤5分钟、削峰量实测）；异常场景演练记录",
                "人工智能训练师、能源管理员、值班运维"
              ],
              [
                "推广上线与指标验收",
                "第6~8周",
                "全园区推广上线；人员培训与值班制度落地；按四项验收指标连续观测并出具验收报告；建立月度复盘与模型迭代机制",
                "上线报告；四项验收指标达成证明（负荷≤1478.4kW、电费≤115万、完整率≥99%、响应≤5分钟）；运维手册与培训记录",
                "项目经理、能源管理员、人工智能训练师"
              ]
            ],
            "title": "三阶段实施计划表",
            "editableColumns": [
              2,
              3,
              4
            ]
          },
          {
            "headers": [
              "责任主体",
              "工作边界"
            ],
            "rows": [
              [
                "智能系统",
                "7×24 数据采集与缺失兜底（重试/临时估计/告警）；负荷预测与峰值风险判定；生成调度方案并做运行边界校验；执行经确认的控制指令；60秒超时保护与自动恢复安全策略；全流程留痕与统计报表。"
              ],
              [
                "工作人员",
                "能源管理员：高风险策略的审批确认、运行边界规则的调整；运维人员：仪表离线核查、设备故障处置；值班人员：执行失败时的人工接管与应急处置；管理层：验收指标认定与策略效果复盘。"
              ]
            ],
            "title": "人机协作边界"
          },
          {
            "headers": [
              "风险",
              "控制措施"
            ],
            "rows": [
              [
                "仪表离线或采集数据异常",
                "缺失超5分钟自动重试并标记异常；仍无数据用最近可靠值临时估计并显著标记为估计值（不用于结算口径），同时告警运维限时核查；每日输出数据完整率报表，低于99%触发专项整改；关键测点配置冗余采集链路。"
              ],
              [
                "负荷预测随季节和业态变化失准",
                "建立预测误差监控（每日比对预测 vs 实际，如 MAPE 超阈值告警）；季节切换与业态变更（新商户入驻/大型活动）时触发模型再训练或人工修正；保留人工调整峰值阈值的权限，调整须审批留痕。"
              ],
              [
                "控制指令未执行或设备状态异常",
                "60秒无成功反馈即停止下发、恢复安全策略并通知值班；执行前校验设备在线状态；定期对控制链路做演练测试；设备故障转入人工调度模式，故障记录纳入设备维护计划。"
              ]
            ],
            "title": "运行风险控制措施表"
          }
        ],
        "providedAnswers": [
          "1～2",
          "3～5",
          "6～8"
        ]
      }
    ],
    "steps": [
      {
        "id": "b3-1",
        "title": "连接三类智能产品",
        "goal": "明确采集终端、AI 平台、控制网关的数据流与职责。",
        "code": "IoT 终端 → {{}}。\nAI 平台 → {{}}。\n控制网关 → {{}}。",
        "solution": "IoT 终端 → 标准化实时能源数据流。\nAI 平台 → 未来30分钟负荷预测。\n控制网关 → 60秒内执行状态反馈。",
        "slots": [
          {
            "answer": "标准化实时能源数据流",
            "choices": [
              "标准化实时能源数据流",
              "直接决定报废",
              "跳过数据质量"
            ],
            "why": "采集终端汇聚四类接口数据，输出带时间戳、测点ID和质量标记的标准化数据流，并提供缺失告警、补采与临时估计值。",
            "accepted": [
              "标准化数据、质量标记与离线事件"
            ],
            "matchRule": {
              "groups": [
                [
                  "标准化",
                  "标准数据"
                ],
                [
                  "数据流",
                  "实时数据"
                ]
              ]
            }
          },
          {
            "answer": "未来30分钟负荷预测",
            "choices": [
              "未来30分钟负荷预测",
              "未经校验直接控制所有负荷",
              "只做历史账单归档"
            ],
            "why": "平台使用历史负荷、天气、工作日、活动和电价，输出未来30分钟负荷预测、峰值风险与削峰方案。",
            "accepted": [
              "未来30分钟预测、风险与削峰建议"
            ],
            "matchRule": {
              "groups": [
                [
                  "30分钟",
                  "半小时"
                ],
                [
                  "负荷",
                  "用电"
                ],
                [
                  "预测"
                ]
              ]
            }
          },
          {
            "answer": "60秒内执行状态反馈",
            "choices": [
              "60秒内执行状态反馈",
              "自行绕过审批",
              "用预测代替执行回执"
            ],
            "why": "网关接收经确认的调度策略，调节非关键空调、储能和充电功率；60秒内反馈执行状态，失败时恢复安全策略并告警。",
            "accepted": [
              "执行已校验策略并返回状态"
            ],
            "matchRule": {
              "groups": [
                [
                  "60秒",
                  "一分钟",
                  "1分钟"
                ],
                [
                  "反馈",
                  "回传",
                  "返回"
                ],
                [
                  "执行状态",
                  "执行结果",
                  "状态"
                ]
              ]
            }
          }
        ],
        "hint": "采集负责数据，平台负责预测建议，网关负责执行反馈。",
        "context": "",
        "taskIndex": 0,
        "examComments": "原题任务：智能产品应用方案设计",
        "tablePractice": {
          "table": 0,
          "rows": null,
          "cells": {
            "0-3": "{{0}}（含时间戳、测点ID、数据质量标记）；离线/缺失告警；数据补采与临时估计值",
            "1-3": "{{1}}、峰值风险判定（≥1500kW）、推荐调度方案（削峰策略）；策略推送至确认与执行环节",
            "2-3": "对非关键空调负荷、储能充放电、充电设施功率的调节指令；{{2}}；失败时恢复安全策略并告警"
          }
        }
      },
      {
        "id": "b3-2",
        "title": "处理连续数据缺失",
        "goal": "准确保留题设阈值和异常处置顺序。",
        "code": "连续缺失超过 {{}} 分钟 → 重试并标记异常。\n重试仍失败 → 用 {{}} 临时估计，并通知运维。\n估计数据必须有估计标志，不能冒充实测。",
        "solution": "连续缺失超过 5 分钟 → 重试并标记异常。\n重试仍失败 → 用 最近可靠值 临时估计，并通知运维。\n估计数据必须有估计标志，不能冒充实测。",
        "slots": [
          {
            "answer": "5",
            "choices": [
              "5",
              "1",
              "60"
            ],
            "why": "题设为超过 5 分钟，不是任意缺失即采用估计。",
            "accepted": [],
            "matchRule": {}
          },
          {
            "answer": "最近可靠值",
            "choices": [
              "最近可靠值",
              "零值",
              "未来预测的任意值"
            ],
            "why": "临时估计用于降级运行，需要记录原值时间与时效。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "最近的可靠值",
                "上一次可靠值",
                "最近有效值",
                "最后有效值",
                "最近一次有效数据"
              ]
            }
          }
        ],
        "hint": "超过 5 分钟，先重试，再估计并告警。",
        "context": "",
        "taskIndex": 0,
        "examComments": "原题任务：智能产品应用方案设计",
        "tablePractice": {
          "table": 1,
          "rows": [
            0
          ],
          "cells": {
            "0-1": "连续缺失超过 {{0}} 分钟",
            "0-2": "系统重试采集并标记异常；重试仍无数据→用{{1}}形成临时估计，同时通知运维人员现场核查"
          }
        }
      },
      {
        "id": "b3-3",
        "title": "区分预测窗口与触发阈值",
        "goal": "未来负荷达到阈值时提出削峰建议，执行前仍需校验和必要审批。",
        "code": "预测未来 {{}} 分钟负荷 ≥ {{}} kW → 生成削峰建议。",
        "solution": "预测未来 30 分钟负荷 ≥ 1500 kW → 生成削峰建议。",
        "slots": [
          {
            "answer": "30",
            "choices": [
              "30",
              "5",
              "60"
            ],
            "why": "30 分钟是预测时间窗。",
            "accepted": [],
            "matchRule": {}
          },
          {
            "answer": "1500",
            "choices": [
              "1500",
              "1478.4",
              "1680"
            ],
            "why": "1500 kW 是风险触发阈值；1478.4 kW 是验收目标上限，两者不能混用。",
            "accepted": [],
            "matchRule": {}
          }
        ],
        "hint": "时间窗是 30 分钟；触发风险是达到或超过 1500 kW。",
        "context": "",
        "taskIndex": 0,
        "examComments": "原题任务：智能产品应用方案设计",
        "tablePractice": {
          "table": 1,
          "rows": [
            1
          ],
          "cells": {
            "1-1": "未来{{0}}分钟园区负荷预测 ≥ {{1}} kW"
          }
        }
      },
      {
        "id": "b3-4",
        "title": "守住运行安全边界",
        "goal": "办公温度与关键负荷限制优先于节费目标。",
        "code": "办公区域温度保持 {{}}～{{}} ℃。\n消防、安防、数据机房等关键负荷 {{}}。\n越界方案拒绝执行，重新优化或转人工。",
        "solution": "办公区域温度保持 24～27 ℃。\n消防、安防、数据机房等关键负荷 不得自动削减。\n越界方案拒绝执行，重新优化或转人工。",
        "slots": [
          {
            "answer": "24",
            "choices": [
              "24",
              "20",
              "26"
            ],
            "why": "题设温度下限为 24℃。",
            "accepted": [],
            "matchRule": {}
          },
          {
            "answer": "27",
            "choices": [
              "27",
              "25",
              "30"
            ],
            "why": "题设温度上限为 27℃。",
            "accepted": [],
            "matchRule": {}
          },
          {
            "answer": "不得自动削减",
            "choices": [
              "不得自动削减",
              "可为节费任意削减",
              "高峰时默认全部关闭"
            ],
            "why": "关键负荷不得自动削减，不能为了验收指标绕过安全限制。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "不能自动削减",
                "禁止自动削减",
                "不允许自动削减",
                "不能自动切断",
                "不得自动切除"
              ]
            }
          }
        ],
        "hint": "办公温度 24～27℃；关键负荷不得自动削减。",
        "context": "",
        "taskIndex": 0,
        "examComments": "原题任务：智能产品应用方案设计",
        "tablePractice": {
          "table": 1,
          "rows": [
            2
          ],
          "cells": {
            "2-1": "方案将使办公区域温度超出 {{0}}~{{1}}℃，或涉及消防/安防/数据机房等关键负荷",
            "2-2": "拒绝执行该方案（关键负荷{{2}}），退回平台重新生成替代策略，并记录越界拦截事件"
          }
        }
      },
      {
        "id": "b3-5",
        "title": "失败保护与审批留痕",
        "goal": "控制下发后没有成功反馈，不能继续盲目重试。",
        "code": "下发后 {{}} 秒内未收到成功反馈 → {{}}，通知值班人员。\n高风险策略必须由 {{}} 确认后执行。\n策略、审批人、指令、结果和时间全程记录。",
        "solution": "下发后 60 秒内未收到成功反馈 → 停止继续下发指令，恢复安全策略，通知值班人员。\n高风险策略必须由 能源管理员 确认后执行。\n策略、审批人、指令、结果和时间全程记录。",
        "slots": [
          {
            "answer": "60",
            "choices": [
              "60",
              "5",
              "30"
            ],
            "why": "题设超时窗口为 60 秒，明确失败也应进入失败处置。",
            "accepted": [],
            "matchRule": {}
          },
          {
            "answer": "停止继续下发指令，恢复安全策略",
            "choices": [
              "停止继续下发指令，恢复安全策略",
              "无限重发",
              "把无回执当成功"
            ],
            "why": "停止继续下发，核查设备实际状态，无法确认则人工接管。",
            "accepted": [
              "停止继续下发并恢复安全策略"
            ],
            "matchRule": {
              "groups": [
                [
                  "停止下发",
                  "停止继续下发",
                  "停发",
                  "停止发指令"
                ],
                [
                  "恢复安全策略",
                  "恢复安全方案",
                  "回退到安全策略",
                  "切回安全策略"
                ]
              ]
            }
          },
          {
            "answer": "能源管理员",
            "choices": [
              "能源管理员",
              "任意访客",
              "模型自行审批"
            ],
            "why": "高风险策略不得绕过能源管理员确认。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "能源管理人员",
                "能源管理负责人",
                "负责能源管理的人员"
              ]
            }
          }
        ],
        "hint": "60 秒无成功反馈：停发、恢复安全策略、通知值班。",
        "context": "",
        "taskIndex": 0,
        "examComments": "原题任务：智能产品应用方案设计",
        "tablePractice": {
          "table": 1,
          "rows": [
            3
          ],
          "cells": {
            "3-1": "指令发出后 {{0}} 秒内未收到成功反馈",
            "3-2": "{{1}}（回退到调节前状态），通知值班人员处理，全程留痕；高风险策略须{{2}}确认后执行。"
          }
        }
      },
      {
        "id": "b3-6",
        "title": "完成八节点协同流程",
        "goal": "主流程中要包含数据、预测、方案、边界、审批、执行和反馈闭环。",
        "code": "持续采集 → 数据质量判断 → 负荷预测与峰值判断\n→ 生成削峰建议 → {{}} → {{}}\n→ 网关执行 → {{}} → 返回持续采集。",
        "solution": "持续采集 → 数据质量判断 → 负荷预测与峰值判断\n→ 生成削峰建议 → 运行边界校验 → 高风险由能源管理员审批\n→ 网关执行 → 结果留痕与实际负荷复核 → 返回持续采集。",
        "slots": [
          {
            "answer": "运行边界校验",
            "choices": [
              "运行边界校验",
              "直接强制执行",
              "删除越界记录"
            ],
            "why": "方案触及温度或关键负荷约束时先拒绝或重新优化。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "运行边界",
                  "安全边界",
                  "温度限制",
                  "关键负荷"
                ],
                [
                  "校验",
                  "检查",
                  "核验",
                  "验证"
                ]
              ]
            }
          },
          {
            "answer": "高风险由能源管理员审批",
            "choices": [
              "高风险由能源管理员审批",
              "所有策略自动批准",
              "执行完才审批"
            ],
            "why": "高风险先审批后执行，未批准不得下发。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "高风险"
                ],
                [
                  "能源管理员",
                  "能源管理人员"
                ],
                [
                  "审批",
                  "确认",
                  "批准"
                ]
              ]
            }
          },
          {
            "answer": "结果留痕与实际负荷复核",
            "choices": [
              "结果留痕与实际负荷复核",
              "仅保存预测值",
              "默认结果成功"
            ],
            "why": "执行后复核实际负荷与设备状态，结果回流形成闭环。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "留痕",
                  "记录",
                  "日志"
                ],
                [
                  "实际负荷",
                  "实际用电",
                  "执行结果"
                ],
                [
                  "复核",
                  "核验",
                  "验证",
                  "检查"
                ]
              ]
            }
          }
        ],
        "hint": "主流程八个节点，异常和审批驳回作为分支。",
        "context": "",
        "taskIndex": 0,
        "examComments": "原题任务：智能产品应用方案设计",
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1220px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1220\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 105V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M255 190H210\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"232\" y=\"178\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M120 134V110H380V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"175\" y=\"102\" text-anchor=\"middle\" class=\"flow-edge-label\">重试／降级校验</text><path d=\"M380 245V295\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"272\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 415V465\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"445\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 355H750V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"651\" y=\"343\" text-anchor=\"middle\" class=\"flow-edge-label\">否：记录后持续监测</text><path d=\"M380 555V600\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M520 510H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"543\" y=\"495\" text-anchor=\"middle\" class=\"flow-edge-label\">约束</text><path d=\"M240 665H220V510H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"174\" y=\"545\" text-anchor=\"middle\" class=\"flow-edge-label\">否：修改后重审</text><path d=\"M380 730V780\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"758\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 850V900\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M380 1020V1062\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"1050\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M510 960H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"535\" y=\"948\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1015V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"637\" y=\"1106\" text-anchor=\"middle\" class=\"flow-edge-label\">处置结果</text><path d=\"M380 1177V1190H15V60H250\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"145\" y=\"1180\" text-anchor=\"middle\" class=\"flow-edge-label\">持续监测与反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:250.0px;top:15.0px;width:260px;height:90px\"><div class=\"flow-text\">① IoT终端持续采集<br>电表／楼控／储能／充电数据<br>标准化数据、质量标记与离线事件</div></div><div class=\"flow-box flow-decision\" style=\"left:255.0px;top:135.0px;width:250px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 250 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"125.0,1 249,55.0 125.0,109 1,55.0\"/></svg><div class=\"flow-text\">② 数据是否可用？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:134.0px;width:180px;height:112px\"><div class=\"flow-text\">连续缺失 &gt;5分钟：重试<br>仍失败→最近可靠值估计<br>保留估计标志并通知运维<br>降级数据重新校验</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:295.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ AI预测未来30分钟<br>负荷 ≥1500kW？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:465.0px;width:280px;height:90px\"><div class=\"flow-text\">④ AI平台生成削峰建议<br>未来30分钟预测、风险与削峰建议<br>{{0}}</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:460.0px;width:180px;height:100px\"><div class=\"flow-text\">温度24～27℃<br>不得自动削减关键负荷<br>越界→修改／重新优化</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:600.0px;width:280px;height:130px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 130\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,65.0 140.0,129 1,65.0\"/></svg><div class=\"flow-text\">⑤ 边界合规且<br>必要审批已通过？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:613.0px;width:180px;height:104px\"><div class=\"flow-text\">{{1}}<br>未批准不得执行<br>低风险须在授权范围内</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:780.0px;width:260px;height:70px\"><div class=\"flow-text\">⑥ 控制网关执行<br>执行已校验策略并返回状态</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:900.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 60秒内收到<br>成功反馈？</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:905.0px;width:180px;height:110px\"><div class=\"flow-text\">明确失败或超时：<br>停止继续下发并恢复安全策略<br>通知值班<br>核对实际设备状态</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:1062.5px;width:280px;height:115px\"><div class=\"flow-text\">⑧ {{2}}<br>记录策略、审批、指令与结果<br>反馈至持续采集与模型改进</div></div></div></div>"
      },
      {
        "id": "b3-7",
        "title": "计算四项验收目标",
        "goal": "根据题目基线计算四项验收目标，保留单位与不等号方向。",
        "code": "最大负荷 ≤ {{}} kW（1680×0.88）。\n月均电费 ≤ {{}} 万元（125×0.92）。\n实测数据完整率 ≥ {{}}%。\n峰值风险平均响应时间 ≤ {{}} 分钟。",
        "solution": "最大负荷 ≤ 1478.4 kW（1680×0.88）。\n月均电费 ≤ 115 万元（125×0.92）。\n实测数据完整率 ≥ 99%。\n峰值风险平均响应时间 ≤ 5 分钟。",
        "slots": [
          {
            "answer": "1478.4",
            "choices": [
              "1478.4",
              "1500",
              "201.6"
            ],
            "why": "1680×(1−12%)=1478.4 kW；201.6 kW 是削减量。",
            "accepted": [],
            "matchRule": {}
          },
          {
            "answer": "115",
            "choices": [
              "115",
              "10",
              "125"
            ],
            "why": "125×(1−8%)=115 万元；10 万元是节省量。",
            "accepted": [],
            "matchRule": {}
          },
          {
            "answer": "99",
            "choices": [
              "99",
              "91",
              "8"
            ],
            "why": "老师参考答案为能源数据完整率≥99%。",
            "accepted": [],
            "matchRule": {}
          },
          {
            "answer": "5",
            "choices": [
              "5",
              "25",
              "60"
            ],
            "why": "老师参考答案为峰值风险平均响应时间≤5分钟。",
            "accepted": [],
            "matchRule": {}
          }
        ],
        "hint": "降低比例乘以原值；验收上限不是风险阈值。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：实施与运营设计",
        "tablePractice": {
          "table": 0,
          "rows": null,
          "cells": {
            "0-3": "≤ {{0}} kW（1680 × (1−12%) = 1680 × 0.88）",
            "1-3": "≤ {{1}} 万元（125 × (1−8%) = 125 × 0.92）",
            "2-3": "≥ {{2}}%",
            "3-3": "≤ {{3}} 分钟"
          }
        }
      },
      {
        "id": "b3-8",
        "title": "安排八周实施计划",
        "goal": "按照接入、试点、推广的顺序，明确任务、交付与责任人。",
        "code": "第{{}}周：数据接入与基线建立。\n第{{}}周：策略仿真与小范围试点。\n第{{}}周：推广上线与指标验收。",
        "solution": "第1～2周：数据接入与基线建立。\n第3～5周：策略仿真与小范围试点。\n第6～8周：推广上线与指标验收。",
        "slots": [
          {
            "answer": "1～2",
            "choices": [
              "1～2",
              "1～3",
              "1～5"
            ],
            "why": "部署 IoT 采集终端并接入电表/楼宇自控/储能/充电平台接口；建立数据质量监控（完整率、缺失告警）；收集历史负荷、天气、电价数据训练初版预测模型；测定负荷/电费/响应时间基线值；验收输出：数据接入验收单；数据完整率≥99%的监测报告；基线测定报告；初版预测模型及回测精度报告；责任人：IoT 集成工程师、人工智能训练师、能源管理员。",
            "accepted": [
              "1-2",
              "1至2"
            ],
            "matchRule": {}
          },
          {
            "answer": "3～5",
            "choices": [
              "3～5",
              "2～4",
              "3～8"
            ],
            "why": "用历史数据仿真削峰策略效果；选定部分楼宇/充电区试点：预测→人工确认→网关执行→反馈闭环全流程跑通；演练数据缺失与指令失败两条异常路径；根据试点修正阈值与策略；验收输出：仿真评估报告；试点运行报告（含响应时间实测≤5分钟、削峰量实测）；异常场景演练记录；责任人：人工智能训练师、能源管理员、值班运维。",
            "accepted": [
              "3-5",
              "3至5"
            ],
            "matchRule": {}
          },
          {
            "answer": "6～8",
            "choices": [
              "6～8",
              "5～7",
              "8～10"
            ],
            "why": "全园区推广上线；人员培训与值班制度落地；按四项验收指标连续观测并出具验收报告；建立月度复盘与模型迭代机制；验收输出：上线报告；四项验收指标达成证明（负荷≤1478.4kW、电费≤115万、完整率≥99%、响应≤5分钟）；运维手册与培训记录；责任人：项目经理、能源管理员、人工智能训练师。",
            "accepted": [
              "6-8",
              "6至8"
            ],
            "matchRule": {}
          }
        ],
        "hint": "按题目指定的三个阶段填写关键任务、验收输出和主要责任人。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：实施与运营设计",
        "tablePractice": {
          "table": 1,
          "rows": null,
          "cells": {
            "0-1": "第{{0}}周",
            "1-1": "第{{1}}周",
            "2-1": "第{{2}}周"
          }
        }
      },
      {
        "id": "b3-9",
        "title": "明确人机协作边界",
        "goal": "按老师参考答案区分系统自动工作与工作人员的审批、核查和应急职责。",
        "code": "能源管理员：{{}}、运行边界规则调整。\n运维人员：{{}}。\n值班人员：执行失败时{{}}。\n管理层：验收指标认定与策略效果复盘。",
        "solution": "能源管理员：高风险策略的审批确认、运行边界规则调整。\n运维人员：仪表离线核查、设备故障处置。\n值班人员：执行失败时人工接管与应急处置。\n管理层：验收指标认定与策略效果复盘。",
        "slots": [
          {
            "answer": "高风险策略的审批确认",
            "choices": [
              "高风险策略的审批确认",
              "自动绕过审批",
              "删除异常记录"
            ],
            "accepted": [
              "高风险策略审批"
            ],
            "why": "能源管理员负责高风险策略的审批确认及运行边界规则调整。",
            "matchRule": {}
          },
          {
            "answer": "仪表离线核查、设备故障处置",
            "choices": [
              "仪表离线核查、设备故障处置",
              "自动批准高风险策略",
              "取消设备维护"
            ],
            "accepted": [],
            "why": "运维人员负责仪表离线核查及设备故障处置。",
            "matchRule": {
              "groups": [
                [
                  "离线",
                  "仪表"
                ],
                [
                  "核查",
                  "检查"
                ],
                [
                  "故障"
                ],
                [
                  "处置",
                  "处理"
                ]
              ]
            }
          },
          {
            "answer": "人工接管与应急处置",
            "choices": [
              "人工接管与应急处置",
              "忽略执行失败",
              "继续盲目下发"
            ],
            "accepted": [
              "人工接管和应急处置"
            ],
            "why": "执行失败时，值班人员负责人工接管与应急处置。",
            "matchRule": {
              "groups": [
                [
                  "人工接管"
                ],
                [
                  "应急处置",
                  "应急处理"
                ]
              ]
            }
          }
        ],
        "hint": "系统负责建议和执行经批准的方案；工作人员负责决策与兜底。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：实施与运营设计",
        "tablePractice": {
          "table": 2,
          "rows": null,
          "cells": {
            "1-1": "能源管理员：{{0}}、运行边界规则的调整；运维人员：{{1}}；值班人员：执行失败时的{{2}}；管理层：验收指标认定与策略效果复盘。"
          }
        }
      },
      {
        "id": "b3-10",
        "title": "制定三类运行风险控制措施",
        "goal": "围绕题目指定的采集异常、季节或业态变化、指令或设备异常三类风险填写控制措施。",
        "code": "采集异常：缺失超过5分钟重试并标记；仍无数据用最近可靠值临时估计并通知运维。\n预测失准：监测预测误差，季节切换和业态变更时触发{{}}。\n指令或设备异常：60秒无成功反馈即停发、恢复安全策略并通知值班；设备故障转入{{}}。",
        "solution": "采集异常：缺失超过5分钟重试并标记；仍无数据用最近可靠值临时估计并通知运维。\n预测失准：监测预测误差，季节切换和业态变更时触发模型再训练或人工修正。\n指令或设备异常：60秒无成功反馈即停发、恢复安全策略并通知值班；设备故障转入人工调度模式。",
        "slots": [
          {
            "answer": "模型再训练或人工修正",
            "choices": [
              "模型再训练或人工修正",
              "删除预测误差",
              "长期沿用失准模型"
            ],
            "accepted": [
              "模型再训练或人工调整"
            ],
            "why": "监测预测误差，在季节切换和业态变更时触发模型再训练或人工修正；阈值调整须审批留痕。",
            "matchRule": {
              "groups": [
                [
                  "再训练",
                  "重新训练",
                  "人工修正",
                  "人工调整"
                ]
              ]
            }
          },
          {
            "answer": "人工调度模式",
            "choices": [
              "人工调度模式",
              "无限重发指令",
              "默认设备已经执行"
            ],
            "accepted": [
              "人工调度"
            ],
            "why": "60秒无成功反馈即停发、恢复安全策略并通知值班；设备故障转入人工调度模式。",
            "matchRule": {}
          }
        ],
        "hint": "三类风险逐项对应，写清发现条件、控制动作和负责人员。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：实施与运营设计",
        "tablePractice": {
          "table": 3,
          "rows": null,
          "cells": {
            "1-1": "建立预测误差监控（每日比对预测 vs 实际，如 MAPE 超阈值告警）；季节切换与业态变更（新商户入驻/大型活动）时触发{{0}}；保留人工调整峰值阈值的权限，调整须审批留痕。",
            "2-1": "60秒无成功反馈即停止下发、恢复安全策略并通知值班；执行前校验设备在线状态；定期对控制链路做演练测试；设备故障转入{{1}}，故障记录纳入设备维护计划。"
          }
        }
      }
    ],
    "count": 10,
    "originalCode": "智能产品应用方案设计\n\n实施与运营设计",
    "referenceCode": "",
    "downloadPath": "materials/b3-reference.html",
    "referenceHTML": "<h1>B3 · 智慧园区能源预测与智能调度解决方案设计</h1><p>参考解法（整理版），不代表唯一表述或官方评分细则。</p><h4>业务背景</h4>\n<p>你是某智慧园区运营企业的人工智能训练师，正在参与园区能源管理系统升级。园区包含办公楼、商业配套、地下车库、新能源汽车充电区和储能设备。经调研，目前能源管理存在以下问题：</p>\n<ol><li>园区最大用电负荷为 1680kW，高峰负荷主要依靠人工观察后处理，容易产生需量费用。</li><li>月均电费约 125 万元，空调、储能和充电设施缺少统一调度。</li><li>能源数据完整率为 91%，部分仪表离线后不能及时补偿或告警。</li><li>从发现高峰风险到执行调节的平均时间为 25 分钟，响应速度较慢。</li><li>设备数据、预测结果、控制指令和执行反馈分散，无法形成完整追溯记录。</li></ol>\n<p>企业计划应用以下 3 类智能产品：</p>\n<ul><li>能源 IoT 采集终端</li><li>AI 负荷预测与能源优化平台</li><li>智能控制网关</li></ul>\n<p>园区现有电表、楼宇自控系统、储能系统和充电平台均可通过接口交换数据。AI 平台可结合历史负荷、天气预报、工作日类型、园区活动和分时电价，输出未来 30 分钟负荷预测、峰值风险及推荐调度方案。智能控制网关可接收经过确认的策略，对非关键空调负荷、储能充放电和充电设施功率进行调节，并返回执行状态。</p>\n<h4>运行约束</h4>\n<ol><li>能源数据连续缺失超过 5 分钟时，系统重试采集并标记异常；重试后仍无数据则使用最近可靠值形成临时估计，同时通知运维人员核查。</li><li>预测未来 30 分钟园区负荷达到或超过 1500kW 时，系统判定为峰值风险并生成削峰建议。</li><li>办公区域温度应保持在 24～27℃，消防、安防、数据机房等关键负荷不得自动削减。</li><li>调节指令发出后 60 秒内未收到成功反馈，应停止继续下发，恢复安全策略并通知值班人员。</li><li>策略、审批人、设备指令、执行结果和时间必须完整留痕；高风险策略必须由能源管理员确认后执行。</li></ol><h2>智能产品应用方案设计</h2><p>（1）完成智能产品应用设计表，写明每类产品解决的业务问题、主要数据输入、系统输出或下游动作。（2）根据题目给出的约束，完成运行规则表，填写判断条件和处理动作，覆盖能源数据连续缺失、预测出现峰值风险、调度方案触及运行边界、控制指令执行失败。（3）绘制多产品协同流程图：体现产品之间的信息传递、业务判断及分支处理、人机协作和结果闭环，主要节点控制在 6～8 个。</p><table><caption>智能产品应用设计表</caption><thead><tr><th>智能产品</th><th>解决的业务问题</th><th>主要数据输入</th><th>系统输出或下游动作</th></tr></thead><tbody><tr><td>能源 IoT 采集终端</td><td>能源数据完整率仅91%、仪表离线不能及时补偿告警；数据分散无法追溯</td><td>电表计量数据、楼宇自控系统数据、储能系统状态、充电平台数据（经接口汇聚）</td><td>标准化实时能源数据流（含时间戳、测点ID、数据质量标记）；离线/缺失告警；数据补采与临时估计值</td></tr><tr><td>AI 负荷预测与能源优化平台</td><td>高峰负荷靠人工观察、需量费用高；空调/储能/充电缺少统一调度</td><td>历史负荷曲线、天气预报、工作日类型、园区活动日历、分时电价</td><td>未来30分钟负荷预测、峰值风险判定（≥1500kW）、推荐调度方案（削峰策略）；策略推送至确认与执行环节</td></tr><tr><td>智能控制网关</td><td>从发现风险到执行调节平均25分钟，响应慢；执行结果无反馈闭环</td><td>经确认（高风险策略须能源管理员批准）的调度策略指令</td><td>对非关键空调负荷、储能充放电、充电设施功率的调节指令；60秒内执行状态反馈；失败时恢复安全策略并告警</td></tr></tbody></table><table><caption>运行规则表</caption><thead><tr><th>情况</th><th>判断条件</th><th>处理动作</th></tr></thead><tbody><tr><td>能源数据连续缺失</td><td>连续缺失超过 5 分钟</td><td>系统重试采集并标记异常；重试仍无数据→用最近可靠值形成临时估计，同时通知运维人员现场核查</td></tr><tr><td>预测出现峰值风险</td><td>未来30分钟园区负荷预测 ≥ 1500 kW</td><td>判定峰值风险，生成削峰建议（调非关键空调、储能放电、限制充电功率），推送能源管理员确认后下发执行</td></tr><tr><td>调度方案触及运行边界</td><td>方案将使办公区域温度超出 24~27℃，或涉及消防/安防/数据机房等关键负荷</td><td>拒绝执行该方案（关键负荷不得自动削减），退回平台重新生成替代策略，并记录越界拦截事件</td></tr><tr><td>控制指令执行失败</td><td>指令发出后 60 秒内未收到成功反馈</td><td>停止继续下发指令，恢复安全策略（回退到调节前状态），通知值班人员处理，全程留痕</td></tr></tbody></table><h4>规范业务流程图（参考方案）</h4><div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1220px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1220\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 105V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M255 190H210\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"232\" y=\"178\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M120 134V110H380V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"175\" y=\"102\" text-anchor=\"middle\" class=\"flow-edge-label\">重试／降级校验</text><path d=\"M380 245V295\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"272\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 415V465\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"445\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 355H750V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"651\" y=\"343\" text-anchor=\"middle\" class=\"flow-edge-label\">否：记录后持续监测</text><path d=\"M380 555V600\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M520 510H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"543\" y=\"495\" text-anchor=\"middle\" class=\"flow-edge-label\">约束</text><path d=\"M240 665H220V510H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"174\" y=\"545\" text-anchor=\"middle\" class=\"flow-edge-label\">否：修改后重审</text><path d=\"M380 730V780\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"758\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 850V900\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M380 1020V1062\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"1050\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M510 960H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"535\" y=\"948\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1015V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"637\" y=\"1106\" text-anchor=\"middle\" class=\"flow-edge-label\">处置结果</text><path d=\"M380 1177V1190H15V60H250\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"145\" y=\"1180\" text-anchor=\"middle\" class=\"flow-edge-label\">持续监测与反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:250.0px;top:15.0px;width:260px;height:90px\"><div class=\"flow-text\">① IoT终端持续采集<br>电表／楼控／储能／充电数据<br>标准化数据、质量标记与离线事件</div></div><div class=\"flow-box flow-decision\" style=\"left:255.0px;top:135.0px;width:250px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 250 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"125.0,1 249,55.0 125.0,109 1,55.0\"/></svg><div class=\"flow-text\">② 数据是否可用？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:134.0px;width:180px;height:112px\"><div class=\"flow-text\">连续缺失 &gt;5分钟：重试<br>仍失败→最近可靠值估计<br>保留估计标志并通知运维<br>降级数据重新校验</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:295.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ AI预测未来30分钟<br>负荷 ≥1500kW？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:465.0px;width:280px;height:90px\"><div class=\"flow-text\">④ AI平台生成削峰建议<br>未来30分钟预测、风险与削峰建议<br>运行边界校验</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:460.0px;width:180px;height:100px\"><div class=\"flow-text\">温度24～27℃<br>不得自动削减关键负荷<br>越界→修改／重新优化</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:600.0px;width:280px;height:130px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 130\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,65.0 140.0,129 1,65.0\"/></svg><div class=\"flow-text\">⑤ 边界合规且<br>必要审批已通过？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:613.0px;width:180px;height:104px\"><div class=\"flow-text\">高风险由能源管理员审批<br>未批准不得执行<br>低风险须在授权范围内</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:780.0px;width:260px;height:70px\"><div class=\"flow-text\">⑥ 控制网关执行<br>执行已校验策略并返回状态</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:900.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 60秒内收到<br>成功反馈？</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:905.0px;width:180px;height:110px\"><div class=\"flow-text\">明确失败或超时：<br>停止继续下发并恢复安全策略<br>通知值班<br>核对实际设备状态</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:1062.5px;width:280px;height:115px\"><div class=\"flow-text\">⑧ 结果留痕与实际负荷复核<br>记录策略、审批、指令与结果<br>反馈至持续采集与模型改进</div></div></div></div><h2>实施与运营设计</h2><p>（1）计算并填写验收指标：最大用电负荷比现状降低 12%；月均电费比现状降低 8%；能源数据完整率达到 99% 以上；峰值风险平均响应时间缩短至 5 分钟以内。（2）制定三阶段实施计划（总周期 8 周）：数据接入与基线建立（第 1～2 周）、策略仿真与小范围试点（第 3～5 周）、推广上线与指标验收（第 6～8 周），写出各阶段关键任务、验收输出和主要责任人。（3）明确人机协作边界，说明智能系统和工作人员的工作边界。（4）制定运行风险控制措施，包括仪表离线或采集数据异常、负荷预测随季节和业态变化失准、控制指令未执行或设备状态异常。</p><table><caption>验收指标表</caption><thead><tr><th>指标</th><th>上线前</th><th>建设目标</th><th>验收目标值（计算结果）</th></tr></thead><tbody><tr><td>最大用电负荷</td><td>1680 kW</td><td>降低 12%</td><td>≤ 1478.4 kW（1680 × (1−12%) = 1680 × 0.88）</td></tr><tr><td>月均电费</td><td>125 万元</td><td>降低 8%</td><td>≤ 115 万元（125 × (1−8%) = 125 × 0.92）</td></tr><tr><td>能源数据完整率</td><td>91%</td><td>达到 99% 以上</td><td>≥ 99%</td></tr><tr><td>峰值风险平均响应时间</td><td>25 分钟</td><td>缩短至 5 分钟以内</td><td>≤ 5 分钟</td></tr></tbody></table><table><caption>三阶段实施计划表</caption><thead><tr><th>阶段名称</th><th>时间周期</th><th>关键任务</th><th>验收输出</th><th>主要责任人</th></tr></thead><tbody><tr><td>数据接入与基线建立</td><td>第1~2周</td><td>部署 IoT 采集终端并接入电表/楼宇自控/储能/充电平台接口；建立数据质量监控（完整率、缺失告警）；收集历史负荷、天气、电价数据训练初版预测模型；测定负荷/电费/响应时间基线值</td><td>数据接入验收单；数据完整率≥99%的监测报告；基线测定报告；初版预测模型及回测精度报告</td><td>IoT 集成工程师、人工智能训练师、能源管理员</td></tr><tr><td>策略仿真与小范围试点</td><td>第3~5周</td><td>用历史数据仿真削峰策略效果；选定部分楼宇/充电区试点：预测→人工确认→网关执行→反馈闭环全流程跑通；演练数据缺失与指令失败两条异常路径；根据试点修正阈值与策略</td><td>仿真评估报告；试点运行报告（含响应时间实测≤5分钟、削峰量实测）；异常场景演练记录</td><td>人工智能训练师、能源管理员、值班运维</td></tr><tr><td>推广上线与指标验收</td><td>第6~8周</td><td>全园区推广上线；人员培训与值班制度落地；按四项验收指标连续观测并出具验收报告；建立月度复盘与模型迭代机制</td><td>上线报告；四项验收指标达成证明（负荷≤1478.4kW、电费≤115万、完整率≥99%、响应≤5分钟）；运维手册与培训记录</td><td>项目经理、能源管理员、人工智能训练师</td></tr></tbody></table><table><caption>人机协作边界</caption><thead><tr><th>责任主体</th><th>工作边界</th></tr></thead><tbody><tr><td>智能系统</td><td>7×24 数据采集与缺失兜底（重试/临时估计/告警）；负荷预测与峰值风险判定；生成调度方案并做运行边界校验；执行经确认的控制指令；60秒超时保护与自动恢复安全策略；全流程留痕与统计报表。</td></tr><tr><td>工作人员</td><td>能源管理员：高风险策略的审批确认、运行边界规则的调整；运维人员：仪表离线核查、设备故障处置；值班人员：执行失败时的人工接管与应急处置；管理层：验收指标认定与策略效果复盘。</td></tr></tbody></table><table><caption>运行风险控制措施表</caption><thead><tr><th>风险</th><th>控制措施</th></tr></thead><tbody><tr><td>仪表离线或采集数据异常</td><td>缺失超5分钟自动重试并标记异常；仍无数据用最近可靠值临时估计并显著标记为估计值（不用于结算口径），同时告警运维限时核查；每日输出数据完整率报表，低于99%触发专项整改；关键测点配置冗余采集链路。</td></tr><tr><td>负荷预测随季节和业态变化失准</td><td>建立预测误差监控（每日比对预测 vs 实际，如 MAPE 超阈值告警）；季节切换与业态变更（新商户入驻/大型活动）时触发模型再训练或人工修正；保留人工调整峰值阈值的权限，调整须审批留痕。</td></tr><tr><td>控制指令未执行或设备状态异常</td><td>60秒无成功反馈即停止下发、恢复安全策略并通知值班；执行前校验设备在线状态；定期对控制链路做演练测试；设备故障转入人工调度模式，故障记录纳入设备维护计划。</td></tr></tbody></table><p>系统“建议+执行被批准的方案”，人“决策+兜底”；任何触及安全边界的操作，系统只有拒绝权没有执行权。</p>"
  },
  "b4": {
    "id": "b4",
    "kind": "case",
    "category": "培训与指导 · B4",
    "title": "B4 · 智能客服工单辅助系统上岗培训与现场指导方案设计",
    "materialHTML": "<h4>业务背景</h4>\n<p>你作为人工智能训练师二级人员，需为三级/高级工及以下级别人员开展智能客服工单辅助系统培训。该系统可完成对话摘要、客户意图识别、知识条目推荐和回复草稿生成。请完成以下任务：</p>\n<ol><li>编制一份智能客服工单辅助系统培训计划，分别写出 1 项知识培训内容和 1 项技术培训内容。</li><li>针对技术培训中的“人工智能回复核验与纠错”，写出 1 个最为优先的培训关键点，并制定相应的教学方法。</li><li>简要阐述如何通过培训，使学员掌握知识依据核对、错误回复修订及不确定结果处理，写出培训思路。</li></ol>",
    "tasks": [
      {
        "id": "b4t1",
        "title": "编制培训计划",
        "promptHTML": "<p>分别写出 1 项知识培训内容和 1 项技术培训内容，说明培训对象、目标、模块安排、教学方法与产出。</p>",
        "answerHTML": "<p>分别安排1项知识培训和1项技术培训，围绕“懂边界与责任—会核验与纠错—独立实操验证”组织培训。</p><table><caption>1 项知识培训</caption><tbody><tr><th>培训主题</th><td>智能客服系统能力边界与人工审核责任</td></tr><tr><th>培训对象</th><td>三级／高级工及以下的客服与工单处理人员。</td></tr><tr><th>培训目标</th><td>理解系统能做什么、不能做什么，识别无依据内容，明确发送前的人工审核责任。</td></tr><tr><th>培训内容</th><td>对话摘要、客户意图识别、知识条目推荐与回复草稿的功能；AI可能生成无依据内容；知识库有效期、隐私权限与人工审核责任。</td></tr><tr><th>教学方法</th><td>讲解系统功能与风险边界，结合过期条款、虚构承诺和敏感信息案例开展辨析。</td></tr><tr><th>考核与产出</th><td>完成知识依据与风险识别小测，说明哪些结论需要核验、哪些情形必须转人工。</td></tr></tbody></table><table><caption>1 项技术培训</caption><tbody><tr><th>培训主题</th><td>人工智能回复核验与纠错</td></tr><tr><th>培训对象</th><td>三级／高级工及以下的客服与工单处理人员。</td></tr><tr><th>培训目标</th><td>能定位有效知识、核对适用条件、修订错误回复，并升级处理冲突和不确定结果。</td></tr><tr><th>培训内容</th><td>定位推荐知识条目，核对版本、客户事实及适用条件；核验金额、期限、退款条件与服务承诺；修订错误承诺；依据不足时澄清或升级，并记录证据与纠错理由。</td></tr><tr><th>教学方法</th><td>教师用带错误工单示范定位依据与纠错；学员分组实操，同伴交叉复核；教师针对漏检现场纠正。</td></tr><tr><th>考核与产出</th><td>提交修订前后回复、知识依据及纠错理由；独立处理正常、有错误、依据不足三类工单，关键风险漏检者补训复测。</td></tr></tbody></table><p>可参考知识讲解20分钟、技术示范与分组实操50分钟、独立考核与反馈20分钟的90分钟安排；这只是教学安排示例，题目没有限定培训天数或强制时长。技术环节可按教师示范10分钟、分组实操30分钟、交叉复核10分钟组织。</p>",
        "trainingPlan": [
          {
            "id": "knowledge",
            "title": "1 项知识培训",
            "values": {
              "topic": "智能客服系统能力边界与人工审核责任",
              "audience": "三级／高级工及以下的客服与工单处理人员。",
              "goal": "理解系统能做什么、不能做什么，识别无依据内容，明确发送前的人工审核责任。",
              "content": "对话摘要、客户意图识别、知识条目推荐与回复草稿的功能；AI可能生成无依据内容；知识库有效期、隐私权限与人工审核责任。",
              "method": "讲解系统功能与风险边界，结合过期条款、虚构承诺和敏感信息案例开展辨析。",
              "output": "完成知识依据与风险识别小测，说明哪些结论需要核验、哪些情形必须转人工。"
            },
            "practice": {
              "content": "对话摘要、意图识别、知识推荐与回复草稿的能力边界；知识有效期、隐私权限与 {{0}}。"
            }
          },
          {
            "id": "technical",
            "title": "1 项技术培训",
            "values": {
              "topic": "人工智能回复核验与纠错",
              "audience": "三级／高级工及以下的客服与工单处理人员。",
              "goal": "能定位有效知识、核对适用条件、修订错误回复，并升级处理冲突和不确定结果。",
              "content": "定位推荐知识条目，核对版本、客户事实及适用条件；核验金额、期限、退款条件与服务承诺；修订错误承诺；依据不足时澄清或升级，并记录证据与纠错理由。",
              "method": "教师用带错误工单示范定位依据与纠错；学员分组实操，同伴交叉复核；教师针对漏检现场纠正。",
              "output": "提交修订前后回复、知识依据及纠错理由；独立处理正常、有错误、依据不足三类工单，关键风险漏检者补训复测。"
            },
            "practice": {
              "topic": "{{1}}"
            }
          }
        ]
      },
      {
        "id": "b4t2",
        "title": "优先培训关键点及教学方法",
        "promptHTML": "<p>针对“人工智能回复核验与纠错”，写出 1 个最为优先的培训关键点，并制定相应的教学方法。</p>",
        "answerHTML": "<p>最优先的关键点是“回复发布前，逐条核对关键结论是否有当前有效、适用该客户情形的知识依据”。尤其核对金额、期限、退款条件和服务承诺，不能因为 AI 回复流畅就直接发送。采用带错误工单的示范与练习：教师展示一份包含过期退款条款或虚构承诺的草稿，示范定位知识条目、核对版本及适用范围、标出证据缺口并修订。学员再完成相似案例，说明每处修改依据；同伴复核，教师针对漏检现场纠正。</p>"
      },
      {
        "id": "b4t3",
        "title": "培训思路与考核",
        "promptHTML": "<p>简要阐述如何通过培训，使学员掌握知识依据核对、错误回复修订及不确定结果处理，写出培训思路。</p>",
        "answerHTML": "<p>先用正常案例建立“看工单事实—找知识依据—核对关键结论—修订草稿—审核发布—记录反馈”的顺序；再加入过期知识、政策冲突及信息不足案例，训练识别不能下结论的情形。依据不足时先向客户澄清或转主管，不编造答案，也不擅自承诺。建议实操合格标准为关键事实和政策依据核对全部正确、修订后不存在无依据承诺，不确定问题均按流程升级，证据版本与纠错理由记录完整。培训后一周抽检实际工单，检查同类错误是否减少；仍有关键漏检则针对性补训。</p>"
      }
    ],
    "steps": [
      {
        "id": "b4-1",
        "title": "制定知识与技术培训内容",
        "goal": "面向三级／高级工及以下人员，分别安排知识和技术训练。",
        "code": "知识培训：系统能力边界、知识有效期、隐私权限与 {{}}。\n技术培训：{{}}，提交修订前后回复和证据。\n可建议 90 分钟安排，但这不是题设强制时长。",
        "solution": "知识培训：系统能力边界、知识有效期、隐私权限与 人工审核责任。\n技术培训：人工智能回复核验与纠错，提交修订前后回复和证据。\n可建议 90 分钟安排，但这不是题设强制时长。",
        "slots": [
          {
            "answer": "人工审核责任",
            "choices": [
              "人工审核责任",
              "只要流畅就能直接发送",
              "无需核验来源"
            ],
            "why": "学员需理解 AI 可能产生无依据内容，发送前由人工审核。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "人工",
                  "人员",
                  "客服"
                ],
                [
                  "审核",
                  "审查",
                  "核验",
                  "检查"
                ],
                [
                  "责任",
                  "负责",
                  "职责"
                ]
              ],
              "aliases": [
                "人工审核",
                "人工把关"
              ]
            }
          },
          {
            "answer": "人工智能回复核验与纠错",
            "choices": [
              "人工智能回复核验与纠错",
              "仅记住登录密码",
              "只练字体排版"
            ],
            "why": "技术训练要定位知识、核对适用条件、修订错误与升级不确定问题。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "回复",
                  "回答",
                  "草稿"
                ],
                [
                  "核验",
                  "核对",
                  "检查"
                ],
                [
                  "纠错",
                  "修订",
                  "修正"
                ]
              ]
            }
          }
        ],
        "hint": "知识讲清风险和边界，技术练会核验与纠错。",
        "context": "",
        "taskIndex": 0,
        "examComments": "原题任务：编制培训计划"
      },
      {
        "id": "b4-2",
        "title": "锁定最优先培训关键点",
        "goal": "回复金额、期限、退款条件、服务承诺都可能直接影响客户权益。",
        "code": "发布前逐条确认关键结论有 {{}} 支持。\n不能因为回复 {{}} 就直接发送。",
        "solution": "发布前逐条确认关键结论有 当前有效且适用客户情形的知识依据 支持。\n不能因为回复 语言流畅 就直接发送。",
        "slots": [
          {
            "answer": "当前有效且适用客户情形的知识依据",
            "choices": [
              "当前有效且适用客户情形的知识依据",
              "任意过期条款",
              "模型自信程度"
            ],
            "why": "核对知识版本、有效期和客户适用范围。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "有效",
                  "最新",
                  "当前",
                  "未过期"
                ],
                [
                  "适用",
                  "客户情况",
                  "客户情形"
                ],
                [
                  "知识",
                  "依据",
                  "证据",
                  "条款"
                ]
              ]
            }
          },
          {
            "answer": "语言流畅",
            "choices": [
              "语言流畅",
              "依据不足需澄清",
              "存在政策冲突"
            ],
            "why": "流畅不等于正确，不能替代知识证据。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "表达流畅",
                "说得流畅",
                "文字流畅",
                "通顺",
                "表达通顺"
              ]
            }
          }
        ],
        "hint": "最优先的一个点：发送前逐条核对有效且适用的依据。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：优先培训关键点及教学方法"
      },
      {
        "id": "b4-3",
        "title": "用错误工单开展教学",
        "goal": "教学方法要能让学员实际发现并修正错误，而非只听讲。",
        "code": "教师展示过期条款或虚构承诺 → {{}}\n→ 学员处理相似案例并说明修改依据\n→ {{}} → 教师针对漏检现场纠正。",
        "solution": "教师展示过期条款或虚构承诺 → 示范定位知识、核对版本和修订草稿\n→ 学员处理相似案例并说明修改依据\n→ 同伴交叉复核 → 教师针对漏检现场纠正。",
        "slots": [
          {
            "answer": "示范定位知识、核对版本和修订草稿",
            "choices": [
              "示范定位知识、核对版本和修订草稿",
              "示范直接发送错误回复",
              "只讲抽象概念"
            ],
            "why": "教师把核验和纠错步骤展示给学员。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "知识",
                  "依据"
                ],
                [
                  "版本",
                  "有效期"
                ],
                [
                  "修订",
                  "纠错",
                  "修改"
                ]
              ]
            }
          },
          {
            "answer": "同伴交叉复核",
            "choices": [
              "同伴交叉复核",
              "只看提交速度",
              "不再检查结果"
            ],
            "why": "交叉复核帮助发现漏检，再由教师定向反馈。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "同伴复核",
                "交叉检查",
                "互相复核",
                "同学互评",
                "小组互查"
              ]
            }
          }
        ],
        "hint": "示范、实操、交叉复核、现场纠正。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：优先培训关键点及教学方法"
      },
      {
        "id": "b4-4",
        "title": "训练不确定结果的处理",
        "goal": "用正常、过期、冲突和信息不足案例训练完整工作顺序。",
        "code": "工单事实 → 知识依据 → 核对结论 → 修订草稿 → 审核发布 → 记录反馈。\n依据不足或政策冲突 → {{}}，不编造答案、不擅自承诺。",
        "solution": "工单事实 → 知识依据 → 核对结论 → 修订草稿 → 审核发布 → 记录反馈。\n依据不足或政策冲突 → 先澄清或转主管，不编造答案、不擅自承诺。",
        "slots": [
          {
            "answer": "先澄清或转主管",
            "choices": [
              "先澄清或转主管",
              "凭经验作确定承诺",
              "自动发送模型原文"
            ],
            "why": "不能在缺乏依据时给出确定结论，应按流程澄清或升级并留痕。",
            "accepted": [],
            "matchRule": {
              "aliases": [
                "先澄清再升级",
                "向客户澄清或转主管",
                "澄清或升级",
                "先核实再转主管",
                "先澄清",
                "转主管",
                "升级处理"
              ]
            }
          }
        ],
        "hint": "不会答时也要会处理：澄清、升级、保留证据。",
        "context": "",
        "taskIndex": 2,
        "examComments": "原题任务：培训思路与考核"
      },
      {
        "id": "b4-5",
        "title": "设定考核与训后复查",
        "goal": "考核应覆盖正常、错误、依据不足三类工单，并检查实际迁移效果。",
        "code": "合格要求：关键事实和政策核验正确、无无依据承诺、不确定问题升级、证据留痕完整。\n仍有关键风险漏检者 → {{}}。\n训后一周抽检实际工单，检查 {{}}。",
        "solution": "合格要求：关键事实和政策核验正确、无无依据承诺、不确定问题升级、证据留痕完整。\n仍有关键风险漏检者 → 针对性补训并复测。\n训后一周抽检实际工单，检查 同类错误是否减少。",
        "slots": [
          {
            "answer": "针对性补训并复测",
            "choices": [
              "针对性补训并复测",
              "仍直接上岗",
              "仅口头表扬"
            ],
            "why": "关键风险漏检不能被高完成速度抵消，需要补训复测。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "补训",
                  "再培训",
                  "针对性培训"
                ],
                [
                  "复测",
                  "重新考核",
                  "再考核"
                ]
              ]
            }
          },
          {
            "answer": "同类错误是否减少",
            "choices": [
              "同类错误是否减少",
              "是否背熟页面颜色",
              "仅看登录次数"
            ],
            "why": "训后抽检验证实际任务表现，不仅看课堂小测或签到。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "同类错误",
                  "类似错误",
                  "相同错误",
                  "同类问题"
                ],
                [
                  "减少",
                  "下降",
                  "降低",
                  "改善"
                ]
              ]
            }
          }
        ],
        "hint": "课堂能做对，还要在实际工单中保持正确。",
        "context": "",
        "taskIndex": 2,
        "examComments": "原题任务：培训思路与考核"
      }
    ],
    "count": 5,
    "originalCode": "编制培训计划\n\n优先培训关键点及教学方法\n\n培训思路与考核",
    "referenceCode": "",
    "downloadPath": "materials/b4-reference.html",
    "referenceHTML": "<h1>B4 · 智能客服工单辅助系统上岗培训与现场指导方案设计</h1><p>参考解法（整理版），不代表唯一表述或官方评分细则。</p><h4>业务背景</h4>\n<p>你作为人工智能训练师二级人员，需为三级/高级工及以下级别人员开展智能客服工单辅助系统培训。该系统可完成对话摘要、客户意图识别、知识条目推荐和回复草稿生成。请完成以下任务：</p>\n<ol><li>编制一份智能客服工单辅助系统培训计划，分别写出 1 项知识培训内容和 1 项技术培训内容。</li><li>针对技术培训中的“人工智能回复核验与纠错”，写出 1 个最为优先的培训关键点，并制定相应的教学方法。</li><li>简要阐述如何通过培训，使学员掌握知识依据核对、错误回复修订及不确定结果处理，写出培训思路。</li></ol><h2>编制培训计划</h2><p>分别写出 1 项知识培训内容和 1 项技术培训内容，说明培训对象、目标、模块安排、教学方法与产出。</p><p>分别安排1项知识培训和1项技术培训，围绕“懂边界与责任—会核验与纠错—独立实操验证”组织培训。</p><table><caption>1 项知识培训</caption><tbody><tr><th>培训主题</th><td>智能客服系统能力边界与人工审核责任</td></tr><tr><th>培训对象</th><td>三级／高级工及以下的客服与工单处理人员。</td></tr><tr><th>培训目标</th><td>理解系统能做什么、不能做什么，识别无依据内容，明确发送前的人工审核责任。</td></tr><tr><th>培训内容</th><td>对话摘要、客户意图识别、知识条目推荐与回复草稿的功能；AI可能生成无依据内容；知识库有效期、隐私权限与人工审核责任。</td></tr><tr><th>教学方法</th><td>讲解系统功能与风险边界，结合过期条款、虚构承诺和敏感信息案例开展辨析。</td></tr><tr><th>考核与产出</th><td>完成知识依据与风险识别小测，说明哪些结论需要核验、哪些情形必须转人工。</td></tr></tbody></table><table><caption>1 项技术培训</caption><tbody><tr><th>培训主题</th><td>人工智能回复核验与纠错</td></tr><tr><th>培训对象</th><td>三级／高级工及以下的客服与工单处理人员。</td></tr><tr><th>培训目标</th><td>能定位有效知识、核对适用条件、修订错误回复，并升级处理冲突和不确定结果。</td></tr><tr><th>培训内容</th><td>定位推荐知识条目，核对版本、客户事实及适用条件；核验金额、期限、退款条件与服务承诺；修订错误承诺；依据不足时澄清或升级，并记录证据与纠错理由。</td></tr><tr><th>教学方法</th><td>教师用带错误工单示范定位依据与纠错；学员分组实操，同伴交叉复核；教师针对漏检现场纠正。</td></tr><tr><th>考核与产出</th><td>提交修订前后回复、知识依据及纠错理由；独立处理正常、有错误、依据不足三类工单，关键风险漏检者补训复测。</td></tr></tbody></table><p>可参考知识讲解20分钟、技术示范与分组实操50分钟、独立考核与反馈20分钟的90分钟安排；这只是教学安排示例，题目没有限定培训天数或强制时长。技术环节可按教师示范10分钟、分组实操30分钟、交叉复核10分钟组织。</p><h2>优先培训关键点及教学方法</h2><p>针对“人工智能回复核验与纠错”，写出 1 个最为优先的培训关键点，并制定相应的教学方法。</p><p>最优先的关键点是“回复发布前，逐条核对关键结论是否有当前有效、适用该客户情形的知识依据”。尤其核对金额、期限、退款条件和服务承诺，不能因为 AI 回复流畅就直接发送。采用带错误工单的示范与练习：教师展示一份包含过期退款条款或虚构承诺的草稿，示范定位知识条目、核对版本及适用范围、标出证据缺口并修订。学员再完成相似案例，说明每处修改依据；同伴复核，教师针对漏检现场纠正。</p><h2>培训思路与考核</h2><p>简要阐述如何通过培训，使学员掌握知识依据核对、错误回复修订及不确定结果处理，写出培训思路。</p><p>先用正常案例建立“看工单事实—找知识依据—核对关键结论—修订草稿—审核发布—记录反馈”的顺序；再加入过期知识、政策冲突及信息不足案例，训练识别不能下结论的情形。依据不足时先向客户澄清或转主管，不编造答案，也不擅自承诺。建议实操合格标准为关键事实和政策依据核对全部正确、修订后不存在无依据承诺，不确定问题均按流程升级，证据版本与纠错理由记录完整。培训后一周抽检实际工单，检查同类错误是否减少；仍有关键漏检则针对性补训。</p>"
  },
  "c": {
    "id": "c",
    "kind": "case",
    "category": "综合评审 · C",
    "title": "C · 大型场馆智能客流预测与疏导系统",
    "materialHTML": "<p>大型场馆在演唱会、赛事散场时，入口、通道与停车接驳区出现短时集中客流。现有系统只能展示当前人数，缺少风险预测、方案、人员调度和反馈闭环。</p><p>接入闸机、票务核验、区域客流传感器及工作人员移动终端数据，结合区域容量和近期变化，预测未来15分钟风险。达到阈值后生成入口分流、路线引导、人员调度建议，经值班负责人确认后发布，记录执行结果。</p><p>以下参考方案沿用老师课件的功能卡、配置、风险分级和四状态结构。除题设的15分钟与人工确认要求外，阈值、时限、验收值均为设计示例，需经场馆验证和审批；不是题设强制标准。</p>",
    "tasks": [
      {
        "id": "ct1",
        "title": "产品功能定义",
        "promptHTML": "<p>分别设计“客流态势监测”“疏导方案生成”“处置反馈闭环”三张功能卡，每项填写功能编号、名称、使用角色及触发条件、功能行为、输出结果和一条可量化验收标准。</p>",
        "answerHTML": "<h4>F-01 客流态势监测</h4><p>角色：值班监控员；活动启用时持续监测。融合闸机、票务、区域传感器和移动终端事件，按区域计算当前人数、密度、容量占比及未来15分钟人数趋势，展示风险等级和数据质量标记。输出分区看板和预测预警。验收示例：在约定负载和测量起止点下，区域状态更新延迟不超过10秒；通过历史回放验证。若选用课件的预测MAPE≤15%作为附加目标，须明确零人数处理和样本范围。</p><h4>F-02 疏导方案生成</h4><p>角色：值班负责人；预测风险或等待时间达到已配置阈值时触发。系统生成入口分流、路线引导和人员岗位建议，说明依据、目标区域和生效范围，推送负责人确认；可修改或驳回。输出带版本、待确认状态的方案及批准后的执行任务。验收示例：风险事件产生至可审核方案生成≤60秒；发布事件100%关联有效负责人确认记录，未确认不得发布。</p><h4>F-03 处置反馈闭环</h4><p>角色：现场工作人员与值班负责人；方案发布后启动。现场终端回传执行回执，系统对比执行前后客流，持续观察；无缓解则重新生成升级方案并再次确认，结束后归档。输出执行状态、效果曲线与可追溯档案。验收示例：抽检任务中，生成、确认、发布、执行回执、效果和结束记录完整率100%，可查询导出；未结束任务不能伪造结束记录。</p>"
      },
      {
        "id": "ct2",
        "title": "产品方案设计",
        "promptHTML": "<p>绘制6～8个主要节点的系统协同流程图，体现系统处理、业务判断及人员协作闭环；提供JSON配置（forecast_window_minutes、risk_threshold、queue_wait_threshold_minutes、manual_confirm_required）；设计输入输出接口的方向、来源或去向及关键字段；给出3项运营统计或审计内容。</p>",
        "answerHTML": "<h4>配置示例：严格JSON，不写注释</h4><pre>{\n  &quot;forecast_window_minutes&quot;: 15,\n  &quot;risk_threshold&quot;: 0.85,\n  &quot;queue_wait_threshold_minutes&quot;: 10,\n  &quot;manual_confirm_required&quot;: true,\n  &quot;data_refresh_seconds&quot;: 10,\n  &quot;escalation_minutes&quot;: 10\n}</pre><p>risk_threshold是预测人数/区域有效容量的占比阈值，不是模型置信概率。等待超过10分钟作为独立预警触发条件；15分钟预测窗口与确认后发布遵循题设。其余数值是可调整的方案设置。</p><h4>输入输出接口</h4><table><tr><th>方向与来源/去向</th><th>关键字段</th></tr><tr><td>闸机、票务→平台</td><td>event_id、通道ID、方向、时间戳、核验结果；按事件ID去重</td></tr><tr><td>区域传感器、基础配置→平台</td><td>区域ID、时间戳、人数、密度、数据质量、区域容量、活动场次</td></tr><tr><td>移动终端→平台</td><td>任务ID、人员ID、岗位、任务版本、执行状态、回传时间</td></tr><tr><td>平台→负责人工作台</td><td>风险等级、预测人数、阈值、方案ID/版本、方案内容、确认状态</td></tr><tr><td>平台→广播、屏显与现场终端</td><td>已批准任务ID/版本、路线、岗位职责、生效时间、回执要求；拒绝未确认及过期版本</td></tr><tr><td>平台→审计档案</td><td>事件、方案、确认人和时间、发布及执行回执、效果与结束理由</td></tr></table><h4>三项统计/审计</h4><ol><li>预警质量：按活动与区域统计次数、经现场核实的命中和误报，说明事件去重、分母、周期和核验来源。</li><li>响应耗时：记录触发、确认、发布、执行及缓解时间，按相同事件口径统计时长与超时任务；未完成任务单列。</li><li>确认合规：已发布任务中有效负责人确认记录的完整率，检查操作权限、版本、先确认后发布及修改留痕。</li></ol><h4>系统协同流程图（8个主要节点）</h4><div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:780px;height:1290px\"><svg class=\"flow-lines\" viewBox=\"0 0 780 1290\" aria-hidden=\"true\"><defs><marker id=\"arrow-c\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 85V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 215V260\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 380V425\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"405\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M250 320H5V1180H230\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"120\" y=\"307\" text-anchor=\"middle\" class=\"flow-edge-label\">否：常态记录</text><path d=\"M380 505V535\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 765V815\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"795\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M220 650H185\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"200\" y=\"637\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M100 600V465H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"156\" y=\"450\" text-anchor=\"middle\" class=\"flow-edge-label\">修改后重审</text><path d=\"M380 885V950\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 1070V1110\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"1107\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 1010H730V465H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"625\" y=\"995\" text-anchor=\"middle\" class=\"flow-edge-label\">否：未执行/未缓解升级</text><path d=\"M380 1250V1260H750V50H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"625\" y=\"1248\" text-anchor=\"middle\" class=\"flow-edge-label\">监测反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:240.0px;top:15.0px;width:280px;height:70px\"><div class=\"flow-text\">① 多源数据接入<br>质量异常→标记降级、通知运维与人工核实</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:145.0px;width:280px;height:70px\"><div class=\"flow-text\">② 实时客流计算<br>预测未来15分钟风险</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:260.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ 是否触发风险？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:425.0px;width:280px;height:80px\"><div class=\"flow-text\">④ 生成疏导方案<br>入口分流／路线引导／人员调度</div></div><div class=\"flow-box flow-decision\" style=\"left:220.0px;top:535.0px;width:320px;height:230px\"><svg class=\"flow-shape\" viewBox=\"0 0 320 230\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"160.0,1 319,115.0 160.0,229 1,115.0\"/></svg><div class=\"flow-text\">⑤ 值班负责人确认<br>是否通过？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:815.0px;width:280px;height:70px\"><div class=\"flow-text\">⑥ 已批准方案发布执行<br>广播／屏显／工作人员终端</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:950.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 回执与效果评估<br>风险是否稳定缓解？</div></div><div class=\"flow-box flow-process\" style=\"left:230.0px;top:1110.0px;width:300px;height:140px\"><div class=\"flow-text\">⑧ 记录归档并反馈监测<br>保存版本、确认、执行与效果<br>驳回/取消需记录未执行原因</div></div><div class=\"flow-box flow-annotation\" style=\"left:15.0px;top:600.0px;width:170px;height:100px\"><div class=\"flow-text\">未批准不得发布<br>修改后重新确认<br>取消则归档未执行原因</div></div></div></div>",
        "flowchart": {
          "html": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:780px;height:1290px\"><svg class=\"flow-lines\" viewBox=\"0 0 780 1290\" aria-hidden=\"true\"><defs><marker id=\"arrow-c\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 85V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 215V260\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 380V425\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"405\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M250 320H5V1180H230\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"120\" y=\"307\" text-anchor=\"middle\" class=\"flow-edge-label\">否：常态记录</text><path d=\"M380 505V535\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 765V815\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"795\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M220 650H185\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"200\" y=\"637\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M100 600V465H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"156\" y=\"450\" text-anchor=\"middle\" class=\"flow-edge-label\">修改后重审</text><path d=\"M380 885V950\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 1070V1110\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"1107\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 1010H730V465H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"625\" y=\"995\" text-anchor=\"middle\" class=\"flow-edge-label\">否：未执行/未缓解升级</text><path d=\"M380 1250V1260H750V50H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"625\" y=\"1248\" text-anchor=\"middle\" class=\"flow-edge-label\">监测反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:240.0px;top:15.0px;width:280px;height:70px\"><div class=\"flow-text\">① 多源数据接入<br>质量异常→标记降级、通知运维与人工核实</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:145.0px;width:280px;height:70px\"><div class=\"flow-text\">② 实时客流计算<br>预测未来15分钟风险</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:260.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ 是否触发风险？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:425.0px;width:280px;height:80px\"><div class=\"flow-text\">④ 生成疏导方案<br>入口分流／路线引导／人员调度</div></div><div class=\"flow-box flow-decision\" style=\"left:220.0px;top:535.0px;width:320px;height:230px\"><svg class=\"flow-shape\" viewBox=\"0 0 320 230\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"160.0,1 319,115.0 160.0,229 1,115.0\"/></svg><div class=\"flow-text\">⑤ {{0}}<br>是否通过？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:815.0px;width:280px;height:70px\"><div class=\"flow-text\">⑥ 已批准方案发布执行<br>广播／屏显／工作人员终端</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:950.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 回执与效果评估<br>风险是否稳定缓解？</div></div><div class=\"flow-box flow-process\" style=\"left:230.0px;top:1110.0px;width:300px;height:140px\"><div class=\"flow-text\">⑧ {{1}}<br>保存版本、确认、执行与效果<br>驳回/取消需记录未执行原因</div></div><div class=\"flow-box flow-annotation\" style=\"left:15.0px;top:600.0px;width:170px;height:100px\"><div class=\"flow-text\">未批准不得发布<br>修改后重新确认<br>取消则归档未执行原因</div></div></div></div>",
          "slots": [
            {
              "answer": "值班负责人确认",
              "choices": [
                "值班负责人确认",
                "跳过确认",
                "执行后再补批准"
              ],
              "why": "确认是否通过用菱形表示，未通过回到方案调整。",
              "matchRule": {
                "groups": [
                  [
                    "负责人"
                  ],
                  [
                    "确认"
                  ]
                ]
              }
            },
            {
              "answer": "记录归档并反馈监测",
              "choices": [
                "记录归档并反馈监测",
                "只保存成功结果",
                "删除异常信息"
              ],
              "why": "常态、驳回、执行异常和效果都应留痕。",
              "matchRule": {
                "groups": [
                  [
                    "记录",
                    "归档"
                  ],
                  [
                    "反馈",
                    "监测"
                  ]
                ]
              }
            }
          ]
        }
      },
      {
        "id": "ct3",
        "title": "产品规则配置与运行验证",
        "promptHTML": "<p>设计不少于3个风险等级，每级说明判断依据、系统响应和业务处置；给出任务从生成到结束的4个主要状态及进入条件；验证日常客流、高峰风险、数据异常三个场景的业务条件、系统与人员协同过程和最终记录。</p>",
        "answerHTML": "<h4>风险规则：设计示例，边界不重叠，最高等级优先</h4><table><tr><th>等级及依据</th><th>系统响应与业务处置</th></tr><tr><td>常态：占比&lt;70%，且无其他触发</td><td>持续监测、例行巡查，仅记录常态日志。</td></tr><tr><td>蓝色关注：70%≤占比&lt;85%，且无更高等级触发</td><td>关注提示、预备方案不发布，人员关注岗位情况。</td></tr><tr><td>黄色预警：85%≤占比&lt;95%，或等待&gt;10分钟，且无紧急条件</td><td>生成分流、引导、岗位方案，负责人确认后发布；按现场批准方案开放备用通道和引导。</td></tr><tr><td>红色紧急：占比≥95%，或现场达到经审批的安全红线</td><td>强提醒负责人并通知安保，生成紧急方案，确认后发布；人员按场馆应急预案处置，不能因风险高绕过确认。</td></tr></table><p>占比按预测15分钟人数/区域有效容量计算。数据无效时先进入数据异常处理，不能把缺失当作0而判断安全；排队和占比同时触发时取最高风险。</p><h4>四个主要状态</h4><p>待确认：阈值触发后生成方案；执行中：负责人批准并发布后进入；效果观察：收到已执行回执后进入，继续观察客流；已结束：风险回落并稳定，或活动结束且负责人现场确认无需继续疏导，记录理由并归档。驳回/取消进入已结束并标明未执行原因，不能计为疏导成功。观察期未缓解超过示例10分钟，生成升级方案回到待确认；已批准版本修改后须重新确认。发布失败或无回执须告警、人工核实，不得直接记为已执行。</p><h4>运行验证</h4><ol><li>日常：预测低于70%、等待未超限且数据有效。平台监测，人员巡查；断言没有已发布任务，记录常态人数、预测和数据质量。</li><li>高峰：预测占比90%，判黄色。生成方案→负责人确认（2分钟是可设目标）→发布→现场引导并回执→观察回落→稳定后结束。记录触发、方案版本、确认、发布、回执、效果和关闭时间；反向验证未确认不能发布。</li><li>异常：传感器离线或时间戳过期。标记降级并通知运维、值班人员；用闸机、邻区及现场核实辅助判断，估计值明确标注，不当作可靠实测自动解除风险。人员接管，恢复数据经校验后切回正常监测。记录异常起止、估计来源、核实人、运维处理和恢复验证。</li></ol>"
      }
    ],
    "steps": [
      {
        "id": "c-1",
        "taskIndex": 0,
        "title": "功能卡F-01：监测与预测",
        "goal": "功能卡要覆盖角色、触发、行为、输出与可测验收。",
        "code": "角色：值班监控员；持续接入多源数据。\n预测未来 {{}} 分钟风险，输出分区看板与质量标记。\n可量化验收示例：{{}}。",
        "solution": "角色：值班监控员；持续接入多源数据。\n预测未来 15 分钟风险，输出分区看板与质量标记。\n可量化验收示例：区域状态刷新延迟不超过10秒。",
        "slots": [
          {
            "answer": "15",
            "choices": [
              "15",
              "5",
              "30"
            ],
            "why": "15分钟是样卷明确的预测窗口。",
            "matchRule": {
              "groups": []
            }
          },
          {
            "answer": "区域状态刷新延迟不超过10秒",
            "choices": [
              "区域状态刷新延迟不超过10秒",
              "只写界面漂亮",
              "只写系统好用"
            ],
            "why": "须明确测量起止、负载与通过标准，10秒为方案示例。",
            "matchRule": {
              "groups": [
                [
                  "刷新",
                  "更新"
                ],
                [
                  "延迟",
                  "10秒",
                  "十秒"
                ]
              ]
            }
          }
        ],
        "hint": "功能卡要覆盖角色、触发、行为、输出与可测验收。",
        "context": ""
      },
      {
        "id": "c-2",
        "taskIndex": 0,
        "title": "功能卡F-02：方案与人工确认",
        "goal": "方案生成不等于发布，保留审核和版本证据。",
        "code": "触发：预测风险达到已配置阈值。\n方案包括 {{}}。\n发布前必须 {{}}。",
        "solution": "触发：预测风险达到已配置阈值。\n方案包括 入口分流、路线引导和人员调度。\n发布前必须 值班负责人确认。",
        "slots": [
          {
            "answer": "入口分流、路线引导和人员调度",
            "choices": [
              "入口分流、路线引导和人员调度",
              "只改看板颜色",
              "仅显示历史人数"
            ],
            "why": "三类建议共同支持客流疏导。",
            "matchRule": {
              "groups": [
                [
                  "分流"
                ],
                [
                  "路线",
                  "引导"
                ],
                [
                  "人员",
                  "岗位"
                ]
              ]
            }
          },
          {
            "answer": "值班负责人确认",
            "choices": [
              "值班负责人确认",
              "系统自动绕过确认",
              "由任意访客批准"
            ],
            "why": "题设要求确认后发布；修改版本后重新确认。",
            "matchRule": {
              "groups": [
                [
                  "负责人"
                ],
                [
                  "确认",
                  "批准"
                ]
              ]
            }
          }
        ],
        "hint": "方案生成不等于发布，保留审核和版本证据。",
        "context": ""
      },
      {
        "id": "c-3",
        "taskIndex": 0,
        "title": "功能卡F-03：反馈闭环",
        "goal": "功能设计必须说明可验证的输出与完整档案。",
        "code": "现场终端回传执行状态，观察客流变化。\n未缓解时 {{}}。\n验收示例：{{}}。",
        "solution": "现场终端回传执行状态，观察客流变化。\n未缓解时 升级方案并重新确认。\n验收示例：任务全生命周期记录完整率100%。",
        "slots": [
          {
            "answer": "升级方案并重新确认",
            "choices": [
              "升级方案并重新确认",
              "直接沿用旧批准发布新版",
              "删除失败记录"
            ],
            "why": "效果未改善不能直接假定完成，升级仍需人工确认。",
            "matchRule": {
              "groups": [
                [
                  "升级",
                  "调整"
                ],
                [
                  "确认",
                  "审批"
                ]
              ]
            }
          },
          {
            "answer": "任务全生命周期记录完整率100%",
            "choices": [
              "任务全生命周期记录完整率100%",
              "仅统计登录次数",
              "只看已成功任务"
            ],
            "why": "包含生成、确认、发布、回执、效果与结束记录，分母范围明确。",
            "matchRule": {
              "groups": [
                [
                  "记录",
                  "留痕"
                ],
                [
                  "完整",
                  "100%",
                  "百分之百"
                ]
              ]
            }
          }
        ],
        "hint": "功能设计必须说明可验证的输出与完整档案。",
        "context": ""
      },
      {
        "id": "c-4",
        "taskIndex": 1,
        "title": "绘制八节点系统协同流程",
        "goal": "直接在规范流程图节点中填写，主流程8节点，保留否分支。",
        "code": "多源接入→预测→风险判断→生成方案\n→ {{}} →发布执行→效果判断→ {{}}。",
        "solution": "多源接入→预测→风险判断→生成方案\n→ 值班负责人确认 →发布执行→效果判断→ 记录归档并反馈监测。",
        "slots": [
          {
            "answer": "值班负责人确认",
            "choices": [
              "值班负责人确认",
              "跳过确认",
              "执行后再补批准"
            ],
            "why": "确认是否通过用菱形表示，未通过回到方案调整。",
            "matchRule": {
              "groups": [
                [
                  "负责人"
                ],
                [
                  "确认"
                ]
              ]
            }
          },
          {
            "answer": "记录归档并反馈监测",
            "choices": [
              "记录归档并反馈监测",
              "只保存成功结果",
              "删除异常信息"
            ],
            "why": "常态、驳回、执行异常和效果都应留痕。",
            "matchRule": {
              "groups": [
                [
                  "记录",
                  "归档"
                ],
                [
                  "反馈",
                  "监测"
                ]
              ]
            }
          }
        ],
        "hint": "直接在规范流程图节点中填写，主流程8节点，保留否分支。",
        "context": "",
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:780px;height:1290px\"><svg class=\"flow-lines\" viewBox=\"0 0 780 1290\" aria-hidden=\"true\"><defs><marker id=\"arrow-c\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 85V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 215V260\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 380V425\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"405\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M250 320H5V1180H230\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"120\" y=\"307\" text-anchor=\"middle\" class=\"flow-edge-label\">否：常态记录</text><path d=\"M380 505V535\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 765V815\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"795\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M220 650H185\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"200\" y=\"637\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M100 600V465H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"156\" y=\"450\" text-anchor=\"middle\" class=\"flow-edge-label\">修改后重审</text><path d=\"M380 885V950\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 1070V1110\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"1107\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 1010H730V465H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"625\" y=\"995\" text-anchor=\"middle\" class=\"flow-edge-label\">否：未执行/未缓解升级</text><path d=\"M380 1250V1260H750V50H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"625\" y=\"1248\" text-anchor=\"middle\" class=\"flow-edge-label\">监测反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:240.0px;top:15.0px;width:280px;height:70px\"><div class=\"flow-text\">① 多源数据接入<br>质量异常→标记降级、通知运维与人工核实</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:145.0px;width:280px;height:70px\"><div class=\"flow-text\">② 实时客流计算<br>预测未来15分钟风险</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:260.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ 是否触发风险？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:425.0px;width:280px;height:80px\"><div class=\"flow-text\">④ 生成疏导方案<br>入口分流／路线引导／人员调度</div></div><div class=\"flow-box flow-decision\" style=\"left:220.0px;top:535.0px;width:320px;height:230px\"><svg class=\"flow-shape\" viewBox=\"0 0 320 230\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"160.0,1 319,115.0 160.0,229 1,115.0\"/></svg><div class=\"flow-text\">⑤ {{0}}<br>是否通过？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:815.0px;width:280px;height:70px\"><div class=\"flow-text\">⑥ 已批准方案发布执行<br>广播／屏显／工作人员终端</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:950.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 回执与效果评估<br>风险是否稳定缓解？</div></div><div class=\"flow-box flow-process\" style=\"left:230.0px;top:1110.0px;width:300px;height:140px\"><div class=\"flow-text\">⑧ {{1}}<br>保存版本、确认、执行与效果<br>驳回/取消需记录未执行原因</div></div><div class=\"flow-box flow-annotation\" style=\"left:15.0px;top:600.0px;width:170px;height:100px\"><div class=\"flow-text\">未批准不得发布<br>修改后重新确认<br>取消则归档未执行原因</div></div></div></div>"
      },
      {
        "id": "c-5",
        "taskIndex": 1,
        "title": "填写有效JSON配置",
        "goal": "JSON不写注释；0.85和10为老师示例，含义和边界需定义。",
        "code": "{\n  \"forecast_window_minutes\": {{}},\n  \"risk_threshold\": 0.85,\n  \"queue_wait_threshold_minutes\": 10,\n  \"manual_confirm_required\": {{}}\n}",
        "solution": "{\n  \"forecast_window_minutes\": 15,\n  \"risk_threshold\": 0.85,\n  \"queue_wait_threshold_minutes\": 10,\n  \"manual_confirm_required\": true\n}",
        "slots": [
          {
            "answer": "15",
            "choices": [
              "15",
              "5",
              "30"
            ],
            "why": "预测窗口固定15分钟。",
            "matchRule": {
              "groups": []
            }
          },
          {
            "answer": "true",
            "choices": [
              "true",
              "false",
              "True"
            ],
            "why": "JSON布尔值为小写true，表示发布前需人工确认。",
            "matchRule": {
              "groups": [
                [
                  "true"
                ]
              ]
            }
          }
        ],
        "hint": "JSON不写注释；0.85和10为老师示例，含义和边界需定义。",
        "context": ""
      },
      {
        "id": "c-6",
        "taskIndex": 1,
        "title": "设计输入输出接口",
        "goal": "同时写输入来源和输出去向，字段应可支持执行与追溯。",
        "code": "输入必须给出 {{}}。\n输出到广播/屏显/终端时携带 {{}}。",
        "solution": "输入必须给出 方向、来源与关键字段。\n输出到广播/屏显/终端时携带 已批准任务ID、版本和生效时间。",
        "slots": [
          {
            "answer": "方向、来源与关键字段",
            "choices": [
              "方向、来源与关键字段",
              "只写平台名字",
              "只列界面颜色"
            ],
            "why": "例如传感器→平台，区域ID、时间戳、人数、质量标志。",
            "matchRule": {
              "groups": [
                [
                  "方向",
                  "来源"
                ],
                [
                  "字段"
                ]
              ]
            }
          },
          {
            "answer": "已批准任务ID、版本和生效时间",
            "choices": [
              "已批准任务ID、版本和生效时间",
              "未审核草稿",
              "过期指令"
            ],
            "why": "接口能核对审批状态，拒绝未确认或过期版本。",
            "matchRule": {
              "groups": [
                [
                  "批准",
                  "确认"
                ],
                [
                  "任务",
                  "id"
                ],
                [
                  "版本",
                  "时间"
                ]
              ]
            }
          }
        ],
        "hint": "同时写输入来源和输出去向，字段应可支持执行与追溯。",
        "context": ""
      },
      {
        "id": "c-7",
        "taskIndex": 1,
        "title": "写出三项运营审计",
        "goal": "预警质量、响应时效、确认合规，各写统计口径。",
        "code": "① {{}}\n② {{}}\n③ 人工确认与操作权限合规审计。",
        "solution": "① 预警命中与误报统计\n② 触发到确认、发布和见效的耗时\n③ 人工确认与操作权限合规审计。",
        "slots": [
          {
            "answer": "预警命中与误报统计",
            "choices": [
              "预警命中与误报统计",
              "只计页面访问次数",
              "删掉漏报事件"
            ],
            "why": "说明周期、核验来源和分母，不能只列指标名。",
            "matchRule": {
              "groups": [
                [
                  "预警",
                  "报警"
                ],
                [
                  "命中",
                  "误报"
                ]
              ]
            }
          },
          {
            "answer": "触发到确认、发布和见效的耗时",
            "choices": [
              "触发到确认、发布和见效的耗时",
              "只统计最快一条",
              "将未完成算零耗时"
            ],
            "why": "全链路同一事件统计，超时与未完成任务单列。",
            "matchRule": {
              "groups": [
                [
                  "触发"
                ],
                [
                  "确认",
                  "发布"
                ],
                [
                  "耗时",
                  "时长",
                  "时间"
                ]
              ]
            }
          }
        ],
        "hint": "预警质量、响应时效、确认合规，各写统计口径。",
        "context": ""
      },
      {
        "id": "c-8",
        "taskIndex": 2,
        "title": "配置风险分级与处置",
        "goal": "每级均写判断依据、系统响应、业务动作；示例阈值不是题设硬指标。",
        "code": "蓝色关注：70%≤占比<85%，预备但不发布。\n黄色：85%≤占比<95%或等待>10分钟，{{}}。\n红色：占比≥95%或安全红线，{{}}。\n冲突时 {{}}。",
        "solution": "蓝色关注：70%≤占比<85%，预备但不发布。\n黄色：85%≤占比<95%或等待>10分钟，负责人确认后发布疏导方案。\n红色：占比≥95%或安全红线，强提醒负责人并通知安保，确认后应急处置。\n冲突时 最高风险优先。",
        "slots": [
          {
            "answer": "负责人确认后发布疏导方案",
            "choices": [
              "负责人确认后发布疏导方案",
              "达到阈值即绕过审核",
              "只记录不通知"
            ],
            "why": "黄色也必须经过负责人确认。",
            "matchRule": {
              "groups": [
                [
                  "确认"
                ],
                [
                  "发布"
                ]
              ]
            }
          },
          {
            "answer": "强提醒负责人并通知安保，确认后应急处置",
            "choices": [
              "强提醒负责人并通知安保，确认后应急处置",
              "无条件自动开关所有入口",
              "忽略现场风险"
            ],
            "why": "紧急升级不代表绕过题设确认要求，人员按审批预案处置。",
            "matchRule": {
              "groups": [
                [
                  "负责人",
                  "安保"
                ],
                [
                  "确认"
                ],
                [
                  "应急",
                  "紧急"
                ]
              ]
            }
          },
          {
            "answer": "最高风险优先",
            "choices": [
              "最高风险优先",
              "随机选一种等级",
              "始终用最低等级"
            ],
            "why": "数值是设计示例，区间边界不重叠；无效数据先做异常处理。",
            "matchRule": {
              "groups": [
                [
                  "最高",
                  "高风险优先",
                  "高等级优先"
                ]
              ]
            }
          }
        ],
        "hint": "每级均写判断依据、系统响应、业务动作；示例阈值不是题设硬指标。",
        "context": ""
      },
      {
        "id": "c-9",
        "taskIndex": 2,
        "title": "设置四个主要任务状态",
        "goal": "写清进入条件，未确认不得发布，无回执不得假装已执行。",
        "code": "待确认→ {{}} → {{}} →已结束。\n效果未缓解需升级时，回到 {{}}。",
        "solution": "待确认→ 执行中 → 效果观察 →已结束。\n效果未缓解需升级时，回到 待确认。",
        "slots": [
          {
            "answer": "执行中",
            "choices": [
              "执行中",
              "直接归档",
              "无需确认"
            ],
            "why": "负责人批准并发布后进入执行中。",
            "matchRule": {
              "groups": [
                [
                  "执行中"
                ]
              ]
            }
          },
          {
            "answer": "效果观察",
            "choices": [
              "效果观察",
              "默认成功",
              "自动删除"
            ],
            "why": "收到现场执行回执后，进入效果观察。",
            "matchRule": {
              "groups": [
                [
                  "效果观察",
                  "观察效果"
                ]
              ]
            }
          },
          {
            "answer": "待确认",
            "choices": [
              "待确认",
              "绕过确认直接执行",
              "永久使用旧版本批准"
            ],
            "why": "升级方案仍要负责人确认；驳回结束时记录未执行原因。",
            "matchRule": {
              "groups": [
                [
                  "待确认",
                  "重新确认"
                ]
              ]
            }
          }
        ],
        "hint": "写清进入条件，未确认不得发布，无回执不得假装已执行。",
        "context": ""
      },
      {
        "id": "c-10",
        "taskIndex": 2,
        "title": "验证日常客流场景",
        "goal": "业务条件→系统动作→人员协作→结果证据。",
        "code": "数据有效、预测占比<70%、等待未超限。\n系统 {{}}；人员例行巡查。\n最终保留 {{}}。",
        "solution": "数据有效、预测占比<70%、等待未超限。\n系统 持续监测而不发布疏导任务；人员例行巡查。\n最终保留 常态监测日志与预测记录。",
        "slots": [
          {
            "answer": "持续监测而不发布疏导任务",
            "choices": [
              "持续监测而不发布疏导任务",
              "无风险也强制限流",
              "直接暂停所有入口"
            ],
            "why": "正常场景应断言不产生不必要的已发布任务。",
            "matchRule": {
              "groups": [
                [
                  "监测"
                ],
                [
                  "不发布",
                  "不生成"
                ]
              ]
            }
          },
          {
            "answer": "常态监测日志与预测记录",
            "choices": [
              "常态监测日志与预测记录",
              "虚构执行成功任务",
              "清空全部历史"
            ],
            "why": "日志保留时间、区域、预测和质量标记，支持复核。",
            "matchRule": {
              "groups": [
                [
                  "日志",
                  "记录"
                ],
                [
                  "监测",
                  "预测"
                ]
              ]
            }
          }
        ],
        "hint": "业务条件→系统动作→人员协作→结果证据。",
        "context": ""
      },
      {
        "id": "c-11",
        "taskIndex": 2,
        "title": "验证高峰风险场景",
        "goal": "反向验证未确认不能发布；耗时目标如2分钟只是可选方案值。",
        "code": "预测占比90%，按示例归为 {{}}。\n生成方案→负责人确认→ {{}} →回执与效果观察。\n稳定回落后结束并归档。",
        "solution": "预测占比90%，按示例归为 黄色预警。\n生成方案→负责人确认→ 广播、屏显与终端发布执行 →回执与效果观察。\n稳定回落后结束并归档。",
        "slots": [
          {
            "answer": "黄色预警",
            "choices": [
              "黄色预警",
              "蓝色关注",
              "无风险"
            ],
            "why": "90%落入[85%,95%)，不是红色。",
            "matchRule": {
              "groups": [
                [
                  "黄色",
                  "预警"
                ]
              ]
            }
          },
          {
            "answer": "广播、屏显与终端发布执行",
            "choices": [
              "广播、屏显与终端发布执行",
              "未确认直接执行",
              "只记录不落实"
            ],
            "why": "回执应关联任务与方案版本，保存确认人和时间。",
            "matchRule": {
              "groups": [
                [
                  "发布"
                ],
                [
                  "执行"
                ]
              ]
            }
          }
        ],
        "hint": "反向验证未确认不能发布；耗时目标如2分钟只是可选方案值。",
        "context": ""
      },
      {
        "id": "c-12",
        "taskIndex": 2,
        "title": "验证数据异常与恢复",
        "goal": "异常→降级与人工核实→恢复验证，不能把未知当低风险。",
        "code": "传感器离线或时间戳过期→ {{}}。\n估计数据 {{}}；值班人员现场核实。\n恢复后 {{}}，保留异常起止和处置记录。",
        "solution": "传感器离线或时间戳过期→ 标记降级并通知运维和值班人员。\n估计数据 明确标注来源与质量；值班人员现场核实。\n恢复后 校验通过再切回正常监测，保留异常起止和处置记录。",
        "slots": [
          {
            "answer": "标记降级并通知运维和值班人员",
            "choices": [
              "标记降级并通知运维和值班人员",
              "将缺失人数设零并判安全",
              "直接删除异常区域"
            ],
            "why": "缺失不代表安全；通知人员接管并核查数据。",
            "matchRule": {
              "groups": [
                [
                  "降级",
                  "异常"
                ],
                [
                  "运维",
                  "值班",
                  "通知"
                ]
              ]
            }
          },
          {
            "answer": "明确标注来源与质量",
            "choices": [
              "明确标注来源与质量",
              "冒充可靠实测",
              "直接据此自动解除风险"
            ],
            "why": "替代估计不当作可靠实测，不自动解除风险。",
            "matchRule": {
              "groups": [
                [
                  "标注",
                  "标记"
                ],
                [
                  "来源",
                  "质量",
                  "估计"
                ]
              ]
            }
          },
          {
            "answer": "校验通过再切回正常监测",
            "choices": [
              "校验通过再切回正常监测",
              "只要有一条数据就当恢复",
              "不记录恢复时间"
            ],
            "why": "确认时间、范围、质量与现场状态后恢复，保留验证记录。",
            "matchRule": {
              "groups": [
                [
                  "校验",
                  "验证",
                  "核验"
                ],
                [
                  "恢复",
                  "监测",
                  "切回"
                ]
              ]
            }
          }
        ],
        "hint": "异常→降级与人工核实→恢复验证，不能把未知当低风险。",
        "context": ""
      }
    ],
    "sourceURL": "https://ai-trainer-exam-courseware.app.workbuddy.host/?sharecode=U7DGZ5NTK5",
    "count": 12,
    "originalCode": "产品功能定义\n\n产品方案设计\n\n产品规则配置与运行验证",
    "referenceCode": "",
    "downloadPath": "materials/c-reference.html",
    "referenceHTML": "<h1>C · 大型场馆智能客流预测与疏导系统</h1><p>参考解法（整理版），不代表唯一表述或官方评分细则。</p><p>大型场馆在演唱会、赛事散场时，入口、通道与停车接驳区出现短时集中客流。现有系统只能展示当前人数，缺少风险预测、方案、人员调度和反馈闭环。</p><p>接入闸机、票务核验、区域客流传感器及工作人员移动终端数据，结合区域容量和近期变化，预测未来15分钟风险。达到阈值后生成入口分流、路线引导、人员调度建议，经值班负责人确认后发布，记录执行结果。</p><p>以下参考方案沿用老师课件的功能卡、配置、风险分级和四状态结构。除题设的15分钟与人工确认要求外，阈值、时限、验收值均为设计示例，需经场馆验证和审批；不是题设强制标准。</p><h2>产品功能定义</h2><p>分别设计“客流态势监测”“疏导方案生成”“处置反馈闭环”三张功能卡，每项填写功能编号、名称、使用角色及触发条件、功能行为、输出结果和一条可量化验收标准。</p><h4>F-01 客流态势监测</h4><p>角色：值班监控员；活动启用时持续监测。融合闸机、票务、区域传感器和移动终端事件，按区域计算当前人数、密度、容量占比及未来15分钟人数趋势，展示风险等级和数据质量标记。输出分区看板和预测预警。验收示例：在约定负载和测量起止点下，区域状态更新延迟不超过10秒；通过历史回放验证。若选用课件的预测MAPE≤15%作为附加目标，须明确零人数处理和样本范围。</p><h4>F-02 疏导方案生成</h4><p>角色：值班负责人；预测风险或等待时间达到已配置阈值时触发。系统生成入口分流、路线引导和人员岗位建议，说明依据、目标区域和生效范围，推送负责人确认；可修改或驳回。输出带版本、待确认状态的方案及批准后的执行任务。验收示例：风险事件产生至可审核方案生成≤60秒；发布事件100%关联有效负责人确认记录，未确认不得发布。</p><h4>F-03 处置反馈闭环</h4><p>角色：现场工作人员与值班负责人；方案发布后启动。现场终端回传执行回执，系统对比执行前后客流，持续观察；无缓解则重新生成升级方案并再次确认，结束后归档。输出执行状态、效果曲线与可追溯档案。验收示例：抽检任务中，生成、确认、发布、执行回执、效果和结束记录完整率100%，可查询导出；未结束任务不能伪造结束记录。</p><h2>产品方案设计</h2><p>绘制6～8个主要节点的系统协同流程图，体现系统处理、业务判断及人员协作闭环；提供JSON配置（forecast_window_minutes、risk_threshold、queue_wait_threshold_minutes、manual_confirm_required）；设计输入输出接口的方向、来源或去向及关键字段；给出3项运营统计或审计内容。</p><h4>配置示例：严格JSON，不写注释</h4><pre>{\n  &quot;forecast_window_minutes&quot;: 15,\n  &quot;risk_threshold&quot;: 0.85,\n  &quot;queue_wait_threshold_minutes&quot;: 10,\n  &quot;manual_confirm_required&quot;: true,\n  &quot;data_refresh_seconds&quot;: 10,\n  &quot;escalation_minutes&quot;: 10\n}</pre><p>risk_threshold是预测人数/区域有效容量的占比阈值，不是模型置信概率。等待超过10分钟作为独立预警触发条件；15分钟预测窗口与确认后发布遵循题设。其余数值是可调整的方案设置。</p><h4>输入输出接口</h4><table><tr><th>方向与来源/去向</th><th>关键字段</th></tr><tr><td>闸机、票务→平台</td><td>event_id、通道ID、方向、时间戳、核验结果；按事件ID去重</td></tr><tr><td>区域传感器、基础配置→平台</td><td>区域ID、时间戳、人数、密度、数据质量、区域容量、活动场次</td></tr><tr><td>移动终端→平台</td><td>任务ID、人员ID、岗位、任务版本、执行状态、回传时间</td></tr><tr><td>平台→负责人工作台</td><td>风险等级、预测人数、阈值、方案ID/版本、方案内容、确认状态</td></tr><tr><td>平台→广播、屏显与现场终端</td><td>已批准任务ID/版本、路线、岗位职责、生效时间、回执要求；拒绝未确认及过期版本</td></tr><tr><td>平台→审计档案</td><td>事件、方案、确认人和时间、发布及执行回执、效果与结束理由</td></tr></table><h4>三项统计/审计</h4><ol><li>预警质量：按活动与区域统计次数、经现场核实的命中和误报，说明事件去重、分母、周期和核验来源。</li><li>响应耗时：记录触发、确认、发布、执行及缓解时间，按相同事件口径统计时长与超时任务；未完成任务单列。</li><li>确认合规：已发布任务中有效负责人确认记录的完整率，检查操作权限、版本、先确认后发布及修改留痕。</li></ol><h4>系统协同流程图（8个主要节点）</h4><div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:780px;height:1290px\"><svg class=\"flow-lines\" viewBox=\"0 0 780 1290\" aria-hidden=\"true\"><defs><marker id=\"arrow-c\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 85V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 215V260\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 380V425\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"405\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M250 320H5V1180H230\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"120\" y=\"307\" text-anchor=\"middle\" class=\"flow-edge-label\">否：常态记录</text><path d=\"M380 505V535\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 765V815\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"795\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M220 650H185\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"200\" y=\"637\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M100 600V465H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"156\" y=\"450\" text-anchor=\"middle\" class=\"flow-edge-label\">修改后重审</text><path d=\"M380 885V950\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><path d=\"M380 1070V1110\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"395\" y=\"1107\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 1010H730V465H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"625\" y=\"995\" text-anchor=\"middle\" class=\"flow-edge-label\">否：未执行/未缓解升级</text><path d=\"M380 1250V1260H750V50H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-c)\"/><text x=\"625\" y=\"1248\" text-anchor=\"middle\" class=\"flow-edge-label\">监测反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:240.0px;top:15.0px;width:280px;height:70px\"><div class=\"flow-text\">① 多源数据接入<br>质量异常→标记降级、通知运维与人工核实</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:145.0px;width:280px;height:70px\"><div class=\"flow-text\">② 实时客流计算<br>预测未来15分钟风险</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:260.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ 是否触发风险？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:425.0px;width:280px;height:80px\"><div class=\"flow-text\">④ 生成疏导方案<br>入口分流／路线引导／人员调度</div></div><div class=\"flow-box flow-decision\" style=\"left:220.0px;top:535.0px;width:320px;height:230px\"><svg class=\"flow-shape\" viewBox=\"0 0 320 230\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"160.0,1 319,115.0 160.0,229 1,115.0\"/></svg><div class=\"flow-text\">⑤ 值班负责人确认<br>是否通过？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:815.0px;width:280px;height:70px\"><div class=\"flow-text\">⑥ 已批准方案发布执行<br>广播／屏显／工作人员终端</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:950.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 回执与效果评估<br>风险是否稳定缓解？</div></div><div class=\"flow-box flow-process\" style=\"left:230.0px;top:1110.0px;width:300px;height:140px\"><div class=\"flow-text\">⑧ 记录归档并反馈监测<br>保存版本、确认、执行与效果<br>驳回/取消需记录未执行原因</div></div><div class=\"flow-box flow-annotation\" style=\"left:15.0px;top:600.0px;width:170px;height:100px\"><div class=\"flow-text\">未批准不得发布<br>修改后重新确认<br>取消则归档未执行原因</div></div></div></div><h2>产品规则配置与运行验证</h2><p>设计不少于3个风险等级，每级说明判断依据、系统响应和业务处置；给出任务从生成到结束的4个主要状态及进入条件；验证日常客流、高峰风险、数据异常三个场景的业务条件、系统与人员协同过程和最终记录。</p><h4>风险规则：设计示例，边界不重叠，最高等级优先</h4><table><tr><th>等级及依据</th><th>系统响应与业务处置</th></tr><tr><td>常态：占比&lt;70%，且无其他触发</td><td>持续监测、例行巡查，仅记录常态日志。</td></tr><tr><td>蓝色关注：70%≤占比&lt;85%，且无更高等级触发</td><td>关注提示、预备方案不发布，人员关注岗位情况。</td></tr><tr><td>黄色预警：85%≤占比&lt;95%，或等待&gt;10分钟，且无紧急条件</td><td>生成分流、引导、岗位方案，负责人确认后发布；按现场批准方案开放备用通道和引导。</td></tr><tr><td>红色紧急：占比≥95%，或现场达到经审批的安全红线</td><td>强提醒负责人并通知安保，生成紧急方案，确认后发布；人员按场馆应急预案处置，不能因风险高绕过确认。</td></tr></table><p>占比按预测15分钟人数/区域有效容量计算。数据无效时先进入数据异常处理，不能把缺失当作0而判断安全；排队和占比同时触发时取最高风险。</p><h4>四个主要状态</h4><p>待确认：阈值触发后生成方案；执行中：负责人批准并发布后进入；效果观察：收到已执行回执后进入，继续观察客流；已结束：风险回落并稳定，或活动结束且负责人现场确认无需继续疏导，记录理由并归档。驳回/取消进入已结束并标明未执行原因，不能计为疏导成功。观察期未缓解超过示例10分钟，生成升级方案回到待确认；已批准版本修改后须重新确认。发布失败或无回执须告警、人工核实，不得直接记为已执行。</p><h4>运行验证</h4><ol><li>日常：预测低于70%、等待未超限且数据有效。平台监测，人员巡查；断言没有已发布任务，记录常态人数、预测和数据质量。</li><li>高峰：预测占比90%，判黄色。生成方案→负责人确认（2分钟是可设目标）→发布→现场引导并回执→观察回落→稳定后结束。记录触发、方案版本、确认、发布、回执、效果和关闭时间；反向验证未确认不能发布。</li><li>异常：传感器离线或时间戳过期。标记降级并通知运维、值班人员；用闸机、邻区及现场核实辅助判断，估计值明确标注，不当作可靠实测自动解除风险。人员接管，恢复数据经校验后切回正常监测。记录异常起止、估计来源、核实人、运维处理和恢复验证。</li></ol>"
  }
});
