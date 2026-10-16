"use client";

import { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { readStoredTheme, storeTheme, themeForTime, type Theme } from "@/lib/theme";
import { playThemeFx, prepareThemeFx, THEME_FX_MS } from "@/lib/theme-fx";

/* Smallest share of the spill mask's width that is solid in every direction. */
const SPILL_CORE = 0.28;
const SPILL_MS = THEME_FX_MS;
const SPILL_MASK = "/fx/spill.svg";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

/* Pours the new theme out from (x, y) like spilled liquid spreading over the floor,
   with the stars / sun-flare effect playing on top. */
function spillTo(theme: Theme, x: number, y: number) {
  const root = document.documentElement;
  let clearFx = () => {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    root.dataset.theme = theme;
    return;
  }
  if (typeof document.startViewTransition !== "function") {
    root.dataset.theme = theme;
    window.setTimeout(playThemeFx(theme, x, y, true), THEME_FX_MS);
    return;
  }
  const apply = () => {
    root.dataset.theme = theme;
    clearFx = playThemeFx(theme, x, y);
  };

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
          // Without holding the last frame, the resting 0x0 mask hides the new theme for a frame before the transition ends.
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
  transition.finished.finally(() => {
    root.classList.remove("is-spilling");
    clearFx();
  });
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);
  const dark = theme === "dark";

  // An unloaded mask image hides the new theme entirely, so fetch it before the first toggle.
  useEffect(() => {
    new Image().src = SPILL_MASK;
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 1200));
    idle(() => prepareThemeFx());
  }, []);

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
    const button = event.currentTarget;
    const box = button.getBoundingClientRect();
    button.classList.remove("is-popping");
    void button.offsetWidth;
    button.classList.add("is-popping");
    navigator.vibrate?.(14);
    storeTheme(next);
    spillTo(next, box.left + box.width / 2, box.top + box.height / 2);
  };

  return (
    <button
      type="button"
      className={cn("theme-toggle", dark && "is-dark", className)}
      data-theme-ignore=""
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "Light mode" : "Dark mode"}
      onClick={toggle}
      onAnimationEnd={(event) => {
        if (event.animationName === "theme-toggle-pop") event.currentTarget.classList.remove("is-popping");
      }}
    >
      <span className="theme-toggle-track" aria-hidden>
        <span className="theme-toggle-stars theme-keep">
          <i />
          <i />
          <i />
        </span>
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
