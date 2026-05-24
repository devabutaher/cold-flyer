"use client";

import { LABEL_OPTIONS } from "@/components/dashboard/profile/address-form-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DISTRICTS, THANAS } from "@/data/bd-addresses";
import { cn } from "@/lib/utils";
import { CircleCheck, MapPin, Pencil, Phone, Star, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function AddressCard({ address, isSelected, onSelect, onEdit, onDelete, onSetDefault }) {
  const t = useTranslations("profile");
  const LabelIcon = LABEL_OPTIONS.find((o) => o.value === address.label)?.icon || MapPin;
  const districtName = DISTRICTS.find((d) => d.id === address.district)?.name || address.district;
  const thanaName = THANAS.find((t) => t.id === address.thana)?.name || address.thana;

  const showButtons = onEdit || onDelete || onSetDefault;

  function handleContainerClick() {
    if (onSelect) onSelect(address._id);
  }

  return (
    <div
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={handleContainerClick}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") handleContainerClick();
            }
          : undefined
      }
      className={cn(
        "relative rounded-lg border p-5",
        onSelect && "cursor-pointer transition-all",
        isSelected
          ? "border-primary ring-1 ring-primary bg-primary/3"
          : onSelect && "border-border hover:border-muted-foreground/30",
        !onSelect && "border-border",
      )}
    >
      {address.isDefault && (
        <Badge variant={isSelected ? "default" : "secondary"} className="absolute top-3 right-3 gap-1 text-xs">
          <Star className="size-3" />
          {t("default")}
        </Badge>
      )}
      {isSelected && <CircleCheck size={18} className="absolute top-3 left-3 text-primary" />}
      <div className={cn("flex items-center gap-2 mb-4", isSelected && "ml-7")}>
        <LabelIcon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{address.label}</span>
      </div>
      <div className="space-y-2 text-sm">
        <p className="text-base font-semibold">{address.fullName}</p>
        {address.address && <p className="text-muted-foreground leading-relaxed">{address.address}</p>}
        {(address.thana || address.district) && (
          <p className="text-muted-foreground">
            {thanaName}
            {address.thana && address.district ? ", " : ""}
            {districtName}
          </p>
        )}
        <div className="flex items-center gap-1.5 pt-1 text-muted-foreground/70">
          <Phone className="size-3.5 shrink-0" />
          <span>{address.phone}</span>
        </div>
      </div>
      {showButtons && <Separator className="my-4" />}
      {showButtons && (
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="h-8 gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
            >
              <Pencil className="size-3.5" />
              {t("editAddress")}
            </Button>
          )}
          {onSetDefault && !address.isDefault && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="h-8 gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(address._id);
              }}
            >
              <Star className="size-3.5" />
              {t("setDefaultAddress")}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="icon-sm"
              type="button"
              className="ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address._id);
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
