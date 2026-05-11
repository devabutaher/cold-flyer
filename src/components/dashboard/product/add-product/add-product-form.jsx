"use client";

import { useCreateProduct } from "@/hooks/queries";
import { uploadImageAction } from "@/lib/actions/products";
import { productFormSchema } from "@/lib/schemas";
import { generateSlug, parseListInput, parseSpecs } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { DEFAULT_FORM_VALUES } from "@/data/product-form-constants";
import {
  BasicInfoSection,
  FeaturesSection,
  FormActions,
  FormHeader,
  PricingSection,
  ProductTypeSelector,
  SpecificationsSection,
} from "../product-form";

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
  tag: "None",
  features: "",
  inBox: "",
  images: [],
};

export default function AddProductForm({ isAdmin = false }) {
  const [productType, setProductType] = useState("unit");
  const [isUploading, setIsUploading] = useState(false);
  const createProduct = useCreateProduct();

  const form = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(productFormSchema),
    mode: "onTouched",
  });

  const completedSections = useCompletedSections(form.control);

  const checkAdminAccess = () => {
    if (!isAdmin) {
      toast.error("Access Denied: This action requires Administrator privileges.");
      return false;
    }
    return true;
  };

  function handleTypeChange(value) {
    setProductType(value);
    form.setValue("productType", value);
  }

  async function onSubmit(values) {
    if (!checkAdminAccess()) return;
    
    setIsUploading(true);

    try {
      const images = form.getValues("images") || [];
      const uploadedImages = await Promise.all(
        images.map((img) => uploadImageAction(img, "images")),
      );

      const features = parseListInput(values.features);
      const inBox = parseListInput(values.inBox);
      const specs = parseSpecs(form.getValues("specs"));

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
        tag: values.tag && values.tag !== "None" ? values.tag : undefined,
        onSale: values.tag === "Sale",
        features: features.length > 0 ? features : undefined,
        inBox: inBox.length > 0 ? inBox : undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
        specs: Object.keys(specs).length > 0 ? specs : undefined,
      };

      await createProduct.mutateAsync(payload);
      form.reset(initialValues);
    } catch (error) {
      console.error(error);
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
