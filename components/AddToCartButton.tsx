"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import QuantityStepper from "./QuantityStepper";
import { CheckCircleIcon } from "./Icons";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(productId, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <QuantityStepper value={quantity} onChange={setQuantity} />
      <button
        type="button"
        onClick={handleAdd}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-garnet-900 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream-50 shadow-sm transition hover:bg-garnet-800 active:scale-[0.98] sm:flex-none"
      >
        {justAdded ? (
          <>
            <CheckCircleIcon className="h-4 w-4 text-gold-300" />
            Ajouté au panier
          </>
        ) : (
          "Ajouter au panier"
        )}
      </button>
    </div>
  );
}
