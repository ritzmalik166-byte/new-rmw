"use client";

import { Grain } from "@/components/layout/Grain";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { PageTransition } from "@/components/providers/PageTransition";
import { ScrollMemory } from "@/components/providers/ScrollMemory";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <SmoothScroll>
        <PageTransition>
          <Grain />
          <ScrollMemory />
          {children}
        </PageTransition>
      </SmoothScroll>
    </MotionProvider>
  );
}
