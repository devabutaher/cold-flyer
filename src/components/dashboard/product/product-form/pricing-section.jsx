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
import { DollarSign } from "lucide-react";
import { Controller } from "react-hook-form";

export function PricingSection({ control }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Pricing & Stock</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Set your pricing and inventory
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="originalPrice"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Original Price (৳)</FieldLabel>
              <Input
                {...field}
                type="number"
                min={0}
                placeholder="2999"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="stock"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Stock Qty <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                type="number"
                min={0}
                placeholder="50"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </CardContent>
    </Card>
  );
}
