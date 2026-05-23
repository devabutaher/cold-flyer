"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Package } from "lucide-react";

export function OrderItemsList({ items }) {
  const t = useTranslations("checkout");

  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <div key={item._id} className="flex items-center gap-4 py-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover rounded-lg" />
            ) : (
              <Package size={18} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{t("qty", { count: item.quantity })}</p>
          </div>
          <p className="text-sm font-semibold text-foreground">
            ৳{(item.price * item.quantity).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
