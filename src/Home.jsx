import React, { useEffect, useState } from "react";
import { readStore } from "./model";
import ThemeControl from "./ThemeControl";
const groups = [
  [
    "业务分析",
    "25 分",
    [
      ["b11", "B1-1", "业务框架与流程设计", "产品外观智能质检", "15 分"],
      ["b12", "B1-2", "业务场景挖掘", "共享会议室预约与空间利用", "10 分"],
    ],
  ],
  [
    "智能训练",
    "30 分",
    [["b2", "B2", "算法测试与数据分析", "冷链运输温控异常预警", "30 分"]],
  ],
  [
    "智能系统设计",
    "40 分",
    [["b3", "B3", "智能系统方案设计", "智慧园区能源预测与智能调度", "40 分"]],
  ],
  [
    "培训与指导",
    "5 分",
    [["b4", "B4", "培训与现场指导", "智能客服工单辅助系统上岗培训", "5 分"]],
  ],
];
export default function Home() {
  const [module, setModule] = useState(
      () => location.hash.slice(1) || "theory",
    ),
    [s, setS] = useState(() => readStore("zhilian-v1"));
  useEffect(() => {
    const hash = () => setModule(location.hash.slice(1) || "theory"),
      refresh = () => setS(readStore("zhilian-v1"));
    window.addEventListener("hashchange", hash);
    window.addEventListener("storage", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      window.removeEventListener("hashchange", hash);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, []);
  const selected = ["theory", "skills", "review"].includes(module)
      ? module
      : "theory",
    records = Object.values(s.records || {}),
    graded = records.filter((r) => typeof r.correct === "boolean"),
    correct = graded.filter((r) => r.correct).length,
    wrong = graded.length - correct,
    rate = graded.length
      ? Math.round((correct / graded.length) * 100) + "%"
      : "—";
  return (
    <>
      <header className="top">
        <a href="./" className="logo">
          <span>知</span>知练
        </a>
        <div className="home-settings">
          <span className="top-meta">2026 上海专项赛</span>
          <ThemeControl />
        </div>
      </header>
      <main className="home">
        <div className="intro">
          <span className="course-tag">人工智能训练师</span>
          <h1>选一个模块，开始练习。</h1>
          <p>理论、实操、评审，按你的节奏备赛。</p>
        </div>
        <nav className="modules" aria-label="学习模块">
          {[
            ["theory", "理论知识"],
            ["skills", "技能操作"],
            ["review", "综合评审"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={"#" + id}
              data-module={id}
              className={selected === id ? "active" : ""}
              aria-current={selected === id ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <section
          id="theory"
          className="module-panel"
          aria-label="理论知识"
          hidden={selected !== "theory"}
        >
          <div className="module-caption">
            <span>模块 A · 理论知识</span>
            <span>83 道样卷原题</span>
          </div>
          <div className="practice-hub">
            <a className="shortcut" href="theory.html?view=all&mode=study">
              <span className="shortcut-icon blue">▤</span>
              <strong>背题模式</strong>
              <small>先理解，再记忆</small>
            </a>
            <a
              className="practice-circle"
              href="theory.html?view=all&mode=answer"
              style={{ "--progress": (records.length / 83) * 100 + "%" }}
            >
              <span className="circle-inner">
                <strong>顺序练习</strong>
                <span id="home-progress">{records.length} / 83</span>
                <small>继续学习 →</small>
              </span>
            </a>
            <a className="shortcut" href="theory.html?view=wrong&mode=answer">
              <span className="shortcut-icon coral">↺</span>
              <strong>错题复习</strong>
              <small id="home-wrong">{wrong} 道待复习</small>
            </a>
          </div>
          <div className="quick-row">
            <a href="theory.html?view=favorites&mode=answer">
              <span>☆</span>
              <div>
                <strong>我的收藏</strong>
                <small id="home-favorites">
                  已收藏 {(s.favorites || []).length} 道题
                </small>
              </div>
              <b>›</b>
            </a>
            <a href="theory.html?view=all&mode=answer">
              <span>▦</span>
              <div>
                <strong>完整题库</strong>
                <small>判断 · 单选 · 多选 · 简答</small>
              </div>
              <b>›</b>
            </a>
          </div>
          <div className="learning-summary">
            <span>本机学习记录</span>
            <div>
              {[
                [records.length, "已作答", "home-done"],
                [correct, "客观题答对", "home-correct"],
                [rate, "客观题正确率", "home-rate"],
              ].map(([value, label, id]) => (
                <p key={id}>
                  <strong id={id}>{value}</strong>
                  <small>{label}</small>
                </p>
              ))}
            </div>
          </div>
        </section>
        <section
          id="skills"
          className="module-panel"
          aria-label="技能操作"
          hidden={selected !== "skills"}
        >
          <div className="module-caption">
            <span>模块 B · 技能操作</span>
            <span>120 分钟 · 100 分 · 总成绩占比 50%</span>
          </div>
          <div className="skill-groups">
            {groups.map(([label, score, lessons]) => (
              <section className="skill-group" aria-label={label} key={label}>
                <div className="skill-group-heading">
                  <h2>{label}</h2>
                  <span>{score}</span>
                </div>
                <div className="lesson-list">
                  {lessons.map(([id, code, title, detail, points]) => (
                    <a
                      className="lesson lesson-ready"
                      href={"skills.html?course=" + id}
                      key={id}
                    >
                      <span className="lesson-code">{code}</span>
                      <div>
                        <h3>{title}</h3>
                        <p>{detail}</p>
                        <small>{points}</small>
                      </div>
                      <span className="lesson-state">开始练习 ›</span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <p className="honest-note">
            五个技能项目均已接入：编程补全与案例方案练习。
          </p>
        </section>
        <section
          id="review"
          className="module-panel"
          aria-label="综合评审"
          hidden={selected !== "review"}
        >
          <div className="module-caption">
            <span>模块 C · 综合评审</span>
            <span className="status-label">12 步练习 · 三项任务</span>
          </div>
          <div className="review-empty">
            <span className="review-icon">C</span>
            <h2>大型场馆智能客流预测与疏导系统</h2>
            <p>
              功能卡 · 流程图 · JSON配置 · 接口审计 · 风险分级 · 状态流转 ·
              场景验证
            </p>
            <small>
              参考老师课件，结合2026样卷整理。支持点选、关键填空与原题独立作答。
            </small>
          </div>
          <a className="return-practice" href="skills.html?course=c">
            开始综合评审练习 →
          </a>
        </section>
        <footer className="home-foot">学习记录保存在当前浏览器</footer>
      </main>
    </>
  );
}
