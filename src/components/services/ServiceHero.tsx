"use client";

import Image from "next/image";
import { useRef } from "react";
import { HmArrow, HmStamp, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/cn";
import { getServiceCreatives } from "@/lib/service-creatives";
import type { ServiceDetail } from "@/lib/services-data";

export function ServiceHero({ service }: { service: ServiceDetail }) {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef, "top 90%");

  const [engineLabel, engineName = service.engineCategory ?? "Services"] = service.engine
    .split("·")
    .map((part) => part.trim());
  const heading =
    /services$/i.test(service.uppercaseName) && !/services$/i.test(service.name)
      ? `${service.name} Services`
      : service.name;
  const { badge, scene, poster } = getServiceCreatives(service.slug);
  const art = service.truckArt ?? { before: "Horn", hindi: "ओके", after: "Please" };

  return (
    <section ref={rootRef} className="hm sd-hero" aria-labelledby="sd-hero-title">
      <div className="hm-wrap sd-hero-inner">
        <div className="sd-hero-copy">
          <nav data-hm-fade className="sd-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <TransitionLink href="/">Home</TransitionLink>
              </li>
              <li>
                <TransitionLink href="/services">Services</TransitionLink>
              </li>
              <li aria-current="page">{service.name}</li>
            </ol>
          </nav>

          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">{engineName}</span>
            <span>{engineLabel}</span>
          </p>

          <HmTitle
            as="h1"
            id="sd-hero-title"
            lines={[{ text: heading }, { text: "loaded & delivered.", accent: true }]}
          />

          <p data-hm-fade className="hm-lede">
            {service.tagline}
          </p>

          <div data-hm-fade className="hm-actions">
            <a href="/contact" target="_blank" rel="noopener noreferrer" className="hm-btn">
              Start your project <span aria-hidden>→</span>
            </a>
            <a href="#creatives" className="hm-link">
              See the work
              <HmArrow />
            </a>
          </div>

          <ul data-hm-fade className="sd-hero-tags" aria-label={`${service.name} focus areas`}>
            {service.tags.slice(0, 5).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>

        <div data-hm-fade className="sd-collage">
          <figure className="sd-collage-scene">
            <div className={cn("sd-collage-media", scene.fit && "is-contain")}>
              <Image
                src={scene.src}
                alt={scene.alt}
                fill
                priority
                sizes="(max-width: 980px) 86vw, 520px"
              />
            </div>
            <figcaption>
              <span>{scene.medium}</span>
              {scene.caption}
            </figcaption>
          </figure>

          <figure className="sd-collage-poster">
            <div className={cn("sd-collage-media", poster.fit && "is-contain")}>
              <Image src={poster.src} alt={poster.alt} fill sizes="(max-width: 980px) 40vw, 220px" />
            </div>
          </figure>

          <p className="sd-sticker" aria-hidden>
            <span>{badge[0]}</span>
            {badge[1]}
          </p>

          <p className="hm-plate sd-collage-plate" aria-hidden>
            {art.before} <span lang="hi">{art.hindi}</span> {art.after}
          </p>

          <HmStamp
            id={`sd-stamp-${service.slug}`}
            top="RMW · SINCE 2008"
            bottom="NOIDA · UP16"
            word="Approved"
            className="sd-collage-stamp"
          />
        </div>
      </div>
    </section>
  );
}
