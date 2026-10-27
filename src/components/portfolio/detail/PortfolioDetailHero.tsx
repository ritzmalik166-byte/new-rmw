"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { HmArrow, HmStamp, HmTitle, useFitTitle, useHomeReveal } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { type PortfolioDetail, workCount, workNoun } from "@/lib/portfolio-pages";
import { useAutoplayVideos } from "./useAutoplayVideos";
import { WorkThumb } from "./WorkThumb";

registerGsap();

export function PortfolioDetailHero({ detail }: { detail: PortfolioDetail }) {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef, "top 90%");
  useFitTitle(rootRef, "#pfd-hero-title");
  useAutoplayVideos(rootRef);

  const picks = detail.groups.flatMap((group) => group.items).slice(0, 2);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const cover = root.querySelector(".pfd-hero-cover");
      const cards = root.querySelectorAll(".pfd-hero-card");

      gsap.fromTo(
        [cover, ...cards],
        { y: 80, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out", stagger: 0.12, delay: 0.15 },
      );

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
        })
        .to(cover, { yPercent: -8, rotation: -7 }, 0)
        .to(cards[0] ?? [], { xPercent: -22, yPercent: 10, rotation: -14 }, 0)
        .to(cards[1] ?? [], { xPercent: 18, yPercent: -12, rotation: 14 }, 0);
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="hm pf-hero pfd-hero" aria-labelledby="pfd-hero-title">
      <div className="hm-wrap pf-hero-inner">
        <div
          className="pf-hero-copy pfd-hero-copy"
          style={{ "--title-chars": Math.max(...detail.h1.map((line) => line.length)) } as CSSProperties}
        >
          <nav data-hm-fade className="sd-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <TransitionLink href="/">Home</TransitionLink>
              </li>
              <li>
                <TransitionLink href="/portfolio">Portfolio</TransitionLink>
              </li>
              <li aria-current="page">{detail.name}</li>
            </ol>
          </nav>

          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">Portfolio</span>
            <span>
              {workCount(detail)} {workNoun(detail)} · {detail.name}
            </span>
          </p>

          <HmTitle
            as="h1"
            id="pfd-hero-title"
            className="is-line-locked"
            lines={[{ text: detail.h1[0] }, { text: detail.h1[1], accent: true }]}
          />

          <h2 data-hm-fade className="pfd-tagline">
            {detail.tagline}
          </h2>

          <div data-hm-fade className="hm-actions">
            <a href="#work" className="hm-btn">
              See the work <span aria-hidden>→</span>
            </a>
            <a href="/contact.html" target="_blank" rel="noopener noreferrer" className="hm-link">
              Start your project
              <HmArrow />
            </a>
          </div>
        </div>

        <div className="pfd-hero-stage" aria-hidden>
          <figure className="pfd-hero-cover">
            <Image src={detail.cover} alt={`${detail.name} work by Ritz Media World`} fill priority sizes="(max-width: 980px) 80vw, 460px" />
          </figure>
          {picks.map((item, index) => (
            <figure key={index} className={`pfd-hero-card is-${index + 1}`}>
              <span className="pfd-hero-card-media">
                <WorkThumb item={item} sizes="220px" priority />
              </span>
            </figure>
          ))}
          <HmStamp
            id="pfd-hero-stamp"
            top="RITZ MEDIA WORLD"
            bottom="SINCE 2008 · NOIDA"
            word="Delivered"
            className="pf-hero-stamp pfd-hero-stamp"
          />
        </div>
      </div>
    </section>
  );
}
