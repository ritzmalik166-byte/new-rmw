"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";

const SLOGANS = [
  {
    label: "Drive on data",
    painted: "डेटा से चलो",
    copy: "Search, social, and sales insights guide every plan, so your budget is spent on evidence rather than guesswork.",
  },
  {
    label: "Ideas with power",
    painted: "आइडिया दमदार",
    copy: "Every brief is answered with an idea strong enough to stand out and simple enough to remember.",
  },
  {
    label: "One team, one journey",
    painted: "एक टीम, एक सफ़र",
    copy: "Strategy, creative, media, and production work side by side, so nothing gets lost in hand-offs.",
  },
  {
    label: "Always on time",
    painted: "समय की पाबंदी",
    copy: "Launch dates are commitments, so every campaign is planned, produced and delivered on schedule.",
  },
  {
    label: "No empty promises",
    painted: "खाली वादे नहीं",
    copy: "We commit only to what we can deliver, and we report results honestly, whether they are good or not.",
  },
  {
    label: "Results will speak",
    painted: "नतीजे बोलेंगे",
    copy: "Success is measured in leads, sales, and brand growth, not in vanity metrics.",
  },
  {
    label: "The journey continues",
    painted: "सफ़र जारी है",
    copy: "Eighteen years in, we keep evolving, from print and radio to digital marketing and AI.",
  },
] as const;

const AUTOPLAY_MS = 4200;
const pad = (n: number) => String(n).padStart(2, "0");

export function AboutTruckBack() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const { reduced } = useMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || reduced) return;
    const id = window.setTimeout(
      () => setActive((index) => (index + 1) % SLOGANS.length),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, inView, paused, reduced]);

  const slogan = SLOGANS[active];

  return (
    <section
      ref={rootRef}
      className="about-tb"
      aria-labelledby="about-tb-title"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="about-tb-inner">
        <FadeIn className="about-tb-head">
          <p className="about-tb-kicker">UP16 · Ritz Media World 2008</p>
          <h2 id="about-tb-title" className="about-tb-title">
            Read the back of our truck.
          </h2>
        </FadeIn>

        <FadeIn className="about-tb-list-wrap" delay={0.1}>
          <ol className="about-tb-list">
            {SLOGANS.map((item, index) => (
              <li key={item.label}>
                <button
                  type="button"
                  className={cn("about-tb-item", index === active && "is-active")}
                  aria-pressed={index === active}
                  aria-controls="about-tb-panel"
                  onClick={() => setActive(index)}
                >
                  <span className="about-tb-num">{pad(index + 1)}</span>
                  <span className="about-tb-label">{item.label}</span>
                  {index === active && !paused && !reduced && inView ? (
                    <span
                      key={active}
                      className="about-tb-timer"
                      style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                      aria-hidden
                    />
                  ) : null}
                </button>
              </li>
            ))}
          </ol>
        </FadeIn>

        <FadeIn className="about-tb-stage" delay={0.15} y={60}>
          <div className="about-tb-truck">
            <Image
              src="/about/truck-back.png"
              alt=""
              width={810}
              height={668}
              sizes="(max-width: 900px) 92vw, 620px"
              className="about-tb-truck-img"
            />

            <div
              id="about-tb-panel"
              className="about-tb-panel"
              aria-live="polite"
              aria-atomic="true"
            >
              <div key={active} className="about-tb-paint">
                <p className="about-tb-painted" lang="hi">
                  {slogan.painted}
                </p>
                <p className="about-tb-copy">{slogan.copy}</p>
              </div>
            </div>

            <span key={`l-${active}`} className="about-tb-light is-left" aria-hidden />
            <span key={`r-${active}`} className="about-tb-light is-right" aria-hidden />

            <span className="about-tb-plate">
              <span key={active} className="about-tb-plate-num">
                {pad(active + 1)}
              </span>
              <span className="about-tb-plate-sep">/</span>
              {pad(SLOGANS.length)}
            </span>
          </div>
          <span className="about-tb-shadow" aria-hidden />
        </FadeIn>
      </div>
    </section>
  );
}
