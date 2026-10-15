"use client";

import { useRef } from "react";
import { HmArrow, HmStamp, HmTitle, useHomeReveal } from "@/components/homepage/shared";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { CASE_STUDY_REPORTS } from "@/lib/case-studies";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
      <path
        d="M8 2.5v7.5M4.8 7 8 10.2 11.2 7M3 13h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CaseStudyReports() {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef);

  return (
    <section ref={rootRef} id="reports" className="cs-reports" aria-labelledby="cs-reports-title">
      <div className="hm-wrap">
        <div className="cs-reports-head">
          <p data-hm-fade className="hm-kicker">
            <span className="hm-pill">Reports</span>
            <span className="hm-hindi" lang="hi">
              बाज़ार की नब्ज़
            </span>
          </p>
          <HmTitle
            id="cs-reports-title"
            lines={[{ text: "Download our" }, { text: "latest outlooks.", accent: true }]}
          />
          <p data-hm-fade className="hm-lede">
            Free Mid-Year 2026 real estate market reports from Ritz Media World, covering North
            India&apos;s key luxury and growth markets, from Noida, Gurgaon and Ghaziabad to the NCR
            periphery, with insights on infrastructure, buyers and pricing.
          </p>
        </div>

        <ul className="cs-report-grid">
          {CASE_STUDY_REPORTS.map((report, index) => (
            <li key={report.id} data-hm-fade className="cs-report">
              <div className="cs-report-top">
                <span className="cs-report-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="cs-report-region">{report.region}</span>
              </div>
              <h3 className="cs-report-title">{report.title}</h3>
              <p className="cs-report-label">{report.label}</p>
              <p className="cs-report-summary">{report.summary}</p>
              <p className="cs-report-meta">
                <span>{report.period}</span>
                <span>{report.pages} pages</span>
                <span>PDF</span>
              </p>
              <div className="cs-report-actions">
                <a className="hm-btn" href={report.href} target="_blank" rel="noopener noreferrer">
                  Download report <DownloadIcon />
                </a>
                <TransitionLink href="/contact" className="hm-link">
                  Contact us
                  <HmArrow />
                </TransitionLink>
              </div>
            </li>
          ))}

          <li data-hm-fade className="cs-report is-brief">
            <HmStamp
              id="cs-brief-stamp"
              top="RMW · STRATEGY"
              bottom="ON REQUEST"
              word="Custom"
              className="cs-brief-stamp"
            />
            <p className="hm-kicker is-light">
              <span className="hm-pill">Custom brief</span>
            </p>
            <h3 className="cs-report-title">Need a market brief for your project?</h3>
            <p className="cs-report-summary">
              Our strategy team can turn insight into action for your project or brand, with a
              report built around your corridor, buyer and budget.
            </p>
            <div className="cs-report-actions">
              <TransitionLink href="/contact" className="hm-btn is-ink">
                Request a custom briefing <span aria-hidden>→</span>
              </TransitionLink>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
