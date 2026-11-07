import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { legacyCompatibility } from "./scripts/legacy-compat.mjs";
import { release } from "./scripts/release.mjs";
export default defineConfig({
  base: "./",
  plugins: [react(), release(), legacyCompatibility()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name(moduleId) {
                return moduleId.includes("node_modules") ? "vendor" : null;
              },
            },
          ],
        },
      },
      input: {
        home: "index.html",
        theory: "theory.html",
        skills: "skills.html",
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    restoreMocks: true,
  },
});
