"use client";

import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { HmArrow, HmPlate, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { ServiceQueryCta } from "@/components/services/ServiceQueryCta";
import { ServiceQueryForm } from "@/components/services/ServiceQueryForm";
import { getServiceLayout } from "@/lib/service-layout";
import type { ServiceDetail } from "@/lib/services-data";
import type { SubService } from "@/lib/sub-services-data";

const pad = (value: number) => String(value).padStart(2, "0");
const subHref = (sub: SubService) => `/services/${sub.service}/${sub.slug}`;

function NavArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden>
      <path
        d={direction === "next" ? "M4 10h12M11 5l5 5-5 5" : "M16 10H4M9 5l-5 5 5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* The board lists the dedicated sub-service pages once a service has enough
   of them to fill it; otherwise it falls back to the capability summary.
   Capabilities that carry their own details or link a sub-service take
   precedence over both. */
const MIN_SUB_SERVICES_FOR_BOARD = 3;
const HEADER_OFFSET = 110;
/* Lets the page-transition overlay lift and the hero lay out before scrolling. */
const PAGE_SETTLE_MS = 1000;
const HASH_SCROLL_DURATION = 1.6;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type Props = { service: ServiceDetail; subServices?: SubService[] };

export function ServiceRouteSection({ service, subServices = [] }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useHomeReveal(rootRef);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  const boardFromCapabilities = service.capabilities.some((cap) => cap.subService || cap.details);
  const boardFromSubs = !boardFromCapabilities && subServices.length >= MIN_SUB_SERVICES_FOR_BOARD;
  const capabilities = boardFromCapabilities
    ? service.capabilities.map((cap) => {
        const sub = subServices.find((item) => item.slug === cap.subService);
        return {
          ...cap,
          slug: cap.subService,
          details: cap.details ?? sub?.sections.map((section) => section.title),
          href: sub ? subHref(sub) : undefined,
        };
      })
    : boardFromSubs
      ? subServices.map((sub) => ({
          title: sub.name,
          slug: sub.slug as string | undefined,
          copy: sub.intro,
          details: sub.sections.map((section) => section.title),
          href: subHref(sub) as string | undefined,
        }))
      : service.capabilities.map((cap) => ({
          ...cap,
          slug: cap.subService,
          href: undefined as string | undefined,
        }));
  const layout = getServiceLayout(service, capabilities.length);
  const capability = capabilities[active];
  const slugKey = capabilities.map((item) => item.slug ?? "").join("|");

  /* `#<sub-service-slug>` opens that stop on the board and brings the board into view. */
  useEffect(() => {
    const slugs = slugKey.split("|");
    const timers: number[] = [];
    const openFromHash = (delay: number) => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      const index = slug ? slugs.indexOf(slug) : -1;
      if (index < 0) return;
      setActive(index);
      timers.push(
        window.setTimeout(() => {
          const board = boardRef.current;
          if (!board) return;
          const smooth = lenisRef.current;
          if (smooth) {
            smooth.scrollTo(board, {
              offset: -HEADER_OFFSET,
              duration: HASH_SCROLL_DURATION,
              easing: easeInOutCubic,
              force: true,
            });
          } else {
            board.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, delay),
      );
    };
    const onHashChange = () => openFromHash(0);

    openFromHash(PAGE_SETTLE_MS);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [slugKey]);

  const select = (index: number, focus = false) => {
    const next = (index + capabilities.length) % capabilities.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: capabilities.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], true);
  };

  return (
    <section ref={rootRef} id="the-problem" className="hm sd-brief" aria-labelledby="sd-problem-title">
      <div className="hm-wrap sd-brief-inner">
        <div className="sd-brief-main">
          <blockquote data-hm-fade className="sd-define">
            <p className="sd-define-label">
              What {/services$/i.test(service.name) ? "are" : "is"} {service.name}?
            </p>
            <p className="sd-define-text">{service.definitionText ?? service.shortDescription}</p>
          </blockquote>

          <header>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">KM 01</span>
              <span>The business problem</span>
            </p>
            <HmTitle
              id="sd-problem-title"
             
              lines={[{ text: service.problemHeading ?? service.heading }]}
            />
            <p data-hm-fade className="hm-lede">
              {layout.problemSummary}
            </p>
          </header>

          <ol className="sd-flags">
            {layout.problemFlags.map((flag, index) => (
              <li data-hm-fade key={flag.title} className="sd-flag">
                <span className="sd-flag-no">Pothole {pad(index + 1)}</span>
                <h3>{flag.title}</h3>
                <p>{flag.copy}</p>
              </li>
            ))}
          </ol>

          <section id="capabilities" className="sd-plan" aria-labelledby="sd-plan-title">
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">KM 02</span>
              <span>{layout.planKicker}</span>
            </p>
            <HmTitle
              id="sd-plan-title"
             
              lines={[
                {
                  text:
                    layout.planTitle === "AI Implementation and Automation"
                      ? layout.planTitle
                      : `${layout.planTitle} One engine.`,
                },
              ]}
            />
            <p data-hm-fade className="hm-lede">
              {layout.planLede}
            </p>

            <div ref={boardRef} data-hm-fade className="sd-plan-board">
              <div
                className="sd-plan-tabs"
                role="tablist"
                aria-label={`${service.name} services`}
                aria-orientation="vertical"
                onKeyDown={onTabKey}
              >
                {capabilities.map((item, index) => (
                  <button
                    key={item.title}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    id={`sd-plan-tab-${index}`}
                    type="button"
                    role="tab"
                    className="sd-plan-tab"
                    aria-selected={index === active}
                    aria-controls="sd-plan-panel"
                    tabIndex={index === active ? 0 : -1}
                    onClick={() => select(index)}
                  >
                    <span className="sd-plan-tab-no">{pad(index + 1)}</span>
                    <span className="sd-plan-tab-name">{item.title}</span>
                  </button>
                ))}
              </div>

              <div
                id="sd-plan-panel"
                role="tabpanel"
                aria-labelledby={`sd-plan-tab-${active}`}
                aria-live="polite"
                className="sd-plan-panel"
              >
                <p className="sd-plan-panel-top">
                  <span>
                    Stop {pad(active + 1)} / {pad(capabilities.length)}
                  </span>
                  <span>{service.name}</span>
                </p>
                <h3>{capability.title}</h3>
                <p className="sd-plan-panel-copy">{capability.copy}</p>
                {capability.details?.length ? (
                  <>
                    <p className="sd-plan-panel-label">What we work on</p>
                    <ul>
                      {capability.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <div className="sd-plan-panel-nav">
                  <button
                    type="button"
                    className="sd-plan-nav-prev"
                    aria-label="Previous service"
                    onClick={() => select(active - 1)}
                  >
                    <NavArrow direction="prev" />
                  </button>
                  <button
                    type="button"
                    className="sd-plan-nav-next"
                    aria-label="Next service"
                    onClick={() => select(active + 1)}
                  >
                    <NavArrow direction="next" />
                  </button>
                </div>
              </div>
            </div>

            <footer data-hm-fade className="sd-plan-foot">
              <span>One connected programme. A clear scope for every service.</span>
              <a href="/contact.html" target="_blank" rel="noopener noreferrer" className="hm-link">
                {layout.planCta}
                <HmArrow />
              </a>
            </footer>
          </section>
        </div>

        <aside className="sd-brief-aside">
          <div data-hm-fade className="sd-brief-desk">
            <ServiceQueryForm service={service.name} />
          </div>

          <ServiceQueryCta service={service.name} />

          {layout.requirementsSign ? (
            <Link
              data-hm-fade
              href="/contact.html" target="_blank" rel="noopener noreferrer"
              className="sd-sign"
              aria-label={`Discuss your ${service.name} requirements and start a project`}
            >
              <Image
                src={layout.requirementsSign.src}
                alt={layout.requirementsSign.alt}
                width={400}
                height={300}
                sizes="(max-width: 1024px) 50vw, 300px"
              />
            </Link>
          ) : (
            <Link data-hm-fade href="/contact.html" target="_blank" rel="noopener noreferrer" className="sd-req">
              <span className="sd-req-kicker">Dispatch office</span>
              <span className="sd-req-title">Discuss your {service.name} requirements</span>
              <span className="sd-req-copy">
                Share your brand and goals; we will route you to the right person.
              </span>
              <span className="sd-req-cta">
                Start a project <span aria-hidden>→</span>
              </span>
              <HmPlate className="sd-req-plate" />
            </Link>
          )}
        </aside>
      </div>
    </section>
  );
}
