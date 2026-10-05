import Image from "next/image";
import Link from "next/link";

const PRINT_SERVICES = [
  { title: "Advertisement Design", copy: "Layouts built to win the glance on a busy page." },
  { title: "Ad Placement", copy: "The right paper, edition and page for your audience." },
  { title: "Copywriting", copy: "Headlines that sell in five words or fewer." },
  { title: "Cost Negotiation", copy: "Publisher relationships that bring the rate down." },
  { title: "Ad Size Optimization", copy: "Maximum impact for every column centimetre paid for." },
  { title: "Ad Scheduling", copy: "Release dates timed to launches, festivals and weekends." },
] as const;

export function ServicesWebPrint() {
  return (
    <section className="svc-webprint" aria-labelledby="svc-web-title">
      <div className="svc-webprint-inner">
        <div className="svc-web">
          <div className="svc-web-art">
            <Image
              src="/service/image%20819.png"
              alt="Browser mockup of an RMW-built website with tabs for UI/UX Design, Custom Development, E-Commerce, Landing Pages and WordPress"
              width={723}
              height={424}
              sizes="(max-width: 1100px) 92vw, 720px"
            />
          </div>

          <div className="svc-web-copy">
            <p className="svc-web-kicker">KM 02 · Distinct by design</p>
            <h2 id="svc-web-title" className="svc-web-title">
              Web Design &amp; Development Services
            </h2>
            <p className="svc-web-lede">
              Fast, search-ready websites and landing pages designed for one job: turning visitors
              into enquiries.
            </p>
            <Link className="svc-web-cta" href="/work">
              See sites we&rsquo;ve built <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <article className="svc-print" aria-labelledby="svc-print-title">
          <p className="svc-print-meta">
            <span>KM 07 · Print edition</span>
            <span>Noida · Delhi NCR</span>
            <span>Since 2008</span>
          </p>
          <h2 id="svc-print-title" className="svc-print-title">
            Print Advertising Services
          </h2>
          <p className="svc-print-lede">
            From the front-page jacket to the classifieds: we design the ad, win the placement and
            negotiate the rate.
          </p>
          <ul className="svc-print-grid">
            {PRINT_SERVICES.map((service) => (
              <li key={service.title} className="svc-print-item">
                <h3 className="svc-print-item-title">{service.title}</h3>
                <p className="svc-print-item-copy">{service.copy}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
