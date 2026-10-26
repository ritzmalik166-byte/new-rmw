import Link from "next/link";
import { TaxonomyListing } from "@/components/blogs/TaxonomyListing";
import { BLOG_KEYWORDS, pageMetadata } from "@/lib/seo";
import { getTagIndex, slugToTitle } from "@/lib/taxonomy";
import "@/styles/blogs/taxonomy.css";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Tags | Ritz Media World",
  description: "Browse every topic covered on the Ritz Media World blog, from advertising and branding to digital marketing.",
  keywords: BLOG_KEYWORDS,
  path: "/tags",
});

export default async function TagsPage() {
  const slugs = [...(await getTagIndex()).tags.keys()].sort();
  const groups = new Map<string, string[]>();
  for (const slug of slugs) {
    const letter = /^[a-z]/.test(slug) ? slug[0].toUpperCase() : "#";
    groups.set(letter, [...(groups.get(letter) ?? []), slug]);
  }

  return (
    <TaxonomyListing
      kind="Tags"
      title="Browse by topic"
      count={
        <>
          <b>{slugs.length}</b> topics
        </>
      }
    >
      {[...groups].map(([letter, group]) => (
        <section key={letter} className="tax-group" aria-label={letter}>
          <h2 className="tax-group-letter">{letter}</h2>
          <ul className="tax-chips">
            {group.map((slug) => (
              <li key={slug}>
                <Link className="tax-chip" href={`/tags/${encodeURIComponent(slug)}`}>
                  {slugToTitle(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </TaxonomyListing>
  );
}
