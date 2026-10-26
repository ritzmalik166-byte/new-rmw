import Link from "next/link";
import type { ReactNode } from "react";
import { BlogCard } from "@/components/blogs/BlogCard";
import type { Blog } from "@/lib/blogs";

type TaxonomyListingProps = {
  kind: string;
  title: string;
  parent?: { href: string; label: string };
  posts?: Blog[];
  count?: ReactNode;
  children?: ReactNode;
};

export function TaxonomyListing({ kind, title, parent, posts, count, children }: TaxonomyListingProps) {
  return (
    <main className="hm blog-archive" aria-labelledby="taxonomy-title">
      <div className="blog-archive-inner">
        <nav className="sd-crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            {parent ? (
              <li>
                <Link href={parent.href}>{parent.label}</Link>
              </li>
            ) : null}
            <li aria-current="page">{title}</li>
          </ol>
        </nav>

        <section className="blog-latest tax-section">
          <div className="blog-latest-heading">
            <div>
              <p className="hm-kicker">
                <span className="hm-pill">{kind}</span>
                <span>Articles from Ritz Media World</span>
              </p>
              <h1 id="taxonomy-title" className="hm-title">
                <span className="hm-line is-accent">{title}</span>
              </h1>
            </div>
            <span className="blog-latest-count">
              {count ?? (
                <>
                  <b>{posts?.length ?? 0}</b> {posts?.length === 1 ? "article" : "articles"}
                </>
              )}
            </span>
          </div>

          {posts ? (
            <div className="blog-card-grid">
              {posts.map((post) => (
                <BlogCard key={post.slug} blog={post} />
              ))}
            </div>
          ) : null}
          {children}
        </section>
      </div>
    </main>
  );
}
