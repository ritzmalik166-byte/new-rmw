"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

export type BlogUnit = {
  id: string;
  number: number;
  title: string;
  html: string;
  isTakeaway: boolean;
  readingMinutes: number;
};

function getReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

function parseUnits(rawHtml: string): BlogUnit[] {
  if (!rawHtml || !/<h2[^>]*>/i.test(rawHtml)) {
    return [
      {
        id: "unit-1",
        number: 1,
        title: "Article Overview",
        html: rawHtml,
        isTakeaway: false,
        readingMinutes: getReadingTime(rawHtml),
      },
    ];
  }

  const parts = rawHtml.split(/(?=<h2[^>]*>)/i);
  let counter = 1;
  const list: BlogUnit[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    const h2Match = part.match(/<h2[^>]*>(.*?)<\/h2>/i);
    let title = "Introduction";
    let body = part;

    if (h2Match) {
      title = h2Match[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .trim();
      body = part.replace(/<h2[^>]*>.*?<\/h2>/i, "").trim();
    }

    const isTakeaway = /key takeaway|summary|quick summary/i.test(title);

    list.push({
      id: `unit-${counter}`,
      number: counter,
      title: title || `Chapter ${counter}`,
      html: body,
      isTakeaway,
      readingMinutes: getReadingTime(body),
    });

    counter++;
  }

  return list;
}

export function BlogContentUnits({
  content,
  excerpt,
}: {
  content: string;
  excerpt?: string;
}) {
  const units = useMemo(() => parseUnits(content), [content]);
  const [activeUnitId, setActiveUnitId] = useState<string>(units[0]?.id || "unit-1");
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const pillBarRef = useRef<HTMLDivElement>(null);

  // Track scroll reading progress and active unit
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
        setProgress(Math.round(scrolled));
      }

      const offsetThreshold = 180;
      for (let i = units.length - 1; i >= 0; i--) {
        const unit = units[i];
        const el = document.getElementById(unit.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offsetThreshold) {
            setActiveUnitId(unit.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [units]);

  const toggleUnit = (id: string) => {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => setCollapsedMap({});
  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    units.forEach((u) => {
      // Keep takeaway expanded by default, collapse others
      if (!u.isTakeaway) allCollapsed[u.id] = true;
    });
    setCollapsedMap(allCollapsed);
  };

  const scrollToUnit = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Ensure unit is expanded when jumping to it
      setCollapsedMap((prev) => ({ ...prev, [id]: false }));
      const headerOffset = 110;
      const targetY = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      setActiveUnitId(id);
    }
  };

  const areAllCollapsed = useMemo(() => {
    return units.filter((u) => !u.isTakeaway).every((u) => collapsedMap[u.id]);
  }, [units, collapsedMap]);

  return (
    <div className="blog-interactive-wrapper">
      {/* Top Floating Reading Progress Bar */}
      <div
        className="blog-reading-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      {/* Chapter Navigation Unit Bar (Quick Jump Pills) */}
      <div className="blog-units-nav-panel">
        <div className="blog-units-nav-header">
          <div className="units-nav-title-wrap">
            <span className="units-badge-icon">⚡</span>
            <span className="units-nav-title">Story Chapters</span>
            <span className="units-count-chip">{units.length} Units</span>
          </div>

          <div className="units-view-controls">
            <button
              type="button"
              onClick={areAllCollapsed ? expandAll : collapseAll}
              className="units-view-toggle-btn"
              title={areAllCollapsed ? "Expand all sections" : "Collapse all sections"}
            >
              {areAllCollapsed ? "Expand All" : "Collapse All"}
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Chapter Chips */}
        <div ref={pillBarRef} className="blog-units-pill-bar">
          {units.map((unit) => {
            const isActive = activeUnitId === unit.id;
            return (
              <button
                key={unit.id}
                type="button"
                onClick={() => scrollToUnit(unit.id)}
                className={`unit-nav-pill ${isActive ? "is-active" : ""} ${
                  unit.isTakeaway ? "is-takeaway-pill" : ""
                }`}
              >
                {unit.isTakeaway ? (
                  <span className="pill-icon">⚡</span>
                ) : (
                  <span className="pill-num">{String(unit.number).padStart(2, "0")}</span>
                )}
                <span className="pill-label">{unit.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Units Flow */}
      <div className="blog-units-container">
        {units.map((unit) => {
          const isCollapsed = !!collapsedMap[unit.id];

          if (unit.isTakeaway) {
            return (
              <section
                key={unit.id}
                id={unit.id}
                className="blog-unit-card is-takeaway-card"
              >
                <div className="takeaway-header">
                  <div className="takeaway-badge">
                    <span className="takeaway-badge-symbol">⚡</span>
                    <span>Key Takeaway &amp; Summary</span>
                  </div>
                  <span className="unit-read-time">{unit.readingMinutes} min read</span>
                </div>
                <h3 className="takeaway-card-title">{unit.title}</h3>
                <div
                  className="blog-prose takeaway-prose"
                  dangerouslySetInnerHTML={{ __html: unit.html }}
                />
              </section>
            );
          }

          return (
            <section
              key={unit.id}
              id={unit.id}
              className={`blog-unit-card ${isCollapsed ? "is-collapsed" : ""}`}
            >
              {/* Unit Card Header (Clickable for Expand/Collapse) */}
              <div
                className="blog-unit-card-header"
                onClick={() => toggleUnit(unit.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleUnit(unit.id);
                  }
                }}
              >
                <div className="unit-header-info">
                  <span className="unit-badge-circle">
                    {String(unit.number).padStart(2, "0")}
                  </span>
                  <div className="unit-title-group">
                    <span className="unit-chapter-tag">Chapter {unit.number}</span>
                    <h2 className="unit-heading">{unit.title}</h2>
                  </div>
                </div>

                <div className="unit-header-meta">
                  <span className="unit-read-time">{unit.readingMinutes} min read</span>
                  <span className={`unit-chevron ${isCollapsed ? "is-down" : "is-up"}`} aria-hidden="true">
                    ▾
                  </span>
                </div>
              </div>

              {/* Unit Card Body */}
              {!isCollapsed && (
                <div className="blog-unit-card-body">
                  <div
                    className="blog-prose"
                    dangerouslySetInnerHTML={{ __html: unit.html }}
                  />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
