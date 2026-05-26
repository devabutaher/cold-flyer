import { z } from "zod";

const DISCOUNT_TYPE_ENUM = ["percentage", "fixed", "free_shipping"];
const APPLICABLE_TO_ENUM = ["all", "products", "categories", "brands", "services"];

export const couponFormSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .transform((v) => v.toUpperCase()),
  discountType: z.enum(DISCOUNT_TYPE_ENUM),
  discountValue: z.coerce.number().min(1, "Value is required"),
  maxDiscount: z.coerce.number().optional(),
  minOrderValue: z.coerce.number().optional(),
  maxUsage: z.coerce.number().optional(),
  validFrom: z.string().min(1, "Valid from date is required"),
  validUntil: z.string().min(1, "Valid until date is required"),
  applicableTo: z.enum(APPLICABLE_TO_ENUM).optional(),
  productIds: z.array(z.any()).optional(),
  serviceIds: z.array(z.any()).optional(),
  categoryIds: z.array(z.string()).optional(),
  brandIds: z.array(z.string()).optional(),
  firstOrderOnly: z.boolean().optional(),
  minItemCount: z.coerce.number().optional(),
  showOnBanner: z.boolean().optional(),
  excludedProductIds: z.array(z.any()).optional(),
  excludedCategoryIds: z.array(z.string()).optional(),
});
