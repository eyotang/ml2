# 知练 · 人工智能训练师备赛

在线演示：[知练刷题工具](https://zhilian-quiz.apps.workbuddy.host/?sharecode=JQCS2SL54V)

采用 **React + Vite**，构建结果为纯静态 HTML、JavaScript、CSS 和素材文件，**不需要后端、数据库或服务器上的 Node.js**。兼容电脑和手机，沿用原版布局、链接、题库及浏览器学习记录。

## 本地开发与构建

需要 Node.js 22.12+（或 20.19+）及 npm，依赖版本固定在 `package-lock.json`：

```sh
npm ci
npm run dev
```

开发地址以命令输出为准，默认 `http://127.0.0.1:5173`。

```sh
npm test
npm run build
node scripts/check-build.mjs
npm run preview
```

`dist/` 已包含构建产物，也可以不安装任何开发依赖，直接预览：

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

## 静态部署

将 **整个 `dist/` 的内容** 上传至静态托管空间，首页为 `index.html`。WorkBuddy 继续发布本项目的 `theory-practice/dist` 目录，复用原应用和演示链接。不要上传 `src/` 代替构建产物，也不需要上传 `node_modules`。

保留 `theory.html?view=...&mode=...`、`skills.html?course=...`、首页 `#theory` / `#skills` / `#review` 等原链接。使用相对资源路径，支持部署在子目录，无需单页应用的路由回退配置。

构建后的 JS/CSS 文件名带内容指纹，题目或代码变化后会使用新文件。还保留旧 HTML 所请求的资源名，由兼容入口启动当前 React 页面，避免旧页面缓存直接报资源缺失。托管平台若允许设置响应头，HTML 和旧名称的兼容入口应每次重新验证缓存，`assets/` 中的指纹文件可长期缓存；HTTP 缓存是否立即更新最终取决于托管平台设置。

## 保留的功能

- 理论：83 道样卷原题，判断 14、单选 56、多选 7、简答 6；答题与背题、300 毫秒答对跳题、收藏、错题、简答草稿和自评、答题卡筛选、稳定的筛选练习队列、左右滑动、重置、答题技巧和法律依据链接。
- 技能与评审：B1-1（8 步）、B1-2（12 步）、B2（19 步）、B3（10 步）、B4（5 步）、C（12 步），共 66 步。点选、关键填空、原题答题、逐空反馈、近义表达辅助匹配、规范流程图节点填空、历史答案查看、目录、前后步骤、提示、自评与参考答案下载。
- B1-2 的任务二、三，B2 的任务三及 C 的三项任务均完整保留。代码注释和老师参考写法不变；开放题允许合理表达，本地未识别会提示自检，不直接判错。
- 点选与关键填空「全部重置」仅清空当前模块、当前模式，保留其他模式和原题草稿；原题重置恢复模板，清除该课程的原题草稿、自评与运行结果；目录内可重置整个课程。
- PC 和手机保留原版配色、布局及手势规则；流程图内横向看图不会切换题目。

完整核对表见 [docs/PARITY.md](docs/PARITY.md)。

## 浏览器内 Python

B1-2、B2 的原题模式可运行全部或选中代码，自动载入 `materials/data/` 的原题 CSV，展示真实表格、图表、文本与 Python 错误。运行全部使用干净变量环境；运行选中代码保留当前变量及正确的报错行号。模块内切换练习模式保留运行环境和结果；停止、重置或离开模块会释放环境。代码修改后提示输出来自上次运行。

Python 在浏览器 Worker 内通过 Pyodide 运行，**无需 Python 后端**。首次需联网从 `https://cdn.jsdelivr.net/pyodide/v314.0.7/full/` 加载运行库，可能需要较长时间。托管平台需允许模块 Worker、WebAssembly 与该 CDN。运行结果不等于自动评分。

React 版本已实际运行老师的 B1-2、B2 代码。B2 精确率 0.661、召回率 0.673、F1 0.667；不同运行库版本可能产生数值差异。

## 记录与题目更新

沿用 `zhilian-v1` 与 `zhilian-skills-v1` 两个浏览器存储键，旧草稿、收藏、错题、模式与自评可直接恢复，保留旧版 B2 填空顺序的迁移逻辑。题目与答题记录独立，重新构建和发布不会主动清空学习记录。

记录仅在当前浏览器、当前域名和端口下保存；换设备、换域名或清理浏览器存储不会自动同步。

## 项目结构

- `src/`：React 页面、组件、状态与匹配逻辑、代码编辑器及运行器。
- `src/styles/`：沿用的响应式样式与流程图样式。
- `content/`：题库、答案、课程与答题技巧的内容源。
- `public/`：原题素材、参考答案、CSV 和 Python Worker。
- `scripts/`：内容生成、构建数据准备及旧 HTML 兼容入口生成。
- `tests/`：React 交互、存储迁移、运行器协议与内容一致性测试。
- `legacy/`：重构前代码和验证脚本的归档，仅用于比对，不作为新版页面控制器。
- `dist/`：完整静态部署产物；构建时生成，勿直接编辑。

重新生成课程内容需要 Python 3，仅使用标准库：

```sh
python3 scripts/build-skill-content.py
python3 scripts/build-case-content.py
npm test
npm run build
```

`npm run dev`、`npm test` 和 `npm run build` 会自动将 `content/` 转为构建数据。题目内容应修改内容源或生成脚本，保持题目 ID 稳定。

老师参考答案及[解析课件](https://ai-trainer-exam-courseware.app.workbuddy.host/?sharecode=U7DGZ5NTK5)为学习参考，非官方评分细则。主观方案以业务约束、任务覆盖和合理性为重点。
