import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
function initialAssets(page) {
  const html = fs.readFileSync(`dist/${page}.html`, "utf8");
  const entry = html.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/)[1];
  const seen = new Set();
  function collect(file) {
    if (seen.has(file)) return;
    seen.add(file);
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(
      /\b(?:from\s*|import\s*)["']([^"']+\.js)["']/g,
    )) {
      collect(path.resolve(path.dirname(file), match[1]));
    }
  }
  collect(path.resolve("dist", entry));
  return [...seen];
}
for (const page of ["index", "theory", "skills"]) {
  const files = initialAssets(page);
  const bytes = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  console.log(`${page}: ${bytes} bytes of startup JavaScript`);
  assert.ok(
    bytes < 360_000,
    `${page}: unrelated courses still inflate startup`,
  );
  assert.ok(
    !files.some((file) => /course-(?:b11|b12|b2|b3|b4|c)-/.test(file)),
    "Course content must load on demand",
  );
  const html = fs.readFileSync(`dist/${page}.html`, "utf8");
  assert.ok(
    !html.includes('src="./theme-init.js"'),
    "Apply appearance inline without a blocking request",
  );
  assert.match(html, /<script defer src="\.\/update-check\.js"><\/script>/);
}
const skillHtml = fs.readFileSync("dist/skills.html", "utf8");
assert.ok(
  skillHtml.includes('id="course-preload"'),
  "Start the selected course request before the app boots",
);
const assets = fs.readdirSync("dist/assets");
for (const id of ["b11", "b12", "b2", "b3", "b4", "c"]) {
  assert.ok(
    assets.some((name) => name.startsWith(`course-${id}-`)),
    `Missing lazy course ${id}`,
  );
}
assert.ok(
  assets.some((name) => /^vendor-.*\.js$/.test(name)),
  "React runtime should be independently cacheable",
);
console.log("PASS: courses load on demand; startup is small and non-blocking");
