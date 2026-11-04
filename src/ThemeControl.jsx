import React, { useLayoutEffect, useRef, useState } from "react";
export const THEME_KEY = "zhilian-theme";
const modes = ["system", "light", "dark"];
function readTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return modes.includes(value) ? value : "system";
  } catch {
    return "system";
  }
}
function applyTheme(mode, systemDark) {
  const theme = mode === "system" ? (systemDark ? "dark" : "light") : mode;
  const background = theme === "dark" ? "#101820" : "#f7f9fb";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.documentElement.style.backgroundColor = background;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", background);
}
export function useThemeAppearance() {
  const [mode, setMode] = useState(readTheme);
  const preference = useRef(mode),
    media = useRef(null);
  useLayoutEffect(() => {
    media.current = matchMedia("(prefers-color-scheme: dark)");
    const update = () => applyTheme(preference.current, media.current.matches);
    const restore = () => {
      preference.current = readTheme();
      setMode(preference.current);
      update();
    };
    const storage = (event) => {
      if (event.key === THEME_KEY || event.key === null) restore();
    };
    update();
    media.current.addEventListener("change", update);
    window.addEventListener("storage", storage);
    window.addEventListener("pageshow", restore);
    return () => {
      media.current.removeEventListener("change", update);
      window.removeEventListener("storage", storage);
      window.removeEventListener("pageshow", restore);
    };
  }, []);
  function change(event) {
    const next = event.target.value;
    if (!modes.includes(next)) return;
    preference.current = next;
    setMode(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* Theme still works for this page if storage is unavailable. */
    }
    applyTheme(next, media.current.matches);
  }
  return { mode, change };
}
export function ThemeSync() {
  useThemeAppearance();
  return null;
}
export default function ThemeControl() {
  const { mode, change } = useThemeAppearance();
  return (
    <label className="theme-control">
      <select
        aria-label="颜色主题"
        title="颜色主题"
        value={mode}
        onChange={change}
      >
        <option value="system">跟随系统</option>
        <option value="light">亮色</option>
        <option value="dark">暗色</option>
      </select>
    </label>
  );
}
