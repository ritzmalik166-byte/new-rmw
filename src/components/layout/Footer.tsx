"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { RealTruck, setWheelTurn } from "@/components/ui/RealTruck";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";
import {
  ContactCard,
  DialNumber,
  MailGlyph,
  MapPeek,
  MapPinGlyph,
  PhoneGlyph,
  TypeEmail,
} from "./FooterContact";

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
      const milestone = root.querySelector(
        ".site-footer-milestone",
      ) as HTMLElement | null;
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

      gsap.set(truck, { x: 0 });

      gsap.fromTo(
        truck,
        { x: 0 },
        {
          x: destinationX,
          ease: "none",
          onUpdate: () => setWheelTurn(truck, Number(gsap.getProperty(truck, "x"))),
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 2.2,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <footer ref={rootRef} className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-intro">
            <p className="site-footer-kicker">
              <span className="site-footer-pill">Last stop</span>
              <span className="site-footer-hindi">मंज़िल यहीं है</span>
            </p>
            <h2 className="site-footer-title">
              <span>{data.title[0]}</span>{" "}
              <span className="site-footer-title-row">
                <span className="site-footer-title-accent">{data.title[1]}</span>{" "}
                <span>{data.title[2]}</span>
              </span>{" "}
              <span>{data.title[3]}</span>
            </h2>
            <p className="site-footer-blurb">{data.blurb}</p>
            <div className="site-footer-actions">
              <TransitionLink href="/contact" target="_blank" rel="noopener noreferrer" className="site-footer-cta">
                Start a project
                <span aria-hidden>→</span>
              </TransitionLink>
              <a
                href={data.googleSource}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-google"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/footer/partners/google-g.png" alt="Google logo" width={20} height={20} />
                <span>
                  Add as a preferred
                  <br />
                  source on Google
                </span>
              </a>
            </div>
          </div>

          <nav className="site-footer-sign" aria-label="Footer">
            <div className="site-footer-sign-board">
              <p className="site-footer-sign-head">
                <span className="site-footer-sign-shield">NH 08</span>
               Quick routes · Ritz Media World
              </p>
              <div className="site-footer-sign-cols">
                <div>
                  <h3 className="site-footer-sign-title">Company</h3>
                  <ul className="site-footer-sign-list">
                    {data.company.map((link, index) => (
                      <li key={link.label}>
                        <TransitionLink href={link.href} className="site-footer-sign-link">
                          <span className="site-footer-sign-arrow" aria-hidden>
                            ↑
                          </span>
                          <span className="site-footer-sign-label">{link.label}</span>
                          <span className="site-footer-sign-km">{index * 3} km</span>
                        </TransitionLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="site-footer-sign-title">Connect</h3>
                  <ul className="site-footer-sign-list">
                    {data.socials.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="site-footer-sign-link"
                        >
                          <span className="site-footer-sign-arrow" aria-hidden>
                            ↗
                          </span>
                          <span className="site-footer-sign-label">{link.label}</span>
                          <span className="site-footer-sign-km">Online</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <span className="site-footer-sign-poles" aria-hidden />
          </nav>
        </div>

        <div className="site-footer-desk">
          <ContactCard tone="#f3c33c" icon={<PhoneGlyph />} hindi="Horn karo" label="Call us">
            {data.phones.map((phone) => (
              <DialNumber key={phone} phone={phone} />
            ))}
          </ContactCard>
          <ContactCard tone="#e0457e" icon={<MailGlyph />} hindi="Chitthi bhejo" label="Write to us">
            <TypeEmail email={data.email} />
          </ContactCard>
          <ContactCard tone="#4ec3ea" icon={<MapPinGlyph />} hindi="Chai pe aao" label="Visit us">
            <MapPeek address={data.address} query={MAP_QUERY} />
          </ContactCard>
        </div>

        <div className="site-footer-trust">
          <p className="site-footer-band-label">Certified &amp; trusted by</p>
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
      </div>

      <div className="site-footer-road" aria-hidden>
        <div className="site-footer-rule" />
        <div className="site-footer-truck">
          <RealTruck flip small />
        </div>
        <div className="site-footer-milestone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/footer/milestone.png" alt="Ritz Media World milestone stone" width={256} height={256} />
          <span className="site-footer-milestone-text">
            Ritz
            <br />
            Media
            <br />
            World
          </span>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>© {new Date().getFullYear()} {site.fullName}. All rights reserved.</p>
        <p className="site-footer-horn">Horn OK Please</p>
      </div>
    </footer>
  );
}
