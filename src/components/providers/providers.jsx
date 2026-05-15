/**
 * Root Providers - Wraps the entire application
 * Combines QueryProvider, CartProvider, AuthProvider, and UI providers
 */

"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/providers/cart-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

export function Providers({ children }) {
  return (
    <TooltipProvider>
      <QueryProvider>
        <CartProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </CartProvider>
      </QueryProvider>
    </TooltipProvider>
  );
}
