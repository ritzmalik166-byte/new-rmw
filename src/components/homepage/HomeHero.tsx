"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { NightSky } from "@/components/ui/NightSky";
import { type DriverPose, REAL_TRUCK, RealTruck } from "@/components/ui/RealTruck";
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
      "Idea Ka Pathaka,",
      <>
        Brand Ka <span lang="hi">धमाका</span>.
      </>,
    ],
  },
  { tone: "teal", lines: ["Soch Desi,", "Reach Videshi."] },
];

const CARGO: { name: string; tone: string }[] = [
  { name: "Digital Marketing", tone: "orange" },
  { name: "Creative Services", tone: "pink" },
  { name: "Web Development", tone: "navy" },
  { name: "Print Advertising", tone: "yellow" },
  { name: "Radio Advertising", tone: "red" },
  { name: "Content Marketing", tone: "blue" },
  { name: "Influencer Marketing", tone: "pink" },
  { name: "Celebrity Endorsements", tone: "orange" },
  { name: "3D Rendering", tone: "teal" },
  // { name: "AI Services", tone: "yellow" }, 
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

/* Far enough to clear the line mask, which has extra headroom for Devanagari matras. */
const LINE_OFF = 145;
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
      const stickers = q(".hm-hero-sticker") as HTMLElement[];
      const bars = q("[data-hero-bar]");
      const lights = q(".hm-hero-light");
      const count = q("[data-hero-count]")[0] as HTMLElement | undefined;
      const stage = q(".hm-hero-stage")[0] as HTMLElement | undefined;
      const rig = q(".hm-hero-rig")[0] as HTMLElement | undefined;
      const truck = q(".real-truck")[0] as HTMLElement | undefined;
      const cab = q(".real-truck-cab")[0] as HTMLElement | undefined;
      const driver = q(".real-truck-driver")[0] as HTMLElement | undefined;
      if (!stage || !rig || !truck || !heads.length) return;

      const linesOf = (i: number) => heads[i].querySelectorAll("[data-hero-line]");
      const slots = window.matchMedia("(max-width: 640px)").matches ? SLOTS_SMALL : SLOTS;

      const seat = (sticker: HTMLElement, slot: Slot, index: number) => {
        sticker.style.left = `${slot.x}%`;
        sticker.style.setProperty("--lift", `${slot.lift / 16}rem`);
        if (count) count.textContent = String(index + 1).padStart(2, "0");
      };

      gsap.set(stickers, { xPercent: -50, autoAlpha: 0 });
      // CSS parks the later headlines with a plain transform; hand them to GSAP.
      heads.forEach((_, i) => i > 0 && gsap.set(linesOf(i), { y: 0, yPercent: LINE_OFF }));

      if (reduced) {
        slots.forEach((slot, i) => {
          seat(stickers[i], slot, i);
          gsap.set(stickers[i], { autoAlpha: 1, rotation: slot.rot });
        });
        gsap.set(lights, { autoAlpha: 1 });
        gsap.set(bars, { scaleX: 0 });
        gsap.set(bars[0], { scaleX: 1 });
        root.classList.add("is-lit");
        return;
      }

      gsap.set(lights, { autoAlpha: 0 });
      gsap.set(bars, { scaleX: 0 });

      if (!ready) return;

      // Road and wheels share one odometer so the tyres never skid. While the
      // CSS drive-in runs, the distance it covers turns the wheels too.
      let odometer = 0;
      let arriving = rig.getAnimations().some((a) => a.playState === "running");
      const onArrive = (event: AnimationEvent) => {
        if (event.target === rig) arriving = false;
      };
      rig.addEventListener("animationend", onArrive);
      const rigOffset = () => (arriving ? parseFloat(getComputedStyle(rig).translate) || 0 : 0);
      let visible = true;
      let bob: gsap.core.Tween | undefined;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        root.classList.toggle("is-offscreen", !visible);
        if (visible) bob?.resume();
        else bob?.pause();
      });
      io.observe(root);

      const tick = (_time: number, deltaTime: number) => {
        if (!visible) return;
        const length = truck.offsetWidth;
        odometer += length * SPEED * (Math.min(deltaTime, 64) / 1000);
        const turn = ((odometer - rigOffset()) / (Math.PI * length * WHEEL_RATIO)) * 360;
        stage.style.setProperty("--road-x", `${odometer.toFixed(1)}px`);
        truck.style.setProperty("--wheel-turn", `${(turn % 360).toFixed(2)}deg`);
      };
      gsap.ticker.add(tick);

      // The driver idles with the road, blinks, and now and then glances at
      // the visitor or has a laugh.
      const driverCalls = new Set<gsap.core.Tween>();
      const later = (seconds: number, fn: () => void) => {
        const call = gsap.delayedCall(seconds, () => {
          driverCalls.delete(call);
          if (visible) fn();
          else later(1, fn);
        });
        driverCalls.add(call);
      };
      if (cab && driver) {
        const pose = (name: DriverPose) => {
          cab.dataset.pose = name;
        };
        const blink = () => {
          pose("blink");
          later(0.12, () => pose("idle"));
        };
        const act = () => {
          const roll = Math.random();
          let hold = gsap.utils.random(1.6, 3.4);
          if (roll < 0.55) {
            blink();
            if (Math.random() < 0.3) later(0.32, blink);
          } else if (roll < 0.8) {
            const glance = gsap.utils.random(1.6, 2.4);
            pose("look");
            gsap.to(driver, { rotation: -3, duration: 0.22, yoyo: true, repeat: 1, ease: "sine.inOut", delay: 0.2 });
            later(glance, () => pose("idle"));
            hold += glance;
          } else {
            pose("laugh");
            gsap.to(driver, { rotation: 2.5, duration: 0.11, yoyo: true, repeat: 7, ease: "sine.inOut" });
            later(1.5, () => pose("idle"));
            hold += 1.5;
          }
          later(hold, act);
        };
        bob = gsap.to(driver, { yPercent: 2.5, duration: 0.36, ease: "sine.inOut", yoyo: true, repeat: -1 });
        later(2.4, act);
      }

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
          yPercent: -LINE_OFF,
          duration: 0.6,
          ease: "power2.in",
          stagger: 0.06,
        });
        gsap.fromTo(
          linesOf(index),
          { yPercent: LINE_OFF },
          { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.09, delay: 0.45 },
        );
        fillBars(index);
        call = gsap.delayedCall(HOLD, next);
      };

      const intro = gsap.timeline();
      intro
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
        rig.removeEventListener("animationend", onArrive);
        io.disconnect();
        call?.kill();
        swapCall?.kill();
        gsap.killTweensOf(stickers);
        gsap.killTweensOf(lights);
        driverCalls.forEach((c) => c.kill());
        if (driver) gsap.killTweensOf(driver);
        if (cab) cab.dataset.pose = "idle";
        root.classList.remove("is-lit", "is-offscreen");
      };
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section id="home-hero" ref={rootRef} className="hm hm-hero" aria-labelledby="hm-hero-title">
      <NightSky />
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
            An independent creative advertising agency with 18 years of experience transforming brands through creativity, strategy, and innovation.

          </p>

          <div data-hero-fade className="hm-actions">
            <a href="/contact.html" target="_blank" rel="noopener noreferrer" className="hm-btn">
              Start a project <span aria-hidden>→</span>
            </a>
            <TransitionLink href="/portfolio" className="hm-btn is-ink">
              Explore our work <span aria-hidden>→</span>
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
          <RealTruck
            className="hm-hero-truck"
            priority
            driver
            sizes="(max-width: 1099px) min(90vw, 700px, 50vh), clamp(360px, min(42vw, 74vh), 640px)"
          />
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
