import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StartProject } from "@/components/home/StartProject";
import { HomeFaq } from "@/components/homepage/HomeFaq";
import { PortfolioDetailHero } from "@/components/portfolio/detail/PortfolioDetailHero";
import { PortfolioBlockSection, PortfolioIntro } from "@/components/portfolio/detail/PortfolioInfo";
import { PortfolioMore } from "@/components/portfolio/detail/PortfolioMore";
import { PortfolioWork } from "@/components/portfolio/detail/PortfolioWork";
import { PortfolioCta } from "@/components/portfolio/PortfolioCta";
import { getPortfolioDetail, PORTFOLIO_DETAILS, splitTitle } from "@/lib/portfolio-pages";
import { AGENCY_KEYWORDS, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return PORTFOLIO_DETAILS.map((detail) => ({ slug: detail.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const detail = getPortfolioDetail(slug);
  if (!detail) return {};
  return pageMetadata({
    title: detail.seo.title,
    description: detail.seo.description,
    keywords: detail.seo.keywords ?? AGENCY_KEYWORDS,
    path: `/portfolio/${detail.slug}`,
  });
}

const km = (value: number) => `KM ${String(value).padStart(2, "0")}`;

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getPortfolioDetail(slug);
  if (!detail) notFound();

  const blocksStart = 4;
  const faqKm = blocksStart + detail.blocks.length;

  return (
    <article className="pf-page pfd-page" data-tone={detail.tone}>
      <PortfolioDetailHero detail={detail} />
      <PortfolioWork detail={detail} km={km(1)} />
      <PortfolioMore slug={detail.slug} km={km(2)} />
      <PortfolioIntro detail={detail} km={km(3)} />
      {detail.blocks.map((block, index) => (
        <PortfolioBlockSection key={block.title} block={block} km={km(blocksStart + index)} index={index} />
      ))}
      <HomeFaq
        id="portfolio-faq"
        kicker={km(faqKm)}
        title={[{ text: detail.faqTitle[0] }, { text: detail.faqTitle[1], accent: true }]}
        lede={null}
        faqs={detail.faqs}
      />
      <PortfolioCta
        km={km(faqKm + 1)}
        kicker="What we deliver"
        title={splitTitle(detail.closing)}
        lede="Have a project in mind? Let's bring your brand's creative vision to life."
      />
      <StartProject />
    </article>
  );
}
