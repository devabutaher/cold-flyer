"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Banknote, Check, CreditCard, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function PaymentMethodSelector({ value, onChange }) {
  const t = useTranslations("checkout");

  const providers = useMemo(() => [
    { value: "stripe", label: t("card"), icon: CreditCard },
    { value: "sslcommerz", label: t("sslcommerz"), icon: Smartphone },
    { value: "cod", label: t("cod"), icon: Banknote },
  ], [t]);

  return (
    <div className="grid gap-1.5">
      {providers.map((p) => {
        const Icon = p.icon;
        const selected = value === p.value;
        return (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(p.value)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
              selected
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border text-muted-foreground hover:border-muted-foreground/30",
            )}
          >
            <Icon size={16} />
            <span className="flex-1">{p.label}</span>
            {selected && <Check size={14} className="text-primary" />}
          </button>
        );
      })}
    </div>
  );
}
