import type { Metadata } from "next";
import { ServicesContentMarketing } from "@/components/services/ServicesContentMarketing";
import { ServicesCreative } from "@/components/services/ServicesCreative";
import { ServicesDigitalMarketing } from "@/components/services/ServicesDigitalMarketing";
import { ServicesEngineBanner } from "@/components/services/ServicesEngineBanner";
import { ServicesEngines } from "@/components/services/ServicesEngines";
import { ServicesHero } from "@/components/services/ServicesHero";
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
    </>
  );
}
