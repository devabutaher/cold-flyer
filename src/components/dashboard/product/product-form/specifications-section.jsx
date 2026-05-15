"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { Controller } from "react-hook-form";

export function SpecificationsSection({ control, productType = "unit" }) {
  const unitSpecs = [
    { name: "capacity", label: "Capacity", placeholder: "2 Ton (24,000 BTU)" },
    { name: "voltage", label: "Voltage", placeholder: "220V / 50Hz" },
    { name: "powerInput", label: "Power Input", placeholder: "2,100W" },
    {
      name: "coverageArea",
      label: "Coverage Area",
      placeholder: "Up to 600 sq ft",
    },
    { name: "noiseLevel", label: "Noise Level", placeholder: "19 dB (indoor)" },
    { name: "refrigerant", label: "Refrigerant", placeholder: "R-32" },
    { name: "starRating", label: "Star Rating", placeholder: "5 Star" },
    {
      name: "compressorType",
      label: "Compressor Type",
      placeholder: "Twin Rotary Inverter",
    },
    { name: "dimensions", label: "Dimensions", placeholder: "98 × 35 × 22 cm" },
  ];

  const partSpecs = [
    { name: "filterClass", label: "Filter Class", placeholder: "HEPA H13" },
    { name: "dimensions", label: "Dimensions", placeholder: "30 × 25 cm" },
    { name: "packSize", label: "Pack Size", placeholder: "4 filters" },
    {
      name: "material",
      label: "Material",
      placeholder: "Nano-fiber + Silver Ion",
    },
    { name: "replaceEvery", label: "Replace Every", placeholder: "3 months" },
    { name: "weight", label: "Weight", placeholder: "180g (per filter)" },
  ];

  const specs = productType === "unit" ? unitSpecs : partSpecs;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Specifications</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {productType === "unit" ? "AC Unit" : "Part"} technical details
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specs.map(({ name, label, placeholder }) => (
            <Controller
              key={name}
              name={`specs.${name}`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Field>
                  <FieldLabel>{label}</FieldLabel>
                  <Input
                    {...field}
                    placeholder={placeholder}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </Field>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
