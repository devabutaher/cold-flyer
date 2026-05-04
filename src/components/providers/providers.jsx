"use client";

import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }) {
  return (
    <TooltipProvider>
      <QueryProvider>
        <CartProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </CartProvider>
      </QueryProvider>
    </TooltipProvider>
  );
}