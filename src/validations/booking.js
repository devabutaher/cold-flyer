import { z } from "zod";

export const bookingFormSchema = z.object({
  scheduledDate: z.string().min(1, "Date is required"),
  scheduledTime: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }),
  propertyType: z.string().optional(),
  issues: z.string().optional(),
  notes: z.string().optional(),
  acBrand: z.string().optional(),
  acModel: z.string().optional(),
  acTon: z.string().optional(),
  acGasType: z.string().optional(),
  acType: z.string().optional(),
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(1, "Phone is required"),
  customerEmail: z.string().optional(),
  guestAddress: z.string().optional(),
  guestDistrict: z.string().optional(),
  guestThana: z.string().optional(),
});

export const scheduleBookingSchema = z.object({
  scheduledDate: z.string().min(1, "Date is required"),
  scheduledTime: z.object({
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
  }),
});
