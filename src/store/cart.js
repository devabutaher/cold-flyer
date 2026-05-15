/**
 * Zustand store for cart management
 * Simple hydration-safe state management with localStorage persistence
 * No middleware dependencies for maximum stability
 */

"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cold_flyer_cart";

// Pure state management without middleware
function createCartStore() {
  let items = [];
  let listeners = new Set();
  let hydrated = false;

  // Load from localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) items = JSON.parse(stored);
  } catch (e) {
    items = [];
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // Ignore storage errors
    }
  }

  function notify() {
    listeners.forEach((fn) => fn());
  }

  return {
    getItems: () => items,
    getItemCount: () => items.reduce((sum, item) => sum + item.quantity, 0),
    getSubtotal: () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    getTotal: (shippingCost = 60, vatRate = 0.05) => {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = shippingCost;
      const vat = subtotal * vatRate;
      return { subtotal, shipping, vat, total: subtotal + shipping + vat };
    },

    addItem: (product, quantity = 1) => {
      const productId = product.id || product._id || "";
      // Ensure we have a valid 24-char ObjectId
      if (!productId || productId.length < 20) {
        console.error("Invalid product ID:", productId);
        return;
      }

      const existingItem = items.find((item) => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        items.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          productId,
          productRef: productId,
          slug: product.slug,
          name: product.name,
          price: product.price,
          imageUrl: product.images?.[0]?.url || "",
          description: product.description || "",
          quantity,
        });
      }
      persist();
      notify();
    },

    updateQuantity: (id, quantity) => {
      if (quantity <= 0) {
        items = items.filter((item) => item.id !== id);
      } else {
        const item = items.find((item) => item.id === id);
        if (item) item.quantity = quantity;
      }
      persist();
      notify();
    },

    removeItem: (id) => {
      items = items.filter((item) => item.id !== id);
      persist();
      notify();
    },

    clearCart: () => {
      items = [];
      persist();
      notify();
    },

    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    hydrate: (savedItems) => {
      if (savedItems && savedItems.length > 0) {
        const existingIds = new Set(items.map((i) => i.id));
        for (const item of savedItems) {
          if (!existingIds.has(item.id)) {
            items.push(item);
          }
        }
        persist();
        notify();
      }
    },

    reset: () => {
      items = [];
      notify();
    },

    isHydrated: () => hydrated,
    setHydrated: (val) => {
      hydrated = val;
      notify();
    },
  };
}

const cartStore = createCartStore();

// React hook for using the cart
export function useCart() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return cartStore.subscribe(() => forceUpdate((n) => n + 1));
  }, []);

  return {
    items: cartStore.getItems(),
    itemCount: cartStore.getItemCount(),
    isHydrated: cartStore.isHydrated(),
    setHydrated: cartStore.setHydrated,
    addItem: cartStore.addItem,
    updateQuantity: cartStore.updateQuantity,
    removeItem: cartStore.removeItem,
    clearCart: cartStore.clearCart,
    getItemCount: cartStore.getItemCount,
    getSubtotal: cartStore.getSubtotal,
    getTotal: cartStore.getTotal,
  };
}

export function CartHydrationProvider({ children }) {
  return <>{children}</>;
}
