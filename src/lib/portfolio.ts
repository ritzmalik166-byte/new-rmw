export type PortfolioTone = "pink" | "teal" | "orange" | "blue" | "red" | "yellow";

export interface PortfolioCategory {
  id: string;
  title: string;
  href: string;
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
    copy: "Logos, identity systems and guidelines that give a brand one face, everywhere it shows up.",
    items: ["Logo Design", "Visual Identity Systems", "Brand Guidelines", "Stationery & Collateral"],
    tone: "pink",
  },
  {
    id: "creative-design",
    href: "/portfolio/creative",
    title: "Creative Design",
    image: "/portfolio/cat-creative-design.png",
    copy: "Campaign visuals and artwork built to stop people on a highway, a newspaper page or a feed.",
    items: ["Marketing Creatives", "Campaign Visuals", "Print & Digital Artwork", "Social Media Creatives"],
    tone: "orange",
  },
  {
    id: "website-design",
    href: "/portfolio/web-design",
    title: "Website Design",
    image: "/portfolio/cat-website-design.png",
    copy: "Websites and landing pages that are easy to use, quick to load and built to turn visits into enquiries.",
    items: ["UI/UX Design", "Corporate Websites", "Landing Pages", "E-Commerce Experiences"],
    tone: "teal",
  },
  {
    id: "brand-films",
    href: "/portfolio/brand-films",
    title: "Brand Films",
    image: "/portfolio/cat-brand-films.png",
    copy: "Brand stories, promotional films and AI-assisted video, made for every screen your buyers watch.",
    items: ["Brand Story Videos", "Promotional Films", "Product Showcases", "AI-Assisted Video Content"],
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
    copy: "Creator partnerships that put your brand inside feeds people already follow and trust.",
    items: ["Influencer Campaigns", "Creator Collaborations", "Social Amplification", "Performance-Driven Content"],
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
  { value: 6, suffix: "", label: "Creative crafts in-house" },
  { value: 90, suffix: "+", label: "Professionals" },
  { value: 1, suffix: "", label: "Roof for strategy to media" },
];

export const PORTFOLIO_REASONS = [
  {
    title: "Strategy before style",
    copy: "Every piece starts with the business problem, so the work looks good and has a job to do.",
  },
  {
    title: "One studio, every craft",
    copy: "Identity, design, web, film, 3D and creators sit under one roof in Noida, so ideas stay connected.",
  },
  {
    title: "Made for Indian buyers",
    copy: "18 years of campaigns across Delhi NCR and India, in the languages and places your audience lives.",
  },
  {
    title: "Work that went live",
    copy: "Everything on this page ran for a real brand: on highways, in newspapers, on screens and in feeds.",
  },
];
