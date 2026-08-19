import type { PaymentMethod, PaymentStatus } from "./types";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  especes: "Espèces au retrait",
  revolut: "Revolut",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "En attente de règlement",
  paid: "Payée",
};
