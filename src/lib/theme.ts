export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "rmw-theme";
export const DEFAULT_THEME: Theme = "light";

/* Entries saved before the theme stopped following the clock carry an `until`; they still expire then. */
export function readStoredTheme(): Theme | null {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as { theme?: Theme; until?: number };
    if (stored.until && stored.until <= Date.now()) return null;
    if (stored.theme === "dark" || stored.theme === "light") return stored.theme;
  } catch {}
  return null;
}

export function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ theme }));
  } catch {}
}

/* Runs in <head> before first paint so a visitor who picked dark never sees a light flash. */
export const THEME_BOOT_SCRIPT = `(function(){try{var t="${DEFAULT_THEME}",s=JSON.parse(localStorage.getItem("${THEME_STORAGE_KEY}")||"null");if(s&&(!s.until||s.until>Date.now())&&(s.theme==="dark"||s.theme==="light"))t=s.theme;document.documentElement.dataset.theme=t;}catch(e){}})();`;
