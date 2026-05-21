"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, Building2, MapPin, Phone, Pencil, Trash2, Star, Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  addAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
  getAddressesAction,
} from "@/lib/actions/user";

const LABEL_OPTIONS = [
  { value: "Home", icon: Home },
  { value: "Work", icon: Building2 },
  { value: "Other", icon: MapPin },
];

const EMPTY_FORM = {
  label: "Home",
  isDefault: false,
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "USA",
  instructions: "",
};

function AddressForm({ form, setForm, errors }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="addr-label">{t("addresses")}</Label>
        <Select value={form.label} onValueChange={(v) => setForm({ ...form, label: v })}>
          <SelectTrigger id="addr-label">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
              {LABEL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{t(opt.value.toLowerCase())}</SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-fullName">{t("fullName")}</Label>
        <Input id="addr-fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        {errors?.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-phone">{t("phone")}</Label>
        <Input id="addr-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        {errors?.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      <Separator />

      <div className="grid gap-2">
        <Label htmlFor="addr-line1">{t("addressLine1")}</Label>
        <Input id="addr-line1" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
        {errors?.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-line2">{t("addressLine2")}</Label>
        <Input id="addr-line2" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="addr-city">{t("city")}</Label>
          <Input id="addr-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          {errors?.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="addr-state">{t("state")}</Label>
          <Input id="addr-state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          {errors?.state && <p className="text-xs text-destructive">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="addr-zip">{t("postalCode")}</Label>
          <Input id="addr-zip" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
          {errors?.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="addr-country">{t("country")}</Label>
          <Input id="addr-country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addr-instructions">{t("deliveryInstructions")}</Label>
        <Input id="addr-instructions" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Checkbox
          id="addr-default"
          checked={form.isDefault}
          onCheckedChange={(checked) => setForm({ ...form, isDefault: !!checked })}
        />
        <Label htmlFor="addr-default" className="text-sm font-normal">{t("setDefault")}</Label>
      </div>
    </div>
  );
}

export function AddressSection({ initialAddresses }) {
  const router = useRouter();
  const t = useTranslations("profile");
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const refreshAddresses = useCallback(async () => {
    const result = await getAddressesAction();
    if (result.success) {
      setAddresses(result.addresses);
      router.refresh();
    }
  }, [router]);

  function openAddSheet() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setSheetOpen(true);
  }

  function openEditSheet(addr) {
    setEditingId(addr._id);
    setForm({
      label: addr.label || "Home",
      isDefault: addr.isDefault || false,
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || "",
      country: addr.country || "USA",
      instructions: addr.instructions || "",
    });
    setErrors({});
    setSheetOpen(true);
  }

  function validateForm() {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (form.phone.trim().length < 10) errs.phone = "Phone must be at least 10 digits";
    if (!form.addressLine1.trim()) errs.addressLine1 = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.postalCode.trim()) errs.postalCode = "Postal code is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;
    setSaving(true);

    const payload = { ...form };
    if (!payload.addressLine2) delete payload.addressLine2;
    if (!payload.instructions) delete payload.instructions;

    const result = editingId
      ? await updateAddressAction(editingId, payload)
      : await addAddressAction(payload);

    setSaving(false);

    if (result.success) {
      toast.success(editingId ? t("addressUpdated") : t("addressAdded"));
      setSheetOpen(false);
      await refreshAddresses();
    } else {
      toast.error(result.message || t("failedAddress"));
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const result = await deleteAddressAction(deleteId);
    setDeleting(false);

    if (result.success) {
      toast.success(t("addressDeleted"));
      setDeleteId(null);
      await refreshAddresses();
    } else {
      toast.error(result.message || t("failedDelete"));
    }
  }

  async function handleSetDefault(id) {
    const result = await setDefaultAddressAction(id);
    if (result.success) {
      toast.success(t("defaultAddressUpdated"));
      await refreshAddresses();
    } else {
      toast.error(result.message || t("failedDefault"));
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("addresses")}</CardTitle>
            <Button size="sm" onClick={openAddSheet}>
              <Plus className="size-3.5" />
              {t("addAddress")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <MapPin className="size-10 text-muted-foreground/50" />
              <div>
                <p className="font-medium">{t("noAddresses")}</p>
                <p className="text-sm text-muted-foreground">{t("noAddressesDesc")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={openAddSheet}>
                <Plus className="size-3.5" />
                {t("addAddress")}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((addr) => {
                const LabelIcon = LABEL_OPTIONS.find((o) => o.value === addr.label)?.icon || MapPin;
                return (
                  <div
                    key={addr._id}
                    className="relative rounded-lg border p-4 transition-colors hover:border-primary/30"
                  >
                    {addr.isDefault && (
                      <Badge variant="default" className="absolute top-3 right-3 gap-1 text-xs">
                        <Star className="size-3" />
                        {t("default")}
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <LabelIcon className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{addr.label}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{addr.fullName}</p>
                      <p className="text-muted-foreground">{addr.addressLine1}</p>
                      {addr.addressLine2 && (
                        <p className="text-muted-foreground">{addr.addressLine2}</p>
                      )}
                      <p className="text-muted-foreground">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-muted-foreground">{addr.country}</p>
                      <div className="flex items-center gap-1.5 pt-1 text-muted-foreground">
                        <Phone className="size-3" />
                        {addr.phone}
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="xs" onClick={() => openEditSheet(addr)}>
                        <Pencil className="size-3" />
                        {t("editAddress")}
                      </Button>
                      {!addr.isDefault && (
                        <Button variant="ghost" size="xs" onClick={() => handleSetDefault(addr._id)}>
                          <Star className="size-3" />
                          {t("setDefaultAddress")}
                        </Button>
                      )}
                      <Button variant="ghost" size="xs" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(addr._id)}>
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingId ? t("editAddressTitle") : t("addAddressTitle")}</SheetTitle>
            <SheetDescription>
              {editingId ? t("editAddressDesc") : t("addAddressDesc")}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4">
            <AddressForm form={form} setForm={setForm} errors={errors} />
          </div>
          <div className="flex gap-2 justify-end p-4 border-t">
            <SheetClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </SheetClose>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t("saving") : editingId ? t("editAddressTitle") : t("addAddressTitle")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteAddress")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteAddressDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? t("saving") : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
