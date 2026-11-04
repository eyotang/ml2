import React from "react";
import { test, expect, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Skills from "../src/SkillsPage";
import { courses, readStore } from "../src/model";
import { validateJSON } from "../src/JsonFeedback";
const click = (selector) => fireEvent.click(document.querySelector(selector));
const fill = (selector, value) =>
  fireEvent.change(document.querySelector(selector), { target: { value } });
const saved = (id) => readStore("zhilian-skills-v1")[id];
function start(id, extra = {}) {
  localStorage.setItem(
    "zhilian-skills-v1",
    JSON.stringify({ [id]: { answerSchema: 2, mode: "original", ...extra } }),
  );
  return render(<Skills courseId={id} />);
}
test.each(Object.keys(courses))(
  "%s checks each original task independently, preserves drafts and resets checks",
  (id) => {
    const tasks = courses[id].tasks || [];
    start(id);
    expect(document.querySelectorAll("[data-check-task]")).toHaveLength(
      tasks.length + (courses[id].kind === "case" ? 0 : 1),
    );
    if (courses[id].kind !== "case") {
      click('[data-check-task="code"]');
      expect(document.querySelector(".solution")).toBeTruthy();
      expect(document.querySelectorAll(".case-solution")).toHaveLength(0);
    }
    if (tasks.length) {
      const first = tasks[0].id;
      fill(`[data-task="${first}"]`, "独立答案");
      click(`[data-check-task="${first}"]`);
      expect(document.querySelectorAll(".case-solution")).toHaveLength(1);
      expect(
        document.querySelector(`#written-${first} .case-solution`),
      ).toBeTruthy();
      expect(saved(id).caseDrafts[first]).toBe("独立答案");
      cleanup();
      render(<Skills courseId={id} />);
      expect(document.querySelectorAll(".case-solution")).toHaveLength(1);
    }
    click("#check-button");
    expect(document.querySelectorAll(".case-solution")).toHaveLength(
      tasks.length,
    );
    click("#reset-practice");
    expect(saved(id).taskChecks).toEqual({});
    expect(document.querySelectorAll(".case-solution")).toHaveLength(0);
  },
);
test("JSON auto validation, persistence and original reset are independent of task checking", () => {
  start("c");
  const editor = '[data-json-task="ct2"]';
  expect(document.querySelector("#json-feedback-ct2")).toHaveAttribute(
    "data-json-status",
    "empty",
  );
  fill(editor, '{\n "a": true,\n}');
  expect(document.querySelector(editor)).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(document.querySelector("#json-feedback-ct2")).toHaveTextContent(
    "JSON 格式错误",
  );
  expect(document.querySelectorAll(".case-solution")).toHaveLength(0);
  const valid =
    '{"forecast_window_minutes":15,"risk_threshold":0.85,"queue_wait_threshold_minutes":10,"manual_confirm_required":true}';
  fill(editor, valid);
  expect(document.querySelector("#json-feedback-ct2")).toHaveAttribute(
    "data-json-status",
    "valid",
  );
  click('[data-check-task="ct2"]');
  expect(document.querySelectorAll(".case-solution")).toHaveLength(1);
  cleanup();
  render(<Skills courseId="c" />);
  expect(document.querySelector(editor)).toHaveValue(valid);
  vi.mocked(window.confirm).mockReturnValueOnce(false);
  click("#reset-practice");
  expect(saved("c").jsonDrafts.ct2).toBe(valid);
  click("#reset-practice");
  expect(saved("c").jsonDrafts).toEqual({});
});
test("JSON completion auto validates the assembled document without changing answer matching", () => {
  const index = courses.c.steps.findIndex((q) => q.title.includes("JSON"));
  start("c", { mode: "type", index });
  expect(document.querySelector("[data-json-status]")).toHaveAttribute(
    "data-json-status",
    "empty",
  );
  fill('[data-slot="0"]', "15");
  fill('[data-slot="1"]', "True");
  expect(document.querySelector("[data-json-status]")).toHaveAttribute(
    "data-json-status",
    "invalid",
  );
  fill('[data-slot="1"]', "true");
  expect(document.querySelector("[data-json-status]")).toHaveAttribute(
    "data-json-status",
    "valid",
  );
});
test.each(['{"a":true}', '[1,null,"中文"]', "{}"])(
  "valid strict JSON %s",
  (value) => expect(validateJSON(value).status).toBe("valid"),
);
test.each(["{'a':1}", '{"a":True}', '{"a":1,}', "{/*注释*/}", '{\n "a":'])(
  "invalid strict JSON %s",
  (value) => expect(validateJSON(value).status).toBe("invalid"),
);
test("JSON error location remains available when the browser omits parser positions", () => {
  const parse = vi.spyOn(JSON, "parse").mockImplementationOnce(() => {
    throw new SyntaxError("Unexpected token 'T', is not valid JSON");
  });
  expect(validateJSON('{\n  "enabled": True\n}').message).toContain(
    "第 2 行，第 14 列",
  );
  parse.mockRestore();
});
