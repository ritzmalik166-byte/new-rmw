"use client";

import { useState } from "react";

export function BlogImage({
  src,
  alt,
  className = "news-card-media",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasImage = src !== null && src !== failedSrc;

  return (
    <div className={className}>
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={1280}
          height={720}
          loading="lazy"
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
