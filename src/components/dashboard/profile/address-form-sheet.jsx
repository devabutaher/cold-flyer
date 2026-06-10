"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DISTRICTS, getThanas } from "@/data/bd-addresses";
import { addAddressAction, updateAddressAction } from "@/lib/actions/user";
import { cn } from "@/lib/utils";
import { addressSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Home, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export const LABEL_OPTIONS = [
  { value: "Home", icon: Home },
  { value: "Work", icon: Building2 },
  { value: "Other", icon: MapPin },
];

const EMPTY_FORM = {
  label: "Home",
  isDefault: false,
  fullName: "",
  phone: "",
  district: "",
  thana: "",
  address: "",
  instructions: "",
};

function AddressForm({ control, errors, thanas }) {
  const t = useTranslations("profile");
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label>{t("addresses")}</Label>
        <Controller
          name="label"
          control={control}
          render={({ field }) => {
            const isOther = !["Home", "Work"].includes(field.value);
            return (
              <div className="space-y-2">
                <div className="flex gap-2">
                  {LABEL_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value === "Other" ? "" : opt.value)}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium transition-colors cursor-pointer",
                          (opt.value === "Other" ? isOther : field.value === opt.value)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Icon className="size-4" />
                        {t(opt.value.toLowerCase())}
                      </button>
                    );
                  })}
                </div>
                {isOther && (
                  <Input
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={t("other")}
                    autoFocus
                  />
                )}
              </div>
            );
          }}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-fullName">{t("fullName")}</Label>
        <Controller name="fullName" control={control} render={({ field }) => <Input id="addr-fullName" {...field} />} />
        {errors?.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-phone">{t("phone")}</Label>
        <Controller name="phone" control={control} render={({ field }) => <Input id="addr-phone" {...field} />} />
        {errors?.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <Separator />

      <div className="grid gap-2">
        <Label>{t("district")}</Label>
        <Controller
          name="district"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              options={DISTRICTS}
              value={field.value}
              onChange={(id) => field.onChange(id)}
              placeholder={t("selectDistrict")}
              searchPlaceholder={t("searchDistrict")}
            />
          )}
        />
        {errors?.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label>{t("thana")}</Label>
        <Controller
          name="thana"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              options={thanas}
              value={field.value}
              onChange={(id) => field.onChange(id)}
              placeholder={control._formValues.district ? t("selectThana") : t("selectDistrictFirst")}
              searchPlaceholder={t("searchThana")}
            />
          )}
        />
        {errors?.thana && <p className="text-xs text-destructive">{errors.thana.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-address">{t("address")}</Label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Textarea
              id="addr-address"
              {...field}
              className="min-h-20 resize-y"
              rows={3}
            />
          )}
        />
        {errors?.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-instructions">{t("deliveryInstructions")}</Label>
        <Controller
          name="instructions"
          control={control}
          render={({ field }) => <Input id="addr-instructions" {...field} />}
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Controller
          name="isDefault"
          control={control}
          render={({ field }) => (
            <>
              <Checkbox
                id="addr-default"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              />
              <Label htmlFor="addr-default" className="text-sm font-normal">
                {t("setDefault")}
              </Label>
            </>
          )}
        />
      </div>
    </div>
  );
}

export function AddressFormSheet({ open, onOpenChange, address, onSaved }) {
  const t = useTranslations("profile");
  const [saving, setSaving] = useState(false);
  const district = address?.district || "";

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: address ? { ...EMPTY_FORM, ...address } : EMPTY_FORM,
    resolver: zodResolver(addressSchema),
    mode: "onTouched",
  });

  const selectedDistrict = useWatch({ control, name: "district", defaultValue: district });
  const thanas = getThanas(selectedDistrict);

  function resetForm() {
    reset(address ? { ...EMPTY_FORM, ...address } : EMPTY_FORM);
  }

  async function onSave(data) {
    setSaving(true);
    const payload = { ...data };
    if (!payload.instructions) delete payload.instructions;

    const result = address ? await updateAddressAction(address._id, payload) : await addAddressAction(payload);
    setSaving(false);

    if (result.success) {
      toast.success(address ? t("addressUpdated") : t("addressAdded"));
      onOpenChange(false);
      onSaved?.();
    } else {
      toast.error(result.message || t("failedAddress"));
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) resetForm();
      }}
    >
      <SheetContent side="right" open={open} className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{address ? t("editAddressTitle") : t("addAddressTitle")}</SheetTitle>
          <SheetDescription>{address ? t("editAddressDesc") : t("addAddressDesc")}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <AddressForm control={control} errors={errors} thanas={thanas} />
        </div>
        <div className="flex gap-2 justify-end p-4 border-t">
          <SheetClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </SheetClose>
          <Button onClick={handleSubmit(onSave)} disabled={saving}>
            {saving ? t("saving") : address ? t("editAddressTitle") : t("addAddressTitle")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
