import { z } from "zod";

const CATEGORY_ENUM = ["installation", "maintenance", "repair", "support"];
const SERVICE_TYPE_ENUM = [
  "installation", "preventative_care", "efficiency_tuning",
  "rapid_response", "repair", "consultation", "emergency", "inspection",
];
const PRICE_TYPE_ENUM = ["fixed", "hourly", "quote"];

export const serviceFormSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  category: z.enum(CATEGORY_ENUM, { required_error: "Category is required" }),
  serviceType: z.enum(SERVICE_TYPE_ENUM, { required_error: "Service type is required" }),
  description: z.string().optional(),
  priceType: z.enum(PRICE_TYPE_ENUM).optional(),
  basePrice: z.coerce.number().min(0, "Price is required"),
  includes: z.string().optional(),
  exclusions: z.string().optional(),
  requirements: z.string().optional(),
  qualifications: z.string().optional(),
});
