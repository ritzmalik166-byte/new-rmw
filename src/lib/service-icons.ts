export const SERVICE_ICONS: Partial<Record<string, string>> = {
  seo: "/services/icons/seo.png",
  "digital-marketing": "/services/icons/digital-marketing.png",
  "creative-services": "/services/icons/creative-services.png",
  "print-advertising": "/services/icons/print-advertising.png",
  "radio-advertising": "/services/icons/radio-advertising.png",
  "content-marketing": "/services/icons/content-marketing.png",
  "web-designing-and-development": "/services/icons/web-development.png",
  "celebrity-endorsements": "/services/icons/celebrity-endorsements.png",
  "influencer-marketing-agency-in-india": "/services/icons/influencer-marketing.png",
  "3d-rendering": "/services/icons/3d-rendering-services.png",
};

/** The kinds of render offered under 3D Rendering Services. */
export const RENDER_ICONS = {
  exterior: "/services/icons/3d/exterior.png",
  interior: "/services/icons/3d/interior.png",
  aerial: "/services/icons/3d/aerial.png",
  plan: "/services/icons/3d/floor-plan.png",
  amenity: "/services/icons/3d/amenity.png",
} as const;

/** 80px WebP copy of an icon for plain `<img>` tags (built by scripts/optimize-images.mjs). */
export function iconThumb(src: string) {
  return src.replace("/services/icons/", "/services/icons/sm/").replace(/\.png$/, ".webp");
}

/** Truck-art palette sampled from the service icons. */
export const SERVICE_ACCENTS = ["#f6c431", "#d81f5f", "#167a68", "#4ec3ea"] as const;
