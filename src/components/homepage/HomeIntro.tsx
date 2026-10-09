"use client";

import { useRef } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { site } from "@/lib/site";
import { HmArrow, HmPlate, HmTitle, useHomeReveal } from "./shared";

const TITLE = [
  { text: "Independent agency." },
  { text: "Indian at heart." },
  { text: "Ideas that travel.", accent: true },
] as const;

const TRIP_LOG = [
  { value: 18, suffix: "+", label: "Years on the road" },
  { value: 90, suffix: "+", label: "Crew on board" },
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
            <span>Since 2008 · Noida UP16</span>
          </p>
          <HmTitle id="hm-intro-title" lines={TITLE} />
          <p data-hm-fade className="hm-lede">
            {site.fullName} is a creative, branding, digital and media agency. Strategy, creative,
            media and production sit in one room, so your brand moves as one consignment, not a
            pile of hand-offs.
          </p>
          <div data-hm-fade className="hm-actions">
            <a href="#start-a-project" className="hm-btn">
              Book your consignment <span aria-hidden>→</span>
            </a>
            <TransitionLink href="/about" className="hm-link">
              Read our story
              <HmArrow />
            </TransitionLink>
          </div>
        </div>

        <aside data-hm-fade className="hm-log" aria-label="Trip log">
          <header className="hm-log-head">
            <p className="hm-log-kicker">Trip log</p>
            <p className="hm-log-name">RMW Roadways</p>
          </header>
          <HmPlate className="hm-log-plate" />

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
            <a href="#start-a-project">
              Book a slot <span aria-hidden>→</span>
            </a>
          </p>
        </aside>
      </div>

      <div data-hm-fade className="hm-cargo">
        <p className="hm-wrap hm-cargo-label">
          <span>Cargo we&rsquo;ve carried</span>
          <span className="hm-cargo-count">{partners.length}+ brands on board</span>
        </p>
        <div className="hm-cargo-lane">
          <div className="hm-cargo-track" aria-hidden>
            {[...partners, ...partners].map((src, index) => (
              <span key={`${src}-${index}`} className="hm-cargo-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
