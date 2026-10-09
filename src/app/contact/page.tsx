import type { Metadata } from "next";
import Image from "next/image";
import { AddressMap } from "@/components/contact/AddressMap";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to Ritz Media World. Share your brand goals, verify your number and the right person from our Noida team will call you within one working day.",
};

const ROUTE = [
  { km: "KM 01", title: "Fill the slip", copy: "A few details about you and your brand." },
  { km: "KM 02", title: "Verify OTP", copy: "A quick code keeps spam off the road." },
  { km: "KM 03", title: "We call back", copy: "Within one working day." },
] as const;

export default function ContactPage() {
  const { address, email, phones } = site.footer;

  return (
    <section className="ct" aria-labelledby="ct-title">
      <div className="ct-inner">
        <div className="ct-side">
          <header className="ct-head">
            <p className="ct-kicker">
              <span className="ct-pill">Contact us</span>
              <span className="ct-hindi" lang="hi">
                चलो, बात करते हैं
              </span>
            </p>
            <h1 id="ct-title" className="ct-title">
              Got a brand to move? <span>Let&rsquo;s load it up.</span>
            </h1>
            <p className="ct-lede">
              Have a project, an RFP or just a question? Drop your details and we&rsquo;ll get you
              to the right person.
            </p>
          </header>

          <div className="ct-dispatch">
            <p className="ct-dispatch-kicker">Dispatch office</p>
            <p className="ct-dispatch-name">{site.fullName}</p>
            <p className="ct-dispatch-copy">
              Our Noida depot, where every brief gets loaded, checked and dispatched. Drop by, call
              or write in.
            </p>
            <p className="ct-plate" aria-hidden>
              Horn <span lang="hi">ओके</span> Please
            </p>

            <ul className="ct-dispatch-list">
              <li>
                <span className="ct-dispatch-icon" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                  </svg>
                </span>
                <span>
                  <span className="ct-dispatch-label">Visit · hover for map</span>
                  <AddressMap address={address} name={site.fullName} />
                </span>
              </li>
              <li>
                <span className="ct-dispatch-icon" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A17 17 0 0 1 4.5 5a2 2 0 0 1 2-2Z" />
                  </svg>
                </span>
                <span>
                  <span className="ct-dispatch-label">Call</span>
                  <span className="ct-dispatch-phones">
                    {phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
                        {phone}
                      </a>
                    ))}
                  </span>
                </span>
              </li>
              <li>
                <span className="ct-dispatch-icon" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
                  </svg>
                </span>
                <span>
                  <span className="ct-dispatch-label">Email</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </span>
              </li>
              <li>
                <span className="ct-dispatch-icon" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M12 7.5V12l3 2" />
                  </svg>
                </span>
                <span>
                  <span className="ct-dispatch-label">Reply time</span>
                  <span className="ct-dispatch-text">Within one working day</span>
                </span>
              </li>
            </ul>
          </div>

          <ol className="ct-route" aria-label="What happens next">
            {ROUTE.map((stop) => (
              <li key={stop.km}>
                <span className="ct-route-km">{stop.km}</span>
                <span className="ct-route-title">{stop.title}</span>
                <span className="ct-route-copy">{stop.copy}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="ct-form-wrap">
          <ContactForm />
        </div>
      </div>

      <div className="ct-road" aria-hidden>
        <span className="ct-road-lane" />
        <Image
          className="ct-road-truck"
          src="/loader/textures/truck-side.webp"
          alt=""
          width={521}
          height={287}
          sizes="120px"
        />
      </div>
    </section>
  );
}
