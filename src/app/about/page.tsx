import type { Metadata } from "next";
import { AboutFounder } from "@/components/about/AboutFounder";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutJourney } from "@/components/about/AboutJourney";
import { AboutMileage } from "@/components/about/AboutMileage";
import { AboutProofs } from "@/components/about/AboutProofs";
import { AboutTruckBack } from "@/components/about/AboutTruckBack";
import { StartProject } from "@/components/home/StartProject";
import { HomeFaq } from "@/components/homepage/HomeFaq";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "@/styles/about/hero.css";
import "@/styles/about/drive.css";
import "@/styles/about/truck-back.css";
import "@/styles/about/mileage.css";
import "@/styles/about/journey.css";
import "@/styles/about/proofs.css";
import "@/styles/about/founder.css";

export const metadata: Metadata = pageMetadata({
  title: "About Ritz Media World | Award-Winning Delhi NCR Advertising Agency",
  description:
    "Learn how Ritz Media World crafts data-driven brand stories and digital campaigns. Over 18 years of experience turning brands into household names in Delhi NCR.",
  keywords: [
    "Ritz Media World",
    "advertising agency Delhi NCR",
    "creative agency Delhi",
    "full service ad agency Noida",
    "digital marketing agency Delhi NCR",
    "brand storytelling agency India",
    "print radio advertising Delhi NCR",
    "award winning ad agency Delhi",
    "client-centric marketing agency India",
    "advertising & media services Delhi India",
  ],
  path: "/about.html",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutTruckBack />
      <AboutMileage />
      <AboutJourney />
      <AboutProofs />
      <AboutFounder />
      <HomeFaq
        kicker="Before you set off"
        title={[{ text: "Common" }, { text: "Highways", accent: true }]}
        faqs={site.about.faqs}
      />
      <StartProject />
    </>
  );
}
