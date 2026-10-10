"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { site, type Testimonial } from "@/lib/site";
import { HmStamp, HmTitle, useHomeReveal } from "./shared";

const TITLE = [{ text: "Signed, sealed," }, { text: "delivered.", accent: true }] as const;
const AUTO_MS = 7000;
const TONES = ["#c9356e", "#e4532a", "#167a7d", "#1b1a4a", "#1457a8", "#d9333f"];

function initials(review: Testimonial) {
  return review.industry
    .split(/[\s-]+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ review, index, size }: { review: Testimonial; index: number; size: number }) {
  return (
    <span
      className="hm-receipt-avatar"
      style={{ "--tone": TONES[index % TONES.length] } as CSSProperties}
    >
      {review.photo ? (
        <Image src={review.photo} alt="" width={size} height={size} />
      ) : (
        <span aria-hidden>{initials(review)}</span>
      )}
    </span>
  );
}

/* Front slip is 0, the next two peek out behind it, the one just filed away is "out". */
function slotOf(index: number, active: number, total: number) {
  const offset = (index - active + total) % total;
  if (offset <= 2) return String(offset);
  if (offset === total - 1) return "out";
  return "hidden";
}

export function HomeVoice() {
  const rootRef = useRef<HTMLElement>(null);
  const items = site.reviews.items;
  const total = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { reduced } = useMotion();
  useHomeReveal(rootRef);

  const go = (dir: 1 | -1) => setActive((index) => (index + dir + total) % total);

  useEffect(() => {
    if (paused || reduced || total < 2) return;
    const id = window.setTimeout(() => setActive((index) => (index + 1) % total), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, reduced, total]);

  return (
    <section ref={rootRef} className="hm hm-voice" aria-labelledby="hm-voice-title">
      <div className="hm-wrap hm-voice-inner">
        <div className="hm-voice-copy">
          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">{site.reviews.title}</span>
            <span className="hm-hindi" lang="hi">
              ग्राहक की ज़ुबानी
            </span>
          </p>
          <HmTitle id="hm-voice-title" lines={TITLE} />
          <p data-hm-fade className="hm-lede">
            Every consignment ends with a signature. Here is what clients write on the slip once the
            work has landed.
          </p>
          {total > 1 ? (
            <div data-hm-fade className="hm-voice-controls">
              <button type="button" aria-label="Previous testimonial" onClick={() => go(-1)}>
                ←
              </button>
              <span className="hm-voice-count">
                <b>{String(active + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
              </span>
              <button type="button" aria-label="Next testimonial" onClick={() => go(1)}>
                →
              </button>
              <span className="hm-voice-progress" aria-hidden>
                <s key={`${active}-${paused}`} data-running={!paused && !reduced} />
              </span>
            </div>
          ) : null}
        </div>

        <div
          data-hm-fade
          className="hm-voice-deck"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {items.map((review, i) => {
            const slot = slotOf(i, active, total);
            const front = slot === "0";
            return (
              <figure
                key={`${review.company}-${i}`}
                className="hm-receipt"
                data-slot={slot}
                aria-hidden={!front}
                aria-live={front ? "polite" : undefined}
                onClick={slot === "1" || slot === "2" ? () => go(1) : undefined}
              >
                <header className="hm-receipt-head">
                  <div>
                    <p className="hm-receipt-brand">Proof of delivery</p>
                    <p className="hm-receipt-sub">
                      RMW Roadways · Consignment {String(i + 1).padStart(3, "0")}
                    </p>
                    <span className="hm-receipt-meta">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="hm-receipt-stars"
                        src="/s8/star-rating.png"
                        alt="Rated 5 out of 5"
                        width={138}
                        height={18}
                      />
                      <span className="hm-receipt-tag">{review.industry}</span>
                    </span>
                  </div>
                </header>

                <blockquote className="hm-receipt-quote">
                  <p>&ldquo;{review.quote}&rdquo;</p>
                </blockquote>

                <figcaption className="hm-receipt-foot">
                  <Avatar review={review} index={i} size={112} />
                  <span className="hm-receipt-who">
                    <span className="hm-receipt-label">Consignee</span>
                    <strong>{review.role}</strong>
                    <span>{review.company}</span>
                  </span>
                  <span className="hm-receipt-sign">
                    <span className="hm-receipt-hand">Verified</span>
                    <span className="hm-receipt-label">Received in good condition</span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
          <HmStamp
            id="hm-voice-stamp"
            className="hm-receipt-stamp"
            top="RECEIVED"
            bottom="RMW · NOIDA"
            word="5 Stars"
          />
        </div>
      </div>

      {total > 1 ? (
        <div className="hm-voice-belt" aria-label="All client testimonials">
          <div className="hm-voice-belt-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="hm-voice-belt-list" aria-hidden={copy === 1}>
                {items.map((review, i) => (
                  <li key={`${review.company}-${i}`}>
                    <button
                      type="button"
                      className="hm-slip"
                      data-active={i === active}
                      tabIndex={copy === 1 ? -1 : undefined}
                      onClick={() => setActive(i)}
                    >
                      <span className="hm-slip-head">
                        <span className="hm-slip-tag">{review.industry}</span>
                        <span className="hm-slip-stars" aria-hidden>
                          ★★★★★
                        </span>
                      </span>
                      <span className="hm-slip-quote">&ldquo;{review.quote}&rdquo;</span>
                      <span className="hm-slip-who">
                        <Avatar review={review} index={i} size={64} />
                        <span>
                          <strong>{review.role}</strong>
                          <span>{review.company}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
