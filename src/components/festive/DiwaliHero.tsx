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
const SWAGS = 8;
const SWAG_DROP = 34;
const LIGHTS = 46;
const LIGHT_LOOPS = 5;
const LIGHT_DROP = 13;
/* Mostly warm-white filament bulbs with a few amber and marigold, like a real festive string. */
const BULB_TONES = ["warm", "warm", "amber", "warm", "gold", "warm", "saffron"] as const;

/* Marigold garland swags with mango leaves at each tie point. */
function Toran() {
  const rand = rng(7);
  const step = W / SWAGS;
  const flowers: { x: number; y: number; r: number; tone: number; rot: number }[] = [];
  for (let s = 0; s < SWAGS; s++) {
    const n = 26;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      flowers.push({
        x: s * step + step * t + (rand() - 0.5) * 2,
        y: 6 + 4 * SWAG_DROP * t * (1 - t) + (rand() - 0.5) * 2,
        r: 6.2 + rand() * 1.6,
        tone: rand() < 0.68 ? 0 : 1,
        rot: rand() * 360,
      });
    }
  }
  const ties = Array.from({ length: SWAGS + 1 }, (_, i) => i * step);

  return (
    <svg className="dw-toran" viewBox={`0 0 ${W} 70`} preserveAspectRatio="xMidYMin slice">
      <defs>
        <filter id="dw-ruffle" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="3.2" />
          <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="#5a2600" floodOpacity="0.35" />
        </filter>
        <radialGradient id="dw-mg-0" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ffb52e" />
          <stop offset="0.55" stopColor="#f08a0c" />
          <stop offset="1" stopColor="#b9530a" />
        </radialGradient>
        <radialGradient id="dw-mg-1" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ffe066" />
          <stop offset="0.55" stopColor="#f6bd16" />
          <stop offset="1" stopColor="#c7860a" />
        </radialGradient>
        <linearGradient id="dw-leaf" x1="0" x2="1">
          <stop offset="0" stopColor="#2f6b2a" />
          <stop offset="0.5" stopColor="#4c8f37" />
          <stop offset="1" stopColor="#24521f" />
        </linearGradient>
      </defs>
      <g filter="url(#dw-ruffle)">
        {flowers.map((f, i) => (
          <g key={i} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.rot.toFixed(0)})`}>
            <circle r={f.r.toFixed(2)} fill={`url(#dw-mg-${f.tone})`} />
            <circle
              r={(f.r * 0.55).toFixed(2)}
              fill="none"
              stroke="#a5470a"
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray="1.4 1.2"
            />
          </g>
        ))}
      </g>
      {ties.map((x, i) => (
        <g key={i} transform={`translate(${x} 4)`}>
          <g className="dw-tie-sway" style={{ "--i": i } as CSSProperties}>
            {[-24, 0, 22].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <path d="M0 0 C 7 10, 7 26, 0 38 C -7 26, -7 10, 0 0 Z" fill="url(#dw-leaf)" />
                <path d="M0 2 L0 36" stroke="#b9d78a" strokeOpacity="0.55" strokeWidth="0.7" />
              </g>
            ))}
            <circle cy="2" r="7" fill="url(#dw-mg-0)" filter="url(#dw-ruffle)" />
          </g>
        </g>
      ))}
    </svg>
  );
}

/* Filament bulbs on a dark wire, draped in shallow loops. */
function StringLights() {
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

/* Toran, string lights and lanterns hung under the header. */
export function DiwaliHeroDecor() {
  return (
    <div className="dw-decor" aria-hidden data-theme-keep>
      <span className="dw-glow" />
      <Toran />
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
    <span className="dw-truck" aria-hidden data-theme-keep>
      {strand("is-roof", 22)}
      {strand("is-rail", 22)}
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
