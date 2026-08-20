import type { Metadata } from "next";
import { getOrdersFromSupabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/format";
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/payment";
import type { PaymentMethod, PaymentStatus } from "@/lib/types";
import PaymentStatusToggle from "@/components/admin/PaymentStatusToggle";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";

export const metadata: Metadata = {
  title: "Commandes — Les Douceurs de Roch Hachana",
  robots: { index: false, follow: false },
};

// Toujours réévaluée à chaque visite : on veut voir les commandes à jour.
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrdersFromSupabase();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
        Espace privé
      </span>
      <h1 className="mt-2 mb-8 font-display text-3xl font-bold text-garnet-800">
        Commandes
      </h1>

      {orders === null && (
        <p className="rounded-2xl border border-gold-300/50 bg-cream-100 p-6 text-honey-900/75">
          Impossible de charger les commandes pour le moment (Supabase non
          configuré ou indisponible).
        </p>
      )}

      {orders !== null && orders.length === 0 && (
        <p className="rounded-2xl border border-gold-300/50 bg-cream-100 p-6 text-honey-900/75">
          Aucune commande pour le moment.
        </p>
      )}

      {orders !== null && orders.length > 0 && (
        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <div
              key={order.order_number}
              className="rounded-2xl border border-gold-200/60 bg-cream-50 p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-200/50 pb-3">
                <span className="font-display text-lg font-bold text-garnet-800">
                  {order.order_number}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-honey-900/60">
                    {new Date(order.created_at).toLocaleString("fr-FR")}
                  </span>
                  <DeleteOrderButton orderNumber={order.order_number} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                    Client
                  </p>
                  <p className="mt-1 font-semibold text-garnet-900">
                    {order.customer_name}
                  </p>
                  <p className="text-sm text-honey-900/80">
                    <a href={`tel:${order.customer_phone}`} className="hover:text-garnet-700">
                      {order.customer_phone}
                    </a>
                  </p>
                  {order.customer_email && (
                    <p className="text-sm text-honey-900/80">{order.customer_email}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                    Réception
                  </p>
                  <p className="mt-1 text-sm text-honey-900/80">
                    {order.delivery_method === "livraison"
                      ? "Livraison à Paris"
                      : "Retrait 16ᵉ arrondissement"}
                  </p>
                  {order.delivery_street && (
                    <p className="text-sm text-honey-900/80">
                      {order.delivery_street}, {order.delivery_postal_code} Paris
                      {order.delivery_complement ? ` (${order.delivery_complement})` : ""}
                    </p>
                  )}
                  {order.pickup_notes && (
                    <p className="text-sm italic text-honey-900/70">
                      Remarque : {order.pickup_notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                  Produits
                </p>
                <ul className="mt-1 flex flex-col gap-0.5">
                  {order.items.map((item) => (
                    <li key={item.productId} className="text-sm text-honey-900/80">
                      {item.name} × {item.quantity} —{" "}
                      {formatPrice(item.price * item.quantity)}
                    </li>
                  ))}
                  {order.delivery_fee > 0 && (
                    <li className="text-sm text-honey-900/80">
                      Livraison — {formatPrice(order.delivery_fee)}
                    </li>
                  )}
                </ul>
              </div>

              {order.gift_message && (
                <div className="mt-4 rounded-xl border-l-2 border-gold-400 bg-gold-50 px-4 py-2.5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
                    Message cadeau
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-honey-900/80">
                    {order.gift_message}
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gold-200/50 pt-4">
                <div>
                  <p className="font-display text-lg font-bold text-garnet-800">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-honey-900/70">
                    {PAYMENT_METHOD_LABELS[order.payment_method as PaymentMethod]}
                  </p>
                </div>
                <PaymentStatusToggle
                  orderNumber={order.order_number}
                  status={order.payment_status as PaymentStatus}
                  label={PAYMENT_STATUS_LABELS[order.payment_status as PaymentStatus]}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
