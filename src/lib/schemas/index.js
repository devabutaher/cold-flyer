/**
 * Zod schemas for form validation
 * Consolidated from src/lib/schema/*.js
 */

import { z } from "zod";

// --- Auth Schemas ---

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createAccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .optional()
    .or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// --- Product Schemas ---

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

/**
 * @param {any} product
 * @returns {Object}
 */
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
    images:
      product.images?.map((img) => ({ url: img.url, preview: img.url })) || [],
    specs: product.specs || {},
  };
}

// --- Service Schemas ---

export const serviceFormSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  category: z.string().min(1, "Category is required"),
  serviceType: z.string().min(1, "Service type is required"),
  description: z.string().optional(),
  priceType: z.string().optional(),
  basePrice: z.string().min(1, "Price is required"),
  includes: z.string().optional(),
  exclusions: z.string().optional(),
  requirements: z.string().optional(),
  qualifications: z.string().optional(),
});