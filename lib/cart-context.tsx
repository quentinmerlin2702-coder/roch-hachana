"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { CartItem } from "./types";

// Panier partagé, stocké en dehors de React (module singleton) et synchronisé
// avec localStorage. On utilise useSyncExternalStore plutôt qu'un
// useState + useEffect : cela évite un rendu "vide" suivi d'un
// setState post-hydratation, et fonctionne nativement avec le SSR de Next.js
// (le serveur voit toujours un panier vide via getServerSnapshot).

const STORAGE_KEY = "paniers-rosh-cart";
const EMPTY_ITEMS: CartItem[] = [];

let items: CartItem[] = [];
let didLoadFromStorage = false;
const listeners = new Set<() => void>();

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function ensureLoaded() {
  if (didLoadFromStorage || typeof window === "undefined") return;
  didLoadFromStorage = true;
  items = loadFromStorage();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // stockage indisponible (navigation privée, quota...) : on ignore.
  }
}

function setItems(next: CartItem[]) {
  items = next;
  persist();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartItem[] {
  ensureLoaded();
  return items;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

export function useCart() {
  const currentItems = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const addItem = useCallback((productId: string, quantity = 1) => {
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      setItems(
        items.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      setItems([...items, { productId, quantity }]);
    }
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(items.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(items.filter((i) => i.productId !== productId));
      return;
    }
    setItems(
      items.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => currentItems.reduce((sum, i) => sum + i.quantity, 0),
    [currentItems]
  );

  return {
    items: currentItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    // "hydrated" reste utile aux pages pour ne pas afficher "panier vide"
    // avant d'avoir pu lire le localStorage côté client.
    hydrated: didLoadFromStorage,
  };
}
