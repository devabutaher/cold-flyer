"use client";

import { DesktopNav } from "@/components/layout/navbar/desktop-nav";
import { MobileNav } from "@/components/layout/navbar/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { NavSearch } from "./nav-search";
import { NavButtons } from "./shared";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";

function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="relative">
      <Button size="icon" variant="outline" className="relative overflow-hidden">
        <motion.div
          key={itemCount}
          initial={itemCount > 0 ? { scale: 1.3, rotate: -10 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <ShoppingCart size={20} />
        </motion.div>
      </Button>
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <Badge
              variant="default"
              className="absolute -right-1 -top-1 h-5 w-5 translate-x-1/3 -translate-y-1/3 justify-center p-0 text-xs"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}

export default function Navbar() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-transparent border-b transition-all duration-300", {
        "border-border bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/95 shadow-lg": scrolled,
      })}
    >
      <nav className="mx-auto flex h-14 w-full container items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <Logo />
          <DesktopNav />
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <Suspense fallback={<div className="w-48 h-8 bg-muted animate-pulse rounded" />}>
            <NavSearch />
          </Suspense>
          <LocaleSwitcher />
          <CartIcon />
          <NavButtons />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <CartIcon />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
