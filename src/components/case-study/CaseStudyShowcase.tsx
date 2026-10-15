"use client";

import { useLenis } from "lenis/react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { BlogImage } from "@/components/blogs/BlogImage";
import { HmArrow, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { cn } from "@/lib/cn";
import type { CaseStudy } from "@/lib/case-studies";

const ACCENTS = ["#c9356e", "#167a7d", "#e4532a", "#2a3c9c", "#d9333f", "#c98a00"];
const ALL_YEARS = "all";
const HOVER_INTENT_MS = 120;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function CaseStudyShowcase({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const lenis = useLenis();
  const [year, setYear] = useState(ALL_YEARS);
  const [activeIndex, setActiveIndex] = useState(0);
  useHomeReveal(rootRef);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const years = useMemo(
    () =>
      [...new Set(caseStudies.flatMap((item) => (item.year ? [item.year] : [])))].sort(
        (first, second) => Number(second) - Number(first),
      ),
    [caseStudies],
  );

  const visible = useMemo(
    () => (year === ALL_YEARS ? caseStudies : caseStudies.filter((item) => item.year === year)),
    [caseStudies, year],
  );

  const safeIndex = Math.min(activeIndex, Math.max(visible.length - 1, 0));
  const active = visible[safeIndex];
  const accent = ACCENTS[safeIndex % ACCENTS.length];

  function keepRowInView(index: number) {
    const list = listRef.current;
    const row = list?.children[index] as HTMLElement | undefined;
    if (!list || !row || list.scrollHeight <= list.clientHeight) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < list.scrollTop) list.scrollTo({ top, behavior: "smooth" });
    else if (bottom > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: bottom - list.clientHeight, behavior: "smooth" });
    }
  }

  function select(index: number) {
    const next = Math.min(Math.max(index, 0), visible.length - 1);
    setActiveIndex(next);
    keepRowInView(next);
  }

  /* Below the two-column breakpoint the index sits under the stage, so a tap
     needs to bring the stage back into view to show what changed. */
  function choose(index: number) {
    window.clearTimeout(hoverTimer.current);
    select(index);
    const stage = stageRef.current;
    if (!stage || !window.matchMedia("(max-width: 980px)").matches) return;
    if (lenis) lenis.scrollTo(stage, { offset: -90 });
    else stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function preview(index: number) {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => select(index), HOVER_INTENT_MS);
  }

  function selectYear(nextYear: string) {
    setYear(nextYear);
    setActiveIndex(0);
    listRef.current?.scrollTo({ top: 0 });
  }

  function onListKey(event: KeyboardEvent<HTMLOListElement>) {
    const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = Math.min(Math.max(safeIndex + step, 0), visible.length - 1);
    select(next);
    (listRef.current?.children[next]?.querySelector("button") as HTMLButtonElement | null)?.focus();
  }

  return (
    <section ref={rootRef} id="case-studies" className="cs-work" aria-labelledby="cs-work-title">
      <div className="hm-wrap">
        <div className="cs-work-head">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">Selected work</span>
              <span className="hm-hindi" lang="hi">
                चुनिंदा किस्से
              </span>
            </p>
            <HmTitle
              id="cs-work-title"
              lines={[{ text: "Stories behind" }, { text: "the brands.", accent: true }]}
            />
          </div>

          {years.length > 1 ? (
            <div data-hm-fade className="cs-years" role="group" aria-label="Filter case studies by year">
              {[ALL_YEARS, ...years].map((option) => {
                const count =
                  option === ALL_YEARS
                    ? caseStudies.length
                    : caseStudies.filter((item) => item.year === option).length;
                return (
                  <button
                    key={option}
                    type="button"
                    className={cn("cs-year", option === year && "is-active")}
                    aria-pressed={option === year}
                    onClick={() => selectYear(option)}
                  >
                    {option === ALL_YEARS ? "All years" : option}
                    <span className="cs-year-count">{pad(count)}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {active ? (
          <div className="cs-show" style={{ "--cs-accent": accent } as React.CSSProperties}>
            <div ref={stageRef} data-hm-fade className="cs-stage" aria-live="polite">
              <article key={active.slug} className="cs-stage-card">
                <div className="cs-stage-media">
                  <BlogImage src={active.image} alt={active.title} className="cs-stage-img" />
                  <span className="cs-stage-plate">
                    Case {pad(safeIndex + 1)} / {pad(visible.length)}
                  </span>
                  {active.year ? <span className="cs-stage-year">{active.year}</span> : null}
                </div>

                <div className="cs-stage-body">
                  <p className="cs-stage-kicker">
                    <span className="cs-stage-num">{pad(safeIndex + 1)}</span>
                    Case file
                  </p>
                  <h3 className="cs-stage-title">{active.title}</h3>
                  {active.excerpt ? <p className="cs-stage-excerpt">{active.excerpt}</p> : null}

                  <div className="cs-stage-actions">
                    <a className="cs-stage-cta" href={`/${encodeURIComponent(active.slug)}`}>
                      Read the case study
                      <span className="cs-stage-cta-go" aria-hidden>
                        <HmArrow />
                      </span>
                    </a>
                    <div className="cs-stage-nav">
                      <button
                        type="button"
                        className="cs-stage-arrow"
                        aria-label="Previous case study"
                        disabled={safeIndex <= 0}
                        onClick={() => select(safeIndex - 1)}
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        className="cs-stage-arrow"
                        aria-label="Next case study"
                        disabled={safeIndex >= visible.length - 1}
                        onClick={() => select(safeIndex + 1)}
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div data-hm-fade className="cs-index">
              <p className="cs-index-head">
                <span>Case index</span>
                <span>
                  <b>{pad(visible.length)}</b> files
                </span>
              </p>
              <ol ref={listRef} className="cs-index-list" onKeyDown={onListKey} data-lenis-prevent>
                {visible.map((item, index) => (
                  <li key={item.slug} className="cs-index-item">
                    <button
                      type="button"
                      className={cn("cs-index-row", index === safeIndex && "is-active")}
                      style={{ "--cs-row": ACCENTS[index % ACCENTS.length] } as React.CSSProperties}
                      aria-pressed={index === safeIndex}
                      onClick={() => choose(index)}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") preview(index);
                      }}
                      onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
                    >
                      <span className="cs-index-num">{pad(index + 1)}</span>
                      <span className="cs-index-title">{item.title}</span>
                      {item.year ? <span className="cs-index-year">{item.year}</span> : null}
                      <span className="cs-index-go-slot" aria-hidden />
                    </button>
                    <a
                      className="cs-index-go"
                      href={`/${encodeURIComponent(item.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open “${item.title}” in a new tab`}
                    >
                      <HmArrow />
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <p className="cs-empty">
            Case studies are taking a short detour. Please check back in a moment.
          </p>
        )}
      </div>
    </section>
  );
}
