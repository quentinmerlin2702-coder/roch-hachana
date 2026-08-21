import sharp from "sharp";

const SRC = "C:/Users/josep/Pictures/Screenshots/Capture d'écran 2026-08-21 152043.png";

// Vrai dézoom : on garde la quasi-totalité de chaque photo réelle, on
// retire uniquement les éléments d'interface (bandeau prix en haut, fine
// bordure blanche du carrousel sur le bord, pastille de pagination tout en
// bas) — pas de recadrage serré ni de montage artificiel. Les deux photos
// sont traitées avec exactement le même niveau de cadrage, donc la
// différence de taille/richesse entre les deux corbeilles vient uniquement
// de ce qui est réellement sur la photo.
const PANELS = {
  classique: {
    rect: { left: 15, top: 118, width: 646, height: 867 },
    outFile: "C:/Users/josep/paniers-rosh/public/images/panier-classique-source.jpg",
  },
  premium: {
    rect: { left: 665 + 18, top: 78, width: 642, height: 900 },
    outFile: "C:/Users/josep/paniers-rosh/public/images/panier-premium-source.jpg",
  },
};

async function processPanel(name, { rect, outFile }) {
  await sharp(SRC)
    .extract(rect)
    .resize({ width: 1800, kernel: sharp.kernel.lanczos3 })
    .median(1)
    .sharpen({ sigma: 1.1, m1: 1.1, m2: 0.5 })
    .modulate({ brightness: 1.03, saturation: 1.08 })
    .linear(1.04, -5)
    .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
    .toFile(outFile);

  const meta = await sharp(outFile).metadata();
  console.log(`${name}: ${meta.width} x ${meta.height} -> ${outFile}`);
}

for (const [name, cfg] of Object.entries(PANELS)) {
  await processPanel(name, cfg);
}
