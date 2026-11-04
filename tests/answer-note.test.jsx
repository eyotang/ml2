import React from "react";
import { test, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { theoryNotes, taskNotes } from "../src/AnswerNote";
import { questions, courses } from "../src/model";
import Skills from "../src/SkillsPage";
import Theory from "../src/TheoryPage";
test("all six theory essays and fourteen original written tasks have concise, specific teaching notes", () => {
  expect(Object.keys(theoryNotes)).toEqual(
    questions.filter((q) => q.type === 3).map((q) => String(q.id)),
  );
  const tasks = Object.values(courses).flatMap((c) => c.tasks || []);
  expect(Object.keys(taskNotes).sort()).toEqual(tasks.map((t) => t.id).sort());
  for (const note of [
    ...Object.values(theoryNotes),
    ...Object.values(taskNotes),
  ]) {
    expect(note).toHaveLength(3);
    for (const paragraph of note) {
      expect(paragraph.length).toBeGreaterThan(15);
      expect(paragraph.length).toBeLessThan(100);
    }
  }
});
test("theory essay explanation appears with reference points after submitting, preserving the draft", () => {
  localStorage.setItem(
    "zhilian-v1",
    JSON.stringify({ current: 77, mode: "answer" }),
  );
  render(<Theory />);
  expect(screen.queryByRole("region", { name: "答案说明" })).toBeNull();
  fireEvent.change(screen.getByRole("textbox", { name: "简答题答案" }), {
    target: { value: "我的方案" },
  });
  fireEvent.click(document.querySelector("#submit"));
  expect(screen.getByRole("region", { name: "答案说明" })).toHaveTextContent(
    theoryNotes[77][1],
  );
  expect(screen.getByRole("textbox", { name: "简答题答案" })).toHaveValue(
    "我的方案",
  );
});
test("B2 original-task note appears only when checking the reference answer", () => {
  localStorage.setItem(
    "zhilian-skills-v1",
    JSON.stringify({ b2: { mode: "original" } }),
  );
  render(<Skills courseId="b2" />);
  expect(screen.queryByRole("region", { name: "答案说明" })).toBeNull();
  fireEvent.click(document.querySelector("#check-button"));
  expect(screen.getByRole("region", { name: "答案说明" })).toHaveTextContent(
    taskNotes.b2t3[1],
  );
  expect(screen.getByRole("region", { name: "答案说明" })).toHaveTextContent(
    "漏报",
  );
});
