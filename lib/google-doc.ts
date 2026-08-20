import type { Order } from "./types";
import { formatPrice } from "./format";
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "./payment";

/**
 * Envoie le récapitulatif de la commande au script Google Apps Script relié
 * au document de suivi (voir README.md, section "Suivi des commandes dans
 * un Google Doc"), qui l'écrit en haut du document.
 *
 * Ne fait jamais échouer la commande : si GOOGLE_DOC_WEBHOOK_URL n'est pas
 * configurée, ou si l'appel échoue, on logue un avertissement et on
 * continue. Le document Google n'est qu'un journal de suivi en plus,
 * Supabase reste la source de vérité.
 */
export async function sendOrderToGoogleDoc(order: Order): Promise<void> {
  const webhookUrl = process.env.GOOGLE_DOC_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "[google-doc] GOOGLE_DOC_WEBHOOK_URL absente : commande non écrite dans le Google Doc (voir .env.local.example)."
    );
    return;
  }

  const reception =
    order.deliveryMethod === "livraison"
      ? `Livraison à Paris (${order.promoCode ? "offerte, code " + order.promoCode : "+" + formatPrice(order.deliveryFee)})`
      : "Retrait dans le 16ᵉ arrondissement";

  const address =
    order.deliveryMethod === "livraison" && order.deliveryAddress
      ? `${order.deliveryAddress.street}, ${order.deliveryAddress.postalCode} Paris${order.deliveryAddress.complement ? ` (${order.deliveryAddress.complement})` : ""}`
      : undefined;

  const payload = {
    orderId: order.orderId,
    createdAt: new Date(order.createdAt).toLocaleString("fr-FR"),
    customerName: order.customer.name,
    customerPhone: order.customer.phone,
    customerEmail: order.customer.email,
    reception,
    address,
    items: order.items.map(
      (item) => `${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`
    ),
    total: formatPrice(order.total),
    paymentMethod: PAYMENT_METHOD_LABELS[order.paymentMethod],
    paymentStatus: PAYMENT_STATUS_LABELS[order.paymentStatus],
    giftMessage: order.giftMessage,
    notes: order.pickup.notes,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    if (!res.ok) {
      console.error(
        "[google-doc] Échec de l'écriture dans le Google Doc :",
        res.status,
        await res.text().catch(() => "")
      );
    }
  } catch (err) {
    console.error("[google-doc] Erreur inattendue :", err);
  }
}
