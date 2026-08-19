"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import {
  CHARITY_MENTION,
  DELIVERY_FEE,
  FULFILLMENT_INFO,
  PICKUP_INFO,
} from "@/lib/config";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  CardIcon,
  CashIcon,
  CheckCircleIcon,
  GiftIcon,
  HeartIcon,
  SearchIcon,
} from "@/components/Icons";

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    // Lecture ponctuelle de sessionStorage au montage : ce n'est pas un
    // abonnement à une source externe qui change, donc pas adapté à
    // useSyncExternalStore. On désactive la règle pour ce cas précis.
    try {
      const raw = sessionStorage.getItem("lastOrder");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrder(raw ? (JSON.parse(raw) as Order) : null);
    } catch {
      setOrder(null);
    }
  }, []);

  if (order === undefined) {
    return null;
  }

  if (order === null) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-300/60 bg-gold-50 text-garnet-700">
          <SearchIcon className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-bold text-garnet-800">
          Aucune commande récente à afficher
        </h1>
        <p className="text-honey-900/70">
          Passez une commande depuis notre catalogue pour voir votre
          confirmation ici.
        </p>
        <Link
          href="/catalogue"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-garnet-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream-50 shadow-sm transition hover:bg-garnet-800"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const whatsappMessage = `Bonjour ! Je viens de passer la commande n°${order.orderId} (${formatPrice(
    order.total
  )}, paiement : ${PAYMENT_METHOD_LABELS[order.paymentMethod]}). Pouvez-vous me confirmer la réception ?`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-300/60 bg-gold-50 text-garnet-700">
          <CheckCircleIcon className="h-8 w-8" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
          Merci
        </span>
        <h1 className="font-display text-3xl font-bold text-garnet-800">
          Commande enregistrée !
        </h1>
        <p className="text-honey-900/70">
          Merci {order.customer.name}, votre commande a bien été enregistrée.
          Le vendeur vous contactera prochainement sur WhatsApp pour confirmer
          les détails.
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-honey-900/60">
          <HeartIcon className="h-3.5 w-3.5 text-garnet-500" />
          {CHARITY_MENTION}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-gold-300/50 bg-cream-100 p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-300/50 pb-4">
          <span className="text-sm text-honey-900/70">Numéro de commande</span>
          <span className="font-display text-xl font-bold text-garnet-700">
            {order.orderId}
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-2.5">
          {order.items.map((item) => (
            <li
              key={item.productId}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="text-honey-900/80">
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold text-garnet-800">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
          {order.deliveryMethod === "livraison" && (
            <li className="flex items-center justify-between gap-2 text-sm">
              <span className="text-honey-900/80">Livraison à Paris</span>
              {order.promoCode ? (
                <span className="flex items-center gap-2">
                  <span className="text-honey-900/40 line-through">
                    {formatPrice(DELIVERY_FEE)}
                  </span>
                  <span className="font-semibold text-garnet-700">
                    Offerte
                  </span>
                </span>
              ) : (
                <span className="font-semibold text-garnet-800">
                  {formatPrice(order.deliveryFee)}
                </span>
              )}
            </li>
          )}
        </ul>
        {order.promoCode && order.deliveryMethod === "retrait" && (
          <p className="mt-2 text-xs font-semibold text-garnet-700">
            ✓ Code promo {order.promoCode} enregistré (sans effet pour un
            retrait)
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-gold-300/50 pt-4 font-display text-lg font-bold text-garnet-800">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-gold-300/50 pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-honey-900/60">
              Mode de réception
            </dt>
            <dd className="mt-0.5 font-semibold text-garnet-800">
              {order.deliveryMethod === "livraison"
                ? "Livraison à Paris"
                : "Retrait dans le 16ᵉ arrondissement"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-honey-900/60">
              Mode de paiement choisi
            </dt>
            <dd className="mt-0.5 font-semibold text-garnet-800">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </dd>
          </div>
          {order.deliveryMethod === "livraison" && order.deliveryAddress && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-honey-900/60">
                Adresse de livraison
              </dt>
              <dd className="mt-0.5 font-semibold text-garnet-800">
                {order.deliveryAddress.street}, {order.deliveryAddress.postalCode} Paris
                {order.deliveryAddress.complement
                  ? ` (${order.deliveryAddress.complement})`
                  : ""}
              </dd>
            </div>
          )}
        </dl>

        <p className="mt-4 text-sm text-honey-900/75">{FULFILLMENT_INFO}</p>

        {order.paymentMethod === "especes" && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-gold-50 px-4 py-3 text-sm text-honey-900/80">
            <CashIcon className="mt-0.5 h-4 w-4 shrink-0 text-garnet-600" />
            Merci de prévoir le règlement en espèces au moment{" "}
            {order.deliveryMethod === "livraison"
              ? "de la livraison"
              : "du retrait"}
            .
          </p>
        )}
        {order.paymentMethod === "revolut" && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-gold-50 px-4 py-3 text-sm text-honey-900/80">
            <CardIcon className="mt-0.5 h-4 w-4 shrink-0 text-garnet-600" />
            Le vendeur vous enverra le lien de paiement Revolut lors de sa
            prise de contact.
          </p>
        )}

        {order.deliveryMethod === "retrait" && (
          <p className="mt-3 text-sm text-honey-900/70">{PICKUP_INFO}</p>
        )}

        {order.giftMessage && (
          <div className="mt-5 rounded-xl border-l-2 border-gold-400 bg-gold-50 px-4 py-3">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-700">
              <GiftIcon className="h-3.5 w-3.5" />
              Votre message cadeau
            </p>
            <p className="whitespace-pre-wrap text-sm text-honey-900/80">
              {order.giftMessage}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-sm text-honey-900/70">
          Vous pouvez aussi contacter le vendeur dès maintenant :
        </p>
        <WhatsAppButton message={whatsappMessage} className="w-full sm:w-auto" />
        <Link
          href="/catalogue"
          className="mt-2 text-sm font-medium text-honey-900/70 hover:text-garnet-700"
        >
          ← Retour au catalogue
        </Link>
      </div>
    </div>
  );
}
