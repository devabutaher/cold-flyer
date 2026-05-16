"use client";

import { useTranslations } from "next-intl";
import PriceFormat from "../ui/price-format";

export function DetailPrice({ mode = "product", ...props }) {
  const t = useTranslations("common");
  if (mode === "service") {
    const { basePrice, priceType, showLabel } = props;

    const formatPrice = (price, priceType) => {
      if (priceType === "quote") return t("quoteBased");
      if (priceType === "hourly") return `৳${price}/hr`;
      return `৳${price?.toLocaleString()}`;
    };

    return (
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{formatPrice(basePrice, priceType)}</span>
          {showLabel && priceType !== "quote" && priceType !== "hourly" && (
            <span className="text-sm text-muted-foreground">{t("startingPrice")}</span>
          )}
          {priceType === "hourly" && <span className="text-sm text-muted-foreground">{t("hourlyRate")}</span>}
        </div>
      </div>
    );
  }

  const { originalPrice, salePrice, showSavePercentage } = props;

  return (
    <div className="mb-2">
      <PriceFormat
        originalPrice={originalPrice}
        salePrice={salePrice}
        showSavePercentage={showSavePercentage}
        className="text-3xl"
        classNameSalePrice="font-bold text-foreground"
        classNameOriginalPrice="text-lg"
        classNameSalePercentage="text-xs"
      />
    </div>
  );
}

export default DetailPrice;
