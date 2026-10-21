"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";

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
    lede: "Mr. Ritz Malik founded Ritz Media World in August 2008 with a simple belief: brands deserve ideas that are built on insight, not assumption. Over 18 years, he has steered the agency through every major shift in Indian marketing, growing it from a creative studio into a full-service creative, digital, and media partner for brands across industries. He also founded Creative Thinks Media. Even as data and AI reshape the industry, Mr. Malik remains convinced that brands win through clear, authentic, and well-crafted storytelling.",
  },
  {
    portrait: "/about/cofounder-portrait.png",
    alt: "Satvinder Kaur, co-founder of Ritz Media World",
    kicker: "Co-founder details & journey",
    title: ["The strength", "behind the studio"],
    role: "Satvinder Kaur · Co-Founder, Ritz Media World",
    lede: "Ms. Satvinder Kaur is the name everyone at Ritz Media World knows the moment they walk into the room. Alongside Mr. Malik, she has helped build the agency from its earliest days, keeping its people, its clients, and its day-to-day work running with the same care that goes into every campaign.",
  },
];

type Dot = {
  x: number;
  y: number;
  sx: number;
  sy: number;
  delay: number;
  r: number;
  color: string;
};

function samplePortrait(img: HTMLImageElement, width: number, height: number) {
  const cols = 62;
  const step = Math.max(4, width / cols);
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
  for (let row = 0; row < sampleH; row++) {
    for (let col = 0; col < sampleW; col++) {
      const index = (row * sampleW + col) * 4;
      const alpha = pixels[index + 3];
      if (alpha < 24) continue;

      const x = (col + 0.5) * (width / sampleW);
      const y = (row + 0.5) * (height / sampleH);
      const fromCenter = Math.hypot(x - cx, y - cy) / maxDist;
      const inset = 6;
      const jitterX = (Math.random() - 0.5) * width * 0.62;
      const jitterY = (Math.random() - 0.5) * height * 0.62;

      dots.push({
        x,
        y,
        sx: Math.min(width - inset, Math.max(inset, x + jitterX)),
        sy: Math.min(height - inset, Math.max(inset, y + jitterY)),
        delay: fromCenter * 0.22,
        r: (width / sampleW) * 0.48,
        color: `rgb(${pixels[index]},${pixels[index + 1]},${pixels[index + 2]})`,
      });
    }
  }

  return dots;
}

function easeOut(value: number) {
  return 1 - (1 - value) ** 3;
}

type PortraitRig = {
  draw: (progress: number) => void;
  settle: () => void;
};

function rigPortrait(person: HTMLElement): PortraitRig | null {
  const card = person.querySelector<HTMLElement>(".about-founder-card");
  const img = person.querySelector<HTMLImageElement>(".about-founder-portrait");
  const canvas = person.querySelector<HTMLCanvasElement>(".about-founder-assemble");
  if (!card || !img || !canvas) return null;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const settle = () => {
    card.classList.add("is-settled");
    canvas.hidden = true;
  };

  const width = card.clientWidth;
  const height = card.clientHeight;
  if (!width || !height) return null;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const dots = samplePortrait(img, width, height);
  if (!dots.length) {
    settle();
    return null;
  }

  const paint = (progress: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    for (const dot of dots) {
      const span = 1 - dot.delay;
      const local = Math.min(1, Math.max(0, (progress - dot.delay) / span));
      const eased = easeOut(local);
      const x = dot.sx + (dot.x - dot.sx) * eased;
      const y = dot.sy + (dot.y - dot.sy) * eased;
      ctx.globalAlpha = 0.72 + 0.28 * eased;
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(x, y, dot.r * (0.55 + 0.45 * eased), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  };

  canvas.hidden = false;
  canvas.style.opacity = "1";
  img.style.opacity = "0";

  let played = 0;
  const draw = (progress: number) => {
    if (progress < played) return;
    played = progress;
    paint(Math.min(1, played / 0.78));
    const fade = Math.max(0, (played - 0.72) / 0.28);
    img.style.opacity = String(fade);
    img.style.visibility = fade > 0.01 ? "visible" : "hidden";
    canvas.style.opacity = String(1 - fade);
  };

  return { draw, settle };
}

export function AboutFounder() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const people = Array.from(root.querySelectorAll<HTMLElement>(".about-founder-person"));
      const imgs = people
        .map((person) => person.querySelector<HTMLImageElement>(".about-founder-portrait"))
        .filter((img): img is HTMLImageElement => !!img);

      if (reduced) {
        people.forEach((person) => {
          person.querySelector(".about-founder-card")?.classList.add("is-settled");
          const canvas = person.querySelector<HTMLCanvasElement>(".about-founder-assemble");
          if (canvas) canvas.hidden = true;
        });
        return;
      }

      let cancelled = false;
      let triggers: ScrollTrigger[] = [];
      let stopLayout = () => { };

      const play = () => {
        if (cancelled) return;
        triggers.forEach((t) => t.kill());
        triggers = [];

        const rigs = people.map(rigPortrait);
        const pin = root.offsetHeight <= window.innerHeight + 2;

        const watch = (target: HTMLElement, group: (PortraitRig | null)[]) => {
          const trigger = ScrollTrigger.create({
            trigger: target,
            start: pin ? "top top" : "top 75%",
            end: () => `+=${Math.round(window.innerHeight * (pin ? 1.45 : 0.9))}`,
            pin,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.direction < 0) return;
              group.forEach((rig) => rig?.draw(self.progress));
            },
          });
          triggers.push(trigger);
        };

        const sideBySide =
          people.length > 1 && Math.abs(people[0].offsetTop - people[1].offsetTop) < 4;

        // Side by side: both portraits assemble together; stacked (mobile): each on its own.
        if (pin || sideBySide) {
          watch(root, rigs);
        } else {
          people.forEach((person, i) => watch(person, [rigs[i]]));
        }

        const sync = () => {
          if (cancelled) return;
          triggers.forEach((trigger, i) => {
            trigger.refresh();
            if (trigger.direction < 0) return;
            const group = pin || sideBySide ? rigs : [rigs[i]];
            group.forEach((rig) => rig?.draw(trigger.progress));
          });
        };

        requestAnimationFrame(sync);
        window.addEventListener("load", sync);
        const pendingImages = Array.from(document.images).filter((image) => !image.complete);
        pendingImages.forEach((image) => image.addEventListener("load", sync, { once: true }));
        const timers = [400, 1200, 2400].map((delay) => window.setTimeout(sync, delay));

        return () => {
          window.removeEventListener("load", sync);
          pendingImages.forEach((image) => image.removeEventListener("load", sync));
          timers.forEach((timer) => window.clearTimeout(timer));
        };
      };

      const begin = () => {
        if (!imgs.every((img) => img.complete && img.naturalWidth > 0)) return;
        stopLayout();
        stopLayout = play() ?? (() => { });
      };

      begin();
      imgs.forEach((img) => img.addEventListener("load", begin));

      return () => {
        cancelled = true;
        imgs.forEach((img) => img.removeEventListener("load", begin));
        stopLayout();
        triggers.forEach((t) => t.kill());
      };
    },
    { dependencies: [ready, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="about-founder">
      <div className="about-founder-layout">
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="about-founder-stripes"
          src="/about/founder-stripes.png"
          alt="Decorative stripes"
          width={83}
          height={754}
        />
        <figure className="about-founder-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="about-founder-portrait"
            src={founder.portrait}
            alt={founder.alt}
            width={541}
            height={541}
          />
          <canvas className="about-founder-assemble" aria-hidden="true" />
        </figure>
      </div>
      <div className="about-founder-copy">
        <p className="about-founder-kicker">{founder.kicker}</p>
        <h2 className="about-founder-title">
          {founder.title[0]}
          <br />
          {founder.title[1]}
        </h2>
        <p className="about-founder-role">{founder.role}</p>
        <p className="about-founder-lede">{founder.lede}</p>
      </div>
    </article>
  );
}
