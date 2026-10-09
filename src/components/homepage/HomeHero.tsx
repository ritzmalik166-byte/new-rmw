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

const HOLD = 4.2;
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
      const stickers = q(".hm-hero-sticker");
      const bars = q("[data-hero-bar]");
      const stage = q(".hm-hero-stage")[0] as HTMLElement | undefined;
      const rig = q(".hm-hero-rig")[0] as HTMLElement | undefined;
      const truck = q(".real-truck")[0] as HTMLElement | undefined;
      if (!stage || !rig || !truck || !heads.length) return;

      const linesOf = (i: number) => heads[i].querySelectorAll("[data-hero-line]");
      const offX = () => stage.clientWidth - rig.offsetLeft + 40;

      if (reduced) {
        gsap.set(fades, { autoAlpha: 1, y: 0 });
        heads.forEach((_, i) => gsap.set(linesOf(i), { yPercent: i === 0 ? 0 : 110 }));
        gsap.set(rig, { x: 0 });
        gsap.set(stickers, { autoAlpha: 1, scale: 1 });
        gsap.set(bars, { scaleX: 0 });
        gsap.set(bars[0], { scaleX: 1 });
        root.classList.add("is-armed");
        return;
      }

      gsap.set(fades, { autoAlpha: 0, y: 22 });
      heads.forEach((_, i) => gsap.set(linesOf(i), { yPercent: 110 }));
      gsap.set(stickers, { autoAlpha: 0, scale: 0.4 });
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
        .to(
          stickers,
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.2)", stagger: 0.14 },
          2.1,
        )
        .add(() => {
          fillBars(0);
          call = gsap.delayedCall(HOLD, next);
        }, 1);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        call?.kill();
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
          <span className="hm-hero-shadow" />
          <RealTruck className="hm-hero-truck" priority />
          <span className="hm-hero-sticker is-a">Creative services</span>
          <span className="hm-hero-sticker is-b">Digital marketing</span>
        </div>
      </div>
    </section>
  );
}
