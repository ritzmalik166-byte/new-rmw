"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

const BAND = { min: 88, max: 108 };
const LABELS = [88, 92, 96, 100, 104, 108];

const STATIONS = [
  {
    freq: 91.1,
    title: "Concept Development",
    copy: "One big idea built for the ear: a hook, a format and a sound people remember after one listen.",
  },
  {
    freq: 93.5,
    title: "Scriptwriting",
    copy: "Tight 10, 20 and 30-second scripts that land the brand name early and the offer clearly.",
  },
  {
    freq: 95.0,
    title: "Voiceover Casting",
    copy: "Hindi, English and regional voices matched to your buyer, from warm and trusted to high-energy.",
  },
  {
    freq: 98.3,
    title: "Recording & Production",
    copy: "Jingles, sound design, recording and mixing, delivered to every station's specs.",
  },
  {
    freq: 102.6,
    title: "Media Planning",
    copy: "The right stations, dayparts and frequency, from the morning drive to the evening commute.",
  },
  {
    freq: 104.8,
    title: "Media Buying & Cost Negotiation",
    copy: "Spots bought across FM networks at rates we negotiate, with airing reports to prove it.",
  },
] as const;

const EQ_BARS = Array.from({ length: 16 }, (_, i) => ({
  "--eq-dur": `${0.55 + ((i * 37) % 9) * 0.07}s`,
  "--eq-delay": `${-((i * 53) % 11) * 0.09}s`,
}));

const toPct = (freq: number) => ((freq - BAND.min) / (BAND.max - BAND.min)) * 100;

const nearestStation = (freq: number) =>
  STATIONS.reduce(
    (best, station, index) =>
      Math.abs(station.freq - freq) < Math.abs(STATIONS[best].freq - freq) ? index : best,
    0,
  );

export function ServicesRadio() {
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const draggingRef = useRef(false);
  const staticTimer = useRef<number | undefined>(undefined);
  const [active, setActive] = useState(0);
  const [dragFreq, setDragFreq] = useState<number | null>(null);
  const { ready, reduced } = useMotion();

  /* On arrival the tuner scans up the band and locks onto the first station. */
  useGSAP(
    () => {
      const root = rootRef.current;
      const panel = panelRef.current;
      const needle = needleRef.current;
      if (!root || !panel || !needle || !ready || reduced) return;

      const heads = root.querySelectorAll(".svc-radio-kicker, .svc-radio-title, .svc-radio-lede");
      const cards = root.querySelectorAll(".svc-radio-card");
      const now = root.querySelector(".svc-radio-now");

      gsap.set(needle, { left: "0%" });
      gsap.set(heads, { y: 24, autoAlpha: 0 });
      gsap.set(panel, { y: 40, autoAlpha: 0 });
      gsap.set(cards, { y: 26, autoAlpha: 0 });
      gsap.set(now, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });

      tl.to(heads, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" })
        .to(panel, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" }, "-=0.45")
        .call(() => panel.classList.add("is-tuning"))
        .to(needle, { left: "64%", duration: 1.1, ease: "power1.inOut" })
        .to(needle, { left: `${toPct(STATIONS[0].freq)}%`, duration: 1, ease: "elastic.out(1, 0.6)" })
        .call(() => panel.classList.remove("is-tuning"), [], "-=0.75")
        .to(cards, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06, ease: "back.out(1.8)" }, "-=1.6")
        .to(now, { autoAlpha: 1, duration: 0.4 }, "-=0.6");
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  const flashStatic = () => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.classList.add("is-tuning");
    window.clearTimeout(staticTimer.current);
    staticTimer.current = window.setTimeout(() => panel.classList.remove("is-tuning"), 420);
  };

  function moveNeedle(freq: number, duration: number, ease: string) {
    const needle = needleRef.current;
    if (!needle) return;
    if (reduced) gsap.set(needle, { left: `${toPct(freq)}%` });
    else gsap.to(needle, { left: `${toPct(freq)}%`, duration, ease, overwrite: true });
  }

  const tune = (index: number) => {
    setActive(index);
    panelRef.current?.style.setProperty("--signal", "1");
    if (!reduced) flashStatic();
    moveNeedle(STATIONS[index].freq, 0.8, "elastic.out(1, 0.7)");
  };

  const freqAt = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    return Math.round((BAND.min + ratio * (BAND.max - BAND.min)) * 10) / 10;
  };

  const dragTo = (freq: number) => {
    const panel = panelRef.current;
    const gap = Math.abs(STATIONS[nearestStation(freq)].freq - freq);
    const signal = Math.max(0, 1 - gap / 1.4);
    panel?.style.setProperty("--signal", signal.toFixed(2));
    panel?.classList.toggle("is-tuning", signal < 0.75);
    setDragFreq(freq);
    moveNeedle(freq, 0.18, "power2.out");
  };

  const onDialDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    dragTo(freqAt(event));
  };

  const onDialMove = (event: PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) dragTo(freqAt(event));
  };

  const onDialUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragFreq(null);
    tune(nearestStation(freqAt(event)));
  };

  const onCardKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!step && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? STATIONS.length - 1
          : (index + step + STATIONS.length) % STATIONS.length;
    cardRefs.current[next]?.focus();
    tune(next);
  };

  const station = STATIONS[active];
  const shownFreq = dragFreq ?? station.freq;

  return (
    <section ref={rootRef} className="svc-radio" aria-labelledby="svc-radio-title">
      <div className="svc-radio-inner">
        <header className="svc-radio-head">
          <div>
            <p className="svc-radio-kicker">KM 08</p>
            <h2 id="svc-radio-title" className="svc-radio-title">
              Radio Advertising <br />
              Services
            </h2>
          </div>
          <p className="svc-radio-lede">
            Jingles and spots written, voiced, recorded and bought in-house, so your brand plays in
            every car and kitchen across the city.
          </p>
        </header>

        <div ref={panelRef} className="svc-radio-panel">
          <div
            className="svc-radio-dial"
            onPointerDown={onDialDown}
            onPointerMove={onDialMove}
            onPointerUp={onDialUp}
            onPointerCancel={onDialUp}
            aria-hidden
          >
            <div className="svc-radio-labels">
              {LABELS.map((label, i) => (
                <span key={label} style={{ left: `${toPct(label)}%` }}>
                  {label}
                  {i === LABELS.length - 1 ? " MHz" : ""}
                </span>
              ))}
            </div>
            <span className="svc-radio-ticks" />
            {STATIONS.map((s, i) => (
              <span
                key={s.freq}
                className={cn("svc-radio-mark", i === active && "is-active")}
                style={{ left: `${toPct(s.freq)}%` }}
              />
            ))}
            <span
              ref={needleRef}
              className="svc-radio-needle"
              style={{ left: `${toPct(STATIONS[0].freq)}%` }}
            />
          </div>

          <div className="svc-radio-cards" role="radiogroup" aria-label="Radio advertising services">
            {STATIONS.map((s, i) => (
              <button
                key={s.freq}
                ref={(node) => {
                  cardRefs.current[i] = node;
                }}
                type="button"
                role="radio"
                aria-checked={i === active}
                tabIndex={i === active ? 0 : -1}
                className={cn("svc-radio-card", i === active && "is-active")}
                onClick={() => tune(i)}
                onKeyDown={(event) => onCardKey(event, i)}
              >
                <span className="svc-radio-card-freq">{s.freq.toFixed(1)}</span>
                <span className="svc-radio-card-title">{s.title}</span>
                <span className="svc-radio-card-wave" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
              </button>
            ))}
          </div>

          <div className="svc-radio-now">
            <span className="svc-radio-onair">
              <i aria-hidden />
              On air
            </span>
            <span className="svc-radio-signal" aria-hidden>
              <i />
              <i />
              <i />
              <i />
            </span>
            <p className="svc-radio-freq" aria-hidden>
              {shownFreq.toFixed(1)}
              <small>FM</small>
            </p>
            <div className="svc-radio-now-copy" aria-live="polite">
              <p className="svc-radio-now-title">{station.title}</p>
              <p className="svc-radio-now-text">{station.copy}</p>
            </div>
            <span className="svc-radio-eq" aria-hidden>
              {EQ_BARS.map((style, i) => (
                <i key={i} style={style as CSSProperties} />
              ))}
            </span>
            <span className="svc-radio-static" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
