"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

const TITLE = [
  { text: "We deliver", accent: false },
  { text: "brands from", accent: false },
  { text: "present to", accent: true },
  { text: "prominent.", accent: true },
] as const;

const CONSIGNMENT = [
  { engine: "E-01", goods: "Brand & Creative", contents: "Branding, websites, print" },
  { engine: "E-02", goods: "Digital & Media", contents: "Performance, SEO, social, media buying" },
  { engine: "E-03", goods: "Film, 3D & AI", contents: "Brand films, 3D renders, AI creative" },
] as const;

export function ServicesHero() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const q = gsap.utils.selector(root);
      const lines = q(".svch-line-inner");
      const fades = q(".svch-kicker, .svch-lede, .svch-cta");
      const note = q(".svch-note-wrap");
      const stamp = q(".svch-stamp");
      const rows = q(".svch-note-table tbody tr");

      if (reduced) {
        gsap.set([lines, fades, note, stamp, rows], { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(fades[0], { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
        .fromTo(
          lines,
          { yPercent: 110, autoAlpha: 1 },
          { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.09 },
          0.1,
        )
        .fromTo(
          fades.slice(1),
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1 },
          0.55,
        )
        .fromTo(
          note,
          { y: 60, rotate: 9, autoAlpha: 0 },
          { y: 0, rotate: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out" },
          0.25,
        )
        .fromTo(
          rows,
          { x: -12, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 },
          0.85,
        )
        .fromTo(
          stamp,
          { scale: 2.4, autoAlpha: 0 },
          { scale: 1, autoAlpha: 0.9, duration: 0.45, ease: "power4.in" },
          1.35,
        )
        .to(note, { y: 3, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" });
    },
    { dependencies: [ready, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="svch" aria-labelledby="svch-title">
      <div className="svch-inner">
        <div className="svch-copy">
          <p className="svch-kicker">
            <span className="svch-pill">Services</span>
            <span>One agency · Three engines</span>
          </p>

          <h1 id="svch-title" className="svch-title">
            {TITLE.map((line) => (
              <span key={line.text} className={line.accent ? "svch-line is-accent" : "svch-line"}>
                <span className="svch-line-inner">{line.text}</span>
              </span>
            ))}
          </h1>

          <p className="svch-lede">
            Services tailored to transform your brand, packed, loaded and delivered by three
            engines.
          </p>

          <a href="#start-a-project" className="svch-cta">
            Book your consignment <span aria-hidden>→</span>
          </a>
        </div>

        <div className="svch-note-wrap">
          <article className="svch-note" aria-label="RMW Roadways consignment note">
            <header className="svch-note-head">
              <div>
                <p className="svch-note-brand">RMW Roadways</p>
                <p className="svch-note-sub">Consignment note · Bilty</p>
              </div>
              <p className="svch-note-gr">
                <span>G.R. No.</span>
                <strong>UP16-2008</strong>
              </p>
            </header>

            <dl className="svch-note-parties">
              <div>
                <dt>Consignor</dt>
                <dd>Your Brand</dd>
              </div>
              <div>
                <dt>Consignee</dt>
                <dd>Your Audience</dd>
              </div>
              <div>
                <dt>From</dt>
                <dd>Present</dd>
              </div>
              <div>
                <dt>To</dt>
                <dd>Prominent</dd>
              </div>
            </dl>

            <table className="svch-note-table">
              <thead>
                <tr>
                  <th scope="col">Engine</th>
                  <th scope="col">Goods</th>
                  <th scope="col">Contents</th>
                </tr>
              </thead>
              <tbody>
                {CONSIGNMENT.map((row, index) => (
                  <tr key={row.engine} className={`is-e${index + 1}`}>
                    <td className="svch-note-engine">{row.engine}</td>
                    <th scope="row">{row.goods}</th>
                    <td>{row.contents}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <footer className="svch-note-foot">
              <div>
                <span className="svch-note-label">Handle with</span>
                <p className="svch-note-hand">Data, care &amp; creativity</p>
              </div>
              <div className="svch-note-sign">
                <p className="svch-note-hand">RMW</p>
                <span className="svch-note-label">Authorised signatory</span>
              </div>
            </footer>

            <svg className="svch-stamp" viewBox="0 0 120 120" role="img" aria-label="Delivered, since 2008, Noida UP16">
              <defs>
                <path id="svch-arc-top" d="M 22 60 A 38 38 0 0 1 98 60" />
                <path id="svch-arc-bottom" d="M 16 60 A 44 44 0 0 0 104 60" />
              </defs>
              <circle cx="60" cy="60" r="56" />
              <circle cx="60" cy="60" r="48" className="is-thin" />
              <text className="svch-stamp-ring">
                <textPath href="#svch-arc-top" startOffset="50%" textAnchor="middle">
                  SINCE 2008
                </textPath>
              </text>
              <text className="svch-stamp-ring">
                <textPath href="#svch-arc-bottom" startOffset="50%" textAnchor="middle">
                  NOIDA · UP16
                </textPath>
              </text>
              <text className="svch-stamp-word" x="60" y="67" textAnchor="middle" transform="rotate(-12 60 60)">
                Delivered
              </text>
            </svg>
          </article>
        </div>
      </div>
    </section>
  );
}
