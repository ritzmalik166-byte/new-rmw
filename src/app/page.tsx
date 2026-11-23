import type { Metadata } from "next";
import { StartProject } from "@/components/home/StartProject";
import { Ticker } from "@/components/home/Ticker";
import { HomeAwards } from "@/components/homepage/HomeAwards";
import { HomeEngines } from "@/components/homepage/HomeEngines";
import { HomeFaq } from "@/components/homepage/HomeFaq";
import { HomeHero } from "@/components/homepage/HomeHero";
import { HomeIntro } from "@/components/homepage/HomeIntro";
import { HomeNews } from "@/components/homepage/HomeNews";
import { HomeProof } from "@/components/homepage/HomeProof";
import { HomeRoute } from "@/components/homepage/HomeRoute";
import { HomeVoice } from "@/components/homepage/HomeVoice";
import { HomeWork } from "@/components/homepage/HomeWork";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageJsonLd } from "@/lib/schema";
import { AGENCY_KEYWORDS, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Creative & Advertising Agency in Noida | Ritz Media World",
  description:
    "Ritz Media World is a leading advertising and creative agency in Delhi NCR with 18 years of experience in brand strategy, creative campaigns, and marketing.",
  keywords: AGENCY_KEYWORDS,
  path: "/",
  image: {
    url: "/hero-section/truck-drive.png",
    width: 1280,
    height: 720,
    alt: "Ritz Media World — creative, media and digital marketing agency",
  },
});

export default function Home() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(site.highways.faqs)} />
      <HomeHero />
      <div className="hm-ticker">
        <Ticker />
      </div>
      <HomeIntro />
      <HomeRoute />
      <HomeEngines />
      <HomeProof />
      <HomeWork />
      <HomeVoice />
      <HomeAwards />
      <HomeNews />
      <HomeFaq />
      <StartProject />
    </>
  );
}
