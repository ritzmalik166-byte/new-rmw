"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { site } from "@/lib/site";
import { HmStamp, HmTitle, useHomeReveal } from "./shared";

const TITLE = [{ text: "Signed, sealed," }, { text: "delivered.", accent: true }] as const;

export function HomeVoice() {
  const rootRef = useRef<HTMLElement>(null);
  const items = site.reviews.items;
  const [active, setActive] = useState(0);
  const review = items[active];
  useHomeReveal(rootRef);

  const go = (dir: 1 | -1) => setActive((index) => (index + dir + items.length) % items.length);

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
          {items.length > 1 ? (
            <div data-hm-fade className="hm-voice-controls">
              <button type="button" aria-label="Previous testimonial" onClick={() => go(-1)}>
                ←
              </button>
              <span>
                {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <button type="button" aria-label="Next testimonial" onClick={() => go(1)}>
                →
              </button>
            </div>
          ) : null}
        </div>

        <div data-hm-fade className="hm-receipt-wrap">
          <figure className="hm-receipt" aria-live="polite">
            <header className="hm-receipt-head">
              <div>
                <p className="hm-receipt-brand">Proof of delivery</p>
                <p className="hm-receipt-sub">RMW Roadways · Consignee&rsquo;s remark</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hm-receipt-stars"
                  src="/s8/star-rating.png"
                  alt="Rated 5 out of 5"
                  width={138}
                  height={18}
                />
              </div>
            </header>

            <blockquote key={active} className="hm-receipt-quote">
              <p>&ldquo;{review.quote}&rdquo;</p>
            </blockquote>

            <figcaption className="hm-receipt-foot">
              <span className="hm-receipt-avatar">
                <Image src={review.photo} alt="" width={112} height={112} />
              </span>
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

            <HmStamp
              id="hm-voice-stamp"
              className="hm-receipt-stamp"
              top="RECEIVED"
              bottom="RMW · NOIDA"
              word="5 Stars"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
