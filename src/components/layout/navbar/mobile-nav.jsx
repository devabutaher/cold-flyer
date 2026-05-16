"use client";

import { useTranslations, useLocale } from "next-intl";
import { UserDropdown } from "@/components/auth/user-dropdown";
import { LinkItem, NavButtons } from "@/components/layout/navbar/shared";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { getData } from "@/data";
import { cn } from "@/lib/utils";
import { animations } from "@/lib/animation";
import { MenuIcon, XIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavSearch } from "./nav-search";

export function MobileNav() {
  const t = useTranslations("common");
  const locale = useLocale();
  const mainNavLinks = getData("mainNavLinks", locale);
  const staticLinks = getData("staticLinks", locale);
  const [open, setOpen] = useState(false);
  const { backendUser } = useAuth();

  return (
    <div className="lg:hidden">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          aria-controls="mobile-menu"
          aria-expanded={open}
          aria-label={t("toggleMenu")}
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          size="icon"
          variant="outline"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <XIcon />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MenuIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <Portal className="top-12 lg:hidden">
            <PortalBackdrop />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "size-full overflow-y-auto p-4 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/95 shadow-md",
              )}
            >
              <motion.div
                className="flex w-full flex-col gap-y-6"
                variants={animations.stagger.fast}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="flex items-center gap-2 w-full mt-6 lg:mt-0"
                  variants={animations.entrance.fadeUp}
                >
                  <Suspense fallback={<div className="w-48 h-8 bg-muted animate-pulse rounded" />}>
                    <div className="flex-1 lg:w-auto h-12 grid place-items-center">
                      <NavSearch />
                    </div>
                  </Suspense>
                  {backendUser && (
                    <div className="shrink-0">
                      <UserDropdown />
                    </div>
                  )}
                </motion.div>
                <div className="flex flex-col gap-y-5">
                  {mainNavLinks.map((category, ci) => (
                    <motion.div key={category.category} className="space-y-2" variants={animations.entrance.fadeUp}>
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
                    </motion.div>
                  ))}
                  <motion.div className="space-y-2" variants={animations.entrance.fadeUp}>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("pages")}</span>
                    <div className="grid gap-1">
                      {staticLinks.map((link) => (
                        <LinkItem
                          className="rounded-lg p-2 hover:bg-muted active:bg-muted dark:active:bg-muted/50"
                          key={link.label}
                          {...link}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
                <motion.div className="border-t pt-4" variants={animations.entrance.fadeUp}>
                  <NavButtons />
                </motion.div>
              </motion.div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
}
