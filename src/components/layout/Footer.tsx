"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { RealTruck, setWheelTurn } from "@/components/ui/RealTruck";
import { gsap, registerGsap } from "@/lib/gsap";
import { MENU_SERVICES } from "@/lib/services-data";
import { site } from "@/lib/site";
import {
  DialNumber,
  MailGlyph,
  MapPeek,
  MapPinGlyph,
  PhoneGlyph,
  TypeEmail,
} from "./FooterContact";
import { FooterSocials } from "./FooterSocials";

registerGsap();
gsap.registerPlugin(useGSAP);

const TRUCK_GAP = 8;
const MAP_QUERY = "Ritz Media World, Corporate Park, Tower A1, Sector 142, Noida 201305";

export function Footer() {
  const data = site.footer;
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const road = root.querySelector(".site-footer-road") as HTMLElement | null;
      const truck = root.querySelector(".site-footer-truck") as HTMLElement | null;
      const milestone = root.querySelector(".site-footer-milestone") as HTMLElement | null;
      if (!road || !truck || !milestone) return;

      const destinationX = () =>
        Math.max(
          0,
          milestone.offsetLeft - truck.offsetLeft - truck.offsetWidth - TRUCK_GAP,
        );

      if (reduced) {
        gsap.set(truck, { x: destinationX() });
        return;
      }

      /* Plays on its own once the road is in view, so the truck arrives without extra scrolling. */
      gsap.fromTo(
        truck,
        { x: 0 },
        {
          x: destinationX,
          duration: 3.4,
          ease: "power2.inOut",
          onUpdate: () => setWheelTurn(truck, Number(gsap.getProperty(truck, "x"))),
          scrollTrigger: {
            trigger: road,
            start: "top bottom",
            toggleActions: "restart none none reset",
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <footer ref={rootRef} className="site-footer">
      <div className="site-footer-ticket">
        <div className="site-footer-pass">
          <div className="site-footer-intro">
            <div className="site-footer-heading">
              <p className="site-footer-kicker">
                <span className="site-footer-pill">Last stop</span>
                <span className="site-footer-hindi">मंज़िल यहीं है</span>
              </p>
              <h2 className="site-footer-title">
                {data.title[0]} <em>{data.title[1]}</em> {data.title[2]} {data.title[3]}
              </h2>
            </div>
            <p className="site-footer-blurb">{data.blurb}</p>
            <TransitionLink
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-cta"
            >
              Start a project
              <span aria-hidden>→</span>
            </TransitionLink>
          </div>

          <nav className="site-footer-routes" aria-label="Footer">
            <div className="site-footer-route">
              <h3 className="site-footer-route-title">
                <span>01</span>Company
              </h3>
              <ul className="site-footer-links">
                {data.company.map((link) => (
                  <li key={link.label}>
                    <TransitionLink href={link.href} className="site-footer-link">
                      {link.label}
                    </TransitionLink>
                  </li>
                ))}
                <li>
                  <TransitionLink href="/contact" className="site-footer-link">
                    Contact Us
                  </TransitionLink>
                </li>
              </ul>
            </div>

            <div className="site-footer-route is-services">
              <h3 className="site-footer-route-title">
                <span>02</span>Services
              </h3>
              <ul className="site-footer-links">
                {MENU_SERVICES.map((service) => (
                  <li key={service.slug}>
                    <TransitionLink href={`/services/${service.slug}`} className="site-footer-link">
                      {service.name}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="site-footer-route">
              <h3 className="site-footer-route-title">
                <span>03</span>Reach us
              </h3>
              <ul className="site-footer-reach">
                <ReachItem tone="#f3c33c" icon={<PhoneGlyph />} hint="Horn karo">
                  {data.phones.map((phone) => (
                    <DialNumber key={phone} phone={phone} />
                  ))}
                </ReachItem>
                <ReachItem tone="#e0457e" icon={<MailGlyph />} hint="Chitthi bhejo">
                  <TypeEmail email={data.email} />
                </ReachItem>
                <ReachItem tone="#4ec3ea" icon={<MapPinGlyph />} hint="Chai pe aao">
                  <MapPeek address={data.address} query={MAP_QUERY} />
                </ReachItem>
              </ul>
            </div>
          </nav>
        </div>

        <aside className="site-footer-stub" aria-label="Social media">
          <p className="site-footer-stub-kicker">
            <span>Saath chalo</span>
            @ritzmediaworld
          </p>
          <FooterSocials links={data.socials} />
          <div className="site-footer-stub-foot">
            <span className="site-footer-barcode" aria-hidden />
            <span className="site-footer-horn">Horn OK Please</span>
          </div>
        </aside>
      </div>

      <div className="site-footer-road" aria-hidden>
        <div className="site-footer-lane" />
        <div className="site-footer-truck">
          <RealTruck flip small />
        </div>
        <div className="site-footer-milestone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/footer/milestone.png" alt="" width={256} height={256} />
          <span className="site-footer-milestone-text">
            Ritz
            <br />
            Media
          </span>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-trust">
          <span className="site-footer-trust-label">Trusted by</span>
          <ul className="site-footer-partners">
            {data.partners.map((partner) => (
              <li key={partner.alt} title={partner.alt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.src}
                  alt={partner.alt}
                  width={partner.width}
                  height={partner.height}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>

        <span className="site-footer-dock" aria-hidden>
          <span className="site-footer-dock-sign">P</span>
        </span>

        <div className="site-footer-meta">
          <a
            href={data.googleSource}
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer-google"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/footer/partners/google-g.png" alt="" width={16} height={16} />
            Preferred source on Google
          </a>
          <p className="site-footer-copy">
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function ReachItem({
  tone,
  icon,
  hint,
  children,
}: {
  tone: string;
  icon: ReactNode;
  hint: string;
  children: ReactNode;
}) {
  return (
    <li className="site-footer-reach-item" style={{ "--fc-tone": tone } as CSSProperties}>
      <span className="site-footer-reach-icon" aria-hidden>
        {icon}
      </span>
      <span className="site-footer-reach-body">
        <span className="site-footer-reach-hint">{hint}</span>
        {children}
      </span>
    </li>
  );
}
