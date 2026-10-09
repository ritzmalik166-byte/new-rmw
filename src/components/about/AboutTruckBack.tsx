"use client";

import { useEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";

const SLOGANS = [
  {
    label: "Use data at night",
    painted: "डेटा से चलो",
    copy: "Search, social and sales data light the road before we spend a single rupee of your budget.",
  },
  {
    label: "Creative ओके please",
    painted: "क्रिएटिव ओके",
    copy: "An idea gets the green signal only when it is clear, distinctive and built to be remembered.",
  },
  {
    label: "Keep distance from empty promises",
    painted: "खोखले वादों से दूरी",
    copy: "We commit to what we can measure, report it honestly and let the results do the talking.",
  },
  {
    label: "Dekho magar pyaar se",
    painted: "देखो मगर प्यार से",
    copy: "Design that earns attention without shouting, crafted for the people who will actually see it.",
  },
  {
    label: "Blow horn, not budget",
    painted: "हॉर्न बजाओ, बजट नहीं",
    copy: "Big noise, sensible spends. Media is planned so every rupee works as hard as the message.",
  },
  {
    label: "Horn OK please",
    painted: "हॉर्न ओके प्लीज़",
    copy: "Signal early, communicate often. You always know where your campaign is on the road.",
  },
  {
    label: "शुभ यात्रा",
    painted: "शुभ यात्रा",
    copy: "On the road from Noida since 2008, with every brand we ride with.",
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
          <p className="about-tb-kicker">UP16 · RMW 2008</p>
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
            <div className="about-tb-frame">
              <div className="about-tb-field">
                <Rosette className="about-tb-rosette is-tl" />
                <Rosette className="about-tb-rosette is-tr" />
                <Rosette className="about-tb-rosette is-bl" />
                <Rosette className="about-tb-rosette is-br" />

                <div className="about-tb-plaque">
                  <div
                    id="about-tb-panel"
                    className="about-tb-plaque-inner"
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
                </div>
              </div>
            </div>

            <div className="about-tb-bumper">
              <span key={`l-${active}`} className="about-tb-light is-red" aria-hidden />
              <span className="about-tb-plate">
                <span key={active} className="about-tb-plate-num">
                  {pad(active + 1)}
                </span>
                <span className="about-tb-plate-sep">/</span>
                {pad(SLOGANS.length)}
              </span>
              <span key={`r-${active}`} className="about-tb-light is-amber" aria-hidden />
            </div>
            <div className="about-tb-hazard" aria-hidden />
          </div>
          <span className="about-tb-shadow" aria-hidden />
        </FadeIn>
      </div>
    </section>
  );
}

const ROSETTE_PETALS = Array.from({ length: 9 }, (_, i) => {
  const angle = ((i + 0.5) * (90 / 9) * Math.PI) / 180;
  return { cx: (94 * Math.cos(angle)).toFixed(2), cy: (94 * Math.sin(angle)).toFixed(2) };
});

const ROSETTE_DOTS = Array.from({ length: 7 }, (_, i) => {
  const angle = ((i + 0.5) * (90 / 7) * Math.PI) / 180;
  return { cx: (60 * Math.cos(angle)).toFixed(2), cy: (60 * Math.sin(angle)).toFixed(2) };
});

function Rosette({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 110 110" aria-hidden>
      {ROSETTE_PETALS.map((p) => (
        <circle key={`p${p.cx}`} cx={p.cx} cy={p.cy} r="9" fill="#e5322d" />
      ))}
      <circle r="92" fill="#e5322d" />
      <circle r="82" fill="#f39c1f" />
      <circle r="70" fill="#1f6f5c" />
      {ROSETTE_DOTS.map((d) => (
        <circle key={`d${d.cx}`} cx={d.cx} cy={d.cy} r="3.4" fill="#ffd23f" />
      ))}
      <circle r="50" fill="#f6c431" />
      <circle r="38" fill="#e5322d" />
      <circle r="26" fill="#1f6f5c" />
      <circle r="14" fill="#f6c431" />
    </svg>
  );
}
