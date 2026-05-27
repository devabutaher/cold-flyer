"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectWithOther } from "@/components/ui/select-with-other";
import { Textarea } from "@/components/ui/textarea";
import { Wrench } from "lucide-react";
import { Controller } from "react-hook-form";

const AC_BRAND_OPTIONS = [
  "General (Gree)",
  "Walton",
  "Singer",
  "Samsung",
  "LG",
  "Panasonic",
  "Sharp",
  "Midea",
  "Toshiba",
  "Hitachi",
  "Daikin",
  "Mitsubishi",
  "Haier",
  "Electra",
  "Minister",
  "Vision",
];
const AC_TON_OPTIONS = ["1", "1.5", "2", "2.5", "3", "5"];
const GAS_TYPE_OPTIONS = ["R32", "R410A", "R22", "R290"];
const AC_TYPE_OPTIONS = ["split", "window", "central", "cassette", "ductable", "portable"];
const PROPERTY_TYPE_OPTIONS = ["residential", "commercial", "industrial", "apartment"];

export function ServiceDetailsSection({ control }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">AC Details</CardTitle>
            <CardDescription className="text-xs mt-0.5">Tell us about your AC unit</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="acBrand"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Field>
                <FieldLabel>Brand</FieldLabel>
                <SelectWithOther
                  options={AC_BRAND_OPTIONS}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select AC brand"
                />
              </Field>
            )}
          />

          <Controller
            name="acModel"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Field>
                <FieldLabel>Model</FieldLabel>
                <Input {...field} value={field.value ?? ""} placeholder="AC model number" />
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="acTon"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Field>
                <FieldLabel>Ton</FieldLabel>
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ton" />
                  </SelectTrigger>
                  <SelectContent>
                    {AC_TON_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t} Ton
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Controller
            name="acGasType"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Field>
                <FieldLabel>Gas Type</FieldLabel>
                <SelectWithOther
                  options={GAS_TYPE_OPTIONS}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select gas type"
                />
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="acType"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Field>
                <FieldLabel>AC Type</FieldLabel>
                <SelectWithOther
                  options={AC_TYPE_OPTIONS}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select AC type"
                />
              </Field>
            )}
          />

          <Controller
            name="propertyType"
            control={control}
            defaultValue="residential"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Property Type</FieldLabel>
                <SelectWithOther
                  options={PROPERTY_TYPE_OPTIONS}
                  value={field.value ?? "residential"}
                  onChange={field.onChange}
                  placeholder="Select type"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="issues"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Field>
              <FieldLabel>Issues (one per line)</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                placeholder="Describe any issues you're experiencing..."
                rows={3}
              />
            </Field>
          )}
        />
      </CardContent>
    </Card>
  );
}
