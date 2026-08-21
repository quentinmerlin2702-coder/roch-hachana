import sharp from "sharp";

const SRC = "C:/Users/josep/Pictures/Screenshots/Capture d'écran 2026-08-21 152043.png";

async function processPanel({ panelLeft, crop, outFile, label }) {
  // Un seul extract() (coordonnées combinées panneau + recadrage) : sharp
  // n'applique pas resize() correctement après deux extract() chaînés.
  const combined = {
    left: panelLeft + crop.left,
    top: crop.top,
    width: crop.width,
    height: crop.height,
  };

  await sharp(SRC)
    .extract(combined)
    .resize({ width: 1800, kernel: sharp.kernel.lanczos3 })
    .median(1)
    .sharpen({ sigma: 1.1, m1: 1.1, m2: 0.5 })
    .modulate({ brightness: 1.03, saturation: 1.08 })
    .linear(1.04, -5)
    .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
    .toFile(outFile);

  const meta = await sharp(outFile).metadata();
  console.log(`${label}: ${meta.width} x ${meta.height} -> ${outFile}`);
}

// Panneau gauche : La Classique (99€)
await processPanel({
  panelLeft: 0,
  crop: { left: 16, top: 115, width: 643, height: 805 },
  outFile: "C:/Users/josep/paniers-rosh/public/images/panier-classique.jpg",
  label: "Classique",
});

// Panneau droit : La Premium (149€)
await processPanel({
  panelLeft: 665,
  crop: { left: 18, top: 85, width: 642, height: 870 },
  outFile: "C:/Users/josep/paniers-rosh/public/images/panier-premium.jpg",
  label: "Premium",
});
