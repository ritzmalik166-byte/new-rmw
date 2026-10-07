"use client";

import Image from "next/image";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type CircularCarouselItem = {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  year?: string;
};

type CircularCarouselProps = {
  items: CircularCarouselItem[];
  cardWidth?: number;
  aspectRatio?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
  onChange?: (index: number) => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function CircularCarousel({
  items,
  cardWidth = 220,
  aspectRatio = 0.78,
  speed = 32,
  className = "",
  style,
  onChange,
}: CircularCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const swayRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const angleRef = useRef(0);
  const targetAngleRef = useRef<number | null>(null);
  const nextStepAtRef = useRef(0);
  const safeItems = useMemo(() => items.filter((item) => item.src), [items]);
  const angleStep = safeItems.length ? 360 / safeItems.length : 0;
  const degreesPerSecond = clamp(speed, 4, 24);
  const radius =
    safeItems.length < 3
      ? cardWidth * 1.15
      : Math.max(
          cardWidth * 1.2,
          ((cardWidth + 25) * safeItems.length) / (2 * Math.PI) * 1.15,
        );
  useEffect(() => {
    if (safeItems.length) onChange?.(activeIndex);
  }, [activeIndex, onChange, safeItems.length]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const sway = swayRef.current;
    if (!sway || safeItems.length < 2) return;

    let frame = 0;
    let previousTime = performance.now();
    let lastActiveIndex = -1;
    const stepDuration = (angleStep / degreesPerSecond) * 1000;
    nextStepAtRef.current = previousTime + stepDuration;

    const animate = (now: number) => {
      const deltaTime = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;

      if (
        !reducedMotion &&
        targetAngleRef.current === null &&
        now >= nextStepAtRef.current
      ) {
        targetAngleRef.current = angleRef.current - angleStep;
        nextStepAtRef.current = now + stepDuration;
      }

      if (targetAngleRef.current !== null) {
        const difference = targetAngleRef.current - angleRef.current;
        angleRef.current += difference * (1 - Math.exp(-6 * deltaTime));
        if (Math.abs(difference) < 0.15) {
          angleRef.current = targetAngleRef.current;
          targetAngleRef.current = null;
          nextStepAtRef.current = now + stepDuration;
        }
      } else if (!reducedMotion) {
        angleRef.current -= degreesPerSecond * deltaTime;
      }

      sway.style.transform = `rotateY(${angleRef.current}deg)`;

      const frontIndex =
        ((Math.round(-angleRef.current / angleStep) % safeItems.length) +
          safeItems.length) %
        safeItems.length;
      if (frontIndex !== lastActiveIndex) {
        lastActiveIndex = frontIndex;
        setActiveIndex(frontIndex);
      }

      const radiansPerDegree = Math.PI / 180;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const facing = Math.cos(
          (index * angleStep + angleRef.current) * radiansPerDegree,
        );
        card.style.opacity = String(0.2 + 0.8 * ((facing + 1) / 2));
      });

      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [angleStep, degreesPerSecond, reducedMotion, safeItems.length]);

  const rootStyle = {
    ...style,
    ["--circular-card-width" as string]: `min(${cardWidth}px, 39vw)`,
    ["--circular-aspect-ratio" as string]: String(aspectRatio),
    ["--circular-ring-radius" as string]: `min(${radius}px, calc((100vw - 90px) / 2))`,
  } as CSSProperties;

  const moveToItem = (index: number) => {
    if (!safeItems.length) return;

    const targetAngle = -index * angleStep;
    targetAngleRef.current =
      targetAngle +
      360 * Math.round((angleRef.current - targetAngle) / 360);
    nextStepAtRef.current = 0;
    if (reducedMotion) {
      angleRef.current = targetAngleRef.current;
      targetAngleRef.current = null;
      setActiveIndex(index);
    }
  };

  return (
    <div
      className={`circular-carousel ${className}`.trim()}
      style={rootStyle}
      role="group"
      aria-label="Company awards"
    >
      <div className="circular-carousel-shell">
        <div ref={swayRef} className="circular-carousel-sway">
          <div
            className="circular-carousel-track"
            style={{ transform: "translateY(-28px)" }}
          >
            {safeItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={`${item.year ?? "award"}-${item.title ?? index}`}
                  type="button"
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className={
                    isActive
                      ? "circular-carousel-card circular-carousel-card-active"
                      : "circular-carousel-card"
                  }
                  style={{
                    transform: `translate(-50%, -50%) rotateY(${index * angleStep}deg) translateZ(var(--circular-ring-radius))`,
                    ...(reducedMotion ? { opacity: isActive ? 1 : 0.36 } : {}),
                  }}
                  onClick={() => moveToItem(index)}
                  aria-pressed={isActive}
                  aria-label={`${item.year ? `${item.year}: ` : ""}${item.title ?? "Award"} — select award`}
                >
                  <span className="circular-carousel-card-face circular-carousel-card-front">
                    <span className="circular-carousel-card-inner">
                      <Image
                        src={item.src}
                        alt={item.alt ?? item.title ?? "Company award"}
                        fill
                        sizes="(max-width: 640px) 400px, 640px"
                        quality={95}
                      />
                    </span>
                  </span>
                  <span className="circular-carousel-card-face circular-carousel-card-back" aria-hidden="true">
                    <span className="circular-carousel-card-inner">
                      <Image
                        src={item.src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 400px, 640px"
                        quality={95}
                        aria-hidden
                      />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
