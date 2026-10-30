import type { PortfolioTone } from "@/lib/portfolio";

/** A region of a 4:5 mockup, in percent of the image's width (x, w) and height (y, h). */
export type BrandBox = { x: number; y: number; w: number; h: number };

/** Where the logo sits in a brand identity mockup, used to draw its construction overlay. */
export interface BrandAnatomy {
  client: string;
  /** The whole lockup: symbol, wordmark and tagline. */
  logo: BrandBox;
  /** The symbol on its own. */
  mark: BrandBox;
}

export type PortfolioWorkItem =
  | { kind: "image"; src: string; alt: string; full?: string; caption?: string; brand?: BrandAnatomy }
  | { kind: "youtube"; src: string; alt: string; youtubeId: string; caption?: string }
  | { kind: "video"; video: string; alt: string; caption?: string };

export interface PortfolioWorkGroup {
  title: string;
  /** CSS aspect-ratio for the tiles in this group. */
  aspect: string;
  items: PortfolioWorkItem[];
}

/** A single string is split in half automatically; a pair sets the two lines explicitly. */
export type PortfolioTitle = string | [string, string];

export interface PortfolioBlock {
  title: PortfolioTitle;
  /** Eyebrow label; defaults to one based on `kind`. */
  kicker?: string;
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
  workTitle: PortfolioTitle;
  /** Replaces the default "N pieces made for real brands" line beside the work title. */
  workLede?: string;
  groups: PortfolioWorkGroup[];
  intro: { title: PortfolioTitle; copy: string[] };
  blocks: PortfolioBlock[];
  faqTitle: [string, string];
  faqs: { q: string; a: string }[];
  closing: string;
  closingLede?: string;
  /** Replaces the default submit label on the "Start a project" form. */
  formCta?: string;
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);

/** `clients` lines up with `numbers`; a `null` entry keeps the generic label for that piece. */
const images = (
  folder: string,
  prefix: string,
  numbers: number[],
  label: string,
  clients: (string | null)[] = [],
): PortfolioWorkItem[] =>
  numbers.map((number, index) => {
    const client = clients[index];
    return {
      kind: "image",
      src: `/portfolio/${folder}/${prefix}-${number}.jpg`,
      alt: client
        ? `${client} ${label.toLowerCase()} by Ritz Media World`
        : `${label} ${index + 1} by Ritz Media World`,
      ...(client ? { caption: client } : {}),
    };
  });

/** Each film is `[youtubeId, caption, alt]`; thumbnails are numbered in the same order. */
const youtube = (folder: string, prefix: string, films: [string, string, string][]): PortfolioWorkItem[] =>
  films.map(([youtubeId, caption, alt], index) => ({
    kind: "youtube",
    src: `/portfolio/${folder}/${prefix}-${index + 1}.jpg`,
    alt: `${alt}, by Ritz Media World`,
    youtubeId,
    caption,
  }));

/** Each video is `[url, client]`; a `null` client keeps the generic label. */
const INFLUENCER_VIDEOS: [string, string | null][] = [
  ["https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%201%20(1).mp4", "Eldeco"],
  ["https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%202%20(1).mp4", "Onyx by Splendor"],
  ["https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%204%20(1).mp4", "Ritz Media World"],
  ["https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%2010%20(1).mp4", "Ashiana Malhar"],
  ["https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%209%20(1).mp4", "Ashiana Malhar"],
  ["https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%207.mp4", "Ashiana OMA"],
  ["https://contenaissance.blob.core.windows.net/ct-assets/644Px%20X%20621Px%20-%203%20(1).mp4", "Ritz Media World"],
  ["https://contenaissance.blob.core.windows.net/ct-assets/2nd.mp4", "Eldeco"],
  ["https://contenaissance.blob.core.windows.net/ct-assets/3rd.mp4", "EON, Eye of Noida"],
  ["https://contenaissance.blob.core.windows.net/ct-assets/4th.mp4", "Risland"],
  ["https://contenaissance.blob.core.windows.net/ct-assets/5th.mp4", "Onyx by Splendor"],
  ["https://contenaissance.blob.core.windows.net/ct-assets/6th.mp4", "VVIP"],
  ["https://contenaissance.blob.core.windows.net/ct-assets/7th.mp4", "VVIP Namah"],
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

/* Images stay numbered by their original slot, so these are filtered out after mapping. */
const HIDDEN_BRAND_IDENTITY = new Set(["/portfolio/brand-identity/logo-4.jpg", "/portfolio/brand-identity/logo-8.jpg"]);

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
    tagline: "Custom logos and brand identities that stay remembered",
    workTitle: "Our Brand Identity Design Portfolio",
    groups: [
      {
        title: "Brand Identity",
        aspect: "4 / 5",
        items: (
          [
            ["Numax Civil Lines", [15.6, 35.4, 64, 27.1], [50.3, 35.4, 29.3, 20.5]],
            ["Kinza Estate", [21, 41.8, 63.9, 28.3], [21, 41.8, 20.5, 16.3]],
            ["Ashtech Presidential Towers", [8.8, 38.4, 82.5, 16.8], [8.8, 38.4, 13.8, 12.9]],
            ["Opal County", [8.8, 36.9, 82.2, 28], [8.8, 36.9, 24.8, 20]],
            ["Shubh Anandam", [14.4, 30.3, 66, 45.9], [27.1, 30.3, 40.7, 28.8]],
            ["VVIP Madhuban", [8.5, 41.8, 83.7, 20.7], [8.5, 41.8, 26, 20.7]],
            ["Lumora Estates", [10.4, 41.2, 79.4, 16.4], [48, 41.2, 15.5, 12.7]],
            ["Pincode Infra", [21.7, 37.6, 55.8, 19], [53.5, 37.6, 8.5, 13]],
            ["Gulshan Empire, Wave City", [17.1, 37.6, 71.1, 31.9], [50.7, 39.6, 19.9, 15.9]],
            ["GXP Goa Expressway", [5.1, 32.5, 90.7, 27.5], [34.8, 35.2, 31.7, 17.1]],
            ["Pincode Infra", [8.8, 38.3, 82.2, 27.1], [39.7, 41.5, 11.4, 10.7]],
            ["Highway Greens by Kinza Estate", [6.7, 37.3, 80, 18.6], [6.7, 37.3, 23.6, 18.2]],
          ] as const
        ).map(([client, logo, mark], index) => {
          const box = ([x, y, w, h]: readonly number[]) => ({ x, y, w, h });
          return {
            kind: "image" as const,
            src: `/portfolio/brand-identity/logo-${index + 1}.jpg`,
            alt: `${client} logo and brand identity by Ritz Media World`,
            caption: client,
            brand: { client, logo: box(logo), mark: box(mark) },
          };
        }).filter((item) => !HIDDEN_BRAND_IDENTITY.has(item.src)),
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
          {
            title: "Logo Design",
            copy: "Distinctive, timeless logos built on an idea, not a trend, and designed to work at every size.",
          },
          {
            title: "Brand Strategy",
            copy: "Positioning, personality, and messaging that set your brand apart from competitors.",
          },
          {
            title: "Visual Identity Design",
            copy: "A complete visual language, including marks, patterns, imagery and layouts.",
          },
          { title: "Brand Guidelines", copy: "Clear rules so every team and vendor uses your brand correctly." },
          {
            title: "Typography & Colour Palette",
            copy: "Type and colour choices that carry your brand's personality.",
          },
          {
            title: "Marketing & Brand Collateral",
            copy: "Stationery, brochures, signage and social templates that match your identity.",
          },
        ],
      },
      {
        title: "Our Brand Identity Design Process",
        kind: "steps",
        items: [
          { title: "Brand Discovery & Research", copy: "We study your business, audience, competitors and ambitions." },
          { title: "Brand Strategy", copy: "We define what your brand stands for and how it should feel." },
          {
            title: "Logo & Visual Concept Development",
            copy: "We explore several creative routes and refine the strongest.",
          },
          { title: "Brand Identity Design", copy: "The chosen route grows into a full identity system." },
          { title: "Brand Guidelines", copy: "Everything is documented so your brand stays consistent." },
          {
            title: "Final Brand Implementation",
            copy: "We roll the identity out across print, digital and on-ground.",
          },
        ],
      },
      {
        title: "Why Choose Ritz Media World for Brand Identity Design?",
        kind: "cards",
        items: [
          { title: "Strategic & Creative Approach", copy: "Ideas grounded in research, designed to stand out." },
          { title: "Consistent Brand Experience", copy: "One look and feel across every touchpoint." },
          { title: "Industry-Focused Branding", copy: "Identities shaped by how your industry and buyers think." },
          {
            title: "Scalable Brand Identity Systems",
            copy: "Systems that grow with new products, places and platforms.",
          },
          {
            title: "End-to-End Branding Solutions",
            copy: "From the first sketch to launch campaigns, under one roof.",
          },
        ],
      },
      {
        title: "Industries We Serve",
        kind: "chips",
        items: [
          { title: "Real Estate" },
          { title: "Healthcare" },
          { title: "Education" },
          { title: "Retail & E-commerce" },
          { title: "Startups" },
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
        q: "How much does logo design cost?",
        a: "The cost of logo design depends on the number of concepts, revisions, and the files and formats you need. A logo can be designed on its own or as part of a complete brand identity package, and we share a clear quote after understanding your brief.",
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
    tagline: "Hoardings, print ads, and social creatives that get noticed.",
    workTitle: ["Five formats", "68 pieces."],
    workLede: "Stationery · Hoardings · Print Ads · Social Media · Brochures",
    groups: [
      {
        title: "Stationery",
        aspect: "4 / 5",
        items: images("creative", "stationery", range(1, 14), "Stationery design", [
          "Lumora Estates",
          "Pincode Infra",
          "Gulshan Empire, Wave City",
          "Gulshan",
          "Blanco Thornton",
          "Mirage",
          "Highway Greens",
          "Kinza Estate",
          "Highway Greens",
          "Kinza Estate",
          "Highway Greens",
          "Fairfox",
          "Highway Greens",
          "Highway Greens",
        ]),
      },
      {
        title: "Hoardings",
        aspect: "4 / 5",
        items: images("creative", "ooh", [...range(1, 12), 15, 16, 17, 19], "Hoarding design", [
          "Fab Luxe",
          "RudraDhara",
          "GHD Group, Goa",
          "Ashtech Presidential Towers",
          "Gulshan Group",
          "Onyx by Splendor",
          "Onyx by Splendor, Zewar Lane",
          "Highway Greens",
          "Highway Greens",
          "North Wind Estates",
          "Gulshan Empire, Wave City",
          "Lumora Estates × Avacasa",
          "Renox Thrive",
          "Risland Sky Mansion",
          "Risland Sky Mansion",
          "Navrang Square by Renox Group",
        ]),
      },
      {
        title: "Print Ads",
        aspect: "4 / 5",
        items: images("creative", "print", range(1, 12), "Print ad design", [
          "Ashtech",
          "Ashtech Presidential Towers",
          "Gulshan Group",
          "Ashtech Presidential Towers",
          "Lumora Estates × Avacasa",
          "Contenaissance",
          "GHD Group, Goa",
          "GHD Group, Goa",
          "Gulshan Group",
          "Gulshan Empire, Wave City",
          "Veridia",
          "Veridia",
        ]),
      },
      {
        title: "Social Media",
        aspect: "4 / 5",
        items: images("creative", "social", [...range(1, 7), ...range(9, 21)], "Social media creative", [
          "Roots Courtyard 2",
          "Lumora Estates × Avacasa",
          "Onyx by Splendor",
          "Fab Luxe",
          "Gulshan Group",
          "Grace Resilviaa",
          "Highway Greens",
          "Highway Greens",
          "Highway Greens",
          "Highway Greens",
          "Highway Greens",
          "GHD Group, Goa",
          "Highway Greens",
          "Highway Greens",
          "Mansha",
          "Mansha",
          "Mansha",
          "Mansha",
          "Renox Thrive",
          "Renox Thrive",
        ]),
      },
      {
        title: "Brochure",
        aspect: "4 / 5",
        items: images("creative", "brochure", range(1, 6), "Brochure design", [
          "Kingsun",
          null,
          "KB Mart",
          "Aangan",
          "Gulshan Empire, Wave City",
          "Anantram",
        ]),
      },
    ],
    intro: {
      title: ["Made to be noticed,", "Built to be Remembered."],
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
          { title: "Hoarding Design", copy: "Hoardings, unipoles, and transit media designed to be read in seconds." },
          { title: "Print Ad Design", copy: "Newspaper and magazine ads that win attention on a crowded page." },
          { title: "Social Media Creatives", copy: "Feed posts, stories and campaign creatives built for engagement." },
          {
            title: "Brochure Design",
            copy: "Brochures and sales kits that tell your story clearly and look premium in hand.",
          },
          {
            title: "Stationery & Brand Collateral",
            copy: "Visiting cards, letterheads, and collateral that keep your brand consistent.",
          },
          {
            title: "Packaging & Key Visuals",
            copy: "Packaging and campaign key visuals that tie every format together.",
          },
        ],
      },
      { ...WHY_RMW, kicker: "Why Choose Us" },
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
      {
        q: "Do you design hoardings and outdoor ads?",
        a: "Yes. We design hoardings, unipoles, bus shelters, and transit media, sized and laid out so the message reads clearly from a distance and in a few seconds.",
      },
      {
        q: "How much do creative design services cost?",
        a: "The cost depends on the number of creatives, formats, and adaptations. A single creative costs less than a full campaign across print, outdoor and social, and we share a clear quote after understanding your brief.",
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
    tagline: "Fast, responsive websites built for real brands",
    workTitle: "Our Website Design Projects",
    workLede: "Real websites for real brands. Tap any project to see it up close.",
    groups: [
      {
        title: "Website Design",
        aspect: "4 / 5",
        items: [
          ["My Property Fact", "Real estate portal"],
          ["Saya Homes", "Real estate developer website"],
          ["Nova Vista Education", "Education website"],
          ["Contenaissance", "AI creative studio website"],
          ["Eldeco La Vida Bella", "Real estate project website"],
          ["India Forbes Global Properties", "Luxury real estate website"],
        ].map(([client, type], index) => ({
          kind: "image" as const,
          src: `/portfolio/web-design/site-${index + 1}.jpg`,
          full: `/portfolio/web-design/site-${index + 1}-full.jpg`,
          alt: `${client} website designed by Ritz Media World`,
          caption: `${client} · ${type}`,
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
      {
        title: WHY_RMW.title,
        kicker: "Why Choose Us",
        kind: "cards",
        items: [
          {
            title: "Built by marketers, not just developers",
            copy: "Every page, button, and form is designed to win enquiries, because we also run the ads and SEO that bring visitors in.",
          },
          {
            title: "Mobile-first by default",
            copy: "Every website is designed for phones first, then tested on tablets and desktops.",
          },
          {
            title: "SEO-ready from day one",
            copy: "Clean structure, fast loading, and search-friendly pages, so your website is ready to rank from launch.",
          },
          {
            title: "One team, from design to launch",
            copy: "Design, content, development, and SEO are handled under one roof, so nothing gets lost between teams.",
          },
        ],
      },
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
        q: "How much does website design cost?",
        a: "The cost depends on the number of pages, the features you need, and the platform, such as WordPress, Shopify, or a custom build. We share a clear quote after understanding your requirements.",
      },
      {
        q: "Do you design real estate project websites?",
        a: "Yes. We design real estate project websites with floor plans, amenities, location details, galleries, and lead forms, built to turn property searches into site-visit enquiries.",
      },
      {
        q: "Do you help with SEO and content?",
        a: "Yes. We build sites with SEO best practices and our content team can write pages that rank and convert.",
      },
    ],
    closing: "Let's Build Your Website",
    closingLede: "Planning a new website or a redesign? Let's build one that brings in enquiries.",
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
        items: [
          ["iiEgYU72mWg", "The Power of AI Storytelling", "AI storytelling and generative content brand film"],
          ["X-i-iN7urcM", "Not Just Content. Impact.", "Brand film on creating marketing impact"],
          ["OT4Dc214r3Q", "Client vs Creativity", "Client vs Creativity comedy sketch film"],
          ["-ih5T6UnZBw", "Built Different", "Built Different official music video"],
          ["Lp3i_u7O79o", "One Vision, Many Solutions", "One Vision, Many Solutions brand film for RMW Sky Baazaar"],
          ["a1Q9U0ezsyQ", "Black or White, Reimagined with AI", "Black or White reimagined with AI video"],
        ].map(([youtubeId, caption, description], index) => ({
          kind: "youtube" as const,
          src: `/portfolio/brand-films/film-${index + 1}.jpg`,
          alt: `${description} by Ritz Media World`,
          youtubeId,
          caption,
        })),
      },
    ],
    intro: {
      title: "Creating Powerful Brand Stories Through Film",
      copy: [
        "A great brand film makes people feel something about your brand. We write, shoot and edit films that tell your story with emotion and clarity, and give audiences a reason to remember you.",
        "By combining classic production with AI-powered video tools, we create cinematic films faster and in every format your audience watches, from YouTube and your website to Instagram Reels and WhatsApp.",
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
          { title: "Real Estate" },
          { title: "Healthcare" },
          { title: "Education" },
          { title: "Retail & E-commerce" },
          { title: "Corporate" },
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
        q: "What is AI-powered video production?",
        a: "AI-powered video production uses AI tools alongside traditional filming and editing to create visuals, extend scenes, and speed up post-production. It helps deliver high-quality films faster, especially for short promos and social media formats.",
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
    closing: "Let's Make a Film Your Audience Remembers",
    closingLede: "Have a story to tell? Let's bring it to the screen.",
    formCta: "Get My Free Consultation",
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
    h1: ["3D Walkthrough", "Videos"],
    tagline: "Photorealistic 3D tours of homes, towers, and amenities.",
    workTitle: "Our 3D Walkthrough Portfolio",
    workLede: "11 walkthroughs made for real projects. Tap any film to watch.",
    groups: [
      {
        title: "Walk-Through Videos",
        aspect: "4 / 5",
        items: youtube("walk-through-videos", "walk", [
          [
            "LMz36aAXPus",
            "RMW Estate",
            "3D walkthrough of the RMW Estate township entrance, gated boulevard and commercial frontage",
          ],
          [
            "M6Dm4SiqSsc",
            "Edelstein",
            "AI-powered CGI film of the Edelstein glass tower and landscaped entrance plaza",
          ],
          [
            "XRYVFJ5u_2g",
            "Trevoc Royal Residences",
            "Ultra-luxury 3D walkthrough of Trevoc Royal Residences on Golf Course Road, Gurugram",
          ],
          [
            "pbXiujM1QjM",
            "Vedvan Elemental Living",
            "3D visualisation of a wellness pavilion and lotus pond deck at Vedvan Elemental Living",
          ],
          [
            "T8GtiRWPvKM",
            "Forbes Global Properties",
            "Cinematic 3D interior tour of a Forbes Global Properties residence lobby",
          ],
          [
            "ukRR5iNZv4I",
            "Laadli Govindvan",
            "AI-powered 3D flythrough of the Laadli Govindvan township, gateway and gardens",
          ],
          [
            "xrhEXyUfBVM",
            "Maza Nahin Aaya?",
            "Maza Nahin Aaya? cinematic AI film on the client and agency creative process",
          ],
          ["hnG-LjQYP5k", "Gulshan", "Cinematic AI teaser film for Gulshan real estate"],
          [
            "TjveWflbrkM",
            "Northwind Estates",
            "AI-powered 3D walkthrough of the Northwind Estates residential project",
          ],
          ["ub6D5lHq6DU", "Vedvan", "AI real estate film of Vedvan's nature-inspired preventive living community"],
          ["4Z4ZOWnVJ4Y", "GHD", "AI-powered 3D walkthrough and real estate visualisation for GHD"],
        ]),
      },
    ],
    intro: {
      title: "Bring Your Spaces to Life",
      copy: [
        "Let buyers walk through your project long before construction begins. Our 3D walkthrough videos show every room, view, and amenity in rich, realistic detail.",
        "Built for real estate launches, interiors, and architecture, they help people picture themselves in the space, and that's what turns interest into site visits and bookings.",
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
          {
            title: "Interior Walkthroughs",
            copy: "Furnished, naturally lit tours of sample flats, lobbies and common areas.",
          },
          {
            title: "Amenity & Township Flythroughs",
            copy: "Aerial tours of clubhouses, landscapes and complete townships.",
          },
          {
            title: "Social Media Cut-Downs",
            copy: "Short versions of your walkthroughs sized for Reels, YouTube Shorts and WhatsApp.",
          },
        ],
      },
      {
        title: "Why Choose Ritz Media World?",
        kind: "cards",
        items: [
          {
            title: "Built for real estate sales",
            copy: "We've marketed real estate projects for years, so every walkthrough highlights what buyers actually ask about.",
          },
          {
            title: "Photorealistic detail",
            copy: "Accurate materials, natural lighting, and real surroundings make your project feel real, not computer-generated.",
          },
          {
            title: "Faster with AI-powered rendering",
            copy: "Our AI-powered workflow speeds up rendering, so walkthroughs are ready in time for your launch.",
          },
          {
            title: "Ready for every channel",
            copy: "We deliver full walkthroughs and short cuts for your website, sales gallery, YouTube, and social media.",
          },
        ],
      },
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
      {
        q: "What is the difference between a 3D render and a walkthrough video?",
        a: "A 3D render is a single still image of a space, while a walkthrough video is an animated tour that moves through it. Renders suit brochures and hoardings, while walkthroughs work best on websites, in sales galleries and on social media.",
      },
      {
        q: "How much does a 3D walkthrough video cost?",
        a: "The cost depends on the length of the video, the number of spaces shown, the level of detail, and the delivery timeline. We share a clear quote after reviewing your plans.",
      },
    ],
    closing: "Let's Create Your Video",
    closingLede: "Share your plans, and we'll bring your project to life in 3D.",
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
    tagline:
      "Creator videos made with Ritz Media World, where your brand's message is told in the creator's own style and reaches the followers who listen to them.",
    workTitle: "Our Influencer Marketing Work",
    groups: [
      {
        title: "Influencer Marketing Videos",
        aspect: "644 / 621",
        items: INFLUENCER_VIDEOS.map(([video, client], index) => ({
          kind: "video" as const,
          video,
          alt: client
            ? `${client} influencer marketing video by Ritz Media World`
            : `Influencer marketing video ${index + 1} by Ritz Media World`,
          ...(client ? { caption: client } : {}),
        })),
      },
    ],
    intro: {
      title: ["Influencer Campaigns", "That Went Live on Real Feeds"],
      copy: [
        "This is the influencer marketing portfolio of Ritz Media World: a collection of short-form creator videos made for brands across India. Each video was created for a real campaign and published on social media, where it reached the audience it was made for.",
        "Scroll through launch campaigns, local promotions and real estate stories to see how we pair each brand with the right creator, fit the script to how that creator speaks, and turn a brand message into a video people actually watch.",
      ],
    },
    blocks: [
      {
        title: ["Influencer Videos", "Built to Be Watched"],
        kicker: "What goes into every video",
        kind: "cards",
        items: [
          {
            title: "Creator Matching",
            copy: "Influencers chosen by niche, region, and language, so each video reaches viewers who matter to the brand.",
          },
          {
            title: "Script and Concept",
            copy: "Every video is built around one clear brand message and an opening that stops the scroll.",
          },
          {
            title: "Shot for Reels and Shorts",
            copy: "Vertical videos planned for Instagram Reels, YouTube Shorts, and Stories from the very first frame.",
          },
          {
            title: "Paid Promotion",
            copy: "The best-performing creator videos are boosted with paid ads and reused across the brand's own channels.",
          },
        ],
      },
      {
        title: ["Why Brands Choose", "Influencer Marketing?"],
        kind: "cards",
        items: [
          {
            title: "Borrowed trust",
            copy: "Viewers already trust the creator, so a recommendation from them feels like advice, not advertising.",
          },
          {
            title: "Niche and regional reach",
            copy: "Regional and niche creators reach specific cities, languages, and interests that broad ads often miss.",
          },
          {
            title: "Content people choose to watch",
            copy: "Creator videos appear in feeds people choose to follow, so they are more likely to be watched than skipped.",
          },
          {
            title: "Measurable results",
            copy: "Tracked links, promo codes and lead forms show which creators brought in enquiries and sales.",
          },
        ],
      },
    ],
    faqTitle: ["Questions about", "influencer marketing."],
    faqs: [
      {
        q: "Is Ritz Media World an influencer marketing agency?",
        a: "Yes. Ritz Media World is a full-service advertising agency headquartered in Noida, Delhi NCR, offering influencer marketing services to brands across India since 2008. Our influencer work is planned alongside creative, social media and digital marketing, so every campaign stays connected.",
      },
      {
        q: "Do you handle scripting and video production?",
        a: "Yes. We manage the full campaign, from concept and scripting to the shoot, approvals and paid promotion of the best-performing videos, so the creator can focus on delivering the content.",
      },
      {
        q: "Does influencer marketing work for real estate projects?",
        a: "Yes. Creator videos help developers show a project, its location and its lifestyle in a format buyers already watch. Several videos in this portfolio were made for real estate campaigns.",
      },
      {
        q: "How much does influencer marketing cost?",
        a: "The cost depends on the number of creators, their reach, the content needed and any paid promotion. We share a clear proposal after understanding your goals, so you know exactly what's included.",
      },
      {
        q: "How do you measure influencer campaign results?",
        a: "We report reach, views, engagement and audience response for every creator video. Where tracked links, promo codes or lead forms are used, we also report the enquiries and sales each creator brought in.",
      },
    ],
    closing: "Let's Create Something People Remember",
  },
];

export const getPortfolioDetail = (slug: string) => PORTFOLIO_DETAILS.find((detail) => detail.slug === slug);

/** Two-line section title in the homepage style: second half in the accent colour, ending in punctuation. */
export function splitTitle(title: PortfolioTitle) {
  if (Array.isArray(title)) {
    const [lead, accent] = title;
    return [{ text: lead }, { text: /[.?!]$/.test(accent) ? accent : `${accent}.`, accent: true }];
  }
  const text = title;
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
