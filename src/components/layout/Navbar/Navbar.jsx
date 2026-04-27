"use client";

import { DesktopNav } from "@/components/layout/navbar/desktop-nav";
import { MobileNav } from "@/components/layout/navbar/mobile-nav";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { Suspense } from "react";
import { NavSearch } from "./nav-search";
import { NavButtons } from "./shared";

export default function Navbar() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
        "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/90":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-14 w-full container items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <Logo />
          <DesktopNav />
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Suspense fallback={null}>
            <NavSearch />
          </Suspense>
          <Button>
            <ShoppingCart />
          </Button>
          <NavButtons />
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
