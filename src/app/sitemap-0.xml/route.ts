import {
  getPosts,
  getServicePaths,
  getStaticPagePaths,
  getTaxonomyPaths,
  renderUrlset,
  xmlResponse,
} from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const pages = [...getStaticPagePaths(), ...getServicePaths()].sort();
  const [posts, taxonomy] = await Promise.all([getPosts(), getTaxonomyPaths()]);

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
