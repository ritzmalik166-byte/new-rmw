import type { CSSProperties } from "react";

type ServicesEngineBannerProps = {
  index: string;
  kicker: string;
  title: string;
  copy: string;
  km: string;
  tone?: string;
  border?: "ticker" | "scallop";
};

export function ServicesEngineBanner({
  index,
  kicker,
  title,
  copy,
  km,
  tone,
  border = "ticker",
}: ServicesEngineBannerProps) {
  const titleId = `svc-engine-banner-${index}`;

  return (
    <section
      className="svc-engine-banner"
      aria-labelledby={titleId}
      style={tone ? ({ "--banner-bg": tone } as CSSProperties) : undefined}
    >
      {/* <div className="ticker-pattern" aria-hidden /> */}
      <div className="svc-engine-banner-inner">
        <p className="svc-engine-banner-index" aria-hidden>
          E-{index}
        </p>
        <div className="svc-engine-banner-copy">
          <p className="svc-engine-banner-kicker">{kicker}</p>
          <h2 id={titleId} className="svc-engine-banner-title">
            {title}
          </h2>
          <p className="svc-engine-banner-lede">{copy}</p>
        </div>
        <span className="svc-engine-banner-km">{km}</span>
      </div>
      {border === "scallop" ? (
        <div className="svc-engine-banner-scallop" aria-hidden />
      ) : (
        <div className="ticker-pattern ticker-pattern-bottom" aria-hidden />
      )}
    </section>
  );
}
