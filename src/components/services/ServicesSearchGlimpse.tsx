"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

registerGsap();

const QUERY = "ritz media world";
const LENS_SCALE = 1.8;

export function ServicesSearchGlimpse() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const placeholder = root.querySelector<HTMLElement>(".svc-dm-search-placeholder");
      const typed = root.querySelector<HTMLElement>(".svc-dm-search-typed");
      const go = root.querySelector<HTMLElement>(".svc-dm-search-go");
      const progress = root.querySelector<HTMLElement>(".svc-dm-search-progress");
      const result = root.querySelector<HTMLElement>(".svc-dm-result");
      const body = root.querySelector<HTMLElement>(".svc-dm-result > .svc-dm-result-body");
      const lens = root.querySelector<HTMLElement>(".svc-dm-lens");
      const lensInner = root.querySelector<HTMLElement>(".svc-dm-lens-inner");
      const badge = root.querySelector<HTMLElement>(".svc-dm-search-badge");
      if (!placeholder || !typed || !go || !progress || !result || !body || !lens || !lensInner || !badge) {
        return;
      }

      let tl: gsap.core.Timeline | undefined;
      let trigger: ScrollTrigger | undefined;
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled) return;

        const radius = lens.offsetWidth / 2;
        const name = body.querySelector<HTMLElement>(".svc-dm-result-name");
        const title = body.querySelector<HTMLElement>(".svc-dm-result-title");
        if (!name || !title) return;

        const center = (el: HTMLElement, fx: number) => ({
          x: el.offsetLeft + el.offsetWidth * fx,
          y: el.offsetTop + el.offsetHeight / 2,
        });
        const path = [center(name, 0.15), center(name, 0.85), center(title, 0.2), center(title, 0.8)];

        lensInner.style.width = `${body.offsetWidth}px`;
        const lensAt = { x: path[0].x, y: path[0].y };
        const placeLens = () => {
          gsap.set(lens, { x: lensAt.x - radius, y: lensAt.y - radius });
          lensInner.style.transform = `translate(${radius - lensAt.x * LENS_SCALE}px, ${
            radius - lensAt.y * LENS_SCALE
          }px) scale(${LENS_SCALE})`;
        };
        placeLens();

        const text = { n: 0 };
        const writeQuery = () => {
          typed.textContent = QUERY.slice(0, Math.round(text.n));
        };

        tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.5 });
        tl.call(() => {
          text.n = 0;
          writeQuery();
        })
          .set(placeholder, { autoAlpha: 1 })
          .set(result, { autoAlpha: 0, y: -10, scale: 0.82, filter: "blur(8px)", transformOrigin: "50% 0%" })
          .set(lens, { autoAlpha: 0, scale: 0 })
          .set(badge, { autoAlpha: 0, y: -12, scale: 0.5, transformOrigin: "85% 0%" })
          .set(progress, { scaleX: 0, autoAlpha: 1 })
          .to(placeholder, { autoAlpha: 0, duration: 0.25 }, 0.5)
          .fromTo(
            text,
            { n: 0 },
            { n: QUERY.length, duration: 1.3, ease: "none", onUpdate: writeQuery },
            "<",
          )
          .to(go, { scale: 0.86, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }, "+=0.15")
          .to(progress, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, "<")
          .to(progress, { autoAlpha: 0, duration: 0.2 })
          .to(result, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "back.out(1.5)" }, "-=0.1")
          .to(lens, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, "+=0.1")
          .to(lensAt, {
            keyframes: path.slice(1).map((point) => ({ ...point, duration: 0.6 })),
            ease: "sine.inOut",
            onUpdate: placeLens,
          })
          .to(lens, { autoAlpha: 0, scale: 0.6, duration: 0.3 }, "+=0.15")
          .to(badge, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(2.2)" }, "-=0.15")
          .to({}, { duration: 2.2 })
          .to([result, badge], { autoAlpha: 0, y: -8, duration: 0.4, ease: "power2.in" })
          .to(text, { n: 0, duration: 0.45, ease: "none", onUpdate: writeQuery }, "<")
          .to(placeholder, { autoAlpha: 1, duration: 0.25 })
          .set([result, badge], { y: 0 })
          .call(() => {
            lensAt.x = path[0].x;
            lensAt.y = path[0].y;
            placeLens();
          });

        trigger = ScrollTrigger.create({
          trigger: root,
          start: "top 88%",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? tl?.play() : tl?.pause()),
        });
      });

      return () => {
        cancelled = true;
        trigger?.kill();
        tl?.kill();
      };
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <div ref={rootRef} className="svc-dm-search">
      <p className="sr-only">“Search karo, Hum milenge.” Searching for Ritz Media World.</p>

      <div className="svc-dm-search-bar" aria-hidden>
        <svg className="svc-dm-search-icon" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="M20.5 20.5 16 16" />
        </svg>
        <span className="svc-dm-search-field">
          <span className="svc-dm-search-placeholder">Search karo…</span>
          <span className="svc-dm-search-typed">{QUERY}</span>
          <span className="svc-dm-search-caret" />
        </span>
        <span className="svc-dm-search-go">
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
        <span className="svc-dm-search-progress" />
      </div>

      <div className="svc-dm-search-stage" aria-hidden>
        <div className="svc-dm-result">
          <ResultBody />
          <div className="svc-dm-lens">
            <div className="svc-dm-lens-inner">
              <ResultBody />
            </div>
          </div>
        </div>
        <span className="svc-dm-search-badge">
          <svg viewBox="0 0 24 24">
            <path d="m5 12 4.5 4.5L19 7" />
          </svg>
          Hum milenge.
        </span>
      </div>
    </div>
  );
}

function ResultBody() {
  return (
    <div className="svc-dm-result-body">
      <div className="svc-dm-result-site">
        <span className="svc-dm-result-favicon">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={20} height={20} />
        </span>
        <span>
          <span className="svc-dm-result-name">Ritz Media World</span>
          <span className="svc-dm-result-url">https://www.ritzmediaworld.com</span>
        </span>
      </div>
      <p className="svc-dm-result-title">Ritz Media World — Creative, Branding &amp; Digital Agency</p>
      <p className="svc-dm-result-snippet">
        Independent creative, digital and media agency in Noida since 2008. SEO, social, PPC and
        brand films under one roof.
      </p>
      <p className="svc-dm-result-links">
        <span>Services</span>
        <span>Work</span>
        <span>About</span>
        <span>Contact</span>
      </p>
    </div>
  );
}
