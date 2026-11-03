import { TransitionLink } from "@/components/motion/TransitionLink";

const SERVICES = [
  ["Creative Advertising & Branding", "creative-services"],
  ["Digital Marketing & SEO", "digital-marketing"],
  ["Social Media Marketing", "digital-marketing"],
  ["Performance Marketing & Google Ads", "digital-marketing"],
  ["Media Planning & Buying", "print-advertising"],
  ["Print & Outdoor Advertising", "print-advertising"],
  ["Influencer & Celebrity Marketing", "influencer-marketing-agency-in-india"],
  ["3D Rendering & Visualization", "3d-rendering"],
  ["AI-Powered Creative Solutions", "ai-services"],
] as const;

export function AboutServices() {
  return (
    <section className="about-services" aria-labelledby="about-services-title">
      <div className="about-services-head">
        <p className="about-services-kicker">One team · every route</p>
        <h2 id="about-services-title">Our Services</h2>
      </div>
      <ol className="about-services-list">
        {SERVICES.map(([title, slug], index) => (
          <li key={title}>
            <TransitionLink href={`/services/${slug}`}>
              <span className="about-services-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <span className="about-services-arrow" aria-hidden>
                ↗
              </span>
            </TransitionLink>
          </li>
        ))}
      </ol>
    </section>
  );
}
