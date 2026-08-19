"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import QuantityStepper from "@/components/QuantityStepper";
import { BasketIcon } from "@/components/Icons";

export default function CartPage() {
  const { items, updateQuantity, removeItem, hydrated } = useCart();

  const lines = items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter((l): l is { product: NonNullable<ReturnType<typeof getProductById>>; quantity: number } => l !== null);

  const total = lines.reduce(
    (sum, l) => sum + l.product.price * l.quantity,
    0
  );

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
          Parcourez notre catalogue pour choisir vos corbeilles cadeaux de
          Roch Hachana.
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
        Étape 1 sur 2
      </span>
      <h1 className="mt-2 mb-8 font-display text-3xl font-bold text-garnet-800">
        Votre panier
      </h1>

      <div className="flex flex-col gap-4">
        {lines.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center gap-4 rounded-2xl border border-gold-200/60 bg-cream-50 p-3 shadow-sm sm:p-4"
          >
            <Link
              href={`/produit/${product.slug}`}
              className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-200 sm:h-24 sm:w-24"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="flex flex-1 flex-col gap-1">
              <Link
                href={`/produit/${product.slug}`}
                className="font-display text-base font-semibold text-garnet-800 hover:text-garnet-700"
              >
                {product.name}
              </Link>
              <p className="text-sm text-honey-900/70">
                {formatPrice(product.price)} / unité
              </p>
              <button
                type="button"
                onClick={() => removeItem(product.id)}
                className="mt-1 w-fit text-xs font-medium text-garnet-500 underline underline-offset-2 hover:text-garnet-700"
              >
                Retirer
              </button>
            </div>

            <div className="flex flex-col items-end gap-2">
              <QuantityStepper
                value={quantity}
                onChange={(q) => updateQuantity(product.id, q)}
              />
              <p className="text-sm font-bold text-garnet-800">
                {formatPrice(product.price * quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-gold-300/50 bg-cream-100 p-6">
        <div className="flex items-center justify-between font-display text-lg font-bold text-garnet-800">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link
          href="/commande"
          className="inline-flex items-center justify-center rounded-full bg-garnet-900 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-cream-50 shadow-sm transition hover:bg-garnet-800 active:scale-[0.98]"
        >
          Passer la commande
        </Link>
        <Link
          href="/catalogue"
          className="text-center text-sm font-medium text-honey-900/70 hover:text-garnet-700"
        >
          ← Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
