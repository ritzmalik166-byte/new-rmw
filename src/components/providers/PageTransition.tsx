"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

type PageTransitionContextValue = {
  navigate: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null,
);

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { reduced } = useMotion();
  const lenis = useLenis();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<string | null>(null);
  const busyRef = useRef(false);

  const scrollToHash = useCallback(
    (hash: string) => {
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      if (lenis) {
        lenis.scrollTo(target, { duration: reduced ? 0 : 1.2, force: true });
      } else {
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
    },
    [lenis, reduced],
  );

  useEffect(() => {
    const overlay = overlayRef.current;
    if (overlay) {
      gsap.set(overlay, { yPercent: 100, pointerEvents: "none" });
    }
  }, []);

  const uncover = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      busyRef.current = false;
      pendingRef.current = null;
      return;
    }

    gsap.to(overlay, {
      yPercent: -100,
      duration: reduced ? 0 : 0.8,
      ease: "power4.inOut",
      onComplete: () => {
        gsap.set(overlay, { yPercent: 100, pointerEvents: "none" });
        busyRef.current = false;
        pendingRef.current = null;
      },
    });
  }, [reduced]);

  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    uncover();

    const hash = new URL(pending, window.location.origin).hash;
    if (!hash) return;

    const frame = window.requestAnimationFrame(() => {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
      scrollToHash(hash);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, uncover, scrollToHash]);

  const navigate = useCallback(
    (href: string) => {
      if (busyRef.current) return;

      const url = new URL(href, window.location.origin);
      const route = `${url.pathname}${url.search}`;
      if (route === pathname && url.hash) {
        window.history.pushState(null, "", href);
        scrollToHash(url.hash);
        return;
      }
      if (route === pathname && !url.hash) return;

      const destination = route;
      pendingRef.current = href;
      if (reduced) {
        router.push(destination);
        return;
      }

      const overlay = overlayRef.current;
      if (!overlay) {
        router.push(href);
        return;
      }

      busyRef.current = true;
      gsap.set(overlay, { yPercent: 100, pointerEvents: "auto" });
      gsap.to(overlay, {
        yPercent: 0,
        duration: 0.7,
        ease: "power4.inOut",
        onComplete: () => {
          router.push(destination);
        },
      });
    },
    [pathname, reduced, router, scrollToHash],
  );

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[200] bg-paper"
      />
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within PageTransition");
  }
  return context;
}
