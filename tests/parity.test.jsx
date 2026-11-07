import React from "react";
import { describe, test, expect, vi } from "vitest";
import {
  render,
  fireEvent,
  screen,
  cleanup,
  act,
} from "@testing-library/react";
import fs from "node:fs";
import vm from "node:vm";
import crypto from "node:crypto";
import Home from "../src/Home";
import Theory from "../src/TheoryPage";
import Skills from "../src/SkillsPage";
import PythonRunner, { usePythonRuntime } from "../src/PythonRunner";
import PythonEditor from "../src/PythonEditor";
import {
  questions,
  questionList,
  courses,
  tips,
  courseState,
  readStore,
  courseValues,
  resetMode,
  resetOriginal,
  normalizeCode,
} from "../src/model";
import { check as match } from "../src/matcher";
import { swipeDirection } from "../src/shared";
const click = (s) => fireEvent.click(document.querySelector(s)),
  fill = (s, value) =>
    fireEvent.change(document.querySelector(s), { target: { value } });
const savedTheory = () => readStore("zhilian-v1"),
  savedCourse = (id) => readStore("zhilian-skills-v1")[id];
function seedTheory(p = {}) {
  localStorage.setItem(
    "zhilian-v1",
    JSON.stringify({ auto: false, autoJumpVersion: 1, ...p }),
  );
}
function seedCourse(id, p = {}) {
  localStorage.setItem(
    "zhilian-skills-v1",
    JSON.stringify({ [id]: { answerSchema: 2, ...p } }),
  );
}
function answer(q, mode) {
  q.slots.forEach((slot, i) => {
    if (mode === "type") fill(`#exercise [data-slot="${i}"]`, slot.answer);
    else {
      click(`#exercise [data-slot="${i}"]`);
      fireEvent.click(
        [...document.querySelectorAll("[data-choice]")].find(
          (b) => b.dataset.choice === slot.answer,
        ),
      );
    }
  });
  click("#check-button");
}
function normalizeFlowGeometry(value) {
  if (Array.isArray(value)) return value.map(normalizeFlowGeometry);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, normalizeFlowGeometry(v)]),
    );
  if (typeof value !== "string") return value;
  return value
    .replace(/<svg class="flow-lines"[\s\S]*?<\/svg>/g, (svg) =>
      [...svg.matchAll(/<text[^>]*>(.*?)<\/text>/g)].map((m) => m[1]).join("|"),
    )
    .replace(/style="left:[^"]*"/g, "");
}

test("all authored questions, answers, code, comments, diagrams, task requirements and teacher references match the archived version exactly", () => {
  const ctx = { window: {} };
  vm.createContext(ctx);
  ["questions.js", "answers.js", "skill-content.js", "case-content.js"].forEach(
    (f) => vm.runInContext(fs.readFileSync("legacy/" + f, "utf8"), ctx),
  );
  const old = JSON.parse(
    vm.runInContext(
      "JSON.stringify({questions:QUESTIONS,courses:SKILL_COURSES})",
      ctx,
    ),
  );
  // Apply only the explicitly approved B2 boundary/text changes to the archived expectation.
  old.courses.b2 = JSON.parse(
    JSON.stringify(old.courses.b2)
      .replaceAll("planned_hours'] <= 72", "planned_hours'] <= 24")
      .replaceAll("planned_hours']<=72", "planned_hours']<=24")
      .replaceAll(
        "计划时长须为正且合理（如 ≤72），缺失率须在 0~1",
        "计划时长须为正且合理（≤24），缺失率须在 0~1",
      )
      .replaceAll(
        "planned_hours≤72 是老师参考代码中的运输计划时长筛选条件，不是答题时长限制；本页按老师写法保留。",
        "本练习按已确认规则将计划运输时长上限调整为24小时，保留原有 >0、<= 的筛选写法；不是答题时长限制。",
      )
      .replaceAll(
        "按老师参考代码，保留 0<planned_hours≤72 且 sensor_missing_rate 在 [0,1] 的记录；72 小时是运输时长上界，不是答题时限。",
        "保留 0<planned_hours≤24 且 sensor_missing_rate 在 [0,1] 的记录；排除0、包含24，24小时是运输时长上界，不是答题时限。",
      )
      .replaceAll(
        "保留老师参考的运输时长上界 72；between(0,1) 包含两个边界。",
        "计划运输时长必须大于0且不超过24小时；传感器缺失率的 between(0,1) 包含两个边界。",
      ),
  );
  // B4 task one now presents the approved structured training tables.
  old.courses.b4.tasks[0] = {
    ...old.courses.b4.tasks[0],
    trainingPlan: courses.b4.tasks[0].trainingPlan,
    answerHTML: courses.b4.tasks[0].answerHTML,
  };
  old.courses.b4.referenceHTML = courses.b4.referenceHTML;
  old.courses.b11.tasks[0] = {
    ...old.courses.b11.tasks[0],
    businessTables: courses.b11.tasks[0].businessTables,
    answerHTML: courses.b11.tasks[0].answerHTML,
  };
  old.courses.b11.referenceHTML = courses.b11.referenceHTML;
  old.courses.b11.steps[1] = {
    ...old.courses.b11.steps[1],
    code: courses.b11.steps[1].code,
    solution: courses.b11.steps[1].solution,
    slots: courses.b11.steps[1].slots,
  };
  old.courses.b11.tasks[1] = {
    ...old.courses.b11.tasks[1],
    pathTables: courses.b11.tasks[1].pathTables,
    answerHTML: courses.b11.tasks[1].answerHTML,
  };
  old.courses.b11.tasks[2] = {
    ...old.courses.b11.tasks[2],
    reviewTables: courses.b11.tasks[2].reviewTables,
    answerHTML: courses.b11.tasks[2].answerHTML,
  };
  old.courses.b2.tasks[0] = {
    ...old.courses.b2.tasks[0],
    conclusionTables: courses.b2.tasks[0].conclusionTables,
    answerHTML: courses.b2.tasks[0].answerHTML,
  };
  for (const [index, step] of courses.b3.steps.entries()) {
    if (step.flowchartHTML)
      old.courses.b3.steps[index].flowchartHTML = step.flowchartHTML;
    else delete old.courses.b3.steps[index].flowchartHTML;
    if (index === 0)
      old.courses.b3.steps[index].slots[2].matchRule = step.slots[2].matchRule;
    if (step.tablePractice)
      old.courses.b3.steps[index].tablePractice = step.tablePractice;
  }
  courses.b3.tasks.forEach((task, index) => {
    old.courses.b3.tasks[index].answerTables = task.answerTables;
    if (task.providedAnswers)
      old.courses.b3.tasks[index].providedAnswers = task.providedAnswers;
    old.courses.b3.tasks[index].answerHTML = task.answerHTML;
  });
  old.courses.b3.referenceHTML = courses.b3.referenceHTML;
  const oldB3Task = old.courses.b3.tasks[0];
  const b3Task = courses.b3.tasks[0];
  const diagramHeading = "<h4>规范业务流程图（参考方案）</h4>";
  oldB3Task.flowchart.html = b3Task.flowchart.html;
  oldB3Task.answerHTML =
    oldB3Task.answerHTML.split(diagramHeading)[0] +
    diagramHeading +
    b3Task.answerHTML.split(diagramHeading)[1];
  old.courses.b3.referenceHTML = old.courses.b3.referenceHTML.replace(
    /<h4>规范业务流程图（参考方案）<\/h4>[\s\S]*?(?=<h2>)/,
    diagramHeading + b3Task.answerHTML.split(diagramHeading)[1],
  );
  old.courses.b11.steps[0] = {
    ...old.courses.b11.steps[0],
    code: courses.b11.steps[0].code,
    solution: courses.b11.steps[0].solution,
    slots: courses.b11.steps[0].slots,
  };
  expect(questions.slice(0, old.questions.length)).toEqual(old.questions);
  expect(normalizeFlowGeometry(courses)).toEqual(
    normalizeFlowGeometry(old.courses),
  );
  expect(
    questions.map((q) => q.type).reduce((a, t) => (a[t]++, a), [0, 0, 0, 0]),
  ).toEqual([19, 67, 9, 6]);
  expect(
    Object.fromEntries(
      Object.entries(courses).map(([id, c]) => [id, c.steps.length]),
    ),
  ).toEqual({ b12: 12, b2: 19, b11: 8, b3: 10, b4: 5, c: 12 });
  expect(Object.keys(tips)).toHaveLength(13);
});
test("static deployment retains original assets and intentionally updated references", () => {
  const manifest = JSON.parse(
    fs.readFileSync("legacy/materials-manifest.json", "utf8"),
  );
  for (const [file, sha] of Object.entries(manifest)) {
    if (file === "materials/b2-written-reference.html") {
      expect(fs.readFileSync("public/" + file, "utf8")).toContain(
        courses.b2.tasks[0].answerHTML,
      );
      continue;
    }
    if (file === "materials/b2-reference.ipynb") {
      const notebook = JSON.parse(fs.readFileSync("public/" + file, "utf8"));
      expect(
        notebook.cells
          .filter((c) => c.cell_type === "code")
          .map((c) => c.source.join(""))
          .join("\n"),
      ).toBe(courses.b2.referenceCode);
      continue;
    }
    if (file === "materials/b2-website-reference.py") {
      expect(fs.readFileSync("public/" + file, "utf8")).toContain(
        courses.b2.websiteCode,
      );
      continue;
    }
    const updated = [courses.b11, courses.b3, courses.b4].find(
      (c) => c.downloadPath === file,
    );
    if (updated) {
      expect(fs.readFileSync("public/" + file, "utf8")).toContain(
        updated.referenceHTML,
      );
      continue;
    }
    expect(
      crypto
        .createHash("sha256")
        .update(fs.readFileSync("public/" + file))
        .digest("hex"),
      file,
    ).toBe(sha);
  }
  for (const [id, c] of Object.entries(courses)) {
    for (const name of [
      c.downloadPath || `materials/${id}-reference.ipynb`,
      c.writtenDownloadPath,
      ...(c.kind === "case" ? [] : [`materials/${id}-original.zip`]),
    ].filter(Boolean))
      expect(fs.existsSync("public/" + name), name).toBe(true);
  }
  for (const name of [
    "cold_chain_shipments.csv",
    "meeting_bookings.csv",
    "meeting_rooms.csv",
  ])
    expect(fs.statSync("public/materials/data/" + name).size).toBeGreaterThan(
      100,
    );
  expect(fs.readFileSync("public/python-worker.js", "utf8")).toBe(
    fs.readFileSync("legacy/python-worker.js", "utf8"),
  );
});
test("home navigation, restored summary, all six module links and hash changes", () => {
  seedTheory({
    records: {
      0: { correct: true },
      1: { correct: false },
      80: { self: "已掌握" },
    },
    favorites: [1],
  });
  render(<Home />);
  expect(document.querySelector("#home-progress")).toHaveTextContent("3 / 101");
  expect(document.querySelector("#home-rate")).toHaveTextContent("50%");
  expect(
    document.querySelectorAll('[href^="skills.html?course="]'),
  ).toHaveLength(6);
  act(() => {
    location.hash = "review";
    window.dispatchEvent(new Event("hashchange"));
  });
  expect(document.querySelector("#review")).not.toHaveAttribute("hidden");
  expect(document.querySelector("#skills")).toHaveAttribute("hidden");
});
test("supplemental questions keep legacy IDs and appear with their question types", () => {
  const ordered = questionList({ view: "all", filter: "all" });
  expect(ordered.map((q) => q.type)).toEqual(
    questions.map((q) => q.type).sort(),
  );
  expect(new Set(ordered.map((q) => q.text.replace(/\s+/g, ""))).size).toBe(
    101,
  );
  for (const [index, q] of questions.entries()) expect(q.id).toBe(index);
  expect(questions.filter((q) => q.supplemental).map((q) => q.id)).toEqual(
    Array.from({ length: 18 }, (_, index) => index + 83),
  );
});

describe("theory objective questions", () => {
  test.each(questions.filter((q) => q.type !== 3).map((q) => [q.id, q]))(
    "question %i accepts canonical answer and persists correct result",
    (_, q) => {
      seedTheory({ current: q.id });
      render(<Theory />);
      q.answer.forEach((i) => click(`[data-option="${i}"]`));
      if (q.type === 2) click("#submit");
      expect(
        document.querySelector("#question-card .result"),
      ).toHaveTextContent("回答正确");
      expect(savedTheory().records[q.id]).toMatchObject({
        selected: q.answer,
        correct: true,
      });
      expect(document.querySelectorAll(".option.correct")).toHaveLength(
        q.answer.length,
      );
      if (q.source)
        expect(document.querySelector(".law-source a")).toHaveAttribute(
          "href",
          q.source.url,
        );
    },
  );
});
test("theory multi-select rejects missing and extra choices independently", () => {
  const q = questions.find((q) => q.type === 2);
  seedTheory({ current: q.id });
  render(<Theory />);
  click(`[data-option="${q.answer[0]}"]`);
  click("#submit");
  expect(savedTheory().records[q.id].correct).toBe(false);
  expect(document.querySelector(".result")).toHaveTextContent("漏选");
  click("#retry");
  q.options.forEach((_, i) => click(`[data-option="${i}"]`));
  click("#submit");
  expect(savedTheory().records[q.id].correct).toBe(
    q.answer.length === q.options.length,
  );
  expect(document.querySelector(".result")).toHaveTextContent("错选");
});
test.each(questions.filter((q) => q.type === 3).map((q) => [q.id, q]))(
  "essay %i autosaves, shows reference and persists all self-assessment choices",
  (_, q) => {
    seedTheory({ current: q.id });
    render(<Theory />);
    fill("#short-answer", "我的分点作答");
    expect(savedTheory().drafts[q.id]).toBe("我的分点作答");
    click("#submit");
    expect(document.querySelectorAll(".points li")).toHaveLength(
      q.points.length,
    );
    for (const level of ["需复习", "部分掌握", "已掌握"]) {
      fireEvent.click(screen.getByRole("button", { name: level, exact: true }));
      expect(savedTheory().records[q.id].self).toBe(level);
    }
    click("#retry");
    expect(document.querySelector("#short-answer")).toHaveValue("我的分点作答");
  },
);
test("300ms correct auto advance, cancellation on manual navigation and mode switch", () => {
  vi.useFakeTimers();
  seedTheory({ auto: true });
  render(<Theory />);
  click(`[data-option="${questions[0].answer[0]}"]`);
  expect(document.querySelector(".result")).toHaveTextContent("回答正确");
  act(() => vi.advanceTimersByTime(299));
  expect(savedTheory().current).toBe(0);
  act(() => vi.advanceTimersByTime(1));
  expect(savedTheory().current).toBe(1);
  click(`[data-option="${questions[1].answer[0]}"]`);
  click("#next");
  act(() => vi.advanceTimersByTime(500));
  expect(savedTheory().current).toBe(2);
  click(`[data-option="${questions[2].answer[0]}"]`);
  click("#study-mode");
  act(() => vi.advanceTimersByTime(500));
  expect(savedTheory().current).toBe(2);
  expect(savedTheory().mode).toBe("study");
});
test("theory incorrect stays, wrong bank removes corrected question, favorites and empty bank", () => {
  seedTheory();
  render(<Theory />);
  click(`[data-option="${1 - questions[0].answer[0]}"]`);
  expect(savedTheory().current).toBe(0);
  click("#favorite");
  click('[data-view="wrong"]');
  click("#retry");
  click(`[data-option="${questions[0].answer[0]}"]`);
  expect(document.querySelector(".empty")).toHaveTextContent("暂时没有错题");
  click('[data-view="favorites"]');
  expect(savedTheory().current).toBe(0);
  click("#favorite");
  expect(document.querySelector(".empty")).toHaveTextContent("还没有收藏题目");
});
test("unanswered queue remains stable while answering, swipes stay within queue, map reset preserves favorites", async () => {
  seedTheory({
    records: { 1: { correct: false, selected: [0] } },
    favorites: [3],
  });
  render(<Theory />);
  click('[data-filter="unanswered"]');
  expect(savedTheory().filterIds).not.toContain(1);
  click(`[data-option="${questions[0].answer[0]}"]`);
  expect(savedTheory().filterIds).toContain(0);
  const card = document.querySelector("#question-card");
  fireEvent.touchStart(card, { touches: [{ clientX: 300, clientY: 100 }] });
  fireEvent.touchMove(card, { touches: [{ clientX: 200, clientY: 102 }] });
  expect(card.style.transform).toBe("translateX(-100px)");
  await act(async () =>
    fireEvent.touchEnd(card, {
      touches: [],
      changedTouches: [{ clientX: 180, clientY: 102 }],
    }),
  );
  expect(savedTheory().current).toBe(2);
  click("#reset-all");
  expect(savedTheory()).toMatchObject({
    records: {},
    drafts: {},
    current: 0,
    filter: "all",
    view: "all",
    favorites: [3],
  });
});
test("all theory direct entry modes, type navigation and answer tips are available", () => {
  window.history.replaceState(null, "", "/theory.html?mode=study&view=all");
  render(<Theory />);
  expect(document.querySelector("#auto")).toBeDisabled();
  click('[data-type="3"]');
  expect(document.querySelector(".points li")).toBeTruthy();
  click("#theory-study-tips");
  expect(document.querySelector("#study-tips-dialog").open).toBe(true);
  expect(document.querySelector("#study-tips-dialog a")).toHaveAttribute(
    "href",
    expect.stringContaining("workbuddy.host"),
  );
});
describe.each(Object.entries(courses))("course %s", (id, course) => {
  test.each(["pick", "type"])(
    "%s: every step renders, checks every blank independently and finishes",
    (mode) => {
      seedCourse(id, { mode });
      render(<Skills courseId={id} />);
      for (const [index, q] of course.steps.entries()) {
        expect(document.querySelector("#exercise h1")).toHaveTextContent(
          q.title,
        );
        expect(document.querySelectorAll("#exercise [data-slot]")).toHaveLength(
          q.slots.length,
        );
        answer(q, mode);
        expect(document.querySelector("#feedback .success")).toBeTruthy();
        expect(savedCourse(id).records[q.id].correct).toBe(true);
        expect(
          document.querySelectorAll("#exercise [data-slot].correct"),
        ).toHaveLength(q.slots.length);
        if (q.slots.length > 1) {
          if (mode === "type")
            fill(
              '#exercise [data-slot="1"]',
              q.slots[1].choices.find((v) => v !== q.slots[1].answer),
            );
          else {
            click('#exercise [data-slot="1"]');
            fireEvent.click(
              [...document.querySelectorAll("[data-choice]")].find(
                (b) => b.dataset.choice !== q.slots[1].answer,
              ),
            );
          }
          click("#check-button");
          expect(
            document.querySelector('#exercise [data-slot="0"]'),
          ).toHaveClass("correct");
          expect(
            document.querySelector('#exercise [data-slot="1"]'),
          ).toHaveClass("incorrect");
          click("#reveal-answer");
        }
        click("#next-button");
        if (index < course.steps.length - 1)
          expect(savedCourse(id).index).toBe(index + 1);
      }
      expect(document.querySelector("#finish")).not.toHaveAttribute("hidden");
      click("#practice-again");
      expect(savedCourse(id).index).toBe(0);
    },
  );
  test("original mode preserves independent tasks, diagrams, history and reference answers across refresh/reset", () => {
    const first = course.steps[0];
    seedCourse(id, {
      draftsByMode: {
        pick: { [first.id]: first.slots.map((s) => s.answer) },
        type: {},
      },
      records: {},
    });
    render(<Skills courseId={id} />);
    click('[data-mode="original"]');
    for (const task of course.tasks || []) {
      fill(`[data-task="${task.id}"]`, "我的独立方案与任务结论");
      expect(savedCourse(id).caseDrafts[task.id]).toBe(
        "我的独立方案与任务结论",
      );
      if (task.flowchart) {
        fill(
          `[data-flow-task="${task.id}"][data-flow-slot="0"]`,
          task.flowchart.slots[0].answer,
        );
        expect(savedCourse(id).flowDrafts[task.id][0]).toBe(
          task.flowchart.slots[0].answer,
        );
      }
    }
    if (course.kind !== "case") {
      fill(".original-editor", "print(123)");
      expect(savedCourse(id).originalDraft).toBe("print(123)");
      expect(document.querySelector(".editor-gutter pre")).toHaveTextContent(
        "1",
      );
    }
    click("#open-practice-history");
    expect(document.querySelectorAll(".history-step")).toHaveLength(
      course.steps.length,
    );
    fireEvent.click(
      document.querySelector(
        '#practice-history-dialog button[aria-label="关闭"]',
      ),
    );
    click("#check-button");
    expect(document.querySelectorAll(".case-solution")).toHaveLength(
      course.tasks?.length || 0,
    );
    for (const task of course.tasks || []) {
      const box = document.querySelector(`[data-case-self="${task.id}"]`);
      fireEvent.click(box);
      expect(savedCourse(id).caseSelf[task.id]).toBe(true);
    }
    cleanup();
    render(<Skills courseId={id} />);
    expect(savedCourse(id).mode).toBe("original");
    for (const task of course.tasks || [])
      expect(document.querySelector(`[data-task="${task.id}"]`)).toHaveValue(
        "我的独立方案与任务结论",
      );
    click("#reset-practice");
    expect(savedCourse(id).caseDrafts).toEqual({});
    expect(savedCourse(id).flowDrafts).toEqual({});
    expect(savedCourse(id).draftsByMode.pick[first.id]).toEqual(
      first.slots.map((s) => s.answer),
    );
    if (course.kind !== "case")
      expect(document.querySelector(".original-editor")).toHaveValue(
        course.originalCode,
      );
  });
  test.each(["pick", "type"])(
    "%s bulk reset only affects this course/mode, other work survives",
    (mode) => {
      const q = course.steps[1],
        other = mode === "pick" ? "type" : "pick";
      seedCourse(id, {
        mode,
        index: 1,
        draftsByMode: {
          pick: { [q.id]: ["pick"] },
          type: { [q.id]: ["type"] },
        },
        caseDrafts: { saved: "written" },
        originalDraft: "untouched",
        records: {
          [q.id]: {
            modeAnswers: {
              pick: { values: ["pick"], matches: [true] },
              type: { values: ["type"], matches: [true] },
            },
            correct: true,
            reviewed: true,
          },
        },
      });
      const all = readStore("zhilian-skills-v1");
      all.unrelated = { draft: "keep" };
      localStorage.setItem("zhilian-skills-v1", JSON.stringify(all));
      render(<Skills courseId={id} />);
      click("#reset-all-practice");
      expect(savedCourse(id).index).toBe(0);
      expect(savedCourse(id).draftsByMode[mode]).toEqual({});
      expect(savedCourse(id).draftsByMode[other][q.id]).toEqual([other]);
      expect(savedCourse(id).records[q.id].modeAnswers[mode]).toBeUndefined();
      expect(savedCourse(id).originalDraft).toBe("untouched");
      expect(savedCourse(id).caseDrafts.saved).toBe("written");
      expect(readStore("zhilian-skills-v1").unrelated).toEqual({
        draft: "keep",
      });
    },
  );
  test.each(["pick", "type"])(
    "%s reset current step preserves other steps and modes",
    (mode) => {
      const q = course.steps[0],
        next = course.steps[1],
        other = mode === "pick" ? "type" : "pick";
      seedCourse(id, {
        mode,
        index: 0,
        draftsByMode: {
          [mode]: { [q.id]: ["current"], [next.id]: ["next"] },
          [other]: { [q.id]: ["other"] },
        },
        records: {
          [q.id]: {
            modeAnswers: {
              [mode]: { values: ["current"], matches: [false] },
              [other]: { values: ["other"], matches: [true] },
            },
          },
        },
        caseDrafts: { saved: "written" },
        functionCardDrafts: { ct1: { monitor: { role: "keep" } } },
      });
      render(<Skills courseId={id} />);
      expect(document.querySelector("#reset-practice")).toBeVisible();
      vi.mocked(window.confirm).mockReturnValueOnce(false);
      click("#reset-practice");
      expect(savedCourse(id).draftsByMode[mode][q.id]).toEqual(["current"]);
      click("#reset-practice");
      const p = savedCourse(id);
      expect(p.draftsByMode[mode][q.id]).toBeUndefined();
      expect(p.records[q.id].modeAnswers[mode]).toBeUndefined();
      expect(p.records[q.id].modeAnswers[other].values).toEqual(["other"]);
      expect(p.draftsByMode[mode][next.id]).toEqual(["next"]);
      expect(p.draftsByMode[other][q.id]).toEqual(["other"]);
      expect(p.caseDrafts.saved).toBe("written");
      expect(p.functionCardDrafts.ct1.monitor.role).toBe("keep");
      if (mode === "pick")
        expect(document.querySelector('[data-slot="0"]')).toHaveTextContent(
          "空 1",
        );
      else expect(document.querySelector('[data-slot="0"]')).toHaveValue("");
    },
  );
  test("directory, previous/next navigation, hints, tips, per-step reset and restart", () => {
    render(<Skills courseId={id} />);
    click("#next-step");
    expect(savedCourse(id).index).toBe(1);
    click("#prev-step");
    expect(savedCourse(id).index).toBe(0);
    click("#hint-button");
    expect(document.querySelector("#feedback")).toHaveTextContent(
      course.steps[0].hint,
    );
    click("#study-tips-button");
    expect(document.querySelector("#study-tips-dialog").open).toBe(true);
    fireEvent.click(
      document.querySelector('#study-tips-dialog [aria-label="关闭"]'),
    );
    click("#lesson-map");
    expect(document.querySelectorAll("[data-lesson]")).toHaveLength(
      course.steps.length,
    );
    click('[data-lesson="1"]');
    expect(savedCourse(id).index).toBe(1);
    click('[data-mode="type"]');
    fill('[data-slot="0"]', "test");
    click("#reset-practice");
    expect(document.querySelector('[data-slot="0"]')).toHaveValue("");
    click("#lesson-map");
    click("#restart-course");
    expect(savedCourse(id).records).toEqual({});
    expect(savedCourse(id).index).toBe(0);
  });
});
test("schema migration preserves legacy drafts, reorder, quotes and isolated modes", () => {
  localStorage.setItem(
    "zhilian-skills-v1",
    JSON.stringify({
      b2: {
        drafts: { "b2-5": ["y", "X", "'median'"], "b2-9": ["a", "b", "c"] },
      },
    }),
  );
  const p = courseState("b2");
  expect(p.answerSchema).toBe(2);
  expect(p.draftsByMode.pick["b2-5"]).toEqual(["X", "y", "median"]);
  expect(p.draftsByMode.pick["b2-9"]).toEqual(["a", "c", "b"]);
  p.draftsByMode.pick["b2-5"][0] = "changed";
  expect(p.draftsByMode.type["b2-5"][0]).toBe("X");
});
test("subjective matching accepts synonyms and keeps unknown wording neutral, while code matching stays strict", () => {
  const slot = Object.values(courses)
    .flatMap((c) => c.steps)
    .flatMap((q) => q.slots)
    .find((s) => s.matchRule?.aliases?.length);
  expect(match(slot, slot.matchRule.aliases[0]).status).toBe("covered");
  expect(match(slot, "我的其他合理方案需要老师检查").status).toBe("review");
  expect(normalizeCode(" a = 'b' ")).toBe(normalizeCode('a="b"'));
  expect(normalizeCode("stratify=y")).not.toBe(normalizeCode("stratify=X"));
});
test.each([
  [100, 5, 200, -1],
  [-100, 4, 200, 1],
  [50, 0, 100, 0],
  [100, 90, 300, 0],
  [100, 0, 801, 0],
])("swipe threshold %s/%s/%s yields %s", (x, y, time, dir) =>
  expect(swipeDirection(x, y, time)).toBe(dir),
);
test("browser Python runner sends clean full run, persistent selected run with line offset, displays table/errors and resets", () => {
  let worker;
  class MockWorker {
    constructor(url) {
      worker = this;
      this.url = String(url);
      this.postMessage = vi.fn();
      this.terminate = vi.fn();
    }
  }
  vi.stubGlobal("Worker", MockWorker);
  const editorRef = {
    current: { value: "a=1\nprint(a)", selectionStart: 4, selectionEnd: 12 },
  };
  function RunnerHarness() {
    const runtime = usePythonRuntime({
      courseId: "b2",
      editorRef,
      code: editorRef.current.value,
    });
    return <PythonRunner runtime={runtime} />;
  }
  render(<RunnerHarness />);
  fireEvent.click(screen.getByRole("button", { name: "▶ 运行全部" }));
  expect(worker.postMessage).toHaveBeenLastCalledWith(
    expect.objectContaining({
      fresh: true,
      code: editorRef.current.value,
      courseId: "b2",
    }),
  );
  act(() => worker.onmessage({ data: { type: "done" } }));
  fireEvent.click(screen.getByRole("button", { name: "运行选中代码" }));
  expect(worker.postMessage).toHaveBeenLastCalledWith(
    expect.objectContaining({ fresh: false, code: "\nprint(a)" }),
  );
  act(() => {
    worker.onmessage({
      data: {
        type: "display",
        value: {
          kind: "table",
          columns: ["x"],
          rows: [[1]],
          totalRows: 1,
          totalColumns: 1,
        },
      },
    });
    worker.onmessage({
      data: { type: "error", recoverable: true, text: "NameError: a" },
    });
  });
  expect(screen.getByRole("table")).toHaveTextContent("1");
  expect(document.querySelector(".runner-error")).toHaveTextContent(
    "NameError",
  );
  fireEvent.click(screen.getByRole("button", { name: "重置环境" }));
  expect(worker.terminate).toHaveBeenCalled();
  expect(document.querySelector(".runner-output")).toBeEmptyDOMElement();
});
test("React Python editor shows comments, line numbers, escaped text, Tab/ShiftTab and scroll sync", () => {
  const ref = React.createRef();
  function Editor() {
    const [code, set] = React.useState(
      '# M1（1分）：数据准备\nprint("<safe>")',
    );
    return <PythonEditor editorRef={ref} value={code} onChange={set} />;
  }
  render(<Editor />);
  expect(document.querySelector(".py-comment")).toHaveTextContent("M1");
  expect(
    [...document.querySelectorAll(".editor-gutter pre span")].map(
      (n) => n.textContent,
    ),
  ).toEqual(["1", "2"]);
  expect(document.querySelector(".editor-syntax script")).toBeNull();
  ref.current.setSelectionRange(0, 0);
  fireEvent.keyDown(ref.current, { key: "Tab" });
  expect(ref.current.value.startsWith("    #")).toBe(true);
  fireEvent.keyDown(ref.current, { key: "Tab", shiftKey: true });
  expect(ref.current.value.startsWith("#")).toBe(true);
  fireEvent.scroll(ref.current, { target: { scrollTop: 30, scrollLeft: 10 } });
  expect(document.querySelector(".editor-syntax").style.transform).toBe(
    "translate(-10px, -30px)",
  );
});

test("Python results and namespace survive switching practice modes, reset original clears them", () => {
  let worker;
  class WorkerMock {
    constructor() {
      worker = this;
      this.postMessage = vi.fn();
      this.terminate = vi.fn();
    }
  }
  vi.stubGlobal("Worker", WorkerMock);
  render(<Skills courseId="b2" />);
  click('[data-mode="original"]');
  fill(".original-editor", "a = 42\nprint(a)");
  fireEvent.click(screen.getByRole("button", { name: "▶ 运行全部" }));
  act(() => {
    worker.onmessage({ data: { type: "stdout", text: "42" } });
    worker.onmessage({ data: { type: "done" } });
  });
  click('[data-mode="pick"]');
  click('[data-mode="type"]');
  click('[data-mode="original"]');
  expect(document.querySelector(".runner-output")).toHaveTextContent("42");
  expect(worker.terminate).not.toHaveBeenCalled();
  const area = document.querySelector(".original-editor");
  area.setSelectionRange(7, area.value.length);
  fireEvent.click(screen.getByRole("button", { name: "运行选中代码" }));
  expect(worker.postMessage).toHaveBeenLastCalledWith(
    expect.objectContaining({ fresh: false }),
  );
  click("#reset-practice");
  expect(worker.terminate).toHaveBeenCalled();
  expect(document.querySelector(".runner-output")).toBeEmptyDOMElement();
});
test("swiping inside flowcharts and inputs never changes the step; cancelled reset preserves drafts", () => {
  seedCourse("b3", { index: 0, mode: "type" });
  render(<Skills courseId="b3" />);
  const input = document.querySelector('#exercise [data-slot="0"]');
  fireEvent.change(input, { target: { value: "我的方案" } });
  fireEvent.touchStart(input, { touches: [{ clientX: 300, clientY: 100 }] });
  fireEvent.touchMove(input, { touches: [{ clientX: 100, clientY: 100 }] });
  fireEvent.touchEnd(input, {
    touches: [],
    changedTouches: [{ clientX: 100, clientY: 100 }],
  });
  expect(savedCourse("b3").index).toBe(0);
  vi.spyOn(window, "confirm").mockReturnValue(false);
  click("#reset-all-practice");
  expect(savedCourse("b3").draftsByMode.type[courses.b3.steps[0].id][0]).toBe(
    "我的方案",
  );
});

test("review task one uses persistent six-field function cards, preserves legacy text and resets originals", () => {
  seedCourse("c", { mode: "original", caseDrafts: { ct1: "之前的答案" } });
  let view = render(<Skills courseId="c" />);
  expect(
    document.querySelectorAll("#written-ct1 fieldset.function-card"),
  ).toHaveLength(3);
  expect(document.querySelectorAll("[data-function-field]")).toHaveLength(18);
  expect(document.querySelector('[data-task="ct1"]')).toHaveValue("之前的答案");
  fill(
    '[data-function-card="monitor"][data-function-field="role"]',
    "值班监控员；活动启用时持续监测。",
  );
  expect(savedCourse("c").functionCardDrafts.ct1.monitor.role).toContain(
    "值班监控员",
  );
  view.unmount();
  view = render(<Skills courseId="c" />);
  expect(
    document.querySelector(
      '[data-function-card="monitor"][data-function-field="role"]',
    ),
  ).toHaveValue("值班监控员；活动启用时持续监测。");
  click("#check-button");
  expect(
    document.querySelectorAll("#written-ct1 .function-card-reference article"),
  ).toHaveLength(3);
  expect(
    document.querySelectorAll("#written-ct1 .function-card-reference dt"),
  ).toHaveLength(18);
  click("#reset-practice");
  expect(savedCourse("c").functionCardDrafts).toEqual({});
  expect(savedCourse("c").caseDrafts).toEqual({});
});
test.each([0, 1, 2])(
  "review function card step %s retains six fields and both answer slots",
  (index) => {
    seedCourse("c", { mode: "pick", index });
    render(<Skills courseId="c" />);
    expect(
      document.querySelectorAll("#exercise .function-card dt"),
    ).toHaveLength(6);
    expect(document.querySelectorAll("#exercise [data-slot]")).toHaveLength(2);
    answer(courses.c.steps[index], "pick");
    expect(savedCourse("c").records[courses.c.steps[index].id].correct).toBe(
      true,
    );
  },
);

test("B2 planned hours stays positive with the confirmed 24-hour upper bound everywhere", () => {
  const course = courses.b2;
  const step = course.steps.find((q) => q.title === "过滤非法记录");
  expect(step.id).toBe("b2-4");
  expect(step.slots.map((s) => s.answer)).toEqual([">", "between"]);
  expect(step.solution).toContain(
    "(df['planned_hours']>0)&(df['planned_hours']<=24)",
  );
  expect(step.goal).toContain("0<planned_hours≤24");
  for (const code of [
    ...step.websiteReferences,
    step.teacherExpression,
    course.referenceCode,
    course.websiteCode,
  ]) {
    expect(code).toMatch(/planned_hours'\]\s*>\s*0/);
    expect(code).toMatch(/planned_hours'\]\s*<=\s*24/);
    expect(code).not.toMatch(/planned_hours'\]\s*<=\s*72/);
  }
});
