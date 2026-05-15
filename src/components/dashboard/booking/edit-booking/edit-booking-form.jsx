"use client";

import { useUpdateBooking } from "@/hooks/queries";
import { parseListInput } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  FormHeader,
  ScheduleSection,
  PropertySection,
  AddressSection,
  NotesSection,
} from "../booking-form";
import { FormActions } from "../../product/product-form";
import { useRouter } from "next/navigation";

const bookingFormSchema = z.object({
  scheduledDate: z.string().min(1, "Date is required"),
  scheduledTime: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }),
  propertyType: z.string().optional(),
  issues: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  addressLine1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  notes: z.string().optional(),
});

function useCompletedSections(control) {
  const [date, address, city] = useWatch({
    control,
    name: ["scheduledDate", "addressLine1", "city"],
  });

  let count = 0;
  if (date) count++;
  if (address) count++;
  if (city) count++;
  return count;
}

function getBookingInitialValues(booking) {
  return {
    scheduledDate: booking.scheduledDate
      ? new Date(booking.scheduledDate).toISOString()
      : new Date().toISOString().split("T")[0],
    scheduledTime: {
      start: booking.scheduledTime?.start || "09:00",
      end: booking.scheduledTime?.end || "19:00",
    },
    propertyType: booking.propertyDetails?.propertyType || "residential",
    issues: (booking.propertyDetails?.issues || []).join("\n"),
    phone: booking.serviceAddress?.phone || "",
    addressLine1: booking.serviceAddress?.addressLine1 || "",
    city: booking.serviceAddress?.city || "",
    notes: booking.notes || "",
  };
}

export default function EditBookingForm({ booking, isAdmin = false }) {
  const router = useRouter();
  const updateBooking = useUpdateBooking();

  const form = useForm({
    defaultValues: getBookingInitialValues(booking),
    resolver: zodResolver(bookingFormSchema),
    mode: "onTouched",
  });

  const completedSections = useCompletedSections(form.control);

  async function onSubmit(values) {
    const payload = {
      scheduledDate: values.scheduledDate,
      scheduledTime: values.scheduledTime,
      propertyDetails: {
        propertyType: values.propertyType,
        issues: values.issues ? parseListInput(values.issues) : [],
      },
      serviceAddress: {
        phone: values.phone,
        addressLine1: values.addressLine1,
        city: values.city,
      },
      notes: values.notes || undefined,
    };

    try {
      await updateBooking.mutateAsync({ id: booking._id, data: payload });
      toast.success("Booking updated successfully!");
      router.push("/dashboard/bookings");
    } catch (error) {
      toast.error(error.message || "Failed to update booking");
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormHeader completedSections={completedSections} title="Edit Booking" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <ScheduleSection control={form.control} />
        <PropertySection control={form.control} />
        <AddressSection control={form.control} />
        <NotesSection control={form.control} />
        <FormActions
          onCancel={() => router.push("/dashboard/bookings")}
          isPending={updateBooking.isPending}
          submitLabel="Update Booking"
          showReset={false}
        />
      </form>
    </div>
  );
}
