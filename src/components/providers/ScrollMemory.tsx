"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

const STORE_KEY = "rmw-scroll";
/* Pinned sections and lazy media keep growing the page for a moment after it renders. */
const SETTLE_MS = 1500;
const USER_INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

function load(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/* Back / forward returns to where the reader left the page. The browser's own restore
   runs before the page has re-rendered at full height, so it lands short or at the top. */
export function ScrollMemory() {
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const positionsRef = useRef<Record<string, number>>({});
  const shownRef = useRef<string | null>(null);
  const poppedRef = useRef(false);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const positions = load();
    positionsRef.current = positions;
    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    poppedRef.current = entry?.type === "back_forward" || entry?.type === "reload";
    history.scrollRestoration = "manual";

    let frame = 0;
    const record = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Skip while the URL and the rendered page disagree, mid-navigation.
        if (location.pathname !== shownRef.current) return;
        positions[location.pathname] = window.scrollY;
      });
    };
    const persist = () => {
      try {
        sessionStorage.setItem(STORE_KEY, JSON.stringify(positions));
      } catch {}
    };
    const onPop = () => {
      poppedRef.current = true;
    };

    window.addEventListener("scroll", record, { passive: true });
    window.addEventListener("popstate", onPop);
    window.addEventListener("pagehide", persist);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", record);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pagehide", persist);
      history.scrollRestoration = "auto";
    };
  }, []);

  useEffect(() => {
    shownRef.current = pathname;
    if (!poppedRef.current) return;
    poppedRef.current = false;

    const y = positionsRef.current[pathname];
    if (!y) return;

    let done = false;
    const timers: number[] = [];
    const apply = () => {
      if (done) return;
      const smooth = lenisRef.current;
      if (smooth) smooth.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };
    const stop = () => {
      if (done) return;
      done = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      ScrollTrigger.removeEventListener("refresh", apply);
      USER_INPUT.forEach((type) => window.removeEventListener(type, stop));
    };

    apply();
    [100, 300, 700].forEach((delay) => timers.push(window.setTimeout(apply, delay)));
    timers.push(window.setTimeout(stop, SETTLE_MS));
    ScrollTrigger.addEventListener("refresh", apply);
    USER_INPUT.forEach((type) => window.addEventListener(type, stop, { passive: true }));
    return stop;
  }, [pathname]);

  return null;
}
