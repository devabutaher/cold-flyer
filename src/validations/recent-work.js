import { z } from "zod";

const CATEGORY_ENUM = ["Installation", "Maintenance", "Repair", "Commercial", "Residential"];

export const recentWorkFormSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  category: z.enum(CATEGORY_ENUM, { required_error: "Category is required" }),
  description: z.string().min(1, "Description is required"),
  excerpt: z.string().optional(),
  clientName: z.string().optional(),
  completionDate: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean().optional(),
  image: z.any().optional(),
});
