export interface ServiceCapability {
  title: string;
  copy: string;
  icon?: string;
}

export interface ServiceProcessStep {
  step: string;
  km: string;
  title: string;
  copy: string;
}

export interface ServiceDetail {
  id: string;
  slug: string;
  name: string;
  uppercaseName: string;
  engine: string;
  kicker: string;
  tagline: string;
  heading: string;
  shortDescription: string;
  fullOverview: string;
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

export const SERVICES_LIST: ServiceDetail[] = [
  {
    id: "digital",
    slug: "digital-marketing",
    name: "Digital Marketing",
    uppercaseName: "DIGITAL MARKETING",
    engine: "Engine Two · Digital & Media",
    kicker: "KM 05 · Performance on the road",
    tagline: "Turn attention, clicks, and queries into predictable business revenue.",
    heading: "Digital marketing solutions built for sustainable commercial growth",
    shortDescription:
      "Full-funnel SEO, Meta & Google PPC, reputation management, and high-converting lead engines across India.",
    fullOverview:
      "Ritz Media World is a results-first digital marketing agency helping brands turn attention into actual business growth. Over 18 years, we have mastered every shift in the Indian digital ecosystem—from search and programmatic display to viral social content and AI search answers. We engineer campaigns with clear cost-per-lead (CPL) benchmarks, conversion rate optimization, and transparent tracking so every rupee spent delivers measurable ROI.",
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
        title: "Search Engine Optimization (SEO & AEO)",
        copy: "Dominate high-intent Google search rankings and get recommended in AI search answers through technical SEO, schema, and authority content.",
      },
      {
        title: "Pay-Per-Click Advertising (PPC)",
        copy: "Precision Google Ads, YouTube, and Meta performance campaigns fine-tuned daily for lowest cost per qualified acquisition.",
      },
      {
        title: "Social Media Marketing (SMM)",
        copy: "Strategic creative feeds, viral reels, and active community engagement that transform followers into brand advocates.",
      },
      {
        title: "Online Reputation Management (ORM)",
        copy: "Systematic review generation, crisis monitoring, and SERP control that ensure prospective buyers always see your best face first.",
      },
      {
        title: "Lead Generation & Conversion Systems",
        copy: "Frictionless landing experiences, automated WhatsApp/email lead nurturing, and CRM pipeline integration.",
      },
      {
        title: "Brand Awareness & Frequency Planning",
        copy: "Omnichannel brand exposure across programmatic networks and premium publications that cements top-of-mind recall.",
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
        copy: "We analyze historical conversion data, buyer search patterns, competitor bids, and website leaks before spending a single ad rupee.",
      },
      {
        step: "02",
        km: "KM 03",
        title: "Strategy & Funnel Blueprint",
        copy: "We define channel mix, keyword cohorts, creative variations, and conversion benchmarks mapped directly to your commercial goals.",
      },
      {
        step: "03",
        km: "KM 06",
        title: "Execution & Real-Time Testing",
        copy: "Campaigns go live with multiple ad hooks, custom landing pages, and rapid creative iteration to find winning combinations fast.",
      },
      {
        step: "04",
        km: "KM 09",
        title: "Scale & Retention Optimization",
        copy: "We aggressively scale profitable ad sets, lower acquisition costs, and build remarketing loops that maximize client lifetime value.",
      },
    ],
    whyUs: [
      {
        title: "Integrated Creative + Media Under One Roof",
        copy: "No disconnect between the design studio and the media buyers. Ad copy, video hooks, and targeting are built by one synchronized team.",
      },
      {
        title: "Obsession With Qualified Pipeline, Not Vanity Likes",
        copy: "We judge performance by qualified leads, cost-per-acquisition, and revenue contribution—not superficial vanity metrics.",
      },
      {
        title: "Deep Domain Mastery In High-Stakes Sectors",
        copy: "From premium real estate and healthcare to retail and technology, we understand the exact consumer psyche that moves Indian buyers.",
      },
      {
        title: "Speed, Agility & Transparent Real-Time Data",
        copy: "Live access to campaign dashboards, transparent ad spend reporting, and zero hidden platform markups.",
      },
    ],
  },
  {
    id: "creative",
    slug: "creative-services",
    name: "Creative Services",
    uppercaseName: "CREATIVE SERVICES",
    engine: "Engine One · Brand & Creative",
    kicker: "KM 01 · Make people stop and remember",
    tagline: "Campaigns, films, and identities that cut through market clutter.",
    heading: "Creative craft, brand platforms, and ideas people actually remember",
    shortDescription:
      "Branding & identity, packaging design, ad films, and visual communication that give businesses an enduring voice.",
    fullOverview:
      "From comprehensive brand identities to multi-channel launch campaigns and films, Ritz Media World turns strategic business propositions into cultural talk-points. We believe that creative work must not merely look gorgeous—it must travel across screens, billboards, and conversations while anchoring deep trust in the buyer's mind.",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#cf1b4b",
    tags: ["Brand Identity", "Graphic Design", "Logo Design", "Packaging", "Ad Campaigns", "Art Direction"],
    stats: [
      { value: "500+", label: "Brand Identities & Campaigns Built" },
      { value: "18+", label: "Years In Strategic Brand Craft" },
      { value: "100%", label: "In-House Strategy & Production" },
      { value: "90+", label: "Creative Minds On The Team" },
    ],
    capabilities: [
      {
        title: "Branding & Identity Systems",
        copy: "Logos, design language, color theory, typography, and cohesive brand guideline bibles built for cross-platform longevity.",
      },
      {
        title: "Ad Campaign Concepts & Storytelling",
        copy: "Big campaign ideas that translate into powerful print hoardings, viral digital films, and memorable headline copywriting.",
      },
      {
        title: "Print Advertising & Publication Design",
        copy: "Newspaper front-page spreads, magazine layouts, and sales brochures crafted with uncompromising editorial elegance.",
      },
      {
        title: "Product Packaging & Retail Experience",
        copy: "Shelf-stopping packaging, unboxing experiences, and POS display materials that win the final retail moment of truth.",
      },
      {
        title: "Brand Film Direction & Motion Craft",
        copy: "Cinematic commercial films, corporate documentaries, and dynamic motion graphics that evoke genuine emotion.",
      },
      {
        title: "Brand Voice & Copywriting",
        copy: "Signature taglines, brand manifestos, and authentic tone of voice that make your company instantly recognizable.",
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
        title: "Brand Archetype & Audience Immersion",
        copy: "We unpack who your brand is at its core, what your competitors sound like, and the emotional trigger that hooks your ideal buyer.",
      },
      {
        step: "02",
        km: "KM 03",
        title: "Strategic Concepting & Moodboarding",
        copy: "We present distinct creative routes with visual languages, sample headlines, and mock campaigns to align on the perfect direction.",
      },
      {
        step: "03",
        km: "KM 05",
        title: "Craft, Production & Iteration",
        copy: "Every line of copy is refined, typography is tuned down to the pixel, and assets are rendered across real-world touchpoints.",
      },
      {
        step: "04",
        km: "KM 08",
        title: "Rollout & Brand Guardianship",
        copy: "We deliver full asset packages and support your marketing teams to ensure pristine execution across all physical and digital channels.",
      },
    ],
    whyUs: [
      {
        title: "Ideas Grounded In Commercial Reality",
        copy: "We don't create art for the sake of awards; we engineer creative work that convinces consumers to choose and pay for your product.",
      },
      {
        title: "18 Years of Cultural Intuition in India",
        copy: "We understand Indian consumer nuances, regional emotional cords, and the visual cues that trigger genuine trust.",
      },
      {
        title: "Flawless Multi-Format Adaptability",
        copy: "From a 100-foot national highway hoarding to a 6-inch smartphone story, our creative retains maximum impact at every scale.",
      },
      {
        title: "In-House Production & Rapid Turnaround",
        copy: "No third-party delays. Our studio houses designers, illustrators, copywriters, and motion artists under one coordinated roof.",
      },
    ],
  },
  {
    id: "print",
    slug: "print-advertising",
    name: "Print Advertising",
    uppercaseName: "PRINT ADVERTISING",
    engine: "Engine Two · Digital & Media",
    kicker: "KM 06 · Ink that stops a reader",
    tagline: "Newspaper, OOH, and transit advertising that commands undivided respect.",
    heading: "Print and outdoor advertising that still stops a reader in their tracks",
    shortDescription:
      "National daily front-pages, high-visibility highway hoardings, airport media, and prestige magazine spreads.",
    fullOverview:
      "In a digital world overflowing with transient scrolls, physical print and outdoor media carry an undeniable weight of authority, permanence, and prestige. Ritz Media World plans, designs, and negotiates print advertising across leading national publications (Times of India, Hindustan Times, Economic Times, Dainik Jagran) and prominent outdoor locations across the country.",
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
        title: "National & Regional Daily Placements",
        copy: "Prime front-page jackets, solus positions, and contextual page-3 spreads across India's largest news publications.",
      },
      {
        title: "Highway & Urban OOH Hoardings",
        copy: "High-traffic expressway hoardings, lit gantries, and iconic urban unipoles engineered for rapid 3-second readability.",
      },
      {
        title: "Airport & Metro Transit Media",
        copy: "Premium departures lounges, digital airport screens, and transit train wraps targeting high-net-worth travelers.",
      },
      {
        title: "Magazine & Trade Periodical Spreads",
        copy: "Luxury lifestyle, architectural, and business magazine inserts with bespoke tactile finishes.",
      },
      {
        title: "Print Media Planning & Cost Negotiation",
        copy: "Unmatched rate negotiations and prime placement locking backed by decades of direct media agency relationships.",
      },
      {
        title: "Pre-Press Craft & Color Management",
        copy: "Rigorous newsprint color profiling so ad artwork reproduces crisply without ink bleeding or murky tones.",
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
        title: "Target Geographic & Reader Audit",
        copy: "We identify exactly which publications, regional editions, and commuter corridors match your buyer persona.",
      },
      {
        step: "02",
        km: "KM 03",
        title: "Bulk Media Buying & Rate Optimization",
        copy: "Leveraging our 18-year volume buying power, we secure prime inventory at fraction of standard rate-card costs.",
      },
      {
        step: "03",
        km: "KM 05",
        title: "High-Impact Visual & Copy Craft",
        copy: "Headlines and key visuals are designed specifically for print distance, paper texture, and immediate visual pause.",
      },
      {
        step: "04",
        km: "KM 07",
        title: "Release, Verification & Tear-Sheet Audit",
        copy: "Ads are released seamlessly with physical and digital tear-sheet verification provided on day of publication.",
      },
    ],
    whyUs: [
      {
        title: "Unmatched Buying Muscle & Prime Inventory",
        copy: "Decades of direct relationships with India's top publication houses guarantee you get front-page inventory at optimal rates.",
      },
      {
        title: "In-House Creative Craft Tuned For Newsprint",
        copy: "We know how ink behaves on 45 GSM newsprint vs gloss magazine paper. Your artwork always prints razor-sharp.",
      },
      {
        title: "Pan-India Reach Across Multiple Languages",
        copy: "From English national dailies to Hindi, Tamil, Telugu, and Marathi vernacular publications across tier-1, 2, and 3 cities.",
      },
      {
        title: "End-to-End Release Management",
        copy: "From booking deadlines and artwork pre-flight to verified tear-sheet proofing, our ops team manages every single step.",
      },
    ],
  },
  {
    id: "radio",
    slug: "radio-advertising",
    name: "Radio Advertising",
    uppercaseName: "RADIO ADVERTISING",
    engine: "Engine Two · Digital & Media",
    kicker: "KM 07 · Sound that earns a second listen",
    tagline: "High-frequency audio advertising that travels directly into consumer memory.",
    heading: "Audio, FM commercials, and podcasts with writing that sounds like people, not a script",
    shortDescription:
      "Radio jingles, FM network spot buying, commute prime-time scheduling, and podcast audio sponsorships.",
    fullOverview:
      "When people are driving to work, stuck in traffic, or relaxing at home, radio and streaming audio have their undivided attention. Ritz Media World creates catchy, human-sounding radio ads that stick in the ear, backed by disciplined daypart media buying across India's premier FM networks.",
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
        title: "Audio Concept & Scriptwriting",
        copy: "Tight 10, 20, and 30-second scripts with irresistible opening hooks that state brand name and offer with crystal clarity.",
      },
      {
        title: "Sonic Branding & Custom Jingles",
        copy: "Memorable sonic signatures, catchy musical jingles, and mnemonic sound designs that stay hummed for years.",
      },
      {
        title: "Voiceover Casting Across Dialects",
        copy: "Hindi, English, and regional dialect voice artists matched to your buyer profile, from authoritative and warm to high-energy.",
      },
      {
        title: "Studio Sound Engineering & Mixing",
        copy: "Broadcast-quality mixing, sound effects design, and mastering delivered strictly to broadcast FM audio specifications.",
      },
      {
        title: "FM Network Planning & Daypart Buying",
        copy: "Targeted spot scheduling across Mirchi, Red FM, Fever, Big FM, Radio City during peak morning and evening drive-times.",
      },
      {
        title: "RJ Mentions & On-Air Contest Activations",
        copy: "Organic Radio Jockey chatter, contest integrations, and on-ground station tie-ins that build authentic local buzz.",
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
        title: "Auditory Hook & Message Strategy",
        copy: "We define the one key thought a listener must remember when hearing your spot while navigating busy city traffic.",
      },
      {
        step: "02",
        km: "KM 03",
        title: "Scriptwriting & Voiceover Auditions",
        copy: "We draft natural, punchy dialogue scripts and test matching voice talents to find the perfect emotional cadence.",
      },
      {
        step: "03",
        km: "KM 05",
        title: "Studio Production & Jingle Composition",
        copy: "Our sound designers record, compose music, mix sound effects, and master audio to FM broadcast standards.",
      },
      {
        step: "04",
        km: "KM 07",
        title: "Prime Daypart Broadcast & Monitoring",
        copy: "Spots air across scheduled station clusters with daily airing logs verifying spot times and rotation counts.",
      },
    ],
    whyUs: [
      {
        title: "Writing That Sounds Like Real Life",
        copy: "We banish corny radio cliches. Our scripts sound like smart, humorous, real conversations that people enjoy listening to.",
      },
      {
        title: "Volume Buying Power Across All Major Networks",
        copy: "Direct network partnerships with Mirchi, Red FM, Fever, Big FM, and Radio City ensure the most favorable cost-per-second.",
      },
      {
        title: "In-House Sound Production Studio",
        copy: "Quick turnarounds for topical campaigns, festival specials, and flash sales without third-party production bottlenecks.",
      },
      {
        title: "Strategic Drive-Time Frequency Optimization",
        copy: "We place your spots when your buyer is actually behind the wheel, maximizing ear reach without wasted off-peak budget.",
      },
    ],
  },
  {
    id: "content",
    slug: "content-marketing",
    name: "Content Marketing",
    uppercaseName: "CONTENT MARKETING",
    engine: "Engine One · Brand & Creative",
    kicker: "KM 02 · Words with a mission",
    tagline: "Always-on editorial, research, and thought leadership that drives business results.",
    heading: "Content with an objective, planned around what your buyers actually search for",
    shortDescription:
      "Articles, email newsletters, whitepapers, thought leadership, and organic content that converts readers into buyers.",
    fullOverview:
      "Content marketing isn't just filling an editorial calendar with generic posts. At Ritz Media World, content is an intentional commercial engine. We map real customer search intent, build authoritative thought leadership, and produce long-form and micro-content that ranks on Google, feeds AI answers, and guides buyers down the purchase funnel.",
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
        title: "Search-Led Editorial Strategy",
        copy: "Deep keyword cluster mapping, search intent analysis, and editorial roadmaps targeted at high-converting queries.",
      },
      {
        title: "High-Value Industry Whitepapers & Guides",
        copy: "In-depth market research reports, buying guides, and case studies that establish undeniable domain authority.",
      },
      {
        title: "High-Open Email Newsletters",
        copy: "Engaging email sequences and weekly newsletters that keep prospective and existing clients closely connected.",
      },
      {
        title: "Infographics & Visual Explainer Assets",
        copy: "Complex data and market insights translated into captivating, shareable charts and social carousels.",
      },
      {
        title: "AI Answer Engine Optimization (AEO)",
        copy: "Formatting content with structured facts and authoritative schema so LLMs cite your brand as the primary reference.",
      },
      {
        title: "Distribution & Multi-Channel Repurposing",
        copy: "Transforming single flagship reports into 20+ micro-assets across LinkedIn, social feeds, and PR syndication.",
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
        title: "Search Demand & Question Mining",
        copy: "We unearth the specific questions, objections, and buying criteria your target customers research before purchasing.",
      },
      {
        step: "02",
        km: "KM 03",
        title: "Editorial Framework & Tone Definition",
        copy: "We construct an authoritative editorial voice that delivers genuine value rather than hollow marketing jargon.",
      },
      {
        step: "03",
        km: "KM 05",
        title: "Production, Visual Design & Review",
        copy: "Specialist writers and visual designers create rich, accurate, beautifully laid out content assets.",
      },
      {
        step: "04",
        km: "KM 07",
        title: "Multi-Channel Distribution & Optimization",
        copy: "Assets are published, distributed through organic and paid channels, and regularly refreshed to maintain top rankings.",
      },
    ],
    whyUs: [
      {
        title: "Subject Matter Depth Over Fluff",
        copy: "Our writers have genuine domain understanding across real estate, finance, healthcare, and retail—ensuring authentic depth.",
      },
      {
        title: "Engineered For Search Engines & AI Models",
        copy: "Structured data, natural conversational syntax, and clear answers designed to rank in Google SERPs and ChatGPT/Perplexity citations.",
      },
      {
        title: "Asset Longevity & Evergreen Compounding",
        copy: "We create assets that continue to drive traffic, inbound leads, and client trust for months and years after publication.",
      },
      {
        title: "Seamless Integration With Paid Ad Funnels",
        copy: "Content isn't an island; we connect high-performing guides directly to your retargeting and sales follow-up pipelines.",
      },
    ],
  },
  {
    id: "web",
    slug: "web-development",
    name: "Web Development",
    uppercaseName: "WEB DEVELOPMENT",
    engine: "Engine Two · Digital & Media",
    kicker: "KM 02 · Digital experiences that convert",
    tagline: "High-performance websites and digital flagships built to convert visitors into inquiries.",
    heading: "Modern web platforms, landing ecosystems, and interactive experiences",
    shortDescription:
      "Ultra-fast Next.js websites, mobile-optimized landing funnels, interactive 3D web showcases, and conversion architecture.",
    fullOverview:
      "Your website is the single digital showroom where all your campaigns, brand promises, and buyer journeys culminate. If it loads slowly, confuses navigation, or fails on mobile, millions in ad spend go to waste. Ritz Media World builds lightning-fast, visually stunning, search-ready web platforms engineered from day one to maximize commercial conversions.",
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
        title: "Custom Corporate & Brand Web Development",
        copy: "Tailored Next.js and modern stack digital flagships with silky GSAP micro-animations and responsive perfection.",
      },
      {
        title: "High-Conversion Landing Page Systems",
        copy: "Dedicated campaign landing pages designed for PPC ads with single-focus calls to action and instant form submission.",
      },
      {
        title: "Interactive 3D & WebGL Experiences",
        copy: "Three.js and WebGL digital walkthroughs that allow visitors to inspect products or properties in photorealistic 3D directly in browser.",
      },
      {
        title: "Technical SEO & Core Web Vitals Mastery",
        copy: "Clean semantic markup, optimized server-side rendering, and sub-second load speeds that Google's algorithm rewards.",
      },
      {
        title: "Lead Capture & CRM Integrations",
        copy: "Seamless integrations with Salesforce, HubSpot, Zoho, and custom WhatsApp bots for instant lead delivery to sales teams.",
      },
      {
        title: "E-Commerce & Digital Catalog Systems",
        copy: "Frictionless checkout flows, product filtering, and fast payment gateway integrations built for scale.",
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
        title: "Architecture & User Journey Mapping",
        copy: "We define page hierarchies, conversion pathways, and user mental models to eliminate friction before writing code.",
      },
      {
        step: "02",
        km: "KM 03",
        title: "Interactive UI/UX Design & Prototyping",
        copy: "We design striking, modern visual interfaces that embody your brand identity while prioritizing intuitive navigation.",
      },
      {
        step: "03",
        km: "KM 06",
        title: "Modern Front-End & Back-End Engineering",
        copy: "Our engineers build the platform using modern frameworks, ensuring clean code, rapid speeds, and seamless API hooks.",
      },
      {
        step: "04",
        km: "KM 09",
        title: "Rigorous QA, Speed Tuning & Launch",
        copy: "Cross-browser testing, accessibility checks, Core Web Vitals optimization, and flawless production deployment.",
      },
    ],
    whyUs: [
      {
        title: "Marketer-Led Web Engineering",
        copy: "We build websites from the perspective of closing sales—not just pretty code. Every button, heading, and form has a conversion job.",
      },
      {
        title: "Cutting-Edge Performance Stacks",
        copy: "We utilize modern stacks like Next.js, React, Tailwind, and GSAP to deliver world-class speed without bloated legacy plugins.",
      },
      {
        title: "Seamless Synchronization With Your Ad Campaigns",
        copy: "We design the landing page and run the Google/Meta ads simultaneously, ensuring 100% message match and top Quality Scores.",
      },
      {
        title: "Post-Launch Support & Iterative CRO",
        copy: "We monitor user heatmaps, run A/B conversion tests, and continually optimize performance after going live.",
      },
    ],
  },
  {
    id: "celebrity",
    slug: "celebrity-endorsements",
    name: "Celebrity Endorsements",
    uppercaseName: "CELEBRITY ENDORSEMENTS",
    engine: "Engine One · Brand & Creative",
    kicker: "KM 07 · Borrow the spotlight",
    tagline: "High-impact star power that elevates credibility and sparks national fascination.",
    heading: "Faces that fit the brand ethos, not just the marketing budget",
    shortDescription:
      "A-list celebrity partnerships, contract negotiations, creative commercial integration, and high-impact PR launches.",
    fullOverview:
      "A famous face can catapult brand awareness overnight—but only if the partnership feels authentic, the idea has creative merit, and the legal framework protects your commercial interests. Ritz Media World bridges brands with top Bollywood celebrities, sports icons, and prominent cultural figures, handling everything from talent matching and contract negotiations to commercial production and multi-channel PR rollouts.",
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
        title: "Strategic Talent Identification & Fit",
        copy: "Matching your brand values, target audience demographics, and budget to the most credible celebrity personalities.",
      },
      {
        title: "Rigorous Contract Negotiations",
        copy: "Structuring favorable terms for shoot days, digital rights, social media deliverables, exclusivity windows, and print usage.",
      },
      {
        title: "Creative Commercial Scripting & Directing",
        copy: "Writing scripts and campaign themes that give the celebrity a compelling, natural role rather than an artificial sales pitch.",
      },
      {
        title: "Celebrity Photo & Film Shoot Production",
        copy: "Managing star logistics, vanity requirements, premier director coordination, and rapid on-set execution.",
      },
      {
        title: "High-Voltage PR & Media Conferences",
        copy: "Orchestrating national press conferences, launch events, and media interviews that maximize earned press coverage.",
      },
      {
        title: "Cross-Channel Digital & Outdoor Rollout",
        copy: "Amplifying the endorsement across television, outdoor hoardings, print ads, and targeted social media campaigns.",
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
        title: "Brand Affinity & Budget Modeling",
        copy: "We define the exact personality traits needed and screen celebrity rosters against your brand's regional and demographic goals.",
      },
      {
        step: "02",
        km: "KM 03",
        title: "Talent Approach & Commercial Negotiations",
        copy: "We negotiate directly with talent management to secure favorable commercial terms, usage rights, and guaranteed shoot availability.",
      },
      {
        step: "03",
        km: "KM 05",
        title: "Script Approval & High-End Production",
        copy: "We develop concepts approved by the celebrity and manage full shoot production with top directors, stylists, and cinematographers.",
      },
      {
        step: "04",
        km: "KM 08",
        title: "Omnichannel Launch & PR Blitz",
        copy: "We orchestrate a coordinated national launch across digital, print, television, and outdoor channels for maximum commercial shockwave.",
      },
    ],
    whyUs: [
      {
        title: "Direct Access Without Bloated Middlemen",
        copy: "Direct relationships with leading Indian celebrity talent agencies ensure transparent fee structures and direct access.",
      },
      {
        title: "Watertight Legal & Rights Protection",
        copy: "Decades of experience crafting endorsement contracts that protect usage rights, avoid PR conflicts, and prevent overcharges.",
      },
      {
        title: "Scripting That Celebrates The Brand First",
        copy: "We make sure the star elevates your brand—not shadows it. The audience remembers your product, not just the famous face.",
      },
      {
        title: "Maximum Amplification Beyond The Shoot",
        copy: "We extract maximum value from every contracted shoot minute, creating collateral for digital ads, hoardings, and press releases.",
      },
    ],
  },
  {
    id: "influencer",
    slug: "influencer-marketing",
    name: "Influencer Marketing",
    uppercaseName: "INFLUENCER MARKETING",
    engine: "Engine One · Brand & Creative",
    kicker: "KM 08 · Make people listen",
    tagline: "Creator partnerships and viral social voices that build undeniable community trust.",
    heading: "Creators who can carry the campaign idea with authenticity and cultural relevance",
    shortDescription:
      "Macro, micro, and nano influencer networks, creator collaborations, content seeding, and performance whitelisting.",
    fullOverview:
      "Modern consumers trust authentic creator recommendations far more than corporate claims. Ritz Media World structures data-driven influencer marketing campaigns that move beyond hollow follower counts. We partner with vetted creators across tier-1, tier-2, and regional niches to generate authentic reviews, viral reels, and trackable sales conversions.",
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
        title: "Data-Driven Creator Identification",
        copy: "Auditing audience demographics, engagement authenticity, and fake follower ratios to ensure real human reach.",
      },
      {
        title: "Structured Creative Briefing & Storyboarding",
        copy: "Equipping creators with core campaign USPs while granting enough creative freedom for authentic audience resonance.",
      },
      {
        title: "Regional & Vernacular Influencer Outreach",
        copy: "Mobilizing regional creators across Hindi, Punjabi, Bengali, Marathi, and South Indian markets for hyper-local impact.",
      },
      {
        title: "Product Seeding & Experiential Activations",
        copy: "Curated unboxing experiences, launch event invites, and hands-on site visits that spark spontaneous social sharing.",
      },
      {
        title: "Paid Whitelisting & Creator Spark Ads",
        copy: "Boosting top-performing creator posts through brand ad accounts to scale viral content into sustained performance leads.",
      },
      {
        title: "End-to-End Campaign Compliance & Tracking",
        copy: "Enforcing ASCI disclosure guidelines, monitoring post live-times, and measuring clicks, promo codes, and sales attribution.",
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
        title: "Audience Alignment & Creator Screening",
        copy: "We filter thousands of creators to select only those whose actual followers align precisely with your paying demographic.",
      },
      {
        step: "02",
        km: "KM 03",
        title: "Briefing, Negotiation & Deliverable Contracts",
        copy: "We lock down firm delivery dates, video formats (Reels, Shorts, Vlogs), usage rights, and commercial terms.",
      },
      {
        step: "03",
        km: "KM 05",
        title: "Draft Review & Quality Control",
        copy: "Our team reviews all drafts prior to publishing to guarantee message accuracy, clear calls-to-action, and brand safety.",
      },
      {
        step: "04",
        km: "KM 08",
        title: "Live Wave Amplification & Whitelisting",
        copy: "We coordinate simultaneous publishing waves and run paid ad boosts on the highest-converting content.",
      },
    ],
    whyUs: [
      {
        title: "Vetted Audiences, Zero Bot Waste",
        copy: "We utilize advanced analytics to detect fake followers, pod engagement, and ghost accounts so every rupee reaches real eyes.",
      },
      {
        title: "Creative Storytelling Over Mechanical Scripts",
        copy: "We ensure creators integrate your product seamlessly into their natural content style, preventing audience ad-blindness.",
      },
      {
        title: "Performance Ad Integration (Whitelisting)",
        copy: "We don't let great influencer content vanish after 24 hours. We turn top creator reels into high-converting paid ad assets.",
      },
      {
        title: "Fast Scalability For Product Launches",
        copy: "Capable of activating 10 to 100+ creators simultaneously across India to generate overwhelming launch day momentum.",
      },
    ],
  },
  {
    id: "render",
    slug: "3d-rendering-services",
    name: "3D Rendering Services",
    uppercaseName: "3D RENDERING SERVICES",
    engine: "Engine Three · Film, 3D & AI",
    kicker: "KM 09 · Worlds you can walk through",
    tagline: "Cinema-grade 3D architectural visualization, interior renderings, and CGI.",
    heading: "Show buyers the home, the township, and the view before a single brick is laid",
    shortDescription:
      "4K exterior towers, luxury sample flat interiors, township masterplan flythroughs, and interactive 3D floor plans.",
    fullOverview:
      "High-value purchases—especially real estate and luxury products—demand total emotional conviction before money changes hands. Ritz Media World's 3D visualization studio renders architectural towers, residential interiors, township masterplans, and commercial developments with photorealistic lighting, lush landscaping, and cinematic atmosphere.",
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
        title: "3D Exterior Architectural Rendering",
        copy: "Tower elevations, majestic facades, and grand entrance lobbies rendered in golden-hour sunlight or moody twilight glow.",
      },
      {
        title: "3D Interior Sample Flat Visualization",
        copy: "Sample living rooms, designer kitchens, and master bedrooms styled with luxury furniture, accurate materials, and warm lighting.",
      },
      {
        title: "Aerial & Township Masterplan Visuals",
        copy: "Bird's-eye views of large townships, connecting road networks, lush greens, clubhouses, and surrounding infrastructure.",
      },
      {
        title: "3D Floor Plans & Cutaway Perspectives",
        copy: "Transforming flat 2D blueprint drawings into fully furnished 3D spatial floor plans that buyers comprehend in seconds.",
      },
      {
        title: "Cinematic 3D Animated Walkthroughs",
        copy: "Smooth drone-style video flythroughs complete with ambient sound design, moving foliage, and realistic light dynamics.",
      },
      {
        title: "Interactive 360° VR Sales Experiences",
        copy: "Immersive virtual reality tours ready for digital sales galleries, touch kiosks, and prospective buyer smartphones.",
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
        title: "CAD & Architectural Blueprint Ingestion",
        copy: "We study your 2D CAD drawings, material specifications, landscape plans, and exact sun orientation coordinates.",
      },
      {
        step: "02",
        km: "KM 03",
        title: "3D Geometric Modeling & Camera Angles",
        copy: "We build precise 3D geometry and present wireframe camera angles to agree on the most dramatic visual perspectives.",
      },
      {
        step: "03",
        km: "KM 06",
        title: "Texturing, Natural Lighting & Greenery",
        copy: "We apply photorealistic glass, marble, wood, atmospheric lighting, and hyper-realistic vegetation and landscaping.",
      },
      {
        step: "04",
        km: "KM 09",
        title: "Final 4K Rendering & Post-Production",
        copy: "High-end render farm processing followed by color grading and retouching, delivering assets ready for hoardings and ads.",
      },
    ],
    whyUs: [
      {
        title: "Unmatched Real Estate Industry Experience",
        copy: "We have partnered with India's leading developers (Eldeco, Gaurs, ATS, Mahagun, Prateek) and know what converts homebuyers.",
      },
      {
        title: "Cinema-Grade Lighting & Photorealism",
        copy: "No plastic-looking renders. We study atmospheric physics, natural sun angles, and material reflections to create believable beauty.",
      },
      {
        title: "Built For Immediate Marketing Integration",
        copy: "We don't just hand over renders; we adapt them directly into your website, launch hoardings, digital brochures, and social ads.",
      },
      {
        title: "Fast Turnaround On High-Stakes Launches",
        copy: "Dedicated GPU render infrastructure that meets tight project launch deadlines without sacrificing quality.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICES_LIST.find((s) => s.slug === slug || s.id === slug);
}

export function getAllServices(): ServiceDetail[] {
  return SERVICES_LIST;
}

export function getRelatedServices(currentSlug: string, count = 3): ServiceDetail[] {
  return SERVICES_LIST.filter((s) => s.slug !== currentSlug).slice(0, count);
}
