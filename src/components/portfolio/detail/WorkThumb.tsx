import Image from "next/image";
import type { PortfolioWorkItem } from "@/lib/portfolio-pages";

/** The still (or muted looping clip) shown for a work item in grids and collages. */
export function WorkThumb({
  item,
  sizes,
  priority,
}: {
  item: PortfolioWorkItem;
  sizes: string;
  priority?: boolean;
}) {
  if (item.kind === "video") {
    return (
      <video
        className="pfd-thumb-video"
        src={item.video}
        muted
        loop
        playsInline
        preload="metadata"
        data-pfd-autoplay
        aria-label={item.alt}
      />
    );
  }

  return <Image src={item.src} alt={item.alt} fill sizes={sizes} priority={priority} />;
}
