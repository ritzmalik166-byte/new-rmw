import { DIWALI_DARK_UNTIL, DIWALI_THEME } from "@/config/festive";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "rmw-theme";
/* Dark-only switch: `true` locks the whole site to dark and hides the header toggle.
   Set it back to `false` to bring back the light theme and the toggle. */
export const DARK_ONLY = false;

export const DEFAULT_THEME: Theme = "light";
/* Default for the festive window; checked in the browser so it flips back on its own after it ends. */
const DARK_UNTIL = DIWALI_THEME ? DIWALI_DARK_UNTIL : 0;

/* The toggle choice lasts for the browser session only (sessionStorage), so every new visit opens in light. */
export function readStoredTheme(): Theme | null {
  try {
    const raw = window.sessionStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as { theme?: Theme; until?: number };
    if (stored.until && stored.until <= Date.now()) return null;
    if (stored.theme === "dark" || stored.theme === "light") return stored.theme;
  } catch {}
  return null;
}

export function storeTheme(theme: Theme) {
  try {
    window.sessionStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ theme }));
  } catch {}
}

/* Runs in <head> before first paint so a visitor who picked dark never sees a light flash.
   Also clears the old localStorage entry, which used to keep a past dark choice forever. */
export const THEME_BOOT_SCRIPT = DARK_ONLY
  ? `document.documentElement.dataset.theme="dark";`
  : `(function(){try{var t=Date.now()<${DARK_UNTIL}?"dark":"${DEFAULT_THEME}",s=JSON.parse(sessionStorage.getItem("${THEME_STORAGE_KEY}")||"null");localStorage.removeItem("${THEME_STORAGE_KEY}");if(s&&(!s.until||s.until>Date.now())&&(s.theme==="dark"||s.theme==="light"))t=s.theme;document.documentElement.dataset.theme=t;}catch(e){}})();`;
