import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StartProject } from "@/components/home/StartProject";
import { ServiceLowerSections } from "@/components/services/ServiceLowerSections";
import { ServiceRouteSection } from "@/components/services/ServiceRouteSection";
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

      <ServiceRouteSection service={service} />
      <ServiceLowerSections service={service} relatedServices={relatedServices} />

      <StartProject />
    </article>
  );
}
