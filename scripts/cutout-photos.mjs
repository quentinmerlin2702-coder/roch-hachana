import sharp from "sharp";

// Découpe (silhouette dessinée à la main) de chaque corbeille, posée sur
// fond blanc pur — style catalogue e-commerce. `src` est toujours une photo
// "source" à part (jamais le fichier déjà détouré publié sur le site), pour
// pouvoir relancer ce script sans jamais redécouper un fond déjà blanc.
const PRODUCTS = {
  classique: {
    src: "C:/Users/josep/paniers-rosh/public/images/panier-classique-source.jpg",
    outFile: "C:/Users/josep/paniers-rosh/public/images/panier-classique.jpg",
    // Points en fractions (0-1), sens horaire depuis le sommet du nœud.
    // Exclut volontairement les accessoires de mise en scène (branche
    // d'olivier à gauche, grenade et bol de miel à droite).
    points: [
      [0.50, 0.10], [0.60, 0.13], [0.66, 0.19], [0.68, 0.24],
      [0.64, 0.30], [0.68, 0.38], [0.75, 0.46], [0.80, 0.55],
      [0.83, 0.70], [0.85, 0.89],
      [0.16, 0.89], [0.15, 0.70],
      [0.18, 0.55], [0.25, 0.46], [0.32, 0.38], [0.36, 0.30],
      [0.32, 0.24], [0.34, 0.19], [0.40, 0.13],
    ],
  },
  premium: {
    src: "C:/Users/josep/paniers-rosh/public/images/panier-premium-source.jpg",
    outFile: "C:/Users/josep/paniers-rosh/public/images/panier-premium.jpg",
    // Côté droit élargi pour ne pas couper les bouteilles et les saucisses,
    // qui débordent plus large que côté gauche.
    points: [
      [0.32, 0.00], [0.45, 0.03], [0.50, 0.00], [0.55, 0.03], [0.68, 0.00],
      [0.80, 0.04], [0.90, 0.10], [0.94, 0.20], [0.91, 0.30],
      [0.87, 0.38], [0.89, 0.46],
      [0.93, 0.54], [0.96, 0.62], [0.95, 0.975],
      [0.08, 0.975], [0.07, 0.62], [0.13, 0.54],
      [0.20, 0.46], [0.23, 0.38],
      [0.18, 0.30], [0.14, 0.20], [0.15, 0.10], [0.22, 0.04],
    ],
  },
};

async function cutout(name, { src, outFile, points }) {
  const meta = await sharp(src).metadata();
  const { width, height } = meta;

  const path = points
    .map(([fx, fy], i) => `${i === 0 ? "M" : "L"}${(fx * width).toFixed(1)},${(fy * height).toFixed(1)}`)
    .join(" ") + " Z";

  const maskSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'><path d='${path}' fill='white'/></svg>`;

  // Masque flouté légèrement pour adoucir le contour (anti-crénelage doux).
  const mask = await sharp(Buffer.from(maskSvg)).blur(3).png().toBuffer();

  const cutoutRgba = await sharp(src)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp({
    create: { width, height, channels: 3, background: "#ffffff" },
  })
    .composite([{ input: cutoutRgba }])
    .jpeg({ quality: 95 })
    .toFile(outFile);

  console.log(`${name}: ${width}x${height} -> ${outFile}`);
}

for (const [name, cfg] of Object.entries(PRODUCTS)) {
  await cutout(name, cfg);
}
