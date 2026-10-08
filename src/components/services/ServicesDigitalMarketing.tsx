"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { ServicesSearchGlimpse } from "./ServicesSearchGlimpse";

registerGsap();

type IconName = "search" | "share" | "shield" | "pointer" | "magnet" | "megaphone";

const SERVICES: { id: string; title: string; copy: string; icon: IconName }[] = [
  {
    id: "seo",
    title: "Search Engine Optimization (SEO)",
    copy: "Rank for the searches your buyers type, and get cited in AI answers.",
    icon: "search",
  },
  {
    id: "smm",
    title: "Social Media Marketing (SMM)",
    copy: "Feeds, reels and community management that build a following.",
    icon: "share",
  },
  {
    id: "orm",
    title: "Online Reputation Management (ORM)",
    copy: "Reviews, mentions and search results that tell your side of the story.",
    icon: "shield",
  },
  {
    id: "ppc",
    title: "Pay Per Click (PPC) Advertising",
    copy: "Google and Meta campaigns tuned daily for cost per lead.",
    icon: "pointer",
  },
  {
    id: "leads",
    title: "Lead Generation",
    copy: "Landing pages, forms and follow-ups that turn clicks into site visits.",
    icon: "magnet",
  },
  {
    id: "awareness",
    title: "Brand Awareness",
    copy: "Reach and frequency planning that makes your name familiar first.",
    icon: "megaphone",
  },
];

const TITLE = ["Digital Marketing", "Services"] as const;
const MAX_TILT = 7;

export function ServicesDigitalMarketing() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const q = <T extends Element>(selector: string) => gsap.utils.toArray<T>(selector, root);
      const lines = q<HTMLElement>(".svc-dm-line > span");
      const fades = q<HTMLElement>(".svc-dm-kicker, .svc-dm-lede, .svc-dm-cta, .svc-dm-search");
      const cards = q<HTMLElement>(".svc-dm-card");
      const stripes = q<HTMLElement>(".svc-dm-stripe");
      const strokes = q<SVGElement>(".svc-dm-icon [pathLength]");

      gsap.set(lines, { yPercent: 110 });
      gsap.set(fades, { y: 18, autoAlpha: 0 });
      gsap.set(cards, { y: 60, rotationX: -32, autoAlpha: 0, transformOrigin: "50% 0%" });
      gsap.set(stripes, { scaleX: 0 });
      gsap.set(strokes, { strokeDashoffset: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 68%", once: true },
      });

      tl.to(lines, { yPercent: 0, duration: 0.9, stagger: 0.1 })
        .to(fades, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, "-=0.55")
        .to(
          cards,
          {
            y: 0,
            rotationX: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: { grid: [2, 3], from: "start", amount: 0.45 },
            onComplete: () => gsap.set(cards, { transformOrigin: "50% 50%" }),
          },
          "-=0.7",
        )
        .to(
          stripes,
          { scaleX: 1, duration: 0.7, ease: "power2.inOut", stagger: { grid: [2, 3], amount: 0.45 } },
          "-=0.75",
        )
        .to(strokes, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.03 }, "-=0.6");
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  const onGridMove = (event: PointerEvent<HTMLUListElement>) => {
    const hovered = (event.target as HTMLElement).closest<HTMLElement>(".svc-dm-card");
    event.currentTarget.querySelectorAll<HTMLElement>(".svc-dm-card").forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);

      if (reduced || event.pointerType !== "mouse") return;
      const isHovered = card === hovered;
      gsap.to(card, {
        rotationY: isHovered ? (x / rect.width - 0.5) * 2 * MAX_TILT : 0,
        rotationX: isHovered ? (0.5 - y / rect.height) * 2 * MAX_TILT : 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  };

  const onGridLeave = (event: PointerEvent<HTMLUListElement>) => {
    const cards = event.currentTarget.querySelectorAll<HTMLElement>(".svc-dm-card");
    gsap.to(cards, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
  };

  const onCtaMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const cta = event.currentTarget;
    const rect = cta.getBoundingClientRect();
    gsap.to(cta, {
      x: (event.clientX - rect.left - rect.width / 2) * 0.25,
      y: (event.clientY - rect.top - rect.height / 2) * 0.35,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const onCtaLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <section ref={rootRef} className="svc-dm" aria-labelledby="svc-dm-title">
      <div className="svc-dm-edge" aria-hidden />
      <div className="svc-dm-ambient" aria-hidden>
        <span />
        <span />
      </div>

      <div className="svc-dm-inner">
        <div className="svc-dm-copy">
          <p className="svc-dm-kicker">KM 05</p>
          <h2 id="svc-dm-title" className="svc-dm-title">
            {TITLE.map((line) => (
              <span key={line} className="svc-dm-line">
                <span>{line}</span>
              </span>
            ))}
          </h2>
          <p className="svc-dm-lede">
            Six levers, one dashboard. We run SEO, social and paid media together, so every rupee is
            tracked from the first click to the site visit.
          </p>
          <Link
            className="svc-dm-cta"
            href="/#start-a-project"
            onPointerMove={onCtaMove}
            onPointerLeave={onCtaLeave}
          >
            Get a Free SEO Audit <span aria-hidden>→</span>
          </Link>
          <ServicesSearchGlimpse />
        </div>

        <ul className="svc-dm-grid" onPointerMove={onGridMove} onPointerLeave={onGridLeave}>
          {SERVICES.map((service) => (
            <li key={service.id} className="svc-dm-card">
              <Link href={`/services/${service.id}`} className="svc-dm-card-link" style={{ display: "block", textDecoration: "none", color: "inherit", height: "100%" }}>
                <span className="svc-dm-stripe" aria-hidden />
                <ServiceIcon name={service.icon} />
                <h3 className="svc-dm-card-title">{service.title}</h3>
                <p className="svc-dm-card-copy">{service.copy}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const ICONS: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" pathLength={1} />
      <path d="M20.5 20.5 16 16" pathLength={1} />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" pathLength={1} />
      <circle cx="6" cy="12" r="3" pathLength={1} />
      <circle cx="18" cy="19" r="3" pathLength={1} />
      <path d="m8.6 13.5 6.8 4" pathLength={1} />
      <path d="m15.4 6.5-6.8 4" pathLength={1} />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" pathLength={1} />
      <path d="m9 12 2 2 4-4" pathLength={1} />
    </>
  ),
  pointer: (
    <>
      <path d="m4 4 7 17 2.5-7.5L21 11 4 4z" pathLength={1} />
      <path d="m13.5 13.5 6 6" pathLength={1} />
    </>
  ),
  magnet: (
    <>
      <path
        d="m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15"
        pathLength={1}
      />
      <path d="m5 8 4 4" pathLength={1} />
      <path d="m12 15 4 4" pathLength={1} />
    </>
  ),
  megaphone: (
    <>
      <path d="m3 11 18-5v12L3 14v-3z" pathLength={1} />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" pathLength={1} />
    </>
  ),
};

function ServiceIcon({ name }: { name: IconName }) {
  return (
    <svg className={`svc-dm-icon svc-dm-icon--${name}`} viewBox="0 0 24 24" aria-hidden>
      {ICONS[name]}
    </svg>
  );
}
