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
import { AGENCY_KEYWORDS, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Advertising & Creative Agency in Delhi NCR | Ritz Media World",
  description:
    "Ritz Media World is a leading advertising and creative agency in Delhi NCR with 18 years of experience in brand strategy, creative campaigns, and marketing.",
  keywords: AGENCY_KEYWORDS,
  path: "/",
});

export default function Home() {
  return (
    <>
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
