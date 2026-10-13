import { StartProject } from "@/components/home/StartProject";
import { PortfolioCta } from "@/components/portfolio/PortfolioCta";
import { PortfolioExplore } from "@/components/portfolio/PortfolioExplore";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioWhy } from "@/components/portfolio/PortfolioWhy";
import { AGENCY_KEYWORDS, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Portfolio | Creative Work & Case Studies | Ritz Media World",
  description:
    "Explore Ritz Media World's portfolio of brand identity, creative design, website design, brand films, walk-through videos, and influencer marketing campaigns.",
  keywords: AGENCY_KEYWORDS,
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <article className="pf-page">
      <PortfolioHero />
      <PortfolioGallery />
      <PortfolioExplore />
      <PortfolioWhy />
      <PortfolioCta />
      <StartProject />
    </article>
  );
}
