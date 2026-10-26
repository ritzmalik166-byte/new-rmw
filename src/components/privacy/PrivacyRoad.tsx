"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { RealTruck, setWheelTurn } from "@/components/ui/RealTruck";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

/* The truck parks at the right edge of the hero and drives off to the left between
   the road coming into view and the hero leaving it. */
export function PrivacyRoad() {
  const roadRef = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const road = roadRef.current;
      const truck = road?.querySelector<HTMLElement>(".pv-road-truck");
      const hero = road?.closest<HTMLElement>(".pv-hero");
      if (!road || !truck || !hero || !ready || reduced) return;

      const state = { p: 0 };
      const drive = gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "clamp(bottom bottom)",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const distance = (truck.offsetLeft + truck.offsetWidth) * state.p;
          gsap.set(truck, { x: -distance });
          setWheelTurn(truck, distance);
        },
      });

      return () => {
        drive.scrollTrigger?.kill();
        drive.kill();
      };
    },
    { dependencies: [ready, reduced], scope: roadRef },
  );

  return (
    <div ref={roadRef} className="pv-road" aria-hidden>
      <span className="pv-road-lane" />
      <span className="pv-road-truck">
        <RealTruck small />
      </span>
    </div>
  );
}
