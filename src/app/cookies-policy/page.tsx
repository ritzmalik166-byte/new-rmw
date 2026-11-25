import type { Metadata } from "next";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { PrivacyRoad } from "@/components/privacy/PrivacyRoad";
import { pageMetadata } from "@/lib/seo";
import "@/styles/privacy/privacy.css";

export const metadata: Metadata = pageMetadata({
  title: "Cookies Policy | Ritz Media World",
  description:
    "Learn how Ritz Media World uses cookies and similar technologies on its website, the information they collect, and how to manage your cookie preferences.",
  keywords: ["Ritz Media World cookies policy", "cookie preferences Ritz Media World"],
  path: "/cookies-policy",
});

const UPDATED = "23 November 2026";
const EMAIL = "info@ritzmediaworld.com";
const PHONES = ["+91 9220516777", "+91 7290002168"];
const ADDRESS = "7th Floor, Tower A2, Corporate Park, Sector 142, Noida 201305, Uttar Pradesh, India";

const SECTIONS = [
  { id: "introduction", title: "Introduction" },
  { id: "what-are-cookies", title: "What are cookies?" },
  { id: "why-we-use", title: "Why do we use cookies?" },
  { id: "types", title: "Types of cookies we may use" },
  { id: "first-third-party", title: "First-party & third-party cookies" },
  { id: "session-persistent", title: "Session & persistent cookies" },
  { id: "local-storage", title: "Local storage & similar technologies" },
  { id: "consent", title: "Cookie consent & your preferences" },
  { id: "browser", title: "Managing cookies in your browser" },
  { id: "information-collected", title: "Information collected through cookies" },
  { id: "third-party-providers", title: "Third-party providers & data sharing" },
  { id: "retention", title: "Data retention" },
  { id: "children", title: "Children's privacy" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact us" },
] as const;

const BROWSERS = [
  { name: "Google Chrome", href: "https://support.google.com/chrome/answer/95647" },
  {
    name: "Mozilla Firefox",
    href: "https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox",
  },
  {
    name: "Microsoft Edge",
    href: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
  },
  { name: "Apple Safari", href: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
];

export default function CookiesPolicyPage() {
  return (
    <article className="pv" aria-labelledby="pv-title">
      <header className="pv-hero">
        <div className="pv-hero-inner">
          <p className="pv-kicker">
            <span className="pv-pill">Legal</span>
          </p>
          <h1 id="pv-title" className="pv-title">
            Cookies <span>Policy</span>
          </h1>
          <p className="pv-lede">
            How Ritz Media World uses cookies and similar technologies, what they collect, why we use
            them and how you can manage your preferences.
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
          <section id="introduction" className="pv-section">
            <h2>1. Introduction</h2>
            <p>
              Cookies and similar technologies help us operate our website, understand how visitors
              interact with it, improve website performance and provide a better browsing experience.
            </p>
            <p>
              This Cookies Policy explains how Ritz Media World (&ldquo;we&rdquo;, &ldquo;us&rdquo; or
              &ldquo;our&rdquo;) uses cookies and similar technologies when you visit{" "}
              <a href="https://ritzmediaworld.com/">https://ritzmediaworld.com/</a>, the types of
              information they may collect, why we use them and how you can manage your cookie
              preferences.
            </p>
            <p>
              This policy should be read together with our{" "}
              <TransitionLink href="/privacy-policy">Privacy Policy</TransitionLink>.
            </p>
          </section>

          <section id="what-are-cookies" className="pv-section">
            <h2>2. What Are Cookies?</h2>
            <p>
              Cookies are small text files that websites store on your device, such as a computer,
              mobile phone or tablet, when you visit a website.
            </p>
            <p>
              They help websites recognise your browser, remember certain information and support
              different website functions. Cookies may be set by the website you visit or by
              third-party services integrated into the website.
            </p>
          </section>

          <section id="why-we-use" className="pv-section">
            <h2>3. Why Do We Use Cookies?</h2>
            <p>We use cookies and similar technologies for purposes such as:</p>
            <ul>
              <li>Ensuring that our website functions properly.</li>
              <li>Remembering your cookie consent choices and selected website settings.</li>
              <li>Understanding website traffic and visitor interactions.</li>
              <li>Analysing website performance and identifying areas for improvement.</li>
              <li>Supporting website security and preventing misuse.</li>
              <li>Measuring the effectiveness of advertising and marketing activities, where applicable.</li>
            </ul>
            <p>
              We use cookies only for purposes consistent with this policy and applicable legal
              requirements.
            </p>
          </section>

          <section id="types" className="pv-section">
            <h2>4. Types of Cookies We May Use</h2>
            <p>
              Depending on the technologies integrated into our website and your consent choices, we
              may use the following categories of cookies and similar technologies.
            </p>
            <h3>4.1 Strictly Necessary Cookies</h3>
            <p>
              These cookies are required for essential website functions, security and basic
              operations. They may support page navigation, form functionality, security checks and
              the proper functioning of website features.
            </p>
            <p>
              Strictly necessary cookies generally cannot be disabled because the website may not
              function properly without them.
            </p>
            <h3>4.2 Functional Cookies</h3>
            <p>
              Functional cookies help remember your preferences and choices to provide a more
              convenient browsing experience. For example, they may remember selected website settings
              or information needed to support certain website features.
            </p>
            <p>If you disable these cookies, some website features or preferences may not work as intended.</p>
            <h3>4.3 Analytics and Performance Cookies</h3>
            <p>
              We use Google Analytics to analyse website usage and identify opportunities to improve
              our website and services.
            </p>
            <p>
              Where enabled, Google Analytics may collect the information listed in{" "}
              <a href="#information-collected">section 10</a>.
            </p>
            <p>
              Analytics cookies and related technologies are used only in accordance with your cookie
              consent choices and applicable legal requirements.
            </p>
            <h3>4.4 Session Recording and User Interaction Technologies</h3>
            <p>
              We may use session recording or similar technologies to understand how visitors interact
              with our website. These technologies may help us identify navigation difficulties,
              usability issues and opportunities to improve the website experience.
            </p>
            <p>
              Where enabled, these technologies may collect the information listed in{" "}
              <a href="#information-collected">section 10</a>.
            </p>
            <p>
              Session recording and similar non-essential technologies will be activated only after
              the required consent has been obtained.
            </p>
            <h3>4.5 Advertising and Marketing Cookies</h3>
            <p>
              Advertising and marketing cookies may be used to measure advertising performance,
              understand campaign interactions and support relevant marketing activities.
            </p>
            <p>
              Where applicable, these cookies may be provided by third-party advertising platforms,
              including services such as Google.
            </p>
            <p>
              These technologies will be used only in accordance with your consent choices and
              applicable legal requirements.
            </p>
            <h3>4.6 Third-Party and Embedded Content Cookies</h3>
            <p>
              Some website features or embedded content may be provided by third-party services. These
              services may use their own cookies or similar technologies when you interact with their
              content.
            </p>
            <p>
              The use of such technologies depends on the third-party services integrated into our
              website and their respective privacy and cookie practices.
            </p>
          </section>

          <section id="first-third-party" className="pv-section">
            <h2>5. First-Party and Third-Party Cookies</h2>
            <h3>5.1 First-Party Cookies</h3>
            <p>
              First-party cookies are placed directly by our website. They may be used to support
              essential website functions, remember preferences and improve the browsing experience.
            </p>
            <h3>5.2 Third-Party Cookies</h3>
            <p>
              Third-party cookies are placed by external service providers whose technologies or
              services may be integrated into our website. These may include analytics, advertising,
              embedded content or other website functionality providers.
            </p>
            <p>
              The use of third-party cookies depends on the technologies integrated into our website
              and the consent choices you make.
            </p>
          </section>

          <section id="session-persistent" className="pv-section">
            <h2>6. Session and Persistent Cookies</h2>
            <h3>6.1 Session Cookies</h3>
            <p>
              Session cookies are temporary cookies that remain on your device while you browse our
              website. They are generally deleted when you close your browser.
            </p>
            <p>They may support website navigation, form functionality and other essential browsing activities.</p>
            <h3>6.2 Persistent Cookies</h3>
            <p>
              Persistent cookies remain on your device for a specified period or until you delete them
              through your browser settings.
            </p>
            <p>
              They may help remember preferences, recognise returning visitors and support analytics
              or other website functions, depending on their purpose and configuration.
            </p>
          </section>

          <section id="local-storage" className="pv-section">
            <h2>7. Local Storage and Similar Technologies</h2>
            <p>
              In addition to cookies, our website may use similar technologies, such as local storage,
              to store or access information on your device. These technologies may support website
              functionality, preferences and performance.
            </p>
            <p>
              For example, local storage may be used to remember your cookie consent choices or
              selected website settings.
            </p>
            <p>
              You can manage certain stored information through your browser or device settings.
              Restricting these technologies may affect some website features.
            </p>
          </section>

          <section id="consent" className="pv-section">
            <h2>8. Cookie Consent and Managing Your Preferences</h2>
            <p>
              When you visit our website, you may be presented with a cookie consent banner that
              allows you to choose how non-essential cookies and similar technologies are used.
            </p>
            <p>The banner provides the following options:</p>
            <ul>
              <li>
                <strong>Accept all:</strong> Allows the use of cookies and similar technologies covered
                by the consent request, including non-essential categories.
              </li>
              <li>
                <strong>Essentials only:</strong> Allows strictly necessary cookies and technologies
                required for the basic operation and security of the website, while preventing
                non-essential cookies and technologies from being activated.
              </li>
            </ul>
            <p>We will apply your choices in line with applicable legal requirements.</p>
            <p>
              Non-essential cookies and similar technologies will be activated only after the required
              consent has been obtained.
            </p>
          </section>

          <section id="browser" className="pv-section">
            <h2>9. How to Manage or Disable Cookies Through Your Browser</h2>
            <p>
              You can manage, restrict or delete cookies through your browser settings. Most browsers
              allow you to view stored cookies, block certain cookies or remove existing cookies.
            </p>
            <p>You can find instructions for managing cookies in the following browsers:</p>
            <ul>
              {BROWSERS.map((browser) => (
                <li key={browser.name}>
                  <strong>{browser.name}:</strong>{" "}
                  <a href={browser.href} target="_blank" rel="noopener noreferrer">
                    {browser.href}
                  </a>
                </li>
              ))}
            </ul>
            <p>
              Please note that disabling or deleting certain cookies may affect website functionality,
              saved preferences or your overall browsing experience.
            </p>
          </section>

          <section id="information-collected" className="pv-section">
            <h2>10. Information Collected Through Cookies</h2>
            <p>Depending on the type of cookie or technology used, information collected may include:</p>
            <ul>
              <li>IP address or an approximate location derived from it.</li>
              <li>Browser type and version.</li>
              <li>Device type, operating system and screen information.</li>
              <li>Website pages visited and the time spent on those pages.</li>
              <li>Date and time of website visits.</li>
              <li>Referring website or source.</li>
              <li>Clicks, scrolling, navigation patterns and interactions with website elements.</li>
              <li>Session and browsing activity information.</li>
              <li>Cookie preferences and consent choices.</li>
              <li>Technical information relating to website performance and errors.</li>
            </ul>
            <p>We do not intentionally use cookies to collect sensitive personal information.</p>
          </section>

          <section id="third-party-providers" className="pv-section">
            <h2>11. Third-Party Service Providers and Data Sharing</h2>
            <p>
              We may use third-party service providers to support website analytics, performance
              measurement, advertising, embedded content and other website functions.
            </p>
            <p>
              These providers may process information collected through cookies or similar
              technologies in line with their own privacy policies and terms.
            </p>
            <p>
              Depending on the services used, these providers may include Google or other relevant
              technology partners.
            </p>
            <p>We do not sell personal information collected through website cookies to third parties.</p>
            <p>
              For further information about how personal information is processed, shared and
              protected, please refer to our{" "}
              <TransitionLink href="/privacy-policy">Privacy Policy</TransitionLink>.
            </p>
          </section>

          <section id="retention" className="pv-section">
            <h2>12. Data Retention</h2>
            <p>
              Information collected through cookies and similar technologies is retained for periods
              that depend on the purpose of collection, the type of technology used and the settings
              configured by us or the relevant service provider.
            </p>
            <p>
              Information processed through third-party services, such as analytics platforms, may be
              retained according to the applicable service settings and provider retention policies.
            </p>
            <p>
              We take reasonable steps to ensure that information is not retained longer than
              necessary for the purposes for which it was collected, subject to applicable legal
              requirements.
            </p>
          </section>

          <section id="children" className="pv-section">
            <h2>13. Children&rsquo;s Privacy</h2>
            <p>We do not knowingly use cookies to profile children.</p>
          </section>

          <section id="changes" className="pv-section">
            <h2>14. Changes to This Cookies Policy</h2>
            <p>
              We may update this Cookies Policy from time to time to reflect changes in our website,
              technologies, business practices or applicable legal requirements.
            </p>
            <p>
              Any updates will be published on this page with a revised &ldquo;Last Updated&rdquo;
              date. We encourage you to review this policy periodically to stay informed about how we
              use cookies and similar technologies.
            </p>
          </section>

          <section id="contact" className="pv-section pv-contact">
            <h2>15. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Cookies Policy or our use of cookies and
              similar technologies, you can contact us using the details below:
            </p>
            <dl>
              <div>
                <dt>Website</dt>
                <dd>
                  <a href="https://ritzmediaworld.com/">https://ritzmediaworld.com/</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  {PHONES.map((phone, i) => (
                    <span key={phone}>
                      {i > 0 && " / "}
                      <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
                    </span>
                  ))}
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
