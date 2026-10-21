"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

registerGsap();

// const STOPS = [
//   { when: "Aug 2008", detail: "Founds Ritz Media World in Delhi NCR" },
//   { when: "2008", detail: "Founds Creative Thinks Media" },
//   { when: "2024 & 2025", detail: "Named Best Creative Agency (Real Estate) by Big FM" },
//   { when: "Today", detail: "Leads RMW across strategy, creative, media and AI" },
// ] as const;

type Founder = {
  portrait: string;
  alt: string;
  kicker: string;
  title: [string, string];
  role: string;
  lede: string;
};

const FOUNDERS: Founder[] = [
  {
    portrait: "/about/founder-portrait.png",
    alt: "Ritz Malik, founder of Ritz Media World since 2008",
    kicker: "Founder details & journey",
    title: ["The visionary", "behind the wheel"],
    role: "Ritz Malik · Founder & Promoter, Ritz Media World And Creative Thinks Media",
    lede: "Mr. Ritz Malik founded Ritz Media World in August 2008 with a simple belief: brands deserve ideas built on insight, not assumption. For 18 years, he has shaped the agency's vision and creative direction, growing it into a full-service creative, digital, and media partner, and he also founded Creative Thinks Media. He believes brands win through clear, authentic storytelling.",
  },
  {
    portrait: "/about/cofounder-portrait.png",
    alt: "Satvinder Kaur, co-founder of Ritz Media World",
    kicker: "Co-founder details & journey",
    title: ["The strength", "behind the studio"],
    role: "Satvinder Kaur · Co-Founder, Ritz Media World",
    lede: "Ms. Satvinder Kaur has co-led Ritz Media World since its earliest days, building it into a place where people do their best work. For 18 years, she has looked after the agency's people, its clients and its day-to-day running, making sure every promise becomes delivered work. She believes great work is built on trust, care and consistency.",
  },
];

/** The pinned hand-off needs room for the portrait beside the copy. */
const STAGE_QUERY = "(min-width: 861px) and (min-height: 600px)";
const CLIP_BELOW = "inset(100% 0% 0% 0%)";
const CLIP_OPEN = "inset(0% 0% 0% 0%)";

type Dot = { x: number; y: number; sx: number; sy: number; delay: number; r: number; color: string };

/** Samples the portrait into a grid of coloured dots, each starting from a scattered position. */
function samplePortrait(img: HTMLImageElement, width: number, height: number) {
  const step = Math.max(4, width / 62);
  const sampleW = Math.max(1, Math.round(width / step));
  const sampleH = Math.max(1, Math.round(height / step));
  const sample = document.createElement("canvas");
  sample.width = sampleW;
  sample.height = sampleH;
  const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
  if (!sampleCtx) return [];

  sampleCtx.drawImage(img, 0, 0, sampleW, sampleH);
  const pixels = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
  const dots: Dot[] = [];
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.hypot(cx, cy) || 1;
  const inset = 6;
  for (let row = 0; row < sampleH; row++) {
    for (let col = 0; col < sampleW; col++) {
      const index = (row * sampleW + col) * 4;
      if (pixels[index + 3] < 24) continue;
      const x = (col + 0.5) * (width / sampleW);
      const y = (row + 0.5) * (height / sampleH);
      dots.push({
        x,
        y,
        sx: Math.min(width - inset, Math.max(inset, x + (Math.random() - 0.5) * width * 0.62)),
        sy: Math.min(height - inset, Math.max(inset, y + (Math.random() - 0.5) * height * 0.62)),
        delay: (Math.hypot(x - cx, y - cy) / maxDist) * 0.4,
        r: (width / sampleW) * 0.48,
        color: `rgb(${pixels[index]},${pixels[index + 1]},${pixels[index + 2]})`,
      });
    }
  }
  return dots;
}

/** Returns a painter for the portrait's dot canvas; 0 is fully scattered, 1 is fully assembled. */
function rigDots(person: HTMLElement) {
  const card = person.querySelector<HTMLElement>(".about-founder-card");
  const img = person.querySelector<HTMLImageElement>(".about-founder-portrait");
  const canvas = person.querySelector<HTMLCanvasElement>(".about-founder-assemble");
  const ctx = canvas?.getContext("2d");
  let dots: Dot[] = [];
  let sized = "";
  let width = 0;
  let height = 0;
  let dpr = 1;

  const prepare = () => {
    if (!card || !img || !canvas || !img.complete || !img.naturalWidth) return false;
    const key = `${card.clientWidth}x${card.clientHeight}`;
    if (key === sized) return dots.length > 0;
    width = card.clientWidth;
    height = card.clientHeight;
    if (!width || !height) return false;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    dots = samplePortrait(img, width, height);
    sized = key;
    return dots.length > 0;
  };

  return (progress: number) => {
    if (!ctx || !prepare()) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    for (const dot of dots) {
      const local = Math.min(1, Math.max(0, (progress - dot.delay) / (1 - dot.delay)));
      const eased = 1 - (1 - local) ** 3;
      ctx.globalAlpha = 0.72 + 0.28 * eased;
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(
        dot.sx + (dot.x - dot.sx) * eased,
        dot.sy + (dot.y - dot.sy) * eased,
        dot.r * (0.55 + 0.45 * eased),
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

function partsOf(person: HTMLElement) {
  const q = gsap.utils.selector(person);
  return {
    card: q(".about-founder-card"),
    img: q(".about-founder-portrait"),
    canvas: q(".about-founder-assemble"),
    lines: q(".about-founder-line > span"),
    fades: q(".about-founder-kicker, .about-founder-role, .about-founder-lede"),
  };
}

/**
 * Portrait wipes up from the bottom while scattered dots gather into it, then the photo resolves over
 * the dots and settles from a zoom; the headline rises line by line.
 */
function reveal(tl: gsap.core.Timeline, person: HTMLElement, at = 0) {
  const { card, img, canvas, lines, fades } = partsOf(person);
  const paint = rigDots(person);
  const dots = { p: 0 };
  return tl
    .fromTo(card, { clipPath: CLIP_BELOW }, { clipPath: CLIP_OPEN, duration: 0.8, ease: "power3.inOut" }, at)
    .fromTo(
      dots,
      { p: 0 },
      { p: 1, duration: 1.7, ease: "sine.inOut", onUpdate: () => paint(dots.p), onReverseComplete: () => paint(0) },
      at,
    )
    .fromTo(img, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "none" }, at + 1.45)
    .fromTo(canvas, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4, ease: "none" }, at + 1.6)
    .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2, ease: "power2.out" }, at)
    .fromTo(lines, { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, stagger: 0.08, duration: 0.5 }, at + 0.3)
    .fromTo(fades, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.4 }, at + 0.4);
}

export function AboutFounder() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const people = Array.from(root.querySelectorAll<HTMLElement>(".about-founder-person"));
      const [first, second] = people;
      if (!first || !second) return;

      let cancelled = false;
      let match: gsap.MatchMedia | undefined;
      const refresh = () => ScrollTrigger.refresh();

      // The pinned sections above build their triggers after fonts load; ours must be measured after theirs.
      document.fonts.ready.then(() => {
        if (cancelled) return;
        match = gsap.matchMedia();
        match.add({ staged: STAGE_QUERY }, (context) => build(!!context.conditions?.staged));
        window.addEventListener("load", refresh);
      });

      const build = (staged: boolean) => {
        if (!staged) {
          people.forEach((person) =>
            reveal(
              gsap.timeline({
                defaults: { ease: "power2.out" },
                scrollTrigger: {
                  trigger: person,
                  start: "top 82%",
                  toggleActions: "play none none none",
                  refreshPriority: -1,
                },
              }),
              person,
            ),
          );
          return;
        }

        root.classList.add("is-staged");
        const stripes = root.querySelector(".about-founder-stripes");
        const track = root.querySelector(".about-founder-count-track");
        const leaving = partsOf(first);

        const enter = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: true, refreshPriority: -1 },
        });
        if (stripes) enter.fromTo(stripes, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "none" }, 0);
        reveal(enter, first, 0.1);

        const handOff = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: -1,
          },
        });
        const out = { ease: "power2.in", immediateRender: false };
        handOff
          .to({}, { duration: 0.2 })
          .fromTo(leaving.lines, { y: 0, yPercent: 0 }, { ...out, y: 0, yPercent: -115, stagger: 0.06, duration: 0.4 }, 0.2)
          .fromTo(leaving.fades, { autoAlpha: 1, y: 0 }, { ...out, autoAlpha: 0, y: -24, stagger: 0.04, duration: 0.3 }, 0.2)
          .fromTo(leaving.img, { scale: 1 }, { scale: 1.12, duration: 0.7, ease: "power3.inOut", immediateRender: false }, 0.3);
        if (track) handOff.fromTo(track, { yPercent: 0 }, { yPercent: -50, duration: 0.5, ease: "power3.inOut" }, 0.35);
        reveal(handOff, second, 0.3).to({}, { duration: 0.4 });

        const frame = requestAnimationFrame(refresh);
        return () => {
          cancelAnimationFrame(frame);
          root.classList.remove("is-staged");
        };
      };

      return () => {
        cancelled = true;
        window.removeEventListener("load", refresh);
        match?.revert();
      };
    },
    { dependencies: [ready, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="about-founder" aria-label="Our founders">
      <div className="about-founder-layout">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="about-founder-stripes"
          src="/about/founder-stripes.png"
          alt=""
          aria-hidden="true"
          width={83}
          height={754}
        />
        <p className="about-founder-count" aria-hidden="true">
          <span className="about-founder-count-roll">
            <span className="about-founder-count-track">
              <span>01</span>
              <span>02</span>
            </span>
          </span>
          <span>/ {String(FOUNDERS.length).padStart(2, "0")}</span>
        </p>
        {FOUNDERS.map((founder) => (
          <FounderFeature key={founder.portrait} founder={founder} />
        ))}
      </div>
    </section>
  );
}

function FounderFeature({ founder }: { founder: Founder }) {
  return (
    <article className="about-founder-person">
      <div className="about-founder-visual">
        <figure className="about-founder-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="about-founder-portrait" src={founder.portrait} alt={founder.alt} width={541} height={541} />
          <canvas className="about-founder-assemble" aria-hidden="true" />
        </figure>
      </div>
      <div className="about-founder-copy">
        <p className="about-founder-kicker">{founder.kicker}</p>
        <h2 className="about-founder-title">
          {founder.title.map((line) => (
            <span key={line} className="about-founder-line">
              <span>{line}</span>
            </span>
          ))}
        </h2>
        <p className="about-founder-role">{founder.role}</p>
        <p className="about-founder-lede">{founder.lede}</p>
      </div>
    </article>
  );
}
