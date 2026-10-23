export interface ServiceCreative {
  src: string;
  alt: string;
  medium: string;
  caption: string;
  /** Screenshots and cut-outs sit inside the frame instead of filling it. */
  fit?: "contain";
  /** Frame aspect ratio when the artwork must show edge to edge, e.g. "3 / 2". */
  ratio?: string;
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
    caption: "Renox Thrive: a front-page legacy ad.",
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
  gulshanChess: {
    src: "/s6/gulshan-ht-city.jpg",
    alt: "Gulshan full-page ad in HT City: Every game of chess has just one king",
    medium: "Newspaper",
    caption: "Gulshan: one king, one front page.",
  },
  lauroraSaharanpur: {
    src: "/s6/laurora-saharanpur-toi.jpg",
    alt: "Laurora Group and Akshara Properties full-page ad in The Times of India: Discover a lifestyle most extraordinary in Saharanpur",
    medium: "Newspaper",
    caption: "Laurora × Akshara: luxury villas launched in Saharanpur.",
  },
  eldecoOmicron: {
    src: "/s6/eldeco-omicron-meta-ad.jpg",
    alt: "Eldeco sponsored ad: 7 Towers, One Epic View, 3 & 4 BHK ultra-luxury residences in Omicron 1A, Greater Noida",
    medium: "Brand campaign",
    caption: "Eldeco: 7 towers, one epic view in Greater Noida.",
  },
  llmoraAvacasa: {
    src: "/s6/llmora-avacasa-social.jpg",
    alt: "Lumora and Avacasa social creatives: The villa you add to your bucket list, in the Shivalik Hills",
    medium: "Social",
    caption: "Lumora × Avacasa: villa living in the Shivalik Hills.",
  },
  ghdGoa: {
    src: "/s6/ghd-goa-hindustan-times.jpg",
    alt: "GHD Group full-page ad in the Sunday Hindustan Times: Sun, Sea, Sophistication Living in Goa",
    medium: "Newspaper",
    caption: "GHD Group: sun, sea and luxury living in Goa.",
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
  skyMansion: {
    src: "/s5/risland-sky-mansion-billboard.webp",
    alt: "Risland Sky Mansion highway billboard: Now, private living rises above the city",
    medium: "Outdoor",
    caption: "Risland Sky Mansion: a skyline launch, scaled up to a highway billboard.",
  },
  billboard: {
    src: "/s5/digital-marketing.jpg",
    alt: "See It Differently billboard with a Ritz Media World truck and a woman holding a magnifying glass",
    medium: "Brand campaign",
    caption: "See It Differently: same roads, new perspectives.",
  },
  safarChai: {
    src: "/s5/safar-chai-branding.webp",
    alt: "Safar Chai brand identity in truck-art style on a carry bag, tea box, poster, business cards and colour palette",
    medium: "Brand identity",
    caption: "Safar Chai: one truck-art identity, from sketch to shelf.",
    ratio: "1024 / 682",
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
    src: "/about/proofs/meta.jpg",
    alt: "Meta Business Suite insights showing 19.4M views",
    medium: "Meta insights",
    caption: "19.4M views across Facebook and Instagram this year.",
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
    src: "/awards/red-fm-special-achievement-trophy-2011.jpg",
    alt: "Red FM 93.5 Special Achievement Award, Retail Category, Delhi",
    medium: "Red FM 93.5",
    caption: "Special Achievement Award for retail radio in Delhi.",
  },
  podmasters: {
    src: "/awards/podmasters-trophy-2025.png",
    alt: "Podmasters trophy for Best Real Estate Podcast, Beyond the Blueprint",
    medium: "Podcast",
    caption: "Best Real Estate Podcast at Podmasters for Beyond the Blueprint.",
  },
  etYoungLeaders: {
    src: "/awards/et-young-industry-leaders-2025-trophy.jpg",
    alt: "ET Young Industry Leaders 2025 trophy awarded to Ritesh Malik, Founder, Ritz Media World, for Excellence in Integrated Advertising Solutions",
    medium: "ET Awards",
    caption: "ET Young Industry Leaders 2025 for integrated advertising.",
  },
  bigDreamMakers: {
    src: "/awards/big-dream-makers-moderator-2025.png",
    alt: "92.7 BIG FM Dream Makers Conclave & Awards 2025 trophy thanking Mr. Ritesh Malik for moderating a panel discussion",
    medium: "92.7 BIG FM",
    caption: "BIG Dream Makers 2025: moderating the real estate panel.",
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
  "digital-marketing": {
    badge: ["Live", "campaign"],
    scene: scene("performance", "Performance", "Spend you can trace to enquiries."),
    poster: WORK.googleAds,
    wall: [WORK.metaInsights, WORK.googleAds, WORK.eldecoOmicron, WORK.llmoraAvacasa],
  },
  "creative-services": {
    badge: ["Fresh", "off studio"],
    scene: { ...WORK.safarChai, medium: "Big idea" },
    poster: WORK.vvipDistinctive,
    wall: [WORK.vvipTradition, WORK.renoxThrive, WORK.forestwalk, WORK.skyMansion],
  },
  "print-advertising": {
    badge: ["Front", "page"],
    scene: {
      src: "/about/mile/print-veridia.jpg",
      alt: "Veridia newspaper ads in The Times of India laid out on a dark blue table",
      medium: "Print",
      caption: "Ink that stays on the table.",
    },
    poster: WORK.renoxLegacy,
    wall: [
      { ...WORK.renoxLegacy, medium: "The Times of India" },
      { ...WORK.lauroraSaharanpur, medium: "The Times of India" },
      { ...WORK.ghdGoa, medium: "Hindustan Times" },
      { ...WORK.gulshanChess, medium: "HT City" },
    ],
  },
  "radio-advertising": {
    badge: ["On", "air"],
    scene: {
      src: "/s6/radio-voiceover-studio.jpg",
      alt: "Voice artist recording a radio script on a Rode microphone in the Ritz Media World studio",
      medium: "Broadcast",
      caption: "Sound that earns a second listen.",
    },
    poster: {
      src: "/s6/radio-rode-microphone.png",
      alt: "Rode studio microphone with shock mount and pop filter against warm acoustic panels",
      medium: "Studio",
      caption: "Scripted, voiced and produced for the airwaves.",
    },
    wall: [WORK.redFm, WORK.podmasters, WORK.etYoungLeaders, WORK.bigDreamMakers],
  },
  "content-marketing": {
    badge: ["Now", "publishing"],
    scene: {
      src: "/services/content-blog-laptop.jpg",
      alt: "Laptop showing a blog post titled 5 Things to Check Before You Buy a Home, with a phone, notebook of blog ideas and a cup of chai",
      medium: "Content",
      caption: "Stories made for the scroll.",
    },
    poster: {
      src: "/services/content-phone-article.jpg",
      alt: "Phone showing a home upgrades article titled Small Changes, Big Comfort, with an Enquire Now button",
      medium: "Mobile content",
      caption: "Small Changes, Big Comfort: an article built to turn readers into enquiries.",
    },
    wall: [WORK.metaInsights, WORK.forestwalk, WORK.navrang, WORK.aiOverview],
  },
  "web-designing-and-development": {
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
  "influencer-marketing-agency-in-india": {
    badge: ["Now", "trending"],
    scene: scene("social", "Creators", "Voices people already follow."),
    poster: WORK.navrang,
    wall: [WORK.forestwalk, WORK.navrang, WORK.metaInsights, WORK.vvipTradition],
  },
  "3d-rendering": {
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
