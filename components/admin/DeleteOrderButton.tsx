"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteOrderButton({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Supprimer définitivement la commande ${orderNumber} ?`)) {
      return;
    }

    startTransition(async () => {
      const res = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        window.alert("Échec de la suppression.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label={`Supprimer la commande ${orderNumber}`}
      title="Supprimer cette commande (test)"
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-honey-900/40 transition hover:bg-garnet-50 hover:text-garnet-600 disabled:opacity-40"
    >
      {isPending ? "…" : "✕"}
    </button>
  );
}
