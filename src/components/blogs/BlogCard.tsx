import type { Blog } from "@/lib/blogs";
import { BlogImage } from "@/components/blogs/BlogImage";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
      <path
        d="M4.2 11.8 11.4 4.6M6.2 4.4h5.2v5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(date: string | null) {
  if (!date) return "Ritz Media World";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(date));
}

function getExcerpt(excerpt: string, maxLength: number) {
  if (excerpt.length <= maxLength) return excerpt;
  return `${excerpt.slice(0, maxLength).trimEnd()}…`;
}

export function BlogCard({
  blog,
  category,
  readingTime = 5,
}: {
  blog: Blog;
  category?: string;
  readingTime?: number;
}) {
  return (
    <a
      href={`/${encodeURIComponent(blog.slug)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="news-card"
    >
      <div className="blog-card-image-wrap">
        <BlogImage src={blog.image} alt={blog.title} />
        {category ? <span className="blog-card-category">{category}</span> : null}
      </div>
      <div className="news-card-body">
        <p className="news-card-tags">
          <span>{formatDate(blog.createdAt)}</span>
          <span aria-hidden="true">·</span>
          <span>{readingTime} MIN READ</span>
        </p>
        <h2 className="news-card-title">{blog.title}</h2>
        {blog.excerpt ? (
          <p className="news-card-excerpt">{getExcerpt(blog.excerpt, 145)}</p>
        ) : null}
        <span className="blog-read-more">
          Read article
          <span className="news-card-go" aria-hidden>
            <ArrowIcon />
          </span>
        </span>
      </div>
    </a>
  );
}
