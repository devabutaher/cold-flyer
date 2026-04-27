"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PART_CATEGORIES,
  TAG_OPTIONS,
  UNIT_CATEGORIES,
  WARRANTIES,
} from "@/data/add-product-data";
import { partsSchema, unitsSchema } from "@/lib/product-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

// Helper to parse newline-separated strings into arrays
const parseLines = (str) =>
  str
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const AddProductForm = ({ onAddUnit, onAddPart, unitsCount, partsCount }) => {
  const [productType, setProductType] = useState("units");

  const schema = productType === "parts" ? partsSchema : unitsSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price: "",
      originalPrice: "",
      img: "",
      stock: "",
      sku: "",
      brand: "",
      category: "",
      warranty: "",
      rating: "",
      reviewCount: "",
      tag: "none",
      features: "",
      inBox: "",
      // units-specific
      sub: "",
      capacity: "",
      voltage: "",
      powerInput: "",
      coverageArea: "",
      noiseLevel: "",
      refrigerant: "",
      starRating: "",
      compressorType: "",
      unitDimensions: "",
      // parts-specific
      compatibility: "",
      filterClass: "",
      dimensions: "",
      packSize: "",
      material: "",
      replaceEvery: "",
      weight: "",
    },
  });

  const { formState } = form;

  function onSubmit(values) {
    const id =
      productType === "parts" ? `p${partsCount + 1}` : `u${unitsCount + 1}`;

    const commonFields = {
      id,
      tag: values.tag === "none" ? null : values.tag,
      name: values.name,
      price: values.price,
      originalPrice: values.originalPrice,
      img: values.img,
      stock: values.stock,
      sku: values.sku,
      brand: values.brand,
      category: values.category,
      warranty: values.warranty,
      rating: values.rating,
      reviewCount: values.reviewCount,
      features: parseLines(values.features),
      inBox: parseLines(values.inBox),
    };

    if (productType === "parts") {
      const newPart = {
        ...commonFields,
        compatibility: parseLines(values.compatibility),
        specs: {
          filterClass: values.filterClass,
          dimensions: values.dimensions,
          packSize: values.packSize,
          material: values.material,
          replaceEvery: values.replaceEvery,
          weight: values.weight,
        },
      };
      onAddPart(newPart);
      toast.success(`Part "${values.name}" added successfully!`);
    } else {
      const newUnit = {
        ...commonFields,
        sub: values.sub,
        specs: {
          capacity: values.capacity,
          voltage: values.voltage,
          powerInput: values.powerInput,
          coverageArea: values.coverageArea,
          noiseLevel: values.noiseLevel,
          refrigerant: values.refrigerant,
          starRating: values.starRating,
          compressorType: values.compressorType,
          dimensions: values.unitDimensions,
        },
      };
      onAddUnit(newUnit);
      toast.success(`AC Unit "${values.name}" added successfully!`);
    }

    form.reset();
  }

  const err = (name) => formState.errors[name];

  return (
    <div className="w-full">
      {/* ── Header + Toggle ── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Add Product</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details to add a new product to your catalog.
          </p>
        </div>

        {/* Type toggle */}
        <div className="flex items-center rounded-lg border border-border bg-muted p-1 gap-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setProductType("units");
              form.reset();
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              productType === "units"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AC Units
          </button>
          <button
            type="button"
            onClick={() => {
              setProductType("parts");
              form.reset();
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              productType === "parts"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AC Parts
          </button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ════════════════════════════════════════
            SECTION 1 — Basic Information
            ════════════════════════════════════════ */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b border-border">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div className="sm:col-span-2 lg:col-span-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Product Name *</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      className="bg-background"
                      placeholder="e.g. Nano Filter 4-Pack"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Tag */}
            <Controller
              name="tag"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tag">Tag</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="tag" className="bg-background">
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {TAG_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* Subtitle (units only) */}
            {productType === "units" && (
              <div className="sm:col-span-2 lg:col-span-3">
                <Controller
                  name="sub"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="sub">Subtitle *</FieldLabel>
                      <Input
                        {...field}
                        id="sub"
                        className="bg-background"
                        placeholder="e.g. Ultra-quiet 18 SEER energy efficiency"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            )}

            {/* SKU */}
            <Controller
              name="sku"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sku">SKU *</FieldLabel>
                  <Input
                    {...field}
                    id="sku"
                    className="bg-background"
                    placeholder="CF-PRT-NF4-2024"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Brand */}
            <Controller
              name="brand"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="brand">Brand *</FieldLabel>
                  <Input
                    {...field}
                    id="brand"
                    className="bg-background"
                    placeholder="e.g. ColdFlyer"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Category */}
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="category">Category *</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="category"
                      aria-invalid={fieldState.invalid}
                      className="bg-background"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(productType === "parts"
                        ? PART_CATEGORIES
                        : UNIT_CATEGORIES
                      ).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Warranty */}
            <Controller
              name="warranty"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="warranty">Warranty *</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="warranty"
                      aria-invalid={fieldState.invalid}
                      className="bg-background"
                    >
                      <SelectValue placeholder="Select warranty" />
                    </SelectTrigger>
                    <SelectContent>
                      {WARRANTIES.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Image URL */}
            <div className="sm:col-span-2 lg:col-span-2">
              <Controller
                name="img"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="img">Image URL *</FieldLabel>
                    <Input
                      {...field}
                      id="img"
                      className="bg-background"
                      placeholder="https://images.unsplash.com/..."
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 — Pricing & Inventory
            ════════════════════════════════════════ */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b border-border">
            Pricing &amp; Inventory
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="price">Price ($) *</FieldLabel>
                  <Input
                    {...field}
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="bg-background"
                    placeholder="48"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="originalPrice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="originalPrice">
                    Original Price ($) *
                  </FieldLabel>
                  <Input
                    {...field}
                    id="originalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="bg-background"
                    placeholder="60"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="stock"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stock">Stock *</FieldLabel>
                  <Input
                    {...field}
                    id="stock"
                    type="number"
                    min="0"
                    className="bg-background"
                    placeholder="120"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="rating"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="rating">Rating (0–5) *</FieldLabel>
                  <Input
                    {...field}
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    className="bg-background"
                    placeholder="4.6"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="reviewCount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reviewCount">Review Count *</FieldLabel>
                  <Input
                    {...field}
                    id="reviewCount"
                    type="number"
                    min="0"
                    className="bg-background"
                    placeholder="312"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 3 — Features & Contents
            ════════════════════════════════════════ */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b border-border">
            Features &amp; Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="features"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="features">Features *</FieldLabel>
                  <Textarea
                    {...field}
                    id="features"
                    className="resize-none bg-background"
                    placeholder={
                      "HEPA H13 nano-fiber material\nCaptures 99.97% of PM2.5\nWashable & reusable"
                    }
                    rows={5}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>One feature per line</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="inBox"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="inBox">In the Box *</FieldLabel>
                  <Textarea
                    {...field}
                    id="inBox"
                    className="resize-none bg-background"
                    placeholder={"4× Nano Filters\nInstallation Guide"}
                    rows={5}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>One item per line</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Parts only: compatibility */}
            {productType === "parts" && (
              <div className="sm:col-span-2">
                <Controller
                  name="compatibility"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="compatibility">
                        Compatibility *
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="compatibility"
                        className="resize-none bg-background"
                        placeholder={
                          "Arctic V2 Condenser\nMistral-7 Split System\nArctic Flow Pro"
                        }
                        rows={3}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>
                        One compatible model per line
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 4 — Specifications
            (fields differ between parts / units)
            ════════════════════════════════════════ */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b border-border">
            Specifications
          </h2>

          {productType === "parts" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "filterClass",
                  label: "Filter Class",
                  placeholder: "HEPA H13",
                },
                {
                  name: "dimensions",
                  label: "Dimensions",
                  placeholder: "30 × 25 cm",
                },
                {
                  name: "packSize",
                  label: "Pack Size",
                  placeholder: "4 filters",
                },
                {
                  name: "material",
                  label: "Material",
                  placeholder: "Nano-fiber + Silver Ion",
                },
                {
                  name: "replaceEvery",
                  label: "Replace Every",
                  placeholder: "3 months",
                },
                {
                  name: "weight",
                  label: "Weight",
                  placeholder: "180g (per filter)",
                },
              ].map(({ name, label, placeholder }) => (
                <Controller
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={name}>{label}</FieldLabel>
                      <Input
                        {...field}
                        id={name}
                        className="bg-background"
                        placeholder={placeholder}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "capacity",
                  label: "Capacity",
                  placeholder: "2 Ton (24,000 BTU)",
                },
                {
                  name: "voltage",
                  label: "Voltage",
                  placeholder: "220V / 50Hz",
                },
                {
                  name: "powerInput",
                  label: "Power Input",
                  placeholder: "2,100W",
                },
                {
                  name: "coverageArea",
                  label: "Coverage Area",
                  placeholder: "Up to 600 sq ft",
                },
                {
                  name: "noiseLevel",
                  label: "Noise Level",
                  placeholder: "19 dB (indoor)",
                },
                {
                  name: "refrigerant",
                  label: "Refrigerant",
                  placeholder: "R-32",
                },
                {
                  name: "starRating",
                  label: "Star Rating",
                  placeholder: "5 Star",
                },
                {
                  name: "compressorType",
                  label: "Compressor Type",
                  placeholder: "Twin Rotary Inverter",
                },
                {
                  name: "unitDimensions",
                  label: "Dimensions",
                  placeholder: "98 × 35 × 22 cm",
                },
              ].map(({ name, label, placeholder }) => (
                <Controller
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={name}>{label}</FieldLabel>
                      <Input
                        {...field}
                        id={name}
                        className="bg-background"
                        placeholder={placeholder}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-4 border-t border-border">
          <Button type="submit" className="sm:w-auto">
            Add {productType === "parts" ? "Part" : "AC Unit"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="sm:w-auto"
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
