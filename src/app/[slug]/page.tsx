import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getBlogsOrEmpty, type Blog } from "@/lib/blogs";
import { getCaseStudies, getCaseStudySlugs } from "@/lib/case-studies";
import { BlogImage } from "@/components/blogs/BlogImage";
import { BlogShare } from "@/components/blogs/BlogShare";
import { BlogEnquiryForm } from "@/components/blogs/BlogEnquiryForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, blogFaqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { SEO_ORIGIN } from "@/lib/seo";
import { tagHref } from "@/lib/taxonomy";
import "@/styles/blogs/detail.css";

export const revalidate = 300;
export const dynamic = "force-dynamic";

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
  const blog = (await getBlogPost(slug)) ?? findBlog(await getBlogsOrEmpty(), slug);
  if (!blog) return { title: "Blog Not Found | Ritz Media World" };

  const title = blog.metaTitle || blog.title;
  const url = `${SEO_ORIGIN}/${encodeURIComponent(blog.slug)}`;

  return {
    title: { absolute: title },
    description: blog.excerpt,
    keywords: blog.keywords,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    authors: [{ name: "Ritz Media World" }],
    publisher: "Ritz Media World",
    openGraph: {
      title,
      description: blog.excerpt,
      url,
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
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
}

/** Normalises content pasted from Google Docs: scrollable tables, and "•   text"
 *  paragraphs (manual bullets padded with spaces) rendered as real bullet points. */
function prepareContent(html: string) {
  const normalized = html
    .replace(/<table\b/gi, '<div class="blog-table-wrap"><table')
    .replace(/<\/table>/gi, "</table></div>")
    .replace(/<p\b([^>]*)>\s*(?:•|&bull;|●|▪)(?:\s|&nbsp;|&#160;)*/gi, "<p data-blog-bullet$1>")
    .replace(
      /href=(["'])call:\s*(?:\+?91\s*)?([\d\s-]+)\1/gi,
      (_match, quote: string, number: string) =>
        `href=${quote}tel:+91${number.replace(/\D/g, "")}${quote}`,
    )
    .replace(
      /href=(["'])(?:https?:\/\/(?:www\.)?ritzmediaworld\.com)?\/contact(?:-us)?\/?(?=[?#"'])/gi,
      "href=$1/contact.html",
    );

  let insideAnchor = false;
  return normalized
    .split(/(<[^>]*>)/g)
    .map((part) => {
      if (part.startsWith("<")) {
        if (/^<a\b/i.test(part)) insideAnchor = true;
        if (/^<\/a\b/i.test(part)) insideAnchor = false;
        return part;
      }
      if (insideAnchor) return part;

      return part.replace(
        /(\+91\s*[-–]?\s*\d{5}\s*[-–]?\s*\d{5})/g,
        (phone) => {
          const digits = phone.replace(/\D/g, "");
          return `<a href="tel:+${digits}" class="blog-phone-link">${phone}</a>`;
        },
      );
    })
    .join("");
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allBlogs = await getBlogsOrEmpty();
  const blog = (await getBlogPost(slug)) ?? findBlog(allBlogs, slug);

  if (!blog) {
    notFound();
  }

  const isCaseStudy = (await getCaseStudySlugs()).has(blog.slug.toLowerCase());
  const section = isCaseStudy
    ? { href: "/case-study", label: "Case Studies", back: "Back to all case studies", related: "More Case Studies" }
    : { href: "/blog", label: "Blog", back: "Back to all blogs", related: "Related Blogs" };

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
      <JsonLd data={articleJsonLd(blog, isCaseStudy)} />
      <JsonLd data={blogFaqJsonLd(blog)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: section.label, path: section.href },
          { name: blog.title, path: `/${blog.slug}` },
        ])}
      />
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
            dangerouslySetInnerHTML={{ __html: prepareContent(blog.content) }}
          />

          <footer className="blog-post-footer">
            {tags.length > 0 && (
              <div className="blog-post-tags">
                <span className="blog-post-footer-label">Tags</span>
                <div className="blog-post-tag-list">
                  {tags.map((tag) => {
                    const href = tagHref(tag);
                    return href ? (
                      <Link key={tag} href={href} className="blog-tag-chip">
                        #{tag}
                      </Link>
                    ) : (
                      <span key={tag} className="blog-tag-chip">
                        #{tag}
                      </span>
                    );
                  })}
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
            <BlogEnquiryForm source={`${isCaseStudy ? "Case study" : "Blog"}: ${blog.title}`} />
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
