// Génère des visuels de remplacement (SVG) pour chaque corbeille, en attendant les vraies photos.
// Pour régénérer : node scripts/generate-placeholder-images.mjs
// Pour utiliser de vraies photos : remplacez simplement les fichiers dans /public/images
// (gardez le même nom de fichier, ou mettez à jour le champ "image" dans data/products.json).

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");
mkdirSync(outDir, { recursive: true });

const GOLD = "#d4af37";
const GOLD_LIGHT = "#f3e6bd";

const products = [
  { file: "panier-classique", name: "La Classique", from: "#2c0a10", to: "#1c0509" },
  { file: "panier-premium", name: "La Premium", from: "#48121c", to: "#1c0509" },
];

// Étoile de David (deux triangles), même tracé que components/Icons.tsx.
function starOfDavid(cx, cy, r, opacity) {
  const up = [0, 120, 240]
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      return `${cx + r * Math.sin(rad)},${cy - r * Math.cos(rad)}`;
    })
    .join(" ");
  const down = [180, 300, 60]
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      return `${cx + r * Math.sin(rad)},${cy - r * Math.cos(rad)}`;
    })
    .join(" ");
  return `<polygon points="${up}" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="${opacity}"/>
  <polygon points="${down}" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="${opacity}"/>`;
}

function svgFor({ name, from, to }) {
  const gradId = "g" + Math.random().toString(36).slice(2, 8);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#${gradId})"/>
  <circle cx="120" cy="480" r="180" fill="${GOLD}" opacity="0.05"/>
  <circle cx="700" cy="80" r="150" fill="${GOLD}" opacity="0.05"/>
  <rect x="28" y="28" width="744" height="544" fill="none" stroke="${GOLD}" stroke-width="1" opacity="0.35"/>
  ${starOfDavid(400, 300, 70, 0.55)}
  <text x="400" y="440" font-size="30" letter-spacing="3" font-family="Georgia,'Times New Roman',serif" fill="${GOLD_LIGHT}" text-anchor="middle" font-weight="600">${name.toUpperCase()}</text>
</svg>`;
}

for (const p of products) {
  const svg = svgFor(p);
  writeFileSync(path.join(outDir, `${p.file}.svg`), svg, "utf8");
  console.log("✓", p.file + ".svg");
}

// Bannière large pour la page d'accueil : dégradé sombre + halo doré, sans motif figuratif.
const GARNET_DARK = "#1c0509";
const hero = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <radialGradient id="glow" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#48121c"/>
      <stop offset="55%" stop-color="#2c0a10"/>
      <stop offset="100%" stop-color="${GARNET_DARK}"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#glow)"/>
  <circle cx="1250" cy="200" r="260" fill="${GOLD}" opacity="0.06"/>
  <circle cx="260" cy="820" r="220" fill="${GOLD}" opacity="0.05"/>
  ${starOfDavid(800, 500, 130, 0.16)}
</svg>`;
writeFileSync(path.join(outDir, "hero.svg"), hero, "utf8");
console.log("✓ hero.svg");
