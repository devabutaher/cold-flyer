import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price is required"),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().nonnegative("Stock is required"),
  productType: z.enum(["unit", "part", "accessory"]),
  sub: z.string().optional(),
  description: z.string().optional(),
  warranty: z.string().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.object({
    url: z.string(),
    publicId: z.string().optional(),
    isPrimary: z.boolean().optional(),
  })).optional(),
});