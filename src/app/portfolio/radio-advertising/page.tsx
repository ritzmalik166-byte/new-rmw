import type { Metadata } from "next";
import { PortfolioVideoGallery } from "@/components/portfolio/PortfolioVideoGallery";
import { AGENCY_KEYWORDS, pageMetadata } from "@/lib/seo";
import "@/styles/portfolio/portfolio.css";

export const metadata: Metadata = pageMetadata({
  title: "Radio Advertising Videos | Ritz Media World",
  description: "Explore Ritz Media World's radio advertising work in a playlist of radio spots and audio-led brand films.",
  keywords: AGENCY_KEYWORDS,
  path: "/portfolio/radio-advertising",
});

export default function RadioAdvertisingVideosPage() {
  return (
    <PortfolioVideoGallery
      title="Radio ads"
      accent="that stay with you."
      lede="A collection of radio advertising work from Ritz Media World, built to sound clear, memorable, and unmistakably on-brand."
      playlistId="PLF2LkcQMvAI8JKNM1iRu6eFIbqQvwklUt"
      videoCount={8}
    />
  );
}
