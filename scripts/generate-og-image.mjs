// Génère l'image de partage (Open Graph / WhatsApp / réseaux sociaux),
// public/og-image.png, au format standard 1200x630.
//
// Pour régénérer : node scripts/generate-og-image.mjs
// Si vous changez SHOP_NAME / SHOP_TAGLINE dans lib/config.ts, mettez aussi à
// jour les textes ci-dessous (ce script ne dépend pas du code de l'app).

import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const W = 1200;
const H = 630;
const BAND_W = 480;

const GARNET_900 = "#2c0a10";
const CREAM_50 = "#fffdf8";
const CREAM_200 = "#fbf3e3";
const GOLD_400 = "#d4af37";
const GOLD_200 = "#e9d28c";

// Étoile de David (même tracé que components/Icons.tsx).
function starOfDavid(cx, cy, r) {
  const pt = (a) => {
    const rad = (a * Math.PI) / 180;
    return `${cx + r * Math.sin(rad)},${cy - r * Math.cos(rad)}`;
  };
  const up = [0, 120, 240].map(pt).join(" ");
  const down = [180, 300, 60].map(pt).join(" ");
  return `<polygon points="${up}" fill="none" stroke="${GOLD_400}" stroke-width="2"/>
  <polygon points="${down}" fill="none" stroke="${GOLD_400}" stroke-width="2"/>`;
}

const PHOTO_X = BAND_W + 70;
const PHOTO_Y = 95;
const PHOTO_W = 520;
const PHOTO_H = 440;
const RADIUS = 20;

const baseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="ivory" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${CREAM_50}"/>
      <stop offset="100%" stop-color="${CREAM_200}"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.30  0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 0.04 0"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#ivory)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
  <rect x="18" y="18" width="${W - 36}" height="${H - 36}" fill="none" stroke="${GOLD_400}" stroke-width="1.5" opacity="0.5"/>

  <rect width="${BAND_W}" height="${H}" fill="${GARNET_900}"/>
  <circle cx="${BAND_W - 40}" cy="80" r="120" fill="${GOLD_400}" opacity="0.05"/>
  <circle cx="40" cy="${H - 60}" r="140" fill="${GOLD_400}" opacity="0.05"/>

  ${starOfDavid(90, 130, 34)}

  <text x="80" y="230" font-family="Georgia,'Times New Roman',serif" font-size="41" font-weight="700" fill="${CREAM_50}">Les Douceurs</text>
  <text x="80" y="280" font-family="Georgia,'Times New Roman',serif" font-size="41" font-weight="700" fill="${CREAM_50}">de Roch Hachana</text>

  <rect x="80" y="322" width="70" height="2" fill="${GOLD_400}"/>

  <text x="80" y="368" font-family="Arial,Helvetica,sans-serif" font-size="19" letter-spacing="0.5" fill="${GOLD_200}">Corbeilles cadeaux casher</text>
  <text x="80" y="396" font-family="Arial,Helvetica,sans-serif" font-size="19" letter-spacing="0.5" fill="${GOLD_200}">pour Roch Hachana à Paris</text>

  <text x="80" y="${H - 56}" font-family="Arial,Helvetica,sans-serif" font-size="15" letter-spacing="1.5" fill="${CREAM_50}" opacity="0.55">RETRAIT 16E · LIVRAISON À PARIS</text>

  <!-- cadre de la photo (dessiné avant compositing, légèrement plus grand pour créer un liseré crème) -->
  <rect x="${PHOTO_X - 10}" y="${PHOTO_Y - 10}" width="${PHOTO_W + 20}" height="${PHOTO_H + 20}" rx="${RADIUS + 8}" fill="${CREAM_50}"/>
</svg>`;

// Masque à coins arrondis pour la photo.
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO_W}" height="${PHOTO_H}">
  <rect width="${PHOTO_W}" height="${PHOTO_H}" rx="${RADIUS}" fill="#fff"/>
</svg>`;

// Liseré doré fin autour de la photo, dessiné par-dessus.
const photoBorderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO_W}" height="${PHOTO_H}">
  <rect x="1" y="1" width="${PHOTO_W - 2}" height="${PHOTO_H - 2}" rx="${RADIUS}" fill="none" stroke="${GOLD_400}" stroke-width="2" opacity="0.7"/>
</svg>`;

const base = await sharp(Buffer.from(baseSvg)).png().toBuffer();

const photoRaw = await sharp(path.join(publicDir, "images", "signature-calligraphie.png"))
  .resize(PHOTO_W, PHOTO_H, { fit: "cover" })
  .toBuffer();

const photoRounded = await sharp(photoRaw)
  .composite([{ input: Buffer.from(maskSvg), blend: "dest-in" }])
  .png()
  .toBuffer();

await sharp(base)
  .composite([
    { input: photoRounded, left: PHOTO_X, top: PHOTO_Y },
    { input: Buffer.from(photoBorderSvg), left: PHOTO_X, top: PHOTO_Y },
  ])
  .flatten({ background: CREAM_50 })
  .jpeg({ quality: 88 })
  .toFile(path.join(publicDir, "og-image.jpg"));

console.log("✓ og-image.jpg");
