"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ServiceDetail } from "@/lib/services-data";

type SeoRouteSectionProps = {
  service: ServiceDetail;
};

const PROBLEM_FLAGS = [
  {
    title: "Page two is a dead end",
    copy: "Buyers rarely scroll past the first results. If you are not there, you are not on the shortlist.",
  },
  {
    title: "AI answers skip you",
    copy: "ChatGPT, Gemini and Google AI Overviews cite brands they can understand and trust. Unknown sites get left out.",
  },
  {
    title: "Every visit is rented",
    copy: "When all traffic comes from ads, growth stops as soon as the budget does.",
  },
];

export function SeoRouteSection({ service }: SeoRouteSectionProps) {
  const [activeCapability, setActiveCapability] = useState(0);
  const capability = service.capabilities[activeCapability];

  const selectCapability = (index: number) => {
    setActiveCapability((index + service.capabilities.length) % service.capabilities.length);
  };

  return (
    <section id="the-problem" className="subsvc-route-section">
      <div className="subsvc-route-layout">
        <div className="subsvc-route-main">
          <div className="subsvc-problem-content">
            <div className="subsvc-problem-text">
              <p className="subsvc-problem-kicker">
                {service.problemKicker || service.kicker}
              </p>
              <h2 className="subsvc-problem-title">
                {service.problemHeading || service.heading}
              </h2>
              <p className="subsvc-problem-desc">
                Most buying journeys start with a search. If your site is slow,
                unclear or invisible to AI answers, the enquiry goes to whoever
                shows up first.
              </p>
              <div className="subsvc-problem-flags">
                {PROBLEM_FLAGS.map((flag) => (
                  <article className="subsvc-problem-flag" key={flag.title}>
                    <span className="subsvc-flag-icon" aria-hidden="true" />
                    <div>
                      <h3>{flag.title}</h3>
                      <p>{flag.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <section id="capabilities" className="subsvc-plan">
            <header className="subsvc-plan-header">
              <div>
                <p className="subsvc-plan-kicker">Website SEO services</p>
                <h2>
                  Six parts. <span>One engine.</span>
                </h2>
                <p>Explore the work behind a complete website SEO programme.</p>
              </div>
              <span className="subsvc-plan-stamp">Built around your business</span>
            </header>

            <div className="subsvc-plan-card" aria-live="polite">
              <div className="subsvc-plan-card-top">
                <span className="subsvc-plan-index">
                  {String(activeCapability + 1).padStart(2, "0")}
                </span>
                <span className="subsvc-plan-card-kicker">
                  {capability.title}
                </span>
                <span className="subsvc-plan-search" aria-hidden="true">⌕</span>
              </div>
              <div className="subsvc-plan-card-content">
                <h3>{capability.title}</h3>
                <p>{capability.copy}</p>
                <div className="subsvc-plan-detail">
                  <h4>What we work on</h4>
                  <ul>
                    {(capability.details || [capability.copy]).map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="subsvc-plan-card-tape" aria-hidden="true" />
            </div>

            <div className="subsvc-plan-controls" aria-label="Choose an SEO service">
              <div className="subsvc-plan-count">
                <strong>{String(activeCapability + 1).padStart(2, "0")}</strong>
                <span>/ {String(service.capabilities.length).padStart(2, "0")}</span>
                <small>Service guide</small>
              </div>
              <div className="subsvc-plan-steps">
                {service.capabilities.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    className={index === activeCapability ? "is-active" : ""}
                    aria-label={`Show part ${index + 1}: ${item.title}`}
                    aria-pressed={index === activeCapability}
                    onClick={() => selectCapability(index)}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
              <div className="subsvc-plan-arrows">
                <button
                  type="button"
                  aria-label="Previous service"
                  onClick={() => selectCapability(activeCapability - 1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next service"
                  onClick={() => selectCapability(activeCapability + 1)}
                >
                  →
                </button>
              </div>
            </div>
            <footer className="subsvc-plan-footer">
              <span>One connected programme. A clear scope for every service.</span>
              <Link href="#start-a-project">Let&apos;s discuss your SEO scope ↗</Link>
            </footer>
          </section>
        </div>

        <aside className="subsvc-route-aside">
          <div className="subsvc-route-box" aria-label="On this route">
            <div className="subsvc-route-header">
              <span className="subsvc-route-title">ON THIS ROUTE</span>
              <span className="subsvc-route-arrow" aria-hidden="true">↗</span>
            </div>
            <nav className="subsvc-route-body subsvc-route-nav">
              <a href="#the-problem" className="subsvc-route-link active">
                <span className="route-num">01</span><span className="route-name">The problem</span><span className="route-bullet">▸</span>
              </a>
              <a href="#capabilities" className="subsvc-route-link">
                <span className="route-num">02</span><span className="route-name">What we deliver</span><span className="route-bullet">↑</span>
              </a>
              <a href="#roadmap" className="subsvc-route-link">
                <span className="route-num">03</span><span className="route-name">Process</span><span className="route-bullet">↑</span>
              </a>
              <a href="#why-rmw" className="subsvc-route-link">
                <span className="route-num">04</span><span className="route-name">Why it matters</span><span className="route-bullet">↑</span>
              </a>
              <a href="#stats" className="subsvc-route-link">
                <span className="route-num">05</span><span className="route-name">Work &amp; results</span><span className="route-bullet">↑</span>
              </a>
              <a href="#seo-faq" className="subsvc-route-link">
                <span className="route-num">06</span><span className="route-name">FAQs &amp; next steps</span><span className="route-bullet">↑</span>
              </a>
            </nav>
          </div>

          <Link
            href="#start-a-project"
            className="subsvc-seo-sign"
            aria-label="Discuss your SEO requirements and start a project"
          >
            <Image
              src="/seo-requirements-sign.png"
              alt="Discuss your SEO requirements. Share your site and goals; we will route you to the right person. Start a project."
              width={400}
              height={300}
              sizes="(max-width: 767px) 80vw, 360px"
            />
          </Link>
        </aside>
      </div>
    </section>
  );
}
