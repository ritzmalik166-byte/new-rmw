import type { Metadata } from "next";
import { PortfolioVideoGallery } from "@/components/portfolio/PortfolioVideoGallery";
import { AGENCY_KEYWORDS, pageMetadata } from "@/lib/seo";
import "@/styles/portfolio/portfolio.css";

export const metadata: Metadata = pageMetadata({
  title: "Celebrity Endorsement Videos | Ritz Media World",
  description: "Explore Ritz Media World's celebrity endorsement and celebrity-led campaign videos.",
  keywords: AGENCY_KEYWORDS,
  path: "/portfolio/celebrity-endorsements",
});

export default function CelebrityEndorsementVideosPage() {
  return (
    <PortfolioVideoGallery
      title="Celebrity films"
      accent="with star power."
      lede="Celebrity-led campaigns, endorsements, and brand moments created to give the message a face people remember."
      playlistId="PLF2LkcQMvAI8IZ0MHK36floa8TZAfQVOW"
      videoCount={8}
    />
  );
}
