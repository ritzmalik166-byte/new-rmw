import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { TaxonomyListing } from "@/components/blogs/TaxonomyListing";
import { BLOG_KEYWORDS, pageMetadata } from "@/lib/seo";
import { decodeSlug, resolveTag, slugToTitle } from "@/lib/taxonomy";

export const revalidate = 3600;

type TagPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await resolveTag((await params).slug);
  if (!tag) return { title: { absolute: "Tag Not Found | Ritz Media World" } };
  const title = slugToTitle(tag.slug);
  return pageMetadata({
    title: `${title} | Ritz Media World`,
    description: `Articles and insights from Ritz Media World about ${title.toLowerCase()}.`,
    keywords: BLOG_KEYWORDS,
    path: `/tags/${encodeURIComponent(tag.slug)}`,
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const rawSlug = (await params).slug;
  const tag = await resolveTag(rawSlug);
  if (!tag || tag.posts.length === 0) notFound();
  if (tag.slug !== decodeSlug(rawSlug)) permanentRedirect(`/tags/${encodeURIComponent(tag.slug)}`);

  return (
    <TaxonomyListing kind="Tag" title={slugToTitle(tag.slug)} parent={{ href: "/tags", label: "Tags" }} posts={tag.posts} />
  );
}
