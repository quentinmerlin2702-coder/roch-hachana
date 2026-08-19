import { CURRENCY_SYMBOL } from "./config";

export function formatPrice(price: number): string {
  return `${price.toLocaleString("fr-FR")} ${CURRENCY_SYMBOL}`;
}
