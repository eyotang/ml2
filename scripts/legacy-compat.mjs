import fs from "node:fs";
import path from "node:path";
// Cached pre-React HTML can still request the original file names. Keep those
// data/runtime dependencies and boot the current React entry from stable URLs.
export function legacyCompatibility() {
  return {
    name: "legacy-html-compatibility",
    apply: "build",
    closeBundle() {
      const root = process.cwd(),
        dist = path.join(root, "dist");
      for (const name of fs.readdirSync(path.join(root, "content")))
        if (name.endsWith(".js"))
          fs.copyFileSync(
            path.join(root, "content", name),
            path.join(dist, name),
          );
      for (const name of fs.readdirSync(path.join(root, "src/styles")))
        fs.copyFileSync(
          path.join(root, "src/styles", name),
          path.join(dist, name),
        );
      for (const name of ["python-runner.js", "code-editor.js"])
        fs.copyFileSync(path.join(root, "legacy", name), path.join(dist, name));
      for (const [html, bridge] of [
        ["index.html", "home.js"],
        ["theory.html", "app.js"],
        ["skills.html", "skills.js"],
      ]) {
        const source = fs.readFileSync(path.join(dist, html), "utf8"),
          script = source.match(
            /<script[^>]*type="module"[^>]*src="([^"]+)"/,
          )[1],
          styles = [
            ...source.matchAll(
              /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g,
            ),
          ].map((m) => m[1]);
        const code = `/* Compatibility entry for cached pre-React HTML. */\n(()=>{document.documentElement.dataset.appVersion=${JSON.stringify(source.match(/data-app-version="([^"]+)"/)[1])};const updates=document.createElement('script');updates.src='./update-check.js';document.head.append(updates);for(const href of ${JSON.stringify(styles)}){const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.append(link)}const root=document.createElement('div');root.id='root';document.body.replaceChildren(root);const entry=document.createElement('script');entry.type='module';entry.src=${JSON.stringify(script)};document.body.append(entry)})();\n`;
        fs.writeFileSync(path.join(dist, bridge), code);
      }
    },
  };
}
