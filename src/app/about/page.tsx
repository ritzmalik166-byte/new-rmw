import type { Metadata } from "next";
import { AboutFounder } from "@/components/about/AboutFounder";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutJourney } from "@/components/about/AboutJourney";
import { AboutMileage } from "@/components/about/AboutMileage";
import { AboutProofs } from "@/components/about/AboutProofs";
import { AboutTruckBack } from "@/components/about/AboutTruckBack";
import { Highways } from "@/components/home/Highways";
import { StartProject } from "@/components/home/StartProject";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutTruckBack />
      <AboutMileage />
      <AboutJourney />
      <AboutProofs />
      <AboutFounder />
      <Highways faqs={site.about.faqs} />
      <StartProject />
    </>
  );
}
