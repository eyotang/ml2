import React from "react";
import { test, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import fs from "node:fs";
import vm from "node:vm";
import ThemeControl, { THEME_KEY } from "../src/ThemeControl";
import Home from "../src/Home";
import Theory from "../src/TheoryPage";
import Skills from "../src/SkillsPage";
function systemTheme(dark = false) {
  const media = {
    matches: dark,
    addEventListener: vi.fn((_, f) => {
      media.listener = f;
    }),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => media),
  );
  return media;
}
function choose(value) {
  fireEvent.change(screen.getByRole("combobox", { name: "颜色主题" }), {
    target: { value },
  });
}
test("first visit follows system, live changes apply, explicit choice stays independent and system can be restored", () => {
  const media = systemTheme(false);
  render(<ThemeControl />);
  expect(screen.getByRole("combobox")).toHaveValue("system");
  expect(document.documentElement.dataset.theme).toBe("light");
  act(() => {
    media.matches = true;
    media.listener();
  });
  expect(document.documentElement.dataset.theme).toBe("dark");
  choose("light");
  expect(document.documentElement.dataset.theme).toBe("light");
  act(() => media.listener());
  expect(document.documentElement.dataset.theme).toBe("light");
  choose("dark");
  act(() => {
    media.matches = false;
    media.listener();
  });
  expect(document.documentElement.dataset.theme).toBe("dark");
  choose("system");
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(localStorage.getItem(THEME_KEY)).toBe("system");
});
test.each(["light", "dark", "system"])(
  "saved %s preference restores on reload and never changes answer records",
  (mode) => {
    systemTheme(true);
    const records = {
        records: { 0: { correct: true } },
        favorites: [1],
        drafts: { 80: "我的答案" },
      },
      skills = { b2: { originalDraft: "print(1)", records: {} } };
    localStorage.setItem("zhilian-v1", JSON.stringify(records));
    localStorage.setItem("zhilian-skills-v1", JSON.stringify(skills));
    render(<ThemeControl />);
    choose(mode);
    cleanup();
    render(<ThemeControl />);
    expect(screen.getByRole("combobox")).toHaveValue(mode);
    expect(document.documentElement.dataset.theme).toBe(
      mode === "system" ? "dark" : mode,
    );
    expect(JSON.parse(localStorage.getItem("zhilian-v1"))).toEqual(records);
    expect(JSON.parse(localStorage.getItem("zhilian-skills-v1"))).toEqual(
      skills,
    );
  },
);
test("another tab and back/forward page restoration synchronize the selected theme and listeners are cleaned up", () => {
  const media = systemTheme(false);
  render(<ThemeControl />);
  localStorage.setItem(THEME_KEY, "dark");
  act(() =>
    window.dispatchEvent(
      new StorageEvent("storage", { key: THEME_KEY, newValue: "dark" }),
    ),
  );
  expect(screen.getByRole("combobox")).toHaveValue("dark");
  expect(document.documentElement.dataset.theme).toBe("dark");
  localStorage.setItem(THEME_KEY, "light");
  act(() => window.dispatchEvent(new Event("pageshow")));
  expect(document.documentElement.dataset.theme).toBe("light");
  cleanup();
  expect(media.removeEventListener).toHaveBeenCalledWith(
    "change",
    media.listener,
  );
});
test("invalid preferences fall back to system; unavailable storage still allows switching on this page", () => {
  const media = systemTheme(true);
  localStorage.setItem(THEME_KEY, "invalid");
  render(<ThemeControl />);
  expect(screen.getByRole("combobox")).toHaveValue("system");
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("storage unavailable");
  });
  choose("light");
  act(() => media.listener());
  expect(document.documentElement.dataset.theme).toBe("light");
});
test.each([
  ["home", <Home />],
  ["theory", <Theory />],
  ...["b11", "b12", "b2", "b3", "b4", "c"].map((id) => [
    id,
    <Skills courseId={id} />,
  ]),
])("%s inherits the home theme; only home exposes the selector", (id, page) => {
  const media = systemTheme(false);
  localStorage.setItem(THEME_KEY, "dark");
  render(page);
  expect(document.documentElement.dataset.theme).toBe("dark");
  const selector = screen.queryByRole("combobox", { name: "颜色主题" });
  if (id === "home") {
    expect(selector).toHaveValue("dark");
    choose("light");
  } else {
    expect(selector).toBeNull();
    localStorage.setItem(THEME_KEY, "light");
    act(() =>
      window.dispatchEvent(new StorageEvent("storage", { key: THEME_KEY })),
    );
  }
  expect(document.documentElement.dataset.theme).toBe("light");
  localStorage.setItem(THEME_KEY, "system");
  act(() =>
    window.dispatchEvent(new StorageEvent("storage", { key: THEME_KEY })),
  );
  media.matches = true;
  act(() => media.listener());
  expect(document.documentElement.dataset.theme).toBe("dark");
});
test("pre-paint bootstrap agrees with the React theme settings on every HTML entry", () => {
  const source = fs.readFileSync("public/theme-init.js", "utf8");
  for (const page of ["index.html", "theory.html", "skills.html"]) {
    const html = fs.readFileSync(page, "utf8");
    expect(html).toContain('src="./theme-init.js"');
    expect(html.indexOf("theme-init.js")).toBeLessThan(html.indexOf("</head>"));
  }
  for (const value of [null, "system", "light", "dark", "invalid"])
    for (const dark of [true, false]) {
      const meta = { setAttribute: vi.fn() },
        root = { dataset: {}, style: {} };
      vm.runInNewContext(source, {
        localStorage: { getItem: () => value },
        matchMedia: () => ({ matches: dark }),
        document: { documentElement: root, querySelector: () => meta },
      });
      expect(root.dataset.theme).toBe(
        value === "dark" || (!["light", "dark"].includes(value) && dark)
          ? "dark"
          : "light",
      );
      expect(meta.setAttribute).toHaveBeenCalled();
    }
  const root = { dataset: {}, style: {} };
  vm.runInNewContext(source, {
    localStorage: {
      getItem() {
        throw new Error("blocked");
      },
    },
    matchMedia: () => ({ matches: true }),
    document: { documentElement: root, querySelector: () => null },
  });
  expect(root.dataset.theme).toBe("dark");
});
