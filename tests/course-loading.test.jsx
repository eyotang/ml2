import { test, expect } from "vitest";
import { courses, loadCourse, readStore } from "../src/model";
import data from "../src/generated/data.json";
test("load only the selected course, preserving its full content and saved learning data", async () => {
  const before = { b3: { index: 8, caseDrafts: { b3t2: "已填写" } } };
  localStorage.setItem("zhilian-skills-v1", JSON.stringify(before));
  delete courses.b3;
  const course = await loadCourse("b3");
  expect(course).toEqual(data.courses.b3);
  expect(courses.b3).toBe(course);
  expect(await loadCourse("b3")).toBe(course);
  expect(await loadCourse("unknown")).toBeNull();
  expect(readStore("zhilian-skills-v1")).toEqual(before);
});
