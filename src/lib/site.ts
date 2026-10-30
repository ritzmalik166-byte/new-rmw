export type Testimonial = {
  role: string;
  company: string;
  industry: string;
  photo?: string;
  logo?: string;
  quote: string;
};

export const site = {
  name: "Ritz Media World",
  fullName: "Ritz Media World",
  tagline: "Creative OK Please",
  description:
    "Explore Ritz Media World’s full-service solutions in creative, digital, print, radio, 3D rendering, and AI, designed to grow your brand and drive real results.",
  nav: [
    { href: "/about.html", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/case-study", label: "Case Studies" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
  ],
  ticker: [
    "Ideas on board",
    "Creative OK Please",
    "India to the world",
    "No empty promises",
  ],
  proof: {
    edge: "Ideas That Travel",
    stats: [
      { value: 18, suffix: "+", label: "Years in brand building" },
      { value: 100, suffix: "+", label: "Professionals" },
    ],
    partners: [
      "/s2/clients/sm/prm-9.webp",
      "/s2/clients/sm/prm-22.webp",
      "/s2/clients/sm/mpf-bl.webp",
      "/s2/clients/sm/rdx-lg.webp",
      "/s2/clients/sm/prm-2.webp",
      "/s2/clients/sm/prm-3.webp",
      "/s2/clients/sm/prm-4.webp",
      "/s2/clients/sm/prm-5.webp",
      "/s2/clients/sm/prm-6.webp",
      "/s2/clients/sm/prm-7.webp",
      "/s2/clients/sm/prm-8.webp",
      "/s2/clients/sm/prm-10.webp",
      "/s2/clients/sm/prm-11.webp",
      "/s2/clients/sm/prm-12.webp",
      "/s2/clients/sm/exotica-logo.webp",
      "/s2/clients/sm/prm-14.webp",
      "/s2/clients/sm/prm-16.webp",
      "/s2/clients/sm/prm-17.webp",
      "/s2/clients/sm/prm-18.webp",
      "/s2/clients/sm/prm-19.webp",
      "/s2/clients/sm/prm-20.webp",
      "/s2/clients/sm/scnd-3.webp",
      "/s2/clients/sm/scnd-4.webp",
      "/s2/clients/sm/scnd-5.webp",
      "/s2/clients/sm/scnd-6.webp",
      "/s2/clients/sm/scnd-7.webp",
      "/s2/clients/sm/scnd-8.webp",
      "/s2/clients/sm/scnd-9.webp",
      "/s2/clients/sm/scnd-10.webp",
      "/s2/clients/sm/scnd-11.webp",
      "/s2/clients/sm/scnd-12.webp",
      "/s2/clients/sm/scnd-13.webp",
      "/s2/clients/sm/scnd-14.webp",
      "/s2/clients/sm/scnd-15.webp",
      "/s2/clients/sm/scnd-16.webp",
      "/s2/clients/sm/scnd-17.webp",
      "/s2/clients/sm/scnd-18.webp",
    ],
  },
  route: {
    kicker: "How we think",
    title: ["Insight", "Idea", "Impact"],
    lede: "Every project at Ritz Media World follows the same proven road, whether it is a brand launch, an advertising campaign, or a real estate project. ",
    stops: [
      {
        name: "Insight",
        km: "KM 01",
        copy: "Every project starts with your business, audience, and market, so we find the real opportunity first.",
      },
      {
        name: "Idea",
        km: "KM 02",
        copy: "Turn the insight into strategy, creative direction and communication people remember.",
      },
      {
        name: "Impact",
        km: "Destination",
        copy: "Production, digital marketing and media bring the idea to life, with every result measured.",
      },
    ],
  },
  engines: {
    title: "One agency. Three engines.",
    items: [
      {
        id: "digital",
        label: "Digital Marketing",
        heading: "Digital marketing solutions built for sustainable growth",
        copy: "Digital Marketing Agency Ritz Media World helps brands turn attention into actual growth. We handle SEO, Social Media Marketing, PPC, Reputation Management, Lead Generation, and Brand Awareness, building strategies across India that get results you can measure and count on.",
        cargo:
          "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "creative",
        label: "Creative Services",
        heading: "Campaigns, films and ideas people actually remember",
        copy: "From brand platforms to films, design and AI-led craft, we turn a business problem into work that travels. Strategy, storytelling and production sit in the same room so the idea does not get lost on the way to the screen.",
        cargo:
          "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "print",
        label: "Print Advertising",
        heading: "Print that still stops a reader in their tracks",
        copy: "Newspapers, magazines, OOH and collateral with the same craft as the film. We plan the media, write the line, and produce work that holds up at a bus shelter and in a boardroom.",
        cargo:
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "radio",
        label: "Radio Advertising",
        heading: "Audio that earns a second listen",
        copy: "Radio, podcasts and branded audio with writing that sounds like people, not a script. We place it where your audience already listens and measure what it moved.",
        cargo:
          "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "content",
        label: "Content Marketing",
        heading: "Content with a job, not just a calendar",
        copy: "Always-on stories, social, and long-form that serve the brand and the business. We plan the engine, make the work, and keep it moving so the road never goes quiet.",
        cargo:
          "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "web",
        label: "Web Development",
        heading: "Sites and products built to convert",
        copy: "Websites, landing systems and digital experiences with the same design standard as the campaign. Fast, measurable, and built so marketing and product stay on one road.",
        cargo:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "celebrity",
        label: "Celebrity Endorsements",
        heading: "Faces that fit the brand, not just the budget",
        copy: "Talent, contracts and campaigns with a clear role for the celebrity. We match the person to the idea so the endorsement feels earned, then run it across media that actually reaches people.",
        cargo:
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "influencer",
        label: "Influencer Marketing",
        heading: "Creators who can carry the idea",
        copy: "Creator partnerships, seeding and always-on influencer work with the same brief as the brand campaign. We find the voices, keep the craft, and track what the collaboration actually did.",
        cargo:
          "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "render",
        label: "3D Rendering Service",
        heading: "3D, film and worlds you can walk through",
        copy: "Product films, environments and stills with the finish of a commercial. We build the asset once and run it across campaign, digital and sales so the same world does more work.",
        cargo:
          "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1400&q=80",
      },
    ],
  },
  growth: {
    cta: "Read More",
    href: "/capabilities",
    slides: [
      {
        id: "digital",
        title: "Digital marketing strategies\nthat drive growth",
        image: "/s5/banner-hoarding.png",
        items: [
          "SEO (Search Engine Optimization)",
          "Social Media Services",
          "PPC Management",
          "ORM (Online Reputation Management)",
        ],
      },
      {
        id: "creative",
        title: "Creative campaigns people\nactually remember",
        items: [
          "Brand platforms and campaigns",
          "Films and motion design",
          "Design, craft and AI-led production",
          "Ideas that travel across media",
        ],
      },
      {
        id: "print",
        title: "Print and OOH that still\nstops a reader",
        items: [
          "Newspapers and magazines",
          "Outdoor and transit media",
          "Collateral with campaign craft",
          "Planning that holds in the real world",
        ],
      },
      {
        id: "content",
        title: "Content and web built\nto convert",
        items: [
          "Always-on content engines",
          "Websites and landing systems",
          "Social that serves the business",
          "Measurement from the first brief",
        ],
      },
      {
        id: "voices",
        title: "Voices that can carry\nthe idea",
        items: [
          "Celebrity endorsements",
          "Influencer partnerships",
          "Talent that fits the brand",
          "Rollout across paid and owned",
        ],
      },
    ],
  },
  moved: {
    title: "Work That\nMoved Something.",
    lede: "Proof before promises.",
    note: "(Client Case Study)",
    stats: [
      {
        prefix: "+",
        value: 250,
        suffix: "%",
        label: "Organic Traffic Growth",
      },
      {
        prefix: "-",
        value: 40,
        suffix: "%",
        label: "Cost Per Lead",
      },
      {
        prefix: "+",
        value: 180,
        suffix: "%",
        label: "Qualified Leads",
      },
      {
        prefix: "",
        value: 50,
        suffix: "M+",
        label: "Campaign Reach",
      },
    ],
  },
  reviews: {
    title: "Testimonials",
    items: [
      {
        role: "GHD Infra",
        company: "SEO, Creative, Social Media & Paid Campaigns",
        industry: "Real Estate",
        logo: "/s2/clients/prm-5.webp",
        quote:
          "We’ve had a great experience working with the team on our digital marketing needs. From SEO and creative designs to social media management and paid campaigns, they have been supportive, responsive, and committed to our goals. Their efforts have helped us strengthen our online presence and promote our real estate projects in Goa.",
      },
      {
        role: "Eldeco Group",
        company: "Lead Generation",
        industry: "Real Estate",
        logo: "/s2/clients/prm-22.webp",
        quote:
          "We’ve had a positive experience working with the team on lead generation for Eldeco Group. They understood our real estate business needs and focused on reaching potential homebuyers through targeted campaigns. Their efforts have helped us connect with relevant audiences and generate enquiries for our property projects.",
      },
      {
        role: "ONYX by Splendor",
        company: "Lead Generation, Creative & Social Media",
        industry: "Commercial Real Estate",
        logo: "/clients/onyx-by-splendor.png",
        quote:
          "The team has supported us in promoting ONYX by Splendor through lead generation, creative design, and social media marketing. Their work has helped us showcase the project’s commercial spaces, share updates across social platforms, and reach potential investors and businesses looking for commercial property in Noida.",
      },
      {
        role: "Exotica Housing",
        company: "Lead Generation",
        industry: "Real Estate",
        logo: "/s2/clients/exotica-logo.webp",
        quote:
          "The team has been helpful in promoting Exotica Housing’s residential projects through lead generation campaigns. They focused on reaching potential homebuyers interested in properties across Delhi-NCR and understood our project requirements well. We appreciate their efforts in bringing relevant enquiries and supporting our property marketing goals.",
      },
      {
        role: "Renox Group",
        company: "Lead Generation",
        industry: "Real Estate",
        logo: "/clients/renox.png",
        quote:
          "We’ve had a great experience working with the team on lead generation for our real estate projects. They understood our business needs and helped us reach potential homebuyers through targeted campaigns. Their approach has supported our efforts to generate enquiries and connect with people interested in our properties.",
      },
      {
        role: "Vedvan",
        company: "Creative Design & Social Media",
        industry: "Wellness Living",
        logo: "/clients/vedvan.png",
        quote:
          "The team has done an impressive job supporting Vedvan’s brand through creative design and social media marketing. They understood our vision of nature-inspired, wellness-focused living and helped communicate it through engaging visuals and content. We appreciate their creative approach and efforts in presenting Vedvan’s unique lifestyle concept to the right audience.",
      },
    ] as Testimonial[],
  },
  awards: {
    title: "Awards",
    items: [
      {
        year: "2026",
        heading: "Generative AI Campaign of the Year",
        subtitle: "AdAura Awards · AI & innovation",
        alt: "AdAura Awards 2026 trophy for Generative AI Campaign of the Year, awarded to Ritz Media World",
        src: "/awards/adaura-ai-innovation-2026.jpg",
        copy: "Marketing Mind's AdAura Awards recognised Ritz Media World's TREVOC campaign, Transforming Celebrity Endorsement into AI Cinematic Experience, in the AI & Innovation Excellence category.",
      },
      {
        year: "2025",
        heading: "ET Young Industry Leaders",
        subtitle: "Integrated advertising solutions",
        alt: "ET Young Industry Leaders 2025 award presented to Ritesh Malik, Founder, Ritz Media World",
        src: "/awards/et-young-industry-leaders-2025.jpg",
        fit: "contain",
        copy: "Recognition for excellence in integrated advertising solutions.",
      },
      {
        year: "2025",
        heading: "BIG Dream Makers",
        subtitle: "Creative services — real estate",
        alt: "BIG Dream Makers Conclave & Awards 2025 certificate awarded to Ritz Media World",
        src: "/awards/big-dream-makers-certificate-2025.jpg",
        fit: "contain",
        copy: "Awarded to Ritz Media World for excellence in creative services in real estate.",
      },
      {
        year: "2025",
        heading: "Best Real Estate Podcast",
        subtitle: "Podmasters",
        alt: "Podmasters award for Best Real Estate Podcast, Beyond the Blueprint",
        src: "/awards/podmasters-best-real-estate-podcast.jpg",
        copy: "Recognition for Ritz Malik and the real estate podcast, Beyond the Blueprint.",
      },
      {
        year: "2025",
        heading: "HT Media Festival of Gifts",
        subtitle: "Hindustan Times · Season 3",
        alt: "Framed Hindustan Times feature on the HT Media Festival of Gifts Season 3",
        src: "/awards/ht-festival-of-gifts-ritesh.jpg",
        copy: "Featured by Hindustan Times at the HT Media Festival of Gifts, where brands take centre stage.",
      },
      {
        year: "2025",
        heading: "For Us, You Are the Headline",
        subtitle: "Hindustan Times feature",
        alt: "Framed Hindustan Times front page from the HT Media Festival of Gifts",
        src: "/awards/ht-festival-of-gifts-feature.jpg",
        copy: "A Hindustan Times front-page feature celebrating the brands at the HT Media Festival of Gifts.",
      },
      {
        year: "2025",
        heading: "BIG Dream Makers Award",
        subtitle: "Award presentation",
        alt: "Ritz Media World team receiving a BIG Dream Makers award",
        src: "/awards/my-property-face-stage.jpg",
        copy: "The team celebrates its recognition at the BIG Dream Makers Conclave Awards.",
      },
      {
        year: "2024",
        heading: "ET Business Leaders",
        subtitle: "Business leadership",
        alt: "ET Business Leaders 2024 trophy",
        src: "/awards/et-business-leaders-2024-trophy.jpg",
        copy: "Ritz Media World founder Ritz Malik was recognised among the ET Business Leaders.",
      },
      {
        year: "2024",
        heading: "Jagran Gaurav Ratna",
        subtitle: "Excellence in digital media",
        alt: "Dainik Jagran Gaurav Ratna 2024 certificate of excellence for Ritesh Malik",
        src: "/awards/jagran-gaurav-ratna-2024.jpg",
        fit: "contain",
        copy: "Dainik Jagran felicitated Ritesh Malik, Managing Director, Ritz Media World, for excellence in digital media at Gautambuddha Nagar.",
      },
      {
        year: "2022",
        heading: "ET Excellence Leadership Awards",
        subtitle: "Most trusted advertising agency in NCR",
        alt: "Framed Economic Times Excellence Leadership Awards 2022 feature on Ritz Media World",
        src: "/awards/et-excellence-leadership-2022.jpg",
        copy: "The Economic Times named Ritz Media World one of the most trusted advertising agencies in NCR.",
      },
      {
        year: "2011",
        heading: "Special Achievement Award",
        subtitle: "RED FM 93.5 · Retail category",
        alt: "RED FM 93.5 Special Achievement Award in the retail category",
        src: "/awards/red-fm-special-achievement-2011.jpg",
        copy: "Creative Thinks Media received the Special Achievement Award at the National Sales Meet in Goa.",
      },
    ],
  },
  news: {
    title: "What's New? News & Blogs",
    lede: "Ideas, perspectives and practical guides from Ritz Media World.",
    cta: "View all blogs",
    href: "/blog",
  },
  highways: {
    title: "Common Highways.",
    lede: "Clear answers about how we work, what we offer, and how we help brands grow across creative, media, digital, and technology.",
    card: {
      slogan: ["BURI NAZAR WALE,", "RANKING DEKH"],
      search: {
        keyword: "best creative agency for real estate in gurgaon",
        url: "https://www.ritzmediaworld.com",
        title: "Best Creative Agency for Real Estate in Gurgaon | Ritz Media World",
        snippet:
          "Real estate branding, launch campaigns, 3D walkthroughs, digital and media for developers across Gurgaon and NCR.",
      },
      cta: "Request an Audit",
      href: "/contact.html",
    },
    truck: "/trucks/rmw-billboard-truck.webp",
    faqs: [
      {
        q: "What services does Ritz Media World offer?",
        a: "Ritz Media World is a full-service advertising agency offering branding, creative campaigns, media planning and buying, digital marketing, SEO, social media, film production, 3D rendering, and AI services, from AI creatives and brand videos to AI implementation and workflow automation, all delivered by one integrated team.",
      },
      {
        q: "Which industries do you work with?",
        a: "We work with brands across real estate, education, retail, hospitality, and consumer goods. Over 18 years, we have built deep experience in real estate marketing, and we apply the same strategic rigor to every industry we serve.",
      },
      {
        q: "How do you decide which marketing channels are right for my brand?",
        a: "We start by understanding your audience, goals, and budget, and then build a channel mix that fits. This can include Google Ads, Meta Ads, SEO, social media, print, outdoor and television, and we adjust the mix based on what performs best.",
      },
      {
        q: "Can you handle both creative and media under one roof?",
        a: "Yes. Our strategy, creative, media, and digital teams work together on every campaign, so the idea, the design, and the media plan stay consistent, and you deal with one partner instead of several.",
      },
      {
        q: "Do you produce brand films, 3D rendering, and AI content?",
        a: "Yes. Our in-house teams create brand films, ad films, 3D renders and walkthroughs, and AI-powered creatives and videos. We also help businesses implement AI and automate everyday workflows, which keeps timelines shorter and quality consistent.",
      },
      {
        q: "How do you measure and report campaign ROI?",
        a: "We track the metrics that matter to your business, such as lead quality, cost per lead, conversions, and revenue contribution. Our reports are written in language that both marketing and sales teams can use, rather than relying on vanity metrics alone.",
      },
    ],
  },
  about: {
    faqs: [
      {
        q: "When Was Ritz Media World Founded, and by Whom?",
        a: "Ritz Media World was founded in August 2008 by Mr. Ritz Malik, who has led the agency ever since. He also founded Creative Thinks Media, a sister agency.",
      },
      {
        q: "Where Is Ritz Media World Based?",
        a: "Ritz Media World is headquartered in Noida, Delhi NCR, and works with brands across India.",
      },
      {
        q: "How Has Ritz Media World Grown Since 2008?",
        a: "The agency began with a mission to reimagine brand communication for India's growth markets. In 2012, it pioneered centrespread storytelling in Hindustan Times, and in 2016 it expanded into 360° digital marketing. In 2026, it introduced AI-powered 3D rendering, continuing 18 years of adapting to every major shift in Indian marketing.",
      },
      {
        q: "What Awards and Recognition Has Ritz Media World Received?",
        a: "Ritz Media World was named Best Creative Agency (Real Estate) in Delhi NCR by Big FM in 2025.",
      },
      {
        q: "What Partnerships and Accreditations Does Ritz Media World Hold?",
        a: "Ritz Media World is a Google Partner, a Meta Business Partner, a member of the Indian Newspaper Society, and a registered MSME.",
      },
      {
        q: "What Makes Ritz Media World Different from Other Agencies?",
        a: "As an independent agency, Ritz Media World combines 18 years of experience across print, radio and digital with newer capabilities in AI and 3D. This means clients get the judgement of a long-established agency together with the speed and tools of a modern one, all from a single team.",
      },
      {
        q: "How Can I Start Working with Ritz Media World?",
        a: "You can reach the team through the contact form on the website, by email at info@ritzmediaworld.com, or by phone at +91 7290002168. We usually begin with a conversation about your brand's goals, followed by a free audit and a tailored plan.",
      },
    ],
  },
  startProject: {
    kicker: "Start a Project",
    title: "Get a Free Consultation for Your Brand",
    formTitle: "Shuru Karein – It's Free",
    cta: "Get My Free Consultation",
    pills: ["Branding", "SEO", "Social Media", "Performance"],
    services: [
      "Digital Marketing",
      "Creative Services",
      "Print Advertising",
      "Radio Advertising",
      "Content Marketing",
      "Web Development",
      "Celebrity Endorsements",
      "Influencer Marketing",
      "3D Rendering Service",
    ],
  },
  footer: {
    title: ["Have a", "destination", "in", "mind?"],
    blurb:
      "Ritz Media World is a creative, branding, digital, and media agency, founded in 2008 and based in Noida.",
    address: "402–404, 4th Floor, Corporate Park, Tower A1, Sector 142, Noida 201305",
    email: "info@ritzmediaworld.com",
    phones: ["+91 7290002168", "+91 9220516777"],
    company: [
      { label: "Home", href: "/#home-hero" },
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "About", href: "/about.html" },
      { label: "Blogs", href: "/blog" },
      { label: "Career", href: "/career" },
      { label: "Contact Us", href: "/contact.html" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
    socials: [
      { label: "Facebook", href: "https://www.facebook.com/ritzmediaworld/" },
      { label: "Instagram", href: "https://www.instagram.com/ritzmediaworld/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/ritzmediaworld/" },
      { label: "X (Twitter)", href: "https://x.com/ritzmediaworld" },
      { label: "YouTube", href: "https://www.youtube.com/@ritzmediaworld" },
    ],
    partners: [
      { src: "/footer/partners/ins.png", alt: "Indian Newspaper Society", width: 63, height: 36 },
      { src: "/footer/partners/meta.png", alt: "Meta Business Partner", width: 78, height: 27 },
      { src: "/footer/partners/google.png", alt: "Google Partner", width: 35, height: 35 },
      { src: "/footer/partners/msme.png", alt: "MSME", width: 60, height: 28 },
    ],
    googleSource: "https://www.google.com/preferences/source?q=ritzmediaworld.com",
  },
};

export const projects = [
  {
    slug: "atelier-nord",
    title: "Atelier Nord",
    tag: "Identity",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "maison-lune",
    title: "Maison Lune",
    tag: "Digital",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "harbor-house",
    title: "Harbor House",
    tag: "Experience",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80",
  },
];
