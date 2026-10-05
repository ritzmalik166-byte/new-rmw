"use client";

import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";
import type { RenderKind } from "./ServicesRenderStage";

registerGsap();

const RenderStage = dynamic(
  () => import("./ServicesRenderStage").then((mod) => mod.ServicesRenderStage),
  {
    ssr: false,
    loading: () => <span className="svc-render-loading">Loading 3D scene…</span>,
  },
);

const RENDERS: { id: RenderKind; title: string; spec: string; copy: string }[] = [
  {
    id: "exterior",
    title: "3D Exterior Rendering",
    spec: "Golden hour · 4K",
    copy: "Towers, facades and entrances lit at golden hour, ready for hoardings and launch ads.",
  },
  {
    id: "interior",
    title: "3D Interior Rendering",
    spec: "Sample flat · Warm light",
    copy: "Sample flats styled down to the cushions, so buyers can picture living there.",
  },
  {
    id: "aerial",
    title: "Aerial & Township 3D Visualization",
    spec: "Master plan · Bird's eye",
    copy: "Master plans turned into a bird's-eye view of towers, roads, greens and amenities.",
  },
  {
    id: "plan",
    title: "3D Floor Plan Rendering",
    spec: "2D to 3D · Furnished",
    copy: "Flat drawings extruded into furnished 3D layouts buyers understand at a glance.",
  },
  {
    id: "amenity",
    title: "Amenity & Landscape Rendering",
    spec: "Pool deck · Clubhouse",
    copy: "Pools, clubhouses and gardens rendered for brochures and sales galleries.",
  },
];

const BUCKET_COLS = 8;
const BUCKET_ROWS = 5;
const BUCKETS = Array.from({ length: BUCKET_COLS * BUCKET_ROWS }, (_, i) => i);

export function ServicesRendering() {
  const rootRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const { ready, reduced } = useMotion();
  const render = RENDERS[active];

  /* Section entrance. */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const heads = root.querySelectorAll(".svc-render-kicker, .svc-render-title, .svc-render-lede");
      const tabs = root.querySelectorAll(".svc-render-tab");
      const view = root.querySelector(".svc-render-view");

      gsap.set(heads, { y: 22, autoAlpha: 0 });
      gsap.set(view, { y: 36, scale: 0.97, autoAlpha: 0 });
      gsap.set(tabs, { x: 30, autoAlpha: 0 });

      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top 72%", once: true } })
        .to(heads, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" })
        .to(view, { y: 0, scale: 1, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .to(tabs, { x: 0, autoAlpha: 1, duration: 0.55, stagger: 0.07, ease: "power3.out" }, "-=0.55");
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  /* Every new render resolves bucket by bucket from the centre, like a render engine. */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const buckets = root.querySelectorAll(".svc-render-bucket");
      const hud = root.querySelector(".svc-render-hud");
      const pct = root.querySelector(".svc-render-pct");
      const counter = { p: 0 };

      gsap
        .timeline()
        .set(buckets, { autoAlpha: 1 })
        .set(hud, { autoAlpha: 1 })
        .to(
          buckets,
          {
            autoAlpha: 0,
            duration: 0.22,
            ease: "power1.out",
            stagger: { grid: [BUCKET_ROWS, BUCKET_COLS], from: "center", amount: 1 },
          },
          0.35,
        )
        .to(
          counter,
          {
            p: 100,
            duration: 1.3,
            ease: "none",
            onUpdate: () => {
              if (pct) pct.textContent = `${Math.round(counter.p)}%`;
            },
          },
          0.3,
        )
        .to(hud, { autoAlpha: 0, duration: 0.3 }, "+=0.35");
    },
    { scope: rootRef, dependencies: [active, ready, reduced] },
  );

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + RENDERS.length) % RENDERS.length;
    tabRefs.current[next]?.focus();
    setActive(next);
  };

  return (
    <section ref={rootRef} className="svc-render" aria-labelledby="svc-render-title">
      <header className="svc-render-head">
        <div className="svc-render-head-inner">
          <div>
            <p className="svc-render-kicker">KM 09</p>
            <h2 id="svc-render-title" className="svc-render-title">
              3D Rendering Services
            </h2>
          </div>
          <p className="svc-render-lede">
            Photoreal renders and walkthrough stills for real estate launches, used across
            hoardings, brochures, ads and sales galleries.
          </p>
        </div>
      </header>

      <div className="svc-render-body">
        <div
          id="svc-render-panel"
          className="svc-render-view"
          role="tabpanel"
          aria-labelledby={`svc-render-tab-${render.id}`}
        >
          <RenderStage kind={render.id} reduced={reduced} />

          <span className="svc-render-buckets" aria-hidden>
            {BUCKETS.map((i) => (
              <i key={i} className="svc-render-bucket" />
            ))}
          </span>

          <span className="svc-render-hud" aria-hidden>
            <i /> Rendering <b className="svc-render-pct">0%</b> · 3840×2160
          </span>
          <span className="svc-render-live" aria-hidden>
            Live 3D
          </span>

          <p className="svc-render-now">
            <span>Now showing:</span> {render.title}
          </p>
          <p className="sr-only">{render.copy}</p>
        </div>

        <div className="svc-render-side">
          <div className="svc-render-tabs" role="tablist" aria-label="3D rendering services">
            {RENDERS.map((item, i) => (
              <button
                key={item.id}
                ref={(node) => {
                  tabRefs.current[i] = node;
                }}
                id={`svc-render-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="svc-render-panel"
                tabIndex={i === active ? 0 : -1}
                className={cn("svc-render-tab", i === active && "is-active")}
                onClick={() => setActive(i)}
                onKeyDown={(event) => onTabKey(event, i)}
              >
                <span className="svc-render-thumb" aria-hidden>
                  {THUMBS[item.id]}
                </span>
                <span className="svc-render-tab-text">
                  <span className="svc-render-tab-title">{item.title}</span>
                  <span className="svc-render-tab-spec">{item.spec}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="svc-render-copy">{render.copy}</p>
        </div>
      </div>
    </section>
  );
}

const THUMBS: Record<RenderKind, ReactNode> = {
  exterior: (
    <svg viewBox="0 0 32 32">
      <path d="M6 28V10l8-4v22M14 28V12h12v16M4 28h24" />
      <path d="M9 13h2M9 17h2M9 21h2M18 16h2M22 16h2M18 20h2M22 20h2" />
    </svg>
  ),
  interior: (
    <svg viewBox="0 0 32 32">
      <path d="M5 21v-5a2 2 0 0 1 4 0v2h14v-2a2 2 0 0 1 4 0v5z" />
      <path d="M9 18v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M7 21v3M25 21v3" />
    </svg>
  ),
  aerial: (
    <svg viewBox="0 0 32 32">
      <path d="M4 10l12-6 12 6-12 6z" />
      <path d="M4 16l12 6 12-6M4 22l12 6 12-6" />
    </svg>
  ),
  plan: (
    <svg viewBox="0 0 32 32">
      <path d="M5 5h22v22H5z" />
      <path d="M16 5v9M16 18v9M5 16h7M15 16h1M20 18h7" />
    </svg>
  ),
  amenity: (
    <svg viewBox="0 0 32 32">
      <path d="M4 24c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0 4-1.5 6 0" />
      <path d="M10 21V7a3 3 0 0 1 6 0M10 12h6M10 17h6" />
    </svg>
  ),
};
