"use client";

import { useCreateBooking } from "@/hooks/queries";
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
  city: z.string().min(1, "City is required"),
  addressLine1: z.string().min(1, "Address is required"),
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

const initialValues = {
  scheduledDate: new Date().toISOString().split("T")[0],
  scheduledTime: { start: "09:00", end: "19:00" },
  propertyType: "residential",
  issues: "",
  phone: "",
  city: "",
  addressLine1: "",
  notes: "",
};

export default function AddBookingForm({ serviceId, serviceName }) {
  const router = useRouter();
  const createBooking = useCreateBooking();

  const form = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(bookingFormSchema),
    mode: "onTouched",
  });

  const completedSections = useCompletedSections(form.control);

  async function onSubmit(values) {
    const payload = {
      service: serviceId,
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
      await createBooking.mutateAsync(payload);
      toast.success("Booking created successfully!");
      router.push("/dashboard/bookings");
    } catch (error) {
      toast.error(error.message || "Failed to create booking");
    }
  }

  function handleReset() {
    form.reset(initialValues);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormHeader completedSections={completedSections} />
      {serviceName && (
        <p className="text-sm text-muted-foreground mb-4 -mt-4">
          Booking:{" "}
          <span className="font-medium text-foreground">{serviceName}</span>
        </p>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <ScheduleSection control={form.control} />
        <PropertySection control={form.control} />
        <AddressSection control={form.control} />
        <NotesSection control={form.control} />
        <FormActions
          onReset={handleReset}
          isPending={createBooking.isPending}
          submitLabel="Confirm Booking"
        />
      </form>
    </div>
  );
}
