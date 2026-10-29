import type { Metadata } from "next";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { PrivacyRoad } from "@/components/privacy/PrivacyRoad";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "@/styles/privacy/privacy.css";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | Ritz Media World",
  description:
    "Read how Ritz Media World, a full-service advertising agency, collects, uses & protects your personal information when you visit our website or contact us.",
  keywords: ["Ritz Media World privacy policy", "data protection Ritz Media World"],
  path: "/privacy-policy",
});

const UPDATED = "26 October 2026";
const EMAIL = "info@ritzmediaworld.com";
const PHONE = "+91-9220516777";
const ADDRESS = site.footer.address;

const SECTIONS = [
  { id: "information-we-collect", title: "Information we collect" },
  { id: "how-we-use", title: "How we use this information" },
  { id: "cookies", title: "Cookies & tracking technologies" },
  { id: "sharing", title: "Sharing of information" },
  { id: "retention", title: "Data retention" },
  { id: "security", title: "Data security" },
  { id: "your-rights", title: "Your rights" },
  { id: "third-party", title: "Third-party links & embedded content" },
  { id: "children", title: "Children's privacy" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact us" },
] as const;

export default function PrivacyPage() {
  return (
    <article className="pv" aria-labelledby="pv-title">
      <header className="pv-hero">
        <div className="pv-hero-inner">
          <p className="pv-kicker">
            <span className="pv-pill">Legal</span>
            <span className="pv-hindi" lang="hi">
              आपका भरोसा, हमारी ज़िम्मेदारी
            </span>
          </p>
          <h1 id="pv-title" className="pv-title">
            Privacy <span>Policy</span>
          </h1>
          <p className="pv-lede">
            {site.fullName} (&ldquo;the company,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or
            &ldquo;us&rdquo;) cares about the privacy of everyone who visits this website or gets in
            touch about a brand, a campaign, or a partnership. This policy explains what information
            we collect, how we use it, and what choices are available. Using this website means
            agreeing to the practices described below.
          </p>
          <p className="pv-lede">
            It applies to www.ritzmediaworld.com and any related services offered under the{" "}
            {site.fullName} name.
          </p>
          <p className="pv-updated">
            <span>Last updated</span> {UPDATED}
          </p>
        </div>
        <PrivacyRoad />
      </header>

      <div className="pv-body">
        <nav className="pv-toc" aria-label="On this page">
          <p className="pv-toc-head">
            <span className="pv-toc-shield">NH 08</span>
            Route map
          </p>
          <ol>
            {SECTIONS.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <span className="pv-toc-km">KM {String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="pv-content">
          <section id="information-we-collect" className="pv-section">
            <h2>Information We Collect</h2>
            <h3>Information Visitors Provide Directly</h3>
            <p>Filling out the contact or enquiry form means sharing a few details:</p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Contact number</li>
              <li>Service of interest</li>
              <li>Country</li>
              <li>Enquiry message</li>
            </ul>
            <p>
              None of this is collected unless a visitor chooses to submit the form. Sharing it is
              entirely voluntary, whether the reason is a new campaign, a brand partnership, or a
              general question about our services.
            </p>
            <h3>Information Collected Automatically</h3>
            <p>
              Like most websites, this one gathers some technical information in the background. This
              includes browser type, device type, an approximate location based on IP address, the
              pages viewed, the length of a visit, and how someone arrived at the site. This data is
              usually aggregated or anonymized, and it helps us understand how people use the site and
              where it can be improved.
            </p>
          </section>

          <section id="how-we-use" className="pv-section">
            <h2>How We Use This Information</h2>
            <p>
              The information gathered through the contact form and general site activity is used for
              the following purposes:
            </p>
            <ul>
              <li>Responding to enquiries, campaign briefs, and partnership requests</li>
              <li>
                Understanding which advertising, digital, and creative services visitors are most
                interested in
              </li>
              <li>Improving website content, design, and user experience</li>
              <li>Sending updates related to an ongoing enquiry, proposal, or project</li>
              <li>Keeping the website secure and running properly</li>
            </ul>
            <p>
              We don&rsquo;t sell contact information to third parties. It is used to follow up on the
              enquiry a visitor submits and for nothing more.
            </p>
          </section>

          <section id="cookies" className="pv-section">
            <h2>Cookies &amp; Tracking Technologies</h2>
            <p>
              This website may use cookies and similar tracking technologies to keep things running
              smoothly, remember visitor preferences, and understand overall traffic patterns. Cookies
              are small text files that a website stores on a visitor&rsquo;s device so that certain
              information can carry over between visits.
            </p>
            <p>
              As an advertising agency, we may also use analytics and advertising tools, such as
              website analytics and advertising pixels, to measure how our own website and campaigns
              perform. These tools help us understand which pages and messages are useful to visitors.
            </p>
            <p>
              Visitors can control or turn off cookies through their browser settings. Doing so might
              affect how parts of the site function, but the core content remains accessible either
              way.
            </p>
            <p>
              A separate Cookies Policy covers the specific categories of cookies this site uses, for
              anyone who wants the finer details.
            </p>
          </section>

          <section id="sharing" className="pv-section">
            <h2>Sharing of Information</h2>
            <p>
              Personal information is not shared with outside parties, except in the following
              situations:
            </p>
            <ul>
              <li>
                With service providers who help run this website or process enquiries, such as
                hosting providers or email delivery services, and only to the extent they need that
                information to do their job
              </li>
              <li>When required by law, regulation, or a valid legal process</li>
              <li>To protect the rights, safety, or property of {site.fullName}, its clients, or the public</li>
              <li>
                As part of a business transition, such as a merger or acquisition, where information
                may transfer along with it
              </li>
            </ul>
            <p>
              {site.fullName} is the parent company of a group that includes Contenaissance, Creative
              Thinks Media, and My Property Fact. Information may be shared internally within this
              group where it is needed to respond to an enquiry or deliver a requested service.
            </p>
          </section>

          <section id="retention" className="pv-section">
            <h2>Data Retention</h2>
            <p>
              Information submitted through the contact form is kept for as long as it is needed to
              respond to the enquiry, manage an ongoing client relationship, or meet legal and
              accounting obligations. Once that purpose has been served, the information is deleted or
              anonymized.
            </p>
          </section>

          <section id="security" className="pv-section">
            <h2>Data Security</h2>
            <p>
              Reasonable technical and organizational measures are in place to protect personal
              information from unauthorized access, alteration, disclosure, or loss. However, no method
              of transmission over the internet or electronic storage can offer a complete guarantee.
              No one can promise total security, and we won&rsquo;t pretend otherwise.
            </p>
          </section>

          <section id="your-rights" className="pv-section">
            <h2>Your Rights</h2>
            <p>Depending on the data protection laws that apply, visitors may have the right to:</p>
            <ul>
              <li>Request access to the personal information held about them</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion of their personal information, where applicable</li>
              <li>Withdraw consent for future communication at any time</li>
            </ul>
            <p>
              Visitors based in India are covered under the Digital Personal Data Protection Act, and
              this policy is built to align with its principles. Visitors from other regions may have
              additional rights under their own local laws.
            </p>
            <p>
              To exercise any of these rights, visitors can reach out using the{" "}
              <a href="#contact">contact details below</a>.
            </p>
          </section>

          <section id="third-party" className="pv-section">
            <h2>Third-Party Links &amp; Embedded Content</h2>
            <p>
              This website may include links to third-party platforms, such as social media pages, or
              embedded content like campaign videos and showreels. These third parties operate under
              their own privacy policies, and {site.fullName} is not responsible for how they collect
              or use information. Visitors are encouraged to review the privacy practices of any
              third-party site before sharing information there.
            </p>
          </section>

          <section id="children" className="pv-section">
            <h2>Children&rsquo;s Privacy</h2>
            <p>
              This website is not directed at children, and personal information is not knowingly
              collected from anyone under the age of 18. If we learn that a minor has submitted
              information without appropriate consent, it will be deleted.
            </p>
          </section>

          <section id="changes" className="pv-section">
            <h2>Changes to This Policy</h2>
            <p>
              This Privacy Policy may be updated from time to time to reflect changes in practices,
              technology, legal requirements, or other factors. Any changes will be posted on this page
              along with an updated effective date. Continuing to use the website after changes go
              live means accepting the revised policy.
            </p>
          </section>

          <section id="contact" className="pv-section pv-contact">
            <h2>Contact Us</h2>
            <p>
              Questions about this Privacy Policy or how personal information is handled can be sent
              here:
            </p>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${PHONE.replace(/-/g, "")}`}>{PHONE}</a>
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{ADDRESS}</dd>
              </div>
            </dl>
            <TransitionLink href="/contact.html" className="pv-cta">
              Contact us
              <span aria-hidden>→</span>
            </TransitionLink>
          </section>
        </div>
      </div>
    </article>
  );
}
