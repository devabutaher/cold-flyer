import { UserDropdown } from "@/components/auth/user-dropdown";
import { LinkItem, NavButtons } from "@/components/layout/navbar/shared";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { mainNavLinks, staticLinks } from "@/data/nav-links";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { NavSearch } from "./nav-search";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

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
              {/* Search & User */}
              <div className="flex items-center gap-2 w-full mt-6 lg:mt-0">
                <Suspense
                  fallback={
                    <div className="w-48 h-8 bg-muted animate-pulse rounded" />
                  }
                >
                  <div className="flex-1 lg:w-auto h-12 grid place-items-center">
                    <NavSearch />
                  </div>
                </Suspense>
                {user && (
                  <div className="shrink-0">
                    <UserDropdown user={user} />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-y-5">
                {mainNavLinks.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      {category.category}
                    </span>
                    <div className="grid gap-1">
                      {category.links.map((link) => (
                        <LinkItem
                          className="rounded-lg p-2 hover:bg-muted active:bg-muted dark:active:bg-muted/50"
                          key={`${category.category}-${link.label}`}
                          {...link}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Pages
                  </span>
                  <div className="grid gap-1">
                    {staticLinks.map((link) => (
                      <LinkItem
                        className="rounded-lg p-2 hover:bg-muted active:bg-muted dark:active:bg-muted/50"
                        key={link.label}
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
