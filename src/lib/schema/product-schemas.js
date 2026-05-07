import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  originalPrice: z.string().optional(),
  stock: z.string().optional(),
  productType: z.string().optional(),
  description: z.string().optional(),
  warranty: z.string().optional(),
  tag: z.string().optional(),
  features: z.string().optional(),
  inBox: z.string().optional(),
});

export function getProductInitialValues(product) {
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
    images: product.images?.map((img) => ({ url: img.url, preview: img.url })) || [],
    specs: product.specs || {},
  };
}