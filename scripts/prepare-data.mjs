import fs from "node:fs";
import vm from "node:vm";
const context = { window: {} };
vm.createContext(context);
for (const file of [
  "questions.js",
  "answers.js",
  "supplemental-questions.js",
  "skill-content.js",
  "case-content.js",
  "study-tips.js",
])
  vm.runInContext(
    fs.readFileSync(new URL("../content/" + file, import.meta.url), "utf8"),
    context,
  );
const data = vm.runInContext(
  "({questions:QUESTIONS,courses:SKILL_COURSES})",
  context,
);
data.tips = Object.fromEntries(
  [
    "c",
    "b11",
    "b12",
    "b2",
    "b3",
    "b4",
    "theory",
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
  ].map((key) => [key, context.window.StudyTips.forCourse(key)]),
);
fs.mkdirSync(new URL("../src/generated/", import.meta.url), {
  recursive: true,
});
fs.writeFileSync(
  new URL("../src/generated/data.json", import.meta.url),
  JSON.stringify(data),
);

// Keep each course out of the shared startup bundle.
for (const [name, value] of Object.entries({
  questions: data.questions,
  tips: data.tips,
  ...Object.fromEntries(
    Object.entries(data.courses).map(([id, course]) => [
      "course-" + id,
      course,
    ]),
  ),
})) {
  fs.writeFileSync(
    new URL("../src/generated/" + name + ".json", import.meta.url),
    JSON.stringify(value),
  );
}
