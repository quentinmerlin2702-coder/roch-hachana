// Codes promo disponibles sur la boutique.
// Pour ajouter un code, ajoutez simplement une entrée dans cet objet.

export type PromoCode = {
  code: string;
  /** Texte affiché au client une fois le code appliqué. */
  description: string;
  /** Si vrai, le supplément de livraison est offert. */
  freeDelivery: boolean;
};

const PROMO_CODES: Record<string, PromoCode> = {
  HABABOU26: {
    code: "HABABOU26",
    description: "Livraison offerte",
    freeDelivery: true,
  },
};

/** Recherche un code promo (insensible à la casse et aux espaces). */
export function getPromoCode(rawCode: string | undefined | null): PromoCode | undefined {
  if (!rawCode) return undefined;
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) return undefined;
  return PROMO_CODES[normalized];
}
