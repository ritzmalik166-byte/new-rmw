export type PortfolioTone = "pink" | "teal" | "orange" | "blue" | "red" | "yellow";

export interface PortfolioCategory {
  id: string;
  title: string;
  /** Short name for the "View … work" button; defaults to `title`. */
  cta?: string;
  href: string;
  /** Where the card links from the "Next stop" strip on detail pages; defaults to `href`. */
  moreHref?: string;
  image: string;
  copy: string;
  items: [string, string, string, string];
  tone: PortfolioTone;
}

export interface PortfolioPiece {
  src: string;
  alt: string;
  client: string;
  medium: string;
  width: number;
  height: number;
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  {
    id: "brand-identity",
    href: "/portfolio/brand-identity",
    title: "Brand Identity",
    image: "/portfolio/cat-brand-identity.png",
    copy: "Logos, visual identity systems, and brand guidelines that give a brand one consistent face, wherever it shows up.",
    items: ["Logo Design", "Visual Identity Systems", "Brand Guidelines", "Stationery & Collateral"],
    tone: "pink",
  },
  {
    id: "creative-design",
    href: "/portfolio/creative",
    title: "Creative Design",
    image: "/portfolio/cat-creative-design.png",
    copy: "Print ads, social creatives, brochures, and packaging designed to stop people on a highway, a newspaper page, a store shelf, or a feed.",
    items: ["Print Advertising Design", "Social Media Creatives", "Brochures & Marketing Collateral", "Packaging Design"],
    tone: "orange",
  },
  {
    id: "website-design",
    href: "/portfolio/web-design",
    title: "Website Design",
    image: "/portfolio/cat-website-design.png",
    copy: "Corporate, e-commerce, and campaign websites designed around how real visitors browse, search, and decide.",
    items: ["UI/UX Design", "Custom & WordPress Websites", "E-Commerce Websites", "Landing Pages"],
    tone: "teal",
  },
  {
    id: "brand-films",
    href: "/portfolio/brand-films",
    title: "Brand Films",
    image: "/portfolio/cat-brand-films.png",
    copy: "Brand films, ad films, and AI-assisted video that tell your story in a way people want to watch, on every screen from social feeds to cinema.",
    items: ["Brand Story Films", "Ad Films & Commercials", "Product Showcases", "AI-Assisted Video Content"],
    tone: "blue",
  },
  {
    id: "walk-through-videos",
    href: "/portfolio/walk-through-videos",
    title: "Walk-Through Videos",
    image: "/portfolio/cat-walkthrough.jpg",
    copy: "3D walk-throughs that let buyers tour a project, room by room, before the first brick is laid.",
    items: ["3D Walkthroughs", "Real Estate Visualizations", "Interior & Exterior Tours", "Amenity Showcases"],
    tone: "red",
  },
  {
    id: "influencer-marketing",
    href: "/portfolio/influencer-marketing-videos",
    title: "Influencer Marketing",
    image: "/portfolio/cat-influencer.jpg",
    copy: "Campaigns with micro, macro, and regional creators who speak to your audience in a voice they already trust.",
    items: [
      "Instagram & YouTube Campaigns",
      "Micro, Macro & Regional Creators",
      "Integrated Creator Content",
      "Launch & Product Promotions",
    ],
    tone: "yellow",
  },
];

export const PORTFOLIO_HERO = {
  back: {
    src: "/portfolio/presidential-box.jpg",
    alt: "Ashtech Presidential Towers gift box with a gold P-shaped photo frame",
  },
  front: {
    src: "/portfolio/presidential-frame.jpg",
    alt: "Gold Purely Presidential photo frame shaped like the letter P",
  },
};

export const PORTFOLIO_GALLERY: PortfolioPiece[] = [
  {
    src: "/portfolio/eternia-print-ad.jpg",
    alt: "Eternia by Sanskar Realty print ad: Built for those who seek more from life",
    client: "Eternia",
    medium: "Print ad",
    width: 1026,
    height: 1280,
  },
  {
    src: "/portfolio/highway-greens-hoarding.jpg",
    alt: "Highway Greens villas and plots hoarding: A new rhythm",
    client: "Highway Greens",
    medium: "Outdoor",
    width: 1229,
    height: 817,
  },
  {
    src: "/portfolio/surahi-packaging.jpg",
    alt: "Surahi blended Indian whisky bottle and label design",
    client: "Surahi",
    medium: "Packaging",
    width: 1026,
    height: 1280,
  },
  {
    src: "/portfolio/rmw-bhasad-poster.jpg",
    alt: "Hindi typography poster: Bhasad mat macha, deadline pe focus kar",
    client: "Ritz Media World",
    medium: "Social",
    width: 1229,
    height: 1846,
  },
  {
    src: "/portfolio/onyx-food-court-hoarding.jpg",
    alt: "Onyx premium food court hoarding for Sector 142, Noida",
    client: "Onyx",
    medium: "Outdoor",
    width: 1229,
    height: 817,
  },
  {
    src: "/portfolio/fabluxe-be-the-one.jpg",
    alt: "Fab Luxe Residences campaign: #BeTheOne who reigns in royalty",
    client: "Fab Luxe Residences",
    medium: "Campaign",
    width: 1229,
    height: 975,
  },
  {
    src: "/portfolio/eon1-throne.jpg",
    alt: "EON1 key visual: twin towers rising from a crown on a red velvet throne",
    client: "EON1",
    medium: "Key visual",
    width: 1026,
    height: 1280,
  },
  {
    src: "/portfolio/civitech-santoni-brochure.jpg",
    alt: "Civitech Santoni fold-out brochure in green and gold",
    client: "Civitech Santoni",
    medium: "Brochure",
    width: 1229,
    height: 1229,
  },
  {
    src: "/portfolio/rmw-social-grid.jpg",
    alt: "Grid of Hindi-English social posts for Ritz Media World",
    client: "Ritz Media World",
    medium: "Social",
    width: 1026,
    height: 1280,
  },
  {
    src: "/portfolio/highway-greens-nature.jpg",
    alt: "Highway Greens billboard: A rare shade of nature",
    client: "Highway Greens",
    medium: "Outdoor",
    width: 1229,
    height: 817,
  },
  {
    src: "/portfolio/anantram-brochure-cover.jpg",
    alt: "Anantram by Pincode Infra brochure cover: Blessed by Ayodhya",
    client: "Anantram",
    medium: "Brochure",
    width: 1229,
    height: 1229,
  },
  {
    src: "/portfolio/rmw-taurus-poster.jpg",
    alt: "Taurus zodiac poster from the #TaareBolRaheHain series",
    client: "Ritz Media World",
    medium: "Social",
    width: 1229,
    height: 1846,
  },
  {
    src: "/portfolio/gulshan-empire-hoarding.jpg",
    alt: "Gulshan Empire hoarding: Every game of chess has just one king",
    client: "Gulshan Empire",
    medium: "Outdoor",
    width: 1229,
    height: 817,
  },
  {
    src: "/portfolio/anantram-brochure-spread.jpg",
    alt: "Anantram brochure spread: A city of promise and prosperity",
    client: "Anantram",
    medium: "Brochure",
    width: 1229,
    height: 1229,
  },
  {
    src: "/portfolio/mansha-instagram-grid.jpg",
    alt: "Mansha Group Instagram grid: Turning dreams into reality",
    client: "Mansha Group",
    medium: "Social",
    width: 1026,
    height: 1280,
  },
  {
    src: "/portfolio/rmw-bhai-poster.jpg",
    alt: "Hindi typography poster: Bhai kya scene hai phir?",
    client: "Ritz Media World",
    medium: "Social",
    width: 1229,
    height: 1738,
  },
];

export const PORTFOLIO_STATS = [
  { value: 18, suffix: "+", label: "Years building brands" },
  { value: 6, suffix: "", label: "Specialist desks in-house" },
  { value: 90, suffix: "+", label: "Marketing & creative professionals" },
  { value: 1, suffix: "", label: "Roof for Strategy to Media" },
];

export const PORTFOLIO_REASONS = [
  {
    title: "Built around your goals",
    copy: "Every brief starts with what your business needs, whether that's enquiries, footfall or recall, and the creative is shaped to deliver exactly that.",
  },
  {
    title: "Specialists, one team",
    copy: "Designers, writers, developers, 3D artists and media planners work together from day one, so your brand looks and sounds the same everywhere.",
  },
  {
    title: "Rooted in India",
    copy: "Campaigns shaped by local insight, regional languages and cultural cues, so your message feels familiar to the audience it's meant for.",
  },
  {
    title: "Proven in the real world",
    copy: "Our work has run across print, radio, digital and outdoor, reaching real audiences and improving with every result.",
  },
];
