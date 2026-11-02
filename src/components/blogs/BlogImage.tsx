"use client";

import Image from "next/image";
import { useState } from "react";

export function BlogImage({
  src,
  alt,
  className = "news-card-media",
  preload = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: {
  src: string | null;
  alt: string;
  className?: string;
  /** Set on the above-the-fold (LCP) image so it loads eagerly with high priority. */
  preload?: boolean;
  sizes?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasImage = src !== null && src !== failedSrc;

  return (
    <div className={className}>
      {hasImage ? (
        // Backend banners are full-size uploads; next/image serves resized WebP/AVIF.
        <Image
          src={src}
          alt={alt}
          width={1280}
          height={720}
          sizes={sizes}
          preload={preload}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div className="news-card-image-fallback" role="img" aria-label={`${alt} image unavailable`}>
          Ritz Media World
        </div>
      )}
    </div>
  );
}
