import React from "react";
import { test, expect, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Skills from "../src/SkillsPage";
import { courses, readStore } from "../src/model";
const click = (selector) => fireEvent.click(document.querySelector(selector));
const fill = (selector, value) =>
  fireEvent.change(document.querySelector(selector), { target: { value } });
const stored = () => readStore("zhilian-skills-v1").b4;
const task = courses.b4.tasks[0];
const fields = ["topic", "audience", "goal", "content", "method", "output"];
function start(mode) {
  localStorage.setItem(
    "zhilian-skills-v1",
    JSON.stringify({
      b4: {
        answerSchema: 2,
        mode,
        index: 0,
        caseDrafts: { b4t1: "之前的整段答案" },
      },
    }),
  );
  render(<Skills courseId="b4" />);
}
test("B4 training plan has one knowledge and one technical table, preserves legacy draft and saves/resets all fields", () => {
  start("original");
  expect(task.trainingPlan.map((row) => row.id)).toEqual([
    "knowledge",
    "technical",
  ]);
  expect(
    document.querySelectorAll("#written-b4t1 .training-plan table"),
  ).toHaveLength(2);
  expect(document.querySelectorAll("[data-training-field]")).toHaveLength(12);
  expect(document.querySelector('[data-task="b4t1"]')).toHaveValue(
    "之前的整段答案",
  );
  for (const row of task.trainingPlan)
    for (const key of fields) {
      fill(
        `[data-training-row="${row.id}"][data-training-field="${key}"]`,
        row.values[key],
      );
      expect(stored().trainingDrafts.b4t1[row.id][key]).toBe(row.values[key]);
    }
  click('[data-check-task="b4t1"]');
  expect(
    document.querySelectorAll(
      "#written-b4t1 .case-solution .training-plan table",
    ),
  ).toHaveLength(2);
  expect(document.querySelectorAll(".case-solution")).toHaveLength(1);
  expect(document.querySelector("#coverage-b4t1")).not.toHaveTextContent(
    "待自检",
  );
  cleanup();
  render(<Skills courseId="b4" />);
  expect(
    document.querySelector(
      '[data-training-row="technical"][data-training-field="topic"]',
    ),
  ).toHaveValue("人工智能回复核验与纠错");
  vi.mocked(window.confirm).mockReturnValueOnce(false);
  click("#reset-practice");
  expect(stored().trainingDrafts.b4t1.technical.topic).toBe(
    "人工智能回复核验与纠错",
  );
  click("#reset-practice");
  expect(stored().trainingDrafts).toEqual({});
  expect(document.querySelector('[data-training-field="topic"]')).toHaveValue(
    "",
  );
});
test.each(["pick", "type"])(
  "B4 %s training tables retain both original answer slots and support repeated practice",
  (mode) => {
    start(mode);
    const q = courses.b4.steps[0];
    expect(
      document.querySelectorAll("#exercise .training-plan table"),
    ).toHaveLength(2);
    expect(document.querySelectorAll("#exercise th")).toHaveLength(12);
    q.slots.forEach((slot, i) => {
      if (mode === "type") fill(`[data-slot="${i}"]`, slot.answer);
      else {
        click(`[data-slot="${i}"]`);
        fireEvent.click(
          [...document.querySelectorAll("[data-choice]")].find(
            (b) => b.dataset.choice === slot.answer,
          ),
        );
      }
    });
    click("#check-button");
    expect(stored().records[q.id].correct).toBe(true);
    click("#reset-practice");
    expect(stored().draftsByMode[mode][q.id]).toBeUndefined();
    expect(stored().caseDrafts.b4t1).toBe("之前的整段答案");
  },
);
test("B1-1 original framework uses three editable tables and preserves drafts through refresh", () => {
  localStorage.setItem(
    "zhilian-skills-v1",
    JSON.stringify({
      b11: {
        answerSchema: 2,
        mode: "original",
        caseDrafts: { b11t1: "旧答案" },
      },
    }),
  );
  render(<Skills courseId="b11" />);
  expect(
    document.querySelectorAll("#written-b11t1 .business-tables table"),
  ).toHaveLength(3);
  fill('[data-business-cell="0-0-0"]', "现场采集与图像质量校验");
  expect(readStore("zhilian-skills-v1").b11.businessDrafts.b11t1["0-0-0"]).toBe(
    "现场采集与图像质量校验",
  );
  cleanup();
  render(<Skills courseId="b11" />);
  expect(document.querySelector('[data-business-cell="0-0-0"]')).toHaveValue(
    "现场采集与图像质量校验",
  );
  expect(document.querySelector('[data-task="b11t1"]')).toHaveValue("旧答案");
  click('[data-check-task="b11t1"]');
  expect(
    document.querySelectorAll(
      "#written-b11t1 .case-solution .business-tables table",
    ),
  ).toHaveLength(3);
  click("#reset-practice");
  expect(readStore("zhilian-skills-v1").b11.businessDrafts).toEqual({});
});

test("B1-1 teacher IO table preserves six records and keeps old cell drafts separate", () => {
  const task = courses.b11.tasks[0],
    io = task.businessTables[2];
  expect(io.headers).toEqual(["方向", "记录", "来源/去向", "关键字段"]);
  expect(io.rows.map((row) => row[1])).toEqual([
    "检测任务记录",
    "模型推理结果",
    "人工复核结论",
    "产品状态记录",
    "质量处置记录",
    "模型改进样本记录",
  ]);
  localStorage.setItem(
    "zhilian-skills-v1",
    JSON.stringify({
      b11: {
        answerSchema: 2,
        mode: "original",
        businessDrafts: { b11t1: { "2-0-1": "旧来源" } },
      },
    }),
  );
  render(<Skills courseId="b11" />);
  expect(document.querySelector("#written-b11t1")).toHaveTextContent("旧来源");
  expect(document.querySelector('[data-business-cell="io-0-1"]')).toHaveValue(
    "",
  );
  fill('[data-business-cell="io-0-1"]', "检测任务记录");
  expect(readStore("zhilian-skills-v1").b11.businessDrafts.b11t1["2-0-1"]).toBe(
    "旧来源",
  );
  expect(
    readStore("zhilian-skills-v1").b11.businessDrafts.b11t1["io-0-1"],
  ).toBe("检测任务记录");
});
test.each(["pick", "type"])(
  "expanded IO practice %s preserves old blanks and requires new answers",
  (mode) => {
    const q = courses.b11.steps[1];
    expect(q.slots.slice(0, 3).map((s) => s.answer)).toEqual([
      "质检员",
      "当前有效状态",
      "人员、理由及时间",
    ]);
    expect(q.slots).toHaveLength(9);
    localStorage.setItem(
      "zhilian-skills-v1",
      JSON.stringify({
        b11: {
          answerSchema: 2,
          mode,
          index: 1,
          draftsByMode: {
            [mode]: { [q.id]: q.slots.slice(0, 3).map((s) => s.answer) },
          },
        },
      }),
    );
    render(<Skills courseId="b11" />);
    expect(
      document.querySelectorAll(
        "#exercise .business-tables table:last-child [data-slot]",
      ),
    ).toHaveLength(8);
    expect(document.querySelectorAll("#exercise [data-slot]")).toHaveLength(9);
    click("#check-button");
    expect(document.querySelector("#feedback")).toHaveTextContent(
      "还有空位未填写",
    );
    expect(
      readStore("zhilian-skills-v1").b11.draftsByMode[mode][q.id].slice(0, 3),
    ).toEqual(q.slots.slice(0, 3).map((s) => s.answer));
  },
);
