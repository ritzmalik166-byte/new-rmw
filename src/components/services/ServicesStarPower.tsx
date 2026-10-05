"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

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
    fill: "#7a0f33",
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
    fill: "#13216a",
  },
] as const;

const HIDDEN_RIGHT = "inset(0% 100% 0% 0%)";
const HIDDEN_BOTTOM = "inset(0% 0% 100% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

export function ServicesStarPower() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const rail = root.querySelector<HTMLElement>(".svc-star-rail");
      const rule = root.querySelector<HTMLElement>(".svc-star-rule");
      if (!rail || !rule) return;

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
          scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 70%", scrub: true },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  const placePlus = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--px", `${event.clientX - rect.left}px`);
    card.style.setProperty("--py", `${event.clientY - rect.top}px`);
  };

  return (
    <section ref={rootRef} className="svc-star" aria-labelledby="svc-star-title">
      <div className="svc-star-inner">
        <span className="svc-star-rail" aria-hidden />

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
              style={{ "--tone": card.tone, "--fill": card.fill } as CSSProperties}
              onPointerEnter={placePlus}
              onPointerLeave={placePlus}
            >
              <span className="svc-star-plus" aria-hidden />
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
