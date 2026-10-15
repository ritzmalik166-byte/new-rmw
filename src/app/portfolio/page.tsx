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
    "Explore Ritz Media World's portfolio of brand identity, creative design, website design, brand films, 3D rendering and walkthroughs, and influencer marketing campaigns.",
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
      <PortfolioCta
        kicker="Your brand, next"
        title={[{ text: "Seen enough?" }, { text: "Let's build yours.", accent: true }]}
        lede="Tell us where your brand needs to go next, whether that's a new identity, a website, a campaign, or a 3D launch, and we'll map the route to get there."
        whatsapp
      />
      <StartProject />
    </article>
  );
}
