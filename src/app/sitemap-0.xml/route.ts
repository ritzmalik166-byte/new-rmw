import {
  getMainServicePaths,
  getPosts,
  getStaticPagePaths,
  getTaxonomyPaths,
  renderUrlset,
  xmlResponse,
} from "@/lib/sitemap";
import {
  SITEMAP_0_EXCLUDED_PAGES,
  SITEMAP_0_EXCLUDED_POST_SLUGS,
  SITEMAP_0_LEGACY_PATHS,
} from "@/lib/sitemap-exclusions";

export const revalidate = 3600;

export async function GET() {
  const pages = [
    ...getStaticPagePaths().filter((path) => !SITEMAP_0_EXCLUDED_PAGES.has(path)),
    ...getMainServicePaths(),
    ...SITEMAP_0_LEGACY_PATHS,
  ].sort();
  const [allPosts, taxonomy] = await Promise.all([getPosts(), getTaxonomyPaths()]);
  const posts = allPosts.filter(
    ({ path }) => !SITEMAP_0_EXCLUDED_POST_SLUGS.has(path.slice(1).toLowerCase()),
  );

  return xmlResponse(
    renderUrlset(
      [
        ...pages.map((path) => ({ path, priority: 0.7 })),
        ...posts.map(({ path }) => ({ path, priority: 0.8 })),
        ...taxonomy.map((path) => ({ path, priority: 0.7 })),
      ],
      new Date().toISOString(),
    ),
  );
}
