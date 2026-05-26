import { z } from "zod";

const LABEL_ENUM = ["Home", "Work", "Other"];
const GENDER_ENUM = ["male", "female", "other"];

export const addressSchema = z.object({
  label: z.enum(LABEL_ENUM).optional(),
  isDefault: z.boolean().optional(),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  district: z.string().min(1, "District is required"),
  thana: z.string().min(1, "Thana is required"),
  address: z.string().min(1, "Address is required"),
  instructions: z.string().optional(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional().nullable(),
  gender: z.enum(GENDER_ENUM).optional().nullable(),
});
