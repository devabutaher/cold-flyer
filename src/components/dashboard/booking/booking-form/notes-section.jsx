"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { Controller } from "react-hook-form";

export function NotesSection({ control }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Additional Notes</CardTitle>
            <CardDescription className="text-xs mt-0.5">Anything else we should know?</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Controller
          name="notes"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Field>
              <FieldLabel>Notes</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                placeholder="Any special instructions or requests..."
                rows={3}
              />
            </Field>
          )}
        />
      </CardContent>
    </Card>
  );
}
