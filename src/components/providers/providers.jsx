"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/providers/cart-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <QueryProvider>
          <CartProvider>
            <AuthProvider>
              <MotionConfig reducedMotion="user">{children}</MotionConfig>
              <Toaster />
            </AuthProvider>
          </CartProvider>
        </QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
