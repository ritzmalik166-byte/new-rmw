/* Dark mode only: the Diwali roadside the hero truck drives past.
   Repeating inline SVG tiles (cracker stalls, children with sparklers, an anar and a
   chakri), slid by the stage's --road-x so it streams by with the verge.
   SMIL animates the sparks inside the tile. Styles: src/styles/festive/diwali-dark.css */

/* Sparks streaming up out of a ground fountain (anar). */
function spray(x: number, y: number, n: number, spread: number, len: number, dur: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (-90 + (i / (n - 1) - 0.5) * spread) * (Math.PI / 180);
    const x2 = (x + Math.cos(a) * len).toFixed(1);
    const y2 = (y + Math.sin(a) * len).toFixed(1);
    const begin = (i * 0.07).toFixed(2);
    return `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke-dasharray="2 5"><animate attributeName="stroke-dashoffset" from="0" to="-14" dur="${dur}s" begin="-${begin}s" repeatCount="indefinite"/></line>`;
  }).join("");
}

/* A spinning star of sparks: sparkler tips and the chakri. */
function burst(x: number, y: number, r: number, dur: number) {
  const rays = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return `<line x1="0" y1="0" x2="${(Math.cos(a) * r).toFixed(1)}" y2="${(Math.sin(a) * r).toFixed(1)}"/>`;
  }).join("");
  return `<g transform="translate(${x} ${y})"><g>${rays}<animateTransform attributeName="transform" type="rotate" from="0" to="36" dur="${dur}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.5;1" dur="${dur / 2}s" repeatCount="indefinite"/></g></g>`;
}

const AWNING = ["#d9381e", "#f6c23e"];
/* A small flame with a halo, for the diyas on the sale counter. */
const flame = (x: number, y: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="4.2" fill="#ffb347" opacity=".45" filter="url(#soft)"/>` +
  `<path d="M${x} ${y - 4}q2 2.8 0 4.8q-2 -2 0 -4.8z" fill="#ffe27a"><animate attributeName="opacity" values="1;.7;1" dur=".6s" repeatCount="indefinite"/></path>`;

/* Patakhe stall: rockets in a tin, anar cones, chakri, a hanging ladi, sparkler packs and bombs. */
function crackerGoods() {
  const tin = `<rect x="13" y="60" width="28" height="16" rx="2" fill="#8d8f96"/><rect x="13" y="63" width="28" height="3" fill="#d9381e"/>`;
  const rockets = [16, 22, 28, 34]
    .map((x, i) => {
      const c = ["#d9381e", "#2f7de1", "#2fa35a", "#f6c23e"][i];
      const top = 40 + (i % 2) * 4;
      return `<line x1="${x + 2}" y1="${top + 10}" x2="${x + 2}" y2="62" stroke="#c9a46a" stroke-width="1"/><rect x="${x}" y="${top + 3}" width="4" height="10" fill="${c}"/><path d="M${x} ${top + 3}l2 -4 2 4z" fill="#eee"/>`;
    })
    .join("");
  const anars = [50, 62, 74]
    .map((x) => `<path d="M${x - 6} 76l6 -16 6 16z" fill="#d9381e"/><path d="M${x - 4} 71h8M${x - 2.5} 66h5" stroke="#f6c23e" stroke-width="1.4"/><circle cx="${x}" cy="59" r="1.2" fill="#ccc"/>`)
    .join("");
  const chakriBox = `<rect x="83" y="44" width="28" height="14" rx="1.5" fill="#f6c23e"/><circle cx="91" cy="51" r="4" fill="none" stroke="#d9381e" stroke-width="1.3"/><circle cx="103" cy="51" r="4" fill="none" stroke="#2fa35a" stroke-width="1.3"/>`;
  const chakri = [90, 104]
    .map((x) => `<circle cx="${x}" cy="69" r="7" fill="#2fa35a"/><circle cx="${x}" cy="69" r="4.5" fill="none" stroke="#f6c23e" stroke-width="1.2"/><circle cx="${x}" cy="69" r="1.6" fill="#7a3a14"/>`)
    .join("");
  const ladi =
    `<line x1="124" y1="36" x2="124" y2="74" stroke="#c9a46a" stroke-width="1"/>` +
    Array.from({ length: 9 }, (_, i) => `<rect x="${i % 2 ? 124 : 119}" y="${38 + i * 4}" width="5" height="2.6" rx="1" fill="#d9381e"/>`).join("");
  const sparklers = [136, 152]
    .map((x, i) => {
      const sticks = [2, 5, 8, 11].map((d) => `<line x1="${x + d}" y1="58" x2="${x + d}" y2="44" stroke="#9a8a7a" stroke-width="1"/>`).join("");
      return `${sticks}<rect x="${x}" y="56" width="14" height="20" rx="1.5" fill="${i ? "#8b4fd6" : "#2f7de1"}"/><path d="M${x + 3} 62l4 6 4 -6" stroke="#ffd36b" stroke-width="1.2" fill="none"/>`;
    })
    .join("");
  const bombs = [
    [170, 68],
    [178, 68],
    [174, 60],
  ]
    .map(([x, y]) => `<rect x="${x - 3.5}" y="${y}" width="7" height="8" fill="#d9381e"/><rect x="${x - 3.5}" y="${y}" width="7" height="2" fill="#2fa35a"/><line x1="${x}" y1="${y}" x2="${x + 1.5}" y2="${y - 3}" stroke="#ccc" stroke-width=".8"/>`)
    .join("");
  return tin + rockets + anars + chakriBox + chakri + ladi + sparklers + bombs;
}

/* Deepawali sale stall: hanging kandils, a swinging sale tag, diyas, sweets, laddoos, gift hampers, torans. */
function saleGoods() {
  const kandils = [26, 112]
    .map((x, i) => {
      const c = i ? "#c9356e" : "#f08a0c";
      const fringe = [-3, -1, 1, 3].map((d) => `<line x1="${x + d}" y1="53" x2="${x + d}" y2="60" stroke="${c}" stroke-width=".8"/>`).join("");
      const body = `M${x - 6} 44l6 -4 6 4v6l-6 4 -6 -4z`;
      return `<line x1="${x}" y1="34" x2="${x}" y2="40" stroke="#c9a46a" stroke-width=".8"/><path d="${body}" fill="${c}"/><path d="${body}" fill="#ffe7a3" opacity=".35" filter="url(#soft)"/>${fringe}`;
    })
    .join("");
  const tag = `<g><animateTransform attributeName="transform" type="rotate" values="-6 160 36;6 160 36;-6 160 36" dur="2.4s" repeatCount="indefinite"/><line x1="160" y1="34" x2="160" y2="40" stroke="#c9a46a" stroke-width=".8"/><rect x="146" y="40" width="28" height="13" rx="2" fill="#d9381e"/><text x="160" y="49.5" font-size="7" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">50% OFF</text></g>`;
  const diyas = [14, 26, 38, 50, 62].map((x) => `<path d="M${x - 5} 72h10q-1 4 -5 4t-5 -4z" fill="#c4622a"/>${flame(x, 69)}`).join("");
  const sweets = `<rect x="44" y="50" width="30" height="14" rx="1.5" fill="#f2a1c0"/><rect x="57" y="50" width="4" height="14" fill="#f6c23e"/><rect x="44" y="55" width="30" height="3" fill="#f6c23e"/><text x="59" y="48" font-size="5.5" font-weight="700" text-anchor="middle" fill="#ffe08a" font-family="Arial">SWEETS</text>`;
  const laddoos =
    `<ellipse cx="90" cy="76" rx="15" ry="2.4" fill="#d9d2c0"/>` +
    [
      [82, 72],
      [90, 72],
      [98, 72],
      [86, 65],
      [94, 65],
      [90, 58],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#f59e0b"/><circle cx="${x - 1}" cy="${y - 1.4}" r="1.2" fill="#ffd27a"/>`)
      .join("");
  const hampers = [120, 146]
    .map((x, i) => `<rect x="${x + 4}" y="58" width="8" height="8" fill="${i ? "#2f7de1" : "#8b4fd6"}"/><rect x="${x + 12}" y="55" width="8" height="11" fill="#2fa35a"/><path d="M${x} 64h24l-3 12h-18z" fill="#b8742a"/><path d="M${x + 2} 68h20M${x + 3} 72h18" stroke="#8a5218" stroke-width="1"/><path d="M${x + 8} 55q4 -4 4 0q0 -4 4 0" stroke="#d9381e" stroke-width="1.4" fill="none"/>`)
    .join("");
  const torans = [176, 186]
    .map((x, i) => `<line x1="${x}" y1="36" x2="${x}" y2="66" stroke="${i ? "#f6c23e" : "#f08a0c"}" stroke-width="3" stroke-dasharray="3 1.5"/>`)
    .join("");
  return kandils + tag + diyas + sweets + laddoos + hampers + torans;
}

/* A festive stall: striped awning with bulbs, its goods on display, a shopkeeper and a sign. */
function stall(x: number, label: string, goods: string) {
  const stripes = Array.from({ length: 10 }, (_, i) =>
    `<rect x="${i * 22}" y="0" width="22" height="18" fill="${AWNING[i % 2]}"/><circle cx="${i * 22 + 11}" cy="18" r="11" fill="${AWNING[i % 2]}"/>`,
  ).join("");
  const bulbs = Array.from({ length: 11 }, (_, i) => {
    const begin = (i * 0.29).toFixed(2);
    return `<circle cx="${i * 22}" cy="36" r="2.4" fill="#ffe7a3"><animate attributeName="opacity" values="1;.35;1" dur="1.6s" begin="-${begin}s" repeatCount="indefinite"/></circle>`;
  }).join("");
  return `<g transform="translate(${x} 4)">
    <rect x="-30" y="-4" width="280" height="104" fill="url(#glow)"/>
    <rect x="4" y="28" width="212" height="70" fill="#2a140a"/>
    <rect x="4" y="28" width="212" height="70" fill="url(#lamp)"/>
    ${goods}
    <circle cx="202" cy="62" r="5.5" fill="#1a0d06"/><rect x="195" y="67" width="14" height="10" rx="4" fill="#1a0d06"/>
    <rect x="0" y="76" width="220" height="22" fill="#7a3a14"/>
    <rect x="0" y="76" width="220" height="3" fill="#f2a64c"/>
    <text x="110" y="93" font-size="13" font-weight="700" text-anchor="middle" fill="#ffe08a" font-family="Nirmala UI,Mangal,sans-serif">${label}</text>
    <rect x="2" y="10" width="4" height="88" fill="#4a2410"/><rect x="214" y="10" width="4" height="88" fill="#4a2410"/>
    <g transform="translate(0 6)">${stripes}</g>
    <g filter="url(#soft)">${bulbs}</g>${bulbs}
  </g>`;
}

/* A child hopping on the spot, sparkler held up or out. */
function child(x: number, shirt: string, hop: number, arm: "up" | "out", flip = false) {
  const [hx, hy] = arm === "up" ? [7, 58] : [14, 68];
  const [tx, ty] = arm === "up" ? [12, 44] : [27, 60];
  const dur = (0.7 + hop * 0.05).toFixed(2);
  return `<g transform="translate(${x} 0)${flip ? " scale(-1 1)" : ""}"><g>
    <animateTransform attributeName="transform" type="translate" values="0 0;0 -${hop};0 0" dur="${dur}s" repeatCount="indefinite"/>
    <circle cx="0" cy="56" r="5.5" fill="#3a2216"/>
    <path d="M-5 62h10l2 18h-14z" fill="${shirt}"/>
    <path d="M-4 80l-2 14M4 80l2 14" stroke="#2a1a12" stroke-width="3" stroke-linecap="round"/>
    <path d="M-5 65l-7 10" stroke="#3a2216" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M5 65L${hx} ${hy + 6}" stroke="#3a2216" stroke-width="2.6" stroke-linecap="round"/>
    <line x1="${hx}" y1="${hy + 6}" x2="${tx}" y2="${ty}" stroke="#9a8a7a" stroke-width="1.2"/>
    <g stroke="#ffd36b" stroke-width="1.4" filter="url(#soft)">${burst(tx, ty, 10, 0.5)}</g>
    <g stroke="#fffbe8" stroke-width=".8">${burst(tx, ty, 7, 0.4)}</g>
  </g></g>`;
}

function anar(x: number) {
  return `<g transform="translate(${x} 0)">
    <ellipse cx="0" cy="98" rx="42" ry="8" fill="url(#pool)"/>
    <path d="M-7 98l7-14 7 14z" fill="#d9381e" stroke="#f6c23e" stroke-width="1"/>
    <g stroke="#ffd36b" stroke-width="1.8" stroke-linecap="round" filter="url(#soft)">${spray(0, 84, 9, 70, 46, 0.6)}</g>
    <g stroke="#fff6d6" stroke-width="1" stroke-linecap="round">${spray(0, 84, 9, 70, 46, 0.6)}</g>
  </g>`;
}

function chakri(x: number) {
  return `<g transform="translate(${x} 94)">
    <ellipse cx="0" cy="4" rx="34" ry="6" fill="url(#pool)"/>
    <g stroke="#ffb347" stroke-width="1.6" filter="url(#soft)">${burst(0, 0, 13, 0.3)}</g>
    <g stroke="#fff3c4" stroke-width=".9">${burst(0, 0, 10, 0.25)}</g>
  </g>`;
}

const W = 1500;
const H = 104;
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffb24a" stop-opacity=".32"/><stop offset="1" stop-color="#ffb24a" stop-opacity="0"/></radialGradient>
  <linearGradient id="lamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></linearGradient>
  <radialGradient id="pool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd27a" stop-opacity=".5"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
</defs>
${stall(60, "पटाखे", crackerGoods())}
${child(380, "#e8541e", 5, "up")}
${child(430, "#2f7de1", 3, "out", true)}
${anar(515)}
${child(590, "#2fa35a", 6, "up", true)}
${stall(760, "दीपावली सेल", saleGoods())}
${child(1040, "#c9356e", 4, "out")}
${chakri(1090)}
${child(1150, "#f6c23e", 7, "up", true)}
${child(1220, "#8b4fd6", 3, "up")}
${anar(1320)}
</svg>`;

/* Three tiles, so the track still covers wide screens while it slides one tile over. */
const TRACK = { __html: SVG.repeat(3) };

export function DiwaliStreet() {
  return (
    <span className="dw-street theme-keep" aria-hidden>
      <span className="dw-street-track" dangerouslySetInnerHTML={TRACK} />
    </span>
  );
}
