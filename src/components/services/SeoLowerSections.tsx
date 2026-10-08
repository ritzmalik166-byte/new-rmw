import Link from "next/link";
import type { ServiceDetail } from "@/lib/services-data";

type SeoLowerSectionsProps = {
  service: ServiceDetail;
  relatedServices: ServiceDetail[];
};

const FAQS = [
  {
    question: "What does an SEO service from RMW include?",
    answer:
      "A technical audit, keyword and intent mapping, on-page and content work, local SEO, authority building and reporting. The final scope is confirmed once we have looked at your site and goals.",
  },
  {
    question: "How long before SEO shows results?",
    answer:
      "SEO is ongoing work, not an instant switch. Timing depends on your site, competition, starting point and the work required; we review progress against the agreed scope.",
  },
  {
    question: "Do you optimise for AI answers like ChatGPT and Google AI Overviews?",
    answer:
      "Yes. The programme includes answer-engine visibility work alongside technical SEO, useful content and clear entity signals.",
  },
  {
    question: "How is SEO different from Google Ads?",
    answer:
      "Google Ads can buy immediate placement while a campaign is funded. SEO builds organic visibility through technical health, relevant content and authority over time.",
  },
  {
    question: "Can you handle local SEO for several locations or projects?",
    answer:
      "Yes. Local SEO can cover Google Business Profiles, consistent local listings and location-specific landing pages, with the scope tailored to your locations.",
  },
  {
    question: "What will I see in your reports?",
    answer:
      "Reporting can cover organic visibility, traffic, rankings and conversions, together with work completed and next steps for the agreed programme.",
  },
];

const PROCESS_LABELS = ["Inspect", "Plan the route", "Drive in sprints", "Service stop"];

export function SeoLowerSections({
  service,
  relatedServices,
}: SeoLowerSectionsProps) {
  return (
    <div className="subsvc-seo-lower">
      <section id="roadmap" className="subsvc-seo-process" aria-labelledby="seo-process-title">
        <p className="subsvc-seo-kicker">KM 03 · The RMW process</p>
        <h2 id="seo-process-title">
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

      <section id="why-rmw" className="subsvc-seo-intent" aria-labelledby="seo-intent-title">
        <p className="subsvc-seo-kicker">KM 04 · The SEO engine</p>
        <h2 id="seo-intent-title">
          Search is where intent <span>shows up first.</span>
        </h2>
        <div className="subsvc-seo-intent-points">
          <div>
            <h3>Compounding traffic</h3>
            <p>Rankings can keep working after the campaign budget stops.</p>
          </div>
          <div>
            <h3>Lower acquisition cost</h3>
            <p>Organic leads add another route to qualified enquiries.</p>
          </div>
          <div>
            <h3>Credibility</h3>
            <p>Being the clear answer builds trust before the first call.</p>
          </div>
        </div>
        <div className="subsvc-seo-intent-tape" aria-hidden="true">
          <span>Ranking, not rented</span><span>Drive slow · rank fast</span>
        </div>
      </section>

      <section id="stats" className="subsvc-seo-proof" aria-labelledby="seo-proof-title">
        <p className="subsvc-seo-kicker">KM 05 · Work &amp; results</p>
        <h2 id="seo-proof-title">
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
          Results vary by site, competition, scope and implementation; past performance does not guarantee future results.
        </p>
      </section>

      <section id="seo-faq" className="subsvc-seo-faq" aria-labelledby="seo-faq-title">
        <p className="subsvc-seo-kicker">KM 06 · FAQs</p>
        <h2 id="seo-faq-title">
          Questions at the <span>dhaba.</span>
        </h2>
        <div className="subsvc-seo-faq-list">
          {FAQS.map((faq, index) => (
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
