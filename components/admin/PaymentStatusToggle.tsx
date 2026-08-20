"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PaymentStatus } from "@/lib/types";

export default function PaymentStatusToggle({
  orderNumber,
  status,
  label,
}: {
  orderNumber: string;
  status: PaymentStatus;
  label: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isPaid = status === "paid";

  const handleToggle = () => {
    setError(null);
    const nextStatus: PaymentStatus = isPaid ? "pending" : "paid";

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/orders/${orderNumber}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentStatus: nextStatus }),
        });
        if (!res.ok) throw new Error();
        router.refresh();
      } catch {
        setError("Échec de la mise à jour.");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <span
        className={
          "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide " +
          (isPaid
            ? "bg-gold-50 text-gold-700 border border-gold-300/60"
            : "bg-garnet-50 text-garnet-700 border border-garnet-200")
        }
      >
        {label}
      </span>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className="text-xs font-semibold text-garnet-600 underline underline-offset-2 hover:text-garnet-800 disabled:opacity-50"
      >
        {isPending
          ? "..."
          : isPaid
            ? "Marquer en attente"
            : "Marquer payée"}
      </button>
      {error && <span className="text-xs text-garnet-600">{error}</span>}
    </div>
  );
}
