"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type CSSProperties } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { ServicesRouteTruck } from "./ServicesRouteTruck";

registerGsap();

const CARDS = [
  {
    id: "celebrity",
    kicker: "KM 07 · Borrow the spotlight",
    title: "Celebrity Endorsement Services",
    items: [
      "Celebrity Identification",
      "Contract Negotiations",
      "Creative Collaboration",
      "Campaign Integration",
      "Public Relations",
      "Legal Compliance",
    ],
    tone: "linear-gradient(135deg, #cf1b4b 0%, #a3184f 100%)",
  },
  {
    id: "influencer",
    kicker: "KM 08 · Make people listen",
    title: "Influencer Marketing Services",
    items: [
      "Influencer Identification",
      "Cost-Benefit Analysis",
      "Terms Negotiations",
      "Creative Collaboration",
      "Campaign Integration",
      "Messaging Optimization",
    ],
    tone: "linear-gradient(135deg, #2457dc 0%, #1e3a8a 100%)",
  },
] as const;

const HIDDEN_RIGHT = "inset(0% 100% 0% 0%)";
const HIDDEN_BOTTOM = "inset(0% 0% 100% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";
const RAIL_START = "top 80%";
const RAIL_END = "bottom 70%";

export function ServicesStarPower() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const rail = root.querySelector<HTMLElement>(".svc-star-rail");
      const rule = root.querySelector<HTMLElement>(".svc-star-rule");
      const grid = root.querySelector<HTMLElement>(".svc-star-grid");
      if (!rail || !rule || !grid) return;

      if (reduced) {
        gsap.set([rail, rule], { clipPath: SHOWN });
        return;
      }

      gsap.fromTo(
        rule,
        { clipPath: HIDDEN_RIGHT },
        {
          clipPath: SHOWN,
          ease: "none",
          scrollTrigger: { trigger: rule, start: "top 88%", end: "top 40%", scrub: true },
        },
      );

      gsap.fromTo(
        rail,
        { clipPath: HIDDEN_BOTTOM },
        {
          clipPath: SHOWN,
          ease: "none",
          scrollTrigger: { trigger: root, start: RAIL_START, end: RAIL_END, scrub: true },
        },
      );

      /* Each card lands like a bubble: a soft blob that overshoots, wobbles
         and settles into the card, then its contents pop in. */
      const cards = gsap.utils.toArray<HTMLElement>(".svc-star-card", grid);
      gsap.set(cards, { borderRadius: 220 });
      const bubble = gsap.timeline({
        scrollTrigger: { trigger: grid, start: "top 82%", once: true },
      });

      cards.forEach((card, i) => {
        const head = card.querySelectorAll(".svc-star-kicker, .svc-star-card-title");
        const badges = card.querySelectorAll(".svc-star-badge");
        const items = card.querySelectorAll(".svc-star-item");
        const at = i * 0.2;

        bubble
          .fromTo(
            card,
            { autoAlpha: 0, scale: 0.35, y: 90 },
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 1.15,
              ease: "elastic.out(1, 0.55)",
              clearProps: "transform,opacity,visibility",
            },
            at,
          )
          .to(card, { borderRadius: 16, duration: 0.7, ease: "power3.out", clearProps: "borderRadius" }, at + 0.1)
          .fromTo(
            head,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.08, clearProps: "all" },
            at + 0.35,
          )
          .fromTo(
            badges,
            { scale: 0 },
            { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.06, clearProps: "all" },
            at + 0.5,
          )
          .fromTo(
            items,
            { autoAlpha: 0, x: -10 },
            { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out", stagger: 0.06, clearProps: "all" },
            at + 0.55,
          );
      });
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="svc-star" aria-labelledby="svc-star-title">
      <div className="svc-star-inner">
        <span className="svc-star-rail" aria-hidden />
        <ServicesRouteTruck className="svc-star-truck" start={RAIL_START} end={RAIL_END} />

        <div className="svc-star-head">
          <h2 id="svc-star-title" className="svc-star-title">
            Star power
          </h2>
          <span className="svc-star-rule" aria-hidden />
          <p className="svc-star-km">03 · KM 04</p>
        </div>

        <div className="svc-star-grid">
          {CARDS.map((card) => (
            <article
              key={card.id}
              className="svc-star-card"
              style={{ "--tone": card.tone } as CSSProperties}
            >
              <p className="svc-star-kicker">{card.kicker}</p>
              <h3 className="svc-star-card-title">{card.title}</h3>
              <ol className="svc-star-list">
                {card.items.map((item, i) => (
                  <li key={item} style={{ "--i": i } as CSSProperties}>
                    <span className="svc-star-badge" aria-hidden>
                      {i + 1}
                    </span>
                    <span className="svc-star-item">{item}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
