"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BadgeDollarSign } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";

function StockBadge({ stock }) {
  const num = Number(stock);
  if (!num || isNaN(num)) return null;

  const isLow = num > 0 && num <= 10;
  const isOut = num === 0;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium",
        isOut && "text-destructive",
        isLow && !isOut && "text-amber-600",
        !isLow && !isOut && "text-green-600",
      )}
    >
      <div
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isOut && "bg-destructive",
          isLow && !isOut && "bg-amber-500",
          !isLow && !isOut && "bg-green-500",
        )}
      />
      {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
    </div>
  );
}

function DiscountBadge({ price, originalPrice }) {
  const p = Number(price);
  const op = Number(originalPrice);
  if (!p || !op || op <= p) return null;
  const pct = Math.round(((op - p) / op) * 100);
  return (
    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-200">
      {pct}% off
    </span>
  );
}

export function PricingSection({ control }) {
  const [price, originalPrice, stock] = useWatch({
    control,
    name: ["price", "originalPrice", "stock"],
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <BadgeDollarSign className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Pricing & Inventory</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Set sale price, original price, and stock levels.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Controller
            name="price"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Sale Price (৳) <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder="2499"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="originalPrice"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Original Price (৳)</FieldLabel>
                <Input {...field} type="number" min={0} placeholder="2999" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="stock"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Stock Qty</FieldLabel>
                <Input {...field} type="number" min={0} placeholder="50" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Live indicators */}
          <div className="flex flex-col justify-end gap-1.5 pb-1">
            <StockBadge stock={stock} />
            <DiscountBadge price={price} originalPrice={originalPrice} />
          </div>
        </div>

        {/* Summary row */}
        {(price || originalPrice) && (
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground flex flex-wrap gap-x-6 gap-y-1">
            {originalPrice && (
              <span>
                MRP:{" "}
                <strong className="text-foreground">
                  ৳{Number(originalPrice).toLocaleString()}
                </strong>
              </span>
            )}
            {price && (
              <span>
                Selling:{" "}
                <strong className="text-foreground">
                  ৳{Number(price).toLocaleString()}
                </strong>
              </span>
            )}
            {price &&
              originalPrice &&
              Number(originalPrice) > Number(price) && (
                <span>
                  Savings:{" "}
                  <strong className="text-green-600">
                    ৳{(Number(originalPrice) - Number(price)).toLocaleString()}
                  </strong>
                </span>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
