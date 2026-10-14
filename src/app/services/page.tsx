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
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Advertising & Digital Services | Ritz Media World Delhi-NCR",
  description:
    "Discover Ritz Media World's full-service solutions in digital, print, radio and creative advertising designed to grow your brand and drive real results.",
  keywords: [
    "Ritz Media World services",
    "advertising agency India",
    "digital marketing services",
    "print and radio ads",
    "creative branding solutions",
    "media agency",
    "brand promotion India",
    "best print advertising services",
    "top print advertising services",
    "radio advertising cost",
    "Best",
    "Radio Ads Services in Delhi",
    "Best Radio Ads Services in Noida",
    "PR Services in Noida",
    "Digital Marketing Services Delhi NCR",
    "marketing services",
    "creative services",
    "ppc services",
  ],
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
        copy="The look, the words and the famous faces that make people stop, remember and trust."
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
        copy="Search, social, web, newspapers and FM: the channels that carry your message to the buyer and bring the lead back."
        km="KM 05 – 08"
        tone="#1457a8"
        border="scallop"
      />
      <ServicesDigitalMarketing />
      <ServicesWebPrint />
      <ServicesRadio />
      <ServicesEngineBanner
        id="film"
        index="04"
        kicker="Engine Three"
        title="3D Rendering Services"
        copy="Show buyers the home, the township and the view before a single brick is laid."
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
