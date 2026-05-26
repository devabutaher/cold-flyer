"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableMultiSelect } from "@/components/ui/searchable-multi-select";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscount: "",
  minOrderValue: "0",
  maxUsage: "",
  validFrom: "",
  validUntil: "",
  applicableTo: "all",
  productIds: [],
  serviceIds: [],
  categoryIds: [],
  brandIds: [],
  firstOrderOnly: false,
  minItemCount: "",
  showOnBanner: true,
  excludedProductIds: [],
  excludedCategoryIds: [],
};

function useFormState(initial) {
  const [state, setState] = useState(initial);
  const initialRef = useRef(null);
  useEffect(() => { initialRef.current = initial; }, [initial]);
  const patch = useCallback((key, value) => setState((s) => ({ ...s, [key]: value })), []);
  const reset = useCallback(() => { if (initialRef.current) setState(initialRef.current); }, []);
  return [state, patch, reset];
}

const fetchProducts = async (search) => {
  const res = await getClient().get(`/admin/products?search=${encodeURIComponent(search)}&limit=20`);
  return res.data?.data?.products || [];
};

const fetchServices = async (search) => {
  const res = await getClient().get(`/services?search=${encodeURIComponent(search)}&limit=20`);
  return res.data?.data?.services || [];
};

export function CouponFormDialog({ mode = "create", coupon, open: controlledOpen, onOpenChange: controlledOnOpenChange, onSuccess, trigger }) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);

  const isEdit = mode === "edit";
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const getInitial = () => {
    if (isEdit && coupon) {
      return {
        code: coupon.code || "",
        discountType: coupon.discountType || "percentage",
        discountValue: String(coupon.discountValue || ""),
        maxDiscount: String(coupon.maxDiscount || ""),
        minOrderValue: String(coupon.minOrderValue ?? "0"),
        maxUsage: String(coupon.maxUsage || ""),
        validFrom: coupon.validFrom?.split("T")[0] || "",
        validUntil: coupon.validUntil?.split("T")[0] || "",
        applicableTo: coupon.applicableTo || "all",
        productIds: coupon.productIds || [],
        serviceIds: coupon.serviceIds || [],
        categoryIds: coupon.categoryIds || [],
        brandIds: coupon.brandIds || [],
        firstOrderOnly: coupon.firstOrderOnly || false,
        minItemCount: String(coupon.minItemCount || ""),
        showOnBanner: coupon.showOnBanner !== false,
        excludedProductIds: coupon.excludedProductIds || [],
        excludedCategoryIds: coupon.excludedCategoryIds || [],
      };
    }
    return { ...initialForm };
  };

  const [form, patch, reset] = useFormState(getInitial());

  const [fromOpen, setFromOpen] = useState(false);
  const [untilOpen, setUntilOpen] = useState(false);

  const handleOpenChange = (nextOpen) => {
    if (controlledOnOpenChange) {
      controlledOnOpenChange(nextOpen);
    } else {
      setInternalOpen(nextOpen);
      if (!nextOpen) reset();
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEdit) return getClient().patch(`/admin/coupons/${coupon._id}`, data);
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
    if (!form.code || !form.discountValue || !form.validFrom || !form.validUntil) {
      toast.error("Fill required fields");
      return;
    }
    mutation.mutate({
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      ...(form.discountType === "percentage" && form.maxDiscount ? { maxDiscount: Number(form.maxDiscount) } : {}),
      minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
      ...(form.maxUsage ? { maxUsage: Number(form.maxUsage) } : {}),
      validFrom: new Date(form.validFrom),
      validUntil: new Date(form.validUntil),
      applicableTo: form.applicableTo,
      ...(form.applicableTo === "products" ? { productIds: form.productIds.map((p) => p._id || p) } : {}),
      ...(form.applicableTo === "services" ? { serviceIds: form.serviceIds.map((s) => s._id || s) } : {}),
      ...(form.applicableTo === "categories" ? { categoryIds: form.categoryIds } : {}),
      ...(form.applicableTo === "brands" ? { brandIds: form.brandIds } : {}),
      firstOrderOnly: form.firstOrderOnly,
      ...(form.minItemCount ? { minItemCount: Number(form.minItemCount) } : {}),
      showOnBanner: form.showOnBanner,
      ...(form.excludedProductIds.length > 0 ? { excludedProductIds: form.excludedProductIds.map((p) => p._id || p) } : {}),
      ...(form.excludedCategoryIds.length > 0 ? { excludedCategoryIds: form.excludedCategoryIds } : {}),
    });
  };

  const CATEGORIES = [
    "Air Conditioners", "Heaters", "Ventilation", "Refrigeration", "Parts & Accessories",
  ];

  const BRANDS = [
    "Samsung", "LG", "Daikin", "Gree", "General", "Mitsubishi", "Panasonic", "Sharp", "Whirlpool", "Hitachi",
  ];

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="data-[size=default]:sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>{isEdit ? `Edit Coupon — ${coupon?.code}` : "Create Coupon"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit ? "Update coupon details including scope and conditions." : "Add a new discount coupon with optional product/service targeting."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Row 1: Code + Discount Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Code <span className="text-destructive">*</span></Label>
              <Input id="coupon-code" value={form.code} onChange={(e) => patch("code", e.target.value.toUpperCase())} placeholder="SUMMER20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-type">Discount Type</Label>
              <Select value={form.discountType} onValueChange={(v) => patch("discountType", v)}>
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

          {/* Row 2: Value + Min Order */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-value">{form.discountType === "free_shipping" ? "Value" : "Value *"}</Label>
              {form.discountType === "free_shipping" ? (
                <Input id="coupon-value" value="—" disabled className="text-muted-foreground" />
              ) : (
                <Input id="coupon-value" type="number" value={form.discountValue} onChange={(e) => patch("discountValue", e.target.value)} placeholder={form.discountType === "percentage" ? "20" : "500"} />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-min-order">Min. Order</Label>
              <Input id="coupon-min-order" type="number" value={form.minOrderValue} onChange={(e) => patch("minOrderValue", e.target.value)} placeholder="0" />
            </div>
          </div>

          {/* Row 3: Max Discount + Max Usage */}
          <div className="grid grid-cols-2 gap-4">
            {form.discountType === "percentage" ? (
              <div className="space-y-2">
                <Label htmlFor="coupon-max-discount">Max Discount (cap)</Label>
                <Input id="coupon-max-discount" type="number" value={form.maxDiscount} onChange={(e) => patch("maxDiscount", e.target.value)} placeholder="Uncapped" />
              </div>
            ) : <div />}
            <div className="space-y-2">
              <Label htmlFor="coupon-usage">Max Usage</Label>
              <Input id="coupon-usage" type="number" value={form.maxUsage} onChange={(e) => patch("maxUsage", e.target.value)} placeholder="Unlimited" />
            </div>
          </div>

          {/* Row 4: Valid From + Valid Until */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valid From <span className="text-destructive">*</span></Label>
              <Popover open={fromOpen} onOpenChange={setFromOpen}>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer" role="button" tabIndex={0}>
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                    <Input readOnly value={form.validFrom ? format(new Date(form.validFrom + "T00:00:00"), "PP") : ""} placeholder="Pick a date" className="pl-10 cursor-pointer" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar mode="single" selected={form.validFrom ? new Date(form.validFrom + "T00:00:00") : undefined} onSelect={(date) => { patch("validFrom", date ? format(date, "yyyy-MM-dd") : ""); setFromOpen(false); }} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Valid Until <span className="text-destructive">*</span></Label>
              <Popover open={untilOpen} onOpenChange={setUntilOpen}>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer" role="button" tabIndex={0}>
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                    <Input readOnly value={form.validUntil ? format(new Date(form.validUntil + "T00:00:00"), "PP") : ""} placeholder="Pick a date" className="pl-10 cursor-pointer" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar mode="single" selected={form.validUntil ? new Date(form.validUntil + "T00:00:00") : undefined} onSelect={(date) => { patch("validUntil", date ? format(date, "yyyy-MM-dd") : ""); setUntilOpen(false); }} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <hr className="border-border" />

          {/* Scope Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Scope & Targeting</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Applicable To</Label>
                <Select value={form.applicableTo} onValueChange={(v) => patch("applicableTo", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="products">Specific Products</SelectItem>
                    <SelectItem value="services">Specific Services</SelectItem>
                    <SelectItem value="categories">Specific Categories</SelectItem>
                    <SelectItem value="brands">Specific Brands</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-min-items">Min. Items</Label>
                <Input id="coupon-min-items" type="number" value={form.minItemCount} onChange={(e) => patch("minItemCount", e.target.value)} placeholder="0 (no limit)" />
              </div>
            </div>

            {form.applicableTo === "products" && (
              <SearchableMultiSelect
                label="Select Products"
                value={form.productIds}
                onChange={(v) => patch("productIds", v)}
                fetchFn={fetchProducts}
                placeholder="Search products..."
              />
            )}

            {form.applicableTo === "services" && (
              <SearchableMultiSelect
                label="Select Services"
                value={form.serviceIds}
                onChange={(v) => patch("serviceIds", v)}
                fetchFn={fetchServices}
                placeholder="Search services..."
              />
            )}

            {form.applicableTo === "categories" && (
              <div className="space-y-2">
                <Label>Select Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const selected = form.categoryIds.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => patch("categoryIds", selected ? form.categoryIds.filter((c) => c !== cat) : [...form.categoryIds, cat])}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-left transition-colors ${selected ? "border-primary bg-primary/10 text-primary" : "border-input hover:border-primary/30"}`}
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                          {selected && <span className="text-xxxs">✓</span>}
                        </div>
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {form.applicableTo === "brands" && (
              <div className="space-y-2">
                <Label>Select Brands</Label>
                <div className="grid grid-cols-2 gap-2">
                  {BRANDS.map((brand) => {
                    const selected = form.brandIds.includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => patch("brandIds", selected ? form.brandIds.filter((b) => b !== brand) : [...form.brandIds, brand])}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-left transition-colors ${selected ? "border-primary bg-primary/10 text-primary" : "border-input hover:border-primary/30"}`}
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                          {selected && <span className="text-xxxs">✓</span>}
                        </div>
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Excluded Products */}
            <SearchableMultiSelect
              label="Excluded Products"
              value={form.excludedProductIds}
              onChange={(v) => patch("excludedProductIds", v)}
              fetchFn={fetchProducts}
              placeholder="Search products to exclude..."
            />
          </div>

          <hr className="border-border" />

          {/* Flags Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <input
                id="coupon-first-order"
                type="checkbox"
                checked={form.firstOrderOnly}
                onChange={(e) => patch("firstOrderOnly", e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <Label htmlFor="coupon-first-order" className="text-xs cursor-pointer">First Order Only</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="coupon-show-banner"
                type="checkbox"
                checked={form.showOnBanner}
                onChange={(e) => patch("showOnBanner", e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <Label htmlFor="coupon-show-banner" className="text-xs cursor-pointer">Show on Banner</Label>
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
            ) : isEdit ? "Save Changes" : "Create Coupon"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
