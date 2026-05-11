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
import { Controller } from "react-hook-form";

export function ServiceDetailsSection({ control }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ListChecks className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Service Details</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              What&apos;s included and requirements (one per line)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="includes"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Includes</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Professional installation&#10;All necessary materials&#10;1 year warranty"
                rows={5}
              />
            </Field>
          )}
        />

        <Controller
          name="exclusions"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Exclusions</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Electrical wiring&#10;Wall mounting brackets"
                rows={5}
              />
            </Field>
          )}
        />

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Requirements</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Power outlet within 3m&#10;Clear workspace"
                rows={5}
              />
            </Field>
          )}
        />

        <Controller
          name="qualifications"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Qualifications</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Certified technician&#10;3+ years experience"
                rows={5}
              />
            </Field>
          )}
        />
      </CardContent>
    </Card>
  );
}