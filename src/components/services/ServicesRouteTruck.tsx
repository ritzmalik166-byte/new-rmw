"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

type Props = {
  className?: string;
  /** Rail element in the same parent; the truck keeps its centre on the rail's centre line. */
  rail?: string;
  /** Element in the same parent the truck starts hidden behind; without it the truck drives in from the top. */
  parkedBehind?: string;
  /** Park the truck, visible, at the very top of the rail instead of driving in from above it. */
  fromRailStart?: boolean;
  /** Element in the same parent the truck pulls up just above; without it the truck runs to the bottom. */
  stopBefore?: string;
  start?: string;
  end?: string;
};

/* A small truck that drives down the dashed route rail, scrubbed to scroll.
   Must sit inside the positioned element that holds the rail. */
export function ServicesRouteTruck({
  className,
  rail,
  parkedBehind,
  fromRailStart = false,
  stopBefore,
  start = "top 70%",
  end = "bottom 60%",
}: Props) {
  const truckRef = useRef<HTMLSpanElement>(null);
  const { ready, reduced } = useMotion();

  useEffect(() => {
    const truck = truckRef.current;
    const track = truck?.parentElement;
    const line = rail && track ? track.querySelector<HTMLElement>(rail) : null;
    if (!truck || !track || !line) return;

    // The CSS margin-left already pulls the truck back by half its width.
    const align = () => {
      if (line.offsetParent !== truck.offsetParent) return;
      truck.style.left = `${line.offsetLeft + line.offsetWidth / 2}px`;
    };

    align();
    const observer = new ResizeObserver(align);
    observer.observe(track);
    observer.observe(line);
    window.addEventListener("resize", align);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", align);
      truck.style.removeProperty("left");
    };
  }, [rail]);

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
        if (fromRailStart) return 0;
        const anchor = parkedBehind ? track.querySelector<HTMLElement>(parkedBehind) : null;
        return anchor
          ? anchor.offsetTop + (anchor.offsetHeight - truck.offsetHeight) / 2
          : -truck.offsetHeight;
      };
      const endY = () => {
        const stop = stopBefore ? track.querySelector<HTMLElement>(stopBefore) : null;
        return (stop ? stop.offsetTop : track.offsetHeight) - truck.offsetHeight;
      };

      const tl = gsap.timeline({
        scrollTrigger: { trigger: track, start, end, scrub: true, invalidateOnRefresh: true },
      });

      tl.fromTo(truck, { y: startY }, { y: endY, ease: "none", duration: 1 }, 0);
      if (parkedBehind || fromRailStart) {
        gsap.set(truck, { autoAlpha: 1 });
      } else {
        tl.fromTo(truck, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.06 }, 0);
      }
    },
    { dependencies: [ready, reduced, parkedBehind, fromRailStart, stopBefore, start, end] },
  );

  return (
    <span ref={truckRef} className={cn("svc-route-truck", className)} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/trucks/rmw-truck-top-sm.webp" alt="Ritz Media World truck seen from above" width={111} height={360} />
    </span>
  );
}
