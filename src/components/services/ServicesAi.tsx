"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

const AI_SERVICES = [
  {
    number: "01",
    title: "AI Creatives",
    copy:
      "Campaign visuals, social media posts, and ad creatives produced with AI tools and refined by our designers, so you get more variations in less time while staying on brand.",
  },
  {
    number: "02",
    title: "AI Brand Reels & Videos",
    copy:
      "Short brand reels, promotional videos, and social content created with AI-powered video tools, built for Instagram, YouTube Shorts, and WhatsApp, and finished by our editors.",
  },
  {
    number: "03",
    title: "End-to-End AI Implementation",
    copy:
      "We help your business adopt AI the right way, from identifying where it adds value and choosing the right tools to setting them up and integrating them with your existing systems.",
  },
  {
    number: "04",
    title: "Workflow Automations",
    copy:
      "We automate repetitive tasks such as content publishing, reporting, lead handling, and data entry, so your team spends less time on manual work and more time on what matters.",
  },
] as const;

export function ServicesAi() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready || reduced) return;

    const cards = root.querySelectorAll(".svc-ai-card");
    const heading = root.querySelectorAll(".svc-ai-kicker, .svc-ai-title, .svc-ai-lede");
    const techImage = root.querySelector<HTMLElement>(".svc-ai-tech-image");
    const techScan = root.querySelector<HTMLElement>(".svc-ai-tech-scan");
    gsap.fromTo(
      [...heading, ...cards, root.querySelector(".svc-ai-view")],
      { y: 22, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      },
    );

    if (techImage && techScan) {
      gsap.to(techImage, {
        scale: 1.06,
        xPercent: 1.5,
        yPercent: -1.5,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(techScan, {
        yPercent: 5200,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        repeatDelay: 2,
      });
    }
  }, [ready, reduced]);

  return (
    <section ref={rootRef} className="svc-ai" aria-labelledby="svc-ai-title">
      <div className="svc-ai-inner">
        <header className="svc-ai-head">
          <div className="svc-ai-head-copy">
            <p className="svc-ai-kicker">KM 10 · Work smarter</p>
            <h2 id="svc-ai-title" className="svc-ai-title">
              AI <em>Services</em>
            </h2>
            <div className="svc-explore-row">
              <Link className="svc-explore" href="/services/ai-services">
                Explore AI Services <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <p className="svc-ai-lede">
            From AI-powered creatives and brand videos to complete AI implementation and workflow
            automation, we help businesses create more, work faster, and spend less time on
            repetitive tasks, with a human team guiding every step.
          </p>
        </header>

        <div className="svc-ai-body">
          <div className="svc-ai-view">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="svc-ai-tech-image" src="/about/mile/ai.jpg" alt="AI network visualization over a city skyline" />
            <span className="svc-ai-tech-tint" aria-hidden />
            <span className="svc-ai-tech-scan" />
            <span className="svc-ai-tech-label">AI / SIGNAL ONLINE</span>
          </div>

          <div className="svc-ai-grid">
            {AI_SERVICES.map((service) => (
              <article className="svc-ai-card" key={service.number}>
                <div className="svc-ai-card-top">
                  <span className="svc-ai-number">{service.number}</span>
                  <span className="svc-ai-card-label">KM 10</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <span className="svc-ai-arrow" aria-hidden>↗</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
