import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getProductById } from "@/lib/products";
import type {
  DeliveryMethod,
  Order,
  OrderInput,
  OrderItem,
  PaymentMethod,
} from "@/lib/types";
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from "@/lib/email";
import { DELIVERY_FEE } from "@/lib/config";
import { getPromoCode } from "@/lib/promo";
import { saveOrderToSupabase } from "@/lib/supabase";

// Codes postaux parisiens (75001 à 75020, + 75116 pour le 16ᵉ arrondissement).
const PARIS_POSTAL_CODE = /^(750(0[1-9]|1[0-9]|20)|75116)$/;

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

function generateOrderId(): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}`;
  // Suffixe alphanumérique de 6 caractères : le risque de collision entre
  // deux commandes est négligeable, même à fort volume le même jour.
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PR-${datePart}-${randomPart}`;
}

async function readOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]): Promise<void> {
  // Sur une plateforme serverless comme Vercel, le système de fichiers est en
  // lecture seule (sauf /tmp) : cette écriture échoue systématiquement en
  // production. C'est attendu — Supabase est la vraie base de données ;
  // data/orders.json n'est qu'une copie de secours utile en local. On ne
  // fait donc jamais échouer la commande si cette écriture est impossible.
  try {
    await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
  } catch (err) {
    console.warn(
      "[orders] Écriture locale (data/orders.json) impossible — normal sur Vercel/production :",
      err instanceof Error ? err.message : err
    );
  }
}

export async function POST(request: NextRequest) {
  let body: OrderInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const {
    customer,
    pickup,
    paymentMethod,
    deliveryMethod,
    deliveryAddress,
    items,
    giftMessage,
    promoCode,
  } = body ?? {};

  if (!customer?.name?.trim() || !customer?.phone?.trim()) {
    return NextResponse.json(
      { error: "Nom et téléphone sont requis." },
      { status: 400 }
    );
  }

  const validPaymentMethods: PaymentMethod[] = ["especes", "revolut"];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return NextResponse.json(
      { error: "Mode de paiement invalide." },
      { status: 400 }
    );
  }

  const validDeliveryMethods: DeliveryMethod[] = ["retrait", "livraison"];
  if (!validDeliveryMethods.includes(deliveryMethod)) {
    return NextResponse.json(
      { error: "Mode de réception invalide." },
      { status: 400 }
    );
  }

  // Renseignée uniquement quand deliveryMethod === "livraison" (validé ci-dessous).
  let validatedAddress: { street: string; postalCode: string; complement?: string } | undefined;

  if (deliveryMethod === "livraison") {
    const street = deliveryAddress?.street?.trim();
    const postalCode = deliveryAddress?.postalCode?.trim();
    if (!street || !postalCode) {
      return NextResponse.json(
        { error: "L'adresse de livraison (rue et code postal) est requise." },
        { status: 400 }
      );
    }
    if (!PARIS_POSTAL_CODE.test(postalCode)) {
      return NextResponse.json(
        {
          error:
            "La livraison n'est disponible qu'à Paris (codes postaux 75001 à 75020, ou 75116).",
        },
        { status: 400 }
      );
    }
    validatedAddress = {
      street,
      postalCode,
      complement: deliveryAddress?.complement?.trim() || undefined,
    };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Le panier est vide." },
      { status: 400 }
    );
  }

  // On recalcule les prix/noms côté serveur à partir du catalogue :
  // on ne fait jamais confiance aux prix envoyés par le client.
  const orderItems: OrderItem[] = [];
  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) continue;
    const quantity = Math.max(1, Math.min(99, Math.floor(item.quantity)));
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  if (orderItems.length === 0) {
    return NextResponse.json(
      { error: "Aucun produit valide dans le panier." },
      { status: 400 }
    );
  }

  // Le code promo n'est jamais fait confiance non plus : on le revalide
  // côté serveur à partir du catalogue de codes (lib/promo.ts).
  const appliedPromo = getPromoCode(promoCode);
  const promoAppliesToDelivery =
    deliveryMethod === "livraison" && appliedPromo?.freeDelivery === true;

  const itemsTotal = orderItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const deliveryFee =
    deliveryMethod === "livraison" && !promoAppliesToDelivery
      ? DELIVERY_FEE
      : 0;
  const total = itemsTotal + deliveryFee;

  const order: Order = {
    orderId: generateOrderId(),
    createdAt: new Date().toISOString(),
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || undefined,
    },
    pickup: {
      notes: pickup?.notes?.trim() || undefined,
    },
    paymentMethod,
    // Le paiement ne se fait jamais sur le site : toujours "en attente" à la
    // création. Le vendeur le passe à "paid" lui-même une fois encaissé
    // (espèces au retrait/à la livraison, ou virement Revolut reçu).
    paymentStatus: "pending",
    deliveryMethod,
    deliveryAddress: validatedAddress,
    deliveryFee,
    items: orderItems,
    total,
    giftMessage:
      typeof giftMessage === "string" && giftMessage.trim()
        ? giftMessage.trim().slice(0, 500)
        : undefined,
    promoCode: appliedPromo?.code,
  };

  // Fichier local : toujours écrit, sert de copie de secours (fonctionne
  // même si Supabase n'est pas encore configuré).
  const orders = await readOrders();
  orders.push(order);
  await writeOrders(orders);

  // Supabase est la base de données principale de la commande. Ni cette
  // écriture ni les emails ne font jamais échouer la commande : si l'un
  // d'eux n'est pas configuré ou échoue, on logue un avertissement et on
  // continue — la commande reste enregistrée dans data/orders.json.
  await saveOrderToSupabase(order);
  await sendOrderNotificationEmail(order);
  await sendOrderConfirmationEmail(order);

  return NextResponse.json(order, { status: 201 });
}
