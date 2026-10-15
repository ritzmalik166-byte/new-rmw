"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { useMotion } from "@/components/providers/MotionProvider";
import { ServicesRouteTruck } from "@/components/services/ServicesRouteTruck";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";
import type { SubService } from "@/lib/sub-services-data";

registerGsap();

const pad = (value: number) => String(value).padStart(2, "0");

/* The image drifts ±PARALLAX_SHIFT% on scroll, so it rests scaled up enough
   that its edges never come inside the frame. */
const PARALLAX_SHIFT = 6;
const PARALLAX_SCALE = 1.15;

export function SubServiceRoute({ sub }: { sub: SubService }) {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  useHomeReveal(rootRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.utils.toArray<HTMLElement>(".ssd-stop", root).forEach((stop) => {
        const fromLeft = stop.dataset.side === "left";
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: stop, start: "top 78%", once: true },
        });
        tl.fromTo(
          stop.querySelector(".ssd-stop-media"),
          { clipPath: fromLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
          { clipPath: "inset(0 0% 0 0%)", duration: 1.1 },
          0,
        )
          .fromTo(stop.querySelector(".ssd-stop-media img"), { scale: 1.35 }, { scale: PARALLAX_SCALE, duration: 1.4 }, 0)
          .fromTo(
            stop.querySelector(".ssd-stop-pin"),
            { scale: 0, rotate: -90 },
            { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2.2)" },
            0.15,
          )
          .fromTo(
            stop.querySelectorAll(".ssd-stop-copy > *"),
            { y: 28, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" },
            0.25,
          );

        gsap.fromTo(
          stop.querySelector(".ssd-stop-media img"),
          { yPercent: -PARALLAX_SHIFT },
          {
            yPercent: PARALLAX_SHIFT,
            ease: "none",
            scrollTrigger: { trigger: stop, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} id="route" className="hm ssd-route" aria-labelledby="ssd-route-title">
      <div className="hm-wrap">
        <header className="ssd-route-head">
          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">The route</span>
            <span>{pad(sub.sections.length)} checkpoints on board</span>
          </p>
          <HmTitle id="ssd-route-title" lines={[{ text: "Every checkpoint," }, { text: "mapped & delivered.", accent: true }]} />
          <p data-hm-fade className="hm-lede">
            How we run {sub.name} for your brand, from the first mile to the last.
          </p>
        </header>

        <div className="ssd-road">
          <span className="ssd-road-line" aria-hidden />
          <ServicesRouteTruck
            className="ssd-road-truck"
            rail=".ssd-road-line"
            fromRailStart
            stopBefore=".ssd-road-end"
            start="top 65%"
            end="bottom 75%"
          />

          <ol className="ssd-stops">
            {sub.sections.map((section, index) => {
              const side = index % 2 === 0 ? "left" : "right";
              return (
                <li key={section.title} className={cn("ssd-stop", `is-${side}`)} data-side={side}>
                  <figure className="ssd-stop-media">
                    <Image
                      src={section.image}
                      alt={section.alt}
                      fill
                      sizes="(max-width: 860px) 90vw, (max-width: 1600px) 46vw, 720px"
                      unoptimized={section.image.endsWith(".gif")}
                    />
                    <span className="ssd-stop-tag">KM {pad(index + 1)}</span>
                  </figure>

                  <span className="ssd-stop-pin" aria-hidden>
                    {pad(index + 1)}
                  </span>

                  <div className="ssd-stop-copy">
                    <p className="ssd-stop-no">
                      Checkpoint {pad(index + 1)} / {pad(sub.sections.length)}
                    </p>
                    <h2 className="ssd-stop-title">{section.title}</h2>
                    <p className="ssd-stop-text">{section.copy}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="ssd-road-end" aria-hidden>
            <span>Destination</span>
            Results
          </p>
        </div>
      </div>
    </section>
  );
}
