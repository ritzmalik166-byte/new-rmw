import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StartProject } from "@/components/home/StartProject";
import { HomeFaq } from "@/components/homepage/HomeFaq";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceLowerSections } from "@/components/services/ServiceLowerSections";
import { ServiceRouteSection } from "@/components/services/ServiceRouteSection";
import { pageMetadata, SERVICE_KEYWORDS } from "@/lib/seo";
import { getServiceLayout } from "@/lib/service-layout";
import { SERVICE_SEO } from "@/lib/service-seo";
import {
  getAllServices,
  getRelatedServices,
  getServiceBySlug,
} from "@/lib/services-data";
import { getSubServices } from "@/lib/sub-services-data";

export const revalidate = 3600;

const SERVICE_FAQ_TITLE = [{ text: "Questions at the" }, { text: "dhaba.", accent: true }];

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
      title: { absolute: "Service Not Found | Ritz Media World" },
    };
  }

  const seo = SERVICE_SEO[service.slug] ?? {
    title: `${service.name} | Ritz Media World`,
    description: service.shortDescription,
  };

  return {
    ...pageMetadata({
      title: seo.title,
      description: seo.description,
      keywords: SERVICE_KEYWORDS,
      path: `/services/${service.slug}`,
    }),
    openGraph: {
      title: seo.title,
      description: seo.description,
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
  const layout = getServiceLayout(service);

  return (
    <article className="sd-page">
      <ServiceHero service={service} />
      <ServiceRouteSection service={service} subServices={getSubServices(service.slug)} />
      <ServiceLowerSections service={service} relatedServices={relatedServices} />
      <HomeFaq
        id="service-faq"
        kicker="KM 07"
        title={
          service.slug === "ai-services"
            ? [
                { text: layout.faqTitle.lead },
                { text: layout.faqTitle.accent, accent: true },
              ]
            : SERVICE_FAQ_TITLE
        }
        lede={null}
        faqs={layout.faqs.map((faq) => ({ q: faq.question, a: faq.answer }))}
      />
      <StartProject />
    </article>
  );
}
