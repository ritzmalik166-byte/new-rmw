import type { Metadata } from "next";
import { StartProject } from "@/components/home/StartProject";
import { WorkInProgress } from "@/components/work/WorkInProgress";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Ritz Media World's portfolio of campaigns, websites and case studies is being put together. Start a project or call us to see our work today.",
};

export default function WorkPage() {
  return (
    <>
      <WorkInProgress />
      <StartProject />
    </>
  );
}
