import { z } from "zod";

const CATEGORY_ENUM = [
  "rent",
  "utilities",
  "equipment",
  "transport",
  "salary",
  "marketing",
  "other",
  "maintenance",
  "office_supplies",
  "food",
];

export const expenseFormSchema = z.object({
  item: z.string().min(1, "Item description is required"),
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
  date: z.string().min(1, "Date is required"),
  category: z.enum(CATEGORY_ENUM).optional(),
});
