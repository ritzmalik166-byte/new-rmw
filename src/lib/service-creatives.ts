export interface ServiceCreative {
  src: string;
  alt: string;
  medium: string;
  caption: string;
  /** Screenshots and cut-outs sit inside the frame instead of filling it. */
  fit?: "contain";
}

export interface ServiceCreativeSet {
  /** Sticker on the hero collage, named after the medium the service lives in. */
  badge: [string, string];
  scene: ServiceCreative;
  poster: ServiceCreative;
  wall: ServiceCreative[];
}

const WORK = {
  renoxThrive: {
    src: "/s6/renox-thrive.jpg",
    alt: "Renox Thrive campaign creative: More space, more ways to live well",
    medium: "Print · Real estate",
    caption: "Renox Thrive: a skyline launch for 3 & 4 BHK residences.",
  },
  renoxLegacy: {
    src: "/s6/renox-legacy.jpg",
    alt: "Renox Thrive full-page ad in The Times of India: Built for those who leave a legacy",
    medium: "Newspaper",
    caption: "Front-page legacy ad in The Times of India.",
  },
  vvipDistinctive: {
    src: "/s6/VVIP-1.jpg",
    alt: "VVIP campaign creative: An address as distinctive as you are",
    medium: "Key visual",
    caption: "VVIP: folk-art craft meets a modern address.",
  },
  vvipTradition: {
    src: "/s6/VVIP-2.jpg",
    alt: "VVIP campaign creative: Where tradition finds its most luxurious address",
    medium: "Campaign",
    caption: "VVIP: tradition, told in a contemporary voice.",
  },
  navrang: {
    src: "/s6/navrang-square.jpg",
    alt: "Navrang Square mobile creative: Where style finds its address",
    medium: "Social",
    caption: "Navrang Square: a high-street launch made for the feed.",
  },
  forestwalk: {
    src: "/s6/forestwalk.jpg",
    alt: "Forestwalk mobile creative: Bring home the feeling of nature",
    medium: "Social",
    caption: "Forestwalk: nature-first storytelling for the scroll.",
  },
  hoarding: {
    src: "/s5/banner-hoarding.png",
    alt: "See It Differently highway hoarding painted in truck-art style",
    medium: "Outdoor",
    caption: "See It Differently: truck art scaled up to a highway hoarding.",
    fit: "contain",
  },
  billboard: {
    src: "/s5/digital-marketing.jpg",
    alt: "See It Differently billboard with an RMW truck and a woman holding a magnifying glass",
    medium: "Brand campaign",
    caption: "See It Differently: same roads, new perspectives.",
  },
  searchConsole: {
    src: "/about/proofs/laptop-search-console.webp",
    alt: "Google Search Console report showing 31.1K clicks and 3.95M impressions",
    medium: "Search Console",
    caption: "31.1K clicks and 3.95M impressions over 16 months.",
    fit: "contain",
  },
  searchPhone: {
    src: "/mobile-3.png",
    alt: "Search Console performance report on a phone",
    medium: "Organic search",
    caption: "Organic performance, checked on the go.",
    fit: "contain",
  },
  aiMode: {
    src: "/proof-ai-noida.png",
    alt: "Google AI Mode recommending Ritz Media World for creative agency in Noida",
    medium: "AI search",
    caption: "Recommended first in Google AI Mode for “creative agency in Noida”.",
    fit: "contain",
  },
  aiOverview: {
    src: "/laptop-1.png",
    alt: "Google results page citing a Ritz Media World article below the AI Overview",
    medium: "Answer engines",
    caption: "Cited on page one for “big 4 creative agency”.",
    fit: "contain",
  },
  metaInsights: {
    src: "/about/proofs/laptop-meta-insights.webp",
    alt: "Meta Business Suite insights showing 19.4M views",
    medium: "Meta insights",
    caption: "19.4M views across Facebook and Instagram this year.",
    fit: "contain",
  },
  googleAds: {
    src: "/mobile-1.png",
    alt: "Google Ads account overview on a phone",
    medium: "Google Ads",
    caption: "65.5M impressions managed in one MCC account.",
    fit: "contain",
  },
  devices: {
    src: "/mockup-devices.png",
    alt: "Laptop, tablet and phone showing a responsive layout",
    medium: "Responsive build",
    caption: "One build that holds up on laptop, tablet and phone.",
    fit: "contain",
  },
  searchLaptop: {
    src: "/laptop-3.png",
    alt: "Search performance dashboard for a client website on a laptop",
    medium: "Launch tracking",
    caption: "Every launch ships with search tracking switched on.",
    fit: "contain",
  },
  redFm: {
    src: "/awards/red-fm-2011.jpg",
    alt: "Red FM 93.5 Special Achievement Award, Retail Category, Delhi",
    medium: "Red FM 93.5",
    caption: "Special Achievement Award for retail radio in Delhi.",
  },
  podmasters: {
    src: "/awards/podmasters-2024.jpg",
    alt: "Podmasters trophy for Best Real Estate Podcast, Beyond the Blueprint",
    medium: "Podcast",
    caption: "Best Real Estate Podcast at Podmasters for Beyond the Blueprint.",
  },
  stage: {
    src: "/awards/my-property-face-stage.jpg",
    alt: "My Property Face award ceremony on stage",
    medium: "On stage",
    caption: "My Property Face: faces, stage and spotlight, run end to end.",
  },
} satisfies Record<string, ServiceCreative>;

const render = (name: string, src: string): ServiceCreative => ({
  src,
  alt: `${name} 3D illustration`,
  medium: "3D",
  caption: `${name} views, built before the first brick.`,
  fit: "contain",
});

const SCENES = {
  print: { src: "/about/mile/print.jpg", alt: "A stack of newspapers with a fountain pen and reading glasses" },
  broadcast: { src: "/about/mile/broadcast.jpg", alt: "A vintage radio and television in a warmly lit living room" },
  search: { src: "/about/mile/search.jpg", alt: "A laptop with an empty search bar on a desk at night" },
  social: { src: "/about/mile/social.jpg", alt: "A hand holding a phone with a colourful social feed on a busy street" },
  performance: { src: "/about/mile/performance.jpg", alt: "A laptop with a rising performance dashboard on a dark desk" },
  ai: { src: "/about/mile/ai.jpg", alt: "A person looking at a glowing network over a city skyline" },
} as const;

const scene = (key: keyof typeof SCENES, medium: string, caption: string): ServiceCreative => ({
  ...SCENES[key],
  medium,
  caption,
});

export const SERVICE_CREATIVES: Record<string, ServiceCreativeSet> = {
  seo: {
    badge: ["Top", "result"],
    scene: scene("search", "Search", "Where every buying journey starts."),
    poster: WORK.searchPhone,
    wall: [WORK.searchConsole, WORK.aiMode, WORK.aiOverview, WORK.searchPhone],
  },
  "digital-marketing": {
    badge: ["Live", "campaign"],
    scene: scene("performance", "Performance", "Spend you can trace to enquiries."),
    poster: WORK.googleAds,
    wall: [WORK.metaInsights, WORK.googleAds, WORK.billboard, WORK.navrang],
  },
  "creative-services": {
    badge: ["Fresh", "off studio"],
    scene: { ...WORK.billboard, medium: "Big idea" },
    poster: WORK.vvipDistinctive,
    wall: [WORK.renoxThrive, WORK.vvipTradition, WORK.forestwalk, WORK.hoarding],
  },
  "print-advertising": {
    badge: ["Front", "page"],
    scene: scene("print", "Print", "Ink that stays on the table."),
    poster: WORK.renoxLegacy,
    wall: [WORK.renoxLegacy, WORK.renoxThrive, WORK.hoarding, WORK.vvipDistinctive],
  },
  "radio-advertising": {
    badge: ["On", "air"],
    scene: scene("broadcast", "Broadcast", "Sound that earns a second listen."),
    poster: WORK.podmasters,
    wall: [WORK.redFm, WORK.podmasters, WORK.billboard],
  },
  "content-marketing": {
    badge: ["Now", "publishing"],
    scene: scene("social", "Content", "Stories made for the scroll."),
    poster: WORK.forestwalk,
    wall: [WORK.metaInsights, WORK.forestwalk, WORK.navrang, WORK.aiOverview],
  },
  "web-development": {
    badge: ["Live", "site"],
    scene: { ...WORK.devices, medium: "Web" },
    poster: WORK.searchPhone,
    wall: [WORK.devices, WORK.searchLaptop, WORK.searchConsole, WORK.searchPhone],
  },
  "celebrity-endorsements": {
    badge: ["In the", "spotlight"],
    scene: { ...WORK.stage, medium: "Spotlight" },
    poster: WORK.vvipTradition,
    wall: [WORK.stage, WORK.renoxThrive, WORK.vvipDistinctive, WORK.vvipTradition],
  },
  "influencer-marketing": {
    badge: ["Now", "trending"],
    scene: scene("social", "Creators", "Voices people already follow."),
    poster: WORK.navrang,
    wall: [WORK.forestwalk, WORK.navrang, WORK.metaInsights, WORK.vvipTradition],
  },
  "3d-rendering-services": {
    badge: ["Freshly", "rendered"],
    scene: render("Aerial", "/services/icons/3d/aerial.png"),
    poster: render("Interior", "/services/icons/3d/interior.png"),
    wall: [
      render("Exterior", "/services/icons/3d/exterior.png"),
      render("Floor plan", "/services/icons/3d/floor-plan.png"),
      render("Amenity", "/services/icons/3d/amenity.png"),
      WORK.renoxThrive,
    ],
  },
};

const FALLBACK: ServiceCreativeSet = {
  badge: ["Horn", "OK please"],
  scene: scene("ai", "Ideas", "Ideas that travel."),
  poster: WORK.renoxThrive,
  wall: [WORK.renoxThrive, WORK.vvipDistinctive, WORK.navrang, WORK.hoarding],
};

export function getServiceCreatives(slug: string): ServiceCreativeSet {
  return SERVICE_CREATIVES[slug] ?? FALLBACK;
}
