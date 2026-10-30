"use client";

import { useRef } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { site } from "@/lib/site";
import { HmArrow, HmPlate, HmTitle, useHomeReveal } from "./shared";

const TITLE = [
  { text: "Creative Agency." },
  { text: "Indian at heart." },
  { text: "Ideas that travel.", accent: true },
] as const;

const TRIP_LOG = [
  { value: 18, suffix: "+", label: "Years on the road" },
  { value: 100, suffix: "+", label: "Crew on board" },
  { value: 10, suffix: "", label: "Services in the cargo" },
  { value: 3, suffix: "", label: "Engines, one agency" },
] as const;

export function HomeIntro() {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef);

  const partners = site.proof.partners;

  return (
    <section ref={rootRef} className="hm hm-intro" aria-labelledby="hm-intro-title">
      <div className="hm-wrap hm-intro-inner">
        <div className="hm-intro-copy">
          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">Who&rsquo;s driving</span>
            <span>KM 01 · Since 2008 · Noida UP16</span>
          </p>
          <HmTitle id="hm-intro-title" lines={TITLE} />
          <p data-hm-fade className="hm-lede">
          Founded in 2008, Ritz Media World is a creative advertising agency headquartered in Noida, serving brands across India. With strategy, creative, media, production, and AI under one roof, we deliver branding, digital marketing, 3D rendering, and real estate lead generation. Big FM named us Best Creative Agency (Real Estate) in Delhi NCR in  2025.
          </p>
          <div data-hm-fade className="hm-actions">
            <a href="/contact.html" target="_blank" rel="noopener noreferrer" className="hm-btn">
              Book your consignment <span aria-hidden>→</span>
            </a>
            <TransitionLink href="/about.html" className="hm-link">
              Read our story
              <HmArrow />
            </TransitionLink>
          </div>
        </div>

        <aside data-hm-fade className="hm-log" aria-label="Trip log">
          <header className="hm-log-head">
            <div>
              <p className="hm-log-kicker">Trip log</p>
              <p className="hm-log-name">Ritz Media World Roadways</p>
            </div>
            <HmPlate className="hm-log-plate" />
          </header>

          <dl className="hm-log-grid">
            {TRIP_LOG.map((stat) => (
              <div key={stat.label} className="hm-log-stat">
                <dt>{stat.label}</dt>
                <dd>
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>

          <p className="hm-log-foot">
            <span className="hm-log-foot-label">Next stop</span>
            <span className="hm-log-foot-dest">Your brand</span>
            <a href="/contact.html" target="_blank" rel="noopener noreferrer">
              Book a slot <span aria-hidden>→</span>
            </a>
          </p>
        </aside>
      </div>

      <div data-hm-fade className="hm-cargo">
        <p className="hm-wrap hm-cargo-label">
          <span>Cargo we&rsquo;ve carried</span>
          <span className="hm-cargo-count">300+ brands on board</span>
        </p>
        <div className="hm-cargo-lane">
          <div className="hm-cargo-track" aria-hidden>
            {[...partners, ...partners].map((src, index) => (
              <span key={`${src}-${index}`} className="hm-cargo-logo theme-keep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Ritz Media World client brand logo" loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
