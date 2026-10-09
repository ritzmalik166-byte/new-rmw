import Link from "next/link";
import { getServiceLayout } from "@/lib/service-layout";
import type { ServiceDetail } from "@/lib/services-data";

type ServiceLowerSectionsProps = {
  service: ServiceDetail;
  relatedServices: ServiceDetail[];
};

const PROCESS_LABELS = ["Inspect", "Plan the route", "Drive in sprints", "Service stop"];

export function ServiceLowerSections({
  service,
  relatedServices,
}: ServiceLowerSectionsProps) {
  const layout = getServiceLayout(service);

  return (
    <div className="subsvc-seo-lower">
      <section id="roadmap" className="subsvc-seo-process" aria-labelledby="service-process-title">
        <p className="subsvc-seo-kicker">KM 03 · The RMW process</p>
        <h2 id="service-process-title">
          Four stops on <span>the route.</span>
        </h2>
        <div className="subsvc-seo-timeline">
          {service.process.slice(0, 4).map((step, index) => (
            <article className="subsvc-seo-stop" key={step.step}>
              <div className="subsvc-seo-stop-marker">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <p className="subsvc-seo-stop-label">{PROCESS_LABELS[index]}</p>
              <h3>{step.title}</h3>
              <p className="subsvc-seo-stop-copy">{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="why-rmw" className="subsvc-seo-intent" aria-labelledby="service-intent-title">
        <p className="subsvc-seo-kicker">KM 04 · The {service.name} engine</p>
        <h2 id="service-intent-title">
          {layout.intentTitle.lead} <span>{layout.intentTitle.accent}</span>
        </h2>
        <div className="subsvc-seo-intent-points">
          {layout.intentPoints.map((point) => (
            <div key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.copy}</p>
            </div>
          ))}
        </div>
        <div className="subsvc-seo-intent-tape" aria-hidden="true">
          <span>{layout.intentTape[0]}</span>
          <span>{layout.intentTape[1]}</span>
        </div>
      </section>

      <section id="stats" className="subsvc-seo-proof" aria-labelledby="service-proof-title">
        <p className="subsvc-seo-kicker">KM 05 · Work &amp; results</p>
        <h2 id="service-proof-title">
          Proof on the <span>tailgate.</span>
        </h2>
        <div className="subsvc-seo-proof-grid">
          {service.stats.slice(0, 2).map((stat, index) => (
            <article
              className={`subsvc-seo-proof-card ${index === 1 ? "is-red" : ""}`}
              key={stat.label}
            >
              <div className="subsvc-seo-proof-top">
                <span>Case {String(index + 1).padStart(2, "0")}</span>
                <span>Result note</span>
              </div>
              <p className="subsvc-seo-proof-label">{stat.label}</p>
              <p className="subsvc-seo-proof-value">{stat.value}</p>
              <p className="subsvc-seo-proof-note">Illustrative programme benchmark</p>
              <span className="subsvc-seo-proof-bumper" aria-hidden="true" />
            </article>
          ))}
        </div>
        <p className="subsvc-seo-proof-links">
          <a href="#start-a-project">Discuss this benchmark ↗</a>
          <a href="#start-a-project">Discuss this benchmark ↗</a>
        </p>
        <p className="subsvc-seo-disclaimer">
          <span aria-hidden="true">✳</span>
          Results vary by brand, market, scope and implementation; past performance does not guarantee future results.
        </p>
      </section>

      <section id="service-faq" className="subsvc-seo-faq" aria-labelledby="service-faq-title">
        <p className="subsvc-seo-kicker">KM 06 · FAQs</p>
        <h2 id="service-faq-title">
          Questions at the <span>dhaba.</span>
        </h2>
        <div className="subsvc-seo-faq-list">
          {layout.faqs.map((faq, index) => (
            <details className="subsvc-seo-faq-item" key={faq.question} open={index === 0}>
              <summary>
                <span className="subsvc-seo-faq-num">{String(index + 1).padStart(2, "0")}</span>
                <span>{faq.question}</span>
                <span className="subsvc-seo-faq-toggle" aria-hidden="true" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="subsvc-seo-related" aria-label="Related services">
        <p className="subsvc-seo-kicker">Related services · Next exits</p>
        <div className="subsvc-seo-related-links">
          {relatedServices.map((related) => (
            <Link key={related.slug} href={`/services/${related.slug}`}>
              {related.name}
            </Link>
          ))}
          <Link href="/services">Explore all services ↗</Link>
        </div>
      </nav>
    </div>
  );
}
