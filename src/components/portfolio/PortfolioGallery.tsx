"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HmArrow, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { PORTFOLIO_GALLERY } from "@/lib/portfolio";

registerGsap();

const COLUMNS = 4;
/* Columns start pushed down by these amounts and rise to 0, so every column
   bottom lines up once the end of the wall reaches the bottom of the screen. */
const DRIFT = [40, 120, 0, 80];
/* Caption row + gap, as a fraction of column width. */
const CARD_EXTRA = 0.2;

/* Tallest pieces first, each into the currently shortest column, so the four
   columns end up almost the same height; pieces keep their order within a column. */
function balanceColumns() {
  const heights = new Array<number>(COLUMNS).fill(0);
  const buckets = Array.from({ length: COLUMNS }, () => [] as number[]);
  PORTFOLIO_GALLERY.map((piece, index) => ({ index, height: piece.height / piece.width + CARD_EXTRA }))
    .sort((a, b) => b.height - a.height || a.index - b.index)
    .forEach(({ index, height }) => {
      const column = heights.indexOf(Math.min(...heights));
      heights[column] += height;
      buckets[column].push(index);
    });
  return buckets.map((bucket) =>
    bucket.sort((a, b) => a - b).map((index) => ({ piece: PORTFOLIO_GALLERY[index], index })),
  );
}

const columns = balanceColumns();

export function PortfolioGallery() {
  const rootRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const wall = root.querySelector(".pf-cols");
        root.querySelectorAll<HTMLElement>(".pf-col").forEach((column, index) => {
          gsap.fromTo(
            column,
            { y: DRIFT[index] },
            {
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: wall, start: "top bottom", end: "bottom bottom", scrub: 0.5 },
            },
          );
        });
      });

      gsap.fromTo(
        root.querySelectorAll(".pf-shot"),
        { y: 60, scale: 0.94, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: { each: 0.05, from: "random" },
          scrollTrigger: { trigger: root.querySelector(".pf-cols"), start: "top 85%", once: true },
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) dialog.showModal();
    if (open === null && dialog.open) dialog.close();
  }, [open]);

  const step = (delta: number) =>
    setOpen((current) =>
      current === null ? current : (current + delta + PORTFOLIO_GALLERY.length) % PORTFOLIO_GALLERY.length,
    );

  const current = open === null ? null : PORTFOLIO_GALLERY[open];

  return (
    <section ref={rootRef} id="gallery" className="hm pf-gallery" aria-labelledby="pf-gallery-title">
      <div className="hm-wrap">
        <header className="pf-head is-row">
          <div>
            <p data-hm-fade className="hm-kicker is-light">
              <span className="hm-pill">KM 01</span>
              <span>Off the studio floor</span>
            </p>
            <HmTitle
              id="pf-gallery-title"
              lines={[{ text: "From highway hoardings" }, { text: "to Instagram grids.", accent: true }]}
            />
          </div>
          <a data-hm-fade href="#explore" className="hm-link is-light">
            Explore our full portfolio
            <HmArrow />
          </a>
        </header>

        <div className="pf-cols">
          {columns.map((column, columnIndex) => (
            <ul key={columnIndex} className="pf-col">
              {column.map(({ piece, index }) => (
                <li key={piece.src}>
                  <button
                    type="button"
                    className="pf-shot"
                    onClick={() => setOpen(index)}
                    aria-label={`View larger: ${piece.alt}`}
                  >
                    <span className="pf-shot-media" style={{ aspectRatio: `${piece.width} / ${piece.height}` }}>
                      <Image src={piece.src} alt={piece.alt} fill sizes="(max-width: 767px) 46vw, 25vw" />
                    </span>
                    <span className="pf-shot-meta">
                      <span>{piece.client}</span>
                      <span>{piece.medium}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="pf-lightbox"
        aria-label={current ? current.alt : "Portfolio piece"}
        onClose={() => setOpen(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
      >
        {current ? (
          <figure className="pf-lightbox-figure">
            <div className="pf-lightbox-media">
              <Image src={current.src} alt={current.alt} fill sizes="90vw" quality={95} />
            </div>
            <figcaption>
              <span className="pf-lightbox-count">
                {String((open ?? 0) + 1).padStart(2, "0")} / {PORTFOLIO_GALLERY.length}
              </span>
              <span className="pf-lightbox-client">{current.client}</span>
              <span className="pf-lightbox-medium">{current.medium}</span>
            </figcaption>
          </figure>
        ) : null}
        <div className="pf-lightbox-nav">
          <button type="button" aria-label="Previous piece" onClick={() => step(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next piece" onClick={() => step(1)}>
            →
          </button>
        </div>
        <button type="button" className="pf-lightbox-close" aria-label="Close" onClick={() => setOpen(null)}>
          ×
        </button>
      </dialog>
    </section>
  );
}
