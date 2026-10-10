"use client";

import { useMemo, useState } from "react";
import type { Blog } from "@/lib/blogs";

const TOPICS = [
  {
    id: "digital",
    chip: "Digital Marketing",
    gauge: "Digital",
    color: "#2e7a6b",
    test: /\bdigital\b|\bseo\b|\bsocial media\b|\bgoogle ads?\b|\bperformance marketing\b|\bwebsite\b/i,
  },
  {
    id: "branding",
    chip: "Branding",
    gauge: "Branding",
    color: "#f3c33c",
    test: /\bbrand(?:ing)?\b|\bidentity\b|\bpositioning\b|\blogo\b/i,
  },
  {
    id: "real-estate",
    chip: "Real Estate",
    gauge: "Real Estate",
    color: "#c9356e",
    test: /\breal estate\b|\bproperty\b|\bproperties\b|\bresidential\b|\bbuilder\b|\bapartment\b/i,
  },
  {
    id: "guides",
    chip: "Guides",
    gauge: "Guides",
    color: "#f39c1f",
    test: /\bguide\b|\bhow to\b|\bwhat is\b|\btips\b|\bsteps\b|\bchecklist\b/i,
  },
] as const;

/* Gauge geometry, in SVG user units. */
const CX = 220;
const CY = 210;
const ARC_R = 130;
const LABEL_R = 174;
const SEGMENT = 180 / TOPICS.length;
const GAP = 1.4;

function polar(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) };
}

function arcPath(from: number, to: number, radius: number) {
  const start = polar(from, radius);
  const end = polar(to, radius);
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function segmentCenter(index: number) {
  return 180 - SEGMENT * (index + 0.5);
}

function formatDate(date: string | null) {
  if (!date) return "Latest";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(date))
    .toUpperCase();
}

const DIAL = "M 15 210 A 205 205 0 0 1 425 210 L 425 224 Q 425 244 405 244 L 35 244 Q 15 244 15 224 Z";

type BlogHeroProps = {
  blogs: Blog[];
  query: string;
  onQueryChange: (query: string) => void;
};

export function BlogHero({ blogs, query, onQueryChange }: BlogHeroProps) {
  const [topicIndex, setTopicIndex] = useState(0);
  const topic = TOPICS[topicIndex];

  const latest = useMemo(
    () =>
      blogs.find((blog) => topic.test.test(`${blog.title} ${blog.excerpt} ${blog.keywords}`)) ??
      blogs[0],
    [blogs, topic],
  );

  const searchCount = blogs.length >= 50 ? `${Math.floor(blogs.length / 50) * 50}+` : String(blogs.length);
  const needleTurn = 90 - segmentCenter(topicIndex);

  return (
    <header className="bh">
      <div className="bh-copy">
        <p className="hm-kicker">
          <span className="hm-pill">Blogs</span>
          <span className="hm-hindi" lang="hi">
            आज का अख़बार
          </span>
        </p>
        <h1 className="bh-title">
          Aaj kya <em>padhna</em> hai?
        </h1>
        <p className="bh-lede">
          Ideas, stories and creative thinking from Ritz Media World. Pick a topic and the
          Read-o-Meter takes you to the latest post.
        </p>

        <div className="bh-chips" role="group" aria-label="Pick a topic">
          {TOPICS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === topicIndex ? "bh-chip is-active" : "bh-chip"}
              aria-pressed={index === topicIndex}
              onClick={() => setTopicIndex(index)}
            >
              {item.chip}
            </button>
          ))}
        </div>

        <label className="bh-search">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <circle cx="8.7" cy="8.7" r="5.7" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="m13 13 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Search blogs</span>
          <input
            type="search"
            placeholder={`Or search ${searchCount} blogs`}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          {query ? (
            <button
              type="button"
              className="bh-search-clear"
              aria-label="Clear search"
              onClick={() => onQueryChange("")}
            >
              ×
            </button>
          ) : null}
        </label>
      </div>

      <div className="bh-meter">
        <svg className="bh-gauge" viewBox="0 0 440 254" aria-hidden="true">
          <path d={DIAL} className="bh-dial-ring" />
          <path d={DIAL} className="bh-dial" />

          {TOPICS.map((item, index) => {
            const from = 180 - SEGMENT * index - (index === 0 ? 0 : GAP);
            const to = 180 - SEGMENT * (index + 1) + (index === TOPICS.length - 1 ? 0 : GAP);
            const label = polar(segmentCenter(index), LABEL_R);
            return (
              <g key={item.id} className={index === topicIndex ? "bh-seg is-active" : "bh-seg"}>
                <path d={arcPath(from, to, ARC_R)} stroke={item.color} />
                <text x={label.x} y={label.y + 4} textAnchor="middle">
                  {item.gauge.toUpperCase()}
                </text>
              </g>
            );
          })}

          <text className="bh-gauge-name" x={CX + 40} y={CY - 52} textAnchor="middle">
            Read-o-Meter
          </text>

          <g className="bh-needle" style={{ transform: `rotate(${needleTurn}deg)` }}>
            <polygon points={`${CX - 7},${CY} ${CX},${CY - 118} ${CX + 7},${CY}`} />
          </g>
          <circle className="bh-pivot" cx={CX} cy={CY} r="17" />
        </svg>

        {latest ? (
          <a
            key={`${topic.id}-${latest.slug}`}
            className="bh-card"
            href={`/${encodeURIComponent(latest.slug)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-live="polite"
          >
            <span className="bh-card-meta">
              Latest in {topic.chip} · {formatDate(latest.createdAt)}
            </span>
            <span className="bh-card-title">{latest.title}</span>
            <span className="bh-card-go">
              Read the story <span aria-hidden>→</span>
            </span>
          </a>
        ) : null}
      </div>
    </header>
  );
}
