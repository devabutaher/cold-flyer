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
import { useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponFormSchema } from "@/validations";

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

const CATEGORIES = [
  "Air Conditioners", "Heaters", "Ventilation", "Refrigeration", "Parts & Accessories",
];

const BRANDS = [
  "Samsung", "LG", "Daikin", "Gree", "General", "Mitsubishi", "Panasonic", "Sharp", "Whirlpool", "Hitachi",
];

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
  const [fromOpen, setFromOpen] = useState(false);
  const [untilOpen, setUntilOpen] = useState(false);

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

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: getInitial(),
    resolver: zodResolver(couponFormSchema),
    mode: "onTouched",
  });

  const discountType = watch("discountType");
  const applicableTo = watch("applicableTo");

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) reset();
    if (controlledOnOpenChange) {
      controlledOnOpenChange(nextOpen);
    } else {
      setInternalOpen(nextOpen);
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

  const onSubmit = (formData) => {
    mutation.mutate({
      code: formData.code,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      ...(formData.discountType === "percentage" && formData.maxDiscount ? { maxDiscount: Number(formData.maxDiscount) } : {}),
      minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : 0,
      ...(formData.maxUsage ? { maxUsage: Number(formData.maxUsage) } : {}),
      validFrom: new Date(formData.validFrom),
      validUntil: new Date(formData.validUntil),
      applicableTo: formData.applicableTo,
      ...(formData.applicableTo === "products" ? { productIds: formData.productIds.map((p) => p._id || p) } : {}),
      ...(formData.applicableTo === "services" ? { serviceIds: formData.serviceIds.map((s) => s._id || s) } : {}),
      ...(formData.applicableTo === "categories" ? { categoryIds: formData.categoryIds } : {}),
      ...(formData.applicableTo === "brands" ? { brandIds: formData.brandIds } : {}),
      firstOrderOnly: formData.firstOrderOnly,
      ...(formData.minItemCount ? { minItemCount: Number(formData.minItemCount) } : {}),
      showOnBanner: formData.showOnBanner,
      ...(formData.excludedProductIds.length > 0 ? { excludedProductIds: formData.excludedProductIds.map((p) => p._id || p) } : {}),
      ...(formData.excludedCategoryIds.length > 0 ? { excludedCategoryIds: formData.excludedCategoryIds } : {}),
    });
  };

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
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <Input id="coupon-code" {...field} placeholder="SUMMER20" onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                )}
              />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-type">Discount Type</Label>
              <Controller
                name="discountType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="coupon-type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed (৳)</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Row 2: Value + Min Order */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-value">{discountType === "free_shipping" ? "Value" : "Value *"}</Label>
              {discountType === "free_shipping" ? (
                <Input id="coupon-value" value="—" disabled className="text-muted-foreground" />
              ) : (
                <Controller
                  name="discountValue"
                  control={control}
                  render={({ field }) => (
                    <Input id="coupon-value" type="number" {...field} placeholder={discountType === "percentage" ? "20" : "500"} />
                  )}
                />
              )}
              {errors.discountValue && <p className="text-xs text-destructive">{errors.discountValue.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="coupon-min-order">Min. Order</Label>
              <Controller
                name="minOrderValue"
                control={control}
                render={({ field }) => (
                  <Input id="coupon-min-order" type="number" {...field} placeholder="0" />
                )}
              />
            </div>
          </div>

          {/* Row 3: Max Discount + Max Usage */}
          <div className="grid grid-cols-2 gap-4">
            {discountType === "percentage" ? (
              <div className="space-y-2">
                <Label htmlFor="coupon-max-discount">Max Discount (cap)</Label>
                <Controller
                  name="maxDiscount"
                  control={control}
                  render={({ field }) => (
                    <Input id="coupon-max-discount" type="number" {...field} placeholder="Uncapped" />
                  )}
                />
              </div>
            ) : <div />}
            <div className="space-y-2">
              <Label htmlFor="coupon-usage">Max Usage</Label>
              <Controller
                name="maxUsage"
                control={control}
                render={({ field }) => (
                  <Input id="coupon-usage" type="number" {...field} placeholder="Unlimited" />
                )}
              />
            </div>
          </div>

          {/* Row 4: Valid From + Valid Until */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valid From <span className="text-destructive">*</span></Label>
              <Controller
                name="validFrom"
                control={control}
                render={({ field }) => (
                  <Popover open={fromOpen} onOpenChange={setFromOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative cursor-pointer" role="button" tabIndex={0}>
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                        <Input readOnly value={field.value ? format(new Date(field.value + "T00:00:00"), "PP") : ""} placeholder="Pick a date" className="pl-10 cursor-pointer" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar mode="single" selected={field.value ? new Date(field.value + "T00:00:00") : undefined} onSelect={(date) => { field.onChange(date ? format(date, "yyyy-MM-dd") : ""); setFromOpen(false); }} />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.validFrom && <p className="text-xs text-destructive">{errors.validFrom.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Valid Until <span className="text-destructive">*</span></Label>
              <Controller
                name="validUntil"
                control={control}
                render={({ field }) => (
                  <Popover open={untilOpen} onOpenChange={setUntilOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative cursor-pointer" role="button" tabIndex={0}>
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none shrink-0" />
                        <Input readOnly value={field.value ? format(new Date(field.value + "T00:00:00"), "PP") : ""} placeholder="Pick a date" className="pl-10 cursor-pointer" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar mode="single" selected={field.value ? new Date(field.value + "T00:00:00") : undefined} onSelect={(date) => { field.onChange(date ? format(date, "yyyy-MM-dd") : ""); setUntilOpen(false); }} />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.validUntil && <p className="text-xs text-destructive">{errors.validUntil.message}</p>}
            </div>
          </div>

          <hr className="border-border" />

          {/* Scope Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Scope & Targeting</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Applicable To</Label>
                <Controller
                  name="applicableTo"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon-min-items">Min. Items</Label>
                <Controller
                  name="minItemCount"
                  control={control}
                  render={({ field }) => (
                    <Input id="coupon-min-items" type="number" {...field} placeholder="0 (no limit)" />
                  )}
                />
              </div>
            </div>

            {applicableTo === "products" && (
              <Controller
                name="productIds"
                control={control}
                render={({ field }) => (
                  <SearchableMultiSelect
                    label="Select Products"
                    value={field.value}
                    onChange={field.onChange}
                    fetchFn={fetchProducts}
                    placeholder="Search products..."
                  />
                )}
              />
            )}

            {applicableTo === "services" && (
              <Controller
                name="serviceIds"
                control={control}
                render={({ field }) => (
                  <SearchableMultiSelect
                    label="Select Services"
                    value={field.value}
                    onChange={field.onChange}
                    fetchFn={fetchServices}
                    placeholder="Search services..."
                  />
                )}
              />
            )}

            {applicableTo === "categories" && (
              <div className="space-y-2">
                <Label>Select Categories</Label>
                <Controller
                  name="categoryIds"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => {
                        const selected = field.value.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => field.onChange(selected ? field.value.filter((c) => c !== cat) : [...field.value, cat])}
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
                  )}
                />
              </div>
            )}

            {applicableTo === "brands" && (
              <div className="space-y-2">
                <Label>Select Brands</Label>
                <Controller
                  name="brandIds"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      {BRANDS.map((brand) => {
                        const selected = field.value.includes(brand);
                        return (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => field.onChange(selected ? field.value.filter((b) => b !== brand) : [...field.value, brand])}
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
                  )}
                />
              </div>
            )}

            <Controller
              name="excludedProductIds"
              control={control}
              render={({ field }) => (
                <SearchableMultiSelect
                  label="Excluded Products"
                  value={field.value}
                  onChange={field.onChange}
                  fetchFn={fetchProducts}
                  placeholder="Search products to exclude..."
                />
              )}
            />
          </div>

          <hr className="border-border" />

          {/* Flags Row */}
          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="firstOrderOnly"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <input
                    id="coupon-first-order"
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <Label htmlFor="coupon-first-order" className="text-xs cursor-pointer">First Order Only</Label>
                </div>
              )}
            />
            <Controller
              name="showOnBanner"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <input
                    id="coupon-show-banner"
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <Label htmlFor="coupon-show-banner" className="text-xs cursor-pointer">Show on Banner</Label>
                </div>
              )}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit(onSubmit)} disabled={mutation.isPending}>
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
