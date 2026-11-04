import React from "react";
import { test, expect } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import Theory from "../src/TheoryPage";
import { readStore } from "../src/model";
async function swipe(node, dx = -120, dy = 2) {
  fireEvent.touchStart(node, { touches: [{ clientX: 260, clientY: 650 }] });
  fireEvent.touchMove(node, {
    touches: [{ clientX: 260 + dx, clientY: 650 + dy }],
  });
  await act(async () =>
    fireEvent.touchEnd(node, {
      touches: [],
      changedTouches: [{ clientX: 260 + dx, clientY: 650 + dy }],
    }),
  );
}
function open() {
  localStorage.setItem(
    "zhilian-v1",
    JSON.stringify({ current: 0, auto: false, autoJumpVersion: 1 }),
  );
  render(<Theory />);
}
test("swiping the blank practice surface moves only the card and switches within the current question list", async () => {
  open();
  const surface = document.querySelector("main"),
    card = document.querySelector("#question-card");
  fireEvent.touchStart(surface, { touches: [{ clientX: 260, clientY: 650 }] });
  fireEvent.touchMove(surface, { touches: [{ clientX: 140, clientY: 652 }] });
  expect(card.style.transform).toBe("translateX(-120px)");
  expect(surface.style.transform).toBe("");
  await act(async () =>
    fireEvent.touchEnd(surface, {
      touches: [],
      changedTouches: [{ clientX: 140, clientY: 652 }],
    }),
  );
  expect(readStore("zhilian-v1").current).toBe(1);
  await swipe(surface, 120);
  expect(readStore("zhilian-v1").current).toBe(0);
});
test("toolbar, answer card and text entry do not turn questions; ordinary controls still work after a swipe", async () => {
  open();
  await swipe(document.querySelector(".mode-switch"));
  expect(readStore("zhilian-v1").current).toBe(0);
  await swipe(document.querySelector("main"));
  fireEvent.click(document.querySelector("#open-map"));
  expect(document.querySelector("#map-panel")).toHaveClass("open");
  await swipe(document.querySelector("main"));
  expect(readStore("zhilian-v1").current).toBe(1);
  fireEvent.click(document.querySelector("#close-map"));
  fireEvent.click(document.querySelector('[data-type="3"]'));
  const textarea = document.querySelector("#short-answer");
  await swipe(textarea);
  expect(readStore("zhilian-v1").current).toBe(77);
  fireEvent.change(textarea, { target: { value: "草稿保留" } });
  expect(readStore("zhilian-v1").drafts[77]).toBe("草稿保留");
});
test("vertical scrolling and cancelled gestures on the blank surface do not switch questions", async () => {
  open();
  const surface = document.querySelector("main");
  await swipe(surface, 10, 140);
  expect(readStore("zhilian-v1").current).toBe(0);
  fireEvent.touchStart(surface, { touches: [{ clientX: 260, clientY: 650 }] });
  fireEvent.touchMove(surface, { touches: [{ clientX: 130, clientY: 652 }] });
  fireEvent.touchCancel(surface);
  await act(async () =>
    fireEvent.touchEnd(surface, {
      touches: [],
      changedTouches: [{ clientX: 130, clientY: 652 }],
    }),
  );
  expect(readStore("zhilian-v1").current).toBe(0);
});
