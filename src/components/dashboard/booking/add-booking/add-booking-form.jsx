"use client";

import { useEffect, useMemo, useState } from "react";
import { useCreateBooking } from "@/hooks/queries/bookings";
import { parseListInput } from "@/lib/utils";
import { getAddressesAction, deleteAddressAction, setDefaultAddressAction } from "@/lib/actions/user";
import { AddressFormSheet } from "@/components/dashboard/profile/address-form-sheet";
import { AddressPicker } from "@/components/checkout/address-picker";
import { DISTRICTS, THANAS } from "@/data/bd-addresses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { FormHeader, ScheduleSection, PropertySection, NotesSection } from "../booking-form";
import { FormActions } from "../../product/product-form";
import { useRouter } from "next/navigation";

import { bookingFormSchema } from "@/validations";

const initialValues = {
  scheduledDate: new Date().toISOString().split("T")[0],
  scheduledTime: { start: "09:00", end: "19:00" },
  propertyType: "residential",
  issues: "",
  notes: "",
};

export default function AddBookingForm({ serviceId, serviceName }) {
  const router = useRouter();
  const createBooking = useCreateBooking();

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
        setSelectedAddressId((prev) => {
          if (prev) return prev;
          return result.addresses.find((a) => a.isDefault)?._id || result.addresses[0]?._id || null;
        });
      }
    });
  }, []);

  const form = useForm({
    defaultValues: initialValues,
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
    if (!selectedAddress) return;

    const districtName = DISTRICTS.find((d) => d.id === selectedAddress.district)?.name || selectedAddress.district;
    const thanaName = THANAS.find((t) => t.id === selectedAddress.thana)?.name || selectedAddress.thana;

    const payload = {
      service: serviceId,
      scheduledDate: values.scheduledDate,
      scheduledTime: values.scheduledTime,
      propertyDetails: {
        propertyType: values.propertyType,
        issues: values.issues ? parseListInput(values.issues) : [],
      },
      serviceAddress: {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        district: districtName,
        thana: thanaName,
        address: selectedAddress.address,
      },
      notes: values.notes || undefined,
    };

    try {
      await createBooking.mutateAsync(payload);
      form.reset(initialValues);
      router.push("/dashboard/bookings");
    } catch (error) {
      console.error(error);
    }
  }

  function handleReset() {
    form.reset(initialValues);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormHeader completedSections={completedCount} />
      {serviceName && (
        <p className="text-sm text-muted-foreground mb-4 -mt-4">
          Booking: <span className="font-medium text-foreground">{serviceName}</span>
        </p>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <ScheduleSection control={form.control} />
        <PropertySection control={form.control} />

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
        <FormActions onReset={handleReset} isPending={createBooking.isPending} submitLabel="Confirm Booking" />
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
