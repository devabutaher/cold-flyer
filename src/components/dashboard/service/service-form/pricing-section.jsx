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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import { Controller } from "react-hook-form";

export function ServicePricingSection({ control }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Pricing & Duration</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Set price and service duration
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Controller
          name="basePrice"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Price (৳) <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                type="number"
                min={0}
                placeholder="1500"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="priceType"
          control={control}
          defaultValue="fixed"
          render={({ field }) => (
            <Field>
              <FieldLabel>Price Type</FieldLabel>
              <Select
                value={field.value ?? "fixed"}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="quote">Quote</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </CardContent>
    </Card>
  );
}
