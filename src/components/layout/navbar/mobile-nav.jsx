"use client";

import { LinkItem, NavButtons } from "@/components/layout/navbar/shared";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { productLinks } from "@/data/nav-links";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { NavSearch } from "./nav-search";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        <div
          className={cn(
            "transition-all",
            open ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
        >
          <XIcon />
        </div>
        <div
          className={cn(
            "absolute transition-all",
            open ? "scale-0 opacity-0" : "scale-100 opacity-100",
          )}
        >
          <MenuIcon />
        </div>
      </Button>
      {open && (
        <Portal className="top-14 md:hidden">
          <PortalBackdrop />
          <div
            className={cn(
              "size-full overflow-y-auto p-4",
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="flex w-full flex-col gap-y-2">
              <Suspense fallback={null}>
                <NavSearch />
              </Suspense>
              <span className="text-sm">Product</span>
              {productLinks.map((link) => (
                <LinkItem
                  className="rounded-lg p-2 active:bg-muted dark:active:bg-muted/50"
                  key={`product-${link.label}`}
                  {...link}
                />
              ))}
            </div>
            <NavButtons />
          </div>
        </Portal>
      )}
    </div>
  );
}
