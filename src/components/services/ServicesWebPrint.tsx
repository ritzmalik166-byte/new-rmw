"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { ServicesPrintPaper } from "./ServicesPrintPaper";
import { ServicesWebMockup } from "./ServicesWebMockup";

registerGsap();

export function ServicesWebPrint() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  /* The section before this one holds still while this one slides up over
     it, until this section fills the screen. */
  useGSAP(
    () => {
      const root = rootRef.current;
      const under = root?.previousElementSibling;
      if (!root || !(under instanceof HTMLElement) || !ready || reduced) return;

      const fitsScreen = () => under.offsetHeight <= window.innerHeight;
      const visibleCenter = () =>
        fitsScreen() ? "50% 50%" : `50% ${under.offsetHeight - window.innerHeight / 2}px`;
      under.classList.add("svc-overlap-under");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: under,
          start: () => (fitsScreen() ? "top top" : "bottom bottom"),
          end: () => `+=${Math.min(under.offsetHeight, window.innerHeight)}`,
          pin: true,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        under,
        { scale: 1, borderRadius: 0, "--overlap-shade": 0, transformOrigin: visibleCenter },
        {
          scale: 0.9,
          borderRadius: 32,
          "--overlap-shade": 0.55,
          transformOrigin: visibleCenter,
          ease: "none",
        },
        0,
      ).fromTo(
        root,
        {
          borderTopLeftRadius: 48,
          borderTopRightRadius: 48,
          boxShadow: "0 -36px 70px -24px rgb(0 0 0 / 0.6)",
        },
        {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: "0 -36px 70px -24px rgb(0 0 0 / 0)",
          ease: "power1.in",
        },
        0,
      );

      return () => under.classList.remove("svc-overlap-under");
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="svc-webprint" aria-labelledby="svc-web-title">
      <div className="svc-webprint-inner">
        <div className="svc-web">
          <div className="svc-web-art">
            <ServicesWebMockup />
          </div>

          <div className="svc-web-copy">
            <p className="svc-web-kicker">KM 02 · Distinct by design</p>
            <h2 id="svc-web-title" className="svc-web-title">
              Web Design &amp; Development Services
            </h2>
            <p className="svc-web-lede">
              Fast, search-ready websites and landing pages designed for one job: turning visitors
              into enquiries.
            </p>
            <Link className="svc-web-cta" href="/work">
              See sites we&rsquo;ve built <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <ServicesPrintPaper />
      </div>
    </section>
  );
}
