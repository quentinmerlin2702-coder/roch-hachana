import { Resend } from "resend";
import type { Order } from "./types";
import {
  EMAIL_FROM,
  FULFILLMENT_WINDOW_LABEL,
  SELLER_EMAIL,
  SELLER_DISPLAY_PHONE,
  SHOP_NAME,
} from "./config";
import { formatPrice } from "./format";
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "./payment";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const sectionHeading = (label: string) =>
  `<h2 style="font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:#b8912a; margin:24px 0 6px; font-family:Georgia,'Times New Roman',serif;">${label}</h2>`;

function emailShell(bodyHtml: string): string {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#2a1610; max-width:560px; margin:0 auto;">
    <div style="height:3px; background:linear-gradient(to right,#d4af37,#f3e6bd,#d4af37);"></div>
    <div style="padding:28px 4px 0;">
      <p style="margin:0 0 4px; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:#b8912a;">${escapeHtml(SHOP_NAME)}</p>
      ${bodyHtml}
    </div>
  </div>`;
}

function itemsTable(order: Order): string {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:6px 0;">${escapeHtml(item.name)} × ${item.quantity}</td>
          <td style="padding:6px 0; text-align:right;">${formatPrice(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const deliveryRow =
    order.deliveryMethod === "livraison"
      ? `<tr>
          <td style="padding:6px 0;">Livraison à Paris</td>
          <td style="padding:6px 0; text-align:right;">${order.promoCode ? "Offerte" : formatPrice(order.deliveryFee)}</td>
        </tr>`
      : "";

  return `<table style="width:100%; border-collapse:collapse; font-size:14px;">
    ${rows}
    ${deliveryRow}
    <tr>
      <td style="padding-top:10px; border-top:1px solid #e9d3a3; font-weight:bold;">Total</td>
      <td style="padding-top:10px; border-top:1px solid #e9d3a3; font-weight:bold; text-align:right;">${formatPrice(order.total)}</td>
    </tr>
  </table>`;
}

function receptionDetails(order: Order): string {
  const mode =
    order.deliveryMethod === "livraison"
      ? `Livraison à Paris${order.promoCode ? ` (offerte, code ${escapeHtml(order.promoCode)})` : ` (+${formatPrice(order.deliveryFee)})`}`
      : "Retrait dans le 16ᵉ arrondissement";

  const address =
    order.deliveryMethod === "livraison" && order.deliveryAddress
      ? `Adresse : ${escapeHtml(order.deliveryAddress.street)}, ${escapeHtml(order.deliveryAddress.postalCode)} Paris${order.deliveryAddress.complement ? ` (${escapeHtml(order.deliveryAddress.complement)})` : ""}<br/>`
      : "";

  return `Mode : ${mode}<br/>
    ${address}
    Créneau : ${escapeHtml(FULFILLMENT_WINDOW_LABEL)}`;
}

/**
 * Envoie un email de notification de commande au vendeur (SELLER_EMAIL),
 * avec le récapitulatif complet, le statut de paiement et le message cadeau
 * s'il y en a un.
 *
 * Ne fait jamais échouer la commande : si RESEND_API_KEY n'est pas
 * configurée, ou si l'envoi échoue, on se contente de logger un
 * avertissement. La commande reste enregistrée (Supabase + fichier local)
 * dans tous les cas — l'email est une notification en plus, pas la source de
 * vérité.
 */
export async function sendOrderNotificationEmail(order: Order): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY absente : email de commande non envoyé (voir .env.local.example)."
    );
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: SELLER_EMAIL,
      subject: `Nouvelle commande ${order.orderId} — ${formatPrice(order.total)}`,
      html: renderSellerEmailHtml(order),
    });

    if (error) {
      console.error("[email] Échec de l'envoi du récapitulatif vendeur :", error);
    }
  } catch (err) {
    console.error("[email] Erreur inattendue (email vendeur) :", err);
  }
}

/**
 * Envoie un email de confirmation au client, uniquement s'il a renseigné une
 * adresse email (le champ est facultatif dans le formulaire). Ne fait jamais
 * échouer la commande — mêmes garanties que sendOrderNotificationEmail.
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  if (!order.customer.email) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY absente : email de confirmation client non envoyé."
    );
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: order.customer.email,
      subject: `Votre commande ${order.orderId} est enregistrée — ${SHOP_NAME}`,
      html: renderCustomerEmailHtml(order),
    });

    if (error) {
      console.error("[email] Échec de l'envoi de la confirmation client :", error);
    }
  } catch (err) {
    console.error("[email] Erreur inattendue (email client) :", err);
  }
}

function renderSellerEmailHtml(order: Order): string {
  return emailShell(`
      <h1 style="color:#2c0a10; font-size:22px; margin:0; font-family:Georgia,'Times New Roman',serif;">Nouvelle commande — ${escapeHtml(order.orderId)}</h1>

      ${sectionHeading("Client")}
      <p style="margin:4px 0;">
        ${escapeHtml(order.customer.name)}<br/>
        Tél : ${escapeHtml(order.customer.phone)}${order.customer.email ? `<br/>Email : ${escapeHtml(order.customer.email)}` : ""}
      </p>

      ${
        order.giftMessage
          ? `${sectionHeading("Message cadeau")}
             <p style="margin:4px 0; padding:12px; background:#fbf6e8; border-left:3px solid #d4af37; white-space:pre-wrap;">${escapeHtml(order.giftMessage)}</p>`
          : ""
      }

      ${sectionHeading("Produits")}
      ${itemsTable(order)}

      ${sectionHeading("Réception & paiement")}
      <p style="margin:4px 0;">
        ${receptionDetails(order)}<br/>
        Mode de paiement : ${escapeHtml(PAYMENT_METHOD_LABELS[order.paymentMethod])}<br/>
        Statut du paiement : ${escapeHtml(PAYMENT_STATUS_LABELS[order.paymentStatus])}
        ${order.deliveryMethod === "retrait" && order.promoCode ? `<br/>Code promo saisi : ${escapeHtml(order.promoCode)} (sans effet pour un retrait)` : ""}
        ${order.pickup.notes ? `<br/>Remarques : ${escapeHtml(order.pickup.notes)}` : ""}
      </p>

      <p style="margin-top:28px; padding-top:16px; border-top:1px solid #f3e3c5; font-size:12px; color:#a3826c;">
        Commande enregistrée le ${new Date(order.createdAt).toLocaleString("fr-FR")}.
      </p>
  `);
}

function renderCustomerEmailHtml(order: Order): string {
  return emailShell(`
      <h1 style="color:#2c0a10; font-size:22px; margin:0; font-family:Georgia,'Times New Roman',serif;">Merci ${escapeHtml(order.customer.name)} !</h1>
      <p style="margin:8px 0 0; font-size:14px;">Votre commande a bien été enregistrée.</p>

      ${sectionHeading("Numéro de commande")}
      <p style="margin:4px 0; font-size:18px; font-weight:bold; color:#2c0a10;">${escapeHtml(order.orderId)}</p>

      ${
        order.giftMessage
          ? `${sectionHeading("Votre message cadeau")}
             <p style="margin:4px 0; padding:12px; background:#fbf6e8; border-left:3px solid #d4af37; white-space:pre-wrap;">${escapeHtml(order.giftMessage)}</p>`
          : ""
      }

      ${sectionHeading("Récapitulatif")}
      ${itemsTable(order)}

      ${sectionHeading("Réception & paiement")}
      <p style="margin:4px 0;">
        ${receptionDetails(order)}<br/>
        Mode de paiement choisi : ${escapeHtml(PAYMENT_METHOD_LABELS[order.paymentMethod])}
      </p>

      <p style="margin:24px 0; padding:16px; background:#fbf6e8; border:1px solid #e9d3a3; border-radius:8px; font-size:15px;">
        <strong style="color:#7a1f2b;">Le vendeur vous contactera prochainement sur WhatsApp pour la finalisation.</strong>
      </p>

      <p style="margin-top:28px; padding-top:16px; border-top:1px solid #f3e3c5; font-size:12px; color:#a3826c;">
        Une question avant cela ? Contactez-nous au ${escapeHtml(SELLER_DISPLAY_PHONE)}.
      </p>
  `);
}
