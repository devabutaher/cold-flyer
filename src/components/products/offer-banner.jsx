"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SCOPE_LABELS = {
  products: "Selected products only",
  services: "Selected services only",
  categories: "Selected categories only",
  brands: "Selected brands only",
};

function CouponCard({ coupon, t, onCopyCode }) {
  const discountLabel = coupon.discountType === "percentage"
    ? `${coupon.discountValue}% OFF`
    : coupon.discountType === "fixed"
      ? `৳${coupon.discountValue} OFF`
      : "Free Shipping";

  return (
    <div className="flex shrink-0 w-[260px] flex-col justify-between gap-2 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-3.5">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-primary-foreground">{discountLabel}</span>
          {coupon.minOrderValue > 0 && (
            <span className="text-xxs text-primary-foreground/60">Min ৳{coupon.minOrderValue.toLocaleString()}</span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-primary-foreground/70 leading-snug line-clamp-2">
          {coupon.description}
        </p>
        {coupon.applicableTo && coupon.applicableTo !== "all" && (
          <span className="mt-1 inline-block rounded bg-primary-foreground/10 px-1.5 py-0.5 text-xxxs font-medium text-primary-foreground/60 uppercase tracking-wider">
            {SCOPE_LABELS[coupon.applicableTo] || "Limited items"}
          </span>
        )}
        {coupon.firstOrderOnly && (
          <span className="mt-1 ml-1 inline-block rounded bg-green-500/20 px-1.5 py-0.5 text-xxxs font-medium text-green-300 uppercase tracking-wider">
            First order
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-1 rounded bg-primary-foreground/15 px-2 py-1">
          <span className="text-xxs font-bold text-primary-foreground/60">{t("useCode")}</span>
          <span className="text-xs font-extrabold tracking-wider text-primary-foreground">{coupon.code}</span>
        </div>
        <button
          onClick={() => onCopyCode(coupon.code)}
          className="rounded bg-primary-foreground/20 px-2 py-1 text-xxs font-bold text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
        >
          {t("copyCode")}
        </button>
      </div>
    </div>
  );
}

export default function OfferBanner() {
  const t = useTranslations("common");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coupons?limit=10")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.coupons) {
          setCoupons(res.data.coupons.filter((c) => c.showOnBanner !== false));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t("copied"));
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-primary to-inverted -mt-8">
        <div className="px-5 py-6 sm:px-7 sm:py-6 md:px-10 md:py-7">
          <Skeleton className="h-6 w-24 bg-white/20 mb-2" />
          <Skeleton className="h-8 w-64 bg-white/20 mb-1" />
          <Skeleton className="h-4 w-96 bg-white/20" />
        </div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-primary to-inverted -mt-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none">
            <circle cx="92%" cy="50%" r="80" fill="white" fillOpacity="0.06" />
            <circle cx="80%" cy="-10%" r="55" fill="white" fillOpacity="0.05" />
            <circle cx="5%" cy="80%" r="45" fill="white" fillOpacity="0.05" />
            <polygon points="0,0 28,0 0,28" fill="white" fillOpacity="0.07" transform="translate(16,16)" />
          </svg>
        </div>
        <div className="relative z-10 px-5 py-4 sm:px-7 sm:py-5 md:px-10 md:py-6">
          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-1.5 md:flex-row md:items-start md:gap-3 text-center md:text-left">
              <div>
                <Badge className="shrink-0 bg-background/20 text-primary-foreground uppercase text-xxs font-bold tracking-widest px-2.5 py-0.5">
                  {t("limitedTime")}
                </Badge>
                <div>
                  <div className="flex items-baseline gap-2 justify-center md:justify-start">
                    <span className="text-xl font-extrabold tracking-tight text-primary-foreground md:text-2xl">
                      {t("summerSale")}
                    </span>
                    <span className="text-lg font-black text-primary-foreground/90 md:text-xl">{t("twentyOff")}</span>
                    <span className="hidden md:inline-flex items-center rounded border-2 border-green-400 bg-green-500 px-1.5 py-px text-xxxs font-bold text-white rotate-2 leading-none">
                      {t("exclusive")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-primary-foreground/70 leading-snug max-w-md">{t("saleDesc")}</p>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="md" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-xs h-8 px-4">
                {t("shopNow")}
              </Button>
              <Button size="md" variant="outline" className="border-primary-foreground/40 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground font-bold text-xs h-8 px-4">
                {t("allDeals")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-primary to-inverted -mt-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" preserveAspectRatio="none">
          <circle cx="92%" cy="50%" r="80" fill="white" fillOpacity="0.06" />
          <circle cx="80%" cy="-10%" r="55" fill="white" fillOpacity="0.05" />
          <circle cx="5%" cy="80%" r="45" fill="white" fillOpacity="0.05" />
          <polygon points="0,0 28,0 0,28" fill="white" fillOpacity="0.07" transform="translate(16,16)" />
        </svg>
      </div>

      <div className="relative z-10 px-5 py-4 sm:px-7 sm:py-5 md:px-10 md:py-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <Badge className="bg-background/20 text-primary-foreground uppercase text-xxs font-bold tracking-widest px-2.5 py-0.5">
              {t("limitedTime")}
            </Badge>
            <h2 className="mt-1 text-lg font-extrabold text-primary-foreground md:text-xl">
              {t("activeOffers")}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button size="md" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-xs h-8 px-4">
              {t("shopNow")}
            </Button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-primary-foreground/20">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.code} coupon={coupon} t={t} onCopyCode={handleCopyCode} />
          ))}
        </div>
      </div>
    </div>
  );
}
