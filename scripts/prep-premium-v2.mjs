import sharp from "sharp";

const SRC = "C:/Users/josep/Pictures/Screenshots/Capture d'écran 2026-08-22 002436.png";
const OUT = "C:/Users/josep/paniers-rosh/public/images/panier-premium.jpg";

const meta = await sharp(SRC).metadata();
console.log("Source:", meta.width, "x", meta.height);

// Cette capture n'a pas de bordure noire (vérifié) : agrandissement +
// nettoyage direct, sans recadrage des bords.
await sharp(SRC)
  .resize({ width: 1800, kernel: sharp.kernel.lanczos3 })
  .median(1)
  .sharpen({ sigma: 1.0, m1: 1.0, m2: 0.5 })
  .modulate({ brightness: 1.02, saturation: 1.06 })
  .linear(1.03, -4)
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
  .toFile(OUT);

const outMeta = await sharp(OUT).metadata();
console.log("Sortie:", outMeta.width, "x", outMeta.height, "->", OUT);
