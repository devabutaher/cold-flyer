import { z } from "zod";

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