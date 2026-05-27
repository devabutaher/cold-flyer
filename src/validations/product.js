import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price is required"),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0).optional(),
  productType: z.enum(["unit", "part"]).optional(),
  description: z.string().optional(),
  warranty: z.string().optional(),
  tag: z.enum(["Sale", "New", "Hot", "Featured", "None"]).optional(),
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
    price: product.price ?? "",
    originalPrice: product.originalPrice ?? "",
    stock: product.stock ?? "",
    productType: product.productType || "unit",
    warranty: product.warranty || "",
    tag: product.tag || "None",
    featured: product.featured || false,
    features: product.features?.join("\n") || "",
    inBox: product.inBox?.join("\n") || "",
    images: (product.images || []).filter((img) => img?.url).map((img) => ({ url: img.url, preview: img.url })),
    specs: product.specs || {},
  };
}
