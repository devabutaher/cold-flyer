import { z } from "zod";

export const baseSchema = {
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  originalPrice: z.coerce.number().positive("Original price must be positive"),
  img: z.string().url("Must be a valid URL"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  sku: z.string().min(3, "SKU required"),
  brand: z.string().min(1, "Brand required"),
  category: z.string().min(1, "Category required"),
  warranty: z.string().min(1, "Warranty required"),
  rating: z.coerce.number().min(0).max(5),
  reviewCount: z.coerce.number().int().nonnegative(),
  tag: z.string().optional(),
  features: z.string().min(5, "Add at least one feature"),
  inBox: z.string().min(2, "Add at least one in-box item"),
};

export const unitsSchema = z.object({
  ...baseSchema,
  sub: z.string().min(5, "Subtitle required"),
  capacity: z.string().optional(),
  voltage: z.string().optional(),
  powerInput: z.string().optional(),
  coverageArea: z.string().optional(),
  noiseLevel: z.string().optional(),
  refrigerant: z.string().optional(),
  starRating: z.string().optional(),
  compressorType: z.string().optional(),
  unitDimensions: z.string().optional(),
});

export const partsSchema = z.object({
  ...baseSchema,
  compatibility: z.string().min(2, "Add at least one compatible model"),
  filterClass: z.string().optional(),
  dimensions: z.string().optional(),
  packSize: z.string().optional(),
  material: z.string().optional(),
  replaceEvery: z.string().optional(),
  weight: z.string().optional(),
});
