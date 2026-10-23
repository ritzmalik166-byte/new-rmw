import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { CaseStudyShowcase } from "@/components/case-study/CaseStudyShowcase";
import { CaseStudyReports } from "@/components/case-study/CaseStudyReports";
import { getCaseStudies } from "@/lib/case-studies";
import { AGENCY_KEYWORDS, pageMetadata } from "@/lib/seo";
import "@/styles/case-study/case-study.css";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Ritz Media World Case Studies & Market Insights",
  description:
    "Explore real-world case studies, creative campaigns, branding strategies, and market insights from Ritz Media World to discover what drives brand success.",
  keywords: AGENCY_KEYWORDS,
  path: "/case-study",
});

export default async function CaseStudyPage() {
  const caseStudies = await getCaseStudies();

  return (
    <article className="hm cs-page">
      <CaseStudyHero caseStudies={caseStudies} />
      <CaseStudyShowcase caseStudies={caseStudies} />
      <CaseStudyReports />
    </article>
  );
}
