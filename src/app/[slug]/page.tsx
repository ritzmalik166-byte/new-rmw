import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogsOrEmpty, type Blog } from "@/lib/blogs";
import { BlogImage } from "@/components/blogs/BlogImage";
import { BlogShare } from "@/components/blogs/BlogShare";
import { BlogEnquiryForm } from "@/components/blogs/BlogEnquiryForm";
import { BlogContentUnits } from "@/components/blogs/BlogContentUnits";
import "@/styles/blogs/detail.css";

export const revalidate = 300;

export async function generateStaticParams() {
  const blogs = await getBlogsOrEmpty();
  // Slugs with filename-reserved characters (e.g. ":") break prerendering on
  // Windows; they are rendered on first request instead.
  return blogs
    .filter((blog) => !/[<>:"\\|?*]/.test(blog.slug))
    .map((blog) => ({
      slug: blog.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = findBlog(await getBlogsOrEmpty(), slug);
  if (!blog) return { title: "Blog Not Found | Ritz Media World" };

  return {
    title: `${blog.title} | Ritz Media World`,
    description: blog.excerpt,
    keywords: blog.keywords,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.image ? [blog.image] : [],
    },
  };
}

function findBlog(blogs: Blog[], slug: string) {
  const wanted = slug.toLowerCase();
  return blogs.find((blog) => blog.slug.toLowerCase() === wanted);
}

function formatDate(date: string | null) {
  if (!date) return "Ritz Media World";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allBlogs = await getBlogsOrEmpty();
  const blog = findBlog(allBlogs, slug);

  if (!blog) {
    notFound();
  }

  const readingTime = calculateReadingTime(blog.content);
  const tags = blog.keywords
    ? blog.keywords
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const primaryCategory = tags.length > 0 ? tags[0] : "Article";
  const relatedBlogs = allBlogs.filter((b) => b.slug !== blog.slug).slice(0, 3);

  return (
    <div className="blog-post-page">
      <div className="blog-layout-container">
        
        {/* Left Sticky Sidebar: Navigation, Share, Tags */}
        <aside className="blog-sidebar-left">
          <div className="blog-sticky-box">
            {/* Back button */}
            <Link href="/blog" className="blog-sidebar-back-btn">
              <span aria-hidden="true">←</span>
              <span>Back to all blogs</span>
            </Link>

            {/* Share Widget */}
            <div className="blog-sidebar-widget">
              <span className="blog-sidebar-widget-label">SHARE:</span>
              <BlogShare title={blog.title} />
            </div>

            {/* Tags Widget */}
            {tags.length > 0 && (
              <div className="blog-sidebar-widget">
                <span className="blog-sidebar-widget-label">TAGS:</span>
                <div className="blog-sidebar-tags">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="blog-tag-chip">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center: Main Article Content */}
        <main className="blog-center-column">
          <div className="blog-post-card">
            {/* Article Header */}
            <header className="blog-post-header">
              <div className="blog-post-meta">
                <span className="blog-category-badge">{primaryCategory}</span>
                <span className="blog-meta-dot" aria-hidden="true">·</span>
                <time className="blog-post-date">{formatDate(blog.createdAt)}</time>
                <span className="blog-meta-dot" aria-hidden="true">·</span>
                <span className="blog-post-reading-time">{readingTime} min read</span>
              </div>

              <h1 className="blog-post-title">{blog.title}</h1>

              <div className="blog-author-row">
                <span className="blog-author-avatar">R</span>
                <div className="blog-author-text">
                  <span className="blog-author-name">Ritz Media World</span>
                  <span className="blog-author-role">Editorial Team</span>
                </div>
              </div>

              {blog.excerpt ? (
                <p className="blog-post-lead">{blog.excerpt}</p>
              ) : null}
            </header>

            {/* Featured Image - Clean, restrained, no enlargement */}
            {blog.image ? (
              <div className="blog-featured-frame">
                <BlogImage
                  src={blog.image}
                  alt={blog.title}
                  className="blog-featured-img"
                />
              </div>
            ) : null}

            {/* Main Article Content */}
            <article className="blog-post-content">
              <BlogContentUnits
                content={blog.content}
                excerpt={blog.excerpt}
              />
            </article>
          </div>
        </main>

        {/* Right Sidebar: Small Enquiry Form & Related Posts */}
        <aside className="blog-sidebar-right">
          <div className="blog-sticky-box-right">
            {/* Small Contact Enquiry Form */}
            <BlogEnquiryForm />

            {/* Related Posts */}
            {relatedBlogs.length > 0 && (
              <div className="blog-related-widget">
                <h3 className="blog-related-heading">Related Posts</h3>
                <div className="blog-related-list">
                  {relatedBlogs.map((rb) => (
                    <Link
                      key={rb.slug}
                      href={`/${rb.slug}`}
                      className="blog-related-card"
                    >
                      <div className="blog-related-thumb">
                        <BlogImage
                          src={rb.image}
                          alt={rb.title}
                          className="blog-related-media"
                        />
                      </div>
                      <div className="blog-related-info">
                        <h4 className="blog-related-title">{rb.title}</h4>
                        <span className="blog-related-date">
                          {formatDate(rb.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
