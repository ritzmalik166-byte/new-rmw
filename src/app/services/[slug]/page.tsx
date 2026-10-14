import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StartProject } from "@/components/home/StartProject";
import { HomeFaq } from "@/components/homepage/HomeFaq";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceLowerSections } from "@/components/services/ServiceLowerSections";
import { ServiceRouteSection } from "@/components/services/ServiceRouteSection";
import { getServiceLayout } from "@/lib/service-layout";
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

  return {
    title: { absolute: `${service.name} | Ritz Media World` },
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
    <article className="sd-page">
      <ServiceHero service={service} />
      <ServiceRouteSection service={service} subServices={getSubServices(service.slug)} />
      <ServiceLowerSections service={service} relatedServices={relatedServices} />
      <HomeFaq
        id="service-faq"
        kicker="KM 07"
        title={SERVICE_FAQ_TITLE}
        lede={null}
        faqs={getServiceLayout(service).faqs.map((faq) => ({ q: faq.question, a: faq.answer }))}
      />
      <StartProject />
    </article>
  );
}
