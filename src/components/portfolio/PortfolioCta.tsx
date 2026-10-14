"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { type HmLine, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { WHATSAPP_HREF } from "@/components/layout/FloatingContact";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { RealTruck, setWheelTurn } from "@/components/ui/RealTruck";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();

const DEFAULT_TITLE: HmLine[] = [{ text: "We let our work" }, { text: "do the talking.", accent: true }];
const DEFAULT_LEDE =
  "Browse our portfolio to see what we've created for our clients. Then tell us where your brand needs to go next.";

export function PortfolioCta({
  km = "KM 04",
  kicker = "Explore our full portfolio",
  title = DEFAULT_TITLE,
  lede = DEFAULT_LEDE,
  whatsapp = false,
}: {
  km?: string;
  kicker?: string;
  title?: readonly HmLine[];
  lede?: string;
  /** Swap the button pair for "Start a project" + "Chat on WhatsApp". */
  whatsapp?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      const road = root?.querySelector<HTMLElement>(".pf-cta-road");
      const truck = root?.querySelector<HTMLElement>(".pf-cta-truck");
      if (!root || !road || !truck || !ready) return;

      const parkedX = () => road.clientWidth - truck.offsetWidth - Math.max(16, road.clientWidth * 0.04);

      if (reduced) {
        gsap.set(truck, { x: parkedX });
        return;
      }

      gsap.fromTo(
        truck,
        { x: () => -truck.offsetWidth },
        {
          x: parkedX,
          ease: "none",
          onUpdate: () => setWheelTurn(truck, Number(gsap.getProperty(truck, "x"))),
          scrollTrigger: {
            trigger: road,
            start: "top bottom",
            end: "bottom 55%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  const { email, phones } = site.footer;

  return (
    <section ref={rootRef} className="hm pf-cta" aria-labelledby="pf-cta-title">
      <div className="hm-wrap pf-cta-inner">
        <p data-hm-fade className="hm-kicker is-light">
          <span className="hm-pill">{km}</span>
          <span>{kicker}</span>
        </p>
        <HmTitle id="pf-cta-title" lines={title} />
        <p data-hm-fade className="hm-lede">
          {lede}
        </p>
        <div data-hm-fade className="hm-actions">
          {whatsapp ? (
            <>
              <TransitionLink href="/contact" className="hm-btn is-ink">
                Start a project <span aria-hidden>→</span>
              </TransitionLink>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="hm-btn pf-cta-btn">
                Chat on WhatsApp <span aria-hidden>→</span>
              </a>
            </>
          ) : (
            <>
              <TransitionLink href="/contact" className="hm-btn is-ink">
                Contact us <span aria-hidden>→</span>
              </TransitionLink>
              <a href="/contact" target="_blank" rel="noopener noreferrer" className="hm-btn pf-cta-btn">
                Start a project <span aria-hidden>→</span>
              </a>
            </>
          )}
        </div>
        <ul data-hm-fade className="pf-cta-lines" aria-label="Reach us">
          <li>
            <a href={`mailto:${email}`}>{email}</a>
          </li>
          {phones.map((phone) => (
            <li key={phone}>
              <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="pf-cta-road" aria-hidden>
        <span className="pf-road-lane" />
        <span className="pf-cta-truck">
          <RealTruck flip small />
        </span>
      </div>
    </section>
  );
}
