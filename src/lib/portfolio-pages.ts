import type { PortfolioTone } from "@/lib/portfolio";

export type PortfolioWorkItem =
  | { kind: "image"; src: string; alt: string; full?: string }
  | { kind: "youtube"; src: string; alt: string; youtubeId: string }
  | { kind: "video"; video: string; alt: string };

export interface PortfolioWorkGroup {
  title: string;
  /** CSS aspect-ratio for the tiles in this group. */
  aspect: string;
  items: PortfolioWorkItem[];
}

export interface PortfolioBlock {
  title: string;
  kind: "cards" | "steps" | "chips";
  lede?: string;
  items: { title: string; copy?: string }[];
}

export interface PortfolioDetail {
  slug: string;
  name: string;
  tone: PortfolioTone;
  cover: string;
  seo: { title: string; description: string; keywords?: string[] };
  h1: [string, string];
  tagline: string;
  workTitle: string;
  groups: PortfolioWorkGroup[];
  intro: { title: string; copy: string[] };
  blocks: PortfolioBlock[];
  faqTitle: [string, string];
  faqs: { q: string; a: string }[];
  closing: string;
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);

const images = (folder: string, prefix: string, numbers: number[], label: string): PortfolioWorkItem[] =>
  numbers.map((number, index) => ({
    kind: "image",
    src: `/portfolio/${folder}/${prefix}-${number}.jpg`,
    alt: `${label} ${index + 1} by Ritz Media World`,
  }));

const youtube = (folder: string, prefix: string, ids: string[], label: string): PortfolioWorkItem[] =>
  ids.map((youtubeId, index) => ({
    kind: "youtube",
    src: `/portfolio/${folder}/${prefix}-${index + 1}.jpg`,
    alt: `${label} ${index + 1} by Ritz Media World`,
    youtubeId,
  }));

const INFLUENCER_VIDEOS = [
  "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%201%20(1).mp4",
  "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%202%20(1).mp4",
  "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%203%20(1).mp4",
  "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%204%20(1).mp4",
  "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%2010%20(1).mp4",
  "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%209%20(1).mp4",
  "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%207.mp4",
  "https://contenaissance.blob.core.windows.net/ct-assets/644Px%20X%20621Px%20-%203%20(1).mp4",
  "https://contenaissance.blob.core.windows.net/ct-assets/2nd.mp4",
  "https://contenaissance.blob.core.windows.net/ct-assets/3rd.mp4",
  "https://contenaissance.blob.core.windows.net/ct-assets/4th.mp4",
  "https://contenaissance.blob.core.windows.net/ct-assets/5th.mp4",
  "https://contenaissance.blob.core.windows.net/ct-assets/6th.mp4",
  "https://contenaissance.blob.core.windows.net/ct-assets/7th.mp4",
];

const WHY_RMW = {
  title: "Why Choose Ritz Media World?",
  kind: "cards",
  items: [
    {
      title: "18+ years of brand building",
      copy: "We have been shaping brands across Delhi NCR and India since 2008, across every medium.",
    },
    {
      title: "Strategy before style",
      copy: "Every piece starts with your audience and your business goal, so the work has a job to do.",
    },
    {
      title: "One team, every craft",
      copy: "Design, film, web, media and creators sit under one roof, so your brand stays consistent.",
    },
    {
      title: "Built to perform",
      copy: "We design for the place the work will live: a highway, a newspaper, a phone screen or a feed.",
    },
  ],
} satisfies PortfolioBlock;

export const PORTFOLIO_DETAILS: PortfolioDetail[] = [
  {
    slug: "brand-identity",
    name: "Brand Identity",
    tone: "pink",
    cover: "/portfolio/cat-brand-identity.png",
    seo: {
      title: "Brand Identity Design Agency in India | Ritz Media World",
      description:
        "Ritz Media World is a brand identity design agency in India offering logo design, visual identity and complete branding solutions for businesses.",
    },
    h1: ["Brand Identity", "Design Agency"],
    tagline: "Crafting identities & shaping stories with Custom Logo Design",
    workTitle: "Our Brand Identity Design Portfolio",
    groups: [
      {
        title: "Brand Identity",
        aspect: "4 / 5",
        items: images("brand-identity", "logo", range(1, 12), "Client brand identity"),
      },
    ],
    intro: {
      title: "Strategic Brand Identity Design for Businesses",
      copy: [
        "Your brand identity is the first thing people notice and the last thing they forget. We design identities that say who you are in a single glance: a logo with meaning, a colour palette people remember and a voice that feels like you.",
        "From new start-ups to established names going through a refresh, we build identity systems that work everywhere your brand shows up, on a visiting card, a hoarding, a website or an Instagram grid.",
      ],
    },
    blocks: [
      {
        title: "Our Brand Identity Design Services",
        kind: "cards",
        items: [
          { title: "Logo Design", copy: "Distinctive, timeless logos built on an idea, not a trend." },
          { title: "Brand Strategy", copy: "Positioning, personality and messaging that set you apart." },
          { title: "Visual Identity Design", copy: "A complete visual language: marks, patterns, imagery and layouts." },
          { title: "Brand Guidelines", copy: "Clear rules so every team and vendor uses your brand correctly." },
          { title: "Typography & Color Palette", copy: "Type and colour choices that carry your brand's personality." },
          { title: "Marketing & Brand Collateral", copy: "Stationery, brochures, signage and social templates that match." },
        ],
      },
      {
        title: "Our Brand Identity Design Process",
        kind: "steps",
        items: [
          { title: "Brand Discovery & Research", copy: "We study your business, audience, competitors and ambitions." },
          { title: "Brand Strategy", copy: "We define what your brand stands for and how it should feel." },
          { title: "Logo & Visual Concept Development", copy: "We explore several creative routes and refine the strongest." },
          { title: "Brand Identity Design", copy: "The chosen route grows into a full identity system." },
          { title: "Brand Guidelines", copy: "Everything is documented so your brand stays consistent." },
          { title: "Final Brand Implementation", copy: "We roll the identity out across print, digital and on-ground." },
        ],
      },
      {
        title: "Why Choose Ritz Media World for Brand Identity Design?",
        kind: "cards",
        items: [
          { title: "Strategic & Creative Approach", copy: "Ideas grounded in research, designed to stand out." },
          { title: "Consistent Brand Experience", copy: "One look and feel across every touchpoint." },
          { title: "Industry-Focused Branding", copy: "Identities shaped by how your industry and buyers think." },
          { title: "Scalable Brand Identity Systems", copy: "Systems that grow with new products, places and platforms." },
          { title: "End-to-End Branding Solutions", copy: "From the first sketch to launch campaigns, under one roof." },
        ],
      },
      {
        title: "Industries We Serve",
        kind: "chips",
        items: [
          { title: "Hospitality & Restaurants" },
          { title: "Beauty & Wellness" },
          { title: "Real Estate" },
          { title: "Education" },
          { title: "Retail & E-commerce" },
        ],
      },
    ],
    faqTitle: ["Questions about", "brand identity design."],
    faqs: [
      {
        q: "What is brand identity design?",
        a: "Brand identity design is the creation of the visual and verbal elements that represent your business: logo, colours, typography, imagery, tone of voice and the rules for using them together.",
      },
      {
        q: "What does a brand identity design package include?",
        a: "A typical package includes brand strategy, logo design, colour palette, typography, supporting graphics, stationery design and a brand guidelines document. We tailor the scope to your needs.",
      },
      {
        q: "How much does brand identity design cost in India?",
        a: "Cost depends on the scope, from a logo refresh to a complete identity system with guidelines and collateral. Share your requirements and we will send a clear, itemised proposal.",
      },
      {
        q: "How long does the brand identity design process take?",
        a: "Most identity projects take three to six weeks, covering research, concepts, refinement and guidelines. Larger systems with many touchpoints can take longer.",
      },
      {
        q: "Why is brand identity important for a business?",
        a: "A strong identity builds recognition and trust, makes your marketing more effective and helps you charge for the value you offer instead of competing on price.",
      },
      {
        q: "How do I choose a brand identity design agency in India?",
        a: "Look at the agency's portfolio, its process and whether it understands your industry. Ritz Media World brings 18+ years of brand building and a full in-house creative team.",
      },
    ],
    closing: "Build a Strong Brand Identity with Ritz Media World",
  },
  {
    slug: "creative",
    name: "Creative Design",
    tone: "orange",
    cover: "/portfolio/cat-creative-design.png",
    seo: {
      title: "Creative Design Agency in Noida | Portfolio | Ritz Media World",
      description:
        "Explore Ritz Media World's creative design portfolio featuring branding, graphic design, print, OOH, social media and brochure designs that inspire.",
    },
    h1: ["Creative Design", "Portfolio"],
    tagline: "Bringing ideas to life & shaping bold brands with Creative Design",
    workTitle: "Creative Design Portfolio",
    groups: [
      { title: "Stationery Creative", aspect: "4 / 5", items: images("creative", "stationery", range(1, 14), "Stationery creative") },
      {
        title: "OOH Creative",
        aspect: "4 / 5",
        items: images("creative", "ooh", [...range(1, 12), ...range(15, 19)], "OOH creative"),
      },
      { title: "Print Creative", aspect: "4 / 5", items: images("creative", "print", range(1, 12), "Print creative") },
      {
        title: "Social Media Creative",
        aspect: "4 / 5",
        items: images("creative", "social", range(1, 21), "Social media creative"),
      },
      { title: "Brochure Creative", aspect: "4 / 5", items: images("creative", "brochure", range(1, 6), "Brochure creative") },
    ],
    intro: {
      title: "Our Creative Design Work",
      copy: [
        "Great creative stops people mid-scroll, mid-drive and mid-page. Our designers turn your message into visuals that get noticed, get remembered and get people to act.",
        "From stationery and brochures to highway hoardings, newspaper ads and social media campaigns, every piece is designed for the place it will live and the people who will see it.",
      ],
    },
    blocks: [
      {
        title: "What we design",
        kind: "cards",
        items: [
          { title: "Branding & Visual Identity", copy: "Logos, identity systems and brand assets with one clear voice." },
          { title: "Graphic Design", copy: "Campaign key visuals, posters, packaging and marketing material." },
          { title: "Print & OOH Design", copy: "Newspaper ads, hoardings, unipoles and transit media that read in seconds." },
          { title: "Social Media Creatives", copy: "Feed posts, stories and campaign creatives built for engagement." },
        ],
      },
      WHY_RMW,
    ],
    faqTitle: ["Questions about", "creative design."],
    faqs: [
      {
        q: "What creative design services does Ritz Media World offer?",
        a: "We design brand identities, stationery, brochures, print ads, outdoor hoardings, social media creatives, packaging and complete campaign key visuals.",
      },
      {
        q: "Do you design for both print and digital?",
        a: "Yes. We adapt every campaign for each medium, from large-format outdoor and newspaper ads to social posts, banners and website graphics.",
      },
      {
        q: "How long does a creative design project take?",
        a: "Single creatives can be turned around in a few days. Full campaigns with multiple adaptations usually take one to three weeks.",
      },
      {
        q: "Can you work with our existing brand guidelines?",
        a: "Absolutely. We work within your guidelines, or help you build them if you don't have any yet.",
      },
    ],
    closing: "Let's Create Something Your Brand Will Be Known For",
  },
  {
    slug: "web-design",
    name: "Website Design",
    tone: "teal",
    cover: "/portfolio/cat-website-design.png",
    seo: {
      title: "Web Design Portfolio | Creative Website Designs by Ritz Media World",
      description:
        "Explore our web design portfolio featuring creative, responsive, and user-friendly websites designed to help brands build a strong online presence.",
      keywords: [
        "Web Design Portfolio",
        "Website Design Portfolio",
        "Website Design Projects",
        "Creative Website Design",
        "Responsive Web Design",
        "Custom Website Design",
      ],
    },
    h1: ["Web Design", "Portfolio"],
    tagline: "Designing experiences & building presence with Website Design",
    workTitle: "Our Website Design Projects",
    groups: [
      {
        title: "Website Design",
        aspect: "4 / 5",
        items: range(1, 6).map((number) => ({
          kind: "image" as const,
          src: `/portfolio/web-design/site-${number}.jpg`,
          full: `/portfolio/web-design/site-${number}-full.jpg`,
          alt: `Website design project ${number} by Ritz Media World`,
        })),
      },
    ],
    intro: {
      title: "Creative & Custom Web Design",
      copy: [
        "Your website is your hardest-working salesperson. We design custom websites that look sharp, load fast and guide visitors towards an enquiry, a booking or a purchase.",
        "Every site is responsive, easy to update and built with search in mind, so your brand looks just as good on a phone as it does on a big screen.",
      ],
    },
    blocks: [
      {
        title: "Our Web Design Approach",
        kind: "steps",
        items: [
          { title: "Discover", copy: "We learn your goals, audience and what your website needs to achieve." },
          { title: "Plan & Wireframe", copy: "We map the pages, content and user journeys before any design." },
          { title: "Design", copy: "Custom visual design that reflects your brand on every screen size." },
          { title: "Build & Test", copy: "Fast, responsive development tested across devices and browsers." },
          { title: "Launch & Grow", copy: "We launch, track performance and keep improving the site." },
        ],
      },
      WHY_RMW,
    ],
    faqTitle: ["Questions about", "website design."],
    faqs: [
      {
        q: "What kind of websites do you design?",
        a: "Corporate websites, real estate project sites, landing pages, portfolios and e-commerce stores, each designed around a clear business goal.",
      },
      {
        q: "Will my website work on mobile?",
        a: "Yes. Every website we design is fully responsive and tested on phones, tablets and desktops.",
      },
      {
        q: "How long does it take to build a website?",
        a: "A landing page can go live in one to two weeks. A full corporate website usually takes four to eight weeks, depending on pages and features.",
      },
      {
        q: "Do you help with SEO and content?",
        a: "Yes. We build sites with SEO best practices and our content team can write pages that rank and convert.",
      },
    ],
    closing: "Let's Build Your Website",
  },
  {
    slug: "brand-films",
    name: "Brand Films",
    tone: "blue",
    cover: "/portfolio/cat-brand-films.png",
    seo: {
      title: "Brand Film Production Company in India | Ritz Media World",
      description:
        "Ritz Media World is a brand film production company in India creating cinematic brand films, corporate videos and compelling visual stories that connect brands with audiences.",
    },
    h1: ["Brand Film", "Production Company"],
    tagline: "Bringing stories to motion & ideas to screen with AI-Powered Video Creation",
    workTitle: "Our Brand Film Portfolio",
    groups: [
      {
        title: "Brand Films",
        aspect: "4 / 5",
        items: youtube(
          "brand-films",
          "film",
          ["iiEgYU72mWg", "X-i-iN7urcM", "OT4Dc214r3Q", "-ih5T6UnZBw", "Lp3i_u7O79o", "a1Q9U0ezsyQ"],
          "Brand film",
        ),
      },
    ],
    intro: {
      title: "Creating Powerful Brand Stories Through Film",
      copy: [
        "A great brand film makes people feel something about your brand. We write, shoot and edit films that tell your story with emotion and clarity, and give audiences a reason to remember you.",
        "Combining classic production with AI-powered video tools, we create cinematic films faster and for every screen your buyers watch, from TV and YouTube to Reels and WhatsApp.",
      ],
    },
    blocks: [
      {
        title: "Our Brand Film Production Services",
        kind: "cards",
        items: [
          { title: "Brand Film Production", copy: "Story-led films that capture what your brand stands for." },
          { title: "Corporate Film Production", copy: "Company profiles, leadership stories and culture films." },
          { title: "Product & Service Films", copy: "Clear, compelling films that show what you offer." },
          { title: "Promotional Brand Videos", copy: "Launch, festive and campaign videos made to be shared." },
          { title: "Storytelling & Concept Development", copy: "Ideas, scripts and storyboards with a strong hook." },
          { title: "AI-Powered Video Production", copy: "AI-assisted visuals and edits for speed and scale." },
        ],
      },
      {
        title: "Our Brand Film Production Process",
        kind: "steps",
        items: [
          { title: "Concept & Brand Discovery", copy: "We understand your brand, audience and the story to tell." },
          { title: "Scriptwriting & Storyboarding", copy: "The idea becomes a script and a shot-by-shot storyboard." },
          { title: "Pre-Production Planning", copy: "Casting, locations, crew and schedules are locked in." },
          { title: "Film Production", copy: "We shoot with a professional crew and cinematic equipment." },
          { title: "Post-Production & Editing", copy: "Edit, colour, sound, music and motion graphics come together." },
          { title: "Final Delivery & Distribution", copy: "Cut-downs and formats for every platform you need." },
        ],
      },
      {
        title: "Why Choose Ritz Media World for Brand Film Production?",
        kind: "cards",
        items: [
          { title: "Strategic Storytelling", copy: "Every film is built around a message your audience cares about." },
          { title: "Cinematic Visuals", copy: "High production value that makes your brand look its best." },
          { title: "Creative & AI-Powered Production", copy: "Modern tools that save time without cutting corners." },
          { title: "End-to-End Video Production", copy: "Idea, shoot, edit and media planning under one roof." },
          { title: "Brand-Focused Content", copy: "Films that stay true to your brand's look and voice." },
        ],
      },
      {
        title: "Brand Films for Every Industry",
        kind: "chips",
        items: [
          { title: "Corporate & Professional Brands" },
          { title: "Hospitality & Tourism" },
          { title: "Real Estate" },
          { title: "Retail & E-commerce" },
          { title: "Education" },
          { title: "Lifestyle & Consumer Brands" },
        ],
      },
    ],
    faqTitle: ["Questions about", "brand film production."],
    faqs: [
      {
        q: "What is a brand film?",
        a: "A brand film is a short video that tells the story of your brand: what you believe, who you serve and why it matters. It focuses on emotion and connection rather than a hard sell.",
      },
      {
        q: "Why does a business need a brand film?",
        a: "Video is the most engaging way to build trust. A brand film helps people understand and remember your brand, and works across your website, social media, events and ads.",
      },
      {
        q: "How much does brand film production cost in India?",
        a: "Cost depends on length, locations, cast, crew and post-production. We offer options for different budgets and share a detailed estimate after understanding your brief.",
      },
      {
        q: "How long does it take to produce a brand film?",
        a: "Most brand films take three to six weeks from concept to final delivery. AI-assisted projects and short promos can be delivered faster.",
      },
      {
        q: "What is included in brand film production?",
        a: "Concept, scriptwriting, storyboarding, casting, shooting, editing, colour grading, music, voice-over, motion graphics and final exports for every platform.",
      },
      {
        q: "How do I choose a brand film production company in India?",
        a: "Watch their past work, check that they understand your industry and ask about their process. Ritz Media World handles strategy, production and distribution end to end.",
      },
    ],
    closing: "Let's Create Something Your Brand Will Be Known For",
  },
  {
    slug: "walk-through-videos",
    name: "Walk-Through Videos",
    tone: "red",
    cover: "/portfolio/cat-walkthrough.jpg",
    seo: {
      title: "Walk-Through Video Production Services | Ritz Media World",
      description:
        "Bring spaces and ideas to life with professional walk-through videos for real estate, interiors and architecture. Explore our video production services.",
    },
    h1: ["Walk-Through", "Videos"],
    tagline: "Bringing stories to motion & ideas to screen with AI-Powered Video Creation",
    workTitle: "Our Portfolio",
    groups: [
      {
        title: "Walk-Through Videos",
        aspect: "4 / 5",
        items: youtube(
          "walk-through-videos",
          "walk",
          [
            "LMz36aAXPus",
            "M6Dm4SiqSsc",
            "XRYVFJ5u_2g",
            "pbXiujM1QjM",
            "T8GtiRWPvKM",
            "ukRR5iNZv4I",
            "xrhEXyUfBVM",
            "hnG-LjQYP5k",
            "TjveWflbrkM",
            "ub6D5lHq6DU",
            "4Z4ZOWnVJ4Y",
          ],
          "Walk-through video",
        ),
      },
    ],
    intro: {
      title: "Bring Your Spaces to Life",
      copy: [
        "Let buyers walk through your project before the first brick is laid. Our 3D walk-through videos show every room, view and amenity in rich, realistic detail.",
        "Built for real estate launches, interiors and architecture, they help people picture themselves in the space, and that is what turns interest into site visits and bookings.",
      ],
    },
    blocks: [
      {
        title: "Our Walk-Through Video Services",
        kind: "cards",
        items: [
          { title: "Real Estate Videos", copy: "Project films that show the location, towers, homes and lifestyle." },
          { title: "3D Walk-Through Videos", copy: "Photo-real 3D tours of interiors, exteriors and amenities." },
          { title: "Architectural Videos", copy: "Cinematic visualisations that bring designs and plans to life." },
        ],
      },
      WHY_RMW,
    ],
    faqTitle: ["Questions about", "walk-through videos."],
    faqs: [
      {
        q: "What is a walk-through video?",
        a: "A walk-through video is a 3D animated tour of a building or space, showing it from a visitor's point of view before it is built or finished.",
      },
      {
        q: "Who needs walk-through videos?",
        a: "Real estate developers, architects, interior designers and hospitality brands use them to sell projects, win approvals and impress investors.",
      },
      {
        q: "What do you need from us to start?",
        a: "Architectural plans, elevations, material and finish details and any reference images. We handle the 3D modelling, rendering and editing.",
      },
      {
        q: "How long does a walk-through video take?",
        a: "Typically two to five weeks depending on the size of the project, the number of spaces and the level of detail.",
      },
    ],
    closing: "Let's Create Your Video",
  },
  {
    slug: "influencer-marketing-videos",
    name: "Influencer Marketing",
    tone: "yellow",
    cover: "/portfolio/cat-influencer.jpg",
    seo: {
      title: "Influencer Marketing Videos | Ritz Media World",
      description:
        "Explore Ritz Media World's influencer marketing videos, blending creative storytelling, real voices and engaging content to make brands stand out.",
    },
    h1: ["Influencer Marketing", "Videos"],
    tagline: "Authentic content that naturally integrates your brand into the creator's voice.",
    workTitle: "Our Influencer Marketing Work",
    groups: [
      {
        title: "Influencer Marketing Videos",
        aspect: "644 / 621",
        items: INFLUENCER_VIDEOS.map((video, index) => ({
          kind: "video" as const,
          video,
          alt: `Influencer marketing video ${index + 1} by Ritz Media World`,
        })),
      },
    ],
    intro: {
      title: "Influencer Marketing That Feels Authentic",
      copy: [
        "People trust people. We partner your brand with creators whose audiences already listen to them, and make content that feels like their own, not like an ad.",
        "From concept and creator selection to scripting, shooting and amplification, we run influencer campaigns that build reach, trust and real results.",
      ],
    },
    blocks: [
      {
        title: "Creative Videos That Connect With Audiences",
        kind: "cards",
        items: [
          { title: "Creator-led storytelling", copy: "Your message told in the creator's own style and voice." },
          { title: "Right creators, right audience", copy: "Creators picked for audience fit, not just follower count." },
          { title: "Made for every platform", copy: "Reels, Shorts and stories designed for how people watch." },
          { title: "Amplified for reach", copy: "Paid boosting and repurposing to get more from every video." },
        ],
      },
      {
        title: "Why Choose Influencer Marketing?",
        kind: "cards",
        items: [
          { title: "Trust", copy: "Recommendations from creators feel personal and believable." },
          { title: "Reach", copy: "Instant access to engaged, niche audiences across India." },
          { title: "Engagement", copy: "Creator content earns more likes, comments and shares than ads." },
          { title: "Results", copy: "Trackable links and codes connect content to enquiries and sales." },
        ],
      },
    ],
    faqTitle: ["Questions about", "influencer marketing."],
    faqs: [
      {
        q: "How do you choose influencers for a brand?",
        a: "We look at audience demographics, engagement quality, content style and brand fit, then shortlist creators who genuinely match your brand.",
      },
      {
        q: "Which platforms do you run influencer campaigns on?",
        a: "Mainly Instagram and YouTube, along with other platforms where your audience spends time.",
      },
      {
        q: "Do you handle scripting and shooting?",
        a: "Yes. We brief creators, help with scripts and concepts, and can produce the content with our own team when needed.",
      },
      {
        q: "How do you measure influencer campaign results?",
        a: "We track reach, views, engagement, link clicks, promo code use and enquiries, and share a clear report at the end of the campaign.",
      },
    ],
    closing: "Let's Create Something People Remember",
  },
];

export const getPortfolioDetail = (slug: string) => PORTFOLIO_DETAILS.find((detail) => detail.slug === slug);

/** Two-line section title in the homepage style: second half in the accent colour, ending in punctuation. */
export function splitTitle(text: string) {
  const sentence = /[.?!]$/.test(text) ? text : `${text}.`;
  const words = sentence.split(" ");
  if (words.length < 2) return [{ text: sentence, accent: true }];
  const cut = Math.ceil(words.length / 2);
  return [{ text: words.slice(0, cut).join(" ") }, { text: words.slice(cut).join(" "), accent: true }];
}

export const workCount = (detail: PortfolioDetail) =>
  detail.groups.reduce((total, group) => total + group.items.length, 0);

export const workNoun = (detail: PortfolioDetail) => {
  const kind = detail.groups[0]?.items[0]?.kind;
  if (kind === "youtube") return "films";
  if (kind === "video") return "videos";
  return "pieces";
};
