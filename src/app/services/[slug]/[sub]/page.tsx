import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StartProject } from "@/components/home/StartProject";
import { SubServiceHero } from "@/components/sub-service/SubServiceHero";
import { SubServiceRoute } from "@/components/sub-service/SubServiceRoute";
import { SubServiceSiblings } from "@/components/sub-service/SubServiceSiblings";
import { pageMetadata } from "@/lib/seo";
import { getServiceBySlug } from "@/lib/services-data";
import { SUB_SERVICES, getSubService, getSubServices, subServiceHref } from "@/lib/sub-services-data";

export const dynamicParams = false;

type Params = Promise<{ slug: string; sub: string }>;

export function generateStaticParams() {
  return SUB_SERVICES.map((sub) => ({ slug: sub.service, sub: sub.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, sub: subSlug } = await params;
  const sub = getSubService(slug, subSlug);
  if (!sub) return { title: { absolute: "Service Not Found | Ritz Media World" } };

  return {
    ...pageMetadata({
      title: sub.metaTitle,
      description: sub.description,
      keywords: [...sub.keywords, "Ritz Media World"],
      path: subServiceHref(sub),
    }),
    openGraph: { title: sub.metaTitle, description: sub.description, images: [sub.cover] },
  };
}

export default async function SubServiceDetailPage({ params }: { params: Params }) {
  const { slug, sub: subSlug } = await params;
  const service = getServiceBySlug(slug);
  const sub = getSubService(slug, subSlug);
  if (!service || !sub) notFound();

  const siblings = getSubServices(service.slug);

  return (
    <article className="sd-page ssd-page">
      <SubServiceHero service={service} sub={sub} stop={siblings.indexOf(sub) + 1} total={siblings.length} />
      <SubServiceRoute sub={sub} />
      <SubServiceSiblings service={service} current={sub} siblings={siblings} />
      <StartProject />
    </article>
  );
}
