# 知练 · 人工智能训练师备赛

在线演示：[知练刷题工具](https://zhilian-quiz.apps.workbuddy.host/?sharecode=JQCS2SL54V)

本地初版，无需安装依赖。启动：

```sh
python3 -m http.server 8765 --directory dist
```

浏览器访问 http://localhost:8765 。手机和电脑在同一局域网时，手机使用电脑的局域网 IP 和 8765 端口访问。

含 83 道样卷原题，顺序为判断 14、单选 56、多选 7、简答 6。支持答题／背题、答题卡、收藏、错题重做、简答草稿与自评。记录保存在当前浏览器，跨设备不自动同步。

答案和解析为整理参考，非官方答案。判断第 9 题、单选第 11 和 14 题已根据政府网站法律条文核验，解析附依据链接，全部客观题均可判分。简答题仅供要点对照，不自动评分。多选按答案集合完全一致判定。

验证：`node check.cjs`。已检查桌面展示、390px 手机布局、错题重做、多选判定、简答自评、刷新恢复和手机答题卡。

## 浏览器内 Python 运行

B1-2、B2 的「原题补全」可运行全部或选中代码，自动载入 `dist/materials/data/` 的原题 CSV。Python 在模块 Worker 中通过 Pyodide 运行；停止或重置会释放 Worker，不清除答题草稿。表格展示真实计算结果，错误展示 Python traceback；运行结果不等于自动评分。

首次运行需从 `https://cdn.jsdelivr.net/pyodide/v314.0.7/full/` 加载运行环境与依赖。部署时上传 `dist/` 全部文件，并确保站点允许模块 Worker、WebAssembly 和该 CDN 的运行库访问；无需 Python 后端。WorkBuddy 的实际托管权限需部署后验证。不要仅上传 HTML。

额外验证：`node check-runner.cjs`。本地浏览器已实际运行老师的 B1-2 与 B2 完整代码；B2 精确率 0.661、召回率 0.673、F1 0.667（当前固定运行库与素材）。不同库版本可能有数值差异。


## 项目结构

- `dist/`：可直接部署的完整静态网站；默认首页为 `index.html`。
- `scripts/`：内容生成脚本及参考答案数据。原题模板从 `dist/materials/` 内的素材压缩包读取，无需本机其他目录。
- `check*.cjs`：使用 Node.js 内置断言的验证脚本，不需安装 npm 依赖。

技能操作包含业务分析 B1-1、B1-2，智能训练 B2，智能系统设计 B3，培训与指导 B4。综合评审当前保留导航入口，课程内容尚未接入。

理论题和技能练习顶部提供「答题技巧」，按当前模块或简答题展示答题框架、展开方法和自检要点，参考[老师解析课件](https://ai-trainer-exam-courseware.app.workbuddy.host/?sharecode=U7DGZ5NTK5)整理。老师参考代码保持原样，计算结论以实际运行输出为准。

## 重新生成内容

在项目根目录运行（Python 3，仅标准库）：

```sh
python3 scripts/build-skill-content.py
python3 scripts/build-case-content.py
```

## 验证

使用 Node.js 运行：

```sh
node check.cjs
node check-skills.cjs
node check-cases.cjs
node check-filter.cjs
node check-swipe.cjs
node check-editor.cjs
node check-runner.cjs
node check-reset.cjs
node check-matching.cjs
node check-study-tips.cjs
node check-flowcharts.cjs
```

部署目录选择 `dist`。全部练习记录保存在访问者当前浏览器中，更新代码不会主动清空记录；更换设备、域名或清除浏览器存储不会自动同步。

## 流程图题设计

凡要求绘制流程图的任务，提供预绘图形并在节点内点选或填写，参考解法使用同一图形。矩形表示处理，菱形表示判断，箭头注明方向和条件；保留异常分支、人机职责和反馈回路。当前覆盖 B1-1 业务流程与 B3 多产品协同流程（8 个主要节点）。原题图内填写独立保存、支持近义表达检查和重置，保留已有文字草稿。手机在图内横向看图，在图外左右切换练习。后续接入综合评审等流程图任务时沿用这一方式；老师答案作为参考，合理方案不以措辞是否一致判错。

点选补全和关键填空的「全部重置」会清除当前模块、当前模式下所有步骤的填写及判定记录，并回到第一步；其他模式、原题草稿和其他模块保留。
