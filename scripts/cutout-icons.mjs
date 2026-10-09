// Removes the flat white background from illustrated icons and exports
// trimmed, transparent PNGs.
//
// Usage: node scripts/cutout-icons.mjs <input>=<output> [<input>=<output> ...]
//
// The background is found by flood-filling near-white pixels from the image
// border, so white areas enclosed by outlines (paper, screens) are kept.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SIZE = 320;
const SEED_MIN = 228;
const SEED_SPREAD = 26;
const FRINGE_MIN = 150;

const pairs = process.argv.slice(2).map((arg) => {
  const [input, output] = arg.split("=");
  if (!input || !output) throw new Error(`Expected <input>=<output>, got "${arg}"`);
  return { input: path.resolve(input), output: path.resolve(output) };
});

if (pairs.length === 0) {
  console.error("Usage: node scripts/cutout-icons.mjs <input>=<output> ...");
  process.exit(1);
}

const isNearWhite = (data, i) => {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const min = Math.min(r, g, b);
  return min >= SEED_MIN && Math.max(r, g, b) - min <= SEED_SPREAD;
};

async function cutout({ input, output }) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const total = width * height;
  const background = new Uint8Array(total);
  const stack = [];

  const seed = (x, y) => {
    const p = y * width + x;
    if (!background[p] && isNearWhite(data, p * 4)) {
      background[p] = 1;
      stack.push(p);
    }
  };

  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }

  while (stack.length) {
    const p = stack.pop();
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) seed(x - 1, y);
    if (x < width - 1) seed(x + 1, y);
    if (y > 0) seed(x, y - 1);
    if (y < height - 1) seed(x, y + 1);
  }

  for (let p = 0; p < total; p++) {
    const i = p * 4;
    if (background[p]) {
      data[i + 3] = 0;
      continue;
    }

    const x = p % width;
    const y = (p - x) / width;
    const touchesBackground =
      (x > 0 && background[p - 1]) ||
      (x < width - 1 && background[p + 1]) ||
      (y > 0 && background[p - width]) ||
      (y < height - 1 && background[p + width]);
    if (!touchesBackground) continue;

    // Anti-aliased edge pixel: treat it as colour blended over white and
    // recover the alpha + un-blended colour.
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (min < FRINGE_MIN) continue;
    const alpha = Math.max(0, Math.min(1, (255 - min) / (255 - FRINGE_MIN)));
    if (alpha === 0) {
      data[i + 3] = 0;
      continue;
    }
    for (let c = 0; c < 3; c++) {
      const v = (data[i + c] - 255 * (1 - alpha)) / alpha;
      data[i + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
    data[i + 3] = Math.round(alpha * 255);
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  await sharp(data, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 1 })
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true, quality: 92 })
    .toFile(output);

  console.log(`✓ ${path.basename(input)} → ${path.relative(process.cwd(), output)}`);
}

for (const pair of pairs) {
  await cutout(pair);
}
