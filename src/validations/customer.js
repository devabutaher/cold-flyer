import { z } from "zod";

const STATUS_ENUM = ["active", "blocked"];
const SERVICE_ENUM = ["Installation", "Repair", "Maintenance", "Gas Fill", "Other"];

export const customerFormSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  company: z.string().optional(),
  address: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  unit: z.string().optional(),
  acTon: z.string().optional(),
  gasType: z.string().optional(),
  installDate: z.string().optional(),
  service: z.string().min(1, "Service type is required"),
  amount: z.coerce.number().min(0, "Amount cannot be negative").optional(),
  status: z.enum(STATUS_ENUM).optional(),
});
