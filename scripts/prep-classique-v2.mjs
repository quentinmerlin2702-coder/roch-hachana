import sharp from "sharp";

const SRC = "C:/Users/josep/Pictures/Screenshots/Capture d'écran 2026-08-22 000558.png";
const OUT = "C:/Users/josep/paniers-rosh/public/images/panier-classique-source.jpg";

const meta = await sharp(SRC).metadata();
console.log("Source:", meta.width, "x", meta.height);

// Retire les fines bordures sombres du screenshot en haut/bas, garde tout
// le reste (photo déjà sur fond clair, avec des accessoires de mise en
// scène sur les côtés qui seront exclus par le détourage).
await sharp(SRC)
  .extract({ left: 0, top: 14, width: meta.width, height: meta.height - 28 })
  .resize({ width: 1800, kernel: sharp.kernel.lanczos3 })
  .median(1)
  .sharpen({ sigma: 1.0, m1: 1.0, m2: 0.5 })
  .modulate({ brightness: 1.02, saturation: 1.06 })
  .linear(1.03, -4)
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
  .toFile(OUT);

const outMeta = await sharp(OUT).metadata();
console.log("Sortie:", outMeta.width, "x", outMeta.height, "->", OUT);
