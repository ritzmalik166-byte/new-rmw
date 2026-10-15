"use client";

import { createContext, useContext, useMemo } from "react";
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

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used within MotionProvider");
  }
  return context;
}
