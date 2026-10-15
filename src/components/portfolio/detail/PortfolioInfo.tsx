"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type CSSProperties } from "react";
import { HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { type PortfolioBlock, type PortfolioDetail, splitTitle } from "@/lib/portfolio-pages";

registerGsap();

const pad = (value: number) => String(value).padStart(2, "0");

export function PortfolioIntro({ detail, km }: { detail: PortfolioDetail; km: string }) {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef);

  return (
    <section ref={rootRef} className="hm pfd-intro" aria-labelledby="pfd-intro-title">
      <div className="hm-wrap pfd-intro-inner">
        <div>
          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">{km}</span>
            <span>{detail.name}</span>
          </p>
          <HmTitle id="pfd-intro-title" lines={splitTitle(detail.intro.title)} />
        </div>
        <div className="pfd-intro-copy">
          {detail.intro.copy.map((paragraph) => (
            <p key={paragraph} data-hm-fade>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PortfolioBlockSection({
  block,
  km,
  index,
}: {
  block: PortfolioBlock;
  km: string;
  index: number;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef);
  const id = `pfd-block-${index}`;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      if (block.kind === "steps") {
        gsap.fromTo(
          root.querySelector(".pfd-steps-line"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: root.querySelector(".pfd-steps"), start: "top 80%", end: "bottom 55%", scrub: 0.6 },
          },
        );
        gsap.fromTo(
          root.querySelectorAll(".pfd-step"),
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: root.querySelector(".pfd-steps"), start: "top 80%", once: true },
          },
        );
        return;
      }

      const items = root.querySelectorAll(block.kind === "chips" ? ".pfd-chip" : ".pfd-card");
      gsap.fromTo(
        items,
        block.kind === "chips" ? { scale: 0.6, autoAlpha: 0 } : { y: 50, autoAlpha: 0 },
        {
          scale: 1,
          y: 0,
          autoAlpha: 1,
          duration: block.kind === "chips" ? 0.5 : 0.8,
          ease: block.kind === "chips" ? "back.out(2)" : "power3.out",
          stagger: block.kind === "chips" ? 0.06 : 0.09,
          scrollTrigger: { trigger: items[0]?.parentElement ?? root, start: "top 85%", once: true },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section
      ref={rootRef}
      className={`hm pfd-block is-${block.kind} ${index % 2 ? "is-paper" : "is-cream"}`}
      aria-labelledby={id}
    >
      <div className="hm-wrap">
        <header className="pf-head">
          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">{km}</span>
            <span>
              {block.kicker ??
                (block.kind === "steps" ? "How we work" : block.kind === "chips" ? "Who we work with" : "What you get")}
            </span>
          </p>
          <HmTitle id={id} lines={splitTitle(block.title)} />
          {block.lede ? (
            <p data-hm-fade className="hm-lede">
              {block.lede}
            </p>
          ) : null}
        </header>

        {block.kind === "cards" ? (
          <ul className="pfd-cards">
            {block.items.map((item, itemIndex) => (
              <li key={item.title} className="pfd-card">
                <span className="pfd-card-no">{pad(itemIndex + 1)}</span>
                <h3>{item.title}</h3>
                {item.copy ? <p>{item.copy}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}

        {block.kind === "steps" ? (
          <div className="pfd-steps">
            <span className="pfd-steps-line" aria-hidden />
            <ol style={{ "--steps": block.items.length } as CSSProperties}>
              {block.items.map((item, itemIndex) => (
                <li key={item.title} className="pfd-step">
                  <span className="pfd-step-no">{pad(itemIndex + 1)}</span>
                  <h3>{item.title}</h3>
                  {item.copy ? <p>{item.copy}</p> : null}
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {block.kind === "chips" ? (
          <ul className="pfd-chips">
            {block.items.map((item) => (
              <li key={item.title} className="pfd-chip">
                <h3>{item.title}</h3>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
