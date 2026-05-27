"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DISTRICTS, getThanas } from "@/data/bd-addresses";
import { Controller, useWatch } from "react-hook-form";

export function AddressFields({ control, namePrefix = "" }) {
  const districtName = `${namePrefix}District`;
  const thanaName = `${namePrefix}Thana`;
  const addressName = `${namePrefix}Address`;

  const selectedDistrict = useWatch({ control, name: districtName });

  const thanas = selectedDistrict ? getThanas(selectedDistrict) : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name={districtName}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Field>
              <FieldLabel>District</FieldLabel>
              <SearchableSelect
                options={DISTRICTS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select district"
                searchPlaceholder="Search district..."
              />
            </Field>
          )}
        />

        <Controller
          name={thanaName}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Field>
              <FieldLabel>Thana</FieldLabel>
              <SearchableSelect
                options={thanas}
                value={field.value}
                onChange={field.onChange}
                placeholder={selectedDistrict ? "Select thana" : "Select district first"}
                searchPlaceholder="Search thana..."
              />
            </Field>
          )}
        />
      </div>

        <Controller
          name={addressName}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Field>
              <FieldLabel>Address</FieldLabel>
              <textarea
                {...field}
                value={field.value ?? ""}
                placeholder="Street, building, area"
                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 resize-y"
                rows={3}
              />
            </Field>
          )}
        />
    </div>
  );
}
