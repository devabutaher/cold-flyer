"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getClient } from "@/lib/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CouponFormDialog({ mode = "create", coupon, open: controlledOpen, onOpenChange: controlledOnOpenChange, onSuccess, trigger }) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);

  const isEdit = mode === "edit";
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = (nextOpen) => {
    if (controlledOnOpenChange) {
      controlledOnOpenChange(nextOpen);
    } else {
      setInternalOpen(nextOpen);
      if (!nextOpen) {
        setCode("");
        setDiscountType("percentage");
        setDiscountValue("");
        setMaxDiscount("");
        setMinOrderValue("");
        setMaxUsage("");
        setValidFrom("");
        setValidUntil("");
      }
    }
  };

  const [code, setCode] = useState(isEdit ? coupon?.code || "" : "");
  const [discountType, setDiscountType] = useState(isEdit ? coupon?.discountType || "percentage" : "percentage");
  const [discountValue, setDiscountValue] = useState(isEdit ? String(coupon?.discountValue || "") : "");
  const [maxDiscount, setMaxDiscount] = useState(isEdit ? String(coupon?.maxDiscount || "") : "");
  const [minOrderValue, setMinOrderValue] = useState(isEdit ? String(coupon?.minOrderValue ?? "0") : "");
  const [maxUsage, setMaxUsage] = useState(isEdit ? String(coupon?.maxUsage || "") : "");
  const [validFrom, setValidFrom] = useState(isEdit ? coupon?.validFrom?.split("T")[0] || "" : "");
  const [validUntil, setValidUntil] = useState(isEdit ? coupon?.validUntil?.split("T")[0] || "" : "");
  const [fromOpen, setFromOpen] = useState(false);
  const [untilOpen, setUntilOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEdit) {
        return getClient().patch(`/admin/coupons/${coupon._id}`, data);
      }
      return getClient().post("/admin/coupons", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      handleOpenChange(false);
      toast.success(isEdit ? "Coupon updated" : "Coupon created");
      onSuccess?.();
    },
    onError: (err) => toast.error(err?.response?.data?.message || err.message),
  });

  const handleSubmit = () => {
    if (!code || !discountValue || !validFrom || !validUntil) {
      toast.error("Fill required fields");
      return;
    }
    mutation.mutate({
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      ...(discountType === "percentage" && maxDiscount ? { maxDiscount: Number(maxDiscount) } : {}),
      minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
      ...(maxUsage ? { maxUsage: Number(maxUsage) } : {}),
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
    });
  };

  return (
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isEdit ? "Edit Coupon" : "Create Coupon"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit
              ? `Update details for coupon code ${coupon?.code}.`
              : "Add a new discount coupon for customers to use at checkout."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="coupon-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SUMMER20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-type">Discount Type</Label>
              <Select value={discountType} onValueChange={setDiscountType}>
                <SelectTrigger id="coupon-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed (৳)</SelectItem>
                  <SelectItem value="free_shipping">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-value">
                {discountType === "free_shipping" ? "Value" : "Value *"}
              </Label>
              {discountType === "free_shipping" ? (
                <Input id="coupon-value" value="—" disabled className="text-muted-foreground" />
              ) : (
                <Input
                  id="coupon-value"
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === "percentage" ? "20" : "500"}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-min-order">Min. Order</Label>
              <Input
                id="coupon-min-order"
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {discountType === "percentage" ? (
              <div className="space-y-2">
                <Label htmlFor="coupon-max-discount">Max Discount (cap)</Label>
                <Input
                  id="coupon-max-discount"
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="Uncapped"
                />
              </div>
            ) : (
              <div />
            )}
            <div className="space-y-2">
              <Label htmlFor="coupon-usage">Max Usage</Label>
              <Input
                id="coupon-usage"
                type="number"
                value={maxUsage}
                onChange={(e) => setMaxUsage(e.target.value)}
                placeholder="Unlimited"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Valid From <span className="text-destructive">*</span>
              </Label>
              <Popover open={fromOpen} onOpenChange={setFromOpen}>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer" role="button" tabIndex={0}>
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                    <Input
                      readOnly
                      value={validFrom ? format(new Date(validFrom + "T00:00:00"), "PP") : ""}
                      placeholder="Pick a date"
                      className="pl-10 cursor-pointer"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={validFrom ? new Date(validFrom + "T00:00:00") : undefined}
                    onSelect={(date) => {
                      setValidFrom(date ? format(date, "yyyy-MM-dd") : "");
                      setFromOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>
                Valid Until <span className="text-destructive">*</span>
              </Label>
              <Popover open={untilOpen} onOpenChange={setUntilOpen}>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer" role="button" tabIndex={0}>
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                    <Input
                      readOnly
                      value={validUntil ? format(new Date(validUntil + "T00:00:00"), "PP") : ""}
                      placeholder="Pick a date"
                      className="pl-10 cursor-pointer"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={validUntil ? new Date(validUntil + "T00:00:00") : undefined}
                    onSelect={(date) => {
                      setValidUntil(date ? format(date, "yyyy-MM-dd") : "");
                      setUntilOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Coupon"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
