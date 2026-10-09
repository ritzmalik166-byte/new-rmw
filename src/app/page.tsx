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

export const dynamic = "force-dynamic";

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
