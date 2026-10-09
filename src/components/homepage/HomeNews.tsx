import { getBlogsOrEmpty } from "@/lib/blogs";
import { HomeNewsContent } from "./HomeNewsContent";

export async function HomeNews() {
  const blogs = await getBlogsOrEmpty();
  return <HomeNewsContent blogs={blogs.slice(0, 3)} />;
}
