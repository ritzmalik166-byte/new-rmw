"use client";

import { useState } from "react";
import CircularCarousel, { type CircularCarouselItem } from "@/components/ui/CircularCarousel";
import { site } from "@/lib/site";

export function Awards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeAward = site.awards.items[activeIndex] ?? site.awards.items[0];
  const carouselItems: CircularCarouselItem[] = site.awards.items.map((item) => ({
    src: item.src,
    alt: item.alt ?? `${item.heading} award`,
    title: item.heading,
    subtitle: item.year
      ? `${item.year} · ${item.subtitle ?? "Recognition"}`
      : item.subtitle,
    description: item.copy,
    year: item.year,
  }));

  return (
    <section className="awards" aria-label="Awards">
      <div className="awards-inner">
        <div className="awards-header">
          <div className="awards-header-copy">
            <p className="awards-kicker">Recognition</p>
            <h2 className="awards-title">{site.awards.title}</h2>
          </div>
          <div className="awards-spot">
            <span>18+</span>
            <small>Years of creative impact</small>
          </div>
        </div>

        <div className="awards-layout">
          <div className="awards-showcase">
            <CircularCarousel
              items={carouselItems}
              cardWidth={220}
              aspectRatio={0.68}
              speed={8}
              className="awards-carousel"
              onChange={setActiveIndex}
            />
          </div>

          <div className="awards-information">
            <div className="awards-copy-panel">
              <p className="awards-pill">Recognition earned by our team</p>
              <p className="awards-text">
                A look at the awards and industry recognition earned by Ritz Media World and our
                team for creative work, leadership, and real estate storytelling.
              </p>
              <div className="awards-meta">
                <span>Brand impact</span>
                <span>Creative leadership</span>
                <span>Performance focus</span>
              </div>
            </div>
            {activeAward && (
              <article className="awards-detail" aria-live="polite" key={activeAward.heading}>
                <p className="awards-detail-kicker">Award recognition</p>
                <p className="awards-detail-meta">
                  <span>{activeAward.year}</span>
                  <span aria-hidden="true">/</span>
                  <span>{activeAward.subtitle}</span>
                </p>
                <h3>{activeAward.heading}</h3>
                <p className="awards-detail-copy">{activeAward.copy}</p>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
