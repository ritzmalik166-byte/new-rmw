"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { HmArrow, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio";

registerGsap();

const pad = (value: number) => String(value).padStart(2, "0");

export function PortfolioExplore() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 861px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".pf-card", root);
        cards.forEach((card, index) => {
          const media = card.querySelector(".pf-card-media img");
          if (media) {
            gsap.fromTo(
              media,
              { yPercent: -8, scale: 1.12 },
              {
                yPercent: 8,
                scale: 1.12,
                ease: "none",
                scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          }

          const next = cards[index + 1];
          if (!next) return;
          gsap.fromTo(
            card.querySelector(".pf-card-inner"),
            { scale: 1 },
            {
              scale: 0.94,
              ease: "none",
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} id="explore" className="hm pf-explore" aria-labelledby="pf-explore-title">
      <div className="hm-wrap">
        <header className="pf-head is-row">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">KM 02</span>
              <span>Stop by stop</span>
            </p>
            <HmTitle
              id="pf-explore-title"
              lines={[{ text: "Explore our" }, { text: "latest work.", accent: true }]}
            />
          </div>
          <p data-hm-fade className="hm-lede">
            Six crafts, one studio. Scroll through each desk to see what it makes and the services behind
            the work.
          </p>
        </header>

        <ol className="pf-stack">
          {PORTFOLIO_CATEGORIES.map((category, index) => (
            <li
              key={category.id}
              id={category.id}
              className="pf-card"
              data-tone={category.tone}
              style={{ "--i": index } as CSSProperties}
            >
              <article className="pf-card-inner" aria-labelledby={`${category.id}-title`}>
                <TransitionLink href={category.href} className="pf-card-media" tabIndex={-1} aria-hidden>
                  <Image
                    src={category.image}
                    alt={`${category.title} work by Ritz Media World`}
                    fill
                    sizes="(max-width: 860px) 100vw, 50vw"
                  />
                  <span className="pf-card-tag">
                    Portfolio {pad(index + 1)} / {pad(PORTFOLIO_CATEGORIES.length)}
                  </span>
                </TransitionLink>
                <div className="pf-card-copy">
                  <p className="pf-card-km">KM {pad(index + 1)}</p>
                  <h3 id={`${category.id}-title`}>{category.title} Portfolio</h3>
                  <p className="pf-card-text">{category.copy}</p>
                  <ul className="pf-card-items">
                    {category.items.map((item, itemIndex) => (
                      <li key={item}>
                        <span>{pad(itemIndex + 1)}</span>
                        <h4>{item}</h4>
                      </li>
                    ))}
                  </ul>
                  <div className="pf-card-actions">
                    <TransitionLink href={category.href} className="hm-btn">
                      View {category.cta ?? category.title} work <span aria-hidden>→</span>
                    </TransitionLink>
                    <a href="/contact.html" target="_blank" rel="noopener noreferrer" className="hm-link">
                      Start a project
                      <HmArrow />
                    </a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
