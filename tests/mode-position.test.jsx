import React from "react";
import { test, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import Skills from "../src/SkillsPage";
import { courses } from "../src/model";
const switchMode = (mode) =>
  fireEvent.click(document.querySelector(`[data-mode="${mode}"]`));
test("each mode restores its document position, editor scroll and selection, and open reference content", () => {
  render(<Skills courseId="b2" />);
  switchMode("original");
  const editor = document.querySelector(".original-editor");
  editor.scrollTop = 240;
  editor.scrollLeft = 65;
  editor.setSelectionRange(10, 18);
  fireEvent.click(document.querySelector("#check-button"));
  const details = document.querySelector(".website-reference");
  if (details) details.open = true;
  vi.spyOn(window, "scrollY", "get").mockReturnValue(1750);
  switchMode("pick");
  expect(window.scrollTo).toHaveBeenLastCalledWith({
    left: 0,
    top: 0,
    behavior: "instant",
  });
  vi.spyOn(window, "scrollY", "get").mockReturnValue(330);
  switchMode("original");
  expect(window.scrollTo).toHaveBeenLastCalledWith({
    left: 0,
    top: 1750,
    behavior: "instant",
  });
  const restored = document.querySelector(".original-editor");
  expect(restored.scrollTop).toBe(240);
  expect(restored.scrollLeft).toBe(65);
  expect(restored.selectionStart).toBe(10);
  expect(restored.selectionEnd).toBe(18);
  expect(document.querySelector(".solution")).not.toBeNull();
  if (details)
    expect(document.querySelector(".website-reference").open).toBe(true);
  switchMode("pick");
  expect(window.scrollTo).toHaveBeenLastCalledWith({
    left: 0,
    top: 330,
    behavior: "instant",
  });
  const calls = window.scrollTo.mock.calls.length;
  switchMode("pick");
  expect(window.scrollTo).toHaveBeenCalledTimes(calls);
});
test("original flowchart horizontal position survives mode switches; side navigation positions the next exercise below the sticky header", () => {
  render(<Skills courseId="b11" />);
  switchMode("original");
  const chart = document.querySelector(".flow-practice .flow-scroll");
  chart.scrollLeft = 210;
  vi.spyOn(window, "scrollY", "get").mockReturnValue(1200);
  switchMode("type");
  switchMode("original");
  expect(document.querySelector(".flow-practice .flow-scroll").scrollLeft).toBe(
    210,
  );
  expect(window.scrollTo).toHaveBeenLastCalledWith({
    left: 0,
    top: 1200,
    behavior: "instant",
  });
  switchMode("type");
  fireEvent.click(screen.getByRole("button", { name: "下一步" }));
  expect(window.scrollTo).toHaveBeenLastCalledWith({
    left: 0,
    top: 1188,
    behavior: "instant",
  });
});

test.each(["pick", "type"])(
  "continuing in %s positions the new question below the mode bar",
  (mode) => {
    render(<Skills courseId="b11" />);
    switchMode(mode);
    for (const [
      index,
      { answer: value },
    ] of courses.b11.steps[0].slots.entries()) {
      const blank = document.querySelector(`#exercise [data-slot="${index}"]`);
      if (mode === "type") fireEvent.change(blank, { target: { value } });
      else {
        fireEvent.click(blank);
        fireEvent.click(
          [...document.querySelectorAll("[data-choice]")].find(
            (button) => button.dataset.choice === value,
          ),
        );
      }
    }
    fireEvent.click(document.querySelector("#check-button"));
    expect(document.querySelector("#next-button")).toBeVisible();
    vi.spyOn(window, "scrollY", "get").mockReturnValue(650);
    vi.spyOn(
      document.querySelector("#exercise"),
      "getBoundingClientRect",
    ).mockReturnValue({ top: -400 });
    vi.spyOn(
      document.querySelector(".practice-header"),
      "getBoundingClientRect",
    ).mockReturnValue({ height: 60 });
    fireEvent.click(document.querySelector("#next-button"));
    expect(document.querySelector("#exercise h1")).toHaveTextContent(
      "人机边界与追溯记录",
    );
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      left: 0,
      top: 178,
      behavior: "instant",
    });
  },
);
