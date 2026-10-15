import { getPosts, getServicePaths, getStaticPagePaths, renderUrlset, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const pages = [...getStaticPagePaths(), ...getServicePaths()].sort();
  const posts = await getPosts();

  return xmlResponse(
    renderUrlset(
      [
        ...pages.map((path) => ({ path, priority: 0.7 })),
        ...posts.map(({ path }) => ({ path, priority: 0.8 })),
      ],
      new Date().toISOString(),
    ),
  );
}
