"use client";

import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

import { ServicesMegaMenu } from "@/components/layout/ServicesMegaMenu";
import { SERVICE_ICONS } from "@/lib/service-icons";
import { SERVICES_LIST } from "@/lib/services-data";

registerGsap();
gsap.registerPlugin(useGSAP);

const HEADER_STICK_AFTER = 160;
const HEADER_IDLE_MS = 700;

export function Header() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setServicesOpen(true);
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 240);
  };

  useEffect(() => {
    if (!menuOpen) return;

    const html = document.documentElement;
    const toggle = toggleRef.current;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    lenis?.stop();

    return () => {
      html.style.overflow = previous;
      lenis?.start();
      toggle?.focus({ preventScroll: true });
    };
  }, [menuOpen, lenis]);

  // Close menus on route change and when the viewport grows
  // back into the desktop nav breakpoint.
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const servicesOpenRef = useRef(servicesOpen);
  useEffect(() => {
    servicesOpenRef.current = servicesOpen;
    const root = rootRef.current;
    if (servicesOpen && root?.classList.contains("is-hidden")) {
      root.classList.remove("is-hidden");
      gsap.to(root, { yPercent: 0, duration: 0.3, ease: "power3.out", overwrite: "auto" });
    }
  }, [servicesOpen]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const instant = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // GSAP owns the header transform (it inlines `translate: none`), so slide it with yPercent.
    const setHidden = (hidden: boolean) => {
      if (root.classList.contains("is-hidden") === hidden) return;
      root.classList.toggle("is-hidden", hidden);
      gsap.to(root, {
        yPercent: hidden ? -110 : 0,
        duration: instant() ? 0 : hidden ? 0.4 : 0.45,
        ease: hidden ? "power2.in" : "power3.out",
        overwrite: "auto",
      });
    };

    const setStuck = (stuck: boolean) => {
      if (root.classList.contains("is-stuck") === stuck) return;
      root.classList.toggle("is-stuck", stuck);
      root.classList.remove("is-hidden");
      if (stuck && !instant()) {
        gsap.fromTo(root, { yPercent: -100 }, { yPercent: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
      } else {
        gsap.set(root, { yPercent: 0 });
      }
    };

    let idleTimer: number | undefined;
    const hideWhenIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (servicesOpenRef.current || root.matches(":hover, :focus-within")) {
          hideWhenIdle();
          return;
        }
        setHidden(true);
      }, HEADER_IDLE_MS);
    };

    const onScroll = () => {
      if (window.scrollY < HEADER_STICK_AFTER) {
        window.clearTimeout(idleTimer);
        setStuck(false);
        return;
      }
      setStuck(true);
      setHidden(false);
      hideWhenIdle();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (media.matches) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    media.addEventListener("change", onChange);
    window.addEventListener("keydown", onKey);
    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      if (reduced) {
        gsap.set(root, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(root, { autoAlpha: 0, y: -10 });
    },
    { dependencies: [reduced] },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.to(root, {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        ease: "power2.out",
      });
    },
    { dependencies: [ready, reduced] },
  );

  return (
    <header ref={rootRef} className="site-header absolute top-0 right-0 left-0 z-50">
      <div className="site-header-bar flex items-center justify-between gap-4 px-5 py-5 md:px-10 md:py-6">
        <TransitionLink href="/" className="flex items-center gap-2" aria-label={site.fullName}>
          <BrandMark />
        </TransitionLink>

        <nav className="site-nav">
          {site.nav.map((item) => {
            if (item.href === "/services") {
              const isServicesActive = pathname.startsWith("/services") || servicesOpen;
              return (
                <div
                  key={item.href}
                  className="services-nav-trigger-wrap relative"
                  onMouseEnter={handleServicesEnter}
                  onMouseLeave={handleServicesLeave}
                >
                  <button
                    type="button"
                    onClick={() => setServicesOpen((prev) => !prev)}
                    className={cn(
                      "site-nav-link group flex items-center gap-1.5 cursor-pointer",
                      isServicesActive && "is-active",
                    )}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    aria-label="Toggle Services menu"
                  >
                    <span>{item.label}</span>
                    <svg 
                      width="12" height="12" viewBox="0 0 24 24" 
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                      className={cn(
                        "transition-all duration-500 ease-out", 
                        servicesOpen ? "-rotate-180 text-amber-500" : "text-zinc-400 group-hover:text-amber-500 group-hover:translate-y-0.5"
                      )}
                      aria-hidden
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
              );
            }

            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                className={cn(
                  "site-nav-link",
                  pathname === item.href && "is-active",
                )}
              >
                {item.label}
              </TransitionLink>
            );
          })}
        </nav>

        <div className="site-header-actions">
          <TransitionLink href="/contact" className="btn btn-ink">
            Contact Us
          </TransitionLink>

          <button
            ref={toggleRef}
            type="button"
            className={cn("site-nav-toggle", menuOpen && "is-open")}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-nav-mobile"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mounted
        ? createPortal(
            <>
              <ServicesMegaMenu
                isOpen={servicesOpen}
                onClose={() => setServicesOpen(false)}
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              />
              <MobileMenu
                open={menuOpen}
                pathname={pathname}
                onClose={() => setMenuOpen(false)}
              />
            </>,
            document.body,
          )
        : null}
    </header>
  );
}

function MobileMenu({
  open,
  pathname,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    if (open) closeRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <div
      id="site-nav-mobile"
      className={cn("mnav", open && "is-open")}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      data-lenis-prevent
    >
      <div className="mnav-glow" aria-hidden />

      <div className="mnav-top">
        <TransitionLink href="/" aria-label={site.fullName} onClick={onClose}>
          <BrandMark />
        </TransitionLink>
        <button
          ref={closeRef}
          type="button"
          className="mnav-close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <span />
          <span />
        </button>
      </div>

      <nav className="mnav-links" aria-label="Mobile">
        {site.nav.map((item, index) => {
          if (item.href === "/services") {
            return (
              <div key={item.href} className="mnav-item-group">
                <div className="flex items-center justify-between">
                  <TransitionLink
                    href={item.href}
                    className={cn(
                      "mnav-link flex-1",
                      pathname.startsWith("/services") && "is-active",
                    )}
                    style={{ "--i": index } as React.CSSProperties}
                    onClick={onClose}
                  >
                    <span className="mnav-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="mnav-label">{item.label}</span>
                  </TransitionLink>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen((prev) => !prev)}
                    className="p-3 text-white/70 hover:text-amber-400 transition-colors"
                    aria-label="Toggle sub services"
                  >
                    <span
                      className={cn(
                        "inline-block text-xs transition-transform duration-200",
                        mobileServicesOpen ? "rotate-180 text-amber-400" : "",
                      )}
                    >
                      ▼
                    </span>
                  </button>
                </div>

                {mobileServicesOpen && (
                  <div className="pl-8 pr-2 py-2 flex flex-col gap-1.5 bg-white/[0.04] rounded-lg my-1">
                    {SERVICES_LIST.map((svc) => (
                      <Link
                        key={svc.slug}
                        href={`/services/${svc.slug}`}
                        onClick={onClose}
                        className={cn(
                          "text-sm py-1.5 px-2 rounded text-white/75 hover:text-amber-400 transition-colors flex items-center justify-between gap-3",
                          pathname === `/services/${svc.slug}` && "text-amber-400 font-semibold bg-white/5",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {SERVICE_ICONS[svc.slug] ? (
                            <Image
                              src={SERVICE_ICONS[svc.slug]!}
                              alt=""
                              width={32}
                              height={32}
                              className="h-8 w-8 shrink-0 object-contain"
                            />
                          ) : (
                            <span className="h-8 w-8 shrink-0" aria-hidden />
                          )}
                          {svc.name}
                        </span>
                        <span className="text-xs text-white/30">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <TransitionLink
              key={item.href}
              href={item.href}
              className={cn("mnav-link", pathname === item.href && "is-active")}
              style={{ "--i": index } as React.CSSProperties}
              onClick={onClose}
            >
              <span className="mnav-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="mnav-label">{item.label}</span>
              <span className="mnav-arrow" aria-hidden>
                →
              </span>
            </TransitionLink>
          );
        })}
      </nav>

      <div className="mnav-foot">
        <Link href="/#start-a-project" className="mnav-cta" onClick={onClose}>
          Start a project
          <span aria-hidden>→</span>
        </Link>
        <div className="mnav-contact">
          <a href={`mailto:${site.footer.email}`}>{site.footer.email}</a>
          {site.footer.phones.map((phone) => (
            <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
              {phone}
            </a>
          ))}
        </div>
        <p className="mnav-tagline">{site.tagline}</p>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark">
      <Image
        src="/logo.png"
        alt=""
        width={61}
        height={77}
        className="brand-mark-logo"
        priority
      />
    </span>
  );
}
