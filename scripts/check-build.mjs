import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
const manifest = JSON.parse(
  fs.readFileSync("legacy/materials-manifest.json", "utf8"),
);
for (const [file, expected] of Object.entries(manifest))
  assert.equal(
    crypto
      .createHash("sha256")
      .update(fs.readFileSync("dist/" + file))
      .digest("hex"),
    expected,
    file,
  );
for (const page of ["index.html", "theory.html", "skills.html"]) {
  const html = fs.readFileSync("dist/" + page, "utf8");
  assert.match(html, /id="root"/);
  assert.match(html, /type="module"/);
  assert.doesNotMatch(html, /\/src\//);
  for (const [, url] of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g))
    assert.ok(fs.existsSync("dist/" + url), page + ": " + url);
  const old = fs.readFileSync("legacy/" + page, "utf8");
  for (const [, url] of old.matchAll(
    /(?:src|href)="([^"?#]+\.(?:js|css))(?:\?[^"]*)?"/g,
  ))
    assert.ok(fs.existsSync("dist/" + url), "cached " + page + ": " + url);
}
for (const bridge of ["home.js", "app.js", "skills.js"])
  assert.match(
    fs.readFileSync("dist/" + bridge, "utf8"),
    /Compatibility entry.*cached pre-React HTML/s,
  );
assert.ok(fs.existsSync("dist/python-worker.js"));
assert.ok(!fs.existsSync("dist/_cached"));
console.log(
  "PASS: static entry points, relative assets, old cached HTML dependencies, compatibility entries, Worker and all 15 original materials",
);
