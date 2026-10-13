"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";
import { HmArrow, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio";

registerGsap();

export function PortfolioMore({ slug, km }: { slug: string; km: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef);

  const others = PORTFOLIO_CATEGORIES.filter((category) => category.href !== `/portfolio/${slug}`);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.fromTo(
        root.querySelectorAll(".pfd-more-card"),
        { x: 120, autoAlpha: 0, rotation: 6 },
        {
          x: 0,
          autoAlpha: 1,
          rotation: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: root.querySelector(".pfd-more-list"), start: "top 85%", once: true },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="hm pfd-more" aria-labelledby="pfd-more-title">
      <div className="hm-wrap">
        <header className="pf-head is-row">
          <div>
            <p data-hm-fade className="hm-kicker is-light">
              <span className="hm-pill">{km}</span>
              <span>Next stop</span>
            </p>
            <HmTitle
              id="pfd-more-title"
              lines={[{ text: "Explore our" }, { text: "latest work.", accent: true }]}
            />
          </div>
          <TransitionLink data-hm-fade href="/portfolio" className="hm-link is-light">
            Back to the full portfolio
            <HmArrow />
          </TransitionLink>
        </header>

        <ul className="pfd-more-list">
          {others.map((category) => (
            <li key={category.id} className="pfd-more-card" data-tone={category.tone}>
              <TransitionLink href={category.href}>
                <span className="pfd-more-media">
                  <Image
                    src={category.image}
                    alt={`${category.title} work by Ritz Media World`}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1100px) 33vw, 20vw"
                  />
                </span>
                <span className="pfd-more-title">
                  {category.title}
                  <HmArrow />
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
