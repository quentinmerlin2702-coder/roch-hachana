import sharp from "sharp";

const SRC = "C:/Users/josep/Pictures/Screenshots/Capture d'écran 2026-08-21 152043.png";

// Recadrages "produit net" par panneau (coordonnées combinées : décalage du
// panneau dans le montage original + recadrage propre à chaque photo — un
// seul extract() combiné, car sharp n'applique pas resize() correctement
// après deux extract() chaînés).
const PANELS = {
  classique: {
    rect: { left: 16, top: 115, width: 643, height: 805 },
    // Fraction de la hauteur du canevas final occupée par la corbeille :
    // plus petite ici pour bien montrer que la Classique est plus compacte.
    fillHeight: 0.66,
    outFile: "C:/Users/josep/paniers-rosh/public/images/panier-classique.jpg",
  },
  premium: {
    rect: { left: 665 + 18, top: 85, width: 642, height: 870 },
    // Plus grande ici : la Premium doit remplir presque tout le cadre.
    fillHeight: 0.95,
    outFile: "C:/Users/josep/paniers-rosh/public/images/panier-premium.jpg",
  },
};

const CANVAS_W = 1600;
const CANVAS_H = 1200;

async function processPanel(name, { rect, fillHeight, outFile }) {
  const cropped = sharp(SRC).extract(rect);

  // Photo nette (premier plan), nettoyée et légèrement rehaussée.
  const fgHeight = Math.round(CANVAS_H * fillHeight);
  const fg = await cropped
    .clone()
    .resize({ height: fgHeight * 2, kernel: sharp.kernel.lanczos3 }) // sur-échantillonne avant nettoyage
    .median(1)
    .sharpen({ sigma: 1.1, m1: 1.1, m2: 0.5 })
    .modulate({ brightness: 1.03, saturation: 1.08 })
    .linear(1.04, -5)
    .resize({ height: fgHeight, kernel: sharp.kernel.lanczos3 }) // taille finale d'affichage
    .jpeg({ quality: 95 })
    .toBuffer();
  const fgMeta = await sharp(fg).metadata();

  // Fond : la même photo, très floutée et assombrie, en plein cadre —
  // donne l'impression d'un léger recul de caméra (flou de profondeur de
  // champ), sans bordure ni cadre visible.
  const bg = await cropped
    .clone()
    .resize({ width: CANVAS_W, height: CANVAS_H, fit: "cover" })
    .blur(55)
    .modulate({ brightness: 0.88, saturation: 1.12 })
    .jpeg({ quality: 90 })
    .toBuffer();

  await sharp(bg)
    .composite([{ input: fg, gravity: "center" }])
    .jpeg({ quality: 95 })
    .toFile(outFile);

  console.log(`${name}: premier plan ${fgMeta.width}x${fgMeta.height} sur canevas ${CANVAS_W}x${CANVAS_H} -> ${outFile}`);
}

for (const [name, cfg] of Object.entries(PANELS)) {
  await processPanel(name, cfg);
}
