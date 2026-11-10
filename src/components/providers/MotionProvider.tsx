"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MotionContextValue = {
  ready: boolean;
  reduced: boolean;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  const value = useMemo(() => ({ ready: true, reduced }), [reduced]);

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

/* One shared "page has painted and the main thread is free" signal. */
let idleReached = false;
let idlePromise: Promise<void> | null = null;
function whenIdle() {
  idlePromise ??= new Promise<void>((resolve) => {
    const done = () => { idleReached = true; resolve(); };
    const schedule = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(done, { timeout: 1500 });
      else setTimeout(done, 200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  });
  return idlePromise;
}

/**
 * Like useMotion, but `ready` only turns true once the page has loaded and the browser is idle.
 * For below-the-fold sections: their ScrollTrigger setup (which measures layout) then runs in one
 * batch after first paint instead of during hydration, avoiding forced reflows and long tasks.
 * Not for anything visible on first paint.
 */
export function useDeferredMotion() {
  const motion = useMotion();
  const [idle, setIdle] = useState(idleReached);
  useEffect(() => {
    if (idle) return;
    let alive = true;
    whenIdle().then(() => alive && setIdle(true));
    return () => { alive = false; };
  }, [idle]);
  return { ready: motion.ready && idle, reduced: motion.reduced };
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used within MotionProvider");
  }
  return context;
}
