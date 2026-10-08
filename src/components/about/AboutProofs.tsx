"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const SLIDES = [
  { src: "/final-screenshot.png", alt: "Google Search Console Performance" },
  { src: "/proof-meta-insights.png", alt: "Meta Business Suite Insights" },
  { src: "/proof-google-ads-new.png", alt: "Google Ads Performance" },
];

const TRUCK_STEP = 42;

export function AboutProofs() {
  const laptopTrackRef = useRef<HTMLDivElement>(null);

  const truckRef = useRef<HTMLImageElement>(null);
  const truckX = useRef(0);
  const activeRef = useRef(0);
  const busyRef = useRef(false);
  const [active, setActive] = useState(0);

  const nudgeTruck = (dir: 1 | -1) => {
    const truck = truckRef.current;
    if (!truck) return;
    const section = truck.parentElement;
    const limit = section
      ? Math.max(TRUCK_STEP, section.clientWidth - truck.offsetWidth - 180)
      : 280;
    const nextX = Math.min(limit, Math.max(0, truckX.current + dir * TRUCK_STEP));
    truckX.current = nextX;
    gsap.to(truck, {
      x: nextX,
      duration: 0.7,
      ease: "power2.out",
    });
  };

  const turn = (dir: 1 | -1) => {
    nudgeTruck(dir);
    const total = SLIDES.length;
    const from = activeRef.current;
    const to = (from + dir + total) % total;
    if (busyRef.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(laptopTrackRef.current, {
        xPercent: to * -(100 / total)
      });
      activeRef.current = to;
      setActive(to);
      return;
    }

    busyRef.current = true;

    gsap.to(laptopTrackRef.current, {
      xPercent: to * -(100 / total),
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        activeRef.current = to;
        setActive(to);
        busyRef.current = false;
      },
    });
  };

  return (
    <section className="about-proofs" aria-label="Our Success Proofs">
      <h2 className="about-proofs-title">REAL PROOFS</h2>
      
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/about/wave-left.png"
        className="about-proofs-wave is-left"
        alt=""
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/about/wave-right.png"
        className="about-proofs-wave is-right"
        alt=""
      />

      <div className="about-proofs-mockup-stage">
        <div className="devices-group is-single">
          
          <button
            type="button"
            className="about-proofs-arrow is-prev"
            aria-label="Previous proof"
            onClick={() => turn(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M14.5 5.5 L8 12 l6.5 6.5" />
            </svg>
          </button>

          <div className="macbook-mockup">
            <div className="macbook-screen">
              <div 
                className="mockup-track" 
                ref={laptopTrackRef}
                style={{ width: `${SLIDES.length * 100}%` }}
              >
                {SLIDES.map((slide, index) => (
                  <div className="mockup-slide" key={index}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.src} alt={slide.alt} />
                  </div>
                ))}
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/device-laptop-png.png" className="device-overlay" alt="" />
          </div>

          <button
            type="button"
            className="about-proofs-arrow is-next"
            aria-label="Next proof"
            onClick={() => turn(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M9.5 5.5 L16 12 l-6.5 6.5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="about-proofs-road" aria-hidden>
        <span className="about-proofs-lane" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={truckRef}
        className="about-proofs-truck"
        src="/about/proof-truck.png"
        alt=""
      />
      <div className="about-proofs-mark" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/s2/distance.png" alt="" width={256} height={256} />
        <span className="about-proofs-mark-label">
          Ritz
          <br />
          Media
          <br />
          World
        </span>
      </div>
    </section>
  );
}
