"use client";

import { useGSAP } from "@gsap/react";
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

registerGsap();

type TabId = "uiux" | "custom" | "ecom" | "landing" | "wp";

const TABS: { id: TabId; label: string; url: string; summary: string }[] = [
  {
    id: "uiux",
    label: "UI/UX Design",
    url: "figma.com/design/yourbrand-home",
    summary:
      "A designer lays out a homepage in a design tool: navigation, headline, image and a call-to-action button.",
  },
  {
    id: "custom",
    label: "Custom Development",
    url: "yourbrand.com",
    summary: "A finished custom website template, scrolling from the hero to services and a testimonial.",
  },
  {
    id: "ecom",
    label: "E-Commerce",
    url: "shop.yourbrand.com",
    summary: "An online store where products are added to the cart and the cart count updates.",
  },
  {
    id: "landing",
    label: "Landing Pages",
    url: "localhost:3000/vedvan",
    summary:
      "Code is written on the left while the Vedvan real estate landing page builds live on the right.",
  },
  {
    id: "wp",
    label: "WordPress",
    url: "yourbrand.com/wp-admin/post.php",
    summary:
      "A WordPress page is edited in the block editor while the live page updates alongside it.",
  },
];

export function ServicesWebMockup() {
  const [active, setActive] = useState<TabId>("uiux");
  const tabsRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = TABS.findIndex((t) => t.id === active);
    const next = TABS[(index + step + TABS.length) % TABS.length];
    setActive(next.id);
    tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${next.id}"]`)?.focus();
  };

  return (
    <div className="wm">
      <div className="wm-frame">
        <div className="wm-window">
          <div className="wm-bar" aria-hidden>
            <span className="wm-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="wm-url">
              <svg viewBox="0 0 24 24">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              <span key={tab.url} className="wm-url-text">
                {tab.url}
              </span>
            </span>
          </div>

          <div
            ref={tabsRef}
            className="wm-tabs"
            role="tablist"
            aria-label="Web services"
            onKeyDown={onKeyDown}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                data-tab={t.id}
                id={`${baseId}-tab-${t.id}`}
                aria-selected={t.id === active}
                aria-controls={`${baseId}-panel`}
                tabIndex={t.id === active ? 0 : -1}
                className="wm-tab"
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div
            id={`${baseId}-panel`}
            className="wm-stage"
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active}`}
          >
            <p className="sr-only">{tab.summary}</p>
            {active === "uiux" && <UxScene />}
            {active === "custom" && <CustomScene />}
            {active === "ecom" && <EcomScene />}
            {active === "landing" && <LandingScene />}
            {active === "wp" && <WpScene />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shared scene machinery ---------- */

type SceneContext = {
  root: HTMLElement;
  tl: gsap.core.Timeline;
  q: (selector: string) => HTMLElement[];
  one: (selector: string) => HTMLElement;
};

/* Builds a looping timeline for a scene that only plays while it is on screen.
   Every scene must add a "hold" label: reduced motion parks the scene there. */
function useScene(build: (ctx: SceneContext) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !ready) return;

      const tl = gsap.timeline({
        paused: true,
        repeat: -1,
        repeatDelay: 0.3,
        defaults: { ease: "power2.out" },
      });
      build({
        root,
        tl,
        q: (selector) => gsap.utils.toArray<HTMLElement>(selector, root),
        one: (selector) => root.querySelector<HTMLElement>(selector) as HTMLElement,
      });

      if (reduced) {
        tl.pause("hold");
        return;
      }

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
      if (trigger.isActive) tl.play();
      return () => trigger.kill();
    },
    { scope: ref, dependencies: [ready, reduced] },
  );

  return ref;
}

function moveCursor(
  tl: gsap.core.Timeline,
  cursor: HTMLElement,
  x: number,
  y: number,
  position: gsap.Position = "+=0.15",
  duration = 0.65,
) {
  tl.to(cursor, { left: `${x}%`, top: `${y}%`, duration, ease: "power2.inOut" }, position);
}

function clickCursor(tl: gsap.core.Timeline, cursor: HTMLElement) {
  tl.fromTo(
    cursor.querySelector(".wm-cursor-ring"),
    { autoAlpha: 0.9, scale: 0.2 },
    { autoAlpha: 0, scale: 1.7, duration: 0.45, ease: "power2.out", immediateRender: false },
  ).to(cursor.querySelector("svg"), { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1 }, "<");
}

/* Typing is a stepped clip so it rewinds cleanly when the loop restarts. */
function typeOn(
  tl: gsap.core.Timeline,
  target: Element | Element[],
  chars: number,
  position?: gsap.Position,
  speed = 0.035,
) {
  tl.fromTo(
    target,
    { clipPath: "inset(0% 100% 0% 0%)" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: Math.max(0.15, chars * speed),
      ease: `steps(${Math.max(1, chars)})`,
    },
    position,
  );
}

function typeOff(
  tl: gsap.core.Timeline,
  target: Element,
  chars: number,
  position?: gsap.Position,
  speed = 0.02,
) {
  tl.fromTo(
    target,
    { clipPath: "inset(0% 0% 0% 0%)" },
    {
      clipPath: "inset(0% 100% 0% 0%)",
      duration: Math.max(0.15, chars * speed),
      ease: `steps(${Math.max(1, chars)})`,
    },
    position,
  );
}

function Cursor({ label, style }: { label?: string; style: CSSProperties }) {
  return (
    <span className="wm-cursor" style={style}>
      <span className="wm-cursor-ring" />
      <svg viewBox="0 0 24 24">
        <path d="M4 2.5 19.5 12l-7 1.7L9 21z" />
      </svg>
      {label && <span className="wm-cursor-tag">{label}</span>}
    </span>
  );
}

/* ---------- UI/UX: designing the page in a design tool ---------- */

type Rect = readonly [number, number, number, number];

const UX_RECTS = {
  nav: [4, 5, 92, 10],
  title: [6, 24, 50, 15],
  para: [6, 44, 44, 12],
  button: [6, 63, 20, 9],
  image: [60, 24, 34, 48],
} satisfies Record<string, Rect>;

/* The artboard sits at 6%/12% of the canvas column (17%–80% of the scene). */
const UX_BOARD = { x: 17 + 63 * 0.06, y: 12, w: 63 * 0.88, h: 80 };
const boardToScene = (x: number, y: number) =>
  [UX_BOARD.x + (x * UX_BOARD.w) / 100, UX_BOARD.y + (y * UX_BOARD.h) / 100] as const;

const rectStyle = ([x, y, w, h]: Rect): CSSProperties => ({
  left: `${x}%`,
  top: `${y}%`,
  width: `${w}%`,
  height: `${h}%`,
});

function UxScene() {
  const ref = useScene(({ tl, q, one }) => {
    const cursor = one(".wm-cursor");
    const sel = one(".wm-ux-sel");

    const steps: { el: string; layer: string; rect: Rect }[] = [
      { el: ".wm-ux-nav", layer: ".wm-ux-layer--nav", rect: UX_RECTS.nav },
      { el: ".wm-ux-title", layer: ".wm-ux-layer--title", rect: UX_RECTS.title },
      { el: ".wm-ux-para", layer: ".wm-ux-layer--para", rect: UX_RECTS.para },
      { el: ".wm-ux-img", layer: ".wm-ux-layer--img", rect: UX_RECTS.image },
      { el: ".wm-ux-btn", layer: ".wm-ux-layer--btn", rect: UX_RECTS.button },
    ];

    steps.forEach(({ el, layer, rect: [x, y, w, h] }, i) => {
      const [sx, sy] = boardToScene(x, y);
      const [ex, ey] = boardToScene(x + w, y + h);
      moveCursor(tl, cursor, sx, sy, i === 0 ? 0.3 : "+=0.15", 0.55);
      tl.set(sel, { autoAlpha: 1, left: `${x}%`, top: `${y}%`, width: "0%", height: "0%" })
        .to(sel, { width: `${w}%`, height: `${h}%`, duration: 0.55, ease: "power2.inOut" })
        .to(cursor, { left: `${ex}%`, top: `${ey}%`, duration: 0.55, ease: "power2.inOut" }, "<")
        .fromTo(one(el), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.35 })
        .fromTo(one(layer), { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.3 }, "<");
    });

    moveCursor(tl, cursor, 82.8, 47.4, "+=0.25", 0.75);
    clickCursor(tl, cursor);
    tl.to(one(".wm-ux-swatch"), { backgroundColor: "#c8102e", duration: 0.25 }, "<")
      .fromTo(one(".wm-ux-hex-old"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, "<")
      .fromTo(one(".wm-ux-hex-new"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, "<")
      .to(one(".wm-ux-btn"), { backgroundColor: "#c8102e", duration: 0.4 }, "<");
    moveCursor(tl, cursor, 66, 86, "+=0.35", 0.8);

    tl.addLabel("hold")
      .to(sel, { autoAlpha: 0, duration: 0.3 }, "hold")
      .to({}, { duration: 2.4 })
      .to(q(".wm-ux-board, .wm-ux-layers-list"), { autoAlpha: 0, duration: 0.35 });
  });

  return (
    <div ref={ref} className="wm-scene wm-ux" aria-hidden>
      <div className="wm-ux-layers">
        <p className="wm-panel-title">Layers</p>
        <div className="wm-ux-layers-list">
          <span className="wm-ux-layer wm-ux-layer--frame">
            <i />
            Home — Desktop
          </span>
          <span className="wm-ux-layer wm-ux-layer--child wm-ux-layer--nav">
            <i />
            Navigation
          </span>
          <span className="wm-ux-layer wm-ux-layer--child wm-ux-layer--title">
            <i />
            Headline
          </span>
          <span className="wm-ux-layer wm-ux-layer--child wm-ux-layer--para">
            <i />
            Intro text
          </span>
          <span className="wm-ux-layer wm-ux-layer--child wm-ux-layer--img">
            <i />
            Hero image
          </span>
          <span className="wm-ux-layer wm-ux-layer--child wm-ux-layer--btn">
            <i />
            Button / Primary
          </span>
        </div>
      </div>

      <div className="wm-ux-canvas">
        <div className="wm-ux-board">
          <span className="wm-ux-board-label">Home — Desktop · 1440</span>
          <div className="wm-ux-el wm-ux-nav" style={rectStyle(UX_RECTS.nav)}>
            <span className="wm-ux-logo" />
            <span className="wm-ux-links">
              <i />
              <i />
              <i />
            </span>
            <span className="wm-ux-cta" />
          </div>
          <div className="wm-ux-el wm-ux-title" style={rectStyle(UX_RECTS.title)}>
            <i />
            <i />
          </div>
          <div className="wm-ux-el wm-ux-para" style={rectStyle(UX_RECTS.para)}>
            <i />
            <i />
            <i />
          </div>
          <div className="wm-ux-el wm-ux-img" style={rectStyle(UX_RECTS.image)} />
          <div className="wm-ux-el wm-ux-btn" style={rectStyle(UX_RECTS.button)}>
            Get started
          </div>
          <span className="wm-ux-sel">
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>

      <div className="wm-ux-props">
        <p className="wm-panel-title">Design</p>
        <div className="wm-ux-row">
          <span className="wm-ux-field">
            <b>W</b> 412
          </span>
          <span className="wm-ux-field">
            <b>H</b> 96
          </span>
        </div>
        <div className="wm-ux-row">
          <span className="wm-ux-field">
            <b>X</b> 64
          </span>
          <span className="wm-ux-field">
            <b>Y</b> 520
          </span>
        </div>
        <p className="wm-panel-title wm-ux-fill-title">Fill</p>
        <div className="wm-ux-fill">
          <span className="wm-ux-swatch" />
          <span className="wm-ux-hex">
            <span className="wm-ux-hex-old">D9D9D9</span>
            <span className="wm-ux-hex-new">C8102E</span>
          </span>
          <span className="wm-ux-opacity">100%</span>
        </div>
        <div className="wm-ux-type">
          <p className="wm-panel-title">Text</p>
          <span className="wm-ux-field">Quattrocento · 48</span>
        </div>
      </div>

      <Cursor label="Designer" style={{ left: "46%", top: "58%" }} />
    </div>
  );
}

/* ---------- Custom development: a finished template ---------- */

function CustomScene() {
  const ref = useScene(({ root, tl, q, one }) => {
    const page = one(".wm-tpl-page");
    const travel = () => Math.max(0, page.offsetHeight - root.offsetHeight);

    tl.fromTo(one(".wm-tpl-nav"), { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.2)
      .fromTo(
        q(".wm-tpl-hero-copy > *"),
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 },
        "-=0.15",
      )
      .fromTo(
        one(".wm-tpl-hero-art"),
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" },
        "<0.1",
      )
      .fromTo(
        q(".wm-tpl-chip"),
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2.5)", stagger: 0.1 },
        "-=0.3",
      )
      .addLabel("hold")
      .to({}, { duration: 1.1 })
      .to(page, { y: () => -travel() * 0.48, duration: 1.6, ease: "power2.inOut" })
      .fromTo(
        q(".wm-tpl-card"),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.12 },
        "-=0.7",
      )
      .to({}, { duration: 1.1 })
      .to(page, { y: () => -travel(), duration: 1.4, ease: "power2.inOut" })
      .to({}, { duration: 1.2 })
      .to(page, { y: 0, duration: 1.3, ease: "power3.inOut" })
      .to(page, { autoAlpha: 0, duration: 0.3 }, "+=0.6");
  });

  return (
    <div ref={ref} className="wm-scene wm-tpl" aria-hidden>
      <div className="wm-tpl-page">
        <div className="wm-tpl-nav">
          <span className="wm-tpl-logo">
            yourbrand<i>.</i>
          </span>
          <span className="wm-tpl-links">
            <span>Home</span>
            <span>About</span>
            <span>Services</span>
            <span>Work</span>
          </span>
          <span className="wm-tpl-nav-cta">Contact</span>
        </div>

        <div className="wm-tpl-hero">
          <div className="wm-tpl-hero-copy">
            <span className="wm-tpl-kicker">Design · Build · Grow</span>
            <span className="wm-tpl-h">Make the first impression the lasting one.</span>
            <span className="wm-tpl-p">
              A custom website built around your brand, your buyers and the enquiries you want.
            </span>
            <span className="wm-tpl-btns">
              <span className="wm-tpl-btn">Get started</span>
              <span className="wm-tpl-btn wm-tpl-btn--ghost">See our work</span>
            </span>
          </div>
          <div className="wm-tpl-hero-art">
            <span className="wm-tpl-orb wm-tpl-orb--a" />
            <span className="wm-tpl-orb wm-tpl-orb--b" />
            <span className="wm-tpl-window">
              <i />
              <i />
              <i />
            </span>
            <span className="wm-tpl-chips">
              <span className="wm-tpl-chip">Fast</span>
              <span className="wm-tpl-chip">SEO-ready</span>
              <span className="wm-tpl-chip">Responsive</span>
            </span>
          </div>
        </div>

        <div className="wm-tpl-logos">
          <span>Built for growing brands</span>
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="wm-tpl-features">
          <span className="wm-tpl-section-title">What we do</span>
          <div className="wm-tpl-cards">
            {[
              { t: "Strategy", c: "#c8102e" },
              { t: "Design", c: "#1457a8" },
              { t: "Development", c: "#0d9488" },
            ].map(({ t, c }) => (
              <span key={t} className="wm-tpl-card">
                <i style={{ background: c }} />
                <b>{t}</b>
                <em />
                <em />
              </span>
            ))}
          </div>
        </div>

        <div className="wm-tpl-quote">
          <span>“Clean, fast and easy to update. Exactly what we needed.”</span>
          <small>— Marketing Head, Client</small>
        </div>

        <div className="wm-tpl-footer">
          <span className="wm-tpl-logo">
            yourbrand<i>.</i>
          </span>
          <span>© 2026 · Privacy · Terms</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- E-commerce: adding to cart ---------- */

const PRODUCTS = [
  { name: "Brass Table Lamp", price: "₹2,499", tone: "#f3d9a4", accent: "#c8912b", shape: "lamp" },
  { name: "Terracotta Vase", price: "₹1,299", tone: "#f6d3c4", accent: "#c4553a", shape: "vase" },
  { name: "Lounge Chair", price: "₹8,999", tone: "#d6e4f2", accent: "#1457a8", shape: "chair" },
  { name: "Snake Plant", price: "₹799", tone: "#d5eadb", accent: "#2f7a57", shape: "plant" },
] as const;

/* Matches the grid: 4% side padding, 4 columns, 2.5% gaps (all of scene width). */
const SHOP_COL = (100 - 8 - 3 * 2.5) / 4;
const shopColCenter = (i: number) => 4 + i * (SHOP_COL + 2.5) + SHOP_COL / 2;
const SHOP_BTN_Y = 91;
const SHOP_CART = { x: 95.2, y: 8 };

function EcomScene() {
  const ref = useScene(({ tl, q, one }) => {
    const cursor = one(".wm-cursor");
    const fly = one(".wm-shop-fly");
    const cart = one(".wm-shop-cart");
    const cards = q(".wm-shop-card");

    tl.fromTo(
      cards,
      { autoAlpha: 0, y: 18, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.6)" },
      0.2,
    );

    const addToCart = (i: number, first: boolean) => {
      const x = shopColCenter(i);
      const card = cards[i];
      moveCursor(tl, cursor, x, SHOP_BTN_Y, "+=0.3", 0.75);
      clickCursor(tl, cursor);
      tl.to(card.querySelector(".wm-shop-add-label"), { autoAlpha: 0, duration: 0.15 }, "<")
        .fromTo(
          card.querySelector(".wm-shop-added-label"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.15 },
          "<",
        )
        .to(card.querySelector(".wm-shop-add"), { backgroundColor: "#1f8a4c", duration: 0.2 }, "<")
        .fromTo(
          fly,
          { autoAlpha: 1, left: `${x}%`, top: `${SHOP_BTN_Y}%`, scale: 1, backgroundColor: PRODUCTS[i].accent },
          { left: `${SHOP_CART.x}%`, duration: 0.75, ease: "power1.inOut", immediateRender: false },
          "<0.05",
        )
        .to(fly, { top: `${SHOP_CART.y}%`, duration: 0.75, ease: "power3.out" }, "<")
        .to(fly, { autoAlpha: 0, scale: 0.3, duration: 0.15 })
        .to(cart, { scale: 1.25, duration: 0.12, yoyo: true, repeat: 1 }, "<");

      if (first) {
        tl.fromTo(
          one(".wm-shop-badge"),
          { autoAlpha: 0, scale: 0 },
          { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(3)" },
          "<",
        );
      } else {
        tl.fromTo(
          one(".wm-shop-count-1"),
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -6, duration: 0.15 },
          "<",
        )
          .fromTo(
            one(".wm-shop-count-2"),
            { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, duration: 0.2 },
            "<0.05",
          );
      }
    };

    addToCart(1, true);
    addToCart(2, false);
    moveCursor(tl, cursor, 70, 60, "+=0.2", 0.6);
    tl.fromTo(
      one(".wm-shop-toast"),
      { autoAlpha: 0, yPercent: -80 },
      { autoAlpha: 1, yPercent: 0, duration: 0.45, ease: "back.out(1.8)" },
      "<",
    )
      .addLabel("hold")
      .to({}, { duration: 2.4 })
      .to(q(".wm-shop-card, .wm-shop-toast"), { autoAlpha: 0, duration: 0.3 });
  });

  return (
    <div ref={ref} className="wm-scene wm-shop" aria-hidden>
      <div className="wm-shop-head">
        <span className="wm-shop-logo">
          yourbrand <em>store</em>
        </span>
        <span className="wm-shop-search">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          Search home decor
        </span>
        <span className="wm-shop-cart">
          <svg viewBox="0 0 24 24">
            <path d="M3 4h2l2.4 11h10.2L20 8H7" />
            <circle cx="9.5" cy="19" r="1.4" />
            <circle cx="16.5" cy="19" r="1.4" />
          </svg>
          <span className="wm-shop-badge">
            <span className="wm-shop-count-1">1</span>
            <span className="wm-shop-count-2">2</span>
          </span>
        </span>
      </div>

      <div className="wm-shop-chips">
        <span className="is-active">All</span>
        <span>Living</span>
        <span>Decor</span>
        <span>Lighting</span>
      </div>

      <div className="wm-shop-grid">
        {PRODUCTS.map((p) => (
          <div
            key={p.name}
            className="wm-shop-card"
            style={{ "--tone": p.tone, "--accent": p.accent } as CSSProperties}
          >
            <span className={cn("wm-shop-img", `wm-shop-img--${p.shape}`)}>
              <i />
              <i />
            </span>
            <span className="wm-shop-name">{p.name}</span>
            <span className="wm-shop-price">{p.price}</span>
            <span className="wm-shop-add">
              <span className="wm-shop-add-label">Add to cart</span>
              <span className="wm-shop-added-label">Added ✓</span>
            </span>
          </div>
        ))}
      </div>

      <span className="wm-shop-fly" />
      <span className="wm-shop-toast">
        2 items in your cart <b>Checkout →</b>
      </span>
      <Cursor style={{ left: "50%", top: "62%" }} />
    </div>
  );
}

/* ---------- Landing page: code on the left, Vedvan builds on the right ---------- */

type Tok = "p" | "t" | "a" | "s" | "x";
type Reveal =
  | "hero"
  | "nav"
  | "h1"
  | "sub"
  | "btn"
  | "decor"
  | "amen"
  | "chipsA"
  | "chipsB"
  | "card"
  | "cardTitle"
  | "inputs"
  | "cardBtn";

const CODE: { indent: number; tokens: [Tok, string][]; reveal?: Reveal }[] = [
  {
    indent: 0,
    tokens: [["p", "<"], ["t", "section"], ["a", " className"], ["p", "="], ["s", '"hero"'], ["p", ">"]],
    reveal: "hero",
  },
  {
    indent: 1,
    tokens: [
      ["p", "<"],
      ["t", "Nav"],
      ["a", " logo"],
      ["p", "="],
      ["s", '"VEDVAN"'],
      ["a", " cta"],
      ["p", "="],
      ["s", '"Enquire"'],
      ["p", " />"],
    ],
    reveal: "nav",
  },
  {
    indent: 1,
    tokens: [["p", "<"], ["t", "h1"], ["p", ">"], ["x", "Live where the forest begins"], ["p", "</"], ["t", "h1"], ["p", ">"]],
    reveal: "h1",
  },
  {
    indent: 1,
    tokens: [["p", "<"], ["t", "p"], ["p", ">"], ["x", "3 & 4 BHK forest residences"], ["p", "</"], ["t", "p"], ["p", ">"]],
    reveal: "sub",
  },
  {
    indent: 1,
    tokens: [["p", "<"], ["t", "Button"], ["p", ">"], ["x", "Book a Site Visit"], ["p", "</"], ["t", "Button"], ["p", ">"]],
    reveal: "btn",
  },
  { indent: 0, tokens: [["p", "</"], ["t", "section"], ["p", ">"]], reveal: "decor" },
  { indent: 0, tokens: [["p", "<"], ["t", "Amenities"], ["a", " items"], ["p", "={["]], reveal: "amen" },
  { indent: 1, tokens: [["s", '"Clubhouse"'], ["p", ", "], ["s", '"Forest Trail"'], ["p", ","]], reveal: "chipsA" },
  { indent: 1, tokens: [["s", '"Infinity Pool"'], ["p", ","]], reveal: "chipsB" },
  { indent: 0, tokens: [["p", "]} />"]] },
  { indent: 0, tokens: [["p", "<"], ["t", "EnquiryForm"]], reveal: "card" },
  { indent: 1, tokens: [["a", "title"], ["p", "="], ["s", '"Get the brochure"']], reveal: "cardTitle" },
  {
    indent: 1,
    tokens: [["a", "fields"], ["p", "={["], ["s", '"name"'], ["p", ", "], ["s", '"phone"'], ["p", "]}"]],
    reveal: "inputs",
  },
  { indent: 0, tokens: [["p", "/>"]], reveal: "cardBtn" },
];

function LandingScene() {
  const ref = useScene(({ tl, q, one }) => {
    const lines = q(".wm-code-line");
    const chips = q(".wm-vv-chip");
    const fadeUp = (target: Element | Element[]) =>
      tl.fromTo(target, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.05");
    const pop = (target: Element | Element[]) =>
      tl.fromTo(
        target,
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2.6)", stagger: 0.08 },
        "-=0.05",
      );

    const reveals: Record<Reveal, () => void> = {
      hero: () => tl.fromTo(one(".wm-vv-hero"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 }, "-=0.05"),
      nav: () => tl.fromTo(one(".wm-vv-nav"), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.05"),
      h1: () =>
        tl.fromTo(
          one(".wm-vv-h1"),
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power2.inOut" },
          "-=0.05",
        ),
      sub: () => fadeUp(one(".wm-vv-sub")),
      btn: () => pop(one(".wm-vv-btn")),
      decor: () =>
        tl
          .fromTo(
            q(".wm-vv-tower"),
            { scaleY: 0 },
            { scaleY: 1, duration: 0.6, ease: "power3.out", stagger: 0.1 },
            "-=0.05",
          )
          .fromTo(
            q(".wm-vv-tree"),
            { scale: 0 },
            { scale: 1, duration: 0.45, ease: "back.out(2)", stagger: 0.05 },
            "-=0.4",
          ),
      amen: () => fadeUp(one(".wm-vv-amen")),
      chipsA: () => pop(chips.slice(0, 2)),
      chipsB: () => pop(chips.slice(2)),
      card: () =>
        tl.fromTo(one(".wm-vv-card"), { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.45 }, "-=0.05"),
      cardTitle: () => fadeUp(one(".wm-vv-card-title")),
      inputs: () => fadeUp(q(".wm-vv-input")),
      cardBtn: () => pop(one(".wm-vv-card-btn")),
    };

    CODE.forEach((line, i) => {
      const chars = line.indent * 2 + line.tokens.reduce((n, [, text]) => n + text.length, 0);
      tl.fromTo(lines[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, i === 0 ? 0.3 : "+=0.08");
      typeOn(tl, lines[i].querySelector(".wm-code-text") as Element, chars, "<", 0.022);
      if (line.reveal) reveals[line.reveal]();
    });

    tl.fromTo(one(".wm-code-busy"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, "+=0.2")
      .fromTo(one(".wm-code-done"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, "<")
      .fromTo(
        one(".wm-prev-live"),
        { scale: 1 },
        { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1 },
        "<",
      )
      .addLabel("hold")
      .to({}, { duration: 2.6 })
      .to(q(".wm-code-body, .wm-vv"), { autoAlpha: 0, duration: 0.35 });
  });

  return (
    <div ref={ref} className="wm-scene wm-land" aria-hidden>
      <div className="wm-code">
        <div className="wm-code-head">
          <span className="wm-code-file">page.tsx</span>
          <span className="wm-code-file wm-code-file--idle">globals.css</span>
        </div>
        <div className="wm-code-body">
          {CODE.map((line, i) => (
            <div key={i} className="wm-code-line">
              <span className="wm-ln">{i + 1}</span>
              <span className="wm-code-text" style={{ "--indent": line.indent } as CSSProperties}>
                {line.tokens.map(([tok, text], j) => (
                  <span key={j} className={`wm-tok-${tok}`}>
                    {text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
        <div className="wm-code-status">
          <span>main · Vedvan launch</span>
          <span className="wm-code-state">
            <span className="wm-code-busy">● Compiling…</span>
            <span className="wm-code-done">✓ Compiled</span>
          </span>
        </div>
      </div>

      <div className="wm-prev">
        <span className="wm-prev-label">
          <i className="wm-prev-live" /> Live preview
        </span>
        <div className="wm-vv">
          <div className="wm-vv-hero">
            <span className="wm-vv-sun" />
            <div className="wm-vv-nav">
              <span className="wm-vv-logo">VEDVAN</span>
              <span className="wm-vv-links">
                <i />
                <i />
                <i />
              </span>
              <span className="wm-vv-enquire">Enquire</span>
            </div>
            <div className="wm-vv-copy">
              <p className="wm-vv-h1">Live where the forest begins</p>
              <p className="wm-vv-sub">3 &amp; 4 BHK forest residences</p>
              <span className="wm-vv-btn">Book a Site Visit</span>
            </div>
            <div className="wm-vv-skyline">
              <span className="wm-vv-tower wm-vv-tower--a" />
              <span className="wm-vv-tower wm-vv-tower--b" />
              <span className="wm-vv-tower wm-vv-tower--c" />
              <span className="wm-vv-tree wm-vv-tree--a" />
              <span className="wm-vv-tree wm-vv-tree--b" />
              <span className="wm-vv-tree wm-vv-tree--c" />
              <span className="wm-vv-tree wm-vv-tree--d" />
            </div>
          </div>

          <div className="wm-vv-card">
            <span className="wm-vv-card-title">Get the brochure</span>
            <span className="wm-vv-input">Name</span>
            <span className="wm-vv-input">Phone</span>
            <span className="wm-vv-card-btn">Download</span>
          </div>

          <div className="wm-vv-amen">
            <span className="wm-vv-chip">
              <i /> Clubhouse
            </span>
            <span className="wm-vv-chip">
              <i /> Forest Trail
            </span>
            <span className="wm-vv-chip">
              <i /> Infinity Pool
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- WordPress: block editor with the live page alongside ---------- */

const WP_OLD = "Welcome to our website";
const WP_NEW = "Homes that grow with you";

function WpScene() {
  const ref = useScene(({ tl, q, one }) => {
    const cursor = one(".wm-cursor");
    const red = "#c8102e";

    moveCursor(tl, cursor, 35, 26, 0.4, 0.7);
    clickCursor(tl, cursor);
    tl.fromTo(
      q(".wm-wp-sel, .wm-wp-toolbar"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2 },
      "<",
    );
    typeOff(tl, one(".wm-wp-h .wm-wp-old"), WP_OLD.length, "+=0.2");
    typeOff(tl, one(".wm-wp-live-h .wm-wp-old"), WP_OLD.length, "<");
    typeOn(tl, one(".wm-wp-h .wm-wp-new"), WP_NEW.length, "+=0.1");
    typeOn(tl, one(".wm-wp-live-h .wm-wp-new"), WP_NEW.length, "<0.1");
    tl.fromTo(one(".wm-wp-sync"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, "<")
      .to(one(".wm-wp-sync"), { autoAlpha: 0, duration: 0.2 }, ">0.2")
      .to(q(".wm-wp-sel, .wm-wp-toolbar"), { autoAlpha: 0, duration: 0.2 }, "<");

    moveCursor(tl, cursor, 35, 60, "+=0.2", 0.6);
    clickCursor(tl, cursor);
    tl.fromTo(one(".wm-wp-img-empty"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2 }, "<")
      .fromTo(one(".wm-wp-img-fill"), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.45 }, "<0.1")
      .fromTo(
        one(".wm-wp-live-img"),
        { autoAlpha: 0, height: "0%" },
        { autoAlpha: 1, height: "34%", duration: 0.5, ease: "power2.inOut" },
        "<0.1",
      );

    moveCursor(tl, cursor, 21.5, 80.4, "+=0.2", 0.6);
    clickCursor(tl, cursor);
    tl.fromTo(
      one(".wm-wp-palette"),
      { autoAlpha: 0, y: 6, scale: 0.9 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(2)" },
      "<",
    );
    moveCursor(tl, cursor, 33.7, 69.9, "+=0.15", 0.45);
    clickCursor(tl, cursor);
    tl.to(q(".wm-wp-btn, .wm-wp-live-btn"), { backgroundColor: red, duration: 0.35 }, "<")
      .to(one(".wm-wp-palette"), { autoAlpha: 0, duration: 0.2 }, "+=0.2");

    moveCursor(tl, cursor, 54.1, 5.4, "+=0.1", 0.75);
    clickCursor(tl, cursor);
    tl.fromTo(
      one(".wm-wp-snack"),
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.35, ease: "back.out(2)" },
      "<0.1",
    )
      .fromTo(one(".wm-wp-badge-draft"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, "<")
      .fromTo(one(".wm-wp-badge-live"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, "<")
      .addLabel("hold")
      .to({}, { duration: 2.4 })
      .to(q(".wm-wp-canvas, .wm-wp-live-body, .wm-wp-snack"), { autoAlpha: 0, duration: 0.3 });
  });

  return (
    <div ref={ref} className="wm-scene wm-wp" aria-hidden>
      <div className="wm-wp-side">
        <span className="wm-wp-logo">W</span>
        {["Dashboard", "Posts", "Media", "Pages", "Plugins", "Settings"].map((item) => (
          <span key={item} className={cn("wm-wp-menu", item === "Pages" && "is-active")}>
            <i />
            {item}
          </span>
        ))}
      </div>

      <div className="wm-wp-editor">
        <div className="wm-wp-top">
          <span className="wm-wp-plus">+</span>
          <span className="wm-wp-undo">↶ ↷</span>
          <span className="wm-wp-doc">Home · Page</span>
          <span className="wm-wp-update">Update</span>
        </div>

        <div className="wm-wp-canvas">
          <div className="wm-wp-h">
            <span className="wm-wp-toolbar">
              <i>H2</i>
              <i>B</i>
              <i>I</i>
              <i>⋮</i>
            </span>
            <span className="wm-wp-sel" />
            <span className="wm-type wm-wp-old">{WP_OLD}</span>
            <span className="wm-type wm-wp-new">{WP_NEW}</span>
          </div>
          <p className="wm-wp-p">Thoughtfully planned homes, built around the way you live.</p>
          <div className="wm-wp-img">
            <span className="wm-wp-img-empty">
              <i>▣</i> Image · Upload or drag
            </span>
            <span className="wm-wp-img-fill" />
          </div>
          <span className="wm-wp-btn">Book a visit</span>
          <span className="wm-wp-palette">
            <i style={{ background: "#1b1446" }} />
            <i style={{ background: "#c8102e" }} />
            <i style={{ background: "#1457a8" }} />
            <i style={{ background: "#0d9488" }} />
            <i style={{ background: "#f2a60f" }} />
          </span>
        </div>

        <span className="wm-wp-snack">
          Page updated. <b>View Page</b>
        </span>
      </div>

      <div className="wm-wp-live">
        <div className="wm-wp-live-bar">
          <span>yourbrand.com</span>
          <span className="wm-wp-badge">
            <span className="wm-wp-badge-draft">● Preview</span>
            <span className="wm-wp-badge-live">● Live</span>
          </span>
        </div>
        <div className="wm-wp-live-body">
          <span className="wm-wp-sync">Syncing…</span>
          <div className="wm-wp-live-h">
            <span className="wm-type wm-wp-old">{WP_OLD}</span>
            <span className="wm-type wm-wp-new">{WP_NEW}</span>
          </div>
          <p className="wm-wp-live-p">Thoughtfully planned homes, built around the way you live.</p>
          <span className="wm-wp-live-img" />
          <span className="wm-wp-live-btn">Book a visit</span>
        </div>
      </div>

      <Cursor style={{ left: "40%", top: "62%" }} />
    </div>
  );
}
