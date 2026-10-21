"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, type CSSProperties, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import type { BrandBox, BrandCrop, BrandGuide } from "@/lib/portfolio-pages";

const pct = (value: number, of: number) => `${(value / of) * 100}%`;

function boxStyle(part: BrandCrop, { w, h }: BrandGuide["size"]): CSSProperties {
  return { left: pct(part.x, w), top: pct(part.y, h), width: pct(part.w, w), height: pct(part.h, h) };
}

function partStyle(part: BrandCrop, size: BrandGuide["size"], sheet: string): CSSProperties {
  return {
    ...boxStyle(part, size),
    backgroundImage: `url(${sheet})`,
    backgroundSize: `${(size.w / part.w) * 100}% ${(size.h / part.h) * 100}%`,
    backgroundPosition: `${(part.x / (size.w - part.w)) * 100}% ${(part.y / (size.h - part.h)) * 100}%`,
  };
}

/** Big enough to outline and point at, unlike rules, dividers and signs. */
const isMain = (part: BrandCrop) => part.w >= 60 && part.h >= 40;

/** The first main region a viewer step writes, which the arrow points at. */
function stepTarget(guide: BrandGuide, step: number): BrandCrop {
  const parts = guide.steps[Math.min(step, guide.steps.length - 1)];
  return parts.find(isMain) ?? parts[0];
}
/**
 * The client's real style guide sheet. Each viewer step writes its own section, as if by pen, in the
 * time the viewport spends on that step; earlier sections stay written and later ones stay blank.
 */
export function BrandSheet({
  guide,
  client,
  step,
  seconds,
  reduced,
}: {
  guide: BrandGuide;
  client: string;
  step: number;
  /** How long the viewport stays on this step. */
  seconds: number;
  reduced: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLSpanElement>(null);
  const penRef = useRef<HTMLSpanElement>(null);
  const openedRef = useRef(false);
  const parts = guide.steps.flatMap((list, s) => list.map((crop, j) => ({ crop, s, j })));
  const last = guide.steps.length - 1;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const paper = paperRef.current;
    const pen = penRef.current;
    if (!root || !paper || !pen) return;

    const bits = [...root.querySelectorAll<HTMLElement>(".bc-sheet-bit")];
    if (reduced) {
      bits.forEach((bit) => (bit.style.clipPath = Number(bit.dataset.s) <= step ? "" : "inset(0 100% 0 0)"));
      gsap.set(paper, { autoAlpha: step >= last ? 0 : 1 });
      return;
    }

    const { w, h } = guide.size;
    const current: HTMLElement[] = [];
    bits.forEach((bit) => {
      const s = Number(bit.dataset.s);
      bit.style.clipPath = s < step ? "" : "inset(0 100% 0 0)";
      if (s === step) current.push(bit);
    });
    gsap.set(paper, { autoAlpha: 1 });
    gsap.set(pen, { autoAlpha: 0 });

    const opening = !openedRef.current;
    openedRef.current = true;
    const delay = opening ? 0.7 : 0.15;
    const tl = gsap.timeline({ delay });
    tl.set(pen, { autoAlpha: 1 });
    current.forEach((bit) => {
      const part = guide.steps[step][Number(bit.dataset.j)];
      const wipe = { p: 0 };
      tl.to(
        wipe,
        {
          p: 1,
          duration: part.w < 30 || part.h < 10 ? 0.2 : gsap.utils.clamp(0.4, 0.9, part.w / 280),
          ease: "power1.inOut",
          onUpdate: () => {
            bit.style.clipPath = `inset(0 ${(1 - wipe.p) * 100}% 0 0)`;
            pen.style.left = pct(part.x + part.w * wipe.p, w);
            pen.style.top = pct(part.y + part.h / 2, h);
          },
        },
        ">-0.04",
      );
    });
    tl.to(pen, { autoAlpha: 0, duration: 0.25 });
    if (step >= last) tl.to(paper, { autoAlpha: 0, duration: 0.8 }, "<");

    const budget = Math.max(0.8, seconds - delay - 0.3);
    tl.timeScale(Math.max(0.75, tl.duration() / budget));

    return () => {
      tl.kill();
    };
  }, [guide, step, seconds, reduced, last]);

  return (
    <div className="bc-sheet-wrap">
      <div ref={rootRef} className="bc-sheet" style={{ aspectRatio: `${guide.size.w} / ${guide.size.h}` }}>
        <Image
          src={guide.sheet}
          alt={`${client} brand identity style guide: logo concept, structure, colour palette, typography and applications`}
          width={guide.size.w}
          height={guide.size.h}
          unoptimized
          draggable={false}
        />
        <span ref={paperRef} className="bc-sheet-paper" aria-hidden />
        {parts.map(({ crop, s, j }) => (
          <span
            key={`${s}-${j}`}
            className={s === step && isMain(crop) ? "bc-sheet-bit is-now" : "bc-sheet-bit"}
            data-s={s}
            data-j={j}
            style={partStyle(crop, guide.size, guide.sheet)}
            aria-hidden
          />
        ))}

        <span ref={penRef} className="bc-sheet-pen" aria-hidden />
      </div>
      <a className="bc-sheet-open" href={guide.sheet} target="_blank" rel="noreferrer">
        View full style guide <span aria-hidden>↗</span>
      </a>
    </div>
  );
}

/** A dotted arrow from the logo in the viewport to the section of the style guide the current step writes. */
export function BrandArrow({
  shellRef,
  stageRef,
  logo,
  guide,
  step,
  reduced,
}: {
  shellRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  logo: BrandBox;
  guide: BrandGuide;
  step: number;
  reduced: boolean;
}) {
  const maskId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let frame = 0;
    let last = "";
    const target = stepTarget(guide, step);

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const shell = shellRef.current;
      const stage = stageRef.current;
      const sheet = shell?.querySelector<HTMLElement>(".bc-sheet");
      const panel = sheet?.closest<HTMLElement>(".bc-panel");
      const svg = svgRef.current;
      if (!shell || !stage || !sheet || !panel || !svg) return;

      const box = shell.getBoundingClientRect();
      const st = stage.getBoundingClientRect();
      const sh = sheet.getBoundingClientRect();
      const view = panel.getBoundingClientRect();
      const side = sh.left >= st.right - 4;
      const at = (x: number, y: number): [number, number] => [
        sh.left + (x / guide.size.w) * sh.width,
        sh.top + (y / guide.size.h) * sh.height,
      ];
      let sx: number, sy: number, ex: number, ey: number, c1: [number, number], c2: [number, number];

      if (side) {
        sx = Math.min(st.left + ((logo.x + logo.w) / 100) * st.width + 10, st.right - 14);
        sy = st.top + ((logo.y + logo.h / 2) / 100) * st.height;
        [ex, ey] = at(target.x, target.y + target.h / 2);
        ex -= 6;
        const dx = (ex - sx) * 0.55;
        c1 = [sx + dx, sy];
        c2 = [ex - dx, ey];
      } else {
        sx = st.left + ((logo.x + logo.w / 2) / 100) * st.width;
        sy = Math.min(st.top + ((logo.y + logo.h) / 100) * st.height + 10, st.bottom - 14);
        [ex, ey] = at(target.x + target.w / 2, target.y);
        ey -= 6;
        const dy = (ey - sy) * 0.55;
        c1 = [sx, sy + dy];
        c2 = [ex, ey - dy];
      }

      const visible = ey > view.top - 24 && ey < view.bottom - 40;
      const [ox, oy] = [box.left, box.top];
      const p = (x: number, y: number) => `${(x - ox).toFixed(1)} ${(y - oy).toFixed(1)}`;
      const d = `M${p(sx, sy)} C${p(...c1)} ${p(...c2)} ${p(ex, ey)}`;
      const angle = Math.atan2(ey - c2[1], ex - c2[0]);
      const wing = (turn: number) => p(ex - 9 * Math.cos(angle + turn), ey - 9 * Math.sin(angle + turn));
      const head = `M${wing(0.5)} L${p(ex, ey)} L${wing(-0.5)}`;
      const key = `${d}|${visible}`;
      if (key === last) return;
      last = key;

      lineRef.current?.setAttribute("d", d);
      maskRef.current?.setAttribute("d", `${d} M${p(ex, ey)} L${p(ex, ey)}`);
      headRef.current?.setAttribute("d", head);
      svg.style.opacity = visible ? "" : "0";
    };

    tick();
    return () => cancelAnimationFrame(frame);
  }, [shellRef, stageRef, logo, guide, step]);

  return (
    <svg ref={svgRef} className={reduced ? "bc-arrow" : "bc-arrow is-drawing"} aria-hidden>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-9999" y="-9999" width="19999" height="19999">
          <path ref={maskRef} className="bc-arrow-mask" pathLength={1} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path ref={lineRef} className="bc-arrow-line" />
        <path ref={headRef} className="bc-arrow-head" />
      </g>
    </svg>
  );
}
