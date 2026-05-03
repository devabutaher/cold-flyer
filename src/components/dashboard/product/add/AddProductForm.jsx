"use client";

import slugify from "slugify";

import { useCreateProduct } from "@/hooks/use-product-mutation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { BasicInfoSection } from "./BasicInfoSection";
import { FeaturesSection } from "./FeaturesSection";
import { FormActions } from "./FormActions";
import { FormHeader } from "./FormHeader";
import { PricingSection } from "./PricingSection";
import { ProductTypeSelector } from "./ProductTypeSelector";
import { DEFAULT_FORM_VALUES } from "./product-form-constants";

function useCompletedSections(control) {
  const [name, price, stock] = useWatch({
    control,
    name: ["name", "price", "stock"],
  });

  let count = 0;
  if (name) count++;
  if (price) count++;
  if (stock) count++;
  return count;
}

export default function AddProductForm() {
  const [productType, setProductType] = useState("unit");
  const createProduct = useCreateProduct();

  const form = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const completedSections = useCompletedSections(form.control);

  function handleTypeChange(value) {
    setProductType(value);
    form.setValue("productType", value);
  }

  function onSubmit(values) {
    const features = values.features
      ? values.features.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

    const inBox = values.inBox
      ? values.inBox.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name: values.name,
      slug: slugify(values.name, { lower: true }) + "-" + Date.now(),
      sku: values.sku,
      description: values.description || `${values.name} - High quality product`,
      price: Number(values.price),
      originalPrice: values.originalPrice ? Number(values.originalPrice) : undefined,
      stock: Number(values.stock) || 0,
      productType: values.productType || productType,
      category: values.category,
      brand: values.brand,
      warranty: values.warranty || undefined,
      features: features.length > 0 ? features : undefined,
      inBox: inBox.length > 0 ? inBox : undefined,
      images: values.images && values.images.length > 0 ? values.images : undefined,
    };

    createProduct.mutate(payload, {
      onSuccess: () => {
        toast.success(`"${values.name}" added successfully!`);
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add product");
      },
    });
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:px-6">
      <FormHeader completedSections={completedSections} />

      <ProductTypeSelector value={productType} onChange={handleTypeChange} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <BasicInfoSection control={form.control} />
        <PricingSection control={form.control} />
        <FeaturesSection control={form.control} />
        <FormActions
          onReset={() => form.reset()}
          isPending={createProduct.isPending}
        />
      </form>
    </div>
  );
}