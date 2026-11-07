import React from "react";
import { test, expect } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Skills from "../src/SkillsPage";
import { courses, readStore } from "../src/model";
import { coverage, check } from "../src/matcher";
function start(mode, index = 0) {
  localStorage.setItem(
    "zhilian-skills-v1",
    JSON.stringify({ b3: { mode, index } }),
  );
  render(<Skills courseId="b3" />);
}
test.each(["pick", "type"])(
  "B3 %s starts with application and rules tables before the collaboration diagram",
  (mode) => {
    for (let index = 0; index < courses.b3.steps.length; index++) {
      start(mode, index);
      const q = courses.b3.steps[index];
      if (index === 5) {
        expect(
          document.querySelector("#exercise .flow-practice"),
        ).not.toBeNull();
      } else {
        expect(
          document.querySelector("#exercise .answer-tables table"),
        ).not.toBeNull();
        expect(document.querySelector("#exercise .flow-practice")).toBeNull();
        expect(document.querySelectorAll("#exercise [data-slot]")).toHaveLength(
          q.slots.length,
        );
        for (let i = 0; i < q.slots.length; i++) {
          if (mode === "type") {
            fireEvent.change(
              document.querySelector(`#exercise [data-slot="${i}"]`),
              { target: { value: q.slots[i].answer } },
            );
          } else {
            fireEvent.click(document.querySelector(`[data-slot="${i}"]`));
            fireEvent.click(
              [...document.querySelectorAll("[data-choice]")].find(
                (b) => b.dataset.choice === q.slots[i].answer,
              ),
            );
          }
        }
        fireEvent.click(document.querySelector("#check-button"));
        expect(readStore("zhilian-skills-v1").b3.records[q.id].correct).toBe(
          true,
        );
      }
      cleanup();
    }
  },
);
test("B3 original answers put two editable tables before the diagram and retain task two tables and saved drafts", () => {
  start("original");
  expect(
    document.querySelectorAll("#written-b3t1 .answer-tables table"),
  ).toHaveLength(2);
  expect(
    document.querySelectorAll("#written-b3t2 .answer-tables table"),
  ).toHaveLength(4);
  const table = document.querySelector("#written-b3t1 .answer-tables");
  const flow = document.querySelector("#written-b3t1 .flow-practice");
  expect(
    table.compareDocumentPosition(flow) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  const field = table.querySelector("[data-answer-cell]");
  fireEvent.change(field, { target: { value: "仪表离线发现慢" } });
  const drafts = readStore("zhilian-skills-v1").b3.businessDrafts;
  expect(Object.values(drafts.b3t1)).toContain("仪表离线发现慢");
  cleanup();
  render(<Skills courseId="b3" />);
  expect(document.querySelector("[data-answer-cell]")).toHaveValue(
    "仪表离线发现慢",
  );
  fireEvent.click(document.querySelector("#reset-practice"));
  expect(document.querySelector("[data-answer-cell]")).toHaveValue("");
});

test("B3 reference table cells and diagram cover the full written task requirements", () => {
  for (const [index, task] of courses.b3.tasks.entries()) {
    const text =
      task.answerTables.flatMap((table) => table.rows.flat()).join("\n") +
      (task.flowchart
        ? task.flowchart.slots.map((s) => s.answer).join("\n")
        : "");
    const missing = coverage(courses.b3, index, text).filter(
      (point) => point.status !== "covered",
    );
    expect(missing).toEqual([]);
  }
});

test("B3 complete table and flow entries are checked per task without requiring provided period fields", () => {
  start("original");
  for (const task of courses.b3.tasks) {
    for (const field of document.querySelectorAll(
      `#written-${task.id} [data-answer-cell]`,
    )) {
      const [g, r, c] = field.dataset.answerCell.split("-").map(Number);
      fireEvent.change(field, {
        target: { value: task.answerTables[g].rows[r][c] },
      });
    }
    for (const field of document.querySelectorAll(
      `[data-flow-task="${task.id}"]`,
    )) {
      fireEvent.change(field, {
        target: {
          value: task.flowchart.slots[Number(field.dataset.flowSlot)].answer,
        },
      });
    }
    fireEvent.click(document.querySelector(`[data-check-task="${task.id}"]`));
    expect(
      document.querySelector(`#coverage-${task.id}`),
    ).not.toHaveTextContent("待自检");
  }
});

test("B3 follows the sample scope and teacher staffing without added acceptance work", () => {
  const task = courses.b3.tasks[1];
  expect(task.answerTables[2].rows.map((row) => row[0])).toEqual([
    "智能系统",
    "工作人员",
  ]);
  expect(task.answerTables[3].rows).toHaveLength(3);
  expect(task.answerTables[1].rows.map((row) => row[4])).toEqual([
    "IoT 集成工程师、人工智能训练师、能源管理员",
    "人工智能训练师、能源管理员、值班运维",
    "项目经理、能源管理员、人工智能训练师",
  ]);
  expect(JSON.stringify(task)).not.toMatch(
    /完整可比账单周期|幂等|灰度发布|电费及季节表现验收/,
  );
  expect(courses.b3.steps[8].solution).not.toMatch(
    /有效实测数据点|首次成功调节反馈/,
  );
  expect(courses.b3.steps[9].solution).not.toMatch(
    /完整可比账单周期|幂等|灰度发布/,
  );
});

test("B3 follows the teacher's alternative of retraining OR manual correction", () => {
  const slot = courses.b3.steps[9].slots[0];
  expect(check(slot, "季节变化时进行模型再训练").status).toBe("covered");
  expect(check(slot, "业态变化时进行人工修正").status).toBe("covered");
});
