"use client";

import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";
import { RENDER_ICONS, iconThumb } from "@/lib/service-icons";
import type { RenderKind } from "./ServicesRenderStage";

registerGsap();

const RenderStage = dynamic(
  () => import("./ServicesRenderStage").then((mod) => mod.ServicesRenderStage),
  {
    ssr: false,
    loading: () => <span className="svc-render-loading">Loading 3D scene…</span>,
  },
);

const RENDERS: { id: RenderKind; title: string; video?: string }[] = [
  {
    id: "exterior",
    title: "3D Exterior Rendering",
    video: "/services/3d-exterior-render.mp4",
  },
  {
    id: "interior",
    title: "3D Interior Rendering",
    video: "/services/3d-interior-render.mp4",
  },
  {
    id: "aerial",
    title: "Aerial & Township 3D Visualization",
    video: "/services/3d-aerial-township.mp4",
  },
  {
    id: "plan",
    title: "3D Floor Plan Rendering",
    video: "/services/3d-floor-plan.mp4",
  },
  {
    id: "amenity",
    title: "Amenity & Landscape Rendering",
    video: "/services/3d-amenity-landscape.mp4",
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
            <p className="svc-render-kicker">KM 09 · 3D Rendering</p>
            <h2 id="svc-render-title" className="svc-render-title">
              3D Rendering Services
            </h2>
            <div className="svc-explore-row">
              <Link className="svc-explore" href="/services/3d-rendering">
                Explore 3D Rendering Services <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <p className="svc-render-lede">
            Photorealistic renders for real estate developers, architects, interior designers, and
            builders, ready for hoardings, brochures, digital ads, sales galleries, and investor
            presentations.
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
          {render.video ? (
            <video
              key={render.video}
              className="svc-render-video"
              src={render.video}
              aria-label={`${render.title} walkthrough`}
              autoPlay={!reduced}
              controls={reduced}
              muted
              loop
              playsInline
            />
          ) : (
            <RenderStage kind={render.id} reduced={reduced} />
          )}

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={iconThumb(RENDER_ICONS[item.id])} alt={`${item.title} icon`} width={64} height={64} loading="lazy" />
                </span>
                <span className="svc-render-tab-text">
                  <span className="svc-render-tab-title">{item.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}