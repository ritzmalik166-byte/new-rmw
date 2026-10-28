"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type VideoGalleryProps = {
  title: string;
  accent: string;
  lede: string;
  playlistId: string;
  videoCount: number;
};

export function PortfolioVideoGallery({
  title,
  accent,
  lede,
  playlistId,
  videoCount,
}: VideoGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openVideo, setOpenVideo] = useState<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openVideo !== null && !dialog.open) dialog.showModal();
    if (openVideo === null && dialog.open) dialog.close();
  }, [openVideo]);

  return (
    <article className="hm pf-video-page">
      <header className="pf-video-head hm-wrap">
        <Link href="/portfolio" className="pf-video-back">
          ← Back to portfolio
        </Link>
        <p className="hm-kicker">
          <span className="hm-pill">KM 05</span>
          <span>Video portfolio · YouTube playlist</span>
        </p>
        <h1 className="hm-title">
          {title} <em>{accent}</em>
        </h1>
        <p className="hm-lede">{lede}</p>
        <a
          className="pf-video-playlist-link"
          href={`https://www.youtube.com/playlist?list=${playlistId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open full playlist <span aria-hidden>↗</span>
        </a>
      </header>

      <section className="pf-video-wall" aria-label={`${title} videos`}>
        <div className="hm-wrap">
          <div className="pf-video-grid">
            {Array.from({ length: videoCount }, (_, index) => {
              const number = index + 1;
              return (
                <article className="pf-video-card" key={number}>
                  <div className="pf-video-frame">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed?list=${playlistId}&index=${number}`}
                      title={`${title} video ${number}`}
                      loading="lazy"
                      tabIndex={-1}
                      aria-hidden="true"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <button
                      type="button"
                      className="pf-video-open"
                      onClick={() => setOpenVideo(number)}
                      aria-label={`Open ${title} video ${number}`}
                    />
                  </div>
                  <div className="pf-video-card-copy">
                    <span>Film {String(number).padStart(2, "0")}</span>
                    <h2>
                      {title} · {number}
                    </h2>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="pf-video-modal"
        aria-label={openVideo ? `${title} video ${openVideo}` : `${title} video`}
        onClose={() => setOpenVideo(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpenVideo(null);
        }}
      >
        {openVideo !== null ? (
          <div className="pf-video-modal-inner">
            <header className="pf-video-modal-head">
              <div>
                <span>Now playing · Film {String(openVideo).padStart(2, "0")}</span>
                <strong>
                  {title} · {openVideo}
                </strong>
              </div>
              <button type="button" className="pf-video-modal-close" onClick={() => setOpenVideo(null)}>
                <span aria-hidden>×</span>
                Close
              </button>
            </header>
            <div className="pf-video-modal-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed?list=${playlistId}&index=${openVideo}&autoplay=1`}
                title={`${title} video ${openVideo}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="pf-video-modal-foot">
              <span>Ritz Media World · Video portfolio</span>
              <a
                href={`https://www.youtube.com/playlist?list=${playlistId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View playlist <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        ) : null}
      </dialog>
    </article>
  );
}
