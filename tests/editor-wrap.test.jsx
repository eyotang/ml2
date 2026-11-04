import React from "react";
import { test, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import PythonEditor from "../src/PythonEditor";
import Skills from "../src/SkillsPage";
import Theory from "../src/TheoryPage";
test("soft wrapping keeps source unchanged and aligns logical line numbers with measured wrapped rows, including resize", () => {
  let resized;
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(fn) {
        resized = fn;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(220);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function () {
      return {
        height: this.parentElement?.classList.contains("editor-measure")
          ? this.textContent.length > 30
            ? 69
            : 23
          : 0,
      };
    },
  );
  const ref = React.createRef(),
    code = "# long comment ".repeat(20) + '\nprint("中文")\n';
  render(<PythonEditor value={code} onChange={() => {}} editorRef={ref} />);
  expect(ref.current).toHaveAttribute("wrap", "soft");
  expect(ref.current.value).toBe(code);
  expect(
    [...document.querySelectorAll(".editor-gutter span")].map(
      (el) => el.style.height,
    ),
  ).toEqual(["69px", "23px", "23px"]);
  expect(document.querySelector(".editor-syntax").style.width).toBe("220px");
  expect(document.querySelector(".editor-measure").textContent).toContain(
    "中文",
  );
  fireEvent.scroll(ref.current, { target: { scrollTop: 69 } });
  expect(document.querySelector(".editor-gutter pre").style.transform).toBe(
    "translateY(-69px)",
  );
  expect(resized).toBeTypeOf("function");
});
test.each(["b11", "b12", "b2", "b3", "b4", "c"])(
  "%s has no personal-answer export controls; reference downloads remain",
  (id) => {
    render(<Skills courseId={id} />);
    fireEvent.click(document.querySelector('[data-mode="original"]'));
    expect(document.querySelector(".export-tools")).toBeNull();
    expect(document.body.textContent).not.toContain("导出我的答案");
    expect(document.querySelector("#reference-download")).not.toBeNull();
  },
);
test("theory answer card no longer offers personal-answer export", () => {
  render(<Theory />);
  expect(document.body.textContent).not.toContain("导出答案");
  expect(document.querySelector("#reset-all")).not.toBeNull();
});
