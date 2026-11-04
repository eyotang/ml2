import React from "react";
import { test, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import Skills from "../src/SkillsPage";
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
test("original flowchart horizontal position survives mode switches; step navigation keeps its normal top-of-page behavior", () => {
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
  fireEvent.click(screen.getByRole("button", { name: "下一步 →" }));
  expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
});
