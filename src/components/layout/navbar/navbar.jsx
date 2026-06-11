"use client";

import { DesktopNav } from "@/components/layout/navbar/desktop-nav";
import { MobileNav } from "@/components/layout/navbar/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { NavSearch } from "./nav-search";
import { NavButtons } from "./shared";

function CartIcon() {
  const { itemCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // avoid synchronous setState inside effect to prevent cascading renders
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Link href="/cart" className="relative">
      <Button size="icon" variant="outline" className="relative overflow-hidden">
        {mounted ? (
          <motion.div
            key={itemCount}
            initial={itemCount > 0 ? { scale: 1.3, rotate: -10 } : false}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <ShoppingCart size={20} />
          </motion.div>
        ) : (
          <ShoppingCart size={20} />
        )}
      </Button>
      {mounted && (
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.div
              className="absolute -right-1.5 -top-2.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Badge variant="default" className="h-4 min-w-4 px-1 justify-center p-0 text-xxs leading-none text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Link>
  );
}

export default function Navbar() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300",
        scrolled &&
          "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/95 shadow-lg",
      )}
    >
      <nav className="container mx-auto flex h-14 w-full items-center justify-between px-4">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-5">
          <Logo />
          {/* Desktop nav only shown on xl+ */}
          <DesktopNav />
        </div>

        {/* Right: Desktop actions */}
        <div className="hidden xl:flex items-center gap-2">
          <Suspense fallback={<div className="h-8 w-48 animate-pulse rounded bg-muted" />}>
            <NavSearch />
          </Suspense>
          <LocaleSwitcher />
          <CartIcon />
          <NavButtons context="desktop" />
        </div>

        {/* Right: Tablet + Mobile actions */}
        <div className="flex xl:hidden items-center gap-2">
          {/* Search visible on tablet (md+), hidden on small mobile */}
          <div className="hidden sm:block">
            <Suspense fallback={<div className="h-8 w-32 animate-pulse rounded bg-muted" />}>
              <NavSearch />
            </Suspense>
          </div>
          <CartIcon />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
