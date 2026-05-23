"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export function OrderSummary({ order, submitting, selectedAddress, onPlaceOrder }) {
  const t = useTranslations("checkout");

  const { subtotal, discount, shippingCost, tax, total } = useMemo(() => {
    const s = order.subtotal || order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const d = order.couponDiscount || order.discount || 0;
    const ship = order.shippingCost || 0;
    const tx = order.tax || 0;
    return {
      subtotal: s,
      discount: d,
      shippingCost: ship,
      tax: tx,
      total: s - d + ship + tx,
    };
  }, [order]);

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">{t("orderSummary")}</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal ({order.itemCount || order.items.length} items)</span>
            <span className="font-medium text-foreground">৳{subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{t("coupon", { code: order.appliedCoupon?.code || "" })}</span>
              <span className="font-medium">-৳{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>{t("shippingCost")}</span>
            <span className="font-medium text-foreground">৳{shippingCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{t("vat")}</span>
            <span className="font-medium text-foreground">৳{Math.round(tax).toLocaleString()}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">{t("total")}</span>
          <span className="text-xl font-extrabold text-primary">৳{Math.round(total).toLocaleString()}</span>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={onPlaceOrder} disabled={submitting || !selectedAddress}>
        {submitting ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            {t("processing")}
          </span>
        ) : (
          `Place Order - ৳${Math.round(total).toLocaleString()}`
        )}
      </Button>
    </>
  );
}
