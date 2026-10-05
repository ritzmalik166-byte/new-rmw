"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

type Props = {
  className?: string;
  /** Element in the same parent the truck starts hidden behind; without it the truck drives in from the top. */
  parkedBehind?: string;
  start?: string;
  end?: string;
};

/* A small truck that drives down the dashed route rail, scrubbed to scroll.
   Must sit inside the positioned element that holds the rail. */
export function ServicesRouteTruck({
  className,
  parkedBehind,
  start = "top 70%",
  end = "bottom 60%",
}: Props) {
  const truckRef = useRef<HTMLSpanElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const truck = truckRef.current;
      const track = truck?.parentElement;
      if (!truck || !track || !ready) return;

      if (reduced) {
        gsap.set(truck, { autoAlpha: 0 });
        return;
      }

      const startY = () => {
        const anchor = parkedBehind ? track.querySelector<HTMLElement>(parkedBehind) : null;
        return anchor
          ? anchor.offsetTop + (anchor.offsetHeight - truck.offsetHeight) / 2
          : -truck.offsetHeight;
      };
      const endY = () => track.offsetHeight - truck.offsetHeight;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: track, start, end, scrub: true, invalidateOnRefresh: true },
      });

      tl.fromTo(truck, { y: startY }, { y: endY, ease: "none", duration: 1 }, 0);
      if (parkedBehind) {
        gsap.set(truck, { autoAlpha: 1 });
      } else {
        tl.fromTo(truck, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.06 }, 0);
      }
    },
    { dependencies: [ready, reduced, parkedBehind, start, end] },
  );

  return (
    <span ref={truckRef} className={cn("svc-route-truck", className)} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/footer/truck.png" alt="" width={116} height={74} />
    </span>
  );
}
