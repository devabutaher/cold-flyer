"use client";

import { UserDropdown } from "@/components/auth/user-dropdown";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { LinkItem, NavButtons, ThemeToggle } from "@/components/layout/navbar/shared";
import { useAuth } from "@/components/providers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getData } from "@/data";
import { MenuIcon, Package, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import { NavSearch } from "./nav-search";

export function MobileNav() {
  const t = useTranslations("common");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const primaryLinks = getData("primaryLinks", locale);
  const moreLinks = getData("moreLinks", locale);
  const { backendUser } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="xl:hidden" aria-label={t("toggleMenu")}>
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" open={open} className="flex w-full flex-col p-0 sm:max-w-sm" showCloseButton={false}>
        {/* Header */}
        <SheetHeader className="border-b border-border px-4 pb-3 pt-4">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">Navigation Menu</SheetDescription>
          <div className="flex items-center justify-between gap-3">
            <Logo />
            <SheetClose asChild>
              <Button
                size="icon"
                variant="outline"
                className="transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <XIcon size={20} />
              </Button>
            </SheetClose>
          </div>

          {/* Search + UserDropdown in same row */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1">
              <Suspense fallback={<div className="h-9 w-full animate-pulse rounded-lg bg-muted" />}>
                <NavSearch />
              </Suspense>
            </div>
            {backendUser && <UserDropdown />}
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1 px-3 py-3">
            <div className="grid gap-0.5">
              <LinkItem
                label={navT("products")}
                href="/items"
                icon={<Package size={16} />}
                className="rounded-lg px-3 py-2.5 hover:bg-muted active:bg-muted"
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="grid gap-0.5">
              {primaryLinks.map((link) => (
                <LinkItem
                  key={link.href}
                  {...link}
                  className="rounded-lg px-3 py-2.5 hover:bg-muted active:bg-muted"
                  onClick={() => setOpen(false)}
                />
              ))}
            </div>

            <Accordion type="single" collapsible>
              <AccordionItem value="more" className="border-none">
                <AccordionTrigger className="w-full rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted hover:no-underline">
                  {navT("more")}
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="grid gap-0.5 pl-2">
                    {moreLinks.map((link) => (
                      <LinkItem
                        key={link.href}
                        {...link}
                        className="rounded-lg px-3 py-2.5 hover:bg-muted active:bg-muted"
                        onClick={() => setOpen(false)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Footer: locale + auth actions */}
        <div className="border-t border-border px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {navT("language")}/{navT("theme")}
            </span>
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
          <NavButtons context="mobile" onClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
