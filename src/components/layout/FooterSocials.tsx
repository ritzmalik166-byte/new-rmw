"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

type SocialLink = { label: string; href: string };

const RING_RADIUS = 37;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/* `fill` can be a gradient; `tone` is the flat colour used for glows and ring text. */
const SOCIAL_META: Record<string, { ring: string; tone: string; fill: string; icon: ReactNode }> = {
  Facebook: {
    ring: "Facebook • Like us •",
    tone: "#1877f2",
    fill: "#1877f2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.6 21.5v-8h2.7l.4-3.2h-3.1V8.3c0-.9.3-1.5 1.6-1.5h1.7V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.7v3.2h2.7v8z" />
      </svg>
    ),
  },
  Instagram: {
    ring: "Instagram • Follow •",
    tone: "#e1306c",
    fill: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  LinkedIn: {
    ring: "LinkedIn • Connect •",
    tone: "#0a66c2",
    fill: "#0a66c2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
      </svg>
    ),
  },
  Twitter: {
    ring: "X / Twitter • Follow •",
    tone: "#8f96a3",
    fill: "#000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="is-x">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
  },
  YouTube: {
    ring: "YouTube • Subscribe •",
    tone: "#ff0033",
    fill: "#ff0033",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z" />
      </svg>
    ),
  },
};

function SocialStamp({ link, index }: { link: SocialLink; index: number }) {
  const ringId = useId();
  const meta = SOCIAL_META[link.label];
  if (!meta) return null;

  return (
    <li>
      <Magnetic strength={0.3}>
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer-stamp"
          aria-label={`${link.label} (opens in a new tab)`}
          style={
            {
              "--stamp-tone": meta.tone,
              "--stamp-fill": meta.fill,
              "--stamp-delay": `${index * -3.4}s`,
            } as CSSProperties
          }
        >
          <svg className="site-footer-stamp-ring" viewBox="0 0 100 100" aria-hidden>
            <defs>
              <path
                id={ringId}
                d={`M50,50 m-${RING_RADIUS},0 a${RING_RADIUS},${RING_RADIUS} 0 1,1 ${RING_RADIUS * 2},0 a${RING_RADIUS},${RING_RADIUS} 0 1,1 -${RING_RADIUS * 2},0`}
              />
            </defs>
            <circle className="site-footer-stamp-edge" cx="50" cy="50" r="30" />
            <text>
              <textPath href={`#${ringId}`} textLength={RING_LENGTH} lengthAdjust="spacing">
                {meta.ring.toUpperCase()}
              </textPath>
            </text>
          </svg>
          <span className="site-footer-stamp-core" aria-hidden>
            {meta.icon}
          </span>
        </a>
      </Magnetic>
    </li>
  );
}

export function FooterSocials({ links }: { links: SocialLink[] }) {
  return (
    <ul className="site-footer-stamps">
      {links.map((link, index) => (
        <SocialStamp key={link.label} link={link} index={index} />
      ))}
    </ul>
  );
}
