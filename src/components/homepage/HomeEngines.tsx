  "use client";

  import { useRef, type CSSProperties } from "react";
  import { TransitionLink } from "@/components/motion/TransitionLink";
  import { ServicesRouteTruck } from "@/components/services/ServicesRouteTruck";
  import { RENDER_ICONS, SERVICE_ICONS } from "@/lib/service-icons";
  import { HmArrow, HmTitle, useHomeReveal } from "./shared";

  const TITLE = [{ text: "One agency." }, { text: "Three engines.", accent: true }] as const;

  type Engine = {
    id: string;
    index: string;
    kicker: string;
    title: string;
    copy: string;
    tone: string;
    cargo: { slug: string; name: string; icon?: string; href?: string }[];
    extras: string[];
  };

  const RENDER_HREF = "/services/3d-rendering";
  const RENDER_TYPES = [
    { slug: "3d-exterior", name: "3D Exterior Rendering", icon: RENDER_ICONS.exterior },
    { slug: "3d-interior", name: "3D Interior Rendering", icon: RENDER_ICONS.interior },
    { slug: "3d-aerial", name: "Aerial & Township", icon: RENDER_ICONS.aerial },
    { slug: "3d-floor-plan", name: "3D Floor Plans", icon: RENDER_ICONS.plan },
    { slug: "3d-amenity", name: "Amenity Rendering", icon: RENDER_ICONS.amenity },
  ];

  const ENGINES: Engine[] = [
    {
      id: "brand",
      index: "01",
      kicker: "Distinct by design.",
      title: "Brand & Creative",
      copy: "Brand positioning, identity design, advertising campaigns, and celebrity and influencer partnerships that help people notice, remember, and trust your brand.",
      tone: "#d93829",
      cargo: [
        { slug: "creative-services", name: "Creative Services" },
        { slug: "content-marketing", name: "Content Marketing" },
        { slug: "celebrity-endorsements", name: "Celebrity Endorsements" },
        { slug: "influencer-marketing-agency-in-india", name: "Influencer Marketing" },
      ],
      extras: [],
    },
    {
      id: "digital",
      index: "02",
      kicker: "Own the attention.",
      title: "Digital & Media",
      copy: "Digital marketing, SEO, PPC, web development, and print and radio advertising that put your brand in front of the right audience and turn attention into leads.",
      tone: "#1457a8",
      cargo: [
        { slug: "digital-marketing", name: "Digital Marketing" },
        { slug: "web-designing-and-development", name: "Web Development" },
        { slug: "print-advertising", name: "Print Advertising" },
        { slug: "radio-advertising", name: "Radio Advertising" },
      ],
      extras: [],
    },
    {
      id: "film",
      index: "03",
      kicker: "See it before it exists.",
      title: "3D Rendering Services",
      copy: "Brand films, photorealistic 3D rendering, and AI-assisted production that let audiences see your product, project, or space before it is even built.",
      tone: "#167a7d",
      cargo: RENDER_TYPES.map((type) => ({ ...type, href: RENDER_HREF })),
      extras: [],
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
            rail=".hm-rail"
            parkedBehind=".hm-mark"
            start="top 55%"
            end="bottom 50%"
          />
          <div className="hm-mark" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/s2/distance.webp" alt="" width={500} height={500} loading="lazy" decoding="async" />
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
              Our three engines cover every stage of brand building, from creative and content to digital marketing and media.
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
                    const icon = service.icon ?? SERVICE_ICONS[service.slug];
                    return (
                      <li key={service.slug}>
                        <TransitionLink href={service.href ?? `/services/${service.slug}`} className="hm-chip">
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
