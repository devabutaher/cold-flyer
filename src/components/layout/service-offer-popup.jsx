"use client";

import { useEffect, useState } from "react";
import { Snowflake, CheckCircle2, ArrowRight, Phone } from "lucide-react";
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
import { cn } from "@/lib/utils";

const PHONE_NUMBER = "09612-345678";
const STORAGE_KEY = "service-offer-dismissed";
const DISMISS_DAYS = 7;
const SHOW_DELAY_MS = 10000;

const OFFERS = [
  { key: "1", icon: CheckCircle2 },
  { key: "2", icon: CheckCircle2 },
  { key: "3", icon: CheckCircle2 },
];

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Snowflake size={28} className="text-primary" />
          </div>
          <DialogTitle className="text-xl">{t("serviceOfferTitle")}</DialogTitle>
          <DialogDescription className="text-base">
            {t("serviceOfferSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {OFFERS.map((offer) => (
            <div
              key={offer.key}
              className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-3"
            >
              <offer.icon
                size={20}
                className="mt-0.5 shrink-0 text-primary"
              />
              <div>
                <p className="text-sm font-semibold">
                  {t(`serviceOffer${offer.key}Title`)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(`serviceOffer${offer.key}Desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {t("serviceOfferTrust")}
        </p>

        <Link href="/services" onClick={handleDismiss}>
          <Button size="lg" className="w-full gap-2">
            {t("bookService")}
            <ArrowRight size={16} />
          </Button>
        </Link>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Phone size={14} />
          <span>{t("orCallUs", { number: PHONE_NUMBER })}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
