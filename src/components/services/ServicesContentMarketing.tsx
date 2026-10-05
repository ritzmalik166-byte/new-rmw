import { Fragment, type CSSProperties } from "react";

const SERVICES = [
  {
    numeral: "१",
    index: "01",
    title: "Content Strategy",
    copy: "Topics, formats and a calendar mapped to real search demand.",
    tone: "#c83256",
  },
  {
    numeral: "२",
    index: "02",
    title: "Email & Newsletters",
    copy: "Nurture sequences that keep your brand in the inbox, not the spam folder.",
    tone: "#2a7bbf",
  },
  {
    numeral: "३",
    index: "03",
    title: "Assets & Infographics",
    copy: "Guides, reports and visuals that turn complex facts into shareable ones.",
    tone: "#2f8a4e",
  },
  {
    numeral: "४",
    index: "04",
    title: "Promotion & optimization",
    copy: "Distribution, updates and SEO fixes so good content keeps working.",
    tone: "#c83256",
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
            Stories people choose to read, save and forward, planned around what your buyers search
            for and built to rank on Google and in AI answers.
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
                <h3 className="svc-content-card-title">
                  <RollText text={service.title} />
                </h3>
                <p className="svc-content-card-copy">{service.copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RollText({ text }: { text: string }) {
  const words = text.split(" ");
  const offsets = words.map((_, w) => words.slice(0, w).join("").length);

  return (
    <>
      <span className="sr-only">{text}</span>
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
    </>
  );
}
