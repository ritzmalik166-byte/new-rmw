"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/components/providers/MotionProvider";

registerGsap();

function LenisScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    // Lenis flips `lenis-scrolling` / `lenis-smooth` on <html> at every scroll start
    // and stop, and any class change on <html> restyles the whole page (a visible
    // hitch on phones). Only keep the classes the stylesheet actually needs.
    const root = document.documentElement;
    let applied = Array.from(root.classList)
      .filter((name) => name === "lenis" || name.startsWith("lenis-"))
      .join(" ");
    const patched = lenis as unknown as { updateClassName: () => void };
    patched.updateClassName = () => {
      const next = [
        "lenis",
        lenis.options.autoToggle && "lenis-autoToggle",
        lenis.isStopped && "lenis-stopped",
        lenis.isLocked && "lenis-locked",
      ]
        .filter(Boolean)
        .join(" ");
      if (next === applied) return;
      applied.split(" ").forEach((name) => name && root.classList.remove(name));
      next.split(" ").forEach((name) => root.classList.add(name));
      applied = next;
    };
    patched.updateClassName();
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { reduced } = useMotion();

  if (reduced) return children;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.88,
        touchMultiplier: 1.05,
        syncTouch: false,
      }}
    >
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
