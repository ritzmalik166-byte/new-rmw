import type { Metadata } from "next";
import { StartProject } from "@/components/home/StartProject";
import { ServicesContentMarketing } from "@/components/services/ServicesContentMarketing";
import { ServicesCreative } from "@/components/services/ServicesCreative";
import { ServicesDigitalMarketing } from "@/components/services/ServicesDigitalMarketing";
import { ServicesEngineBanner } from "@/components/services/ServicesEngineBanner";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesIndustries } from "@/components/services/ServicesIndustries";
import { ServicesRadio } from "@/components/services/ServicesRadio";
import { ServicesRendering } from "@/components/services/ServicesRendering";
import { ServicesStarPower } from "@/components/services/ServicesStarPower";
import { ServicesWebPrint } from "@/components/services/ServicesWebPrint";
import { pageMetadata, SERVICE_KEYWORDS } from "@/lib/seo";
import "@/styles/services/hero.css";
import "@/styles/services/engine-banner.css";
import "@/styles/services/creative.css";
import "@/styles/services/content.css";
import "@/styles/services/star-power.css";
import "@/styles/services/digital-marketing.css";
import "@/styles/services/web-print.css";
import "@/styles/services/web-mockup.css";
import "@/styles/services/radio.css";
import "@/styles/services/render.css";
import "@/styles/services/industries.css";
import "@/styles/services/explore.css";
import "@/styles/services/responsive.css";

export const metadata: Metadata = pageMetadata({
  title: "Advertising & Digital Services | Ritz Media World Delhi-NCR",
  description:
    "Discover Ritz Media World's full-service solutions in digital, print, radio and creative advertising designed to grow your brand and drive real results.",
  keywords: SERVICE_KEYWORDS,
  path: "/services",
});

export default function ServicesPage() {
  /* A single root element: ServicesWebPrint pins its previous sibling into a
     GSAP pin-spacer, so React must not remove the sections one by one. */
  return (
    <div className="svc-page">
      <ServicesHero />
      <ServicesEngineBanner
        id="brand"
        index="01"
        kicker="Engine One"
        title="Brand & Creative"
        copy="Branding, design, content, and celebrity and influencer partnerships that help people notice, remember, and trust your brand."
        km="KM 01 – 04"
      />
      <ServicesCreative />
      <ServicesContentMarketing />
      <ServicesStarPower />
      <ServicesEngineBanner
        id="digital"
        index="02"
        kicker="Engine Two"
        title="Digital & Media"
        copy="Digital marketing, web development, and print and radio advertising, planned together so every channel reaches the right audience and turns attention into enquiries."
        km="KM 05 – 08"
        tone="#1457a8"
        border="scallop"
      />
      <ServicesDigitalMarketing />
      <ServicesWebPrint />
      <ServicesRadio />
      <ServicesEngineBanner
        id="film"
        index="03"
        kicker="Engine Three"
        title="3D Rendering Services"
        copy="Photorealistic exteriors, interiors, townships, floor plans, and landscapes that let buyers and investors see a project before a single brick is laid."
        km="KM 09"
        tone="#167a7d"
        border="scallop"
      />
      <ServicesRendering />
      <ServicesIndustries />
      <StartProject />
    </div>
  );
}
