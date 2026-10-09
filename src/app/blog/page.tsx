import type { Metadata } from "next";
import { BlogArchive } from "@/components/blogs/BlogArchive";
import { getBlogsOrEmpty } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs",
  description: "The latest blogs, ideas and insights from Ritz Media World.",
};

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
    <main className="blog-archive" aria-label="Blogs">
      <BlogArchive
        blogs={blogs}
        initialPage={initialPage}
        initialQuery={q ?? ""}
      />
    </main>
  );
}
