"use client";

import { useEffect } from "react";

/* Gives every image and link a title tooltip when the markup did not set one:
   images reuse their alt text, links their accessible label or visible text. */
const clean = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, " ").trim();

function linkTitle(link: HTMLAnchorElement) {
  const label = clean(link.getAttribute("aria-label")) || clean(link.textContent);
  if (label) return label;
  const img = link.querySelector("img[alt]");
  if (img) return clean(img.getAttribute("alt"));
  const href = link.getAttribute("href") ?? "";
  return href.startsWith("#") ? "" : href;
}

function fill(root: ParentNode) {
  root.querySelectorAll<HTMLImageElement>("img:not([title])").forEach((img) => {
    const alt = clean(img.getAttribute("alt"));
    if (alt) img.title = alt;
  });
  root.querySelectorAll<HTMLAnchorElement>("a:not([title])").forEach((link) => {
    const title = linkTitle(link);
    if (title) link.title = title;
  });
}

export function AutoTitles() {
  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        fill(document.body);
      });
    };

    fill(document.body);
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}
