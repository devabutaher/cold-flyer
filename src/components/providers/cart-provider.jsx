/**
 * Cart Provider - SSR-safe hydration wrapper for Zustand cart store
 * Ensures cart is hydrated before rendering children
 */

"use client";

import { useCart } from "@/store/cart";
import { useEffect, useState } from "react";

export function CartProvider({ children }) {
  const { isHydrated, setHydrated } = useCart();

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}