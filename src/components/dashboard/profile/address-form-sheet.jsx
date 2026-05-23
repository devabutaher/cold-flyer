"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DISTRICTS, getThanas } from "@/data/bd-addresses";
import { addAddressAction, updateAddressAction } from "@/lib/actions/user";
import { cn } from "@/lib/utils";
import { Building2, Home, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
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

function AddressForm({ form, setForm, errors }) {
  const t = useTranslations("profile");
  const thanas = getThanas(form.district);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label>{t("addresses")}</Label>
        <div className="flex gap-2">
          {LABEL_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, label: opt.value })}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium transition-colors cursor-pointer",
                  form.label === opt.value
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
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-fullName">{t("fullName")}</Label>
        <Input
          id="addr-fullName"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        {errors?.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-phone">{t("phone")}</Label>
        <Input id="addr-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        {errors?.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      <Separator />

      <div className="grid gap-2">
        <Label>{t("district")}</Label>
        <SearchableSelect
          options={DISTRICTS}
          value={form.district}
          onChange={(id) => setForm({ ...form, district: id, thana: "" })}
          placeholder={t("selectDistrict")}
          searchPlaceholder={t("searchDistrict")}
        />
        {errors?.district && <p className="text-xs text-destructive">{errors.district}</p>}
      </div>

      <div className="grid gap-2">
        <Label>{t("thana")}</Label>
        <SearchableSelect
          options={thanas}
          value={form.thana}
          onChange={(id) => setForm({ ...form, thana: id })}
          placeholder={form.district ? t("selectThana") : t("selectDistrictFirst")}
          searchPlaceholder={t("searchThana")}
        />
        {errors?.thana && <p className="text-xs text-destructive">{errors.thana}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-address">{t("address")}</Label>
        <textarea
          id="addr-address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 resize-y"
          rows={3}
        />
        {errors?.address && <p className="text-xs text-destructive">{errors.address}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-instructions">{t("deliveryInstructions")}</Label>
        <Input
          id="addr-instructions"
          value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Checkbox
          id="addr-default"
          checked={form.isDefault}
          onCheckedChange={(checked) => setForm({ ...form, isDefault: !!checked })}
        />
        <Label htmlFor="addr-default" className="text-sm font-normal">
          {t("setDefault")}
        </Label>
      </div>
    </div>
  );
}

export function AddressFormSheet({ open, onOpenChange, address, onSaved }) {
  const t = useTranslations("profile");
  const [form, setForm] = useState(address ? { ...EMPTY_FORM, ...address } : EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setForm(address ? { ...EMPTY_FORM, ...address } : EMPTY_FORM);
    setErrors({});
  }

  async function handleSave() {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = t("fullNameRequired");
    if (!form.phone.trim()) errs.phone = t("phoneRequired");
    else if (form.phone.trim().length < 10) errs.phone = t("phoneMinLength");
    if (!form.district) errs.district = t("districtRequired");
    if (!form.thana) errs.thana = t("thanaRequired");
    if (!form.address.trim()) errs.address = t("addressRequired");
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    const payload = { ...form };
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
          <AddressForm form={form} setForm={setForm} errors={errors} />
        </div>
        <div className="flex gap-2 justify-end p-4 border-t">
          <SheetClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </SheetClose>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? t("saving") : address ? t("editAddressTitle") : t("addAddressTitle")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
