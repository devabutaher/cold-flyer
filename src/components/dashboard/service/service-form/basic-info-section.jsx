"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectWithOther } from "@/components/ui/select-with-other";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Info, Star } from "lucide-react";
import { Controller } from "react-hook-form";
import { ImageUploadField } from "./image-upload-field";

const CATEGORIES = [
  { value: "installation", label: "Installation" },
  { value: "maintenance", label: "Maintenance" },
  { value: "repair", label: "Repair" },
  { value: "support", label: "Support" },
];
const SERVICE_TYPES = [
  { value: "installation", label: "Installation" },
  { value: "preventative care", label: "Preventative Care" },
  { value: "efficiency tuning", label: "Efficiency Tuning" },
  { value: "rapid response", label: "Rapid Response" },
  { value: "repair", label: "Repair" },
  { value: "consultation", label: "Consultation" },
  { value: "emergency", label: "Emergency" },
  { value: "inspection", label: "Inspection" },
];

export function ServiceBasicInfoSection({ control }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Service Details</CardTitle>
            <CardDescription className="text-xs mt-0.5">Basic service information</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Service Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="e.g. AC Installation"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Category <span className="text-destructive">*</span>
                </FieldLabel>
                <SelectWithOther
                  options={CATEGORIES}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select category"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="serviceType"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Service Type <span className="text-destructive">*</span>
                </FieldLabel>
                <SelectWithOther
                  options={SERVICE_TYPES}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select type"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Service description..."
                rows={4}
              />
            </Field>
          )}
        />

        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <Star className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Featured service</p>
            <p className="text-xs text-muted-foreground">Show this service on the homepage carousel</p>
          </div>
          <Controller
            name="isFeatured"
            control={control}
            defaultValue={false}
            render={({ field }) => <Switch checked={field.value || false} onCheckedChange={field.onChange} />}
          />
        </div>

        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUploadField value={field.value || []} onChange={(newValue) => field.onChange(newValue ?? [])} />
          )}
        />
      </CardContent>
    </Card>
  );
}
