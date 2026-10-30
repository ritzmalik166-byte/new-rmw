"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { HmTitle, useHomeReveal } from "./shared";

registerGsap();

const TITLE = [{ text: "Consignments" }, { text: "delivered.", accent: true }] as const;

const WORK = [
  {
    src: "/s6/renox-thrive.jpg",
    medium: "Print",
    title: "A legacy",
    copy: "Real estate, told as a place people can already imagine living in.",
    tilt: -2,
  },
  {
    src: "/s6/black-and-white-avenue.jpg",
    medium: "Print",
    title: "Black and White Avenue",
    copy: "Double-height ground-floor retail with 8% assured annual rental, starting from ₹2.99 Cr* on Noida Expressway.",
    tilt: 1.5,
  },
  {
    src: "/s6/risland-edm.jpg",
    medium: "Digital",
    title: "Where style finds its address",
    copy: "A place, a name, and a picture that can hold both.",
    fit: "contain",
    tilt: -1,
  },
  {
    src: "/s6/VVIP-2.jpg",
    medium: "Key visual",
    title: "A bloom of belonging",
    copy: "A brand idea made visible: something people can feel, not only read.",
    tilt: 2,
  },
] as const;

export function HomeWork() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const swings = useRef(new WeakMap<HTMLElement, gsap.core.Timeline>());
  const [slide, setSlide] = useState({ index: 0, atStart: true, atEnd: false });
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef);

  const syncSlide = useCallback(() => {
    const grid = gridRef.current;
    const cards = grid?.children;
    if (!grid || !cards || cards.length < 2) return;
    const step = (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const atStart = grid.scrollLeft <= 2;
    const atEnd = grid.scrollLeft >= maxScroll - 2;
    const index = atEnd
      ? cards.length - 1
      : Math.min(cards.length - 1, Math.round(grid.scrollLeft / step));
    setSlide((prev) =>
      prev.index === index && prev.atStart === atStart && prev.atEnd === atEnd
        ? prev
        : { index, atStart, atEnd },
    );
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    syncSlide();
    grid.addEventListener("scroll", syncSlide, { passive: true });
    window.addEventListener("resize", syncSlide);
    return () => {
      grid.removeEventListener("scroll", syncSlide);
      window.removeEventListener("resize", syncSlide);
    };
  }, [syncSlide]);

  // Step from the real scroll position: when 2+ cards fit (tablets), the last card's
  // offset is past the max scroll, so jumping to a card index would not move the row.
  const step = (dir: 1 | -1) => {
    const grid = gridRef.current;
    const cards = grid?.children;
    if (!grid || !cards || cards.length < 2) return;
    const size = (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const current = Math.round(grid.scrollLeft / size);
    grid.scrollTo({
      left: Math.max(0, Math.min(maxScroll, (current + dir) * size)),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const playSwing = (tag: HTMLElement, dir: number, amp: number, delay = 0) => {
    swings.current.get(tag)?.kill();
    const tl = gsap
      .timeline({ delay })
      .to(tag, { rotation: dir * amp, duration: 0.35, ease: "sine.out" })
      .to(tag, { rotation: -dir * amp * 0.6, duration: 0.55, ease: "sine.inOut" })
      .to(tag, { rotation: dir * amp * 0.3, duration: 0.5, ease: "sine.inOut" })
      .to(tag, { rotation: 0, duration: 0.6, ease: "sine.out" });
    swings.current.set(tag, tl);
  };

  useGSAP(
    () => {
      const root = rootRef.current;
      const line = root?.querySelector<HTMLElement>(".hm-work-line");
      if (!root || !line || !ready || reduced) return;

      const tags = gsap.utils.toArray<HTMLElement>(".hm-tag", line);
      gsap.set(tags, { y: -36, autoAlpha: 0 });

      const trigger = ScrollTrigger.create({
        trigger: line,
        start: "top 80%",
        once: true,
        onEnter: () => {
          tags.forEach((tag, index) => {
            gsap.to(tag, {
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              delay: index * 0.12,
              ease: "back.out(1.6)",
            });
            playSwing(tag, index % 2 === 0 ? 1 : -1, 6, index * 0.12 + 0.25);
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  const swing = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const tag = event.currentTarget;
    const rect = tag.getBoundingClientRect();
    const push =
      event.movementX !== 0
        ? Math.sign(event.movementX)
        : event.clientX < rect.left + rect.width / 2
          ? 1
          : -1;
    playSwing(tag, -push, gsap.utils.clamp(2.5, 6, 3 + Math.abs(event.movementX) * 0.3));
  };

  return (
    <section ref={rootRef} className="hm hm-work" aria-labelledby="hm-work-title">
      <div className="hm-wrap">
        <header className="hm-work-head">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">Safarnama</span>
              <span>KM 05 · Off the studio floor</span>
            </p>
            <HmTitle id="hm-work-title" lines={TITLE} />
            <p data-hm-fade className="hm-lede">
            Every claim on this page is backed by work that went live. These campaigns were created for brands that trusted us with their name, and they remain the best evidence of what Ritz Media World delivers.

            </p>
          </div>
          <TransitionLink data-hm-fade href="/portfolio" className="hm-btn is-ink">
            See all work <span aria-hidden>→</span>
          </TransitionLink>
        </header>

        <div className="hm-work-nav">
          <button
            type="button"
            className="hm-work-arrow"
            aria-label="Previous consignment"
            disabled={slide.atStart}
            onClick={() => step(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <p className="hm-work-count" aria-live="polite">
            <b>{String(slide.index + 1).padStart(2, "0")}</b>
            <span aria-hidden> / </span>
            <span className="sr-only"> of </span>
            {String(WORK.length).padStart(2, "0")}
          </p>
          <button
            type="button"
            className="hm-work-arrow"
            aria-label="Next consignment"
            disabled={slide.atEnd}
            onClick={() => step(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="hm-work-line">
          <span className="hm-work-rope" aria-hidden />
          <ul ref={gridRef} className="hm-work-grid">
            {WORK.map((item, index) => (
              <li
                key={item.src}
                className="hm-tag"
                style={{ "--tilt": `${item.tilt}deg` } as CSSProperties}
                onPointerEnter={swing}
              >
                <span className="hm-tag-peg" aria-hidden />
                <article className="hm-tag-card">
                  <div className={`hm-tag-media${"fit" in item && item.fit === "contain" ? " is-contain" : ""}`}>
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 900px) 72vw, 300px"
                    />
                  </div>
                  <p className="hm-tag-meta">
                    <span>No. {String(index + 1).padStart(2, "0")}</span>
                    <span>{item.medium}</span>
                  </p>
                  <h3 className="hm-tag-title">{item.title}</h3>
                  <p className="hm-tag-copy">{item.copy}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
