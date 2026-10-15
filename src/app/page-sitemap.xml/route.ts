import { getServicePaths, getStaticPagePaths, renderUrlset, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600;

export function GET() {
  const paths = [...getStaticPagePaths(), ...getServicePaths()];
  return xmlResponse(
    renderUrlset(
      paths.map((path) => ({ path, priority: 0.8 })),
      new Date().toISOString(),
    ),
  );
}
