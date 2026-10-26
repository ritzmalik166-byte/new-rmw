"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { BlogImage } from "@/components/blogs/BlogImage";
import { HmArrow, HmStamp, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { CASE_STUDY_REPORTS, type CaseStudy } from "@/lib/case-studies";

const FILE_TILTS = ["is-back", "is-mid", "is-front"] as const;

export function CaseStudyHero({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [picked, setPicked] = useState<number | null>(null);
  useHomeReveal(rootRef, "top 90%");

  // Touch screens have no hover, so the first tap lifts a card and the second opens it.
  const onFileClick = (event: MouseEvent, index: number, slug: string) => {
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover && picked !== index) {
      event.stopPropagation();
      setPicked(index);
      return;
    }
    router.push(`/${encodeURIComponent(slug)}`);
  };

  useEffect(() => {
    if (picked === null) return;
    const drop = () => setPicked(null);
    document.addEventListener("click", drop);
    return () => document.removeEventListener("click", drop);
  }, [picked]);

  const files = caseStudies.filter((item) => item.image).slice(0, FILE_TILTS.length);
  const years = caseStudies.flatMap((item) => (item.year ? [Number(item.year)] : []));
  const yearSpan = years.length
    ? Math.min(...years) === Math.max(...years)
      ? String(years[0])
      : `${Math.min(...years)}–${String(Math.max(...years)).slice(-2)}`
    : "—";

  return (
    <section ref={rootRef} className="cs-hero" aria-labelledby="cs-hero-title">
      <div className="hm-wrap cs-hero-inner">
        <div className="cs-hero-copy">
          <nav data-hm-fade className="sd-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <TransitionLink href="/">Home</TransitionLink>
              </li>
              <li aria-current="page">Case Studies</li>
            </ol>
          </nav>

          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">Case Studies</span>
            <span className="hm-hindi" lang="hi">
              जिज्ञासु मन का घर
            </span>
          </p>

          <HmTitle
            as="h1"
            id="cs-hero-title"
            lines={[{ text: "A home for" }, { text: "curious minds.", accent: true }]}
          />

          <p data-hm-fade className="hm-lede">
            Brand case studies and market intelligence reports from Ritz Media World, breaking down
            how leading Indian and global brands win attention, alongside our own research on
            India&apos;s fastest-growing markets.
          </p>

          <div data-hm-fade className="hm-actions">
            <a href="#case-studies" className="hm-btn">
              Browse case studies <span aria-hidden>→</span>
            </a>
            <a href="#reports" className="hm-link">
              Download reports
              <HmArrow />
            </a>
          </div>

          <dl data-hm-fade className="cs-hero-stats">
            <div>
              <dt>Case files</dt>
              <dd>{String(caseStudies.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Years</dt>
              <dd>{yearSpan}</dd>
            </div>
            <div>
              <dt>Market reports</dt>
              <dd>{String(CASE_STUDY_REPORTS.length).padStart(2, "0")}</dd>
            </div>
          </dl>
        </div>

        <div className="cs-hero-stage" aria-hidden>
          {files.map((file, index) => (
            <figure
              key={file.slug}
              className={`cs-hero-file ${FILE_TILTS[index]}${picked === index ? " is-picked" : ""}`}
              onClick={(event) => onFileClick(event, index, file.slug)}
            >
              <BlogImage src={file.image} alt={file.title} className="cs-hero-file-media" />
              <figcaption>
                <span>Case {String(index + 1).padStart(2, "0")}</span>
                {file.title}
              </figcaption>
            </figure>
          ))}
          <HmStamp
            id="cs-hero-stamp"
            top="RITZ MEDIA WORLD"
            bottom="CASE FILES · NOIDA"
            word="Decoded"
            className="cs-hero-stamp"
          />
        </div>
      </div>
    </section>
  );
}
