// Builds display-sized WebP copies of oversized public images (PageSpeed "Improve image delivery").
// Run with: node scripts/optimize-images.mjs
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const pub = (p) => path.join(PUBLIC, p);

async function webp(src, out, { width, height, fit = "inside", quality = 80 } = {}) {
  await mkdir(path.dirname(pub(out)), { recursive: true });
  let img = sharp(pub(src));
  if (width || height) img = img.resize({ width, height, fit, withoutEnlargement: true });
  await img.webp({ quality, effort: 6, alphaQuality: 90 }).toFile(pub(out));
  const [a, b] = await Promise.all([stat(pub(src)), stat(pub(out))]);
  console.log(`${src} ${(a.size / 1024).toFixed(1)}K -> ${out} ${(b.size / 1024).toFixed(1)}K`);
}

async function walk(dir) {
  const entries = await readdir(pub(dir), { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const rel = path.posix.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "sm") files.push(...(await walk(rel)));
    } else files.push(rel);
  }
  return files;
}

// Service icons render at 32-40px; 80px covers 2x screens.
for (const file of await walk("services/icons")) {
  if (!file.endsWith(".png")) continue;
  const out = file.replace("services/icons/", "services/icons/sm/").replace(/\.png$/, ".webp");
  await webp(file, out, { width: 80, height: 80 });
}

// Client logos render inside at most 138x64.
for (const file of await walk("s2/clients")) {
  if (!/\.(webp|avif|png|jpe?g)$/i.test(file)) continue;
  const out = file.replace("s2/clients/", "s2/clients/sm/").replace(/\.\w+$/, ".webp");
  await webp(file, out, { width: 276, height: 128, quality: 78 });
}

// Truck body variants for the hero srcset and the small truck.
await webp("trucks/rmw-truck.webp", "trucks/rmw-truck-720.webp", { width: 720, quality: 72 });
await webp("trucks/rmw-truck.webp", "trucks/rmw-truck-600.webp", { width: 600, quality: 72 });
await webp("trucks/rmw-truck.webp", "trucks/rmw-truck-sm.webp", { width: 480, quality: 72 });
await webp("trucks/rmw-truck.webp", "trucks/rmw-truck-xs.webp", { width: 420, quality: 72 });
await webp("trucks/rmw-truck-top.webp", "trucks/rmw-truck-top-sm.webp", { width: 56, quality: 78 });

// Driver poses render at ~58-72px wide.
for (const pose of ["idle", "blink", "look", "laugh"]) {
  await webp(`trucks/driver/${pose}.webp`, `trucks/driver/sm/${pose}.webp`, { width: 168, quality: 80 });
}
