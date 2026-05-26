import { z } from "zod";

const CATEGORY_ENUM = ["Maintenance", "Buying Guide", "Smart Home", "Tips", "News"];

export const blogFormSchema = z.object({
  title: z.string().min(1, "Blog title is required"),
  category: z.enum(CATEGORY_ENUM, { required_error: "Category is required" }),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
  featured: z.boolean().optional(),
  image: z.any().optional(),
});
