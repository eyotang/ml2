import { test, expect } from "vitest";
import { courses } from "../src/model";
function diagrams() {
  const all = new Map();
  for (const c of Object.values(courses)) {
    for (const step of c.steps)
      if (step.flowchartHTML) all.set(c.id + "-" + step.id, step.flowchartHTML);
    for (const task of c.tasks || [])
      if (task.flowchart) all.set(c.id + "-" + task.id, task.flowchart.html);
  }
  return [...all];
}
test.each(diagrams())(
  "%s: directional connectors never cut through a node",
  (_, html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const boxes = [...doc.querySelectorAll(".flow-box")].map((el) => ({
      x: parseFloat(el.style.left),
      y: parseFloat(el.style.top),
      w: parseFloat(el.style.width),
      h: parseFloat(el.style.height),
      diamond: el.classList.contains("flow-decision"),
      label: el.textContent,
    }));
    for (const path of doc.querySelectorAll(".flow-lines > path")) {
      const d = path.getAttribute("d");
      let x = 0,
        y = 0;
      for (const token of d.matchAll(
        /([MHV])\s*(-?[\d.]+)(?:[ ,]+(-?[\d.]+))?/g,
      )) {
        const nx = token[1] === "V" ? x : Number(token[2]),
          ny =
            token[1] === "H"
              ? y
              : Number(token[1] === "M" ? token[3] : token[2]);
        if (token[1] !== "M") {
          for (const b of boxes) {
            const hits = [];
            const length = Math.max(Math.abs(nx - x), Math.abs(ny - y));
            for (let i = 1; i < length; i++) {
              const px = x + ((nx - x) * i) / length,
                py = y + ((ny - y) * i) / length;
              const inside = b.diamond
                ? Math.abs(px - b.x - b.w / 2) / (b.w / 2) +
                    Math.abs(py - b.y - b.h / 2) / (b.h / 2) <
                  0.97
                : px > b.x + 2 &&
                  px < b.x + b.w - 2 &&
                  py > b.y + 2 &&
                  py < b.y + b.h - 2;
              if (inside) hits.push([px, py]);
            }
            expect(hits.length, `${d} crosses ${b.label}`).toBe(0);
          }
        }
        x = nx;
        y = ny;
      }
    }
  },
);
test("B1-1 new-image failure connects straight down to manual inspection, with its own labelled branch", () => {
  for (const [, html] of diagrams().filter(([id]) => id.startsWith("b11"))) {
    expect(html).toContain('d="M110 400V539"');
    expect(html).not.toContain("M110 400H5V600H15");
    expect(html).toContain("否：检查实物");
  }
});
