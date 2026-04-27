"use client";;
import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";

const PriceFormat_Basic = ({
  className,
  decimalScale = 2,
  decimalSeparator = ",",
  prefix = "$",
  thousandSeparator = ".",
  value,
}) => {
  return (
    <NumericFormat
      value={value}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      decimalScale={decimalScale}
      prefix={prefix}
      displayType="text"
      className={cn("text-lg font-medium", className)} />
  );
};

export default PriceFormat_Basic;
