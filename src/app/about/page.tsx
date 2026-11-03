import type { Metadata } from "next";
import { AboutFounder } from "@/components/about/AboutFounder";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutOfficeTour } from "@/components/about/AboutOfficeTour";
import { AboutJourney } from "@/components/about/AboutJourney";
import { AboutMileage } from "@/components/about/AboutMileage";
import { AboutProofs } from "@/components/about/AboutProofs";
import { AboutServices } from "@/components/about/AboutServices";
import { AboutTruckBack } from "@/components/about/AboutTruckBack";
import { StartProject } from "@/components/home/StartProject";
import { HomeFaq } from "@/components/homepage/HomeFaq";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "@/styles/about/hero.css";
import "@/styles/about/drive.css";
import "@/styles/about/truck-back.css";
import "@/styles/about/mileage.css";
import "@/styles/about/journey.css";
import "@/styles/about/proofs.css";
import "@/styles/about/services.css";
import "@/styles/about/founder.css";
import "@/styles/about/office-tour.css";

export const metadata: Metadata = pageMetadata({
  title: "About Ritz Media World | Advertising & Digital Marketing",
  description:
    "Discover Ritz Media World, a creative agency in Noida offering advertising, branding, digital marketing, media planning, 3D rendering and AI solutions.",
  keywords: [
    "creative advertising agency in Noida",
    "advertising agency in Noida",
    "digital marketing agency in Noida",
    "full-service advertising agency",
    "branding agency in Noida",
    "SEO agency in Noida",
    "social media marketing agency",
    "performance marketing agency",
    "media planning and buying agency",
    "influencer marketing agency",
    "3D rendering services",
    "AI creative agency",
    "print advertising agency",
    "outdoor advertising agency",
  ],
  path: "/about.html",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about.html" },
        ])}
      />
      <AboutOfficeTour />
      <AboutHero />
      <AboutTruckBack />
      <AboutMileage />
      <AboutJourney />
      <AboutServices />
      <AboutProofs />
      <AboutFounder />
      <HomeFaq
        kicker="Before you set off"
        title={[{ text: "Common" }, { text: "Highways (FAQs)", accent: true }]}
        faqs={site.about.faqs}
      />
      <StartProject headingLevel="h2" />
    </>
  );
}
