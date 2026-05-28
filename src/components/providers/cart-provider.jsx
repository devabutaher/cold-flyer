/**
 * Cart Provider - SSR-safe hydration wrapper for Zustand cart store
 * Renders children immediately (SSR-safe), hydrates cart on mount
 */

"use client";

import { useCart } from "@/store/cart";
import { useEffect } from "react";

export function CartProvider({ children }) {
  const { setHydrated } = useCart();

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  return <>{children}</>;
}
