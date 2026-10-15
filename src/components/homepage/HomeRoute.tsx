"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type CSSProperties } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { RealTruck, setWheelTurn } from "@/components/ui/RealTruck";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";
import { HmTitle, useHomeReveal } from "./shared";

registerGsap();

const TITLE = [{ text: "Insight » Idea »" }, { text: "Impact.", accent: true }] as const;

export function HomeRoute() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  const stops = site.route.stops;
  useHomeReveal(rootRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      const map = root?.querySelector<HTMLElement>(".hm-route-map");
      const road = root?.querySelector<HTMLElement>(".hm-road");
      const truck = root?.querySelector<HTMLElement>(".hm-road-truck");
      if (!root || !map || !road || !truck || !ready) return;

      const stones = gsap.utils.toArray<HTMLElement>(".hm-stone", root);
      const cards = gsap.utils.toArray<HTMLElement>(".hm-stop", root);

      const mark = (count: number) => {
        stones.forEach((el, index) => el.classList.toggle("is-reached", index < count));
        cards.forEach((el, index) => el.classList.toggle("is-reached", index < count));
      };

      const parkedX = () => road.clientWidth - truck.offsetWidth - Math.max(16, road.clientWidth * 0.03);

      if (reduced) {
        gsap.set(truck, { x: parkedX });
        mark(stones.length);
        return;
      }

      // A stop counts as reached once the truck's nose passes the stone's centre.
      const update = () => {
        const box = truck.getBoundingClientRect();
        const nose = box.right - box.width * 0.06;
        setWheelTurn(truck, Number(gsap.getProperty(truck, "x")));
        let reached = 0;
        stones.forEach((stone) => {
          const rect = stone.getBoundingClientRect();
          if (nose >= rect.left + rect.width / 2) reached += 1;
        });
        mark(reached);
      };

      gsap.fromTo(
        truck,
        { x: () => -truck.offsetWidth },
        {
          x: parkedX,
          ease: "none",
          onUpdate: update,
          scrollTrigger: {
            trigger: map,
            start: "top 82%",
            end: "bottom 60%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="hm hm-route" aria-labelledby="hm-route-title">
      <div className="hm-wrap">
        <header className="hm-route-head">
          <div>
            <p data-hm-fade className="hm-kicker is-light">
              <span className="hm-pill">How we think</span>
              <span>Route 02 · Every project, same road</span>
            </p>
            <HmTitle id="hm-route-title" lines={TITLE} />
          </div>
          <p data-hm-fade className="hm-lede">
            {site.route.lede}
          </p>
        </header>

        <div className="hm-route-map">
          <div className="hm-route-stones" aria-hidden>
            {stops.map((stop, index) => (
              <span
                key={stop.name}
                className="hm-stone"
                style={{ "--at": (index * 2 + 1) / (stops.length * 2) } as CSSProperties}
              >
                <span className="hm-stone-body">
                  <span className="hm-stone-km">{stop.km}</span>
                  <span className="hm-stone-name">{stop.name}</span>
                </span>
              </span>
            ))}
          </div>

          <div className="hm-road" aria-hidden>
            <span className="hm-road-lane" />
            <span className="hm-road-truck">
              <RealTruck flip small />
            </span>
          </div>

          <ol className="hm-route-stops">
            {stops.map((stop, index) => (
              <li key={stop.name} className="hm-stop">
                <p className="hm-stop-km">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {stop.km}
                </p>
                <h3 className="hm-stop-title">{stop.name}</h3>
                <p className="hm-stop-copy">{stop.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
