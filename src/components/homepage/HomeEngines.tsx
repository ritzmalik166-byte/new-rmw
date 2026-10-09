"use client";

import { useRef, type CSSProperties } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { ServicesRouteTruck } from "@/components/services/ServicesRouteTruck";
import { SERVICE_ICONS } from "@/lib/service-icons";
import { HmArrow, HmTitle, useHomeReveal } from "./shared";

const TITLE = [{ text: "One agency." }, { text: "Three engines.", accent: true }] as const;

type Engine = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  copy: string;
  tone: string;
  cargo: { slug: string; name: string }[];
  extras: string[];
};

const ENGINES: Engine[] = [
  {
    id: "brand",
    index: "01",
    kicker: "Distinct by design.",
    title: "Brand & Creative",
    copy: "Positioning, identity, campaigns and the famous faces that make people stop, remember and trust.",
    tone: "#d93829",
    cargo: [
      { slug: "creative-services", name: "Creative Services" },
      { slug: "content-marketing", name: "Content Marketing" },
      { slug: "celebrity-endorsements", name: "Celebrity Endorsements" },
      { slug: "influencer-marketing", name: "Influencer Marketing" },
    ],
    extras: [],
  },
  {
    id: "digital",
    index: "02",
    kicker: "Own the attention.",
    title: "Digital & Media",
    copy: "Search, social, web, newspapers and FM: the channels that carry your message to the buyer and bring the lead back.",
    tone: "#1457a8",
    cargo: [
      { slug: "digital-marketing", name: "Digital Marketing" },
      { slug: "seo", name: "SEO" },
      { slug: "web-development", name: "Web Development" },
      { slug: "print-advertising", name: "Print Advertising" },
      { slug: "radio-advertising", name: "Radio Advertising" },
    ],
    extras: [],
  },
  {
    id: "film",
    index: "03",
    kicker: "See it before it exists.",
    title: "Film, 3D & AI",
    copy: "Show buyers the home, the township and the view before a single brick is laid.",
    tone: "#167a7d",
    cargo: [{ slug: "3d-rendering-services", name: "3D Rendering Services" }],
    extras: ["Brand films & AVs", "3D walkthroughs", "AI-assisted production"],
  },
];

export function HomeEngines() {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef);

  return (
    <section ref={rootRef} className="hm hm-engines" aria-labelledby="hm-engines-title">
      <div className="hm-engines-inner">
        <span className="hm-rail" aria-hidden />
        <ServicesRouteTruck
          className="hm-engines-truck"
          parkedBehind=".hm-mark"
          start="top 55%"
          end="bottom 50%"
        />
        <div className="hm-mark" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/s2/distance.png" alt="" width={500} height={500} />
          <span className="hm-mark-label">RitzMedia</span>
        </div>

        <header className="hm-engines-head">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">Capabilities</span>
              <span>KM 03 · What&rsquo;s in the cargo</span>
            </p>
            <HmTitle id="hm-engines-title" lines={TITLE} />
            <p data-hm-fade className="hm-lede">
              Each engine can solve on its own. Together, they remove the hand-offs that slow good
              work down.
            </p>
          </div>
          <TransitionLink data-hm-fade href="/services" className="hm-btn is-ink">
            All services <span aria-hidden>→</span>
          </TransitionLink>
        </header>

        <div className="hm-engines-list">
          {ENGINES.map((engine) => (
            <article
              key={engine.id}
              data-hm-fade
              className="hm-engine"
              style={{ "--tone": engine.tone } as CSSProperties}
            >
              <span className="hm-engine-fill" aria-hidden />
              <p className="hm-engine-index" aria-hidden>
                E-{engine.index}
              </p>

              <div className="hm-engine-copy">
                <p className="hm-engine-kicker">{engine.kicker}</p>
                <h3 className="hm-engine-title">{engine.title}</h3>
                <p className="hm-engine-text">{engine.copy}</p>
                <TransitionLink href={`/services#${engine.id}`} className="hm-engine-more">
                  Explore this engine
                  <HmArrow />
                </TransitionLink>
              </div>

              <ul className="hm-engine-cargo" aria-label={`${engine.title} services`}>
                {engine.cargo.map((service) => {
                  const icon = SERVICE_ICONS[service.slug];
                  return (
                    <li key={service.slug}>
                      <TransitionLink href={`/services/${service.slug}`} className="hm-chip">
                        <span className="hm-chip-icon" aria-hidden>
                          {icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={icon} alt="" width={64} height={64} loading="lazy" />
                          ) : (
                            service.name.charAt(0)
                          )}
                        </span>
                        <span className="hm-chip-name">{service.name}</span>
                        <HmArrow className="hm-chip-arrow" />
                      </TransitionLink>
                    </li>
                  );
                })}
                {engine.extras.map((extra) => (
                  <li key={extra}>
                    <span className="hm-chip is-static">
                      <span className="hm-chip-dot" aria-hidden />
                      <span className="hm-chip-name">{extra}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
