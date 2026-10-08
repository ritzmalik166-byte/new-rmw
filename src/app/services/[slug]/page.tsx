import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StartProject } from "@/components/home/StartProject";
import { SeoRouteSection } from "@/components/services/SeoRouteSection";
import { SeoLowerSections } from "@/components/services/SeoLowerSections";
import {
  getAllServices,
  getRelatedServices,
  getServiceBySlug,
} from "@/lib/services-data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const services = getAllServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Ritz Media World",
    };
  }

  return {
    title: `${service.name} | Ritz Media World`,
    description: service.shortDescription,
    keywords: [service.name, ...service.tags, "Ritz Media World"],
    openGraph: {
      title: `${service.name} | Ritz Media World`,
      description: service.shortDescription,
      images: [service.image],
    },
  };
}

export default async function SubServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(service.slug, 3);

  return (
    <article className="subsvc-page">
      {/* 1. Hero Section */}
      <section className="subsvc-hero">
        <div className="subsvc-hero-tape top" aria-hidden="true"></div>
        <div className="subsvc-hero-dots" aria-hidden="true"></div>

        <div className="subsvc-hero-content">
          {/* Left Column: Breadcrumbs & Value Proposition */}
          <div className="subsvc-hero-info">
            <nav className="subsvc-breadcrumb-bar" aria-label="Breadcrumbs">
              <ol className="subsvc-breadcrumbs">
                <li>
                  <Link href="/" className="subsvc-breadcrumb-link">
                    Home
                  </Link>
                </li>
                <li className="subsvc-breadcrumb-sep" aria-hidden="true">
                  &gt;
                </li>
                <li>
                  <Link href="/services" className="subsvc-breadcrumb-link">
                    Services
                  </Link>
                </li>
                <li className="subsvc-breadcrumb-sep" aria-hidden="true">
                  &gt;
                </li>
                <li>
                  <Link href="/services" className="subsvc-breadcrumb-link">
                    {service.engineCategory || "Digital & Media"}
                  </Link>
                </li>
                <li className="subsvc-breadcrumb-sep" aria-hidden="true">
                  &gt;
                </li>
                <li className="subsvc-breadcrumb-current" aria-current="page">
                  {service.name}
                </li>
              </ol>
            </nav>

            <h1 className="subsvc-hero-title">
              {service.uppercaseName || `${service.name} SERVICES`}
            </h1>
            <p className="subsvc-hero-copy">
              {service.fullOverview || service.shortDescription}
            </p>

            <div className="subsvc-hero-ctas">
              <Link href="#the-problem" className="subsvc-btn-primary">
                <span>SEE THE WORK</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="#capabilities" className="subsvc-btn-secondary">
                <span>SEE {service.name} WORK</span>
              </Link>
            </div>
          </div>

          {/* Right Column: File Card & Engine Header */}
          <div className="subsvc-hero-card-wrapper">
            <div className="subsvc-card-tab">
              <span className="tab-yellow">
                {service.engine || "ENGINE 02 - DIGITAL & MEDIA"}
              </span>
              <span className="tab-red">
                {service.badgeDate || `SEP-05 · ${service.name} · 2026`}
              </span>
            </div>

            <div className="subsvc-file-card">
              <div className="card-tape top" aria-hidden="true"></div>
              <div className="card-inner">
                <div className="card-definition">
                  <svg
                    className="def-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span className="def-label">
                    DEFINITION · WHAT IS {service.name}?
                  </span>
                </div>
                <p className="card-desc">
                  {service.definitionText || service.shortDescription}
                </p>
                <hr className="card-divider" />
                <div className="card-tags">
                  {(service.cardTags || ["GOOGLE", "AI OVERVIEWS", "CHATGPT", "GEMINI"]).join(" · ")}
                </div>
              </div>
              <div className="card-footer">
                <span className="card-footer-latin">
                  {service.truckArt?.before || "SEARCH"}
                </span>
                <span className="hindi-text">
                  {service.truckArt?.hindi || "ओके"}
                </span>
                <span className="card-footer-latin">
                  {service.truckArt?.after || "PLEASE"}
                </span>
              </div>
              <div className="card-tape bottom" aria-hidden="true"></div>
            </div>
          </div>
        </div>

        <div className="subsvc-hero-tape bottom" aria-hidden="true"></div>
      </section>

      {/* 2. The Business Problem & Route Navigator */}
      {service.slug === "seo" ? (
        <SeoRouteSection service={service} />
      ) : (
        <section id="the-problem" className="subsvc-problem-section">
        <div className="subsvc-problem-container">
          <div className="subsvc-problem-content">
            <div className="subsvc-problem-line" aria-hidden="true"></div>
            <div className="subsvc-problem-text">
              <p className="subsvc-problem-kicker">
                {service.problemKicker || service.kicker || "KM 01 · THE BUSINESS PROBLEM"}
              </p>
              <h2 className="subsvc-problem-title">
                {service.problemHeading || service.heading}
              </h2>
              <p className="subsvc-problem-desc">
                {service.problemCopy || "When high-intent buyers search for your solutions, every ranking drop converts directly into lost business. We engineer comprehensive organic dominance across conventional search algorithms and next-generation AI answer engines."}
              </p>
            </div>
          </div>

          <aside className="subsvc-route-box" aria-label="Route Navigator">
            <div className="subsvc-route-header">
              <span className="subsvc-route-title">ON THIS ROUTE</span>
              <span className="subsvc-route-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="subsvc-route-body">
              <nav className="subsvc-route-nav">
                <a href="#the-problem" className="subsvc-route-link active">
                  <span className="route-num">01</span>
                  <span className="route-name">The problem</span>
                  <span className="route-bullet" aria-hidden="true">▶</span>
                </a>
                <a href="#capabilities" className="subsvc-route-link">
                  <span className="route-num">02</span>
                  <span className="route-name">Capabilities</span>
                  <span className="route-bullet" aria-hidden="true">▶</span>
                </a>
                <a href="#roadmap" className="subsvc-route-link">
                  <span className="route-num">03</span>
                  <span className="route-name">The roadmap</span>
                  <span className="route-bullet" aria-hidden="true">▶</span>
                </a>
                <a href="#why-rmw" className="subsvc-route-link">
                  <span className="route-num">04</span>
                  <span className="route-name">Why RMW</span>
                  <span className="route-bullet" aria-hidden="true">▶</span>
                </a>
                <a href="#start-a-project" className="subsvc-route-link">
                  <span className="route-num">05</span>
                  <span className="route-name">Get in touch</span>
                  <span className="route-bullet" aria-hidden="true">▶</span>
                </a>
              </nav>
            </div>
          </aside>
        </div>
        </section>
      )}

      {/* 3. Performance Metrics Strip */}
      {service.slug !== "seo" && <section id="stats" className="subsvc-stats-section" aria-label="Key Performance Indicators">
        <div className="subsvc-stats-grid">
          {service.stats.map((stat) => (
            <div key={stat.label} className="subsvc-stat-item">
              <p className="subsvc-stat-val">{stat.value}</p>
              <p className="subsvc-stat-lbl">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>}

      {/* 4. Core Capabilities Grid */}
      {service.slug !== "seo" && <section id="capabilities" className="subsvc-capabilities-section">
        <div className="subsvc-section-header">
          <p className="subsvc-section-kicker">Core Capabilities</p>
          <h2 className="subsvc-section-title">
            What We Deliver For {service.name}
          </h2>
          <p className="subsvc-section-lede">
            Every capability is handled by in-house domain veterans with proven expertise in Indian commercial media and buyer behavior.
          </p>
        </div>

        <div className="subsvc-capabilities-grid">
          {service.capabilities.map((cap, index) => (
            <div key={cap.title} className="subsvc-cap-card">
              <div>
                <p className="subsvc-cap-num">
                  Capability {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="subsvc-cap-title">{cap.title}</h3>
                <p className="subsvc-cap-copy">{cap.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>}

      {service.slug === "seo" && (
        <SeoLowerSections service={service} relatedServices={relatedServices} />
      )}

      {/* 5. Process Roadmap (KM Steps) */}
      {service.slug !== "seo" && <section id="roadmap" className="subsvc-process-section" aria-label="Strategic roadmap">
        <div className="subsvc-process-container">
          <div className="subsvc-section-header">
            <p className="subsvc-section-kicker">The Roadmap</p>
            <h2 className="subsvc-section-title">
              How We Execute: From Insight to Impact
            </h2>
            <p className="subsvc-section-lede">
              We never skip the foundational starting steps. Every campaign travels the same disciplined road from audit to scalable execution.
            </p>
          </div>

          <div className="subsvc-process-grid">
            {service.process.map((step) => (
              <div key={step.step} className="subsvc-process-card">
                <div className="subsvc-process-top">
                  <span className="subsvc-step-badge">{step.step}</span>
                  <span className="subsvc-km-tag">{step.km}</span>
                </div>
                <h3 className="subsvc-process-title">{step.title}</h3>
                <p className="subsvc-process-copy">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* 6. Why Ritz Media World Advantage */}
      {service.slug !== "seo" && <section id="why-rmw" className="subsvc-why-section">
        <div className="subsvc-section-header">
          <p className="subsvc-section-kicker">The RMW Difference</p>
          <h2 className="subsvc-section-title">Why Brands Ride With Us</h2>
          <p className="subsvc-section-lede">
            Over 18 years, we have built an unshakeable reputation for honest plans, in-house craft, and commercial accountability.
          </p>
        </div>

        <div className="subsvc-why-grid">
          {service.whyUs.map((pillar) => (
            <div key={pillar.title} className="subsvc-why-card">
              <h3 className="subsvc-why-title">{pillar.title}</h3>
              <p className="subsvc-why-copy">{pillar.copy}</p>
            </div>
          ))}
        </div>
      </section>}

      {/* 7. Related Services Explorer */}
      {service.slug !== "seo" && <section className="subsvc-related-section">
        <div className="subsvc-related-container">
          <div className="subsvc-related-header">
            <div>
              <h2 className="subsvc-related-title">Explore Other Capabilities</h2>
              <p className="subsvc-related-subtitle">
                Pair {service.name} with our other integrated marketing engines.
              </p>
            </div>
            <Link href="/services" className="subsvc-btn-secondary !text-white !border-white/30 hover:!bg-white hover:!text-black">
              View All 9 Services ↗
            </Link>
          </div>

          <div className="subsvc-related-grid">
            {relatedServices.map((rel) => (
              <Link
                key={rel.slug}
                href={`/services/${rel.slug}`}
                className="subsvc-related-card"
              >
                <div className="subsvc-related-thumb">
                  <Image
                    src={rel.image}
                    alt={rel.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="subsvc-related-body">
                  <div>
                    <h3 className="subsvc-related-name">{rel.name}</h3>
                    <p className="subsvc-related-desc">{rel.shortDescription}</p>
                  </div>
                  <span className="subsvc-related-arrow">
                    Learn More <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>}

      {/* 8. Conversion Audit / Lead Section */}
      <div id="start-a-project">
        <StartProject />
      </div>
    </article>
  );
}
