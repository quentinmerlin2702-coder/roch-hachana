export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  description: string;
  contents: string[];
  badge?: string;
};

export type PaymentMethod = "especes" | "revolut";

/**
 * Le paiement ne se fait jamais sur le site : "pending" tant que le vendeur
 * n'a pas reçu le règlement (espèces au retrait/à la livraison, ou virement
 * Revolut), "paid" une fois encaissé. Mis à jour manuellement par le vendeur
 * (ex. directement dans la table Supabase), jamais par le client.
 */
export type PaymentStatus = "pending" | "paid";

export type DeliveryMethod = "retrait" | "livraison";

export type CartItem = {
  productId: string;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type DeliveryAddress = {
  street: string;
  postalCode: string;
  complement?: string;
};

export type OrderInput = {
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  pickup: {
    /** Remarques facultatives (créneau préféré, instructions...). */
    notes?: string;
  };
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  /** Requis uniquement si deliveryMethod === "livraison" (Paris uniquement). */
  deliveryAddress?: DeliveryAddress;
  items: CartItem[];
  /** Message cadeau facultatif à joindre au panier, écrit par le client. */
  giftMessage?: string;
  /** Code promo saisi par le client (facultatif). */
  promoCode?: string;
};

export type Order = {
  orderId: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  pickup: {
    notes?: string;
  };
  paymentMethod: PaymentMethod;
  /** Toujours "pending" à la création (voir PaymentStatus). */
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: DeliveryAddress;
  /** Supplément de livraison réellement facturé, inclus dans `total` (0 si retrait ou code promo livraison offerte). */
  deliveryFee: number;
  items: OrderItem[];
  total: number;
  /** Message cadeau facultatif à joindre au panier, écrit par le client. */
  giftMessage?: string;
  /** Code promo appliqué avec succès (absent si aucun code, ou code invalide). */
  promoCode?: string;
};
