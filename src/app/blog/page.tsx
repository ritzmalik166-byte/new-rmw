import type { Metadata } from "next";
import { BlogArchive } from "@/components/blogs/BlogArchive";
import { getBlogsOrEmpty } from "@/lib/blogs";
import { BLOG_KEYWORDS, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Insights & Marketing Trends | Ritz Media World Blog Delhi NCR",
  description:
    "Explore expert blogs from Ritz Media World covering advertising trends, creative campaigns, brand strategy, and the future of digital marketing.",
  keywords: BLOG_KEYWORDS,
  path: "/blog",
});

type BlogPageProps = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function BlogPage({
  searchParams,
}: BlogPageProps) {
  const blogs = await getBlogsOrEmpty();
  const { page: pageParam, q } = await searchParams;
  const requestedPage = Number(pageParam);
  const initialPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;

  return (
    <main className="hm blog-archive" aria-label="Blogs">
      <BlogArchive
        blogs={blogs}
        initialPage={initialPage}
        initialQuery={q ?? ""}
      />
    </main>
  );
}
