"use client";

import { AddressCard } from "@/components/dashboard/profile/address-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteAddressAction, getAddressesAction, setDefaultAddressAction } from "@/lib/actions/user";
import { MapPin, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { AddressFormSheet } from "./address-form-sheet";

export function AddressSection({ initialAddresses }) {
  const router = useRouter();
  const t = useTranslations("profile");
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
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
    setEditingAddress(null);
    setSheetOpen(true);
  }

  function openEditSheet(addr) {
    setEditingAddress(addr);
    setSheetOpen(true);
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
              {addresses.map((addr) => (
                <AddressCard
                  key={addr._id}
                  address={addr}
                  onEdit={openEditSheet}
                  onDelete={(id) => setDeleteId(id)}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddressFormSheet
        key={editingAddress?._id || "new"}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        address={editingAddress}
        onSaved={refreshAddresses}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteAddress")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteAddressDesc")}</AlertDialogDescription>
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
