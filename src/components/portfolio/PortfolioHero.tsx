"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";
import { HmArrow, HmStamp, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { PORTFOLIO_CATEGORIES, PORTFOLIO_HERO } from "@/lib/portfolio";

registerGsap();

const MARQUEE = ["Portfolio", "Safarnama", "Creative OK Please", "Ideas that travel"];

export function PortfolioHero() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef, "top 90%");

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const back = root.querySelector(".pf-hero-photo.is-back");
      const front = root.querySelector(".pf-hero-photo.is-front");

      gsap.fromTo(
        [back, front],
        { y: 90, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out", stagger: 0.14, delay: 0.2 },
      );

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
        })
        .to(back, { xPercent: -14, yPercent: -10, rotation: -12 }, 0)
        .to(front, { xPercent: 12, yPercent: 14, rotation: 10 }, 0)
        .to(root.querySelector(".pf-hero-marquee-track"), { xPercent: -28 }, 0);
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="hm pf-hero" aria-labelledby="pf-hero-title">
      <div className="hm-wrap pf-hero-inner">
        <div className="pf-hero-copy">
          <nav data-hm-fade className="sd-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <TransitionLink href="/">Home</TransitionLink>
              </li>
              <li aria-current="page">Portfolio</li>
            </ol>
          </nav>

          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">Safarnama</span>
            <span>Creative portfolio &amp; case studies</span>
          </p>

          <HmTitle
            as="h1"
            id="pf-hero-title"
            lines={[{ text: "Our work speaks" }, { text: "for itself.", accent: true }]}
          />

          <p data-hm-fade className="hm-lede">
            Explore the creative portfolio of Ritz Media World, from brand identities, packaging, and print
            advertising to websites, 3D renders, and influencer campaigns, created for brands across India.
          </p>

          <div data-hm-fade className="hm-actions">
            <a href="#explore" className="hm-btn">
              Explore the work <span aria-hidden>→</span>
            </a>
            <a href="/contact" target="_blank" rel="noopener noreferrer" className="hm-link">
              Start your project
              <HmArrow />
            </a>
          </div>

          <ul data-hm-fade className="pf-hero-chips" aria-label="Portfolio categories">
            {PORTFOLIO_CATEGORIES.map((category) => (
              <li key={category.id}>
                <TransitionLink href={category.href}>{category.title}</TransitionLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="pf-hero-stage">
          <figure className="pf-hero-photo is-back">
            <Image
              src={PORTFOLIO_HERO.back.src}
              alt={PORTFOLIO_HERO.back.alt}
              fill
              priority
              sizes="(max-width: 980px) 70vw, 440px"
            />
          </figure>
          <figure className="pf-hero-photo is-front">
            <Image
              src={PORTFOLIO_HERO.front.src}
              alt={PORTFOLIO_HERO.front.alt}
              fill
              priority
              sizes="(max-width: 980px) 70vw, 440px"
            />
            <figcaption>
              <span>Case file</span> Ashtech Presidential Towers
            </figcaption>
          </figure>
          <HmStamp
            id="pf-hero-stamp"
            top="RMW · SINCE 2008"
            bottom="NOIDA · UP16"
            word="Delivered"
            className="pf-hero-stamp"
          />
        </div>
      </div>

      <div className="pf-hero-marquee" aria-hidden>
        <p className="pf-hero-marquee-track">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((word, index) => (
            <span key={`${word}-${index}`}>{word}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
