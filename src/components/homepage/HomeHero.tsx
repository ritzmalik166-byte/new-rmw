"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { REAL_TRUCK, RealTruck } from "@/components/ui/RealTruck";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

const HEADLINES: { tone: string; lines: [ReactNode, ReactNode] }[] = [
  {
    tone: "pink",
    lines: [
      <>
        Creative <span lang="hi">ओके</span>
      </>,
      "Please.",
    ],
  },
  {
    tone: "orange",
    lines: [
      "Idea Ka Dhamaka,",
      <>
        Brand Ka <span lang="hi">पटाखा</span>.
      </>,
    ],
  },
  { tone: "teal", lines: ["Soch Desi,", "Reach Videshi."] },
];

const CARGO: { name: string; tone: string }[] = [
  { name: "Digital Marketing", tone: "orange" },
  { name: "Creative Services", tone: "pink" },
  { name: "SEO", tone: "teal" },
  { name: "Web Development", tone: "navy" },
  { name: "Print Advertising", tone: "yellow" },
  { name: "Radio Advertising", tone: "red" },
  { name: "Content Marketing", tone: "blue" },
  { name: "Influencer Marketing", tone: "pink" },
  { name: "Celebrity Endorsements", tone: "orange" },
  { name: "3D Rendering", tone: "teal" },
];

/* Where stickers sit on the cargo roof: centre (% of truck), lift above it (px), tilt. */
type Slot = { x: number; lift: number; rot: number };
const SLOTS: Slot[] = [
  { x: 40, lift: 6, rot: -6 },
  { x: 63, lift: 44, rot: 5 },
  { x: 85, lift: 8, rot: -3 },
];
const SLOTS_SMALL: Slot[] = [
  { x: 46, lift: 6, rot: -5 },
  { x: 76, lift: 38, rot: 4 },
];

const HOLD = 4.2;
const SWAP = 1.7;
const LIGHTS_ON = 3.5;
/* Road speed as a share of the truck's own length per second. */
const SPEED = 0.34;
const WHEEL_RATIO = REAL_TRUCK.wheel / REAL_TRUCK.width;

export function HomeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const heads = q(".hm-hero-head");
      const fades = q("[data-hero-fade]");
      const stickers = q(".hm-hero-sticker") as HTMLElement[];
      const bars = q("[data-hero-bar]");
      const lights = q(".hm-hero-light");
      const count = q("[data-hero-count]")[0] as HTMLElement | undefined;
      const stage = q(".hm-hero-stage")[0] as HTMLElement | undefined;
      const rig = q(".hm-hero-rig")[0] as HTMLElement | undefined;
      const truck = q(".real-truck")[0] as HTMLElement | undefined;
      if (!stage || !rig || !truck || !heads.length) return;

      const linesOf = (i: number) => heads[i].querySelectorAll("[data-hero-line]");
      const offX = () => stage.clientWidth - rig.offsetLeft + 40;
      const slots = window.matchMedia("(max-width: 640px)").matches ? SLOTS_SMALL : SLOTS;

      const seat = (sticker: HTMLElement, slot: Slot, index: number) => {
        sticker.style.left = `${slot.x}%`;
        sticker.style.setProperty("--lift", `${slot.lift}px`);
        if (count) count.textContent = String(index + 1).padStart(2, "0");
      };

      gsap.set(stickers, { xPercent: -50, autoAlpha: 0 });

      if (reduced) {
        gsap.set(fades, { autoAlpha: 1, y: 0 });
        heads.forEach((_, i) => gsap.set(linesOf(i), { yPercent: i === 0 ? 0 : 110 }));
        gsap.set(rig, { x: 0 });
        slots.forEach((slot, i) => {
          seat(stickers[i], slot, i);
          gsap.set(stickers[i], { autoAlpha: 1, rotation: slot.rot });
        });
        gsap.set(lights, { autoAlpha: 1 });
        gsap.set(bars, { scaleX: 0 });
        gsap.set(bars[0], { scaleX: 1 });
        root.classList.add("is-armed", "is-lit");
        return;
      }

      gsap.set(fades, { autoAlpha: 0, y: 22 });
      heads.forEach((_, i) => gsap.set(linesOf(i), { yPercent: 110 }));
      gsap.set(lights, { autoAlpha: 0 });
      gsap.set(bars, { scaleX: 0 });
      const startX = offX();
      gsap.set(rig, { x: startX });
      root.classList.add("is-armed");

      if (!ready) return;

      // Road and wheels share one odometer so the tyres never skid.
      let odometer = 0;
      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(root);

      const tick = (_time: number, deltaTime: number) => {
        if (!visible) return;
        const length = truck.offsetWidth;
        odometer += length * SPEED * (Math.min(deltaTime, 64) / 1000);
        const driven = startX - Number(gsap.getProperty(rig, "x"));
        const turn = ((odometer + driven) / (Math.PI * length * WHEEL_RATIO)) * 360;
        stage.style.setProperty("--road-x", `${odometer.toFixed(1)}px`);
        truck.style.setProperty("--wheel-turn", `${(turn % 360).toFixed(2)}deg`);
      };
      gsap.ticker.add(tick);

      const fillBars = (index: number) => {
        bars.forEach((bar, i) => {
          gsap.killTweensOf(bar);
          if (i < index) gsap.set(bar, { scaleX: 1 });
          else if (i > index) gsap.set(bar, { scaleX: 0 });
        });
        gsap.fromTo(bars[index], { scaleX: 0 }, { scaleX: 1, duration: HOLD, ease: "none" });
      };

      // Services ride on the roof a few at a time; the oldest is blown off the
      // back as the next one is loaded, so every service gets a turn.
      const riding: (HTMLElement | undefined)[] = slots.map(() => undefined);
      let nextCargo = 0;
      let turn = 0;
      const load = (slotIndex: number, delay = 0) => {
        const sticker = stickers[nextCargo];
        const slot = slots[slotIndex];
        const index = nextCargo;
        nextCargo = (nextCargo + 1) % stickers.length;
        riding[slotIndex] = sticker;
        gsap.killTweensOf(sticker);
        gsap.fromTo(
          sticker,
          { autoAlpha: 0, x: 0, y: -110, rotation: slot.rot - 28, scale: 0.7 },
          {
            autoAlpha: 1,
            y: 0,
            rotation: slot.rot,
            scale: 1,
            duration: 0.85,
            delay,
            ease: "back.out(1.9)",
            onStart: () => seat(sticker, slot, index),
          },
        );
      };
      const unload = (sticker: HTMLElement) => {
        gsap.killTweensOf(sticker);
        gsap.to(sticker, {
          x: () => rig.offsetWidth * 0.32,
          y: -70,
          rotation: "+=38",
          autoAlpha: 0,
          scale: 0.85,
          duration: 0.6,
          ease: "power2.in",
        });
      };
      let swapCall: gsap.core.Tween | undefined;
      const swap = () => {
        const slotIndex = turn % slots.length;
        turn += 1;
        const leaving = riding[slotIndex];
        if (leaving) unload(leaving);
        load(slotIndex, leaving ? 0.3 : 0);
        swapCall = gsap.delayedCall(SWAP, swap);
      };

      const lightsOn = () => {
        root.classList.add("is-lit");
        gsap
          .timeline()
          .to(lights, { autoAlpha: 0.9, duration: 0.06 })
          .to(lights, { autoAlpha: 0.15, duration: 0.08 })
          .to(lights, { autoAlpha: 0.75, duration: 0.05 })
          .to(lights, { autoAlpha: 0.3, duration: 0.12 })
          .to(lights, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      };

      let index = 0;
      let call: gsap.core.Tween | undefined;
      const next = () => {
        const from = index;
        index = (index + 1) % heads.length;
        gsap.to(linesOf(from), {
          yPercent: -110,
          duration: 0.6,
          ease: "power2.in",
          stagger: 0.06,
        });
        gsap.fromTo(
          linesOf(index),
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.09, delay: 0.45 },
        );
        fillBars(index);
        call = gsap.delayedCall(HOLD, next);
      };

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(linesOf(0), { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.09 }, 0.1)
        .to(fades, { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.08 }, 0.25)
        .to(rig, { x: 0, duration: 2.6, ease: "power3.out" }, 0)
        .add(() => {
          slots.forEach((_, i) => load(i, i * 0.18));
          turn = 0;
          swapCall = gsap.delayedCall(SWAP + 1.4, swap);
        }, 2)
        .add(lightsOn, LIGHTS_ON)
        .add(() => {
          fillBars(0);
          call = gsap.delayedCall(HOLD, next);
        }, 1);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        call?.kill();
        swapCall?.kill();
        gsap.killTweensOf(stickers);
        gsap.killTweensOf(lights);
        root.classList.remove("is-lit");
      };
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="hm hm-hero" aria-labelledby="hm-hero-title">
      <div className="hm-wrap hm-hero-inner">
        <div className="hm-hero-copy">
          <p data-hero-fade className="hm-kicker">
            <span className="hm-pill">On the road since 2008</span>
            <span className="hm-hindi" lang="hi">
              सवारी तैयार है
            </span>
          </p>
          <h1 id="hm-hero-title" data-hero-fade className="hm-hero-seo">
            Creative Advertising, Branding &amp; Digital Marketing Agency in India
          </h1>

          <p className="hm-hero-title">
            <span className="sr-only">Creative OK Please.</span>
            <span className="hm-hero-heads" aria-hidden>
              {HEADLINES.map((head, i) => (
                <span key={i} className="hm-hero-head" data-tone={head.tone}>
                  {head.lines.map((line, j) => (
                    <span key={j} className={j === 1 ? "hm-line is-accent" : "hm-line"}>
                      <span data-hero-line className="hm-line-inner">
                        {line}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </p>

          <p data-hero-fade className="hm-lede hm-hero-lede">
            An independent advertising agency with 18 years of experience transforming brands
            through creativity, strategy, and innovation.
          </p>

          <div data-hero-fade className="hm-actions">
            <a href="#start-a-project" className="hm-btn">
              Start a project <span aria-hidden>→</span>
            </a>
            <TransitionLink href="/work" className="hm-btn is-ink">
              See our work <span aria-hidden>→</span>
            </TransitionLink>
          </div>

          <div data-hero-fade className="hm-hero-meter" aria-hidden>
            {HEADLINES.map((head, i) => (
              <span key={head.tone} className="hm-hero-tick">
                <b>KM 0{i + 1}</b>
                <i>
                  <s data-hero-bar />
                </i>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hm-hero-stage" aria-hidden>
        <span className="hm-hero-verge" />
        <span className="hm-hero-road">
          <span className="hm-hero-lane" />
        </span>
        <div className="hm-hero-rig">
          <span className="hm-hero-light is-pool" />
          <span className="hm-hero-light is-beam" />
          <span className="hm-hero-shadow" />
          <RealTruck className="hm-hero-truck" priority />
          <span className="hm-hero-light is-lamp" />
          {CARGO.map((item) => (
            <span key={item.name} className="hm-hero-sticker" data-tone={item.tone}>
              <span className="hm-hero-sticker-face">{item.name}</span>
            </span>
          ))}
          <span className="hm-hero-manifest">
            Cargo <b data-hero-count>01</b>/{String(CARGO.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
