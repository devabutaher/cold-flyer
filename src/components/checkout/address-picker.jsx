"use client";

import { useTranslations } from "next-intl";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressCard } from "@/components/dashboard/profile/address-card";

export function AddressPicker({ addresses, effectiveSelectedId, onSelect, onAdd, onEdit, onDelete, onSetDefault }) {
  const t = useTranslations("checkout");

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-primary" />
          <h2 className="text-lg font-bold text-foreground">{t("shippingAddress")}</h2>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={onAdd} type="button">
          <Plus size={14} />
          Add
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <MapPin className="size-10 text-muted-foreground/50" />
          <div>
            <p className="font-medium">{t("savedAddresses")}</p>
            <p className="text-sm text-muted-foreground">{t("noSavedAddresses")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onAdd} type="button">
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <AddressCard
              key={addr._id}
              address={addr}
              isSelected={effectiveSelectedId === addr._id}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onSetDefault={onSetDefault}
            />
          ))}
        </div>
      )}
    </>
  );
}
