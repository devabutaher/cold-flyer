import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  position: z.string().min(1, "Position is required"),
  experience: z.string().optional(),
  skills: z.string().optional(),
  coverLetter: z.string().optional(),
});
