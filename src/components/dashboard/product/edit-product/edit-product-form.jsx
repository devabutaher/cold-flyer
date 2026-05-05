"use client";

import { useUpdateProduct } from "@/hooks/use-product-mutation";
import { parseListInput, parseSpecs, uploadImages } from "@/lib/image-upload";
import { generateSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  BasicInfoSection,
  FeaturesSection,
  FormActions,
  FormHeader,
  PricingSection,
  ProductTypeSelector,
  SpecificationsSection,
} from "../product-form";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(1, "Price is required"),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().optional(),
  productType: z.string().optional(),
  description: z.string().optional(),
  warranty: z.string().optional(),
  tag: z.string().optional(),
  features: z.string().optional(),
  inBox: z.string().optional(),
});

function getInitialValues(product) {
  return {
    name: product.name || "",
    sku: product.sku || "",
    brand: product.brand || "",
    category: product.category || "",
    description: product.description || "",
    price: product.price?.toString() || "",
    originalPrice: product.originalPrice?.toString() || "",
    stock: product.stock?.toString() || "",
    productType: product.productType || "unit",
    warranty: product.warranty || "",
    tag: product.tag || "None",
    features: product.features?.join("\n") || "",
    inBox: product.inBox?.join("\n") || "",
    images:
      product.images?.map((img) => ({ url: img.url, preview: img.url })) || [],
    specs: product.specs || {},
  };
}

export default function EditProductForm({ product }) {
  const router = useRouter();
  const [productType, setProductType] = useState(product.productType || "unit");
  const [isUploading, setIsUploading] = useState(false);
  const updateProduct = useUpdateProduct();

  const form = useForm({
    defaultValues: getInitialValues(product),
    resolver: zodResolver(productFormSchema),
    mode: "onTouched",
  });

  const completedSections = form
    .watch(["name", "price", "stock"])
    .filter(Boolean).length;

  function handleTypeChange(value) {
    setProductType(value);
    form.setValue("productType", value);
  }

  async function onSubmit(values) {
    setIsUploading(true);

    try {
      const images = form.getValues("images") || [];

      // Separate new files from existing URLs
      const newFiles = images.filter((img) => img.file);
      const existingImages = images
        .filter((img) => img.url && !img.file)
        .map((img) => ({ url: img.url }));

      let uploadedImages = existingImages;

      if (newFiles.length > 0) {
        const newUploaded = await uploadImages(newFiles);
        uploadedImages = [...uploadedImages, ...newUploaded];
      }

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

      await updateProduct.mutateAsync({ id: product._id, data: payload });
      toast.success(`"${values.name}" updated successfully!`);
      router.push("/dashboard/items");
    } catch (error) {
      console.error("Update product error:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleReset() {
    form.reset(getInitialValues(product));
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormHeader completedSections={completedSections} title="Edit Product" />
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
          onCancel={() => router.push("/dashboard/items")}
          isPending={updateProduct.isPending || isUploading}
          submitLabel="Update Product"
        />
      </form>
    </div>
  );
}
