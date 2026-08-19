import { createClient } from "@supabase/supabase-js";
import type { Order } from "./types";

/**
 * Client Supabase côté serveur UNIQUEMENT (utilise la clé service_role, qui
 * a tous les droits et ne doit jamais être exposée au navigateur). N'importez
 * jamais ce fichier depuis un composant client ou du code qui s'exécute dans
 * le navigateur.
 *
 * Retourne `null` si les variables d'environnement ne sont pas configurées :
 * l'appelant doit gérer ce cas sans faire planter la commande (voir
 * app/api/orders/route.ts — Supabase est une source de vérité en plus du
 * fichier local, pas un point de blocage).
 */
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/** Représentation d'une commande telle que stockée dans la table `orders`. */
type OrderRow = {
  order_number: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_method: string;
  delivery_street: string | null;
  delivery_postal_code: string | null;
  delivery_complement: string | null;
  pickup_notes: string | null;
  items: Order["items"];
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  gift_message: string | null;
  promo_code: string | null;
};

function toOrderRow(order: Order): OrderRow {
  return {
    order_number: order.orderId,
    created_at: order.createdAt,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_email: order.customer.email ?? null,
    delivery_method: order.deliveryMethod,
    delivery_street: order.deliveryAddress?.street ?? null,
    delivery_postal_code: order.deliveryAddress?.postalCode ?? null,
    delivery_complement: order.deliveryAddress?.complement ?? null,
    pickup_notes: order.pickup.notes ?? null,
    items: order.items,
    delivery_fee: order.deliveryFee,
    total: order.total,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    gift_message: order.giftMessage ?? null,
    promo_code: order.promoCode ?? null,
  };
}

/**
 * Enregistre la commande dans Supabase (table `orders`).
 *
 * Ne fait jamais échouer la commande : si les variables d'environnement
 * Supabase ne sont pas configurées, ou si l'insertion échoue (réseau, table
 * absente...), on logue un avertissement et on continue. La commande reste
 * de toute façon enregistrée dans data/orders.json en local.
 */
export async function saveOrderToSupabase(order: Order): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn(
      "[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY absentes : commande non enregistrée dans Supabase (voir .env.local.example)."
    );
    return;
  }

  const { error } = await supabase.from("orders").insert(toOrderRow(order));

  if (error) {
    console.error("[supabase] Échec de l'enregistrement de la commande :", error);
  }
}
