export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "rmw-theme";
/* Dark from 7 pm until 6 am, local time. */
export const NIGHT_STARTS = 19;
export const NIGHT_ENDS = 6;

export function themeForTime(date = new Date()): Theme {
  const hour = date.getHours();
  return hour >= NIGHT_STARTS || hour < NIGHT_ENDS ? "dark" : "light";
}

/* The next moment the automatic theme flips; a manual choice lasts until then. */
export function nextThemeSwitch(date = new Date()) {
  const next = new Date(date);
  next.setMinutes(0, 0, 0);
  const hour = date.getHours();
  if (hour >= NIGHT_STARTS) {
    next.setDate(next.getDate() + 1);
    next.setHours(NIGHT_ENDS);
  } else if (hour < NIGHT_ENDS) {
    next.setHours(NIGHT_ENDS);
  } else {
    next.setHours(NIGHT_STARTS);
  }
  return next.getTime();
}

export function readStoredTheme(): Theme | null {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as { theme?: Theme; until?: number };
    if (stored.until && stored.until > Date.now() && (stored.theme === "dark" || stored.theme === "light")) {
      return stored.theme;
    }
  } catch {}
  return null;
}

export function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ theme, until: nextThemeSwitch() }),
    );
  } catch {}
}

/* Runs in <head> before first paint so night visitors never see a light flash. */
export const THEME_BOOT_SCRIPT = `(function(){try{var h=new Date().getHours(),t=h>=${NIGHT_STARTS}||h<${NIGHT_ENDS}?"dark":"light",s=JSON.parse(localStorage.getItem("${THEME_STORAGE_KEY}")||"null");if(s&&s.until>Date.now()&&(s.theme==="dark"||s.theme==="light"))t=s.theme;document.documentElement.dataset.theme=t;}catch(e){}})();`;
