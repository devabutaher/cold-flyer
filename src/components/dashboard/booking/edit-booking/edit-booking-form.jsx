"use client";

import { useEffect, useMemo, useState } from "react";
import { useUpdateBooking } from "@/hooks/queries/bookings";
import { parseListInput } from "@/lib/utils";
import { getAddressesAction, deleteAddressAction, setDefaultAddressAction } from "@/lib/actions/user";
import { AddressFormSheet } from "@/components/dashboard/profile/address-form-sheet";
import { AddressPicker } from "@/components/checkout/address-picker";
import { DISTRICTS, THANAS } from "@/data/bd-addresses";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { FormHeader, ScheduleSection, PropertySection, NotesSection } from "../booking-form";
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
  notes: z.string().optional(),
});

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
    notes: booking.notes || "",
  };
}

export default function EditBookingForm({ booking }) {
  const router = useRouter();
  const updateBooking = useUpdateBooking();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const effectiveSelectedId = useMemo(
    () => selectedAddressId || addresses.find((a) => a.isDefault)?._id || addresses[0]?._id || null,
    [selectedAddressId, addresses],
  );

  const selectedAddress = useMemo(
    () => addresses.find((a) => a._id === effectiveSelectedId) || null,
    [addresses, effectiveSelectedId],
  );

  useEffect(() => {
    getAddressesAction().then((result) => {
      if (result.success) {
        setAddresses(result.addresses);
      }
    });
  }, []);

  const form = useForm({
    defaultValues: getBookingInitialValues(booking),
    resolver: zodResolver(bookingFormSchema),
    mode: "onTouched",
  });

  const completedSections = useWatch({
    control: form.control,
    name: ["scheduledDate", "notes"],
  });

  const completedCount = useMemo(() => {
    let count = 0;
    if (completedSections[0]) count++;
    if (selectedAddress) count++;
    return count;
  }, [completedSections, selectedAddress]);

  async function refreshAddresses() {
    const result = await getAddressesAction();
    if (result.success) {
      setAddresses(result.addresses);
    }
  }

  async function handleAddressSaved() {
    await refreshAddresses();
    const result = await getAddressesAction();
    if (result.success && result.addresses.length > 0) {
      const last = result.addresses[result.addresses.length - 1];
      setSelectedAddressId(last._id);
    }
  }

  async function handleDeleteAddress(id) {
    const result = await deleteAddressAction(id);
    if (result.success) {
      if (effectiveSelectedId === id) setSelectedAddressId(null);
      await refreshAddresses();
    }
  }

  async function handleSetDefaultAddress(id) {
    await setDefaultAddressAction(id);
    setSelectedAddressId(id);
    await refreshAddresses();
  }

  async function onSubmit(values) {
    let serviceAddress;

    if (selectedAddress) {
      const districtName = DISTRICTS.find((d) => d.id === selectedAddress.district)?.name || selectedAddress.district;
      const thanaName = THANAS.find((t) => t.id === selectedAddress.thana)?.name || selectedAddress.thana;
      serviceAddress = {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        district: districtName,
        thana: thanaName,
        address: selectedAddress.address,
      };
    } else if (booking.serviceAddress) {
      serviceAddress = booking.serviceAddress;
    }

    const payload = {
      scheduledDate: values.scheduledDate,
      scheduledTime: values.scheduledTime,
      propertyDetails: {
        propertyType: values.propertyType,
        issues: values.issues ? parseListInput(values.issues) : [],
      },
      serviceAddress,
      notes: values.notes || undefined,
    };

    try {
      await updateBooking.mutateAsync({ id: booking._id, data: payload });
      router.push("/dashboard/bookings");
    } catch {}
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormHeader completedSections={completedCount} title="Edit Booking" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <ScheduleSection control={form.control} />
        <PropertySection control={form.control} />

        {booking.serviceAddress && (
          <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Current address:</span>{" "}
            {booking.serviceAddress.fullName || booking.serviceAddress.addressLine1 || booking.serviceAddress.address}
            {booking.serviceAddress.district ? `, ${booking.serviceAddress.district}` : ""}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-6">
          <AddressPicker
            addresses={addresses}
            effectiveSelectedId={effectiveSelectedId}
            onSelect={(id) => setSelectedAddressId(id)}
            onAdd={() => {
              setEditingAddress(null);
              setAddressSheetOpen(true);
            }}
            onEdit={(addr) => {
              setEditingAddress(addr);
              setAddressSheetOpen(true);
            }}
            onDelete={handleDeleteAddress}
            onSetDefault={handleSetDefaultAddress}
          />
        </div>

        <NotesSection control={form.control} />
        <FormActions
          onCancel={() => router.push("/dashboard/bookings")}
          isPending={updateBooking.isPending}
          submitLabel="Update Booking"
          showReset={false}
        />
      </form>

      <AddressFormSheet
        key={editingAddress?._id || "new"}
        open={addressSheetOpen}
        onOpenChange={setAddressSheetOpen}
        address={editingAddress}
        onSaved={handleAddressSaved}
      />
    </div>
  );
}
