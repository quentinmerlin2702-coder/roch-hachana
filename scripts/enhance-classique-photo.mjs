import sharp from "sharp";

const SRC = "C:/Users/josep/Pictures/Screenshots/Capture d'écran 2026-08-21 145448.png";
const OUT = new URL("../public/images/panier-classique.jpg", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const meta = await sharp(SRC).metadata();
console.log("Source:", meta.width, "x", meta.height);

// 1. Recadre : enlève le bandeau "classique 99€" en haut, garde un peu de
//    marge en bas (juste après la corbeille, avant que la table ne devienne
//    trop présente).
const cropTop = 128;
const cropHeight = 522;
const cropped = sharp(SRC).extract({
  left: 0,
  top: cropTop,
  width: meta.width,
  height: Math.min(cropHeight, meta.height - cropTop),
});

// 2. Premier plan net : agrandit modérément, nettoie le bruit puis renforce
//    la netteté (masque flou), léger boost couleur/contraste pour un rendu
//    plus "premium".
const fg = await cropped
  .clone()
  .resize({ height: 1080, kernel: sharp.kernel.lanczos3 })
  .median(1)
  .sharpen({ sigma: 1.3, m1: 1.2, m2: 0.6 })
  .modulate({ brightness: 1.04, saturation: 1.1 })
  .linear(1.04, -6) // léger boost de contraste
  .extend({
    top: 22,
    bottom: 22,
    left: 22,
    right: 22,
    background: "#fdf6e9",
  })
  .jpeg({ quality: 95 })
  .toBuffer();
const fgMeta = await sharp(fg).metadata();
console.log("Premier plan:", fgMeta.width, "x", fgMeta.height);

// 3. Fond ambiant : la même photo, recadrée en "cover" sur tout le canevas
//    4:3, puis très floutée et assombrie — sert de toile de fond chaude
//    derrière la photo nette (cache le manque de détail du fond, met le
//    produit en valeur, façon vitrine).
const CANVAS_W = 1600;
const CANVAS_H = 1200;
const bg = await cropped
  .clone()
  .resize({ width: CANVAS_W, height: CANVAS_H, fit: "cover" })
  .blur(45)
  .modulate({ brightness: 0.82, saturation: 1.15 })
  .jpeg({ quality: 90 })
  .toBuffer();

// 4. Composite : photo nette centrée sur le fond flouté chaud.
await sharp(bg)
  .composite([{ input: fg, gravity: "center" }])
  .jpeg({ quality: 95 })
  .toFile(OUT);

const outMeta = await sharp(OUT).metadata();
console.log("Fichier final:", OUT, "-", outMeta.width, "x", outMeta.height);
