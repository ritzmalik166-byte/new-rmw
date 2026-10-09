"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";
import { HmTitle, useHomeReveal } from "./shared";

const TITLE = [{ text: "Trophies on" }, { text: "the dashboard.", accent: true }] as const;

const noopSubscribe = () => () => {};

export function HomeAwards() {
  const rootRef = useRef<HTMLElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [selected, setSelected] = useState<number | null>(null);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const awards = site.awards.items;
  const active = selected !== null ? awards[selected] : null;
  useHomeReveal(rootRef);

  useEffect(() => {
    if (selected === null) return;
    lenis?.stop();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [selected, lenis]);

  const scrollShelf = (dir: 1 | -1) => {
    const shelf = shelfRef.current;
    const card = shelf?.querySelector<HTMLElement>(".hm-award");
    if (!shelf || !card) return;
    shelf.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };

  return (
    <section ref={rootRef} className="hm hm-awards" aria-labelledby="hm-awards-title">
      <div className="hm-wrap hm-awards-head">
        <div>
          <p data-hm-fade className="hm-kicker is-light">
            <span className="hm-pill">{site.awards.title}</span>
            <span className="hm-hindi" lang="hi">
              शाबाशी
            </span>
          </p>
          <HmTitle id="hm-awards-title" lines={TITLE} />
        </div>
        <div data-hm-fade className="hm-awards-controls">
          <button type="button" aria-label="Previous awards" onClick={() => scrollShelf(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M14.5 5.5 8 12l6.5 6.5" />
            </svg>
          </button>
          <button type="button" aria-label="Next awards" onClick={() => scrollShelf(1)}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M9.5 5.5 16 12l-6.5 6.5" />
            </svg>
          </button>
        </div>
      </div>

      <div data-hm-fade className="hm-awards-cabinet">
        <div ref={shelfRef} className="hm-awards-shelf">
          {awards.map((award, index) => (
            <button
              key={award.src}
              type="button"
              className="hm-award"
              onClick={() => setSelected(index)}
              aria-label={`${award.heading}, ${award.year}. View details`}
            >
              <span className="hm-award-year">{award.year}</span>
              <span className="hm-award-media">
                <Image src={award.src} alt={award.alt} fill sizes="300px" />
              </span>
              <span className="hm-award-sub">{award.subtitle}</span>
              <span className="hm-award-title">{award.heading}</span>
            </button>
          ))}
        </div>
        <span className="hm-awards-plank" aria-hidden />
      </div>


      {mounted
        ? createPortal(
            <AnimatePresence>
              {active ? <AwardModal award={active} onClose={() => setSelected(null)} /> : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </section>
  );
}

type Award = (typeof site.awards.items)[number];

function AwardModal({ award, onClose }: { award: Award; onClose: () => void }) {
  return (
    <motion.div
      className="hm-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      data-lenis-prevent
    >
      <motion.div
        className="hm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hm-modal-title"
        initial={{ opacity: 0, y: 24, rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: 24, rotate: 2 }}
        transition={{ type: "spring", damping: 24, stiffness: 280 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="hm-modal-close" aria-label="Close" onClick={onClose} autoFocus>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="hm-modal-media">
          <Image src={award.src} alt={award.alt} fill sizes="(max-width: 760px) 90vw, 420px" />
        </div>
        <div className="hm-modal-body">
          <p className="hm-modal-year">{award.year}</p>
          <p className="hm-modal-sub">{award.subtitle}</p>
          <h3 id="hm-modal-title" className="hm-modal-title">
            {award.heading}
          </h3>
          <p className="hm-modal-copy">{award.copy}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
