import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { CaseStudyShowcase } from "@/components/case-study/CaseStudyShowcase";
import { CaseStudyReports } from "@/components/case-study/CaseStudyReports";
import { getCaseStudies } from "@/lib/case-studies";
import { AGENCY_KEYWORDS, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Case Studies in Advertising & Marketing | Ritz Media World",
  description:
    "Explore Ritz Media World case studies - bold design, brand films, and campaigns that defy convention.",
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
