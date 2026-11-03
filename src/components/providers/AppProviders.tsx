"use client";

import dynamic from "next/dynamic";
import { Grain } from "@/components/layout/Grain";
import RubyProvider from "@/components/ruby-bot/RubyContext";
import { RubyLauncher } from "@/components/ruby-bot/RubyLauncher";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { PageTransition } from "@/components/providers/PageTransition";
import { ScrollMemory } from "@/components/providers/ScrollMemory";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

const RubyBot = dynamic(() => import("@/components/ruby-bot/RubyBot"), { ssr: false });

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <SmoothScroll>
        <PageTransition>
          <Grain />
          <ScrollMemory />
          <RubyProvider>
            {children}
            <RubyLauncher />
            <RubyBot />
          </RubyProvider>
        </PageTransition>
      </SmoothScroll>
    </MotionProvider>
  );
}
