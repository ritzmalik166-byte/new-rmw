"use client";

import { useEffect, useState } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/cn";
import {
  CONSENT_OPEN_EVENT,
  type CookieConsent as Choice,
  readCookieConsent,
  saveCookieConsent,
} from "@/lib/consent";

const SHOW_AFTER_MS = 1200;

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = readCookieConsent()
      ? 0
      : window.setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  const choose = (choice: Choice) => {
    saveCookieConsent(choice);
    setOpen(false);
  };

  return (
    <section
      className={cn("cc theme-keep", open && "is-open")}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cc-title"
      aria-describedby="cc-copy"
      inert={!open}
    >
      <span className="cc-rule" aria-hidden />
      <div className="cc-inner">
        <span className="cc-sign" aria-hidden>
          <span className="cc-sign-shield">Toll</span>
          <svg className="cc-sign-cookie" viewBox="0 0 48 48">
            <path d="M24 4a20 20 0 1 0 20 20 7 7 0 0 1-8-7 7 7 0 0 1-7-8 5 5 0 0 1-5-5Z" />
            <circle cx="16" cy="20" r="3" />
            <circle cx="27" cy="31" r="3" />
            <circle cx="15" cy="32" r="2" />
            <circle cx="34" cy="24" r="1.6" />
          </svg>
        </span>

        <div className="cc-text">
          <p className="cc-kicker">
            <span className="cc-pill">Checkpoint</span>
            <span className="cc-hindi" lang="hi">
              ज़रा रुकिए
            </span>
          </p>
          <h2 id="cc-title" className="cc-title">
            Cookies &amp; privacy, before you drive on
          </h2>
          <p id="cc-copy" className="cc-copy">
            We use essential cookies and local storage to keep this site running and remember your
            preferences. With your permission, embedded services like Google Maps and YouTube may set
            their own cookies. By choosing &ldquo;Accept all&rdquo; you agree to our{" "}
            <TransitionLink href="/privacy-policy" className="cc-link">
              Privacy Policy
            </TransitionLink>
            .
          </p>
        </div>

        <div className="cc-actions">
          <button type="button" className="cc-btn is-accept" onClick={() => choose("all")}>
            Accept all
            <span aria-hidden>→</span>
          </button>
          <button type="button" className="cc-btn is-essential" onClick={() => choose("essential")}>
            Essentials only
          </button>
        </div>
      </div>
    </section>
  );
}
