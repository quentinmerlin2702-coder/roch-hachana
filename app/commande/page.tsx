"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import {
  DELIVERY_AREA_LABEL,
  DELIVERY_FEE,
  FULFILLMENT_INFO,
} from "@/lib/config";
import { getPromoCode } from "@/lib/promo";
import type { DeliveryMethod, Order, PaymentMethod } from "@/lib/types";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  BasketIcon,
  CardIcon,
  CashIcon,
  DeliveryIcon,
  GiftIcon,
  HomeIcon,
} from "@/components/Icons";

const inputClass =
  "rounded-xl border border-gold-300/50 bg-cream-50 px-4 py-3 text-base text-garnet-900 outline-none transition focus:border-garnet-600 focus:ring-2 focus:ring-gold-200";

const legendClass =
  "flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-600";

const radioCardClass =
  "flex cursor-pointer items-start gap-3 rounded-xl border border-gold-200/60 p-4 transition has-[:checked]:border-garnet-600 has-[:checked]:bg-gold-50";

export default function OrderFormPage() {
  const { items, clearCart, hydrated } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("retrait");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [complement, setComplement] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("especes");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          return { product, quantity: item.quantity };
        })
        .filter(
          (
            l
          ): l is {
            product: NonNullable<ReturnType<typeof getProductById>>;
            quantity: number;
          } => l !== null
        ),
    [items]
  );

  const itemsTotal = lines.reduce(
    (sum, l) => sum + l.product.price * l.quantity,
    0
  );

  const appliedPromo = getPromoCode(promoCodeInput);
  const promoFreeDelivery =
    deliveryMethod === "livraison" && appliedPromo?.freeDelivery === true;
  const deliveryFee =
    deliveryMethod === "livraison" && !promoFreeDelivery ? DELIVERY_FEE : 0;
  const total = itemsTotal + deliveryFee;

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-300/60 bg-gold-50 text-garnet-700">
          <BasketIcon className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-bold text-garnet-800">
          Votre panier est vide
        </h1>
        <p className="text-honey-900/70">
          Ajoutez au moins une corbeille avant de passer commande.
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Merci de remplir votre nom et votre téléphone.");
      return;
    }

    if (deliveryMethod === "livraison") {
      if (!street.trim() || !postalCode.trim()) {
        setError(
          "Merci de renseigner l'adresse complète pour la livraison à Paris."
        );
        return;
      }
      if (!/^(750(0[1-9]|1[0-9]|20)|75116)$/.test(postalCode.trim())) {
        setError(
          "La livraison n'est disponible qu'à Paris (codes postaux 75001 à 75020, ou 75116). Sinon, choisissez le retrait."
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone, email: email || undefined },
          pickup: { notes: notes || undefined },
          paymentMethod,
          deliveryMethod,
          deliveryAddress:
            deliveryMethod === "livraison"
              ? { street, postalCode, complement: complement || undefined }
              : undefined,
          items,
          giftMessage: giftMessage || undefined,
          promoCode: promoCodeInput || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Une erreur est survenue. Réessayez.");
        setSubmitting(false);
        return;
      }

      const order: Order = await res.json();
      sessionStorage.setItem("lastOrder", JSON.stringify(order));
      clearCart();
      router.push("/confirmation");
    } catch {
      setError(
        "Impossible d'enregistrer la commande. Vérifiez votre connexion et réessayez."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
        Étape 2 sur 2
      </span>
      <h1 className="mt-2 mb-8 font-display text-3xl font-bold text-garnet-800">
        Finaliser la commande
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-4 rounded-2xl border border-gold-200/60 bg-cream-50 p-6">
            <legend className={legendClass}>Vos coordonnées</legend>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-garnet-900">
              Nom complet *
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Ex : Rachel Cohen"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-garnet-900">
              Téléphone *
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="Ex : 06 12 34 56 78"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-garnet-900">
              Email (facultatif)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="Ex : rachel@example.com"
              />
            </label>
          </fieldset>

          <fieldset className="flex flex-col gap-2 rounded-2xl border border-gold-200/60 bg-cream-50 p-6">
            <legend className={legendClass}>
              <GiftIcon className="h-4 w-4" />
              Message à glisser dans la corbeille (facultatif)
            </legend>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-garnet-900">
              Votre message
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                rows={3}
                maxLength={500}
                className={inputClass + " resize-none"}
                placeholder="Ex : Chana Tova ! Que cette année vous apporte..."
              />
            </label>
            <p className="px-1 text-xs text-honey-900/60">
              Ce message sera transmis au vendeur pour être glissé dans la
              corbeille.
            </p>
          </fieldset>

          <fieldset className="flex flex-col gap-3 rounded-2xl border border-gold-200/60 bg-cream-50 p-6">
            <legend className={legendClass}>Mode de réception</legend>

            <label className={radioCardClass}>
              <input
                type="radio"
                name="deliveryMethod"
                value="retrait"
                checked={deliveryMethod === "retrait"}
                onChange={() => setDeliveryMethod("retrait")}
                className="mt-1 h-4 w-4 accent-garnet-700"
              />
              <span className="flex items-start gap-2.5">
                <HomeIcon className="mt-0.5 h-4 w-4 shrink-0 text-garnet-600" />
                <span>
                  <span className="block font-semibold text-garnet-900">
                    Retrait dans le 16ᵉ arrondissement
                  </span>
                  <span className="block text-sm text-honey-900/70">
                    Gratuit. L&apos;adresse exacte vous sera communiquée par le
                    vendeur.
                  </span>
                </span>
              </span>
            </label>

            <label className={radioCardClass}>
              <input
                type="radio"
                name="deliveryMethod"
                value="livraison"
                checked={deliveryMethod === "livraison"}
                onChange={() => setDeliveryMethod("livraison")}
                className="mt-1 h-4 w-4 accent-garnet-700"
              />
              <span className="flex items-start gap-2.5">
                <DeliveryIcon className="mt-0.5 h-4 w-4 shrink-0 text-garnet-600" />
                <span>
                  <span className="block font-semibold text-garnet-900">
                    Livraison à Paris (+{formatPrice(DELIVERY_FEE)})
                  </span>
                  <span className="block text-sm text-honey-900/70">
                    Livraison à domicile disponible uniquement à Paris (
                    {DELIVERY_AREA_LABEL}).
                  </span>
                </span>
              </span>
            </label>

            {deliveryMethod === "livraison" && (
              <div className="flex flex-col gap-3 rounded-xl bg-gold-50 p-4">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-garnet-900">
                  Adresse (numéro et rue) *
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={inputClass}
                    placeholder="Ex : 12 avenue Victor Hugo"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-garnet-900">
                    Code postal *
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={inputClass}
                      placeholder="75016"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-garnet-900">
                    Ville
                    <input
                      type="text"
                      value="Paris"
                      disabled
                      className="rounded-xl border border-gold-200/60 bg-cream-200 px-4 py-3 text-base text-honey-900/60"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-garnet-900">
                  Complément d&apos;adresse (facultatif)
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    className={inputClass}
                    placeholder="Étage, code porte, digicode..."
                  />
                </label>
              </div>
            )}
          </fieldset>

          <fieldset className="flex flex-col gap-4 rounded-2xl border border-gold-200/60 bg-cream-50 p-6">
            <legend className={legendClass}>Quand ?</legend>

            <p className="text-sm leading-relaxed text-honey-900/75">
              {FULFILLMENT_INFO}
            </p>
            <WhatsAppButton
              message="Bonjour ! J'aimerais connaître le jour et le créneau exacts pour ma commande."
              label="Nous écrire sur WhatsApp"
              className="w-fit !px-5 !py-2.5 !text-xs"
            />

            <label className="flex flex-col gap-1.5 text-sm font-medium text-garnet-900">
              Remarques (facultatif)
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={inputClass + " resize-none"}
                placeholder="Jour préféré dans la semaine, instructions particulières..."
              />
            </label>
          </fieldset>

          <fieldset className="flex flex-col gap-3 rounded-2xl border border-gold-200/60 bg-cream-50 p-6">
            <legend className={legendClass}>Mode de paiement</legend>

            <label className={radioCardClass}>
              <input
                type="radio"
                name="paymentMethod"
                value="especes"
                checked={paymentMethod === "especes"}
                onChange={() => setPaymentMethod("especes")}
                className="mt-1 h-4 w-4 accent-garnet-700"
              />
              <span className="flex items-start gap-2.5">
                <CashIcon className="mt-0.5 h-4 w-4 shrink-0 text-garnet-600" />
                <span>
                  <span className="block font-semibold text-garnet-900">
                    Paiement en espèces
                  </span>
                  <span className="block text-sm text-honey-900/70">
                    Vous réglez au moment du retrait ou de la livraison.
                  </span>
                </span>
              </span>
            </label>

            <label className={radioCardClass}>
              <input
                type="radio"
                name="paymentMethod"
                value="revolut"
                checked={paymentMethod === "revolut"}
                onChange={() => setPaymentMethod("revolut")}
                className="mt-1 h-4 w-4 accent-garnet-700"
              />
              <span className="flex items-start gap-2.5">
                <CardIcon className="mt-0.5 h-4 w-4 shrink-0 text-garnet-600" />
                <span>
                  <span className="block font-semibold text-garnet-900">
                    Paiement par Revolut
                  </span>
                  <span className="block text-sm text-honey-900/70">
                    Le vendeur vous enverra le lien de paiement Revolut
                    lorsqu&apos;il vous contactera.
                  </span>
                </span>
              </span>
            </label>
          </fieldset>

          {error && (
            <p className="rounded-xl bg-garnet-50 px-4 py-3 text-sm font-medium text-garnet-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full bg-garnet-900 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-cream-50 shadow-sm transition hover:bg-garnet-800 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? "Enregistrement..." : "Confirmer la commande"}
          </button>
        </form>

        {/* Récapitulatif */}
        <aside className="h-fit rounded-2xl border border-gold-300/50 bg-cream-100 p-6">
          <p className={legendClass}>Récapitulatif</p>
          <ul className="mt-4 flex flex-col gap-3">
            {lines.map(({ product, quantity }) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="text-honey-900/80">
                  {product.name} × {quantity}
                </span>
                <span className="font-semibold text-garnet-800">
                  {formatPrice(product.price * quantity)}
                </span>
              </li>
            ))}
            {deliveryMethod === "livraison" && (
              <li className="flex items-center justify-between gap-2 text-sm">
                <span className="text-honey-900/80">Livraison à Paris</span>
                {promoFreeDelivery ? (
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
                    {formatPrice(deliveryFee)}
                  </span>
                )}
              </li>
            )}
          </ul>

          <div className="mt-4 border-t border-gold-300/50 pt-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-garnet-900">
              Code promo
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className={inputClass + " uppercase"}
                placeholder="Code promo"
              />
            </label>
            {promoCodeInput.trim() &&
              (appliedPromo ? (
                <p className="mt-1.5 text-xs font-semibold text-garnet-700">
                  ✓{" "}
                  {promoFreeDelivery
                    ? `Code appliqué : ${appliedPromo.description}`
                    : "Code valide — la livraison offerte sera appliquée si vous choisissez ce mode."}
                </p>
              ) : (
                <p className="mt-1.5 text-xs font-medium text-garnet-500">
                  Code promo invalide.
                </p>
              ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gold-300/50 pt-4 font-display text-lg font-bold text-garnet-800">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          {giftMessage && (
            <div className="mt-4 rounded-xl border-l-2 border-gold-400 bg-gold-50 px-3 py-2.5 text-sm text-honey-900/80">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
                Votre message
              </p>
              <p className="whitespace-pre-wrap">{giftMessage}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
