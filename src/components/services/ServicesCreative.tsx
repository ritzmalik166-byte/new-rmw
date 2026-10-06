"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

registerGsap();

// Measured in source pixels of /service/image 817.png (771 x 402).
const ART_W = 771;
const ART_H = 402;
const ROD_BOTTOM = 66;

const CARDS = [
  { label: "Branding & Identity Development", from: 0, to: 179, pivot: 107.5 },
  { label: "Graphic Design", from: 179, to: 313, pivot: 246.5 },
  { label: "Logo Design", from: 313, to: 454, pivot: 385 },
  { label: "Print Advertising Design", from: 454, to: 590, pivot: 523.5 },
  { label: "Packaging Design", from: 590, to: ART_W, pivot: 662.5 },
] as const;

const pctX = (px: number) => `${((px / ART_W) * 100).toFixed(3)}%`;
const rodPct = `${((ROD_BOTTOM / ART_H) * 100).toFixed(3)}%`;

export function ServicesCreative() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  const swings = useRef(new WeakMap<HTMLElement, gsap.core.Timeline>());

  const playSwing = (card: HTMLElement, dir: number, amp: number, delay = 0) => {
    swings.current.get(card)?.kill();
    const tl = gsap
      .timeline({ delay })
      .to(card, { rotation: dir * amp, duration: 0.35, ease: "sine.out" })
      .to(card, { rotation: -dir * amp * 0.6, duration: 0.55, ease: "sine.inOut" })
      .to(card, { rotation: dir * amp * 0.34, duration: 0.5, ease: "sine.inOut" })
      .to(card, { rotation: -dir * amp * 0.16, duration: 0.45, ease: "sine.inOut" })
      .to(card, { rotation: 0, duration: 0.5, ease: "sine.out" });
    swings.current.set(card, tl);
  };

  useGSAP(
    () => {
      const root = rootRef.current;
      const rack = root?.querySelector<HTMLElement>(".svc-creative-rack");
      if (!root || !rack || !ready || reduced) return;

      const trigger = ScrollTrigger.create({
        trigger: rack,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const cards = gsap.utils.toArray<HTMLElement>(".svc-creative-card", rack);
          cards.forEach((card, index) => {
            playSwing(card, index % 2 === 0 ? 1 : -1, 4.5, index * 0.12);
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  const swing = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduced) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const pivotX = rect.left + rect.width * (parseFloat(card.dataset.pivot ?? "50") / 100);

    // Pushed rightwards the card's bottom swings right, which is a negative rotation.
    const push = event.movementX !== 0 ? Math.sign(event.movementX) : event.clientX < pivotX ? 1 : -1;
    const dir = -push;
    const amp = gsap.utils.clamp(3, 8, 3.5 + Math.abs(event.movementX) * 0.35);

    playSwing(card, dir, amp);
  };

  return (
    <section ref={rootRef} className="svc-creative" aria-labelledby="svc-creative-title">
      {/* <div className="svc-creative-border" aria-hidden /> */}
      <div className="svc-creative-inner">
        <div className="svc-creative-copy">
          <p className="svc-creative-kicker">KM 02 · Distinct by design</p>
          <h2 id="svc-creative-title" className="svc-creative-title">
            Creative Services
          </h2>
          <p className="svc-creative-lede">
            From evocative visual identities to bespoke packaging and brand systems. We combine
            traditional Indian visual vernacular with contemporary design precision.
          </p>
          <Link className="svc-creative-cta" href="/#start-a-project">
            Get a Free Marketing Consultation <span aria-hidden>→</span>
          </Link>
        </div>

        <div
          className="svc-creative-rack"
          role="img"
          aria-label={`Creative services: ${CARDS.map((card) => card.label).join(", ")}`}
        >
          <span className="svc-creative-rod" style={{ clipPath: `inset(0 0 calc(100% - ${rodPct}) 0)` }} />
          {CARDS.map((card) => {
            const pivot = (card.pivot / ART_W) * 100;
            return (
              <span
                key={card.label}
                className="svc-creative-card"
                data-pivot={pivot.toFixed(3)}
                style={{
                  clipPath: `inset(${rodPct} ${pctX(ART_W - card.to)} 0 ${pctX(card.from)})`,
                  transformOrigin: `${pivot.toFixed(3)}% ${rodPct}`,
                }}
                onPointerEnter={swing}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
