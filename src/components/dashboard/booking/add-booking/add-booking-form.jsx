"use client";

import { useEffect, useMemo, useState } from "react";
import { useCreateBooking } from "@/hooks/queries/bookings";
import { useAuth } from "@/components/providers";
import { parseListInput } from "@/lib/utils";
import { getAddressesAction, deleteAddressAction, setDefaultAddressAction } from "@/lib/actions/user";
import { AddressFormSheet } from "@/components/dashboard/profile/address-form-sheet";
import { AddressPicker } from "@/components/checkout/address-picker";
import { DISTRICTS, THANAS } from "@/data/bd-addresses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { FormHeader, ScheduleSection, NotesSection, ServiceDetailsSection, AddressFields } from "../booking-form";
import { FormActions } from "../../product/product-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { User, MapPin } from "lucide-react";
import { Controller } from "react-hook-form";

import { bookingFormSchema } from "@/validations";

const initialValues = {
  scheduledDate: new Date().toISOString().split("T")[0],
  scheduledTime: { start: "09:00", end: "19:00" },
  propertyType: "residential",
  issues: "",
  notes: "",
  acBrand: "",
  acModel: "",
  acTon: "",
  acGasType: "",
  acType: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  guestAddress: "",
  guestDistrict: "",
  guestThana: "",
};

export default function AddBookingForm({ serviceId, serviceName, guestMode = false }) {
  const router = useRouter();
  const createBooking = useCreateBooking();
  const { backendUser } = useAuth();
  const isLoggedIn = !!backendUser;

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

  const formDefaultValues = useMemo(
    () => ({
      ...initialValues,
      customerName: backendUser?.name || "",
      customerPhone: backendUser?.phone || "",
      customerEmail: backendUser?.email || "",
    }),
    [backendUser],
  );

  const form = useForm({
    defaultValues: formDefaultValues,
    resolver: zodResolver(bookingFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (isLoggedIn && !guestMode) {
      getAddressesAction().then((result) => {
        if (result.success) {
          setAddresses(result.addresses);
          setSelectedAddressId((prev) => {
            if (prev) return prev;
            return result.addresses.find((a) => a.isDefault)?._id || result.addresses[0]?._id || null;
          });
        }
      });
    }
  }, [isLoggedIn, guestMode]);

  const completedSections = useWatch({
    control: form.control,
    name: ["scheduledDate", "notes", "guestAddress"],
  });

  const completedCount = useMemo(() => {
    let count = 0;
    if (completedSections[0]) count++;
    if (selectedAddress || completedSections[2]) count++;
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
    const districtName = guestMode
      ? DISTRICTS.find((d) => d.id === values.guestDistrict)?.name || values.guestDistrict
      : DISTRICTS.find((d) => d.id === selectedAddress?.district)?.name || selectedAddress?.district;

    const thanaName = guestMode
      ? THANAS.find((t) => t.id === values.guestThana)?.name || values.guestThana
      : THANAS.find((t) => t.id === selectedAddress?.thana)?.name || selectedAddress?.thana;

    if (!guestMode && !selectedAddress) return;

    const payload = {
      service: serviceId,
      scheduledDate: values.scheduledDate,
      scheduledTime: values.scheduledTime,
      propertyDetails: {
        propertyType: values.propertyType,
        issues: values.issues ? parseListInput(values.issues) : [],
      },
      serviceAddress: guestMode
        ? {
            fullName: values.customerName,
            phone: values.customerPhone,
            district: districtName,
            thana: thanaName,
            address: values.guestAddress,
          }
        : {
            fullName: selectedAddress.fullName,
            phone: selectedAddress.phone,
            district: districtName,
            thana: thanaName,
            address: selectedAddress.address,
          },
      notes: values.notes || undefined,
      acBrand: values.acBrand || undefined,
      acModel: values.acModel || undefined,
      acTon: values.acTon || undefined,
      acGasType: values.acGasType || undefined,
      acType: values.acType || undefined,
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      customerEmail: values.customerEmail || undefined,
    };

    try {
      await createBooking.mutateAsync(payload);
      form.reset(initialValues);
      if (guestMode) {
        router.push("/services");
      } else {
        router.push("/dashboard/bookings");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleReset() {
    form.reset(formDefaultValues);
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
        <ServiceDetailsSection control={form.control} />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Your Information</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {guestMode ? "We&apos;ll create a customer profile for you" : "Contact information"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="customerName"
                control={form.control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input {...field} value={field.value ?? ""} placeholder="Your full name" />
                    {fieldState.invalid && <p className="text-xs text-destructive mt-1">{fieldState.error?.message}</p>}
                  </Field>
                )}
              />
              <Controller
                name="customerPhone"
                control={form.control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Phone <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input {...field} value={field.value ?? ""} placeholder="Your phone number" />
                    {fieldState.invalid && <p className="text-xs text-destructive mt-1">{fieldState.error?.message}</p>}
                  </Field>
                )}
              />
              <Controller
                name="customerEmail"
                control={form.control}
                defaultValue=""
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input {...field} value={field.value ?? ""} type="email" placeholder="your@email.com" />
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {guestMode ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Service Address</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Where should we come?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AddressFields control={form.control} namePrefix="guest" />
            </CardContent>
          </Card>
        ) : (
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
        )}

        <NotesSection control={form.control} />
        <FormActions onReset={handleReset} isPending={createBooking.isPending} submitLabel="Confirm Booking" />
      </form>

      {!guestMode && (
        <AddressFormSheet
          key={editingAddress?._id || "new"}
          open={addressSheetOpen}
          onOpenChange={setAddressSheetOpen}
          address={editingAddress}
          onSaved={handleAddressSaved}
        />
      )}
    </div>
  );
}
