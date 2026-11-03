import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { legacyCompatibility } from "./scripts/legacy-compat.mjs";
export default defineConfig({
  base: "./",
  plugins: [react(), legacyCompatibility()],
  build: {
    rollupOptions: {
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
