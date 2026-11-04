import AnswerNote, { theoryNotes } from "./AnswerNote";
import { ThemeSync } from "./ThemeControl";
import React, { useEffect, useRef, useState } from "react";
import {
  questions,
  TYPES,
  theoryState,
  questionList,
  sameAnswers,
  questionRevision,
} from "./model";
import { useSavedState, useSwipe, StudyTips } from "./shared";
export default function Theory() {
  const [s, update, externalVersion] = useSavedState(
    "zhilian-v1",
    () => theoryState(location.search),
    null,
    () => toast("浏览器无法保存记录，请检查存储设置"),
  );
  const [selection, setSelection] = useState(() =>
      s.records[s.current]?.stale ? [] : s.records[s.current]?.selected || [],
    ),
    [revealed, setRevealed] = useState(
      () => !!s.records[s.current] && !s.records[s.current].stale,
    ),
    [map, setMap] = useState(false),
    [menu, setMenu] = useState(false),
    [tip, setTip] = useState(null),
    [message, setMessage] = useState("");
  const timer = useRef(),
    toastTimer = useRef(),
    latest = useRef(s);
  latest.current = s;
  const clear = () => clearTimeout(timer.current);
  function toast(text) {
    setMessage(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setMessage(""), 2200);
  }
  useEffect(
    () => () => {
      clear();
      clearTimeout(toastTimer.current);
    },
    [],
  );
  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", menu);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [menu]);
  useEffect(() => {
    const escape = (e) => {
      if (e.key === "Escape") setMap(false);
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);
  const qs = questionList(s),
    q = questions[s.current],
    empty = !qs.length,
    pos = qs.findIndex((x) => x.id === q.id),
    record = s.records[q.id],
    show = s.mode === "study" || revealed;
  useEffect(() => {
    const record = s.records[s.current];
    setSelection(record?.stale ? [] : record?.selected || []);
    setRevealed(!!record && !record.stale);
    clear();
  }, [externalVersion]);
  function jump(id) {
    clear();
    setSelection(s.records[id]?.stale ? [] : s.records[id]?.selected || []);
    setRevealed(!!s.records[id] && !s.records[id].stale);
    update((n) => {
      n.current = id;
    });
    if (matchMedia("(max-width:680px)").matches) window.scrollTo(0, 0);
  }
  function navigate(d) {
    if (qs[pos + d]) jump(qs[pos + d].id);
    else if (d > 0) toast("已到最后一题，做得不错！");
  }
  const { ref: questionCardRef, ...swipe } = useSwipe({
    identity: s.current,
    onNavigate: navigate,
    canNavigate: (d) => !!qs[pos + d],
    enabled: !empty && !map && !menu && !tip,
    ignoreSelector:
      ".toolbar,.type-tabs,.mobile-nav,.question-actions,.right-panel,a,button:not([data-option])",
    onDrag: clear,
    kind: "theory",
  });
  function view(v) {
    clear();
    setMenu(false);
    const next = { ...s, view: v, filter: "all", filterIds: null };
    const list = questionList(next);
    const id = list.some((x) => x.id === s.current)
      ? s.current
      : (list[0]?.id ?? s.current);
    update((n) => {
      n.view = next.view;
      n.filter = next.filter;
      n.filterIds = next.filterIds;
      n.current = id;
    });
    setSelection(s.records[id]?.stale ? [] : s.records[id]?.selected || []);
    setRevealed(!!s.records[id] && !s.records[id].stale);
  }
  function filter(f) {
    clear();
    const ids =
      f === "all"
        ? null
        : questions
            .filter((x) =>
              f === "unanswered"
                ? !s.records[x.id] || s.records[x.id].stale
                : s.records[x.id]?.correct === false,
            )
            .map((x) => x.id);
    const next = { ...s, view: "all", filter: f, filterIds: ids };
    const list = questionList(next),
      id = list.some((x) => x.id === s.current)
        ? s.current
        : (list[0]?.id ?? 0);
    update((n) => {
      n.view = next.view;
      n.filter = next.filter;
      n.filterIds = next.filterIds;
      n.current = id;
    });
    setSelection(s.records[id]?.stale ? [] : s.records[id]?.selected || []);
    setRevealed(!!s.records[id] && !s.records[id].stale);
    document.getElementById("answer-map")?.scrollTo?.(0, 0);
  }
  function mode(m) {
    clear();
    update((n) => {
      n.mode = m;
    });
    if (m === "answer") {
      setSelection(record?.stale ? [] : record?.selected || []);
      setRevealed(!!record && !record.stale);
    }
  }
  function submit(values = selection) {
    if (q.type === 3) {
      setRevealed(true);
      return;
    }
    if (!values.length) return;
    if (!q.answer) {
      toast("题目数据异常，请刷新后重试");
      return;
    }
    clear();
    const correct = sameAnswers(values, q.answer);
    setSelection(values);
    setRevealed(true);
    update((n) => {
      n.records[q.id] = {
        selected: values,
        correct,
        questionRevision: questionRevision(q),
      };
      if (correct && n.view === "wrong") {
        const list = questionList(n);
        n.current = list[0]?.id ?? q.id;
      }
    });
    if (correct && s.view === "wrong") {
      const next = qs.filter((x) => x.id !== q.id)[0];
      setSelection(next ? s.records[next.id]?.selected || [] : []);
      setRevealed(!!(next && s.records[next.id]));
      toast("回答正确，已移出错题");
      return;
    }
    if (correct && s.auto) {
      const id = q.id;
      timer.current = setTimeout(() => {
        if (latest.current.current === id && latest.current.mode === "answer") {
          const list = questionList(latest.current),
            i = list.findIndex((x) => x.id === id);
          if (list[i + 1]) jump(list[i + 1].id);
          else toast("已到最后一题，做得不错！");
        }
      }, 300);
    }
  }
  function choose(i) {
    if (show) return;
    if (q.type === 2)
      setSelection(
        selection.includes(i)
          ? selection.filter((x) => x !== i)
          : [...selection, i],
      );
    else submit([i]);
  }
  function favorite() {
    const favorites = s.favorites.includes(q.id)
      ? s.favorites.filter((x) => x !== q.id)
      : [...s.favorites, q.id];
    let id = q.id;
    if (s.view === "favorites" && !favorites.includes(id))
      id = qs.find((x) => x.id !== q.id)?.id ?? id;
    update((n) => {
      n.favorites = n.favorites.includes(q.id)
        ? n.favorites.filter((x) => x !== q.id)
        : [...n.favorites, q.id];
      n.current = id;
    });
    if (id !== q.id) {
      clear();
      setSelection(s.records[id]?.stale ? [] : s.records[id]?.selected || []);
      setRevealed(!!s.records[id] && !s.records[id].stale);
    }
  }
  function reset() {
    if (
      !confirm(
        "确定重置全部答题记录？答题结果、错题、简答草稿和自评将清空，从第一题重新开始。收藏会保留。",
      )
    )
      return;
    clear();
    update((n) =>
      Object.assign(n, {
        records: {},
        drafts: {},
        view: "all",
        filter: "all",
        filterIds: null,
        mode: "answer",
        current: 0,
      }),
    );
    setSelection([]);
    setRevealed(false);
    setMenu(false);
    toast("答题记录已清空，可以重新开始");
  }
  const records = Object.values(s.records).filter((r) => !r.stale),
    graded = records.filter((r) => typeof r.correct === "boolean"),
    correct = graded.filter((r) => r.correct).length,
    wrong = graded.length - correct,
    saved = s.favorites.includes(q.id),
    viewName = { all: "顺序练习", wrong: "错题复习", favorites: "我的收藏" }[
      s.view
    ];
  const viewButtons = (mobile) =>
    [
      ["all", "▤", "顺序练习", questions.length],
      ["wrong", "↺", "错题复习", wrong],
      ["favorites", "☆", "我的收藏", s.favorites.length],
    ].map(([v, icon, title, n]) => (
      <button
        key={v}
        className={`${mobile ? "" : "nav-item "}${s.view === v ? "active" : ""}`}
        {...{ [mobile ? "data-mobile-view" : "data-view"]: v }}
        onClick={() => view(v)}
      >
        {!mobile && <span>{icon}</span>}
        {title}
        {!mobile && <b>{n}</b>}
      </button>
    ));
  const labels = (values) =>
    values
      .map((i) => (q.type === 0 ? q.options[i] : String.fromCharCode(65 + i)))
      .join("、");
  return (
    <>
      <ThemeSync />
      <header className="header">
        <a className="brand" href="./">
          <span className="brand-icon">知</span>
          <strong>
            知练<span>人工智能训练师 · 理论题库</span>
          </strong>
        </a>
        <div className="header-meta">
          <span className="live-dot" />
          学习记录自动保存 <span className="edition">2026 上海专项赛</span>
        </div>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <a className="home-link" href="./">
            ← 返回模块首页
          </a>
          <div className="side-label">我的学习</div>
          <nav id="nav">{viewButtons(false)}</nav>
          <div className="side-course">
            <span className="course-icon">AI</span>
            <strong>每天一点，稳步掌握。</strong>
            <p>从理解一道题开始。</p>
            <div className="course-line" />
            <small>
              2026 年上海市专项职业技能大赛
              <br />
              人工智能训练师项目
            </small>
          </div>
          <div className="side-bottom">
            初版体验 <span>V 0.1</span>
          </div>
        </aside>
        <main id="theory-practice-surface" {...swipe}>
          <div className="breadcrumb">
            理论知识 <span>/</span> <span id="crumb">{viewName}</span>
          </div>
          <div className="page-heading">
            <div>
              <div className="eyebrow">LEARN AT YOUR OWN PACE</div>
              <h1 id="title">
                {s.view === "all"
                  ? "每一道题，都更进一步。"
                  : s.view === "wrong"
                    ? "把薄弱点，练成得分点。"
                    : "值得记住的，再看一遍。"}
              </h1>
              <p id="subtitle">
                {s.view === "all"
                  ? "按样卷顺序练习，让知识慢慢变成底气。"
                  : s.view === "wrong"
                    ? "重做答对后移出错题，参考解析会帮助你理解。"
                    : "收藏那些需要多想一步的知识。"}
              </p>
            </div>
            <span className="book-mark">
              学<br />而<br />有<br />得
            </span>
          </div>
          <nav className="mobile-nav">
            <a className="home-link" href="./">
              ⌂ 首页
            </a>
            {viewButtons(true)}
          </nav>
          <div className="workspace">
            <section className="practice">
              <div className="toolbar">
                <button
                  className="mobile-menu-toggle"
                  id="mobile-menu-toggle"
                  aria-label="打开题库菜单"
                  aria-expanded={menu}
                  onClick={() => setMenu(!menu)}
                >
                  ‹
                </button>
                <div className="mode-switch">
                  <button
                    id="answer-mode"
                    className={s.mode === "answer" ? "active" : ""}
                    onClick={() => mode("answer")}
                  >
                    答题模式
                  </button>
                  <button
                    id="study-mode"
                    className={s.mode === "study" ? "active" : ""}
                    onClick={() => mode("study")}
                  >
                    背题模式
                  </button>
                </div>
                <button
                  id="theory-study-tips"
                  className="theory-study-tips"
                  onClick={() => setTip(q.type === 3 ? "a" + q.num : "theory")}
                >
                  答题技巧
                </button>
                <label className="auto-label">
                  <input
                    id="auto"
                    type="checkbox"
                    checked={s.auto}
                    disabled={s.mode === "study"}
                    onChange={(e) => {
                      clear();
                      update((n) => {
                        n.auto = e.target.checked;
                      });
                    }}
                  />
                  答对自动下一题
                </label>
              </div>
              <div id="type-tabs" className="type-tabs">
                {TYPES.map((t, i) => (
                  <button
                    key={t}
                    data-type={i}
                    className={!empty && q.type === i ? "active" : ""}
                    disabled={!qs.some((x) => x.type === i)}
                    onClick={() => {
                      jump(qs.find((x) => x.type === i).id);
                      setMenu(false);
                    }}
                  >
                    {t}
                    <small>{qs.filter((x) => x.type === i).length}</small>
                  </button>
                ))}
              </div>
              <article
                className="question-card"
                id="question-card"
                ref={questionCardRef}
              >
                {empty ? (
                  <div className="empty">
                    <strong>
                      {s.filter === "unanswered"
                        ? "全部题目已完成"
                        : s.filter === "wrong" || s.view === "wrong"
                          ? "暂时没有错题"
                          : "还没有收藏题目"}
                    </strong>
                    {s.filter === "unanswered"
                      ? "可以切换全部重新练习。"
                      : s.filter === "wrong" || s.view === "wrong"
                        ? "答错的题会自动收录在这里。"
                        : "点击题目下方的 ☆ 即可加入收藏。"}
                    <br />
                    <button className="submit" onClick={() => view("all")}>
                      开始顺序练习
                    </button>
                  </div>
                ) : (
                  <>
                    {record?.stale && (
                      <p className="record-updated" role="status">
                        本题已更新，请重新作答。
                      </p>
                    )}
                    <div className="q-meta">
                      <span className="type-badge">
                        {TYPES[q.type]}
                        {q.type === 2 ? " · 多项选择" : ""}
                      </span>
                      <span>
                        第 {q.num} 题 /{" "}
                        {questions.filter((x) => x.type === q.type).length} 题
                      </span>
                    </div>
                    <h2 className="q-text">
                      <span className="mobile-type-badge">{TYPES[q.type]}</span>
                      {q.text}
                    </h2>
                    {q.type === 3 ? (
                      <>
                        {s.mode === "answer" && (
                          <textarea
                            id="short-answer"
                            aria-label="简答题答案"
                            placeholder="试着按要点组织答案，内容会自动保存…"
                            value={s.drafts[q.id] || ""}
                            onChange={(e) =>
                              update((n) => {
                                n.drafts[q.id] = e.target.value;
                              })
                            }
                          />
                        )}
                        <button
                          hidden={show}
                          className="submit"
                          id="submit"
                          onClick={() => submit()}
                        >
                          提交并对照要点
                        </button>
                        {show && (
                          <section className="result">
                            <AnswerNote note={theoryNotes[q.id]} />
                            <h3>参考答题框架</h3>
                            <p className="answer-label">
                              {q.points
                                .map((p) => p.split("：")[0])
                                .join(" → ")}
                            </p>
                            <div className="analysis-label">
                              参考要点 · 非官方评分标准
                            </div>
                            <ol className="points">
                              {q.points.map((p) => (
                                <li key={p}>{p}</li>
                              ))}
                            </ol>
                            {s.mode === "answer" && (
                              <>
                                <h3>对照要点，评估掌握程度</h3>
                                <div className="self-actions">
                                  {["需复习", "部分掌握", "已掌握"].map(
                                    (level) => (
                                      <button
                                        key={level}
                                        className={
                                          record?.self === level
                                            ? "selected"
                                            : ""
                                        }
                                        onClick={() =>
                                          update((n) => {
                                            n.records[q.id] = {
                                              self: level,
                                              questionRevision:
                                                questionRevision(q),
                                            };
                                          })
                                        }
                                      >
                                        {level}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </>
                            )}
                          </section>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="options">
                          {q.options.map((o, i) => {
                            const right = show && q.answer?.includes(i),
                              wrongOption =
                                show &&
                                selection.includes(i) &&
                                q.answer &&
                                !q.answer.includes(i);
                            return (
                              <button
                                key={i}
                                className={`option ${right ? "correct" : wrongOption ? "wrong" : selection.includes(i) ? "selected" : ""}`}
                                data-option={i}
                                disabled={show}
                                aria-pressed={selection.includes(i)}
                                onClick={() => choose(i)}
                              >
                                <span className="letter">
                                  {q.type === 0
                                    ? i === 0
                                      ? "✓"
                                      : "×"
                                    : String.fromCharCode(65 + i)}
                                </span>
                                <span>{o}</span>
                                {right && (
                                  <span className="result-tag">正确答案</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {q.type === 2 && !show && (
                          <button
                            className="submit"
                            id="submit"
                            disabled={!selection.length}
                            onClick={() => submit()}
                          >
                            确认答案
                            {selection.length
                              ? `（已选 ${selection.length} 项）`
                              : ""}
                          </button>
                        )}
                        {show && (
                          <section
                            className={`result ${s.mode === "answer" && !sameAnswers(selection, q.answer || []) ? "error" : ""}`}
                            role="status"
                          >
                            <h3>
                              {s.mode === "study"
                                ? "先理解，再记忆"
                                : sameAnswers(selection, q.answer || [])
                                  ? "✓ 回答正确，继续保持"
                                  : "再想一想，这道题值得复习"}
                            </h3>
                            <p className="answer-label">
                              正确答案：
                              <strong>{labels(q.answer || [])}</strong>
                              {s.mode === "answer"
                                ? "　你的答案：" + labels(selection)
                                : ""}
                            </p>
                            <div className="analysis-label">题目解析</div>
                            <p>{q.explanation}</p>
                            {q.source && (
                              <p className="law-source">
                                依据：
                                <a
                                  href={q.source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {q.source.title}
                                </a>
                              </p>
                            )}
                            {q.type === 2 && s.mode === "answer" && (
                              <p>
                                漏选：
                                {labels(
                                  q.answer.filter(
                                    (i) => !selection.includes(i),
                                  ),
                                ) || "无"}
                                　错选：
                                {labels(
                                  selection.filter(
                                    (i) => !q.answer.includes(i),
                                  ),
                                ) || "无"}
                              </p>
                            )}
                          </section>
                        )}
                      </>
                    )}
                    {s.mode === "answer" && revealed && record && (
                      <button
                        className="submit"
                        id="retry"
                        onClick={() => {
                          clear();
                          setRevealed(false);
                          setSelection([]);
                        }}
                      >
                        重新作答
                      </button>
                    )}
                  </>
                )}
              </article>
              <div className="question-actions">
                <button
                  id="prev"
                  className="secondary"
                  disabled={empty || pos <= 0}
                  onClick={() => navigate(-1)}
                >
                  ← 上一题
                </button>
                <button
                  id="favorite"
                  className={`favorite ${saved ? "saved" : ""}`}
                  disabled={empty}
                  onClick={favorite}
                >
                  {saved ? "★ 已收藏" : "☆ 收藏本题"}
                </button>
                <button
                  id="next"
                  className="primary"
                  disabled={empty || pos >= qs.length - 1}
                  onClick={() => navigate(1)}
                >
                  下一题 →
                </button>
              </div>
              <div className="swipe-hint">← 左滑下一题 · 右滑上一题 →</div>
              <div className="source-note">
                题目来自 2026 项目样卷 · 参考答案与解析为初版整理，非官方答案。
              </div>
            </section>
            <aside className="right-panel">
              <section className="progress-card">
                <div className="panel-heading">
                  <h2>学习进度</h2>
                  <span>持续积累</span>
                </div>
                <div className="progress-numbers">
                  <strong id="done-count">
                    {records.length}
                    <small>/ {questions.length}</small>
                  </strong>
                  <span>已作答</span>
                </div>
                <div className="progress-track">
                  <i
                    id="progress-bar"
                    style={{
                      width: (records.length / questions.length) * 100 + "%",
                    }}
                  />
                </div>
                <div className="stats">
                  <div>
                    <b id="correct-count">{correct}</b>
                    <span>答对</span>
                  </div>
                  <div>
                    <b id="wrong-count">{wrong}</b>
                    <span>待复习错题</span>
                  </div>
                  <div>
                    <b id="rate">
                      {graded.length
                        ? Math.round((correct / graded.length) * 100) + "%"
                        : "—"}
                    </b>
                    <span>客观题正确率</span>
                  </div>
                </div>
              </section>
              <section
                className={`map-panel ${map ? "open" : ""}`}
                id="map-panel"
              >
                <div className="map-header">
                  <div className="panel-heading">
                    <h2>答题卡</h2>
                    <button
                      id="reset-all"
                      className="reset-all"
                      onClick={reset}
                    >
                      重置全部
                    </button>
                    <button
                      id="close-map"
                      aria-label="关闭答题卡"
                      onClick={() => setMap(false)}
                    >
                      ×
                    </button>
                    <span id="map-count">{qs.length} 题</span>
                  </div>
                  <div
                    className="map-filters"
                    role="group"
                    aria-label="筛选练习题目"
                  >
                    {[
                      ["all", "全部"],
                      ["unanswered", "未答"],
                      ["wrong", "错题"],
                    ].map(([f, t]) => (
                      <button
                        key={f}
                        data-filter={f}
                        className={s.filter === f ? "active" : ""}
                        aria-pressed={s.filter === f}
                        onClick={() => filter(f)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="legend">
                    {[
                      ["green", "正确"],
                      ["red", "错误"],
                      ["gray", "未答"],
                      ["blue", "自评"],
                    ].map(([c, t]) => (
                      <span key={c}>
                        <i className={"dot " + c} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div id="answer-map">
                  {empty ? (
                    <p className="map-empty">当前筛选没有题目</p>
                  ) : (
                    TYPES.map((t, i) => {
                      const group = qs.filter((x) => x.type === i);
                      return group.length ? (
                        <div className="map-group" key={t}>
                          <h3>
                            {t} · {group.length} 题
                          </h3>
                          <div className="map-grid">
                            {group.map((x) => {
                              const r = s.records[x.id];
                              return (
                                <button
                                  key={x.id}
                                  data-jump={x.id}
                                  className={`${r?.correct === true ? "correct" : r?.correct === false ? "wrong" : r?.self ? "self" : ""} ${x.id === q.id ? "current" : ""} ${s.favorites.includes(x.id) ? "star" : ""}`}
                                  aria-label={`${t}第${x.num}题${r?.correct === true ? "，正确" : r?.correct === false ? "，错误" : ""}`}
                                  aria-current={
                                    x.id === q.id ? "true" : undefined
                                  }
                                  onClick={() => {
                                    jump(x.id);
                                    setMap(false);
                                  }}
                                >
                                  {x.num}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null;
                    })
                  )}
                </div>
              </section>
              <div className="tip">
                <span>✧</span>
                <p>
                  <strong>理解，比记住答案更重要。</strong>
                  <br />
                  切换背题模式，先梳理知识，再检验自己。
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
      <footer className="mobile-bottom">
        <button
          id="mobile-favorite"
          className={`mobile-favorite ${saved ? "saved" : ""}`}
          disabled={empty}
          onClick={favorite}
        >
          {saved ? "★ 已收藏" : "☆ 收藏"}
        </button>
        <div className="mobile-score">
          <span className="mobile-correct">
            ✓ <b id="mobile-correct-count">{correct}</b>
          </span>
          <span className="mobile-wrong">
            × <b id="mobile-wrong-count">{wrong}</b>
          </span>
        </div>
        <button
          className="mobile-map"
          id="open-map"
          aria-label="打开答题卡"
          onClick={() => setMap(true)}
        >
          <span className="grid-icon">▦</span>
          <span id="mobile-position">
            {empty ? "0 / 0" : `${pos + 1} / ${qs.length}`}
          </span>
        </button>
      </footer>
      <div
        id="scrim"
        className={map ? "open" : ""}
        onClick={() => setMap(false)}
      />
      <div
        className={`toast ${message ? "visible" : ""}`}
        id="toast"
        role="status"
      >
        {message}
      </div>
      <StudyTips tip={tip} onClose={() => setTip(null)} />
    </>
  );
}
