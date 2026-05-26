"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/providers/cart-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <QueryProvider>
          <CartProvider>
            <AuthProvider>
              <AnimatePresence mode="popLayout">{children}</AnimatePresence>
              <Toaster />
            </AuthProvider>
          </CartProvider>
        </QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
