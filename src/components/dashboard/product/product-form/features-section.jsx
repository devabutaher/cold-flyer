"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ListChecks } from "lucide-react";
import { Controller } from "react-hook-form";

export function FeaturesSection({ control }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ListChecks className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Features & In the Box</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              List features and included items (one per line)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="features"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Field>
              <FieldLabel>Features</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Energy Efficient&#10;Smart Inverter&#10;Wi-Fi Enabled"
                rows={5}
              />
            </Field>
          )}
        />

        <Controller
          name="inBox"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Field>
              <FieldLabel>In the Box</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Indoor Unit&#10;Outdoor Unit&#10;Remote Control"
                rows={5}
              />
            </Field>
          )}
        />
      </CardContent>
    </Card>
  );
}
