import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { PrivacyRoad } from "@/components/privacy/PrivacyRoad";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "@/styles/privacy/privacy.css";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | Ritz Media World",
  description:
    "Read how Ritz Media World collects, uses and protects your personal data on ritzmediaworld.com.",
  keywords: ["Ritz Media World privacy policy", "data protection Ritz Media World"],
  path: "/privacy-policy",
});

const UPDATED = "23 October 2026";
const { email, address, phones } = site.footer;

const SECTIONS = [
  { id: "who-we-are", title: "Who we are" },
  { id: "data-we-collect", title: "Information we collect" },
  { id: "how-we-use", title: "How we use your information" },
  { id: "cookies", title: "Cookies & local storage" },
  { id: "sharing", title: "Sharing & third parties" },
  { id: "retention", title: "How long we keep data" },
  { id: "security", title: "Keeping data secure" },
  { id: "your-rights", title: "Your rights" },
  { id: "children", title: "Children's privacy" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact & grievances" },
] as const;

const COOKIES = [
  {
    name: "Essential",
    tone: "#0b6b3a",
    always: true,
    copy: "Remember your theme (light or dark) and your cookie choice, and keep forms and page transitions working. These are stored in your browser and are never used to track you.",
  },
  {
    name: "Embedded services",
    tone: "#e0457e",
    always: false,
    copy: "Google Maps on our contact cards and YouTube or social media embeds may set their own cookies when they load. These are governed by Google's and the respective platforms' privacy policies.",
  },
  {
    name: "Analytics & marketing",
    tone: "#f3c33c",
    always: false,
    copy: "We do not currently run analytics or advertising trackers on this site. If we add them in future, they will only load after you choose “Accept all”, and this policy will be updated.",
  },
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
            Your data rides with us only as far as it needs to. This page explains what we collect
            when you visit {site.fullName}, why we collect it, and the controls you have over it.
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
          <section id="who-we-are" className="pv-section">
            <h2>Who we are</h2>
            <p>
              {site.fullName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a creative,
              branding, digital and media agency founded in 2008 and based at {address}, India. We
              operate this website and are responsible for the personal data collected through it.
            </p>
            <p>
              This policy is written in line with India&rsquo;s Digital Personal Data Protection Act,
              2023 and the Information Technology Act, 2000 and its rules. By using this website you
              agree to the practices described here.
            </p>
          </section>

          <section id="data-we-collect" className="pv-section">
            <h2>Information we collect</h2>
            <h3>Information you give us</h3>
            <ul>
              <li>
                <strong>Contact &amp; project enquiries:</strong> your name, email address, phone
                number, the service you&rsquo;re interested in and your message.
              </li>
              <li>
                <strong>Phone verification:</strong> your mobile number, used to send a one-time
                password (OTP) that confirms the enquiry is genuine.
              </li>
              <li>
                <strong>Job applications:</strong> your name, contact details, the role you&rsquo;re
                applying for and the resume or documents you upload.
              </li>
              <li>
                <strong>Website audit requests:</strong> your website address and contact details so
                we can send you the report.
              </li>
            </ul>
            <h3>Information collected automatically</h3>
            <ul>
              <li>
                Standard technical data your browser sends, such as IP address, browser type, device
                and pages requested, which our hosting provider may log for security and performance.
              </li>
              <li>
                Preferences stored in your own browser, such as your theme and cookie choice (see{" "}
                <a href="#cookies">Cookies &amp; local storage</a>).
              </li>
            </ul>
          </section>

          <section id="how-we-use" className="pv-section">
            <h2>How we use your information</h2>
            <ul>
              <li>To respond to your enquiries, prepare proposals and deliver our services.</li>
              <li>To verify phone numbers and protect our forms from spam and abuse.</li>
              <li>To review job applications and contact shortlisted candidates.</li>
              <li>To prepare and send website audits you request.</li>
              <li>To keep the website secure, working properly and improving over time.</li>
              <li>To meet legal, accounting and regulatory obligations.</li>
            </ul>
            <p>
              We do not sell your personal data, and we will not send you marketing messages unless
              you have asked us to or agreed to receive them.
            </p>
          </section>

          <section id="cookies" className="pv-section">
            <h2>Cookies &amp; local storage</h2>
            <p>
              Cookies and local storage are small pieces of data saved in your browser. When you
              first visit, a banner asks you to choose between <strong>Accept all</strong> and{" "}
              <strong>Essentials only</strong>. To change your choice later, clear this site&rsquo;s
              data in your browser and the banner will appear again.
            </p>
            <ul className="pv-cookies">
              {COOKIES.map((cookie) => (
                <li key={cookie.name} style={{ "--pv-tone": cookie.tone } as CSSProperties}>
                  <p className="pv-cookie-head">
                    <span>{cookie.name}</span>
                    <em>{cookie.always ? "Always on" : "With consent"}</em>
                  </p>
                  <p>{cookie.copy}</p>
                </li>
              ))}
            </ul>
            <p>
              You can also block or delete cookies through your browser settings. Blocking essential
              storage may stop some parts of the site from remembering your preferences.
            </p>
          </section>

          <section id="sharing" className="pv-section">
            <h2>Sharing &amp; third parties</h2>
            <p>We share personal data only when needed, with:</p>
            <ul>
              <li>
                Service providers who host the website, send emails and deliver OTP messages on our
                behalf, under confidentiality obligations.
              </li>
              <li>
                Embedded platforms such as Google Maps and YouTube when you choose to load or interact
                with them.
              </li>
              <li>
                Authorities or advisers where required by law, or to protect our rights, users or the
                public.
              </li>
            </ul>
            <p>
              Links to social networks and other websites are governed by those sites&rsquo; own
              privacy policies.
            </p>
          </section>

          <section id="retention" className="pv-section">
            <h2>How long we keep data</h2>
            <p>
              We keep enquiry data for as long as needed to respond and maintain our business
              relationship, and job applications for up to 12 months so we can consider you for
              future roles, unless you ask us to delete them sooner. Data we must keep for legal or
              tax reasons is retained for the period the law requires.
            </p>
          </section>

          <section id="security" className="pv-section">
            <h2>Keeping data secure</h2>
            <p>
              The site is served over HTTPS and access to submitted information is limited to the
              team members who need it. No method of transmission or storage is completely secure,
              but we take reasonable technical and organisational measures to protect your data.
            </p>
          </section>

          <section id="your-rights" className="pv-section">
            <h2>Your rights</h2>
            <p>Subject to applicable law, you can ask us to:</p>
            <ul>
              <li>Tell you what personal data we hold about you and how it is used.</li>
              <li>Correct, complete or update inaccurate data.</li>
              <li>Delete your data when it is no longer needed.</li>
              <li>Withdraw consent you have given, including your cookie choice.</li>
              <li>Nominate someone to exercise these rights on your behalf.</li>
            </ul>
            <p>
              Write to <a href={`mailto:${email}`}>{email}</a> and we&rsquo;ll respond within a
              reasonable time.
            </p>
          </section>

          <section id="children" className="pv-section">
            <h2>Children&rsquo;s privacy</h2>
            <p>
              This website is intended for businesses and adults. We do not knowingly collect
              personal data from children under 18. If you believe a child has shared data with us,
              please contact us and we will delete it.
            </p>
          </section>

          <section id="changes" className="pv-section">
            <h2>Changes to this policy</h2>
            <p>
              We may update this policy as our services or the law change. The &ldquo;Last
              updated&rdquo; date at the top shows when it was last revised.
            </p>
          </section>

          <section id="contact" className="pv-section pv-contact">
            <h2>Contact &amp; grievances</h2>
            <p>
              For privacy questions, requests or complaints, reach our grievance team:
            </p>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${email}`}>{email}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  {phones.map((phone) => (
                    <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
                      {phone}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{address}</dd>
              </div>
            </dl>
            <TransitionLink href="/contact" className="pv-cta">
              Contact us
              <span aria-hidden>→</span>
            </TransitionLink>
          </section>
        </div>
      </div>
    </article>
  );
}
