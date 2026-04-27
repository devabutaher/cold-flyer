"use client";
import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";

const PriceFormat = ({
  className,
  classNameOriginalPrice,
  classNameSalePercentage,
  classNameSalePrice,
  decimalScale = 2,
  decimalSeparator = ",",
  originalPrice,
  prefix = "$",
  salePrice,
  showSavePercentage = false,
  thousandSeparator = ".",
}) => {
  const isSale = salePrice !== undefined && salePrice < originalPrice;
  const savePercentage = isSale
    ? ((originalPrice - salePrice) / originalPrice) * 100
    : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {isSale ? (
        <>
          <NumericFormat
            value={originalPrice}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            decimalScale={decimalScale}
            prefix={prefix}
            displayType="text"
            className={cn(
              "font-semibold text-muted-foreground line-through",
              classNameOriginalPrice,
            )}
          />
          <NumericFormat
            value={salePrice}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            decimalScale={decimalScale}
            prefix={prefix}
            displayType="text"
            className={cn(
              "text-[length:inherit] font-semibold",
              classNameSalePrice,
            )}
          />
          {showSavePercentage && (
            <span
              className={cn(
                "rounded-sm bg-chart-4 text-muted p-1 text-sm font-semibold",
                classNameSalePercentage,
              )}
            >
              Save {Math.round(savePercentage)}%
            </span>
          )}
        </>
      ) : (
        <NumericFormat
          value={originalPrice}
          thousandSeparator={thousandSeparator}
          decimalSeparator={decimalSeparator}
          decimalScale={decimalScale}
          prefix={prefix}
          displayType="text"
          className={cn(
            "text-[length:inherit] font-semibold",
            classNameSalePrice,
          )}
        />
      )}
    </div>
  );
};

export default PriceFormat;
