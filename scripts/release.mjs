import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
function sourceVersion() {
  const hash = crypto.createHash("sha256");
  function scan(dir) {
    for (const file of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, file);
      if (
        full === "src/generated" ||
        file === "__pycache__" ||
        file.endsWith(".pyc")
      )
        continue;
      if (fs.statSync(full).isDirectory()) scan(full);
      else hash.update(full).update(fs.readFileSync(full));
    }
  }
  for (const dir of ["src", "content", "public", "scripts"]) scan(dir);
  for (const file of [
    "index.html",
    "theory.html",
    "skills.html",
    "vite.config.js",
    "package-lock.json",
  ])
    hash.update(fs.readFileSync(file));
  return hash.digest("hex").slice(0, 16);
}
export function release() {
  const version = sourceVersion(),
    previous = new Map();
  return {
    name: "static-release",
    config() {
      return { define: { __APP_VERSION__: JSON.stringify(version) } };
    },
    configResolved(config) {
      if (config.command !== "build") return;
      // Retain only assets reachable from the previous HTML, not every historic release.
      const visited = new Set();
      let fromGit = false;
      function collect(file) {
        file = file.replace(/^\.\//, "");
        if (visited.has(file)) return;
        visited.add(file);
        let bytes;
        try {
          bytes = fromGit
            ? execFileSync("git", ["show", "HEAD:dist/" + file], {
                stdio: ["ignore", "pipe", "ignore"],
              })
            : fs.readFileSync("dist/" + file);
        } catch {
          return;
        }
        if (file.startsWith("assets/")) previous.set(file, bytes);
        if (/\.(html|js|css)$/.test(file))
          for (const m of bytes
            .toString()
            .matchAll(
              /(?:["'(])(?:\.\/)?((?:assets\/)?[\w.-]+\.(?:js|css))["')]/g,
            ))
            collect(
              m[1].startsWith("assets/")
                ? m[1]
                : file.startsWith("assets/")
                  ? "assets/" + m[1]
                  : m[1],
            );
      }
      for (const page of ["index.html", "theory.html", "skills.html"])
        collect(page);
      // Local checks may build repeatedly before a release. Keep the last committed
      // release too, so those checks cannot discard the currently published assets.
      fromGit = true;
      visited.clear();
      for (const page of ["index.html", "theory.html", "skills.html"])
        collect(page);
    },
    transformIndexHtml(html) {
      return html
        .replace("<html ", `<html data-app-version="${version}" `)
        .replace("</head>", '<script src="./update-check.js"></script></head>');
    },
    configureServer(server) {
      server.middlewares.use("/version.json", (_, res) => {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");
        res.end(JSON.stringify({ version }));
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: JSON.stringify({ version }),
      });
    },
    closeBundle() {
      for (const [file, bytes] of previous) {
        if (!fs.existsSync("dist/" + file)) {
          fs.mkdirSync(path.dirname("dist/" + file), { recursive: true });
          fs.writeFileSync("dist/" + file, bytes);
        }
      }
    },
  };
}
