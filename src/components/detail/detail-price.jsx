"use client";

import PriceFormat from "../ui/price-format";

export function DetailPrice({ mode = "product", ...props }) {
  if (mode === "service") {
    const { basePrice, priceType, showLabel } = props;

    const formatPrice = (price, priceType) => {
      if (priceType === "quote") return "Quote Based";
      if (priceType === "hourly") return `৳${price}/hr`;
      return `৳${price?.toLocaleString()}`;
    };

    return (
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{formatPrice(basePrice, priceType)}</span>
          {showLabel && priceType !== "quote" && priceType !== "hourly" && (
            <span className="text-sm text-muted-foreground">Starting Price</span>
          )}
          {priceType === "hourly" && <span className="text-sm text-muted-foreground">Hourly Rate</span>}
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
