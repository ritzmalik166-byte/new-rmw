"use client";

import { useRef } from "react";
import { BlogImage } from "@/components/blogs/BlogImage";
import { TransitionLink } from "@/components/motion/TransitionLink";
import type { Blog } from "@/lib/blogs";
import { site } from "@/lib/site";
import { HmArrow, HmTitle, useHomeReveal } from "./shared";

const TITLE = [{ text: "Dispatches from" }, { text: "the road.", accent: true }] as const;

function formatDate(date: string | null) {
  if (!date) return site.fullName;
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" }).format(
    new Date(date),
  );
}

export function HomeNewsContent({ blogs }: { blogs: Blog[] }) {
  const rootRef = useRef<HTMLElement>(null);
  useHomeReveal(rootRef);

  return (
    <section ref={rootRef} className="hm hm-news" aria-labelledby="hm-news-title">
      <div className="hm-wrap">
        <header className="hm-news-head">
          <div>
            <p data-hm-fade className="hm-kicker">
              <span className="hm-pill">News &amp; blogs</span>
              <span>KM 06 · Notes from the cab</span>
            </p>
            <HmTitle id="hm-news-title" lines={TITLE} />
            <p data-hm-fade className="hm-lede">
              {site.news.lede}
            </p>
          </div>
          <TransitionLink data-hm-fade href={site.news.href} className="hm-btn is-ink">
            {site.news.cta} <span aria-hidden>→</span>
          </TransitionLink>
        </header>

        {blogs.length > 0 ? (
          <div className="hm-news-grid">
            {blogs.map((blog, index) => (
              <a
                key={blog.slug}
                data-hm-fade
                href={`/${encodeURIComponent(blog.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hm-post"
              >
                <span className="hm-post-ticket" aria-hidden>
                  Dispatch {String(index + 1).padStart(2, "0")}
                </span>
                <BlogImage src={blog.image} alt={blog.title} className="hm-post-media" />
                <span className="hm-post-body">
                  <span className="hm-post-meta">
                    <span>{formatDate(blog.createdAt)}</span>
                    <span>5 min read</span>
                  </span>
                  <span className="hm-post-title">{blog.title}</span>
                  {blog.excerpt ? <span className="hm-post-excerpt">{blog.excerpt}</span> : null}
                  <span className="hm-post-more">
                    Read article
                    <span className="hm-post-go">
                      <HmArrow />
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p data-hm-fade className="hm-news-empty">
            No dispatches are available right now.
          </p>
        )}
      </div>
    </section>
  );
}
