"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/dashboard/table/table-cells";
import { Percent, Tag, PlusIcon, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

async function fetcher(url, options) {
  const res = await fetch(url, { credentials: "include", ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxUsage, setMaxUsage] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const res = await fetcher("/api/admin/coupons");
      return res?.data?.coupons || res?.coupons || [];
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: (id) => fetcher(`/api/admin/coupons/${id}`, { method: "DELETE" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }); toast.success("Coupon deleted"); },
    onError: (err) => toast.error(err.message),
  });

  const createCoupon = useMutation({
    mutationFn: (data) => fetcher("/api/admin/coupons", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }); setShowCreate(false); resetForm(); toast.success("Coupon created"); },
    onError: (err) => toast.error(err.message),
  });

  const resetForm = () => { setCode(""); setDiscountType("percentage"); setDiscountValue(""); setMinOrderValue(""); setMaxUsage(""); setValidFrom(""); setValidUntil(""); };

  const handleCreate = async () => {
    if (!code || !discountValue || !validFrom || !validUntil) { toast.error("Fill required fields"); return; }
    createCoupon.mutate({
      code: code.toUpperCase(), discountType, discountValue: Number(discountValue),
      minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
      maxUsage: maxUsage ? Number(maxUsage) : undefined,
      validFrom: new Date(validFrom), validUntil: new Date(validUntil),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage discount coupons</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <PlusIcon size={14} className="mr-1" /> Add Coupon
        </Button>
      </div>

      <AlertDialog open={showCreate} onOpenChange={setShowCreate}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Create Coupon</AlertDialogTitle></AlertDialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Code *</Label><Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="SUMMER20" /></div>
              <div><Label>Type</Label><Select value={discountType} onValueChange={setDiscountType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed (৳)</SelectItem><SelectItem value="free_shipping">Free Shipping</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Value *</Label><Input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder="20" /></div>
              <div><Label>Min Order</Label><Input type="number" value={minOrderValue} onChange={e => setMinOrderValue(e.target.value)} placeholder="0" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Valid From *</Label><Input type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)} /></div>
              <div><Label>Valid Until *</Label><Input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} /></div>
            </div>
            <div><Label>Max Usage</Label><Input type="number" value={maxUsage} onChange={e => setMaxUsage(e.target.value)} placeholder="Unlimited" /></div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreate} disabled={createCoupon.isPending}>
              {createCoupon.isPending ? <><Loader2 size={14} className="animate-spin mr-2" />Creating...</> : "Create Coupon"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
      ) : coupons.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No coupons yet. Create your first coupon.</CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <Card key={c._id}>
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Percent className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-mono">{c.code}</CardTitle>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => { if (confirm("Delete this coupon?")) deleteCoupon.mutate(c._id); }}>
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                <p className="text-muted-foreground">{c.description || `${c.discountType === "percentage" ? `${c.discountValue}%` : `৳${c.discountValue}`} off`}</p>
                <p>Used: {c.usedCount || 0}{c.maxUsage ? ` / ${c.maxUsage}` : ""}</p>
                <p>Valid: {new Date(c.validFrom).toLocaleDateString()} - {new Date(c.validUntil).toLocaleDateString()}</p>
                <StatusBadge value={c.isActive ? "Active" : "Inactive"} map={{ Active: { label: "Active", className: "bg-green-500/10 text-green-600" }, Inactive: { label: "Inactive", className: "bg-destructive/10 text-destructive" }}} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
