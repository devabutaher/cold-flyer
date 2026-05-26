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
});

export const scheduleBookingSchema = z.object({
  scheduledDate: z.string().min(1, "Date is required"),
  scheduledTime: z.object({
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
  }),
});
