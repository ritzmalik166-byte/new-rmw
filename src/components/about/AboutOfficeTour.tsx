"use client";

import { useEffect, useRef, useState } from "react";

export function AboutOfficeTour() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const collapseTimer = window.setTimeout(() => setIsExpanded(false), 7000);
    return () => window.clearTimeout(collapseTimer);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  if (isDismissed) return null;

  return (
    <>
      <aside className={`about-office-tour${isExpanded ? " is-expanded" : " is-collapsed"}`} aria-label="New office walkthrough">
        <button
          type="button"
          className="about-office-tour-close"
          onClick={() => setIsDismissed(true)}
          aria-label="Close office walkthrough"
        >
          <span aria-hidden>×</span>
        </button>
        <button
          type="button"
          className="about-office-tour-open"
          onClick={() => setIsOpen(true)}
          aria-label="Open new office walkthrough"
        >
          <span className="about-office-tour-media">
            <video
              src="/videos/office-tour.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
            <span className="about-office-tour-play" aria-hidden>
              <span />
            </span>
          </span>
          <span className="about-office-tour-copy">
            <span className="about-office-tour-kicker">New office · 7th floor</span>
            <strong>Take a quick tour</strong>
            <span>Watch walkthrough</span>
          </span>
        </button>
        {!isExpanded ? (
          <button
            type="button"
            className="about-office-tour-reopen"
            onClick={() => setIsExpanded(true)}
            aria-label="Show office walkthrough highlight"
          >
            <span aria-hidden>✦</span>
            Office tour
          </button>
        ) : null}
      </aside>

      <dialog
        ref={dialogRef}
        className="about-office-tour-modal"
        aria-label="New office walkthrough video"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
      >
        <div className="about-office-tour-modal-inner">
          <header className="about-office-tour-modal-head">
            <div>
              <span className="about-office-tour-kicker">Ritz Media World · New office</span>
              <h2>Welcome to our 7th floor</h2>
            </div>
            <button type="button" className="about-office-tour-modal-close" onClick={() => setIsOpen(false)}>
              <span aria-hidden>×</span>
              Close
            </button>
          </header>
          <div className="about-office-tour-modal-frame">
            {isOpen ? (
              <video
                src="/videos/office-tour.mp4"
                controls
                autoPlay
                playsInline
                preload="metadata"
              />
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
