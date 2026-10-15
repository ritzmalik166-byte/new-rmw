import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaxonomyListing } from "@/components/blogs/TaxonomyListing";
import { BLOG_KEYWORDS, pageMetadata } from "@/lib/seo";
import { decodeSlug, getCategories, getCategoryPosts } from "@/lib/taxonomy";

export const revalidate = 3600;

type CategoryPageProps = { params: Promise<{ slug: string }> };

async function findCategory(rawSlug: string) {
  const slug = decodeSlug(rawSlug);
  return (await getCategories()).find((category) => category.slug === slug);
}

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await findCategory((await params).slug);
  if (!category) return { title: { absolute: "Category Not Found | Ritz Media World" } };
  return pageMetadata({
    title: `${category.name} | Ritz Media World`,
    description: `Articles and insights from Ritz Media World on ${category.name.toLowerCase()}.`,
    keywords: BLOG_KEYWORDS,
    path: `/category/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await findCategory((await params).slug);
  if (!category) notFound();

  const posts = await getCategoryPosts(category.slug);
  if (posts.length === 0) notFound();

  return <TaxonomyListing kind="Category" title={category.name} posts={posts} />;
}
