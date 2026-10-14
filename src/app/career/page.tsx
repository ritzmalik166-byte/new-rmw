import type { Metadata } from "next";
import { CareerForm } from "@/components/career/CareerForm";
import { RealTruck } from "@/components/ui/RealTruck";
import { CAREER_ROLES, CAREER_TEAMS } from "@/lib/career";
import { AGENCY_KEYWORDS, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ritz Media World Careers & Jobs in Noida | Join Our Team",
  description:
    "Explore career opportunities at Ritz Media World in Noida. Join our creative team in media, marketing, content, design, strategy and more. Apply now.",
  keywords: AGENCY_KEYWORDS,
  path: "/career",
});

const ROUTE = [
  { km: "KM 01", title: "Fill the job card", copy: "Share your details, the role you want, and your resume." },
  { km: "KM 02", title: "Verify OTP", copy: "A quick code confirms it's really you." },
  {
    km: "KM 03",
    title: "Hear from HR",
    copy: "Our HR team reviews every application and contacts shortlisted candidates.",
  },
] as const;

export default function CareerPage() {
  return (
    <section className="ct cr" aria-labelledby="cr-title">
      <div className="ct-inner">
        <div className="ct-side">
          <header className="ct-head">
            <p className="ct-kicker">
              <span className="ct-pill">Careers</span>
              <span className="ct-hindi" lang="hi">
                सवारी तैयार है
              </span>
            </p>
            <h1 id="cr-title" className="ct-title">
              Careers at Ritz Media World, <span>Noida</span>
            </h1>
            <p className="ct-lede">
              Passionate about media, storytelling or strategy? We&rsquo;d love to hear from you.
              Fill the job card, verify your number and you&rsquo;re on the road.
            </p>
          </header>

          <div className="ct-dispatch cr-board">
            <p className="ct-dispatch-kicker">Now boarding</p>
            <p className="ct-dispatch-name">Crew wanted for the road ahead</p>
            <p className="ct-dispatch-copy">
              {CAREER_ROLES.length} open roles at our Noida depot, across every engine of the agency.
            </p>
            <p className="ct-plate" aria-hidden>
              Horn <span lang="hi">ओके</span> Please
            </p>
            <ul className="cr-teams" aria-label="Teams we hire for">
              {CAREER_TEAMS.map((team) => (
                <li key={team}>{team}</li>
              ))}
            </ul>
          </div>

          <div className="cr-steps">
            <h2 id="cr-steps-title" className="cr-steps-title">
              Application steps
            </h2>
            <ol className="ct-route" aria-labelledby="cr-steps-title">
              {ROUTE.map((stop) => (
                <li key={stop.km}>
                  <span className="ct-route-km">{stop.km}</span>
                  <span className="ct-route-title">{stop.title}</span>
                  <span className="ct-route-copy">{stop.copy}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="ct-form-wrap">
          <CareerForm />
        </div>
      </div>

      <div className="ct-road" aria-hidden>
        <span className="ct-road-lane" />
        <span className="ct-road-truck">
          <RealTruck rolling small />
        </span>
      </div>
    </section>
  );
}
