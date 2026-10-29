export interface ServiceCapability {
  title: string;
  copy: string;
  details?: string[];
  icon?: string;
  /** Slug of the matching sub-service page under this service, if one exists. */
  subService?: string;
}

export interface ServiceProcessStep {
  step: string;
  km: string;
  title: string;
  copy: string;
}

export interface ServicePoint {
  title: string;
  copy: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

/**
 * Copy for the shared sub-service page layout. Every field is optional;
 * `getServiceLayout` fills anything missing with service-aware defaults.
 */
export interface ServiceLayoutCopy {
  problemSummary?: string;
  processTitle?: string;
  faqTitle?: { lead: string; accent: string };
  planTitle?: string;
  problemFlags?: ServicePoint[];
  planKicker?: string;
  planLede?: string;
  planCta?: string;
  intentTitle?: { lead: string; accent: string };
  intentPoints?: ServicePoint[];
  intentTape?: [string, string];
  wallKicker?: string;
  wallTitle?: string;
  wallLede?: string;
  hideProof?: boolean;
  /** Optional illustrated sign; an HTML sign is rendered when omitted. */
  requirementsSign?: { src: string; alt: string };
  faqs?: ServiceFaq[];
}

export interface ServiceDetail {
  id: string;
  slug: string;
  name: string;
  uppercaseName: string;
  engine: string;
  engineCategory?: string;
  badgeDate?: string;
  kicker: string;
  /** Two-line hero H1; the service name is used when omitted. */
  heroTitle?: { lead: string; accent: string };
  tagline: string;
  heading: string;
  shortDescription: string;
  fullOverview: string;
  definitionText?: string;
  cardTags?: string[];
  truckArt?: { before: string; hindi: string; after: string };
  layout?: ServiceLayoutCopy;
  problemKicker?: string;
  problemHeading?: string;
  problemCopy?: string;
  image: string;
  accentColor: string;
  tags: string[];
  stats: {
    value: string;
    label: string;
  }[];
  capabilities: ServiceCapability[];
  deliverables: string[];
  process: ServiceProcessStep[];
  whyUs: {
    title: string;
    copy: string;
  }[];
}

const DIGITAL_WHY_US: ServicePoint[] = [
  {
    title: "Creative and Media Under One Roof",
    copy: "No gap between the people who make the ads and the people who run them. Copy, creative, video, and targeting are built by one team, so every campaign stays consistent.",
  },
  {
    title: "Qualified Leads, Not Vanity Likes",
    copy: "We judge performance by qualified leads, cost per acquisition, and revenue contribution, not likes, followers, or impressions alone.",
  },
  {
    title: "Experience Across Key Indian Sectors",
    copy: "From real estate to education, e-commerce, and manufacturing, we understand what drives Indian customers in each market.",
  },
  {
    title: "Certified Google and Meta Partner",
    copy: "As a Google Partner and Meta Business Partner, we work with the latest platform tools, training, and best practices on every campaign.",
  },
];

export const SERVICES_LIST: ServiceDetail[] = [
  {
    id: "digital",
    slug: "digital-marketing",
    name: "Digital Marketing",
    uppercaseName: "DIGITAL MARKETING",
    engine: "Engine Two · Digital & Media",
    kicker: "KM 05 · Performance on the road",
    heroTitle: { lead: "Digital Marketing Agency", accent: "that turns clicks into customers." },
    tagline: "Turn attention, clicks, and searches into qualified enquiries and measurable business growth.",
    heading: "Digital marketing solutions built for sustainable commercial growth",
    shortDescription:
      "Full-funnel SEO, Meta & Google PPC, reputation management, and high-converting lead engines across India.",
    definitionText:
      "Digital marketing uses online channels such as search, social media, paid ads, and websites to reach customers and turn their interest into enquiries and sales.",
    fullOverview:
      "Ritz Media World is a results-first digital marketing agency helping brands turn attention into actual business growth. Over 18 years, we have mastered every shift in the Indian digital ecosystem, from search and programmatic display to viral social content and AI search answers. We engineer campaigns with clear cost-per-lead (CPL) benchmarks, conversion rate optimization, and transparent tracking so every rupee spent delivers measurable ROI.",
    image:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#1457a8",
    tags: ["SEO", "Google PPC", "Meta Ads", "ORM", "Lead Generation", "AI Search"],
    stats: [
      { value: "+250%", label: "Average Organic Traffic Growth" },
      { value: "-40%", label: "Reduction in Cost Per Qualified Lead" },
      { value: "50M+", label: "Targeted Audience Reach Delivered" },
      { value: "18+", label: "Years Navigating Indian Markets" },
    ],
    capabilities: [
      {
        title: "Search Engine Optimization (SEO)",
        copy: "For us, SEO is about relevance and long-term authority, not just rankings. We build strategies around search intent and customer behaviour, so the right people find your business on Google and take the next step.",
        subService: "search-engine-optimization-seo",
      },
      {
        title: "AIO & GEO Optimization",
        copy: "Customers increasingly ask ChatGPT, Gemini, Perplexity, and Google AI Overviews instead of clicking through search results. We make sure your brand is the one these tools cite and recommend when people ask about your category.",
        details: [
          "Schema markup",
          "Answer-first content",
          "Entity building",
          "Third-party mentions",
        ],
      },
      {
        title: "Social Media Marketing (SMM)",
        copy: "We don’t post just to stay active. We plan content, creative, and community management that keep your brand visible and relevant, and build real relationships with the audience that matters to your business.",
        subService: "social-media-management",
      },
      {
        title: "Online Reputation Management (ORM)",
        copy: "Customers check reviews before they ever contact you. We help you monitor what people say, respond thoughtfully, and build more reasons for customers to trust your brand, because reputation management is about listening, not hiding feedback.",
        subService: "orm-in-digital-marketing",
      },
      {
        title: "Pay Per Click (PPC) Advertising",
        copy: "When customers are actively searching, being visible at the right moment makes all the difference. We plan Google and Meta campaigns around your audience, budget, and goals, and optimise them for enquiries rather than clicks.",
        subService: "ppc-google-ads-agency",
      },
      {
        title: "Lead Generation",
        copy: "Attention is only the beginning. We connect your business with people who have a genuine interest in what you offer, and focus on the quality and intent of every lead, not just the number.",
        subService: "lead-generation",
      },
      {
        title: "Brand Awareness",
        copy: "Before people choose a business, they need to know it exists. We combine content, social media, advertising, and search visibility so your brand is recognised, remembered, and considered when your audience is ready to decide.",
        subService: "brand-awareness",
      },
    ],
    deliverables: [
      "Full Technical SEO & Backlink Authority Audit",
      "Multi-Channel Paid Ads Media Plan & Creative Toolkits",
      "Real-Time Conversion Tracking & Attribution Dashboards",
      "Daily Bid Management & Negative Keyword Sculpting",
      "A/B Tested Landing Pages Designed For Conversion",
      "Executive Bi-Weekly Performance & Pipeline Reports",
    ],
    process: [
      {
        step: "01",
        km: "KM 01",
        title: "Discovery & Market Audit",
        copy: "We study your business, audience, competitors, and current performance across search, social, and ads, so we know where the real opportunities are before any budget is spent.",
      },
      {
        step: "02",
        km: "KM 02",
        title: "Strategy & Funnel Blueprint",
        copy: "We define the channel mix, target keywords, content and creative plan, and the results we’ll measure, all mapped to your business goals.",
      },
      {
        step: "03",
        km: "KM 03",
        title: "Execution & Real-Time Testing",
        copy: "Campaigns, content, and optimisations go live in focused sprints, and we test different messages, creatives, and landing pages to find what works fastest.",
      },
      {
        step: "04",
        km: "KM 04",
        title: "Scale & Retention Optimization",
        copy: "We scale what’s working, cut what isn’t, and use remarketing and retention to bring customers back, so your cost per lead keeps falling over time.",
      },
    ],
    whyUs: DIGITAL_WHY_US,
    layout: {
      problemFlags: [
        {
          title: "Visibility without visitors",
          copy: "If customers can’t find you on Google, in AI answers, or in their feeds, even great work goes unseen.",
        },
        {
          title: "Spend without a system",
          copy: "When strategy, creative and media are planned in silos, budget leaks between them.",
        },
        {
          title: "Reports without answers",
          copy: "If you cannot see what actually moved enquiries, you cannot decide what to do next.",
        },
      ],
      intentTitle: { lead: "Built to perform,", accent: "Not just to post" },
      intentPoints: DIGITAL_WHY_US,
      faqs: [
        {
          question: "What digital marketing services does Ritz Media World offer?",
          answer:
            "Ritz Media World offers SEO, AIO and GEO optimization, social media marketing, online reputation management, PPC advertising, lead generation, and brand awareness campaigns. As a digital marketing agency in Noida serving brands across India, we plan these services together so every channel works towards the same business goal.",
        },
        {
          question: "How do I choose the best digital marketing agency in Noida?",
          answer:
            "Look for an agency with proven experience, real results it can show you, certified platform partnerships, and transparent reporting. Ritz Media World has 18 years of experience in advertising, is a Google Partner and Meta Business Partner, and reports on leads and cost per lead rather than likes and impressions.",
        },
        {
          question: "Do you offer PPC services in Delhi NCR?",
          answer:
            "Yes. Ritz Media World plans and manages Google Ads and Meta Ads campaigns for businesses in Delhi, Noida, and across India. As a Google Partner and Meta Business Partner, we optimise every campaign for qualified enquiries and track results from the first click to the final lead.",
        },
        {
          question: "Do you provide digital marketing for real estate developers?",
          answer:
            "Yes. Real estate is one of our core sectors. Ritz Media World runs real estate lead generation, Google and Meta campaigns, SEO, and launch marketing for developers in Noida, Delhi NCR, and across India, and was named Best Creative Agency (Real Estate) in Delhi NCR by Big FM in 2024 and 2025.",
        },
        {
          question: "Can you help our brand appear in ChatGPT and Google AI Overviews?",
          answer:
            "Yes. Our AIO and GEO services help brands get cited by ChatGPT, Gemini, Perplexity, and Google AI Overviews through schema, answer-first content, entity building, and third-party mentions, which are the signals AI tools rely on when recommending brands.",
        },
        {
          question: "How much do digital marketing services cost?",
          answer:
            "The cost depends on the services you need and your advertising budget. Ritz Media World recommends a plan after understanding your goals and market, and every proposal shows clearly where your money goes.",
        },
      ],
    },
  },
  {
    id: "creative",
    slug: "creative-services",
    name: "Creative Services",
    uppercaseName: "CREATIVE SERVICES",
    engine: "Engine One · Brand & Creative",
    kicker: "KM 01 · Make people stop and remember",
    heroTitle: { lead: "Creative Services", accent: "built to be remembered." },
    tagline:
      "Brand identities, design, packaging, and ad campaigns that cut through the clutter and stay in people’s minds.",
    heading: "Creative craft, brand platforms, and ideas people actually remember",
    shortDescription:
      "Branding & identity, packaging design, ad films, and visual communication that give businesses an enduring voice.",
    definitionText:
      "Creative services cover the design and ideas that shape how people see a brand, from logos and brand identity to graphic design, print ads, packaging, and advertising campaigns.",
    fullOverview:
      "Ritz Media World is a creative agency in India that turns business goals into brand identities and campaigns people remember. From logos and brand systems to print ads, packaging, and launch campaigns, we believe creative work shouldn’t just look good. It should travel across screens, hoardings, and conversations, and build lasting trust in the customer’s mind.",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#cf1b4b",
    tags: ["Brand Identity", "Graphic Design", "Logo Design", "Packaging", "Ad Campaigns", "Art Direction"],
    stats: [
      { value: "300+", label: "Brands Served" },
      { value: "18+", label: "Years In Strategic Brand Craft" },
      { value: "100%", label: "In-House Strategy & Production" },
      { value: "100+", label: "Creative Minds On The Team" },
    ],
    capabilities: [
      {
        title: "Branding & Identity Development",
        copy: "Brand identities built around your values, market position, and how you want to be seen, whether you’re launching, rebranding, or entering a new market.",
        details: [
          "Brand Strategy & Positioning",
          "Visual Identity Systems",
          "Brand Guidelines",
          "Brand Naming",
          "Rebranding",
          "Launch Identities",
        ],
      },
      {
        title: "Graphic Design",
        copy: "Design that tells customers who you are before they read a word, built for the platform it will live on rather than one template stretched across everything.",
        details: [
          "Marketing Collateral",
          "Corporate Brochures & Profiles",
          "Social Media Creatives",
          "Presentations",
          "Promotional Assets",
          "Event & Exhibition Graphics",
        ],
      },
      {
        title: "Logo Design",
        copy: "Logos that work everywhere they need to, from packaging and print to screens and signage, and still make sense five years from now.",
        details: [
          "Custom Logo Design",
          "Logo Refresh & Redesign",
          "Product & Sub-brand Marks",
          "Scalable Logo Systems",
          "Digital, Print & Packaging Formats",
          "Logo Usage Guidelines",
        ],
      },
      {
        title: "Print Advertising Design",
        copy: "Print ads, brochures, and catalogues designed to make people stop and pay attention, with layouts built for real-world printing, not just screens.",
        details: [
          "Newspaper & Magazine Ads",
          "Brochures & Flyers",
          "Posters & Catalogues",
          "Hoardings & Outdoor Creative",
          "Banners & Standees",
          "Print-Ready Artwork",
        ],
      },
      {
        title: "Packaging Design",
        copy: "Packaging that earns the moment someone decides to buy, whether it’s on a shelf or arriving at their door.",
        details: [
          "Product & Box Design",
          "Label Design",
          "FMCG Packaging",
          "E-commerce Packaging",
          "Luxury & Gift Packaging",
          "Production-Ready Artwork",
        ],
      },
    ],
    deliverables: [
      "Complete Brand Identity Bible (Typography, Palette, Grid)",
      "High-Resolution Vector Logo System with Usage Guidelines",
      "Master Campaign Key Visuals (KV) for Digital & Print",
      "Production-Ready Packaging Dielines & Print Proofs",
      "Copywriting Manifestos, Taglines, and Voice Guidelines",
      "Comprehensive Digital & Social Asset Templates",
    ],
    process: [
      {
        step: "01",
        km: "KM 01",
        title: "Brand Discovery & Audience Research",
        copy: "We learn what your brand stands for, how your competitors present themselves, and what your audience truly responds to.",
      },
      {
        step: "02",
        km: "KM 02",
        title: "Strategy & Creative Concepts",
        copy: "We present distinct creative routes with moodboards, sample headlines and mock layouts, so we agree on the right direction together.",
      },
      {
        step: "03",
        km: "KM 03",
        title: "Design, Production & Refinement",
        copy: "Every line, colour and layout is refined and tested across real formats, from mobile screens to hoardings.",
      },
      {
        step: "04",
        km: "KM 04",
        title: "Rollout & Brand Consistency",
        copy: "We deliver complete, ready-to-use files and brand guidelines, and support your team so the brand stays consistent everywhere it appears.",
      },
    ],
    whyUs: [
      {
        title: "Ideas grounded in business goals",
        copy: "We don’t create work just to win awards. Every idea is built to help customers choose your brand.",
      },
      {
        title: "18 years of understanding Indian audiences",
        copy: "We understand regional cultures, languages, and the visual cues that build genuine trust with Indian customers.",
      },
      {
        title: "Built for every format",
        copy: "From a highway hoarding to a phone screen, our creative is designed to work at every size and on every channel.",
      },
    ],
    layout: {
      problemFlags: [
        {
          title: "Noise without recall",
          copy: "Work that looks like everyone else's gets scrolled past and forgotten before it can sell.",
        },
        {
          title: "Inconsistent everywhere",
          copy: "When your logo, ads, and packaging all look different, customers struggle to recognise you, let alone trust you.",
        },
        {
          title: "Design without direction",
          copy: "Creative made without a clear strategy may look good, but it rarely moves the business forward.",
        },
      ],
      planKicker: "Creative services",
      wallLede: "Campaigns and creatives from brands that trusted us with their name.",
      intentTitle: { lead: "Designed to be noticed,", accent: "Built to be remembered." },
      faqs: [
        {
          question: "What creative services does Ritz Media World offer?",
          answer:
            "Ritz Media World offers branding and identity development, logo design, graphic design, print advertising design, packaging design, and ad campaign concepts. As a creative agency in Noida serving brands across India, we keep every piece consistent across print, digital, outdoor, and packaging.",
        },
        {
          question: "Is Ritz Media World a creative agency in Noida?",
          answer:
            "Yes. Ritz Media World is a full-service creative advertising agency headquartered in Sector 142, Noida, founded in 2008. We provide creative services across Delhi NCR, including Noida, Greater Noida, and Delhi, and work with brands throughout India.",
        },
        {
          question: "How do I choose the best creative agency for my brand?",
          answer:
            "Look for an agency with a strong portfolio, experience in your industry, a clear creative process, and work that has run for real brands. Ritz Media World has 18 years of creative experience and was named Best Creative Agency (Real Estate) in Delhi NCR by Big FM in 2024 and 2025.",
        },
        {
          question: "Are you a creative agency for real estate developers?",
          answer:
            "Yes. Real estate is one of our core sectors. Ritz Media World creates brand identities, launch campaigns, print ads, hoardings, and brochures for real estate developers in Noida, Delhi NCR, and across India.",
        },
        {
          question: "What is the difference between a logo and a brand identity?",
          answer:
            "A logo is a single mark, while a brand identity is the complete visual system around it, including colours, typography, imagery, and guidelines. A strong identity keeps your brand consistent and recognisable everywhere customers see it.",
        },
        {
          question: "How long does a branding project take?",
          answer:
            "It depends on the scope. A logo or campaign creative can take a few weeks, while a complete brand identity with guidelines usually takes longer. We agree on timelines and milestones before work begins.",
        },
        {
          question: "How much do creative services cost?",
          answer:
            "The cost depends on the scope, from a single logo or campaign to a full brand identity. We share a clear proposal after understanding your goals, so you know exactly what’s included.",
        },
      ],
    },
  },
  {
    id: "print",
    slug: "print-advertising",
    name: "Print Advertising",
    uppercaseName: "PRINT ADVERTISING",
    engine: "Engine Two · Digital & Media",
    kicker: "KM 06 · Ink that stops a reader",
    heroTitle: { lead: "Print Advertising", accent: "that gets read." },
    tagline:
      "Newspaper and magazine advertising, designed to be noticed, placed where your audience reads, and booked at the right rate.",
    heading: "Print advertising that still stops a reader in their tracks",
    shortDescription:
      "National daily front-pages, high-visibility highway hoardings, airport media, and prestige magazine spreads.",
    definitionText:
      "Print advertising means placing ads in newspapers, magazines, and other printed publications to reach readers in specific cities, languages, and audience groups.",
    fullOverview:
      "In a world of endless scrolling, a newspaper ad still carries trust and staying power. As a member of the Indian Newspaper Society, Ritz Media World plans, designs, and books print advertising across leading publications such as The Times of India, Hindustan Times, and Dainik Jagran, as well as regional newspapers and magazines across India.",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#1e3a8a",
    tags: ["Newspaper Ads", "OOH Hoardings", "Magazines", "Transit Media", "Airport Ads", "Media Buying"],
    stats: [
      { value: "10,000+", label: "Print & Outdoor Ads Published" },
      { value: "30-40%", label: "Average Media Buying Savings" },
      { value: "National", label: "Pan-India Publication Network" },
      { value: "18+", label: "Years Print Leadership" },
    ],
    capabilities: [
      {
        title: "Advertisement Design",
        copy: "A print ad has about two seconds to earn a second look. We design creatives around your brand and campaign goal, with layouts built for attention and clarity.",
        details: [
          "Newspaper Ad Design",
          "Magazine Ad Design",
          "Brochure & Flyer Design",
          "Front Page Jacket Design",
          "Multi-Publication Adaptations",
          "Consistent Brand Layouts",
        ],
        subService: "advertisement-designing",
      },
      {
        title: "Ad Placement",
        copy: "Good creative in the wrong publication is wasted spend. We use readership data to place your ad where the right audience will actually see it.",
        details: [
          "Newspaper Selection",
          "Edition & City Targeting",
          "Page & Position Selection",
          "Magazine Placement",
          "Regional & Language Editions",
          "Pan-India Campaigns",
        ],
        subService: "ad-placements",
      },
      {
        title: "Copywriting",
        copy: "Nobody reads an ad; they scan it. We write headlines and copy that earn the rest of the read and give people a reason to respond.",
        details: [
          "Headlines & Taglines",
          "Ad Body Copy",
          "Calls to Action",
          "Brochure Copy",
          "Brand-Consistent Messaging",
        ],
        subService: "copywriting",
      },
      {
        title: "Cost Negotiation",
        copy: "We negotiate directly with publishers, using established relationships to secure better rates and placements, so every rupee buys real visibility.",
        details: [
          "Publisher Rate Negotiation",
          "Package & Combo Deals",
          "Premium Position Booking",
          "Transparent Cost Breakdowns",
          "Budget Planning",
          "Media Buying",
        ],
        subService: "negotiating-rates",
      },
      {
        title: "Ad Size Optimization",
        copy: "Bigger isn’t always better. We recommend the size and format your ad actually needs, so it gets noticed without wasting budget.",
        details: [
          "Front Page Jackets",
          "Full & Half Page Ads",
          "Quarter Page Ads",
          "Strip & Ear Panels",
          "Classified Display Ads",
          "Size-to-Budget Planning",
        ],
        subService: "ad-size-optimization",
      },
      {
        title: "Ad Scheduling",
        copy: "The same ad, run on the wrong day, barely registers. We time your releases around launches, festivals, and weekends, when your audience is paying attention.",
        details: [
          "Launch Timing",
          "Festive & Seasonal Planning",
          "Weekend & Supplement Releases",
          "Frequency Planning",
          "Multi-Edition Scheduling",
          "Release Verification",
        ],
        subService: "advertisement-scheduling",
      },
    ],
    deliverables: [
      "Custom Pan-India Print Media Scheduling & Rate Plan",
      "High-Resolution Print-Ready Artwork (CMYK / ISO profiles)",
      "Release Orders (RO) & Verified Publication Tear-Sheets",
      "OOH Geotagged Site Audits & Illumination Verification",
      "Circulation & Audience Demographic Reports",
      "Crisis Replacement & Placement Guarantee Support",
    ],
    process: [
      {
        step: "01",
        km: "KM 01",
        title: "Requirement & Audience Analysis",
        copy: "We understand your goal, budget, and audience, and identify the publications, editions, and cities that reach them.",
      },
      {
        step: "02",
        km: "KM 02",
        title: "Media Planning & Rate Negotiation",
        copy: "We build a media plan and negotiate rates and positions with publishers on your behalf.",
      },
      {
        step: "03",
        km: "KM 03",
        title: "Ad Design & Approval",
        copy: "Headlines and layouts are designed for print, sized to the paper’s column grid and shared with you for approval.",
      },
      {
        step: "04",
        km: "KM 04",
        title: "Booking, Release & Reporting",
        copy: "We book the ad, check each insertion once the paper is out, and share proof of publication with you.",
      },
    ],
    whyUs: [
      {
        title: "Member of the Indian Newspaper Society",
        copy: "Our INS accreditation and established publisher relationships help us secure better rates and strong positions for your ads.",
      },
      {
        title: "Print design that works on paper",
        copy: "Our in-house team designs for real newsprint and magazine paper, so your ad looks as good printed as it does on screen.",
      },
      {
        title: "A print innovator since 2012",
        copy: "We pioneered centrespread storytelling in Hindustan Times, and we’ve been helping brands make print memorable ever since.",
      },
    ],
    layout: {
      problemFlags: [
        {
          title: "Right ad, wrong paper",
          copy: "A great ad in the wrong edition reaches readers who will never buy.",
        },
        {
          title: "Paying the rate card",
          copy: "Without publisher relationships, brands often pay more for the same space.",
        },
        {
          title: "Seen but skipped",
          copy: "A crowded page gives an ad about two seconds. Weak design and copy lose that moment.",
        },
      ],
      wallLede: "Print campaigns from brands that trusted us with their name.",
      intentTitle: { lead: "Ads that earn", accent: "The second look." },
      faqs: [
        {
          question: "What print advertising services does Ritz Media World offer?",
          answer:
            "Ritz Media World offers newspaper and magazine advertising, including ad design, placement, copywriting, rate negotiation, size optimisation, and scheduling. As a print advertising agency in Noida, we book ads in leading national and regional publications across India.",
        },
        {
          question: "How much does newspaper advertising cost?",
          answer:
            "The cost of a newspaper ad depends on the publication, edition, city, ad size, page position, and release date. Share your requirements, and we’ll send a media plan with negotiated rates.",
        },
        {
          question: "How do I book a matrimonial ad in Hindustan Times?",
          answer:
            "Share your ad text, preferred editions, and release date with us, and we’ll suggest the right format, confirm the cost, and book your Hindustan Times matrimonial ad.",
        },
        {
          question: "Can I advertise in multiple newspapers at once?",
          answer:
            "Yes. We plan and book multi-publication campaigns across national and regional newspapers, so your ad runs in all the right editions at the same time.",
        },
        {
          question: "How long does newspaper ad booking take?",
          answer:
            "Many newspaper ads can be booked within a few days, depending on the publication’s deadlines and the ad type. Front-page and premium positions usually need more notice, so we recommend planning ahead.",
        },
      ],
    },
  },
  {
    id: "radio",
    slug: "radio-advertising",
    name: "Radio Advertising",
    uppercaseName: "RADIO ADVERTISING",
    engine: "Engine Two · Digital & Media",
    kicker: "KM 07 · Sound that earns a second listen",
    heroTitle: { lead: "Radio Advertising", accent: "Heard once, remembered long." },
    tagline:
      "FM radio ads conceptualised, scripted, voiced, produced, and booked in-house, so your brand is heard in the right cities, at the right time.",
    heading: "FM radio ads with writing that sounds like people, not a script",
    shortDescription:
      "Radio jingles, FM network spot buying, commute prime-time scheduling, and podcast audio sponsorships.",
    definitionText:
      "Radio advertising means running short audio ads, such as spots and jingles, on FM stations to reach listeners in specific cities, languages and times of day.",
    fullOverview:
      "When people drive to work, get stuck in traffic, or relax at home, radio has their full attention. Ritz Media World creates radio ads that stick in listeners' ears and plans media across leading FM stations, from single-city campaigns to campaigns across India.",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#f07828",
    tags: ["FM Advertising", "Radio Jingles", "Voiceover Casting", "Media Buying", "Podcast Audio", "Sonic Branding"],
    stats: [
      { value: "98.3%", label: "Ear Recall On Signature Jingles" },
      { value: "50+ Cities", label: "Radio Network Coverage" },
      { value: "1,200+", label: "Radio Spots Scripted & Produced" },
      { value: "18+", label: "Years Audio Excellence" },
    ],
    capabilities: [
      {
        title: "Concept Development",
        copy: "One big idea built for the ear: a hook, a format and a sound people remember after one listen.",
        details: [
          "Your Campaign Objective",
          "Audience & Listener Insight",
          "Creative Concepts",
          "Storytelling & Emotion",
          "Brand Integration",
          "Launch & Festive Campaign Ideas",
        ],
        subService: "advertisement-concept-development",
      },
      {
        title: "Scriptwriting",
        copy: "Scripts written in your brand voice, with a clear call to action in every spot.",
        details: [
          "10, 20, 30 & 60-Second Spots",
          "Hindi & English Scripts",
          "Dialogue & Narrative Formats",
          "Jingle Lyrics",
          "Calls to Action",
          "Industry-Specific Scripts",
        ],
        subService: "scriptwriting",
      },
      {
        title: "Voiceover Casting",
        copy: "The right voice can do more for a brand than the script itself. We match your campaign with voices your audience responds to.",
        details: [
          "Male & Female Voice Artists",
          "Bilingual Voices",
          "Regional-Language Voices",
          "Character Voices",
          "Voice Auditions",
          "Guided Recording Sessions",
        ],
        subService: "voiceover-casting",
      },
      {
        title: "Recording & Production",
        copy: "Studio recording, music, sound design and mastering that turn a finished script into a broadcast-ready ad.",
        details: [
          "Studio Recording",
          "Custom Jingles",
          "Music & Sound Design",
          "Editing & Mixing",
          "Broadcast Mastering",
          "Quality Checks Before Airing",
        ],
        subService: "recording-and-production",
      },
      {
        title: "Media Planning",
        copy: "Stations, time slots, and languages chosen by city-wise listenership, so your ad reaches the right people without wasted spend.",
        details: [
          "Station Selection",
          "Time Slot Planning",
          "City & Language Targeting",
          "Multi-City Campaigns",
          "Pan-India Planning",
          "Budget Allocation",
        ],
        subService: "media-planning-and-buying",
      },
      {
        title: "Cost Negotiation",
        copy: "Better rates and premium slots through established FM network relationships, with transparent cost breakdowns.",
        details: [
          "Rate Negotiation",
          "Premium Slot Booking",
          "Value-Added Packages",
          "Transparent Media Plans",
          "Booking & Scheduling",
          "Airing Monitoring",
        ],
        subService: "radio-cost-negotiation-india",
      },
    ],
    deliverables: [
      "Targeted City-Wise FM Frequency & Media Plan",
      "Original Script Concepts (10s, 20s, 30s Formats)",
      "Master Broadcast Audio WAV/MP3 Files (Broadcast Spec)",
      "Sonic Logo & Audio Identity Assets",
      "Station Airing Logs & Proof-of-Broadcast Reports",
      "On-Air RJ Talkpoint Guides & Contest Briefs",
    ],
    process: [
      {
        step: "01",
        km: "KM 01",
        title: "Message & Hook Strategy",
        copy: "We define the one thought a listener must remember, even while driving through busy city traffic.",
      },
      {
        step: "02",
        km: "KM 02",
        title: "Scriptwriting & Voice Auditions",
        copy: "We write natural, conversational scripts and audition voices to find the right tone for your brand.",
      },
      {
        step: "03",
        km: "KM 03",
        title: "Studio Production & Jingles",
        copy: "We record, compose music, add sound effects, and master each ad to FM broadcast standards.",
      },
      {
        step: "04",
        km: "KM 04",
        title: "Broadcast & Monitoring",
        copy: "Your ads air on the planned stations and time slots, and we check airing reports to confirm every spot ran as booked.",
      },
    ],
    whyUs: [
      {
        title: "Writing that sounds like real life",
        copy: "No tired radio clichés. Our scripts sound like real conversations people actually enjoy listening to.",
      },
      {
        title: "Relationships across leading FM networks",
        copy: "Established relationships with FM networks help us secure competitive rates and premium slots for your campaigns.",
      },
      {
        title: "Recognised by the radio industry",
        copy: "Red FM 93.5 and Big FM named us Best Creative Agency (Real Estate) in Delhi NCR in 2024 and 2025.",
      },
    ],
    layout: {
      problemFlags: [
        {
          title: "Forgotten after one play",
          copy: "Radio has no visuals, so an ad without a strong idea is gone the moment it ends.",
        },
        {
          title: "Right ad, wrong slot",
          copy: "A great spot aired when your audience isn’t listening is wasted airtime.",
        },
        {
          title: "Paying full rate",
          copy: "Without network relationships, brands often pay more for the same airtime.",
        },
      ],
      wallKicker: "Awards & Recognition",
      wallTitle: "Recognised for Making Waves on Radio.",
      wallLede:
        "From impactful radio campaigns to industry recognition, our journey reflects the power of strategic media planning, creative storytelling, and effective radio advertising. Explore the milestones that celebrate our work in the radio advertising industry.",
      intentTitle: { lead: "Ads people turn up,", accent: "not tune out." },
      hideProof: true,
      faqs: [
        {
          question: "What radio advertising services does Ritz Media World offer?",
          answer:
            "Ritz Media World offers end-to-end FM radio advertising, including concept development, scriptwriting, voiceover casting, recording and production, media planning, and media buying with rate negotiation. We run campaigns in Delhi NCR and across India.",
        },
        {
          question: "How much does radio advertising cost?",
          answer:
            "Radio advertising costs depend on the station, city, time slot, spot length, and number of airings. Share your goals and budget, and we’ll send a media plan with negotiated rates.",
        },
        {
          question: "Do you provide radio ad services in Delhi and Noida?",
          answer:
            "Yes. Ritz Media World is based in Noida and plans, produces, and books radio ads on FM stations in Delhi, Noida, and across Delhi NCR, as well as multi-city and pan-India campaigns.",
        },
        {
          question: "How long should a radio ad be?",
          answer:
            "Most radio ads run for 10, 20, 30, or 60 seconds. Shorter spots work well for reminders and offers, while 30- and 60-second spots give more room for storytelling.",
        },
        {
          question: "Which FM station is best for my brand?",
          answer:
            "The best station depends on your audience, city, and goal. We study listenership by station, time slot, and language to recommend the mix that reaches your customers.",
        },
      ],
    },
  },
  {
    id: "content",
    slug: "content-marketing",
    name: "Content Marketing",
    uppercaseName: "CONTENT MARKETING",
    engine: "Engine One · Brand & Creative",
    kicker: "KM 02 · Words with a mission",
    heroTitle: { lead: "Content Marketing Services", accent: "that rank, read, and convert." },
    tagline:
      "From SEO content and blogs to website copy, social media, and email, our content marketing services help brands in Delhi NCR and across India get found, earn trust, and turn readers into enquiries.",
    heading: "Content with a purpose, planned around what your customers search for",
    shortDescription:
      "Articles, email newsletters, whitepapers, thought leadership, and organic content that converts readers into buyers.",
    definitionText:
      "Content marketing is creating useful content, such as blogs, website copy, social posts, and emails, that attracts the right audience and turns readers into customers.",
    fullOverview:
      "Content marketing isn’t about filling a calendar with generic posts. Our content marketing services start with real search intent, so every blog, web page, social post, and email answers what your customers are actually looking for. Our content writers and SEO specialists create content that ranks on Google, appears in AI answers, and moves readers closer to becoming customers, bringing in steady organic traffic and qualified leads rather than just likes.",
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#c83256",
    tags: ["Content Strategy", "Email Newsletters", "Thought Leadership", "Whitepapers", "Infographics", "AEO"],
    stats: [
      { value: "3x", label: "Higher Lead Generation Than Outbound" },
      { value: "65%", label: "Lower Cost Per Lead Over Time" },
      { value: "10,000+", label: "High-Ranked Editorial Assets" },
      { value: "18+", label: "Years Content Leadership" },
    ],
    capabilities: [
      {
        title: "SEO Content Writing",
        copy: "Content built around real search intent, so it ranks because it genuinely answers the question.",
        details: [
          "Search Intent Research",
          "Keyword Mapping",
          "On-Page Optimization",
          "Featured Snippet Formatting",
          "Service & Landing Page Content",
          "Ranking-Led Updates",
        ],
      },
      {
        title: "Website Content Writing",
        copy: "Clear, persuasive copy that explains what you do, why it matters and what visitors should do next.",
        details: [
          "Homepage Copy",
          "Service Page Copy",
          "About Page Copy",
          "Brand Voice Definition",
          "SEO-Friendly Structure",
          "Calls to Action",
        ],
      },
      {
        title: "Blog Writing",
        copy: "Research-backed articles that position your brand as a source worth returning to and bring in organic traffic over time.",
        details: [
          "Topic Research",
          "Long-Form & Short-Form Blogs",
          "Editorial Calendars",
          "Industry Articles",
          "How-To Guides",
          "Internal Linking",
        ],
      },
      {
        title: "Copywriting",
        copy: "Content informs, copy moves people to act. We write landing pages, ads and campaigns built to turn readers into enquiries.",
        details: [
          "Landing Page Copy",
          "Ad Copy",
          "Campaign Copy",
          "Taglines & Headlines",
          "Brochure Copy",
          "Conversion-Focused Messaging",
        ],
      },
      {
        title: "Social Media Content",
        copy: "Platform-specific content that keeps your brand present, consistent and worth engaging with.",
        details: [
          "Content Strategy",
          "Post & Caption Writing",
          "Reel & Video Scripts",
          "Content Calendars",
          "Brand Voice Across Channels",
          "Campaign Content",
        ],
      },
      {
        title: "Email Marketing & Newsletters",
        copy: "Welcome sequences, newsletters and campaigns that earn the open, not just the send.",
        details: [
          "Welcome Sequences",
          "Newsletters",
          "Promotional Emails",
          "Audience Segmentation",
          "A/B Testing",
          "Mobile-Friendly Email Design",
        ],
        subService: "email-and-newsletters-marketing",
      },
      {
        title: "Visual Assets & Infographics",
        copy: "Infographics, presentations and eBooks that turn complex information into something people actually stop to read.",
        details: [
          "Infographics",
          "Presentations",
          "eBooks",
          "Data Visualisation",
          "Shareable Social Assets",
          "Brand-Consistent Design",
        ],
        subService: "asset-creation-and-infographics",
      },
      {
        title: "Content Promotion & Optimization",
        copy: "Distribution, refreshes and SEO improvements that keep good content working long after it’s published.",
        details: [
          "Multi-Channel Distribution",
          "Content Refreshes",
          "Keyword & Performance Tracking",
          "Internal Linking",
          "Technical SEO Fixes",
          "AI Search Optimization",
        ],
        subService: "content-promotion-and-optimization",
      },
    ],
    deliverables: [
      "12-Month Search & Intent Content Roadmap",
      "Publication-Ready Long-Form Articles & Case Studies",
      "Custom Graphic Infographics & Social Carousel Assets",
      "Automated Email Lead Nurturing Workflows",
      "Monthly Content Ranking & Organic Traffic Reports",
      "Executive Ghostwriting & LinkedIn Thought Leadership Posts",
    ],
    process: [
      {
        step: "01",
        km: "KM 01",
        title: "Search & Audience Research",
        copy: "We find the questions, keywords, and buying concerns your customers research before they decide.",
      },
      {
        step: "02",
        km: "KM 02",
        title: "Content Strategy & Brand Voice",
        copy: "We build a content marketing strategy and a clear brand voice, mapped to your business goals.",
      },
      {
        step: "03",
        km: "KM 03",
        title: "Writing, Design & Review",
        copy: "Our content writers and designers create accurate, well-structured content, reviewed before anything goes live.",
      },
      {
        step: "04",
        km: "KM 04",
        title: "Publish, Promote & Improve",
        copy: "Content is published, promoted across channels, and refreshed regularly to improve rankings and conversions.",
      },
    ],
    whyUs: [
      {
        title: "Experienced content writers who know your industry",
        copy: "From real estate and healthcare to education and e-commerce, our writers understand the sectors we serve, so every piece has genuine depth.",
      },
      {
        title: "Built for Google and AI search",
        copy: "Clear answers, structured content, and natural language help your content rank on Google and get cited by ChatGPT, Gemini, and Perplexity.",
      },
      {
        title: "Content that drives enquiries, not just traffic",
        copy: "Every piece is planned with a clear next step for the reader, so content marketing becomes a steady source of qualified leads.",
      },
    ],
    layout: {
      problemFlags: [
        {
          title: "Published but never found",
          copy: "Content written without keyword research rarely ranks, so the people searching for you never see it.",
        },
        {
          title: "Posting without a plan",
          copy: "Random posts and one-off blogs don’t build authority or bring in steady traffic.",
        },
        {
          title: "Words that don’t convert",
          copy: "Content that informs but never asks for action leaves leads on the table.",
        },
      ],
      planLede:
        "Everything a complete content marketing strategy needs, written, designed, and optimised by one team.",
      wallLede: "Content, social campaigns, and search results from brands that trusted us with their name.",
      intentTitle: { lead: "Content that keeps", accent: "working for you." },
      faqs: [
        {
          question: "What do your content marketing services include?",
          answer:
            "Our content marketing services cover SEO content writing, website content, blog writing, copywriting, social media content, email marketing, infographics, and content promotion. We combine them into one content marketing strategy based on your goals and audience.",
        },
        {
          question: "How much do content marketing services cost in Delhi NCR?",
          answer:
            "The cost depends on the type and volume of content, such as a set of website pages, a monthly blog plan, or a full content and social programme. We share a clear proposal after understanding your goals, so you know exactly what’s included.",
        },
        {
          question: "How is content marketing different from SEO?",
          answer:
            "SEO improves how your website ranks, while content marketing creates the blogs, pages, and resources that give it something worth ranking. The two work best together, which is why our content writers and SEO specialists plan every piece as one team.",
        },
        {
          question: "How long does content marketing take to show results?",
          answer:
            "Content usually starts gaining search visibility within a few months, and the results build over time as more content is published and refreshed. Social media and email content can drive engagement much sooner.",
        },
        {
          question: "Can your content help us appear in ChatGPT and Google AI Overviews?",
          answer:
            "Yes. We write answer-first, well-structured content with clear facts and schema markup, which makes it easier for AI tools to understand, cite, and recommend your brand.",
        },
        {
          question: "How do you measure the success of content marketing?",
          answer:
            "We track organic traffic, keyword rankings, engagement, and, most importantly, the enquiries and leads your content brings in, and share clear monthly reports.",
        },
      ],
    },
  },
  {
    id: "web",
    slug: "web-designing-and-development",
    name: "Web Development",
    uppercaseName: "WEB DEVELOPMENT",
    engine: "Engine Two · Digital & Media",
    kicker: "KM 02 · Digital experiences that convert",
    heroTitle: { lead: "Website Design & Development", accent: "that turns visitors into enquiries." },
    tagline:
      "Custom WordPress, eCommerce, and landing page websites that look sharp, load fast on every device, and are built to rank and convert.",
    heading: "Websites built to turn visitors into enquiries, not just look good",
    shortDescription:
      "Ultra-fast Next.js websites, mobile-optimized landing funnels, interactive 3D web showcases, and conversion architecture.",
    definitionText:
      "Website design and development is planning, designing, and building a website that looks good, works smoothly on every device, and helps visitors take action.",
    fullOverview:
      "Your website is where every campaign, search, and recommendation eventually leads. If it loads slowly, confuses visitors, or breaks on mobile, you lose the traffic you’ve paid for. Our website design and development services combine clear UI/UX design, fast and secure builds, and an SEO-friendly structure from day one, so your website looks sharp, ranks well, and turns more visitors into enquiries.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#1e4e9e",
    tags: ["Next.js", "Web Design", "Landing Pages", "High Performance", "Mobile-First", "Conversion Optimization"],
    stats: [
      { value: "<1.2s", label: "Average Page Load Speed" },
      { value: "+180%", label: "Conversion Rate Improvement" },
      { value: "100%", label: "Core Web Vitals Pass Rate" },
      { value: "18+", label: "Years Digital Evolution" },
    ],
    capabilities: [
      {
        title: "UI/UX Design",
        copy: "Interfaces people can use without thinking, on any device. We start with research, then wireframes and prototypes, so problems are fixed before the site is built.",
        details: [
          "User Research",
          "Wireframes & Prototypes",
          "Responsive Layouts",
          "Interaction Design",
          "Accessibility",
          "Conversion-Focused Design",
        ],
        subService: "ui-ux-design",
      },
      {
        title: "Custom Website Development",
        copy: "Scalable, secure websites built around what your business actually needs, with SEO-friendly structure and fast performance from the first line of code.",
        details: [
          "Corporate Websites",
          "Custom Web Applications",
          "Scalable Architecture",
          "SEO-Friendly Structure",
          "Speed Optimization",
          "Security Built-In",
        ],
        subService: "custom-design-development",
      },
      {
        title: "WordPress Website Development",
        copy: "Flexible WordPress websites your team can update themselves, with search visibility, mobile responsiveness, and speed built in.",
        details: [
          "Custom WordPress Design",
          "Business & Corporate Sites",
          "Blogs & Content Sites",
          "Easy-to-Manage CMS",
          "WooCommerce Stores",
          "Plugin Integration",
        ],
        subService: "wordpress-web-designing",
      },
      {
        title: "eCommerce Website Development",
        copy: "Online stores built to turn browsers into buyers, with simple navigation, strong product pages, and secure checkout.",
        details: [
          "WooCommerce Stores",
          "Shopify Stores",
          "Custom eCommerce Platforms",
          "Product & Category Pages",
          "Secure Payment Integration",
          "Mobile Shopping Experience",
        ],
        subService: "e-commerce-web-designing",
      },
      {
        title: "Landing Page Design & Development",
        copy: "High-converting landing pages built for your Google Ads, Meta Ads and email campaigns, so the traffic you pay for turns into leads.",
        details: [
          "Campaign Landing Pages",
          "Google & Meta Ads Pages",
          "Persuasive Copy & Layout",
          "Lead Capture Forms",
          "Fast Mobile Loading",
          "A/B Testing",
        ],
        subService: "landing-page-development-services",
      },
    ],
    deliverables: [
      "Custom UI/UX Prototypes & Interactive Figma Wireframes",
      "Production-Grade Next.js / React Codebase with CI/CD",
      "Mobile-First Responsive Layouts Tested on 20+ Screen Sizes",
      "Integrated Headless CMS for Easy Client Content Updates",
      "Full Google Analytics 4, Tag Manager & Event Tracking",
      "Comprehensive Security, SSL, and Hosting Deployment",
    ],
    process: [
      {
        step: "01",
        km: "KM 01",
        title: "Discovery & Site Planning",
        copy: "We map your goals, audience, and the pages your website needs, so every visitor has a clear path to enquire.",
      },
      {
        step: "02",
        km: "KM 02",
        title: "UI/UX Design & Prototypes",
        copy: "We design clean, on-brand layouts and share clickable prototypes before development begins.",
      },
      {
        step: "03",
        km: "KM 03",
        title: "Website Development",
        copy: "Our developers build a fast, secure, and mobile-friendly website with an SEO-friendly structure from the start.",
      },
      {
        step: "04",
        km: "KM 04",
        title: "Testing, Launch & Support",
        copy: "We test across browsers and devices, check speed and Core Web Vitals, launch the site, and keep it maintained.",
      },
    ],
    whyUs: [
      {
        title: "Built by marketers, not just developers",
        copy: "Every heading, button and form on your website has a job to do, because we build from the perspective of winning enquiries, not just writing code.",
      },
      {
        title: "The right platform for your business",
        copy: "From WordPress and Shopify to fully custom builds, we choose the platform that fits your goals, budget, and team.",
      },
      {
        title: "Landing pages and ads built together",
        copy: "Because the same team builds your landing pages and runs your Google and Meta ads, the message stays consistent from click to enquiry.",
      },
    ],
    layout: {
      planKicker: "Website design & development services",
      wallLede: "Websites and launch results from brands that trusted us with their name.",
      intentTitle: { lead: "Websites that work", accent: "as hard as your ads." },
      faqs: [
        {
          question: "What do your website design and development services include?",
          answer:
            "Our website design and development services cover UI/UX design, custom website development, WordPress websites, eCommerce stores, landing pages, and ongoing maintenance and support. Every site is mobile-friendly, fast-loading, and built with an SEO-friendly structure.",
        },
        {
          question: "Are you a web development company in Delhi NCR?",
          answer:
            "Ritz Media World is a website design and development company headquartered in Noida, working with businesses across Delhi, Noida, Greater Noida, and the rest of Delhi NCR, as well as brands throughout India.",
        },
        {
          question: "How much does website design and development cost?",
          answer:
            "The cost depends on the type of website, the number of pages, the features you need, and whether it’s built on WordPress, Shopify or a custom platform. We share a clear proposal after understanding your requirements.",
        },
        {
          question: "How long does it take to build a website?",
          answer:
            "A landing page can be ready within days, while a business website usually takes a few weeks. Larger custom or eCommerce websites take longer, and we agree on the timeline before work begins.",
        },
        {
          question: "Should I choose WordPress or a custom website?",
          answer:
            "WordPress suits most business websites and blogs, since your team can update content easily. A custom website is better when you need specific features, integrations, or room to scale. We recommend the right option after understanding your goals.",
        },
        {
          question: "Will my website be mobile-friendly and SEO-ready?",
          answer:
            "Yes. Every website we build is responsive across mobile, tablet, and desktop, and includes SEO-friendly structure, fast loading, and clean code, so it’s ready to rank from launch.",
        },
      ],
    },
  },
  {
    id: "celebrity",
    slug: "celebrity-endorsements",
    name: "Celebrity Endorsements",
    uppercaseName: "CELEBRITY ENDORSEMENTS",
    engine: "Engine One · Brand & Creative",
    kicker: "KM 07 · Borrow the spotlight",
    heroTitle: { lead: "Celebrity Endorsements", accent: "that build trust, not just buzz." },
    tagline:
      "From finding the right celebrity to contracts, creative and launch, our celebrity endorsement services build partnerships that feel genuine and turn attention into business.",
    heading: "Faces that fit the brand ethos, not just the marketing budget",
    shortDescription:
      "A-list celebrity partnerships, contract negotiations, creative commercial integration, and high-impact PR launches.",
    definitionText:
      "Celebrity endorsement is when a well-known personality promotes a brand, product or project, using their credibility and reach to build trust and recognition with customers.",
    fullOverview:
      "A famous face can lift brand awareness quickly, but only when the partnership feels genuine, the creative idea is strong, and the contract protects your interests. Our celebrity endorsement services connect brands with Bollywood actors, sports personalities, television stars, and digital creators who genuinely fit and handle everything from talent selection and negotiations to brand films, PR, and legal sign-off.",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#cf1b4b",
    tags: ["Celebrity Brand Ambassador", "Talent Management", "Ad Film Shoot", "Contract Negotiations", "PR Launch", "Star Power"],
    stats: [
      { value: "50+", label: "Celebrity Endorsements Executed" },
      { value: "10x", label: "Immediate Brand Recall Surge" },
      { value: "100%", label: "Legal & Usage Rights Compliance" },
      { value: "18+", label: "Years Industry Access" },
    ],
    capabilities: [
      {
        title: "Celebrity Identification & Selection",
        copy: "The biggest following isn’t the same as the right fit. We match celebrities to your brand, audience, and campaign goals, so the partnership feels natural.",
        details: [
          "Market & Audience Research",
          "Celebrity Profiling",
          "Bollywood, Sports & TV Talent",
          "Digital Creator Options",
          "Shortlisting & Vetting",
          "Reputation Checks",
        ],
        subService: "celebrity-identification-services",
      },
      {
        title: "Contract Negotiations",
        copy: "We negotiate directly with celebrity representatives, so fees, deliverables, usage rights, and timelines are agreed upon in writing before the shoot.",
        details: [
          "Commercial Terms",
          "Deliverables & Timelines",
          "Usage Rights",
          "Exclusivity Windows",
          "Payment Schedules",
          "Risk Reduction",
        ],
        subService: "negotiating-contracts",
      },
      {
        title: "Creative Collaboration",
        copy: "Campaigns built around the celebrity’s real personality, so brand films, social content, and behind-the-scenes clips feel authentic.",
        details: [
          "Campaign Concepts",
          "Brand Films & Ad Films",
          "Social Media Content",
          "Photo Shoots",
          "Behind-the-Scenes Content",
          "Brand & Celebrity Alignment",
        ],
        subService: "creative-collaboration",
      },
      {
        title: "Campaign Integration",
        copy: "We carry the celebrity content across digital, social, print, TV, and events, so it reads as one campaign rather than scattered assets.",
        details: [
          "Digital & Social Rollout",
          "Print & Outdoor Campaigns",
          "Event Appearances",
          "Product Launches",
          "Consistent Messaging",
          "Cross-Channel Planning",
        ],
        subService: "campaign-integration",
      },
      {
        title: "Public Relations",
        copy: "We build the story around the partnership and secure press coverage that earns attention beyond the media budget.",
        details: [
          "Launch Announcements",
          "Press Releases",
          "Media Outreach",
          "Interviews & Features",
          "Social Amplification",
          "Event PR",
        ],
        subService: "public-relations",
      },
      {
        title: "Legal Compliance",
        copy: "We take care of disclosure rules, image rights, and advertising standards before launch, so the partnership stays transparent and protected.",
        details: [
          "Advertising Standards Compliance",
          "Image Rights & Usage",
          "Disclosure Requirements",
          "Content Approvals",
          "Contract Documentation",
          "Reputational Risk Checks",
        ],
        subService: "legal-compliance",
      },
    ],
    deliverables: [
      "Talent Shortlist & ROI/Demographic Compatibility Report",
      "Executed Celebrity Contract with Clear Deliverables & Exclusivity",
      "Television & Digital Commercial Films (4K Broadcast Master)",
      "National Print & Outdoor Master Key Visuals",
      "Co-Branded Social Media Posts & Stories",
      "Press Release Syndication Across Major Media Portals",
    ],
    process: [
      {
        step: "01",
        km: "KM 01",
        title: "Brand & Audience Fit",
        copy: "We define the personality, audience, and budget your campaign needs, and screen celebrities against your brand’s goals.",
      },
      {
        step: "02",
        km: "KM 02",
        title: "Approach & Negotiation",
        copy: "We approach the celebrity’s team and negotiate fees, usage rights, exclusivity, and shoot dates.",
      },
      {
        step: "03",
        km: "KM 03",
        title: "Creative & Production",
        copy: "We develop concepts the celebrity is comfortable with and manage the shoot from script to final edit.",
      },
      {
        step: "04",
        km: "KM 04",
        title: "Launch & PR",
        copy: "We launch the campaign across the right channels and support it with PR, so the partnership gets the attention it deserves.",
      },
    ],
    whyUs: [
      {
        title: "Fit before fame",
        copy: "We recommend celebrities based on brand fit and audience relevance, not just follower counts, so the endorsement feels credible.",
      },
      {
        title: "Clear contracts, fewer surprises",
        copy: "Usage rights, exclusivity, and deliverables are agreed upon in writing upfront, protecting your brand for the length of the campaign.",
      },
      {
        title: "Your brand stays the hero",
        copy: "Every script is written so audiences remember your product, not just the famous face.",
      },
    ],
    layout: {
      wallLede: "Celebrity campaigns and brand films from partnerships we’ve brought to life.",
      intentTitle: { lead: "The right face,", accent: "remembered for the right brand." },
      faqs: [
        {
          question: "What do your celebrity endorsement services include?",
          answer:
            "Our celebrity endorsement services cover celebrity identification and selection, contract negotiations, creative collaboration, campaign integration, public relations, and legal compliance, managed end-to-end by one team.",
        },
        {
          question: "How do I hire a celebrity for brand endorsement in India?",
          answer:
            "Start by defining your audience, budget, and campaign goal. A celebrity endorsement agency then shortlists suitable names, approaches their representatives, negotiates terms, and manages the campaign. Ritz Media World handles each of these steps for you.",
        },
        {
          question: "How much does celebrity endorsement cost in India?",
          answer:
            "The cost depends on the celebrity’s popularity, the length of the contract, usage rights, exclusivity, and the number of shoots or appearances. We share options across different budgets after understanding your goals.",
        },
        {
          question: "Can a celebrity endorse a real estate project launch?",
          answer:
            "Yes. Celebrity-led launches can build trust and attention quickly for real estate projects. We plan the celebrity’s role across ads, films, events, and PR so the project stays the focus.",
        },
        {
          question: "Should I choose a celebrity or an influencer?",
          answer:
            "Celebrities build broad recognition and credibility quickly, while influencers offer targeted reach and stronger engagement within specific communities. Many brands combine both, and we can plan either or a mix of the two.",
        },
      ],
    },
  },
  {
    id: "influencer",
    slug: "influencer-marketing-agency-in-india",
    name: "Influencer Marketing",
    uppercaseName: "INFLUENCER MARKETING",
    engine: "Engine One · Brand & Creative",
    kicker: "KM 08 · Make people listen",
    heroTitle: { lead: "Influencer Marketing", accent: "with voices people already trust." },
    tagline:
      "Our influencer marketing services connect your brand with creators your audience already follows on Instagram, YouTube, and beyond, turning their content into reach, engagement, and inquiries.",
    heading: "Creators who can carry the campaign idea with authenticity and cultural relevance",
    shortDescription:
      "Macro, micro, and nano influencer networks, creator collaborations, content seeding, and performance whitelisting.",
    definitionText:
      "Influencer marketing is partnering with social media creators who promote your brand to their followers, using the trust they’ve built to reach the right audience in an authentic way.",
    fullOverview:
      "People trust recommendations from creators they follow far more than brand claims. Our influencer marketing services look beyond follower counts to audience relevance, engagement quality, and content style, partnering with micro, macro, niche, and regional creators whose followers genuinely match your customers. The result is content that feels natural, earns real engagement, and supports your awareness, lead, and sales goals.",
    image:
      "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#2457dc",
    tags: ["Creator Campaigns", "Instagram Reels", "YouTube Reviews", "Micro-Influencers", "Viral Seeding", "Whitelisting"],
    stats: [
      { value: "2,500+", label: "Vetted Creator Network Across India" },
      { value: "4.8%", label: "Average Campaign Engagement Rate" },
      { value: "100%", label: "Fraud & Bot Account Auditing" },
      { value: "18+", label: "Years Navigating Media Shifts" },
    ],
    capabilities: [
      {
        title: "Influencer Identification",
        copy: "We look past follower counts to audience relevance, engagement quality, and content style, so every creator genuinely fits your brand.",
        details: [
          "Audience Fit Analysis",
          "Engagement Quality Checks",
          "Micro & Macro Creators",
          "Niche & Regional Creators",
          "Creator Vetting",
          "Celebrity vs Creator Recommendations",
        ],
        subService: "identification-influence-marketing-agency",
      },
      {
        title: "Cost-Benefit Analysis",
        copy: "We compare what each creator charges with what they’re likely to deliver, so your budget goes to the partnerships with the best cost per result.",
        details: [
          "Fee-to-Value Comparison",
          "Reach & Engagement Analysis",
          "Budget Allocation",
          "Single & Multi-Creator Planning",
          "Cost per Result Estimates",
          "Data-Led Recommendations",
        ],
        subService: "cost-benefit-analysis",
      },
      {
        title: "Terms Negotiation",
        copy: "We negotiate directly with creators and their teams, so deliverables, timelines, usage rights, and approvals are agreed upon before any content is made.",
        details: [
          "Commercial Terms",
          "Deliverables & Formats",
          "Timelines",
          "Usage Rights",
          "Approval Process",
          "Transparent Contracts",
        ],
        subService: "terms-negotiations",
      },
      {
        title: "Creative Collaboration",
        copy: "We give creators a clear brief and the freedom to sound like themselves, because content that feels authentic is content people actually watch.",
        details: [
          "Campaign Concepts",
          "Creative Briefs",
          "Reels & Shorts",
          "Storytelling Direction",
          "Brand Alignment",
          "Content Reviews",
        ],
        subService: "creative-collaboration",
      },
      {
        title: "Campaign Integration",
        copy: "We connect creator content with your social, paid media, and launch plans, so it reinforces one message instead of disappearing after a single post.",
        details: [
          "Social Media Integration",
          "Paid Amplification",
          "Product Launches",
          "Promotional Campaigns",
          "Cross-Channel Messaging",
          "Coordinated Publishing",
        ],
        subService: "campaign-integration",
      },
      {
        title: "Messaging Optimization",
        copy: "We refine talking points and calls to action using real performance data, tuning the message for awareness, leads, or sales.",
        details: [
          "Talking Points",
          "Calls to Action",
          "Performance Tracking",
          "Message Refinement",
          "Awareness Campaigns",
          "Lead & Conversion Campaigns",
        ],
        subService: "messaging-optimization",
      },
    ],
    deliverables: [
      "Curated Creator Roster with Verified Audience Demographics",
      "Creative Brief Document & Talking Points Guide",
      "Full Usage Rights for Creator Content Repurposing",
      "Dedicated Tracking Links & Custom Discount Codes",
      "Real-Time Post Live Tracking & Engagement Monitoring",
      "Comprehensive Post-Campaign Reach & ROI Performance Report",
    ],
    process: [
      {
        step: "01",
        km: "KM 01",
        title: "Audience Fit & Creator Selection",
        copy: "We shortlist creators whose followers genuinely match your customers, based on audience data and engagement quality.",
      },
      {
        step: "02",
        km: "KM 02",
        title: "Briefing & Negotiation",
        copy: "We agree on delivery dates, formats such as reels, shorts, and vlogs, usage rights, and commercial terms.",
      },
      {
        step: "03",
        km: "KM 03",
        title: "Content Review",
        copy: "We review every draft before it goes live, checking the message, call to action, and brand safety.",
      },
      {
        step: "04",
        km: "KM 04",
        title: "Launch & Paid Amplification",
        copy: "We coordinate publishing across creators and boost the best-performing content with paid ads to extend its reach.",
      },
    ],
    whyUs: [
      {
        title: "Audience fit over follower counts",
        copy: "We check engagement quality and audience relevance before recommending any creator, so your budget reaches real, relevant people.",
      },
      {
        title: "Creative storytelling, not mechanical scripts",
        copy: "Creators feature your product in their own style, so the content feels natural and keeps audiences watching.",
      },
      {
        title: "Creator content that keeps working",
        copy: "We turn the best-performing creator content into paid ads, so it keeps reaching new audiences long after the original post.",
      },
    ],
    layout: {
      problemFlags: [
        {
          title: "Big following, wrong audience",
          copy: "A creator with millions of followers means little if few of them are your customers.",
        },
        {
          title: "Content that feels like an ad",
          copy: "Over-scripted posts are easy to spot, and audiences scroll straight past them.",
        },
        {
          title: "One post, then nothing",
          copy: "Influencer content that isn’t connected to the rest of your marketing disappears from the feed within days.",
        },
      ],
      wallLede: "Creator campaigns from brands that trusted us with their name.",
      intentTitle: { lead: "Real voices,", accent: "real results." },
      faqs: [
        {
          question: "What do your influencer marketing services include?",
          answer:
            "Our influencer marketing services cover influencer identification, cost-benefit analysis, terms negotiation, creative collaboration, campaign integration, and messaging optimization, managed end-to-end by one team.",
        },
        {
          question: "Are you an influencer marketing agency in Delhi NCR?",
          answer:
            "Ritz Media World is an influencer marketing agency headquartered in Noida, working with brands across Delhi NCR and India, and with creators throughout the country.",
        },
        {
          question: "How much does influencer marketing cost in India?",
          answer:
            "The cost depends on the creators’ audience size, engagement, content format, usage rights, and the number of posts. We recommend a mix of creators that fits your budget and goals.",
        },
        {
          question: "What is the difference between micro and macro influencers?",
          answer:
            "Micro influencers have smaller, highly engaged audiences within specific niches, while macro influencers offer much wider reach. Many campaigns combine both to balance reach with engagement.",
        },
        {
          question: "Which platforms do you run influencer campaigns on?",
          answer:
            "We run influencer campaigns on Instagram, YouTube, Facebook, and LinkedIn and work with regional and niche creators to reach specific communities.",
        },
        {
          question: "Should I choose an influencer or a celebrity?",
          answer:
            "Influencers offer targeted reach and stronger engagement within specific communities, while celebrities build broad recognition quickly. We can plan either or combine the two.",
        },
      ],
    },
  },
  {
    id: "render",
    slug: "3d-rendering",
    name: "3D Rendering Services",
    uppercaseName: "3D RENDERING SERVICES",
    engine: "Engine Three · 3D Rendering Services",
    kicker: "KM 09 · Worlds you can walk through",
    heroTitle: { lead: "3D Rendering Services", accent: "that sells before launch." },
    tagline:
      "Photorealistic exterior, interior, township, and floor plan renders that help developers, architects, and designers sell, present, and launch projects before construction begins.",
    heading: "Show buyers the home, the township, and the view before a single brick is laid",
    shortDescription:
      "4K exterior towers, luxury sample flat interiors, township masterplan flythroughs, and interactive 3D floor plans.",
    definitionText:
      "3D rendering services turn architectural drawings into photorealistic images, so buyers, investors, and teams can see a building, interior, or township before it is built.",
    fullOverview:
      "Ritz Media World is a 3D rendering and architectural visualization company in India. Our 3D rendering services turn architectural drawings into photorealistic exteriors, interiors, townships, floor plans, and landscapes, with accurate materials, natural lighting, and real-world surroundings. Every render is created to be marketing-ready, so it works across brochures, hoardings, websites, sales galleries, and investor presentations from day one.",
    image:
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#167a7d",
    tags: ["3D Architectural Visualization", "Exterior Renderings", "Interior 3D", "Township Flythroughs", "Floor Plans", "VR Walkthroughs"],
    stats: [
      { value: "4K UHD", label: "Render Resolution Standard" },
      { value: "15M+ Sq Ft", label: "Real Estate Space Visualized" },
      { value: "100%", label: "Architectural CAD Fidelity" },
      { value: "18+", label: "Years Real Estate Leadership" },
    ],
    capabilities: [
      {
        title: "3D Exterior Rendering",
        copy: "Photorealistic exteriors that show your project’s architecture, materials, landscaping, and surroundings, ready for pre-launch marketing, brochures, and investor decks.",
        details: [
          "Residential Towers",
          "Commercial Buildings",
          "Villas & Independent Homes",
          "Facade & Material Detailing",
          "Day & Dusk Views",
          "Landscaping & Surroundings",
        ],
        subService: "3d-exterior-rendering",
      },
      {
        title: "3D Interior Rendering",
        copy: "Furnished, naturally lit interiors that let buyers feel a space and its lifestyle before it exists.",
        details: [
          "Sample Flat Interiors",
          "Living & Bedroom Spaces",
          "Kitchens & Bathrooms",
          "Lobbies & Common Areas",
          "Furniture & Material Detailing",
          "Natural Lighting",
        ],
        subService: "3d-interior-rendering",
      },
      {
        title: "Aerial & Township 3D Visualization",
        copy: "Entire developments are shown from above, with master plans, amenities, landscaping and connectivity explained at a glance.",
        details: [
          "Aerial Views",
          "Township Master Plans",
          "Mixed-Use Developments",
          "Site Context & Connectivity",
          "Amenity Placement",
          "Launch & Investor Visuals",
        ],
        subService: "aerial-township",
      },
      {
        title: "3D Floor Plan Rendering",
        copy: "Technical layouts turned into furnished 3D plans that show flow, proportion and space clearly.",
        details: [
          "2D to 3D Floor Plans",
          "Furnished Layouts",
          "Unit Plans",
          "Cluster Plans",
          "Brochure-Ready Formats",
          "Website & Sales Visuals",
        ],
        subService: "3d-floor-plan-rendering",
      },
      {
        title: "Amenity & Landscape Rendering",
        copy: "Pools, clubhouses, gardens and open spaces rendered to show the lifestyle that sells the project.",
        details: [
          "Swimming Pools",
          "Clubhouses",
          "Gardens & Landscapes",
          "Kids’ Play Areas",
          "Sports & Fitness Zones",
          "Rooftop & Open Spaces",
        ],
        subService: "amenity-landscape-rendering",
      },
    ],
    deliverables: [
      "Ultra-High-Resolution 4K & 8K Exterior Stills for Hoardings",
      "Sample Flat Interior Renderings with Realistic Textures",
      "Full 3D Furnished Floor Plans for Print & Web Brochures",
      "60-90 Second Cinematic 3D Walkthrough Animation Film",
      "Web-Optimized 360° Panoramas for Virtual Site Visits",
      "Layered Source Files & Marketing Crop Variations",
    ],
    process: [
      {
        step: "01",
        km: "KM 01",
        title: "Drawings & Brief Review",
        copy: "We study your CAD drawings, material specifications, landscape plans, and site orientation to get every detail right.",
      },
      {
        step: "02",
        km: "KM 02",
        title: "3D Modelling & Camera Angles",
        copy: "We build an accurate 3D model and share camera angles, so we agree on the best views before rendering.",
      },
      {
        step: "03",
        km: "KM 03",
        title: "Materials, Lighting & Landscaping",
        copy: "We add realistic materials, natural lighting, and greenery, so every render looks true to life.",
      },
      {
        step: "04",
        km: "KM 04",
        title: "Final Rendering & Delivery",
        copy: "We render in high resolution, finish each image with color grading and retouching, and deliver files ready for hoardings, brochures, and ads.",
      },
    ],
    whyUs: [
      {
        title: "Built for real estate marketing",
        copy: "With years of experience marketing real estate projects, we know which views, angles, and details help buyers decide.",
      },
      {
        title: "AI-powered rendering at 5X speed",
        copy: "Our AI-powered rendering workflow delivers photorealistic visuals up to five times faster, so launch timelines don’t slip.",
      },
      {
        title: "Ready for every channel",
        copy: "We don’t just deliver renders. We adapt them for your website, hoardings, brochures, and social ads, so they’re ready to use straight away.",
      },
    ],
    layout: {
      problemFlags: [
        {
          title: "Hard to picture on paper",
          copy: "Most buyers struggle to imagine a space from a floor plan or drawing alone.",
        },
        {
          title: "Renders that look fake",
          copy: "Plastic-looking visuals make a project feel less real, not more.",
        },
        {
          title: "Visuals that don’t fit the campaign",
          copy: "Renders made without marketing in mind often need reworking before they can be used in ads or brochures.",
        },
      ],
      wallLede: "Renders created for real projects, from first drawing to launch campaign.",
      faqs: [
        {
          question: "What 3D rendering services do you offer?",
          answer:
            "We offer 3D exterior rendering, 3D interior rendering, aerial and township visualization, 3D floor plan rendering, and amenity and landscape rendering for real estate developers, architects, interior designers, and builders.",
        },
        {
          question: "What is architectural visualization?",
          answer:
            "Architectural visualization is the process of turning architectural plans into realistic images, so people can see how a building or space will look before it’s built.",
        },
        {
          question: "Can you create renders for projects that are not yet built?",
          answer:
            "Yes. That’s what 3D rendering is for. We create photorealistic visuals from your drawings and plans, so buyers and investors can see the project before construction begins.",
        },
        {
          question: "How long does a 3D rendering project take?",
          answer:
            "The timeline depends on the number of views and the project’s complexity. With our AI-powered workflow, we can deliver photorealistic renders significantly faster than traditional methods.",
        },
        {
          question: "How much do 3D rendering services cost in India?",
          answer:
            "The cost depends on the type of render, the number of views, the level of detail, and the delivery timeline. We share a clear quote once we’ve reviewed your drawings.",
        },
        {
          question: "Do you provide 3D rendering services across India?",
          answer:
            "Yes. We work with developers, architects, and designers across India, and all files can be shared and reviewed online.",
        },
      ],
    },
  },
  {
    id: "ai",
    slug: "ai-services",
    name: "AI Services",
    uppercaseName: "AI SERVICES",
    engine: "Engine Three · AI Services",
    kicker: "KM 10 · Work smarter",
    heroTitle: { lead: "AI Services", accent: "that help you work faster." },
    tagline:
      "AI-powered creatives, brand reels and videos, AI implementation and workflow automation, with a human team guiding every step.",
    heading: "Practical AI Services for Faster, Creative, & Smarter Work",
    problemHeading: "AI-Powered Creative Solutions",
    shortDescription:
      "AI-powered creatives, videos, and automations that help brands move faster without feeling less human.",
    definitionText:
      "AI services help businesses use artificial intelligence to create content faster, adopt the right AI tools, and automate repetitive work, while people stay in control of quality and decisions.",
    fullOverview:
      "Our AI services bring strategy, creativity, and technology together. We use AI to produce more creatives and videos in less time, help businesses adopt the right AI tools, and automate the repetitive tasks that slow teams down. Every output is guided by a clear brief and reviewed by people, so speed never replaces judgement.",
    image: "/services/ai-services-logo.png",
    accentColor: "#167a68",
    tags: ["AI Creative", "AI Search", "Automation", "Content Systems", "Strategy"],
    stats: [
      { value: "01", label: "Generative AI Campaign of the Year, AdAura" },
      { value: "4", label: "AI services, from creatives to automation" },
      { value: "100%", label: "Human-reviewed before delivery" },
      { value: "18", label: "Years of brand building" },
    ],
    capabilities: [
      {
        title: "AI-Generated Creatives and Visuals",
        copy: "Campaign visuals, social media posts, and ad creatives produced with AI tools and refined by our designers, so you get more variations in less time while staying on brand.",
        details: [
          "AI-Generated Key Visuals",
          "Social Media Creatives",
          "Ad Creatives & Variations",
          "Campaign Concepts",
          "Product & Lifestyle Visuals",
          "Brand-Consistent Design",
        ],
      },
      {
        title: "AI-Powered Brand Videos",
        copy: "Short brand reels, promotional videos, and social content created with AI-powered video tools, built for Instagram, YouTube Shorts, and WhatsApp, and finished by our editors.",
        details: [
          "AI Brand Reels",
          "Promotional Videos",
          "Social Media Videos",
          "Scripts & Storyboards",
          "AI Voiceovers & Visuals",
          "Editing & Finishing",
        ],
      },
      {
        title: "AI Workflow Automation",
        copy: "We help your business adopt AI the right way, from identifying where it adds value and choosing the right tools to setting them up and integrating them with your existing systems.",
        details: [
          "AI Opportunity Assessment",
          "Tool Selection",
          "Setup & Configuration",
          "System Integration",
          "Brand & Quality Guardrails",
          "Ongoing Support",
        ],
      },
      {
        title: "AI Solutions for Business Growth",
        copy: "We automate repetitive tasks such as content publishing, reporting, lead handling, and data entry, so your team spends less time on manual work and more time on what matters.",
        details: [
          "Content Publishing Automation",
          "Reporting Automation",
          "Lead Handling & Routing",
          "Data Entry & Updates",
          "Social Media Scheduling",
          "Custom Workflow Builds",
        ],
      },
    ],
    deliverables: [
      "AI Opportunity Audit and Priority Roadmap",
      "Brand-Safe Prompt and Content System",
      "Campaign Concept, Script and Visual Exploration Packs",
      "AI Search Visibility Content and Entity Plan",
      "Automated Brief, Approval and Reporting Workflows",
      "Team Training, Playbooks and Ongoing Optimisation",
    ],
    process: [
      {
        step: "01",
        km: "KM 01",
        title: "Find the right opportunities",
        copy: "We understand your goals, audience, team, tools, and constraints before recommending where AI can create real value.",
      },
      {
        step: "02",
        km: "KM 02",
        title: "Build the brand guardrails",
        copy: "We define your voice, visual rules, approval points, data boundaries, and quality checks before production begins.",
      },
      {
        step: "03",
        km: "KM 03",
        title: "Prototype and improve",
        copy: "We test the creative or workflow with a focused pilot, measure what works, and refine it with you.",
      },
      {
        step: "04",
        km: "KM 04",
        title: "Launch with human oversight",
        copy: "We launch the system, document how it works, and keep improving the output as your brand and tools evolve.",
      },
    ],
    whyUs: [
      {
        title: "Creative judgement stays in the room",
        copy: "AI helps us explore and execute faster, but experienced strategists, writers, designers, and marketers decide what is right for your brand.",
      },
      {
        title: "Built around the way you already work",
        copy: "We fit AI into the tools and approvals you already use, instead of adding a complicated system nobody adopts.",
      },
      {
        title: "Made for real business outcomes",
        copy: "Every AI project is tied to a clear goal, whether that’s more content in less time, faster turnarounds, or fewer hours spent on manual work.",
      },
    ],
    layout: {
      problemSummary:
        "Our AI services bring strategy, creativity, and technology together. We use AI to produce more creatives and videos in less time, help businesses adopt the right AI tools, and automate the repetitive tasks that slow teams down. Every output is guided by a clear brief and reviewed by people, so speed never replaces judgement.",
      planTitle: "AI Implementation and Automation",
      processTitle: "Our AI-Powered Approach",
      faqTitle: { lead: "Frequently Asked Questions About", accent: "AI Services." },
      problemFlags: [
        {
          title: "Too many tools, no clear system",
          copy: "New AI tools arrive every week, but businesses still need a practical way to decide what’s worth using.",
        },
        {
          title: "Fast content that feels generic",
          copy: "Speed only helps when the output still looks, sounds, and feels like your brand.",
        },
        {
          title: "Hours lost to repetitive work",
          copy: "Teams still spend hours on manual tasks that could run on their own, leaving less time for the work that matters.",
        },
      ],
      intentTitle: { lead: "Benefits of AI Services for", accent: "Your Brand" },
      wallLede: "AI-powered creatives, videos, and automations that help brands move faster without feeling less human.",
      faqs: [
        {
          question: "What AI services do you offer?",
          answer:
            "We offer four AI services for brands: AI creatives, AI brand reels and videos, end-to-end AI implementation, and workflow automations, all guided and reviewed by our team.",
        },
        {
          question: "Will AI replace our creative team?",
          answer:
            "No. We use AI to speed up research, production, and repetitive work. People remain responsible for the idea, the judgment, brand fit, and final approval.",
        },
        {
          question: "How do you make AI-generated content feel like our brand?",
          answer:
            "We build brand guardrails from your existing voice, visual identity, audience, and examples, and every creative or video is reviewed and refined by our designers and editors before delivery.",
        },
        {
          question: "Can you set up AI tools for our business?",
          answer:
            "Yes. Our end-to-end AI implementation covers identifying where AI adds value, choosing the right tools, setting them up, and integrating them with your existing systems.",
        },
        {
          question: "What kind of tasks can you automate?",
          answer:
            "Common examples include content publishing, reporting, lead handling, data entry, and social media scheduling. We first map your current workflow, then automate the steps that take the most manual time.",
        },
        {
          question: "How much do AI services cost?",
          answer:
            "The cost depends on the service and scope, whether it’s a set of AI creatives, a series of brand reels, or a custom automation. We share a clear proposal after understanding your goals.",
        },
      ],
    },
  },
];

export const MENU_SERVICES = SERVICES_LIST;

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICES_LIST.find((s) => s.slug === slug || s.id === slug);
}

export function getAllServices(): ServiceDetail[] {
  return SERVICES_LIST;
}

export function getRelatedServices(currentSlug: string, count = 3): ServiceDetail[] {
  return SERVICES_LIST.filter((s) => s.slug !== currentSlug).slice(0, count);
}
