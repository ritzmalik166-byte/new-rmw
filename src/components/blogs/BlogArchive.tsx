"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/blogs/BlogCard";
import { BlogHero } from "@/components/blogs/BlogHero";
import { BlogImage } from "@/components/blogs/BlogImage";
import type { Blog } from "@/lib/blogs";

const BLOGS_PER_PAGE = 7;
const CATEGORIES = [
  "All",
  "Branding",
  "Digital",
  "Real Estate",
  "Marketing",
  "Creative",
  "Insights",
];

const CATEGORY_TERMS: Record<string, RegExp> = {
  Branding: /\bbrand(?:ing)?\b|\bidentity\b|\bpositioning\b/i,
  Digital: /\bdigital\b|\bseo\b|\bwebsite\b|\bweb design\b|\bsocial media\b|\bgoogle ads?\b/i,
  "Real Estate": /\breal estate\b|\bproperty\b|\bproperties\b|\bresidential\b|\bapartment\b|\bflats?\b|\bbuilder\b/i,
  Marketing: /\bmarketing\b|\badvertis(?:e|ing|ement)\b|\bmedia\b|\bcampaign\b|\bradio\b|\bnewspaper\b|\boutdoor\b|\booh\b/i,
  Creative: /\bcreative\b|\bdesign\b|\bvideo\b|\bstorytelling\b|\bcontent\b|\bfilm\b/i,
  Insights: /\bguide\b|\btrends?\b|\bhow to\b|\bwhy\b|\bwhat is\b|\binsights?\b/i,
};

type BlogArchiveProps = {
  blogs: Blog[];
  initialPage: number;
  initialQuery: string;
};

function getCategories(blog: Blog) {
  const searchableText = `${blog.title} ${blog.excerpt} ${blog.keywords}`;
  const matches = CATEGORIES.slice(1).filter((category) =>
    CATEGORY_TERMS[category].test(searchableText),
  );
  return matches.length ? matches : ["Insights"];
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

function getReadingTime(blog: Blog) {
  const words = `${blog.title} ${blog.excerpt}`.trim().split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
}

function updateUrl(page: number, query: string) {
  const url = new URL(window.location.href);
  if (page > 1) url.searchParams.set("page", String(page));
  else url.searchParams.delete("page");
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  url.searchParams.delete("category");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages]);
  for (
    let page = Math.max(1, currentPage - 1);
    page <= Math.min(totalPages, currentPage + 1);
    page += 1
  ) {
    pages.add(page);
  }
  return [...pages].sort((first, second) => first - second);
}

export function BlogArchive({
  blogs,
  initialPage,
  initialQuery,
}: BlogArchiveProps) {
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return blogs.filter(
      (blog) =>
        !normalizedQuery ||
        `${blog.title} ${blog.excerpt} ${blog.keywords}`
          .toLowerCase()
          .includes(normalizedQuery),
    );
  }, [blogs, query]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageBlogs = filteredBlogs.slice(
    (safePage - 1) * BLOGS_PER_PAGE,
    safePage * BLOGS_PER_PAGE,
  );
  const featuredBlog = pageBlogs[0];
  const latestBlogs = pageBlogs.slice(1);
  const firstPost = filteredBlogs.length ? (safePage - 1) * BLOGS_PER_PAGE + 1 : 0;
  const lastPost = Math.min(safePage * BLOGS_PER_PAGE, filteredBlogs.length);

  function updateSearch(nextQuery: string) {
    setQuery(nextQuery);
    setCurrentPage(1);
    updateUrl(1, nextQuery.trim());
  }

  function goToPage(page: number) {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
    updateUrl(nextPage, query.trim());
    document.querySelector(".blog-featured")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="blog-archive-inner">
      <BlogHero blogs={blogs} query={query} onQueryChange={updateSearch} />

      {featuredBlog ? (
        <a
          className="blog-featured"
          href={`/${encodeURIComponent(featuredBlog.slug)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BlogImage src={featuredBlog.image} alt={featuredBlog.title} />
          <span className="blog-featured-scrim" aria-hidden="true" />
          <div className="blog-featured-copy">
            <p className="blog-featured-label">
              <span>FEATURED ARTICLE</span>
              <i aria-hidden="true" />
            </p>
            <p className="blog-featured-meta">
              {formatDate(featuredBlog.createdAt)} <span>·</span> RITZ MEDIA WORLD
            </p>
            <h2>{featuredBlog.title}</h2>
            <p className="blog-featured-excerpt">
              {featuredBlog.excerpt ||
                "Read the latest ideas and perspectives from Ritz Media World."}
            </p>
            <span className="blog-featured-link">
              READ ARTICLE <span aria-hidden="true">→</span>
            </span>
            <span className="blog-featured-categories">
              {getCategories(featuredBlog).slice(0, 3).join("  |  ").toUpperCase()}
            </span>
          </div>
        </a>
      ) : (
        <p className="blog-empty">
          No articles match your search. Try a different keyword or category.
        </p>
      )}

      {latestBlogs.length > 0 ? (
        <section className="blog-latest" aria-labelledby="blog-latest-heading">
          <div className="blog-latest-heading">
            <h2 id="blog-latest-heading">
              Latest <em>Articles</em>
            </h2>
            <span>
              {filteredBlogs.length} ARTICLES <span aria-hidden="true">·</span>{" "}
              {safePage} / {totalPages}
            </span>
          </div>
          <div className="blog-card-grid">
            {latestBlogs.map((blog) => (
              <BlogCard
                key={blog.slug}
                blog={blog}
                category={getCategories(blog)[0]}
                readingTime={getReadingTime(blog)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {filteredBlogs.length > 0 ? (
        <div className="blog-pagination-summary">
          <span>
            {firstPost}–{lastPost} OF {filteredBlogs.length}
          </span>
          <nav className="blog-pagination" aria-label="Blog pages">
            <button
              type="button"
              className="blog-pagination-arrow"
              aria-label="Previous page"
              disabled={safePage <= 1}
              onClick={() => goToPage(safePage - 1)}
            >
              ←
            </button>
            {getVisiblePages(safePage, totalPages).map((page, index, pages) => (
              <span className="blog-pagination-item" key={page}>
                {index > 0 && page - pages[index - 1] > 1 ? (
                  <span className="blog-pagination-ellipsis" aria-hidden="true">
                    …
                  </span>
                ) : null}
                <button
                  type="button"
                  className={`blog-pagination-number${page === safePage ? " is-active" : ""}`}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === safePage ? "page" : undefined}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              </span>
            ))}
            <button
              type="button"
              className="blog-pagination-arrow"
              aria-label="Next page"
              disabled={safePage >= totalPages}
              onClick={() => goToPage(safePage + 1)}
            >
              →
            </button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
