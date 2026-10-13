"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { HmArrow, HmPlate, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { getServiceLayout } from "@/lib/service-layout";
import type { ServiceDetail } from "@/lib/services-data";

const ROUTE = [
  { id: "the-problem", label: "The problem" },
  { id: "capabilities", label: "What we deliver" },
  { id: "creatives", label: "Creatives" },
  { id: "roadmap", label: "Process" },
  { id: "why-rmw", label: "Why it matters" },
  { id: "stats", label: "Results" },
  { id: "service-faq", label: "FAQs & next steps" },
] as const;

const pad = (value: number) => String(value).padStart(2, "0");

export function ServiceRouteSection({ service }: { service: ServiceDetail }) {
  const rootRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useHomeReveal(rootRef);

  const layout = getServiceLayout(service);
  const capabilities = service.capabilities;
  const capability = capabilities[active];

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
            <p className="sd-define-label">What is {service.name}?</p>
            <p className="sd-define-text">{service.definitionText ?? service.shortDescription}</p>
          </blockquote>

          <header>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">KM 01</span>
              <span>The business problem</span>
            </p>
            <HmTitle
              id="sd-problem-title"
              className="sd-h2"
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
              className="sd-h2"
              lines={[{ text: `${layout.planTitle} One engine.` }]}
            />
            <p data-hm-fade className="hm-lede">
              {layout.planLede}
            </p>

            <div data-hm-fade className="sd-plan-board">
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
                    <HmArrow />
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
                  <button type="button" aria-label="Previous service" onClick={() => select(active - 1)}>
                    ←
                  </button>
                  <button type="button" aria-label="Next service" onClick={() => select(active + 1)}>
                    →
                  </button>
                </div>
              </div>
            </div>

            <footer data-hm-fade className="sd-plan-foot">
              <span>One connected programme. A clear scope for every service.</span>
              <a href="#start-a-project" className="hm-link">
                {layout.planCta}
                <HmArrow />
              </a>
            </footer>
          </section>
        </div>

        <aside className="sd-brief-aside">
          <nav data-hm-fade className="sd-routebox" aria-label="On this page">
            <p className="sd-routebox-head">
              On this route <span aria-hidden>↗</span>
            </p>
            <ol>
              {ROUTE.map((stop, index) => (
                <li key={stop.id}>
                  <a href={`#${stop.id}`}>
                    <span>KM {pad(index + 1)}</span>
                    {stop.label}
                    <HmArrow />
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {layout.requirementsSign ? (
            <Link
              data-hm-fade
              href="#start-a-project"
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
            <Link data-hm-fade href="#start-a-project" className="sd-req">
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
