"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { HmArrow, HmStamp, HmTitle, useFitTitle, useHomeReveal, type HmLine } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/cn";
import { getServiceCreatives } from "@/lib/service-creatives";
import type { ServiceDetail } from "@/lib/services-data";

export function ServiceHero({ service }: { service: ServiceDetail }) {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef, "top 90%");
  useFitTitle(rootRef, "#sd-hero-title");

  const [engineLabel, engineName = service.engineCategory ?? "Services"] = service.engine
    .split("·")
    .map((part) => part.trim());
  const heading =
    /services$/i.test(service.uppercaseName) && !/services$/i.test(service.name)
      ? `${service.name} Services`
      : service.name;
  const { badge, scene, poster } = getServiceCreatives(service.slug);
  const art = service.truckArt ?? { before: "Horn", hindi: "ओके", after: "Please" };
  const titleLines: HmLine[] = service.heroTitle
    ? [{ text: service.heroTitle.lead }, { text: service.heroTitle.accent, accent: true }]
    : [{ text: heading }];
  const lockedLines = titleLines.length > 1;

  return (
    <section ref={rootRef} className="hm sd-hero" aria-labelledby="sd-hero-title">
      <div className="hm-wrap sd-hero-inner">
        <div
          className="sd-hero-copy"
          style={{ "--title-chars": Math.max(...titleLines.map((line) => line.text.length)) } as CSSProperties}
        >
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
            className={lockedLines ? "is-line-locked" : undefined}
            lines={titleLines}
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
        </div>

        <div data-hm-fade className="sd-collage">
          <figure className="sd-collage-scene">
            <div
              className={cn("sd-collage-media", scene.fit && "is-contain")}
              style={scene.ratio ? { aspectRatio: scene.ratio } : undefined}
            >
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
            <HmStamp
              id={`sd-stamp-${service.slug}`}
              top="RITZ MEDIA WORLD"
              bottom="SINCE 2008 · NOIDA"
              word="Approved"
              className="sd-collage-stamp"
            />
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
        </div>
      </div>
    </section>
  );
}
