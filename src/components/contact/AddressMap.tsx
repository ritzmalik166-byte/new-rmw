"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type AddressMapProps = {
  address: string;
  name: string;
};

const CLOSE_DELAY_MS = 180;

export function AddressMap({ address, name }: AddressMapProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const query = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const embedUrl = `https://www.google.com/maps?q=${query}&z=16&output=embed`;

  const show = () => {
    window.clearTimeout(closeTimer.current);
    if (!window.matchMedia("(hover: hover)").matches) return;
    setLoaded(true);
    setOpen(true);
  };

  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <span className="ct-map" onPointerEnter={show} onPointerLeave={hide} onFocus={show} onBlur={hide}>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-expanded={open}
        aria-controls={`${id}-map`}
      >
        {address}
      </a>
      <span
        id={`${id}-map`}
        role="dialog"
        aria-label={`Map of ${name}`}
        className={cn("ct-map-pop", open && "is-open")}
        hidden={!loaded}
      >
        <span className="ct-map-head">
          <span>
            <span className="ct-map-kicker">Find the depot</span>
            <span className="ct-map-name">{name}</span>
          </span>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            Directions ↗
          </a>
        </span>
        {loaded ? (
          <iframe
            className="ct-map-frame"
            src={embedUrl}
            title={`Google Map of ${address}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
          />
        ) : null}
      </span>
    </span>
  );
}
