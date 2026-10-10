"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Dark mode inverts the page, so surfaces that are already dark, strongly coloured
   or photographic are tagged here and flipped back to their real paint. */
const KEEP_ATTR = "data-theme-keep";
const MIN_AREA = 18_000;
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "svg", "IMG", "VIDEO", "CANVAS", "IFRAME"]);
const URL_RE = /url\([^)]*\)/gi;
const COLOR_RE = /(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([^()]*\)|#[0-9a-f]{3,8}\b/gi;

type Rgba = [number, number, number, number];

const colorCache = new Map<string, Rgba>();
let probe: CanvasRenderingContext2D | null = null;

function toRgba(color: string): Rgba {
  const cached = colorCache.get(color);
  if (cached) return cached;
  probe ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  let rgba: Rgba = [0, 0, 0, 0];
  if (probe) {
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "rgba(0,0,0,0)";
    probe.fillStyle = color;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data;
    rgba = [r, g, b, a / 255];
  }
  colorCache.set(color, rgba);
  return rgba;
}

/* True when a colour should survive dark mode untouched: deep tones and saturated brand fields. */
function keepsColour([r, g, b, a]: Rgba) {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const light = (max + min) / 2;
  const sat = max === min ? 0 : (max - min) / (1 - Math.abs(2 * light - 1));
  if (light < 0.3) return a >= 0.2;
  return a >= 0.6 && sat > 0.35 && light < 0.8;
}

function wantsKeep(style: CSSStyleDeclaration) {
  const image = style.backgroundImage;
  if (image !== "none" && style.backgroundClip !== "text") {
    const urls = image.match(URL_RE) ?? [];
    if (urls.some((url) => !/svg/i.test(url))) return true;
    const stops = image.replace(URL_RE, "").match(COLOR_RE);
    if (stops?.length) {
      const sum = stops.map(toRgba).reduce((acc, c) => acc.map((v, i) => v + c[i]) as Rgba, [0, 0, 0, 0]);
      if (keepsColour(sum.map((v) => v / stops.length) as Rgba)) return true;
    }
  }
  return keepsColour(toRgba(style.backgroundColor));
}

function scan() {
  const keep = new Set<Element>();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      const el = node as Element;
      if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT;
      const box = el.getBoundingClientRect();
      if (box.width * box.height < MIN_AREA) return NodeFilter.FILTER_SKIP;
      const style = getComputedStyle(el);
      if (style.display === "contents") return NodeFilter.FILTER_SKIP;
      if (wantsKeep(style) && !el.querySelector(".pin-spacer")) {
        keep.add(el);
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });
  while (walker.nextNode());

  document.querySelectorAll(`[${KEEP_ATTR}]`).forEach((el) => {
    if (!keep.has(el)) el.removeAttribute(KEEP_ATTR);
  });
  keep.forEach((el) => el.setAttribute(KEEP_ATTR, ""));
}

export function ThemeSurfaces() {
  const pathname = usePathname();

  useEffect(() => {
    let timer = 0;
    const schedule = (delay = 250) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(scan, delay);
    };

    schedule(0);
    const observer = new MutationObserver(() => schedule());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    const onResize = () => schedule(400);
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  return null;
}
