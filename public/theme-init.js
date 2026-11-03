// Apply the saved/system appearance before the page's styles and React load.
(() => {
  let mode = 'system';
  try { const saved = localStorage.getItem('zhilian-theme'); if (['system', 'light', 'dark'].includes(saved)) mode = saved; } catch {}
  const dark = mode === 'dark' || (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = dark ? 'dark' : 'light', background = dark ? '#101820' : '#f7f9fb';
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.documentElement.style.backgroundColor = background;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
})();
