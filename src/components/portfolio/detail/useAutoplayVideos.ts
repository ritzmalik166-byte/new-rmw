"use client";

import { useEffect, type RefObject } from "react";
import { useMotion } from "@/components/providers/MotionProvider";

/** Plays muted preview clips only while they are on screen. */
export function useAutoplayVideos(rootRef: RefObject<HTMLElement | null>) {
  const { reduced } = useMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const videos = root.querySelectorAll<HTMLVideoElement>("video[data-pfd-autoplay]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) void video.play().catch(() => undefined);
          else video.pause();
        });
      },
      { threshold: 0.35 },
    );
    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [rootRef, reduced]);
}
