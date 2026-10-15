"use client";

import Image from "next/image";
import { useRef } from "react";
import { HmArrow, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/cn";
import type { ServiceDetail } from "@/lib/services-data";
import { subServiceHref, type SubService } from "@/lib/sub-services-data";

const pad = (value: number) => String(value).padStart(2, "0");

type Props = { service: ServiceDetail; current: SubService; siblings: SubService[] };

export function SubServiceSiblings({ service, current, siblings }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef);

  if (siblings.length < 2) return null;

  return (
    <section ref={rootRef} className="hm ssd-more" aria-labelledby="ssd-more-title">
      <div className="hm-wrap">
        <header className="sd-head is-row">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">Next stops</span>
              <span>{service.name} route</span>
            </p>
            <HmTitle id="ssd-more-title" lines={[{ text: "More stops on" }, { text: "this highway.", accent: true }]} />
          </div>
          <TransitionLink data-hm-fade href={`/services/${service.slug}`} className="hm-link">
            All of {service.name}
            <HmArrow />
          </TransitionLink>
        </header>

        <ol className="ssd-more-grid">
          {siblings.map((sub, index) => {
            const here = sub.slug === current.slug;
            return (
              <li data-hm-fade key={sub.slug}>
                <a
                  href={subServiceHref(sub)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("ssd-more-card", here && "is-here")}
                  aria-current={here ? "page" : undefined}
                >
                  <span className="ssd-more-media">
                    <Image
                      src={sub.cover}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 30vw"
                      unoptimized={sub.cover.endsWith(".gif")}
                    />
                  </span>
                  <span className="ssd-more-no">
                    {here ? "You are here" : `Stop ${pad(index + 1)}`}
                  </span>
                  <span className="ssd-more-name">{sub.name}</span>
                  <span className="ssd-more-cta" aria-hidden>
                    <HmArrow />
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
