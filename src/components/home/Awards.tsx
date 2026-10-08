"use client";

import { useState } from "react";
import Image from "next/image";
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
      <div className="awards-bg-swoosh">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" width="100%" height="100%">
          <ellipse cx="500" cy="150" rx="480" ry="140" fill="none" stroke="url(#gold-grad)" strokeWidth="2" />
          <defs>
            <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="0">
               <stop offset="0%" stopColor="#deb86d" stopOpacity="0" />
               <stop offset="50%" stopColor="#deb86d" stopOpacity="1" />
               <stop offset="100%" stopColor="#deb86d" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="awards-inner">
        <div className="awards-header-center">
          <p className="awards-kicker-center">
            <span className="awards-kicker-line"></span>
            OUR RECOGNITION
            <span className="awards-kicker-line"></span>
          </p>
          <h2 className="awards-title-center">Awards & Achievements</h2>
          <p className="awards-subtitle-center">
            A reflection of our commitment to creativity, leadership and real estate storytelling.
          </p>
        </div>

        <div className="awards-showcase-full">
          <CircularCarousel
            items={carouselItems}
            cardWidth={180}
            aspectRatio={0.65}
            speed={8}
            className="awards-carousel"
            onChange={setActiveIndex}
          />
        </div>

        <div className="awards-bottom-cards">
          <div className="awards-card-light">
            <p className="awards-pill">RECOGNITION EARNED BY OUR TEAM</p>
            <h3 className="awards-card-light-title">A Journey of Trust & Excellence</h3>
            <p className="awards-card-light-text">
              A look at the awards and industry recognition earned by Ritz Media World and our
              team for creative work, leadership, and real estate storytelling.
            </p>
            <div className="awards-features">
              <div className="awards-feature">
                <div className="awards-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="20" width="20" height="2"/><rect x="2" y="2" width="20" height="4"/><path d="M6 22V6"/><path d="M18 22V6"/><path d="M12 22V6"/></svg>
                </div>
                <span>Brand<br/>Impact</span>
              </div>
              <div className="awards-feature-divider"></div>
              <div className="awards-feature">
                <div className="awards-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                </div>
                <span>Creative<br/>Leadership</span>
              </div>
              <div className="awards-feature-divider"></div>
              <div className="awards-feature">
                <div className="awards-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <span>Performance<br/>Focus</span>
              </div>
            </div>
          </div>

          {activeAward && (
            <div className="awards-card-gold" key={activeAward.heading}>
              <div className="awards-card-gold-content">
                <p className="awards-card-gold-kicker">AWARD RECOGNITION</p>
                <p className="awards-card-gold-meta">
                  <span>{activeAward.year}</span>
                  <span aria-hidden="true">/</span>
                  <span>{activeAward.subtitle}</span>
                </p>
                <h3>{activeAward.heading}</h3>
                <p className="awards-card-gold-copy">{activeAward.copy}</p>
              </div>
              <div className="awards-laurel">
                <div className="awards-trophy-image-container">
                  <Image
                    src={activeAward.src}
                    alt={activeAward.alt ?? activeAward.heading}
                    fill
                    sizes="120px"
                    className="awards-trophy-image"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
