import { LinkItem, NavButtons } from "@/components/layout/navbar/shared";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { productLinks, serviceLinks } from "@/data/nav-links";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { NavSearch } from "./nav-search";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="lg:hidden"
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
        <Portal className="top-12 lg:hidden">
          <PortalBackdrop />
          <div
            className={cn(
              "size-full overflow-y-auto p-4 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/95 shadow-md",
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="flex w-full flex-col gap-y-6">
              {/* Search */}
              <Suspense
                fallback={
                  <div className="w-48 h-8 bg-muted animate-pulse rounded" />
                }
              >
                <div className="w-full lg:w-auto mt-6 lg:mt-0 h-12 grid place-items-center">
                  <NavSearch />
                </div>
              </Suspense>
              <div className="flex flex-col gap-y-5">
                {/* Product Links */}
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Products
                  </span>
                  <div className="grid gap-1">
                    {productLinks.map((link) => (
                      <LinkItem
                        className="rounded-lg p-2 hover:bg-muted active:bg-muted dark:active:bg-muted/50"
                        key={`product-${link.label}`}
                        {...link}
                      />
                    ))}
                  </div>
                </div>

                {/* Service Links */}
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Services
                  </span>
                  <div className="grid gap-1">
                    {serviceLinks.map((link) => (
                      <LinkItem
                        className="rounded-lg p-2 hover:bg-muted active:bg-muted dark:active:bg-muted/50"
                        key={`service-${link.label}`}
                        {...link}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Auth Buttons */}
              <div className="border-t pt-4">
                <NavButtons />
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
