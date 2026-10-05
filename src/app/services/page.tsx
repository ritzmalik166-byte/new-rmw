import type { Metadata } from "next";
import { StartProject } from "@/components/home/StartProject";
import { ServicesContentMarketing } from "@/components/services/ServicesContentMarketing";
import { ServicesCreative } from "@/components/services/ServicesCreative";
import { ServicesDigitalMarketing } from "@/components/services/ServicesDigitalMarketing";
import { ServicesEngineBanner } from "@/components/services/ServicesEngineBanner";
import { ServicesEngines } from "@/components/services/ServicesEngines";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesIndustries } from "@/components/services/ServicesIndustries";
import { ServicesRadio } from "@/components/services/ServicesRadio";
import { ServicesRendering } from "@/components/services/ServicesRendering";
import { ServicesStarPower } from "@/components/services/ServicesStarPower";
import { ServicesWebPrint } from "@/components/services/ServicesWebPrint";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesEngines />
      <ServicesEngineBanner
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
        index="04"
        kicker="Engine Three"
        title="Film, 3D & AI"
        copy="Show buyers the home, the township and the view before a single brick is laid."
        km="KM 09"
        tone="#167a7d"
        border="scallop"
      />
      <ServicesRendering />
      <ServicesIndustries />
      <StartProject />
    </>
  );
}
