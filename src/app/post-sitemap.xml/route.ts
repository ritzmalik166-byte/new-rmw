import { getPosts, renderUrlset, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const posts = await getPosts();
  return xmlResponse(
    renderUrlset(
      posts.map(({ path }) => ({ path, priority: 0.8 })),
      new Date().toISOString(),
    ),
  );
}
