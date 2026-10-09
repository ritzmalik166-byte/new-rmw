"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";

const PHONES = {
  searchWeb: { src: "/about/proofs/phone-search-console-web.webp", alt: "Search Console performance on mobile Chrome" },
  searchApp: { src: "/about/proofs/phone-search-console-app.webp", alt: "Search Console performance on mobile" },
  ads: { src: "/about/proofs/phone-google-ads.webp", alt: "Google Ads account overview on mobile" },
} as const;

const SLIDES = [
  {
    tab: "Search Console",
    caption: "16 months of organic search growth for ritzmediaworld.com.",
    laptop: { src: "/about/proofs/laptop-search-console.webp", alt: "Google Search Console performance report", fit: "" },
    phones: [PHONES.searchApp, PHONES.searchWeb],
    metrics: [
      { value: "31.1K", label: "Organic clicks" },
      { value: "3.95M", label: "Search impressions" },
    ],
  },
  {
    tab: "Meta & Google Insights ",
    caption: "Instagram and Facebook content that people actually stop for.",
    laptop: { src: "/about/proofs/laptop-meta-insights.webp", alt: "Meta Business Suite content insights", fit: "is-tall" },
    phones: [PHONES.ads, PHONES.searchApp],
    metrics: [
      { value: "19.4M", label: "Views · ↑ 192.6%" },
      { value: "955.3K", label: "Content interactions" },
    ],
  },
  {
    tab: "Google Ads",
    caption: "Performance campaigns managed across Search, Display and YouTube.",
    laptop: { src: "/proof-google-ads-new.png", alt: "Google Ads campaign performance", fit: "is-wide" },
    phones: [PHONES.searchWeb, PHONES.ads],
    metrics: [
      { value: "65.5M", label: "Ad impressions" },
      { value: "1.94%", label: "Click-through rate" },
    ],
  },
] as const;

const AUTOPLAY_MS = 6000;

export function AboutProofs() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const { reduced } = useMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || reduced) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, inView, paused, reduced]);

  const go = (dir: 1 | -1) => setActive((i) => (i + dir + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[active];
  const autoplaying = inView && !paused && !reduced;

  return (
    <section ref={rootRef} className="about-proofs" aria-labelledby="about-proofs-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/about/proof-wave-left.png" className="about-proofs-wave is-left" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/about/proof-wave-right.png" className="about-proofs-wave is-right" alt="" />

      <header className="about-proofs-head">
        <p className="about-proofs-kicker">
          <span className="about-proofs-pill">Proof before promises</span>
          <span className="about-proofs-hindi" lang="hi">
            सबूत हाज़िर है
          </span>
        </p>
        <h2 id="about-proofs-title" className="about-proofs-title">
          Real Proofs
        </h2>
        <p className="about-proofs-lede">
          Unedited dashboards from the accounts we run. Desktop or mobile, the numbers read
          the same.
        </p>
      </header>

      <div
        className="about-proofs-stage"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <span className="about-proofs-glow is-a" aria-hidden />
        <span className="about-proofs-glow is-b" aria-hidden />

        <div className="proof-laptop">
          <div className="proof-laptop-lid">
            <span className="proof-laptop-cam" aria-hidden />
            <div className="proof-laptop-screen">
              {SLIDES.map((item, index) => (
                <div
                  key={item.tab}
                  className={cn("proof-shot", index === active && "is-active", item.laptop.fit)}
                  aria-hidden={index !== active}
                >
                  <Image
                    src={item.laptop.src}
                    alt={item.laptop.alt}
                    fill
                    sizes="(max-width: 768px) 80vw, 760px"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="proof-laptop-base" aria-hidden>
            <span />
          </div>
        </div>

        {[0, 1].map((side) => (
          <div key={side} className={cn("proof-phone", side === 0 ? "is-left" : "is-right")}>
            <span className="proof-phone-btn is-action" aria-hidden />
            <span className="proof-phone-btn is-vol-up" aria-hidden />
            <span className="proof-phone-btn is-vol-down" aria-hidden />
            <span className="proof-phone-btn is-power" aria-hidden />
            <div className="proof-phone-screen">
              {SLIDES.map((item, index) => (
                <div
                  key={item.tab}
                  className={cn("proof-shot", index === active && "is-active")}
                  aria-hidden={index !== active}
                >
                  <Image
                    src={item.phones[side].src}
                    alt={item.phones[side].alt}
                    fill
                    sizes="(max-width: 768px) 30vw, 220px"
                  />
                </div>
              ))}
              <span className="proof-phone-island" aria-hidden />
            </div>
          </div>
        ))}

        {slide.metrics.map((metric, index) => (
          <div
            key={`${active}-${metric.label}`}
            className={cn("proof-metric", index === 0 ? "is-a" : "is-b")}
          >
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="about-proofs-controls">
        <button
          type="button"
          className="about-proofs-arrow"
          aria-label="Previous proof"
          onClick={() => go(-1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M14.5 5.5 L8 12 l6.5 6.5" />
          </svg>
        </button>

        <div className="about-proofs-tabs" role="group" aria-label="Choose a proof">
          {SLIDES.map((item, index) => (
            <button
              key={item.tab}
              type="button"
              className={cn("about-proofs-tab", index === active && "is-active")}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <span className="about-proofs-tab-num">{String(index + 1).padStart(2, "0")}</span>
              {item.tab}
              {index === active && autoplaying ? (
                <span
                  key={active}
                  className="about-proofs-tab-timer"
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  aria-hidden
                />
              ) : null}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="about-proofs-arrow"
          aria-label="Next proof"
          onClick={() => go(1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M9.5 5.5 L16 12 l-6.5 6.5" />
          </svg>
        </button>
      </div>

      <p key={active} className="about-proofs-caption" aria-live="polite">
        {slide.caption}
      </p>
    </section>
  );
}
