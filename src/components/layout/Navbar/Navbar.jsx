"use client";

import { DesktopNav } from "@/components/layout/navbar/desktop-nav";
import { MobileNav } from "@/components/layout/navbar/mobile-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/ui/logo";
import { useCart } from "@/context/cart-context";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { NavSearch } from "./nav-search";
import { NavButtons } from "./shared";

export default function Navbar() {
  const scrolled = useScroll(10);
  const { itemCount } = useCart();

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
        "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/95 shadow-md":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-14 w-full container items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <Logo />
          <DesktopNav />
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <Suspense fallback={null}>
            <NavSearch />
          </Suspense>
          <Link href="/cart" className="relative">
            <Button size="icon" variant="outline">
              <ShoppingCart size={20} />
            </Button>
            {itemCount > 0 && (
              <Badge
                variant="default"
                className="absolute -right-1 -top-1 h-5 w-5 translate-x-1/3 -translate-y-1/3 justify-center p-0 text-xs"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
          </Link>
          <NavButtons />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/cart" className="relative">
            <Button size="icon" variant="outline">
              <ShoppingCart size={20} />
            </Button>
            {itemCount > 0 && (
              <Badge
                variant="default"
                className="absolute -right-1 -top-1 h-5 w-5 translate-x-1/3 -translate-y-1/3 justify-center p-0 text-xs"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
          </Link>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
