"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { SelectWithOther } from "@/components/ui/select-with-other";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";
import { Controller } from "react-hook-form";

const PROPERTY_TYPE_OPTIONS = ["residential", "commercial", "industrial", "apartment"];

export function PropertySection({ control }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Property Details</CardTitle>
            <CardDescription className="text-xs mt-0.5">Tell us about the property</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
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
