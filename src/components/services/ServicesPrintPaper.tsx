"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

const PRINT_SERVICES = [
  { title: "Advertisement Design", copy: "Layouts built to win the glance on a busy page.", page: "02" },
  { title: "Ad Placement", copy: "The right paper, edition and page for your audience.", page: "03" },
  { title: "Copywriting", copy: "Headlines that sell in five words or fewer.", page: "04" },
  { title: "Cost Negotiation", copy: "Publisher relationships that bring the rate down.", page: "05" },
  { title: "Ad Size Optimization", copy: "Maximum impact for every column centimetre paid for.", page: "06" },
  { title: "Ad Scheduling", copy: "Release dates timed to launches, festivals and weekends.", page: "07" },
] as const;

/* Shaded share of a page for each format: [left, top, width, height] in %. */
const AD_SIZES = [
  { name: "Front Page Jacket", note: "Wraps the whole paper", area: [0, 0, 100, 100] },
  { name: "Full Page", note: "One page, no competition", area: [14, 10, 72, 80] },
  { name: "Half Page", note: "Above or below the fold", area: [0, 50, 100, 50] },
  { name: "Quarter Page", note: "Strong reach, smaller spend", area: [50, 50, 50, 50] },
  { name: "Strip & Ear Panels", note: "Front-page visibility", area: [0, 84, 100, 16] },
  { name: "Classified Display", note: "Local, targeted, quick", area: [66, 62, 34, 22] },
] as const;

const CLASSIFIEDS = [
  { tag: "Wanted", body: "A headline that sells in five words." },
  { tag: "Missing", body: "Readers who skipped a badly designed ad. Not seen since 2008." },
] as const;

export function ServicesPrintPaper() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();

  /* The page rolls out of the press under a roller, then the ad gets stamped. */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const paper = root.querySelector(".svc-print");
      const roller = root.querySelector(".svc-press-roller");
      const stamp = root.querySelector(".svc-ad-stamp");
      const ad = root.querySelector(".svc-ad");
      if (!paper || !roller || !stamp || !ad) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });

      tl.fromTo(
        paper,
        { clipPath: "inset(-6% -6% 100% -6%)" },
        { clipPath: "inset(-6% -6% -6% -6%)", duration: 1.7, ease: "power1.inOut", clearProps: "clipPath" },
      )
        .fromTo(
          roller,
          { autoAlpha: 1, top: "0%" },
          { top: "100%", duration: 1.7, ease: "power1.inOut" },
          0,
        )
        .fromTo(
          roller,
          { backgroundPositionX: "0px" },
          { backgroundPositionX: "-180px", duration: 1.7, ease: "power1.inOut" },
          0,
        )
        .to(roller, { autoAlpha: 0, duration: 0.25 })
        .fromTo(
          stamp,
          { autoAlpha: 0, scale: 2.6, rotate: -32 },
          { autoAlpha: 1, scale: 1, rotate: -12, duration: 0.32, ease: "power4.in" },
          "-=0.05",
        )
        .fromTo(
          ad,
          { x: 0, y: 0 },
          { keyframes: { x: [0, -3, 3, -1.5, 0], y: [0, 2, -1, 0, 0] }, duration: 0.3, clearProps: "transform" },
        );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <div ref={rootRef} className="svc-print-wrap">
      <span className="svc-paper-sheet svc-paper-sheet--back" aria-hidden />
      <span className="svc-paper-sheet svc-paper-sheet--mid" aria-hidden />
      <span className="svc-press-roller" aria-hidden />

      <article className="svc-print" aria-labelledby="svc-print-title">
        <header className="svc-paper-mast">
          <p className="svc-paper-ear">
            <b>Weather</b>
            Clear skies for brands that advertise
          </p>
          <p className="svc-paper-name" aria-hidden>
            The RMW Times
          </p>
          <p className="svc-paper-ear svc-paper-ear--right">
            <b>Late City Edition</b>
            Ideas that travel
          </p>
        </header>

        <p className="svc-print-meta">
          <span>Vol. XVIII · No. 07</span>
          <span>Noida · Delhi NCR</span>
          <span>Est. 2008</span>
          <span>₹5.00</span>
        </p>

        <p className="svc-print-kicker">Special report · Print edition</p>
        <h2 id="svc-print-title" className="svc-print-title">
          Print Advertising Services
        </h2>
        <p className="svc-print-lede">
          From the front-page jacket to the classifieds: we design the ad, win the placement and
          negotiate the rate.
        </p>

        <div className="svc-paper-body">
          <div className="svc-paper-story">
            <p className="svc-paper-byline">By the RMW Media Desk · Noida</p>
            <div className="svc-paper-cols">
              <p className="svc-paper-drop">
                <b>NOIDA —</b> A newspaper ad gets about two seconds on a crowded page. For eighteen
                years, Ritz Media World has made those two seconds count for brands across Delhi
                NCR and beyond.
              </p>
              <p>
                The desk writes the headline, sets the layout to the paper&rsquo;s column grid,
                books the slot and negotiates the rate, so the budget buys more page.
              </p>
              <blockquote className="svc-paper-quote">
                &ldquo;The best ad on the page isn&rsquo;t the biggest. It&rsquo;s the one people
                read.&rdquo;
              </blockquote>
              <p>
                Releases are timed to launches, festival weekends and admission seasons, and every
                insertion is checked against the booking once the paper hits the stands.
              </p>
            </div>
          </div>

          <figure className="svc-paper-adslot">
            <figcaption className="svc-paper-adlabel">Advertisement</figcaption>
            <div className="svc-ad">
              <p className="svc-ad-top">Bookings open</p>
              <p className="svc-ad-brand">Vedvan</p>
              <p className="svc-ad-head">Live where the forest begins</p>
              <div className="svc-ad-art" aria-hidden>
                <span className="svc-ad-sun" />
                <span className="svc-ad-tower svc-ad-tower--1" />
                <span className="svc-ad-tower svc-ad-tower--2" />
                <span className="svc-ad-tower svc-ad-tower--3" />
                <span className="svc-ad-trees" />
              </div>
              <p className="svc-ad-sub">3 &amp; 4 BHK forest residences</p>
              <p className="svc-ad-cta">Site visits open this weekend</p>
              <p className="svc-ad-fine">Sample ad · Artistic impression · T&amp;C apply</p>
              <span className="svc-ad-stamp" aria-hidden>
                Placed by
                <b>RMW</b>
              </span>
            </div>
          </figure>

          <aside className="svc-paper-desk" aria-label="Ad formats we book">
            <p className="svc-paper-desk-title">The Ad Desk</p>
            <p className="svc-paper-desk-sub">Formats for every budget · rates on request</p>
            <ul className="svc-paper-sizes">
              {AD_SIZES.map((size) => (
                <li key={size.name}>
                  <span className="svc-size-page" aria-hidden>
                    <i
                      style={{
                        left: `${size.area[0]}%`,
                        top: `${size.area[1]}%`,
                        width: `${size.area[2]}%`,
                        height: `${size.area[3]}%`,
                      }}
                    />
                  </span>
                  <span>
                    <b>{size.name}</b>
                    {size.note}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <h3 className="svc-paper-index-title">
          <span>Services inside this edition</span>
        </h3>
        <ul className="svc-print-grid">
          {PRINT_SERVICES.map((service) => (
            <li key={service.title} className="svc-print-item">
              <p className="svc-print-item-page">Page {service.page}</p>
              <h4 className="svc-print-item-title">{service.title}</h4>
              <p className="svc-print-item-copy">{service.copy}</p>
            </li>
          ))}
        </ul>

        <footer className="svc-paper-classifieds">
          <p className="svc-paper-classifieds-title">Classifieds</p>
          <ul>
            {CLASSIFIEDS.map((item) => (
              <li key={item.tag}>
                <b>{item.tag}:</b> {item.body}
              </li>
            ))}
          </ul>
          <Link className="svc-paper-cta" href="/#start-a-project">
            Book your print ad <span aria-hidden>→</span>
          </Link>
        </footer>
      </article>
    </div>
  );
}
