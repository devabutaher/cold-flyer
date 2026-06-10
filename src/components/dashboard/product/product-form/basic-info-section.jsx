"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectWithOther } from "@/components/ui/select-with-other";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getPageContent } from "@/lib/content";
import { Info, Star } from "lucide-react";
import { Controller } from "react-hook-form";
import { ImageUploadField } from "./image-upload-field";

export function BasicInfoSection({ control }) {
  const formConstants = getPageContent("product-form-constants", "en");
  const BRANDS = formConstants.BRANDS;
  const CATEGORIES = formConstants.CATEGORIES;
  const TAGS = formConstants.TAGS;
  const WARRANTIES = formConstants.WARRANTIES;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Basic Information</CardTitle>
            <CardDescription className="text-xs mt-0.5">Core product details</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Product Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="e.g. Arctic V2 Condenser"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="sku"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  SKU <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="CF-ARC-V2-2024"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="brand"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Brand <span className="text-destructive">*</span>
                </FieldLabel>
                <SelectWithOther
                  options={BRANDS}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select brand"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="category"
            control={control}
            defaultValue=""
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
            name="warranty"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Field>
                <FieldLabel>Warranty</FieldLabel>
                <SelectWithOther
                  options={WARRANTIES}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Select warranty"
                />
              </Field>
            )}
          />

          <Controller
            name="tag"
            control={control}
            defaultValue="None"
            render={({ field }) => (
              <Field>
                <FieldLabel>Tag</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    {TAGS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>

        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Enter product description..."
                rows={3}
              />
            </Field>
          )}
        />

        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <Star className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Featured product</p>
            <p className="text-xs text-muted-foreground">Show this product on the homepage carousel</p>
          </div>
          <Controller
            name="featured"
            control={control}
            defaultValue={false}
            render={({ field }) => <Switch checked={field.value || false} onCheckedChange={field.onChange} />}
          />
        </div>

        <Controller
          name="images"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <ImageUploadField value={field.value || []} onChange={(newValue) => field.onChange(newValue ?? [])} />
          )}
        />
      </CardContent>
    </Card>
  );
}
