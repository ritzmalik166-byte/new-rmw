import type { Theme } from "@/lib/theme";

/* One-shot celebration painted over the theme change: going dark, stars rain
   over the page; going light, the sun flares. Particles are drawn on one canvas
   (a single layer, no DOM churn) so the switch stays at frame rate. The layer
   has its own view-transition name, so it sits above the spill and paints in
   real colours rather than through the night filter. */
export const THEME_FX_MS = 1600;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeOut = (p: number) => 1 - (1 - p) ** 3;
const easeIn = (p: number) => p * p;
/* Piecewise-linear curve through [progress, value] stops. */
const curve = (p: number, stops: [number, number][]) => {
  for (let i = 1; i < stops.length; i++) {
    const [p1, v1] = stops[i];
    const [p0, v0] = stops[i - 1];
    if (p <= p1) return v0 + ((v1 - v0) * (p - p0)) / (p1 - p0 || 1);
  }
  return stops[stops.length - 1][1];
};

/* ---------- Sprites, drawn once and stamped every frame ---------- */
const sprites = new Map<string, HTMLCanvasElement>();

function sprite(key: string, size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  let canvas = sprites.get(key);
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) draw(ctx, size);
    sprites.set(key, canvas);
  }
  return canvas;
}

const glow = (color: string) =>
  sprite(`glow-${color}`, 64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "#fff");
    g.addColorStop(0.18, color);
    g.addColorStop(0.45, `${color}55`);
    g.addColorStop(1, `${color}00`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });

const spark = (color: string) =>
  sprite(`spark-${color}`, 64, (ctx, s) => {
    const c = s / 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = s * 0.18;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? s * 0.4 : s * 0.09;
      const a = (i * Math.PI) / 4 - Math.PI / 2;
      ctx.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(c, c, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
  });

const sunSprite = () =>
  sprite("sun", 256, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "#fff8d6");
    g.addColorStop(0.16, "#fff0b0");
    g.addColorStop(0.3, "#ffc531");
    g.addColorStop(0.45, "rgba(255,159,28,0.75)");
    g.addColorStop(0.7, "rgba(255,170,50,0.22)");
    g.addColorStop(1, "rgba(255,170,50,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });

const raysSprite = () =>
  sprite("rays", 512, (ctx, s) => {
    const c = s / 2;
    ctx.fillStyle = "rgba(255,214,120,0.5)";
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.arc(c, c, c, a, a + 0.07);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalCompositeOperation = "destination-in";
    const fade = ctx.createRadialGradient(c, c, 0, c, c, c);
    fade.addColorStop(0, "#000");
    fade.addColorStop(0.25, "#000");
    fade.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, s, s);
  });

/* ---------- Particles ---------- */
type Burst = { delay: number; dur: number; dx: number; dy: number; size: number; spin: number };
type Twinkle = { x: number; y: number; delay: number; dur: number; size: number; star: boolean };
type Shooter = { x: number; y: number; delay: number };

function bursts(count: number, vw: number): Burst[] {
  return Array.from({ length: count }, () => {
    const angle = rand(0, Math.PI * 2);
    const dist = rand(90, Math.min(560, vw * 0.5));
    return {
      delay: rand(0, 160),
      dur: rand(800, 1300),
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist + rand(0, 80),
      size: rand(10, 24),
      spin: rand(2, 4),
    };
  });
}

type Draw = (ctx: CanvasRenderingContext2D, t: number) => void;

function drawBursts(ctx: CanvasRenderingContext2D, t: number, x: number, y: number, list: Burst[], img: HTMLCanvasElement) {
  for (const b of list) {
    const p = clamp01((t - b.delay) / b.dur);
    if (p <= 0 || p >= 1) continue;
    const e = easeOut(p);
    const scale = curve(p, [[0, 0], [0.55, 1.2], [1, 0]]);
    const size = b.size * scale;
    ctx.save();
    ctx.translate(x + b.dx * e, y + b.dy * e);
    ctx.rotate(p * b.spin);
    ctx.globalAlpha = curve(p, [[0, 1], [0.55, 1], [1, 0]]);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }
}

function drawRing(ctx: CanvasRenderingContext2D, t: number, x: number, y: number, reach: number, color: string) {
  const p = clamp01(t / 1100);
  if (p >= 1) return;
  ctx.globalAlpha = 0.9 * (1 - p);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, reach * easeOut(p), 0, Math.PI * 2);
  ctx.stroke();
}

function nightScene(x: number, y: number, vw: number, vh: number): Draw {
  const reach = Math.hypot(vw, vh) * 1.1;
  const burstList = bursts(26, vw);
  const twinkles: Twinkle[] = Array.from({ length: 80 }, (_, i) => ({
    x: rand(0, vw),
    y: rand(0, vh),
    delay: rand(120, 520),
    dur: rand(700, 1100),
    size: i % 6 === 0 ? rand(12, 22) : rand(6, 14),
    star: i % 6 === 0,
  }));
  const shooters: Shooter[] = [0, 1].map((i) => ({
    x: rand(vw * 0.45, vw * 0.95),
    y: rand(vh * 0.05, vh * 0.35),
    delay: 250 + i * 380,
  }));
  const dir = { x: -Math.cos((28 * Math.PI) / 180), y: Math.sin((28 * Math.PI) / 180) };
  const white = spark("#fff6d8");
  const dot = glow("#ffffff");
  const star = spark("#ffffff");

  return (ctx, t) => {
    drawRing(ctx, t, x, y, reach, "rgb(170,196,255)");
    for (const s of twinkles) {
      const p = clamp01((t - s.delay) / s.dur);
      if (p <= 0 || p >= 1) continue;
      const size = s.size * curve(p, [[0, 0], [0.3, 1.4], [0.6, 0.8], [1, 0]]);
      ctx.globalAlpha = curve(p, [[0, 0], [0.3, 1], [0.6, 0.9], [1, 0]]);
      ctx.drawImage(s.star ? star : dot, s.x - size / 2, s.y - size / 2, size, size);
    }
    for (const s of shooters) {
      const p = clamp01((t - s.delay) / 900);
      if (p <= 0 || p >= 1) continue;
      const travel = vw * 0.55 * easeIn(p);
      const hx = s.x + dir.x * travel;
      const hy = s.y + dir.y * travel;
      const tx = hx - dir.x * 220;
      const ty = hy - dir.y * 220;
      const g = ctx.createLinearGradient(hx, hy, tx, ty);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = p < 0.15 ? p / 0.15 : 1 - p;
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    }
    drawBursts(ctx, t, x, y, burstList, white);
  };
}

function dayScene(x: number, y: number, vw: number, vh: number): Draw {
  const diag = Math.hypot(vw, vh);
  const burstList = bursts(30, vw);
  const gold = spark("#ffc93c");
  const sun = sunSprite();
  const rays = raysSprite();

  return (ctx, t) => {
    const fp = clamp01(t / 1300);
    if (fp < 1) {
      const radius = Math.max(1, diag * 1.2 * easeOut(fp));
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, "rgba(255,248,220,0.95)");
      g.addColorStop(0.18, "rgba(255,214,120,0.55)");
      g.addColorStop(0.45, "rgba(255,180,80,0.18)");
      g.addColorStop(0.7, "rgba(255,180,80,0)");
      ctx.globalAlpha = curve(fp, [[0, 1], [0.35, 0.9], [1, 0]]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, vw, vh);
    }

    const rp = clamp01(t / (THEME_FX_MS - 100));
    if (rp < 1) {
      const size = diag * 1.3 * curve(rp, [[0, 0.1], [0.3, 0.7], [1, 1]]);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(((110 * Math.PI) / 180) * easeOut(rp));
      ctx.globalAlpha = curve(rp, [[0, 0], [0.3, 0.8], [1, 0]]);
      ctx.drawImage(rays, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    const sp = clamp01(t / 1200);
    if (sp < 1) {
      const size = 240 * curve(sp, [[0, 0.2], [0.25, 1.5], [0.6, 1.1], [1, 2.4]]);
      ctx.globalAlpha = curve(sp, [[0, 0], [0.25, 1], [0.6, 0.9], [1, 0]]);
      ctx.drawImage(sun, x - size / 2, y - size / 2, size, size);
    }

    drawRing(ctx, t, x, y, diag * 1.1, "rgb(255,200,90)");
    drawBursts(ctx, t, x, y, burstList, gold);
  };
}

/** Warm the sprite cache so the first toggle doesn't pay for it mid-transition. */
export function prepareThemeFx() {
  glow("#ffffff");
  spark("#ffffff");
  spark("#fff6d8");
  spark("#ffc93c");
  sunSprite();
  raysSprite();
}

/** Plays the effect from (x, y); returns a cleanup that removes the layer.
    Pass `inPage` when there is no view transition, so the layer undoes the night filter itself. */
export function playThemeFx(theme: Theme, x: number, y: number, inPage = false) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  const layer = document.createElement("div");
  layer.className = inPage ? "theme-fx theme-keep" : "theme-fx";
  layer.setAttribute("aria-hidden", "true");
  layer.dataset.themeIgnore = "";

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(vw * dpr);
  canvas.height = Math.round(vh * dpr);
  layer.appendChild(canvas);
  document.body.appendChild(layer);

  const ctx = canvas.getContext("2d");
  const draw = theme === "dark" ? nightScene(x, y, vw, vh) : dayScene(x, y, vw, vh);
  let frame = 0;
  const start = performance.now();
  const tick = (now: number) => {
    const t = now - start;
    if (!ctx || t > THEME_FX_MS) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    draw(ctx, t);
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    layer.remove();
  };
}
