import type { Metadata } from "next";
import Image from "next/image";
import { GalleryWall } from "@/components/gallery/GalleryWall";
import { HmTitle } from "@/components/homepage/shared";
import { StartProject } from "@/components/home/StartProject";
import { GALLERY_CATEGORIES, GALLERY_PIECES, galleryAlt } from "@/lib/gallery";
import { pageMetadata, AGENCY_KEYWORDS } from "@/lib/seo";
import "@/styles/gallery/gallery.css";

export const metadata: Metadata = pageMetadata({
  title: "Gallery | People, Process & Creative Work | Ritz Media World",
  description:
    "Step inside Ritz Media World through a living gallery of our people, creative process, studio life and the work that keeps the agency moving.",
  keywords: [...AGENCY_KEYWORDS, "Ritz Media World gallery"],
  path: "/gallery",
});

const HERO_FRAMES = ["/gallery/team-team-photo.webp", "/gallery/event-holi-celebration.webp", "/gallery/awards-big-dream-makers-trophy.webp"]
  .map((src) => GALLERY_PIECES.find((piece) => piece.src === src))
  .filter((piece) => piece !== undefined);

export default function GalleryPage() {
  return (
    <article className="hm gl-page">
      <section className="gl-hero" aria-labelledby="gallery-title">
        <div className="hm-wrap gl-hero-inner">
          <div className="gl-hero-copy">
            <p className="hm-kicker">
              <span className="hm-pill">Ritz Media World</span>
              <span>Since 2008 · Noida · India</span>
            </p>
            <HmTitle as="h1" id="gallery-title" lines={[{ text: "A closer look at", accent: false }, { text: "the people behind the ideas.", accent: true }]} />
            <p className="gl-hero-lede">
              Not a showroom. A snapshot of the energy, care and craft that turns a brief into
              something people remember.
            </p>
            <ul className="gl-hero-meta">
              <li><strong>{GALLERY_PIECES.length}</strong> frames</li>
              <li><strong>{Object.keys(GALLERY_CATEGORIES).length}</strong> chapters</li>
              <li><strong>17+</strong> years together</li>
            </ul>
          </div>
          <div className="gl-hero-stack" aria-hidden>
            {HERO_FRAMES.map((piece, index) => (
              <figure key={piece.src} className={`gl-hero-frame is-${index + 1}`}>
                <span className="gl-hero-frame-media">
                  <Image src={piece.src} alt={galleryAlt(piece)} fill priority={index === 0} sizes="(max-width: 760px) 60vw, 26vw" />
                </span>
                <figcaption>{piece.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <GalleryWall />
      <StartProject />
    </article>
  );
}
