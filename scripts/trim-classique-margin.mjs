import sharp from "sharp";

const SRC = "C:/Users/josep/paniers-rosh/public/images/panier-classique-source.jpg";
const OUT = "C:/Users/josep/paniers-rosh/public/images/panier-classique.jpg";

const meta = await sharp(SRC).metadata();
console.log("Source:", meta.width, "x", meta.height);

// Retire l'excédent de mur vide tout en haut de la photo (avant le début
// du cellophane), pour que la corbeille occupe une plus grande part du
// cadre — sans rien couper de la corbeille elle-même.
const topTrim = 183;
await sharp(SRC)
  .extract({ left: 0, top: topTrim, width: meta.width, height: meta.height - topTrim })
  .jpeg({ quality: 95 })
  .toFile(OUT);

const outMeta = await sharp(OUT).metadata();
console.log("Sortie:", outMeta.width, "x", outMeta.height, "->", OUT);
