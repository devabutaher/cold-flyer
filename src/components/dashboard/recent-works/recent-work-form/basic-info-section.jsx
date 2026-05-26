"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, ImagePlus, Info, X } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { Controller } from "react-hook-form";

const CATEGORIES = ["Installation", "Maintenance", "Repair", "Commercial", "Residential"];

function FeaturedImageUpload({ value, onChange }) {
  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      onChange({ file, preview: URL.createObjectURL(file), url: null });
      e.target.value = "";
    },
    [onChange],
  );

  const handleRemove = useCallback(() => {
    if (value?.preview && value?.file) {
      URL.revokeObjectURL(value.preview);
    }
    onChange(null);
  }, [value, onChange]);

  return (
    <Field>
      <FieldLabel>Featured Image</FieldLabel>
      <div className="mt-2">
        {value?.preview || value?.url ? (
          <div className="relative w-full max-w-[300px] aspect-video rounded-lg overflow-hidden border">
            <Image src={value.preview || value.url} alt="Featured image" fill sizes="300px" className="object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 z-10"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full max-w-[300px] aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <ImagePlus className="h-8 w-8 text-muted-foreground mb-1" />
            <span className="text-sm text-muted-foreground">Upload featured image</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </label>
        )}
      </div>
    </Field>
  );
}

export function BasicInfoSection({ control, errors }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Basic Information</CardTitle>
            <CardDescription className="text-xs mt-0.5">Core project details</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="title"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Project Title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="e.g. Commercial AC Installation - Gulshan Office Tower"
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
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Category <span className="text-destructive">*</span>
                </FieldLabel>
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="clientName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Field>
                <FieldLabel>Client Name</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="e.g. Mirpur Shopping Complex"
                />
              </Field>
            )}
          />

          <Controller
            name="completionDate"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Field>
                <FieldLabel>Completion Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative cursor-pointer" role="button" tabIndex={0}>
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                      <Input readOnly value={field.value ? format(new Date(field.value + "T00:00:00"), "PP") : ""} placeholder="Pick a date" className="pl-10 cursor-pointer" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar mode="single" selected={field.value ? new Date(field.value + "T00:00:00") : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          />
        </div>

        <Controller
          name="excerpt"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Excerpt / Short Description</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Brief summary of the project..."
                rows={2}
              />
            </Field>
          )}
        />

        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Full Description <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Write detailed description of the project..."
                rows={8}
                className="min-h-[200px] font-mono text-sm"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="image"
          control={control}
          defaultValue={null}
          render={({ field }) => <FeaturedImageUpload value={field.value} onChange={field.onChange} />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="tags"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Field>
                <FieldLabel>Tags (comma separated)</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="e.g. commercial, installation, ducted"
                />
              </Field>
            )}
          />

          <Controller
            name="featured"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Field>
                <div className="flex items-center space-x-2 sm:pt-10 pt-2">
                  <Switch checked={field.value ?? false} onCheckedChange={field.onChange} id="featured" />
                  <Label htmlFor="featured">Featured Work</Label>
                </div>
              </Field>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
