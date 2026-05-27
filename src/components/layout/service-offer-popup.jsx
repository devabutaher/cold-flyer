"use client";

import { useEffect, useState } from "react";
import { Snowflake, ArrowRight, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "service-offer-dismissed";
const DISMISS_DAYS = 1;
const SHOW_DELAY_MS = 30000;

export function ServiceOfferPopup() {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const dismissedAt = parseInt(stored, 10);
      const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DAYS) return;
    }

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleDismiss(); setOpen(o); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Snowflake size={24} className="text-primary" />
          </div>
          <DialogTitle className="text-lg">{t("serviceOfferTitle")}</DialogTitle>
          <DialogDescription>
            {t("serviceOfferSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 pt-1">
          <Link href="/services" onClick={handleDismiss} className="flex-1">
            <Button size="lg" className="w-full gap-2">
              {t("bookService")}
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/contact" onClick={handleDismiss} className="flex-1">
            <Button size="lg" variant="outline" className="w-full gap-2">
              <Phone size={16} />
              {t("contactUs")}
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
