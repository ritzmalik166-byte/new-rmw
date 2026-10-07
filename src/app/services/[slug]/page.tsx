import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StartProject } from "@/components/home/StartProject";
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
      {/* 1. Breadcrumb navigation */}
      <nav className="subsvc-breadcrumb-bar" aria-label="Breadcrumbs">
        <ol className="subsvc-breadcrumbs">
          <li>
            <Link href="/" className="subsvc-breadcrumb-link">
              Home
            </Link>
          </li>
          <li className="subsvc-breadcrumb-sep" aria-hidden>
            /
          </li>
          <li>
            <Link href="/services" className="subsvc-breadcrumb-link">
              Services
            </Link>
          </li>
          <li className="subsvc-breadcrumb-sep" aria-hidden>
            /
          </li>
          <li className="subsvc-breadcrumb-current" aria-current="page">
            {service.name}
          </li>
        </ol>
      </nav>

      {/* 2. Hero Section */}
      <section className="subsvc-hero">
        <div className="subsvc-hero-grid">
          <div className="subsvc-hero-info">
            <div className="subsvc-hero-header">
              <span className="subsvc-engine-pill">{service.engine}</span>
              <span className="subsvc-kicker-tag">{service.kicker}</span>
            </div>

            <h1 className="subsvc-hero-title">{service.name}</h1>
            <h2 className="subsvc-hero-heading">{service.heading}</h2>
            <p className="subsvc-hero-copy">{service.fullOverview}</p>

            <div className="subsvc-pills">
              {service.tags.map((tag) => (
                <span key={tag} className="subsvc-pill-item">
                  {tag}
                </span>
              ))}
            </div>

            <div className="subsvc-hero-ctas">
              <Link href="#start-a-project" className="subsvc-btn-primary">
                <span>Start A Project</span>
                <span aria-hidden>→</span>
              </Link>
              <Link href="#capabilities" className="subsvc-btn-secondary">
                <span>Explore Deliverables</span>
                <span aria-hidden>↓</span>
              </Link>
            </div>
          </div>

          <div className="subsvc-hero-visual">
            <div className="subsvc-visual-card">
              <Image
                src={service.image}
                alt={service.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="subsvc-visual-img"
              />
              <div className="subsvc-visual-badge">
                <p className="subsvc-badge-tagline">{service.tagline}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Performance Metrics Strip */}
      <section className="subsvc-stats-section" aria-label="Key Performance Indicators">
        <div className="subsvc-stats-grid">
          {service.stats.map((stat) => (
            <div key={stat.label} className="subsvc-stat-item">
              <p className="subsvc-stat-val">{stat.value}</p>
              <p className="subsvc-stat-lbl">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Core Capabilities Grid */}
      <section id="capabilities" className="subsvc-capabilities-section">
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
      </section>

      {/* 5. Process Roadmap (KM Steps) */}
      <section className="subsvc-process-section" aria-label="Strategic roadmap">
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
      </section>

      {/* 6. Why Ritz Media World Advantage */}
      <section className="subsvc-why-section">
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
      </section>

      {/* 7. Related Services Explorer */}
      <section className="subsvc-related-section">
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
      </section>

      {/* 8. Conversion Audit / Lead Section */}
      <div id="start-a-project">
        <StartProject />
      </div>
    </article>
  );
}
