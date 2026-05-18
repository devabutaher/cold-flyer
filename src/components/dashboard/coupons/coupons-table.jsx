"use client";

import { useMemo, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { buildCouponColumns } from "./coupons-columns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClient } from "@/lib/http-client";
import { Percent, PlusIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const mapRow = (c) => ({
  code: c.code,
  discount: c.discountType === "percentage" ? `${c.discountValue}%` : `৳${c.discountValue}`,
  type: c.discountType,
  usage: `${c.usedCount || 0}${c.maxUsage ? ` / ${c.maxUsage}` : ""}`,
  validFrom: c.validFrom ? new Date(c.validFrom).toLocaleDateString() : "—",
  validUntil: c.validUntil ? new Date(c.validUntil).toLocaleDateString() : "—",
  status: c.isActive ? "Active" : "Inactive",
});

const PDF_COLUMNS = [
  { header: "Code", accessorKey: "code", width: 1.5 },
  { header: "Discount", accessorKey: "discount", width: 1 },
  { header: "Type", accessorKey: "type", width: 1 },
  { header: "Usage", accessorKey: "usage", width: 1 },
  { header: "Valid From", accessorKey: "validFrom", width: 1.2 },
  { header: "Valid Until", accessorKey: "validUntil", width: 1.2 },
  { header: "Status", accessorKey: "status", width: 0.8 },
];

export default function CouponsTable() {
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
      const res = await getClient().get("/admin/coupons");
      return res.data?.data?.coupons || res.data?.coupons || [];
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: (id) => getClient().delete(`/admin/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon deleted");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const createCoupon = useMutation({
    mutationFn: (data) => getClient().post("/admin/coupons", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setShowCreate(false);
      resetForm();
      toast.success("Coupon created");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const resetForm = () => {
    setCode("");
    setDiscountType("percentage");
    setDiscountValue("");
    setMinOrderValue("");
    setMaxUsage("");
    setValidFrom("");
    setValidUntil("");
  };

  const handleCreate = async () => {
    if (!code || !discountValue || !validFrom || !validUntil) {
      toast.error("Fill required fields");
      return;
    }
    createCoupon.mutate({
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
      maxUsage: maxUsage ? Number(maxUsage) : undefined,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
    });
  };

  const handleDelete = useCallback(async (id) => {
    if (!confirm("Delete this coupon?")) return;
    deleteCoupon.mutate(id);
  }, [deleteCoupon]);

  const columns = useMemo(() => buildCouponColumns({ onDelete: handleDelete }), [handleDelete]);

  const typeOptions = ["percentage", "fixed", "free_shipping"];
  const statusOptions = ["true", "false"];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
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
          <AlertDialogHeader>
            <AlertDialogTitle>Create Coupon</AlertDialogTitle>
            <AlertDialogDescription>Add a new discount coupon for customers to use at checkout.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Code *</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SUMMER20" />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Value *</Label>
                <Input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="20"
                />
              </div>
              <div>
                <Label>Min Order</Label>
                <Input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Valid From *</Label>
                <Input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
              </div>
              <div>
                <Label>Valid Until *</Label>
                <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Max Usage</Label>
              <Input
                type="number"
                value={maxUsage}
                onChange={(e) => setMaxUsage(e.target.value)}
                placeholder="Unlimited"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreate} disabled={createCoupon.isPending}>
              {createCoupon.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Coupon"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DataTable
        columns={columns}
        data={coupons}
        loading={isLoading}
        rowCount="coupons"
        defaultSort={[{ id: "code", desc: false }]}
        emptyMessage="No coupons yet. Create your first coupon."
        emptyIcon={<Percent size={40} />}
        toolbar={(table) => (
          <TableToolbar
            table={table}
            searchPlaceholder="Search coupons..."
            selectedLabel="coupons"
            filters={[
              { columnId: "discountType", placeholder: "All Types", allLabel: "All Types", options: typeOptions },
              { columnId: "isActive", placeholder: "All Statuses", allLabel: "All Statuses", options: statusOptions },
            ]}
            actions={
              <ExportMenu
                table={table}
                filename="coupons"
                mapRow={mapRow}
                pdfTitle="ColdFlyer — Coupons Report"
                pdfColumns={PDF_COLUMNS}
              />
            }
          />
        )}
      />
    </>
  );
}
