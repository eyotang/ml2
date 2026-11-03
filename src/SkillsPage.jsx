import React, { useEffect, useRef, useState } from "react";
import {
  courses,
  courseState,
  courseValues,
  setCourseValues,
  resetMode,
  resetOriginal,
  normalizeCode,
  choices,
  filledCode,
} from "./model";
import { check as match, coverage } from "./matcher";
import {
  useSavedState,
  useSwipe,
  Rich,
  Dialog,
  StudyTips,
  Template,
  FlowChart,
} from "./shared";
import PythonEditor from "./PythonEditor";
import PythonRunner, { usePythonRuntime } from "./PythonRunner";
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function Solution({ q }) {
  return q.flowchartHTML ? (
    <Rich
      html={q.flowchartHTML.replace(/\{\{(\d+)\}\}/g, (_, i) =>
        esc(q.slots[Number(i)].answer),
      )}
    />
  ) : (
    <pre>{q.solution}</pre>
  );
}
function WebsiteReference({ course, q }) {
  return (
    <details className="solution website-reference">
      <summary>网站参考：原题空白处的完整表达式</summary>
      <p>{course.websiteNote}</p>
      {q.websiteReferences.map((code, i) => (
        <React.Fragment key={i}>
          <h4>写法 {i + 1}</h4>
          <pre>{code}</pre>
        </React.Fragment>
      ))}
      <p>{q.websiteHint || ""}</p>
      <a href={course.websiteURL} target="_blank" rel="noopener noreferrer">
        查看参考来源 ↗
      </a>
    </details>
  );
}
export default function Skills({ courseId }) {
  const course = courses[courseId],
    isCase = course.kind === "case";
  const [p, update] = useSavedState(
    "zhilian-skills-v1",
    () => courseState(courseId),
    courseId,
    () => setFeedback({ storage: true }),
  );
  const [active, setActive] = useState(0),
    [feedback, setFeedback] = useState(null),
    [showSolution, setSolution] = useState(false),
    [finished, setFinished] = useState(false),
    [hint, setHint] = useState(false),
    [lessons, setLessons] = useState(false),
    [history, setHistory] = useState(false),
    [tip, setTip] = useState(null),
    [checked, setChecked] = useState(false),
    [selfSaved, setSelfSaved] = useState(false);
  const editorRef = useRef();
  const runtime = usePythonRuntime({
    courseId,
    editorRef,
    code: p.originalDraft ?? course.originalCode ?? "",
  });
  const q = course.steps[p.index],
    written = isCase || q.kind === "case",
    values = courseValues(p, q),
    original = p.mode === "original",
    passed =
      feedback?.correct ||
      showSolution ||
      (written && feedback?.details?.some((r) => r.status === "review"));
  useEffect(() => {
    document.title = isCase ? "知练 · 技能方案练习" : "知练 · 代码补全";
  }, [isCase]);
  function clear() {
    setActive(0);
    setFeedback(null);
    setSolution(false);
    setFinished(false);
    setHint(false);
    setChecked(false);
    setSelfSaved(false);
  }
  function go(index) {
    if (!course.steps[index]) return;
    update((n) => {
      n.index = index;
    });
    clear();
    window.scrollTo(0, 0);
  }
  function mode(m) {
    update((n) => {
      n.mode = m;
    });
    clear();
  }
  const swipe = useSwipe({
    identity: p.index + ":" + p.mode,
    onNavigate: (d) => go(p.index + d),
    canNavigate: (d) => !!course.steps[p.index + d],
    enabled: !original && !finished,
  });
  function setValue(value, index = active) {
    const next = [...values];
    next[index] = value;
    update((n) => setCourseValues(n, q, next));
    setFeedback(null);
    setHint(false);
    setSolution(false);
    if (p.mode === "pick") {
      const first = next.findIndex((v, i) => i > index && !v);
      if (first >= 0) setActive(first);
    }
  }
  function check() {
    setHint(false);
    if (original) {
      setChecked(true);
      return;
    }
    if (values.some((v) => !v.trim())) {
      setFeedback({ empty: true });
      return;
    }
    const details = q.slots.map((slot, i) =>
        written && p.mode === "type"
          ? match(slot, values[i])
          : {
              status: [slot.answer, ...(slot.accepted || [])].some(
                (a) => normalizeCode(a) === normalizeCode(values[i]),
              )
                ? "covered"
                : "conflict",
            },
      ),
      matches = details.map((d) => d.status === "covered"),
      correct = matches.every(Boolean);
    setFeedback({ correct, matches, details });
    update((n) => {
      const old = n.records[q.id] || {};
      n.records[q.id] = {
        ...old,
        modeAnswers: {
          ...old.modeAnswers,
          [p.mode]: { values: [...values], matches, details },
        },
        attempts: (old.attempts || 0) + 1,
        correct,
        needsReview: details.some((d) => d.status === "review"),
        reviewed: correct || !!old.reviewed || (written && p.mode === "type"),
      };
    });
  }
  function reveal() {
    setSolution(true);
    update((n) => {
      n.records[q.id] = { ...n.records[q.id], reviewed: true };
    });
  }
  function resetCurrent() {
    if (!original && p.mode !== "type") return;
    if (
      !confirm(
        original
          ? "重置本课程的原题填写、自评和运行结果？原题模板会恢复，分步练习记录保留。"
          : "重置当前这一步的关键填空及判定结果？点选补全、其他步骤和原题草稿保留。",
      )
    )
      return;
    update((n) => {
      if (original) resetOriginal(n);
      else resetMode(n, "type", q.id);
    });
    if (original) {
      runtime.reset();
    }
    clear();
    window.scrollTo(0, 0);
  }
  function resetAll() {
    if (
      !confirm(
        `重置本模块「${p.mode === "pick" ? "点选补全" : "关键填空"}」全部 ${course.count} 个步骤的填写和判定记录，从第一步重新练习？其他模式和原题草稿保留。`,
      )
    )
      return;
    update((n) => {
      resetMode(n, p.mode);
      n.index = 0;
    });
    clear();
    window.scrollTo(0, 0);
  }
  function restart() {
    if (
      !confirm(
        "清空本模块练习记录和填写内容，从第一步重新开始？理论知识记录不受影响。",
      )
    )
      return;
    update((n) => {
      n.records = {};
      n.drafts = {};
      n.draftsByMode = { pick: {}, type: {} };
      resetOriginal(n);
      n.index = 0;
    });
    clear();
    runtime.reset();
    setLessons(false);
  }
  function field(i) {
    const status = feedback?.matches
      ? feedback.matches[i]
        ? "correct"
        : feedback.details?.[i]?.status === "review"
          ? "review"
          : "incorrect"
      : "";
    return p.mode === "pick" ? (
      <button
        className={`blank ${active === i ? "active" : ""} ${status}`}
        data-slot={i}
        aria-label={`第 ${i + 1} 空${status ? "，" + { correct: "正确", review: "待自检", incorrect: "错误" }[status] : ""}`}
        onClick={() => setActive(i)}
      >
        {status && (
          <span className="blank-result" aria-hidden="true">
            {{ correct: "✓", review: "?", incorrect: "×" }[status]}
          </span>
        )}
        {values[i] || `空 ${i + 1}`}
      </button>
    ) : (
      <input
        className={`blank code-input ${status}`}
        data-slot={i}
        value={values[i] || ""}
        placeholder={`空 ${i + 1}`}
        aria-label={`第 ${i + 1} 空`}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        onFocus={() => setActive(i)}
        onChange={(e) => setValue(e.target.value, i)}
      />
    );
  }
  const reviewed = Object.values(p.records).filter((r) => r.reviewed).length,
    mastered = Object.values(p.records).filter((r) => r.correct).length;
  return (
    <>
      <header className="skill-top">
        <a
          href={courseId === "c" ? "./#review" : "./#skills"}
          aria-label={courseId === "c" ? "返回综合评审" : "返回技能操作"}
        >
          ‹
        </a>
        <div>
          <small id="course-code">
            {course.category ||
              (courseId === "b12" ? "业务分析 · B1-2" : "智能训练 · B2")}
          </small>
          <strong id="course-name">{course.title.split(" · ")[1]}</strong>
        </div>
        <button id="study-tips-button" onClick={() => setTip(courseId)}>
          答题技巧
        </button>
        <button
          id="lesson-map"
          aria-label="打开练习目录"
          onClick={() => setLessons(true)}
        >
          ▦
        </button>
      </header>
      <main className="skill-main">
        <div className="progress-row">
          <div className="track">
            <i
              id="skill-progress"
              style={{ width: (reviewed / course.count) * 100 + "%" }}
            />
          </div>
          <span id="step-count">
            {original ? "原题" : `${p.index + 1} / ${course.count}`}
          </span>
        </div>
        <div className="mode-row">
          <div className="skill-modes">
            {[
              ["pick", isCase ? "点选要点" : "点选补全"],
              ["type", "关键填空"],
              ["original", isCase || course.tasks ? "原题答题" : "原题补全"],
            ].map(([m, t]) => (
              <button
                key={m}
                data-mode={m}
                className={p.mode === m ? "active" : ""}
                onClick={() => mode(m)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mode-progress">
            <span id="mastered-count">已掌握 {mastered} 步</span>
            <button
              id="reset-all-practice"
              hidden={original}
              onClick={resetAll}
            >
              全部重置
            </button>
          </div>
        </div>
        <nav
          className="step-navigation"
          aria-label="切换练习步骤"
          hidden={original}
        >
          <button
            id="prev-step"
            disabled={p.index === 0}
            onClick={() => go(p.index - 1)}
          >
            ← 上一步
          </button>
          <span id="step-navigation-label">
            第 {p.index + 1} 步 / {course.count} 步
          </span>
          <button
            id="next-step"
            disabled={p.index === course.count - 1}
            onClick={() => go(p.index + 1)}
          >
            下一步 →
          </button>
        </nav>
        <section id="case-material">
          {isCase && (
            <details className="context case-task">
              <summary>查看完整案例背景与运行约束</summary>
              <Rich className="case-rich" html={course.materialHTML} />
            </details>
          )}
        </section>
        <section id="exercise" hidden={finished} {...swipe}>
          {original ? (
            <>
              <span className="task-tag">
                {isCase ? "案例方案 · 独立作答" : "原始模板 · 独立补全"}
              </span>
              <h1>
                {isCase
                  ? "按原题任务组织完整方案"
                  : course.tasks
                    ? course.title.split(" · ")[0] + " · 三项任务独立作答"
                    : "不看选项，再完整写一遍"}
              </h1>
              <p className="task-goal">
                {isCase
                  ? "保留原题要求。流程图已预先画好，可直接在节点内填写；表格及其他内容可在文本区逐项作答。开放方案不按措辞相同与否自动判错。"
                  : "在下方原题模板中补全所有空白。完成后对照参考解法自检；原题允许等价的 Python 写法，本模式不按字符串直接判错。"}
              </p>
              {!isCase && course.tasks && (
                <nav className="original-task-nav" aria-label="原题任务">
                  <a href="#python-runner">
                    {courseId === "b2"
                      ? "任务一、二 · 代码运行"
                      : "任务一 · 代码运行"}
                  </a>
                  {course.tasks.map((t) => (
                    <a href={"#written-" + t.id} key={t.id}>
                      {t.title}
                    </a>
                  ))}
                </nav>
              )}
              <div className="original-tools">
                <span>{isCase ? "逐任务作答" : "原题代码"}</span>
                <button
                  id="open-practice-history"
                  onClick={() => setHistory(true)}
                >
                  ▤ 查看前面练习
                </button>
              </div>
              {!isCase && (
                <>
                  <PythonEditor
                    editorRef={editorRef}
                    value={p.originalDraft ?? course.originalCode}
                    onChange={(v) =>
                      update((n) => {
                        n.originalDraft = v;
                      })
                    }
                  />
                  <PythonRunner runtime={runtime} />
                </>
              )}
              {course.tasks &&
                (isCase ? (
                  <WrittenTasks
                    course={course}
                    p={p}
                    update={update}
                    checked={checked}
                    isCase
                  />
                ) : (
                  <section className="written-tasks">
                    <h2>
                      {courseId === "b2" ? "任务三" : "任务二、任务三"} ·
                      独立作答
                    </h2>
                    <p className="task-goal">
                      结合实际数据逐项作答，内容自动保存；核对参考答案时提供要点辅助检查。
                    </p>
                    <WrittenTasks
                      course={course}
                      p={p}
                      update={update}
                      checked={checked}
                    />
                  </section>
                ))}
            </>
          ) : (
            <>
              <span className="task-tag">
                {String(p.index + 1).padStart(2, "0")} ·{" "}
                {p.mode === "pick"
                  ? written
                    ? "补全答题要点"
                    : "补全代码"
                  : written
                    ? "回忆关键要点"
                    : "回忆关键写法"}
              </span>
              <h1>{q.title}</h1>
              <p className="task-goal">{q.goal}</p>
              {written && (
                <details className="context case-task">
                  <summary>查看本步原题要求</summary>
                  <Rich
                    className="case-rich"
                    html={course.tasks[q.taskIndex].promptHTML}
                  />
                </details>
              )}
              {q.context && (
                <details className="context">
                  <summary>查看已提供的代码</summary>
                  <pre>{q.context}</pre>
                </details>
              )}
              {q.flowchartHTML ? (
                <div className="flow-practice">
                  <FlowChart html={q.flowchartHTML} field={field} />
                </div>
              ) : (
                <div className="code-box">
                  <div className="code-label">
                    {written ? "答题要点" : "PYTHON"}{" "}
                    <small>点击空位可切换或修改</small>
                  </div>
                  <pre
                    className={`code-template ${written ? "case-template" : ""}`}
                  >
                    <Template code={q.code} field={field} />
                  </pre>
                </div>
              )}
              {p.mode === "pick" ? (
                <>
                  <div className="bank-caption">
                    第 {active + 1} 空 ·{" "}
                    {written ? "选择合适的要点" : "选择合适的代码"}
                  </div>
                  <div className="code-bank">
                    {choices(q.slots[active].choices).map((choice) => (
                      <button
                        data-choice={choice}
                        key={choice}
                        onClick={() => setValue(choice)}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="type-note">
                  {written
                    ? "按近义表达与要点进行本地匹配；未识别不等同答错。关键数值和禁止事项仍需准确，请对照参考自检。"
                    : "输入函数、字段或参数即可；引号样式和空格差异不影响检查。"}
                </p>
              )}
            </>
          )}
        </section>
        <section id="feedback" aria-live="polite">
          {!finished &&
            (hint ? (
              <div className="feedback hint">
                <h3>一点提示</h3>
                <p>{q.hint}</p>
              </div>
            ) : original ? (
              checked &&
              !isCase && (
                <>
                  <section className="solution">
                    <h3>完整参考解法</h3>
                    <pre>{course.referenceCode}</pre>
                  </section>
                  {course.websiteCode && (
                    <details className="solution website-reference">
                      <summary>对照指定网站的完整写法</summary>
                      <p>{course.websiteNote}</p>
                      <pre>{course.websiteCode}</pre>
                      <a
                        href={course.websiteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        查看参考来源 ↗
                      </a>
                    </details>
                  )}
                  <div className="feedback hint">
                    <h3>完成自检</h3>
                    <p>
                      核对数据范围、字段、聚合方式、边界条件与模型参数。可下载参考
                      Notebook 在原题数据上运行。
                    </p>
                    <div className="self-check">
                      <button
                        data-self="review"
                        onClick={() => {
                          update((n) => {
                            n.originalSelf = "review";
                          });
                          setSelfSaved(true);
                        }}
                      >
                        需要复习
                      </button>
                      <button
                        data-self="done"
                        onClick={() => {
                          update((n) => {
                            n.originalSelf = "done";
                          });
                          setSelfSaved(true);
                        }}
                      >
                        已独立完成
                      </button>
                    </div>
                    <p id="self-saved">{selfSaved ? "自评已保存" : ""}</p>
                  </div>
                </>
              )
            ) : (
              <>
                {feedback?.storage ? (
                  <p className="warning">
                    浏览器存储不可用，请勿关闭页面，以免丢失进度。
                  </p>
                ) : feedback?.empty ? (
                  <div className="feedback warning">
                    还有空位未填写，先补全再检查。
                  </div>
                ) : (
                  feedback && (
                    <div
                      className={`feedback ${feedback.correct ? "success" : feedback.details?.some((r) => r.status === "review") || feedback.matches.some(Boolean) ? "partial" : "error"}`}
                    >
                      <h3>
                        {feedback.correct
                          ? written
                            ? "✓ 已识别全部要点"
                            : "✓ 补全正确"
                          : written
                            ? "请核对以下要点"
                            : "还有几处需要调整"}
                      </h3>
                      <ul>
                        {q.slots.map((slot, i) => (
                          <li
                            key={i}
                            className={
                              feedback.matches[i]
                                ? "slot-correct"
                                : feedback.details?.[i]?.status === "review"
                                  ? "slot-review"
                                  : "slot-incorrect"
                            }
                          >
                            <strong>
                              {feedback.matches[i]
                                ? "✓"
                                : feedback.details?.[i]?.status === "review"
                                  ? "?"
                                  : "×"}{" "}
                              第 {i + 1} 空
                            </strong>
                            ：
                            {feedback.details?.[i]?.status === "review"
                              ? "未充分识别你的表述，不等同答错。"
                              : ""}
                            {slot.why}
                            {!feedback.matches[i] && (
                              <>
                                <br />
                                <span className="answer-reference">
                                  {written ? "参考表达" : "此处应填"}{" "}
                                  <code>{slot.answer}</code>
                                </span>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                      {!feedback.correct && (
                        <button id="reveal-answer" onClick={reveal}>
                          查看{written ? "本步参考答案" : "完整参考代码"}
                        </button>
                      )}
                    </div>
                  )
                )}
                {(showSolution || feedback?.correct) && (
                  <>
                    <div className="solution">
                      <h3>{written ? "本步参考答案" : "完整参考代码"}</h3>
                      <Solution q={q} />
                      <small>
                        {written
                          ? "可参考不同表述，重点核对业务约束与任务覆盖。"
                          : "可用于对照理解；也可以回到原 Notebook 独立练习。"}
                      </small>
                    </div>
                    {q.websiteReferences && (
                      <WebsiteReference course={course} q={q} />
                    )}
                  </>
                )}
              </>
            ))}
        </section>
        <section id="finish" hidden={!finished}>
          <div className="finish-icon">✓</div>
          <h1>这一轮练习完成</h1>
          <p>
            已掌握 {mastered} / {course.count} 步
          </p>
          <p className="task-goal">
            {isCase
              ? "下一步：进入原题答题，按任务独立组织方案，并核对完整参考答案。"
              : course.tasks
                ? "下一步：进入原题答题，独立完成代码任务与文字任务，再对照参考答案。"
                : "下一步：下载原题 Notebook，不看提示，再独立完成一遍。"}
          </p>
          <a
            className="download-link"
            href={
              course.downloadPath || `materials/${courseId}-reference.ipynb`
            }
            download
          >
            下载{isCase ? "完整参考答案" : "完整参考 Notebook"}
          </a>
          {course.writtenDownloadPath && (
            <a
              className="download-link secondary"
              href={course.writtenDownloadPath}
              download
            >
              下载文字任务参考答案
            </a>
          )}
          <button
            id="practice-again"
            className="download-link secondary"
            onClick={() => go(0)}
          >
            再练一遍
          </button>
          <a
            className="back-link"
            href={courseId === "c" ? "./#review" : "./#skills"}
          >
            {courseId === "c" ? "返回综合评审" : "返回技能操作"} →
          </a>
        </section>
        <div className="reference-note">
          {isCase ? (
            <>
              参考用户提供答案并对照 2026 样卷整理 · 非官方评分细则
              <br />
              要点题支持近义表达匹配，原题按要点辅助自检；不是 AI
              阅卷或官方评分。
            </>
          ) : (
            <>
              按原题模板编排 · 参考解法非官方标准答案
              <br />
              分步练习检查关键填空；原题补全支持真实 Python 运行。
              {course.tasks && (
                <>
                  <br />
                  文字任务：支持近义表达的要点练习与独立作答。
                </>
              )}
            </>
          )}
          {course.sourceURL && (
            <>
              <br />
              <a
                href={course.sourceURL + "#c"}
                target="_blank"
                rel="noopener noreferrer"
              >
                查看老师解析课件 ↗
              </a>
            </>
          )}
        </div>
      </main>
      <footer className="skill-footer">
        <button
          id="hint-button"
          hidden={finished || original}
          onClick={() => setHint(true)}
        >
          提示
        </button>
        <button
          id="reset-practice"
          hidden={p.mode === "pick"}
          onClick={resetCurrent}
        >
          {original ? "重置原题" : "重置本步"}
        </button>
        <button
          id="check-button"
          className="check-button"
          hidden={finished || (!original && passed)}
          onClick={check}
        >
          {original
            ? isCase
              ? "核对要点与参考答案"
              : course.tasks
                ? "核对代码与文字答案"
                : "对照参考解法"
            : "检查答案"}
        </button>
        <button
          id="next-button"
          className="check-button"
          hidden={finished || original || !passed}
          onClick={() => {
            if (p.index < course.count - 1) go(p.index + 1);
            else {
              setFinished(true);
              setHint(false);
              window.scrollTo(0, 0);
            }
          }}
        >
          继续 →
        </button>
      </footer>
      <Dialog
        id="lesson-dialog"
        title="练习目录"
        open={lessons}
        onClose={() => setLessons(false)}
      >
        <div id="lesson-items">
          {course.steps.map((step, i) => {
            const r = p.records[step.id];
            return (
              <button
                key={step.id}
                data-lesson={i}
                className={i === p.index ? "current" : ""}
                onClick={() => {
                  setLessons(false);
                  update((n) => {
                    n.mode = "pick";
                  });
                  go(i);
                }}
              >
                <span>{r?.correct ? "✓" : r?.reviewed ? "◌" : i + 1}</span>
                {step.title}
                <small>
                  {r?.correct
                    ? "已掌握"
                    : r?.needsReview
                      ? "待自检"
                      : r?.reviewed
                        ? "已看答案"
                        : "待练习"}
                </small>
              </button>
            );
          })}
        </div>
        <div className="dialog-links">
          <a
            id="reference-download"
            href={
              course.downloadPath || `materials/${courseId}-reference.ipynb`
            }
            download
          >
            {isCase ? "下载完整参考答案" : "下载参考 Notebook"}
          </a>
          <a
            id="written-reference-download"
            hidden={!course.writtenDownloadPath}
            href={course.writtenDownloadPath}
            download
          >
            下载文字任务参考答案
          </a>
          <a
            id="source-download"
            hidden={isCase}
            href={`materials/${courseId}-original.zip`}
            download
          >
            下载原题与 CSV
          </a>
          <button id="restart-course" onClick={restart}>
            重新练习本模块
          </button>
        </div>
      </Dialog>
      <Dialog
        id="practice-history-dialog"
        title="前面练习"
        open={history}
        onClose={() => setHistory(false)}
      >
        <div id="practice-history-items">
          <p className="history-note">
            可查看分步练习的填写记录，或展开参考解法。关闭后继续原题，草稿不会改变。
          </p>
          {course.steps.map((step, i) => {
            const record = p.records[step.id] || {},
              versions = Object.entries(record.modeAnswers || {}).filter(
                ([m]) => ["pick", "type"].includes(m),
              );
            if (!versions.length && p.drafts[step.id]?.some(Boolean))
              versions.push(["latest", { values: p.drafts[step.id] }]);
            return (
              <section className="history-step" key={step.id}>
                <h3>
                  {i + 1}. {step.title}
                </h3>
                {versions.length ? (
                  versions.map(([m, a]) => (
                    <div className="history-attempt" key={m}>
                      <h4>
                        {m === "pick"
                          ? "点选补全"
                          : m === "type"
                            ? "关键填空"
                            : "最近填写"}
                        <span>
                          {a.matches
                            ? a.matches.every(Boolean)
                              ? "✓ 全部正确"
                              : a.details?.some((r) => r.status === "review")
                                ? "有要点待自检"
                                : "含错误，请对照修正"
                            : "未检查"}
                        </span>
                      </h4>
                      <pre>{filledCode(step, a.values)}</pre>
                    </div>
                  ))
                ) : (
                  <p className="history-note">尚无填写记录</p>
                )}
                <details className="history-solution">
                  <summary>查看本步参考解法</summary>
                  <Solution q={step} />
                  <ul>
                    {step.slots.map((slot, j) => (
                      <li key={j}>
                        第 {j + 1} 空：{slot.why}
                      </li>
                    ))}
                  </ul>
                </details>
              </section>
            );
          })}
        </div>
      </Dialog>
      <StudyTips tip={tip} onClose={() => setTip(null)} />
    </>
  );
}
function WrittenTasks({ course, p, update, checked, isCase = false }) {
  return course.tasks.map((task, i) => {
    const flowValues = p.flowDrafts?.[task.id] || [],
      points = checked
        ? coverage(
            course,
            i,
            (p.caseDrafts?.[task.id] || "") + "\n" + flowValues.join("\n"),
          )
        : [],
      unique = points.filter(
        (v, j) => points.findIndex((x) => x.label === v.label) === j,
      );
    return (
      <section
        className="case-answer-task"
        id={"written-" + task.id}
        key={task.id}
      >
        <h2>
          {isCase ? `${i + 1}. ` : ""}
          {task.title}
        </h2>
        <Rich className="case-rich" html={task.promptHTML} />
        {task.flowchart && (
          <div className="flow-practice">
            <h3>业务流程图 · 节点填空</h3>
            <FlowChart
              html={task.flowchart.html}
              field={(index) => {
                const value = flowValues[index] || "",
                  status =
                    checked && value.trim()
                      ? match(task.flowchart.slots[index], value).status
                      : null;
                return (
                  <input
                    className={`blank ${status === "covered" ? "correct" : status === "conflict" ? "incorrect" : status === "review" ? "review" : ""}`}
                    data-flow-task={task.id}
                    data-flow-slot={index}
                    value={value}
                    placeholder={`空 ${index + 1}`}
                    aria-label={`${task.title}流程图第 ${index + 1} 空`}
                    autoComplete="off"
                    onChange={(e) =>
                      update((n) => {
                        n.flowDrafts ??= {};
                        n.flowDrafts[task.id] ??= [];
                        n.flowDrafts[task.id][index] = e.target.value;
                        delete n.caseSelf?.[task.id];
                      })
                    }
                  />
                );
              }}
            />
          </div>
        )}
        <textarea
          className="case-answer-editor"
          data-task={task.id}
          aria-label={task.title + "的答案"}
          placeholder={
            task.flowchart
              ? "流程图在上方填写；这里填写规则表、路径说明等其余内容…"
              : "按题目要求逐项回答，内容自动保存…"
          }
          value={p.caseDrafts?.[task.id] || ""}
          onChange={(e) =>
            update((n) => {
              n.caseDrafts ??= {};
              n.caseDrafts[task.id] = e.target.value;
              delete n.caseSelf?.[task.id];
            })
          }
        />
        {checked && (
          <details className="case-solution" open>
            <summary>本任务参考答案与核对要点</summary>
            <div id={"coverage-" + task.id}>
              <section className="case-coverage">
                <h3>
                  要点辅助核对 · 已识别{" "}
                  {unique.filter((v) => v.status === "covered").length} /{" "}
                  {unique.length}
                </h3>
                <p>
                  按近义词与关键含义进行本地检查，未识别不代表答错，也不等同正式评分。数值命中仍需核对单位、前提和边界。
                </p>
                <ul>
                  {unique.map((v, j) => (
                    <li
                      key={j}
                      className={
                        v.status === "covered"
                          ? "slot-correct"
                          : v.status === "conflict"
                            ? "slot-incorrect"
                            : "slot-review"
                      }
                    >
                      <strong>
                        {v.status === "covered"
                          ? "✓ 已识别"
                          : v.status === "conflict"
                            ? "× 请修正"
                            : "? 待自检"}
                      </strong>{" "}
                      {v.label}
                      <small>{v.message}</small>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <Rich className="case-rich" html={task.answerHTML} />
            <label className="case-self">
              <input
                type="checkbox"
                data-case-self={task.id}
                checked={!!p.caseSelf?.[task.id]}
                onChange={(e) =>
                  update((n) => {
                    n.caseSelf ??= {};
                    n.caseSelf[task.id] = e.target.checked;
                  })
                }
              />{" "}
              我已逐项核对任务要求与运行约束
            </label>
          </details>
        )}
      </section>
    );
  });
}
