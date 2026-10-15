"use client";

import Link from "next/link";
import { useLenis } from "lenis/react";
import { useRef, type MouseEvent } from "react";
import { HmPlate } from "@/components/homepage/shared";
import { ServiceQueryForm } from "@/components/services/ServiceQueryForm";

export function ServiceQueryCta({ service }: { service: string }) {
  const sheetRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  const open = () => {
    const sheet = sheetRef.current;
    if (!sheet || sheet.open) return;
    sheet.showModal();
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
  };

  const close = () => sheetRef.current?.close();

  const onClosed = () => {
    document.documentElement.style.overflow = "";
    lenis?.start();
    triggerRef.current?.focus({ preventScroll: true });
  };

  const onBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <>
      <div data-hm-fade className="sd-brief-cta">
        <HmPlate className="sd-req-plate" />
        <span className="sd-req-kicker">Dispatch office</span>
        <p className="sd-req-title">Discuss your {service} requirements</p>
        <div className="sd-brief-cta-actions">
          <button ref={triggerRef} type="button" className="sd-req-cta" onClick={open} aria-haspopup="dialog">
            Send a query <span aria-hidden>→</span>
          </button>
          <Link href="/contact" target="_blank" rel="noopener noreferrer" className="sd-brief-cta-link">
            Start a project <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>

      <dialog
        ref={sheetRef}
        className="sd-sheet"
        aria-label={`Send a ${service} query`}
        onClose={onClosed}
        onClick={onBackdrop}
        data-lenis-prevent
      >
        <ServiceQueryForm service={service} className="is-sheet" onClose={close} />
      </dialog>
    </>
  );
}
