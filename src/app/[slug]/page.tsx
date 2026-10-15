import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getBlogsOrEmpty, type Blog } from "@/lib/blogs";
import { getCaseStudies, getCaseStudySlugs } from "@/lib/case-studies";
import { BlogImage } from "@/components/blogs/BlogImage";
import { BlogShare } from "@/components/blogs/BlogShare";
import { BlogEnquiryForm } from "@/components/blogs/BlogEnquiryForm";
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
  const blog = findBlog(await getBlogsOrEmpty(), slug) ?? (await getBlogPost(slug));
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
  const blog = findBlog(allBlogs, slug) ?? (await getBlogPost(slug));

  if (!blog) {
    notFound();
  }

  const isCaseStudy = (await getCaseStudySlugs()).has(blog.slug.toLowerCase());
  const section = isCaseStudy
    ? { href: "/case-study", label: "Case Studies", back: "Back to all case studies", related: "More Case Studies" }
    : { href: "/blog", label: "Blogs", back: "Back to all blogs", related: "Related Blogs" };

  const readingTime = calculateReadingTime(blog.content);
  const tags = [
    ...new Set(
      blog.keywords
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ];
  const relatedPool: { slug: string; title: string; image: string | null; createdAt: string | null }[] =
    isCaseStudy ? await getCaseStudies() : allBlogs;
  const relatedBlogs = relatedPool.filter((b) => b.slug !== blog.slug).slice(0, 3);

  return (
    <div className="hm blog-post-page">
      <div className="blog-post-layout">
        <article className="blog-post-main">
          <nav className="blog-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href={section.href}>{section.label}</Link>
              </li>
              <li aria-current="page">{blog.title}</li>
            </ol>
          </nav>

          <h1 className="blog-post-title">{blog.title}</h1>

          <p className="blog-post-meta">
            <span>
              Posted on <time>{formatDate(blog.createdAt)}</time>
            </span>
            <span aria-hidden="true">·</span>
            <span>{readingTime} min read</span>
          </p>

          {blog.image ? (
            <BlogImage
              src={blog.image}
              alt={blog.title}
              className="blog-featured-img"
            />
          ) : null}

          <div
            className="blog-prose blog-post-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <footer className="blog-post-footer">
            {tags.length > 0 && (
              <div className="blog-post-tags">
                <span className="blog-post-footer-label">Tags</span>
                <div className="blog-post-tag-list">
                  {tags.map((tag) => (
                    <span key={tag} className="blog-tag-chip">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="blog-post-share">
              <span className="blog-post-footer-label">Share</span>
              <BlogShare title={blog.title} />
            </div>
          </footer>
        </article>

        <aside className="blog-post-aside">
          <div className="blog-post-aside-sticky">
            <BlogEnquiryForm />
            <Link href={section.href} className="blog-back-link">
              <span aria-hidden="true">←</span> {section.back}
            </Link>
          </div>
        </aside>

        {relatedBlogs.length > 0 && (
          <section className="blog-related" aria-labelledby="blog-related-heading">
            <h2 id="blog-related-heading" className="blog-related-heading">
              {section.related}
            </h2>
            <div className="blog-related-grid">
              {relatedBlogs.map((rb) => (
                <Link key={rb.slug} href={`/${rb.slug}`} className="blog-related-card">
                  <BlogImage
                    src={rb.image}
                    alt={rb.title}
                    className="blog-related-media"
                  />
                  <span className="blog-related-date">{formatDate(rb.createdAt)}</span>
                  <h3 className="blog-related-title">{rb.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
