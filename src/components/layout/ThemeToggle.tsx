"use client";

import { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { readStoredTheme, storeTheme, themeForTime, type Theme } from "@/lib/theme";

/* Smallest share of the spill mask's width that is solid in every direction. */
const SPILL_CORE = 0.28;
const SPILL_MS = 1500;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

/* Pours the new theme out from (x, y) like spilled liquid spreading over the floor. */
function spillTo(theme: Theme, x: number, y: number) {
  const root = document.documentElement;
  const apply = () => {
    root.dataset.theme = theme;
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof document.startViewTransition !== "function") {
    apply();
    return;
  }

  const reach = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  const size = reach / SPILL_CORE;
  root.classList.add("is-spilling");
  const transition = document.startViewTransition(apply);
  transition.ready
    .then(() => {
      root.animate(
        {
          maskSize: ["0px 0px", `${size * 0.16}px ${size * 0.16}px`, `${size}px ${size}px`],
          maskPosition: [
            `${x}px ${y}px`,
            `${x - size * 0.08}px ${y - size * 0.08}px`,
            `${x - size / 2}px ${y - size / 2}px`,
          ],
          offset: [0, 0.18, 1],
        } as PropertyIndexedKeyframes,
        {
          duration: SPILL_MS,
          easing: "cubic-bezier(0.4, 0.7, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
  transition.finished.finally(() => root.classList.remove("is-spilling"));
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);
  const dark = theme === "dark";

  // Follow the clock while the page stays open, unless the visitor picked a theme.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (readStoredTheme()) return;
      const timed = themeForTime();
      if (timed !== readTheme()) spillTo(timed, window.innerWidth / 2, window.innerHeight / 2);
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = dark ? "light" : "dark";
    const box = event.currentTarget.getBoundingClientRect();
    storeTheme(next);
    spillTo(next, box.left + box.width / 2, box.top + box.height / 2);
  };

  return (
    <button
      type="button"
      className={cn("theme-toggle", dark && "is-dark", className)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "Light mode" : "Dark mode"}
      onClick={toggle}
    >
      <span className="theme-toggle-track" aria-hidden>
        <svg className="theme-toggle-sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
        </svg>
        <svg className="theme-toggle-moon" viewBox="0 0 24 24">
          <path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8Z" />
        </svg>
        <span className="theme-toggle-knob" />
      </span>
    </button>
  );
}
