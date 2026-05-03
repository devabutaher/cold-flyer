"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ListChecks } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";

function LineCountBadge({ value, label }) {
  const count = value
    ? value
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean).length
    : 0;
  if (!count) return null;
  return (
    <span className="text-xs text-muted-foreground">
      {count} {label}
      {count !== 1 ? "s" : ""}
    </span>
  );
}

export function FeaturesSection({ control }) {
  const [features, inBox] = useWatch({ control, name: ["features", "inBox"] });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ListChecks className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Features & Box Contents</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              One item per line — used for the product detail page.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="features"
          control={control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Key Features</FieldLabel>
                <LineCountBadge value={features} label="feature" />
              </div>
              <Textarea
                {...field}
                placeholder={
                  "Inverter compressor technology\nWi-Fi & voice control\nSelf-cleaning mode\n5-star energy rating"
                }
                rows={5}
                className="resize-none font-mono text-xs leading-relaxed"
              />
            </Field>
          )}
        />

        <Controller
          name="inBox"
          control={control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>What&apos;s in the Box</FieldLabel>
                <LineCountBadge value={inBox} label="item" />
              </div>
              <Textarea
                {...field}
                placeholder={
                  "1× Indoor unit\n1× Outdoor unit\n1× Remote control\n2× AAA batteries"
                }
                rows={5}
                className="resize-none font-mono text-xs leading-relaxed"
              />
            </Field>
          )}
        />
      </CardContent>
    </Card>
  );
}
