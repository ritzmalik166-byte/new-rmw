"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { PORTFOLIO_REASONS, PORTFOLIO_STATS } from "@/lib/portfolio";

registerGsap();

export function PortfolioWhy() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      root.querySelectorAll<HTMLElement>("[data-pf-count]").forEach((node) => {
        const target = Number(node.dataset.pfCount);
        const counter = { value: 0 };
        node.textContent = "0";
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = String(Math.round(counter.value));
          },
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
        });
      });

      gsap.fromTo(
        root.querySelectorAll(".pf-reason"),
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.querySelector(".pf-reasons"), start: "top 85%", once: true },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="hm pf-why" aria-labelledby="pf-why-title">
      <div className="hm-wrap">
        <header className="pf-head is-row">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">KM 03</span>
              <span>Why the work works</span>
            </p>
            <HmTitle
              id="pf-why-title"
              lines={[{ text: "Why brands choose" }, { text: "Ritz Media World.", accent: true }]}
            />
          </div>
          <p data-hm-fade className="hm-lede">
            Good-looking work is the start. Here is what sits behind every piece on this page.
          </p>
        </header>

        <dl className="pf-stats">
          {PORTFOLIO_STATS.map((stat) => (
            <div key={stat.label} className="pf-stat">
              <dt>{stat.label}</dt>
              <dd>
                <span data-pf-count={stat.value}>{stat.value}</span>
                {stat.suffix}
              </dd>
            </div>
          ))}
        </dl>

        <ol className="pf-reasons">
          {PORTFOLIO_REASONS.map((reason, index) => (
            <li key={reason.title} className="pf-reason">
              <span className="pf-reason-no">{String(index + 1).padStart(2, "0")}</span>
              <h3>{reason.title}</h3>
              <p>{reason.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
