"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, SplitText } from "@/lib/gsap";

registerGsap();

const BANNER = "/service/services-banner-bg%201.png";
const SIGNPOST = "/service/Services%20Signpost@1x%20(1)%201.png";

const TITLE = ["Services tailored to", "transform your brand"] as const;

export function ServicesHero() {
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

      const kickerBits = root.querySelectorAll(".services-kicker-item");
      const sign = root.querySelector(".services-sign");
      const sheen = root.querySelector(".services-sheen");

      if (reduced) {
        gsap.set([title, lede, kickerBits, sign], { autoAlpha: 1, y: 0, clearProps: "opacity" });
        if (sheen) gsap.set(sheen, { autoAlpha: 0 });
        return;
      }

      const splits: SplitText[] = [];
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled || !titleRef.current || !ledeRef.current) return;

        const inners = titleRef.current.querySelectorAll<HTMLElement>(".services-line-inner");
        inners.forEach((el) => {
          splits.push(new SplitText(el, { type: "chars", charsClass: "services-char" }));
        });
        const wordSplit = new SplitText(ledeRef.current, {
          type: "words",
          wordsClass: "services-word",
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
        gsap.set(sign, { y: 28, autoAlpha: 0 });
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
            stagger: 0.04,
          },
          0.48,
        );

        tl.to(
          sign,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          0.2,
        );

        tl.add(() => {
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
    <section ref={rootRef} className="services-hero">
      <div className="services-hero-bg" aria-hidden>
        <Image src={BANNER} alt="" fill priority sizes="100vw" />
      </div>

      <div className="services-hero-main">
        <div className="services-copy">
          <p className="services-kicker">
            <span className="services-kicker-item services-pill">Services</span>
            <span className="services-kicker-item services-kicker-agency">One Agency</span>
            <span className="services-kicker-item">
              <span className="services-kicker-diamond" aria-hidden />
            </span>
            <span className="services-kicker-item services-kicker-engines">Three Engines</span>
          </p>

          <div className="services-title-wrap">
            <h1 ref={titleRef} className="services-title">
              {TITLE.map((line) => (
                <span key={line} className="services-line">
                  <span className="services-line-mask">
                    <span className="services-line-inner">{line}</span>
                  </span>
                </span>
              ))}
            </h1>
            <span className="services-sheen" aria-hidden>
              {TITLE.map((line) => (
                <span key={line} className="services-line">
                  {line}
                </span>
              ))}
            </span>
          </div>

          <p ref={ledeRef} className="services-lede">
            From Present to Prominent.
          </p>
        </div>
      </div>

      <div className="services-sign">
        <Image
          src={SIGNPOST}
          alt="Our Services: Brand and Creative, Digital and Media, Film, 3D and AI"
          width={310}
          height={440}
          priority
        />
      </div>
    </section>
  );
}
