"use client";

import { useGSAP } from "@gsap/react";
import { Fragment, useRef, useState, type CSSProperties } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

/* Each board letter gets a running index so CSS can stagger per-letter effects. */
const boardLines = (() => {
  let index = 0;
  return site.highways.card.slogan.map((line) => ({
    line,
    words: line
      .split(" ")
      .map((word) => Array.from(word).map((char) => ({ char, index: index++ }))),
  }));
})();

export function Highways() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  const [open, setOpen] = useState(0);
  const data = site.highways;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.fromTo(
        root.querySelectorAll("[data-highways-item]"),
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%" },
        },
      );

      const board = root.querySelector<HTMLElement>("[data-highways-board]");
      if (!board) return;

      gsap
        .timeline({ scrollTrigger: { trigger: board, start: "top 82%" } })
        .fromTo(
          board.querySelectorAll("[data-board-char]"),
          {
            autoAlpha: 0,
            yPercent: -90,
            scale: 1.9,
            rotate: () => gsap.utils.random(-35, 35),
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            rotate: 0,
            duration: 0.55,
            ease: "back.out(2.6)",
            stagger: 0.05,
          },
          0.35,
        )
        .fromTo(
          board.querySelector("[data-board-cta]"),
          { autoAlpha: 0, scale: 0.6 },
          { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(3)" },
          "-=0.15",
        );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  const serpTl = useRef<gsap.core.Timeline | null>(null);
  const serpHide = useRef<gsap.core.Tween | null>(null);
  const serpShown = useRef(false);
  const serpTimer = useRef<number | undefined>(undefined);

  const { contextSafe } = useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const q = (selector: string) => root.querySelector<HTMLElement>(selector);
      const popup = q(".highways-serp");
      const field = q(".highways-serp-field");
      const typed = q(".highways-serp-typed");
      const progress = q(".highways-serp-progress");
      const rank = q(".highways-serp-rank");
      const shine = q(".highways-serp-shine");
      const badge = q(".highways-serp-badge");
      const results = root.querySelectorAll(".highways-serp-result");
      if (!popup || !field || !typed || !progress || !rank || !shine || !badge) return;

      const keyword = data.card.search.keyword;
      const text = { n: 0 };
      const write = () => {
        typed.textContent = keyword.slice(0, Math.round(text.n));
        field.scrollLeft = field.scrollWidth;
      };

      const tl = gsap.timeline({ paused: true });

      if (reduced) {
        tl.fromTo(
          popup,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.2,
            immediateRender: false,
            onStart: () => {
              text.n = keyword.length;
              write();
            },
          },
        ).set([results, rank, badge], { autoAlpha: 1 });
      } else {
        tl.set(results, { autoAlpha: 0, y: 10 })
          .set([rank, badge], { autoAlpha: 0, scale: 0.4 })
          .set(progress, { scaleX: 0, autoAlpha: 1 })
          .set(shine, { xPercent: -120 })
          .fromTo(
            popup,
            {
              autoAlpha: 0,
              y: () => (popup.dataset.placement === "above" ? 14 : -14),
              scale: 0.75,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.8)",
              immediateRender: false,
              onStart: () => {
                text.n = 0;
                write();
              },
            },
          )
          .to(text, { n: keyword.length, duration: 1.6, ease: "none", onUpdate: write }, "+=0.1")
          .to(progress, { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, "+=0.15")
          .to(progress, { autoAlpha: 0, duration: 0.15 })
          .to(results, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.12 })
          .to(rank, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(3)" }, "-=0.3")
          .to(shine, { xPercent: 120, duration: 0.8, ease: "power2.inOut" }, "<")
          .to(badge, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.4)" }, "-=0.35");
      }

      serpTl.current = tl;
      return () => {
        window.clearTimeout(serpTimer.current);
        tl.kill();
        serpTl.current = null;
        serpShown.current = false;
      };
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  const hideSerp = contextSafe(() => {
    window.clearTimeout(serpTimer.current);
    const popup = rootRef.current?.querySelector<HTMLElement>(".highways-serp");
    if (!serpTl.current || !popup || !serpShown.current) return;

    serpShown.current = false;
    serpTl.current.pause();
    serpHide.current = gsap.to(popup, {
      autoAlpha: 0,
      y: popup.dataset.placement === "above" ? 8 : -8,
      scale: 0.94,
      duration: 0.22,
      ease: "power2.in",
    });
  });

  /* Opens below the board, flips above when the visible part of the section
     has no room below, and slides sideways to stay on screen. */
  const placeSerp = () => {
    const root = rootRef.current;
    const board = root?.querySelector<HTMLElement>(".highways-board");
    const popup = root?.querySelector<HTMLElement>(".highways-serp");
    if (!root || !board || !popup) return;

    const gap = 16;
    const edge = 12;
    const header = 80;
    const section = root.getBoundingClientRect();
    const rect = board.getBoundingClientRect();
    const needed = popup.offsetHeight + gap + edge;
    const below = Math.min(window.innerHeight, section.bottom) - rect.bottom;
    const above = rect.top - Math.max(header, section.top);
    popup.dataset.placement = below >= needed || below >= above ? "below" : "above";

    const width = popup.offsetWidth;
    let left = 0;
    if (rect.left + width > window.innerWidth - edge) left = window.innerWidth - edge - width - rect.left;
    if (rect.left + left < edge) left = edge - rect.left;
    popup.style.left = `${left}px`;
    popup.style.setProperty("--serp-arrow", `${Math.min(Math.max(34 - left, 20), width - 34)}px`);
  };

  /* Touch has no hover-out, so a tap shows the result and it closes itself. */
  const showSerp = contextSafe((autoHide: boolean) => {
    const tl = serpTl.current;
    if (!tl) return;

    window.clearTimeout(serpTimer.current);
    if (!serpShown.current) {
      serpHide.current?.kill();
      serpShown.current = true;
      placeSerp();
      tl.invalidate().restart();
    }
    if (autoHide) {
      serpTimer.current = window.setTimeout(hideSerp, (tl.duration() + 3) * 1000);
    }
  });

  return (
    <section ref={rootRef} id="highways" className="highways" aria-label="Common highways">
      <div className="highways-inner">
        <div className="highways-left">
          <div data-highways-item className="highways-copy">
            <h2 className="highways-title">
              <span>Common</span>
              <span>Highways.</span>
            </h2>
            <p className="highways-lede">{data.lede}</p>
          </div>

          <div data-highways-item className="highways-visual">
            <div className="highways-rig">
              <div
                className="highways-board"
                onPointerEnter={(event) => showSerp(event.pointerType !== "mouse")}
                onPointerLeave={(event) => event.pointerType === "mouse" && hideSerp()}
                onFocus={() => showSerp(false)}
                onBlur={hideSerp}
              >
                <SearchPopup />
                <div data-highways-board className="highways-card">
                  <span className="highways-card-lights" aria-hidden />
                  <h3
                    className="highways-card-title"
                    aria-label={data.card.slogan.join(" ")}
                  >
                    {boardLines.map(({ line, words }, lineIndex) => (
                      <span
                        key={line}
                        aria-hidden
                        className={cn(
                          "highways-card-line",
                          `highways-card-line--${lineIndex + 1}`,
                        )}
                      >
                        {words.map((chars, wordIndex) => (
                          <Fragment key={wordIndex}>
                            {wordIndex > 0 && " "}
                            <span className="highways-card-word">
                              {chars.map(({ char, index }) => (
                                <span
                                  key={index}
                                  data-board-char
                                  className="highways-card-char"
                                  style={{ "--i": index } as CSSProperties}
                                >
                                  {char}
                                </span>
                              ))}
                            </span>
                          </Fragment>
                        ))}
                      </span>
                    ))}
                  </h3>
                  <p className="sr-only">
                    Ritz Media World ranks #1 on Google for “{data.card.search.keyword}”.
                  </p>
                  <a
                    data-board-cta
                    href={data.card.href}
                    className="highways-card-btn"
                  >
                    {data.card.cta}
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>

              <div className="highways-truck" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.truck} alt="" width={1024} height={766} />
              </div>
            </div>
          </div>
        </div>

        <div data-highways-item className="highways-faqs">
          {data.faqs.map((item, index) => {
            const isOpen = open === index;
            const num = String(index + 1).padStart(2, "0");

            return (
              <div
                key={item.q}
                className={cn("highways-faq", isOpen && "is-open")}
              >
                <button
                  type="button"
                  className="highways-faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(index)}
                >
                  <span className="highways-faq-num">{num}</span>
                  <span className="highways-faq-q">{item.q}</span>
                  <span className="highways-faq-toggle" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div className="highways-faq-panel">
                  <p className="highways-faq-a">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ticker-pattern highways-pattern" aria-hidden />
    </section>
  );
}

const GOOGLE = [
  { letter: "G", color: "#4285f4" },
  { letter: "o", color: "#ea4335" },
  { letter: "o", color: "#fbbc05" },
  { letter: "g", color: "#4285f4" },
  { letter: "l", color: "#34a853" },
  { letter: "e", color: "#ea4335" },
];

function SearchPopup() {
  const { search } = site.highways.card;

  return (
    <div className="highways-serp" aria-hidden>
      <div className="highways-serp-head">
        <span className="highways-serp-logo">
          {GOOGLE.map(({ letter, color }, i) => (
            <span key={i} style={{ color }}>
              {letter}
            </span>
          ))}
        </span>
        <div className="highways-serp-bar">
          <svg className="highways-serp-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M20.5 20.5 16 16" />
          </svg>
          <span className="highways-serp-field">
            <span className="highways-serp-typed" />
            <span className="highways-serp-caret" />
          </span>
          <span className="highways-serp-progress" />
        </div>
      </div>

      <div className="highways-serp-results">
        <div className="highways-serp-result highways-serp-result--top">
          <span className="highways-serp-shine" />
          <span className="highways-serp-rank">#1</span>
          <div className="highways-serp-site">
            <span className="highways-serp-favicon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" width={18} height={18} />
            </span>
            <span>
              <span className="highways-serp-name">Ritz Media World</span>
              <span className="highways-serp-url">{search.url}</span>
            </span>
          </div>
          <p className="highways-serp-title">{search.title}</p>
          <p className="highways-serp-snippet">{search.snippet}</p>
        </div>
        <div className="highways-serp-result highways-serp-result--ghost">
          <span />
          <span />
        </div>
        <div className="highways-serp-result highways-serp-result--ghost">
          <span />
          <span />
        </div>
      </div>

      <span className="highways-serp-badge">
        <svg viewBox="0 0 24 24">
          <path d="m5 12 4.5 4.5L19 7" />
        </svg>
        Ranking dekh li?
      </span>
    </div>
  );
}
