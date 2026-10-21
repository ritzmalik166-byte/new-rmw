"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import {
  type PortfolioDetail,
  type PortfolioWorkItem,
  splitTitle,
  workCount,
  workNoun,
} from "@/lib/portfolio-pages";
import { useAutoplayVideos } from "./useAutoplayVideos";
import { WorkThumb } from "./WorkThumb";

registerGsap();

const pad = (value: number) => String(value).padStart(2, "0");
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Entry = { item: PortfolioWorkItem; group: string; number: number };

const captionOf = (item: PortfolioWorkItem) => (item.kind === "image" ? item.caption : undefined);

export function PortfolioWork({ detail, km }: { detail: PortfolioDetail; km: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [activeGroup, setActiveGroup] = useState(0);
  const lenis = useLenis();
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef);
  useAutoplayVideos(rootRef);

  const entries: Entry[] = detail.groups.flatMap((group) =>
    group.items.map((item, index) => ({ item, group: captionOf(item) ?? group.title, number: index + 1 })),
  );
  const offsets = detail.groups.map((_, index) =>
    detail.groups.slice(0, index).reduce((total, group) => total + group.items.length, 0),
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const tiles = gsap.utils.toArray<HTMLElement>(".pfd-tile", root);
      gsap.set(tiles, { y: 70, autoAlpha: 0, rotation: () => gsap.utils.random(-4, 4) });
      ScrollTrigger.batch(tiles, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            rotation: 0,
            duration: 0.9,
            ease: "back.out(1.4)",
            stagger: 0.08,
            overwrite: true,
          }),
      });

      root.querySelectorAll<HTMLElement>(".pfd-group-rule").forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: rule, start: "top 92%", end: "top 55%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || detail.groups.length < 2) return;

    const groups = Array.from(root.querySelectorAll<HTMLElement>(".pfd-group"));
    const triggers = groups.map((group, index) =>
      ScrollTrigger.create({
        trigger: group,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) setActiveGroup(index);
        },
      }),
    );
    return () => triggers.forEach((trigger) => trigger.kill());
  }, [detail.groups.length]);

  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.children[activeGroup] as HTMLElement | undefined;
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
  }, [activeGroup]);

  const goToGroup = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const target = rootRef.current?.querySelectorAll<HTMLElement>(".pfd-group")[index];
    const nav = navRef.current;
    if (!target || !nav) return;
    event.preventDefault();
    setActiveGroup(index);

    // Scrolling up brings the site header back, which pushes the bar down.
    const goingUp = target.getBoundingClientRect().top < 0;
    const offset = -((goingUp ? 84 : 10) + nav.offsetHeight + 16);
    if (lenis) {
      lenis.scrollTo(target, { offset });
    } else {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) dialog.showModal();
    if (open === null && dialog.open) dialog.close();
  }, [open]);

  const step = (delta: number) =>
    setOpen((current) => (current === null ? current : (current + delta + entries.length) % entries.length));

  const current = open === null ? null : entries[open];

  return (
    <section ref={rootRef} id="work" className="hm pfd-work" aria-labelledby="pfd-work-title">
      <div className="hm-wrap">
        <header className="pf-head is-row">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">{km}</span>
              <span>Off the {detail.name.toLowerCase()} desk</span>
            </p>
            <HmTitle id="pfd-work-title" lines={splitTitle(detail.workTitle)} />
          </div>
          <p data-hm-fade className="hm-lede">
            {detail.workLede ??
              `${workCount(detail)} ${workNoun(detail)} made for real brands. Tap any piece to see it up close.`}
          </p>
        </header>

        {detail.groups.length > 1 ? (
          <nav ref={navRef} data-hm-fade className="pfd-group-nav" aria-label="Work categories">
            {detail.groups.map((group, groupIndex) => (
              <a
                key={group.title}
                href={`#${slugify(group.title)}`}
                className={groupIndex === activeGroup ? "is-active" : undefined}
                aria-current={groupIndex === activeGroup ? "true" : undefined}
                onClick={(event) => goToGroup(event, groupIndex)}
              >
                {group.title}
                <span>{pad(group.items.length)}</span>
              </a>
            ))}
          </nav>
        ) : null}

        {detail.groups.map((group, groupIndex) => (
          <div key={group.title} id={slugify(group.title)} className="pfd-group">
            <div className="pfd-group-head">
              <h3>{group.title}</h3>
              <span className="pfd-group-rule" aria-hidden />
              <span className="pfd-group-count">
                {pad(group.items.length)} {workNoun(detail)}
              </span>
            </div>
            <ul className="pfd-grid" style={{ "--aspect": group.aspect } as CSSProperties}>
              {group.items.map((item, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className="pfd-tile"
                    onClick={() => setOpen(offsets[groupIndex] + index)}
                    aria-label={`Open ${item.alt}`}
                  >
                    <span className="pfd-tile-media">
                      <WorkThumb item={item} sizes="(max-width: 640px) 46vw, (max-width: 1100px) 31vw, 23vw" />
                      {item.kind !== "image" ? (
                        <span className="pfd-play" aria-hidden>
                          ▶
                        </span>
                      ) : null}
                    </span>
                    <span className="pfd-tile-meta">
                      <span>{captionOf(item) ?? group.title}</span>
                      <span>{pad(index + 1)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="pf-lightbox"
        aria-label={current ? current.item.alt : "Portfolio piece"}
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
            <LightboxMedia key={open} item={current.item} />
            <figcaption>
              <span className="pf-lightbox-count">
                {pad((open ?? 0) + 1)} / {pad(entries.length)}
              </span>
              <span className="pf-lightbox-client">{current.group}</span>
              <span className="pf-lightbox-medium">No. {pad(current.number)}</span>
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

function LightboxMedia({ item }: { item: PortfolioWorkItem }) {
  if (item.kind === "youtube") {
    return (
      <div className="pf-lightbox-media is-embed">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
          title={item.alt}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (item.kind === "video") {
    return (
      <div className="pf-lightbox-media is-video">
        <video src={item.video} controls autoPlay playsInline aria-label={item.alt} />
      </div>
    );
  }

  if (item.full) {
    return (
      <div className="pf-lightbox-media is-scroll" tabIndex={0}>
        <Image src={item.full} alt={item.alt} width={650} height={1699} sizes="650px" quality={95} />
      </div>
    );
  }

  return (
    <div className="pf-lightbox-media">
      <Image src={item.src} alt={item.alt} fill sizes="90vw" quality={95} />
    </div>
  );
}
