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
        "answerHTML": "<div><table><thead><tr><th>业务模块</th><th>作用</th></tr></thead><tbody><tr><td>现场采集与图像质量校验</td><td>采集产品编号、批次和图像，检查模糊、严重反光及主体完整性；不合格图像补拍一次，仍不可用则转实物检查。</td></tr><tr><td>视觉模型与规则分流</td><td>仅对可用图像执行模型检测，保存模型版本和缺陷分数，按 0.20 与 0.80 阈值分流。</td></tr><tr><td>人工复核与隔离处置</td><td>向质检员提供图像和模型记录；接收合格、不合格、待检结论，隔离后由质量人员决定放行、返工或报废。</td></tr><tr><td>状态追溯与包装联锁</td><td>保存每次检测、补拍、改判和处置；包装前读取当前有效状态，只有已放行产品可以进入包装，并向模型改进提供已核实标签。</td></tr></tbody></table></div>\n<p>系统负责图像有效性检查、规则执行、任务分派、状态同步与留痕。质检员负责实物或图像复核并有裁定权；不能确定的产品交质量主管继续处理，保持待检。质量人员按企业标准决定隔离品的后续处置。模型分数不作为已校准的真实缺陷概率，系统不得自行将隔离等同报废。</p>\n<div><table><thead><tr><th>记录方向</th><th>来源或去向</th><th>关键字段</th></tr></thead><tbody><tr><td>输入</td><td>生产工位或相机到系统</td><td>product_id、batch_id、image_id、图像地址、拍摄时间、图像质量、补拍次数。</td></tr><tr><td>内部输出与反馈</td><td>模型到复核台，质检员反馈系统</td><td>检测记录 ID、产品 ID、模型版本、分数、规则版本、分流路径；人工结论、人员、理由、时间。</td></tr><tr><td>输出</td><td>系统到隔离区与包装环节</td><td>产品 ID、当前状态、状态版本、处置指令、有效时间；包装校验记录。</td></tr><tr><td>输入</td><td>返工工位或质量主管到系统</td><td>产品 ID、原检测 ID、返工或报废决定、复检记录关联、经办人和时间。</td></tr></tbody></table></div>"
      },
      {
        "id": "b11t2",
        "title": "业务流程与处置规则设计",
        "promptHTML": "<ol><li>编写简短的“条件—处理动作—后续去向”规则表，覆盖图像不可用、低分、中间分数和高分四种情况。</li><li>绘制一张简洁的业务流程图，体现图像检查、模型检测、放行／人工复核／隔离分流，以及处理结果记录。人工复核后的去向和隔离后的处置可直接写在对应节点中，无需画出所有异常支线。</li><li>分别说明 P004、P005 按拟上线规则会进入哪条路径。</li></ol>",
        "answerHTML": "<div><table><thead><tr><th>条件</th><th>处理动作</th><th>后续去向</th></tr></thead><tbody><tr><td>图像模糊、严重反光或主体不完整</td><td>使原分数失效，补拍一次；仍不可用则人工检查实物。</td><td>人工判合格则放行，不合格则隔离，无法判断则待检并交主管；不得自动放行。</td></tr><tr><td>图像可用且分数小于 0.20</td><td>按试行规则自动放行并记录。</td><td>更新已放行状态，包装入口再次校验。</td></tr><tr><td>图像可用且 0.20≤分数＜0.80</td><td>转质检员复核，记录裁定及理由。</td><td>合格放行，不合格隔离，不确定保持待检。</td></tr><tr><td>图像可用且分数≥0.80</td><td>自动隔离，等待质量人员处理。</td><td>质量人员决定放行、返工或报废；返工后重新检测。</td></tr></tbody></table></div>\n<p>P004 的原图模糊，必须先补拍一次，不能依据 0.04 直接放行。若补拍可用，使用新图重新检测并按新分数分流；若仍不可用，质检员检查实物。试运行人工已发现划伤，但该结果不能作为正式自动分流前已知的输入。P005 图像清晰且分数 0.12，按拟上线规则会自动放行，进入包装前状态校验路径。试运行复核证明它实际上不合格，因此暴露出该规则对细小凹陷的漏放风险，不能事后把它写成人工复核路径。边界核对：0.20 进入人工复核，0.80 进入隔离；人工暂时无法判断不得默认合格。状态更新与包装校验需保持一致，可使用版本校验及原子更新防止旧放行记录覆盖新隔离结论。</p><h4>规范业务流程图（参考方案）</h4><div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1190px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1190\" aria-hidden=\"true\"><defs><marker id=\"arrow-b11\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 45V69\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M380 121V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M265 200H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"188\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M110 244V300\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M205 350H265\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"234\" y=\"338\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 255V324\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"395\" y=\"291\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M110 400V539\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"157\" y=\"471\" text-anchor=\"middle\" class=\"flow-edge-label\">否：检查实物</text><path d=\"M380 376V410\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M480 460H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"525\" y=\"448\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 510V550\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"440\" y=\"532\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.20</text><path d=\"M280 600H205\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"239\" y=\"581\" text-anchor=\"middle\" class=\"flow-edge-label\">是：中间分数</text><path d=\"M380 650V697\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"441\" y=\"678\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.80</text><path d=\"M510 760H536\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"535\" y=\"745\" text-anchor=\"middle\" class=\"flow-edge-label\">返工</text><path d=\"M536 95H495\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"520\" y=\"81\" text-anchor=\"middle\" class=\"flow-edge-label\">重检</text><path d=\"M380 823V881\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"452\" y=\"860\" text-anchor=\"middle\" class=\"flow-edge-label\">放行／报废等结果</text><path d=\"M110 661V920H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"160\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M650 490V920H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"590\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M380 959V995\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M500 1050H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"531\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M260 1050H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1080V1133\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/></svg><div class=\"flow-box flow-terminal\" style=\"left:315.0px;top:11.0px;width:130px;height:34px\"><div class=\"flow-text\">开始</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:69.0px;width:230px;height:52px\"><div class=\"flow-text\">采集产品、批次与图像</div></div><div class=\"flow-box flow-decision\" style=\"left:265.0px;top:145.0px;width:230px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 230 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"115.0,1 229,55.0 115.0,109 1,55.0\"/></svg><div class=\"flow-text\">图像是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:156.0px;width:180px;height:88px\"><div class=\"flow-text\">原分数无效<br>补拍一次</div></div><div class=\"flow-box flow-decision\" style=\"left:15.0px;top:300.0px;width:190px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 190 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"95.0,1 189,50.0 95.0,99 1,50.0\"/></svg><div class=\"flow-text\">新图是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:324.0px;width:230px;height:52px\"><div class=\"flow-text\">视觉模型检测<br>取得新图的缺陷分数 s</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:410.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.20？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:430.0px;width:170px;height:60px\"><div class=\"flow-text\">自动放行</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:550.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.80？</div></div><div class=\"flow-box flow-process\" style=\"left:15.0px;top:539.0px;width:190px;height:122px\"><div class=\"flow-text\">质检员复核／检查实物<br>合格→放行；不合格→隔离<br>不确定→待检，交主管</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:697.0px;width:260px;height:126px\"><div class=\"flow-text\">自动隔离，质量人员处置<br>放行／返工／报废<br>返工完成→R，重新检测</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:741.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:76.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:881.0px;width:280px;height:78px\"><div class=\"flow-text\">记录处理结果与当前有效状态<br>关联原图、模型版本<br>人工改判：人员、理由、时间</div></div><div class=\"flow-box flow-decision\" style=\"left:260.0px;top:995.0px;width:240px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 240 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"120.0,1 239,55.0 120.0,109 1,55.0\"/></svg><div class=\"flow-text\">当前有效状态<br>是否已放行？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:1020.0px;width:170px;height:60px\"><div class=\"flow-text\">进入包装</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:1015.0px;width:180px;height:70px\"><div class=\"flow-text\">阻止进入包装<br>按当前状态继续处置</div></div><div class=\"flow-box flow-terminal\" style=\"left:585.0px;top:1133.0px;width:130px;height:34px\"><div class=\"flow-text\">结束</div></div></div></div>",
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
        "answerHTML": "<p>针对 P005 漏检，补充不同角度、光照和批次的细小凹陷正样本，统一标注后微调检测模型，并在保留的独立凹陷测试集上比较漏检率。若调整分流阈值，应在验证集选定，检查漏检下降与人工复核量增加的权衡，避免只记住 P005。针对 P006 误判，采集已由质检确认的合格反光样本作为困难负样本，结合受控光源或偏振采集改善反光；在独立的合格反光测试集上比较误隔离率，同时核对真实缺陷召回率没有明显下降。流程指标一为自动放行漏放率，口径为“经独立抽检确认实际不合格的自动放行件数÷被抽检的自动放行件数”。采用预先规定的随机或分层抽检，报告抽检量、批次和置信区间。流程指标二为隔离误隔离率，口径为“质量人员最终确认合格的自动隔离件数÷已完成最终裁定的自动隔离件数”。按固定周期及模型版本统计，未裁定件单列。上线前后保持抽检与裁定标准一致。</p>"
      }
    ],
    "steps": [
      {
        "id": "b11-1",
        "title": "搭建四个业务模块",
        "goal": "连接生产现场、视觉模型、质检人员和包装环节，明确各模块职责。",
        "code": "四个模块：\n① {{}}\n② 视觉模型与规则分流\n③ {{}}\n④ {{}}",
        "solution": "四个模块：\n① 现场采集与图像质量校验\n② 视觉模型与规则分流\n③ 人工复核与隔离处置\n④ 状态追溯与包装联锁",
        "slots": [
          {
            "answer": "现场采集与图像质量校验",
            "choices": [
              "现场采集与图像质量校验",
              "直接放行",
              "先执行模型再判断图像"
            ],
            "why": "图像质量检查必须先于模型分数分流。",
            "accepted": [],
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
            "answer": "人工复核与隔离处置",
            "choices": [
              "人工复核与隔离处置",
              "高分直接报废",
              "删除不确定记录"
            ],
            "why": "质检员作出裁定，质量人员决定隔离品后续处置。",
            "accepted": [],
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
            "answer": "状态追溯与包装联锁",
            "choices": [
              "状态追溯与包装联锁",
              "仅保存纸质结果",
              "包装前不读状态"
            ],
            "why": "包装入口需要核对当前有效状态，检测与人工改判全程留痕。",
            "accepted": [],
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
        "code": "系统负责规则执行、分派与留痕；\n人工复核的裁定权属于 {{}}。\n输入：工位／相机 → 系统，记录产品、批次和图像。\n输出：系统 → 包装，发送产品编号、{{}} 和状态版本。\n人工改判记录：{{}}。",
        "solution": "系统负责规则执行、分派与留痕；\n人工复核的裁定权属于 质检员。\n输入：工位／相机 → 系统，记录产品、批次和图像。\n输出：系统 → 包装，发送产品编号、当前有效状态 和状态版本。\n人工改判记录：人员、理由及时间。",
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
    "referenceHTML": "<h1>B1-1 · 产品外观智能质检业务框架与流程设计</h1><p>参考解法（整理版），不代表唯一表述或官方评分细则。</p><h4>业务背景</h4>\n<p>某制造企业生产小家电塑料外壳，需要在包装前检查划伤、凹陷等外观缺陷。现有流程为：操作员取件检查外观，在纸质表单中记录结果，合格品进入包装，不合格品放入周转箱，再由质量人员决定返工或报废。企业已试运行视觉检测模型。模型根据产品图像输出 0～1 的“缺陷分数”，分数越高表示模型越倾向于认为存在缺陷。缺陷分数不是已经验证的实际缺陷概率，也不能替代最终质量结论。企业准备将模型接入业务流程，但存在以下问题：</p>\n<ol><li>部分图像模糊或反光，模型仍会输出分数，直接使用可能导致错误放行。</li><li>浅色划伤、细小凹陷容易漏检，反光或正常纹理容易被误判为缺陷。</li><li>模型不确定时由谁检查、检查后如何流转尚未明确；已判定不合格的产品也可能因记录不同步而进入包装。</li><li>人工纠正结果只记在纸上，无法与原始图像、模型版本关联，也没有形成稳定的模型改进流程。</li></ol>\n<h4>试运行记录</h4>\n<p>下表中的人工结论来自试运行阶段的逐件复核，仅用于分析模型错误。正式自动处理时，人工结论不是预先可用的输入。</p>\n<div><table><thead><tr><th>产品编号</th><th>批次</th><th>图像质量</th><th>模型缺陷分数</th><th>人工最终结论</th><th>人工说明</th></tr></thead><tbody><tr><td>P001</td><td>B01</td><td>清晰</td><td>0.08</td><td>合格</td><td>无明显缺陷</td></tr><tr><td>P002</td><td>B01</td><td>清晰</td><td>0.92</td><td>不合格</td><td>明显划伤</td></tr><tr><td>P003</td><td>B01</td><td>清晰</td><td>0.55</td><td>合格</td><td>正常纹理被模型关注</td></tr><tr><td>P004</td><td>B02</td><td>模糊</td><td>0.04</td><td>不合格</td><td>检查实物后发现划伤</td></tr><tr><td>P005</td><td>B02</td><td>清晰</td><td>0.12</td><td>不合格</td><td>细小凹陷漏检</td></tr><tr><td>P006</td><td>B02</td><td>清晰</td><td>0.86</td><td>合格</td><td>反光被误判为缺陷</td></tr></tbody></table></div>\n<h4>业务规则</h4>\n<p>以下为企业拟采用的试行规则：</p>\n<ol><li>先检查图像质量。模糊、严重反光或主体不完整时，原分数无效，先补拍一次。补拍后仍不可用，转质检员检查实物，不得自动放行。</li><li>图像可用时按分数分流。缺陷分数小于 0.20，自动放行；大于或等于 0.20 且小于 0.80，转人工复核；大于或等于 0.80，自动隔离待质量人员处理。</li><li>人工复核具有裁定权。人工确认合格可放行，确认不合格应隔离；暂时无法判断的产品保持待检状态，由质量主管继续处理，不得默认合格。</li><li>隔离不等于报废。隔离产品由质量人员按企业标准决定放行、返工或报废。返工完成后重新进入检测流程，不直接送包装。</li><li>必须记录状态。只有当前有效状态为“已放行”的产品才能进入包装；人工改判需要记录人员、理由及时间。</li></ol><h2>业务框架设计</h2><p>用文字说明系统如何连接生产现场、视觉模型、质检人员和包装环节。至少写出：</p>\n<ul><li>四个必要业务模块及各自作用。</li><li>系统与质检人员的职责边界。</li><li>一组用于产品追溯的输入、输出记录，包括记录方向、来源或去向、关键字段。</li></ul><div><table><thead><tr><th>业务模块</th><th>作用</th></tr></thead><tbody><tr><td>现场采集与图像质量校验</td><td>采集产品编号、批次和图像，检查模糊、严重反光及主体完整性；不合格图像补拍一次，仍不可用则转实物检查。</td></tr><tr><td>视觉模型与规则分流</td><td>仅对可用图像执行模型检测，保存模型版本和缺陷分数，按 0.20 与 0.80 阈值分流。</td></tr><tr><td>人工复核与隔离处置</td><td>向质检员提供图像和模型记录；接收合格、不合格、待检结论，隔离后由质量人员决定放行、返工或报废。</td></tr><tr><td>状态追溯与包装联锁</td><td>保存每次检测、补拍、改判和处置；包装前读取当前有效状态，只有已放行产品可以进入包装，并向模型改进提供已核实标签。</td></tr></tbody></table></div>\n<p>系统负责图像有效性检查、规则执行、任务分派、状态同步与留痕。质检员负责实物或图像复核并有裁定权；不能确定的产品交质量主管继续处理，保持待检。质量人员按企业标准决定隔离品的后续处置。模型分数不作为已校准的真实缺陷概率，系统不得自行将隔离等同报废。</p>\n<div><table><thead><tr><th>记录方向</th><th>来源或去向</th><th>关键字段</th></tr></thead><tbody><tr><td>输入</td><td>生产工位或相机到系统</td><td>product_id、batch_id、image_id、图像地址、拍摄时间、图像质量、补拍次数。</td></tr><tr><td>内部输出与反馈</td><td>模型到复核台，质检员反馈系统</td><td>检测记录 ID、产品 ID、模型版本、分数、规则版本、分流路径；人工结论、人员、理由、时间。</td></tr><tr><td>输出</td><td>系统到隔离区与包装环节</td><td>产品 ID、当前状态、状态版本、处置指令、有效时间；包装校验记录。</td></tr><tr><td>输入</td><td>返工工位或质量主管到系统</td><td>产品 ID、原检测 ID、返工或报废决定、复检记录关联、经办人和时间。</td></tr></tbody></table></div><h2>业务流程与处置规则设计</h2><ol><li>编写简短的“条件—处理动作—后续去向”规则表，覆盖图像不可用、低分、中间分数和高分四种情况。</li><li>绘制一张简洁的业务流程图，体现图像检查、模型检测、放行／人工复核／隔离分流，以及处理结果记录。人工复核后的去向和隔离后的处置可直接写在对应节点中，无需画出所有异常支线。</li><li>分别说明 P004、P005 按拟上线规则会进入哪条路径。</li></ol><div><table><thead><tr><th>条件</th><th>处理动作</th><th>后续去向</th></tr></thead><tbody><tr><td>图像模糊、严重反光或主体不完整</td><td>使原分数失效，补拍一次；仍不可用则人工检查实物。</td><td>人工判合格则放行，不合格则隔离，无法判断则待检并交主管；不得自动放行。</td></tr><tr><td>图像可用且分数小于 0.20</td><td>按试行规则自动放行并记录。</td><td>更新已放行状态，包装入口再次校验。</td></tr><tr><td>图像可用且 0.20≤分数＜0.80</td><td>转质检员复核，记录裁定及理由。</td><td>合格放行，不合格隔离，不确定保持待检。</td></tr><tr><td>图像可用且分数≥0.80</td><td>自动隔离，等待质量人员处理。</td><td>质量人员决定放行、返工或报废；返工后重新检测。</td></tr></tbody></table></div>\n<p>P004 的原图模糊，必须先补拍一次，不能依据 0.04 直接放行。若补拍可用，使用新图重新检测并按新分数分流；若仍不可用，质检员检查实物。试运行人工已发现划伤，但该结果不能作为正式自动分流前已知的输入。P005 图像清晰且分数 0.12，按拟上线规则会自动放行，进入包装前状态校验路径。试运行复核证明它实际上不合格，因此暴露出该规则对细小凹陷的漏放风险，不能事后把它写成人工复核路径。边界核对：0.20 进入人工复核，0.80 进入隔离；人工暂时无法判断不得默认合格。状态更新与包装校验需保持一致，可使用版本校验及原子更新防止旧放行记录覆盖新隔离结论。</p><h4>规范业务流程图（参考方案）</h4><div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1190px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1190\" aria-hidden=\"true\"><defs><marker id=\"arrow-b11\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 45V69\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M380 121V145\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M265 200H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"188\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M110 244V300\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M205 350H265\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"234\" y=\"338\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 255V324\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"395\" y=\"291\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M110 400V539\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"157\" y=\"471\" text-anchor=\"middle\" class=\"flow-edge-label\">否：检查实物</text><path d=\"M380 376V410\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M480 460H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"525\" y=\"448\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 510V550\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"440\" y=\"532\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.20</text><path d=\"M280 600H205\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"239\" y=\"581\" text-anchor=\"middle\" class=\"flow-edge-label\">是：中间分数</text><path d=\"M380 650V697\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"441\" y=\"678\" text-anchor=\"middle\" class=\"flow-edge-label\">否：s ≥ 0.80</text><path d=\"M510 760H536\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"535\" y=\"745\" text-anchor=\"middle\" class=\"flow-edge-label\">返工</text><path d=\"M536 95H495\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"520\" y=\"81\" text-anchor=\"middle\" class=\"flow-edge-label\">重检</text><path d=\"M380 823V881\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"452\" y=\"860\" text-anchor=\"middle\" class=\"flow-edge-label\">放行／报废等结果</text><path d=\"M110 661V920H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"160\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M650 490V920H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"590\" y=\"908\" text-anchor=\"middle\" class=\"flow-edge-label\">结果</text><path d=\"M380 959V995\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><path d=\"M500 1050H565\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"531\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M260 1050H200\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/><text x=\"232\" y=\"1038\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1080V1133\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b11)\"/></svg><div class=\"flow-box flow-terminal\" style=\"left:315.0px;top:11.0px;width:130px;height:34px\"><div class=\"flow-text\">开始</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:69.0px;width:230px;height:52px\"><div class=\"flow-text\">采集产品、批次与图像</div></div><div class=\"flow-box flow-decision\" style=\"left:265.0px;top:145.0px;width:230px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 230 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"115.0,1 229,55.0 115.0,109 1,55.0\"/></svg><div class=\"flow-text\">图像是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:156.0px;width:180px;height:88px\"><div class=\"flow-text\">原分数无效<br>补拍一次</div></div><div class=\"flow-box flow-decision\" style=\"left:15.0px;top:300.0px;width:190px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 190 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"95.0,1 189,50.0 95.0,99 1,50.0\"/></svg><div class=\"flow-text\">新图是否可用？</div></div><div class=\"flow-box flow-process\" style=\"left:265.0px;top:324.0px;width:230px;height:52px\"><div class=\"flow-text\">视觉模型检测<br>取得新图的缺陷分数 s</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:410.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.20？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:430.0px;width:170px;height:60px\"><div class=\"flow-text\">自动放行</div></div><div class=\"flow-box flow-decision\" style=\"left:280.0px;top:550.0px;width:200px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 200 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"100.0,1 199,50.0 100.0,99 1,50.0\"/></svg><div class=\"flow-text\">s &lt; 0.80？</div></div><div class=\"flow-box flow-process\" style=\"left:15.0px;top:539.0px;width:190px;height:122px\"><div class=\"flow-text\">质检员复核／检查实物<br>合格→放行；不合格→隔离<br>不确定→待检，交主管</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:697.0px;width:260px;height:126px\"><div class=\"flow-text\">自动隔离，质量人员处置<br>放行／返工／报废<br>返工完成→R，重新检测</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:741.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-connector\" style=\"left:536.0px;top:76.0px;width:38px;height:38px\"><div class=\"flow-text\">R</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:881.0px;width:280px;height:78px\"><div class=\"flow-text\">记录处理结果与当前有效状态<br>关联原图、模型版本<br>人工改判：人员、理由、时间</div></div><div class=\"flow-box flow-decision\" style=\"left:260.0px;top:995.0px;width:240px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 240 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"120.0,1 239,55.0 120.0,109 1,55.0\"/></svg><div class=\"flow-text\">当前有效状态<br>是否已放行？</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:1020.0px;width:170px;height:60px\"><div class=\"flow-text\">进入包装</div></div><div class=\"flow-box flow-process\" style=\"left:20.0px;top:1015.0px;width:180px;height:70px\"><div class=\"flow-text\">阻止进入包装<br>按当前状态继续处置</div></div><div class=\"flow-box flow-terminal\" style=\"left:585.0px;top:1133.0px;width:130px;height:34px\"><div class=\"flow-text\">结束</div></div></div></div><h2>设计验证与改进方案</h2><ol><li>针对 P005 的漏检和 P006 的误判，各提出一项具体改进措施，说明如何判断措施是否有效。</li><li>给出两个能够衡量新流程效果的指标，写清统计口径。</li></ol><p>针对 P005 漏检，补充不同角度、光照和批次的细小凹陷正样本，统一标注后微调检测模型，并在保留的独立凹陷测试集上比较漏检率。若调整分流阈值，应在验证集选定，检查漏检下降与人工复核量增加的权衡，避免只记住 P005。针对 P006 误判，采集已由质检确认的合格反光样本作为困难负样本，结合受控光源或偏振采集改善反光；在独立的合格反光测试集上比较误隔离率，同时核对真实缺陷召回率没有明显下降。流程指标一为自动放行漏放率，口径为“经独立抽检确认实际不合格的自动放行件数÷被抽检的自动放行件数”。采用预先规定的随机或分层抽检，报告抽检量、批次和置信区间。流程指标二为隔离误隔离率，口径为“质量人员最终确认合格的自动隔离件数÷已完成最终裁定的自动隔离件数”。按固定周期及模型版本统计，未裁定件单列。上线前后保持抽检与裁定标准一致。</p>"
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
        "answerHTML": "<div><table><thead><tr><th>智能产品</th><th>解决的业务问题</th><th>主要数据输入</th><th>系统输出或下游动作</th></tr></thead><tbody><tr><td>能源 IoT 采集终端</td><td>仪表离线发现慢，设备数据不统一。</td><td>电表、楼控、储能和充电平台的时间戳、功率、电量、温度、在线状态。</td><td>标准化数据、质量标记和离线事件；异常重试与运维通知。</td></tr><tr><td>AI 负荷预测与能源优化平台</td><td>高峰判断依赖人工，设备缺少协同调度。</td><td>历史和实时负荷、天气预报、工作日、活动、分时电价、设备能力和运行边界。</td><td>未来 30 分钟负荷预测、峰值风险、削峰方案、预期效果及审批任务。</td></tr><tr><td>智能控制网关</td><td>执行与反馈分散，异常缺少保护。</td><td>已通过约束校验及必要审批的策略、设备目标值、有效期和安全约束。</td><td>向非关键空调、储能及充电设施下发调节指令；返回状态，失败时停发、恢复安全策略并通知值班人员。</td></tr></tbody></table></div>\n<p>运行规则表如下。</p>\n<div><table><thead><tr><th>情况</th><th>判断条件</th><th>处理动作</th></tr></thead><tbody><tr><td>能源数据连续缺失</td><td>连续超过 5 分钟仍无数据。</td><td>重试采集并标记异常；重试仍失败则以最近可靠值临时估计，记录原值时间和估计标志，同时通知运维。估计不可伪装为真实采集值。</td></tr><tr><td>预测出现峰值风险</td><td>未来 30 分钟预测负荷达到或超过 1500kW。</td><td>生成削峰建议，进入边界校验及审批；低于 1500kW 则持续监测。</td></tr><tr><td>调度触及运行边界</td><td>预计使办公温度低于 24℃ 或高于 27℃，或涉及关键负荷自动削减。</td><td>拒绝越界方案并重新优化或交人工处理；消防、安防、数据机房等关键负荷不得自动削减。</td></tr><tr><td>控制指令执行失败</td><td>下发后 60 秒内未收到成功反馈，包括明确失败。</td><td>停止继续下发，恢复预先验证的安全策略，通知值班人员；核查设备实际状态，防止盲目重试。</td></tr></tbody></table></div>\n<p>高风险策略在发布前必须由能源管理员确认。所有策略均记录策略版本、审批人或审批依据、设备指令、执行结果及时间；审批尚未通过的高风险策略不得发给网关。流程图包含 8 个主要节点：持续采集 → 数据质量判断 → 负荷预测与峰值判断 → 生成削峰建议 → 运行边界校验 → 能源管理员审批（高风险）→ 网关执行 → 结果留痕与实际负荷复核，复核后回到持续采集。数据缺失处理保留估计标志；边界不满足时修改后重新校验；高风险审批未通过时不执行。</p><h4>规范业务流程图（参考方案）</h4><div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1220px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1220\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 95V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M255 190H210\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"232\" y=\"178\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M120 134V110H380V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"175\" y=\"102\" text-anchor=\"middle\" class=\"flow-edge-label\">重试／降级校验</text><path d=\"M380 245V295\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"272\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 415V465\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"445\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 355H750V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"651\" y=\"343\" text-anchor=\"middle\" class=\"flow-edge-label\">否：记录后持续监测</text><path d=\"M380 555V600\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M520 510H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"543\" y=\"495\" text-anchor=\"middle\" class=\"flow-edge-label\">约束</text><path d=\"M240 665H220V510H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"174\" y=\"545\" text-anchor=\"middle\" class=\"flow-edge-label\">否：修改后重审</text><path d=\"M380 730V780\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"758\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 850V900\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M380 1020V1062\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"1050\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M510 960H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"535\" y=\"948\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1015V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"637\" y=\"1106\" text-anchor=\"middle\" class=\"flow-edge-label\">处置结果</text><path d=\"M380 1177V1190H15V60H250\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"145\" y=\"1180\" text-anchor=\"middle\" class=\"flow-edge-label\">持续监测与反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:250.0px;top:25.0px;width:260px;height:70px\"><div class=\"flow-text\">① IoT终端持续采集<br>电表／楼控／储能／充电数据</div></div><div class=\"flow-box flow-decision\" style=\"left:255.0px;top:135.0px;width:250px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 250 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"125.0,1 249,55.0 125.0,109 1,55.0\"/></svg><div class=\"flow-text\">② 数据是否可用？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:134.0px;width:180px;height:112px\"><div class=\"flow-text\">连续缺失 &gt;5分钟：重试<br>仍失败→最近可靠值估计<br>保留估计标志并通知运维<br>降级数据重新校验</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:295.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ AI预测未来30分钟<br>负荷 ≥1500kW？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:465.0px;width:280px;height:90px\"><div class=\"flow-text\">④ AI平台生成削峰建议<br>运行边界校验</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:460.0px;width:180px;height:100px\"><div class=\"flow-text\">温度24～27℃<br>不得自动削减关键负荷<br>越界→修改／重新优化</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:600.0px;width:280px;height:130px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 130\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,65.0 140.0,129 1,65.0\"/></svg><div class=\"flow-text\">⑤ 边界合规且<br>必要审批已通过？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:613.0px;width:180px;height:104px\"><div class=\"flow-text\">高风险→能源管理员确认<br>未批准不得执行<br>低风险须在授权范围内</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:780.0px;width:260px;height:70px\"><div class=\"flow-text\">⑥ 控制网关执行<br>接收策略、回传设备状态</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:900.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 60秒内收到<br>成功反馈？</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:905.0px;width:180px;height:110px\"><div class=\"flow-text\">明确失败或超时：<br>停止继续下发<br>恢复安全策略并通知值班<br>核对实际设备状态</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:1062.5px;width:280px;height:115px\"><div class=\"flow-text\">⑧ 留痕与实际负荷复核<br>记录策略、审批、指令与结果<br>反馈至持续采集与模型改进</div></div></div></div>",
        "flowchart": {
          "html": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1220px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1220\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 95V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M255 190H210\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"232\" y=\"178\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M120 134V110H380V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"175\" y=\"102\" text-anchor=\"middle\" class=\"flow-edge-label\">重试／降级校验</text><path d=\"M380 245V295\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"272\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 415V465\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"445\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 355H750V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"651\" y=\"343\" text-anchor=\"middle\" class=\"flow-edge-label\">否：记录后持续监测</text><path d=\"M380 555V600\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M520 510H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"543\" y=\"495\" text-anchor=\"middle\" class=\"flow-edge-label\">约束</text><path d=\"M240 665H220V510H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"174\" y=\"545\" text-anchor=\"middle\" class=\"flow-edge-label\">否：修改后重审</text><path d=\"M380 730V780\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"758\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 850V900\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M380 1020V1062\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"1050\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M510 960H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"535\" y=\"948\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1015V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"637\" y=\"1106\" text-anchor=\"middle\" class=\"flow-edge-label\">处置结果</text><path d=\"M380 1177V1190H15V60H250\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"145\" y=\"1180\" text-anchor=\"middle\" class=\"flow-edge-label\">持续监测与反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:250.0px;top:25.0px;width:260px;height:70px\"><div class=\"flow-text\">① IoT终端持续采集<br>电表／楼控／储能／充电数据</div></div><div class=\"flow-box flow-decision\" style=\"left:255.0px;top:135.0px;width:250px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 250 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"125.0,1 249,55.0 125.0,109 1,55.0\"/></svg><div class=\"flow-text\">② 数据是否可用？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:134.0px;width:180px;height:112px\"><div class=\"flow-text\">连续缺失 &gt;5分钟：重试<br>仍失败→最近可靠值估计<br>保留估计标志并通知运维<br>降级数据重新校验</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:295.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ AI预测未来30分钟<br>负荷 ≥1500kW？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:465.0px;width:280px;height:90px\"><div class=\"flow-text\">④ AI平台生成削峰建议<br>{{0}}</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:460.0px;width:180px;height:100px\"><div class=\"flow-text\">温度24～27℃<br>不得自动削减关键负荷<br>越界→修改／重新优化</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:600.0px;width:280px;height:130px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 130\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,65.0 140.0,129 1,65.0\"/></svg><div class=\"flow-text\">⑤ 边界合规且<br>必要审批已通过？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:613.0px;width:180px;height:104px\"><div class=\"flow-text\">{{1}}<br>未批准不得执行<br>低风险须在授权范围内</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:780.0px;width:260px;height:70px\"><div class=\"flow-text\">⑥ 控制网关执行<br>接收策略、回传设备状态</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:900.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 60秒内收到<br>成功反馈？</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:905.0px;width:180px;height:110px\"><div class=\"flow-text\">明确失败或超时：<br>停止继续下发<br>恢复安全策略并通知值班<br>核对实际设备状态</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:1062.5px;width:280px;height:115px\"><div class=\"flow-text\">{{2}}<br>记录策略、审批、指令与结果<br>反馈至持续采集与模型改进</div></div></div></div>",
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
        }
      },
      {
        "id": "b3t2",
        "title": "实施与运营设计",
        "promptHTML": "<p>（1）计算并填写验收指标：最大用电负荷比现状降低 12%；月均电费比现状降低 8%；能源数据完整率达到 99% 以上；峰值风险平均响应时间缩短至 5 分钟以内。（2）制定三阶段实施计划（总周期 8 周）：数据接入与基线建立（第 1～2 周）、策略仿真与小范围试点（第 3～5 周）、推广上线与指标验收（第 6～8 周），写出各阶段关键任务、验收输出和主要责任人。（3）明确人机协作边界，说明智能系统和工作人员的工作边界。（4）制定运行风险控制措施，包括仪表离线或采集数据异常、负荷预测随季节和业态变化失准、控制指令未执行或设备状态异常。</p>",
        "answerHTML": "<div><table><thead><tr><th>指标</th><th>上线前</th><th>建设目标</th><th>验收目标值</th></tr></thead><tbody><tr><td>最大用电负荷</td><td>1680kW</td><td>降低 12%</td><td>不高于 1478.4kW，削减至少 201.6kW。</td></tr><tr><td>月均电费</td><td>125 万元</td><td>降低 8%</td><td>不高于 115 万元，节省至少 10 万元。</td></tr><tr><td>能源数据完整率</td><td>91%</td><td>达到 99% 以上</td><td>不低于 99%，较现状提高至少 8 个百分点。</td></tr><tr><td>峰值风险平均响应时间</td><td>25 分钟</td><td>缩短至 5 分钟以内</td><td>平均不超过 5 分钟，较现状缩短至少 80%。</td></tr></tbody></table></div>\n<p>计算过程：1680×（1－12%）＝1478.4；125×（1－8%）＝115。1500kW 是风险触发阈值，1478.4kW 是最大负荷验收上限，二者用途不同。验收口径：最大负荷按与现状相同的计量时间粒度统计；电费按可比天气、工作日、业态和电价条件核对实际账单。数据完整率＝有效实测数据点数÷应采数据点数，临时估计不算真实完整采集。响应时间从风险事件生成至首次成功调节反馈，未成功事件单列并说明，不能删除失败记录后计算平均值；同时检查温度、关键负荷及安全约束达标情况。</p>\n<div><table><thead><tr><th>阶段与周期</th><th>关键任务</th><th>验收输出</th><th>主要责任人</th></tr></thead><tbody><tr><td>数据接入与基线建立（第 1 至 2 周）</td><td>盘点设备和接口，统一时间与数据字典；建立采集、缺失重试、质量告警及原始基线；确认关键负荷白名单。</td><td>接入清单、数据质量报告、基线报告、运行约束和权限表。</td><td>数据接入负责人主责，运维及能源管理员确认。</td></tr><tr><td>策略仿真与小范围试点（第 3 至 5 周）</td><td>训练预测模型；仿真负荷调节和温度边界；选非关键区域试点，验证审批、60 秒超时保护及回滚。</td><td>预测回测报告、试点报告、边界与故障测试记录、安全策略及操作规程。</td><td>算法负责人和控制工程师主责，能源管理员审批试点。</td></tr><tr><td>推广上线与指标验收（第 6 至 8 周）</td><td>分批推广并监测实际效果，完成培训和应急演练，按统一口径核对负荷、电费、完整率与响应时长。</td><td>上线记录、验收报告、问题关闭清单、值班与运维交接资料。</td><td>项目经理主责，能源管理员和运维负责人共同验收。</td></tr></tbody></table></div>\n<p>8 周内若未覆盖完整账单周期或代表性季节，应保留阶段验收记录，月均电费及季节表现以完整可比周期补充复核，不能将短期节费直接认定为长期收益。人机协作边界：系统负责采集、质量标记、预测、约束校验、建议生成、授权范围内控制与留痕。工作人员负责设备故障排查、运行边界制定、高风险策略审批、异常接管和验收。算法不绕过温度或关键负荷约束，运维人员也不通过删除异常记录制造达标结果。风险控制一是仪表离线或数据异常，按超过 5 分钟重试及临时估计规则处理，并核对同回路数据、记录估计时效；持续异常时降级为保守策略和人工监测，待实测恢复后对账。风险控制二是季节与业态变化导致预测失准，按季节、时段和楼栋监测误差及峰值漏报，达到预设条件后用新数据回测、再训练和灰度发布，同时保留旧模型与人工策略。风险控制三是指令未执行或设备异常，采用指令编号、有效期、幂等和状态回读；60 秒内无成功反馈即停发、恢复安全策略并通知值班。安全策略恢复也要读取设备实际状态，无法确认时人工接管，避免反复下发造成储能或负荷冲击。</p>"
      }
    ],
    "steps": [
      {
        "id": "b3-1",
        "title": "连接三类智能产品",
        "goal": "明确采集终端、AI 平台、控制网关的数据流与职责。",
        "code": "IoT 终端 → {{}}。\nAI 平台 → {{}}。\n控制网关 → {{}}。",
        "solution": "IoT 终端 → 标准化数据、质量标记与离线事件。\nAI 平台 → 未来30分钟预测、风险与削峰建议。\n控制网关 → 执行已校验策略并返回状态。",
        "slots": [
          {
            "answer": "标准化数据、质量标记与离线事件",
            "choices": [
              "标准化数据、质量标记与离线事件",
              "直接决定报废",
              "跳过数据质量"
            ],
            "why": "采集端统一电表、楼控、储能和充电数据，提供质量标记。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "标准化",
                  "统一数据"
                ],
                [
                  "质量",
                  "异常标记"
                ],
                [
                  "离线",
                  "掉线"
                ]
              ]
            }
          },
          {
            "answer": "未来30分钟预测、风险与削峰建议",
            "choices": [
              "未来30分钟预测、风险与削峰建议",
              "未经校验直接控制所有负荷",
              "只做历史账单归档"
            ],
            "why": "平台综合历史负荷、天气、工作日、活动和电价生成方案。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "30分钟",
                  "半小时"
                ],
                [
                  "预测"
                ],
                [
                  "风险",
                  "预警"
                ],
                [
                  "削峰",
                  "调度建议"
                ]
              ]
            }
          },
          {
            "answer": "执行已校验策略并返回状态",
            "choices": [
              "执行已校验策略并返回状态",
              "自行绕过审批",
              "用预测代替执行回执"
            ],
            "why": "网关接收经过约束校验与必要审批的策略，并回传设备执行结果。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "已校验",
                  "已批准",
                  "审批通过",
                  "已审核"
                ],
                [
                  "执行",
                  "下发"
                ],
                [
                  "反馈",
                  "回传",
                  "返回",
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
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:870px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 870\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3-step-0\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 125V170\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-0)\"/><text x=\"402\" y=\"150\" text-anchor=\"middle\" class=\"flow-edge-label\">数据</text><path d=\"M380 290V340\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-0)\"/><text x=\"421\" y=\"322\" text-anchor=\"middle\" class=\"flow-edge-label\">建议与策略</text><path d=\"M380 470V525\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-0)\"/><text x=\"395\" y=\"503\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M250 405H210\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-0)\"/><text x=\"230\" y=\"392\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M120 360V230H220\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-0)\"/><text x=\"152\" y=\"215\" text-anchor=\"middle\" class=\"flow-edge-label\">修改后重新校验</text><path d=\"M380 635V710\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-0)\"/><text x=\"420\" y=\"679\" text-anchor=\"middle\" class=\"flow-edge-label\">状态回执</text><path d=\"M380 790V840H10V70H230\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-0)\"/><text x=\"173\" y=\"830\" text-anchor=\"middle\" class=\"flow-edge-label\">监测与反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:230.0px;top:15.0px;width:300px;height:110px\"><div class=\"flow-text\">IoT采集终端输出<br>{{0}}</div></div><div class=\"flow-box flow-process\" style=\"left:220.0px;top:170.0px;width:320px;height:120px\"><div class=\"flow-text\">AI平台输出<br>{{1}}</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:340.0px;width:260px;height:130px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 130\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,65.0 130.0,129 1,65.0\"/></svg><div class=\"flow-text\">运行边界合规且<br>必要审批已通过？</div></div><div class=\"flow-box flow-process\" style=\"left:230.0px;top:525.0px;width:300px;height:110px\"><div class=\"flow-text\">控制网关<br>{{2}}</div></div><div class=\"flow-box flow-process\" style=\"left:230.0px;top:710.0px;width:300px;height:80px\"><div class=\"flow-text\">记录执行结果与实际状态<br>反馈至采集端和AI平台</div></div><div class=\"flow-box flow-process\" style=\"left:30.0px;top:360.0px;width:180px;height:90px\"><div class=\"flow-text\">拒绝执行<br>修改方案后重审</div></div></div></div>"
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
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:830px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 830\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3-step-1\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 75V100\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-1)\"/><path d=\"M220 205H100V350\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-1)\"/><text x=\"161\" y=\"193\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M540 205H650V345\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-1)\"/><text x=\"590\" y=\"193\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M100 420V475\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-1)\"/><path d=\"M190 525H250\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-1)\"/><text x=\"219\" y=\"512\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M100 575V750H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-1)\"/><text x=\"139\" y=\"736\" text-anchor=\"middle\" class=\"flow-edge-label\">是：恢复实测</text><path d=\"M650 425V750H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-1)\"/><text x=\"598\" y=\"736\" text-anchor=\"middle\" class=\"flow-edge-label\">有效数据</text><path d=\"M380 600V700\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-1)\"/><text x=\"421\" y=\"657\" text-anchor=\"middle\" class=\"flow-edge-label\">重新校验</text></svg><div class=\"flow-box flow-process\" style=\"left:255.0px;top:15.0px;width:250px;height:60px\"><div class=\"flow-text\">持续采集与数据质量检查</div></div><div class=\"flow-box flow-decision\" style=\"left:220.0px;top:100.0px;width:320px;height:210px\"><svg class=\"flow-shape\" viewBox=\"0 0 320 210\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"160.0,1 319,105.0 160.0,209 1,105.0\"/></svg><div class=\"flow-text\">连续缺失超过<br>{{0}} 分钟？</div></div><div class=\"flow-box flow-process\" style=\"left:10.0px;top:350.0px;width:180px;height:70px\"><div class=\"flow-text\">重试并标记异常</div></div><div class=\"flow-box flow-decision\" style=\"left:10.0px;top:475.0px;width:180px;height:100px\"><svg class=\"flow-shape\" viewBox=\"0 0 180 100\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"90.0,1 179,50.0 90.0,99 1,50.0\"/></svg><div class=\"flow-text\">重试是否恢复？</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:450.0px;width:260px;height:150px\"><div class=\"flow-text\">仍失败，临时估计采用<br>{{1}}<br>标记估计值并通知运维</div></div><div class=\"flow-box flow-process\" style=\"left:565.0px;top:345.0px;width:170px;height:80px\"><div class=\"flow-text\">使用有效实测数据<br>进入后续分析</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:700.0px;width:280px;height:100px\"><div class=\"flow-text\">记录数据来源、质量与时效<br>降级估计重新校验<br>恢复后切回实测数据</div></div></div></div>"
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
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:830px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 830\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3-step-2\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 145V205\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-2)\"/><path d=\"M220 310H120V465\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-2)\"/><text x=\"155\" y=\"297\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M540 310H590V460\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-2)\"/><text x=\"568\" y=\"297\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M120 555V710H235\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-2)\"/><path d=\"M590 560V710H525\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-2)\"/><path d=\"M380 755V800H5V80H230\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-2)\"/><text x=\"132\" y=\"789\" text-anchor=\"middle\" class=\"flow-edge-label\">持续监测</text></svg><div class=\"flow-box flow-process\" style=\"left:230.0px;top:15.0px;width:300px;height:130px\"><div class=\"flow-text\">AI平台负荷预测<br>预测窗口（分钟）<br>{{0}}</div></div><div class=\"flow-box flow-decision\" style=\"left:220.0px;top:205.0px;width:320px;height:210px\"><svg class=\"flow-shape\" viewBox=\"0 0 320 210\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"160.0,1 319,105.0 160.0,209 1,105.0\"/></svg><div class=\"flow-text\">预测负荷达到阈值？<br>≥ {{1}} kW</div></div><div class=\"flow-box flow-process\" style=\"left:25.0px;top:465.0px;width:190px;height:90px\"><div class=\"flow-text\">未触发削峰<br>持续监测</div></div><div class=\"flow-box flow-process\" style=\"left:450.0px;top:460.0px;width:280px;height:100px\"><div class=\"flow-text\">生成削峰建议<br>校验24～27℃及关键负荷边界<br>必要时由能源管理员审批</div></div><div class=\"flow-box flow-process\" style=\"left:235.0px;top:665.0px;width:290px;height:90px\"><div class=\"flow-text\">授权执行或记录未触发结果<br>复核实际负荷并反馈</div></div></div></div>"
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
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:830px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 830\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3-step-3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 170V270\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-3)\"/><path d=\"M235 340H120V460\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-3)\"/><text x=\"167\" y=\"327\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M525 340H590V490\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-3)\"/><text x=\"558\" y=\"327\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M120 620V670H5V90H235\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-3)\"/><text x=\"119\" y=\"657\" text-anchor=\"middle\" class=\"flow-edge-label\">修改后重审</text><path d=\"M590 590V760H525\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-3)\"/></svg><div class=\"flow-box flow-process\" style=\"left:235.0px;top:10.0px;width:290px;height:160px\"><div class=\"flow-text\">生成削峰建议并设置办公温度<br>下限（℃） {{0}}<br>上限（℃） {{1}}</div></div><div class=\"flow-box flow-decision\" style=\"left:235.0px;top:270.0px;width:290px;height:140px\"><svg class=\"flow-shape\" viewBox=\"0 0 290 140\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"145.0,1 289,70.0 145.0,139 1,70.0\"/></svg><div class=\"flow-text\">温度范围合规且<br>未自动削减关键负荷？</div></div><div class=\"flow-box flow-process\" style=\"left:25.0px;top:460.0px;width:190px;height:160px\"><div class=\"flow-text\">关键负荷<br>{{2}}<br>越界方案拒绝执行<br>重新优化或转人工</div></div><div class=\"flow-box flow-process\" style=\"left:455.0px;top:490.0px;width:270px;height:100px\"><div class=\"flow-text\">通过边界校验<br>高风险先由能源管理员审批<br>在授权范围内执行</div></div><div class=\"flow-box flow-process\" style=\"left:235.0px;top:717.5px;width:290px;height:85px\"><div class=\"flow-text\">记录校验、审批与执行结果<br>复核实际运行状态</div></div></div></div>"
      },
      {
        "id": "b3-5",
        "title": "失败保护与审批留痕",
        "goal": "控制下发后没有成功反馈，不能继续盲目重试。",
        "code": "下发后 {{}} 秒内未收到成功反馈 → {{}}，通知值班人员。\n高风险策略必须由 {{}} 确认后执行。\n策略、审批人、指令、结果和时间全程记录。",
        "solution": "下发后 60 秒内未收到成功反馈 → 停止继续下发并恢复安全策略，通知值班人员。\n高风险策略必须由 能源管理员 确认后执行。\n策略、审批人、指令、结果和时间全程记录。",
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
            "answer": "停止继续下发并恢复安全策略",
            "choices": [
              "停止继续下发并恢复安全策略",
              "无限重发",
              "把无回执当成功"
            ],
            "why": "停止继续下发，核查设备实际状态，无法确认则人工接管。",
            "accepted": [],
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
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1130px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1130\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3-step-4\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M250 85H100V195\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-4)\"/><text x=\"173\" y=\"72\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 150V430\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-4)\"/><text x=\"453\" y=\"356\" text-anchor=\"middle\" class=\"flow-edge-label\">否：授权低风险</text><path d=\"M100 345V470H235\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-4)\"/><text x=\"143\" y=\"456\" text-anchor=\"middle\" class=\"flow-edge-label\">已批准</text><path d=\"M380 510V570\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-4)\"/><path d=\"M540 680H650V795\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-4)\"/><text x=\"596\" y=\"667\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M380 790V1000\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-4)\"/><text x=\"395\" y=\"914\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M650 945V1050H530\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3-step-4)\"/><text x=\"608\" y=\"1036\" text-anchor=\"middle\" class=\"flow-edge-label\">处置结果</text></svg><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:20.0px;width:260px;height:130px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 130\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,65.0 130.0,129 1,65.0\"/></svg><div class=\"flow-text\">策略是否属于高风险？</div></div><div class=\"flow-box flow-process\" style=\"left:5.0px;top:195.0px;width:190px;height:150px\"><div class=\"flow-text\">执行前必须由<br>{{2}}<br>确认通过<br>未批准不得下发</div></div><div class=\"flow-box flow-process\" style=\"left:235.0px;top:430.0px;width:290px;height:80px\"><div class=\"flow-text\">边界合规、必要审批通过<br>网关下发已授权控制策略</div></div><div class=\"flow-box flow-decision\" style=\"left:220.0px;top:570.0px;width:320px;height:220px\"><svg class=\"flow-shape\" viewBox=\"0 0 320 220\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"160.0,1 319,110.0 160.0,219 1,110.0\"/></svg><div class=\"flow-text\">在 {{0}} 秒内<br>收到成功反馈？</div></div><div class=\"flow-box flow-process\" style=\"left:555.0px;top:795.0px;width:190px;height:150px\"><div class=\"flow-text\">明确失败或超时<br>{{1}}<br>通知值班并核对实际状态</div></div><div class=\"flow-box flow-process\" style=\"left:230.0px;top:1000.0px;width:300px;height:100px\"><div class=\"flow-text\">记录策略、审批人、指令<br>反馈结果及时间<br>复核实际状态，进入监测闭环</div></div></div></div>"
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
        "flowchartHTML": "<div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1220px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1220\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 95V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M255 190H210\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"232\" y=\"178\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M120 134V110H380V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"175\" y=\"102\" text-anchor=\"middle\" class=\"flow-edge-label\">重试／降级校验</text><path d=\"M380 245V295\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"272\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 415V465\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"445\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 355H750V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"651\" y=\"343\" text-anchor=\"middle\" class=\"flow-edge-label\">否：记录后持续监测</text><path d=\"M380 555V600\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M520 510H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"543\" y=\"495\" text-anchor=\"middle\" class=\"flow-edge-label\">约束</text><path d=\"M240 665H220V510H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"174\" y=\"545\" text-anchor=\"middle\" class=\"flow-edge-label\">否：修改后重审</text><path d=\"M380 730V780\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"758\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 850V900\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M380 1020V1062\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"1050\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M510 960H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"535\" y=\"948\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1015V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"637\" y=\"1106\" text-anchor=\"middle\" class=\"flow-edge-label\">处置结果</text><path d=\"M380 1177V1190H15V60H250\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"145\" y=\"1180\" text-anchor=\"middle\" class=\"flow-edge-label\">持续监测与反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:250.0px;top:25.0px;width:260px;height:70px\"><div class=\"flow-text\">① IoT终端持续采集<br>电表／楼控／储能／充电数据</div></div><div class=\"flow-box flow-decision\" style=\"left:255.0px;top:135.0px;width:250px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 250 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"125.0,1 249,55.0 125.0,109 1,55.0\"/></svg><div class=\"flow-text\">② 数据是否可用？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:134.0px;width:180px;height:112px\"><div class=\"flow-text\">连续缺失 &gt;5分钟：重试<br>仍失败→最近可靠值估计<br>保留估计标志并通知运维<br>降级数据重新校验</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:295.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ AI预测未来30分钟<br>负荷 ≥1500kW？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:465.0px;width:280px;height:90px\"><div class=\"flow-text\">④ AI平台生成削峰建议<br>{{0}}</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:460.0px;width:180px;height:100px\"><div class=\"flow-text\">温度24～27℃<br>不得自动削减关键负荷<br>越界→修改／重新优化</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:600.0px;width:280px;height:130px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 130\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,65.0 140.0,129 1,65.0\"/></svg><div class=\"flow-text\">⑤ 边界合规且<br>必要审批已通过？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:613.0px;width:180px;height:104px\"><div class=\"flow-text\">{{1}}<br>未批准不得执行<br>低风险须在授权范围内</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:780.0px;width:260px;height:70px\"><div class=\"flow-text\">⑥ 控制网关执行<br>接收策略、回传设备状态</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:900.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 60秒内收到<br>成功反馈？</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:905.0px;width:180px;height:110px\"><div class=\"flow-text\">明确失败或超时：<br>停止继续下发<br>恢复安全策略并通知值班<br>核对实际设备状态</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:1062.5px;width:280px;height:115px\"><div class=\"flow-text\">⑧ {{2}}<br>记录策略、审批、指令与结果<br>反馈至持续采集与模型改进</div></div></div></div>"
      },
      {
        "id": "b3-7",
        "title": "计算四项验收目标",
        "goal": "用题设基线计算目标，保留单位并区分百分比与百分点。",
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
            "why": "完整率至少 99%，比 91% 提高至少 8 个百分点；估计值不计入有效实测。",
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
            "why": "平均响应时间不超过 5 分钟，失败事件另行记录。",
            "accepted": [],
            "matchRule": {}
          }
        ],
        "hint": "降低比例乘以原值；验收上限不是风险阈值。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：实施与运营设计"
      },
      {
        "id": "b3-8",
        "title": "安排八周实施计划",
        "goal": "按照接入、试点、推广的顺序，明确任务、交付与责任人。",
        "code": "第 {{}} 周：数据接入与基线建立，数据负责人主责。\n第 {{}} 周：策略仿真与小范围试点，算法及控制工程师主责。\n第 {{}} 周：推广上线与指标验收，项目经理主责。",
        "solution": "第 1～2 周：数据接入与基线建立，数据负责人主责。\n第 3～5 周：策略仿真与小范围试点，算法及控制工程师主责。\n第 6～8 周：推广上线与指标验收，项目经理主责。",
        "slots": [
          {
            "answer": "1～2",
            "choices": [
              "1～2",
              "1～3",
              "1～5"
            ],
            "why": "首阶段形成接口清单、质量报告、基线、权限和关键负荷约束。",
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
            "why": "试点验证预测、边界、审批、60 秒保护和回滚，形成试点及故障测试记录。",
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
            "why": "推广阶段输出验收报告、问题关闭清单、培训和运维交接。",
            "accepted": [
              "6-8",
              "6至8"
            ],
            "matchRule": {}
          }
        ],
        "hint": "三个阶段分别是 1～2、3～5、6～8 周。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：实施与运营设计"
      },
      {
        "id": "b3-9",
        "title": "明确人机边界与验收口径",
        "goal": "让系统自动做可授权的工作，把高风险判断和现场处置交给有权人员。",
        "code": "系统：采集、质量标记、预测、校验、授权执行和留痕。\n人员：{{}}、故障排查、异常接管和验收。\n数据完整率分子只计 {{}}。\n响应时长统计从风险生成到 {{}}。",
        "solution": "系统：采集、质量标记、预测、校验、授权执行和留痕。\n人员：高风险策略审批、故障排查、异常接管和验收。\n数据完整率分子只计 有效实测数据点。\n响应时长统计从风险生成到 首次成功调节反馈。",
        "slots": [
          {
            "answer": "高风险策略审批",
            "choices": [
              "高风险策略审批",
              "随意删除异常",
              "默认放弃安全边界"
            ],
            "why": "人员负责高风险确认与现场判断，不得由算法替代审批。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "高风险"
                ],
                [
                  "审批",
                  "批准",
                  "确认"
                ]
              ]
            }
          },
          {
            "answer": "有效实测数据点",
            "choices": [
              "有效实测数据点",
              "临时估计点",
              "所有填补值"
            ],
            "why": "临时估计不等于实测完整，不能用填补数据制造达标。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "实测",
                  "实际采集",
                  "真实采集"
                ],
                [
                  "有效",
                  "合格"
                ]
              ]
            }
          },
          {
            "answer": "首次成功调节反馈",
            "choices": [
              "首次成功调节反馈",
              "生成建议",
              "发送指令"
            ],
            "why": "不能只统计系统发出建议的耗时；失败与未完成事件需单列。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "首次",
                  "第一次"
                ],
                [
                  "成功"
                ],
                [
                  "反馈",
                  "回执"
                ]
              ]
            }
          }
        ],
        "hint": "验收必须证明真实执行效果，不能只证明“发过指令”。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：实施与运营设计"
      },
      {
        "id": "b3-10",
        "title": "建立运行风险闭环",
        "goal": "针对采集异常、预测失准和指令失败，分别制定可操作措施。",
        "code": "采集异常：重试、估计标记、运维核查和保守降级。\n预测失准：按季节／业态监测，{{}}。\n执行异常：有效期、幂等与状态回读，超时后停发并恢复安全策略。\n电费验收采用 {{}}，不把短期试点直接当长期收益。",
        "solution": "采集异常：重试、估计标记、运维核查和保守降级。\n预测失准：按季节／业态监测，回测再训练并灰度发布。\n执行异常：有效期、幂等与状态回读，超时后停发并恢复安全策略。\n电费验收采用 完整可比账单周期，不把短期试点直接当长期收益。",
        "slots": [
          {
            "answer": "回测再训练并灰度发布",
            "choices": [
              "回测再训练并灰度发布",
              "直接覆盖旧模型且不验证",
              "只删掉预测误差"
            ],
            "why": "保留旧模型和人工策略，达到预设触发条件后用新数据验证发布。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "回测",
                  "验证"
                ],
                [
                  "再训练",
                  "重新训练"
                ],
                [
                  "灰度",
                  "小流量",
                  "试点"
                ]
              ]
            }
          },
          {
            "answer": "完整可比账单周期",
            "choices": [
              "完整可比账单周期",
              "任意一天外推全年",
              "只看最好的一小时"
            ],
            "why": "核对天气、工作日、业态、电价；8 周未覆盖代表性季节时应补充复核。",
            "accepted": [],
            "matchRule": {
              "groups": [
                [
                  "完整",
                  "整月",
                  "全周期"
                ],
                [
                  "可比",
                  "同口径",
                  "相同条件"
                ],
                [
                  "账单",
                  "电费",
                  "计费周期"
                ]
              ]
            }
          }
        ],
        "hint": "每项风险都有发现、处置、恢复验证和记录。",
        "context": "",
        "taskIndex": 1,
        "examComments": "原题任务：实施与运营设计"
      }
    ],
    "count": 10,
    "originalCode": "智能产品应用方案设计\n\n实施与运营设计",
    "referenceCode": "",
    "downloadPath": "materials/b3-reference.html",
    "referenceHTML": "<h1>B3 · 智慧园区能源预测与智能调度解决方案设计</h1><p>参考解法（整理版），不代表唯一表述或官方评分细则。</p><h4>业务背景</h4>\n<p>你是某智慧园区运营企业的人工智能训练师，正在参与园区能源管理系统升级。园区包含办公楼、商业配套、地下车库、新能源汽车充电区和储能设备。经调研，目前能源管理存在以下问题：</p>\n<ol><li>园区最大用电负荷为 1680kW，高峰负荷主要依靠人工观察后处理，容易产生需量费用。</li><li>月均电费约 125 万元，空调、储能和充电设施缺少统一调度。</li><li>能源数据完整率为 91%，部分仪表离线后不能及时补偿或告警。</li><li>从发现高峰风险到执行调节的平均时间为 25 分钟，响应速度较慢。</li><li>设备数据、预测结果、控制指令和执行反馈分散，无法形成完整追溯记录。</li></ol>\n<p>企业计划应用以下 3 类智能产品：</p>\n<ul><li>能源 IoT 采集终端</li><li>AI 负荷预测与能源优化平台</li><li>智能控制网关</li></ul>\n<p>园区现有电表、楼宇自控系统、储能系统和充电平台均可通过接口交换数据。AI 平台可结合历史负荷、天气预报、工作日类型、园区活动和分时电价，输出未来 30 分钟负荷预测、峰值风险及推荐调度方案。智能控制网关可接收经过确认的策略，对非关键空调负荷、储能充放电和充电设施功率进行调节，并返回执行状态。</p>\n<h4>运行约束</h4>\n<ol><li>能源数据连续缺失超过 5 分钟时，系统重试采集并标记异常；重试后仍无数据则使用最近可靠值形成临时估计，同时通知运维人员核查。</li><li>预测未来 30 分钟园区负荷达到或超过 1500kW 时，系统判定为峰值风险并生成削峰建议。</li><li>办公区域温度应保持在 24～27℃，消防、安防、数据机房等关键负荷不得自动削减。</li><li>调节指令发出后 60 秒内未收到成功反馈，应停止继续下发，恢复安全策略并通知值班人员。</li><li>策略、审批人、设备指令、执行结果和时间必须完整留痕；高风险策略必须由能源管理员确认后执行。</li></ol><h2>智能产品应用方案设计</h2><p>（1）完成智能产品应用设计表，写明每类产品解决的业务问题、主要数据输入、系统输出或下游动作。（2）根据题目给出的约束，完成运行规则表，填写判断条件和处理动作，覆盖能源数据连续缺失、预测出现峰值风险、调度方案触及运行边界、控制指令执行失败。（3）绘制多产品协同流程图：体现产品之间的信息传递、业务判断及分支处理、人机协作和结果闭环，主要节点控制在 6～8 个。</p><div><table><thead><tr><th>智能产品</th><th>解决的业务问题</th><th>主要数据输入</th><th>系统输出或下游动作</th></tr></thead><tbody><tr><td>能源 IoT 采集终端</td><td>仪表离线发现慢，设备数据不统一。</td><td>电表、楼控、储能和充电平台的时间戳、功率、电量、温度、在线状态。</td><td>标准化数据、质量标记和离线事件；异常重试与运维通知。</td></tr><tr><td>AI 负荷预测与能源优化平台</td><td>高峰判断依赖人工，设备缺少协同调度。</td><td>历史和实时负荷、天气预报、工作日、活动、分时电价、设备能力和运行边界。</td><td>未来 30 分钟负荷预测、峰值风险、削峰方案、预期效果及审批任务。</td></tr><tr><td>智能控制网关</td><td>执行与反馈分散，异常缺少保护。</td><td>已通过约束校验及必要审批的策略、设备目标值、有效期和安全约束。</td><td>向非关键空调、储能及充电设施下发调节指令；返回状态，失败时停发、恢复安全策略并通知值班人员。</td></tr></tbody></table></div>\n<p>运行规则表如下。</p>\n<div><table><thead><tr><th>情况</th><th>判断条件</th><th>处理动作</th></tr></thead><tbody><tr><td>能源数据连续缺失</td><td>连续超过 5 分钟仍无数据。</td><td>重试采集并标记异常；重试仍失败则以最近可靠值临时估计，记录原值时间和估计标志，同时通知运维。估计不可伪装为真实采集值。</td></tr><tr><td>预测出现峰值风险</td><td>未来 30 分钟预测负荷达到或超过 1500kW。</td><td>生成削峰建议，进入边界校验及审批；低于 1500kW 则持续监测。</td></tr><tr><td>调度触及运行边界</td><td>预计使办公温度低于 24℃ 或高于 27℃，或涉及关键负荷自动削减。</td><td>拒绝越界方案并重新优化或交人工处理；消防、安防、数据机房等关键负荷不得自动削减。</td></tr><tr><td>控制指令执行失败</td><td>下发后 60 秒内未收到成功反馈，包括明确失败。</td><td>停止继续下发，恢复预先验证的安全策略，通知值班人员；核查设备实际状态，防止盲目重试。</td></tr></tbody></table></div>\n<p>高风险策略在发布前必须由能源管理员确认。所有策略均记录策略版本、审批人或审批依据、设备指令、执行结果及时间；审批尚未通过的高风险策略不得发给网关。流程图包含 8 个主要节点：持续采集 → 数据质量判断 → 负荷预测与峰值判断 → 生成削峰建议 → 运行边界校验 → 能源管理员审批（高风险）→ 网关执行 → 结果留痕与实际负荷复核，复核后回到持续采集。数据缺失处理保留估计标志；边界不满足时修改后重新校验；高风险审批未通过时不执行。</p><h4>规范业务流程图（参考方案）</h4><div class=\"flow-scroll\" tabindex=\"0\" aria-label=\"业务流程图，可横向滚动\"><div class=\"flow-canvas\" style=\"width:760px;height:1220px\"><svg class=\"flow-lines\" viewBox=\"0 0 760 1220\" aria-hidden=\"true\"><defs><marker id=\"arrow-b3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0L10 5L0 10Z\" fill=\"#7296aa\"/></marker></defs><path d=\"M380 95V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M255 190H210\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"232\" y=\"178\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M120 134V110H380V135\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"175\" y=\"102\" text-anchor=\"middle\" class=\"flow-edge-label\">重试／降级校验</text><path d=\"M380 245V295\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"272\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 415V465\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"445\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M520 355H750V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"651\" y=\"343\" text-anchor=\"middle\" class=\"flow-edge-label\">否：记录后持续监测</text><path d=\"M380 555V600\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M520 510H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\"/><text x=\"543\" y=\"495\" text-anchor=\"middle\" class=\"flow-edge-label\">约束</text><path d=\"M240 665H220V510H240\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"174\" y=\"545\" text-anchor=\"middle\" class=\"flow-edge-label\">否：修改后重审</text><path d=\"M380 730V780\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"758\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M380 850V900\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><path d=\"M380 1020V1062\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"395\" y=\"1050\" text-anchor=\"middle\" class=\"flow-edge-label\">是</text><path d=\"M510 960H560\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"535\" y=\"948\" text-anchor=\"middle\" class=\"flow-edge-label\">否</text><path d=\"M650 1015V1120H520\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"637\" y=\"1106\" text-anchor=\"middle\" class=\"flow-edge-label\">处置结果</text><path d=\"M380 1177V1190H15V60H250\" fill=\"none\" stroke=\"#7296aa\" stroke-width=\"1.6\" marker-end=\"url(#arrow-b3)\"/><text x=\"145\" y=\"1180\" text-anchor=\"middle\" class=\"flow-edge-label\">持续监测与反馈闭环</text></svg><div class=\"flow-box flow-process\" style=\"left:250.0px;top:25.0px;width:260px;height:70px\"><div class=\"flow-text\">① IoT终端持续采集<br>电表／楼控／储能／充电数据</div></div><div class=\"flow-box flow-decision\" style=\"left:255.0px;top:135.0px;width:250px;height:110px\"><svg class=\"flow-shape\" viewBox=\"0 0 250 110\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"125.0,1 249,55.0 125.0,109 1,55.0\"/></svg><div class=\"flow-text\">② 数据是否可用？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:134.0px;width:180px;height:112px\"><div class=\"flow-text\">连续缺失 &gt;5分钟：重试<br>仍失败→最近可靠值估计<br>保留估计标志并通知运维<br>降级数据重新校验</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:295.0px;width:280px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,60.0 140.0,119 1,60.0\"/></svg><div class=\"flow-text\">③ AI预测未来30分钟<br>负荷 ≥1500kW？</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:465.0px;width:280px;height:90px\"><div class=\"flow-text\">④ AI平台生成削峰建议<br>运行边界校验</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:460.0px;width:180px;height:100px\"><div class=\"flow-text\">温度24～27℃<br>不得自动削减关键负荷<br>越界→修改／重新优化</div></div><div class=\"flow-box flow-decision\" style=\"left:240.0px;top:600.0px;width:280px;height:130px\"><svg class=\"flow-shape\" viewBox=\"0 0 280 130\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"140.0,1 279,65.0 140.0,129 1,65.0\"/></svg><div class=\"flow-text\">⑤ 边界合规且<br>必要审批已通过？</div></div><div class=\"flow-box flow-annotation\" style=\"left:30.0px;top:613.0px;width:180px;height:104px\"><div class=\"flow-text\">高风险→能源管理员确认<br>未批准不得执行<br>低风险须在授权范围内</div></div><div class=\"flow-box flow-process\" style=\"left:250.0px;top:780.0px;width:260px;height:70px\"><div class=\"flow-text\">⑥ 控制网关执行<br>接收策略、回传设备状态</div></div><div class=\"flow-box flow-decision\" style=\"left:250.0px;top:900.0px;width:260px;height:120px\"><svg class=\"flow-shape\" viewBox=\"0 0 260 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><polygon points=\"130.0,1 259,60.0 130.0,119 1,60.0\"/></svg><div class=\"flow-text\">⑦ 60秒内收到<br>成功反馈？</div></div><div class=\"flow-box flow-annotation\" style=\"left:560.0px;top:905.0px;width:180px;height:110px\"><div class=\"flow-text\">明确失败或超时：<br>停止继续下发<br>恢复安全策略并通知值班<br>核对实际设备状态</div></div><div class=\"flow-box flow-process\" style=\"left:240.0px;top:1062.5px;width:280px;height:115px\"><div class=\"flow-text\">⑧ 留痕与实际负荷复核<br>记录策略、审批、指令与结果<br>反馈至持续采集与模型改进</div></div></div></div><h2>实施与运营设计</h2><p>（1）计算并填写验收指标：最大用电负荷比现状降低 12%；月均电费比现状降低 8%；能源数据完整率达到 99% 以上；峰值风险平均响应时间缩短至 5 分钟以内。（2）制定三阶段实施计划（总周期 8 周）：数据接入与基线建立（第 1～2 周）、策略仿真与小范围试点（第 3～5 周）、推广上线与指标验收（第 6～8 周），写出各阶段关键任务、验收输出和主要责任人。（3）明确人机协作边界，说明智能系统和工作人员的工作边界。（4）制定运行风险控制措施，包括仪表离线或采集数据异常、负荷预测随季节和业态变化失准、控制指令未执行或设备状态异常。</p><div><table><thead><tr><th>指标</th><th>上线前</th><th>建设目标</th><th>验收目标值</th></tr></thead><tbody><tr><td>最大用电负荷</td><td>1680kW</td><td>降低 12%</td><td>不高于 1478.4kW，削减至少 201.6kW。</td></tr><tr><td>月均电费</td><td>125 万元</td><td>降低 8%</td><td>不高于 115 万元，节省至少 10 万元。</td></tr><tr><td>能源数据完整率</td><td>91%</td><td>达到 99% 以上</td><td>不低于 99%，较现状提高至少 8 个百分点。</td></tr><tr><td>峰值风险平均响应时间</td><td>25 分钟</td><td>缩短至 5 分钟以内</td><td>平均不超过 5 分钟，较现状缩短至少 80%。</td></tr></tbody></table></div>\n<p>计算过程：1680×（1－12%）＝1478.4；125×（1－8%）＝115。1500kW 是风险触发阈值，1478.4kW 是最大负荷验收上限，二者用途不同。验收口径：最大负荷按与现状相同的计量时间粒度统计；电费按可比天气、工作日、业态和电价条件核对实际账单。数据完整率＝有效实测数据点数÷应采数据点数，临时估计不算真实完整采集。响应时间从风险事件生成至首次成功调节反馈，未成功事件单列并说明，不能删除失败记录后计算平均值；同时检查温度、关键负荷及安全约束达标情况。</p>\n<div><table><thead><tr><th>阶段与周期</th><th>关键任务</th><th>验收输出</th><th>主要责任人</th></tr></thead><tbody><tr><td>数据接入与基线建立（第 1 至 2 周）</td><td>盘点设备和接口，统一时间与数据字典；建立采集、缺失重试、质量告警及原始基线；确认关键负荷白名单。</td><td>接入清单、数据质量报告、基线报告、运行约束和权限表。</td><td>数据接入负责人主责，运维及能源管理员确认。</td></tr><tr><td>策略仿真与小范围试点（第 3 至 5 周）</td><td>训练预测模型；仿真负荷调节和温度边界；选非关键区域试点，验证审批、60 秒超时保护及回滚。</td><td>预测回测报告、试点报告、边界与故障测试记录、安全策略及操作规程。</td><td>算法负责人和控制工程师主责，能源管理员审批试点。</td></tr><tr><td>推广上线与指标验收（第 6 至 8 周）</td><td>分批推广并监测实际效果，完成培训和应急演练，按统一口径核对负荷、电费、完整率与响应时长。</td><td>上线记录、验收报告、问题关闭清单、值班与运维交接资料。</td><td>项目经理主责，能源管理员和运维负责人共同验收。</td></tr></tbody></table></div>\n<p>8 周内若未覆盖完整账单周期或代表性季节，应保留阶段验收记录，月均电费及季节表现以完整可比周期补充复核，不能将短期节费直接认定为长期收益。人机协作边界：系统负责采集、质量标记、预测、约束校验、建议生成、授权范围内控制与留痕。工作人员负责设备故障排查、运行边界制定、高风险策略审批、异常接管和验收。算法不绕过温度或关键负荷约束，运维人员也不通过删除异常记录制造达标结果。风险控制一是仪表离线或数据异常，按超过 5 分钟重试及临时估计规则处理，并核对同回路数据、记录估计时效；持续异常时降级为保守策略和人工监测，待实测恢复后对账。风险控制二是季节与业态变化导致预测失准，按季节、时段和楼栋监测误差及峰值漏报，达到预设条件后用新数据回测、再训练和灰度发布，同时保留旧模型与人工策略。风险控制三是指令未执行或设备异常，采用指令编号、有效期、幂等和状态回读；60 秒内无成功反馈即停发、恢复安全策略并通知值班。安全策略恢复也要读取设备实际状态，无法确认时人工接管，避免反复下发造成储能或负荷冲击。</p>"
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
        "answerHTML": "<p>培训对象为三级或高级工及以下人员，目标是在人工监督下使用摘要、意图识别、知识推荐和回复草稿功能，能够核对依据、纠正错误并升级不确定问题。以下为建议的 90 分钟安排，题目没有限定培训天数。</p>\n<div><table><thead><tr><th>培训模块</th><th>时间</th><th>培训内容</th><th>教学方法与产出</th></tr></thead><tbody><tr><td>知识培训</td><td>20 分钟</td><td>系统功能、AI 可能生成无依据内容、知识库有效期、隐私和权限，以及人工审核责任。</td><td>讲解与案例辨析；完成知识依据与风险识别小测。</td></tr><tr><td>技术培训</td><td>50 分钟</td><td>人工智能回复核验与纠错：定位推荐知识、核对适用条件、修订错误承诺、处理冲突和不确定结果并留痕。</td><td>教师示范 10 分钟、分组实操 30 分钟、交叉复核 10 分钟；提交修订前后回复及证据。</td></tr><tr><td>考核与反馈</td><td>20 分钟</td><td>独立处理正常、有错误及依据不足三类工单。</td><td>实操评分和反馈；关键风险漏检者补训复测。</td></tr></tbody></table></div>"
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
    "referenceHTML": "<h1>B4 · 智能客服工单辅助系统上岗培训与现场指导方案设计</h1><p>参考解法（整理版），不代表唯一表述或官方评分细则。</p><h4>业务背景</h4>\n<p>你作为人工智能训练师二级人员，需为三级/高级工及以下级别人员开展智能客服工单辅助系统培训。该系统可完成对话摘要、客户意图识别、知识条目推荐和回复草稿生成。请完成以下任务：</p>\n<ol><li>编制一份智能客服工单辅助系统培训计划，分别写出 1 项知识培训内容和 1 项技术培训内容。</li><li>针对技术培训中的“人工智能回复核验与纠错”，写出 1 个最为优先的培训关键点，并制定相应的教学方法。</li><li>简要阐述如何通过培训，使学员掌握知识依据核对、错误回复修订及不确定结果处理，写出培训思路。</li></ol><h2>编制培训计划</h2><p>分别写出 1 项知识培训内容和 1 项技术培训内容，说明培训对象、目标、模块安排、教学方法与产出。</p><p>培训对象为三级或高级工及以下人员，目标是在人工监督下使用摘要、意图识别、知识推荐和回复草稿功能，能够核对依据、纠正错误并升级不确定问题。以下为建议的 90 分钟安排，题目没有限定培训天数。</p>\n<div><table><thead><tr><th>培训模块</th><th>时间</th><th>培训内容</th><th>教学方法与产出</th></tr></thead><tbody><tr><td>知识培训</td><td>20 分钟</td><td>系统功能、AI 可能生成无依据内容、知识库有效期、隐私和权限，以及人工审核责任。</td><td>讲解与案例辨析；完成知识依据与风险识别小测。</td></tr><tr><td>技术培训</td><td>50 分钟</td><td>人工智能回复核验与纠错：定位推荐知识、核对适用条件、修订错误承诺、处理冲突和不确定结果并留痕。</td><td>教师示范 10 分钟、分组实操 30 分钟、交叉复核 10 分钟；提交修订前后回复及证据。</td></tr><tr><td>考核与反馈</td><td>20 分钟</td><td>独立处理正常、有错误及依据不足三类工单。</td><td>实操评分和反馈；关键风险漏检者补训复测。</td></tr></tbody></table></div><h2>优先培训关键点及教学方法</h2><p>针对“人工智能回复核验与纠错”，写出 1 个最为优先的培训关键点，并制定相应的教学方法。</p><p>最优先的关键点是“回复发布前，逐条核对关键结论是否有当前有效、适用该客户情形的知识依据”。尤其核对金额、期限、退款条件和服务承诺，不能因为 AI 回复流畅就直接发送。采用带错误工单的示范与练习：教师展示一份包含过期退款条款或虚构承诺的草稿，示范定位知识条目、核对版本及适用范围、标出证据缺口并修订。学员再完成相似案例，说明每处修改依据；同伴复核，教师针对漏检现场纠正。</p><h2>培训思路与考核</h2><p>简要阐述如何通过培训，使学员掌握知识依据核对、错误回复修订及不确定结果处理，写出培训思路。</p><p>先用正常案例建立“看工单事实—找知识依据—核对关键结论—修订草稿—审核发布—记录反馈”的顺序；再加入过期知识、政策冲突及信息不足案例，训练识别不能下结论的情形。依据不足时先向客户澄清或转主管，不编造答案，也不擅自承诺。建议实操合格标准为关键事实和政策依据核对全部正确、修订后不存在无依据承诺，不确定问题均按流程升级，证据版本与纠错理由记录完整。培训后一周抽检实际工单，检查同类错误是否减少；仍有关键漏检则针对性补训。</p>"
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
