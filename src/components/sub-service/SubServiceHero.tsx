"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { HmArrow, HmStamp, HmTitle, useFitTitle, useHomeReveal, type HmLine } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap } from "@/lib/gsap";
import type { ServiceDetail } from "@/lib/services-data";
import type { SubService } from "@/lib/sub-services-data";

const pad = (value: number) => String(value).padStart(2, "0");

type Props = { service: ServiceDetail; sub: SubService; stop: number; total: number };

export function SubServiceHero({ service, sub, stop, total }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef, "top 90%");
  useFitTitle(rootRef, "#ssd-hero-title");

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;
      const q = gsap.utils.selector(root);

      gsap.fromTo(
        q(".ssd-print"),
        { clipPath: "inset(0 0 100% 0)", rotate: 0 },
        { clipPath: "inset(0 0 0% 0)", rotate: 2.5, duration: 1.2, ease: "expo.out", delay: 0.15 },
      );
      gsap.fromTo(
        q(".ssd-print-media img"),
        { scale: 1.25 },
        { scale: 1, duration: 1.6, ease: "expo.out", delay: 0.15 },
      );
      gsap.fromTo(
        q(".ssd-ticket"),
        { x: 60, autoAlpha: 0, rotate: 8 },
        { x: 0, autoAlpha: 1, rotate: -4, duration: 0.9, ease: "back.out(1.6)", delay: 0.65 },
      );
      gsap.to(q(".ssd-print-media img"), {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  const ticker = [...sub.sections.map((section) => section.title), service.name];
  const titleLines: HmLine[] = [{ text: sub.name }, { text: "routed to results.", accent: true }];

  return (
    <section ref={rootRef} className="hm ssd-hero" aria-labelledby="ssd-hero-title">
      <div className="hm-wrap ssd-hero-inner">
        <div
          className="ssd-hero-copy"
          style={{ "--title-chars": Math.max(...titleLines.map((line) => line.text.length)) } as CSSProperties}
        >
          <nav data-hm-fade className="sd-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <TransitionLink href="/">Home</TransitionLink>
              </li>
              <li>
                <TransitionLink href="/services">Services</TransitionLink>
              </li>
              <li>
                <TransitionLink href={`/services/${service.slug}`}>{service.name}</TransitionLink>
              </li>
              <li aria-current="page">{sub.name}</li>
            </ol>
          </nav>

          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">
              Stop {pad(stop)} / {pad(total)}
            </span>
            <span>{service.name}</span>
          </p>

          <HmTitle
            as="h1"
            id="ssd-hero-title"
            className="is-line-locked"
            lines={titleLines}
          />

          <p data-hm-fade className="hm-lede">
            {sub.intro}
          </p>

          <div data-hm-fade className="hm-actions">
            <a href="/contact.html" target="_blank" rel="noopener noreferrer" className="hm-btn">
              Start your project <span aria-hidden>→</span>
            </a>
            <a href="#route" className="hm-link">
              See the route
              <HmArrow />
            </a>
          </div>

          <ul data-hm-fade className="ssd-hero-facts">
            <li>
              <strong>{pad(sub.sections.length)}</strong> checkpoints
            </li>
            <li>
              <strong>18+</strong> years on Indian roads
            </li>
            <li>
              <strong>300+</strong> campaigns delivered
            </li>
          </ul>
        </div>

        <div className="ssd-hero-art">
          <figure className="ssd-print">
            <div className="ssd-print-media">
              <Image
                src={sub.cover}
                alt={`${sub.name} - Ritz Media World`}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 980px) 90vw, 760px"
                unoptimized={sub.cover.endsWith(".gif")}
              />
            </div>
            <figcaption>
              <span>KM {pad(stop)}</span>
              {sub.name}
            </figcaption>
            <HmStamp
              id={`ssd-stamp-${sub.service}-${sub.slug}`}
              top="RITZ MEDIA WORLD"
              bottom="SINCE 2008 · NOIDA"
              word="Approved"
              className="ssd-hero-stamp"
            />
          </figure>

          <div className="ssd-ticket" aria-hidden>
            <p className="ssd-ticket-head">Consignment note</p>
            <p className="ssd-ticket-row">
              <span>From</span>
              Your brief
            </p>
            <p className="ssd-ticket-row">
              <span>To</span>
              Measurable growth
            </p>
            <p className="ssd-ticket-row">
              <span>Via</span>
              {pad(sub.sections.length)} checkpoints
            </p>
          </div>
        </div>
      </div>

      <div className="ssd-ticker" aria-hidden>
        <div className="ssd-ticker-track">
          {[0, 1].map((copy) => (
            <p key={copy}>
              {ticker.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
