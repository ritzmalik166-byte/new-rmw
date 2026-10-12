"use client";

import { useId, useRef, useState } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { HmPlate, HmTitle, type HmLine, useHomeReveal } from "./shared";

const TITLE = [{ text: "Common" }, { text: "highways.", accent: true }] as const;

export type FaqItem = { q: string; a: string };

type HomeFaqProps = {
  id?: string;
  kicker?: string;
  title?: readonly HmLine[];
  lede?: string | null;
  faqs?: readonly FaqItem[];
};

export function HomeFaq({
  id = "highways",
  kicker = "KM 07 · Before you set off",
  title = TITLE,
  lede = site.highways.lede,
  faqs = site.highways.faqs,
}: HomeFaqProps) {
  const rootRef = useRef<HTMLElement>(null);
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);
  const { email, phones } = site.footer;
  const titleId = `${id}-title`;
  useHomeReveal(rootRef);

  return (
    <section ref={rootRef} id={id} className="hm hm-faq" aria-labelledby={titleId}>
      <div className="hm-wrap hm-faq-inner">
        <div className="hm-faq-side">
          <header className="hm-faq-head">
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">FAQs</span>
              <span>{kicker}</span>
            </p>
            <HmTitle id={titleId} lines={title} />
            {lede ? (
              <p data-hm-fade className="hm-lede">
                {lede}
              </p>
            ) : null}
          </header>

          <aside data-hm-fade className="hm-faq-help" aria-label="Ask us directly">
            <HmPlate className="hm-faq-plate" />
            <p className="hm-faq-help-kicker">Dispatch office</p>
            <p className="hm-faq-help-title">Road not on the map?</p>
            <p className="hm-faq-help-copy">
              Ask the dispatcher. The right person from our Noida team will call you back within one
              working day.
            </p>
            <ul className="hm-faq-help-list">
              <li>
                <span>Call</span>
                <a href={`tel:${phones[0].replace(/\s/g, "")}`}>{phones[0]}</a>
              </li>
              <li>
                <span>Email</span>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            </ul>
            <TransitionLink href="/contact" className="hm-faq-help-cta">
              Talk to us <span aria-hidden>→</span>
            </TransitionLink>
          </aside>
        </div>

        <ol data-hm-fade className="hm-faq-list">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <li key={item.q} className={cn("hm-faq-item", isOpen && "is-open")}>
                <h3 className="hm-faq-q">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <span className="hm-faq-km">KM {String(index + 1).padStart(2, "0")}</span>
                    <span className="hm-faq-text">{item.q}</span>
                    <span className="hm-faq-toggle" aria-hidden />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="hm-faq-panel"
                >
                  <div>
                    <p className="hm-faq-a">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
