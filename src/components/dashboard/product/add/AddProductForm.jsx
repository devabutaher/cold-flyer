"use client";

import { useCreateProduct } from "@/hooks/use-product-mutation";
import { generateSlug } from "@/lib/utils";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { DEFAULT_FORM_VALUES } from "@/data/product-form-constants";
import { BasicInfoSection } from "./BasicInfoSection";
import { FeaturesSection } from "./FeaturesSection";
import { FormActions } from "./FormActions";
import { FormHeader } from "./FormHeader";
import { PricingSection } from "./PricingSection";
import { ProductTypeSelector } from "./ProductTypeSelector";
import { SpecificationsSection } from "./SpecificationsSection";

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

const initialValues = {
  ...DEFAULT_FORM_VALUES,
  name: "",
  sku: "",
  brand: "",
  category: "",
  price: "",
  originalPrice: "",
  stock: "",
  description: "",
  warranty: "",
  features: "",
  inBox: "",
  images: [],
  specs: {},
};

export default function AddProductForm() {
  const [productType, setProductType] = useState("unit");
  const [isUploading, setIsUploading] = useState(false);
  const createProduct = useCreateProduct();

  const form = useForm({
    defaultValues: initialValues,
  });

  const completedSections = useCompletedSections(form.control);

  function handleTypeChange(value) {
    setProductType(value);
    form.setValue("productType", value);
  }

  async function onSubmit(values) {
    const features = values.features
      ? values.features
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const inBox = values.inBox
      ? values.inBox
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    if (
      !values.name ||
      !values.sku ||
      !values.price ||
      !values.category ||
      !values.brand
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUploading(true);

    try {
      let uploadedImages = [];
      const imageArray = values.images || [];

      if (imageArray.length > 0) {
        const imagesWithFiles = imageArray.filter((img) => img && img.file);

        if (imagesWithFiles.length > 0) {
          for (const img of imagesWithFiles) {
            const formData = new FormData();
            formData.append("image", img.file);

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload`,
              {
                method: "POST",
                body: formData,
              },
            );

            if (!response.ok) {
              throw new Error("Failed to upload image");
            }

            const data = await response.json();
            if (data.data?.url) {
              uploadedImages.push({ url: data.data.url });
            }
          }
        }
      }

      const specs = {};
      if (values.specs) {
        Object.entries(values.specs).forEach(([key, val]) => {
          if (val && val.trim()) {
            specs[key] = val.trim();
          }
        });
      }

      const payload = {
        name: values.name,
        slug: generateSlug(values.name),
        sku: values.sku,
        description:
          values.description || `${values.name} - High quality product`,
        price: Number(values.price),
        originalPrice: values.originalPrice
          ? Number(values.originalPrice)
          : undefined,
        stock: Number(values.stock) || 0,
        productType: values.productType || productType,
        category: values.category,
        brand: values.brand,
        warranty: values.warranty || undefined,
        features: features.length > 0 ? features : undefined,
        inBox: inBox.length > 0 ? inBox : undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
        specs: Object.keys(specs).length > 0 ? specs : undefined,
      };

      await createProduct.mutateAsync(payload);
      toast.success(`"${values.name}" added successfully!`);

      form.reset(initialValues);
    } catch (error) {
      toast.error(error.message || "Failed to add product");
    } finally {
      setIsUploading(false);
    }
  }

  function handleReset() {
    form.reset(initialValues);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormHeader completedSections={completedSections} />

      <ProductTypeSelector value={productType} onChange={handleTypeChange} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <BasicInfoSection control={form.control} />
        <PricingSection control={form.control} />
        <SpecificationsSection
          control={form.control}
          productType={productType}
        />
        <FeaturesSection control={form.control} />
        <FormActions
          onReset={handleReset}
          isPending={createProduct.isPending || isUploading}
        />
      </form>
    </div>
  );
}
