import sharp from "sharp";

const SRC = "C:/Users/josep/Pictures/Screenshots/Capture d'écran 2026-08-21 145448.png";
const OUT = new URL("../public/images/panier-classique.jpg", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const meta = await sharp(SRC).metadata();
console.log("Source:", meta.width, "x", meta.height);

// Recadre directement au format 4:3 (celui utilisé par les fiches produit),
// centré sur les produits de la corbeille (bouteilles, pots, fruits) — pas
// de bandeau "classique 99€", pas de bordure, pas de fond flouté : une
// photo pleine cadre, comme un vrai visuel catalogue.
const cropTop = 348;
const cropWidth = meta.width;
const cropHeight = Math.round((cropWidth * 3) / 4);
const cropped = sharp(SRC).extract({
  left: 0,
  top: cropTop,
  width: cropWidth,
  height: Math.min(cropHeight, meta.height - cropTop),
});

// Agrandissement propre (Lanczos), débruitage léger puis renforcement net
// de la netteté (masque flou), et un poil plus de contraste/saturation
// pour un rendu catalogue.
await cropped
  .resize({ width: 1800, kernel: sharp.kernel.lanczos3 })
  .median(1)
  .sharpen({ sigma: 1.4, m1: 1.4, m2: 0.7 })
  .modulate({ brightness: 1.05, saturation: 1.12 })
  .linear(1.06, -8)
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
  .toFile(OUT);

const outMeta = await sharp(OUT).metadata();
console.log("Fichier final:", OUT, "-", outMeta.width, "x", outMeta.height);
