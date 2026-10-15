import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaxonomyListing } from "@/components/blogs/TaxonomyListing";
import { BLOG_KEYWORDS, pageMetadata } from "@/lib/seo";
import { decodeSlug, getTagPosts, slugToTitle } from "@/lib/taxonomy";

export const revalidate = 3600;

type TagPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const slug = decodeSlug((await params).slug);
  const title = slugToTitle(slug);
  return pageMetadata({
    title: `${title} | Ritz Media World`,
    description: `Articles and insights from Ritz Media World about ${title.toLowerCase()}.`,
    keywords: BLOG_KEYWORDS,
    path: `/tags/${encodeURIComponent(slug)}`,
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const slug = decodeSlug((await params).slug);
  const posts = await getTagPosts(slug);
  if (posts.length === 0) notFound();

  return <TaxonomyListing kind="Tag" title={slugToTitle(slug)} parent={{ href: "/tags", label: "Tags" }} posts={posts} />;
}
