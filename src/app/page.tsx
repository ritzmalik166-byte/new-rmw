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
  title: "Ritz Media World: Creative + Strategy + Media Agency",
  description:
    "Top advertising agency in Delhi NCR. Ritz Media World offers SEO, radio and creative print ad services in Greater Noida. Most trusted digital marketing company.",
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
