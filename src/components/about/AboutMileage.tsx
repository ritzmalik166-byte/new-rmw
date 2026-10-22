"use client";

import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, ScrollTrigger, SplitText } from "@/lib/gsap";

registerGsap();

const STATS = [
  { count: 500, label: ["Projects", "launched"], icon: "rocket" },
  { count: 300, label: ["Brands", "worked with"], icon: "people" },
  { count: 18, label: ["Years of", "market experience"], icon: "chart" },
] as const;

const ERAS = [
  {
    name: "Print",
    short: "Print",
    line: "Broadsheets, inserts and magazine spreads.",
    src: "/about/mile/print.jpg",
    alt: "A stack of vintage newspapers and a magazine on a wooden desk",
  },
  {
    name: "Radio & TV",
    short: "Radio/TV",
    line: "Jingles, spots and prime-time slots.",
    src: "/about/mile/broadcast.jpg",
    alt: "A vintage transistor radio beside an old television set",
  },
  {
    name: "Search",
    short: "Search",
    line: "Intent became the brief.",
    src: "/about/mile/search.jpg",
    alt: "A laptop showing an empty search bar on a desk at night",
  },
  {
    name: "Social Media",
    short: "Social",
    line: "Brands started talking back.",
    src: "/about/mile/social.jpg",
    alt: "A hand holding a smartphone with a social feed on a city street",
  },
  {
    name: "Performance Marketing",
    short: "Performance",
    line: "Every rupee tracked to a result.",
    src: "/about/mile/performance.jpg",
    alt: "A laptop showing a marketing dashboard with a rising chart",
  },
  {
    name: "AI",
    short: "AI",
    line: "Sharper insight, faster creative, people at the wheel.",
    src: "/about/mile/ai.jpg",
    alt: "A person looking at a glowing neural network over a night skyline",
  },
] as const;

const REST = [
  { rotate: -3, x: -10 },
  { rotate: 2.5, x: 8 },
  { rotate: -1.5, x: -6 },
  { rotate: 3, x: 10 },
  { rotate: -2, x: -4 },
  { rotate: 0.5, x: 0 },
] as const;

const YEARS = 18;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const PIN_QUERY = "(min-width: 901px) and (min-height: 680px)";
const AUTOPLAY_MS = 2600;
const AUTOPLAY_HOLD_MS = 4200;
const pad = (n: number) => String(n).padStart(2, "0");

const cardState = (index: number, era: number) => {
  const rotate = REST[index].rotate;
  if (index === era) return { yPercent: 0, scale: 1, rotate, autoAlpha: 1 };
  if (index === era - 1) return { yPercent: -7, scale: 0.9, rotate, autoAlpha: 1 };
  if (index < era) return { yPercent: -12, scale: 0.9, rotate, autoAlpha: 0 };
  return { yPercent: 125, scale: 1, rotate: index % 2 ? 12 : -12, autoAlpha: 0 };
};

const setOdometer = (tens: HTMLElement, ones: HTMLElement, value: number) => {
  const onesPos = value % 10;
  const tensPos = Math.floor(value / 10) + Math.max(0, onesPos - 9);
  ones.style.setProperty("--pos", String(onesPos));
  tens.style.setProperty("--pos", String(tensPos));
};

export function AboutMileage() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const splits: SplitText[] = [];
      const animations: gsap.core.Animation[] = [];
      let match: gsap.MatchMedia | null = null;
      let cancelled = false;

      const tens = root.querySelector<HTMLElement>(".about-mile-reel.is-tens");
      const ones = root.querySelector<HTMLElement>(".about-mile-reel.is-ones");
      const rollTo = (value: number) => {
        if (tens && ones) setOdometer(tens, ones, value);
      };

      const paintCount = (el: HTMLElement, value: number) => {
        el.textContent = `${value}+`;
      };

      document.fonts.ready.then(() => {
        if (cancelled) return;

        const kicker = root.querySelector<HTMLElement>(".about-mile-kicker");
        const title = root.querySelector<HTMLElement>(".about-mile-title");
        const ledes = root.querySelectorAll<HTMLElement>(".about-mile-lede");
        const counts = root.querySelectorAll<HTMLElement>("[data-count]");
        const stats = root.querySelectorAll<HTMLElement>(".about-mile-stat");
        if (!kicker || !title) return;

        const finals = () => {
          counts.forEach((el) => paintCount(el, Number(el.dataset.count)));
          rollTo(YEARS);
        };

        if (reduced) {
          finals();
          gsap.set([kicker, title, ledes, stats], { autoAlpha: 1 });
        } else {
          const kickerSplit = new SplitText(kicker, { type: "chars", charsClass: "about-mile-char" });
          const titleSplit = new SplitText(title, {
            type: "lines,words,chars",
            linesClass: "about-mile-line",
            wordsClass: "about-mile-word",
            charsClass: "about-mile-char",
          });
          const ledeSplits = Array.from(ledes, (el) => new SplitText(el, { type: "words", wordsClass: "about-mile-word" }));
          splits.push(kickerSplit, titleSplit, ...ledeSplits);
          const ledeWords = ledeSplits.flatMap((split) => split.words);

          gsap.set([kicker, title, ledes], { autoAlpha: 1 });
          gsap.set(kickerSplit.chars, { yPercent: 120, opacity: 0 });
          gsap.set(titleSplit.chars, { yPercent: 115, opacity: 0 });
          gsap.set(ledeWords, { y: 18, opacity: 0 });
          gsap.set(stats, { y: 22, autoAlpha: 0 });
          counts.forEach((el) => paintCount(el, 0));

          const intro = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: root, start: "top 75%", once: true },
          });
          animations.push(intro);

          intro.to(kickerSplit.chars, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.025 }, 0);
          intro.to(titleSplit.chars, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.018, ease: "power3.out" }, 0.1);
          intro.to(ledeWords, { y: 0, opacity: 1, duration: 0.5, stagger: 0.006 }, 0.35);
          intro.to(stats, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.1 }, 0.6);
          counts.forEach((el, index) => {
            const proxy = { value: 0 };
            const target = Number(el.dataset.count);
            intro.to(
              proxy,
              {
                value: target,
                duration: 1.4,
                onUpdate: () => paintCount(el, Math.round(proxy.value)),
                onComplete: () => paintCount(el, target),
              },
              0.7 + index * 0.12,
            );
          });
        }

        match = gsap.matchMedia();
        match.add({ pin: PIN_QUERY, auto: `not all and ${PIN_QUERY}` }, (context) => {
          const pinned = Boolean(context.conditions?.pin) && !reduced;
          const cards = gsap.utils.toArray<HTMLElement>(".about-mile-card", root);
          const photos = cards.map((card) => card.querySelector<HTMLElement>(".about-mile-photo"));
          const shades = cards.map((card) => card.querySelector<HTMLElement>(".about-mile-shade"));
          const ticks = gsap.utils.toArray<HTMLButtonElement>(".about-mile-tick", root);
          const stage = root.querySelector<HTMLElement>(".about-mile-stage");
          const fill = root.querySelector<HTMLElement>(".about-mile-track-fill");
          const eraName = root.querySelector<HTMLElement>(".about-mile-era");
          const startNote = root.querySelector<HTMLElement>(".about-mile-note.is-then");
          const nowNote = root.querySelector<HTMLElement>(".about-mile-note.is-now");
          const steps = cards.length - 1;
          const cleanups: (() => void)[] = [];

          let activeEra = -1;
          const paintEra = (era: number) => {
            if (era === activeEra) return;
            activeEra = era;
            ticks.forEach((tick, index) => {
              tick.classList.toggle("is-active", index <= era);
              tick.setAttribute("aria-pressed", String(index === era));
            });
            if (eraName) eraName.textContent = ERAS[era].name;
          };

          const onTick = (handler: (index: number) => void) => {
            ticks.forEach((tick, index) => {
              const click = () => handler(index);
              tick.addEventListener("click", click);
              cleanups.push(() => tick.removeEventListener("click", click));
            });
          };

          cards.forEach((card, index) => {
            gsap.set(card, { ...cardState(index, 0), x: REST[index].x, zIndex: index + 1 });
          });
          gsap.set(shades, { opacity: 0 });
          gsap.set(nowNote, { autoAlpha: 0, y: 12 });

          if (!pinned) {
            let current = 0;
            let visible = false;
            let hovering = false;
            let timer = 0;
            const odo = { value: 0 };

            const goTo = (era: number) => {
              const instant = reduced;
              const previous = current;
              current = era;
              cards.forEach((card, index) => {
                gsap.to(card, {
                  ...cardState(index, era),
                  duration: instant ? 0 : 0.85,
                  ease: "power3.out",
                  overwrite: "auto",
                });
                gsap.to(shades[index], { opacity: index === era - 1 ? 0.55 : 0, duration: instant ? 0 : 0.6 });
              });
              if (!instant && era > previous) {
                gsap.fromTo(photos[era], { scale: 1.3 }, { scale: 1, duration: 1.1, ease: "power2.out" });
              }
              gsap.to(odo, {
                value: (era / steps) * YEARS,
                duration: instant ? 0 : 0.9,
                ease: "power2.out",
                overwrite: "auto",
                onUpdate: () => rollTo(odo.value),
              });
              gsap.to(fill, { "--fill": era / steps, duration: instant ? 0 : 0.6, ease: "power2.out" });
              gsap.to(startNote, { autoAlpha: era === 0 ? 1 : 0, y: era === 0 ? 0 : -12, duration: instant ? 0 : 0.4 });
              gsap.to(nowNote, { autoAlpha: era === steps ? 1 : 0, y: era === steps ? 0 : 12, duration: instant ? 0 : 0.4 });
              paintEra(era);
            };

            const schedule = () => {
              window.clearTimeout(timer);
              if (reduced || !visible || hovering) return;
              timer = window.setTimeout(
                () => {
                  goTo(current === steps ? 0 : current + 1);
                  schedule();
                },
                current === steps ? AUTOPLAY_HOLD_MS : AUTOPLAY_MS,
              );
            };

            rollTo(0);
            paintEra(0);
            onTick((index) => {
              goTo(index);
              schedule();
            });

            const watch = ScrollTrigger.create({
              trigger: stage,
              start: "top 80%",
              end: "bottom 20%",
              onToggle: (self) => {
                visible = self.isActive;
                schedule();
              },
            });
            const pause = () => {
              hovering = true;
              schedule();
            };
            const resume = () => {
              hovering = false;
              schedule();
            };
            stage?.addEventListener("pointerenter", pause);
            stage?.addEventListener("pointerleave", resume);
            cleanups.push(() => {
              window.clearTimeout(timer);
              watch.kill();
              stage?.removeEventListener("pointerenter", pause);
              stage?.removeEventListener("pointerleave", resume);
            });

            if (reduced) goTo(steps);

            return () => {
              cleanups.forEach((cleanup) => cleanup());
              gsap.killTweensOf([...cards, ...photos, ...shades, fill, startNote, nowNote, odo].filter(Boolean));
              gsap.set([...cards, ...photos, ...shades, startNote, nowNote].filter(Boolean), { clearProps: "all" });
            };
          }

          root.classList.add("is-reel");

          const state = { t: 0 };
          const sync = () => {
            rollTo((state.t / steps) * YEARS);
            if (fill) fill.style.setProperty("--fill", String(state.t / steps));
            paintEra(Math.min(steps, Math.round(state.t)));
          };
          sync();

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight * 2.2)}`,
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              refreshPriority: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.to(state, { t: steps, duration: steps, onUpdate: sync }, 0);
          if (startNote) tl.to(startNote, { autoAlpha: 0, y: -12, duration: 0.5 }, 0.3);
          if (nowNote) tl.to(nowNote, { autoAlpha: 1, y: 0, duration: 0.6 }, steps - 0.6);

          for (let i = 1; i <= steps; i += 1) {
            const at = i - 1;
            tl.fromTo(
              cards[i],
              { yPercent: 125, rotate: i % 2 ? 12 : -12, autoAlpha: 0 },
              { yPercent: 0, rotate: REST[i].rotate, autoAlpha: 1, duration: 1, ease: "power2.out" },
              at,
            );
            tl.fromTo(photos[i], { scale: 1.3 }, { scale: 1, duration: 1.2, ease: "power1.out" }, at);
            tl.to(cards[i - 1], { scale: 0.9, yPercent: -7, duration: 1 }, at);
            tl.to(shades[i - 1], { opacity: 0.55, duration: 1 }, at);
            if (i >= 2) tl.to(cards[i - 2], { autoAlpha: 0, yPercent: -12, duration: 0.6 }, at);
          }
          tl.to({}, { duration: 0.4 });

          onTick((index) => {
            const trigger = tl.scrollTrigger;
            if (!trigger) return;
            const y = trigger.start + (index / tl.duration()) * (trigger.end - trigger.start) + 1;
            if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.1 });
            else window.scrollTo({ top: y, behavior: "smooth" });
          });

          return () => {
            cleanups.forEach((cleanup) => cleanup());
            root.classList.remove("is-reel");
            gsap.set([...cards, ...photos, ...shades, startNote, nowNote].filter(Boolean), { clearProps: "all" });
          };
        });
      });

      return () => {
        cancelled = true;
        match?.revert();
        animations.forEach((animation) => {
          animation.scrollTrigger?.kill();
          animation.kill();
        });
        splits.forEach((split) => split.revert());
      };
    },
    { dependencies: [ready, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="about-mile" aria-labelledby="about-mile-title">
      <div className="about-mile-grid">
        <div className="about-mile-copy">
          <p className="about-mile-kicker">Mile marker 18</p>
          <h2 id="about-mile-title" className="about-mile-title">
            What 18 Years on the Road Have Taught Us<span className="about-mile-dot" aria-hidden />
          </h2>
          <p className="about-mile-lede">
            Over the years, we have worked through launches, market slowdowns, new platforms, and changing customer
            habits. That range of experience helps us anticipate challenges early, plan budgets realistically, and
            recommend what is right for a brand rather than what is simply new. Clients benefit from a team that has
            been tested by the market and continues to learn from it.
          </p>

          <ul className="about-mile-stats">
            {STATS.map((stat) => (
              <li key={stat.icon} className="about-mile-stat">
                <StatIcon name={stat.icon} />
                <div>
                  <p className="about-mile-value" data-count={stat.count}>
                    {stat.count}+
                  </p>
                  <p className="about-mile-label">
                    {stat.label[0]}
                    <br />
                    {stat.label[1]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="about-mile-stage">
          <div className="about-mile-dash">
            <div className="about-mile-odo" role="img" aria-label={`${YEARS} years on the road`}>
              {[0, 1, 2, 3].map((n) => (
                <span key={n} className="about-mile-reel is-fixed" aria-hidden>
                  <span>0</span>
                </span>
              ))}
              {(["tens", "ones"] as const).map((place) => (
                <span
                  key={place}
                  className={`about-mile-reel is-${place}`}
                  style={{ "--pos": 0 } as React.CSSProperties}
                  aria-hidden
                >
                  <span className="about-mile-strip">
                    {DIGITS.map((digit, index) => (
                      <span key={index}>{digit}</span>
                    ))}
                  </span>
                </span>
              ))}
            </div>
            <div className="about-mile-dash-copy">
              <p className="about-mile-dash-label">Years on the road</p>
              <p className="about-mile-era" aria-hidden>
                {ERAS[0].name}
              </p>
            </div>
          </div>

          <div className="about-mile-deck-row">
            <p className="about-mile-note is-then" aria-hidden>
              <span className="about-mile-note-year">2008</span>
              Print, Radio, TV, Traditional marketing
              <NoteArrow />
            </p>

            <div className="about-mile-deck-wrap">
              <ol className="about-mile-deck">
                {ERAS.map((era, index) => (
                  <li key={era.name} className="about-mile-card">
                    <div className="about-mile-photo-wrap">
                      <Image
                        src={era.src}
                        alt={era.alt}
                        fill
                        sizes="(max-width: 900px) 78vw, 440px"
                        className="about-mile-photo"
                      />
                    </div>
                    <div className="about-mile-caption">
                      <span className="about-mile-stop">
                        {pad(index + 1)} / {pad(ERAS.length)}
                      </span>
                      <h3 className="about-mile-card-title">{era.name}</h3>
                      <p className="about-mile-card-line">{era.line}</p>
                    </div>
                    <span className="about-mile-shade" aria-hidden />
                  </li>
                ))}
              </ol>
            </div>

            <p className="about-mile-note is-now" aria-hidden>
              <span className="about-mile-note-year">Now</span>
              Search, Social media, Performance, AI
              <NoteArrow />
            </p>
          </div>

          <div className="about-mile-track" role="group" aria-label="Media eras">
            <span className="about-mile-track-fill" aria-hidden />
            {ERAS.map((era, index) => (
              <button
                key={era.name}
                type="button"
                className={index === 0 ? "about-mile-tick is-active" : "about-mile-tick"}
                aria-label={`Show ${era.name}`}
                aria-pressed={index === 0}
              >
                <span className="about-mile-tick-label">{era.short}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NoteArrow() {
  return (
    <svg className="about-mile-note-arrow" viewBox="0 0 80 40" aria-hidden>
      <path d="M4 6 C 22 34, 48 36, 72 22" />
      <path d="M62 16 L 73 22 L 63 30" />
    </svg>
  );
}

function StatIcon({ name }: { name: (typeof STATS)[number]["icon"] }) {
  return (
    <svg className="about-mile-icon" viewBox="0 0 32 32" aria-hidden>
      {name === "rocket" ? (
        <>
          <path d="M19 5c4.5 0 8 3.5 8 8-3 1-6.5 4.5-9.5 8.5l-6-6C15.5 12.5 18 9 19 5Z" />
          <circle cx="20.5" cy="11.5" r="2.2" />
          <path d="M11.5 15.5 7 15l-3 4 5 .5M16.5 20.5l.5 4.5-4 3-.5-5" />
          <path d="M9 23c-2 0-4 2-4.5 4.5C7 27 9 25 9 23Z" />
        </>
      ) : null}
      {name === "people" ? (
        <>
          <circle cx="16" cy="10" r="4" />
          <path d="M8.5 25c0-4.2 3.4-7.5 7.5-7.5s7.5 3.3 7.5 7.5" />
          <circle cx="7" cy="13" r="2.8" />
          <path d="M2.5 23.5c0-3 2-5.2 4.5-5.2 1.1 0 2.1.3 2.9.9" />
          <circle cx="25" cy="13" r="2.8" />
          <path d="M29.5 23.5c0-3-2-5.2-4.5-5.2-1.1 0-2.1.3-2.9.9" />
        </>
      ) : null}
      {name === "chart" ? (
        <>
          <path d="M4 27h24" />
          <path d="M8 27v-7M14 27v-11M20 27v-8M26 27V11" />
          <path d="M6 15l7-6 5 4 9-8" />
          <path d="M22 5h5v5" />
        </>
      ) : null}
    </svg>
  );
}
