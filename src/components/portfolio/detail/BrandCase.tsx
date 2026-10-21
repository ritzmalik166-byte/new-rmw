"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import type { BrandAnatomy } from "@/lib/portfolio-pages";
import { BrandArrow, BrandSheet } from "./BrandSheet";

registerGsap();

export type BrandCaseEntry = { src: string; alt: string; brand: BrandAnatomy };

type Layer = "grid" | "keylines" | "geometry" | "space" | "colour";
type Frame = "full" | "logo" | "tight" | "mark" | "space";

const STEP_MS = 3800;
const PHI = 1.618;
/** The overlay is drawn in a 100 × 125 box, matching the 4:5 mockups. */
const VB_H = 125;
const MAX_ZOOM = 3.5;

const STEPS: { label: string; copy: string; frame: Frame; layers: Layer[]; blueprint: boolean }[] = [
  {
    label: "The finished identity",
    copy: "The logo where people will actually meet it: on a wall, a card or a hoarding.",
    frame: "full",
    layers: [],
    blueprint: false,
  },
  {
    label: "Grid & keylines",
    copy: "A modular grid, set from the symbol's own size, locks the proportions, alignment and baselines of the lockup.",
    frame: "logo",
    layers: ["grid", "keylines"],
    blueprint: true,
  },
  {
    label: "Geometry of the symbol",
    copy: "Circles and diagonals from a single centre give the symbol its balance, so it holds up from a favicon to a facade.",
    frame: "mark",
    layers: ["geometry"],
    blueprint: true,
  },
  {
    label: "Clear space",
    copy: "A protected margin of x, half the symbol, keeps the logo breathing wherever it is placed.",
    frame: "space",
    layers: ["space"],
    blueprint: true,
  },
  {
    label: "Colour palette",
    copy: "The palette, sampled straight from the artwork, so print, screen and signage stay in step.",
    frame: "tight",
    layers: ["colour"],
    blueprint: false,
  },
];

const pad2 = (value: number) => String(value).padStart(2, "0");
const fixed = (value: number) => value.toFixed(value >= 10 ? 0 : 1);

/* ---------- Construction plan ---------- */

type Box = { x: number; y: number; w: number; h: number };

function planOf({ logo, mark }: BrandAnatomy) {
  const L = { x: logo.x, y: logo.y * 1.25, w: logo.w, h: logo.h * 1.25 };
  const M = { x: mark.x, y: mark.y * 1.25, w: mark.w, h: mark.h * 1.25 };
  const r = Math.min(M.w, M.h) / 2;
  const R = Math.hypot(M.w, M.h) / 2;
  const x = r;
  const unit = Math.max(M.w, M.h) / 4;
  const S = { x: L.x - x, y: L.y - x, w: L.w + 2 * x, h: L.h + 2 * x };

  const ticks = (from: number, to: number, anchor: number) => {
    const start = anchor - Math.ceil((anchor - from) / unit) * unit;
    const out: number[] = [];
    for (let value = start; value <= to + 0.001 && out.length < 48; value += unit) out.push(value);
    return out;
  };

  return {
    L,
    M,
    S,
    r,
    R,
    x,
    unit,
    cx: L.x + L.w / 2,
    cy: L.y + L.h / 2,
    mx: M.x + M.w / 2,
    my: M.y + M.h / 2,
    cols: ticks(L.x - unit, L.x + L.w + unit, M.x),
    rows: ticks(L.y - unit, L.y + L.h + unit, M.y),
  };
}

type Plan = ReturnType<typeof planOf>;

/* ---------- Camera ---------- */

/** Zoom and the canvas offset, as a percent of the canvas's own size. */
type Cam = { z: number; x: number; y: number };

const clampCam = ({ z, x, y }: Cam): Cam => {
  const zoom = gsap.utils.clamp(1, MAX_ZOOM, z);
  const min = 100 - 100 * zoom;
  return { z: zoom, x: gsap.utils.clamp(min, 0, x), y: gsap.utils.clamp(min, 0, y) };
};

const grow = (box: Box, by: number): Box => ({ x: box.x - by, y: box.y - by, w: box.w + by * 2, h: box.h + by * 2 });

function fit(box: Box, fill: number): Cam {
  const z = gsap.utils.clamp(1, MAX_ZOOM, Math.min((fill * 100) / box.w, (fill * VB_H) / box.h));
  const cx = box.x + box.w / 2;
  const cy = ((box.y + box.h / 2) / VB_H) * 100;
  return clampCam({ z, x: 50 - cx * z, y: 50 - cy * z });
}

function frameOf(frame: Frame, plan: Plan): Cam {
  if (frame === "full") return { z: 1, x: 0, y: 0 };
  if (frame === "mark") return fit(grow({ x: plan.mx, y: plan.my, w: 0, h: 0 }, plan.R), 0.74);
  if (frame === "space") return fit(plan.S, 0.88);
  if (frame === "tight") return fit(plan.L, 0.84);
  return fit(grow(plan.L, plan.x), 0.9);
}

function createCamera() {
  const now: Cam = { z: 1, x: 0, y: 0 };
  let goal: Cam = { ...now };
  let reduced = false;
  let els: { stage?: HTMLElement | null; canvas?: HTMLElement | null; zoom?: HTMLElement | null } = {};

  const apply = () => {
    const { canvas, stage, zoom } = els;
    if (!canvas || !stage) return;
    canvas.style.transform = `translate(${now.x}%, ${now.y}%) scale(${now.z})`;
    canvas.style.setProperty("--z", String(now.z));
    stage.toggleAttribute("data-zoomed", now.z > 1.01);
    if (zoom) zoom.textContent = `${Math.round(now.z * 100)}%`;
  };

  // A promoted layer is rasterised once at its starting scale and then stretched, which pixelates
  // the zoomed artwork. Promote only while moving so the browser repaints sharp at rest.
  const hold = (moving: boolean) => {
    if (els.canvas) els.canvas.style.willChange = moving ? "transform" : "";
  };

  const to = (target: Cam, duration = 1.2, ease = "power3.inOut") => {
    goal = clampCam(target);
    gsap.killTweensOf(now);
    if (reduced || duration === 0) {
      Object.assign(now, goal);
      apply();
      return;
    }
    hold(true);
    gsap.to(now, { ...goal, duration, ease, onUpdate: apply, onComplete: () => hold(false) });
  };

  return {
    now,
    attach(next: typeof els, isReduced: boolean) {
      els = next;
      reduced = isReduced;
      apply();
    },
    hold,
    to,
    set(target: Cam) {
      to(target, 0);
    },
    /** Zoom towards a point given in percent of the stage. */
    zoomAt(z: number, px: number, py: number, duration = 0.45) {
      const zoom = gsap.utils.clamp(1, MAX_ZOOM, z);
      const cx = (px - goal.x) / goal.z;
      const cy = (py - goal.y) / goal.z;
      to({ z: zoom, x: px - cx * zoom, y: py - cy * zoom }, duration, "power2.out");
    },
    get goal() {
      return goal;
    },
    kill() {
      gsap.killTweensOf(now);
    },
  };
}

/* ---------- Palette sampling ---------- */

type Swatch = { hex: string; share: number; x: number; y: number };

const paletteCache = new Map<string, Swatch[]>();

function samplePalette(img: HTMLImageElement, { logo }: BrandAnatomy): Swatch[] {
  const margin = 3;
  const sx = Math.max(0, logo.x - margin);
  const sy = Math.max(0, logo.y - margin);
  const sw = Math.min(100 - sx, logo.w + margin * 2);
  const sh = Math.min(100 - sy, logo.h + margin * 2);
  const W = 160;
  const H = Math.max(8, Math.round((W * sh * 1.25) / sw));

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  ctx.drawImage(img, (sx / 100) * nw, (sy / 100) * nh, (sw / 100) * nw, (sh / 100) * nh, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);

  type Bucket = { n: number; r: number; g: number; b: number; px: number; py: number };
  const buckets = new Map<number, Bucket>();
  const keyAt = (i: number) => ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);

  for (let i = 0; i < data.length; i += 4) {
    const key = keyAt(i);
    const pixel = i / 4;
    const bucket = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0, px: 0, py: 0 };
    bucket.n += 1;
    bucket.r += data[i];
    bucket.g += data[i + 1];
    bucket.b += data[i + 2];
    bucket.px += pixel % W;
    bucket.py += Math.floor(pixel / W);
    buckets.set(key, bucket);
  }

  const total = W * H;
  const picked: { key: number; rgb: [number, number, number]; n: number }[] = [];
  for (const [key, bucket] of [...buckets].sort((a, b) => b[1].n - a[1].n)) {
    if (bucket.n / total < 0.004 || picked.length >= 5) break;
    const rgb: [number, number, number] = [bucket.r / bucket.n, bucket.g / bucket.n, bucket.b / bucket.n];
    const far = picked.every(
      ({ rgb: other }) => Math.hypot(rgb[0] - other[0], rgb[1] - other[1], rgb[2] - other[2]) > 62,
    );
    if (far) picked.push({ key, rgb, n: bucket.n });
  }

  // Pin each colour on a pixel of that colour near its centre of mass, kept clear of earlier pins.
  const placed: { x: number; y: number }[] = [];
  const gap = W * 0.14;
  return picked.map(({ key, rgb, n }) => {
    const bucket = buckets.get(key)!;
    const mx = bucket.px / bucket.n;
    const my = bucket.py / bucket.n;
    let best = { d: Infinity, x: mx, y: my };
    let fallback = best;
    for (let i = 0; i < data.length; i += 4) {
      if (keyAt(i) !== key) continue;
      const px = (i / 4) % W;
      const py = Math.floor(i / 4 / W);
      const d = (px - mx) ** 2 + (py - my) ** 2;
      if (d < fallback.d) fallback = { d, x: px, y: py };
      if (d < best.d && placed.every((pin) => Math.hypot(pin.x - px, pin.y - py) > gap)) best = { d, x: px, y: py };
    }
    if (best.d === Infinity) best = fallback;
    placed.push(best);
    const [r, g, b] = rgb.map(Math.round);
    return {
      hex: `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase(),
      share: n / total,
      x: sx + ((best.x + 0.5) / W) * sw,
      y: sy + ((best.y + 0.5) / H) * sh,
    };
  });
}

function usePalette(entry: BrandCaseEntry) {
  const [result, setResult] = useState<{ src: string; swatches: Swatch[] } | null>(null);

  useEffect(() => {
    const cached = paletteCache.get(entry.src);
    let cancelled = false;
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      const swatches = cached ?? samplePalette(img, entry.brand);
      paletteCache.set(entry.src, swatches);
      setResult({ src: entry.src, swatches });
    };
    img.src = entry.src;
    return () => {
      cancelled = true;
    };
  }, [entry]);

  return result?.src === entry.src ? result.swatches : null;
}

/* ---------- Overlay ---------- */

const rectPath = ({ x, y, w, h }: Box) => `M${x} ${y}h${w}v${h}h${-w}Z`;

function Blueprint({ plan }: { plan: Plan }) {
  const { L, M, S, r, R, x, cx, cy, mx, my, cols, rows } = plan;
  const tick = x * 0.25;
  const rulerY = L.y - x * 0.55;
  const rulerX = L.x - x * 0.55;

  return (
    <svg className="bc-blueprint" viewBox={`0 0 100 ${VB_H}`} preserveAspectRatio="none" aria-hidden>
      <g data-layer="grid" className="bc-l-grid">
        {cols.map((value) => (
          <line
            key={`c${value}`}
            className="bc-draw"
            pathLength={1}
            x1={value}
            x2={value}
            y1={rows[0]}
            y2={rows[rows.length - 1]}
          />
        ))}
        {rows.map((value) => (
          <line
            key={`r${value}`}
            className="bc-draw"
            pathLength={1}
            x1={cols[0]}
            x2={cols[cols.length - 1]}
            y1={value}
            y2={value}
          />
        ))}
      </g>

      <g data-layer="keylines" className="bc-l-key">
        <line className="bc-draw is-soft" pathLength={1} x1={cx} x2={cx} y1={0} y2={VB_H} />
        <line className="bc-draw is-soft" pathLength={1} x1={0} x2={100} y1={cy} y2={cy} />
        <line className="bc-draw is-soft" pathLength={1} x1={L.x - x} x2={L.x + L.w + x} y1={M.y} y2={M.y} />
        <line
          className="bc-draw is-soft"
          pathLength={1}
          x1={L.x - x}
          x2={L.x + L.w + x}
          y1={M.y + M.h}
          y2={M.y + M.h}
        />
        <rect className="bc-draw" pathLength={1} x={L.x} y={L.y} width={L.w} height={L.h} />
        <rect className="bc-draw" pathLength={1} x={M.x} y={M.y} width={M.w} height={M.h} />
        <line className="bc-draw" pathLength={1} x1={L.x} x2={L.x + L.w} y1={rulerY} y2={rulerY} />
        <line className="bc-draw" pathLength={1} x1={L.x} x2={L.x} y1={rulerY - tick} y2={rulerY + tick} />
        <line className="bc-draw" pathLength={1} x1={L.x + L.w} x2={L.x + L.w} y1={rulerY - tick} y2={rulerY + tick} />
        <line className="bc-draw" pathLength={1} x1={rulerX} x2={rulerX} y1={L.y} y2={L.y + L.h} />
        <line className="bc-draw" pathLength={1} x1={rulerX - tick} x2={rulerX + tick} y1={L.y} y2={L.y} />
        <line className="bc-draw" pathLength={1} x1={rulerX - tick} x2={rulerX + tick} y1={L.y + L.h} y2={L.y + L.h} />
      </g>

      <g data-layer="geometry" className="bc-l-geo">
        <line className="bc-draw is-soft" pathLength={1} x1={mx - R} x2={mx + R} y1={my} y2={my} />
        <line className="bc-draw is-soft" pathLength={1} x1={mx} x2={mx} y1={my - R} y2={my + R} />
        <line className="bc-draw is-soft" pathLength={1} x1={M.x} x2={M.x + M.w} y1={M.y} y2={M.y + M.h} />
        <line className="bc-draw is-soft" pathLength={1} x1={M.x + M.w} x2={M.x} y1={M.y} y2={M.y + M.h} />
        <rect className="bc-draw" pathLength={1} x={M.x} y={M.y} width={M.w} height={M.h} />
        <circle className="bc-draw" pathLength={1} cx={mx} cy={my} r={R} />
        <circle className="bc-draw" pathLength={1} cx={mx} cy={my} r={r} />
        <circle className="bc-draw" pathLength={1} cx={mx} cy={my} r={r / PHI} />
        <circle className="bc-draw" pathLength={1} cx={mx} cy={my} r={r / PHI ** 2} />
        <circle className="bc-dot" cx={mx} cy={my} r={0.5} />
      </g>

      <g data-layer="space" className="bc-l-space">
        <path className="bc-fill" fillRule="evenodd" d={`${rectPath(S)}${rectPath(L)}`} />
        <rect className="bc-dash" x={S.x} y={S.y} width={S.w} height={S.h} />
        <rect className="bc-draw" pathLength={1} x={L.x} y={L.y} width={L.w} height={L.h} />
        <line className="bc-draw" pathLength={1} x1={S.x} x2={L.x} y1={cy} y2={cy} />
        <line className="bc-draw" pathLength={1} x1={L.x + L.w} x2={S.x + S.w} y1={cy} y2={cy} />
        <line className="bc-draw" pathLength={1} x1={cx} x2={cx} y1={S.y} y2={L.y} />
        <line className="bc-draw" pathLength={1} x1={cx} x2={cx} y1={L.y + L.h} y2={S.y + S.h} />
      </g>
    </svg>
  );
}

function labelsOf(plan: Plan) {
  const { L, M, S, r, R, x, unit, cx, cy, mx, my, cols, rows } = plan;
  return [
    { layer: "grid", x: cols[0] + unit / 2, y: rows[0] + unit / 2, text: "1u" },
    { layer: "keylines", x: cx, y: L.y - x * 0.55, text: `W ${fixed(L.w / x)}x` },
    { layer: "keylines", x: L.x - x * 0.55, y: cy, text: `H ${fixed(L.h / x)}x` },
    { layer: "keylines", x: M.x + M.w, y: M.y, text: "Symbol" },
    { layer: "geometry", x: mx, y: my - R, text: "R" },
    { layer: "geometry", x: mx + r * Math.SQRT1_2, y: my - r * Math.SQRT1_2, text: "r" },
    { layer: "geometry", x: mx + r / PHI, y: my, text: "r ÷ φ" },
    { layer: "space", x: (S.x + L.x) / 2, y: cy, text: "x" },
    { layer: "space", x: (L.x + L.w + S.x + S.w) / 2, y: cy, text: "x" },
    { layer: "space", x: cx, y: (S.y + L.y) / 2, text: "x" },
    { layer: "space", x: cx, y: (L.y + L.h + S.y + S.h) / 2, text: "x" },
  ] satisfies { layer: Layer; x: number; y: number; text: string }[];
}

function showLayers(root: HTMLElement, layers: Layer[], animate: boolean) {
  const all = gsap.utils.toArray<HTMLElement | SVGElement>("[data-layer]", root);
  const on = all.filter((el) => layers.includes(el.dataset.layer as Layer));
  const off = all.filter((el) => !on.includes(el));
  const groups = on.filter((el) => el instanceof SVGGElement);
  const tags = on.filter((el) => !(el instanceof SVGGElement));
  const strokes = groups.flatMap((group) => [...group.querySelectorAll(".bc-draw")]);
  const fades = groups.flatMap((group) => [...group.querySelectorAll(".bc-dash, .bc-fill, .bc-dot")]);
  const inners = tags.map((tag) => tag.firstElementChild).filter(Boolean);

  gsap.killTweensOf([...all, ...strokes, ...fades, ...inners]);
  if (off.length) gsap.to(off, { autoAlpha: 0, duration: animate ? 0.25 : 0, ease: "power1.out" });
  if (!on.length) return null;

  if (!animate) {
    gsap.set(on, { autoAlpha: 1 });
    if (strokes.length) gsap.set(strokes, { strokeDashoffset: 0 });
    if (fades.length) gsap.set(fades, { autoAlpha: 1 });
    if (inners.length) gsap.set(inners, { clearProps: "transform,opacity,visibility" });
    return null;
  }

  const tl = gsap.timeline({ delay: 0.35 });
  tl.set(on, { autoAlpha: 1 });
  if (strokes.length) {
    tl.fromTo(
      strokes,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: { amount: 0.7 } },
      0,
    );
  }
  if (fades.length) tl.fromTo(fades, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power1.out" }, 0.45);
  if (inners.length) {
    tl.fromTo(
      inners,
      { autoAlpha: 0, scale: 0.4, y: 8 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(2.2)", stagger: 0.06 },
      strokes.length ? 0.6 : 0,
    );
  }
  return tl;
}

/* ---------- Modal ---------- */

export function BrandCase({
  entries,
  index,
  origin,
  onIndex,
  onClose,
}: {
  entries: BrandCaseEntry[];
  index: number;
  /** Where the clicked tile sat on screen, so the viewport can grow out of it. */
  origin: DOMRect | null;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const shutterRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const dirRef = useRef(1);
  const closingRef = useRef(false);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const gestureRef = useRef<{ x: number; y: number; d: number; cam: Cam; rect: DOMRect } | null>(null);
  const tapRef = useRef<{ t: number; x: number; y: number; down: number; moved: boolean } | null>(null);
  const stepsRef = useRef<HTMLOListElement>(null);

  const lenis = useLenis();
  const { reduced } = useMotion();
  const [camera] = useState(createCamera);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const entry = entries[index];
  const plan = useMemo(() => planOf(entry.brand), [entry]);
  const labels = useMemo(() => labelsOf(plan), [plan]);
  const swatches = usePalette(entry);
  const current = STEPS[step];
  const autoplay = playing && !reduced;
  const guide = entry.brand.guide;

  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const stage = stageRef.current;
    if (!dialog || !stage) return;
    if (!dialog.open) dialog.showModal();
    camera.attach({ stage, canvas: canvasRef.current, zoom: zoomRef.current }, reduced);

    const ctx = gsap.context(() => {
      if (reduced) return;
      const tl = gsap.timeline();
      tl.from(backdropRef.current, { autoAlpha: 0, duration: 0.45, ease: "power1.out" }, 0);
      if (origin) {
        const box = stage.getBoundingClientRect();
        tl.from(
          stage,
          {
            x: origin.left - box.left,
            y: origin.top - box.top,
            scaleX: origin.width / box.width,
            scaleY: origin.height / box.height,
            transformOrigin: "0 0",
            duration: 0.95,
            ease: "expo.out",
            clearProps: "transform",
          },
          0,
        );
      } else {
        tl.from(stage, { autoAlpha: 0, scale: 0.94, duration: 0.6, ease: "power3.out" }, 0);
      }
      tl.from(
        "[data-bc-in]",
        { y: 28, autoAlpha: 0, duration: 0.65, ease: "power3.out", stagger: 0.06, clearProps: "transform" },
        0.25,
      );
    }, dialog);

    return () => {
      ctx.revert();
      camera.kill();
      if (dialog.open) dialog.close();
    };
  }, [camera, origin, reduced]);

  // Each step frames its part of the logo and draws its construction layers.
  useEffect(() => {
    camera.to(frameOf(current.frame, plan));
  }, [camera, current, plan]);

  const pins = current.layers.includes("colour") ? swatches : null;
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const tl = showLayers(stage, current.layers, !reduced);
    return () => {
      tl?.kill();
    };
  }, [current, plan, reduced, pins]);

  useEffect(() => {
    if (!autoplay) return;
    const last = step >= STEPS.length - 1;
    const id = window.setTimeout(
      () => (last ? setPlaying(false) : setStep(step + 1)),
      step === 0 ? STEP_MS * 0.6 : STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [autoplay, step]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = stage.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) * 100;
      const py = ((event.clientY - rect.top) / rect.height) * 100;
      camera.zoomAt(camera.goal.z * Math.exp(-event.deltaY * 0.0016), px, py, 0.4);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [camera]);

  // On phones the steps are a sideways strip; keep the current one in view.
  useEffect(() => {
    const list = stepsRef.current;
    const item = list?.children[step] as HTMLElement | undefined;
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(null), 1400);
    return () => window.clearTimeout(id);
  }, [copied]);

  const revealShutter = () => {
    const shutter = shutterRef.current;
    if (!shutter || !busyRef.current) return;
    gsap.to(shutter, {
      scaleX: 0,
      transformOrigin: dirRef.current > 0 ? "100% 50%" : "0% 50%",
      duration: 0.6,
      ease: "power3.out",
      onComplete: () => {
        busyRef.current = false;
      },
    });
  };

  const go = (next: number) => {
    const target = (next + entries.length) % entries.length;
    if (busyRef.current || target === index) return;
    if (reduced || !shutterRef.current) {
      onIndex(target);
      return;
    }
    busyRef.current = true;
    dirRef.current = next > index ? 1 : -1;
    gsap.fromTo(
      shutterRef.current,
      { scaleX: 0, transformOrigin: dirRef.current > 0 ? "0% 50%" : "100% 50%" },
      {
        scaleX: 1,
        duration: 0.42,
        ease: "power3.in",
        onComplete: () => {
          onIndex(target);
          // In case the next image was already decoded and never fires onLoad.
          window.setTimeout(revealShutter, 700);
        },
      },
    );
  };

  const pickStep = (next: number) => {
    setPlaying(false);
    setStep(next);
  };

  const togglePlay = () => {
    if (!playing && step === STEPS.length - 1) setStep(1);
    setPlaying(!playing);
  };

  const close = (after?: () => void) => {
    if (closingRef.current) return;
    closingRef.current = true;
    const done = () => {
      onClose();
      if (after) window.setTimeout(after, 60);
    };
    if (reduced) {
      done();
      return;
    }
    gsap
      .timeline({ onComplete: done })
      .to(shellRef.current, { y: 24, autoAlpha: 0, duration: 0.3, ease: "power2.in" })
      .to(backdropRef.current, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, 0.1);
  };

  const startProject = () =>
    close(() => {
      if (lenis) lenis.scrollTo("#start-a-project");
      else document.getElementById("start-a-project")?.scrollIntoView({ behavior: "smooth" });
    });

  const zoomBy = (factor: number) => {
    setPlaying(false);
    camera.zoomAt(camera.goal.z * factor, 50, 50);
  };

  const resetView = () => camera.to(frameOf(current.frame, plan), 0.8);

  /** Pan with one pointer, pinch with two; both measured from where the gesture started. */
  const startGesture = (stage: HTMLElement) => {
    const points = [...pointersRef.current.values()];
    if (!points.length) {
      gestureRef.current = null;
      return;
    }
    const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    const d = points.length > 1 ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : 0;
    gestureRef.current = { x, y, d, cam: { ...camera.now }, rect: stage.getBoundingClientRect() };
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as Element).closest("button")) return;
    const stage = event.currentTarget;
    stage.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    tapRef.current = {
      t: tapRef.current?.t ?? 0,
      x: tapRef.current?.x ?? 0,
      y: tapRef.current?.y ?? 0,
      down: event.timeStamp,
      moved: pointersRef.current.size > 1,
    };
    if (tapRef.current.moved) grab(stage);
    else startGesture(stage);
  };

  const grab = (stage: HTMLElement) => {
    camera.kill();
    camera.hold(true);
    setPlaying(false);
    stage.classList.add("is-dragging");
    startGesture(stage);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const stage = event.currentTarget;
    const rect = gestureRef.current?.rect ?? stage.getBoundingClientRect();
    if (coordsRef.current) {
      const { now } = camera;
      const px = ((event.clientX - rect.left) / rect.width) * 100;
      const py = ((event.clientY - rect.top) / rect.height) * 100;
      coordsRef.current.textContent = `X ${((px - now.x) / now.z).toFixed(1)}  Y ${((py - now.y) / now.z).toFixed(1)}`;
    }

    const pointer = pointersRef.current.get(event.pointerId);
    const gesture = gestureRef.current;
    if (!pointer || !gesture) return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;

    const points = [...pointersRef.current.values()];
    const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    const d = points.length > 1 ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : 0;
    const tap = tapRef.current;
    if (tap && !tap.moved) {
      if (Math.hypot(x - gesture.x, y - gesture.y) < 8) return;
      tap.moved = true;
      if (camera.now.z > 1.01) grab(stage);
      return;
    }

    const z = gesture.d && d ? gsap.utils.clamp(1, MAX_ZOOM, (gesture.cam.z * d) / gesture.d) : gesture.cam.z;
    if (z <= 1.01 && gesture.cam.z <= 1.01) return;

    // Keep the canvas point that started under the fingers under them as they move.
    const sx = ((gesture.x - rect.left) / rect.width) * 100;
    const sy = ((gesture.y - rect.top) / rect.height) * 100;
    const cx = (sx - gesture.cam.x) / gesture.cam.z;
    const cy = (sy - gesture.cam.y) / gesture.cam.z;
    camera.set({
      z,
      x: sx + ((x - gesture.x) / rect.width) * 100 - cx * z,
      y: sy + ((y - gesture.y) / rect.height) * 100 - cy * z,
    });
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.delete(event.pointerId)) return;
    const stage = event.currentTarget;
    startGesture(stage);
    if (pointersRef.current.size) return;

    if (stage.classList.contains("is-dragging")) {
      stage.classList.remove("is-dragging");
      camera.hold(false);
    }

    const tap = tapRef.current;
    if (!tap || tap.moved || event.type === "pointercancel" || event.timeStamp - tap.down > 280) {
      tapRef.current = null;
      return;
    }
    const now = event.timeStamp;
    const second = now - tap.t < 320 && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) < 30;
    tapRef.current = second ? null : { t: now, x: event.clientX, y: event.clientY, down: 0, moved: false };
    if (!second) return;

    setPlaying(false);
    const rect = stage.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 100;
    const py = ((event.clientY - rect.top) / rect.height) * 100;
    if (camera.goal.z > 1.6) camera.to({ z: 1, x: 0, y: 0 }, 0.7);
    else camera.zoomAt(2.4, px, py, 0.7);
  };

  const copy = (hex: string) => {
    void navigator.clipboard?.writeText(hex).catch(() => undefined);
    setCopied(hex);
  };

  const specs: string[] = [
    [],
    [`Ratio ${(plan.L.w / plan.L.h).toFixed(2)} : 1`, "1u = ¼ symbol"],
    [`Symbol ${(plan.M.w / plan.M.h).toFixed(2)} : 1`, `R ÷ r = ${(plan.R / plan.r).toFixed(2)}`],
    ["x = ½ symbol", `Safe area ${(plan.S.w / plan.S.h).toFixed(2)} : 1`],
    swatches ? [`${swatches.length} colours sampled`] : [],
  ][step];

  return (
    <dialog
      ref={dialogRef}
      className="bc"
      aria-label={`${entry.brand.client}: how the logo is built`}
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={() => {
        // Reached only if the browser closed the dialog without our cancel handler.
        if (!dialogRef.current?.open && !closingRef.current) onClose();
      }}
      onKeyDown={(event) => {
        if (event.target instanceof HTMLButtonElement && (event.key === " " || event.key === "Enter")) return;
        if (event.key === "ArrowRight") go(index + 1);
        else if (event.key === "ArrowLeft") go(index - 1);
        else if (event.key === "+" || event.key === "=") zoomBy(1.4);
        else if (event.key === "-") zoomBy(1 / 1.4);
        else if (event.key === "0") resetView();
        else if (/^[1-5]$/.test(event.key)) pickStep(Number(event.key) - 1);
      }}
    >
      <div ref={backdropRef} className="bc-backdrop" onClick={() => close()} aria-hidden />

      <div ref={shellRef} className={guide ? "bc-shell has-guide" : "bc-shell"}>
        {guide ? (
          <BrandArrow
            key={`${entry.src}:${step}`}
            shellRef={shellRef}
            stageRef={stageRef}
            logo={entry.brand.logo}
            guide={guide}
            step={step}
            reduced={reduced}
          />
        ) : null}
        <div className="bc-mhead" aria-hidden>
          <span>
            {pad2(index + 1)} / {pad2(entries.length)}
          </span>
          <strong key={entry.src}>{entry.brand.client}</strong>
        </div>

        <div
          ref={stageRef}
          className="bc-stage"
          data-blueprint={current.blueprint ? "" : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div ref={canvasRef} className="bc-canvas">
            <div className="bc-photo">
              <Image
                key={entry.src}
                src={entry.src}
                alt={entry.alt}
                fill
                unoptimized
                priority
                draggable={false}
                onLoad={revealShutter}
              />
            </div>
            <span className="bc-tint" aria-hidden />
            <span className="bc-paper" aria-hidden />
            <Blueprint plan={plan} />
            <div className="bc-tags" aria-hidden>
              {labels.map((label, i) => (
                <span
                  key={i}
                  className="bc-label"
                  data-layer={label.layer}
                  style={{
                    left: `${gsap.utils.clamp(4, 96, label.x)}%`,
                    top: `${gsap.utils.clamp(3, 97, (label.y / VB_H) * 100)}%`,
                  }}
                >
                  <span>{label.text}</span>
                </span>
              ))}
              {swatches?.slice(1).map((swatch, i) => (
                <span
                  key={`${entry.src}${swatch.hex}`}
                  className={i % 2 ? "bc-pin is-below" : "bc-pin"}
                  data-layer="colour"
                  style={{ left: `${swatch.x}%`, top: `${swatch.y}%`, "--c": swatch.hex } as CSSProperties}
                >
                  <span>
                    <span className="bc-pin-dot" />
                    <span className="bc-pin-tag">{swatch.hex}</span>
                  </span>
                </span>
              ))}
            </div>
          </div>

          {current.blueprint ? <span key={`${index}-${step}`} className="bc-scan" aria-hidden /> : null}
          <div ref={shutterRef} className="bc-shutter" aria-hidden>
            <span>RMW · Brand Lab</span>
          </div>

          <span className="bc-corner is-tl" aria-hidden />
          <span className="bc-corner is-tr" aria-hidden />
          <span className="bc-corner is-bl" aria-hidden />
          <span className="bc-corner is-br" aria-hidden />

          <div className="bc-hud" aria-hidden>
            <span className="is-fig">
              Fig. {pad2(step + 1)} · {current.label}
            </span>
            <span ref={zoomRef}>100%</span>
          </div>
          <div className="bc-tools">
            <button type="button" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.4)}>
              −
            </button>
            <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1.4)}>
              +
            </button>
            <button type="button" aria-label="Reset view" onClick={resetView}>
              ⤢
            </button>
          </div>
          <span ref={coordsRef} className="bc-coords" aria-hidden>
            X 0.0 Y 0.0
          </span>
        </div>

        <aside className="bc-panel" data-lenis-prevent>
          <header data-bc-in>
            <p className="bc-kicker">
              <b>Brand Identity</b>
              <span>
                {pad2(index + 1)} / {pad2(entries.length)}
              </span>
            </p>
            <h2 key={entry.src} className="bc-title">
              {entry.brand.client}
            </h2>
            <p className="bc-sub">
              {guide
                ? "How the logo was designed, from the first idea to the final palette. Watch its style guide being written out."
                : "How the logo is built, layer by layer. Scroll or pinch the viewport to zoom in."}
            </p>
          </header>

          {guide ? (
            <div data-bc-in>
              <BrandSheet
                key={entry.src}
                guide={guide}
                client={entry.brand.client}
                step={step}
                seconds={(step === 0 ? STEP_MS * 0.6 : STEP_MS) / 1000}
                reduced={reduced}
              />
            </div>
          ) : null}

          <div data-bc-in className={autoplay ? "bc-anatomy is-playing" : "bc-anatomy"}>
            <div className="bc-anatomy-head">
              <span>Anatomy</span>
              <button type="button" className="bc-play" onClick={togglePlay} aria-pressed={autoplay}>
                {autoplay ? "❚❚ Pause" : "▶ Play breakdown"}
              </button>
            </div>
            <ol ref={stepsRef} className="bc-steps">
              {STEPS.map((item, i) => (
                <li
                  key={item.label}
                  className={i === step ? "bc-step is-active" : "bc-step"}
                  style={{ "--bc-dur": `${i === 0 ? STEP_MS * 0.6 : STEP_MS}ms` } as CSSProperties}
                >
                  <button type="button" onClick={() => pickStep(i)} aria-pressed={i === step}>
                    <span className="bc-step-no">{pad2(i + 1)}</span>
                    <span className="bc-step-label">{item.label}</span>
                    <span className="bc-step-body">
                      <span>
                        <span className="bc-step-copy">{item.copy}</span>
                        {i === step && specs.length ? (
                          <span className="bc-chips">
                            {specs.map((spec) => (
                              <span key={spec}>{spec}</span>
                            ))}
                          </span>
                        ) : null}
                      </span>
                    </span>
                    <span className="bc-step-bar" aria-hidden />
                  </button>
                </li>
              ))}
            </ol>
            <div key={step} className="bc-step-detail">
              <span className="bc-step-copy">{current.copy}</span>
              {specs.length ? (
                <span className="bc-chips">
                  {specs.map((spec) => (
                    <span key={spec}>{spec}</span>
                  ))}
                </span>
              ) : null}
            </div>
          </div>

          <div data-bc-in hidden={!!guide} className={step === 4 ? "bc-palette is-lit" : "bc-palette"}>
            <div className="bc-anatomy-head">
              <span>Palette</span>
              <span>{copied ? `Copied ${copied}` : "Tap to copy"}</span>
            </div>
            <ul className="bc-swatches">
              {(swatches ?? Array.from({ length: 4 }, () => null)).map((swatch, i) => (
                <li key={swatch ? `${entry.src}${swatch.hex}` : `ph${i}`} style={{ "--i": i } as CSSProperties}>
                  {swatch ? (
                    <button
                      type="button"
                      className="bc-swatch"
                      onClick={() => copy(swatch.hex)}
                      aria-label={`Copy colour ${swatch.hex}`}
                    >
                      <span className="bc-swatch-chip" style={{ background: swatch.hex }} />
                      <span className="bc-swatch-meta">
                        {swatch.hex}
                        <small>{i === 0 ? "Ground" : `Tone ${pad2(i)}`}</small>
                      </span>
                    </button>
                  ) : (
                    <span className="bc-swatch is-loading" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <ul data-bc-in className="bc-thumbs" aria-label="All brand identities">
            {entries.map((item, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={i === index ? "bc-thumb is-active" : "bc-thumb"}
                  aria-label={`Show ${item.brand.client}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => go(i)}
                >
                  <Image src={item.src} alt="" fill sizes="64px" />
                </button>
              </li>
            ))}
          </ul>

          <div data-bc-in className="bc-foot">
            <button type="button" className="bc-cta" onClick={startProject}>
              Start your brand <span aria-hidden>→</span>
            </button>
            <div className="bc-nav">
              <button type="button" className="bc-round" aria-label="Previous logo" onClick={() => go(index - 1)}>
                ←
              </button>
              <button type="button" className="bc-round" aria-label="Next logo" onClick={() => go(index + 1)}>
                →
              </button>
            </div>
          </div>
        </aside>
      </div>

      <button type="button" className="bc-round bc-close" aria-label="Close" onClick={() => close()}>
        ×
      </button>
    </dialog>
  );
}
