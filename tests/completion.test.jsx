import React from "react";
import { test, expect, vi } from "vitest";
import { render, fireEvent, screen, act } from "@testing-library/react";
import { collectEdits, persistEdits } from "../src/persistence";
import {
  theoryState,
  courseState,
  questions,
  courses,
  questionRevision,
  revision,
  reconcileTheory,
  reconcileCourse,
  readStore,
  resetMode,
} from "../src/model";
import { useSavedState } from "../src/shared";
import fs from "node:fs";
import vm from "node:vm";
test("stale tabs merge independent theory answers, favorites and same-course slots; reset cannot revive old records", () => {
  const a = theoryState(),
    b = theoryState();
  persistEdits(
    "zhilian-v1",
    a,
    collectEdits(a, (n) => {
      n.records[0] = { selected: [0] };
      n.favorites = [0];
    }).edits,
  );
  persistEdits(
    "zhilian-v1",
    b,
    collectEdits(b, (n) => {
      n.records[1] = { selected: [1] };
      n.favorites = [1];
    }).edits,
  );
  expect(Object.keys(readStore("zhilian-v1").records)).toEqual(["0", "1"]);
  expect(readStore("zhilian-v1").favorites).toEqual([0, 1]);
  persistEdits(
    "zhilian-v1",
    a,
    collectEdits(a, (n) => {
      n.records = {};
    }).edits,
  );
  persistEdits(
    "zhilian-v1",
    b,
    collectEdits(b, (n) => {
      n.current = 3;
    }).edits,
  );
  expect(readStore("zhilian-v1").records).toEqual({});
  const id = "b12",
    p = courseState(id),
    q = structuredClone(p);
  p.draftsByMode.type["b12-1"] = ["", ""];
  q.draftsByMode.type["b12-1"] = ["", ""];
  persistEdits(
    "zhilian-skills-v1",
    p,
    collectEdits(p, (n) => {
      n.draftsByMode.type["b12-1"][0] = "first";
    }).edits,
    id,
  );
  persistEdits(
    "zhilian-skills-v1",
    q,
    collectEdits(q, (n) => {
      n.draftsByMode.type["b12-1"][1] = "second";
    }).edits,
    id,
  );
  expect(readStore("zhilian-skills-v1").b12.draftsByMode.type["b12-1"]).toEqual(
    ["first", "second"],
  );
});
test("locked async commits preserve rapid edits and synchronize another tab without changing its navigation", async () => {
  const queue = [];
  vi.stubGlobal("navigator", {
    locks: {
      request: vi.fn(
        (_, fn) => new Promise((resolve) => queue.push(() => resolve(fn()))),
      ),
    },
  });
  function Demo() {
    const [s, update, version] = useSavedState("zhilian-v1", () =>
      theoryState(),
    );
    return (
      <>
        <button
          onClick={() =>
            update((n) => {
              n.drafts[77] = (n.drafts[77] || "") + "x";
            })
          }
        >
          edit
        </button>
        <output>
          {s.drafts[77]}:{s.current}:{version}
        </output>
      </>
    );
  }
  render(<Demo />);
  fireEvent.click(screen.getByText("edit"));
  fireEvent.click(screen.getByText("edit"));
  await act(async () => {
    while (queue.length) queue.shift()();
  });
  expect(readStore("zhilian-v1").drafts[77]).toBe("xx");
  const stored = readStore("zhilian-v1");
  stored.current = 25;
  stored.drafts[77] = "other";
  localStorage.setItem("zhilian-v1", JSON.stringify(stored));
  act(() =>
    window.dispatchEvent(new StorageEvent("storage", { key: "zhilian-v1" })),
  );
  expect(screen.getByRole("status")).toHaveTextContent("other:0:1");
});
test("answer-only releases regrade theory and skill records; stem changes require a new answer and preserve previous work", () => {
  const q = questions[0],
    s = theoryState("", {
      records: {
        0: {
          selected: q.answer,
          correct: false,
          questionRevision: questionRevision(q),
          answerRevision: "old",
        },
      },
      favorites: [0],
    });
  expect(s.records[0].correct).toBe(true);
  s.records[0].questionRevision = "older-stem";
  reconcileTheory(s);
  expect(s.records[0]).toMatchObject({
    stale: true,
    previousResult: { selected: q.answer, correct: true },
  });
  expect(s.records[0].correct).toBeUndefined();
  expect(s.favorites).toEqual([0]);
  const c = courses.b12,
    p = courseState("b12"),
    step = c.steps[0];
  p.records[step.id] = {
    lastCheckedMode: "type",
    modeAnswers: {
      type: { values: step.slots.map((s) => s.answer), matches: [false] },
    },
  };
  reconcileCourse(p, c);
  expect(p.records[step.id].correct).toBe(true);
  resetMode(p, "type");
  expect(() => reconcileCourse(p, c)).not.toThrow();
});
test("B1-2 charts use actual teacher aggregate columns and preserve existing IDs and notebook teacher code", () => {
  const c = courses.b12;
  expect(c.count).toBe(14);
  expect(c.steps.slice(7, 9).map((s) => s.id)).toEqual(["b12-13", "b12-14"]);
  expect(courseState("b12", { index: 7 }).stepId).toBe("b12-8");
  expect(c.visualizationCode).toContain("slot_summary['爽约率']");
  expect(c.visualizationCode).toContain("room_summary['平均座位利用率']");
  expect(c.visualizationCode).toContain("room_summary['room_id']");
  const nb = JSON.parse(
    fs.readFileSync("public/materials/b12-visualization.ipynb"),
  );
  expect(nb.cells[1].source.join("")).toBe(c.referenceCode);
  expect(nb.cells[2].source.join("")).toBe(c.visualizationCode);
});
test("static release discovery offers update without reloading or deleting learning data; offline is tolerated", async () => {
  document.documentElement.dataset.appVersion = "aaaaaaaaaaaaaaaa";
  localStorage.setItem("zhilian-v1", '{"drafts":{"77":"keep"}}');
  const response = {
      ok: true,
      json: async () => ({ version: "bbbbbbbbbbbbbbbb" }),
    },
    fetch = vi.fn(async () => response),
    replace = vi.fn();
  vm.runInNewContext(fs.readFileSync("public/update-check.js", "utf8"), {
    document,
    window,
    fetch,
    location: {
      href: "https://example.com/skills.html?course=b2#work",
      replace,
    },
    URL,
    Date,
    setInterval: vi.fn(),
  });
  await act(async () => {
    document.dispatchEvent(new Event("DOMContentLoaded"));
    await Promise.resolve();
  });
  expect(document.getElementById("release-update")).not.toBeNull();
  expect(replace).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("更新题目"));
  expect(replace).toHaveBeenCalledWith(
    "https://example.com/skills.html?course=b2&_v=bbbbbbbbbbbbbbbb#work",
  );
  expect(readStore("zhilian-v1").drafts[77]).toBe("keep");
  document.getElementById("release-update").remove();
  fetch.mockRejectedValue(new Error("offline"));
  await act(async () => window.dispatchEvent(new Event("pageshow")));
  expect(document.getElementById("release-update")).toBeNull();
});
test("temporary storage failure preserves unsaved edits until a later save succeeds", () => {
  const write = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("full");
    });
  function Demo() {
    const [s, update] = useSavedState("zhilian-v1", () => theoryState());
    return (
      <>
        <button
          onClick={() =>
            update((n) => {
              n.drafts[77] = "first";
            })
          }
        >
          first
        </button>
        <button
          onClick={() =>
            update((n) => {
              n.drafts[78] = "second";
            })
          }
        >
          second
        </button>
        <output>{JSON.stringify(s.drafts)}</output>
      </>
    );
  }
  render(<Demo />);
  fireEvent.click(screen.getByText("first"));
  write.mockRestore();
  fireEvent.click(screen.getByText("second"));
  expect(readStore("zhilian-v1").drafts).toMatchObject({
    77: "first",
    78: "second",
  });
});
