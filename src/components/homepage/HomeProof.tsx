"use client";

import { useRef } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { site } from "@/lib/site";
import { HmTitle, useHomeReveal } from "./shared";

const TITLE = [{ text: "Work that" }, { text: "moved something.", accent: true }] as const;

export function HomeProof() {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef);

  return (
    <section ref={rootRef} className="hm hm-proof" aria-labelledby="hm-proof-title">
      <div className="hm-proof-inner">
        <p className="hm-proof-index" aria-hidden>
          KM 04
        </p>
        <div className="hm-proof-head">
          <p data-hm-fade className="hm-kicker is-light">
            <span className="hm-pill">{site.moved.lede}</span>
            <span className="hm-hindi" lang="hi">
              सबूत हाज़िर है
            </span>
          </p>
          <HmTitle id="hm-proof-title" lines={TITLE} />
        </div>
        <span data-hm-stamp className="hm-proof-badge">
          Client case study
        </span>

        <dl className="hm-proof-stats">
          {site.moved.stats.map((stat) => (
            <div key={stat.label} data-hm-fade className="hm-proof-stat">
              <dt>{stat.label}</dt>
              <dd>
                <CountUp prefix={stat.prefix} value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="hm-scallop" aria-hidden />
    </section>
  );
}
