"use client";

import { useState } from "react";

export function BlogShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const getShareUrl = (platform: "twitter" | "linkedin" | "whatsapp") => {
    if (typeof window === "undefined") return "#";
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    switch (platform) {
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      case "whatsapp":
        return `https://api.whatsapp.com/send?text=${text}%20${url}`;
    }
  };

  return (
    <div className="blog-share-bar">
      <span className="blog-share-label">Share:</span>
      <div className="blog-share-actions">
        <button
          type="button"
          onClick={handleCopy}
          className={`blog-share-btn blog-copy-btn ${copied ? "is-copied" : ""}`}
          aria-label="Copy link"
          title="Copy link to clipboard"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>

        <a
          href={getShareUrl("linkedin")}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-share-btn"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>

        <a
          href={getShareUrl("twitter")}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-share-btn"
          aria-label="Share on X"
          title="Share on X"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        <a
          href={getShareUrl("whatsapp")}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-share-btn"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
