import "@testing-library/jest-dom/vitest";
import data from "../src/generated/data.json";
import { courses } from "../src/model";
// Test every authored course; production loads just the selected one.
Object.assign(courses, data.courses);
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    })),
  );
  window.scrollTo = vi.fn();
  vi.spyOn(window, "confirm").mockReturnValue(true);
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
  Element.prototype.getAnimations = () => [];
  Element.prototype.animate = () => ({
    finished: Promise.resolve(),
    cancel() {},
  });
  window.history.replaceState(null, "", "/");
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
