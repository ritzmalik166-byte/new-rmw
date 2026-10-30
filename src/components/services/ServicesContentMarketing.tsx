import Link from "next/link";
import { Fragment, type CSSProperties } from "react";

const SERVICES = [
  {
    numeral: "१",
    index: "01",
    title: "SEO Content Writing",
    copy: "Content built around real search intent, so it ranks because it answers the question.",
    tone: "#c83256",
  },
  {
    numeral: "२",
    index: "02",
    title: "Website Content Writing",
    copy: "Homepage, service and about-page copy that explains what you do and why it matters.",
    tone: "#2a7bbf",
  },
  {
    numeral: "३",
    index: "03",
    title: "Blog Writing",
    copy: "Research-backed posts that build authority and bring in organic traffic over time.",
    tone: "#2f8a4e",
  },
  {
    numeral: "४",
    index: "04",
    title: "Copywriting",
    copy: "Landing page, ad and campaign copy written to turn readers into enquiries.",
    tone: "#d97a1e",
  },
  {
    numeral: "५",
    index: "05",
    title: "Social Media Content",
    copy: "Platform-specific content that keeps your brand present, consistent and worth engaging with.",
    tone: "#2a7bbf",
  },
  {
    numeral: "६",
    index: "06",
    title: "Email Marketing & Newsletters",
    copy: "Welcome sequences, newsletters and campaigns that earn the open, not just the send.",
    tone: "#c83256",
  },
  {
    numeral: "७",
    index: "07",
    title: "Visual Assets & Infographics",
    copy: "Infographics, presentations and eBooks that make complex information easy to follow.",
    tone: "#d97a1e",
  },
  {
    numeral: "८",
    index: "08",
    title: "Content Promotion & Optimization",
    copy: "Distribution, refreshes, and SEO improvements that keep good content working long after publishing.",
    tone: "#2f8a4e",
  },
] as const;

export function ServicesContentMarketing() {
  return (
    <section className="svc-content" aria-labelledby="svc-content-title">
      <div className="svc-content-inner">
        <div className="svc-content-head">
          <div>
            <p className="svc-content-kicker">KM 02</p>
            <h2 id="svc-content-title" className="svc-content-title">
              Content Marketing
              <br />
              Services
            </h2>
          </div>
          <p className="svc-content-lede">
            Content people choose to read, save, and share, planned around what your audience
            searches for and written to rank on Google and in AI answers.
          </p>
        </div>

        <ul className="svc-content-grid">
          {SERVICES.map((service) => (
            <li
              key={service.title}
              className="svc-content-card"
              style={{ "--tone": service.tone } as CSSProperties}
            >
              <div className="svc-content-card-inner">
                <span className="svc-content-fill" aria-hidden>
                  <span className="svc-content-mark">{service.numeral}</span>
                </span>
                <span className="svc-content-num" aria-hidden>
                  <span className="svc-content-num-track">
                    <span>{service.numeral}</span>
                    <span>{service.index}</span>
                  </span>
                </span>
                <h3 className="svc-content-card-title" aria-label={service.title}>
                  <RollText text={service.title} />
                </h3>
                <p className="svc-content-card-copy">{service.copy}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="svc-explore-row is-center">
          <Link className="svc-explore" href="/services/content-marketing">
            Explore Content Marketing Services <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function RollText({ text }: { text: string }) {
  const words = text.split(" ");
  const offsets = words.map((_, w) => words.slice(0, w).join("").length);

  return (
    <span aria-hidden>
      {words.map((word, w) => (
        <Fragment key={w}>
          {w > 0 && " "}
          <span className="svc-content-word">
            {Array.from(word).map((char, c) => (
              <span
                key={c}
                className="svc-content-char"
                style={{ "--i": offsets[w] + c } as CSSProperties}
              >
                {char}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
