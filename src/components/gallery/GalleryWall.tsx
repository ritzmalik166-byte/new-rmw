"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { cn } from "@/lib/cn";
import { GALLERY_CATEGORIES, GALLERY_PIECES, galleryAlt, type GalleryCategory } from "@/lib/gallery";

const PAGE_SIZE = 18;
const FILTERS = ["all", ...(Object.keys(GALLERY_CATEGORIES) as GalleryCategory[])] as const;
type Filter = (typeof FILTERS)[number];

const countFor = (filter: Filter) =>
  filter === "all" ? GALLERY_PIECES.length : GALLERY_PIECES.filter((piece) => piece.category === filter).length;

export function GalleryWall() {
  const rootRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [open, setOpen] = useState<number | null>(null);
  useHomeReveal(rootRef);

  const pieces = filter === "all" ? GALLERY_PIECES : GALLERY_PIECES.filter((piece) => piece.category === filter);
  const shown = pieces.slice(0, visible);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) dialog.showModal();
    if (open === null && dialog.open) dialog.close();
  }, [open]);

  const choose = (next: Filter) => {
    setFilter(next);
    setVisible(PAGE_SIZE);
  };

  const step = (delta: number) =>
    setOpen((current) => {
      if (current === null) return current;
      return (current + delta + pieces.length) % pieces.length;
    });

  const current = open === null ? null : pieces[open];

  return (
    <section ref={rootRef} className="gl-wall" aria-labelledby="gallery-wall-title">
      <div className="hm-wrap">
        <header className="gl-head">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">The gallery</span>
              <span>People · process · perspective</span>
            </p>
            <HmTitle
              id="gallery-wall-title"
              lines={[{ text: "The work is", accent: false }, { text: "always moving.", accent: true }]}
            />
          </div>
          <p data-hm-fade className="gl-intro">
            A living wall of the people, places and frames that make Ritz Media World what it is.
            Come in, look around, and stay for the next idea.
          </p>
        </header>

        <div className="gl-filters" role="group" aria-label="Filter gallery">
          {FILTERS.map((key) => (
            <button
              key={key}
              type="button"
              className={cn("gl-filter", key !== "all" && `is-${GALLERY_CATEGORIES[key].tone}`)}
              aria-pressed={filter === key}
              onClick={() => choose(key)}
            >
              {key === "all" ? "All" : GALLERY_CATEGORIES[key].label}
              <span>{countFor(key)}</span>
            </button>
          ))}
        </div>

        <div className="gl-grid">
          {shown.map((piece, index) => {
            const meta = GALLERY_CATEGORIES[piece.category];
            const featured = filter === "all" && piece.featured;
            return (
              <button
                key={piece.src}
                type="button"
                className={cn("gl-card", `is-${meta.tone}`, featured && "is-featured")}
                onClick={() => setOpen(index)}
                aria-label={`View ${piece.title}`}
              >
                <span className="gl-card-media">
                  <Image
                    src={piece.src}
                    alt={galleryAlt(piece)}
                    fill
                    sizes={featured ? "(max-width: 760px) 92vw, 46vw" : "(max-width: 760px) 46vw, (max-width: 1100px) 30vw, 23vw"}
                    priority={featured}
                  />
                </span>
                <span className="gl-card-copy">
                  <span className="gl-card-category">{meta.label}</span>
                  <strong>{piece.title}</strong>
                  <span className="gl-card-arrow" aria-hidden>↗</span>
                </span>
              </button>
            );
          })}
        </div>

        {visible < pieces.length ? (
          <div className="gl-more">
            <button type="button" className="gl-more-btn" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
              Show more frames
              <span>{shown.length} / {pieces.length}</span>
            </button>
          </div>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        className="gl-lightbox"
        aria-label={current?.title ?? "Gallery image"}
        onClose={() => setOpen(null)}
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target === event.currentTarget || target.classList.contains("gl-lightbox-stage")) setOpen(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
      >
        {current && open !== null ? (
          <>
            <div className="gl-lightbox-bar">
              <span className={cn("gl-lightbox-chip", `is-${GALLERY_CATEGORIES[current.category].tone}`)}>
                {GALLERY_CATEGORIES[current.category].label}
              </span>
              <span className="gl-lightbox-count">
                {String(open + 1).padStart(2, "0")} / {String(pieces.length).padStart(2, "0")}
              </span>
              <button type="button" className="gl-lightbox-close" onClick={() => setOpen(null)} aria-label="Close gallery">×</button>
            </div>
            <div className="gl-lightbox-stage">
              <figure key={current.src}>
                <div className="gl-lightbox-media">
                  <Image src={current.src} alt={galleryAlt(current)} fill sizes="(max-width: 760px) 94vw, 86vw" quality={95} />
                </div>
                <figcaption>{current.title}</figcaption>
              </figure>
              <button type="button" className="gl-lightbox-prev" onClick={() => step(-1)} aria-label="Previous image">←</button>
              <button type="button" className="gl-lightbox-next" onClick={() => step(1)} aria-label="Next image">→</button>
            </div>
            <div className="gl-lightbox-thumbs">
              {pieces.map((piece, index) => (
                <button
                  key={piece.src}
                  ref={index === open ? (node) => node?.scrollIntoView({ block: "nearest", inline: "center" }) : undefined}
                  type="button"
                  aria-label={`Show ${piece.title}`}
                  aria-current={index === open}
                  onClick={() => setOpen(index)}
                >
                  <Image src={piece.src} alt="" fill sizes="72px" />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
