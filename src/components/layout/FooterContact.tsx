"use client";

import { useEffect, useState } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"] as const;
const KEY_LETTERS: Partial<Record<(typeof KEYS)[number], string>> = {
  "2": "ABC",
  "3": "DEF",
  "4": "GHI",
  "5": "JKL",
  "6": "MNO",
  "7": "PQRS",
  "8": "TUV",
  "9": "WXYZ",
  "0": "+",
};
const DIAL_TICK_MS = 75;
const TYPE_TICK_MS = 45;
const MAIL_SUBJECT = "Namaste! Let's build something.";

/* Opens on hover or keyboard focus, and counts ticks while open so the popovers can animate. */
function usePeek(total: number, tickMs: number) {
  const { reduced } = useMotion();
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!open || reduced) return;
    const id = window.setInterval(() => {
      setTick((value) => {
        if (value >= total) {
          window.clearInterval(id);
          return value;
        }
        return value + 1;
      });
    }, tickMs);
    return () => window.clearInterval(id);
  }, [open, reduced, total, tickMs]);

  const show = () => {
    if (open) return;
    setTick(0);
    setOpen(true);
    setOpened(true);
  };
  const hide = () => setOpen(false);
  const handlers = { onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide };

  return { open, opened, tick: reduced ? total : tick, handlers };
}

/* Reveals `count` non-space characters of `text`, keeping its spacing. */
function revealDigits(text: string, count: number) {
  let seen = 0;
  let out = "";
  for (const char of text) {
    if (char !== " ") {
      if (seen === count) break;
      seen += 1;
    }
    out += char;
  }
  return out.trimEnd();
}

export function DialNumber({ phone }: { phone: string }) {
  const digits = phone.replace(/\s/g, "");
  // Two ticks per digit: press, then release.
  const total = digits.length * 2 + 4;
  const { open, tick, handlers } = usePeek(total, DIAL_TICK_MS);
  const typedCount = Math.min(digits.length, Math.ceil(tick / 2));
  const pressing = tick % 2 === 1 && tick <= digits.length * 2;
  const current = digits[typedCount - 1];
  const pressedKey = pressing ? (current === "+" ? "0" : current) : null;
  const calling = typedCount >= digits.length && tick >= total;

  return (
    <span className={cn("fc-peek", open && "is-open")} {...handlers}>
      <a href={`tel:${digits}`} className="fc-value">
        {phone}
      </a>
      <span className="fc-pop is-phone" aria-hidden>
        <span className={cn("fc-phone", calling && "is-calling")}>
          <span className="fc-phone-screen">
            <span className="fc-phone-status">
              <span>9:41</span>
              <span className="fc-phone-island" />
              <span className="fc-phone-signal">
                <i />
                <i />
                <i />
                <i />
              </span>
            </span>
            <span className="fc-phone-caller">
              <span className="fc-phone-avatar">RMW</span>
              <span className="fc-phone-state">{calling ? "Calling…" : "Dialling"}</span>
              <span className="fc-phone-number">
                {revealDigits(phone, typedCount)}
                {!calling ? <i className="fc-caret" /> : null}
              </span>
              <span className="fc-phone-who">Ritz Media World · Noida</span>
            </span>
            <span className="fc-phone-keys">
              {KEYS.map((key) => (
                <span key={key} className={cn("fc-key", pressedKey === key && "is-pressed")}>
                  {key}
                  {KEY_LETTERS[key] ? <small>{KEY_LETTERS[key]}</small> : null}
                </span>
              ))}
            </span>
            <span className={cn("fc-phone-call", calling && "is-ringing")}>
              <PhoneGlyph />
            </span>
            <span className="fc-phone-home" />
          </span>
        </span>
      </span>
    </span>
  );
}

export function TypeEmail({ email }: { email: string }) {
  const total = email.length + MAIL_SUBJECT.length + 6;
  const { open, tick, handlers } = usePeek(total, TYPE_TICK_MS);
  const to = email.slice(0, tick);
  const subject = MAIL_SUBJECT.slice(0, Math.max(0, tick - email.length - 2));
  const typingTo = tick < email.length;
  const typingSubject = !typingTo && subject.length < MAIL_SUBJECT.length;
  const ready = tick >= total;

  return (
    <span className={cn("fc-peek", open && "is-open")} {...handlers}>
      <a href={`mailto:${email}`} className="fc-value">
        {email}
      </a>
      <span className="fc-pop is-mail" aria-hidden>
        <span className="fc-mail">
          <span className="fc-mail-bar">
            <i />
            <i />
            <i />
            <b>New chitthi</b>
          </span>
          <span className="fc-mail-field">
            <span>To</span>
            <span className="fc-mail-typed">
              {to}
              {typingTo ? <i className="fc-caret" /> : null}
            </span>
          </span>
          <span className="fc-mail-field">
            <span>Subject</span>
            <span className="fc-mail-typed">
              {subject}
              {typingSubject ? <i className="fc-caret" /> : null}
            </span>
          </span>
          <span className="fc-mail-body">
            <i />
            <i />
            <i />
          </span>
          <span className={cn("fc-mail-send", ready && "is-ready")}>
            Send
            <PlaneGlyph />
          </span>
        </span>
      </span>
    </span>
  );
}

export function MapPeek({ address, query }: { address: string; query: string }) {
  const { open, opened, handlers } = usePeek(0, 1000);
  const search = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <span className={cn("fc-peek", open && "is-open")} {...handlers}>
      <a href={search} target="_blank" rel="noopener noreferrer" className="fc-value is-address">
        {address}
      </a>
      <span className="fc-pop is-map">
        <span className="fc-map">
          <span className="fc-map-bar">
            <MapPinGlyph />
            Corporate Park · Sector 142, Noida
          </span>
          <span className="fc-map-frame">
            {opened ? (
              <iframe
                title="Ritz Media World on Google Maps"
                src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : null}
          </span>
          <a href={search} target="_blank" rel="noopener noreferrer" className="fc-map-open" tabIndex={open ? 0 : -1}>
            Open in Google Maps ↗
          </a>
        </span>
      </span>
    </span>
  );
}

export function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
    </svg>
  );
}

export function MailGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm8 7.2L19.2 7H4.8zM5 8.6V17h14V8.6l-6.4 4.6a1 1 0 0 1-1.2 0z" />
    </svg>
  );
}

export function MapPinGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7zm0 4.2A2.8 2.8 0 1 0 12 11.8 2.8 2.8 0 0 0 12 6.2z" />
    </svg>
  );
}

function PlaneGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M3 11.5 20.5 4l-4.7 16-4.1-6.1zm8.7 2.4 1.8 2.7 2.4-8.1z" />
    </svg>
  );
}
