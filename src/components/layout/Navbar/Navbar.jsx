"use client";

import { DesktopNav } from "@/components/layout/navbar/desktop-nav";
import { MobileNav } from "@/components/layout/navbar/mobile-nav";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavButtons, NavSearch } from "./shared";

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
          <Link href={"/"} className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-md">
              <Image
                src="/vercel.svg"
                width={200}
                height={200}
                alt="logo"
                className="w-4 h-4"
              />
            </div>

            <h1 className="font-bold text-xl font-sans">
              Cold<span className="text-primary">Flyer</span>
            </h1>
          </Link>
          <DesktopNav />
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <NavSearch />
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
