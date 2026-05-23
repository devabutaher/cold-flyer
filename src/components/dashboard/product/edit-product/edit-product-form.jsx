"use client";

import { useUpdateProduct } from "@/hooks/queries/products";
import { uploadImageAction } from "@/lib/actions/upload";
import { getProductInitialValues, productFormSchema } from "@/lib/schemas";
import { parseListInput, parseSpecs } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  BasicInfoSection,
  FeaturesSection,
  FormActions,
  FormHeader,
  PricingSection,
  ProductTypeSelector,
  SpecificationsSection,
} from "../product-form";

export default function EditProductForm({ product, isAdmin = false }) {
  const router = useRouter();
  const [productType, setProductType] = useState(product.productType || "unit");
  const [isUploading, setIsUploading] = useState(false);
  const updateProduct = useUpdateProduct();

  const form = useForm({
    defaultValues: getProductInitialValues(product),
    resolver: zodResolver(productFormSchema),
    mode: "onTouched",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const completedSections = form.watch(["name", "price", "stock"]).filter(Boolean).length;

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

      const newFiles = images.filter((img) => img.file);
      const existingImages = images.filter((img) => img.url && !img.file).map((img) => ({ url: img.url }));

      let uploadedImages = existingImages;

      if (newFiles.length > 0) {
        const newUploaded = await Promise.all(
          newFiles.map(async (img) => {
            const result = await uploadImageAction(img.file);
            if (!result.success) {
              toast.error(result.message || "Image upload failed");
              return null;
            }
            return result.data;
          })
        );
        uploadedImages = [...uploadedImages, ...newUploaded.filter(Boolean)];
      }

      const features = parseListInput(values.features);
      const inBox = parseListInput(values.inBox);
      const specs = parseSpecs(form.getValues("specs"));

      const payload = {
        name: values.name,
        slug: product.slug,
        sku: values.sku,
        description: values.description || `${values.name} - High quality product`,
        price: Number(values.price),
        originalPrice: values.originalPrice ? Number(values.originalPrice) : undefined,
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
      router.push("/dashboard/items");
    } catch (error) {
      console.error("Update product error:", error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormHeader completedSections={completedSections} title="Edit Product" />
      <ProductTypeSelector value={productType} onChange={handleTypeChange} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <BasicInfoSection control={form.control} />
        <PricingSection control={form.control} />
        <SpecificationsSection control={form.control} productType={productType} />
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
