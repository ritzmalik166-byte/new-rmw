"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { HmArrow, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { getServiceCreatives } from "@/lib/service-creatives";
import { SERVICE_ICONS } from "@/lib/service-icons";
import { getServiceLayout } from "@/lib/service-layout";
import type { ServiceDetail } from "@/lib/services-data";

const PROCESS_LABELS = ["Inspect", "Plan the route", "Drive in sprints", "Service stop"];
const WALL_TILTS = [-2.5, 1.8, -1.2, 2.4];

const pad = (value: number) => String(value).padStart(2, "0");

type ServiceLowerSectionsProps = {
  service: ServiceDetail;
  relatedServices: ServiceDetail[];
};

export function ServiceLowerSections({ service, relatedServices }: ServiceLowerSectionsProps) {
  const layout = getServiceLayout(service);

  return (
    <>
      <ServiceCreatives service={service} />
      <ServiceProcess service={service} />
      <ServiceWhy
        name={service.name}
        title={layout.intentTitle}
        points={layout.intentPoints}
        tape={layout.intentTape}
      />
      {layout.hideProof ? null : <ServiceProof service={service} relatedServices={relatedServices} />}
    </>
  );
}

function ServiceCreatives({ service }: { service: ServiceDetail }) {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState({ index: 0, atStart: true, atEnd: false });
  const { reduced } = useMotion();
  useHomeReveal(rootRef);
  const { wall } = getServiceCreatives(service.slug);
  const { wallKicker, wallTitle, wallLede } = getServiceLayout(service);
  const portfolioHref =
    service.slug === "radio-advertising"
      ? "/portfolio?highlight=radio-ads"
      : service.slug === "celebrity-endorsements"
        ? "/portfolio?highlight=celebrity-spotlight"
        : "/portfolio";

  const syncSlide = useCallback(() => {
    const grid = gridRef.current;
    const cards = grid?.children;
    if (!grid || !cards || cards.length < 2) return;
    const step = (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const atStart = grid.scrollLeft <= 2;
    const atEnd = grid.scrollLeft >= maxScroll - 2;
    const index = atEnd ? cards.length - 1 : Math.min(cards.length - 1, Math.round(grid.scrollLeft / step));
    setSlide((prev) =>
      prev.index === index && prev.atStart === atStart && prev.atEnd === atEnd ? prev : { index, atStart, atEnd },
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

  const goTo = (index: number) => {
    const grid = gridRef.current;
    const card = grid?.children[index] as HTMLElement | undefined;
    if (!grid || !card) return;
    grid.scrollTo({
      left: card.offsetLeft - parseFloat(getComputedStyle(grid).paddingLeft),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section ref={rootRef} id="creatives" className="hm sd-wall" aria-labelledby="sd-wall-title">
      <div className="hm-wrap">
        <header className="sd-head is-row">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">KM 03</span>
              <span>{wallKicker}</span>
            </p>
            <HmTitle id="sd-wall-title" lines={[{ text: wallTitle }]} />
            <p data-hm-fade className="hm-lede">
              {wallLede}
            </p>
          </div>
          <TransitionLink data-hm-fade href={portfolioHref} className="hm-link">
            See all work
            <HmArrow />
          </TransitionLink>
        </header>

        <div className="hm-work-nav sd-wall-nav">
          <button
            type="button"
            className="hm-work-arrow"
            aria-label="Previous creative"
            disabled={slide.atStart}
            onClick={() => goTo(slide.index - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <p className="hm-work-count" aria-live="polite">
            <b>{pad(slide.index + 1)}</b>
            <span aria-hidden> / </span>
            <span className="sr-only"> of </span>
            {pad(wall.length)}
          </p>
          <button
            type="button"
            className="hm-work-arrow"
            aria-label="Next creative"
            disabled={slide.atEnd}
            onClick={() => goTo(slide.index + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="sd-wall-line">
          <span className="sd-wall-rope" aria-hidden />
          <ul ref={gridRef} className="sd-wall-grid">
            {wall.map((item, index) => (
              <li
                data-hm-fade
                key={item.src}
                className="sd-pin"
                style={{ "--tilt": `${WALL_TILTS[index % WALL_TILTS.length]}deg` } as CSSProperties}
              >
                <span className="sd-pin-peg" aria-hidden />
                <figure className="sd-pin-card">
                  <div
                    className={cn("sd-pin-media", item.fit && "is-contain")}
                    style={item.ratio ? { aspectRatio: item.ratio } : undefined}
                  >
                    {item.video ? (
                      <video
                        src={item.video}
                        poster={item.src}
                        aria-label={item.alt}
                        autoPlay={!reduced}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <Image src={item.src} alt={item.alt} fill sizes="(max-width: 980px) 70vw, 280px" />
                    )}
                  </div>
                  <figcaption>
                    <span className="sd-pin-meta">
                      <span>No. {pad(index + 1)}</span>
                      <span>{item.medium}</span>
                    </span>
                    {item.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ServiceProcess({ service }: { service: ServiceDetail }) {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef);

  return (
    <section ref={rootRef} id="roadmap" className="hm sd-process" aria-labelledby="sd-process-title">
      <div className="hm-wrap">
        <header className="sd-head">
          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">KM 04</span>
            <span>The Ritz Media World process</span>
          </p>
          <HmTitle id="sd-process-title" lines={[{ text: "Four stops on the route." }]} />
        </header>

        <ol className="sd-stops">
          {service.process.slice(0, 4).map((step, index) => (
            <li data-hm-fade key={step.step} className="sd-stop">
              <span className="sd-stone" aria-hidden>
                <span className="sd-stone-km">{step.km}</span>
                <span className="sd-stone-no">{pad(index + 1)}</span>
              </span>
              <p className="sd-stop-label">{PROCESS_LABELS[index]}</p>
              <h3>{step.title}</h3>
              <p className="sd-stop-copy">{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ServiceWhy({
  name,
  title,
  points,
  tape,
}: {
  name: string;
  title: { lead: string; accent: string };
  points: { title: string; copy: string }[];
  tape: [string, string];
}) {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef);
  const tapeItems = [...tape, ...tape, ...tape];

  return (
    <section ref={rootRef} id="why-rmw" className="hm sd-why" aria-labelledby="sd-why-title">
      <div className="hm-wrap sd-why-inner">
        <header>
          <p data-hm-fade className="hm-kicker is-light">
            <span className="hm-pill">KM 05</span>
            <span>The {name} engine</span>
          </p>
          <HmTitle
            id="sd-why-title"
           
            lines={[{ text: title.lead }, { text: title.accent, accent: true }]}
          />
        </header>

        <ol className="sd-why-points">
          {points.map((point, index) => (
            <li data-hm-fade key={point.title} className="sd-why-point">
              <span className="sd-why-no" aria-hidden>
                {pad(index + 1)}
              </span>
              <h3>{point.title}</h3>
              <p>{point.copy}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="sd-tape" aria-hidden>
        {[0, 1].map((copy) => (
          <p key={copy} className="sd-tape-track">
            {tapeItems.map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}

function ServiceProof({ service, relatedServices }: ServiceLowerSectionsProps) {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef);

  return (
    <section ref={rootRef} id="stats" className="hm sd-proof" aria-labelledby="sd-proof-title">
      <div className="hm-wrap">
        <header className="sd-head is-row">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">KM 06</span>
              <span>Results</span>
            </p>
            <HmTitle id="sd-proof-title" lines={[{ text: "Proof on the tailgate." }]} />
          </div>
          <a data-hm-fade href="/contact.html" target="_blank" rel="noopener noreferrer" className="hm-btn is-ink">
            Discuss your numbers <span aria-hidden>→</span>
          </a>
        </header>

        <ul className="sd-receipts">
          {service.stats.map((stat, index) => (
            <li data-hm-fade key={stat.label} className="sd-receipt">
              <p className="sd-receipt-top">
                <span>Receipt {pad(index + 1)}</span>
                <span>Benchmark</span>
              </p>
              <p className="sd-receipt-value">{stat.value}</p>
              <p className="sd-receipt-label">{stat.label}</p>
            </li>
          ))}
        </ul>
        <p data-hm-fade className="sd-disclaimer">
          <span aria-hidden>✳</span> Illustrative programme benchmarks. Results vary by brand, market, scope
          and implementation; past performance does not guarantee future results.
        </p>

        <nav data-hm-fade className="sd-exits" aria-label="Related services">
          <p className="sd-exits-label">Next destination</p>
          <ul>
            {relatedServices.map((related) => {
              const icon = SERVICE_ICONS[related.slug];
              return (
                <li key={related.slug}>
                  <TransitionLink href={`/services/${related.slug}`} className="sd-exit">
                    {icon ? <Image src={icon} alt={`${related.name} icon`} width={30} height={30} /> : null}
                    {related.name}
                    <HmArrow />
                  </TransitionLink>
                </li>
              );
            })}
            <li>
              <TransitionLink href="/services" className="sd-exit is-all">
                All services
                <HmArrow />
              </TransitionLink>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
