"use client";

import { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { storeTheme, type Theme } from "@/lib/theme";
import { isLiteFx, playThemeFx, prepareThemeFx, THEME_FX_MS } from "@/lib/theme-fx";

/* Smallest share of the spill mask's width that is solid in every direction. */
const SPILL_CORE = 0.28;
const SPILL_MS = THEME_FX_MS;
const SPILL_MASK = "/fx/spill.svg";
const WIPE_IN_MS = 480;
const WIPE_OUT_MS = 420;
const WIPE_DOT = 160;
/* The disc is painted through whatever filter the page has at the time, so these
   are the inputs that show the new theme's background: before the swap they go
   through the old theme's filter, after it the page's own cream does the job. */
const WIPE_BEFORE: Record<Theme, string> = { dark: "#0a1124", light: "#160900" };
const WIPE_AFTER = "#fff3e2";

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
  if (isLiteFx()) {
    wipeTo(theme, x, y);
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
  root.setAttribute("data-theme-busy", "");
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
    root.removeAttribute("data-theme-busy");
    clearFx();
  });
}

/* Phones can't hold frame rate through a page snapshot and mask animation, so a
   disc of the new theme's colour floods out from the toggle on the compositor,
   the theme is swapped while the screen is covered, and the disc fades away. */
function wipeTo(theme: Theme, x: number, y: number) {
  const root = document.documentElement;
  const reach = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  const cover = document.createElement("div");
  cover.className = "theme-wipe";
  cover.dataset.themeIgnore = "";
  cover.setAttribute("aria-hidden", "true");
  Object.assign(cover.style, {
    left: `${x - WIPE_DOT / 2}px`,
    top: `${y - WIPE_DOT / 2}px`,
    width: `${WIPE_DOT}px`,
    height: `${WIPE_DOT}px`,
    background: WIPE_BEFORE[theme],
  });
  document.body.appendChild(cover);
  root.setAttribute("data-theme-busy", "");

  const done = () => {
    cover.remove();
    root.removeAttribute("data-theme-busy");
  };
  const grow = cover.animate(
    [{ transform: "scale(0.01)" }, { transform: `scale(${(reach * 2 + 8) / WIPE_DOT})` }],
    { duration: WIPE_IN_MS, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" },
  );
  grow.finished
    .then(() => {
      root.dataset.theme = theme;
      cover.style.background = WIPE_AFTER;
      window.setTimeout(playThemeFx(theme, x, y, true), THEME_FX_MS);
      // Two frames so the swapped page has painted under the cover before it lifts.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          cover
            .animate([{ opacity: 1 }, { opacity: 0 }], { duration: WIPE_OUT_MS, easing: "ease-out", fill: "forwards" })
            .finished.finally(done);
        }),
      );
    })
    .catch(() => {
      root.dataset.theme = theme;
      done();
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
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (document.documentElement.hasAttribute("data-theme-busy")) return;
    const next: Theme = dark ? "light" : "dark";
    const button = event.currentTarget;
    const box = button.getBoundingClientRect();
    // The pop lives on the track: React rewrites the button's classes when the theme lands.
    const track = button.firstElementChild as HTMLElement;
    track.classList.remove("is-popping");
    void track.offsetWidth;
    track.classList.add("is-popping");
    // Slide the knob now rather than after the theme work.
    button.classList.toggle("is-dark", next === "dark");
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
        if (event.animationName === "theme-toggle-pop") (event.target as HTMLElement).classList.remove("is-popping");
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
