"use client";

import { useGSAP } from "@gsap/react";
import { Fragment, useLayoutEffect, type ReactNode, type RefObject } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

/** `node`, when set, is rendered in place of `text` (which still keys the line). */
export type HmLine = { text: string; node?: ReactNode; accent?: boolean };

export function HmTitle({
  id,
  lines,
  className,
  as: Tag = "h2",
}: {
  id?: string;
  lines: readonly HmLine[];
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag id={id} className={cn("hm-title", className)}>
      {lines.map((line, index) => (
        <Fragment key={line.text}>
          {/* Lines are blocks, so this space is invisible, but it keeps the heading's text
              (SEO tools, screen readers, copy) from running the lines together. */}
          {index > 0 ? " " : null}
          <span className={cn("hm-line", line.accent && "is-accent")}>
            <span data-hm-line className="hm-line-inner">
              {line.node ?? line.text}
            </span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}

/* Steps a heading's font size down from its stylesheet size until it renders in at
   most `maxLines` lines and no unwrapped line overflows its mask. Re-fits whenever the
   heading's container changes width, and once the web fonts have loaded. */
export function useFitTitle(
  rootRef: RefObject<HTMLElement | null>,
  selector: string,
  maxLines = 2,
  minSize = 18,
) {
  useLayoutEffect(() => {
    const title = rootRef.current?.querySelector<HTMLElement>(selector);
    const box = title?.parentElement;
    if (!title || !box) return;
    const lines = [...title.querySelectorAll<HTMLElement>(".hm-line")];
    let width = -1;

    const fit = (force = false) => {
      if (!force && box.clientWidth === width) return;
      width = box.clientWidth;
      title.style.removeProperty("font-size");
      let size = parseFloat(getComputedStyle(title).fontSize);
      const tooBig = () => {
        const lineHeight = parseFloat(getComputedStyle(title).lineHeight) || size * 1.1;
        return (
          Math.round(title.offsetHeight / lineHeight) > maxLines ||
          lines.some((line) => line.scrollWidth > line.clientWidth + 1)
        );
      };
      while (size > minSize && tooBig()) {
        size -= 1;
        title.style.fontSize = `${size}px`;
      }
    };

    fit(true);
    const observer = new ResizeObserver(() => fit());
    observer.observe(box);
    document.fonts?.ready.then(() => fit(true));
    return () => {
      observer.disconnect();
      title.style.removeProperty("font-size");
    };
  }, [rootRef, selector, maxLines, minSize]);
}

/* Same entrance as the services hero: serif lines rise out of their mask,
   supporting copy fades up, then any stamp thuds down last. */
export function useHomeReveal(rootRef: RefObject<HTMLElement | null>, start = "top 72%") {
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const q = gsap.utils.selector(root);
      const lines = q("[data-hm-line]");
      const fades = q("[data-hm-fade]");
      const stamps = q("[data-hm-stamp]");

      if (reduced) {
        gsap.set([...lines, ...fades, ...stamps], { clearProps: "opacity,visibility,transform" });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start, once: true },
      });

      if (lines.length) {
        tl.fromTo(
          lines,
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.09 },
          0,
        );
      }
      if (fades.length) {
        tl.fromTo(
          fades,
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.08 },
          0.2,
        );
      }
      if (stamps.length) {
        tl.fromTo(
          stamps,
          { scale: 2.4, autoAlpha: 0 },
          { scale: 1, autoAlpha: 0.92, duration: 0.45, ease: "power4.in", stagger: 0.12 },
          ">-0.25",
        );
      }
    },
    { scope: rootRef, dependencies: [ready, reduced, start] },
  );
}

export function HmArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4 12L12 4M12 4H6.5M12 4V9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HmPlate({ className }: { className?: string }) {
  return (
    <p className={cn("hm-plate", className)} aria-hidden>
      Horn <span lang="hi">ओके</span> Please
    </p>
  );
}

export function HmStamp({
  id,
  top,
  bottom,
  word,
  className,
}: {
  id: string;
  top: string;
  bottom: string;
  word: string;
  className?: string;
}) {
  /* The word has to sit inside the inner ring (~80 units across): two-word labels
     stack like a rubber stamp, and anything still too wide shrinks. */
  const lines = word.includes(" ") && word.length > 7 ? word.split(/\s+/) : [word];
  const longest = Math.max(...lines.map((line) => line.length));
  const wordSize = Math.min(lines.length > 1 ? 20 : 21, 80 / (longest * 0.56));

  return (
    <svg data-hm-stamp className={cn("hm-stamp", className)} viewBox="0 0 120 120" aria-hidden>
      <defs>
        <path id={`${id}-top`} d="M 22 60 A 38 38 0 0 1 98 60" />
        <path id={`${id}-bottom`} d="M 16 60 A 44 44 0 0 0 104 60" />
      </defs>
      <circle cx="60" cy="60" r="56" />
      <circle cx="60" cy="60" r="48" className="is-thin" />
      <text className={cn("hm-stamp-ring", top.length > 14 && "is-long")}>
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {top}
        </textPath>
      </text>
      <text className={cn("hm-stamp-ring", bottom.length > 16 && "is-long")}>
        <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
          {bottom}
        </textPath>
      </text>
      <text
        className="hm-stamp-word"
        x="60"
        y="60"
        dominantBaseline="central"
        textAnchor="middle"
        style={{ fontSize: wordSize }}
        transform="rotate(-12 60 60)"
      >
        {lines.length > 1
          ? lines.map((line, index) => (
              <tspan
                key={line}
                x="60"
                dy={index === 0 ? `${-0.5 * (lines.length - 1)}em` : "1em"}
              >
                {line}
              </tspan>
            ))
          : word}
      </text>
    </svg>
  );
}
