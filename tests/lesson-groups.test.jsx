import React from "react";
import { test, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { courses, readStore } from "../src/model";
import { groupLessons } from "../src/lesson-groups";
import Skills from "../src/SkillsPage";
test.each([
  ["b2", [6, 11, 2]],
  ["b12", [9, 2, 3]],
  ["b11", [2, 4, 2]],
  ["b3", [6, 4]],
  ["b4", [1, 2, 2]],
  ["c", [3, 4, 5]],
])("%s groups every step once, in the sample task order", (id, counts) => {
  const course = courses[id],
    before = JSON.stringify(course),
    groups = groupLessons(course);
  expect(groups.map((g) => g.steps.length)).toEqual(counts);
  expect(groups.flatMap((g) => g.steps.map((q) => q.step.id))).toEqual(
    course.steps.map((q) => q.id),
  );
  expect(JSON.stringify(course)).toBe(before);
});
test("B2 task shortcuts jump to the correct steps, retain typed mode and drafts, and individual directory rows remain selectable", () => {
  localStorage.setItem(
    "zhilian-skills-v1",
    JSON.stringify({
      b2: {
        mode: "type",
        draftsByMode: { type: { "b2-1": ["saved"] }, pick: {} },
      },
    }),
  );
  render(<Skills courseId="b2" />);
  fireEvent.click(document.querySelector("#lesson-map"));
  expect(
    screen.getByRole("navigation", { name: "任务快速切换" }),
  ).toBeVisible();
  expect(document.querySelectorAll("[data-lesson]")).toHaveLength(19);
  fireEvent.click(document.querySelector('[data-task-jump="1"]'));
  expect(readStore("zhilian-skills-v1").b2).toMatchObject({
    mode: "type",
    index: 6,
    stepId: "b2-7",
  });
  expect(document.querySelector("#step-count")).toHaveTextContent("任务二");
  expect(document.querySelector("#lesson-dialog").open).toBe(false);
  fireEvent.click(document.querySelector("#lesson-map"));
  fireEvent.click(document.querySelector('[data-task-jump="2"]'));
  expect(readStore("zhilian-skills-v1").b2.stepId).toBe("b2-18");
  fireEvent.click(document.querySelector("#lesson-map"));
  fireEvent.click(document.querySelector('[data-lesson="3"]'));
  expect(readStore("zhilian-skills-v1").b2.stepId).toBe("b2-4");
  expect(readStore("zhilian-skills-v1").b2.draftsByMode.type["b2-1"]).toEqual([
    "saved",
  ]);
});

test("jumping from original through the task directory preserves its reading position on return", () => {
  localStorage.setItem(
    "zhilian-skills-v1",
    JSON.stringify({ b2: { mode: "original" } }),
  );
  render(<Skills courseId="b2" />);
  vi.spyOn(window, "scrollY", "get").mockReturnValue(900);
  fireEvent.click(document.querySelector("#lesson-map"));
  fireEvent.click(document.querySelector('[data-task-jump="1"]'));
  expect(readStore("zhilian-skills-v1").b2.stepId).toBe("b2-7");
  fireEvent.click(document.querySelector('[data-mode="original"]'));
  expect(window.scrollTo).toHaveBeenLastCalledWith({
    left: 0,
    top: 900,
    behavior: "instant",
  });
});
