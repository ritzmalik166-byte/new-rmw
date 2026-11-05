/* Diwali decorations for the homepage hero. Purely decorative: aria-hidden,
   no pointer events, and kept clear of the copy, nav and CTAs. Toggle with
   DIWALI_THEME in src/config/festive.ts. Styles: src/styles/festive/diwali.css */

import type { CSSProperties } from "react";

/* Seeded so server and client render the same "random" garland. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const W = 1600;
const LIGHTS = 46;
const LIGHT_LOOPS = 5;
const LIGHT_DROP = 13;
/* Mostly warm-white filament bulbs with a few amber and marigold, like a real festive string. */
const BULB_TONES = ["warm", "warm", "amber", "warm", "gold", "warm", "saffron"] as const;

/* Filament bulbs on a dark wire, draped in shallow loops. */
export function StringLights() {
  const rand = rng(21);
  const span = W / LIGHT_LOOPS;
  const wire =
    "M0 4 " +
    Array.from({ length: LIGHT_LOOPS }, (_, i) => `Q${i * span + span / 2} ${4 + LIGHT_DROP * 2} ${(i + 1) * span} 4`).join(" ");

  return (
    <div className="dw-lights">
      <svg className="dw-wire" viewBox={`0 0 ${W} 40`} preserveAspectRatio="none">
        <path d={wire} />
      </svg>
      {Array.from({ length: LIGHTS }, (_, i) => {
        const t = (i + 0.5) / LIGHTS;
        const local = (t * LIGHT_LOOPS) % 1;
        const sag = 4 + 4 * LIGHT_DROP * local * (1 - local);
        return (
          <span
            key={i}
            className="dw-bulb"
            data-tone={BULB_TONES[i % BULB_TONES.length]}
            style={
              {
                left: `${t * 100}%`,
                top: `${sag.toFixed(1)}px`,
                rotate: `${((rand() - 0.5) * 24).toFixed(0)}deg`,
                "--d": `${(rand() * 4).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

const KANDIL = {
  saffron: ["#ffe9c2", "#f68a2a", "#a63e0c"],
  gold: ["#fff3c4", "#f5b93a", "#a8620c"],
  rose: ["#ffe3d6", "#f2708a", "#a3264f"],
} as const;

/* Paper akash kandil: octagonal body, cone caps, bamboo frame and a paper-strip fringe. */
function Kandil({ hue, className }: { hue: keyof typeof KANDIL; className: string }) {
  const id = `dw-k-${hue}`;
  const [light, mid, deep] = KANDIL[hue];
  return (
    <span className={`dw-kandil ${className}`}>
      <svg viewBox="0 0 60 120">
        <defs>
          <radialGradient id={id} cx="50%" cy="52%" r="55%">
            <stop offset="0" stopColor={light} />
            <stop offset="0.5" stopColor={mid} />
            <stop offset="1" stopColor={deep} />
          </radialGradient>
        </defs>
        <rect x="27" y="0" width="6" height="5" rx="1" fill="#8a6a2e" />
        <path d="M30 4 L52 22 L8 22 Z" fill={deep} opacity="0.92" />
        <path d="M8 22 H52 L56 34 V52 L52 64 H8 L4 52 V34 Z" fill={`url(#${id})`} />
        <path
          d="M8 22 L4 34 V52 L8 64 M52 22 L56 34 V52 L52 64 M20 22 V64 M30 22 V64 M40 22 V64"
          stroke={deep}
          strokeOpacity="0.45"
          strokeWidth="0.9"
          fill="none"
        />
        <path d="M4 43 H56" stroke={deep} strokeOpacity="0.35" strokeWidth="0.8" />
        <path d="M8 64 H52 L30 80 Z" fill={deep} opacity="0.92" />
        <g className="dw-fringe">
          {Array.from({ length: 9 }, (_, i) => (
            <rect
              key={i}
              x={10 + i * 4.6}
              y={64}
              width="2.6"
              height={36 + (i % 3) * 6}
              rx="1"
              fill={i % 2 ? mid : deep}
              opacity="0.85"
            />
          ))}
        </g>
      </svg>
    </span>
  );
}

/* String lights and lanterns hung under the header. */
export function DiwaliHeroDecor() {
  return (
    <div className="dw-decor theme-keep" aria-hidden>
      <span className="dw-glow" />
      <StringLights />
      <Kandil hue="saffron" className="is-a" />
      <Kandil hue="gold" className="is-b" />
      <Kandil hue="rose" className="is-c" />
    </div>
  );
}

/* Fairy lights on the cargo body and cab, a swinging dashboard garland, a diya and exhaust. */
export function DiwaliTruckLights() {
  const strand = (cls: string, n: number) => (
    <span className={`dw-truck-strand ${cls}`}>
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="dw-truck-bulb"
          data-tone={BULB_TONES[i % BULB_TONES.length]}
          style={{ left: `${(i / (n - 1)) * 100}%`, "--k": i % 3 } as CSSProperties}
        />
      ))}
    </span>
  );

  return (
    <span className="dw-truck theme-keep" aria-hidden>
      <span className="dw-truck-glow" />
      {strand("is-roof", 22)}
      {strand("is-mid", 22)}
      {strand("is-rail", 22)}
      {strand("is-bumper", 24)}
      {strand("is-cab", 7)}
      <span className="dw-truck-mala">
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} />
        ))}
      </span>
      <span className="dw-truck-diya" />
    </span>
  );
}

/* ---------- Dark mode only: the Diwali night (styles: src/styles/festive/diwali-dark.css) ---------- */
const nightRand = rng(1410);
const EMBERS = Array.from({ length: 26 }, () => ({
  left: `${(nightRand() * 100).toFixed(2)}%`,
  "--size": `${(1.5 + nightRand() * 2.5).toFixed(2)}px`,
  "--rise": `${(7 + nightRand() * 7).toFixed(2)}s`,
  "--delay": `${(-nightRand() * 14).toFixed(2)}s`,
  "--drift": `${((nightRand() - 0.5) * 60).toFixed(0)}px`,
})) as unknown as CSSProperties[];

/* Bursts sit in the open sky above the truck, clear of the copy. */
const BURSTS = [
  { left: "62%", top: "30%", "--s": "150px", "--hue": "#ffd36b", "--delay": "0s" },
  { left: "86%", top: "18%", "--s": "110px", "--hue": "#ff9a3c", "--delay": "1.7s" },
  { left: "74%", top: "46%", "--s": "90px", "--hue": "#ff5f6d", "--delay": "3.1s" },
  { left: "94%", top: "40%", "--s": "70px", "--hue": "#fff1c4", "--delay": "4.4s" },
] as unknown as CSSProperties[];

const SIDE_BULBS = 18;

export function DiwaliNight() {
  return (
    <span className="dw-night theme-keep" aria-hidden>
      <span className="dw-night-sky" />
      {BURSTS.map((style, i) => (
        <span key={i} className="dw-burst" style={style}>
          <i />
        </span>
      ))}
      {EMBERS.map((style, i) => (
        <i key={i} className="dw-ember" style={style} />
      ))}
      {["is-left", "is-right"].map((side) => (
        <span key={side} className={`dw-side ${side}`}>
          {Array.from({ length: SIDE_BULBS }, (_, i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </span>
      ))}
    </span>
  );
}
