"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type CSSProperties } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

const INDUSTRIES = [
  { name: "Real Estate", scenario: "Launch to site visits" },
  { name: "Healthcare", scenario: "OPD & IPD footfall" },
  { name: "Education", scenario: "Admission season" },
  { name: "E-commerce", scenario: "Cart to checkout" },
  { name: "Manufacturing", scenario: "Dealer & B2B leads" },
  { name: "Startups", scenario: "Zero to launch" },
];

const SLOT_X = INDUSTRIES.map((_, i) => 12 + i * 15.2);

/* Each dig starts when the truck's nose is this far (share of road width) short of the sign,
   and is fully out by the time it has covered DIG_SPAN more. */
const DIG_LEAD = 0.13;
const DIG_SPAN = 0.12;

/* Jagged cut around an ellipse; deterministic so server and client markup match. */
const PIT_POINTS = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2;
  const jitter = 1 + Math.sin(i * 12.9898) * 0.07 + (i % 3 === 0 ? -0.05 : 0.03);
  return [65 + Math.cos(a) * 61 * jitter, 19 + Math.sin(a) * 15 * jitter] as const;
});
const toPath = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
const PIT_HOLE = `${toPath(PIT_POINTS)} Z`;
const PIT_LIP = toPath(PIT_POINTS.slice(0, 15).map(([x, y]) => [x, y + 2.4] as const));

const CRACKS = [
  "M100 30 L74 25 L58 28 L40 21 L22 24",
  "M100 30 L128 23 L146 26 L162 17 L182 20",
  "M100 30 L84 42 L68 47 L50 55",
  "M100 30 L120 41 L138 45 L156 54",
  "M58 28 L52 15",
  "M146 26 L154 38",
];

const CHUNKS = [
  { x: -78, y: 5, r: -28, s: 1, peak: 46, w: 16, h: 9 },
  { x: -56, y: -9, r: 44, s: 0.8, peak: 64, w: 12, h: 8 },
  { x: 66, y: 3, r: 32, s: 1.05, peak: 52, w: 17, h: 10 },
  { x: 84, y: -6, r: -54, s: 0.7, peak: 70, w: 12, h: 7 },
  { x: -34, y: 15, r: 14, s: 0.62, peak: 38, w: 11, h: 7 },
  { x: 40, y: 14, r: -20, s: 0.75, peak: 42, w: 13, h: 8 },
  { x: -94, y: -1, r: 72, s: 0.5, peak: 58, w: 10, h: 6 },
];

const DUST = [-34, -8, 18, 40];

/* Two-layer city silhouette on a 1560×420 canvas (extra width covers the parallax drift). */
const SKY_H = 420;
const buildSkyline = (seed: number, minH: number, spread: number) => {
  const out: { x: number; w: number; h: number }[] = [];
  for (let x = 0, i = 0; x < 1560; i++) {
    const w = 38 + ((i * 37 + seed) % 5) * 13;
    const h = minH + ((i * 53 + seed * 3) % 7) * spread;
    out.push({ x, w, h });
    x += w + 4 + ((i + seed) % 3) * 6;
  }
  return out;
};
const SKYLINE_FAR = buildSkyline(2, 170, 30);
const SKYLINE_NEAR = buildSkyline(5, 80, 24);

const WHEELS = [42, 72, 204];
const WHEEL_BOLTS = [0, 72, 144, 216, 288].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a) * 4.6, Math.sin(a) * 4.6] as const;
});

function RmwTruck() {
  return (
    <svg className="svc-ind-truck-art" viewBox="0 0 240 120" aria-hidden focusable="false">
      <defs>
        <linearGradient id="svc-ind-box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.75" stopColor="#eef0f5" />
          <stop offset="1" stopColor="#d3d7e1" />
        </linearGradient>
        <linearGradient id="svc-ind-cab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7bd45" />
          <stop offset="0.6" stopColor="#e8a21e" />
          <stop offset="1" stopColor="#b5770b" />
        </linearGradient>
        <linearGradient id="svc-ind-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cbe7f7" />
          <stop offset="1" stopColor="#557f9f" />
        </linearGradient>
        <radialGradient id="svc-ind-lamp">
          <stop offset="0" stopColor="#fff6c8" />
          <stop offset="1" stopColor="#fff6c8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="122" cy="110" rx="112" ry="5" fill="#000" opacity="0.28" />

      <g className="svc-ind-truck-body">
        <rect x="6" y="12" width="154" height="74" rx="4" fill="url(#svc-ind-box)" stroke="#1b1446" strokeWidth="1.5" />
        {[30, 54, 78, 102, 126].map((x) => (
          <line key={x} x1={x} y1="14" x2={x} y2="84" stroke="#e1e4ec" strokeWidth="1" />
        ))}
        <path d="M7 64 C50 52 100 76 159 58 V71 C100 88 50 66 7 78 Z" fill="#d0172f" />
        <text x="14" y="36" className="svc-ind-truck-brand" textLength="138" lengthAdjust="spacingAndGlyphs">
          RITZ MEDIA WORLD
        </text>
        <text x="14" y="49" className="svc-ind-truck-tag" textLength="138" lengthAdjust="spacingAndGlyphs">
          Next destination: your industry →
        </text>
        <rect x="9" y="8" width="7" height="3" rx="1" fill="#ff8a1a" />
        <rect x="150" y="8" width="7" height="3" rx="1" fill="#ff8a1a" />

        <rect x="6" y="85" width="228" height="8" rx="2" fill="#26262c" />
        <rect x="161" y="22" width="4" height="64" rx="1.5" fill="#aeb2bc" />
        <rect x="160" y="20" width="6" height="4" rx="1" fill="#7d818b" />

        <path
          d="M166 38 H204 Q212 38 216 45 L228 64 Q232 69 232 76 V90 H166 Z"
          fill="url(#svc-ind-cab)"
          stroke="#1b1446"
          strokeWidth="1.5"
        />
        <path d="M188 44 H204 Q209 44 212 49 L221 64 H188 Z" fill="url(#svc-ind-glass)" stroke="#1b1446" strokeWidth="1.2" />
        <circle cx="199" cy="53" r="4" fill="#2c2440" />
        <path d="M191 64 Q199 55 207 64 Z" fill="#2c2440" />
        <path d="M207 45 L211 45 L201 63 L197 63 Z" fill="#ffffff" opacity="0.4" />
        <path d="M184 42 V88" stroke="#a86f0b" strokeWidth="1" />
        <rect x="188" y="68" width="7" height="2" rx="1" fill="#7a5208" />
        <rect x="181" y="45" width="3" height="11" rx="1" fill="#26262c" />
        <rect x="166" y="74" width="66" height="3" fill="#d0172f" />
        <circle cx="231" cy="79" r="10" fill="url(#svc-ind-lamp)" />
        <rect x="227" y="76" width="5" height="6" rx="1.5" fill="#fff3b0" stroke="#1b1446" strokeWidth="0.8" />
        <rect x="160" y="88" width="76" height="7" rx="2" fill="#3a3a42" />
        <rect x="88" y="88" width="5" height="15" rx="1" fill="#1b1b20" />
        {WHEELS.map((cx) => (
          <circle key={cx} cx={cx} cy="96" r="16" fill="#18181d" />
        ))}
      </g>

      {WHEELS.map((cx) => (
        <g key={cx} className="svc-ind-wheel">
          <circle cx={cx} cy="96" r="13" fill="#1d1d22" />
          <circle cx={cx} cy="96" r="12" fill="none" stroke="#34343b" strokeWidth="1.5" strokeDasharray="2 2.4" />
          <circle cx={cx} cy="96" r="7.5" fill="#c9ccd4" />
          <circle cx={cx} cy="96" r="2.6" fill="#6b6f7a" />
          {WHEEL_BOLTS.map(([bx, by]) => (
            <circle key={`${bx}${by}`} cx={cx + bx} cy={96 + by} r="1.1" fill="#585c66" />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function ServicesIndustries() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = root?.querySelector<HTMLElement>(".svc-ind-stage");
      const world = root?.querySelector<HTMLElement>(".svc-ind-world");
      const truck = root?.querySelector<HTMLElement>(".svc-ind-truck");
      if (!root || !stage || !world || !truck || !ready) return;

      const slots = gsap.utils.toArray<HTMLElement>(".svc-ind-slot", root);
      const digs = slots.map((slot) => {
        const q = gsap.utils.selector(slot);
        const dig = gsap.timeline({ paused: true });

        dig
          .fromTo(q(".svc-ind-cracks"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0)
          .fromTo(
            q(".svc-ind-cracks path"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.3, stagger: 0.03, ease: "power2.out" },
            0,
          )
          .fromTo(q(".svc-ind-mark"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12 }, 0.2)
          .fromTo(
            q(".svc-ind-pit"),
            { scale: 0.15, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2)" },
            0.2,
          )
          .fromTo(
            q(".svc-ind-dust i"),
            { scale: 0.2, autoAlpha: 0, y: 0 },
            { scale: 1.6, autoAlpha: 0.9, y: -18, duration: 0.25, stagger: 0.04, ease: "power2.out" },
            0.2,
          )
          .to(
            q(".svc-ind-dust i"),
            { scale: 2.5, autoAlpha: 0, y: -46, duration: 0.5, stagger: 0.04, ease: "power1.in" },
            0.5,
          )
          .fromTo(
            q(".svc-ind-mound"),
            { scaleY: 0, scaleX: 0.5 },
            { scaleY: 1, scaleX: 1, duration: 0.35, stagger: 0.05, ease: "power2.out" },
            0.32,
          )
          .fromTo(
            q(".svc-ind-sign"),
            { yPercent: 115, rotation: -6 },
            { yPercent: 0, rotation: 0, duration: 0.55, ease: "back.out(1.5)" },
            0.4,
          )
          .fromTo(
            q(".svc-ind-plate"),
            { scaleY: 0, autoAlpha: 0 },
            { scaleY: 1, autoAlpha: 1, duration: 0.2, ease: "back.out(2)" },
            0.9,
          )
          .fromTo(
            q(".svc-ind-cone"),
            { y: -26, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.06, ease: "bounce.out" },
            0.85,
          );

        q(".svc-ind-chunk").forEach((chunk, i) => {
          const c = CHUNKS[i];
          dig
            .fromTo(
              chunk,
              { x: 0, rotation: 0, scale: 0.5, autoAlpha: 0 },
              { x: c.x, rotation: c.r, scale: c.s, autoAlpha: 1, duration: 0.5, ease: "power1.out" },
              0.22,
            )
            .fromTo(chunk, { y: 0 }, { y: -c.peak, duration: 0.22, ease: "power2.out" }, 0.22)
            .to(chunk, { y: c.y, duration: 0.28, ease: "power2.in" }, 0.44);
        });

        return dig;
      });

      if (reduced) {
        digs.forEach((dig) => dig.progress(1));
        gsap.set(truck, { x: 12 });
        return;
      }

      let worldW = world.offsetWidth;
      let truckW = truck.offsetWidth;
      const wheels = gsap.utils.toArray<SVGGElement>(".svc-ind-wheel", truck);

      const sync = () => {
        const x = gsap.getProperty(truck, "x") as number;
        const nose = x + truckW;
        /* Roll without slipping: wheel diameter is 26 of the drawing's 240 units. */
        const spin = (x / (Math.PI * truckW * (26 / 240))) * 360;
        wheels.forEach((wheel) => {
          wheel.style.transform = `rotate(${spin.toFixed(1)}deg)`;
        });
        digs.forEach((dig, i) => {
          const start = worldW * (SLOT_X[i] / 100 - DIG_LEAD);
          dig.progress(gsap.utils.clamp(0, 1, (nose - start) / (worldW * DIG_SPAN)));
        });
      };

      gsap
        .timeline({
          defaults: { ease: "none" },
          onUpdate: sync,
          scrollTrigger: {
            trigger: root,
            start: () => (root.offsetHeight > window.innerHeight ? "bottom bottom" : "top top"),
            end: () => {
              const tablet = window.matchMedia("(min-width: 761px) and (max-width: 1100px)").matches;
              const distance = tablet
                ? Math.max(520, world.offsetWidth * 0.5)
                : Math.max(1300, world.offsetWidth * 1.1);
              return `+=${Math.round(distance)}`;
            },
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              worldW = world.offsetWidth;
              truckW = truck.offsetWidth;
              sync();
            },
          },
        })
        .fromTo(
          truck,
          { x: () => -world.offsetLeft - truck.offsetWidth - 24 },
          {
            x: () => Math.max(world.offsetWidth, stage.clientWidth - world.offsetLeft) + 24,
            duration: 1,
          },
          0,
        )
        .fromTo(world, { x: 0 }, { x: () => Math.min(0, stage.clientWidth - world.offsetWidth), duration: 1 }, 0)
        .fromTo(root.querySelector(".svc-ind-skyline"), { x: 0 }, { x: -110, duration: 1 }, 0)
        .fromTo(root.querySelectorAll(".svc-ind-cloud"), { x: 0 }, { x: (i) => -60 - i * 50, duration: 1 }, 0);

      sync();

      const heads = root.querySelectorAll(".svc-ind-kicker, .svc-ind-title, .svc-ind-lede");
      gsap.fromTo(
        heads,
        { y: 22, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="svc-ind" aria-labelledby="svc-ind-title">
      <svg className="svc-ind-defs" width="0" height="0" aria-hidden focusable="false">
        <defs>
          <linearGradient id="svc-ind-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1c22" />
            <stop offset="0.15" stopColor="#2b2b32" />
            <stop offset="0.16" stopColor="#a1998b" />
            <stop offset="0.33" stopColor="#7f776a" />
            <stop offset="0.34" stopColor="#7c5637" />
            <stop offset="0.68" stopColor="#523521" />
            <stop offset="1" stopColor="#1d130b" />
          </linearGradient>
        </defs>
      </svg>

      <div className="svc-ind-head">
        <div>
          <p className="svc-ind-kicker">Next destinations</p>
          <h2 id="svc-ind-title" className="svc-ind-title">
            Industries We Serve
          </h2>
        </div>
        <p className="svc-ind-lede">Same engines, tuned for the way each sector buys.</p>
      </div>

      <div className="svc-ind-stage">
        <span className="svc-ind-sun" aria-hidden />
        <span className="svc-ind-cloud is-a" aria-hidden />
        <span className="svc-ind-cloud is-b" aria-hidden />
        <span className="svc-ind-cloud is-c" aria-hidden />
        <svg
          className="svc-ind-skyline"
          viewBox={`0 0 1560 ${SKY_H}`}
          preserveAspectRatio="xMinYMax slice"
          aria-hidden
          focusable="false"
        >
          <defs>
            <pattern id="svc-ind-windows" width="14" height="16" patternUnits="userSpaceOnUse">
              <rect x="4" y="4" width="6" height="7" fill="#e8ecf5" />
            </pattern>
          </defs>
          {SKYLINE_FAR.map((b) => (
            <rect key={`f${b.x}`} x={b.x} y={SKY_H - b.h} width={b.w} height={b.h} fill="#e2e6f1" />
          ))}

          {/* tower crane over a site under construction */}
          <g stroke="#c3cadb" strokeWidth="3" fill="none">
            <path d="M1012 420 V96 M1028 420 V96" />
            <path d="M1012 400 L1028 380 L1012 360 L1028 340 L1012 320 L1028 300 L1012 280 L1028 260 L1012 240 L1028 220 L1012 200 L1028 180 L1012 160 L1028 140 L1012 120 L1028 100" strokeWidth="1.5" />
            <path d="M930 96 H1210 M960 96 L1020 66 L1190 96" />
            <path d="M1160 96 V190" strokeWidth="1.5" />
          </g>
          <rect x="934" y="96" width="34" height="18" fill="#c3cadb" />
          <rect x="1150" y="190" width="20" height="10" fill="#c3cadb" />

          {/* factory with chimney */}
          <path d="M300 420 V330 L340 306 V330 L380 306 V330 L420 306 V420 Z" fill="#d3d9e7" />
          <rect x="392" y="200" width="16" height="120" fill="#d3d9e7" />
          <g className="svc-ind-chimney-smoke" fill="#e6e9f2">
            <circle cx="400" cy="190" r="10" />
            <circle cx="400" cy="190" r="12" />
            <circle cx="400" cy="190" r="9" />
          </g>

          {SKYLINE_NEAR.map((b) => (
            <g key={`n${b.x}`}>
              <rect x={b.x} y={SKY_H - b.h} width={b.w} height={b.h} fill="#d4d9e7" />
              <rect x={b.x} y={SKY_H - b.h} width={b.w} height={b.h} fill="url(#svc-ind-windows)" />
            </g>
          ))}
        </svg>
        <div className="svc-ind-road" aria-hidden />
        <div className="svc-ind-ground" aria-hidden />

        <div className="svc-ind-world">
          <ul className="svc-ind-signs">
            {INDUSTRIES.map((industry, i) => (
              <li key={industry.name} className="svc-ind-slot" style={{ "--x": SLOT_X[i] } as CSSProperties}>
                <span className="svc-ind-mark" aria-hidden />
                <svg className="svc-ind-cracks" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden>
                  {CRACKS.map((d) => (
                    <path key={d} d={d} pathLength={1} />
                  ))}
                </svg>
                <svg className="svc-ind-pit" viewBox="0 0 130 38" preserveAspectRatio="none" aria-hidden>
                  <path className="svc-ind-pit-hole" d={PIT_HOLE} />
                  <path className="svc-ind-pit-lip" d={PIT_LIP} />
                </svg>

                <div className="svc-ind-rise">
                  <div className="svc-ind-sign">
                    <span className="svc-ind-board">
                      <span className="svc-ind-arrow" aria-hidden>
                        →
                      </span>
                      <span className="svc-ind-name">{industry.name}</span>
                    </span>
                    <span className="svc-ind-posts">
                      <span className="svc-ind-post is-left" aria-hidden />
                      <span className="svc-ind-post is-right" aria-hidden />
                      <span className="svc-ind-plate">{industry.scenario}</span>
                    </span>
                  </div>
                </div>

                <span className="svc-ind-mound is-left" aria-hidden />
                <span className="svc-ind-mound is-right" aria-hidden />
                {CHUNKS.map((c, ci) => (
                  <span
                    key={ci}
                    className="svc-ind-chunk"
                    style={{ "--w": `${c.w}px`, "--h": `${c.h}px` } as CSSProperties}
                    aria-hidden
                  />
                ))}
                <span className="svc-ind-cone is-left" aria-hidden />
                <span className="svc-ind-cone is-right" aria-hidden />
                <span className="svc-ind-dust" aria-hidden>
                  {DUST.map((dx) => (
                    <i key={dx} style={{ "--dx": `${dx}px` } as CSSProperties} />
                  ))}
                </span>
              </li>
            ))}
          </ul>

          <span className="svc-ind-truck" aria-hidden>
            <span className="svc-ind-exhaust">
              <i />
              <i />
              <i />
            </span>
            <RmwTruck />
          </span>
        </div>
      </div>
    </section>
  );
}
