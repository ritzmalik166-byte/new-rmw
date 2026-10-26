"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PhoneGlyph } from "@/components/layout/FooterContact";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

const PHONE = site.footer.phones[0];
const DIGITS = PHONE.replace(/\D/g, "");
const WA_TEXT = "Hi Ritz Media World, I'd like to discuss a project.";
export const WHATSAPP_HREF = `https://wa.me/${DIGITS}?text=${encodeURIComponent(WA_TEXT)}`;

/* Hidden until the page's first section (the hero) has scrolled past the header. */
function usePastHero() {
  const pathname = usePathname();
  const [past, setPast] = useState(false);

  useEffect(() => {
    const check = () => {
      const hero = document.querySelector("main section");
      const bottom = hero ? hero.getBoundingClientRect().bottom : window.innerHeight - window.scrollY;
      setPast(bottom < 80);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);

  return past;
}

/* Parking runs in two steps so the CSS can choreograph them: glide + split first,
   then widen into labelled pills. Leaving collapses the pills before gliding back. */
const EXPAND_AFTER_MS = 800;
const COLLAPSE_MS = 350;

/* From tablet up the buttons park in the footer's bottom bar once it is in view;
   only desktops have room to widen them into labelled pills. */
function useFooterDock() {
  const pathname = usePathname();
  const [parked, setParked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const tablet = window.matchMedia("(min-width: 768px)");
    const wide = window.matchMedia("(min-width: 1024px)");
    let docked = false;
    let timer = 0;

    const check = () => {
      const bar = document.querySelector(".site-footer-bottom");
      const next =
        !!bar && tablet.matches && bar.getBoundingClientRect().bottom - window.innerHeight < 24;
      if (next === docked) return;
      docked = next;
      window.clearTimeout(timer);
      if (next) {
        setParked(true);
        if (wide.matches) timer = window.setTimeout(() => setExpanded(true), EXPAND_AFTER_MS);
      } else {
        setExpanded(false);
        timer = window.setTimeout(() => setParked(false), COLLAPSE_MS);
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      setParked(false);
      setExpanded(false);
    };
  }, [pathname]);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    footer?.classList.toggle("is-fab-docked", parked);
    footer?.classList.toggle("is-fab-expanded", expanded);
    return () => footer?.classList.remove("is-fab-docked", "is-fab-expanded");
  }, [parked, expanded, pathname]);

  return { parked, expanded };
}

export function FloatingContact() {
  const visible = usePastHero();
  const { parked, expanded } = useFooterDock();

  return (
    <div
      className={cn(
        "fab theme-keep",
        visible && "is-visible",
        parked && "is-docked",
        expanded && "is-expanded",
      )}
      role="complementary"
      aria-label="Quick contact"
      inert={!visible}
    >
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="fab-btn is-wa"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="fab-icon">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </span>
        <span className="fab-label">WhatsApp</span>
        <span className="fab-text" aria-hidden>
          WhatsApp
        </span>
      </a>
      <a href={`tel:+${DIGITS}`} className="fab-btn is-call" aria-label={`Call us on ${PHONE}`}>
        <span className="fab-icon">
          <PhoneGlyph />
        </span>
        <span className="fab-label">Call us</span>
        <span className="fab-text" aria-hidden>
          Call us
        </span>
      </a>
    </div>
  );
}
