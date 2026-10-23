"use client";

import { useGSAP } from "@gsap/react";
import { Fragment, useRef } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, SplitText } from "@/lib/gsap";

registerGsap();

const TITLE = [
  "18 Years of Building Distinctive Brands as a Creative Advertising Agency",
] as const;

export function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const title = titleRef.current;
      const lede = ledeRef.current;
      if (!root || !title || !lede || !ready) return;

      const kickerBits = root.querySelectorAll(".about-kicker-item");
      const buttons = root.querySelectorAll(".about-btn");
      const sheen = root.querySelector(".about-sheen");

      if (reduced) {
        gsap.set([title, lede, kickerBits, buttons], { autoAlpha: 1, y: 0, clearProps: "opacity" });
        if (sheen) gsap.set(sheen, { autoAlpha: 0 });
        return;
      }

      const splits: SplitText[] = [];
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled || !titleRef.current || !ledeRef.current) return;

        const inners = titleRef.current.querySelectorAll<HTMLElement>(".about-line-inner");
        inners.forEach((el) => {
          splits.push(
            new SplitText(el, {
              type: "words,chars",
              wordsClass: "about-title-word",
              charsClass: "about-char",
            })
          );
        });
        const wordSplit = new SplitText(ledeRef.current, {
          type: "words",
          wordsClass: "about-word",
        });
        splits.push(wordSplit);

        const chars = splits.flatMap((split) => split.chars);

        gsap.set(titleRef.current, { autoAlpha: 1 });
        gsap.set(ledeRef.current, { autoAlpha: 1 });
        gsap.set(chars, {
          yPercent: 125,
          rotateX: -72,
          opacity: 0,
          transformOrigin: "50% 110%",
        });
        gsap.set(wordSplit.words, { y: 22, opacity: 0, filter: "blur(6px)" });
        gsap.set(kickerBits, { y: 16, autoAlpha: 0 });
        gsap.set(buttons, { y: 22, autoAlpha: 0 });
        if (sheen) gsap.set(sheen, { backgroundPosition: "130% 0", autoAlpha: 1 });

        const tl = gsap.timeline();

        tl.to(kickerBits, {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.07,
          ease: "power3.out",
        });

        tl.to(
          chars,
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            stagger: { each: 0.026, from: "start" },
          },
          0.08,
        );

        if (sheen) {
          tl.to(
            sheen,
            {
              backgroundPosition: "-40% 0",
              duration: 1.15,
              ease: "power2.inOut",
            },
            0.62,
          );
          tl.to(sheen, { autoAlpha: 0, duration: 0.35, ease: "power1.out" }, ">-0.2");
        }

        tl.to(
          wordSplit.words,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.011,
          },
          0.48,
        );

        tl.to(
          buttons,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
          },
          0.78,
        );

        tl.add(() => {
          gsap.set(buttons, { clearProps: "transform" });
          gsap.set(wordSplit.words, { clearProps: "filter" });
        });
      });

      return () => {
        cancelled = true;
        splits.forEach((split) => split.revert());
      };
    },
    { dependencies: [ready, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="about-hero">
      <div className="about-hero-main">
        <nav className="hm sd-crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <TransitionLink href="/">Home</TransitionLink>
            </li>
            <li aria-current="page">About</li>
          </ol>
        </nav>

        <p className="about-kicker">
          <span className="about-kicker-item about-pill">About us</span>
          <span className="about-kicker-item about-kicker-hindi">हमारी कहानी</span>
          <span className="about-kicker-item about-kicker-dot" aria-hidden />
          <span className="about-kicker-item about-kicker-story">Our story</span>
        </p>

        <div className="about-title-wrap">
          <h1 ref={titleRef} className="about-title">
            {TITLE.map((line, index) => (
              <Fragment key={line}>
                {index > 0 ? " " : null}
                <span className="about-line">
                  <span className="about-line-mask">
                    <span className="about-line-inner">{line}</span>
                  </span>
                </span>
              </Fragment>
            ))}
          </h1>
          <span className="about-sheen" aria-hidden>
            {TITLE.map((line) => (
              <span key={line} className="about-line">
                {line}
              </span>
            ))}
          </span>
        </div>

        <p ref={ledeRef} className="about-lede">
          Founded in 2008, Ritz Media World is a full-service agency headquartered in Noida, Delhi NCR, working with
          brands across India. We turn business problems into ideas that travel, delivering brand strategy, advertising
          campaigns, media planning, digital marketing, film production, 3D rendering, and AI solutions. Our work spans
          real estate, education, e-commerce, manufacturing, and startups.
        </p>

        <div className="about-actions">
          <TransitionLink href="/portfolio" className="about-btn about-btn-hot">
            <DashFrame />
            <span>Explore our work</span>
          </TransitionLink>
          <TransitionLink href="/services" className="about-btn about-btn-ink">
            <DashFrame />
            <span>Explore our services</span>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}

function DashFrame() {
  return (
    <svg className="about-btn-frame" aria-hidden>
      <rect />
    </svg>
  );
}
