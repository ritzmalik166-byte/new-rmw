import type { CSSProperties } from "react";
import { ServicesRouteTruck } from "./ServicesRouteTruck";

const ENGINES = [
  {
    id: "brand",
    index: "01",
    kicker: "Distinct by design.",
    title: "Brand & Creative",
    copy: "Positioning, identity and campaign systems that make a brand easier to recognise, remember and choose.",
    points: [
      "Brand strategy & positioning",
      "Naming & identity",
      "Integrated campaigns",
      "Print & outdoor creative",
    ],
    tone: "#d93829",
  },
  {
    id: "digital",
    index: "02",
    kicker: "Own the attention.",
    title: "Digital & Media",
    copy: "A connected planning and optimisation engine across paid, owned and traditional media.",
    points: [
      "Performance marketing",
      "Social media",
      "SEO & search visibility",
      "Media planning & buying",
    ],
    tone: "#2563eb",
  },
  {
    id: "film",
    index: "03",
    kicker: "See it before it exists.",
    title: "Film, 3D & AI",
    copy: "Storytelling and visualisation that compresses the distance between an idea and a convincing experience.",
    points: [
      "Brand films & AVs",
      "3D walkthroughs",
      "Architectural rendering",
      "AI-assisted production",
    ],
    tone: "#0d9488",
  },
] as const;

type Engine = (typeof ENGINES)[number];

export function ServicesEngines() {
  return (
    <section className="svc-engines" aria-labelledby="svc-engines-title">
      <div className="svc-engines-inner">
        <span className="svc-engines-rail" aria-hidden />
        <ServicesRouteTruck
          className="svc-engines-truck"
          parkedBehind=".svc-engines-mark"
          start="top 55%"
          end="bottom 50%"
        />
        <div className="svc-engines-mark" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/s2/distance.png" alt="" width={500} height={500} />
          <span className="svc-engines-mark-label">RitzMedia</span>
        </div>

        <div className="svc-engines-head">
          <p className="svc-engines-kicker">Capabilities</p>
          <h2 id="svc-engines-title" className="svc-engines-title">
            One agency.
            <br />
            Three engines.
          </h2>
          <p className="svc-engines-lede">
            Each engine can solve independently. Together, they remove the hand-offs
            that slow good work down.
          </p>
        </div>

        <div className="svc-engines-grid">
          {ENGINES.map((engine) => (
            <article
              key={engine.id}
              id={engine.id}
              className="svc-engine"
              style={{ "--tone": engine.tone } as CSSProperties}
            >
              <EngineFace engine={engine} />

              <div className="svc-engine-fill" inert aria-hidden>
                <EngineFace engine={engine} hiddenCopy />
              </div>

              <span className="svc-engine-wave" aria-hidden>
                <svg viewBox="0 0 2880 40" preserveAspectRatio="none">
                  <path
                    fill="currentColor"
                    d="M0 22C120 40 240 4 360 22C480 40 600 4 720 22C840 40 960 4 1080 22C1200 40 1320 4 1440 22C1560 40 1680 4 1800 22C1920 40 2040 4 2160 22C2280 40 2400 4 2520 22C2640 40 2760 4 2880 22V40H0Z"
                  />
                </svg>
              </span>

              <svg className="svc-engine-frame" aria-hidden>
                <rect />
              </svg>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function EngineFace({ engine, hiddenCopy = false }: { engine: Engine; hiddenCopy?: boolean }) {
  return (
    <div className="svc-engine-face">
      <div className="svc-engine-top">
        <span className="svc-engine-index">{engine.index}</span>
        <Arrow className="svc-engine-arrow" />
      </div>
      <p className="svc-engine-label">{engine.kicker}</p>
      <h3 className="svc-engine-title">{engine.title}</h3>
      <p className="svc-engine-copy">{engine.copy}</p>
      <ul className="svc-engine-list">
        {engine.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <a
        className="svc-engine-more"
        href={`#${engine.id}`}
        tabIndex={hiddenCopy ? -1 : undefined}
      >
        Explore this engine
        <Arrow className="svc-engine-more-arrow" />
      </a>
    </div>
  );
}

function Arrow({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4 12L12 4M12 4H6.5M12 4V9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
