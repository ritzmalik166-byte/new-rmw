import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/* Seeded so the server and client draw the same sky. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = rng(2008);
const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const sec = (n: number) => `${n.toFixed(2)}s`;

const STARS = Array.from({ length: 90 }, () => {
  const big = rand() < 0.12;
  return {
    big,
    style: {
      left: pct(rand()),
      // Thinner toward the horizon, like a real sky.
      top: pct(rand() ** 1.6 * 0.82),
      "--size": `${(big ? 2.6 + rand() * 1.6 : 1 + rand() * 1.4).toFixed(2)}px`,
      "--twinkle": sec(2.2 + rand() * 3.8),
      "--delay": sec(-rand() * 6),
      "--dim": (0.2 + rand() * 0.35).toFixed(2),
    } as CSSProperties,
  };
});

const SHOOTERS = [
  { top: "8%", left: "58%", delay: "3s" },
  { top: "22%", left: "88%", delay: "11s" },
  { top: "4%", left: "30%", delay: "19s" },
].map((s) => ({ top: s.top, left: s.left, "--delay": s.delay }) as CSSProperties);

/** Stars, a rising crescent moon and the odd shooting star; shown only in dark mode. */
export function NightSky({ className }: { className?: string }) {
  return (
    <span className={cn("night-sky theme-keep", className)} aria-hidden>
      {STARS.map((star, i) => (
        <i key={i} className={star.big ? "night-star is-big" : "night-star"} style={star.style} />
      ))}
      {SHOOTERS.map((style, i) => (
        <b key={i} className="night-shooter" style={style} />
      ))}
      <span className="night-moon">
        <svg viewBox="0 0 100 100">
          <defs>
            <radialGradient id="night-moon-face" cx="38%" cy="34%" r="70%">
              <stop offset="0" stopColor="#fffbea" />
              <stop offset="0.6" stopColor="#f6e7b8" />
              <stop offset="1" stopColor="#d9c27e" />
            </radialGradient>
            <mask id="night-moon-cut">
              <rect width="100" height="100" fill="#fff" />
              <circle cx="66" cy="38" r="38" fill="#000" />
            </mask>
          </defs>
          <g mask="url(#night-moon-cut)">
            <circle cx="50" cy="50" r="40" fill="url(#night-moon-face)" />
            <circle cx="30" cy="58" r="5" fill="#d8c48a" opacity="0.55" />
            <circle cx="22" cy="40" r="3" fill="#d8c48a" opacity="0.45" />
            <circle cx="38" cy="76" r="3.6" fill="#d8c48a" opacity="0.5" />
          </g>
        </svg>
      </span>
    </span>
  );
}
