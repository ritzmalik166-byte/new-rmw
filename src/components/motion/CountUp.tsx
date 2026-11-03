"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !ready) return;

      if (reduced) {
        element.textContent = `${prefix}${value}${suffix}`;
        return;
      }

      const counter = { value: 0 };
      let started = false;
      const animate = () => {
        if (started) return;
        started = true;
        gsap.to(counter, {
          value,
          duration: 2.6,
          ease: "power2.out",
          onUpdate: () => {
            element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
          },
        });
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          animate();
          observer.disconnect();
        },
        { rootMargin: "0px 0px -15% 0px", threshold: 0 },
      );
      observer.observe(element);

      return () => observer.disconnect();
    },
    { dependencies: [ready, reduced, value, prefix, suffix] },
  );

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {prefix}0{suffix}
    </span>
  );
}
