import { NextRequest, NextResponse } from "next/server";
import { deleteOrderFromSupabase, updateOrderPaymentStatus } from "@/lib/supabase";

// Protégée par proxy.ts (identifiant + mot de passe), au même titre que
// /admin. Ne jamais retirer cette route du matcher du proxy.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;

  let body: { paymentStatus?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  if (body.paymentStatus !== "pending" && body.paymentStatus !== "paid") {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const ok = await updateOrderPaymentStatus(orderNumber, body.paymentStatus);
  if (!ok) {
    return NextResponse.json(
      { error: "Échec de la mise à jour (Supabase non configuré ou indisponible)." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;

  const ok = await deleteOrderFromSupabase(orderNumber);
  if (!ok) {
    return NextResponse.json(
      { error: "Échec de la suppression (Supabase non configuré ou indisponible)." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
